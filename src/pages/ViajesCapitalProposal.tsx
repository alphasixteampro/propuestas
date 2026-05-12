import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, ChevronRight, FileText, Target, Zap, BarChart3,
  MessageSquare, AlertCircle, TrendingUp, Mail, ArrowRight, Building2,
  Calendar, Hash, User, Info, Globe, MapPin, Plane,
  Database, Inbox, Settings, Users, Clock,
} from 'lucide-react';
import LogoCarousel from '../components/LogoCarousel';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const ACCENT = '#0ea5e9';
const ACCENT2 = '#0077b6';
const TRM_NUM = 4200;
const TRM = '4.200';
const IA_USD_POR_MSG = 0.02;

const META = {
  cliente: 'Viajes Capital',
  contacto: 'Andrés Moros',
  cargo: 'Gerente General',
  sector: 'Agencia de Viajes · Turismo · Hotelería',
  fundada: '2014',
  sede: 'Cali, Valle del Cauca',
  fecha: 'Mayo 2026',
  lugar: 'Barranquilla, Colombia',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  objetivo: 'Implementar CRM Sixteam.pro Core para centralizar, integrar y potenciar la operación comercial de la agencia.',
};

const HALLAZGOS = [
  {
    titulo: 'Plataformas operando como islas',
    desc: 'El booking engine, el CRM Viacap, el canal WapTrip y las redes sociales no se hablan entre sí. El equipo consulta múltiples sistemas para atender una sola consulta, perdiendo tiempo y trazabilidad en cada interacción.',
    icon: Database,
    tint: 'red',
  },
  {
    titulo: 'Herramientas insuficientes para la escala',
    desc: 'Las herramientas actuales no tienen la robustez que la operación requiere: no hay routing inteligente, los pipelines no están estructurados y los 25.000 registros de la base de clientes no se pueden segmentar ni activar.',
    icon: BarChart3,
    tint: 'amber',
  },
  {
    titulo: 'Seguimiento manual sin automatización',
    desc: 'El primer contacto y los seguimientos dependen de la disponibilidad y criterio de cada Travel Manager. Sin flujos automáticos, los leads enfrian y la base de clientes lleva meses sin recibir ninguna comunicación.',
    icon: MessageSquare,
    tint: 'blue',
  },
  {
    titulo: 'Sin visibilidad de indicadores clave',
    desc: 'No existe un panel unificado de KPIs. No es posible saber en tiempo real: leads por canal, tasa de cierre por asesor, ticket promedio por tipo de viaje ni el rendimiento general de la operación.',
    icon: AlertCircle,
    tint: 'red',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber: { text: 'text-amber-400', bg: 'rgba(251,191,36,.07)', border: 'rgba(251,191,36,.18)' },
  blue: { text: 'text-[#60a5fa]', bg: 'rgba(96,165,250,.07)', border: 'rgba(96,165,250,.18)' },
  red: { text: 'text-[#f87171]', bg: 'rgba(221,51,51,.07)', border: 'rgba(221,51,51,.2)' },
  teal: { text: 'text-[#00bfa5]', bg: 'rgba(0,191,165,.07)', border: 'rgba(0,191,165,.18)' },
};

const FASES = [
  {
    num: 'Fase 1',
    nombre: 'Consultoría en procesos comerciales y tecnología',
    duracion: '1–2 semanas',
    icon: FileText,
    recomendada: true,
    entregables: [
      'Auditoría del proceso comercial actual (atención, venta y seguimiento)',
      'Mapeo de herramientas tecnológicas en uso y brechas identificadas',
      'Definición de estructura CRM: etapas del pipeline, campos personalizados y responsables',
      'Diseño del flujo de atención desde primer contacto hasta cierre',
      'Configuración de usuarios y roles para el equipo operativo',
    ],
    detalle: [
      'Reunión de contexto con el equipo para mapear el proceso de atención y venta (hasta 2 horas).',
      'Diagnóstico de herramientas actuales: WapTrip, Viacap y canales digitales. Definición de qué se integra y cómo.',
      'Creación del modelo de datos con hasta 15 campos personalizados, 2 tarjetas de contacto y 1 pipeline de ventas con etapas definidas.',
      'Configuración de accesos para 3 usuarios operativos y conexión del canal WapTrip a la bandeja omnicanal centralizada.',
    ],
  },
  {
    num: 'Fase 2',
    nombre: 'Implementación CRM Sixteam.pro Core',
    duracion: '2–3 semanas',
    icon: Zap,
    recomendada: false,
    entregables: [
      'Conexión del número WapTrip a la bandeja omnicanal',
      'Reglas de asignación automática entre agentes por carga de trabajo',
      'Secuencias de seguimiento: 24 h, 3 días y 7 días post-consulta',
      'Respuestas automáticas fuera de horario configuradas',
      'Recordatorios automáticos de vencimiento de documentos de viaje',
    ],
    detalle: [
      'Configuración de hasta 5 automatizaciones críticas para el flujo comercial.',
      'Diseño del flujo de atención desde que entra el lead hasta que el asesor lo recibe con historial visible.',
      'Activación de secuencias automáticas de seguimiento con mensajes personalizados por tipo de consulta.',
      'Routing inteligente por carga de trabajo activo para todo el equipo de Travel Managers.',
    ],
  },
  {
    num: 'Fase 3',
    nombre: 'Elaboración del agente IA conversacional',
    duracion: '2–3 semanas',
    icon: MessageSquare,
    recomendada: false,
    entregables: [
      'Diseño del flujo conversacional para 1 línea de negocio (múltiples destinos)',
      'Entrenamiento del agente con preguntas clasificatorias de perfilamiento del lead',
      'Configuración del traspaso al asesor con resumen automático y tareas asignadas',
      'Flujo de agendamiento de citas entre lead y asesor',
      'Secuencias de reactivación para leads que dejan de responder',
    ],
    detalle: [
      'Diseño y mapeo del flujo conversacional adaptado al perfil de viajero de Viajes Capital.',
      'Entrenamiento del agente con preguntas clasificatorias: tipo de viaje, destino, presupuesto, fechas y número de viajeros.',
      'Configuración del traspaso al asesor: el bot genera un resumen de la conversación y crea tareas de seguimiento automáticamente.',
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
      'Panel de KPIs con métricas clave de la operación comercial',
      'Informes de rendimiento por asesor y por canal',
      'Pruebas de calidad de todos los flujos, automatizaciones y agente IA',
      'Capacitación funcional del equipo (hasta 5 horas)',
      'Guías de uso y documentación operativa entregadas',
      'Levantamiento de oportunidades de mejora: identificación de ajustes, funcionalidades y automatizaciones que impulsen la mejora continua y la proyección de crecimiento tecnológico de la operación',
    ],
    detalle: [
      'Configuración de hasta 5 informes personalizados: conversaciones por canal, tasa de cierre, ticket promedio y tiempo de respuesta.',
      'Pruebas de calidad de todos los flujos, automatizaciones y el agente IA antes de la entrega final.',
      'Sesión de capacitación con el equipo completo sobre el uso operativo del CRM y el agente IA (hasta 5 horas, grabadas y entregadas para consulta posterior).',
      'Entrega de guías de uso y documentación operativa por módulo.',
      'Sesión de cierre de proyecto: levantamiento de oportunidades de mejora, definición de próximos pasos y construcción de una hoja de ruta de crecimiento tecnológico alineada con los objetivos del negocio.',
    ],
  },
];

const SECCIONES = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'objetivo', label: 'Objetivo' },
  { id: 'plan', label: 'Plan de trabajo' },
  { id: 'cotizacion', label: 'Cotización' },
  { id: 'recomendacion', label: 'Recomendación' },
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
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: `linear-gradient(90deg,${ACCENT2},${ACCENT})` }} />
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const ViajesCapitalProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [faseActiva, setFaseActiva] = useState<number | null>(null);
  const [msgPerConv, setMsgPerConv] = useState(6);
  const [leadsPerMonth, setLeadsPerMonth] = useState(600);

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
            <div className={`rounded-full flex-shrink-0 transition-all duration-300 ${activeSection === s.id ? 'w-2 h-2 shadow-[0_0_6px_rgba(14,165,233,.7)]' : 'w-1.5 h-1.5 bg-white/50'}`}
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
          input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#0ea5e9;cursor:pointer;box-shadow:0 0 8px rgba(14,165,233,.6);border:2px solid #030d1a}
          input[type=range]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#0ea5e9;cursor:pointer;box-shadow:0 0 8px rgba(14,165,233,.6);border:2px solid #030d1a}
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
                  Turismo · Cali
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
                  { icon: MapPin, text: META.lugar },
                  { icon: Globe, text: META.sector },
                  { icon: Hash, text: `NIT ${META.nit}` },
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

            {/* — Derecha: Sixteam × Viajes Capital — */}
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

                {/* Viajes Capital */}
                <div className="flex flex-col items-center gap-1">
                  <div className="rounded-2xl px-5 py-3 flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,.97)', boxShadow: `0 4px 28px ${ACCENT}28` }}>
                    <img src="/viajes-capital-logo.png" alt="Viajes Capital"
                      className="h-14 w-auto object-contain max-w-[220px]"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <span className="font-poppins font-black text-white/30 text-[11px] uppercase tracking-[0.2em]">Viajes Capital</span>
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
                style={{ background: 'rgba(255,255,255,.95)', boxShadow: `0 4px 20px ${ACCENT}20` }}>
                <img src="/viajes-capital-logo.png" alt="Viajes Capital"
                  className="h-10 w-auto object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <span className="font-poppins font-black text-white text-[14px] tracking-tight">Viajes Capital</span>
              <span className="font-lato text-[11px] uppercase tracking-[0.18em] text-center" style={{ color: ACCENT }}>Desde 2014</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">{META.sector}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Trayectoria</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">12 años · 25.000 clientes</p>
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
              Viajes Capital lleva más de 12 años en el mercado del turismo con un motor de reservas propio de <strong className="text-white/90 font-semibold">10 tipos de producto</strong>, un equipo de <strong className="text-white/90 font-semibold">8 a 10 Travel Managers</strong> activos y una base de <strong className="text-white/90 font-semibold">25.000 clientes</strong>; activos reales que pocas agencias en Colombia han logrado construir.
            </p>
            <p>
              El diagnóstico, sin embargo, es claro: las herramientas existen, pero <strong className="text-white/90 font-semibold">no están integradas ni tienen el nivel de robustez</strong> que una operación de esta escala necesita. El booking engine, el canal WapTrip, el CRM Viacap y las redes sociales operan por separado, sin conectarse entre sí y sin automatización que soporte el volumen de consultas.
            </p>
            <p>
              La prioridad no es reemplazar lo que existe, sino <strong className="text-white/90 font-semibold">centralizar y conectar todo en una sola plataforma</strong> con la robustez, el routing inteligente y la visibilidad de datos que el equipo necesita para crecer ordenadamente. Para eso está el <strong className="text-white/90 font-semibold">CRM Sixteam.pro Core</strong>.
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

          {/* Quiénes somos y qué proponemos */}
          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden mb-6"
            style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${ACCENT}0a, transparent 70%)`, transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 text-[#00bfa5] mb-4" />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[22px] leading-relaxed mb-5">
              Sixteam.pro es una consultora en <span style={{ color: ACCENT }}>estrategia digital</span> especializada en diseñar e implementar soluciones de tecnología, transformación digital e inteligencia de negocios a la medida de cada empresa. No vendemos software genérico; construimos el sistema que cada operación necesita.
            </p>
            <div className="space-y-4 font-lato text-white/65 text-[17px] sm:text-[18px] leading-relaxed">
              <p>
                Tras analizar la operación de Viajes Capital, identificamos que el reto no es la falta de herramientas sino su <strong className="text-white/85 font-semibold">fragmentación e insuficiencia</strong>. Plataformas como Hibot, WapTrip y Viacap cumplen funciones puntuales, pero ninguna tiene la robustez ni la capacidad de integración que una operación de esta escala necesita para crecer de forma ordenada.
              </p>
              <p>
                Nuestra propuesta es implementar <strong className="text-white/85 font-semibold">CRM Sixteam.pro Core</strong> como la plataforma que reemplaza y unifica todo en un solo sistema. Esto significa que WapTrip, Hibot, Viacap y cualquier otra herramienta actualmente en uso quedan sustituidos por una solución con mayor capacidad operativa, totalmente integrada y diseñada para escalar junto con el crecimiento del negocio.
              </p>
            </div>
          </div>

          {/* Qué incluye CRM Sixteam.pro Core */}
          <p className="font-lato text-white/30 text-[13px] uppercase tracking-widest mb-4">Lo que incluye la plataforma</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: Inbox,
                titulo: 'Bandeja Omnicanal',
                desc: 'WapTrip (WhatsApp), Instagram y Facebook en un único inbox con routing automático por carga de trabajo entre todo el equipo.',
              },
              {
                icon: Database,
                titulo: 'CRM de Contactos y Pipeline',
                desc: 'Historial unificado de cada cliente, campos personalizados, etapas de venta definidas y seguimiento por tipo de producto.',
              },
              {
                icon: Zap,
                titulo: 'Automatizaciones y Seguimientos',
                desc: 'Secuencias automáticas 24h / 3d / 7d, respuestas fuera de horario, recordatorios de documentos y flujos de reactivación.',
              },
              {
                icon: BarChart3,
                titulo: 'Reportes y KPIs',
                desc: 'Panel de indicadores clave: leads por canal, tasa de cierre, tiempo de respuesta, ticket promedio y rendimiento por asesor.',
              },
              {
                icon: Users,
                titulo: 'Segmentación de Base',
                desc: 'Smart Lists dinámicas por perfil de viajero (Caribe, Europa, aventura, wellness) para activar campañas masivas desde la plataforma.',
              },
              {
                icon: Settings,
                titulo: 'Implementación a medida',
                desc: 'Todas las configuraciones necesarias para la estructura de Viajes Capital: departamentos, flujos, tipos de producto y roles del equipo.',
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
          <SectionTitle>4 fases · hasta 2 meses</SectionTitle>
          <Rule />

          {/* Pilares del servicio */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[
              { icon: FileText, titulo: 'Consultoría en procesos', desc: 'Auditoría, diagnóstico y diseño del modelo operativo comercial y tecnológico.' },
              { icon: Settings, titulo: 'Implementación CRM', desc: 'Configuración completa del CRM, integraciones omnicanal y automatizaciones.' },
              { icon: MessageSquare, titulo: 'Agente IA conversacional', desc: 'Diseño y entrenamiento del chatbot para atención, perfilamiento y seguimiento.' },
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
                    <p className={`font-lato text-[13px] leading-tight mt-0.5 max-w-[80px] ${f.recomendada ? 'text-[#00bfa5]' : 'text-white/30'}`}>{f.duracion}</p>
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
            Valores en <strong className="text-white/75">pesos colombianos (COP)</strong>. No incluye pauta publicitaria ni créditos de WhatsApp API.
          </p>

          {/* Implementación */}
          <TagLabel>Implementación · Pago único</TagLabel>
          <Rule />
          <div className="rounded-xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:items-center"
            style={{ background: 'rgba(14,165,233,.05)', border: `1px solid ${ACCENT}20` }}>
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
              <p className="font-poppins font-black text-[#00bfa5] text-[2rem]">COP 6.400.000<span className="font-lato font-normal text-white/40 text-[1rem]"> + IVA</span></p>
            </div>
            <div className="sm:w-1/3">
              <ul className="space-y-1">
                {[
                  'Configuración completa de la plataforma',
                  'Integración del canal WapTrip',
                  'Automatizaciones y flujos configurados',
                  'Agente de IA conversacional (1 línea de negocio)',
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

          {/* Agente IA — incluido en implementación */}
          <div className="rounded-xl p-5 sm:p-6 mb-8"
            style={{ background: 'linear-gradient(135deg, rgba(14,165,233,.07), rgba(0,191,165,.04))', border: `1px solid ${ACCENT}22` }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${ACCENT}15`, border: `1px solid ${ACCENT}30` }}>
                <MessageSquare className="w-4 h-4" style={{ color: ACCENT }} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="font-poppins font-bold text-white text-[17px]">Agente de IA conversacional</p>
                  <span className="px-2 py-0.5 rounded-full font-lato text-[11px] uppercase tracking-wider"
                    style={{ background: 'rgba(0,191,165,.15)', border: '1px solid rgba(0,191,165,.35)', color: '#00bfa5' }}>
                    Incluido en implementación
                  </span>
                </div>
                <p className="font-lato text-white/40 text-[14px]">Entrenamiento de 1 agente · 1 línea de negocio · múltiples destinos según necesidad</p>
              </div>
            </div>
            <p className="font-lato text-white/55 text-[15px] leading-relaxed mb-4">
              Se diseña, entrena e implementa un agente de inteligencia artificial conversacional adaptado a la operación de Viajes Capital, capaz de atender, clasificar y dar seguimiento a leads de forma autónoma dentro del canal de WhatsApp.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  titulo: 'Perfilamiento del lead',
                  desc: 'Atención inicial con preguntas clasificatorias para identificar tipo de viajero, presupuesto, destino y fecha de viaje.',
                },
                {
                  titulo: 'Traspaso con contexto al asesor',
                  desc: 'Al cerrar el primer contacto, genera un resumen y desglose de actividades en forma de tareas asignadas al asesor.',
                },
                {
                  titulo: 'Agendamiento de citas',
                  desc: 'Puede coordinar y agendar citas entre el lead y un asesor humano cuando el cliente lo solicita o el bot lo detecta necesario.',
                },
                {
                  titulo: 'Flujo de seguimiento a silenciosos',
                  desc: 'Activa secuencias automáticas de reactivación para leads que dejan de responder durante el proceso de atención.',
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

          {/* Licencia mensual */}
          <TagLabel>Licencia mensual · CRM Sixteam.pro Core</TagLabel>
          <Rule />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
                  COP 900.000<span className="text-[18px] font-lato font-normal text-white/40">/mes</span>
                </p>
              </div>
              <ul className="space-y-1.5 flex-1">
                {[
                  '3 usuarios operativos incluidos',
                  '1 número de WhatsApp conectado',
                  'Bandeja omnicanal (WhatsApp, Instagram, Facebook)',
                  'CRM de contactos con campos personalizados',
                  'Pipeline de ventas con etapas y responsables',
                  'Smart Lists y segmentación dinámica',
                  'Automatizaciones base activas',
                  'Informes y panel de KPIs',
                  'Agente de IA conversacional',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-[#00bfa5] flex-shrink-0 mt-[3px]" />
                    <span className="font-lato text-white/60 text-[15px]">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 rounded-lg px-3.5 py-3 flex items-start gap-2.5"
                style={{ background: 'rgba(14,165,233,.06)', border: '1px solid rgba(14,165,233,.18)' }}>
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: ACCENT }} />
                <p className="font-lato text-white/45 text-[13px] leading-relaxed">
                  El agente de IA tiene un <span className="text-white/70 font-semibold">costo adicional variable</span> según el volumen de conversaciones procesadas, facturado aparte de la licencia mensual.
                </p>
              </div>
            </div>
            {/* Usuarios adicionales */}
            <div className="rounded-xl p-5 flex flex-col gap-4"
              style={{ background: `rgba(14,165,233,.06)`, border: `1px solid ${ACCENT}20` }}>
              <div>
                <p className="font-poppins font-bold text-[15px] uppercase tracking-wider mb-1" style={{ color: ACCENT }}>Usuarios adicionales</p>
                <p className="font-poppins font-black text-white text-3xl">
                  COP 99.000<span className="text-[18px] font-lato font-normal text-white/40">/usuario/mes</span>
                </p>
              </div>
              <p className="font-lato text-white/55 text-[15px] leading-relaxed">
                El plan base incluye 3 usuarios operativos. Cada Travel Manager adicional que necesite acceso a la plataforma se agrega a este valor mensual, sin permanencia mínima.
              </p>
              <div className="rounded-lg p-4 mt-auto"
                style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}18` }}>
                <p className="font-lato text-white/45 text-[14px] leading-relaxed">
                  <span className="font-semibold text-white/65">Ejemplo:</span> Para 5 usuarios operativos totales, el plan mensual sería COP 900.000 + 2 × COP 99.000 = COP 1.098.000.
                </p>
              </div>
            </div>
          </div>

          {/* Resumen de inversión */}
          <div className="rounded-2xl p-6 sm:p-7" style={{ background: `${ACCENT}06`, border: `1px solid ${ACCENT}20` }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
              <div>
                <p className="font-lato text-white/40 text-[13px] uppercase tracking-wider mb-1">Implementación (una sola vez)</p>
                <p className="font-poppins font-black text-white text-[1.6rem]">COP 6.400.000<span className="text-white/40 text-[1rem] font-lato font-normal"> + IVA</span></p>
              </div>
              <div>
                <p className="font-lato text-white/40 text-[13px] uppercase tracking-wider mb-1">Licencia mensual (base 3 usuarios)</p>
                <p className="font-poppins font-black text-white text-[1.6rem]">COP 900.000<span className="text-white/40 text-[1rem] font-normal">/mes</span></p>
                <p className="font-lato text-[12px] mt-1" style={{ color: 'rgba(0,191,165,.7)' }}>Exento de IVA</p>
              </div>
            </div>
            <div className="pt-5 border-t border-white/06 flex flex-wrap gap-4">
              {[
                'Sin permanencia mínima tras la implementación',
                'Usuarios adicionales: COP 99.000 c/u al mes',
                'Implementación + IVA · licencia mensual exenta de IVA',
              ].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5]" />
                  <span className="font-lato text-white/55 text-[13px]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── CALCULADORA IA ── */}
          <div className="rounded-2xl overflow-hidden mt-8 mb-2"
            style={{ background: 'rgba(255,255,255,.03)', border: `1px solid ${ACCENT}30` }}>
            <div className="px-5 py-4 flex items-center gap-2"
              style={{ background: `linear-gradient(135deg, ${ACCENT}14, ${ACCENT2}0d)`, borderBottom: '1px solid rgba(255,255,255,.05)' }}>
              <Zap className="w-4 h-4" style={{ color: ACCENT }} />
              <p className="font-poppins font-semibold text-white/80 text-[15px] uppercase tracking-wider">Calculadora de consumo mensual IA</p>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
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
            </div>
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
                  Desde COP 800.000<span className="text-[18px] font-lato font-normal text-white/40">/mes</span>
                </p>
              </div>
              <p className="font-lato text-white/55 text-[14px] leading-relaxed sm:flex-1">
                Gestión y ejecución de pauta digital en Meta Ads (Facebook e Instagram). Incluye configuración de campañas, segmentación de audiencias y reporte mensual de resultados.
              </p>
            </div>

            {/* Soporte y Operaciones · paquete 5 horas */}
            <div className="rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row gap-5 sm:items-center mb-4"
              style={{ background: `rgba(14,165,233,.05)`, border: `1px solid ${ACCENT}22` }}>
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
                  COP 650.000<span className="text-[18px] font-lato font-normal text-white/40"> + IVA</span>
                </p>
                <p className="font-lato text-[12px] mt-1" style={{ color: `${ACCENT}bb` }}>5 horas · pago único</p>
              </div>
              <p className="font-lato text-white/55 text-[14px] leading-relaxed sm:flex-1">
                Bloque de 5 horas para ajustes, mejoras y soporte operativo sobre la plataforma implementada. Cubre modificaciones de flujos, incorporación de nuevas automatizaciones, revisión de reportes y asistencia técnica al equipo.
              </p>
            </div>

            {/* Manejo de base de datos · por cotización */}
            <div className="rounded-xl p-5 flex flex-col sm:flex-row gap-4 sm:items-center"
              style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.1)' }}>
              <div className="flex items-center gap-3 sm:w-2/5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)' }}>
                  <Database className="w-4 h-4 text-white/45" />
                </div>
                <div>
                  <p className="font-poppins font-bold text-white/80 text-[16px]">Manejo y migración de base de datos</p>
                  <p className="font-lato text-white/35 text-[13px] mt-0.5">Importación, limpieza y estructuración desde Viacap</p>
                </div>
              </div>
              <div className="sm:flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="self-start px-3 py-1.5 rounded-full font-poppins font-bold text-[12px] uppercase tracking-wider whitespace-nowrap"
                  style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.15)', color: 'rgba(255,255,255,.55)' }}>
                  Valor por cotización
                </span>
                <p className="font-lato text-white/40 text-[14px] leading-relaxed">
                  El alcance y valor de este servicio se cotiza según el volumen y estado de los datos existentes.
                </p>
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
                No somos una empresa de software que vende licencias. Somos una <strong className="text-white/90 font-semibold">consultora en estrategia digital</strong> que identifica los cuellos de botella de una operación y diseña la solución tecnológica más adecuada para resolverlos, ya sea con herramientas propias o con las que el cliente ya utiliza.
              </p>
              <p>
                En el caso de Viajes Capital, el diagnóstico fue claro: las herramientas existen pero <strong className="text-white/90 font-semibold">no están integradas y no tienen la robustez necesaria</strong>. La respuesta no es agregar más software sino consolidar todo en una plataforma diseñada para la escala de esta operación. Por eso recomendamos <strong className="text-white/90 font-semibold">CRM Sixteam.pro Core</strong>: no simplemente porque sea nuestro producto, sino porque tras el análisis es la solución que mejor responde a las necesidades actuales y que ofrece mayor capacidad de crecimiento a futuro.
              </p>
              <p>
                La implementación en 4 fases está diseñada para ser <strong className="text-white/90 font-semibold">gradual, medible y no invasiva</strong>. El equipo sigue operando mientras se configura cada componente y, al cerrar el proceso, la plataforma queda activa con todos los flujos encendidos, los datos organizados y las métricas visibles para tomar decisiones con información real.
              </p>
            </div>
          </div>

          {/* Diferenciadores */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                titulo: 'Diagnóstico antes de propuesta',
                desc: 'Llegamos con el mapa de la operación ya trazado. El alcance de implementación responde directamente a las brechas identificadas, no a un catálogo estándar de servicios.',
                icon: Target,
              },
              {
                titulo: 'Experiencia en el sector',
                desc: 'Hemos trabajado con agencias afiliadas a ANATO. Conocemos el ciclo del viajero, los flujos de documentación, las temporadas y los retos específicos del turismo colombiano.',
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

          {/* Confianza en la plataforma */}
          <div className="mt-8 rounded-2xl p-6 sm:p-7"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <div className="sm:flex-1">
                <p className="font-poppins font-bold text-white/85 text-[16px] mb-1">Plataforma certificada internacionalmente</p>
                <p className="font-lato text-white/45 text-[14px] leading-relaxed">
                  La infraestructura sobre la que opera el CRM cumple los estándares más exigentes de seguridad, privacidad y disponibilidad a nivel global. Los datos de Viajes Capital y sus clientes están protegidos bajo controles auditados independientemente.
                </p>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap gap-3 flex-shrink-0">
                {[
                  { label: 'ISO 27001', sub: 'Seguridad de la información' },
                  { label: 'SOC 2 Type II', sub: 'Controles de confianza' },
                  { label: 'VAPT', sub: 'Pruebas de penetración' },
                  { label: 'SIG', sub: 'Gestión de riesgos' },
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
                desc: 'Los precios están expresados en pesos colombianos (COP). Cualquier ajuste en el valor de la licencia mensual será notificado con al menos un mes de anticipación.',
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
              ¿Lista Viajes Capital para dar el primer paso?
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

export default ViajesCapitalProposal;
