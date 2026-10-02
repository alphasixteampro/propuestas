import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap, BarChart3,
  AlertCircle, Calendar, Info, MapPin, Users, Database, Quote, Eye,
  GitBranch, Layers, Rocket, ClipboardList, MessagesSquare, Search,
  Compass, Gauge, Network, HardHat, ShieldCheck, Wrench,
  Truck, Calculator, UserCog, Scale, Map as MapIcon, Sparkles, BellRing,
  ArrowRight,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────
// En los textos, **palabra** se resalta con rich()

const META = {
  cliente: 'Asesoría Rosanía Held S.A.S.',
  tagline: 'Comprometidos con el servicio',
  sector: 'Alquiler de equipos para trabajo en altura',
  trayectoria: '~10 años de operación',
  sede: 'La Guajira · Barranquilla',
  equipo: '~30 colaboradores directos',
  herramientas: 'Excel · SIIGO (contable)',
  contacto: 'Yudis Fuentes · Coordinadora Administrativa y Comercial',
  fecha: 'Octubre 2026',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  elaboradoPor: 'Ernesto Hernández · Gerente Comercial',
  objetivo: 'Diagnóstico de procesos, visión de futuro y hoja de ruta tecnológica',
};

const ARH_BLUE = '#2f7cf6';
const VISION = '#f472b6';

// Hallazgos tomados de la reunión del 29 de septiembre de 2026 con Yudis Fuentes
const HALLAZGOS = [
  {
    titulo: 'Todo vive en Excel',
    desc: 'Inventario, cotizaciones y reportes se llevan **a mano en Excel**. **No hay un programa de inventarios** y los tableros que se han intentado siguen siendo manuales.',
    cita: 'El programa favorito ha sido Excel.',
    icon: Database, tint: 'red',
  },
  {
    titulo: 'Cada cotización se arma a mano',
    desc: 'Cada servicio se cotiza distinto: **andamios por metro cúbico** o **manlift con operador, combustible y turno**. Todo se digita y **no es fácil asegurar que lo cotizado sea lo que se factura**.',
    cita: 'Me toca digitar, teclear cada cosa.',
    icon: FileText, tint: 'amber',
  },
  {
    titulo: 'SIIGO no se adapta a la operación',
    desc: 'SIIGO sirve para **contabilidad y facturación**, pero sus opciones de **cotización e inventario no se ajustan** a la forma en que ustedes alquilan sus equipos.',
    cita: 'Viene cuadriculado: es lo que tengo y eso es lo que hay.',
    icon: Layers, tint: 'blue',
  },
  {
    titulo: 'Contratos sin alertas automáticas',
    desc: 'Vencimientos, **otrosíes** y **preavisos** dependen de que alguien ponga la alerta. Si se olvida, **el plazo se vence** y la empresa asume el riesgo.',
    cita: 'Si yo no hago la alerta, se me fue el límite.',
    icon: BellRing, tint: 'amber',
  },
];

const TINT: Record<string, { text: string; color: string; bg: string; border: string }> = {
  amber: { text: 'text-amber-400', color: '#fbbf24', bg: 'rgba(251,191,36,.07)', border: 'rgba(251,191,36,.18)' },
  blue:  { text: 'text-[#2f7cf6]', color: ARH_BLUE,  bg: 'rgba(47,124,246,.07)', border: 'rgba(47,124,246,.2)' },
  red:   { text: 'text-[#f87171]', color: '#f87171', bg: 'rgba(221,51,51,.07)',  border: 'rgba(221,51,51,.2)' },
};

// Calificación del diagnóstico situacional interno de Rosanía Held
const PUNTO_PARTIDA = [
  { area: 'Operaciones',      nivel: 'Crítico',    score: 5,   color: '#f87171' },
  { area: 'Recursos Humanos', nivel: 'Alto',       score: 4,   color: '#fb923c' },
  { area: 'Comercial',        nivel: 'Medio-Alto', score: 3.5, color: '#fbbf24' },
  { area: 'Contabilidad',     nivel: 'Medio-Alto', score: 3.5, color: '#fbbf24' },
  { area: 'SST',              nivel: 'Media-Alta', score: 3.5, color: '#fbbf24' },
];

// Recorrido de la consultoría: hoy → mañana → camino
const RECORRIDO = [
  { paso: 'Hoy', titulo: 'Cómo funciona hoy', tag: 'AS-IS', desc: 'Lo construimos **escuchando a su equipo**, cargo por cargo.', icon: Search, color: ARH_BLUE },
  { paso: 'Mañana', titulo: 'A dónde quieren llegar', tag: 'TO-BE', desc: 'Lo define **la gerencia** a partir de su visión de crecimiento.', icon: Eye, color: VISION },
  { paso: 'El camino', titulo: 'Qué hacer y en qué orden', tag: 'Hoja de ruta', desc: 'Es la **diferencia entre ambos**, convertida en un plan.', icon: MapIcon, color: '#f59e0b' },
];

// ─── MAPA DE PROCESOS Y CARGOS ───────────────────────────────────────────────

type Nivel = 'Directivo' | 'Coordinación' | 'Ejecución';

const PRECIO_NIVEL: Record<Nivel, number> = {
  Directivo: 400000,
  Coordinación: 320000,
  Ejecución: 220000,
};

const NIVEL_STYLE: Record<Nivel, { color: string; bg: string; border: string; desc: string }> = {
  Directivo:    { color: '#a78bfa', bg: 'rgba(167,139,250,.10)', border: 'rgba(167,139,250,.3)', desc: 'Entrevista de **1 hora** sobre decisiones, metas y visión de la empresa' },
  Coordinación: { color: ARH_BLUE,  bg: 'rgba(47,124,246,.10)',  border: 'rgba(47,124,246,.3)',  desc: 'Entrevista de **1 hora** y revisión de los archivos que usa a diario' },
  Ejecución:    { color: '#00bfa5', bg: 'rgba(0,191,165,.10)',   border: 'rgba(0,191,165,.3)',   desc: 'Entrevista de **1 hora** a una persona del cargo y encuesta a todas' },
};

type Cargo = { nombre: string; nivel: Nivel; nota?: string };
type Tipo = 'Dirección' | 'Operación' | 'Soporte';

const PROCESOS: {
  id: string; nombre: string; tipo: Tipo;
  icon: React.ElementType; alcance: string; cargos: Cargo[];
}[] = [
  {
    id: 'P1', nombre: 'Gerencia y dirección', tipo: 'Dirección', icon: Compass,
    alcance: 'Decisiones, aprobaciones, seguimiento y temas legales',
    cargos: [
      { nombre: 'Gerente General', nivel: 'Directivo' },
      { nombre: 'Gerente Administrativo', nivel: 'Directivo' },
      { nombre: 'Asistente de Gerencia', nivel: 'Coordinación' },
      { nombre: 'Asesor Legal', nivel: 'Coordinación' },
    ],
  },
  {
    id: 'P2', nombre: 'Calidad y documentos', tipo: 'Dirección', icon: ShieldCheck,
    alcance: 'Procedimientos, formatos y certificaciones de equipos',
    cargos: [
      { nombre: 'Coordinador de Gestión de Calidad', nivel: 'Coordinación' },
    ],
  },
  {
    id: 'P3', nombre: 'Ventas y cotizaciones', tipo: 'Operación', icon: Target,
    alcance: 'Solicitud del cliente, cotización, negociación y cierre',
    cargos: [
      { nombre: 'Coordinación Administrativa y Comercial', nivel: 'Coordinación', nota: 'No aparece en el organigrama' },
    ],
  },
  {
    id: 'P4', nombre: 'Operaciones en campo', tipo: 'Operación', icon: HardHat,
    alcance: 'Planeación, armado de andamios, operación de manlift y cierre del servicio',
    cargos: [
      { nombre: 'Jefe de Operaciones', nivel: 'Coordinación' },
      { nombre: 'Líder de Operaciones', nivel: 'Coordinación' },
      { nombre: 'Coordinador CIO', nivel: 'Coordinación' },
      { nombre: 'Supervisor Integral', nivel: 'Coordinación' },
      { nombre: 'Operador de Manlift', nivel: 'Ejecución' },
      { nombre: 'Andamiero', nivel: 'Ejecución' },
    ],
  },
  {
    id: 'P5', nombre: 'Inventario, almacén y transporte', tipo: 'Operación', icon: Truck,
    alcance: 'Disponibilidad, despacho, transporte, devolución y control de equipos',
    cargos: [
      { nombre: 'Almacenista', nivel: 'Ejecución' },
      { nombre: 'Conductor', nivel: 'Ejecución' },
    ],
  },
  {
    id: 'P6', nombre: 'Mantenimiento de equipos', tipo: 'Operación', icon: Wrench,
    alcance: 'Mantenimiento preventivo y correctivo de los equipos',
    cargos: [
      { nombre: 'Mecánico de Manlift', nivel: 'Ejecución' },
    ],
  },
  {
    id: 'P7', nombre: 'Contabilidad y facturación', tipo: 'Soporte', icon: Calculator,
    alcance: 'Conteo de días de alquiler, cobros, facturación y cartera',
    cargos: [
      { nombre: 'Contador', nivel: 'Coordinación' },
      { nombre: 'Auxiliar Contable', nivel: 'Ejecución' },
    ],
  },
  {
    id: 'P8', nombre: 'Gestión humana y nómina', tipo: 'Soporte', icon: UserCog,
    alcance: 'Contratos, otrosíes, vencimientos, preavisos y nómina',
    cargos: [
      { nombre: 'Líder de Gestión Administrativa y Humana', nivel: 'Coordinación' },
    ],
  },
  {
    id: 'P9', nombre: 'Seguridad y Salud en el Trabajo', tipo: 'Soporte', icon: Scale,
    alcance: 'Documentos SST, certificaciones e indicadores',
    cargos: [],
  },
];

const TIPO_STYLE: Record<Tipo, { color: string; bg: string }> = {
  'Dirección': { color: '#a78bfa', bg: 'rgba(167,139,250,.10)' },
  'Operación': { color: ARH_BLUE,  bg: 'rgba(47,124,246,.10)' },
  'Soporte':   { color: '#00bfa5', bg: 'rgba(0,191,165,.10)' },
};

const CARGOS = PROCESOS.flatMap(p => p.cargos.map(c => ({ ...c, proceso: p.nombre })));
const TOTAL_CARGOS = CARGOS.length;
const TOTAL_PROCESOS = PROCESOS.length;

const FLUJO_ACTUAL = [
  { carril: 'Cliente',                actividades: 6, color: 'rgba(255,255,255,.5)' },
  { carril: 'Comercial / Ventas',     actividades: 7, color: ARH_BLUE },
  { carril: 'Operaciones',            actividades: 5, color: '#a78bfa' },
  { carril: 'Inventario / Logística', actividades: 7, color: '#00bfa5' },
  { carril: 'Contabilidad',           actividades: 4, color: '#fbbf24' },
];

// ─── MADUREZ TECNOLÓGICA ─────────────────────────────────────────────────────

const NIVELES_MADUREZ = [
  { n: 1, nombre: 'Manual',      desc: 'En papel o en la memoria de las personas' },
  { n: 2, nombre: 'Básico',      desc: 'Excel, correo y WhatsApp, cada uno por su lado' },
  { n: 3, nombre: 'Ordenado',    desc: 'Procesos escritos y formatos únicos' },
  { n: 4, nombre: 'Conectado',   desc: 'Sistemas que se hablan entre sí, con alertas e informes automáticos' },
  { n: 5, nombre: 'Inteligente', desc: 'Automatización e IA que ayudan a anticipar y decidir' },
];

const ASPECTOS = ['Procesos', 'Información', 'Herramientas', 'Comunicación entre áreas', 'Personas', 'Indicadores'];

// ─── ETAPAS ──────────────────────────────────────────────────────────────────

type Actividad = { text: string; tag?: string };

const ETAPAS = [
  {
    num: '01',
    nombre: 'Arranque',
    duracion: 'Semana 1',
    icon: FileText,
    color: ARH_BLUE,
    colorAlpha: 'rgba(47,124,246,.12)',
    colorBorder: 'rgba(47,124,246,.3)',
    descripcion: 'Revisamos los documentos que ya tienen para **no empezar de cero**.',
    actividades: [
      { text: '**Reunión de arranque** con la gerencia', tag: 'Con ustedes' },
      { text: 'Revisión de su **organigrama, flujograma y diagnóstico interno**' },
      { text: 'Preparación de la **encuesta** y de las **preguntas para cada cargo**' },
      { text: '**Agenda** de entrevistas con cada área' },
    ] as Actividad[],
  },
  {
    num: '02',
    nombre: 'Conversaciones con el equipo',
    duracion: 'Semanas 2 a 5',
    icon: MessagesSquare,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.3)',
    descripcion: 'Escuchamos a **cada cargo** para saber qué hace, **con qué herramienta** y **dónde se le complica**.',
    actividades: [
      { text: '**Encuesta** a todo el personal (~30 personas)' },
      { text: `**${TOTAL_CARGOS} entrevistas de 1 hora**, una por cargo`, tag: 'Con ustedes' },
      { text: '**5 mesas de trabajo de 1 hora** entre áreas', tag: 'Con ustedes' },
      { text: 'Revisión de los **archivos que usan a diario**: cotizaciones, inventario, remisiones y nómina' },
    ] as Actividad[],
  },
  {
    num: '03',
    nombre: 'Situación actual',
    tag: 'AS-IS',
    duracion: 'Semanas 5 a 7',
    icon: Search,
    color: '#a78bfa',
    colorAlpha: 'rgba(167,139,250,.10)',
    colorBorder: 'rgba(167,139,250,.3)',
    descripcion: 'Dibujamos **cómo funciona hoy realmente** la empresa y dónde **se frena el trabajo**.',
    actividades: [
      { text: '**Flujograma actualizado** con el paso a paso real' },
      { text: '**Lista de actividades** de cada área, con quién responde y quién la hace' },
      { text: 'Puntos donde **se frena el trabajo, se repiten tareas o hay riesgos**' },
      { text: '**Nivel tecnológico** de cada área, de 1 a 5' },
      { text: 'Revisión con **cada líder de área**', tag: 'Con ustedes' },
    ] as Actividad[],
  },
  {
    num: '04',
    nombre: 'Situación deseada',
    tag: 'TO-BE',
    duracion: 'Semanas 7 y 8',
    icon: Eye,
    color: VISION,
    colorAlpha: 'rgba(244,114,182,.10)',
    colorBorder: 'rgba(244,114,182,.3)',
    descripcion: 'Con **la gerencia** definimos **a dónde quiere llegar** la empresa y cómo debería funcionar para lograrlo.',
    actividades: [
      { text: '**Taller de visión** con la Gerencia General y la Gerencia Administrativa', tag: 'Con ustedes' },
      { text: '**Metas de crecimiento**: nuevos frentes, clientes y servicios' },
      { text: 'Cómo deberían funcionar los **procesos clave** en el futuro' },
      { text: '**Nivel tecnológico** que se quiere alcanzar en cada área' },
      { text: 'Aprobación de la situación deseada **por la gerencia**', tag: 'Con ustedes' },
    ] as Actividad[],
  },
  {
    num: '05',
    nombre: 'Hoja de ruta',
    duracion: 'Semanas 8 y 9',
    icon: MapIcon,
    color: '#f59e0b',
    colorAlpha: 'rgba(245,158,11,.10)',
    colorBorder: 'rgba(245,158,11,.3)',
    descripcion: 'Comparamos el **hoy** con el **mañana** y definimos **qué hacer primero**.',
    actividades: [
      { text: '**Diferencias** entre la situación actual y la deseada' },
      { text: 'Prioridades: lo que da **más beneficio con menos esfuerzo**' },
      { text: 'Tipo de solución: **ordenar el proceso, un sistema, automatizar o inteligencia artificial**' },
      { text: 'Plan en **3 tiempos**: primeros 3 meses, de 3 a 6 meses y de 6 a 12 meses' },
      { text: '**Inversión estimada** de cada paso' },
    ] as Actividad[],
  },
  {
    num: '06',
    nombre: 'Entrega',
    duracion: 'Semana 10',
    icon: Rocket,
    color: '#34d399',
    colorAlpha: 'rgba(52,211,153,.10)',
    colorBorder: 'rgba(52,211,153,.3)',
    descripcion: 'Presentamos los resultados y les entregamos todo en **archivos editables**.',
    actividades: [
      { text: '**Presentación de resultados** a la gerencia', tag: 'Con ustedes' },
      { text: 'Presentación a **cada área** de su flujo y sus actividades' },
      { text: 'Entrega de los **5 entregables**' },
    ] as Actividad[],
  },
];

// ─── ENTREGABLES ─────────────────────────────────────────────────────────────

const ENTREGABLES = [
  {
    titulo: 'Situación actual',
    tag: 'AS-IS',
    icon: Gauge,
    color: ARH_BLUE,
    desc: 'Qué tan apoyada en tecnología está hoy cada área y **dónde se frena el trabajo**.',
    items: ['Nivel de **1 a 5** por área', 'Herramientas que se usan hoy', 'Principales problemas, en orden de importancia'],
  },
  {
    titulo: 'Flujograma actualizado',
    icon: Network,
    color: '#a78bfa',
    desc: 'El paso a paso **como realmente se trabaja**, no como dice el papel.',
    items: ['Proceso completo, de la solicitud a la factura', 'Detalle de cada área', 'Archivo **editable**'],
  },
  {
    titulo: 'Inventario de actividades',
    icon: ClipboardList,
    color: '#00bfa5',
    desc: 'Cada tarea de cada área, con **quién responde** y **quién la hace**.',
    items: ['**Responsable** y **ejecutor**', 'Herramienta y frecuencia', 'Dificultades encontradas'],
  },
  {
    titulo: 'Situación deseada',
    tag: 'TO-BE',
    icon: Eye,
    color: VISION,
    desc: 'Cómo debería funcionar la empresa según la **visión de la gerencia**.',
    items: ['**Metas de crecimiento** acordadas', 'Cómo funcionarán los procesos clave', 'Nivel tecnológico objetivo por área'],
  },
  {
    titulo: 'Hoja de ruta',
    icon: MapIcon,
    color: '#f59e0b',
    desc: 'Qué implementar, **en qué orden** y **con qué tipo de solución** para pasar del hoy al mañana.',
    items: ['Pasos en **orden de prioridad**', 'Plan a **12 meses**', 'Inversión estimada'],
  },
];

const EJEMPLO_INVENTARIO = [
  { proceso: 'Ventas',       actividad: 'Cotizar alquiler',          responsable: 'Coord. Adm. y Comercial', ejecutor: 'Coord. Adm. y Comercial', herramienta: 'Excel', dolor: 'Digitación manual' },
  { proceso: 'Inventario',   actividad: 'Verificar disponibilidad',  responsable: 'Líder de Operaciones',    ejecutor: 'Almacenista',             herramienta: 'Excel y conteo físico', dolor: 'No hay dato al día' },
  { proceso: 'Contabilidad', actividad: 'Calcular días de alquiler', responsable: 'Contador',                ejecutor: 'Auxiliar Contable',       herramienta: 'Excel y SIIGO', dolor: 'Depende de otras áreas' },
];

const SECCIONES = [
  { id: 'resumen',     label: 'Resumen' },
  { id: 'objetivo',    label: 'Objetivo' },
  { id: 'mapa',        label: 'Procesos y cargos' },
  { id: 'plan',        label: 'Plan' },
  { id: 'entregables', label: 'Entregables' },
  { id: 'cotizacion',  label: 'Inversión' },
  { id: 'vigencia',    label: 'Vigencia' },
];

// ─── INVERSIÓN ───────────────────────────────────────────────────────────────

const fmt = (n: number) => 'COP ' + n.toLocaleString('es-CO').replace(/,/g, '.');

const CARGOS_POR_NIVEL = (['Directivo', 'Coordinación', 'Ejecución'] as Nivel[]).map(nivel => {
  const cantidad = CARGOS.filter(c => c.nivel === nivel).length;
  return { nivel, cantidad, unitario: PRECIO_NIVEL[nivel], subtotal: cantidad * PRECIO_NIVEL[nivel] };
});
const SUBTOTAL_CARGOS = CARGOS_POR_NIVEL.reduce((a, b) => a + b.subtotal, 0);

const COMPONENTES_FIJOS = [
  { nombre: 'Arranque', detalle: 'Reunión inicial, revisión de documentos y preparación de la encuesta', valor: 400000 },
  { nombre: '5 mesas de trabajo de 1 hora', detalle: 'Ventas · Operaciones e inventario · Contabilidad · Gestión humana y SST · Gerencia y calidad', valor: 800000 },
  { nombre: 'Visión de la gerencia y situación deseada', detalle: 'Taller de visión con la gerencia y diseño de cómo deberían funcionar los procesos clave', valor: 900000 },
  { nombre: 'Informes finales y presentación', detalle: 'Situación actual, flujograma, inventario de actividades, hoja de ruta y presentación de resultados', valor: 980000 },
];
const TOTAL_NUM = SUBTOTAL_CARGOS + COMPONENTES_FIJOS.reduce((a, b) => a + b.valor, 0);

const PAGOS = [
  { tracto: '1er pago', momento: 'Al iniciar · firma del contrato', porcentaje: 50 },
  { tracto: '2do pago', momento: 'Al finalizar · entrega de los entregables', porcentaje: 50 },
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

const MiniTag = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wide align-middle"
    style={{ background: `${color}1a`, border: `1px solid ${color}55`, color }}>{children}</span>
);

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
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)' }} />
);
const ClientLogo = ({ className = '' }: { className?: string }) => (
  <div className={`rounded-xl bg-white flex items-center justify-center ${className}`}>
    <img src="/arh-logo.png" alt={META.cliente} className="w-full h-auto object-contain"
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
  </div>
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const RosaniaHeldProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [etapaActiva, setEtapaActiva] = useState<number | null>(0);
  const [procesoActivo, setProcesoActivo] = useState<number | null>(null);

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

  const s1 = useVisible(); const s2 = useVisible(); const s3 = useVisible(); const s4 = useVisible();
  const s5 = useVisible(); const s6 = useVisible(); const s7 = useVisible();

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
            style={{ background: 'radial-gradient(circle, rgba(47,124,246,.07) 0%, transparent 65%)' }} />
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
            <ClientLogo className="hidden sm:flex w-44 px-3 py-2" />
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
              <TagLabel>Propuesta de consultoría y cotización</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${ARH_BLUE}, #1d70a2)` }}>
                  <HardHat className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">Gerencia de {META.cliente}</span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 4.6rem)' }}>
                Mejoramiento<br />
                <span style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  de Procesos
                </span>
              </h1>
              <p className="font-lato text-white/55 text-xl leading-relaxed mb-5">{META.objetivo}</p>
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
                  { icon: Clock,    text: '10 semanas' },
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
                  {['1. Resumen', '2. Objetivo', '3. Procesos y cargos', '4. Plan de trabajo', '5. Entregables', '6. Inversión', '7. Vigencia y términos'].map((item, i) => (
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
                  style={{ background: 'radial-gradient(circle, rgba(47,124,246,.12) 0%, rgba(29,112,162,.05) 50%, transparent 70%)' }} />
                <div className="cover-ring-1 absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full" style={{ border: '1px solid rgba(47,124,246,.14)' }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(29,112,162,.15)' }} />
                <div className="cover-ring-1 absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: ARH_BLUE, boxShadow: '0 0 6px rgba(47,124,246,.8)' }} />
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
                  <ClientLogo className="w-64 px-4 py-3 shadow-[0_4px_30px_rgba(47,124,246,.35)]" />
                  <p className="font-lato text-[13px] uppercase tracking-[0.2em] mt-1 text-center" style={{ color: ARH_BLUE }}>Trabajo en altura · Manlift · Andamios</p>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-8 md:px-10 py-20 space-y-24">

        {/* ─ 01 RESUMEN ─ */}
        <section id="resumen" ref={s1.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s1.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>01 — Resumen</TagLabel>
          <SectionTitle>¿Dónde está hoy su empresa?</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center"
            style={{ background: 'rgba(2,8,20,.85)', border: '1px solid rgba(47,124,246,.2)' }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <ClientLogo className="w-48 px-3 py-2.5" />
              <span className="font-lato text-[11px] uppercase tracking-[0.2em]" style={{ color: ARH_BLUE }}>{META.tagline}</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Sector', value: META.sector, strong: true },
                { label: 'Trayectoria', value: META.trayectoria, strong: true },
                { label: 'Operación', value: 'Base en El Cerrejón · nuevos frentes en La Guajira y Barranquilla' },
                { label: 'Equipo', value: META.equipo },
                { label: 'Herramientas actuales', value: META.herramientas, teal: true },
                { label: 'Contacto', value: META.contacto },
              ].map((d, i) => (
                <div key={i}>
                  <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">{d.label}</p>
                  {d.teal ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: '#00bfa5' }} />
                      <p className="font-poppins font-semibold text-[#00bfa5] text-[17px]">{d.value}</p>
                    </div>
                  ) : (
                    <p className={d.strong ? 'font-poppins font-semibold text-white/80 text-[17px]' : 'font-lato text-white/60 text-[17px]'}>{d.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 text-white/60 text-[19px] leading-relaxed mb-8">
            <p>
              Rosanía Held alquila <Hl color="#fff">equipos para trabajo en altura</Hl>: manlift, andamios multidireccionales y maquinaria amarilla, con servicios de armado, transporte y certificación.
            </p>
            <p>
              Su empresa <Hl>creció</Hl>, pero muchos procesos <Hl color="#f87171">siguen siendo manuales</Hl>. Antes de invertir en tecnología, conviene entender <Hl color="#fff">cómo se trabaja realmente</Hl> y tener claro <Hl color="#fff">a dónde quieren llegar</Hl>.
            </p>
          </div>

          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex gap-4 items-start" style={{ background: 'rgba(47,124,246,.06)', border: '1px solid rgba(47,124,246,.22)' }}>
            <Quote className="w-6 h-6 flex-shrink-0" style={{ color: ARH_BLUE }} />
            <div>
              <p className="font-poppins font-semibold text-white/90 text-[20px] sm:text-[22px] leading-snug">"Los procesos siguen siendo muy manuales y <span style={{ color: ARH_BLUE }}>los errores cada vez son más evidentes</span>."</p>
              <p className="font-lato text-white/40 text-[14px] mt-2">Yudis Fuentes · Coordinadora Administrativa y Comercial</p>
            </div>
          </div>

          {/* Hallazgos de la reunión */}
          <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#00bfa5]" /> Lo que nos contaron
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {HALLAZGOS.map((h, i) => {
              const Icon = h.icon; const t = TINT[h.tint];
              return (
                <div key={i} className="rounded-xl p-5 flex flex-col" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                  <div className="flex items-center gap-2.5 mb-2">
                    <Icon className={`w-5 h-5 ${t.text} flex-shrink-0`} />
                    <p className="font-poppins font-bold text-white text-[18px]">{h.titulo}</p>
                  </div>
                  <p className="font-lato text-white/55 text-[16px] leading-relaxed mb-3">{rich(h.desc)}</p>
                  <p className="font-lato italic text-[15px] mt-auto pl-3" style={{ color: t.color, borderLeft: `2px solid ${t.color}` }}>"{h.cita}"</p>
                </div>
              );
            })}
          </div>

          {/* Punto de partida: diagnóstico interno */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-1 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#00bfa5]" /> Su diagnóstico interno
            </p>
            <p className="font-lato text-white/40 text-[15px] mb-5">Nivel de urgencia que ustedes asignaron a cada área</p>
            <div className="space-y-3">
              {PUNTO_PARTIDA.map((a, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto] sm:grid-cols-[170px_1fr_110px] items-center gap-x-4 gap-y-1.5">
                  <span className="font-lato text-white/70 text-[16px]">{a.area}</span>
                  <span className="font-poppins font-bold text-[14px] text-right sm:order-last" style={{ color: a.color }}>{a.nivel}</span>
                  <div className="col-span-2 sm:col-span-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(a.score / 5) * 100}%`, background: a.color }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="font-lato text-white/50 text-[16px] leading-relaxed mt-5">
              Partimos de aquí y llegamos al detalle de <Hl color="#fff">cada cargo</Hl> y <Hl color="#fff">cada tarea</Hl>.
            </p>
          </div>
        </section>

        {/* ─ 02 OBJETIVO ─ */}
        <section id="objetivo" ref={s2.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>02 — Objetivo</TagLabel>
          <SectionTitle>¿Para qué estamos aquí?</SectionTitle>
          <Rule />
          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden mb-6"
            style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,191,165,.07), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 text-[#00bfa5] mb-4" />
            <p className="font-poppins font-semibold text-white/80 text-xl sm:text-[23px] leading-relaxed">
              Entender <Hl color="#fff">cómo trabaja hoy</Hl> su empresa, definir con la gerencia <Hl color={VISION}>a dónde quiere llegar</Hl> y entregarles un <Hl>plan claro</Hl> de qué tecnología, sistemas o inteligencia artificial implementar primero.
            </p>
          </div>

          {/* Recorrido hoy → mañana → camino */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-3 mb-6">
            {RECORRIDO.map((r, i) => {
              const Icon = r.icon;
              return (
                <React.Fragment key={r.paso}>
                  <div className="rounded-xl p-5" style={{ background: `${r.color}12`, border: `1px solid ${r.color}45` }}>
                    <div className="flex items-center justify-between mb-3">
                      <Icon className="w-5 h-5" style={{ color: r.color }} />
                      <MiniTag color={r.color}>{r.tag}</MiniTag>
                    </div>
                    <p className="font-lato text-[13px] uppercase tracking-wider mb-0.5" style={{ color: r.color }}>{r.paso}</p>
                    <p className="font-poppins font-bold text-white text-[18px] leading-snug mb-1.5">{r.titulo}</p>
                    <p className="font-lato text-white/55 text-[15px] leading-relaxed">{rich(r.desc)}</p>
                  </div>
                  {i < RECORRIDO.length - 1 && (
                    <div className="hidden sm:flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-white/25" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Procesos', value: String(TOTAL_PROCESOS), sub: 'a revisar' },
              { label: 'Cargos', value: String(TOTAL_CARGOS), sub: '1 hora con cada cargo' },
              { label: 'Mesas de trabajo', value: '5', sub: '1 hora cada una' },
              { label: 'Entregables', value: String(ENTREGABLES.length), sub: 'en archivos editables' },
            ].map((k, i) => (
              <div key={i} className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(29,112,162,.07)', border: '1px solid rgba(29,112,162,.2)' }}>
                <p className="font-poppins font-black text-white text-[30px] leading-none mb-1">{k.value}</p>
                <p className="font-poppins font-semibold text-white/70 text-[14px] mb-0.5">{k.label}</p>
                <p className="font-lato text-white/35 text-[13px]">{k.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─ 03 MAPA DE PROCESOS Y CARGOS ─ */}
        <section id="mapa" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — Procesos y cargos</TagLabel>
          <SectionTitle>{TOTAL_PROCESOS} procesos · {TOTAL_CARGOS} cargos</SectionTitle>
          <Rule />
          <p className="font-lato text-white/55 text-[18px] leading-relaxed mb-8">
            Con su <Hl color="#fff">organigrama</Hl>, su <Hl color="#fff">flujograma</Hl> y la <Hl color="#fff">reunión</Hl> identificamos todo lo que vamos a revisar. Esta lista se <Hl>confirma con ustedes en la primera semana</Hl>.
          </p>

          {/* Flujo actual */}
          <div className="rounded-2xl p-5 sm:p-6 mb-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-[#00bfa5]" /> Su flujograma actual
            </p>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { v: '5', l: 'áreas' },
                { v: String(FLUJO_ACTUAL.reduce((a, b) => a + b.actividades, 0)), l: 'actividades' },
                { v: '4', l: 'decisiones' },
              ].map((k, i) => (
                <div key={i} className="rounded-xl p-3 text-center" style={{ background: 'rgba(47,124,246,.07)', border: '1px solid rgba(47,124,246,.2)' }}>
                  <p className="font-poppins font-black text-white text-[24px] leading-none">{k.v}</p>
                  <p className="font-lato text-white/45 text-[13px] mt-1">{k.l}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {FLUJO_ACTUAL.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="font-lato text-white/60 text-[15px] w-36 sm:w-52 flex-shrink-0">{c.carril}</span>
                  <div className="flex-1 flex gap-1">
                    {Array.from({ length: c.actividades }).map((_, j) => (
                      <div key={j} className="h-3 flex-1 max-w-[28px] rounded-sm" style={{ background: c.color, opacity: 0.75 }} />
                    ))}
                  </div>
                  <span className="font-poppins font-bold text-white/60 text-[14px] w-6 text-right">{c.actividades}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl p-4 flex gap-3" style={{ background: 'rgba(251,191,36,.06)', border: '1px solid rgba(251,191,36,.2)' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
              <p className="font-lato text-white/55 text-[16px] leading-relaxed">
                Muestra bien el paso a paso del servicio, pero <Hl color="#fbbf24">no incluye mantenimiento, gestión humana, SST ni calidad</Hl>.
              </p>
            </div>
          </div>

          {/* Procesos acordeón */}
          <div className="space-y-2.5 mb-6">
            {PROCESOS.map((p, i) => {
              const Icon = p.icon;
              const open = procesoActivo === i;
              const ts = TIPO_STYLE[p.tipo];
              return (
                <div key={p.id} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${ts.color}55` : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setProcesoActivo(open ? null : i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: open ? ts.bg : 'rgba(255,255,255,.05)' }}>
                      <Icon className="w-4 h-4" style={{ color: open ? ts.color : 'rgba(255,255,255,.4)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`font-poppins font-bold text-[17px] ${open ? 'text-white' : 'text-white/80'}`}>{p.nombre}</span>
                        <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ background: ts.bg, color: ts.color }}>{p.tipo}</span>
                      </div>
                      <p className="font-lato text-white/40 text-[14px] mt-0.5 line-clamp-1">{p.alcance}</p>
                    </div>
                    <span className="font-poppins font-black text-[15px] flex-shrink-0" style={{ color: ts.color }}>
                      {p.cargos.length > 0 ? `${p.cargos.length} cargo${p.cargos.length !== 1 ? 's' : ''}` : 'Compartido'}
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`}
                      style={{ color: open ? ts.color : 'rgba(255,255,255,.3)' }} />
                  </button>
                  {open && (
                    <div className="px-4 sm:px-5 pb-5 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      {p.cargos.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {p.cargos.map((c, j) => {
                            const ns = NIVEL_STYLE[c.nivel];
                            return (
                              <div key={j} className="rounded-lg px-3 py-2" style={{ background: ns.bg, border: `1px solid ${ns.border}` }}>
                                <p className="font-poppins font-semibold text-white/90 text-[14px]">{c.nombre}</p>
                                <p className="font-lato text-[12px]" style={{ color: ns.color }}>{c.nivel}{c.nota ? ` · ${c.nota}` : ''}</p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="font-lato text-white/50 text-[15px] leading-relaxed">
                          <Hl color="#fff">No tiene un cargo propio</Hl> en el organigrama. Lo revisamos en las entrevistas de Operaciones, Calidad y Gestión Humana, y en su propia mesa de trabajo.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-xl p-4 flex gap-3" style={{ background: 'rgba(47,124,246,.06)', border: '1px solid rgba(47,124,246,.2)' }}>
            <Users className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: ARH_BLUE }} />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              Son los <Hl color="#fff">17 cargos</Hl> del organigrama más la <Hl color="#fff">Coordinación Administrativa y Comercial</Hl>. Si un cargo lo ocupan varias personas, entrevistamos a <Hl>una de ellas</Hl> y encuestamos a <Hl>todas</Hl>.
            </p>
          </div>
        </section>

        {/* ─ 04 PLAN ─ */}
        <section id="plan" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Plan de trabajo</TagLabel>
          <SectionTitle>{ETAPAS.length} etapas · 10 semanas</SectionTitle>
          <Rule />

          {/* Cómo escuchamos */}
          <p className="font-lato text-white/55 text-[18px] mb-4">Así escuchamos a su equipo:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
            {[
              { icon: ClipboardList, titulo: 'Encuestas', desc: 'A **todo el personal**: qué hace, con qué y cuánto tiempo le toma.' },
              { icon: MessagesSquare, titulo: 'Entrevistas', desc: '**1 hora con cada cargo**, para entender cada rol a fondo.' },
              { icon: Users, titulo: 'Mesas de trabajo', desc: '**5 reuniones de 1 hora** donde las áreas arman juntas el paso a paso.' },
            ].map((t, i) => {
              const Icon = t.icon;
              return (
                <div key={i} className="rounded-xl p-5" style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.18)' }}>
                  <Icon className="w-6 h-6 text-[#00bfa5] mb-3" />
                  <p className="font-poppins font-bold text-white/90 text-[18px] mb-1">{t.titulo}</p>
                  <p className="font-lato text-white/50 text-[16px] leading-relaxed">{rich(t.desc)}</p>
                </div>
              );
            })}
          </div>

          {/* Timeline */}
          <div className="relative mb-6">
            <div className="hidden sm:block absolute left-[16px] top-10 bottom-10 w-px"
              style={{ background: 'linear-gradient(to bottom, rgba(47,124,246,.4), rgba(0,191,165,.4), rgba(167,139,250,.4), rgba(244,114,182,.4), rgba(245,158,11,.4), rgba(52,211,153,.4))' }} />
            <div className="space-y-3">
              {ETAPAS.map((et, i) => {
                const Icon = et.icon;
                const open = etapaActiva === i;
                return (
                  <div key={i} className="rounded-xl overflow-hidden transition-all duration-300 sm:ml-12 relative"
                    style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${et.colorBorder}` : '1px solid rgba(255,255,255,.07)' }}>
                    <div className="hidden sm:flex absolute -left-12 top-5 w-8 h-8 rounded-full items-center justify-center border-2 z-10"
                      style={{ background: '#030d1a', borderColor: et.color }}>
                      <span className="font-poppins font-black text-[13px]" style={{ color: et.color }}>{et.num}</span>
                    </div>
                    <button onClick={() => setEtapaActiva(open ? null : i)}
                      className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: open ? et.colorAlpha : 'rgba(255,255,255,.05)' }}>
                        <Icon className="w-4 h-4 transition-colors" style={{ color: open ? et.color : 'rgba(255,255,255,.35)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`font-poppins font-bold text-[18px] ${open ? 'text-white' : 'text-white/75'}`}>{et.nombre}</span>
                          {'tag' in et && et.tag && <MiniTag color={et.color}>{et.tag}</MiniTag>}
                        </div>
                        <p className="sm:hidden font-poppins font-bold text-[13px]" style={{ color: et.color }}>{et.duracion}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: et.colorAlpha, border: `1px solid ${et.colorBorder}` }}>
                          <Clock className="w-3 h-3" style={{ color: et.color }} />
                          <span className="font-poppins font-bold text-[13px]" style={{ color: et.color }}>{et.duracion}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`}
                          style={{ color: open ? et.color : 'rgba(255,255,255,.3)' }} />
                      </div>
                    </button>
                    {open && (
                      <div className="px-4 sm:px-5 pb-5 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                        <p className="font-lato text-white/60 text-[17px] leading-relaxed mb-4">{rich(et.descripcion)}</p>
                        <ul className="space-y-2">
                          {et.actividades.map((a, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: et.color }} />
                              <span className="font-lato text-white/60 text-[17px] flex-1">{rich(a.text)}
                                {a.tag && (
                                  <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wide align-middle"
                                    style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.3)', color: '#00bfa5' }}>
                                    {a.tag}
                                  </span>
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl p-4 flex gap-3 mb-10" style={{ background: 'rgba(244,114,182,.06)', border: '1px solid rgba(244,114,182,.22)' }}>
            <Eye className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: VISION }} />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              La <Hl color={VISION}>situación deseada</Hl> la define <Hl color="#fff">la gerencia</Hl>, no el consultor. Nuestro papel es ayudarles a convertir su visión en <Hl color="#fff">metas concretas</Hl> y en un modelo de trabajo que se pueda alcanzar.
            </p>
          </div>

          {/* Madurez tecnológica */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="px-5 py-3 flex items-center gap-2.5" style={{ background: 'rgba(47,124,246,.07)', borderBottom: '1px solid rgba(47,124,246,.15)' }}>
              <Gauge className="w-4 h-4" style={{ color: ARH_BLUE }} />
              <span className="font-poppins font-bold text-white/85 text-[15px]">¿Qué es el nivel tecnológico?</span>
            </div>
            <div className="p-5 space-y-5">
              <p className="font-lato text-white/55 text-[16px] leading-relaxed">
                Es qué tan apoyada en tecnología está cada área. Medimos <Hl color={ARH_BLUE}>dónde están hoy</Hl> y la gerencia define <Hl color={VISION}>a qué nivel quiere llegar</Hl>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {NIVELES_MADUREZ.map((n) => (
                  <div key={n.n} className="rounded-xl p-3 flex sm:block items-center gap-3"
                    style={{ background: `rgba(0,191,165,${0.03 + n.n * 0.025})`, border: `1px solid rgba(0,191,165,${0.08 + n.n * 0.06})` }}>
                    <div className="flex items-center gap-2 sm:mb-1.5 flex-shrink-0">
                      <span className="font-poppins font-black text-[#00bfa5] text-[22px] leading-none">{n.n}</span>
                      <span className="font-poppins font-bold text-white/90 text-[14px]">{n.nombre}</span>
                    </div>
                    <p className="font-lato text-white/45 text-[13px] leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="font-lato text-white/45 text-[14px] mb-2.5">Cada área se mira en <Hl color="#fff">6 aspectos</Hl>:</p>
                <div className="flex flex-wrap gap-2">
                  {ASPECTOS.map((d) => (
                    <span key={d} className="font-lato text-[14px] px-3 py-1.5 rounded-full text-white/75"
                      style={{ background: 'rgba(47,124,246,.08)', border: '1px solid rgba(47,124,246,.25)' }}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─ 05 ENTREGABLES ─ */}
        <section id="entregables" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Entregables</TagLabel>
          <SectionTitle>Lo que ustedes reciben</SectionTitle>
          <Rule />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {ENTREGABLES.map((e, i) => {
              const Icon = e.icon;
              const ultimo = i === ENTREGABLES.length - 1 && ENTREGABLES.length % 2 === 1;
              return (
                <div key={e.titulo} className={`rounded-2xl p-5 flex flex-col ${ultimo ? 'sm:col-span-2' : ''}`}
                  style={{ background: 'rgba(255,255,255,.03)', border: `1px solid ${e.color}40` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${e.color}1f` }}>
                      <Icon className="w-5 h-5" style={{ color: e.color }} />
                    </div>
                    <p className="font-poppins font-bold text-white text-[18px] leading-snug">{i + 1}. {e.titulo}</p>
                    {e.tag && <MiniTag color={e.color}>{e.tag}</MiniTag>}
                  </div>
                  <p className="font-lato text-white/55 text-[16px] leading-relaxed mb-4">{rich(e.desc)}</p>
                  <ul className={`space-y-1.5 mt-auto ${ultimo ? 'sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0' : ''}`}>
                    {e.items.map((it, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-[3px]" style={{ color: e.color }} />
                        <span className="font-lato text-white/60 text-[15px]">{rich(it)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Ejemplo inventario */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,191,165,.2)' }}>
            <div className="px-5 py-3 flex flex-wrap items-center justify-between gap-2" style={{ background: 'rgba(0,191,165,.06)' }}>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00bfa5]" />
                <p className="font-poppins font-semibold text-white/75 text-[13px] uppercase tracking-wider">Así se ve el inventario de actividades</p>
              </div>
              <span className="font-lato text-white/35 text-[12px]">Ejemplo</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left">
                <thead>
                  <tr className="font-lato text-white/30 text-[11px] uppercase tracking-wider" style={{ background: 'rgba(255,255,255,.02)' }}>
                    {['Área', 'Actividad', 'Responsable', 'Quién la hace', 'Herramienta', 'Dificultad'].map(h => (
                      <th key={h} className="px-4 py-2.5 font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {EJEMPLO_INVENTARIO.map((r, i) => (
                    <tr key={i} className="font-lato text-[14px] align-top">
                      <td className="px-4 py-3 text-white/60">{r.proceso}</td>
                      <td className="px-4 py-3 text-white font-semibold">{r.actividad}</td>
                      <td className="px-4 py-3 text-white/60">{r.responsable}</td>
                      <td className="px-4 py-3 text-white/60">{r.ejecutor}</td>
                      <td className="px-4 py-3 text-white/60">{r.herramienta}</td>
                      <td className="px-4 py-3 text-[#f87171]">{r.dolor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 rounded-xl p-4 flex gap-3" style={{ background: 'rgba(167,139,250,.06)', border: '1px solid rgba(167,139,250,.2)' }}>
            <Sparkles className="w-4 h-4 flex-shrink-0 mt-1 text-[#a78bfa]" />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              El plan puede incluir <Hl color="#a78bfa">inteligencia artificial</Hl>, por ejemplo un asistente que <Hl color="#fff">prepare cotizaciones</Hl> o <Hl color="#fff">alertas automáticas</Hl> cuando un contrato esté por vencer.
            </p>
          </div>
        </section>

        {/* ─ 06 COTIZACIÓN ─ */}
        <section id="cotizacion" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 — Inversión</TagLabel>
          <SectionTitle>Una inversión para decidir con datos</SectionTitle>
          <Rule />
          <p className="font-lato text-white/55 text-[18px] leading-relaxed mb-8">
            Una sola inversión que cubre <Hl color="#fff">{TOTAL_PROCESOS} procesos y {TOTAL_CARGOS} cargos</Hl>. Para que vean en qué se invierte, mostramos el <Hl>valor según el nivel de cada cargo</Hl>. Valores en pesos colombianos más IVA.
          </p>

          {/* Card total */}
          <div className="rounded-2xl p-7 sm:p-9 relative overflow-hidden mb-8"
            style={{ background: 'linear-gradient(135deg, rgba(0,191,165,.08) 0%, rgba(29,112,162,.08) 100%)', border: '1px solid rgba(0,191,165,.3)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,191,165,.06), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <div className="relative z-10">
              <p className="font-lato text-white/40 text-[15px] uppercase tracking-widest mb-2">Inversión total</p>
              <p className="font-poppins font-black text-white leading-none mb-3" style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)' }}>
                {fmt(TOTAL_NUM)}
              </p>
              <p className="font-lato text-white/45 text-[15px] mb-6">+ IVA · 10 semanas · 2 pagos</p>
              <div className="flex flex-wrap gap-2">
                {[
                  `✓ ${TOTAL_CARGOS} horas de entrevistas`,
                  '✓ Encuesta a todo el personal',
                  '✓ 5 horas de mesas de trabajo',
                  '✓ Taller de visión con la gerencia',
                  '✓ Situación actual y deseada',
                  '✓ Flujograma actualizado',
                  '✓ Inventario de actividades',
                  '✓ Hoja de ruta',
                ].map((item, i) => (
                  <span key={i} className="font-lato text-[14px] px-3 py-1.5 rounded-full text-white/75"
                    style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Desglose */}
          <div className="rounded-xl overflow-hidden mb-6" style={{ border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="px-5 py-3 flex items-center gap-2" style={{ background: 'rgba(255,255,255,.04)' }}>
              <BarChart3 className="w-4 h-4 text-[#00bfa5]" />
              <p className="font-poppins font-semibold text-white/60 text-[13px] uppercase tracking-wider">Desglose</p>
            </div>
            <div className="divide-y divide-white/5">
              {CARGOS_POR_NIVEL.map((n) => {
                const ns = NIVEL_STYLE[n.nivel];
                return (
                  <div key={n.nivel} className="flex flex-col sm:flex-row sm:items-center px-5 py-4 gap-1 sm:gap-4">
                    <div className="sm:flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-poppins font-semibold text-white/90 text-[16px]">Cargos de nivel {n.nivel.toLowerCase()}</span>
                        <span className="font-lato text-[12px] px-2 py-0.5 rounded-full" style={{ background: ns.bg, color: ns.color }}>
                          {n.cantidad} × {fmt(n.unitario)}
                        </span>
                      </div>
                      <p className="font-lato text-white/40 text-[14px] mt-0.5 leading-snug">{rich(ns.desc, 'rgba(255,255,255,.75)')}</p>
                    </div>
                    <span className="font-poppins font-black text-white text-[18px] sm:text-right">{fmt(n.subtotal)}</span>
                  </div>
                );
              })}
              {COMPONENTES_FIJOS.map((c, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center px-5 py-4 gap-1 sm:gap-4">
                  <div className="sm:flex-1">
                    <span className="font-poppins font-semibold text-white/90 text-[16px]">{c.nombre}</span>
                    <p className="font-lato text-white/40 text-[14px] mt-0.5 leading-snug">{c.detalle}</p>
                  </div>
                  <span className="font-poppins font-black text-white text-[18px] sm:text-right">{fmt(c.valor)}</span>
                </div>
              ))}
              <div className="flex flex-col sm:flex-row sm:items-center px-5 py-4 gap-1" style={{ background: 'rgba(0,191,165,.04)' }}>
                <span className="font-poppins font-bold text-[#00bfa5] text-[15px] sm:flex-1 uppercase tracking-wider">Total</span>
                <span className="font-poppins font-black text-[#00bfa5] text-[20px]">{fmt(TOTAL_NUM)}</span>
              </div>
            </div>
          </div>

          <p className="font-lato text-white/45 text-[15px] leading-relaxed mb-8 flex gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
            <span>El valor de cada cargo incluye la <Hl color="#fff">preparación, la encuesta, la entrevista, el análisis y la ficha del cargo</Hl> revisada con ustedes. Si aparece o sobra un cargo, se ajusta según su nivel.</span>
          </p>

          {/* Pagos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {PAGOS.map((t, i) => (
              <div key={i} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-poppins font-bold text-white/70 text-[15px]">{t.tracto}</span>
                  <span className="font-poppins font-black text-[#00bfa5] text-[22px]">{t.porcentaje}%</span>
                </div>
                <p className="font-poppins font-black text-white text-[20px] mb-1">{fmt(TOTAL_NUM * t.porcentaje / 100)}</p>
                <p className="font-lato text-white/45 text-[14px]">{t.momento}</p>
              </div>
            ))}
          </div>

          {/* Siguiente paso */}
          <div className="rounded-xl p-5 flex gap-3" style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.22)' }}>
            <Zap className="w-4 h-4 flex-shrink-0 mt-1 text-[#00bfa5]" />
            <div>
              <p className="font-poppins font-semibold text-white/90 text-[17px] mb-1">Después del diagnóstico</p>
              <p className="font-lato text-white/55 text-[16px] leading-relaxed">
                <Hl color="#fff">Poner en marcha</Hl> la hoja de ruta <Hl color="#fff">no está incluido</Hl> en esta propuesta. Cada paso se puede cotizar por separado o realizar con nuestro <Hl>acompañamiento mensual</Hl>.
              </p>
            </div>
          </div>
        </section>

        {/* ── LOGOS DE CLIENTES ── */}
        <div className="mt-16">
          <LogoCarousel />
        </div>

        {/* ─ 07 VIGENCIA ─ */}
        <section id="vigencia" ref={s7.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s7.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>07 — Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y términos</SectionTitle>
          <Rule />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { titulo: 'Aprobación', desc: 'Basta su confirmación por **WhatsApp, correo o verbal** para firmar el contrato y agendar el arranque.', icon: CheckCircle },
              { titulo: 'Pagos', desc: '**50%** al iniciar y **50%** al finalizar los entregables. Más IVA, por transferencia.', icon: FileText },
              { titulo: 'Modalidad', desc: 'Sesiones **virtuales**. Si prefieren sesiones presenciales, los **viáticos se cotizan aparte**.', icon: MapPin },
              { titulo: 'Sesiones incluidas', desc: '**18 horas** de entrevistas (1 por cargo) y **5 horas** de mesas de trabajo. Las horas adicionales se cotizan aparte, por eso es clave que **cada cargo asista** a su sesión.', icon: Users },
              { titulo: 'Confidencialidad', desc: 'Toda la información que nos compartan es **confidencial** y solo se usa para esta consultoría.', icon: ShieldCheck },
              { titulo: 'Cambios', desc: 'Lo que no esté en esta propuesta requiere una **nueva cotización**.', icon: AlertCircle },
              { titulo: 'Inicio', desc: 'Arrancamos con el **primer pago** y la entrega de sus documentos vigentes.', icon: Zap },
              { titulo: 'Vigencia', desc: '**30 días calendario** desde la fecha de esta propuesta.', icon: Clock },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="rounded-xl p-4 sm:p-5 flex gap-3"
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
          <div className="mt-12 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 100%, rgba(0,191,165,.05), transparent 70%)' }} />
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
              <p className="font-lato text-white/45 text-[14px] mt-3">Propuesta elaborada por: <span className="text-white/75 font-semibold">{META.elaboradoPor}</span></p>
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

export default RosaniaHeldProposal;
