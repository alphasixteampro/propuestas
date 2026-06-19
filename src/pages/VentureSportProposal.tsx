import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap, BarChart3,
  AlertCircle, TrendingUp, Info, Calendar, MapPin,
  Rocket, Users, MessageSquare, Database, Bot, Shield, Send,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Venture Sport USA',
  tagline: 'Becas Deportivas en EE.UU.',
  sector: 'Becas · Deporte · Educación · Chile',
  sede: 'Chile / Estados Unidos',
  fecha: 'Junio 2026',
  lugar: 'Chile',
  objetivo: 'Automatizar la calificación de prospectos y escalar sin colapsar operativamente',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
};

const VS_GREEN = '#22c55e';

const HALLAZGOS = [
  {
    titulo: 'Colapso operativo tras publicación viral',
    desc: 'Un carrusel explotó en Instagram y generó cientos de mensajes. Al responder manualmente de forma similar a todos, el filtro de Instagram detectó comportamiento de bot y bloqueó la cuenta. Sin automatización, el crecimiento se convierte en un riesgo.',
    icon: AlertCircle, tint: 'red',
  },
  {
    titulo: 'Sin tiempo ni margen de error para implementar',
    desc: 'Nico conoce herramientas como ManyChat pero no dispone del tiempo para configurarlas él mismo. Tampoco quiere arriesgarse a cometer errores que dañen el proceso comercial que ha construido por años de trabajo y recomendaciones.',
    icon: Clock, tint: 'amber',
  },
  {
    titulo: 'Sin calificación de prospectos: el 66% no convierte',
    desc: 'De 300 mensajes recibidos tras la publicación viral, Nico estima que al menos 200 son personas que no cumplen el perfil: padres con hijos de 8 a 11 años, personas que solo buscan información general. No hay ningún filtro automatizado.',
    icon: TrendingUp, tint: 'blue',
  },
  {
    titulo: 'Pérdida de contactos sin base de datos estructurada',
    desc: 'Los prospectos que aún no están listos para contratar se pierden por falta de seguimiento. Nico quiere conservar esa información para acciones de remarketing y para cruzarla con su otro negocio de implementos deportivos.',
    icon: Database, tint: 'teal',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber: { text: '#f59e0b',   bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)' },
  teal:  { text: '#00bfa5',   bg: 'rgba(0,191,165,.07)',   border: 'rgba(0,191,165,.18)' },
  blue:  { text: '#3b82f6',   bg: 'rgba(59,130,246,.07)',  border: 'rgba(59,130,246,.18)' },
  red:   { text: '#f87171',   bg: 'rgba(221,51,51,.07)',   border: 'rgba(221,51,51,.2)' },
};

// ─── ETAPAS ──────────────────────────────────────────────────────────────────

type Actividad = { text: string; tag?: string };

const ETAPAS = [
  {
    num: '01',
    nombre: 'Kickoff y construcción de la base de conocimientos',
    duracion: '1 semana',
    icon: FileText,
    color: VS_GREEN,
    colorAlpha: 'rgba(34,197,94,.12)',
    colorBorder: 'rgba(34,197,94,.3)',
    descripcion: 'El bot es tan bueno como la información que tiene. En esta fase levantamos toda la inteligencia del negocio de Nico: preguntas frecuentes, objeciones comunes, perfil del prospecto ideal y el proceso completo de obtención de becas. Con eso construimos la base de conocimientos que alimentará al agente.',
    actividades: [
      { text: 'Sesión de briefing con el equipo de Venture Sport USA para mapear preguntas frecuentes, objeciones y el perfil del prospecto ideal', tag: 'Trabajo conjunto' },
      { text: 'Levantamiento de toda la información del servicio: proceso de obtención de becas, requisitos, costos, tiempos y casos de éxito' },
      { text: 'Definición de los criterios de calificación: ¿qué hace que un prospecto sea ideal? (edad, nivel deportivo, disposición económica, etc.)' },
      { text: 'Diseño del flujo de conversación: saludo, preguntas de filtro, entrega de información, asignación a humano o seguimiento automático' },
      { text: 'Construcción del documento base de conocimientos validado con el equipo antes de proceder a la configuración técnica', tag: 'Aprobación conjunta' },
    ] as Actividad[],
  },
  {
    num: '02',
    nombre: 'Configuración del Agente Conversacional con IA',
    duracion: '1 semana',
    icon: Bot,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.3)',
    descripcion: 'Con la base de conocimientos construida, configuramos el agente conversacional en GoHighLevel. El bot no solo responde preguntas: califica, filtra, guarda datos y asigna tareas al equipo cuando un prospecto realmente vale la pena.',
    actividades: [
      { text: 'Configuración del agente IA en GoHighLevel con la base de conocimientos elaborada en la Fase 01' },
      { text: 'Programación del flujo de calificación de prospectos: preguntas de filtro, respuestas condicionales y rutas según el perfil' },
      { text: 'Configuración de captura automática de datos: nombre, edad del deportista, nivel, país de residencia y disponibilidad' },
      { text: 'Configuración de escalamiento a humano cuando el prospecto califica como potencial cliente real', tag: 'Clave' },
      { text: 'Configuración de seguimientos automáticos para prospectos que no completaron el flujo o dijeron "aún no"' },
      { text: 'Configuración de la base de datos en GoHighLevel: organización, etiquetas y segmentación de prospectos' },
    ] as Actividad[],
  },
  {
    num: '03',
    nombre: 'Automatizaciones de Instagram',
    duracion: '3 a 5 días',
    icon: Send,
    color: '#a78bfa',
    colorAlpha: 'rgba(167,139,250,.10)',
    colorBorder: 'rgba(167,139,250,.3)',
    descripcion: 'Conectamos el agente conversacional a los DMs de Instagram. Cuando alguien comenta una palabra clave en una publicación (como "beca"), el bot le escribe automáticamente y arranca el flujo de calificación. Así Nico puede publicar contenido con CTAs sin miedo a que le bloqueen la cuenta.',
    actividades: [
      { text: 'Configuración de la automatización de respuesta en comentarios: DM automático al comentar una palabra clave', tag: 'Solución al colapso' },
      { text: 'Conexión del agente conversacional con los DMs de Instagram para activar el flujo de calificación' },
      { text: 'Configuración inicial para una publicación o campaña de contenido activa' },
      { text: 'Prueba técnica completa con publicaciones de prueba antes del lanzamiento en vivo', tag: 'Aprobación conjunta' },
    ] as Actividad[],
  },
  {
    num: '04',
    nombre: 'Pruebas, ajustes y entrega en vivo',
    duracion: '1 semana',
    icon: Rocket,
    color: '#f59e0b',
    colorAlpha: 'rgba(245,158,11,.10)',
    colorBorder: 'rgba(245,158,11,.3)',
    descripcion: 'Antes de lanzar, el equipo de Nico recorre los flujos como si fuera un prospecto real. Ajustamos respuestas, textos y criterios de calificación según el feedback. La entrega incluye una sesión de revisión post-lanzamiento para cerrar el ciclo de implementación.',
    actividades: [
      { text: 'Sesión de pruebas con Nico y su equipo: recorrer todos los flujos como prospectos reales', tag: 'Trabajo conjunto' },
      { text: 'Ajuste de respuestas, textos del bot y criterios de calificación según el feedback recibido' },
      { text: 'Documentación del sistema: cómo monitorear el bot, interpretar los indicadores y escalar a humano desde GoHighLevel' },
      { text: 'Lanzamiento en vivo con la primera publicación activada y el agente operativo' },
      { text: 'Primera sesión de revisión post-lanzamiento incluida para ajustar en base a interacciones reales' },
    ] as Actividad[],
  },
];

// ─── DESGLOSE ────────────────────────────────────────────────────────────────

const DESGLOSE = [
  {
    categoria: 'Agente Conversacional con IA (Chatbot Sixteam)',
    icon: Bot,
    color: VS_GREEN,
    items: [
      'Agente entrenado con toda la información del proceso de becas deportivas en EE.UU. de Venture Sport USA',
      'Flujo de conversación diseñado para calificar prospectos: edad del deportista, nivel, disponibilidad económica y ubicación',
      'Respuesta automática a preguntas frecuentes de forma natural y personalizada con el tono de la marca',
      'Escalamiento automático a un asesor humano cuando el prospecto cumple el perfil ideal de cliente',
      'Asignación de tareas al equipo cuando se genera un prospecto calificado: recordatorio de llamada, envío de información, seguimiento',
      'Seguimientos automáticos para prospectos que no completaron el flujo o manifestaron interés futuro',
      'Construcción colaborativa de la base de conocimientos: el equipo de Nico comparte la información, Sixteam la estructura y entrena al bot',
      'Configuración completa en la plataforma GoHighLevel',
    ],
  },
  {
    categoria: 'Automatizaciones de Instagram',
    icon: Send,
    color: '#a78bfa',
    items: [
      'Automatización de respuesta en comentarios: DM automático cuando alguien comenta una palabra clave (ej. "beca") en una publicación',
      'Activación del flujo del agente conversacional desde el DM de Instagram para comenzar la calificación inmediatamente',
      'Diseño del mensaje inicial diferenciado según el tipo de publicación o campaña de contenido',
      'Configuración inicial para una publicación activa incluida en la implementación',
      'Publicaciones o flujos adicionales para otras campañas: gestionados a través de créditos de Soporte y Operaciones',
    ],
  },
  {
    categoria: 'GoHighLevel + Soporte y Operaciones Sixteam',
    icon: Shield,
    color: '#00bfa5',
    items: [
      'Acceso a GoHighLevel incluido con la contratación del servicio de Soporte y Operaciones',
      'Base de datos de prospectos centralizada: nombre, datos de contacto, perfil, etapa en el funnel y clasificación (califica / no califica / seguimiento)',
      'Historial completo de conversaciones por prospecto disponible para el equipo de Venture Sport USA',
      'Monitoreo continuo del comportamiento del bot: detección de respuestas incorrectas, flujos rotos o prospectos sin atender',
      'Levantamiento periódico de oportunidades de mejora y propuestas de ajuste',
      'Elaboración de configuraciones adicionales y nuevas automatizaciones según las solicitudes del equipo',
      'Feedback transparente sobre el costo en créditos antes de ejecutar cada solicitud',
      'Remarketing: prospectos no calificados quedan en la base de datos para campañas futuras o cruce con otros negocios de Nico',
    ],
  },
];

const SECCIONES = [
  { id: 'resumen',    label: 'Resumen' },
  { id: 'solucion',   label: 'Solución' },
  { id: 'plan',       label: 'Plan' },
  { id: 'alcance',    label: 'Alcance' },
  { id: 'cotizacion', label: 'Inversión' },
  { id: 'vigencia',   label: 'Vigencia' },
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

const VentureSportProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [etapaActiva, setEtapaActiva] = useState<number | null>(null);
  const [desgloseActivo, setDesgloseActivo] = useState<number | null>(null);

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
            style={{ background: 'radial-gradient(circle, rgba(34,197,94,.05) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(29,112,162,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.025]"
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
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${VS_GREEN}, #16a34a)` }}>
                <span className="font-poppins font-black text-white text-[14px]">VS</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-poppins font-bold text-white text-[15px] tracking-tight">Venture Sport USA</span>
                <p className="font-lato text-white/35 text-[12px] leading-none mt-0.5">Becas deportivas en EE.UU.</p>
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

        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta de trabajo y cotización · Automatización e IA</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${VS_GREEN}, #16a34a)` }}>
                  <Rocket className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(34,197,94,.10)', border: '1px solid rgba(34,197,94,.25)', color: VS_GREEN }}>
                  {META.tagline}
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}>
                Propuesta<br />
                <span style={{ background: `linear-gradient(90deg,#1d70a2,${VS_GREEN})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
                  {['1. Resumen ejecutivo','2. Solución propuesta','3. Plan de trabajo','4. Alcance de servicios','5. Inversión','6. Vigencia y términos'].map((item, i) => (
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
                  style={{ background: `radial-gradient(circle, rgba(34,197,94,.09) 0%, rgba(29,112,162,.05) 50%, transparent 70%)` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full" style={{ border: `1px solid rgba(34,197,94,.10)` }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(29,112,162,.15)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: VS_GREEN, boxShadow: `0 0 6px rgba(34,197,94,.8)` }} />
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
                  <div className="w-28 h-28 rounded-2xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${VS_GREEN}22, rgba(34,197,94,.08))`, border: `1px solid rgba(34,197,94,.25)`, boxShadow: `0 4px 30px rgba(34,197,94,.15)` }}>
                    <span className="font-poppins font-black text-white/90 text-[38px] leading-none" style={{ color: VS_GREEN }}>VSU</span>
                  </div>
                  <div className="text-center">
                    <span className="font-poppins font-black text-white text-[22px] tracking-tight">Venture Sport USA</span>
                    <p className="font-lato text-[13px] uppercase tracking-[0.2em] mt-1" style={{ color: VS_GREEN }}>Becas Deportivas · EE.UU.</p>
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

          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center"
            style={{ background: 'rgba(2,8,20,.85)', border: `1px solid rgba(34,197,94,.18)` }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${VS_GREEN}22, rgba(34,197,94,.08))`, border: `1px solid rgba(34,197,94,.25)` }}>
                <span className="font-poppins font-black text-[26px]" style={{ color: VS_GREEN }}>VSU</span>
              </div>
              <span className="font-poppins font-black text-white text-[15px] tracking-tight">Venture Sport USA</span>
              <span className="font-lato text-[11px] uppercase tracking-[0.2em]" style={{ color: VS_GREEN }}>Chile / EE.UU.</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">{META.sector}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Fundador</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">Nicolás Larrondo · Ex futbolista profesional</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Canal principal de captación</p>
                <p className="font-lato text-white/60 text-[18px]">Cuenta personal de Instagram</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Situación actual</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: VS_GREEN }} />
                  <p className="font-poppins font-semibold text-[15px]" style={{ color: VS_GREEN }}>Crecimiento acelerado · Sin estructura de automatización</p>
                </div>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Equipo</p>
                <p className="font-lato text-white/60 text-[18px]">Nicolás (liderazgo) · Ahmed (gestión) · Juan Pablo (contenido)</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Plataforma objetivo</p>
                <p className="font-lato text-white/60 text-[18px]">GoHighLevel + Instagram DMs</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              Nicolás Larrondo es ex futbolista profesional (activo hasta 2015) que hoy lidera un negocio de obtención de becas deportivas en Estados Unidos. Su modelo ha funcionado históricamente por recomendaciones, pero hace algunas semanas comenzó a publicar contenido en Instagram con mayor regularidad.
            </p>
            <p>
              El resultado fue inmediato: un carrusel se fue viral y generó cientos de mensajes. Sin embargo, al responder manualmente de la misma forma a todos, <strong className="text-white/90 font-semibold">Instagram bloqueó la cuenta por comportamiento similar al de un bot</strong>. La ironía: el canal que estaba generando más prospectos se convirtió en el cuello de botella del negocio.
            </p>
            <p>
              Nico sabe qué herramientas existen (ManyChat, GoHighLevel), pero no tiene tiempo para implementarlas y no quiere arriesgarse a hacerlo mal. La solución que acordamos en reunión es clara: <strong className="text-white/90 font-semibold">un agente conversacional con IA conectado a Instagram para calificar, filtrar y gestionar prospectos sin intervención manual constante</strong>, operado y mantenido por Sixteam.
            </p>
          </div>

          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> Dolores identificados en la reunión
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HALLAZGOS.map((h, i) => {
                const Icon = h.icon; const t = TINT[h.tint];
                return (
                  <div key={i} className="rounded-xl p-4 flex gap-3" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
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
          <TagLabel>02 — Solución propuesta</TagLabel>
          <SectionTitle>¿Qué hacemos juntos?</SectionTitle>
          <Rule />
          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden mb-6"
            style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: `radial-gradient(circle, rgba(34,197,94,.06), transparent 70%)`, transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 text-[#00bfa5] mb-4" />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[23px] leading-relaxed">
              Implementar un <strong className="text-white font-black">Agente Conversacional con Inteligencia Artificial</strong> conectado a los DMs e Instagram de Venture Sport USA: un sistema que responde automáticamente, califica prospectos, construye una base de datos estructurada y asigna las conversaciones de valor real al equipo humano, todo sin que Nico tenga que intervenir en cada mensaje.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="rounded-xl p-5 flex gap-4" style={{ background: `rgba(34,197,94,.06)`, border: `1px solid rgba(34,197,94,.2)` }}>
              <Bot className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: VS_GREEN }} />
              <div>
                <p className="font-poppins font-bold text-white/90 text-[17px] mb-1">Chatbot Sixteam con IA</p>
                <p className="font-lato text-white/50 text-[15px] leading-relaxed">
                  Agente entrenado con el conocimiento del negocio de Nico. Responde, califica, filtra y entrega prospectos listos para cierre.
                </p>
              </div>
            </div>
            <div className="rounded-xl p-5 flex gap-4" style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.2)' }}>
              <Shield className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
              <div>
                <p className="font-poppins font-bold text-white/90 text-[17px] mb-1">Soporte y Operaciones Sixteam</p>
                <p className="font-lato text-white/50 text-[15px] leading-relaxed">
                  Sixteam como partner tecnológico permanente: monitoreo, ajustes, configuraciones nuevas y acceso a GoHighLevel incluido.
                </p>
              </div>
            </div>
            <div className="rounded-xl p-5 flex gap-4" style={{ background: 'rgba(167,139,250,.06)', border: '1px solid rgba(167,139,250,.2)' }}>
              <Send className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#a78bfa]" />
              <div>
                <p className="font-poppins font-bold text-white/90 text-[17px] mb-1">Automatizaciones de Instagram</p>
                <p className="font-lato text-white/50 text-[15px] leading-relaxed">
                  Respuesta automática en comentarios y DMs. Nico puede publicar con CTAs sin miedo a colapsar o a que le bloqueen la cuenta.
                </p>
              </div>
            </div>
            <div className="rounded-xl p-5 flex gap-4" style={{ background: 'rgba(59,130,246,.06)', border: '1px solid rgba(59,130,246,.2)' }}>
              <Database className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#3b82f6]" />
              <div>
                <p className="font-poppins font-bold text-white/90 text-[17px] mb-1">Base de datos estructurada</p>
                <p className="font-lato text-white/50 text-[15px] leading-relaxed">
                  Todos los prospectos quedan registrados. Los que no califican hoy sirven para remarketing futuro o para el negocio de implementos deportivos.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Implementación', value: 'USD 1.000', sub: 'Chatbot IA · Pago único' },
              { label: 'Soporte y Ops',  value: 'USD 280',    sub: 'Paquete Inicial · 100 créditos/mes' },
              { label: 'GoHighLevel',    value: 'Incluido',  sub: 'Con servicio S&O activo' },
              { label: 'Tiempo arranque', value: '~4 sem.',  sub: 'Kickoff a lanzamiento en vivo' },
            ].map((k, i) => (
              <div key={i} className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(29,112,162,.07)', border: '1px solid rgba(29,112,162,.2)' }}>
                <p className="font-poppins font-black text-white text-[22px] leading-none mb-1">{k.value}</p>
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
          <SectionTitle>4 fases · ~4 semanas</SectionTitle>
          <Rule />

          <div className="relative mb-10">
            <div className="hidden sm:block absolute left-[28px] top-10 bottom-10 w-px"
              style={{ background: `linear-gradient(to bottom, rgba(34,197,94,.4), rgba(0,191,165,.4), rgba(167,139,250,.4), rgba(245,158,11,.4))` }} />

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
                        <p className="font-lato text-white/40 text-[15px] mt-0.5 line-clamp-1">{et.descripcion}</p>
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
                            {et.actividades.map((a, j) => {
                              const act = typeof a === 'string' ? { text: a } : a;
                              return (
                                <li key={j} className="flex items-start gap-2">
                                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: et.color }} />
                                  <span className="font-lato text-white/65 text-[18px] flex-1">{act.text}
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

          <div className="space-y-3">
            <div className="rounded-xl p-4 flex gap-3"
              style={{ background: `rgba(34,197,94,.05)`, border: `1px solid rgba(34,197,94,.2)` }}>
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: VS_GREEN }} />
              <p className="font-lato text-white/55 text-[16px] leading-relaxed">
                Las <strong className="text-white/80">Fases 01</strong> y <strong className="text-white/80">02</strong> son las más colaborativas: el equipo de Venture Sport USA es clave para construir la base de conocimientos. Cuanto más detallada sea la información que Nico y su equipo nos compartan, más eficaz será el agente.
              </p>
            </div>
            <div className="rounded-xl p-4 flex gap-3"
              style={{ background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.2)' }}>
              <Rocket className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#f59e0b]" />
              <p className="font-lato text-white/55 text-[16px] leading-relaxed">
                La <strong className="text-white/80">Fase 04</strong> incluye una sesión de revisión post-lanzamiento para ajustar el bot con las primeras interacciones reales. Sixteam permanece como partner a través de Soporte y Operaciones para seguir iterando con el equipo.
              </p>
            </div>
          </div>
        </section>

        {/* ─ 04 ALCANCE ─ */}
        <section id="alcance" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Alcance de servicios</TagLabel>
          <SectionTitle>Qué está incluido</SectionTitle>
          <Rule />

          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-4">
            Detalle de cada componente del paquete
          </p>
          <div className="space-y-2.5">
            {DESGLOSE.map((bloque, i) => {
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
                      <span className="font-lato text-white/30 text-[14px] ml-3">{bloque.items.length} ítems incluidos</span>
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
        </section>

        {/* ─ 05 COTIZACIÓN ─ */}
        <section id="cotizacion" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Propuesta de inversión</TagLabel>
          <SectionTitle>Invierte en el sistema, no en el tiempo perdido.</SectionTitle>
          <Rule />
          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            El esquema de inversión combina una implementación inicial para construir el agente y un modelo de operación continua basado en créditos, diseñado para que Venture Sport USA solo pague por lo que efectivamente usa. Valores en{' '}
            <strong className="text-white/75">dólares estadounidenses (USD)</strong>.
          </p>

          {/* Tabla de precios */}
          <div className="rounded-xl overflow-hidden mb-8" style={{ border: `1px solid rgba(34,197,94,.2)` }}>
            <div className="px-5 py-3 flex items-center justify-between"
              style={{ background: `linear-gradient(90deg, rgba(34,197,94,.10) 0%, rgba(255,255,255,.03) 100%)`, borderBottom: `1px solid rgba(34,197,94,.12)` }}>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" style={{ color: VS_GREEN }} />
                <p className="font-poppins font-semibold text-white/65 text-[13px] uppercase tracking-wider">Desglose de la inversión</p>
              </div>
              <span className="font-lato text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider"
                style={{ background: `rgba(34,197,94,.12)`, border: `1px solid rgba(34,197,94,.28)`, color: VS_GREEN }}>
                Dólares · USD
              </span>
            </div>

            <div className="hidden sm:grid px-5 py-2 font-lato text-white/20 text-[11px] uppercase tracking-wider"
              style={{ gridTemplateColumns: '2.5fr 1fr 1.5fr', background: 'rgba(255,255,255,.015)', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
              <span>Componente</span>
              <span className="text-center">Tipo</span>
              <span className="text-right">Valor</span>
            </div>

            <div className="divide-y divide-white/5">
              {/* Chatbot IA */}
              <div className="px-5 py-4">
                <div className="sm:hidden mb-1">
                  <p className="font-poppins font-semibold text-white/85 text-[15px]">Implementación del Chatbot IA</p>
                  <p className="font-lato text-white/35 text-[13px] mt-0.5">Base de conocimientos, agente conversacional y automatizaciones de Instagram</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-lato text-[11px] px-2 py-0.5 rounded-full"
                      style={{ background: `rgba(34,197,94,.12)`, border: `1px solid rgba(34,197,94,.28)`, color: VS_GREEN }}>
                      Pago único
                    </span>
                    <span className="font-poppins font-black text-white text-[18px]">USD 1.000</span>
                  </div>
                </div>
                <div className="hidden sm:grid items-center" style={{ gridTemplateColumns: '2.5fr 1fr 1.5fr' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: `linear-gradient(to bottom, ${VS_GREEN}, rgba(34,197,94,.2))` }} />
                    <div>
                      <p className="font-poppins font-semibold text-white/85 text-[15px]">Implementación del Chatbot IA</p>
                      <p className="font-lato text-white/35 text-[13px] mt-0.5">Base de conocimientos, agente conversacional y automatizaciones de Instagram</p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <span className="font-lato text-[11px] px-2 py-0.5 rounded-full"
                      style={{ background: `rgba(34,197,94,.12)`, border: `1px solid rgba(34,197,94,.28)`, color: VS_GREEN }}>
                      Pago único
                    </span>
                  </div>
                  <p className="font-poppins font-black text-white text-[17px] text-right">USD 1.000</p>
                </div>
              </div>

              {/* Soporte y Operaciones */}
              <div className="px-5 py-4">
                <div className="sm:hidden mb-1">
                  <p className="font-poppins font-semibold text-white/85 text-[15px]">Soporte y Operaciones · Paquete Inicial Sixteam</p>
                  <p className="font-lato text-white/35 text-[13px] mt-0.5">100 créditos / mes · USD 2,80 por crédito · Incluye GoHighLevel</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-lato text-[11px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.28)', color: '#00bfa5' }}>
                      Mensual anticipado
                    </span>
                    <span className="font-poppins font-black text-white text-[18px]">USD 280/mes</span>
                  </div>
                </div>
                <div className="hidden sm:grid items-center" style={{ gridTemplateColumns: '2.5fr 1fr 1.5fr' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(to bottom, #00bfa5, rgba(0,191,165,.2))' }} />
                    <div>
                      <p className="font-poppins font-semibold text-white/85 text-[15px]">Soporte y Operaciones · Paquete Inicial Sixteam</p>
                      <p className="font-lato text-white/35 text-[13px] mt-0.5">100 créditos / mes · USD 2,80 por crédito · Incluye GoHighLevel</p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <span className="font-lato text-[11px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.28)', color: '#00bfa5' }}>
                      Mensual anticipado
                    </span>
                  </div>
                  <p className="font-poppins font-black text-white text-[17px] text-right">USD 280/mes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cards resumen inversión */}
          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-4">
            Resumen de inversión
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* Pago único */}
            <div className="rounded-2xl p-6 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, rgba(34,197,94,.10) 0%, rgba(3,13,26,.9) 100%)`, border: `1px solid rgba(34,197,94,.3)` }}>
              <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
                style={{ background: `radial-gradient(circle, rgba(34,197,94,.06), transparent 70%)`, transform: 'translate(20%,-20%)' }} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-lato text-white/40 text-[13px] uppercase tracking-widest">Implementación</p>
                  <span className="font-lato text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider"
                    style={{ background: `rgba(34,197,94,.15)`, border: `1px solid rgba(34,197,94,.35)`, color: VS_GREEN }}>
                    Pago único
                  </span>
                </div>
                <p className="font-poppins font-black text-white leading-none mb-2" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>
                  USD 1.000
                </p>
                <p className="font-lato text-white/40 text-[14px] mb-4">Chatbot IA completo · Base de conocimientos · Instagram</p>
                <ul className="space-y-1.5">
                  {[
                    { label: 'Agente conversacional con IA', value: 'Incluido' },
                    { label: 'Base de conocimientos personalizada', value: 'Incluido' },
                    { label: 'Automatización Instagram (1 publicación)', value: 'Incluido' },
                    { label: 'Sesión de pruebas y revisión post-lanzamiento', value: 'Incluido' },
                  ].map((r, i) => (
                    <li key={i} className="flex items-center justify-between gap-2">
                      <span className="font-lato text-white/55 text-[14px]">{r.label}</span>
                      <span className="font-poppins font-bold text-white/80 text-[14px] flex-shrink-0">{r.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Soporte y Operaciones */}
            <div className="rounded-2xl p-6 relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-lato text-white/40 text-[13px] uppercase tracking-widest">Paquete Inicial Sixteam</p>
                  <span className="font-lato text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider"
                    style={{ background: 'rgba(0,191,165,.10)', border: '1px solid rgba(0,191,165,.25)', color: '#00bfa5' }}>
                    Mensual anticipado
                  </span>
                </div>
                <p className="font-poppins font-black text-white leading-none mb-1" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>
                  USD 280
                </p>
                <p className="font-lato text-white/40 text-[14px] mb-4">100 créditos / mes · USD 2,80 por crédito</p>
                <ul className="space-y-1.5">
                  {[
                    { label: 'GoHighLevel (acceso incluido)', value: 'Con S&O activo' },
                    { label: '100 créditos mensuales', value: 'Anticipado' },
                    { label: 'Créditos no acumulables al período siguiente', value: 'Por período' },
                    { label: 'Presupuesto en créditos antes de ejecutar', value: 'Siempre' },
                  ].map((r, i) => (
                    <li key={i} className="flex items-center justify-between gap-2">
                      <span className="font-lato text-white/55 text-[14px]">{r.label}</span>
                      <span className="font-poppins font-bold text-white/80 text-[14px] flex-shrink-0">{r.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Cómo funciona el sistema de créditos */}
          <div className="rounded-xl p-4 sm:p-5 mb-4 flex gap-3"
            style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.2)' }}>
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
            <div>
              <p className="font-poppins font-semibold text-white/80 text-[18px] mb-2">Cómo funciona el Paquete Inicial Sixteam</p>
              <p className="font-lato text-white/50 text-[16px] leading-relaxed mb-3">
                El <strong className="text-white/70">Paquete Inicial Sixteam</strong> incluye <strong className="text-white/70">100 créditos por mes</strong> a un valor de <strong className="text-white/70">USD 280 mensuales anticipados</strong> (USD 2,80 por crédito). Esos créditos se van consumiendo conforme el equipo de Nico realiza solicitudes a Sixteam — ya sea un ajuste al bot, una nueva automatización de Instagram, una configuración en GoHighLevel o cualquier otra tarea dentro del servicio. Los créditos <strong className="text-white/70">no son acumulables al período siguiente</strong>.
              </p>
              <div className="rounded-lg p-3 flex flex-col gap-2" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                <p className="font-poppins font-semibold text-white/60 text-[13px] uppercase tracking-wider">Flujo de cada solicitud</p>
                <div className="flex flex-col gap-1.5">
                  {[
                    { step: '01', text: 'El equipo de Nico envía la solicitud a Sixteam describiendo qué necesitan (ej: "quiero activar la automatización de comentarios para la nueva publicación del lunes")' },
                    { step: '02', text: 'Sixteam analiza la solicitud y responde con un presupuesto de créditos: cuántos se consumirán y cuánto representan en dólares. El equipo decide si aprueba antes de que se ejecute cualquier trabajo.' },
                    { step: '03', text: 'El equipo aprueba y Sixteam ejecuta. Los 7 créditos se descuentan del saldo disponible del período, que queda actualizado y visible en todo momento' },
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
          </div>

          {/* Ejemplo de consumo */}
          <div className="rounded-xl p-4 sm:p-5 mb-8 flex gap-3"
            style={{ background: `rgba(34,197,94,.05)`, border: `1px solid rgba(34,197,94,.2)` }}>
            <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: VS_GREEN }} />
            <div>
              <p className="font-poppins font-semibold text-white/80 text-[18px] mb-2">
                Ejemplo real de solicitud y respuesta
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wide align-middle"
                  style={{ background: `rgba(34,197,94,.12)`, border: `1px solid rgba(34,197,94,.3)`, color: VS_GREEN }}>
                  Referencial
                </span>
              </p>
              <div className="space-y-3">
                <div className="rounded-lg p-3 flex gap-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                  <span className="font-poppins font-black text-[11px] px-2 py-0.5 rounded flex-shrink-0 h-fit mt-0.5"
                    style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.5)' }}>Nico</span>
                  <p className="font-lato text-white/55 text-[15px] leading-relaxed italic">
                    "Publiqué un nuevo carrusel mañana a las 10am con el CTA 'escribe BECA'. Necesito activar la automatización para que les llegue el DM y arranque el flujo del bot."
                  </p>
                </div>
                <div className="rounded-lg p-3 flex gap-3" style={{ background: `rgba(34,197,94,.06)`, border: `1px solid rgba(34,197,94,.15)` }}>
                  <span className="font-poppins font-black text-[11px] px-2 py-0.5 rounded flex-shrink-0 h-fit mt-0.5"
                    style={{ background: `rgba(34,197,94,.20)`, color: VS_GREEN }}>Sixteam</span>
                  <p className="font-lato text-white/55 text-[15px] leading-relaxed italic">
                    "Recibido. Para activar la automatización de comentarios en esa publicación necesitamos <strong className="text-white/75 not-italic">7 créditos, es decir USD 19,60</strong>. Te quedarían 93 créditos disponibles este mes. ¿Aprobamos?"
                  </p>
                </div>
                <div className="rounded-lg p-3 flex gap-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                  <span className="font-poppins font-black text-[11px] px-2 py-0.5 rounded flex-shrink-0 h-fit mt-0.5"
                    style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.5)' }}>Nico</span>
                  <p className="font-lato text-white/55 text-[15px] leading-relaxed italic">"Sí, aprobado."</p>
                </div>
                <p className="font-lato text-white/35 text-[13px] leading-relaxed pt-1">
                  Sixteam configura la automatización antes de la hora de publicación. El bot queda activo. Nico publica con confianza.
                </p>
              </div>
            </div>
          </div>

          {/* Servicios opcionales */}
          <div>
            <TagLabel>Servicios opcionales para fases siguientes</TagLabel>
            <Rule />
            <div className="space-y-3">
              {/* Email marketing / remarketing */}
              <div className="rounded-xl p-5 flex flex-col gap-3"
                style={{ background: 'rgba(59,130,246,.06)', border: '1px solid rgba(59,130,246,.22)' }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,.15)' }}>
                    <MessageSquare className="w-4 h-4 text-[#3b82f6]" />
                  </div>
                  <div>
                    <p className="font-poppins font-bold text-white/85 text-[17px]">Campañas de Email Marketing y Remarketing</p>
                    <p className="font-lato text-white/40 text-[13px] mt-0.5">Activar la base de datos de prospectos no convertidos con campañas segmentadas</p>
                  </div>
                </div>
                <p className="font-lato text-white/50 text-[15px] leading-relaxed ml-11">
                  Una vez que la base de datos esté construida, Sixteam puede activar campañas de email marketing dirigidas a los prospectos que no calificaron hoy o que aún están evaluando. También permite cruzar la base con el negocio de implementos deportivos de Nico para otras oportunidades comerciales.
                </p>
              </div>

              {/* Pauta digital */}
              <div className="rounded-xl p-5 flex flex-col gap-3"
                style={{ background: 'rgba(167,139,250,.06)', border: '1px solid rgba(167,139,250,.22)' }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(167,139,250,.15)' }}>
                    <TrendingUp className="w-4 h-4 text-[#a78bfa]" />
                  </div>
                  <div>
                    <p className="font-poppins font-bold text-white/85 text-[17px]">Pauta Digital en Instagram y Meta Ads</p>
                    <p className="font-lato text-white/40 text-[13px] mt-0.5">Amplificar las publicaciones con mayor tracción orgánica y atraer prospectos calificados</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-1 ml-11">
                  <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(167,139,250,.10)', border: '1px solid rgba(167,139,250,.25)' }}>
                    <p className="font-lato text-white/35 text-[11px] uppercase tracking-wider mb-0.5">Implementación</p>
                    <p className="font-poppins font-black text-[#a78bfa] text-[16px]">Desde USD 250</p>
                  </div>
                  <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.10)' }}>
                    <p className="font-lato text-white/35 text-[11px] uppercase tracking-wider mb-0.5">Administración mensual</p>
                    <p className="font-poppins font-black text-white/80 text-[16px]">Desde USD 150/mes</p>
                  </div>
                </div>
              </div>

              {/* Agente WhatsApp */}
              <div className="rounded-xl p-5 flex flex-col gap-3"
                style={{ background: `rgba(34,197,94,.06)`, border: `1px solid rgba(34,197,94,.22)` }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `rgba(34,197,94,.15)` }}>
                    <Send className="w-4 h-4" style={{ color: VS_GREEN }} />
                  </div>
                  <div>
                    <p className="font-poppins font-bold text-white/85 text-[17px]">Extensión del Agente a WhatsApp Business</p>
                    <p className="font-lato text-white/40 text-[13px] mt-0.5">Llevar el mismo agente conversacional al canal de WhatsApp de Venture Sport USA</p>
                  </div>
                </div>
                <p className="font-lato text-white/50 text-[15px] leading-relaxed ml-11">
                  Una vez el agente esté estable en Instagram, se puede extender a WhatsApp Business para centralizar todas las conversaciones y calificación de prospectos en GoHighLevel, independientemente del canal por donde lleguen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── LOGOS DE CLIENTES ── */}
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
              { titulo: 'Aprobación', desc: 'Para aceptar esta propuesta y dar inicio al proyecto, se requiere confirmación vía WhatsApp, correo o verbal. Con esa confirmación se habilita el contrato a firmar y se procede con el inicio del trabajo.', icon: CheckCircle },
              { titulo: 'Términos de pago', desc: 'El pago de la implementación del Chatbot IA (USD 1.000) se realiza al inicio del proyecto. El servicio de Soporte y Operaciones se factura por período anticipado (mensual, semestral o anual) según el paquete de créditos acordado. Los pagos se realizan mediante transferencia bancaria.', icon: FileText },
              { titulo: 'Inicio del proyecto', desc: 'El cronograma inicia desde la confirmación de la propuesta y la primera sesión de kickoff con el equipo de Venture Sport USA. El equipo deberá compartir la información del negocio, preguntas frecuentes y acceso a la cuenta de Instagram para comenzar la configuración.', icon: Zap },
              { titulo: 'Soporte y Operaciones del Paquete Inicial Sixteam', desc: 'El Paquete Inicial Sixteam incluye 100 créditos por mes a USD 280 mensuales anticipados. El acceso a GoHighLevel está incluido mientras el servicio esté activo. Los créditos no son acumulables al período siguiente. Antes de ejecutar cualquier solicitud, Sixteam presenta el costo estimado en créditos para que el equipo apruebe.', icon: Shield },
              { titulo: 'Automatizaciones adicionales de Instagram', desc: 'La implementación incluye la configuración de una publicación o campaña activa con automatización de comentarios. Las publicaciones o flujos adicionales se gestionan con los créditos del Paquete Inicial y se presupuestan con el equipo antes de ejecutar.', icon: Send },
              { titulo: 'Modificaciones al alcance', desc: 'Cualquier solicitud de servicio o funcionalidad no estipulada en esta propuesta requerirá una nueva cotización o se gestionará a través del sistema de créditos de S&O. Ejemplos: campañas de email marketing, pauta digital, integración con otras plataformas.', icon: AlertCircle },
              { titulo: 'Vigencia de la propuesta', desc: 'Esta propuesta tiene una vigencia de 30 días calendario desde su fecha de emisión. Pasado este plazo, los valores podrán ser revisados según condiciones del mercado.', icon: Clock },
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
              style={{ background: 'radial-gradient(circle at 50% 100%, rgba(0,191,165,.05), transparent 70%)' }} />
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

export default VentureSportProposal;
