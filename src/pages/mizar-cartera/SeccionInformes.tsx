// Catálogo de informes de cartera (PRD 12H). Todos leen los mismos pagos y cuotas que el resto
// de la demo (vigentes(c.pagos), sin administración anterior en lo que es recaudo), así que los
// totales cuadran entre un informe y otro. Los informes I7, I8, I10, I11, I14, I15 e I16 viven en
// otra pantalla: aquí solo hay un enlace. Los demás (I1 a I6, I9, I12, I13) se calculan aquí mismo.
import React, { useMemo, useState } from 'react';
import { Download, Send } from 'lucide-react';
import {
  C, MESES_CORTOS, money, fechaLarga, finDeMes, Chip, Tarjeta, BotonSecundario, Campo, estiloInput,
  GraficoBarras, Seccion,
  Cliente, Pago, CuotaEstado, ResumenCliente, Proyecto, Persona, FiltroEmpresa,
  PROYECTOS, proyectoPorId, empresaPorId, vigentes,
} from './base';

// ─────────────────────────────────────────────────────────────────────────
// CATÁLOGO
// ─────────────────────────────────────────────────────────────────────────

interface ItemCatalogo { codigo: string; nombre: string; pregunta: string; destino?: Seccion; }

const PANTALLA: Partial<Record<Seccion, string>> = {
  morosos: 'Morosos y cobranza', 'estado-cuenta': 'Estado de cuenta', socios: 'Socios y flujo',
  recompensas: 'Recompensas', bancos: 'Bancos', contabilidad: 'Contabilidad', carteras: 'Carteras y cruces',
};

const CATALOGO: { subtitulo: string; items: ItemCatalogo[] }[] = [
  { subtitulo: 'Recaudo', items: [
    { codigo: 'I1', nombre: 'Recaudo por fecha de pago', pregunta: 'Cuánto entró y por qué concepto, agrupado como tú elijas.' },
    { codigo: 'I2', nombre: 'Recaudo por fecha de registro', pregunta: 'Quién confirmó cada pago y por qué canal llegó.' },
    { codigo: 'I5', nombre: 'Cumplimiento del mes', pregunta: 'De las cuotas que vencían este mes, cuántas se pagaron a tiempo.' },
  ] },
  { subtitulo: 'Por cobrar', items: [
    { codigo: 'I3', nombre: 'Vencimientos por cobrar', pregunta: 'Qué cuotas vencen en el rango elegido y cuánto falta cobrar.' },
    { codigo: 'I4', nombre: 'Proyección de recaudo', pregunta: 'Cuánto se espera recaudar en los próximos 12 meses.' },
    { codigo: 'I6', nombre: 'Cartera por edades', pregunta: 'Cuánto debe cada proyecto, según cuántos días lleva vencido.' },
    { codigo: 'I7', nombre: 'Morosos', pregunta: 'Quién está atrasado y qué gestión se le ha hecho.', destino: 'morosos' },
  ] },
  { subtitulo: 'Clientes', items: [
    { codigo: 'I8', nombre: 'Estado de cuenta', pregunta: 'El plan, los pagos y el saldo de un cliente puntual.', destino: 'estado-cuenta' },
  ] },
  { subtitulo: 'Ventas', items: [
    { codigo: 'I9', nombre: 'Ventas frente a recaudo', pregunta: 'Cuánto se ha vendido en cada proyecto y cuánto de eso ya entró.' },
    { codigo: 'I12', nombre: 'Comisiones', pregunta: 'Cuánto se causó y cuánto falta pagar de comisión de venta.' },
  ] },
  { subtitulo: 'Dinero del grupo', items: [
    { codigo: 'I10', nombre: 'Flujo de caja', pregunta: 'Cuánto entra y cuánto sale del grupo, mes a mes.', destino: 'socios' },
    { codigo: 'I11', nombre: 'Utilidad y reparto por socio', pregunta: 'Cuánto le corresponde a cada socio, ya repartido.', destino: 'socios' },
  ] },
  { subtitulo: 'Seguimiento', items: [
    { codigo: 'I13', nombre: 'Acuerdos y cruces', pregunta: 'Qué clientes tienen un acuerdo especial de pago.' },
    { codigo: 'I14', nombre: 'Recompensas', pregunta: 'Quién está ganando beneficios por pagar a tiempo.', destino: 'recompensas' },
  ] },
  { subtitulo: 'Bancos y contabilidad', items: [
    { codigo: 'I15', nombre: 'Conciliación bancaria', pregunta: 'Si lo que dice el banco cuadra con lo que dice cartera.', destino: 'bancos' },
    { codigo: 'I16', nombre: 'Estados financieros', pregunta: 'Balance y estado de resultados de cada empresa.', destino: 'contabilidad' },
  ] },
];

function rangoDefault(codigo: string): { desde: string; hasta: string } {
  if (codigo === 'I3') return { desde: '2026-09-24', hasta: '2026-12-31' };
  return { desde: '2026-09-01', hasta: '2026-09-30' };
}

// ─────────────────────────────────────────────────────────────────────────
// CÁLCULOS: DATOS COMPARTIDOS
// ─────────────────────────────────────────────────────────────────────────

interface FilaPago { pago: Pago; cliente: Cliente; proyecto: Proyecto; }

// Recaudo real: pagos vigentes (sin anular) y sin lo que es administración anterior.
function pagosDeClientes(clientes: Cliente[]): FilaPago[] {
  return clientes.flatMap(cliente => vigentes(cliente.pagos).filter(p => !p.administracionAnterior)
    .map(pago => ({ pago, cliente, proyecto: proyectoPorId(cliente.raw.proyectoId) })));
}

function enRango(fecha: string, desde: string, hasta: string): boolean { return fecha >= desde && fecha <= hasta; }

// Un abono extraordinario y un saldo a favor también son capital del cliente, aunque no se apliquen a una cuota.
function totalesAplicados(pago: Pago): { capital: number; interes: number; mora: number } {
  const base = pago.aplicaciones.reduce((acc, a) => ({ capital: acc.capital + a.capital, interes: acc.interes + a.interes, mora: acc.mora + a.mora }), { capital: 0, interes: 0, mora: 0 });
  return { ...base, capital: base.capital + (pago.abono?.monto ?? 0) + (pago.saldoFavor ?? 0) };
}

// El último pago vigente que aplicó a esta cuota (se usa para saber si se pagó a tiempo o tarde).
function ultimoPagoQueAplicaCuota(pagos: Pago[], numero: number): Pago | null {
  const relevantes = vigentes(pagos).filter(p => p.aplicaciones.some(a => a.cuota === numero));
  if (relevantes.length === 0) return null;
  return relevantes.reduce((mejor, actual) => (actual.fecha > mejor.fecha ? actual : mejor));
}

function cuotaATiempo(cuota: CuotaEstado, pagos: Pago[]): boolean {
  if (cuota.estado !== 'pagada') return false;
  const ultimo = ultimoPagoQueAplicaCuota(pagos, cuota.numero);
  return !!ultimo && ultimo.fecha <= cuota.vence;
}

function etiquetaOrigen(origen: Pago['origen']): string {
  if (origen === 'oficina') return 'Oficina';
  if (origen === 'whatsapp') return 'WhatsApp';
  if (origen === 'identificado') return 'Identificado después';
  return 'Histórico';
}

// ─────────────────────────────────────────────────────────────────────────
// I1: RECAUDO POR FECHA DE PAGO
// ─────────────────────────────────────────────────────────────────────────

type Agrupador = 'Proyecto' | 'Cuenta' | 'Medio de pago' | 'Día';

interface GrupoRecaudo { clave: string; etiqueta: string; n: number; capital: number; interes: number; mora: number; total: number; }

function agruparRecaudo(filas: FilaPago[], agrupador: Agrupador): GrupoRecaudo[] {
  const mapa = new Map<string, GrupoRecaudo>();
  for (const fila of filas) {
    const clave = agrupador === 'Proyecto' ? fila.proyecto.nombre : agrupador === 'Cuenta' ? fila.pago.cuenta : agrupador === 'Medio de pago' ? fila.pago.medio : fila.pago.fecha;
    const etiqueta = agrupador === 'Día' ? fechaLarga(clave) : clave;
    const t = totalesAplicados(fila.pago);
    const actual = mapa.get(clave) ?? { clave, etiqueta, n: 0, capital: 0, interes: 0, mora: 0, total: 0 };
    actual.n += 1; actual.capital += t.capital; actual.interes += t.interes; actual.mora += t.mora; actual.total += fila.pago.valor;
    mapa.set(clave, actual);
  }
  const grupos = [...mapa.values()];
  return agrupador === 'Día' ? grupos.sort((a, b) => a.clave.localeCompare(b.clave)) : grupos.sort((a, b) => b.total - a.total);
}

// ─────────────────────────────────────────────────────────────────────────
// I2: RECAUDO POR FECHA DE REGISTRO
// ─────────────────────────────────────────────────────────────────────────

interface GrupoConteo { clave: string; n: number; total: number; }

function agruparPorClave(filas: FilaPago[], obtenerClave: (f: FilaPago) => string): GrupoConteo[] {
  const mapa = new Map<string, GrupoConteo>();
  for (const fila of filas) {
    const clave = obtenerClave(fila);
    const actual = mapa.get(clave) ?? { clave, n: 0, total: 0 };
    actual.n += 1; actual.total += fila.pago.valor;
    mapa.set(clave, actual);
  }
  return [...mapa.values()].sort((a, b) => b.total - a.total);
}

// ─────────────────────────────────────────────────────────────────────────
// I3: VENCIMIENTOS POR COBRAR
// ─────────────────────────────────────────────────────────────────────────

interface FilaVencimiento { cliente: Cliente; proyecto: Proyecto; cuota: CuotaEstado; pendiente: number; }

function vencimientosPorCobrar(clientes: Cliente[], resumenes: Map<string, { cuotas: CuotaEstado[]; resumen: ResumenCliente }>, desde: string, hasta: string): FilaVencimiento[] {
  const filas: FilaVencimiento[] = [];
  for (const cliente of clientes) {
    const cuotas = resumenes.get(cliente.raw.id)?.cuotas ?? [];
    for (const cuota of cuotas) {
      if (cuota.estado !== 'pendiente' && cuota.estado !== 'vencida' && cuota.estado !== 'parcial') continue;
      if (!enRango(cuota.vence, desde, hasta)) continue;
      const pendiente = Math.max(0, (cuota.capitalProg + cuota.interesProg) - (cuota.capitalPag + cuota.interesPag));
      filas.push({ cliente, proyecto: proyectoPorId(cliente.raw.proyectoId), cuota, pendiente });
    }
  }
  return filas.sort((a, b) => a.cuota.vence.localeCompare(b.cuota.vence));
}

function subtotalesPorMes(filas: FilaVencimiento[]): { mes: string; n: number; valor: number }[] {
  const mapa = new Map<string, { mes: string; n: number; valor: number }>();
  for (const f of filas) {
    const mes = f.cuota.vence.slice(0, 7);
    const actual = mapa.get(mes) ?? { mes, n: 0, valor: 0 };
    actual.n += 1; actual.valor += f.pendiente;
    mapa.set(mes, actual);
  }
  return [...mapa.values()].sort((a, b) => a.mes.localeCompare(b.mes));
}

function etiquetaMes(mesIso: string): string {
  const [anio, mes] = mesIso.split('-').map(Number);
  return `${MESES_CORTOS[mes - 1]} ${anio}`;
}

// ─────────────────────────────────────────────────────────────────────────
// I4: PROYECCIÓN DE RECAUDO (próximos 12 meses)
// ─────────────────────────────────────────────────────────────────────────

const MESES_PROYECCION = ['2026-10', '2026-11', '2026-12', '2027-01', '2027-02', '2027-03', '2027-04', '2027-05', '2027-06', '2027-07', '2027-08', '2027-09'];

function proyeccionRecaudo(clientes: Cliente[], resumenes: Map<string, { cuotas: CuotaEstado[]; resumen: ResumenCliente }>): { mes: string; valor: number }[] {
  const totales = new Map<string, number>(MESES_PROYECCION.map(m => [m, 0]));
  for (const cliente of clientes) {
    const cuotas = resumenes.get(cliente.raw.id)?.cuotas ?? [];
    for (const cuota of cuotas) {
      if (cuota.estado === 'pagada' || cuota.estado === 'reestructurada') continue;
      const mes = cuota.vence.slice(0, 7);
      if (!totales.has(mes)) continue;
      totales.set(mes, (totales.get(mes) ?? 0) + cuota.capitalProg + cuota.interesProg);
    }
  }
  return MESES_PROYECCION.map(mes => ({ mes, valor: totales.get(mes) ?? 0 }));
}

// ─────────────────────────────────────────────────────────────────────────
// I5: CUMPLIMIENTO DEL MES
// ─────────────────────────────────────────────────────────────────────────

const MESES_CUMPLIMIENTO = ['2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12'];

interface CumplimientoMes { total: number; aTiempo: number; tarde: number; sinPagar: number; valorATiempo: number; valorTarde: number; valorSinPagar: number; }

function cumplimientoDelMes(clientes: Cliente[], resumenes: Map<string, { cuotas: CuotaEstado[]; resumen: ResumenCliente }>, mes: string): CumplimientoMes {
  const r: CumplimientoMes = { total: 0, aTiempo: 0, tarde: 0, sinPagar: 0, valorATiempo: 0, valorTarde: 0, valorSinPagar: 0 };
  for (const cliente of clientes) {
    const cuotas = resumenes.get(cliente.raw.id)?.cuotas ?? [];
    for (const cuota of cuotas) {
      if (cuota.vence.slice(0, 7) !== mes) continue;
      r.total += 1;
      const programado = cuota.capitalProg + cuota.interesProg;
      if (cuotaATiempo(cuota, cliente.pagos)) { r.aTiempo += 1; r.valorATiempo += programado; continue; }
      if (cuota.estado === 'pagada') {
        const ultimo = ultimoPagoQueAplicaCuota(cliente.pagos, cuota.numero);
        if (ultimo && ultimo.fecha <= finDeMes(cuota.vence)) { r.tarde += 1; r.valorTarde += programado; continue; }
      }
      r.sinPagar += 1; r.valorSinPagar += programado;
    }
  }
  return r;
}

// ─────────────────────────────────────────────────────────────────────────
// I6: CARTERA POR EDADES
// ─────────────────────────────────────────────────────────────────────────

const TRAMOS = ['Al día', '1-30', '31-60', '61-90', '91-180', '>180'] as const;

function tramoDeAtraso(dias: number): typeof TRAMOS[number] {
  if (dias <= 30) return '1-30';
  if (dias <= 60) return '31-60';
  if (dias <= 90) return '61-90';
  if (dias <= 180) return '91-180';
  return '>180';
}

function carteraPorEdades(clientes: Cliente[], resumenes: Map<string, { cuotas: CuotaEstado[]; resumen: ResumenCliente }>, proyectos: Proyecto[]): Record<string, Record<string, number>> {
  const matriz: Record<string, Record<string, number>> = {};
  for (const tramo of TRAMOS) {
    matriz[tramo] = {};
    for (const proyecto of proyectos) matriz[tramo][proyecto.id] = 0;
  }
  for (const cliente of clientes) {
    const proyecto = proyectoPorId(cliente.raw.proyectoId);
    if (!(proyecto.id in matriz['Al día'])) continue;
    const datos = resumenes.get(cliente.raw.id);
    if (!datos) continue;
    let capitalVencido = 0;
    for (const cuota of datos.cuotas) {
      if (cuota.estado !== 'vencida' && cuota.estado !== 'parcial') continue;
      const capitalPendiente = Math.max(0, cuota.capitalProg - cuota.capitalPag);
      const interesPendiente = Math.max(0, cuota.interesProg - cuota.interesPag);
      capitalVencido += capitalPendiente;
      const tramo = tramoDeAtraso(cuota.diasAtraso);
      matriz[tramo][proyecto.id] += capitalPendiente + interesPendiente;
    }
    matriz['Al día'][proyecto.id] += Math.max(0, datos.resumen.saldoCapital - capitalVencido);
  }
  return matriz;
}

// ─────────────────────────────────────────────────────────────────────────
// I9: VENTAS FRENTE A RECAUDO  ·  I12: COMISIONES  ·  I13: ACUERDOS
// ─────────────────────────────────────────────────────────────────────────

interface FilaVentas { proyecto: Proyecto; contratos: number; vendido: number; recaudado: number; pctRecaudado: number; saldo: number; }

function ventasFrenteRecaudo(clientes: Cliente[], resumenes: Map<string, { cuotas: CuotaEstado[]; resumen: ResumenCliente }>, proyectos: Proyecto[]): FilaVentas[] {
  return proyectos.map(proyecto => {
    const clientesProyecto = clientes.filter(c => c.raw.proyectoId === proyecto.id);
    const vendido = clientesProyecto.reduce((s, c) => s + c.raw.valorVenta, 0);
    const recaudado = clientesProyecto.reduce((s, c) => s + c.raw.cuotaInicial + (resumenes.get(c.raw.id)?.resumen.capitalPagado ?? 0), 0);
    return { proyecto, contratos: clientesProyecto.length, vendido, recaudado, pctRecaudado: vendido > 0 ? (recaudado / vendido) * 100 : 0, saldo: vendido - recaudado };
  }).filter(f => f.contratos > 0);
}

// Regla fija de comisión (a validar con el contador): Cantalta 20 %, resto de Bucaramanga 3 %, Cúcuta 5 %.
function pctComision(proyecto: Proyecto): number {
  if (proyecto.id === 'cantalta') return 20;
  return proyecto.sede === 'Bucaramanga' ? 3 : 5;
}

interface FilaComision { proyecto: Proyecto; pct: number; causado: number; pagado: number; pendiente: number; }

function comisionesPorProyecto(clientes: Cliente[], proyectos: Proyecto[]): FilaComision[] {
  return proyectos.map(proyecto => {
    const vendido = clientes.filter(c => c.raw.proyectoId === proyecto.id).reduce((s, c) => s + c.raw.valorVenta, 0);
    const pct = pctComision(proyecto);
    const causado = vendido * pct / 100;
    const pagado = causado * 0.6;
    return { proyecto, pct, causado, pagado, pendiente: causado - pagado };
  }).filter(f => f.causado > 0);
}

// ─────────────────────────────────────────────────────────────────────────
// PIEZAS VISUALES
// ─────────────────────────────────────────────────────────────────────────

const celda: React.CSSProperties = { padding: '8px 6px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' };

function BarraSimple({ etiqueta, valor, max }: { etiqueta: string; valor: number; max: number }) {
  const pct = max > 0 ? Math.max(2, (valor / max) * 100) : 2;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 12, color: C.muted, width: 64, flexShrink: 0 }}>{etiqueta}</span>
      <div style={{ flex: 1, background: C.surfaceStrong, borderRadius: 6, overflow: 'hidden', height: 16 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: C.navy, borderRadius: 6 }} />
      </div>
      <span style={{ fontSize: 12, color: C.ink, fontWeight: 600, width: 110, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{money(valor)}</span>
    </div>
  );
}

function TarjetaCatalogo({ item, abierto, onVer, onIrA }: { item: ItemCatalogo; abierto: boolean; onVer: () => void; onIrA: (s: Seccion) => void }) {
  return (
    <div style={{ background: C.paper, border: `1px solid ${abierto ? C.navy : C.line}`, borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Chip tono={abierto ? 'navy' : 'muted'} texto={item.codigo} />
        <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>{item.nombre}</p>
      </div>
      <p style={{ fontSize: 12, color: C.muted, margin: 0, flex: 1 }}>{item.pregunta}</p>
      {item.destino
        ? <BotonSecundario onClick={() => onIrA(item.destino!)}>Abrir en {PANTALLA[item.destino] ?? item.destino}</BotonSecundario>
        : <BotonSecundario onClick={onVer}>Ver</BotonSecundario>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────

export function SeccionInformes(props: {
  clientes: Cliente[]; resumenes: Map<string, { cuotas: CuotaEstado[]; resumen: ResumenCliente }>;
  empresa: FiltroEmpresa; persona: Persona; onIrA: (s: Seccion) => void; onToast: (m: string) => void;
}) {
  const { clientes, resumenes, empresa, onIrA, onToast } = props;
  const [informeAbierto, setInformeAbierto] = useState('I1');
  const [proyectoId, setProyectoId] = useState('todos');
  const [desde, setDesde] = useState(() => rangoDefault('I1').desde);
  const [hasta, setHasta] = useState(() => rangoDefault('I1').hasta);
  const [agrupador, setAgrupador] = useState<Agrupador>('Proyecto');
  const [mesCumplimiento, setMesCumplimiento] = useState('2026-09');

  function abrirInforme(codigo: string) {
    setInformeAbierto(codigo);
    const rango = rangoDefault(codigo);
    setDesde(rango.desde);
    setHasta(rango.hasta);
  }

  const proyectosDisponibles = useMemo(() => {
    const ids = new Set(clientes.map(c => c.raw.proyectoId));
    return PROYECTOS.filter(p => ids.has(p.id));
  }, [clientes]);

  const clientesFiltrados = useMemo(
    () => (proyectoId === 'todos' ? clientes : clientes.filter(c => c.raw.proyectoId === proyectoId)),
    [clientes, proyectoId],
  );
  const proyectosEnVista = useMemo(() => {
    const ids = new Set(clientesFiltrados.map(c => c.raw.proyectoId));
    return PROYECTOS.filter(p => ids.has(p.id));
  }, [clientesFiltrados]);

  const filasPagoRango = useMemo(() => pagosDeClientes(clientesFiltrados).filter(f => enRango(f.pago.fecha, desde, hasta)), [clientesFiltrados, desde, hasta]);

  const usaFechas = informeAbierto === 'I1' || informeAbierto === 'I2' || informeAbierto === 'I3';
  const usaMes = informeAbierto === 'I5';
  const usaAgrupador = informeAbierto === 'I1';

  const botonesAccion = (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <BotonSecundario onClick={() => onToast('En la plataforma real esto descarga el informe en Excel con los mismos filtros que ves aquí.')}><Download size={15} />Exportar a Excel</BotonSecundario>
      <BotonSecundario onClick={() => onToast('En la plataforma real esto guarda esta combinación de filtros como un informe propio, listo para abrir después.')}>Guardar como informe propio</BotonSecundario>
      <BotonSecundario onClick={() => onToast('En la plataforma real esto programa el envío periódico de este informe por correo.')}><Send size={15} />Programar envío por correo</BotonSecundario>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Informes</h1>
      <p style={{ fontSize: 14, color: C.muted, margin: 0, maxWidth: 720 }}>
        Todos leen los mismos pagos, así que los totales cuadran entre informes.
      </p>

      {CATALOGO.map(grupo => (
        <div key={grupo.subtitulo}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.muted, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 0.4 }}>{grupo.subtitulo}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
            {grupo.items.map(item => (
              <TarjetaCatalogo key={item.codigo} item={item} abierto={informeAbierto === item.codigo} onVer={() => abrirInforme(item.codigo)} onIrA={onIrA} />
            ))}
          </div>
        </div>
      ))}

      <Tarjeta>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'flex-end', marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.ink, margin: '0 0 4px' }}>Empresa</p>
            <Chip tono="navy" texto={empresa === 'grupo' ? 'Grupo' : empresaPorId(empresa).corto} />
          </div>
          <Campo id="informe-proyecto" label="Proyecto">
            <select id="informe-proyecto" value={proyectoId} onChange={e => setProyectoId(e.target.value)} style={{ ...estiloInput, width: 'auto' }}>
              <option value="todos">Todos</option>
              {proyectosDisponibles.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </Campo>
          {usaFechas && (
            <>
              <Campo id="informe-desde" label="Desde">
                <input id="informe-desde" type="date" value={desde} onChange={e => setDesde(e.target.value || desde)} style={{ ...estiloInput, width: 'auto' }} />
              </Campo>
              <Campo id="informe-hasta" label="Hasta">
                <input id="informe-hasta" type="date" value={hasta} onChange={e => setHasta(e.target.value || hasta)} style={{ ...estiloInput, width: 'auto' }} />
              </Campo>
            </>
          )}
          {usaMes && (
            <Campo id="informe-mes" label="Mes">
              <select id="informe-mes" value={mesCumplimiento} onChange={e => setMesCumplimiento(e.target.value)} style={{ ...estiloInput, width: 'auto' }}>
                {MESES_CUMPLIMIENTO.map(m => <option key={m} value={m}>{etiquetaMes(m)}</option>)}
              </select>
            </Campo>
          )}
          {usaAgrupador && (
            <Campo id="informe-agrupador" label="Agrupar por">
              <select id="informe-agrupador" value={agrupador} onChange={e => setAgrupador(e.target.value as Agrupador)} style={{ ...estiloInput, width: 'auto' }}>
                <option value="Proyecto">Proyecto</option><option value="Cuenta">Cuenta</option>
                <option value="Medio de pago">Medio de pago</option><option value="Día">Día</option>
              </select>
            </Campo>
          )}
        </div>
        {botonesAccion}
      </Tarjeta>

      {informeAbierto === 'I1' && (() => {
        const grupos = agruparRecaudo(filasPagoRango, agrupador);
        const totales = grupos.reduce((acc, g) => ({ n: acc.n + g.n, capital: acc.capital + g.capital, interes: acc.interes + g.interes, mora: acc.mora + g.mora, total: acc.total + g.total }),
          { n: 0, capital: 0, interes: 0, mora: 0, total: 0 });
        const detalle = [...filasPagoRango].sort((a, b) => (a.pago.fecha < b.pago.fecha ? 1 : a.pago.fecha > b.pago.fecha ? -1 : 0));
        return (
          <Tarjeta>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}>I1 · Recaudo por fecha de pago</p>
            <p style={{ fontSize: 13, color: C.muted, margin: '0 0 14px' }}>{fechaLarga(desde)} a {fechaLarga(hasta)}, agrupado por {agrupador.toLowerCase()}.</p>
            <div style={{ overflowX: 'auto', marginBottom: 18 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 620 }}>
                <thead><tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                  <th style={celda}>{agrupador}</th><th style={celda}>N.º de pagos</th><th style={celda}>Capital</th><th style={celda}>Interés</th><th style={celda}>Mora</th><th style={celda}>Total</th>
                </tr></thead>
                <tbody>
                  {grupos.map(g => (
                    <tr key={g.clave} style={{ borderBottom: `1px solid ${C.line}` }}>
                      <td style={{ ...celda, fontWeight: 600 }}>{g.etiqueta}</td><td style={celda}>{g.n}</td>
                      <td style={celda}>{money(g.capital)}</td><td style={celda}>{money(g.interes)}</td><td style={celda}>{money(g.mora)}</td><td style={{ ...celda, fontWeight: 700 }}>{money(g.total)}</td>
                    </tr>
                  ))}
                  <tr style={{ background: C.surfaceStrong }}>
                    <td style={{ ...celda, fontWeight: 700 }}>Total</td><td style={{ ...celda, fontWeight: 700 }}>{totales.n}</td>
                    <td style={{ ...celda, fontWeight: 700 }}>{money(totales.capital)}</td><td style={{ ...celda, fontWeight: 700 }}>{money(totales.interes)}</td>
                    <td style={{ ...celda, fontWeight: 700 }}>{money(totales.mora)}</td><td style={{ ...celda, fontWeight: 700 }}>{money(totales.total)}</td>
                  </tr>
                  {grupos.length === 0 && <tr><td colSpan={6} style={{ padding: 16, textAlign: 'center', color: C.muted }}>No hay pagos en este rango.</td></tr>}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: '0 0 8px' }}>Detalle de pagos</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
                <thead><tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                  <th style={celda}>Fecha</th><th style={celda}>Recibo</th><th style={celda}>Cliente</th><th style={celda}>Valor</th><th style={celda}>Medio</th><th style={celda}>Cuenta</th>
                </tr></thead>
                <tbody>
                  {detalle.map((f, i) => (
                    <tr key={`${f.pago.recibo}-${i}`} style={{ borderBottom: `1px solid ${C.line}` }}>
                      <td style={celda}>{fechaLarga(f.pago.fecha)}</td><td style={celda}>{f.pago.recibo}</td><td style={celda}>{f.cliente.raw.nombre}</td>
                      <td style={celda}>{money(f.pago.valor)}</td><td style={celda}>{f.pago.medio}</td><td style={celda}>{f.pago.cuenta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tarjeta>
        );
      })()}

      {informeAbierto === 'I2' && (() => {
        const porConfirmo = agruparPorClave(filasPagoRango, f => f.pago.confirmadoPor ?? 'Registro histórico');
        const porOrigen = agruparPorClave(filasPagoRango, f => etiquetaOrigen(f.pago.origen));
        return (
          <Tarjeta>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}>I2 · Recaudo por fecha de registro</p>
            <p style={{ fontSize: 13, color: C.muted, margin: '0 0 14px' }}>{fechaLarga(desde)} a {fechaLarga(hasta)}.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 12 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: '0 0 8px' }}>Por quién lo confirmó</p>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 280 }}>
                    <thead><tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}><th style={celda}>Confirmó</th><th style={celda}>N.º</th><th style={celda}>Total</th></tr></thead>
                    <tbody>
                      {porConfirmo.map(g => (
                        <tr key={g.clave} style={{ borderBottom: `1px solid ${C.line}` }}><td style={{ ...celda, fontWeight: 600 }}>{g.clave}</td><td style={celda}>{g.n}</td><td style={celda}>{money(g.total)}</td></tr>
                      ))}
                      {porConfirmo.length === 0 && <tr><td colSpan={3} style={{ padding: 12, textAlign: 'center', color: C.muted }}>Sin pagos en este rango.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: '0 0 8px' }}>Por origen</p>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 280 }}>
                    <thead><tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}><th style={celda}>Origen</th><th style={celda}>N.º</th><th style={celda}>Total</th></tr></thead>
                    <tbody>
                      {porOrigen.map(g => (
                        <tr key={g.clave} style={{ borderBottom: `1px solid ${C.line}` }}><td style={{ ...celda, fontWeight: 600 }}>{g.clave}</td><td style={celda}>{g.n}</td><td style={celda}>{money(g.total)}</td></tr>
                      ))}
                      {porOrigen.length === 0 && <tr><td colSpan={3} style={{ padding: 12, textAlign: 'center', color: C.muted }}>Sin pagos en este rango.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Sirve para cuadrar con el banco: un pago identificado tarde se registra después de la fecha en que el cliente pagó.</p>
          </Tarjeta>
        );
      })()}

      {informeAbierto === 'I3' && (() => {
        const filas = vencimientosPorCobrar(clientesFiltrados, resumenes, desde, hasta);
        const subtotales = subtotalesPorMes(filas);
        const total = filas.reduce((s, f) => s + f.pendiente, 0);
        return (
          <Tarjeta>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}>I3 · Vencimientos por cobrar</p>
            <p style={{ fontSize: 13, color: C.muted, margin: '0 0 14px' }}>{fechaLarga(desde)} a {fechaLarga(hasta)} · total {money(total)}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              {subtotales.map(s => <BarraSimple key={s.mes} etiqueta={etiquetaMes(s.mes)} valor={s.valor} max={Math.max(...subtotales.map(x => x.valor), 1)} />)}
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 720 }}>
                <thead><tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                  <th style={celda}>Vence</th><th style={celda}>Cliente</th><th style={celda}>Proyecto</th><th style={celda}>Cuota n.º</th><th style={celda}>Pendiente</th><th style={celda}>Estado</th>
                </tr></thead>
                <tbody>
                  {filas.map((f, i) => (
                    <tr key={`${f.cliente.raw.id}-${f.cuota.numero}-${i}`} style={{ borderBottom: `1px solid ${C.line}` }}>
                      <td style={celda}>{fechaLarga(f.cuota.vence)}</td><td style={celda}>{f.cliente.raw.nombre}</td><td style={celda}>{f.proyecto.nombre}</td>
                      <td style={celda}>{f.cuota.numero}</td><td style={{ ...celda, fontWeight: 600 }}>{money(f.pendiente)}</td>
                      <td style={celda}><Chip tono={f.cuota.estado === 'vencida' ? 'red' : f.cuota.estado === 'parcial' ? 'amber' : 'muted'} texto={f.cuota.estado === 'vencida' ? 'Vencida' : f.cuota.estado === 'parcial' ? 'Parcial' : 'Próxima'} /></td>
                    </tr>
                  ))}
                  {filas.length === 0 && <tr><td colSpan={6} style={{ padding: 16, textAlign: 'center', color: C.muted }}>No hay cuotas por cobrar en este rango.</td></tr>}
                </tbody>
              </table>
            </div>
          </Tarjeta>
        );
      })()}

      {informeAbierto === 'I4' && (() => {
        const filas = proyeccionRecaudo(clientesFiltrados, resumenes);
        const total = filas.reduce((s, f) => s + f.valor, 0);
        const max = Math.max(...filas.map(f => f.valor), 1);
        return (
          <Tarjeta>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}>I4 · Proyección de recaudo</p>
            <p style={{ fontSize: 13, color: C.muted, margin: '0 0 14px' }}>Octubre 2026 a septiembre 2027 · total esperado {money(total)}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {filas.map(f => <BarraSimple key={f.mes} etiqueta={etiquetaMes(f.mes)} valor={f.valor} max={max} />)}
            </div>
          </Tarjeta>
        );
      })()}

      {informeAbierto === 'I5' && (() => {
        const c = cumplimientoDelMes(clientesFiltrados, resumenes, mesCumplimiento);
        const pct = c.total > 0 ? Math.round((c.aTiempo / c.total) * 100) : 0;
        return (
          <Tarjeta>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}>I5 · Cumplimiento del mes</p>
            <p style={{ fontSize: 13, color: C.muted, margin: '0 0 14px' }}>Cuotas que vencían en {etiquetaMes(mesCumplimiento)} · {c.total} en total</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
              <div style={{ background: C.greenSoft, borderRadius: 8, padding: 12 }}>
                <p style={{ fontSize: 12, color: C.green, margin: '0 0 4px', fontWeight: 700 }}>A tiempo</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: C.green, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{c.aTiempo}</p>
                <p style={{ fontSize: 12, color: C.green, margin: '4px 0 0' }}>{money(c.valorATiempo)}</p>
              </div>
              <div style={{ background: C.amberSoft, borderRadius: 8, padding: 12 }}>
                <p style={{ fontSize: 12, color: C.amber, margin: '0 0 4px', fontWeight: 700 }}>Tarde (dentro del mes)</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: C.amber, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{c.tarde}</p>
                <p style={{ fontSize: 12, color: C.amber, margin: '4px 0 0' }}>{money(c.valorTarde)}</p>
              </div>
              <div style={{ background: C.redSoft, borderRadius: 8, padding: 12 }}>
                <p style={{ fontSize: 12, color: C.red, margin: '0 0 4px', fontWeight: 700 }}>Sin pagar</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: C.red, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{c.sinPagar}</p>
                <p style={{ fontSize: 12, color: C.red, margin: '4px 0 0' }}>{money(c.valorSinPagar)}</p>
              </div>
            </div>
            <p style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{pct} % de cumplimiento</p>
          </Tarjeta>
        );
      })()}

      {informeAbierto === 'I6' && (() => {
        const matriz = carteraPorEdades(clientesFiltrados, resumenes, proyectosEnVista);
        return (
          <Tarjeta>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}>I6 · Cartera por edades</p>
            <p style={{ fontSize: 13, color: C.muted, margin: '0 0 14px' }}>Capital más interés pendiente de las cuotas vencidas, según cuántos días lleva vencida cada una.</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 560 }}>
                <thead><tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                  <th style={celda} />{proyectosEnVista.map(p => <th key={p.id} style={celda}>{p.nombre}</th>)}<th style={celda}>Total</th>
                </tr></thead>
                <tbody>
                  {TRAMOS.map(tramo => {
                    const fila = matriz[tramo];
                    const total = proyectosEnVista.reduce((s, p) => s + (fila[p.id] ?? 0), 0);
                    return (
                      <tr key={tramo} style={{ borderBottom: `1px solid ${C.line}` }}>
                        <td style={{ ...celda, fontWeight: 600 }}>{tramo}</td>
                        {proyectosEnVista.map(p => <td key={p.id} style={celda}>{money(fila[p.id] ?? 0)}</td>)}
                        <td style={{ ...celda, fontWeight: 700 }}>{money(total)}</td>
                      </tr>
                    );
                  })}
                  {proyectosEnVista.length === 0 && <tr><td colSpan={2} style={{ padding: 16, textAlign: 'center', color: C.muted }}>No hay clientes para esta empresa.</td></tr>}
                </tbody>
              </table>
            </div>
          </Tarjeta>
        );
      })()}

      {informeAbierto === 'I9' && (() => {
        const filas = ventasFrenteRecaudo(clientesFiltrados, resumenes, proyectosEnVista);
        return (
          <Tarjeta>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 14px' }}>I9 · Ventas frente a recaudo</p>
            {filas.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <GraficoBarras datos={filas.map(f => ({ mes: f.proyecto.prefijo, programado: f.vendido, recaudado: f.recaudado }))} />
                <p style={{ fontSize: 12, color: C.muted, margin: '4px 0 0' }}>Programado = valor vendido · Recaudado = cuota inicial + capital pagado.</p>
              </div>
            )}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
                <thead><tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                  <th style={celda}>Proyecto</th><th style={celda}>Contratos</th><th style={celda}>Vendido</th><th style={celda}>Recaudado</th><th style={celda}>% recaudado</th><th style={celda}>Saldo por cobrar</th>
                </tr></thead>
                <tbody>
                  {filas.map(f => (
                    <tr key={f.proyecto.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                      <td style={{ ...celda, fontWeight: 600 }}>{f.proyecto.nombre}</td><td style={celda}>{f.contratos}</td>
                      <td style={celda}>{money(f.vendido)}</td><td style={celda}>{money(f.recaudado)}</td>
                      <td style={celda}>{Math.round(f.pctRecaudado)} %</td><td style={celda}>{money(f.saldo)}</td>
                    </tr>
                  ))}
                  {filas.length === 0 && <tr><td colSpan={6} style={{ padding: 16, textAlign: 'center', color: C.muted }}>No hay ventas para esta empresa.</td></tr>}
                </tbody>
              </table>
            </div>
          </Tarjeta>
        );
      })()}

      {informeAbierto === 'I12' && (() => {
        const filas = comisionesPorProyecto(clientesFiltrados, proyectosEnVista);
        return (
          <Tarjeta>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}>I12 · Comisiones</p>
            <p style={{ fontSize: 13, color: C.muted, margin: '0 0 14px' }}>Regla fija de la demo: Miradores de Cantalta 20 %, resto de Bucaramanga 3 %, Cúcuta 5 % del valor de venta. El pagado asume el 60 % ya desembolsado.</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 620 }}>
                <thead><tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                  <th style={celda}>Proyecto</th><th style={celda}>%</th><th style={celda}>Causado</th><th style={celda}>Pagado</th><th style={celda}>Pendiente</th>
                </tr></thead>
                <tbody>
                  {filas.map(f => (
                    <tr key={f.proyecto.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                      <td style={{ ...celda, fontWeight: 600 }}>{f.proyecto.nombre}</td><td style={celda}>{f.pct} %</td>
                      <td style={celda}>{money(f.causado)}</td><td style={celda}>{money(f.pagado)}</td><td style={{ ...celda, fontWeight: 700 }}>{money(f.pendiente)}</td>
                    </tr>
                  ))}
                  {filas.length === 0 && <tr><td colSpan={5} style={{ padding: 16, textAlign: 'center', color: C.muted }}>No hay ventas para esta empresa.</td></tr>}
                </tbody>
              </table>
            </div>
          </Tarjeta>
        );
      })()}

      {informeAbierto === 'I13' && (() => {
        const filas = clientesFiltrados.filter(c => c.acuerdo);
        return (
          <Tarjeta>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 14px' }}>I13 · Acuerdos y cruces</p>
            <div style={{ overflowX: 'auto', marginBottom: 14 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
                <thead><tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                  <th style={celda}>Cliente</th><th style={celda}>Fecha</th><th style={celda}>Cuotas</th><th style={celda}>Valor cuota</th><th style={celda}>Autorizó</th>
                </tr></thead>
                <tbody>
                  {filas.map(c => (
                    <tr key={c.raw.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                      <td style={{ ...celda, fontWeight: 600 }}>{c.raw.nombre}</td><td style={celda}>{fechaLarga(c.acuerdo!.fecha)}</td>
                      <td style={celda}>{c.acuerdo!.cuotas}</td><td style={celda}>{money(c.acuerdo!.valorCuota)}</td><td style={celda}>{c.acuerdo!.autorizadoPor}</td>
                    </tr>
                  ))}
                  {filas.length === 0 && <tr><td colSpan={5} style={{ padding: 16, textAlign: 'center', color: C.muted }}>No hay acuerdos vigentes para esta empresa.</td></tr>}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Los cruces del periodo están en Carteras y cruces.</p>
              <BotonSecundario onClick={() => onIrA('carteras')}>Abrir Carteras y cruces</BotonSecundario>
            </div>
          </Tarjeta>
        );
      })()}
    </div>
  );
}
