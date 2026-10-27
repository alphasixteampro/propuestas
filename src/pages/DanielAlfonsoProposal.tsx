import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, ChevronDown, Calendar, MapPin, Clock, Info, Building2, TrendingUp,
  Inbox, FileSearch, Scale, Calculator, FileText, Bot, Terminal, Star, Lock, Sparkles,
  Layers, Receipt, BarChart3, HardHat, ShieldCheck, AlertCircle, Wallet, Wrench, Quote, Coins, Users, Video,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────
// En los textos, **palabra** se resalta con rich()

const META = {
  cliente: 'Daniel Alfonso',
  sector: 'Construcción · Financiación inmobiliaria',
  lugar: 'Colombia',
  fecha: 'Octubre 2026',
  duracion: 'Tres cotizaciones · se contratan por separado',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  elaboradaPor: 'Ernesto Hernández',
  cargo: 'Gerente Comercial Sixteam.pro',
};

// Acento dorado para el frente financiero
const ORO = '#f5a524';

const fmt = (n: number) => '$' + n.toLocaleString('es-CO');

const SECCIONES = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'financiacion', label: 'Financiación' },
  { id: 'obras', label: 'Control de obras' },
  { id: 'equipo', label: 'Equipo de tecnología' },
  { id: 'vigencia', label: 'Vigencia' },
];

// Lo que Daniel dijo en la reunión del 22 de octubre
const LO_QUE_DIJO = [
  { cita: '¿El proyecto sí da o no da?', desc: 'Saber rápido si un proyecto **aguanta la tasa** de sus inversionistas.', color: ORO },
  { cita: 'Me llegan todos los días.', desc: '**10 proyectos** en análisis y un proceso **muy manual**.', color: '#00bfa5' },
  { cita: 'No confío, pero lo verifico.', desc: 'Revisar el presupuesto del constructor toma **varios días**.', color: '#60a5fa' },
  { cita: '¿Cuánto me va a quedar del contrato?', desc: 'Obras propias **al día**: facturas, presupuesto e impuestos.', color: '#a78bfa' },
];

// ── Frente 1 · Financiación de proyectos
const FLUJO = [
  { titulo: 'Recibe', desc: 'Presupuesto, unidades, créditos y avance', icon: Inbox },
  { titulo: 'Lee', desc: 'Excel o PDF, en el formato que llegue', icon: FileSearch },
  { titulo: 'Verifica', desc: 'Marca precios fuera de mercado', icon: Scale },
  { titulo: 'Calcula', desc: 'Con su lógica y sus criterios', icon: Calculator },
  { titulo: 'Entrega', desc: 'Ficha lista para inversionistas', icon: FileText },
];

const SALIDAS = [
  { valor: 'Necesidad de inversión', desc: 'Cuánto capital requiere el proyecto', color: ORO },
  { valor: 'Tasa máxima E.A.', desc: 'Lo que el proyecto soporta pagar', color: '#00bfa5' },
  { valor: 'Precio máximo de lote', desc: 'Cuánto puede pagar y que aún dé', color: '#60a5fa' },
];

type OpcionId = 'A' | 'B';

interface Opcion {
  id: OpcionId;
  nombre: string;
  subtitulo: string;
  nota?: string;
  precio: number;
  plazo: string;
  icon: React.ElementType;
  color: string;
  recomendado: boolean;
  bloques: { titulo: string; items: string[] }[];
}

const OPCIONES: Opcion[] = [
  {
    id: 'A',
    nombre: 'Asistente IA para apoyar análisis de viabilidad financiera',
    subtitulo: 'Asistente en Claude Code con una skill hecha a la medida de su método',
    precio: 2900000,
    plazo: '3 semanas',
    icon: Terminal,
    color: '#60a5fa',
    recomendado: false,
    bloques: [
      {
        titulo: 'Consultoría y levantamiento',
        items: [
          'Sesiones con **usted y su equipo** para concretar el **criterio de la solución**: variables, fórmulas y umbrales de decisión',
          'Revisión de sus **formatos de Excel** y de casos reales',
        ],
      },
      {
        titulo: 'El asistente',
        items: [
          '**Skill personalizada** en Claude Code con su método de análisis',
          'Lee presupuestos y documentos en **Excel o PDF**',
          'Calcula **necesidad de inversión, tasa máxima E.A. y precio máximo de lote**',
          'Señala los **precios fuera de su base de referencia**',
          'Genera el **Excel de viabilidad** y la ficha del proyecto',
        ],
      },
      {
        titulo: 'Entrega',
        items: [
          'Base de precios en un archivo que **usted actualiza**',
          '**Capacitación** para usarlo y ajustarlo',
        ],
      },
    ],
  },
  {
    id: 'B',
    nombre: 'Plataforma + Agente IA para ejecución de análisis de viabilidad financiera',
    subtitulo: 'Un agente que investiga precios y trabaja solo, 24/7',
    nota: 'El valor del servicio está en la **consultoría**: levantamos su información, investigamos y definimos los **planteamientos matemáticos** que el agente debe respetar para trabajar **24/7 de forma autónoma**.',
    precio: 9000000,
    plazo: '6 semanas',
    icon: Bot,
    color: '#00bfa5',
    recomendado: true,
    bloques: [
      {
        titulo: 'Consultoría e investigación',
        items: [
          'Levantamiento de su **método, variables y criterios** con usted y su equipo',
          'Investigación de **fuentes de precios y de mercado**: materiales, m² por zona y estrato, velocidad de ventas',
          '**Modelo matemático documentado**: fórmulas, supuestos y reglas que el agente no puede saltarse',
        ],
      },
      {
        titulo: 'Agente IA',
        items: [
          '**Investiga precios de mercado** y los compara con el presupuesto del constructor',
          'Ejecuta **acciones de forma autónoma** según las funciones que definamos: recibir documentos, pedir lo que falta, analizar, alertar y enviar fichas',
          'Trabaja **24/7** sin depender de su tiempo',
        ],
      },
      {
        titulo: 'Plataforma',
        items: [
          'Carga de documentos y **tablero de proyectos**: recibido, en análisis, viable, descartado',
          'Escenarios de **ventas, precio y sobrecostos**, y ficha en PDF para inversionistas',
          '**Autogestión**: usuarios, parámetros y base de precios',
          '**Ajustes básicos de entrenamiento** del agente: criterios, fuentes y respuestas',
        ],
      },
      {
        titulo: 'Entrega',
        items: [
          'Totalmente funcional y con **documentación completa**',
          'En **su repositorio** o en los servidores que se definan para su propósito',
        ],
      },
    ],
  },
];

const COMPARATIVO: { label: string; a: string; b: string }[] = [
  { label: 'Qué es', a: 'Asistente en Claude Code', b: 'Plataforma web + agente' },
  { label: 'Cómo trabaja', a: 'Cuando usted se lo pide', b: 'Solo, 24/7' },
  { label: 'Precios de mercado', a: 'Su base de referencia', b: 'Los investiga el agente' },
  { label: 'Quién lo usa', a: 'Usted', b: 'Usted y su equipo' },
  { label: 'Entrega', a: '3 semanas', b: '6 semanas' },
];

// ── Frente 2 · Control de obras (módulos seleccionables por grupo)
interface Modulo {
  id: string;
  titulo: string;
  resumen: string;
  incluye: string[];
  precio: number;
  fijo?: boolean;
  recomendado?: boolean;
}
interface Grupo {
  etiqueta: string;
  nombre: string;
  icon: React.ElementType;
  color: string;
  modulos: Modulo[];
}

const GRUPOS: Grupo[] = [
  {
    etiqueta: 'Base',
    nombre: 'Plataforma',
    icon: Layers,
    color: '#60a5fa',
    modulos: [
      {
        id: 'base',
        titulo: 'Plataforma de control de obras con asistente IA',
        resumen: 'Todas sus obras y contratos en un solo lugar.',
        incluye: [
          'Registro de obras, contratos, presupuestos por capítulo y proveedores',
          'Usuarios con permisos por rol: gerencia, obra y contabilidad',
          'Asistente IA que responde sobre sus obras con datos reales: "¿cuánto me queda del contrato?"',
          'Tablero general con el estado de todas las obras',
        ],
        precio: 5000000,
        fijo: true,
      },
    ],
  },
  {
    etiqueta: 'Contabilidad',
    nombre: 'Facturas e impuestos',
    icon: Receipt,
    color: '#00bfa5',
    modulos: [
      {
        id: 'siigo',
        titulo: 'Configuración de Siigo Nube por obra',
        resumen: 'Que la contabilidad sirva para controlar cada obra.',
        incluye: [
          'Centros de costo por obra y por contrato',
          'Plan de cuentas y retenciones para construcción',
          'Conexión de Siigo con la plataforma',
          'Acompañamiento en los dos primeros cierres',
        ],
        precio: 1500000,
        recomendado: true,
      },
      {
        id: 'causacion',
        titulo: 'Causación automática de facturas',
        resumen: 'Las facturas se registran solas, al día.',
        incluye: [
          'Lee las facturas electrónicas que llegan al correo',
          'Propone obra, contrato y cuenta para cada factura',
          'La registra en Siigo y deja en revisión las dudosas',
          'Detecta facturas duplicadas o con valores fuera del contrato',
        ],
        precio: 3500000,
        recomendado: true,
      },
      {
        id: 'impuestos',
        titulo: 'Impuestos y retenciones',
        resumen: 'Ningún vencimiento lo toma por sorpresa.',
        incluye: [
          'Calendario de IVA, retenciones e ICA de su empresa',
          'Proyección mensual de lo que se va a pagar',
          'Alertas a usted y a su contador antes de cada vencimiento',
        ],
        precio: 1500000,
      },
    ],
  },
  {
    etiqueta: 'Control',
    nombre: 'Presupuesto y contratos',
    icon: BarChart3,
    color: ORO,
    modulos: [
      {
        id: 'presupuesto',
        titulo: 'Presupuesto contra ejecutado',
        resumen: 'Saber si va desfasado antes de que sea tarde.',
        incluye: [
          'Presupuesto por obra y capítulo contra lo causado',
          'Semáforo de desfase por capítulo',
          'Alerta cuando un capítulo pasa el límite que usted defina',
          'Proyección del costo final de la obra',
        ],
        precio: 3000000,
        recomendado: true,
      },
      {
        id: 'contratos',
        titulo: 'Control de contratos y subcontratos',
        resumen: 'Cuánto le queda de cada contrato, en tiempo real.',
        incluye: [
          'Registro de actas de corte y avance por contrato',
          'Anticipo por amortizar y retención en garantía',
          'Retenciones, AIU e impuestos de cada acta',
          'Saldo neto del contrato: cuánto le queda por cobrar o pagar',
        ],
        precio: 2500000,
      },
      {
        id: 'reporte',
        titulo: 'Informe mensual automático',
        resumen: 'El estado de cada obra, sin pedirlo.',
        incluye: [
          'Informe por obra: avance, costo, desfase y saldo de contratos',
          'Resumen consolidado de todas las obras',
          'Envío automático cada mes por correo o WhatsApp',
        ],
        precio: 1000000,
      },
    ],
  },
  {
    etiqueta: 'Operación',
    nombre: 'Materiales, personal y precios',
    icon: HardHat,
    color: '#a78bfa',
    modulos: [
      {
        id: 'compras',
        titulo: 'Compras y materiales',
        resumen: 'Del pedido en obra al impacto en el presupuesto.',
        incluye: [
          'Solicitud de materiales desde la obra',
          'Aprobación, orden de compra y recepción en obra',
          'Descuento automático del presupuesto del capítulo',
          'Comparación de precios entre proveedores',
        ],
        precio: 2500000,
      },
      {
        id: 'personal',
        titulo: 'Personal de obra',
        resumen: 'Cuánto cuesta la mano de obra en cada frente.',
        incluye: [
          'Registro de asistencia por obra',
          'Cortes y pagos de cuadrillas y contratistas',
          'Costo de mano de obra por obra y por capítulo',
        ],
        precio: 2500000,
      },
      {
        id: 'precios',
        titulo: 'Base de precios unitarios propia',
        resumen: 'Sus obras alimentan su análisis de viabilidad.',
        incluye: [
          'Precios unitarios reales de sus compras y actas',
          'Se actualiza sola con cada compra',
          'Histórico por material, proveedor y zona',
          'Alimenta la verificación de presupuestos del Frente 1',
        ],
        precio: 2000000,
      },
    ],
  },
];

const MODULOS = GRUPOS.flatMap(g => g.modulos);
const IDS_FIJOS = MODULOS.filter(m => m.fijo).map(m => m.id);
const IDS_RECOMENDADOS = [...IDS_FIJOS, ...MODULOS.filter(m => m.recomendado).map(m => m.id)];
const IDS_TODOS = MODULOS.map(m => m.id);

const LICENCIA_MES = 400000;
const DESCUENTO_ANTICIPADO = 0.05;

// ── Cotización 3 · Plan Integral Sixteam Ops
const SMMLV_2026_NUM = 1750905;
const CREDITOS_MES = 160;
// Los créditos adicionales valen lo mismo que los del plan, sin recargo
const VALOR_CREDITO = Math.round(SMMLV_2026_NUM / CREDITOS_MES);
// Equivalencia de un módulo en créditos, redondeada a múltiplos de 5
const creditosDe = (precio: number) => Math.round(precio / VALOR_CREDITO / 5) * 5;

const PLAN_ITEMS = [
  { text: `**${CREDITOS_MES} créditos al mes** para nuevas funciones, mejoras y solicitudes`, icon: Coins },
  { text: 'Un **equipo de expertos** en construcción, proyectos, tecnología e inteligencia artificial', icon: Users },
  { text: 'Mejoras al **agente y a las plataformas**, y los **módulos de la cotización 2** cuando los necesite', icon: Layers },
  { text: '**Sesión virtual 1 a 1 cada semana** para revisar avances y prioridades', icon: Video },
  { text: '**Soporte** y solución de inconvenientes', icon: Wrench },
];

// Bandas estándar de consumo de créditos (5-20 / 21-50 / 51+)
const BANDAS = [
  { rango: '5 a 20', tipo: 'Solicitud simple', ej: 'Un campo nuevo, el ajuste de un flujo, una plantilla, un informe estándar o el soporte de una incidencia', color: '#00bfa5' },
  { rango: '21 a 50', tipo: 'Solicitud media', ej: 'Una automatización, un formulario conectado o un panel de informes nuevo', color: '#60a5fa' },
  { rango: '51 o más', tipo: 'Solicitud compleja', ej: 'Una integración entre sistemas, un agente de IA en producción o un módulo completo', color: ORO },
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
  <div className="w-12 h-0.5 mb-8 mt-1" style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)' }} />
);
const SubLabel = ({ children, icon: Icon }: { children: React.ReactNode; icon: React.ElementType }) => (
  <p className="font-poppins font-semibold text-white/60 text-[14px] uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
    <Icon className="w-4 h-4 text-[#00bfa5]" /> {children}
  </p>
);
// Daniel no tiene logo: va su nombre en una tarjeta
const ClientCard = ({ className = '', grande = false }: { className?: string; grande?: boolean }) => (
  <div className={`rounded-xl flex items-center gap-3 ${className}`}
    style={{ background: 'linear-gradient(135deg,#0a2342,#12356b)', border: `1px solid ${ORO}4d` }}>
    <div className={`${grande ? 'w-11 h-11' : 'w-7 h-7'} rounded-lg flex items-center justify-center flex-shrink-0`}
      style={{ background: `linear-gradient(135deg, ${ORO}, #1d70a2)` }}>
      <span className={`font-poppins font-black text-white ${grande ? 'text-[17px]' : 'text-[12px]'}`}>DA</span>
    </div>
    <span className={`font-poppins font-bold text-white ${grande ? 'text-[20px]' : 'text-[14px]'} whitespace-nowrap`}>{META.cliente}</span>
  </div>
);

// Las dos formas de pago de una cotización
const PagoOpciones = ({ valor }: { valor: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <div className="rounded-xl px-4 py-4" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
      <p className="font-lato text-white/55 text-[14px] mb-1">50 % al iniciar · 50 % al entregar</p>
      <p className="font-poppins font-bold text-white text-[18px] whitespace-nowrap">2 pagos de {fmt(Math.round(valor / 2))}</p>
    </div>
    <div className="rounded-xl px-4 py-4" style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.25)' }}>
      <p className="font-lato text-[#00bfa5] text-[14px] mb-1">Pago anticipado · 5 % de descuento</p>
      <p className="font-poppins font-bold text-white text-[18px] whitespace-nowrap">
        {fmt(Math.round(valor * (1 - DESCUENTO_ANTICIPADO)))}
        <span className="font-lato font-normal text-white/40 text-[13px]"> · ahorra {fmt(Math.round(valor * DESCUENTO_ANTICIPADO))}</span>
      </p>
    </div>
  </div>
);

// Bloque plegable para la información secundaria
const Desplegable = ({ titulo, sub, icon: Icon, color = '#00bfa5', children }: {
  titulo: string; sub: string; icon: React.ElementType; color?: string; children: React.ReactNode;
}) => {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden transition-colors"
      style={{ background: 'rgba(255,255,255,.025)', border: `1px solid ${abierto ? `${color}4d` : 'rgba(255,255,255,.08)'}` }}>
      <button type="button" onClick={() => setAbierto(!abierto)} aria-expanded={abierto}
        className="w-full flex items-center gap-4 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
        style={{ outlineColor: color }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}1f` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-poppins font-bold text-white text-[17px] leading-snug">{titulo}</p>
          <p className="font-lato text-white/40 text-[14px]">{sub}</p>
        </div>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${abierto ? 'rotate-180' : ''}`} style={{ color }} />
      </button>
      {abierto && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
};

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const DanielAlfonsoProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [opcion, setOpcion] = useState<OpcionId | null>('B');
  const [seleccion, setSeleccion] = useState<Set<string>>(() => new Set(IDS_RECOMENDADOS));
  const [detalles, setDetalles] = useState<Set<string>>(() => new Set());
  const [verCreditos, setVerCreditos] = useState(false);

  const alternar = (m: Modulo) => {
    if (m.fijo) return;
    setSeleccion(prev => { const n = new Set(prev); if (n.has(m.id)) n.delete(m.id); else n.add(m.id); return n; });
  };
  const alternarDetalle = (id: string) => setDetalles(prev => {
    const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n;
  });

  const opcionSel = OPCIONES.find(o => o.id === opcion);
  // Con la opción B la plataforma ya existe: control de obras se suma como módulo y la base cuesta la mitad
  const precioModulo = (m: Modulo) => (m.fijo && opcion === 'B' ? m.precio / 2 : m.precio);
  const elegidos = MODULOS.filter(m => seleccion.has(m.id));
  const totalObras = elegidos.reduce((t, m) => t + precioModulo(m), 0);
  const creditosObras = elegidos.reduce((t, m) => t + creditosDe(precioModulo(m)), 0);

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

  const s1 = useVisible(); const s2 = useVisible(); const s3 = useVisible();
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
            style={{ background: 'radial-gradient(circle, rgba(245,165,36,.06) 0%, transparent 65%)' }} />
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
            <ClientCard className="hidden sm:flex px-3 py-2" />
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
              <TagLabel>Inteligencia artificial · Viabilidad y obras</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${ORO}, #1d70a2)` }}>
                  <Building2 className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-5"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 4.6rem)' }}>
                Propuesta<br />
                <span style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Comercial
                </span>
              </h1>
              <p className="font-lato text-white/55 text-xl leading-relaxed mb-6 max-w-xl">
                Sepa en <Hl color={ORO}>horas</Hl>, no en días, si un proyecto da. Y tenga sus <Hl color="#fff">obras al día</Hl>.
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
                  { icon: MapPin,   text: META.lugar },
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
                  {['1. Resumen', '2. Financiación de proyectos', '3. Control de obras', '4. Equipo de tecnología', '5. Vigencia y términos'].map((item, i) => (
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
                  style={{ background: 'radial-gradient(circle, rgba(245,165,36,.12) 0%, rgba(29,112,162,.05) 50%, transparent 70%)' }} />
                <div className="cover-ring-1 absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full" style={{ border: '1px solid rgba(245,165,36,.14)' }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(29,112,162,.15)' }} />
                <div className="cover-ring-1 absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: ORO, boxShadow: '0 0 6px rgba(245,165,36,.8)' }} />
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
                  <ClientCard grande className="px-6 py-5 shadow-[0_4px_30px_rgba(245,165,36,.22)]" />
                  <p className="font-lato text-[13px] uppercase tracking-[0.2em] mt-1 text-center" style={{ color: ORO }}>{META.sector}</p>
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
          <SectionTitle>Mucho por analizar,<br /><span style={{ color: ORO }}>poco tiempo</span></SectionTitle>
          <Rule />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LO_QUE_DIJO.map((a, i) => (
              <div key={i} className="rounded-2xl p-5" style={{ background: `${a.color}0d`, border: `1px solid ${a.color}38` }}>
                <Quote className="w-5 h-5 mb-3" style={{ color: a.color }} />
                <p className="font-poppins font-semibold text-white/90 text-[18px] mb-2 leading-snug italic">"{a.cita}"</p>
                <p className="font-lato text-white/55 text-[16px] leading-relaxed">{rich(a.desc, 'rgba(255,255,255,.9)')}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─ 02 FINANCIACIÓN ─ */}
        <section id="financiacion" ref={s2.ref as React.RefObject<HTMLElement>} className={reveal(s2.v)}>
          <TagLabel>02 — Frente 1 · Financiación de proyectos</TagLabel>
          <SectionTitle>Su análisis,<br /><span style={{ color: '#00bfa5' }}>sin el trabajo manual</span></SectionTitle>
          <Rule />

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {FLUJO.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className={`rounded-2xl p-4 text-center ${i === FLUJO.length - 1 ? 'col-span-2 sm:col-span-1' : ''}`}
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(0,191,165,.12)' }}>
                    <Icon className="w-5 h-5 text-[#00bfa5]" />
                  </div>
                  <p className="font-lato text-white/30 text-[12px] tracking-wider">0{i + 1}</p>
                  <p className="font-poppins font-bold text-white text-[16px] mb-1">{f.titulo}</p>
                  <p className="font-lato text-white/50 text-[14px] leading-snug">{f.desc}</p>
                </div>
              );
            })}
          </div>

          <SubLabel icon={TrendingUp}>Lo que recibe por cada proyecto</SubLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SALIDAS.map((s, i) => (
              <div key={i} className="rounded-2xl p-5" style={{ background: `${s.color}0d`, border: `1px solid ${s.color}38` }}>
                <p className="font-poppins font-black text-[20px] leading-tight mb-1.5" style={{ color: s.color }}>{s.valor}</p>
                <p className="font-lato text-white/55 text-[15px]">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* ── Cotización 1 */}
          <div className="pt-20">
            <p className="font-lato text-[13px] uppercase tracking-[0.22em] font-medium mb-2" style={{ color: ORO }}>Cotización 1</p>
            <h3 className="font-poppins font-extrabold text-white leading-tight mb-6" style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.2rem)' }}>
              Elija una opción
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-start">
            {OPCIONES.map(o => {
              const Icon = o.icon;
              const activa = opcion === o.id;
              return (
                <button key={o.id} type="button" onClick={() => setOpcion(activa ? null : o.id)} aria-pressed={activa}
                  className="text-left rounded-3xl p-6 sm:p-7 relative overflow-hidden transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    background: activa
                      ? `linear-gradient(150deg, ${o.color}22 0%, rgba(29,112,162,.08) 55%, rgba(3,13,26,.9) 100%)`
                      : 'rgba(255,255,255,.03)',
                    border: `1.5px solid ${activa ? `${o.color}80` : 'rgba(255,255,255,.09)'}`,
                    boxShadow: activa ? `0 0 40px ${o.color}1f` : 'none',
                    outlineColor: o.color,
                  }}>
                  {o.recomendado && (
                    <span className="absolute top-5 right-5 inline-flex items-center gap-1 font-lato text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider"
                      style={{ background: `${o.color}26`, border: `1px solid ${o.color}59`, color: o.color }}>
                      <Star className="w-3 h-3" /> Recomendada
                    </span>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${o.color}22` }}>
                      <Icon className="w-5 h-5" style={{ color: o.color }} />
                    </div>
                    <span className="font-poppins font-black text-[14px] tracking-wider" style={{ color: o.color }}>OPCIÓN {o.id}</span>
                  </div>
                  <p className="font-poppins font-bold text-white text-[20px] leading-snug mb-1 pr-2">{o.nombre}</p>
                  <p className="font-lato text-white/45 text-[15px] mb-5">{o.subtitulo}</p>
                  <p className="font-poppins font-black text-white leading-none whitespace-nowrap" style={{ fontSize: 'clamp(1.9rem, 4.6vw, 2.5rem)' }}>
                    {fmt(o.precio)}
                  </p>
                  <p className="font-lato text-white/45 text-[14px] mt-2 mb-5">+ IVA · entrega en {o.plazo}</p>
                  {o.nota && (
                    <p className="font-lato text-white/65 text-[15px] leading-relaxed rounded-xl px-4 py-3 mb-5"
                      style={{ background: `${o.color}12`, border: `1px solid ${o.color}38` }}>
                      {rich(o.nota, 'rgba(255,255,255,.95)')}
                    </p>
                  )}
                  <div className="space-y-4">
                    {o.bloques.map(b => (
                      <div key={b.titulo}>
                        <p className="font-poppins font-semibold text-[12px] uppercase tracking-wider mb-2" style={{ color: o.color }}>{b.titulo}</p>
                        <ul className="space-y-2">
                          {b.items.map((t, j) => (
                            <li key={j} className="flex items-start gap-2.5">
                              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: o.color }} />
                              <span className="font-lato text-white/65 text-[15px] leading-snug">{rich(t, 'rgba(255,255,255,.92)')}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="no-print mt-6 inline-flex items-center gap-2 font-lato text-[14px]"
                    style={{ color: activa ? o.color : 'rgba(255,255,255,.4)' }}>
                    <span className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ border: `1.5px solid ${activa ? o.color : 'rgba(255,255,255,.3)'}`, background: activa ? o.color : 'transparent' }}>
                      {activa && <span className="w-1.5 h-1.5 rounded-full bg-[#030d1a]" />}
                    </span>
                    {activa ? 'Seleccionada' : 'Seleccionar'}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            <Desplegable titulo="Comparar las dos opciones" sub="Cómo trabaja cada una y cuándo se entrega" icon={Scale}>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,.08)' }}>
              <div className="grid grid-cols-3 gap-x-3 px-4 sm:px-6 py-3" style={{ background: 'rgba(2,8,20,.6)' }}>
                <span />
                <span className="font-poppins font-semibold text-[#60a5fa] text-[13px]">Opción A</span>
                <span className="font-poppins font-semibold text-[#00bfa5] text-[13px]">Opción B</span>
              </div>
              {COMPARATIVO.map((r, i) => (
                <div key={i} className="grid grid-cols-3 gap-x-3 items-center px-4 sm:px-6 py-3 border-t"
                  style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                  <span className="font-lato text-white/45 text-[14px]">{r.label}</span>
                  <span className="font-lato text-white/80 text-[15px]">{r.a}</span>
                  <span className="font-lato text-white/80 text-[15px]">{r.b}</span>
                </div>
              ))}
            </div>
            </Desplegable>
            <Desplegable titulo="Formas de pago" sub="50 / 50 o pago anticipado con 5 % de descuento" icon={Wallet} color={ORO}>
              {opcionSel
                ? <PagoOpciones valor={opcionSel.precio} />
                : <p className="font-lato text-white/40 text-[15px]">Seleccione una opción para ver las formas de pago.</p>}
            </Desplegable>
          </div>
        </section>

        {/* ─ 03 CONTROL DE OBRAS ─ */}
        <section id="obras" ref={s3.ref as React.RefObject<HTMLElement>} className={reveal(s3.v)}>
          <TagLabel>03 — Frente 2 · Control de obras</TagLabel>
          <SectionTitle>Una plataforma,<br /><span style={{ color: '#00bfa5' }}>con asistente IA integrado</span></SectionTitle>
          <Rule />
          <Lead>
            Facturas, presupuesto, contratos e impuestos de sus obras <Hl color="#fff">en un solo lugar</Hl>. Usted <Hl>elige los módulos</Hl> que necesita hoy.
          </Lead>

          {/* ── Cotización 2 */}
          <div id="cotizacion-2" className="scroll-mt-24">
            <p className="font-lato text-[#00bfa5] text-[13px] uppercase tracking-[0.22em] font-medium mb-2">Cotización 2</p>
            <h3 className="font-poppins font-extrabold text-white leading-tight mb-3" style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.2rem)' }}>
              Arme su plataforma por módulos
            </h3>
            <p className="font-lato text-white/55 text-[18px] leading-relaxed max-w-2xl mb-4">
              Marque los módulos que necesita. La <Hl color="#fff">plataforma base</Hl> va siempre.
            </p>
            <p className="font-lato text-white/45 text-[15px] leading-snug mb-6 flex items-start gap-2">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
              <span>Toque <span className="text-white/75 font-semibold">Alcance</span> para ver qué incluye cada módulo.</span>
            </p>
          </div>

          {/* Atajos */}
          <div className="no-print flex flex-wrap items-center gap-2 mb-4">
            {[
              { t: 'Recomendado', ids: IDS_RECOMENDADOS, icon: Star, color: '#00bfa5' },
              { t: 'Todo', ids: IDS_TODOS, icon: Sparkles, color: ORO },
              { t: 'Solo la base', ids: IDS_FIJOS, icon: Lock, color: '#a78bfa' },
            ].map(a => {
              const Icon = a.icon;
              return (
                <button key={a.t} type="button" onClick={() => setSeleccion(new Set(a.ids))}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-lato text-[14px] text-white/70 transition-colors hover:text-white hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bfa5]"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.12)' }}>
                  <Icon className="w-4 h-4" style={{ color: a.color }} /> {a.t}
                </button>
              );
            })}
            {verCreditos && (
              <button type="button" onClick={() => setVerCreditos(false)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-lato text-[14px] transition-colors hover:bg-white/[0.06]"
                style={{ background: 'rgba(167,139,250,.08)', border: '1px solid rgba(167,139,250,.35)', color: '#a78bfa' }}>
                <Coins className="w-4 h-4" /> Ocultar créditos
              </button>
            )}
          </div>

          {/* Selector de módulos */}
          <div className="rounded-2xl overflow-hidden mb-6"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(0,191,165,.28)', boxShadow: '0 4px 32px rgba(0,191,165,.08)' }}>
            {GRUPOS.map((g, i) => {
              const Icon = g.icon;
              const subtotal = g.modulos.filter(m => seleccion.has(m.id)).reduce((t, m) => t + precioModulo(m), 0);
              return (
                <div key={g.etiqueta} style={{ borderTop: i ? '1px solid rgba(255,255,255,.07)' : undefined }}>
                  <div className="px-4 sm:px-5 py-3.5 flex items-center gap-3" style={{ background: `${g.color}0f` }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${g.color}22` }}>
                      <Icon className="w-4 h-4" style={{ color: g.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-poppins font-bold text-[12px] uppercase tracking-wider" style={{ color: g.color }}>{g.etiqueta}</p>
                      <p className="font-poppins font-bold text-white text-[18px] leading-tight">{g.nombre}</p>
                    </div>
                    {subtotal > 0
                      ? <p className="font-poppins font-bold text-white/80 text-[14px] whitespace-nowrap">{fmt(subtotal)}</p>
                      : <p className="font-lato text-white/40 text-[14px] whitespace-nowrap">Para después</p>}
                  </div>
                  {g.modulos.map(m => {
                    const activo = seleccion.has(m.id);
                    const abierto = detalles.has(m.id);
                    const precio = precioModulo(m);
                    const rebajado = precio < m.precio;
                    return (
                      <React.Fragment key={m.id}>
                        <label className={`flex items-start gap-3 px-4 sm:px-5 py-3 transition-colors focus-within:bg-white/[0.04] ${m.fijo ? 'cursor-default' : 'cursor-pointer hover:bg-white/[0.02]'}`}
                          style={{ borderTop: '1px solid rgba(255,255,255,.05)' }}>
                          <input type="checkbox" checked={activo} disabled={m.fijo} onChange={() => alternar(m)}
                            aria-label={`${m.titulo}, ${fmt(precio)}`}
                            className="w-5 h-5 flex-shrink-0 mt-0.5 rounded cursor-[inherit]"
                            style={{ accentColor: g.color }} />
                          <div className="flex-1 min-w-0" style={{ opacity: activo ? 1 : 0.5 }}>
                            <p className="font-poppins font-semibold text-white/90 text-[16px] leading-snug">{m.titulo}</p>
                            <p className="font-lato text-white/50 text-[14px] leading-snug mt-0.5">{m.resumen}</p>
                            {(m.fijo || m.recomendado || rebajado) && (
                              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                {m.fijo && (
                                  <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                                    style={{ background: 'rgba(96,165,250,.1)', border: '1px solid rgba(96,165,250,.3)', color: '#60a5fa' }}>Base · va siempre</span>
                                )}
                                {m.recomendado && (
                                  <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                                    style={{ background: 'rgba(0,191,165,.1)', border: '1px solid rgba(0,191,165,.3)', color: '#00bfa5' }}>Recomendado</span>
                                )}
                                {rebajado && (
                                  <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                                    style={{ background: `${ORO}1a`, border: `1px solid ${ORO}55`, color: ORO }}>50 % menos con la opción B</span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0 pt-0.5">
                            {rebajado && <p className="font-lato text-white/35 text-[13px] line-through whitespace-nowrap">{fmt(m.precio)}</p>}
                            <p className="font-poppins font-bold text-[15px] whitespace-nowrap" style={{ color: activo ? g.color : 'rgba(255,255,255,.45)' }}>
                              {fmt(precio)}
                            </p>
                            {verCreditos && (
                              <p className="font-poppins font-semibold text-[13px] whitespace-nowrap mt-0.5" style={{ color: '#a78bfa' }}>
                                {creditosDe(precio)} cr.
                              </p>
                            )}
                          </div>
                          <button type="button" onClick={(ev) => { ev.preventDefault(); alternarDetalle(m.id); }}
                            aria-expanded={abierto} aria-label={`${abierto ? 'Ocultar' : 'Ver'} alcance de ${m.titulo}`}
                            className="no-print flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md font-lato text-[13px] text-white/55 hover:text-white hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bfa5]">
                            <span className="hidden sm:inline">Alcance</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${abierto ? 'rotate-180' : ''}`} />
                          </button>
                        </label>
                        {abierto && (
                          <ul className="pl-12 sm:pl-[3.25rem] pr-4 sm:pr-5 pb-4 space-y-1.5" style={{ opacity: activo ? 1 : 0.6 }}>
                            {m.incluye.map((t, j) => (
                              <li key={j} className="flex gap-2 font-lato text-white/60 text-[15px] leading-snug">
                                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: g.color }} />
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              );
            })}

            <div className="px-4 sm:px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-2"
              style={{ background: 'rgba(0,191,165,.08)', borderTop: '1px solid rgba(0,191,165,.3)' }}>
              <p className="font-lato text-white/65 text-[15px] flex-1 min-w-[200px]">
                <span className="font-semibold text-white/90">{seleccion.size} de {MODULOS.length}</span> módulos
              </p>
              <div className="text-right">
                <p className="font-poppins font-black text-[#00bfa5] text-[22px] leading-none whitespace-nowrap">{fmt(totalObras)} <span className="font-lato font-normal text-white/45 text-[14px]">+ IVA</span></p>
                {verCreditos && (
                  <p className="font-poppins font-semibold text-[14px] mt-1.5 whitespace-nowrap" style={{ color: '#a78bfa' }}>{creditosObras} créditos</p>
                )}
              </div>
            </div>
          </div>

          <Desplegable titulo="Formas de pago" sub="50 / 50 o pago anticipado con 5 % de descuento" icon={Wallet} color={ORO}>
            <PagoOpciones valor={totalObras} />
          </Desplegable>
          <p className="font-lato text-white/45 text-[15px] leading-relaxed mt-4">
            Los módulos que no elija hoy se pueden <Hl color="#fff">sumar después</Hl> al mismo valor, o construir con los créditos de la cotización 3.
          </p>
        </section>

        {/* ─ 04 EQUIPO DE TECNOLOGÍA ─ */}
        <section id="equipo" ref={s4.ref as React.RefObject<HTMLElement>} className={reveal(s4.v)}>
          <TagLabel>04 — Cotización 3 · Equipo de tecnología</TagLabel>
          <SectionTitle>Su equipo de tecnología,<br /><span style={{ color: '#a78bfa' }}>mes a mes</span></SectionTitle>
          <Rule />
          {/* ── Cotización 3 */}
          <Lead>
            Con el <Hl color="#fff">Plan Integral Sixteam Ops</Hl> tiene un equipo de tecnología mes a mes, para lo que necesite.
          </Lead>

          <div className="rounded-3xl p-6 sm:p-9 relative overflow-hidden mb-6 grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8"
            style={{ background: 'linear-gradient(150deg, rgba(167,139,250,.14) 0%, rgba(29,112,162,.08) 55%, rgba(3,13,26,.9) 100%)', border: '1.5px solid rgba(167,139,250,.5)', boxShadow: '0 0 40px rgba(167,139,250,.12)' }}>
            <div className="flex flex-col">
              <p className="font-lato text-white/40 text-[13px] uppercase tracking-wider mb-1">Plan mensual</p>
              <p className="font-poppins font-bold text-white text-[22px] leading-snug">Plan Integral Sixteam Ops</p>
              <p className="font-lato text-[#a78bfa] text-[15px] mt-1 mb-6">Su propio equipo de tecnología</p>
              <p className="font-poppins font-black text-white leading-none whitespace-nowrap" style={{ fontSize: 'clamp(1.9rem, 3.4vw, 2.4rem)' }}>{fmt(SMMLV_2026_NUM)}</p>
              <p className="font-lato text-white/45 text-[14px] mt-2">al mes + IVA · 1 SMMLV 2026</p>
              <div className="mt-auto pt-6">
                <div className="rounded-xl px-4 py-3.5 flex items-center gap-3"
                  style={{ background: 'rgba(167,139,250,.10)', border: '1px solid rgba(167,139,250,.3)' }}>
                  <p className="font-poppins font-black text-[#a78bfa] text-[30px] leading-none">{CREDITOS_MES}</p>
                  <p className="font-lato text-white/70 text-[15px] leading-snug">
                    créditos cada mes · <Hl color="#fff">{fmt(VALOR_CREDITO)}</Hl> por crédito
                  </p>
                </div>
              </div>
            </div>
            <ul className="space-y-3.5 self-center">
              {PLAN_ITEMS.map((it, j) => {
                const ItIcon = it.icon;
                return (
                  <li key={j} className="flex items-start gap-3">
                    <ItIcon className="w-4 h-4 flex-shrink-0 mt-1 text-[#a78bfa]" />
                    <span className="font-lato text-white/65 text-[16px] leading-snug">{rich(it.text, 'rgba(255,255,255,.92)')}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mb-3">
            <Desplegable titulo="¿Cómo funcionan los créditos?" sub="Cuánto consume cada tipo de solicitud" icon={Coins} color="#a78bfa">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {BANDAS.map(b => (
                <div key={b.tipo} className="rounded-2xl p-4" style={{ background: `${b.color}0d`, border: `1px solid ${b.color}38` }}>
                  <p className="font-poppins font-black text-[22px] leading-none mb-1" style={{ color: b.color }}>{b.rango}</p>
                  <p className="font-lato text-white/30 text-[11px] uppercase tracking-wider mb-2">créditos</p>
                  <p className="font-poppins font-semibold text-white/85 text-[15px] mb-1">{b.tipo}</p>
                  <p className="font-lato text-white/45 text-[13px] leading-snug">{b.ej}</p>
                </div>
              ))}
            </div>
            <p className="font-lato text-white/50 text-[15px] leading-relaxed">
              Cada solicitud se cotiza en créditos y <Hl color="#fff">usted la aprueba antes</Hl>. Si en un mes necesita más, los <Hl color="#a78bfa">créditos adicionales</Hl> cuestan lo mismo: {fmt(VALOR_CREDITO)} cada uno.
            </p>
            </Desplegable>
          </div>
          {/* Ver la cotización 2 en créditos */}
          <div className="no-print rounded-xl px-4 py-3.5 flex flex-wrap items-center gap-3"
            style={{ background: 'rgba(167,139,250,.06)', border: '1px solid rgba(167,139,250,.25)' }}>
            <button type="button" onClick={() => {
                const nuevo = !verCreditos;
                setVerCreditos(nuevo);
                if (nuevo) scrollTo('cotizacion-2');
              }}
              aria-pressed={verCreditos}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-lato text-[13px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]"
              style={{ background: verCreditos ? '#a78bfa' : 'transparent', color: verCreditos ? '#030d1a' : '#a78bfa', border: '1px solid rgba(167,139,250,.5)' }}>
              <Coins className="w-3.5 h-3.5" /> {verCreditos ? 'Ocultar créditos' : 'Ver la cotización 2 en créditos'}
            </button>
            <p className="font-lato text-white/55 text-[14px] leading-snug flex-1 min-w-[200px]">
              {verCreditos
                ? <>Sus módulos equivalen a <Hl color="#fff">{creditosObras} créditos</Hl>: unos <Hl color="#a78bfa">{Math.ceil(creditosObras / CREDITOS_MES)} meses</Hl> del plan.</>
                : 'Vea cuántos créditos del plan equivale cada módulo de control de obras.'}
            </p>
          </div>
        </section>

        {/* ── LOGOS DE CLIENTES ── */}
        <div>
          <LogoCarousel />
        </div>

        {/* ─ 05 VIGENCIA ─ */}
        <section id="vigencia" ref={s5.ref as React.RefObject<HTMLElement>} className={reveal(s5.v)}>
          <TagLabel>05 — Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y términos</SectionTitle>
          <Rule />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { titulo: 'Aprobación', desc: 'Basta su confirmación por **WhatsApp, correo o verbal** para agendar el arranque.', icon: CheckCircle },
              { titulo: 'Forma de pago', desc: 'Cotizaciones 1 y 2: **50 % al iniciar y 50 % al entregar**, o **pago anticipado con 5 % de descuento**. Por transferencia bancaria.', icon: Wallet },
              { titulo: 'Plan Integral', desc: `**${fmt(SMMLV_2026_NUM)} al mes** más IVA, por mes anticipado. Incluye **${CREDITOS_MES} créditos**; los adicionales cuestan **${fmt(VALOR_CREDITO)}** cada uno, siempre con su aprobación.`, icon: Coins },
              { titulo: 'Plazos', desc: 'Financiación: **3 semanas** (opción A) o **6 semanas** (opción B). Control de obras: **4 a 10 semanas** según los módulos, entregados por partes.', icon: Clock },
              { titulo: 'Después de la entrega', desc: `**3 meses de soporte incluidos**. Si alojamos las plataformas, luego hay una licencia de **${fmt(LICENCIA_MES)} al mes** (alojamiento, soporte y uso de la IA). Con el Plan Integral, el soporte se atiende con sus créditos.`, icon: Wrench },
              { titulo: 'No incluye', desc: 'Las suscripciones de **Siigo Nube** y de **Claude** (opción A). Si las plataformas van en **sus servidores**, ese costo y el consumo de la IA corren por su cuenta.', icon: AlertCircle },
              { titulo: 'Su información', desc: 'Los datos de sus proyectos, obras e inversionistas **son suyos** y se manejan de forma **confidencial**.', icon: ShieldCheck },
              { titulo: 'Vigencia', desc: '**30 días calendario** desde la fecha de esta propuesta. Valores **más IVA**.', icon: Calendar },
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

export default DanielAlfonsoProposal;
