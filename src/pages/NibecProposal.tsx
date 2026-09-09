import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel, { defaultLogos } from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap, BarChart3,
  AlertCircle, TrendingUp, Calendar, Info, MapPin,
  MessageSquare, Users, LayoutDashboard, Rocket, Bot, Inbox, Shield,
  Repeat, Megaphone, Mail, Coins, Headphones, Database, Sparkles,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente:        'Nibec',
  tagline:        'Equipamiento industrial',
  sector:         'Equipamiento y mobiliario industrial · Chile',
  sede:           'Chile',
  fecha:          'Septiembre 2026',
  contacto:       'Fernando Coronado',
  proponente:     'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit:            '901.967.849-4',
  correo:         'alpha@sixteam.pro',
  rl:             'Samuel Armando Burgos Ferrer',
  autor:          'Ernesto Hernández',
  autorCargo:     'Gerente Comercial',
  objetivo:
    'Poner a disposición de Nibec el servicio Sixteam Ops de Soporte y Operaciones: un equipo que opera la tecnología y los sistemas de marketing, ventas y servicio del negocio, recibiendo, cotizando y ejecutando cada solicitud bajo un plan mensual de créditos.',
};

const NIBEC_COLOR = '#f5a02a';
const ALERT_COLOR = '#f87171';

// En esta propuesta, Nibec es el destinatario, así que su logo sale del carrusel de marcas
const LOGOS_SIN_CLIENTE = (() => {
  const filtrados = defaultLogos.filter(l => !/nibec/i.test(l.src));
  return [...filtrados, ...filtrados];
})();

const PLAN_NOMBRE = 'Plan Esencial';
const PLAN_USD = 299;
const CREDITOS_MES = 60;
const SOLICITUDES_MES = 5;
const VALOR_CREDITO = (PLAN_USD / CREDITOS_MES).toFixed(2);

// ─── DIAGNÓSTICO ─────────────────────────────────────────────────────────────

const HALLAZGOS = [
  {
    titulo: 'El embudo no se retroalimenta con los clientes ya convertidos',
    desc: 'Hoy la única vía de retorno de un cliente que ya compró es volver a pagar por él en pauta. No existe un sistema que lo reingrese al embudo por correo, WhatsApp o recordatorio comercial, de modo que cada recompra vuelve a pasar por el anuncio.',
    icon: Repeat, tint: 'navy',
  },
  {
    titulo: 'El costo de adquisición sube y se repaga por el mismo cliente',
    desc: 'El CAC de Nibec viene en aumento. Cuando un cliente recompra, la inversión publicitaria termina pagando de nuevo, al doble o al triple, por alguien que ya estaba en la base de datos.',
    icon: TrendingUp, tint: 'amber',
  },
  {
    titulo: 'Acciones sueltas en lugar de un sistema continuo',
    desc: 'Nibec ya tiene correos activos, entre ellos seguimiento de cotización, avisos de entrega, encuestas de satisfacción y calificación de pedido. Cada acción vive por su cuenta, sin un mapa común, sin continuidad en el tiempo y sin certeza de cuáles siguen encendidas.',
    icon: Inbox, tint: 'blue',
  },
  {
    titulo: 'Segmentación ya definida, aunque todavía sin activar',
    desc: 'El equipo clasifica su base en distintos tipos de cliente cruzando empresa o persona, monto de compra y frecuencia. Esa segmentación todavía no se traduce en comunicaciones diferenciadas para cada grupo.',
    icon: Users, tint: 'purple',
  },
  {
    titulo: 'Audiencias de Meta sin exclusión de compradores recientes',
    desc: 'Quien acaba de comprar sigue viendo los mismos anuncios, lo que encarece la pauta y desgasta la relación. Hoy no hay forma de excluir a esa persona sin excluir también al resto de la audiencia.',
    icon: Megaphone, tint: 'orange',
  },
  {
    titulo: 'Sin reglas de frecuencia ni control de saturación',
    desc: 'Los productos de Nibec responden a una necesidad puntual, por lo que enviar sin criterio termina leyéndose como spam. Hoy no existen reglas técnicas de frecuencia, ventanas de descanso ni control de solapamiento entre los envíos automáticos ya activos.',
    icon: Sparkles, tint: 'teal',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  navy:   { text: 'text-[#1d70a2]',   bg: 'rgba(29,112,162,.07)', border: 'rgba(29,112,162,.2)' },
  amber:  { text: 'text-amber-400',   bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)' },
  blue:   { text: 'text-[#60a5fa]',   bg: 'rgba(96,165,250,.07)',  border: 'rgba(96,165,250,.18)' },
  orange: { text: 'text-[#f5a02a]',   bg: 'rgba(245,160,42,.07)',  border: 'rgba(245,160,42,.22)' },
  purple: { text: 'text-[#a855f7]',   bg: 'rgba(168,85,247,.07)',  border: 'rgba(168,85,247,.2)' },
  teal:   { text: 'text-[#00bfa5]',   bg: 'rgba(0,191,165,.07)',   border: 'rgba(0,191,165,.2)' },
};

// ─── QUÉ CUBRE EL SERVICIO ───────────────────────────────────────────────────

const COBERTURA = [
  'Operación y soporte sobre Brevo y las demás plataformas que Nibec ya utiliza',
  'Ajustes y reentrenamiento de los asistentes de IA con información nueva o actualizada',
  'Ejecución de configuraciones adicionales: automatizaciones, informes, campos y flujos',
  'Adición de nuevas funcionalidades o integraciones según las necesidades del negocio',
  'Refuerzo en el uso de las herramientas para el equipo comercial y de marketing',
  'Levantamiento y ejecución de oportunidades de mejora técnicas de la operación',
  'Desglose detallado de los créditos consumidos por cada solicitud atendida en el mes',
  'Atención vía canal dedicado con SLA de 4 horas en días hábiles',
];

// Lo que el servicio no cubre, para dejar el alcance sin ambigüedad
const FUERA_DE_ALCANCE = [
  'Creación de contenido para marketing: textos, piezas gráficas, fotografía o video',
  'Definición de la estrategia comercial, de precios o de promociones',
  'Gestión de redes sociales y publicación de contenido',
  'Administración de la inversión publicitaria y de su presupuesto',
];

// ─── BANDAS DE COMPLEJIDAD DEL CRÉDITO ───────────────────────────────────────

const BANDAS = [
  {
    rango: '4 a 10', tipo: 'Solicitud simple',
    ej: 'Un ajuste de un flujo ya activo, un campo o segmento nuevo, una plantilla de correo o el soporte de una incidencia',
  },
  {
    rango: '11 a 20', tipo: 'Solicitud media',
    ej: 'Un flujo de bienvenida o de recompra nuevo, una segmentación de la base por tipo de cliente o un panel de informes',
  },
  {
    rango: '21 o más', tipo: 'Solicitud compleja',
    ej: 'Una integración vía API con Meta o el e-commerce, o la migración de una automatización completa entre plataformas',
  },
];

const BANDA_STYLE: Record<string, { bg: string; border: string; color: string }> = {
  Simple:   { bg: 'rgba(0,191,165,.12)',  border: 'rgba(0,191,165,.3)',  color: '#00bfa5' },
  Media:    { bg: 'rgba(29,112,162,.14)', border: 'rgba(29,112,162,.32)', color: '#1d70a2' },
  Compleja: { bg: 'rgba(168,85,247,.12)', border: 'rgba(168,85,247,.3)', color: '#a855f7' },
};

const AREA_STYLE: Record<string, { bg: string; border: string; color: string }> = {
  Marketing:  { bg: 'rgba(0,191,165,.12)',  border: 'rgba(0,191,165,.3)',  color: '#00bfa5' },
  Ventas:     { bg: 'rgba(29,112,162,.14)', border: 'rgba(29,112,162,.32)', color: '#1d70a2' },
  Servicio:   { bg: 'rgba(245,160,42,.12)', border: 'rgba(245,160,42,.3)', color: NIBEC_COLOR },
  Plataforma: { bg: 'rgba(96,165,250,.12)', border: 'rgba(96,165,250,.3)', color: '#60a5fa' },
};

// ─── EJEMPLO DE REPORTE MENSUAL DE CRÉDITOS ──────────────────────────────────

const REPORTE = [
  { solicitud: 'Automatización de exclusión de compradores en audiencias de Meta vía API de conversiones', area: 'Plataforma', banda: 'Compleja', creditos: 22 },
  { solicitud: 'Montaje y automatización del flujo de bienvenida post-compra en la plataforma',             area: 'Marketing',  banda: 'Media',    creditos: 14 },
  { solicitud: 'Configuración de la segmentación por tipo de cliente, monto acumulado y frecuencia',        area: 'Marketing',  banda: 'Media',    creditos: 12 },
  { solicitud: 'Ajuste de reglas de frecuencia y criterios de entrada al flujo',                            area: 'Marketing',  banda: 'Simple',   creditos: 6 },
  { solicitud: 'Soporte y resolución de incidencias sobre la plataforma',                                   area: 'Plataforma', banda: 'Simple',   creditos: 6 },
];

const TOTAL_REPORTE = REPORTE.reduce((a, r) => a + r.creditos, 0);

// Distribución del mes de ejemplo, para mostrarla como resumen sobre la tabla
const DISTRIBUCION = ['Compleja', 'Media', 'Simple'].map(b => ({
  banda: b,
  cantidad: REPORTE.filter(r => r.banda === b).length,
  creditos: REPORTE.filter(r => r.banda === b).reduce((a, r) => a + r.creditos, 0),
}));

// ─── CATÁLOGO DE ACTIVIDADES ─────────────────────────────────────────────────

const CATALOGO = [
  {
    categoria: 'Sistemas de marketing',
    icon: Mail,
    color: '#00bfa5',
    items: [
      'Montaje de flujos de correo automatizados sobre la plataforma, con los contenidos que entrega el equipo',
      'Configuración de disparadores y condiciones de entrada: primera compra, recompra, inactividad, categoría comprada',
      'Reglas de frecuencia, ventanas de descanso y control de solapamiento entre envíos',
      'Segmentación técnica de la base según los criterios que define el equipo',
      'Construcción y sincronización de audiencias de Meta, incluidas las de exclusión de compradores recientes',
      'Montaje de landings y formularios de cotización conectados a la base de datos',
      'Configuración del seguimiento de aperturas, clics y conversiones de cada envío',
    ],
  },
  {
    categoria: 'Sistemas de ventas y CRM',
    icon: LayoutDashboard,
    color: '#1d70a2',
    items: [
      'Configuración de pipelines comerciales y etapas de oportunidad para el ciclo comercial de Nibec',
      'Campos personalizados de cliente para registrar tipo, monto acumulado, categoría y frecuencia',
      'Automatización del seguimiento a cotizaciones que hoy se hace de forma manual',
      'Recordatorios y tareas automáticas para los vendedores sobre clientes por reactivar',
      'Enrutamiento de la cotización hacia WhatsApp o hacia la landing según el origen del cliente',
      'Informes de conversión, recompra y actividad comercial',
    ],
  },
  {
    categoria: 'Sistemas de servicio y postventa',
    icon: Headphones,
    color: NIBEC_COLOR,
    items: [
      'Configuración del ChatCenter para centralizar WhatsApp, Instagram y Facebook en una sola bandeja',
      'Revisión y ordenamiento de los correos transaccionales ya activos para que no choquen entre sí',
      'Automatización de encuestas de satisfacción y solicitudes de reseña en el punto del ciclo que el equipo defina',
      'Avisos de entrega y seguimiento post-despacho',
      'Flujos de recuperación de carrito y de cotización abandonada',
    ],
  },
  {
    categoria: 'Inteligencia artificial aplicada',
    icon: Bot,
    color: '#a855f7',
    items: [
      'Asistentes conversacionales entrenados con la información que entrega el equipo de Nibec',
      'Análisis de la base de datos para detectar patrones de recompra y ventanas de contacto',
      'Clasificación automática de clientes y de conversaciones entrantes',
      'Calificación de leads antes de que lleguen al vendedor',
      'Enrutamiento inteligente de la conversación hacia el asesor correspondiente',
    ],
  },
  {
    categoria: 'Plataforma, datos e integraciones',
    icon: Database,
    color: '#60a5fa',
    items: [
      'Conexión de la plataforma con el e-commerce, WhatsApp Business y las cuentas de Meta',
      'Integración con la API de conversiones de Meta para enviar eventos y actualizar audiencias de forma automática',
      'Migración y depuración de la base de contactos de Nibec',
      'Paneles de informes personalizados sobre el desempeño de flujos y campañas',
      'Monitoreo continuo de automatizaciones activas para detectar flujos rotos o contactos sin atender',
      'Documentación del sistema y capacitación al equipo',
    ],
  },
];

// ─── RUTA DE ARRANQUE ────────────────────────────────────────────────────────

type Actividad = { text: string; tag?: string };

const FASES = [
  {
    num: '01',
    nombre: 'Automatizaciones por WhatsApp: atención directa con la vendedora',
    duracion: 'Prioridad 1',
    icon: MessageSquare,
    color: NIBEC_COLOR,
    colorAlpha: 'rgba(245,160,42,.10)',
    colorBorder: 'rgba(245,160,42,.3)',
    descripcion: 'La gestión de cotizaciones se automatiza por WhatsApp para aprovechar la relación directa que la vendedora ya tiene con los clientes, sin perder ese trato cercano.',
    actividades: [
      { text: 'Seguimiento a cotizaciones: mensaje automático por WhatsApp a los 10 días de emitida la cotización si el cliente no ha respondido' },
      { text: 'Rescate de cotizaciones: 5% de descuento para clientes nuevos que no concretaron la compra y no tienen otro descuento ya aplicado' },
      { text: 'Mensajes postventa: notificación al marcar una venta como ganada, con 5% de descuento para la siguiente compra y el canal directo con la vendedora abierto' },
      { text: 'Recompra predictiva: mensajes a los 30, 60 y 90 días orientados a la recompra de categorías complementarias, como estanterías, lockers o ventiladores' },
      { text: 'Reactivación de clientes con más de 3 meses de inactividad, con mensajes de tono cercano firmados por la vendedora, por ejemplo "Soy Lis, si necesitas algo este mes, escríbeme"', tag: 'Trabajo en conjunto' },
    ] as Actividad[],
  },
  {
    num: '02',
    nombre: 'Recuperación de cotizaciones perdidas y leads',
    duracion: 'Prioridad 2',
    icon: Repeat,
    color: '#1d70a2',
    colorAlpha: 'rgba(29,112,162,.12)',
    colorBorder: 'rgba(29,112,162,.3)',
    descripcion: 'Cada cotización y cada lead que hoy se marca como perdido vuelve a intentarse de forma automática, en lugar de quedar cerrado de forma definitiva en el CRM.',
    actividades: [
      { text: 'Identificación de las cotizaciones y leads marcados como perdidos dentro del CRM' },
      { text: 'Flujo de contacto automático a los 30, 60 y 90 días para reabrir la conversación comercial' },
      { text: 'Mensajes orientados a resolver la objeción u ofrecer una alternativa antes de insistir con la compra' },
      { text: 'Reingreso del lead al pipeline comercial cuando responde, con notificación directa a la vendedora' },
      { text: 'Seguimiento de cuántas cotizaciones perdidas se reconvierten en ventas ganadas' },
    ] as Actividad[],
  },
  {
    num: '03',
    nombre: 'Automatización de e-commerce: email marketing',
    duracion: 'Prioridad 3',
    icon: Mail,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.3)',
    descripcion: 'El e-commerce suma su propio canal de retorno: correos de bienvenida y de venta cruzada que recomiendan lo que el cliente todavía no ha comprado.',
    actividades: [
      { text: 'Correo de bienvenida con descuento para quien compra por primera vez en el e-commerce' },
      { text: 'Secuencia de venta cruzada que recomienda categorías que el cliente todavía no ha comprado' },
      { text: 'Segmentación de la base según el historial de compra para que la recomendación sea relevante' },
      { text: 'Configuración del seguimiento de aperturas, clics y conversiones de cada envío' },
    ] as Actividad[],
  },
  {
    num: '04',
    nombre: 'Programa de fidelización VIP',
    duracion: 'Prioridad 4',
    icon: Sparkles,
    color: '#a855f7',
    colorAlpha: 'rgba(168,85,247,.10)',
    colorBorder: 'rgba(168,85,247,.3)',
    descripcion: 'Los clientes de mayor valor reciben un trato diferenciado, con beneficios exclusivos que refuerzan la relación en lugar de tratarlos igual que al resto de la base.',
    actividades: [
      { text: 'Definición del umbral de cliente VIP: compras acumuladas superiores a $5.000.000 CLP' },
      { text: 'Identificación automática de los clientes que alcanzan ese umbral dentro de la base' },
      { text: 'Estructuración de beneficios exclusivos para ese segmento, con el contenido que define el equipo', tag: 'Trabajo en conjunto' },
      { text: 'Comunicación diferenciada para el segmento VIP, separada del resto de la base' },
    ] as Actividad[],
  },
  {
    num: '05',
    nombre: 'Diagnóstico y reestructuración en Brevo',
    duracion: 'Prioridad 5',
    icon: Database,
    color: '#60a5fa',
    colorAlpha: 'rgba(96,165,250,.10)',
    colorBorder: 'rgba(96,165,250,.3)',
    descripcion: 'Antes de sumar más automatizaciones, se corrige la falla que separa las conversaciones de WhatsApp de las oportunidades comerciales en Brevo, para que el historial de cada cliente quede completo.',
    actividades: [
      { text: 'Revisión de la configuración actual de Brevo entre WhatsApp y el CRM de oportunidades' },
      { text: 'Corrección de la falla que crea las conversaciones de WhatsApp separadas de la oportunidad comercial' },
      { text: 'Vinculación de cada conversación con su oportunidad para tener el historial real de la interacción' },
      { text: 'Validación de que el resto de las automatizaciones del período, como seguimiento, rescate, recompra y reactivación, queden registradas sobre esa misma oportunidad' },
    ] as Actividad[],
  },
];

const SECCIONES = [
  { id: 'resumen',    label: 'Resumen' },
  { id: 'objetivo',   label: 'Objetivo' },
  { id: 'servicio',   label: 'Servicio' },
  { id: 'alcance',    label: 'Alcance' },
  { id: 'arranque',   label: 'Plan de trabajo' },
  { id: 'inversion',  label: 'Inversión' },
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

const NibecProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [faseActiva, setFaseActiva] = useState<number | null>(null);
  const [catalogoActivo, setCatalogoActivo] = useState<number | null>(null);
  const [showReporte, setShowReporte] = useState(false);
  const [showEjemplo, setShowEjemplo] = useState(false);
  const [showComoFunciona, setShowComoFunciona] = useState(false);
  const [showFueraAlcance, setShowFueraAlcance] = useState(false);

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
  const s7 = useVisible();

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
            style={{ background: 'radial-gradient(circle, rgba(245,160,42,.06) 0%, transparent 65%)' }} />
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
            <div className="h-11 w-24 flex items-center justify-center rounded-lg px-2" style={{ background: 'rgba(255,255,255,.95)' }}>
              <img src="/Logo nibec.png" alt="Nibec" className="max-h-full w-auto object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
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
              <TagLabel>Propuesta de trabajo y cotización · {META.fecha}</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${NIBEC_COLOR}, #00bfa5)` }}>
                  <Shield className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">Nibec</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(0,191,165,.10)', border: '1px solid rgba(0,191,165,.25)', color: '#00bfa5' }}>
                  Sixteam Ops
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}>
                Propuesta<br />
                <span style={{ background: `linear-gradient(90deg,${NIBEC_COLOR},#00bfa5)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Comercial
                </span>
              </h1>
              <p className="font-lato text-white/55 text-xl leading-relaxed mb-5">
                Un equipo que opera la tecnología y los sistemas de marketing, ventas y servicio de Nibec, bajo un plan mensual de créditos pensado para arrancar la operación.
              </p>
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
                  { icon: Coins,    text: `${PLAN_NOMBRE} · ${CREDITOS_MES} créditos/mes` },
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
                  {['1. Resumen ejecutivo','2. Objetivo general','3. Sixteam Ops','4. Alcance del servicio','5. Plan de trabajo','6. Inversión','7. Vigencia y términos'].map((item, i) => (
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
                  style={{ background: 'radial-gradient(circle, rgba(245,160,42,.10) 0%, rgba(0,191,165,.05) 50%, transparent 70%)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full" style={{ border: '1px solid rgba(245,160,42,.14)' }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(0,191,165,.18)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: NIBEC_COLOR, boxShadow: '0 0 6px rgba(245,160,42,.8)' }} />
                </div>
              </div>
              <div className="cover-float relative z-10 flex flex-col items-center gap-5 w-full px-6">
                <div className="flex flex-col items-center gap-1">
                  <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-14 w-auto object-contain"
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
                  <div className="w-48 h-28 flex items-center justify-center p-4 rounded-xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,.94)', border: '1px solid rgba(255,255,255,.08)' }}>
                    <img src="/Logo nibec.png" alt="Nibec" className="max-w-full max-h-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <div className="text-center">
                    <p className="font-poppins font-black text-white text-[20px] tracking-tight">Nibec</p>
                    <p className="font-lato text-[13px] uppercase tracking-[0.18em] mt-1" style={{ color: NIBEC_COLOR }}>Equipamiento industrial</p>
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
          <div className="rounded-2xl p-5 sm:p-6 mb-8"
            style={{ background: 'rgba(2,8,20,.85)', border: '1px solid rgba(245,160,42,.18)' }}>
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center">
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <div className="w-28 h-16 flex items-center justify-center p-2 rounded-xl overflow-hidden"
                  style={{ background: 'rgba(255,255,255,.94)', border: '1px solid rgba(255,255,255,.1)' }}>
                  <img src="/Logo nibec.png" alt="Nibec" className="max-w-full max-h-full object-contain" />
                </div>
                <span className="font-lato text-[11px] uppercase tracking-[0.2em]" style={{ color: NIBEC_COLOR }}>Nibec</span>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                  <p className="font-poppins font-semibold text-white/80 text-[16px]">{META.sector}</p>
                </div>
                <div>
                  <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Contacto</p>
                  <p className="font-poppins font-semibold text-white/80 text-[16px]">{META.contacto}</p>
                </div>
                <div>
                  <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Canales de venta</p>
                  <p className="font-lato text-white/60 text-[15px]">E-commerce, cotización directa y WhatsApp, con pauta en Meta como principal fuente de tráfico</p>
                </div>
                <div>
                  <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Tipo de cliente</p>
                  <p className="font-lato text-white/60 text-[15px]">B2B y B2C, segmentado por monto de compra y frecuencia</p>
                </div>
                <div>
                  <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Servicio propuesto</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: '#00bfa5' }} />
                    <p className="font-poppins font-semibold text-[#00bfa5] text-[14px]">Sixteam Ops · {PLAN_NOMBRE}</p>
                  </div>
                </div>
                <div>
                  <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Fecha de propuesta</p>
                  <p className="font-lato text-white/60 text-[15px]">{META.fecha}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              Nibec vende a clientes empresa y persona, depende de la pauta de Meta para captar tráfico y cierra buena parte de sus ventas por cotización, fuera del carrito. Ese patrón de compra, con recompra concentrada sobre la misma base de clientes, es lo que hace que{' '}
              <strong className="text-white/90 font-semibold">valga la pena automatizar el retorno del cliente al embudo</strong> antes de seguir invirtiendo en captar clientes nuevos.
            </p>
            <p>
              En la reunión con Fernando Coronado se planteó el problema central: el embudo capta clientes nuevos con anuncios, aunque nunca se retroalimenta con quienes ya compraron. Para que un cliente vuelva hay que pagar otra vez por él, a veces al doble o al triple, mientras la base que ya conoce la marca permanece sin activar. Lo que busca no es una acción aislada más, sino{' '}
              <strong className="text-white/90 font-semibold">un sistema que se sostenga en el tiempo</strong>.
            </p>
            <p>
              Esta propuesta responde con el servicio <strong className="text-white/90 font-semibold">Sixteam Ops de Soporte y Operaciones</strong>, bajo el {PLAN_NOMBRE}. Sixteam se incorpora como el equipo que opera la tecnología de Nibec, es decir que construye, automatiza, integra y mantiene los sistemas de marketing, ventas y servicio sobre los que corre la operación comercial que el equipo define.
            </p>
          </div>

          {/* Hallazgos */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> {HALLAZGOS.length} frenos identificados en el diagnóstico
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
              style={{ background: 'radial-gradient(circle, rgba(245,160,42,.07), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 text-[#00bfa5] mb-4" />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[22px] leading-relaxed">
              Poner a disposición de Nibec el servicio <strong className="text-white font-black">Sixteam Ops de Soporte y Operaciones</strong> bajo el <strong className="text-white font-black">{PLAN_NOMBRE}</strong>: un equipo que opera la tecnología y los sistemas de marketing, ventas y servicio de Nibec,{' '}
              <em className="not-italic" style={{ color: NIBEC_COLOR }}>empezando por automatizar el retorno del cliente ya convertido al embudo</em> sin volver a pagar por él en pauta.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Créditos incluidos', value: `${CREDITOS_MES}`, sub: 'Por período mensual' },
              { label: 'Solicitudes al mes', value: `~${SOLICITUDES_MES}`, sub: 'Solicitudes básicas' },
              { label: 'Valor por crédito', value: `≈$${VALOR_CREDITO}`, sub: 'Dólares estadounidenses' },
              { label: 'Primera respuesta', value: '4h', sub: 'SLA en días hábiles' },
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

        {/* ─ 03 SERVICIO ─ */}
        <section id="servicio" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — El servicio</TagLabel>
          <SectionTitle>Sixteam Ops: Soporte y Operaciones</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            En lugar de contratar un proyecto cerrado, Nibec cuenta con un equipo disponible para recibir solicitudes, resolverlas técnicamente y ejecutarlas sobre sus sistemas, bajo un plan mensual de créditos. Cada solicitud se cotiza antes de ejecutarse, así el equipo sabe siempre cuánto consume y en cuánto tiempo queda lista.
          </p>

          {/* Bloque principal del Plan Esencial */}
          <div className="rounded-2xl p-5 sm:p-7 mb-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(0,191,165,.08) 0%, rgba(3,13,26,.9) 100%)', border: '1px solid rgba(0,191,165,.28)' }}>
            <div className="absolute top-0 right-0 w-56 h-56 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,191,165,.07), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <div className="relative z-10">
              <div className="flex flex-wrap items-end gap-3 mb-4">
                <p className="font-poppins font-black leading-none" style={{ fontSize: 'clamp(1.9rem, 4.2vw, 2.4rem)', color: '#00bfa5' }}>
                  {PLAN_NOMBRE}
                </p>
                <span className="font-poppins font-bold text-white/70 text-[17px] mb-1">· {CREDITOS_MES} créditos/mes</span>
                <span className="font-lato text-[12px] px-3 py-1 rounded-full uppercase tracking-wider mb-1.5"
                  style={{ background: 'rgba(0,191,165,.15)', border: '1px solid rgba(0,191,165,.35)', color: '#00bfa5' }}>
                  Nibec
                </span>
              </div>

              <p className="font-lato text-white/55 text-[17px] leading-relaxed mb-5">
                Acompañamiento mensual sobre los sistemas de Nibec. Cubre el soporte de la plataforma, de los asistentes de IA y de cualquier tema relacionado con la prestación del servicio, además de la ejecución de configuraciones adicionales. Los {CREDITOS_MES} créditos alcanzan en promedio para <strong className="text-white/75">cerca de {SOLICITUDES_MES} solicitudes básicas mensuales</strong>.
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                {COBERTURA.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                    <span className="font-lato text-white/60 text-[15px] leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Operamos sobre las plataformas del cliente */}
          <div className="rounded-xl p-4 sm:p-5 mb-4 flex gap-3"
            style={{ background: 'rgba(245,160,42,.05)', border: '1px solid rgba(245,160,42,.2)' }}>
            <Database className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: NIBEC_COLOR }} />
            <div className="flex-1 min-w-0">
              <p className="font-poppins font-semibold text-white/80 text-[17px] mb-1.5">Operamos sobre las plataformas que ya tiene</p>
              <p className="font-lato text-white/50 text-[16px] leading-relaxed">
                El servicio no obliga a cambiar de herramienta. Sixteam trabaja directamente sobre <strong className="text-white/75">Brevo</strong>, sobre el e-commerce, sobre las cuentas de Meta y sobre las demás plataformas que Nibec ya utiliza, aprovechando lo que está construido en lugar de empezar de cero. Si en algún momento el equipo requiere una funcionalidad que sus plataformas actuales no cubren, se evalúa en conjunto y se cotiza como proyecto de implementación aparte.
              </p>
            </div>
          </div>

          {/* Cómo funciona el consumo de créditos */}
          <div className="rounded-xl overflow-hidden transition-all duration-300 mb-4"
            style={{ border: showComoFunciona ? '1px solid rgba(0,191,165,.35)' : '1px solid rgba(255,255,255,.08)' }}>
            <button onClick={() => setShowComoFunciona(v => !v)}
              className="w-full flex items-center gap-3 px-4 sm:px-5 py-4 text-left transition-all duration-200"
              style={{ background: showComoFunciona ? 'rgba(0,191,165,.06)' : 'rgba(255,255,255,.02)' }}>
              <Coins className="w-4 h-4 flex-shrink-0" style={{ color: showComoFunciona ? '#00bfa5' : 'rgba(255,255,255,.35)' }} />
              <div className="flex-1">
                <span className="font-poppins font-bold text-[16px]" style={{ color: showComoFunciona ? '#fff' : 'rgba(255,255,255,.7)' }}>
                  Cómo funciona el consumo de créditos
                </span>
                <span className="font-lato text-white/30 text-[13px] ml-3 hidden sm:inline">4 pasos por solicitud</span>
              </div>
              <ChevronRight className="w-4 h-4 transition-transform duration-300 flex-shrink-0"
                style={{ color: showComoFunciona ? '#00bfa5' : 'rgba(255,255,255,.3)', transform: showComoFunciona ? 'rotate(90deg)' : undefined }} />
            </button>

            {showComoFunciona && (
              <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                <div className="pt-4 space-y-4">
                  <p className="font-lato text-white/50 text-[16px] leading-relaxed">
                    Por cada solicitud que entra, Sixteam cotiza cuántos créditos consumirá y en cuánto tiempo estará lista. El equipo decide si aprueba antes de que se ejecute cualquier trabajo, así nunca hay sorpresas al cierre del mes. El crédito es la unidad con la que se mide el esfuerzo técnico: una solicitud simple consume pocos créditos y una integración compleja consume más.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {BANDAS.map((c, i) => {
                      const bs = [BANDA_STYLE.Simple, BANDA_STYLE.Media, BANDA_STYLE.Compleja][i];
                      return (
                        <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(2,8,20,.6)', border: `1px solid ${bs.border}` }}>
                          <p className="font-poppins font-black text-[22px] leading-none mb-1" style={{ color: bs.color }}>{c.rango}</p>
                          <p className="font-lato text-white/30 text-[11px] uppercase tracking-wider mb-2">créditos</p>
                          <p className="font-poppins font-semibold text-white/80 text-[14px] mb-1">{c.tipo}</p>
                          <p className="font-lato text-white/45 text-[13px] leading-snug">{c.ej}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-xl p-4 flex flex-col gap-2.5" style={{ background: 'rgba(2,8,20,.6)', border: '1px solid rgba(255,255,255,.06)' }}>
                    <p className="font-poppins font-semibold text-white/60 text-[13px] uppercase tracking-wider">Flujo de cada solicitud</p>
                    {[
                      { step: '01', text: 'El equipo envía la solicitud describiendo qué necesita, por ejemplo automatizar un correo de bienvenida para quien compra por primera vez.' },
                      { step: '02', text: 'Sixteam analiza la solicitud y responde con la cotización: cuántos créditos consume y en cuánto tiempo queda lista.' },
                      { step: '03', text: 'El equipo aprueba y Sixteam ejecuta. Los créditos se descuentan del saldo del período, visible en todo momento.' },
                      { step: '04', text: 'Al cierre del mes se entrega el reporte con el desglose de créditos por solicitud y el saldo del período.' },
                    ].map((s) => (
                      <div key={s.step} className="flex items-start gap-3">
                        <span className="font-poppins font-black text-[11px] px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                          style={{ background: 'rgba(0,191,165,.15)', color: '#00bfa5' }}>{s.step}</span>
                        <p className="font-lato text-white/55 text-[15px] leading-relaxed">{s.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Ejemplo real de solicitud y respuesta — anidado */}
                  <div className="rounded-xl overflow-hidden transition-all duration-300"
                    style={{ border: showEjemplo ? `1px solid ${NIBEC_COLOR}55` : '1px solid rgba(255,255,255,.07)' }}>
                    <button onClick={() => setShowEjemplo(v => !v)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200"
                      style={{ background: showEjemplo ? 'rgba(245,160,42,.06)' : 'transparent' }}>
                      <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" style={{ color: showEjemplo ? NIBEC_COLOR : 'rgba(255,255,255,.35)' }} />
                      <div className="flex-1">
                        <span className="font-lato text-[14px]" style={{ color: showEjemplo ? NIBEC_COLOR : 'rgba(255,255,255,.45)' }}>
                          Ejemplo real de solicitud y respuesta
                        </span>
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide align-middle"
                          style={{ background: 'rgba(245,160,42,.12)', border: '1px solid rgba(245,160,42,.3)', color: NIBEC_COLOR }}>
                          Referencial
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 flex-shrink-0"
                        style={{ color: showEjemplo ? NIBEC_COLOR : 'rgba(255,255,255,.25)', transform: showEjemplo ? 'rotate(90deg)' : undefined }} />
                    </button>

                    {showEjemplo && (
                      <div className="px-4 pb-4 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                        <div className="pt-4 space-y-3">
                          <div className="rounded-lg p-3 flex gap-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                            <span className="font-poppins font-black text-[11px] px-2 py-0.5 rounded flex-shrink-0 h-fit mt-0.5"
                              style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.5)' }}>Fernando</span>
                            <p className="font-lato text-white/55 text-[15px] leading-relaxed italic">
                              "Queremos automatizar que a los clientes que compraron estantería les llegue, a los quince días, la pieza de mobiliario de carga que ya tenemos armada, con enlace directo para cotizar por WhatsApp."
                            </p>
                          </div>
                          <div className="rounded-lg p-3 flex gap-3" style={{ background: 'rgba(245,160,42,.06)', border: '1px solid rgba(245,160,42,.18)' }}>
                            <span className="font-poppins font-black text-[11px] px-2 py-0.5 rounded flex-shrink-0 h-fit mt-0.5"
                              style={{ background: 'rgba(245,160,42,.20)', color: NIBEC_COLOR }}>Sixteam</span>
                            <p className="font-lato text-white/55 text-[15px] leading-relaxed italic">
                              "Recibido. La solicitud incluye la segmentación por categoría comprada, el montaje de la plantilla en Brevo, la automatización con el retraso de quince días y el enlace de cotización a WhatsApp. Queda como <strong className="text-white/75 not-italic">solicitud media, 14 créditos</strong>, lista en 4 días hábiles. Te quedarían 46 créditos disponibles este mes. ¿Aprobamos?"
                            </p>
                          </div>
                          <div className="rounded-lg p-3 flex gap-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                            <span className="font-poppins font-black text-[11px] px-2 py-0.5 rounded flex-shrink-0 h-fit mt-0.5"
                              style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.5)' }}>Fernando</span>
                            <p className="font-lato text-white/55 text-[15px] leading-relaxed italic">"Sí, aprobado."</p>
                          </div>
                          <p className="font-lato text-white/35 text-[13px] leading-relaxed pt-1">
                            Sixteam construye el flujo, lo prueba y lo deja corriendo. A partir de ahí, todo cliente que compre estantería entra automáticamente en la secuencia sin intervención del equipo.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ejemplo de reporte mensual de créditos */}
          <div className="rounded-xl overflow-hidden transition-all duration-300 mb-4"
            style={{ border: showReporte ? '1px solid rgba(0,191,165,.35)' : '1px solid rgba(255,255,255,.08)' }}>
            <button onClick={() => setShowReporte(v => !v)}
              className="w-full flex items-center gap-3 px-4 sm:px-5 py-4 text-left transition-all duration-200"
              style={{ background: showReporte ? 'rgba(0,191,165,.06)' : 'rgba(255,255,255,.02)' }}>
              <BarChart3 className="w-4 h-4 flex-shrink-0" style={{ color: showReporte ? '#00bfa5' : 'rgba(255,255,255,.35)' }} />
              <div className="flex-1">
                <span className="font-poppins font-bold text-[16px]" style={{ color: showReporte ? '#fff' : 'rgba(255,255,255,.7)' }}>
                  Ejemplo de reporte mensual de créditos
                </span>
                <span className="font-lato text-white/30 text-[13px] ml-3 hidden sm:inline">{REPORTE.length} solicitudes · {TOTAL_REPORTE} de {CREDITOS_MES} créditos</span>
              </div>
              <ChevronRight className="w-4 h-4 transition-transform duration-300 flex-shrink-0"
                style={{ color: showReporte ? '#00bfa5' : 'rgba(255,255,255,.3)', transform: showReporte ? 'rotate(90deg)' : undefined }} />
            </button>

            {showReporte && (
              <div className="border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>

                {/* Resumen de la distribución del mes por complejidad */}
                <div className="px-4 sm:px-5 py-4 grid grid-cols-3 gap-2"
                  style={{ background: 'rgba(2,8,20,.5)', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                  {DISTRIBUCION.map((d) => {
                    const bs = BANDA_STYLE[d.banda];
                    return (
                      <div key={d.banda} className="rounded-lg px-2 py-2.5 text-center"
                        style={{ background: bs.bg, border: `1px solid ${bs.border}` }}>
                        <p className="font-poppins font-black text-[20px] leading-none" style={{ color: bs.color }}>{d.cantidad}</p>
                        <p className="font-poppins font-semibold text-white/70 text-[12px] mt-1 leading-tight">{d.banda}</p>
                        <p className="font-lato text-white/35 text-[11px] mt-0.5">{d.creditos} créditos</p>
                      </div>
                    );
                  })}
                </div>

                <div className="hidden sm:grid px-5 py-2 font-lato text-white/20 text-[11px] uppercase tracking-wider"
                  style={{ gridTemplateColumns: '1fr 100px 80px', background: 'rgba(255,255,255,.015)', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                  <span>Solicitud atendida</span>
                  <span className="text-center">Área</span>
                  <span className="text-right">Créditos</span>
                </div>
                <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
                  {REPORTE.map((r, i) => {
                    const a = AREA_STYLE[r.area];
                    const bs = BANDA_STYLE[r.banda];
                    return (
                      <div key={i} className="px-4 sm:px-5 py-3 grid items-center gap-2"
                        style={{ gridTemplateColumns: '1fr 100px 80px', background: i % 2 === 0 ? 'rgba(255,255,255,.012)' : 'transparent' }}>
                        <span className="font-lato text-white/60 text-[14px] leading-snug">
                          {r.solicitud}
                          <span className="ml-2 font-lato text-[11px] px-1.5 py-0.5 rounded whitespace-nowrap align-middle"
                            style={{ background: bs.bg, color: bs.color }}>
                            {r.banda}
                          </span>
                        </span>
                        <span className="justify-self-center font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap"
                          style={{ background: a.bg, border: `1px solid ${a.border}`, color: a.color }}>
                          {r.area}
                        </span>
                        <span className="font-poppins font-bold text-[14px] text-right" style={{ color: bs.color }}>{r.creditos}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="px-4 sm:px-5 py-4 grid items-center gap-2"
                  style={{ gridTemplateColumns: '1fr 100px 80px', background: 'rgba(0,191,165,.07)', borderTop: '1px solid rgba(0,191,165,.2)' }}>
                  <span className="font-poppins font-bold text-white text-[16px]">Total del mes</span>
                  <span className="justify-self-center font-lato text-white/35 text-[12px] whitespace-nowrap">{REPORTE.length} solicitudes</span>
                  <span className="font-poppins font-black text-[16px] text-right" style={{ color: '#00bfa5' }}>
                    {TOTAL_REPORTE} / {CREDITOS_MES}
                  </span>
                </div>
                <div className="px-4 sm:px-5 py-3 space-y-2" style={{ background: 'rgba(255,255,255,.02)', borderTop: '1px solid rgba(255,255,255,.05)' }}>
                  <p className="font-lato text-white/30 text-[13px] leading-relaxed">
                    Este es un ejemplo puntual de cómo podrían comportarse {REPORTE.length} solicitudes en un mes: una compleja, dos medias y dos simples que juntas agotan los {CREDITOS_MES} créditos del {PLAN_NOMBRE}. No es la única forma en que puede repartirse el plan, ya que habrá meses en los que una sola solicitud compleja se lleve gran parte de los créditos y el número de requerimientos atendidos sea menor.
                  </p>
                  <p className="font-lato text-white/30 text-[13px] leading-relaxed">
                    También es un caso de referencia en cuanto a los valores: una solicitud parecida puede cotizarse distinto en otro momento, porque el consumo depende del estado de la configuración, del volumen de datos y de las integraciones que toque. Cada solicitud se cotiza con su número exacto antes de ejecutarse.
                  </p>
                  <p className="font-lato text-white/30 text-[13px] leading-relaxed">
                    Los créditos no utilizados no son acumulables al período siguiente, y si una solicitud excede el saldo disponible se cotiza el excedente aparte o se programa para el siguiente período, siempre con aprobación previa.
                  </p>
                </div>
              </div>
            )}
          </div>

        </section>

        {/* ─ 04 ALCANCE ─ */}
        <section id="alcance" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Alcance del servicio</TagLabel>
          <SectionTitle>Qué se puede solicitar</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Este es el catálogo de actividades que Nibec puede solicitar con cargo a los créditos del {PLAN_NOMBRE}, agrupadas por área. No es una lista cerrada, sino una referencia de lo que el servicio cubre: si el equipo necesita algo que no está aquí, se plantea la solicitud y Sixteam evalúa cómo resolverlo y cuántos créditos consume.
          </p>

          <div className="space-y-3">
            {CATALOGO.map((bloque, bi) => {
              const BIcon = bloque.icon;
              const bopen = catalogoActivo === bi;
              return (
                <div key={bi} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: bopen ? `1px solid ${bloque.color}44` : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setCatalogoActivo(bopen ? null : bi)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: bopen ? `${bloque.color}20` : 'rgba(255,255,255,.05)' }}>
                      <BIcon className="w-4 h-4 transition-colors" style={{ color: bopen ? bloque.color : 'rgba(255,255,255,.35)' }} />
                    </div>
                    <div className="flex-1">
                      <span className={`font-poppins font-bold text-[18px] ${bopen ? 'text-white' : 'text-white/70'}`}>{bloque.categoria}</span>
                      <span className="font-lato text-white/30 text-[14px] ml-3">{bloque.items.length} actividades</span>
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

          {/* Qué opera Sixteam y qué queda del lado del cliente */}
          <div className="mt-6 rounded-xl overflow-hidden transition-all duration-300"
            style={{ border: showFueraAlcance ? `1px solid ${ALERT_COLOR}55` : '1px solid rgba(255,255,255,.08)' }}>
            <button onClick={() => setShowFueraAlcance(v => !v)}
              className="w-full flex items-center gap-3 px-4 sm:px-5 py-4 text-left transition-all duration-200"
              style={{ background: showFueraAlcance ? 'rgba(248,113,113,.06)' : 'rgba(255,255,255,.02)' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: showFueraAlcance ? ALERT_COLOR : 'rgba(255,255,255,.35)' }} />
              <div className="flex-1">
                <span className="font-poppins font-bold text-[16px]" style={{ color: showFueraAlcance ? '#fff' : 'rgba(255,255,255,.7)' }}>
                  Qué opera Sixteam y qué queda del lado de Nibec
                </span>
                <span className="font-lato text-white/30 text-[13px] ml-3 hidden sm:inline">Límites del servicio</span>
              </div>
              <ChevronRight className="w-4 h-4 transition-transform duration-300 flex-shrink-0"
                style={{ color: showFueraAlcance ? ALERT_COLOR : 'rgba(255,255,255,.3)', transform: showFueraAlcance ? 'rotate(90deg)' : undefined }} />
            </button>

            {showFueraAlcance && (
              <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                <div className="pt-4 space-y-4">
                  <p className="font-lato text-white/50 text-[16px] leading-relaxed">
                    Sixteam opera la tecnología y los sistemas, es decir configura, automatiza, integra y mantiene la infraestructura sobre la que corre la operación comercial. La estrategia comercial y el contenido siguen siendo del equipo de Nibec, de modo que estos puntos quedan fuera del servicio:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
                    {FUERA_DE_ALCANCE.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[7px]" style={{ background: ALERT_COLOR }} />
                        <span className="font-lato text-white/50 text-[15px] leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-lg p-3.5 flex gap-2.5" style={{ background: 'rgba(245,160,42,.07)', border: '1px solid rgba(245,160,42,.22)' }}>
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: NIBEC_COLOR }} />
                    <p className="font-lato text-white/55 text-[14px] leading-relaxed">
                      <strong className="text-white/75">Módulos y plataformas nuevas.</strong> La implementación, configuración, activación y capacitación de funcionalidades que hoy no existen en las plataformas de Nibec, como un CRM, un ChatCenter o Asistentes de IA, se cotizan aparte como proyecto de implementación. Una vez implementados, su operación y sus ajustes posteriores sí quedan cubiertos por los créditos del servicio.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ─ 05 ARRANQUE ─ */}
        <section id="arranque" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Propuesta de Plan de Trabajo</TagLabel>
          <SectionTitle>{FASES.length} acciones clave para iniciar</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            En la última reunión con Fernando Coronado se definieron y priorizaron estas {FASES.length} acciones, con las que se van a trabajar los próximos 3 meses del servicio. El servicio no tiene cronograma cerrado, ya que el equipo decide mes a mes en qué invertir los créditos, aunque este es el orden de prioridad que se acordó en esa reunión.
          </p>

          <div className="relative mb-10">
            <div className="hidden sm:block absolute left-[28px] top-10 bottom-10 w-px"
              style={{ background: 'linear-gradient(to bottom, rgba(245,160,42,.4), rgba(29,112,162,.4), rgba(0,191,165,.4), rgba(168,85,247,.4), rgba(96,165,250,.4))' }} />

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
                            {fase.actividades.map((a, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: fase.color }} />
                                <span className="font-lato text-white/65 text-[16px] flex-1">{a.text}
                                  {a.tag && (
                                    <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wide align-middle"
                                      style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.3)', color: '#00bfa5' }}>
                                      {a.tag}
                                    </span>
                                  )}
                                </span>
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

          <div className="rounded-xl p-4 flex gap-3"
            style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.2)' }}>
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
            <div>
              <p className="font-poppins font-semibold text-white/75 text-[16px] mb-1">Desarrollo mes a mes, sobre estas 5 prioridades</p>
              <p className="font-lato text-white/55 text-[15px] leading-relaxed">
                Estas {FASES.length} acciones se reparten a lo largo de los 3 meses de trabajo, aunque no como fases cerradas y secuenciales: el equipo decide mes a mes en qué avanzar según el consumo de créditos disponible. El material se diseña de forma atemporal, sin depender de fechas concretas, para que los flujos sigan activos y funcionando automáticamente una vez montados. Al cierre de los 3 meses se revisa el resultado de cada frente y se define el siguiente tramo de trabajo.
              </p>
            </div>
          </div>
        </section>

        {/* ─ 06 INVERSIÓN ─ */}
        <section id="inversion" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 — Propuesta de inversión</TagLabel>
          <SectionTitle>{PLAN_NOMBRE} · Sixteam Ops</SectionTitle>
          <Rule />
          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Un único valor mensual anticipado que cubre el servicio de Nibec. No hay costo de implementación ni pago inicial, ya que Sixteam opera sobre las plataformas que Nibec ya tiene y el trabajo de arranque se ejecuta con los créditos del propio plan. Todos los valores están expresados en{' '}
            <strong className="text-white/75">dólares estadounidenses (USD)</strong>.
          </p>

          {/* Card principal */}
          <div className="rounded-2xl p-6 sm:p-8 mb-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(0,191,165,.10) 0%, rgba(3,13,26,.9) 100%)', border: '1px solid rgba(0,191,165,.3)' }}>
            <div className="absolute top-0 right-0 w-52 h-52 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,191,165,.08), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <p className="font-lato text-white/40 text-[13px] uppercase tracking-widest">Servicio único · Sixteam Ops</p>
                <span className="font-lato text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(0,191,165,.15)', border: '1px solid rgba(0,191,165,.35)', color: '#00bfa5' }}>
                  Mensual anticipado
                </span>
              </div>
              <div className="flex flex-wrap items-end gap-3 mb-1">
                <p className="font-poppins font-black text-white leading-none" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)' }}>
                  USD {PLAN_USD}
                </p>
                <span className="font-lato text-white/40 text-[18px] mb-1">/mes</span>
              </div>
              <p className="font-lato text-white/45 text-[15px] mb-5">
                {PLAN_NOMBRE} · {CREDITOS_MES} créditos mensuales · ≈ USD {VALOR_CREDITO} por crédito · ~{SOLICITUDES_MES} solicitudes básicas al mes
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                {[
                  { label: 'Créditos mensuales incluidos', value: `${CREDITOS_MES}` },
                  { label: 'Solicitudes promedio al mes', value: `~${SOLICITUDES_MES}` },
                  { label: 'Plan contratado', value: PLAN_NOMBRE },
                  { label: 'Plataformas sobre las que se opera', value: 'Brevo y las actuales' },
                  { label: 'Cotización en créditos antes de ejecutar', value: 'Siempre' },
                  { label: 'Reporte mensual de consumo', value: 'Incluido' },
                  { label: 'Canal dedicado de atención', value: 'SLA 4h hábiles' },
                  { label: 'Costo de implementación', value: 'Sin costo' },
                ].map((r, i) => (
                  <li key={i} className="flex items-center justify-between gap-2 py-0.5">
                    <span className="font-lato text-white/55 text-[15px]">{r.label}</span>
                    <span className="font-poppins font-bold text-white/85 text-[15px] flex-shrink-0">{r.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Nota de crecimiento */}
          <div className="rounded-xl p-4 flex gap-3"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <Zap className="w-4 h-4 text-[#00bfa5] flex-shrink-0 mt-0.5" />
            <p className="font-lato text-white/55 text-[15px] leading-relaxed">
              El {PLAN_NOMBRE} está pensado para arrancar la operación con foco en lo que genera mayor impacto: activar el retorno del cliente ya convertido al embudo. A medida que el sistema crece y se suman más automatizaciones, Nibec puede escalar a un plan con mayor volumen de créditos sin perder continuidad en lo ya construido.
            </p>
          </div>
        </section>

        {/* ── LOGOS ── */}
        <div className="mt-16">
          <LogoCarousel logos={LOGOS_SIN_CLIENTE} />
        </div>

        {/* ─ 07 VIGENCIA ─ */}
        <section id="vigencia" ref={s7.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s7.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>07 — Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y Términos de la Propuesta</SectionTitle>
          <Rule />

          <div className="space-y-3">
            {[
              { titulo: 'Aprobación', desc: 'Para aceptar esta propuesta y dar inicio al servicio se requiere confirmación vía WhatsApp, correo o verbal, con lo cual se habilita el contrato a firmar y se procede con el arranque.', icon: CheckCircle },
              { titulo: 'Términos de pago', desc: `El ${PLAN_NOMBRE} de Sixteam Ops se factura por período mensual anticipado, con el valor indicado en la sección de propuesta de inversión. Los pagos se realizan mediante transferencia bancaria en dólares estadounidenses.`, icon: FileText },
              { titulo: 'Créditos y su vigencia', desc: `El plan incluye ${CREDITOS_MES} créditos por período mensual, equivalentes en promedio a cerca de ${SOLICITUDES_MES} solicitudes básicas. Los créditos no utilizados no son acumulables al período siguiente. Si una solicitud excede el saldo disponible, se cotiza el excedente aparte o se programa para el período siguiente, siempre con aprobación previa.`, icon: Coins },
              { titulo: 'Cotización previa de cada solicitud', desc: 'Ninguna solicitud se ejecuta sin aprobación. Sixteam informa antes cuántos créditos consume y en cuánto tiempo estará lista, de modo que el equipo mantiene el control del consumo durante todo el período.', icon: MessageSquare },
              { titulo: 'Alcance del servicio', desc: 'Sixteam opera la tecnología y los sistemas de marketing, ventas y servicio: automatización, sistematización, integración, soporte e incorporación de inteligencia artificial. No incluye la creación de contenido para marketing, la definición de la estrategia comercial, la gestión de redes sociales ni la administración de la inversión publicitaria.', icon: AlertCircle },
              { titulo: 'Plataformas del cliente', desc: 'Sixteam opera sobre Brevo y sobre las demás plataformas que Nibec ya utiliza. Las licencias, planes y suscripciones de esas herramientas se mantienen a nombre del cliente y no forman parte del valor mensual del servicio.', icon: Shield },
              { titulo: 'Módulos y plataformas nuevas', desc: 'La implementación, configuración, activación y capacitación de funcionalidades que hoy no existen en las plataformas del cliente, como un CRM, un ChatCenter o Asistentes de IA, se cotizan aparte como proyecto de implementación. Una vez implementados, su operación y sus ajustes posteriores quedan cubiertos por los créditos del servicio.', icon: LayoutDashboard },
              { titulo: 'Costos variables de terceros', desc: 'Los mensajes plantilla de WhatsApp cobrados por Meta, los envíos de correo por encima del plan contratado en Brevo, el consumo de IA por mensajes procesados y la inversión publicitaria los cobra directamente cada proveedor y se trasladan sin margen adicional, facturados mes vencido según consumo real.', icon: TrendingUp },
              { titulo: 'Atención y tiempos de respuesta', desc: 'La atención se presta vía canal dedicado con un SLA de 4 horas en días hábiles para la primera respuesta. El tiempo de ejecución de cada solicitud se informa en su cotización, ya que depende de la complejidad.', icon: Headphones },
              { titulo: 'Permanencia mínima', desc: 'Aunque no existe cláusula de permanencia, Sixteam solicita establecer contractualmente un mínimo de 3 meses de prestación del servicio, como garantía de que el sistema alcance a construirse y a mostrar resultados. Este período puede cancelarse anticipadamente por fallas, errores o quejas del equipo de Nibec hacia Sixteam.', icon: Clock },
              { titulo: 'Inicio del servicio', desc: 'El servicio comienza desde la recepción del primer pago mensual y la entrega de accesos por parte de Nibec, específicamente las cuentas de correo marketing, el e-commerce, las cuentas de Meta y la base de clientes.', icon: Rocket },
              { titulo: 'Vigencia de la propuesta', desc: `Esta propuesta tiene una vigencia de 30 días calendario desde su fecha de emisión (${META.fecha}). Pasado este plazo, los valores podrán ser revisados según condiciones del mercado.`, icon: Calendar },
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
              style={{ background: 'radial-gradient(circle at 50% 100%, rgba(245,160,42,.05), transparent 70%)' }} />
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
              <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: 'rgba(0,191,165,.07)', border: '1px solid rgba(0,191,165,.2)' }}>
                <Users className="w-3.5 h-3.5 flex-shrink-0 text-[#00bfa5]" />
                <span className="font-lato text-white/40 text-[14px]">Propuesta realizada por:</span>
                <span className="font-poppins font-bold text-white/80 text-[14px]">{META.autor}</span>
                <span className="font-lato text-[#00bfa5] text-[14px]">{META.autorCargo}</span>
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

export default NibecProposal;
