// Sección «Carteras y cruces»: edades de cartera, tipos de cartera, cruces entre cuentas,
// provisión y castigo, y certificados para el cliente (PRD 12E).
import React, { useMemo, useState } from 'react';
import { Download, FileText, Handshake, ShieldAlert } from 'lucide-react';
import {
  HOY, C, money, fechaLarga, Cliente, CuotaEstado, ResumenCliente, Persona, Seccion, FiltroEmpresa, EmpresaId,
  EMPRESAS, empresaDeSede, enFiltroEmpresa, proyectoPorId, vigentes,
  Chip, Tarjeta, BotonPrimario, BotonSecundario, Modal, Campo, estiloInput,
} from './base';

type TabCarteras = 'edades' | 'tipos' | 'cruces' | 'provision' | 'certificados';

const celda: React.CSSProperties = { padding: '8px 6px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' };

// ─────────────────────────────────────────────────────────────────────────
// EDADES DE CARTERA
// ─────────────────────────────────────────────────────────────────────────

interface Tramos { alDia: number; t1: number; t2: number; t3: number; t4: number; t5: number; }
const TRAMO_VACIO: Tramos = { alDia: 0, t1: 0, t2: 0, t3: 0, t4: 0, t5: 0 };

function sumarTramos(a: Tramos, b: Tramos): Tramos {
  return { alDia: a.alDia + b.alDia, t1: a.t1 + b.t1, t2: a.t2 + b.t2, t3: a.t3 + b.t3, t4: a.t4 + b.t4, t5: a.t5 + b.t5 };
}
function totalTramos(t: Tramos): number { return t.alDia + t.t1 + t.t2 + t.t3 + t.t4 + t.t5; }

// El capital y el interés que aún deben las cuotas vencidas o parciales se reparten por días de
// atraso; lo que no está vencido va a «Al día» (PRD 12E).
function tramosDeCliente(cuotas: CuotaEstado[], resumen: ResumenCliente): Tramos {
  const t: Tramos = { ...TRAMO_VACIO };
  let capitalVencidoPendiente = 0;
  for (const cu of cuotas) {
    if (cu.estado !== 'vencida' && cu.estado !== 'parcial') continue;
    const capitalPend = Math.max(0, cu.capitalProg - cu.capitalPag);
    const interesPend = Math.max(0, cu.interesProg - cu.interesPag);
    capitalVencidoPendiente += capitalPend;
    const monto = capitalPend + interesPend;
    const d = cu.diasAtraso;
    if (d <= 30) t.t1 += monto;
    else if (d <= 60) t.t2 += monto;
    else if (d <= 90) t.t3 += monto;
    else if (d <= 180) t.t4 += monto;
    else t.t5 += monto;
  }
  t.alDia = Math.max(0, resumen.saldoCapital - capitalVencidoPendiente);
  return t;
}

const TRAMOS_INFO: { key: keyof Tramos; label: string; color: string }[] = [
  { key: 'alDia', label: 'Al día', color: C.green },
  { key: 't1', label: '1–30', color: C.amberSoft },
  { key: 't2', label: '31–60', color: C.amber },
  { key: 't3', label: '61–90', color: C.redSoft },
  { key: 't4', label: '91–180', color: C.red },
  { key: 't5', label: 'Más de 180', color: C.purple },
];
const PORCENTAJES_PROVISION_DEFAULT = [0, 5, 10, 20, 50, 100];

function BarraEdades({ nombre, tramos }: { nombre: string; tramos: Tramos }) {
  const total = totalTramos(tramos);
  return (
    <div style={{ marginBottom: 12 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: C.ink, margin: '0 0 6px' }}>{nombre} · {money(total)}</p>
      <div role="img" aria-label={`Cartera de ${nombre}: ${TRAMOS_INFO.map(ti => `${ti.label} ${money(tramos[ti.key])}`).join(', ')}`}
        style={{ display: 'flex', height: 26, borderRadius: 6, overflow: 'hidden', border: `1px solid ${C.line}`, background: C.surface }}>
        {TRAMOS_INFO.map(ti => (total > 0 && tramos[ti.key] > 0) && (
          <div key={ti.key} title={`${ti.label}: ${money(tramos[ti.key])}`} style={{ width: `${(tramos[ti.key] / total) * 100}%`, background: ti.color }} />
        ))}
      </div>
    </div>
  );
}

function LeyendaTramos() {
  return (
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12, color: C.muted, margin: '2px 0 16px' }}>
      {TRAMOS_INFO.map(ti => (
        <span key={ti.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <i aria-hidden="true" style={{ width: 10, height: 10, background: ti.color, border: `1px solid ${C.lineStrong}`, display: 'inline-block', borderRadius: 2 }} />{ti.label}
        </span>
      ))}
    </div>
  );
}

function FilaEdades({ nombre, t, destacada }: { nombre: string; t: Tramos; destacada?: boolean }) {
  const total = totalTramos(t);
  const vencido = total - t.alDia;
  const pct = total > 0 ? Math.round((vencido / total) * 100) : 0;
  return (
    <tr style={{ borderBottom: `1px solid ${C.line}`, background: destacada ? C.surfaceStrong : undefined, fontWeight: destacada ? 700 : 400 }}>
      <td style={{ ...celda, whiteSpace: 'normal' }}>{nombre}</td>
      {TRAMOS_INFO.map(ti => <td key={ti.key} style={celda}>{money(t[ti.key])}</td>)}
      <td style={{ ...celda, fontWeight: 700 }}>{money(total)}</td>
      <td style={celda}>{pct}%</td>
    </tr>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// TIPOS DE CARTERA
// ─────────────────────────────────────────────────────────────────────────

interface FilaTipo { tipo: string; empresa: string; deudores: number; saldo: number; cuenta: string; nota?: string; }

// ─────────────────────────────────────────────────────────────────────────
// CRUCES DE CARTERA
// ─────────────────────────────────────────────────────────────────────────

const TIPOS_CRUCE = [
  'Contra cuentas por pagar (factura de compras)',
  'Entre contratos del mismo cliente',
  'Pago en especie o permuta',
  'Entre empresas del grupo',
  'Cesión de contrato',
];

const FACTURAS_COMPRAS = [
  { id: 'FV-2231', texto: 'FV-2231 · Vargas Acabados (Camilo Vargas) · 2.400.000 · Laureles', valor: 2400000, clienteId: 'la1' },
  { id: 'FV-0918', texto: 'FV-0918 · Carpintería Rueda (Natalia Rueda) · 1.850.000 · Cantalta', valor: 1850000, clienteId: 'ca2' },
  { id: 'FV-3310', texto: 'FV-3310 · Transportes Peña (Julián Peña) · 700.000 · Miraflor', valor: 700000, clienteId: 'mf2' },
];

interface Cruce {
  fecha: string; tipo: string; clienteId: string; clienteNombre: string; valor: number; detalle: string;
  estado: 'Aprobado' | 'Esperando aprobación'; aprobadoPor?: string; comprobante?: string; recibo?: string;
}

function siguienteComprobante(lista: Cruce[]): string {
  const n = lista.filter(c => c.comprobante).length + 1;
  return `CC-2026-${String(n).padStart(3, '0')}`;
}

function ModalNuevoCruce({ clientes, resumenes, persona, onCerrar, onConfirmar }: {
  clientes: Cliente[]; resumenes: Map<string, { cuotas: CuotaEstado[]; resumen: ResumenCliente }>; persona: Persona;
  onCerrar: () => void;
  onConfirmar: (d: { tipo: string; clienteId: string; clienteNombre: string; valor: number; detalle: string }) => void;
}) {
  const [tipo, setTipo] = useState(TIPOS_CRUCE[0]);
  // La factura es de un contratista que también es cliente: se propone la primera cuyo cliente está visible.
  const facturaInicial = FACTURAS_COMPRAS.find(f => clientes.some(c => c.raw.id === f.clienteId)) ?? FACTURAS_COMPRAS[0];
  const [clienteId, setClienteId] = useState(clientes.some(c => c.raw.id === facturaInicial.clienteId) ? facturaInicial.clienteId : (clientes[0]?.raw.id ?? ''));
  const [facturaId, setFacturaId] = useState(facturaInicial.id);
  const [bien, setBien] = useState('');
  const [avaluoTexto, setAvaluoTexto] = useState('');
  const [valorTexto, setValorTexto] = useState('');
  const [detalle, setDetalle] = useState('');
  const [soporte, setSoporte] = useState(false);

  const cliente = clientes.find(c => c.raw.id === clienteId);
  const resumen = clienteId ? resumenes.get(clienteId)?.resumen : undefined;
  const factura = FACTURAS_COMPRAS.find(f => f.id === facturaId)!;
  const avaluo = Number(avaluoTexto.replace(/\D/g, '')) || 0;
  const valorLibre = Number(valorTexto.replace(/\D/g, '')) || 0;

  const deudaCliente = resumen
    ? (resumen.valorVencido > 0 ? resumen.valorVencido : (resumen.proximaCuota ? resumen.proximaCuota.capitalProg + resumen.proximaCuota.interesProg : 0))
    : 0;

  let valor = 0;
  let detalleFinal = detalle.trim();
  if (tipo === 'Contra cuentas por pagar (factura de compras)') {
    valor = Math.min(factura.valor, deudaCliente);
    detalleFinal = `Cruce contra la factura ${factura.id} (${factura.texto.split(' · ')[1]})`;
  } else if (tipo === 'Pago en especie o permuta') {
    valor = avaluo;
    detalleFinal = bien.trim() ? `Pago en especie: ${bien.trim()} (avalúo ${money(avaluo)})` : '';
  } else {
    valor = valorLibre;
    detalleFinal = detalle.trim();
  }

  const puedeEnviar = !!cliente && valor > 0 && detalleFinal.length > 3 && soporte;

  return (
    <Modal titulo="Nuevo cruce de cartera" subtitulo="Paga una cuota sin que entre plata al banco" onCerrar={onCerrar} ancho={560}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 14 }}>
        <Campo id="cruce-tipo" label="Tipo de cruce">
          <select id="cruce-tipo" value={tipo} onChange={e => setTipo(e.target.value)} style={estiloInput}>
            {TIPOS_CRUCE.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Campo>
        <Campo id="cruce-cliente" label="Cliente">
          <select id="cruce-cliente" value={clienteId} onChange={e => setClienteId(e.target.value)} style={estiloInput}>
            {clientes.map(c => <option key={c.raw.id} value={c.raw.id}>{c.raw.nombre} · {c.raw.inmueble}</option>)}
          </select>
        </Campo>

        {tipo === 'Contra cuentas por pagar (factura de compras)' && (
          <>
            <Campo id="cruce-factura" label="Factura aprobada en Compras" ayuda={`Lo que debe el cliente: ${money(deudaCliente)}`}>
              <select id="cruce-factura" value={facturaId} onChange={e => { const f = FACTURAS_COMPRAS.find(x => x.id === e.target.value)!; setFacturaId(f.id); if (clientes.some(c => c.raw.id === f.clienteId)) setClienteId(f.clienteId); }} style={estiloInput}>
                {FACTURAS_COMPRAS.map(f => <option key={f.id} value={f.id}>{f.texto}</option>)}
              </select>
            </Campo>
            {valor <= 0 && <p style={{ fontSize: 12, color: C.amber, margin: 0 }}>Este cliente no tiene una deuda pendiente para cruzar.</p>}
          </>
        )}

        {tipo === 'Pago en especie o permuta' && (
          <>
            <Campo id="cruce-bien" label="Bien recibido">
              <input id="cruce-bien" value={bien} onChange={e => setBien(e.target.value)} style={estiloInput} placeholder="Ej. Camioneta modelo 2019" />
            </Campo>
            <Campo id="cruce-avaluo" label="Avalúo">
              <input id="cruce-avaluo" inputMode="numeric" value={avaluo ? avaluo.toLocaleString('es-CO') : ''} onChange={e => setAvaluoTexto(e.target.value)} style={estiloInput} placeholder="$ 0" />
            </Campo>
          </>
        )}

        {(tipo === 'Entre contratos del mismo cliente' || tipo === 'Entre empresas del grupo' || tipo === 'Cesión de contrato') && (
          <>
            <Campo id="cruce-valor" label="Valor">
              <input id="cruce-valor" inputMode="numeric" value={valorLibre ? valorLibre.toLocaleString('es-CO') : ''} onChange={e => setValorTexto(e.target.value)} style={estiloInput} placeholder="$ 0" />
            </Campo>
            <Campo id="cruce-detalle" label="Detalle">
              <input id="cruce-detalle" value={detalle} onChange={e => setDetalle(e.target.value)} style={estiloInput} placeholder="Explica de dónde sale el saldo" />
            </Campo>
          </>
        )}

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', minHeight: 40 }}>
          <input type="checkbox" checked={soporte} onChange={e => setSoporte(e.target.checked)} /> Adjunté el soporte (simulado)
        </label>
      </div>

      {valor > 0 && (
        <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, fontSize: 13, color: C.ink, marginBottom: 14 }}>
          <p style={{ margin: 0 }}>
            {tipo === 'Contra cuentas por pagar (factura de compras)'
              ? `Así queda: la cuota del cliente se paga con ${money(valor)} y la factura ${factura.id} queda pagada; un solo comprobante contable.`
              : `Así queda: el cruce de ${money(valor)} queda aplicado a la cuenta del cliente; un solo comprobante contable.`}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <BotonSecundario onClick={onCerrar}>Cancelar</BotonSecundario>
        <BotonPrimario disabled={!puedeEnviar} onClick={() => cliente && onConfirmar({ tipo, clienteId: cliente.raw.id, clienteNombre: cliente.raw.nombre, valor, detalle: detalleFinal })}>
          {persona.rol === 'gerencia' ? 'Aprobar y aplicar cruce' : 'Enviar a aprobación de gerencia'}
        </BotonPrimario>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// CERTIFICADOS
// ─────────────────────────────────────────────────────────────────────────

type TipoCertificado = 'paz' | 'pagos' | 'saldo';

function ModalCertificado({ tipo, cliente, resumen, cuotas, onCerrar, onToast }: {
  tipo: TipoCertificado; cliente: Cliente; resumen: ResumenCliente; cuotas: CuotaEstado[]; onCerrar: () => void; onToast: (m: string) => void;
}) {
  const proyecto = proyectoPorId(cliente.raw.proyectoId);
  const empresa = empresaDeSede(proyecto.sede);
  const titulo = tipo === 'paz' ? 'Paz y salvo' : tipo === 'pagos' ? 'Certificado de pagos 2026' : 'Certificado de saldo para el banco';
  const totalPagos2026 = vigentes(cliente.pagos).filter(p => p.fecha.startsWith('2026') && !p.administracionAnterior).reduce((s, p) => s + p.valor, 0);
  const proximas = cuotas.filter(c => c.estado === 'pendiente').slice(0, 3);
  return (
    <Modal titulo={titulo} subtitulo={`${cliente.raw.nombre} · ${cliente.raw.inmueble}`} onCerrar={onCerrar}>
      <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 20, fontSize: 13, color: C.ink }}>
        <p style={{ fontWeight: 700, fontSize: 15, margin: '0 0 2px' }}>{empresa.nombre}</p>
        <p style={{ color: C.muted, margin: '0 0 16px' }}>{empresa.nit}</p>
        <p style={{ fontWeight: 700, textAlign: 'center', margin: '0 0 14px', textTransform: 'uppercase' }}>{titulo}</p>
        {tipo === 'paz' && (
          <p style={{ margin: 0 }}>
            Certificamos que <strong>{cliente.raw.nombre}</strong>, identificado con cédula {cliente.raw.cedula}, se encuentra a paz y salvo por todo
            concepto con {empresa.corto} por el inmueble {cliente.raw.inmueble} del proyecto {proyecto.nombre}, contrato {cliente.raw.numeroContrato}.
          </p>
        )}
        {tipo === 'pagos' && (
          <>
            <p style={{ margin: '0 0 8px' }}>
              Certificamos que <strong>{cliente.raw.nombre}</strong>, identificado con cédula {cliente.raw.cedula}, realizó pagos por <strong>{money(totalPagos2026)}</strong> durante
              2026 por el inmueble {cliente.raw.inmueble}, contrato {cliente.raw.numeroContrato}.
            </p>
            <p style={{ margin: 0, color: C.muted }}>No incluye pagos de la administración anterior.</p>
          </>
        )}
        {tipo === 'saldo' && (
          <>
            <p style={{ margin: 0 }}>
              Certificamos que <strong>{cliente.raw.nombre}</strong>, identificado con cédula {cliente.raw.cedula}, tiene un saldo de capital de <strong>{money(resumen.saldoCapital)}</strong> por
              el inmueble {cliente.raw.inmueble}, contrato {cliente.raw.numeroContrato}.
            </p>
            {proximas.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <p style={{ fontWeight: 600, margin: '0 0 6px' }}>Próximas cuotas</p>
                {proximas.map(c => <p key={c.numero} style={{ margin: '2px 0' }}>Cuota {c.numero} · {fechaLarga(c.vence)} · {money(c.capitalProg + c.interesProg)}</p>)}
              </div>
            )}
          </>
        )}
        <p style={{ marginTop: 20, marginBottom: 0 }}>Se expide a solicitud del interesado, a los {fechaLarga(HOY)}.</p>
        <p style={{ marginTop: 24, marginBottom: 0, borderTop: `1px solid ${C.line}`, paddingTop: 10 }}>Firma: Cartera</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
        <BotonPrimario onClick={() => onToast('En la plataforma real se descarga en PDF con la firma digital')}><Download size={15} />Descargar PDF</BotonPrimario>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────

export function SeccionCarteras(props: {
  clientes: Cliente[];
  resumenes: Map<string, { cuotas: CuotaEstado[]; resumen: ResumenCliente }>;
  empresa: FiltroEmpresa;
  persona: Persona;
  onCruce: (d: { clienteId: string; valor: number; tipo: string; detalle: string }) => { recibo: string };
  onIrA: (s: Seccion) => void;
  onToast: (m: string) => void;
}) {
  const [tab, setTab] = useState<TabCarteras>('edades');
  const puedeGerencia = props.persona.rol === 'gerencia';
  const puedeProvision = puedeGerencia || props.persona.rol === 'contabilidad';

  const filasEdades = useMemo(() => {
    const porProyecto = new Map<string, Tramos>();
    for (const c of props.clientes) {
      if (c.estado === 'recuperado') continue;
      const d = props.resumenes.get(c.raw.id);
      if (!d) continue;
      const t = tramosDeCliente(d.cuotas, d.resumen);
      porProyecto.set(c.raw.proyectoId, sumarTramos(porProyecto.get(c.raw.proyectoId) ?? TRAMO_VACIO, t));
    }
    return [...porProyecto.entries()]
      .map(([proyectoId, tramos]) => ({ proyecto: proyectoPorId(proyectoId), tramos }))
      .sort((a, b) => a.proyecto.nombre.localeCompare(b.proyecto.nombre));
  }, [props.clientes, props.resumenes]);

  const porEmpresa = useMemo(() => {
    const m = new Map<EmpresaId, Tramos>();
    for (const f of filasEdades) {
      const emp = empresaDeSede(f.proyecto.sede).id;
      m.set(emp, sumarTramos(m.get(emp) ?? TRAMO_VACIO, f.tramos));
    }
    return m;
  }, [filasEdades]);

  const totalGeneral = useMemo(() => filasEdades.reduce((acc, f) => sumarTramos(acc, f.tramos), TRAMO_VACIO), [filasEdades]);

  const filasTipos = useMemo(() => {
    const filas: FilaTipo[] = [];
    const ventasPorEmpresa = new Map<EmpresaId, { deudores: number; saldo: number }>();
    for (const c of props.clientes) {
      const r = props.resumenes.get(c.raw.id)?.resumen;
      if (!r || r.saldoCapital <= 0.5) continue;
      const emp = empresaDeSede(proyectoPorId(c.raw.proyectoId).sede).id;
      const acc = ventasPorEmpresa.get(emp) ?? { deudores: 0, saldo: 0 };
      acc.deudores += 1; acc.saldo += r.saldoCapital;
      ventasPorEmpresa.set(emp, acc);
    }
    for (const e of EMPRESAS) {
      const v = ventasPorEmpresa.get(e.id);
      if (v) filas.push({ tipo: 'Ventas a cuotas', empresa: e.corto, deudores: v.deudores, saldo: v.saldo, cuenta: '130501 · Clientes por ventas a cuotas' });
    }
    if (enFiltroEmpresa('Bucaramanga', props.empresa)) {
      filas.push({ tipo: 'Arriendos', empresa: 'Mizar', deudores: 2, saldo: 3600000, cuenta: '130505 · Arriendos' });
      filas.push({ tipo: 'Anticipos a contratistas', empresa: 'Mizar', deudores: 3, saldo: 55000000, cuenta: '133005 · Anticipos a contratistas' });
    }
    const notaGrupo = 'Al consolidar el grupo, este saldo se elimina.';
    if (props.empresa === 'mizar' || props.empresa === 'grupo') {
      filas.push({
        tipo: 'Préstamo a otra empresa del grupo (por cobrar)', empresa: 'Mizar', deudores: 1, saldo: 35000000,
        cuenta: '136005 · Cuentas por cobrar a compañías vinculadas', nota: props.empresa === 'grupo' ? notaGrupo : undefined,
      });
    }
    if (props.empresa === 'cucuta' || props.empresa === 'grupo') {
      filas.push({
        tipo: 'Préstamo a otra empresa del grupo (por pagar)', empresa: 'Mi Lote Cúcuta', deudores: 1, saldo: 35000000,
        cuenta: '233595 · Cuentas por pagar a compañías vinculadas', nota: props.empresa === 'grupo' ? notaGrupo : undefined,
      });
    }
    return filas;
  }, [props.clientes, props.resumenes, props.empresa]);

  const [cruces, setCruces] = useState<Cruce[]>(() => {
    const primero = props.clientes[0];
    if (!primero) return [];
    return [{
      fecha: '2026-09-12', tipo: 'Entre contratos del mismo cliente', clienteId: primero.raw.id, clienteNombre: primero.raw.nombre,
      valor: 1200000, detalle: 'Saldo a favor del lote anterior aplicado a este contrato', estado: 'Aprobado', aprobadoPor: 'Claudia', comprobante: 'CC-2026-001',
    }];
  });
  const [modalCruce, setModalCruce] = useState(false);

  function agregarCruce(datos: { tipo: string; clienteId: string; clienteNombre: string; valor: number; detalle: string }) {
    if (puedeGerencia) {
      const { recibo } = props.onCruce({ clienteId: datos.clienteId, valor: datos.valor, tipo: datos.tipo, detalle: datos.detalle });
      setCruces(prev => [...prev, { fecha: HOY, ...datos, estado: 'Aprobado', aprobadoPor: props.persona.nombre, comprobante: siguienteComprobante(prev), recibo }]);
    } else {
      setCruces(prev => [...prev, { fecha: HOY, ...datos, estado: 'Esperando aprobación' }]);
      props.onToast('Cambia a Claudia · Gerencia para aprobarlo');
    }
    setModalCruce(false);
  }

  function aprobarCruce(idx: number) {
    const c = cruces[idx];
    const { recibo } = props.onCruce({ clienteId: c.clienteId, valor: c.valor, tipo: c.tipo, detalle: c.detalle });
    const comprobante = siguienteComprobante(cruces);
    setCruces(prev => prev.map((item, i) => i === idx ? { ...item, estado: 'Aprobado', aprobadoPor: props.persona.nombre, comprobante, recibo } : item));
    props.onToast(`Cruce aprobado y aplicado · comprobante ${comprobante}`);
  }

  const [pcts, setPcts] = useState<number[]>(PORCENTAJES_PROVISION_DEFAULT);
  const totalProvisionGeneral = useMemo(
    () => TRAMOS_INFO.reduce((s, ti, i) => s + Math.round(totalGeneral[ti.key] * pcts[i] / 100), 0),
    [totalGeneral, pcts],
  );

  const [castigado, setCastigado] = useState(false);
  const [modalCastigo, setModalCastigo] = useState(false);
  const [motivoCastigo, setMotivoCastigo] = useState('');

  const [clienteCertId, setClienteCertId] = useState(props.clientes[0]?.raw.id ?? '');
  const [certificadoAbierto, setCertificadoAbierto] = useState<TipoCertificado | null>(null);
  const clienteIdSel = props.clientes.some(c => c.raw.id === clienteCertId) ? clienteCertId : (props.clientes[0]?.raw.id ?? '');
  const clienteCert = props.clientes.find(c => c.raw.id === clienteIdSel);
  const resumenCert = clienteCert ? props.resumenes.get(clienteCert.raw.id)?.resumen : undefined;
  const cuotasCert = clienteCert ? props.resumenes.get(clienteCert.raw.id)?.cuotas : undefined;

  const botonTab = (id: TabCarteras, texto: string) => (
    <button type="button" onClick={() => setTab(id)} style={{
      padding: '8px 16px', borderRadius: 8, border: `1px solid ${tab === id ? C.navy : C.lineStrong}`,
      background: tab === id ? C.navy : C.paper, color: tab === id ? '#fff' : C.ink, fontWeight: 600, fontSize: 13,
      cursor: 'pointer', minHeight: 40, fontFamily: 'inherit',
    }}>{texto}</button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Carteras y cruces</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', fontSize: 13, color: C.muted }}>
        <span>Acuerdos de pago y gestiones siguen en Morosos y cobranza.</span>
        <button type="button" onClick={() => props.onIrA('morosos')} style={{ background: 'none', border: 'none', color: C.blue, fontWeight: 700, fontSize: 13, cursor: 'pointer', minHeight: 40, padding: 0, fontFamily: 'inherit' }}>
          Ir a Morosos y cobranza →
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {botonTab('edades', 'Edades')}{botonTab('tipos', 'Tipos de cartera')}{botonTab('cruces', 'Cruces')}
        {botonTab('provision', 'Provisión y castigo')}{botonTab('certificados', 'Certificados')}
      </div>

      {tab === 'edades' && (
        <Tarjeta>
          {(['mizar', 'cucuta'] as EmpresaId[]).filter(id => porEmpresa.has(id)).map(id => (
            <BarraEdades key={id} nombre={EMPRESAS.find(e => e.id === id)!.corto} tramos={porEmpresa.get(id)!} />
          ))}
          <LeyendaTramos />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 900 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                  <th style={celda}>Proyecto</th>
                  {TRAMOS_INFO.map(ti => <th key={ti.key} style={celda}>{ti.label}</th>)}
                  <th style={celda}>Total</th><th style={celda}>% vencido</th>
                </tr>
              </thead>
              <tbody>
                {filasEdades.length === 0 && (
                  <tr><td colSpan={9} style={{ padding: 16, textAlign: 'center', color: C.muted }}>No hay cartera para este filtro.</td></tr>
                )}
                {(['mizar', 'cucuta'] as EmpresaId[]).filter(id => porEmpresa.has(id)).map(id => (
                  <React.Fragment key={id}>
                    {filasEdades.filter(f => empresaDeSede(f.proyecto.sede).id === id).map(f => (
                      <FilaEdades key={f.proyecto.id} nombre={f.proyecto.nombre} t={f.tramos} />
                    ))}
                    {props.empresa === 'grupo' && (
                      <FilaEdades key={`total-${id}`} nombre={`Total ${EMPRESAS.find(e => e.id === id)!.corto}`} t={porEmpresa.get(id)!} destacada />
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Tarjeta>
      )}

      {tab === 'tipos' && (
        <Tarjeta>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 760 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                  <th style={celda}>Tipo</th><th style={celda}>Empresa</th><th style={celda}>Deudores</th><th style={celda}>Saldo</th><th style={celda}>Cuenta contable</th>
                </tr>
              </thead>
              <tbody>
                {filasTipos.map((f, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.line}`, verticalAlign: 'top' }}>
                    <td style={{ ...celda, fontWeight: 600, whiteSpace: 'normal' }}>{f.tipo}</td>
                    <td style={celda}>{f.empresa}</td>
                    <td style={celda}>{f.deudores}</td>
                    <td style={celda}>{money(f.saldo)}</td>
                    <td style={{ ...celda, whiteSpace: 'normal' }}>{f.cuenta}{f.nota && <div style={{ fontSize: 12, color: C.muted, fontWeight: 400 }}>{f.nota}</div>}</td>
                  </tr>
                ))}
                {filasTipos.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: 16, textAlign: 'center', color: C.muted }}>No hay cartera de este tipo para el filtro elegido.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Tarjeta>
      )}

      {tab === 'cruces' && (
        <Tarjeta>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
            <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Cada cruce paga una cuota sin que entre plata al banco: deja un solo comprobante contable.</p>
            <BotonPrimario onClick={() => setModalCruce(true)}><Handshake size={15} />Nuevo cruce</BotonPrimario>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 900 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                  <th style={celda}>Fecha</th><th style={celda}>Tipo</th><th style={celda}>Cliente</th><th style={celda}>Valor</th>
                  <th style={celda}>Detalle</th><th style={celda}>Estado</th><th style={celda}>Comprobante</th>
                </tr>
              </thead>
              <tbody>
                {cruces.map((c, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.line}`, verticalAlign: 'top' }}>
                    <td style={celda}>{fechaLarga(c.fecha)}</td>
                    <td style={{ ...celda, whiteSpace: 'normal' }}>{c.tipo}</td>
                    <td style={celda}>{c.clienteNombre}</td>
                    <td style={celda}>{money(c.valor)}</td>
                    <td style={{ ...celda, whiteSpace: 'normal' }}>{c.detalle}</td>
                    <td style={celda}>
                      <Chip tono={c.estado === 'Aprobado' ? 'green' : 'amber'} texto={c.estado} />
                      {c.estado === 'Aprobado' && c.aprobadoPor && <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Aprobó {c.aprobadoPor}</div>}
                      {c.estado === 'Esperando aprobación' && puedeGerencia && (
                        <div style={{ marginTop: 6 }}><BotonSecundario onClick={() => aprobarCruce(i)}>Aprobar</BotonSecundario></div>
                      )}
                    </td>
                    <td style={celda}>
                      {c.comprobante ?? '—'}
                      {c.recibo && <div style={{ fontSize: 11, color: C.muted }}>{c.recibo}</div>}
                    </td>
                  </tr>
                ))}
                {cruces.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: 16, textAlign: 'center', color: C.muted }}>Todavía no hay cruces registrados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Tarjeta>
      )}

      {tab === 'provision' && (
        <>
          <Tarjeta>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}>Provisión de cartera</p>
            <p style={{ fontSize: 13, color: C.muted, margin: '0 0 16px' }}>Aparta plata según qué tan atrasada está la cartera, por si no se recupera.</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 520 }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                    <th style={celda}>Tramo</th><th style={celda}>Saldo</th><th style={celda}>% de provisión</th><th style={celda}>Provisión</th>
                  </tr>
                </thead>
                <tbody>
                  {TRAMOS_INFO.map((ti, i) => {
                    const saldo = totalGeneral[ti.key];
                    const provision = Math.round(saldo * pcts[i] / 100);
                    return (
                      <tr key={ti.key} style={{ borderBottom: `1px solid ${C.line}` }}>
                        <td style={celda}>{ti.label}</td>
                        <td style={celda}>{money(saldo)}</td>
                        <td style={celda}>
                          <input type="number" min={0} max={100} value={pcts[i]}
                            onChange={e => setPcts(prev => prev.map((v, j) => j === i ? Math.max(0, Math.min(100, Number(e.target.value) || 0)) : v))}
                            style={{ ...estiloInput, width: 80, padding: '6px 8px', minHeight: 32 }} />
                        </td>
                        <td style={{ ...celda, fontWeight: 600 }}>{money(provision)}</td>
                      </tr>
                    );
                  })}
                  <tr style={{ background: C.surfaceStrong, fontWeight: 700 }}>
                    <td style={celda}>Total</td><td style={celda}>{money(totalTramos(totalGeneral))}</td><td style={celda} />
                    <td style={celda}>{money(totalProvisionGeneral)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 12, color: C.muted, margin: '10px 0 12px' }}>Los porcentajes los define el contador (P33).</p>
            {puedeProvision ? (
              <BotonPrimario onClick={() => props.onToast(`Provisión del mes registrada: ${money(totalProvisionGeneral)}. Genera su comprobante.`)}>
                Registrar provisión del mes
              </BotonPrimario>
            ) : (
              <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Lo registra contabilidad o gerencia.</p>
            )}
          </Tarjeta>

          <Tarjeta>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}>Castigo de cartera</p>
            <p style={{ fontSize: 13, color: C.muted, margin: '0 0 16px' }}>
              Cuando ya no se espera recuperar la deuda, sale de la cartera activa. No se borra: si el cliente paga, entra como cartera recuperada.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap', background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, padding: '10px 12px' }}>
              <span style={{ fontSize: 13 }}>Contrato desistido 2024 · Hernán Quintero · {money(3200000)} · 412 días sin pago</span>
              {castigado
                ? <Chip tono="muted" texto="Castigado" />
                : (puedeGerencia && <BotonSecundario onClick={() => setModalCastigo(true)}><ShieldAlert size={15} />Castigar</BotonSecundario>)}
            </div>
            {castigado && (
              <p style={{ fontSize: 12, color: C.muted, margin: '10px 0 0' }}>
                Castigado: sale de la cartera activa, no se borra; si paga, entra como cartera recuperada. Motivo: {motivoCastigo}
              </p>
            )}
          </Tarjeta>
        </>
      )}

      {tab === 'certificados' && (
        <Tarjeta>
          <Campo id="cert-cliente" label="Cliente">
            <select id="cert-cliente" value={clienteIdSel} onChange={e => setClienteCertId(e.target.value)} style={{ ...estiloInput, maxWidth: 420 }}>
              {props.clientes.map(c => <option key={c.raw.id} value={c.raw.id}>{c.raw.nombre} · {c.raw.inmueble}</option>)}
            </select>
          </Campo>
          {clienteCert && resumenCert ? (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginTop: 16 }}>
              {(resumenCert.saldoCapital <= 0.5 && resumenCert.valorVencido <= 0) ? (
                <BotonSecundario onClick={() => setCertificadoAbierto('paz')}><FileText size={15} />Paz y salvo</BotonSecundario>
              ) : (
                <span style={{ fontSize: 13, color: C.muted }}>El cliente aún debe {money(resumenCert.saldoCapital)}</span>
              )}
              <BotonSecundario onClick={() => setCertificadoAbierto('pagos')}><FileText size={15} />Certificado de pagos 2026</BotonSecundario>
              <BotonSecundario onClick={() => setCertificadoAbierto('saldo')}><FileText size={15} />Certificado de saldo para el banco</BotonSecundario>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: C.muted, marginTop: 16 }}>No hay clientes para este filtro.</p>
          )}
        </Tarjeta>
      )}

      {modalCruce && (
        <ModalNuevoCruce clientes={props.clientes} resumenes={props.resumenes} persona={props.persona} onCerrar={() => setModalCruce(false)} onConfirmar={agregarCruce} />
      )}

      {modalCastigo && (
        <Modal titulo="Castigar cartera" subtitulo="Hernán Quintero · Contrato desistido 2024" onCerrar={() => setModalCastigo(false)}>
          <Campo id="castigo-motivo" label="Motivo">
            <textarea id="castigo-motivo" value={motivoCastigo} onChange={e => setMotivoCastigo(e.target.value)} rows={4}
              style={{ ...estiloInput, minHeight: 96, resize: 'vertical' }} placeholder="Explica por qué ya no se espera recuperar esta cartera" />
          </Campo>
          <p style={{ fontSize: 12, color: C.muted, margin: '10px 0 14px' }}>Castigado: sale de la cartera activa, no se borra; si paga, entra como cartera recuperada.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <BotonSecundario onClick={() => setModalCastigo(false)}>Cancelar</BotonSecundario>
            <BotonPrimario disabled={motivoCastigo.trim().length < 4} onClick={() => { setCastigado(true); setModalCastigo(false); props.onToast('Cartera castigada: sale de la cartera activa.'); }}>
              Castigar
            </BotonPrimario>
          </div>
        </Modal>
      )}

      {certificadoAbierto && clienteCert && resumenCert && cuotasCert && (
        <ModalCertificado tipo={certificadoAbierto} cliente={clienteCert} resumen={resumenCert} cuotas={cuotasCert} onCerrar={() => setCertificadoAbierto(null)} onToast={props.onToast} />
      )}
    </div>
  );
}
