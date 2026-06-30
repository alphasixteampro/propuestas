import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap, BarChart3,
  AlertCircle, TrendingUp, Info, Calendar, MapPin,
  Rocket, Shield, Database, Settings, Bell, Lock,
  DollarSign, Layers, GitBranch, Eye, Activity, ArrowRight, X,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'SIAR S.A.S.',
  tagline: 'Visualización Financiera · Ecosistema Zoho',
  sector: 'Gestión documental · Custodia · Digitalización · Colombia',
  fecha: 'Junio 2026',
  lugar: 'Colombia',
  objetivo: 'Visualización de gastos por proyecto sincronizada con Siigo, utilizando el ecosistema Zoho para parametrizar, sincronizar y visualizar la información financiera en un entorno ya conocido.',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
};

const SIAR_BLUE = '#1a6fb4';

const HALLAZGOS = [
  {
    titulo: 'Sin visibilidad en tiempo real del gasto por proyecto',
    desc: 'Para saber cuánto se ha gastado en un proyecto, el equipo debe solicitar un corte al área contable. No existe una forma de consultar el estado financiero de un proyecto en tiempo real.',
    icon: Eye, tint: 'red',
  },
  {
    titulo: 'Nómina e insumos desconectados de los proyectos',
    desc: 'Los gastos de nómina, horas hombre e insumos no están correctamente asignados a los proyectos que los originan, lo que impide conocer la utilidad real por proyecto.',
    icon: AlertCircle, tint: 'amber',
  },
  {
    titulo: 'Siigo no ofrece visibilidad operativa por proyecto',
    desc: 'SIIGO es el sistema contable de SIAR, pero no está configurado para mostrar de manera ágil la relación entre causaciones y proyectos específicos. La información existe, pero no es accesible de forma práctica.',
    icon: Database, tint: 'blue',
  },
  {
    titulo: 'Zoho ya es el entorno de trabajo del equipo',
    desc: 'SIAR ya utiliza Zoho CRM para su flujo comercial. Aprovechar el ecosistema Zoho permite una integración coherente con lo que el equipo ya conoce, sin adoptar una herramienta nueva y ajena.',
    icon: Target, tint: 'teal',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber:  { text: '#f59e0b',   bg: 'rgba(251,191,36,.07)',   border: 'rgba(251,191,36,.18)' },
  teal:   { text: '#00bfa5',   bg: 'rgba(0,191,165,.07)',    border: 'rgba(0,191,165,.18)'  },
  blue:   { text: '#3b82f6',   bg: 'rgba(59,130,246,.07)',   border: 'rgba(59,130,246,.18)' },
  red:    { text: '#f87171',   bg: 'rgba(221,51,51,.07)',    border: 'rgba(221,51,51,.2)'   },
  purple: { text: '#a78bfa',   bg: 'rgba(167,139,250,.07)',  border: 'rgba(167,139,250,.18)'},
};

// ─── ECOSISTEMA DE HERRAMIENTAS ───────────────────────────────────────────────

const HERRAMIENTAS = [
  {
    nombre: 'Siigo',
    logo: '/siigo-logo.webp',
    rol: 'Fuente de datos',
    color: '#e74c3c',
    colorAlpha: 'rgba(231,76,60,.10)',
    colorBorder: 'rgba(231,76,60,.30)',
    desc: 'Sistema contable de SIAR. Origina la información financiera real: causaciones, centros de costo y movimientos contables que son la base de toda la visualización.',
    items: [
      'Exportación de movimientos contables por centro de costo',
      'Datos de nómina y gastos operativos causados',
      'Historial de transacciones por período',
    ],
  },
  {
    nombre: 'Zoho Books',
    logo: '/zoho-books-logo.jpg',
    rol: 'Modelo de datos',
    color: '#e67e22',
    colorAlpha: 'rgba(230,126,34,.10)',
    colorBorder: 'rgba(230,126,34,.30)',
    desc: 'Parametrización del modelo financiero. Aquí se define la estructura de datos: categorías de costo, centros de costo por proyecto y la lógica que permite asociar cada gasto a su proyecto correspondiente.',
    items: [
      'Configuración de centros de costo por proyecto',
      'Categorías de gasto: nómina, insumos, logística, administración',
      'Estructura contable alineada con la operación de SIAR',
      'Modelo de datos que conecta con Zoho Projects y Zoho Analytics',
    ],
  },
  {
    nombre: 'Zoho Projects',
    logo: '/zoho-projects-logo.png',
    rol: 'Sincronización de proyectos',
    color: '#3498db',
    colorAlpha: 'rgba(52,152,219,.10)',
    colorBorder: 'rgba(52,152,219,.30)',
    desc: 'Registro y seguimiento de proyectos activos. Establece la asociación entre cada proyecto de SIAR y sus transacciones financieras, permitiendo la trazabilidad financiera por proyecto.',
    items: [
      'Registro de proyectos activos con fecha de inicio y cierre estimado',
      'Asociación de gastos causados con cada proyecto',
      'Sincronización con Zoho Books para el cruce financiero',
      'Visibilidad del avance operativo del proyecto junto al estado financiero',
    ],
  },
  {
    nombre: 'Zoho Analytics',
    logo: '/zoho-analytics-logo.png',
    rol: 'Visualización e informes',
    color: '#27ae60',
    colorAlpha: 'rgba(39,174,96,.10)',
    colorBorder: 'rgba(39,174,96,.30)',
    desc: 'Capa de visualización: dashboards e informes interactivos que consolidan toda la información. El señor Freddy y el equipo directivo ven el estado financiero de cada proyecto sin depender del área contable.',
    items: [
      'Dashboard por proyecto: gasto real acumulado vs. referencia',
      'Informes de composición del gasto por categoría',
      'Vista consolidada de todos los proyectos activos',
      'Exportación de informes y gráficos en formato descargable',
      'Actualización de datos según el ciclo de sincronización definido',
    ],
  },
];

// ─── ALCANCE ──────────────────────────────────────────────────────────────────

type AlcanceItem = { text: string; tag?: string };

const ALCANCE = [
  {
    num: '01',
    nombre: 'Parametrización del modelo de datos en Zoho Books',
    icon: Database,
    color: '#e67e22',
    colorAlpha: 'rgba(230,126,34,.10)',
    colorBorder: 'rgba(230,126,34,.30)',
    descripcion: 'Configuración de Zoho Books como el núcleo del modelo financiero: categorías de gasto, centros de costo y la estructura que permite que cada transacción quede vinculada a su proyecto de origen.',
    items: [
      { text: 'Levantamiento de la estructura de proyectos activos de SIAR y sus categorías de gasto relevantes', tag: 'Diagnóstico' },
      { text: 'Configuración de centros de costo en Zoho Books alineados con los proyectos de SIAR' },
      { text: 'Definición de categorías de gasto: mano de obra, insumos, logística, tecnología, gastos administrativos' },
      { text: 'Parametrización del modelo para recibir y clasificar la información proveniente de Siigo' },
      { text: 'Documentación del modelo de datos configurado para que el equipo de SIAR pueda administrarlo' },
    ] as AlcanceItem[],
  },
  {
    num: '02',
    nombre: 'Sincronización de proyectos con Zoho Projects',
    icon: GitBranch,
    color: '#3498db',
    colorAlpha: 'rgba(52,152,219,.10)',
    colorBorder: 'rgba(52,152,219,.30)',
    descripcion: 'Configuración de Zoho Projects como el repositorio de proyectos activos, vinculado al modelo financiero de Zoho Books para que cada proyecto tenga su propio espacio de seguimiento financiero.',
    items: [
      { text: 'Creación y configuración de proyectos en Zoho Projects con los datos de SIAR', tag: 'Setup' },
      { text: 'Establecimiento de la asociación entre proyectos en Zoho Projects y centros de costo en Zoho Books' },
      { text: 'Configuración del flujo de sincronización entre Zoho Projects y Zoho Books' },
      { text: 'Definición del ciclo de actualización: con qué frecuencia se actualiza la información financiera por proyecto' },
    ] as AlcanceItem[],
  },
  {
    num: '03',
    nombre: 'Conexión con Siigo y carga de información',
    icon: Activity,
    color: '#e74c3c',
    colorAlpha: 'rgba(231,76,60,.10)',
    colorBorder: 'rgba(231,76,60,.30)',
    descripcion: 'Definición del mecanismo de integración entre Siigo y el ecosistema Zoho. En esta fase se establece cómo fluye la información contable de Siigo hacia Zoho Books para su clasificación por proyecto.',
    items: [
      { text: 'Análisis de los reportes y exportaciones disponibles desde Siigo (archivo plano, centros de costo, movimientos causados)', tag: 'Análisis' },
      { text: 'Definición del proceso de sincronización: manual con archivo exportado de Siigo o automático vía integración' },
      { text: 'Configuración del mapeo de datos: qué campos de Siigo corresponden a qué campos en Zoho Books' },
      { text: 'Pruebas de carga con información real de SIAR para validar la trazabilidad financiera por proyecto' },
      { text: 'Definición del proceso operativo para que el equipo de SIAR mantenga la información actualizada' },
    ] as AlcanceItem[],
  },
  {
    num: '04',
    nombre: 'Dashboards e informes en Zoho Analytics',
    icon: BarChart3,
    color: '#27ae60',
    colorAlpha: 'rgba(39,174,96,.10)',
    colorBorder: 'rgba(39,174,96,.30)',
    descripcion: 'Construcción de los dashboards e informes en Zoho Analytics que consolidan la información financiera por proyecto. Es el entregable más visible: la pantalla que el equipo directivo de SIAR consulta para tomar decisiones.',
    items: [
      { text: 'Dashboard principal: gasto total acumulado por proyecto vs. referencia o presupuesto disponible', tag: 'Entregable principal' },
      { text: 'Desglose del gasto por categoría: cuánto se ha gastado en mano de obra, insumos, logística y administración por proyecto' },
      { text: 'Vista consolidada de todos los proyectos activos: estado financiero de un vistazo' },
      { text: 'Informes de composición del gasto exportables (PDF, Excel)' },
      { text: 'Configuración de acceso diferenciado: gerencia ve todos los proyectos, líderes ven sus proyectos asignados' },
    ] as AlcanceItem[],
  },
  {
    num: '05',
    nombre: 'Capacitación y transferencia al equipo SIAR',
    icon: Shield,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.30)',
    descripcion: 'Sesiones de capacitación para que el equipo de SIAR pueda operar y administrar el ecosistema Zoho de forma autónoma al finalizar el proyecto.',
    items: [
      { text: 'Sesión de capacitación: cómo actualizar y cargar información desde Siigo a Zoho Books' },
      { text: 'Sesión de capacitación: uso de los dashboards en Zoho Analytics para seguimiento gerencial' },
      { text: 'Documentación del proceso completo: guía de operación del ecosistema configurado', tag: 'Entregable' },
      { text: 'Acompañamiento durante el primer ciclo de actualización de datos en producción' },
    ] as AlcanceItem[],
  },
];

const NO_INCLUYE = [
  'Calculadora de pricing o módulo de presupuesto de proyectos',
  'Proyección de matrices de costo o modelos de costeo detallado',
  'Licencias de Zoho Books, Zoho Projects o Zoho Analytics (se contratan directamente con Zoho)',
  'Metodologías de costeo — se recomienda mantener las metodologías actuales de SIAR',
  'Integración con sistemas distintos a Siigo y Zoho',
  'Desarrollo de software a medida o plataforma propia',
];

const SECCIONES = [
  { id: 'resumen',    label: 'Resumen'    },
  { id: 'solucion',  label: 'Solución'   },
  { id: 'ecosistema',label: 'Ecosistema' },
  { id: 'alcance',   label: 'Alcance'    },
  { id: 'inversion', label: 'Inversión'  },
  { id: 'vigencia',  label: 'Vigencia'   },
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
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: `linear-gradient(90deg,${SIAR_BLUE},#00bfa5)` }} />
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const SiarProposalV2 = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [alcanceActivo, setAlcanceActivo] = useState<number | null>(null);

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
  const s4 = useVisible(); const s5 = useVisible(); const s6 = useVisible();

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
            style={{ background: `radial-gradient(circle, rgba(26,111,180,.06) 0%, transparent 65%)` }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(29,112,162,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
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
                <img src="/siar-logo.jpg" alt="SIAR S.A.S." className="h-full w-auto object-contain rounded"
                  style={{ filter: 'drop-shadow(0 1px 4px rgba(26,111,180,.3))' }} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-lato text-white/40 text-[13px] uppercase tracking-[0.18em] border border-white/10 rounded-full px-3 py-1.5">V2</span>
            <span className="font-lato text-[#00bfa5]/80 text-[13px] uppercase tracking-[0.2em] border border-[#00bfa5]/20 rounded-full px-3 py-1.5">Confidencial</span>
          </div>
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
        `}</style>

        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <TagLabel>Propuesta de trabajo y cotización · Solución Financiera</TagLabel>
                <span className="font-poppins font-black text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(0,191,165,.15)', border: '1px solid rgba(0,191,165,.35)', color: '#00bfa5' }}>
                  Versión 2
                </span>
              </div>
              <div className="mt-1 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${SIAR_BLUE}, #1557a0)` }}>
                  <BarChart3 className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: `rgba(26,111,180,.12)`, border: `1px solid rgba(26,111,180,.28)`, color: '#60a5fa' }}>
                  {META.sector.split('·')[0].trim()}
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 4.8rem)' }}>
                Visibilidad<br />
                <span style={{ background: `linear-gradient(90deg,${SIAR_BLUE},#00bfa5)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Financiera
                </span>
                <br />
                <span className="text-white/80">con Zoho</span>
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
                  { icon: MapPin,   text: META.lugar },
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
                  {['1. Resumen ejecutivo','2. Solución propuesta','3. Ecosistema Zoho','4. Alcance de servicios','5. Propuesta de inversión','6. Vigencia y términos'].map((item, i) => (
                    <button key={i} onClick={() => scrollTo(SECCIONES[i]?.id)}
                      className="font-lato text-white/45 text-[15px] hover:text-[#00bfa5] transition-colors duration-200 text-left flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#00bfa5]/40 flex-shrink-0" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Derecha animada — logos del ecosistema */}
            <div className="flex items-center justify-center relative min-h-[380px]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="cover-glow absolute w-80 h-80 rounded-full"
                  style={{ background: `radial-gradient(circle, rgba(26,111,180,.08) 0%, rgba(0,191,165,.04) 50%, transparent 70%)` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full" style={{ border: `1px solid rgba(26,111,180,.12)` }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(0,191,165,.15)' }} />
              </div>
              <div className="cover-float relative z-10 flex flex-col items-center gap-4 w-full px-4">
                {/* Siigo + SIAR */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="rounded-xl p-3 flex items-center justify-center"
                      style={{ background: 'rgba(231,76,60,.12)', border: '1px solid rgba(231,76,60,.30)', boxShadow: '0 4px 20px rgba(231,76,60,.12)' }}>
                      <img src="/siigo-logo.webp" alt="Siigo" className="h-8 w-auto object-contain" />
                    </div>
                    <span className="font-lato text-white/35 text-[10px] uppercase tracking-wider">Siigo</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-8 h-px" style={{ background: 'rgba(255,255,255,.15)' }} />
                    <ArrowRight className="w-3.5 h-3.5 text-white/20" />
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="rounded-xl p-3 flex items-center justify-center"
                      style={{ background: 'rgba(230,126,34,.12)', border: '1px solid rgba(230,126,34,.30)', boxShadow: '0 4px 20px rgba(230,126,34,.12)' }}>
                      <img src="/zoho-books-logo.jpg" alt="Zoho Books" className="h-8 w-auto object-contain rounded" />
                    </div>
                    <span className="font-lato text-white/35 text-[10px] uppercase tracking-wider">Zoho Books</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-px h-6" style={{ background: 'rgba(255,255,255,.12)' }} />
                  <ArrowRight className="w-3.5 h-3.5 text-white/20 rotate-90" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="rounded-xl p-3 flex items-center justify-center"
                      style={{ background: 'rgba(52,152,219,.12)', border: '1px solid rgba(52,152,219,.30)', boxShadow: '0 4px 20px rgba(52,152,219,.12)' }}>
                      <img src="/zoho-projects-logo.png" alt="Zoho Projects" className="h-8 w-auto object-contain" />
                    </div>
                    <span className="font-lato text-white/35 text-[10px] uppercase tracking-wider">Zoho Projects</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-8 h-px" style={{ background: 'rgba(255,255,255,.15)' }} />
                    <ArrowRight className="w-3.5 h-3.5 text-white/20" />
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="rounded-xl p-3 flex items-center justify-center"
                      style={{ background: 'rgba(39,174,96,.12)', border: '1px solid rgba(39,174,96,.30)', boxShadow: '0 4px 20px rgba(39,174,96,.12)' }}>
                      <img src="/zoho-analytics-logo.png" alt="Zoho Analytics" className="h-8 w-auto object-contain" />
                    </div>
                    <span className="font-lato text-white/35 text-[10px] uppercase tracking-wider">Zoho Analytics</span>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <p className="font-poppins font-bold text-white/60 text-[14px]">SIAR S.A.S.</p>
                  <p className="font-lato text-[11px] uppercase tracking-[0.2em] mt-0.5" style={{ color: '#60a5fa' }}>Ecosistema integrado · 1 mes</p>
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
          <TagLabel>01 · Resumen ejecutivo</TagLabel>
          <SectionTitle>Contexto y diagnóstico</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center"
            style={{ background: 'rgba(2,8,20,.85)', border: `1px solid rgba(26,111,180,.20)` }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="rounded-xl p-4 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, rgba(26,111,180,.18), rgba(26,111,180,.06))`, border: `1px solid rgba(26,111,180,.3)` }}>
                <img src="/siar-logo.jpg" alt="SIAR S.A.S." className="h-10 w-auto object-contain rounded"
                  style={{ filter: 'drop-shadow(0 1px 6px rgba(26,111,180,.4))' }} />
              </div>
              <span className="font-lato text-[11px] uppercase tracking-[0.2em]" style={{ color: '#60a5fa' }}>Colombia</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">Gestión documental · Custodia · Digitalización</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sistemas actuales</p>
                <p className="font-lato text-white/60 text-[18px]">Siigo (contable) · Zoho CRM (comercial)</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Herramientas propuestas</p>
                <p className="font-lato text-white/60 text-[18px]">Zoho Books · Zoho Projects · Zoho Analytics</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Plazo estimado</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#00bfa5' }} />
                  <p className="font-poppins font-semibold text-[15px] text-[#00bfa5]">Resultados listos en 1 mes</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              SIAR S.A.S. enfrenta un reto de <strong className="text-white/90 font-semibold">visibilidad financiera por proyecto</strong>. Para saber cuánto se ha gastado en un proyecto, el equipo depende de solicitudes al área contable. La información existe en Siigo, pero no está disponible de forma ágil para el equipo directivo.
            </p>
            <p>
              Esta propuesta toma un enfoque diferente al modelo de desarrollo a medida: aprovechar el <strong className="text-white/90 font-semibold">ecosistema Zoho que SIAR ya utiliza</strong>. Zoho Books, Zoho Projects y Zoho Analytics son herramientas maduras, integrables entre sí, que permiten configurar el modelo de datos, sincronizar los proyectos y visualizar la información financiera sin construir una plataforma desde cero.
            </p>
            <p>
              Sixteam propone parametrizar, conectar y configurar estas herramientas para que SIAR tenga <strong className="text-white/90 font-semibold">visualización de gastos por proyecto sincronizada con Siigo</strong> en un plazo de 1 mes.
            </p>
          </div>

          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> Diagnóstico que motiva esta propuesta
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HALLAZGOS.map((h, i) => {
                const Icon = h.icon; const t = TINT[h.tint];
                return (
                  <div key={i} className="rounded-xl p-4 flex gap-3"
                    style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                    <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: t.text }} />
                    <div>
                      <p className="font-poppins font-semibold text-white/90 text-[18px] mb-1">{h.titulo}</p>
                      <p className="font-lato text-white/50 text-[15px] leading-relaxed">{h.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─ 02 SOLUCIÓN ─ */}
        <section id="solucion" ref={s2.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>02 · Solución propuesta</TagLabel>
          <SectionTitle>El ecosistema Zoho como solución</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden mb-6"
            style={{ background: `rgba(26,111,180,.06)`, border: `1px solid rgba(26,111,180,.20)` }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: `radial-gradient(circle, rgba(26,111,180,.07), transparent 70%)`, transform: 'translate(20%,-20%)' }} />
            <Activity className="w-7 h-7 mb-4" style={{ color: SIAR_BLUE }} />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[23px] leading-relaxed">
              En lugar de construir una plataforma desde cero, Sixteam propone <strong className="text-white font-black">configurar el ecosistema Zoho</strong> — herramientas que SIAR ya conoce — para obtener visibilidad financiera por proyecto en un mes, con un costo significativamente menor.
            </p>
          </div>

          <p className="font-lato text-white/30 text-[13px] uppercase tracking-widest mb-3">Por qué Zoho es la opción correcta para esta etapa</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              {
                icon: Shield, color: SIAR_BLUE, colorAlpha: 'rgba(26,111,180,.08)', colorBorder: 'rgba(26,111,180,.22)',
                titulo: 'Entorno ya conocido',
                desc: 'SIAR ya usa Zoho CRM. El ecosistema Zoho es familiar para el equipo, lo que reduce la curva de adopción y facilita la integración con los procesos existentes.',
              },
              {
                icon: Zap, color: '#00bfa5', colorAlpha: 'rgba(0,191,165,.08)', colorBorder: 'rgba(0,191,165,.22)',
                titulo: 'Resultados en 1 mes',
                desc: 'Configurar herramientas existentes es más rápido que construir software. En 1 mes, SIAR puede tener dashboards reales con información de gastos por proyecto.',
              },
              {
                icon: GitBranch, color: '#a78bfa', colorAlpha: 'rgba(167,139,250,.07)', colorBorder: 'rgba(167,139,250,.20)',
                titulo: 'Integración nativa',
                desc: 'Zoho Books, Zoho Projects y Zoho Analytics están diseñados para integrarse entre sí, lo que facilita la sincronización de datos sin desarrollos complejos.',
              },
              {
                icon: TrendingUp, color: '#34d399', colorAlpha: 'rgba(52,211,153,.07)', colorBorder: 'rgba(52,211,153,.20)',
                titulo: 'Escalable en el futuro',
                desc: 'Esta base puede crecer: más proyectos, más usuarios, más detalle en los reportes. El ecosistema Zoho escala con el negocio sin necesidad de rediseñar la solución.',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="rounded-xl p-5 flex gap-4"
                  style={{ background: item.colorAlpha, border: `1px solid ${item.colorBorder}` }}>
                  <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: item.color }} />
                  <div>
                    <p className="font-poppins font-bold text-white/90 text-[17px] mb-1">{item.titulo}</p>
                    <p className="font-lato text-white/50 text-[15px] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl p-5 flex gap-3 mb-6"
            style={{ background: 'rgba(245,158,11,.05)', border: '1px solid rgba(245,158,11,.20)' }}>
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#f59e0b]" />
            <div>
              <p className="font-poppins font-semibold text-white/80 text-[17px] mb-2">Metodologías de costeo: se mantienen las actuales</p>
              <p className="font-lato text-white/50 text-[15px] leading-relaxed">
                Esta propuesta no incluye calculadora de pricing ni módulo de presupuesto detallado. La visibilidad financiera que ofrece esta solución se basa en los datos reales causados en Siigo y su asociación con cada proyecto. Se recomienda <strong className="text-white/70">mantener las metodologías de costeo actuales</strong> de SIAR en esta etapa.
              </p>
            </div>
          </div>

          <div className="rounded-xl p-5 flex gap-3"
            style={{ background: 'rgba(26,111,180,.05)', border: '1px solid rgba(26,111,180,.18)' }}>
            <DollarSign className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: SIAR_BLUE }} />
            <div>
              <p className="font-poppins font-semibold text-white/80 text-[17px] mb-2">Sobre las licencias de Zoho</p>
              <p className="font-lato text-white/50 text-[15px] leading-relaxed">
                Las licencias de Zoho Books, Zoho Projects y Zoho Analytics <strong className="text-white/70">no están incluidas</strong> en esta propuesta. Son licenciamientos adicionales que SIAR contrata directamente con Zoho. Sixteam no maneja ni administra las cuentas de Zoho del cliente.
              </p>
            </div>
          </div>
        </section>

        {/* ─ 03 ECOSISTEMA ─ */}
        <section id="ecosistema" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 · Ecosistema Zoho</TagLabel>
          <SectionTitle>Cómo se integran las herramientas</SectionTitle>
          <Rule />

          <p className="font-lato text-white/55 text-[18px] leading-relaxed mb-10">
            La solución conecta cuatro herramientas en un flujo coherente: Siigo como fuente de datos contables, Zoho Books como el modelo de datos parametrizado, Zoho Projects como el repositorio de proyectos, y Zoho Analytics como la capa de visualización para el equipo directivo.
          </p>

          {/* Diagrama de integración — desktop horizontal, mobile vertical */}
          <div className="rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(26,111,180,.04), transparent 60%)' }} />
            <p className="font-lato text-white/30 text-[13px] uppercase tracking-widest mb-6 relative z-10">Flujo de integración</p>

            {/* Herramientas en flujo */}
            <div className="relative z-10">
              {/* Desktop: horizontal */}
              <div className="hidden sm:flex items-start gap-0">
                {HERRAMIENTAS.map((h, i) => (
                  <React.Fragment key={i}>
                    <div className="flex-1 flex flex-col items-center gap-3 min-w-0">
                      {/* Logo card */}
                      <div className="rounded-2xl p-4 flex items-center justify-center w-full aspect-square max-w-[100px]"
                        style={{ background: h.colorAlpha, border: `1px solid ${h.colorBorder}`, boxShadow: `0 4px 24px ${h.color}18` }}>
                        <img src={h.logo} alt={h.nombre}
                          className="w-full h-full object-contain rounded-lg"
                          style={{ maxHeight: 52 }} />
                      </div>
                      {/* Rol label */}
                      <div className="text-center">
                        <p className="font-poppins font-bold text-white text-[14px] leading-tight">{h.nombre}</p>
                        <p className="font-lato text-[11px] uppercase tracking-wider mt-0.5" style={{ color: h.color }}>{h.rol}</p>
                      </div>
                    </div>
                    {i < HERRAMIENTAS.length - 1 && (
                      <div className="flex flex-col items-center justify-center self-center px-1 flex-shrink-0" style={{ marginTop: '-28px' }}>
                        <div className="h-px w-8" style={{ background: 'rgba(255,255,255,.12)' }} />
                        <ArrowRight className="w-4 h-4 -mt-2" style={{ color: 'rgba(255,255,255,.25)' }} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Mobile: vertical */}
              <div className="flex sm:hidden flex-col items-center gap-0">
                {HERRAMIENTAS.map((h, i) => (
                  <React.Fragment key={i}>
                    <div className="flex items-center gap-4 w-full">
                      <div className="rounded-xl p-3 flex items-center justify-center flex-shrink-0 w-14 h-14"
                        style={{ background: h.colorAlpha, border: `1px solid ${h.colorBorder}` }}>
                        <img src={h.logo} alt={h.nombre} className="w-full h-full object-contain rounded" />
                      </div>
                      <div>
                        <p className="font-poppins font-bold text-white text-[15px]">{h.nombre}</p>
                        <p className="font-lato text-[11px] uppercase tracking-wider" style={{ color: h.color }}>{h.rol}</p>
                      </div>
                    </div>
                    {i < HERRAMIENTAS.length - 1 && (
                      <div className="flex flex-col items-center py-1 self-start ml-7">
                        <div className="w-px h-4" style={{ background: 'rgba(255,255,255,.15)' }} />
                        <ArrowRight className="w-3.5 h-3.5 rotate-90" style={{ color: 'rgba(255,255,255,.2)' }} />
                        <div className="w-px h-4" style={{ background: 'rgba(255,255,255,.15)' }} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Descripción de cada herramienta */}
          <div className="space-y-4">
            {HERRAMIENTAS.map((h, i) => (
              <div key={i} className="rounded-xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,.03)', border: `1px solid rgba(255,255,255,.07)` }}>
                <div className="p-4 sm:p-5 flex gap-4 items-start">
                  <div className="rounded-xl p-2.5 flex items-center justify-center flex-shrink-0 w-12 h-12"
                    style={{ background: h.colorAlpha, border: `1px solid ${h.colorBorder}` }}>
                    <img src={h.logo} alt={h.nombre} className="w-full h-full object-contain rounded" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-poppins font-bold text-white text-[17px]">{h.nombre}</p>
                      <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                        style={{ background: `${h.color}18`, border: `1px solid ${h.color}35`, color: h.color }}>
                        {h.rol}
                      </span>
                    </div>
                    <p className="font-lato text-white/55 text-[16px] leading-relaxed mb-3">{h.desc}</p>
                    <ul className="space-y-1.5">
                      {h.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: h.color }} />
                          <span className="font-lato text-white/45 text-[14px] leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─ 04 ALCANCE ─ */}
        <section id="alcance" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 · Alcance de servicios</TagLabel>
          <SectionTitle>Qué está incluido en esta propuesta</SectionTitle>
          <Rule />

          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-5">
            5 entregables · 1 mes de ejecución
          </p>

          <div className="space-y-3 mb-10">
            {ALCANCE.map((bloque, i) => {
              const Icon = bloque.icon;
              const open = alcanceActivo === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${bloque.colorBorder}` : '1px solid rgba(255,255,255,.07)' }}>

                  <button onClick={() => setAlcanceActivo(open ? null : i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-poppins font-black text-[13px]"
                      style={{ background: open ? bloque.colorAlpha : 'rgba(255,255,255,.05)', color: open ? bloque.color : 'rgba(255,255,255,.35)', border: open ? `1px solid ${bloque.colorBorder}` : 'none' }}>
                      {bloque.num}
                    </div>
                    <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center">
                      <Icon className="w-4 h-4 transition-colors" style={{ color: open ? bloque.color : 'rgba(255,255,255,.30)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`font-poppins font-bold text-[17px] ${open ? 'text-white' : 'text-white/70'}`}>{bloque.nombre}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`}
                      style={{ color: open ? bloque.color : 'rgba(255,255,255,.3)' }} />
                  </button>

                  {open && (
                    <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <div className="pt-4">
                        <p className="font-lato text-white/60 text-[17px] leading-relaxed mb-4">{bloque.descripcion}</p>
                        <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Actividades incluidas</p>
                        <ul className="space-y-2">
                          {bloque.items.map((a, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: bloque.color }} />
                              <span className="font-lato text-white/65 text-[17px] flex-1">{a.text}
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
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Lo que NO está incluido */}
          <div className="rounded-xl p-5 sm:p-6"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="flex items-center gap-2 mb-4">
              <X className="w-4 h-4 text-white/30" />
              <p className="font-poppins font-semibold text-white/60 text-[15px] uppercase tracking-wider">Fuera del alcance de esta propuesta</p>
            </div>
            <ul className="space-y-2.5">
              {NO_INCLUYE.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 bg-white/20" />
                  <span className="font-lato text-white/40 text-[16px] leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─ 05 INVERSIÓN ─ */}
        <section id="inversion" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 · Propuesta de inversión</TagLabel>
          <SectionTitle>Una sola opción, alcance claro.</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Esta propuesta tiene un único valor de implementación. No incluye mensualidad de Sixteam. Las licencias de Zoho se contratan por separado directamente con Zoho. Valores en{' '}
            <strong className="text-white/75">pesos colombianos (COP).</strong>
          </p>

          {/* Card de inversión única */}
          <div className="rounded-2xl overflow-hidden mb-8"
            style={{
              background: `linear-gradient(135deg, rgba(26,111,180,.10) 0%, rgba(3,13,26,.97) 100%)`,
              border: `1px solid rgba(26,111,180,.35)`,
              boxShadow: `0 4px 40px rgba(26,111,180,.14)`,
            }}>
            <div className="p-5 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row gap-6 sm:items-start">
                {/* Precio */}
                <div className="flex-shrink-0">
                  <div className="rounded-2xl px-6 py-5 text-center"
                    style={{ background: `rgba(26,111,180,.14)`, border: `1px solid rgba(26,111,180,.32)` }}>
                    <p className="font-lato text-white/35 text-[12px] uppercase tracking-wider mb-1">Valor de implementación</p>
                    <p className="font-poppins font-black text-white" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', lineHeight: 1.1 }}>
                      $6.500.000
                    </p>
                    <p className="font-lato text-white/45 text-[14px] mt-1">COP · Único pago</p>
                  </div>
                  <div className="mt-3 rounded-xl px-4 py-3 text-center"
                    style={{ background: 'rgba(0,191,165,.08)', border: '1px solid rgba(0,191,165,.22)' }}>
                    <p className="font-lato text-white/35 text-[11px] uppercase tracking-wider mb-0.5">Plazo de entrega</p>
                    <p className="font-poppins font-bold text-[#00bfa5] text-[16px]">1 mes</p>
                  </div>
                </div>

                {/* Descripción */}
                <div className="flex-1">
                  <p className="font-poppins font-black text-white text-[20px] sm:text-[22px] mb-1">
                    Parametrización y configuración del ecosistema Zoho
                  </p>
                  <p className="font-lato text-white/40 text-[15px] mb-5">Siigo como fuente de datos · Zoho Books · Zoho Projects · Zoho Analytics</p>
                  <ul className="space-y-2.5 mb-5">
                    {[
                      'Parametrización del modelo de datos financiero en Zoho Books',
                      'Configuración y sincronización de proyectos en Zoho Projects',
                      'Definición del mecanismo de integración con Siigo',
                      'Construcción de dashboards e informes en Zoho Analytics',
                      'Capacitación al equipo de SIAR y documentación del proceso',
                    ].map((p, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: SIAR_BLUE }} />
                        <span className="font-lato text-white/60 text-[16px] leading-snug">{p}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-xl p-3 flex gap-2"
                    style={{ background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.18)' }}>
                    <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#f59e0b]" />
                    <p className="font-lato text-white/45 text-[14px] leading-relaxed">
                      Las licencias de Zoho Books, Zoho Projects y Zoho Analytics <strong className="text-white/65">no están incluidas</strong> en este valor. SIAR las contrata directamente con Zoho según el plan que mejor se adapte a sus necesidades.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 sm:px-8 pb-6 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
              <p className="pt-5 font-lato text-white/30 text-[14px] leading-relaxed italic">
                Esta opción cubre la configuración, parametrización y acompañamiento de Sixteam durante el mes de ejecución. Al finalizar, SIAR administra las herramientas de forma autónoma. El soporte posterior de Sixteam se cotiza por separado según el alcance de cada solicitud.
              </p>
            </div>
          </div>

          {/* Forma de pago */}
          <div className="rounded-xl p-5 sm:p-6 mb-6"
            style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.20)' }}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#00bfa5]" />
              <p className="font-poppins font-semibold text-white/80 text-[18px]">Forma de pago sugerida</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { pct: '30%', valor: '$1.950.000', momento: 'Al inicio del proyecto', desc: 'Con la confirmación de la propuesta y firma del contrato.' },
                { pct: '40%', valor: '$2.600.000', momento: 'A los 15 días', desc: 'Con los modelos de datos parametrizados y los dashboards en construcción.' },
                { pct: '30%', valor: '$1.950.000', momento: 'Salida a producción', desc: 'Al finalizar el mes: dashboards en producción, capacitación completada.' },
              ].map((pago, i) => (
                <div key={i} className="rounded-xl p-4"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className="font-poppins font-black text-[#00bfa5] text-[28px] leading-none">{pago.pct}</p>
                    <p className="font-poppins font-semibold text-white/40 text-[14px]">{pago.valor} COP</p>
                  </div>
                  <p className="font-poppins font-semibold text-white/80 text-[15px] mb-1">{pago.momento}</p>
                  <p className="font-lato text-white/40 text-[13px] leading-relaxed">{pago.desc}</p>
                </div>
              ))}
            </div>
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

        {/* ─ 06 VIGENCIA ─ */}
        <section id="vigencia" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 · Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y Términos de la Propuesta</SectionTitle>
          <Rule />

          <div className="space-y-3">
            {[
              {
                titulo: 'Aprobación',
                desc: 'Para aceptar esta propuesta y dar inicio al proyecto, se requiere confirmación vía WhatsApp, correo o verbal. Con esa confirmación se habilita el contrato a firmar y se procede con el primer pago del 30%.',
                icon: CheckCircle,
              },
              {
                titulo: 'Términos de pago',
                desc: 'El pago se estructura en tres hitos: 30% al inicio del proyecto ($1.950.000 COP), 40% a los 15 días con avance visible ($2.600.000 COP) y 30% a la salida a producción ($1.950.000 COP). Los pagos se realizan mediante transferencia bancaria.',
                icon: FileText,
              },
              {
                titulo: 'Licencias de Zoho',
                desc: 'Las licencias de Zoho Books, Zoho Projects y Zoho Analytics no están incluidas en esta propuesta. Son licenciamientos adicionales que SIAR contrata directamente con Zoho. Sixteam no actúa como reseller ni administrador de las cuentas Zoho del cliente.',
                icon: Lock,
              },
              {
                titulo: 'Inicio del proyecto',
                desc: 'El proyecto inicia desde la confirmación y el primer pago. Se requiere que SIAR disponga de acceso activo a Siigo para los ejercicios de integración, y que designe un responsable por parte del equipo de SIAR para coordinar el levantamiento de información.',
                icon: Zap,
              },
              {
                titulo: 'Plazos de entrega',
                desc: 'Se estima un plazo de 1 mes calendario desde el inicio del proyecto hasta la salida a producción: parametrización en la primera semana, sincronización y pruebas en las semanas 2 y 3, dashboards y capacitación en la semana 4.',
                icon: Calendar,
              },
              {
                titulo: 'Propiedad y confidencialidad',
                desc: 'SIAR es propietario de todos sus datos y configuraciones. Sixteam se compromete a mantener la confidencialidad de la información de SIAR y sus clientes durante y después del proyecto.',
                icon: Shield,
              },
              {
                titulo: 'Modificaciones al alcance',
                desc: 'Cualquier funcionalidad no contemplada en esta propuesta — incluyendo calculadora de pricing, módulo de presupuesto, matrices de costo, desarrollo de software a medida o integraciones con sistemas adicionales — requerirá una nueva cotización.',
                icon: AlertCircle,
              },
              {
                titulo: 'Vigencia de la propuesta',
                desc: 'Esta propuesta tiene una vigencia de 30 días calendario desde su fecha de emisión. Pasado este plazo, los valores podrán ser revisados según las condiciones del mercado.',
                icon: Clock,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="rounded-xl p-4 sm:p-5 flex gap-4"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <Icon className="w-4 h-4 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-poppins font-semibold text-white/80 text-[18px] mb-1">{item.titulo}</p>
                    <p className="font-lato text-white/50 text-[18px] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-12 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 100%, rgba(26,111,180,.05), transparent 70%)` }} />
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
                <span>Propuesta realizada por</span>
                <span className="text-white/40 font-medium">Ernesto Hernández</span>
                <span>·</span>
                <span>Gerente Comercial</span>
              </div>
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                <p className="font-lato text-white/20 text-[13px]">
                  Process + Technology + People = Growth · Propuesta elaborada en {META.fecha} · Uso confidencial · Versión 2
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default SiarProposalV2;
