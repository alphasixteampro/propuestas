// Piezas compartidas de la demo de cartera: tokens, formatos, tipos, datos de proyectos y componentes base.
import React from "react";
import { X } from "lucide-react";

export const HOY = '2026-09-23';

export const C = {
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

export const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const fmtCOP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export function money(n: number): string { return fmtCOP.format(Math.round(n)); }

export function fechaLarga(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MESES_CORTOS[m - 1]} ${y}`;
}

export function diffDays(a: string, b: string): number {
  return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86400000);
}

export function sumarMeses(base: string, meses: number, diaCorte: number): string {
  const [y, m] = base.split('-').map(Number);
  const total = (m - 1) + meses;
  const anio = y + Math.floor(total / 12);
  const mes = (total % 12) + 1;
  const ultimoDia = new Date(Date.UTC(anio, mes, 0)).getUTCDate();
  const dia = Math.min(diaCorte, ultimoDia);
  return `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

export function finDeMes(fecha: string): string {
  const [y, m] = fecha.split('-').map(Number);
  const ultimoDia = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return `${y}-${String(m).padStart(2, '0')}-${String(ultimoDia).padStart(2, '0')}`;
}

export function fechaAntes(fecha: string, dias: number): string {
  const t = Date.parse(fecha + 'T00:00:00Z') - dias * 86400000;
  const d = new Date(t);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

export function fechaDespues(fecha: string, dias: number): string { return fechaAntes(fecha, -dias); }

// Festivos de Colombia 2025–2026. Si una cuota vence en domingo o festivo, se paga sin mora el
// siguiente día hábil (regla R4 del PRD).
export const FESTIVOS = new Set([
  '2025-01-01', '2025-01-06', '2025-03-24', '2025-04-17', '2025-04-18', '2025-05-01', '2025-06-02', '2025-06-23',
  '2025-06-30', '2025-07-20', '2025-08-07', '2025-08-18', '2025-10-13', '2025-11-03', '2025-11-17', '2025-12-08', '2025-12-25',
  '2026-01-01', '2026-01-12', '2026-03-23', '2026-04-02', '2026-04-03', '2026-05-01', '2026-05-18', '2026-06-08',
  '2026-06-15', '2026-06-29', '2026-07-20', '2026-08-07', '2026-08-17', '2026-10-12', '2026-11-02', '2026-11-16', '2026-12-08', '2026-12-25',
]);

export function esDiaHabil(fecha: string): boolean {
  return new Date(fecha + 'T00:00:00Z').getUTCDay() !== 0 && !FESTIVOS.has(fecha);
}

export function siguienteHabil(fecha: string): string {
  let f = fecha;
  while (!esDiaHabil(f)) f = fechaDespues(f, 1);
  return f;
}

// Tasa diaria a partir de la efectiva anual (PRD §9): i_d = (1 + EA)^(1/365) − 1.
export function tasaDiaria(ea: number): number { return Math.pow(1 + ea / 100, 1 / 365) - 1; }

// Reparto por mayor residuo: las partes redondeadas siempre suman el total (RF-C309).
export function repartir(total: number, participantes: { nombre: string; pct: number }[]): { nombre: string; pct: number; valor: number }[] {
  const exactos = participantes.map(p => ({ ...p, exacto: total * p.pct / 100 }));
  const base = exactos.map(p => ({ ...p, valor: Math.floor(p.exacto) }));
  let sobrante = Math.round(total) - base.reduce((s, p) => s + p.valor, 0);
  const orden = [...base.keys()].sort((a, b) => (base[b].exacto - base[b].valor) - (base[a].exacto - base[a].valor));
  for (const i of orden) { if (sobrante <= 0) break; base[i].valor += 1; sobrante--; }
  return base.map(({ nombre, pct, valor }) => ({ nombre, pct, valor }));
}

// ─────────────────────────────────────────────────────────────────────────
// TIPOS
export type Sede = 'Bucaramanga' | 'Cúcuta';
export type Medio = 'Transferencia' | 'Efectivo' | 'Consignación' | 'Link de pago' | 'Cruce de cartera'
  | 'Cheque de gerencia' | 'Descuento de nómina' | 'Pago en especie';
export type Seccion = 'inicio' | 'ventas' | 'planes' | 'estado-cuenta' | 'por-verificar' | 'morosos' | 'carteras'
  | 'bancos' | 'contabilidad' | 'socios' | 'informes' | 'recompensas' | 'configuracion';

// Dos empresas distintas (PRD 12A). Cada sede de la demo es una empresa: Bucaramanga = Mizar,
// Cúcuta = la empresa de Mi Lote, cuya razón social está por confirmar (P26).
export type EmpresaId = 'mizar' | 'cucuta';
export type FiltroEmpresa = EmpresaId | 'grupo';
export interface Empresa { id: EmpresaId; sede: Sede; nombre: string; corto: string; nit: string; prefijoRecibo: string; }
export const EMPRESAS: Empresa[] = [
  { id: 'mizar', sede: 'Bucaramanga', nombre: 'Mizar Diseño y Construcción S.A.S.', corto: 'Mizar', nit: 'NIT por confirmar', prefijoRecibo: 'RC-MZ' },
  { id: 'cucuta', sede: 'Cúcuta', nombre: 'Mi Lote Cúcuta (razón social por confirmar)', corto: 'Mi Lote Cúcuta', nit: 'NIT por confirmar', prefijoRecibo: 'RC-ML' },
];
export function empresaDeSede(sede: Sede): Empresa { return EMPRESAS.find(e => e.sede === sede)!; }
export function empresaPorId(id: EmpresaId): Empresa { return EMPRESAS.find(e => e.id === id)!; }
// ¿El proyecto pertenece a la empresa filtrada? «grupo» incluye las dos.
export function enFiltroEmpresa(sede: Sede, filtro: FiltroEmpresa): boolean { return filtro === 'grupo' || empresaDeSede(sede).id === filtro; }

export interface SocioPeriodo { desde: string; hasta: string | null; participantes: { nombre: string; pct: number }[]; }

// Cada proyecto pertenece a una sociedad titular (formatos reales del 25-sep: Mizar, Palmoc,
// Hacienda Pedregal, Ictinos…). Las sociedades se agrupan en dos operaciones: Bucaramanga y Cúcuta.
export interface Proyecto {
  id: string; nombre: string; sede: Sede; conMora: boolean; alerta3Cuotas: boolean;
  cuentaDefault: string; socios: SocioPeriodo[]; sociedad: string; prefijo: string;
  comisionPct: number; participacionRecaudoPct?: number;
}

// Dónde puede entrar el dinero. Las cuentas bancarias son de una sociedad; el efectivo y las
// cuentas personales quedan «por trasladar» hasta consignarse en la cuenta de la sociedad (R25).
export type TipoLugar = 'banco' | 'efectivo' | 'personal';
export interface LugarRecaudo { nombre: string; tipo: TipoLugar; sociedad?: string; empresaId: EmpresaId | null; banco?: string; }
export const LUGARES_RECAUDO: LugarRecaudo[] = [
  { nombre: 'Bancolombia Mizar', tipo: 'banco', banco: 'Bancolombia', sociedad: 'Mizar Diseño y Construcción', empresaId: 'mizar' },
  { nombre: 'Bancolombia Palmoc', tipo: 'banco', banco: 'Bancolombia', sociedad: 'Palmoc', empresaId: 'mizar' },
  { nombre: 'Bancolombia Hacienda Pedregal', tipo: 'banco', banco: 'Bancolombia', sociedad: 'Hacienda Pedregal', empresaId: 'mizar' },
  { nombre: 'Cuenta Ictinos', tipo: 'banco', banco: 'Banco de Bogotá', sociedad: 'Ictinos Inmobiliaria', empresaId: 'cucuta' },
  { nombre: 'Cuenta Miraflor', tipo: 'banco', banco: 'Davivienda', sociedad: 'Asociación de Vivienda Miraflor', empresaId: 'cucuta' },
  { nombre: 'Efectivo · caja de tesorería', tipo: 'efectivo', empresaId: null },
  { nombre: 'Efectivo · gerencia', tipo: 'efectivo', empresaId: null },
  { nombre: 'Cuenta personal · colaboradora de ventas', tipo: 'personal', empresaId: null },
];
export function lugarPorNombre(nombre: string): LugarRecaudo | undefined { return LUGARES_RECAUDO.find(l => l.nombre === nombre); }
// Un pago recibido en efectivo o en una cuenta personal sigue «por trasladar» hasta que se consigna.
export function porTrasladar(p: { cuenta: string; trasladado?: unknown; administracionAnterior?: boolean }): boolean {
  const lugar = lugarPorNombre(p.cuenta);
  return !!lugar && lugar.tipo !== 'banco' && !p.trasladado && !p.administracionAnterior;
}

export interface CuotaPlan { numero: number; vence: string; capitalProg: number; interesProg: number; etiqueta?: string; reestructurada?: boolean; }

export interface Aplicacion { cuota: number; mora: number; interes: number; capital: number; }

export type OrigenPago = 'oficina' | 'whatsapp' | 'identificado' | 'administracion-anterior' | 'historico';

export interface Pago {
  recibo: string; fecha: string; valor: number; medio: Medio; cuenta: string; referencia: string;
  aplicaciones: Aplicacion[]; abono?: { monto: number; modo: 'plazo' | 'cuota' }; saldoFavor?: number;
  soporte?: boolean; administracionAnterior?: boolean;
  origen?: OrigenPago; registradoPor?: string; confirmadoPor?: string;
  planAntes?: CuotaPlan[]; anulado?: { motivo: string; por: string };
  // Quién pagó cuando no es el titular («encargado de pagos») y, si entró en efectivo o a una cuenta
  // personal, cuándo se consignó en la cuenta de la sociedad.
  pagadoPor?: string; trasladado?: { fecha: string; cuentaDestino: string; por: string };
}

export interface ClienteRaw {
  id: string; nombre: string; cedula: string; telefono: string; proyectoId: string; inmueble: string;
  valorVenta: number; cuotaInicial: number; plazoMeses: number; primeraCuota: string; diaCorte: number;
  cuotasCompletas: number;
  soloMizar?: boolean; referidoDeId?: string; cuotaFijaCucuta?: number;
  parcialValorPagado?: number;
  abonoMonto?: number; abonoModo?: 'plazo' | 'cuota'; abonoFecha?: string;
  administracionAnteriorHasta?: number;
  numeroContrato?: string; autorizaWhatsapp?: boolean; fechaPromesa?: string;
  // Lote como en los formatos de Cúcuta: tipo, manzana, número, área y si incluye urbanismo.
  lote?: { tipo: 'Medianero' | 'Esquinero' | 'Comercial' | 'Intermedio'; manzana: string; numero: string; area: number; urbanismo: boolean };
  bonoDescuento?: number;
}

export interface Acuerdo {
  fecha: string; cuotas: number; valorCuota: number; consolidado: number; descuentoMora: number; autorizadoPor: string;
}

export interface Devolucion { fecha: string; valor: number; motivo: string; por: string; orden: string; }

export interface Cliente {
  raw: ClienteRaw; plan: CuotaPlan[]; pagos: Pago[];
  estado?: 'vigente' | 'recuperado' | 'desistido'; acuerdo?: Acuerdo; devoluciones?: Devolucion[];
}

export interface CuotaEstado extends CuotaPlan {
  capitalPag: number; interesPag: number; moraPag: number; moraPendiente: number;
  estado: 'pagada' | 'parcial' | 'vencida' | 'pendiente' | 'reestructurada'; diasAtraso: number;
}

export interface ResumenCliente {
  totalPagado: number; capitalPagado: number; saldoCapital: number; valorVencido: number; moraAHoy: number;
  proximaCuota: CuotaEstado | null; cuotasVencidas: number; estadoGeneral: 'AL DÍA' | 'EN MORA' | 'ALERTA';
  cuotaOrdinaria: number;
}

// Reglas de dinero configurables por sede (PRD §8). Los valores son ejemplos: la tasa la fija Mizar.
export interface Reglas {
  tasaEA: number; usuraEA: number; diasGracia: number; moraDesde: 'vencimiento' | 'fin-gracia';
  excedente: 'adelantar' | 'abono'; alertaCuotas: number; bonoValor: number; exigeVerificacion: boolean;
}

export const REGLAS_INICIALES: Reglas = {
  tasaEA: 24, usuraEA: 26.5, diasGracia: 0, moraDesde: 'vencimiento',
  excedente: 'adelantar', alertaCuotas: 3, bonoValor: 500000, exigeVerificacion: true,
};

export function tasaDiariaAplicada(r: Reglas): number { return tasaDiaria(Math.min(r.tasaEA, r.usuraEA)); }

export type Rol = 'cartera' | 'tesoreria' | 'sede' | 'gerencia' | 'contabilidad';
export interface Persona { id: string; nombre: string; cargo: string; rol: Rol; sede: Sede | null; }
export function vigentes(pagos: Pago[]): Pago[] { return pagos.filter(p => !p.anulado); }
export const PROYECTOS: Proyecto[] = [
  {
    id: 'villa-plaza', nombre: 'Villa Plaza Real', sede: 'Bucaramanga', conMora: true, alerta3Cuotas: false,
    cuentaDefault: 'Bancolombia Mizar', sociedad: 'Mizar Diseño y Construcción', prefijo: 'VP', comisionPct: 3,
    socios: [{ desde: '2024-01-01', hasta: null, participantes: [{ nombre: 'Mizar', pct: 60 }, { nombre: 'Inversionista Villa Plaza', pct: 40 }] }],
  },
  {
    id: 'montana', nombre: 'Miradores de la Montaña', sede: 'Bucaramanga', conMora: true, alerta3Cuotas: false,
    cuentaDefault: 'Bancolombia Hacienda Pedregal', sociedad: 'Hacienda Pedregal', prefijo: 'MM', comisionPct: 18,
    socios: [{ desde: '2024-01-01', hasta: null, participantes: [{ nombre: 'Mizar', pct: 100 }] }],
  },
  {
    id: 'laureles', nombre: 'Laureles Campestre T3', sede: 'Bucaramanga', conMora: true, alerta3Cuotas: false,
    cuentaDefault: 'Bancolombia Mizar', sociedad: 'Mizar Diseño y Construcción', prefijo: 'LC', comisionPct: 3,
    socios: [{ desde: '2024-01-01', hasta: null, participantes: [{ nombre: 'Mizar', pct: 100 }] }],
  },
  {
    id: 'cantalta', nombre: 'Miradores de Cantalta', sede: 'Bucaramanga', conMora: true, alerta3Cuotas: false,
    cuentaDefault: 'Bancolombia Palmoc', sociedad: 'Palmoc', prefijo: 'MC', comisionPct: 20,
    socios: [{ desde: '2024-01-01', hasta: null, participantes: [{ nombre: 'Mizar', pct: 50 }, { nombre: 'Socio Cantalta', pct: 50 }] }],
  },
  {
    id: 'miraflor', nombre: 'Miraflor (Mi Lote)', sede: 'Cúcuta', conMora: false, alerta3Cuotas: true,
    cuentaDefault: 'Cuenta Miraflor', sociedad: 'Asociación de Vivienda Miraflor', prefijo: 'MF', comisionPct: 1, participacionRecaudoPct: 50,
    socios: [{ desde: '2024-01-01', hasta: null, participantes: [{ nombre: 'Ictinos', pct: 100 }] }],
  },
  {
    id: 'miravista', nombre: 'Miravista (Mi Lote)', sede: 'Cúcuta', conMora: false, alerta3Cuotas: true,
    cuentaDefault: 'Cuenta Ictinos', sociedad: 'Ictinos Inmobiliaria', prefijo: 'MV', comisionPct: 1,
    socios: [
      { desde: '2023-01-01', hasta: '2025-06-04', participantes: [{ nombre: 'Socio A', pct: 33.34 }, { nombre: 'Socio B', pct: 33.33 }, { nombre: 'Socio C', pct: 33.33 }] },
      { desde: '2025-06-05', hasta: null, participantes: [{ nombre: 'Socio A', pct: 50 }, { nombre: 'Socio B', pct: 50 }] },
    ],
  },
];

export function proyectoPorId(id: string): Proyecto { return PROYECTOS.find(p => p.id === id)!; }

// Sociedades titulares, con su operación y sus proyectos (se derivan de los proyectos).
export interface Sociedad { nombre: string; empresaId: EmpresaId; proyectos: string[]; }
export const SOCIEDADES: Sociedad[] = PROYECTOS.reduce<Sociedad[]>((lista, p) => {
  const existente = lista.find(s => s.nombre === p.sociedad);
  if (existente) existente.proyectos.push(p.nombre);
  else lista.push({ nombre: p.sociedad, empresaId: EMPRESAS.find(e => e.sede === p.sede)!.id, proyectos: [p.nombre] });
  return lista;
}, []);
export type Tono = 'green' | 'red' | 'amber' | 'blue' | 'purple' | 'muted' | 'navy';
export const TONOS: Record<Tono, { bg: string; fg: string }> = {
  green: { bg: C.greenSoft, fg: C.green }, red: { bg: C.redSoft, fg: C.red },
  amber: { bg: C.amberSoft, fg: C.amber }, blue: { bg: C.blueSoft, fg: C.blue },
  purple: { bg: C.purpleSoft, fg: C.purple }, muted: { bg: C.surfaceStrong, fg: C.muted },
  navy: { bg: C.surfaceStrong, fg: C.navy },
};

export function Chip({ tono, texto }: { tono: Tono; texto: string }) {
  const t = TONOS[tono];
  return (
    <span style={{ background: t.bg, color: t.fg, fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999, display: 'inline-block', whiteSpace: 'nowrap' }}>
      {texto}
    </span>
  );
}

export function chipDeCuota(estado: CuotaEstado['estado']): { tono: Tono; texto: string } {
  if (estado === 'pagada') return { tono: 'green', texto: 'Pagada' };
  if (estado === 'parcial') return { tono: 'amber', texto: 'Parcial' };
  if (estado === 'vencida') return { tono: 'red', texto: 'Vencida' };
  if (estado === 'reestructurada') return { tono: 'purple', texto: 'Reestructurada' };
  return { tono: 'muted', texto: 'Próxima' };
}

export function chipDeEstadoGeneral(estado: ResumenCliente['estadoGeneral']): Tono {
  if (estado === 'AL DÍA') return 'green';
  if (estado === 'ALERTA') return 'amber';
  return 'red';
}

// Etiqueta y campo reutilizables de los formularios de la demo.
export function Campo({ id, label, children, ayuda }: { id: string; label: string; children: React.ReactNode; ayuda?: string }) {
  return (
    <div>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600, color: C.ink, display: 'block', marginBottom: 4 }}>{label}</label>
      {children}
      {ayuda && <p style={{ fontSize: 12, color: C.muted, margin: '4px 0 0' }}>{ayuda}</p>}
    </div>
  );
}

export const estiloInput: React.CSSProperties = { width: '100%', border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, minHeight: 40, fontFamily: 'inherit', background: C.paper };

export function Modal({ titulo, subtitulo, onCerrar, children, ancho = 520 }: { titulo: string; subtitulo?: string; onCerrar: () => void; children: React.ReactNode; ancho?: number }) {
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

export function TarjetaKpi({ icono: Icono, titulo, valor, sub, tono, onClick }: {
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

export function BotonPrimario({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
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

export function BotonSecundario({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
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

export function Tarjeta({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 12, padding: 20, boxShadow: '0 1px 2px rgba(20,30,50,.04)', ...style }}>
      {children}
    </div>
  );
}

export function MiniaturaComprobante() {
  return (
    <div aria-hidden="true" style={{ width: 52, height: 68, background: '#f1f2f4', border: `1px solid ${C.line}`, borderRadius: 4, padding: 6, display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
      {[70, 90, 60, 80, 50, 75].map((w, i) => <div key={i} style={{ height: 4, width: `${w}%`, background: '#c9ced6', borderRadius: 2 }} />)}
    </div>
  );
}

export function GraficoBarras({ datos }: { datos: { mes: string; programado: number; recaudado: number }[] }) {
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

export function Toast({ mensaje }: { mensaje: string }) {
  return (
    <div role="status" style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 100, background: C.navy, color: '#fff',
      padding: '14px 18px', borderRadius: 10, boxShadow: '0 8px 24px rgba(10,35,66,.3)', fontSize: 14, fontWeight: 600, maxWidth: 340,
    }}>
      {mensaje}
    </div>
  );
}
export function plural(n: number, uno: string, varios: string): string { return `${n} ${n === 1 ? uno : varios}`; }
export function EstadisticaMini({ titulo, valor, tono }: { titulo: string; valor: string; tono?: string }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, padding: '10px 12px' }}>
      <p style={{ fontSize: 12, color: C.muted, margin: '0 0 4px', fontWeight: 600 }}>{titulo}</p>
      <p style={{ fontSize: 17, fontWeight: 700, margin: 0, color: tono ?? C.ink, fontVariantNumeric: 'tabular-nums' }}>{valor}</p>
    </div>
  );
}
