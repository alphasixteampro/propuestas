import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, ChevronDown, Clock, Calendar, MapPin, Info, Quote,
  ArrowRight, ArrowDown, ClipboardList, Database, MessagesSquare, BellRing, KeyRound,
  BarChart3, Building2, Inbox, UserCheck, Lock, Hammer, Boxes, Users, Ruler,
  CreditCard, ShieldCheck, FileText, Zap, AlertCircle, Target, Hand, Sparkles,
  Phone, Coins, Bot, Video, Wrench, Star, Gift, Layers, ListChecks,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────
// En los textos, **palabra** se resalta con rich()

const META = {
  cliente: 'Constructora Meetrico',
  contacto: 'Julián Valencia',
  sede: 'Caicedonia, Valle del Cauca',
  fecha: 'Octubre 2026',
  duracion: 'Plan mensual Sixteam Ops',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  elaboradaPor: 'Ernesto Hernández',
  cargo: 'Gerente Comercial Sixteam.pro',
};

// El logo de Meetrico es blanco y sin color de marca: usamos un tono ladrillo como acento
const MEE = '#f28c38';

// Datos que Julián compartió en la reunión del 14 de octubre de 2026
const CIFRAS = [
  { v: '3', l: 'torres', sub: 'en 6 años' },
  { v: '40', l: 'apartamentos', sub: 'por torre' },
  { v: '18', l: 'por vender', sub: 'en las torres A y B' },
  { v: '49', l: 'pasos', sub: 'del interés a la entrega' },
];

const HALLAZGOS = [
  {
    titulo: 'Todo pasa por sus manos',
    desc: 'El proceso es **muy manual** y depende de una sola persona.',
    cita: 'Hemos hecho todo como muy manual.',
    icon: Hand, color: '#f87171',
  },
  {
    titulo: 'Interesados sin registro',
    desc: 'Hoy no se sabe **cuántos interesados llegan** ni **por qué canal**.',
    cita: 'No, pues la verdad no.',
    icon: Users, color: '#fbbf24',
  },
  {
    titulo: '49 pasos sin control digital',
    desc: 'Separación, cartera, promesa, crédito, subsidio y escritura **sin un solo lugar** donde seguirlos.',
    cita: 'Desde que llega un cliente hasta que se le entrega su vivienda.',
    icon: ClipboardList, color: '#f87171',
  },
  {
    titulo: 'La sala de ventas vuelve',
    desc: 'Reabre en el **apartamento modelo**, con **Jennifer** como asesora y pauta digital.',
    cita: 'Que ella se encargue de todo.',
    icon: Sparkles, color: '#00bfa5',
  },
];

// Recorrido del cliente dentro del sistema
const FLUJO = [
  {
    titulo: 'Llegan',
    sub: 'Todos los canales',
    color: '#60a5fa',
    items: ['WhatsApp', 'Instagram', 'Facebook', 'TikTok', 'Pauta digital', 'Referidos', 'Sala de ventas'],
    chips: true,
  },
  {
    titulo: 'Se deciden',
    sub: 'Con seguimiento',
    color: '#00bfa5',
    items: ['Interesado', 'Cita agendada', 'Visita al modelo', 'Separación'],
    chips: false,
  },
  {
    titulo: 'Se acompañan',
    sub: 'Hasta las llaves',
    color: MEE,
    items: ['Cuota inicial y cartera', 'Promesa', 'Crédito y subsidio', 'Escritura', 'Entrega'],
    chips: false,
  },
];

// La base que se construye hoy y lo que se podrá conectar después
const MODULOS = [
  { nombre: 'Ventas', icon: Target, activo: true },
  { nombre: 'Obra y avance', icon: Hammer, activo: false },
  { nombre: 'Materiales y costos', icon: Boxes, activo: false },
  { nombre: 'Personal', icon: Users, activo: false },
  { nombre: 'Diseño y presupuesto en Revit', icon: Ruler, activo: false },
];

// ─── FUNCIONES DE LA PLATAFORMA, AGRUPADAS POR RESULTADO ─────────────────────
// Cada función arranca con un básico (sus ítems sin "mejora") y suma mejoras
// opcionales para llegar al ideal. Todo se paga con créditos Sixteam Ops.
// Las funciones fijas son la base y van siempre en el primer mes.

type Item = {
  id: string;           // único: `${cod}.${clave}`
  text: string;
  creditos: number;
  mejora?: boolean;     // si no es mejora, forma parte del básico
  requiere?: string[];  // códigos de función o ids de ítem que necesita
};
type Funcion = {
  cod: string;
  nombre: string;
  items: Item[];
  fija?: boolean;       // va siempre, no se puede quitar
  opcional?: boolean;   // fuera del alcance conversado, se ofrece como adicional
  requiere?: string[];  // códigos de las funciones que necesita
};
type Grupo = {
  etiqueta: string;
  nombre: string;
  icon: React.ElementType;
  color: string;
  para: string;
  funciones: Funcion[];
  resultado: string;
};

// Arma los ítems de una función: [clave, texto, créditos, mejora?, requiere?]
const it = (cod: string, lista: [string, string, number, boolean?, string[]?][]): Item[] =>
  lista.map(([clave, text, creditos, mejora, requiere]) => ({ id: `${cod}.${clave}`, text, creditos, mejora, requiere }));

const GRUPOS: Grupo[] = [
  {
    etiqueta: 'La base',
    nombre: 'Su constructora, en un solo lugar',
    icon: Database,
    color: '#60a5fa',
    para: 'Entendemos **cómo vende y entrega** Meetrico y dejamos **clientes y apartamentos** en el sistema.',
    funciones: [
      { cod: '01', nombre: 'Mapa del proceso comercial', fija: true, items: it('01', [
        ['sesion', 'Sesión de trabajo con **usted y Jennifer**', 10],
        ['etapas', 'Mapa de las **etapas principales**: interés, separación, promesa, crédito, escritura y entrega', 15],
        ['datos', 'Los **datos clave** de cada cliente: precio, forma de pago, crédito y subsidio', 5],
        ['pasos', 'Los **49 pasos** en detalle, con el responsable y el tiempo de cada uno', 20, true],
        ['docs', '**Documentos y requisitos** de cada paso', 10, true, ['01.pasos']],
      ]) },
      { cod: '02', nombre: 'Inventario de apartamentos', fija: true, items: it('02', [
        ['torres', 'Cada **torre con sus apartamentos**', 15],
        ['estado', 'Estado de cada uno: **disponible, separado o vendido**', 10],
        ['precio', '**Precio** de cada apartamento', 5],
        ['plano', '**Plano visual** de cada torre con el estado por colores', 15, true],
        ['cotizador', '**Cotizador** con cuota inicial, crédito y subsidio', 20, true],
      ]) },
      { cod: '03', nombre: 'Ficha del cliente y accesos', fija: true, items: it('03', [
        ['ficha', '**Ficha del cliente** con los datos que usted necesita', 10],
        ['carga', 'Carga de los **clientes actuales**', 15],
        ['accesos', 'Accesos para **usted y Jennifer**', 5],
        ['historial', '**Historial** de cada cliente: mensajes, visitas y pagos en una línea de tiempo', 10, true],
        ['roles', '**Roles y permisos** para sumar más asesoras', 5, true],
      ]) },
      { cod: '04', nombre: 'Capacitación y arranque', fija: true, items: it('04', [
        ['capacitacion', '**Capacitación** a Jennifer y a usted', 5],
        ['arranque', 'Acompañamiento en el **arranque de la sala de ventas**', 5],
        ['videos', '**Manual en video** para consultar cuando lo necesiten', 8, true],
        ['extendido', '**Acompañamiento extendido** durante todo el primer mes', 6, true],
      ]) },
    ],
    resultado: 'Sus **clientes y apartamentos en un solo lugar**, sin hojas sueltas.',
  },
  {
    etiqueta: 'Captar',
    nombre: 'Todos los canales en una bandeja',
    icon: Inbox,
    color: '#38bdf8',
    para: 'Que cada interesado llegue al sistema, **venga de donde venga**.',
    funciones: [
      { cod: '05', nombre: 'Bandeja única de mensajes', items: it('05', [
        ['whatsapp', 'Conexión de **WhatsApp**', 30],
        ['meta', 'Conexión de **Instagram y Facebook**', 20],
        ['rapidas', '**Respuestas rápidas** para las preguntas de siempre', 10],
        ['tiktok', 'Conexión de **TikTok**', 10, true],
        ['etiquetas', '**Etiquetas por interés**: torre, presupuesto, crédito o subsidio', 7, true],
        ['asignacion', '**Reparto automático** de conversaciones entre asesoras', 8, true, ['03.roles']],
      ]) },
      { cod: '06', nombre: 'Formularios de registro', items: it('06', [
        ['pauta', '**Formulario** para la pauta digital', 15],
        ['sala', '**Registro** en la sala de ventas', 10],
        ['canal', 'Cada interesado queda con **el canal por el que llegó**', 5],
        ['qr', '**Código QR** en la sala para registrarse desde el celular', 5, true],
        ['calificacion', '**Calificación automática** del interesado según ingresos, crédito y subsidio', 15, true],
      ]) },
      { cod: '07', nombre: 'Registro de referidos', items: it('07', [
        ['registro', 'Registro de **referidos**', 15],
        ['quien', 'Se sabe **quién refirió a quién**', 5],
        ['gracias', '**Mensaje de agradecimiento** automático a quien refiere', 8, true],
        ['reporte', '**Reporte de referidos** y de los beneficios entregados', 10, true],
      ]) },
    ],
    resultado: 'Usted sabe **cuántos interesados llegan** y **por qué canal**.',
  },
  {
    etiqueta: 'Convertir',
    nombre: 'Seguimiento que no se olvida',
    icon: BellRing,
    color: '#00bfa5',
    para: 'Convertir interesados en **visitas** y visitas en **separaciones**.',
    funciones: [
      { cod: '08', nombre: 'Citas en el apartamento modelo', items: it('08', [
        ['agenda', '**Agenda de citas** en el apartamento modelo', 20],
        ['recordatorios', '**Recordatorios automáticos** al interesado', 15],
        ['asistencia', 'Registro de **quién asistió**', 5],
        ['link', '**Agendamiento por enlace**: el interesado elige la hora', 12, true],
        ['encuesta', '**Encuesta** después de la visita', 8, true],
      ]) },
      { cod: '09', nombre: 'Seguimiento automático', requiere: ['05'], items: it('09', [
        ['secuencia', '**Secuencia de seguimiento** a quien visitó y no se decidió', 25],
        ['parar', 'Se **detiene sola** cuando el cliente separa', 5],
        ['obra', 'Mensajes con **fotos y videos del avance de obra**', 15, true],
        ['perfiles', '**Secuencias por perfil**: contado, crédito o subsidio', 20, true],
        ['reactivar', '**Reactivación** de interesados antiguos', 15, true],
      ]) },
      { cod: '10', nombre: 'Tareas y alertas para la asesora', items: it('10', [
        ['tareas', '**Tareas diarias** para Jennifer', 12],
        ['alertas', '**Alertas** de interesados sin respuesta', 10],
        ['resumen', '**Resumen diario** por WhatsApp para usted', 10, true],
      ]) },
      { cod: '11', nombre: 'Asistente de IA en WhatsApp', opcional: true, requiere: ['05'], items: it('11', [
        ['dudas', 'Resuelve las **dudas frecuentes** del proyecto a cualquier hora', 25],
        ['traspaso', '**Pasa la conversación** a Jennifer cuando hace falta', 10],
        ['citas', '**Agenda citas** al apartamento modelo', 15, true, ['08']],
        ['califica', '**Califica al interesado**: ingresos, crédito y subsidio', 15, true],
        ['material', 'Envía **fotos, planos y avance de obra**', 10, true],
        ['voz', 'Entiende **notas de voz**', 10, true],
        ['insiste', '**Vuelve a escribir** a quien no respondió', 10, true],
      ]) },
    ],
    resultado: '**Ningún interesado se pierde** por falta de seguimiento.',
  },
  {
    etiqueta: 'Acompañar',
    nombre: 'La ruta del comprador',
    icon: KeyRound,
    color: MEE,
    para: 'Llevar a cada cliente **de la separación a la entrega de llaves** con todo en orden.',
    funciones: [
      { cod: '12', nombre: 'Ruta del comprador', items: it('12', [
        ['etapas', 'Las **etapas principales** visibles para cada comprador', 30],
        ['avance', 'El **avance de cada cliente** a la vista', 10],
        ['pasos', 'Los **49 pasos completos** como etapas del sistema', 25, true, ['01.pasos']],
        ['checklist', '**Lista de documentos** por paso', 15, true, ['01.docs']],
        ['aviso', '**Aviso al cliente** cada vez que avanza de etapa', 15, true],
      ]) },
      { cod: '13', nombre: 'Expediente digital', requiere: ['12'], items: it('13', [
        ['archivo', '**Documentos de cada cliente** en su ficha: separación, promesa, crédito, subsidio y escritura', 20],
        ['faltantes', 'Alerta de **documentos que faltan**', 10],
        ['subida', 'El cliente **sube sus documentos** desde un enlace', 15, true],
        ['plantillas', '**Separación y promesa** llenadas con los datos del cliente', 20, true],
      ]) },
      { cod: '14', nombre: 'Vencimientos y alertas', requiere: ['12'], items: it('14', [
        ['fechas', '**Fechas de vencimiento** de pagos y trámites', 20],
        ['alertas', '**Alertas** para Jennifer antes de que algo se venza', 15],
        ['cliente', '**Recordatorio de pago** al cliente por WhatsApp', 15, true],
        ['cartera', '**Seguimiento de la cuota inicial**: pagado y pendiente', 20, true],
      ]) },
    ],
    resultado: 'El **expediente digital** de cada comprador, con su **avance a la vista**.',
  },
  {
    etiqueta: 'Decidir',
    nombre: 'Su negocio en una pantalla',
    icon: BarChart3,
    color: '#fbbf24',
    para: 'Que usted **vea cómo van las ventas** sin pedir informes a mano.',
    funciones: [
      { cod: '15', nombre: 'Tablero de ventas', items: it('15', [
        ['vendidos', 'Vendidos **por torre** y valor vendido', 20],
        ['creditos', '**Créditos y subsidios** en trámite', 10],
        ['embudo', '**Embudo**: interesados, visitas y separaciones', 15, true, ['06', '08']],
        ['pauta', '**Resultados de la pauta** por canal', 15, true, ['06']],
        ['meta', '**Meta del mes** frente a lo vendido', 10, true],
      ]) },
      { cod: '16', nombre: 'Informe descargable', items: it('16', [
        ['ventas', 'Precio, forma de pago, crédito y subsidio **de cada venta**', 10],
        ['excel', 'Descarga en **Excel**', 5],
        ['correo', '**Informe mensual** automático a su correo', 10, true],
      ]) },
    ],
    resultado: 'Decisiones **con datos**, no de memoria.',
  },
];

const FUNCIONES = GRUPOS.flatMap(g => g.funciones);
const ITEMS = FUNCIONES.flatMap(f => f.items);
const MEJORAS = ITEMS.filter(i => i.mejora);
const funcionDe = (cod: string) => FUNCIONES.find(f => f.cod === cod)!;
const itemDe = (id: string) => ITEMS.find(i => i.id === id)!;
const esFuncion = (id: string) => !id.includes('.');
const padreDe = (id: string) => id.split('.')[0];
const basicoDe = (f: Funcion) => f.items.filter(i => !i.mejora).reduce((s, i) => s + i.creditos, 0);
// Lo que necesita cada pieza: una función, sus funciones previas; una mejora, su función y lo que pida
const reqDe = (id: string) => esFuncion(id) ? funcionDe(id).requiere ?? [] : [padreDe(id), ...(itemDe(id).requiere ?? [])];
const esFija = (id: string) => esFuncion(id) && !!funcionDe(id).fija;
const nombreDe = (id: string) => esFuncion(id) ? `${id} · ${funcionDe(id).nombre}` : `«${itemDe(id).text.replace(/\*\*/g, '')}» (${padreDe(id)})`;

// La selección guarda códigos de función ('05') e ids de mejora ('05.tiktok')
const creditosDe = (sel: Iterable<string>) => {
  const s = new Set(sel);
  return FUNCIONES.filter(f => s.has(f.cod))
    .reduce((t, f) => t + basicoDe(f) + f.items.filter(i => i.mejora && s.has(i.id)).reduce((a, i) => a + i.creditos, 0), 0);
};

const CODIGOS_FIJOS = FUNCIONES.filter(f => f.fija).map(f => f.cod);
const CODIGOS_BASICO = FUNCIONES.filter(f => !f.opcional).map(f => f.cod);
const CODIGOS_IDEAL = [...FUNCIONES.map(f => f.cod), ...MEJORAS.map(i => i.id)];
// Arranca con lo que cabe en el primer mes del plan: la base y la bandeja única
const SELECCION_INICIAL = [...CODIGOS_FIJOS, '05'];
const CREDITOS_BASE = creditosDe(CODIGOS_FIJOS);
const CREDITOS_BASICO = creditosDe(CODIGOS_BASICO);
const CREDITOS_IDEAL = creditosDe(CODIGOS_IDEAL);

const RESULTADOS = [
  { v: '1', l: 'bandeja', sub: 'para todos los canales', icon: MessagesSquare },
  { v: '0', l: 'interesados perdidos', sub: 'por falta de seguimiento', icon: UserCheck },
  { v: '49', l: 'pasos', sub: 'con control digital', icon: ClipboardList },
  { v: '1', l: 'tablero', sub: 'para decidir con datos', icon: BarChart3 },
];

const SECCIONES = [
  { id: 'resumen',    label: 'Resumen' },
  { id: 'solucion',   label: 'Solución' },
  { id: 'inversion',  label: 'Inversión' },
  { id: 'vigencia',   label: 'Vigencia' },
];

// ─── INVERSIÓN ───────────────────────────────────────────────────────────────

const fmt = (n: number) => 'COP ' + Math.round(n).toLocaleString('es-CO').replace(/,/g, '.');

const SMMLV_2026_NUM = 1750905;
const CREDITOS_MES = 160;
// Los créditos adicionales valen lo mismo que los del plan, sin recargo
const VALOR_CREDITO = Math.round(SMMLV_2026_NUM / CREDITOS_MES);
const SOLICITUDES_MES = 10;
const EXPERTOS = 3;

// Bandas estándar de consumo de créditos (5-20 / 21-50 / 51+)
const BANDAS = [
  {
    rango: '5 a 20', tipo: 'Solicitud simple', banda: 'Simple',
    ej: 'Un campo nuevo, el ajuste de un flujo ya activo, una plantilla de mensaje, un informe estándar, una capacitación o el soporte de una incidencia',
  },
  {
    rango: '21 a 50', tipo: 'Solicitud media', banda: 'Media',
    ej: 'Una automatización de seguimiento comercial, una segmentación de la base, un formulario conectado al CRM o un panel de informes nuevo',
  },
  {
    rango: '51 o más', tipo: 'Solicitud compleja', banda: 'Compleja',
    ej: 'Una integración entre sistemas, un agente de IA en producción o la migración de un módulo completo',
  },
];

const BANDA_STYLE: Record<string, { bg: string; border: string; color: string }> = {
  Simple:   { bg: 'rgba(0,191,165,.12)',  border: 'rgba(0,191,165,.3)',   color: '#00bfa5' },
  Media:    { bg: 'rgba(96,165,250,.12)', border: 'rgba(96,165,250,.3)',  color: '#60a5fa' },
  Compleja: { bg: 'rgba(242,140,56,.12)', border: 'rgba(242,140,56,.32)', color: MEE },
};

// Ejemplo de un mes: 10 solicitudes que suman exactamente los 160 créditos
const REPORTE = [
  { solicitud: 'Asistente de IA en WhatsApp que resuelve dudas y agenda citas al modelo', banda: 'Compleja', creditos: 55 },
  { solicitud: 'Seguimiento automático para el lanzamiento de la torre C',                banda: 'Media',    creditos: 25 },
  { solicitud: 'Panel de cartera y recaudo por torre',                                     banda: 'Media',    creditos: 22 },
  { solicitud: 'Formulario para una nueva campaña de pauta',                              banda: 'Simple',   creditos: 12 },
  { solicitud: 'Informe de visitas a la sala de ventas por canal',                        banda: 'Simple',   creditos: 10 },
  { solicitud: 'Campos nuevos para el trámite de subsidio',                               banda: 'Simple',   creditos: 8 },
  { solicitud: 'Ajuste al flujo de recordatorios de citas',                               banda: 'Simple',   creditos: 8 },
  { solicitud: 'Plantilla de mensaje con el avance de obra del mes',                      banda: 'Simple',   creditos: 7 },
  { solicitud: 'Capacitación a una nueva asesora',                                        banda: 'Simple',   creditos: 7 },
  { solicitud: 'Soporte de una incidencia con WhatsApp',                                  banda: 'Simple',   creditos: 6 },
];

const TOTAL_REPORTE = REPORTE.reduce((a, r) => a + r.creditos, 0);

const DISTRIBUCION = ['Compleja', 'Media', 'Simple'].map(b => ({
  banda: b,
  cantidad: REPORTE.filter(r => r.banda === b).length,
  creditos: REPORTE.filter(r => r.banda === b).reduce((a, r) => a + r.creditos, 0),
}));

const PLAN_ITEMS = [
  { text: `**${CREDITOS_MES} créditos al mes** para activar funciones, ajustes y solicitudes`, icon: Coins },
  { text: '**Plataforma CRM Sixteam incluida**, con **usuarios ilimitados** y **1 número** conectado', icon: CheckCircle },
  { text: '**Agente de IA 24/7** para preguntar lo que necesite sobre la plataforma', icon: Bot },
  { text: '**Sesión virtual 1 a 1 cada semana** para revisar avances, métricas de valor y seguir mejorando', icon: Video },
  { text: 'Nuevas funciones, **solución de inconvenientes** y mejoras para seguir creciendo', icon: Wrench },
];


// ─── HELPERS ─────────────────────────────────────────────────────────────────

function useVisible(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [threshold]);
  return { ref, v };
}

// Convierte **texto** en palabra resaltada
const rich = (t: string, color = '#ffffff') =>
  t.split('**').map((s, i) => i % 2
    ? <strong key={i} className="font-semibold" style={{ color }}>{s}</strong>
    : <React.Fragment key={i}>{s}</React.Fragment>);

const Hl = ({ children, color = '#00bfa5' }: { children: React.ReactNode; color?: string }) => (
  <strong className="font-semibold" style={{ color }}>{children}</strong>
);

const TagLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="font-lato text-[#00bfa5] text-[13px] uppercase tracking-[0.22em] font-medium">{children}</span>
);
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-poppins font-extrabold text-white mt-3 mb-3 leading-[1.1]"
    style={{ fontSize: 'clamp(2rem, 4.6vw, 2.9rem)' }}>
    {children}
  </h2>
);
const Lead = ({ children }: { children: React.ReactNode }) => (
  <p className="font-lato text-white/55 text-[19px] sm:text-[20px] leading-relaxed max-w-2xl mb-12">{children}</p>
);
const Rule = () => (
  <div className="w-12 h-0.5 mb-8 mt-1" style={{ background: `linear-gradient(90deg,#1d70a2,#00bfa5)` }} />
);
const SubLabel = ({ children, icon: Icon }: { children: React.ReactNode; icon: React.ElementType }) => (
  <p className="font-poppins font-semibold text-white/60 text-[14px] uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
    <Icon className="w-4 h-4 text-[#00bfa5]" /> {children}
  </p>
);
// El logo de Meetrico es blanco, por eso va sobre fondo oscuro
const ClientLogo = ({ className = '' }: { className?: string }) => (
  <div className={`rounded-xl flex items-center justify-center ${className}`}
    style={{ background: 'linear-gradient(135deg,#0a2342,#12356b)', border: `1px solid ${MEE}4d` }}>
    <img src="/meetrico-logo.svg" alt={META.cliente} className="w-full h-auto object-contain"
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
  </div>
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const MeetricoProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [creditosAbierto, setCreditosAbierto] = useState(false);
  const [seleccion, setSeleccion] = useState<Set<string>>(() => new Set(SELECCION_INICIAL));
  const [detalles, setDetalles] = useState<Set<string>>(() => new Set());
  const [aviso, setAviso] = useState<string | null>(null);

  const alternarDetalle = (c: string) => setDetalles(prev => {
    const n = new Set(prev); if (n.has(c)) n.delete(c); else n.add(c); return n;
  });

  // Marca o desmarca una función o una mejora respetando lo que necesita cada una
  const NODOS = [...FUNCIONES.map(f => f.cod), ...MEJORAS.map(i => i.id)];
  const alternar = (id: string) => {
    if (esFija(id)) return;
    const sel = new Set(seleccion);
    const nombres = (ids: string[]) => {
      const n = ids.map(nombreDe);
      return n.length > 1 ? `${n.slice(0, -1).join(', ')} y ${n[n.length - 1]}` : n[0];
    };
    if (!sel.has(id)) {
      const agregados: string[] = [];
      const agregar = (x: string) => {
        sel.add(x);
        for (const r of reqDe(x)) if (!sel.has(r)) { agregados.push(r); agregar(r); }
      };
      agregar(id);
      const plural = agregados.length > 1;
      setAviso(agregados.length ? `Se ${plural ? 'agregaron' : 'agregó'} ${nombres(agregados)}, porque ${nombreDe(id)} ${plural ? 'los' : 'lo'} necesita.` : null);
    } else {
      const quitados: string[] = [];
      const quitar = (x: string) => {
        sel.delete(x);
        for (const n of NODOS) {
          if (sel.has(n) && !esFija(n) && reqDe(n).includes(x)) {
            // Las mejoras de la misma función se quitan con ella sin avisar
            if (!(esFuncion(x) && padreDe(n) === x)) quitados.push(n);
            quitar(n);
          }
        }
      };
      quitar(id);
      const plural = quitados.length > 1;
      setAviso(quitados.length ? `Se ${plural ? 'quitaron' : 'quitó'} ${nombres(quitados)}, porque ${plural ? 'necesitan' : 'necesita'} ${nombreDe(id)}.` : null);
    }
    setSeleccion(sel);
  };
  const armar = (codigos: string[], texto: string) => { setSeleccion(new Set(codigos)); setAviso(texto); };

  // Lo elegido para el mes 1: lo que cabe en los créditos del plan va incluido,
  // lo que pasa de ahí son créditos adicionales al mismo valor
  const creditosElegidos = creditosDe(seleccion);
  const creditosIncluidos = Math.min(creditosElegidos, CREDITOS_MES);
  const creditosLibres = CREDITOS_MES - creditosIncluidos;
  const creditosAdicionales = Math.max(0, creditosElegidos - CREDITOS_MES);
  const valorAdicional = creditosAdicionales * VALOR_CREDITO;
  const totalMes1 = SMMLV_2026_NUM + valorAdicional;
  const mesesSinAdicional = Math.ceil(creditosElegidos / CREDITOS_MES);
  const nElegidas = FUNCIONES.filter(f => seleccion.has(f.cod)).length;
  const nMejoras = MEJORAS.filter(i => seleccion.has(i.id) && seleccion.has(padreDe(i.id))).length;
  const creditosFuncion = (f: Funcion) => creditosDe([...seleccion].filter(x => padreDe(x) === f.cod));
  const creditosGrupo = (g: Grupo) => g.funciones.reduce((t, f) => t + creditosFuncion(f), 0);
  const creditosParaIdeal = CREDITOS_IDEAL - creditosElegidos;
  const pctIncluido = Math.min(100, creditosElegidos / CREDITOS_MES * 100);

  useEffect(() => {
    const handler = () => {
      for (const s of SECCIONES) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom > 140) { setActiveSection(s.id); break; }
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const s1 = useVisible(); const s2 = useVisible();
  const s4 = useVisible(); const s5 = useVisible();

  const reveal = (v: boolean) => `transition-all duration-700 ${v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;

  return (
    <div id="proposal-root" className="min-h-screen overflow-x-hidden" style={{ background: '#030d1a', fontFamily: 'Lato, sans-serif' }}>

      {/* ── NAV LATERAL ── */}
      <nav className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-50 flex-col gap-3 no-print">
        {SECCIONES.map(s => (
          <button key={s.id} onClick={() => scrollTo(s.id)}
            className={`group flex items-center gap-2.5 transition-all duration-300 ${activeSection === s.id ? 'opacity-100' : 'opacity-25 hover:opacity-60'}`}>
            <span className={`font-lato text-[14px] text-white whitespace-nowrap transition-all duration-300 ${activeSection === s.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>
              {s.label}
            </span>
            <div className={`rounded-full flex-shrink-0 transition-all duration-300 ${activeSection === s.id ? 'w-2 h-2 bg-[#00bfa5] shadow-[0_0_6px_rgba(0,191,165,.7)]' : 'w-1.5 h-1.5 bg-white/50'}`} />
          </button>
        ))}
      </nav>

      {/* ══════════ PORTADA */}
      <header className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #010408 0%, #020810 55%, #030d1a 100%)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(242,140,56,.06) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(29,112,162,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        </div>

        <div className="relative z-10 flex items-center justify-between gap-4 px-6 py-6 md:px-12 border-b" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
          <div className="flex items-center gap-6 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-white">
                <img src="/sixteam-logo.png" alt="Sixteam.pro" className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div className="hidden sm:block">
                <span className="font-poppins font-black text-white text-xl tracking-tight">Sixteam<span className="text-[#00bfa5]">.</span>pro</span>
                <p className="font-lato text-white/35 text-[13px] leading-none mt-0.5">Innovación y Estrategia Digital</p>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <ClientLogo className="hidden sm:flex w-32 px-3 py-2" />
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="font-lato text-[#00bfa5]/80 text-[13px] uppercase tracking-[0.2em] border border-[#00bfa5]/20 rounded-full px-3 py-1.5">Confidencial</span>
          </div>
        </div>

        <style>{`
          @keyframes cover-spin-slow { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
          @keyframes cover-spin-rev  { from{transform:rotate(0deg)}to{transform:rotate(-360deg)} }
          @keyframes cover-pulse-glow { 0%,100%{opacity:.07;transform:scale(1)} 50%{opacity:.15;transform:scale(1.12)} }
          @keyframes cover-float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
          .cover-ring-1{animation:cover-spin-slow 22s linear infinite}
          .cover-ring-2{animation:cover-spin-rev 16s linear infinite}
          .cover-glow{animation:cover-pulse-glow 4s ease-in-out infinite}
          .cover-float{animation:cover-float 5s ease-in-out infinite}
        `}</style>

        <div className="relative z-10 flex-1 flex items-center justify-center py-12 px-5 sm:px-[10%]">
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            <div className="flex flex-col justify-center">
              <TagLabel>Fase 1 · Sistema comercial</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${MEE}, #1d70a2)` }}>
                  <Building2 className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">Gerencia de {META.cliente}</span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-5"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 4.6rem)' }}>
                Propuesta<br />
                <span style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Comercial
                </span>
              </h1>
              <p className="font-lato text-white/55 text-xl leading-relaxed mb-6 max-w-xl">
                La base del <Hl color="#fff">sistema de su constructora</Hl>, empezando por lo más importante: <Hl color={MEE}>vender</Hl>.
              </p>
              <div className="inline-flex flex-wrap items-center gap-1.5 px-4 py-2 rounded-xl mb-6 self-start"
                style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)' }}>
                <span className="font-poppins font-bold text-white/80 text-[15px] sm:text-[18px]">Process</span>
                <span className="font-poppins font-bold text-[#1d70a2] text-[15px] sm:text-[18px]">+</span>
                <span className="font-poppins font-bold text-[#1d70a2] text-[15px] sm:text-[18px]">Technology</span>
                <span className="font-poppins font-bold text-[#00bfa5] text-[15px] sm:text-[18px]">+</span>
                <span className="font-poppins font-bold text-[#00bfa5] text-[15px] sm:text-[18px]">People</span>
                <span className="font-poppins font-bold text-white/50 text-[15px] sm:text-[18px]">=</span>
                <span className="font-poppins font-black text-[#00bfa5] text-[15px] sm:text-[18px]">Growth</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  { icon: Calendar, text: META.fecha },
                  { icon: MapPin,   text: META.sede },
                  { icon: Clock,    text: META.duracion },
                ].map((chip, i) => {
                  const Icon = chip.icon;
                  return (
                    <div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[15px] text-white/60"
                      style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                      <Icon className="w-3.5 h-3.5 text-[#00bfa5]" /> {chip.text}
                    </div>
                  );
                })}
              </div>
              <div className="border-t pt-5" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-widest mb-3">Contenido</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                  {['1. Resumen', '2. La solución', '3. Inversión y funciones', '4. Vigencia y términos'].map((item, i) => (
                    <button key={i} onClick={() => scrollTo(SECCIONES[i]?.id)}
                      className="font-lato text-white/45 text-[15px] hover:text-[#00bfa5] transition-colors duration-200 text-left flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#00bfa5]/40 flex-shrink-0" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Derecha animada */}
            <div className="flex items-center justify-center relative min-h-[380px]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="cover-glow absolute w-80 h-80 rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(242,140,56,.12) 0%, rgba(29,112,162,.05) 50%, transparent 70%)' }} />
                <div className="cover-ring-1 absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full" style={{ border: '1px solid rgba(242,140,56,.14)' }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(29,112,162,.15)' }} />
                <div className="cover-ring-1 absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: MEE, boxShadow: '0 0 6px rgba(242,140,56,.8)' }} />
                </div>
              </div>
              <div className="cover-float relative z-10 flex flex-col items-center gap-6 w-full px-6">
                <div className="flex flex-col items-center gap-1">
                  <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-20 w-auto object-contain"
                    style={{ filter: 'drop-shadow(0 4px 20px rgba(0,191,165,.45))' }} />
                  <span className="font-poppins font-black text-white/30 text-[11px] uppercase tracking-[0.2em]">Sixteam.pro</span>
                </div>
                <div className="flex items-center gap-3 w-full max-w-xs">
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.08))' }} />
                  <div className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)' }}>
                    <span className="font-poppins font-black text-white/40 text-[20px] leading-none">×</span>
                  </div>
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,.08), transparent)' }} />
                </div>
                <div className="flex flex-col items-center gap-3">
                  <ClientLogo className="w-60 px-6 py-5 shadow-[0_4px_30px_rgba(242,140,56,.22)]" />
                  <p className="font-lato text-[13px] uppercase tracking-[0.2em] mt-1 text-center" style={{ color: MEE }}>Vivienda de interés social · Caicedonia</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-2 pb-10 opacity-30 no-print">
          <p className="font-lato text-white text-[13px] uppercase tracking-widest">Desplazar</p>
          <div className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </header>

      {/* ══════════ CONTENIDO */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 md:px-10 py-24 space-y-32 sm:space-y-40">

        {/* ─ 01 RESUMEN ─ */}
        <section id="resumen" ref={s1.ref as React.RefObject<HTMLElement>} className={reveal(s1.v)}>
          <TagLabel>01 — Resumen</TagLabel>
          <SectionTitle>Una constructora que ya vende.<br /><span className="text-white/45">Ahora, como un sistema.</span></SectionTitle>
          <Rule />
          <Lead>
            Meetrico construye <Hl color="#fff">vivienda de interés social</Hl> en Caicedonia y vende casi todo <Hl color="#fff">por referidos</Hl>. Con la sala de ventas de vuelta y los subsidios en camino, es el momento de <Hl>ordenar el proceso comercial</Hl>.
          </Lead>

          {/* Cifras */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-14">
            {CIFRAS.map((c, i) => (
              <div key={i} className="rounded-2xl px-4 py-6 text-center"
                style={{ background: i === 3 ? `${MEE}12` : 'rgba(255,255,255,.03)', border: `1px solid ${i === 3 ? `${MEE}45` : 'rgba(255,255,255,.07)'}` }}>
                <p className="font-poppins font-black leading-none mb-2" style={{ fontSize: 'clamp(2.25rem, 5vw, 3rem)', color: i === 3 ? MEE : '#fff' }}>{c.v}</p>
                <p className="font-poppins font-semibold text-white/80 text-[15px]">{c.l}</p>
                <p className="font-lato text-white/35 text-[13px] mt-0.5">{c.sub}</p>
              </div>
            ))}
          </div>

          {/* Cita */}
          <div className="py-10 sm:py-12 px-2 sm:px-8 mb-14 text-center border-y" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
            <Quote className="w-8 h-8 mx-auto mb-5" style={{ color: MEE }} />
            <p className="font-poppins font-bold text-white leading-snug max-w-2xl mx-auto" style={{ fontSize: 'clamp(1.5rem, 3.4vw, 2.1rem)' }}>
              "Yo visualizo mi empresa como <span style={{ color: MEE }}>un sistema</span>."
            </p>
            <p className="font-lato text-white/40 text-[15px] mt-4">{META.contacto} · {META.cliente}</p>
          </div>

          {/* Hallazgos */}
          <SubLabel icon={Info}>Lo que nos contó</SubLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HALLAZGOS.map((h, i) => {
              const Icon = h.icon;
              return (
                <div key={i} className="rounded-2xl p-6 flex flex-col"
                  style={{ background: `${h.color}0d`, border: `1px solid ${h.color}33` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${h.color}1f` }}>
                    <Icon className="w-5 h-5" style={{ color: h.color }} />
                  </div>
                  <p className="font-poppins font-bold text-white text-[19px] mb-2">{h.titulo}</p>
                  <p className="font-lato text-white/55 text-[16px] leading-relaxed mb-4">{rich(h.desc)}</p>
                  <p className="font-lato italic text-[15px] mt-auto pl-3" style={{ color: h.color, borderLeft: `2px solid ${h.color}` }}>"{h.cita}"</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─ 02 SOLUCIÓN ─ */}
        <section id="solucion" ref={s2.ref as React.RefObject<HTMLElement>} className={reveal(s2.v)}>
          <TagLabel>02 — La solución</TagLabel>
          <SectionTitle>Un solo lugar, del primer mensaje<br className="hidden sm:block" /> a la <span style={{ color: MEE }}>entrega de llaves</span></SectionTitle>
          <Rule />
          <Lead>
            Un sistema hecho <Hl color="#fff">a la medida de Meetrico</Hl> donde cada interesado entra, se acompaña y se registra <Hl>hasta recibir su vivienda</Hl>.
          </Lead>

          {/* Flujo */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-3 items-stretch mb-20">
            {FLUJO.map((f, i) => (
              <React.Fragment key={f.titulo}>
                <div className="rounded-2xl p-6" style={{ background: `${f.color}0d`, border: `1px solid ${f.color}40` }}>
                  <p className="font-lato text-[13px] uppercase tracking-[0.18em] mb-1" style={{ color: f.color }}>{f.sub}</p>
                  <p className="font-poppins font-black text-white text-[24px] mb-5">{f.titulo}</p>
                  {f.chips ? (
                    <div className="flex flex-wrap gap-1.5">
                      {f.items.map(it => (
                        <span key={it} className="font-lato text-[14px] px-2.5 py-1 rounded-full text-white/75"
                          style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)' }}>{it}</span>
                      ))}
                    </div>
                  ) : (
                    <ol className="space-y-2.5">
                      {f.items.map((it, j) => (
                        <li key={it} className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-poppins font-bold text-[12px]"
                            style={{ background: `${f.color}22`, color: f.color }}>{j + 1}</span>
                          <span className="font-lato text-white/75 text-[16px]">{it}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
                {i < FLUJO.length - 1 && (
                  <div className="flex items-center justify-center py-1 md:py-0">
                    <ArrowRight className="hidden md:block w-5 h-5 text-white/25" />
                    <ArrowDown className="md:hidden w-5 h-5 text-white/25" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Base para crecer */}
          <SubLabel icon={Building2}>La base para conectar toda su constructora</SubLabel>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
            {MODULOS.map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={i} className={`rounded-2xl p-5 flex flex-col items-center text-center ${i === MODULOS.length - 1 ? 'col-span-2 sm:col-span-1' : ''}`}
                  style={m.activo
                    ? { background: 'linear-gradient(135deg, rgba(0,191,165,.14), rgba(29,112,162,.10))', border: '1px solid rgba(0,191,165,.45)', boxShadow: '0 0 30px rgba(0,191,165,.12)' }
                    : { background: 'rgba(255,255,255,.02)', border: '1px dashed rgba(255,255,255,.12)' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: m.activo ? 'rgba(0,191,165,.18)' : 'rgba(255,255,255,.04)' }}>
                    {m.activo
                      ? <Icon className="w-5 h-5 text-[#00bfa5]" />
                      : <Lock className="w-4 h-4 text-white/25" />}
                  </div>
                  <p className={`font-poppins font-bold text-[15px] leading-snug ${m.activo ? 'text-white' : 'text-white/40'}`}>{m.nombre}</p>
                  <p className={`font-lato text-[12px] uppercase tracking-wider mt-1.5 ${m.activo ? 'text-[#00bfa5]' : 'text-white/25'}`}>
                    {m.activo ? 'Esta propuesta' : 'Próximas fases'}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="font-lato text-white/45 text-[16px] leading-relaxed max-w-2xl">
            Empezamos por <Hl color="#fff">las ventas</Hl>, porque sin ventas no hay obra. Sobre esta misma base se podrán conectar después <Hl color="#fff">la obra, los materiales, el personal y Revit</Hl>.
          </p>

          {/* Resultados con el sistema completo */}
          <div className="mt-16">
            <SubLabel icon={Zap}>Con el sistema completo</SubLabel>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {RESULTADOS.map((r, i) => {
                const Icon = r.icon;
                return (
                  <div key={i} className="rounded-2xl px-4 py-7 text-center"
                    style={{ background: 'linear-gradient(160deg, rgba(0,191,165,.09), rgba(29,112,162,.05))', border: '1px solid rgba(0,191,165,.22)' }}>
                    <Icon className="w-5 h-5 text-[#00bfa5] mx-auto mb-3" />
                    <p className="font-poppins font-black text-white leading-none mb-2" style={{ fontSize: 'clamp(2.25rem, 5vw, 3rem)' }}>{r.v}</p>
                    <p className="font-poppins font-semibold text-white/80 text-[15px] leading-snug">{r.l}</p>
                    <p className="font-lato text-white/40 text-[13px] mt-0.5">{r.sub}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─ 03 INVERSIÓN ─ */}
        <section id="inversion" ref={s4.ref as React.RefObject<HTMLElement>} className={reveal(s4.v)}>
          <TagLabel>03 — Inversión</TagLabel>
          <SectionTitle>Un solo plan mensual,<br /><span style={{ color: '#00bfa5' }}>usted elige qué activar</span></SectionTitle>
          <Rule />
          <Lead>
            Desde el primer mes, Meetrico cuenta con el <Hl color="#fff">Plan Integral Sixteam Ops</Hl>: {CREDITOS_MES} créditos cada mes para activar las funciones de su sistema, <Hl>en el orden que usted decida</Hl>.
          </Lead>

          {/* El plan */}
          <div className="rounded-3xl p-6 sm:p-9 relative overflow-hidden mb-12 grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8"
            style={{ background: 'linear-gradient(150deg, rgba(0,191,165,.13) 0%, rgba(29,112,162,.08) 55%, rgba(3,13,26,.9) 100%)', border: '1.5px solid rgba(0,191,165,.5)', boxShadow: '0 0 40px rgba(0,191,165,.12)' }}>
            <div className="flex flex-col">
              <p className="font-lato text-white/40 text-[13px] uppercase tracking-wider mb-1">Su plan mensual</p>
              <p className="font-poppins font-bold text-white text-[22px] leading-snug">Plan Integral Sixteam Ops</p>
              <p className="font-lato text-[#00bfa5] text-[15px] mt-1 mb-6">Su propio equipo de tecnología, en la palma de su mano</p>
              <p className="font-poppins font-black text-white leading-none whitespace-nowrap" style={{ fontSize: 'clamp(1.9rem, 3.4vw, 2.4rem)' }}>{fmt(SMMLV_2026_NUM)}</p>
              <p className="font-lato text-white/45 text-[14px] mt-2">al mes + IVA · 1 SMMLV 2026</p>
              <div className="mt-auto pt-6">
                <div className="rounded-xl px-4 py-3.5 flex items-center gap-3"
                  style={{ background: 'rgba(0,191,165,.10)', border: '1px solid rgba(0,191,165,.3)' }}>
                  <p className="font-poppins font-black text-[#00bfa5] text-[32px] leading-none">{EXPERTOS}</p>
                  <p className="font-lato text-white/70 text-[15px] leading-snug">
                    Es como tener <Hl color="#fff">{EXPERTOS} expertos en tecnología y en su negocio</Hl> a su servicio 24/7.
                  </p>
                </div>
              </div>
            </div>
            <ul className="space-y-3.5 self-center">
              {PLAN_ITEMS.map((it, j) => {
                const ItIcon = it.icon;
                return (
                  <li key={j} className="flex items-start gap-3">
                    <ItIcon className="w-4 h-4 flex-shrink-0 mt-1 text-[#00bfa5]" />
                    <span className="font-lato text-white/65 text-[16px] leading-snug">{rich(it.text, 'rgba(255,255,255,.92)')}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Cómo rinden los créditos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-14">
            {[
              { v: `${CREDITOS_MES}`, l: 'créditos incluidos cada mes', sub: `${fmt(VALOR_CREDITO)} por crédito`, icon: Coins, color: '#00bfa5' },
              { v: `${CREDITOS_BASICO}`, l: 'créditos el sistema básico', sub: `Todas las funciones en su versión básica · unos ${Math.ceil(CREDITOS_BASICO / CREDITOS_MES)} meses del plan`, icon: Layers, color: '#60a5fa' },
              { v: `${CREDITOS_IDEAL}`, l: 'créditos el sistema ideal', sub: `Todo, con cada mejora y el asistente de IA · unos ${Math.ceil(CREDITOS_IDEAL / CREDITOS_MES)} meses del plan`, icon: Sparkles, color: MEE },
            ].map((t, i) => {
              const Icon = t.icon;
              return (
                <div key={i} className="rounded-2xl p-5" style={{ background: `${t.color}0d`, border: `1px solid ${t.color}38` }}>
                  <Icon className="w-5 h-5 mb-3" style={{ color: t.color }} />
                  <p className="font-poppins font-black text-white text-[26px] leading-none">{t.v}</p>
                  <p className="font-poppins font-semibold text-white/80 text-[15px] mt-1.5">{t.l}</p>
                  <p className="font-lato text-white/40 text-[13px] mt-0.5 leading-snug">{t.sub}</p>
                </div>
              );
            })}
          </div>

          {/* Elegir el primer mes */}
          <p className="font-lato text-[#00bfa5] text-[13px] uppercase tracking-[0.22em] font-medium mb-2">Su primer mes</p>
          <h3 className="font-poppins font-extrabold text-white leading-tight mb-3" style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.2rem)' }}>
            Elija con qué arrancar
          </h3>
          <p className="font-lato text-white/55 text-[18px] leading-relaxed max-w-2xl mb-4">
            Cada función arranca en su <Hl color="#fff">versión básica</Hl> y se le pueden sumar <Hl color="#fff">mejoras</Hl> hasta llegar a la ideal. Lo que quepa en los {CREDITOS_MES} créditos del mes va incluido en su plan; si quiere más de una vez, lo que pase se cobra como <Hl color={MEE}>créditos adicionales</Hl>.
          </p>
          <p className="font-lato text-white/45 text-[15px] leading-snug mb-6 flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
            <span>Toque <span className="text-white/75 font-semibold">Alcance</span> en cada función para ver qué incluye el básico y qué mejoras puede sumar.</span>
          </p>

          {/* Atajos */}
          <div className="no-print flex flex-wrap items-center gap-2 mb-4">
            {[
              { t: 'Lo que cabe en el plan', codigos: SELECCION_INICIAL, icon: CheckCircle, color: '#00bfa5' },
              { t: 'Sistema básico', codigos: CODIGOS_BASICO, icon: ListChecks, color: '#60a5fa' },
              { t: 'Sistema ideal', codigos: CODIGOS_IDEAL, icon: Sparkles, color: MEE },
              { t: 'Solo la base', codigos: CODIGOS_FIJOS, icon: Lock, color: '#a78bfa' },
            ].map(a => {
              const Icon = a.icon;
              return (
                <button key={a.t} type="button" onClick={() => armar(a.codigos, `Selección: ${a.t.toLowerCase()}.`)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-lato text-[14px] text-white/70 transition-colors hover:text-white hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bfa5]"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.12)' }}>
                  <Icon className="w-4 h-4" style={{ color: a.color }} /> {a.t}
                </button>
              );
            })}
          </div>

          {/* Selector de funciones */}
          <div className="rounded-2xl overflow-hidden mb-3"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(0,191,165,.28)', boxShadow: '0 4px 32px rgba(0,191,165,.08)' }}>

            {/* Medidor de créditos del mes 1 */}
            <div className="px-4 sm:px-5 py-4" style={{ background: 'rgba(2,8,20,.6)', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2.5">
                <p className="font-lato text-white/60 text-[14px]">Créditos del primer mes</p>
                <p className="font-poppins font-bold text-[15px]">
                  <span className="text-white">{creditosElegidos}</span>
                  <span className="text-white/40"> / {CREDITOS_MES} incluidos</span>
                  {creditosAdicionales > 0 && <span style={{ color: MEE }}> · +{creditosAdicionales} adicionales</span>}
                </p>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,.07)' }}
                role="meter" aria-valuemin={0} aria-valuemax={CREDITOS_MES} aria-valuenow={creditosElegidos} aria-label="Créditos del primer mes">
                {creditosAdicionales > 0 ? (
                  <>
                    <div style={{ width: `${CREDITOS_MES / creditosElegidos * 100}%`, background: '#00bfa5' }} />
                    <div style={{ width: `${creditosAdicionales / creditosElegidos * 100}%`, background: MEE }} />
                  </>
                ) : (
                  <div className="transition-all duration-300" style={{ width: `${pctIncluido}%`, background: '#00bfa5' }} />
                )}
              </div>
            </div>

            {GRUPOS.map((g, i) => {
              const Icon = g.icon;
              const incluido = g.funciones.some(f => seleccion.has(f.cod));
              return (
                <div key={g.etiqueta} style={{ borderTop: i ? '1px solid rgba(255,255,255,.07)' : undefined }}>
                  <div className="px-4 sm:px-5 pt-4 pb-3" style={{ background: `${g.color}0f` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${g.color}22` }}>
                        <Icon className="w-4 h-4" style={{ color: g.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-poppins font-bold text-[12px] uppercase tracking-wider" style={{ color: g.color }}>{g.etiqueta}</p>
                        <p className="font-poppins font-bold text-white text-[18px] leading-tight">{g.nombre}</p>
                      </div>
                      {incluido
                        ? <p className="font-poppins font-bold text-white/80 text-[14px] whitespace-nowrap">{creditosGrupo(g)} créditos</p>
                        : <p className="font-lato text-white/40 text-[14px] whitespace-nowrap">Para después</p>}
                    </div>
                    <p className="font-lato text-white/55 text-[15px] leading-snug mt-2.5">{rich(g.para, 'rgba(255,255,255,.85)')}</p>
                    <p className="font-lato text-white/50 text-[14px] leading-snug mt-1.5">
                      <span className="font-semibold" style={{ color: g.color }}>Resultado:</span> {rich(g.resultado, 'rgba(255,255,255,.8)')}
                    </p>
                  </div>
                  {g.funciones.map(f => {
                    const activo = seleccion.has(f.cod);
                    const abierto = detalles.has(f.cod);
                    const basico = basicoDe(f);
                    const mejoras = f.items.filter(i => i.mejora);
                    const mejorasActivas = activo ? mejoras.filter(i => seleccion.has(i.id)).length : 0;
                    return (
                      <React.Fragment key={f.cod}>
                        <label className={`flex items-start gap-3 px-4 sm:px-5 py-3 transition-colors focus-within:bg-white/[0.04] ${f.fija ? 'cursor-default' : 'cursor-pointer hover:bg-white/[0.02]'}`}
                          style={{ borderTop: '1px solid rgba(255,255,255,.05)' }}>
                          <input type="checkbox" checked={activo} disabled={f.fija} onChange={() => alternar(f.cod)}
                            aria-label={`${f.cod} · ${f.nombre}, básico ${basico} créditos`}
                            className="w-5 h-5 flex-shrink-0 mt-0.5 rounded cursor-[inherit] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                            style={{ accentColor: g.color, outlineColor: g.color }} />
                          <span className="font-poppins font-black text-[14px] w-7 flex-shrink-0 pt-0.5" style={{ color: g.color, opacity: activo ? 1 : 0.4 }}>{f.cod}</span>
                          <div className="flex-1 min-w-0" style={{ opacity: activo ? 1 : 0.45 }}>
                            <p className="font-poppins font-semibold text-white/90 text-[16px] leading-snug">{f.nombre}</p>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              {f.fija && (
                                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                                  style={{ background: 'rgba(96,165,250,.1)', border: '1px solid rgba(96,165,250,.3)', color: '#60a5fa' }}>Base · va siempre</span>
                              )}
                              {f.opcional && (
                                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                                  style={{ background: `${MEE}1a`, border: `1px solid ${MEE}55`, color: MEE }}>Adicional</span>
                              )}
                              {mejorasActivas > 0 && (
                                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                                  style={{ background: `${g.color}1a`, border: `1px solid ${g.color}55`, color: g.color }}>
                                  + {mejorasActivas} {mejorasActivas === 1 ? 'mejora' : 'mejoras'}
                                </span>
                              )}
                              {f.requiere && (
                                <span className="font-lato text-white/40 text-[12px]">Requiere {f.requiere.join(' y ')}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-poppins font-bold text-[16px] whitespace-nowrap" style={{ color: activo ? '#00bfa5' : 'rgba(255,255,255,.45)' }}>
                              {activo ? creditosFuncion(f) : basico} cr.
                            </p>
                            <p className="font-lato text-white/35 text-[12px] whitespace-nowrap">
                              {mejorasActivas > 0 ? `básico ${basico}` : 'básico'}
                            </p>
                          </div>
                          <button type="button" onClick={(ev) => { ev.preventDefault(); alternarDetalle(f.cod); }}
                            aria-expanded={abierto} aria-label={`${abierto ? 'Ocultar' : 'Ver'} alcance de ${f.nombre}`}
                            className="no-print flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md font-lato text-[13px] text-white/55 hover:text-white hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bfa5]">
                            <span className="hidden sm:inline">Alcance</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${abierto ? 'rotate-180' : ''}`} />
                          </button>
                        </label>
                        {abierto && (
                          <div className="pl-4 sm:pl-[4.5rem] pr-4 sm:pr-5 pb-4 pt-1">
                            <p className="font-poppins font-semibold text-white/50 text-[12px] uppercase tracking-wider mb-1.5">Básico · {basico} créditos</p>
                            <ul className="space-y-1.5 mb-4" style={{ opacity: activo ? 1 : 0.6 }}>
                              {f.items.filter(i => !i.mejora).map(i => (
                                <li key={i.id} className="flex gap-2 font-lato text-white/60 text-[15px] leading-snug">
                                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: g.color }} />
                                  <span className="flex-1">{rich(i.text, 'rgba(255,255,255,.9)')}</span>
                                  <span className="font-poppins font-semibold text-white/35 text-[13px] whitespace-nowrap">{i.creditos} cr.</span>
                                </li>
                              ))}
                            </ul>
                            {mejoras.length > 0 && (
                              <>
                                <p className="font-poppins font-semibold text-[12px] uppercase tracking-wider mb-1" style={{ color: g.color }}>Mejoras para llegar al ideal</p>
                                <div className="space-y-0.5">
                                  {mejoras.map(i => {
                                    const on = activo && seleccion.has(i.id);
                                    return (
                                      <label key={i.id} className="flex items-start gap-2.5 py-1.5 px-2 -mx-2 rounded-lg cursor-pointer transition-colors hover:bg-white/[0.03] focus-within:bg-white/[0.04]">
                                        <input type="checkbox" checked={on} onChange={() => alternar(i.id)}
                                          aria-label={`Mejora: ${i.text.replace(/\*\*/g, '')}, ${i.creditos} créditos`}
                                          className="w-4 h-4 flex-shrink-0 mt-0.5 rounded cursor-pointer"
                                          style={{ accentColor: g.color }} />
                                        <span className="flex-1 min-w-0" style={{ opacity: on ? 1 : 0.6 }}>
                                          <span className="font-lato text-white/70 text-[15px] leading-snug">{rich(i.text, 'rgba(255,255,255,.92)')}</span>
                                          {i.requiere && (
                                            <span className="block font-lato text-white/35 text-[12px] mt-0.5">
                                              Requiere {i.requiere.map(r => esFuncion(r) ? r : `«${itemDe(r).text.replace(/\*\*/g, '')}»`).join(' y ')}
                                            </span>
                                          )}
                                        </span>
                                        <span className="font-poppins font-bold text-[14px] whitespace-nowrap" style={{ color: on ? g.color : 'rgba(255,255,255,.4)' }}>+{i.creditos} cr.</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              );
            })}

            {/* Subtotal del selector */}
            <div className="px-4 sm:px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-2"
              style={{ background: 'rgba(0,191,165,.08)', borderTop: '1px solid rgba(0,191,165,.3)' }}>
              <p className="font-lato text-white/65 text-[15px] flex-1 min-w-[200px]">
                <span className="font-semibold text-white/90">{nElegidas} de {FUNCIONES.length}</span> funciones
                {nMejoras > 0 && <> · <span className="font-semibold text-white/90">{nMejoras}</span> {nMejoras === 1 ? 'mejora' : 'mejoras'}</>} para el primer mes
              </p>
              <p className="font-poppins font-black text-[#00bfa5] text-[22px] leading-none whitespace-nowrap">{creditosElegidos} créditos</p>
            </div>
          </div>

          <div role="status" aria-live="polite" className="mb-10 min-h-[1rem]">
            {aviso && (
              <p className="font-lato text-white/65 text-[15px] leading-snug flex items-start gap-2 rounded-xl px-4 py-3"
                style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.20)' }}>
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
                <span>{aviso}</span>
              </p>
            )}
          </div>
          {/* Cómo funcionan los créditos (desplegable) */}
          <div className="rounded-2xl overflow-hidden mb-6"
            style={{ background: 'rgba(255,255,255,.025)', border: `1px solid ${creditosAbierto ? 'rgba(0,191,165,.3)' : 'rgba(255,255,255,.08)'}` }}>
            <button onClick={() => setCreditosAbierto(!creditosAbierto)}
              className="w-full flex items-center gap-4 p-5 sm:p-6 text-left">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,191,165,.12)' }}>
                <Coins className="w-5 h-5 text-[#00bfa5]" />
              </div>
              <div className="flex-1">
                <p className="font-poppins font-bold text-white text-[19px]">¿Cómo funcionan los créditos?</p>
                <p className="font-lato text-white/40 text-[15px]">Plan Integral · ejemplo de un mes</p>
              </div>
              <ChevronDown className={`w-5 h-5 text-[#00bfa5] transition-transform duration-300 ${creditosAbierto ? 'rotate-180' : ''}`} />
            </button>
            {creditosAbierto && (
              <div className="px-5 sm:px-6 pb-6">
                <p className="font-lato text-white/55 text-[16px] leading-relaxed mb-5">
                  Cada solicitud se cotiza en créditos según su tamaño y <Hl color="#fff">usted la aprueba antes</Hl> de que la hagamos. Así nunca hay sorpresas al cierre del mes.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {BANDAS.map((b) => {
                    const bs = BANDA_STYLE[b.banda];
                    return (
                      <div key={b.banda} className="rounded-xl p-4" style={{ background: 'rgba(2,8,20,.6)', border: `1px solid ${bs.border}` }}>
                        <p className="font-poppins font-black text-[22px] leading-none mb-1" style={{ color: bs.color }}>{b.rango}</p>
                        <p className="font-lato text-white/30 text-[11px] uppercase tracking-wider mb-2">créditos</p>
                        <p className="font-poppins font-semibold text-white/85 text-[15px] mb-1">{b.tipo}</p>
                        <p className="font-lato text-white/45 text-[13px] leading-snug">{b.ej}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,.07)' }}>
                  <div className="grid grid-cols-3 gap-2 p-3" style={{ background: 'rgba(2,8,20,.5)', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                    {DISTRIBUCION.map((d) => {
                      const bs = BANDA_STYLE[d.banda];
                      return (
                        <div key={d.banda} className="rounded-lg px-2 py-2.5 text-center" style={{ background: bs.bg, border: `1px solid ${bs.border}` }}>
                          <p className="font-poppins font-black text-[20px] leading-none" style={{ color: bs.color }}>{d.cantidad}</p>
                          <p className="font-poppins font-semibold text-white/70 text-[12px] mt-1 leading-tight">{d.banda}</p>
                          <p className="font-lato text-white/35 text-[11px] mt-0.5">{d.creditos} créditos</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="divide-y divide-white/5">
                    {REPORTE.map((r, i) => {
                      const bs = BANDA_STYLE[r.banda];
                      return (
                        <div key={i} className="px-4 py-2.5 flex items-center gap-3">
                          <span className="font-lato text-white/60 text-[14px] leading-snug flex-1">
                            {r.solicitud}
                            <span className="ml-2 font-lato text-[11px] px-1.5 py-0.5 rounded whitespace-nowrap align-middle" style={{ background: bs.bg, color: bs.color }}>{r.banda}</span>
                          </span>
                          <span className="font-poppins font-bold text-[14px]" style={{ color: bs.color }}>{r.creditos}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'rgba(0,191,165,.07)', borderTop: '1px solid rgba(0,191,165,.2)' }}>
                    <span className="font-poppins font-bold text-white text-[15px]">Total del mes · {REPORTE.length} solicitudes</span>
                    <span className="font-poppins font-black text-[15px] text-[#00bfa5]">{TOTAL_REPORTE} / {CREDITOS_MES}</span>
                  </div>
                </div>
                <p className="font-lato text-white/35 text-[13px] leading-relaxed mt-4">
                  Es un ejemplo de referencia. Habrá meses en los que una solicitud compleja ocupe buena parte del plan y se atiendan menos solicitudes. Los créditos no usados no se acumulan, y si una solicitud supera el saldo se programa para el mes siguiente o se cotiza aparte, siempre con su aprobación.
                </p>
              </div>
            )}
          </div>

          {/* Totalizado del primer mes */}
          <div className="rounded-3xl p-6 sm:p-10 relative overflow-hidden mt-14 mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(0,191,165,.09) 0%, rgba(29,112,162,.08) 100%)', border: '1px solid rgba(0,191,165,.35)' }}>
            <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,191,165,.08), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <div className="relative z-10">
              <p className="font-lato text-[#00bfa5] text-[13px] uppercase tracking-[0.22em] font-medium mb-2">Su inversión</p>
              <h3 className="font-poppins font-extrabold text-white leading-tight mb-8" style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.2rem)' }}>
                Lo que eligió, en pesos
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-lato text-white/60 text-[16px]">Plan Integral Sixteam Ops</p>
                  <p className="font-poppins font-bold text-white/90 text-[17px] text-right whitespace-nowrap">{fmt(SMMLV_2026_NUM)}</p>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-lato text-white/60 text-[16px]">Funciones elegidas · {nElegidas}</p>
                  <p className="font-poppins font-bold text-white/90 text-[17px] text-right whitespace-nowrap">{creditosElegidos} créditos</p>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-lato text-white/60 text-[16px]">Incluidos en el plan</p>
                  <p className="font-poppins font-bold text-[#00bfa5] text-[17px] text-right whitespace-nowrap">{creditosIncluidos} de {CREDITOS_MES}</p>
                </div>
                {creditosAdicionales > 0 && (
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-lato text-[16px]" style={{ color: MEE }}>Créditos adicionales · {creditosAdicionales} × {fmt(VALOR_CREDITO)}</p>
                    <p className="font-poppins font-bold text-[17px] text-right whitespace-nowrap" style={{ color: MEE }}>+ {fmt(valorAdicional)}</p>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 sm:gap-3 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,.1)' }}>
                  <p className="font-poppins font-bold text-white text-[18px]">Total primer mes</p>
                  <div className="sm:text-right whitespace-nowrap">
                    <p className="font-poppins font-black text-white leading-none" style={{ fontSize: 'clamp(2rem, 6vw, 3.2rem)' }}>{fmt(totalMes1)}</p>
                    <p className="font-lato text-white/45 text-[14px] mt-1.5">+ IVA</p>
                  </div>
                </div>
              </div>

              {/* Desde el mes 2 */}
              <div className="rounded-xl p-4 sm:p-5 flex flex-wrap items-center gap-x-4 gap-y-2 mb-5"
                style={{ background: 'rgba(2,8,20,.55)', border: '1px solid rgba(0,191,165,.25)' }}>
                <Calendar className="w-5 h-5 text-[#00bfa5] flex-shrink-0" />
                <div className="flex-1 min-w-[180px]">
                  <p className="font-lato text-white/45 text-[13px] uppercase tracking-wider">Desde el segundo mes</p>
                  <p className="font-poppins font-bold text-white text-[17px]">Plan Integral · {CREDITOS_MES} créditos nuevos cada mes</p>
                </div>
                <p className="font-poppins font-black text-white text-[22px] whitespace-nowrap">
                  {fmt(SMMLV_2026_NUM)} <span className="font-lato font-normal text-white/45 text-[14px]">al mes + IVA</span>
                </p>
              </div>

              <div className="space-y-2.5">
                {creditosAdicionales > 0 && (
                  <p className="font-lato text-white/60 text-[15px] leading-relaxed flex items-start gap-2">
                    <Info className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: MEE }} />
                    <span>
                      ¿Prefiere no pagar adicional? Las mismas funciones se activan <Hl>sin sobrecosto</Hl> repartidas en {mesesSinAdicional} meses del plan.
                    </span>
                  </p>
                )}
                {creditosLibres > 0 && (
                  <p className="font-lato text-white/60 text-[15px] leading-relaxed flex items-start gap-2">
                    <Info className="w-4 h-4 flex-shrink-0 mt-1 text-[#00bfa5]" />
                    <span>Le {creditosLibres === 1 ? 'queda' : 'quedan'} <Hl color="#fff">{creditosLibres} {creditosLibres === 1 ? 'crédito' : 'créditos'}</Hl> del primer mes para ajustes y solicitudes.</span>
                  </p>
                )}
                {creditosParaIdeal > 0 && (
                  <p className="font-lato text-white/60 text-[15px] leading-relaxed flex items-start gap-2">
                    <Info className="w-4 h-4 flex-shrink-0 mt-1 text-[#00bfa5]" />
                    <span>
                      Para llegar al <Hl color="#fff">sistema ideal</Hl> faltan <Hl color="#fff">{creditosParaIdeal} créditos</Hl> en funciones y mejoras, que se activan con los créditos de los meses siguientes, <Hl>sin pagar más</Hl>.
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
          <p className="font-lato text-white/45 text-[16px] leading-relaxed max-w-2xl">
            Las <Hl color="#fff">próximas fases</Hl> (obra, materiales, personal) se pueden construir con los créditos del Plan Integral o <Hl>cotizarse aparte</Hl>.
          </p>
        </section>

        {/* ── LOGOS DE CLIENTES ── */}
        <div>
          <LogoCarousel />
        </div>

        {/* ─ 04 VIGENCIA ─ */}
        <section id="vigencia" ref={s5.ref as React.RefObject<HTMLElement>} className={reveal(s5.v)}>
          <TagLabel>04 — Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y términos</SectionTitle>
          <Rule />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { titulo: 'Aprobación', desc: 'Basta su confirmación por **WhatsApp, correo o verbal** para agendar el arranque.', icon: CheckCircle },
              { titulo: 'Plan mensual', desc: `El **Plan Integral Sixteam Ops** vale **${fmt(SMMLV_2026_NUM)} al mes** más IVA, por mes anticipado y por transferencia. Incluye **${CREDITOS_MES} créditos** cada mes y **no hay pago de implementación**.`, icon: FileText },
              { titulo: 'Créditos adicionales', desc: `Si en un mes se pide más de lo que cabe en el plan, el excedente se cobra a **${fmt(VALOR_CREDITO)} por crédito**, sin recargo y siempre con su aprobación. Si prefiere, se programa para el mes siguiente sin costo extra.`, icon: Coins },
              { titulo: 'Modalidad', desc: 'Sesiones **virtuales** con usted y Jennifer, en los horarios que acordemos.', icon: MapPin },
              { titulo: 'Funciones y mejoras para después', desc: 'Cada función arranca en su **versión básica**. Las funciones y mejoras que no se activen en el primer mes **quedan disponibles** y se activan con los créditos de los meses siguientes.', icon: Calendar },
              { titulo: 'No incluye', desc: 'El costo de los **mensajes de WhatsApp** que cobra Meta y el **presupuesto de pauta digital**, que se pagan aparte.', icon: AlertCircle },
              { titulo: 'Su información', desc: 'Los datos de clientes y ventas **son de Meetrico** y se manejan de forma **confidencial**.', icon: ShieldCheck },
              { titulo: 'Vigencia', desc: '**30 días calendario** desde la fecha de esta propuesta. Arrancamos con el **primer pago**.', icon: Clock },
            ].map((item, i, arr) => {
              const Icon = item.icon;
              return (
                <div key={i} className={`rounded-xl p-5 flex gap-3 ${i === arr.length - 1 && arr.length % 2 === 1 ? 'sm:col-span-2' : ''}`}
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <Icon className="w-4 h-4 text-[#00bfa5] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-poppins font-semibold text-white/85 text-[17px] mb-1">{item.titulo}</p>
                    <p className="font-lato text-white/50 text-[16px] leading-relaxed">{rich(item.desc, 'rgba(255,255,255,.85)')}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-16 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 100%, rgba(0,191,165,.05), transparent 70%)' }} />
            <div className="relative z-10">
              <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-10 w-auto object-contain mx-auto mb-3"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <p className="font-poppins font-black text-white text-[20px] tracking-tight mb-1">Sixteam<span className="text-[#00bfa5]">.</span>pro</p>
              <p className="font-lato text-white/35 text-[14px] mb-4">Innovación y Estrategia Digital S.A.S.</p>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[14px] text-white/35 font-lato">
                <span>NIT {META.nit}</span>
                <span>·</span>
                <span>{META.correo}</span>
                <span>·</span>
                <span>RL: {META.rl}</span>
              </div>
              <p className="font-lato text-white/50 text-[14px] mt-3">
                Propuesta elaborada por: <strong className="text-white/80 font-semibold">{META.elaboradaPor}</strong> · {META.cargo}
              </p>
              <p className="font-lato text-white/20 text-[13px] mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                Process + Technology + People = Growth · {META.fecha} · Uso confidencial
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default MeetricoProposal;
