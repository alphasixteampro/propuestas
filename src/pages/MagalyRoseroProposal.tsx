import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap,
  AlertCircle, Info, Calendar, MapPin,
  Users, Shield, Lock, XCircle,
  GraduationCap, MessageSquare, Bot, CalendarCheck, Database,
  Filter, BellRing, Workflow, Layers, UserCheck, Phone, Stamp, TrendingUp,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Magaly Rosero',
  tagline: 'Consultoría en desarrollo organizacional y humano',
  sector: 'Formación empresarial · Programa Propulsor Empresarial · Compensar',
  fecha: 'Agosto 2026',
  lugar: 'Bogotá, Colombia',
  objetivo: 'Un Empleado IA que contacta, califica y agenda citas con empresas, y la plataforma Sixteam.pro donde queda organizada toda la gestión: contactos, oportunidades y agenda en un solo lugar.',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  destinatarios: 'Magaly Rosero',
};

const VIOLET = '#9b7ef5';
const TRM = 4000; // COP por USD, referencial

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber:  { text: '#f59e0b',  bg: 'rgba(251,191,36,.07)',   border: 'rgba(251,191,36,.18)' },
  teal:   { text: '#00bfa5',  bg: 'rgba(0,191,165,.07)',    border: 'rgba(0,191,165,.18)'  },
  blue:   { text: '#38bdf8',  bg: 'rgba(56,189,248,.07)',   border: 'rgba(56,189,248,.18)' },
  red:    { text: '#f87171',  bg: 'rgba(221,51,51,.07)',    border: 'rgba(221,51,51,.2)'   },
  purple: { text: VIOLET,     bg: 'rgba(155,126,245,.07)',  border: 'rgba(155,126,245,.20)'},
};

// ─── PUNTOS DE DOLOR ─────────────────────────────────────────────────────────

const DOLORES = [
  {
    titulo: 'Los seguimientos se pierden',
    desc: 'Quedó de llamar el 3, llamó el 10. No es descuido: es una agenda de asesorías de 7 a. m. a 8 p. m. sosteniendo a mano decenas de conversaciones abiertas.',
    icon: AlertCircle, tint: 'red',
  },
  {
    titulo: 'La intercambiadera de WhatsApp consume el día',
    desc: 'El ida y vuelta hasta lograr la cita gasta paciencia y tiempo. Trabajo de carpintería que no necesita criterio pedagógico.',
    icon: MessageSquare, tint: 'amber',
  },
  {
    titulo: 'Más de 100.000 empresas, un par de manos',
    desc: 'La base de 8.000 contactos llega de a 100, porque más de 100 no se alcanzan a gestionar.',
    icon: Users, tint: 'blue',
  },
  {
    titulo: 'Sin filtro previo',
    desc: 'Solo aplican empresas de Compensar. Hoy ese dato se descubre conversando, con los mensajes ya invertidos.',
    icon: Filter, tint: 'purple',
  },
];

// ─── BENEFICIOS ──────────────────────────────────────────────────────────────

const BENEFICIOS = [
  {
    icon: Bot, color: VIOLET, colorAlpha: 'rgba(155,126,245,.08)', colorBorder: 'rgba(155,126,245,.22)',
    titulo: 'El primer contacto no depende de su agenda',
    desc: 'Abre por WhatsApp y correo con el gancho que ya funciona: dos formaciones a la medida al año. Responde a cualquier hora.',
  },
  {
    icon: Filter, color: '#38bdf8', colorAlpha: 'rgba(56,189,248,.08)', colorBorder: 'rgba(56,189,248,.22)',
    titulo: 'Llegan filtradas: solo Compensar',
    desc: 'Pregunta la caja antes de avanzar. Cafam o Colsubsidio se cierran con cortesía y quedan marcadas.',
  },
  {
    icon: BellRing, color: '#f59e0b', colorAlpha: 'rgba(245,158,11,.08)', colorBorder: 'rgba(245,158,11,.22)',
    titulo: 'Ningún seguimiento se vuelve a pasar',
    desc: 'Si dicen «hablemos el tres», el sistema escribe el tres. Si no responden, insiste hasta el sí o el no.',
  },
  {
    icon: CalendarCheck, color: '#00bfa5', colorAlpha: 'rgba(0,191,165,.08)', colorBorder: 'rgba(0,191,165,.22)',
    titulo: 'La cita de 20 minutos se agenda sola',
    desc: 'Consulta su calendario, propone horarios reales y confirma. Sin días de mensajes de coordinación.',
  },
  {
    icon: UserCheck, color: '#a78bfa', colorAlpha: 'rgba(167,139,250,.08)', colorBorder: 'rgba(167,139,250,.22)',
    titulo: 'Usted entra cuando ya está caliente',
    desc: 'El agente le transfiere el chat con el contexto listo: quién es, qué preguntó y qué necesita.',
  },
  {
    icon: Database, color: '#34d399', colorAlpha: 'rgba(52,211,153,.08)', colorBorder: 'rgba(52,211,153,.22)',
    titulo: 'Bases sueltas, una sola base viva',
    desc: 'Los archivos de los referidos se unifican y se actualizan solos con cada conversación.',
  },
];

// ─── QUÉ INCLUYE ─────────────────────────────────────────────────────────────

const MODULOS: { num: string; nombre: string; icon: React.ElementType; color: string; colorAlpha: string; colorBorder: string; descripcion: string; items: string[] }[] = [
  {
    num: '01',
    nombre: 'Empleado IA conversacional',
    icon: Bot,
    color: VIOLET,
    colorAlpha: 'rgba(155,126,245,.10)',
    colorBorder: 'rgba(155,126,245,.28)',
    descripcion: 'Contacta, explica el programa y sostiene el ida y vuelta hasta que la empresa decide.',
    items: [
      'Entrenado con el contenido real del Propulsor Empresarial y su forma de explicarlo',
      'Apertura con su gancho: dos formaciones a la medida por colaborador al año',
      'WhatsApp y correo, con respuesta inmediata a cualquier hora',
      'Objeciones y preguntas frecuentes ya cargadas',
      'Tono y límites definidos con usted: qué decir y qué no decir nunca',
      'Envío de audios, imágenes y documentos de apoyo',
      'Se identifica como asistente y escala a usted cuando corresponde',
    ],
  },
  {
    num: '02',
    nombre: 'Calificación y captura de datos',
    icon: Filter,
    color: '#38bdf8',
    colorAlpha: 'rgba(56,189,248,.10)',
    colorBorder: 'rgba(56,189,248,.28)',
    descripcion: 'El filtro que hoy no existe, escrito en la base sin que nadie lo digite.',
    items: [
      'Filtro por caja de compensación: Compensar avanza, las demás se marcan y se cierran',
      'Captura de la categoría de aportes de la empresa',
      'Empresa, contacto, cargo, teléfono y correo registrados solos',
      'Campos propios: número de colaboradores, sector e interés declarado',
      'La base se actualiza sin transcripción manual',
      'Etapa automática: contacto, interesada, cita agendada o descartada',
      'Motivo de descarte registrado, para no repetir el contacto',
    ],
  },
  {
    num: '03',
    nombre: 'Agendamiento y seguimientos',
    icon: CalendarCheck,
    color: '#f59e0b',
    colorAlpha: 'rgba(245,158,11,.10)',
    colorBorder: 'rgba(245,158,11,.28)',
    descripcion: 'El objetivo de todo el sistema: la reunión de 20 minutos, sin conversaciones colgadas.',
    items: [
      'Conexión con su calendario y horarios reales de disponibilidad',
      'La cita se agenda dentro de la misma conversación',
      'Recordatorios automáticos antes de la reunión',
      'Flujo de insistencia configurado hasta obtener un sí o un no',
      'Reprogramación cuando la empresa pide una fecha específica',
      'Derivación a usted con notificación y tarea de contexto',
      'Reactivación de contactos que quedaron en el aire, incluidos los de julio',
    ],
  },
  {
    num: '04',
    nombre: 'Plataforma Sixteam.pro',
    icon: Layers,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.28)',
    descripcion: 'Donde vive todo: contactos, oportunidades, conversaciones y lo que recopila el agente.',
    items: [
      'Contactos y empresas sin límite de registros, con campos a la medida',
      'Bandeja única: WhatsApp, correo, Instagram y Facebook en un solo lugar',
      'Tablero de oportunidades por etapa',
      'Agenda integrada con las citas del Empleado IA',
      'Tareas y notificaciones cuando algo requiere su atención',
      'Usuarios ilimitados: sus practicantes entran sin costo extra',
      'Métricas: conversaciones, atendidas por el agente, derivadas, citas y conversión',
      'Nube, respaldo y actualizaciones incluidas',
    ],
  },
];

// ─── PLAN DE TRABAJO ─────────────────────────────────────────────────────────

const FASES = [
  {
    num: '01',
    semanas: 'Semana 1',
    titulo: 'Entrenamiento y configuración',
    color: VIOLET,
    colorAlpha: 'rgba(155,126,245,.10)',
    colorBorder: 'rgba(155,126,245,.28)',
    desc: 'Construimos el agente con usted: qué sabe, cómo habla, qué pregunta y hasta dónde llega.',
    hitos: [
      'Sesión de trabajo: discurso, objeciones y límites del agente',
      'Conexión de WhatsApp, correo y calendario',
      'Carga y unificación de sus bases actuales',
      'Campos propios: caja de compensación, categoría y etapas',
    ],
    entregable: 'Empleado IA entrenado y plataforma configurada, lista para pruebas',
  },
  {
    num: '02',
    semanas: 'Semana 2',
    titulo: 'Pruebas, ajuste y puesta en marcha',
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.28)',
    desc: 'Probamos con conversaciones reales, ajustamos y lo dejamos operando con su equipo dentro.',
    hitos: [
      'Pruebas de punta a punta, con usted validando respuestas',
      'Ajuste de tono, filtro y tiempos de seguimiento',
      'Flujos de insistencia y recordatorios de cita',
      'Alta de practicantes como usuarios y capacitación de una hora',
    ],
    entregable: 'Empleado IA en producción, conversando y agendando con empresas reales',
  },
];

// ─── FUERA DE ALCANCE ────────────────────────────────────────────────────────

const FUERA = [
  {
    titulo: 'Agente de voz para llamadas',
    desc: 'Posible y mencionado en la reunión. Se cotiza aparte, sin rehacer nada de lo entregado.',
    icon: Phone, tint: 'amber',
  },
  {
    titulo: 'Consecución de bases de datos',
    desc: 'Trabajamos sobre las bases que usted ya tiene. La compra de listados no entra.',
    icon: Database, tint: 'blue',
  },
  {
    titulo: 'Pauta publicitaria',
    desc: 'El agente trabaja sobre contactos que usted aporta. Anuncios en Meta o Google son servicio aparte.',
    icon: TrendingUp, tint: 'purple',
  },
  {
    titulo: 'Cierre comercial y contrato',
    desc: 'El agente lleva hasta la cita. Presentar, cerrar y el trámite con el director del proyecto siguen en sus manos.',
    icon: XCircle, tint: 'red',
  },
];

// ─── AMPLIACIONES POSTERIORES ────────────────────────────────────────────────

const FASE2 = [
  'Agente de voz que llama y conversa por teléfono',
  'LinkedIn como canal adicional de contacto',
  'Campañas de correo segmentadas por sector y tamaño',
  'Reportes ejecutivos mensuales de gestión',
  'Reporte automático de empresas cerradas al director del proyecto',
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
    desc: 'Dos pagos del 50% sobre $1.750.905 COP: $875.453 al iniciar y $875.452 contra la entrega. Pago único, no se repite.',
    icon: FileText,
  },
  {
    titulo: 'Pago mensual del servicio',
    desc: '$650.000 COP anticipados, desde la entrega del Empleado IA. Durante las dos semanas de implementación no se cobra mensualidad.',
    icon: Clock,
  },
  {
    titulo: 'Consumo de inteligencia artificial',
    desc: 'USD 0,02 por mensaje enviado por el agente, facturado al cierre de mes según consumo real. Los mensajes que usted recibe no se cobran. La calculadora de esta propuesta es referencial.',
    icon: Zap,
  },
  {
    titulo: 'Duración de la implementación',
    desc: 'Dos semanas desde el primer pago, en dos fases con entregable revisable.',
    icon: Calendar,
  },
  {
    titulo: 'SLA y atención de incidencias',
    desc: 'Respuesta máxima de 4 horas en días hábiles, por WhatsApp o correo. Si el agente responde mal, se corrige.',
    icon: Shield,
  },
  {
    titulo: 'Lo que necesitamos de su lado',
    desc: 'Línea de WhatsApp dedicada, acceso al correo de contacto, sus bases actuales y la sesión de entrenamiento de la semana 1.',
    icon: Users,
  },
  {
    titulo: 'Modificaciones al alcance',
    desc: 'Lo no contemplado aquí se cotiza aparte y no modifica el valor mensual acordado.',
    icon: AlertCircle,
  },
  {
    titulo: 'Propiedad y confidencialidad',
    desc: 'Sus bases, contactos e información son suyos. Sixteam mantiene confidencialidad total, durante y después del servicio.',
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
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: `linear-gradient(90deg,${VIOLET},#00bfa5)` }} />
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const MagalyRoseroProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [moduloActivo, setModuloActivo] = useState<number | null>(null);
  const [terminoActivo, setTerminoActivo] = useState<number | null>(null);
  const [showCalcIA, setShowCalcIA] = useState(false);
  const [mensajesConv, setMensajesConv] = useState(4);
  const [convsMes, setConvsMes] = useState(100);

  const consumoIAUSD = 0.02 * mensajesConv * convsMes;
  const consumoIACOP = Math.round(consumoIAUSD * TRM);

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
            style={{ background: 'radial-gradient(circle, rgba(155,126,245,.06) 0%, transparent 65%)' }} />
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
          .calc-slider{accent-color:${VIOLET};height:4px;cursor:pointer}
        `}</style>

        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta comercial · Empleado IA + Plataforma</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${VIOLET}, #5c46a8)` }}>
                  <GraduationCap className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">Magaly Rosero</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(155,126,245,.12)', border: '1px solid rgba(155,126,245,.28)', color: VIOLET }}>
                  Consultoría y formación empresarial
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 4.8rem)' }}>
                Empleado<br />
                <span style={{ background: `linear-gradient(90deg,${VIOLET},#00bfa5)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  IA
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
                  style={{ background: 'radial-gradient(circle, rgba(155,126,245,.08) 0%, rgba(0,191,165,.04) 50%, transparent 70%)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full" style={{ border: '1px solid rgba(155,126,245,.12)' }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(0,191,165,.15)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: VIOLET, boxShadow: '0 0 6px rgba(155,126,245,.8)' }} />
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
                    style={{ background: 'linear-gradient(135deg, rgba(155,126,245,.18), rgba(155,126,245,.06))', border: '1px solid rgba(155,126,245,.3)', boxShadow: '0 4px 30px rgba(155,126,245,.18)' }}>
                    <GraduationCap className="w-12 h-12" style={{ color: VIOLET }} />
                  </div>
                  <div className="text-center">
                    <p className="font-poppins font-bold text-white/80 text-[17px] tracking-tight">Magaly Rosero</p>
                    <p className="font-lato text-[13px] uppercase tracking-[0.2em] mt-1" style={{ color: VIOLET }}>Propulsor Empresarial · Compensar</p>
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
            style={{ background: 'rgba(2,8,20,.85)', border: '1px solid rgba(155,126,245,.20)' }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="rounded-xl p-4 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(155,126,245,.18), rgba(155,126,245,.06))', border: '1px solid rgba(155,126,245,.3)' }}>
                <GraduationCap className="w-9 h-9" style={{ color: VIOLET }} />
              </div>
              <span className="font-lato text-[11px] uppercase tracking-[0.2em]" style={{ color: VIOLET }}>Magaly Rosero</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Actividad</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">Desarrollo organizacional y humano</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Programa</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">Propulsor Empresarial · Compensar</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Canales</p>
                <p className="font-lato text-white/60 text-[18px]">WhatsApp y correo</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Meta declarada</p>
                <p className="font-lato text-white/60 text-[18px]">3 a 4 empresas al mes</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Equipo</p>
                <p className="font-lato text-white/60 text-[18px]">Ella y practicantes de apoyo</p>
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
              El Propulsor Empresarial lo subvenciona el Estado y lo ejecuta Compensar: las empresas afiliadas tienen derecho a dos formaciones a la medida por colaborador al año, sin costo. Buen producto, mercado enorme. <strong className="text-white/90 font-semibold">El problema no está ahí.</strong>
            </p>
            <p>
              Está en que llegar a esas empresas depende hoy de una sola persona que además dicta asesorías de 7 a. m. a 8 p. m. La gestión se cae justo donde se decide una venta: <strong className="text-white/90 font-semibold">en el seguimiento</strong>.
            </p>
            <p>
              La propuesta: un <strong className="text-white/90 font-semibold">Empleado IA</strong> que contacta, filtra, insiste y agenda, más una <strong className="text-white/90 font-semibold">plataforma</strong> donde queda toda esa gestión. Objetivo concreto: llegar a la reunión de 20 minutos con la empresa ya calificada y ya interesada.
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
            style={{ background: 'rgba(155,126,245,.06)', border: '1px solid rgba(155,126,245,.20)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(155,126,245,.07), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 mb-4" style={{ color: VIOLET }} />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[23px] leading-relaxed">
              <strong className="text-white font-black">«Yo quiero tener es esa reunión de 20 minutos, presentar la propuesta y cerrar.»</strong> Todo lo anterior —el primer mensaje, el filtro, la insistencia, el agendamiento— no necesita su criterio. Eso hace el Empleado IA.
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
              <Workflow className="w-4 h-4 text-[#00bfa5]" /> De la base de datos a la cita
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {[
                { n: '1', t: 'Contacto',     s: 'WhatsApp y correo',        c: VIOLET,    bg: 'rgba(155,126,245,.08)', bd: 'rgba(155,126,245,.22)' },
                { n: '2', t: 'Calificación', s: '¿Es de Compensar?',        c: '#38bdf8', bg: 'rgba(56,189,248,.08)',  bd: 'rgba(56,189,248,.22)' },
                { n: '3', t: 'Seguimiento',  s: 'Insiste hasta el sí o no', c: '#f59e0b', bg: 'rgba(245,158,11,.08)',  bd: 'rgba(245,158,11,.22)' },
                { n: '4', t: 'Cita',         s: 'Agenda los 20 minutos',    c: '#00bfa5', bg: 'rgba(0,191,165,.08)',   bd: 'rgba(0,191,165,.22)' },
                { n: '5', t: 'Cierre',       s: 'Usted presenta y cierra',  c: '#34d399', bg: 'rgba(52,211,153,.08)',  bd: 'rgba(52,211,153,.22)' },
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
              Pasos 1 a 4: Empleado IA. Paso 5: usted, que es donde está su valor.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Primer contacto',  value: 'Automático', sub: 'Sin depender de su agenda' },
              { label: 'Seguimientos',     value: 'Sin fallos', sub: 'El sistema no olvida fechas' },
              { label: 'Empresas que no aplican', value: 'Filtradas', sub: 'Antes de gastar su tiempo' },
              { label: 'Su tiempo',        value: 'En la cita', sub: 'Presentar y cerrar' },
            ].map((k, i) => (
              <div key={i} className="rounded-xl p-4 text-center"
                style={{ background: i < 2 ? 'rgba(155,126,245,.07)' : 'rgba(0,191,165,.06)', border: i < 2 ? '1px solid rgba(155,126,245,.20)' : '1px solid rgba(0,191,165,.18)' }}>
                <p className="font-poppins font-black text-white text-[18px] leading-tight mb-1">{k.value}</p>
                <p className="font-poppins font-semibold text-white/70 text-[13px] mb-0.5">{k.label}</p>
                <p className="font-lato text-white/35 text-[12px]">{k.sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.20)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-[#00bfa5]" />
              <p className="font-poppins font-semibold text-white/80 text-[18px]">Sus practicantes, con números reales</p>
            </div>
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              Entran como usuarios sin costo extra y trabajan sobre la misma base: qué está abierto, qué espera respuesta, qué quedó marcado. Deja de ser ayuda informal y pasa a ser gestión medible, sobre la cual sí se puede pactar una comisión.
            </p>
          </div>
        </section>

        {/* ─ 03 QUÉ INCLUYE ─ */}
        <section id="incluye" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 · Qué incluye el servicio</TagLabel>
          <SectionTitle>4 componentes · Empleado IA y plataforma</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Dos partes que funcionan juntas: el agente que conversa y gestiona, y la plataforma donde queda todo lo que recopila. Toque cada componente para ver el detalle.
          </p>

          <div className="relative">
            <div className="hidden sm:block absolute left-[28px] top-10 bottom-10 w-px"
              style={{ background: 'linear-gradient(to bottom, rgba(155,126,245,.4), rgba(56,189,248,.4), rgba(245,158,11,.4), rgba(0,191,165,.4))' }} />

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
            style={{ background: 'rgba(155,126,245,.06)', border: '1px solid rgba(155,126,245,.22)' }}>
            <Bot className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: VIOLET }} />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              <strong className="text-white/80">Agente, no chatbot.</strong> El chatbot solo conversa con botones y respuestas fijas. El agente conversa, recopila, escribe en la base, agenda y le transfiere el caso con una tarea.
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
            Dos fases de una semana, cada una con entregable. Arrancando ahora, el agente queda conversando con empresas reales a finales de agosto.
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
              Del lado suyo, una sola dependencia: la sesión de entrenamiento de la semana 1 y un par de espacios cortos de validación. Nos adaptamos a los horarios que tenga.
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
              La plataforma permite crear tantos agentes como se necesiten. Nada de lo entregado se descarta al ampliar. Estas ampliaciones se cotizan por separado:
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
              style={{ background: 'linear-gradient(135deg, rgba(155,126,245,.10) 0%, rgba(3,13,26,.95) 100%)', border: '1px solid rgba(155,126,245,.35)', boxShadow: '0 4px 32px rgba(155,126,245,.15)' }}>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(155,126,245,.2)' }}>
                    <Zap className="w-4 h-4" style={{ color: VIOLET }} />
                  </div>
                  <span className="font-poppins font-bold text-white/70 text-[15px]">Implementación</span>
                  <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider ml-auto"
                    style={{ background: 'rgba(155,126,245,.18)', border: '1px solid rgba(155,126,245,.35)', color: VIOLET }}>
                    Pago único
                  </span>
                </div>
                <p className="font-poppins font-black text-white leading-none mb-1" style={{ fontSize: '2.2rem' }}>
                  $1.750.905
                </p>
                <p className="font-lato text-white/35 text-[15px] mb-5">COP · Una sola vez</p>
                <ul className="space-y-2">
                  {[
                    'Entrenamiento del agente con su discurso y sus objeciones',
                    'Conexión de WhatsApp, correo y calendario',
                    'Configuración de plataforma, campos propios y etapas',
                    'Carga y unificación de sus bases actuales',
                    'Capacitación para usted y sus practicantes',
                    'Puesta en marcha y acompañamiento inicial',
                  ].map((p, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: VIOLET }} />
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
                  <span className="font-poppins font-bold text-white/70 text-[15px]">Empleado IA + Plataforma</span>
                  <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider ml-auto"
                    style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.28)', color: '#00bfa5' }}>
                    Mensual
                  </span>
                </div>
                <p className="font-poppins font-black text-white leading-none mb-1" style={{ fontSize: '2.2rem' }}>
                  $650.000
                </p>
                <p className="font-lato text-white/35 text-[15px] mb-5">COP mensuales · Pago anticipado</p>
                <ul className="space-y-2">
                  {[
                    'Agente operando en WhatsApp y correo, sin límite de conversaciones',
                    'Plataforma con contactos, oportunidades y agenda',
                    'Bandeja única y usuarios ilimitados',
                    'Nube, respaldo y actualizaciones',
                    'Ajustes y mejoras al agente cuando haga falta',
                    'SLA de respuesta de 4 horas',
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
                { pct: '50%', momento: 'Al iniciar el proyecto', desc: 'Con la aceptación arranca la implementación y las dos semanas del cronograma.', valor: '$875.453' },
                { pct: '50%', momento: 'Al entregar el Empleado IA', desc: 'Contra la entrega del agente probado y conversando con empresas reales.', valor: '$875.452' },
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
              La mensualidad de $650.000 COP empieza con la entrega. Durante las dos semanas de implementación no se cobra.
            </p>
          </div>

          {/* Consumo de IA */}
          <div className="rounded-xl p-5 sm:p-6 mb-6"
            style={{ background: 'rgba(56,189,248,.05)', border: '1px solid rgba(56,189,248,.20)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-[#38bdf8]" />
              <p className="font-poppins font-semibold text-white/80 text-[18px]">Consumo de inteligencia artificial</p>
            </div>
            <p className="font-lato text-white/55 text-[15px] leading-relaxed mb-4">
              Único costo variable. <strong className="text-white/80">USD 0,02 por mensaje enviado por el agente</strong>; los que usted recibe no se cobran.{' '}
              <span className="font-lato text-[12px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,.12)', color: '#f59e0b' }}>Facturado mes vencido · según consumo real</span>{' '}
              Use la calculadora para estimar su costo mensual.
            </p>

            {/* Calculadora IA */}
            <div className="rounded-xl overflow-hidden transition-all duration-300"
              style={{ border: showCalcIA ? `1px solid rgba(155,126,245,.35)` : '1px solid rgba(255,255,255,.07)' }}>
              <button onClick={() => setShowCalcIA(v => !v)}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-left"
                style={{ background: showCalcIA ? 'rgba(155,126,245,.06)' : 'transparent' }}>
                <span className="font-lato text-[13px] flex-1" style={{ color: 'rgba(155,126,245,.8)' }}>
                  + Calcular consumo mensual por uso de IA
                </span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 flex-shrink-0"
                  style={{ color: 'rgba(155,126,245,.6)', transform: showCalcIA ? 'rotate(90deg)' : undefined }} />
              </button>
              {showCalcIA && (
                <div className="px-4 pb-4 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                  <div className="pt-3 space-y-3">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                      style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: VIOLET }} />
                      <span className="font-lato text-white/50 text-[13px]">Valor IA por mensaje</span>
                      <span className="font-poppins font-black ml-auto text-[13px]" style={{ color: VIOLET }}>USD 0.02</span>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-lato text-white/35 text-[11px]">Mensajes promedio por conversación</span>
                        <span className="font-poppins font-bold text-white text-[12px]">{mensajesConv}</span>
                      </div>
                      <input type="range" min={2} max={20} step={1} className="w-full calc-slider"
                        value={mensajesConv} onChange={e => setMensajesConv(Number(e.target.value))} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-lato text-white/35 text-[11px]">Empresas contactadas por mes</span>
                        <span className="font-poppins font-bold text-white text-[12px]">{convsMes}</span>
                      </div>
                      <input type="range" min={25} max={1000} step={25} className="w-full calc-slider"
                        value={convsMes} onChange={e => setConvsMes(Number(e.target.value))} />
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: 'rgba(155,126,245,.12)' }}>
                      <div>
                        <span className="font-lato text-white/40 text-[11px]">Consumo estimado</span>
                        <p className="font-lato text-white/25 text-[10px] mt-0.5">USD 0.02 × {mensajesConv} msg × {convsMes} empresas</p>
                      </div>
                      <div className="text-right">
                        <span className="font-poppins font-bold text-[15px] block" style={{ color: VIOLET }}>≈ USD {consumoIAUSD.toFixed(2)}/mes</span>
                        <span className="font-lato text-white/40 text-[11px]">≈ ${consumoIACOP.toLocaleString('es-CO')} COP</span>
                      </div>
                    </div>
                    <p className="font-lato text-white/25 text-[10px] leading-relaxed">
                      Estimación referencial. Conversión a TRM de ${TRM.toLocaleString('es-CO')} por dólar. El consumo real varía según el volumen gestionado por el agente.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resumen desembolso */}
          <div className="rounded-xl p-5 sm:p-6 mb-6"
            style={{ background: 'rgba(155,126,245,.06)', border: '1px solid rgba(155,126,245,.22)' }}>
            <p className="font-poppins font-semibold text-white/80 text-[18px] mb-4">El desembolso en el tiempo</p>
            <div className="space-y-2.5">
              {[
                { momento: 'Al aceptar', detalle: 'Primer 50% de la implementación', valor: '$875.453' },
                { momento: 'A la entrega, 2 semanas después', detalle: 'Segundo 50% de la implementación', valor: '$875.452' },
                { momento: 'Primer mes de uso', detalle: 'Mensualidad anticipada + consumo de IA', valor: '$650.000 + consumo' },
                { momento: 'Meses siguientes', detalle: 'Solo mensualidad y consumo', valor: '$650.000 + consumo' },
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
              Esta propuesta cubre el alcance descrito aquí. Cualquier requerimiento adicional, como el agente de voz, se cotiza aparte y no modifica el valor mensual.
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
              style={{ background: 'radial-gradient(circle at 50% 100%, rgba(155,126,245,.05), transparent 70%)' }} />
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
                <span className="text-white/40 font-medium">Magaly Rosero · Desarrollo organizacional y humano</span>
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

export default MagalyRoseroProposal;
