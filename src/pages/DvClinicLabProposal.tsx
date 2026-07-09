import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap, BarChart3,
  AlertCircle, TrendingUp,
  Calendar, Info, MapPin,
  MessageSquare, Users, LayoutDashboard,
  Rocket, Bot, Inbox, FlaskConical, Shield,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente:        'D.V. Clinic Lab',
  tagline:        'Laboratorio Clínico · IPS',
  sector:         'Laboratorio Clínico de Baja, Media y Alta Complejidad · Colombia',
  sede:           'Colombia',
  fecha:          'Julio 2026',
  lugar:          'Colombia',
  contacto:       'Sebastián Ramirez',
  proponente:     'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit:            '901.967.849-4',
  correo:         'alpha@sixteam.pro',
  rl:             'Samuel Armando Burgos Ferrer',
  objetivo:
    'Implementar un Empleado IA de Ventas dentro de la plataforma Sixteam.pro —con ChatCenter y base de datos de contactos— que atienda, cotice y agende en los horarios donde hoy no hay nadie respondiendo, liberando al equipo humano de la sobrecarga operativa.',
};

const DV_COLOR = '#0ea5e9';

const COP_RATE = 3357.82;
const cop = (usd: number) => `COP ${Math.round(usd * COP_RATE).toLocaleString('es-CO')}`;
const CREDITOS_MES = 60;
const PLAN_MENSUAL_USD = 199;

const HALLAZGOS = [
  {
    titulo: 'Sin cobertura en horarios nocturnos y fines de semana',
    desc: 'La atención de leads depende de una sola persona contratada para responder la línea de WhatsApp. Fuera de su horario laboral —noches y días no hábiles— no hay quién atienda, justo cuando llegan pacientes desde las campañas activas.',
    icon: MessageSquare, tint: 'red',
  },
  {
    titulo: 'Cerca del 50% de los leads de pauta sin atención adecuada',
    desc: 'De los 40 a 50 mensajes diarios que hoy llegan por WhatsApp desde la pauta —con proyección a 200–300 al día conforme escale la inversión—, aproximadamente la mitad no recibe seguimiento oportuno por sobrecarga del equipo.',
    icon: TrendingUp, tint: 'amber',
  },
  {
    titulo: 'Agendamiento, cotización y validación de exámenes manuales',
    desc: 'No existe un sistema de agendamiento en tiempo real ni una base de datos de clientes. Cada cotización, validación de examen disponible y agenda se gestiona a mano, sin trazabilidad ni cruce con la disponibilidad real.',
    icon: BarChart3, tint: 'blue',
  },
  {
    titulo: 'Sin trazabilidad entre pauta y ventas, ni seguimiento posventa',
    desc: 'No hay forma de identificar qué anuncio generó cada agenda, lo que limita la optimización de la inversión en pauta. Tampoco existe un proceso de remarketing para oportunidades evidentes, como ofrecer paquetes de maternos a pacientes con prueba de embarazo positiva.',
    icon: Info, tint: 'sky',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber:  { text: 'text-amber-400',   bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)' },
  blue:   { text: 'text-[#60a5fa]',   bg: 'rgba(96,165,250,.07)',  border: 'rgba(96,165,250,.18)' },
  red:    { text: 'text-[#f87171]',   bg: 'rgba(221,51,51,.07)',   border: 'rgba(221,51,51,.2)' },
  sky:    { text: 'text-[#0ea5e9]',   bg: 'rgba(14,165,233,.07)',  border: 'rgba(14,165,233,.2)' },
  purple: { text: 'text-[#a855f7]',   bg: 'rgba(168,85,247,.07)',  border: 'rgba(168,85,247,.2)' },
};

// ─── COMPONENTES DEL SISTEMA ──────────────────────────────────────────────────

const COMPONENTES = [
  {
    num: '01',
    nombre: 'Empleado IA de Ventas + ChatCenter + Base de datos de contactos',
    subtitulo: 'Atención 24/7 · Handoff a asesor humano',
    estado: 'ahora',
    icon: Bot,
    tint: 'sky',
    desc: 'Un agente de IA entrenado con las categorías de exámenes, precios y protocolos de D.V. Clinic Lab, disponible en el ChatCenter de la plataforma Sixteam.pro. Responde consultas, valida disponibilidad de exámenes, informa precios y agenda o entrega el contacto calificado al asesor humano para el cierre — con foco en cubrir los horarios donde hoy nadie atiende.',
    items: [
      'Agente IA entrenado con categorías principales de exámenes, precios y preguntas frecuentes del laboratorio',
      'Respuesta automática 24/7 por WhatsApp, incluyendo noches y días no laborales',
      'Validación de disponibilidad de exámenes y cotización informativa dentro de la conversación',
      'Calificación del lead y agendamiento o enlace directo al calendario',
      'Protocolo de handoff bot → asesor humano con el contexto completo para el cierre de la venta',
      'Base de datos de contactos: registro de cada persona que llega, con el canal y anuncio de origen',
      'ChatCenter para centralizar la atención de WhatsApp en una sola bandeja para el equipo',
      'Configuración de hasta 5 campos personalizados de contacto, visibles durante la conversación en el ChatCenter',
      'Panel de métricas con hasta 5 informes personalizados',
      '2 rondas de testing y ajuste fino antes del lanzamiento',
    ],
  },
  {
    num: '02',
    nombre: 'CRM Sixteam.pro',
    subtitulo: 'Pipelines de negocio · hasta 5 automatizaciones',
    estado: 'despues',
    icon: LayoutDashboard,
    tint: 'purple',
    desc: 'Cuando el laboratorio esté listo para escalar, el CRM Sixteam.pro se construye sobre el Empleado IA ya activo: agrega gestión de pipeline comercial, propiedades personalizadas del paciente y automatizaciones de remarketing — como ofrecer el paquete de maternos a quien tuvo un resultado positivo en la prueba de embarazo.',
    items: [
      'Pipeline comercial: seguimiento de cada oportunidad desde el primer contacto hasta el cierre',
      'Propiedades personalizadas del paciente: exámenes de interés, historial de visitas, tipo de paciente',
      'Hasta 5 automatizaciones de flujo — ej.: remarketing a pacientes con prueba de embarazo positiva (paquete maternos), reactivación de exámenes vencidos, alertas de seguimiento posventa',
      'Conexión ampliada a Instagram y Facebook dentro del ChatCenter omnicanal',
      'Informes de conversión y actividad comercial',
      'No incluido en el total de esta propuesta — se cotiza y activa de forma independiente cuando se requiera',
    ],
  },
];

// ─── PLAN DE TRABAJO ──────────────────────────────────────────────────────────

type Actividad = { text: string; tag?: string };

const FASES = [
  {
    num: '01',
    nombre: 'Contexto y Configuración',
    duracion: '1 semana · hasta semana 1',
    icon: FileText,
    color: DV_COLOR,
    colorAlpha: 'rgba(14,165,233,.12)',
    colorBorder: 'rgba(14,165,233,.3)',
    descripcion: 'Levantamos las categorías de exámenes, precios, promociones vigentes y protocolos de atención de D.V. Clinic Lab. Con esa información diseñamos el guion del agente IA y la estructura de la base de datos de contactos.',
    actividades: [
      { text: 'Sesión de kick-off y levantamiento de categorías de exámenes, precios y preguntas frecuentes', tag: 'Trabajo en conjunto' },
      { text: 'Revisión del proceso actual de atención por WhatsApp y del flujo de pauta activo' },
      { text: 'Diseño del guion inicial del agente IA y de las reglas de escalamiento al asesor humano' },
      { text: 'Diseño de la estructura de la base de datos de contactos y de los campos de origen' },
    ] as Actividad[],
  },
  {
    num: '02',
    nombre: 'Implementación del Empleado IA + ChatCenter',
    duracion: '2 semanas · hasta semana 3',
    icon: Bot,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.3)',
    descripcion: 'Con la información validada, se configura el agente IA, se conecta el número de WhatsApp Business al ChatCenter y se activa la base de datos de contactos. Antes del lanzamiento, se prueba el agente con casos reales del laboratorio y se ajustan las respuestas junto al equipo.',
    actividades: [
      { text: 'Configuración del agente IA con las categorías de exámenes, precios y protocolos definidos' },
      { text: 'Conexión oficial de WhatsApp Business al ChatCenter de la plataforma' },
      { text: 'Activación de la base de datos de contactos con registro de canal y anuncio de origen' },
      { text: 'Configuración de reglas de horario: atención IA 24/7 frente a escalamiento en horario hábil' },
      { text: 'Configuración del flujo de handoff bot → asesor humano' },
      { text: 'Testing interno del agente IA (ronda 1) con preguntas frecuentes reales de pacientes' },
      { text: 'Testing con el equipo de D.V. Clinic Lab (ronda 2) y ajuste de respuestas y tono' },
      { text: 'Validación del flujo de agendamiento y del handoff al asesor humano' },
    ] as Actividad[],
  },
  {
    num: '03',
    nombre: 'Capacitación al personal y puesta en marcha',
    duracion: '1 semana · hasta semana 4',
    icon: Rocket,
    color: '#f59e0b',
    colorAlpha: 'rgba(245,158,11,.10)',
    colorBorder: 'rgba(245,158,11,.3)',
    descripcion: 'Acompañamos al equipo en el arranque real del sistema, con capacitación y monitoreo activo durante las primeras semanas de operación.',
    actividades: [
      { text: '1 sesión de capacitación al equipo sobre el ChatCenter y la base de datos de contactos', tag: 'Trabajo en conjunto' },
      { text: 'Monitoreo activo del agente IA durante las primeras semanas de operación real' },
      { text: 'Corrección ágil de respuestas o ajustes que emerjan del uso real' },
      { text: 'Resolución de dudas vía canal dedicado durante toda la etapa' },
    ] as Actividad[],
  },
];

// ─── DESGLOSE EMPLEADO IA ──────────────────────────────────────────────────────

const DESGLOSE_IA = [
  {
    categoria: 'Agente IA Conversacional',
    icon: Bot,
    color: DV_COLOR,
    items: [
      'Entrenamiento con categorías de exámenes principales (no el listado completo), precios y promociones vigentes',
      'Respuestas a consultas informativas del laboratorio: horarios, sedes, preparación para exámenes',
      'Flujo de agendamiento o enlace de calendario para concretar la cita',
      'Handoff al asesor humano con el resumen de la conversación para cerrar la venta',
      'Atención automática activa 24/7, con foco en noches y fines de semana',
      'Reglas de horario para diferenciar la atención del bot de la atención humana en horario laboral',
      'Escalamiento inmediato al asesor humano en horario hábil cuando el lead esté calificado',
    ],
  },
  {
    categoria: 'ChatCenter y Base de Datos',
    icon: Inbox,
    color: '#00bfa5',
    items: [
      'Bandeja centralizada de WhatsApp Business para el equipo comercial',
      'Registro automático de cada contacto con su canal y anuncio de origen',
      'Identificación de la campaña activa conectada al mensaje entrante',
      'Historial de la conversación disponible para el asesor humano al tomar el caso',
      'Etiquetas para clasificar el estado del lead: nuevo, cotizando, agendado, atendido',
      'Configuración de hasta 5 campos personalizados de contacto, visibles durante la conversación en el ChatCenter',
    ],
  },
  {
    categoria: 'Panel de Métricas',
    icon: BarChart3,
    color: '#f59e0b',
    items: [
      'Panel de métricas con hasta 5 informes personalizados',
      'Visibilidad de actividad del equipo y estado de las conversaciones',
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

const DvClinicLabProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [faseActiva, setFaseActiva] = useState<number | null>(null);
  const [desgloseActivo, setDesgloseActivo] = useState<number | null>(null);
  const [compActivo, setCompActivo] = useState<number | null>(null);
  const [showDesgloseCompleto, setShowDesgloseCompleto] = useState(false);
  const [showCRM, setShowCRM] = useState(false);
  const [showPaqueteDetalle, setShowPaqueteDetalle] = useState(false);
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
            style={{ background: 'radial-gradient(circle, rgba(14,165,233,.06) 0%, transparent 65%)' }} />
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
              <div className="w-auto h-12 flex items-center justify-center rounded-lg px-2" style={{ background: 'rgba(255,255,255,.95)' }}>
                <img src="/logo-dv-clinic-lab.webp" alt="D.V. Clinic Lab" className="h-full w-auto object-contain"
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
              <TagLabel>Propuesta de trabajo y cotización · Julio 2026</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${DV_COLOR}, #1d70a2)` }}>
                  <FlaskConical className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: `rgba(14,165,233,.10)`, border: `1px solid rgba(14,165,233,.25)`, color: DV_COLOR }}>
                  {META.tagline}
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}>
                Propuesta<br />
                <span style={{ background: `linear-gradient(90deg,${DV_COLOR},#00bfa5)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
                  style={{ background: `radial-gradient(circle, rgba(14,165,233,.10) 0%, rgba(29,112,162,.05) 50%, transparent 70%)` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full" style={{ border: `1px solid rgba(14,165,233,.12)` }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(29,112,162,.15)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: DV_COLOR, boxShadow: `0 0 6px rgba(14,165,233,.8)` }} />
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
                  <div className="w-56 h-28 flex items-center justify-center p-3 rounded-xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,.92)', border: '1px solid rgba(255,255,255,.08)' }}>
                    <img src="/logo-dv-clinic-lab.webp" alt="D.V. Clinic Lab" className="w-full h-full object-contain"
                      style={{ filter: `drop-shadow(0 2px 20px rgba(14,165,233,.4))` }} />
                  </div>
                  <div className="text-center">
                    <span className="font-poppins font-black text-white text-[24px] tracking-tight">{META.cliente}</span>
                    <p className="font-lato text-[13px] uppercase tracking-[0.18em] mt-1" style={{ color: DV_COLOR }}>{META.tagline}</p>
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
            style={{ background: 'rgba(2,8,20,.85)', border: `1px solid rgba(14,165,233,.18)` }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-32 h-20 flex items-center justify-center p-2 rounded-xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,.92)', border: '1px solid rgba(255,255,255,.1)' }}>
                <img src="/logo-dv-clinic-lab.webp" alt="D.V. Clinic Lab" className="w-full h-full object-contain" />
              </div>
              <span className="font-poppins font-black text-white text-[14px] tracking-tight">{META.cliente}</span>
              <span className="font-lato text-[11px] uppercase tracking-[0.2em]" style={{ color: DV_COLOR }}>Colombia</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                <p className="font-poppins font-semibold text-white/80 text-[16px]">{META.sector}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Contacto</p>
                <p className="font-poppins font-semibold text-white/80 text-[16px]">{META.contacto} · Coordinador de Marketing y Publicidad</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Equipo actual</p>
                <p className="font-lato text-white/60 text-[15px]">1 persona atendiendo la línea de WhatsApp + agencia externa de marketing</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sistema de agendamiento actual</p>
                <p className="font-lato text-white/60 text-[15px]">Proceso manual · sin CRM ni base de datos</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Plataforma propuesta</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#00bfa5' }} />
                  <p className="font-poppins font-semibold text-[#00bfa5] text-[14px]">Empleado IA de Ventas + ChatCenter Sixteam.pro</p>
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
              D.V. Clinic Lab es un laboratorio clínico —IPS de baja, media y alta complejidad— que hoy centraliza toda su atención comercial por WhatsApp en una sola persona. Sebastián Ramirez, coordinador de marketing y publicidad del laboratorio y responsable de elegir la tecnología a implementar, se acercó a Sixteam.pro buscando{' '}
              <strong className="text-white/90 font-semibold">una ayuda que cubra los horarios en los que hoy nadie atiende</strong> —noches y días no laborales— sin sobrecargar aún más al equipo actual.
            </p>
            <p>
              En la reunión del 8 de julio de 2026, Sebastián compartió con Ernesto Hernandez y Samuel Burgos, del equipo de Sixteam.pro, los principales frenos del laboratorio: una persona que "no da abasto" con el volumen de mensajes que llegan desde la pauta publicitaria, la ausencia de un sistema de agendamiento y base de datos, y la falta de trazabilidad entre la inversión en campañas y las citas efectivamente agendadas. Esta propuesta responde directamente a esos frenos, priorizando lo que el laboratorio necesita hoy y dejando el camino trazado para lo que viene después.
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
              style={{ background: `radial-gradient(circle, rgba(14,165,233,.07), transparent 70%)`, transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 text-[#00bfa5] mb-4" />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[22px] leading-relaxed">
              Implementar un <strong className="text-white font-black">Empleado IA de Ventas</strong> dentro de la plataforma Sixteam.pro para D.V. Clinic Lab: un agente conversacional con ChatCenter y base de datos de contactos que responda, cotice y agende{' '}
              <em className="not-italic" style={{ color: DV_COLOR }}>las 24 horas, los 7 días de la semana</em>, incluyendo los horarios en los que hoy no hay nadie atendiendo — dejando listo el camino hacia un CRM completo como fase futura.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Componente activo', value: '1', sub: 'Empleado IA + ChatCenter · CRM a futuro' },
              { label: 'Cobertura', value: '24/7', sub: 'Noches y fines de semana' },
              { label: 'Mensajes/día proyectados', value: '200–300', sub: 'Según escale la pauta' },
              { label: 'Duración estimada', value: '4 sem', sub: '3 etapas de implementación' },
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
          <SectionTitle>1 componente activo · 1 fase futura</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            El sistema está diseñado para crecer por fases: <strong className="text-white/75">ahora</strong> se implementa el Empleado IA de Ventas, que resuelve el freno más urgente —la cobertura fuera de horario—, y queda como base para que, <strong className="text-white/75">más adelante</strong>, cuando el laboratorio lo requiera, el CRM Sixteam.pro se sume sin fricción sobre la misma plataforma.
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
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className={`font-lato text-[12px] uppercase tracking-widest ${t.text}`} style={{ opacity: 0.9 }}>Fase {c.num.replace(/^0/, '')}</span>
                        {c.estado === 'ahora' ? (
                          <span className="inline-flex items-center gap-1.5 font-poppins font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(0,191,165,.15)', border: '1px solid rgba(0,191,165,.4)', color: '#00bfa5' }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#00bfa5', boxShadow: '0 0 6px rgba(0,191,165,.8)' }} />
                            Ahora
                          </span>
                        ) : (
                          <span className="inline-flex items-center font-poppins font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.15)', color: 'rgba(255,255,255,.45)' }}>
                            Más adelante
                          </span>
                        )}
                      </div>
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

                      {i === 0 && (
                        <div className="mt-5 pt-5 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                          <div className="rounded-xl overflow-hidden transition-all duration-300"
                            style={{ border: showDesgloseCompleto ? `1px solid ${DV_COLOR}55` : '1px solid rgba(255,255,255,.07)' }}>
                            <button onClick={() => setShowDesgloseCompleto(v => !v)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200"
                              style={{ background: showDesgloseCompleto ? `${DV_COLOR}14` : 'transparent' }}>
                              <Info className="w-3.5 h-3.5 flex-shrink-0" style={{ color: showDesgloseCompleto ? DV_COLOR : 'rgba(255,255,255,.35)' }} />
                              <span className="font-lato text-[13px] flex-1" style={{ color: showDesgloseCompleto ? DV_COLOR : 'rgba(255,255,255,.4)' }}>
                                Detalle completo del alcance de implementación
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 flex-shrink-0"
                                style={{ color: showDesgloseCompleto ? DV_COLOR : 'rgba(255,255,255,.25)', transform: showDesgloseCompleto ? 'rotate(90deg)' : undefined }} />
                            </button>

                            {showDesgloseCompleto && (
                              <div className="px-4 pb-4 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                                <div className="pt-4 space-y-2.5">
                                  {DESGLOSE_IA.map((bloque, bi) => {
                                    const BIcon = bloque.icon;
                                    const bopen = desgloseActivo === bi;
                                    return (
                                      <div key={bi} className="rounded-xl overflow-hidden transition-all duration-300"
                                        style={{ background: 'rgba(255,255,255,.03)', border: bopen ? `1px solid ${bloque.color}44` : '1px solid rgba(255,255,255,.07)' }}>
                                        <button onClick={() => setDesgloseActivo(bopen ? null : bi)}
                                          className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                            style={{ background: bopen ? `${bloque.color}20` : 'rgba(255,255,255,.05)' }}>
                                            <BIcon className="w-4 h-4 transition-colors" style={{ color: bopen ? bloque.color : 'rgba(255,255,255,.35)' }} />
                                          </div>
                                          <div className="flex-1">
                                            <span className={`font-poppins font-bold text-[17px] ${bopen ? 'text-white' : 'text-white/70'}`}>{bloque.categoria}</span>
                                            <span className="font-lato text-white/30 text-[14px] ml-3">{bloque.items.length} ítems</span>
                                          </div>
                                          <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${bopen ? 'rotate-90' : ''}`}
                                            style={{ color: bopen ? bloque.color : 'rgba(255,255,255,.3)' }} />
                                        </button>
                                        {bopen && (
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
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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
          <SectionTitle>3 etapas · 4 semanas</SectionTitle>
          <Rule />

          {/* Timeline visual */}
          <div className="relative mb-10">
            <div className="hidden sm:block absolute left-[28px] top-10 bottom-10 w-px"
              style={{ background: `linear-gradient(to bottom, rgba(14,165,233,.4), rgba(0,191,165,.4), rgba(245,158,11,.4))` }} />

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
              El CRM Sixteam.pro (fase 2) no forma parte de este cronograma. Al construirse sobre el Empleado IA ya activo, su implementación futura no requiere reconfigurar el ChatCenter ni la base de datos de contactos ya en operación.
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
            Un pago único de implementación para el Empleado IA de Ventas, más un costo mensual que incluye la plataforma y el soporte y operaciones periódico. El CRM Sixteam.pro queda disponible como fase adicional para cuando el laboratorio esté listo para escalar. Valores en{' '}
            <strong className="text-white/75">dólares USD</strong>, con referencia en{' '}
            <strong className="text-white/75">pesos colombianos (COP)</strong> a la TRM de $3.357,82 por cada USD 1, vigente a la fecha de esta propuesta.
          </p>

          {/* Componente: Empleado IA */}
          <div className="rounded-xl p-5 sm:p-6 mb-4"
            style={{ background: 'rgba(14,165,233,.05)', border: '1px solid rgba(14,165,233,.22)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-5 pb-5 border-b"
              style={{ borderColor: 'rgba(14,165,233,.15)' }}>
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(14,165,233,.15)', border: '1px solid rgba(14,165,233,.3)' }}>
                  <Bot className="w-5 h-5" style={{ color: DV_COLOR }} />
                </div>
                <div>
                  <p className="font-poppins font-bold text-white/85 text-[17px]">Implementación de Empleado IA de Ventas</p>
                  <p className="font-lato text-white/40 text-[13px] mt-0.5">ChatCenter · base de datos · handoff a asesor humano</p>
                </div>
              </div>
              <div className="flex-shrink-0 sm:text-right">
                <p className="font-poppins font-black text-[1.8rem]" style={{ color: DV_COLOR }}>
                  USD 200<span className="font-lato font-normal text-white/40 text-[1rem]"> · único</span>
                </p>
                <p className="font-lato text-white/30 text-[12px] mt-0.5">≈ {cop(200)}</p>
              </div>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {[
                'Agente IA entrenado con categorías de exámenes, precios y protocolos de D.V. Clinic Lab',
                'ChatCenter conectado a WhatsApp Business para centralizar la atención del equipo',
                'Base de datos de contactos con canal y anuncio de origen de cada lead',
                'Atención automática 24/7 con foco en horarios no laborales',
                'Protocolo de handoff al asesor humano para el cierre de la venta',
                'Configuración de hasta 5 campos personalizados de contacto, visibles durante la conversación en el ChatCenter',
                'Panel de métricas con hasta 5 informes personalizados',
                '2 rondas de testing y ajuste fino antes del lanzamiento',
                'Pago único al inicio de la implementación',
                'Incluye ChatCenter conectado a WhatsApp y base de datos de contactos activa',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 flex-shrink-0 mt-[3px]" style={{ color: DV_COLOR }} />
                  <span className="font-lato text-white/55 text-[14px]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Plataforma mensual */}
          <div className="rounded-xl overflow-hidden mb-3"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(14,165,233,.15)' }}>
                <Zap className="w-4 h-4" style={{ color: DV_COLOR }} />
              </div>
              <div className="flex-1 flex flex-wrap items-center gap-2">
                <span className="font-poppins font-bold text-[16px] text-white">Plataforma mensual + Soporte y Operaciones</span>
                <span className="font-lato text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(14,165,233,.12)', border: '1px solid rgba(14,165,233,.25)', color: DV_COLOR }}>
                  Paquete Esencial Sixteam Ops · {CREDITOS_MES} créditos/mes
                </span>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-poppins font-black text-[15px]" style={{ color: DV_COLOR }}>
                  USD {PLAN_MENSUAL_USD}<span className="font-lato font-normal text-white/35 text-[12px]">/mes</span>
                </p>
                <p className="font-lato text-white/30 text-[11px]">≈ {cop(PLAN_MENSUAL_USD)}/mes + costos variables</p>
              </div>
            </div>
            <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
              <div className="pt-4 space-y-4">

                <ul className="space-y-1.5">
                  {[
                    'Agente IA activo 24/7 respondiendo en WhatsApp',
                    'ChatCenter conectado y base de datos de contactos actualizada',
                    '1 número de WhatsApp Business conectado a la plataforma bajo la conexión oficial de WhatsApp',
                    `${CREDITOS_MES} créditos mensuales de Soporte y Operaciones incluidos — Paquete Esencial Sixteam Ops`,
                    'Créditos no acumulables al período siguiente',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: DV_COLOR }} />
                      <span className="font-lato text-white/55 text-[14px]">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Cómo funciona + Ejemplo real — desplegable */}
                <div className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ border: showPaqueteDetalle ? '1px solid rgba(0,191,165,.35)' : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setShowPaqueteDetalle(v => !v)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200"
                    style={{ background: showPaqueteDetalle ? 'rgba(0,191,165,.06)' : 'transparent' }}>
                    <Info className="w-3.5 h-3.5 flex-shrink-0" style={{ color: showPaqueteDetalle ? '#00bfa5' : 'rgba(255,255,255,.35)' }} />
                    <span className="font-lato text-[13px] flex-1" style={{ color: showPaqueteDetalle ? '#00bfa5' : 'rgba(255,255,255,.4)' }}>
                      Cómo funciona el Paquete Esencial Sixteam Ops y ejemplo real de solicitud
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 flex-shrink-0"
                      style={{ color: showPaqueteDetalle ? '#00bfa5' : 'rgba(255,255,255,.25)', transform: showPaqueteDetalle ? 'rotate(90deg)' : undefined }} />
                  </button>

                  {showPaqueteDetalle && (
                    <div className="px-4 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <div className="pt-4 space-y-6">

                        {/* Cómo funciona el Paquete Esencial Sixteam Ops */}
                        <div>
                          <p className="font-poppins font-semibold text-white/80 text-[16px] mb-2 flex items-center gap-2">
                            <Info className="w-4 h-4 text-[#00bfa5]" /> Cómo funciona el Paquete Esencial Sixteam Ops
                          </p>
                          <p className="font-lato text-white/50 text-[14px] leading-relaxed mb-3">
                            El <strong className="text-white/70">Paquete Esencial Sixteam Ops</strong> incluye <strong className="text-white/70">{CREDITOS_MES} créditos por mes</strong> a un valor de <strong className="text-white/70">USD {PLAN_MENSUAL_USD} mensuales anticipados</strong> (≈ {cop(PLAN_MENSUAL_USD)} · aprox. USD 3,32 por crédito). Esos créditos se van consumiendo conforme el equipo de DV Clinic Lab realiza solicitudes a Sixteam — ya sea un ajuste al agente IA, una actualización de precios o categorías de exámenes, una nueva regla de agendamiento o cualquier otra tarea dentro del servicio. Los créditos <strong className="text-white/70">no son acumulables al período siguiente</strong>.
                          </p>
                          <div className="rounded-lg p-3 flex flex-col gap-2" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                            <p className="font-poppins font-semibold text-white/60 text-[13px] uppercase tracking-wider">Flujo de cada solicitud</p>
                            <div className="flex flex-col gap-1.5">
                              {[
                                { step: '01', text: 'El equipo de DV Clinic Lab envía la solicitud a Sixteam describiendo qué necesita (ej: "necesitamos que el bot informe la nueva promoción de perfil lipídico este mes")' },
                                { step: '02', text: 'Sixteam analiza la solicitud y responde con un presupuesto en créditos: cuántos se consumirán. El equipo decide si aprueba antes de que se ejecute cualquier trabajo.' },
                                { step: '03', text: 'El equipo aprueba y Sixteam ejecuta. Los créditos se descuentan del saldo disponible del período, que queda actualizado y visible en todo momento.' },
                              ].map((s) => (
                                <div key={s.step} className="flex items-start gap-3">
                                  <span className="font-poppins font-black text-[11px] px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                                    style={{ background: 'rgba(0,191,165,.15)', color: '#00bfa5' }}>{s.step}</span>
                                  <p className="font-lato text-white/50 text-[14px] leading-relaxed">{s.text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Ejemplo real de solicitud y respuesta */}
                        <div>
                          <p className="font-poppins font-semibold text-white/80 text-[16px] mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4" style={{ color: DV_COLOR }} />
                            Ejemplo real de solicitud y respuesta
                            <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wide align-middle"
                              style={{ background: 'rgba(14,165,233,.12)', border: '1px solid rgba(14,165,233,.3)', color: DV_COLOR }}>
                              Referencial
                            </span>
                          </p>
                          <div className="space-y-3">
                            <div className="rounded-lg p-3 flex gap-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                              <span className="font-poppins font-black text-[11px] px-2 py-0.5 rounded flex-shrink-0 h-fit mt-0.5"
                                style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.5)' }}>Sebastián</span>
                              <p className="font-lato text-white/55 text-[15px] leading-relaxed italic">
                                "Este mes tenemos promoción del 20% en perfil lipídico. Necesito que el bot la mencione cuando alguien pregunte por exámenes de laboratorio general."
                              </p>
                            </div>
                            <div className="rounded-lg p-3 flex gap-3" style={{ background: 'rgba(14,165,233,.06)', border: '1px solid rgba(14,165,233,.15)' }}>
                              <span className="font-poppins font-black text-[11px] px-2 py-0.5 rounded flex-shrink-0 h-fit mt-0.5"
                                style={{ background: 'rgba(14,165,233,.20)', color: DV_COLOR }}>Sixteam</span>
                              <p className="font-lato text-white/55 text-[15px] leading-relaxed italic">
                                "Recibido. Para actualizar el guion del agente con la nueva promoción necesitamos <strong className="text-white/75 not-italic">5 créditos</strong>. Te quedarían 55 créditos disponibles este mes. ¿Aprobamos?"
                              </p>
                            </div>
                            <div className="rounded-lg p-3 flex gap-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                              <span className="font-poppins font-black text-[11px] px-2 py-0.5 rounded flex-shrink-0 h-fit mt-0.5"
                                style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.5)' }}>Sebastián</span>
                              <p className="font-lato text-white/55 text-[15px] leading-relaxed italic">"Sí, aprobado."</p>
                            </div>
                            <p className="font-lato text-white/35 text-[13px] leading-relaxed pt-1">
                              Sixteam actualiza el guion del agente IA antes de que arranque la promoción. El agente queda respondiendo con la información nueva en cada conversación relevante.
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Plataforma Sixteam incluido con Soporte y Operaciones */}
          <div className="rounded-xl p-4 sm:p-5 mb-4 flex gap-3"
            style={{ background: 'rgba(14,165,233,.05)', border: '1px solid rgba(14,165,233,.2)' }}>
            <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: DV_COLOR }} />
            <div className="flex-1 min-w-0">
              <p className="font-poppins font-semibold text-white/80 text-[18px] mb-2">Plataforma Sixteam incluido con Soporte y Operaciones</p>
              <p className="font-lato text-white/50 text-[16px] leading-relaxed mb-3">
                Con el servicio de <strong className="text-white/70">Soporte y Operaciones de Sixteam</strong>, D.V. Clinic Lab tiene acceso a las funcionalidades de la <strong className="text-white/70">plataforma Sixteam.pro sin costo adicional de licencia</strong>. Las funcionalidades se van habilitando bajo solicitud — el equipo de DV Clinic Lab pide lo que necesita y Sixteam lo configura y activa.
              </p>

              {/* Acordeón costos variables */}
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

                            {/* Colombia destacado */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                                style={{ background: 'rgba(14,165,233,.08)', border: '1px solid rgba(14,165,233,.25)' }}>
                                <span className="font-poppins font-semibold text-white/90 text-[13px]">🇨🇴 Colombia</span>
                                <span className="font-lato text-white/45 text-[12px]">Marketing</span>
                                <span className="font-poppins font-bold text-[13px]" style={{ color: DV_COLOR }}>USD 0.0131</span>
                                <span className="font-lato text-white/30 text-[11px]">|</span>
                                <span className="font-lato text-white/45 text-[12px]">Utility</span>
                                <span className="font-poppins font-bold text-[13px]" style={{ color: DV_COLOR }}>USD 0.0008</span>
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
                                    ['🇨🇴 Colombia','0.0131','0.0008'],['🇦🇷 Argentina','0.0649','0.0273'],['🇧🇷 Brazil','0.0656','0.0071'],
                                    ['🇨🇱 Chile','0.0933','0.0210'],['🇪🇬 Egypt','0.0676','0.0038'],['🇫🇷 France','0.0902','0.0315'],
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
                                      style={{ background: market.includes('Colombia') ? 'rgba(14,165,233,.06)' : i % 2 === 0 ? 'rgba(255,255,255,.015)' : 'transparent' }}>
                                      <span className={`font-lato text-[13px] ${market.includes('Colombia') ? 'text-white/90 font-semibold' : 'text-white/60'}`}>{market}</span>
                                      <span className="font-poppins font-semibold text-[13px] text-right"
                                        style={{ color: market.includes('Colombia') ? DV_COLOR : 'rgba(255,255,255,.55)' }}>{marketing}</span>
                                      <span className="font-poppins font-semibold text-[13px] text-right"
                                        style={{ color: market.includes('Colombia') ? DV_COLOR : 'rgba(255,255,255,.55)' }}>{utility}</span>
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
                              style={{ border: showCalcIA ? `1px solid rgba(14,165,233,.35)` : '1px solid rgba(255,255,255,.07)' }}>
                              <button onClick={() => setShowCalcIA(v => !v)}
                                className="w-full flex items-center gap-2.5 px-4 py-3 text-left"
                                style={{ background: showCalcIA ? 'rgba(14,165,233,.06)' : 'transparent' }}>
                                <span className="font-lato text-[13px] flex-1" style={{ color: 'rgba(14,165,233,.7)' }}>
                                  + Calcular consumo mensual por uso de IA
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 flex-shrink-0"
                                  style={{ color: 'rgba(14,165,233,.5)', transform: showCalcIA ? 'rotate(90deg)' : undefined }} />
                              </button>
                              {showCalcIA && (
                                <div className="px-4 pb-4 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                                  <div className="pt-3 space-y-3">
                                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                                      style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: DV_COLOR }} />
                                      <span className="font-lato text-white/50 text-[13px]">Valor IA por mensaje</span>
                                      <span className="font-poppins font-black ml-auto text-[13px]" style={{ color: DV_COLOR }}>USD 0.02</span>
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
                                    <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: 'rgba(14,165,233,.12)' }}>
                                      <div>
                                        <span className="font-lato text-white/40 text-[11px]">Consumo estimado</span>
                                        <p className="font-lato text-white/25 text-[10px] mt-0.5">USD 0.02 × {mensajesConv} msg × {convsMes} conv</p>
                                      </div>
                                      <span className="font-poppins font-bold text-[14px]" style={{ color: DV_COLOR }}>≈ USD {consumoIAUSD}/mes</span>
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

          {/* CRM Sixteam.pro — Fase futura / opcional */}
          <div className="rounded-xl overflow-hidden transition-all duration-300 mb-3"
            style={{ background: 'rgba(255,255,255,.03)', border: showCRM ? '1px solid rgba(168,85,247,.4)' : '1px solid rgba(255,255,255,.08)' }}>
            <button onClick={() => setShowCRM(!showCRM)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: showCRM ? 'rgba(168,85,247,.18)' : 'rgba(255,255,255,.05)' }}>
                <LayoutDashboard className="w-4 h-4" style={{ color: showCRM ? '#a855f7' : 'rgba(255,255,255,.35)' }} />
              </div>
              <div className="flex-1 flex flex-wrap items-center gap-2">
                <span className={`font-poppins font-bold text-[16px] ${showCRM ? 'text-white' : 'text-white/65'}`}>
                  CRM Sixteam.pro · Fase 2
                </span>
                <span className="font-lato text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(168,85,247,.12)', border: '1px solid rgba(168,85,247,.25)', color: '#a855f7' }}>
                  Opcional · fase futura
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="font-poppins font-black text-[15px] text-[#a855f7]">
                    USD 300<span className="font-lato font-normal text-white/35 text-[12px]"> · único</span>
                  </p>
                  <p className="font-lato text-white/30 text-[11px]">≈ {cop(300)} · No incluido en el total actual</p>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                  style={{ color: 'rgba(168,85,247,.6)', transform: showCRM ? 'rotate(90deg)' : undefined }} />
              </div>
            </button>
            {showCRM && (
              <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                <div className="pt-4 space-y-4">
                  <p className="font-lato text-white/45 text-[15px] leading-relaxed">
                    Implementación de CRM Sixteam.pro con módulos y pipelines de negocio, sobre el Empleado IA ya activo. Incluye hasta 5 automatizaciones — pensadas para oportunidades como las que Sebastián identificó en la reunión, por ejemplo, el remarketing a pacientes con resultado positivo en prueba de embarazo ofreciéndoles el paquete de maternos.
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Pipeline comercial: seguimiento de cada oportunidad desde el primer contacto hasta el cierre',
                      'Propiedades personalizadas del paciente: exámenes de interés, historial de visitas, tipo de paciente',
                      'Hasta 5 automatizaciones de flujo configuradas por Sixteam.pro',
                      'Ejemplo de automatización: remarketing a pacientes con prueba de embarazo positiva ofreciendo el paquete de maternos',
                      'Conexión ampliada a Instagram y Facebook dentro del ChatCenter omnicanal',
                      'Informes de conversión y actividad comercial',
                      'Implementación de módulo de oportunidades con flujo comercial base',
                      'Hasta 10 campos personalizados',
                      'Un panel de informes con hasta 5 informes personalizados sobre oportunidades',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#a855f7] flex-shrink-0 mt-0.5" />
                        <span className="font-lato text-white/55 text-[14px]">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="font-lato text-white/30 text-[13px] leading-relaxed">
                    No incluido en el total de esta propuesta. Se cotiza y activa de forma independiente cuando D.V. Clinic Lab esté listo para escalar hacia la gestión de pipeline comercial.
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
              { titulo: 'Términos de pago', desc: `El Empleado IA de Ventas (USD 200 · ≈ ${cop(200)}) se paga como pago único al inicio de la implementación. La plataforma mensual (USD ${PLAN_MENSUAL_USD}/mes · ≈ ${cop(PLAN_MENSUAL_USD)}/mes, Paquete Esencial Sixteam Ops incluido) comienza a cobrarse una vez el sistema esté activo (go-live).`, icon: FileText },
              { titulo: 'Plataforma y alcance', desc: `El plan mensual de USD ${PLAN_MENSUAL_USD} incluye 1 número de WhatsApp Business conectado, el agente IA activo 24/7, el ChatCenter, la base de datos de contactos y ${CREDITOS_MES} créditos mensuales de Soporte y Operaciones (Paquete Esencial Sixteam Ops). Los créditos no son acumulables al período siguiente; el consumo adicional se cotiza aparte.`, icon: Users },
              { titulo: 'Referencia en pesos colombianos', desc: 'Los valores en COP mostrados en esta propuesta son referenciales, calculados a la TRM de $3.357,82 por cada USD 1 vigente a la fecha de emisión. La facturación se realiza en dólares USD; el equivalente en pesos puede variar según la TRM del día de cobro.', icon: Info },
              { titulo: 'CRM como fase futura', desc: `El CRM Sixteam.pro (USD 300 · ≈ ${cop(300)}, pago único) con pipelines de negocio y hasta 5 automatizaciones no está incluido en el total de esta propuesta. Queda disponible como fase adicional, a implementar cuando el laboratorio lo requiera.`, icon: LayoutDashboard },
              { titulo: 'Consumo de IA', desc: 'El consumo de mensajes procesados por el agente IA se cobra a USD 0,02 por mensaje y se factura según el consumo real del mes. La calculadora incluida en esta propuesta es una estimación referencial.', icon: Bot },
              { titulo: 'Costos de WhatsApp API', desc: 'Los mensajes enviados fuera de la ventana de 24h (recordatorios, campañas, seguimientos) son cobrados directamente por Meta/WhatsApp y se trasladan al cliente sin margen adicional.', icon: MessageSquare },
              { titulo: 'Modificaciones al alcance', desc: 'Cualquier solicitud de servicio, integración o funcionalidad no estipulada explícitamente en esta propuesta requerirá una cotización adicional y podrá afectar los tiempos de entrega.', icon: AlertCircle },
              { titulo: 'Permanencia mínima', desc: 'Aunque no existe cláusula de permanencia, Sixteam solicita establecer contractualmente un mínimo de 3 meses de prestación del servicio de la plataforma junto con el soporte y operaciones, como garantía del servicio. Este período puede cancelarse anticipadamente por fallas, errores o quejas del equipo de D.V. Clinic Lab hacia Sixteam.', icon: FileText },
              { titulo: 'Inicio del proyecto', desc: 'El cronograma comienza desde la recepción del pago de la implementación y la entrega de accesos e información necesaria por parte de D.V. Clinic Lab: categorías de exámenes, precios y protocolos de atención.', icon: Zap },
              { titulo: 'Vigencia de la propuesta', desc: 'Esta propuesta tiene una vigencia de 30 días calendario desde su fecha de emisión (Julio 2026). Pasado este plazo, los valores podrán ser revisados según condiciones del mercado.', icon: Clock },
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
              style={{ background: `radial-gradient(circle at 50% 100%, rgba(14,165,233,.05), transparent 70%)` }} />
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

export default DvClinicLabProposal;
