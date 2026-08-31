import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap,
  AlertCircle, Info, Calendar, MapPin, Users, Shield, Coins,
  MessageSquare, LayoutDashboard, Bot, Megaphone, Headphones,
  TrendingDown, Globe, Layers, RefreshCw, GraduationCap,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Stunet Education Agency',
  tagline: 'Educación internacional · Programas digitales',
  fecha: 'Agosto 2026',
  lugar: 'Colombia · México · Latinoamérica',
  objetivo: 'El empalme natural del proyecto de implementación que está cerrando: una cuota mensual fija que asegura la disponibilidad del equipo y de la plataforma, con una bolsa de 60 créditos para que las herramientas ya montadas se usen bien y el equipo de Stunet siga radicando solicitudes.',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  destinatarios: 'Miguel Illidge · Ana Daniela Urrea',
  elaboradaPor: 'Ernesto Hernández',
  cargoElaborador: 'Gerente Comercial Sixteam',
};

const STUNET_GOLD = '#ffe628';

const PLAN_COP        = '960.000';
const PLAN_USD        = '300';
const CREDITO_COP     = '16.000';
const CREDITO_USD     = '5';
const TRM             = '3.202,79';
const TRM_FECHA       = '31 de agosto de 2026';
const CREDITOS_MES    = 60;
const SOLICITUDES_MES = 5;

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber:  { text: '#f59e0b',    bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)' },
  teal:   { text: '#00bfa5',    bg: 'rgba(0,191,165,.07)',   border: 'rgba(0,191,165,.18)'  },
  blue:   { text: '#38bdf8',    bg: 'rgba(56,189,248,.07)',  border: 'rgba(56,189,248,.18)' },
  red:    { text: '#f87171',    bg: 'rgba(221,51,51,.07)',   border: 'rgba(221,51,51,.2)'   },
  purple: { text: '#a78bfa',    bg: 'rgba(167,139,250,.07)', border: 'rgba(167,139,250,.18)'},
  gold:   { text: STUNET_GOLD,  bg: 'rgba(255,230,40,.06)',  border: 'rgba(255,230,40,.20)' },
};

// ─── SITUACIÓN ───────────────────────────────────────────────────────────────

const SITUACION = [
  {
    titulo: 'La industria cerró puertas en todos los destinos principales',
    desc: 'Canadá, Australia, Nueva Zelanda, Irlanda, Estados Unidos y Reino Unido endurecieron sus procesos de visa al mismo tiempo. A eso se suma el cierre de escuelas aliadas que no alcanzaron las nuevas certificaciones exigidas por sus gobiernos.',
    icon: Globe, tint: 'red',
  },
  {
    titulo: 'El costo de adquisición dejó de tener retorno',
    desc: 'Un estudiante de educación internacional tarda entre tres y seis meses en cerrar, y hoy ni las campañas ni los descuentos ni los beneficios adicionales mueven la aguja. Invertir en pauta en Colombia al ritmo anterior ya no devuelve el dinero puesto.',
    icon: TrendingDown, tint: 'amber',
  },
  {
    titulo: 'Un contrato dimensionado para otro volumen',
    desc: 'Sin el volumen de leads y de casos entrantes que había cuando se firmó, el esquema actual quedó grande frente a la operación de hoy. Ese es el punto que Stunet planteó en la reunión, y esta propuesta lo atiende bajando de forma importante la base mensual.',
    icon: AlertCircle, tint: 'blue',
  },
  {
    titulo: 'El foco se movió a los programas digitales',
    desc: 'Cerca del 85% del esfuerzo pasa a Mi Primer Millón y a la línea de inteligencia emocional para niños y adolescentes: cursos en línea, sin visa, con ticket de entrada bajo y ciclo de compra corto. La educación internacional queda entre el 10% y el 15%, con el compromiso de campaña para México.',
    icon: GraduationCap, tint: 'gold',
  },
];

// ─── LO QUE CAMBIA ───────────────────────────────────────────────────────────

const CAMBIOS = [
  {
    icon: RefreshCw, color: STUNET_GOLD, colorAlpha: 'rgba(255,230,40,.07)', colorBorder: 'rgba(255,230,40,.22)',
    titulo: 'Una base mucho más liviana que el contrato actual',
    desc: 'El esquema vigente se cotizó para una operación con volumen. El nuevo parte de una cuota mensual fija bastante menor, dimensionada para la operación real de hoy. Es un costo estable y previsible que Stunet puede sostener mientras la línea digital toma vuelo.',
  },
  {
    icon: Coins, color: '#00bfa5', colorAlpha: 'rgba(0,191,165,.08)', colorBorder: 'rgba(0,191,165,.22)',
    titulo: 'Créditos en lugar de horas',
    desc: 'Ya no se compra tiempo del equipo, se compra resultado entregado. Cada solicitud se cotiza en créditos antes de ejecutarse, con su tiempo de entrega, y Stunet aprueba antes de que se toque nada.',
  },
  {
    icon: LayoutDashboard, color: '#38bdf8', colorAlpha: 'rgba(56,189,248,.08)', colorBorder: 'rgba(56,189,248,.22)',
    titulo: 'El uso de la plataforma entra en el plan',
    desc: 'CRM, ChatCenter y chatbot, las herramientas que deja el proyecto de implementación, siguen operando dentro de este plan sin una licencia aparte. Se conservan disponibles y listas para cuando la operación las pida.',
  },
  {
    icon: Zap, color: '#a78bfa', colorAlpha: 'rgba(167,139,250,.08)', colorBorder: 'rgba(167,139,250,.22)',
    titulo: 'La misma velocidad que ya conocen',
    desc: 'La landing que Miguel pidió estuvo lista prácticamente de un día para otro. Esa velocidad viene del sistema de agentes de inteligencia artificial que Sixteam opera por dentro, y es justamente lo que hace sostenible este modelo de créditos.',
  },
  {
    icon: Users, color: '#f59e0b', colorAlpha: 'rgba(245,158,11,.08)', colorBorder: 'rgba(245,158,11,.22)',
    titulo: 'El equipo de tecnología sigue siendo suyo',
    desc: 'Reuniones uno a uno, canal directo y el mismo trato de siempre. Los dos perfiles que entran del lado de Stunet, estrategia de marketing y Google Ads con LinkedIn, encuentran una contraparte técnica lista para ejecutar lo que definan.',
  },
  {
    icon: Shield, color: '#34d399', colorAlpha: 'rgba(52,211,153,.08)', colorBorder: 'rgba(52,211,153,.22)',
    titulo: 'Lo implementado no queda huérfano',
    desc: 'Una herramienta entregada y sin acompañamiento se deja de usar en pocos meses, y recuperarla después cuesta más que haberla sostenido. Este plan es el puente que mantiene vivo lo que el proyecto de implementación acaba de dejar montado.',
  },
];

// ─── CÓMO FUNCIONA ───────────────────────────────────────────────────────────

const FLUJO = [
  { step: '01', text: 'Stunet envía la solicitud por el canal de siempre: WhatsApp, correo o la reunión uno a uno.' },
  { step: '02', text: 'Sixteam analiza y responde con la cotización: cuántos créditos consume y en cuánto tiempo queda lista.' },
  { step: '03', text: 'Stunet aprueba y el equipo ejecuta. Los créditos se descuentan del saldo del mes, visible en todo momento.' },
  { step: '04', text: 'Al cierre del período se entrega el reporte con el desglose de créditos por solicitud y el saldo restante.' },
];

// ─── CATÁLOGO ────────────────────────────────────────────────────────────────

const CATALOGO = [
  {
    categoria: 'Marketing y pauta digital',
    icon: Megaphone,
    color: '#38bdf8',
    items: [
      'Montaje, ajuste y optimización de campañas en Meta Ads y Google Ads',
      'Estructura de campaña para el lanzamiento de los cursos digitales y para la campaña de México',
      'Audiencias, segmentaciones, públicos similares y exclusiones sobre la base existente',
      'Landing pages y formularios conectados al CRM, con el diseño de referencia que entregue el equipo',
      'Píxel, Conversions API y seguimiento de conversiones validado sin duplicados',
    ],
  },
  {
    categoria: 'CRM, ventas y automatizaciones',
    icon: LayoutDashboard,
    color: '#00bfa5',
    items: [
      'Pipelines y etapas comerciales diferenciadas por línea: cursos digitales y educación internacional',
      'Flujos automatizados de nutrición, recuperación de interesados y venta del paso de estándar a premium',
      'Campos personalizados, etiquetado y segmentación de la base de contactos acumulada',
      'Recordatorios y tareas automáticas para el equipo comercial',
      'Informes de conversión, origen de lead y actividad comercial',
    ],
  },
  {
    categoria: 'Servicio y canales de atención',
    icon: Headphones,
    color: '#a78bfa',
    items: [
      'Operación del ChatCenter con WhatsApp, Instagram y Facebook en una sola bandeja',
      'Ajustes al chatbot de atención inicial y a sus rutas de conversación',
      'Plantillas de respuesta, encuestas de satisfacción y solicitudes de reseña',
      'Resolución de incidencias sobre la plataforma y sobre las integraciones activas',
    ],
  },
  {
    categoria: 'Inteligencia artificial aplicada',
    icon: Bot,
    color: STUNET_GOLD,
    items: [
      'Asistentes conversacionales entrenados con la información de cada programa',
      'Calificación automática del lead antes de que llegue al asesor',
      'Clasificación de conversaciones entrantes y enrutamiento al responsable correcto',
      'Análisis de la base de datos para detectar interesados reactivables sin volver a pagar pauta',
    ],
  },
];

// ─── ARRANQUE SUGERIDO ───────────────────────────────────────────────────────

const ARRANQUE = [
  {
    num: '01',
    titulo: 'Reactivar la base que ya se pagó',
    color: STUNET_GOLD, colorAlpha: 'rgba(255,230,40,.08)', colorBorder: 'rgba(255,230,40,.24)',
    desc: 'Antes de invertir un peso nuevo en pauta, se trabaja sobre los contactos que Stunet ya acumuló en años de operación. Son padres y familias que ya mostraron interés en educación y a los que hoy se les puede ofrecer un curso en línea de ticket bajo, sin visa y sin espera.',
    creditos: '≈ 12 a 18 créditos',
  },
  {
    num: '02',
    titulo: 'Preparar el embudo de los cursos digitales',
    color: '#00bfa5', colorAlpha: 'rgba(0,191,165,.08)', colorBorder: 'rgba(0,191,165,.24)',
    desc: 'Pipeline propio para la línea digital, con su landing, su formulario y su flujo de nutrición. El objetivo es que el ciclo corto de compra de un curso estándar no se procese con la misma maquinaria pensada para una matrícula internacional de seis meses.',
    creditos: '≈ 14 a 20 créditos',
  },
  {
    num: '03',
    titulo: 'Montar la campaña de México',
    color: '#38bdf8', colorAlpha: 'rgba(56,189,248,.08)', colorBorder: 'rgba(56,189,248,.24)',
    desc: 'Es el compromiso vigente en educación internacional. Se monta con estructura propia y seguimiento separado, para que su rendimiento se pueda medir aparte y no se mezcle con el de la línea digital.',
    creditos: '≈ 12 a 16 créditos',
  },
  {
    num: '04',
    titulo: 'Empatar con el equipo que entra',
    color: '#a78bfa', colorAlpha: 'rgba(167,139,250,.08)', colorBorder: 'rgba(167,139,250,.24)',
    desc: 'Sesión de trabajo con la estratega de marketing y el especialista en Google Ads y LinkedIn para acordar accesos, convenciones de campaña y reportería. Así lo que ellos definan entra directo a ejecución sin traducciones intermedias.',
    creditos: '≈ 6 a 10 créditos',
  },
];

// ─── FUERA DE ALCANCE ────────────────────────────────────────────────────────

const FUERA = [
  {
    titulo: 'La inversión publicitaria',
    desc: 'El presupuesto que se entrega a Meta o a Google lo paga Stunet directamente a la plataforma. Los créditos cubren el trabajo de montar, operar y optimizar la campaña, no el dinero pautado.',
    icon: Megaphone, tint: 'amber',
  },
  {
    titulo: 'Módulos y plataformas que hoy no existen',
    desc: 'Implementar una funcionalidad nueva que aún no está montada se cotiza aparte como proyecto. Una vez implementada, su operación y sus ajustes posteriores sí quedan cubiertos por los créditos.',
    icon: Layers, tint: 'blue',
  },
  {
    titulo: 'Producción de contenido creativo',
    desc: 'Grabación de video, fotografía y redacción de los contenidos de cada curso quedan del lado de Stunet. Sixteam trabaja sobre el material que el equipo entregue.',
    icon: FileText, tint: 'purple',
  },
  {
    titulo: 'Consumos de terceros',
    desc: 'Tarifas por conversación de WhatsApp Business, consumo de los modelos de inteligencia artificial y licencias de herramientas externas se facturan según su uso real y no salen de los créditos.',
    icon: Coins, tint: 'red',
  },
];

// ─── TÉRMINOS ────────────────────────────────────────────────────────────────

const TERMINOS: { titulo: string; desc: string; icon: React.ElementType }[] = [
  {
    titulo: 'Cómo aceptar esta propuesta',
    desc: 'Stunet confirma su aceptación por WhatsApp, correo electrónico o de forma verbal en la reunión de seguimiento. Con esa confirmación se formaliza el nuevo esquema y arranca el primer período mensual.',
    icon: CheckCircle,
  },
  {
    titulo: 'Cuota mensual fija por disponibilidad',
    desc: 'El valor mensual es fijo y se causa completo en cada período, se radiquen solicitudes o no. No es un anticipo contra consumo: retribuye la disponibilidad del equipo de Sixteam, el uso de la plataforma y el acompañamiento continuo. Un mes sin solicitudes no genera descuento, saldo a favor ni suspensión del cobro.',
    icon: Shield,
  },
  {
    titulo: 'Créditos incluidos y su vigencia',
    desc: `La cuota incluye ${CREDITOS_MES} créditos por período mensual, equivalentes en promedio a cerca de ${SOLICITUDES_MES} solicitudes estándar. Los créditos tienen vigencia únicamente dentro del período en que se otorgan: se reinician al inicio de cada mes y los no utilizados no son acumulables, transferibles ni canjeables. Terminado el período, el saldo restante se pierde.`,
    icon: Coins,
  },
  {
    titulo: 'Consumo adicional a la bolsa incluida',
    desc: `Agotados los ${CREDITOS_MES} créditos del período, toda solicitud posterior genera un consumo adicional que se factura aparte, al mismo valor unitario definido en la sección de inversión y sin recargo por excederse. Cada excedente se cotiza y requiere aprobación de Stunet antes de ejecutarse; si Stunet prefiere, la solicitud se programa para el período siguiente y consume la bolsa de ese mes.`,
    icon: Layers,
  },
  {
    titulo: 'Cotización previa de cada solicitud',
    desc: 'Ninguna solicitud se ejecuta sin aprobación. Sixteam informa antes cuántos créditos consume y en cuánto tiempo estará lista, de modo que Stunet mantiene el control del consumo durante todo el período.',
    icon: MessageSquare,
  },
  {
    titulo: 'Relación con el proyecto de implementación',
    desc: 'El proyecto de implementación es un servicio independiente, ya contratado y en fase de cierre, que se rige por sus propias condiciones y facturación. Esta propuesta cotiza el empalme posterior y la operación continua, de modo que las herramientas entregadas se adopten y se sigan aprovechando. Ninguno de los dos documentos modifica al otro.',
    icon: Layers,
  },
  {
    titulo: 'Pago y período',
    desc: 'Pago anticipado al inicio de cada período mensual, por el valor definido en la sección de propuesta de inversión. La facturación se realiza en pesos colombianos. El consumo adicional del período, si lo hubo, se factura al cierre junto con el reporte de créditos.',
    icon: FileText,
  },
  {
    titulo: 'Plataforma tecnológica incluida',
    desc: 'Mientras el plan esté activo, el uso del CRM, el ChatCenter y el chatbot queda incluido sin una licencia aparte. Es un beneficio ligado a la contratación del servicio y se conserva mientras el plan permanezca vigente.',
    icon: LayoutDashboard,
  },
  {
    titulo: 'Continuidad y crecimiento del plan',
    desc: 'El plan se renueva mes a mes y no exige permanencia mínima. Si la operación de Stunet vuelve a tomar volumen, la bolsa mensual puede ampliarse a un tramo mayor de créditos, ajustando la cuota de común acuerdo. La cuota vigente se mantiene mientras el plan siga activo.',
    icon: RefreshCw,
  },
  {
    titulo: 'Propiedad y confidencialidad',
    desc: 'Stunet es propietario de sus datos, de su base de contactos y de los activos digitales construidos. Sixteam mantiene la confidencialidad total de esa información durante la vigencia del servicio y después de su terminación.',
    icon: Shield,
  },
  {
    titulo: 'Vigencia de la propuesta',
    desc: '30 días calendario desde su fecha de emisión. Pasado ese plazo, los valores podrán ser revisados según las condiciones del mercado.',
    icon: Clock,
  },
];

// ─── SECCIONES NAV ───────────────────────────────────────────────────────────

const SECCIONES = [
  { id: 'resumen',   label: 'Resumen'     },
  { id: 'servicio',  label: 'El servicio' },
  { id: 'catalogo',  label: 'Qué cubre'   },
  { id: 'arranque',  label: 'Arranque'    },
  { id: 'inversion', label: 'Inversión'   },
  { id: 'vigencia',  label: 'Vigencia'    },
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
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: `linear-gradient(90deg,${STUNET_GOLD},#00bfa5)` }} />
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const StunetOpsProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
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
            style={{ background: 'radial-gradient(circle, rgba(255,230,40,.05) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,191,165,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.022]"
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
            <div className="flex items-center justify-center flex-shrink-0 h-9">
              <img src="/stunet-logo.png" alt="Stunet Education Agency" className="h-full w-auto object-contain"
                style={{ filter: 'drop-shadow(0 1px 4px rgba(255,230,40,.3))' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
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
              <TagLabel>Propuesta de empalme · Sixteam Ops</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #dd3333, #0170B9)' }}>
                  <GraduationCap className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">Stunet Education Agency</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(255,230,40,.10)', border: '1px solid rgba(255,230,40,.24)', color: STUNET_GOLD }}>
                  Growing Together
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 4.8rem)' }}>
                Sixteam<br />
                <span style={{ background: `linear-gradient(90deg,${STUNET_GOLD},#00bfa5)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Ops
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
                  { icon: Coins,    text: `${CREDITOS_MES} créditos mensuales` },
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
                  {['1. Dónde estamos hoy','2. Cómo funciona Sixteam Ops','3. Qué cubre el servicio','4. Por dónde arrancar','5. Propuesta de inversión','6. Vigencia y términos'].map((item, i) => (
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
                  style={{ background: 'radial-gradient(circle, rgba(255,230,40,.07) 0%, rgba(0,191,165,.04) 50%, transparent 70%)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full" style={{ border: '1px solid rgba(255,230,40,.12)' }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(0,191,165,.15)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: STUNET_GOLD, boxShadow: '0 0 6px rgba(255,230,40,.8)' }} />
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
                    style={{ background: 'linear-gradient(135deg, rgba(255,230,40,.14), rgba(255,230,40,.04))', border: '1px solid rgba(255,230,40,.26)', boxShadow: '0 4px 30px rgba(255,230,40,.14)' }}>
                    <img src="/stunet-logo.png" alt="Stunet" className="h-14 w-auto object-contain"
                      style={{ filter: 'drop-shadow(0 2px 12px rgba(255,230,40,.4))' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <div className="text-center">
                    <p className="font-poppins font-bold text-white/80 text-[17px] tracking-tight">Stunet Education Agency</p>
                    <p className="font-lato text-[13px] uppercase tracking-[0.2em] mt-1" style={{ color: STUNET_GOLD }}>Mi Primer Millón · Educación internacional</p>
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
          <TagLabel>01 · Dónde estamos hoy</TagLabel>
          <SectionTitle>El contexto cambió, el acompañamiento también</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center"
            style={{ background: 'rgba(2,8,20,.85)', border: '1px solid rgba(255,230,40,.18)' }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="rounded-xl p-4 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(255,230,40,.14), rgba(255,230,40,.04))', border: '1px solid rgba(255,230,40,.26)' }}>
                <img src="/stunet-logo.png" alt="Stunet" className="h-10 w-auto object-contain"
                  style={{ filter: 'drop-shadow(0 1px 6px rgba(255,230,40,.35))' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <span className="font-lato text-[11px] uppercase tracking-[0.2em]" style={{ color: STUNET_GOLD }}>Stunet</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Foco principal</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">Programas digitales · cerca del 85%</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Foco secundario</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">Educación internacional · 10% a 15%</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Proyecto de implementación</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#00bfa5' }} />
                  <p className="font-poppins font-semibold text-[15px] text-[#00bfa5]">En cierre · herramientas entregadas</p>
                </div>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Lo que sigue</p>
                <p className="font-lato text-white/60 text-[18px]">Adopción, uso y operación continua</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              En la reunión del 28 de agosto Stunet compartió con total transparencia lo que está atravesando la industria de educación internacional y el giro que decidió dar su operación. Esta propuesta responde a eso y solo a eso: <strong className="text-white/90 font-semibold">redimensionar el acompañamiento a la realidad actual del negocio</strong>, bajando de forma importante el costo mensual sin frenar lo que ya está construido.
            </p>
            <p>
              Es importante precisar el lugar que ocupa este documento. <strong className="text-white/90 font-semibold">El proyecto de implementación es un servicio aparte, ya contratado y hoy en su fase de cierre.</strong> Esta cotización no lo repite ni lo reemplaza: es el <strong className="text-white/90 font-semibold">empalme hacia ese proyecto</strong>, la etapa que arranca cuando la implementación termina y las herramientas quedan entregadas. Su propósito es que esas herramientas se usen bien y que el equipo de Stunet pueda seguir radicando solicitudes sin quedarse sin contraparte técnica.
            </p>
            <p>
              El planteamiento de fondo es sencillo. La fase pesada, la de construir, ya pasó y está en pie. Lo que queda de aquí en adelante es uso y operación. Por eso deja de tener sentido un valor dimensionado para otro escenario y empieza a tenerlo una <strong className="text-white/90 font-semibold">cuota mensual fija mucho más liviana</strong>, que asegura la disponibilidad del equipo y de la plataforma y trae incluida una bolsa de {CREDITOS_MES} créditos. Lo que cambia frente al contrato actual no es la naturaleza del compromiso, que sigue siendo mensual, sino su tamaño.
            </p>
          </div>

          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> Lo que Stunet planteó en la reunión
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SITUACION.map((h, i) => {
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

        {/* ─ 02 EL SERVICIO ─ */}
        <section id="servicio" ref={s2.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>02 · Cómo funciona Sixteam Ops</TagLabel>
          <SectionTitle>Créditos en lugar de horas</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden mb-8"
            style={{ background: 'rgba(255,230,40,.05)', border: '1px solid rgba(255,230,40,.20)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(255,230,40,.06), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 mb-4" style={{ color: STUNET_GOLD }} />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[23px] leading-relaxed">
              Sixteam Ops es la evolución del soporte de operaciones. Stunet paga una <strong className="text-white font-black">cuota mensual fija</strong> que asegura la disponibilidad del equipo y de la plataforma, y que trae incluida una bolsa de {CREDITOS_MES} créditos para consumir en solicitudes. La cuota se paga completa cada mes, se usen o no los créditos, porque lo que sostiene es la capacidad de respuesta. <strong className="text-white font-black">Si la operación pide más de lo que cubre la bolsa, ese consumo adicional se factura aparte.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {CAMBIOS.map((item, i) => {
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

          {/* Cómo se compone el cobro */}
          <div className="rounded-2xl p-5 sm:p-6 mb-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Coins className="w-4 h-4 text-[#00bfa5]" /> Cómo se compone el cobro
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  n: '1', t: 'Cuota mensual fija', c: STUNET_GOLD,
                  bg: 'rgba(255,230,40,.07)', bd: 'rgba(255,230,40,.22)',
                  d: 'Se paga completa todos los meses, se radiquen solicitudes o no. Es lo que asegura que el equipo y la plataforma estén disponibles cuando Stunet los necesite.',
                },
                {
                  n: '2', t: `Bolsa de ${CREDITOS_MES} créditos`, c: '#00bfa5',
                  bg: 'rgba(0,191,165,.07)', bd: 'rgba(0,191,165,.22)',
                  d: `Vienen incluidos en la cuota y alcanzan en promedio para cerca de ${SOLICITUDES_MES} solicitudes estándar al mes. Se reinician cada período y no se acumulan.`,
                },
                {
                  n: '3', t: 'Consumo adicional', c: '#38bdf8',
                  bg: 'rgba(56,189,248,.07)', bd: 'rgba(56,189,248,.22)',
                  d: 'Si la operación pide más de lo que cubre la bolsa, los créditos extra se cotizan, se aprueban y se facturan aparte al mismo valor unitario del plan.',
                },
              ].map((b, i) => (
                <div key={i} className="rounded-xl p-4" style={{ background: b.bg, border: `1px solid ${b.bd}` }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center mb-2"
                    style={{ background: 'rgba(255,255,255,.06)', border: `1px solid ${b.bd}` }}>
                    <span className="font-poppins font-black text-[12px]" style={{ color: b.c }}>{b.n}</span>
                  </div>
                  <p className="font-poppins font-bold text-white/85 text-[15px] leading-tight mb-1.5">{b.t}</p>
                  <p className="font-lato text-white/50 text-[14px] leading-snug">{b.d}</p>
                </div>
              ))}
            </div>
            <p className="font-lato text-white/35 text-[13px] mt-4 leading-relaxed">
              La cuota no es un anticipo contra consumo ni un saldo a favor: retribuye la disponibilidad del equipo, el uso de la plataforma y el acompañamiento continuo, con los {CREDITOS_MES} créditos incluidos como parte del paquete.
            </p>
          </div>

          {/* Flujo de una solicitud */}
          <div className="rounded-2xl p-5 sm:p-6 mb-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#00bfa5]" /> El recorrido de una solicitud
            </p>
            <div className="space-y-2.5">
              {FLUJO.map((f, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl p-3.5"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(0,191,165,.10)', border: '1px solid rgba(0,191,165,.25)' }}>
                    <span className="font-poppins font-black text-[11px] text-[#00bfa5]">{f.step}</span>
                  </div>
                  <p className="font-lato text-white/60 text-[16px] leading-relaxed flex-1">{f.text}</p>
                </div>
              ))}
            </div>
            <p className="font-lato text-white/35 text-[13px] mt-4 leading-relaxed">
              Nunca hay sorpresas al cierre del mes, ya que ninguna solicitud se ejecuta sin que Stunet apruebe primero su costo en créditos y su tiempo de entrega.
            </p>
          </div>

          {/* Ejemplo de cotización */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8" style={{ background: 'rgba(0,191,165,.04)', border: '1px solid rgba(0,191,165,.18)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00bfa5]" /> Así se ve en la práctica
            </p>
            <div className="space-y-3">
              <div className="rounded-xl p-4 sm:mr-16" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                <p className="font-lato text-white/30 text-[12px] uppercase tracking-wider mb-1.5">Stunet</p>
                <p className="font-lato text-white/70 text-[16px] leading-relaxed italic">
                  "Necesitamos una landing para el curso de inteligencia emocional, con formulario conectado al CRM y un flujo de correos para los que se inscriban."
                </p>
              </div>
              <div className="rounded-xl p-4 sm:ml-16" style={{ background: 'rgba(0,191,165,.07)', border: '1px solid rgba(0,191,165,.22)' }}>
                <p className="font-lato text-[#00bfa5] text-[12px] uppercase tracking-wider mb-1.5">Sixteam</p>
                <p className="font-lato text-white/70 text-[16px] leading-relaxed italic">
                  "Recibido. Incluye la landing con el diseño de referencia, el formulario conectado al pipeline y el flujo de tres correos de bienvenida. Son <strong className="text-white/85 not-italic">14 créditos</strong> y queda lista en 3 días hábiles. Les quedarían 46 créditos disponibles este mes. ¿Aprobamos?"
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Créditos incluidos',   value: `${CREDITOS_MES}`,      sub: 'Por período mensual' },
              { label: 'Solicitudes estándar', value: `≈ ${SOLICITUDES_MES}`, sub: 'Promedio al mes' },
              { label: 'Cotización previa',    value: 'Siempre',              sub: 'Nada se ejecuta sin aprobar' },
              { label: 'Permanencia mínima',   value: 'Ninguna',              sub: 'El plan se renueva mes a mes' },
            ].map((k, i) => (
              <div key={i} className="rounded-xl p-4 text-center"
                style={{ background: i < 2 ? 'rgba(255,230,40,.06)' : 'rgba(0,191,165,.06)', border: i < 2 ? '1px solid rgba(255,230,40,.20)' : '1px solid rgba(0,191,165,.18)' }}>
                <p className="font-poppins font-black text-white text-[20px] leading-tight mb-1">{k.value}</p>
                <p className="font-poppins font-semibold text-white/70 text-[13px] mb-0.5">{k.label}</p>
                <p className="font-lato text-white/35 text-[12px]">{k.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─ 03 CATÁLOGO ─ */}
        <section id="catalogo" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 · Qué cubre el servicio</TagLabel>
          <SectionTitle>Todo lo que se puede solicitar con créditos</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Esta es la referencia de lo que Stunet puede pedir con cargo a los créditos del plan. No es una lista cerrada: si el equipo necesita algo que no aparece aquí, se plantea la solicitud y Sixteam evalúa cómo resolverla y cuántos créditos consume.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {CATALOGO.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div key={i} className="rounded-2xl p-5"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(255,255,255,.05)' }}>
                      <Icon className="w-4 h-4" style={{ color: cat.color }} />
                    </div>
                    <p className="font-poppins font-bold text-white/85 text-[17px]">{cat.categoria}</p>
                  </div>
                  <ul className="space-y-2">
                    {cat.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: cat.color }} />
                        <span className="font-lato text-white/60 text-[15px] leading-snug flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Plataforma incluida */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8"
            style={{ background: 'linear-gradient(135deg, rgba(255,230,40,.07) 0%, rgba(3,13,26,.9) 100%)', border: '1px solid rgba(255,230,40,.24)' }}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <LayoutDashboard className="w-5 h-5" style={{ color: STUNET_GOLD }} />
              <p className="font-poppins font-bold text-white/85 text-[19px]">La plataforma entra incluida en el plan</p>
              <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider ml-auto"
                style={{ background: 'rgba(255,230,40,.14)', border: '1px solid rgba(255,230,40,.3)', color: STUNET_GOLD }}>
                Sin licencia aparte
              </span>
            </div>
            <p className="font-lato text-white/55 text-[16px] leading-relaxed mb-4">
              Mientras el plan esté activo, Stunet conserva el uso de la plataforma tecnológica sin una licencia separada. Es justamente la infraestructura que deja el proyecto de implementación, y se mantiene disponible aunque un mes la operación esté tranquila.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { t: 'CRM',        d: 'Base de contactos, pipelines y automatizaciones', c: '#00bfa5' },
                { t: 'ChatCenter', d: 'WhatsApp, Instagram y Facebook en una bandeja',   c: '#38bdf8' },
                { t: 'Chatbot',    d: 'Atención inicial automatizada del prospecto',     c: '#a78bfa' },
              ].map((p, i) => (
                <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                  <p className="font-poppins font-bold text-[16px] mb-1" style={{ color: p.c }}>{p.t}</p>
                  <p className="font-lato text-white/45 text-[14px] leading-snug">{p.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fuera de alcance */}
          <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#f59e0b]" /> Qué no cubren los créditos
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        </section>

        {/* ─ 04 ARRANQUE ─ */}
        <section id="arranque" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 · Por dónde arrancar</TagLabel>
          <SectionTitle>Cuatro movimientos para los primeros meses</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            El servicio no tiene cronograma cerrado, ya que Stunet decide mes a mes en qué invertir los créditos. Este es el orden que Sixteam recomienda para atacar primero lo que más rinde en el escenario actual: vender sin volver a pagar el mismo costo de adquisición. Los rangos de créditos son estimaciones de referencia, y cada solicitud se cotiza en firme antes de ejecutarse.
          </p>

          <div className="space-y-3">
            {ARRANQUE.map((a, i) => (
              <div key={i} className="rounded-2xl p-5 sm:p-6"
                style={{ background: a.colorAlpha, border: `1px solid ${a.colorBorder}` }}>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2"
                    style={{ background: '#030d1a', borderColor: a.color }}>
                    <span className="font-poppins font-black text-[13px]" style={{ color: a.color }}>{a.num}</span>
                  </div>
                  <p className="font-poppins font-bold text-white text-[20px] leading-tight flex-1 min-w-0">{a.titulo}</p>
                  <span className="font-lato text-[12px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5"
                    style={{ background: 'rgba(255,255,255,.05)', border: `1px solid ${a.colorBorder}`, color: a.color }}>
                    <Coins className="w-3 h-3" /> {a.creditos}
                  </span>
                </div>
                <p className="font-lato text-white/55 text-[17px] leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl p-4 flex gap-3"
            style={{ background: 'rgba(56,189,248,.05)', border: '1px solid rgba(56,189,248,.20)' }}>
            <Users className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#38bdf8]" />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              El orden puede cambiar por completo según lo que definan la estratega de marketing y el especialista en Google Ads que se incorporan al equipo de Stunet. La reunión uno a uno se mantiene como el espacio para decidir juntos en qué se invierten los créditos de cada mes.
            </p>
          </div>
        </section>

        {/* ─ 05 INVERSIÓN ─ */}
        <section id="inversion" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 · Propuesta de inversión</TagLabel>
          <SectionTitle>Un solo valor mensual</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Esta cotización cubre únicamente el empalme y la operación posterior. <strong className="text-white/75">El proyecto de implementación es un servicio distinto</strong>, ya contratado y facturado bajo sus propias condiciones, y no se cobra de nuevo aquí. Los valores se expresan en <strong className="text-white/75">pesos colombianos (COP)</strong>, con su referencia en dólares.
          </p>

          <div className="rounded-2xl overflow-hidden mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(255,230,40,.09) 0%, rgba(3,13,26,.95) 100%)', border: '1px solid rgba(255,230,40,.32)', boxShadow: '0 4px 32px rgba(255,230,40,.12)' }}>
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,230,40,.16)' }}>
                  <Coins className="w-4 h-4" style={{ color: STUNET_GOLD }} />
                </div>
                <span className="font-poppins font-bold text-white/70 text-[15px]">Sixteam Ops · Plan Stunet</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider ml-auto"
                  style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.28)', color: '#00bfa5' }}>
                  Cuota fija mensual
                </span>
              </div>

              <div className="flex flex-wrap items-baseline gap-3 mb-2">
                <p className="font-poppins font-black text-white leading-none" style={{ fontSize: 'clamp(2.3rem, 7vw, 3.2rem)' }}>
                  ${PLAN_COP}
                </p>
                <p className="font-poppins font-bold text-white/45 text-[20px]">COP / mes</p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4"
                style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                <span className="font-lato text-white/40 text-[14px]">Equivalente a</span>
                <span className="font-poppins font-bold text-white/70 text-[16px]">≈ USD {PLAN_USD}</span>
                <span className="font-lato text-white/25 text-[13px]">· TRM ${TRM} del {TRM_FECHA}</span>
              </div>
              <p className="font-lato text-white/35 text-[15px] mb-6">
                {CREDITOS_MES} créditos mensuales · ≈ {SOLICITUDES_MES} solicitudes estándar · ${CREDITO_COP} COP por crédito, cerca de USD {CREDITO_USD}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-6">
                {[
                  `Disponibilidad garantizada del equipo de Sixteam durante todo el período, con solicitudes o sin ellas`,
                  `${CREDITOS_MES} créditos mensuales para solicitudes de marketing, CRM, servicio e inteligencia artificial`,
                  'Uso de la plataforma incluido: CRM, ChatCenter y chatbot, sin licencia aparte',
                  'Reunión uno a uno de seguimiento y priorización con el equipo de Sixteam',
                  'Cotización en créditos y tiempo de entrega antes de ejecutar cada solicitud',
                  'Canal directo por WhatsApp y correo para radicar solicitudes',
                  'Reporte mensual con el desglose de créditos consumidos por solicitud',
                  'Soporte y resolución de incidencias sobre la plataforma y sus integraciones',
                  'Acompañamiento del equipo técnico a los dos perfiles que se incorporan a Stunet',
                ].map((p, j) => (
                  <div key={j} className="flex items-start gap-2.5">
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: STUNET_GOLD }} />
                    <span className="font-lato text-white/60 text-[15px] leading-snug">{p}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t" style={{ borderColor: 'rgba(255,255,255,.08)' }}>
                {[
                  { label: 'Créditos mensuales',     value: `${CREDITOS_MES}` },
                  { label: 'Permanencia mínima',     value: 'Ninguna' },
                  { label: 'Plataforma tecnológica', value: 'Incluida' },
                  { label: 'Cotización previa',      value: 'Siempre' },
                ].map((m, i) => (
                  <div key={i} className="text-center rounded-xl p-3" style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.07)' }}>
                    <p className="font-poppins font-black text-[#00bfa5] text-[17px] leading-tight mb-1">{m.value}</p>
                    <p className="font-lato text-white/40 text-[12px] leading-snug">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Créditos adicionales */}
          <div className="rounded-xl p-5 mb-6" style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.20)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-[#00bfa5]" />
              <p className="font-poppins font-semibold text-white/80 text-[18px]">Si un mes se agotan los {CREDITOS_MES} créditos</p>
            </div>
            <p className="font-lato text-white/55 text-[16px] leading-relaxed mb-4">
              Agotada la bolsa del período, las solicitudes que sigan generan un <strong className="text-white/80">consumo adicional que se factura aparte</strong>, al mismo valor de crédito de este plan, <strong className="text-white/80">${CREDITO_COP} COP por crédito</strong>, y sin recargo por excederse. No hay una tarifa distinta ni un tramo más caro: un crédito cuesta lo mismo sea el número diez o el número ochenta del mes. Cada excedente se cotiza y se aprueba antes de ejecutarse, o se programa para el período siguiente si Stunet prefiere. La cuota fija mensual no cambia por ello.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { t: `${CREDITOS_MES} créditos`, d: 'Incluidos en el valor mensual', c: '#00bfa5' },
                { t: `$${CREDITO_COP} COP`,      d: 'Cada crédito adicional',        c: STUNET_GOLD },
                { t: 'Sin recargo',              d: 'Mismo valor dentro y fuera del plan', c: '#38bdf8' },
              ].map((p, i) => (
                <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                  <p className="font-poppins font-bold text-[17px] mb-1" style={{ color: p.c }}>{p.t}</p>
                  <p className="font-lato text-white/45 text-[14px] leading-snug">{p.d}</p>
                </div>
              ))}
            </div>
            <p className="font-lato text-white/35 text-[13px] mt-4 leading-relaxed">
              Es exactamente el punto que Miguel planteó en la reunión: un mínimo mensual sostenible y lo adicional corriendo por crédito.
            </p>
          </div>

          <div className="rounded-xl p-4 flex gap-3"
            style={{ background: 'rgba(245,158,11,.05)', border: '1px solid rgba(245,158,11,.20)' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#f59e0b]" />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              La cuota mensual es fija y se causa completa en cada período, se radiquen solicitudes o no, ya que retribuye la disponibilidad del equipo y de la plataforma. Los {CREDITOS_MES} créditos incluidos se reinician cada mes y los no utilizados no son acumulables ni transferibles al período siguiente. El valor se factura en pesos colombianos; la referencia en dólares se calcula con la TRM de ${TRM} del {TRM_FECHA} y se incluye solo como equivalencia. La inversión publicitaria en Meta y Google, las tarifas por conversación de WhatsApp Business y el consumo de los modelos de inteligencia artificial se facturan aparte según su uso real.
            </p>
          </div>
        </section>

        {/* ── LOGOS DE CLIENTES ── */}
        <div className="mt-16">
          <LogoCarousel />
        </div>

        {/* ─ 06 VIGENCIA ─ */}
        <section id="vigencia" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 · Vigencia y términos</TagLabel>
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

          {/* Cierre */}
          <div className="mt-8 rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,230,40,.05)', border: '1px solid rgba(255,230,40,.20)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5" style={{ color: STUNET_GOLD }} />
              <p className="font-poppins font-semibold text-white/80 text-[18px]">Entre más crezcamos, todos crecemos juntos</p>
            </div>
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              Sixteam ya conoce el rubro, el modelo de negocio y los sistemas de Stunet. Ese conocimiento acumulado es lo que hace posible sostener este nivel de acompañamiento con una base mensual tan liviana. La industria de educación internacional volverá, y cuando lo haga la infraestructura seguirá en pie y lista para escalar. Mientras tanto, el foco está donde Stunet lo puso: en sacar adelante los programas digitales. Por separado se entrega el estado general del proyecto de implementación, con la línea de tiempo de qué está listo, qué sigue y qué quedó pendiente.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-12 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 100%, rgba(255,230,40,.04), transparent 70%)' }} />
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
                <span className="text-white/40 font-medium">{META.destinatarios} · {META.cliente}</span>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 text-[13px] text-white/25 font-lato mt-1">
                <span>Propuesta elaborada por</span>
                <span className="text-white/40 font-medium">{META.elaboradaPor}</span>
                <span>·</span>
                <span>{META.cargoElaborador}</span>
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

export default StunetOpsProposal;
