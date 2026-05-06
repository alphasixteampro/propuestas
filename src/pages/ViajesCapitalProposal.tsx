import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, ChevronRight, FileText, Zap, BarChart3,
  MessageSquare, AlertCircle, TrendingUp, Mail, ArrowRight,
  Calendar, Users, Monitor, Database, Layers, Compass,
  Target, Settings, LineChart, Plane, MapPin, Phone,
  RefreshCw, Share2, GitMerge, Inbox, Bot, Globe,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const ACCENT = '#0ea5e9';      // ocean sky — Viajes Capital travel brand
const ACCENT2 = '#0077b6';     // deep ocean

const META = {
  cliente: 'Viajes Capital',
  contacto: 'Andrés Moros',
  cargo: 'Gerente General',
  sector: 'Agencia de Viajes · Hotelería · Turismo · Cali, Colombia',
  fundada: '2014',
  sede: 'Cali, Valle del Cauca',
  fecha: 'Mayo 2026',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
};

const STATS = [
  { valor: '25.000', label: 'Clientes en base de datos', icon: Database },
  { valor: '12 años', label: 'Trayectoria en el sector', icon: Calendar },
  { valor: '8–10', label: 'Travel Managers activos', icon: Users },
  { valor: '10', label: 'Tipos de producto en booking engine', icon: Plane },
];

const HALLAZGOS = [
  {
    area: 'Herramientas',
    score: 2,
    titulo: 'Plataformas operando como islas',
    desc: 'El booking engine, el CRM Viacap, el canal WapTrip y el gestor de redes funcionan sin conectarse entre sí. Cada asesor debe buscar datos en varios sistemas antes de poder atender un solo cliente.',
    accion: 'Integrar todo en una plataforma centralizada.',
    icon: Database,
    tint: 'red',
  },
  {
    area: 'Comunicación',
    score: 3,
    titulo: 'Routing manual sin seguimiento automático',
    desc: 'Meta PRO permite atención multiagente, pero la asignación de conversaciones es por orden de llegada. El Travel Manager que más rápido "agarre" atiende, independientemente de su carga. Los 25.000 clientes llevan tiempo sin recibir una campaña dirigida.',
    accion: 'Routing inteligente por carga + secuencias automáticas.',
    icon: MessageSquare,
    tint: 'amber',
  },
  {
    area: 'Proceso de venta',
    score: 3,
    titulo: 'Traspasos entre áreas dependientes de Andrés',
    desc: 'Cuando una consulta debe pasar de Reservas a Documentación o a Futurist, el traspaso requiere intervención manual. Sin un protocolo escrito, la calidad de atención varía según quién esté disponible.',
    accion: 'Protocolos documentados + reglas de enrutamiento automático.',
    icon: GitMerge,
    tint: 'blue',
  },
  {
    area: 'Indicadores',
    score: 2,
    titulo: 'Sin visibilidad sobre los números',
    desc: 'El CRM Viacap almacena datos pero no genera reportes accionables. No hay panel de KPIs: no se puede saber leads por canal, tasa de cierre por asesor ni ticket promedio por tipo de viaje.',
    accion: 'Dashboard semanal con 5 métricas clave.',
    icon: BarChart3,
    tint: 'red',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber: { text: 'text-amber-400', bg: 'rgba(251,191,36,.07)', border: 'rgba(251,191,36,.18)' },
  blue:  { text: 'text-[#60a5fa]', bg: 'rgba(96,165,250,.07)', border: 'rgba(96,165,250,.18)' },
  red:   { text: 'text-[#f87171]', bg: 'rgba(221,51,51,.07)',  border: 'rgba(221,51,51,.2)'  },
  teal:  { text: 'text-[#00bfa5]', bg: 'rgba(0,191,165,.07)',  border: 'rgba(0,191,165,.18)' },
};

const MODULOS = [
  {
    nombre: 'Sixteam Inbox · Plataforma Omnicanal',
    desc: 'Reemplaza el Meta PRO y el Hibot con una plataforma de chat center multiagente que conecta WapTrip (WhatsApp corporativo), Instagram, Facebook y web. Asignación automática por carga de trabajo entre Reservas, Documentación y Futurist — sin que nadie tenga que reasignar manualmente.',
    icon: Inbox,
    tipo: 'setup + mensual',
    items: [
      'Hasta 12 agentes simultáneos en un solo número',
      'Routing inteligente por carga y por departamento',
      'Historial completo del cliente visible en cada chat',
      'Transferencia automática entre Reservas, Docs y Futurist',
      'Conexión con Instagram, Facebook y formularios web',
      'Dashboard de conversaciones en tiempo real',
    ],
  },
  {
    nombre: 'CRM Comercial · Migración y Configuración',
    desc: 'Migración de los 25.000 registros de Viacap a un CRM operativo que conecta el historial del cliente con el canal de WhatsApp. Segmentación por preferencias de viaje (Caribe, Europa, naturaleza, wellness, aventura) para activar campañas dirigidas desde el primer día.',
    icon: Database,
    tipo: 'setup + mensual',
    items: [
      'Migración de base de datos Viacap (25.000 registros)',
      'Segmentación por tipo de viajero y preferencias',
      'Pipeline de ventas por departamento (Reservas, Futurist)',
      'Historial de viajes y documentos del viajero',
      'Alertas de vencimiento de pasaportes y visas',
      'Integración bidireccional con el canal de WhatsApp',
    ],
  },
  {
    nombre: 'Automatizaciones de Seguimiento',
    desc: 'El sistema hace el seguimiento que el asesor no tiene tiempo de hacer: recordatorios a las 24h, 3 días y 7 días para leads que no respondieron, y flujos de reactivación para la base de 25.000 clientes dormidos.',
    icon: RefreshCw,
    tipo: 'incluido en mensual',
    items: [
      'Secuencia automática 24h / 3d / 7d post-consulta',
      'Flujos de reactivación para base de clientes inactivos',
      'Recordatorios de vencimiento de documentos',
      'Notificaciones de seguimiento para Travel Managers',
      'Respuestas automáticas fuera de horario',
      'Encuesta de satisfacción post-viaje',
    ],
  },
  {
    nombre: 'Bot IA · Clasificación y Derivación de Leads',
    desc: 'Antes de que la consulta llegue al Travel Manager, un bot de IA identifica el tipo de solicitud (reserva, documentación, alojamiento Futurist, Promovacaciones Vive), adjunta el historial del cliente desde el CRM y lo enruta al área correcta. Reduce tiempos de respuesta y elimina traspasos innecesarios.',
    icon: Bot,
    tipo: 'setup único',
    items: [
      'Clasificación automática: Reservas / Docs / Futurist / Promovacaciones',
      'Adjunta historial del cliente al asesor al momento del traspaso',
      'Respuesta autónoma a preguntas frecuentes',
      'Disponible 24/7 en todos los canales del inbox',
      'Entrenado con el catálogo de Viajes Capital',
      'Mejora continua basada en patrones de conversación',
    ],
  },
  {
    nombre: 'Panel de KPIs · Dashboard Semanal',
    desc: 'Un tablero operativo con las 5 métricas que Andrés necesita revisar en 15 minutos cada semana: consultas por canal, tasa de cierre por asesor, ticket promedio, tiempo de respuesta y reactivaciones.',
    icon: LineChart,
    tipo: 'incluido en mensual',
    items: [
      'Leads recibidos vs. cerrados por canal y asesor',
      'Tiempo promedio de respuesta y de cierre',
      'Ticket promedio por tipo de viaje y destino',
      'Tasa de reactivación de base de clientes',
      'Revisión semanal de 15 min con el equipo Sixteam',
      'Exportable para presentar a socio o directivo',
    ],
  },
  {
    nombre: 'Campañas Masivas · Base de 25.000 Clientes',
    desc: 'Activación de la base dormida con envíos segmentados por WhatsApp y email. Caribe, Europa, naturaleza, wellness, aventura — cada cliente recibe la oferta que le interesa, no el mismo mensaje para todos.',
    icon: Share2,
    tipo: 'mensual',
    items: [
      'Envíos masivos WhatsApp (hasta 10.000/mes incluidos)',
      'Email Marketing (hasta 30.000 correos/mes incluidos)',
      'Segmentación por tipo de interés y historial de viaje',
      'Plantillas diseñadas para turismo y temporadas',
      'Reporte de apertura, respuesta y conversión',
      'Integración con campañas Promovacaciones Vive',
    ],
  },
  {
    nombre: 'Gestión de Pauta Meta Ads',
    desc: 'Administración estratégica de las campañas Meta enfocadas a WhatsApp (Click-to-WhatsApp), con estructura de embudo y optimización semanal. Incluye las campañas de Promovacaciones Vive y Futurist.',
    icon: TrendingUp,
    tipo: 'mensual · opcional',
    items: [
      'Campañas Click-to-WhatsApp optimizadas para turismo',
      'Estructura por embudo: reconocimiento, consideración, conversión',
      'Audiencias por perfil de viajero y remarketing de base',
      'Campañas específicas para Promovacaciones Vive',
      'Campañas para Futurist (alojamientos naturales)',
      'Reporte semanal de pauta y ROAS estimado',
    ],
  },
];

const FASES = [
  {
    num: '01',
    periodo: 'Semanas 1–2',
    titulo: 'Definir bases',
    color: ACCENT,
    items: [
      'Auditoría técnica del stack actual',
      'Mapeo del proceso de venta por departamento',
      'Definición de estructura del nuevo CRM',
      'Acuerdo sobre KPIs prioritarios a medir',
      'Kickoff con equipo Travel Managers',
    ],
    resultado: 'Viajes Capital y Sixteam alineados en herramienta, estructura y métricas antes de implementar.',
    icon: Compass,
  },
  {
    num: '02',
    periodo: 'Mes 1',
    titulo: 'Implementar',
    color: '#00bfa5',
    items: [
      'Plataforma omnicanal activa (WapTrip + redes)',
      'Migración de base de datos desde Viacap',
      'Routing automático por departamento activado',
      'Seguimientos automáticos 24h / 3d / 7d',
      'Capacitación del equipo por departamento',
    ],
    resultado: 'Operación centralizada en un solo sistema. 25.000 clientes accesibles. Asignación automática activa.',
    icon: Settings,
  },
  {
    num: '03',
    periodo: 'Mes 2',
    titulo: 'Optimizar',
    color: '#7c3aed',
    items: [
      'Bot IA activado y entrenado con catálogo',
      'Panel de KPIs semanal en funcionamiento',
      'Reglas finas de enrutamiento por especialidad',
      'Áreas operativa y administrativa integradas',
      'Primera campaña de reactivación de base',
    ],
    resultado: 'La operación diaria no requiere intervención de Andrés. El sistema se encarga de los flujos.',
    icon: Zap,
  },
  {
    num: '04',
    periodo: 'Mes 3',
    titulo: 'Crecer',
    color: '#f59e0b',
    items: [
      'Promovacaciones Vive con seguimiento integrado',
      'Campañas masivas segmentadas activas',
      'Futurist en la misma plataforma',
      'Alianza Puntos Colombia como canal de recompra',
      'Revisión trimestral y ajuste de estrategia',
    ],
    resultado: 'Viajes Capital: sistema ordenado, equipo autónomo, base de clientes activa generando negocio recurrente.',
    icon: TrendingUp,
  },
];

const INVERSION = [
  {
    tipo: 'Setup · Pago único',
    precio: 'COP 2.800.000',
    subtitulo: 'Una sola vez al iniciar',
    color: ACCENT,
    items: [
      'Configuración de la plataforma omnicanal',
      'Migración de los 25.000 registros del CRM Viacap',
      'Entrenamiento del bot IA con catálogo Viajes Capital',
      'Onboarding del equipo (Travel Managers + áreas)',
      'Documentación del proceso de venta por departamento',
      'Configuración de KPIs y panel de seguimiento',
    ],
    cta: 'Incluye 3 sesiones de 2h con el equipo',
  },
  {
    tipo: 'Plan Mensual · Operación',
    precio: 'COP 2.890.000/mes',
    subtitulo: 'Sin permanencia mínima tras el mes 1',
    color: '#00bfa5',
    items: [
      'Sixteam Inbox (hasta 12 agentes) + automatizaciones',
      'CRM operativo con historial y segmentación',
      'Campañas masivas WhatsApp (10.000/mes) + Email (30.000/mes)',
      'Panel de KPIs semanal + revisión mensual',
      'Soporte dedicado (10h/mes) con tiempo de respuesta garantizado',
      'Reportes mensuales de operación y resultados',
    ],
    cta: 'El equipo Sixteam opera el sistema mes a mes',
  },
  {
    tipo: 'Pauta Meta Ads · Opcional',
    precio: 'COP 1.170.000/mes',
    subtitulo: 'Presupuesto de pauta no incluido',
    color: '#f59e0b',
    items: [
      'Administración de campañas Click-to-WhatsApp',
      'Campañas Promovacaciones Vive y Futurist',
      'Audiencias segmentadas + remarketing de base',
      'Optimización semanal y reporte de ROAS',
      'Estructura de embudo completo ToF / MoF / BoF',
    ],
    cta: 'Presupuesto de pauta aparte (mínimo recomendado: COP 2.000.000/mes)',
  },
];

const DIFERENCIADORES = [
  {
    titulo: 'Ya conocemos su operación',
    desc: 'El diagnóstico no es un punto de partida genérico: llegamos con el mapa de su operación ya trazado. Sabemos qué plataformas tienen, dónde se pierde el lead y qué fases son prioritarias.',
    icon: Compass,
  },
  {
    titulo: 'No instalamos — operamos',
    desc: 'No entregamos un acceso y un tutorial. El equipo Sixteam configura, opera y mantiene el sistema mes a mes. Pauta activa, bot respondiendo, pipeline limpio, reportes listos.',
    icon: Zap,
  },
  {
    titulo: 'Un número que ya existe, no hay que cambiar',
    desc: 'El WapTrip que Viajes Capital ha posicionado por 10 años sigue siendo el número de contacto. La plataforma se monta sobre él — sin cambiar lo que sus clientes ya conocen.',
    icon: Phone,
  },
  {
    titulo: 'Routing que antes tenían con Hibot',
    desc: 'La asignación inteligente por carga de trabajo que dejaron de tener cuando salieron de Hibot: la recuperamos. Nuestro sistema asigna por latencia igual — sin depender de quien "agarre primero".',
    icon: GitMerge,
  },
  {
    titulo: 'Experiencia real en turismo colombiano',
    desc: 'Trabajamos con agencias afiliadas a ANATO. Conocemos el ciclo del viajero, los paquetes, las temporadas y los procesos de documentación — no llegamos a aprender desde cero.',
    icon: Plane,
  },
  {
    titulo: 'La base de 25.000 clientes comienza a trabajar',
    desc: 'Es el activo más subestimado de Viajes Capital. Segmentada y activada correctamente, esa base puede generar demanda sin depender exclusivamente de pauta pagada.',
    icon: Database,
  },
];

const PROXIMOS = [
  { num: '01', titulo: 'Aprobación de la propuesta', desc: 'Confirmación de Andrés Moros y firma del acuerdo de servicios con Sixteam.pro.', icon: CheckCircle },
  { num: '02', titulo: 'Pago del setup inicial', desc: 'COP 2.800.000 que activa la implementación y el acceso a la plataforma.', icon: FileText },
  { num: '03', titulo: 'Kickoff técnico', desc: 'Reunión de inicio con el equipo Travel Managers para mapear el proceso de venta y definir la estructura del CRM.', icon: Users },
  { num: '04', titulo: 'Implementación semana 1–2', desc: 'Sixteam configura la plataforma, migra la base de datos y activa el routing automático.', icon: Settings },
  { num: '05', titulo: 'Plataforma en vivo', desc: 'Mes 1 operando: todos los canales centralizados, seguimientos automáticos activos y equipo capacitado.', icon: Zap },
];

const SECCIONES = [
  { id: 'contexto',       label: 'Contexto'           },
  { id: 'diagnostico',    label: 'Diagnóstico'        },
  { id: 'propuesta',      label: 'La propuesta'       },
  { id: 'modulos',        label: 'Módulos'            },
  { id: 'plan',           label: 'Plan de trabajo'    },
  { id: 'inversion',      label: 'Inversión'          },
  { id: 'porquesixteam',  label: 'Por qué Sixteam'   },
  { id: 'proximos',       label: 'Próximos pasos'     },
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

const ScoreDots = ({ score }: { score: number }) => (
  <div className="flex gap-1 mt-2">
    {[1,2,3,4,5].map(i => (
      <div key={i} className="w-2 h-2 rounded-full" style={{
        background: i <= score
          ? (score <= 2 ? '#f87171' : score === 3 ? '#fbbf24' : '#00bfa5')
          : 'rgba(255,255,255,0.12)',
      }} />
    ))}
    <span className="text-[11px] font-lato ml-1" style={{
      color: score <= 2 ? '#f87171' : score === 3 ? '#fbbf24' : '#00bfa5',
    }}>{score}/5</span>
  </div>
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const ViajesCapitalProposal = () => {
  const [activeSection, setActiveSection] = useState('contexto');
  const [moduloActivo, setModuloActivo] = useState<number | null>(null);
  const [faseActiva, setFaseActiva] = useState<number | null>(null);

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
  const s7 = useVisible(); const s8 = useVisible();

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
            <div className={`rounded-full flex-shrink-0 transition-all duration-300 ${activeSection === s.id ? 'w-2 h-2 shadow-[0_0_6px_rgba(14,165,233,.7)]' : 'w-1.5 h-1.5 bg-white/50'}`}
              style={{ background: activeSection === s.id ? ACCENT : undefined }} />
          </button>
        ))}
      </nav>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=Lato:wght@300;400;500;700&display=swap');
        .font-poppins { font-family: 'Poppins', sans-serif; }
        .font-lato    { font-family: 'Lato', sans-serif; }
        @keyframes fade-up   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fade-in   { from { opacity:0; } to { opacity:1; } }
        @keyframes vc-pulse  { 0%,100% { opacity:.06; transform:scale(1); } 50% { opacity:.14; transform:scale(1.12); } }
        @keyframes vc-spin   { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes vc-spin-r { from { transform:rotate(0deg); } to { transform:rotate(-360deg); } }
        .vc-pulse { animation: vc-pulse 4.5s ease-in-out infinite; }
        .vc-spin  { animation: vc-spin  24s linear infinite; }
        .vc-spin-r{ animation: vc-spin-r 18s linear infinite; }
        .fade-up  { animation: fade-up  .65s cubic-bezier(.22,1,.36,1) forwards; }
        .fade-in  { animation: fade-in  .5s ease forwards; }
        @media print { .no-print { display:none !important; } }
      `}</style>

      {/* ══════════════════════════════════════ PORTADA */}
      <header className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: `linear-gradient(135deg, #030d1a 0%, #041524 55%, #061a2e 100%)` }}>

        {/* Decoraciones */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full vc-pulse"
            style={{ background: `radial-gradient(circle, ${ACCENT}11 0%, transparent 65%)` }} />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full"
            style={{ background: `radial-gradient(circle, ${ACCENT2}0a 0%, transparent 70%)`, transform: 'translate(-20%,20%)' }} />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.022]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.35) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
          {/* Rings */}
          <div className="absolute top-1/2 right-[18%] -translate-y-1/2 vc-spin"
            style={{ width: 420, height: 420, border: `1px solid ${ACCENT}15`, borderRadius: '50%' }} />
          <div className="absolute top-1/2 right-[18%] -translate-y-1/2 vc-spin-r"
            style={{ width: 300, height: 300, border: `1px solid ${ACCENT}20`, borderRadius: '50%', top:'calc(50% - 60px)' }} />
        </div>

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-b" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-white">
              <img src="https://raw.githubusercontent.com/Sixteam-pro/branding/main/logo/sixteam-icon.png"
                alt="Sixteam.pro" className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <div>
              <span className="font-poppins font-black text-white text-xl tracking-tight">Sixteam<span style={{ color: ACCENT }}>.</span>pro</span>
              <p className="font-lato text-white/35 text-[13px] leading-none mt-0.5">Innovación y Estrategia Digital</p>
            </div>
          </div>
          <span className="font-lato text-[13px] uppercase tracking-[0.2em] border rounded-full px-3 py-1.5"
            style={{ color: `${ACCENT}cc`, borderColor: `${ACCENT}25` }}>
            Confidencial · {META.fecha}
          </span>
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-12 px-6 md:px-16">
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[58%_42%] gap-10 lg:gap-14 items-center">

            <div className="flex flex-col justify-center">
              <div className="fade-in" style={{ animationDelay: '.1s', opacity: 0 }}>
                <TagLabel>Propuesta comercial · Sistema operativo digital</TagLabel>
              </div>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2 fade-in" style={{ animationDelay: '.2s', opacity: 0 }}>
                <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})` }}>
                  <Plane className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: `${ACCENT}15`, border: `1px solid ${ACCENT}30`, color: ACCENT }}>
                  Turismo · Cali
                </span>
              </div>

              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4 fade-up" style={{ fontSize: 'clamp(2.5rem, 6.5vw, 4.2rem)', animationDelay: '.3s', opacity: 0 }}>
                Conectar lo<br />
                <span style={{ color: ACCENT }}>que ya existe.</span>
              </h1>

              <p className="font-lato text-white/55 leading-relaxed mb-8 max-w-xl fade-up" style={{ fontSize: 'clamp(1rem,1.6vw,1.15rem)', animationDelay: '.45s', opacity: 0 }}>
                Viajes Capital tiene el motor de reservas, los clientes, el canal de WhatsApp y el equipo.<br />
                <span style={{ color: ACCENT }}>Le falta que todo eso funcione como un solo sistema.</span><br />
                Eso es exactamente lo que Sixteam viene a hacer.
              </p>

              <div className="flex flex-wrap gap-3 fade-up" style={{ animationDelay: '.6s', opacity: 0 }}>
                <button onClick={() => scrollTo('inversion')}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-poppins font-semibold text-white text-[15px] transition-all duration-300 hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`, boxShadow: `0 8px 24px ${ACCENT}35` }}>
                  Ver propuesta <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => scrollTo('diagnostico')}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-poppins font-semibold text-white/70 text-[15px] border border-white/10 transition-all duration-300 hover:border-white/20 hover:text-white/90">
                  Ver diagnóstico <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-10 pt-8 border-t border-white/07 flex flex-wrap gap-6 fade-in" style={{ animationDelay: '.75s', opacity: 0 }}>
                {[
                  { label: 'Preparado para', val: `${META.contacto} · ${META.cargo}` },
                  { label: 'Fecha', val: META.fecha },
                  { label: 'Proponente', val: 'Sixteam.pro · NIT 901.967.849-4' },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <p className="font-lato text-white/30 text-[12px] uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="font-lato text-white/70 text-[14px] font-medium">{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-4 fade-up" style={{ animationDelay: '.5s', opacity: 0 }}>
              {STATS.map(({ valor, label, icon: Icon }) => (
                <div key={label} className="rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', backdropFilter: 'blur(8px)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${ACCENT}15`, border: `1px solid ${ACCENT}25` }}>
                    <Icon className="w-4.5 h-4.5" style={{ color: ACCENT }} />
                  </div>
                  <div>
                    <p className="font-poppins font-black text-white text-[1.75rem] leading-tight">{valor}</p>
                    <p className="font-lato text-white/45 text-[13px] leading-snug mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 flex justify-center pb-8 no-print">
          <button onClick={() => scrollTo('contexto')} className="flex flex-col items-center gap-2 text-white/25 hover:text-white/50 transition-colors">
            <span className="font-lato text-[12px] uppercase tracking-widest">Continuar</span>
            <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,.2), transparent)' }} />
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════ CONTEXTO */}
      <section id="contexto" ref={s1.ref as React.RefObject<HTMLElement>} className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
        <div className={`transition-all duration-700 ${s1.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>El punto de partida</TagLabel>
          <SectionTitle>Viajes Capital tiene<br /><span style={{ color: ACCENT }}>más de lo que la mayoría de agencias puede mostrar.</span></SectionTitle>
          <Rule />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="rounded-2xl p-7" style={{ background: 'rgba(14,165,233,.06)', border: `1px solid ${ACCENT}20` }}>
              <p className="font-lato text-[#00bfa5] text-[13px] uppercase tracking-wider mb-3 font-medium">Tu mayor fortaleza</p>
              <p className="font-lato text-white/80 leading-relaxed text-[16px]">
                Motor de reservas propio con <strong className="text-white">10 tipos de producto</strong>, canal WapTrip activo con <strong className="text-white">8–10 Travel Managers</strong>, certificación SGS, 12 años de trayectoria y <strong className="text-white">25.000 clientes en base de datos.</strong> Son activos reales que pocas agencias en Colombia han logrado construir.
              </p>
            </div>
            <div className="rounded-2xl p-7" style={{ background: 'rgba(14,165,233,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
              <p className="font-lato text-amber-400 text-[13px] uppercase tracking-wider mb-3 font-medium">Tu mayor oportunidad</p>
              <p className="font-lato text-white/80 leading-relaxed text-[16px]">
                El motor de reservas, el canal WapTrip, el CRM Viacap y las redes sociales <strong className="text-white">funcionan por separado.</strong> Conectarlos en un flujo unificado con asignación inteligente es el paso que puede transformar la capacidad operativa de la agencia.
              </p>
            </div>
          </div>

          {/* Diagrama de silos */}
          <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.06)' }}>
            <p className="font-lato text-white/40 text-[13px] uppercase tracking-wider mb-6 font-medium">Estado actual · Plataformas sin conexión</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Booking Engine', sub: 'Motor propio · 10 productos', icon: Globe },
                { label: 'WapTrip (Meta PRO)', sub: '8–10 agentes · sin routing', icon: MessageSquare },
                { label: 'CRM Viacap', sub: 'Base de datos · sin integrar', icon: Database },
                { label: 'Redes Sociales', sub: '4 canales · sin centralizar', icon: Share2 },
              ].map(({ label, sub, icon: Icon }) => (
                <div key={label} className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(248,113,113,.12)', border: '1px solid rgba(248,113,113,.2)' }}>
                    <Icon className="w-5 h-5 text-[#f87171]" />
                  </div>
                  <p className="font-poppins font-bold text-white text-[14px] leading-tight">{label}</p>
                  <p className="font-lato text-white/40 text-[12px] mt-1 leading-snug">{sub}</p>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-3 rounded-xl p-4" style={{ background: 'rgba(251,191,36,.06)', border: '1px solid rgba(251,191,36,.15)' }}>
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="font-lato text-white/70 text-[14px] leading-relaxed">
                Cada asesor busca datos del cliente en varios sistemas antes de poder atender una sola consulta. El que "agarre primero" atiende, sin importar su carga. Las 25.000 clientes llevan tiempo sin recibir ninguna comunicación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ DIAGNÓSTICO */}
      <section id="diagnostico" ref={s2.ref as React.RefObject<HTMLElement>} className="py-24 px-6 md:px-16" style={{ background: 'rgba(255,255,255,.015)' }}>
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <TagLabel>Diagnóstico de madurez · Mayo 2026</TagLabel>
            <SectionTitle>Las 4 brechas<br /><span style={{ color: ACCENT }}>que limitan el crecimiento ordenado.</span></SectionTitle>
            <Rule />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {HALLAZGOS.map((h) => {
                const T = TINT[h.tint];
                return (
                  <div key={h.titulo} className="rounded-2xl p-7 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.01]"
                    style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                          <h.icon className={`w-4.5 h-4.5 ${T.text}`} />
                        </div>
                        <div>
                          <p className={`font-lato text-[12px] uppercase tracking-wider mb-1 font-medium ${T.text}`}>{h.area}</p>
                          <h3 className="font-poppins font-bold text-white text-[18px] leading-tight">{h.titulo}</h3>
                          <ScoreDots score={h.score} />
                        </div>
                      </div>
                    </div>
                    <p className="font-lato text-white/65 text-[15px] leading-relaxed">{h.desc}</p>
                    <div className="flex items-start gap-2 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                      <ChevronRight className="w-4 h-4 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                      <p className="font-lato text-[#00bfa5] text-[14px] font-medium">{h.accion}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ LA PROPUESTA */}
      <section id="propuesta" ref={s3.ref as React.RefObject<HTMLElement>} className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
        <div className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Lo que Sixteam propone</TagLabel>
          <SectionTitle>Un sistema operativo digital<br /><span style={{ color: ACCENT }}>construido sobre lo que ya tienen.</span></SectionTitle>
          <Rule />

          <p className="font-lato text-white/60 text-[17px] leading-relaxed max-w-3xl mb-12">
            No vamos a reemplazar lo que funciona. Vamos a conectarlo. El WapTrip sigue siendo el número de contacto. El booking engine sigue operando. Los Travel Managers siguen atendiendo. Lo que cambia es que todo eso va a trabajar junto, de forma automática, con visibilidad total.
          </p>

          {/* Visión del sistema */}
          <div className="rounded-2xl p-8 mb-10" style={{ background: `linear-gradient(135deg, ${ACCENT}08, ${ACCENT2}05)`, border: `1px solid ${ACCENT}18` }}>
            <p className="font-lato text-[#00bfa5] text-[13px] uppercase tracking-wider mb-6 font-medium">El sistema conectado que proponemos</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  fase: 'Entrada',
                  color: ACCENT,
                  items: ['Meta Ads → WapTrip', 'Instagram / Facebook → Inbox', 'Formularios web → CRM'],
                  desc: 'Todo lead entra a un solo lugar',
                },
                {
                  fase: 'Operación',
                  color: '#00bfa5',
                  items: ['Bot IA clasifica y deriva', 'Routing por carga automática', 'CRM con historial visible'],
                  desc: 'El sistema asigna sin intervención',
                },
                {
                  fase: 'Crecimiento',
                  color: '#f59e0b',
                  items: ['Seguimientos 24h / 3d / 7d', 'Campañas a 25.000 clientes', 'KPIs semanales para Andrés'],
                  desc: 'La base trabaja para generar recompra',
                },
              ].map(({ fase, color, items, desc }) => (
                <div key={fase} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                    <p className="font-poppins font-bold text-white text-[16px]">{fase}</p>
                  </div>
                  <ul className="flex flex-col gap-2 mb-3">
                    {items.map(i => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
                        <span className="font-lato text-white/70 text-[14px]">{i}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="font-lato text-[13px] italic" style={{ color: `${color}90` }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { num: '01', titulo: 'Plataforma omnicanal', desc: 'WapTrip + redes + web en un solo inbox con routing inteligente.', icon: Inbox },
              { num: '02', titulo: 'CRM + 25.000 clientes', desc: 'Migración y activación de la base con segmentación por tipo de viajero.', icon: Database },
              { num: '03', titulo: 'Sistema autónomo', desc: 'Bot IA, seguimientos automáticos y KPIs sin depender de Andrés para cada decisión.', icon: Bot },
            ].map(({ num, titulo, desc, icon: Icon }) => (
              <div key={num} className="rounded-2xl p-6 flex flex-col gap-3"
                style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                <div className="flex items-center gap-3">
                  <span className="font-poppins font-black text-[#00bfa5] text-[13px] opacity-60">{num}</span>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}22` }}>
                    <Icon className="w-4.5 h-4.5" style={{ color: ACCENT }} />
                  </div>
                </div>
                <p className="font-poppins font-bold text-white text-[17px]">{titulo}</p>
                <p className="font-lato text-white/55 text-[14px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ MÓDULOS */}
      <section id="modulos" ref={s4.ref as React.RefObject<HTMLElement>} className="py-24 px-6 md:px-16" style={{ background: 'rgba(255,255,255,.015)' }}>
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <TagLabel>Qué incluye el sistema</TagLabel>
            <SectionTitle>Módulos del sistema operativo<br /><span style={{ color: ACCENT }}>diseñados para Viajes Capital.</span></SectionTitle>
            <Rule />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {MODULOS.map((m, i) => {
                const isOpen = moduloActivo === i;
                return (
                  <div key={m.nombre} className="rounded-2xl overflow-hidden transition-all duration-300"
                    style={{
                      background: isOpen ? `${ACCENT}08` : 'rgba(255,255,255,.03)',
                      border: `1px solid ${isOpen ? `${ACCENT}25` : 'rgba(255,255,255,.06)'}`,
                    }}>
                    <button className="w-full p-6 text-left flex items-start gap-4"
                      onClick={() => setModuloActivo(isOpen ? null : i)}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}22` }}>
                        <m.icon className="w-5 h-5" style={{ color: ACCENT }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-poppins font-bold text-white text-[16px] leading-tight">{m.nombre}</p>
                            <span className="font-lato text-[11px] uppercase tracking-wider mt-1 inline-block px-2 py-0.5 rounded-full"
                              style={{
                                background: m.tipo.includes('opcional') ? 'rgba(245,158,11,.1)' : `${ACCENT}10`,
                                color: m.tipo.includes('opcional') ? '#f59e0b' : ACCENT,
                                border: `1px solid ${m.tipo.includes('opcional') ? 'rgba(245,158,11,.2)' : `${ACCENT}20`}`,
                              }}>
                              {m.tipo}
                            </span>
                          </div>
                          <ChevronRight className={`w-5 h-5 text-white/30 flex-shrink-0 mt-1 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
                        </div>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6">
                        <p className="font-lato text-white/65 text-[15px] leading-relaxed mb-4 border-t border-white/06 pt-4">{m.desc}</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {m.items.map(item => (
                            <li key={item} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                              <span className="font-lato text-white/70 text-[14px] leading-snug">{item}</span>
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
        </div>
      </section>

      {/* ══════════════════════════════════════ PLAN DE TRABAJO */}
      <section id="plan" ref={s5.ref as React.RefObject<HTMLElement>} className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
        <div className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Hoja de ruta · 3 meses</TagLabel>
          <SectionTitle>Plan de implementación<br /><span style={{ color: ACCENT }}>por fases de impacto.</span></SectionTitle>
          <Rule />

          <div className="flex flex-col gap-5">
            {FASES.map((f, i) => {
              const isOpen = faseActiva === i;
              return (
                <div key={f.titulo} className="rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    background: isOpen ? `${f.color}08` : 'rgba(255,255,255,.03)',
                    border: `1px solid ${isOpen ? `${f.color}30` : 'rgba(255,255,255,.06)'}`,
                  }}>
                  <button className="w-full p-6 text-left flex items-center gap-5"
                    onClick={() => setFaseActiva(isOpen ? null : i)}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                      <f.icon className="w-5.5 h-5.5" style={{ color: f.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-poppins font-black text-[13px]" style={{ color: f.color }}>{f.num}</span>
                        <span className="font-lato text-[12px] uppercase tracking-wider px-2 py-0.5 rounded-full border"
                          style={{ color: `${f.color}cc`, borderColor: `${f.color}30`, background: `${f.color}0a` }}>
                          {f.periodo}
                        </span>
                        <h3 className="font-poppins font-bold text-white text-[20px]">{f.titulo}</h3>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-white/30 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
                      <ul className="flex flex-col gap-3">
                        {f.items.map(item => (
                          <li key={item} className="flex items-start gap-2.5">
                            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ background: `${f.color}20`, border: `1px solid ${f.color}40` }}>
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: f.color }} />
                            </div>
                            <span className="font-lato text-white/70 text-[15px] leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="rounded-xl p-5 flex flex-col justify-center max-w-xs" style={{ background: `${f.color}08`, border: `1px solid ${f.color}20` }}>
                        <p className="font-lato text-[12px] uppercase tracking-wider mb-2" style={{ color: `${f.color}90` }}>Resultado al final</p>
                        <p className="font-lato text-white/80 text-[14px] leading-relaxed">{f.resultado}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ INVERSIÓN */}
      <section id="inversion" ref={s6.ref as React.RefObject<HTMLElement>} className="py-24 px-6 md:px-16" style={{ background: 'rgba(255,255,255,.015)' }}>
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <TagLabel>Inversión</TagLabel>
            <SectionTitle>Qué cuesta y<br /><span style={{ color: ACCENT }}>qué incluye cada peso.</span></SectionTitle>
            <Rule />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {INVERSION.map((inv) => (
                <div key={inv.tipo} className="rounded-2xl p-7 flex flex-col gap-5 transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: `${inv.color}06`, border: `1px solid ${inv.color}22` }}>
                  <div>
                    <p className="font-lato text-[13px] uppercase tracking-wider mb-2 font-medium" style={{ color: `${inv.color}cc` }}>{inv.tipo}</p>
                    <p className="font-poppins font-black text-white" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>{inv.precio}</p>
                    <p className="font-lato text-white/40 text-[13px] mt-1">{inv.subtitulo}</p>
                  </div>
                  <ul className="flex flex-col gap-2.5 flex-1">
                    {inv.items.map(item => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: inv.color }} />
                        <span className="font-lato text-white/65 text-[14px] leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t" style={{ borderColor: `${inv.color}15` }}>
                    <p className="font-lato text-[13px] italic" style={{ color: `${inv.color}80` }}>{inv.cta}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div className="rounded-2xl p-7" style={{ background: `${ACCENT}06`, border: `1px solid ${ACCENT}20` }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="font-lato text-white/40 text-[13px] uppercase tracking-wider mb-1">Setup (una sola vez)</p>
                  <p className="font-poppins font-black text-white text-[1.6rem]">COP 2.800.000</p>
                </div>
                <div>
                  <p className="font-lato text-white/40 text-[13px] uppercase tracking-wider mb-1">Plan mensual (operación)</p>
                  <p className="font-poppins font-black text-white text-[1.6rem]">COP 2.890.000<span className="text-white/40 text-[1rem] font-normal">/mes</span></p>
                </div>
                <div>
                  <p className="font-lato text-white/40 text-[13px] uppercase tracking-wider mb-1">Pauta Meta (opcional)</p>
                  <p className="font-poppins font-black text-white text-[1.6rem]">COP 1.170.000<span className="text-white/40 text-[1rem] font-normal">/mes</span></p>
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-white/06 flex flex-wrap gap-4">
                {[
                  'Sin permanencia mínima tras el mes 1',
                  'Precio fijo · sin costos ocultos',
                  'El presupuesto de pauta es aparte del fee de gestión',
                  'Ajuste ANATO disponible por ser afiliado',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5]" />
                    <span className="font-lato text-white/55 text-[13px]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ POR QUÉ SIXTEAM */}
      <section id="porquesixteam" ref={s7.ref as React.RefObject<HTMLElement>} className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
        <div className={`transition-all duration-700 ${s7.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Por qué Sixteam</TagLabel>
          <SectionTitle>No somos otro proveedor de tecnología.<br /><span style={{ color: ACCENT }}>Somos el equipo digital que Viajes Capital necesita.</span></SectionTitle>
          <Rule />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DIFERENCIADORES.map(({ titulo, desc, icon: Icon }) => (
              <div key={titulo} className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02]"
                style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}22` }}>
                  <Icon className="w-5 h-5" style={{ color: ACCENT }} />
                </div>
                <div>
                  <p className="font-poppins font-bold text-white text-[16px] leading-tight mb-2">{titulo}</p>
                  <p className="font-lato text-white/55 text-[14px] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Fórmula */}
          <div className="mt-12 rounded-2xl p-8 text-center" style={{ background: `linear-gradient(135deg, ${ACCENT}06, #00bfa508)`, border: `1px solid ${ACCENT}15` }}>
            <p className="font-poppins font-black text-white/85 text-[1.1rem] tracking-widest uppercase">
              Procesos + Tecnología + Personas = <span style={{ color: ACCENT }}>Crecimiento</span>
            </p>
            <p className="font-lato text-white/40 text-[14px] mt-3">La fórmula que Sixteam.pro aplica en cada proyecto.</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ PRÓXIMOS PASOS */}
      <section id="proximos" ref={s8.ref as React.RefObject<HTMLElement>} className="py-24 px-6 md:px-16" style={{ background: 'rgba(255,255,255,.015)' }}>
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-700 ${s8.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <TagLabel>Lo que sigue</TagLabel>
            <SectionTitle>Próximos pasos<br /><span style={{ color: ACCENT }}>para empezar esta semana.</span></SectionTitle>
            <Rule />

            <div className="flex flex-col gap-4 mb-12">
              {PROXIMOS.map((p, i) => (
                <div key={p.num} className="flex items-start gap-5 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01]"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}25` }}>
                      <p.icon className="w-4.5 h-4.5" style={{ color: ACCENT }} />
                    </div>
                    {i < PROXIMOS.length - 1 && (
                      <div className="w-px flex-1 min-h-[20px]" style={{ background: `linear-gradient(to bottom, ${ACCENT}30, transparent)` }} />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-poppins font-black text-[13px]" style={{ color: ACCENT }}>{p.num}</span>
                      <p className="font-poppins font-bold text-white text-[17px]">{p.titulo}</p>
                    </div>
                    <p className="font-lato text-white/55 text-[15px] leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA final */}
            <div className="rounded-2xl p-10 text-center" style={{ background: `linear-gradient(135deg, ${ACCENT}10, ${ACCENT2}08)`, border: `1px solid ${ACCENT}22` }}>
              <p className="font-lato text-[#00bfa5] text-[13px] uppercase tracking-wider mb-3 font-medium">¿Listo para empezar?</p>
              <h3 className="font-poppins font-black text-white mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
                Viajes Capital tiene todo para dar<br />el siguiente paso.
              </h3>
              <p className="font-lato text-white/55 text-[16px] leading-relaxed max-w-xl mx-auto mb-8">
                Con 25.000 clientes, un motor de reservas propio y 12 años de trayectoria, solo falta conectarlo todo en un sistema que trabaje mientras el equipo vende.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a href="mailto:alpha@sixteam.pro"
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-poppins font-semibold text-white text-[15px] transition-all duration-300 hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`, boxShadow: `0 8px 28px ${ACCENT}35` }}>
                  <Mail className="w-4 h-4" />
                  Aprobar propuesta · alpha@sixteam.pro
                </a>
                <a href="https://wa.me/573004507102"
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-poppins font-semibold text-white/70 text-[15px] border border-white/10 transition-all duration-300 hover:border-white/20 hover:text-white/90">
                  <Phone className="w-4 h-4" />
                  WhatsApp directo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ FOOTER */}
      <footer className="py-10 px-6 md:px-16 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center bg-white">
              <img src="https://raw.githubusercontent.com/Sixteam-pro/branding/main/logo/sixteam-icon.png"
                alt="Sixteam.pro" className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <span className="font-poppins font-black text-white text-[17px] tracking-tight">Sixteam<span style={{ color: ACCENT }}>.</span>pro</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            {[
              { label: 'NIT', val: '901.967.849-4' },
              { label: 'Contacto', val: 'alpha@sixteam.pro' },
              { label: 'RL', val: 'Samuel Armando Burgos Ferrer' },
            ].map(({ label, val }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="font-lato text-white/25 text-[12px]">{label}:</span>
                <span className="font-lato text-white/50 text-[12px]">{val}</span>
              </div>
            ))}
          </div>
          <p className="font-lato text-white/20 text-[12px]">Documento confidencial · {META.fecha}</p>
        </div>
      </footer>

    </div>
  );
};

export default ViajesCapitalProposal;
