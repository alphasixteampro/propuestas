// Datos de ejemplo y reglas de la demo de JC Proyectos: insumos de la explosión de Opus, pedidos de
// material, cuadrilla de la semana y programa de obra. Todo es ficticio y vive solo en memoria.

export const HOY = '2026-10-09';
export const HOY_TEXTO = 'viernes 9 de octubre de 2026';
export const OBRA = 'Residencial Las Villas (obra de ejemplo)';

const fmtMXN = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
export function money(n: number): string { return fmtMXN.format(Math.round(n)); }
export function num(n: number): string {
  return new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 }).format(n);
}
export function pct(n: number): string { return `${Math.round(n)} %`; }

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export function fechaCorta(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MESES[m - 1]}${y !== 2026 ? ` ${y}` : ''}`;
}
export function diffDias(a: string, b: string): number {
  return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86400000);
}
export function sumarDias(iso: string, dias: number): string {
  const d = new Date(Date.parse(iso + 'T00:00:00Z') + dias * 86400000);
  return d.toISOString().slice(0, 10);
}

// ─────────────────────────────────────────────────────────────────────────
// FRENTES E INSUMOS (lo que hoy sale de Opus como explosión de insumos)

export type FrenteId = 'v1' | 'v2' | 'ac';
export const FRENTES: { id: FrenteId; nombre: string }[] = [
  { id: 'v1', nombre: 'Villa 1' },
  { id: 'v2', nombre: 'Villa 2' },
  { id: 'ac', nombre: 'Áreas comunes' },
];
export function nombreFrente(id: FrenteId): string { return FRENTES.find(f => f.id === id)!.nombre; }

export interface Insumo { id: string; clave: string; nombre: string; unidad: string; precio: number; }
export const INSUMOS: Insumo[] = [
  { id: 'cem', clave: 'MAT-001', nombre: 'Cemento gris CPC 30R (50 kg)', unidad: 'bultos', precio: 265 },
  { id: 'var', clave: 'MAT-014', nombre: 'Varilla corrugada 3/8"', unidad: 'ton', precio: 21500 },
  { id: 'blk', clave: 'MAT-022', nombre: 'Block hueco 15x20x40', unidad: 'piezas', precio: 15 },
  { id: 'are', clave: 'MAT-030', nombre: 'Arena', unidad: 'm³', precio: 480 },
  { id: 'gra', clave: 'MAT-031', nombre: 'Grava 3/4"', unidad: 'm³', precio: 520 },
  { id: 'alm', clave: 'MAT-040', nombre: 'Alambre recocido', unidad: 'kg', precio: 36 },
  { id: 'mal', clave: 'MAT-045', nombre: 'Malla electrosoldada 6x6-10/10', unidad: 'hojas', precio: 520 },
  { id: 'pvc', clave: 'HID-004', nombre: 'Tubo PVC sanitario 4" (6 m)', unidad: 'tramos', precio: 310 },
  { id: 'cab', clave: 'ELE-012', nombre: 'Cable THW cal. 12 (100 m)', unidad: 'rollos', precio: 1450 },
  { id: 'imp', clave: 'ACA-007', nombre: 'Impermeabilizante acrílico (19 L)', unidad: 'cubetas', precio: 1650 },
];
export function insumo(id: string): Insumo { return INSUMOS.find(i => i.id === id)!; }

// Cantidad presupuestada por frente y lo que ya había llegado a la obra antes de esta semana.
export interface LineaPresupuesto { insumoId: string; frente: FrenteId; presupuestado: number; recibidoPrevio: number; }
const P: [string, FrenteId, number, number][] = [
  ['cem', 'v1', 450, 290], ['cem', 'v2', 420, 372], ['cem', 'ac', 120, 20],
  ['var', 'v1', 9, 6.2], ['var', 'v2', 8.5, 6.6], ['var', 'ac', 2, 0.4],
  ['blk', 'v1', 5200, 3100], ['blk', 'v2', 5000, 2600], ['blk', 'ac', 1500, 0],
  ['are', 'v1', 60, 38], ['are', 'v2', 55, 40], ['are', 'ac', 15, 3],
  ['gra', 'v1', 48, 30], ['gra', 'v2', 45, 33], ['gra', 'ac', 12, 2],
  ['alm', 'v1', 300, 190], ['alm', 'v2', 280, 210], ['alm', 'ac', 60, 10],
  ['mal', 'v1', 90, 40], ['mal', 'v2', 85, 35], ['mal', 'ac', 30, 0],
  ['pvc', 'v1', 40, 8], ['pvc', 'v2', 40, 6], ['pvc', 'ac', 25, 0],
  ['cab', 'v1', 14, 2], ['cab', 'v2', 14, 1], ['cab', 'ac', 8, 0],
  ['imp', 'v1', 12, 0], ['imp', 'v2', 12, 0], ['imp', 'ac', 20, 0],
];
export const PRESUPUESTO: LineaPresupuesto[] = P.map(([insumoId, frente, presupuestado, recibidoPrevio]) => ({ insumoId, frente, presupuestado, recibidoPrevio }));

export const PROVEEDORES = ['Materiales La Villa', 'Aceros del Centro', 'Ferretería El Fierro', 'Eléctrica Sol'];

// ─────────────────────────────────────────────────────────────────────────
// PEDIDOS DE MATERIAL (requisiciones)

export type EstadoReq = 'por-aprobar' | 'rechazada' | 'por-comprar' | 'en-camino' | 'incompleta' | 'recibida';
export interface ItemReq { insumoId: string; frente: FrenteId; cantidad: number; recibido: number; precioCompra?: number; }
export interface Recepcion { fecha: string; por: string; nota: string; conFoto: boolean; }
export interface Requisicion {
  id: string; fecha: string; solicitante: string; origen: 'celular' | 'oficina'; nota: string;
  items: ItemReq[]; estado: EstadoReq; comentario?: string;
  proveedor?: string; oc?: string; fechaEntrega?: string; recepciones: Recepcion[];
}

export const REQS_INICIALES: Requisicion[] = [
  {
    id: 'REQ-031', fecha: '2026-10-01', solicitante: 'Residente de obra', origen: 'celular', nota: 'Castillos y dalas planta alta',
    items: [{ insumoId: 'cem', frente: 'v1', cantidad: 40, recibido: 40, precioCompra: 262 }, { insumoId: 'var', frente: 'v1', cantidad: 0.8, recibido: 0.8, precioCompra: 21800 }],
    estado: 'recibida', proveedor: 'Aceros del Centro', oc: 'OC-019', fechaEntrega: '2026-10-02',
    recepciones: [{ fecha: '2026-10-02', por: 'Residente de obra', nota: 'Llegó completo', conFoto: true }],
  },
  {
    id: 'REQ-032', fecha: '2026-10-05', solicitante: 'Residente de obra', origen: 'celular', nota: 'Muros planta alta',
    items: [{ insumoId: 'blk', frente: 'v2', cantidad: 1200, recibido: 1000, precioCompra: 15 }, { insumoId: 'are', frente: 'v2', cantidad: 6, recibido: 6, precioCompra: 470 }],
    estado: 'incompleta', proveedor: 'Materiales La Villa', oc: 'OC-020', fechaEntrega: '2026-10-07',
    recepciones: [{ fecha: '2026-10-07', por: 'Residente de obra', nota: 'Faltaron 200 blocks; el proveedor dice que los manda el lunes', conFoto: true }],
  },
  {
    id: 'REQ-033', fecha: '2026-10-06', solicitante: 'Residente de obra', origen: 'celular', nota: 'Instalaciones de la planta baja',
    items: [{ insumoId: 'cab', frente: 'v1', cantidad: 4, recibido: 0, precioCompra: 1490 }, { insumoId: 'pvc', frente: 'v1', cantidad: 12, recibido: 0, precioCompra: 305 }],
    estado: 'en-camino', proveedor: 'Eléctrica Sol', oc: 'OC-021', fechaEntrega: '2026-10-09', recepciones: [],
  },
  {
    id: 'REQ-034', fecha: '2026-10-07', solicitante: 'Compras', origen: 'oficina', nota: 'Azotea de la casa club',
    items: [{ insumoId: 'imp', frente: 'ac', cantidad: 8, recibido: 0 }],
    estado: 'por-comprar', recepciones: [],
  },
  {
    id: 'REQ-035', fecha: '2026-10-08', solicitante: 'Residente de obra', origen: 'celular', nota: 'Colado de castillos',
    items: [{ insumoId: 'cem', frente: 'v1', cantidad: 10, recibido: 0 }, { insumoId: 'cem', frente: 'v2', cantidad: 10, recibido: 0 }],
    estado: 'por-aprobar', recepciones: [],
  },
  {
    id: 'REQ-036', fecha: '2026-10-09', solicitante: 'Residente de obra', origen: 'celular', nota: 'Losa de entrepiso',
    items: [{ insumoId: 'cem', frente: 'v2', cantidad: 50, recibido: 0 }, { insumoId: 'gra', frente: 'v2', cantidad: 4, recibido: 0 }],
    estado: 'por-aprobar', recepciones: [],
  },
];

// Lo que la "lectura de la remisión" encuentra en la foto. En la demo es fijo: la remisión de la
// OC-021 trae un rollo de cable menos, para mostrar cómo se marca una entrega incompleta.
export function lecturaRemision(req: Requisicion): number[] {
  return req.items.map(it => {
    const pendiente = it.cantidad - it.recibido;
    if (req.id === 'REQ-033' && it.insumoId === 'cab') return Math.max(0, pendiente - 1);
    return pendiente;
  });
}

// ─────────────────────────────────────────────────────────────────────────
// PRESUPUESTO: cuánto queda de cada insumo en cada frente

export interface EstadoLinea extends LineaPresupuesto {
  recibido: number; porRecibir: number; porAprobar: number; disponible: number; usoPct: number;
  ejercido: number; montoPresupuesto: number;
}

const ESTADOS_COMPROMETIDOS: EstadoReq[] = ['por-comprar', 'en-camino', 'incompleta'];

export function estadoPresupuesto(reqs: Requisicion[]): EstadoLinea[] {
  return PRESUPUESTO.map(l => {
    const ins = insumo(l.insumoId);
    let recibido = l.recibidoPrevio, porRecibir = 0, porAprobar = 0, ejercido = l.recibidoPrevio * ins.precio;
    for (const r of reqs) {
      for (const it of r.items) {
        if (it.insumoId !== l.insumoId || it.frente !== l.frente) continue;
        recibido += it.recibido;
        ejercido += it.recibido * (it.precioCompra ?? ins.precio);
        if (ESTADOS_COMPROMETIDOS.includes(r.estado)) porRecibir += it.cantidad - it.recibido;
        if (r.estado === 'por-aprobar') porAprobar += it.cantidad;
      }
    }
    const disponible = l.presupuestado - recibido - porRecibir;
    return {
      ...l, recibido, porRecibir, porAprobar, disponible,
      usoPct: ((recibido + porRecibir) / l.presupuestado) * 100,
      ejercido, montoPresupuesto: l.presupuestado * ins.precio,
    };
  });
}

export function lineaDe(estado: EstadoLinea[], insumoId: string, frente: FrenteId): EstadoLinea {
  return estado.find(l => l.insumoId === insumoId && l.frente === frente)!;
}

// Cuánto se pasaría del presupuesto cada renglón de un pedido que aún no se aprueba.
export function excesoItem(estado: EstadoLinea[], it: { insumoId: string; frente: FrenteId; cantidad: number }): number {
  const l = lineaDe(estado, it.insumoId, it.frente);
  return Math.max(0, it.cantidad - l.disponible);
}

export function tonoUso(p: number): 'green' | 'amber' | 'red' {
  if (p > 100) return 'red';
  if (p >= 85) return 'amber';
  return 'green';
}

// ─────────────────────────────────────────────────────────────────────────
// PROGRAMA DE OBRA (lo que hoy vive en Project)

// estructura: obra negra (cimentación, muros, losas), donde se va casi todo el cemento.
export interface Actividad { id: string; frente: FrenteId; nombre: string; inicio: string; fin: string; real: number; estructura: boolean; }
export const FIN_PROGRAMADO = '2027-03-12';
export const ACTIVIDADES_INICIALES: Actividad[] = [
  { id: 'a1', frente: 'v1', nombre: 'Cimentación', inicio: '2026-06-01', fin: '2026-07-10', real: 100, estructura: true },
  { id: 'a2', frente: 'v1', nombre: 'Muros planta baja', inicio: '2026-07-06', fin: '2026-08-21', real: 100, estructura: true },
  { id: 'a3', frente: 'v1', nombre: 'Losa de entrepiso', inicio: '2026-08-17', fin: '2026-09-25', real: 92, estructura: true },
  { id: 'a4', frente: 'v1', nombre: 'Muros planta alta', inicio: '2026-09-21', fin: '2026-11-06', real: 25, estructura: true },
  { id: 'a5', frente: 'v1', nombre: 'Instalaciones eléctricas e hidráulicas', inicio: '2026-10-01', fin: '2026-12-11', real: 10, estructura: false },
  { id: 'a6', frente: 'v1', nombre: 'Acabados', inicio: '2026-11-16', fin: '2027-02-26', real: 0, estructura: false },
  { id: 'b1', frente: 'v2', nombre: 'Cimentación', inicio: '2026-06-22', fin: '2026-07-31', real: 100, estructura: true },
  { id: 'b2', frente: 'v2', nombre: 'Muros planta baja', inicio: '2026-07-27', fin: '2026-09-11', real: 95, estructura: true },
  { id: 'b3', frente: 'v2', nombre: 'Losa de entrepiso', inicio: '2026-09-07', fin: '2026-10-16', real: 45, estructura: true },
  { id: 'b4', frente: 'v2', nombre: 'Muros planta alta', inicio: '2026-10-12', fin: '2026-11-27', real: 0, estructura: true },
  { id: 'b5', frente: 'v2', nombre: 'Instalaciones eléctricas e hidráulicas', inicio: '2026-10-19', fin: '2026-12-31', real: 0, estructura: false },
  { id: 'b6', frente: 'v2', nombre: 'Acabados', inicio: '2026-12-07', fin: '2027-03-12', real: 0, estructura: false },
  { id: 'c1', frente: 'ac', nombre: 'Alberca y cuarto de máquinas', inicio: '2026-08-03', fin: '2026-10-30', real: 70, estructura: true },
  { id: 'c2', frente: 'ac', nombre: 'Impermeabilización y jardinería', inicio: '2026-11-02', fin: '2027-03-12', real: 0, estructura: false },
];

export function duracion(a: Actividad): number { return Math.max(1, diffDias(a.inicio, a.fin)); }

// Lo que el programa dice que ya debería ir hecho hoy (avance lineal entre inicio y fin).
export function programadoHoy(a: Actividad): number {
  const t = diffDias(a.inicio, HOY) / duracion(a);
  return Math.max(0, Math.min(1, t)) * 100;
}

// Días que la actividad va atrasada: lo que le falta para ir al día, convertido en días de su duración.
export function diasAtraso(a: Actividad): number {
  return Math.max(0, Math.round(((programadoHoy(a) - a.real) / 100) * duracion(a)));
}

export interface ResumenPrograma {
  real: number; programado: number; atraso: number; finEstimado: string; masAtrasada: Actividad | null;
  porFrente: { frente: FrenteId; real: number; programado: number; estructura: number }[];
}

// El avance de cada frente pesa por la duración de sus actividades. La actividad más atrasada marca
// cuánto se corre la entrega: así el programa se ajusta solo con lo que reporta la obra.
export function resumenPrograma(acts: Actividad[]): ResumenPrograma {
  const prom = (lista: Actividad[], f: (a: Actividad) => number) => {
    const total = lista.reduce((s, a) => s + duracion(a), 0);
    return lista.reduce((s, a) => s + f(a) * duracion(a), 0) / total;
  };
  let masAtrasada: Actividad | null = null;
  for (const a of acts) if (diasAtraso(a) > 0 && (!masAtrasada || diasAtraso(a) > diasAtraso(masAtrasada))) masAtrasada = a;
  const atraso = masAtrasada ? diasAtraso(masAtrasada) : 0;
  return {
    real: prom(acts, a => a.real), programado: prom(acts, programadoHoy), atraso,
    finEstimado: sumarDias(FIN_PROGRAMADO, atraso), masAtrasada,
    porFrente: FRENTES.map(f => {
      const lista = acts.filter(a => a.frente === f.id);
      return { frente: f.id, real: prom(lista, a => a.real), programado: prom(lista, programadoHoy), estructura: prom(lista.filter(a => a.estructura), a => a.real) };
    }),
  };
}

export interface ReporteDiario { fecha: string; actividadId: string; antes: number; despues: number; personas: number; nota: string; por: string; }
export const REPORTES_INICIALES: ReporteDiario[] = [
  { fecha: '2026-10-08', actividadId: 'b3', antes: 38, despues: 45, personas: 6, nota: 'Cimbra de la mitad norte terminada', por: 'Residente de obra' },
  { fecha: '2026-10-08', actividadId: 'a4', antes: 20, despues: 25, personas: 4, nota: 'Muro de la recámara principal', por: 'Residente de obra' },
  { fecha: '2026-10-07', actividadId: 'c1', antes: 65, despues: 70, personas: 3, nota: 'Se terminó el armado del vaso de la alberca', por: 'Residente de obra' },
];

// ─────────────────────────────────────────────────────────────────────────
// NÓMINA SEMANAL

export const DIAS = ['Lun 5', 'Mar 6', 'Mié 7', 'Jue 8', 'Vie 9', 'Sáb 10'];
export const DIA_HOY = 4;          // viernes
export const DIA_PRENOMINA = 2;    // la prenómina sale el miércoles
export const DIA_CORTE = 3;        // las faltas hasta el jueves se descuentan esta semana
export type Marca = 'A' | 'F' | null;
export type EstadoTrabajador = 'activo' | 'nuevo' | 'standby' | 'baja';
export interface Trabajador {
  id: string; nombre: string; puesto: string; frente: FrenteId; salarioDiario: number; estado: EstadoTrabajador;
  asistencia: Marca[]; arrastre: number; cuenta: string; nota?: string;
}

export const CUADRILLA_INICIAL: Trabajador[] = [
  { id: 't1', nombre: 'Ramón Cruz', puesto: 'Cabo de obra', frente: 'v1', salarioDiario: 850, estado: 'activo', asistencia: ['A', 'A', 'A', 'A', null, null], arrastre: 0, cuenta: '4521' },
  { id: 't2', nombre: 'José Luis Hernández', puesto: 'Oficial albañil', frente: 'v1', salarioDiario: 650, estado: 'activo', asistencia: ['A', 'A', 'A', 'A', null, null], arrastre: 0, cuenta: '0187' },
  { id: 't3', nombre: 'Miguel García', puesto: 'Oficial albañil', frente: 'v1', salarioDiario: 650, estado: 'activo', asistencia: ['A', 'A', 'A', 'F', null, null], arrastre: 0, cuenta: '7730' },
  { id: 't4', nombre: 'Juan Carlos López', puesto: 'Ayudante', frente: 'v1', salarioDiario: 420, estado: 'activo', asistencia: ['A', 'A', 'A', 'A', null, null], arrastre: 0, cuenta: '3398' },
  { id: 't5', nombre: 'Pedro Ramírez', puesto: 'Ayudante', frente: 'v1', salarioDiario: 420, estado: 'activo', asistencia: ['F', 'F', 'A', 'A', null, null], arrastre: 0, cuenta: '9012' },
  { id: 't6', nombre: 'Andrés Torres', puesto: 'Fierrero', frente: 'v2', salarioDiario: 620, estado: 'activo', asistencia: ['A', 'A', 'A', 'A', null, null], arrastre: 0, cuenta: '5566' },
  { id: 't7', nombre: 'Felipe Martínez', puesto: 'Oficial albañil', frente: 'v2', salarioDiario: 650, estado: 'activo', asistencia: ['A', 'A', 'A', 'A', null, null], arrastre: 650, cuenta: '2241', nota: 'Faltó el sábado pasado' },
  { id: 't8', nombre: 'Rubén Flores', puesto: 'Ayudante', frente: 'v2', salarioDiario: 420, estado: 'activo', asistencia: ['A', 'A', 'A', 'A', null, null], arrastre: 420, cuenta: '6603', nota: 'Faltó el viernes pasado' },
  { id: 't9', nombre: 'Héctor Sánchez', puesto: 'Carpintero', frente: 'v2', salarioDiario: 620, estado: 'activo', asistencia: ['A', 'A', 'A', 'A', null, null], arrastre: 0, cuenta: '1175' },
  { id: 't10', nombre: 'Mario Pérez', puesto: 'Oficial albañil', frente: 'ac', salarioDiario: 650, estado: 'nuevo', asistencia: ['A', 'A', 'A', 'A', null, null], arrastre: 0, cuenta: '8820', nota: 'Alta del lunes' },
  { id: 't11', nombre: 'Daniel Morales', puesto: 'Ayudante', frente: 'ac', salarioDiario: 420, estado: 'nuevo', asistencia: ['A', 'A', 'F', 'A', null, null], arrastre: 0, cuenta: '4409', nota: 'Alta del lunes' },
  { id: 't12', nombre: 'Luis González', puesto: 'Ayudante', frente: 'ac', salarioDiario: 420, estado: 'standby', asistencia: [null, null, null, null, null, null], arrastre: 0, cuenta: '3157', nota: 'En espera desde el lunes' },
  { id: 't13', nombre: 'Saúl Ortiz', puesto: 'Ayudante', frente: 'v2', salarioDiario: 420, estado: 'baja', asistencia: [null, null, null, null, null, null], arrastre: 0, cuenta: '7068', nota: 'No se presentó el lunes; baja' },
];

export interface CalculoNomina {
  bruto: number; faltasSemana: number; descuentoFaltas: number; arrastre: number; neto: number;
  faltasDespuesCorte: number; pasaProxima: number; prenomina: number; diasTrabajados: number;
}

// Regla que contó Jorge: la semana se paga completa y se descuentan las faltas; las del viernes y el
// sábado ya no alcanzan a descontarse antes de dispersar y pasan a la semana siguiente.
export function calcularNomina(t: Trabajador): CalculoNomina {
  if (t.estado === 'baja' || t.estado === 'standby') {
    const dias = t.asistencia.filter(m => m === 'A').length;
    const bruto = dias * t.salarioDiario;
    return { bruto, faltasSemana: 0, descuentoFaltas: 0, arrastre: 0, neto: bruto, faltasDespuesCorte: 0, pasaProxima: 0, prenomina: bruto, diasTrabajados: dias };
  }
  const bruto = 6 * t.salarioDiario;
  const faltasHastaCorte = t.asistencia.slice(0, DIA_CORTE + 1).filter(m => m === 'F').length;
  const faltasHastaMiercoles = t.asistencia.slice(0, DIA_PRENOMINA + 1).filter(m => m === 'F').length;
  const faltasDespuesCorte = t.asistencia.slice(DIA_CORTE + 1).filter(m => m === 'F').length;
  const descuentoFaltas = faltasHastaCorte * t.salarioDiario;
  return {
    bruto, faltasSemana: faltasHastaCorte, descuentoFaltas, arrastre: t.arrastre,
    neto: bruto - descuentoFaltas - t.arrastre,
    faltasDespuesCorte, pasaProxima: faltasDespuesCorte * t.salarioDiario,
    prenomina: bruto - faltasHastaMiercoles * t.salarioDiario - t.arrastre,
    diasTrabajados: t.asistencia.filter(m => m === 'A').length,
  };
}
