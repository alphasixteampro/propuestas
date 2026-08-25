import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap, BarChart3,
  AlertCircle, TrendingUp, Calendar, Info, MapPin,
  MessageSquare, Settings, Users, LayoutDashboard,
  Rocket, Bot, Inbox, Database, Coins, Headphones,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente:    'Demiles Group',
  tagline:    'Inmobiliaria · Proyectos y lotes',
  sector:     'Inmobiliaria · Cartagena, Barranquilla y Vía al Mar',
  sede:       'Cartagena · Barranquilla',
  fecha:      'Agosto 2026',
  contacto:   'Ana Milena Sanjulián Trespalacios',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit:        '901.967.849-4',
  correo:     'alpha@sixteam.pro',
  rl:         'Samuel Armando Burgos Ferrer',
  objetivo:
    'Implementar el CRM Sixteam.pro con ChatCenter para los asesores y un Asistente de IA que atienda, filtre y asigne cada lead al asesor que cierra la venta.',
};

const DG = '#d4a03c';
const DG_BG = 'rgba(212,160,60,.07)';
const DG_BORDER = 'rgba(212,160,60,.25)';

const IMPLEMENTACION_COP = '2.000.000';
const PLAN_MES_COP = '850.000';
const CREDITOS_MES = 60;
const SOLICITUDES_MES = 5;

// ─── DIAGNÓSTICO ─────────────────────────────────────────────────────────────

const HALLAZGOS = [
  {
    titulo: 'Los leads no quedan registrados',
    desc: 'Entran 50–60 leads diarios por WhatsApp, Instagram y Facebook. No hay una base de datos donde queden guardados: la información vive en los teléfonos de los asesores.',
    icon: Database, tint: 'gold',
  },
  {
    titulo: 'El bot actual filtra muy poco',
    desc: 'El chatbot de ManyChat responde con preguntas y respuestas programadas. El filtro es mínimo y el asesor termina llamando a todos por igual.',
    icon: MessageSquare, tint: 'red',
  },
  {
    titulo: 'Sin control operativo del equipo',
    desc: '12 asesores trabajando sin visibilidad de quién atiende qué, en cuánto tiempo responde ni en qué estado quedó cada oportunidad.',
    icon: BarChart3, tint: 'amber',
  },
  {
    titulo: 'El reparto de leads es manual',
    desc: 'Cinco asesores fijos filtran y reparten al resto del equipo a mano. El proceso depende de las personas, no del sistema.',
    icon: TrendingUp, tint: 'blue',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  gold:  { text: 'text-[#d4a03c]', bg: 'rgba(212,160,60,.07)', border: 'rgba(212,160,60,.2)' },
  teal:  { text: 'text-[#00bfa5]', bg: 'rgba(0,191,165,.07)',  border: 'rgba(0,191,165,.18)' },
  blue:  { text: 'text-[#60a5fa]', bg: 'rgba(96,165,250,.07)', border: 'rgba(96,165,250,.18)' },
  amber: { text: 'text-amber-400', bg: 'rgba(251,191,36,.07)', border: 'rgba(251,191,36,.18)' },
  red:   { text: 'text-[#f87171]', bg: 'rgba(221,51,51,.07)',  border: 'rgba(221,51,51,.2)' },
};

// ─── SISTEMA ─────────────────────────────────────────────────────────────────

const COMPONENTES = [
  {
    num: '01',
    nombre: 'CRM y base de datos de clientes',
    subtitulo: 'Contactos · campos · embudo de ventas',
    icon: Database,
    tint: 'gold',
    items: [
      'Base de datos central de contactos con historial de cada lead',
      'Hasta 10 campos personalizados: proyecto de interés, presupuesto, zona, origen del lead',
      '1 pipeline (embudo de ventas) con las etapas del proceso de Demiles Group',
      'Oportunidades en tarjetas, movibles entre etapas',
      'Panel de informes básico sobre actividad y estado del embudo',
    ],
  },
  {
    num: '02',
    nombre: 'ChatCenter para asesores',
    subtitulo: 'Bandeja única · tareas · control operativo',
    icon: Inbox,
    tint: 'teal',
    items: [
      'Bandeja unificada: WhatsApp, Instagram y Facebook en un solo panel',
      'Ingreso de los asesores de ventas con su propio usuario',
      'Asignación de conversaciones y tareas por asesor',
      'Notas internas y transferencia de conversaciones',
      'Visibilidad del trabajo del equipo: quién atiende, cuándo y en qué quedó',
    ],
  },
  {
    num: '03',
    nombre: 'Asistente de IA',
    subtitulo: 'Atiende · filtra · asigna al asesor',
    icon: Bot,
    tint: 'blue',
    items: [
      '1 asistente entrenado con hasta 5 proyectos de Demiles Group',
      'Gestiona la conversación inicial del interesado 24/7',
      'Filtra y perfila el lead antes de pasarlo a un humano',
      'Asigna al asesor que se encarga de cerrar la venta',
      'Entrega la conversación con el contexto completo',
    ],
  },
];

// ─── ALCANCE ─────────────────────────────────────────────────────────────────

const ALCANCE = [
  { valor: '10', label: 'Campos personalizados', sub: 'Información del cliente' },
  { valor: '1',  label: 'Pipeline', sub: 'Embudo de ventas' },
  { valor: '1',  label: 'Asistente IA', sub: 'Hasta 5 proyectos' },
  { valor: '1',  label: 'Panel de informes', sub: 'Alcance básico' },
];

// ─── PLAN DE TRABAJO ─────────────────────────────────────────────────────────

const FASES = [
  {
    num: '01',
    nombre: 'Levantamiento y diseño',
    duracion: 'Semana 1',
    icon: FileText,
    color: DG,
    colorAlpha: 'rgba(212,160,60,.12)',
    colorBorder: 'rgba(212,160,60,.3)',
    actividades: [
      'Kick-off con Ana Milena y el equipo comercial',
      'Definición de los 10 campos y de las etapas del pipeline',
      'Selección de los 5 proyectos que aprenderá el asistente IA',
      'Entrega de accesos: WhatsApp Business, Instagram y Facebook',
    ],
  },
  {
    num: '02',
    nombre: 'Configuración CRM y ChatCenter',
    duracion: 'Semanas 2–3',
    icon: Settings,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.3)',
    actividades: [
      'Creación de la cuenta, usuarios de los asesores y permisos',
      'Configuración de los campos personalizados y del pipeline',
      'Conexión de WhatsApp, Instagram y Facebook al ChatCenter',
      'Reglas de asignación de conversaciones entre asesores',
      'Panel de informes básico',
    ],
  },
  {
    num: '03',
    nombre: 'Asistente de IA',
    duracion: 'Semana 3',
    icon: Bot,
    color: '#60a5fa',
    colorAlpha: 'rgba(96,165,250,.10)',
    colorBorder: 'rgba(96,165,250,.3)',
    actividades: [
      'Entrenamiento del asistente con los 5 proyectos',
      'Flujo de conversación: bienvenida, filtrado y asignación al asesor',
      'Protocolo de entrega bot → asesor con el contexto de la conversación',
      'Testing y ajuste antes del lanzamiento',
    ],
  },
  {
    num: '04',
    nombre: 'Capacitación y go-live',
    duracion: 'Semana 4',
    icon: Rocket,
    color: '#f59e0b',
    colorAlpha: 'rgba(245,158,11,.10)',
    colorBorder: 'rgba(245,158,11,.3)',
    actividades: [
      'Capacitación a los asesores sobre el ChatCenter y el CRM',
      'Sesión con dirección sobre lectura de informes',
      'Acompañamiento durante los primeros días de operación real',
      'Entrega de la plataforma configurada',
    ],
  },
];

const SECCIONES = [
  { id: 'resumen',   label: 'Resumen' },
  { id: 'objetivo',  label: 'Objetivo' },
  { id: 'sistema',   label: 'Sistema' },
  { id: 'plan',      label: 'Plan' },
  { id: 'inversion', label: 'Inversión' },
  { id: 'vigencia',  label: 'Términos' },
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
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)' }} />
);

// Logo del cliente con respaldo tipográfico si el archivo aún no existe
const ClientLogo = ({ className = '', textSize = '18px' }: { className?: string; textSize?: string }) => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="font-poppins font-black tracking-tight leading-none text-center"
          style={{ color: DG, fontSize: textSize }}>
          DEMILES<br /><span className="text-white/50">GROUP</span>
        </span>
      </div>
    );
  }
  return (
    <img src="/demiles-logo.png" alt="Demiles Group"
      className={`object-contain ${className}`}
      onError={() => setFailed(true)} />
  );
};

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const DemilesGroupProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [faseActiva, setFaseActiva] = useState<number | null>(null);
  const [compActivo, setCompActivo] = useState<number | null>(null);
  const [showCostosVariables, setShowCostosVariables] = useState(false);
  const [showMetaTable, setShowMetaTable] = useState(false);
  const [showCalcIA, setShowCalcIA] = useState(false);
  const [mensajesConv, setMensajesConv] = useState(6);
  const [convsMes, setConvsMes] = useState(1200);

  const consumoIAUSD = (0.02 * mensajesConv * convsMes).toFixed(2);

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
            style={{ background: 'radial-gradient(circle, rgba(212,160,60,.07) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(29,112,162,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        </div>

        {/* Topbar */}
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
            <ClientLogo className="h-9 w-auto" textSize="13px" />
          </div>
          <span className="font-lato text-[#00bfa5]/80 text-[13px] uppercase tracking-[0.2em] border border-[#00bfa5]/20 rounded-full px-3 py-1.5">Confidencial</span>
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

        {/* Hero */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta de trabajo y cotización · {META.fecha}</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${DG}, #1d70a2)` }}>
                  <Settings className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: DG_BG, border: `1px solid ${DG_BORDER}`, color: DG }}>
                  {META.tagline}
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}>
                Propuesta<br />
                <span style={{ background: `linear-gradient(90deg,${DG},#00bfa5)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
                  { icon: Users,    text: '12 asesores' },
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
                  {['1. Resumen ejecutivo','2. Objetivo','3. Sistema propuesto','4. Plan de trabajo','5. Inversión','6. Vigencia y términos'].map((item, i) => (
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
                  style={{ background: `radial-gradient(circle, rgba(212,160,60,.12) 0%, rgba(29,112,162,.05) 50%, transparent 70%)` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full" style={{ border: `1px solid rgba(212,160,60,.14)` }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(29,112,162,.15)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: DG, boxShadow: `0 0 6px rgba(212,160,60,.8)` }} />
                </div>
              </div>
              <div className="cover-float relative z-10 flex flex-col items-center gap-6 w-full px-6">
                <div className="flex flex-col items-center gap-1">
                  <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-16 w-auto object-contain"
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
                  <div className="w-48 h-28 flex items-center justify-center p-3 rounded-xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)' }}>
                    <ClientLogo className="w-full h-full" textSize="26px" />
                  </div>
                  <div className="text-center">
                    <span className="font-poppins font-black text-white text-[24px] tracking-tight">{META.cliente}</span>
                    <p className="font-lato text-[13px] uppercase tracking-[0.18em] mt-1" style={{ color: DG }}>{META.tagline}</p>
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
          <TagLabel>01 — Resumen ejecutivo</TagLabel>
          <SectionTitle>Contexto y diagnóstico</SectionTitle>
          <Rule />

          {/* Ficha del cliente */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center"
            style={{ background: 'rgba(2,8,20,.85)', border: `1px solid ${DG_BORDER}` }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-28 h-20 flex items-center justify-center p-2 rounded-xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)' }}>
                <ClientLogo className="w-full h-full" textSize="15px" />
              </div>
              <span className="font-poppins font-black text-white text-[14px] tracking-tight">{META.cliente}</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Sector', value: 'Inmobiliaria' },
                { label: 'Contacto', value: META.contacto },
                { label: 'Equipo comercial', value: '12 asesores · 5 fijos que filtran' },
                { label: 'Volumen de leads', value: '50–60 diarios' },
                { label: 'Zonas', value: 'Cartagena norte · Santa Rosa · Barú · Barranquilla · Baranoa' },
                { label: 'Canales activos', value: 'WhatsApp · Instagram · Facebook' },
              ].map((f, i) => (
                <div key={i}>
                  <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">{f.label}</p>
                  <p className="font-lato text-white/65 text-[15px]">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              Demiles Group recibe entre <strong className="text-white/90 font-semibold">50 y 60 leads diarios</strong> y los atiende con 12 asesores, un chatbot de respuestas programadas y ninguna base de datos que centralice la información.
            </p>
            <p>
              Esta propuesta implementa la plataforma <strong className="text-white/90 font-semibold">CRM Sixteam.pro</strong>: base de datos de clientes, ChatCenter para los asesores y un asistente de IA que atiende la conversación inicial, filtra al interesado y lo asigna al asesor que cierra.
            </p>
          </div>

          {/* Hallazgos */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> 4 frenos identificados
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HALLAZGOS.map((h, i) => {
                const Icon = h.icon; const t = TINT[h.tint];
                return (
                  <div key={i} className="rounded-xl p-4 flex gap-3" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                    <Icon className={`w-4 h-4 ${t.text} flex-shrink-0 mt-0.5`} />
                    <div>
                      <p className="font-poppins font-semibold text-white/90 text-[16px] mb-1">{h.titulo}</p>
                      <p className="font-lato text-white/50 text-[14px] leading-relaxed">{h.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─ 02 OBJETIVO ─ */}
        <section id="objetivo" ref={s2.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>02 — Objetivo</TagLabel>
          <SectionTitle>¿Para qué estamos aquí?</SectionTitle>
          <Rule />
          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: `radial-gradient(circle, rgba(212,160,60,.08), transparent 70%)`, transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 text-[#00bfa5] mb-4" />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[22px] leading-relaxed">
              Que cada lead quede <strong className="text-white font-black">registrado, filtrado y asignado</strong> automáticamente al asesor correcto, y que la dirección de Demiles Group pueda ver en un solo lugar cómo trabaja su equipo comercial.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Componentes', value: '3', sub: 'CRM · ChatCenter · IA' },
              { label: 'Canales', value: '3', sub: 'WhatsApp · IG · FB' },
              { label: 'Asesores', value: '12', sub: 'Con usuario propio' },
              { label: 'Implementación', value: '4 sem', sub: '4 fases' },
            ].map((k, i) => (
              <div key={i} className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(29,112,162,.07)', border: '1px solid rgba(29,112,162,.2)' }}>
                <p className="font-poppins font-black text-white text-[28px] leading-none mb-1">{k.value}</p>
                <p className="font-poppins font-semibold text-white/70 text-[13px] mb-0.5">{k.label}</p>
                <p className="font-lato text-white/35 text-[12px]">{k.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─ 03 SISTEMA ─ */}
        <section id="sistema" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — Sistema propuesto</TagLabel>
          <SectionTitle>3 componentes · 1 plataforma</SectionTitle>
          <Rule />

          <div className="space-y-3 mb-8">
            {COMPONENTES.map((c, i) => {
              const Icon = c.icon;
              const t = TINT[c.tint];
              const open = compActivo === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${t.border}` : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setCompActivo(open ? null : i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? t.bg : 'rgba(255,255,255,.05)' }}>
                      <Icon className={`w-5 h-5 transition-colors ${open ? t.text : 'text-white/40'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`font-lato text-[12px] uppercase tracking-widest ${t.text}`} style={{ opacity: 0.9 }}>{c.num}</span>
                      <p className={`font-poppins font-bold text-[19px] mt-0.5 ${open ? 'text-white' : 'text-white/70'}`}>{c.nombre}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <p className="font-lato text-white/30 text-[12px] hidden sm:block">{c.subtitulo}</p>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-90' : ''} ${open ? t.text : 'text-white/30'}`} />
                    </div>
                  </button>

                  {open && (
                    <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <ul className="pt-4 space-y-2">
                        {c.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2.5">
                            <CheckCircle className={`w-3.5 h-3.5 ${t.text} flex-shrink-0 mt-1`} />
                            <span className="font-lato text-white/65 text-[15px] leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Alcance de esta implementación */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: DG_BG, border: `1px solid ${DG_BORDER}` }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-1 flex items-center gap-2">
              <Target className="w-4 h-4" style={{ color: DG }} /> Alcance de esta implementación
            </p>
            <p className="font-lato text-white/45 text-[15px] mb-5">
              Un alcance básico para arrancar. Todo lo que exceda estos límites se atiende después con el plan mensual.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ALCANCE.map((a, i) => (
                <div key={i} className="rounded-xl p-4 text-center"
                  style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                  <p className="font-poppins font-black text-[28px] leading-none mb-1" style={{ color: DG }}>{a.valor}</p>
                  <p className="font-poppins font-semibold text-white/75 text-[13px] leading-tight mb-0.5">{a.label}</p>
                  <p className="font-lato text-white/35 text-[12px]">{a.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─ 04 PLAN ─ */}
        <section id="plan" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Plan de trabajo</TagLabel>
          <SectionTitle>4 fases · 4 semanas</SectionTitle>
          <Rule />

          <div className="relative">
            <div className="hidden sm:block absolute left-[28px] top-10 bottom-10 w-px"
              style={{ background: `linear-gradient(to bottom, rgba(212,160,60,.4), rgba(0,191,165,.4), rgba(96,165,250,.4), rgba(245,158,11,.4))` }} />

            <div className="space-y-3">
              {FASES.map((fase, i) => {
                const Icon = fase.icon;
                const open = faseActiva === i;
                return (
                  <div key={i} className="rounded-xl overflow-hidden transition-all duration-300 sm:ml-12 relative"
                    style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${fase.colorBorder}` : '1px solid rgba(255,255,255,.07)' }}>

                    <div className="hidden sm:flex absolute -left-12 top-5 w-8 h-8 rounded-full items-center justify-center border-2 z-10"
                      style={{ background: '#030d1a', borderColor: fase.color }}>
                      <span className="font-poppins font-black text-[13px]" style={{ color: fase.color }}>{fase.num}</span>
                    </div>

                    <button onClick={() => setFaseActiva(open ? null : i)}
                      className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: open ? fase.colorAlpha : 'rgba(255,255,255,.05)' }}>
                        <Icon className="w-4 h-4 transition-colors" style={{ color: open ? fase.color : 'rgba(255,255,255,.35)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`font-poppins font-bold text-[18px] ${open ? 'text-white' : 'text-white/70'}`}>{fase.nombre}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: fase.colorAlpha, border: `1px solid ${fase.colorBorder}` }}>
                          <Clock className="w-3 h-3" style={{ color: fase.color }} />
                          <span className="font-poppins font-bold text-[13px]" style={{ color: fase.color }}>{fase.duracion}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`}
                          style={{ color: open ? fase.color : 'rgba(255,255,255,.3)' }} />
                      </div>
                    </button>

                    {open && (
                      <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                        <ul className="pt-4 space-y-2">
                          {fase.actividades.map((a, j) => (
                            <li key={j} className="flex items-start gap-2.5">
                              <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: fase.color }} />
                              <span className="font-lato text-white/65 text-[15px] leading-snug">{a}</span>
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
        </section>

        {/* ─ 05 INVERSIÓN ─ */}
        <section id="inversion" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Inversión</TagLabel>
          <SectionTitle>Un pago de implementación y un plan mensual</SectionTitle>
          <Rule />

          {/* Implementación */}
          <div className="rounded-2xl p-5 sm:p-6 mb-4" style={{ background: DG_BG, border: `1px solid ${DG_BORDER}` }}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(212,160,60,.15)', border: `1px solid ${DG_BORDER}` }}>
                <Settings className="w-5 h-5" style={{ color: DG }} />
              </div>
              <div className="flex-1">
                <p className="font-poppins font-bold text-white text-[18px]">Implementación de la plataforma</p>
                <p className="font-lato text-white/40 text-[14px] mt-0.5">CRM · ChatCenter · Asistente de IA · Pago único</p>
              </div>
              <p className="font-poppins font-black text-[1.9rem] leading-none" style={{ color: DG }}>
                COP {IMPLEMENTACION_COP}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                <p className="font-lato text-white/35 text-[12px] uppercase tracking-wider mb-1">Pago 1 · Para iniciar</p>
                <p className="font-poppins font-black text-white text-[1.15rem]">COP 1.000.000 <span className="font-lato font-normal text-white/40 text-[0.85rem]">· 50%</span></p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                <p className="font-lato text-white/35 text-[12px] uppercase tracking-wider mb-1">Pago 2 · Al entregar</p>
                <p className="font-poppins font-black text-white text-[1.15rem]">COP 1.000.000 <span className="font-lato font-normal text-white/40 text-[0.85rem]">· 50%</span></p>
              </div>
            </div>
          </div>

          {/* Plan Esencial */}
          <div className="rounded-2xl p-5 sm:p-6 mb-4" style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.22)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,191,165,.15)', border: '1px solid rgba(0,191,165,.3)' }}>
                <Headphones className="w-5 h-5 text-[#00bfa5]" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-poppins font-bold text-white text-[18px]">Plan Esencial · Sixteam Ops</p>
                  <span className="font-lato text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.25)', color: '#00bfa5' }}>
                    Mensual
                  </span>
                </div>
                <p className="font-lato text-white/40 text-[14px] mt-0.5">Uso de la plataforma + equipo de tecnología de Sixteam</p>
              </div>
              <div className="text-left sm:text-right flex-shrink-0">
                <p className="font-poppins font-black text-[1.5rem] leading-none text-[#00bfa5]">
                  desde COP {PLAN_MES_COP}<span className="font-lato font-normal text-white/35 text-[0.9rem]">/mes</span>
                </p>
                <p className="font-lato text-white/30 text-[12px] mt-1">+ costos variables según consumo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                <p className="font-lato text-white/35 text-[12px] uppercase tracking-wider mb-1">Plataforma</p>
                <p className="font-lato text-white/65 text-[14px]">CRM, ChatCenter y asistente IA activos para todo el equipo</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(0,191,165,.07)', border: '1px solid rgba(0,191,165,.2)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Coins className="w-3.5 h-3.5 text-[#00bfa5]" />
                  <p className="font-lato text-[12px] uppercase tracking-wider text-[#00bfa5]/80">Equipo de tecnología</p>
                </div>
                <p className="font-lato text-white/65 text-[14px]">{CREDITOS_MES} créditos ≈ hasta {SOLICITUDES_MES} solicitudes al mes</p>
              </div>
            </div>

            <ul className="space-y-1.5">
              {[
                'Soporte de la plataforma y del asistente de IA',
                'Solicitudes de marketing, ventas y servicio ejecutadas por el equipo de Sixteam',
                'Nuevas automatizaciones, informes, campos o flujos según lo que necesite el equipo',
                'Reentrenamiento del asistente cuando entren proyectos nuevos',
                'Oportunidades de mejora levantadas mes a mes para que la plataforma dé retorno',
                'Cada solicitud se cotiza en créditos antes de ejecutarse',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0 mt-1" />
                  <span className="font-lato text-white/55 text-[14px]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COSTOS ADICIONALES ── */}
          <div className="rounded-xl overflow-hidden transition-all duration-300 mb-4"
            style={{ background: 'rgba(255,255,255,.03)', border: showCostosVariables ? '1px solid rgba(96,165,250,.35)' : '1px solid rgba(255,255,255,.08)' }}>
            <button onClick={() => setShowCostosVariables(v => !v)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: showCostosVariables ? 'rgba(96,165,250,.15)' : 'rgba(255,255,255,.05)' }}>
                <Info className="w-4 h-4" style={{ color: showCostosVariables ? '#60a5fa' : 'rgba(255,255,255,.35)' }} />
              </div>
              <div className="flex-1">
                <p className={`font-poppins font-bold text-[16px] ${showCostosVariables ? 'text-white' : 'text-white/65'}`}>
                  Costos adicionales según consumo
                </p>
                <p className="font-lato text-white/35 text-[13px] mt-0.5">Plantillas de WhatsApp (Meta) · Consumo de IA</p>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                style={{ color: showCostosVariables ? '#60a5fa' : 'rgba(255,255,255,.3)', transform: showCostosVariables ? 'rotate(90deg)' : undefined }} />
            </button>

            {showCostosVariables && (
              <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                <div className="pt-4 space-y-5">

                  {/* ── Plantillas Meta ── */}
                  <div>
                    <p className="font-lato text-white/55 text-[15px] leading-relaxed mb-3">
                      <strong className="text-white/80">Plantillas de WhatsApp (Meta).</strong> Cada mensaje enviado fuera de la ventana de 24 horas —recordatorios, campañas, seguimientos— lo cobra Meta directamente.{' '}
                      <strong className="text-white/80">No es un cobro de Sixteam.pro.</strong>
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{ background: DG_BG, border: `1px solid ${DG_BORDER}` }}>
                        <span className="font-poppins font-semibold text-white/90 text-[13px]">🇨🇴 Colombia</span>
                        <span className="font-lato text-white/45 text-[12px]">Marketing</span>
                        <span className="font-poppins font-bold text-[13px]" style={{ color: DG }}>USD 0.0131</span>
                        <span className="font-lato text-white/30 text-[11px]">|</span>
                        <span className="font-lato text-white/45 text-[12px]">Utility</span>
                        <span className="font-poppins font-bold text-[13px]" style={{ color: DG }}>USD 0.0008</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                        <span className="font-lato text-white/40 text-[12px]">Service (entrante)</span>
                        <span className="font-poppins font-bold text-[#00bfa5] text-[13px]">GRATIS</span>
                      </div>
                    </div>

                    <button onClick={() => setShowMetaTable(v => !v)}
                      className="flex items-center gap-1.5 mb-2 transition-colors duration-200"
                      style={{ color: showMetaTable ? '#60a5fa' : 'rgba(255,255,255,.3)' }}>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${showMetaTable ? 'rotate-90' : ''}`} />
                      <span className="font-lato text-[13px]">{showMetaTable ? 'Ocultar' : 'Ver'} tarifas por país — fuente Meta</span>
                    </button>

                    {showMetaTable && (
                      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(96,165,250,.2)' }}>
                        <div className="grid grid-cols-4 px-3 py-2 text-[11px] font-poppins font-semibold uppercase tracking-wider text-white/30"
                          style={{ background: 'rgba(96,165,250,.06)', borderBottom: '1px solid rgba(96,165,250,.15)' }}>
                          <span>País / Mercado</span>
                          <span className="text-right">Marketing</span>
                          <span className="text-right">Utility</span>
                          <span className="text-right">Service</span>
                        </div>
                        <div className="divide-y max-h-72 overflow-y-auto" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
                          {[
                            ['🇨🇴 Colombia','0.0131','0.0008'],['🇲🇽 Mexico','0.0320','0.0089'],['🇵🇪 Peru','0.0738','0.0210'],
                            ['🇨🇱 Chile','0.0933','0.0210'],['🇦🇷 Argentina','0.0649','0.0273'],['🇧🇷 Brazil','0.0656','0.0071'],
                            ['🇪🇸 Spain','0.0646','0.0210'],['🇺🇸 North America','0.0263','0.0036'],['🇬🇧 United Kingdom','0.0555','0.0231'],
                            ['🇫🇷 France','0.0902','0.0315'],['🇩🇪 Germany','0.1433','0.0578'],['🇮🇹 Italy','0.0726','0.0315'],
                            ['🇳🇱 Netherlands','0.1677','0.0525'],['🇮🇳 India','0.0124','0.0015'],['🇮🇩 Indonesia','0.0432','0.0263'],
                            ['🇹🇷 Turkey','0.0114','0.0056'],['🇷🇺 Russia','0.0842','0.0420'],['🇸🇦 Saudi Arabia','0.0478','0.0112'],
                            ['🇦🇪 United Arab Emirates','0.0524','0.0165'],['🇿🇦 South Africa','0.0398','0.0080'],['🇳🇬 Nigeria','0.0542','0.0070'],
                            ['🌎 Rest of Latin America','0.0777','0.0119'],['🌏 Rest of Asia Pacific','0.0769','0.0119'],
                            ['🌍 Rest of Western Europe','0.0622','0.0180'],['🌍 Rest of C. & E. Europe','0.0903','0.0223'],
                            ['🌍 Rest of Middle East','0.0358','0.0096'],['🌍 Rest of Africa','0.0236','0.0042'],['🌐 Other','0.0634','0.0081'],
                          ].map(([market, marketing, utility], i) => {
                            const isCO = market.includes('Colombia');
                            return (
                              <div key={i} className="grid grid-cols-4 px-3 py-2 items-center"
                                style={{ background: isCO ? DG_BG : i % 2 === 0 ? 'rgba(255,255,255,.015)' : 'transparent' }}>
                                <span className={`font-lato text-[13px] ${isCO ? 'text-white/90 font-semibold' : 'text-white/60'}`}>{market}</span>
                                <span className="font-poppins font-semibold text-[13px] text-right"
                                  style={{ color: isCO ? DG : 'rgba(255,255,255,.55)' }}>{marketing}</span>
                                <span className="font-poppins font-semibold text-[13px] text-right"
                                  style={{ color: isCO ? DG : 'rgba(255,255,255,.55)' }}>{utility}</span>
                                <span className="font-poppins font-bold text-[12px] text-right text-[#00bfa5]">FREE</span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="px-3 py-2 text-[11px] font-lato text-white/25 text-center"
                          style={{ borderTop: '1px solid rgba(96,165,250,.1)', background: 'rgba(96,165,250,.03)' }}>
                          Fuente: Meta for Developers — WhatsApp Business Platform Pricing · Valores en USD por número destinatario
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Consumo IA ── */}
                  <div>
                    <p className="font-lato text-white/55 text-[15px] leading-relaxed mb-3">
                      <strong className="text-white/80">Consumo de IA.</strong> Se cobra por mensaje procesado por el asistente y se factura mes vencido sobre el consumo real.
                    </p>

                    <div className="rounded-xl overflow-hidden transition-all duration-300"
                      style={{ border: showCalcIA ? `1px solid ${DG_BORDER}` : '1px solid rgba(255,255,255,.07)' }}>
                      <button onClick={() => setShowCalcIA(v => !v)}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-left"
                        style={{ background: showCalcIA ? DG_BG : 'transparent' }}>
                        <Bot className="w-3.5 h-3.5 flex-shrink-0" style={{ color: DG }} />
                        <span className="font-lato text-[14px] flex-1" style={{ color: showCalcIA ? DG : 'rgba(255,255,255,.5)' }}>
                          Calculadora de consumo de IA
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 flex-shrink-0"
                          style={{ color: DG, transform: showCalcIA ? 'rotate(90deg)' : undefined }} />
                      </button>

                      {showCalcIA && (
                        <div className="px-4 pb-4 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                          <div className="pt-3 space-y-3">
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                              style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: DG }} />
                              <span className="font-lato text-white/50 text-[13px]">Valor IA por mensaje</span>
                              <span className="font-poppins font-black ml-auto text-[13px]" style={{ color: DG }}>USD 0.02</span>
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="font-lato text-white/35 text-[12px]">Mensajes promedio por conversación</span>
                                <span className="font-poppins font-bold text-white text-[13px]">{mensajesConv}</span>
                              </div>
                              <input type="range" min={2} max={20} step={1}
                                value={mensajesConv} onChange={e => setMensajesConv(Number(e.target.value))} className="w-full" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="font-lato text-white/35 text-[12px]">Conversaciones nuevas por mes</span>
                                <span className="font-poppins font-bold text-white text-[13px]">{convsMes}</span>
                              </div>
                              <input type="range" min={100} max={2500} step={50}
                                value={convsMes} onChange={e => setConvsMes(Number(e.target.value))} className="w-full" />
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: DG_BORDER }}>
                              <div>
                                <span className="font-lato text-white/40 text-[12px]">Consumo estimado</span>
                                <p className="font-lato text-white/25 text-[11px] mt-0.5">USD 0.02 × {mensajesConv} msg × {convsMes} conv</p>
                              </div>
                              <span className="font-poppins font-bold text-[15px]" style={{ color: DG }}>≈ USD {consumoIAUSD}/mes</span>
                            </div>
                            <p className="font-lato text-white/25 text-[11px] leading-relaxed">
                              Estimación referencial. Con 50–60 leads diarios, el rango típico está entre 1.200 y 1.800 conversaciones al mes si el asistente atiende todos los canales. Se factura en COP a la TRM del día.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* Resumen */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
            <p className="font-lato text-white/35 text-[13px] uppercase tracking-widest mb-4">Resumen de inversión</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl p-4" style={{ background: DG_BG, border: `1px solid ${DG_BORDER}` }}>
                <p className="font-lato text-[12px] uppercase tracking-wider mb-1" style={{ color: DG }}>Pago único</p>
                <p className="font-poppins font-black text-white text-[1.2rem]">COP {IMPLEMENTACION_COP}</p>
                <p className="font-lato text-white/35 text-[12px] mt-0.5">50% para iniciar · 50% al entregar</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(0,191,165,.07)', border: '1px solid rgba(0,191,165,.2)' }}>
                <p className="font-lato text-[12px] uppercase tracking-wider mb-1 text-[#00bfa5]/80">Mensual</p>
                <p className="font-poppins font-black text-white text-[1.2rem]">desde COP {PLAN_MES_COP}<span className="font-lato font-normal text-white/35 text-[0.85rem]">/mes</span></p>
                <p className="font-lato text-white/35 text-[12px] mt-0.5">Plan Esencial + costos variables</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── LOGOS ── */}
        <div className="mt-16">
          <LogoCarousel />
        </div>

        {/* ─ 06 VIGENCIA ─ */}
        <section id="vigencia" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 — Vigencia y términos</TagLabel>
          <SectionTitle>Términos de la propuesta</SectionTitle>
          <Rule />

          <div className="space-y-3">
            {[
              { titulo: 'Aprobación', desc: 'Se acepta por WhatsApp, correo o verbalmente. Con eso se habilita el contrato y se agenda el inicio.', icon: CheckCircle },
              { titulo: 'Términos de pago', desc: `Implementación: COP ${IMPLEMENTACION_COP}, 50% para iniciar y 50% al entregar la plataforma configurada. El Plan Esencial se factura por mes anticipado desde la entrega.`, icon: FileText },
              { titulo: 'Alcance de la implementación', desc: 'Incluye hasta 10 campos personalizados, 1 pipeline, 1 asistente de IA con conocimiento de hasta 5 proyectos y un panel de informes básico. Lo que exceda este alcance se atiende con los créditos del plan mensual.', icon: Target },
              { titulo: 'Créditos del plan', desc: `El Plan Esencial incluye ${CREDITOS_MES} créditos por mes, equivalentes en promedio a ${SOLICITUDES_MES} solicitudes. No son acumulables. Cada solicitud se cotiza antes de ejecutarse.`, icon: Coins },
              { titulo: 'Números de WhatsApp y usuarios', desc: 'El plan contempla 1 número de WhatsApp Business conectado. Números adicionales o ampliaciones de usuarios se cotizan aparte según la necesidad del equipo.', icon: Users },
              { titulo: 'Consumo de IA', desc: 'USD 0,02 por mensaje procesado por el asistente, facturado mes vencido sobre el consumo real. La calculadora de esta propuesta es una estimación referencial.', icon: Bot },
              { titulo: 'Plantillas de WhatsApp', desc: 'Los mensajes enviados fuera de la ventana de 24 horas los cobra Meta directamente y se trasladan sin margen adicional.', icon: MessageSquare },
              { titulo: 'Cambios al alcance', desc: 'Cualquier servicio, integración o funcionalidad no incluida en esta propuesta requiere cotización adicional y puede afectar los tiempos de entrega.', icon: AlertCircle },
              { titulo: 'Inicio del proyecto', desc: 'El cronograma arranca con el pago inicial y la entrega de accesos e información por parte de Demiles Group.', icon: Zap },
              { titulo: 'Vigencia', desc: `30 días calendario desde ${META.fecha}. Pasado ese plazo los valores pueden revisarse.`, icon: Clock },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="rounded-xl p-4 sm:p-5 flex gap-4"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <Icon className="w-4 h-4 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-poppins font-semibold text-white/80 text-[16px] mb-1">{item.titulo}</p>
                    <p className="font-lato text-white/50 text-[16px] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-12 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 100%, rgba(212,160,60,.06), transparent 70%)` }} />
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

export default DemilesGroupProposal;
