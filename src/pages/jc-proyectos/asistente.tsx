// Asistente de IA: Jorge pregunta en sus palabras y la respuesta sale de los datos de la obra.
// En la demo las respuestas se arman con reglas sobre los mismos datos que muestran las otras pantallas.
import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { C, Tarjeta, Titulo, estiloInput, Boton } from './ui';
import {
  INSUMOS, FRENTES, FIN_PROGRAMADO, calcularNomina, diasAtraso, insumo, lineaDe, nombreFrente, money, num, pct, fechaCorta,
  EstadoLinea, FrenteId, ResumenPrograma, Requisicion, Trabajador, Actividad, DIAS,
} from './datos';

interface Datos { reqs: Requisicion[]; presupuesto: EstadoLinea[]; programa: ResumenPrograma; cuadrilla: Trabajador[]; actividades: Actividad[]; }
interface Mensaje { de: 'jorge' | 'ia'; texto: string; }

const SUGERENCIAS = [
  '¿Cuánto cemento me queda para la Villa 2?',
  '¿Quién faltó esta semana?',
  '¿Vamos atrasados?',
  '¿Qué pedidos tengo por aprobar?',
  '¿Qué falta por llegar a la obra?',
  '¿Cuánto llevo en materiales?',
];

const CLAVES_INSUMO: Record<string, string[]> = {
  cem: ['cemento'], var: ['varilla', 'acero', 'fierro'], blk: ['block', 'bloque', 'blocks'], are: ['arena'], gra: ['grava'],
  alm: ['alambre'], mal: ['malla'], pvc: ['pvc', 'tubo', 'tuberia'], cab: ['cable'], imp: ['impermeabilizante', 'imper'],
};

function limpiar(t: string): string { return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

function frenteDe(t: string): FrenteId | null {
  if (/villa\s*(1|uno)\b/.test(t)) return 'v1';
  if (/villa\s*(2|dos)\b/.test(t)) return 'v2';
  if (/comun|alberca|club/.test(t)) return 'ac';
  return null;
}

export function responder(pregunta: string, d: Datos): string {
  const t = limpiar(pregunta);
  const insumoId = Object.entries(CLAVES_INSUMO).find(([, ks]) => ks.some(k => t.includes(k)))?.[0];
  const frente = frenteDe(t);

  if (/falt(o|aron|as)|asisten|quien(es)? (no )?vin/.test(t) && !insumoId) {
    const con = d.cuadrilla.filter(x => x.estado !== 'baja' && x.asistencia.includes('F'));
    if (!con.length) return 'Esta semana no ha faltado nadie.';
    return `Esta semana faltaron ${con.length} personas:\n` + con.map(x => `• ${x.nombre}: ${x.asistencia.map((m, i) => m === 'F' ? DIAS[i] : null).filter(Boolean).join(', ')} (se le descuentan ${money(calcularNomina(x).descuentoFaltas + calcularNomina(x).pasaProxima)})`).join('\n')
      + '\nLas faltas de viernes y sábado se descuentan la próxima semana.';
  }
  if (insumoId) {
    const ins = insumo(insumoId);
    const frentes = frente ? [frente] : FRENTES.map(f => f.id);
    const partes = frentes.map(f => {
      const l = lineaDe(d.presupuesto, insumoId, f);
      return `• ${nombreFrente(f)}: quedan ${num(l.disponible)} de ${num(l.presupuestado)} ${ins.unidad} (${pct(l.usoPct)} usado${l.porRecibir > 0 ? `, ${num(l.porRecibir)} en camino` : ''}${l.porAprobar > 0 ? `, ${num(l.porAprobar)} esperando su aprobación` : ''}).`;
    });
    const extra = frentes.map(f => lineaDe(d.presupuesto, insumoId, f)).find(l => l.porAprobar > l.disponible);
    return `${ins.nombre}:\n${partes.join('\n')}` + (extra ? `\nOjo: lo que está por aprobar para ${nombreFrente(extra.frente)} se pasa del presupuesto.` : '');
  }
  if (/atras|programa|entrega|termin|avance|tiempo/.test(t)) {
    const p = d.programa;
    if (p.atraso === 0) return `Vamos a tiempo: ${pct(p.real)} de avance contra ${pct(p.programado)} programado. Entrega el ${fechaCorta(FIN_PROGRAMADO)}.`;
    const top = d.actividades.filter(a => diasAtraso(a) > 5).sort((a, b) => diasAtraso(b) - diasAtraso(a)).slice(0, 3);
    return `Sí, un poco. Llevamos ${pct(p.real)} de avance contra ${pct(p.programado)} programado. La entrega se estima para el ${fechaCorta(p.finEstimado)}, ${p.atraso} días después de lo programado.\nLo que más atrasa:\n` + top.map(a => `• ${a.nombre} de ${nombreFrente(a.frente)}: ${a.real} %, ${diasAtraso(a)} días de atraso`).join('\n');
  }
  if (/aprob|pendiente|autoriz/.test(t)) {
    const pend = d.reqs.filter(r => r.estado === 'por-aprobar');
    if (!pend.length) return 'No tiene pedidos por aprobar.';
    return `Tiene ${pend.length} pedido${pend.length === 1 ? '' : 's'} por aprobar:\n` + pend.map(r => `• ${r.id} (${r.nota || 'sin nota'}): ${r.items.map(it => `${num(it.cantidad)} ${insumo(it.insumoId).unidad} de ${insumo(it.insumoId).nombre} para ${nombreFrente(it.frente)}${it.cantidad > lineaDe(d.presupuesto, it.insumoId, it.frente).disponible ? ' ⚠ se pasa del presupuesto' : ''}`).join('; ')}`).join('\n');
  }
  if (/lleg|camino|falta|faltante|proveedor|entrega/.test(t)) {
    const pend = d.reqs.filter(r => r.estado === 'en-camino' || r.estado === 'incompleta');
    if (!pend.length) return 'No hay material en camino.';
    return 'Esto falta por llegar:\n' + pend.map(r => `• ${r.oc} de ${r.proveedor}: ${r.items.filter(it => it.recibido < it.cantidad).map(it => `${num(it.cantidad - it.recibido)} ${insumo(it.insumoId).unidad} de ${insumo(it.insumoId).nombre}`).join(', ')}${r.estado === 'incompleta' ? ' (entrega incompleta)' : ` (llega el ${fechaCorta(r.fechaEntrega!)})`}`).join('\n');
  }
  if (/gast|presupuesto|dinero|llevo|material|cuanto/.test(t)) {
    const total = d.presupuesto.reduce((s, l) => s + l.montoPresupuesto, 0);
    const ej = d.presupuesto.reduce((s, l) => s + l.ejercido, 0);
    const porFrente = FRENTES.map(f => {
      const ls = d.presupuesto.filter(l => l.frente === f.id);
      const a = ls.reduce((s, l) => s + l.ejercido, 0), b = ls.reduce((s, l) => s + l.montoPresupuesto, 0);
      return `• ${f.nombre}: ${money(a)} de ${money(b)} (${pct((a / b) * 100)})`;
    });
    return `En materiales ha llegado a la obra ${money(ej)} de un presupuesto de ${money(total)} (${pct((ej / total) * 100)}).\n${porFrente.join('\n')}`;
  }
  return `En la plataforma real la IA responde cualquier pregunta con los datos de su obra. En esta demo pruebe con material (${INSUMOS.slice(0, 3).map(i => i.nombre.split(' ')[0].toLowerCase()).join(', ')}…), faltas, atraso, pedidos por aprobar o lo que falta por llegar.`;
}

export function SeccionAsistente(props: Datos) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([{ de: 'ia', texto: 'Hola, Jorge. Pregúnteme lo que quiera de la obra: materiales, gente, avance o pedidos. Respondo con los datos que van entrando de la obra y de la oficina.' }]);
  const [texto, setTexto] = useState('');
  const [pensando, setPensando] = useState(false);
  const fin = useRef<HTMLDivElement>(null);
  useEffect(() => { fin.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [mensajes, pensando]);

  const preguntar = (p: string) => {
    if (!p.trim() || pensando) return;
    setMensajes(m => [...m, { de: 'jorge', texto: p }]);
    setTexto(''); setPensando(true);
    setTimeout(() => { setMensajes(m => [...m, { de: 'ia', texto: responder(p, props) }]); setPensando(false); }, 700);
  };

  return (
    <div>
      <Titulo titulo="Asistente de la obra" sub="Pregunte como le preguntaría a su residente. La IA contesta con los datos de la plataforma, sin que nadie tenga que armar un reporte." />
      <Tarjeta style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 460, overflowY: 'auto', padding: 4 }}>
          {mensajes.map((m, i) => (
            <div key={i} style={{
              alignSelf: m.de === 'jorge' ? 'flex-end' : 'flex-start', maxWidth: '85%', whiteSpace: 'pre-line',
              background: m.de === 'jorge' ? C.navy : C.surface, color: m.de === 'jorge' ? '#fff' : C.ink,
              borderRadius: 14, padding: '10px 14px', fontSize: 14, border: m.de === 'ia' ? `1px solid ${C.line}` : 'none',
            }}>{m.de === 'ia' && <strong style={{ color: C.tealDark, display: 'block', fontSize: 12, marginBottom: 2 }}>✦ Asistente</strong>}{m.texto}</div>
          ))}
          {pensando && <div style={{ alignSelf: 'flex-start', color: C.muted, fontSize: 13 }}>Revisando los datos de la obra…</div>}
          <div ref={fin} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SUGERENCIAS.map(s => (
            <button key={s} type="button" onClick={() => preguntar(s)} style={{ border: `1px solid ${C.lineStrong}`, background: C.paper, borderRadius: 20, padding: '6px 12px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: C.ink, minHeight: 34 }}>{s}</button>
          ))}
        </div>
        <form onSubmit={e => { e.preventDefault(); preguntar(texto); }} style={{ display: 'flex', gap: 8 }}>
          <label htmlFor="pregunta" style={{ position: 'absolute', left: -9999 }}>Pregunta</label>
          <input id="pregunta" value={texto} onChange={e => setTexto(e.target.value)} placeholder="Ej.: ¿cuánta varilla queda para la villa 1?" style={{ ...estiloInput, flex: 1 }} />
          <Boton onClick={() => preguntar(texto)} disabled={!texto.trim() || pensando}><Send size={16} /></Boton>
        </form>
      </Tarjeta>
    </div>
  );
}
