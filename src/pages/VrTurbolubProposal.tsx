import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap,
  AlertCircle, Info, Calendar, MapPin,
  Users, Shield, Lock, XCircle,
  Droplet, MessageSquare, Bot, Database,
  BellRing, Workflow, Layers, UserCheck, Phone, Stamp, TrendingUp,
  Coins, Building2,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'VR Turbolub',
  tagline: 'Venta de aceites y lubricantes',
  sector: 'Comercio · Aceites y lubricantes · Bucaramanga',
  fecha: 'Agosto 2026',
  lugar: 'Bucaramanga, Colombia',
  objetivo: 'Una plataforma y un Asistente de IA que ordenan las ventas de VR Turbolub, atienden a los clientes por WhatsApp, Instagram y Facebook, y dejan el registro completo de cada venta en un solo lugar.',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  destinatarios: 'Andrés Vargas',
};

const ACCENT = '#f2994a';

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber:  { text: '#f59e0b',  bg: 'rgba(251,191,36,.07)',   border: 'rgba(251,191,36,.18)' },
  teal:   { text: '#00bfa5',  bg: 'rgba(0,191,165,.07)',    border: 'rgba(0,191,165,.18)'  },
  blue:   { text: '#38bdf8',  bg: 'rgba(56,189,248,.07)',   border: 'rgba(56,189,248,.18)' },
  red:    { text: '#f87171',  bg: 'rgba(221,51,51,.07)',    border: 'rgba(221,51,51,.2)'   },
  orange: { text: ACCENT,     bg: 'rgba(242,153,74,.08)',   border: 'rgba(242,153,74,.22)' },
};

// ─── PUNTOS DE DOLOR ─────────────────────────────────────────────────────────

const DOLORES = [
  {
    titulo: 'Las ventas quedan en la memoria',
    desc: 'El registro está en un cuaderno y en lo que su papá recuerda. A fin de mes no hay forma de saber cuánto se vendió realmente.',
    icon: FileText, tint: 'red',
  },
  {
    titulo: 'Los mensajes no dan abasto',
    desc: 'Cuando invirtió en publicidad, llegaron mensajes por WhatsApp que nadie alcanzó a contestar a tiempo. Sin sistema, la inversión se desperdicia.',
    icon: MessageSquare, tint: 'amber',
  },
  {
    titulo: 'Todo depende de quién esté en el local',
    desc: 'Si su papá no está, no hay quien atienda ni quien recuerde a quién hay que volver a escribirle.',
    icon: Users, tint: 'blue',
  },
  {
    titulo: 'Solo vende a quien pasa por la puerta',
    desc: 'Sin un canal digital que venda por usted, cada cliente nuevo depende de que alguien camine frente al local.',
    icon: AlertCircle, tint: 'orange',
  },
];

// ─── BENEFICIOS ──────────────────────────────────────────────────────────────

const BENEFICIOS = [
  {
    icon: Bot, color: ACCENT, colorAlpha: 'rgba(242,153,74,.08)', colorBorder: 'rgba(242,153,74,.22)',
    titulo: 'Responde así el local esté cerrado',
    desc: 'El Asistente de IA contesta al instante por WhatsApp, Instagram y Facebook, a cualquier hora del día.',
  },
  {
    icon: Droplet, color: '#38bdf8', colorAlpha: 'rgba(56,189,248,.08)', colorBorder: 'rgba(56,189,248,.22)',
    titulo: 'Conoce sus productos y resuelve dudas',
    desc: 'Está entrenado en hasta 20 productos de VR Turbolub: qué aceite recomienda, para qué y a qué precio.',
  },
  {
    icon: UserCheck, color: '#f59e0b', colorAlpha: 'rgba(245,158,11,.08)', colorBorder: 'rgba(245,158,11,.22)',
    titulo: 'Entrega al asesor listo para cerrar',
    desc: 'Cuando el cliente ya decidió comprar, el asistente le pasa la conversación con todo el contexto para que usted cierre.',
  },
  {
    icon: Database, color: '#00bfa5', colorAlpha: 'rgba(0,191,165,.08)', colorBorder: 'rgba(0,191,165,.22)',
    titulo: 'Un solo lugar para todos los clientes',
    desc: 'WhatsApp, Instagram, Facebook y las ventas del local quedan en la misma plataforma, no repartidos en un cuaderno.',
  },
  {
    icon: BellRing, color: '#a78bfa', colorAlpha: 'rgba(167,139,250,.08)', colorBorder: 'rgba(167,139,250,.22)',
    titulo: 'Ningún cliente se queda sin seguimiento',
    desc: 'Si alguien deja de responder, el sistema no lo olvida: vuelve a escribirle hasta obtener una respuesta.',
  },
  {
    icon: TrendingUp, color: '#34d399', colorAlpha: 'rgba(52,211,153,.08)', colorBorder: 'rgba(52,211,153,.22)',
    titulo: 'Crece sin necesitar más personal',
    desc: 'El negocio atiende más clientes sin tener que contratar a alguien solo para contestar mensajes.',
  },
];

// ─── QUÉ INCLUYE ─────────────────────────────────────────────────────────────

const MODULOS: { num: string; nombre: string; icon: React.ElementType; color: string; colorAlpha: string; colorBorder: string; descripcion: string; items: string[] }[] = [
  {
    num: '01',
    nombre: 'Plataforma CRM y ChatCenter',
    icon: Layers,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.28)',
    descripcion: 'El lugar donde quedan centralizados sus clientes y las conversaciones de todos los canales.',
    items: [
      'WhatsApp, Instagram y Facebook en una sola bandeja de conversaciones',
      'Registro de cada cliente: nombre, contacto, qué preguntó y qué compró',
      'Historial de ventas presenciales y digitales en un solo lugar',
      'Filtros para saber quién compra seguido y quién no ha vuelto',
      'Acceso para usted, su papá y su hermana, sin costo adicional por usuario',
      'Nube, respaldo y actualizaciones incluidas',
    ],
  },
  {
    num: '02',
    nombre: 'Asistente de IA para ventas',
    icon: Bot,
    color: ACCENT,
    colorAlpha: 'rgba(242,153,74,.10)',
    colorBorder: 'rgba(242,153,74,.28)',
    descripcion: 'Atiende, informa y filtra antes de que la conversación le llegue a usted.',
    items: [
      'Entrenado en hasta 20 productos: aceites, lubricantes y sus usos',
      'Responde preguntas frecuentes sobre precios y recomendaciones',
      'Disponible en WhatsApp, Instagram y Facebook a cualquier hora',
      'Identifica cuándo el cliente ya está listo para comprar',
      'Transfiere la conversación al asesor de ventas con el contexto completo',
      'Se identifica como asistente y no reemplaza el trato con su equipo',
    ],
  },
  {
    num: '03',
    nombre: 'Soporte y mejoras mensuales',
    icon: Coins,
    color: '#f59e0b',
    colorAlpha: 'rgba(245,158,11,.10)',
    colorBorder: 'rgba(245,158,11,.28)',
    descripcion: 'Hasta 60 créditos cada mes para que la plataforma mejore junto con el negocio.',
    items: [
      'Mejoras al Asistente de IA: nuevas respuestas, nuevos productos, ajustes de tono',
      'Ajustes y configuraciones adicionales sobre la plataforma',
      'Capacitaciones sobre el uso del CRM y el ChatCenter',
      'Los créditos no usados en el mes no se acumulan al siguiente',
    ],
  },
  {
    num: '04',
    nombre: 'Equipo de tecnología a su disposición',
    icon: Users,
    color: '#38bdf8',
    colorAlpha: 'rgba(56,189,248,.10)',
    colorBorder: 'rgba(56,189,248,.28)',
    descripcion: 'Hasta 5 solicitudes al mes para que no enfrente solo las decisiones digitales.',
    items: [
      'Acompañamiento en marketing, ventas o servicio al cliente',
      'Resolución de dudas sobre cómo usar la plataforma en el día a día',
      'Recomendaciones puntuales sobre sus canales digitales',
      'Canal directo por WhatsApp con el equipo de Sixteam',
    ],
  },
];

// ─── PLAN DE TRABAJO ─────────────────────────────────────────────────────────

const FASES = [
  {
    num: '01',
    semanas: 'Semana 1',
    titulo: 'Configuración y carga de productos',
    color: ACCENT,
    colorAlpha: 'rgba(242,153,74,.10)',
    colorBorder: 'rgba(242,153,74,.28)',
    desc: 'Montamos la plataforma y cargamos la información real de VR Turbolub.',
    hitos: [
      'Conexión de WhatsApp, Instagram y Facebook a la plataforma',
      'Carga de hasta 20 productos: nombre, uso y precio',
      'Configuración del CRM: contactos, historial y campos propios del negocio',
      'Sesión de trabajo con usted para definir cómo debe hablar el asistente',
    ],
    entregable: 'Plataforma configurada y Asistente de IA entrenado, listo para pruebas',
  },
  {
    num: '02',
    semanas: 'Semana 2',
    titulo: 'Pruebas y puesta en marcha',
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.28)',
    desc: 'Probamos con conversaciones reales, ajustamos y dejamos el sistema operando.',
    hitos: [
      'Pruebas de conversaciones reales, con usted validando las respuestas',
      'Ajuste del asistente según lo que arrojen las pruebas',
      'Capacitación para usted, su papá y su hermana en el uso de la plataforma',
      'Puesta en marcha y acompañamiento durante la primera semana de uso',
    ],
    entregable: 'Plataforma y Asistente de IA en producción, atendiendo clientes reales',
  },
];

// ─── FUERA DE ALCANCE ────────────────────────────────────────────────────────

const FUERA = [
  {
    titulo: 'Página web nueva',
    desc: 'Usted ya tiene una. Mejorarla o construir una nueva con carrito de compras se cotiza aparte.',
    icon: Layers, tint: 'blue',
  },
  {
    titulo: 'Anuncios pagados en redes',
    desc: 'La plataforma atiende a quien le escribe. Pautar en Meta para que le escriban más personas es un servicio aparte.',
    icon: TrendingUp, tint: 'orange',
  },
  {
    titulo: 'Plataforma para la inmobiliaria',
    desc: 'Es una meta suya a futuro. Se evalúa como proyecto aparte cuando decida iniciarla.',
    icon: Building2, tint: 'amber',
  },
  {
    titulo: 'Agente de voz para llamadas',
    desc: 'Hoy el asistente atiende por chat. Que también conteste llamadas se cotiza aparte.',
    icon: Phone, tint: 'red',
  },
];

// ─── AMPLIACIONES POSTERIORES ────────────────────────────────────────────────

const FASE2 = [
  'Página web nueva con carrito de compras',
  'Anuncios en Meta para atraer más clientes al negocio',
  'Plataforma de gestión para su futura inmobiliaria',
  'Agente de voz que conteste llamadas',
];

// ─── TÉRMINOS ────────────────────────────────────────────────────────────────

const TERMINOS: { titulo: string; desc: string; icon: React.ElementType }[] = [
  {
    titulo: 'Cómo aceptar esta propuesta',
    desc: 'Confirmación por WhatsApp, correo o verbal. Con eso se procede al primer pago y arranca la implementación.',
    icon: CheckCircle,
  },
  {
    titulo: 'Forma de pago de la implementación',
    desc: 'Dos pagos del 50% sobre $2.000.000 COP: $1.000.000 al iniciar y $1.000.000 contra la entrega. Pago único, no se repite.',
    icon: FileText,
  },
  {
    titulo: 'Pago mensual del servicio',
    desc: '$700.000 COP anticipados, desde la entrega de la plataforma. Durante las dos semanas de implementación no se cobra mensualidad.',
    icon: Clock,
  },
  {
    titulo: 'Créditos y solicitudes mensuales',
    desc: 'El plan incluye hasta 60 créditos redimibles en mejoras al asistente, ajustes o capacitaciones, y hasta 5 solicitudes de apoyo en marketing, ventas o servicio al cliente. Lo no usado en el mes no se acumula al siguiente.',
    icon: Coins,
  },
  {
    titulo: 'Duración de la implementación',
    desc: 'Dos semanas desde el primer pago, en dos fases con entregable revisable.',
    icon: Calendar,
  },
  {
    titulo: 'Atención de solicitudes',
    desc: 'Respuesta en días hábiles por WhatsApp o correo, coordinada directamente con el equipo de tecnología de Sixteam.',
    icon: Shield,
  },
  {
    titulo: 'Lo que necesitamos de su lado',
    desc: 'Acceso a WhatsApp Business, Instagram y Facebook del negocio, el listado de los 20 productos con precios, y la sesión de entrenamiento de la semana 1.',
    icon: Users,
  },
  {
    titulo: 'Modificaciones al alcance',
    desc: 'Lo no contemplado aquí, como la página web nueva o los anuncios pagados, se cotiza aparte y no modifica el valor mensual acordado.',
    icon: AlertCircle,
  },
  {
    titulo: 'Propiedad y confidencialidad',
    desc: 'Sus datos, contactos y ventas son suyos. Sixteam mantiene confidencialidad total, durante y después del servicio.',
    icon: Lock,
  },
  {
    titulo: 'Vigencia de la propuesta',
    desc: '30 días calendario. Pasado ese plazo, los valores podrán revisarse según el mercado.',
    icon: Stamp,
  },
];

// ─── SECCIONES NAV ───────────────────────────────────────────────────────────

const SECCIONES = [
  { id: 'resumen',    label: 'Resumen'     },
  { id: 'beneficios', label: 'Beneficios'  },
  { id: 'incluye',    label: 'Qué incluye' },
  { id: 'plan',       label: 'Plan'        },
  { id: 'alcance',    label: 'Alcance'     },
  { id: 'inversion',  label: 'Inversión'   },
  { id: 'vigencia',   label: 'Vigencia'    },
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
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: `linear-gradient(90deg,${ACCENT},#00bfa5)` }} />
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const VrTurbolubProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [moduloActivo, setModuloActivo] = useState<number | null>(null);
  const [terminoActivo, setTerminoActivo] = useState<number | null>(null);

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
  const s4 = useVisible(); const s5 = useVisible(); const s6 = useVisible(); const s7 = useVisible();

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
            style={{ background: 'radial-gradient(circle, rgba(242,153,74,.06) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,191,165,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.022]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        </div>

        <div className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-b" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
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
          <span className="font-lato text-[#00bfa5]/80 text-[13px] uppercase tracking-[0.2em] border border-[#00bfa5]/20 rounded-full px-3 py-1.5">Confidencial</span>
        </div>

        <style>{`
          @keyframes cover-spin-slow { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
          @keyframes cover-spin-rev  { from{transform:rotate(0deg)}to{transform:rotate(-360deg)} }
          @keyframes cover-pulse-glow { 0%,100%{opacity:.07;transform:scale(1)} 50%{opacity:.14;transform:scale(1.12)} }
          @keyframes cover-float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
          .cover-ring-1{animation:cover-spin-slow 22s linear infinite}
          .cover-ring-2{animation:cover-spin-rev 16s linear infinite}
          .cover-glow{animation:cover-pulse-glow 4s ease-in-out infinite}
          .cover-float{animation:cover-float 5s ease-in-out infinite}
        `}</style>

        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta comercial · Plataforma + Asistente de IA</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, #a8590c)` }}>
                  <Droplet className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">Andrés Vargas</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(242,153,74,.12)', border: '1px solid rgba(242,153,74,.28)', color: ACCENT }}>
                  VR Turbolub · Aceites y lubricantes
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 4.8rem)' }}>
                Ventas<br />
                <span style={{ background: `linear-gradient(90deg,${ACCENT},#00bfa5)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Bajo Control
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
                  { icon: Users,    text: META.destinatarios },
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
                  {['1. Resumen ejecutivo','2. Resultados que obtendrá','3. Qué incluye el servicio','4. Plan de trabajo','5. Alcance y límites','6. Propuesta de inversión','7. Vigencia y términos'].map((item, i) => (
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
                  style={{ background: 'radial-gradient(circle, rgba(242,153,74,.08) 0%, rgba(0,191,165,.04) 50%, transparent 70%)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full" style={{ border: '1px solid rgba(242,153,74,.12)' }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(0,191,165,.15)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: ACCENT, boxShadow: '0 0 6px rgba(242,153,74,.8)' }} />
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
                  <div className="rounded-2xl p-5 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(242,153,74,.18), rgba(242,153,74,.06))', border: '1px solid rgba(242,153,74,.3)', boxShadow: '0 4px 30px rgba(242,153,74,.18)' }}>
                    <Droplet className="w-12 h-12" style={{ color: ACCENT }} />
                  </div>
                  <div className="text-center">
                    <p className="font-poppins font-bold text-white/80 text-[17px] tracking-tight">VR Turbolub</p>
                    <p className="font-lato text-[13px] uppercase tracking-[0.2em] mt-1" style={{ color: ACCENT }}>Aceites y lubricantes · Bucaramanga</p>
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
          <TagLabel>01 · Resumen ejecutivo</TagLabel>
          <SectionTitle>Contexto y punto de partida</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center"
            style={{ background: 'rgba(2,8,20,.85)', border: '1px solid rgba(242,153,74,.20)' }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="rounded-xl p-4 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(242,153,74,.18), rgba(242,153,74,.06))', border: '1px solid rgba(242,153,74,.3)' }}>
                <Droplet className="w-9 h-9" style={{ color: ACCENT }} />
              </div>
              <span className="font-lato text-[11px] uppercase tracking-[0.2em]" style={{ color: ACCENT }}>VR Turbolub</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Actividad</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">Venta de aceites y lubricantes</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Ubicación</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">Bucaramanga</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Canales</p>
                <p className="font-lato text-white/60 text-[18px]">Local físico, WhatsApp, Instagram y Facebook</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Equipo</p>
                <p className="font-lato text-white/60 text-[18px]">Andrés, su papá y su hermana, socios</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Meta a futuro</p>
                <p className="font-lato text-white/60 text-[18px]">Montar una inmobiliaria propia</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Situación actual</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#f59e0b' }} />
                  <p className="font-poppins font-semibold text-[15px] text-[#f59e0b]">Gestión 100% manual</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              VR Turbolub lleva un año vendiendo aceites y lubricantes en Bucaramanga. El negocio genera ventas, pero todas dependen de que alguien esté en el local: hoy, principalmente su papá. <strong className="text-white/90 font-semibold">El problema no es la venta, es el orden.</strong>
            </p>
            <p>
              Cuando Andrés intentó hacer publicidad, los mensajes llegaron, pero no hubo cómo contestarlos a todos ni hacerles seguimiento. Sin un sistema, cada intento de crecer se vuelve <strong className="text-white/90 font-semibold">caos y ventas que se pierden</strong>.
            </p>
            <p>
              La propuesta: una <strong className="text-white/90 font-semibold">plataforma</strong> que centraliza WhatsApp, Instagram y Facebook, y un <strong className="text-white/90 font-semibold">Asistente de IA</strong> que atiende, resuelve dudas sobre los productos y entrega al asesor solo a los clientes listos para comprar. Así, VR Turbolub deja de depender únicamente del local.
            </p>
          </div>

          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> Lo que este servicio resuelve
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DOLORES.map((h, i) => {
                const Icon = h.icon; const t = TINT[h.tint];
                return (
                  <div key={i} className="rounded-xl p-4 flex gap-3"
                    style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                    <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: t.text }} />
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

        {/* ─ 02 BENEFICIOS ─ */}
        <section id="beneficios" ref={s2.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>02 · Resultados que obtendrá</TagLabel>
          <SectionTitle>Lo que cambia en su día a día</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden mb-8"
            style={{ background: 'rgba(242,153,74,.06)', border: '1px solid rgba(242,153,74,.20)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(242,153,74,.07), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 mb-4" style={{ color: ACCENT }} />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[23px] leading-relaxed">
              <strong className="text-white font-black">«Necesito sistematizarme, porque hoy es puro caos.»</strong> Contestar el primer mensaje, resolver dudas de producto, no dejar a nadie sin respuesta: eso no necesita que usted esté ahí. Eso lo hace el Asistente de IA.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {BENEFICIOS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="rounded-xl p-5 flex gap-4"
                  style={{ background: item.colorAlpha, border: `1px solid ${item.colorBorder}` }}>
                  <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: item.color }} />
                  <div>
                    <p className="font-poppins font-bold text-white/90 text-[17px] mb-1">{item.titulo}</p>
                    <p className="font-lato text-white/50 text-[15px] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Flujo visual */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Workflow className="w-4 h-4 text-[#00bfa5]" /> Del mensaje a la venta
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {[
                { n: '1', t: 'Contacto',     s: 'WhatsApp, Instagram o Facebook', c: ACCENT,    bg: 'rgba(242,153,74,.08)', bd: 'rgba(242,153,74,.22)' },
                { n: '2', t: 'Información',  s: 'Resuelve dudas del producto',    c: '#38bdf8', bg: 'rgba(56,189,248,.08)',  bd: 'rgba(56,189,248,.22)' },
                { n: '3', t: 'Interés',      s: 'El cliente decide comprar',      c: '#f59e0b', bg: 'rgba(245,158,11,.08)',  bd: 'rgba(245,158,11,.22)' },
                { n: '4', t: 'Transferencia',s: 'Pasa al asesor con contexto',    c: '#00bfa5', bg: 'rgba(0,191,165,.08)',   bd: 'rgba(0,191,165,.22)' },
                { n: '5', t: 'Cierre',       s: 'Usted cierra la venta',          c: '#34d399', bg: 'rgba(52,211,153,.08)',  bd: 'rgba(52,211,153,.22)' },
              ].map((step, i) => (
                <div key={i} className="rounded-xl p-3.5" style={{ background: step.bg, border: `1px solid ${step.bd}` }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center mb-2"
                    style={{ background: 'rgba(255,255,255,.06)', border: `1px solid ${step.bd}` }}>
                    <span className="font-poppins font-black text-[12px]" style={{ color: step.c }}>{step.n}</span>
                  </div>
                  <p className="font-poppins font-bold text-white/85 text-[14px] leading-tight mb-1">{step.t}</p>
                  <p className="font-lato text-white/40 text-[12px] leading-snug">{step.s}</p>
                </div>
              ))}
            </div>
            <p className="font-lato text-white/35 text-[13px] mt-4 leading-relaxed">
              Pasos 1 a 4: Asistente de IA. Paso 5: usted, que es donde está su valor.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Primer contacto',  value: 'Automático', sub: 'Sin depender del local' },
              { label: 'Seguimientos',     value: 'Sin fallos', sub: 'El sistema no olvida a nadie' },
              { label: 'Historial de ventas', value: 'Organizado', sub: 'Ya no está en un cuaderno' },
              { label: 'Su tiempo',        value: 'En la venta', sub: 'Cerrar, no contestar mensajes' },
            ].map((k, i) => (
              <div key={i} className="rounded-xl p-4 text-center"
                style={{ background: i < 2 ? 'rgba(242,153,74,.07)' : 'rgba(0,191,165,.06)', border: i < 2 ? '1px solid rgba(242,153,74,.20)' : '1px solid rgba(0,191,165,.18)' }}>
                <p className="font-poppins font-black text-white text-[18px] leading-tight mb-1">{k.value}</p>
                <p className="font-poppins font-semibold text-white/70 text-[13px] mb-0.5">{k.label}</p>
                <p className="font-lato text-white/35 text-[12px]">{k.sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.20)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-[#00bfa5]" />
              <p className="font-poppins font-semibold text-white/80 text-[18px]">Su papá y su hermana, con la misma información</p>
            </div>
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              Ambos entran a la plataforma y ven lo mismo que usted: qué clientes están en conversación, qué falta responder y qué se vendió. Deja de depender de que alguien recuerde todo de memoria.
            </p>
          </div>
        </section>

        {/* ─ 03 QUÉ INCLUYE ─ */}
        <section id="incluye" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 · Qué incluye el servicio</TagLabel>
          <SectionTitle>4 componentes · Plataforma y Asistente de IA</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Una implementación inicial que deja todo funcionando, y un plan mensual que mantiene la plataforma mejorando con el negocio. Toque cada componente para ver el detalle.
          </p>

          <div className="relative">
            <div className="hidden sm:block absolute left-[28px] top-10 bottom-10 w-px"
              style={{ background: 'linear-gradient(to bottom, rgba(0,191,165,.4), rgba(242,153,74,.4), rgba(245,158,11,.4), rgba(56,189,248,.4))' }} />

            <div className="space-y-3">
              {MODULOS.map((mod, i) => {
                const Icon = mod.icon;
                const open = moduloActivo === i;
                return (
                  <div key={i} className="rounded-xl overflow-hidden transition-all duration-300 sm:ml-12 relative"
                    style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${mod.colorBorder}` : '1px solid rgba(255,255,255,.07)' }}>

                    <div className="hidden sm:flex absolute -left-12 top-5 w-8 h-8 rounded-full items-center justify-center border-2 z-10"
                      style={{ background: '#030d1a', borderColor: mod.color }}>
                      <span className="font-poppins font-black text-[13px]" style={{ color: mod.color }}>{mod.num}</span>
                    </div>

                    <button onClick={() => setModuloActivo(open ? null : i)}
                      className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: open ? mod.colorAlpha : 'rgba(255,255,255,.05)' }}>
                        <Icon className="w-4 h-4 transition-colors" style={{ color: open ? mod.color : 'rgba(255,255,255,.35)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`font-poppins font-bold text-[18px] ${open ? 'text-white' : 'text-white/70'}`}>{mod.nombre}</span>
                        <p className={`font-lato text-white/40 text-[15px] mt-0.5 ${open ? '' : 'line-clamp-1'}`}>{mod.descripcion}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ml-2 ${open ? 'rotate-90' : ''}`}
                        style={{ color: open ? mod.color : 'rgba(255,255,255,.3)' }} />
                    </button>

                    {open && (
                      <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                        <div className="pt-4">
                          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Funcionalidades incluidas</p>
                          <ul className="space-y-2">
                            {mod.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: mod.color }} />
                                <span className="font-lato text-white/65 text-[17px] flex-1">{item}</span>
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

          <div className="mt-6 rounded-xl p-4 flex gap-3"
            style={{ background: 'rgba(242,153,74,.06)', border: '1px solid rgba(242,153,74,.22)' }}>
            <Bot className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: ACCENT }} />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              <strong className="text-white/80">Asistente, no un contestador automático.</strong> Un contestador solo repite mensajes fijos. El Asistente de IA de VR Turbolub conversa, responde según el producto, registra al cliente y decide cuándo pasárselo a usted.
            </p>
          </div>
        </section>

        {/* ─ 04 PLAN DE TRABAJO ─ */}
        <section id="plan" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 · Plan de trabajo</TagLabel>
          <SectionTitle>2 semanas hasta tenerlo operando</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Dos fases de una semana, cada una con entregable. Arrancando ahora, la plataforma queda atendiendo clientes reales a finales de septiembre.
          </p>

          <div className="space-y-4">
            {FASES.map((f, i) => (
              <div key={i} className="rounded-2xl p-5 sm:p-6"
                style={{ background: f.colorAlpha, border: `1px solid ${f.colorBorder}` }}>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2"
                    style={{ background: '#030d1a', borderColor: f.color }}>
                    <span className="font-poppins font-black text-[13px]" style={{ color: f.color }}>{f.num}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-poppins font-bold text-white text-[20px] leading-tight">{f.titulo}</p>
                  </div>
                  <span className="font-lato text-[12px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5"
                    style={{ background: 'rgba(255,255,255,.05)', border: `1px solid ${f.colorBorder}`, color: f.color }}>
                    <Clock className="w-3 h-3" /> {f.semanas}
                  </span>
                </div>

                <p className="font-lato text-white/55 text-[17px] leading-relaxed mb-4">{f.desc}</p>

                <ul className="space-y-2 mb-4">
                  {f.hitos.map((h, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: f.color }} />
                      <span className="font-lato text-white/65 text-[16px] flex-1">{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="rounded-xl p-3.5 flex gap-2.5 items-start"
                  style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: f.color }} />
                  <div>
                    <p className="font-poppins font-semibold text-white/50 text-[12px] uppercase tracking-wider mb-0.5">Entregable de la fase</p>
                    <p className="font-lato text-white/75 text-[16px] leading-snug">{f.entregable}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl p-4 flex gap-3"
            style={{ background: 'rgba(56,189,248,.05)', border: '1px solid rgba(56,189,248,.20)' }}>
            <Users className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#38bdf8]" />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              Del lado suyo, una sola dependencia: la sesión de entrenamiento de la semana 1 y el listado de sus 20 productos con precios. Nos adaptamos a los horarios que tenga.
            </p>
          </div>
        </section>

        {/* ─ 05 ALCANCE ─ */}
        <section id="alcance" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 · Alcance y límites</TagLabel>
          <SectionTitle>Qué no está incluido</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Todo lo de los cuatro componentes entra en la inversión. Lo siguiente queda fuera de forma deliberada.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {FUERA.map((f, i) => {
              const Icon = f.icon; const t = TINT[f.tint];
              return (
                <div key={i} className="rounded-xl p-4 flex gap-3"
                  style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                  <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: t.text }} />
                  <div>
                    <p className="font-poppins font-semibold text-white/90 text-[17px] mb-1">{f.titulo}</p>
                    <p className="font-lato text-white/50 text-[15px] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.20)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-5 h-5 text-[#00bfa5]" />
              <p className="font-poppins font-semibold text-white/80 text-[18px]">Crecimiento posterior, sin reprocesos</p>
            </div>
            <p className="font-lato text-white/55 text-[16px] leading-relaxed mb-5">
              Nada de lo entregado se descarta al ampliar el servicio. Estas ampliaciones se cotizan por separado, cuando usted decida que es momento:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FASE2.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 mt-1 text-[#00bfa5]/60" />
                  <span className="font-lato text-white/60 text-[15px] leading-snug flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─ 06 INVERSIÓN ─ */}
        <section id="inversion" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 · Propuesta de inversión</TagLabel>
          <SectionTitle>Dos valores, sin letra menuda.</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Implementación, pago único. Servicio mensual, mientras lo use. Todos los valores en <strong className="text-white/75">pesos colombianos (COP).</strong>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

            {/* Implementación */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(242,153,74,.10) 0%, rgba(3,13,26,.95) 100%)', border: '1px solid rgba(242,153,74,.35)', boxShadow: '0 4px 32px rgba(242,153,74,.15)' }}>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(242,153,74,.2)' }}>
                    <Zap className="w-4 h-4" style={{ color: ACCENT }} />
                  </div>
                  <span className="font-poppins font-bold text-white/70 text-[15px]">Implementación</span>
                  <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider ml-auto"
                    style={{ background: 'rgba(242,153,74,.18)', border: '1px solid rgba(242,153,74,.35)', color: ACCENT }}>
                    Pago único
                  </span>
                </div>
                <p className="font-poppins font-black text-white leading-none mb-1" style={{ fontSize: '2.2rem' }}>
                  $2.000.000
                </p>
                <p className="font-lato text-white/35 text-[15px] mb-5">COP · Una sola vez</p>
                <ul className="space-y-2">
                  {[
                    'Configuración de la plataforma CRM y ChatCenter',
                    'Conexión de WhatsApp, Instagram y Facebook',
                    'Parametrización del Asistente de IA en hasta 20 productos',
                    'Entrenamiento para atender y transferir al asesor de ventas',
                    'Capacitación para usted, su papá y su hermana',
                    'Puesta en marcha y acompañamiento inicial',
                  ].map((p, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: ACCENT }} />
                      <span className="font-lato text-white/60 text-[15px] leading-snug">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mensualidad */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(0,191,165,.08) 0%, rgba(3,13,26,.95) 100%)', border: '1px solid rgba(0,191,165,.28)', boxShadow: '0 4px 32px rgba(0,191,165,.10)' }}>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,191,165,.18)' }}>
                    <Bot className="w-4 h-4 text-[#00bfa5]" />
                  </div>
                  <span className="font-poppins font-bold text-white/70 text-[15px]">Plataforma + Asistente IA</span>
                  <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider ml-auto"
                    style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.28)', color: '#00bfa5' }}>
                    Mensual
                  </span>
                </div>
                <p className="font-poppins font-black text-white leading-none mb-1" style={{ fontSize: '2.2rem' }}>
                  $700.000
                </p>
                <p className="font-lato text-white/35 text-[15px] mb-5">COP mensuales · Pago anticipado</p>
                <ul className="space-y-2">
                  {[
                    'Plataforma funcionando: CRM, ChatCenter y Asistente de IA',
                    'Hasta 60 créditos mensuales para mejoras y capacitaciones',
                    'Hasta 5 solicitudes al mes con el equipo de tecnología de Sixteam',
                    'Bandeja única para WhatsApp, Instagram y Facebook',
                    'Nube, respaldo y actualizaciones incluidas',
                  ].map((p, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
                      <span className="font-lato text-white/60 text-[15px] leading-snug">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Forma de pago */}
          <div className="rounded-xl p-5 sm:p-6 mb-6"
            style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.20)' }}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#00bfa5]" />
              <p className="font-poppins font-semibold text-white/80 text-[18px]">Forma de pago · Implementación</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { pct: '50%', momento: 'Al iniciar el proyecto', desc: 'Con la aceptación arranca la implementación y las dos semanas del cronograma.', valor: '$1.000.000' },
                { pct: '50%', momento: 'Al entregar la plataforma', desc: 'Contra la entrega de la plataforma probada y atendiendo clientes reales.', valor: '$1.000.000' },
              ].map((pago, i) => (
                <div key={i} className="rounded-xl p-4"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className="font-poppins font-black text-[#00bfa5] text-[28px] leading-none">{pago.pct}</p>
                    <p className="font-poppins font-bold text-white/50 text-[16px]">{pago.valor} COP</p>
                  </div>
                  <p className="font-poppins font-semibold text-white/80 text-[15px] mb-1">{pago.momento}</p>
                  <p className="font-lato text-white/40 text-[13px] leading-relaxed">{pago.desc}</p>
                </div>
              ))}
            </div>
            <p className="font-lato text-white/35 text-[13px] mt-4 leading-relaxed">
              La mensualidad de $700.000 COP empieza con la entrega. Durante las dos semanas de implementación no se cobra.
            </p>
          </div>

          {/* Créditos y solicitudes */}
          <div className="rounded-xl p-5 sm:p-6 mb-6"
            style={{ background: 'rgba(245,158,11,.05)', border: '1px solid rgba(245,158,11,.20)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Coins className="w-5 h-5 text-[#f59e0b]" />
              <p className="font-poppins font-semibold text-white/80 text-[18px]">Cómo funcionan los créditos y las solicitudes</p>
            </div>
            <p className="font-lato text-white/55 text-[15px] leading-relaxed">
              Cada mes, el plan incluye <strong className="text-white/80">hasta 60 créditos</strong> redimibles en mejoras al Asistente de IA, ajustes y configuraciones adicionales, o capacitaciones sobre el uso de la plataforma. Además, hasta <strong className="text-white/80">5 solicitudes mensuales</strong> con el equipo de tecnología de Sixteam en marketing, ventas o servicio al cliente. Lo no usado en el mes no se acumula al siguiente.
            </p>
          </div>

          {/* Resumen desembolso */}
          <div className="rounded-xl p-5 sm:p-6 mb-6"
            style={{ background: 'rgba(242,153,74,.06)', border: '1px solid rgba(242,153,74,.22)' }}>
            <p className="font-poppins font-semibold text-white/80 text-[18px] mb-4">El desembolso en el tiempo</p>
            <div className="space-y-2.5">
              {[
                { momento: 'Al aceptar', detalle: 'Primer 50% de la implementación', valor: '$1.000.000' },
                { momento: 'A la entrega, 2 semanas después', detalle: 'Segundo 50% de la implementación', valor: '$1.000.000' },
                { momento: 'Primer mes de uso', detalle: 'Mensualidad anticipada', valor: '$700.000' },
                { momento: 'Meses siguientes', detalle: 'Solo mensualidad', valor: '$700.000' },
              ].map((r, i) => (
                <div key={i} className="rounded-xl p-4 flex flex-wrap items-center gap-3"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <div className="flex-1 min-w-[180px]">
                    <p className="font-poppins font-semibold text-white/80 text-[15px]">{r.momento}</p>
                    <p className="font-lato text-white/40 text-[13px]">{r.detalle}</p>
                  </div>
                  <p className="font-poppins font-bold text-[#00bfa5] text-[16px]">{r.valor}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-4 flex gap-3"
            style={{ background: 'rgba(245,158,11,.05)', border: '1px solid rgba(245,158,11,.20)' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#f59e0b]" />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              Esta propuesta cubre el alcance descrito aquí. Cualquier requerimiento adicional, como la página web nueva o los anuncios pagados, se cotiza aparte y no modifica el valor mensual.
            </p>
          </div>
        </section>

        {/* ── LOGOS DE CLIENTES ── */}
        <div className="mt-16">
          <LogoCarousel logos={(() => {
            const l = [
              { src: '/Logo cebra.png',      alt: 'Logo cebra' },
              { src: '/Logo dance.png',       alt: 'Logo dance' },
              { src: '/Logo Mizar.png',       alt: 'Logo Mizar' },
              { src: '/Logo nibec.png',       alt: 'Logo nibec' },
              { src: '/Logo RAD.png',         alt: 'Logo RAD' },
              { src: '/Logo roofing.png',     alt: 'Logo roofing' },
              { src: '/Logo STC.png',         alt: 'Logo STC' },
              { src: '/Logo stunet.png',      alt: 'Logo stunet' },
              { src: '/LOGO-CALAS.png',       alt: 'LOGO-CALAS' },
              { src: '/logo-dreams.png',      alt: 'logo-dreams' },
              { src: '/logo-evolucione.png',  alt: 'logo-evolucione' },
              { src: '/logo-glish.png',       alt: 'logo-glish' },
              { src: '/images.jpg.jpeg',      alt: 'images' },
              { src: '/Llogo Milote.png',     alt: 'Llogo Milote' },
            ];
            return [...l, ...l];
          })()} />
        </div>

        {/* ─ 07 VIGENCIA ─ */}
        <section id="vigencia" ref={s7.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s7.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>07 · Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y Términos de la Propuesta</SectionTitle>
          <Rule />

          <p className="font-lato text-white/40 text-[15px] mb-5">Toca cada término para ver el detalle.</p>

          <div className="space-y-2.5">
            {TERMINOS.map((item, i) => {
              const Icon = item.icon;
              const open = terminoActivo === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? '1px solid rgba(0,191,165,.28)' : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setTerminoActivo(open ? null : i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? 'rgba(0,191,165,.12)' : 'rgba(255,255,255,.05)' }}>
                      <Icon className="w-4 h-4 transition-colors" style={{ color: open ? '#00bfa5' : 'rgba(255,255,255,.35)' }} />
                    </div>
                    <span className={`font-poppins font-semibold text-[18px] flex-1 min-w-0 ${open ? 'text-white' : 'text-white/70'}`}>{item.titulo}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ml-2 ${open ? 'rotate-90' : ''}`}
                      style={{ color: open ? '#00bfa5' : 'rgba(255,255,255,.3)' }} />
                  </button>

                  {open && (
                    <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <p className="font-lato text-white/60 text-[17px] leading-relaxed pt-4">{item.desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-12 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 100%, rgba(242,153,74,.05), transparent 70%)' }} />
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
              <div className="flex flex-wrap justify-center gap-1.5 text-[13px] text-white/25 font-lato mt-2">
                <span>Propuesta presentada a</span>
                <span className="text-white/40 font-medium">Andrés Vargas · VR Turbolub</span>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 text-[13px] text-white/25 font-lato mt-1">
                <span>Propuesta elaborada por</span>
                <span className="text-white/40 font-medium">Ernesto Hernández</span>
                <span>·</span>
                <span>Gerente Comercial Sixteam</span>
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

export default VrTurbolubProposal;
