import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, CreditCard, ClipboardCheck, Users, ShieldAlert, Settings,
  Search, X, ChevronRight, Download, Send, Paperclip,
  AlertTriangle, Calendar, Building2, TrendingUp,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────
// TOKENS Y CONSTANTES
// ─────────────────────────────────────────────────────────────────────────

const HOY = '2026-09-23';

const C = {
  paper: '#ffffff', surface: '#f5f8fa', surfaceStrong: '#eaf0f6',
  ink: '#2c2f36', muted: '#5a6472', line: '#dfe3eb', lineStrong: '#c3cdd9',
  navy: '#0a2342', navyLight: '#16335c',
  rojo: '#d12e45', rojoDark: '#a4123a',
  green: '#245645', greenSoft: '#e2eee8',
  amber: '#a65b08', amberSoft: '#fff2d8',
  blue: '#235e83', blueSoft: '#e1eff7',
  red: '#9b4137', redSoft: '#f8e6e2',
  purple: '#69507e', purpleSoft: '#ece6f2',
};

const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const fmtCOP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

function money(n: number): string { return fmtCOP.format(Math.round(n)); }

function fechaLarga(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MESES_CORTOS[m - 1]} ${y}`;
}

function diffDays(a: string, b: string): number {
  return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86400000);
}

function sumarMeses(base: string, meses: number, diaCorte: number): string {
  const [y, m] = base.split('-').map(Number);
  const total = (m - 1) + meses;
  const anio = y + Math.floor(total / 12);
  const mes = (total % 12) + 1;
  const ultimoDia = new Date(Date.UTC(anio, mes, 0)).getUTCDate();
  const dia = Math.min(diaCorte, ultimoDia);
  return `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

function finDeMes(fecha: string): string {
  const [y, m] = fecha.split('-').map(Number);
  const ultimoDia = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return `${y}-${String(m).padStart(2, '0')}-${String(ultimoDia).padStart(2, '0')}`;
}

function fechaAntes(fecha: string, dias: number): string {
  const t = Date.parse(fecha + 'T00:00:00Z') - dias * 86400000;
  const d = new Date(t);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

function fechaDespues(fecha: string, dias: number): string { return fechaAntes(fecha, -dias); }

// ─────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────

type Sede = 'Bucaramanga' | 'Cúcuta';
type Medio = 'Transferencia' | 'Efectivo' | 'Consignación';
type Seccion = 'inicio' | 'estado-cuenta' | 'por-verificar' | 'morosos' | 'socios' | 'configuracion';

interface SocioPeriodo { desde: string; hasta: string | null; participantes: { nombre: string; pct: number }[]; }

interface Proyecto {
  id: string; nombre: string; sede: Sede; conMora: boolean; alerta3Cuotas: boolean;
  cuentaDefault: string; socios: SocioPeriodo[];
}

interface CuotaPlan { numero: number; vence: string; capitalProg: number; interesProg: number; }

interface Aplicacion { cuota: number; mora: number; interes: number; capital: number; }

interface Pago {
  recibo: string; fecha: string; valor: number; medio: Medio; cuenta: string; referencia: string;
  aplicaciones: Aplicacion[]; abono?: { monto: number; modo: 'plazo' | 'cuota' };
  soporte?: boolean; administracionAnterior?: boolean;
}

interface ClienteRaw {
  id: string; nombre: string; cedula: string; telefono: string; proyectoId: string; inmueble: string;
  valorVenta: number; cuotaInicial: number; plazoMeses: number; primeraCuota: string; diaCorte: number;
  cuotasCompletas: number;
  soloMizar?: boolean; referidoDeId?: string; cuotaFijaCucuta?: number;
  parcialValorPagado?: number;
  abonoMonto?: number; abonoModo?: 'plazo' | 'cuota'; abonoFecha?: string;
  administracionAnteriorHasta?: number;
}

interface Cliente { raw: ClienteRaw; plan: CuotaPlan[]; pagos: Pago[]; }

interface CuotaEstado extends CuotaPlan {
  capitalPag: number; interesPag: number; moraPag: number; moraPendiente: number;
  estado: 'pagada' | 'parcial' | 'vencida' | 'pendiente'; diasAtraso: number;
}

interface ResumenCliente {
  totalPagado: number; capitalPagado: number; saldoCapital: number; valorVencido: number; moraAHoy: number;
  proximaCuota: CuotaEstado | null; cuotasVencidas: number; estadoGeneral: 'AL DÍA' | 'EN MORA' | 'ALERTA 3 CUOTAS';
}

// ─────────────────────────────────────────────────────────────────────────
// MOTOR DE CÁLCULO (funciones puras)
// ─────────────────────────────────────────────────────────────────────────

function generarPlan(
  valorVenta: number, cuotaInicial: number, plazoMeses: number, primeraCuota: string, diaCorte: number,
  conInteres: boolean, cuotaFijaCucuta?: number,
): CuotaPlan[] {
  const capital = valorVenta - cuotaInicial;
  const cuotas: CuotaPlan[] = [];
  if (conInteres) {
    const i = 0.01;
    const cuotaFija = capital * (i / (1 - Math.pow(1 + i, -plazoMeses)));
    let saldo = capital;
    for (let n = 1; n <= plazoMeses; n++) {
      const interes = Math.round(saldo * i);
      let capitalCuota = Math.round(cuotaFija - interes);
      if (n === plazoMeses) capitalCuota = Math.round(saldo);
      saldo -= capitalCuota;
      cuotas.push({ numero: n, vence: sumarMeses(primeraCuota, n - 1, diaCorte), capitalProg: capitalCuota, interesProg: interes });
    }
  } else {
    const fija = cuotaFijaCucuta ?? Math.round(capital / plazoMeses);
    let acumulado = 0;
    for (let n = 1; n <= plazoMeses; n++) {
      const valor = n === plazoMeses ? Math.round(capital - acumulado) : fija;
      acumulado += valor;
      cuotas.push({ numero: n, vence: sumarMeses(primeraCuota, n - 1, diaCorte), capitalProg: valor, interesProg: 0 });
    }
  }
  return cuotas;
}

// La mora corre desde que vence el periodo de gracia, sobre lo que el cliente siga debiendo
// de esa cuota: cada abono parcial baja la base desde la fecha en que se hizo.
interface EventoCuota { fecha: string; aplicado: number; }

function moraDevengada(valorCuota: number, vence: string, eventos: EventoCuota[], hasta: string, tasaMensual: number, diasGracia: number): number {
  const tasaDiaria = tasaMensual / 100 / 30;
  let desde = fechaDespues(vence, diasGracia);
  let saldo = valorCuota;
  let total = 0;
  for (const e of eventos) {
    if (e.fecha > hasta) break;
    if (e.fecha > desde) { total += saldo * tasaDiaria * diffDays(desde, e.fecha); desde = e.fecha; }
    saldo = Math.max(0, saldo - e.aplicado);
  }
  if (saldo > 0.5 && hasta > desde) total += saldo * tasaDiaria * diffDays(desde, hasta);
  return Math.round(total);
}

interface SaldoCuota {
  numero: number; vence: string; valorCuota: number; saldoCapital: number; saldoInteres: number;
  moraPagPrevia: number; eventos: EventoCuota[];
}

function aplicarPagoAPlan(
  saldos: SaldoCuota[], valor: number, fechaPago: string, conMora: boolean, tasaMensual: number, diasGracia: number,
): { aplicaciones: Aplicacion[]; sobra: number } {
  let restante = valor;
  const aplicaciones: Aplicacion[] = [];
  for (const s of saldos) {
    if (restante <= 0.5) break;
    if (s.saldoCapital <= 0.5 && s.saldoInteres <= 0.5) continue;
    let mora = 0, interes = 0, capital = 0;
    if (conMora && fechaPago > s.vence) {
      const moraPendiente = Math.max(0, moraDevengada(s.valorCuota, s.vence, s.eventos, fechaPago, tasaMensual, diasGracia) - s.moraPagPrevia);
      if (moraPendiente > 0) { mora = Math.min(restante, moraPendiente); restante -= mora; }
    }
    if (restante > 0.5 && s.saldoInteres > 0.5) { interes = Math.min(restante, s.saldoInteres); restante -= interes; }
    if (restante > 0.5 && s.saldoCapital > 0.5) { capital = Math.min(restante, s.saldoCapital); restante -= capital; }
    if (mora > 0 || interes > 0 || capital > 0) aplicaciones.push({ cuota: s.numero, mora, interes, capital });
  }
  return { aplicaciones, sobra: Math.max(0, Math.round(restante)) };
}

type PagoConFecha = { fecha: string; aplicaciones: Aplicacion[] };

// Un pago cubre lo vencido, la cuota del mes y la próxima cuota sin pagar; solo lo que
// sobre después de eso es abono extraordinario a capital.
function saldosElegiblesPara(plan: CuotaPlan[], pagos: PagoConFecha[], fecha: string): SaldoCuota[] {
  const saldos = construirSaldos(plan, pagos);
  const finMes = finDeMes(fecha);
  const proxima = saldos.find(s => s.vence >= fecha && (s.saldoCapital > 0.5 || s.saldoInteres > 0.5));
  const limite = proxima && proxima.vence > finMes ? proxima.vence : finMes;
  return saldos.filter(s => s.vence <= limite);
}

function acumularAplicaciones(pagos: { aplicaciones: Aplicacion[] }[]): Map<number, { capitalPag: number; interesPag: number; moraPag: number }> {
  const mapa = new Map<number, { capitalPag: number; interesPag: number; moraPag: number }>();
  for (const p of pagos) {
    for (const a of p.aplicaciones) {
      const prev = mapa.get(a.cuota) ?? { capitalPag: 0, interesPag: 0, moraPag: 0 };
      prev.capitalPag += a.capital; prev.interesPag += a.interes; prev.moraPag += a.mora;
      mapa.set(a.cuota, prev);
    }
  }
  return mapa;
}

function eventosPorCuota(pagos: PagoConFecha[]): Map<number, EventoCuota[]> {
  const mapa = new Map<number, EventoCuota[]>();
  const ordenados = [...pagos].sort((a, b) => (a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0));
  for (const p of ordenados) {
    for (const a of p.aplicaciones) {
      const lista = mapa.get(a.cuota) ?? [];
      lista.push({ fecha: p.fecha, aplicado: a.capital + a.interes });
      mapa.set(a.cuota, lista);
    }
  }
  return mapa;
}

function construirSaldos(plan: CuotaPlan[], pagos: PagoConFecha[]): SaldoCuota[] {
  const acumulado = acumularAplicaciones(pagos);
  const eventos = eventosPorCuota(pagos);
  return plan.map(c => {
    const e = acumulado.get(c.numero) ?? { capitalPag: 0, interesPag: 0, moraPag: 0 };
    return {
      numero: c.numero, vence: c.vence, valorCuota: c.capitalProg + c.interesProg,
      saldoCapital: Math.max(0, c.capitalProg - e.capitalPag),
      saldoInteres: Math.max(0, c.interesProg - e.interesPag),
      moraPagPrevia: e.moraPag, eventos: eventos.get(c.numero) ?? [],
    };
  });
}

function construirCuotasEstado(plan: CuotaPlan[], pagos: Pago[], conMora: boolean, tasaMensual: number, diasGracia: number): CuotaEstado[] {
  return construirSaldos(plan, pagos).map((s, i) => {
    const c = plan[i];
    const capitalPag = c.capitalProg - s.saldoCapital;
    const interesPag = c.interesProg - s.saldoInteres;
    const vencida = c.vence < HOY;
    const pagada = s.saldoCapital <= 0.5 && s.saldoInteres <= 0.5;
    const diasAtraso = vencida ? diffDays(c.vence, HOY) : 0;
    const moraPendiente = conMora && vencida && !pagada
      ? Math.max(0, moraDevengada(s.valorCuota, c.vence, s.eventos, HOY, tasaMensual, diasGracia) - s.moraPagPrevia)
      : 0;
    let estado: CuotaEstado["estado"];
    if (pagada) estado = "pagada";
    else if (vencida) estado = (capitalPag > 0 || interesPag > 0 || s.moraPagPrevia > 0) ? "parcial" : "vencida";
    else estado = "pendiente";
    return { ...c, capitalPag, interesPag, moraPag: s.moraPagPrevia, moraPendiente, estado, diasAtraso };
  });
}

function resumenCliente(cuotas: CuotaEstado[], pagos: Pago[], proyecto: Proyecto): ResumenCliente {
  const totalPagado = pagos.reduce((s, p) => s + p.valor, 0);
  const capitalPagado = cuotas.reduce((s, c) => s + c.capitalPag, 0) + pagos.reduce((s, p) => s + (p.abono?.monto ?? 0), 0);
  const saldoCapital = cuotas.reduce((s, c) => s + Math.max(0, c.capitalProg - c.capitalPag), 0);
  const vencidas = cuotas.filter(c => c.estado === 'vencida' || c.estado === 'parcial');
  const valorVencido = vencidas.reduce((s, c) => s + Math.max(0, c.capitalProg - c.capitalPag) + Math.max(0, c.interesProg - c.interesPag), 0);
  const moraAHoy = cuotas.reduce((s, c) => s + c.moraPendiente, 0);
  const proximaCuota = cuotas.find(c => c.estado === 'pendiente') ?? null;
  const cuotasVencidas = vencidas.length;
  let estadoGeneral: ResumenCliente['estadoGeneral'] = 'AL DÍA';
  if (proyecto.alerta3Cuotas && cuotasVencidas >= 3) estadoGeneral = 'ALERTA 3 CUOTAS';
  else if (cuotasVencidas >= 1) estadoGeneral = 'EN MORA';
  return { totalPagado, capitalPagado, saldoCapital, valorVencido, moraAHoy, proximaCuota, cuotasVencidas, estadoGeneral };
}

function aplicarAbonoExtraordinario(
  plan: CuotaPlan[], estadoAcumulado: Map<number, { capitalPag: number; interesPag: number; moraPag: number }>,
  monto: number, modo: 'plazo' | 'cuota',
): CuotaPlan[] {
  const nuevo = plan.map(c => ({ ...c }));
  const pendientes = nuevo.filter(c => {
    const capPag = estadoAcumulado.get(c.numero)?.capitalPag ?? 0;
    return (c.capitalProg - capPag) > 0.5;
  });
  if (pendientes.length === 0 || monto <= 0) return nuevo;
  if (modo === 'plazo') {
    let restante = monto;
    for (let idx = pendientes.length - 1; idx >= 0 && restante > 0.5; idx--) {
      const c = pendientes[idx];
      const capPag = estadoAcumulado.get(c.numero)?.capitalPag ?? 0;
      const capFalta = c.capitalProg - capPag;
      const reduccion = Math.min(restante, capFalta);
      c.capitalProg -= reduccion;
      restante -= reduccion;
    }
  } else {
    const totalCapitalPendiente = pendientes.reduce((s, c) => s + (c.capitalProg - (estadoAcumulado.get(c.numero)?.capitalPag ?? 0)), 0);
    if (totalCapitalPendiente > 0.5) {
      const fraccion = Math.min(1, monto / totalCapitalPendiente);
      for (const c of pendientes) {
        const capFalta = c.capitalProg - (estadoAcumulado.get(c.numero)?.capitalPag ?? 0);
        c.capitalProg = Math.round(c.capitalProg - capFalta * fraccion);
        c.interesProg = Math.round(c.interesProg * (1 - fraccion));
      }
    }
  }
  return nuevo;
}

function totalesPago(p: Pago) {
  return p.aplicaciones.reduce((acc, a) => ({ mora: acc.mora + a.mora, interes: acc.interes + a.interes, capital: acc.capital + a.capital }), { mora: 0, interes: 0, capital: 0 });
}

function aplicadoATexto(p: Pago): string {
  const t = totalesPago(p);
  const partes: string[] = [];
  if (t.mora > 0) partes.push(`Mora ${money(t.mora)}`);
  if (t.interes > 0) partes.push(`Interés ${money(t.interes)}`);
  if (t.capital > 0) partes.push(`Capital ${money(t.capital)}`);
  if (p.abono) partes.push(`Abono extraordinario ${money(p.abono.monto)} (${p.abono.modo === 'plazo' ? 'redujo el plazo' : 'redujo la cuota'})`);
  return partes.length ? partes.join(' · ') : '—';
}

interface EfectoAbono { mesesReducidos: number; cuotaAntes: number; cuotaDespues: number; }

function simularAbono(cliente: Cliente, aplicacionesNuevas: Aplicacion[], sobra: number, modo: 'plazo' | 'cuota'): EfectoAbono {
  const acumuladoConNuevo = acumularAplicaciones([...cliente.pagos, { aplicaciones: aplicacionesNuevas }]);
  const planSimulado = aplicarAbonoExtraordinario(cliente.plan, acumuladoConNuevo, sobra, modo);
  const activa = (c: CuotaPlan) => (c.capitalProg - (acumuladoConNuevo.get(c.numero)?.capitalPag ?? 0)) > 0.5;
  const futurasAntes = cliente.plan.filter(activa).length;
  const futurasDespues = planSimulado.filter(activa).length;
  const mesesReducidos = Math.max(0, futurasAntes - futurasDespues);
  const primeraFuturaPlan = cliente.plan.find(activa);
  const primeraFuturaSim = primeraFuturaPlan ? planSimulado.find(c => c.numero === primeraFuturaPlan.numero) : undefined;
  const cuotaAntes = primeraFuturaPlan ? primeraFuturaPlan.capitalProg + primeraFuturaPlan.interesProg : 0;
  const cuotaDespues = primeraFuturaSim ? primeraFuturaSim.capitalProg + primeraFuturaSim.interesProg : 0;
  return { mesesReducidos, cuotaAntes, cuotaDespues };
}

// ─────────────────────────────────────────────────────────────────────────
// DATOS FICTICIOS
// ─────────────────────────────────────────────────────────────────────────

const PROYECTOS: Proyecto[] = [
  {
    id: 'villa-plaza', nombre: 'Villa Plaza Real', sede: 'Bucaramanga', conMora: true, alerta3Cuotas: false,
    cuentaDefault: 'Bancolombia Mizar',
    socios: [{ desde: '2024-01-01', hasta: null, participantes: [{ nombre: 'Mizar', pct: 60 }, { nombre: 'Inversionista Villa Plaza', pct: 40 }] }],
  },
  {
    id: 'montana', nombre: 'Miradores de la Montaña', sede: 'Bucaramanga', conMora: true, alerta3Cuotas: false,
    cuentaDefault: 'Bancolombia Mizar',
    socios: [{ desde: '2024-01-01', hasta: null, participantes: [{ nombre: 'Mizar', pct: 100 }] }],
  },
  {
    id: 'laureles', nombre: 'Laureles Campestre T3', sede: 'Bucaramanga', conMora: true, alerta3Cuotas: false,
    cuentaDefault: 'Bancolombia Mizar',
    socios: [{ desde: '2024-01-01', hasta: null, participantes: [{ nombre: 'Mizar', pct: 100 }] }],
  },
  {
    id: 'cantalta', nombre: 'Miradores de Cantalta', sede: 'Bucaramanga', conMora: true, alerta3Cuotas: false,
    cuentaDefault: 'Bancolombia Mizar',
    socios: [{ desde: '2024-01-01', hasta: null, participantes: [{ nombre: 'Mizar', pct: 50 }, { nombre: 'Socio Cantalta', pct: 50 }] }],
  },
  {
    id: 'miraflor', nombre: 'Miraflor (Mi Lote)', sede: 'Cúcuta', conMora: false, alerta3Cuotas: true,
    cuentaDefault: 'Cuenta Miraflor',
    socios: [{ desde: '2024-01-01', hasta: null, participantes: [{ nombre: 'Ictinos', pct: 100 }] }],
  },
  {
    id: 'miravista', nombre: 'Miravista (Mi Lote)', sede: 'Cúcuta', conMora: false, alerta3Cuotas: true,
    cuentaDefault: 'Cuenta Ictinos',
    socios: [
      { desde: '2023-01-01', hasta: '2025-06-04', participantes: [{ nombre: 'Socio A', pct: 33.34 }, { nombre: 'Socio B', pct: 33.33 }, { nombre: 'Socio C', pct: 33.33 }] },
      { desde: '2025-06-05', hasta: null, participantes: [{ nombre: 'Socio A', pct: 50 }, { nombre: 'Socio B', pct: 50 }] },
    ],
  },
];

function proyectoPorId(id: string): Proyecto { return PROYECTOS.find(p => p.id === id)!; }

const CLIENTES_RAW: ClienteRaw[] = [
  { id: 'vp1', nombre: 'Andrés Felipe Rico', cedula: '91234567', telefono: '+57 3001234567', proyectoId: 'villa-plaza', inmueble: 'Apto T1-302',
    valorVenta: 178000000, cuotaInicial: 53400000, plazoMeses: 48, primeraCuota: '2026-01-05', diaCorte: 5, cuotasCompletas: 9 },
  { id: 'vp2', nombre: 'Diana Carolina Suárez', cedula: '63456789', telefono: '+57 3012345678', proyectoId: 'villa-plaza', inmueble: 'Apto T2-410',
    valorVenta: 182000000, cuotaInicial: 54600000, plazoMeses: 48, primeraCuota: '2025-12-05', diaCorte: 5, cuotasCompletas: 9 },
  { id: 'mo1', nombre: 'Jorge Iván Meléndez', cedula: '13567890', telefono: '+57 3023456789', proyectoId: 'montana', inmueble: 'Apto B-205',
    valorVenta: 175000000, cuotaInicial: 52500000, plazoMeses: 48, primeraCuota: '2025-10-30', diaCorte: 30, cuotasCompletas: 11,
    abonoMonto: 8000000, abonoModo: 'plazo', abonoFecha: '2026-09-10' },
  { id: 'mo2', nombre: 'Paola Andrea Contreras', cedula: '37890123', telefono: '+57 3034567890', proyectoId: 'montana', inmueble: 'Apto B-311',
    valorVenta: 170000000, cuotaInicial: 51000000, plazoMeses: 48, primeraCuota: '2025-11-05', diaCorte: 5, cuotasCompletas: 9 },
  { id: 'la1', nombre: 'Camilo Ernesto Vargas', cedula: '91345678', telefono: '+57 3045678901', proyectoId: 'laureles', inmueble: 'Apto C-108',
    valorVenta: 180000000, cuotaInicial: 54000000, plazoMeses: 60, primeraCuota: '2026-01-05', diaCorte: 5, cuotasCompletas: 9 },
  { id: 'la2', nombre: 'Laura Ximena Duarte', cedula: '63012345', telefono: '+57 3056789012', proyectoId: 'laureles', inmueble: 'Apto C-215',
    valorVenta: 193000000, cuotaInicial: 57900000, plazoMeses: 60, primeraCuota: '2025-11-05', diaCorte: 5, cuotasCompletas: 10, parcialValorPagado: 2000000 },
  { id: 'ca1', nombre: 'Mauricio Serrano Ortiz', cedula: '13890123', telefono: '+57 3067890123', proyectoId: 'cantalta', inmueble: 'Lote M2-08',
    valorVenta: 48000000, cuotaInicial: 14400000, plazoMeses: 36, primeraCuota: '2026-02-05', diaCorte: 5, cuotasCompletas: 8, soloMizar: true },
  { id: 'ca2', nombre: 'Natalia Rueda Pabón', cedula: '37456789', telefono: '+57 3078901234', proyectoId: 'cantalta', inmueble: 'Lote M3-15',
    valorVenta: 55000000, cuotaInicial: 16500000, plazoMeses: 36, primeraCuota: '2025-12-05', diaCorte: 5, cuotasCompletas: 9 },
  { id: 'mf1', nombre: 'Andrea Milena Castellanos', cedula: '60123456', telefono: '+57 3089012345', proyectoId: 'miraflor', inmueble: 'Lote M1-05 esquinero',
    valorVenta: 22700000, cuotaInicial: 1200000, plazoMeses: 43, primeraCuota: '2026-08-05', diaCorte: 5, cuotasCompletas: 2, cuotaFijaCucuta: 500000, referidoDeId: 'mv2' },
  { id: 'mf2', nombre: 'Julián David Peña', cedula: '88234567', telefono: '+57 3090123456', proyectoId: 'miraflor', inmueble: 'Lote M2-19',
    valorVenta: 20700000, cuotaInicial: 1000000, plazoMeses: 40, primeraCuota: '2026-02-05', diaCorte: 5, cuotasCompletas: 6, cuotaFijaCucuta: 500000 },
  { id: 'mv1', nombre: 'Sandra Milena Ortiz', cedula: '60345678', telefono: '+57 3101234567', proyectoId: 'miravista', inmueble: 'Lote L3-22',
    valorVenta: 22500000, cuotaInicial: 1000000, plazoMeses: 43, primeraCuota: '2026-01-05', diaCorte: 5, cuotasCompletas: 6, cuotaFijaCucuta: 500000 },
  { id: 'mv2', nombre: 'Édgar Iván Gómez', cedula: '88456789', telefono: '+57 3112345678', proyectoId: 'miravista', inmueble: 'Lote L1-09',
    valorVenta: 22700000, cuotaInicial: 1200000, plazoMeses: 43, primeraCuota: '2024-10-05', diaCorte: 5, cuotasCompletas: 24, cuotaFijaCucuta: 500000, administracionAnteriorHasta: 9 },
];

function construirClienteInicial(raw: ClienteRaw, proyecto: Proyecto, nuevaReferencia: () => string, nuevoRecibo: () => string): Cliente {
  const conInteres = proyecto.sede === 'Bucaramanga';
  const plan = generarPlan(raw.valorVenta, raw.cuotaInicial, raw.plazoMeses, raw.primeraCuota, raw.diaCorte, conInteres, raw.cuotaFijaCucuta);
  const pagos: Pago[] = [];
  const adminHasta = raw.administracionAnteriorHasta ?? 0;

  for (let n = 1; n <= raw.cuotasCompletas; n++) {
    const cuota = plan[n - 1];
    const saldos = construirSaldos(plan, pagos);
    const valor = cuota.capitalProg + cuota.interesProg;
    const fechaPago = fechaAntes(cuota.vence, 2 + (n % 3));
    const { aplicaciones } = aplicarPagoAPlan(saldos, valor, fechaPago, proyecto.conMora, 1.5, 5);
    pagos.push({
      recibo: nuevoRecibo(), fecha: fechaPago, valor,
      medio: n % 4 === 0 ? 'Efectivo' : n % 4 === 1 ? 'Consignación' : 'Transferencia',
      cuenta: n <= adminHasta ? 'Recaudo administración anterior' : proyecto.cuentaDefault,
      referencia: nuevaReferencia(), aplicaciones, soporte: true,
      administracionAnterior: n <= adminHasta,
    });
  }

  if (raw.parcialValorPagado) {
    const cuota = plan[raw.cuotasCompletas];
    const saldos = construirSaldos(plan, pagos);
    const fechaPago = fechaDespues(cuota.vence, 10);
    const { aplicaciones } = aplicarPagoAPlan(saldos, raw.parcialValorPagado, fechaPago, proyecto.conMora, 1.5, 5);
    pagos.push({
      recibo: nuevoRecibo(), fecha: fechaPago, valor: raw.parcialValorPagado, medio: 'Transferencia',
      cuenta: proyecto.cuentaDefault, referencia: nuevaReferencia(), aplicaciones, soporte: true,
    });
  }

  let planFinal = plan;
  if (raw.abonoMonto && raw.abonoFecha && raw.abonoModo) {
    const acumulado = acumularAplicaciones(pagos);
    planFinal = aplicarAbonoExtraordinario(plan, acumulado, raw.abonoMonto, raw.abonoModo);
    pagos.push({
      recibo: nuevoRecibo(), fecha: raw.abonoFecha, valor: raw.abonoMonto, medio: 'Transferencia',
      cuenta: proyecto.cuentaDefault, referencia: nuevaReferencia(), aplicaciones: [],
      abono: { monto: raw.abonoMonto, modo: raw.abonoModo }, soporte: true,
    });
  }

  pagos.sort((a, b) => (a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0));
  return { raw, plan: planFinal, pagos };
}

function construirTodosLosClientes(): Cliente[] {
  let refSeed = 100000;
  let recSeed = 1;
  const nuevaReferencia = () => { refSeed += 7; return `BC${refSeed}`; };
  const nuevoRecibo = () => `RC-${String(recSeed++).padStart(6, '0')}`;
  return CLIENTES_RAW.map(raw => construirClienteInicial(raw, proyectoPorId(raw.proyectoId), nuevaReferencia, nuevoRecibo));
}

const CLIENTES_INICIALES: Cliente[] = construirTodosLosClientes();
const RECIBO_INICIAL_NUEVOS = 118;

function clientePorIdEn(clientes: Cliente[], id: string): Cliente | undefined { return clientes.find(c => c.raw.id === id); }
function valorCuota(clienteId: string, numero: number): number {
  const c = clientePorIdEn(CLIENTES_INICIALES, clienteId);
  if (!c || !c.plan[numero - 1]) return 0;
  const cu = c.plan[numero - 1];
  return cu.capitalProg + cu.interesProg;
}

interface ReporteWhatsApp {
  id: string; clienteId: string; fecha: string; hora: string; valor: number; banco: string; referencia: string;
  estado: 'pendiente' | 'confirmado' | 'rechazado';
  alerta?: { tipo: 'referencia-repetida' | 'valor-no-coincide'; mensaje: string };
  motivoRechazo?: string;
}

const REPORTES_INICIALES: ReporteWhatsApp[] = (() => {
  const ca2 = clientePorIdEn(CLIENTES_INICIALES, 'ca2')!;
  const pagoRepetido = ca2.pagos[ca2.pagos.length - 1];
  return [
    { id: 'rep-1', clienteId: 'ca2', fecha: '2026-09-22', hora: '19:41', valor: pagoRepetido.valor, banco: 'Bancolombia', referencia: pagoRepetido.referencia, estado: 'pendiente',
      alerta: { tipo: 'referencia-repetida', mensaje: `Referencia repetida: ya se usó el ${fechaLarga(pagoRepetido.fecha)} en el recibo ${pagoRepetido.recibo}` } },
    { id: 'rep-2', clienteId: 'mf2', fecha: '2026-09-22', hora: '08:05', valor: 480000, banco: 'Davivienda', referencia: 'BC109981', estado: 'pendiente',
      alerta: { tipo: 'valor-no-coincide', mensaje: 'El valor no coincide con la cuota ($480.000 vs $500.000)' } },
    { id: 'rep-3', clienteId: 'vp2', fecha: '2026-09-23', hora: '07:52', valor: valorCuota('vp2', 10), banco: 'Bancolombia', referencia: 'BC109982', estado: 'pendiente' },
    { id: 'rep-4', clienteId: 'la1', fecha: '2026-09-23', hora: '09:10', valor: valorCuota('la1', 10), banco: 'Bancolombia', referencia: 'BC109983', estado: 'pendiente' },
  ];
})();

interface PagoSinIdentificar { id: string; fecha: string; valor: number; cuenta: string; diasSinIdentificar: number; }

const PAGOS_SIN_IDENTIFICAR_INICIALES: PagoSinIdentificar[] = [
  { id: 'sin-1', fecha: '2026-09-11', valor: 500000, cuenta: 'Cuenta Miraflor', diasSinIdentificar: 12 },
  { id: 'sin-2', fecha: '2026-08-07', valor: 1450000, cuenta: 'Bancolombia Mizar', diasSinIdentificar: 47 },
];

const FINANZAS_PROYECTO: Record<string, { recaudado: number; gastos: number; comisiones: number }> = {
  'villa-plaza': { recaudado: 62000000, gastos: 21000000, comisiones: 6000000 },
  'montana': { recaudado: 48000000, gastos: 15000000, comisiones: 4500000 },
  'laureles': { recaudado: 55000000, gastos: 18000000, comisiones: 5000000 },
  'cantalta': { recaudado: 21000000, gastos: 7000000, comisiones: 2000000 },
  'miraflor': { recaudado: 9000000, gastos: 3000000, comisiones: 900000 },
  'miravista': { recaudado: 26000000, gastos: 9000000, comisiones: 2600000 },
};

const HISTORICO_MENSUAL: Record<string, { programado: number; recaudado: number }> = {
  '2026-04': { programado: 178000000, recaudado: 171000000 },
  '2026-05': { programado: 182000000, recaudado: 179000000 },
  '2026-06': { programado: 186000000, recaudado: 168000000 },
  '2026-07': { programado: 189000000, recaudado: 184000000 },
  '2026-08': { programado: 191000000, recaudado: 176000000 },
};

const PROGRAMADO_FUTURO: Record<string, number> = { '2026-10': 201000000, '2026-11': 205000000, '2026-12': 208000000 };
const EGRESOS_MENSUAL: Record<string, number> = {
  '2026-05': 132000000, '2026-06': 140000000, '2026-07': 128000000, '2026-08': 145000000, '2026-09': 138000000,
  '2026-10': 150000000, '2026-11': 155000000, '2026-12': 160000000,
};
const CAJA_ACTUAL = 340000000;

// Septiembre del grupo completo; los 12 clientes de la demo son una muestra.
const PROGRAMADO_SEP_GRUPO = 194000000;
const RECAUDADO_SEP_GRUPO_BASE = 151000000;
function recaudadoSepDe(clientes: Cliente[]): number {
  return clientes.reduce((s, c) => s + c.pagos.filter(p => p.fecha.startsWith('2026-09')).reduce((t, p) => t + p.valor, 0), 0);
}
const RECAUDADO_SEP_DEMO_INICIAL = recaudadoSepDe(CLIENTES_INICIALES);

function sociosVigentes(proyecto: Proyecto, fecha: string) {
  return proyecto.socios.find(s => s.desde <= fecha && (s.hasta === null || s.hasta >= fecha))?.participantes
    ?? proyecto.socios[proyecto.socios.length - 1].participantes;
}

// ─────────────────────────────────────────────────────────────────────────
// COMPONENTES PEQUEÑOS
// ─────────────────────────────────────────────────────────────────────────

type Tono = 'green' | 'red' | 'amber' | 'blue' | 'purple' | 'muted' | 'navy';
const TONOS: Record<Tono, { bg: string; fg: string }> = {
  green: { bg: C.greenSoft, fg: C.green }, red: { bg: C.redSoft, fg: C.red },
  amber: { bg: C.amberSoft, fg: C.amber }, blue: { bg: C.blueSoft, fg: C.blue },
  purple: { bg: C.purpleSoft, fg: C.purple }, muted: { bg: C.surfaceStrong, fg: C.muted },
  navy: { bg: C.surfaceStrong, fg: C.navy },
};

function Chip({ tono, texto }: { tono: Tono; texto: string }) {
  const t = TONOS[tono];
  return (
    <span style={{ background: t.bg, color: t.fg, fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999, display: 'inline-block', whiteSpace: 'nowrap' }}>
      {texto}
    </span>
  );
}

function chipDeCuota(estado: CuotaEstado['estado']): { tono: Tono; texto: string } {
  if (estado === 'pagada') return { tono: 'green', texto: 'Pagada' };
  if (estado === 'parcial') return { tono: 'amber', texto: 'Parcial' };
  if (estado === 'vencida') return { tono: 'red', texto: 'Vencida' };
  return { tono: 'muted', texto: 'Próxima' };
}

function chipDeEstadoGeneral(estado: ResumenCliente['estadoGeneral']): Tono {
  if (estado === 'AL DÍA') return 'green';
  if (estado === 'ALERTA 3 CUOTAS') return 'amber';
  return 'red';
}

function TarjetaKpi({ icono: Icono, titulo, valor, sub, tono, onClick }: {
  icono: React.ComponentType<any>; titulo: string; valor: string; sub?: string; tono: Tono; onClick?: () => void;
}) {
  const t = TONOS[tono];
  return (
    <button type="button" onClick={onClick} style={{
      textAlign: 'left', background: C.paper, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16,
      boxShadow: '0 1px 2px rgba(20,30,50,.05)', display: 'flex', flexDirection: 'column', gap: 8,
      cursor: onClick ? 'pointer' : 'default', width: '100%', minHeight: 40, fontFamily: 'inherit',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: t.fg }}>
        <Icono size={18} />
        <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>{titulo}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: C.ink }}>{valor}</div>
      {sub && <div style={{ fontSize: 13, color: C.muted }}>{sub}</div>}
    </button>
  );
}

function BotonPrimario({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} style={{
      background: disabled ? C.lineStrong : C.rojo, color: '#fff', border: 'none', borderRadius: 8, whiteSpace: 'nowrap',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: '10px 18px', fontWeight: 700, fontSize: 14, minHeight: 40, cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'inherit',
    }}>
      {children}
    </button>
  );
}

function BotonSecundario({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} style={{
      background: C.paper, color: C.navy, border: `1px solid ${C.lineStrong}`, borderRadius: 8, whiteSpace: 'nowrap',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: '10px 18px', fontWeight: 600, fontSize: 14, minHeight: 40, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1, fontFamily: 'inherit',
    }}>
      {children}
    </button>
  );
}

function Tarjeta({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 12, padding: 20, boxShadow: '0 1px 2px rgba(20,30,50,.04)', ...style }}>
      {children}
    </div>
  );
}

function MiniaturaComprobante() {
  return (
    <div aria-hidden="true" style={{ width: 52, height: 68, background: '#f1f2f4', border: `1px solid ${C.line}`, borderRadius: 4, padding: 6, display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
      {[70, 90, 60, 80, 50, 75].map((w, i) => <div key={i} style={{ height: 4, width: `${w}%`, background: '#c9ced6', borderRadius: 2 }} />)}
    </div>
  );
}

function GraficoBarras({ datos }: { datos: { mes: string; programado: number; recaudado: number }[] }) {
  const max = Math.max(...datos.flatMap(d => [d.programado, d.recaudado]), 1);
  return (
    <div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', padding: '8px 4px' }}>
        {datos.map(d => (
          <div key={d.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div role="img" aria-label={`${d.mes}: programado ${money(d.programado)}, recaudado ${money(d.recaudado)}`}
              style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 140 }}>
              <div title={`Programado ${d.mes}: ${money(d.programado)}`} style={{ width: 16, height: `${Math.max(4, (d.programado / max) * 140)}px`, background: C.blueSoft, border: `1px solid ${C.blue}`, borderRadius: '3px 3px 0 0' }} />
              <div title={`Recaudado ${d.mes}: ${money(d.recaudado)}`} style={{ width: 16, height: `${Math.max(4, (d.recaudado / max) * 140)}px`, background: C.navy, borderRadius: '3px 3px 0 0' }} />
            </div>
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{d.mes}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: C.muted, marginTop: 8 }}>
        <span><i style={{ display: 'inline-block', width: 10, height: 10, background: C.blueSoft, border: `1px solid ${C.blue}`, marginRight: 4, verticalAlign: 'middle' }} />Programado</span>
        <span><i style={{ display: 'inline-block', width: 10, height: 10, background: C.navy, marginRight: 4, verticalAlign: 'middle' }} />Recaudado</span>
      </div>
    </div>
  );
}

function Toast({ mensaje }: { mensaje: string }) {
  return (
    <div role="status" style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 100, background: C.navy, color: '#fff',
      padding: '14px 18px', borderRadius: 10, boxShadow: '0 8px 24px rgba(10,35,66,.3)', fontSize: 14, fontWeight: 600, maxWidth: 340,
    }}>
      {mensaje}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// TELÉFONO SIMULADO (WhatsApp)
// ─────────────────────────────────────────────────────────────────────────

function TelefonoWhatsApp() {
  return (
    <div className="hidden lg:block" style={{ width: 280, flexShrink: 0 }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: C.muted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.4 }}>Así lo ve el cliente</p>
      <div style={{ background: '#111b21', borderRadius: 28, padding: 10, border: '6px solid #1c1c1c', boxShadow: '0 10px 30px rgba(0,0,0,.18)' }}>
        <div style={{ background: '#0b141a', borderRadius: 18, overflow: 'hidden' }}>
          <div style={{ background: '#005c4b', color: '#fff', padding: '10px 12px', fontSize: 13, fontWeight: 700 }}>Mizar · Cartera</div>
          <div style={{ padding: 12, minHeight: 340, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ alignSelf: 'flex-start', background: '#202c33', color: '#e9edef', padding: '8px 10px', borderRadius: '0 8px 8px 8px', fontSize: 13, maxWidth: '88%' }}>
              Hola Andrea 👋 tu cuota de $500.000 vence el 5 de octubre.
            </div>
            <div style={{ alignSelf: 'flex-start', background: '#005c4b', color: '#fff', borderRadius: 16, padding: '6px 12px', fontSize: 12, fontWeight: 700 }}>Reportar pago</div>
            <div style={{ alignSelf: 'flex-end', background: '#005c4b', color: '#e9edef', padding: '8px 10px', borderRadius: '8px 0 8px 8px', fontSize: 12, maxWidth: '92%' }}>
              <div>Monto: $500.000</div>
              <div>Comprobante adjunto 📎 foto.jpg</div>
            </div>
            <div style={{ alignSelf: 'flex-start', background: '#202c33', color: '#e9edef', padding: '8px 10px', borderRadius: '0 8px 8px 8px', fontSize: 13, maxWidth: '88%' }}>
              Recibimos tu pago. Te confirmamos cuando tesorería lo verifique.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// MODAL: REGISTRAR PAGO
// ─────────────────────────────────────────────────────────────────────────

function ModalRegistrarPago({ cliente, proyecto, referenciasUsadas, tasaMensual, diasGracia, siguienteRecibo, onCerrar, onConfirmar }: {
  cliente: Cliente; proyecto: Proyecto; referenciasUsadas: Set<string>; tasaMensual: number; diasGracia: number; siguienteRecibo: number;
  onCerrar: () => void;
  onConfirmar: (datos: { valor: number; medio: Medio; cuenta: string; referencia: string; modoAbono: 'plazo' | 'cuota' }) => void;
}) {
  const [valorTexto, setValorTexto] = useState('');
  const [medio, setMedio] = useState<Medio>('Transferencia');
  const [cuenta, setCuenta] = useState(proyecto.cuentaDefault);
  const [referencia, setReferencia] = useState('');
  const [adjuntar, setAdjuntar] = useState(false);
  const [modoAbono, setModoAbono] = useState<'plazo' | 'cuota'>('plazo');

  const valor = Number(valorTexto.replace(/\D/g, '')) || 0;

  const preview = useMemo(() => {
    if (valor <= 0) return null;
    const saldosElegibles = saldosElegiblesPara(cliente.plan, cliente.pagos, HOY);
    return aplicarPagoAPlan(saldosElegibles, valor, HOY, proyecto.conMora, tasaMensual, diasGracia);
  }, [valor, cliente, proyecto, tasaMensual, diasGracia]);

  const totales = useMemo(() => {
    if (!preview) return { mora: 0, interes: 0, capital: 0 };
    return preview.aplicaciones.reduce((acc, a) => ({ mora: acc.mora + a.mora, interes: acc.interes + a.interes, capital: acc.capital + a.capital }), { mora: 0, interes: 0, capital: 0 });
  }, [preview]);

  const efectoAbono = useMemo(() => {
    if (!preview || preview.sobra <= 0) return null;
    return simularAbono(cliente, preview.aplicaciones, preview.sobra, modoAbono);
  }, [preview, modoAbono, cliente]);

  const referenciaLimpia = referencia.trim();
  const referenciaRepetida = referenciaLimpia.length > 0 && referenciasUsadas.has(referenciaLimpia);
  const puedeConfirmar = valor > 0 && referenciaLimpia.length > 0 && !referenciaRepetida;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,35,66,.45)', zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onCerrar}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.paper, borderRadius: 14, padding: 24, width: '100%', maxWidth: 520, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(10,35,66,.35)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.ink, margin: 0 }}>Registrar pago</h2>
            <p style={{ fontSize: 13, color: C.muted, margin: '4px 0 0' }}>{cliente.raw.nombre} · {cliente.raw.inmueble}</p>
          </div>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted }}><X size={20} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label htmlFor="valor-pago" style={{ fontSize: 13, fontWeight: 600, color: C.ink, display: 'block', marginBottom: 4 }}>Valor</label>
            <input id="valor-pago" inputMode="numeric" value={valorTexto ? Number(valorTexto.replace(/\D/g, '')).toLocaleString('es-CO') : ''}
              onChange={e => setValorTexto(e.target.value)} placeholder="$ 0"
              style={{ width: '100%', border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, fontVariantNumeric: 'tabular-nums' }} />
          </div>
          <div>
            <label htmlFor="fecha-pago" style={{ fontSize: 13, fontWeight: 600, color: C.ink, display: 'block', marginBottom: 4 }}>Fecha</label>
            <input id="fecha-pago" readOnly value={fechaLarga(HOY)} style={{ width: '100%', border: `1px solid ${C.line}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, background: C.surface, color: C.muted }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label htmlFor="medio-pago" style={{ fontSize: 13, fontWeight: 600, color: C.ink, display: 'block', marginBottom: 4 }}>Medio</label>
            <select id="medio-pago" value={medio} onChange={e => setMedio(e.target.value as Medio)} style={{ width: '100%', border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: '10px 12px', fontSize: 14 }}>
              <option>Transferencia</option><option>Efectivo</option><option>Consignación</option>
            </select>
          </div>
          <div>
            <label htmlFor="cuenta-pago" style={{ fontSize: 13, fontWeight: 600, color: C.ink, display: 'block', marginBottom: 4 }}>Cuenta</label>
            <select id="cuenta-pago" value={cuenta} onChange={e => setCuenta(e.target.value)} style={{ width: '100%', border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: '10px 12px', fontSize: 14 }}>
              <option value={proyecto.cuentaDefault}>{proyecto.cuentaDefault}</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="referencia-pago" style={{ fontSize: 13, fontWeight: 600, color: C.ink, display: 'block', marginBottom: 4 }}>Referencia bancaria</label>
          <input id="referencia-pago" value={referencia} onChange={e => setReferencia(e.target.value)} placeholder="Ej. BC102345"
            style={{ width: '100%', border: `1px solid ${referenciaRepetida ? C.red : C.lineStrong}`, borderRadius: 8, padding: '10px 12px', fontSize: 14 }} />
          {referenciaRepetida && (
            <p style={{ color: C.red, fontSize: 13, marginTop: 6, fontWeight: 600 }}>
              Esta referencia ya se usó en un recibo anterior. Revisa el número antes de continuar.
            </p>
          )}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: C.ink, marginBottom: 16, cursor: 'pointer' }}>
          <input type="checkbox" checked={adjuntar} onChange={e => setAdjuntar(e.target.checked)} /> Adjuntar soporte (simulado)
        </label>

        <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, margin: '0 0 8px' }}>Así se aplica este pago</p>
          {!preview ? (
            <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Escribe un valor para ver la aplicación.</p>
          ) : (
            <>
              <p style={{ fontSize: 13, color: C.muted, margin: '0 0 8px' }}>
                Mora {money(totales.mora)} · Interés {money(totales.interes)} · Capital {money(totales.capital)}
              </p>
              {preview.sobra > 0 && (
                <div style={{ borderTop: `1px dashed ${C.lineStrong}`, paddingTop: 10, marginTop: 6 }}>
                  <p style={{ fontSize: 13, color: C.ink, fontWeight: 600, margin: '0 0 8px' }}>Sobran {money(preview.sobra)} → abono a capital</p>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                      <input type="radio" name="modo-abono" checked={modoAbono === 'plazo'} onChange={() => setModoAbono('plazo')} /> Reducir el plazo
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                      <input type="radio" name="modo-abono" checked={modoAbono === 'cuota'} onChange={() => setModoAbono('cuota')} /> Reducir el valor de la cuota
                    </label>
                  </div>
                  {efectoAbono && (
                    <p style={{ fontSize: 13, color: C.blue, margin: 0, fontWeight: 600 }}>
                      {modoAbono === 'plazo'
                        ? (efectoAbono.mesesReducidos > 0 ? `El plan termina ${efectoAbono.mesesReducidos} ${efectoAbono.mesesReducidos === 1 ? 'mes' : 'meses'} antes.` : `La última cuota del plan baja ${money(preview.sobra)}.`)
                        : `La cuota baja de ${money(efectoAbono.cuotaAntes)} a ${money(efectoAbono.cuotaDespues)}.`}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <BotonSecundario onClick={onCerrar}>Cancelar</BotonSecundario>
          <BotonPrimario disabled={!puedeConfirmar} onClick={() => onConfirmar({ valor, medio, cuenta, referencia: referenciaLimpia, modoAbono })}>
            Confirmar pago · {`RC-${String(siguienteRecibo).padStart(6, '0')}`}
          </BotonPrimario>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SIDEBAR / NAVEGACIÓN
// ─────────────────────────────────────────────────────────────────────────

const NAV: { id: Seccion; label: string; icono: React.ComponentType<any> }[] = [
  { id: 'inicio', label: 'Inicio', icono: LayoutDashboard },
  { id: 'estado-cuenta', label: 'Estado de cuenta', icono: CreditCard },
  { id: 'por-verificar', label: 'Pagos por verificar', icono: ClipboardCheck },
  { id: 'morosos', label: 'Morosos y cobranza', icono: ShieldAlert },
  { id: 'socios', label: 'Socios y flujo', icono: Users },
  { id: 'configuracion', label: 'Configuración', icono: Settings },
];

function FranjaAviso() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60, height: 44, background: C.navy, color: '#cfe0f2', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontSize: 13, gap: 12 }}>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Demo con datos ficticios · nada de lo que hagas aquí se guarda</span>
      <Link to="/mizar-cartera" style={{ color: '#fff', fontWeight: 700, whiteSpace: 'nowrap', textDecoration: 'none' }}>← Volver a la propuesta</Link>
    </div>
  );
}

function Sidebar({ seccion, onCambiar }: { seccion: Seccion; onCambiar: (s: Seccion) => void }) {
  return (
    <aside className="hidden lg:flex lg:flex-col" style={{ position: 'fixed', top: 44, left: 0, bottom: 0, width: 240, background: C.navy, padding: '20px 12px', zIndex: 40 }}>
      <div style={{ padding: '0 8px 20px' }}>
        <p style={{ color: '#fff', fontWeight: 800, fontSize: 18, margin: 0 }}>Mizar</p>
        <p style={{ color: '#9db3cc', fontSize: 12, margin: '2px 0 0' }}>Plataforma · Cartera</p>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {NAV.map(item => {
          const activo = seccion === item.id;
          return (
            <button key={item.id} type="button" onClick={() => onCambiar(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: 'none',
              background: activo ? C.navyLight : 'transparent', color: activo ? '#fff' : '#b9c9dd', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', textAlign: 'left', minHeight: 40, fontFamily: 'inherit',
            }}>
              <item.icono size={17} /> {item.label}
            </button>
          );
        })}
      </nav>
      <div style={{ borderTop: '1px solid #1f3a5f', paddingTop: 14, marginTop: 14, color: '#9db3cc', fontSize: 13 }}>
        Jennifer · Cartera
      </div>
    </aside>
  );
}

function NavMovil({ seccion, onCambiar }: { seccion: Seccion; onCambiar: (s: Seccion) => void }) {
  return (
    <div className="nav-movil flex lg:hidden" style={{ position: 'fixed', top: 44, left: 0, right: 0, zIndex: 50, background: C.navy, overflowX: 'auto', padding: '8px 10px', gap: 6 }}>
      {NAV.map(item => {
        const activo = seccion === item.id;
        return (
          <button key={item.id} type="button" onClick={() => onCambiar(item.id)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 20, border: 'none',
            background: activo ? C.navyLight : 'transparent', color: activo ? '#fff' : '#b9c9dd', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, minHeight: 40, fontFamily: 'inherit',
          }}>
            <item.icono size={15} /> {item.label}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SECCIÓN: INICIO
// ─────────────────────────────────────────────────────────────────────────

function plural(n: number, uno: string, varios: string): string { return `${n} ${n === 1 ? uno : varios}`; }

function SeccionInicio({ kpis, barras, onIrA }: {
  kpis: { programadoSep: number; recaudadoSep: number; valorVencidoTotal: number; clientesEnMora: number; clientesAlerta3: number; reportesPendientes: number; sinIdentificar: number };
  barras: { mes: string; programado: number; recaudado: number }[];
  onIrA: (s: Seccion) => void;
}) {
  const pctRecaudo = kpis.programadoSep > 0 ? Math.round((kpis.recaudadoSep / kpis.programadoSep) * 100) : 0;
  const pendientes: { texto: string; seccion: Seccion }[] = [];
  if (kpis.reportesPendientes > 0) pendientes.push({ texto: `${plural(kpis.reportesPendientes, 'pago reportado', 'pagos reportados')} por WhatsApp ${kpis.reportesPendientes === 1 ? 'espera' : 'esperan'} verificación`, seccion: 'por-verificar' });
  if (kpis.clientesAlerta3 > 0) pendientes.push({ texto: `${plural(kpis.clientesAlerta3, 'cliente de Cúcuta llegó', 'clientes de Cúcuta llegaron')} a 3 cuotas vencidas`, seccion: 'morosos' });
  pendientes.push({ texto: '12 recordatorios salen mañana a las 8:00 a. m.', seccion: 'morosos' });
  if (kpis.sinIdentificar > 0) pendientes.push({ texto: `${plural(kpis.sinIdentificar, 'consignación llegó', 'consignaciones llegaron')} al banco sin cliente asignado`, seccion: 'por-verificar' });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Inicio</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        <TarjetaKpi icono={Calendar} titulo="Programado en septiembre" valor={money(kpis.programadoSep)} tono="navy" />
        <TarjetaKpi icono={TrendingUp} titulo="Recaudado en septiembre" valor={money(kpis.recaudadoSep)} sub={`${pctRecaudo}% de recaudo`} tono="green" />
        <TarjetaKpi icono={AlertTriangle} titulo="Vencido, con mora" valor={money(kpis.valorVencidoTotal)} sub={`${plural(kpis.clientesEnMora, 'cliente', 'clientes')} · ver morosos`} tono="red" onClick={() => onIrA('morosos')} />
        <TarjetaKpi icono={ClipboardCheck} titulo="Pagos por verificar" valor={String(kpis.reportesPendientes)} sub={`+ ${plural(kpis.sinIdentificar, 'por identificar', 'por identificar')} · ver`} tono="amber" onClick={() => onIrA('por-verificar')} />
      </div>
      <p style={{ fontSize: 12, color: C.muted, margin: '-8px 0 0' }}>Programado y recaudado son del grupo completo; la demo trae 12 clientes de muestra y cada pago que registres suma al recaudo.</p>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <Tarjeta>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}>Programado vs. recaudado</p>
          <p style={{ fontSize: 13, color: C.muted, margin: '0 0 12px' }}>Abril a septiembre de 2026</p>
          <GraficoBarras datos={barras} />
        </Tarjeta>
        <Tarjeta>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 12px' }}>Para hoy</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pendientes.map((p, i) => (
              <button key={i} type="button" onClick={() => onIrA(p.seccion)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, textAlign: 'left',
                background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, padding: '10px 12px', fontSize: 13, color: C.ink,
                cursor: 'pointer', minHeight: 40, fontFamily: 'inherit',
              }}>
                {p.texto} <ChevronRight size={16} color={C.muted} />
              </button>
            ))}
          </div>
        </Tarjeta>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SECCIÓN: ESTADO DE CUENTA
// ─────────────────────────────────────────────────────────────────────────

function SeccionEstadoCuenta({ clientes, resumenes, busqueda, setBusqueda, clienteId, setClienteId, onAbrirModal, onToast }: {
  clientes: Cliente[]; resumenes: Map<string, { cuotas: CuotaEstado[]; resumen: ResumenCliente }>;
  busqueda: string; setBusqueda: (s: string) => void; clienteId: string; setClienteId: (id: string) => void;
  onAbrirModal: () => void; onToast: (m: string) => void;
}) {
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const resultados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return [];
    return clientes.filter(c => c.raw.nombre.toLowerCase().includes(q) || c.raw.cedula.includes(q)).slice(0, 8);
  }, [busqueda, clientes]);

  const cliente = clientePorIdEn(clientes, clienteId);
  const proyecto = cliente ? proyectoPorId(cliente.raw.proyectoId) : null;
  const datos = resumenes.get(clienteId);
  const referidores = cliente ? clientes.filter(c => c.raw.referidoDeId === cliente.raw.id) : [];
  const referidoPor = cliente?.raw.referidoDeId ? clientePorIdEn(clientes, cliente.raw.referidoDeId) : undefined;

  const filas = useMemo(() => {
    if (!datos) return [];
    if (mostrarTodas) return datos.cuotas;
    const vencidas = datos.cuotas.filter(c => c.estado === 'vencida' || c.estado === 'parcial');
    const pendientes = datos.cuotas.filter(c => c.estado === 'pendiente').slice(0, 6);
    return [...vencidas, ...pendientes];
  }, [datos, mostrarTodas]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Estado de cuenta</h1>

      <div style={{ position: 'relative', maxWidth: 480 }}>
        <label htmlFor="buscador-cliente" style={{ fontSize: 13, fontWeight: 600, color: C.ink, display: 'block', marginBottom: 6 }}>Digita la cédula o el nombre</label>
        <div style={{ position: 'relative' }}>
          <Search size={18} color={C.muted} style={{ position: 'absolute', left: 12, top: 13 }} />
          <input id="buscador-cliente" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Ej. Diana Suárez o 63456789"
            style={{ width: '100%', border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: '12px 12px 12px 40px', fontSize: 15 }} />
        </div>
        {resultados.length > 0 && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: C.paper, border: `1px solid ${C.line}`, borderRadius: 8, marginTop: 4, boxShadow: '0 8px 20px rgba(20,30,50,.12)', zIndex: 20, maxHeight: 260, overflowY: 'auto' }}>
            {resultados.map(c => (
              <button key={c.raw.id} type="button" onClick={() => { setClienteId(c.raw.id); setBusqueda(''); setMostrarTodas(false); }}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', minHeight: 40 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{c.raw.nombre}</div>
                <div style={{ fontSize: 12, color: C.muted }}>CC {c.raw.cedula} · {proyectoPorId(c.raw.proyectoId).nombre}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {cliente && proyecto && datos && (
        <>
          <Tarjeta>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: 19, fontWeight: 700, color: C.ink, margin: 0 }}>{cliente.raw.nombre}</h2>
                  <Chip tono={chipDeEstadoGeneral(datos.resumen.estadoGeneral)} texto={datos.resumen.estadoGeneral} />
                </div>
                <p style={{ fontSize: 13, color: C.muted, margin: '4px 0 0' }}>
                  CC {cliente.raw.cedula} · {cliente.raw.telefono} · {proyecto.nombre} · {cliente.raw.inmueble}
                </p>
                <p style={{ fontSize: 13, color: C.muted, margin: '4px 0 0' }}>
                  Valor {money(cliente.raw.valorVenta)} · {cliente.raw.plazoMeses} cuotas · corte el {cliente.raw.diaCorte} de cada mes
                </p>
                {referidoPor && <p style={{ fontSize: 13, color: C.purple, margin: '4px 0 0' }}>Referido por {referidoPor.raw.nombre} ({proyectoPorId(referidoPor.raw.proyectoId).nombre})</p>}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <BotonPrimario onClick={onAbrirModal}>Registrar pago</BotonPrimario>
                <BotonSecundario onClick={() => onToast('En la plataforma real esto genera el PDF')}><Download size={15} />PDF</BotonSecundario>
                <BotonSecundario onClick={() => onToast(`En la plataforma real esto lo envía al ${cliente.raw.telefono}`)}><Send size={15} />WhatsApp</BotonSecundario>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
              <EstadisticaMini titulo="Pagado" valor={money(datos.resumen.totalPagado)} />
              <EstadisticaMini titulo="Saldo de capital" valor={money(datos.resumen.saldoCapital)} />
              <EstadisticaMini titulo="Vencido" valor={money(datos.resumen.valorVencido)} tono={datos.resumen.valorVencido > 0 ? C.red : C.ink} />
              <EstadisticaMini titulo="Mora a hoy" valor={money(datos.resumen.moraAHoy)} tono={datos.resumen.moraAHoy > 0 ? C.red : C.ink} />
            </div>

            {referidores.map(ref => {
              const cuotasPagadas = resumenes.get(ref.raw.id)?.cuotas.filter(c => c.estado === 'pagada').length ?? 0;
              return (
                <div key={ref.raw.id} style={{ background: C.purpleSoft, border: `1px solid ${C.purple}`, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: C.purple }}>
                  <strong>Bono por referido:</strong> $500.000 — por referir a {ref.raw.nombre}. Se libera cuando pague su 3.ª cuota; lleva {Math.min(cuotasPagadas, 3)}.
                </div>
              );
            })}

            {cliente.raw.administracionAnteriorHasta && (
              <BloqueAdminAnterior cliente={cliente} />
            )}

            <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '20px 0 10px' }}>Plan de cuotas</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 560 }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                    <th style={{ padding: '8px 6px' }}>Nº</th><th style={{ padding: '8px 6px' }}>Vence</th>
                    <th style={{ padding: '8px 6px' }}>Capital</th><th style={{ padding: '8px 6px' }}>Interés</th>
                    <th style={{ padding: '8px 6px' }}>Mora</th><th style={{ padding: '8px 6px' }}>Pagado</th><th style={{ padding: '8px 6px' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filas.map(c => {
                    const chip = chipDeCuota(c.estado);
                    return (
                      <tr key={c.numero} style={{ borderBottom: `1px solid ${C.line}` }}>
                        <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{c.numero}</td>
                        <td style={{ padding: '8px 6px' }}>{fechaLarga(c.vence)}</td>
                        <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{money(c.capitalProg)}</td>
                        <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{money(c.interesProg)}</td>
                        <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{c.moraPendiente > 0 ? money(c.moraPendiente) : '—'}</td>
                        <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{money(c.capitalPag + c.interesPag + c.moraPag)}</td>
                        <td style={{ padding: '8px 6px' }}><Chip tono={chip.tono} texto={chip.texto} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {!mostrarTodas && (
              <button type="button" onClick={() => setMostrarTodas(true)} style={{ marginTop: 10, background: 'none', border: 'none', color: C.blue, fontWeight: 700, fontSize: 13, cursor: 'pointer', minHeight: 40 }}>
                Ver todas las cuotas ({cliente.plan.length})
              </button>
            )}

            <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '20px 0 10px' }}>Historial de pagos</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 640 }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                    <th style={{ padding: '8px 6px' }}>Recibo</th><th style={{ padding: '8px 6px' }}>Fecha</th><th style={{ padding: '8px 6px' }}>Valor</th>
                    <th style={{ padding: '8px 6px' }}>Aplicado a</th><th style={{ padding: '8px 6px' }}>Medio</th><th style={{ padding: '8px 6px' }}>Cuenta</th><th style={{ padding: '8px 6px' }}>Soporte</th>
                  </tr>
                </thead>
                <tbody>
                  {[...cliente.pagos].reverse().map(p => (
                    <tr key={p.recibo} style={{ borderBottom: `1px solid ${C.line}` }}>
                      <td style={{ padding: '8px 6px', fontWeight: 600 }}>{p.recibo}</td>
                      <td style={{ padding: '8px 6px' }}>{fechaLarga(p.fecha)}</td>
                      <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{money(p.valor)}</td>
                      <td style={{ padding: '8px 6px', color: C.muted }}>{aplicadoATexto(p)}</td>
                      <td style={{ padding: '8px 6px' }}>{p.medio}</td>
                      <td style={{ padding: '8px 6px' }}>{p.cuenta}</td>
                      <td style={{ padding: '8px 6px' }}>{p.soporte ? <Paperclip size={15} color={C.muted} aria-label="Con soporte" /> : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tarjeta>
        </>
      )}
    </div>
  );
}

function EstadisticaMini({ titulo, valor, tono }: { titulo: string; valor: string; tono?: string }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, padding: '10px 12px' }}>
      <p style={{ fontSize: 12, color: C.muted, margin: '0 0 4px', fontWeight: 600 }}>{titulo}</p>
      <p style={{ fontSize: 17, fontWeight: 700, margin: 0, color: tono ?? C.ink, fontVariantNumeric: 'tabular-nums' }}>{valor}</p>
    </div>
  );
}

function BloqueAdminAnterior({ cliente }: { cliente: Cliente }) {
  const pagosAnteriores = cliente.pagos.filter(p => p.administracionAnterior);
  const total = pagosAnteriores.reduce((s, p) => s + p.valor, 0);
  return (
    <div style={{ background: C.blueSoft, border: `1px solid ${C.blue}`, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: C.blue }}>
      <strong>Administración anterior (antes del 5-jun-2025):</strong> {money(total)} en {pagosAnteriores.length} pagos, recibidos por la administración anterior de Miravista.
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SECCIÓN: PAGOS POR VERIFICAR
// ─────────────────────────────────────────────────────────────────────────

function SeccionPorVerificar({ clientes, reportes, pagosSinIdentificar, onConfirmarReporte, onRechazarReporte, onAsignarSinIdentificar }: {
  clientes: Cliente[]; reportes: ReporteWhatsApp[]; pagosSinIdentificar: PagoSinIdentificar[];
  onConfirmarReporte: (r: ReporteWhatsApp) => void; onRechazarReporte: (id: string, motivo: string) => void;
  onAsignarSinIdentificar: (item: PagoSinIdentificar, clienteId: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Pagos por verificar</h1>
      <p style={{ fontSize: 14, color: C.muted, margin: 0, maxWidth: 640 }}>
        Los clientes reportan su pago por WhatsApp (monto + comprobante). Tesorería lo confirma contra el extracto del banco.
      </p>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reportes.map(r => {
            const cliente = clientePorIdEn(clientes, r.clienteId);
            if (!cliente) return null;
            return <TarjetaReporte key={r.id} reporte={r} cliente={cliente} onConfirmar={() => onConfirmarReporte(r)} onRechazar={motivo => onRechazarReporte(r.id, motivo)} />;
          })}
        </div>
        <TelefonoWhatsApp />
      </div>

      <div>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: C.ink, margin: '10px 0 4px' }}>Pagos por identificar</h2>
        <p style={{ fontSize: 13, color: C.muted, margin: '0 0 12px' }}>Consignaciones que llegaron al banco sin un cliente asociado.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pagosSinIdentificar.map(item => (
            <FilaSinIdentificar key={item.id} item={item} clientes={clientes} onAsignar={clienteId => onAsignarSinIdentificar(item, clienteId)} />
          ))}
          {pagosSinIdentificar.length === 0 && <p style={{ fontSize: 13, color: C.muted }}>No hay pagos pendientes por identificar.</p>}
        </div>
      </div>
    </div>
  );
}

function TarjetaReporte({ reporte, cliente, onConfirmar, onRechazar }: { reporte: ReporteWhatsApp; cliente: Cliente; onConfirmar: () => void; onRechazar: (motivo: string) => void }) {
  const [mostrarMotivo, setMostrarMotivo] = useState(false);
  const yaResuelto = reporte.estado !== 'pendiente';
  return (
    <Tarjeta style={{ padding: 16 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <MiniaturaComprobante />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: C.ink, margin: 0 }}>{cliente.raw.nombre}</p>
            <span style={{ fontSize: 12, color: C.muted }}>{fechaLarga(reporte.fecha)} · {reporte.hora}</span>
          </div>
          <p style={{ fontSize: 13, color: C.muted, margin: '4px 0' }}>{money(reporte.valor)} · {reporte.banco} · Ref. {reporte.referencia}</p>
          {reporte.alerta && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: reporte.alerta.tipo === 'referencia-repetida' ? C.red : C.amber, marginBottom: 8 }}>
              <AlertTriangle size={14} /> {reporte.alerta.mensaje}
            </div>
          )}
          {yaResuelto ? (
            <Chip tono={reporte.estado === 'confirmado' ? 'green' : 'muted'} texto={reporte.estado === 'confirmado' ? 'Confirmado' : `Rechazado: ${reporte.motivoRechazo}`} />
          ) : (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
              <BotonPrimario disabled={reporte.alerta?.tipo === 'referencia-repetida'} onClick={onConfirmar}>Confirmar</BotonPrimario>
              <BotonSecundario onClick={() => setMostrarMotivo(v => !v)}>Rechazar</BotonSecundario>
              {mostrarMotivo && (
                <select onChange={e => { if (e.target.value) onRechazar(e.target.value); }} defaultValue=""
                  style={{ border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: '0 10px', fontSize: 13, minHeight: 40 }}>
                  <option value="" disabled>Motivo del rechazo...</option>
                  <option>Comprobante ilegible</option>
                  <option>Valor no corresponde</option>
                  <option>Referencia no encontrada en el extracto</option>
                  <option>Cliente no identificado</option>
                  <option>Otro</option>
                </select>
              )}
            </div>
          )}
        </div>
      </div>
    </Tarjeta>
  );
}

function FilaSinIdentificar({ item, clientes, onAsignar }: { item: PagoSinIdentificar; clientes: Cliente[]; onAsignar: (clienteId: string) => void }) {
  const [seleccion, setSeleccion] = useState('');
  return (
    <Tarjeta style={{ padding: 14, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 13, color: C.ink }}>
        <strong>{money(item.valor)}</strong> · {fechaLarga(item.fecha)} · {item.cuenta} ·{' '}
        <span style={{ color: item.diasSinIdentificar > 30 ? C.red : C.amber, fontWeight: 700 }}>{item.diasSinIdentificar} días sin identificar</span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <select value={seleccion} onChange={e => setSeleccion(e.target.value)} style={{ border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: '0 10px', fontSize: 13, minHeight: 40 }}>
          <option value="">Selecciona un cliente...</option>
          {clientes.map(c => <option key={c.raw.id} value={c.raw.id}>{c.raw.nombre}</option>)}
        </select>
        <BotonPrimario disabled={!seleccion} onClick={() => onAsignar(seleccion)}>Asignar a cliente</BotonPrimario>
      </div>
    </Tarjeta>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SECCIÓN: MOROSOS Y COBRANZA
// ─────────────────────────────────────────────────────────────────────────

function SeccionMorosos({ lista, filtroSede, setFiltroSede, recordatoriosEnviados, onEnviarRecordatorio, recordatorios, setRecordatorios, clienteEjemplo }: {
  lista: { cliente: Cliente; proyecto: Proyecto; resumen: ResumenCliente; diasAtraso: number; accion: string; accionTono: Tono }[];
  filtroSede: 'Todas' | Sede; setFiltroSede: (s: 'Todas' | Sede) => void;
  recordatoriosEnviados: Set<string>; onEnviarRecordatorio: (id: string) => void;
  recordatorios: { antes3: boolean; elDia: boolean; despues3: boolean }; setRecordatorios: React.Dispatch<React.SetStateAction<{ antes3: boolean; elDia: boolean; despues3: boolean }>>;
  clienteEjemplo: { nombre: string; valor: number; fecha: string } | null;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Morosos y cobranza</h1>
      <div style={{ display: 'flex', gap: 8 }}>
        {(['Todas', 'Bucaramanga', 'Cúcuta'] as const).map(s => (
          <button key={s} type="button" onClick={() => setFiltroSede(s)} style={{
            padding: '8px 14px', borderRadius: 20, border: `1px solid ${filtroSede === s ? C.navy : C.lineStrong}`,
            background: filtroSede === s ? C.navy : C.paper, color: filtroSede === s ? '#fff' : C.ink, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', minHeight: 40, fontFamily: 'inherit',
          }}>{s}</button>
        ))}
      </div>

      <Tarjeta>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 720 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                <th style={{ padding: '8px 6px' }}>Cliente</th><th style={{ padding: '8px 6px' }}>Proyecto</th>
                <th style={{ padding: '8px 6px' }}>Cuotas vencidas</th><th style={{ padding: '8px 6px' }}>Días de atraso</th>
                <th style={{ padding: '8px 6px' }}>Valor vencido</th><th style={{ padding: '8px 6px' }}>Mora</th>
                <th style={{ padding: '8px 6px' }}>Próxima acción</th><th style={{ padding: '8px 6px' }} />
              </tr>
            </thead>
            <tbody>
              {lista.map(item => {
                const enviado = recordatoriosEnviados.has(item.cliente.raw.id);
                return (
                  <tr key={item.cliente.raw.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                    <td style={{ padding: '8px 6px', fontWeight: 600 }}>{item.cliente.raw.nombre}</td>
                    <td style={{ padding: '8px 6px' }}>{item.proyecto.nombre}</td>
                    <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{item.resumen.cuotasVencidas}</td>
                    <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{item.diasAtraso}</td>
                    <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{money(item.resumen.valorVencido)}</td>
                    <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{money(item.resumen.moraAHoy)}</td>
                    <td style={{ padding: '8px 6px' }}><Chip tono={item.accionTono} texto={item.accion} /></td>
                    <td style={{ padding: '8px 6px' }}>
                      <BotonSecundario disabled={enviado} onClick={() => onEnviarRecordatorio(item.cliente.raw.id)}>
                        {enviado ? 'Enviado hoy ✓' : 'Enviar recordatorio'}
                      </BotonSecundario>
                    </td>
                  </tr>
                );
              })}
              {lista.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 16, textAlign: 'center', color: C.muted }}>No hay clientes en mora con este filtro.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Tarjeta>

      <Tarjeta>
        <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 12px' }}>Recordatorios automáticos</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          <InterruptorRecordatorio label="3 días antes del corte" checked={recordatorios.antes3} onChange={v => setRecordatorios(prev => ({ ...prev, antes3: v }))} />
          <InterruptorRecordatorio label="El día del corte" checked={recordatorios.elDia} onChange={v => setRecordatorios(prev => ({ ...prev, elDia: v }))} />
          <InterruptorRecordatorio label="3 días después si no ha pagado" checked={recordatorios.despues3} onChange={v => setRecordatorios(prev => ({ ...prev, despues3: v }))} />
        </div>
        {clienteEjemplo && (
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, padding: 12, fontSize: 13, color: C.ink }}>
            <p style={{ margin: '0 0 4px', fontWeight: 700 }}>Vista previa del mensaje</p>
            <p style={{ margin: 0 }}>
              Hola {clienteEjemplo.nombre.split(' ')[0]}, tu cuota de {money(clienteEjemplo.valor)} venció el {fechaLarga(clienteEjemplo.fecha)}. Evita intereses de mora pagando hoy. Responde a este mensaje para coordinar tu pago.
            </p>
          </div>
        )}
        <p style={{ fontSize: 12, color: C.muted, margin: '10px 0 0' }}>Horarios y frecuencia se ajustan a la ley de cobranza (Ley 2300 de 2023).</p>
      </Tarjeta>
    </div>
  );
}

function InterruptorRecordatorio({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer', fontSize: 14, color: C.ink }}>
      {label}
      <span onClick={() => onChange(!checked)} role="switch" aria-checked={checked} tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(!checked); } }}
        style={{ width: 40, height: 22, borderRadius: 12, background: checked ? C.green : C.lineStrong, position: 'relative', display: 'inline-block', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: 2, left: checked ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .15s' }} />
      </span>
    </label>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SECCIÓN: SOCIOS Y FLUJO
// ─────────────────────────────────────────────────────────────────────────

function SeccionSocios({ tab, setTab, proyectoId, setProyectoId, clientes, recaudadoSep, onToast }: {
  tab: 'informe' | 'flujo'; setTab: (t: 'informe' | 'flujo') => void;
  proyectoId: string; setProyectoId: (id: string) => void;
  clientes: Cliente[]; recaudadoSep: number;
  onToast: (m: string) => void;
}) {
  const proyecto = proyectoPorId(proyectoId);
  const periodoInicio = '2026-08-15';
  const periodoFin = '2026-09-14';
  const finanzas = FINANZAS_PROYECTO[proyectoId];
  const utilidad = finanzas.recaudado - finanzas.gastos - finanzas.comisiones;
  const vigentes = sociosVigentes(proyecto, periodoFin);
  const soloMizarEnPeriodo = clientes
    .filter(c => c.raw.proyectoId === proyectoId && c.raw.soloMizar)
    .reduce((s, c) => s + c.pagos.filter(p => p.fecha >= periodoInicio && p.fecha <= periodoFin).reduce((t, p) => t + p.valor, 0), 0);

  const flujoFilas = useMemo(() => {
    const meses = ['2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12'];
    return meses.map(m => {
      const esSep = m === '2026-09';
      const historico = HISTORICO_MENSUAL[m];
      const programado = historico?.programado ?? (esSep ? PROGRAMADO_SEP_GRUPO : PROGRAMADO_FUTURO[m] ?? 0);
      const recaudado = historico?.recaudado ?? (esSep ? recaudadoSep : null);
      const egresos = EGRESOS_MENSUAL[m];
      const flujo = (recaudado ?? programado) - egresos;
      return { mes: m, programado, recaudado, egresos, flujo, proyectado: recaudado === null };
    });
  }, [recaudadoSep]);
  const cajaProyectada = CAJA_ACTUAL + flujoFilas.filter(f => f.proyectado).reduce((s, f) => s + f.flujo, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Socios y flujo</h1>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={() => setTab('informe')} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${tab === 'informe' ? C.navy : C.lineStrong}`, background: tab === 'informe' ? C.navy : C.paper, color: tab === 'informe' ? '#fff' : C.ink, fontWeight: 600, fontSize: 13, cursor: 'pointer', minHeight: 40, fontFamily: 'inherit' }}>Informe por socio</button>
        <button type="button" onClick={() => setTab('flujo')} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${tab === 'flujo' ? C.navy : C.lineStrong}`, background: tab === 'flujo' ? C.navy : C.paper, color: tab === 'flujo' ? '#fff' : C.ink, fontWeight: 600, fontSize: 13, cursor: 'pointer', minHeight: 40, fontFamily: 'inherit' }}>Flujo del grupo</button>
      </div>

      {tab === 'informe' ? (
        <Tarjeta>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end', marginBottom: 16 }}>
            <div>
              <label htmlFor="select-proyecto-informe" style={{ fontSize: 13, fontWeight: 600, color: C.ink, display: 'block', marginBottom: 4 }}>Proyecto</label>
              <select id="select-proyecto-informe" value={proyectoId} onChange={e => setProyectoId(e.target.value)} style={{ border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, minHeight: 40 }}>
                {PROYECTOS.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
            <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Periodo: 15 ago – 14 sep 2026</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 16 }}>
            <EstadisticaMini titulo="Recaudado en el periodo" valor={money(finanzas.recaudado)} />
            <EstadisticaMini titulo="Gastos del proyecto" valor={money(finanzas.gastos)} />
            <EstadisticaMini titulo="Comisiones de venta" valor={money(finanzas.comisiones)} />
            <EstadisticaMini titulo="Utilidad" valor={money(utilidad)} />
          </div>
          <p style={{ fontSize: 12, color: C.muted, margin: '0 0 16px' }}>Los gastos vienen del módulo de Compras.</p>

          <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: '0 0 8px' }}>Le corresponde a cada socio</p>
          <div style={{ overflowX: 'auto', marginBottom: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 360 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                  <th style={{ padding: '8px 6px' }}>Socio</th><th style={{ padding: '8px 6px' }}>% vigente</th><th style={{ padding: '8px 6px' }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {vigentes.map(s => (
                  <tr key={s.nombre} style={{ borderBottom: `1px solid ${C.line}` }}>
                    <td style={{ padding: '8px 6px', fontWeight: 600 }}>{s.nombre}</td>
                    <td style={{ padding: '8px 6px' }}>{s.pct}%</td>
                    <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{money(utilidad * s.pct / 100)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {proyectoId === 'cantalta' && (
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>
              No incluye {money(soloMizarEnPeriodo)} que pagó en el periodo 1 cliente que es solo de Mizar: ese dinero va completo a Mizar.
            </p>
          )}

          <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: '8px 0' }}>Línea de tiempo de participación</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {proyecto.socios.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.navy, marginTop: 6, flexShrink: 0 }} />
                <span style={{ color: C.ink }}>
                  Desde {fechaLarga(s.desde)}{s.hasta ? ` hasta ${fechaLarga(s.hasta)}` : ' (vigente)'}: {s.participantes.map(p => `${p.nombre} ${p.pct}%`).join(', ')}
                </span>
              </div>
            ))}
          </div>
          {proyectoId === 'miravista' && (
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>Los gastos anteriores al 5-jun-2025 se reparten entre los 3 socios de esa fecha; los posteriores, entre los 2 socios vigentes.</p>
          )}

          <BotonSecundario onClick={() => onToast('En la plataforma real esto descarga el informe en PDF para el socio')}>Descargar informe para el socio</BotonSecundario>
        </Tarjeta>
      ) : (
        <Tarjeta>
          <p style={{ fontSize: 14, color: C.ink, margin: '0 0 4px', fontWeight: 700 }}>Flujo de caja del grupo</p>
          <p style={{ fontSize: 13, color: C.muted, margin: '0 0 16px' }}>Mayo a diciembre de 2026 · cifras consolidadas de los 6 proyectos</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 680 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                  <th style={{ padding: '8px 6px' }} />
                  {flujoFilas.map(f => <th key={f.mes} style={{ padding: '8px 6px' }}>{MESES_CORTOS[Number(f.mes.slice(5, 7)) - 1]}{f.proyectado ? '*' : ''}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${C.line}` }}>
                  <td style={{ padding: '8px 6px', fontWeight: 600 }}>Programado</td>
                  {flujoFilas.map(f => <td key={f.mes} style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{money(f.programado)}</td>)}
                </tr>
                <tr style={{ borderBottom: `1px solid ${C.line}` }}>
                  <td style={{ padding: '8px 6px', fontWeight: 600 }}>Recaudado</td>
                  {flujoFilas.map(f => <td key={f.mes} style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{f.recaudado !== null ? money(f.recaudado) : '—'}</td>)}
                </tr>
                <tr style={{ borderBottom: `1px solid ${C.line}` }}>
                  <td style={{ padding: '8px 6px', fontWeight: 600 }}>Egresos</td>
                  {flujoFilas.map(f => <td key={f.mes} style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{money(f.egresos)}</td>)}
                </tr>
                <tr style={{ background: C.surfaceStrong }}>
                  <td style={{ padding: '8px 6px', fontWeight: 700 }}>Flujo del mes</td>
                  {flujoFilas.map(f => <td key={f.mes} style={{ padding: '8px 6px', fontWeight: 700, color: f.flujo >= 0 ? C.green : C.red, fontVariantNumeric: 'tabular-nums' }}>{money(f.flujo)}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, color: C.muted, margin: '8px 0 0' }}>* Proyectado con lo programado. Los egresos vienen de Compras y caja menor.</p>
          <div style={{ background: C.blueSoft, border: `1px solid ${C.blue}`, borderRadius: 8, padding: 14, marginTop: 16 }}>
            <p style={{ fontSize: 13, color: C.blue, margin: '0 0 4px', fontWeight: 700 }}>¿Podemos meternos en otro proyecto?</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: C.blue, margin: 0, fontVariantNumeric: 'tabular-nums' }}>
              Caja proyectada a diciembre: {money(cajaProyectada)}
            </p>
            <p style={{ fontSize: 13, color: C.blue, margin: '4px 0 0' }}>Caja hoy {money(CAJA_ACTUAL)} + flujo proyectado de octubre a diciembre.</p>
          </div>
        </Tarjeta>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SECCIÓN: CONFIGURACIÓN
// ─────────────────────────────────────────────────────────────────────────

function SeccionConfiguracion({ config, setConfig }: { config: { tasaMoraMensual: number; diasGracia: number }; setConfig: React.Dispatch<React.SetStateAction<{ tasaMoraMensual: number; diasGracia: number }>> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Configuración</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        <Tarjeta>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Building2 size={18} color={C.navy} /> <p style={{ fontSize: 16, fontWeight: 700, color: C.ink, margin: 0 }}>Bucaramanga</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label htmlFor="tasa-mora" style={{ fontSize: 13, fontWeight: 600, color: C.ink, display: 'block', marginBottom: 4 }}>Interés de mora (% mensual)</label>
              <input id="tasa-mora" type="number" min={0} step={0.1} value={config.tasaMoraMensual}
                onChange={e => setConfig(prev => ({ ...prev, tasaMoraMensual: Number(e.target.value) || 0 }))}
                style={{ width: 120, border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: '10px 12px', fontSize: 14 }} />
              <p style={{ fontSize: 12, color: C.muted, margin: '6px 0 0' }}>Ejemplo. La tasa la define Mizar con su contador y no puede superar la tasa de usura.</p>
            </div>
            <div>
              <label htmlFor="dias-gracia" style={{ fontSize: 13, fontWeight: 600, color: C.ink, display: 'block', marginBottom: 4 }}>Días de gracia</label>
              <input id="dias-gracia" type="number" min={0} step={1} value={config.diasGracia}
                onChange={e => setConfig(prev => ({ ...prev, diasGracia: Number(e.target.value) || 0 }))}
                style={{ width: 120, border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: '10px 12px', fontSize: 14 }} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.ink, margin: '0 0 6px' }}>Orden de aplicación de un pago</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Chip tono="red" texto="1. Mora" /><Chip tono="amber" texto="2. Interés" /><Chip tono="green" texto="3. Capital" />
              </div>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.ink, margin: '0 0 4px' }}>Abonos extraordinarios</p>
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Preguntar cada vez: reducir el plazo o reducir el valor de la cuota.</p>
            </div>
          </div>
        </Tarjeta>

        <Tarjeta>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Building2 size={18} color={C.navy} /> <p style={{ fontSize: 16, fontWeight: 700, color: C.ink, margin: 0 }}>Cúcuta</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <InterruptorRecordatorio label="Interés de mora" checked={false} onChange={() => {}} />
            <p style={{ fontSize: 12, color: C.muted, marginTop: -8 }}>Cuota fija según contrato, sin interés de mora.</p>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.ink, margin: '0 0 4px' }}>Alerta al acumular 3 cuotas</p>
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Activa la revisión de contrato y posible recuperación del lote.</p>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.ink, margin: '0 0 4px' }}>Bono por referido</p>
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>$500.000 tras la 3.ª cuota del referido; se anula si desiste.</p>
            </div>
          </div>
        </Tarjeta>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────

export default function MizarCarteraDemo() {
  const [seccion, setSeccion] = useState<Seccion>('inicio');
  const [clientes, setClientes] = useState<Cliente[]>(CLIENTES_INICIALES);
  const [siguienteRecibo, setSiguienteRecibo] = useState(RECIBO_INICIAL_NUEVOS);
  const [config, setConfig] = useState({ tasaMoraMensual: 1.5, diasGracia: 5 });
  const [reportes, setReportes] = useState<ReporteWhatsApp[]>(REPORTES_INICIALES);
  const [pagosSinIdentificar, setPagosSinIdentificar] = useState<PagoSinIdentificar[]>(PAGOS_SIN_IDENTIFICAR_INICIALES);
  const [clienteSeleccionadoId, setClienteSeleccionadoId] = useState('la2');
  const [busqueda, setBusqueda] = useState('');
  const [modalPagoAbierto, setModalPagoAbierto] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [recordatorios, setRecordatorios] = useState({ antes3: true, elDia: true, despues3: false });
  const [filtroSedeMorosos, setFiltroSedeMorosos] = useState<'Todas' | Sede>('Todas');
  const [tabSocios, setTabSocios] = useState<'informe' | 'flujo'>('informe');
  const [proyectoInformeId, setProyectoInformeId] = useState('villa-plaza');
  const [recordatoriosEnviados, setRecordatoriosEnviados] = useState<Set<string>>(new Set());

  function mostrarToast(mensaje: string) {
    setToast(mensaje);
    setTimeout(() => setToast(null), 5000);
  }

  const resumenes = useMemo(() => {
    const mapa = new Map<string, { cuotas: CuotaEstado[]; resumen: ResumenCliente }>();
    for (const c of clientes) {
      const proyecto = proyectoPorId(c.raw.proyectoId);
      const cuotas = construirCuotasEstado(c.plan, c.pagos, proyecto.conMora, config.tasaMoraMensual, config.diasGracia);
      const resumen = resumenCliente(cuotas, c.pagos, proyecto);
      mapa.set(c.raw.id, { cuotas, resumen });
    }
    return mapa;
  }, [clientes, config]);

  const kpisInicio = useMemo(() => {
    let valorVencidoTotal = 0, clientesEnMora = 0, clientesAlerta3 = 0;
    for (const c of clientes) {
      const resumen = resumenes.get(c.raw.id)!.resumen;
      if (resumen.cuotasVencidas > 0) { valorVencidoTotal += resumen.valorVencido + resumen.moraAHoy; clientesEnMora++; }
      if (resumen.estadoGeneral === 'ALERTA 3 CUOTAS') clientesAlerta3++;
    }
    // El recaudo del grupo sube con cada pago que se registre en la demo.
    const recaudadoSep = RECAUDADO_SEP_GRUPO_BASE + recaudadoSepDe(clientes) - RECAUDADO_SEP_DEMO_INICIAL;
    const reportesPendientes = reportes.filter(r => r.estado === 'pendiente').length;
    return {
      programadoSep: PROGRAMADO_SEP_GRUPO, recaudadoSep, valorVencidoTotal, clientesEnMora, clientesAlerta3,
      reportesPendientes, sinIdentificar: pagosSinIdentificar.length,
    };
  }, [clientes, resumenes, reportes, pagosSinIdentificar]);

  const barrasMeses = useMemo(() => {
    const fijo = (['2026-04', '2026-05', '2026-06', '2026-07', '2026-08'] as const).map(m => ({
      mes: MESES_CORTOS[Number(m.slice(5, 7)) - 1].replace(/^./, s => s.toUpperCase()),
      programado: HISTORICO_MENSUAL[m].programado, recaudado: HISTORICO_MENSUAL[m].recaudado,
    }));
    return [...fijo, { mes: 'Sep', programado: kpisInicio.programadoSep, recaudado: kpisInicio.recaudadoSep }];
  }, [kpisInicio]);

  const referenciasUsadas = useMemo(() => {
    const set = new Set<string>();
    for (const c of clientes) for (const p of c.pagos) set.add(p.referencia);
    return set;
  }, [clientes]);

  const listaMorosos = useMemo(() => {
    const filas = clientes.map(c => {
      const proyecto = proyectoPorId(c.raw.proyectoId);
      const datos = resumenes.get(c.raw.id)!;
      if (datos.resumen.cuotasVencidas === 0) return null;
      const vencidasOrdenadas = datos.cuotas.filter(cu => cu.estado === 'vencida' || cu.estado === 'parcial');
      const diasAtraso = Math.max(...vencidasOrdenadas.map(cu => cu.diasAtraso));
      let accion: string; let accionTono: Tono;
      if (proyecto.sede === 'Cúcuta' && datos.resumen.cuotasVencidas >= 3) { accion = 'Revisar contrato (posible recuperación del lote)'; accionTono = 'amber'; }
      else if (proyecto.sede === 'Bucaramanga' && datos.resumen.cuotasVencidas >= 3) { accion = 'Proponer acuerdo de pago'; accionTono = 'amber'; }
      else if (datos.resumen.cuotasVencidas === 2) { accion = 'Llamada de cobro'; accionTono = 'blue'; }
      else { accion = 'Recordatorio por WhatsApp'; accionTono = 'blue'; }
      return { cliente: c, proyecto, resumen: datos.resumen, diasAtraso, accion, accionTono };
    }).filter((x): x is NonNullable<typeof x> => x !== null);
    return filas.filter(x => filtroSedeMorosos === 'Todas' || x.proyecto.sede === filtroSedeMorosos)
      .sort((a, b) => b.resumen.cuotasVencidas - a.resumen.cuotasVencidas);
  }, [clientes, resumenes, filtroSedeMorosos]);

  const clienteEjemploRecordatorio = useMemo(() => {
    const vp2 = clientePorIdEn(clientes, 'vp2');
    const datos = resumenes.get('vp2');
    const vencida = datos?.cuotas.find(c => c.estado === 'vencida' || c.estado === 'parcial');
    if (!vp2 || !vencida) return null;
    return { nombre: vp2.raw.nombre, valor: vencida.capitalProg + vencida.interesProg, fecha: vencida.vence };
  }, [clientes, resumenes]);

  // Registra el pago y devuelve el recibo y cómo queda el cliente, para decirlo en el aviso.
  function registrarPagoEnCliente(clienteId: string, valor: number, fecha: string, medio: Medio, cuenta: string, referencia: string, modoAbono: 'plazo' | 'cuota' = 'plazo'): { recibo: string; quedaDebiendo: number } {
    const recibo = `RC-${String(siguienteRecibo).padStart(6, '0')}`;
    const c = clientePorIdEn(clientes, clienteId);
    if (!c) return { recibo, quedaDebiendo: 0 };
    const proyecto = proyectoPorId(c.raw.proyectoId);
    const saldosElegibles = saldosElegiblesPara(c.plan, c.pagos, fecha);
    const { aplicaciones, sobra } = aplicarPagoAPlan(saldosElegibles, valor, fecha, proyecto.conMora, config.tasaMoraMensual, config.diasGracia);
    let planFinal = c.plan;
    let abono: Pago['abono'] | undefined;
    if (sobra > 0) {
      const acumuladoConNuevo = acumularAplicaciones([...c.pagos, { aplicaciones }]);
      planFinal = aplicarAbonoExtraordinario(c.plan, acumuladoConNuevo, sobra, modoAbono);
      abono = { monto: sobra, modo: modoAbono };
    }
    const nuevoPago: Pago = { recibo, fecha, valor, medio, cuenta, referencia, aplicaciones, abono, soporte: true };
    const pagos = [...c.pagos, nuevoPago].sort((a, b) => (a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0));
    const actualizado: Cliente = { ...c, plan: planFinal, pagos };
    const cuotas = construirCuotasEstado(planFinal, pagos, proyecto.conMora, config.tasaMoraMensual, config.diasGracia);
    const r = resumenCliente(cuotas, pagos, proyecto);
    setClientes(prev => prev.map(x => (x.raw.id === clienteId ? actualizado : x)));
    setSiguienteRecibo(n => n + 1);
    return { recibo, quedaDebiendo: r.valorVencido + r.moraAHoy };
  }

  function avisoDePago(prefijo: string, recibo: string, quedaDebiendo: number): string {
    return quedaDebiendo > 0
      ? `${prefijo} · Recibo ${recibo}. Todavía quedan ${money(quedaDebiendo)} vencidos (incluye mora).`
      : `${prefijo} · Recibo ${recibo}. El cliente quedó al día.`;
  }

  function confirmarPagoModal(datos: { valor: number; medio: Medio; cuenta: string; referencia: string; modoAbono: 'plazo' | 'cuota' }) {
    const { recibo, quedaDebiendo } = registrarPagoEnCliente(clienteSeleccionadoId, datos.valor, HOY, datos.medio, datos.cuenta, datos.referencia, datos.modoAbono);
    setModalPagoAbierto(false);
    mostrarToast(avisoDePago('Pago registrado', recibo, quedaDebiendo));
  }

  function confirmarReporte(reporte: ReporteWhatsApp) {
    const cliente = clientePorIdEn(clientes, reporte.clienteId);
    const cuenta = cliente ? proyectoPorId(cliente.raw.proyectoId).cuentaDefault : '';
    const { recibo, quedaDebiendo } = registrarPagoEnCliente(reporte.clienteId, reporte.valor, HOY, 'Transferencia', cuenta, reporte.referencia);
    setReportes(prev => prev.map(r => r.id === reporte.id ? { ...r, estado: 'confirmado' } : r));
    mostrarToast(avisoDePago('Pago confirmado', recibo, quedaDebiendo));
  }

  function rechazarReporte(id: string, motivo: string) {
    setReportes(prev => prev.map(r => r.id === id ? { ...r, estado: 'rechazado', motivoRechazo: motivo } : r));
    mostrarToast('Reporte rechazado. El cliente recibe el motivo por WhatsApp.');
  }

  function asignarSinIdentificar(item: PagoSinIdentificar, clienteId: string) {
    const { recibo, quedaDebiendo } = registrarPagoEnCliente(clienteId, item.valor, item.fecha, 'Consignación', item.cuenta, `CONSIG-${item.fecha.replace(/-/g, '')}`);
    setPagosSinIdentificar(prev => prev.filter(p => p.id !== item.id));
    mostrarToast(avisoDePago('Pago asignado', recibo, quedaDebiendo));
  }

  function enviarRecordatorio(clienteId: string) {
    setRecordatoriosEnviados(prev => new Set(prev).add(clienteId));
    mostrarToast('Recordatorio enviado por WhatsApp');
  }

  const clienteModal = clientePorIdEn(clientes, clienteSeleccionadoId);
  const proyectoModal = clienteModal ? proyectoPorId(clienteModal.raw.proyectoId) : null;

  return (
    <div style={{ minHeight: '100vh', background: C.surface, color: C.ink, fontFamily: "'DM Sans', Arial, sans-serif" }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap'); button:focus-visible, input:focus-visible, select:focus-visible, a:focus-visible, [role='switch']:focus-visible { outline: 2px solid #0a2342; outline-offset: 2px; } * { box-sizing: border-box; } .nav-movil { scrollbar-width: none; } .nav-movil::-webkit-scrollbar { display: none; }"}</style>

      <FranjaAviso />
      <NavMovil seccion={seccion} onCambiar={setSeccion} />
      <Sidebar seccion={seccion} onCambiar={setSeccion} />

      <main className="pt-[116px] lg:pt-[64px] lg:ml-[240px]" style={{ maxWidth: 1180 }}>
        <div className="pb-10 px-3 sm:px-6">
          {seccion === 'inicio' && <SeccionInicio kpis={kpisInicio} barras={barrasMeses} onIrA={setSeccion} />}
          {seccion === 'estado-cuenta' && (
            <SeccionEstadoCuenta clientes={clientes} resumenes={resumenes} busqueda={busqueda} setBusqueda={setBusqueda}
              clienteId={clienteSeleccionadoId} setClienteId={setClienteSeleccionadoId} onAbrirModal={() => setModalPagoAbierto(true)} onToast={mostrarToast} />
          )}
          {seccion === 'por-verificar' && (
            <SeccionPorVerificar clientes={clientes} reportes={reportes} pagosSinIdentificar={pagosSinIdentificar}
              onConfirmarReporte={confirmarReporte} onRechazarReporte={rechazarReporte} onAsignarSinIdentificar={asignarSinIdentificar} />
          )}
          {seccion === 'morosos' && (
            <SeccionMorosos lista={listaMorosos} filtroSede={filtroSedeMorosos} setFiltroSede={setFiltroSedeMorosos}
              recordatoriosEnviados={recordatoriosEnviados} onEnviarRecordatorio={enviarRecordatorio}
              recordatorios={recordatorios} setRecordatorios={setRecordatorios} clienteEjemplo={clienteEjemploRecordatorio} />
          )}
          {seccion === 'socios' && (
            <SeccionSocios tab={tabSocios} setTab={setTabSocios} proyectoId={proyectoInformeId} setProyectoId={setProyectoInformeId}
              clientes={clientes} recaudadoSep={kpisInicio.recaudadoSep} onToast={mostrarToast} />
          )}
          {seccion === 'configuracion' && <SeccionConfiguracion config={config} setConfig={setConfig} />}
        </div>
      </main>

      {modalPagoAbierto && clienteModal && proyectoModal && (
        <ModalRegistrarPago cliente={clienteModal} proyecto={proyectoModal} referenciasUsadas={referenciasUsadas}
          tasaMensual={config.tasaMoraMensual} diasGracia={config.diasGracia} siguienteRecibo={siguienteRecibo}
          onCerrar={() => setModalPagoAbierto(false)} onConfirmar={confirmarPagoModal} />
      )}

      {toast && <Toast mensaje={toast} />}
    </div>
  );
}
