import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, CreditCard, ClipboardCheck, Users, ShieldAlert, Settings,
  Search, X, ChevronRight, Download, Send, Paperclip,
  AlertTriangle, Calendar, Building2, TrendingUp,
  UserPlus, FileText, Undo2, Phone, Handshake, Gift, Printer, Wallet,
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

// Festivos de Colombia 2025–2026. Si una cuota vence en domingo o festivo, se paga sin mora el
// siguiente día hábil (regla R4 del PRD).
const FESTIVOS = new Set([
  '2025-01-01', '2025-01-06', '2025-03-24', '2025-04-17', '2025-04-18', '2025-05-01', '2025-06-02', '2025-06-23',
  '2025-06-30', '2025-07-20', '2025-08-07', '2025-08-18', '2025-10-13', '2025-11-03', '2025-11-17', '2025-12-08', '2025-12-25',
  '2026-01-01', '2026-01-12', '2026-03-23', '2026-04-02', '2026-04-03', '2026-05-01', '2026-05-18', '2026-06-08',
  '2026-06-15', '2026-06-29', '2026-07-20', '2026-08-07', '2026-08-17', '2026-10-12', '2026-11-02', '2026-11-16', '2026-12-08', '2026-12-25',
]);

function esDiaHabil(fecha: string): boolean {
  return new Date(fecha + 'T00:00:00Z').getUTCDay() !== 0 && !FESTIVOS.has(fecha);
}

function siguienteHabil(fecha: string): string {
  let f = fecha;
  while (!esDiaHabil(f)) f = fechaDespues(f, 1);
  return f;
}

// Tasa diaria a partir de la efectiva anual (PRD §9): i_d = (1 + EA)^(1/365) − 1.
function tasaDiaria(ea: number): number { return Math.pow(1 + ea / 100, 1 / 365) - 1; }

// Reparto por mayor residuo: las partes redondeadas siempre suman el total (RF-C309).
function repartir(total: number, participantes: { nombre: string; pct: number }[]): { nombre: string; pct: number; valor: number }[] {
  const exactos = participantes.map(p => ({ ...p, exacto: total * p.pct / 100 }));
  const base = exactos.map(p => ({ ...p, valor: Math.floor(p.exacto) }));
  let sobrante = Math.round(total) - base.reduce((s, p) => s + p.valor, 0);
  const orden = [...base.keys()].sort((a, b) => (base[b].exacto - base[b].valor) - (base[a].exacto - base[a].valor));
  for (const i of orden) { if (sobrante <= 0) break; base[i].valor += 1; sobrante--; }
  return base.map(({ nombre, pct, valor }) => ({ nombre, pct, valor }));
}

// ─────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────

type Sede = 'Bucaramanga' | 'Cúcuta';
type Medio = 'Transferencia' | 'Efectivo' | 'Consignación';
type Seccion = 'inicio' | 'ventas' | 'estado-cuenta' | 'por-verificar' | 'morosos' | 'socios' | 'configuracion';

interface SocioPeriodo { desde: string; hasta: string | null; participantes: { nombre: string; pct: number }[]; }

interface Proyecto {
  id: string; nombre: string; sede: Sede; conMora: boolean; alerta3Cuotas: boolean;
  cuentaDefault: string; socios: SocioPeriodo[]; sociedad: string; prefijo: string;
}

interface CuotaPlan { numero: number; vence: string; capitalProg: number; interesProg: number; etiqueta?: string; reestructurada?: boolean; }

interface Aplicacion { cuota: number; mora: number; interes: number; capital: number; }

type OrigenPago = 'oficina' | 'whatsapp' | 'identificado' | 'administracion-anterior' | 'historico';

interface Pago {
  recibo: string; fecha: string; valor: number; medio: Medio; cuenta: string; referencia: string;
  aplicaciones: Aplicacion[]; abono?: { monto: number; modo: 'plazo' | 'cuota' }; saldoFavor?: number;
  soporte?: boolean; administracionAnterior?: boolean;
  origen?: OrigenPago; registradoPor?: string; confirmadoPor?: string;
  planAntes?: CuotaPlan[]; anulado?: { motivo: string; por: string };
}

interface ClienteRaw {
  id: string; nombre: string; cedula: string; telefono: string; proyectoId: string; inmueble: string;
  valorVenta: number; cuotaInicial: number; plazoMeses: number; primeraCuota: string; diaCorte: number;
  cuotasCompletas: number;
  soloMizar?: boolean; referidoDeId?: string; cuotaFijaCucuta?: number;
  parcialValorPagado?: number;
  abonoMonto?: number; abonoModo?: 'plazo' | 'cuota'; abonoFecha?: string;
  administracionAnteriorHasta?: number;
  numeroContrato?: string; autorizaWhatsapp?: boolean; fechaPromesa?: string;
}

interface Acuerdo {
  fecha: string; cuotas: number; valorCuota: number; consolidado: number; descuentoMora: number; autorizadoPor: string;
}

interface Cliente {
  raw: ClienteRaw; plan: CuotaPlan[]; pagos: Pago[];
  estado?: 'vigente' | 'recuperado'; acuerdo?: Acuerdo;
}

interface CuotaEstado extends CuotaPlan {
  capitalPag: number; interesPag: number; moraPag: number; moraPendiente: number;
  estado: 'pagada' | 'parcial' | 'vencida' | 'pendiente' | 'reestructurada'; diasAtraso: number;
}

interface ResumenCliente {
  totalPagado: number; capitalPagado: number; saldoCapital: number; valorVencido: number; moraAHoy: number;
  proximaCuota: CuotaEstado | null; cuotasVencidas: number; estadoGeneral: 'AL DÍA' | 'EN MORA' | 'ALERTA';
  cuotaOrdinaria: number;
}

// Reglas de dinero configurables por sede (PRD §8). Los valores son ejemplos: la tasa la fija Mizar.
interface Reglas {
  tasaEA: number; usuraEA: number; diasGracia: number; moraDesde: 'vencimiento' | 'fin-gracia';
  excedente: 'adelantar' | 'abono'; alertaCuotas: number; bonoValor: number; exigeVerificacion: boolean;
}

const REGLAS_INICIALES: Reglas = {
  tasaEA: 24, usuraEA: 26.5, diasGracia: 0, moraDesde: 'vencimiento',
  excedente: 'adelantar', alertaCuotas: 3, bonoValor: 500000, exigeVerificacion: true,
};

function tasaDiariaAplicada(r: Reglas): number { return tasaDiaria(Math.min(r.tasaEA, r.usuraEA)); }

type Rol = 'cartera' | 'tesoreria' | 'sede' | 'gerencia';
interface Persona { id: string; nombre: string; cargo: string; rol: Rol; sede: Sede | null; }

const PERSONAS: Persona[] = [
  { id: 'jennifer', nombre: 'Jennifer', cargo: 'Cartera · Bucaramanga', rol: 'cartera', sede: 'Bucaramanga' },
  { id: 'yurley', nombre: 'Yurley', cargo: 'Cartera · Cúcuta', rol: 'cartera', sede: 'Cúcuta' },
  { id: 'oscar', nombre: 'Óscar Daniel', cargo: 'Tesorería', rol: 'tesoreria', sede: null },
  { id: 'jose', nombre: 'José Luis', cargo: 'Responsable de Cúcuta', rol: 'sede', sede: 'Cúcuta' },
  { id: 'claudia', nombre: 'Claudia', cargo: 'Gerencia', rol: 'gerencia', sede: null },
];

const SECCIONES_POR_ROL: Record<Rol, Seccion[]> = {
  cartera: ['inicio', 'ventas', 'estado-cuenta', 'morosos'],
  tesoreria: ['inicio', 'estado-cuenta', 'por-verificar', 'socios'],
  sede: ['inicio', 'ventas', 'estado-cuenta', 'por-verificar', 'morosos', 'socios'],
  gerencia: ['inicio', 'ventas', 'estado-cuenta', 'por-verificar', 'morosos', 'socios', 'configuracion'],
};

function vigentes(pagos: Pago[]): Pago[] { return pagos.filter(p => !p.anulado); }

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

// Mora diaria simple (PRD §9): cada día de atraso suma el CAPITAL vencido de la cuota por la tasa
// diaria, nunca sobre intereses ni sobre mora. Cada abono parcial baja la base desde su fecha. Si el
// vencimiento cae en domingo o festivo, cuenta desde el siguiente día hábil; si el cliente paga todo
// dentro de los días de gracia, no hay mora.
interface EventoCuota { fecha: string; aplicado: number; }

function moraDevengada(capitalCuota: number, vence: string, eventos: EventoCuota[], hasta: string, r: Reglas): number {
  const efectivo = siguienteHabil(vence);
  const finGracia = fechaDespues(efectivo, r.diasGracia);
  if (hasta <= finGracia) return 0;
  const pagadoEnGracia = eventos.filter(e => e.fecha <= finGracia).reduce((s, e) => s + e.aplicado, 0);
  if (capitalCuota - pagadoEnGracia <= 0.5) return 0;
  const td = tasaDiariaAplicada(r);
  let desde = r.moraDesde === 'fin-gracia' ? finGracia : efectivo;
  let saldo = capitalCuota;
  let total = 0;
  for (const e of eventos) {
    if (e.fecha > hasta) break;
    if (e.fecha > desde) { total += saldo * td * diffDays(desde, e.fecha); desde = e.fecha; }
    saldo = Math.max(0, saldo - e.aplicado);
  }
  if (saldo > 0.5 && hasta > desde) total += saldo * td * diffDays(desde, hasta);
  return Math.round(total);
}

interface SaldoCuota {
  numero: number; vence: string; capitalCuota: number; saldoCapital: number; saldoInteres: number;
  moraPagPrevia: number; eventos: EventoCuota[]; reestructurada?: boolean;
}

function aplicarPagoAPlan(
  saldos: SaldoCuota[], valor: number, fechaPago: string, conMora: boolean, r: Reglas,
): { aplicaciones: Aplicacion[]; sobra: number } {
  let restante = valor;
  const aplicaciones: Aplicacion[] = [];
  for (const s of saldos) {
    if (restante <= 0.5) break;
    if (s.reestructurada) continue;
    if (s.saldoCapital <= 0.5 && s.saldoInteres <= 0.5) continue;
    let mora = 0, interes = 0, capital = 0;
    if (conMora && fechaPago > s.vence) {
      const moraPendiente = Math.max(0, moraDevengada(s.capitalCuota, s.vence, s.eventos, fechaPago, r) - s.moraPagPrevia);
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
      lista.push({ fecha: p.fecha, aplicado: a.capital });
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
      numero: c.numero, vence: c.vence, capitalCuota: c.capitalProg,
      saldoCapital: Math.max(0, c.capitalProg - e.capitalPag),
      saldoInteres: Math.max(0, c.interesProg - e.interesPag),
      moraPagPrevia: e.moraPag, eventos: eventos.get(c.numero) ?? [], reestructurada: c.reestructurada,
    };
  });
}

// Estado de cada cuota a una fecha (el estado de cuenta "a una fecha pasada" usa la misma función).
function construirCuotasEstado(plan: CuotaPlan[], pagos: Pago[], conMora: boolean, r: Reglas, fecha: string = HOY): CuotaEstado[] {
  const activos = vigentes(pagos).filter(p => p.fecha <= fecha);
  return construirSaldos(plan, activos).map((s, i) => {
    const c = plan[i];
    const capitalPag = c.capitalProg - s.saldoCapital;
    const interesPag = c.interesProg - s.saldoInteres;
    if (c.reestructurada) {
      return { ...c, capitalPag, interesPag, moraPag: s.moraPagPrevia, moraPendiente: 0, estado: 'reestructurada' as const, diasAtraso: 0 };
    }
    const vencida = siguienteHabil(c.vence) < fecha;
    const pagada = s.saldoCapital <= 0.5 && s.saldoInteres <= 0.5;
    const diasAtraso = vencida ? diffDays(c.vence, fecha) : 0;
    const moraPendiente = conMora && vencida && !pagada
      ? Math.max(0, moraDevengada(s.capitalCuota, c.vence, s.eventos, fecha, r) - s.moraPagPrevia)
      : 0;
    let estado: CuotaEstado['estado'];
    if (pagada) estado = 'pagada';
    else if (vencida) estado = (capitalPag > 0 || interesPag > 0 || s.moraPagPrevia > 0) ? 'parcial' : 'vencida';
    else estado = 'pendiente';
    return { ...c, capitalPag, interesPag, moraPag: s.moraPagPrevia, moraPendiente, estado, diasAtraso };
  });
}

// La alerta de Cúcuta salta cuando lo vencido equivale a N cuotas ordinarias (P11, valor por defecto).
function resumenCliente(cuotas: CuotaEstado[], pagos: Pago[], proyecto: Proyecto, r: Reglas, fecha: string = HOY): ResumenCliente {
  const activos = vigentes(pagos).filter(p => p.fecha <= fecha);
  const totalPagado = activos.reduce((s, p) => s + p.valor, 0);
  const capitalPagado = cuotas.reduce((s, c) => s + c.capitalPag, 0) + activos.reduce((s, p) => s + (p.abono?.monto ?? 0), 0);
  const saldoCapital = cuotas.reduce((s, c) => s + (c.reestructurada ? 0 : Math.max(0, c.capitalProg - c.capitalPag)), 0);
  const vencidas = cuotas.filter(c => c.estado === 'vencida' || c.estado === 'parcial');
  const valorVencido = vencidas.reduce((s, c) => s + Math.max(0, c.capitalProg - c.capitalPag) + Math.max(0, c.interesProg - c.interesPag), 0);
  const moraAHoy = cuotas.reduce((s, c) => s + c.moraPendiente, 0);
  const proximaCuota = cuotas.find(c => c.estado === 'pendiente') ?? null;
  const cuotasVencidas = vencidas.length;
  const ordinarias = cuotas.filter(c => !c.etiqueta && !c.reestructurada).map(c => c.capitalProg + c.interesProg).sort((a, b) => a - b);
  const cuotaOrdinaria = ordinarias.length ? ordinarias[Math.floor(ordinarias.length / 2)] : 0;
  let estadoGeneral: ResumenCliente['estadoGeneral'] = 'AL DÍA';
  if (proyecto.alerta3Cuotas && cuotaOrdinaria > 0 && valorVencido >= r.alertaCuotas * cuotaOrdinaria - 0.5) estadoGeneral = 'ALERTA';
  else if (cuotasVencidas >= 1) estadoGeneral = 'EN MORA';
  return { totalPagado, capitalPagado, saldoCapital, valorVencido, moraAHoy, proximaCuota, cuotasVencidas, estadoGeneral, cuotaOrdinaria };
}

function textoEstadoGeneral(e: ResumenCliente['estadoGeneral'], r: Reglas): string {
  return e === 'ALERTA' ? `ALERTA ${r.alertaCuotas} CUOTAS` : e;
}

// Acuerdo de pago (RF-C306): lo vencido (capital, interés y mora menos el descuento) se reparte en
// N cuotas nuevas; las cuotas vencidas quedan "reestructuradas" y nace una versión nueva del plan.
// La mora consolidada entra como interés de las cuotas del acuerdo: no vuelve a causar mora.
function construirAcuerdo(cliente: Cliente, cuotas: CuotaEstado[], nCuotas: number, descuentoPct: number, primera: string): { plan: CuotaPlan[]; acuerdo: Omit<Acuerdo, 'autorizadoPor'> } {
  const vencidas = cuotas.filter(c => c.estado === 'vencida' || c.estado === 'parcial');
  const capitalV = vencidas.reduce((s, c) => s + Math.max(0, c.capitalProg - c.capitalPag), 0);
  const interesV = vencidas.reduce((s, c) => s + Math.max(0, c.interesProg - c.interesPag), 0);
  const mora = vencidas.reduce((s, c) => s + c.moraPendiente, 0);
  const descuento = Math.round(mora * descuentoPct / 100);
  const otros = interesV + mora - descuento;
  const numerosVencidos = new Set(vencidas.map(c => c.numero));
  const plan: CuotaPlan[] = cliente.plan.map(c => {
    if (!numerosVencidos.has(c.numero)) return { ...c };
    const e = cuotas.find(x => x.numero === c.numero)!;
    return { ...c, capitalProg: e.capitalPag, interesProg: e.interesPag, reestructurada: true };
  });
  const maxNumero = Math.max(...cliente.plan.map(c => c.numero));
  let capAcum = 0, otrosAcum = 0;
  for (let k = 1; k <= nCuotas; k++) {
    const cap = k === nCuotas ? capitalV - capAcum : Math.round(capitalV / nCuotas);
    const otr = k === nCuotas ? otros - otrosAcum : Math.round(otros / nCuotas);
    capAcum += cap; otrosAcum += otr;
    plan.push({ numero: maxNumero + k, etiqueta: `A${k}`, vence: sumarMeses(primera, k - 1, cliente.raw.diaCorte), capitalProg: cap, interesProg: otr });
  }
  plan.sort((a, b) => (a.vence < b.vence ? -1 : a.vence > b.vence ? 1 : a.numero - b.numero));
  const consolidado = capitalV + otros;
  return { plan, acuerdo: { fecha: HOY, cuotas: nCuotas, valorCuota: Math.round(consolidado / nCuotas), consolidado, descuentoMora: descuento } };
}

// Bono por referido (RF-C504): se causa cuando el referido completa sus 3 primeras cuotas y se
// anula si antes acumula 2 cuotas vencidas o su contrato se cae.
function estadoBono(referido: Cliente, cuotas: CuotaEstado[]): { estado: 'pendiente' | 'causado' | 'anulado'; pagadas: number } {
  const primeras = [...cuotas].filter(c => !c.etiqueta).sort((a, b) => a.numero - b.numero).slice(0, 3);
  const pagadas = primeras.filter(c => c.estado === 'pagada').length;
  if (referido.estado === 'recuperado') return { estado: 'anulado', pagadas };
  if (pagadas >= 3) return { estado: 'causado', pagadas };
  if (cuotas.filter(c => c.estado === 'vencida' || c.estado === 'parcial').length >= 2) return { estado: 'anulado', pagadas };
  return { estado: 'pendiente', pagadas };
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
  if (p.saldoFavor) partes.push(`Saldo a favor ${money(p.saldoFavor)}`);
  return partes.length ? partes.join(' · ') : '—';
}

interface EfectoAbono { mesesReducidos: number; cuotaAntes: number; cuotaDespues: number; }

function simularAbono(cliente: Cliente, aplicacionesNuevas: Aplicacion[], sobra: number, modo: 'plazo' | 'cuota'): EfectoAbono {
  const acumuladoConNuevo = acumularAplicaciones([...vigentes(cliente.pagos), { aplicaciones: aplicacionesNuevas }]);
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
    cuentaDefault: 'Bancolombia Mizar', sociedad: 'Mizar Diseño y Construcción', prefijo: 'VP',
    socios: [{ desde: '2024-01-01', hasta: null, participantes: [{ nombre: 'Mizar', pct: 60 }, { nombre: 'Inversionista Villa Plaza', pct: 40 }] }],
  },
  {
    id: 'montana', nombre: 'Miradores de la Montaña', sede: 'Bucaramanga', conMora: true, alerta3Cuotas: false,
    cuentaDefault: 'Bancolombia Mizar', sociedad: 'Mizar Diseño y Construcción', prefijo: 'MM',
    socios: [{ desde: '2024-01-01', hasta: null, participantes: [{ nombre: 'Mizar', pct: 100 }] }],
  },
  {
    id: 'laureles', nombre: 'Laureles Campestre T3', sede: 'Bucaramanga', conMora: true, alerta3Cuotas: false,
    cuentaDefault: 'Bancolombia Mizar', sociedad: 'Mizar Diseño y Construcción', prefijo: 'LC',
    socios: [{ desde: '2024-01-01', hasta: null, participantes: [{ nombre: 'Mizar', pct: 100 }] }],
  },
  {
    id: 'cantalta', nombre: 'Miradores de Cantalta', sede: 'Bucaramanga', conMora: true, alerta3Cuotas: false,
    cuentaDefault: 'Bancolombia Mizar', sociedad: 'Mizar Diseño y Construcción', prefijo: 'MC',
    socios: [{ desde: '2024-01-01', hasta: null, participantes: [{ nombre: 'Mizar', pct: 50 }, { nombre: 'Socio Cantalta', pct: 50 }] }],
  },
  {
    id: 'miraflor', nombre: 'Miraflor (Mi Lote)', sede: 'Cúcuta', conMora: false, alerta3Cuotas: true,
    cuentaDefault: 'Cuenta Miraflor', sociedad: 'Asociación de Vivienda Miraflor', prefijo: 'MF',
    socios: [{ desde: '2024-01-01', hasta: null, participantes: [{ nombre: 'Ictinos', pct: 100 }] }],
  },
  {
    id: 'miravista', nombre: 'Miravista (Mi Lote)', sede: 'Cúcuta', conMora: false, alerta3Cuotas: true,
    cuentaDefault: 'Cuenta Ictinos', sociedad: 'Ictinos Inmobiliaria', prefijo: 'MV',
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
    const { aplicaciones } = aplicarPagoAPlan(saldos, valor, fechaPago, proyecto.conMora, REGLAS_INICIALES);
    const anterior = n <= adminHasta;
    pagos.push({
      recibo: anterior ? 'Adm. anterior' : nuevoRecibo(), fecha: fechaPago, valor,
      medio: n % 4 === 0 ? 'Efectivo' : n % 4 === 1 ? 'Consignación' : 'Transferencia',
      cuenta: anterior ? 'Recaudo administración anterior' : proyecto.cuentaDefault,
      referencia: nuevaReferencia(), aplicaciones, soporte: true,
      administracionAnterior: anterior, origen: anterior ? 'administracion-anterior' : 'historico',
    });
  }

  if (raw.parcialValorPagado) {
    const cuota = plan[raw.cuotasCompletas];
    const saldos = construirSaldos(plan, pagos);
    const fechaPago = fechaDespues(cuota.vence, 10);
    const { aplicaciones } = aplicarPagoAPlan(saldos, raw.parcialValorPagado, fechaPago, proyecto.conMora, REGLAS_INICIALES);
    pagos.push({
      recibo: nuevoRecibo(), fecha: fechaPago, valor: raw.parcialValorPagado, medio: 'Transferencia',
      cuenta: proyecto.cuentaDefault, referencia: nuevaReferencia(), aplicaciones, soporte: true, origen: 'historico',
    });
  }

  let planFinal = plan;
  if (raw.abonoMonto && raw.abonoFecha && raw.abonoModo) {
    const acumulado = acumularAplicaciones(pagos);
    planFinal = aplicarAbonoExtraordinario(plan, acumulado, raw.abonoMonto, raw.abonoModo);
    pagos.push({
      recibo: nuevoRecibo(), fecha: raw.abonoFecha, valor: raw.abonoMonto, medio: 'Transferencia',
      cuenta: proyecto.cuentaDefault, referencia: nuevaReferencia(), aplicaciones: [],
      abono: { monto: raw.abonoMonto, modo: raw.abonoModo }, soporte: true, origen: 'historico', planAntes: plan,
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
  return CLIENTES_RAW.map((raw, i) => {
    const proyecto = proyectoPorId(raw.proyectoId);
    const conNumero = { ...raw, numeroContrato: raw.numeroContrato ?? `${proyecto.prefijo}-${String(i + 3).padStart(3, '0')}-${raw.primeraCuota.slice(0, 4)}`, autorizaWhatsapp: raw.autorizaWhatsapp ?? true };
    return construirClienteInicial(conNumero, proyecto, nuevaReferencia, nuevoRecibo);
  });
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

// Un pago "por verificar" puede venir del cliente por WhatsApp o de una transferencia que cartera
// registró en la oficina: en ambos casos lo confirma tesorería contra el extracto (regla R20).
interface ReporteWhatsApp {
  id: string; clienteId: string; fecha: string; hora: string; valor: number; banco: string; referencia: string;
  estado: 'pendiente' | 'confirmado' | 'rechazado';
  alerta?: { tipo: 'referencia-repetida' | 'valor-no-coincide' | 'fecha-rara'; mensaje: string };
  motivoRechazo?: string; recibo?: string;
  origen: 'whatsapp' | 'oficina'; medio: Medio; cuenta: string; registradoPor?: string;
}

const REPORTES_INICIALES: ReporteWhatsApp[] = (() => {
  const ca2 = clientePorIdEn(CLIENTES_INICIALES, 'ca2')!;
  const pagoRepetido = ca2.pagos[ca2.pagos.length - 1];
  const cuenta = (id: string) => proyectoPorId(clientePorIdEn(CLIENTES_INICIALES, id)!.raw.proyectoId).cuentaDefault;
  return [
    { id: 'rep-1', clienteId: 'ca2', fecha: '2026-09-22', hora: '19:41', valor: pagoRepetido.valor, banco: 'Bancolombia', referencia: pagoRepetido.referencia, estado: 'pendiente',
      origen: 'whatsapp', medio: 'Transferencia', cuenta: cuenta('ca2'),
      alerta: { tipo: 'referencia-repetida', mensaje: `Referencia repetida: ya se usó el ${fechaLarga(pagoRepetido.fecha)} en el recibo ${pagoRepetido.recibo}` } },
    { id: 'rep-2', clienteId: 'mf2', fecha: '2026-09-22', hora: '08:05', valor: 480000, banco: 'Davivienda', referencia: 'BC109981', estado: 'pendiente',
      origen: 'whatsapp', medio: 'Transferencia', cuenta: cuenta('mf2'),
      alerta: { tipo: 'valor-no-coincide', mensaje: 'El valor no coincide con la cuota ($480.000 vs $500.000)' } },
    { id: 'rep-3', clienteId: 'vp2', fecha: '2026-09-23', hora: '07:52', valor: valorCuota('vp2', 10), banco: 'Bancolombia', referencia: 'BC109982', estado: 'pendiente',
      origen: 'whatsapp', medio: 'Transferencia', cuenta: cuenta('vp2') },
    { id: 'rep-4', clienteId: 'la1', fecha: '2026-09-23', hora: '09:10', valor: valorCuota('la1', 10), banco: 'Bancolombia', referencia: 'BC109983', estado: 'pendiente',
      origen: 'oficina', medio: 'Transferencia', cuenta: cuenta('la1'), registradoPor: 'Jennifer' },
  ];
})();

// Valor que el cliente debe pagar hoy: lo vencido más la próxima cuota.
function valorEsperado(cliente: Cliente, cuotas: CuotaEstado[]): number {
  const vencido = cuotas.filter(c => c.estado === 'vencida' || c.estado === 'parcial')
    .reduce((s, c) => s + Math.max(0, c.capitalProg - c.capitalPag) + Math.max(0, c.interesProg - c.interesPag) + c.moraPendiente, 0);
  const proxima = cuotas.find(c => c.estado === 'pendiente');
  return vencido > 0 ? vencido : proxima ? proxima.capitalProg + proxima.interesProg : 0;
}

// Alertas automáticas al recibir un reporte (PRD §12): referencia repetida (bloquea), valor distinto
// de lo esperado y fecha futura o de hace más de 60 días (avisan).
function alertaDeReporte(clientes: Cliente[], reportes: ReporteWhatsApp[], esperado: number, valor: number, referencia: string, fecha: string): ReporteWhatsApp['alerta'] {
  for (const c of clientes) {
    const p = vigentes(c.pagos).find(x => x.referencia === referencia);
    if (p) return { tipo: 'referencia-repetida', mensaje: `Referencia repetida: ya se usó el ${fechaLarga(p.fecha)} en el recibo ${p.recibo}` };
  }
  if (reportes.some(r => r.estado !== 'rechazado' && r.referencia === referencia)) {
    return { tipo: 'referencia-repetida', mensaje: 'Referencia repetida: ya llegó otro reporte con esta misma referencia' };
  }
  if (fecha > HOY || diffDays(fecha, HOY) > 60) return { tipo: 'fecha-rara', mensaje: `Fecha de pago poco común (${fechaLarga(fecha)}): revisar en el extracto` };
  if (esperado > 0 && Math.abs(valor - esperado) > 0.5) return { tipo: 'valor-no-coincide', mensaje: `El valor no coincide con lo que debe (${money(valor)} vs ${money(esperado)})` };
  return undefined;
}

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

// % de cumplimiento: de las cuotas que vencían en el mes, cuánto se pagó antes de cerrar el mes.
// Es distinto del % de recaudo total (recaudado ÷ programado), que sube cuando alguien se pone al día.
const CUMPLIMIENTO_MENSUAL: Record<string, number> = { '2026-05': 0.81, '2026-06': 0.74, '2026-07': 0.79, '2026-08': 0.72, '2026-09': 0.68 };
const EGRESOS_PROGRAMADOS: Record<string, number> = {
  '2026-05': 128000000, '2026-06': 135000000, '2026-07': 131000000, '2026-08': 139000000, '2026-09': 142000000,
  '2026-10': 150000000, '2026-11': 155000000, '2026-12': 160000000,
};

// Saldos reportados por tesorería; al lado, lo que cartera recaudó en esa cuenta desde ese día (RF-C804).
const SALDOS_REPORTADOS: { cuenta: string; sede: Sede; fecha: string; saldo: number; deTercero?: boolean }[] = [
  { cuenta: 'Bancolombia Mizar', sede: 'Bucaramanga', fecha: '2026-09-15', saldo: 286000000 },
  { cuenta: 'Cuenta Ictinos', sede: 'Cúcuta', fecha: '2026-09-15', saldo: 41500000 },
  { cuenta: 'Cuenta Miraflor', sede: 'Cúcuta', fecha: '2026-09-15', saldo: 3080000, deTercero: true },
];

// Septiembre del grupo completo; los 12 clientes de la demo son una muestra.
const PROGRAMADO_SEP_GRUPO = 194000000;
const RECAUDADO_SEP_GRUPO_BASE = 151000000;
function recaudadoSepDe(clientes: Cliente[]): number {
  return clientes.reduce((s, c) => s + vigentes(c.pagos).filter(p => p.fecha.startsWith('2026-09') && !p.administracionAnterior).reduce((t, p) => t + p.valor, 0), 0);
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
  if (estado === 'reestructurada') return { tono: 'purple', texto: 'Reestructurada' };
  return { tono: 'muted', texto: 'Próxima' };
}

function chipDeEstadoGeneral(estado: ResumenCliente['estadoGeneral']): Tono {
  if (estado === 'AL DÍA') return 'green';
  if (estado === 'ALERTA') return 'amber';
  return 'red';
}

// Etiqueta y campo reutilizables de los formularios de la demo.
function Campo({ id, label, children, ayuda }: { id: string; label: string; children: React.ReactNode; ayuda?: string }) {
  return (
    <div>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600, color: C.ink, display: 'block', marginBottom: 4 }}>{label}</label>
      {children}
      {ayuda && <p style={{ fontSize: 12, color: C.muted, margin: '4px 0 0' }}>{ayuda}</p>}
    </div>
  );
}

const estiloInput: React.CSSProperties = { width: '100%', border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, minHeight: 40, fontFamily: 'inherit', background: C.paper };

function Modal({ titulo, subtitulo, onCerrar, children, ancho = 520 }: { titulo: string; subtitulo?: string; onCerrar: () => void; children: React.ReactNode; ancho?: number }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,35,66,.45)', zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onCerrar}>
      <div role="dialog" aria-label={titulo} onClick={e => e.stopPropagation()} style={{ background: C.paper, borderRadius: 14, padding: 24, width: '100%', maxWidth: ancho, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(10,35,66,.35)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.ink, margin: 0 }}>{titulo}</h2>
            {subtitulo && <p style={{ fontSize: 13, color: C.muted, margin: '4px 0 0' }}>{subtitulo}</p>}
          </div>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, minHeight: 40, minWidth: 40 }}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
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
// TELÉFONO SIMULADO: formulario «Reportar un pago» (WhatsApp Flow de 3 pantallas, PRD §12)
// ─────────────────────────────────────────────────────────────────────────

function TelefonoFlow({ clientes, onEnviar }: {
  clientes: Cliente[];
  onEnviar: (d: { clienteId: string; valor: number; fecha: string; cuenta: string; referencia: string }) => void;
}) {
  const candidatos = clientes.filter(c => c.estado !== 'recuperado');
  const [clienteId, setClienteId] = useState(candidatos.find(c => c.raw.id === 'mf1')?.raw.id ?? candidatos[0]?.raw.id ?? '');
  const [paso, setPaso] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [valorTexto, setValorTexto] = useState('');
  const [fecha, setFecha] = useState(HOY);
  const [referencia, setReferencia] = useState('');
  const [foto, setFoto] = useState(false);
  const cliente = clientePorIdEn(clientes, clienteId);
  if (!cliente) return null;
  const proyecto = proyectoPorId(cliente.raw.proyectoId);
  const primerNombre = cliente.raw.nombre.split(' ')[0];
  const proxima = cliente.plan.find(c => c.vence >= HOY && !c.reestructurada);
  const valor = Number(valorTexto.replace(/\D/g, '')) || 0;

  function reiniciar(id: string) { setClienteId(id); setPaso(0); setValorTexto(''); setReferencia(''); setFoto(false); setFecha(HOY); }

  const burbuja = (texto: React.ReactNode, mio = false) => (
    <div style={{ alignSelf: mio ? 'flex-end' : 'flex-start', background: mio ? '#005c4b' : '#202c33', color: '#e9edef', padding: '8px 10px', borderRadius: mio ? '8px 0 8px 8px' : '0 8px 8px 8px', fontSize: 13, maxWidth: '90%' }}>{texto}</div>
  );
  const campoFlow = (label: string, control: React.ReactNode) => (
    <label style={{ display: 'block', fontSize: 12, color: '#54656f', fontWeight: 600 }}>
      {label}
      <div style={{ marginTop: 4 }}>{control}</div>
    </label>
  );
  const inputFlow: React.CSSProperties = { width: '100%', border: '1px solid #d1d7db', borderRadius: 6, padding: '8px 10px', fontSize: 13, fontFamily: 'inherit' };
  const botonFlow = (texto: string, onClick: () => void, disabled = false) => (
    <button type="button" onClick={onClick} disabled={disabled} style={{ width: '100%', background: disabled ? '#b8c4c2' : '#00a884', color: '#fff', border: 'none', borderRadius: 20, padding: '10px', fontWeight: 700, fontSize: 13, cursor: disabled ? 'not-allowed' : 'pointer', minHeight: 40, fontFamily: 'inherit' }}>{texto}</button>
  );

  return (
    <div style={{ width: 290, flexShrink: 0 }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 }}>Así lo ve el cliente</p>
      <Campo id="flow-cliente" label="Simular como el cliente">
        <select id="flow-cliente" value={clienteId} onChange={e => reiniciar(e.target.value)} style={{ ...estiloInput, marginBottom: 10 }}>
          {candidatos.map(c => <option key={c.raw.id} value={c.raw.id}>{c.raw.nombre}</option>)}
        </select>
      </Campo>
      <div style={{ background: '#111b21', borderRadius: 28, padding: 10, border: '6px solid #1c1c1c', boxShadow: '0 10px 30px rgba(0,0,0,.18)' }}>
        <div style={{ background: '#0b141a', borderRadius: 18, overflow: 'hidden' }}>
          <div style={{ background: '#005c4b', color: '#fff', padding: '10px 12px', fontSize: 13, fontWeight: 700 }}>Mizar · Cartera</div>
          {paso === 0 || paso === 4 ? (
            <div style={{ padding: 12, minHeight: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {burbuja(<>Hola {primerNombre} 👋 tu cuota de {money(proxima ? proxima.capitalProg + proxima.interesProg : 0)} vence el {proxima ? fechaLarga(proxima.vence) : '—'}.</>)}
              {paso === 0 && (
                <button type="button" onClick={() => { setPaso(1); setValorTexto(String(proxima ? proxima.capitalProg + proxima.interesProg : '')); }}
                  style={{ alignSelf: 'flex-start', background: '#005c4b', color: '#fff', border: 'none', borderRadius: 16, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', minHeight: 36, fontFamily: 'inherit' }}>
                  Reportar un pago
                </button>
              )}
              {paso === 4 && (
                <>
                  {burbuja(<><div>Reporté {money(valor)}</div><div>Ref. {referencia} {foto ? '· 📎 comprobante' : ''}</div></>, true)}
                  {burbuja('Recibimos tu reporte. Te avisamos cuando tesorería lo confirme contra el extracto.')}
                  <button type="button" onClick={() => reiniciar(clienteId)} style={{ alignSelf: 'center', background: 'none', border: 'none', color: '#8696a0', fontSize: 12, cursor: 'pointer', minHeight: 36, fontFamily: 'inherit' }}>Reiniciar simulación</button>
                </>
              )}
            </div>
          ) : (
            <div style={{ background: '#fff', minHeight: 380, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: 14, color: '#111b21' }}>{paso === 1 ? 'Contrato' : paso === 2 ? 'Datos del pago' : 'Resumen'}</strong>
                <span style={{ fontSize: 11, color: '#8696a0' }}>Paso {paso} de 3</span>
              </div>
              {paso === 1 && (
                <>
                  {campoFlow('Contrato', (
                    <select style={inputFlow} defaultValue={cliente.raw.id} aria-label="Contrato">
                      <option value={cliente.raw.id}>{proyecto.nombre.replace(' (Mi Lote)', '')} · {cliente.raw.inmueble}</option>
                    </select>
                  ))}
                  <p style={{ fontSize: 11, color: '#667781', margin: 0 }}>Tus contratos llegan cargados en el mensaje: no hay que escribir la cédula.</p>
                  <div style={{ marginTop: 'auto' }}>{botonFlow('Continuar', () => setPaso(2))}</div>
                </>
              )}
              {paso === 2 && (
                <>
                  {campoFlow('Monto pagado', <input style={inputFlow} inputMode="numeric" value={valor ? valor.toLocaleString('es-CO') : ''} onChange={e => setValorTexto(e.target.value)} aria-label="Monto pagado" />)}
                  {campoFlow('Fecha del pago', <input style={inputFlow} type="date" max={HOY} value={fecha} onChange={e => setFecha(e.target.value || HOY)} aria-label="Fecha del pago" />)}
                  {campoFlow('Cuenta', <select style={inputFlow} aria-label="Cuenta"><option>{proyecto.cuentaDefault}</option></select>)}
                  {campoFlow('Referencia', <input style={inputFlow} value={referencia} onChange={e => setReferencia(e.target.value)} placeholder="Ej. BC102345" aria-label="Referencia" />)}
                  <button type="button" onClick={() => setFoto(f => !f)} style={{ ...inputFlow, textAlign: 'left', cursor: 'pointer', background: foto ? '#e7fce3' : '#fff', minHeight: 40 }}>
                    📎 {foto ? 'Comprobante adjunto (foto.jpg)' : 'Adjuntar comprobante'}
                  </button>
                  <div style={{ marginTop: 'auto' }}>{botonFlow('Continuar', () => setPaso(3), valor <= 0 || !referencia.trim())}</div>
                </>
              )}
              {paso === 3 && (
                <>
                  <div style={{ fontSize: 13, color: '#111b21', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span><strong>Contrato:</strong> {cliente.raw.inmueble}</span>
                    <span><strong>Monto:</strong> {money(valor)}</span>
                    <span><strong>Fecha:</strong> {fechaLarga(fecha)}</span>
                    <span><strong>Cuenta:</strong> {proyecto.cuentaDefault}</span>
                    <span><strong>Referencia:</strong> {referencia}</span>
                    <span><strong>Comprobante:</strong> {foto ? 'adjunto' : 'sin adjunto'}</span>
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {botonFlow('Enviar', () => { onEnviar({ clienteId, valor, fecha, cuenta: proyecto.cuentaDefault, referencia: referencia.trim() }); setPaso(4); })}
                    <button type="button" onClick={() => setPaso(2)} style={{ background: 'none', border: 'none', color: '#00a884', fontWeight: 700, fontSize: 13, cursor: 'pointer', minHeight: 36, fontFamily: 'inherit' }}>Corregir</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <p style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>Prueba reportar con una referencia que ya exista: el sistema la bloquea en la bandeja.</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// MODAL: REGISTRAR PAGO
// ─────────────────────────────────────────────────────────────────────────

interface DatosPago {
  valor: number; fecha: string; medio: Medio; cuenta: string; referencia: string;
  excedente: 'adelantar' | 'abono'; modoAbono: 'plazo' | 'cuota';
}

function ModalRegistrarPago({ cliente, proyecto, referenciasUsadas, reglas, siguienteRecibo, persona, onCerrar, onConfirmar }: {
  cliente: Cliente; proyecto: Proyecto; referenciasUsadas: Set<string>; reglas: Reglas; siguienteRecibo: number; persona: Persona;
  onCerrar: () => void; onConfirmar: (datos: DatosPago, vaATesoreria: boolean) => void;
}) {
  const [valorTexto, setValorTexto] = useState('');
  const [fecha, setFecha] = useState(HOY);
  const [medio, setMedio] = useState<Medio>('Transferencia');
  const [cuenta, setCuenta] = useState(proyecto.cuentaDefault);
  const [referencia, setReferencia] = useState('');
  const [adjuntar, setAdjuntar] = useState(true);
  const [excedente, setExcedente] = useState<'adelantar' | 'abono'>(reglas.excedente);
  const [modoAbono, setModoAbono] = useState<'plazo' | 'cuota'>('plazo');

  const valor = Number(valorTexto.replace(/\D/g, '')) || 0;
  const activos = vigentes(cliente.pagos);

  // Primero se mira si el pago supera lo que se debe hoy; solo entonces se pregunta qué hacer con lo que sobra.
  const soloHoy = useMemo(() => {
    if (valor <= 0) return null;
    return aplicarPagoAPlan(saldosElegiblesPara(cliente.plan, activos, fecha), valor, fecha, proyecto.conMora, reglas);
  }, [valor, fecha, cliente, proyecto, reglas, activos]);
  const sobraHoy = soloHoy?.sobra ?? 0;

  const preview = useMemo(() => {
    if (valor <= 0) return null;
    if (sobraHoy > 0 && excedente === 'adelantar') return aplicarPagoAPlan(construirSaldos(cliente.plan, activos), valor, fecha, proyecto.conMora, reglas);
    return soloHoy;
  }, [valor, sobraHoy, excedente, soloHoy, cliente, activos, fecha, proyecto, reglas]);

  const totales = useMemo(() => (preview?.aplicaciones ?? []).reduce((acc, a) => ({ mora: acc.mora + a.mora, interes: acc.interes + a.interes, capital: acc.capital + a.capital }), { mora: 0, interes: 0, capital: 0 }), [preview]);
  const cuotasTocadas = preview ? preview.aplicaciones.length : 0;

  const efectoAbono = useMemo(() => {
    if (!soloHoy || sobraHoy <= 0 || excedente !== 'abono') return null;
    return simularAbono(cliente, soloHoy.aplicaciones, sobraHoy, modoAbono);
  }, [soloHoy, sobraHoy, excedente, modoAbono, cliente]);

  const referenciaLimpia = referencia.trim();
  const referenciaRepetida = referenciaLimpia.length > 0 && referenciasUsadas.has(referenciaLimpia);
  const necesitaReferencia = medio !== 'Efectivo';
  const puedeConfirmar = valor > 0 && (!necesitaReferencia || referenciaLimpia.length > 0) && !referenciaRepetida;
  const vaATesoreria = persona.rol === 'cartera' && medio !== 'Efectivo' && reglas.exigeVerificacion;
  const cuentas = medio === 'Efectivo' ? ['Caja oficina'] : [proyecto.cuentaDefault];

  return (
    <Modal titulo="Registrar pago" subtitulo={`${cliente.raw.nombre} · ${cliente.raw.inmueble} · contrato ${cliente.raw.numeroContrato}`} onCerrar={onCerrar}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Campo id="valor-pago" label="Valor">
          <input id="valor-pago" inputMode="numeric" value={valor ? valor.toLocaleString('es-CO') : ''} onChange={e => setValorTexto(e.target.value)} placeholder="$ 0" style={{ ...estiloInput, fontVariantNumeric: 'tabular-nums' }} />
        </Campo>
        <Campo id="fecha-pago" label="Fecha del pago" ayuda="La del banco o la caja, no la de hoy.">
          <input id="fecha-pago" type="date" max={HOY} value={fecha} onChange={e => setFecha(e.target.value || HOY)} style={estiloInput} />
        </Campo>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Campo id="medio-pago" label="Medio">
          <select id="medio-pago" value={medio} onChange={e => { const m = e.target.value as Medio; setMedio(m); setCuenta(m === 'Efectivo' ? 'Caja oficina' : proyecto.cuentaDefault); }} style={estiloInput}>
            <option>Transferencia</option><option>Efectivo</option><option>Consignación</option>
          </select>
        </Campo>
        <Campo id="cuenta-pago" label="Cuenta donde entró">
          <select id="cuenta-pago" value={cuenta} onChange={e => setCuenta(e.target.value)} style={estiloInput}>
            {cuentas.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Campo>
      </div>
      {necesitaReferencia && (
        <div style={{ marginBottom: 12 }}>
          <Campo id="referencia-pago" label="Referencia bancaria">
            <input id="referencia-pago" value={referencia} onChange={e => setReferencia(e.target.value)} placeholder="Ej. BC102345" style={{ ...estiloInput, borderColor: referenciaRepetida ? C.red : C.lineStrong }} />
          </Campo>
          {referenciaRepetida && <p style={{ color: C.red, fontSize: 13, marginTop: 6, fontWeight: 600 }}>Esta referencia ya se usó en un recibo anterior: el sistema no deja registrarla dos veces.</p>}
        </div>
      )}
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: C.ink, marginBottom: 16, cursor: 'pointer', minHeight: 40 }}>
        <input type="checkbox" checked={adjuntar} onChange={e => setAdjuntar(e.target.checked)} /> Adjuntar soporte escaneado (simulado)
      </label>

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, margin: '0 0 8px' }}>Así se aplica este pago</p>
        {!preview ? (
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Escribe un valor para ver la aplicación: cuota más antigua primero; dentro de ella, mora, interés y capital.</p>
        ) : (
          <>
            <p style={{ fontSize: 13, color: C.muted, margin: '0 0 8px' }}>
              Mora {money(totales.mora)} · Interés {money(totales.interes)} · Capital {money(totales.capital)} · {plural(cuotasTocadas, 'cuota', 'cuotas')}
            </p>
            {sobraHoy > 0 && (
              <div style={{ borderTop: `1px dashed ${C.lineStrong}`, paddingTop: 10, marginTop: 6 }}>
                <p style={{ fontSize: 13, color: C.ink, fontWeight: 600, margin: '0 0 8px' }}>El pago supera lo que debe hoy por {money(sobraHoy)}. ¿Qué hacemos con lo que sobra?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', minHeight: 32 }}>
                    <input type="radio" name="excedente" checked={excedente === 'adelantar'} onChange={() => setExcedente('adelantar')} /> Adelantar las cuotas siguientes
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', minHeight: 32 }}>
                    <input type="radio" name="excedente" checked={excedente === 'abono'} onChange={() => setExcedente('abono')} /> Abono a capital (lo pide el cliente)
                  </label>
                </div>
                {excedente === 'abono' && (
                  <div style={{ display: 'flex', gap: 16, marginBottom: 8, paddingLeft: 22, flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                      <input type="radio" name="modo-abono" checked={modoAbono === 'plazo'} onChange={() => setModoAbono('plazo')} /> Reducir el plazo
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                      <input type="radio" name="modo-abono" checked={modoAbono === 'cuota'} onChange={() => setModoAbono('cuota')} /> Reducir la cuota
                    </label>
                  </div>
                )}
                <p style={{ fontSize: 13, color: C.blue, margin: 0, fontWeight: 600 }}>
                  {excedente === 'adelantar'
                    ? (preview.sobra > 0 ? `Cubre todo el plan y quedan ${money(preview.sobra)} como saldo a favor.` : 'Se aplica a las próximas cuotas, sin recalcular el plan.')
                    : efectoAbono && (modoAbono === 'plazo'
                      ? (efectoAbono.mesesReducidos > 0 ? `Nueva versión del plan: termina ${plural(efectoAbono.mesesReducidos, 'mes', 'meses')} antes.` : `La última cuota baja ${money(sobraHoy)}.`)
                      : `Nueva versión del plan: la cuota baja de ${money(efectoAbono.cuotaAntes)} a ${money(efectoAbono.cuotaDespues)}.`)}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {vaATesoreria && (
        <p style={{ fontSize: 13, color: C.amber, background: C.amberSoft, borderRadius: 8, padding: '10px 12px', margin: '0 0 12px' }}>
          Las transferencias las confirma tesorería contra el extracto. El recibo sale cuando Óscar Daniel lo confirme.
        </p>
      )}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <BotonSecundario onClick={onCerrar}>Cancelar</BotonSecundario>
        <BotonPrimario disabled={!puedeConfirmar} onClick={() => onConfirmar({ valor, fecha, medio, cuenta, referencia: referenciaLimpia || `EFE-${fecha.replace(/-/g, '')}-${siguienteRecibo}`, excedente, modoAbono }, vaATesoreria)}>
          {vaATesoreria ? 'Enviar a tesorería' : `Confirmar pago · RC-${String(siguienteRecibo).padStart(6, '0')}`}
        </BotonPrimario>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// MODALES: RECIBO, ESTADO DE CUENTA EN PDF, ACUERDO, GESTIÓN Y DECISIÓN
// ─────────────────────────────────────────────────────────────────────────

const UNIDADES = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince',
  'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco',
  'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
const DECENAS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const CENTENAS = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

function menosDeMil(n: number): string {
  if (n === 0) return '';
  if (n === 100) return 'cien';
  const r = n % 100;
  const decenas = r === 0 ? '' : r < 30 ? UNIDADES[r] : DECENAS[Math.floor(r / 10)] + (r % 10 ? ` y ${UNIDADES[r % 10]}` : '');
  return [CENTENAS[Math.floor(n / 100)], decenas].filter(Boolean).join(' ');
}

function apocopar(s: string): string { return s.replace(/veintiuno$/, 'veintiún').replace(/uno$/, 'un'); }

// Valor en letras para el recibo (PRD §11).
function numeroALetras(valor: number): string {
  const n = Math.round(valor);
  if (n === 0) return 'cero pesos';
  const millones = Math.floor(n / 1e6), miles = Math.floor((n % 1e6) / 1000), resto = n % 1000;
  const partes: string[] = [];
  if (millones) partes.push(millones === 1 ? 'un millón' : `${apocopar(menosDeMil(millones))} millones`);
  if (miles) partes.push(miles === 1 ? 'mil' : `${apocopar(menosDeMil(miles))} mil`);
  if (resto) partes.push(menosDeMil(resto));
  const texto = partes.join(' ');
  return `${texto}${millones && !miles && !resto ? ' de pesos' : ' pesos'}`.replace(/^./, s => s.toUpperCase());
}

function ModalRecibo({ pago, cliente, proyecto, onCerrar, onToast }: { pago: Pago; cliente: Cliente; proyecto: Proyecto; onCerrar: () => void; onToast: (m: string) => void }) {
  const t = totalesPago(pago);
  return (
    <Modal titulo={`Recibo ${pago.recibo}`} subtitulo={pago.anulado ? `ANULADO · ${pago.anulado.motivo}` : 'Se envía al cliente al confirmar el pago'} onCerrar={onCerrar}>
      <div style={{ border: `1px solid ${C.lineStrong}`, borderRadius: 10, padding: 18, fontSize: 13, color: C.ink, position: 'relative', opacity: pago.anulado ? 0.6 : 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderBottom: `1px solid ${C.line}`, paddingBottom: 10, marginBottom: 10 }}>
          <div>
            <strong style={{ fontSize: 15 }}>{proyecto.sociedad}</strong>
            <div style={{ color: C.muted }}>Recibo de caja</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <strong>{pago.recibo}</strong>
            <div style={{ color: C.muted }}>{fechaLarga(pago.fecha)}</div>
          </div>
        </div>
        <p style={{ margin: '0 0 6px' }}><strong>Recibimos de:</strong> {cliente.raw.nombre} · CC {cliente.raw.cedula}</p>
        <p style={{ margin: '0 0 6px' }}><strong>Contrato:</strong> {cliente.raw.numeroContrato} · {proyecto.nombre} · {cliente.raw.inmueble}</p>
        <p style={{ margin: '0 0 6px' }}><strong>La suma de:</strong> {money(pago.valor)} ({numeroALetras(pago.valor)})</p>
        <p style={{ margin: '0 0 6px' }}><strong>Medio:</strong> {pago.medio} · {pago.cuenta} · Ref. {pago.referencia}</p>
        <p style={{ margin: '0 0 6px' }}><strong>Aplicado a:</strong> {aplicadoATexto(pago)}</p>
        <p style={{ margin: 0, color: C.muted }}>Mora {money(t.mora)} · Interés {money(t.interes)} · Capital {money(t.capital)}{pago.registradoPor ? ` · Registró ${pago.registradoPor}` : ''}{pago.confirmadoPor ? ` · Confirmó ${pago.confirmadoPor}` : ''}</p>
        {pago.anulado && <div style={{ position: 'absolute', top: '40%', left: 0, right: 0, textAlign: 'center', fontSize: 34, fontWeight: 800, color: C.red, transform: 'rotate(-12deg)' }}>ANULADO</div>}
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14, flexWrap: 'wrap' }}>
        <BotonSecundario onClick={() => onToast('En la plataforma real esto descarga el recibo en PDF')}><Download size={15} />PDF</BotonSecundario>
        <BotonSecundario onClick={() => onToast(`En la plataforma real esto lo envía por WhatsApp al ${cliente.raw.telefono}`)}><Send size={15} />Enviar</BotonSecundario>
      </div>
    </Modal>
  );
}

function ModalEstadoCuentaPDF({ cliente, proyecto, cuotas, resumen, fecha, reglas, persona, onCerrar, onToast }: {
  cliente: Cliente; proyecto: Proyecto; cuotas: CuotaEstado[]; resumen: ResumenCliente; fecha: string; reglas: Reglas; persona: Persona;
  onCerrar: () => void; onToast: (m: string) => void;
}) {
  const activos = vigentes(cliente.pagos).filter(p => p.fecha <= fecha);
  const anteriores = activos.filter(p => p.administracionAnterior);
  const actuales = activos.filter(p => !p.administracionAnterior);
  const t = actuales.reduce((acc, p) => { const x = totalesPago(p); return { mora: acc.mora + x.mora, interes: acc.interes + x.interes, capital: acc.capital + x.capital + (p.abono?.monto ?? 0) }; }, { mora: 0, interes: 0, capital: 0 });
  const alDia = resumen.estadoGeneral === 'AL DÍA';
  const celda: React.CSSProperties = { padding: '5px 6px', borderBottom: `1px solid ${C.line}`, fontVariantNumeric: 'tabular-nums' };
  return (
    <Modal titulo="Vista del estado de cuenta en PDF" subtitulo={`Corte al ${fechaLarga(fecha)}`} onCerrar={onCerrar} ancho={760}>
      <div style={{ border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: 22, fontSize: 12, color: C.ink, background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
          <div>
            <strong style={{ fontSize: 16 }}>ESTADO DE CUENTA</strong>
            <div style={{ color: C.muted }}>{proyecto.sociedad}</div>
          </div>
          <span style={{ alignSelf: 'flex-start', border: `2px solid ${alDia ? C.green : C.red}`, color: alDia ? C.green : C.red, fontWeight: 800, padding: '4px 12px', borderRadius: 6, fontSize: 14 }}>
            {alDia ? 'ESTADO AL DÍA' : 'ESTADO EN MORA'}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 14 }}>
          <div><strong>Cliente:</strong> {cliente.raw.nombre}<br />CC {cliente.raw.cedula} · {cliente.raw.telefono}<br /><strong>Contrato:</strong> {cliente.raw.numeroContrato}</div>
          <div><strong>Inmueble:</strong> {proyecto.nombre} · {cliente.raw.inmueble}<br /><strong>Valor:</strong> {money(cliente.raw.valorVenta)} · separación {money(cliente.raw.cuotaInicial)}<br /><strong>Plazo:</strong> {cliente.raw.plazoMeses} cuotas · corte el {cliente.raw.diaCorte === 31 ? 'último día' : cliente.raw.diaCorte} de cada mes</div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
          <thead><tr style={{ textAlign: 'left', color: C.muted }}><th style={celda}>Abono</th><th style={celda}>Recibo</th><th style={celda}>Fecha</th><th style={celda}>Medio</th><th style={celda}>Valor</th><th style={celda}>Aplicado</th></tr></thead>
          <tbody>
            {actuales.slice(-8).map((p, i) => (
              <tr key={i}><td style={celda}>{actuales.length - Math.min(8, actuales.length) + i + 1}</td><td style={celda}>{p.recibo}</td><td style={celda}>{fechaLarga(p.fecha)}</td><td style={celda}>{p.medio}</td><td style={celda}>{money(p.valor)}</td><td style={{ ...celda, color: C.muted }}>{aplicadoATexto(p)}</td></tr>
            ))}
          </tbody>
        </table>
        {actuales.length > 8 && <p style={{ color: C.muted, margin: '-6px 0 10px' }}>En el PDF real salen los {actuales.length} abonos; aquí se muestran los últimos 8.</p>}
        {anteriores.length > 0 && (
          <p style={{ background: C.blueSoft, color: C.blue, padding: 8, borderRadius: 6, margin: '0 0 12px' }}>
            <strong>Pagos de la administración anterior (antes del 5-jun-2025):</strong> {money(anteriores.reduce((s, p) => s + p.valor, 0))} en {anteriores.length} pagos. Cuentan para su saldo.
          </p>
        )}
        {cliente.acuerdo && <p style={{ background: C.purpleSoft, color: C.purple, padding: 8, borderRadius: 6, margin: '0 0 12px' }}><strong>Acuerdo de pago vigente:</strong> {cliente.acuerdo.cuotas} cuotas de {money(cliente.acuerdo.valorCuota)} · descuento de mora {money(cliente.acuerdo.descuentoMora)} autorizado por {cliente.acuerdo.autorizadoPor}.</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8, marginBottom: 12 }}>
          <div><strong>Pagado capital</strong><br />{money(t.capital)}</div>
          <div><strong>Pagado interés</strong><br />{money(t.interes)}</div>
          <div><strong>Pagado mora</strong><br />{money(t.mora)}</div>
          <div><strong>Saldo de capital</strong><br />{money(resumen.saldoCapital)}</div>
          <div><strong>Vencido</strong><br />{money(resumen.valorVencido)}</div>
          <div><strong>Mora a la fecha</strong><br />{money(resumen.moraAHoy)}</div>
          <div><strong>Próximo pago</strong><br />{resumen.proximaCuota ? `${fechaLarga(resumen.proximaCuota.vence)} · ${money(resumen.proximaCuota.capitalProg + resumen.proximaCuota.interesProg)}` : '—'}</div>
        </div>
        <p style={{ color: C.muted, margin: '0 0 10px' }}>
          Por favor verifique que los movimientos coincidan con sus registros. Si detecta alguna diferencia, avísenos en los próximos 15 días.
          {proyecto.conMora ? ` La mora se liquida a la tasa pactada (${reglas.tasaEA} % EA de ejemplo), solo sobre el capital vencido.` : ' Este contrato no cobra interés de mora.'}
        </p>
        <p style={{ margin: 0 }}><strong>{persona.nombre}</strong> · {persona.cargo}</p>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14, flexWrap: 'wrap' }}>
        <BotonSecundario onClick={() => onToast('En la plataforma real esto descarga el PDF y lo guarda en el contrato como evidencia')}><Printer size={15} />Descargar PDF</BotonSecundario>
        <BotonPrimario onClick={() => onToast(`En la plataforma real se envía por WhatsApp al ${cliente.raw.telefono} con la plantilla «Estado de cuenta»`)}><Send size={15} />Enviar al cliente</BotonPrimario>
      </div>
    </Modal>
  );
}

function ModalAcuerdo({ cliente, cuotas, persona, onCerrar, onConfirmar }: {
  cliente: Cliente; cuotas: CuotaEstado[]; persona: Persona; onCerrar: () => void;
  onConfirmar: (n: number, pct: number, primera: string, aprobado: boolean) => void;
}) {
  const [n, setN] = useState(6);
  const [pct, setPct] = useState(0);
  const primera = sumarMeses(HOY, 1, cliente.raw.diaCorte);
  const simulado = useMemo(() => construirAcuerdo(cliente, cuotas, n, pct, primera), [cliente, cuotas, n, pct, primera]);
  const topeSede = 50;
  const puedeAprobar = persona.rol === 'gerencia' || (persona.rol === 'sede' && pct <= topeSede);
  const mora = cuotas.filter(c => c.estado === 'vencida' || c.estado === 'parcial').reduce((s, c) => s + c.moraPendiente, 0);
  return (
    <Modal titulo="Acuerdo de pago" subtitulo={`${cliente.raw.nombre} · lo vencido se reparte en cuotas nuevas`} onCerrar={onCerrar}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Campo id="acuerdo-cuotas" label="Número de cuotas">
          <input id="acuerdo-cuotas" type="number" min={2} max={24} value={n} onChange={e => setN(Math.max(2, Math.min(24, Number(e.target.value) || 2)))} style={estiloInput} />
        </Campo>
        <Campo id="acuerdo-descuento" label="Descuento de mora (%)" ayuda={mora > 0 ? `Mora a hoy: ${money(mora)}` : 'Este contrato no tiene mora.'}>
          <input id="acuerdo-descuento" type="number" min={0} max={100} value={pct} disabled={mora <= 0} onChange={e => setPct(Math.max(0, Math.min(100, Number(e.target.value) || 0)))} style={estiloInput} />
        </Campo>
      </div>
      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, fontSize: 13, color: C.ink, marginBottom: 14 }}>
        <p style={{ margin: '0 0 6px' }}>Se consolida <strong>{money(simulado.acuerdo.consolidado)}</strong> (con {money(simulado.acuerdo.descuentoMora)} de descuento de mora).</p>
        <p style={{ margin: '0 0 6px' }}>{n} cuotas de unos <strong>{money(simulado.acuerdo.valorCuota)}</strong> desde el {fechaLarga(primera)}, además de sus cuotas normales.</p>
        <p style={{ margin: 0, color: C.muted }}>Las cuotas vencidas quedan «reestructuradas» y nace la versión 2 del plan. Si una cuota del acuerdo se vence, el sistema avisa que se incumplió.</p>
      </div>
      {!puedeAprobar && (
        <p style={{ fontSize: 13, color: C.amber, background: C.amberSoft, borderRadius: 8, padding: '10px 12px', margin: '0 0 12px' }}>
          {persona.rol === 'cartera' ? 'Cartera propone el acuerdo; lo aprueba el responsable de sede o gerencia.' : `Un descuento mayor al ${topeSede} % lo aprueba gerencia.`}
        </p>
      )}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <BotonSecundario onClick={onCerrar}>Cancelar</BotonSecundario>
        <BotonPrimario onClick={() => onConfirmar(n, pct, primera, puedeAprobar)}>{puedeAprobar ? 'Aprobar acuerdo' : 'Enviar a aprobación'}</BotonPrimario>
      </div>
    </Modal>
  );
}

interface Gestion { fecha: string; tipo: string; resultado: string; compromiso?: { fecha: string; valor: number }; por: string; }

function ModalGestion({ cliente, onCerrar, onGuardar }: { cliente: Cliente; onCerrar: () => void; onGuardar: (g: Omit<Gestion, 'fecha' | 'por'>) => void }) {
  const [tipo, setTipo] = useState('Llamada');
  const [resultado, setResultado] = useState('');
  const [conCompromiso, setConCompromiso] = useState(false);
  const [fechaCompromiso, setFechaCompromiso] = useState(fechaDespues(HOY, 7));
  const [valorTexto, setValorTexto] = useState('');
  const valor = Number(valorTexto.replace(/\D/g, '')) || 0;
  return (
    <Modal titulo="Registrar gestión de cobro" subtitulo={cliente.raw.nombre} onCerrar={onCerrar}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Campo id="gestion-tipo" label="Tipo">
          <select id="gestion-tipo" value={tipo} onChange={e => setTipo(e.target.value)} style={estiloInput}>
            <option>Llamada</option><option>WhatsApp</option><option>Correo</option><option>Visita</option><option>Nota</option>
          </select>
        </Campo>
        <Campo id="gestion-resultado" label="Resultado">
          <input id="gestion-resultado" value={resultado} onChange={e => setResultado(e.target.value)} placeholder="Ej. Contestó, paga el viernes" style={estiloInput} />
        </Campo>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', minHeight: 40 }}>
          <input type="checkbox" checked={conCompromiso} onChange={e => setConCompromiso(e.target.checked)} /> Dejó un compromiso de pago
        </label>
        {conCompromiso && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Campo id="gestion-fecha" label="Fecha"><input id="gestion-fecha" type="date" min={HOY} value={fechaCompromiso} onChange={e => setFechaCompromiso(e.target.value)} style={estiloInput} /></Campo>
            <Campo id="gestion-valor" label="Valor"><input id="gestion-valor" inputMode="numeric" value={valor ? valor.toLocaleString('es-CO') : ''} onChange={e => setValorTexto(e.target.value)} style={estiloInput} /></Campo>
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <BotonSecundario onClick={onCerrar}>Cancelar</BotonSecundario>
          <BotonPrimario disabled={!resultado.trim()} onClick={() => onGuardar({ tipo, resultado: resultado.trim(), compromiso: conCompromiso && valor > 0 ? { fecha: fechaCompromiso, valor } : undefined })}>Guardar gestión</BotonPrimario>
        </div>
      </div>
    </Modal>
  );
}

type Decision = 'recuperar' | 'acuerdo' | 'esperar';

function ModalDecision({ cliente, resumen, reglas, onCerrar, onDecidir }: { cliente: Cliente; resumen: ResumenCliente; reglas: Reglas; onCerrar: () => void; onDecidir: (d: Decision, motivo: string) => void }) {
  const [decision, setDecision] = useState<Decision>('acuerdo');
  const [motivo, setMotivo] = useState('');
  const opciones: { id: Decision; texto: string; ayuda: string }[] = [
    { id: 'acuerdo', texto: 'Proponer un acuerdo de pago', ayuda: 'Lo vencido se reparte en cuotas nuevas.' },
    { id: 'esperar', texto: 'Dar un plazo y seguir cobrando', ayuda: 'Queda anotado; la alerta se repite si sigue sin pagar.' },
    { id: 'recuperar', texto: 'Recuperar el lote', ayuda: 'Según el contrato. La devolución se paga con una orden de pago en Compras y el lote queda disponible.' },
  ];
  return (
    <Modal titulo={`Alerta de ${reglas.alertaCuotas} cuotas`} subtitulo={`${cliente.raw.nombre} · vencido ${money(resumen.valorVencido)} = ${reglas.alertaCuotas} cuotas de ${money(resumen.cuotaOrdinaria)}`} onCerrar={onCerrar}>
      <p style={{ fontSize: 13, color: C.muted, margin: '0 0 12px' }}>El sistema solo alerta: la decisión la toma una persona, con su motivo, según el contrato.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {opciones.map(o => (
          <label key={o.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', border: `1px solid ${decision === o.id ? C.navy : C.line}`, borderRadius: 8, padding: 12, cursor: 'pointer' }}>
            <input type="radio" name="decision" checked={decision === o.id} onChange={() => setDecision(o.id)} style={{ marginTop: 3 }} />
            <span><strong style={{ fontSize: 14 }}>{o.texto}</strong><br /><span style={{ fontSize: 13, color: C.muted }}>{o.ayuda}</span></span>
          </label>
        ))}
      </div>
      <Campo id="decision-motivo" label="Motivo (obligatorio)">
        <input id="decision-motivo" value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="Ej. Se comunicó y ofrece ponerse al día en 3 meses" style={estiloInput} />
      </Campo>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14 }}>
        <BotonSecundario onClick={onCerrar}>Cancelar</BotonSecundario>
        <BotonPrimario disabled={!motivo.trim()} onClick={() => onDecidir(decision, motivo.trim())}>Guardar decisión</BotonPrimario>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SIDEBAR / NAVEGACIÓN
// ─────────────────────────────────────────────────────────────────────────

const NAV: { id: Seccion; label: string; icono: React.ComponentType<any> }[] = [
  { id: 'inicio', label: 'Inicio', icono: LayoutDashboard },
  { id: 'ventas', label: 'Clientes y contratos', icono: UserPlus },
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

function Sidebar({ seccion, onCambiar, permitidas, persona }: { seccion: Seccion; onCambiar: (s: Seccion) => void; permitidas: Seccion[]; persona: Persona }) {
  return (
    <aside className="hidden lg:flex lg:flex-col" style={{ position: 'fixed', top: 44, left: 0, bottom: 0, width: 240, background: C.navy, padding: '20px 12px', zIndex: 40 }}>
      <div style={{ padding: '0 8px 20px' }}>
        <p style={{ color: '#fff', fontWeight: 800, fontSize: 18, margin: 0 }}>Mizar</p>
        <p style={{ color: '#9db3cc', fontSize: 12, margin: '2px 0 0' }}>Plataforma · Cartera</p>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {NAV.filter(item => permitidas.includes(item.id)).map(item => {
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
        {persona.nombre} · {persona.cargo}
      </div>
    </aside>
  );
}

function NavMovil({ seccion, onCambiar, permitidas }: { seccion: Seccion; onCambiar: (s: Seccion) => void; permitidas: Seccion[] }) {
  return (
    <div className="nav-movil flex lg:hidden" style={{ position: 'fixed', top: 44, left: 0, right: 0, zIndex: 50, background: C.navy, overflowX: 'auto', padding: '8px 10px', gap: 6 }}>
      {NAV.filter(item => permitidas.includes(item.id)).map(item => {
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

// "Ver como": cada persona ve y hace solo lo suyo, y cartera solo ve su sede (PRD §4 y T8).
function SelectorPersona({ persona, onCambiar }: { persona: Persona; onCambiar: (id: string) => void }) {
  const alcance = persona.sede ? `solo ve ${persona.sede}` : 've las dos sedes';
  const puede: Record<Rol, string> = {
    cartera: 'Registra ventas y pagos; las transferencias pasan a tesorería.',
    tesoreria: 'Confirma pagos contra el extracto y asigna los pagos por identificar.',
    sede: 'Decide las alertas de 3 cuotas y aprueba acuerdos de su sede.',
    gerencia: 'Ve todo, aprueba descuentos y configura las reglas del dinero.',
  };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10, padding: '10px 14px', marginBottom: 18 }}>
      <label htmlFor="ver-como" style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Ver como</label>
      <select id="ver-como" value={persona.id} onChange={e => onCambiar(e.target.value)} style={{ ...estiloInput, width: 'auto', minWidth: 240 }}>
        {PERSONAS.map(p => <option key={p.id} value={p.id}>{p.nombre} · {p.cargo}</option>)}
      </select>
      <span style={{ fontSize: 13, color: C.muted }}>{puede[persona.rol]} Esta persona {alcance}.</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SECCIÓN: INICIO
// ─────────────────────────────────────────────────────────────────────────

function plural(n: number, uno: string, varios: string): string { return `${n} ${n === 1 ? uno : varios}`; }

function SeccionInicio({ kpis, barras, onIrA }: {
  kpis: { programadoSep: number; recaudadoSep: number; valorVencidoTotal: number; clientesEnMora: number; clientesAlerta3: number; reportesPendientes: number; sinIdentificar: number; cumplimientoSep: number };
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
        <TarjetaKpi icono={TrendingUp} titulo="Recaudado en septiembre" valor={money(kpis.recaudadoSep)} sub={`${pctRecaudo}% de recaudo total · ${Math.round(kpis.cumplimientoSep * 100)}% de cumplimiento`} tono="green" />
        <TarjetaKpi icono={AlertTriangle} titulo="Vencido, con mora" valor={money(kpis.valorVencidoTotal)} sub={`${plural(kpis.clientesEnMora, 'cliente', 'clientes')} · ver morosos`} tono="red" onClick={() => onIrA('morosos')} />
        <TarjetaKpi icono={ClipboardCheck} titulo="Pagos por verificar" valor={String(kpis.reportesPendientes)} sub={`+ ${plural(kpis.sinIdentificar, 'por identificar', 'por identificar')} · ver`} tono="amber" onClick={() => onIrA('por-verificar')} />
      </div>
      <p style={{ fontSize: 12, color: C.muted, margin: '-8px 0 0' }}>Programado y recaudado son del grupo completo; la demo trae 12 clientes de muestra y cada pago que registres suma al recaudo. Recaudo total = recaudado ÷ programado; cumplimiento = de las cuotas que vencían en el mes, cuánto se pagó.</p>
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
// SECCIÓN: CLIENTES Y CONTRATOS (alta de venta desde la promesa, F1 del PRD)
// ─────────────────────────────────────────────────────────────────────────

function SeccionVentas({ clientes, resumenes, persona, reglas, onCrear, onVer }: {
  clientes: Cliente[]; resumenes: Map<string, { cuotas: CuotaEstado[]; resumen: ResumenCliente }>; persona: Persona; reglas: Reglas;
  onCrear: (raw: ClienteRaw) => void; onVer: (id: string) => void;
}) {
  const proyectos = PROYECTOS.filter(p => !persona.sede || p.sede === persona.sede);
  const [abierto, setAbierto] = useState(false);
  const [proyectoId, setProyectoId] = useState(proyectos[0].id);
  const proyecto = proyectoPorId(proyectoId);
  const esCucuta = proyecto.sede === 'Cúcuta';
  const [nombre, setNombre] = useState('');
  const [tipoId, setTipoId] = useState('CC');
  const [cedula, setCedula] = useState('');
  const [telefono, setTelefono] = useState('+57 ');
  const [inmueble, setInmueble] = useState('');
  const [valorTexto, setValorTexto] = useState('');
  const [separacionTexto, setSeparacionTexto] = useState('');
  const [plazo, setPlazo] = useState(40);
  const [cuotaFijaTexto, setCuotaFijaTexto] = useState('500000');
  const [diaCorte, setDiaCorte] = useState(5);
  const [primera, setPrimera] = useState(sumarMeses(HOY, 1, 5));
  const [referidoDeId, setReferidoDeId] = useState('');
  const [soloMizar, setSoloMizar] = useState(false);
  const [autoriza, setAutoriza] = useState(true);

  const num = (t: string) => Number(t.replace(/\D/g, '')) || 0;
  const valor = num(valorTexto), separacion = num(separacionTexto), cuotaFija = num(cuotaFijaTexto);
  const plan = useMemo(() => {
    if (valor <= separacion || plazo < 1) return [];
    return generarPlan(valor, separacion, plazo, sumarMeses(primera, 0, diaCorte), diaCorte, !esCucuta, esCucuta ? cuotaFija || undefined : undefined);
  }, [valor, separacion, plazo, primera, diaCorte, esCucuta, cuotaFija]);
  const capitalPlan = plan.reduce((s, c) => s + c.capitalProg, 0);
  const interesPlan = plan.reduce((s, c) => s + c.interesProg, 0);
  const cuadra = plan.length > 0 && Math.abs(capitalPlan - (valor - separacion)) < 1;
  const ultimaNegativa = plan.length > 0 && plan[plan.length - 1].capitalProg <= 0;
  const conSocios = sociosVigentes(proyecto, HOY).length > 1;
  const puedeCrear = nombre.trim().length > 3 && cedula.trim().length >= 6 && inmueble.trim().length > 0 && cuadra && !ultimaNegativa;
  const muestra = plan.length > 4 ? [...plan.slice(0, 3), plan[plan.length - 1]] : plan;

  function crear() {
    const seq = clientes.filter(c => c.raw.proyectoId === proyectoId).length + 20;
    onCrear({
      id: `nuevo-${Date.now()}`, nombre: nombre.trim(), cedula: cedula.trim(), telefono: telefono.trim(), proyectoId, inmueble: inmueble.trim(),
      valorVenta: valor, cuotaInicial: separacion, plazoMeses: plazo, primeraCuota: sumarMeses(primera, 0, diaCorte), diaCorte, cuotasCompletas: 0,
      cuotaFijaCucuta: esCucuta ? cuotaFija : undefined, referidoDeId: referidoDeId || undefined, soloMizar: conSocios && soloMizar,
      numeroContrato: `${proyecto.prefijo}-${String(seq).padStart(3, '0')}-${HOY.slice(0, 4)}`, autorizaWhatsapp: autoriza, fechaPromesa: HOY,
    });
    setAbierto(false); setNombre(''); setCedula(''); setInmueble(''); setValorTexto(''); setSeparacionTexto(''); setReferidoDeId(''); setSoloMizar(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Clientes y contratos</h1>
        {!abierto && <BotonPrimario onClick={() => setAbierto(true)}><UserPlus size={16} />Nueva venta</BotonPrimario>}
      </div>

      {abierto && (
        <Tarjeta>
          <p style={{ fontSize: 16, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}>Nueva venta desde la promesa de compraventa</p>
          <p style={{ fontSize: 13, color: C.muted, margin: '0 0 16px' }}>La venta entra una sola vez: de aquí salen el estado de cuenta, la mora, los recordatorios y el informe a socios.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 16 }}>
            <Campo id="v-proyecto" label="Proyecto">
              <select id="v-proyecto" value={proyectoId} onChange={e => { const p = proyectoPorId(e.target.value); setProyectoId(p.id); setPlazo(p.sede === 'Cúcuta' ? 40 : 48); }} style={estiloInput}>
                {proyectos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </Campo>
            <Campo id="v-nombre" label="Nombre del comprador"><input id="v-nombre" value={nombre} onChange={e => setNombre(e.target.value)} style={estiloInput} placeholder="Nombres y apellidos" /></Campo>
            <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 8 }}>
              <Campo id="v-tipo" label="Tipo">
                <select id="v-tipo" value={tipoId} onChange={e => setTipoId(e.target.value)} style={estiloInput}><option>CC</option><option>CE</option><option>Pasaporte</option><option>NIT</option></select>
              </Campo>
              <Campo id="v-cedula" label="Número"><input id="v-cedula" inputMode="numeric" value={cedula} onChange={e => setCedula(e.target.value)} style={estiloInput} /></Campo>
            </div>
            <Campo id="v-telefono" label="WhatsApp (con indicativo)" ayuda="Muchos clientes viven fuera: guarda el indicativo del país.">
              <input id="v-telefono" value={telefono} onChange={e => setTelefono(e.target.value)} style={estiloInput} />
            </Campo>
            <Campo id="v-inmueble" label="Inmueble"><input id="v-inmueble" value={inmueble} onChange={e => setInmueble(e.target.value)} style={estiloInput} placeholder={esCucuta ? 'Ej. Lote M3-11' : 'Ej. Apto T4-101'} /></Campo>
            <Campo id="v-valor" label="Valor de venta"><input id="v-valor" inputMode="numeric" value={valor ? valor.toLocaleString('es-CO') : ''} onChange={e => setValorTexto(e.target.value)} style={estiloInput} placeholder="$ 0" /></Campo>
            <Campo id="v-separacion" label={esCucuta ? 'Separación' : 'Cuota inicial'}><input id="v-separacion" inputMode="numeric" value={separacion ? separacion.toLocaleString('es-CO') : ''} onChange={e => setSeparacionTexto(e.target.value)} style={estiloInput} placeholder="$ 0" /></Campo>
            <Campo id="v-plazo" label="Plazo (cuotas)"><input id="v-plazo" type="number" min={1} max={120} value={plazo} onChange={e => setPlazo(Math.max(1, Math.min(120, Number(e.target.value) || 1)))} style={estiloInput} /></Campo>
            {esCucuta && (
              <Campo id="v-cuota" label="Valor de la cuota fija" ayuda="La última cuota se ajusta para cuadrar el valor.">
                <input id="v-cuota" inputMode="numeric" value={cuotaFija ? cuotaFija.toLocaleString('es-CO') : ''} onChange={e => setCuotaFijaTexto(e.target.value)} style={estiloInput} />
              </Campo>
            )}
            <Campo id="v-corte" label="Fecha de corte">
              <select id="v-corte" value={diaCorte} onChange={e => setDiaCorte(Number(e.target.value))} style={estiloInput}>
                <option value={5}>El 5 de cada mes</option><option value={15}>El 15 de cada mes</option><option value={30}>El 30 de cada mes</option><option value={31}>El último día del mes</option>
              </select>
            </Campo>
            <Campo id="v-primera" label="Mes de la primera cuota"><input id="v-primera" type="date" min={HOY} value={primera} onChange={e => setPrimera(e.target.value || primera)} style={estiloInput} /></Campo>
            <Campo id="v-referido" label="¿Quién lo refirió?" ayuda={esCucuta ? `Bono de ${money(reglas.bonoValor)} cuando pague su 3.ª cuota.` : undefined}>
              <select id="v-referido" value={referidoDeId} onChange={e => setReferidoDeId(e.target.value)} style={estiloInput}>
                <option value="">Nadie</option>
                {clientes.map(c => <option key={c.raw.id} value={c.raw.id}>{c.raw.nombre}</option>)}
              </select>
            </Campo>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            {conSocios && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', minHeight: 36 }}>
                <input type="checkbox" checked={soloMizar} onChange={e => setSoloMizar(e.target.checked)} /> Este cliente es solo de Mizar (no entra al reparto de la sociedad)
              </label>
            )}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', minHeight: 36 }}>
              <input type="checkbox" checked={autoriza} onChange={e => setAutoriza(e.target.checked)} /> Autorizó el tratamiento de datos y los recordatorios por WhatsApp
            </label>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, margin: '0 0 6px' }}>
              Plan de pagos · {esCucuta ? 'cuota fija sin interés, según el contrato MF' : 'cuota fija con 1 % mensual de financiación (tomado de la promesa, ejemplo)'}
            </p>
            {plan.length === 0 ? (
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Escribe el valor, la separación y el plazo para ver el plan.</p>
            ) : (
              <>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 420 }}>
                    <thead><tr style={{ textAlign: 'left', color: C.muted }}><th style={{ padding: '6px' }}>Nº</th><th style={{ padding: '6px' }}>Vence</th><th style={{ padding: '6px' }}>Capital</th><th style={{ padding: '6px' }}>Interés</th><th style={{ padding: '6px' }}>Cuota</th></tr></thead>
                    <tbody>
                      {muestra.map((c, i) => (
                        <React.Fragment key={c.numero}>
                          {i === 3 && plan.length > 4 && <tr><td colSpan={5} style={{ padding: '4px 6px', color: C.muted }}>… {plan.length - 4} cuotas más …</td></tr>}
                          <tr style={{ borderTop: `1px solid ${C.line}` }}>
                            <td style={{ padding: '6px' }}>{c.numero}</td><td style={{ padding: '6px' }}>{fechaLarga(c.vence)}</td>
                            <td style={{ padding: '6px', fontVariantNumeric: 'tabular-nums' }}>{money(c.capitalProg)}</td>
                            <td style={{ padding: '6px', fontVariantNumeric: 'tabular-nums' }}>{money(c.interesProg)}</td>
                            <td style={{ padding: '6px', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{money(c.capitalProg + c.interesProg)}</td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ fontSize: 13, margin: '8px 0 0', color: cuadra && !ultimaNegativa ? C.green : C.red, fontWeight: 600 }}>
                  {ultimaNegativa ? 'La cuota fija es muy alta para este plazo: baja la cuota o el plazo.'
                    : cuadra ? `✓ Cuadra: ${money(separacion)} de ${esCucuta ? 'separación' : 'cuota inicial'} + ${money(capitalPlan)} de capital = ${money(valor)}${interesPlan > 0 ? ` · intereses de financiación ${money(interesPlan)}` : ''}.`
                      : 'El capital del plan no cuadra con el valor de venta.'}
                </p>
              </>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <BotonSecundario onClick={() => setAbierto(false)}>Cancelar</BotonSecundario>
            <BotonPrimario disabled={!puedeCrear} onClick={crear}>Crear contrato</BotonPrimario>
          </div>
        </Tarjeta>
      )}

      <Tarjeta>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 760 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                <th style={{ padding: '8px 6px' }}>Contrato</th><th style={{ padding: '8px 6px' }}>Cliente</th><th style={{ padding: '8px 6px' }}>Proyecto · inmueble</th>
                <th style={{ padding: '8px 6px' }}>Valor</th><th style={{ padding: '8px 6px' }}>Plan</th><th style={{ padding: '8px 6px' }}>Estado</th><th style={{ padding: '8px 6px' }} />
              </tr>
            </thead>
            <tbody>
              {clientes.map(c => {
                const p = proyectoPorId(c.raw.proyectoId);
                const r = resumenes.get(c.raw.id)?.resumen;
                return (
                  <tr key={c.raw.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                    <td style={{ padding: '8px 6px', fontWeight: 600 }}>{c.raw.numeroContrato}</td>
                    <td style={{ padding: '8px 6px' }}>{c.raw.nombre}{c.raw.soloMizar && <span style={{ marginLeft: 6 }}><Chip tono="purple" texto="Solo Mizar" /></span>}</td>
                    <td style={{ padding: '8px 6px' }}>{p.nombre} · {c.raw.inmueble}</td>
                    <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{money(c.raw.valorVenta)}</td>
                    <td style={{ padding: '8px 6px' }}>{c.raw.plazoMeses} cuotas{c.acuerdo ? ' · con acuerdo' : ''}</td>
                    <td style={{ padding: '8px 6px' }}>
                      {c.estado === 'recuperado' ? <Chip tono="muted" texto="Lote recuperado" /> : r && <Chip tono={chipDeEstadoGeneral(r.estadoGeneral)} texto={textoEstadoGeneral(r.estadoGeneral, reglas)} />}
                    </td>
                    <td style={{ padding: '8px 6px' }}><BotonSecundario onClick={() => onVer(c.raw.id)}>Ver estado de cuenta</BotonSecundario></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Tarjeta>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SECCIÓN: ESTADO DE CUENTA
// ─────────────────────────────────────────────────────────────────────────

const MOTIVOS_ANULACION = ['Valor digitado mal', 'Pago registrado dos veces', 'Pago del cliente equivocado', 'El banco lo rechazó'];

function SeccionEstadoCuenta({ clientes, resumenes, busqueda, setBusqueda, clienteId, setClienteId, reglas, persona, onAbrirModal, onToast, onAnular, onVerRecibo, onVerPDF }: {
  clientes: Cliente[]; resumenes: Map<string, { cuotas: CuotaEstado[]; resumen: ResumenCliente }>;
  busqueda: string; setBusqueda: (s: string) => void; clienteId: string; setClienteId: (id: string) => void;
  reglas: Reglas; persona: Persona;
  onAbrirModal: () => void; onToast: (m: string) => void; onAnular: (clienteId: string, motivo: string) => void;
  onVerRecibo: (pago: Pago) => void; onVerPDF: (fecha: string, cuotas: CuotaEstado[], resumen: ResumenCliente) => void;
}) {
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const [fechaCorte, setFechaCorte] = useState(HOY);
  const [anulando, setAnulando] = useState(false);
  const resultados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return [];
    return clientes.filter(c => c.raw.nombre.toLowerCase().includes(q) || c.raw.cedula.includes(q)
      || (c.raw.numeroContrato ?? '').toLowerCase().includes(q) || c.raw.inmueble.toLowerCase().includes(q)).slice(0, 8);
  }, [busqueda, clientes]);

  const cliente = clientePorIdEn(clientes, clienteId);
  const proyecto = cliente ? proyectoPorId(cliente.raw.proyectoId) : null;
  const datosHoy = resumenes.get(clienteId);
  const datos = useMemo(() => {
    if (!cliente || !proyecto || !datosHoy) return undefined;
    if (fechaCorte === HOY) return datosHoy;
    const cuotas = construirCuotasEstado(cliente.plan, cliente.pagos, proyecto.conMora, reglas, fechaCorte);
    return { cuotas, resumen: resumenCliente(cuotas, cliente.pagos, proyecto, reglas, fechaCorte) };
  }, [cliente, proyecto, datosHoy, fechaCorte, reglas]);
  const referidos = cliente ? clientes.filter(c => c.raw.referidoDeId === cliente.raw.id) : [];
  const referidoPor = cliente?.raw.referidoDeId ? clientePorIdEn(clientes, cliente.raw.referidoDeId) : undefined;
  const puedeAnular = persona.rol !== 'cartera';
  const activos = cliente ? vigentes(cliente.pagos) : [];
  const ultimo = activos.length ? activos[activos.length - 1] : undefined;
  const ultimoAnulable = ultimo && !ultimo.administracionAnterior && !(cliente?.acuerdo && cliente.acuerdo.fecha >= ultimo.fecha) ? ultimo : undefined;

  const filas = useMemo(() => {
    if (!datos) return [];
    if (mostrarTodas) return datos.cuotas;
    const vencidas = datos.cuotas.filter(c => c.estado === 'vencida' || c.estado === 'parcial' || c.estado === 'reestructurada');
    const pendientes = datos.cuotas.filter(c => c.estado === 'pendiente').slice(0, 6);
    return [...vencidas, ...pendientes];
  }, [datos, mostrarTodas]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Estado de cuenta</h1>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: 480 }}>
          <label htmlFor="buscador-cliente" style={{ fontSize: 13, fontWeight: 600, color: C.ink, display: 'block', marginBottom: 6 }}>Cédula, nombre, contrato o inmueble</label>
          <div style={{ position: 'relative' }}>
            <Search size={18} color={C.muted} style={{ position: 'absolute', left: 12, top: 13 }} />
            <input id="buscador-cliente" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Ej. 63456789, Diana o MF-011"
              style={{ width: '100%', border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: '12px 12px 12px 40px', fontSize: 15 }} />
          </div>
          {resultados.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: C.paper, border: `1px solid ${C.line}`, borderRadius: 8, marginTop: 4, boxShadow: '0 8px 20px rgba(20,30,50,.12)', zIndex: 20, maxHeight: 260, overflowY: 'auto' }}>
              {resultados.map(c => (
                <button key={c.raw.id} type="button" onClick={() => { setClienteId(c.raw.id); setBusqueda(''); setMostrarTodas(false); setFechaCorte(HOY); }}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', minHeight: 40 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{c.raw.nombre}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>CC {c.raw.cedula} · {c.raw.numeroContrato} · {proyectoPorId(c.raw.proyectoId).nombre}</div>
                </button>
              ))}
            </div>
          )}
        </div>
        <Campo id="fecha-corte" label="Estado a la fecha">
          <input id="fecha-corte" type="date" max={HOY} value={fechaCorte} onChange={e => setFechaCorte(e.target.value || HOY)} style={{ ...estiloInput, width: 180 }} />
        </Campo>
      </div>
      {fechaCorte !== HOY && <p style={{ fontSize: 13, color: C.blue, margin: '-8px 0 0' }}>Estás viendo el estado de cuenta tal como estaba el {fechaLarga(fechaCorte)}: sirve para resolver reclamos.</p>}

      {!cliente && <p style={{ fontSize: 14, color: C.muted }}>Busca un cliente de tu sede para ver su estado de cuenta.</p>}

      {cliente && proyecto && datos && (
        <Tarjeta>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: 19, fontWeight: 700, color: C.ink, margin: 0 }}>{cliente.raw.nombre}</h2>
                {cliente.estado === 'recuperado'
                  ? <Chip tono="muted" texto="LOTE RECUPERADO" />
                  : <Chip tono={chipDeEstadoGeneral(datos.resumen.estadoGeneral)} texto={textoEstadoGeneral(datos.resumen.estadoGeneral, reglas)} />}
                {cliente.raw.soloMizar && <Chip tono="purple" texto="Solo Mizar" />}
              </div>
              <p style={{ fontSize: 13, color: C.muted, margin: '4px 0 0' }}>
                CC {cliente.raw.cedula} · {cliente.raw.telefono} · Contrato {cliente.raw.numeroContrato} · {proyecto.nombre} · {cliente.raw.inmueble}
              </p>
              <p style={{ fontSize: 13, color: C.muted, margin: '4px 0 0' }}>
                Valor {money(cliente.raw.valorVenta)} · {cliente.raw.plazoMeses} cuotas · corte el {cliente.raw.diaCorte === 31 ? 'último día' : cliente.raw.diaCorte} de cada mes · acreedor {proyecto.sociedad}
                {proyecto.conMora ? ` · mora ${Math.min(reglas.tasaEA, reglas.usuraEA)} % EA sobre capital` : ' · sin interés de mora'}
              </p>
              {referidoPor && <p style={{ fontSize: 13, color: C.purple, margin: '4px 0 0' }}>Referido por {referidoPor.raw.nombre} ({proyectoPorId(referidoPor.raw.proyectoId).nombre})</p>}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {cliente.estado !== 'recuperado' && <BotonPrimario onClick={onAbrirModal}>Registrar pago</BotonPrimario>}
              <BotonSecundario onClick={() => onVerPDF(fechaCorte, datos.cuotas, datos.resumen)}><FileText size={15} />Ver PDF</BotonSecundario>
              <BotonSecundario onClick={() => onToast(cliente.raw.autorizaWhatsapp ? `En la plataforma real esto lo envía por WhatsApp al ${cliente.raw.telefono}` : 'Este cliente no autorizó WhatsApp: se envía por correo.')}><Send size={15} />Enviar</BotonSecundario>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
            <EstadisticaMini titulo="Pagado" valor={money(datos.resumen.totalPagado)} />
            <EstadisticaMini titulo="Saldo de capital" valor={money(datos.resumen.saldoCapital)} />
            <EstadisticaMini titulo="Vencido" valor={money(datos.resumen.valorVencido)} tono={datos.resumen.valorVencido > 0 ? C.red : C.ink} />
            <EstadisticaMini titulo="Mora a la fecha" valor={money(datos.resumen.moraAHoy)} tono={datos.resumen.moraAHoy > 0 ? C.red : C.ink} />
            <EstadisticaMini titulo="Próximo pago" valor={datos.resumen.proximaCuota ? money(datos.resumen.proximaCuota.capitalProg + datos.resumen.proximaCuota.interesProg) : '—'} />
          </div>

          {cliente.estado === 'recuperado' && (
            <div style={{ background: C.surfaceStrong, border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: C.ink }}>
              <strong>Lote recuperado:</strong> la devolución se paga con una orden de pago en Compras y el inmueble quedó disponible para la venta, con este historial guardado.
            </div>
          )}
          {cliente.acuerdo && (
            <div style={{ background: C.purpleSoft, border: `1px solid ${C.purple}`, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: C.purple }}>
              <strong>Acuerdo de pago del {fechaLarga(cliente.acuerdo.fecha)}:</strong> {cliente.acuerdo.cuotas} cuotas de {money(cliente.acuerdo.valorCuota)} (A1…A{cliente.acuerdo.cuotas}) sobre {money(cliente.acuerdo.consolidado)} vencidos · descuento de mora {money(cliente.acuerdo.descuentoMora)} · aprobó {cliente.acuerdo.autorizadoPor}. Versión 2 del plan.
            </div>
          )}
          {referidos.map(ref => {
            const cuotasRef = resumenes.get(ref.raw.id)?.cuotas ?? [];
            const b = estadoBono(ref, cuotasRef);
            const tono = b.estado === 'causado' ? C.green : b.estado === 'anulado' ? C.red : C.purple;
            return (
              <div key={ref.raw.id} style={{ background: C.purpleSoft, border: `1px solid ${tono}`, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: tono }}>
                <Gift size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                <strong>Bono por referido de {money(reglas.bonoValor)}:</strong> por referir a {ref.raw.nombre}.{' '}
                {b.estado === 'causado' ? 'Ya se causó: pasa a aprobación y se paga con una orden de pago.' : b.estado === 'anulado' ? 'Anulado: el referido se atrasó antes de su 3.ª cuota.' : `Se libera cuando pague su 3.ª cuota; lleva ${b.pagadas}.`}
              </div>
            );
          })}
          {cliente.raw.administracionAnteriorHasta && <BloqueAdminAnterior cliente={cliente} />}

          <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '20px 0 10px' }}>Plan de cuotas</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 600 }}>
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
                  const noHabil = !esDiaHabil(c.vence);
                  return (
                    <tr key={c.numero} style={{ borderBottom: `1px solid ${C.line}`, color: c.estado === 'reestructurada' ? C.muted : C.ink }}>
                      <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums', fontWeight: c.etiqueta ? 700 : 400 }}>{c.etiqueta ?? c.numero}</td>
                      <td style={{ padding: '8px 6px' }}>{fechaLarga(c.vence)}{noHabil && <span title="Cae en domingo o festivo: se paga sin mora el siguiente día hábil" style={{ color: C.blue }}> · pasa al {fechaLarga(siguienteHabil(c.vence))}</span>}</td>
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

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', margin: '20px 0 10px' }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: 0 }}>Historial de pagos</p>
            {puedeAnular && ultimoAnulable && fechaCorte === HOY && (
              anulando ? (
                <select autoFocus defaultValue="" onChange={e => { if (e.target.value) { onAnular(cliente.raw.id, e.target.value); setAnulando(false); } }} style={{ ...estiloInput, width: 'auto' }} aria-label="Motivo de la anulación">
                  <option value="" disabled>Motivo para anular {ultimoAnulable.recibo}…</option>
                  {MOTIVOS_ANULACION.map(m => <option key={m}>{m}</option>)}
                </select>
              ) : (
                <BotonSecundario onClick={() => setAnulando(true)}><Undo2 size={15} />Anular el último pago</BotonSecundario>
              )
            )}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 680 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                  <th style={{ padding: '8px 6px' }}>Recibo</th><th style={{ padding: '8px 6px' }}>Fecha</th><th style={{ padding: '8px 6px' }}>Valor</th>
                  <th style={{ padding: '8px 6px' }}>Aplicado a</th><th style={{ padding: '8px 6px' }}>Medio</th><th style={{ padding: '8px 6px' }}>Cuenta</th><th style={{ padding: '8px 6px' }}>Soporte</th>
                </tr>
              </thead>
              <tbody>
                {[...cliente.pagos].reverse().filter(p => p.fecha <= fechaCorte).map((p, i) => (
                  <tr key={`${p.recibo}-${i}`} style={{ borderBottom: `1px solid ${C.line}`, textDecoration: p.anulado ? 'line-through' : 'none', color: p.anulado ? C.muted : C.ink }}>
                    <td style={{ padding: '8px 6px', fontWeight: 600 }}>
                      {p.administracionAnterior ? p.recibo : (
                        <button type="button" onClick={() => onVerRecibo(p)} style={{ background: 'none', border: 'none', color: C.blue, fontWeight: 700, cursor: 'pointer', padding: 0, fontFamily: 'inherit', fontSize: 13, textDecoration: 'inherit' }}>{p.recibo}</button>
                      )}
                    </td>
                    <td style={{ padding: '8px 6px' }}>{fechaLarga(p.fecha)}</td>
                    <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{money(p.valor)}</td>
                    <td style={{ padding: '8px 6px', color: C.muted }}>{p.anulado ? `Anulado: ${p.anulado.motivo} (${p.anulado.por})` : aplicadoATexto(p)}</td>
                    <td style={{ padding: '8px 6px' }}>{p.medio}</td>
                    <td style={{ padding: '8px 6px' }}>{p.cuenta}</td>
                    <td style={{ padding: '8px 6px' }}>{p.soporte ? <Paperclip size={15} color={C.muted} aria-label="Con soporte" /> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {puedeAnular && <p style={{ fontSize: 12, color: C.muted, margin: '8px 0 0' }}>Un pago nunca se borra: se anula con motivo y el contrato se recalcula. En la demo se puede anular el último; en la plataforma, cualquiera.</p>}
        </Tarjeta>
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
      <strong>Administración anterior (antes del 5-jun-2025):</strong> {money(total)} en {pagosAnteriores.length} pagos. Cuentan para el saldo del cliente, pero no son recaudo de la administración actual ni entran al informe a socios.
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SECCIÓN: PAGOS POR VERIFICAR (bandeja de tesorería, F6 del PRD)
// ─────────────────────────────────────────────────────────────────────────

function SeccionPorVerificar({ clientes, reportes, pagosSinIdentificar, persona, onConfirmarReporte, onRechazarReporte, onAsignarSinIdentificar, onReporteCliente }: {
  clientes: Cliente[]; reportes: ReporteWhatsApp[]; pagosSinIdentificar: PagoSinIdentificar[]; persona: Persona;
  onConfirmarReporte: (r: ReporteWhatsApp) => void; onRechazarReporte: (id: string, motivo: string) => void;
  onAsignarSinIdentificar: (item: PagoSinIdentificar, clienteId: string) => void;
  onReporteCliente: (d: { clienteId: string; valor: number; fecha: string; cuenta: string; referencia: string }) => void;
}) {
  const puedeConfirmar = persona.rol !== 'cartera';
  const pendientes = reportes.filter(r => r.estado === 'pendiente');
  const resueltos = reportes.filter(r => r.estado !== 'pendiente');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Pagos por verificar</h1>
      <p style={{ fontSize: 14, color: C.muted, margin: 0, maxWidth: 680 }}>
        Llegan los pagos que el cliente reporta por WhatsApp y las transferencias que cartera registró en la oficina. Tesorería los confirma contra el extracto: ningún reporte se aplica solo.
      </p>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pendientes.length === 0 && <p style={{ fontSize: 13, color: C.muted }}>No hay pagos esperando verificación.</p>}
          {[...pendientes, ...resueltos].map(r => {
            const cliente = clientePorIdEn(clientes, r.clienteId);
            if (!cliente) return null;
            return <TarjetaReporte key={r.id} reporte={r} cliente={cliente} puedeConfirmar={puedeConfirmar} onConfirmar={() => onConfirmarReporte(r)} onRechazar={motivo => onRechazarReporte(r.id, motivo)} />;
          })}
        </div>
        <TelefonoFlow clientes={clientes} onEnviar={onReporteCliente} />
      </div>

      <div>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: C.ink, margin: '10px 0 4px' }}>Pagos por identificar</h2>
        <p style={{ fontSize: 13, color: C.muted, margin: '0 0 12px' }}>Consignaciones que llegaron al banco sin cliente. Al asignarlas se aplican con la fecha en que el cliente pagó, así no le cobran mora por la demora en identificarlas.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pagosSinIdentificar.map(item => (
            <FilaSinIdentificar key={item.id} item={item} clientes={clientes} puedeAsignar={puedeConfirmar} onAsignar={clienteId => onAsignarSinIdentificar(item, clienteId)} />
          ))}
          {pagosSinIdentificar.length === 0 && <p style={{ fontSize: 13, color: C.muted }}>No hay pagos pendientes por identificar.</p>}
        </div>
      </div>
    </div>
  );
}

function TarjetaReporte({ reporte, cliente, puedeConfirmar, onConfirmar, onRechazar }: { reporte: ReporteWhatsApp; cliente: Cliente; puedeConfirmar: boolean; onConfirmar: () => void; onRechazar: (motivo: string) => void }) {
  const [mostrarMotivo, setMostrarMotivo] = useState(false);
  const yaResuelto = reporte.estado !== 'pendiente';
  const bloqueado = reporte.alerta?.tipo === 'referencia-repetida';
  return (
    <Tarjeta style={{ padding: 16, opacity: yaResuelto ? 0.75 : 1 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <MiniaturaComprobante />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: C.ink, margin: 0 }}>{cliente.raw.nombre}</p>
            <span style={{ fontSize: 12, color: C.muted }}>{fechaLarga(reporte.fecha)} · {reporte.hora}</span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '6px 0' }}>
            <Chip tono={reporte.origen === 'whatsapp' ? 'green' : 'blue'} texto={reporte.origen === 'whatsapp' ? 'Reportado por WhatsApp' : `Oficina · lo registró ${reporte.registradoPor}`} />
          </div>
          <p style={{ fontSize: 13, color: C.muted, margin: '4px 0' }}>{money(reporte.valor)} · {reporte.medio} a {reporte.cuenta} · Ref. {reporte.referencia}</p>
          {reporte.alerta && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: bloqueado ? C.red : C.amber, marginBottom: 8 }}>
              <AlertTriangle size={14} /> {reporte.alerta.mensaje}{bloqueado ? ' · bloqueado' : ''}
            </div>
          )}
          {yaResuelto ? (
            <Chip tono={reporte.estado === 'confirmado' ? 'green' : 'muted'} texto={reporte.estado === 'confirmado' ? `Confirmado · recibo ${reporte.recibo ?? ''} enviado al cliente` : `Rechazado: ${reporte.motivoRechazo}`} />
          ) : !puedeConfirmar ? (
            <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Lo confirma tesorería contra el extracto.</p>
          ) : (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
              <BotonPrimario disabled={bloqueado} onClick={onConfirmar}>Confirmar: está en el extracto</BotonPrimario>
              <BotonSecundario onClick={() => setMostrarMotivo(v => !v)}>Rechazar</BotonSecundario>
              {mostrarMotivo && (
                <select onChange={e => { if (e.target.value) onRechazar(e.target.value); }} defaultValue="" aria-label="Motivo del rechazo"
                  style={{ border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: '0 10px', fontSize: 13, minHeight: 40 }}>
                  <option value="" disabled>Motivo del rechazo...</option>
                  <option>Comprobante ilegible</option>
                  <option>Valor no corresponde</option>
                  <option>Referencia no encontrada en el extracto</option>
                  <option>Referencia repetida</option>
                  <option>Cliente no identificado</option>
                </select>
              )}
            </div>
          )}
        </div>
      </div>
    </Tarjeta>
  );
}

function FilaSinIdentificar({ item, clientes, puedeAsignar, onAsignar }: { item: PagoSinIdentificar; clientes: Cliente[]; puedeAsignar: boolean; onAsignar: (clienteId: string) => void }) {
  const [seleccion, setSeleccion] = useState('');
  return (
    <Tarjeta style={{ padding: 14, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 13, color: C.ink }}>
        <strong>{money(item.valor)}</strong> · {fechaLarga(item.fecha)} · {item.cuenta} ·{' '}
        <span style={{ color: item.diasSinIdentificar > 30 ? C.red : C.amber, fontWeight: 700 }}>{item.diasSinIdentificar} días sin identificar</span>
      </div>
      {puedeAsignar ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select value={seleccion} onChange={e => setSeleccion(e.target.value)} aria-label="Cliente" style={{ border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: '0 10px', fontSize: 13, minHeight: 40 }}>
            <option value="">Selecciona un cliente...</option>
            {clientes.filter(c => c.estado !== 'recuperado').map(c => <option key={c.raw.id} value={c.raw.id}>{c.raw.nombre}</option>)}
          </select>
          <BotonPrimario disabled={!seleccion} onClick={() => onAsignar(seleccion)}>Asignar a cliente</BotonPrimario>
        </div>
      ) : <span style={{ fontSize: 12, color: C.muted }}>Lo asigna tesorería.</span>}
    </Tarjeta>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SECCIÓN: MOROSOS Y COBRANZA (F5 y F9 del PRD)
// ─────────────────────────────────────────────────────────────────────────

interface FilaMoroso {
  cliente: Cliente; proyecto: Proyecto; resumen: ResumenCliente; diasAtraso: number;
  accion: string; accionTono: Tono; segmento: 'buen pagador' | 'atrasado';
}

interface FilaBono { referido: Cliente; referente: Cliente; estado: 'pendiente' | 'causado' | 'anulado'; pagadas: number; }

function SeccionMorosos({ lista, filtroSede, setFiltroSede, persona, reglas, gestiones, decisiones, bonos, bonosAprobados, recordatoriosEnviados, onEnviarRecordatorio,
  onGestion, onAcuerdo, onDecidir, onAprobarBono, recordatorios, setRecordatorios, clienteEjemplo }: {
  lista: FilaMoroso[]; filtroSede: 'Todas' | Sede; setFiltroSede: (s: 'Todas' | Sede) => void;
  persona: Persona; reglas: Reglas;
  gestiones: Map<string, Gestion[]>; decisiones: Map<string, { decision: Decision; motivo: string; por: string }>;
  bonos: FilaBono[]; bonosAprobados: Set<string>;
  recordatoriosEnviados: Set<string>; onEnviarRecordatorio: (id: string) => void;
  onGestion: (id: string) => void; onAcuerdo: (id: string) => void; onDecidir: (id: string) => void; onAprobarBono: (id: string) => void;
  recordatorios: { antes3: boolean; elDia: boolean; despues3: boolean }; setRecordatorios: React.Dispatch<React.SetStateAction<{ antes3: boolean; elDia: boolean; despues3: boolean }>>;
  clienteEjemplo: { nombre: string; valor: number; fecha: string; conMora: boolean } | null;
}) {
  const puedeDecidir = persona.rol === 'sede' || persona.rol === 'gerencia';
  const textoDecision: Record<Decision, string> = { recuperar: 'Recuperar el lote', acuerdo: 'Acuerdo de pago', esperar: 'Dar plazo' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Morosos y cobranza</h1>
      {!persona.sede && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['Todas', 'Bucaramanga', 'Cúcuta'] as const).map(s => (
            <button key={s} type="button" onClick={() => setFiltroSede(s)} style={{
              padding: '8px 14px', borderRadius: 20, border: `1px solid ${filtroSede === s ? C.navy : C.lineStrong}`,
              background: filtroSede === s ? C.navy : C.paper, color: filtroSede === s ? '#fff' : C.ink, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', minHeight: 40, fontFamily: 'inherit',
            }}>{s}</button>
          ))}
        </div>
      )}

      <Tarjeta>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 900 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                <th style={{ padding: '8px 6px' }}>Cliente</th><th style={{ padding: '8px 6px' }}>Proyecto</th>
                <th style={{ padding: '8px 6px' }}>Cuotas vencidas</th><th style={{ padding: '8px 6px' }}>Días</th>
                <th style={{ padding: '8px 6px' }}>Vencido</th><th style={{ padding: '8px 6px' }}>Mora</th>
                <th style={{ padding: '8px 6px' }}>Próxima acción</th><th style={{ padding: '8px 6px' }}>Última gestión</th><th style={{ padding: '8px 6px' }} />
              </tr>
            </thead>
            <tbody>
              {lista.map(item => {
                const id = item.cliente.raw.id;
                const enviado = recordatoriosEnviados.has(id);
                const historial = gestiones.get(id);
                const ultima = historial ? historial[historial.length - 1] : undefined;
                const decision = decisiones.get(id);
                const esAlerta = item.resumen.estadoGeneral === 'ALERTA';
                return (
                  <tr key={id} style={{ borderBottom: `1px solid ${C.line}`, verticalAlign: 'top' }}>
                    <td style={{ padding: '8px 6px', fontWeight: 600 }}>{item.cliente.raw.nombre}<div style={{ fontWeight: 400, fontSize: 12, color: C.muted }}>{item.segmento === 'buen pagador' ? 'Buen pagador: solo mensajes' : 'Atrasado: se le llama'}</div></td>
                    <td style={{ padding: '8px 6px' }}>{item.proyecto.nombre}</td>
                    <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{item.resumen.cuotasVencidas}</td>
                    <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{item.diasAtraso}</td>
                    <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{money(item.resumen.valorVencido)}</td>
                    <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{item.proyecto.conMora ? money(item.resumen.moraAHoy) : 'No aplica'}</td>
                    <td style={{ padding: '8px 6px' }}>
                      <Chip tono={item.accionTono} texto={item.accion} />
                      {decision && <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Decisión: {textoDecision[decision.decision]} ({decision.por}) · {decision.motivo}</div>}
                    </td>
                    <td style={{ padding: '8px 6px', fontSize: 12, color: C.muted }}>
                      {ultima ? <>{ultima.tipo} · {ultima.resultado}{ultima.compromiso && <div style={{ color: C.blue }}>Compromiso: {money(ultima.compromiso.valor)} el {fechaLarga(ultima.compromiso.fecha)}</div>}</> : '—'}
                    </td>
                    <td style={{ padding: '8px 6px' }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {esAlerta && puedeDecidir && !decision && <BotonPrimario onClick={() => onDecidir(id)}>Decidir</BotonPrimario>}
                        {!item.cliente.acuerdo && (item.resumen.cuotasVencidas >= 2 || decision?.decision === 'acuerdo') && (
                          <BotonSecundario onClick={() => onAcuerdo(id)}><Handshake size={15} />Acuerdo</BotonSecundario>
                        )}
                        <BotonSecundario onClick={() => onGestion(id)}><Phone size={15} />Gestión</BotonSecundario>
                        <BotonSecundario disabled={enviado || !item.cliente.raw.autorizaWhatsapp} onClick={() => onEnviarRecordatorio(id)}>
                          {!item.cliente.raw.autorizaWhatsapp ? 'Sin autorización' : enviado ? 'Enviado hoy ✓' : 'Recordatorio'}
                        </BotonSecundario>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {lista.length === 0 && (
                <tr><td colSpan={9} style={{ padding: 16, textAlign: 'center', color: C.muted }}>No hay clientes en mora con este filtro.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 12, color: C.muted, margin: '10px 0 0' }}>
          En Cúcuta, la alerta salta cuando lo vencido equivale a {reglas.alertaCuotas} cuotas: el sistema avisa y una persona decide según el contrato. Exportable a Excel en la plataforma real.
        </p>
      </Tarjeta>

      {bonos.length > 0 && (
        <Tarjeta>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}>Bonos por referido</p>
          <p style={{ fontSize: 13, color: C.muted, margin: '0 0 12px' }}>{money(reglas.bonoValor)} cuando el referido paga sus 3 primeras cuotas; se anula si antes se atrasa dos cuotas o se cae el contrato.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {bonos.map(b => {
              const id = b.referido.raw.id;
              const aprobado = bonosAprobados.has(id);
              return (
                <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap', background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, padding: '10px 12px', fontSize: 13 }}>
                  <span><Gift size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} /><strong>{b.referente.raw.nombre}</strong> refirió a {b.referido.raw.nombre} · lleva {b.pagadas} de 3 cuotas</span>
                  {aprobado ? <Chip tono="green" texto="Aprobado · orden de pago creada en Compras" />
                    : b.estado === 'causado' ? (puedeDecidir ? <BotonPrimario onClick={() => onAprobarBono(id)}>Aprobar bono</BotonPrimario> : <Chip tono="green" texto="Causado · espera aprobación" />)
                      : <Chip tono={b.estado === 'anulado' ? 'red' : 'purple'} texto={b.estado === 'anulado' ? 'Anulado' : 'Pendiente'} />}
                </div>
              );
            })}
          </div>
        </Tarjeta>
      )}

      <Tarjeta>
        <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 12px' }}>Recordatorios automáticos</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          <InterruptorRecordatorio label="3 días antes del corte (todos)" checked={recordatorios.antes3} onChange={v => setRecordatorios(prev => ({ ...prev, antes3: v }))} />
          <InterruptorRecordatorio label="El día del corte (todos)" checked={recordatorios.elDia} onChange={v => setRecordatorios(prev => ({ ...prev, elDia: v }))} />
          <InterruptorRecordatorio label="3 días después si no ha pagado (atrasados: además, llamada asignada)" checked={recordatorios.despues3} onChange={v => setRecordatorios(prev => ({ ...prev, despues3: v }))} />
        </div>
        {clienteEjemplo && (
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, padding: 12, fontSize: 13, color: C.ink }}>
            <p style={{ margin: '0 0 4px', fontWeight: 700 }}>Vista previa del mensaje (plantilla aprobada por Meta)</p>
            <p style={{ margin: 0 }}>
              Hola {clienteEjemplo.nombre.split(' ')[0]}, tu cuota de {money(clienteEjemplo.valor)} venció el {fechaLarga(clienteEjemplo.fecha)}. {clienteEjemplo.conMora ? "Evita intereses de mora pagando hoy." : "Te invitamos a ponerte al día."} Si ya pagaste, repórtalo aquí con el botón «Reportar un pago».
            </p>
          </div>
        )}
        <p style={{ fontSize: 12, color: C.muted, margin: '10px 0 0' }}>
          Salen solo a clientes que autorizaron WhatsApp, de lunes a viernes de 7:00 a 19:00 y sábados de 8:00 a 15:00, nunca domingos ni festivos (Ley 2300 de 2023, a validar con el asesor de Mizar). Al buen pagador nunca se le llama antes del vencimiento.
        </p>
      </Tarjeta>
    </div>
  );
}

function InterruptorRecordatorio({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: disabled ? 'default' : 'pointer', fontSize: 14, color: C.ink, opacity: disabled ? 0.6 : 1 }}>
      {label}
      <span onClick={() => { if (!disabled) onChange(!checked); }} role="switch" aria-checked={checked} aria-disabled={disabled} tabIndex={disabled ? -1 : 0}
        onKeyDown={e => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onChange(!checked); } }}
        style={{ width: 40, height: 22, borderRadius: 12, background: checked ? C.green : C.lineStrong, position: 'relative', display: 'inline-block', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: 2, left: checked ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .15s' }} />
      </span>
    </label>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SECCIÓN: SOCIOS Y FLUJO (F7 y F8 del PRD)
// ─────────────────────────────────────────────────────────────────────────

function SeccionSocios({ tab, setTab, proyectoId, setProyectoId, clientes, resumenes, recaudadoSep, persona, onToast }: {
  tab: 'informe' | 'flujo'; setTab: (t: 'informe' | 'flujo') => void;
  proyectoId: string; setProyectoId: (id: string) => void;
  clientes: Cliente[]; resumenes: Map<string, { cuotas: CuotaEstado[]; resumen: ResumenCliente }>; recaudadoSep: number; persona: Persona;
  onToast: (m: string) => void;
}) {
  const proyectos = PROYECTOS.filter(p => !persona.sede || p.sede === persona.sede);
  const proyecto = proyectoPorId(proyectos.some(p => p.id === proyectoId) ? proyectoId : proyectos[0].id);
  const periodoInicio = '2026-08-15';
  const periodoFin = '2026-09-14';
  const finanzas = FINANZAS_PROYECTO[proyecto.id];
  const vigentesSocios = sociosVigentes(proyecto, periodoFin);
  const clientesProyecto = clientes.filter(c => c.raw.proyectoId === proyecto.id);
  const soloMizarEnPeriodo = clientesProyecto.filter(c => c.raw.soloMizar)
    .reduce((s, c) => s + vigentes(c.pagos).filter(p => p.fecha >= periodoInicio && p.fecha <= periodoFin).reduce((t, p) => t + p.valor, 0), 0);
  const recaudadoSociedad = finanzas.recaudado - soloMizarEnPeriodo;
  const utilidad = recaudadoSociedad - finanzas.gastos - finanzas.comisiones;
  const reparto = repartir(utilidad, vigentesSocios);
  const botonTab = (id: 'informe' | 'flujo', texto: string) => (
    <button type="button" onClick={() => setTab(id)} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${tab === id ? C.navy : C.lineStrong}`, background: tab === id ? C.navy : C.paper, color: tab === id ? '#fff' : C.ink, fontWeight: 600, fontSize: 13, cursor: 'pointer', minHeight: 40, fontFamily: 'inherit' }}>{texto}</button>
  );

  const flujoFilas = useMemo(() => {
    const meses = ['2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12'];
    return meses.map(m => {
      const esSep = m === '2026-09';
      const historico = HISTORICO_MENSUAL[m];
      const programado = historico?.programado ?? (esSep ? PROGRAMADO_SEP_GRUPO : PROGRAMADO_FUTURO[m] ?? 0);
      const recaudado = historico?.recaudado ?? (esSep ? recaudadoSep : null);
      const egresosEjecutados = m <= '2026-09' ? EGRESOS_MENSUAL[m] : null;
      const egresosProgramados = EGRESOS_PROGRAMADOS[m];
      const flujo = (recaudado ?? programado) - (egresosEjecutados ?? egresosProgramados);
      return { mes: m, programado, recaudado, egresosProgramados, egresosEjecutados, flujo, proyectado: recaudado === null, cumplimiento: CUMPLIMIENTO_MENSUAL[m] ?? null };
    });
  }, [recaudadoSep]);
  const cajaProyectada = CAJA_ACTUAL + flujoFilas.filter(f => f.proyectado).reduce((s, f) => s + f.flujo, 0);
  const celda: React.CSSProperties = { padding: '8px 6px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' };
  const recaudadoEnCuenta = (cuenta: string, desde: string) => clientes.reduce((s, c) => s + vigentes(c.pagos).filter(p => p.cuenta === cuenta && p.fecha > desde).reduce((t, p) => t + p.valor, 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Socios y flujo</h1>
      <div style={{ display: 'flex', gap: 8 }}>{botonTab('informe', 'Informe por socio')}{botonTab('flujo', 'Flujo del grupo')}</div>

      {tab === 'informe' ? (
        <Tarjeta>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end', marginBottom: 16 }}>
            <Campo id="select-proyecto-informe" label="Proyecto">
              <select id="select-proyecto-informe" value={proyecto.id} onChange={e => setProyectoId(e.target.value)} style={{ ...estiloInput, width: 'auto' }}>
                {proyectos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </Campo>
            <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Periodo: 15 ago – 14 sep 2026 (el rango es libre; Cantalta usa del 15 al 14)</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 12 }}>
            <EstadisticaMini titulo="Se recogió" valor={money(recaudadoSociedad)} />
            <EstadisticaMini titulo="Se gastó" valor={money(finanzas.gastos)} />
            <EstadisticaMini titulo="Comisiones de venta" valor={money(finanzas.comisiones)} />
            <EstadisticaMini titulo="Queda para repartir" valor={money(utilidad)} tono={C.green} />
          </div>
          <p style={{ fontSize: 12, color: C.muted, margin: '0 0 16px' }}>Los gastos salen solos del módulo de Compras y de la caja (centro de costo del proyecto). Los pagos de la administración anterior no cuentan aquí.</p>

          <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: '0 0 8px' }}>Le corresponde a cada socio</p>
          <div style={{ overflowX: 'auto', marginBottom: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 360 }}>
              <thead><tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}><th style={celda}>Socio</th><th style={celda}>% vigente</th><th style={celda}>Valor</th></tr></thead>
              <tbody>
                {reparto.map(s => (
                  <tr key={s.nombre} style={{ borderBottom: `1px solid ${C.line}` }}><td style={{ ...celda, fontWeight: 600 }}>{s.nombre}</td><td style={celda}>{s.pct}%</td><td style={celda}>{money(s.valor)}</td></tr>
                ))}
                <tr><td style={{ ...celda, fontWeight: 700 }}>Total</td><td style={celda}>100%</td><td style={{ ...celda, fontWeight: 700 }}>{money(reparto.reduce((s, r) => s + r.valor, 0))}</td></tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, color: C.muted, margin: '0 0 12px' }}>El reparto redondea al peso y el peso que sobra va al mayor residuo: las partes siempre suman el total, sin fórmulas escritas a mano.</p>
          {soloMizarEnPeriodo > 0 && (
            <p style={{ fontSize: 13, color: C.purple, marginBottom: 16 }}>No incluye {money(soloMizarEnPeriodo)} de clientes marcados «solo Mizar»: ese dinero va completo a Mizar.</p>
          )}

          <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: '8px 0' }}>Línea de tiempo de participación</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {proyecto.socios.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.navy, marginTop: 6, flexShrink: 0 }} />
                <span style={{ color: C.ink }}>Desde {fechaLarga(s.desde)}{s.hasta ? ` hasta ${fechaLarga(s.hasta)}` : ' (vigente)'}: {s.participantes.map(p => `${p.nombre} ${p.pct}%`).join(', ')}</span>
              </div>
            ))}
          </div>
          {proyecto.socios.length > 1 && (
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>Cada pago y cada gasto se reparte con el porcentaje vigente en su fecha: lo anterior al cambio, entre los socios de ese momento; lo posterior, entre los vigentes.</p>
          )}

          <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: '8px 0' }}>Anexo de ventas del proyecto</p>
          <div style={{ overflowX: 'auto', marginBottom: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 760 }}>
              <thead><tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                <th style={celda}>Inmueble</th><th style={celda}>Cliente</th><th style={celda}>Valor</th><th style={celda}>Pagado antes</th><th style={celda}>Pagado en el periodo</th><th style={celda}>Saldo de capital</th><th style={celda}>Observación</th>
              </tr></thead>
              <tbody>
                {clientesProyecto.map(c => {
                  const pagos = vigentes(c.pagos).filter(p => !p.administracionAnterior);
                  const antes = pagos.filter(p => p.fecha < periodoInicio).reduce((s, p) => s + p.valor, 0);
                  const enPeriodo = pagos.filter(p => p.fecha >= periodoInicio && p.fecha <= periodoFin).reduce((s, p) => s + p.valor, 0);
                  const r = resumenes.get(c.raw.id)?.resumen;
                  return (
                    <tr key={c.raw.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                      <td style={celda}>{c.raw.inmueble}</td><td style={celda}>{c.raw.nombre}{c.raw.soloMizar ? ' · solo Mizar' : ''}</td><td style={celda}>{money(c.raw.valorVenta)}</td>
                      <td style={celda}>{money(antes)}</td><td style={celda}>{money(enPeriodo)}</td><td style={celda}>{r ? money(r.saldoCapital) : '—'}</td>
                      <td style={celda}>{c.estado === 'recuperado' ? 'Lote recuperado' : r?.estadoGeneral === 'AL DÍA' ? 'Pagando al día' : 'En mora'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <BotonSecundario onClick={() => onToast('En la plataforma real esto descarga el informe en PDF y Excel, y lo envía a cada socio')}><Download size={15} />Descargar informe para el socio</BotonSecundario>
        </Tarjeta>
      ) : (
        <>
          <Tarjeta>
            <p style={{ fontSize: 14, color: C.ink, margin: '0 0 4px', fontWeight: 700 }}>Flujo de caja del grupo</p>
            <p style={{ fontSize: 13, color: C.muted, margin: '0 0 16px' }}>Mayo a diciembre de 2026 · consolidado de los proyectos · el programado de cada mes es la foto del día 1</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 820 }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                    <th style={celda} />
                    {flujoFilas.map(f => <th key={f.mes} style={celda}>{MESES_CORTOS[Number(f.mes.slice(5, 7)) - 1]}{f.proyectado ? '*' : ''}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${C.line}` }}><td style={{ ...celda, fontWeight: 600 }}>Ingresos programados</td>{flujoFilas.map(f => <td key={f.mes} style={celda}>{money(f.programado)}</td>)}</tr>
                  <tr style={{ borderBottom: `1px solid ${C.line}` }}><td style={{ ...celda, fontWeight: 600 }}>Recaudado</td>{flujoFilas.map(f => <td key={f.mes} style={celda}>{f.recaudado !== null ? money(f.recaudado) : '—'}</td>)}</tr>
                  <tr style={{ borderBottom: `1px solid ${C.line}` }}><td style={{ ...celda, fontWeight: 600 }}>% recaudo total</td>{flujoFilas.map(f => <td key={f.mes} style={celda}>{f.recaudado !== null ? `${Math.round(f.recaudado / f.programado * 100)}%` : '—'}</td>)}</tr>
                  <tr style={{ borderBottom: `1px solid ${C.line}` }}><td style={{ ...celda, fontWeight: 600 }}>% cumplimiento</td>{flujoFilas.map(f => <td key={f.mes} style={celda}>{f.cumplimiento !== null ? `${Math.round(f.cumplimiento * 100)}%` : '—'}</td>)}</tr>
                  <tr style={{ borderBottom: `1px solid ${C.line}` }}><td style={{ ...celda, fontWeight: 600 }}>Egresos programados</td>{flujoFilas.map(f => <td key={f.mes} style={celda}>{money(f.egresosProgramados)}</td>)}</tr>
                  <tr style={{ borderBottom: `1px solid ${C.line}` }}><td style={{ ...celda, fontWeight: 600 }}>Egresos ejecutados</td>{flujoFilas.map(f => <td key={f.mes} style={celda}>{f.egresosEjecutados !== null ? money(f.egresosEjecutados) : '—'}</td>)}</tr>
                  <tr style={{ background: C.surfaceStrong }}><td style={{ ...celda, fontWeight: 700 }}>Flujo del mes</td>{flujoFilas.map(f => <td key={f.mes} style={{ ...celda, fontWeight: 700, color: f.flujo >= 0 ? C.green : C.red }}>{money(f.flujo)}</td>)}</tr>
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 12, color: C.muted, margin: '8px 0 0' }}>* Proyectado con lo programado. Egresos ejecutados: órdenes de Compras y caja pagadas en el mes. Recaudo total y cumplimiento son medidas distintas: Mizar elige cuál es la oficial.</p>
            <div style={{ background: C.blueSoft, border: `1px solid ${C.blue}`, borderRadius: 8, padding: 14, marginTop: 16 }}>
              <p style={{ fontSize: 13, color: C.blue, margin: '0 0 4px', fontWeight: 700 }}>¿Podemos meternos en otro proyecto?</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: C.blue, margin: 0, fontVariantNumeric: 'tabular-nums' }}>Caja proyectada a diciembre: {money(cajaProyectada)}</p>
              <p style={{ fontSize: 13, color: C.blue, margin: '4px 0 0' }}>Caja hoy {money(CAJA_ACTUAL)} + flujo proyectado de octubre a diciembre.</p>
            </div>
          </Tarjeta>
          <Tarjeta>
            <p style={{ fontSize: 14, color: C.ink, margin: '0 0 12px', fontWeight: 700 }}><Wallet size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />Saldos por cuenta</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              {SALDOS_REPORTADOS.filter(s => !persona.sede || s.sede === persona.sede).map(s => {
                const nuevo = recaudadoEnCuenta(s.cuenta, s.fecha);
                return (
                  <div key={s.cuenta} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, padding: 12, fontSize: 13 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                      <strong>{s.cuenta}</strong>{s.deTercero && <Chip tono="amber" texto="De un tercero" />}
                    </div>
                    <div style={{ color: C.muted }}>Saldo reportado el {fechaLarga(s.fecha)}: {money(s.saldo)}</div>
                    <div style={{ color: C.muted }}>Recaudado por cartera desde entonces: {money(nuevo)}</div>
                    <div style={{ fontWeight: 700, marginTop: 4 }}>Estimado hoy: {money(s.saldo + nuevo)}</div>
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize: 12, color: C.muted, margin: '10px 0 0' }}>El saldo lo registra tesorería; la conciliación completa contra el extracto es una fase siguiente.</p>
          </Tarjeta>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SECCIÓN: CONFIGURACIÓN (reglas del dinero, PRD §8)
// ─────────────────────────────────────────────────────────────────────────

function EtiquetaAbierta() { return <Chip tono="amber" texto="Por definir con el contador" />; }

function SeccionConfiguracion({ reglas, setReglas }: { reglas: Reglas; setReglas: React.Dispatch<React.SetStateAction<Reglas>> }) {
  const superaUsura = reglas.tasaEA > reglas.usuraEA;
  const td = tasaDiariaAplicada(reglas);
  // Caso de Claudia (min 23:58): cuota de $3.000.000, paga $2.000.000 a tiempo y el resto 31 días después.
  const ejemploMora = moraDevengada(3000000, '2026-10-05', [{ fecha: '2026-10-05', aplicado: 2000000 }], '2026-11-05', reglas);
  const set = <K extends keyof Reglas>(k: K, v: Reglas[K]) => setReglas(prev => ({ ...prev, [k]: v }));
  const proximosFestivos = [...FESTIVOS].filter(f => f >= HOY).slice(0, 4);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Configuración de cartera</h1>
      <p style={{ fontSize: 14, color: C.muted, margin: 0, maxWidth: 720 }}>Las reglas de cada sede son configuración, no dos sistemas. Los valores de esta demo son ejemplos: la tasa y las demás reglas las fija Mizar con su contador, y cada cambio rige desde su fecha y queda registrado.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        <Tarjeta>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Building2 size={18} color={C.navy} /> <p style={{ fontSize: 16, fontWeight: 700, color: C.ink, margin: 0 }}>Bucaramanga</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Campo id="tasa-mora" label="Mora (% efectivo anual)">
                <input id="tasa-mora" type="number" min={0} step={0.1} value={reglas.tasaEA} onChange={e => set('tasaEA', Number(e.target.value) || 0)} style={{ ...estiloInput, borderColor: superaUsura ? C.red : C.lineStrong }} />
              </Campo>
              <Campo id="tasa-usura" label="Usura del mes (% EA)">
                <input id="tasa-usura" type="number" min={0} step={0.01} value={reglas.usuraEA} onChange={e => set('usuraEA', Number(e.target.value) || 0)} style={estiloInput} />
              </Campo>
            </div>
            {superaUsura
              ? <p style={{ fontSize: 13, color: C.red, margin: 0, fontWeight: 600 }}>La tasa supera la usura: en la plataforma no se deja guardar, y el motor aplica la usura ({reglas.usuraEA} % EA).</p>
              : <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Tasa diaria aplicada: {(td * 100).toFixed(4).replace('.', ',')} %. La usura la certifica la Superfinanciera cada mes y se registra aquí.</p>}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.ink, margin: '0 0 4px' }}>Base de la mora</p>
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Solo el capital vencido: nunca sobre intereses ni sobre mora.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Campo id="dias-gracia" label="Días de gracia">
                <input id="dias-gracia" type="number" min={0} max={15} step={1} value={reglas.diasGracia} onChange={e => set('diasGracia', Math.max(0, Number(e.target.value) || 0))} style={estiloInput} />
              </Campo>
              <Campo id="mora-desde" label="Pasada la gracia, la mora corre">
                <select id="mora-desde" value={reglas.moraDesde} onChange={e => set('moraDesde', e.target.value as Reglas['moraDesde'])} style={estiloInput}>
                  <option value="vencimiento">Desde el vencimiento</option><option value="fin-gracia">Desde el fin de la gracia</option>
                </select>
              </Campo>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.ink, margin: '0 0 6px' }}>Orden de aplicación de un pago</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                <Chip tono="navy" texto="Cuota más antigua" /><Chip tono="red" texto="1. Mora" /><Chip tono="amber" texto="2. Interés" /><Chip tono="green" texto="3. Capital" />
              </div>
            </div>
            <Campo id="excedente" label="Si un pago supera lo que se debe hoy">
              <select id="excedente" value={reglas.excedente} onChange={e => set('excedente', e.target.value as Reglas['excedente'])} style={estiloInput}>
                <option value="adelantar">Adelantar las cuotas siguientes (por defecto)</option><option value="abono">Abono a capital</option>
              </select>
            </Campo>
            <EtiquetaAbierta />
          </div>
        </Tarjeta>

        <Tarjeta>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Building2 size={18} color={C.navy} /> <p style={{ fontSize: 16, fontWeight: 700, color: C.ink, margin: 0 }}>Cúcuta (Mi Lote)</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <InterruptorRecordatorio label="Interés de mora" checked={false} onChange={() => {}} disabled />
            <p style={{ fontSize: 12, color: C.muted, marginTop: -8 }}>Cuota fija según el contrato MF, sin interés de mora.</p>
            <Campo id="alerta-cuotas" label="Alerta cuando lo vencido equivale a" ayuda="El sistema alerta; el responsable de sede decide si recupera el lote.">
              <select id="alerta-cuotas" value={reglas.alertaCuotas} onChange={e => set('alertaCuotas', Number(e.target.value))} style={estiloInput}>
                <option value={2}>2 cuotas</option><option value={3}>3 cuotas</option><option value={4}>4 cuotas</option>
              </select>
            </Campo>
            <Campo id="bono-valor" label="Bono por referido" ayuda="Se causa con la 3.ª cuota del referido; se anula si antes se atrasa dos cuotas o se cae el contrato.">
              <select id="bono-valor" value={reglas.bonoValor} onChange={e => set('bonoValor', Number(e.target.value))} style={estiloInput}>
                <option value={500000}>$500.000</option><option value={1000000}>$1.000.000</option>
              </select>
            </Campo>
            <EtiquetaAbierta />
          </div>
        </Tarjeta>

        <Tarjeta>
          <p style={{ fontSize: 16, fontWeight: 700, color: C.ink, margin: '0 0 14px' }}>Para las dos sedes</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <InterruptorRecordatorio label="Las transferencias que registra cartera pasan por tesorería" checked={reglas.exigeVerificacion} onChange={v => set('exigeVerificacion', v)} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.ink, margin: '0 0 4px' }}>Festivos de Colombia</p>
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Próximos: {proximosFestivos.map(f => fechaLarga(f)).join(', ')}. Una cuota que vence en domingo o festivo se paga sin mora el siguiente día hábil.</p>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.ink, margin: '0 0 4px' }}>Horario de recordatorios</p>
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Lunes a viernes de 7:00 a 19:00 y sábados de 8:00 a 15:00; nunca domingos ni festivos.</p>
            </div>
          </div>
        </Tarjeta>

        <Tarjeta style={{ background: C.blueSoft, borderColor: C.blue }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: C.blue, margin: '0 0 8px' }}>Así queda el cálculo con estas reglas</p>
          <p style={{ fontSize: 13, color: C.blue, margin: '0 0 8px' }}>El caso de Claudia: cuota de $3.000.000 que vence el 5 de octubre. El cliente paga $2.000.000 ese día y el resto 31 días después.</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: C.blue, margin: '0 0 4px', fontVariantNumeric: 'tabular-nums' }}>Debe {money(1000000 + ejemploMora)}</p>
          <p style={{ fontSize: 13, color: C.blue, margin: 0 }}>$1.000.000 de capital + {money(ejemploMora)} de mora. Cambia la tasa, la usura o los días de gracia y el resultado se recalcula al instante.</p>
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
  const [personaId, setPersonaId] = useState('jennifer');
  const [clientes, setClientes] = useState<Cliente[]>(CLIENTES_INICIALES);
  const [siguienteRecibo, setSiguienteRecibo] = useState(RECIBO_INICIAL_NUEVOS);
  const [reglas, setReglas] = useState<Reglas>(REGLAS_INICIALES);
  const [reportes, setReportes] = useState<ReporteWhatsApp[]>(REPORTES_INICIALES);
  const [pagosSinIdentificar, setPagosSinIdentificar] = useState<PagoSinIdentificar[]>(PAGOS_SIN_IDENTIFICAR_INICIALES);
  const [clienteSeleccionadoId, setClienteSeleccionadoId] = useState('la2');
  const [busqueda, setBusqueda] = useState('');
  const [modalPagoAbierto, setModalPagoAbierto] = useState(false);
  const [modalRecibo, setModalRecibo] = useState<{ clienteId: string; pago: Pago } | null>(null);
  const [modalPDF, setModalPDF] = useState<{ fecha: string; cuotas: CuotaEstado[]; resumen: ResumenCliente } | null>(null);
  const [modalAcuerdo, setModalAcuerdo] = useState<string | null>(null);
  const [modalGestion, setModalGestion] = useState<string | null>(null);
  const [modalDecision, setModalDecision] = useState<string | null>(null);
  const [gestiones, setGestiones] = useState<Map<string, Gestion[]>>(new Map());
  const [decisiones, setDecisiones] = useState<Map<string, { decision: Decision; motivo: string; por: string }>>(new Map());
  const [bonosAprobados, setBonosAprobados] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [recordatorios, setRecordatorios] = useState({ antes3: true, elDia: true, despues3: false });
  const [filtroSedeMorosos, setFiltroSedeMorosos] = useState<'Todas' | Sede>('Todas');
  const [tabSocios, setTabSocios] = useState<'informe' | 'flujo'>('informe');
  const [proyectoInformeId, setProyectoInformeId] = useState('cantalta');
  const [recordatoriosEnviados, setRecordatoriosEnviados] = useState<Set<string>>(new Set());

  const persona = PERSONAS.find(p => p.id === personaId)!;
  const permitidas = SECCIONES_POR_ROL[persona.rol];
  const seccionVisible: Seccion = permitidas.includes(seccion) ? seccion : 'inicio';
  const enSede = (c: Cliente) => !persona.sede || proyectoPorId(c.raw.proyectoId).sede === persona.sede;
  const clientesVisibles = useMemo(() => clientes.filter(enSede), [clientes, persona]); // eslint-disable-line react-hooks/exhaustive-deps

  function mostrarToast(mensaje: string) {
    setToast(mensaje);
    setTimeout(() => setToast(null), 5500);
  }

  function irA(s: Seccion) {
    if (permitidas.includes(s)) setSeccion(s);
    else mostrarToast('Esa pantalla no es de este rol: cambia en «Ver como».');
  }

  function cambiarPersona(id: string) {
    const nueva = PERSONAS.find(p => p.id === id)!;
    setPersonaId(id);
    if (!SECCIONES_POR_ROL[nueva.rol].includes(seccion)) setSeccion('inicio');
    const visibles = clientes.filter(c => !nueva.sede || proyectoPorId(c.raw.proyectoId).sede === nueva.sede);
    if (!visibles.some(c => c.raw.id === clienteSeleccionadoId) && visibles[0]) setClienteSeleccionadoId(visibles[0].raw.id);
    if (nueva.sede) setFiltroSedeMorosos(nueva.sede);
    else setFiltroSedeMorosos('Todas');
  }

  const resumenes = useMemo(() => {
    const mapa = new Map<string, { cuotas: CuotaEstado[]; resumen: ResumenCliente }>();
    for (const c of clientes) {
      const proyecto = proyectoPorId(c.raw.proyectoId);
      const cuotas = construirCuotasEstado(c.plan, c.pagos, proyecto.conMora, reglas);
      mapa.set(c.raw.id, { cuotas, resumen: resumenCliente(cuotas, c.pagos, proyecto, reglas) });
    }
    return mapa;
  }, [clientes, reglas]);

  const kpisInicio = useMemo(() => {
    let valorVencidoTotal = 0, clientesEnMora = 0, clientesAlerta3 = 0;
    for (const c of clientesVisibles) {
      if (c.estado === 'recuperado') continue;
      const resumen = resumenes.get(c.raw.id)!.resumen;
      if (resumen.cuotasVencidas > 0) { valorVencidoTotal += resumen.valorVencido + resumen.moraAHoy; clientesEnMora++; }
      if (resumen.estadoGeneral === 'ALERTA') clientesAlerta3++;
    }
    // El recaudo del grupo sube con cada pago que se registre en la demo.
    const recaudadoSep = RECAUDADO_SEP_GRUPO_BASE + recaudadoSepDe(clientes) - RECAUDADO_SEP_DEMO_INICIAL;
    const reportesPendientes = reportes.filter(r => { const c = clientePorIdEn(clientes, r.clienteId); return r.estado === 'pendiente' && !!c && enSede(c); }).length;
    return {
      programadoSep: PROGRAMADO_SEP_GRUPO, recaudadoSep, valorVencidoTotal, clientesEnMora, clientesAlerta3,
      reportesPendientes, sinIdentificar: pagosSinIdentificar.length, cumplimientoSep: CUMPLIMIENTO_MENSUAL['2026-09'],
    };
  }, [clientes, clientesVisibles, resumenes, reportes, pagosSinIdentificar]);

  const barrasMeses = useMemo(() => {
    const fijo = (['2026-04', '2026-05', '2026-06', '2026-07', '2026-08'] as const).map(m => ({
      mes: MESES_CORTOS[Number(m.slice(5, 7)) - 1].replace(/^./, s => s.toUpperCase()),
      programado: HISTORICO_MENSUAL[m].programado, recaudado: HISTORICO_MENSUAL[m].recaudado,
    }));
    return [...fijo, { mes: 'Sep', programado: kpisInicio.programadoSep, recaudado: kpisInicio.recaudadoSep }];
  }, [kpisInicio]);

  const referenciasUsadas = useMemo(() => {
    const set = new Set<string>();
    for (const c of clientes) for (const p of vigentes(c.pagos)) set.add(p.referencia);
    for (const r of reportes) if (r.estado !== 'rechazado') set.add(r.referencia);
    return set;
  }, [clientes, reportes]);

  const listaMorosos = useMemo((): FilaMoroso[] => {
    const filas = clientesVisibles.map((c): FilaMoroso | null => {
      if (c.estado === 'recuperado') return null;
      const proyecto = proyectoPorId(c.raw.proyectoId);
      const datos = resumenes.get(c.raw.id)!;
      if (datos.resumen.cuotasVencidas === 0) return null;
      const vencidasOrdenadas = datos.cuotas.filter(cu => cu.estado === 'vencida' || cu.estado === 'parcial');
      const diasAtraso = Math.max(...vencidasOrdenadas.map(cu => cu.diasAtraso));
      const segmento: FilaMoroso['segmento'] = datos.resumen.cuotasVencidas <= 1 && diasAtraso <= 15 ? 'buen pagador' : 'atrasado';
      let accion: string; let accionTono: Tono;
      if (datos.resumen.estadoGeneral === 'ALERTA') { accion = 'Revisar contrato (posible recuperación del lote)'; accionTono = 'amber'; }
      else if (proyecto.sede === 'Bucaramanga' && datos.resumen.cuotasVencidas >= 3) { accion = 'Proponer acuerdo de pago'; accionTono = 'amber'; }
      else if (segmento === 'atrasado') { accion = 'Llamada de cobro'; accionTono = 'blue'; }
      else { accion = 'Recordatorio por WhatsApp'; accionTono = 'blue'; }
      return { cliente: c, proyecto, resumen: datos.resumen, diasAtraso, accion, accionTono, segmento };
    }).filter((x): x is FilaMoroso => x !== null);
    return filas.filter(x => filtroSedeMorosos === 'Todas' || x.proyecto.sede === filtroSedeMorosos)
      .sort((a, b) => b.resumen.valorVencido - a.resumen.valorVencido);
  }, [clientesVisibles, resumenes, filtroSedeMorosos]);

  const bonos = useMemo((): FilaBono[] => clientesVisibles
    .filter(c => c.raw.referidoDeId)
    .map(c => {
      const referente = clientePorIdEn(clientes, c.raw.referidoDeId!);
      if (!referente) return null;
      const b = estadoBono(c, resumenes.get(c.raw.id)?.cuotas ?? []);
      return { referido: c, referente, estado: b.estado, pagadas: b.pagadas };
    })
    .filter((x): x is FilaBono => x !== null), [clientesVisibles, clientes, resumenes]);

  const clienteEjemploRecordatorio = useMemo(() => {
    const primero = listaMorosos.find(m => m.proyecto.conMora) ?? listaMorosos[0];
    if (!primero) return null;
    const vencida = resumenes.get(primero.cliente.raw.id)?.cuotas.find(c => c.estado === 'vencida' || c.estado === 'parcial');
    if (!vencida) return null;
    return { nombre: primero.cliente.raw.nombre, valor: vencida.capitalProg + vencida.interesProg, fecha: vencida.vence, conMora: primero.proyecto.conMora };
  }, [listaMorosos, resumenes]);

  function actualizarCliente(id: string, cambio: (c: Cliente) => Cliente) {
    setClientes(prev => prev.map(x => (x.raw.id === id ? cambio(x) : x)));
  }

  // Registra un pago confirmado: lo aplica con el motor, emite el recibo y dice cómo queda el cliente.
  function registrarPagoEnCliente(clienteId: string, valor: number, fecha: string, medio: Medio, cuenta: string, referencia: string,
    excedente: 'adelantar' | 'abono', modoAbono: 'plazo' | 'cuota', meta: { origen: OrigenPago; registradoPor: string; confirmadoPor: string }): { recibo: string; quedaDebiendo: number } {
    const recibo = `RC-${String(siguienteRecibo).padStart(6, '0')}`;
    const c = clientePorIdEn(clientes, clienteId);
    if (!c) return { recibo, quedaDebiendo: 0 };
    const proyecto = proyectoPorId(c.raw.proyectoId);
    const activos = vigentes(c.pagos);
    const hoy = aplicarPagoAPlan(saldosElegiblesPara(c.plan, activos, fecha), valor, fecha, proyecto.conMora, reglas);
    let aplicaciones = hoy.aplicaciones;
    let planFinal = c.plan;
    let abono: Pago['abono'] | undefined;
    let saldoFavor: number | undefined;
    let planAntes: CuotaPlan[] | undefined;
    if (hoy.sobra > 0 && excedente === 'adelantar') {
      const todo = aplicarPagoAPlan(construirSaldos(c.plan, activos), valor, fecha, proyecto.conMora, reglas);
      aplicaciones = todo.aplicaciones;
      if (todo.sobra > 0) saldoFavor = todo.sobra;
    } else if (hoy.sobra > 0) {
      planFinal = aplicarAbonoExtraordinario(c.plan, acumularAplicaciones([...activos, { aplicaciones }]), hoy.sobra, modoAbono);
      abono = { monto: hoy.sobra, modo: modoAbono };
      planAntes = c.plan;
    }
    const nuevoPago: Pago = { recibo, fecha, valor, medio, cuenta, referencia, aplicaciones, abono, saldoFavor, soporte: true, planAntes, ...meta };
    const pagos = [...c.pagos, nuevoPago].sort((a, b) => (a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0));
    const cuotas = construirCuotasEstado(planFinal, pagos, proyecto.conMora, reglas);
    const r = resumenCliente(cuotas, pagos, proyecto, reglas);
    actualizarCliente(clienteId, x => ({ ...x, plan: planFinal, pagos }));
    setSiguienteRecibo(n => n + 1);
    return { recibo, quedaDebiendo: r.valorVencido + r.moraAHoy };
  }

  function avisoDePago(prefijo: string, recibo: string, quedaDebiendo: number): string {
    return quedaDebiendo > 0
      ? `${prefijo} · Recibo ${recibo}. Todavía quedan ${money(quedaDebiendo)} vencidos (incluye mora).`
      : `${prefijo} · Recibo ${recibo}. El cliente quedó al día.`;
  }

  function horaActual(): string {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  function confirmarPagoModal(datos: DatosPago, vaATesoreria: boolean) {
    const c = clientePorIdEn(clientes, clienteSeleccionadoId);
    setModalPagoAbierto(false);
    if (!c) return;
    if (vaATesoreria) {
      const esperado = valorEsperado(c, resumenes.get(c.raw.id)?.cuotas ?? []);
      const alerta = alertaDeReporte(clientes, reportes, esperado, datos.valor, datos.referencia, datos.fecha);
      setReportes(prev => [{ id: `rep-${Date.now()}`, clienteId: c.raw.id, fecha: datos.fecha, hora: horaActual(), valor: datos.valor, banco: datos.cuenta, referencia: datos.referencia,
        estado: 'pendiente', alerta, origen: 'oficina', medio: datos.medio, cuenta: datos.cuenta, registradoPor: persona.nombre }, ...prev]);
      mostrarToast('Enviado a tesorería. Cambia a «Óscar Daniel · Tesorería» para confirmarlo.');
      return;
    }
    const { recibo, quedaDebiendo } = registrarPagoEnCliente(c.raw.id, datos.valor, datos.fecha, datos.medio, datos.cuenta, datos.referencia, datos.excedente, datos.modoAbono,
      { origen: 'oficina', registradoPor: persona.nombre, confirmadoPor: persona.nombre });
    mostrarToast(avisoDePago('Pago registrado', recibo, quedaDebiendo));
  }

  function confirmarReporte(reporte: ReporteWhatsApp) {
    const { recibo, quedaDebiendo } = registrarPagoEnCliente(reporte.clienteId, reporte.valor, reporte.fecha, reporte.medio, reporte.cuenta, reporte.referencia, reglas.excedente, 'plazo',
      { origen: reporte.origen === 'whatsapp' ? 'whatsapp' : 'oficina', registradoPor: reporte.registradoPor ?? 'El cliente por WhatsApp', confirmadoPor: persona.nombre });
    setReportes(prev => prev.map(r => r.id === reporte.id ? { ...r, estado: 'confirmado', recibo } : r));
    mostrarToast(avisoDePago('Pago confirmado y recibo enviado por WhatsApp', recibo, quedaDebiendo));
  }

  function rechazarReporte(id: string, motivo: string) {
    setReportes(prev => prev.map(r => r.id === id ? { ...r, estado: 'rechazado', motivoRechazo: motivo } : r));
    mostrarToast('Reporte rechazado. El cliente recibe el motivo por WhatsApp.');
  }

  function reporteDelCliente(d: { clienteId: string; valor: number; fecha: string; cuenta: string; referencia: string }) {
    const c = clientePorIdEn(clientes, d.clienteId);
    if (!c) return;
    const esperado = valorEsperado(c, resumenes.get(c.raw.id)?.cuotas ?? []);
    const alerta = alertaDeReporte(clientes, reportes, esperado, d.valor, d.referencia, d.fecha);
    setReportes(prev => [{ id: `rep-${Date.now()}`, clienteId: d.clienteId, fecha: d.fecha, hora: horaActual(), valor: d.valor, banco: d.cuenta, referencia: d.referencia,
      estado: 'pendiente', alerta, origen: 'whatsapp', medio: 'Transferencia', cuenta: d.cuenta }, ...prev]);
    mostrarToast(alerta ? `Llegó el reporte con una alerta: ${alerta.mensaje}` : 'Llegó un reporte nuevo a la bandeja de tesorería.');
  }

  function asignarSinIdentificar(item: PagoSinIdentificar, clienteId: string) {
    const { recibo, quedaDebiendo } = registrarPagoEnCliente(clienteId, item.valor, item.fecha, 'Consignación', item.cuenta, `CONSIG-${item.fecha.replace(/-/g, '')}`, reglas.excedente, 'plazo',
      { origen: 'identificado', registradoPor: persona.nombre, confirmadoPor: persona.nombre });
    setPagosSinIdentificar(prev => prev.filter(p => p.id !== item.id));
    mostrarToast(avisoDePago(`Asignado con fecha ${fechaLarga(item.fecha)}`, recibo, quedaDebiendo));
  }

  function anularUltimo(clienteId: string, motivo: string) {
    const c = clientePorIdEn(clientes, clienteId);
    if (!c) return;
    const activos = vigentes(c.pagos);
    const ultimo = activos[activos.length - 1];
    if (!ultimo) return;
    actualizarCliente(clienteId, x => ({
      ...x, plan: ultimo.planAntes ?? x.plan,
      pagos: x.pagos.map(p => (p === ultimo ? { ...p, anulado: { motivo, por: persona.nombre } } : p)),
    }));
    mostrarToast(`Recibo ${ultimo.recibo} anulado: el contrato se recalculó sin ese pago.`);
  }

  function crearContrato(raw: ClienteRaw) {
    const proyecto = proyectoPorId(raw.proyectoId);
    const nuevo = construirClienteInicial(raw, proyecto, () => 'N/A', () => 'N/A');
    setClientes(prev => [...prev, nuevo]);
    setClienteSeleccionadoId(raw.id);
    setSeccion('estado-cuenta');
    mostrarToast(`Contrato ${raw.numeroContrato} creado con ${raw.plazoMeses} cuotas. Ya aparece en recordatorios, morosos y socios.`);
  }

  function aprobarAcuerdo(clienteId: string, n: number, pct: number, primera: string, aprobado: boolean) {
    setModalAcuerdo(null);
    const c = clientePorIdEn(clientes, clienteId);
    const datos = resumenes.get(clienteId);
    if (!c || !datos) return;
    if (!aprobado) {
      guardarGestion(clienteId, { tipo: 'Nota', resultado: `Propuso acuerdo de ${n} cuotas con ${pct} % de descuento de mora (espera aprobación)` });
      mostrarToast('Acuerdo enviado a aprobación. Cambia a José Luis o Claudia para aprobarlo.');
      return;
    }
    const { plan, acuerdo } = construirAcuerdo(c, datos.cuotas, n, pct, primera);
    actualizarCliente(clienteId, x => ({ ...x, plan, acuerdo: { ...acuerdo, autorizadoPor: persona.nombre } }));
    mostrarToast(`Acuerdo aprobado: ${n} cuotas de ${money(acuerdo.valorCuota)}. Nació la versión 2 del plan.`);
  }

  function guardarGestion(clienteId: string, g: Omit<Gestion, 'fecha' | 'por'>) {
    setGestiones(prev => {
      const m = new Map(prev);
      m.set(clienteId, [...(m.get(clienteId) ?? []), { ...g, fecha: HOY, por: persona.nombre }]);
      return m;
    });
  }

  function decidir(clienteId: string, d: Decision, motivo: string) {
    setModalDecision(null);
    setDecisiones(prev => new Map(prev).set(clienteId, { decision: d, motivo, por: persona.nombre }));
    if (d === 'recuperar') {
      actualizarCliente(clienteId, x => ({ ...x, estado: 'recuperado' }));
      mostrarToast('Lote recuperado: se crea la orden de pago de la devolución en Compras y el lote queda disponible.');
    } else if (d === 'acuerdo') {
      setModalAcuerdo(clienteId);
    } else {
      mostrarToast('Decisión guardada con su motivo. La alerta vuelve si sigue sin pagar.');
    }
  }

  function aprobarBono(id: string) {
    setBonosAprobados(prev => new Set(prev).add(id));
    mostrarToast('Bono aprobado: se creó la orden de pago en Compras, con el centro de costo del proyecto.');
  }

  function enviarRecordatorio(clienteId: string) {
    setRecordatoriosEnviados(prev => new Set(prev).add(clienteId));
    mostrarToast('Recordatorio enviado por WhatsApp (queda en el historial del cliente).');
  }

  const clienteModal = clientePorIdEn(clientes, clienteSeleccionadoId);
  const proyectoModal = clienteModal ? proyectoPorId(clienteModal.raw.proyectoId) : null;
  const clienteDe = (id: string | null) => (id ? clientePorIdEn(clientes, id) : undefined);

  return (
    <div style={{ minHeight: '100vh', background: C.surface, color: C.ink, fontFamily: "'DM Sans', Arial, sans-serif" }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap'); button:focus-visible, input:focus-visible, select:focus-visible, a:focus-visible, [role='switch']:focus-visible { outline: 2px solid #0a2342; outline-offset: 2px; } * { box-sizing: border-box; } .nav-movil { scrollbar-width: none; } .nav-movil::-webkit-scrollbar { display: none; }"}</style>

      <FranjaAviso />
      <NavMovil seccion={seccionVisible} onCambiar={irA} permitidas={permitidas} />
      <Sidebar seccion={seccionVisible} onCambiar={irA} permitidas={permitidas} persona={persona} />

      <main className="pt-[116px] lg:pt-[64px] lg:ml-[240px]" style={{ maxWidth: 1180 }}>
        <div className="pb-10 px-3 sm:px-6">
          <SelectorPersona persona={persona} onCambiar={cambiarPersona} />
          {seccionVisible === 'inicio' && <SeccionInicio kpis={kpisInicio} barras={barrasMeses} onIrA={irA} />}
          {seccionVisible === 'ventas' && (
            <SeccionVentas clientes={clientesVisibles} resumenes={resumenes} persona={persona} reglas={reglas} onCrear={crearContrato}
              onVer={id => { setClienteSeleccionadoId(id); setSeccion('estado-cuenta'); }} />
          )}
          {seccionVisible === 'estado-cuenta' && (
            <SeccionEstadoCuenta clientes={clientesVisibles} resumenes={resumenes} busqueda={busqueda} setBusqueda={setBusqueda}
              clienteId={clienteSeleccionadoId} setClienteId={setClienteSeleccionadoId} reglas={reglas} persona={persona}
              onAbrirModal={() => setModalPagoAbierto(true)} onToast={mostrarToast} onAnular={anularUltimo}
              onVerRecibo={pago => setModalRecibo({ clienteId: clienteSeleccionadoId, pago })}
              onVerPDF={(fecha, cuotas, resumen) => setModalPDF({ fecha, cuotas, resumen })} />
          )}
          {seccionVisible === 'por-verificar' && (
            <SeccionPorVerificar clientes={clientesVisibles} reportes={reportes.filter(r => { const c = clientePorIdEn(clientes, r.clienteId); return !!c && enSede(c); })}
              pagosSinIdentificar={pagosSinIdentificar} persona={persona}
              onConfirmarReporte={confirmarReporte} onRechazarReporte={rechazarReporte} onAsignarSinIdentificar={asignarSinIdentificar} onReporteCliente={reporteDelCliente} />
          )}
          {seccionVisible === 'morosos' && (
            <SeccionMorosos lista={listaMorosos} filtroSede={filtroSedeMorosos} setFiltroSede={setFiltroSedeMorosos} persona={persona} reglas={reglas}
              gestiones={gestiones} decisiones={decisiones} bonos={bonos} bonosAprobados={bonosAprobados}
              recordatoriosEnviados={recordatoriosEnviados} onEnviarRecordatorio={enviarRecordatorio}
              onGestion={setModalGestion} onAcuerdo={setModalAcuerdo} onDecidir={setModalDecision} onAprobarBono={aprobarBono}
              recordatorios={recordatorios} setRecordatorios={setRecordatorios} clienteEjemplo={clienteEjemploRecordatorio} />
          )}
          {seccionVisible === 'socios' && (
            <SeccionSocios tab={tabSocios} setTab={setTabSocios} proyectoId={proyectoInformeId} setProyectoId={setProyectoInformeId}
              clientes={clientesVisibles} resumenes={resumenes} recaudadoSep={kpisInicio.recaudadoSep} persona={persona} onToast={mostrarToast} />
          )}
          {seccionVisible === 'configuracion' && <SeccionConfiguracion reglas={reglas} setReglas={setReglas} />}
        </div>
      </main>

      {modalPagoAbierto && clienteModal && proyectoModal && (
        <ModalRegistrarPago cliente={clienteModal} proyecto={proyectoModal} referenciasUsadas={referenciasUsadas} reglas={reglas}
          siguienteRecibo={siguienteRecibo} persona={persona} onCerrar={() => setModalPagoAbierto(false)} onConfirmar={confirmarPagoModal} />
      )}
      {modalRecibo && (() => {
        const c = clienteDe(modalRecibo.clienteId);
        return c ? <ModalRecibo pago={modalRecibo.pago} cliente={c} proyecto={proyectoPorId(c.raw.proyectoId)} onCerrar={() => setModalRecibo(null)} onToast={mostrarToast} /> : null;
      })()}
      {modalPDF && clienteModal && proyectoModal && (
        <ModalEstadoCuentaPDF cliente={clienteModal} proyecto={proyectoModal} cuotas={modalPDF.cuotas} resumen={modalPDF.resumen} fecha={modalPDF.fecha}
          reglas={reglas} persona={persona} onCerrar={() => setModalPDF(null)} onToast={mostrarToast} />
      )}
      {modalAcuerdo && (() => {
        const c = clienteDe(modalAcuerdo);
        const d = resumenes.get(modalAcuerdo);
        return c && d ? <ModalAcuerdo cliente={c} cuotas={d.cuotas} persona={persona} onCerrar={() => setModalAcuerdo(null)} onConfirmar={(n, pct, primera, ok) => aprobarAcuerdo(c.raw.id, n, pct, primera, ok)} /> : null;
      })()}
      {modalGestion && (() => {
        const c = clienteDe(modalGestion);
        return c ? <ModalGestion cliente={c} onCerrar={() => setModalGestion(null)} onGuardar={g => { guardarGestion(c.raw.id, g); setModalGestion(null); mostrarToast('Gestión guardada en el historial del cliente.'); }} /> : null;
      })()}
      {modalDecision && (() => {
        const c = clienteDe(modalDecision);
        const d = resumenes.get(modalDecision);
        return c && d ? <ModalDecision cliente={c} resumen={d.resumen} reglas={reglas} onCerrar={() => setModalDecision(null)} onDecidir={(dec, motivo) => decidir(c.raw.id, dec, motivo)} /> : null;
      })()}

      {toast && <Toast mensaje={toast} />}
    </div>
  );
}
