import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, ChevronRight, FileText, Target, AlertCircle,
  TrendingUp, Calendar, Hash, Info, Globe, MapPin, Plane,
  Database, Settings, Users, Clock, XCircle, Mail, Phone, Zap,
} from 'lucide-react';
import LogoCarousel from '../components/LogoCarousel';

const ACCENT  = '#f59e0b';
const ACCENT2 = '#b45309';
const TRM     = '3.667';
const TRM_NUM = 3667;

const META = {
  cliente:  'Metropolitan Touring Colombia',
  contacto: 'Gregorio Palma Sarmiento',
  cargo:    'Gerente de Tecnología',
  sector:   'Agencia de Viajes · Turismo de Lujo',
  fecha:    '25 de mayo de 2026',
  lugar:    'Barranquilla, Colombia',
  nit:      '901.967.849-4',
  correo:   'alpha@sixteam.pro',
  rl:       'Samuel Armando Burgos Ferrer',
  objetivo: 'Migrar de Salesforce a HubSpot CRM con una implementación a medida y una migración estructurada de la base de datos comercial, garantizando la autonomía operativa de la sede Colombia antes del 1 de agosto de 2026.',
};

const HALLAZGOS = [
  {
    titulo: 'Salesforce costoso para una operación independiente',
    desc: 'La licencia de Salesforce fue implementada por la casa matriz a escala regional. Para la sede Colombia —que opera de forma independiente— representa un costo desproporcionado sin soporte local adecuado y con una configuración heredada que no refleja las necesidades reales del equipo.',
    icon: AlertCircle,
    tint: 'red',
  },
  {
    titulo: 'Fecha límite del 1 de agosto sin CRM propio',
    desc: 'La separación de la casa matriz está confirmada para antes del 1 de agosto. Sin un CRM operativo desde ese día, el equipo comercial perdería la trazabilidad de cuentas, oportunidades y seguimientos en plena transición hacia la autonomía.',
    icon: Clock,
    tint: 'amber',
  },
  {
    titulo: 'Base de datos sin depurar ni segmentada por sede',
    desc: 'Los registros en Salesforce mezclan información de las sedes Perú, Ecuador y Colombia. Sin un proceso de limpieza y segmentación previo, el riesgo es cargar el nuevo CRM con datos duplicados, incompletos o que no corresponden a la operación local.',
    icon: Database,
    tint: 'blue',
  },
  {
    titulo: 'Procesos comerciales con alto potencial de optimización',
    desc: 'La actividad comercial actual presenta oportunidades concretas de mejora: seguimientos manuales, visibilidad limitada del pipeline y flujos de trabajo que dependen del criterio individual de cada persona. Con automatizaciones y una reestructuración del proceso, el nuevo CRM se convierte en una herramienta que impulsa ventas, no en una carga administrativa.',
    icon: TrendingUp,
    tint: 'teal',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber: { text: 'text-amber-400',  bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)' },
  blue:  { text: 'text-[#60a5fa]', bg: 'rgba(96,165,250,.07)',  border: 'rgba(96,165,250,.18)' },
  red:   { text: 'text-[#f87171]', bg: 'rgba(221,51,51,.07)',   border: 'rgba(221,51,51,.2)'   },
  teal:  { text: 'text-[#00bfa5]', bg: 'rgba(0,191,165,.07)',   border: 'rgba(0,191,165,.18)'  },
};

const SERVICIOS = [
  {
    num: 'Servicio 01',
    nombre: 'Implementación HubSpot CRM',
    precio: 'USD $1.000',
    detallePrecio: `Pago único · ≈ COP 3.667.000 (TRM $${TRM})`,
    duracion: '2 – 3 semanas',
    icon: Settings,
    entregables: [
      'Portal HubSpot Sales Hub Pro configurado y listo para operar',
      'Hasta 40 propiedades personalizadas distribuidas entre los objetos Contact, Company y Deal',
      'Hasta 1 pipeline de ventas estructurado según la actividad comercial actual del equipo',
      'Hasta 6 automatizaciones de seguimiento y proceso comercial activas',
      'Panel de reportes con hasta 6 informes personalizados para la operación',
      'Configuración de hasta 7 usuarios con roles y permisos diferenciados',
      'Capacitación funcional del equipo: hasta 4 horas grabadas para consulta posterior',
      'Documentación operativa del CRM entregada por módulo',
    ],
    fuera: [
      'Integración técnica con Tourplan, Axus u otros sistemas externos',
      'Configuración de Marketing Hub o Service Hub',
      'Personalización Enterprise o desarrollo de custom code',
      'Más de 7 usuarios, más de 40 propiedades o más de 6 automatizaciones',
    ],
    actividades: [
      'Sesión de contexto con el equipo (hasta 2 horas) para mapear el flujo comercial, las etapas del pipeline y los campos clave. Este análisis es el punto de partida de toda la configuración.',
      'Diseño del modelo de datos: definición de las propiedades a crear en Contact, Company y Deal, con revisión y aprobación de Gregorio antes de publicar en el portal.',
      'Configuración del pipeline de ventas adaptando las etapas que el equipo ya conoce desde Salesforce, asegurando que el nuevo flujo refleje cómo el equipo realmente vende.',
      'Diseño e implementación de hasta 6 automatizaciones: seguimientos automáticos por etapa, alertas internas, asignación de tareas y notificaciones de actividad comercial.',
      'Construcción del panel de reportes con los 6 informes clave: actividad por asesor, negocios por etapa, tasa de cierre, velocidad de pipeline y métricas de seguimiento.',
      'Alta de usuarios con permisos diferenciados y sesión de capacitación grabada con entrega de guías de uso por módulo.',
    ],
  },
  {
    num: 'Servicio 02',
    nombre: 'Migración de Datos · Salesforce → HubSpot',
    precio: 'USD $2.000',
    detallePrecio: `Pago único · ≈ COP 8.400.000 (TRM $${TRM})`,
    duracion: '1 – 2 semanas',
    icon: Database,
    entregables: [
      'Documento de mapeo de campos aprobado antes de ejecutar la migración',
      'Reporte de calidad de datos: duplicados encontrados, registros limpios vs. descartados',
      'Base de datos migrada en HubSpot: Contacts + Companies con propiedades, asociaciones y asignaciones correctas',
      'Reporte final de validación con conteo de registros migrados',
    ],
    fuera: [
      'Historial de oportunidades, actividades o correos registrados en Salesforce',
      'Datos de las sedes Perú y Ecuador',
      'Más de 5.000 registros en total entre Contactos y Empresas',
      'Más de una ronda de correcciones post-importación',
      'Campos no incluidos en el export de Salesforce entregado a Sixteam',
    ],
    actividades: [
      'Análisis y mapeo de campos: revisión de la estructura exportada desde Salesforce e identificación de los campos relevantes para la operación Colombia. Se documenta qué se migra, qué se transforma y qué se descarta, con validación del cliente antes de ejecutar.',
      'Limpieza y estandarización: corrección de inconsistencias en nombres, ciudades, países y valores de campos de selección. Normalización de teléfonos al formato E.164 (+57 300 123 4567) como requisito para activar canales como WhatsApp.',
      'Deduplicación: detección y consolidación de contactos y empresas duplicados usando como criterios email, teléfono e identificadores de Salesforce. Se genera un reporte para revisión del cliente antes de eliminar.',
      'Configuración en HubSpot: creación de propiedades personalizadas según el mapeo acordado, incluyendo campos de referencia legacy (códigos de sistemas como Opera o JDE) y campos de negocio propios de la operación Colombia.',
      'Importación y asociaciones: carga de registros con cada Contacto vinculado a su Empresa correspondiente. Los contactos sin empresa identificable se marcan con una propiedad de alerta para revisión posterior.',
      'Asignación de propietarios: mapeo de usuarios de Salesforce a usuarios de HubSpot para que cada registro quede asignado al responsable comercial correcto desde el día de la importación.',
      'Validación y entrega: reporte comparativo entre registros fuente y registros importados, revisión de muestra representativa con el cliente y una ronda de correcciones incluida en el alcance.',
    ],
  },
];

const SECCIONES = [
  { id: 'resumen',        label: 'Resumen'          },
  { id: 'objetivo',       label: 'Objetivo'          },
  { id: 'servicios',      label: 'Servicios'         },
  { id: 'cotizacion',     label: 'Inversión'         },
  { id: 'porque-sixteam', label: 'Por qué Sixteam'  },
  { id: 'vigencia',       label: 'Vigencia'          },
];

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
  <span className="font-lato text-[13px] uppercase tracking-[0.22em] font-medium" style={{ color: ACCENT }}>{children}</span>
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

const MetropolitanTouringProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [servicioActivo, setServicioActivo] = useState<number | null>(null);
  const [cotizActivo, setCotizActivo] = useState<string | null>(null);
  const [termActivo, setTermActivo] = useState<number | null>(null);
  const [evalOpen, setEvalOpen] = useState(false);

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

      {/* NAV LATERAL */}
      <nav className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-50 flex-col gap-3 no-print">
        {SECCIONES.map(s => (
          <button key={s.id} onClick={() => scrollTo(s.id)}
            className={`group flex items-center gap-2.5 transition-all duration-300 ${activeSection === s.id ? 'opacity-100' : 'opacity-25 hover:opacity-60'}`}>
            <span className={`font-lato text-[14px] text-white whitespace-nowrap transition-all duration-300 ${activeSection === s.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>
              {s.label}
            </span>
            <div className={`rounded-full flex-shrink-0 transition-all duration-300 ${activeSection === s.id ? 'w-2 h-2 shadow-[0_0_6px_rgba(245,158,11,.7)]' : 'w-1.5 h-1.5 bg-white/50'}`}
              style={{ background: activeSection === s.id ? ACCENT : undefined }} />
          </button>
        ))}
      </nav>

      {/* ══════════ PORTADA */}
      <header className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #04111f 0%, #071826 55%, #0d1a0a 100%)' }}>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
            style={{ background: `radial-gradient(circle, ${ACCENT}0c 0%, transparent 65%)` }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: `radial-gradient(circle, ${ACCENT2}0a 0%, transparent 70%)`, transform: 'translate(-20%,20%)' }} />
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
        `}</style>

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-b" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-white">
              <img src="/sixteam-logo.png" alt="Sixteam.pro" className="w-full h-full object-contain"
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

        {/* Cuerpo portada */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-12 px-6 sm:px-10 lg:px-[10%]">
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            {/* Izquierda */}
            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta comercial · Implementación HubSpot CRM</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})` }}>
                  <Plane className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}28`, color: ACCENT }}>
                  Turismo · Colombia
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
                  { icon: Globe,    text: META.sector },
                  { icon: Hash,     text: `NIT ${META.nit}` },
                ].map((chip, i) => {
                  const Icon = chip.icon;
                  return (
                    <div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[15px] text-white/60"
                      style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: ACCENT }} /> {chip.text}
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-5" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-widest mb-3">Contenido</p>
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-x-6 gap-y-1.5">
                  {['1. Resumen ejecutivo', '2. Objetivo general', '3. Servicios', '4. Inversión', '5. Por qué Sixteam', '6. Vigencia y términos'].map((item, i) => (
                    <button key={i} onClick={() => scrollTo(SECCIONES[i]?.id)}
                      className="font-lato text-white/45 text-[15px] hover:text-white transition-colors duration-200 text-left flex items-center gap-1.5"
                      style={{ ['--tw-text-opacity' as string]: 1 }}
                      onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
                      onMouseLeave={e => (e.currentTarget.style.color = '')}>
                      <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: `${ACCENT}60` }} />
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
                  style={{ background: `radial-gradient(circle, ${ACCENT}12 0%, ${ACCENT2}06 50%, transparent 70%)` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full"
                  style={{ border: `1px solid ${ACCENT}12` }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full"
                  style={{ border: `1px dashed ${ACCENT2}18` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}cc` }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: ACCENT2, boxShadow: `0 0 6px ${ACCENT2}cc` }} />
                </div>
              </div>

              <div className="cover-float relative z-10 flex flex-col items-center gap-6 w-full px-6">
                <div className="flex flex-col items-center gap-1">
                  <img src="/sixteam-logo.png" alt="Sixteam.pro"
                    className="h-20 w-auto object-contain"
                    style={{ filter: `drop-shadow(0 4px 20px ${ACCENT}45)` }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <span className="font-poppins font-black text-white/30 text-[11px] uppercase tracking-[0.2em]">Sixteam.pro</span>
                </div>

                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}20)` }} />
                  <div className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)' }}>
                    <span className="font-poppins font-black text-white/40 text-[20px] leading-none">×</span>
                  </div>
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${ACCENT}20, transparent)` }} />
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-2xl px-6 py-4 flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,.06)', border: `1px solid ${ACCENT}20`, boxShadow: `0 4px 28px ${ACCENT}18` }}>
                    <img src="/logo-mt.svg" alt="Metropolitan Touring"
                      className="h-10 w-auto object-contain max-w-[220px]"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <span className="font-poppins font-black text-white/30 text-[11px] uppercase tracking-[0.2em] text-center">Metropolitan Touring</span>
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
                ? { background: ACCENT, color: '#030d1a', fontWeight: 600 }
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
          <TagLabel>01 — Resumen ejecutivo</TagLabel>
          <SectionTitle>Contexto y diagnóstico inicial</SectionTitle>
          <Rule />

          {/* Ficha cliente */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="rounded-2xl overflow-hidden flex items-center justify-center px-5 py-3"
                style={{ background: 'rgba(255,255,255,.07)', border: `1px solid ${ACCENT}20`, boxShadow: `0 4px 20px ${ACCENT}14` }}>
                <img src="/logo-mt.svg" alt="Metropolitan Touring"
                  className="h-10 w-auto object-contain max-w-[160px]"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <span className="font-poppins font-black text-white text-[13px] tracking-tight text-center">Metropolitan Touring</span>
              <span className="font-lato text-[11px] uppercase tracking-[0.18em] text-center" style={{ color: ACCENT }}>Colombia · 2026</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                <p className="font-poppins font-semibold text-white/80 text-[17px]">{META.sector}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Contexto</p>
                <p className="font-poppins font-semibold text-white/80 text-[17px]">Independencia operativa · ago. 2026</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sede</p>
                <p className="font-lato text-white/60 text-[17px]">{META.lugar}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Preparado para</p>
                <p className="font-lato text-white/60 text-[17px]">{META.contacto} · {META.cargo}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              Metropolitan Touring Colombia está en un momento de transformación estratégica: la sede del país se separa de la casa matriz para operar de forma independiente antes del <strong className="text-white/90 font-semibold">1 de agosto de 2026</strong>. Con esa fecha como límite, el equipo necesita una plataforma CRM propia que reemplace a Salesforce —costosa, heredada y sobredimensionada para una operación local que comienza desde cero.
            </p>
            <p>
              Durante el diagnóstico, el equipo identificó que el objetivo no es replicar la complejidad de Salesforce sino <strong className="text-white/90 font-semibold">migrar a una herramienta más eficiente</strong> que gestione la relación comercial con clientes mientras Tourplan continúa siendo el sistema operativo para cotizaciones y reservas.
            </p>
            <p>
              Sixteam propone dos servicios complementarios: la <strong className="text-white/90 font-semibold">implementación de HubSpot CRM</strong> configurado a la medida de la operación Colombia, y la <strong className="text-white/90 font-semibold">migración estructurada de la base de datos desde Salesforce</strong>, con limpieza, deduplicación y validación antes del go-live.
            </p>
          </div>

          {/* Hallazgos */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4" style={{ color: ACCENT }} /> Hallazgos del diagnóstico inicial
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HALLAZGOS.map((h, i) => {
                const Icon = h.icon; const t = TINT[h.tint];
                return (
                  <div key={i} className="rounded-xl p-4 flex gap-3"
                    style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                    <Icon className={`w-4 h-4 ${t.text} flex-shrink-0 mt-0.5`} />
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

        {/* ─ 02 OBJETIVO ─ */}
        <section id="objetivo" ref={s2.ref as React.RefObject<HTMLElement>}
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>02 — Objetivo general</TagLabel>
          <SectionTitle>Una transición limpia, en tiempo y a la medida</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden mb-6"
            style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${ACCENT}0a, transparent 70%)`, transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 mb-4" style={{ color: ACCENT }} />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[22px] leading-relaxed mb-5">
              Sixteam.pro es una consultora en <span style={{ color: ACCENT }}>estrategia digital</span> especializada en diseñar e implementar soluciones de tecnología a la medida de cada operación. No vendemos licencias genéricas; construimos el sistema que cada equipo realmente necesita.
            </p>
            <div className="space-y-4 font-lato text-white/65 text-[17px] sm:text-[18px] leading-relaxed">
              <p>
                Para Metropolitan Touring Colombia, la prioridad es clara: llegar al <strong className="text-white/85 font-semibold">1 de agosto con un CRM operativo</strong>, con la base de datos comercial limpia y el equipo capacitado para usarlo. No se trata de replicar la complejidad de Salesforce en HubSpot, sino de arrancar con una configuración simple, funcional y alineada con el flujo que el equipo ya conoce.
              </p>
              <p>
                La propuesta separa deliberadamente los servicios de implementación y migración para que el cliente pueda <strong className="text-white/85 font-semibold">controlarlos como procesos independientes</strong>: el CRM puede configurarse mientras la base de datos se depura, de modo que ambos convergen en el go-live sin depender el uno del otro en su ejecución.
              </p>
            </div>
          </div>

          {/* Por qué HubSpot */}
          <p className="font-lato text-white/30 text-[13px] uppercase tracking-widest mb-4">Por qué HubSpot para esta operación</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: Users,
                titulo: 'Licenciamiento flexible por usuario',
                desc: 'HubSpot Pro permite asignar licencias solo a los usuarios que las necesitan. Para una operación de 7 personas donde solo 2-3 gestionan el pipeline activamente, esto representa un ahorro significativo frente a Salesforce.',
              },
              {
                icon: Settings,
                titulo: 'Configuración sin desarrollo personalizado',
                desc: 'Las propiedades personalizadas, los pipelines y las automatizaciones básicas se configuran sin código. Esto elimina la dependencia de desarrolladores externos y reduce el tiempo de implementación.',
              },
              {
                icon: Database,
                titulo: 'CRM comercial, no operativo',
                desc: 'HubSpot gestiona la relación con el cliente: seguimiento, comunicación y pipeline. La operativa real —cotizaciones, reservas, productos— permanece en Tourplan. Esta separación es exactamente el modelo que el equipo prefiere.',
              },
              {
                icon: FileText,
                titulo: 'Conectores estándar disponibles',
                desc: 'Si en el futuro se decide conectar herramientas adicionales, HubSpot tiene conectores nativos con cientos de plataformas, evitando desarrollos costosos y manteniendo la operación ágil.',
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

          {/* Evaluación de alternativas CRM — desplegable */}
          <div className="rounded-xl overflow-hidden transition-all duration-300 mt-4"
            style={{ background: 'rgba(255,255,255,.03)', border: evalOpen ? `1px solid ${ACCENT}40` : '1px solid rgba(255,255,255,.07)' }}>
            <button onClick={() => setEvalOpen(!evalOpen)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: evalOpen ? `${ACCENT}18` : 'rgba(255,255,255,.05)' }}>
                <TrendingUp className="w-4 h-4" style={{ color: evalOpen ? ACCENT : 'rgba(255,255,255,.35)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-lato text-[11px] uppercase tracking-widest mb-0.5" style={{ color: `${ACCENT}80` }}>Evaluación de alternativas CRM</p>
                <span className={`font-poppins font-bold text-[16px] ${evalOpen ? 'text-white' : 'text-white/65'}`}>
                  Analizamos Zoho, Pipedrive y otras opciones. La recomendación es HubSpot.
                </span>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                style={{ color: `${ACCENT}60`, transform: evalOpen ? 'rotate(90deg)' : undefined }} />
            </button>
            {evalOpen && (
              <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                <div className="pt-4 space-y-3 font-lato text-white/55 text-[16px] leading-relaxed">
                  <p>
                    Durante el diagnóstico evaluamos alternativas como Zoho CRM, que el equipo ya había investigado. Si bien Zoho puede ser funcional en contextos específicos, desde nuestro punto de vista consultivo y con base en la experiencia de implementación, <strong className="text-white/80 font-semibold">HubSpot ofrece una experiencia de usuario significativamente superior</strong>: la adopción del equipo es más rápida, la interfaz es más intuitiva para equipos comerciales no técnicos y la configuración inicial requiere menos fricción.
                  </p>
                  <p>
                    Más allá de la UX, HubSpot es la plataforma que mejor balancea robustez y simplicidad para una operación del tamaño de Metropolitan Touring Colombia. Las automatizaciones, el pipeline y los reportes son accesibles sin depender de un equipo técnico interno. Y cuando la operación crezca, hay espacio real para seguir optimizando: más automatizaciones, flujos de marketing, integraciones con otras herramientas, sin necesidad de migrar nuevamente.
                  </p>
                  <p>
                    Esta no es una recomendación genérica. Es la conclusión de analizar las necesidades reales del equipo, el plazo disponible y las características de cada plataforma. <strong className="text-white/80 font-semibold">HubSpot es la mejor opción en este momento para esta operación.</strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ─ 03 SERVICIOS ─ */}
        <section id="servicios" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — Servicios y plan de trabajo</TagLabel>
          <SectionTitle>Dos servicios · un solo objetivo</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            La propuesta contempla dos servicios complementarios que pueden ejecutarse en paralelo para cumplir el plazo del 1 de agosto. Cada uno tiene un alcance, entregables y condiciones claramente definidos.
          </p>

          {/* Roadmap implementación */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-lato text-[12px] uppercase tracking-widest mb-5" style={{ color: `${ACCENT}90` }}>
              Plan de trabajo · Implementación HubSpot CRM · 4 semanas
            </p>

            {/* Timeline horizontal */}
            <div className="hidden sm:block relative mb-5">
              <div className="absolute top-4 left-[8%] right-[8%] h-0.5"
                style={{ background: `linear-gradient(90deg, ${ACCENT}40, ${ACCENT}40)` }} />
              <div className="grid grid-cols-3 gap-4 relative">
                {[
                  { semana: 'Semana 1', titulo: 'Contexto y entendimiento del negocio', desc: 'Mapeo del proceso comercial, flujos de venta y definición del modelo de datos en HubSpot.' },
                  { semana: 'Semanas 2 y 3', titulo: 'Implementación de configuraciones', desc: 'Propiedades, pipeline, automatizaciones e informes configurados y validados con el equipo.' },
                  { semana: 'Semana 4', titulo: 'Capacitaciones y puesta en marcha', desc: 'Sesión de capacitación con el equipo, pruebas de calidad y go-live oficial.' },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center z-10 relative"
                      style={{ background: `linear-gradient(135deg, ${ACCENT2}, ${ACCENT})`, boxShadow: `0 0 12px ${ACCENT}40` }}>
                      <span className="font-poppins font-black text-white text-[11px]">{i + 1}</span>
                    </div>
                    <p className="font-lato text-[11px] uppercase tracking-wider" style={{ color: `${ACCENT}80` }}>{step.semana}</p>
                    <p className="font-poppins font-bold text-white text-[14px] leading-snug">{step.titulo}</p>
                    <p className="font-lato text-white/40 text-[13px] leading-snug">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Vista móvil */}
            <div className="sm:hidden space-y-3 mb-4">
              {[
                { semana: 'Semana 1', titulo: 'Contexto y entendimiento del negocio' },
                { semana: 'Semanas 2 y 3', titulo: 'Implementación de configuraciones' },
                { semana: 'Semana 4', titulo: 'Capacitaciones y puesta en marcha' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${ACCENT2}, ${ACCENT})` }}>
                    <span className="font-poppins font-black text-white text-[11px]">{i + 1}</span>
                  </div>
                  <div>
                    <p className="font-lato text-[11px] uppercase tracking-wider" style={{ color: `${ACCENT}80` }}>{step.semana}</p>
                    <p className="font-poppins font-bold text-white text-[14px]">{step.titulo}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 flex items-center gap-3"
              style={{ borderColor: 'rgba(255,255,255,.06)' }}>
              <Database className="w-3.5 h-3.5 flex-shrink-0 text-[#00bfa5]" />
              <p className="font-lato text-white/40 text-[13px]">
                <span className="text-[#00bfa5] font-semibold">Migración de datos:</span> proceso paralelo de ~2 semanas. Inicia con la recepción del export de Salesforce y finaliza con la validación de registros en HubSpot antes del go-live.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {SERVICIOS.map((srv, i) => {
              const Icon = srv.icon; const open = servicioActivo === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${ACCENT}40` : '1px solid rgba(255,255,255,.07)' }}>

                  <button onClick={() => setServicioActivo(open ? null : i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? `${ACCENT}18` : 'rgba(255,255,255,.05)' }}>
                      <Icon className={`w-4 h-4 transition-colors`} style={{ color: open ? ACCENT : 'rgba(255,255,255,.35)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-lato text-[12px] uppercase tracking-widest" style={{ color: `${ACCENT}90` }}>{srv.num}</span>
                      </div>
                      <p className={`font-poppins font-bold text-[18px] mt-0.5 ${open ? 'text-white' : 'text-white/70'}`}>{srv.nombre}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <div className="text-right hidden sm:block">
                        <p className="font-poppins font-black text-[15px]" style={{ color: ACCENT }}>{srv.precio}</p>
                        <p className="font-lato text-white/30 text-[12px] mt-0.5">{srv.duracion}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0`}
                        style={{ color: `${ACCENT}60`, transform: open ? 'rotate(90deg)' : undefined }} />
                    </div>
                  </button>

                  {open && (
                    <div className="px-4 sm:px-5 pb-6 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>

                      {/* Precio visible en móvil */}
                      <div className="sm:hidden mt-4 mb-4 rounded-xl px-4 py-3 flex items-center gap-3"
                        style={{ background: `${ACCENT}0c`, border: `1px solid ${ACCENT}20` }}>
                        <div>
                          <p className="font-poppins font-black text-[20px]" style={{ color: ACCENT }}>{srv.precio}</p>
                          <p className="font-lato text-white/40 text-[13px]">{srv.detallePrecio}</p>
                        </div>
                      </div>

                      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5" style={{ color: ACCENT }} /> Entregables
                          </p>
                          <ul className="space-y-2">
                            {srv.entregables.map((e, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: ACCENT }} />
                                <span className="font-lato text-white/65 text-[16px]">{e}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Fuera del alcance */}
                          <p className="font-poppins font-semibold text-white/35 text-[13px] uppercase tracking-wider mt-5 mb-3 flex items-center gap-1.5">
                            <XCircle className="w-3.5 h-3.5 text-white/30" /> Fuera del alcance
                          </p>
                          <ul className="space-y-1.5">
                            {srv.fuera.map((f, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <XCircle className="w-3 h-3 text-white/20 flex-shrink-0 mt-0.5" />
                                <span className="font-lato text-white/30 text-[14px]">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Actividades principales</p>
                          <ul className="space-y-2.5">
                            {srv.actividades.map((a, j) => (
                              <li key={j} className="font-lato text-white/50 text-[15px] leading-snug pl-3 border-l" style={{ borderColor: `${ACCENT2}40` }}>{a}</li>
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
          <TagLabel>04 — Inversión</TagLabel>
          <SectionTitle>Propuesta económica</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Dos servicios de pago único sin recurrencia mensual por parte de Sixteam. Las licencias de HubSpot se contratan directamente con HubSpot y se detallan al final de esta sección.
          </p>

          {/* Servicio 01 */}
          <div className="rounded-xl p-5 sm:p-6 mb-4 flex flex-col sm:flex-row gap-5 sm:items-start"
            style={{ background: `${ACCENT}06`, border: `1px solid ${ACCENT}22` }}>
            <div className="flex items-center gap-4 sm:w-[45%]">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${ACCENT}15`, border: `1px solid ${ACCENT}30` }}>
                <Settings className="w-5 h-5" style={{ color: ACCENT }} />
              </div>
              <div>
                <p className="font-poppins font-bold text-white/85 text-[17px]">Implementación HubSpot CRM</p>
                <p className="font-lato text-white/40 text-[13px] mt-0.5">Pago único al inicio del proyecto</p>
              </div>
            </div>
            <div className="sm:w-[25%]">
              <p className="font-poppins font-black text-[1.8rem]" style={{ color: ACCENT }}>
                USD $1.000<span className="font-lato font-normal text-white/40 text-[1rem]"> · pago único</span>
              </p>
              <p className="font-lato text-white/35 text-[13px] mt-0.5">≈ COP 3.667.000 (TRM ${TRM})</p>
            </div>
            <div className="sm:flex-1">
              <ul className="space-y-1">
                {[
                  'Configuración completa del portal HubSpot',
                  'Hasta 40 propiedades en Contact, Company y Deal',
                  '1 pipeline de ventas + 6 automatizaciones activas',
                  '6 informes personalizados en el panel de reportes',
                  'Hasta 7 usuarios configurados · capacitación incluida',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 flex-shrink-0 mt-[3px]" style={{ color: ACCENT }} />
                    <span className="font-lato text-white/55 text-[14px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Servicio 02 */}
          <div className="rounded-xl p-5 sm:p-6 mb-4 flex flex-col sm:flex-row gap-5 sm:items-start"
            style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.2)' }}>
            <div className="flex items-center gap-4 sm:w-[45%]">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.3)' }}>
                <Database className="w-5 h-5 text-[#00bfa5]" />
              </div>
              <div>
                <p className="font-poppins font-bold text-white/85 text-[17px]">Migración de Datos · Salesforce → HubSpot</p>
                <p className="font-lato text-white/40 text-[13px] mt-0.5">Pago único · hasta 5.000 registros</p>
              </div>
            </div>
            <div className="sm:w-[25%]">
              <p className="font-poppins font-black text-[1.8rem] text-[#00bfa5]">
                USD $2.000
              </p>
              <p className="font-lato text-white/35 text-[13px] mt-0.5">≈ COP 7.334.000 (TRM ${TRM})</p>
            </div>
            <div className="sm:flex-1">
              <ul className="space-y-1">
                {[
                  'Análisis, mapeo y validación de campos',
                  'Limpieza, estandarización y deduplicación',
                  'Importación con asociaciones y asignaciones',
                  'Reporte de calidad y validación final',
                  'Una ronda de correcciones post-importación',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-[#00bfa5] flex-shrink-0 mt-[3px]" />
                    <span className="font-lato text-white/55 text-[14px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Resumen de inversión — estático */}
          <div className="rounded-2xl p-6 sm:p-7 mb-4" style={{ background: `${ACCENT}06`, border: `1px solid ${ACCENT}20` }}>
            <p className="font-lato text-white/35 text-[13px] uppercase tracking-widest mb-4">Resumen de inversión · servicios Sixteam</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                <p className="font-lato text-white/35 text-[13px] uppercase tracking-wider mb-1">Implementación HubSpot CRM</p>
                <p className="font-poppins font-black text-white text-[1.2rem]">USD $1.000<span className="text-white/40 text-[0.85rem] font-lato font-normal"> · único</span></p>
                <p className="font-lato text-[12px] mt-0.5" style={{ color: `${ACCENT}aa` }}>≈ COP 3.667.000 (TRM ${TRM})</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                <p className="font-lato text-white/35 text-[13px] uppercase tracking-wider mb-1">Migración de Datos</p>
                <p className="font-poppins font-black text-white text-[1.2rem]">USD $2.000<span className="text-white/40 text-[0.85rem] font-lato font-normal"> · único</span></p>
                <p className="font-lato text-[12px] mt-0.5" style={{ color: `${ACCENT}aa` }}>≈ COP 7.334.000 (TRM ${TRM})</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}25` }}>
                <p className="font-lato text-[13px] uppercase tracking-wider mb-1" style={{ color: `${ACCENT}90` }}>Total servicios Sixteam</p>
                <p className="font-poppins font-black text-white text-[1.2rem]">USD $3.000</p>
                <p className="font-lato text-[12px] mt-0.5" style={{ color: `${ACCENT}aa` }}>≈ COP 11.001.000 (TRM ${TRM})</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {[
                'Ambos servicios son pagos únicos — sin recurrencia de Sixteam',
                'Implementación: 50% al inicio / 50% en la entrega y capacitación',
                'Migración: 50% al recibir el export de Salesforce / 50% en la validación final',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: ACCENT }} />
                  <span className="font-lato text-white/50 text-[13px]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Soporte y Mejora Continua — acordeón opcional */}
          <div className="rounded-xl overflow-hidden transition-all duration-300 mb-3"
            style={{ background: 'rgba(255,255,255,.03)', border: cotizActivo === 'soporte' ? `1px solid ${ACCENT}40` : '1px solid rgba(255,255,255,.08)' }}>
            <button onClick={() => setCotizActivo(cotizActivo === 'soporte' ? null : 'soporte')}
              className="w-full flex items-center gap-3 px-5 py-4 text-left">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: cotizActivo === 'soporte' ? `${ACCENT}18` : 'rgba(255,255,255,.05)' }}>
                <Zap className="w-4 h-4" style={{ color: cotizActivo === 'soporte' ? ACCENT : 'rgba(255,255,255,.35)' }} />
              </div>
              <div className="flex-1 flex flex-wrap items-center gap-2">
                <span className={`font-poppins font-bold text-[16px] ${cotizActivo === 'soporte' ? 'text-white' : 'text-white/65'}`}>
                  Soporte y Mejora Continua
                </span>
                <span className="font-lato text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}25`, color: ACCENT }}>
                  Opcional
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="font-poppins font-black text-[15px] hidden sm:block" style={{ color: ACCENT }}>
                  COP 600.000<span className="font-lato font-normal text-white/35 text-[12px]">/mes</span>
                </span>
                <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                  style={{ color: `${ACCENT}60`, transform: cotizActivo === 'soporte' ? 'rotate(90deg)' : undefined }} />
              </div>
            </button>
            {cotizActivo === 'soporte' && (
              <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                <div className="pt-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <p className="font-poppins font-black text-[1.5rem]" style={{ color: ACCENT }}>
                      COP 600.000<span className="font-lato font-normal text-white/40 text-[1rem]">/mes</span>
                    </p>
                    <span className="font-lato text-[12px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}25`, color: ACCENT }}>
                      5h/mes
                    </span>
                  </div>
                  <p className="font-lato text-white/45 text-[15px] leading-relaxed">
                    Servicio opcional de acompañamiento mensual una vez finalizada la implementación. Cubre ajustes, capacitación adicional e identificación de nuevas oportunidades de optimización en el CRM.
                  </p>
                  <ul className="space-y-2 mt-2">
                    {[
                      'Capacitación continua del equipo: resolución de dudas, refuerzo de flujos y nuevas funcionalidades',
                      'Corrección de errores de configuración o comportamientos no esperados en el portal',
                      'Levantamiento de oportunidades de mejora: nuevas automatizaciones, ajustes al pipeline o propiedades adicionales',
                      'Consultoría estratégica: recomendaciones de uso del CRM alineadas con los objetivos comerciales del equipo',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: ACCENT }} />
                        <span className="font-lato text-white/55 text-[14px]">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="font-lato text-white/30 text-[13px] leading-relaxed mt-1">
                    Las horas no utilizadas en el mes no son acumulables. El servicio puede contratarse o cancelarse con 15 días de anticipación.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Licencias HubSpot — acordeón */}
          <div className="rounded-xl overflow-hidden transition-all duration-300"
            style={{ background: 'rgba(255,255,255,.03)', border: cotizActivo === 'licencias' ? `1px solid ${ACCENT}40` : '1px solid rgba(255,255,255,.08)' }}>
            <button onClick={() => setCotizActivo(cotizActivo === 'licencias' ? null : 'licencias')}
              className="w-full flex items-center gap-3 px-5 py-4 text-left">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: cotizActivo === 'licencias' ? `${ACCENT}18` : 'rgba(255,255,255,.05)' }}>
                <Info className="w-4 h-4" style={{ color: cotizActivo === 'licencias' ? ACCENT : 'rgba(255,255,255,.35)' }} />
              </div>
              <span className={`font-poppins font-bold text-[16px] flex-1 ${cotizActivo === 'licencias' ? 'text-white' : 'text-white/65'}`}>
                Licencias HubSpot — costo adicional
              </span>
              <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                style={{ color: `${ACCENT}60`, transform: cotizActivo === 'licencias' ? 'rotate(90deg)' : undefined }} />
            </button>
            {cotizActivo === 'licencias' && (
              <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                <div className="pt-4 space-y-3">
                  <p className="font-lato text-white/45 text-[15px] leading-relaxed">
                    Las licencias de HubSpot Sales Hub Pro las adquiere el cliente directamente con HubSpot y se pagan por separado de los servicios Sixteam. Durante el diagnóstico se estimó un costo mensual aproximado de <strong className="text-white/65">COP 750.000/mes</strong> para la estructura propuesta: 2 licencias Pro para los comerciales más un acceso complementario para gerencia y finanzas.
                  </p>
                  <p className="font-lato text-white/30 text-[14px] leading-relaxed">
                    Las condiciones comerciales exactas (descuentos por volumen, pago anual vs. mensual) se negocian directamente entre el cliente y HubSpot. Sixteam acompaña ese proceso sin costo adicional.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ─ 05 POR QUÉ SIXTEAM ─ */}
        <section id="porque-sixteam" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Por qué Sixteam</TagLabel>
          <SectionTitle>La elección que respalda el proyecto</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden mb-6"
            style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${ACCENT}0a, transparent 70%)`, transform: 'translate(20%,-20%)' }} />
            <div className="space-y-4 font-lato text-white/60 text-[18px] leading-relaxed">
              <p>
                Antes de tocar una sola configuración en HubSpot, Sixteam dedica el tiempo necesario a <strong className="text-white/90 font-semibold">entender al 100% la operativa comercial del cliente</strong>: cómo vende el equipo, cómo hace seguimiento, qué información es crítica y cuáles son los cuellos de botella reales. Esa comprensión es la base de todo lo que se implementa.
              </p>
              <p>
                No somos un equipo técnico que recibe un brief y ejecuta. Somos un equipo todo en uno con experiencia en <strong className="text-white/90 font-semibold">transformación digital, procesos comerciales, tecnología y estrategia de negocio</strong>, que trabaja de manera colaborativa con el cliente para garantizar que cada configuración tenga sentido operativo y no solo técnico.
              </p>
              <p>
                El resultado es una implementación segura y escalable: una plataforma que el equipo usa con confianza desde el primer día y que tiene la estructura correcta para seguir creciendo con el negocio.
              </p>
            </div>
          </div>

          {/* Diferenciadores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              {
                titulo: 'Diagnóstico antes de implementar',
                desc: 'Llegamos con el mapa de la operación ya trazado. El alcance de la implementación responde directamente a las brechas identificadas, no a un catálogo estándar de servicios.',
                icon: Target,
              },
              {
                titulo: 'Más de 4 años implementando HubSpot',
                desc: 'Contamos con experiencia real en implementaciones de HubSpot para empresas colombianas, incluyendo agencias de viajes y operaciones comerciales en el sector turístico — exactamente el contexto de Metropolitan Touring.',
                icon: Zap,
              },
              {
                titulo: 'Especialistas en el sector turístico',
                desc: 'Conocemos el ciclo del cliente de agencia: desde la primera consulta hasta el cierre y el seguimiento post-venta. Eso nos permite diseñar pipelines y automatizaciones que reflejan cómo realmente opera un equipo comercial de viajes.',
                icon: Plane,
              },
              {
                titulo: 'Acompañamiento real en la adopción',
                desc: 'No entregamos accesos y un tutorial. Configuramos, capacitamos y acompañamos hasta que la plataforma opere de forma autónoma y el equipo la use como una herramienta de venta, no como una obligación.',
                icon: Users,
              },
            ].map(({ titulo, desc, icon: Icon }) => (
              <div key={titulo} className="rounded-xl p-5 flex gap-4"
                style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}20` }}>
                  <Icon className="w-4 h-4" style={{ color: ACCENT }} />
                </div>
                <div>
                  <p className="font-poppins font-bold text-white text-[16px] mb-1">{titulo}</p>
                  <p className="font-lato text-white/50 text-[14px] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Fórmula Sixteam */}
          <div className="rounded-2xl p-6 text-center"
            style={{ background: `linear-gradient(135deg, ${ACCENT}06, #00bfa508)`, border: `1px solid ${ACCENT}15` }}>
            <p className="font-poppins font-black text-white/85 text-[1.05rem] tracking-widest uppercase">
              Process + Technology + People = <span style={{ color: ACCENT }}>Growth</span>
            </p>
            <p className="font-lato text-white/35 text-[14px] mt-2">La fórmula que Sixteam.pro aplica en cada proyecto.</p>
          </div>
        </section>

        {/* ─ 06 VIGENCIA ─ */}
        <section id="vigencia" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 — Vigencia y términos</TagLabel>
          <SectionTitle>Próximos pasos</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-6 sm:p-8 mb-6 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
              style={{ background: `radial-gradient(circle,${ACCENT}08,transparent)`, transform: 'translate(20%,-20%)' }} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
              {[
                { label: 'Vigencia de la propuesta', valor: '15 días calendario', sub: 'desde el 25 de mayo de 2026' },
                { label: 'Plazo objetivo del proyecto', valor: '1 de agosto de 2026', sub: 'fecha de separación de la casa matriz' },
                { label: 'Moneda de facturación', valor: 'COP + USD', sub: 'según cada servicio' },
              ].map(({ label, valor, sub }) => (
                <div key={label} className="rounded-xl p-4"
                  style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}18` }}>
                  <p className="font-lato text-white/35 text-[13px] uppercase tracking-wider mb-1">{label}</p>
                  <p className="font-poppins font-black text-white text-[17px]">{valor}</p>
                  <p className="font-lato text-white/35 text-[13px] mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

              <div className="space-y-3 font-lato text-white/55 text-[16px] leading-relaxed">
              <p>
                Los valores expresados en COP no incluyen IVA. Los valores en USD se liquidan a la TRM del día de pago. Esta propuesta es válida por <strong className="text-white/80">15 días calendario</strong> desde la fecha de la reunión de diagnóstico (25 de mayo de 2026). Pasado ese plazo, los valores y condiciones pueden ajustarse.
              </p>
              <p>
                Para dar inicio al proyecto, Sixteam requiere la confirmación formal por escrito y el pago del primer desembolso. Una vez confirmado, el equipo agenda la sesión de arranque dentro de los <strong className="text-white/80">5 días hábiles</strong> siguientes.
              </p>
            </div>
          </div>

          {/* Términos expandibles */}
          <div className="space-y-2.5 mb-8">
            {[
              {
                titulo: 'Aprobación y confirmación',
                desc: 'Para aceptar esta propuesta y dar inicio al proyecto se requiere confirmación por escrito —vía correo, WhatsApp o mensaje directo— que habilite el envío del contrato a firmar y el primer desembolso.',
                icon: CheckCircle,
              },
              {
                titulo: 'Términos de pago · Implementación',
                desc: 'Esquema del 50% del valor al confirmar el proyecto y el 50% restante al finalizar la puesta en marcha y la sesión de capacitación con el equipo.',
                icon: FileText,
              },
              {
                titulo: 'Términos de pago · Migración de datos',
                desc: 'El 50% se factura al recibir el export completo de Salesforce y el 50% restante al entregar el reporte de validación final con los registros migrados.',
                icon: Database,
              },
              {
                titulo: 'Ajuste de TRM',
                desc: 'Los valores en USD se liquidan en COP a la TRM del día del pago. La TRM de referencia en esta propuesta ($3.667) es indicativa. La factura reflejará el valor vigente al momento de emitirla.',
                icon: Info,
              },
              {
                titulo: 'Modificaciones al alcance',
                desc: 'Cualquier funcionalidad o configuración no contemplada explícitamente en el alcance requiere una nueva cotización. Las solicitudes adicionales pueden afectar los tiempos de entrega y se evalúan caso por caso.',
                icon: AlertCircle,
              },
              {
                titulo: 'Inicio del proyecto',
                desc: 'El cronograma de trabajo inicia desde la recepción del primer pago y la entrega de los accesos e información necesaria. El equipo agenda la sesión de arranque dentro de los 5 días hábiles siguientes a la confirmación.',
                icon: Zap,
              },
            ].map((term, i) => {
              const Icon = term.icon; const open = termActivo === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${ACCENT}30` : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setTermActivo(open ? null : i)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: open ? ACCENT : 'rgba(255,255,255,.3)' }} />
                    <span className={`font-poppins font-semibold text-[15px] flex-1 ${open ? 'text-white/90' : 'text-white/55'}`}>
                      {term.titulo}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200"
                      style={{ color: `${ACCENT}50`, transform: open ? 'rotate(90deg)' : undefined }} />
                  </button>
                  {open && (
                    <div className="px-4 pb-4 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <p className="font-lato text-white/50 text-[15px] leading-relaxed pt-3">{term.desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA contacto */}
          <div className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
            style={{ background: `linear-gradient(135deg, ${ACCENT}10, ${ACCENT2}06)`, border: `1px solid ${ACCENT}25` }}>
            <div className="flex-1">
              <p className="font-poppins font-extrabold text-white text-[22px] mb-1">¿Listos para arrancar?</p>
              <p className="font-lato text-white/50 text-[16px] leading-relaxed">
                Responde a esta propuesta o contáctanos directamente para confirmar el inicio del proyecto y garantizar el cumplimiento del plazo del 1 de agosto.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <a href={`mailto:${META.correo}`}
                className="flex items-center gap-2.5 px-5 py-3 rounded-xl font-poppins font-bold text-[14px] text-white transition-all duration-200 no-print"
                style={{ background: `linear-gradient(135deg, ${ACCENT2}, ${ACCENT})` }}
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
                Ernesto Hernández · Sixteam.pro
              </a>
            </div>
          </div>

          {/* Firma */}
          <div className="mt-10 pt-8 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            style={{ borderColor: 'rgba(255,255,255,.06)' }}>
            <div>
              <p className="font-poppins font-black text-white text-[18px]">Sixteam<span style={{ color: ACCENT }}>.</span>pro</p>
              <p className="font-lato text-white/35 text-[13px]">Innovación y Estrategia Digital S.A.S.</p>
              <p className="font-lato text-white/25 text-[13px]">NIT {META.nit} · R.L. {META.rl}</p>
            </div>
            <div className="sm:text-center">
              <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider">Elaborado por</p>
              <p className="font-poppins font-bold text-white/70 text-[15px]">Ernesto Hernández</p>
              <p className="font-lato text-white/35 text-[13px]">Gerente Comercial · Sixteam.pro</p>
            </div>
            <div className="sm:text-right">
              <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider">Preparado para</p>
              <p className="font-poppins font-bold text-white/60 text-[15px]">{META.contacto}</p>
              <p className="font-lato text-white/35 text-[13px]">{META.cargo} · {META.cliente}</p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="text-center py-8 border-t"
        style={{ borderColor: 'rgba(255,255,255,.05)' }}>
        <p className="font-lato text-white/20 text-[13px]">
          Sixteam.pro · NIT {META.nit} · {META.correo} · Documento confidencial
        </p>
      </footer>

    </div>
  );
};

export default MetropolitanTouringProposal;
