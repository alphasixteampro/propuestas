// Recorridos guiados: llevan a la persona paso a paso por un proceso completo. Cada paso cambia solo a
// la persona y la pantalla que tocan, resalta dónde hacer clic y espera a que la acción se haga
// (o la hace con "Hacerlo por mí", útil cuando se presenta en vivo).
import React, { useEffect } from 'react';
import { PlayCircle, X, ChevronLeft, ChevronRight, Wand2, CheckCircle2, MousePointerClick, PenLine } from 'lucide-react';
import { C, Modal, Boton } from './ui';
import { HOY, DIA_HOY, lineaDe, num, money, calcularNomina, EstadoLinea, FrenteId, Requisicion, Trabajador } from './datos';
import { totalesNomina } from './nomina';
import { Pantalla } from './celular';
import { Accion, Estado, Rol, Seccion } from './estado';

export interface ContextoRecorrido {
  estado: Estado; presupuesto: EstadoLinea[]; reqId: string; enLinea: boolean; cola: Accion[];
}
export interface Preparar {
  rol: Rol; seccion: Seccion; recepcion?: string; frentePresupuesto?: FrenteId | 'todos'; pantallaCelular?: Pantalla;
}
export interface Paso {
  titulo: string;
  texto: (c: ContextoRecorrido) => string;
  preparar: (c: ContextoRecorrido) => Preparar;
  objetivo?: (c: ContextoRecorrido) => string;
  // Dónde tiene que escribir o tocar la persona, en orden. Se señala el primero que aún falta.
  senalar?: (c: ContextoRecorrido) => Senal[];
  listo?: (c: ContextoRecorrido) => boolean;
  hecho?: (c: ContextoRecorrido) => string;
  hacer?: (c: ContextoRecorrido) => Accion;
}
export interface Recorrido { id: string; titulo: string; descripcion: string; duracion: string; pasos: Paso[]; }

// Un botón, campo o lista donde hay que actuar. "conTexto" distingue botones con el mismo selector.
export interface Senal {
  selector: string; conTexto?: string; accion: 'tocar' | 'escribir' | 'elegir'; texto?: string;
  listo?: () => boolean;
}

// Con un modal abierto solo se busca dentro de él: lo de atrás no se puede tocar.
function modalAbierto(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[role="dialog"]:not([data-recorrido])');
}
export function elemento(selector: string, conTexto?: string): HTMLElement | null {
  const raiz = modalAbierto() ?? document;
  return Array.from(raiz.querySelectorAll<HTMLElement>(selector))
    .find(el => (!conTexto || (el.textContent ?? '').includes(conTexto)) && el.getClientRects().length > 0) ?? null;
}
const valor = (selector: string) => (elemento(selector) as HTMLInputElement | null)?.value ?? '';
const CON_SENAL: Senal = { selector: '[data-tour="senal"] button', conTexto: 'Con señal', accion: 'tocar' };

const reqDe =(c: ContextoRecorrido): Requisicion | undefined => c.estado.reqs.find(r => r.id === c.reqId);

// ─────────────────────────────────────────────────────────────────────────
// RECORRIDO 1: pedir y gestionar materiales en la obra

const MATERIALES: Recorrido = {
  id: 'materiales',
  titulo: 'Pedir y gestionar materiales en la obra',
  descripcion: 'Un pedido de 10 bultos de cemento desde que el residente lo pide hasta que se descuenta del presupuesto.',
  duracion: '9 pasos · unos 3 minutos',
  pasos: [
    {
      titulo: 'Seguir un pedido de principio a fin',
      texto: () => 'Vamos a seguir 10 bultos de cemento para la Villa 1. El residente los pide desde la obra, usted los aprueba, compras los compra, llegan a la obra y se descuentan solos del presupuesto. En cada paso la demo cambia sola a la persona que corresponde.',
      preparar: () => ({ rol: 'director', seccion: 'inicio' }),
    },
    {
      titulo: 'El residente pide desde el celular',
      texto: c => c.cola.length
        ? 'El pedido quedó guardado en el teléfono porque no hay señal. Toque "Con señal" a la derecha para enviarlo a la oficina.'
        : 'Así lo ve el residente en obra. Ya están elegidos Cemento y Villa 1: escriba 10 en "Cantidad" y toque "Enviar pedido". Debajo del material se ve cuánto queda en el presupuesto antes de pedir.',
      preparar: () => ({ rol: 'residente', seccion: 'campo' }),
      objetivo: () => 'celular',
      senalar: c => c.cola.length ? [CON_SENAL] : [
        { selector: '[data-tour="celular"] #can-0', accion: 'escribir', texto: 'Escriba 10', listo: () => Number(valor('[data-tour="celular"] #can-0')) > 0 },
        { selector: '[data-tour="celular"] button', conTexto: 'Enviar pedido', accion: 'tocar' },
      ],
      listo: c => !!reqDe(c),
      hecho: c => `Listo: se creó el pedido ${c.reqId} y ya le llegó a usted para aprobar.`,
      hacer: () => ({ tipo: 'crear-req', items: [{ insumoId: 'cem', frente: 'v1', cantidad: 10 }], nota: 'Colado de castillos', solicitante: 'Residente de obra', origen: 'celular' }),
    },
    {
      titulo: 'Y si en la obra no hay señal',
      texto: c => c.cola.length
        ? 'El pedido quedó guardado en el teléfono. Toque "Con señal" y verá cómo se envía solo a la oficina.'
        : 'En la obra casi no hay internet. Si toca "Sin señal" y hace un pedido, se guarda en el teléfono y se envía solo cuando vuelve la conexión. Nada se pierde. Puede probarlo ahora o seguir.',
      preparar: () => ({ rol: 'residente', seccion: 'campo' }),
      objetivo: () => 'senal',
      senalar: c => (c.cola.length ? [CON_SENAL] : []),
      listo: c => c.cola.length === 0,
    },
    {
      titulo: 'Usted revisa antes de aprobar',
      texto: () => 'Los pedidos le llegan con cuánto queda de cada material en el presupuesto. Si un pedido se pasa, la IA lo marca antes de que usted apruebe y le dice por qué conviene preguntar, como aquí con el pedido REQ-036.',
      preparar: () => ({ rol: 'director', seccion: 'materiales' }),
      objetivo: () => 'alerta-ia',
    },
    {
      titulo: 'Aprobar con un clic',
      texto: c => `Este es el pedido del residente. Revise que queda presupuesto suficiente y toque "Aprobar" en el pedido ${c.reqId}.`,
      preparar: () => ({ rol: 'director', seccion: 'materiales' }),
      objetivo: c => `req-${c.reqId}`,
      senalar: c => [{ selector: `[data-tour="req-${c.reqId}"] button`, conTexto: 'Aprobar', accion: 'tocar' }],
      listo: c => !!reqDe(c) && reqDe(c)!.estado !== 'por-aprobar',
      hecho: () => 'Aprobado. Compras ya lo tiene en su bandeja.',
      hacer: c => ({ tipo: 'aprobar-req', id: c.reqId }),
    },
    {
      titulo: 'Compras genera la orden de compra',
      texto: c => `Ahora lo ve compras. Toque "Comprar" en ${c.reqId}, elija el proveedor y escriba el precio de la cotización. Si sale más caro que el presupuesto, el sistema lo avisa. Después toque "Generar orden de compra".`,
      preparar: () => ({ rol: 'compras', seccion: 'materiales' }),
      objetivo: c => `req-${c.reqId}`,
      senalar: c => [
        { selector: `[data-tour="req-${c.reqId}"] button`, conTexto: 'Comprar', accion: 'tocar' },
        { selector: 'button', conTexto: 'Generar orden de compra', accion: 'tocar' },
      ],
      listo: c => ['en-camino', 'incompleta', 'recibida'].includes(reqDe(c)?.estado ?? ''),
      hecho: c => `Orden ${reqDe(c)?.oc ?? ''} generada para ${reqDe(c)?.proveedor ?? 'el proveedor'}. La obra ya ve que viene en camino.`,
      hacer: c => ({ tipo: 'comprar-req', id: c.reqId, proveedor: 'Materiales La Villa', precios: [262], fechaEntrega: HOY }),
    },
    {
      titulo: 'Llega el camión a la obra',
      texto: () => 'El residente toca "Foto de la remisión" y la IA llena lo que llegó. Para ver qué pasa cuando falta algo, cambie la cantidad a 8 y toque "Confirmar recepción".',
      preparar: c => ({ rol: 'residente', seccion: 'recepcion', recepcion: c.reqId }),
      objetivo: () => 'form-recepcion',
      senalar: c => {
        const cantidad = `#rec-${c.reqId}-0`;
        return [
          { selector: '[data-tour="form-recepcion"] button', conTexto: 'Foto de la remisión', accion: 'tocar', listo: () => valor(cantidad) !== '' },
          { selector: cantidad, accion: 'escribir', texto: 'Cambie a 8', listo: () => valor(cantidad) === '8' },
          { selector: '[data-tour="form-recepcion"] button', conTexto: 'Confirmar recepción', accion: 'tocar' },
        ];
      },
      listo: c => (reqDe(c)?.recepciones.length ?? 0) > 0,
      hecho: c => {
        const it = reqDe(c)?.items[0];
        return it && it.recibido < it.cantidad
          ? `Llegaron ${num(it.recibido)} de ${num(it.cantidad)}. Lo que faltó le queda avisado a compras.`
          : 'Llegó completo y quedó registrado con la foto de la remisión.';
      },
      hacer: c => ({ tipo: 'recibir-req', id: c.reqId, cantidades: [8], nota: 'Llegaron 8 de 10 bultos según la remisión', conFoto: true, por: 'Residente de obra' }),
    },
    {
      titulo: 'Se descuenta solo del presupuesto',
      texto: c => {
        const l = lineaDe(c.presupuesto, 'cem', 'v1');
        return `El cemento de la Villa 1 ya cuenta lo que llegó: ${num(l.recibido)} bultos recibidos, ${num(l.porRecibir)} por llegar y ${num(l.disponible)} libres de ${num(l.presupuestado)}. Nadie tuvo que actualizar el Excel ni avisarle a presupuestos.`;
      },
      preparar: () => ({ rol: 'director', seccion: 'presupuesto', frentePresupuesto: 'v1' }),
      objetivo: () => 'insumo-cem',
    },
    {
      titulo: 'Lo que faltó no se pierde',
      texto: c => {
        const r = reqDe(c);
        return r?.estado === 'incompleta'
          ? `Como llegaron solo 8 bultos, la orden ${r.oc} aparece en "Para hoy" como entrega incompleta. Ahí sigue, igual que en la bandeja de compras, hasta que llegue lo que falta. Fin del recorrido.`
          : 'Todo quedó registrado: quién pidió, quién aprobó, a qué precio se compró y qué llegó. Si una entrega llega incompleta, aparece aquí en "Para hoy". Fin del recorrido.';
      },
      preparar: () => ({ rol: 'director', seccion: 'inicio' }),
      objetivo: () => 'para-hoy',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────
// RECORRIDO 2: la nómina de la semana

const enObra = (c: ContextoRecorrido): Trabajador[] => c.estado.cuadrilla.filter(t => t.estado === 'activo' || t.estado === 'nuevo');
const trabajador = (c: ContextoRecorrido, id: string): Trabajador | undefined => c.estado.cuadrilla.find(t => t.id === id);
// Quien faltó hoy viernes: con esa persona se explica la falta que pasa a la semana siguiente.
const faltoHoy = (c: ContextoRecorrido): Trabajador | undefined => enObra(c).find(t => t.asistencia[DIA_HOY] === 'F');
const listaGuardada = (c: ContextoRecorrido) => enObra(c).every(t => t.asistencia[DIA_HOY] !== null);
const listaEnTelefono = (c: ContextoRecorrido) => c.cola.some(a => a.tipo === 'pasar-lista');
const ESTADO_TEXTO = { activo: 'Activo', nuevo: 'Nuevo', standby: 'En espera', baja: 'Baja' } as const;

const NOMINA: Recorrido = {
  id: 'nomina',
  titulo: 'La nómina de la semana',
  descripcion: 'Del pase de lista en la obra al archivo del banco, con las faltas descontadas solas.',
  duracion: '9 pasos · unos 3 minutos',
  pasos: [
    {
      titulo: 'Una semana de nómina sin hojas a mano',
      texto: () => 'Hoy es viernes 9. El lunes se dieron altas y bajas, cada día se pasó lista en la obra y el miércoles salió la prenómina. Vamos a cerrar la semana: pasar la lista de hoy, revisar los descuentos y armar el archivo del banco. En cada paso la demo cambia sola a la persona que corresponde.',
      preparar: () => ({ rol: 'director', seccion: 'inicio' }),
    },
    {
      titulo: 'El residente pasa lista desde el celular',
      texto: c => listaEnTelefono(c)
        ? 'La lista quedó guardada en el teléfono porque no hay señal. Toque "Con señal" a la derecha y se envía sola a recursos humanos.'
        : 'Todos empiezan como presentes. Toque a Juan Carlos López para marcar que hoy faltó y después "Guardar pase de lista". Funciona igual sin señal: no hace falta el reloj checador.',
      preparar: () => ({ rol: 'residente', seccion: 'campo', pantallaCelular: 'lista' }),
      objetivo: c => (listaEnTelefono(c) ? 'senal' : 'celular'),
      senalar: c => listaEnTelefono(c) ? [CON_SENAL] : [
        {
          selector: '[data-tour="celular"] button', conTexto: 'Juan Carlos López', accion: 'tocar', texto: 'Toque a Juan Carlos',
          listo: () => (elemento('[data-tour="celular"] button', 'Juan Carlos López')?.textContent ?? '').includes('Faltó'),
        },
        { selector: '[data-tour="celular"] button', conTexto: 'Guardar pase de lista', accion: 'tocar' },
      ],
      listo: listaGuardada,
      hecho: c => {
        const faltas = enObra(c).filter(t => t.asistencia[DIA_HOY] === 'F').length;
        return `Lista de hoy guardada: ${enObra(c).length - faltas} presentes y ${faltas} ${faltas === 1 ? 'falta' : 'faltas'}. Recursos humanos ya la ve.`;
      },
      hacer: c => ({ tipo: 'pasar-lista', dia: DIA_HOY, marcas: Object.fromEntries(enObra(c).map(t => [t.id, t.id === 't4' ? 'F' : 'A'])) as Record<string, 'A' | 'F'> }),
    },
    {
      titulo: 'Recursos humanos ve la semana completa',
      texto: c => {
        const t = faltoHoy(c);
        if (!t) return 'Cada día llega del celular del residente: ✓ asistió, F faltó. Si hubo un error, recursos humanos toca el día y lo corrige.';
        return `${t.nombre} faltó hoy viernes. Como la nómina se paga hoy, esa falta ya no alcanza a descontarse: los ${money(calcularNomina(t).pasaProxima)} pasan solos a la semana siguiente. Hoy eso se lleva a mano; aquí nadie tiene que acordarse.`;
      },
      preparar: () => ({ rol: 'rrhh', seccion: 'nomina' }),
      objetivo: c => `trab-${faltoHoy(c)?.id ?? 't3'}`,
    },
    {
      titulo: 'Altas, bajas y gente en espera',
      texto: () => 'Luis González está "En espera" desde el lunes: no se le paga hasta que regrese. Si ya no va a volver, cámbielo a "Baja" en la columna Estado. Los nuevos se dan de alta con el botón "Dar de alta" y aparecen solos en la lista del residente.',
      preparar: () => ({ rol: 'rrhh', seccion: 'nomina' }),
      objetivo: () => 'trab-t12',
      senalar: () => [{ selector: 'select[aria-label="Estado de Luis González"]', accion: 'elegir', texto: 'Elija "Baja"' }],
      listo: c => trabajador(c, 't12')?.estado !== 'standby',
      hecho: c => `Luis González quedó como "${ESTADO_TEXTO[trabajador(c, 't12')!.estado]}".`,
      hacer: () => ({ tipo: 'estado-trabajador', id: 't12', estado: 'baja' }),
    },
    {
      titulo: 'La prenómina del miércoles y el ajuste',
      texto: c => {
        const t = totalesNomina(c.estado.cuadrilla);
        return `El miércoles salió la prenómina por ${money(t.prenomina)}: ya descontaba las faltas de lunes a miércoles y las de la semana pasada (Felipe Martínez faltó el sábado y Rubén Flores el viernes). Con las faltas del jueves, lo que se paga hoy es ${money(t.neto)}.`;
      },
      preparar: () => ({ rol: 'rrhh', seccion: 'nomina' }),
      objetivo: () => 'kpis-nomina',
    },
    {
      titulo: 'La IA revisa la semana antes de pagar',
      texto: () => 'Antes de pagar, la IA avisa lo que conviene revisar: quién acumula faltas, a quién se le descuenta algo de la semana pasada y quién sigue en espera. Es lo que hoy alguien tiene que ir buscando en la hoja.',
      preparar: () => ({ rol: 'rrhh', seccion: 'nomina' }),
      objetivo: () => 'ia-nomina',
    },
    {
      titulo: 'El archivo para el banco, en un clic',
      texto: () => 'Toque "Generar archivo del banco". Sale el pago de cada persona con su cuenta, listo para subirlo al banco. Revise el total y toque "Descargar archivo".',
      preparar: () => ({ rol: 'rrhh', seccion: 'nomina' }),
      objetivo: () => 'btn-banco',
      senalar: () => [
        { selector: '[data-tour="btn-banco"] button', conTexto: 'Generar archivo del banco', accion: 'tocar' },
        { selector: 'button', conTexto: 'Descargar archivo', accion: 'tocar' },
      ],
      listo: c => c.estado.dispersada,
      hecho: c => `Archivo generado por ${money(totalesNomina(c.estado.cuadrilla).neto)}. Ya no hay que capturar los pagos uno por uno en el banco.`,
      hacer: () => ({ tipo: 'dispersar' }),
    },
    {
      titulo: 'Usted ve el resultado sin pedirlo',
      texto: c => {
        const t = totalesNomina(c.estado.cuadrilla);
        return `Como director ve la misma nómina: ${t.personas} personas, ${money(t.neto)} a pagar y ${money(t.pasaProxima)} que se descuentan la próxima semana. También le puede preguntar al Asistente IA "¿Quién faltó esta semana?".`;
      },
      preparar: () => ({ rol: 'director', seccion: 'nomina' }),
      objetivo: () => 'kpis-nomina',
    },
    {
      titulo: 'Lo que cambia para su equipo',
      texto: () => 'La asistencia llega sola de la obra, aunque no haya internet. Los descuentos de las faltas, incluidas las de viernes y sábado, se calculan solos. Y el archivo del banco sale en un clic. Fin del recorrido.',
      preparar: () => ({ rol: 'director', seccion: 'nomina' }),
    },
  ],
};

export const RECORRIDOS: Recorrido[] = [MATERIALES, NOMINA];

// ─────────────────────────────────────────────────────────────────────────
// PANEL DEL RECORRIDO Y RESALTADO

// Resalta el elemento del paso y lo trae a la vista. Vuelve a buscarlo mientras el paso está activo,
// porque algunas pantallas aparecen un instante después de cambiar de persona o de sección.
function useResaltar(objetivo: string | undefined) {
  useEffect(() => {
    if (!objetivo) return;
    let actual: HTMLElement | null = null;
    const buscar = () => {
      const el = document.querySelector<HTMLElement>(`[data-tour="${objetivo}"]`);
      if (el && el !== actual) {
        actual?.classList.remove('tour-foco');
        actual = el;
        el.classList.add('tour-foco');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
    const t0 = window.setTimeout(buscar, 120);
    const t = window.setInterval(buscar, 400);
    return () => { window.clearTimeout(t0); window.clearInterval(t); actual?.classList.remove('tour-foco'); };
  }, [objetivo]);
}

export const ESTILOS_RECORRIDO = `
tr.tour-foco td { background: #e6faf6; }
.tour-foco { position: relative; z-index: 5; outline: 3px solid #00bfa5 !important; outline-offset: 4px; animation: tourPulso 1.6s ease-in-out infinite; }
@keyframes tourPulso { 0%, 100% { box-shadow: 0 0 0 0 rgba(0,191,165,.35); } 50% { box-shadow: 0 0 0 12px rgba(0,191,165,0); } }
.tour-accion { position: relative; z-index: 6; outline: 3px solid #f59e0b !important; outline-offset: 3px; animation: tourAccion 1.1s ease-in-out infinite; }
@keyframes tourAccion { 0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,.55); } 50% { box-shadow: 0 0 0 10px rgba(245,158,11,0); } }
@keyframes tourFlecha { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes tourFlechaAbajo { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
`;

interface Marca { x: number; y: number; abajo: boolean; texto: string; accion: Senal['accion']; }
const TEXTO_ACCION: Record<Senal['accion'], string> = { tocar: 'Toque aquí', escribir: 'Escriba aquí', elegir: 'Elija aquí' };

// Señala el botón o campo donde hay que actuar: lo resalta en ámbar y le pone una etiqueta encima.
// Revisa seguido porque la acción siguiente aparece después de la anterior (un modal, un botón que se activa).
function useSenalar(senales: Senal[], clave: string): Marca | null {
  const ref = React.useRef(senales);
  ref.current = senales;
  const [marca, setMarca] = React.useState<Marca | null>(null);
  useEffect(() => {
    let actual: HTMLElement | null = null;
    const revisar = () => {
      let el: HTMLElement | null = null, senal: Senal | null = null;
      for (const s of ref.current) {
        const e = elemento(s.selector, s.conTexto);
        if (e && !s.listo?.()) { el = e; senal = s; break; }
      }
      if (el !== actual) {
        actual?.classList.remove('tour-accion');
        actual = el;
        if (el) { el.classList.add('tour-accion'); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      }
      if (!el || !senal) { setMarca(m => (m ? null : m)); return; }
      const r = el.getBoundingClientRect();
      const abajo = r.top < 150;
      const x = Math.round(Math.min(window.innerWidth - 80, Math.max(80, r.left + r.width / 2)));
      const y = Math.round(abajo ? r.bottom + 10 : r.top - 10);
      const texto = senal.texto ?? TEXTO_ACCION[senal.accion];
      setMarca(m => (m && m.x === x && m.y === y && m.texto === texto && m.abajo === abajo ? m : { x, y, abajo, texto, accion: senal!.accion }));
    };
    revisar();
    const t = window.setInterval(revisar, 200);
    return () => { window.clearInterval(t); actual?.classList.remove('tour-accion'); setMarca(null); };
  }, [clave]);
  return marca;
}

function EtiquetaAccion({ marca }: { marca: Marca }) {
  const Icono = marca.accion === 'escribir' ? PenLine : MousePointerClick;
  return (
    <div aria-hidden="true" className="no-print" style={{
      position: 'fixed', left: marca.x, top: marca.y, transform: `translate(-50%, ${marca.abajo ? '0' : '-100%'})`,
      zIndex: 95, pointerEvents: 'none', transition: 'left .15s, top .15s',
    }}>
      <div style={{ display: 'flex', flexDirection: marca.abajo ? 'column-reverse' : 'column', alignItems: 'center', animation: `${marca.abajo ? 'tourFlechaAbajo' : 'tourFlecha'} 1s ease-in-out infinite` }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f59e0b', color: '#1f1300', fontWeight: 800, fontSize: 13, padding: '6px 12px', borderRadius: 999, whiteSpace: 'nowrap', boxShadow: '0 6px 16px rgba(0,0,0,.25)' }}>
          <Icono size={15} /> {marca.texto}
        </span>
        <span style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', ...(marca.abajo ? { borderBottom: '9px solid #f59e0b' } : { borderTop: '9px solid #f59e0b' }) }} />
      </div>
    </div>
  );
}

export function PanelRecorrido({ recorrido, indice, contexto, onIr, onHacer, onSalir }: {
  recorrido: Recorrido; indice: number; contexto: ContextoRecorrido;
  onIr: (i: number) => void; onHacer: (a: Accion) => void; onSalir: () => void;
}) {
  const paso = recorrido.pasos[indice];
  const objetivo = paso.objetivo?.(contexto);
  useResaltar(objetivo);
  const listo = paso.listo ? paso.listo(contexto) : true;
  const ultimo = indice === recorrido.pasos.length - 1;
  const total = recorrido.pasos.length;
  const marca = useSenalar(!listo && paso.senalar ? paso.senalar(contexto) : [], `${recorrido.id}-${indice}`);

  return (
    <>
    {marca && <EtiquetaAccion marca={marca} />}
    <div role="dialog" data-recorrido aria-label={`Recorrido: ${recorrido.titulo}`} className="no-print fixed bottom-3 left-3 right-3 lg:right-auto lg:left-[264px] lg:w-[420px]" style={{
      zIndex: 80, background: C.paper, borderRadius: 14, border: `2px solid ${C.teal}`, boxShadow: '0 16px 44px rgba(10,35,66,.32)', padding: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: C.tealDark, letterSpacing: 0.3 }}>RECORRIDO · PASO {indice + 1} DE {total}</span>
        <button type="button" onClick={onSalir} aria-label="Salir del recorrido" style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', minHeight: 32, minWidth: 32 }}><X size={18} /></button>
      </div>
      <div aria-hidden="true" style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
        {recorrido.pasos.map((_, i) => <span key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= indice ? C.teal : C.surfaceStrong }} />)}
      </div>
      <p style={{ margin: 0, fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 16, color: C.ink }}>{paso.titulo}</p>
      <p style={{ margin: '6px 0 0', fontSize: 14, color: C.ink, lineHeight: 1.5 }}>{paso.texto(contexto)}</p>
      {paso.listo && listo && paso.hecho && (
        <p style={{ margin: '10px 0 0', fontSize: 13, color: C.green, fontWeight: 700, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
          <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 1 }} /> {paso.hecho(contexto)}
        </p>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
        <Boton variante="secundario" onClick={() => onIr(indice - 1)} disabled={indice === 0}><ChevronLeft size={16} /> Atrás</Boton>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {paso.hacer && !listo && <Boton variante="secundario" onClick={() => onHacer(paso.hacer!(contexto))}><Wand2 size={16} /> Hacerlo por mí</Boton>}
          {ultimo
            ? <Boton onClick={onSalir}>Terminar</Boton>
            : <Boton onClick={() => onIr(indice + 1)} disabled={!listo} titulo={!listo ? 'Haga la acción del paso o toque "Hacerlo por mí"' : undefined}>Siguiente <ChevronRight size={16} /></Boton>}
        </div>
      </div>
    </div>
    </>
  );
}

export function TarjetaRecorridos({ onEmpezar }: { onEmpezar: (id: string) => void }) {
  return (
    <div data-tour="recorridos" style={{ background: 'linear-gradient(135deg, #eefbf8, #eef5fb)', border: '1px solid #b9e7df', borderRadius: 12, padding: 16 }}>
      <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 800, color: C.tealDark, letterSpacing: 0.3 }}>RECORRIDOS GUIADOS</p>
      <p style={{ margin: '0 0 12px', fontSize: 14, color: C.ink }}>La demo le muestra paso a paso cómo funciona cada proceso. Usted hace los clics o deja que la demo los haga por usted.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {RECORRIDOS.map(r => (
          <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10, padding: 12 }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{r.titulo}</p>
              <p style={{ margin: '2px 0 0', fontSize: 13, color: C.muted }}>{r.descripcion} {r.duracion}.</p>
            </div>
            <Boton onClick={() => onEmpezar(r.id)}><PlayCircle size={16} /> Empezar</Boton>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ModalRecorridos({ onEmpezar, onCerrar }: { onEmpezar: (id: string) => void; onCerrar: () => void }) {
  return (
    <Modal titulo="Recorridos guiados" subtitulo="Elija un proceso y la demo lo lleva paso a paso." onCerrar={onCerrar} ancho={620}>
      <TarjetaRecorridos onEmpezar={id => { onCerrar(); onEmpezar(id); }} />
    </Modal>
  );
}
