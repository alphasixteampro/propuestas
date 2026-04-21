import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap, BarChart3,
  AlertCircle, Info, Globe, MapPin,
  Settings, Users, BellRing, LayoutDashboard, Rocket,
  Link2, Layers, Compass, Handshake,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Visit Antioquia',
  razonSocial: 'Visit Antioquia',
  tagline: 'Agencia de viajes · Antioquia, Colombia',
  sector: 'Turismo receptivo · Agencia de viajes · B2C & B2B',
  portafolio: 'Tours, hospedajes, actividades de aventura y paquetes a medida en Antioquia',
  usuarios: 3,
  fecha: 'Abril 2026',
  herramienta: 'Sixteam.pro Core',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  contacto: 'Pedro Lopez',
  objetivo: 'Agente IA con perfilamiento B2C + CRM de doble pipeline + Chatbot B2B para proveedores — convertir tráfico de pauta en ventas y escalar el portafolio de prestadores de Antioquia',
};

const VA_GREEN = '#16a34a';
const VA_AMBER = '#d97706';
const PRECIO_MENSUAL = 'COP 728.586';
const PRECIO_IMPLEMENTACION = 'COP 7.734.000';
const USD_ADICIONAL = 'USD 25';
const TRM_NUM = 3642.93;
const IA_USD_POR_MSG = 0.02;

const HALLAZGOS = [
  {
    titulo: 'Sin canal de WhatsApp estructurado para cerrar ventas',
    desc: 'La realidad del mercado es que la venta de viajes en Colombia se cierra por WhatsApp. Visit Antioquia tiene pauta activa en Meta y presencia digital, pero no tiene un canal de venta asistida que convierta el interés generado por la pauta en una venta real — con respuesta inmediata, perfilamiento del lead y un asesor listo para cotizar.',
    icon: AlertCircle, tint: 'blue',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber: { text: 'text-amber-400',   bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)' },
  teal:  { text: 'text-[#00bfa5]',   bg: 'rgba(0,191,165,.07)',   border: 'rgba(0,191,165,.18)' },
  blue:  { text: 'text-[#60a5fa]',   bg: 'rgba(96,165,250,.07)',  border: 'rgba(96,165,250,.18)' },
  red:   { text: 'text-[#f87171]',   bg: 'rgba(221,51,51,.07)',   border: 'rgba(221,51,51,.2)'  },
};

// ─── ETAPAS ──────────────────────────────────────────────────────────────────

const ETAPAS = [
  // ── SPRINT 1: B2C ────────────────────────────────────────────────────────
  {
    num: '01',
    sprint: 'Sprint 1',
    nombre: 'Diseño y Configuración B2C',
    duracion: '1 semana',
    icon: FileText,
    color: VA_GREEN,
    colorAlpha: 'rgba(22,163,74,.12)',
    colorBorder: 'rgba(22,163,74,.3)',
    descripcion: 'Antes de escribir una sola línea de configuración, levantamos el portafolio completo de Visit Antioquia, mapeamos el proceso de venta y diseñamos la arquitectura del agente IA y el CRM B2C. Todo validado por el equipo antes de implementar.',
    actividades: [
      'Levantamiento del portafolio de Antioquia: destinos (Medellín, Guatapé, Peñol, Necoclí, pueblos patrimonio), tipos de actividad (aventura al aire libre, cultural, gastronómica, playa) y productos (hospedajes, tours cerrados, cotizaciones a medida)',
      'Diseño del árbol de perfilamiento B2C: las preguntas exactas que el agente hace para identificar qué busca el viajero — si busca hospedaje, una actividad específica, un tour cerrado o quiere que le armen una cotización a medida',
      'Sub-árbol de actividades: aventura y naturaleza (rafting, parapente, senderismo, ríos), cultural y patrimonial (pueblos patrimonio, gastronomía paisa), playa y descanso (Necoclí) o paquetes combinados',
      'Definición de las reglas de transferencia al asesor: en qué punto el agente pasa el lead y qué información estructurada le entrega (nombre, destino, tipo de experiencia, fechas, número de viajeros)',
      'Diseño del pipeline B2C con etapas mínimas: el proceso de venta de Antioquia es de impulso — el pipeline tiene que ser ágil y sin fricciones innecesarias entre el primer contacto y el cierre',
      'Estructuración de la base de conocimiento inicial: preguntas frecuentes identificadas junto a Pedro, información de destinos, condiciones generales y portafolio',
      'Definición de personalidad del agente B2C: nombre, tono (cálido, cercano, paisa) y forma de presentarse al viajero',
      'Configuración inicial de la cuenta Sixteam.pro Core (3 usuarios con roles definidos)',
      'Entrega de documento de diseño funcional validado por el equipo antes de iniciar la implementación',
    ],
  },
  {
    num: '02',
    sprint: 'Sprint 1',
    nombre: 'Implementación B2C',
    duracion: '2 semanas',
    icon: Settings,
    color: '#1d70a2',
    colorAlpha: 'rgba(29,112,162,.10)',
    colorBorder: 'rgba(29,112,162,.3)',
    descripcion: 'Con el diseño aprobado, construimos el canal B2C completo: el chat center omnicanal, el agente IA con árbol de perfilamiento, la base de conocimiento inicial, el CRM y los seguimientos automáticos.',
    actividades: [
      'Activación del chat center omnicanal Sixteam.pro Core: bandeja única donde los 3 usuarios gestionan WhatsApp, Instagram, Messenger y chat web desde un solo lugar, con asignación y transferencia de conversaciones',
      'Conexión de WhatsApp vía API oficial de Meta (WhatsApp Business API): bajo riesgo de bloqueo, sin WhatsApp Web, preparado para escalar con el crecimiento de la pauta',
      'Integración de Instagram Direct y Messenger al chat center: todos los leads de redes sociales en la misma bandeja centralizada',
      'Construcción del agente IA con árbol de perfilamiento B2C: clasifica el lead por tipo de experiencia (hospedaje / actividad / tour cerrado / cotización a medida) y sub-tipo de actividad antes de transferir al asesor',
      'Entrenamiento del agente con la base de conocimiento inicial: información de Visit Antioquia extraída del sitio web + sesión de estructuración con el equipo para organizar destinos, actividades y condiciones en formato óptimo para el bot',
      'Failover inteligente: cuando el bot no tiene la respuesta (precios variables, disponibilidad), transfiere al asesor con el perfil completo del lead — sin inventar ni alucinar',
      'Configuración del CRM B2C: base de contactos, pipeline de etapas mínimas y hasta 20 propiedades personalizadas en el módulo de contactos y 20 en el módulo de oportunidades',
      'Hasta 2 flujos de seguimiento automático: atención inicial de leads nuevos (2h, 24h, 48h) y seguimiento post-perfilamiento para leads que no cerraron con el asesor',
      'Pruebas de flujo completo con el equipo y ajustes antes de salida a producción',
    ],
  },
  {
    num: '03',
    sprint: 'Sprint 1',
    nombre: 'Capacitación y Salida a Producción B2C',
    duracion: '1 semana',
    icon: Rocket,
    color: '#f59e0b',
    colorAlpha: 'rgba(245,158,11,.10)',
    colorBorder: 'rgba(245,158,11,.3)',
    descripcion: 'El canal B2C está listo. Lo encendemos junto con el equipo y acompañamos las primeras campañas activas. Desde el primer día de pauta, los leads llegan a un agente que los perfila y los pasa al asesor en condiciones óptimas para cerrar.',
    actividades: [
      'Hasta 4 horas de capacitación virtual con los 3 usuarios: manejo del chat center, pipeline CRM, gestión de conversaciones y métricas del canal B2C',
      'Grabación de todas las sesiones de capacitación entregadas al equipo para consulta posterior',
      'Guías de uso por módulo en formato digital: chat center, agente IA, CRM y seguimientos automáticos',
      'Acompañamiento en las primeras campañas de Meta Ads activas: validación del flujo IA → perfilamiento → asesor en condiciones reales',
      'Revisión y ajuste de la base de conocimiento con las preguntas reales que lleguen en los primeros días — proceso de mejora continua desde el día 1',
      'Canal de soporte dedicado durante toda la semana de lanzamiento del Sprint 1',
    ],
  },
  // ── SPRINT 2: B2B ────────────────────────────────────────────────────────
  {
    num: '04',
    sprint: 'Sprint 2',
    nombre: 'Diseño e Implementación B2B — Proveedores',
    duracion: '2 semanas',
    icon: Handshake,
    color: VA_AMBER,
    colorAlpha: 'rgba(217,119,6,.10)',
    colorBorder: 'rgba(217,119,6,.3)',
    descripcion: 'El Sprint 2 activa el canal de captación y gestión de proveedores turísticos. Diseñamos e implementamos el pipeline B2B (proceso comercial independiente al B2C) y el chatbot que pre-califica a los prestadores interesados en vincularse con Visit Antioquia.',
    actividades: [
      'Diseño del flujo de captación B2B: cómo llegan los prospectos de proveedores a Visit Antioquia (WhatsApp, formulario web, redes sociales) y qué proceso comercial los lleva desde el primer contacto hasta la vinculación formal',
      'Diseño del árbol del chatbot B2B: las preguntas de pre-calificación del prospecto de proveedor — tipo de servicio (hospedaje, actividad, transporte, gastronomía, guía turístico), cobertura geográfica dentro de Antioquia, capacidad de atención y datos de contacto',
      'Implementación del chatbot B2B dentro del mismo chat center: el equipo atiende tanto el canal B2C (viajeros) como el B2B (proveedores) desde la misma bandeja centralizada',
      'Configuración del pipeline B2B: hasta 20 propiedades en el módulo de contactos B2B y 20 en el módulo de oportunidades B2B, adaptadas al proceso de vinculación de prestadores turísticos',
      'Vinculación de contactos a empresa: cada prestador (ej. Hotel Laureles) queda asociado a su razón social — visibilidad clara del portafolio de proveedores de Visit Antioquia',
      'Automatizaciones B2B: alertas al asesor cuando llega un prospecto pre-calificado, seguimientos al prestador sin respuesta, cambios de etapa automáticos en el pipeline',
      'Pruebas del flujo B2B completo y ajustes antes de lanzamiento del canal',
    ],
  },
  {
    num: '05',
    sprint: 'Sprint 2',
    nombre: 'Capacitación y Salida a Producción B2B',
    duracion: '1 semana',
    icon: Rocket,
    color: VA_AMBER,
    colorAlpha: 'rgba(217,119,6,.10)',
    colorBorder: 'rgba(217,119,6,.3)',
    descripcion: 'El canal B2B está listo. Capacitamos al equipo en el uso del pipeline de proveedores y del chatbot B2B, y lanzamos el canal con acompañamiento completo durante la primera semana de operación.',
    actividades: [
      'Hasta 4 horas de capacitación virtual con el equipo en el uso del pipeline B2B: gestión de prospectos de proveedores, etapas de vinculación, propiedades y automatizaciones',
      'Capacitación en el uso del chatbot B2B: cómo revisar los perfiles pre-calificados que llegan, cómo intervenir cuando el chatbot transfiere y cómo gestionar la bandeja B2B en el chat center',
      'Grabación de sesión de capacitación B2B entregada al equipo para consulta posterior',
      'Guía de uso del módulo B2B: pipeline de proveedores, chatbot y propiedades del módulo',
      'Acompañamiento en el lanzamiento del canal B2B: validación del flujo chatbot → pre-calificación → asesor en condiciones reales',
      'Canal de soporte dedicado durante toda la semana de lanzamiento del Sprint 2',
    ],
  },
];

// ─── DESGLOSE PLATAFORMA ─────────────────────────────────────────────────────

const DESGLOSE_PLAT = [
  {
    categoria: 'Agente IA B2C con Árbol de Perfilamiento',
    icon: Zap,
    color: VA_GREEN,
    items: [
      'Agente de IA entrenado con el portafolio de Visit Antioquia: destinos, actividades, hospedajes, tours cerrados y condiciones generales',
      'Árbol de perfilamiento: identifica en las primeras interacciones qué tipo de experiencia busca el viajero — hospedaje, actividad específica, tour cerrado o cotización a medida',
      'Sub-clasificación de actividades: aventura y naturaleza (rafting, parapente, senderismo, ríos), cultural y patrimonial (pueblos patrimonio, gastronomía paisa), playa y descanso (Necoclí), o paquetes combinados',
      'Respuesta 24/7: el viajero que ve un reel de Guatapé, del Peñol o de una actividad a las 10pm tiene quién lo atienda en el momento del impulso de compra',
      'Transfer con contexto al asesor: nombre, destino de interés, tipo de experiencia, fechas tentativas y número de viajeros — el asesor no arranca desde cero',
      'Failover inteligente: cuando el bot no tiene la respuesta (precios variables, disponibilidad), transfiere al asesor — sin inventar ni erosionar la confianza del cliente',
      'Base de conocimiento estructurada desde el sitio web de Visit Antioquia + mejora continua con el uso real del canal',
    ],
  },
  {
    categoria: 'Chat Center Omnicanal + WhatsApp API Oficial',
    icon: Link2,
    color: '#00bfa5',
    items: [
      'Bandeja de entrada omnicanal: los 3 usuarios ven y gestionan todas las conversaciones de todos los canales desde un solo lugar, en simultáneo',
      'Asignación y transferencia de conversaciones entre asesores: cada lead tiene un responsable claro y el contexto no se pierde si cambia de manos',
      'WhatsApp integrado vía API oficial de Meta (WhatsApp Business API): bajo riesgo de bloqueo, sin límites de WhatsApp Web, 1 número (1 cuenta) conectado como canal principal',
      'Instagram Direct: mensajes de Instagram llegan a la misma bandeja — cero conversaciones perdidas en la app del celular',
      'Messenger (Facebook): leads de Facebook Ads y mensajes directos en la bandeja centralizada',
      'Identificación de fuente publicitaria: el sistema registra de qué anuncio o campaña de Meta viene cada lead para medir el ROI por creatividad',
      'Historial completo por contacto: si el cliente vuelve en 6 meses, el asesor sabe exactamente qué se habló y qué le interesaba',
    ],
  },
  {
    categoria: 'CRM Pipeline B2C — Canal Viajeros',
    icon: BarChart3,
    color: '#1d70a2',
    items: [
      'Base de contactos B2C centralizada: cada lead que entra se convierte automáticamente en un contacto con historial de conversación completo',
      'Pipeline B2C con etapas mínimas: diseñado para que el lead no se enfríe — el proceso de venta de Antioquia es de impulso y el CRM lo refleja',
      'Hasta 20 propiedades personalizadas en el módulo de contactos B2C: destino de interés, tipo de experiencia, tipo de actividad, fecha de viaje tentativa, número de viajeros, canal de origen, campaña de pauta',
      'Hasta 20 propiedades personalizadas en el módulo de oportunidades B2C: producto de interés, valor cotizado, estado de la cotización, fuente de pauta, fecha estimada de viaje',
      'Gestión de oportunidades: cada lead calificado por el agente IA se convierte en una oportunidad visible con su perfil completo para el asesor',
      'Hasta 6 automatizaciones de CRM B2C: asignación de leads, alertas al asesor, cambios de etapa automáticos, tareas programadas',
    ],
  },
  {
    categoria: 'CRM Pipeline B2B — Vinculación de Proveedores',
    icon: Handshake,
    color: VA_AMBER,
    items: [
      'Pipeline B2B independiente del canal B2C: el proceso de vincular un prestador turístico es comercialmente distinto al de vender un paquete — el CRM lo refleja con su propio embudo de etapas',
      'Etapas del pipeline B2B: Prospecto recibido → Pre-calificado por chatbot → En evaluación → Acuerdo comercial → Proveedor activo — trazabilidad completa de cada prestador en proceso',
      'Vinculación contacto–empresa: cada prestador (ej. Hotel Laureles) queda asociado a su razón social — visibilidad clara del portafolio de proveedores de Visit Antioquia',
      'Hasta 20 propiedades en el módulo de contactos B2B: tipo de servicio turístico, cobertura geográfica dentro de Antioquia, capacidad de atención, estado de vinculación, datos de representante',
      'Hasta 20 propiedades en el módulo de oportunidades B2B: tipo de contrato, tarifas negociadas, condiciones de trabajo, exclusividad, fecha de vinculación estimada',
      'Hasta 6 automatizaciones B2B: alertas al asesor cuando llega un prospecto pre-calificado, seguimientos al prestador sin respuesta, cambios de etapa automáticos en el pipeline B2B',
      'Pedro puede ver en tiempo real cuántos proveedores están en proceso de vinculación, en qué etapa y cuál es la cobertura del portafolio por tipo de servicio y zona de Antioquia',
    ],
  },
  {
    categoria: 'Chatbot de Captación B2B — Prospectos de Proveedores',
    icon: Compass,
    color: VA_AMBER,
    items: [
      'Chatbot de pre-calificación para prestadores turísticos que contactan a Visit Antioquia interesados en vincularse como proveedores: hospedajes, operadores de actividades, transportes, restaurantes, guías turísticos',
      'Árbol de captación B2B: identifica el tipo de servicio del prestador, su cobertura geográfica dentro de Antioquia (zona cafetera, Guatapé, Medellín, Necoclí, pueblos patrimonio, etc.) y su capacidad de atención',
      'Recolección de datos clave: nombre del negocio, tipo de servicio, ubicación y cobertura, capacidad, persona de contacto y motivación de vinculación — todo estructurado para el asesor comercial',
      'Transfer al asesor B2B con resumen del prospecto: cuando el chatbot completa la pre-calificación, el asesor recibe el perfil completo del proveedor antes de tomar contacto — sin arrancar desde cero',
      'Notificación al asesor B2B cuando llega un prospecto pre-calificado: sin que el lead B2B se pierda entre las conversaciones del canal B2C',
      'Seguimientos automáticos al prestador que no respondió en las primeras horas: el impulso de vincularse también se puede enfriar',
      'El mismo chat center gestiona tanto el canal B2C (viajeros) como el B2B (proveedores) — toda la operación en un solo lugar sin duplicar herramientas',
    ],
  },
  {
    categoria: 'Seguimientos y Automatizaciones',
    icon: BellRing,
    color: '#a78bfa',
    items: [
      'Hasta 2 flujos de seguimiento automático B2C configurados e implementados:',
      'Flujo 1 — Atención inicial de leads B2C: cuando un lead nuevo deja de responder, el sistema envía seguimientos escalonados (2h, 24h, 48h) para recuperar el impulso de compra',
      'Flujo 2 — Post-perfilamiento B2C: cuando el lead fue perfilado y pasado al asesor pero no cerró, el sistema envía recordatorios contextuales mencionando la experiencia de interés',
      'Hasta 1 flujo de seguimiento B2B: cuando un prospecto de proveedor no responde después del primer contacto del chatbot, el sistema envía un seguimiento para recuperar la conversación',
      'Seguimientos con contexto: los mensajes hacen referencia a lo que el contacto buscaba — no son mensajes genéricos que se ignoran',
      'Hasta 6 automatizaciones de CRM adicionales (B2C + B2B): asignación de leads, alertas de inactividad, cambios de etapa automáticos y tareas programadas al asesor',
      'Mensajes fuera de ventana de 24h con plantillas aprobadas por Meta — costo variable según país del destinatario (ver sección Inversión)',
    ],
  },
  {
    categoria: 'Métricas y Gestión del Equipo',
    icon: LayoutDashboard,
    color: '#f59e0b',
    items: [
      'Hasta 8 informes personalizados adaptados a las métricas que importan para Visit Antioquia',
      'Métricas B2C: tasa de perfilamiento del agente IA, tasa de transferencia al asesor, panel de conversión (leads → perfilados → seguimiento → cerrados)',
      'Métricas B2B: prospectos de proveedores captados por período, etapas del pipeline de vinculación, cobertura del portafolio por tipo de servicio y zona',
      'Fuente de pauta por conversión B2C: qué anuncio o campaña de Meta Ads genera los leads más calificados para informar la inversión publicitaria',
      'Visibilidad de Pedro sobre ambos canales: estado de leads B2C, pipeline B2B y desempeño del equipo en tiempo real desde un solo panel',
      'Historial completo de cada contacto (B2C y B2B): conversación, etapa del pipeline, seguimientos enviados y acciones tomadas',
    ],
  },
];

const SECCIONES = [
  { id: 'resumen',    label: 'Resumen' },
  { id: 'objetivo',  label: 'Objetivo' },
  { id: 'plan',      label: 'Plan' },
  { id: 'alcance',   label: 'Plataforma' },
  { id: 'inversion', label: 'Inversión' },
  { id: 'vigencia',  label: 'Vigencia' },
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

// ─── BADGE SPRINT ─────────────────────────────────────────────────────────────

const SprintBadge = ({ label, color }: { label: string; color: string }) => (
  <span className="font-lato text-[11px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full font-semibold"
    style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}>
    {label}
  </span>
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const VisitAntioquiaProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [etapaActiva, setEtapaActiva] = useState<number | null>(null);
  const [desgloseActivo, setDesgloseActivo] = useState<number | null>(null);
  const [msgPerConv, setMsgPerConv] = useState(4);
  const [leadsPerMonth, setLeadsPerMonth] = useState(400);
  const [showMetaTable, setShowMetaTable] = useState(false);
  const [showResumen, setShowResumen] = useState(false);

  const iaUSD = +(IA_USD_POR_MSG * msgPerConv * leadsPerMonth).toFixed(2);
  const iaCOP = Math.round(iaUSD * TRM_NUM);
  const fmtCOP = (n: number) => n.toLocaleString('es-CO', { minimumFractionDigits: 0 });

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
            <div className={`rounded-full flex-shrink-0 transition-all duration-300 ${activeSection === s.id ? 'w-2 h-2 shadow-[0_0_6px_rgba(22,163,74,.7)]' : 'w-1.5 h-1.5 bg-white/50'}`}
              style={activeSection === s.id ? { background: VA_GREEN } : {}} />
          </button>
        ))}
      </nav>

      {/* ══════════ PORTADA */}
      <header className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #03130a 0%, #061a0e 55%, #071f12 100%)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(22,163,74,.06) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(29,112,162,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        </div>

        <div className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-b" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-white">
              <img src="/sixteam-logo.png" alt="Sixteam.pro" className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <div>
              <span className="font-poppins font-black text-white text-xl tracking-tight">Sixteam<span className="text-[#00bfa5]">.</span>pro</span>
              <p className="font-lato text-white/35 text-[13px] leading-none mt-0.5">Innovación y Estrategia Digital</p>
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
          input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#16a34a;cursor:pointer;box-shadow:0 0 8px rgba(22,163,74,.6);border:2px solid #030d1a}
          input[type=range]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#16a34a;cursor:pointer;box-shadow:0 0 8px rgba(22,163,74,.6);border:2px solid #030d1a}
        `}</style>

        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta de trabajo y cotización</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${VA_GREEN}, #1d70a2)` }}>
                  <Compass className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(22,163,74,.10)', border: '1px solid rgba(22,163,74,.25)', color: VA_GREEN }}>
                  Antioquia, Colombia
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}>
                Propuesta<br />
                <span style={{ background: `linear-gradient(90deg,${VA_GREEN},#1d70a2)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
                  { icon: MapPin, text: META.fecha },
                  { icon: Globe, text: META.sector },
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
                  {['1. Resumen ejecutivo','2. Objetivo general','3. Plan de trabajo','4. Plataforma Sixteam.pro','5. Inversión','6. Vigencia y términos'].map((item, i) => (
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
                  style={{ background: `radial-gradient(circle, rgba(22,163,74,.10) 0%, rgba(29,112,162,.05) 50%, transparent 70%)` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full" style={{ border: `1px solid rgba(22,163,74,.12)` }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(29,112,162,.15)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: VA_GREEN, boxShadow: `0 0 6px rgba(22,163,74,.8)` }} />
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
                  <div className="rounded-2xl flex items-center justify-center overflow-hidden px-5 py-3"
                    style={{ background: 'rgba(255,255,255,.96)', border: `1px solid rgba(22,163,74,.3)`, boxShadow: `0 4px 30px rgba(22,163,74,.20)`, minWidth: 160 }}>
                    <img src="/visitantioquia-logo.png" alt="Visit Antioquia" className="h-16 w-auto object-contain"
                      onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        t.style.display = 'none';
                        (t.nextSibling as HTMLElement)?.style?.removeProperty('display');
                      }} />
                    <Compass className="w-12 h-12 hidden" style={{ color: VA_GREEN }} />
                  </div>
                  <div className="text-center">
                    <span className="font-poppins font-black text-white text-[20px] tracking-tight">Visit Antioquia</span>
                    <p className="font-lato text-[11px] uppercase tracking-[0.2em] mt-0.5" style={{ color: VA_GREEN }}>Turismo receptivo · Antioquia, Colombia</p>
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

          {/* Card cliente */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="rounded-2xl flex items-center justify-center overflow-hidden px-3 py-2"
                style={{ background: 'rgba(255,255,255,.96)', boxShadow: `0 4px 20px rgba(22,163,74,.25)`, minWidth: 88 }}>
                <img src="/visitantioquia-logo.png" alt="Visit Antioquia" className="h-12 w-auto object-contain"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.style.display = 'none';
                    (t.nextSibling as HTMLElement)?.style?.removeProperty('display');
                  }} />
                <Compass className="w-7 h-7 hidden" style={{ color: VA_GREEN }} />
              </div>
              <span className="font-poppins font-black text-white text-[13px] tracking-tight text-center leading-tight max-w-[90px]">Visit Antioquia</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                <p className="font-poppins font-semibold text-white/80 text-[17px]">{META.sector}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Portafolio</p>
                <p className="font-lato text-white/60 text-[15px]">{META.portafolio}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Enfoque comercial</p>
                <p className="font-lato text-white/60 text-[15px]">B2C canal ventas · B2B vinculación de proveedores</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Canal de contacto actual</p>
                <p className="font-lato text-white/60 text-[16px]">Sitio web · Meta Ads · Sin WhatsApp estructurado</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Plataforma propuesta</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: VA_GREEN }} />
                  <p className="font-poppins font-semibold text-[17px]" style={{ color: VA_GREEN }}>{META.herramienta}</p>
                </div>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Usuarios incluidos</p>
                <p className="font-lato text-white/60 text-[16px]">{META.usuarios} usuarios · {META.contacto} + equipo</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              Visit Antioquia es una agencia de viajes regional especializada en el departamento de Antioquia: tours por Medellín, Guatapé y La Piedra del Peñol, actividades de aventura en sus ríos y montañas, playas en Necoclí, experiencias culturales en los pueblos patrimonio y paquetes a medida para todo tipo de viajero.
            </p>
            <p>
              La agencia tiene presencia activa en redes sociales y pauta digital en Meta. La oportunidad está clara: <strong className="text-white/90 font-semibold">Antioquia es un destino de compra por impulso</strong> — el viajero ve un reel de Guatapé, del Peñol o de una actividad de rafting y quiere comprar en ese momento. Para capitalizar esa ventana de impulso, Visit Antioquia necesita un <strong className="text-white/90 font-semibold">canal de venta asistida por WhatsApp</strong> que responda de inmediato, perfile al lead y lo conecte con el asesor en condiciones óptimas para cerrar.
            </p>
            <p>
              En paralelo, la agencia tiene un segundo canal de crecimiento estratégico: la <strong className="text-white/90 font-semibold">vinculación de prestadores y empresarios del servicio turístico</strong> como proveedores de Visit Antioquia. Este canal B2B requiere un proceso comercial propio — pipeline, chatbot y flujo de pre-calificación — para escalar el portafolio de proveedores de forma ordenada.
            </p>
          </div>

          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> Hallazgo clave identificado en la reunión de diagnóstico
            </p>
            <div className="grid grid-cols-1 gap-3">
              {HALLAZGOS.map((h, i) => {
                const Icon = h.icon; const t = TINT[h.tint];
                return (
                  <div key={i} className="rounded-xl p-4 flex gap-3" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
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
          className={`transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>02 — Objetivo general</TagLabel>
          <SectionTitle>¿Para qué estamos aquí?</SectionTitle>
          <Rule />
          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden mb-8"
            style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: `radial-gradient(circle, rgba(22,163,74,.07), transparent 70%)`, transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 mb-4" style={{ color: VA_GREEN }} />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[23px] leading-relaxed">
              Implementar <strong className="text-white font-black">Sixteam.pro Core</strong> como el motor de ventas y captación de Visit Antioquia: un <em className="not-italic" style={{ color: VA_GREEN }}>agente IA B2C que perfila al viajero</em> — si busca hospedaje, actividad, tour cerrado o cotización a medida — antes de transferirlo al asesor; un <em className="not-italic" style={{ color: VA_AMBER }}>chatbot B2B que pre-califica prospectos de proveedores turísticos</em> antes de pasarlos al asesor comercial; y un <em className="not-italic" style={{ color: '#00bfa5' }}>CRM de doble pipeline</em> con chat center omnicanal y automatizaciones que convierten cada lead —viajero o proveedor— en una oportunidad gestionada con contexto completo.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Sprints',       value: '2',  sub: 'B2C ventas · B2B proveedores', color: VA_GREEN },
              { label: 'Usuarios',      value: '3',  sub: 'Pedro Lopez + equipo',          color: '#1d70a2' },
              { label: 'Tipos B2C',     value: '4',  sub: 'hosp · activ · tour · medida',  color: '#1d70a2' },
              { label: 'Canales',       value: '3+', sub: 'WA · IG · FB · Web',            color: '#1d70a2' },
            ].map((k, i) => (
              <div key={i} className="rounded-xl p-4 text-center"
                style={{
                  background: i === 0 ? 'rgba(22,163,74,.08)' : 'rgba(29,112,162,.07)',
                  border: i === 0 ? `1px solid rgba(22,163,74,.25)` : '1px solid rgba(29,112,162,.2)',
                }}>
                <p className="font-poppins font-black text-white text-[28px] leading-none mb-1"
                  style={{ color: i === 0 ? VA_GREEN : 'white' }}>{k.value}</p>
                <p className="font-poppins font-semibold text-white/70 text-[13px] mb-0.5">{k.label}</p>
                <p className="font-lato text-white/35 text-[12px]">{k.sub}</p>
              </div>
            ))}
          </div>

          {/* Sprints overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl p-5 flex gap-3"
              style={{ background: `rgba(22,163,74,.06)`, border: `1px solid rgba(22,163,74,.22)` }}>
              <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: VA_GREEN }} />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-poppins font-bold text-white/85 text-[17px]">Sprint 1 — Canal B2C</p>
                  <SprintBadge label="Urgente" color={VA_GREEN} />
                </div>
                <p className="font-lato text-white/50 text-[14px] leading-relaxed">Agente IA perfilador + chat center omnicanal + CRM pipeline B2C para convertir leads de pauta en ventas de paquetes turísticos en Antioquia.</p>
              </div>
            </div>
            <div className="rounded-xl p-5 flex gap-3"
              style={{ background: `rgba(217,119,6,.06)`, border: `1px solid rgba(217,119,6,.22)` }}>
              <Handshake className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: VA_AMBER }} />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-poppins font-bold text-white/85 text-[17px]">Sprint 2 — Canal B2B</p>
                  <SprintBadge label="En esta propuesta" color={VA_AMBER} />
                </div>
                <p className="font-lato text-white/50 text-[14px] leading-relaxed">Chatbot de captación + pipeline B2B para gestionar la vinculación de prestadores y empresarios turísticos de Antioquia como proveedores de Visit Antioquia.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─ 03 PLAN ─ */}
        <section id="plan" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — Plan de trabajo</TagLabel>
          <SectionTitle>2 Sprints · 5 etapas · ~7 semanas</SectionTitle>
          <Rule />

          {/* Sprint labels */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: `rgba(22,163,74,.08)`, border: `1px solid rgba(22,163,74,.2)` }}>
              <div className="w-2 h-2 rounded-full" style={{ background: VA_GREEN }} />
              <span className="font-lato text-[13px]" style={{ color: VA_GREEN }}>Sprint 1 · Etapas 01–03 · Canal B2C</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: `rgba(217,119,6,.08)`, border: `1px solid rgba(217,119,6,.2)` }}>
              <div className="w-2 h-2 rounded-full" style={{ background: VA_AMBER }} />
              <span className="font-lato text-[13px]" style={{ color: VA_AMBER }}>Sprint 2 · Etapas 04–05 · Canal B2B</span>
            </div>
          </div>

          <div className="relative mb-10">
            <div className="hidden sm:block absolute left-[28px] top-10 bottom-10 w-px"
              style={{ background: `linear-gradient(to bottom, rgba(22,163,74,.4), rgba(29,112,162,.4), rgba(245,158,11,.4), rgba(217,119,6,.4), rgba(217,119,6,.4))` }} />

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
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <span className={`font-poppins font-bold text-[18px] ${open ? 'text-white' : 'text-white/70'}`}>{et.nombre}</span>
                          <SprintBadge label={et.sprint} color={et.color} />
                        </div>
                        <p className="font-lato text-white/40 text-[15px]">{et.descripcion.slice(0, 80)}…</p>
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
                            {et.actividades.map((a, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: et.color }} />
                                <span className="font-lato text-white/65 text-[17px]">{a}</span>
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
            style={{ background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.2)' }}>
            <Rocket className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#f59e0b]" />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              El <strong className="text-white/80">Sprint 2 (Etapas 04–05)</strong> inicia una vez el Sprint 1 esté en producción y el equipo opere con confianza el canal B2C. Ambos sprints se ejecutan dentro de la misma plataforma Sixteam.pro Core — sin cambiar de sistema.
            </p>
          </div>
        </section>

        {/* ─ 04 PLATAFORMA ─ */}
        <section id="alcance" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Plataforma Sixteam.pro Core</TagLabel>
          <SectionTitle>Todo lo que incluye la plataforma</SectionTitle>
          <Rule />
          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Sixteam.pro Core combina CRM comercial + agente IA conversacional + chat center omnicanal en un solo sistema. Esto es lo que estará activo para Visit Antioquia en los dos sprints.
          </p>

          <div className="space-y-2.5 mb-8">
            {DESGLOSE_PLAT.map((bloque, i) => {
              const Icon = bloque.icon;
              const open = desgloseActivo === i;
              const isB2B = i === 3 || i === 4;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${bloque.color}44` : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setDesgloseActivo(open ? null : i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? `${bloque.color}20` : 'rgba(255,255,255,.05)' }}>
                      <Icon className="w-4 h-4 transition-colors" style={{ color: open ? bloque.color : 'rgba(255,255,255,.35)' }} />
                    </div>
                    <div className="flex-1 flex items-center gap-2 flex-wrap">
                      <span className={`font-poppins font-bold text-[17px] ${open ? 'text-white' : 'text-white/70'}`}>{bloque.categoria}</span>
                      <SprintBadge label={isB2B ? 'Sprint 2 · B2B' : 'Sprint 1 · B2C'} color={bloque.color} />
                      <span className="font-lato text-white/30 text-[14px]">{bloque.items.length} ítems</span>
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

          {/* Tabla resumen */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,.08)' }}>
            <button onClick={() => setShowResumen(v => !v)}
              className="w-full flex items-center justify-between px-5 py-3 text-left transition-colors duration-200 hover:bg-white/5"
              style={{ background: 'rgba(255,255,255,.04)' }}>
              <p className="font-poppins font-semibold text-white/60 text-[13px] uppercase tracking-wider">Resumen de entregables</p>
              <ChevronRight className={`w-4 h-4 transition-transform duration-300 text-white/30 ${showResumen ? 'rotate-90' : ''}`} />
            </button>
            {showResumen && <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
              {[
                ['Agente IA B2C',               'Árbol de perfilamiento: hospedaje / actividad / tour cerrado / cotización a medida · Sprint 1'],
                ['Sub-árbol de actividades',    'Aventura · Cultural · Playa (Necoclí) · Paquetes combinados · Sprint 1'],
                ['Chat center omnicanal',       'Bandeja única · 3 usuarios · WhatsApp · Instagram · Messenger · Web · Sprint 1'],
                ['Canal WhatsApp',              'WhatsApp Business API · 1 número (1 cuenta) · Sprint 1'],
                ['Pipeline B2C',               '1 pipeline de etapas mínimas · 20 prop. contactos · 20 prop. oportunidades · Sprint 1'],
                ['Chatbot B2B proveedores',     'Pre-calificación de prestadores turísticos interesados en vincularse · Sprint 2'],
                ['Pipeline B2B',               '1 pipeline de vinculación de proveedores · 20 prop. contactos · 20 prop. oportunidades · Sprint 2'],
                ['Automatizaciones',            'Hasta 6 B2C + hasta 6 B2B: asignación, alertas, cambios de etapa, tareas'],
                ['Flujos de seguimiento',       '2 flujos B2C (leads nuevos + post-perfilamiento) · 1 flujo B2B (prospectos sin respuesta)'],
                ['Base de conocimiento B2C',    'Estructurada desde sitio web + mejora continua con el uso real'],
                ['Usuarios incluidos',          '3 usuarios (Pedro Lopez + equipo)'],
                ['Panel de métricas',           'Hasta 8 informes personalizados · B2C y B2B · conversión · fuente de pauta'],
                ['Capacitación',               'Hasta 4h virtuales por sprint · grabaciones · guías por módulo'],
              ].map(([label, value], i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center px-5 py-3 gap-1 sm:gap-0">
                  <span className="font-poppins font-semibold text-white/70 text-[15px] sm:w-2/5">{label}</span>
                  <span className="font-lato text-white/45 text-[15px]">{value}</span>
                </div>
              ))}
            </div>}
          </div>
        </section>

        {/* ─ 05 INVERSIÓN ─ */}
        <section id="inversion" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Inversión</TagLabel>
          <SectionTitle>Modelo de inversión</SectionTitle>
          <Rule />
          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            La inversión tiene dos componentes: una <strong className="text-white/75">implementación inicial única</strong> (cubre los dos sprints completos) y una <strong className="text-white/75">suscripción mensual</strong> a la plataforma. Valores en pesos colombianos (COP) calculados a TRM de hoy. <strong className="text-white/75">Precios sin IVA.</strong>
          </p>

          {/* Dos cards principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* Implementación */}
            <div className="rounded-2xl p-6 sm:p-7 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, rgba(22,163,74,.08) 0%, rgba(29,112,162,.08) 100%)`, border: `1px solid rgba(22,163,74,.3)` }}>
              <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
                style={{ background: `radial-gradient(circle, rgba(22,163,74,.06), transparent 70%)`, transform: 'translate(20%,-20%)' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="w-4 h-4" style={{ color: VA_GREEN }} />
                  <p className="font-lato text-white/50 text-[13px] uppercase tracking-widest">Implementación · 2 Sprints</p>
                </div>
                <p className="font-poppins font-black text-white leading-none mb-1" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)' }}>
                  {PRECIO_IMPLEMENTACION}
                </p>
                <p className="font-lato text-white/35 text-[14px] mb-3">Pago único · Cubre Sprint 1 + Sprint 2</p>
                {/* Modelo de pago */}
                <div className="rounded-lg px-3 py-2.5 mb-3 flex gap-2 items-start"
                  style={{ background: 'rgba(22,163,74,.07)', border: '1px solid rgba(22,163,74,.2)' }}>
                  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: VA_GREEN }} />
                  <div>
                    <p className="font-poppins font-semibold text-white/75 text-[13px] mb-1.5">Modelo de pago sugerido</p>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-poppins font-black text-[14px] leading-none" style={{ color: VA_GREEN }}>50%</span>
                        <span className="font-lato text-white/50 text-[12px]">al firmar e iniciar el proyecto</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-poppins font-black text-[14px] leading-none" style={{ color: VA_GREEN }}>50%</span>
                        <span className="font-lato text-white/50 text-[12px]">al finalizar · durante la Salida a Producción del Sprint 2</span>
                      </div>
                    </div>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {[
                    'Diseño del árbol de perfilamiento B2C',
                    'Conexión WhatsApp Business API',
                    'CRM B2C · pipeline + automatizaciones',
                    'Agente IA B2C entrenado',
                    'Chatbot B2B de captación de proveedores',
                    'CRM B2B · pipeline de vinculación',
                    'Capacitación Sprint 1 y Sprint 2',
                    'Salida a producción acompañada (ambos canales)',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: VA_GREEN }} />
                      <span className="font-lato text-white/55 text-[14px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Suscripción mensual */}
            <div className="rounded-2xl p-6 sm:p-7 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(29,112,162,.08) 0%, rgba(0,191,165,.08) 100%)', border: '1px solid rgba(0,191,165,.3)' }}>
              <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(0,191,165,.06), transparent 70%)', transform: 'translate(20%,-20%)' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-4 h-4 text-[#00bfa5]" />
                  <p className="font-lato text-white/50 text-[13px] uppercase tracking-widest">Plataforma mensual</p>
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <p className="font-poppins font-black text-white leading-none" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)' }}>
                    {PRECIO_MENSUAL}
                  </p>
                  <span className="font-lato text-white/40 text-[16px] mb-1">/mes</span>
                </div>
                <p className="font-lato text-white/35 text-[14px] mb-1">Sixteam.pro Core · 3 usuarios · CRM B2C + B2B + Agentes IA</p>
                <p className="font-lato text-[12px] px-2 py-0.5 rounded-full self-start mb-4 inline-flex items-center gap-1"
                  style={{ background: 'rgba(0,191,165,.1)', color: '#00bfa5', border: '1px solid rgba(0,191,165,.25)' }}>
                  Facturación mes anticipado
                </p>
                <ul className="space-y-1.5">
                  {[
                    'Acceso completo a CRM B2C y B2B',
                    'Agente IA B2C activo 24/7',
                    'Chatbot B2B activo 24/7',
                    'WhatsApp API + multi-canal',
                    'Seguimientos automáticos activos',
                    'Soporte técnico incluido',
                    'Actualizaciones de plataforma',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 flex-shrink-0 text-[#00bfa5]" />
                      <span className="font-lato text-white/55 text-[14px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Nota usuarios adicionales */}
          <div className="rounded-xl p-4 mb-4 flex gap-3"
            style={{ background: 'rgba(29,112,162,.06)', border: '1px solid rgba(29,112,162,.2)' }}>
            <Users className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#60b4f0]" />
            <p className="font-lato text-white/55 text-[15px] leading-relaxed">
              <strong className="text-white/75">Usuarios adicionales:</strong> el plan base incluye 3 usuarios. Cada usuario adicional tiene un costo de <strong className="text-white/75">{USD_ADICIONAL}/mes</strong> (valor calculado a TRM de hoy).
            </p>
          </div>

          {/* Costos variables */}
          <div className="rounded-xl p-5 mb-4"
            style={{ background: 'rgba(245,158,11,.05)', border: '1px solid rgba(245,158,11,.2)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-[#f59e0b] flex-shrink-0" />
              <p className="font-poppins font-semibold text-white/80 text-[17px]">Costos variables adicionales</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 bg-[#f59e0b]" />
                <div className="flex-1">
                  <p className="font-lato text-white/55 text-[15px] leading-relaxed mb-2">
                    <strong className="text-white/75">Mensajes plantilla WhatsApp (Meta):</strong> cada mensaje enviado fuera de la ventana de servicio de 24h tiene un costo directo de Meta — <strong className="text-white/75">no es un cobro de Sixteam.pro</strong>. La tarifa varía según el país del número destinatario y el tipo de plantilla (Marketing o Utility).{' '}
                    <span className="font-lato text-[13px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,.12)', color: '#f59e0b' }}>Facturado mes vencido · según consumo real</span>
                  </p>
                  <div className="flex flex-wrap gap-3 mb-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{ background: `rgba(22,163,74,.08)`, border: `1px solid rgba(22,163,74,.2)` }}>
                      <span className="font-poppins font-semibold text-white/80 text-[13px]">🇨🇴 Colombia</span>
                      <span className="font-lato text-white/45 text-[12px]">Marketing</span>
                      <span className="font-poppins font-bold text-[13px]" style={{ color: VA_GREEN }}>USD 0.0131</span>
                      <span className="font-lato text-white/30 text-[11px]">|</span>
                      <span className="font-lato text-white/45 text-[12px]">Utility</span>
                      <span className="font-poppins font-bold text-[13px]" style={{ color: VA_GREEN }}>USD 0.0008</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                      <span className="font-lato text-white/40 text-[12px]">Service (atención)</span>
                      <span className="font-poppins font-bold text-[#00bfa5] text-[13px]">FREE</span>
                    </div>
                  </div>
                  <button onClick={() => setShowMetaTable(v => !v)}
                    className="flex items-center gap-1.5 mb-2 transition-colors duration-200"
                    style={{ color: showMetaTable ? '#f59e0b' : 'rgba(255,255,255,.3)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f59e0b')}
                    onMouseLeave={e => (e.currentTarget.style.color = showMetaTable ? '#f59e0b' : 'rgba(255,255,255,.3)')}>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${showMetaTable ? 'rotate-90' : ''}`} />
                    <span className="font-lato text-[13px]">{showMetaTable ? 'Ocultar' : 'Ver'} tarifas por país — fuente Meta</span>
                  </button>
                  {showMetaTable && (
                    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(245,158,11,.2)' }}>
                      <div className="grid grid-cols-4 px-3 py-2 text-[11px] font-poppins font-semibold uppercase tracking-wider text-white/30"
                        style={{ background: 'rgba(245,158,11,.06)', borderBottom: '1px solid rgba(245,158,11,.15)' }}>
                        <span>País / Mercado</span>
                        <span className="text-right">Marketing (USD)</span>
                        <span className="text-right">Utility (USD)</span>
                        <span className="text-right">Service</span>
                      </div>
                      <div className="divide-y max-h-72 overflow-y-auto" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
                        {[
                          ['🇦🇷 Argentina','0.0649','0.0273'],['🇧🇷 Brazil','0.0656','0.0071'],['🇨🇱 Chile','0.0933','0.0210'],
                          ['🇨🇴 Colombia','0.0131','0.0008'],['🇪🇬 Egypt','0.0676','0.0038'],['🇫🇷 France','0.0902','0.0315'],
                          ['🇩🇪 Germany','0.1433','0.0578'],['🇮🇳 India','0.0124','0.0015'],['🇮🇩 Indonesia','0.0432','0.0263'],
                          ['🇮🇱 Israel','0.0371','0.0056'],['🇮🇹 Italy','0.0726','0.0315'],['🇲🇾 Malaysia','0.0903','0.0147'],
                          ['🇲🇽 Mexico','0.0320','0.0089'],['🇳🇱 Netherlands','0.1677','0.0525'],['🇳🇬 Nigeria','0.0542','0.0070'],
                          ['🇵🇰 Pakistan','0.0497','0.0057'],['🇵🇪 Peru','0.0738','0.0210'],['🇷🇺 Russia','0.0842','0.0420'],
                          ['🇸🇦 Saudi Arabia','0.0478','0.0112'],['🇿🇦 South Africa','0.0398','0.0080'],['🇪🇸 Spain','0.0646','0.0210'],
                          ['🇹🇷 Turkey','0.0114','0.0056'],['🇦🇪 United Arab Emirates','0.0524','0.0165'],['🇬🇧 United Kingdom','0.0555','0.0231'],
                          ['🌎 North America','0.0263','0.0036'],['🌍 Rest of Africa','0.0236','0.0042'],['🌏 Rest of Asia Pacific','0.0769','0.0119'],
                          ['🌍 Rest of C. & E. Europe','0.0903','0.0223'],['🌎 Rest of Latin America','0.0777','0.0119'],
                          ['🌍 Rest of Middle East','0.0358','0.0096'],['🌍 Rest of Western Europe','0.0622','0.0180'],['🌐 Other','0.0634','0.0081'],
                        ].map(([market, marketing, utility], i) => (
                          <div key={i} className="grid grid-cols-4 px-3 py-2 items-center"
                            style={{ background: market.includes('Colombia') ? `rgba(22,163,74,.06)` : i % 2 === 0 ? 'rgba(255,255,255,.015)' : 'transparent' }}>
                            <span className={`font-lato text-[13px] ${market.includes('Colombia') ? 'text-white/90 font-semibold' : 'text-white/60'}`}>{market}</span>
                            <span className="font-poppins font-semibold text-[13px] text-right"
                              style={{ color: market.includes('Colombia') ? VA_GREEN : 'rgba(255,255,255,.55)' }}>{marketing}</span>
                            <span className="font-poppins font-semibold text-[13px] text-right"
                              style={{ color: market.includes('Colombia') ? VA_GREEN : 'rgba(255,255,255,.55)' }}>{utility}</span>
                            <span className="font-poppins font-bold text-[12px] text-right text-[#00bfa5]">FREE</span>
                          </div>
                        ))}
                      </div>
                      <div className="px-3 py-2 text-[11px] font-lato text-white/25 text-center"
                        style={{ borderTop: '1px solid rgba(245,158,11,.1)', background: 'rgba(245,158,11,.03)' }}>
                        Fuente: Meta for Developers — WhatsApp Business Platform Pricing · Todos los valores en USD · Aplica por número destinatario
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 bg-[#f59e0b]" />
                <p className="font-lato text-white/55 text-[15px] leading-relaxed">
                  <strong className="text-white/75">Consumo de IA:</strong> costo variable según el volumen de conversaciones procesadas por los agentes (B2C y B2B). Se factura y cobra mes vencido sobre el consumo efectivo del período.{' '}
                  <span className="font-lato text-[13px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,.12)', color: '#f59e0b' }}>Facturado mes vencido · según consumo real</span>
                  {' '}Usa la calculadora a continuación para estimar tu costo mensual.
                </p>
              </div>
            </div>
          </div>

          {/* ── CALCULADORA IA ── */}
          <div className="rounded-2xl overflow-hidden mb-8"
            style={{ background: 'rgba(255,255,255,.03)', border: `1px solid rgba(22,163,74,.2)` }}>
            <div className="px-5 py-4 flex items-center gap-2"
              style={{ background: `linear-gradient(135deg, rgba(22,163,74,.10), rgba(29,112,162,.08))`, borderBottom: '1px solid rgba(255,255,255,.05)' }}>
              <Zap className="w-4 h-4" style={{ color: VA_GREEN }} />
              <p className="font-poppins font-semibold text-white/80 text-[15px] uppercase tracking-wider">Calculadora de consumo mensual IA</p>
            </div>
            <div className="p-5 sm:p-6 space-y-6">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: VA_GREEN }} />
                <span className="font-lato text-white/50 text-[14px]">Valor IA por mensaje</span>
                <span className="font-poppins font-black ml-auto" style={{ color: VA_GREEN }}>USD {IA_USD_POR_MSG}</span>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-lato text-white/60 text-[15px]">Mensajes promedio por conversación</span>
                  <span className="font-poppins font-black text-white text-[20px]">{msgPerConv}</span>
                </div>
                <div className="relative">
                  <input type="range" min={1} max={15} step={1} value={msgPerConv}
                    onChange={(e) => setMsgPerConv(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right, ${VA_GREEN} ${((msgPerConv - 1) / 14) * 100}%, rgba(255,255,255,.12) ${((msgPerConv - 1) / 14) * 100}%)` }} />
                  <div className="absolute -top-5 flex flex-col items-center pointer-events-none"
                    style={{ left: `calc(${((6 - 1) / 14) * 100}% - 18px)` }}>
                    <span className="font-lato text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap"
                      style={{ background: 'rgba(22,163,74,.15)', color: VA_GREEN, border: `1px solid rgba(22,163,74,.3)` }}>
                      prom. 6
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-lato text-white/25 text-[12px]">1</span>
                  <span className="font-lato text-white/25 text-[12px]">15</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-lato text-white/60 text-[15px]">Leads promedio por mes (B2C + B2B)</span>
                  <span className="font-poppins font-black text-white text-[20px]">{leadsPerMonth.toLocaleString('es-CO')}</span>
                </div>
                <input type="range" min={100} max={3000} step={50} value={leadsPerMonth}
                  onChange={(e) => setLeadsPerMonth(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, ${VA_GREEN} ${((leadsPerMonth - 100) / 2900) * 100}%, rgba(255,255,255,.12) ${((leadsPerMonth - 100) / 2900) * 100}%)` }} />
                <div className="flex justify-between mt-1">
                  <span className="font-lato text-white/25 text-[12px]">100</span>
                  <span className="font-lato text-white/25 text-[12px]">3.000</span>
                </div>
              </div>
              <div className="rounded-xl px-4 py-3 flex flex-wrap items-center gap-2 text-[14px]"
                style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                <span className="font-lato text-white/40">USD {IA_USD_POR_MSG}</span>
                <span className="text-white/25">×</span>
                <span className="font-lato text-white/40">{msgPerConv} msg/conv</span>
                <span className="text-white/25">×</span>
                <span className="font-lato text-white/40">{leadsPerMonth.toLocaleString('es-CO')} leads</span>
                <span className="text-white/25">=</span>
                <span className="font-poppins font-bold text-white/70">USD {iaUSD.toFixed(2)}</span>
              </div>
              <div className="rounded-xl p-5 text-center"
                style={{ background: `linear-gradient(135deg, rgba(22,163,74,.10), rgba(29,112,162,.08))`, border: `1px solid rgba(22,163,74,.3)` }}>
                <p className="font-lato text-white/40 text-[13px] uppercase tracking-widest mb-1">Consumo estimado de IA / mes</p>
                <p className="font-poppins font-black text-white mb-1" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}>
                  USD {iaUSD.toFixed(2)}
                </p>
                <p className="font-poppins font-bold mb-3" style={{ color: VA_GREEN, fontSize: '1.1rem' }}>
                  ≈ COP {fmtCOP(iaCOP)}
                </p>
                <p className="font-lato text-white/30 text-[12px]">
                  Estimado · calculado a TRM de hoy · El costo real depende del consumo efectivo de tokens por conversación
                </p>
              </div>
            </div>
          </div>

          {/* Soporte post-implementación */}
          <div>
            <TagLabel>Servicio opcional recurrente — post-implementación</TagLabel>
            <Rule />
            <div className="rounded-xl p-5 flex flex-col gap-4"
              style={{ background: `rgba(22,163,74,.06)`, border: `1px solid rgba(22,163,74,.22)` }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(22,163,74,.15)' }}>
                  <Zap className="w-4 h-4" style={{ color: VA_GREEN }} />
                </div>
                <div>
                  <p className="font-poppins font-bold text-white/85 text-[18px]">Soporte y operaciones continuas</p>
                  <p className="font-lato text-white/40 text-[13px] mt-0.5">Mensual · Hasta 5 horas no acumulables</p>
                </div>
              </div>
              <p className="font-poppins font-black text-white text-[25px] leading-none">
                Desde COP 500.000
                <span className="font-lato font-normal text-white/40 text-[16px] ml-2">/mes</span>
              </p>
              <ul className="space-y-1.5">
                {[
                  'Ajustes y mejoras en flujos del agente IA B2C: nuevos destinos, actividades o condiciones en el árbol de perfilamiento',
                  'Expansión de la base de conocimiento con preguntas reales que van llegando en la operación',
                  'Ajustes al pipeline B2B y al chatbot de captación de proveedores',
                  'Nuevas automatizaciones, seguimientos y vistas del CRM (B2C y B2B)',
                  'Soporte funcional al equipo en el uso de la plataforma · tickets vía WhatsApp · SLA 4h L–V',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 flex-shrink-0 mt-[3px]" style={{ color: VA_GREEN }} />
                    <span className="font-lato text-white/55 text-[15px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ─ 06 VIGENCIA ─ */}
        <section id="vigencia" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 — Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y Términos de la Propuesta</SectionTitle>
          <Rule />

          <div className="space-y-4 mb-10">
            {[
              { titulo: 'Vigencia de la propuesta', desc: 'Esta propuesta es válida por 30 días calendario a partir de la fecha de emisión. Pasado ese plazo, los precios y condiciones podrían estar sujetos a revisión.' },
              { titulo: 'Inicio del proyecto', desc: 'El proyecto inicia una vez se firme el contrato de servicios y se realice el primer pago de la implementación (50%). La fecha de inicio se acuerda en conjunto con el equipo de Visit Antioquia.' },
              { titulo: 'Suscripción mensual', desc: 'La suscripción a Sixteam.pro Core se factura y cobra mes anticipado a partir del primer mes de operación activa del Sprint 1. El consumo de IA y las plantillas de mensajes automáticos se facturan y cobran mes vencido, según el consumo real determinado al cierre de cada período.' },
              { titulo: 'Sprint 2 — Canal B2B de proveedores', desc: 'El Sprint 2 (Etapas 04–05) está incluido en esta propuesta y en el valor de implementación. Se ejecuta una vez el Sprint 1 esté en producción y el canal B2C opere con estabilidad. No requiere inversión adicional de implementación.' },
              { titulo: 'Propiedad del número de WhatsApp', desc: 'El número de WhatsApp pertenece a Visit Antioquia. En caso de terminar la relación comercial, Sixteam.pro acompaña el proceso de desvinculación de la API para que el número pueda operar de forma independiente.' },
              { titulo: 'Confidencialidad', desc: 'Toda la información compartida por Visit Antioquia en el marco de este proyecto es tratada con estricta confidencialidad y no será divulgada a terceros sin autorización expresa.' },
            ].map((item, i) => (
              <div key={i} className="rounded-xl p-5"
                style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.06)' }}>
                <p className="font-poppins font-semibold text-white/80 text-[17px] mb-2">{item.titulo}</p>
                <p className="font-lato text-white/50 text-[16px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Footer firma */}
          <div className="rounded-2xl p-6 sm:p-8"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-widest mb-3">Elaborado por</p>
                <p className="font-poppins font-black text-white text-[18px]">{META.proponente}</p>
                <p className="font-lato text-white/45 text-[15px] mt-1">NIT {META.nit}</p>
                <p className="font-lato text-white/45 text-[15px]">{META.correo}</p>
                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                  <p className="font-lato text-white/30 text-[13px] uppercase tracking-wider mb-1">Representante legal</p>
                  <p className="font-poppins font-semibold text-white/70 text-[16px]">{META.rl}</p>
                </div>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-widest mb-3">Dirigido a</p>
                <p className="font-poppins font-black text-white text-[18px]">{META.razonSocial}</p>
                <p className="font-lato text-white/45 text-[15px] mt-1">{META.contacto}</p>
                <p className="font-lato text-white/45 text-[15px]">{META.sector}</p>
                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                  <p className="font-lato text-white/30 text-[13px] uppercase tracking-wider mb-1">Fecha de emisión</p>
                  <p className="font-poppins font-semibold text-white/70 text-[16px]">{META.fecha}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default VisitAntioquiaProposal;
