import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, ChevronRight,
  Calendar, MapPin, User, Info,
  MessageSquare, BarChart3, Zap, AlertCircle,
  Mail, Phone,
} from 'lucide-react';
import LogoCarousel from '../components/LogoCarousel';

const NS_BLUE   = '#2563eb';
const NS_PINK   = '#ec4899';

const META = {
  cliente:        'Nutsport',
  sector:         'Nutrición Deportiva · Salud · Chile',
  fecha:          'Mayo 2026',
  proponente:     'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit:            '901.967.849-4',
  correo:         'alpha@sixteam.pro',
  rl:             'Samuel Armando Burgos Ferrer',
  dirigidoA:      'Bárbara Cruz Poblete',
  elaboradaPor:   'Ernesto Hernandez',
  cargoElaborador:'Gerente Comercial',
  objetivo:
    'Implementación de CRM, Chat Center y agente IA para automatizar la atención al paciente, reducir cancelaciones y activar la base de pacientes inactivos de Nutsport.',
};

const HALLAZGOS = [
  {
    num: '01',
    titulo: 'Respuesta tardía, paciente perdido',
    desc: '15 a 20 mensajes diarios en WhatsApp sin gestión estructurada. Consultas que llegan a las 2 AM quedan sin respuesta hasta el día siguiente. Casos reales de pacientes que esperaron y terminaron agendando con otro profesional.',
    tint: 'pink',
  },
  {
    num: '02',
    titulo: '5 agendas, cero visibilidad',
    desc: '5 nutricionistas con horarios distintos y confirmaciones de cita completamente manuales. Alta tasa de cancelaciones de último minuto sin recordatorio previo ni mecanismo de resguardo.',
    tint: 'blue',
  },
  {
    num: '03',
    titulo: 'Base de pacientes sin trabajar',
    desc: 'Pacientes que vinieron una sola vez a medirse o a consulta particular y no volvieron. No hay reactivación, no hay seguimiento. Los ingresos de consultas particulares están por debajo de su potencial real.',
    tint: 'teal',
  },
  {
    num: '04',
    titulo: 'Sin pipeline, sin métricas de venta',
    desc: 'Medilink cubre las fichas clínicas pero no es un CRM comercial. No hay historial de conversaciones de ventas, sin pipeline de seguimiento, sin datos de conversión. Sin datos reales, no hay escalamiento controlado.',
    tint: 'amber',
  },
];

const COMPONENTES = [
  {
    id:        'crm',
    num:       '01',
    nombre:    'CRM + Chat Center',
    subtitulo: 'Todo en un solo lugar · Visibilidad total del equipo',
    desc:      'Que ningún mensaje quede sin respuesta y que el equipo siempre sepa en qué punto está cada paciente. Un espacio compartido donde se ve todo: conversaciones, historial, estado de cada contacto y quién es el responsable.',
    icon:      BarChart3,
    tint:      'blue',
    items: [
      'Todos los mensajes de WhatsApp e Instagram en un solo lugar — el equipo responde sin cambiar de app',
      'Cada paciente con su historial completo: qué preguntó, cuándo agendó, qué profesional lo atendió',
      'Vista clara de cuántos prospectos activos hay, cuáles agendaron y cuáles no volvieron',
      'El equipo completo conectado — hasta 5 personas trabajando de forma coordinada',
      'Nunca se pierde un mensaje, nunca se responde dos veces lo mismo',
      'Información del paciente organizada: objetivo, tipo de servicio, convenio, profesional asignado',
      'Panel de métricas con el estado de ventas, actividad del equipo y oportunidades activas en tiempo real',
    ],
  },
  {
    id:        'bot-ia',
    num:       '02',
    nombre:    'Asistente IA de Atención',
    subtitulo: 'Respuestas automáticas · 24/7 · Sin intervención del equipo',
    desc:      'Un asistente entrenado con la información real de Nutsport que atiende a los pacientes a cualquier hora. Responde preguntas frecuentes, explica los servicios, ayuda al paciente a entender qué necesita y lo acompaña hasta el agendamiento — todo sin que el equipo tenga que intervenir.',
    icon:      MessageSquare,
    tint:      'pink',
    items: [
      'Responde al instante preguntas frecuentes: precios, convenios, horarios y disponibilidad de nutricionistas',
      'Explica los servicios de Nutsport para que el paciente entienda qué ofrece cada uno',
      'Guía al paciente para identificar cuál es el servicio que mejor se adapta a lo que necesita',
      'Lo lleva directamente a la página de agendamiento de citas cuando ya sabe qué quiere',
      'Cuando la consulta necesita más detalle, conecta al paciente con un nutricionista del equipo',
      'Disponible las 24 horas — atiende incluso cuando el equipo no está conectado',
    ],
  },
  {
    id:        'automatizaciones',
    num:       '03',
    nombre:    'Automatizaciones + Integración Medilink',
    subtitulo: 'Fidelización · Reactivación · Agendamiento con pago',
    desc:      'Que el sistema siga trabajando después de que el paciente agenda. Confirmaciones, recordatorios y seguimiento automáticos para reducir cancelaciones y mantener la relación activa, más la integración con Medilink para que toda la información de los pacientes esté disponible en el CRM.',
    icon:      Zap,
    tint:      'teal',
    items: [
      'El paciente recibe confirmación de su cita al instante — sin que el equipo haga nada',
      'Recordatorio automático el día anterior: menos cancelaciones de último minuto',
      'Seguimiento post-consulta que invita a reagendar y fortalece la relación con el paciente',
      'Los pacientes que no han vuelto reciben un mensaje de reactivación de forma automática',
      'Toda la base de pacientes de Medilink disponible en el CRM del equipo',
      'Agendamiento con link de pago incluido directamente desde la conversación de WhatsApp',
    ],
  },
];

const FASES = [
  {
    num:    'Fase 1',
    nombre: 'Implementación CRM + Chat Center',
    duracion: '2–3 semanas',
    valor:  'USD 800',
    icon:   BarChart3,
    tint:   'blue',
    entregables: [
      'Todos los mensajes de WhatsApp e Instagram del equipo en un solo lugar',
      'Cada paciente con su historial de contacto y estado visible para todo el equipo',
      'Un flujo de atención diseñado para Nutsport: desde el primer mensaje hasta la fidelización',
      'Todo el equipo conectado y coordinado — hasta 5 personas',
      'Información del paciente organizada: objetivo, servicio, convenio, profesional asignado',
      'Panel de métricas para hacer seguimiento y control a las actividades de venta del equipo',
      'Capacitación para que el equipo domine el sistema desde el día 1 — 2 sesiones en vivo',
    ],
    detalle: [
      'Desde el día 1, el equipo deja de responder desde WhatsApp personal o varias cuentas sin control. Todos los mensajes llegan al mismo lugar, con el historial de cada paciente visible para quien lo atienda.',
      'El equipo puede ver en tiempo real cuántos pacientes están esperando respuesta, cuántos ya agendaron y cuáles llevan tiempo sin aparecer. Esa visibilidad es la base para crecer sin perder el control.',
      'Las dos sesiones de capacitación garantizan que el equipo use el sistema con confianza. No es instalar algo y entregarlo: acompañamos hasta que el flujo funcione bien en la práctica.',
    ],
  },
  {
    num:    'Fase 2',
    nombre: 'Desarrollo Bot IA Conversacional',
    duracion: '1–2 semanas',
    valor:  'USD 300',
    icon:   MessageSquare,
    tint:   'pink',
    entregables: [
      'Un asistente que responde mensajes automáticamente, incluso a las 2 AM',
      'El paciente siempre recibe una respuesta — el equipo no tiene que estar conectado',
      'Responde preguntas frecuentes: precios, servicios, convenios, disponibilidad de profesionales',
      'Explica los servicios y ayuda al paciente a identificar cuál necesita',
      'Lleva al paciente directamente a agendar su cita cuando ya sabe qué quiere',
      'Cuando la consulta necesita atención personalizada, conecta al paciente con el equipo',
    ],
    detalle: [
      'El asistente se entrena con la información real de Nutsport: los servicios que ofrecen, los profesionales disponibles, los precios y las preguntas que más llegan por WhatsApp. Responde como si fuera parte del equipo.',
      'Cada paciente que escribe recibe orientación inmediata. Si tiene dudas sobre qué servicio necesita, el asistente lo guía para que llegue al equipo con una decisión más clara — o directamente al agendamiento.',
      'Antes de activarse, se hacen pruebas reales con el equipo de Nutsport para que el asistente responda exactamente como ustedes esperan. Sin aprobación del equipo, no sale a producción.',
    ],
  },
  {
    num:    'Fase 3',
    nombre: 'Automatizaciones + Integración Medilink',
    duracion: 'Por definir',
    valor:  'Por cotizar',
    icon:   Zap,
    tint:   'teal',
    entregables: [
      'El paciente recibe confirmación de su cita al instante, sin que el equipo haga nada',
      'Recordatorio automático el día anterior: el paciente no olvida su cita',
      'Seguimiento post-consulta que invita a reagendar y mantiene el vínculo activo',
      'Los pacientes que llevan meses sin volver reciben un mensaje de reactivación automático',
      'Toda la base de pacientes de Medilink disponible para el equipo en el CRM',
      'El paciente puede agendar y pagar directamente desde la conversación de WhatsApp',
    ],
    detalle: [
      'Una vez que el paciente agenda, el sistema toma el control: confirmación inmediata, recordatorio al día siguiente y seguimiento después de la consulta. El equipo se concentra en atender, no en hacer seguimiento manual.',
      'Los pacientes que dejaron de venir no desaparecen — el sistema los contacta de forma automática según el tiempo que llevan inactivos. Sin esfuerzo del equipo, la base de pacientes históricos se convierte en un activo real.',
      'El alcance y el valor de esta fase se definen juntos una vez que las Fases 1 y 2 estén activas. Lo que se puede hacer depende de cómo está configurado Medilink en Nutsport, y eso lo revisamos en conjunto.',
    ],
  },
];

const SECCIONES = [
  { id: 'resumen',     label: 'Resumen'     },
  { id: 'diagnostico', label: 'Diagnóstico' },
  { id: 'sistema',     label: 'Sistema'     },
  { id: 'plan',        label: 'Plan'        },
  { id: 'cotizacion',  label: 'Inversión'   },
  { id: 'terminos',    label: 'Términos'    },
  { id: 'vigencia',    label: 'Vigencia'    },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  blue:  { text: 'text-[#60a5fa]', bg: 'rgba(96,165,250,.07)',  border: 'rgba(96,165,250,.18)'  },
  pink:  { text: 'text-[#f472b6]', bg: 'rgba(244,114,182,.07)', border: 'rgba(244,114,182,.18)' },
  teal:  { text: 'text-[#00bfa5]', bg: 'rgba(0,191,165,.07)',   border: 'rgba(0,191,165,.18)'   },
  amber: { text: 'text-amber-400', bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)'  },
};

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
  <span className="font-lato text-[13px] uppercase tracking-[0.22em] font-medium" style={{ color: '#60a5fa' }}>{children}</span>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-poppins font-extrabold text-white mt-2 mb-2 leading-tight"
    style={{ fontSize: 'clamp(1.8125rem, 4.375vw, 2.625rem)' }}>
    {children}
  </h2>
);

const Rule = () => (
  <div className="w-10 h-0.5 mb-7 mt-1"
    style={{ background: `linear-gradient(90deg, ${NS_PINK}, ${NS_BLUE})` }} />
);

const NutsportProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [compActivo, setCompActivo]       = useState<number | null>(null);
  const [faseActiva, setFaseActiva]       = useState<number | null>(null);
  const [termActivo, setTermActivo]       = useState<number | null>(null);
  const [pasoActivo, setPasoActivo]       = useState<number | null>(null);
  const [showCalc, setShowCalc]           = useState(false);
  const [showSoporte, setShowSoporte]     = useState(false);
  const [mensajesConv, setMensajesConv]   = useState(8);
  const [convsMes, setConvsMes]           = useState(200);

  const consumoIAUSD = (0.02 * mensajesConv * convsMes).toFixed(2);

  useEffect(() => {
    const handler = () => {
      const offset = window.innerWidth >= 1024 ? 140 : 60;
      for (const s of SECCIONES) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= offset && bottom > offset) { setActiveSection(s.id); break; }
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const s1 = useVisible(); const s2 = useVisible(); const s3 = useVisible();
  const s4 = useVisible(); const s5 = useVisible(); const s6 = useVisible();
  const s7 = useVisible();

  return (
    <div id="proposal-root" className="min-h-screen overflow-x-hidden" style={{ background: '#030d1a', fontFamily: 'Lato, sans-serif' }}>

      {/* NAV LATERAL */}
      <nav className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-50 flex-col gap-3 no-print">
        {SECCIONES.map(s => (
          <button key={s.id} onClick={() => scrollTo(s.id)}
            className={`group flex items-center gap-2.5 transition-all duration-300 ${activeSection === s.id ? 'opacity-100' : 'opacity-25 hover:opacity-60'}`}>
            <span className={`font-lato text-[14px] text-white whitespace-nowrap transition-all duration-300 ${activeSection === s.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>
              {s.label}
            </span>
            <div className={`rounded-full flex-shrink-0 transition-all duration-300 ${activeSection === s.id ? 'w-2 h-2 shadow-[0_0_6px_rgba(37,99,235,.7)]' : 'w-1.5 h-1.5 bg-white/50'}`}
              style={activeSection === s.id ? { background: NS_BLUE } : {}} />
          </button>
        ))}
      </nav>

      {/* ══════════ PORTADA */}
      <header className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #030d1a 0%, #040f1e 55%, #060d18 100%)' }}>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
            style={{ background: `radial-gradient(circle, ${NS_BLUE}0c 0%, transparent 65%)` }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: `radial-gradient(circle, ${NS_PINK}0a 0%, transparent 70%)`, transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
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
          html { scroll-behavior: smooth; }
          input[type=range] { accent-color: ${NS_BLUE}; }
        `}</style>

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-b" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-white">
              <img src="/sixteam-logo.png" alt="Sixteam.pro" className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <div>
              <span className="font-poppins font-black text-white text-xl tracking-tight">Sixteam<span style={{ color: NS_BLUE }}>.</span>pro</span>
              <p className="font-lato text-white/35 text-[13px] leading-none mt-0.5">Innovación y Estrategia Digital</p>
            </div>
          </div>
          <span className="font-lato text-[13px] uppercase tracking-[0.2em] border rounded-full px-3 py-1.5"
            style={{ color: '#60a5fa', borderColor: `${NS_BLUE}25` }}>
            Confidencial · {META.fecha}
          </span>
        </div>

        {/* Cuerpo portada */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-12 px-6 sm:px-10 lg:px-[10%]">
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            {/* Izquierda */}
            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta comercial · CRM · Chat Center · Bot IA</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${NS_BLUE}, ${NS_PINK})` }}>
                  <Zap className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: `${NS_BLUE}12`, border: `1px solid ${NS_BLUE}28`, color: '#60a5fa' }}>
                  Nutrición · Chile
                </span>
              </div>

              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}>
                De la consulta<br />
                <span style={{ background: `linear-gradient(90deg, ${NS_BLUE}, ${NS_PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  al sistema
                </span><br />
                que escala.
              </h1>

              <p className="font-lato text-white/55 text-xl leading-relaxed mb-5">{META.objetivo}</p>

              {/* Fórmula Sixteam */}
              <div className="inline-flex flex-wrap items-center gap-1.5 px-4 py-2 rounded-xl mb-6 self-start"
                style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)' }}>
                <span className="font-poppins font-bold text-white/80 text-[15px] sm:text-[16px]">Process</span>
                <span className="font-poppins font-bold text-[#1d70a2] text-[15px] sm:text-[16px]">+</span>
                <span className="font-poppins font-bold text-[#1d70a2] text-[15px] sm:text-[16px]">Technology</span>
                <span className="font-poppins font-bold text-[#00bfa5] text-[15px] sm:text-[16px]">+</span>
                <span className="font-poppins font-bold text-[#00bfa5] text-[15px] sm:text-[16px]">People</span>
                <span className="font-poppins font-bold text-white/50 text-[15px] sm:text-[16px]">=</span>
                <span className="font-poppins font-black text-[#00bfa5] text-[15px] sm:text-[16px]">Growth</span>
              </div>

              {/* Chips de meta */}
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  { icon: Calendar, text: META.fecha },
                  { icon: MapPin,   text: 'Chile' },
                  { icon: User,     text: META.dirigidoA },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[14px] text-white/60"
                    style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: '#60a5fa' }} /> {text}
                  </div>
                ))}
              </div>

              {/* TOC */}
              <div className="border-t pt-5" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-widest mb-3">Contenido</p>
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-x-6 gap-y-1.5">
                  {[
                    '1. Resumen ejecutivo',
                    '2. Diagnóstico',
                    '3. Sistema propuesto',
                    '4. Plan de trabajo',
                    '5. Inversión',
                    '6. Términos',
                    '7. Vigencia y cierre',
                  ].map((item, i) => (
                    <button key={i} onClick={() => scrollTo(SECCIONES[i]?.id)}
                      className="font-lato text-white/45 text-[15px] transition-colors duration-200 text-left flex items-center gap-1.5"
                      onMouseEnter={e => (e.currentTarget.style.color = '#60a5fa')}
                      onMouseLeave={e => (e.currentTarget.style.color = '')}>
                      <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: `${NS_BLUE}60` }} />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Derecha: logos animados */}
            <div className="flex items-center justify-center relative min-h-[260px] sm:min-h-[380px]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="cover-glow absolute w-80 h-80 rounded-full"
                  style={{ background: `radial-gradient(circle, ${NS_BLUE}12 0%, ${NS_PINK}06 50%, transparent 70%)` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full"
                  style={{ border: `1px solid ${NS_BLUE}12` }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full"
                  style={{ border: `1px dashed ${NS_PINK}18` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: NS_BLUE, boxShadow: `0 0 8px ${NS_BLUE}cc` }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: NS_PINK, boxShadow: `0 0 6px ${NS_PINK}cc` }} />
                </div>
              </div>

              <div className="cover-float relative z-10 flex flex-col items-center gap-6 w-full px-6">
                <div className="flex flex-col items-center gap-1">
                  <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-20 w-auto object-contain"
                    style={{ filter: `drop-shadow(0 4px 20px ${NS_BLUE}45)` }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <span className="font-poppins font-black text-white/30 text-[11px] uppercase tracking-[0.2em]">Sixteam.pro</span>
                </div>

                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${NS_BLUE}20)` }} />
                  <div className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)' }}>
                    <span className="font-poppins font-black text-white/40 text-[20px] leading-none">×</span>
                  </div>
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${NS_BLUE}20, transparent)` }} />
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-2xl px-6 py-4 flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,.06)', border: `1px solid ${NS_BLUE}20`, boxShadow: `0 4px 28px ${NS_BLUE}18` }}>
                    <img src="/nutsport-logo.png" alt="Nutsport" className="h-10 w-auto object-contain max-w-[220px]"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <span className="font-poppins font-black text-white/30 text-[11px] uppercase tracking-[0.2em] text-center">Nutsport</span>
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

      {/* SOCIAL PROOF */}
      <div className="w-full relative z-20 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <LogoCarousel />
      </div>

      {/* NAV MÓVIL */}
      <nav className="lg:hidden sticky top-0 z-40 no-print"
        style={{ background: 'rgba(3,13,26,0.96)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <div className="flex overflow-x-auto py-2.5 px-4 gap-2" style={{ scrollbarWidth: 'none' }}>
          {SECCIONES.map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full font-lato text-[13px] whitespace-nowrap transition-all duration-200"
              style={activeSection === s.id
                ? { background: NS_BLUE, color: '#ffffff', fontWeight: 600 }
                : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)' }}>
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ══════════ MAIN */}
      <main className="max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-20 space-y-24">

        {/* ─ 01 RESUMEN ─ */}
        <section id="resumen" ref={s1.ref as React.RefObject<HTMLElement>}
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s1.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>01 — Resumen Ejecutivo</TagLabel>
          <SectionTitle>¿Qué estamos construyendo?</SectionTitle>
          <Rule />

          {/* Ficha cliente */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="rounded-2xl overflow-hidden flex items-center justify-center px-5 py-3"
                style={{ background: 'rgba(255,255,255,.07)', border: `1px solid ${NS_BLUE}20`, boxShadow: `0 4px 20px ${NS_BLUE}14` }}>
                <img src="/nutsport-logo.png" alt="Nutsport" className="h-10 w-auto object-contain max-w-[160px]"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <span className="font-poppins font-black text-white text-[13px] tracking-tight text-center">Nutsport</span>
              <span className="font-lato text-[11px] uppercase tracking-[0.18em] text-center" style={{ color: '#60a5fa' }}>Chile · 2026</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                <p className="font-poppins font-semibold text-white/80 text-[17px]">{META.sector}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Alcance</p>
                <p className="font-poppins font-semibold text-white/80 text-[17px]">CRM · Bot IA · Fidelización</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Dirigida a</p>
                <p className="font-lato text-white/60 text-[17px]">{META.dirigidoA}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Elaborado por</p>
                <p className="font-lato text-white/60 text-[17px]">{META.elaboradaPor} · {META.cargoElaborador}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              <strong className="text-white">Nutsport</strong> tiene lo esencial para crecer: 5 profesionales especializados, una base de pacientes activa y una demanda entrante real. Lo que frena el crecimiento no es el producto, es la falta de sistema para manejarlo.
            </p>
            <p>
              Sixteam.pro implementará el <strong className="text-white">CRM, Chat Center y agente IA</strong> que transforma la operación: desde una bandeja de mensajes sin estructura hasta un sistema donde cada paciente tiene historial, seguimiento y atención oportuna, incluso a las 2 de la mañana.
            </p>
          </div>

          {/* Flujo de atención */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4" style={{ color: '#60a5fa' }} /> Cómo cambia el flujo de atención y ventas
            </p>
            <div className="space-y-2">
              {[
                { paso: 'El lead llega por WhatsApp o Instagram',          sub: 'El asistente IA responde al instante — cualquier hora' },
                { paso: 'El CRM registra y ubica al lead en el proceso',   sub: 'Etapa correcta desde el primer contacto, sin pasos manuales' },
                { paso: 'El equipo da seguimiento con contexto completo',  sub: 'Toda la información del lead visible y actualizada en tiempo real' },
                { paso: 'Cada etapa del proceso de ventas avanza con claridad', sub: 'Sin leads perdidos ni seguimientos duplicados' },
                { paso: 'Panel de métricas actualizado',                   sub: 'Actividad del equipo, oportunidades activas y estado de ventas' },
              ].map(({ paso, sub }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 text-[11px] font-poppins font-black"
                      style={{ borderColor: `rgba(37,99,235,.3)`, background: `rgba(37,99,235,.07)`, color: '#60a5fa' }}>
                      {i + 1}
                    </div>
                    {i < 4 && <div className="w-px flex-1 mt-1" style={{ background: 'rgba(37,99,235,.12)', minHeight: 16 }} />}
                  </div>
                  <div className="pb-2">
                    <p className="font-poppins font-semibold text-white text-[15px]">{paso}</p>
                    <p className="font-lato text-white/40 text-[13px]">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─ 02 DIAGNÓSTICO ─ */}
        <section id="diagnostico" ref={s2.ref as React.RefObject<HTMLElement>}
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>02 — Diagnóstico</TagLabel>
          <SectionTitle>Los 4 frenos al crecimiento</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Identificados en la reunión de diagnóstico del 25 de mayo de 2026. Cada uno de estos frenos se resuelve directamente con los componentes del sistema propuesto.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HALLAZGOS.map((h, i) => {
              const t = TINT[h.tint];
              return (
                <div key={i} className="rounded-xl p-4 flex gap-3"
                  style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                  <AlertCircle className={`w-4 h-4 ${t.text} flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className={`font-poppins font-bold text-[13px] mb-0.5 ${t.text}`}>{h.num}</p>
                    <p className="font-poppins font-semibold text-white/90 text-[15px] mb-1">{h.titulo}</p>
                    <p className="font-lato text-white/50 text-[14px] leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─ 03 SISTEMA ─ */}
        <section id="sistema" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — Sistema Propuesto</TagLabel>
          <SectionTitle>Los 3 componentes del sistema</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Cada componente resuelve uno o más frenos identificados en el diagnóstico. Juntos forman un sistema que opera con mínima intervención manual en los puntos críticos del ciclo de atención.
          </p>

          <div className="space-y-3">
            {COMPONENTES.map((c, i) => {
              const Icon = c.icon;
              const t = TINT[c.tint];
              const open = compActivo === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${t.border}` : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setCompActivo(open ? null : i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? t.bg : 'rgba(255,255,255,.05)' }}>
                      <Icon className={`w-4 h-4 ${t.text} transition-colors`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`font-lato text-[12px] uppercase tracking-widest ${t.text}`} style={{ opacity: 0.9 }}>{c.num}</span>
                      <p className={`font-poppins font-bold text-[18px] mt-0.5 ${open ? 'text-white' : 'text-white/70'}`}>{c.nombre}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <p className="font-lato text-white/30 text-[12px] hidden sm:block">{c.subtitulo}</p>
                      <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                        style={{ color: `${NS_BLUE}60`, transform: open ? 'rotate(90deg)' : undefined }} />
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
        </section>

        {/* ─ 04 PLAN ─ */}
        <section id="plan" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Plan de Trabajo</TagLabel>
          <SectionTitle>Fases de implementación</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Las Fases 1 y 2 se implementan de forma consecutiva en un plazo estimado de <strong className="text-white/80">3–5 semanas</strong>. La Fase 3 (Automatizaciones + Medilink) se cotiza y planifica en conjunto una vez activo el sistema base.
          </p>

          {/* Timeline */}
          <div className="rounded-2xl p-5 sm:p-6 mb-6"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-lato text-[12px] uppercase tracking-widest mb-5" style={{ color: `${NS_BLUE}90` }}>
              Cronograma · Fases 1 y 2 · Fase 3 por definir
            </p>

            <div className="hidden sm:block relative mb-2">
              <div className="absolute top-4 left-[5%] right-[30%] h-0.5"
                style={{ background: `linear-gradient(90deg, ${NS_BLUE}40, ${NS_PINK}40)` }} />
              <div className="absolute top-4 right-[5%] left-[72%] h-0.5 border-t-2 border-dashed"
                style={{ borderColor: 'rgba(0,191,165,.25)' }} />
              <div className="grid grid-cols-5 gap-2 relative">
                {[
                  { label: 'Kick-off',      sub: 'Día 1',    solid: true  },
                  { label: 'Fase 1 CRM',    sub: 'Sem. 1–3', solid: true  },
                  { label: 'Fase 2 Bot IA', sub: 'Sem. 3–5', solid: true  },
                  { label: 'Go Live F1+F2', sub: 'Sem. 5',   solid: true  },
                  { label: 'Fase 3',        sub: 'Por definir', solid: false },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center z-10 relative"
                      style={step.solid
                        ? { background: `linear-gradient(135deg, ${NS_BLUE}, ${NS_PINK})`, boxShadow: `0 0 12px ${NS_BLUE}40` }
                        : { background: 'rgba(0,191,165,.12)', border: '1.5px dashed rgba(0,191,165,.5)' }}>
                      <span className="font-poppins font-black text-[11px]"
                        style={{ color: step.solid ? '#fff' : '#00bfa5' }}>{i + 1}</span>
                    </div>
                    <p className="font-poppins font-bold text-[11px] leading-snug"
                      style={{ color: step.solid ? 'rgba(255,255,255,.7)' : 'rgba(0,191,165,.8)' }}>{step.label}</p>
                    <p className="font-lato text-white/35 text-[10px]">{step.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="sm:hidden space-y-3">
              {[
                { label: 'Kick-off',       sub: 'Día 1',     solid: true  },
                { label: 'Fase 1 CRM',     sub: 'Semanas 1–3', solid: true },
                { label: 'Fase 2 Bot IA',  sub: 'Semanas 3–5', solid: true },
                { label: 'Go Live F1+F2',  sub: 'Semana 5',  solid: true  },
                { label: 'Fase 3 Medilink', sub: 'Por definir', solid: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={step.solid
                      ? { background: `linear-gradient(135deg, ${NS_BLUE}, ${NS_PINK})` }
                      : { background: 'rgba(0,191,165,.12)', border: '1.5px dashed rgba(0,191,165,.5)' }}>
                    <span className="font-poppins font-black text-[11px]"
                      style={{ color: step.solid ? '#fff' : '#00bfa5' }}>{i + 1}</span>
                  </div>
                  <div>
                    <p className="font-poppins font-bold text-[14px]"
                      style={{ color: step.solid ? '#fff' : 'rgba(0,191,165,.9)' }}>{step.label}</p>
                    <p className="font-lato text-white/40 text-[12px]">{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {FASES.map((fase, i) => {
              const Icon = fase.icon;
              const t = TINT[fase.tint];
              const open = faseActiva === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${t.border}` : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setFaseActiva(open ? null : i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? t.bg : 'rgba(255,255,255,.05)' }}>
                      <Icon className={`w-4 h-4 transition-colors ${open ? t.text : 'text-white/40'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`font-lato text-[12px] uppercase tracking-widest ${t.text}`} style={{ opacity: 0.9 }}>{fase.num}</span>
                      <p className={`font-poppins font-bold text-[18px] mt-0.5 ${open ? 'text-white' : 'text-white/70'}`}>{fase.nombre}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <p className="font-lato text-white/35 text-[13px] hidden sm:block">{fase.duracion}</p>
                      <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                        style={{ color: `${NS_BLUE}60`, transform: open ? 'rotate(90deg)' : undefined }} />
                    </div>
                  </button>

                  {open && (
                    <div className="px-4 sm:px-5 pb-6 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <CheckCircle className={`w-3.5 h-3.5 ${t.text}`} /> Entregables
                          </p>
                          <ul className="space-y-2">
                            {fase.entregables.map((e, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <CheckCircle className={`w-3.5 h-3.5 ${t.text} flex-shrink-0 mt-0.5`} />
                                <span className="font-lato text-white/65 text-[14px]">{e}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Detalle</p>
                          <ul className="space-y-2.5">
                            {fase.detalle.map((d, j) => (
                              <li key={j} className="font-lato text-white/50 text-[14px] leading-snug pl-3 border-l"
                                style={{ borderColor: `${NS_BLUE}40` }}>{d}</li>
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

        {/* ─ 05 COTIZACIÓN ─ */}
        <section id="cotizacion" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Inversión</TagLabel>
          <SectionTitle>Inversión por componente</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Dos fases de implementación de pago único para el sistema base, más una Fase 3 de automatizaciones e integración con Medilink cuyo valor se cotiza en conjunto una vez activo el sistema.
          </p>

          {/* Fase 1 */}
          <div className="rounded-xl p-5 sm:p-6 mb-4 flex flex-col sm:flex-row gap-5 sm:items-start"
            style={{ background: `${NS_BLUE}06`, border: `1px solid ${NS_BLUE}22` }}>
            <div className="flex items-center gap-4 sm:w-[45%]">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${NS_BLUE}15`, border: `1px solid ${NS_BLUE}30` }}>
                <BarChart3 className="w-5 h-5" style={{ color: '#60a5fa' }} />
              </div>
              <div>
                <p className="font-poppins font-bold text-white/85 text-[17px]">CRM + Chat Center</p>
                <p className="font-lato text-white/40 text-[13px] mt-0.5">Pipeline · bandeja unificada · automatizaciones base</p>
              </div>
            </div>
            <div className="sm:w-[25%]">
              <p className="font-poppins font-black text-[1.8rem]" style={{ color: '#60a5fa' }}>
                USD 800<span className="font-lato font-normal text-white/40 text-[1rem]"> · único</span>
              </p>
            </div>
            <div className="sm:flex-1">
              <ul className="space-y-1">
                {[
                  'Subaccount Nutsport configurado en Plataforma Sixteam',
                  'WhatsApp Business e Instagram DM conectados',
                  'Pipeline de atención y campos personalizados',
                  'Hasta 3 usuarios · automatizaciones base incluidas',
                  'Capacitación del equipo: 2 sesiones en vivo',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 flex-shrink-0 mt-[3px]" style={{ color: '#60a5fa' }} />
                    <span className="font-lato text-white/55 text-[14px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Fase 2 */}
          <div className="rounded-xl p-5 sm:p-6 mb-4 flex flex-col sm:flex-row gap-5 sm:items-start"
            style={{ background: 'rgba(244,114,182,.05)', border: '1px solid rgba(244,114,182,.2)' }}>
            <div className="flex items-center gap-4 sm:w-[45%]">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(244,114,182,.12)', border: '1px solid rgba(244,114,182,.3)' }}>
                <MessageSquare className="w-5 h-5 text-[#f472b6]" />
              </div>
              <div>
                <p className="font-poppins font-bold text-white/85 text-[17px]">Agente IA Conversacional</p>
                <p className="font-lato text-white/40 text-[13px] mt-0.5">Bot entrenado · handoff · 2 rondas de testing</p>
              </div>
            </div>
            <div className="sm:w-[25%]">
              <p className="font-poppins font-black text-[1.8rem] text-[#f472b6]">
                USD 300<span className="font-lato font-normal text-white/40 text-[1rem]"> · único</span>
              </p>
            </div>
            <div className="sm:flex-1">
              <ul className="space-y-1">
                {[
                  'Bot IA entrenado con FAQ real de Nutsport',
                  'Flujo de bienvenida y calificación del paciente',
                  'Protocolo para consultas particulares y convenios',
                  'Handoff bot → equipo con contexto completo',
                  'Testing y ajuste fino (hasta 2 rondas)',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-[#f472b6] flex-shrink-0 mt-[3px]" />
                    <span className="font-lato text-white/55 text-[14px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Fase 3 — Por cotizar */}
          <div className="rounded-xl p-5 sm:p-6 mb-4 flex flex-col sm:flex-row gap-5 sm:items-start"
            style={{ background: 'rgba(0,191,165,.04)', border: '1px dashed rgba(0,191,165,.3)' }}>
            <div className="flex items-center gap-4 sm:w-[45%]">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,191,165,.1)', border: '1px solid rgba(0,191,165,.25)' }}>
                <Zap className="w-5 h-5 text-[#00bfa5]" />
              </div>
              <div>
                <p className="font-poppins font-bold text-white/85 text-[17px]">Automatizaciones + Integración Medilink</p>
                <p className="font-lato text-white/40 text-[13px] mt-0.5">Fidelización · Reactivación · Medilink API</p>
              </div>
            </div>
            <div className="sm:w-[25%]">
              <p className="font-poppins font-black text-[1.6rem] text-[#00bfa5]">Por cotizar</p>
              <p className="font-lato text-white/30 text-[12px] mt-0.5">Alcance por definir</p>
            </div>
            <div className="sm:flex-1">
              <ul className="space-y-1">
                {[
                  'Agendamiento con link de pago automático vía Medilink',
                  'Base de pacientes históricos y activos en el CRM',
                  'Confirmación, recordatorio y seguimiento post-cita',
                  'Flujos de reactivación (30, 60 y 90 días)',
                  'Campaña de recontacto para base histórica',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-[#00bfa5] flex-shrink-0 mt-[3px]" />
                    <span className="font-lato text-white/55 text-[14px]">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="font-lato text-white/30 text-[12px] mt-3 leading-relaxed">
                El valor de esta fase se define una vez activo el sistema base y revisadas las capacidades de la API de Medilink.
              </p>
            </div>
          </div>

          {/* Resumen */}
          <div className="rounded-2xl p-6 sm:p-7 mb-4" style={{ background: `${NS_BLUE}06`, border: `1px solid ${NS_BLUE}20` }}>
            <p className="font-lato text-white/35 text-[13px] uppercase tracking-widest mb-4">Resumen de inversión · Fases 1 y 2</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                <p className="font-lato text-white/35 text-[13px] uppercase tracking-wider mb-1">Fase 1 · CRM + Chat Center</p>
                <p className="font-poppins font-black text-white text-[1.2rem]">USD 800<span className="text-white/40 text-[0.85rem] font-lato font-normal"> · único</span></p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                <p className="font-lato text-white/35 text-[13px] uppercase tracking-wider mb-1">Fase 2 · Bot IA</p>
                <p className="font-poppins font-black text-white text-[1.2rem]">USD 300<span className="text-white/40 text-[0.85rem] font-lato font-normal"> · único</span></p>
              </div>
              <div className="rounded-xl p-4" style={{ background: `${NS_BLUE}08`, border: `1px solid ${NS_BLUE}25` }}>
                <p className="font-lato text-[13px] uppercase tracking-wider mb-1" style={{ color: '#60a5fa90' }}>Total Fases 1 + 2</p>
                <p className="font-poppins font-black text-white text-[1.2rem]">USD 1.100</p>
                <p className="font-lato text-white/30 text-[11px] mt-0.5">+ Fase 3 por cotizar</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {[
                'Fases 1 y 2 son pagos únicos — cada una al inicio de la fase',
                'Fase 3 se cotiza una vez activo el sistema base',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#60a5fa' }} />
                  <span className="font-lato text-white/50 text-[13px]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plataforma mensual — visible siempre */}
          <div className="rounded-xl overflow-hidden mb-3"
            style={{ background: 'rgba(255,255,255,.03)', border: `1px solid rgba(255,255,255,.08)` }}>
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${NS_BLUE}18` }}>
                <Zap className="w-4 h-4" style={{ color: '#60a5fa' }} />
              </div>
              <div className="flex-1 flex flex-wrap items-center gap-2">
                <span className="font-poppins font-bold text-[16px] text-white">Plataforma mensual recurrente</span>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-poppins font-black text-[15px]" style={{ color: '#60a5fa' }}>
                  USD 240<span className="font-lato font-normal text-white/35 text-[12px]">/mes</span>
                </p>
                <p className="font-lato text-white/30 text-[11px]">+ consumo IA variable</p>
              </div>
            </div>
            <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
              <div className="pt-4 space-y-4">

                {/* Desglose de usuarios */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.06)' }}>
                    <p className="font-lato text-white/35 text-[11px] uppercase tracking-wider mb-1">Plataforma base</p>
                    <p className="font-poppins font-black text-white text-[1rem]">USD 240<span className="font-lato font-normal text-white/35 text-[0.8rem]">/mes</span></p>
                    <p className="font-lato text-white/30 text-[11px] mt-0.5">Incluye 3 usuarios</p>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: `${NS_BLUE}08`, border: `1px solid ${NS_BLUE}20` }}>
                    <p className="font-lato text-[11px] uppercase tracking-wider mb-1" style={{ color: '#60a5fa80' }}>Total · 3 usuarios</p>
                    <p className="font-poppins font-black text-white text-[1rem]">USD 240<span className="font-lato font-normal text-white/35 text-[0.8rem]">/mes</span></p>
                    <p className="font-lato text-white/30 text-[11px] mt-0.5">+ consumo IA variable</p>
                  </div>
                </div>

                <ul className="space-y-1.5">
                  {[
                    'WhatsApp Business e Instagram DM conectados',
                    'Acceso completo al CRM, Chat Center y automatizaciones',
                    'Panel de métricas de ventas y actividad del equipo',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#60a5fa' }} />
                      <span className="font-lato text-white/55 text-[14px]">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Calculadora IA — acordeón interno */}
                <div className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ border: showCalc ? `1px solid ${NS_BLUE}35` : '1px solid rgba(255,255,255,.06)' }}>
                  <button onClick={() => setShowCalc(!showCalc)}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-left"
                    style={{ background: showCalc ? `${NS_BLUE}06` : 'transparent' }}>
                    <span className="font-lato text-[13px] flex-1" style={{ color: '#60a5fa80' }}>
                      + Calcular consumo mensual por uso de IA
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 flex-shrink-0"
                      style={{ color: `${NS_BLUE}50`, transform: showCalc ? 'rotate(90deg)' : undefined }} />
                  </button>
                  {showCalc && (
                    <div className="px-4 pb-4 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <div className="pt-3 space-y-3">
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
                        <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: `rgba(37,99,235,.12)` }}>
                          <div>
                            <span className="font-lato text-white/40 text-[11px]">Consumo estimado</span>
                            <p className="font-lato text-white/25 text-[10px] mt-0.5">USD 0,02 × {mensajesConv} msg × {convsMes} conv</p>
                          </div>
                          <span className="font-poppins font-bold text-[14px]" style={{ color: '#60a5fa' }}>≈ USD {consumoIAUSD}/mes</span>
                        </div>
                        <p className="font-lato text-white/25 text-[10px] leading-relaxed">
                          Estimación referencial. El consumo real varía según el volumen de conversaciones.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Soporte y Operaciones — opcional */}
          <div className="rounded-xl overflow-hidden transition-all duration-300 mb-3"
            style={{ background: 'rgba(255,255,255,.03)', border: showSoporte ? `1px solid ${NS_BLUE}40` : '1px solid rgba(255,255,255,.08)' }}>
            <button onClick={() => setShowSoporte(!showSoporte)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: showSoporte ? `${NS_BLUE}18` : 'rgba(255,255,255,.05)' }}>
                <CheckCircle className="w-4 h-4" style={{ color: showSoporte ? '#60a5fa' : 'rgba(255,255,255,.35)' }} />
              </div>
              <div className="flex-1 flex flex-wrap items-center gap-2">
                <span className={`font-poppins font-bold text-[16px] ${showSoporte ? 'text-white' : 'text-white/65'}`}>
                  Soporte y Operaciones
                </span>
                <span className="font-lato text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: `${NS_BLUE}12`, border: `1px solid ${NS_BLUE}25`, color: '#60a5fa' }}>
                  Opcional
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="font-poppins font-black text-[15px]" style={{ color: '#60a5fa' }}>
                    USD 180<span className="font-lato font-normal text-white/35 text-[12px]">/mes</span>
                  </p>
                  <p className="font-lato text-white/30 text-[11px]">5 horas · +USD 40/h adicional</p>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                  style={{ color: `${NS_BLUE}60`, transform: showSoporte ? 'rotate(90deg)' : undefined }} />
              </div>
            </button>
            {showSoporte && (
              <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                <div className="pt-4 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-poppins font-black text-[1.5rem]" style={{ color: '#60a5fa' }}>
                      USD 180<span className="font-lato font-normal text-white/40 text-[1rem]">/mes · 5 horas</span>
                    </p>
                    <span className="font-lato text-[12px] px-2 py-0.5 rounded-full"
                      style={{ background: `${NS_BLUE}12`, border: `1px solid ${NS_BLUE}25`, color: '#60a5fa' }}>
                      Horas adicionales: USD 40/h
                    </span>
                  </div>
                  <p className="font-lato text-white/45 text-[15px] leading-relaxed">
                    Acompañamiento mensual una vez activo el sistema. Cubre ajustes, mejoras continuas y la revisión periódica para que la plataforma siga funcionando bien y evolucionando con el negocio.
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Ajustes al bot y flujos de automatización',
                      'Reentrenamiento del agente IA con información nueva o actualizada',
                      'Soporte en el uso de las herramientas para el equipo',
                      'Apoyo en configuraciones adicionales según las necesidades del negocio',
                      'Revisión mensual de métricas de conversación y ventas',
                      'Identificación de oportunidades de mejora en el proceso',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#60a5fa' }} />
                        <span className="font-lato text-white/55 text-[14px]">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="font-lato text-white/30 text-[13px] leading-relaxed">
                    Las horas no utilizadas en el mes no son acumulables. El servicio puede contratarse o cancelarse con 15 días de anticipación.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl px-5 py-4 border flex items-start gap-3"
            style={{ background: 'rgba(255,255,255,.02)', borderColor: 'rgba(255,255,255,.07)' }}>
            <Info className="w-4 h-4 text-white/30 flex-shrink-0 mt-0.5" />
            <p className="font-lato text-white/45 text-[14px] leading-relaxed">
              Los valores están expresados en dólares estadounidenses (USD) y no incluyen impuestos locales. La plataforma mensual de USD 240 incluye 3 usuarios. El servicio de Soporte y Operaciones es opcional y se activa por separado.
            </p>
          </div>
        </section>

        {/* ─ 06 TÉRMINOS ─ */}
        <section id="terminos" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 — Condiciones Comerciales</TagLabel>
          <SectionTitle>Términos y Condiciones</SectionTitle>
          <Rule />

          <div className="space-y-2.5 mb-8">
            {[
              { titulo: 'Vigencia de la propuesta',    texto: 'Esta propuesta tiene validez de 30 días calendario a partir de su fecha de emisión. Transcurrido ese plazo sin confirmación por escrito, Sixteam.pro se reserva el derecho de actualizar los valores y condiciones.', icon: Info },
              { titulo: 'Forma de pago',               texto: 'Cada fase se factura y cancela al inicio de la misma mediante transferencia bancaria o el método acordado, en dólares estadounidenses (USD). Los servicios mensuales se facturan al inicio de cada período.', icon: CheckCircle },
              { titulo: 'Alcance y entregables',       texto: 'El alcance de esta propuesta se limita a los entregables descritos en cada fase. Cualquier ajuste, adición o modificación fuera del alcance acordado será cotizado por separado y aprobado por escrito antes de su ejecución.', icon: AlertCircle },
              { titulo: 'Responsabilidades del cliente', texto: 'El cliente se compromete a: (a) designar un punto de contacto para la coordinación, (b) aprobar entregables en máximo 5 días hábiles desde su presentación, (c) suministrar información del negocio (FAQ, precios, convenios) al inicio de cada fase.', icon: User },
              { titulo: 'Confidencialidad',            texto: 'La información compartida entre las partes en el marco de esta propuesta y su ejecución se considera confidencial. Ambas partes se comprometen a no divulgar información sensible del negocio a terceros sin autorización escrita previa.', icon: Info },
              { titulo: 'Propiedad intelectual',       texto: 'Una vez canceladas todas las fases contratadas, los entregables — configuraciones del CRM, flujos de automatización y bot IA — son propiedad del cliente. Sixteam.pro retiene el derecho de referenciar el proyecto en su portafolio con autorización del cliente.', icon: CheckCircle },
              { titulo: 'Cancelación y suspensión',    texto: 'La cancelación de un servicio mensual debe notificarse con 15 días calendario de anticipación. Las fases de implementación canceladas después de iniciadas no son reembolsables; los avances realizados hasta la fecha de cancelación serán entregados al cliente.', icon: AlertCircle },
              { titulo: 'Modificaciones al alcance',   texto: 'Cualquier solicitud de cambio fuera del alcance acordado generará una cotización adicional aprobada por escrito antes de su ejecución. Sixteam.pro se reserva el derecho de ajustar los plazos si los cambios impactan la planificación del proyecto.', icon: Zap },
            ].map((term, i) => {
              const Icon = term.icon; const open = termActivo === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${NS_BLUE}30` : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setTermActivo(open ? null : i)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: open ? '#60a5fa' : 'rgba(255,255,255,.3)' }} />
                    <span className={`font-poppins font-semibold text-[15px] flex-1 ${open ? 'text-white/90' : 'text-white/55'}`}>
                      {term.titulo}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200"
                      style={{ color: `${NS_BLUE}50`, transform: open ? 'rotate(90deg)' : undefined }} />
                  </button>
                  {open && (
                    <div className="px-4 pb-4 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <p className="font-lato text-white/50 text-[15px] leading-relaxed pt-3">{term.texto}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ─ 07 VIGENCIA ─ */}
        <section id="vigencia" ref={s7.ref as React.RefObject<HTMLElement>}
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s7.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>07 — Vigencia y Cierre</TagLabel>
          <SectionTitle>¿Cuándo empezamos?</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-6 sm:p-8 mb-6 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${NS_BLUE}08, transparent)`, transform: 'translate(20%,-20%)' }} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
              {[
                { label: 'Vigencia de la propuesta', valor: '30 días calendario', sub: 'hasta el 27 de junio de 2026' },
                { label: 'Kick-off estimado',        valor: '≤ 3 días hábiles',  sub: 'desde el pago de la Fase 1' },
                { label: 'Implementación completa',  valor: '3–5 semanas',       sub: 'Fase 1 + Fase 2 consecutivas' },
              ].map(({ label, valor, sub }) => (
                <div key={label} className="rounded-xl p-4"
                  style={{ background: `${NS_BLUE}08`, border: `1px solid ${NS_BLUE}18` }}>
                  <p className="font-lato text-white/35 text-[13px] uppercase tracking-wider mb-1">{label}</p>
                  <p className="font-poppins font-black text-white text-[17px]">{valor}</p>
                  <p className="font-lato text-white/35 text-[13px] mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 font-lato text-white/55 text-[16px] leading-relaxed">
              <p>
                Esta propuesta tiene una vigencia de <strong className="text-white/80">30 días calendario</strong> a partir de su fecha de emisión. Para iniciar: confirmación de las Fases 1 y 2, firma del acuerdo de servicios y pago de la Fase 1.
              </p>
              <p>
                La implementación arranca en los <strong className="text-white/80">3 días hábiles siguientes al pago</strong>. Las Fases 1 y 2 se ejecutan de forma consecutiva en 3 a 5 semanas. La Fase 3 se planifica en conjunto una vez activo el sistema base.
              </p>
            </div>
          </div>

          {/* Próximos pasos */}
          <div className="space-y-2.5 mb-8">
            {[
              { titulo: 'Confirmar fases a contratar',     desc: 'Respuesta por escrito a esta propuesta indicando las fases que se contratan. Puede ser vía correo o WhatsApp.', icon: CheckCircle },
              { titulo: 'Firma del acuerdo de servicios',  desc: 'Sixteam.pro envía el contrato de servicios para revisión y firma digital. Proceso de 1-2 días hábiles.', icon: Info },
              { titulo: 'Pago de la Fase 1 — USD 800',     desc: 'Pago por transferencia bancaria o el método acordado. El recibo de pago activa el inicio del proyecto.', icon: Zap },
              { titulo: 'Kick-off en ≤ 3 días hábiles',   desc: 'El equipo de Sixteam agenda la sesión de arranque y comienza la configuración del entorno de Nutsport.', icon: AlertCircle },
            ].map((paso, i) => {
              const Icon = paso.icon; const open = pasoActivo === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${NS_BLUE}30` : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setPasoActivo(open ? null : i)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: open ? '#60a5fa' : 'rgba(255,255,255,.3)' }} />
                    <span className={`font-poppins font-semibold text-[15px] flex-1 ${open ? 'text-white/90' : 'text-white/55'}`}>
                      {paso.titulo}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200"
                      style={{ color: `${NS_BLUE}50`, transform: open ? 'rotate(90deg)' : undefined }} />
                  </button>
                  {open && (
                    <div className="px-4 pb-4 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <p className="font-lato text-white/50 text-[15px] leading-relaxed pt-3">{paso.desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA contacto */}
          <div className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
            style={{ background: `linear-gradient(135deg, ${NS_BLUE}10, ${NS_PINK}06)`, border: `1px solid ${NS_BLUE}25` }}>
            <div className="flex-1">
              <p className="font-poppins font-extrabold text-white text-[22px] mb-1">¿Listos para arrancar?</p>
              <p className="font-lato text-white/50 text-[16px] leading-relaxed">
                Responde a esta propuesta o contáctanos directamente para confirmar el inicio del proyecto.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <a href={`mailto:${META.correo}`}
                className="flex items-center gap-2.5 px-5 py-3 rounded-xl font-poppins font-bold text-[14px] text-white transition-all duration-200 no-print"
                style={{ background: `linear-gradient(135deg, ${NS_BLUE}, ${NS_PINK})` }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                <Mail className="w-4 h-4" />
                {META.correo}
              </a>
              <a href="https://wa.me/573004188522"
                className="flex items-center gap-2.5 px-5 py-3 rounded-xl font-poppins font-bold text-[14px] transition-all duration-200 no-print"
                style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.7)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.06)')}>
                <Phone className="w-4 h-4" />
                {META.elaboradaPor} · Sixteam.pro
              </a>
            </div>
          </div>

          {/* Firma */}
          <div className="mt-10 pt-8 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            style={{ borderColor: 'rgba(255,255,255,.06)' }}>
            <div>
              <p className="font-poppins font-black text-white text-[18px]">Sixteam<span style={{ color: NS_BLUE }}>.</span>pro</p>
              <p className="font-lato text-white/35 text-[13px]">Innovación y Estrategia Digital S.A.S.</p>
              <p className="font-lato text-white/25 text-[13px]">NIT {META.nit} · R.L. {META.rl}</p>
            </div>
            <div className="sm:text-center">
              <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider">Elaborado por</p>
              <p className="font-poppins font-bold text-white/70 text-[15px]">{META.elaboradaPor}</p>
              <p className="font-lato text-white/35 text-[13px]">{META.cargoElaborador} · Sixteam.pro</p>
            </div>
            <div className="sm:text-right">
              <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider">Preparado para</p>
              <p className="font-poppins font-bold text-white/60 text-[15px]">{META.dirigidoA}</p>
              <p className="font-lato text-white/35 text-[13px]">{META.cliente}</p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="text-center py-8 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
        <p className="font-lato text-white/20 text-[13px]">
          Sixteam.pro · NIT {META.nit} · {META.correo} · Documento confidencial
        </p>
      </footer>

    </div>
  );
};

export default NutsportProposal;
