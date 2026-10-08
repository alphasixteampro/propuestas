// Pedidos de material (la obra pide, Jorge aprueba, compras compra) y recepción en obra (se revisa que
// llegó completo y se descuenta del presupuesto).
import React, { useState } from 'react';
import { Plus, Trash2, Check, X as XIcon, ShoppingCart, Truck, Camera, PackageCheck, FileText, Smartphone } from 'lucide-react';
import {
  C, Chip, Tono, Tarjeta, Titulo, Boton, Campo, estiloInput, Modal, Tabla, celda, celdaDer, NotaIA, Pestanas,
} from './ui';
import {
  INSUMOS, FRENTES, PROVEEDORES, HOY, insumo, nombreFrente, money, num, fechaCorta, sumarDias, lecturaRemision, excesoItem, lineaDe,
  EstadoLinea, EstadoReq, FrenteId, Requisicion, ResumenPrograma,
} from './datos';
import { Accion, Persona } from './estado';

export const ESTADO_REQ: Record<EstadoReq, { texto: string; tono: Tono }> = {
  'por-aprobar': { texto: 'Por aprobar', tono: 'amber' },
  'rechazada': { texto: 'Rechazado', tono: 'red' },
  'por-comprar': { texto: 'Aprobado · por comprar', tono: 'blue' },
  'en-camino': { texto: 'Comprado · en camino', tono: 'purple' },
  'incompleta': { texto: 'Llegó incompleto', tono: 'red' },
  'recibida': { texto: 'Recibido completo', tono: 'green' },
};

export function puede(persona: Persona, accion: 'aprobar' | 'comprar' | 'recibir' | 'pedir'): boolean {
  const r = persona.id;
  if (accion === 'aprobar') return r === 'director';
  if (accion === 'comprar') return r === 'compras' || r === 'director';
  if (accion === 'recibir') return r === 'residente' || r === 'director';
  return r === 'residente' || r === 'director' || r === 'compras';
}

// ─────────────────────────────────────────────────────────────────────────
// FORMULARIO DE PEDIDO (lo usa la oficina y el celular del residente)

interface LineaForm { insumoId: string; frente: FrenteId; cantidad: string; }

export function FormPedido({ presupuesto, onEnviar, compacto }: {
  presupuesto: EstadoLinea[]; onEnviar: (items: { insumoId: string; frente: FrenteId; cantidad: number }[], nota: string) => void; compacto?: boolean;
}) {
  const [lineas, setLineas] = useState<LineaForm[]>([{ insumoId: 'cem', frente: 'v1', cantidad: '' }]);
  const [nota, setNota] = useState('');
  const validas = lineas.filter(l => Number(l.cantidad) > 0);
  const cambiar = (i: number, cambio: Partial<LineaForm>) => setLineas(ls => ls.map((l, j) => j === i ? { ...l, ...cambio } : l));
  const tam = compacto ? 13 : 14;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {lineas.map((l, i) => {
        const ins = insumo(l.insumoId);
        const linea = lineaDe(presupuesto, l.insumoId, l.frente);
        const cant = Number(l.cantidad) || 0;
        const exceso = excesoItem(presupuesto, { insumoId: l.insumoId, frente: l.frente, cantidad: cant });
        return (
          <div key={i} style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', gap: 8, background: C.surface }}>
            <div style={{ display: 'grid', gridTemplateColumns: compacto ? '1fr' : 'minmax(0,2fr) minmax(0,1fr) minmax(0,1fr) auto', gap: 8, alignItems: 'end' }}>
              <Campo id={`ins-${i}`} label="Material">
                <select id={`ins-${i}`} value={l.insumoId} onChange={e => cambiar(i, { insumoId: e.target.value })} style={{ ...estiloInput, fontSize: tam }}>
                  {INSUMOS.map(x => <option key={x.id} value={x.id}>{x.nombre}</option>)}
                </select>
              </Campo>
              <div style={{ display: 'grid', gridTemplateColumns: compacto ? '1fr 1fr' : '1fr', gap: 8 }}>
                <Campo id={`fr-${i}`} label="¿Para dónde?">
                  <select id={`fr-${i}`} value={l.frente} onChange={e => cambiar(i, { frente: e.target.value as FrenteId })} style={{ ...estiloInput, fontSize: tam }}>
                    {FRENTES.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                  </select>
                </Campo>
                {compacto && (
                  <Campo id={`can-${i}`} label={`Cantidad (${ins.unidad})`}>
                    <input id={`can-${i}`} type="number" inputMode="decimal" min={0} value={l.cantidad} onChange={e => cambiar(i, { cantidad: e.target.value })} style={{ ...estiloInput, fontSize: tam }} placeholder="0" />
                  </Campo>
                )}
              </div>
              {!compacto && (
                <Campo id={`can-${i}`} label={`Cantidad (${ins.unidad})`}>
                  <input id={`can-${i}`} type="number" inputMode="decimal" min={0} value={l.cantidad} onChange={e => cambiar(i, { cantidad: e.target.value })} style={estiloInput} placeholder="0" />
                </Campo>
              )}
              {!compacto && lineas.length > 1 && (
                <button type="button" aria-label="Quitar material" onClick={() => setLineas(ls => ls.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', minHeight: 40 }}><Trash2 size={18} /></button>
              )}
            </div>
            <p style={{ margin: 0, fontSize: 12, color: exceso > 0 ? C.red : C.muted, fontWeight: exceso > 0 ? 700 : 400 }}>
              {exceso > 0
                ? `⚠ Se pasa ${num(exceso)} ${ins.unidad} del presupuesto de ${nombreFrente(l.frente)}. Jorge lo verá marcado antes de aprobar.`
                : `Quedan ${num(linea.disponible)} de ${num(linea.presupuestado)} ${ins.unidad} en el presupuesto de ${nombreFrente(l.frente)}.`}
              {linea.porAprobar > 0 && ` Hay ${num(linea.porAprobar)} más esperando aprobación.`}
            </p>
          </div>
        );
      })}
      <button type="button" onClick={() => setLineas(ls => [...ls, { insumoId: 'cem', frente: 'v2', cantidad: '' }])} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: C.tealDark, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, minHeight: 36, fontFamily: 'inherit' }}>
        <Plus size={16} /> Agregar otro material
      </button>
      <Campo id="nota-pedido" label="¿Para qué es? (opcional)">
        <input id="nota-pedido" value={nota} onChange={e => setNota(e.target.value)} style={{ ...estiloInput, fontSize: tam }} placeholder="Ej.: colado de castillos" />
      </Campo>
      <Boton disabled={validas.length === 0} onClick={() => {
        onEnviar(validas.map(l => ({ insumoId: l.insumoId, frente: l.frente, cantidad: Number(l.cantidad) })), nota);
        setLineas([{ insumoId: 'cem', frente: 'v1', cantidad: '' }]); setNota('');
      }}>Enviar pedido</Boton>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// FORMULARIO DE RECEPCIÓN (revisar que llegó completo)

export function FormRecepcion({ req, onConfirmar, compacto }: {
  req: Requisicion; onConfirmar: (cantidades: number[], nota: string, conFoto: boolean) => void; compacto?: boolean;
}) {
  const [cant, setCant] = useState<string[]>(req.items.map(() => ''));
  const [nota, setNota] = useState('');
  const [foto, setFoto] = useState(false);
  const [leyendo, setLeyendo] = useState(false);
  const llenas = cant.some(c => c !== '');

  const leerRemision = () => {
    setLeyendo(true);
    setTimeout(() => {
      const lectura = lecturaRemision(req);
      setCant(lectura.map(String));
      setFoto(true); setLeyendo(false);
      const faltan = req.items.map((it, i) => ({ it, falta: it.cantidad - it.recibido - lectura[i] })).filter(x => x.falta > 0);
      setNota(faltan.length ? `Según la remisión faltan: ${faltan.map(x => `${num(x.falta)} ${insumo(x.it.insumoId).unidad} de ${insumo(x.it.insumoId).nombre}`).join(', ')}` : 'Llegó completo según la remisión');
    }, 900);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Boton variante="secundario" onClick={leerRemision} disabled={leyendo}><Camera size={16} /> {leyendo ? 'Leyendo la remisión…' : 'Foto de la remisión'}</Boton>
        <Boton variante="secundario" onClick={() => { setCant(req.items.map(it => String(it.cantidad - it.recibido))); setNota('Llegó completo'); }}><Check size={16} /> Todo llegó completo</Boton>
      </div>
      {foto && <NotaIA titulo="La IA leyó la remisión">Llenó las cantidades con lo que dice la remisión del proveedor. Revise y confirme.</NotaIA>}
      {req.items.map((it, i) => {
        const ins = insumo(it.insumoId);
        const pendiente = it.cantidad - it.recibido;
        const llega = Number(cant[i]) || 0;
        const falta = cant[i] === '' ? null : pendiente - llega;
        return (
          <div key={i} style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 10, display: 'grid', gridTemplateColumns: compacto ? '1fr' : 'minmax(0,2fr) minmax(0,1fr)', gap: 8, alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{ins.nombre} · {nombreFrente(it.frente)}</p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: C.muted }}>
                Pedido: {num(it.cantidad)} {ins.unidad}{it.recibido > 0 ? ` · ya llegaron ${num(it.recibido)}` : ''} · por llegar: {num(pendiente)}
              </p>
              {falta !== null && falta > 0 && <p style={{ margin: '4px 0 0', fontSize: 12, color: C.red, fontWeight: 700 }}>Faltan {num(falta)} {ins.unidad}: compras recibe el aviso</p>}
              {falta !== null && falta <= 0 && <p style={{ margin: '4px 0 0', fontSize: 12, color: C.green, fontWeight: 700 }}>Completo</p>}
            </div>
            <Campo id={`rec-${req.id}-${i}`} label="¿Cuánto llegó hoy?">
              <input id={`rec-${req.id}-${i}`} type="number" inputMode="decimal" min={0} max={pendiente} value={cant[i]} onChange={e => setCant(cs => cs.map((c, j) => j === i ? e.target.value : c))} style={estiloInput} placeholder={String(pendiente)} />
            </Campo>
          </div>
        );
      })}
      <Campo id={`nota-rec-${req.id}`} label="Comentario">
        <input id={`nota-rec-${req.id}`} value={nota} onChange={e => setNota(e.target.value)} style={estiloInput} placeholder="Ej.: llegaron 2 bultos rotos" />
      </Campo>
      <Boton disabled={!llenas} onClick={() => onConfirmar(cant.map(c => Number(c) || 0), nota, foto)}><PackageCheck size={16} /> Confirmar recepción</Boton>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SECCIÓN: PEDIDOS Y COMPRAS

type Filtro = 'por-aprobar' | 'por-comprar' | 'en-camino' | 'cerrados' | 'todos';

export function SeccionMateriales({ reqs, presupuesto, programa, persona, dispatch, avisar, onRecibir }: {
  reqs: Requisicion[]; presupuesto: EstadoLinea[]; programa: ResumenPrograma; persona: Persona;
  dispatch: (a: Accion) => void; avisar: (m: string) => void; onRecibir: (id: string) => void;
}) {
  const [filtro, setFiltro] = useState<Filtro>(persona.id === 'compras' ? 'por-comprar' : 'por-aprobar');
  const [nuevo, setNuevo] = useState(false);
  const [comprando, setComprando] = useState<Requisicion | null>(null);
  const [rechazando, setRechazando] = useState<Requisicion | null>(null);
  const [verOC, setVerOC] = useState<Requisicion | null>(null);

  const cuenta = (f: (r: Requisicion) => boolean) => reqs.filter(f).length;
  const filtros: { id: Filtro; texto: string; f: (r: Requisicion) => boolean }[] = [
    { id: 'por-aprobar', texto: `Por aprobar (${cuenta(r => r.estado === 'por-aprobar')})`, f: r => r.estado === 'por-aprobar' },
    { id: 'por-comprar', texto: `Por comprar (${cuenta(r => r.estado === 'por-comprar')})`, f: r => r.estado === 'por-comprar' },
    { id: 'en-camino', texto: `En camino o incompletos (${cuenta(r => r.estado === 'en-camino' || r.estado === 'incompleta')})`, f: r => r.estado === 'en-camino' || r.estado === 'incompleta' },
    { id: 'cerrados', texto: 'Recibidos y rechazados', f: r => r.estado === 'recibida' || r.estado === 'rechazada' },
    { id: 'todos', texto: 'Todos', f: () => true },
  ];
  const visibles = reqs.filter(filtros.find(x => x.id === filtro)!.f).slice().reverse();

  // Alertas de la IA sobre los pedidos que esperan aprobación.
  const alertas: string[] = [];
  for (const r of reqs.filter(x => x.estado === 'por-aprobar')) {
    for (const it of r.items) {
      const ex = excesoItem(presupuesto, it);
      if (ex > 0) {
        const ins = insumo(it.insumoId);
        const l = lineaDe(presupuesto, it.insumoId, it.frente);
        const fr = programa.porFrente.find(p => p.frente === it.frente)!;
        alertas.push(`${r.id} pide ${num(it.cantidad)} ${ins.unidad} de ${ins.nombre} para ${nombreFrente(it.frente)} y solo quedan ${num(l.disponible)} en el presupuesto (se pasa ${num(ex)}). ${nombreFrente(it.frente)} lleva ${Math.round(fr.estructura)} % de su obra negra y ya usó ${Math.round(((l.recibido + l.porRecibir) / l.presupuestado) * 100)} % de ese material: conviene preguntar al residente antes de aprobar.`);
      }
    }
  }

  return (
    <div>
      <Titulo titulo="Pedidos y compras" sub="La obra pide desde el celular, Jorge aprueba con un clic y compras genera la orden de compra. Cada pedido muestra cuánto queda en el presupuesto antes de aprobarlo.">
        {puede(persona, 'pedir') && <Boton onClick={() => setNuevo(true)}><Plus size={16} /> Nuevo pedido</Boton>}
      </Titulo>

      {alertas.length > 0 && filtro === 'por-aprobar' && (
        <div style={{ marginBottom: 16 }}>
          <div data-tour="alerta-ia"><NotaIA titulo="Antes de aprobar">
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>{alertas.map((a, i) => <li key={i}>{a}</li>)}</ul>
          </NotaIA></div>
        </div>
      )}

      <Pestanas opciones={filtros.map(f => ({ id: f.id, texto: f.texto }))} valor={filtro} onCambiar={setFiltro} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {visibles.length === 0 && <Tarjeta><p style={{ margin: 0, color: C.muted }}>No hay pedidos en esta bandeja.</p></Tarjeta>}
        {visibles.map(r => {
          const est = ESTADO_REQ[r.estado];
          const total = r.items.reduce((s, it) => s + it.cantidad * (it.precioCompra ?? insumo(it.insumoId).precio), 0);
          return (
            <Tarjeta key={r.id} tour={`req-${r.id}`}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 16, fontFamily: 'Poppins, sans-serif' }}>{r.id} {r.oc && <span style={{ color: C.muted, fontWeight: 600, fontSize: 14 }}>· {r.oc}</span>}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 13, color: C.muted, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {r.origen === 'celular' && <Smartphone size={14} />} {r.solicitante} · {fechaCorta(r.fecha)}{r.nota && ` · ${r.nota}`}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', flexWrap: 'wrap' }}><Chip tono={est.tono} texto={est.texto} /></div>
              </div>
              <Tabla minWidth={560} columnas={[{ texto: 'Material' }, { texto: 'Para' }, { texto: 'Pedido', derecha: true }, { texto: r.estado === 'por-aprobar' ? 'Queda en presupuesto' : 'Llegó', derecha: true }]}>
                {r.items.map((it, i) => {
                  const ins = insumo(it.insumoId);
                  const l = lineaDe(presupuesto, it.insumoId, it.frente);
                  const ex = r.estado === 'por-aprobar' ? excesoItem(presupuesto, it) : 0;
                  return (
                    <tr key={i}>
                      <td style={celda}>{ins.nombre}</td>
                      <td style={celda}>{nombreFrente(it.frente)}</td>
                      <td style={celdaDer}>{num(it.cantidad)} {ins.unidad}</td>
                      <td style={{ ...celdaDer, color: ex > 0 || (r.estado !== 'por-aprobar' && it.recibido < it.cantidad && r.estado !== 'por-comprar' && r.estado !== 'rechazada') ? C.red : C.ink, fontWeight: ex > 0 ? 700 : 400 }}>
                        {r.estado === 'por-aprobar'
                          ? (ex > 0 ? `${num(l.disponible)} · se pasa ${num(ex)}` : num(l.disponible))
                          : `${num(it.recibido)} de ${num(it.cantidad)}`}
                      </td>
                    </tr>
                  );
                })}
              </Tabla>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginTop: 12 }}>
                <p style={{ margin: 0, fontSize: 13, color: C.muted }}>
                  {r.proveedor ? `${r.proveedor} · entrega ${fechaCorta(r.fechaEntrega!)} · ` : 'Estimado con precios del presupuesto · '}<strong style={{ color: C.ink }}>{money(total)}</strong>
                  {r.comentario && ` · Motivo: ${r.comentario}`}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {r.estado === 'por-aprobar' && (puede(persona, 'aprobar') ? (
                    <>
                      <Boton variante="peligro" onClick={() => setRechazando(r)}><XIcon size={16} /> Rechazar</Boton>
                      <Boton onClick={() => { dispatch({ tipo: 'aprobar-req', id: r.id }); avisar(`${r.id} aprobado. Compras ya lo tiene en su bandeja.`); }}><Check size={16} /> Aprobar</Boton>
                    </>
                  ) : <span style={{ fontSize: 13, color: C.muted }}>Espera la aprobación de Jorge</span>)}
                  {r.estado === 'por-comprar' && (puede(persona, 'comprar')
                    ? <Boton onClick={() => setComprando(r)}><ShoppingCart size={16} /> Comprar</Boton>
                    : <span style={{ fontSize: 13, color: C.muted }}>Lo compra el área de compras</span>)}
                  {(r.estado === 'en-camino' || r.estado === 'incompleta' || r.estado === 'recibida') && <Boton variante="secundario" onClick={() => setVerOC(r)}><FileText size={16} /> Orden de compra</Boton>}
                  {(r.estado === 'en-camino' || r.estado === 'incompleta') && puede(persona, 'recibir') && <Boton onClick={() => onRecibir(r.id)}><Truck size={16} /> Recibir en obra</Boton>}
                </div>
              </div>
            </Tarjeta>
          );
        })}
      </div>

      {nuevo && (
        <Modal titulo="Nuevo pedido de material" subtitulo="Así lo hace la oficina. En obra, el residente lo hace desde el celular." onCerrar={() => setNuevo(false)} ancho={760}>
          <FormPedido presupuesto={presupuesto} onEnviar={(items, nota) => {
            dispatch({ tipo: 'crear-req', items, nota, solicitante: persona.cargo, origen: 'oficina' });
            setNuevo(false); setFiltro('por-aprobar'); avisar('Pedido enviado. Le llega a Jorge para aprobar.');
          }} />
        </Modal>
      )}
      {comprando && <ModalCompra req={comprando} onCerrar={() => setComprando(null)} onComprar={(proveedor, precios, fechaEntrega) => {
        dispatch({ tipo: 'comprar-req', id: comprando.id, proveedor, precios, fechaEntrega });
        setComprando(null); setFiltro('en-camino'); avisar(`Orden de compra generada para ${proveedor}. La obra ya ve que viene en camino.`);
      }} />}
      {rechazando && <ModalRechazo req={rechazando} onCerrar={() => setRechazando(null)} onRechazar={c => {
        dispatch({ tipo: 'rechazar-req', id: rechazando.id, comentario: c }); setRechazando(null); avisar('Pedido rechazado. El residente recibe el motivo.');
      }} />}
      {verOC && <ModalOC req={verOC} onCerrar={() => setVerOC(null)} />}
    </div>
  );
}

function ModalRechazo({ req, onCerrar, onRechazar }: { req: Requisicion; onCerrar: () => void; onRechazar: (c: string) => void }) {
  const [c, setC] = useState('');
  return (
    <Modal titulo={`Rechazar ${req.id}`} onCerrar={onCerrar}>
      <Campo id="motivo" label="Motivo (le llega al residente)">
        <input id="motivo" value={c} onChange={e => setC(e.target.value)} style={estiloInput} placeholder="Ej.: usar primero el cemento que quedó en bodega" />
      </Campo>
      <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}><Boton variante="peligro" disabled={!c} onClick={() => onRechazar(c)}>Rechazar pedido</Boton></div>
    </Modal>
  );
}

function ModalCompra({ req, onCerrar, onComprar }: { req: Requisicion; onCerrar: () => void; onComprar: (proveedor: string, precios: number[], fecha: string) => void }) {
  const [proveedor, setProveedor] = useState(PROVEEDORES[0]);
  const [precios, setPrecios] = useState<string[]>(req.items.map(it => String(insumo(it.insumoId).precio)));
  const [fecha, setFecha] = useState(sumarDias(HOY, 3));
  const total = req.items.reduce((s, it, i) => s + it.cantidad * (Number(precios[i]) || 0), 0);
  return (
    <Modal titulo={`Comprar ${req.id}`} subtitulo="Compras captura el precio de la cotización; el sistema lo compara con el precio del presupuesto." onCerrar={onCerrar} ancho={640}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
          <Campo id="prov" label="Proveedor">
            <select id="prov" value={proveedor} onChange={e => setProveedor(e.target.value)} style={estiloInput}>{PROVEEDORES.map(p => <option key={p}>{p}</option>)}</select>
          </Campo>
          <Campo id="entrega" label="Fecha de entrega en obra">
            <input id="entrega" type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={estiloInput} />
          </Campo>
        </div>
        {req.items.map((it, i) => {
          const ins = insumo(it.insumoId);
          const p = Number(precios[i]) || 0;
          const dif = p - ins.precio;
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 10, alignItems: 'center', borderTop: `1px solid ${C.line}`, paddingTop: 10 }}>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{num(it.cantidad)} {ins.unidad} · {ins.nombre}</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: dif > 0 ? C.red : C.muted }}>
                  Presupuesto: {money(ins.precio)} {dif !== 0 && `· ${dif > 0 ? 'más caro' : 'más barato'} por ${money(Math.abs(dif))}`}
                </p>
              </div>
              <Campo id={`precio-${i}`} label="Precio unitario">
                <input id={`precio-${i}`} type="number" value={precios[i]} onChange={e => setPrecios(ps => ps.map((x, j) => j === i ? e.target.value : x))} style={estiloInput} />
              </Campo>
            </div>
          );
        })}
        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, textAlign: 'right' }}>Total de la orden: {money(total)}</p>
        <Boton onClick={() => onComprar(proveedor, precios.map(Number), fecha)}><ShoppingCart size={16} /> Generar orden de compra</Boton>
      </div>
    </Modal>
  );
}

function ModalOC({ req, onCerrar }: { req: Requisicion; onCerrar: () => void }) {
  const total = req.items.reduce((s, it) => s + it.cantidad * (it.precioCompra ?? insumo(it.insumoId).precio), 0);
  return (
    <Modal titulo={`Orden de compra ${req.oc}`} subtitulo="Lista para mandar al proveedor por correo o WhatsApp." onCerrar={onCerrar} ancho={640}>
      <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <div><p style={{ margin: 0, fontWeight: 800 }}>JC Proyectos</p><p style={{ margin: 0, fontSize: 13, color: C.muted }}>Obra: Residencial Las Villas</p></div>
          <div style={{ textAlign: 'right' }}><p style={{ margin: 0, fontWeight: 800 }}>{req.oc}</p><p style={{ margin: 0, fontSize: 13, color: C.muted }}>Pedido {req.id}</p></div>
        </div>
        <p style={{ fontSize: 14, margin: '0 0 10px' }}>Proveedor: <strong>{req.proveedor}</strong> · Entregar en obra el {fechaCorta(req.fechaEntrega!)}</p>
        <Tabla minWidth={460} columnas={[{ texto: 'Material' }, { texto: 'Para' }, { texto: 'Cantidad', derecha: true }, { texto: 'Importe', derecha: true }]}>
          {req.items.map((it, i) => {
            const ins = insumo(it.insumoId);
            return (
              <tr key={i}>
                <td style={celda}>{ins.clave} · {ins.nombre}</td>
                <td style={celda}>{nombreFrente(it.frente)}</td>
                <td style={celdaDer}>{num(it.cantidad)} {ins.unidad}</td>
                <td style={celdaDer}>{money(it.cantidad * (it.precioCompra ?? ins.precio))}</td>
              </tr>
            );
          })}
        </Tabla>
        <p style={{ textAlign: 'right', fontWeight: 800, margin: '10px 0 0' }}>Total {money(total)}</p>
      </div>
      {req.recepciones.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <p style={{ fontWeight: 700, margin: '0 0 6px', fontSize: 14 }}>Recepciones en obra</p>
          {req.recepciones.map((rc, i) => <p key={i} style={{ margin: '0 0 4px', fontSize: 13, color: C.muted }}>{fechaCorta(rc.fecha)} · {rc.por}{rc.conFoto ? ' · con foto de la remisión' : ''} · {rc.nota}</p>)}
        </div>
      )}
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SECCIÓN: RECEPCIÓN EN OBRA

export function SeccionRecepcion({ reqs, persona, dispatch, avisar, seleccion, onSeleccion }: {
  reqs: Requisicion[]; persona: Persona; dispatch: (a: Accion) => void; avisar: (m: string) => void;
  seleccion: string | null; onSeleccion: (id: string | null) => void;
}) {
  const pendientes = reqs.filter(r => r.estado === 'en-camino' || r.estado === 'incompleta');
  const recibidas = reqs.filter(r => r.recepciones.length > 0).flatMap(r => r.recepciones.map(rc => ({ r, rc }))).reverse();
  const actual = pendientes.find(r => r.id === seleccion) ?? null;

  return (
    <div>
      <Titulo titulo="Recepción en obra" sub="Cuando llega el camión, el residente marca qué llegó. Lo recibido se descuenta solo del presupuesto y lo que falta le avisa a compras." />
      {!puede(persona, 'recibir') && <div style={{ marginBottom: 14 }}><Chip tono="muted" texto="Esta pantalla la usa el residente; usted la ve en modo consulta" /></div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14, alignItems: 'start' }}>
        <Tarjeta titulo={`Por recibir (${pendientes.length})`}>
          {pendientes.length === 0 && <p style={{ margin: 0, color: C.muted }}>No hay entregas pendientes.</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pendientes.map(r => (
              <button key={r.id} type="button" onClick={() => onSeleccion(r.id)} style={{
                textAlign: 'left', border: `1px solid ${actual?.id === r.id ? C.tealDark : C.line}`, background: actual?.id === r.id ? C.tealSoft : C.paper,
                borderRadius: 10, padding: 12, cursor: 'pointer', fontFamily: 'inherit', color: C.ink,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                  <strong>{r.oc} · {r.proveedor}</strong>
                  <Chip tono={ESTADO_REQ[r.estado].tono} texto={r.estado === 'incompleta' ? 'Falta material' : r.fechaEntrega === HOY ? 'Llega hoy' : `Llega ${fechaCorta(r.fechaEntrega!)}`} />
                </div>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: C.muted }}>
                  {r.items.filter(it => it.recibido < it.cantidad).map(it => `${num(it.cantidad - it.recibido)} ${insumo(it.insumoId).unidad} de ${insumo(it.insumoId).nombre} (${nombreFrente(it.frente)})`).join(' · ')}
                </p>
              </button>
            ))}
          </div>
        </Tarjeta>
        <Tarjeta tour="form-recepcion" titulo={actual ? `Recibir ${actual.oc}` : 'Elija una entrega'}>
          {!actual && <p style={{ margin: 0, color: C.muted }}>Toque una entrega de la lista para revisarla contra lo que se pidió.</p>}
          {actual && (puede(persona, 'recibir') ? (
            <FormRecepcion key={actual.id} req={actual} onConfirmar={(cantidades, nota, conFoto) => {
              const faltan = actual.items.some((it, i) => it.recibido + cantidades[i] < it.cantidad);
              dispatch({ tipo: 'recibir-req', id: actual.id, cantidades, nota, conFoto, por: persona.cargo });
              onSeleccion(null);
              avisar(faltan ? 'Recepción guardada. Lo que llegó ya se descontó del presupuesto y compras recibió el aviso de lo que falta.' : 'Llegó completo. Ya se descontó del presupuesto.');
            }} />
          ) : <p style={{ margin: 0, color: C.muted }}>Cambie a "Residente de obra" o a Jorge en "Ver como" para recibir.</p>)}
        </Tarjeta>
      </div>
      <Tarjeta titulo="Últimas recepciones" style={{ marginTop: 14 }}>
        <Tabla minWidth={560} columnas={[{ texto: 'Fecha' }, { texto: 'Orden' }, { texto: 'Quién recibió' }, { texto: 'Comentario' }]}>
          {recibidas.map(({ r, rc }, i) => (
            <tr key={i}>
              <td style={celda}>{fechaCorta(rc.fecha)}</td>
              <td style={celda}>{r.oc} · {r.proveedor}</td>
              <td style={celda}>{rc.por}{rc.conFoto && <span title="Con foto de la remisión"> 📷</span>}</td>
              <td style={{ ...celda, color: r.estado === 'incompleta' && /falt/i.test(rc.nota) ? C.red : C.ink }}>{rc.nota || '—'}</td>
            </tr>
          ))}
        </Tabla>
      </Tarjeta>
    </div>
  );
}
