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
  objetivo:   'Implementar CRM Sixteam.pro Core para centralizar canales, automatizar seguimientos y estructurar la operación para el crecimiento ordenado de la agencia.',
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
    duracion: 'Semana 1',
    icon: FileText,
    recomendada: true,
    entregables: [
      'Sesión de levantamiento con Mónica para mapear el proceso de venta de principio a fin, con una duración máxima de 2 horas',
      'Mapa documentado del flujo de atención actual, desde que llega la primera consulta hasta que el cliente recibe sus documentos de viaje',
      'Inventario completo de los canales activos, las herramientas en uso y el estado actual de la base de clientes',
      'Definición conjunta de las etapas del pipeline, los campos necesarios en el CRM y los roles de cada persona del equipo',
      'Checklist técnico con los accesos e integraciones requeridas para que la implementación arranque sin demoras en la semana 2',
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
    nombre: 'Implementación de herramientas',
    duracion: 'Semanas 2 y 3',
    icon: Zap,
    recomendada: false,
    entregables: [
      'Bandeja omnicanal activa con WhatsApp Business, Instagram y Facebook integrados en un solo inbox centralizado',
      'CRM configurado con hasta 15 campos personalizados, 2 tarjetas de contacto y 1 pipeline con etapas adaptadas al flujo real de la agencia',
      '3 usuarios operativos activos con sus roles, vistas y accesos configurados según su función',
      'Base de clientes de los últimos 6 meses importada, deduplicada y estructurada dentro de la plataforma',
      'Hasta 5 automatizaciones activas para seguimiento a las 24 horas, los 3 días y los 7 días, más respuestas fuera de horario y asignación automática entre asesores',
      'Hasta 3 Smart Lists dinámicas segmentadas por tipo de viajero o destino',
      'Hasta 5 informes del panel de KPIs configurados y listos para lectura semanal',
    ],
    detalle: [
      'Se conectan WhatsApp Business, Instagram y Facebook a la bandeja omnicanal, de modo que cada conversación quede centralizada con su historial completo y sea accesible para cualquier asesor en tiempo real.',
      'El modelo de datos del CRM se construye a partir de lo definido en la Fase 1, de manera que los campos, el pipeline y las etapas reflejen exactamente cómo trabaja la agencia.',
      'Se importa, deduplica y limpia la base de clientes para que los contactos dejen de vivir solo en WhatsApp y queden organizados dentro de la plataforma.',
      'Se configuran hasta 5 automatizaciones críticas, de modo que el seguimiento, la asignación entre asesores y las respuestas fuera de horario ocurran de forma automática sin depender de que alguien lo recuerde.',
      'Se crean hasta 3 Smart Lists dinámicas por destino o perfil de viajero y se configuran hasta 5 informes para el panel semanal, para que las decisiones se tomen con datos reales.',
    ],
  },
  {
    num: 'Fase 3',
    nombre: 'Capacitación y puesta en marcha',
    duracion: 'Semana 4',
    icon: Users,
    recomendada: false,
    entregables: [
      'Sesión de capacitación funcional con el equipo completo, con una duración de hasta 3 horas',
      'Recorrido en vivo por la plataforma para que el equipo opere el inbox, el pipeline, las automatizaciones y los reportes con confianza',
      'Pruebas de calidad de todos los flujos y automatizaciones con escenarios reales de la agencia, antes de la entrega',
      'Manual operativo documentado en la plataforma para que cualquier asesor nuevo sepa desde el primer día cómo cotizar, responder, hacer seguimiento e incorporarse al equipo',
      'Protocolo de primer contacto disponible dentro del sistema para que el equipo lo consulte en cualquier momento',
    ],
    detalle: [
      'Sesión práctica de hasta 3 horas con Mónica y los asesores, orientada al uso diario del inbox unificado, la gestión del pipeline, la lectura de los reportes y el manejo de las automatizaciones.',
      'Se prueban en vivo todos los flujos configurados con casos reales de la agencia, de manera que el equipo entre en producción con la certeza de que todo funciona correctamente.',
      'El proceso operativo queda documentado directamente en la plataforma, de modo que un asesor nuevo pueda entender cómo funciona la agencia sin necesidad de preguntarle a Mónica.',
      'Al cierre de esta fase la plataforma entra en producción, con lo cual el equipo opera con el sistema activo desde el último día de la semana 4.',
    ],
  },
  {
    num: 'Fase 4',
    nombre: 'Entrega final y levantamiento de oportunidades de mejora',
    duracion: 'Cierre semana 4',
    icon: BarChart3,
    recomendada: false,
    entregables: [
      'Reunión de entrega formal con Mónica para revisar todo lo configurado y verificar que cada flujo opera correctamente',
      'Documentación técnica y operativa del sistema entregada al equipo como referencia permanente',
      'Reporte de calidad con la validación final de flujos, accesos y automatizaciones',
      'Levantamiento de oportunidades de mejora identificadas durante la implementación, priorizadas para los primeros 30 días',
      'Hoja de ruta de siguientes pasos con acciones inmediatas y la ruta hacia CRM Growth cuando la agencia esté lista',
    ],
    detalle: [
      'Sesión de entrega formal en la que se hace un recorrido completo de todo lo implementado, se verifican los accesos de cada usuario y se confirma que todos los flujos operan como se diseñaron.',
      'Se entrega la documentación de configuración del sistema junto con la guía operativa del equipo, para que la agencia pueda consultarla en cualquier momento sin depender de Sixteam.',
      'Se presenta el levantamiento de oportunidades de mejora, con indicaciones concretas sobre qué ajustar en los primeros 30 días, qué indicadores empezar a observar y cuándo tiene sentido escalar.',
      'Se definen los siguientes pasos concretos: las acciones inmediatas post-entrega, los indicadores clave a monitorear semana a semana y las condiciones bajo las cuales activar la capa de marketing y automatización avanzada del plan Growth.',
    ],
  },
];

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

const TravelSolPlayaProposal = () => {
  const [activeSection, setActiveSection]     = useState('resumen');
  const [faseActiva, setFaseActiva]           = useState<number | null>(null);
  const [openPlatformItem, setOpenPlatformItem] = useState<number | null>(null);

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
        `}</style>

        {/* Cuerpo portada: 2 columnas */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            {/* — Izquierda — */}
            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta comercial · CRM Sixteam.pro Core</TagLabel>
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
              La agencia está en el momento justo para dar este salto: hay un equipo nuevo llegando, la decisión de fortalecer la operación ya está tomada, y lo único que falta es <strong className="text-white/90 font-semibold">una plataforma que conecte todo y le permita a Mónica gerenciar en lugar de operar</strong>. Para eso está el <strong className="text-white/90 font-semibold">CRM Sixteam.pro Core</strong>.
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
                Para Travel Sol y Playa, el diagnóstico fue preciso: el problema no es falta de herramientas, es que <strong className="text-white/85 font-semibold">las herramientas no están integradas y el proceso vive en la cabeza de Mónica</strong>. HubSpot pagado sin usar, tres números de WhatsApp activos y seguimientos dependientes de quien esté disponible.
              </p>
              <p>
                Nuestra propuesta es implementar <strong className="text-white/85 font-semibold">CRM Sixteam.pro Core</strong> como la plataforma que reemplaza el HubSpot sin usar, centraliza los tres canales en una sola bandeja con historial completo, estructura el pipeline de ventas y automatiza los seguimientos, para que la agencia funcione con o sin Mónica pendiente 100% de la operativa.
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
          <SectionTitle>4 fases · 4 semanas</SectionTitle>
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
                    <p className="font-lato text-[13px] leading-tight mt-0.5 max-w-[80px]"
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
                            style={{ background: ACCENT }}>★ Inicio del proyecto</span>
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
          <SectionTitle>Cotización</SectionTitle>
          <Rule />
          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-6">
            Valores en <strong className="text-white/75">pesos colombianos (COP)</strong>. El licenciamiento mensual está denominado en dólares y se factura al TRM vigente. No incluye pauta publicitaria ni créditos de WhatsApp API.
          </p>

          {/* Implementación */}
          <TagLabel>Implementación · Pago único</TagLabel>
          <Rule />
          <div className="rounded-xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:items-center"
            style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}>
            <div className="flex items-center gap-4 sm:w-2/5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}30` }}>
                <Settings className="w-5 h-5" style={{ color: ACCENT }} />
              </div>
              <div>
                <p className="font-poppins font-bold text-white/80 text-[18px]">Setup e implementación</p>
                <p className="font-lato text-white/40 text-[14px] mt-0.5">Pago único al inicio del proyecto</p>
              </div>
            </div>
            <div className="sm:w-1/4">
              <p className="font-poppins font-black text-[#00bfa5] text-[2rem]">COP 1.990.000</p>
            </div>
            <div className="sm:w-1/3">
              <ul className="space-y-1">
                {[
                  'Configuración completa de la plataforma',
                  'Centralización de los 3 canales WhatsApp',
                  'Hasta 15 campos personalizados y 1 pipeline',
                  'Hasta 5 automatizaciones de seguimiento',
                  'Hasta 3 Smart Lists dinámicas',
                  'Capacitación del equipo (hasta 3h)',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-[#00bfa5] flex-shrink-0 mt-[3px]" />
                    <span className="font-lato text-white/55 text-[14px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Licencia mensual */}
          <TagLabel>Licencia mensual · CRM Sixteam.pro Core</TagLabel>
          <Rule />
          <div className="rounded-xl p-5 mb-3"
            style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.22)' }}>
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              <div className="sm:w-1/3">
                <p className="font-poppins font-bold text-[#00bfa5] text-[15px] uppercase tracking-wider mb-1">Plan Base</p>
                <p className="font-poppins font-black text-white text-3xl">
                  COP 850.000<span className="text-[18px] font-lato font-normal text-white/40">/mes</span>
                </p>
              </div>
              <div className="sm:w-2/3">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                  {[
                    '3 usuarios operativos incluidos',
                    'Bandeja omnicanal (WhatsApp, IG, FB)',
                    'CRM de contactos con campos personalizados',
                    'Pipeline de ventas con etapas y responsables',
                    'Smart Lists y segmentación dinámica',
                    'Automatizaciones base activas',
                    'Informes y panel de KPIs',
                    'Historial multicanal por contacto',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-[#00bfa5] flex-shrink-0 mt-[3px]" />
                      <span className="font-lato text-white/60 text-[14px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Nota usuarios adicionales */}
          <p className="font-lato text-white/35 text-[13px] leading-relaxed px-1 mb-8">
            <span className="text-white/50 font-semibold">Usuarios adicionales:</span> cada asesor más allá de los 3 incluidos se agrega a <span className="text-white/50">25 USD/usuario/mes</span> facturado al TRM vigente. Sin permanencia mínima.
          </p>

          {/* Resumen inversión */}
          <div className="rounded-2xl p-6 sm:p-7" style={{ background: `${ACCENT}06`, border: `1px solid ${ACCENT}20` }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
              <div>
                <p className="font-lato text-white/40 text-[13px] uppercase tracking-wider mb-1">Implementación (una sola vez)</p>
                <p className="font-poppins font-black text-white text-[1.6rem]">COP 1.990.000</p>
              </div>
              <div>
                <p className="font-lato text-white/40 text-[13px] uppercase tracking-wider mb-1">Licencia mensual (base 3 usuarios)</p>
                <p className="font-poppins font-black text-white text-[1.6rem]">COP 850.000<span className="text-white/40 text-[1rem] font-normal">/mes</span></p>
              </div>
            </div>
            <div className="pt-5 border-t flex flex-wrap gap-4" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
              {[
                'Sin permanencia mínima tras la implementación',
                'Precio fijo mensual · sin costos ocultos',
                'Usuarios adicionales: 25 USD c/u al mes',
                'Pauta publicitaria aparte del fee de plataforma',
              ].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5]" />
                  <span className="font-lato text-white/55 text-[13px]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Servicios adicionales opcionales */}
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-1">
              <TagLabel>Servicios adicionales · opcionales</TagLabel>
            </div>
            <p className="font-lato text-white/35 text-[14px] leading-relaxed mb-5">
              Servicios que pueden activarse en el futuro o en paralelo al plan base, según el crecimiento y las necesidades de la agencia. No son requisito para iniciar.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  titulo: 'Pauta Digital',
                  subtitulo: 'Implementación estratégica y administración',
                  desc: 'Diseño, configuración y gestión activa de campañas pagadas (Meta Ads, Google Ads) alineadas al proceso de ventas y al CRM. Cada lead generado entra directamente al pipeline.',
                  precio: 'Desde COP 600.000/mes',
                  icon: TrendingUp,
                },
                {
                  titulo: 'Soporte y Operaciones',
                  subtitulo: 'Mejora continua y adopción de herramientas',
                  desc: 'Paquete mensual de 4 horas para levantamiento de oportunidades de mejora en los flujos configurados y apoyo activo en la adopción de la plataforma por parte del equipo.',
                  precio: 'Desde COP 600.000/mes',
                  icon: Settings,
                },
                {
                  titulo: 'Chatbot con IA',
                  subtitulo: 'Atención y perfilamiento inicial de leads',
                  desc: 'Implementación de asistente conversacional con IA integrado a la bandeja omnicanal: WhatsApp, Instagram, Facebook, TikTok y sitio web. Atiende, filtra y perfila el lead antes de pasarlo al asesor.',
                  precio: 'Desde COP 800.000/mes',
                  icon: MessageSquare,
                },
              ].map(({ titulo, subtitulo, desc, precio, icon: Icon }) => (
                <div key={titulo} className="rounded-xl p-5 flex flex-col gap-3"
                  style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)' }}>
                      <Icon className="w-4 h-4 text-white/40" />
                    </div>
                    <div>
                      <p className="font-poppins font-bold text-white/80 text-[15px] leading-tight">{titulo}</p>
                      <p className="font-lato text-white/35 text-[12px] mt-0.5">{subtitulo}</p>
                    </div>
                  </div>
                  <p className="font-lato text-white/45 text-[13px] leading-relaxed flex-1">{desc}</p>
                  <div className="pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                    <span className="font-poppins font-bold text-[#00bfa5] text-[14px]">{precio}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─ 05 RECOMENDACIÓN ─ */}
        <section id="recomendacion" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Recomendación final</TagLabel>
          <SectionTitle>Por qué CRM Core es la elección correcta ahora</SectionTitle>
          <Rule />

          <div className="rounded-xl p-5 sm:p-7 mb-6 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
              style={{ background: `radial-gradient(circle,${ACCENT}08,transparent)`, transform: 'translate(20%,-20%)' }} />
            <div className="space-y-4 font-lato text-white/60 text-[19px] leading-relaxed">
              <p>
                Travel Sol y Playa llega a este momento con algo que no se puede comprar: <strong className="text-white/90 font-semibold">una gerente que ya tomó la decisión de crecer y un equipo que va a llegar a una plataforma, no a un caos</strong>. Ese es el punto de inflexión.
              </p>
              <p>
                El diagnóstico indica que la brecha más crítica no es de tecnología sino de <strong className="text-white/90 font-semibold">integración y proceso</strong>. HubSpot pagado sin usar no resolvió el problema porque fue adquirido sin implementación. CRM Sixteam.pro Core llega con la configuración completa, las automatizaciones activas y el equipo capacitado para usarlo desde el primer día.
              </p>
              <p>
                La meta al cerrar el proyecto no es "tener un CRM nuevo". La meta es que <strong className="text-white/90 font-semibold">Mónica pueda gerenciar mientras la plataforma atiende, asigna y hace seguimiento</strong>, con datos reales para tomar decisiones y un equipo que sabe exactamente qué hacer en cada situación.
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

export default TravelSolPlayaProposal;
