import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, ChevronRight, FileText, Target, Zap,
  MessageSquare, AlertCircle, Mail, ArrowRight, Building2,
  Calendar, Hash, User, Info, Globe, MapPin,
  Users, BarChart3, TrendingUp, Layers, Settings,
  BookOpen, MousePointer, RefreshCw, Database,
} from 'lucide-react';
import LogoCarousel from '../components/LogoCarousel';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Procurement Pro',
  contacto: 'Anwar Tapias',
  tagline: 'Expertos en Compras Corporativas B2B',
  sector: 'Consultoría · Formación corporativa · Mentoría',
  sede: 'Colombia',
  fecha: 'Mayo 2026',
  lugar: 'Barranquilla, Colombia',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  objetivo: 'CRM, automatización comercial y pauta en Meta Ads para escalar el negocio B2B',
};

const ACCENT = '#4f46e5';
const ACCENT_ALPHA = (a: number) => `rgba(79,70,229,${a})`;

// ─── DIAGNÓSTICO ─────────────────────────────────────────────────────────────

const DIAGNOSTICO = [
  {
    titulo: 'Sin CRM · información dispersa',
    desc: 'Los datos de clientes y prospectos viven en carpetas de OneDrive. Sin un sistema centralizado, no hay trazabilidad del ciclo de venta, historial de interacciones ni visibilidad del estado de cada oportunidad.',
    icon: Database,
    tint: 'red',
  },
  {
    titulo: 'Pauta sin estrategia ni medición',
    desc: 'La inversión en Meta Ads (Instagram y Facebook) se hace sin estructura definida ni seguimiento de resultados. Sin segmentación B2B clara ni optimización continua, el presupuesto no genera leads calificados que entren al pipeline comercial.',
    icon: TrendingUp,
    tint: 'amber',
  },
  {
    titulo: 'Procesos manuales que limitan la escala',
    desc: 'Toda la gestión comercial — seguimiento de leads, envío de propuestas, recordatorios — se hace manualmente. Con 5 oportunidades mensuales de alto valor, cada hora no automatizada es una hora que no se invierte en cerrar negocios.',
    icon: Settings,
    tint: 'blue',
  },
  {
    titulo: 'Ciclo largo sin pipeline visible',
    desc: 'Una consultoría cerrada en marzo puede haber iniciado en diciembre. Sin un pipeline que refleje dónde está cada prospecto, es imposible priorizar, hacer seguimiento oportuno y proyectar ingresos.',
    icon: Layers,
    tint: 'teal',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber: { text: 'text-amber-400',  bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)' },
  teal:  { text: 'text-[#00bfa5]',  bg: 'rgba(0,191,165,.07)',   border: 'rgba(0,191,165,.18)' },
  blue:  { text: 'text-[#60a5fa]',  bg: 'rgba(96,165,250,.07)',  border: 'rgba(96,165,250,.18)' },
  red:   { text: 'text-[#f87171]',  bg: 'rgba(221,51,51,.07)',   border: 'rgba(221,51,51,.2)' },
};

// ─── SERVICIOS ───────────────────────────────────────────────────────────────

const SERVICIOS = [
  {
    num: 'Servicio 1',
    nombre: 'Implementación del flujo comercial completo',
    tipo: 'Pago único',
    valor: 'COP 2.000.000',
    nota: 'Sin IVA',
    icon: Layers,
    destacado: true,
    entregables: [
      'Pipeline de ventas configurado con etapas del ciclo B2B de Procurement Pro',
      'Landing page de captación de leads corporativos',
      'Formularios de contacto y captación integrados al CRM',
      'Propiedades personalizadas para el perfil de lead corporativo (empresa, cargo, tipo de necesidad, etc.)',
      'Automatizaciones básicas de seguimiento (recordatorios, tareas, cambios de etapa)',
      'Gestión centralizada de contactos y empresas',
      'Capacitación funcional (hasta 4 horas) sobre uso del CRM y el flujo',
    ],
    detalle: [
      'Levantamiento del proceso comercial actual de Procurement Pro: desde el primer contacto hasta el cierre de una consultoría o formación.',
      'Configuración del pipeline con etapas alineadas al ciclo real de venta: Prospecto → Contacto inicial → Propuesta enviada → Negociación → Cierre.',
      'Construcción de la landing page de captación con formulario integrado al CRM — para que cada lead que llegue quede registrado automáticamente sin intervención manual.',
      'Creación de propiedades personalizadas que permitan segmentar y priorizar leads por sector, tamaño de empresa, tipo de servicio de interés y etapa en su proceso de compras.',
      'Configuración de automatizaciones básicas: asignación automática de tareas, recordatorios de seguimiento y notificaciones cuando un lead avanza o se estanca.',
      'Sesión de capacitación con Anwar Tapias: navegación del CRM, gestión de oportunidades, uso del pipeline y consulta de reportes básicos.',
    ],
  },
  {
    num: 'Servicio 2',
    nombre: 'Gestión de pauta — Meta Ads',
    tipo: 'Pago mensual',
    valor: 'COP 500.000',
    nota: 'Sin IVA · hasta USD 300 de presupuesto en pauta',
    icon: MousePointer,
    destacado: false,
    entregables: [
      'Gestión estratégica de pauta en Meta Ads — Facebook e Instagram (hasta 3 productos o servicios)',
      'Configuración y optimización de campañas orientadas al segmento corporativo B2B',
      'Seguimiento y ajuste semanal de rendimiento',
      'Reporte mensual de resultados (impresiones, clics, leads generados, CPL)',
      'Coordinación con el flujo del CRM para que leads de pauta entren directamente al pipeline',
    ],
    detalle: [
      'Definición de la estrategia de pauta según los servicios a promocionar: consultoría corporativa, formación in-house o cursos abiertos (máximo 3 productos simultáneos).',
      'Configuración de campañas en Meta Ads (Facebook e Instagram) con segmentación B2B: cargo, industria, tamaño de empresa y comportamientos afines al área de compras.',
      'Optimización continua de pujas, creativos y segmentación para maximizar el retorno sobre el presupuesto invertido.',
      'Si el presupuesto mensual en pauta supera los USD 300, la tarifa de gestión se renegocia de común acuerdo antes de ejecutar el incremento.',
      'Integración del pixel / tracking con la landing page para que cada lead generado por pauta entre automáticamente al CRM.',
    ],
  },
  {
    num: 'Servicio 3',
    nombre: 'Plan CRM Growth — Licencia plataforma completa',
    tipo: 'Pago mensual',
    valor: 'COP 1.300.000',
    nota: 'Sin IVA · acceso full a la plataforma',
    icon: BookOpen,
    destacado: false,
    entregables: [
      'Acceso completo a la plataforma CRM Sixteam.pro (Plan Growth)',
      'Módulo de Landing Pages y Websites',
      'Módulo de Formularios',
      'Módulo de Cursos (para los productos de formación de Procurement Pro)',
      'CRM de contactos, empresas y oportunidades',
      'Automatizaciones y workflows',
      'Reportería y dashboards',
    ],
    detalle: [
      'Licencia mensual del Plan CRM Growth que da acceso completo a todos los módulos de la plataforma.',
      'Incluye los módulos de Landing Pages, Formularios, Websites, Cursos, CRM, Automatizaciones y Reportería.',
      'La implementación cubre lo definido en el Servicio 1 (flujo comercial). Módulos adicionales disponibles en la licencia pueden ser activados por el cliente de forma autónoma o cotizarse como implementación adicional.',
      'El acceso a la plataforma de cursos permite a Anwar Tapias centralizar sus cursos grabados directamente en el ecosistema, sin depender de la plataforma externa actual construida en Lovable.',
    ],
  },
];

const SECCIONES = [
  { id: 'resumen',  label: 'Resumen' },
  { id: 'objetivo', label: 'Objetivo' },
  { id: 'plan',     label: 'Servicios' },
  { id: 'vigencia', label: 'Vigencia' },
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

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const ProcurementProProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [servicioActivo, setServicioActivo] = useState<number | null>(null);

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
  const s3 = useVisible(); const s4 = useVisible();

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

      {/* ══════════════════════════════════════ PORTADA */}
      <header className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #04111f 0%, #071826 55%, #091f34 100%)' }}>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
            style={{ background: `radial-gradient(circle, ${ACCENT_ALPHA(0.06)} 0%, transparent 65%)` }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(29,112,162,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        </div>

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-b" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-white">
              <img src="/sixteam-logo.png" alt="Sixteam.pro" className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <div>
              <span className="font-poppins font-black text-white text-xl tracking-tight">Sixteam<span className="text-[#00bfa5]">.</span>pro</span>
              <p className="font-lato text-white/35 text-[13px] leading-none mt-0.5">Innovación y Estrategia Digital</p>
            </div>
          </div>
          <span className="font-lato text-[#00bfa5]/80 text-[13px] uppercase tracking-[0.2em] border border-[#00bfa5]/20 rounded-full px-3 py-1.5">
            Confidencial
          </span>
        </div>

        <style>{`
          @keyframes cover-spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes cover-spin-rev  { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
          @keyframes cover-pulse-glow { 0%,100%{opacity:.07;transform:scale(1)} 50%{opacity:.14;transform:scale(1.1)} }
          @keyframes cover-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
          .cover-ring-1{animation:cover-spin-slow 24s linear infinite}
          .cover-ring-2{animation:cover-spin-rev 18s linear infinite}
          .cover-glow{animation:cover-pulse-glow 4s ease-in-out infinite}
          .cover-float{animation:cover-float 5s ease-in-out infinite}
        `}</style>

        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            {/* Izquierda */}
            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta de trabajo y cotización</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, #3730a3)` }}>
                  <BarChart3 className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: ACCENT_ALPHA(0.10), border: `1px solid ${ACCENT_ALPHA(0.25)}`, color: '#a5b4fc' }}>
                  B2B · Compras Corporativas
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}>
                Propuesta<br />
                <span style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Comercial
                </span>
              </h1>
              <p className="font-lato text-white/55 text-xl leading-relaxed mb-5">
                {META.objetivo}
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
                  { icon: Globe,    text: META.sector },
                  { icon: Hash,     text: `NIT ${META.nit}` },
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
                  {['1. Resumen ejecutivo', '2. Objetivo general', '3. Servicios y cotización', '4. Vigencia y términos'].map((item, i) => (
                    <button key={i} onClick={() => scrollTo(SECCIONES[i]?.id)}
                      className="font-lato text-white/45 text-[15px] hover:text-[#00bfa5] transition-colors duration-200 text-left flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#00bfa5]/40 flex-shrink-0" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Derecha: animación */}
            <div className="flex items-center justify-center relative min-h-[380px]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="cover-glow absolute w-80 h-80 rounded-full"
                  style={{ background: `radial-gradient(circle, ${ACCENT_ALPHA(0.10)} 0%, rgba(29,112,162,.04) 50%, transparent 70%)` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full"
                  style={{ border: `1px solid ${ACCENT_ALPHA(0.12)}` }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full"
                  style={{ border: '1px dashed rgba(29,112,162,.15)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: ACCENT, boxShadow: `0 0 6px ${ACCENT_ALPHA(0.9)}` }} />
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
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${ACCENT_ALPHA(0.20)}, ${ACCENT_ALPHA(0.08)})`, border: `1px solid ${ACCENT_ALPHA(0.30)}`, boxShadow: `0 4px 30px ${ACCENT_ALPHA(0.18)}` }}>
                    <BarChart3 className="w-12 h-12" style={{ color: '#a5b4fc' }} />
                  </div>
                  <div className="text-center">
                    <span className="font-poppins font-black text-white/80 text-[20px] tracking-tight">Procurement Pro</span>
                    <p className="font-poppins font-black text-white/30 text-[11px] uppercase tracking-[0.15em] mt-0.5">Compras · Consultoría · Formación</p>
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

      {/* SOCIAL PROOF */}
      <div className="w-full relative z-20 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <LogoCarousel />
      </div>

      {/* ══════════════════════════════════════ CONTENIDO */}
      <main className="max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-20 space-y-24">

        {/* ─ 01 RESUMEN ─ */}
        <section id="resumen" ref={s1.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s1.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>01 — Resumen ejecutivo</TagLabel>
          <SectionTitle>Contexto y diagnóstico</SectionTitle>
          <Rule />

          {/* Ficha cliente */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, #3730a3)`, boxShadow: `0 4px 20px ${ACCENT_ALPHA(0.28)}` }}>
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <span className="font-poppins font-black text-white text-[14px] tracking-tight text-center">Procurement Pro</span>
              <span className="font-lato text-[11px] uppercase tracking-[0.18em] text-center" style={{ color: '#a5b4fc' }}>Anwar Tapias</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">{META.sector}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Mercado objetivo</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">Empresas B2B · Equipos de compras</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Canal principal</p>
                <p className="font-lato text-white/60 text-[16px]">LinkedIn · Referenciación · Contenido orgánico</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Stack actual</p>
                <p className="font-lato text-white/60 text-[16px]">OneDrive · Lovable (cursos) · Sin CRM</p>
              </div>
            </div>
          </div>

          {/* Narrativa */}
          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>Procurement Pro es un negocio especializado en consultoría, formación corporativa y mentoría en el área de compras B2B. Su fundador, Anwar Tapias, tiene un posicionamiento orgánico sólido en LinkedIn y clientes de referencia como el Grupo Familia — lo que demuestra que el problema no es el producto ni el conocimiento: <strong className="text-white/90 font-semibold">el problema es la infraestructura operativa que soporta el crecimiento.</strong></p>
            <p>Con un ciclo de venta de 2 a 4 meses, unas 5 oportunidades reales mensuales y una base de más de 600 estudiantes registrados en su plataforma de cursos, el negocio tiene tracción real. Pero hoy opera con información en carpetas de OneDrive, pauta sin estrategia y cero automatización — lo que significa que <strong className="text-white/90 font-semibold">cada hora de Anwar se va en gestión operativa en vez de en cerrar y entregar.</strong></p>
            <p>La solución que propone Sixteam.pro no es solo un CRM: es <strong className="text-white/90 font-semibold">un flujo comercial completo que centraliza, automatiza y hace visible todo el proceso de captación y seguimiento</strong>, para que Anwar pueda enfocarse en lo que realmente hace crecer el negocio.</p>
          </div>

          {/* Diagnóstico */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> Situación actual identificada
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DIAGNOSTICO.map((h, i) => {
                const Icon = h.icon; const t = TINT[h.tint];
                return (
                  <div key={i} className="rounded-xl p-4 flex gap-3"
                    style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                    <Icon className={`w-4 h-4 ${t.text} flex-shrink-0 mt-0.5`} />
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

        {/* ─ 02 OBJETIVO ─ */}
        <section id="objetivo" ref={s2.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>02 — Objetivo general</TagLabel>
          <SectionTitle>¿Para qué estamos aquí?</SectionTitle>
          <Rule />
          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${ACCENT_ALPHA(0.06)}, transparent 70%)`, transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 text-[#00bfa5] mb-4" />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[23px] leading-relaxed">
              Implementar la infraestructura tecnológica y comercial que Procurement Pro necesita para escalar: un flujo completo de captación y gestión de leads corporativos en CRM, pauta estratégica en Meta Ads orientada al segmento B2B, y acceso a una plataforma centralizada que unifique CRM, landing pages, formularios y cursos — liberando a Anwar Tapias de la carga operativa para que invierta su tiempo en consultar, formar y crecer.
            </p>
          </div>

          {/* KPIs esperados */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: Database,     title: 'Visibilidad total del pipeline', desc: 'Cada oportunidad registrada con su etapa, historial y próxima acción.' },
              { icon: RefreshCw,    title: 'Seguimiento automatizado',       desc: 'Sin recordatorios manuales — el sistema avisa cuándo actuar y cómo.' },
              { icon: TrendingUp,   title: 'Pauta con propósito',            desc: 'Cada peso en pauta conectado a un lead que entra al pipeline automáticamente.' },
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="rounded-xl p-4 flex flex-col gap-2"
                  style={{ background: ACCENT_ALPHA(0.05), border: `1px solid ${ACCENT_ALPHA(0.16)}` }}>
                  <Icon className="w-5 h-5" style={{ color: '#a5b4fc' }} />
                  <p className="font-poppins font-bold text-white/80 text-[16px]">{v.title}</p>
                  <p className="font-lato text-white/45 text-[14px] leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─ 03 SERVICIOS Y COTIZACIÓN ─ */}
        <section id="plan" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — Servicios y cotización</TagLabel>
          <SectionTitle>3 componentes · implementación + operación</SectionTitle>
          <Rule />

          <div className="space-y-2.5 mb-12">
            {SERVICIOS.map((s, i) => {
              const Icon = s.icon; const open = servicioActivo === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? '1px solid rgba(0,191,165,.3)' : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setServicioActivo(open ? null : i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? 'rgba(0,191,165,.15)' : 'rgba(255,255,255,.05)' }}>
                      <Icon className={`w-4 h-4 transition-colors ${open ? 'text-[#00bfa5]' : 'text-white/35'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`font-poppins font-bold text-[18px] ${open ? 'text-white' : 'text-white/70'}`}>{s.num}</span>
                        {s.destacado && (
                          <span className="px-2 py-0.5 rounded-full font-lato font-bold text-[11px] uppercase tracking-wider text-[#030d1a]"
                            style={{ background: '#00bfa5' }}>★ Inicio recomendado</span>
                        )}
                      </div>
                      <p className={`font-lato text-[18px] mt-0.5 ${open ? 'text-white/80' : 'text-white/40'}`}>{s.nombre}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <div className="text-right hidden sm:block">
                        <p className={`font-poppins font-bold text-[18px] ${s.destacado ? 'text-[#00bfa5]' : 'text-white/60'}`}>{s.valor}</p>
                        <p className="font-lato text-white/30 text-[13px] mt-0.5">{s.tipo}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-[#00bfa5]/60 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`} />
                    </div>
                  </button>
                  {open && (
                    <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Entregables</p>
                          <ul className="space-y-2">
                            {s.entregables.map((e, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                                <span className="font-lato text-white/65 text-[18px]">{e}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Actividades</p>
                          <ul className="space-y-2.5">
                            {s.detalle.map((d, j) => (
                              <li key={j} className="font-lato text-white/50 text-[18px] leading-snug pl-3 border-l border-[#1d70a2]/30">{d}</li>
                            ))}
                          </ul>
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                            <p className="font-lato text-white/30 text-[15px]">Forma de pago: <span className="text-white/55">{s.tipo}</span></p>
                            {s.nota && <p className="font-lato text-white/25 text-[13px] mt-0.5">{s.nota}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── COTIZACIÓN ── */}
          <div className="border-t pt-10" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
            <p className="font-lato text-white/25 text-[13px] uppercase tracking-widest mb-1">Cotización</p>
            <h3 className="font-poppins font-extrabold text-white text-[28px] mb-2 leading-tight">Inversión</h3>
            <div className="w-8 h-0.5 mb-6 mt-1" style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)' }} />
            <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-6">
              Todos los valores en <strong className="text-white/75">pesos colombianos (COP)</strong> y <strong className="text-white/75">sin IVA</strong>.
            </p>

            {/* Filas de servicios */}
            <div className="space-y-3 mb-8">
              {SERVICIOS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0"
                    style={{ background: s.destacado ? 'rgba(0,191,165,.05)' : 'rgba(255,255,255,.03)', border: s.destacado ? '1px solid rgba(0,191,165,.2)' : '1px solid rgba(255,255,255,.06)' }}>
                    <div className="flex items-center gap-3 sm:w-2/5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: s.destacado ? 'rgba(0,191,165,.18)' : 'rgba(255,255,255,.05)' }}>
                        <Icon className={`w-4 h-4 ${s.destacado ? 'text-[#00bfa5]' : 'text-white/30'}`} />
                      </div>
                      <div>
                        <span className="font-poppins font-bold text-white/80 text-[18px]">{s.num}</span>
                        <p className="font-lato text-white/45 text-[15px] mt-0.5">{s.tipo}</p>
                      </div>
                    </div>
                    <div className="sm:w-1/4">
                      <p className={`font-poppins font-black text-[23px] ${s.destacado ? 'text-[#00bfa5]' : 'text-white/75'}`}>{s.valor}</p>
                      {s.nota && <p className="font-lato text-white/30 text-[12px] mt-0.5">{s.nota}</p>}
                    </div>
                    <div className="sm:w-1/3">
                      <p className="font-lato text-white/35 text-[15px]">{s.nombre}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Nota pauta */}
            <div className="rounded-xl p-4 sm:p-5 mb-6 flex gap-3"
              style={{ background: 'rgba(96,165,250,.05)', border: '1px solid rgba(96,165,250,.18)' }}>
              <AlertCircle className="w-4 h-4 text-[#60a5fa] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-poppins font-semibold text-white/75 text-[15px] mb-1">Sobre el presupuesto de pauta</p>
                <p className="font-lato text-white/50 text-[15px] leading-relaxed">
                  El presupuesto máximo en pauta es de <strong className="text-white/70">USD 300/mes</strong>. Si el cliente desea incrementarlo, la tarifa de gestión (COP 500.000) se renegocia antes de ejecutar el cambio. La pauta cubre máximo <strong className="text-white/70">3 productos o servicios simultáneos</strong>. El presupuesto de pauta es asumido directamente por el cliente y no está incluido en la tarifa de gestión.
                </p>
              </div>
            </div>

            {/* Resumen */}
            <div className="rounded-2xl p-5 sm:p-7"
              style={{ background: ACCENT_ALPHA(0.04), border: `1px solid ${ACCENT_ALPHA(0.20)}` }}>
              <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-5 flex items-center gap-2">
                <Zap className="w-4 h-4" style={{ color: '#a5b4fc' }} /> Resumen de inversión
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-lato text-white/60 text-[18px]">Implementación flujo completo (único)</span>
                  <span className="font-poppins font-bold text-white/80 text-[18px]">COP 2.000.000</span>
                </div>
                <div className="border-t pt-3 mt-1" style={{ borderColor: 'rgba(255,255,255,.07)' }}>
                  <p className="font-lato text-white/30 text-[13px] uppercase tracking-widest mb-3">Recurrente mensual</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-lato text-white/60 text-[18px]">Gestión de pauta Meta Ads</span>
                      <span className="font-poppins font-semibold text-white/70 text-[18px]">COP 500.000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-lato text-white/60 text-[18px]">Plan CRM Growth</span>
                      <span className="font-poppins font-semibold text-white/70 text-[18px]">COP 1.300.000</span>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4 mt-2" style={{ borderColor: 'rgba(255,255,255,.10)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-poppins font-bold text-white/85 text-[20px]">Total recurrente mensual</span>
                      <p className="font-lato text-white/30 text-[13px] mt-0.5">Sin IVA · Pauta aparte según consumo</p>
                    </div>
                    <span className="font-poppins font-black text-[28px]" style={{ color: '#a5b4fc' }}>COP 1.800.000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─ 04 VIGENCIA ─ */}
        <section id="vigencia" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y Términos de la Propuesta</SectionTitle>
          <Rule />

          <div className="space-y-3">
            {[
              {
                titulo: 'Aprobación',
                desc: 'Para aceptar esta propuesta y dar inicio al proyecto, se requiere confirmación vía WhatsApp, correo o verbal, para proceder con la firma del contrato y el pago inicial.',
                icon: CheckCircle,
              },
              {
                titulo: 'Términos de pago — Implementación',
                desc: 'El pago de COP 2.000.000 por la implementación del flujo comercial se realiza 50% al inicio y 50% al finalizar la fase de puesta en marcha y capacitación.',
                icon: FileText,
              },
              {
                titulo: 'Términos de pago — Recurrente mensual',
                desc: 'La tarifa mensual de COP 1.800.000 (gestión de pauta COP 500.000 + Plan CRM Growth COP 1.300.000) se factura de forma anticipada el primer día hábil de cada mes.',
                icon: Calendar,
              },
              {
                titulo: 'Presupuesto de pauta',
                desc: 'El presupuesto de pauta (hasta USD 300/mes) es asumido directamente por el cliente. Cualquier incremento debe ser acordado previamente con Sixteam.pro antes de ejecutarse, lo que puede implicar ajuste en la tarifa de gestión.',
                icon: TrendingUp,
              },
              {
                titulo: 'IVA',
                desc: 'Todos los valores de esta propuesta son sin IVA. El IVA aplicable según la legislación colombiana vigente será adicionado en la factura correspondiente.',
                icon: AlertCircle,
              },
              {
                titulo: 'Inicio del proyecto',
                desc: 'El cronograma de implementación (estimado 2–3 semanas) inicia a partir del recibo del primer pago y la entrega de accesos e información necesaria por parte del cliente.',
                icon: Zap,
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
        </section>
      </main>

      {/* ══════════════════════════════════════ FOOTER */}
      <footer style={{ background: 'linear-gradient(180deg, #04111f, #030d1a)' }}>
        <div className="relative overflow-hidden border-t" style={{ borderColor: ACCENT_ALPHA(0.15) }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full"
              style={{ background: `radial-gradient(circle, ${ACCENT_ALPHA(0.05)}, transparent 65%)`, transform: 'translate(30%,-30%)' }} />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-16 sm:py-20 text-center">
            <TagLabel>¿Avanzamos?</TagLabel>
            <h2 className="font-poppins font-black text-white mt-4 mb-4 leading-tight"
              style={{ fontSize: 'clamp(2.25rem, 6.25vw, 4rem)' }}>
              ¿Listo Procurement Pro para escalar sin perder el control?
            </h2>
            <p className="font-lato text-white/50 max-w-md mx-auto mb-8 text-[18px] sm:text-xl leading-relaxed">
              Podemos arrancar esta semana. Escríbenos para confirmar, coordinar accesos y agendar el kickoff.
            </p>
            <div className="flex justify-center">
              <a href="https://wa.me/573004188522" target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-poppins font-bold text-[18px] text-[#030d1a] transition-all duration-300 hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#00bfa5,#00d4b8)', boxShadow: '0 4px 28px rgba(0,191,165,.4)' }}>
                <MessageSquare className="w-4 h-4" />
                Confirmar por WhatsApp
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-8 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <p className="font-poppins font-black text-white text-xl mb-0.5">Sixteam<span className="text-[#00bfa5]">.</span>pro</p>
              <p className="font-lato text-white/30 text-[15px]">Innovación y Estrategia Digital S.A.S.</p>
              <p className="font-lato text-white/25 text-[15px] mt-0.5">NIT {META.nit}</p>
            </div>
            <div>
              <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-2">Contacto</p>
              <a href={`mailto:${META.correo}`}
                className="font-lato text-white/55 text-[18px] hover:text-[#00bfa5] transition-colors flex items-center gap-1.5 mb-1">
                <Mail className="w-3.5 h-3.5" />{META.correo}
              </a>
              <p className="font-lato text-white/35 text-[15px] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />{META.lugar}
              </p>
            </div>
            <div>
              <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-2">Representante legal</p>
              <p className="font-lato text-white/55 text-[18px] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#00bfa5]" />{META.rl}
              </p>
              <p className="font-lato text-white/25 text-[15px] mt-2">Válida 30 días · {META.fecha}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProcurementProProposal;
