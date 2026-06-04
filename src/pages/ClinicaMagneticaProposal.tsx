import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap, BarChart3,
  AlertCircle, TrendingUp, ArrowRight,
  Calendar, Info, MapPin,
  MessageSquare, Settings, Users, LayoutDashboard,
  GraduationCap, Rocket, Bot, Inbox, SlidersHorizontal,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente:        'Clínica Magnética',
  tagline:        'Medicina Estética · Belleza con Ciencia',
  sector:         'Clínica de Medicina Estética · Chile',
  sede:           'Chile',
  fecha:          'Junio 2026',
  lugar:          'Chile',
  contacto:       'Camila Cavada',
  proponente:     'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit:            '901.967.849-4',
  correo:         'alpha@sixteam.pro',
  rl:             'Samuel Armando Burgos Ferrer',
  objetivo:
    'Implementación del CRM Sixteam.pro con ChatCenter omnicanal y un Agente Conversacional con IA, para ordenar la atención al cliente, automatizar el agendamiento y liberar al equipo del trabajo manual repetitivo.',
};

const CM_COLOR = '#d946ef';

const HALLAZGOS = [
  {
    titulo: 'Descontrol en la atención por WhatsApp',
    desc: 'La recepcionista gestiona una lista de WhatsApp enorme sin visibilidad. Se pierden conversaciones, no hay seguimiento a leads y queda sin responder a clientes que necesitan atención.',
    icon: MessageSquare, tint: 'red',
  },
  {
    titulo: 'Sin CRM ni gestión de oportunidades',
    desc: 'No existe un sistema centralizado para registrar clientes, hacer seguimiento de tratamientos ni identificar oportunidades de venta. La información vive dispersa entre WhatsApp y la memoria del equipo.',
    icon: BarChart3, tint: 'amber',
  },
  {
    titulo: 'Sobrecarga de trabajo manual',
    desc: 'El equipo responde mensajes los viernes, sábados y domingos. Cada confirmación, recordatorio y seguimiento se hace manualmente, consumiendo tiempo que debería ir a la atención clínica.',
    icon: AlertCircle, tint: 'blue',
  },
  {
    titulo: 'Integración tecnológica fragmentada',
    desc: 'Agenda Pro opera desconectada del resto del proceso de atención. No hay un sistema unificado que conecte el agendamiento, la comunicación y los datos del cliente en un solo lugar.',
    icon: TrendingUp, tint: 'teal',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber: { text: 'text-amber-400',       bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)' },
  teal:  { text: 'text-[#00bfa5]',       bg: 'rgba(0,191,165,.07)',   border: 'rgba(0,191,165,.18)' },
  blue:  { text: 'text-[#60a5fa]',       bg: 'rgba(96,165,250,.07)',  border: 'rgba(96,165,250,.18)' },
  red:   { text: 'text-[#f87171]',       bg: 'rgba(221,51,51,.07)',   border: 'rgba(221,51,51,.2)' },
  fuchsia: { text: 'text-[#d946ef]',     bg: 'rgba(217,70,239,.07)',  border: 'rgba(217,70,239,.2)' },
};

// ─── COMPONENTES DEL SISTEMA ──────────────────────────────────────────────────

const COMPONENTES = [
  {
    num: '01',
    nombre: 'CRM Sixteam.pro + ChatCenter',
    subtitulo: 'Gestión, agendamiento y bandeja omnicanal',
    icon: Inbox,
    tint: 'fuchsia',
    desc: 'Implementación completa del CRM Sixteam.pro para Clínica Magnética: desde la configuración inicial hasta el go-live con el equipo. Centraliza la atención, el agendamiento y los datos de los clientes en una sola plataforma.',
    items: [
      'Sistema de agendamiento para hasta 30 servicios, con profesionales (Dra. + Kinesióloga) y disponibilidades configuradas',
      'Recordatorios, confirmaciones y notificaciones de cancelación automatizadas',
      'ChatCenter omnicanal: WhatsApp, Instagram, Facebook y más en una sola bandeja',
      'Hasta 5 informes personalizados: actividad, agendas, conversiones y seguimiento',
      'Hasta 5 automatizaciones de flujo: seguimiento de leads, recordatorios, reasignaciones',
      'Propiedades y campos personalizados del cliente configurados por Sixteam.pro',
      'Capacitación al equipo: 2 sesiones en vivo + documentación de uso',
    ],
  },
  {
    num: '02',
    nombre: 'Agente Conversacional con IA',
    subtitulo: 'Atención 24/7 · Calificación de leads · Agendamiento',
    icon: Bot,
    tint: 'teal',
    desc: 'Un agente de IA entrenado con la información real de la clínica: servicios, precios, preguntas frecuentes y protocolos de atención. Responde automáticamente, califica al cliente y facilita el agendamiento desde WhatsApp.',
    items: [
      'Agente IA entrenado con los servicios y FAQ de Clínica Magnética',
      'Respuesta automática 24/7 a consultas por WhatsApp',
      'Calificación y perfilamiento del lead según el tipo de tratamiento de interés',
      'Enlace directo al calendario de agendamiento desde la conversación',
      'Protocolo de handoff bot → equipo con contexto completo de la conversación',
      'Seguimientos automáticos personalizados para leads que no responden',
      '2 rondas de testing y ajuste fino previas al lanzamiento',
    ],
  },
];

// ─── PLAN DE TRABAJO ──────────────────────────────────────────────────────────

type Actividad = { text: string; tag?: string };

const FASES = [
  {
    num: '01',
    nombre: 'Contexto y Planificación',
    duracion: '1 semana · hasta semana 1',
    icon: FileText,
    color: CM_COLOR,
    colorAlpha: 'rgba(217,70,239,.12)',
    colorBorder: 'rgba(217,70,239,.3)',
    descripcion: 'Revisamos los flujos actuales, los servicios disponibles, el uso de Agenda Pro y la dinámica del equipo. Con esa base definimos el modelo de datos, los flujos del CRM y el guión del agente IA.',
    actividades: [
      { text: 'Sesión de kick-off y levantamiento detallado de servicios, profesionales, flujos de atención y dolores actuales', tag: 'Trabajo en conjunto' },
      { text: 'Diseño de arquitectura del CRM: propiedades, campos, pipelines y flujos de automatización' },
      { text: 'Revisión de Agenda Pro y planificación de migración/equivalencia en la plataforma' },
      { text: 'Diseño del guión inicial del agente IA basado en los documentos de servicios y FAQ entregados por la clínica' },
    ] as Actividad[],
  },
  {
    num: '02',
    nombre: 'Implementación CRM + ChatCenter',
    duracion: '2–3 semanas · hasta semana 4',
    icon: Settings,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.3)',
    descripcion: 'Con la arquitectura validada, se implementa el CRM completo: agendamiento, bandeja omnicanal, automatizaciones, informes y configuración del equipo. Validaciones semanales para asegurar que el sistema refleje la operación real.',
    actividades: [
      { text: 'Configuración de la cuenta, usuarios (Dra. + Kinesióloga + Recepcionista) y permisos' },
      { text: 'Sistema de agendamiento para hasta 30 servicios: calendarios individuales por profesional, disponibilidades y reglas de reserva' },
      { text: 'Automatizaciones de recordatorio, confirmación, cancelación y no-show vía WhatsApp' },
      { text: 'Conexión de WhatsApp Business, Instagram y Facebook al ChatCenter omnicanal' },
      { text: 'Hasta 5 informes personalizados y panel de actividad del equipo' },
      { text: 'Hasta 5 automatizaciones de flujo para seguimiento de leads y gestión de conversaciones' },
      { text: 'Propiedades y campos personalizados de clientes configurados según el proceso de la clínica' },
      { text: 'Validaciones semanales con el equipo durante toda la etapa' },
    ] as Actividad[],
  },
  {
    num: '03',
    nombre: 'Implementación Agente IA',
    duracion: '1–2 semanas · hasta semana 5',
    icon: Bot,
    color: '#a855f7',
    colorAlpha: 'rgba(168,85,247,.10)',
    colorBorder: 'rgba(168,85,247,.3)',
    descripcion: 'El agente IA se construye sobre el CRM ya configurado, asegurando que las conversaciones fluyan directamente al CRM y el calendario. Se entrena, testea y ajusta antes del lanzamiento.',
    actividades: [
      { text: 'Entrenamiento del agente IA con los servicios, FAQ y protocolos de Clínica Magnética' },
      { text: 'Configuración del flujo de conversación: bienvenida, calificación, agendamiento y handoff al equipo' },
      { text: 'Integración del bot con el calendario del CRM para agendamiento directo' },
      { text: 'Configuración de seguimientos automáticos personalizados para leads inactivos' },
      { text: 'Testing interno (ronda 1) y ajuste fino del flujo y respuestas del agente' },
      { text: 'Testing con el equipo de la clínica (ronda 2) y correcciones finales' },
    ] as Actividad[],
  },
  {
    num: '04',
    nombre: 'Capacitación y Go-Live',
    duracion: '1 semana · hasta semana 6',
    icon: Rocket,
    color: '#f59e0b',
    colorAlpha: 'rgba(245,158,11,.10)',
    colorBorder: 'rgba(245,158,11,.3)',
    descripcion: 'Acompañamos al equipo en las primeras semanas de operación real. Sesiones de capacitación, resolución de dudas y ajustes ágiles para que el sistema quede funcionando de forma autónoma.',
    actividades: [
      { text: '2 sesiones de capacitación al equipo sobre el CRM y el ChatCenter', tag: 'Trabajo en conjunto' },
      { text: '1 sesión para gerencia sobre lectura de informes y métricas clave' },
      { text: 'Monitoreo activo del sistema y del bot durante las primeras semanas de uso real' },
      { text: 'Corrección ágil de errores o ajustes que emerjan en la operación del día a día' },
      { text: 'Documentación de uso y guías por rol para el equipo' },
      { text: 'Resolución de dudas vía canal dedicado durante toda la etapa' },
    ] as Actividad[],
  },
];

// ─── DESGLOSE CRM ─────────────────────────────────────────────────────────────

const DESGLOSE_CRM = [
  {
    categoria: 'Agendamiento de Servicios',
    icon: Calendar,
    color: CM_COLOR,
    items: [
      'Gestión de agendamientos para hasta 30 servicios',
      'Calendarios individuales por profesional: Doctora y Kinesióloga',
      'Servicios configurados con duración, precio y profesional asignado',
      'Reglas de disponibilidad y horarios de atención por profesional',
      'Página de agendamiento online personalizada para pacientes',
      'Recordatorio automático previo a la cita (1–2 días antes)',
      'Mensaje de confirmación automático al agendar',
      'Notificaciones de cancelación y no-show con flujo de seguimiento',
    ],
  },
  {
    categoria: 'ChatCenter Omnicanal',
    icon: Inbox,
    color: '#00bfa5',
    items: [
      'Bandeja unificada: WhatsApp Business, Instagram DM, Facebook Messenger',
      'Distribución de conversaciones entre los asesores del equipo',
      'Panel de tarjetas de contacto con historial y propiedades del cliente',
      'Etiquetas y filtros para clasificar y priorizar conversaciones',
      'Notas internas y transferencia de conversaciones entre asesores',
      'Campaña de WhatsApp con envío de goteo para evitar bloqueos',
    ],
  },
  {
    categoria: 'Informes y Panel',
    icon: LayoutDashboard,
    color: '#f59e0b',
    items: [
      'Panel principal con métricas de actividad del equipo',
      'Hasta 5 informes personalizados: citas agendadas, conversiones de leads, actividad por canal, etc.',
      'Exportación de datos e historial de conversaciones',
    ],
  },
  {
    categoria: 'Automatizaciones',
    icon: Zap,
    color: '#a855f7',
    items: [
      'Hasta 5 automatizaciones de flujo configuradas por Sixteam.pro',
      'Ejemplos: seguimiento automático a leads que no responden, alerta por cita sin confirmar, asignación de conversaciones entrantes',
      'Flujos de reactivación para clientes con citas pasadas sin volver a agendar',
    ],
  },
  {
    categoria: 'Propiedades y Campos del Cliente',
    icon: SlidersHorizontal,
    color: '#60a5fa',
    items: [
      'Campos personalizados del contacto: tratamientos de interés, historial de visitas, alergias o contraindicaciones relevantes',
      'Etiquetas de segmentación: tipo de cliente, canal de origen, estado del lead',
      'Vista de registro del cliente con toda la información relevante en un solo lugar',
    ],
  },
];

const SECCIONES = [
  { id: 'resumen',    label: 'Resumen' },
  { id: 'objetivo',  label: 'Objetivo' },
  { id: 'sistema',   label: 'Sistema' },
  { id: 'plan',      label: 'Plan' },
  { id: 'inversion', label: 'Inversión' },
  { id: 'vigencia',  label: 'Vigencia' },
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

const ClinicaMagneticaProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [faseActiva, setFaseActiva] = useState<number | null>(null);
  const [desgloseActivo, setDesgloseActivo] = useState<number | null>(null);
  const [compActivo, setCompActivo] = useState<number | null>(null);
  const [showSoporte, setShowSoporte] = useState(false);
  const [showCostosVariables, setShowCostosVariables] = useState(false);
  const [showMetaTable, setShowMetaTable] = useState(false);
  const [showCalcIA, setShowCalcIA] = useState(false);
  const [mensajesConv, setMensajesConv] = useState(6);
  const [convsMes, setConvsMes] = useState(150);

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
            style={{ background: 'radial-gradient(circle, rgba(217,70,239,.06) 0%, transparent 65%)' }} />
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
            <div className="flex items-center gap-3">
              <div className="w-auto h-12 flex items-center justify-center">
                <img src="/logo-clinica-magnetica.jpg" alt="Clínica Magnética" className="h-full w-auto object-contain rounded-lg"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            </div>
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
              <TagLabel>Propuesta de trabajo y cotización · Junio 2026</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${CM_COLOR}, #1d70a2)` }}>
                  <Settings className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: `rgba(217,70,239,.10)`, border: `1px solid rgba(217,70,239,.25)`, color: CM_COLOR }}>
                  {META.tagline}
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}>
                Propuesta<br />
                <span style={{ background: `linear-gradient(90deg,${CM_COLOR},#00bfa5)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
                  {['1. Resumen ejecutivo','2. Objetivo general','3. Sistema propuesto','4. Plan de trabajo','5. Inversión','6. Vigencia y términos'].map((item, i) => (
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
                  style={{ background: `radial-gradient(circle, rgba(217,70,239,.10) 0%, rgba(29,112,162,.05) 50%, transparent 70%)` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full" style={{ border: `1px solid rgba(217,70,239,.12)` }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(29,112,162,.15)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: CM_COLOR, boxShadow: `0 0 6px rgba(217,70,239,.8)` }} />
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
                    <img src="/logo-clinica-magnetica.jpg" alt="Clínica Magnética" className="w-full h-full object-contain rounded-lg"
                      style={{ filter: `drop-shadow(0 2px 20px rgba(217,70,239,.4))` }} />
                  </div>
                  <div className="text-center">
                    <span className="font-poppins font-black text-white text-[24px] tracking-tight">{META.cliente}</span>
                    <p className="font-lato text-[13px] uppercase tracking-[0.18em] mt-1" style={{ color: CM_COLOR }}>{META.tagline}</p>
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
            style={{ background: 'rgba(2,8,20,.85)', border: `1px solid rgba(217,70,239,.18)` }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-28 h-20 flex items-center justify-center p-2 rounded-xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)' }}>
                <img src="/logo-clinica-magnetica.jpg" alt="Clínica Magnética" className="w-full h-full object-contain rounded-lg" />
              </div>
              <span className="font-poppins font-black text-white text-[14px] tracking-tight">{META.cliente}</span>
              <span className="font-lato text-[11px] uppercase tracking-[0.2em]" style={{ color: CM_COLOR }}>Chile</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                <p className="font-poppins font-semibold text-white/80 text-[16px]">{META.sector}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Contacto</p>
                <p className="font-poppins font-semibold text-white/80 text-[16px]">{META.contacto} · Médico</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Equipo</p>
                <p className="font-lato text-white/60 text-[15px]">Doctora + Kinesióloga + Recepcionista</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sistema de agendamiento actual</p>
                <p className="font-lato text-white/60 text-[15px]">Agenda Pro · sin integración CRM</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Plataforma propuesta</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#00bfa5' }} />
                  <p className="font-poppins font-semibold text-[#00bfa5] text-[14px]">CRM Sixteam.pro + Agente IA</p>
                </div>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Fecha de propuesta</p>
                <p className="font-lato text-white/60 text-[15px]">{META.fecha}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              Clínica Magnética es una clínica de medicina estética en Chile con un equipo de tres personas: doctora, kinesióloga y recepcionista. Camila Cavada, médico fundadora de la clínica, viene explorando desde hace tiempo la posibilidad de implementar un sistema tecnológico que les permita{' '}
              <strong className="text-white/90 font-semibold">ordenar la atención al cliente, automatizar el agendamiento y liberar al equipo del trabajo manual repetitivo</strong> que hoy consume una parte importante de la jornada.
            </p>
            <p>
              En la reunión del 1 de junio de 2026, Camila compartió con el equipo de Sixteam.pro los principales dolores de la clínica: una recepcionista desbordada por los mensajes de WhatsApp, la ausencia de un CRM, la necesidad de un chatbot que responda los fines de semana y la búsqueda de un sistema de agendamiento que pueda centralizar la gestión de citas, recordatorios y seguimientos. Esta propuesta responde directamente a esos cuatro frenos.
            </p>
          </div>

          {/* Hallazgos */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> 4 frenos identificados en el diagnóstico
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
          <TagLabel>02 — Objetivo general</TagLabel>
          <SectionTitle>¿Para qué estamos aquí?</SectionTitle>
          <Rule />
          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: `radial-gradient(circle, rgba(217,70,239,.07), transparent 70%)`, transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 text-[#00bfa5] mb-4" />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[22px] leading-relaxed">
              Implementar el <strong className="text-white font-black">CRM Sixteam.pro</strong> como la plataforma central de atención al cliente de Clínica Magnética: centralizar la comunicación en un ChatCenter omnicanal, automatizar el agendamiento y los recordatorios, y dotar al equipo de un{' '}
              <em className="not-italic" style={{ color: CM_COLOR }}>Agente IA conversacional</em> que responda consultas y facilite el agendamiento las 24 horas, los 7 días de la semana, incluyendo fines de semana.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Componentes', value: '2', sub: 'CRM + ChatCenter · Agente IA' },
              { label: 'Canales omnicanal', value: '3+', sub: 'WhatsApp · Instagram · Facebook' },
              { label: 'Profesionales', value: '2', sub: 'Dra. + Kinesióloga · 2 calendarios' },
              { label: 'Duración estimada', value: '6 sem', sub: '4 fases de implementación' },
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
          <SectionTitle>2 componentes · 1 plataforma integrada</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            El sistema está diseñado para que los dos componentes trabajen juntos: el CRM centraliza la información y el agendamiento, mientras que el agente IA lleva las conversaciones al calendario sin intervención manual. Cada freno identificado se resuelve en alguno de los dos componentes.
          </p>

          <div className="space-y-3 mb-10">
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
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-90' : ''}`}
                        style={{ color: open ? t.text.replace('text-[', '').replace(']', '') : 'rgba(255,255,255,.3)' }} />
                    </div>
                  </button>

                  {open && (
                    <div className="px-4 sm:px-5 pb-6 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Descripción</p>
                          <p className="font-lato text-white/65 text-[15px] leading-relaxed">{c.desc}</p>
                        </div>
                        <div>
                          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <CheckCircle className={`w-3.5 h-3.5 ${t.text}`} /> Incluye
                          </p>
                          <ul className="space-y-2">
                            {c.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <CheckCircle className={`w-3.5 h-3.5 ${t.text} flex-shrink-0 mt-0.5`} />
                                <span className="font-lato text-white/65 text-[14px]">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desglose CRM */}
          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-4">
            Detalle del alcance de implementación — CRM Sixteam.pro
          </p>
          <div className="space-y-2.5">
            {DESGLOSE_CRM.map((bloque, i) => {
              const Icon = bloque.icon;
              const open = desgloseActivo === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${bloque.color}44` : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setDesgloseActivo(open ? null : i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? `${bloque.color}20` : 'rgba(255,255,255,.05)' }}>
                      <Icon className="w-4 h-4 transition-colors" style={{ color: open ? bloque.color : 'rgba(255,255,255,.35)' }} />
                    </div>
                    <div className="flex-1">
                      <span className={`font-poppins font-bold text-[17px] ${open ? 'text-white' : 'text-white/70'}`}>{bloque.categoria}</span>
                      <span className="font-lato text-white/30 text-[14px] ml-3">{bloque.items.length} ítems</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`}
                      style={{ color: open ? bloque.color : 'rgba(255,255,255,.3)' }} />
                  </button>
                  {open && (
                    <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <ul className="pt-4 space-y-2.5">
                        {bloque.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: bloque.color }} />
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
        </section>

        {/* ─ 04 PLAN ─ */}
        <section id="plan" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Plan de trabajo</TagLabel>
          <SectionTitle>4 fases · ~6 semanas</SectionTitle>
          <Rule />

          {/* Timeline visual */}
          <div className="relative mb-10">
            <div className="hidden sm:block absolute left-[28px] top-10 bottom-10 w-px"
              style={{ background: `linear-gradient(to bottom, rgba(217,70,239,.4), rgba(0,191,165,.4), rgba(168,85,247,.4), rgba(245,158,11,.4))` }} />

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
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`font-poppins font-bold text-[18px] ${open ? 'text-white' : 'text-white/70'}`}>{fase.nombre}</span>
                        </div>
                        <p className="font-lato text-white/40 text-[14px] mt-0.5 line-clamp-1">{fase.descripcion}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                        <div className="text-right hidden sm:block">
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: fase.colorAlpha, border: `1px solid ${fase.colorBorder}` }}>
                            <Clock className="w-3 h-3" style={{ color: fase.color }} />
                            <span className="font-poppins font-bold text-[13px]" style={{ color: fase.color }}>{fase.duracion}</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`}
                          style={{ color: open ? fase.color : 'rgba(255,255,255,.3)' }} />
                      </div>
                    </button>

                    {open && (
                      <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                        <div className="pt-4">
                          <p className="font-lato text-white/60 text-[16px] leading-relaxed mb-4">{fase.descripcion}</p>
                          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Actividades</p>
                          <ul className="space-y-2">
                            {fase.actividades.map((a, j) => {
                              const act = typeof a === 'string' ? { text: a } : a;
                              return (
                                <li key={j} className="flex items-start gap-2">
                                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: fase.color }} />
                                  <span className="font-lato text-white/65 text-[16px] flex-1">{act.text}
                                    {act.tag && (
                                      <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wide align-middle"
                                        style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.3)', color: '#00bfa5' }}>
                                        {act.tag}
                                      </span>
                                    )}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl p-4 flex gap-3"
            style={{ background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.2)' }}>
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#f59e0b]" />
            <p className="font-lato text-white/55 text-[15px] leading-relaxed">
              Las fases <strong className="text-white/80">02</strong> (CRM) y <strong className="text-white/80">03</strong> (Agente IA) pueden solaparse en la última semana de implementación del CRM. El agente IA se construye sobre el CRM activo, lo que garantiza que ambos sistemas estén integrados desde el día cero.
            </p>
          </div>
        </section>

        {/* ─ 05 INVERSIÓN ─ */}
        <section id="inversion" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Propuesta de inversión</TagLabel>
          <SectionTitle>Inversión por componente</SectionTitle>
          <Rule />
          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Dos pagos únicos de implementación para el sistema base, más un costo mensual de plataforma que incluye la operación continua del sistema. Valores en{' '}
            <strong className="text-white/75">dólares USD</strong>.
          </p>

          {/* Componente 1: CRM */}
          <div className="rounded-xl p-5 sm:p-6 mb-4 flex flex-col sm:flex-row gap-5 sm:items-start"
            style={{ background: 'rgba(217,70,239,.05)', border: '1px solid rgba(217,70,239,.22)' }}>
            <div className="flex items-center gap-4 sm:w-[45%]">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(217,70,239,.15)', border: '1px solid rgba(217,70,239,.3)' }}>
                <Inbox className="w-5 h-5" style={{ color: CM_COLOR }} />
              </div>
              <div>
                <p className="font-poppins font-bold text-white/85 text-[17px]">CRM + ChatCenter</p>
                <p className="font-lato text-white/40 text-[13px] mt-0.5">Agendamiento · bandeja omnicanal · automatizaciones</p>
              </div>
            </div>
            <div className="sm:w-[25%]">
              <p className="font-poppins font-black text-[1.8rem]" style={{ color: CM_COLOR }}>
                USD 800<span className="font-lato font-normal text-white/40 text-[1rem]"> · único</span>
              </p>
            </div>
            <div className="sm:flex-1">
              <ul className="space-y-1">
                {[
                  'CRM configurado para Clínica Magnética',
                  'Sistema de agendamiento para hasta 30 servicios: 2 profesionales y disponibilidades',
                  'ChatCenter omnicanal: WhatsApp, Instagram y Facebook',
                  'Hasta 5 informes personalizados y hasta 5 automatizaciones de flujo',
                  'Propiedades y campos personalizados configurados por Sixteam',
                  'Capacitación al equipo: 2 sesiones en vivo',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 flex-shrink-0 mt-[3px]" style={{ color: CM_COLOR }} />
                    <span className="font-lato text-white/55 text-[14px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Componente 2: Agente IA */}
          <div className="rounded-xl p-5 sm:p-6 mb-4 flex flex-col sm:flex-row gap-5 sm:items-start"
            style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.22)' }}>
            <div className="flex items-center gap-4 sm:w-[45%]">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,191,165,.15)', border: '1px solid rgba(0,191,165,.3)' }}>
                <Bot className="w-5 h-5 text-[#00bfa5]" />
              </div>
              <div>
                <p className="font-poppins font-bold text-white/85 text-[17px]">Agente IA Conversacional</p>
                <p className="font-lato text-white/40 text-[13px] mt-0.5">Bot entrenado · 24/7 · handoff · 2 rondas de testing</p>
              </div>
            </div>
            <div className="sm:w-[25%]">
              <p className="font-poppins font-black text-[1.8rem] text-[#00bfa5]">
                USD 400<span className="font-lato font-normal text-white/40 text-[1rem]"> · único</span>
              </p>
            </div>
            <div className="sm:flex-1">
              <ul className="space-y-1">
                {[
                  'Agente IA entrenado con servicios y FAQ de Clínica Magnética',
                  'Respuesta automática 24/7 desde WhatsApp',
                  'Flujo de calificación y agendamiento desde la conversación',
                  'Protocolo de handoff bot → equipo con contexto completo',
                  'Seguimientos automáticos personalizados para leads inactivos',
                  'Testing y ajuste fino (hasta 2 rondas)',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-[#00bfa5] flex-shrink-0 mt-[3px]" />
                    <span className="font-lato text-white/55 text-[14px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Resumen implementación */}
          <div className="rounded-2xl p-6 sm:p-7 mb-4" style={{ background: 'rgba(217,70,239,.04)', border: `1px solid rgba(217,70,239,.18)` }}>
            <p className="font-lato text-white/35 text-[13px] uppercase tracking-widest mb-4">Resumen de inversión · Implementación</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                <p className="font-lato text-white/35 text-[13px] uppercase tracking-wider mb-1">CRM + ChatCenter</p>
                <p className="font-poppins font-black text-white text-[1.1rem]">USD 800<span className="text-white/40 text-[0.8rem] font-lato font-normal"> · único</span></p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                <p className="font-lato text-white/35 text-[13px] uppercase tracking-wider mb-1">Agente IA</p>
                <p className="font-poppins font-black text-white text-[1.1rem]">USD 400<span className="text-white/40 text-[0.8rem] font-lato font-normal"> · único</span></p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(217,70,239,.08)', border: '1px solid rgba(217,70,239,.25)' }}>
                <p className="font-lato text-[13px] uppercase tracking-wider mb-1" style={{ color: 'rgba(217,70,239,.7)' }}>Total implementación</p>
                <p className="font-poppins font-black text-white text-[1.1rem]">USD 1.200</p>
                <p className="font-lato text-white/30 text-[11px] mt-0.5">Pago único por componente</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {[
                'Cada componente se paga al inicio de su fase de implementación',
                'Los dos componentes se implementan en el mismo proyecto (~6 semanas)',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: CM_COLOR }} />
                  <span className="font-lato text-white/50 text-[13px]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plataforma mensual */}
          <div className="rounded-xl overflow-hidden mb-3"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(217,70,239,.15)' }}>
                <Zap className="w-4 h-4" style={{ color: CM_COLOR }} />
              </div>
              <div className="flex-1 flex flex-wrap items-center gap-2">
                <span className="font-poppins font-bold text-[16px] text-white">Plataforma mensual recurrente</span>
                <span className="font-lato text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(217,70,239,.12)', border: '1px solid rgba(217,70,239,.25)', color: CM_COLOR }}>
                  Growth
                </span>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-poppins font-black text-[15px]" style={{ color: CM_COLOR }}>
                  USD 360<span className="font-lato font-normal text-white/35 text-[12px]">/mes</span>
                </p>
                <p className="font-lato text-white/30 text-[11px]">+ costos variables</p>
              </div>
            </div>
            <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
              <div className="pt-4 space-y-4">

                {/* Desglose */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.06)' }}>
                    <p className="font-lato text-white/35 text-[11px] uppercase tracking-wider mb-1">CRM Sixteam.pro Growth</p>
                    <p className="font-poppins font-black text-white text-[1rem]">USD 360<span className="font-lato font-normal text-white/35 text-[0.8rem]">/mes</span></p>
                    <p className="font-lato text-white/30 text-[11px] mt-0.5">Hasta 3 usuarios · 1 número WhatsApp</p>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: 'rgba(217,70,239,.06)', border: '1px solid rgba(217,70,239,.2)' }}>
                    <p className="font-lato text-[11px] uppercase tracking-wider mb-1" style={{ color: 'rgba(217,70,239,.7)' }}>Total mensual fijo</p>
                    <p className="font-poppins font-black text-white text-[1rem]">USD 360<span className="font-lato font-normal text-white/35 text-[0.8rem]">/mes</span></p>
                    <p className="font-lato text-white/30 text-[11px] mt-0.5">+ costos variables según consumo</p>
                  </div>
                </div>

                <ul className="space-y-1.5">
                  {[
                    'CRM completo con agendamiento, ChatCenter y automatizaciones activos',
                    'Hasta 3 usuarios con acceso completo a la plataforma',
                    '1 número de WhatsApp Business conectado al ChatCenter',
                    'Agente IA activo 24/7 respondiendo en WhatsApp',
                    'Panel de informes personalizados y métricas de actividad',
                    'Módulo Email Marketing incluido — hasta 5.000 correos al mes · cada 1.000 adicionales USD 2',
                    'Gestión de calendarios y agendamientos para hasta 30 servicios',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: CM_COLOR }} />
                      <span className="font-lato text-white/55 text-[14px]">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Costos variables adicionales */}
                <div className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ border: showCostosVariables ? '1px solid rgba(245,158,11,.35)' : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setShowCostosVariables(v => !v)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200"
                    style={{ background: showCostosVariables ? 'rgba(245,158,11,.06)' : 'transparent' }}>
                    <Info className="w-3.5 h-3.5 flex-shrink-0" style={{ color: showCostosVariables ? '#f59e0b' : 'rgba(255,255,255,.35)' }} />
                    <span className="font-lato text-[13px] flex-1" style={{ color: showCostosVariables ? '#f59e0b' : 'rgba(255,255,255,.4)' }}>
                      Costos variables adicionales
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 flex-shrink-0"
                      style={{ color: showCostosVariables ? '#f59e0b' : 'rgba(255,255,255,.25)', transform: showCostosVariables ? 'rotate(90deg)' : undefined }} />
                  </button>

                  {showCostosVariables && (
                    <div className="px-4 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <div className="pt-4 space-y-4">

                        {/* WhatsApp Meta */}
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 bg-[#f59e0b]" />
                          <div className="flex-1">
                            <p className="font-lato text-white/55 text-[14px] leading-relaxed mb-2">
                              <strong className="text-white/75">Mensajes plantilla WhatsApp (Meta):</strong> cada mensaje enviado fuera de la ventana de servicio de 24h (recordatorios, campañas, seguimientos) tiene un costo directo de Meta —{' '}
                              <strong className="text-white/75">no es un cobro de Sixteam.pro</strong>. La tarifa varía según el país y el tipo de plantilla (Marketing o Utility).{' '}
                              <span className="font-lato text-[12px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,.12)', color: '#f59e0b' }}>Facturado mes vencido · según consumo real</span>
                            </p>

                            {/* Chile destacado */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                                style={{ background: 'rgba(217,70,239,.08)', border: '1px solid rgba(217,70,239,.25)' }}>
                                <span className="font-poppins font-semibold text-white/90 text-[13px]">🇨🇱 Chile</span>
                                <span className="font-lato text-white/45 text-[12px]">Marketing</span>
                                <span className="font-poppins font-bold text-[13px]" style={{ color: CM_COLOR }}>USD 0.0933</span>
                                <span className="font-lato text-white/30 text-[11px]">|</span>
                                <span className="font-lato text-white/45 text-[12px]">Utility</span>
                                <span className="font-poppins font-bold text-[13px]" style={{ color: CM_COLOR }}>USD 0.0210</span>
                              </div>
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                                style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                                <span className="font-lato text-white/40 text-[12px]">Service (atención entrante)</span>
                                <span className="font-poppins font-bold text-[#00bfa5] text-[13px]">FREE</span>
                              </div>
                            </div>

                            <button onClick={() => setShowMetaTable(v => !v)}
                              className="flex items-center gap-1.5 mb-2 transition-colors duration-200"
                              style={{ color: showMetaTable ? '#f59e0b' : 'rgba(255,255,255,.3)' }}
                              onMouseEnter={e => (e.currentTarget.style.color = '#f59e0b')}
                              onMouseLeave={e => (e.currentTarget.style.color = showMetaTable ? '#f59e0b' : 'rgba(255,255,255,.3)')}>
                              <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${showMetaTable ? 'rotate-90' : ''}`} />
                              <span className="font-lato text-[13px]">{showMetaTable ? 'Ocultar' : 'Ver'} tarifas por país — fuente Meta</span>
                            </button>

                            {showMetaTable && (
                              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(245,158,11,.2)' }}>
                                <div className="grid grid-cols-4 px-3 py-2 text-[11px] font-poppins font-semibold uppercase tracking-wider text-white/30"
                                  style={{ background: 'rgba(245,158,11,.06)', borderBottom: '1px solid rgba(245,158,11,.15)' }}>
                                  <span>País / Mercado</span>
                                  <span className="text-right">Marketing (USD)</span>
                                  <span className="text-right">Utility (USD)</span>
                                  <span className="text-right">Service</span>
                                </div>
                                <div className="divide-y max-h-72 overflow-y-auto" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
                                  {[
                                    ['🇨🇱 Chile','0.0933','0.0210'],['🇦🇷 Argentina','0.0649','0.0273'],['🇧🇷 Brazil','0.0656','0.0071'],
                                    ['🇨🇴 Colombia','0.0131','0.0008'],['🇪🇬 Egypt','0.0676','0.0038'],['🇫🇷 France','0.0902','0.0315'],
                                    ['🇩🇪 Germany','0.1433','0.0578'],['🇮🇳 India','0.0124','0.0015'],['🇮🇩 Indonesia','0.0432','0.0263'],
                                    ['🇮🇱 Israel','0.0371','0.0056'],['🇮🇹 Italy','0.0726','0.0315'],['🇲🇾 Malaysia','0.0903','0.0147'],
                                    ['🇲🇽 Mexico','0.0320','0.0089'],['🇳🇱 Netherlands','0.1677','0.0525'],['🇳🇬 Nigeria','0.0542','0.0070'],
                                    ['🇵🇰 Pakistan','0.0497','0.0057'],['🇵🇪 Peru','0.0738','0.0210'],['🇷🇺 Russia','0.0842','0.0420'],
                                    ['🇸🇦 Saudi Arabia','0.0478','0.0112'],['🇿🇦 South Africa','0.0398','0.0080'],['🇪🇸 Spain','0.0646','0.0210'],
                                    ['🇹🇷 Turkey','0.0114','0.0056'],['🇦🇪 United Arab Emirates','0.0524','0.0165'],['🇬🇧 United Kingdom','0.0555','0.0231'],
                                    ['🌎 North America','0.0263','0.0036'],['🌍 Rest of Africa','0.0236','0.0042'],['🌏 Rest of Asia Pacific','0.0769','0.0119'],
                                    ['🌍 Rest of C. & E. Europe','0.0903','0.0223'],['🌎 Rest of Latin America','0.0777','0.0119'],
                                    ['🌍 Rest of Middle East','0.0358','0.0096'],['🌍 Rest of Western Europe','0.0622','0.0180'],['🌐 Other','0.0634','0.0081'],
                                  ].map(([market, marketing, utility], i) => (
                                    <div key={i} className="grid grid-cols-4 px-3 py-2 items-center"
                                      style={{ background: market.includes('Chile') ? 'rgba(217,70,239,.06)' : i % 2 === 0 ? 'rgba(255,255,255,.015)' : 'transparent' }}>
                                      <span className={`font-lato text-[13px] ${market.includes('Chile') ? 'text-white/90 font-semibold' : 'text-white/60'}`}>{market}</span>
                                      <span className="font-poppins font-semibold text-[13px] text-right"
                                        style={{ color: market.includes('Chile') ? CM_COLOR : 'rgba(255,255,255,.55)' }}>{marketing}</span>
                                      <span className="font-poppins font-semibold text-[13px] text-right"
                                        style={{ color: market.includes('Chile') ? CM_COLOR : 'rgba(255,255,255,.55)' }}>{utility}</span>
                                      <span className="font-poppins font-bold text-[12px] text-right text-[#00bfa5]">FREE</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="px-3 py-2 text-[11px] font-lato text-white/25 text-center"
                                  style={{ borderTop: '1px solid rgba(245,158,11,.1)', background: 'rgba(245,158,11,.03)' }}>
                                  Fuente: Meta for Developers — WhatsApp Business Platform Pricing · Todos los valores en USD · Aplica por número destinatario
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Consumo IA */}
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 bg-[#f59e0b]" />
                          <div className="flex-1">
                            <p className="font-lato text-white/55 text-[14px] leading-relaxed mb-3">
                              <strong className="text-white/75">Consumo de IA:</strong> costo variable según el volumen de mensajes procesados por el agente conversacional. Se factura mes vencido sobre el consumo efectivo del período.{' '}
                              <span className="font-lato text-[12px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,.12)', color: '#f59e0b' }}>Facturado mes vencido · según consumo real</span>{' '}
                              Usa la calculadora para estimar tu costo mensual.
                            </p>

                            {/* Calculadora IA */}
                            <div className="rounded-xl overflow-hidden transition-all duration-300"
                              style={{ border: showCalcIA ? `1px solid rgba(217,70,239,.35)` : '1px solid rgba(255,255,255,.07)' }}>
                              <button onClick={() => setShowCalcIA(v => !v)}
                                className="w-full flex items-center gap-2.5 px-4 py-3 text-left"
                                style={{ background: showCalcIA ? 'rgba(217,70,239,.06)' : 'transparent' }}>
                                <span className="font-lato text-[13px] flex-1" style={{ color: 'rgba(217,70,239,.7)' }}>
                                  + Calcular consumo mensual por uso de IA
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 flex-shrink-0"
                                  style={{ color: 'rgba(217,70,239,.5)', transform: showCalcIA ? 'rotate(90deg)' : undefined }} />
                              </button>
                              {showCalcIA && (
                                <div className="px-4 pb-4 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                                  <div className="pt-3 space-y-3">
                                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                                      style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: CM_COLOR }} />
                                      <span className="font-lato text-white/50 text-[13px]">Valor IA por mensaje</span>
                                      <span className="font-poppins font-black ml-auto text-[13px]" style={{ color: CM_COLOR }}>USD 0.02</span>
                                    </div>
                                    <div>
                                      <div className="flex justify-between mb-1">
                                        <span className="font-lato text-white/35 text-[11px]">Mensajes promedio por conversación</span>
                                        <span className="font-poppins font-bold text-white text-[12px]">{mensajesConv}</span>
                                      </div>
                                      <input type="range" min={2} max={20} step={1}
                                        value={mensajesConv} onChange={e => setMensajesConv(Number(e.target.value))} className="w-full" />
                                    </div>
                                    <div>
                                      <div className="flex justify-between mb-1">
                                        <span className="font-lato text-white/35 text-[11px]">Conversaciones promedio por mes</span>
                                        <span className="font-poppins font-bold text-white text-[12px]">{convsMes}</span>
                                      </div>
                                      <input type="range" min={50} max={1000} step={25}
                                        value={convsMes} onChange={e => setConvsMes(Number(e.target.value))} className="w-full" />
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: 'rgba(217,70,239,.12)' }}>
                                      <div>
                                        <span className="font-lato text-white/40 text-[11px]">Consumo estimado</span>
                                        <p className="font-lato text-white/25 text-[10px] mt-0.5">USD 0.02 × {mensajesConv} msg × {convsMes} conv</p>
                                      </div>
                                      <span className="font-poppins font-bold text-[14px]" style={{ color: CM_COLOR }}>≈ USD {consumoIAUSD}/mes</span>
                                    </div>
                                    <p className="font-lato text-white/25 text-[10px] leading-relaxed">
                                      Estimación referencial. El consumo real varía según el volumen de conversaciones gestionadas por el agente IA.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Soporte y Operaciones — opcional */}
          <div className="rounded-xl overflow-hidden transition-all duration-300 mb-3"
            style={{ background: 'rgba(255,255,255,.03)', border: showSoporte ? '1px solid rgba(0,191,165,.4)' : '1px solid rgba(255,255,255,.08)' }}>
            <button onClick={() => setShowSoporte(!showSoporte)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: showSoporte ? 'rgba(0,191,165,.18)' : 'rgba(255,255,255,.05)' }}>
                <GraduationCap className="w-4 h-4" style={{ color: showSoporte ? '#00bfa5' : 'rgba(255,255,255,.35)' }} />
              </div>
              <div className="flex-1 flex flex-wrap items-center gap-2">
                <span className={`font-poppins font-bold text-[16px] ${showSoporte ? 'text-white' : 'text-white/65'}`}>
                  Soporte y Operaciones
                </span>
                <span className="font-lato text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.25)', color: '#00bfa5' }}>
                  Opcional
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="font-poppins font-black text-[15px] text-[#00bfa5]">
                    USD 150<span className="font-lato font-normal text-white/35 text-[12px]">/mes</span>
                  </p>
                  <p className="font-lato text-white/30 text-[11px]">5 horas · +USD 45/h adicional</p>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                  style={{ color: 'rgba(0,191,165,.6)', transform: showSoporte ? 'rotate(90deg)' : undefined }} />
              </div>
            </button>
            {showSoporte && (
              <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                <div className="pt-4 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-poppins font-black text-[1.5rem] text-[#00bfa5]">
                      USD 150<span className="font-lato font-normal text-white/40 text-[1rem]">/mes · 5 horas</span>
                    </p>
                    <span className="font-lato text-[12px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.25)', color: '#00bfa5' }}>
                      Horas adicionales: USD 45/h
                    </span>
                  </div>
                  <p className="font-lato text-white/45 text-[15px] leading-relaxed">
                    Acompañamiento mensual una vez activo el sistema. Cubre soporte para la plataforma, para el agente IA y cualquier tema relacionado con la prestación del servicio. Incluye también el levantamiento de oportunidades de mejora y la ejecución de configuraciones adicionales. Cada solicitud se registra con un desglose detallado del tiempo invertido.
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Soporte para la plataforma CRM, ChatCenter y módulo de Email Marketing',
                      'Ajustes y reentrenamiento del agente IA con información nueva o actualizada',
                      'Ejecución de configuraciones adicionales: automatizaciones, informes, campos, flujos',
                      'Adición de nuevas funcionalidades o integraciones según las necesidades de la clínica',
                      'Refuerzo en el uso de las herramientas para el equipo',
                      'Levantamiento y ejecución de oportunidades de mejora identificadas en la operación',
                      'Desglose detallado del tiempo invertido por cada solicitud atendida en el mes',
                      'Atención vía canal dedicado · SLA 4h días hábiles',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                        <span className="font-lato text-white/55 text-[14px]">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-xl p-4" style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.15)' }}>
                    <p className="font-poppins font-semibold text-white/65 text-[13px] uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Info className="w-3.5 h-3.5 text-[#00bfa5]" /> Ejemplo de reporte mensual de horas
                    </p>
                    <div className="space-y-1.5">
                      {[
                        { tarea: 'Ajuste de flujo de recordatorio de cita', tiempo: '0.5 h' },
                        { tarea: 'Actualización de FAQ del agente IA con 3 tratamientos nuevos', tiempo: '1.0 h' },
                        { tarea: 'Configuración de campaña de Email Marketing para promoción mensual', tiempo: '1.5 h' },
                        { tarea: 'Soporte al equipo en uso del ChatCenter', tiempo: '0.5 h' },
                        { tarea: 'Análisis de métricas y recomendaciones de mejora', tiempo: '0.5 h' },
                      ].map((r, i) => (
                        <div key={i} className="flex items-center justify-between gap-3">
                          <span className="font-lato text-white/50 text-[13px]">{r.tarea}</span>
                          <span className="font-poppins font-bold text-[#00bfa5] text-[13px] flex-shrink-0">{r.tiempo}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between gap-3 pt-2 border-t" style={{ borderColor: 'rgba(0,191,165,.15)' }}>
                        <span className="font-poppins font-semibold text-white/70 text-[13px]">Total del mes</span>
                        <span className="font-poppins font-black text-[#00bfa5] text-[14px]">4.0 / 5 h</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-lato text-white/30 text-[13px] leading-relaxed">
                    Las horas no utilizadas en el mes no son acumulables. El servicio puede contratarse o cancelarse con 15 días de anticipación.
                  </p>
                </div>
              </div>
            )}
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
          <SectionTitle>Vigencia y Términos de la Propuesta</SectionTitle>
          <Rule />

          <div className="space-y-3">
            {[
              { titulo: 'Aprobación', desc: 'Para aceptar esta propuesta y dar inicio al proyecto, se requiere confirmación vía WhatsApp, correo o verbal para habilitar el contrato a firmar y proceder con el inicio del trabajo.', icon: CheckCircle },
              { titulo: 'Términos de pago', desc: 'El CRM y el Agente IA se pagan de forma independiente, cada uno al inicio de su fase de implementación. La plataforma mensual (USD 240/mes) comienza a cobrarse una vez activo el sistema. El servicio opcional de Soporte y Operaciones se factura mensualmente.', icon: FileText },
              { titulo: 'Plataforma y usuarios', desc: 'El costo de plataforma (Plan Growth) de USD 360/mes incluye hasta 3 usuarios, 1 número de WhatsApp Business, módulo Email Marketing (hasta 5.000 correos/mes) y gestión de hasta 30 servicios en el calendario. Usuarios adicionales o números extra se cotizan según necesidad.', icon: Users },
              { titulo: 'Consumo de IA', desc: 'El consumo de mensajes procesados por el agente IA se cobra a USD 0,02 por mensaje y se factura según el consumo real del mes. La calculadora incluida en esta propuesta es una estimación referencial.', icon: Bot },
              { titulo: 'Costos de WhatsApp API', desc: 'Los mensajes enviados fuera de la ventana de 24h (recordatorios, campañas, seguimientos) son cobrados directamente por Meta/WhatsApp y se trasladan al cliente sin margen adicional.', icon: MessageSquare },
              { titulo: 'Modificaciones al alcance', desc: 'Cualquier solicitud de servicio, integración o funcionalidad no estipulada explícitamente en esta propuesta requerirá una cotización adicional y podrá afectar los tiempos de entrega.', icon: AlertCircle },
              { titulo: 'Inicio del proyecto', desc: 'El cronograma comienza desde la recepción del pago de la Fase 1 (CRM + ChatCenter) y la entrega de accesos e información necesaria por parte de Clínica Magnética.', icon: Zap },
              { titulo: 'Vigencia de la propuesta', desc: 'Esta propuesta tiene una vigencia de 30 días calendario desde su fecha de emisión (Junio 2026). Pasado este plazo, los valores podrán ser revisados según condiciones del mercado.', icon: Clock },
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
              style={{ background: `radial-gradient(circle at 50% 100%, rgba(217,70,239,.05), transparent 70%)` }} />
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

export default ClinicaMagneticaProposal;
