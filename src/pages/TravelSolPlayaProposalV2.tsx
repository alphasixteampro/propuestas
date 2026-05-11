import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, ChevronRight, FileText, Target, Zap, BarChart3,
  MessageSquare, AlertCircle, TrendingUp, Mail, ArrowRight, Building2,
  Calendar, Hash, User, Info, Globe, MapPin, Plane,
  Database, Inbox, Settings, Users, BookOpen, Layers,
} from 'lucide-react';
import LogoCarousel from '../components/LogoCarousel';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const ACCENT  = '#06b6d4';
const ACCENT2 = '#0891b2';

const META = {
  cliente:    'Travel Sol y Playa SAS',
  contacto:   'Mónica Vargas',
  cargo:      'Gerente General',
  sector:     'Agencia de Viajes · Turismo',
  sede:       'Barranquilla, Colombia',
  fecha:      'Mayo 2026',
  lugar:      'Barranquilla, Colombia',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit:        '901.967.849-4',
  correo:     'alpha@sixteam.pro',
  rl:         'Samuel Armando Burgos Ferrer',
  objetivo:   'Generar leads calificados con pauta digital desde el primer mes y, con ese flujo de caja, apalancar la inversión en la tecnología que convierte esos leads en ventas cerradas.',
};

const HALLAZGOS = [
  {
    titulo: 'Tres líneas WhatsApp sin supervisión central',
    desc: 'La agencia opera con tres números activos incluyendo uno personal. Sin una bandeja centralizada, conversaciones se pierden, los historiales están fragmentados y no hay trazabilidad entre asesores.',
    icon: MessageSquare,
    tint: 'red',
  },
  {
    titulo: 'HubSpot contratado, sin operar',
    desc: 'Existe una inversión activa en HubSpot que no está generando valor. Las herramientas disponibles funcionan como islas tecnológicas sin integración, lo que multiplica el esfuerzo manual del equipo.',
    icon: Database,
    tint: 'amber',
  },
  {
    titulo: 'Proceso de venta sin protocolo replicable',
    desc: 'Todo el conocimiento operativo reside en la gerencia. Los asesores deben consultar cada situación y, sin documentación, incorporar personal nuevo equivale a replicar el caos en lugar de ordenar la operación.',
    icon: BookOpen,
    tint: 'blue',
  },
  {
    titulo: 'Sin métricas ni seguimiento automático',
    desc: 'No hay registro de consultas recibidas, tasa de cierre ni ticket promedio. El seguimiento depende de la memoria de cada persona, con un estimado del 30–40% de leads sin respuesta oportuna.',
    icon: AlertCircle,
    tint: 'red',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber: { text: 'text-amber-400',    bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)' },
  blue:  { text: 'text-[#60a5fa]',    bg: 'rgba(96,165,250,.07)',  border: 'rgba(96,165,250,.18)' },
  red:   { text: 'text-[#f87171]',    bg: 'rgba(221,51,51,.07)',   border: 'rgba(221,51,51,.2)'   },
  teal:  { text: 'text-[#00bfa5]',    bg: 'rgba(0,191,165,.07)',   border: 'rgba(0,191,165,.18)'  },
};

const FASES = [
  {
    num: 'Fase 1',
    nombre: 'Contextualización y levantamiento de información',
    duracion: 'Mayo · Semana 1',
    icon: FileText,
    recomendada: true,
    entregables: [
      'Sesión de levantamiento con Mónica para mapear el proceso de venta de principio a fin, con una duración máxima de 2 horas',
      'Mapa documentado del flujo de atención actual, desde que llega la primera consulta hasta que el cliente recibe sus documentos de viaje',
      'Inventario completo de los canales activos, las herramientas en uso y el estado actual de la base de clientes',
      'Definición conjunta de las etapas del pipeline, los campos necesarios en el CRM y los roles de cada persona del equipo',
      'Checklist técnico con los accesos e integraciones requeridas para que la implementación del ChatCenter arranque sin demoras',
    ],
    detalle: [
      'Reunión de contexto con Mónica y el equipo disponible para entender cómo funciona hoy la operación: cómo llega una consulta, quién responde, cómo se cotiza y qué pasa después de que el cliente dice que sí.',
      'Se documenta el proceso tal como existe hoy, sin modificarlo aún, de manera que podamos identificar con precisión qué ordenar, qué automatizar y qué eliminar antes de tocar la plataforma.',
      'Se define de manera conjunta la estructura del CRM, incluyendo hasta 15 campos personalizados, 2 tarjetas de contacto y los criterios de avance entre etapas del pipeline.',
      'Al finalizar la semana, el equipo recibe el checklist de accesos e información necesaria para que todo esté listo antes de que empiece la configuración.',
    ],
  },
  {
    num: 'Fase 2',
    nombre: 'Implementación ChatCenter con IA',
    duracion: 'Mayo · Semanas 2–4',
    icon: MessageSquare,
    recomendada: false,
    entregables: [
      'Bandeja omnicanal activa con WhatsApp Business, Instagram y Facebook integrados en un solo inbox centralizado',
      'Asistente de IA configurado para atender, filtrar y perfilar cada lead antes de pasarlo al asesor, sin perder ninguna consulta',
      '3 usuarios operativos activos con sus roles, vistas y accesos configurados según su función',
      'Respuestas automáticas fuera de horario activas desde el primer día de operación',
      'Historial completo de cada conversación visible para todo el equipo en tiempo real',
    ],
    detalle: [
      'Se conectan WhatsApp Business, Instagram y Facebook a la bandeja omnicanal, de modo que cada conversación quede centralizada con su historial completo y sea accesible para cualquier asesor en tiempo real.',
      'Se configura el asistente de IA para que atienda la consulta inicial, identifique el tipo de viaje, destino y fechas de interés, y perfile al lead antes de asignarlo al asesor correspondiente.',
      'Se activan las respuestas automáticas fuera de horario para que ninguna consulta llegada por la noche o el fin de semana quede sin respuesta inmediata.',
      'Al cierre de mayo el ChatCenter opera en producción, capturando y filtrando los leads que la pauta digital ya está generando desde el primer mes.',
    ],
  },
  {
    num: 'Fase 3',
    nombre: 'Implementación CRM y automatizaciones',
    duracion: 'Junio',
    icon: Database,
    recomendada: false,
    entregables: [
      'CRM configurado con hasta 15 campos personalizados, 2 tarjetas de contacto y 1 pipeline con etapas adaptadas al flujo real de la agencia',
      'Base de clientes de los últimos 6 meses importada, deduplicada y estructurada dentro de la plataforma',
      'Hasta 5 automatizaciones activas para seguimiento a las 24 horas, los 3 días y los 7 días, más asignación automática entre asesores',
      'Hasta 3 Smart Lists dinámicas segmentadas por tipo de viajero o destino',
      'Hasta 5 informes del panel de KPIs configurados y listos para lectura semanal',
    ],
    detalle: [
      'El modelo de datos del CRM se construye a partir de lo definido en la Fase 1, de manera que los campos, el pipeline y las etapas reflejen exactamente cómo trabaja la agencia.',
      'Se importa, deduplica y limpia la base de clientes para que los contactos dejen de vivir solo en WhatsApp y queden organizados dentro de la plataforma.',
      'Se configuran hasta 5 automatizaciones críticas, de modo que el seguimiento, la asignación entre asesores y las respuestas fuera de horario ocurran de forma automática sin depender de que alguien lo recuerde.',
      'Se crean hasta 3 Smart Lists dinámicas por destino o perfil de viajero y se configuran hasta 5 informes para el panel semanal, para que las decisiones se tomen con datos reales.',
    ],
  },
  {
    num: 'Fase 4',
    nombre: 'Capacitación, puesta en marcha y entrega',
    duracion: 'Julio',
    icon: BarChart3,
    recomendada: false,
    entregables: [
      'Sesión de capacitación funcional con el equipo completo, con una duración de hasta 3 horas',
      'Pruebas de calidad de todos los flujos y automatizaciones con escenarios reales de la agencia, antes de la entrega',
      'Manual operativo documentado en la plataforma para que cualquier asesor nuevo sepa desde el primer día cómo cotizar, responder y dar seguimiento',
      'Reunión de entrega formal con validación final de flujos, accesos y automatizaciones',
      'Hoja de ruta de siguientes pasos con acciones inmediatas y la ruta hacia CRM Growth cuando la agencia esté lista',
    ],
    detalle: [
      'Sesión práctica de hasta 3 horas con Mónica y los asesores, orientada al uso diario del inbox unificado, la gestión del pipeline, la lectura de los reportes y el manejo de las automatizaciones.',
      'Se prueban en vivo todos los flujos configurados con casos reales de la agencia, de manera que el equipo entre en producción con la certeza de que todo funciona correctamente.',
      'El proceso operativo queda documentado directamente en la plataforma, de modo que un asesor nuevo pueda entender cómo funciona la agencia sin necesidad de preguntarle a Mónica.',
      'Al cierre de julio la plataforma opera en plena capacidad: el ChatCenter filtra leads desde mayo, el CRM los convierte y el equipo tiene métricas reales para decidir qué escalar en agosto.',
    ],
  },
];

const INVESTMENT_DATA = {
  meses: ['Mayo', 'Junio', 'Julio', 'Agosto'],
  filas: [
    {
      servicio: 'Pauta Digital',
      tipo: 'Mensual',
      icon: TrendingUp,
      desc: '$600.000/mes de gestión + 10% del valor de inversión mensual en publicidad gestionada. Campañas activas en Meta Ads y Google Ads con cada lead entrando directamente al pipeline del CRM.',
      valores:    [600000, 600000, 600000, 600000],
      oldValores: [0,      0,      0,      0],
    },
    {
      servicio: 'Implementación ChatCenter con IA',
      tipo: 'Pago único · Mayo',
      icon: MessageSquare,
      desc: 'Configuración del asistente conversacional con IA en WhatsApp, Instagram y Facebook. Atiende, filtra y perfila el lead antes de pasarlo al asesor, sin perder ninguna consulta.',
      valores:    [700000, 0, 0, 0],
      oldValores: [800000, 0, 0, 0],
    },
    {
      servicio: 'Implementación CRM',
      tipo: 'Pago en 2 cuotas',
      icon: Database,
      desc: 'Bandeja omnicanal, pipeline configurado, automatizaciones de seguimiento, capacitación del equipo y documentación operativa. Dividido en dos cuotas mientras la pauta genera resultados.',
      valores:    [0, 900000,  900000,  0],
      oldValores: [0, 1000000, 1000000, 0],
    },
    {
      servicio: 'Mensualidad Plataforma',
      tipo: 'Mensual',
      icon: Settings,
      desc: 'Licencia mensual del CRM Sixteam.pro Core con 3 usuarios incluidos y soporte técnico. A partir de agosto incorpora funcionalidades ampliadas del plan Growth.',
      valores:    [650000, 650000, 650000, 850000],
      oldValores: [850000, 850000, 850000, 0],
    },
  ],
  totales: [1950000, 2150000, 2150000, 1450000],
};

const SECCIONES = [
  { id: 'resumen',       label: 'Resumen'        },
  { id: 'objetivo',      label: 'Propuesta'       },
  { id: 'plan',          label: 'Plan de trabajo' },
  { id: 'cotizacion',    label: 'Inversión'       },
  { id: 'recomendacion', label: 'Recomendación'   },
  { id: 'vigencia',      label: 'Vigencia'        },
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
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: `linear-gradient(90deg,${ACCENT2},${ACCENT})` }} />
);

const ClientLogo = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <img
    src="/travel-sol-playa-logo.webp"
    alt="Travel Sol y Playa"
    className={className}
    style={style}
    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
  />
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const TravelSolPlayaProposalV2 = () => {
  const [activeSection, setActiveSection]     = useState('resumen');
  const [faseActiva, setFaseActiva]           = useState<number | null>(null);
  const [openPlatformItem, setOpenPlatformItem] = useState<number | null>(null);
  const [mesFocus, setMesFocus]               = useState<number>(0);
  const [calcOpen, setCalcOpen]               = useState(false);
  const [msgPerConv, setMsgPerConv]           = useState(5);
  const [leadsPerMonth, setLeadsPerMonth]     = useState(600);
  const IA_PRICE_USD = 0.02;
  const TRM_RATE     = 3642.93;
  const consumoUSD   = +(IA_PRICE_USD * msgPerConv * leadsPerMonth).toFixed(2);
  const consumoCOP   = Math.round(consumoUSD * TRM_RATE);

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

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const s1 = useVisible(); const s2 = useVisible(); const s3 = useVisible();
  const s4 = useVisible(); const s5 = useVisible(); const s6 = useVisible();

  return (
    <div id="proposal-root" className="min-h-screen overflow-x-hidden" style={{ background: '#030d1a', fontFamily: 'Lato, sans-serif' }}>

      {/* ── NAV LATERAL ─ solo lg ── */}
      <nav className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-50 flex-col gap-3 no-print">
        {SECCIONES.map(s => (
          <button key={s.id} onClick={() => scrollTo(s.id)}
            className={`group flex items-center gap-2.5 transition-all duration-300 ${activeSection === s.id ? 'opacity-100' : 'opacity-25 hover:opacity-60'}`}>
            <span className={`font-lato text-[14px] text-white whitespace-nowrap transition-all duration-300 ${activeSection === s.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>
              {s.label}
            </span>
            <div className={`rounded-full flex-shrink-0 transition-all duration-300 ${activeSection === s.id ? 'w-2 h-2 shadow-[0_0_6px_rgba(6,182,212,.7)]' : 'w-1.5 h-1.5 bg-white/50'}`}
              style={{ background: activeSection === s.id ? ACCENT : undefined }} />
          </button>
        ))}
      </nav>

      {/* ══════════════════════════════════════ PORTADA */}
      <header className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #03111e 0%, #05192b 55%, #071f36 100%)' }}>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
            style={{ background: `radial-gradient(circle, ${ACCENT}0d 0%, transparent 65%)` }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: `radial-gradient(circle, ${ACCENT2}0a 0%, transparent 70%)`, transform: 'translate(-20%,20%)' }} />
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
          <span className="font-lato text-[13px] uppercase tracking-[0.2em] border rounded-full px-3 py-1.5"
            style={{ color: `${ACCENT}cc`, borderColor: `${ACCENT}25` }}>
            Confidencial · {META.fecha}
          </span>
        </div>

        <style>{`
          @keyframes cover-spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes cover-spin-rev  { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
          @keyframes cover-pulse-glow {
            0%, 100% { opacity: 0.07; transform: scale(1); }
            50%       { opacity: 0.15; transform: scale(1.12); }
          }
          @keyframes cover-float {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-10px); }
          }
          .cover-ring-1 { animation: cover-spin-slow 22s linear infinite; }
          .cover-ring-2 { animation: cover-spin-rev  16s linear infinite; }
          .cover-glow   { animation: cover-pulse-glow 4s ease-in-out infinite; }
          .cover-float  { animation: cover-float 5s ease-in-out infinite; }
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=Lato:wght@300;400;500;700&display=swap');
          .font-poppins { font-family: 'Poppins', sans-serif; }
          .font-lato    { font-family: 'Lato', sans-serif; }
          @media print { .no-print { display:none !important; } }
          input[type='range'] { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 2px; outline: none; }
          input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #06b6d4; cursor: pointer; box-shadow: 0 0 8px rgba(6,182,212,0.55); }
          input[type='range']::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #06b6d4; cursor: pointer; border: none; box-shadow: 0 0 8px rgba(6,182,212,0.55); }
        `}</style>

        {/* Cuerpo portada: 2 columnas */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            {/* — Izquierda — */}
            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta comercial · Pauta Digital + Plataforma CRM</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})` }}>
                  <Plane className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}28`, color: ACCENT }}>
                  Turismo · Barranquilla
                </span>
              </div>

              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}>
                Propuesta<br />
                <span style={{ background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Comercial
                </span>
              </h1>

              <p className="font-lato text-white/55 text-xl leading-relaxed mb-5">{META.objetivo}</p>

              {/* Eslogan Sixteam */}
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

              {/* Chips info */}
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

              {/* Índice rápido */}
              <div className="border-t pt-5" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-widest mb-3">Contenido</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                  {['1. Resumen ejecutivo', '2. Propuesta Sixteam', '3. Plan de trabajo', '4. Inversión', '5. Recomendación', '6. Vigencia y términos'].map((item, i) => (
                    <button key={i} onClick={() => scrollTo(SECCIONES[i]?.id)}
                      className="font-lato text-white/45 text-[15px] hover:text-[#00bfa5] transition-colors duration-200 text-left flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#00bfa5]/40 flex-shrink-0" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* — Derecha: visual — */}
            <div className="flex items-center justify-center relative min-h-[380px]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="cover-glow absolute w-80 h-80 rounded-full"
                  style={{ background: `radial-gradient(circle, ${ACCENT}12 0%, ${ACCENT2}06 50%, transparent 70%)` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full"
                  style={{ border: `1px solid ${ACCENT}12` }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full"
                  style={{ border: `1px dashed ${ACCENT2}18` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: ACCENT, boxShadow: `0 0 6px ${ACCENT}cc` }} />
                </div>
              </div>

              <div className="cover-float relative z-10 flex flex-col items-center gap-6 w-full px-6">
                {/* Sixteam */}
                <div className="flex flex-col items-center gap-1">
                  <img src="/sixteam-logo.png" alt="Sixteam.pro"
                    className="h-20 w-auto object-contain"
                    style={{ filter: 'drop-shadow(0 4px 20px rgba(0,191,165,.45))' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <span className="font-poppins font-black text-white/30 text-[11px] uppercase tracking-[0.2em]">Sixteam.pro</span>
                </div>

                {/* Divisor × */}
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}20)` }} />
                  <div className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)' }}>
                    <span className="font-poppins font-black text-white/40 text-[20px] leading-none">×</span>
                  </div>
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${ACCENT}20, transparent)` }} />
                </div>

                {/* Travel Sol y Playa logo */}
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-2xl px-5 py-3 flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,.97)', boxShadow: `0 4px 28px ${ACCENT}28` }}>
                    <ClientLogo className="h-16 w-auto object-contain max-w-[220px]" />
                  </div>
                  <span className="font-poppins font-black text-white/30 text-[11px] uppercase tracking-[0.2em]">Travel Sol y Playa</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll cue */}
        <div className="relative z-10 flex flex-col items-center gap-2 pb-10 opacity-30 no-print">
          <p className="font-lato text-white text-[13px] uppercase tracking-widest">Desplazar</p>
          <div className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </header>

      {/* ══════════════════════════════════════ SOCIAL PROOF */}
      <div className="w-full relative z-20 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <LogoCarousel />
      </div>

      {/* ══════════════════════════════════════ CONTENIDO PRINCIPAL */}
      <main className="max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-20 space-y-24">

        {/* ─ 01 RESUMEN ─ */}
        <section id="resumen" ref={s1.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s1.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>01 — Resumen ejecutivo</TagLabel>
          <SectionTitle>Contexto y diagnóstico inicial</SectionTitle>
          <Rule />

          {/* Ficha cliente */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="rounded-2xl overflow-hidden flex items-center justify-center px-4 py-2"
                style={{ background: 'rgba(255,255,255,.97)', boxShadow: `0 4px 20px ${ACCENT}20` }}>
                <ClientLogo className="h-12 w-auto object-contain max-w-[160px]" />
              </div>
              <span className="font-poppins font-black text-white text-[14px] tracking-tight">Travel Sol y Playa</span>
              <span className="font-lato text-[11px] uppercase tracking-[0.18em] text-center" style={{ color: ACCENT }}>Barranquilla</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">{META.sector}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Madurez actual</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">2/5 · Primeros pasos</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sede</p>
                <p className="font-lato text-white/60 text-[18px]">{META.sede}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Preparado para</p>
                <p className="font-lato text-white/60 text-[18px]">{META.contacto} · {META.cargo}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              Travel Sol y Playa SAS es una agencia con bases sólidas: cuenta con <strong className="text-white/90 font-semibold">buen servicio, clientes satisfechos y una gerencia que ya tomó la decisión de crecer ordenadamente</strong>. Eso, en el mercado de agencias pequeñas en Colombia, es una ventaja real que pocas tienen.
            </p>
            <p>
              El diagnóstico, sin embargo, revela que las herramientas disponibles <strong className="text-white/90 font-semibold">no están conectadas entre sí y el proceso depende demasiado de una sola persona</strong>. Con tres líneas de WhatsApp activas, HubSpot sin usar y seguimientos manuales, cada consulta sin respuesta oportuna es una venta que se va a la competencia.
            </p>
            <p>
              La agencia está en el momento preciso para dar el salto. La estrategia más inteligente para este momento es <strong className="text-white/90 font-semibold">arrancar con pauta digital en mayo para traer más leads</strong>, y desde ese flujo de caja nuevo apalancar la inversión en la plataforma que los va a capturar y convertir. Primero el combustible, luego el motor.
            </p>
          </div>

          {/* Hallazgos */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> Brechas operativas identificadas
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HALLAZGOS.map((h, i) => {
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
          <TagLabel>02 — Propuesta Sixteam.pro</TagLabel>
          <SectionTitle>Lo que vamos a construir juntos</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden mb-6"
            style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${ACCENT}0a, transparent 70%)`, transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 text-[#00bfa5] mb-4" />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[22px] leading-relaxed mb-5">
              Sixteam.pro es una consultora en <span style={{ color: ACCENT }}>estrategia digital</span> especializada en diseñar e implementar soluciones de tecnología y transformación digital a la medida de cada empresa. No vendemos software genérico; construimos el sistema que cada operación necesita.
            </p>
            <div className="space-y-4 font-lato text-white/65 text-[17px] sm:text-[18px] leading-relaxed">
              <p>
                Para Travel Sol y Playa, el diagnóstico fue preciso: el problema no es falta de herramientas, es que <strong className="text-white/85 font-semibold">la agencia no tiene sistema para capturar los leads que ya podrían llegar</strong>. La pauta digital los trae; el ChatCenter con IA no pierde ninguno; el CRM los convierte en ventas. Cada pieza tiene un rol claro.
              </p>
              <p>
                Nuestra propuesta arranca con <strong className="text-white/85 font-semibold">pauta digital en mayo</strong> para generar flujo de consultas desde el primer mes. En paralelo, implementamos el <strong className="text-white/85 font-semibold">ChatCenter con IA</strong> para que ninguna consulta quede sin respuesta, y el <strong className="text-white/85 font-semibold">CRM Sixteam.pro Core</strong> para centralizar, convertir y escalar, financiado con los resultados que la pauta ya está generando.
              </p>
            </div>
          </div>

          {/* Qué incluye */}
          <p className="font-lato text-white/30 text-[13px] uppercase tracking-widest mb-4">Lo que incluye la plataforma</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: Inbox,
                titulo: 'Bandeja Omnicanal Unificada',
                desc: 'Los tres canales de WhatsApp activos, Instagram y Facebook convergen en una sola bandeja, de modo que cada conversación queda registrada con el historial completo del cliente y cualquier asesor puede retomar la atención sin perder contexto.',
              },
              {
                icon: Database,
                titulo: 'CRM de Contactos y Pipeline',
                desc: 'Reemplaza HubSpot con una plataforma que sí se usa. Cada contacto tiene hasta 15 campos personalizados por tipo de viajero, un pipeline con etapas claras y un historial visible para todo el equipo, para que ninguna oportunidad se pierda por falta de seguimiento.',
              },
              {
                icon: Zap,
                titulo: 'Automatizaciones de Seguimiento',
                desc: 'Hasta 5 automatizaciones activas para que el seguimiento ocurra sin que nadie lo recuerde: mensajes a las 24 horas, a los 3 días y a los 7 días para quien preguntó pero no compró, respuestas fuera de horario y asignación automática entre asesores según disponibilidad.',
              },
              {
                icon: TrendingUp,
                titulo: 'Panel de KPIs Semanal',
                desc: 'Hasta 5 informes personalizados con las métricas que realmente importan: consultas por canal, tasa de cierre, ticket promedio, tiempo de respuesta y ventas perdidas, para que la revisión semanal tome 15 minutos y las decisiones se basen en datos reales.',
              },
              {
                icon: Users,
                titulo: 'Proceso para el Equipo',
                desc: 'El manual operativo queda documentado dentro de la plataforma, de manera que los asesores nuevos saben desde el primer día cómo cotizar, responder y dar seguimiento sin necesitar preguntarle todo a Mónica ni esperar a que ella esté disponible.',
              },
              {
                icon: Settings,
                titulo: 'Implementación a medida',
                desc: 'Todo se configura según la operación real de Travel Sol y Playa: destinos, tipos de consulta, roles del equipo, flujos y vistas, de modo que el equipo empieza a usar la plataforma desde el día de entrega sin necesidad de adaptarla por su cuenta.',
              },
            ].map(({ icon: Icon, titulo, desc }, idx) => {
              const isOpen = openPlatformItem === idx;
              return (
                <button
                  key={titulo}
                  onClick={() => setOpenPlatformItem(isOpen ? null : idx)}
                  className="rounded-xl p-5 flex gap-4 text-left w-full transition-all duration-200"
                  style={{
                    background: isOpen ? `${ACCENT}0d` : 'rgba(255,255,255,.03)',
                    border: isOpen ? `1px solid ${ACCENT}35` : '1px solid rgba(255,255,255,.06)',
                  }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}20` }}>
                    <Icon className="w-4 h-4" style={{ color: ACCENT }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-poppins font-bold text-white/90 text-[16px]">{titulo}</p>
                      <ChevronRight
                        className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                        style={{ color: `${ACCENT}80`, transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                      />
                    </div>
                    {isOpen && (
                      <p className="font-lato text-white/55 text-[14px] leading-relaxed mt-2">{desc}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Ruta de crecimiento */}
          <div className="mt-6 rounded-2xl p-5 sm:p-6"
            style={{ background: `${ACCENT}07`, border: `1px solid ${ACCENT}20` }}>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4" style={{ color: ACCENT }} />
              <p className="font-poppins font-bold text-white/80 text-[15px] uppercase tracking-wider">Ruta de crecimiento incluida</p>
            </div>
            <p className="font-lato text-white/55 text-[15px] leading-relaxed">
              CRM Sixteam.pro Core es el punto de partida. Cuando la agencia esté lista —con el equipo integrado, los procesos documentados y las métricas claras— el siguiente paso natural es <strong className="text-white/75 font-semibold">CRM Sixteam.pro Growth</strong>, que incorpora email marketing, social planner, funnels de captación, campañas de nutrición y gestión de reputación. La plataforma crece con el negocio, sin migrar.
            </p>
          </div>
        </section>

        {/* ─ 03 PLAN DE TRABAJO ─ */}
        <section id="plan" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — Plan de trabajo</TagLabel>
          <SectionTitle>4 fases · Mayo a Julio</SectionTitle>
          <Rule />

          {/* Timeline visual */}
          <div className="hidden sm:flex items-center mb-8 relative">
            <div className="absolute top-5 left-5 right-5 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${ACCENT2}40 20%, ${ACCENT}40 80%, transparent)` }} />
            {FASES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 relative z-10">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center border transition-all"
                    style={{
                      background: f.recomendada ? `linear-gradient(135deg,${ACCENT2},${ACCENT})` : 'rgba(255,255,255,.04)',
                      borderColor: f.recomendada ? `${ACCENT}99` : 'rgba(255,255,255,.1)',
                    }}>
                    <Icon className={`w-4 h-4 ${f.recomendada ? 'text-white' : 'text-white/40'}`} />
                  </div>
                  <div className="text-center">
                    <p className={`font-poppins font-bold text-[15px] ${f.recomendada ? 'text-white' : 'text-white/50'}`}>{f.num}</p>
                    <p className="font-lato text-[13px] leading-tight mt-0.5 max-w-[100px]"
                      style={{ color: f.recomendada ? ACCENT : 'rgba(255,255,255,.3)' }}>{f.duracion}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2.5">
            {FASES.map((f, i) => {
              const Icon = f.icon; const open = faseActiva === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${ACCENT}40` : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setFaseActiva(open ? null : i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? `${ACCENT}20` : 'rgba(255,255,255,.05)' }}>
                      <Icon className="w-4 h-4 transition-colors" style={{ color: open ? ACCENT : 'rgba(255,255,255,.35)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`font-poppins font-bold text-[18px] ${open ? 'text-white' : 'text-white/70'}`}>{f.num}</span>
                        {f.recomendada && (
                          <span className="px-2 py-0.5 rounded-full font-lato font-bold text-[11px] uppercase tracking-wider text-[#030d1a]"
                            style={{ background: ACCENT }}>★ Arranca en mayo</span>
                        )}
                      </div>
                      <p className={`font-lato text-[18px] mt-0.5 truncate ${open ? 'text-white/80' : 'text-white/40'}`}>{f.nombre}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <div className="text-right hidden sm:block">
                        <p className="font-lato text-white/30 text-[13px] mt-0.5">{f.duracion}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`}
                        style={{ color: `${ACCENT}80` }} />
                    </div>
                  </button>
                  {open && (
                    <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Entregables</p>
                          <ul className="space-y-2">
                            {f.entregables.map((e, j) => (
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
                            {f.detalle.map((d, j) => (
                              <li key={j} className="font-lato text-white/50 text-[18px] leading-snug pl-3"
                                style={{ borderLeft: `2px solid ${ACCENT2}40` }}>{d}</li>
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
        </section>

        {/* ─ 04 COTIZACIÓN ─ */}
        <section id="cotizacion" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Inversión</TagLabel>
          <SectionTitle>Modelo de inversión mensual</SectionTitle>
          <Rule />

          {/* Contexto de prioridad */}
          <div className="rounded-xl p-5 mb-8 flex gap-4 items-start"
            style={{ background: `${ACCENT}0a`, border: `1px solid ${ACCENT}28` }}>
            <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: ACCENT }} />
            <p className="font-lato text-white/65 text-[17px] leading-relaxed">
              La prioridad de Mónica es clara: <strong className="text-white/90">primero generar más leads con pauta digital</strong> para crear flujo de caja, y desde ahí apalancar la inversión en tecnología. Este modelo respeta ese orden: la pauta arranca en mayo y genera resultados mientras la tecnología se configura en paralelo.
            </p>
          </div>

          {/* Selectores de mes */}
          <div className="flex flex-wrap gap-2 mb-5">
            {INVESTMENT_DATA.meses.map((mes, i) => (
              <button key={i} onClick={() => setMesFocus(i)}
                className="flex flex-col items-start px-4 py-3 rounded-xl transition-all duration-200 flex-1 min-w-[80px]"
                style={{
                  background: mesFocus === i ? `${ACCENT}12` : 'rgba(255,255,255,.03)',
                  border: `1px solid ${mesFocus === i ? `${ACCENT}48` : 'rgba(255,255,255,.08)'}`,
                }}>
                <span className={`font-poppins font-bold text-[14px] ${mesFocus === i ? 'text-white' : 'text-white/50'}`}>{mes}</span>
                <span className="font-poppins font-bold text-[13px]"
                  style={{ color: mesFocus === i ? ACCENT : 'rgba(255,255,255,.3)' }}>
                  ${INVESTMENT_DATA.totales[i].toLocaleString('es-CO')}
                </span>
              </button>
            ))}
          </div>

          {/* Tabla interactiva */}
          <div className="overflow-x-auto rounded-xl mb-4" style={{ border: '1px solid rgba(255,255,255,.08)' }}>
            <table className="w-full border-collapse min-w-[480px]">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,.04)', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                  <th className="text-left px-5 py-3 font-lato font-normal text-white/40 text-[12px] uppercase tracking-widest">Servicio</th>
                  {INVESTMENT_DATA.meses.map((mes, i) => (
                    <th key={i} onClick={() => setMesFocus(i)}
                      className="px-4 py-3 font-lato font-normal text-[12px] uppercase tracking-widest text-right cursor-pointer transition-all duration-200 select-none"
                      style={{
                        color: mesFocus === i ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.4)',
                        background: mesFocus === i ? `${ACCENT}10` : undefined,
                      }}>
                      {mes}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INVESTMENT_DATA.filas.map((fila, rowIdx) => {
                  const Icon = fila.icon;
                  const focusedVal = fila.valores[mesFocus];
                  return (
                    <tr key={rowIdx} className="transition-colors duration-200"
                      style={{ borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background: focusedVal > 0 ? `${ACCENT}15` : 'rgba(255,255,255,.04)',
                              border: `1px solid ${focusedVal > 0 ? `${ACCENT}28` : 'rgba(255,255,255,.07)'}`,
                            }}>
                            <Icon className="w-3.5 h-3.5" style={{ color: focusedVal > 0 ? ACCENT : 'rgba(255,255,255,.25)' }} />
                          </div>
                          <div>
                            <p className={`font-poppins font-semibold text-[14px] leading-tight ${focusedVal > 0 ? 'text-white/90' : 'text-white/40'}`}>{fila.servicio}</p>
                            <span className="font-lato text-[11px] uppercase tracking-wider"
                              style={{ color: focusedVal > 0 ? `${ACCENT}99` : 'rgba(255,255,255,.2)' }}>{fila.tipo}</span>
                          </div>
                        </div>
                      </td>
                      {fila.valores.map((val, colIdx) => (
                        <td key={colIdx}
                          className="px-4 py-4 text-right transition-all duration-200"
                          style={{
                            background: colIdx === mesFocus ? `${ACCENT}0c` : undefined,
                            borderLeft: colIdx === mesFocus ? `1px solid ${ACCENT}20` : undefined,
                            borderRight: colIdx === mesFocus ? `1px solid ${ACCENT}20` : undefined,
                          }}>
                          {fila.oldValores[colIdx] > 0 && val > 0 && (
                            <div className="font-poppins text-[11px] text-right mb-0.5"
                              style={{ color: 'rgba(255,255,255,.28)', textDecoration: 'line-through' }}>
                              ${fila.oldValores[colIdx].toLocaleString('es-CO')}
                            </div>
                          )}
                          <span className="font-poppins font-bold text-[14px]"
                            style={{
                              color: val > 0
                                ? (colIdx === mesFocus ? ACCENT : 'rgba(255,255,255,.55)')
                                : 'rgba(255,255,255,.15)',
                            }}>
                            {val > 0 ? `$${val.toLocaleString('es-CO')}` : '—'}
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: 'rgba(255,255,255,.06)', borderTop: '2px solid rgba(255,255,255,.1)' }}>
                  <td className="px-5 py-4 font-poppins font-black text-white text-[13px] uppercase tracking-wider">
                    Inversión Total
                  </td>
                  {INVESTMENT_DATA.totales.map((total, i) => (
                    <td key={i}
                      className="px-4 py-4 text-right font-poppins font-black text-[15px] transition-all duration-200"
                      style={{
                        background: i === mesFocus ? `${ACCENT}18` : undefined,
                        color: i === mesFocus ? ACCENT : 'rgba(255,255,255,.65)',
                      }}>
                      ${total.toLocaleString('es-CO')}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Detalle del mes seleccionado */}
          <div className="rounded-xl p-5 mb-8"
            style={{ background: `${ACCENT}07`, border: `1px solid ${ACCENT}1e` }}>
            <p className="font-poppins font-semibold text-white/50 text-[12px] uppercase tracking-widest mb-4">
              Servicios activos en {INVESTMENT_DATA.meses[mesFocus]}
            </p>
            <div className="space-y-4">
              {INVESTMENT_DATA.filas.filter(f => f.valores[mesFocus] > 0).map((fila, i) => {
                const Icon = fila.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}28` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <span className="font-poppins font-bold text-white/85 text-[15px]">{fila.servicio}</span>
                        <span className="font-poppins font-black text-[15px]" style={{ color: ACCENT }}>
                          ${fila.valores[mesFocus].toLocaleString('es-CO')}
                        </span>
                      </div>
                      <p className="font-lato text-white/45 text-[13px] leading-relaxed mt-1">{fila.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notas */}
          <p className="font-lato text-white/35 text-[13px] leading-relaxed px-1 mb-8">
            <strong className="text-white/50">Valores en pesos colombianos (COP).</strong> La mensualidad de plataforma está denominada en USD y se factura al TRM vigente. La pauta digital es inversión directa en medios, por lo que no incluye producción de creativos ni créditos de WhatsApp API. Implementación CRM dividida en dos cuotas de $900.000 (junio y julio).
          </p>

          {/* Calculadora de consumo IA */}
          <div className="mt-2 rounded-xl overflow-hidden no-print" style={{ border: `1px solid ${ACCENT}25` }}>
            <button onClick={() => setCalcOpen(!calcOpen)}
              className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-200"
              style={{ background: calcOpen ? `${ACCENT}10` : `${ACCENT}06` }}>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}30` }}>
                  <Zap className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                </div>
                <span className="font-poppins font-bold text-white/80 text-[13px] uppercase tracking-wider">
                  Calculadora de consumo mensual IA
                </span>
              </div>
              <ChevronRight
                className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                style={{ color: `${ACCENT}80`, transform: calcOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
            </button>

            {calcOpen && (
              <div className="px-5 pb-6 pt-4 border-t" style={{ borderColor: `${ACCENT}18`, background: 'rgba(3,13,26,.6)' }}>
                {/* Valor fijo IA por mensaje */}
                <div className="flex items-center justify-between px-4 py-3 rounded-lg mb-5"
                  style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ACCENT }} />
                    <span className="font-lato text-white/65 text-[14px]">Valor IA por mensaje</span>
                  </div>
                  <span className="font-poppins font-bold text-[15px]" style={{ color: ACCENT }}>USD 0.02</span>
                </div>

                {/* Slider: mensajes por conversación */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-lato text-white/65 text-[15px]">Mensajes promedio por conversación</span>
                    <span className="font-poppins font-black text-white text-[20px]">{msgPerConv}</span>
                  </div>
                  <div className="relative pb-1">
                    <div className="absolute left-0 right-0 top-[7px] flex items-center justify-center pointer-events-none"
                      style={{ paddingLeft: `calc(${((msgPerConv - 1) / 9) * 100}% - 22px)` }}>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold whitespace-nowrap"
                        style={{ background: ACCENT, color: '#030d1a' }}>prom. {msgPerConv}</span>
                    </div>
                    <input type="range" min={1} max={10} value={msgPerConv}
                      onChange={e => setMsgPerConv(Number(e.target.value))}
                      className="w-full mt-6 cursor-pointer"
                      style={{ background: `linear-gradient(to right, ${ACCENT} ${((msgPerConv - 1) / 9) * 100}%, rgba(255,255,255,.15) ${((msgPerConv - 1) / 9) * 100}%)` }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="font-lato text-white/30 text-[12px]">1</span>
                    <span className="font-lato text-white/30 text-[12px]">10</span>
                  </div>
                </div>

                {/* Slider: leads por mes */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-lato text-white/65 text-[15px]">Leads promedio por mes</span>
                    <span className="font-poppins font-black text-white text-[20px]">{leadsPerMonth}</span>
                  </div>
                  <input type="range" min={100} max={2000} step={50} value={leadsPerMonth}
                    onChange={e => setLeadsPerMonth(Number(e.target.value))}
                    className="w-full cursor-pointer"
                    style={{ background: `linear-gradient(to right, ${ACCENT} ${((leadsPerMonth - 100) / 1900) * 100}%, rgba(255,255,255,.15) ${((leadsPerMonth - 100) / 1900) * 100}%)` }} />
                  <div className="flex justify-between mt-1">
                    <span className="font-lato text-white/30 text-[12px]">100</span>
                    <span className="font-lato text-white/30 text-[12px]">2.000</span>
                  </div>
                </div>

                {/* Fórmula */}
                <div className="px-4 py-3 rounded-lg mb-4"
                  style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <span className="font-lato text-white/45 text-[13px]">USD 0.02</span>
                  <span className="font-lato text-white/25 text-[13px] mx-2">×</span>
                  <span className="font-lato text-white/45 text-[13px]">{msgPerConv} msg/conv</span>
                  <span className="font-lato text-white/25 text-[13px] mx-2">×</span>
                  <span className="font-lato text-white/45 text-[13px]">{leadsPerMonth} leads</span>
                  <span className="font-lato text-white/25 text-[13px] mx-2">=</span>
                  <span className="font-poppins font-bold text-[14px]" style={{ color: ACCENT }}>
                    USD {consumoUSD.toFixed(2)}
                  </span>
                </div>

                {/* Resultado */}
                <div className="rounded-xl p-6 text-center"
                  style={{ background: 'rgba(3,15,30,.8)', border: `1px solid ${ACCENT}22` }}>
                  <p className="font-lato text-white/35 text-[11px] uppercase tracking-widest mb-3">
                    Consumo estimado de IA / mes
                  </p>
                  <p className="font-poppins font-black text-white mb-1"
                    style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)' }}>
                    USD {consumoUSD.toFixed(2)}
                  </p>
                  <p className="font-poppins font-bold text-[20px] mb-3" style={{ color: ACCENT }}>
                    ≈ COP {consumoCOP.toLocaleString('es-CO')}
                  </p>
                  <p className="font-lato text-white/30 text-[12px] leading-relaxed max-w-sm mx-auto">
                    Estimado · TRM ${TRM_RATE.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP/USD · El costo real depende del consumo efectivo de tokens por conversación
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Soporte opcional */}
          <div className="mt-6">
            <TagLabel>Servicio complementario · opcional</TagLabel>
            <div className="mt-4 rounded-xl p-5 flex flex-col sm:flex-row gap-4 sm:items-start"
              style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
              <div className="flex items-start gap-3 sm:w-1/2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)' }}>
                  <Settings className="w-4 h-4 text-white/40" />
                </div>
                <div>
                  <p className="font-poppins font-bold text-white/80 text-[15px] leading-tight">Soporte y Operaciones</p>
                  <p className="font-lato text-white/35 text-[12px] mt-0.5">Mejora continua y adopción de herramientas</p>
                  <p className="font-poppins font-bold text-[#00bfa5] text-[14px] mt-2">Desde COP 600.000/mes</p>
                </div>
              </div>
              <p className="font-lato text-white/45 text-[13px] leading-relaxed sm:w-1/2">
                Paquete mensual de 4 horas para levantamiento de oportunidades de mejora en los flujos configurados y apoyo activo en la adopción de la plataforma por parte del equipo. Activable en cualquier momento.
              </p>
            </div>
          </div>
        </section>

        {/* ─ 05 RECOMENDACIÓN ─ */}
        <section id="recomendacion" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Recomendación final</TagLabel>
          <SectionTitle>Pauta primero, tecnología después: por qué este orden funciona</SectionTitle>
          <Rule />

          <div className="rounded-xl p-5 sm:p-7 mb-6 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
              style={{ background: `radial-gradient(circle,${ACCENT}08,transparent)`, transform: 'translate(20%,-20%)' }} />
            <div className="space-y-4 font-lato text-white/60 text-[19px] leading-relaxed">
              <p>
                Travel Sol y Playa llega a este momento con algo que no se puede comprar: <strong className="text-white/90 font-semibold">una gerente que ya tomó la decisión de crecer y una claridad envidiable sobre por dónde empezar</strong>. Mónica lo tiene claro: primero los leads, luego la tecnología que los convierte.
              </p>
              <p>
                Por eso este modelo arranca con <strong className="text-white/90 font-semibold">pauta digital en mayo</strong>: genera consultas reales desde el primer mes, crea flujo de caja nuevo y ese mismo flujo financia la implementación del CRM y el ChatCenter en paralelo. No es tecnología por tecnología: es tecnología que se paga sola con los resultados que produce.
              </p>
              <p>
                La meta al cerrar el proyecto no es "tener más herramientas". La meta es que en agosto la agencia reciba más leads de los que recibía, ninguno se pierda sin respuesta, y <strong className="text-white/90 font-semibold">Mónica pueda gerenciar mientras la plataforma atiende, asigna y hace seguimiento</strong>, con acceso a datos reales que le permitan decidir qué escalar y cuándo.
              </p>
            </div>
          </div>

          {/* Diferenciadores */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                titulo: 'Diagnóstico antes de propuesta',
                desc: 'Esta propuesta fue construida sobre el análisis real de la operación de Travel Sol y Playa, no sobre un catálogo genérico. Cada fase responde directamente a una brecha identificada.',
                icon: Target,
              },
              {
                titulo: 'Experiencia en turismo colombiano',
                desc: 'Hemos trabajado con agencias de viajes en Colombia. Entendemos el ciclo del viajero, las temporadas, los flujos de cotización y los retos específicos del sector.',
                icon: Plane,
              },
              {
                titulo: 'Implementación, no solo acceso',
                desc: 'No entregamos credenciales y un tutorial. Configuramos, capacitamos y acompañamos hasta que la plataforma opere sola y el equipo la use con confianza desde el primer día.',
                icon: Zap,
              },
            ].map(({ titulo, desc, icon: Icon }) => (
              <div key={titulo} className="rounded-xl p-5 flex flex-col gap-3"
                style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}20` }}>
                  <Icon className="w-4 h-4" style={{ color: ACCENT }} />
                </div>
                <p className="font-poppins font-bold text-white text-[16px] leading-tight">{titulo}</p>
                <p className="font-lato text-white/50 text-[14px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Fórmula Sixteam */}
          <div className="mt-8 rounded-2xl p-6 text-center"
            style={{ background: `linear-gradient(135deg, ${ACCENT}06, #00bfa508)`, border: `1px solid ${ACCENT}15` }}>
            <p className="font-poppins font-black text-white/85 text-[1.05rem] tracking-widest uppercase">
              Process + Technology + People = <span style={{ color: ACCENT }}>Growth</span>
            </p>
            <p className="font-lato text-white/35 text-[14px] mt-2">La fórmula que Sixteam.pro aplica en cada proyecto.</p>
          </div>
        </section>

        {/* ─ 06 VIGENCIA Y TÉRMINOS ─ */}
        <section id="vigencia" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 — Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y Términos de la Propuesta</SectionTitle>
          <Rule />

          <div className="space-y-3">
            {[
              {
                titulo: 'Vigencia de la propuesta',
                desc: 'Esta propuesta es válida por 30 días calendario desde la fecha de emisión (mayo 2026). Pasado ese plazo, los valores y condiciones podrán revisarse.',
                icon: Calendar,
              },
              {
                titulo: 'Aprobación e inicio',
                desc: 'Para aceptar esta propuesta, se requiere confirmación vía WhatsApp, correo o verbal para habilitar el contrato a firmar. El cronograma de implementación comienza desde la recepción del pago inicial.',
                icon: CheckCircle,
              },
              {
                titulo: 'Términos de Pago · Implementación',
                desc: 'Se sugiere un esquema del 50% del valor de implementación para dar inicio al proyecto y el 50% restante al finalizar la fase de puesta en marcha y capacitación del equipo.',
                icon: FileText,
              },
              {
                titulo: 'Términos de Pago · Licencia mensual',
                desc: 'La licencia mensual se factura de manera anticipada el primer día hábil de cada mes. Sin permanencia mínima tras finalizar la implementación.',
                icon: TrendingUp,
              },
              {
                titulo: 'Ajuste de precios de licencia',
                desc: 'El costo mensual está denominado en dólares estadounidenses (USD) y se factura al TRM vigente en COP. Cualquier variación será notificada mediante la factura emitida.',
                icon: Info,
              },
              {
                titulo: 'Tratamiento del IVA',
                desc: 'Los valores cotizados en este documento no incluyen IVA. La mensualidad de la plataforma CRM está exenta de IVA conforme a la normativa tributaria colombiana vigente. Los servicios de implementación, pauta digital y soporte son gravables con IVA al 19%, el cual se discriminará en la factura electrónica correspondiente.',
                icon: BookOpen,
              },
              {
                titulo: 'Modificaciones al alcance',
                desc: 'Cualquier solicitud de integración o funcionalidad no contemplada explícitamente en este documento requerirá una nueva cotización y puede afectar los tiempos de entrega.',
                icon: AlertCircle,
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
        <div className="relative overflow-hidden border-t" style={{ borderColor: `${ACCENT}18` }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full"
              style={{ background: `radial-gradient(circle, ${ACCENT}08, transparent 65%)`, transform: 'translate(30%,-30%)' }} />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-16 sm:py-20 text-center">
            <TagLabel>¿Avanzamos?</TagLabel>
            <h2 className="font-poppins font-black text-white mt-4 mb-4 leading-tight"
              style={{ fontSize: 'clamp(2.25rem, 6.25vw, 4rem)' }}>
              ¿Lista Travel Sol y Playa para dar el primer paso?
            </h2>
            <p className="font-lato text-white/50 max-w-md mx-auto mb-8 text-[18px] sm:text-xl leading-relaxed">
              Podemos arrancar la implementación esta semana. Escríbenos para confirmar alcance, accesos y fecha de inicio.
            </p>
            <div className="flex justify-center">
              <a href="https://wa.me/573004507102" target="_blank" rel="noopener noreferrer"
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
              <p className="font-poppins font-black text-white text-xl mb-0.5">
                Sixteam<span className="text-[#00bfa5]">.</span>pro
              </p>
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

export default TravelSolPlayaProposalV2;
