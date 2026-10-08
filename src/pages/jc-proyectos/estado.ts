// Estado de la demo y las acciones que lo cambian. Las acciones que nacen en la obra (pedir, recibir,
// pasar lista, reportar avance) se pueden guardar en el celular sin señal y aplicarse al volver la conexión.
import {
  HOY, ACTIVIDADES_INICIALES, CUADRILLA_INICIAL, REQS_INICIALES, REPORTES_INICIALES,
  Actividad, EstadoTrabajador, FrenteId, Marca, ReporteDiario, Requisicion, Trabajador,
} from './datos';

export type Seccion = 'inicio' | 'campo' | 'materiales' | 'recepcion' | 'presupuesto' | 'nomina' | 'programa' | 'asistente';

export type Rol = 'director' | 'residente' | 'compras' | 'rrhh' | 'presupuestos';
export interface Persona { id: Rol; nombre: string; cargo: string; }
export const PERSONAS: Persona[] = [
  { id: 'director', nombre: 'Jorge Casañas', cargo: 'Director general' },
  { id: 'residente', nombre: 'Residente de obra', cargo: 'Residente de obra' },
  { id: 'compras', nombre: 'Compras', cargo: 'Compras' },
  { id: 'rrhh', nombre: 'Recursos humanos', cargo: 'Recursos humanos' },
  { id: 'presupuestos', nombre: 'Control de presupuesto', cargo: 'Control de presupuesto' },
];
export const SECCIONES_POR_ROL: Record<Rol, Seccion[]> = {
  director: ['inicio', 'campo', 'materiales', 'recepcion', 'presupuesto', 'nomina', 'programa', 'asistente'],
  residente: ['inicio', 'campo', 'materiales', 'recepcion', 'programa', 'asistente'],
  compras: ['inicio', 'materiales', 'recepcion', 'presupuesto', 'asistente'],
  rrhh: ['inicio', 'campo', 'nomina', 'asistente'],
  presupuestos: ['inicio', 'materiales', 'presupuesto', 'programa', 'asistente'],
};
export const QUE_HACE: Record<Rol, string> = {
  director: 'Ve todo, aprueba los pedidos de material y recibe el reporte ejecutivo.',
  residente: 'Pide material, recibe lo que llega, pasa lista y reporta el avance desde el celular.',
  compras: 'Compra lo aprobado, elige proveedor y genera la orden de compra.',
  rrhh: 'Lleva altas, bajas y asistencia, revisa la prenómina y arma el archivo del banco.',
  presupuestos: 'Carga la explosión de insumos de Opus y vigila cuánto queda de cada insumo.',
};

export interface Estado {
  reqs: Requisicion[];
  cuadrilla: Trabajador[];
  actividades: Actividad[];
  reportes: ReporteDiario[];
  dispersada: boolean;
  consecutivoReq: number;
  consecutivoOC: number;
}

export const ESTADO_INICIAL: Estado = {
  reqs: REQS_INICIALES, cuadrilla: CUADRILLA_INICIAL, actividades: ACTIVIDADES_INICIALES, reportes: REPORTES_INICIALES,
  dispersada: false, consecutivoReq: 37, consecutivoOC: 22,
};

export type Accion =
  | { tipo: 'crear-req'; items: { insumoId: string; frente: FrenteId; cantidad: number }[]; nota: string; solicitante: string; origen: 'celular' | 'oficina' }
  | { tipo: 'aprobar-req'; id: string }
  | { tipo: 'rechazar-req'; id: string; comentario: string }
  | { tipo: 'comprar-req'; id: string; proveedor: string; precios: number[]; fechaEntrega: string }
  | { tipo: 'recibir-req'; id: string; cantidades: number[]; nota: string; conFoto: boolean; por: string }
  | { tipo: 'pasar-lista'; dia: number; marcas: Record<string, 'A' | 'F'> }
  | { tipo: 'marcar'; trabajadorId: string; dia: number; valor: Marca }
  | { tipo: 'estado-trabajador'; id: string; estado: EstadoTrabajador }
  | { tipo: 'alta'; nombre: string; puesto: string; frente: FrenteId; salarioDiario: number }
  | { tipo: 'dispersar' }
  | { tipo: 'avance'; actividadId: string; avance: number; personas: number; nota: string; por: string };

export function reducer(s: Estado, a: Accion): Estado {
  switch (a.tipo) {
    case 'crear-req': {
      const id = `REQ-${String(s.consecutivoReq).padStart(3, '0')}`;
      const nueva: Requisicion = {
        id, fecha: HOY, solicitante: a.solicitante, origen: a.origen, nota: a.nota, estado: 'por-aprobar', recepciones: [],
        items: a.items.map(it => ({ ...it, recibido: 0 })),
      };
      return { ...s, reqs: [...s.reqs, nueva], consecutivoReq: s.consecutivoReq + 1 };
    }
    case 'aprobar-req':
      return { ...s, reqs: s.reqs.map(r => r.id === a.id ? { ...r, estado: 'por-comprar' } : r) };
    case 'rechazar-req':
      return { ...s, reqs: s.reqs.map(r => r.id === a.id ? { ...r, estado: 'rechazada', comentario: a.comentario } : r) };
    case 'comprar-req': {
      const oc = `OC-${String(s.consecutivoOC).padStart(3, '0')}`;
      return {
        ...s, consecutivoOC: s.consecutivoOC + 1,
        reqs: s.reqs.map(r => r.id === a.id ? {
          ...r, estado: 'en-camino', proveedor: a.proveedor, oc, fechaEntrega: a.fechaEntrega,
          items: r.items.map((it, i) => ({ ...it, precioCompra: a.precios[i] })),
        } : r),
      };
    }
    case 'recibir-req':
      return {
        ...s, reqs: s.reqs.map(r => {
          if (r.id !== a.id) return r;
          const items = r.items.map((it, i) => ({ ...it, recibido: Math.min(it.cantidad, it.recibido + (a.cantidades[i] || 0)) }));
          const completa = items.every(it => it.recibido >= it.cantidad);
          return { ...r, items, estado: completa ? 'recibida' : 'incompleta', recepciones: [...r.recepciones, { fecha: HOY, por: a.por, nota: a.nota, conFoto: a.conFoto }] };
        }),
      };
    case 'pasar-lista':
      return {
        ...s, cuadrilla: s.cuadrilla.map(t => a.marcas[t.id] ? { ...t, asistencia: t.asistencia.map((m, i) => i === a.dia ? a.marcas[t.id] : m) } : t),
      };
    case 'marcar':
      return { ...s, cuadrilla: s.cuadrilla.map(t => t.id === a.trabajadorId ? { ...t, asistencia: t.asistencia.map((m, i) => i === a.dia ? a.valor : m) } : t) };
    case 'estado-trabajador':
      return { ...s, cuadrilla: s.cuadrilla.map(t => t.id === a.id ? { ...t, estado: a.estado } : t) };
    case 'alta': {
      const nuevo: Trabajador = {
        id: `t${s.cuadrilla.length + 1}-${a.nombre}`, nombre: a.nombre, puesto: a.puesto, frente: a.frente, salarioDiario: a.salarioDiario,
        estado: 'nuevo', asistencia: [null, null, null, null, null, null], arrastre: 0, cuenta: 'por capturar', nota: 'Alta de hoy',
      };
      return { ...s, cuadrilla: [...s.cuadrilla, nuevo] };
    }
    case 'dispersar':
      return { ...s, dispersada: true };
    case 'avance': {
      const act = s.actividades.find(x => x.id === a.actividadId)!;
      return {
        ...s,
        actividades: s.actividades.map(x => x.id === a.actividadId ? { ...x, real: a.avance } : x),
        reportes: [{ fecha: HOY, actividadId: a.actividadId, antes: act.real, despues: a.avance, personas: a.personas, nota: a.nota, por: a.por }, ...s.reportes],
      };
    }
  }
}

// Texto corto de cada acción guardada en el celular mientras no hay señal.
export function describirAccion(a: Accion): string {
  switch (a.tipo) {
    case 'crear-req': return `Pedido de ${a.items.length} material${a.items.length === 1 ? '' : 'es'}`;
    case 'recibir-req': return `Recepción de ${a.id}`;
    case 'pasar-lista': return 'Pase de lista del día';
    case 'avance': return 'Reporte de avance';
    default: return 'Registro';
  }
}
