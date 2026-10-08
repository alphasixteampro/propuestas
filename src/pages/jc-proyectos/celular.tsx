// Celular del residente: pedir material, recibir, pasar lista y reportar avance. Funciona sin señal:
// lo que se captura se guarda en el teléfono y se envía solo cuando vuelve la conexión.
import React, { useState } from 'react';
import { Wifi, WifiOff, Package, Truck, Users, TrendingUp, ChevronLeft, CloudUpload } from 'lucide-react';
import { C, Boton, Campo, estiloInput, Titulo, Tarjeta, NotaIA, Chip } from './ui';
import { FormPedido, FormRecepcion } from './materiales';
import { DIA_HOY, HOY, insumo, nombreFrente, num, fechaCorta, EstadoLinea, Requisicion, Trabajador, Actividad } from './datos';
import { Accion, describirAccion } from './estado';

type Pantalla = 'pedir' | 'recibir' | 'lista' | 'avance';

export function SeccionCampo({ reqs, cuadrilla, actividades, presupuesto, enLinea, onSenal, cola, enviar }: {
  reqs: Requisicion[]; cuadrilla: Trabajador[]; actividades: Actividad[]; presupuesto: EstadoLinea[];
  enLinea: boolean; onSenal: (v: boolean) => void; cola: Accion[]; enviar: (a: Accion, ok: string) => void;
}) {
  const [pantalla, setPantalla] = useState<Pantalla>('pedir');
  return (
    <div>
      <Titulo titulo="Celular del residente" sub="Así se usa en obra. Apague la señal para ver cómo sigue funcionando: lo capturado se guarda en el teléfono y se envía solo al volver la conexión." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div data-tour="celular" style={{ width: '100%', maxWidth: 360, borderRadius: 36 }}><Telefono enLinea={enLinea} cola={cola.length}>
            {pantalla === 'pedir' && <PantallaPedir presupuesto={presupuesto} enviar={enviar} />}
            {pantalla === 'recibir' && <PantallaRecibir reqs={reqs} enviar={enviar} />}
            {pantalla === 'lista' && <PantallaLista cuadrilla={cuadrilla} enviar={enviar} />}
            {pantalla === 'avance' && <PantallaAvance actividades={actividades} enviar={enviar} />}
            <nav style={{ position: 'sticky', bottom: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: '#fff', borderTop: `1px solid ${C.line}`, marginTop: 'auto' }}>
              {([['pedir', 'Pedir', Package], ['recibir', 'Recibir', Truck], ['lista', 'Lista', Users], ['avance', 'Avance', TrendingUp]] as const).map(([id, texto, Icono]) => (
                <button key={id} type="button" onClick={() => setPantalla(id)} style={{
                  border: 'none', background: 'none', padding: '8px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  color: pantalla === id ? C.tealDark : C.muted, fontWeight: 700, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', minHeight: 48,
                }}><Icono size={18} />{texto}</button>
              ))}
            </nav>
          </Telefono></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Tarjeta titulo="Señal en la obra" tour="senal">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Boton variante={enLinea ? 'primario' : 'secundario'} onClick={() => onSenal(true)}><Wifi size={16} /> Con señal</Boton>
              <Boton variante={!enLinea ? 'primario' : 'secundario'} onClick={() => onSenal(false)}><WifiOff size={16} /> Sin señal</Boton>
            </div>
            <p style={{ fontSize: 13, color: C.muted, margin: '10px 0 0' }}>
              {enLinea ? 'Todo lo que capture el residente llega al momento a la oficina.' : 'Sin señal: el residente sigue trabajando normal. Nada se pierde.'}
            </p>
            {cola.length > 0 && (
              <div style={{ marginTop: 10, background: C.amberSoft, borderRadius: 8, padding: 10 }}>
                <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 13, color: C.amber }}>Guardado en el teléfono, esperando señal ({cola.length})</p>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>{cola.map((a, i) => <li key={i}>{describirAccion(a)}</li>)}</ul>
              </div>
            )}
          </Tarjeta>
          <NotaIA titulo="Por qué así">
            En la reunión nos contó que quitaron el reloj checador por falta de internet. Aquí el pase de lista, los pedidos y el avance se capturan igual con o sin señal, y la oficina los recibe en cuanto el teléfono se conecta.
          </NotaIA>
          <Tarjeta titulo="También por WhatsApp">
            <p style={{ margin: 0, fontSize: 14, color: C.muted }}>Si el residente prefiere, puede pedir material por WhatsApp con una nota de voz ("necesito 10 bultos de cemento para la villa uno") y la IA lo convierte en pedido. Se puede sumar como módulo.</p>
          </Tarjeta>
        </div>
      </div>
    </div>
  );
}

function Telefono({ enLinea, cola, children }: { enLinea: boolean; cola: number; children: React.ReactNode }) {
  return (
    <div style={{ width: '100%', maxWidth: 360, height: 700, border: '10px solid #111827', borderRadius: 36, background: C.surface, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(10,35,66,.25)' }}>
      <div style={{ background: C.navy, color: '#fff', padding: '10px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, flexShrink: 0 }}>
        <span style={{ fontWeight: 700 }}>9:41</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {cola > 0 && <span style={{ background: C.amber, borderRadius: 99, padding: '1px 7px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><CloudUpload size={12} /> {cola}</span>}
          {enLinea ? <Wifi size={14} /> : <WifiOff size={14} color="#ffb4a8" />}
        </span>
      </div>
      <div style={{ background: C.navy, color: '#fff', padding: '4px 16px 12px', flexShrink: 0 }}>
        <p style={{ margin: 0, fontWeight: 800, fontFamily: 'Poppins, sans-serif' }}>JC Obra</p>
        <p style={{ margin: 0, fontSize: 12, color: '#b9c9dd' }}>Residencial Las Villas · {fechaCorta(HOY)}</p>
      </div>
      {!enLinea && <div style={{ background: C.amberSoft, color: C.amber, fontSize: 12, fontWeight: 700, padding: '6px 16px', flexShrink: 0 }}>Sin señal · se guarda en el teléfono</div>}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>{children}</div>
    </div>
  );
}

const cuerpo: React.CSSProperties = { padding: 14, display: 'flex', flexDirection: 'column', gap: 10 };
const h3: React.CSSProperties = { margin: 0, fontFamily: 'Poppins, sans-serif', fontSize: 16, fontWeight: 700 };

function PantallaPedir({ presupuesto, enviar }: { presupuesto: EstadoLinea[]; enviar: (a: Accion, ok: string) => void }) {
  return (
    <div style={cuerpo}>
      <p style={h3}>Pedir material</p>
      <FormPedido compacto presupuesto={presupuesto} onEnviar={(items, nota) => enviar({ tipo: 'crear-req', items, nota, solicitante: 'Residente de obra', origen: 'celular' }, 'Pedido enviado a Jorge para aprobar.')} />
    </div>
  );
}

function PantallaRecibir({ reqs, enviar }: { reqs: Requisicion[]; enviar: (a: Accion, ok: string) => void }) {
  const [sel, setSel] = useState<string | null>(null);
  const pendientes = reqs.filter(r => r.estado === 'en-camino' || r.estado === 'incompleta');
  const actual = pendientes.find(r => r.id === sel);
  if (actual) {
    return (
      <div style={cuerpo}>
        <button type="button" onClick={() => setSel(null)} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: C.tealDark, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontFamily: 'inherit', minHeight: 36 }}><ChevronLeft size={16} /> Volver</button>
        <p style={h3}>{actual.oc} · {actual.proveedor}</p>
        <FormRecepcion compacto key={actual.id} req={actual} onConfirmar={(cantidades, nota, conFoto) => {
          enviar({ tipo: 'recibir-req', id: actual.id, cantidades, nota, conFoto, por: 'Residente de obra' }, 'Recepción guardada y descontada del presupuesto.');
          setSel(null);
        }} />
      </div>
    );
  }
  return (
    <div style={cuerpo}>
      <p style={h3}>¿Qué llegó a la obra?</p>
      {pendientes.length === 0 && <p style={{ margin: 0, color: C.muted, fontSize: 14 }}>No hay entregas pendientes.</p>}
      {pendientes.map(r => (
        <button key={r.id} type="button" onClick={() => setSel(r.id)} style={{ textAlign: 'left', background: '#fff', border: `1px solid ${C.line}`, borderRadius: 10, padding: 12, cursor: 'pointer', fontFamily: 'inherit', color: C.ink }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}><strong style={{ fontSize: 14 }}>{r.oc}</strong>{r.estado === 'incompleta' ? <Chip tono="red" texto="Falta material" /> : <Chip tono="purple" texto={r.fechaEntrega === HOY ? 'Llega hoy' : fechaCorta(r.fechaEntrega!)} />}</div>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: C.muted }}>{r.proveedor}</p>
          <p style={{ margin: '2px 0 0', fontSize: 12 }}>{r.items.filter(it => it.recibido < it.cantidad).map(it => `${num(it.cantidad - it.recibido)} ${insumo(it.insumoId).unidad} de ${insumo(it.insumoId).nombre} (${nombreFrente(it.frente)})`).join(' · ')}</p>
        </button>
      ))}
    </div>
  );
}

function PantallaLista({ cuadrilla, enviar }: { cuadrilla: Trabajador[]; enviar: (a: Accion, ok: string) => void }) {
  const presentes = cuadrilla.filter(t => t.estado === 'activo' || t.estado === 'nuevo');
  const [marcas, setMarcas] = useState<Record<string, 'A' | 'F'>>(() => Object.fromEntries(presentes.map(t => [t.id, (t.asistencia[DIA_HOY] ?? 'A') as 'A' | 'F'])));
  return (
    <div style={cuerpo}>
      <p style={h3}>Pase de lista · hoy viernes</p>
      <p style={{ margin: 0, fontSize: 12, color: C.muted }}>Toque a quien faltó. Todos empiezan como presentes.</p>
      {presentes.map(t => {
        const falta = marcas[t.id] === 'F';
        return (
          <button key={t.id} type="button" onClick={() => setMarcas(m => ({ ...m, [t.id]: falta ? 'A' : 'F' }))} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, background: falta ? C.redSoft : '#fff',
            border: `1px solid ${falta ? C.red : C.line}`, borderRadius: 10, padding: '10px 12px', cursor: 'pointer', fontFamily: 'inherit', color: C.ink, textAlign: 'left',
          }}>
            <span><strong style={{ fontSize: 14 }}>{t.nombre}</strong><br /><span style={{ fontSize: 12, color: C.muted }}>{t.puesto} · {nombreFrente(t.frente)}</span></span>
            <span style={{ fontWeight: 800, color: falta ? C.red : C.green, fontSize: 13 }}>{falta ? 'Faltó' : 'Presente'}</span>
          </button>
        );
      })}
      <Boton onClick={() => enviar({ tipo: 'pasar-lista', dia: DIA_HOY, marcas }, 'Lista enviada. Recursos humanos ya la ve en la nómina.')}>Guardar pase de lista</Boton>
    </div>
  );
}

function PantallaAvance({ actividades, enviar }: { actividades: Actividad[]; enviar: (a: Accion, ok: string) => void }) {
  const enCurso = actividades.filter(a => a.real < 100 && a.inicio <= HOY);
  const [id, setId] = useState(enCurso.find(a => a.id === 'b3')?.id ?? enCurso[0]?.id ?? '');
  const act = actividades.find(a => a.id === id);
  const [avance, setAvance] = useState<number>(act ? Math.min(100, act.real + 10) : 0);
  const [personas, setPersonas] = useState('6');
  const [nota, setNota] = useState('');
  if (!act) return <div style={cuerpo}><p style={{ margin: 0 }}>No hay actividades en curso.</p></div>;
  return (
    <div style={cuerpo}>
      <p style={h3}>Reporte del día</p>
      <Campo id="act" label="Actividad">
        <select id="act" value={id} onChange={e => { setId(e.target.value); const a = actividades.find(x => x.id === e.target.value)!; setAvance(Math.min(100, a.real + 10)); }} style={{ ...estiloInput, fontSize: 13 }}>
          {enCurso.map(a => <option key={a.id} value={a.id}>{nombreFrente(a.frente)} · {a.nombre}</option>)}
        </select>
      </Campo>
      <Campo id="av" label={`Avance acumulado: ${avance} % (antes ${act.real} %)`}>
        <input id="av" type="range" min={act.real} max={100} step={5} value={avance} onChange={e => setAvance(Number(e.target.value))} style={{ width: '100%' }} />
      </Campo>
      <Campo id="per" label="Personas trabajando"><input id="per" type="number" value={personas} onChange={e => setPersonas(e.target.value)} style={{ ...estiloInput, fontSize: 13 }} /></Campo>
      <Campo id="nota-av" label="Nota (opcional)"><input id="nota-av" value={nota} onChange={e => setNota(e.target.value)} style={{ ...estiloInput, fontSize: 13 }} placeholder="Ej.: se coló la mitad de la losa" /></Campo>
      <Boton disabled={avance <= act.real} onClick={() => enviar({ tipo: 'avance', actividadId: act.id, avance, personas: Number(personas) || 0, nota, por: 'Residente de obra' }, 'Avance enviado. El programa y la fecha de entrega ya se ajustaron.')}>Enviar avance</Boton>
    </div>
  );
}
