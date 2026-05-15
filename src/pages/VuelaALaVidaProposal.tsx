import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, ChevronRight, FileText, Target, Zap, BarChart3,
  MessageSquare, AlertCircle, TrendingUp, Mail, ArrowRight, Building2,
  Calendar, Hash, User, Info, Globe, MapPin, Plane,
  Database, Inbox, Settings, Users, Clock,
  Star, Link2, GraduationCap, Share2, LayoutTemplate, ThumbsUp, Sparkles,
} from 'lucide-react';
import LogoCarousel from '../components/LogoCarousel';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const ACCENT  = '#f59e0b';
const ACCENT2 = '#d97706';
const TRM_NUM = 4200;
const TRM = '4.200';
const IA_USD_POR_MSG = 0.02;

const META = {
  cliente:    'Vuela a la Vida',
  contacto:   'Patrick Nübel',
  cargo:      'Director',
  sector:     'Agencia de Viajes · Turismo · WhatsApp-first',
  sede:       'Colombia',
  fecha:      'Mayo 2026',
  lugar:      'Barranquilla, Colombia',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit:        '901.967.849-4',
  correo:     'alpha@sixteam.pro',
  rl:         'Samuel Armando Burgos Ferrer',
  objetivo:   'Implementar CRM Sixteam.pro Core para calificar prospectos con IA, automatizar la asignación a asesores y obtener métricas detalladas de todo el proceso comercial.',
};

const HALLAZGOS = [
  {
    titulo: 'El bot actual no califica: solo recibe',
    desc: 'Leadsales opera con un bot básico que recibe mensajes pero no filtra ni puntúa la calidad del lead. Los asesores reciben todos los contactos sin distinción, incluyendo los que aún no están listos para comprar. El tiempo de foco se diluye.',
    icon: AlertCircle,
    tint: 'red',
  },
  {
    titulo: 'Ausencia de un equipo estratégico especializado',
    desc: 'Vuela a la Vida ha escalado su volumen de prospectos sin contar con el respaldo de un equipo experto que traduzca ese crecimiento en procesos automatizados. La tecnología disponible opera en su nivel más básico porque nunca ha habido quien la configure con criterio estratégico y visión de negocio.',
    icon: Users,
    tint: 'amber',
  },
  {
    titulo: 'Métricas insuficientes para gestionar el equipo',
    desc: 'Leadsales muestra conteos de conversaciones y tiempo de respuesta general, pero no registra de dónde vienen los leads, cuánto tarda cada asesor en convertirlos ni cuál es el ticket promedio por perfil de viaje.',
    icon: BarChart3,
    tint: 'blue',
  },
  {
    titulo: '45 leads diarios con proceso manual: un cuello de botella creciente',
    desc: 'Con 1.350 prospectos al mes y el equipo en expansión, el proceso actual no tiene capacidad de escalar. La asignación manual ya consume tiempo de coordinación que debería destinarse a la venta.',
    icon: TrendingUp,
    tint: 'red',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber: { text: 'text-amber-400', bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)' },
  blue:  { text: 'text-[#60a5fa]', bg: 'rgba(96,165,250,.07)', border: 'rgba(96,165,250,.18)' },
  red:   { text: 'text-[#f87171]', bg: 'rgba(221,51,51,.07)',  border: 'rgba(221,51,51,.2)'   },
  teal:  { text: 'text-[#00bfa5]', bg: 'rgba(0,191,165,.07)',  border: 'rgba(0,191,165,.18)'  },
};

const FASES = [
  {
    num: 'Fase 1',
    nombre: 'Consultoría en procesos comerciales y tecnología',
    duracion: '1–2 semanas',
    icon: FileText,
    recomendada: true,
    entregables: [
      'Auditoría del proceso comercial actual (atención, asignación y seguimiento)',
      'Mapeo del flujo de WhatsApp desde el primer mensaje hasta el cierre',
      'Definición de criterios de calificación de leads para el agente IA',
      'Diseño de las reglas de asignación automática por carga de trabajo de cada asesor',
      'Configuración de usuarios y roles para los 7 asesores del equipo',
    ],
    detalle: [
      'Reunión de contexto con el equipo para mapear el proceso de atención y asignación actual (hasta 2 horas).',
      'Diagnóstico de Leadsales: qué se preserva, qué se reemplaza y cómo se migra el historial relevante.',
      'Diseño del modelo de datos: hasta 15 propiedades por módulo (contactos y oportunidades), perfil de lead (destino, presupuesto, fechas, viajeros) y pipeline de ventas.',
      'Definición de las reglas de routing inteligente según disponibilidad y carga activa de cada asesor.',
    ],
  },
  {
    num: 'Fase 2',
    nombre: 'Implementación CRM Sixteam.pro Core',
    duracion: '1–2 semanas',
    icon: Zap,
    recomendada: false,
    entregables: [
      'Conexión del número de WhatsApp a la bandeja omnicanal centralizada',
      'Reglas de asignación automática de leads entre los asesores',
      'Secuencias de seguimiento automático: 24 h, 3 días y 7 días post-consulta',
      'Respuestas automáticas fuera de horario configuradas',
      'Hasta 1 pipeline de ventas configurado con sus etapas',
    ],
    detalle: [
      'Configuración de hasta 5 automatizaciones críticas para el flujo comercial.',
      'Activación del routing inteligente: el sistema detecta la carga de trabajo activa de cada asesor y asigna el lead al más disponible.',
      'Secuencias de seguimiento automático con mensajes personalizados según el tipo de consulta de viaje.',
      'Integración con Facebook e Instagram para unificar todos los canales en una sola bandeja de entrada.',
    ],
  },
  {
    num: 'Fase 3',
    nombre: 'Elaboración del agente IA conversacional',
    duracion: '2–3 semanas',
    icon: MessageSquare,
    recomendada: false,
    entregables: [
      'Diseño del flujo conversacional adaptado a los paquetes de Vuela a la Vida',
      'Entrenamiento del agente con preguntas clasificatorias de perfilamiento del lead',
      'Configuración del traspaso al asesor con resumen automático y tareas asignadas',
      'Integración de la base de conocimiento de productos y destinos de la agencia',
      'Secuencias de reactivación para leads que dejan de responder',
    ],
    detalle: [
      'Diseño y mapeo del flujo conversacional: el bot recibe el lead, lo perfila y determina si está listo para hablar con un asesor.',
      'Entrenamiento del agente con preguntas clasificatorias: destino de interés, fechas, número de viajeros, presupuesto estimado y tipo de viaje.',
      'Configuración del traspaso: el bot genera un resumen del lead con sus datos clave y crea tareas de seguimiento asignadas automáticamente al asesor.',
      'Carga de la base de conocimiento de paquetes y destinos para que el agente responda consultas específicas con información real.',
      'Pruebas de calidad del flujo completo: atención inicial, perfilamiento, traspaso y reactivación de leads silenciosos.',
    ],
  },
  {
    num: 'Fase 4',
    nombre: 'Reportería, KPIs y capacitación del equipo',
    duracion: '1 semana',
    icon: TrendingUp,
    recomendada: false,
    entregables: [
      'Panel de KPIs con métricas detalladas de la operación comercial',
      'Informes de rendimiento por asesor: conversión, tiempo de respuesta y ticket promedio',
      'Informes por canal y fuente de origen de cada lead',
      'Pruebas de calidad de todos los flujos, automatizaciones y agente IA',
      'Capacitación funcional del equipo completo (hasta 5 horas)',
      'Guías de uso y documentación operativa entregadas',
    ],
    detalle: [
      'Configuración de hasta 5 informes personalizados: leads por canal, tasa de cierre por asesor, tiempo promedio de conversión y ticket por perfil de viaje.',
      'Activación del panel de KPIs en tiempo real accesible para la coordinación y la dirección.',
      'Pruebas de calidad de todos los flujos, automatizaciones y el agente IA antes de la entrega final.',
      'Sesión de capacitación con todo el equipo sobre el uso operativo del CRM y el agente IA (hasta 5 horas, grabadas y entregadas para consulta posterior).',
      'Sesión de cierre: levantamiento de oportunidades de mejora y construcción de la hoja de ruta de crecimiento tecnológico.',
    ],
  },
];

const SECCIONES = [
  { id: 'resumen',       label: 'Resumen'      },
  { id: 'objetivo',      label: 'Objetivo'      },
  { id: 'plan',          label: 'Plan de trabajo'},
  { id: 'cotizacion',    label: 'Cotización'    },
  { id: 'recomendacion', label: 'Recomendación' },
  { id: 'vigencia',      label: 'Vigencia'      },
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

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const VuelaALaVidaProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [faseActiva, setFaseActiva]       = useState<number | null>(null);
  const [msgPerConv, setMsgPerConv]       = useState(6);
  const [leadsPerMonth, setLeadsPerMonth] = useState(1350);
  const [iaOpen, setIaOpen]               = useState(false);
  const [calcOpen, setCalcOpen]           = useState(false);

  const iaUSD = +(IA_USD_POR_MSG * msgPerConv * leadsPerMonth).toFixed(2);
  const iaCOP = Math.round(iaUSD * TRM_NUM);
  const fmtCOP = (n: number) => n.toLocaleString('es-CO', { minimumFractionDigits: 0 });

  useEffect(() => {
    const handler = () => {
      const offset = window.innerWidth >= 1024 ? 140 : 60;
      for (const s of SECCIONES) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= offset && rect.bottom > offset) { setActiveSection(s.id); break; }
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
            <div className={`rounded-full flex-shrink-0 transition-all duration-300 ${activeSection === s.id ? 'w-2 h-2 shadow-[0_0_6px_rgba(245,158,11,.7)]' : 'w-1.5 h-1.5 bg-white/50'}`}
              style={{ background: activeSection === s.id ? ACCENT : undefined }} />
          </button>
        ))}
      </nav>

      {/* ══════════════════════════════════════ PORTADA */}
      <header className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #04111f 0%, #071826 55%, #091f34 100%)' }}>

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
          input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#f59e0b;cursor:pointer;box-shadow:0 0 8px rgba(245,158,11,.6);border:2px solid #030d1a}
          input[type=range]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#f59e0b;cursor:pointer;box-shadow:0 0 8px rgba(245,158,11,.6);border:2px solid #030d1a}
        `}</style>

        {/* Cuerpo portada: 2 columnas */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-12 px-6 sm:px-10 lg:px-[10%]">
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            {/* — Izquierda: texto — */}
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
                  Agencia de Viajes
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
                  { icon: Calendar, text: META.fecha  },
                  { icon: MapPin,   text: META.lugar  },
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
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-x-6 gap-y-1.5">
                  {['1. Resumen ejecutivo', '2. Objetivo general', '3. Plan de trabajo', '4. Cotización', '5. Recomendación', '6. Vigencia y términos'].map((item, i) => (
                    <button key={i} onClick={() => scrollTo(SECCIONES[i]?.id)}
                      className="font-lato text-white/45 text-[15px] hover:text-[#00bfa5] transition-colors duration-200 text-left flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#00bfa5]/40 flex-shrink-0" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* — Derecha: Sixteam × Vuela a la Vida — */}
            <div className="flex items-center justify-center relative min-h-[260px] sm:min-h-[380px]">
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

                {/* Vuela a la Vida */}
                <div className="flex flex-col items-center gap-1">
                  <div className="rounded-2xl px-5 py-3 flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,.97)', boxShadow: `0 4px 28px ${ACCENT}28` }}>
                    <img src="/vuela-a-la-vida-logo.webp" alt="Vuela a la Vida"
                      className="h-14 w-auto object-contain max-w-[220px]"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <span className="font-poppins font-black text-white/30 text-[11px] uppercase tracking-[0.2em]">Vuela a la Vida</span>
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

      {/* ── NAV MÓVIL STICKY ─ solo < lg ── */}
      <nav className="lg:hidden sticky top-0 z-40 no-print"
        style={{ background: 'rgba(3,13,26,0.96)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <div className="flex overflow-x-auto py-2.5 px-4 gap-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {SECCIONES.map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full font-lato text-[13px] whitespace-nowrap transition-all duration-200"
              style={activeSection === s.id
                ? { background: ACCENT, color: '#030d1a', fontWeight: 600 }
                : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)' }}>
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ══════════════════════════════════════ CONTENIDO PRINCIPAL */}
      <main className="max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-20 space-y-24">

        {/* ─ 01 RESUMEN ─ */}
        <section id="resumen" ref={s1.ref as React.RefObject<HTMLElement>}
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s1.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>01 — Resumen ejecutivo</TagLabel>
          <SectionTitle>Contexto y diagnóstico inicial</SectionTitle>
          <Rule />

          {/* Ficha cliente */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="rounded-2xl overflow-hidden flex items-center justify-center px-4 py-2"
                style={{ background: 'rgba(255,255,255,.97)', boxShadow: `0 4px 20px ${ACCENT}20` }}>
                <img src="/vuela-a-la-vida-logo.webp" alt="Vuela a la Vida"
                  className="h-10 w-auto object-contain max-w-[160px]"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <span className="font-poppins font-black text-white text-[14px] tracking-tight">Vuela a la Vida</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">{META.sector}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Volumen mensual</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">~1.350 leads · 45 por día</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Equipo de ventas</p>
                <p className="font-lato text-white/60 text-[18px]">7 asesores · en expansión</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Preparado para</p>
                <p className="font-lato text-white/60 text-[18px]">{META.contacto} · {META.cargo}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              Vuela a la Vida recibe cerca de <strong className="text-white/90 font-semibold">1.350 prospectos al mes</strong> a través de su canal de WhatsApp, generados principalmente por pauta en Facebook y Google. Son un volumen alto para un equipo de 7 asesores que hoy opera sin automatización real.
            </p>
            <p>
              El diagnóstico es preciso: el bot actual de Leadsales recepciona los mensajes pero no califica, no puntúa y no asigna. Cada asesor recibe leads mezclados, sin contexto previo, y la coordinación decide la distribución de forma manual para cada prospecto. El resultado es tiempo de foco perdido y tiempos de respuesta inconsistentes.
            </p>
            <p>
              La oportunidad no es solo reemplazar el CRM. Es <strong className="text-white/90 font-semibold">construir un sistema donde la IA filtra, el CRM organiza y los asesores solo atienden a los prospectos que ya tienen contexto</strong>. Para eso está el <strong className="text-white/90 font-semibold">CRM Sixteam.pro Core</strong> con agente conversacional integrado.
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
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>02 — Objetivo general</TagLabel>
          <SectionTitle>Nuestra postura estratégica</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden mb-6"
            style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${ACCENT}0a, transparent 70%)`, transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 text-[#00bfa5] mb-4" />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[22px] leading-relaxed mb-5">
              Sixteam.pro es una consultora en <span style={{ color: ACCENT }}>estrategia digital</span> especializada en diseñar e implementar soluciones de tecnología, transformación digital e inteligencia de negocios a la medida de cada empresa. No vendemos licencias; construimos el sistema que cada operación necesita.
            </p>
            <div className="space-y-4 font-lato text-white/65 text-[17px] sm:text-[18px] leading-relaxed">
              <p>
                Tras analizar la operación de Vuela a la Vida, identificamos que el reto no es la ausencia de herramientas sino su <strong className="text-white/85 font-semibold">insuficiencia para el volumen que ya maneja la agencia</strong>. Leadsales cumple una función básica de mensajería, pero no tiene la capacidad de calificación, routing inteligente ni analítica que 1.350 leads mensuales requieren.
              </p>
              <p>
                La propuesta es implementar <strong className="text-white/85 font-semibold">CRM Sixteam.pro Core</strong> como la plataforma central de la operación comercial: un sistema donde el agente de IA recibe al prospecto, lo califica, construye su perfil y lo entrega al asesor correcto con todo el contexto listo para vender.
              </p>
            </div>
          </div>

          {/* Qué incluye */}
          <p className="font-lato text-white/30 text-[13px] uppercase tracking-widest mb-4">Lo que incluye la plataforma</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: MessageSquare,
                titulo: 'Agente IA conversacional',
                desc: 'Recibe al prospecto, lo perfila con preguntas clave (destino, fechas, presupuesto, viajeros) y construye su ficha antes de pasarlo al asesor.',
              },
              {
                icon: Inbox,
                titulo: 'Bandeja Omnicanal',
                desc: 'WhatsApp, Instagram y Facebook en un único inbox con routing automático por carga de trabajo real entre los 7 asesores del equipo.',
              },
              {
                icon: Database,
                titulo: 'CRM de Contactos y Pipeline',
                desc: 'Historial unificado de cada prospecto, campos personalizados por perfil de viaje, etapas de venta definidas y seguimiento por asesor.',
              },
              {
                icon: Zap,
                titulo: 'Automatizaciones y Seguimientos',
                desc: 'Secuencias automáticas 24h / 3d / 7d, respuestas fuera de horario y flujos de reactivación para leads que dejan de responder.',
              },
              {
                icon: BarChart3,
                titulo: 'Reportes y KPIs detallados',
                desc: 'Panel con métricas por canal, por asesor y por fuente: tiempo de conversión, tasa de cierre, ticket promedio y origen de cada lead.',
              },
              {
                icon: Settings,
                titulo: 'Implementación a medida',
                desc: 'Todas las configuraciones diseñadas para la estructura de Vuela a la Vida: criterios de calificación, reglas de routing y perfil de viajero.',
              },
            ].map(({ icon: Icon, titulo, desc }) => (
              <div key={titulo} className="rounded-xl p-5 flex gap-4"
                style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}20` }}>
                  <Icon className="w-4 h-4" style={{ color: ACCENT }} />
                </div>
                <div>
                  <p className="font-poppins font-bold text-white/90 text-[16px] mb-1">{titulo}</p>
                  <p className="font-lato text-white/50 text-[14px] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─ 03 PLAN DE TRABAJO ─ */}
        <section id="plan" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — Plan de trabajo</TagLabel>
          <SectionTitle>4 fases · hasta 7 semanas</SectionTitle>
          <Rule />

          {/* Pilares */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[
              { icon: FileText,     titulo: 'Consultoría en procesos', desc: 'Auditoría, diagnóstico y diseño del modelo operativo comercial con reglas de routing y criterios de calificación.' },
              { icon: Settings,     titulo: 'Implementación CRM',       desc: 'Configuración completa del CRM, bandeja omnicanal y automatizaciones de asignación y seguimiento.' },
              { icon: MessageSquare, titulo: 'Agente IA conversacional', desc: 'Diseño y entrenamiento del chatbot para atención, perfilamiento y traspaso al asesor con contexto completo.' },
            ].map(({ icon: Icon, titulo, desc }) => (
              <div key={titulo} className="rounded-xl p-4 flex gap-3"
                style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}18` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${ACCENT}15`, border: `1px solid ${ACCENT}28` }}>
                  <Icon className="w-4 h-4" style={{ color: ACCENT }} />
                </div>
                <div>
                  <p className="font-poppins font-bold text-white text-[14px] mb-0.5">{titulo}</p>
                  <p className="font-lato text-white/45 text-[13px] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline visual */}
          <div className="hidden sm:flex items-center mb-8 relative">
            <div className="absolute top-5 left-5 right-5 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${ACCENT2}40 20%, ${ACCENT}40 80%, transparent)` }} />
            {FASES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${f.recomendada ? 'border-[#00bfa5]/60' : 'border-white/10'}`}
                    style={{ background: f.recomendada ? `linear-gradient(135deg,${ACCENT2},${ACCENT})` : 'rgba(255,255,255,.04)' }}>
                    <Icon className={`w-4 h-4 ${f.recomendada ? 'text-white' : 'text-white/40'}`} />
                  </div>
                  <div className="text-center">
                    <p className={`font-poppins font-bold text-[15px] ${f.recomendada ? 'text-white' : 'text-white/50'}`}>{f.num}</p>
                    <p className={`font-lato text-[13px] leading-tight mt-0.5 max-w-[80px] ${f.recomendada ? '' : 'text-white/30'}`}
                      style={f.recomendada ? { color: ACCENT } : {}}>{f.duracion}</p>
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
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? '1px solid rgba(0,191,165,.3)' : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setFaseActiva(open ? null : i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? 'rgba(0,191,165,.15)' : 'rgba(255,255,255,.05)' }}>
                      <Icon className={`w-4 h-4 transition-colors ${open ? 'text-[#00bfa5]' : 'text-white/35'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`font-poppins font-bold text-[18px] ${open ? 'text-white' : 'text-white/70'}`}>{f.num}</span>
                        {f.recomendada && (
                          <span className="px-2 py-0.5 rounded-full font-lato font-bold text-[11px] uppercase tracking-wider text-[#030d1a]"
                            style={{ background: '#00bfa5' }}>★ Inicio del proyecto</span>
                        )}
                      </div>
                      <p className={`font-lato text-[18px] mt-0.5 truncate ${open ? 'text-white/80' : 'text-white/40'}`}>{f.nombre}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <div className="text-right hidden sm:block">
                        <p className="font-lato text-white/30 text-[13px] mt-0.5">{f.duracion}</p>
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
                              <li key={j} className="font-lato text-white/50 text-[18px] leading-snug pl-3 border-l border-[#1d70a2]/30">{d}</li>
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
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Cotización</TagLabel>
          <SectionTitle>Inversión</SectionTitle>
          <Rule />
          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-6">
            Valores en <strong className="text-white/75">dólares estadounidenses (USD)</strong>. No incluye pauta publicitaria ni créditos de WhatsApp API. Todos los servicios están <strong className="text-white/75">exentos de IVA</strong> al ser prestados desde el exterior.
          </p>

          {/* Implementación */}
          <TagLabel>Implementación · Pago único</TagLabel>
          <Rule />
          <div className="rounded-xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:items-center"
            style={{ background: `rgba(245,158,11,.05)`, border: `1px solid ${ACCENT}20` }}>
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
              <p className="font-poppins font-black text-[#00bfa5] text-[2rem]">USD 1.300<span className="font-lato font-normal text-white/40 text-[1rem]"> (exento de IVA)</span></p>
            </div>
            <div className="sm:w-1/3">
              <ul className="space-y-1">
                {[
                  'Configuración completa de la plataforma',
                  'Conexión del número de WhatsApp',
                  'Automatizaciones y routing inteligente',
                  'Agente IA conversacional (base de conocimiento incluida)',
                  'Capacitación del equipo completo (hasta 5h)',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-[#00bfa5] flex-shrink-0 mt-[3px]" />
                    <span className="font-lato text-white/55 text-[14px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Agente IA */}
          <div className="rounded-xl mb-8 overflow-hidden"
            style={{ background: `linear-gradient(135deg, rgba(245,158,11,.07), rgba(0,191,165,.04))`, border: `1px solid ${ACCENT}22` }}>
            <button onClick={() => setIaOpen(o => !o)}
              className="w-full flex items-center gap-3 p-5 text-left">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${ACCENT}15`, border: `1px solid ${ACCENT}30` }}>
                <MessageSquare className="w-4 h-4" style={{ color: ACCENT }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <p className="font-poppins font-bold text-white text-[17px]">Agente IA conversacional</p>
                  <span className="px-2 py-0.5 rounded-full font-lato text-[11px] uppercase tracking-wider"
                    style={{ background: 'rgba(0,191,165,.15)', border: '1px solid rgba(0,191,165,.35)', color: '#00bfa5' }}>
                    Incluido en implementación
                  </span>
                </div>
                <p className="font-lato text-white/40 text-[14px]">Entrenamiento del agente con los paquetes y destinos de Vuela a la Vida</p>
              </div>
              <ChevronRight className={`w-4 h-4 flex-shrink-0 ml-2 transition-transform duration-300 ${iaOpen ? 'rotate-90' : ''}`} style={{ color: ACCENT }} />
            </button>
            {iaOpen && (
              <div className="px-5 pb-5 border-t" style={{ borderColor: `${ACCENT}18` }}>
                <p className="font-lato text-white/55 text-[15px] leading-relaxed mb-4 pt-4">
                  Se diseña, entrena e implementa un agente de inteligencia artificial conversacional adaptado a la operación de Vuela a la Vida, capaz de atender, calificar y entregar al asesor los prospectos listos para comprar, con un resumen completo de la conversación.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      titulo: 'Calificación y perfilamiento del lead',
                      desc: 'Recoge destino, fechas, número de viajeros, presupuesto y tipo de viaje antes de pasar al asesor.',
                    },
                    {
                      titulo: 'Traspaso con contexto al asesor',
                      desc: 'Genera un resumen automático del lead y crea tareas de seguimiento asignadas al asesor correspondiente.',
                    },
                    {
                      titulo: 'Asignación automática por carga de trabajo',
                      desc: 'El sistema detecta cuál asesor tiene menor carga activa y asigna el lead en tiempo real sin intervención manual.',
                    },
                    {
                      titulo: 'Reactivación de leads silenciosos',
                      desc: 'Activa secuencias automáticas para prospectos que dejan de responder durante el proceso de atención.',
                    },
                  ].map(({ titulo, desc }) => (
                    <div key={titulo} className="rounded-lg p-3.5 flex gap-2.5"
                      style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                      <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-poppins font-semibold text-white/80 text-[14px] mb-0.5">{titulo}</p>
                        <p className="font-lato text-white/45 text-[13px] leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Licencia mensual */}
          <TagLabel>Licencia mensual · CRM Sixteam.pro Core</TagLabel>
          <Rule />
          <div className="mb-4">
            {/* Plan base */}
            <div className="rounded-xl p-5 flex flex-col gap-3"
              style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.22)' }}>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="font-poppins font-bold text-[#00bfa5] text-[15px] uppercase tracking-wider">Plan Base</p>
                  <span className="px-2 py-0.5 rounded-full font-lato text-[11px] uppercase tracking-wider"
                    style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.28)', color: '#00bfa5' }}>
                    Exento de IVA
                  </span>
                </div>
                <p className="font-poppins font-black text-white text-3xl">
                  USD 240<span className="text-[18px] font-lato font-normal text-white/40">/mes</span>
                </p>
              </div>
              <ul className="space-y-1.5 flex-1">
                {[
                  '3 usuarios operativos incluidos',
                  '1 número de WhatsApp conectado',
                  'Bandeja omnicanal (WhatsApp, Instagram, Facebook)',
                  'CRM con hasta 15 propiedades por módulo (contactos, oportunidades)',
                  'Pipeline de ventas con etapas y responsables',
                  'Routing inteligente por carga de trabajo',
                  'Automatizaciones de seguimiento activas',
                  'Informes y panel de KPIs',
                  'Agente IA conversacional activo',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-[#00bfa5] flex-shrink-0 mt-[3px]" />
                    <span className="font-lato text-white/60 text-[15px]">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 rounded-lg px-3.5 py-3 flex items-start gap-2.5"
                style={{ background: `rgba(245,158,11,.06)`, border: `1px solid ${ACCENT}18` }}>
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: ACCENT }} />
                <p className="font-lato text-white/45 text-[13px] leading-relaxed">
                  El agente de IA tiene un <span className="text-white/70 font-semibold">costo adicional variable</span> según el volumen de conversaciones procesadas, facturado aparte de la licencia mensual.
                </p>
              </div>
            </div>
            <p className="font-lato text-white/35 text-[12px] mt-2.5 px-1">
              * Usuarios adicionales: USD 25/usuario/mes, sin permanencia mínima. Para 7 asesores: USD 240 + (4 × USD 25) = <span className="text-white/55 font-semibold">USD 340/mes</span>
            </p>
          </div>

          {/* Resumen inversión */}
          <div className="rounded-2xl p-6 sm:p-7" style={{ background: `${ACCENT}06`, border: `1px solid ${ACCENT}20` }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
              <div>
                <p className="font-lato text-white/40 text-[13px] uppercase tracking-wider mb-1">Implementación (una sola vez)</p>
                <p className="font-poppins font-black text-white text-[1.6rem]">USD 1.300<span className="text-white/40 text-[1rem] font-lato font-normal"> (exento de IVA)</span></p>
              </div>
              <div>
                <p className="font-lato text-white/40 text-[13px] uppercase tracking-wider mb-1">Licencia mensual (7 asesores)</p>
                <p className="font-poppins font-black text-white text-[1.6rem]">USD 340<span className="text-white/40 text-[1rem] font-normal">/mes</span></p>
                <p className="font-lato text-[12px] mt-1" style={{ color: 'rgba(0,191,165,.7)' }}>Exento de IVA</p>
              </div>
            </div>
            <div className="pt-5 border-t border-white/06 flex flex-wrap gap-4">
              {[
                'Sin permanencia mínima tras la implementación',
                'Usuarios adicionales: USD 25/usuario/mes',
                'Todos los valores en USD · exentos de IVA (servicio desde el exterior)',
              ].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5]" />
                  <span className="font-lato text-white/55 text-[13px]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calculadora IA */}
          <div className="rounded-2xl overflow-hidden mt-8 mb-2"
            style={{ background: 'rgba(255,255,255,.03)', border: `1px solid ${ACCENT}30` }}>
            <button onClick={() => setCalcOpen(o => !o)}
              className="w-full px-5 py-4 flex items-center gap-2 text-left"
              style={{ background: `linear-gradient(135deg, ${ACCENT}14, ${ACCENT2}0d)`, borderBottom: calcOpen ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
              <Zap className="w-4 h-4" style={{ color: ACCENT }} />
              <p className="font-poppins font-semibold text-white/80 text-[15px] uppercase tracking-wider flex-1">Calculadora de consumo mensual IA</p>
              <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${calcOpen ? 'rotate-90' : ''}`} style={{ color: ACCENT }} />
            </button>

            {calcOpen && <div className="p-5 sm:p-6 space-y-6">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ACCENT }} />
                <span className="font-lato text-white/50 text-[14px]">Valor IA por mensaje</span>
                <span className="font-poppins font-black ml-auto" style={{ color: ACCENT }}>USD {IA_USD_POR_MSG}</span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-lato text-white/60 text-[15px]">Mensajes promedio por conversación</span>
                  <span className="font-poppins font-black text-white text-[20px]">{msgPerConv}</span>
                </div>
                <div className="relative">
                  <input type="range" min={1} max={15} step={1} value={msgPerConv}
                    onChange={(e) => setMsgPerConv(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right, ${ACCENT} ${((msgPerConv - 1) / 14) * 100}%, rgba(255,255,255,.12) ${((msgPerConv - 1) / 14) * 100}%)` }} />
                  <div className="absolute -top-5 flex flex-col items-center pointer-events-none"
                    style={{ left: `calc(${((6 - 1) / 14) * 100}% - 18px)` }}>
                    <span className="font-lato text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap"
                      style={{ background: `${ACCENT}18`, color: ACCENT, border: `1px solid ${ACCENT}30` }}>
                      prom. 6
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-lato text-white/25 text-[12px]">1</span>
                  <span className="font-lato text-white/25 text-[12px]">15</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-lato text-white/60 text-[15px]">Leads promedio por mes</span>
                  <span className="font-poppins font-black text-white text-[20px]">{leadsPerMonth.toLocaleString('es-CO')}</span>
                </div>
                <input type="range" min={100} max={3000} step={50} value={leadsPerMonth}
                  onChange={(e) => setLeadsPerMonth(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, ${ACCENT} ${((leadsPerMonth - 100) / 2900) * 100}%, rgba(255,255,255,.12) ${((leadsPerMonth - 100) / 2900) * 100}%)` }} />
                <div className="flex justify-between mt-1">
                  <span className="font-lato text-white/25 text-[12px]">100</span>
                  <span className="font-lato text-white/25 text-[12px]">3.000</span>
                </div>
              </div>

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

              <div className="rounded-xl p-5 text-center"
                style={{ background: `linear-gradient(135deg, ${ACCENT}12, ${ACCENT2}08)`, border: `1px solid ${ACCENT}30` }}>
                <p className="font-lato text-white/40 text-[13px] uppercase tracking-widest mb-1">Consumo estimado de IA / mes</p>
                <p className="font-poppins font-black text-white mb-1" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}>
                  USD {iaUSD.toFixed(2)}
                </p>
                <p className="font-poppins font-bold mb-3" style={{ color: ACCENT, fontSize: '1.1rem' }}>
                  ≈ COP {fmtCOP(iaCOP)}
                </p>
                <p className="font-lato text-white/30 text-[12px]">
                  Estimado · TRM $ {TRM} COP/USD · El costo real depende del consumo efectivo de tokens por conversación
                </p>
              </div>
            </div>}
          </div>

          {/* Servicios adicionales */}
          <div className="mt-10">
            <TagLabel>Servicios adicionales · Opcionales</TagLabel>
            <Rule />

            {/* Pauta digital */}
            <div className="rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row gap-5 sm:items-center mb-4"
              style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.22)' }}>
              <div className="flex items-center gap-3 sm:w-2/5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.3)' }}>
                  <TrendingUp className="w-4 h-4 text-[#00bfa5]" />
                </div>
                <div>
                  <p className="font-poppins font-bold text-[#00bfa5] text-[15px] uppercase tracking-wider">Pauta digital</p>
                  <p className="font-lato text-white/40 text-[13px]">Mensual · recurrente</p>
                </div>
              </div>
              <div className="sm:w-1/4">
                <p className="font-poppins font-black text-white text-3xl">
                  Desde USD 200<span className="text-[18px] font-lato font-normal text-white/40">/mes</span>
                </p>
              </div>
              <p className="font-lato text-white/55 text-[14px] leading-relaxed sm:flex-1">
                Gestión y ejecución de pauta digital en Meta Ads y Google Ads. Incluye configuración de campañas, integración directa con la bandeja omnicanal para que los leads lleguen automáticamente al CRM y reporte mensual de resultados.
              </p>
            </div>

            {/* Soporte y Operaciones */}
            <div className="rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row gap-5 sm:items-center mb-4"
              style={{ background: `rgba(245,158,11,.05)`, border: `1px solid ${ACCENT}22` }}>
              <div className="flex items-center gap-3 sm:w-2/5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${ACCENT}15`, border: `1px solid ${ACCENT}28` }}>
                  <Clock className="w-4 h-4" style={{ color: ACCENT }} />
                </div>
                <div>
                  <p className="font-poppins font-bold text-[15px] uppercase tracking-wider" style={{ color: ACCENT }}>Soporte y Operaciones</p>
                  <p className="font-lato text-white/40 text-[13px]">Paquete · 5 horas</p>
                </div>
              </div>
              <div className="sm:w-1/4">
                <p className="font-poppins font-black text-white text-3xl">
                  USD 150<span className="text-[18px] font-lato font-normal text-white/40"> (exento de IVA)</span>
                </p>
                <p className="font-lato text-[12px] mt-1" style={{ color: `${ACCENT}bb` }}>5 horas · pago único</p>
              </div>
              <p className="font-lato text-white/55 text-[14px] leading-relaxed sm:flex-1">
                Bloque de 5 horas para ajustes, mejoras y soporte operativo sobre la plataforma implementada. Cubre modificaciones de flujos, nuevas automatizaciones, revisión de reportes y asistencia técnica al equipo.
              </p>
            </div>

            {/* Nota segunda fase + expansión plataforma */}
            <div className="rounded-2xl overflow-hidden mt-6"
              style={{ border: '1px solid rgba(29,112,162,.28)' }}>

              {/* Header */}
              <div className="px-5 py-4 flex items-center gap-3"
                style={{ background: 'linear-gradient(135deg, rgba(29,112,162,.18), rgba(0,191,165,.08))', borderBottom: '1px solid rgba(29,112,162,.18)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(29,112,162,.25)', border: '1px solid rgba(96,165,250,.3)' }}>
                  <Sparkles className="w-4 h-4 text-[#60a5fa]" />
                </div>
                <div>
                  <p className="font-poppins font-bold text-white/85 text-[15px]">Segunda fase · Módulo de Suscripciones y más</p>
                  <p className="font-lato text-white/40 text-[13px]">Expansión futura de la plataforma · por cotización</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6" style={{ background: 'rgba(29,112,162,.04)' }}>

                {/* Módulo suscripciones */}
                <p className="font-lato text-white/55 text-[15px] leading-relaxed mb-5">
                  En una fase posterior podríamos activar el <strong className="text-white/75 font-semibold">Módulo de Suscripciones</strong>, diseñado para gestionar el plan de suscripciones que Vuela a la Vida ofrece a sus clientes: control de ciclos de facturación, renovaciones y estado de cada suscriptor directamente desde el CRM. El valor de la implementación se cotiza según la complejidad del proceso.
                </p>

                {/* Divisor */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(29,112,162,.4), transparent)' }} />
                  <span className="font-lato text-white/30 text-[12px] uppercase tracking-widest whitespace-nowrap">Potencial de expansión</span>
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(29,112,162,.4))' }} />
                </div>

                {/* Texto expansión */}
                <p className="font-poppins font-bold text-white/85 text-[16px] mb-2">Una plataforma que crece con todo el negocio</p>
                <p className="font-lato text-white/50 text-[14px] leading-relaxed mb-6">
                  Más allá del proceso comercial que abordamos en esta propuesta, <strong className="text-white/70 font-semibold">CRM Sixteam.pro</strong> tiene la capacidad de extenderse a todas las áreas operativas de Vuela a la Vida: marketing, comunidad y servicio al cliente. La misma plataforma que hoy organiza las ventas puede convertirse en el ecosistema completo de crecimiento del negocio.
                </p>

                {/* Mapa de módulos */}
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,.06)' }}>

                  {/* Núcleo actual */}
                  <div className="px-4 py-3 flex items-center gap-2.5"
                    style={{ background: `linear-gradient(135deg, ${ACCENT}10, rgba(0,191,165,.06))`, borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#00bfa5', boxShadow: '0 0 6px rgba(0,191,165,.7)' }} />
                    <span className="font-poppins font-bold text-[#00bfa5] text-[13px] uppercase tracking-wider">Alcance actual · Proceso de ventas</span>
                    <span className="ml-auto font-lato text-[11px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.28)', color: '#00bfa5' }}>
                      Esta propuesta
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                    {[
                      { icon: MessageSquare, label: 'Agente IA conversacional' },
                      { icon: Inbox,         label: 'Bandeja omnicanal'        },
                      { icon: Database,      label: 'CRM de contactos'         },
                      { icon: Zap,           label: 'Automatizaciones'         },
                      { icon: BarChart3,     label: 'Reportes y KPIs'          },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                        style={{ background: 'rgba(0,191,165,.07)', border: '1px solid rgba(0,191,165,.18)' }}>
                        <Icon className="w-3 h-3 text-[#00bfa5]" />
                        <span className="font-lato text-white/65 text-[13px]">{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expansión: 3 categorías */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x"
                    style={{ '--tw-divide-opacity': '1', borderColor: 'rgba(255,255,255,.05)' } as React.CSSProperties}>

                    {/* Marketing */}
                    <div className="px-4 py-4" style={{ background: 'rgba(245,158,11,.03)' }}>
                      <div className="flex items-center gap-1.5 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
                        <span className="font-poppins font-bold text-[12px] uppercase tracking-wider" style={{ color: ACCENT }}>Marketing</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { icon: Mail,           label: 'Email marketing'     },
                          { icon: MessageSquare,  label: 'WhatsApp marketing'  },
                          { icon: Share2,         label: 'Calendario de RRSS'  },
                          { icon: LayoutTemplate, label: 'Landing pages'       },
                        ].map(({ icon: Icon, label }) => (
                          <div key={label} className="flex items-center gap-2">
                            <Icon className="w-3 h-3 flex-shrink-0" style={{ color: `${ACCENT}99` }} />
                            <span className="font-lato text-white/50 text-[13px]">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Comunidad */}
                    <div className="px-4 py-4" style={{ background: 'rgba(96,165,250,.03)', borderColor: 'rgba(255,255,255,.05)' }}>
                      <div className="flex items-center gap-1.5 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#60a5fa]" />
                        <span className="font-poppins font-bold text-[12px] uppercase tracking-wider text-[#60a5fa]">Comunidad</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { icon: Users,         label: 'Comunidades'          },
                          { icon: GraduationCap, label: 'Cursos con certificado'},
                          { icon: Star,          label: 'Fidelización'         },
                          { icon: FileText,      label: 'Formularios y encuestas'},
                        ].map(({ icon: Icon, label }) => (
                          <div key={label} className="flex items-center gap-2">
                            <Icon className="w-3 h-3 flex-shrink-0 text-[#60a5fa99]" />
                            <span className="font-lato text-white/50 text-[13px]">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reputación y ventas */}
                    <div className="px-4 py-4" style={{ background: 'rgba(0,191,165,.03)', borderColor: 'rgba(255,255,255,.05)' }}>
                      <div className="flex items-center gap-1.5 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00bfa5]" />
                        <span className="font-poppins font-bold text-[12px] uppercase tracking-wider text-[#00bfa5]">Reputación y ventas</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { icon: ThumbsUp, label: 'Reputación de Google' },
                          { icon: Link2,    label: 'Módulo de afiliados'  },
                          { icon: Globe,    label: 'Formularios web'      },
                          { icon: Sparkles, label: '+ Muchas más'         },
                        ].map(({ icon: Icon, label }) => (
                          <div key={label} className="flex items-center gap-2">
                            <Icon className="w-3 h-3 flex-shrink-0 text-[#00bfa599]" />
                            <span className="font-lato text-white/50 text-[13px]">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Footer del mapa */}
                  <div className="px-4 py-3 flex items-center gap-2"
                    style={{ background: 'rgba(255,255,255,.02)', borderTop: '1px solid rgba(255,255,255,.05)' }}>
                    <Info className="w-3 h-3 text-white/25 flex-shrink-0" />
                    <p className="font-lato text-white/30 text-[12px]">
                      Cada módulo se activa de forma independiente · el valor de implementación se cotiza según la complejidad del proceso
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ─ 05 RECOMENDACIÓN ─ */}
        <section id="recomendacion" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Recomendación final</TagLabel>
          <SectionTitle>Por qué Sixteam es la elección correcta</SectionTitle>
          <Rule />

          <div className="rounded-xl p-5 sm:p-7 mb-6 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
              style={{ background: `radial-gradient(circle,${ACCENT}08,transparent)`, transform: 'translate(20%,-20%)' }} />
            <div className="space-y-4 font-lato text-white/60 text-[19px] leading-relaxed">
              <p>
                No somos una empresa de software que vende licencias. Somos una <strong className="text-white/90 font-semibold">consultora en estrategia digital</strong> que identifica los cuellos de botella de una operación y construye la solución tecnológica que los resuelve, ya sea con herramientas propias o con las que el cliente ya utiliza.
              </p>
              <p>
                En el caso de Vuela a la Vida, el diagnóstico es claro: el volumen de prospectos ya supera la capacidad del proceso actual. La respuesta no es agregar más herramientas encima de Leadsales, sino reemplazarlo por un sistema diseñado para <strong className="text-white/90 font-semibold">calificar, asignar y medir</strong> de forma automática. Por eso recomendamos <strong className="text-white/90 font-semibold">CRM Sixteam.pro Core</strong> con el agente IA integrado como el núcleo de la operación comercial.
              </p>
              <p>
                La implementación en 4 fases está diseñada para ser <strong className="text-white/90 font-semibold">gradual, medible y sin interrumpir la operación</strong>. Al cerrar el proceso, la plataforma opera con todos los flujos activos, los 7 asesores configurados y las métricas visibles para tomar decisiones con información real.
              </p>
            </div>
          </div>

          {/* Diferenciadores */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                titulo: 'Diagnóstico antes de propuesta',
                desc: 'Llegamos con el mapa de la operación ya trazado. El alcance responde directamente a las brechas identificadas en la reunión de diagnóstico, no a un catálogo estándar de servicios.',
                icon: Target,
              },
              {
                titulo: 'Experiencia en agencias de viaje',
                desc: 'Hemos trabajado con agencias afiliadas a ANATO. Conocemos el ciclo del viajero, los flujos de consulta por WhatsApp y los retos específicos del sector turístico colombiano.',
                icon: Plane,
              },
              {
                titulo: 'Acompañamiento real en la adopción',
                desc: 'No entregamos accesos y un tutorial. Configuramos, capacitamos y acompañamos hasta que la plataforma opere de forma autónoma y el equipo la use con confianza.',
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

          {/* Certificaciones */}
          <div className="mt-8 rounded-2xl p-6 sm:p-7"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <div className="sm:flex-1">
                <p className="font-poppins font-bold text-white/85 text-[16px] mb-1">Plataforma certificada internacionalmente</p>
                <p className="font-lato text-white/45 text-[14px] leading-relaxed">
                  La infraestructura sobre la que opera el CRM cumple los estándares más exigentes de seguridad, privacidad y disponibilidad a nivel global. Los datos de Vuela a la Vida y sus clientes están protegidos bajo controles auditados independientemente.
                </p>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap gap-3 flex-shrink-0">
                {[
                  { label: 'ISO 27001',    sub: 'Seguridad de la información' },
                  { label: 'SOC 2 Type II', sub: 'Controles de confianza'    },
                  { label: 'VAPT',          sub: 'Pruebas de penetración'     },
                  { label: 'SIG',           sub: 'Gestión de riesgos'         },
                ].map(({ label, sub }) => (
                  <div key={label} className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl"
                    style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}20`, minWidth: '80px' }}>
                    <span className="font-poppins font-black text-white text-[13px] leading-tight text-center">{label}</span>
                    <span className="font-lato text-white/35 text-[10px] leading-tight text-center">{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fórmula Sixteam */}
          <div className="mt-6 rounded-2xl p-6 text-center"
            style={{ background: `linear-gradient(135deg, ${ACCENT}06, #00bfa508)`, border: `1px solid ${ACCENT}15` }}>
            <p className="font-poppins font-black text-white/85 text-[1.05rem] tracking-widest uppercase">
              Process + Technology + People = <span style={{ color: ACCENT }}>Growth</span>
            </p>
            <p className="font-lato text-white/35 text-[14px] mt-2">La fórmula que Sixteam.pro aplica en cada proyecto.</p>
          </div>
        </section>

        {/* ─ 06 VIGENCIA Y TÉRMINOS ─ */}
        <section id="vigencia" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 — Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y Términos de la Propuesta</SectionTitle>
          <Rule />

          <div className="space-y-3">
            {[
              {
                titulo: 'Aprobación',
                desc: 'Para aceptar esta propuesta y dar inicio al proyecto, se requiere confirmación vía WhatsApp, correo o verbal para habilitar el enlace con el contrato a firmar y proceder.',
                icon: CheckCircle,
              },
              {
                titulo: 'Términos de Pago · Implementación',
                desc: 'Se sugiere un esquema del 50 % del valor de implementación para dar inicio al proyecto y el 50 % restante al finalizar la fase de puesta en marcha y capacitación.',
                icon: FileText,
              },
              {
                titulo: 'Términos de Pago · Licencia mensual',
                desc: 'La licencia mensual se factura de manera anticipada el primer día hábil de cada mes (o según lo pactado). Sin permanencia mínima tras finalizar la implementación.',
                icon: Calendar,
              },
              {
                titulo: 'Ajuste de precios de licencia',
                desc: 'Los precios están expresados en dólares estadounidenses (USD), exentos de IVA al ser servicios prestados desde el exterior. Cualquier ajuste en el valor de la licencia mensual será notificado con al menos un mes de anticipación.',
                icon: Info,
              },
              {
                titulo: 'Modificaciones al alcance',
                desc: 'Cualquier solicitud de integración o funcionalidad no contemplada explícitamente en el alcance requerirá una nueva cotización y puede afectar los tiempos de entrega.',
                icon: AlertCircle,
              },
              {
                titulo: 'Inicio del proyecto',
                desc: 'El cronograma de implementación comenzará a contar desde la recepción del pago inicial y la entrega de accesos e información necesaria para el proceso.',
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
        <div className="relative overflow-hidden border-t" style={{ borderColor: `${ACCENT}18` }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full"
              style={{ background: `radial-gradient(circle, ${ACCENT}08, transparent 65%)`, transform: 'translate(30%,-30%)' }} />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-16 sm:py-20 text-center">
            <TagLabel>¿Avanzamos?</TagLabel>
            <h2 className="font-poppins font-black text-white mt-4 mb-4 leading-tight"
              style={{ fontSize: 'clamp(2.25rem, 6.25vw, 4rem)' }}>
              ¿Lista Vuela a la Vida para dar el primer paso?
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
              <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-2">Contacto</p>
              <p className="font-lato text-white/35 text-[15px]">{META.correo}</p>
              <p className="font-lato text-white/35 text-[15px] mt-0.5">+57 300 450 7102</p>
            </div>
            <div>
              <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-2">Representante Legal</p>
              <p className="font-lato text-white/35 text-[15px]">{META.rl}</p>
              <p className="font-lato text-white/25 text-[14px] mt-0.5">Barranquilla, Colombia</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
            <p className="font-lato text-white/20 text-[13px]">
              Propuesta confidencial preparada para {META.cliente} · {META.fecha} · Sixteam.pro · Uso interno
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default VuelaALaVidaProposal;
