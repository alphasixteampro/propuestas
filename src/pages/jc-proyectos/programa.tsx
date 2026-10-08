// Programa de obra: las actividades de Project con el avance real que reporta la obra cada día, la fecha
// de entrega que se recalcula sola y el reporte ejecutivo de dos hojas para el dueño del proyecto.
import React, { useState } from 'react';
import { Upload, FileText, Download, Loader2 } from 'lucide-react';
import { C, Chip, Tarjeta, Titulo, Boton, Modal, Tabla, celda, celdaDer, NotaIA, Barra } from './ui';
import {
  HOY, OBRA, FIN_PROGRAMADO, FRENTES, diasAtraso, programadoHoy, diffDias, sumarDias, fechaCorta, nombreFrente, money, pct,
  Actividad, EstadoLinea, ReporteDiario, ResumenPrograma, insumo,
} from './datos';
import { Persona } from './estado';
import { usePDF } from '../../hooks/usePDF';
import { alertasConsumo } from './presupuesto';

const INICIO_GANTT = '2026-06-01';
const FIN_GANTT = '2027-04-01';
const MESES_GANTT = ['jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic', 'ene', 'feb', 'mar'];

function Gantt({ actividades }: { actividades: Actividad[] }) {
  const total = diffDias(INICIO_GANTT, FIN_GANTT);
  const x = (f: string) => (diffDias(INICIO_GANTT, f) / total) * 100;
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: 760 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', fontSize: 12, color: C.muted, fontWeight: 700 }}>
          <span />
          <div style={{ position: 'relative', height: 20 }}>
            {MESES_GANTT.map((m, i) => <span key={m} style={{ position: 'absolute', left: `${(i / MESES_GANTT.length) * 100}%` }}>{m}</span>)}
          </div>
        </div>
        {FRENTES.map(f => (
          <React.Fragment key={f.id}>
            <p style={{ margin: '10px 0 4px', fontSize: 12, fontWeight: 800, color: C.navy, textTransform: 'uppercase', letterSpacing: 0.5 }}>{f.nombre}</p>
            {actividades.filter(a => a.frente === f.id).map(a => {
              const atraso = diasAtraso(a);
              return (
                <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '220px 1fr', alignItems: 'center', minHeight: 30 }}>
                  <span style={{ fontSize: 13, paddingRight: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.nombre}</span>
                  <div style={{ position: 'relative', height: 22, background: `repeating-linear-gradient(90deg, transparent 0, transparent calc(10% - 1px), ${C.line} calc(10% - 1px), ${C.line} 10%)` }}>
                    <div title={`${fechaCorta(a.inicio)} a ${fechaCorta(a.fin)} · real ${a.real} %`} style={{
                      position: 'absolute', top: 4, height: 14, left: `${x(a.inicio)}%`, width: `${x(a.fin) - x(a.inicio)}%`,
                      background: C.blueSoft, border: `1px solid ${atraso > 5 ? C.red : C.blue}`, borderRadius: 4, overflow: 'hidden',
                    }}>
                      <div style={{ width: `${a.real}%`, height: '100%', background: atraso > 5 ? C.red : C.tealDark }} />
                    </div>
                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${x(HOY)}%`, width: 2, background: C.amber }} />
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: C.muted, marginTop: 10, flexWrap: 'wrap' }}>
          <span><i style={{ display: 'inline-block', width: 12, height: 10, background: C.blueSoft, border: `1px solid ${C.blue}`, marginRight: 4 }} />Programado en Project</span>
          <span><i style={{ display: 'inline-block', width: 12, height: 10, background: C.tealDark, marginRight: 4 }} />Avance real reportado</span>
          <span><i style={{ display: 'inline-block', width: 12, height: 10, background: C.red, marginRight: 4 }} />Va atrasada más de 5 días</span>
          <span><i style={{ display: 'inline-block', width: 2, height: 10, background: C.amber, marginRight: 4 }} />Hoy</span>
        </div>
      </div>
    </div>
  );
}

export function SeccionPrograma({ actividades, reportes, programa, presupuesto, nominaSemana, pedidosPorAprobar, persona, avisar }: {
  actividades: Actividad[]; reportes: ReporteDiario[]; programa: ResumenPrograma; presupuesto: EstadoLinea[];
  nominaSemana: number; pedidosPorAprobar: number; persona: Persona; avisar: (m: string) => void;
}) {
  const [reporte, setReporte] = useState(false);
  const [generando, setGenerando] = useState(false);
  const atrasadas = actividades.filter(a => diasAtraso(a) > 5).sort((a, b) => diasAtraso(b) - diasAtraso(a));

  return (
    <div>
      <Titulo titulo="Programa y avance de obra" sub="Las actividades vienen de su Project. Cada reporte diario de la obra mueve el avance real y la fecha de entrega se recalcula sola.">
        <Boton variante="secundario" onClick={() => avisar('En la plataforma real se sube el archivo de Project y las actividades se actualizan solas.')}><Upload size={16} /> Cargar desde Project</Boton>
        {persona.id !== 'residente' && <Boton disabled={generando} onClick={() => { setGenerando(true); setTimeout(() => { setGenerando(false); setReporte(true); }, 1200); }}>
          {generando ? <><Loader2 size={16} className="animate-spin" /> La IA está redactando…</> : <><FileText size={16} /> Reporte ejecutivo con IA</>}
        </Boton>}
      </Titulo>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 14 }}>
        <Tarjeta><p style={{ margin: 0, fontSize: 13, color: C.muted, fontWeight: 700 }}>Avance real</p><p style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 800 }}>{pct(programa.real)}</p><p style={{ margin: '2px 0 0', fontSize: 13, color: C.muted }}>Programado a hoy: {pct(programa.programado)}</p></Tarjeta>
        <Tarjeta><p style={{ margin: 0, fontSize: 13, color: C.muted, fontWeight: 700 }}>Entrega programada</p><p style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 800 }}>{fechaCorta(FIN_PROGRAMADO)}</p></Tarjeta>
        <Tarjeta style={{ borderColor: programa.atraso > 0 ? C.red : C.line }}><p style={{ margin: 0, fontSize: 13, color: C.muted, fontWeight: 700 }}>Entrega estimada hoy</p><p style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 800, color: programa.atraso > 0 ? C.red : C.green }}>{fechaCorta(programa.finEstimado)}</p><p style={{ margin: '2px 0 0', fontSize: 13, color: C.muted }}>{programa.atraso > 0 ? `${programa.atraso} días después de lo programado` : 'A tiempo'}</p></Tarjeta>
      </div>

      {programa.masAtrasada && (
        <div style={{ marginBottom: 14 }}>
          <NotaIA titulo="Por qué se mueve la fecha">
            {nombreFrente(programa.masAtrasada.frente)} · {programa.masAtrasada.nombre.toLowerCase()} debería ir en {Math.round(programadoHoy(programa.masAtrasada))} % y va en {programa.masAtrasada.real} %. Eso equivale a {programa.atraso} días de atraso y es lo que más empuja la entrega.
            {atrasadas.length > 1 && ` También van atrasadas: ${atrasadas.slice(1).map(a => `${a.nombre.toLowerCase()} de ${nombreFrente(a.frente)} (${diasAtraso(a)} días)`).join(', ')}.`}
            {' '}Pruebe reportar avance desde "Celular del residente" y vea cómo cambia la fecha.
          </NotaIA>
        </div>
      )}

      <Tarjeta titulo="Programa de obra"><Gantt actividades={actividades} /></Tarjeta>

      <Tarjeta titulo="Reportes diarios de la obra" style={{ marginTop: 14 }}>
        <Tabla minWidth={620} columnas={[{ texto: 'Fecha' }, { texto: 'Actividad' }, { texto: 'Avance', derecha: true }, { texto: 'Gente', derecha: true }, { texto: 'Nota' }]}>
          {reportes.map((r, i) => {
            const a = actividades.find(x => x.id === r.actividadId)!;
            return (
              <tr key={i}>
                <td style={celda}>{fechaCorta(r.fecha)}</td>
                <td style={celda}>{a.nombre} · {nombreFrente(a.frente)}</td>
                <td style={celdaDer}>{r.antes} % → <strong>{r.despues} %</strong></td>
                <td style={celdaDer}>{r.personas}</td>
                <td style={celda}>{r.nota || '—'}</td>
              </tr>
            );
          })}
        </Tabla>
      </Tarjeta>

      {reporte && (
        <Modal titulo="Reporte ejecutivo para el dueño del proyecto" subtitulo="Redactado por la IA con los datos de la obra. Se revisa y se descarga en PDF." onCerrar={() => setReporte(false)} ancho={860}>
          <ReporteEjecutivo actividades={actividades} programa={programa} presupuesto={presupuesto} nominaSemana={nominaSemana} pedidosPorAprobar={pedidosPorAprobar} />
        </Modal>
      )}
    </div>
  );
}

function ReporteEjecutivo({ actividades, programa, presupuesto, nominaSemana, pedidosPorAprobar }: {
  actividades: Actividad[]; programa: ResumenPrograma; presupuesto: EstadoLinea[]; nominaSemana: number; pedidosPorAprobar: number;
}) {
  const { exportPDF, generating } = usePDF();
  const montoP = presupuesto.reduce((s, l) => s + l.montoPresupuesto, 0);
  const ejercido = presupuesto.reduce((s, l) => s + l.ejercido, 0);
  const camino = presupuesto.reduce((s, l) => s + l.porRecibir * insumo(l.insumoId).precio, 0);
  const proximas = actividades.filter(a => a.real < 100 && diffDias(HOY, a.inicio) <= 14 && diffDias(a.fin, HOY) <= 0).slice(0, 6);
  const riesgos = [
    ...(programa.masAtrasada ? [`${programa.masAtrasada.nombre} de ${nombreFrente(programa.masAtrasada.frente)} va ${programa.atraso} días atrasada; es lo que hoy define la fecha de entrega.`] : []),
    ...alertasConsumo(presupuesto, programa).slice(0, 2),
  ];
  const h2: React.CSSProperties = { fontFamily: 'Poppins, sans-serif', fontSize: 15, fontWeight: 700, color: C.navy, margin: '18px 0 8px', borderBottom: `2px solid ${C.teal}`, paddingBottom: 4 };

  return (
    <div>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <Boton disabled={generating} onClick={() => exportPDF({ filename: 'reporte-ejecutivo-jc-proyectos.pdf', elementId: 'reporte-ejecutivo' })}>
          {generating ? <><Loader2 size={16} className="animate-spin" /> Generando…</> : <><Download size={16} /> Descargar PDF</>}
        </Boton>
      </div>
      <div id="reporte-ejecutivo" style={{ background: '#fff', color: C.ink, padding: 28, border: `1px solid ${C.line}`, borderRadius: 8, fontSize: 14, lineHeight: 1.55 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: C.muted, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Reporte ejecutivo semanal</p>
            <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 22, margin: '4px 0 0', color: C.navy }}>{OBRA}</h1>
            <p style={{ margin: '2px 0 0', color: C.muted }}>Semana del 5 al 9 de octubre de 2026 · Para: dueño del proyecto</p>
          </div>
          <LogoJC alto={40} />
        </div>

        <h2 style={h2}>Resumen</h2>
        <p style={{ margin: 0 }}>
          La obra lleva <strong>{pct(programa.real)}</strong> de avance contra {pct(programa.programado)} que marcaba el programa a esta fecha.
          {programa.atraso > 0
            ? <> Con el ritmo actual, la entrega se estima para el <strong>{fechaCorta(programa.finEstimado)}</strong>, {programa.atraso} días después de lo programado ({fechaCorta(FIN_PROGRAMADO)}).</>
            : <> La entrega sigue en la fecha programada: <strong>{fechaCorta(FIN_PROGRAMADO)}</strong>.</>}
          {' '}En materiales se ha recibido el {pct((ejercido / montoP) * 100)} del presupuesto.
        </p>

        <h2 style={h2}>Avance por frente</h2>
        <Tabla minWidth={460} columnas={[{ texto: 'Frente' }, { texto: 'Programado', derecha: true }, { texto: 'Real', derecha: true }, { texto: 'Situación' }]}>
          {programa.porFrente.map(f => {
            const dif = f.real - f.programado;
            return (
              <tr key={f.frente}>
                <td style={celda}>{nombreFrente(f.frente)}</td>
                <td style={celdaDer}>{pct(f.programado)}</td>
                <td style={celdaDer}><strong>{pct(f.real)}</strong></td>
                <td style={celda}>{dif >= -2 ? <Chip tono="green" texto="Al día" /> : dif >= -8 ? <Chip tono="amber" texto="Ligeramente atrasado" /> : <Chip tono="red" texto="Atrasado" />}</td>
              </tr>
            );
          })}
        </Tabla>

        <h2 style={h2}>Dinero</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
          {[['Presupuesto de materiales', money(montoP)], ['Recibido en obra', money(ejercido)], ['Comprado, en camino', money(camino)], ['Nómina de la semana', money(nominaSemana)]].map(([t, v]) => (
            <div key={t} style={{ background: C.surface, borderRadius: 8, padding: 10 }}>
              <p style={{ margin: 0, fontSize: 12, color: C.muted, fontWeight: 700 }}>{t}</p>
              <p style={{ margin: '2px 0 0', fontSize: 17, fontWeight: 800 }}>{v}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10 }}><Barra valor={ejercido + camino} tope={montoP} color={C.tealDark} alto={10} /></div>

        <h2 style={h2}>Riesgos y alertas</h2>
        {riesgos.length ? <ul style={{ margin: 0, paddingLeft: 18 }}>{riesgos.map((r, i) => <li key={i}>{r}</li>)}</ul> : <p style={{ margin: 0 }}>Sin alertas esta semana.</p>}

        <h2 style={h2}>Próximas dos semanas</h2>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {proximas.map(a => <li key={a.id}>{a.nombre} · {nombreFrente(a.frente)}: hoy en {a.real} %, termina el {fechaCorta(sumarDias(a.fin, Math.max(0, diasAtraso(a))))}.</li>)}
        </ul>

        <h2 style={h2}>Decisiones que se necesitan</h2>
        <p style={{ margin: 0 }}>
          {pedidosPorAprobar > 0
            ? `Ninguna del dueño del proyecto. Internamente hay ${pedidosPorAprobar} pedido${pedidosPorAprobar === 1 ? '' : 's'} de material por aprobar.`
            : 'Ninguna esta semana.'}
        </p>
        <p style={{ margin: '22px 0 0', fontSize: 12, color: C.muted }}>JC Proyectos · Generado el {fechaCorta(HOY)} de 2026 con los datos de la plataforma.</p>
      </div>
    </div>
  );
}

// Logo de JC Proyectos: usa el archivo en public/ y, si aún no está, muestra el nombre.
export function LogoJC({ alto = 32, claro = false }: { alto?: number; claro?: boolean }) {
  const [error, setError] = useState(false);
  if (error) {
    return <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: alto * 0.5, color: claro ? '#fff' : C.navy, letterSpacing: 0.3 }}>JC Proyectos</span>;
  }
  return <img src="/jc-proyectos-logo.png" alt="JC Proyectos" onError={() => setError(true)} style={{ height: alto, width: 'auto', objectFit: 'contain' }} />;
}
