import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap, BarChart3,
  AlertCircle, TrendingUp, ArrowRight,
  Calendar, Info, MapPin,
  Wifi, Settings, Users, LayoutDashboard,
  GitBranch, SlidersHorizontal, GraduationCap, Layers, Rocket,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Conecty',
  tagline: 'Conectando al Viajero',
  sector: 'Telecomunicaciones · SIM & eSIM para viajeros',
  fundada: '2013',
  sede: 'Colombia · Latinoamérica',
  distribuidores: '1.172 distribuidores B2B',
  viajeros: '10.000 – 11.000 viajeros/mes',
  fecha: 'Mayo 2026',
  lugar: 'Colombia',
  herramienta: 'HubSpot CRM',
  usuarios: 12,
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  objetivo: 'Implementación de CRM para centralizar y escalar el canal B2B',
};

const CONECTY_BLUE = '#0ea5e9';
const TOTAL = 'COP 8.500.000';

const HALLAZGOS = [
  {
    titulo: 'Gestión manual y dispersa',
    desc: 'El canal B2B opera en Excel, Google Forms y WhatsApp sin centralización. No existe un único lugar donde ver el estado de los 1.172 distribuidores, sus rutas, visitas y seguimientos.',
    icon: AlertCircle, tint: 'red',
  },
  {
    titulo: 'Procesos sin documentar ni estandarizar',
    desc: 'Los tres frentes (Desarrollo, Sostenimiento, Operación) operan sin flujos definidos. Cada asesor gestiona su proceso de forma independiente, limitando la escalabilidad y el control gerencial.',
    icon: FileText, tint: 'amber',
  },
  {
    titulo: 'Ciclo de vida del distribuidor invisible',
    desc: 'El foco está en la primera venta. No hay herramientas para medir ventas acumuladas, recompra, potenciación ni reactivación, de modo que el verdadero valor del canal queda fuera del radar.',
    icon: TrendingUp, tint: 'blue',
  },
  {
    titulo: 'Ecosistema tecnológico fragmentado',
    desc: 'Panel (ERP propio) y operaciones de cartera operan en silos. Órdenes y comunicaciones requieren procesos manuales y generan pérdida de trazabilidad comercial.',
    icon: BarChart3, tint: 'teal',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber: { text: 'text-amber-400',       bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)' },
  teal:  { text: 'text-[#00bfa5]',       bg: 'rgba(0,191,165,.07)',   border: 'rgba(0,191,165,.18)' },
  blue:  { text: 'text-[#0ea5e9]',       bg: 'rgba(14,165,233,.07)',  border: 'rgba(14,165,233,.18)' },
  red:   { text: 'text-[#f87171]',       bg: 'rgba(221,51,51,.07)',   border: 'rgba(221,51,51,.2)' },
};

// ─── ETAPAS ──────────────────────────────────────────────────────────────────

type Actividad = { text: string; tag?: string };

const ETAPAS = [
  {
    num: '01',
    nombre: 'Contexto y Planificación',
    duracion: '1 semana · hasta semana 1',
    icon: FileText,
    color: CONECTY_BLUE,
    colorAlpha: 'rgba(14,165,233,.12)',
    colorBorder: 'rgba(14,165,233,.3)',
    descripcion: 'Gracias al material de insumo entregado por el equipo de Conecty, específicamente el mapeo de flujos comerciales B2B de sus procesos, esta etapa se reduce significativamente. Ya tenemos claridad sobre qué implementar. Nos sentamos a validar ese material, alinear el alcance técnico y diseñar el plan de acción.',
    actividades: [
      { text: '2 horas de sesión de validación con el equipo de Conecty para revisar el mapeo de flujos comerciales B2B entregado y definir el alcance de implementación', tag: 'Trabajo en conjunto' },
      { text: 'Diseño de arquitectura de implementación: modelo de datos (objetos, propiedades y relaciones), automatizaciones generales, fidelización, reglas de equipos y detalle de módulos a implementar' },
      { text: 'Diseño de plan de implementación' },
    ] as Actividad[],
  },
  {
    num: '02',
    nombre: 'Implementación CRM',
    duracion: '3 semanas · hasta semana 4',
    icon: Settings,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.3)',
    descripcion: 'Con el diseño de arquitectura aprobado, se ejecuta la implementación completa del CRM: desde la configuración de usuarios hasta los dashboards gerenciales, pasando por pipelines, automatizaciones y fidelización.',
    actividades: [
      { text: 'Configuración de cuenta, 12 usuarios, 4 equipos (Desarrollo, Sostenimiento, Operación, Masters) y permisos diferenciados por rol' },
      { text: 'Creación de hasta 2 pipelines de ventas: Adquisición (Desarrollo + Operación) y un pipeline adicional según necesidad del equipo' },
      { text: 'Configuración de hasta 10 propiedades personalizadas por objeto (contactos, empresas, negocios, órdenes)' },
      { text: 'Vistas de índice y de registro personalizadas por objeto y por equipo' },
      { text: 'Hasta 15 automatizaciones sobre los flujos clave: asignación de leads, alertas sin contacto, envío automático de información, recordatorios, alertas por estancamiento, detección de riesgo y tareas recurrentes' },
      { text: '1 dashboard principal y hasta 10 informes personalizados (productividad, embudo, presupuesto mensual, conversión por etapa)' },
      { text: 'Validaciones semanales con el equipo de Conecty durante toda la etapa' },
    ] as Actividad[],
  },
  {
    num: '03',
    nombre: 'Capacitaciones',
    duracion: '1–2 semanas · hasta semana 5',
    icon: GraduationCap,
    color: '#34d399',
    colorAlpha: 'rgba(52,211,153,.10)',
    colorBorder: 'rgba(52,211,153,.3)',
    descripcion: 'En paralelo con el cierre de la implementación, se capacita a cada equipo en el uso del CRM según su rol. Las sesiones se realizan a medida que los módulos quedan listos, garantizando adopción progresiva desde el día uno.',
    actividades: [
      { text: '2 sesiones generales de capacitación sobre la plataforma y las configuraciones realizadas' },
      { text: '2 sesiones de capacitación para el equipo comercial: uso de pipelines, registro de visitas, tareas y seguimiento' },
      { text: '2 sesiones de capacitación para el equipo de operación: gestión de órdenes, contactos, empresas y bandeja de seguimiento' },
      { text: '1 sesión de capacitación para gerencia: lectura de dashboards, informes de productividad y exportación de reportes' },
      { text: 'Documentación completa del modelo implementado (guías de uso por rol, flujos configurados, glosario del CRM)' },
      { text: 'Entrega de grabaciones de sesiones' },
    ] as Actividad[],
  },
  {
    num: '04',
    nombre: 'Salida a Producción',
    duracion: '1 semana · hasta semana 6',
    icon: Rocket,
    color: '#f59e0b',
    colorAlpha: 'rgba(245,158,11,.10)',
    colorBorder: 'rgba(245,158,11,.3)',
    descripcion: 'Acompañamos a Conecty en el primer ciclo real de operación sobre el CRM. Esta etapa no es una entrega más, sino el puente entre la implementación y la adopción real y sostenida del equipo en el día a día.',
    actividades: [
      { text: 'Monitoreo activo del sistema en producción durante las primeras dos semanas de uso real con el equipo' },
      { text: 'Identificación y corrección ágil de errores funcionales o de configuración que emerjan en la operación real' },
      { text: 'Atención y priorización de oportunidades de mejora detectadas por el equipo durante el uso diario' },
      { text: 'Sesiones de refuerzo y capacitación adicional según las necesidades reales identificadas en campo' },
      { text: 'Acompañamiento al equipo en el registro de los primeros negocios, contactos y actividades en el CRM' },
      { text: 'Resolución de dudas en tiempo real vía canal dedicado durante toda la etapa' },
      { text: 'Entrega final con validación del modelo implementado, resumen de ajustes y recomendaciones para la siguiente etapa de crecimiento del CRM' },
    ] as Actividad[],
  },
];

// ─── DESGLOSE CRM ─────────────────────────────────────────────────────────────

const DESGLOSE_HS = [
  {
    categoria: 'Usuarios, Equipos y Permisos',
    icon: Users,
    color: CONECTY_BLUE,
    items: [
      '12 usuarios configurados con roles y accesos diferenciados',
      '4 equipos definidos: Desarrollo · Sostenimiento · Operación · Masters (líderes de equipo)',
      'Reglas de visibilidad y permisos por equipo (qué ve y qué puede hacer cada rol)',
      'Equipo Masters: líderes de cada frente con acceso gerencial y visibilidad transversal',
    ],
  },
  {
    categoria: 'Pipeline de Ventas',
    icon: GitBranch,
    color: '#00bfa5',
    items: [
      'Pipeline Adquisición (Desarrollo + Operación): Prospección → Contacto inicial → Propuesta comercial → Cierre / Firma de contrato',
      'Criterios de avance y requisitos por etapa configurados',
      'Asignación automática de propietario por equipo y etapa',
      'Indicadores de conversión por etapa',
    ],
  },
  {
    categoria: 'Propiedades Personalizadas',
    icon: SlidersHorizontal,
    color: '#f59e0b',
    items: [
      'Hasta 10 propiedades personalizadas en objeto Contactos (ej. cargo en agencia, canal preferido, fecha cumpleaños, frecuencia de compra)',
      'Hasta 10 propiedades personalizadas en objeto Empresas/Distribuidores (ej. tipo de distribuidor, zona/ciudad, potencial de ventas, estado del contrato)',
      'Hasta 10 propiedades personalizadas en objeto Negocios (ej. tipo de cierre, valor acumulado, canal de origen)',
      'Hasta 10 propiedades personalizadas en objeto Órdenes (ej. estado de orden, productos ordenados)',
    ],
  },
  {
    categoria: 'Vistas Personalizadas',
    icon: Layers,
    color: '#a78bfa',
    items: [
      '1 vista de índice + 1 vista de registro por objeto: Contactos, Empresas, Negocios y Órdenes',
      'Total: hasta 8 vistas configuradas y adaptadas al flujo de cada equipo',
    ],
  },
  {
    categoria: 'Automatizaciones',
    icon: Zap,
    color: '#00bfa5',
    items: [
      'Asignación automática de leads: se asigna al asesor con menor carga o según región',
      'Alerta sin contacto: si no hay contacto en 48h, se genera tarea y alerta automática',
      'Envío automático de información: se envía presentación, catálogo e invitación al distribuidor',
      'Recordatorios automáticos: reuniones, seguimientos y capacitaciones programadas',
      'Alertas por estancamiento: si la negociación no avanza en X días, se genera alerta',
      'Detección de distribuidores en riesgo: si disminuyen ventas o actividad, se marca en riesgo',
      'Tareas de gestión recurrente: ruta semanal de visitas, llamadas, WhatsApp y correos',
      'Total: hasta 15 automatizaciones configuradas sobre estos flujos',
    ],
  },
  {
    categoria: 'Dashboards e Informes',
    icon: LayoutDashboard,
    color: CONECTY_BLUE,
    items: [
      '1 dashboard B2B principal: embudo comercial, visitas realizadas, tareas pendientes, negocios abiertos',
      'Hasta 10 informes personalizados: productividad del asesor, embudo de conversión, presupuesto mensual vs. cierre, análisis por equipo',
      'Total: 1 dashboard principal + hasta 10 informes personalizados',
    ],
  },
  {
    categoria: 'Capacitaciones y Documentación',
    icon: GraduationCap,
    color: '#34d399',
    items: [
      '2 sesiones generales de capacitación sobre la plataforma y las configuraciones realizadas',
      '2 sesiones de capacitación para el equipo comercial: uso de pipelines, registro de visitas, tareas y seguimiento',
      '2 sesiones de capacitación para el equipo de operación: gestión de órdenes, contactos, empresas y bandeja de seguimiento',
      '1 sesión de capacitación para gerencia: lectura de dashboards, informes de productividad y exportación de reportes',
      'Documentación completa del modelo implementado (guías de uso por rol, flujos configurados, glosario del CRM)',
      'Entrega de grabaciones de sesiones',
    ],
  },
];

const SECCIONES = [
  { id: 'resumen',    label: 'Resumen' },
  { id: 'objetivo',   label: 'Objetivo' },
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

const ConnectyProposalV2 = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [etapaActiva, setEtapaActiva] = useState<number | null>(null);
  const [desgloseActivo, setDesgloseActivo] = useState<number | null>(null);
  const [hubspotOpen, setHubspotOpen] = useState(false);

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
               <div className="w-auto h-12 flex items-center justify-center">
                <img src="/logo-webp_180x_2x-removebg-preview.png" alt="Conecty" className="h-full w-auto object-contain"
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

        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta de trabajo y cotización · V2</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${CONECTY_BLUE}, #1d70a2)` }}>
                  <Wifi className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(14,165,233,.10)', border: '1px solid rgba(14,165,233,.25)', color: CONECTY_BLUE }}>
                  {META.tagline}
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}>
                Propuesta<br />
                <span style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
                  {['1. Resumen ejecutivo','2. Objetivo general','3. Plan de trabajo','4. Alcance y opciones CRM','5. Inversión','6. Vigencia y términos'].map((item, i) => (
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
                  style={{ background: 'radial-gradient(circle, rgba(14,165,233,.10) 0%, rgba(29,112,162,.05) 50%, transparent 70%)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full" style={{ border: '1px solid rgba(14,165,233,.12)' }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(29,112,162,.15)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: CONECTY_BLUE, boxShadow: `0 0 6px rgba(14,165,233,.8)` }} />
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
                  <div className="w-64 h-32 flex items-center justify-center p-3">
                    <img src="/logo-webp_180x_2x-removebg-preview.png" alt="Conecty" className="w-full h-full object-contain"
                      style={{ filter: `drop-shadow(0 2px 20px rgba(14,165,233,.5))` }} />
                  </div>
                  <div className="text-center">
                    <span className="font-poppins font-black text-white text-[28px] tracking-tight">Conecty</span>
                    <p className="font-lato text-[13px] uppercase tracking-[0.2em] mt-1" style={{ color: CONECTY_BLUE }}>SIM & eSIM para viajeros</p>
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
            style={{ background: 'rgba(2,8,20,.85)', border: '1px solid rgba(14,165,233,.18)' }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-24 h-24 flex items-center justify-center p-2.5">
                <img src="/logo-webp_180x_2x-removebg-preview.png" alt="Conecty" className="w-full h-full object-contain" />
              </div>
              <span className="font-poppins font-black text-white text-[15px] tracking-tight">Conecty</span>
              <span className="font-lato text-[11px] uppercase tracking-[0.2em]" style={{ color: CONECTY_BLUE }}>{META.tagline}</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">{META.sector}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Fundada</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">{META.fundada} · +12 años en el mercado</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Canal B2B</p>
                <p className="font-lato text-white/60 text-[18px]">{META.distribuidores}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Volumen mensual</p>
                <p className="font-lato text-white/60 text-[18px]">{META.viajeros} · ~35% B2B</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Herramienta CRM</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#00bfa5' }} />
                  <p className="font-poppins font-semibold text-[#00bfa5] text-[15px]">HubSpot Sales Hub Pro</p>
                </div>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Usuarios</p>
                <p className="font-lato text-white/60 text-[18px]">{META.usuarios} usuarios · 4 equipos</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              Conecty lleva más de 12 años conectando a los viajeros latinoamericanos con el mundo a través de SIM físicas y eSIM para más de 190 países. Con{' '}
              <strong className="text-white/90 font-semibold">1.172 distribuidores B2B</strong> activos en agencias de viaje, casas de cambio y rentadoras de autos, el canal B2B es la columna vertebral del crecimiento de la compañía, aunque hoy opera en Excel, Google Forms y WhatsApp sin trazabilidad ni visibilidad gerencial.
            </p>
            <p>
              El equipo de <strong className="text-white/90 font-semibold">12 personas</strong> trabaja bajo cuatro frentes: Desarrollo (apertura de nuevos distribuidores), Sostenimiento (visitas y seguimiento de activos), Operación (back office, cotizaciones y pedidos) y Masters (líderes de equipo con visión transversal). Con el apoyo del equipo de Conecty, se ha podido establecer un alcance inicial claro para esta primera fase, ya que el mapeo de flujos comerciales B2B que entregaron nos permite iniciar la implementación con precisión y sin retrasos.
            </p>
          </div>

          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> Hallazgos clave identificados
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HALLAZGOS.map((h, i) => {
                const Icon = h.icon; const t = TINT[h.tint];
                return (
                  <div key={i} className="rounded-xl p-4 flex gap-3" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
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
          className={`transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>02 — Objetivo general</TagLabel>
          <SectionTitle>¿Para qué estamos aquí?</SectionTitle>
          <Rule />
          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,191,165,.07), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 text-[#00bfa5] mb-4" />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[23px] leading-relaxed">
              Diseñar e implementar un <strong className="text-white font-black">CRM</strong> como la plataforma central del canal B2B de Conecty: ordenar los procesos comerciales de Desarrollo, Sostenimiento y Operación; automatizar el seguimiento y la fidelización de distribuidores, y dar visibilidad gerencial total sobre el ciclo de vida del distribuidor, desde la prospección hasta la{' '}
              <em className="not-italic" style={{ color: CONECTY_BLUE }}>recompra acumulada</em>. Esta primera fase no incluye integraciones con Panel ni SIIGO, ya que ambas se evaluarán en una fase posterior.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Distribuidores B2B', value: '1.172', sub: 'base activa' },
              { label: 'Usuarios CRM',       value: '12',    sub: '4 equipos · Masters, Desarrollo, Sostenimiento, Operación' },
              { label: 'Pipelines',           value: '2',     sub: 'Adquisición + adicional' },
              { label: 'Herramienta CRM',      value: '1',     sub: 'HubSpot Sales Hub Pro' },
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

        {/* ─ 03 PLAN ─ */}
        <section id="plan" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — Plan de trabajo</TagLabel>
          <SectionTitle>4 etapas · ~6 semanas</SectionTitle>
          <Rule />

          {/* Timeline visual */}
          <div className="relative mb-10">
            <div className="hidden sm:block absolute left-[28px] top-10 bottom-10 w-px"
              style={{ background: 'linear-gradient(to bottom, rgba(14,165,233,.4), rgba(0,191,165,.4), rgba(52,211,153,.4), rgba(245,158,11,.4))' }} />

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

          {/* Notas de solapamiento */}
          <div className="space-y-3">
            <div className="rounded-xl p-4 flex gap-3"
              style={{ background: 'rgba(52,211,153,.06)', border: '1px solid rgba(52,211,153,.2)' }}>
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#34d399]" />
              <p className="font-lato text-white/55 text-[16px] leading-relaxed">
                Las <strong className="text-white/80">Etapas 2</strong> (Implementación) y <strong className="text-white/80">3</strong> (Capacitaciones) se solapan en las últimas semanas de implementación. Las capacitaciones se realizan a medida que los módulos quedan listos, garantizando la adopción progresiva del equipo desde el día uno.
              </p>
            </div>
            <div className="rounded-xl p-4 flex gap-3"
              style={{ background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.2)' }}>
              <Rocket className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#f59e0b]" />
              <p className="font-lato text-white/55 text-[16px] leading-relaxed">
                La <strong className="text-white/80">Etapa 4</strong> (Salida a Producción) inicia al finalizar la implementación y las capacitaciones, en la semana 6. Es la etapa de acompañamiento real: el equipo ya usa el sistema y Sixteam está presente para corregir y asegurar que el modelo funcione en la operación del día a día.
              </p>
            </div>
          </div>
        </section>

        {/* ─ 04 ALCANCE Y OPCIONES CRM ─ */}
        <section id="alcance" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Alcance de implementación</TagLabel>
          <SectionTitle>Alcance HubSpot CRM</SectionTitle>
          <Rule />

          {/* Desglose implementación */}
          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-4">
            Módulos y configuraciones incluidos en la implementación
          </p>
          <div className="space-y-2.5">
            {DESGLOSE_HS.map((bloque, i) => {
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
                      <span className="font-lato text-white/30 text-[14px] ml-3">{bloque.items.length} ítems</span>
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
          <TagLabel>05 — Propuesta de Inversión</TagLabel>
          <SectionTitle>Propuesta de inversión para el crecimiento.</SectionTitle>
          <Rule />
          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            El proyecto se cotiza como un conjunto integral. Valores en{' '}
            <strong className="text-white/75">pesos colombianos (COP)</strong>. No incluye licencias de herramienta CRM.
          </p>

          {/* Card total */}
          <div className="rounded-2xl p-7 sm:p-9 relative overflow-hidden mb-8"
            style={{ background: 'linear-gradient(135deg, rgba(0,191,165,.08) 0%, rgba(29,112,162,.08) 100%)', border: '1px solid rgba(0,191,165,.3)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,191,165,.06), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <div className="relative z-10">
              <p className="font-lato text-white/40 text-[15px] uppercase tracking-widest mb-2">Inversión total del proyecto · Implementación</p>
              <p className="font-poppins font-black text-white leading-none mb-3" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                {TOTAL}
              </p>
              <p className="font-lato text-white/40 text-[15px] mb-6">+ IVA · Sin licencias CRM · Dos tractos de 50%</p>
              <div className="flex flex-wrap gap-2">
                {[
                  '✓ Contexto y planificación',
                  '✓ Implementación completa CRM',
                  '✓ Automatizaciones y fidelización',
                  '✓ Capacitaciones al equipo',
                  '✓ Documentación y guías de uso',
                  '✓ Salida a producción acompañada',
                ].map((item, i) => (
                  <span key={i} className="font-lato text-[14px] px-3 py-1.5 rounded-full text-white/70"
                    style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Esquema de pago */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {[
              { tracto: '1er tracto', momento: 'Al firmar el contrato', porcentaje: '50%', monto: 'COP 4.250.000', desc: 'Se paga al firmar el contrato, antes de iniciar el proyecto. Habilita el inicio de la implementación.' },
              { tracto: '2do tracto', momento: 'Al finalizar las capacitaciones · semana 6', porcentaje: '50%', monto: 'COP 4.250.000', desc: 'Se paga al finalizar las capacitaciones en la puesta en marcha del sistema.' },
            ].map((t, i) => (
              <div key={i} className="rounded-xl p-5"
                style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-poppins font-bold text-white/70 text-[15px]">{t.tracto}</span>
                  <span className="font-poppins font-black text-[#00bfa5] text-[22px]">{t.porcentaje}</span>
                </div>
                <p className="font-poppins font-black text-white text-[20px] mb-1">{t.monto}</p>
                <p className="font-lato text-white/35 text-[14px]">{t.momento}</p>
                <p className="font-lato text-white/50 text-[14px] mt-2 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>

          {/* Nota sobre opciones de herramienta */}
          <div className="rounded-xl p-4 sm:p-5 mb-8 flex gap-3"
            style={{ background: 'rgba(14,165,233,.05)', border: '1px solid rgba(14,165,233,.2)' }}>
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: CONECTY_BLUE }} />
            <div>
              <p className="font-poppins font-semibold text-white/80 text-[18px] mb-1">Sobre el costo de la herramienta CRM</p>
              <p className="font-lato text-white/50 text-[16px] leading-relaxed">
                El costo de la herramienta CRM <strong className="text-white/70">no está incluido</strong> en el valor de implementación de Sixteam.pro. A continuación encontrarás el detalle del plan.
              </p>
            </div>
          </div>

          {/* ══ HUBSPOT ══ */}
          <div className="mb-10">
            <button
              onClick={() => setHubspotOpen(!hubspotOpen)}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-xl text-left transition-all duration-300"
              style={{ background: hubspotOpen ? 'rgba(255,122,89,.08)' : 'rgba(255,255,255,.03)', border: `1px solid ${hubspotOpen ? 'rgba(255,122,89,.35)' : 'rgba(255,122,89,.22)'}` }}>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: '#FF7A59' }} />
                <div>
                  <span className="font-poppins font-bold text-white/80 text-[15px]">HubSpot Sales Hub Pro — Ver detalle de licencias</span>
                  <p className="font-lato text-white/40 text-[13px] mt-0.5">COP 2.430.000 / mes · 12 usuarios · plan anual · + IVA</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${hubspotOpen ? 'rotate-90' : ''}`}
                style={{ color: '#FF7A59' }} />
            </button>
            {hubspotOpen && (<div className="mt-4">

            {/* Header banner HubSpot */}
            <div className="rounded-2xl p-5 sm:p-6 mb-6 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(255,122,89,.07) 0%, rgba(3,13,26,.95) 55%, rgba(0,191,165,.04) 100%)', border: '1px solid rgba(255,122,89,.22)' }}>
              <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,122,89,.10) 0%, transparent 70%)' }} />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(0,191,165,.06) 0%, transparent 70%)' }} />
              <div className="relative z-10 flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(255,122,89,.13)', border: '1px solid rgba(255,122,89,.32)' }}>
                  <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: '#FF7A59' }} />
                  <span className="font-poppins font-black text-[14px]" style={{ color: '#FF7A59' }}>HubSpot</span>
                  <span className="font-lato text-white/50 text-[13px]">Sales Hub Pro</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(0,191,165,.08)', border: '1px solid rgba(0,191,165,.25)' }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#00bfa5', boxShadow: '0 0 5px rgba(0,191,165,.6)' }} />
                  <span className="font-lato text-[#00bfa5] text-[13px] font-medium">Sixteam.pro · Partner Implementador</span>
                </div>
              </div>
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <p className="font-lato text-white/45 text-[15px] leading-relaxed max-w-lg">
                  Costos de licenciamiento en <strong className="text-white/65">pesos colombianos (COP)</strong> con facturación anual. Los impuestos no están incluidos. Sixteam.pro gestiona el contrato directamente con HubSpot para Colombia.
                </p>
                <span className="font-lato text-white/20 text-[12px] uppercase tracking-widest flex-shrink-0">Cotización · Mayo 2026</span>
              </div>
            </div>

            {/* Tabla cuotas recurrentes HubSpot */}
            <div className="rounded-xl overflow-hidden mb-4" style={{ border: '1px solid rgba(255,122,89,.18)' }}>
              <div className="px-5 py-3 flex items-center justify-between"
                style={{ background: 'linear-gradient(90deg, rgba(255,122,89,.10) 0%, rgba(255,255,255,.03) 100%)', borderBottom: '1px solid rgba(255,122,89,.12)' }}>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" style={{ color: '#FF7A59' }} />
                  <p className="font-poppins font-semibold text-white/65 text-[13px] uppercase tracking-wider">Cuotas recurrentes</p>
                </div>
                <span className="font-lato text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(255,122,89,.12)', border: '1px solid rgba(255,122,89,.28)', color: '#FF7A59' }}>
                  Facturación anual
                </span>
              </div>

              <div className="hidden sm:grid px-5 py-2 font-lato text-white/20 text-[11px] uppercase tracking-wider"
                style={{ gridTemplateColumns: '2.5fr 0.7fr 1.3fr 1.5fr', background: 'rgba(255,255,255,.015)', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                <span>Tipo de licencia</span>
                <span className="text-center">Usuarios</span>
                <span className="text-center">COP / usuario / mes</span>
                <span className="text-right">Total / mes</span>
              </div>

              <div className="divide-y divide-white/5">
                {/* Fila 1 — Sales Hub Pro */}
                <div className="px-5 py-4">
                  <div className="sm:hidden">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-poppins font-semibold text-white/85 text-[15px]">Sales Hub Pro</p>
                        <p className="font-lato text-white/35 text-[13px] mt-0.5">6 licencias · Desarrollo, Sostenimiento</p>
                      </div>
                      <span className="font-lato text-[11px] px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: 'rgba(255,122,89,.12)', border: '1px solid rgba(255,122,89,.28)', color: '#FF7A59' }}>-10%</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-lato text-white/25 text-[13px] line-through">COP 1.800.000</span>
                      <span className="font-poppins font-black text-white text-[18px]">COP 1.620.000</span>
                    </div>
                  </div>
                  <div className="hidden sm:grid items-center gap-0"
                    style={{ gridTemplateColumns: '2.5fr 0.7fr 1.3fr 1.5fr' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(to bottom, #FF7A59, rgba(255,122,89,.2))' }} />
                      <div>
                        <p className="font-poppins font-semibold text-white/85 text-[15px]">Sales Hub Pro</p>
                        <p className="font-lato text-white/35 text-[13px] mt-0.5">Desarrollo · Sostenimiento</p>
                      </div>
                    </div>
                    <p className="font-poppins font-black text-white/60 text-[22px] text-center">6</p>
                    <div className="text-center">
                      <span className="font-lato text-white/20 text-[12px] line-through block">COP 300.000</span>
                      <span className="font-poppins font-semibold text-[15px]" style={{ color: '#FF7A59' }}>COP 270.000</span>
                    </div>
                    <div className="text-right">
                      <span className="font-lato text-white/20 text-[12px] line-through block">COP 1.800.000</span>
                      <span className="font-poppins font-black text-white text-[17px]">COP 1.620.000</span>
                    </div>
                  </div>
                </div>

                {/* Fila 2 — Licencias Principales (6 usuarios) */}
                <div className="px-5 py-4">
                  <div className="sm:hidden">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-poppins font-semibold text-white/85 text-[15px]">Licencias Principales</p>
                        <p className="font-lato text-white/35 text-[13px] mt-0.5">6 licencias · Masters · Operación</p>
                      </div>
                      <span className="font-lato text-[11px] px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: 'rgba(255,122,89,.12)', border: '1px solid rgba(255,122,89,.28)', color: '#FF7A59' }}>-10%</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-lato text-white/25 text-[13px] line-through">COP 900.000</span>
                      <span className="font-poppins font-black text-white text-[18px]">COP 810.000</span>
                    </div>
                  </div>
                  <div className="hidden sm:grid items-center gap-0"
                    style={{ gridTemplateColumns: '2.5fr 0.7fr 1.3fr 1.5fr' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(to bottom, #FF7A59, rgba(255,122,89,.2))' }} />
                      <div>
                        <p className="font-poppins font-semibold text-white/85 text-[15px]">Licencias Principales</p>
                        <p className="font-lato text-white/35 text-[13px] mt-0.5">Masters · Operación</p>
                      </div>
                    </div>
                    <p className="font-poppins font-black text-white/60 text-[22px] text-center">6</p>
                    <div className="text-center">
                      <span className="font-lato text-white/20 text-[12px] line-through block">COP 150.000</span>
                      <span className="font-poppins font-semibold text-[15px]" style={{ color: '#FF7A59' }}>COP 135.000</span>
                    </div>
                    <div className="text-right">
                      <span className="font-lato text-white/20 text-[12px] line-through block">COP 900.000</span>
                      <span className="font-poppins font-black text-white text-[17px]">COP 810.000</span>
                    </div>
                  </div>
                </div>

                {/* Total mensual */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5"
                  style={{ background: 'linear-gradient(90deg, rgba(255,122,89,.09) 0%, rgba(255,255,255,.02) 100%)', borderTop: '1px solid rgba(255,122,89,.18)' }}>
                  <div className="flex items-center gap-2">
                    <span className="font-poppins font-bold text-[13px] uppercase tracking-wider" style={{ color: '#FF7A59' }}>Total mensual</span>
                    <span className="font-lato text-white/25 text-[12px]">· 12 usuarios · plan anual</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-lato text-white/20 text-[13px] line-through">COP 2.700.000</span>
                    <span className="font-poppins font-black text-[19px]" style={{ color: '#FF7A59' }}>COP 2.430.000 / mes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cuota única incorporación */}
            <div className="rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 mb-5"
              style={{ background: 'rgba(255,122,89,.05)', border: '1px solid rgba(255,122,89,.18)' }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,122,89,.15)', border: '1px solid rgba(255,122,89,.3)' }}>
                  <Zap className="w-4 h-4" style={{ color: '#FF7A59' }} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <p className="font-poppins font-semibold text-white/85 text-[15px]">Incorporación de Sales Hub Pro</p>
                    <span className="font-lato font-semibold text-[11px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(0,191,165,.15)', border: '1px solid rgba(0,191,165,.35)', color: '#00bfa5' }}>
                      ✓ Se anula — Sixteam la implementa
                    </span>
                  </div>
                  <p className="font-lato text-white/35 text-[13px]">Cuota única obligatoria · Se paga una sola vez al contratar</p>
                </div>
              </div>
              <span className="font-poppins font-black text-white/25 text-[20px] sm:ml-4 flex-shrink-0 line-through">COP 4.500.000</span>
            </div>

            {/* Cards resumen HubSpot */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div className="rounded-xl p-5 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(255,122,89,.10) 0%, rgba(3,13,26,.8) 100%)', border: '1px solid rgba(255,122,89,.28)' }}>
                <p className="font-lato text-white/35 text-[12px] uppercase tracking-wider mb-2">Mensual · plan anual</p>
                <p className="font-poppins font-black text-[22px] leading-tight" style={{ color: '#FF7A59' }}>COP 2.430.000</p>
                <p className="font-lato text-white/35 text-[13px] mt-1.5">COP 29.160.000 / año</p>
              </div>
              <div className="rounded-xl p-5 relative overflow-hidden"
                style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
                <p className="font-lato text-white/35 text-[12px] uppercase tracking-wider mb-2">Precio inicial aproximado</p>
                <p className="font-poppins font-black text-[22px] leading-tight text-white">COP 33.660.000</p>
                <p className="font-lato text-white/35 text-[13px] mt-1.5">Anual + incorporación única</p>
              </div>
              <div className="rounded-xl p-5 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(0,191,165,.06) 0%, rgba(3,13,26,.8) 100%)', border: '1px solid rgba(0,191,165,.22)' }}>
                <p className="font-lato text-white/35 text-[12px] uppercase tracking-wider mb-2">Ahorro vs. mensual</p>
                <p className="font-poppins font-black text-[22px] leading-tight" style={{ color: '#00bfa5' }}>COP 3.240.000</p>
                <p className="font-lato text-white/35 text-[13px] mt-1.5">Al contratar plan anual</p>
              </div>
            </div>

            <div className="rounded-xl p-4 flex gap-3"
              style={{ background: 'rgba(255,122,89,.04)', border: '1px solid rgba(255,122,89,.15)' }}>
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#FF7A59' }} />
              <p className="font-lato text-white/45 text-[15px] leading-relaxed">
                Valores según cotización HubSpot a mayo 2026. Los impuestos aplicables no están incluidos y las tarifas están sujetas a cambios. <strong className="text-white/65">Sixteam.pro gestiona el contrato directamente con HubSpot para Colombia.</strong>
              </p>
            </div>
            </div>)}
          </div>

          {/* Soporte opcional */}
          <div>
            <TagLabel>Servicio opcional recurrente — post-proyecto</TagLabel>
            <Rule />
            <div className="rounded-xl p-5 flex flex-col gap-4"
              style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.22)' }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,191,165,.15)' }}>
                  <Zap className="w-4 h-4 text-[#00bfa5]" />
                </div>
                <div>
                  <p className="font-poppins font-bold text-white/85 text-[18px]">Soporte y mejora continua</p>
                  <p className="font-lato text-white/40 text-[13px] mt-0.5">Mensual · Hasta 5 horas no acumulables</p>
                </div>
              </div>
              <p className="font-poppins font-black text-white text-[25px] leading-none">
                Desde COP 600.000
                <span className="font-lato font-normal text-white/40 text-[16px] ml-2">/mes</span>
              </p>
              <ul className="space-y-1.5">
                {[
                  'Ajustes y mejoras en flujos, propiedades y automatizaciones',
                  'Nuevos informes, dashboards y vistas según evolución del proceso',
                  'Soporte funcional al equipo en el uso del CRM',
                  'Tickets de soporte vía WhatsApp · SLA 4h L–V',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-[#00bfa5] flex-shrink-0 mt-[3px]" />
                    <span className="font-lato text-white/55 text-[15px]">{item}</span>
                  </li>
                ))}
              </ul>
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
              { titulo: 'Aprobación', desc: 'Para aceptar esta propuesta y dar inicio al proyecto, se requiere confirmación vía WhatsApp, Correo o Verbal para habilitar el contrato a firmar y proceder con el inicio del trabajo.', icon: CheckCircle },
              { titulo: 'Términos de Pago', desc: '50% al firmar el contrato, para iniciar el proyecto · 50% al finalizar las capacitaciones en la puesta en marcha (semana 6). Los pagos se realizan mediante transferencia bancaria o plataforma acordada.', icon: FileText },
              { titulo: 'Herramienta CRM', desc: 'La implementación se realizará sobre HubSpot Sales Hub Pro. Las licencias no están incluidas en el valor de implementación de Sixteam.pro y se contratan directamente con HubSpot.', icon: Settings },
              { titulo: 'Licencias de la herramienta', desc: 'El costo de licenciamiento de HubSpot Sales Hub Pro (COP 2.430.000/mes · plan anual · 12 usuarios) no está incluido en la propuesta de implementación y se contrata de forma separada. Sixteam.pro puede gestionar el contrato con HubSpot directamente.', icon: Info },
              { titulo: 'Modificaciones al Alcance', desc: 'Cualquier solicitud de servicio, integración o funcionalidad no estipulada explícitamente requerirá una nueva cotización y podrá afectar los tiempos de entrega.', icon: AlertCircle },
              { titulo: 'Inicio del Proyecto', desc: 'El cronograma comienza desde la recepción del primer pago y la entrega de accesos e información necesaria para la herramienta CRM elegida.', icon: Zap },
              { titulo: 'Vigencia de la Propuesta', desc: 'Esta propuesta tiene una vigencia de 30 días calendario desde su fecha de emisión. Pasado este plazo, los valores podrán ser revisados según condiciones del mercado.', icon: Clock },
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

export default ConnectyProposalV2;
