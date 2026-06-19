import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap, BarChart3,
  AlertCircle, TrendingUp, Info, Calendar, MapPin,
  Rocket, Users, Shield, Database, Settings, Bell, Lock,
  DollarSign, Layers, GitBranch, Eye, Activity,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'SIAR S.A.S.',
  tagline: 'Gestión Documental · Archivo · Digitalización',
  sector: 'Gestión documental · Custodia · Digitalización · Colombia',
  sede: 'Colombia',
  fecha: 'Junio 2026',
  lugar: 'Colombia',
  objetivo: 'Una plataforma financiero-operativa a la medida que le da a SIAR visibilidad real de sus proyectos: costos, presupuesto, rentabilidad y alertas — en tiempo real, sin depender del área contable.',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
};

const SIAR_BLUE = '#1a6fb4';

const HALLAZGOS = [
  {
    titulo: 'Sin visibilidad en tiempo real del presupuesto por proyecto',
    desc: 'Actualmente, para saber cuánto se ha gastado en un proyecto, el equipo debe solicitar un corte al área contable. No existe una forma de entrar a una herramienta y ver el estado financiero de un proyecto en ese preciso momento.',
    icon: Eye, tint: 'red',
  },
  {
    titulo: 'Nómina e insumos desconectados de la rentabilidad del proyecto',
    desc: 'Los gastos de nómina, horas hombre e insumos no están correctamente asignados a los proyectos que los originan. Esto impide conocer la utilidad real por proyecto y genera distorsión en los costos reportados.',
    icon: AlertCircle, tint: 'amber',
  },
  {
    titulo: 'Sin visión clara: precio de venta vs. costo real vs. flujo de caja',
    desc: 'El área comercial cotiza con base en un tarifario actualizado anualmente con el IPC, sin un modelo de costos reales que respalde el precio. No se sabe con exactitud si un proyecto es rentable hasta que ya está ejecutado.',
    icon: TrendingUp, tint: 'blue',
  },
  {
    titulo: 'Sin alertas financieras por desviaciones',
    desc: 'Cuando el gasto de un proyecto se sale del presupuesto estimado, no hay ningún mecanismo que genere una alerta. Las decisiones correctivas llegan tarde, cuando el margen ya se ha consumido.',
    icon: Bell, tint: 'purple',
  },
  {
    titulo: 'Aprobaciones sin soporte en datos',
    desc: 'Los filtros comercial, operativo y financiero que exige la norma ISO 9001 se responden de forma subjetiva o estimada. Las decisiones de "¿vale la pena este proyecto?" no están respaldadas en un análisis financiero real.',
    icon: Target, tint: 'teal',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber:  { text: '#f59e0b',   bg: 'rgba(251,191,36,.07)',   border: 'rgba(251,191,36,.18)' },
  teal:   { text: '#00bfa5',   bg: 'rgba(0,191,165,.07)',    border: 'rgba(0,191,165,.18)'  },
  blue:   { text: '#3b82f6',   bg: 'rgba(59,130,246,.07)',   border: 'rgba(59,130,246,.18)' },
  red:    { text: '#f87171',   bg: 'rgba(221,51,51,.07)',    border: 'rgba(221,51,51,.2)'   },
  purple: { text: '#a78bfa',   bg: 'rgba(167,139,250,.07)',  border: 'rgba(167,139,250,.18)'},
};

// ─── MÓDULOS ─────────────────────────────────────────────────────────────────

type Actividad = { text: string; tag?: string };

const MODULOS = [
  {
    num: '01',
    nombre: 'Panel de control financiero por proyecto',
    duracion: 'Fase MVP',
    icon: BarChart3,
    color: SIAR_BLUE,
    colorAlpha: 'rgba(26,111,180,.12)',
    colorBorder: 'rgba(26,111,180,.3)',
    descripcion: 'El primer entregable es un dashboard que le da a SIAR visibilidad inmediata del estado financiero de cada proyecto: lo que se vendió, lo que se presupuestó, lo que se ha gastado y lo que se espera gastar según el avance. Es la primera gran victoria: sin necesidad de pedirle un corte al área contable.',
    actividades: [
      { text: 'Dashboard por proyecto con: valor vendido (precio de cierre), presupuesto estimado, gasto real causado, gasto esperado según avance y margen real vs. estimado', tag: 'Core' },
      { text: 'Dos vistas diferenciadas: flujo de caja (cuándo entra y sale el dinero) y rentabilidad/costo del proyecto (utilidad real)' },
      { text: 'Indicadores de desviación: alertas visuales cuando el gasto real supera el esperado o cuando el margen entra en zona de riesgo' },
      { text: 'Carga inicial de información desde SIIGO mediante archivo plano exportado — sin integración compleja en esta fase', tag: 'MVP' },
      { text: 'Vista consolidada: todos los proyectos activos con su estado de salud financiera de un vistazo' },
      { text: 'Acceso diferenciado por rol desde el primer día: visualización gerencial para el señor Freddy, y vistas operativas para los líderes de proyecto' },
    ] as Actividad[],
  },
  {
    num: '02',
    nombre: 'Calculadora de pricing y módulo de presupuesto',
    duracion: 'Fase MVP',
    icon: DollarSign,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.3)',
    descripcion: 'La herramienta que le permite al líder de proyecto construir el presupuesto específico de cada proyecto: qué necesita, en qué cantidades, por cuánto tiempo y a qué costo. A partir de ahí, la herramienta calcula el costo total, la utilidad esperada y el precio de venta mínimo viable.',
    actividades: [
      { text: 'Módulo de creación de presupuesto por proyecto: el líder selecciona servicios, cantidades, tiempos de ejecución y recursos necesarios', tag: 'Core' },
      { text: 'Cálculo automático de costos totales: mano de obra, insumos, costos indirectos, administración, imprevistos, IVA y utilidad esperada' },
      { text: 'Visualización del precio de venta mínimo para alcanzar el margen objetivo — el comercial sabe hasta dónde puede negociar' },
      { text: 'Soporte para proyectos multi-mes con inicio diferenciado por servicio (ej. custodia desde mes 1, digitalización desde mes 10)' },
      { text: 'Campos para costos de tipo único (digitalización) y recurrentes (custodia mensual) con flujo de caja automático por período' },
      { text: 'Módulo de validación operativa: el director de operaciones confirma capacidad instalada y asignación de recursos antes de aprobar la propuesta comercial', tag: 'Decisión data-driven' },
    ] as Actividad[],
  },
  {
    num: '03',
    nombre: 'Matriz de costos, alertas e integración SIIGO',
    duracion: 'Evolución',
    icon: Settings,
    color: '#f59e0b',
    colorAlpha: 'rgba(245,158,11,.10)',
    colorBorder: 'rgba(245,158,11,.3)',
    descripcion: 'Una vez el MVP esté en producción y el equipo empiece a cargar datos reales, construimos la capa de inteligencia: la matriz de costos parametrizable que evoluciona con el negocio, las alertas automáticas por desviación y la integración directa con SIIGO para eliminar la carga manual de información.',
    actividades: [
      { text: 'Matriz de costos parametrizable por categoría: mano de obra, insumos, tecnología, logística, gastos administrativos — actualizable por el equipo sin necesidad de desarrollo', tag: 'Parametrizable' },
      { text: 'Costos estándar por rol/perfil/día como base inicial (archivista, técnico, auxiliar), con posibilidad de evolucionar hacia costos reales por horas hombre' },
      { text: 'Sistema de alertas configurables: cuando el gasto real supera el presupuestado, cuando una categoría se acerca al tope o cuando el margen entra en zona de riesgo' },
      { text: 'Integración API con SIIGO: sincronización automática de causaciones y centros de costo — elimina la carga manual de archivos planos', tag: 'Fase posterior' },
      { text: 'Prorrateo de gastos administrativos y de talento humano entre proyectos según participación en ventas o horas hombre registradas' },
      { text: 'Modelo de depreciación de activos: posibilidad de asignar un porcentaje de uso de un activo (escáner, bodega) a un proyecto específico' },
    ] as Actividad[],
  },
];

// ─── DESGLOSE ────────────────────────────────────────────────────────────────

const DESGLOSE = [
  {
    categoria: 'Dashboard financiero por proyecto',
    icon: BarChart3,
    color: SIAR_BLUE,
    items: [
      'Vista por proyecto con: valor vendido, presupuesto estimado, gasto real, gasto esperado según avance del proyecto y margen estimado vs. real',
      'Vista de flujo de caja separada de la vista de rentabilidad/costo — porque son dos análisis con lógicas distintas',
      'Indicadores de salud financiera por proyecto: verde (en control), amarillo (alerta) y rojo (desviación crítica)',
      'Vista consolidada de todos los proyectos activos: el señor Freddy puede ver de un solo vistazo cuáles están en riesgo',
      'Histórico de proyectos cerrados para análisis de rentabilidad real vs. estimada',
      'Exportación de reportes por proyecto en formato descargable',
    ],
  },
  {
    categoria: 'Módulo de presupuesto y calculadora de pricing',
    icon: DollarSign,
    color: '#00bfa5',
    items: [
      'Constructor de presupuesto por proyecto: selección de ítems, cantidades, tiempos de ejecución y costos unitarios',
      'Cálculo automático del precio de venta mínimo a partir del costo total, los márgenes esperados y los factores como administración, imprevistos e impuestos',
      'Soporte para múltiples tipos de costo en un mismo proyecto: único (digitalización), mensual recurrente (custodia) y por evento',
      'Módulo de inicio diferenciado por servicio: posibilidad de indicar que un servicio arranca en el mes N del proyecto para calcular el flujo de caja real',
      'Validación operativa integrada: el director de operaciones revisa y confirma la capacidad antes de aprobar la propuesta al cliente',
      'Validación financiera integrada: el área financiera revisa la viabilidad del proyecto con datos reales antes de dar el go comercial',
      'Historial de versiones del presupuesto por proyecto',
    ],
  },
  {
    categoria: 'Matriz de costos parametrizable',
    icon: Layers,
    color: '#f59e0b',
    items: [
      'Catálogo de ítems de costo organizado por categoría: mano de obra, insumos, tecnología, logística, viáticos, servicios externos',
      'Costos estándar por rol como punto de partida: archivista, técnico de archivo, auxiliar, coordinador técnico — actualizables por el equipo',
      'Posibilidad de agregar nuevos ítems de costo desde la interfaz, sin necesidad de desarrollo',
      'Actualización periódica de precios unitarios sin tocar el código — la herramienta está diseñada para ser administrada por el equipo de SIAR',
      'Evolución hacia costeo por horas hombre: en fases posteriores, conectar las horas reales registradas en las herramientas operativas con el costo real del proyecto',
      'Soporte para factores de depreciación de activos: asignar un porcentaje de uso de equipo (escáner, estantería, bodega) a proyectos específicos',
    ],
  },
  {
    categoria: 'Sistema de alertas y notificaciones',
    icon: Bell,
    color: '#a78bfa',
    items: [
      'Alertas automáticas cuando el gasto real supera el gasto esperado según el avance del proyecto',
      'Alertas por categoría: cuando una línea de costo (nómina, viáticos, insumos) se acerca al tope presupuestado',
      'Alertas de margen: cuando el margen real del proyecto entra en zona de riesgo o se vuelve negativo',
      'Notificaciones configurables por rol: el señor Freddy recibe alertas de nivel gerencial, los líderes de proyecto reciben alertas de su propio proyecto',
      'Umbral de alerta configurable por tipo de desviación (ej. alertar desde el 80% de consumo del presupuesto de una categoría)',
      'Registro de alertas históricas: quién recibió qué alerta y cuándo, para trazabilidad',
    ],
  },
  {
    categoria: 'Roles diferenciados y control de acceso',
    icon: Lock,
    color: '#34d399',
    items: [
      'Rol gerencial (señor Freddy y Joel): visualización completa de todos los proyectos, dashboards consolidados, margen global de la empresa',
      'Rol de dirección operativa: asignación de recursos por proyecto, estimación de horas y capacidad instalada, validación operativa de propuestas',
      'Rol de dirección administrativa: gestión de insumos y papelería, control de gastos administrativos, categorización de ítems',
      'Rol financiero/contable: carga de información desde SIIGO, revisión de causaciones, validación financiera de propuestas',
      'Rol de líder de proyecto: creación y edición de presupuesto propio, seguimiento de gastos del proyecto asignado, solicitud de recursos',
      'Rol de administrador del sistema: gestión de usuarios, permisos, catálogo de costos y configuración general de la herramienta',
    ],
  },
  {
    categoria: 'Integración con SIIGO y Zoho CRM',
    icon: GitBranch,
    color: '#60a5fa',
    items: [
      'Fase 1 (MVP): carga de información desde SIIGO mediante archivo plano exportado — el equipo sube el reporte de causaciones periódicamente y la herramienta lo procesa',
      'Fase 2: integración API con SIIGO para sincronización automática de movimientos contables, centros de costo y causaciones — sin carga manual',
      'Cruce automático entre el presupuesto del proyecto y las causaciones reales por centro de costo desde SIIGO',
      'Conexión con Zoho CRM: cuando un negocio cierra en el CRM, el valor del trato y los servicios vendidos se registran automáticamente como insumos del presupuesto',
      'Los checks de aprobación comercial/operativa/financiera que hoy se hacen en el CRM pueden alimentarse con data real de la herramienta — cerrando el ciclo entre comercial y financiero',
      'La herramienta actúa como sistema de registro financiero-operativo, complementario (no sustituto) del sistema contable SIIGO',
    ],
  },
];

const SECCIONES = [
  { id: 'resumen',    label: 'Resumen'   },
  { id: 'solucion',  label: 'Solución'  },
  { id: 'modulos',   label: 'Módulos'   },
  { id: 'alcance',   label: 'Alcance'   },
  { id: 'inversion', label: 'Inversión' },
  { id: 'vigencia',  label: 'Vigencia'  },
];

// ─── OPCIONES DE INVERSIÓN ───────────────────────────────────────────────────

const OPCIONES = [
  {
    num: '01',
    titulo: 'Modelo Sixteam como propietario y administrador',
    subtitulo: 'La herramienta como servicio administrado',
    color: SIAR_BLUE,
    colorAlpha: 'rgba(26,111,180,.10)',
    colorBorder: 'rgba(26,111,180,.30)',
    implementacion: '$12.000.000 COP',
    mensualidad: '$3.990.000 COP/mes',
    permanencia: 'Permanencia mínima: 12 meses',
    total: '$59.880.000 COP',
    totalLabel: 'Total primer año',
    badge: 'Recomendada',
    puntos: [
      'Uso de la herramienta, administración y soporte funcional incluidos',
      'Mantenimiento correctivo y ajustes menores sin costo adicional',
      'Respaldo, acompañamiento mensual y evolución controlada',
      'SIAR es dueño de sus datos — Sixteam conserva la propiedad del código base y los componentes reutilizables',
      'Hasta 20 horas mensuales de soporte y operación incluidas',
    ],
    nota: 'Ideal para equipos que quieren foco en el negocio, no en la administración técnica de una herramienta.',
  },
  {
    num: '02',
    titulo: 'Propiedad SIAR con administración Sixteam',
    subtitulo: 'SIAR dueño del desarrollo, Sixteam a cargo de la operación',
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.30)',
    implementacion: '$20.000.000 COP',
    mensualidad: '$2.990.000 COP/mes',
    permanencia: 'Permanencia mínima: 6 meses',
    total: 'Desde $37.940.000 hasta $55.880.000 COP',
    totalLabel: 'Rango primer año',
    badge: null,
    puntos: [
      'SIAR queda como propietario de la herramienta desarrollada específicamente para su operación',
      'Sixteam mantiene la administración técnica, ajustes, soporte y evolución',
      'Sixteam conserva metodologías, componentes genéricos y librerías reutilizables no confidenciales',
      'Hasta 15 horas mensuales de soporte incluidas',
      'SIAR puede decidir tomar control técnico total en cualquier momento tras el período mínimo',
    ],
    nota: 'Para organizaciones que valoran la propiedad del activo digital sin sacrificar el acompañamiento experto.',
  },
  {
    num: '03',
    titulo: 'Desarrollo completo con entrega y transferencia',
    subtitulo: 'Sixteam desarrolla, documenta y entrega todo',
    color: '#f59e0b',
    colorAlpha: 'rgba(245,158,11,.10)',
    colorBorder: 'rgba(245,158,11,.30)',
    implementacion: '$50.000.000 COP',
    mensualidad: 'Desde $1.900.000 COP/mes',
    permanencia: 'Soporte posterior opcional (10h/mes)',
    total: '$50.000.000 COP',
    totalLabel: 'Valor único de desarrollo',
    badge: null,
    puntos: [
      'Desarrollo completo, documentación funcional y técnica incluidas',
      'Capacitación al equipo de SIAR para administrar la herramienta de forma autónoma',
      'Entrega del repositorio de código y transferencia completa de administración',
      'Garantía correctiva limitada de 30 a 60 días después de la entrega',
      'Sixteam entrega la propiedad total — incluyendo estructura, código y componentes desarrollados para SIAR',
    ],
    nota: 'Para organizaciones con equipo técnico interno que deseen tomar control total del activo en el largo plazo.',
  },
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
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: `linear-gradient(90deg,${SIAR_BLUE},#00bfa5)` }} />
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const SiarProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [moduloActivo, setModuloActivo] = useState<number | null>(null);
  const [desgloseActivo, setDesgloseActivo] = useState<number | null>(null);
  const [opcionActiva, setOpcionActiva] = useState<number | null>(0);

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
            style={{ background: `radial-gradient(circle, rgba(26,111,180,.06) 0%, transparent 65%)` }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(29,112,162,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
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
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center flex-shrink-0 h-9">
                <img src="/siar-logo.jpg" alt="SIAR S.A.S." className="h-full w-auto object-contain rounded"
                  style={{ filter: 'drop-shadow(0 1px 4px rgba(26,111,180,.3))' }} />
              </div>
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
              <TagLabel>Propuesta de trabajo y cotización · Solución Financiero-Operativa</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${SIAR_BLUE}, #1557a0)` }}>
                  <BarChart3 className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: `rgba(26,111,180,.12)`, border: `1px solid rgba(26,111,180,.28)`, color: '#60a5fa' }}>
                  {META.sector.split('·')[0].trim()}
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 4.8rem)' }}>
                Solución<br />
                <span style={{ background: `linear-gradient(90deg,${SIAR_BLUE},#00bfa5)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Financiera
                </span>
                <br />
                <span className="text-white/80">a la Medida</span>
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
                  {['1. Resumen ejecutivo','2. Solución propuesta','3. Módulos del sistema','4. Alcance de servicios','5. Propuesta de inversión','6. Vigencia y términos'].map((item, i) => (
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
                  style={{ background: `radial-gradient(circle, rgba(26,111,180,.08) 0%, rgba(0,191,165,.04) 50%, transparent 70%)` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full" style={{ border: `1px solid rgba(26,111,180,.12)` }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(0,191,165,.15)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: SIAR_BLUE, boxShadow: `0 0 6px rgba(26,111,180,.8)` }} />
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
                    style={{ background: `linear-gradient(135deg, rgba(26,111,180,.18), rgba(26,111,180,.06))`, border: `1px solid rgba(26,111,180,.3)`, boxShadow: `0 4px 30px rgba(26,111,180,.18)` }}>
                    <img src="/siar-logo.jpg" alt="SIAR S.A.S." className="h-14 w-auto object-contain rounded"
                      style={{ filter: 'drop-shadow(0 2px 12px rgba(26,111,180,.5))' }} />
                  </div>
                  <div className="text-center">
                    <p className="font-poppins font-bold text-white/80 text-[17px] tracking-tight">SIAR S.A.S.</p>
                    <p className="font-lato text-[13px] uppercase tracking-[0.2em] mt-1" style={{ color: '#60a5fa' }}>Gestión Documental · Colombia</p>
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
            style={{ background: 'rgba(2,8,20,.85)', border: `1px solid rgba(26,111,180,.20)` }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="rounded-xl p-4 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, rgba(26,111,180,.18), rgba(26,111,180,.06))`, border: `1px solid rgba(26,111,180,.3)` }}>
                <img src="/siar-logo.jpg" alt="SIAR S.A.S." className="h-10 w-auto object-contain rounded"
                  style={{ filter: 'drop-shadow(0 1px 6px rgba(26,111,180,.4))' }} />
              </div>
              <span className="font-lato text-[11px] uppercase tracking-[0.2em]" style={{ color: '#60a5fa' }}>Colombia</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">Gestión documental · Custodia · Digitalización</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Certificación</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">ISO 9001 — Gestión de calidad</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sistemas actuales</p>
                <p className="font-lato text-white/60 text-[18px]">SIIGO (contable/operativo) · Zoho CRM (comercial)</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Situación financiera</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#f59e0b' }} />
                  <p className="font-poppins font-semibold text-[15px] text-[#f59e0b]">Rentabilidad por proyecto sin visibilidad en tiempo real</p>
                </div>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Servicios ofrecidos</p>
                <p className="font-lato text-white/60 text-[18px]">Digitalización · Custodia · Inventario · Consulta</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Flujo comercial</p>
                <p className="font-lato text-white/60 text-[18px]">Validación comercial → Operativa → Financiera en Zoho</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              SIAR S.A.S. es una empresa de gestión documental con certificación ISO 9001 que presta servicios de digitalización, custodia e inventario de archivos en Colombia. Su operación involucra proyectos de mediano y largo plazo que pueden extenderse durante meses, con múltiples servicios que inician en momentos distintos y costos que se acumulan progresivamente.
            </p>
            <p>
              El reto que enfrenta SIAR hoy no es tecnológico en su superficie: es un reto de <strong className="text-white/90 font-semibold">visibilidad financiera</strong>. Para saber cuánto se ha gastado en un proyecto, el equipo depende de solicitudes al área contable. El tarifario comercial se actualiza con el IPC, pero no está respaldado por un modelo de costos reales. Y cuando un proyecto empieza a salirse del presupuesto, nadie lo sabe hasta que ya es tarde.
            </p>
            <p>
              Sixteam propone no un simple desarrollo de pantallas, sino una <strong className="text-white/90 font-semibold">solución financiero-operativa a la medida</strong>: el diseño del modelo de datos, los flujos de aprobación, los roles, las alertas, la integración con SIIGO y Zoho, y la visualización por proyecto — construida específicamente para la forma en que SIAR opera.
            </p>
          </div>

          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> Dolores identificados en reunión del 17 de junio de 2026
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HALLAZGOS.map((h, i) => {
                const Icon = h.icon; const t = TINT[h.tint];
                return (
                  <div key={i} className={`rounded-xl p-4 flex gap-3 ${i === 4 ? 'sm:col-span-2' : ''}`}
                    style={{ background: t.bg, border: `1px solid ${t.border}` }}>
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
          <SectionTitle>¿Qué construimos juntos?</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden mb-6"
            style={{ background: `rgba(26,111,180,.06)`, border: `1px solid rgba(26,111,180,.20)` }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: `radial-gradient(circle, rgba(26,111,180,.07), transparent 70%)`, transform: 'translate(20%,-20%)' }} />
            <Activity className="w-7 h-7 mb-4" style={{ color: SIAR_BLUE }} />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[23px] leading-relaxed">
              Sixteam propone una <strong className="text-white font-black">plataforma financiero-operativa a la medida</strong> — no como un simple desarrollo de pantallas, sino como una solución que incluye el diseño del modelo de datos, los flujos de decisión, los roles, las alertas, la conexión con SIIGO y Zoho, y la visualización financiera por proyecto, pensada exactamente para la operación de SIAR.
            </p>
          </div>

          <p className="font-lato text-white/30 text-[13px] uppercase tracking-widest mb-3">Qué resuelve esta herramienta</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              {
                icon: Eye, color: SIAR_BLUE, colorAlpha: 'rgba(26,111,180,.08)', colorBorder: 'rgba(26,111,180,.22)',
                titulo: 'Visibilidad en tiempo real',
                desc: 'El señor Freddy entra a la herramienta y ve, sin pedir nada al área contable, cuánto va gastado por proyecto, cuánto se presupuestó y si el margen está en riesgo.',
              },
              {
                icon: DollarSign, color: '#00bfa5', colorAlpha: 'rgba(0,191,165,.08)', colorBorder: 'rgba(0,191,165,.22)',
                titulo: 'Pricing respaldado en costos reales',
                desc: 'El líder de proyecto construye el presupuesto desde la herramienta: qué necesita, en qué cantidades y tiempos. La calculadora determina el precio mínimo viable antes de presentar la propuesta.',
              },
              {
                icon: Bell, color: '#a78bfa', colorAlpha: 'rgba(167,139,250,.07)', colorBorder: 'rgba(167,139,250,.20)',
                titulo: 'Alertas antes de que sea tarde',
                desc: 'Cuando el gasto real se acerca al tope o supera lo esperado según el avance del proyecto, el sistema genera una alerta para que SIAR tome decisiones antes de que el margen se consuma.',
              },
              {
                icon: Shield, color: '#34d399', colorAlpha: 'rgba(52,211,153,.07)', colorBorder: 'rgba(52,211,153,.20)',
                titulo: 'Aprobaciones con datos, no con intuición',
                desc: 'Las validaciones comercial, operativa y financiera exigidas por ISO 9001 se hacen con información real: capacidad instalada, costos estimados y viabilidad financiera calculada.',
              },
            ].map((item, i) => {
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

          <div className="rounded-xl p-5 flex gap-3 mb-6"
            style={{ background: 'rgba(245,158,11,.05)', border: '1px solid rgba(245,158,11,.20)' }}>
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#f59e0b]" />
            <div>
              <p className="font-poppins font-semibold text-white/80 text-[17px] mb-2">Herramienta de gestión financiera, no sistema contable</p>
              <p className="font-lato text-white/50 text-[15px] leading-relaxed">
                Esta herramienta es un <strong className="text-white/70">sistema financiero de gestión por proyectos</strong>, complementario a SIIGO. No reemplaza la contabilidad — la complementa con una capa de visibilidad operativa que SIIGO no ofrece: ver en tiempo real cómo va el presupuesto de cada proyecto, quién está gastando qué y cuándo hay que tomar una decisión.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Dashboard por proyecto',  value: 'MVP', sub: 'Primera entrega funcional' },
              { label: 'Integración SIIGO',        value: 'Fase 1', sub: 'Archivo plano → API en fase 2' },
              { label: 'Roles diferenciados',      value: '6', sub: 'Gerencia · Ops · Admin · Financiero · Proyecto · Admin TI' },
              { label: 'Alertas configurables',    value: 'Sí', sub: 'Por proyecto, categoría y margen' },
            ].map((k, i) => (
              <div key={i} className="rounded-xl p-4 text-center"
                style={{ background: i < 2 ? `rgba(26,111,180,.07)` : 'rgba(0,191,165,.06)', border: i < 2 ? `1px solid rgba(26,111,180,.20)` : '1px solid rgba(0,191,165,.18)' }}>
                <p className="font-poppins font-black text-white text-[22px] leading-none mb-1">{k.value}</p>
                <p className="font-poppins font-semibold text-white/70 text-[13px] mb-0.5">{k.label}</p>
                <p className="font-lato text-white/35 text-[12px]">{k.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─ 03 MÓDULOS ─ */}
        <section id="modulos" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — Módulos del sistema</TagLabel>
          <SectionTitle>3 módulos · MVP + evolución</SectionTitle>
          <Rule />

          <div className="relative mb-10">
            <div className="hidden sm:block absolute left-[28px] top-10 bottom-10 w-px"
              style={{ background: `linear-gradient(to bottom, rgba(26,111,180,.4), rgba(0,191,165,.4), rgba(245,158,11,.4))` }} />

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
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`font-poppins font-bold text-[18px] ${open ? 'text-white' : 'text-white/70'}`}>{mod.nombre}</span>
                        </div>
                        <p className="font-lato text-white/40 text-[15px] mt-0.5 line-clamp-1">{mod.descripcion}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                        <div className="text-right hidden sm:block">
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: mod.colorAlpha, border: `1px solid ${mod.colorBorder}` }}>
                            <Rocket className="w-3 h-3" style={{ color: mod.color }} />
                            <span className="font-poppins font-bold text-[13px]" style={{ color: mod.color }}>{mod.duracion}</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`}
                          style={{ color: open ? mod.color : 'rgba(255,255,255,.3)' }} />
                      </div>
                    </button>

                    {open && (
                      <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                        <div className="pt-4">
                          <p className="font-lato text-white/60 text-[17px] leading-relaxed mb-4">{mod.descripcion}</p>
                          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Funcionalidades incluidas</p>
                          <ul className="space-y-2">
                            {mod.actividades.map((a, j) => {
                              const act = typeof a === 'string' ? { text: a } : a;
                              return (
                                <li key={j} className="flex items-start gap-2">
                                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: mod.color }} />
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
              style={{ background: `rgba(26,111,180,.06)`, border: `1px solid rgba(26,111,180,.22)` }}>
              <Rocket className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: SIAR_BLUE }} />
              <p className="font-lato text-white/55 text-[16px] leading-relaxed">
                Los <strong className="text-white/80">Módulos 01 y 02</strong> conforman el MVP: dashboard por proyecto y calculadora de presupuesto. Son los entregables iniciales que permiten a SIAR tener visibilidad financiera real desde el primer día de uso.
              </p>
            </div>
            <div className="rounded-xl p-4 flex gap-3"
              style={{ background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.2)' }}>
              <Settings className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#f59e0b]" />
              <p className="font-lato text-white/55 text-[16px] leading-relaxed">
                El <strong className="text-white/80">Módulo 03</strong> (matriz de costos, alertas avanzadas e integración API con SIIGO) es la fase de evolución. Se construye una vez el MVP esté en producción y el equipo haya comenzado a cargar datos reales — permitiendo que la herramienta aprenda y mejore con el uso.
              </p>
            </div>
            <div className="rounded-xl p-4 flex gap-3"
              style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.18)' }}>
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
              <p className="font-lato text-white/55 text-[16px] leading-relaxed">
                La información de la <strong className="text-white/80">SOLPED y órdenes de compra</strong> estará cubierta bajo la integración con SIIGO — la herramienta consume los datos contables desde SIIGO sin requerir una gestión paralela de solicitudes de pedido en la nueva plataforma.
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
            Detalle de cada componente del sistema
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

        {/* ─ 05 INVERSIÓN ─ */}
        <section id="inversion" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Propuesta de inversión</TagLabel>
          <SectionTitle>Tres opciones, una sola solución.</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Las tres opciones cubren el mismo <strong className="text-white/75">MVP robusto</strong> — dashboard por proyecto, calculadora de presupuesto, roles, alertas e integración inicial con SIIGO. La diferencia está en quién es el propietario de la herramienta y cómo se estructura el acompañamiento posterior. Valores en{' '}
            <strong className="text-white/75">pesos colombianos (COP).</strong>
          </p>

          {/* Selector de opción */}
          <div className="flex flex-wrap gap-2 mb-6">
            {OPCIONES.map((op, i) => (
              <button key={i} onClick={() => setOpcionActiva(i)}
                className="flex items-center gap-2 px-4 py-2 rounded-full font-poppins font-bold text-[14px] transition-all duration-200"
                style={{
                  background: opcionActiva === i ? `${op.color}22` : 'rgba(255,255,255,.04)',
                  border: opcionActiva === i ? `1px solid ${op.color}55` : '1px solid rgba(255,255,255,.08)',
                  color: opcionActiva === i ? op.color : 'rgba(255,255,255,.45)',
                }}>
                <span>{op.num}</span>
                <span className="hidden sm:inline">— {op.titulo.split(' ').slice(0,3).join(' ')}…</span>
                {op.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                    style={{ background: `${op.color}25`, border: `1px solid ${op.color}45`, color: op.color }}>
                    {op.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Cards de opciones */}
          <div className="space-y-4 mb-10">
            {OPCIONES.map((op, i) => {
              const active = opcionActiva === i;
              return (
                <div key={i}
                  onClick={() => setOpcionActiva(i)}
                  className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                  style={{
                    background: active ? `linear-gradient(135deg, ${op.color}0e 0%, rgba(3,13,26,.95) 100%)` : 'rgba(255,255,255,.02)',
                    border: active ? `1px solid ${op.color}40` : '1px solid rgba(255,255,255,.07)',
                    boxShadow: active ? `0 4px 32px ${op.color}18` : 'none',
                  }}>

                  {/* Header de la card */}
                  <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-poppins font-black text-white text-[15px]"
                          style={{ background: `linear-gradient(135deg, ${op.color}, ${op.color}88)` }}>
                          {op.num}
                        </div>
                        {op.badge && (
                          <span className="font-lato text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider"
                            style={{ background: `${op.color}20`, border: `1px solid ${op.color}40`, color: op.color }}>
                            {op.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="rounded-xl px-4 py-3 text-center"
                          style={{ background: `${op.color}12`, border: `1px solid ${op.color}30` }}>
                          <p className="font-lato text-white/35 text-[11px] uppercase tracking-wider mb-0.5">Implementación</p>
                          <p className="font-poppins font-black text-white text-[20px] leading-none">{op.implementacion}</p>
                        </div>
                        {op.mensualidad !== op.implementacion && (
                          <div className="rounded-xl px-4 py-2.5 text-center mt-1"
                            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
                            <p className="font-lato text-white/30 text-[11px] uppercase tracking-wider mb-0.5">
                              {i === 2 ? 'Soporte opcional posterior' : 'Mensualidad'}
                            </p>
                            <p className="font-poppins font-bold text-white/80 text-[16px] leading-none">{op.mensualidad}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <p className="font-poppins font-black text-white text-[20px] sm:text-[22px] mb-1">{op.titulo}</p>
                      <p className="font-lato text-white/40 text-[15px] mb-4">{op.subtitulo}</p>
                      <ul className="space-y-2 mb-4">
                        {op.puntos.map((p, j) => (
                          <li key={j} className="flex items-start gap-2.5">
                            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: op.color }} />
                            <span className="font-lato text-white/60 text-[16px] leading-snug">{p}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="rounded-lg px-3 py-2" style={{ background: `${op.color}12`, border: `1px solid ${op.color}28` }}>
                          <p className="font-lato text-white/30 text-[11px] uppercase tracking-wider mb-0.5">{op.totalLabel}</p>
                          <p className="font-poppins font-black text-[15px]" style={{ color: op.color }}>{op.total}</p>
                        </div>
                        <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
                          <p className="font-lato text-white/30 text-[11px] uppercase tracking-wider mb-0.5">Permanencia</p>
                          <p className="font-poppins font-semibold text-white/65 text-[14px]">{op.permanencia}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nota */}
                  <div className="px-5 sm:px-6 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                    <p className="pt-4 font-lato text-white/35 text-[14px] leading-relaxed italic">{op.nota}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Forma de pago */}
          <div className="rounded-xl p-5 sm:p-6 mb-6"
            style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.20)' }}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#00bfa5]" />
              <p className="font-poppins font-semibold text-white/80 text-[18px]">Forma de pago sugerida</p>
              <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.28)', color: '#00bfa5' }}>
                Aplica a las 3 opciones
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { pct: '30%', momento: 'Al inicio del proyecto', desc: 'Con la confirmación de la propuesta y firma del contrato.' },
                { pct: '30%', momento: 'Contra prototipo funcional', desc: 'Entrega de la primera versión navegable con módulos principales activos.' },
                { pct: '40%', momento: 'Salida a producción', desc: 'Entrega de la versión en pruebas y puesta en producción del sistema.' },
              ].map((pago, i) => (
                <div key={i} className="rounded-xl p-4"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <p className="font-poppins font-black text-[#00bfa5] text-[28px] leading-none mb-1">{pago.pct}</p>
                  <p className="font-poppins font-semibold text-white/80 text-[15px] mb-1">{pago.momento}</p>
                  <p className="font-lato text-white/40 text-[13px] leading-relaxed">{pago.desc}</p>
                </div>
              ))}
            </div>
            <p className="font-lato text-white/35 text-[13px] mt-4 leading-relaxed">
              Para las opciones 1 y 2, la mensualidad inicia desde la salida a producción o máximo 30 días después de la entrega del MVP.
            </p>
          </div>

          {/* Nota MVP */}
          <div className="rounded-xl p-4 flex gap-3"
            style={{ background: 'rgba(245,158,11,.05)', border: '1px solid rgba(245,158,11,.20)' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#f59e0b]" />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              Los valores de cada opción cubren un <strong className="text-white/75">MVP robusto</strong>, no una herramienta infinita. El MVP incluye los módulos acordados en esta propuesta. Funcionalidades adicionales fuera del alcance — como la integración API completa con SIIGO (fase 2), módulo de horas hombre en tiempo real, o nuevos módulos no contemplados — se cotizarán por separado o se incluirán en la evolución del servicio.
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
          <TagLabel>06 — Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y Términos de la Propuesta</SectionTitle>
          <Rule />

          <div className="space-y-3">
            {[
              {
                titulo: 'Aprobación',
                desc: 'Para aceptar esta propuesta y dar inicio al proyecto, se requiere confirmación vía WhatsApp, correo o verbal. Con esa confirmación se habilita el contrato a firmar y se procede con el inicio del trabajo.',
                icon: CheckCircle,
              },
              {
                titulo: 'Opción de propuesta seleccionada',
                desc: 'Las tres opciones cubren el mismo MVP. La selección de la opción define quién es el propietario del desarrollo, la estructura de pagos periódicos y las condiciones de permanencia mínima. Cualquiera de las tres puede acordarse dentro de la vigencia de esta propuesta.',
                icon: Layers,
              },
              {
                titulo: 'Términos de pago',
                desc: 'El pago se estructura en tres hitos: 30% al inicio del proyecto, 30% contra entrega del prototipo funcional y 40% contra entrega de la versión en pruebas y salida a producción. Los pagos se realizan mediante transferencia bancaria.',
                icon: FileText,
              },
              {
                titulo: 'Inicio del proyecto',
                desc: 'El cronograma de desarrollo inicia desde la confirmación de la propuesta, la selección de la opción y la primera sesión de kickoff con el equipo de SIAR. El equipo deberá disponer de acceso a SIIGO para los ejercicios de integración y designar un responsable de proyecto por parte de SIAR.',
                icon: Zap,
              },
              {
                titulo: 'Propiedad y confidencialidad',
                desc: 'En las opciones 1 y 2, SIAR es propietario de sus datos y de la configuración operativa de la herramienta. En la opción 3, SIAR adquiere la propiedad completa del desarrollo. En todos los casos, Sixteam se compromete a mantener la confidencialidad de la información de SIAR y sus clientes.',
                icon: Shield,
              },
              {
                titulo: 'Modificaciones al alcance',
                desc: 'Cualquier funcionalidad no contemplada en esta propuesta requerirá una nueva cotización. Ejemplos: integración API completa con SIIGO (fase 2), módulo de horas hombre en tiempo real, conectores con herramientas externas adicionales, o módulos de nuevas áreas no contempladas en el alcance inicial.',
                icon: AlertCircle,
              },
              {
                titulo: 'Vigencia de la propuesta',
                desc: 'Esta propuesta tiene una vigencia de 30 días calendario desde su fecha de emisión. Pasado este plazo, los valores podrán ser revisados según las condiciones del mercado.',
                icon: Clock,
              },
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
              style={{ background: `radial-gradient(circle at 50% 100%, rgba(26,111,180,.05), transparent 70%)` }} />
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

export default SiarProposal;
