import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap, BarChart3,
  AlertCircle, Calendar, Info, MapPin, Users, Quote, Eye,
  Layers, ClipboardList, MessagesSquare, Search,
  Compass, HardHat, ShieldCheck, Wrench, Calculator,
  Map as MapIcon, Sparkles, ArrowRight, Bot, BookOpen,
  Hourglass, FolderOpen, Smartphone, Handshake, CreditCard, Flag,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────
// En los textos, **palabra** se resalta con rich()

const META = {
  cliente: 'LN Equipos S.A.S.',
  tagline: 'Alquiler de maquinaria pesada · Movimientos de tierra',
  sector: 'Alquiler y venta de maquinaria pesada',
  sede: 'Barranquilla, Atlántico',
  equipo: 'Estable, con 2 a 3 años en la empresa',
  herramientas: 'Google Drive · Gmail · WhatsApp',
  contacto: 'Mauxi Matute',
  fecha: 'Octubre 2026',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  elaboradoPor: 'Ernesto Hernández · Gerente Comercial',
  objetivo: 'Mapeo de procesos para identificar dónde integrar inteligencia artificial',
  duracion: '6 semanas',
};

const LN_YELLOW = '#f6ae13';
const VISION = '#f472b6';

// Hallazgos tomados de la reunión del 1 de octubre de 2026 con Mauxi Matute
const HALLAZGOS = [
  {
    titulo: 'Los datos están, los informes no',
    desc: 'Horas máquina, pagos, combustible y gastos **ya están digitados**, pero cada informe **se arma a mano** y llega tarde a la gerencia.',
    cita: 'Vamos a pedir informe y no los tienen hechos.',
    icon: BarChart3, tint: 'red',
  },
  {
    titulo: 'Horas máquina por WhatsApp',
    desc: 'Los operadores envían **fotos de los recibos** y una sola persona **vuelve a digitar todo** antes de poder trabajar con esa información.',
    cita: 'Eso es tiempo que se pierde.',
    icon: Smartphone, tint: 'amber',
  },
  {
    titulo: 'El día a día no deja tiempo',
    desc: 'La gerencia ya probó la inteligencia artificial y **sabe que funciona**. Lo que falta es **tiempo** para decidir por dónde empezar.',
    cita: 'O atiende a los clientes o se pone a hacer sus tareas automatizadas.',
    icon: Hourglass, tint: 'yellow',
  },
  {
    titulo: 'El conocimiento se va con la persona',
    desc: 'Cada quien trabaja a su manera y parte de la información vive en **cuentas personales de Drive**. Si alguien se va, **se lleva su forma de trabajar**.',
    cita: 'Ese conocimiento se lo lleva si se quiere ir.',
    icon: FolderOpen, tint: 'red',
  },
];

const TINT: Record<string, { text: string; color: string; bg: string; border: string }> = {
  amber:  { text: 'text-amber-400', color: '#fbbf24', bg: 'rgba(251,191,36,.07)', border: 'rgba(251,191,36,.18)' },
  yellow: { text: 'text-[#f6ae13]', color: LN_YELLOW, bg: 'rgba(246,174,19,.07)', border: 'rgba(246,174,19,.2)' },
  red:    { text: 'text-[#f87171]', color: '#f87171', bg: 'rgba(221,51,51,.07)',  border: 'rgba(221,51,51,.2)' },
};

// Lectura del manual de funciones (enero 2025), único documento recibido
const MANUAL = [
  { v: '16', l: 'cargos descritos' },
  { v: '2025', l: 'última versión' },
  { v: '5', l: 'puestos de oficina a trabajar' },
];

// Recorrido: hoy → mañana → camino
const RECORRIDO = [
  { paso: 'Hoy', titulo: 'Cómo se trabaja en cada puesto', tag: 'AS-IS', desc: 'Lo vemos **sentados con cada persona**, tarea por tarea.', icon: Search, color: LN_YELLOW },
  { paso: 'Mañana', titulo: 'Cómo debería funcionar', tag: 'TO-BE', desc: 'Lo define **la gerencia** a partir de su visión de la empresa.', icon: Eye, color: VISION },
  { paso: 'El camino', titulo: 'Dónde integrar IA primero', tag: 'Hoja de ruta', desc: 'Los **procesos críticos** y los **cuellos de botella**, en orden de prioridad.', icon: MapIcon, color: '#f59e0b' },
];

// ─── PUESTOS DE TRABAJO ──────────────────────────────────────────────────────

type Tipo = 'Dirección' | 'Comercial' | 'Operación' | 'Soporte';

const TIPO_STYLE: Record<Tipo, { color: string; bg: string }> = {
  'Dirección': { color: '#a78bfa', bg: 'rgba(167,139,250,.10)' },
  'Comercial': { color: LN_YELLOW, bg: 'rgba(246,174,19,.10)' },
  'Operación': { color: '#60a5fa', bg: 'rgba(96,165,250,.10)' },
  'Soporte':   { color: '#00bfa5', bg: 'rgba(0,191,165,.10)' },
};

const PUESTOS: {
  id: string; nombre: string; tipo: Tipo; icon: React.ElementType;
  alcance: string; manual: string; hoy: string; ideas: string[];
}[] = [
  {
    id: 'P1', nombre: 'Gerencia Comercial', tipo: 'Comercial', icon: Handshake,
    alcance: 'Atención de clientes, cotizaciones, alquiler, venta y compra de máquinas',
    manual: 'No aparece en el manual de funciones',
    hoy: 'Pasa el día **atendiendo clientes y buscando máquinas**. No le queda tiempo para ordenar su propio trabajo.',
    ideas: ['Asistente para **cotizaciones y seguimiento** a clientes', 'Organización automática de **documentos y carpetas**'],
  },
  {
    id: 'P2', nombre: 'Contabilidad', tipo: 'Soporte', icon: Calculator,
    alcance: 'Registro contable, cuentas por cobrar y por pagar, informes para la gerencia',
    manual: 'Contador y equipo de apoyo',
    hoy: 'La información ya está digitada, pero **los informes se hacen a mano** y se retrasan.',
    ideas: ['**Informes por máquina** generados con los datos ya digitados', 'Resumen de **cartera y pagos pendientes** para la gerencia'],
  },
  {
    id: 'P3', nombre: 'SST y Administración', tipo: 'Soporte', icon: ShieldCheck,
    alcance: 'Seguridad y salud en el trabajo, horas máquina, recibos y apoyo administrativo',
    manual: 'Técnico HSEQ y Asistente Administrativo',
    hoy: 'Recibe por **WhatsApp las fotos de los recibos** y digita las horas de cada máquina.',
    ideas: ['**Registro de horas máquina** que llena el operador desde el celular', 'Lectura automática de **fotos de recibos**'],
  },
  {
    id: 'P4', nombre: 'Jefatura Operativa', tipo: 'Operación', icon: HardHat,
    alcance: 'Coordinación de máquinas y operadores en campo, informes de operación',
    manual: 'Coordinador Operativo',
    hoy: 'Está **en campo con su tablet** y los informes quedan para después.',
    ideas: ['**Informe de operación dictado por voz** desde la tablet', 'Resumen diario de **dónde está cada máquina**'],
  },
  {
    id: 'P5', nombre: 'Jefatura de Mantenimiento', tipo: 'Operación', icon: Wrench,
    alcance: 'Mantenimiento preventivo y correctivo, fichas y hojas de vida de las máquinas',
    manual: 'Mecánico',
    hoy: 'Las fichas y hojas de vida de las máquinas están en **un Drive personal**.',
    ideas: ['**Hoja de vida de cada máquina** en un espacio de la empresa', '**Alertas de mantenimiento** preventivo'],
  },
];

const TOTAL_PUESTOS = PUESTOS.length;

// ─── ETAPAS ──────────────────────────────────────────────────────────────────

type Actividad = { text: string; tag?: string };

const ETAPAS = [
  {
    num: '01',
    nombre: 'Arranque',
    duracion: 'Semana 1',
    icon: FileText,
    color: LN_YELLOW,
    colorAlpha: 'rgba(246,174,19,.12)',
    colorBorder: 'rgba(246,174,19,.3)',
    descripcion: 'Partimos de su **manual de funciones** para no empezar de cero.',
    actividades: [
      { text: '**Reunión de arranque** con la gerencia', tag: 'Con ustedes' },
      { text: 'Presentación del proyecto **al equipo**, para que lo vean como una ayuda y no como una carga', tag: 'Con ustedes' },
      { text: '**Agenda** de trabajo con cada puesto' },
    ] as Actividad[],
  },
  {
    num: '02',
    nombre: 'Acompañamiento en el puesto',
    duracion: 'Semanas 1 a 3',
    icon: MessagesSquare,
    color: '#60a5fa',
    colorAlpha: 'rgba(96,165,250,.10)',
    colorBorder: 'rgba(96,165,250,.3)',
    descripcion: 'Nos sentamos con **cada persona** para ver qué hace, **con qué** y **cuánto tiempo** le toma.',
    actividades: [
      { text: '**Media jornada en cada puesto**, viendo el trabajo real', tag: 'Con ustedes' },
      { text: 'Revisión de los **archivos que usan a diario**: informes, recibos, fichas y cotizaciones' },
      { text: 'Lista de las **tareas que más tiempo consumen**' },
    ] as Actividad[],
  },
  {
    num: '03',
    nombre: 'Situación actual',
    tag: 'AS-IS',
    duracion: 'Semanas 3 y 4',
    icon: Search,
    color: '#a78bfa',
    colorAlpha: 'rgba(167,139,250,.10)',
    colorBorder: 'rgba(167,139,250,.3)',
    descripcion: 'Dejamos **por escrito** cómo se trabaja y señalamos **dónde se frena**.',
    actividades: [
      { text: '**Mapa de procesos** con el paso a paso de cada puesto' },
      { text: '**Procesos críticos** y **cuellos de botella** identificados' },
      { text: '**Manual de funciones actualizado** de los 5 puestos' },
      { text: 'Revisión con **cada persona**', tag: 'Con ustedes' },
    ] as Actividad[],
  },
  {
    num: '04',
    nombre: 'Situación deseada',
    tag: 'TO-BE',
    duracion: 'Semana 5',
    icon: Eye,
    color: VISION,
    colorAlpha: 'rgba(244,114,182,.10)',
    colorBorder: 'rgba(244,114,182,.3)',
    descripcion: 'Con **la gerencia** definimos cómo deberían funcionar los procesos críticos.',
    actividades: [
      { text: '**Taller de visión** con la gerencia', tag: 'Con ustedes' },
      { text: 'Qué tareas se podrían **apoyar en IA** y cuáles **sigue aprobando una persona**' },
      { text: 'Aprobación de la situación deseada **por la gerencia**', tag: 'Con ustedes' },
    ] as Actividad[],
  },
  {
    num: '05',
    nombre: 'Hoja de ruta y entrega',
    duracion: 'Semana 6',
    icon: MapIcon,
    color: '#f59e0b',
    colorAlpha: 'rgba(245,158,11,.10)',
    colorBorder: 'rgba(245,158,11,.3)',
    descripcion: 'Les mostramos **dónde integrar IA primero** y con qué opciones, para que **ustedes decidan**.',
    actividades: [
      { text: 'Procesos en **orden de prioridad**: más beneficio con menos esfuerzo' },
      { text: '**Opciones de solución** para cada proceso crítico, con su inversión estimada' },
      { text: '**Presentación de resultados** a la gerencia', tag: 'Con ustedes' },
      { text: 'Entrega de los **5 entregables** en archivos editables' },
    ] as Actividad[],
  },
];

// ─── ENTREGABLES ─────────────────────────────────────────────────────────────

const ENTREGABLES = [
  {
    titulo: 'Mapa de procesos',
    tag: 'AS-IS',
    icon: ClipboardList,
    color: LN_YELLOW,
    desc: 'El paso a paso de cada puesto, **como realmente se trabaja**.',
    items: ['Tareas, herramienta y frecuencia', 'Quién responde y quién la hace'],
  },
  {
    titulo: 'Manual de funciones actualizado',
    icon: BookOpen,
    color: '#a78bfa',
    desc: 'Los **5 puestos** al día, incluido el que hoy no está en el manual.',
    items: ['Funciones y responsables reales', 'Archivo **editable**'],
  },
  {
    titulo: 'Procesos críticos y cuellos de botella',
    icon: AlertCircle,
    color: '#f87171',
    desc: 'Dónde **se pierde más tiempo** y qué procesos **no pueden fallar**.',
    items: ['En **orden de importancia**', 'Con el tiempo que consumen hoy'],
  },
  {
    titulo: 'Situación deseada',
    tag: 'TO-BE',
    icon: Eye,
    color: VISION,
    desc: 'Cómo deberían funcionar esos procesos según la **visión de la gerencia**.',
    items: ['Qué haría la IA y **qué aprueba una persona**', 'Aprobada por la gerencia'],
  },
  {
    titulo: 'Hoja de ruta de inteligencia artificial',
    icon: MapIcon,
    color: '#f59e0b',
    desc: 'En qué procesos integrar IA, **en qué orden** y **con qué opciones**, para que ustedes elijan la solución de la segunda fase.',
    items: ['Procesos en **orden de prioridad**', '**Opciones de solución** por proceso', 'Inversión estimada de cada opción'],
  },
];

const EJEMPLO_PUESTO = [
  { puesto: 'SST y Administración', proceso: 'Registro de horas máquina', hoy: 'Fotos por WhatsApp y digitación', freno: 'Doble digitación',       oportunidad: 'Registro directo desde el celular' },
  { puesto: 'Contabilidad',         proceso: 'Informe por máquina',       hoy: 'Se arma a mano',                  freno: 'Llega tarde a gerencia', oportunidad: 'Informe generado con los datos ya digitados' },
  { puesto: 'Gerencia',             proceso: 'Actas de junta',            hoy: 'A mano',                          freno: 'Seguimiento tardío',     oportunidad: 'Acta y compromisos al terminar la reunión' },
];

const SECCIONES = [
  { id: 'resumen',     label: 'Resumen' },
  { id: 'objetivo',    label: 'Objetivo' },
  { id: 'mapa',        label: 'Puestos' },
  { id: 'plan',        label: 'Plan' },
  { id: 'entregables', label: 'Entregables' },
  { id: 'cotizacion',  label: 'Inversión' },
  { id: 'vigencia',    label: 'Vigencia' },
];

// ─── INVERSIÓN ───────────────────────────────────────────────────────────────

const fmt = (n: number) => 'COP ' + n.toLocaleString('es-CO').replace(/,/g, '.');

const TOTAL_NUM = 4800000;
const DESCUENTO_ANTICIPADO = 5;

const FORMAS_PAGO = [
  {
    nombre: 'Pago anticipado',
    etiqueta: `${DESCUENTO_ANTICIPADO}% de descuento`,
    valor: fmt(TOTAL_NUM * (100 - DESCUENTO_ANTICIPADO) / 100),
    detalle: 'Un solo pago al iniciar',
    destacado: true,
  },
  {
    nombre: 'Dos pagos',
    etiqueta: '50% y 50%',
    valor: `2 × ${fmt(TOTAL_NUM / 2)}`,
    detalle: 'Al iniciar y al entregar',
    destacado: false,
  },
  {
    nombre: 'Tres pagos',
    etiqueta: '40%, 30% y 30%',
    valor: `${fmt(TOTAL_NUM * 0.4)} + 2 × ${fmt(TOTAL_NUM * 0.3)}`,
    detalle: 'Al iniciar, a la siguiente quincena y al finalizar el proyecto',
    destacado: false,
  },
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
// El logo de LN Equipos es blanco y amarillo, por eso va sobre fondo oscuro
const ClientLogo = ({ className = '' }: { className?: string }) => (
  <div className={`rounded-xl flex items-center justify-center ${className}`}
    style={{ background: 'linear-gradient(135deg,#0a2342,#12356b)', border: '1px solid rgba(246,174,19,.3)' }}>
    <img src="/ln-equipos-logo.png" alt={META.cliente} className="w-full h-auto object-contain"
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
  </div>
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const LnEquiposProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [etapaActiva, setEtapaActiva] = useState<number | null>(0);
  const [puestoActivo, setPuestoActivo] = useState<number | null>(0);

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
            style={{ background: 'radial-gradient(circle, rgba(246,174,19,.06) 0%, transparent 65%)' }} />
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
            <ClientLogo className="hidden sm:flex w-32 px-3 py-1.5" />
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
              <TagLabel>Fase 1 · Mapeo de procesos</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${LN_YELLOW}, #1d70a2)` }}>
                  <HardHat className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">Gerencia de {META.cliente}</span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 4.6rem)' }}>
                Propuesta<br />
                <span style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Comercial
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
                  {['1. Resumen', '2. Objetivo', '3. Puestos de trabajo', '4. Plan de trabajo', '5. Entregables', '6. Inversión', '7. Vigencia y términos'].map((item, i) => (
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
                  style={{ background: 'radial-gradient(circle, rgba(246,174,19,.12) 0%, rgba(29,112,162,.05) 50%, transparent 70%)' }} />
                <div className="cover-ring-1 absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full" style={{ border: '1px solid rgba(246,174,19,.14)' }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(29,112,162,.15)' }} />
                <div className="cover-ring-1 absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: LN_YELLOW, boxShadow: '0 0 6px rgba(246,174,19,.8)' }} />
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
                  <ClientLogo className="w-60 px-5 py-4 shadow-[0_4px_30px_rgba(246,174,19,.25)]" />
                  <p className="font-lato text-[13px] uppercase tracking-[0.2em] mt-1 text-center" style={{ color: LN_YELLOW }}>Maquinaria pesada · Alquiler · Venta</p>
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
            style={{ background: 'rgba(2,8,20,.85)', border: '1px solid rgba(246,174,19,.2)' }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <ClientLogo className="w-48 px-4 py-3" />
              <span className="font-lato text-[11px] uppercase tracking-[0.2em]" style={{ color: LN_YELLOW }}>Maquinaria pesada</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Sector', value: META.sector, strong: true },
                { label: 'Sede', value: META.sede, strong: true },
                { label: 'Equipo', value: META.equipo },
                { label: 'Contacto', value: META.contacto },
                { label: 'Herramientas actuales', value: META.herramientas, teal: true },
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
              LN Equipos <Hl color="#fff">alquila y vende maquinaria pesada</Hl> con una clientela consolidada y un equipo estable.
            </p>
            <p>
              Ustedes ya saben que la <Hl>inteligencia artificial</Hl> puede ahorrarles tiempo. Antes de construir cualquier herramienta, conviene saber <Hl color="#fff">en qué procesos vale la pena</Hl>: los que son críticos o donde <Hl color="#f87171">hoy se frena el trabajo</Hl>.
            </p>
          </div>

          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex gap-4 items-start" style={{ background: 'rgba(246,174,19,.06)', border: '1px solid rgba(246,174,19,.22)' }}>
            <Quote className="w-6 h-6 flex-shrink-0" style={{ color: LN_YELLOW }} />
            <div>
              <p className="font-poppins font-semibold text-white/90 text-[20px] sm:text-[22px] leading-snug">"Que vaya una persona y <span style={{ color: LN_YELLOW }}>analice puesto por puesto</span> cuáles son las tareas diarias."</p>
              <p className="font-lato text-white/40 text-[14px] mt-2">{META.contacto} · LN Equipos</p>
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

          {/* Punto de partida: manual de funciones */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#00bfa5]" /> Su manual de funciones
            </p>
            <p className="font-lato text-white/40 text-[15px] mb-5">El documento que nos compartieron como punto de partida</p>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {MANUAL.map((k, i) => (
                <div key={i} className="rounded-xl p-3 text-center" style={{ background: 'rgba(246,174,19,.07)', border: '1px solid rgba(246,174,19,.2)' }}>
                  <p className="font-poppins font-black text-white text-[24px] leading-none">{k.v}</p>
                  <p className="font-lato text-white/45 text-[13px] mt-1">{k.l}</p>
                </div>
              ))}
            </div>
            <p className="font-lato text-white/50 text-[16px] leading-relaxed">
              Dice <Hl color="#fff">qué hace cada cargo</Hl>, pero no <Hl color="#fbbf24">cómo lo hace ni con qué herramienta</Hl>. Ese detalle es el que mapeamos con ustedes.
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
              Sentarnos con <Hl color="#fff">cada puesto</Hl>, dejar por escrito <Hl color={LN_YELLOW}>cómo se trabaja</Hl> e identificar los <Hl color="#f87171">procesos críticos y cuellos de botella</Hl> donde la <Hl>inteligencia artificial</Hl> les ahorrará más tiempo.
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Puestos', value: String(TOTAL_PUESTOS), sub: 'más la gerencia' },
              { label: 'Etapas', value: String(ETAPAS.length), sub: 'con revisión de ustedes' },
              { label: 'Semanas', value: '6', sub: 'de principio a fin' },
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

          {/* Dos fases */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl p-5" style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.3)' }}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="font-poppins font-bold text-white text-[17px]">Fase 1 · Mapeo de procesos</span>
                <MiniTag color="#00bfa5">Esta propuesta</MiniTag>
              </div>
              <p className="font-lato text-white/55 text-[16px] leading-relaxed">
                <Hl color="#fff">No se construye nada</Hl>. Ustedes reciben el análisis y las recomendaciones para <Hl>decidir con claridad</Hl>.
              </p>
            </div>
            <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,.03)', border: '1px dashed rgba(255,255,255,.15)' }}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="font-poppins font-bold text-white/70 text-[17px]">Fase 2 · Implementación</span>
                <MiniTag color="#9ca3af">Después</MiniTag>
              </div>
              <p className="font-lato text-white/45 text-[16px] leading-relaxed">
                Se implementa <Hl color="#fff">la solución que ustedes escojan</Hl> a partir de la hoja de ruta.
              </p>
            </div>
          </div>
        </section>

        {/* ─ 03 PUESTOS DE TRABAJO ─ */}
        <section id="mapa" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — Puestos de trabajo</TagLabel>
          <SectionTitle>{TOTAL_PUESTOS} puestos y la gerencia</SectionTitle>
          <Rule />
          <p className="font-lato text-white/55 text-[18px] leading-relaxed mb-8">
            Son los puestos de oficina que ustedes señalaron en la reunión. Las oportunidades son <Hl color="#fff">un punto de partida</Hl>: el mapeo <Hl>las confirma o las descarta</Hl>.
          </p>

          <div className="space-y-2.5 mb-6">
            {PUESTOS.map((p, i) => {
              const Icon = p.icon;
              const open = puestoActivo === i;
              const ts = TIPO_STYLE[p.tipo];
              return (
                <div key={p.id} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${ts.color}55` : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setPuestoActivo(open ? null : i)}
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
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`}
                      style={{ color: open ? ts.color : 'rgba(255,255,255,.3)' }} />
                  </button>
                  {open && (
                    <div className="px-4 sm:px-5 pb-5 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <div>
                        <p className="font-lato text-white/30 text-[12px] uppercase tracking-wider mb-1.5">Hoy</p>
                        <p className="font-lato text-white/60 text-[16px] leading-relaxed mb-2">{rich(p.hoy)}</p>
                        <p className="font-lato text-[13px]" style={{ color: ts.color }}>En el manual: {p.manual}</p>
                      </div>
                      <div>
                        <p className="font-lato text-white/30 text-[12px] uppercase tracking-wider mb-1.5">Dónde podría ayudar la IA</p>
                        <ul className="space-y-1.5">
                          {p.ideas.map((idea, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: ts.color }} />
                              <span className="font-lato text-white/60 text-[16px]">{rich(idea)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Gerencia */}
          <div className="rounded-xl p-5 flex gap-3" style={{ background: 'rgba(167,139,250,.06)', border: '1px solid rgba(167,139,250,.22)' }}>
            <Compass className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#a78bfa]" />
            <div>
              <p className="font-poppins font-semibold text-white/90 text-[17px] mb-1">Y para la gerencia</p>
              <p className="font-lato text-white/55 text-[16px] leading-relaxed">
                También revisamos las <Hl color="#a78bfa">reuniones de junta</Hl>: cómo se hacen hoy las <Hl color="#fff">actas y el seguimiento a los compromisos</Hl>, para que no esperen dos meses.
              </p>
            </div>
          </div>
        </section>

        {/* ─ 04 PLAN ─ */}
        <section id="plan" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Plan de trabajo</TagLabel>
          <SectionTitle>{ETAPAS.length} etapas · {META.duracion}</SectionTitle>
          <Rule />

          <p className="font-lato text-white/55 text-[18px] mb-4">Así trabajamos con su equipo:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
            {[
              { icon: Search, titulo: 'Vemos', desc: 'Nos sentamos **en cada puesto** para entender el trabajo real.' },
              { icon: Flag, titulo: 'Señalamos', desc: 'Los **procesos críticos** y los **cuellos de botella** de la empresa.' },
              { icon: MapIcon, titulo: 'Recomendamos', desc: 'Dónde integrar IA y **con qué opciones**, para que ustedes decidan.' },
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
              style={{ background: 'linear-gradient(to bottom, rgba(246,174,19,.4), rgba(96,165,250,.4), rgba(167,139,250,.4), rgba(244,114,182,.4), rgba(245,158,11,.4))' }} />
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

          <div className="rounded-xl p-4 flex gap-3" style={{ background: 'rgba(244,114,182,.06)', border: '1px solid rgba(244,114,182,.22)' }}>
            <Eye className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: VISION }} />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              La <Hl color={VISION}>situación deseada</Hl> la define <Hl color="#fff">la gerencia</Hl>, no el consultor. Nuestro papel es convertir su visión en <Hl color="#fff">prioridades claras</Hl> para la segunda fase.
            </p>
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

          {/* Ejemplo del mapeo */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,191,165,.2)' }}>
            <div className="px-5 py-3 flex flex-wrap items-center justify-between gap-2" style={{ background: 'rgba(0,191,165,.06)' }}>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00bfa5]" />
                <p className="font-poppins font-semibold text-white/75 text-[13px] uppercase tracking-wider">Así se ve el mapeo</p>
              </div>
              <span className="font-lato text-white/35 text-[12px]">Ejemplo</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left">
                <thead>
                  <tr className="font-lato text-white/30 text-[11px] uppercase tracking-wider" style={{ background: 'rgba(255,255,255,.02)' }}>
                    {['Puesto', 'Proceso', 'Cómo se hace hoy', 'Cuello de botella', 'Oportunidad con IA'].map(h => (
                      <th key={h} className="px-4 py-2.5 font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {EJEMPLO_PUESTO.map((r, i) => (
                    <tr key={i} className="font-lato text-[14px] align-top">
                      <td className="px-4 py-3 text-white/60">{r.puesto}</td>
                      <td className="px-4 py-3 text-white font-semibold">{r.proceso}</td>
                      <td className="px-4 py-3 text-white/60">{r.hoy}</td>
                      <td className="px-4 py-3 text-[#f87171]">{r.freno}</td>
                      <td className="px-4 py-3 text-[#00bfa5]">{r.oportunidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ─ 06 COTIZACIÓN ─ */}
        <section id="cotizacion" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 — Inversión</TagLabel>
          <SectionTitle>Una inversión para decidir con claridad</SectionTitle>
          <Rule />
          <p className="font-lato text-white/55 text-[18px] leading-relaxed mb-8">
            Un solo valor que cubre el mapeo de los <Hl color="#fff">{TOTAL_PUESTOS} puestos y la gerencia</Hl>. Valores en pesos colombianos más IVA.
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
              <p className="font-lato text-white/45 text-[15px] mb-6">+ IVA · {META.duracion} · 3 formas de pago</p>
              <div className="flex flex-wrap gap-2">
                {[
                  '✓ Acompañamiento en cada puesto',
                  '✓ Mapa de procesos',
                  '✓ Manual de funciones actualizado',
                  '✓ Procesos críticos y cuellos de botella',
                  '✓ Taller de visión con la gerencia',
                  '✓ Situación actual y deseada',
                  '✓ Hoja de ruta de IA',
                ].map((item, i) => (
                  <span key={i} className="font-lato text-[14px] px-3 py-1.5 rounded-full text-white/75"
                    style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Formas de pago */}
          <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#00bfa5]" /> Elijan cómo pagar
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {FORMAS_PAGO.map((f, i) => (
              <div key={i} className="rounded-xl p-5 flex flex-col"
                style={f.destacado
                  ? { background: 'rgba(0,191,165,.07)', border: '1px solid rgba(0,191,165,.35)' }
                  : { background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="font-poppins font-bold text-white/80 text-[16px]">{f.nombre}</span>
                  <span className="font-lato text-[12px] px-2 py-0.5 rounded-full"
                    style={f.destacado
                      ? { background: 'rgba(0,191,165,.15)', color: '#00bfa5' }
                      : { background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.55)' }}>
                    {f.etiqueta}
                  </span>
                </div>
                <p className="font-poppins font-black text-white text-[19px] mb-1">{f.valor}</p>
                <p className="font-lato text-white/45 text-[14px] mt-auto">{f.detalle}</p>
              </div>
            ))}
          </div>

          {/* Siguiente paso */}
          <div className="rounded-xl p-5 flex gap-3" style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.22)' }}>
            <Zap className="w-4 h-4 flex-shrink-0 mt-1 text-[#00bfa5]" />
            <div>
              <p className="font-poppins font-semibold text-white/90 text-[17px] mb-1">Fase 2 · Implementación</p>
              <p className="font-lato text-white/55 text-[16px] leading-relaxed">
                <Hl color="#fff">Construir e implementar</Hl> la solución <Hl color="#fff">no está incluido</Hl> en esta propuesta. Con la hoja de ruta ustedes eligen el camino, desde herramientas de IA por puesto hasta una plataforma donde todo el equipo trabaje integrado, y esa fase <Hl>se cotiza según lo que escojan</Hl>.
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
              { titulo: 'Pagos', desc: 'Ustedes eligen entre **pago anticipado**, **dos pagos** de 50% o **tres pagos** de 40%, 30% y 30%. Más IVA, por transferencia.', icon: FileText },
              { titulo: 'Modalidad', desc: 'El acompañamiento en cada puesto es **presencial en su sede de Barranquilla**. Las demás sesiones son **virtuales**.', icon: MapPin },
              { titulo: 'Alcance', desc: `Mapeo de **${TOTAL_PUESTOS} puestos** y las reuniones de junta. Es un trabajo **de consultoría**: no incluye construir herramientas. Puestos adicionales se cotizan aparte.`, icon: Users },
              { titulo: 'Segunda fase', desc: 'La **implementación** se cotiza aparte, según la **solución que ustedes escojan** de la hoja de ruta.', icon: Bot },
              { titulo: 'Confidencialidad', desc: 'Toda la información que nos compartan es **confidencial** y solo se usa para esta consultoría.', icon: ShieldCheck },
              { titulo: 'Cambios', desc: 'Lo que no esté en esta propuesta requiere una **nueva cotización**.', icon: AlertCircle },
              { titulo: 'Vigencia', desc: '**30 días calendario** desde la fecha de esta propuesta. Arrancamos con el **primer pago**.', icon: Clock },
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

export default LnEquiposProposal;
