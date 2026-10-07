import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap,
  AlertCircle, Info, Calendar, MapPin,
  Users, Shield, Lock, BellRing, MessageSquare, ClipboardList,
  FileSpreadsheet, Stamp, Layers, Workflow,
  Wallet, Receipt, Calculator, FileSearch, TriangleAlert, TrendingUp,
  Landmark, HandCoins, Scale, Gamepad2, UserPlus, Puzzle, ArrowRight,
  MousePointerClick, Monitor, Search, ShieldCheck,
  Building2, BookOpen, GraduationCap,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Mizar Diseño y Construcción · Mi Lote',
  tagline: 'Sistema financiero de ingresos: cartera, recaudo, contabilidad y socios',
  sector: 'Diseño y construcción · Venta de inmuebles y lotes a cuotas · Dos empresas',
  fecha: 'Octubre 2026',
  lugar: 'Bucaramanga y Cúcuta',
  objetivo: 'Un solo sistema para el dinero que entra a Mizar y a Mi Lote: cartera, pagos, bancos y socios, sin Excel paralelos. Compras ya controla lo que sale; esto completa la foto.',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  destinatarios: 'Ing. Claudia Villamizar · José Luis',
};

const DEMO_PATH = '/mizar-cartera/demo';

const MIZAR_GOLD = '#c9a443';

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber:  { text: '#f59e0b',   bg: 'rgba(251,191,36,.07)',   border: 'rgba(251,191,36,.18)' },
  teal:   { text: '#00bfa5',   bg: 'rgba(0,191,165,.07)',    border: 'rgba(0,191,165,.18)'  },
  blue:   { text: '#38bdf8',   bg: 'rgba(56,189,248,.07)',   border: 'rgba(56,189,248,.18)' },
  red:    { text: '#f87171',   bg: 'rgba(221,51,51,.07)',    border: 'rgba(221,51,51,.2)'   },
  purple: { text: '#a78bfa',   bg: 'rgba(167,139,250,.07)',  border: 'rgba(167,139,250,.18)'},
  gold:   { text: MIZAR_GOLD,  bg: 'rgba(201,164,67,.07)',   border: 'rgba(201,164,67,.20)' },
};

// ─── PUNTOS DE DOLOR ─────────────────────────────────────────────────────────

const DOLORES = [
  { titulo: 'Cada pago se digita dos o tres veces', desc: 'Libro diario, control por proyecto y, en Cúcuta, otro Excel y un Drive. Más de 1.500 movimientos escritos a mano desde 2024.', icon: FileSpreadsheet, tint: 'amber' },
  { titulo: 'La mora casi nunca se cobra', desc: 'Calcularla a mano toma tiempo, así que muchas veces no se hace y el cliente paga cuando quiere.', icon: Calculator, tint: 'red' },
  { titulo: 'El dinero se revuelve entre cuentas', desc: 'Varios proyectos y sociedades entran a las mismas cuentas, y una parte llega en efectivo o a cuentas personales.', icon: Landmark, tint: 'blue' },
  { titulo: 'Sin foto al día para decidir', desc: 'El flujo de caja y el informe a socios se arman con fórmulas a mano que se rompen cuando cambian los socios.', icon: Users, tint: 'purple' },
];

// ─── HOY EN EXCEL FRENTE A CON EL SISTEMA ────────────────────────────────────

const ANTES_DESPUES: { tema: string; hoy: string; con: string; icon: React.ElementType }[] = [
  { tema: 'Registro de pagos', hoy: 'Se digita en el libro diario y otra vez en el control de cada proyecto.', con: 'Se registra una sola vez y alimenta todo lo demás.', icon: Wallet },
  { tema: 'Estado de cuenta', hoy: 'Se arma a mano, pestaña por pestaña.', con: 'Sale en segundos con la cédula, en PDF y listo para enviar.', icon: Search },
  { tema: 'Mora y abonos', hoy: 'Se calculan a mano y muchas veces no se cobran.', con: 'Se calculan solos con la tasa que defina Mizar.', icon: Calculator },
  { tema: 'Pagos por WhatsApp', hoy: 'El soporte se revisa a ojo; ya llegaron soportes repetidos.', con: 'El cliente reporta o paga por link; el sistema bloquea duplicados y tesorería aprueba en lote.', icon: MessageSquare },
  { tema: 'Cobranza', hoy: 'Recordatorios y llamadas dependen de la memoria del equipo.', con: 'Recordatorios automáticos; llamada solo al que se atrasa.', icon: BellRing },
  { tema: 'Bancos y efectivo', hoy: 'Dinero de varias sociedades mezclado; efectivo y cuentas personales sin control.', con: 'Cada peso con su sociedad, alerta de lo que falta trasladar y extractos conciliados.', icon: Landmark },
  { tema: 'Informe a socios', hoy: 'Fórmulas a mano que hay que rehacer cuando cambia un socio.', con: 'Informe por socio con el porcentaje vigente en cada fecha.', icon: Users },
  { tema: 'Flujo de caja', hoy: 'Consolidado manual, a veces incompleto.', con: 'Programado, recogido y gastado del grupo, al día.', icon: TrendingUp },
];

// ─── TRES ETAPAS, NUEVE MÓDULOS, CADA UNO CON SU PRECIO ──────────────────────

type Extra = { nombre: string; precio: number; semanas: string; descripcion: string; items: string[] };
type Modulo = {
  num: string; etapa: number; nombre: string; icon: React.ElementType; color: string; colorAlpha: string; colorBorder: string;
  semanas: string; precio: number; descripcion: string; items: string[]; entregable: string; extra?: Extra;
};

// Cada etapa deja una parte de la aplicación funcionando y se puede usar sola.
const ETAPAS = [
  { num: 1, nombre: 'Cartera y pagos', lema: 'El día a día del cobro', semanas: 'Semanas 1 a 7', color: MIZAR_GOLD, colorAlpha: 'rgba(201,164,67,.08)', colorBorder: 'rgba(201,164,67,.30)',
    resultado: 'Se retiran el libro diario y los estados de cuenta en Excel.' },
  { num: 2, nombre: 'Cobranza y cliente', lema: 'Que la plata entre a tiempo', semanas: 'Semanas 8 a 11', color: '#38bdf8', colorAlpha: 'rgba(56,189,248,.07)', colorBorder: 'rgba(56,189,248,.28)',
    resultado: 'El sistema dice a quién escribir, a quién llamar y qué se acordó.' },
  { num: 3, nombre: 'Dinero, socios y gerencia', lema: 'Decidir con números reales', semanas: 'Semanas 12 a 18', color: '#00bfa5', colorAlpha: 'rgba(0,191,165,.07)', colorBorder: 'rgba(0,191,165,.28)',
    resultado: 'Informe a socios y flujo de caja salen del sistema; se retiran todos los Excel.' },
];

const E1 = { color: MIZAR_GOLD, colorAlpha: 'rgba(201,164,67,.10)', colorBorder: 'rgba(201,164,67,.28)' };
const E2 = { color: '#38bdf8', colorAlpha: 'rgba(56,189,248,.10)', colorBorder: 'rgba(56,189,248,.28)' };
const E3 = { color: '#00bfa5', colorAlpha: 'rgba(0,191,165,.10)', colorBorder: 'rgba(0,191,165,.28)' };

const MODULOS: Modulo[] = [
  { num: '01', etapa: 1, ...E1, icon: Building2, semanas: 'Semanas 1 y 2', precio: 1200000,
    nombre: 'Base de las dos empresas y sus sociedades',
    descripcion: 'Mizar y Mi Lote en un solo sistema, cada una con sus cuentas y sus reglas.',
    items: [
      'Vista por empresa y vista consolidada del grupo',
      'Sociedades por proyecto, con sus cuentas y sus recibos',
      'Reglas de cada empresa: mora en Bucaramanga, cuota fija en Cúcuta',
      'Cada persona ve solo lo suyo y todo cambio queda registrado',
    ],
    entregable: 'Empresas, sociedades, cuentas y usuarios listos' },
  { num: '02', etapa: 1, ...E1, icon: UserPlus, semanas: 'Semanas 3 y 4', precio: 2300000,
    nombre: 'Clientes, planes de pago y paso de los Excel',
    descripcion: 'La venta se registra una vez, con su plan, y se acaban los Excel paralelos.',
    items: [
      'Una ficha por cliente, aunque compre en las dos empresas',
      'Plan de pagos desde la promesa, con capital e interés separados',
      'Simulador de lotes de Cúcuta con la lista de precios',
      'Carga de los Excel actuales, depurados, con la administración anterior de Cúcuta',
    ],
    entregable: 'Todos los contratos cargados con su plan' },
  { num: '03', etapa: 1, ...E1, icon: Receipt, semanas: 'Semanas 5 a 7', precio: 2600000,
    nombre: 'Pagos, mora y estado de cuenta',
    descripcion: 'Cada pago se registra una vez y el estado de cuenta sale en segundos.',
    items: [
      'Pagos y abonos con su recibo y su soporte guardados',
      'Mora y abonos a capital calculados solos',
      'Control del dinero recibido en efectivo o en cuentas personales',
      'Estado de cuenta en PDF, listo para enviar por WhatsApp',
    ],
    entregable: '20 contratos con el mismo saldo que el Excel' },
  { num: '04', etapa: 1, ...E1, icon: MessageSquare, semanas: 'Semanas 6 y 7', precio: 1700000,
    nombre: 'Pagos por WhatsApp',
    descripcion: 'El cliente paga o reporta desde el chat; tesorería aprueba sin perseguir soportes.',
    items: [
      'Reporte de pago con comprobante, o link de pago',
      'Bloqueo de soportes repetidos y alerta de comprobantes dudosos',
      'Cruce con el extracto del banco y aprobación en lote',
      'Recibo automático al cliente',
    ],
    entregable: 'Un pago por link y uno por comprobante, aprobados y con recibo' },
  { num: '05', etapa: 2, ...E2, icon: TriangleAlert, semanas: 'Semanas 8 y 9', precio: 1800000,
    nombre: 'Morosos, acuerdos y cruces de cartera',
    descripcion: 'Saber a quién cobrar y cómo negociar con quien se atrasa.',
    items: [
      'Morosos al momento, según la antigüedad de la deuda',
      'Acuerdos de pago y cruces de cartera, con aprobación',
      'Reglas de Cúcuta: alerta de tres cuotas y bono por referido',
      'Historial de cada gestión de cobro',
    ],
    entregable: 'Un acuerdo y un cruce aprobados de punta a punta' },
  { num: '06', etapa: 2, ...E2, icon: BellRing, semanas: 'Semana 10', precio: 700000,
    nombre: 'Recordatorios de cobro',
    descripcion: 'El cobro deja de depender de la memoria del equipo.',
    items: [
      'Recordatorios automáticos según la fecha de corte de cada cliente',
      'Mensaje al buen pagador; llamada al que se atrasa',
      'Solo en horarios permitidos y a quien lo autorizó',
    ],
    entregable: 'Recordatorios funcionando',
    extra: { nombre: 'Recompensas por pagar a tiempo', precio: 800000, semanas: 'Semana 11',
      descripcion: 'Premia al que paga a tiempo, con una prueba medida.',
      items: ['Rachas y beneficios por pronto pago', 'Campañas como la de la prima', 'Prueba en un proyecto por empresa, con su resultado medido'] } },
  { num: '07', etapa: 3, ...E3, icon: Landmark, semanas: 'Semanas 12 y 13', precio: 1900000,
    nombre: 'Ingresos y bancos',
    descripcion: 'Todo el dinero del grupo, cuadrado con los bancos.',
    items: [
      'Todos los ingresos por empresa y sociedad, no solo las cuotas',
      'Extractos cuadrados cuenta por cuenta',
      'Traslados entre cuentas y entre sociedades',
      'Información lista para el contador',
    ],
    entregable: 'Una cuenta bancaria cuadrada al peso',
    extra: { nombre: 'Contabilidad completa', precio: 2200000, semanas: 'Semanas 16 y 17',
      descripcion: 'La contabilidad de ingresos y cartera se hace sola.',
      items: ['Comprobantes contables automáticos', 'Libros y estados financieros por sociedad', 'Balance comparable con el del contador'] } },
  { num: '08', etapa: 3, ...E3, icon: Scale, semanas: 'Semanas 14 y 15', precio: 1900000,
    nombre: 'Socios, flujo de caja e informes',
    descripcion: 'Cada socio recibe su informe y gerencia ve el flujo real del grupo.',
    items: [
      'Porcentajes por proyecto y por cliente, con fecha de vigencia',
      'Informe por socio: se recogió, se gastó, le corresponde',
      'Comisiones causadas, pagadas y pendientes',
      'Flujo de caja programado frente a real, con los gastos de compras y caja menor',
      '16 informes de gerencia',
    ],
    entregable: 'Informe a socios y flujo de un mes iguales a los de gerencia' },
  { num: '09', etapa: 3, ...E3, icon: GraduationCap, semanas: 'Semana 18', precio: 900000,
    nombre: 'Puesta en marcha',
    descripcion: 'El equipo trabaja solo y los Excel se retiran con los saldos cuadrados.',
    items: [
      'Capacitación por rol al cierre de cada etapa',
      'Trabajo en paralelo con el Excel hasta que todo cuadre',
      'Garantía de 30 días',
    ],
    entregable: '100 % de los saldos iguales al Excel' },
];

const PRECIO_ESENCIAL = MODULOS.reduce((s, m) => s + m.precio, 0);
const PRECIO_OPCIONAL = MODULOS.reduce((s, m) => s + (m.extra?.precio ?? 0), 0);
const PRECIO_TOTAL = PRECIO_ESENCIAL + PRECIO_OPCIONAL;
const DESCUENTO_ANTICIPO = 0.05;
const PRECIO_ANTICIPADO = Math.round(PRECIO_TOTAL * (1 - DESCUENTO_ANTICIPO));
const precioEtapa = (n: number) => MODULOS.filter(m => m.etapa === n).reduce((s, m) => s + m.precio, 0);
const opcionalEtapa = (n: number) => MODULOS.filter(m => m.etapa === n).reduce((s, m) => s + (m.extra?.precio ?? 0), 0);

const cop = (n: number) => '$' + n.toLocaleString('es-CO');

// ─── LO QUE PIDIERON Y DÓNDE QUEDA ───────────────────────────────────────────
// Sale de la reunión del 23-sep-2026 y de los Excel compartidos después.

const PEDIDOS: { etapa: number; items: { pedido: string; donde: string }[] }[] = [
  { etapa: 1, items: [
    { pedido: 'Un solo registro en vez de varios Excel', donde: '03' },
    { pedido: 'Cliente y plan creados una vez, desde la promesa', donde: '02' },
    { pedido: 'Capital, interés y mora por separado', donde: '02 · 03' },
    { pedido: 'Mora con tasa configurable y abonos a capital', donde: '03' },
    { pedido: 'Estado de cuenta al digitar la cédula', donde: '03' },
    { pedido: 'Recibos y soportes guardados, no en carpetas', donde: '03' },
    { pedido: 'Pagos sin identificar y administración anterior de Cúcuta', donde: '02 · 03' },
    { pedido: 'Reporte de pago por WhatsApp, sin soportes repetidos', donde: '04' },
  ] },
  { etapa: 2, items: [
    { pedido: 'Morosos a pedido', donde: '05' },
    { pedido: 'Acuerdos de pago con la misma calculadora', donde: '05' },
    { pedido: 'Regla de tres cuotas y bono por referido de Cúcuta', donde: '05' },
    { pedido: 'Recordatorios automáticos por fecha de corte', donde: '06' },
    { pedido: 'Campañas y rachas al estilo Duolingo', donde: '06 · opción' },
  ] },
  { etapa: 3, items: [
    { pedido: 'Varias cuentas bancarias, cuadradas con el extracto', donde: '07' },
    { pedido: 'Socios con porcentajes que cambian en el tiempo', donde: '08' },
    { pedido: 'Informe sencillo para cada socio', donde: '08' },
    { pedido: 'Comisiones de venta', donde: '08' },
    { pedido: 'Flujo de caja para decidir nuevos proyectos', donde: '08' },
  ] },
];

// ─── FUERA DE ALCANCE ────────────────────────────────────────────────────────

const FUERA = [
  { titulo: 'Gamificación avanzada', desc: 'Se propone después, con datos de recaudo para medirla.', icon: Gamepad2, tint: 'purple' },
  { titulo: 'Conexión directa con los bancos', desc: 'No existe en Colombia; se usa la carga de extractos.', icon: Landmark, tint: 'blue' },
  { titulo: 'Definir la tasa de mora', desc: 'La fija Mizar con su asesor; hasta entonces la mora queda apagada.', icon: Scale, tint: 'red' },
  { titulo: 'Facturación electrónica y Siigo', desc: 'Siguen en el sistema contable actual, que recibe la información.', icon: FileText, tint: 'amber' },
  { titulo: 'Portal del cliente y bot de ventas', desc: 'El cliente se atiende por WhatsApp; el bot es otro servicio.', icon: Puzzle, tint: 'teal' },
  { titulo: 'Informes con inteligencia artificial', desc: 'Paso siguiente, cuando los datos ya vivan en la plataforma.', icon: Zap, tint: 'gold' },
];

// ─── DECISIONES PARA EL ARRANQUE ─────────────────────────────────────────────
// Se construye con el valor por defecto hasta que Mizar confirme otra cosa.

const PENDIENTES: { tema: string; porDefecto: string }[] = [
  { tema: 'Tasa de mora', porDefecto: 'Apagada hasta que Mizar la firme' },
  { tema: 'Empresa de Cúcuta y sociedades por proyecto', porDefecto: 'Según el libro de dineros recibidos' },
  { tema: 'Contabilidad y Helisa', porDefecto: 'Conviven un año; el sistema exporta a Helisa' },
  { tema: 'Pasarela de pagos', porDefecto: 'Una por empresa; la comisión la asume Mizar' },
  { tema: 'Dinero en efectivo o cuentas personales', porDefecto: 'Alerta si no se traslada en 3 días hábiles' },
  { tema: 'Cruces de cartera y pagos en especie', porDefecto: 'Aprueba gerencia; en especie, con avalúo' },
  { tema: 'Provisión y castigo de cartera', porDefecto: 'Según el contador, sin castigo automático' },
  { tema: 'Descuento por pronto pago', porDefecto: 'Apagado hasta que Mizar lo defina' },
  { tema: 'Recompensas', porDefecto: 'Prueba en un proyecto por empresa, con tope mensual' },
];

// ─── TÉRMINOS ────────────────────────────────────────────────────────────────

const TERMINOS: { titulo: string; desc: string; icon: React.ElementType }[] = [
  { titulo: 'Aceptación', desc: 'Mizar confirma por WhatsApp, correo o de palabra su aceptación y la forma de pago. Luego se firma el contrato y se hace el primer pago.', icon: CheckCircle },
  { titulo: 'Forma de pago', desc: 'Se contrata la implementación completa: los nueve módulos y sus dos opciones. Se paga 50 % al iniciar y 50 % al terminar la implementación, o el total por anticipado con 5 % de descuento.', icon: FileText },
  { titulo: 'Pago mensual (por confirmar)', desc: '$150.000 adicionales al mes sobre lo que Mizar ya paga por la plataforma, desde que el primer módulo entra en uso.', icon: Clock },
  { titulo: 'WhatsApp y pasarela', desc: 'Las tarifas de Meta por mensaje y la comisión de la pasarela las asume Mizar al costo, sin margen de Sixteam.', icon: MessageSquare },
  { titulo: 'Duración', desc: '18 semanas en tres etapas. Arranca cuando el módulo de compras esté en uso.', icon: Calendar },
  { titulo: 'Lo que aporta Mizar', desc: 'Los Excel actuales, una promesa y un contrato de ejemplo, las cuentas de cada sociedad y una persona responsable por sede.', icon: ClipboardList },
  { titulo: 'Datos personales y cobranza', desc: 'Mizar cuenta con la autorización de sus clientes para escribirles; sin autorización no salen recordatorios.', icon: ShieldCheck },
  { titulo: 'Soporte', desc: 'Respuesta en máximo 4 horas hábiles por WhatsApp o correo. Garantía de 30 días desde cada entrega.', icon: Shield },
  { titulo: 'Cambios de alcance', desc: 'Lo que no está en esta propuesta se cotiza aparte.', icon: AlertCircle },
  { titulo: 'Propiedad y confidencialidad', desc: 'Los datos son de Mizar. Sixteam guarda total confidencialidad durante el contrato y después.', icon: Lock },
  { titulo: 'Vigencia', desc: '30 días calendario desde su emisión.', icon: Stamp },
];

// ─── SECCIONES NAV ───────────────────────────────────────────────────────────

const SECCIONES = [
  { id: 'resumen',    label: 'Resumen'     },
  { id: 'beneficios', label: 'Beneficios'  },
  { id: 'demo',       label: 'Demo'        },
  { id: 'incluye',    label: 'Módulos'     },
  { id: 'pedidos',    label: 'Lo pedido'   },
  { id: 'alcance',    label: 'Alcance'     },
  { id: 'inversion',  label: 'Inversión'   },
  { id: 'vigencia',   label: 'Vigencia'    },
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

const TagLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="font-lato text-[#00bfa5] text-[13px] uppercase tracking-[0.22em] font-medium">{children}</span>
);
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-poppins font-extrabold text-white mt-2 mb-2 leading-tight"
    style={{ fontSize: 'clamp(1.8125rem, 4.375vw, 2.625rem)' }}>
    {children}
  </h2>
);
const Rule = () => (
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: `linear-gradient(90deg,${MIZAR_GOLD},#00bfa5)` }} />
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const MizarCarteraProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [moduloActivo, setModuloActivo] = useState<number | null>(null);
  const [terminoActivo, setTerminoActivo] = useState<number | null>(null);

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

  const s1 = useVisible(); const s2 = useVisible(); const s3 = useVisible(); const s8 = useVisible();
  const s5 = useVisible(); const s6 = useVisible(); const s7 = useVisible(); const s9 = useVisible();

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
            style={{ background: 'radial-gradient(circle, rgba(201,164,67,.06) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(201,164,67,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.022]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        </div>

        <div className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-b" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
          <div className="flex items-center gap-6">
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
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center flex-shrink-0 h-9">
                <img src="/mizar-logo.png" alt="Mizar" className="h-full w-auto object-contain rounded"
                  style={{ filter: 'drop-shadow(0 1px 4px rgba(201,164,67,.3))' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            </div>
          </div>
          <span className="font-lato text-[#00bfa5]/80 text-[13px] uppercase tracking-[0.2em] border border-[#00bfa5]/20 rounded-full px-3 py-1.5">Confidencial</span>
        </div>

        <style>{`
          @keyframes cover-spin-slow { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
          @keyframes cover-spin-rev  { from{transform:rotate(0deg)}to{transform:rotate(-360deg)} }
          @keyframes cover-pulse-glow { 0%,100%{opacity:.07;transform:scale(1)} 50%{opacity:.14;transform:scale(1.12)} }
          @keyframes cover-float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
          .cover-ring-1{animation:cover-spin-slow 22s linear infinite}
          .cover-ring-2{animation:cover-spin-rev 16s linear infinite}
          .cover-glow{animation:cover-pulse-glow 4s ease-in-out infinite}
          .cover-float{animation:cover-float 5s ease-in-out infinite}
          @media (prefers-reduced-motion: reduce){.cover-ring-1,.cover-ring-2,.cover-glow,.cover-float{animation:none}}
        `}</style>

        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta de trabajo y cotización · Nuevos módulos de la plataforma</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${MIZAR_GOLD}, #8f7226)` }}>
                  <Wallet className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">Mizar · Mi Lote</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(201,164,67,.12)', border: '1px solid rgba(201,164,67,.28)', color: MIZAR_GOLD }}>
                  Sistema financiero de ingresos
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 4.8rem)' }}>
                Propuesta<br />
                <span style={{ background: `linear-gradient(90deg,${MIZAR_GOLD},#00bfa5)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Comercial
                </span>
              </h1>
              <p className="font-lato text-white/55 text-xl leading-relaxed mb-5">{META.objetivo}</p>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Link to={DEMO_PATH}
                  className="no-print inline-flex items-center gap-2 px-5 py-3 rounded-full font-poppins font-semibold text-[15px] text-white transition-transform hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(90deg, #1d70a2, #00bfa5)', boxShadow: '0 4px 20px rgba(0,191,165,.25)' }}>
                  <MousePointerClick className="w-4 h-4" /> Probar la demo
                </Link>
                <div className="inline-flex flex-wrap items-center gap-1.5 px-4 py-2 rounded-xl"
                  style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)' }}>
                  <span className="font-poppins font-bold text-white/80 text-[15px] sm:text-[18px]">Process</span>
                  <span className="font-poppins font-bold text-[#1d70a2] text-[15px] sm:text-[18px]">+</span>
                  <span className="font-poppins font-bold text-[#1d70a2] text-[15px] sm:text-[18px]">Technology</span>
                  <span className="font-poppins font-bold text-[#00bfa5] text-[15px] sm:text-[18px]">+</span>
                  <span className="font-poppins font-bold text-[#00bfa5] text-[15px] sm:text-[18px]">People</span>
                  <span className="font-poppins font-bold text-white/50 text-[15px] sm:text-[18px]">=</span>
                  <span className="font-poppins font-black text-[#00bfa5] text-[15px] sm:text-[18px]">Growth</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  { icon: Calendar, text: META.fecha },
                  { icon: MapPin,   text: META.lugar },
                  { icon: Users,    text: META.destinatarios },
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
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                  {['1. Resumen','2. Lo que cambia','3. Pruebe la demo','4. Tres etapas, nueve módulos','5. Lo que pidieron','6. Alcance','7. Inversión','8. Términos'].map((item, i) => (
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
                  style={{ background: 'radial-gradient(circle, rgba(201,164,67,.08) 0%, rgba(0,191,165,.04) 50%, transparent 70%)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full" style={{ border: '1px solid rgba(201,164,67,.12)' }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(0,191,165,.15)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: MIZAR_GOLD, boxShadow: '0 0 6px rgba(201,164,67,.8)' }} />
                </div>
              </div>
              <div className="cover-float relative z-10 flex flex-col items-center gap-6 w-full px-6">
                <div className="flex flex-col items-center gap-1">
                  <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-20 w-auto object-contain"
                    style={{ filter: 'drop-shadow(0 4px 20px rgba(0,191,165,.45))' }} />
                  <span className="font-poppins font-black text-white/30 text-[11px] uppercase tracking-[0.2em]">Sixteam.pro</span>
                </div>
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.08))' }} />
                  <div className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)' }}>
                    <span className="font-poppins font-black text-white/40 text-[20px] leading-none">×</span>
                  </div>
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,.08), transparent)' }} />
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-2xl p-5 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(201,164,67,.18), rgba(201,164,67,.06))', border: '1px solid rgba(201,164,67,.3)', boxShadow: '0 4px 30px rgba(201,164,67,.18)' }}>
                    <img src="/mizar-logo.png" alt="Mizar" className="h-14 w-auto object-contain rounded"
                      style={{ filter: 'drop-shadow(0 2px 12px rgba(201,164,67,.5))' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <div className="text-center">
                    <p className="font-poppins font-bold text-white/80 text-[17px] tracking-tight">Mizar Diseño y Construcción</p>
                    <p className="font-lato text-[13px] uppercase tracking-[0.2em] mt-1" style={{ color: MIZAR_GOLD }}>Bucaramanga · Mi Lote Cúcuta</p>
                  </div>
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
      <main className="max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-20 space-y-24">

        {/* ─ 01 RESUMEN ─ */}
        <section id="resumen" ref={s1.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s1.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>01 · Resumen</TagLabel>
          <SectionTitle>Un solo sistema para el dinero que entra</SectionTitle>
          <Rule />

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-8">
            <p>
              Hoy la cartera de Mizar y de Mi Lote vive en varios Excel que no se hablan entre sí y que el equipo llena a mano, pago por pago. Proponemos reemplazarlos por un sistema dentro de la <strong className="text-white/90 font-semibold">Plataforma Mizar</strong>, donde ya funcionan compras y caja menor.
            </p>
          </div>

          <div className="rounded-2xl p-6 sm:p-7 mb-8 relative overflow-hidden"
            style={{ background: 'rgba(201,164,67,.06)', border: '1px solid rgba(201,164,67,.22)' }}>
            <Target className="w-6 h-6 mb-3" style={{ color: MIZAR_GOLD }} />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[22px] leading-snug">
              «Saber mes a mes cuánto dinero está programado, cuánto se recogió y cuánto se puede gastar, para decidir si tomamos más proyectos.»
            </p>
            <p className="font-lato text-white/40 text-[14px] mt-3">Objetivo planteado por gerencia en la reunión del 23 de septiembre</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[
              { v: '3 etapas', s: 'Cada una funciona sola' },
              { v: '18 semanas', s: 'Implementación de principio a fin' },
              { v: cop(PRECIO_TOTAL), s: `Todo incluido · ${cop(PRECIO_ANTICIPADO)} pagando por anticipado` },
            ].map((k, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
                <p className="font-poppins font-black text-white text-[24px] leading-tight">{k.v}</p>
                <p className="font-lato text-white/45 text-[14px]">{k.s}</p>
              </div>
            ))}
          </div>

          <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#00bfa5]" /> Lo que cuesta hoy trabajar en Excel
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DOLORES.map((h, i) => {
              const Icon = h.icon; const t = TINT[h.tint];
              return (
                <div key={i} className="rounded-xl p-4 flex gap-3" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                  <Icon className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: t.text }} />
                  <div>
                    <p className="font-poppins font-semibold text-white/90 text-[17px] mb-1">{h.titulo}</p>
                    <p className="font-lato text-white/50 text-[15px] leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─ 02 BENEFICIOS ─ */}
        <section id="beneficios" ref={s2.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>02 · Lo que cambia</TagLabel>
          <SectionTitle>Del Excel a un sistema conectado</SectionTitle>
          <Rule />

          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="hidden sm:grid grid-cols-[1.1fr_1.4fr_1.6fr] gap-4 px-5 py-3" style={{ background: 'rgba(255,255,255,.04)' }}>
              <span className="font-lato text-white/35 text-[12px] uppercase tracking-wider">Tema</span>
              <span className="font-lato text-[#f87171]/80 text-[12px] uppercase tracking-wider">Hoy, en Excel</span>
              <span className="font-lato text-[#00bfa5] text-[12px] uppercase tracking-wider">Con el sistema</span>
            </div>
            {ANTES_DESPUES.map((r, i) => {
              const Icon = r.icon;
              return (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-[1.1fr_1.4fr_1.6fr] gap-1.5 sm:gap-4 px-5 py-4"
                  style={{ borderTop: i ? '1px solid rgba(255,255,255,.06)' : undefined, background: 'rgba(255,255,255,.02)' }}>
                  <p className="font-poppins font-semibold text-white/85 text-[16px] flex items-center gap-2">
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: MIZAR_GOLD }} />{r.tema}
                  </p>
                  <p className="font-lato text-white/45 text-[15px] leading-snug"><span className="sm:hidden text-[#f87171]/80">Hoy: </span>{r.hoy}</p>
                  <p className="font-lato text-white/85 text-[15px] leading-snug flex gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" /><span>{r.con}</span>
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { value: '1 registro', label: 'en vez de 3 archivos' },
              { value: 'Segundos', label: 'para un estado de cuenta' },
              { value: 'Siempre', label: 'se calcula la mora' },
              { value: '0 Excel', label: 'de control al terminar' },
            ].map((k, i) => (
              <div key={i} className="rounded-xl p-4 text-center"
                style={{ background: i < 2 ? 'rgba(201,164,67,.07)' : 'rgba(0,191,165,.06)', border: i < 2 ? '1px solid rgba(201,164,67,.20)' : '1px solid rgba(0,191,165,.18)' }}>
                <p className="font-poppins font-black text-white text-[20px] leading-tight">{k.value}</p>
                <p className="font-lato text-white/45 text-[13px]">{k.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─ 03 DEMO ─ */}
        <section id="demo" ref={s8.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s8.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 · Pruebe la demo</TagLabel>
          <SectionTitle>Véalo funcionando antes de decidir</SectionTitle>
          <Rule />

          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(0,191,165,.08) 0%, rgba(3,13,26,.95) 100%)', border: '1px solid rgba(0,191,165,.28)', boxShadow: '0 4px 32px rgba(0,191,165,.10)' }}>
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-8 items-center">
              <div>
                <p className="font-lato text-white/60 text-[18px] leading-relaxed mb-5">
                  Una demo con datos ficticios para que el equipo la pruebe. Nada de lo que se haga ahí se guarda.
                </p>
                <ul className="space-y-2.5 mb-6">
                  {[
                    'Buscar un cliente y sacar su estado de cuenta en PDF',
                    'Registrar un pago y ver la mora y el capital calculados',
                    'Aprobar pagos reportados por WhatsApp',
                    'Ver el informe a socios y el flujo de caja del grupo',
                  ].map((t, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
                      <span className="font-lato text-white/70 text-[16px] leading-snug">{t}</span>
                    </li>
                  ))}
                </ul>
                <Link to={DEMO_PATH}
                  className="no-print inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-poppins font-semibold text-[16px] text-white transition-transform hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(90deg, #1d70a2, #00bfa5)', boxShadow: '0 4px 20px rgba(0,191,165,.25)' }}>
                  Abrir la demo <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Mini vista previa */}
              <Link to={DEMO_PATH} className="no-print block rounded-xl overflow-hidden transition-transform hover:scale-[1.01]"
                aria-label="Abrir la demo del módulo de cartera"
                style={{ background: '#f5f8fa', border: '1px solid rgba(255,255,255,.15)', boxShadow: '0 12px 40px rgba(0,0,0,.35)' }}>
                <div className="flex">
                  <div className="w-16 sm:w-20 flex-shrink-0 p-2.5 space-y-2" style={{ background: '#0a2342' }}>
                    <div className="h-2.5 w-10 rounded" style={{ background: 'rgba(255,255,255,.7)' }} />
                    {[0, 1, 2, 3, 4].map(k => (
                      <div key={k} className="h-2 rounded" style={{ background: k === 1 ? '#d12e45' : 'rgba(255,255,255,.18)', width: k === 1 ? '90%' : '75%' }} />
                    ))}
                  </div>
                  <div className="flex-1 p-3 space-y-2.5">
                    <div className="flex items-center gap-2 rounded-md px-2 py-1.5" style={{ background: '#fff', border: '1px solid #dfe3eb' }}>
                      <Search className="w-3 h-3" style={{ color: '#5a6472' }} />
                      <span style={{ color: '#5a6472', fontSize: 10 }}>1.098.765.432</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[['Pagado', '#245645'], ['Saldo', '#2c2f36'], ['Vencido', '#9b4137'], ['Mora', '#a65b08']].map(([l, c]) => (
                        <div key={l} className="rounded-md p-1.5" style={{ background: '#fff', border: '1px solid #dfe3eb' }}>
                          <div style={{ color: '#5a6472', fontSize: 8 }}>{l}</div>
                          <div className="h-1.5 mt-1 rounded" style={{ background: c, width: '80%' }} />
                        </div>
                      ))}
                    </div>
                    <div className="rounded-md p-2 space-y-1.5" style={{ background: '#fff', border: '1px solid #dfe3eb' }}>
                      {[0, 1, 2, 3].map(k => (
                        <div key={k} className="flex items-center gap-2">
                          <div className="h-1.5 rounded flex-1" style={{ background: '#eaf0f6' }} />
                          <span className="rounded px-1.5" style={{ fontSize: 7, background: k === 0 ? '#f8e6e2' : k === 1 ? '#fff2d8' : '#e2eee8', color: k === 0 ? '#9b4137' : k === 1 ? '#a65b08' : '#245645' }}>
                            {k === 0 ? 'Vencida' : k === 1 ? 'Parcial' : 'Pagada'}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <span className="rounded-md px-2 py-1 text-white" style={{ background: '#d12e45', fontSize: 9 }}>Registrar pago</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="px-6 sm:px-8 py-3.5 flex items-center gap-2 border-t" style={{ borderColor: 'rgba(255,255,255,.06)', background: 'rgba(255,255,255,.02)' }}>
              <Monitor className="w-4 h-4 text-white/35 flex-shrink-0" />
              <p className="font-lato text-white/40 text-[14px]">
                Funciona en computador y celular. Datos ficticios; la tasa de mora es solo un ejemplo.
              </p>
            </div>
          </div>
        </section>

        {/* ─ 04 MÓDULOS ─ */}
        <section id="incluye" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 · Tres etapas, nueve módulos</TagLabel>
          <SectionTitle>Qué recibe Mizar y cuánto cuesta cada parte</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-6">
            Cada etapa deja una parte del sistema funcionando y se puede usar sola. Toca un módulo para ver qué incluye.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
            {ETAPAS.map((e, k) => (
              <div key={e.num} className="rounded-xl p-4 relative" style={{ background: e.colorAlpha, border: `1px solid ${e.colorBorder}` }}>
                <p className="font-lato text-[12px] uppercase tracking-wider mb-1" style={{ color: e.color }}>Etapa {e.num} · {e.semanas}</p>
                <p className="font-poppins font-bold text-white text-[18px] leading-tight">{e.nombre}</p>
                <p className="font-lato text-white/45 text-[14px] mb-2">{e.lema}</p>
                <p className="font-poppins font-black text-white/85 text-[18px]">{cop(precioEtapa(e.num))}
                  {opcionalEtapa(e.num) > 0 && <span className="font-lato font-normal text-white/40 text-[13px]"> + opción {cop(opcionalEtapa(e.num))}</span>}
                </p>
                {k < ETAPAS.length - 1 && (
                  <ArrowRight className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                )}
              </div>
            ))}
          </div>

          <div className="space-y-10">
            {ETAPAS.map((e) => (
              <div key={e.num}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                  <p className="font-poppins font-black text-[20px]" style={{ color: e.color }}>Etapa {e.num} · {e.nombre}</p>
                  <span className="font-lato text-white/40 text-[14px]">{e.semanas}</span>
                </div>
                <p className="font-lato text-white/55 text-[15px] mb-4 flex items-start gap-2">
                  <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: e.color }} />
                  <span><strong className="text-white/80">Al terminarla:</strong> {e.resultado}</span>
                </p>

                <div className="space-y-3">
                  {MODULOS.map((mod, i) => {
                    if (mod.etapa !== e.num) return null;
                    const Icon = mod.icon;
                    const open = moduloActivo === i;
                    return (
                      <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                        style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${mod.colorBorder}` : '1px solid rgba(255,255,255,.07)' }}>
                        <button onClick={() => setModuloActivo(open ? null : i)}
                          className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                          <div className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center flex-shrink-0"
                            style={{ background: open ? mod.colorAlpha : 'rgba(255,255,255,.05)' }}>
                            <Icon className="w-4 h-4" style={{ color: open ? mod.color : 'rgba(255,255,255,.4)' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`font-poppins font-bold text-[18px] ${open ? 'text-white' : 'text-white/80'}`}>
                              <span style={{ color: mod.color }}>{mod.num} · </span>{mod.nombre}
                            </span>
                            <p className="font-lato text-white/50 text-[15px] mt-0.5">{mod.descripcion}</p>
                          </div>
                          <div className="flex-shrink-0 text-right ml-2">
                            <p className="font-poppins font-black text-[17px] leading-tight" style={{ color: open ? mod.color : 'rgba(255,255,255,.8)' }}>{cop(mod.precio)}</p>
                            <p className="font-lato text-white/30 text-[12px]">{mod.semanas}</p>
                          </div>
                          <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ml-1 ${open ? 'rotate-90' : ''}`}
                            style={{ color: open ? mod.color : 'rgba(255,255,255,.3)' }} />
                        </button>

                        {open && (
                          <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                            <ul className="space-y-2 pt-4">
                              {mod.items.map((item, j) => (
                                <li key={j} className="flex items-start gap-2">
                                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: mod.color }} />
                                  <span className="font-lato text-white/70 text-[16px] flex-1">{item}</span>
                                </li>
                              ))}
                            </ul>
                            <p className="font-lato text-white/45 text-[14px] mt-3"><strong className="text-white/70">Se entrega cuando:</strong> {mod.entregable}.</p>

                            {mod.extra && (
                              <div className="mt-4 rounded-xl p-4" style={{ background: mod.colorAlpha, border: `1px dashed ${mod.colorBorder}` }}>
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                                    style={{ background: 'rgba(255,255,255,.06)', border: `1px solid ${mod.colorBorder}`, color: mod.color }}>Opcional</span>
                                  <p className="font-poppins font-bold text-white/90 text-[16px]">{mod.extra.nombre}</p>
                                  <p className="font-poppins font-black text-[16px] ml-auto" style={{ color: mod.color }}>+{cop(mod.extra.precio)}</p>
                                </div>
                                <p className="font-lato text-white/50 text-[14px] mb-2">{mod.extra.descripcion} {mod.extra.semanas}.</p>
                                <ul className="space-y-1.5">
                                  {mod.extra.items.map((item, j) => (
                                    <li key={j} className="flex items-start gap-2">
                                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: mod.color }} />
                                      <span className="font-lato text-white/65 text-[15px] flex-1">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─ 05 LO QUE PIDIERON ─ */}
        <section id="pedidos" ref={s9.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s9.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 · Lo que pidieron</TagLabel>
          <SectionTitle>Cada pedido de la reunión, resuelto</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-6">
            Lo que pidió el equipo el 23 de septiembre y el módulo donde queda.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PEDIDOS.map((g) => {
              const e = ETAPAS[g.etapa - 1];
              return (
                <div key={g.etapa} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,.03)', border: `1px solid ${e.colorBorder}` }}>
                  <p className="font-poppins font-bold text-[15px] px-4 py-3" style={{ color: e.color, background: e.colorAlpha }}>Etapa {e.num} · {e.nombre}</p>
                  <ul className="px-4 py-2">
                    {g.items.map((it, j) => (
                      <li key={j} className="flex items-start gap-2.5 py-2" style={{ borderTop: j ? '1px solid rgba(255,255,255,.05)' : undefined }}>
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: e.color }} />
                        <span className="font-lato text-white/70 text-[15px] leading-snug flex-1">{it.pedido}</span>
                        <span className="font-lato text-[11px] text-white/40 whitespace-nowrap mt-0.5">{it.donde}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─ 06 ALCANCE ─ */}
        <section id="alcance" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 · Alcance</TagLabel>
          <SectionTitle>Qué no incluye y qué decidimos al arrancar</SectionTitle>
          <Rule />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {FUERA.map((f, i) => {
              const Icon = f.icon; const t = TINT[f.tint];
              return (
                <div key={i} className="rounded-xl p-4 flex gap-3" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                  <Icon className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: t.text }} />
                  <div>
                    <p className="font-poppins font-semibold text-white/90 text-[16px]">{f.titulo}</p>
                    <p className="font-lato text-white/50 text-[15px] leading-snug">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(245,158,11,.05)', border: '1px solid rgba(245,158,11,.20)' }}>
            <p className="font-poppins font-semibold text-white/85 text-[17px] mb-1 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#f59e0b]" /> Decisiones que cerramos con Mizar al arrancar
            </p>
            <p className="font-lato text-white/45 text-[14px] mb-4">Mientras tanto, el sistema funciona con el valor indicado.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {PENDIENTES.map((p, i) => (
                <div key={i} className="font-lato text-[15px] leading-snug">
                  <span className="text-white/85 font-semibold">{p.tema}: </span>
                  <span className="text-white/50">{p.porDefecto}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─ 07 INVERSIÓN ─ */}
        <section id="inversion" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>07 · Inversión</TagLabel>
          <SectionTitle>Implementación completa.</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Incluye los nueve módulos y sus dos opciones, implementados de punta a punta en 18 semanas. Valores en pesos colombianos.
          </p>

          <div className="rounded-2xl overflow-hidden mb-8"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(201,164,67,.30)', boxShadow: '0 4px 32px rgba(201,164,67,.10)' }}>
            {ETAPAS.map((e) => (
              <div key={e.num}>
                <div className="flex flex-wrap items-baseline gap-x-3 px-4 sm:px-5 py-2.5" style={{ background: e.colorAlpha }}>
                  <p className="font-poppins font-bold text-[15px] w-full sm:w-auto sm:flex-1 min-w-0" style={{ color: e.color }}>Etapa {e.num} · {e.nombre}</p>
                  <p className="font-lato text-white/40 text-[13px]">{e.semanas}</p>
                  <p className="font-poppins font-bold text-white/80 text-[15px] whitespace-nowrap">Subtotal {cop(precioEtapa(e.num) + opcionalEtapa(e.num))}</p>
                </div>
                {MODULOS.filter(m => m.etapa === e.num).flatMap((m) => {
                  const filas = [{ k: m.num, num: m.num, nombre: m.nombre, precio: m.precio, color: m.color, border: m.colorBorder, opcional: false }];
                  if (m.extra) filas.push({ k: m.num + 'B', num: '', nombre: m.extra.nombre, precio: m.extra.precio, color: m.color, border: m.colorBorder, opcional: true });
                  return filas;
                }).map((f) => (
                  <div key={f.k} className="flex items-start gap-3 px-4 sm:px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,.05)' }}>
                    <span className="font-poppins font-black text-[14px] w-7 flex-shrink-0 pt-0.5" style={{ color: f.color }}>{f.num}</span>
                    <p className="font-poppins font-semibold text-white/85 text-[16px] leading-snug flex-1 min-w-0">
                      {f.nombre}
                      {f.opcional && (
                        <span className="ml-2 font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider align-middle"
                          style={{ background: 'rgba(255,255,255,.06)', border: `1px solid ${f.border}`, color: f.color }}>Opcional · incluido</span>
                      )}
                    </p>
                    <p className="font-poppins font-bold text-white/85 text-[16px] flex-shrink-0 whitespace-nowrap">{cop(f.precio)}</p>
                  </div>
                ))}
              </div>
            ))}
            <div className="px-4 sm:px-5 py-4 flex items-baseline justify-between gap-3" style={{ background: 'rgba(201,164,67,.07)', borderTop: '1px solid rgba(201,164,67,.30)' }}>
              <p className="font-poppins font-bold text-white text-[18px]">Total de la implementación</p>
              <p className="font-poppins font-black text-[26px] leading-none" style={{ color: MIZAR_GOLD }}>{cop(PRECIO_TOTAL)}</p>
            </div>
          </div>

          <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#00bfa5]" /> Dos formas de pago
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.10)' }}>
              <p className="font-poppins font-bold text-white text-[18px] mb-3">Pago en dos partes</p>
              <div className="space-y-2.5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-lato text-white/60 text-[15px]">50 % al iniciar</p>
                  <p className="font-poppins font-bold text-white/90 text-[17px]">{cop(PRECIO_TOTAL / 2)}</p>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-lato text-white/60 text-[15px]">50 % al terminar la implementación</p>
                  <p className="font-poppins font-bold text-white/90 text-[17px]">{cop(PRECIO_TOTAL / 2)}</p>
                </div>
                <div className="flex items-baseline justify-between gap-3 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,.08)' }}>
                  <p className="font-lato text-white/80 text-[15px] font-bold">Total</p>
                  <p className="font-poppins font-black text-white text-[20px]">{cop(PRECIO_TOTAL)}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl p-5 relative" style={{ background: 'rgba(0,191,165,.07)', border: '1px solid rgba(0,191,165,.35)' }}>
              <span className="absolute top-4 right-4 font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{ background: 'rgba(0,191,165,.15)', border: '1px solid rgba(0,191,165,.35)', color: '#00bfa5' }}>{Math.round(DESCUENTO_ANTICIPO * 100)} % de descuento</span>
              <p className="font-poppins font-bold text-white text-[18px] mb-3 pr-28">Pago total por anticipado</p>
              <div className="space-y-2.5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-lato text-white/60 text-[15px]">Al iniciar, en un solo pago</p>
                  <p className="font-poppins font-black text-[#00bfa5] text-[20px]">{cop(PRECIO_ANTICIPADO)}</p>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-lato text-white/60 text-[15px]">Ahorro para Mizar</p>
                  <p className="font-poppins font-bold text-white/90 text-[17px]">{cop(PRECIO_TOTAL - PRECIO_ANTICIPADO)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-4 flex flex-wrap items-center gap-x-4 gap-y-1"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
            <Shield className="w-4 h-4 text-[#00bfa5]" />
            <p className="font-poppins font-bold text-white text-[18px]">+$150.000 <span className="font-lato font-normal text-white/45 text-[14px]">al mes por uso y soporte</span></p>
            <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{ background: 'rgba(245,158,11,.12)', border: '1px solid rgba(245,158,11,.30)', color: '#f59e0b' }}>Por confirmar</span>
            <p className="font-lato text-white/40 text-[14px] w-full">Mensajes de WhatsApp y comisión de la pasarela, al costo y a cargo de Mizar.</p>
          </div>
        </section>

        {/* ── LOGOS DE CLIENTES ── */}
        <div className="mt-16">
          <LogoCarousel logos={(() => {
            const l = [
              { src: '/Logo cebra.png',      alt: 'Logo cebra' },
              { src: '/Logo dance.png',       alt: 'Logo dance' },
              { src: '/Logo Mizar.png',       alt: 'Logo Mizar' },
              { src: '/Logo nibec.png',       alt: 'Logo nibec' },
              { src: '/Logo RAD.png',         alt: 'Logo RAD' },
              { src: '/Logo roofing.png',     alt: 'Logo roofing' },
              { src: '/Logo STC.png',         alt: 'Logo STC' },
              { src: '/Logo stunet.png',      alt: 'Logo stunet' },
              { src: '/LOGO-CALAS.png',       alt: 'LOGO-CALAS' },
              { src: '/logo-dreams.png',      alt: 'logo-dreams' },
              { src: '/logo-evolucione.png',  alt: 'logo-evolucione' },
              { src: '/logo-glish.png',       alt: 'logo-glish' },
              { src: '/images.jpg.jpeg',      alt: 'images' },
              { src: '/Llogo Milote.png',     alt: 'Llogo Milote' },
            ];
            return [...l, ...l];
          })()} />
        </div>

        {/* ─ 08 TÉRMINOS ─ */}
        <section id="vigencia" ref={s7.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s7.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>08 · Términos</TagLabel>
          <SectionTitle>Términos de la propuesta</SectionTitle>
          <Rule />

          <p className="font-lato text-white/40 text-[15px] mb-5">Toca cada término para ver el detalle.</p>

          <div className="space-y-2.5">
            {TERMINOS.map((item, i) => {
              const Icon = item.icon;
              const open = terminoActivo === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? '1px solid rgba(0,191,165,.28)' : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setTerminoActivo(open ? null : i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? 'rgba(0,191,165,.12)' : 'rgba(255,255,255,.05)' }}>
                      <Icon className="w-4 h-4 transition-colors" style={{ color: open ? '#00bfa5' : 'rgba(255,255,255,.35)' }} />
                    </div>
                    <span className={`font-poppins font-semibold text-[18px] flex-1 min-w-0 ${open ? 'text-white' : 'text-white/70'}`}>{item.titulo}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ml-2 ${open ? 'rotate-90' : ''}`}
                      style={{ color: open ? '#00bfa5' : 'rgba(255,255,255,.3)' }} />
                  </button>

                  {open && (
                    <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <p className="font-lato text-white/60 text-[17px] leading-relaxed pt-4">{item.desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-12 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 100%, rgba(201,164,67,.05), transparent 70%)' }} />
            <div className="relative z-10">
              <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-10 w-auto object-contain mx-auto mb-3"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <p className="font-poppins font-black text-white text-[20px] tracking-tight mb-1">Sixteam<span className="text-[#00bfa5]">.</span>pro</p>
              <p className="font-lato text-white/35 text-[14px] mb-4">Innovación y Estrategia Digital S.A.S.</p>
              <div className="flex flex-wrap justify-center gap-4 text-[14px] text-white/35 font-lato">
                <span>NIT {META.nit}</span>
                <span>·</span>
                <span>{META.correo}</span>
                <span>·</span>
                <span>RL: {META.rl}</span>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 text-[13px] text-white/25 font-lato mt-2">
                <span>Propuesta presentada a</span>
                <span className="text-white/40 font-medium">Claudia Villamizar, José Luis y Juliana Parada Villamizar · Mizar Diseño y Construcción</span>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 text-[13px] text-white/25 font-lato mt-1">
                <span>Propuesta elaborada por</span>
                <span className="text-white/40 font-medium">Ernesto Hernández</span>
                <span>·</span>
                <span>Gerente Comercial Sixteam</span>
              </div>
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                <p className="font-lato text-white/20 text-[13px]">
                  Process + Technology + People = Growth · Propuesta elaborada en {META.fecha} · Uso confidencial
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default MizarCarteraProposal;
