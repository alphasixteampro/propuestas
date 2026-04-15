import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap, BarChart3,
  AlertCircle, TrendingUp, Info, Globe, MapPin,
  Settings, Users, BellRing, LayoutDashboard, GraduationCap, Rocket,
  Link2, Layers,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'De Paseo por Colombia',
  razonSocial: 'De Paseo por Colombia SAS',
  tagline: 'Circuitos turísticos por Colombia',
  sector: 'Turismo receptivo · Agencia de viajes · Alojamiento',
  productos: 'Circuitos turísticos para extranjeros + Hotel Eje Cafetero',
  leadsPromedio: '20–50 leads/día',
  usuarios: 3,
  fecha: 'Abril 2026',
  herramienta: 'Sixteam.pro Core',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  contacto: 'Jose Alexander Zapata Romero',
  objetivo: 'Chat center omnicanal con agente IA + CRM comercial para centralizar la atención, automatizar seguimientos y escalar el canal digital',
};

const PASEO_GREEN = '#10b981';
const PRECIO_MENSUAL = 'COP 728.586';
const PRECIO_IMPLEMENTACION = 'COP 2.400.000';
const USD_ADICIONAL = 'USD 25';
const TRM_NUM = 3642.93;
const TRM = '3.642,93';
const IA_USD_POR_MSG = 0.02;

const HALLAZGOS = [
  {
    titulo: '20–50 leads/día que se pierden o no se responden',
    desc: 'La agencia recibe entre 20 y 50 leads diarios provenientes de Meta Ads, pero no hay infraestructura para atenderlos de inmediato. El costo de la pauta se pierde porque el lead se enfría antes de ser contactado.',
    icon: AlertCircle, tint: 'red',
  },
  {
    titulo: 'Sin chat center: tres personas en el mismo número sin orden',
    desc: 'Tres personas responden desde una sola línea vía WhatsApp Web de forma descoordinada. No hay una bandeja compartida, no hay asignación de conversaciones y la app se congela con el volumen. El equipo no escala así.',
    icon: TrendingUp, tint: 'amber',
  },
  {
    titulo: 'Sin seguimiento estructurado después del primer contacto',
    desc: 'Las cotizaciones enviadas quedan sin continuidad. Sin automatizaciones, el seguimiento depende de que el asesor recuerde a cada cliente — algo imposible a 50 leads/día. El lead se pierde sin que nadie lo note.',
    icon: FileText, tint: 'blue',
  },
  {
    titulo: 'Dos productos mezclados en un solo canal sin routing',
    desc: 'El hotel en el Eje Cafetero y los circuitos turísticos comparten el mismo número y el mismo flujo. Un lead del hotel puede recibir información de paquetes y viceversa, generando confusión y pérdida de conversión.',
    icon: BarChart3, tint: 'teal',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber: { text: 'text-amber-400',     bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)' },
  teal:  { text: 'text-[#00bfa5]',     bg: 'rgba(0,191,165,.07)',   border: 'rgba(0,191,165,.18)' },
  blue:  { text: 'text-[#10b981]',     bg: 'rgba(16,185,129,.07)',  border: 'rgba(16,185,129,.18)' },
  red:   { text: 'text-[#f87171]',     bg: 'rgba(221,51,51,.07)',   border: 'rgba(221,51,51,.2)' },
};

// ─── ETAPAS ──────────────────────────────────────────────────────────────────

const ETAPAS = [
  {
    num: '01',
    nombre: 'Diseño y Configuración',
    duracion: '1 semana',
    icon: FileText,
    color: PASEO_GREEN,
    colorAlpha: 'rgba(16,185,129,.12)',
    colorBorder: 'rgba(16,185,129,.3)',
    descripcion: 'Antes de activar un solo canal, nos sentamos con el equipo de De Paseo por Colombia a entender el proceso real de atención. Esta etapa define la arquitectura del chat center y todo lo que se va a construir.',
    actividades: [
      'Levantamiento de flujos de conversación para cada producto: circuitos turísticos vs. hotel Eje Cafetero',
      'Diseño del chat center omnicanal: cómo se distribuyen las conversaciones entre los 3 asesores, reglas de asignación y flujos de escalada',
      'Definición del objetivo del agente IA: qué responde, hasta dónde llega y cuándo transfiere a un asesor humano en el chat center',
      'Diseño del pipeline CRM: etapas del embudo, criterios de avance y asignación por asesor',
      'Decisión de estrategia del bot: nombre, tono y personalidad del agente (humanizado o identificado como asistente)',
      'Configuración inicial de la cuenta en Sixteam.pro Core (3 usuarios, permisos y roles)',
      'Entrega de documento de diseño funcional validado por el equipo antes de iniciar la implementación',
    ],
  },
  {
    num: '02',
    nombre: 'Implementación y Automatizaciones',
    duracion: '2 semanas',
    icon: Settings,
    color: '#1d70a2',
    colorAlpha: 'rgba(29,112,162,.10)',
    colorBorder: 'rgba(29,112,162,.3)',
    descripcion: 'Con el diseño aprobado, se construye todo el sistema: el chat center omnicanal donde los 3 asesores atienden desde una sola bandeja, el agente IA, los seguimientos automáticos y el CRM.',
    actividades: [
      'Activación del chat center omnicanal Sixteam.pro Core: bandeja unificada donde los 3 asesores se conectan a una sola línea para atender leads y clientes en tiempo real, con asignación y transferencia de conversaciones entre agentes',
      'Conexión de WhatsApp vía API oficial de Meta (WhatsApp Business API): integración robusta sin riesgo de bloqueo, como uno de los canales del chat center',
      'Integración de canales adicionales al chat center: Instagram Direct, Messenger y chat web — todos los leads llegan a una sola bandeja',
      'Construcción del agente IA con flujos diferenciados: circuitos turísticos y hotel Eje Cafetero con routing automático según origen del lead o contexto de conversación',
      'Configuración del CRM: base de contactos, pipeline comercial con etapas y gestión de oportunidades de venta',
      'Automatizaciones de seguimiento inteligente: mensajes a las 2h, 3h, 24h y 48h con contexto de la conversación del lead (no mensajes genéricos)',
      'Identificación de fuente de pauta: el sistema detecta de qué anuncio o campaña viene cada lead (cuando la privacidad del dispositivo lo permite)',
      'Pruebas de flujo completo con leads reales y ajustes antes de salida a producción',
    ],
  },
  {
    num: '03',
    nombre: 'Capacitación y Salida a Producción',
    duracion: '1 semana',
    icon: Rocket,
    color: '#f59e0b',
    colorAlpha: 'rgba(245,158,11,.10)',
    colorBorder: 'rgba(245,158,11,.3)',
    descripcion: 'El sistema está listo. Ahora lo encendemos junto con el equipo. Esta etapa garantiza que Jose y sus dos asesores lleguen al primer día de uso sin fricción y que las campañas de pauta se puedan lanzar con confianza.',
    actividades: [
      'Hasta 2 horas de capacitación en reuniones virtuales con los 3 usuarios: manejo del chat center, CRM, pipeline y gestión de leads',
      'Módulos cubiertos: bandeja omnicanal, gestión de conversaciones, CRM y oportunidades, seguimientos automáticos y métricas',
      'Grabación de todas las sesiones de capacitación entregadas al equipo para consulta posterior',
      'Guías de uso por módulo adquirido en formato digital (chat center, CRM, agente IA, métricas)',
      'Acompañamiento en las primeras campañas de pauta activas: validación del flujo IA → asesor en condiciones reales',
      'Identificación y corrección de ajustes que emerjan en la operación real del primer día',
      'Canal de soporte dedicado durante toda la semana de salida a producción',
    ],
  },
];

// ─── DESGLOSE PLATAFORMA ──────────────────────────────────────────────────────

const DESGLOSE_PLAT = [
  {
    categoria: 'Agente IA Conversacional',
    icon: Zap,
    color: PASEO_GREEN,
    items: [
      'Agente de inteligencia artificial entrenado con la información de De Paseo por Colombia (paquetes, hotel, precios generales, condiciones)',
      'Atención inicial 24/7: responde leads nuevos en segundos, sin intervención humana',
      'Flujos diferenciados por producto: el agente identifica si el lead es para circuitos turísticos o para el hotel y dirige la conversación en consecuencia',
      'Transferencia a asesor humano cuando el lead requiere cotización personalizada o cuando la situación supera el alcance del agente',
      'Nombre e identidad del agente personalizable: puede presentarse con nombre propio humanizado o como asistente de marca, según la estrategia definida con el equipo',
      'Gestión de conversaciones en ventana de servicio WhatsApp (24h orgánico / 72h desde pauta)',
    ],
  },
  {
    categoria: 'Chat Center Omnicanal + WhatsApp API Oficial',
    icon: Link2,
    color: '#00bfa5',
    items: [
      'Bandeja de entrada omnicanal (chat center): una sola vista donde los 3 asesores atienden y gestionan todas las conversaciones de todos los canales en simultáneo',
      'Asignación y transferencia de conversaciones entre asesores dentro del chat center: cada lead tiene un responsable claro',
      'WhatsApp integrado vía API oficial de Meta (WhatsApp Business API) como canal principal del chat center — 1 número (1 cuenta) conectado, sin WhatsApp Web, sin riesgo de bloqueo',
      'Instagram Direct, Messenger y chat web también conectados al chat center: todos los leads en una sola bandeja sin importar de dónde vienen',
      'Historial completo de cada conversación centralizado en la plataforma, accesible para todo el equipo',
      'Identificación de fuente publicitaria: el sistema registra de qué campaña o anuncio de Meta viene cada lead',
      'Envío de mensajes de seguimiento (plantillas aprobadas por Meta) cuando se vence la ventana de servicio de WhatsApp',
    ],
  },
  {
    categoria: 'CRM y Pipeline Comercial',
    icon: BarChart3,
    color: '#1d70a2',
    items: [
      'Base de contactos centralizada: cada lead que entra se convierte automáticamente en un contacto con historial de conversación',
      'Hasta 2 pipelines (embudos de venta) configurados: uno para Planes de Viaje y otro para Hotel Eje Cafetero, con etapas adaptadas al proceso de cada producto',
      'Etapas iniciales automatizadas (contacto iniciado, transferido a asesor, en seguimiento) y etapas manuales gestionadas por el equipo',
      'Gestión de oportunidades: cada lead cualificado se convierte en una oportunidad de venta visible para todo el equipo',
      'Hasta 15 propiedades personalizadas en objeto Contactos (ej. destino de interés, fecha de viaje, número de personas, canal de origen)',
      'Hasta 15 propiedades personalizadas en objeto Oportunidades (ej. producto de interés, valor cotizado, estado de la cotización, fuente de pauta)',
      'Hasta 6 automatizaciones de CRM configuradas (asignación de leads, cambios de etapa, alertas al asesor, tareas automáticas)',
      '3 usuarios incluidos: Jose + 2 asesores con acceso diferenciado según rol',
    ],
  },
  {
    categoria: 'Flujos de Seguimiento Automático',
    icon: BellRing,
    color: '#a78bfa',
    items: [
      'Hasta 2 flujos de seguimiento automático configurados e implementados:',
      'Flujo 1 — Atención Inicial de Leads: seguimiento automático cuando un lead nuevo deja de responder (mensajes a las 2h, 3h, 24h y 48h)',
      'Flujo 2 — Atención Post Cotización: seguimiento automático para leads que recibieron una cotización y no respondieron (recordatorios escalonados)',
      'Seguimientos contextuales con IA: cada mensaje tiene en cuenta lo que dijo el lead en la conversación — no mensajes genéricos',
      'Opción de mensajes fijos definidos por el equipo para mayor control sobre el tono y contenido',
      'Todos los mensajes de seguimiento fuera de ventana usan plantillas aprobadas por Meta (costo variable por mensaje según tarifas Meta Colombia)',
    ],
  },
  {
    categoria: 'Multi-Canal Unificado',
    icon: Globe,
    color: '#f59e0b',
    items: [
      'WhatsApp Business API (canal principal, leads de Meta Ads)',
      'Instagram Direct: mensajes de Instagram llegan a la misma bandeja centralizada',
      'Messenger (Facebook): leads de Facebook Ads o mensajes directos en una sola vista',
      'Chat web: widget embebible en la página web de la agencia para capturar leads directamente desde el sitio (en construcción)',
      'Bandeja unificada: un solo lugar donde el equipo ve y gestiona todos los leads sin importar de qué canal llegaron',
    ],
  },
  {
    categoria: 'Métricas y Gestión del Equipo',
    icon: LayoutDashboard,
    color: PASEO_GREEN,
    items: [
      'Hasta 8 informes personalizados de métricas configurados según las necesidades del equipo',
      'Panel de métricas: leads recibidos, atendidos, en seguimiento y cerrados por período',
      'Tasa de respuesta del agente IA y tasa de transferencia a asesor humano',
      'Tiempo promedio de primera respuesta y seguimientos enviados',
      'Visibilidad gerencial: Jose puede ver el estado de todos los leads y el desempeño del equipo en tiempo real',
      'Historial completo de cada cliente: conversación, etapa del pipeline, seguimientos enviados y acciones tomadas',
    ],
  },
];

const SECCIONES = [
  { id: 'resumen',    label: 'Resumen' },
  { id: 'objetivo',  label: 'Objetivo' },
  { id: 'plan',      label: 'Plan' },
  { id: 'alcance',   label: 'Plataforma' },
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

const DePaseoProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [etapaActiva, setEtapaActiva] = useState<number | null>(null);
  const [desgloseActivo, setDesgloseActivo] = useState<number | null>(null);
  const [msgPerConv, setMsgPerConv] = useState(6);
  const [leadsPerMonth, setLeadsPerMonth] = useState(600);
  const [showMetaTable, setShowMetaTable] = useState(false);

  const iaUSD = +(IA_USD_POR_MSG * msgPerConv * leadsPerMonth).toFixed(2);
  const iaCOP = Math.round(iaUSD * TRM_NUM);
  const fmtCOP = (n: number) => n.toLocaleString('es-CO', { minimumFractionDigits: 0 });

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
        style={{ background: 'linear-gradient(135deg, #04111f 0%, #071826 55%, #091f34 100%)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,.06) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(29,112,162,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        </div>

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
          input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#10b981;cursor:pointer;box-shadow:0 0 8px rgba(16,185,129,.6);border:2px solid #030d1a}
          input[type=range]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#10b981;cursor:pointer;box-shadow:0 0 8px rgba(16,185,129,.6);border:2px solid #030d1a}
        `}</style>

        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta de trabajo y cotización</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${PASEO_GREEN}, #1d70a2)` }}>
                  <MapPin className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(16,185,129,.10)', border: '1px solid rgba(16,185,129,.25)', color: PASEO_GREEN }}>
                  {META.tagline}
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}>
                Propuesta<br />
                <span style={{ background: 'linear-gradient(90deg,#10b981,#1d70a2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
                  { icon: MapPin, text: META.fecha },
                  { icon: Globe, text: META.sector },
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
                  {['1. Resumen ejecutivo','2. Objetivo general','3. Plan de trabajo','4. Plataforma Sixteam.pro','5. Inversión','6. Vigencia y términos'].map((item, i) => (
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
                  style={{ background: 'radial-gradient(circle, rgba(16,185,129,.10) 0%, rgba(29,112,162,.05) 50%, transparent 70%)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full" style={{ border: '1px solid rgba(16,185,129,.12)' }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(29,112,162,.15)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: PASEO_GREEN, boxShadow: `0 0 6px rgba(16,185,129,.8)` }} />
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
                  <div className="rounded-2xl flex items-center justify-center overflow-hidden px-3 py-2"
                    style={{ background: 'rgba(255,255,255,.92)', border: `1px solid ${PASEO_GREEN}33`, boxShadow: `0 4px 30px rgba(16,185,129,.20)` }}>
                    <img src="/depaseo-logo.webp" alt="De Paseo por Colombia" className="h-20 w-auto object-contain"
                      onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        t.style.display = 'none';
                        (t.nextSibling as HTMLElement)?.style?.removeProperty('display');
                      }} />
                    <MapPin className="w-12 h-12 hidden" style={{ color: PASEO_GREEN }} />
                  </div>
                  <div className="text-center">
                    <span className="font-poppins font-black text-white text-[20px] tracking-tight">De Paseo por Colombia</span>
                    <p className="font-lato text-[11px] uppercase tracking-[0.2em] mt-0.5" style={{ color: PASEO_GREEN }}>Circuitos turísticos · Hotel Eje Cafetero</p>
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

          {/* Card cliente */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="rounded-2xl flex items-center justify-center overflow-hidden px-2 py-1.5"
                style={{ background: 'rgba(255,255,255,.92)', boxShadow: `0 4px 20px rgba(16,185,129,.25)`, minWidth: 64 }}>
                <img src="/depaseo-logo.webp" alt="De Paseo por Colombia" className="h-12 w-auto object-contain"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.style.display = 'none';
                    (t.nextSibling as HTMLElement)?.style?.removeProperty('display');
                  }} />
                <MapPin className="w-7 h-7 hidden" style={{ color: PASEO_GREEN }} />
              </div>
              <span className="font-poppins font-black text-white text-[13px] tracking-tight text-center leading-tight max-w-[90px]">De Paseo por Colombia</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                <p className="font-poppins font-semibold text-white/80 text-[17px]">{META.sector}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Productos</p>
                <p className="font-lato text-white/60 text-[16px]">{META.productos}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Leads promedio / día</p>
                <p className="font-poppins font-bold text-white/80 text-[18px]">{META.leadsPromedio}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Canal actual</p>
                <p className="font-lato text-white/60 text-[16px]">WhatsApp Business Web · Meta Ads</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Plataforma propuesta</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: PASEO_GREEN }} />
                  <p className="font-poppins font-semibold text-[#10b981] text-[17px]">{META.herramienta}</p>
                </div>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Usuarios</p>
                <p className="font-lato text-white/60 text-[17px]">{META.usuarios} usuarios · Jose + 2 asesores</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              De Paseo por Colombia SAS es una agencia especializada en turismo receptivo: trae a viajeros del exterior a descubrir Colombia y también vende destinos nacionales a colombianos — Eje Cafetero, Boyacá, Antioquia, Santander. A eso se suma un hotel propio en el Eje Cafetero, operado bajo la misma marca.
            </p>
            <p>
              La empresa está lista para escalar sus campañas de pauta digital en Meta. El problema no es el presupuesto ni la creatividad — es lo que pasa <strong className="text-white/90 font-semibold">después de que el lead llega</strong>. Con <strong className="text-white/90 font-semibold">20 a 50 leads diarios</strong> entrando por WhatsApp y solo tres personas para atenderlos, la inversión publicitaria se convierte en pérdida: leads sin respuesta inmediata, sin seguimiento y sin trazabilidad.
            </p>
          </div>

          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> Hallazgos clave identificados
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HALLAZGOS.map((h, i) => {
                const Icon = h.icon; const t = TINT[h.tint];
                return (
                  <div key={i} className="rounded-xl p-4 flex gap-3" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                    <Icon className={`w-4 h-4 ${t.text} flex-shrink-0 mt-0.5`} />
                    <div>
                      <p className="font-poppins font-semibold text-white/90 text-[17px] mb-1">{h.titulo}</p>
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
              style={{ background: `radial-gradient(circle, rgba(16,185,129,.07), transparent 70%)`, transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 mb-4" style={{ color: PASEO_GREEN }} />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[23px] leading-relaxed">
              Implementar <strong className="text-white font-black">Sixteam.pro Core</strong> como la infraestructura de atención y seguimiento comercial de De Paseo por Colombia: activar un <em className="not-italic" style={{ color: PASEO_GREEN }}>chat center omnicanal</em> donde todos los asesores se conectan a una sola bandeja para atender leads desde WhatsApp, Instagram, Messenger y web — con WhatsApp integrado vía API oficial, un agente de inteligencia artificial que responde en segundos, seguimientos automáticos para que ningún cliente se enfríe, y un CRM con pipeline visible para que Jose tenga control total sin que el volumen desborde al equipo.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Leads / día',       value: '20–50', sub: 'promedio actual' },
              { label: 'Usuarios',          value: '3',     sub: 'Jose + 2 asesores' },
              { label: 'Productos',         value: '2',     sub: 'Circuitos + Hotel' },
              { label: 'Canales',           value: '4',     sub: 'WA · IG · FB · Web' },
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

        {/* ─ 03 PLAN ─ */}
        <section id="plan" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — Plan de trabajo</TagLabel>
          <SectionTitle>3 etapas · ~4 semanas</SectionTitle>
          <Rule />

          <div className="relative mb-10">
            <div className="hidden sm:block absolute left-[28px] top-10 bottom-10 w-px"
              style={{ background: `linear-gradient(to bottom, rgba(16,185,129,.4), rgba(29,112,162,.4), rgba(245,158,11,.4))` }} />

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
                          <span className={`font-poppins font-bold text-[18px] ${open ? 'text-white' : 'text-white/70'}`}>{et.nombre}</span>
                        </div>
                        <p className="font-lato text-white/40 text-[15px] mt-0.5">{et.descripcion.slice(0, 80)}…</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                        <div className="text-right hidden sm:block">
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: et.colorAlpha, border: `1px solid ${et.colorBorder}` }}>
                            <Clock className="w-3 h-3" style={{ color: et.color }} />
                            <span className="font-poppins font-bold text-[13px]" style={{ color: et.color }}>{et.duracion}</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`}
                          style={{ color: open ? et.color : 'rgba(255,255,255,.3)' }} />
                      </div>
                    </button>
                    {open && (
                      <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                        <div className="pt-4">
                          <p className="font-lato text-white/60 text-[17px] leading-relaxed mb-4">{et.descripcion}</p>
                          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Actividades</p>
                          <ul className="space-y-2">
                            {et.actividades.map((a, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: et.color }} />
                                <span className="font-lato text-white/65 text-[17px]">{a}</span>
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
          </div>

          <div className="rounded-xl p-4 flex gap-3"
            style={{ background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.2)' }}>
            <Rocket className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#f59e0b]" />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              La <strong className="text-white/80">Etapa 3</strong> (Capacitación y Salida a Producción) se ejecuta una vez completadas y probadas todas las configuraciones de la Etapa 2. El objetivo es que el primer día de campañas activas, el equipo ya opere con plena confianza sobre el sistema.
            </p>
          </div>
        </section>

        {/* ─ 04 ALCANCE PLATAFORMA ─ */}
        <section id="alcance" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Plataforma Sixteam.pro Core</TagLabel>
          <SectionTitle>Todo lo que incluye la plataforma</SectionTitle>
          <Rule />
          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Sixteam.pro Core es la plataforma propia de Sixteam que combina CRM comercial + agente IA conversacional en un solo sistema. Esto es lo que estará activo para De Paseo por Colombia.
          </p>

          <div className="space-y-2.5 mb-8">
            {DESGLOSE_PLAT.map((bloque, i) => {
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
                            <span className="font-lato text-white/65 text-[17px] leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Tabla resumen */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="px-5 py-3" style={{ background: 'rgba(255,255,255,.04)' }}>
              <p className="font-poppins font-semibold text-white/60 text-[13px] uppercase tracking-wider">Resumen de entregables</p>
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
              {[
                ['Agente IA',                '1 agente con atención a ambos productos: planes de viaje y Hotel'],
                ['Chat center omnicanal',    'Bandeja única · 3 asesores conectados en simultáneo'],
                ['Canal WhatsApp',           'WhatsApp Business API · 1 número (1 cuenta)'],
                ['Canales adicionales',      'Instagram · Messenger · Chat web'],
                ['Usuarios incluidos',       '3 usuarios (Jose + 2 asesores)'],
                ['Pipelines CRM',             'Hasta 2 (Planes de Viaje + Hotel) · 15 prop. contactos · 15 prop. oportunidades'],
                ['Automatizaciones CRM',     'Hasta 6 automatizaciones (asignación, alertas, tareas)'],
                ['Flujos de seguimiento',    '2 flujos: Atención Inicial de Leads + Atención Post Cotización'],
                ['Routing de productos',     'Planes de viaje y Hotel identificados automáticamente'],
                ['Panel de métricas',        'Hasta 8 informes personalizados · leads · conversión · actividad'],
                ['Capacitación',             'Hasta 2h virtuales · grabaciones · guías por módulo'],
              ].map(([label, value], i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center px-5 py-3 gap-1 sm:gap-0">
                  <span className="font-poppins font-semibold text-white/70 text-[15px] sm:w-2/5">{label}</span>
                  <span className="font-lato text-white/45 text-[15px]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─ 05 INVERSIÓN ─ */}
        <section id="inversion" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Inversión</TagLabel>
          <SectionTitle>Modelo de inversión</SectionTitle>
          <Rule />
          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            La inversión tiene dos componentes: una <strong className="text-white/75">implementación inicial única</strong> y una <strong className="text-white/75">suscripción mensual</strong> a la plataforma. Valores en pesos colombianos (COP) calculados a TRM de{' '}
            <strong className="text-white/75">$ {TRM} COP/USD</strong>. <strong className="text-white/75">Precios sin IVA.</strong>
          </p>

          {/* Dos cards principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* Implementación */}
            <div className="rounded-2xl p-6 sm:p-7 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(16,185,129,.08) 0%, rgba(29,112,162,.08) 100%)', border: `1px solid rgba(16,185,129,.3)` }}>
              <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
                style={{ background: `radial-gradient(circle, rgba(16,185,129,.06), transparent 70%)`, transform: 'translate(20%,-20%)' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="w-4 h-4" style={{ color: PASEO_GREEN }} />
                  <p className="font-lato text-white/50 text-[13px] uppercase tracking-widest">Implementación</p>
                </div>
                <p className="font-poppins font-black text-white leading-none mb-1" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)' }}>
                  {PRECIO_IMPLEMENTACION}
                </p>
                <p className="font-lato text-white/35 text-[14px] mb-4">Pago único · Al inicio del proyecto</p>
                <ul className="space-y-1.5">
                  {[
                    'Diseño funcional del agente IA',
                    'Conexión WhatsApp Business API',
                    'Configuración CRM y pipeline',
                    'Automatizaciones de seguimiento',
                    'Integración multi-canal',
                    'Capacitación del equipo',
                    'Salida a producción acompañada',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: PASEO_GREEN }} />
                      <span className="font-lato text-white/55 text-[14px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Suscripción mensual */}
            <div className="rounded-2xl p-6 sm:p-7 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(29,112,162,.08) 0%, rgba(0,191,165,.08) 100%)', border: '1px solid rgba(0,191,165,.3)' }}>
              <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(0,191,165,.06), transparent 70%)', transform: 'translate(20%,-20%)' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-4 h-4 text-[#00bfa5]" />
                  <p className="font-lato text-white/50 text-[13px] uppercase tracking-widest">Plataforma mensual</p>
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <p className="font-poppins font-black text-white leading-none" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)' }}>
                    {PRECIO_MENSUAL}
                  </p>
                  <span className="font-lato text-white/40 text-[16px] mb-1">/mes</span>
                </div>
                <p className="font-lato text-white/35 text-[14px] mb-1">Sixteam.pro Core · 3 usuarios · CRM + Agente IA</p>
                <p className="font-lato text-[12px] px-2 py-0.5 rounded-full self-start mb-4 inline-flex items-center gap-1"
                  style={{ background: 'rgba(0,191,165,.1)', color: '#00bfa5', border: '1px solid rgba(0,191,165,.25)' }}>
                  Facturación mes anticipado
                </p>
                <ul className="space-y-1.5">
                  {[
                    'Acceso completo a CRM y pipeline',
                    'Agente IA activo 24/7',
                    'WhatsApp API + multi-canal',
                    'Seguimientos automáticos',
                    'Soporte técnico incluido',
                    'Actualizaciones de plataforma',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 flex-shrink-0 text-[#00bfa5]" />
                      <span className="font-lato text-white/55 text-[14px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Nota usuarios adicionales */}
          <div className="rounded-xl p-4 mb-4 flex gap-3"
            style={{ background: 'rgba(29,112,162,.06)', border: '1px solid rgba(29,112,162,.2)' }}>
            <Users className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#60b4f0]" />
            <p className="font-lato text-white/55 text-[15px] leading-relaxed">
              <strong className="text-white/75">Usuarios adicionales:</strong> el plan base incluye 3 usuarios. Cada usuario adicional tiene un costo de <strong className="text-white/75">{USD_ADICIONAL}/mes</strong> ({`COP ${fmtCOP(Math.round(25 * TRM_NUM))}`} aprox. a TRM actual).
            </p>
          </div>

          {/* Costos variables */}
          <div className="rounded-xl p-5 mb-4"
            style={{ background: 'rgba(245,158,11,.05)', border: '1px solid rgba(245,158,11,.2)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-[#f59e0b] flex-shrink-0" />
              <p className="font-poppins font-semibold text-white/80 text-[17px]">Costos variables adicionales</p>
            </div>
            <div className="space-y-3">
              {/* Mensajes plantilla Meta — bloque expandible */}
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 bg-[#f59e0b]" />
                <div className="flex-1">
                  <p className="font-lato text-white/55 text-[15px] leading-relaxed mb-2">
                    <strong className="text-white/75">Mensajes plantilla WhatsApp (Meta):</strong> cada mensaje enviado fuera de la ventana de servicio de 24 h tiene un costo directo de Meta — <strong className="text-white/75">no es un cobro de Sixteam.pro</strong>. La tarifa varía según el país del número destinatario y el tipo de plantilla (Marketing o Utility).{' '}
                    <span className="font-lato text-[13px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,.12)', color: '#f59e0b' }}>Facturado mes vencido · según consumo real</span>
                  </p>

                  {/* Highlight Colombia */}
                  <div className="flex flex-wrap gap-3 mb-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{ background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.2)' }}>
                      <span className="font-poppins font-semibold text-white/80 text-[13px]">🇨🇴 Colombia</span>
                      <span className="font-lato text-white/45 text-[12px]">Marketing</span>
                      <span className="font-poppins font-bold text-[13px]" style={{ color: PASEO_GREEN }}>USD 0.0131</span>
                      <span className="font-lato text-white/30 text-[11px]">|</span>
                      <span className="font-lato text-white/45 text-[12px]">Utility</span>
                      <span className="font-poppins font-bold text-[13px]" style={{ color: PASEO_GREEN }}>USD 0.0008</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                      <span className="font-lato text-white/40 text-[12px]">Service (atención)</span>
                      <span className="font-poppins font-bold text-[#00bfa5] text-[13px]">FREE</span>
                    </div>
                  </div>

                  {/* Botón expandir tabla */}
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
                      {/* Header tabla */}
                      <div className="grid grid-cols-4 px-3 py-2 text-[11px] font-poppins font-semibold uppercase tracking-wider text-white/30"
                        style={{ background: 'rgba(245,158,11,.06)', borderBottom: '1px solid rgba(245,158,11,.15)' }}>
                        <span>País / Mercado</span>
                        <span className="text-right">Marketing (USD)</span>
                        <span className="text-right">Utility (USD)</span>
                        <span className="text-right">Service</span>
                      </div>
                      {/* Filas */}
                      <div className="divide-y max-h-72 overflow-y-auto" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
                        {[
                          ['🇦🇷 Argentina',                    '0.0649','0.0273'],
                          ['🇧🇷 Brazil',                       '0.0656','0.0071'],
                          ['🇨🇱 Chile',                        '0.0933','0.0210'],
                          ['🇨🇴 Colombia',                     '0.0131','0.0008'],
                          ['🇪🇬 Egypt',                        '0.0676','0.0038'],
                          ['🇫🇷 France',                       '0.0902','0.0315'],
                          ['🇩🇪 Germany',                      '0.1433','0.0578'],
                          ['🇮🇳 India',                        '0.0124','0.0015'],
                          ['🇮🇩 Indonesia',                    '0.0432','0.0263'],
                          ['🇮🇱 Israel',                       '0.0371','0.0056'],
                          ['🇮🇹 Italy',                        '0.0726','0.0315'],
                          ['🇲🇾 Malaysia',                     '0.0903','0.0147'],
                          ['🇲🇽 Mexico',                       '0.0320','0.0089'],
                          ['🇳🇱 Netherlands',                  '0.1677','0.0525'],
                          ['🇳🇬 Nigeria',                      '0.0542','0.0070'],
                          ['🇵🇰 Pakistan',                     '0.0497','0.0057'],
                          ['🇵🇪 Peru',                         '0.0738','0.0210'],
                          ['🇷🇺 Russia',                       '0.0842','0.0420'],
                          ['🇸🇦 Saudi Arabia',                 '0.0478','0.0112'],
                          ['🇿🇦 South Africa',                 '0.0398','0.0080'],
                          ['🇪🇸 Spain',                        '0.0646','0.0210'],
                          ['🇹🇷 Turkey',                       '0.0114','0.0056'],
                          ['🇦🇪 United Arab Emirates',         '0.0524','0.0165'],
                          ['🇬🇧 United Kingdom',               '0.0555','0.0231'],
                          ['🌎 North America',                  '0.0263','0.0036'],
                          ['🌍 Rest of Africa',                 '0.0236','0.0042'],
                          ['🌏 Rest of Asia Pacific',           '0.0769','0.0119'],
                          ['🌍 Rest of C. & E. Europe',         '0.0903','0.0223'],
                          ['🌎 Rest of Latin America',          '0.0777','0.0119'],
                          ['🌍 Rest of Middle East',            '0.0358','0.0096'],
                          ['🌍 Rest of Western Europe',         '0.0622','0.0180'],
                          ['🌐 Other',                          '0.0634','0.0081'],
                        ].map(([market, marketing, utility], i) => (
                          <div key={i}
                            className="grid grid-cols-4 px-3 py-2 items-center"
                            style={{ background: market.includes('Colombia') ? 'rgba(16,185,129,.06)' : i % 2 === 0 ? 'rgba(255,255,255,.015)' : 'transparent' }}>
                            <span className={`font-lato text-[13px] ${market.includes('Colombia') ? 'text-white/90 font-semibold' : 'text-white/60'}`}>{market}</span>
                            <span className={`font-poppins font-semibold text-[13px] text-right ${market.includes('Colombia') ? '' : 'text-white/55'}`}
                              style={{ color: market.includes('Colombia') ? PASEO_GREEN : undefined }}>{marketing}</span>
                            <span className={`font-poppins font-semibold text-[13px] text-right ${market.includes('Colombia') ? '' : 'text-white/55'}`}
                              style={{ color: market.includes('Colombia') ? PASEO_GREEN : undefined }}>{utility}</span>
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
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 bg-[#f59e0b]" />
                <p className="font-lato text-white/55 text-[15px] leading-relaxed">
                  <strong className="text-white/75">Consumo de IA:</strong> costo variable según el volumen de conversaciones. Se factura y cobra mes vencido sobre el consumo efectivo del período.{' '}
                  <span className="font-lato text-[13px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,.12)', color: '#f59e0b' }}>Facturado mes vencido · según consumo real</span>
                  {' '}Usa la calculadora a continuación para estimar tu costo mensual.
                </p>
              </div>
            </div>
          </div>

          {/* ── CALCULADORA IA ── */}
          <div className="rounded-2xl overflow-hidden mb-8"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(16,185,129,.2)' }}>
            {/* Header */}
            <div className="px-5 py-4 flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, rgba(16,185,129,.10), rgba(29,112,162,.08))', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
              <Zap className="w-4 h-4" style={{ color: PASEO_GREEN }} />
              <p className="font-poppins font-semibold text-white/80 text-[15px] uppercase tracking-wider">Calculadora de consumo mensual IA</p>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              {/* Parámetro fijo */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PASEO_GREEN }} />
                <span className="font-lato text-white/50 text-[14px]">Valor IA por mensaje</span>
                <span className="font-poppins font-black ml-auto" style={{ color: PASEO_GREEN }}>USD {IA_USD_POR_MSG}</span>
              </div>

              {/* Slider 1 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-lato text-white/60 text-[15px]">Mensajes promedio por conversación</span>
                  <span className="font-poppins font-black text-white text-[20px]">{msgPerConv}</span>
                </div>
                <div className="relative">
                  <input type="range" min={1} max={15} step={1} value={msgPerConv}
                    onChange={(e) => setMsgPerConv(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right, ${PASEO_GREEN} ${((msgPerConv - 1) / 14) * 100}%, rgba(255,255,255,.12) ${((msgPerConv - 1) / 14) * 100}%)` }} />
                  {/* Marcador promedio en posición 6 */}
                  <div className="absolute -top-5 flex flex-col items-center pointer-events-none"
                    style={{ left: `calc(${((6 - 1) / 14) * 100}% - 18px)` }}>
                    <span className="font-lato text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap"
                      style={{ background: 'rgba(16,185,129,.15)', color: PASEO_GREEN, border: '1px solid rgba(16,185,129,.3)' }}>
                      prom. 6
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-lato text-white/25 text-[12px]">1</span>
                  <span className="font-lato text-white/25 text-[12px]">15</span>
                </div>
              </div>

              {/* Slider 2 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-lato text-white/60 text-[15px]">Leads promedio por mes</span>
                  <span className="font-poppins font-black text-white text-[20px]">{leadsPerMonth.toLocaleString('es-CO')}</span>
                </div>
                <input type="range" min={100} max={3000} step={50} value={leadsPerMonth}
                  onChange={(e) => setLeadsPerMonth(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, ${PASEO_GREEN} ${((leadsPerMonth - 100) / 2900) * 100}%, rgba(255,255,255,.12) ${((leadsPerMonth - 100) / 2900) * 100}%)` }} />
                <div className="flex justify-between mt-1">
                  <span className="font-lato text-white/25 text-[12px]">100</span>
                  <span className="font-lato text-white/25 text-[12px]">3.000</span>
                </div>
              </div>

              {/* Fórmula */}
              <div className="rounded-xl px-4 py-3 flex flex-wrap items-center gap-2 text-[14px]"
                style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                <span className="font-lato text-white/40">USD {IA_USD_POR_MSG}</span>
                <span className="text-white/25">×</span>
                <span className="font-lato text-white/40">{msgPerConv} msg/conv</span>
                <span className="text-white/25">×</span>
                <span className="font-lato text-white/40">{leadsPerMonth.toLocaleString('es-CO')} leads</span>
                <span className="text-white/25">=</span>
                <span className="font-poppins font-bold text-white/70">USD {iaUSD.toFixed(2)}</span>
              </div>

              {/* Resultado */}
              <div className="rounded-xl p-5 text-center"
                style={{ background: 'linear-gradient(135deg, rgba(16,185,129,.10), rgba(29,112,162,.08))', border: `1px solid rgba(16,185,129,.3)` }}>
                <p className="font-lato text-white/40 text-[13px] uppercase tracking-widest mb-1">Consumo estimado de IA / mes</p>
                <p className="font-poppins font-black text-white mb-1" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}>
                  USD {iaUSD.toFixed(2)}
                </p>
                <p className="font-poppins font-bold mb-3" style={{ color: PASEO_GREEN, fontSize: '1.1rem' }}>
                  ≈ COP {fmtCOP(iaCOP)}
                </p>
                <p className="font-lato text-white/30 text-[12px]">
                  Estimado · TRM $ {TRM} COP/USD · El costo real depende del consumo efectivo de tokens por conversación
                </p>
              </div>
            </div>
          </div>

          {/* Soporte post-implementación */}
          <div>
            <TagLabel>Servicio opcional recurrente — post-implementación</TagLabel>
            <Rule />
            <div className="rounded-xl p-5 flex flex-col gap-4"
              style={{ background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.22)' }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16,185,129,.15)' }}>
                  <Zap className="w-4 h-4" style={{ color: PASEO_GREEN }} />
                </div>
                <div>
                  <p className="font-poppins font-bold text-white/85 text-[18px]">Soporte y operaciones continuas</p>
                  <p className="font-lato text-white/40 text-[13px] mt-0.5">Mensual · Hasta 5 horas no acumulables</p>
                </div>
              </div>
              <p className="font-poppins font-black text-white text-[25px] leading-none">
                Desde COP 500.000
                <span className="font-lato font-normal text-white/40 text-[16px] ml-2">/mes</span>
              </p>
              <ul className="space-y-1.5">
                {[
                  'Ajustes y mejoras en flujos del agente IA según evolución del negocio',
                  'Nuevos seguimientos, automatizaciones y vistas del CRM',
                  'Soporte funcional al equipo en el uso de la plataforma',
                  'Tickets de soporte vía WhatsApp · SLA 4h L–V',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 flex-shrink-0 mt-[3px]" style={{ color: PASEO_GREEN }} />
                    <span className="font-lato text-white/55 text-[15px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ─ 06 VIGENCIA ─ */}
        <section id="vigencia" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 — Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y Términos de la Propuesta</SectionTitle>
          <Rule />

          <div className="space-y-4 mb-10">
            {[
              { titulo: 'Vigencia de la propuesta', desc: 'Esta propuesta es válida por 30 días calendario a partir de la fecha de emisión. Pasado ese plazo, los precios y condiciones podrían estar sujetos a revisión según variaciones en la TRM o en los planes de la plataforma.' },
              { titulo: 'Inicio del proyecto', desc: 'El proyecto inicia una vez se firme el contrato de servicios y se realice el pago de la implementación. La fecha de inicio se acuerda en conjunto con el equipo de De Paseo por Colombia.' },
              { titulo: 'Suscripción mensual', desc: 'La suscripción a Sixteam.pro Core se factura y cobra mes anticipado a partir del primer mes de operación activa. El primer período de facturación inicia al completar la Etapa 3 (Salida a Producción). El consumo de IA y las plantillas de mensajes automáticos se facturan y cobran mes vencido, según el consumo real determinado al cierre de cada período.' },
              { titulo: 'Propiedad del número de WhatsApp', desc: 'El número de WhatsApp pertenece a De Paseo por Colombia SAS. En caso de terminar la relación comercial, Sixteam.pro acompaña el proceso de desvinculación de la API para que el número pueda operar de forma independiente.' },
              { titulo: 'Confidencialidad', desc: 'Toda la información compartida por De Paseo por Colombia en el marco de este proyecto es tratada con estricta confidencialidad y no será divulgada a terceros sin autorización expresa.' },
            ].map((item, i) => (
              <div key={i} className="rounded-xl p-5"
                style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.06)' }}>
                <p className="font-poppins font-semibold text-white/80 text-[17px] mb-2">{item.titulo}</p>
                <p className="font-lato text-white/50 text-[16px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Footer firma */}
          <div className="rounded-2xl p-6 sm:p-8"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-widest mb-3">Elaborado por</p>
                <p className="font-poppins font-black text-white text-[18px]">{META.proponente}</p>
                <p className="font-lato text-white/45 text-[15px] mt-1">NIT {META.nit}</p>
                <p className="font-lato text-white/45 text-[15px]">{META.correo}</p>
                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                  <p className="font-lato text-white/30 text-[13px] uppercase tracking-wider mb-1">Representante legal</p>
                  <p className="font-poppins font-semibold text-white/70 text-[16px]">{META.rl}</p>
                </div>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-widest mb-3">Dirigido a</p>
                <p className="font-poppins font-black text-white text-[18px]">{META.razonSocial}</p>
                <p className="font-lato text-white/45 text-[15px] mt-1">{META.contacto}</p>
                <p className="font-lato text-white/45 text-[15px]">{META.sector}</p>
                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                  <p className="font-lato text-white/30 text-[13px] uppercase tracking-wider mb-1">Fecha de emisión</p>
                  <p className="font-poppins font-semibold text-white/70 text-[16px]">{META.fecha}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default DePaseoProposal;
