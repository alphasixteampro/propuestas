import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap, BarChart3,
  AlertCircle, TrendingUp, Calendar, Info, MapPin,
  MessageSquare, Users, LayoutDashboard, Rocket, Bot, Inbox, Shield,
  Mail, Coins, Headphones, Database, Workflow, Sparkles,
  Boxes, GitMerge, Gauge, Layers, UserCog, Store, ArrowLeftRight, Timer,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente:        'Gabrica',
  tagline:        'El equipo de tecnología que opera sus sistemas de información',
  sector:         'Industria pet · Manufactura y distribución de nutrición, salud y cuidado animal',
  sede:           'Bogotá, Colombia',
  fecha:          'Agosto 2026',
  contacto:       'Ing. Guillermo Sánchez',
  proponente:     'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit:            '901.967.849-4',
  correo:         'alpha@sixteam.pro',
  rl:             'Samuel Armando Burgos Ferrer',
  autor:          'Ernesto Hernández',
  autorCargo:     'Gerente Comercial',
  objetivo:
    'Poner a disposición de Gabrica el servicio Sixteam Ops de Soporte y Operaciones bajo el Plan Integral: un equipo de tecnología Growth Partner que atiende mes a mes los requerimientos sobre Microsoft Dynamics 365, HubSpot y el resto del stack de las áreas de ventas, marketing, servicio y operación.',
};

const GABRICA       = '#2b7fc4';   // azul de marca Gabrica llevado a un tono legible sobre fondo oscuro
const GABRICA_DEEP  = '#0a3d6b';   // azul del logotipo
const DYNAMICS      = '#0078d4';
const HUBSPOT       = '#ff7a59';

const PLAN_COP      = '1.740.000';
const CREDITOS_MES  = 160;
const SOLICITUDES_MES = 15;
const VALOR_CREDITO = '10.875';
const SMMLV_2026    = '1.750.905';
const ESPECIALISTAS = 6;

// ─── DIAGNÓSTICO ─────────────────────────────────────────────────────────────

const HALLAZGOS = [
  {
    titulo: 'Dos sistemas núcleo que necesitan conversar entre sí',
    desc: 'Dynamics 365 sostiene la operación y HubSpot sostiene la gestión comercial. Mientras el intercambio de información entre ambos no sea automático, el equipo termina moviendo datos a mano y trabajando sobre versiones distintas del mismo cliente.',
    icon: ArrowLeftRight, tint: 'blue',
  },
  {
    titulo: 'Los sistemas deben ajustarse al día a día, no al revés',
    desc: 'La operación de Gabrica cambia de forma constante, así que la configuración de las plataformas también tiene que hacerlo. Sin un equipo dedicado a ese ajuste continuo, la herramienta se va quedando atrás del proceso real.',
    icon: Workflow, tint: 'teal',
  },
  {
    titulo: 'Requerimientos de mejora que compiten con la operación diaria',
    desc: 'Las solicitudes de ajuste, informe o automatización compiten por el tiempo del mismo equipo que sostiene la operación. Cuando ambas cosas van al mismo turno, la mejora continua siempre queda de última.',
    icon: Timer, tint: 'amber',
  },
  {
    titulo: 'Cuellos de botella resueltos con trabajo manual',
    desc: 'Entre ventas, marketing, servicio y operación quedan pasos que hoy se sostienen con planillas, correos y reprocesos. Cada uno es pequeño por separado, aunque sumados consumen horas de gente que debería estar en el negocio.',
    icon: Gauge, tint: 'orange',
  },
  {
    titulo: 'Licencias adquiridas con funcionalidades sin activar',
    desc: 'Dynamics 365 y HubSpot traen capacidades ya pagadas que solo rinden cuando alguien las configura, las conecta y las pone en manos del equipo. Sin ese trabajo, la inversión en licenciamiento rinde una fracción de lo que puede.',
    icon: Layers, tint: 'purple',
  },
  {
    titulo: 'Varias audiencias y canales sobre una misma base',
    desc: 'Padres de mascota, veterinarios, pet shops, empresas y el segmento equino conviven en la misma base de datos. Atender bien a cada uno exige segmentación técnica, enrutamiento y comunicaciones diferenciadas que hoy no están sistematizadas.',
    icon: Store, tint: 'rose',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber:  { text: 'text-amber-400',   bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)' },
  blue:   { text: 'text-[#2b7fc4]',   bg: 'rgba(43,127,196,.09)',  border: 'rgba(43,127,196,.24)' },
  rose:   { text: 'text-[#f472b6]',   bg: 'rgba(244,114,182,.07)', border: 'rgba(244,114,182,.2)' },
  orange: { text: 'text-[#ff7a59]',   bg: 'rgba(255,122,89,.07)',  border: 'rgba(255,122,89,.22)' },
  purple: { text: 'text-[#a855f7]',   bg: 'rgba(168,85,247,.07)',  border: 'rgba(168,85,247,.2)' },
  teal:   { text: 'text-[#00bfa5]',   bg: 'rgba(0,191,165,.07)',   border: 'rgba(0,191,165,.2)' },
};

// ─── EQUIPO EQUIVALENTE ──────────────────────────────────────────────────────

const EQUIPO = [
  { rol: 'Líder de servicio y mejora continua', desc: 'Recibe cada solicitud, la traduce a requerimiento técnico, la cotiza en créditos y responde por su entrega', icon: Headphones, color: '#00bfa5' },
  { rol: 'Arquitecto de integraciones',          desc: 'Conecta Dynamics 365, HubSpot y los demás sistemas vía API para que la información viaje sola', icon: GitMerge,  color: GABRICA },
  { rol: 'Especialista en CRM comercial',        desc: 'Pipelines, propiedades, secuencias y automatizaciones sobre HubSpot para ventas y marketing',   icon: LayoutDashboard, color: HUBSPOT },
  { rol: 'Especialista en ERP y procesos',       desc: 'Flujos, maestros, documentos y reglas de negocio sobre Dynamics 365 del lado de operación',     icon: Boxes,     color: DYNAMICS },
  { rol: 'Analista de datos e informes',         desc: 'Paneles de ventas, servicio, rotación y cumplimiento con la información de ambos sistemas',     icon: BarChart3, color: '#60a5fa' },
  { rol: 'Especialista en IA aplicada',          desc: 'Agentes y asistentes que clasifican, redactan, consultan y resuelven dentro de los procesos',   icon: Bot,       color: '#a855f7' },
];

// ─── QUÉ CUBRE EL SERVICIO ───────────────────────────────────────────────────

const COBERTURA = [
  'Atención de requerimientos y solicitudes sobre Dynamics 365, HubSpot y los sistemas conectados',
  'Ejecución de configuraciones adicionales: automatizaciones, informes, propiedades, flujos y reglas',
  'Integraciones entre sistemas vía API para que la información viaje sin intervención manual',
  'Levantamiento y ejecución de oportunidades de mejora sobre los procesos de cada área',
  'Incorporación de agentes de inteligencia artificial dentro de los flujos de trabajo',
  'Refuerzo en el uso de las herramientas para los equipos de ventas, marketing, servicio y operación',
  'Desglose detallado de los créditos consumidos por cada solicitud atendida en el mes',
  'Atención vía canal dedicado con SLA de 4 horas en días hábiles',
];

const FUERA_DE_ALCANCE = [
  'Licenciamiento de Microsoft Dynamics 365, HubSpot y demás plataformas de terceros',
  'Creación de contenido para marketing: textos, piezas gráficas, fotografía o video',
  'Definición de la estrategia comercial, de precios o de portafolio',
  'Gestión de redes sociales y administración de la inversión publicitaria',
];

// ─── VELOCIDAD: ANTES Y CON SIXTEAM OPS ──────────────────────────────────────

const VELOCIDAD = [
  { tarea: 'Un informe nuevo de ventas por canal y marca',            antes: 'Semanas',  ahora: 'Horas' },
  { tarea: 'Un campo o propiedad nueva replicada en ambos sistemas',  antes: 'Días',     ahora: 'Minutos' },
  { tarea: 'Una automatización de seguimiento comercial',             antes: 'Semanas',  ahora: 'Días' },
  { tarea: 'Corrección de una integración que dejó de sincronizar',   antes: 'Días',     ahora: 'Horas' },
];

// ─── CASOS DE USO POR ÁREA ───────────────────────────────────────────────────

type Caso = { area: string; titulo: string; desc: string; creditos: string; tiempo: string };

const CASOS: Caso[] = [
  {
    area: 'Ventas', titulo: 'Sincronización del maestro de clientes entre Dynamics 365 y HubSpot',
    desc: 'La ficha del cliente deja de vivir en dos lugares. Lo que se crea o actualiza en el ERP aparece en el CRM y viceversa, con reglas claras sobre qué sistema manda en cada campo.',
    creditos: '20 a 24', tiempo: '5 a 8 días hábiles',
  },
  {
    area: 'Ventas', titulo: 'Cotización en campo conectada al CRM',
    desc: 'El asesor genera la cotización desde el celular con el portafolio y las condiciones vigentes, queda registrada en la oportunidad y dispara el seguimiento automático sin volver a la oficina.',
    creditos: '14 a 18', tiempo: '4 a 6 días hábiles',
  },
  {
    area: 'Ventas', titulo: 'Alertas comerciales según el estado del pedido en el ERP',
    desc: 'Cuando un pedido cambia de estado, se despacha o se represa en Dynamics 365, el asesor recibe la alerta en su bandeja del CRM con el contexto del cliente y la tarea ya creada.',
    creditos: '12 a 16', tiempo: '3 a 5 días hábiles',
  },
  {
    area: 'Ventas', titulo: 'Reposición automatizada para pet shops y veterinarias',
    desc: 'A partir del histórico de compra y del ciclo de consumo de cada producto, el sistema calcula cuándo toca reponer y le entrega al asesor la lista priorizada de cuentas por contactar esa semana.',
    creditos: '16 a 20', tiempo: '5 a 7 días hábiles',
  },
  {
    area: 'Marketing', titulo: 'Segmentación técnica de la base por canal y audiencia',
    desc: 'Padre de mascota, veterinario, pet shop, empresa y segmento equino quedan diferenciados con criterios automáticos de clasificación, de modo que cada comunicación salga al público correcto.',
    creditos: '10 a 14', tiempo: '3 a 5 días hábiles',
  },
  {
    area: 'Marketing', titulo: 'Flujos de correo con reglas de frecuencia y control de saturación',
    desc: 'Montaje de las secuencias sobre HubSpot con los contenidos que entrega el equipo, más ventanas de descanso y control de solapamiento para que un mismo contacto no reciba tres correos el mismo día.',
    creditos: '10 a 16', tiempo: '4 a 6 días hábiles',
  },
  {
    area: 'Marketing', titulo: 'Formularios y landings conectados a la base de datos',
    desc: 'Registro a eventos, contenidos de la escuela de padres de mascota o solicitudes de contacto que entran directo al CRM con su origen trazado y su flujo de seguimiento activo.',
    creditos: '6 a 10', tiempo: '2 a 4 días hábiles',
  },
  {
    area: 'Servicio', titulo: 'Enrutamiento automático de solicitudes al asesor de zona',
    desc: 'Las solicitudes que entran por el sitio, el directorio de bienestar o los canales de contacto se clasifican y se asignan solas al responsable correcto, con SLA de respuesta y escalamiento configurado.',
    creditos: '10 a 14', tiempo: '3 a 5 días hábiles',
  },
  {
    area: 'Servicio', titulo: 'Bandeja unificada de conversaciones con trazabilidad en el CRM',
    desc: 'WhatsApp, correo y formularios llegan a un mismo punto de atención, cada conversación queda asociada al cliente y el histórico deja de depender del teléfono de quien la atendió.',
    creditos: '14 a 18', tiempo: '4 a 7 días hábiles',
  },
  {
    area: 'Servicio', titulo: 'Encuestas de satisfacción automatizadas después de la entrega',
    desc: 'El disparo se hace desde el evento real de entrega registrado en el ERP, la respuesta vuelve al CRM y las calificaciones bajas abren caso de servicio de forma automática.',
    creditos: '8 a 12', tiempo: '3 a 5 días hábiles',
  },
  {
    area: 'Operación', titulo: 'Paneles de ventas, cartera y rotación por canal y marca',
    desc: 'Un solo tablero que cruza la información comercial del CRM con la operativa del ERP, actualizado de forma automática y disponible para dirección y para cada líder de área.',
    creditos: '14 a 20', tiempo: '5 a 8 días hábiles',
  },
  {
    area: 'Operación', titulo: 'Agente de IA sobre el portafolio para el equipo comercial',
    desc: 'Un asistente entrenado con el catálogo de marcas, fichas técnicas y condiciones comerciales, que responde en segundos lo que hoy implica buscar en varios documentos o preguntarle a otra persona.',
    creditos: '16 a 22', tiempo: '6 a 10 días hábiles',
  },
  {
    area: 'Operación', titulo: 'Depuración y deduplicación de contactos y empresas',
    desc: 'Reglas de normalización, detección de duplicados y unificación de registros, para que los informes dejen de contar dos veces al mismo cliente.',
    creditos: '8 a 14', tiempo: '3 a 6 días hábiles',
  },
  {
    area: 'Operación', titulo: 'Automatización de aprobaciones y documentos internos',
    desc: 'Solicitudes que hoy viajan por correo pasan a un flujo con responsable, tiempo de respuesta y registro, de modo que nadie tiene que preguntar en qué punto va cada trámite.',
    creditos: '12 a 18', tiempo: '4 a 7 días hábiles',
  },
];

const AREAS = ['Todas', 'Ventas', 'Marketing', 'Servicio', 'Operación'];

const AREA_STYLE: Record<string, { bg: string; border: string; color: string }> = {
  Ventas:    { bg: 'rgba(255,122,89,.12)', border: 'rgba(255,122,89,.3)',  color: HUBSPOT },
  Marketing: { bg: 'rgba(0,191,165,.12)',  border: 'rgba(0,191,165,.3)',   color: '#00bfa5' },
  Servicio:  { bg: 'rgba(168,85,247,.12)', border: 'rgba(168,85,247,.3)',  color: '#a855f7' },
  Operación: { bg: 'rgba(43,127,196,.14)', border: 'rgba(43,127,196,.32)', color: GABRICA },
  Datos:     { bg: 'rgba(96,165,250,.12)', border: 'rgba(96,165,250,.3)',  color: '#60a5fa' },
};

// ─── EJEMPLO DE REPORTE MENSUAL DE CRÉDITOS ──────────────────────────────────

const REPORTE = [
  { solicitud: 'Sincronización del maestro de clientes entre Dynamics 365 y HubSpot',        area: 'Ventas',    creditos: 22 },
  { solicitud: 'Agente de IA sobre el portafolio de marcas para el equipo comercial',        area: 'Operación', creditos: 16 },
  { solicitud: 'Panel de informes de ventas por canal, marca y zona',                        area: 'Datos',     creditos: 16 },
  { solicitud: 'Alertas comerciales automáticas según el estado del pedido en el ERP',       area: 'Ventas',    creditos: 14 },
  { solicitud: 'Flujo de reposición para pet shops y veterinarias según ciclo de consumo',   area: 'Ventas',    creditos: 14 },
  { solicitud: 'Automatización del ciclo de cotización de la fuerza de ventas en campo',     area: 'Ventas',    creditos: 12 },
  { solicitud: 'Segmentación de la base por canal: persona, veterinario, pet shop y empresa',area: 'Marketing', creditos: 12 },
  { solicitud: 'Enrutamiento de solicitudes entrantes al asesor de zona con SLA',            area: 'Servicio',  creditos: 10 },
  { solicitud: 'Depuración y deduplicación de contactos y empresas en el CRM',               area: 'Operación', creditos: 10 },
  { solicitud: 'Formularios y landing de registro conectados al CRM',                        area: 'Marketing', creditos: 8 },
  { solicitud: 'Reglas de asignación y tiempos de respuesta para el equipo de servicio',     area: 'Servicio',  creditos: 8 },
  { solicitud: 'Ajuste de flujos de correo y control de frecuencia por audiencia',           area: 'Marketing', creditos: 6 },
  { solicitud: 'Soporte y resolución de incidencias sobre las integraciones activas',        area: 'Operación', creditos: 6 },
  { solicitud: 'Capacitación al equipo comercial sobre los nuevos flujos del CRM',           area: 'Ventas',    creditos: 6 },
];

const TOTAL_REPORTE = REPORTE.reduce((a, r) => a + r.creditos, 0);

// ─── CATÁLOGO DE ACTIVIDADES ─────────────────────────────────────────────────

const CATALOGO = [
  {
    categoria: 'Ventas y CRM sobre HubSpot',
    icon: LayoutDashboard,
    color: HUBSPOT,
    items: [
      'Configuración de pipelines, etapas de negocio y probabilidades por canal de venta',
      'Propiedades personalizadas de contacto, empresa y negocio según el modelo comercial de Gabrica',
      'Secuencias y tareas automáticas de seguimiento para la fuerza de ventas',
      'Reglas de asignación de leads y cuentas por zona, canal o línea de producto',
      'Automatización del ciclo de cotización y su registro en la oportunidad',
      'Informes de conversión, ciclo de venta, cobertura de cuentas y actividad comercial',
      'Alertas al asesor a partir de eventos que ocurren en el ERP',
    ],
  },
  {
    categoria: 'Operación e integraciones con Dynamics 365',
    icon: Boxes,
    color: DYNAMICS,
    items: [
      'Sincronización de clientes, productos, pedidos y estados entre el ERP y el CRM',
      'Definición de reglas de gobierno del dato: qué sistema manda en cada campo y con qué frecuencia',
      'Automatización de flujos internos de aprobación, documentos y trámites entre áreas',
      'Conexión con el e-commerce, el sitio web y los canales de contacto',
      'Monitoreo de las integraciones activas para detectar sincronizaciones caídas',
      'Levantamiento de procesos con cuello de botella y propuesta técnica de automatización',
    ],
  },
  {
    categoria: 'Marketing y comunicación con la base',
    icon: Mail,
    color: '#00bfa5',
    items: [
      'Montaje de flujos de correo automatizados con los contenidos que entrega el equipo',
      'Segmentación técnica por canal, comportamiento de compra, especie y ciclo de vida',
      'Reglas de frecuencia, ventanas de descanso y control de solapamiento entre envíos',
      'Landings, formularios y registros a eventos conectados a la base de datos',
      'Sincronización de audiencias hacia las plataformas de pauta, incluidas las exclusiones',
      'Seguimiento de aperturas, clics, atribución y conversiones por campaña',
    ],
  },
  {
    categoria: 'Servicio y experiencia del cliente',
    icon: Headphones,
    color: '#a855f7',
    items: [
      'Centralización de WhatsApp, correo y formularios en una sola bandeja de atención',
      'Enrutamiento y escalamiento automático de solicitudes según tipo, zona y prioridad',
      'Configuración de tiempos de respuesta, alertas de vencimiento e indicadores de servicio',
      'Encuestas de satisfacción disparadas desde eventos reales de la operación',
      'Apertura automática de casos cuando una calificación queda por debajo del umbral',
      'Base de conocimiento interna para consulta del equipo de atención',
    ],
  },
  {
    categoria: 'Inteligencia artificial aplicada',
    icon: Bot,
    color: '#a855f7',
    items: [
      'Agentes entrenados con el portafolio, fichas técnicas y condiciones comerciales de Gabrica',
      'Clasificación automática de solicitudes, correos y conversaciones entrantes',
      'Calificación de leads antes de que lleguen al asesor comercial',
      'Redacción asistida de respuestas, resúmenes de conversación y notas de gestión',
      'Análisis de la base para detectar patrones de recompra y cuentas en riesgo',
      'Asistentes internos de consulta para los equipos de ventas, servicio y operación',
    ],
  },
  {
    categoria: 'Datos, informes y gobierno',
    icon: Database,
    color: '#60a5fa',
    items: [
      'Paneles que cruzan información comercial del CRM con información operativa del ERP',
      'Informes de ventas, cartera, rotación y cumplimiento por canal, marca y zona',
      'Depuración, normalización y deduplicación de la base de contactos y empresas',
      'Migraciones y cargues masivos con validación previa',
      'Documentación técnica de cada integración y automatización entregada',
      'Capacitación a los equipos sobre el uso y el monitoreo de lo construido',
    ],
  },
];

// ─── RUTA DE ARRANQUE ────────────────────────────────────────────────────────

type Actividad = { text: string; tag?: string };

const FASES = [
  {
    num: '01',
    nombre: 'Levantamiento técnico y priorización',
    duracion: 'Mes 1',
    icon: FileText,
    color: GABRICA,
    colorAlpha: 'rgba(43,127,196,.12)',
    colorBorder: 'rgba(43,127,196,.3)',
    descripcion: 'Antes de tocar cualquier configuración, entendemos cómo está montado hoy el stack de Gabrica y acordamos en qué orden se atacan los frenos.',
    actividades: [
      { text: 'Sesión de arranque para alinear prioridades técnicas del trimestre con cada área', tag: 'Trabajo en conjunto' },
      { text: 'Levantamiento del estado actual de Dynamics 365, HubSpot y los sistemas conectados' },
      { text: 'Mapeo de los puntos donde hoy la información se mueve de forma manual entre sistemas' },
      { text: 'Definición de las reglas de gobierno del dato entre ERP y CRM' },
      { text: 'Priorización conjunta del backlog de requerimientos con su estimación en créditos', tag: 'Trabajo en conjunto' },
      { text: 'Habilitación del canal dedicado de atención y del tablero de consumo de créditos' },
    ] as Actividad[],
  },
  {
    num: '02',
    nombre: 'Integración y primeras automatizaciones',
    duracion: 'Mes 2',
    icon: GitMerge,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.3)',
    descripcion: 'Se conectan los sistemas y se resuelven primero los cuellos de botella que más horas manuales consumen, de modo que el retorno se vea temprano.',
    actividades: [
      { text: 'Sincronización del maestro de clientes y empresas entre Dynamics 365 y HubSpot' },
      { text: 'Automatización de alertas comerciales a partir de eventos del ERP' },
      { text: 'Segmentación técnica de la base por canal, audiencia y comportamiento de compra' },
      { text: 'Depuración y deduplicación de los registros que hoy distorsionan los informes' },
      { text: 'Primeros flujos automatizados sobre los procesos priorizados en el mes 1' },
    ] as Actividad[],
  },
  {
    num: '03',
    nombre: 'Ritmo mensual de mejora continua',
    duracion: 'Mes 3 en adelante',
    icon: Rocket,
    color: HUBSPOT,
    colorAlpha: 'rgba(255,122,89,.10)',
    colorBorder: 'rgba(255,122,89,.3)',
    descripcion: 'Con la base integrada, el servicio entra en su ritmo natural: cada mes el equipo de Gabrica decide en qué invertir los créditos y Sixteam ejecuta.',
    actividades: [
      { text: 'Atención continua de requerimientos de ventas, marketing, servicio y operación' },
      { text: 'Paneles de informes que cruzan la información de ambos sistemas' },
      { text: 'Incorporación de agentes de IA dentro de los flujos ya construidos' },
      { text: 'Monitoreo de integraciones activas y corrección de sincronizaciones caídas' },
      { text: 'Comité mensual de revisión de consumo, resultados y siguientes prioridades', tag: 'Trabajo en conjunto' },
      { text: 'Capacitación a los equipos sobre lo entregado en el período' },
    ] as Actividad[],
  },
];

const SECCIONES = [
  { id: 'resumen',    label: 'Resumen' },
  { id: 'objetivo',   label: 'Objetivo' },
  { id: 'servicio',   label: 'Servicio' },
  { id: 'casos',      label: 'Casos de uso' },
  { id: 'alcance',    label: 'Alcance' },
  { id: 'arranque',   label: 'Arranque' },
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

// Logotipo de Microsoft en cuatro cuadros, para acompañar la mención a Dynamics 365
const MicrosoftMark = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="flex-shrink-0" aria-hidden="true">
    <rect x="0"  y="0"  width="11" height="11" fill="#f25022" />
    <rect x="13" y="0"  width="11" height="11" fill="#7fba00" />
    <rect x="0"  y="13" width="11" height="11" fill="#00a4ef" />
    <rect x="13" y="13" width="11" height="11" fill="#ffb900" />
  </svg>
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const GabricaProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [faseActiva, setFaseActiva] = useState<number | null>(null);
  const [catalogoActivo, setCatalogoActivo] = useState<number | null>(null);
  const [areaActiva, setAreaActiva] = useState('Todas');
  const [casoAbierto, setCasoAbierto] = useState<number | null>(0);
  const [showReporte, setShowReporte] = useState(false);
  const [showEjemplo, setShowEjemplo] = useState(false);
  const [showCostosVariables, setShowCostosVariables] = useState(false);
  const [showCalcIA, setShowCalcIA] = useState(false);
  const [mensajesConv, setMensajesConv] = useState(6);
  const [convsMes, setConvsMes] = useState(150);

  const consumoIAUSD = (0.02 * mensajesConv * convsMes).toFixed(2);

  const casosFiltrados = areaActiva === 'Todas' ? CASOS : CASOS.filter(c => c.area === areaActiva);

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
            <div className={`rounded-full flex-shrink-0 transition-all duration-300 ${activeSection === s.id ? 'w-2 h-2 bg-[#00bfa5] shadow-[0_0_6px_rgba(0,191,165,.7)]' : 'w-1.5 h-1.5 bg-white/50'}`} />
          </button>
        ))}
      </nav>

      {/* ══════════ PORTADA */}
      <header className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #010408 0%, #020810 55%, #030d1a 100%)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(43,127,196,.07) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,191,165,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
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
              <img src="/gabrica-logo.png" alt="Gabrica" className="max-h-full w-auto object-contain"
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
              <TagLabel>Propuesta de trabajo y cotización · Agosto 2026</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${GABRICA_DEEP}, ${GABRICA})` }}>
                  <Shield className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">Gabrica</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(0,191,165,.10)', border: '1px solid rgba(0,191,165,.25)', color: '#00bfa5' }}>
                  Sixteam Ops
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}>
                Propuesta<br />
                <span style={{ background: `linear-gradient(90deg,${GABRICA},#00bfa5)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Comercial
                </span>
              </h1>
              <p className="font-lato text-white/55 text-xl leading-relaxed mb-5">
                Sixteam entra como el equipo de tecnología Growth Partner de Gabrica: atiende mes a mes los requerimientos sobre Dynamics 365, HubSpot y el resto del stack de ventas, marketing, servicio y operación.
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
                  { icon: Coins,    text: `Plan Integral · ${CREDITOS_MES} créditos/mes` },
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
                  {['1. Resumen ejecutivo','2. Objetivo general','3. Sixteam Ops','4. Casos de uso','5. Alcance del servicio','6. Ruta de arranque','7. Inversión','8. Vigencia y términos'].map((item, i) => (
                    <button key={i} onClick={() => scrollTo(SECCIONES[i]?.id)}
                      className="font-lato text-white/45 text-[15px] hover:text-[#00bfa5] transition-colors duration-200 text-left flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#00bfa5]/40 flex-shrink-0" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Derecha animada: Gabrica en el centro, sistemas alrededor */}
            <div className="flex items-center justify-center relative min-h-[380px]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="cover-glow absolute w-80 h-80 rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(43,127,196,.12) 0%, rgba(0,191,165,.05) 50%, transparent 70%)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full" style={{ border: '1px solid rgba(43,127,196,.14)' }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(0,191,165,.18)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: GABRICA, boxShadow: '0 0 6px rgba(43,127,196,.8)' }} />
                </div>
              </div>

              <div className="cover-float relative z-10 flex flex-col items-center gap-4 w-full px-6">
                <div className="w-full max-w-[320px] flex items-center justify-center p-4 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,.95)', border: '1px solid rgba(255,255,255,.1)' }}>
                  <img src="/gabrica-logo.png" alt="Gabrica" className="max-h-20 w-auto object-contain" />
                </div>

                <div className="flex items-center gap-3 w-full max-w-[320px]">
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.1))' }} />
                  <div className="flex items-center justify-center px-3 py-1 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(0,191,165,.08)', border: '1px solid rgba(0,191,165,.22)' }}>
                    <span className="font-lato text-[11px] uppercase tracking-[0.18em] text-[#00bfa5]">Stack operado</span>
                  </div>
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,.1), transparent)' }} />
                </div>

                <div className="grid grid-cols-2 gap-3 w-full max-w-[320px]">
                  <div className="rounded-xl p-3 flex flex-col gap-2"
                    style={{ background: 'rgba(0,120,212,.09)', border: '1px solid rgba(0,120,212,.28)' }}>
                    <MicrosoftMark size={16} />
                    <div>
                      <p className="font-poppins font-bold text-white/85 text-[13px] leading-tight">Dynamics 365</p>
                      <p className="font-lato text-white/40 text-[11px] leading-tight mt-0.5">ERP · Operación</p>
                    </div>
                  </div>
                  <div className="rounded-xl p-3 flex flex-col gap-2"
                    style={{ background: 'rgba(255,122,89,.08)', border: '1px solid rgba(255,122,89,.28)' }}>
                    <img src="/hubspot-icon.webp" alt="HubSpot" className="w-4 h-4 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    <div>
                      <p className="font-poppins font-bold text-white/85 text-[13px] leading-tight">HubSpot</p>
                      <p className="font-lato text-white/40 text-[11px] leading-tight mt-0.5">CRM · Comercial</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl w-full max-w-[320px]"
                  style={{ background: 'rgba(0,191,165,.07)', border: '1px solid rgba(0,191,165,.22)' }}>
                  <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-6 w-auto object-contain"
                    style={{ filter: 'drop-shadow(0 2px 10px rgba(0,191,165,.45))' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <span className="font-poppins font-bold text-white/75 text-[13px]">Sixteam Ops opera y conecta</span>
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
            style={{ background: 'rgba(2,8,20,.85)', border: '1px solid rgba(43,127,196,.22)' }}>
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center">
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <div className="w-36 h-20 flex items-center justify-center p-2 rounded-xl overflow-hidden"
                  style={{ background: 'rgba(255,255,255,.95)', border: '1px solid rgba(255,255,255,.1)' }}>
                  <img src="/gabrica-logo.png" alt="Gabrica" className="max-w-full max-h-full object-contain" />
                </div>
                <span className="font-lato text-[11px] uppercase tracking-[0.2em]" style={{ color: GABRICA }}>Desde 1992</span>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                  <p className="font-lato text-white/70 text-[15px]">{META.sector}</p>
                </div>
                <div>
                  <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Contacto</p>
                  <p className="font-poppins font-semibold text-white/80 text-[16px]">{META.contacto}</p>
                </div>
                <div>
                  <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sistemas núcleo</p>
                  <p className="font-lato text-white/60 text-[15px]">Microsoft Dynamics 365 como ERP y HubSpot como CRM comercial</p>
                </div>
                <div>
                  <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Áreas de foco</p>
                  <p className="font-lato text-white/60 text-[15px]">Ventas, marketing, servicio y operación</p>
                </div>
                <div>
                  <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Servicio propuesto</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: '#00bfa5' }} />
                    <p className="font-poppins font-semibold text-[#00bfa5] text-[14px]">Sixteam Ops · Plan Integral</p>
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
              Gabrica lleva más de tres décadas construyendo la industria pet en Colombia y ya tomó la decisión difícil: montó su operación sobre{' '}
              <strong className="text-white/90 font-semibold">Microsoft Dynamics 365 como ERP</strong> y su gestión comercial sobre{' '}
              <strong className="text-white/90 font-semibold">HubSpot como CRM</strong>. Esa parte está resuelta. Lo que queda por resolver es distinto, ya que un sistema de información no se instala una vez y se deja quieto.
            </p>
            <p>
              En la conversación con el <strong className="text-white/90 font-semibold">Ing. Guillermo Sánchez</strong> quedó claro el punto: estas plataformas necesitan ser dinámicas, ajustarse al día a día y mejorar de forma continua. Cada semana aparecen requerimientos nuevos, es decir un informe que hace falta, un campo que hay que replicar, una integración que se cayó o un proceso que sigue moviéndose a mano entre dos sistemas que deberían conversar solos. Sin un equipo dedicado a eso, esos requerimientos se acumulan y la herramienta se va quedando atrás del negocio.
            </p>
            <p>
              Esta propuesta responde con el servicio <strong className="text-white/90 font-semibold">Sixteam Ops de Soporte y Operaciones</strong>. Sixteam se incorpora como el{' '}
              <strong className="text-white/90 font-semibold">equipo de tecnología Growth Partner</strong> de Gabrica, especialista en sistemas de información aplicados a ventas, marketing, servicio y operación, que recibe y resuelve los requerimientos mes a mes, integra las plataformas entre sí y convierte los cuellos de botella en automatizaciones.
            </p>
          </div>

          {/* Hallazgos */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> {HALLAZGOS.length} frenos identificados en la conversación inicial
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
              style={{ background: 'radial-gradient(circle, rgba(43,127,196,.09), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 text-[#00bfa5] mb-4" />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[22px] leading-relaxed">
              Poner a disposición de Gabrica el servicio <strong className="text-white font-black">Sixteam Ops de Soporte y Operaciones</strong> bajo el <strong className="text-white font-black">Plan Integral</strong>: un equipo de tecnología que atiende los requerimientos de ventas, marketing, servicio y operación mes a mes,{' '}
              <em className="not-italic" style={{ color: GABRICA }}>integrando Dynamics 365 con HubSpot para que Gabrica le saque el provecho completo a las herramientas que ya tiene</em>.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Créditos incluidos',    value: `${CREDITOS_MES}`, sub: 'Por período mensual' },
              { label: 'Solicitudes al mes',    value: `~${SOLICITUDES_MES}`, sub: 'Promedio según complejidad' },
              { label: 'Especialistas',         value: `${ESPECIALISTAS}`, sub: 'Perfiles a disposición' },
              { label: 'Primera respuesta',     value: '4h', sub: 'SLA en días hábiles' },
            ].map((k, i) => (
              <div key={i} className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(29,112,162,.07)', border: '1px solid rgba(29,112,162,.2)' }}>
                <p className="font-poppins font-black text-white text-[28px] leading-none mb-1">{k.value}</p>
                <p className="font-poppins font-semibold text-white/70 text-[13px] mb-0.5">{k.label}</p>
                <p className="font-lato text-white/35 text-[12px]">{k.sub}</p>
              </div>
            ))}
          </div>

          {/* Velocidad de resolución */}
          <div className="mt-6 rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/80 text-[18px] mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00bfa5]" /> Lo que antes tomaba semanas, resuelto en horas
            </p>
            <p className="font-lato text-white/50 text-[16px] leading-relaxed mb-5">
              Cada solicitud se atiende con agentes de inteligencia artificial trabajando bajo el criterio de especialistas humanos. La IA acelera el análisis, la construcción y la documentación, mientras que el especialista decide, valida y responde por el resultado sobre los sistemas de Gabrica.
            </p>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,.07)' }}>
              <div className="grid px-4 py-2 font-lato text-white/25 text-[11px] uppercase tracking-wider"
                style={{ gridTemplateColumns: '1fr 90px 90px', background: 'rgba(255,255,255,.02)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                <span>Tipo de requerimiento</span>
                <span className="text-center">Antes</span>
                <span className="text-center">Con Sixteam</span>
              </div>
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
                {VELOCIDAD.map((v, i) => (
                  <div key={i} className="px-4 py-3 grid items-center gap-2"
                    style={{ gridTemplateColumns: '1fr 90px 90px', background: i % 2 === 0 ? 'rgba(255,255,255,.012)' : 'transparent' }}>
                    <span className="font-lato text-white/60 text-[14px] leading-snug">{v.tarea}</span>
                    <span className="justify-self-center font-lato text-white/35 text-[13px] line-through">{v.antes}</span>
                    <span className="justify-self-center font-poppins font-bold text-[13px]" style={{ color: '#00bfa5' }}>{v.ahora}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─ 03 SERVICIO ─ */}
        <section id="servicio" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — El servicio</TagLabel>
          <SectionTitle>Sixteam Ops: Soporte y Operaciones</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            En lugar de contratar un proyecto cerrado o de sumar una vacante más al equipo, Gabrica cuenta con un equipo disponible para recibir solicitudes, resolverlas técnicamente y ejecutarlas sobre sus sistemas, bajo un plan mensual de créditos. Cada solicitud se cotiza antes de ejecutarse, de modo que el equipo sabe siempre cuánto consume y en cuánto tiempo queda lista.
          </p>

          {/* Bloque principal del Plan Integral */}
          <div className="rounded-2xl p-5 sm:p-7 mb-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(0,191,165,.08) 0%, rgba(3,13,26,.9) 100%)', border: '1px solid rgba(0,191,165,.28)' }}>
            <div className="absolute top-0 right-0 w-56 h-56 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,191,165,.07), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <div className="relative z-10">
              <div className="flex flex-wrap items-end gap-3 mb-4">
                <p className="font-poppins font-black leading-none" style={{ fontSize: 'clamp(1.9rem, 4.2vw, 2.4rem)', color: '#00bfa5' }}>
                  Plan Integral
                </p>
                <span className="font-poppins font-bold text-white/70 text-[17px] mb-1">· {CREDITOS_MES} créditos/mes</span>
                <span className="font-lato text-[12px] px-3 py-1 rounded-full uppercase tracking-wider mb-1.5"
                  style={{ background: 'rgba(0,191,165,.15)', border: '1px solid rgba(0,191,165,.35)', color: '#00bfa5' }}>
                  Growth Partner
                </span>
              </div>

              <p className="font-lato text-white/55 text-[17px] leading-relaxed mb-5">
                Acompañamiento mensual sobre los sistemas de información de Gabrica. Cubre la atención de requerimientos, la ejecución de configuraciones adicionales, la integración entre plataformas y la incorporación de automatizaciones e inteligencia artificial en los procesos. Los {CREDITOS_MES} créditos alcanzan en promedio para <strong className="text-white/75">cerca de {SOLICITUDES_MES} solicitudes mensuales</strong>.
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

          {/* Equipo equivalente de 6 especialistas */}
          <div className="rounded-2xl p-5 sm:p-6 mb-4"
            style={{ background: 'rgba(43,127,196,.06)', border: '1px solid rgba(43,127,196,.24)' }}>
            <p className="font-poppins font-semibold text-white/85 text-[19px] mb-2 flex items-center gap-2">
              <UserCog className="w-4 h-4" style={{ color: GABRICA }} /> La capacidad de {ESPECIALISTAS} especialistas, sin {ESPECIALISTAS} contrataciones
            </p>
            <p className="font-lato text-white/55 text-[16px] leading-relaxed mb-5">
              Construir esta misma capacidad de forma interna implicaría abrir varias vacantes, buscar perfiles escasos en el mercado y sostenerlos aunque la carga varíe mes a mes. Con Sixteam Ops, Gabrica dispone de estos {ESPECIALISTAS} perfiles bajo un solo plan mensual, y cada solicitud llega al perfil que corresponde.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EQUIPO.map((e, i) => {
                const EIcon = e.icon;
                return (
                  <div key={i} className="rounded-lg p-3.5 flex gap-3" style={{ background: 'rgba(2,8,20,.55)', border: '1px solid rgba(255,255,255,.06)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${e.color}1f` }}>
                      <EIcon className="w-4 h-4" style={{ color: e.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-poppins font-semibold text-white/85 text-[15px] leading-snug">{e.rol}</p>
                      <p className="font-lato text-white/45 text-[13px] leading-snug mt-0.5">{e.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Qué opera Sixteam y qué queda del lado de Gabrica */}
          <div className="rounded-xl p-4 sm:p-5 mb-4 flex gap-3"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: HUBSPOT }} />
            <div className="flex-1 min-w-0">
              <p className="font-poppins font-semibold text-white/80 text-[16px] mb-1.5">Qué opera Sixteam y qué queda del lado de Gabrica</p>
              <p className="font-lato text-white/50 text-[15px] leading-relaxed mb-3">
                Sixteam opera la tecnología y los sistemas de información, es decir configura, automatiza, integra y mantiene la infraestructura sobre la que corre la operación. La estrategia del negocio y el contenido siguen siendo de Gabrica, de modo que estos puntos quedan fuera del servicio:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
                {FUERA_DE_ALCANCE.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[7px]" style={{ background: HUBSPOT }} />
                    <span className="font-lato text-white/45 text-[14px] leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cómo funciona el consumo de créditos */}
          <div className="rounded-2xl p-5 sm:p-6 mb-4"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
            <p className="font-poppins font-semibold text-white/80 text-[18px] mb-2 flex items-center gap-2">
              <Coins className="w-4 h-4 text-[#00bfa5]" /> Cómo funciona el consumo de créditos
            </p>
            <p className="font-lato text-white/50 text-[16px] leading-relaxed mb-4">
              Por cada solicitud que entra, Sixteam cotiza cuántos créditos consumirá y en cuánto tiempo estará lista. Gabrica decide si aprueba antes de que se ejecute cualquier trabajo, de modo que nunca hay sorpresas al cierre del mes. El crédito es la unidad con la que se mide el esfuerzo técnico, así una solicitud simple consume pocos créditos y una integración compleja consume más.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
              {[
                { rango: '4 a 8', tipo: 'Solicitud simple',  ej: 'Un campo nuevo, un ajuste de flujo, una capacitación puntual, soporte de una incidencia' },
                { rango: '10 a 16', tipo: 'Solicitud media',  ej: 'Un informe, una automatización de seguimiento, un formulario conectado, una segmentación' },
                { rango: '18 a 24', tipo: 'Solicitud compleja', ej: 'Una integración entre sistemas, un agente de IA, un panel que cruza ERP y CRM' },
              ].map((c, i) => (
                <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(2,8,20,.6)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <p className="font-poppins font-black text-[22px] leading-none mb-1" style={{ color: '#00bfa5' }}>{c.rango}</p>
                  <p className="font-lato text-white/30 text-[11px] uppercase tracking-wider mb-2">créditos</p>
                  <p className="font-poppins font-semibold text-white/80 text-[14px] mb-1">{c.tipo}</p>
                  <p className="font-lato text-white/45 text-[13px] leading-snug">{c.ej}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-4 flex flex-col gap-2.5" style={{ background: 'rgba(2,8,20,.6)', border: '1px solid rgba(255,255,255,.06)' }}>
              <p className="font-poppins font-semibold text-white/60 text-[13px] uppercase tracking-wider">Flujo de cada solicitud</p>
              {[
                { step: '01', text: 'El equipo de Gabrica envía la solicitud describiendo qué necesita, por ejemplo que el asesor reciba una alerta en HubSpot cuando el pedido cambia de estado en Dynamics 365.' },
                { step: '02', text: 'Sixteam analiza la solicitud y responde con la cotización: cuántos créditos consume y en cuánto tiempo queda lista.' },
                { step: '03', text: 'Gabrica aprueba y Sixteam ejecuta. Los créditos se descuentan del saldo del período, visible en todo momento.' },
                { step: '04', text: 'Al cierre del mes se entrega el reporte con el desglose de créditos por solicitud y el saldo del período.' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className="font-poppins font-black text-[11px] px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(0,191,165,.15)', color: '#00bfa5' }}>{s.step}</span>
                  <p className="font-lato text-white/55 text-[15px] leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
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
                <div className="hidden sm:grid px-5 py-2 font-lato text-white/20 text-[11px] uppercase tracking-wider"
                  style={{ gridTemplateColumns: '1fr 100px 80px', background: 'rgba(255,255,255,.015)', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                  <span>Solicitud atendida</span>
                  <span className="text-center">Área</span>
                  <span className="text-right">Créditos</span>
                </div>
                <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
                  {REPORTE.map((r, i) => {
                    const a = AREA_STYLE[r.area];
                    return (
                      <div key={i} className="px-4 sm:px-5 py-3 grid items-center gap-2"
                        style={{ gridTemplateColumns: '1fr 100px 80px', background: i % 2 === 0 ? 'rgba(255,255,255,.012)' : 'transparent' }}>
                        <span className="font-lato text-white/60 text-[14px] leading-snug">{r.solicitud}</span>
                        <span className="justify-self-center font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap"
                          style={{ background: a.bg, border: `1px solid ${a.border}`, color: a.color }}>
                          {r.area}
                        </span>
                        <span className="font-poppins font-bold text-white/75 text-[14px] text-right">{r.creditos}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="px-4 sm:px-5 py-4 grid items-center gap-2"
                  style={{ gridTemplateColumns: '1fr 100px 80px', background: 'rgba(0,191,165,.07)', borderTop: '1px solid rgba(0,191,165,.2)' }}>
                  <span className="font-poppins font-bold text-white text-[16px]">Total del mes</span>
                  <span />
                  <span className="font-poppins font-black text-[16px] text-right" style={{ color: '#00bfa5' }}>
                    {TOTAL_REPORTE} / {CREDITOS_MES}
                  </span>
                </div>
                <div className="px-4 sm:px-5 py-3" style={{ background: 'rgba(255,255,255,.02)', borderTop: '1px solid rgba(255,255,255,.05)' }}>
                  <p className="font-lato text-white/30 text-[13px] leading-relaxed">
                    Ejemplo referencial de un mes con solicitudes de alta complejidad que agota los {CREDITOS_MES} créditos. Los meses con solicitudes más livianas permiten atender un mayor número de requerimientos. Los créditos no utilizados no son acumulables al período siguiente, y si una solicitud excede el saldo disponible se cotiza el excedente aparte o se programa para el siguiente período, siempre con aprobación previa.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Ejemplo real de solicitud y respuesta */}
          <div className="rounded-xl overflow-hidden transition-all duration-300"
            style={{ border: showEjemplo ? `1px solid ${GABRICA}55` : '1px solid rgba(255,255,255,.08)' }}>
            <button onClick={() => setShowEjemplo(v => !v)}
              className="w-full flex items-center gap-3 px-4 sm:px-5 py-4 text-left transition-all duration-200"
              style={{ background: showEjemplo ? 'rgba(43,127,196,.07)' : 'rgba(255,255,255,.02)' }}>
              <MessageSquare className="w-4 h-4 flex-shrink-0" style={{ color: showEjemplo ? GABRICA : 'rgba(255,255,255,.35)' }} />
              <div className="flex-1">
                <span className="font-poppins font-bold text-[16px]" style={{ color: showEjemplo ? '#fff' : 'rgba(255,255,255,.7)' }}>
                  Ejemplo de solicitud y respuesta
                </span>
                <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wide align-middle"
                  style={{ background: 'rgba(43,127,196,.14)', border: '1px solid rgba(43,127,196,.32)', color: GABRICA }}>
                  Referencial
                </span>
              </div>
              <ChevronRight className="w-4 h-4 transition-transform duration-300 flex-shrink-0"
                style={{ color: showEjemplo ? GABRICA : 'rgba(255,255,255,.3)', transform: showEjemplo ? 'rotate(90deg)' : undefined }} />
            </button>

            {showEjemplo && (
              <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                <div className="pt-4 space-y-3">
                  <div className="rounded-lg p-3 flex gap-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                    <span className="font-poppins font-black text-[11px] px-2 py-0.5 rounded flex-shrink-0 h-fit mt-0.5"
                      style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.5)' }}>Gabrica</span>
                    <p className="font-lato text-white/55 text-[15px] leading-relaxed italic">
                      "Necesitamos que cuando un pedido cambie de estado en Dynamics, el asesor lo vea en HubSpot sin tener que entrar al ERP, y que si el pedido lleva más de dos días represado se le cree la tarea de contactar al cliente."
                    </p>
                  </div>
                  <div className="rounded-lg p-3 flex gap-3" style={{ background: 'rgba(43,127,196,.07)', border: '1px solid rgba(43,127,196,.2)' }}>
                    <span className="font-poppins font-black text-[11px] px-2 py-0.5 rounded flex-shrink-0 h-fit mt-0.5"
                      style={{ background: 'rgba(43,127,196,.22)', color: GABRICA }}>Sixteam</span>
                    <p className="font-lato text-white/55 text-[15px] leading-relaxed italic">
                      "Recibido. La solicitud incluye la conexión vía API con Dynamics 365, el mapeo de estados de pedido hacia propiedades de HubSpot, la automatización de la alerta al asesor dueño de la cuenta y la regla de creación de tarea a las 48 horas. Son <strong className="text-white/75 not-italic">14 créditos</strong> y queda lista en 4 días hábiles. Quedarían 146 créditos disponibles este mes. ¿Aprobamos?"
                    </p>
                  </div>
                  <div className="rounded-lg p-3 flex gap-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                    <span className="font-poppins font-black text-[11px] px-2 py-0.5 rounded flex-shrink-0 h-fit mt-0.5"
                      style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.5)' }}>Gabrica</span>
                    <p className="font-lato text-white/55 text-[15px] leading-relaxed italic">"Aprobado."</p>
                  </div>
                  <p className="font-lato text-white/35 text-[13px] leading-relaxed pt-1">
                    Sixteam construye la integración, la prueba con datos reales, la documenta y la deja monitoreada. A partir de ahí el asesor ve el estado del pedido sin salir del CRM, y nadie tiene que preguntar por WhatsApp en qué va un despacho.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ─ 04 CASOS DE USO ─ */}
        <section id="casos" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Casos de uso</TagLabel>
          <SectionTitle>En qué puede usar Gabrica a este equipo</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-6">
            Estos son ejemplos concretos de solicitudes que Gabrica puede enviar con cargo a los créditos del Plan Integral, con su consumo estimado y su tiempo de entrega de referencia. Sirven para dimensionar qué cabe en un mes y cómo se comporta el consumo según la complejidad de cada requerimiento.
          </p>

          {/* Filtro por área */}
          <div className="flex flex-wrap gap-2 mb-5 no-print">
            {AREAS.map(a => {
              const activo = areaActiva === a;
              const st = AREA_STYLE[a];
              return (
                <button key={a} onClick={() => { setAreaActiva(a); setCasoAbierto(null); }}
                  className="font-lato text-[14px] px-3.5 py-1.5 rounded-full transition-all duration-200"
                  style={{
                    background: activo ? (st ? st.bg : 'rgba(0,191,165,.14)') : 'rgba(255,255,255,.03)',
                    border: `1px solid ${activo ? (st ? st.border : 'rgba(0,191,165,.32)') : 'rgba(255,255,255,.08)'}`,
                    color: activo ? (st ? st.color : '#00bfa5') : 'rgba(255,255,255,.45)',
                  }}>
                  {a}
                  <span className="ml-1.5 opacity-50">
                    {a === 'Todas' ? CASOS.length : CASOS.filter(c => c.area === a).length}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-2.5">
            {casosFiltrados.map((c, i) => {
              const st = AREA_STYLE[c.area];
              const abierto = casoAbierto === i;
              return (
                <div key={`${areaActiva}-${i}`} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: abierto ? `1px solid ${st.border}` : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setCasoAbierto(abierto ? null : i)}
                    className="w-full flex items-center gap-3 p-4 text-left">
                    <span className="font-lato text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0 hidden sm:inline"
                      style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.color }}>
                      {c.area}
                    </span>
                    <span className={`flex-1 font-poppins font-semibold text-[16px] leading-snug ${abierto ? 'text-white' : 'text-white/75'}`}>
                      {c.titulo}
                    </span>
                    <span className="font-poppins font-bold text-[13px] flex-shrink-0 whitespace-nowrap" style={{ color: st.color }}>
                      {c.creditos} <span className="font-lato font-normal text-white/30 text-[12px]">cr.</span>
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${abierto ? 'rotate-90' : ''}`}
                      style={{ color: abierto ? st.color : 'rgba(255,255,255,.3)' }} />
                  </button>
                  {abierto && (
                    <div className="px-4 pb-4 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <p className="font-lato text-white/60 text-[15px] leading-relaxed pt-3.5 mb-3">{c.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 font-lato text-[13px] px-2.5 py-1 rounded-lg"
                          style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.color }}>
                          <Coins className="w-3.5 h-3.5" /> {c.creditos} créditos
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-lato text-[13px] px-2.5 py-1 rounded-lg text-white/50"
                          style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                          <Clock className="w-3.5 h-3.5" /> {c.tiempo}
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-lato text-[13px] px-2.5 py-1 rounded-lg text-white/50 sm:hidden"
                          style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                          <Layers className="w-3.5 h-3.5" /> {c.area}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl p-4 flex gap-3"
            style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.2)' }}>
            <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
            <p className="font-lato text-white/55 text-[15px] leading-relaxed">
              El consumo indicado es un rango de referencia, ya que la cifra final depende del estado actual de la configuración y del volumen de datos involucrado. Cada solicitud se cotiza con su número exacto antes de ejecutarse, así que Gabrica siempre aprueba conociendo el costo en créditos.
            </p>
          </div>
        </section>

        {/* ─ 05 ALCANCE ─ */}
        <section id="alcance" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Alcance del servicio</TagLabel>
          <SectionTitle>Qué se puede solicitar</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Este es el catálogo de actividades que Gabrica puede solicitar con cargo a los créditos del Plan Integral, agrupadas por área. No es una lista cerrada, sino una referencia de lo que el servicio cubre: si el equipo necesita algo que no está aquí, se plantea la solicitud y Sixteam evalúa cómo resolverlo y cuántos créditos consume.
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

          {/* Plataforma Sixteam incluida */}
          <div className="mt-6 rounded-xl p-5 sm:p-6 flex gap-3"
            style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.22)' }}>
            <Shield className="w-4 h-4 flex-shrink-0 mt-1 text-[#00bfa5]" />
            <div className="flex-1 min-w-0">
              <p className="font-poppins font-semibold text-white/85 text-[19px] mb-2">Plataforma Sixteam.pro incluida con el servicio</p>
              <p className="font-lato text-white/55 text-[16px] leading-relaxed mb-4">
                Además de operar Dynamics 365 y HubSpot, con el servicio de <strong className="text-white/75">Soporte y Operaciones</strong> Gabrica accede a las funcionalidades de la <strong className="text-white/75">plataforma Sixteam.pro sin costo adicional de licencia</strong> mientras el plan esté activo. Sirven como complemento para cubrir lo que el stack actual no resuelve, y se habilitan bajo solicitud del equipo.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { icon: Inbox,           titulo: 'ChatCenter omnicanal', desc: 'WhatsApp, Instagram y Facebook en una sola bandeja' },
                  { icon: Mail,            titulo: 'Email Marketing', desc: 'Campañas, flujos automatizados y segmentación de la base' },
                  { icon: Bot,             titulo: 'Asistentes de IA', desc: 'Agentes conversacionales entrenados con información de Gabrica' },
                  { icon: Workflow,        titulo: 'Automatizaciones', desc: 'Flujos, disparadores y reglas sobre la operación' },
                  { icon: LayoutDashboard, titulo: 'CRM y pipelines', desc: 'Gestión de oportunidades comerciales complementaria' },
                  { icon: BarChart3,       titulo: 'Informes y paneles', desc: 'Métricas de campañas, conversión y actividad comercial' },
                ].map((f, i) => {
                  const FIcon = f.icon;
                  return (
                    <div key={i} className="rounded-lg p-3 flex gap-2.5" style={{ background: 'rgba(2,8,20,.5)', border: '1px solid rgba(255,255,255,.06)' }}>
                      <FIcon className="w-4 h-4 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-poppins font-semibold text-white/80 text-[15px]">{f.titulo}</p>
                        <p className="font-lato text-white/45 text-[13px] leading-snug">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 rounded-lg p-3.5 flex gap-2.5" style={{ background: 'rgba(43,127,196,.08)', border: '1px solid rgba(43,127,196,.24)' }}>
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GABRICA }} />
                <p className="font-lato text-white/55 text-[14px] leading-relaxed">
                  <strong className="text-white/75">Licenciamiento de terceros aparte.</strong> Las licencias de Microsoft Dynamics 365, HubSpot y demás plataformas contratadas por Gabrica se mantienen a nombre de Gabrica y no forman parte de este plan. Sixteam opera sobre ellas con los accesos que el equipo habilite.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─ 06 ARRANQUE ─ */}
        <section id="arranque" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 — Ruta de arranque</TagLabel>
          <SectionTitle>Los primeros 3 meses</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            El servicio no tiene cronograma cerrado, ya que Gabrica decide mes a mes en qué invertir los créditos. Aun así, esta es la ruta que Sixteam recomienda para los primeros tres meses, orientada a dejar los dos sistemas conversando antes de construir sobre ellos.
          </p>

          <div className="relative mb-10">
            <div className="hidden sm:block absolute left-[28px] top-10 bottom-10 w-px"
              style={{ background: 'linear-gradient(to bottom, rgba(43,127,196,.4), rgba(0,191,165,.4), rgba(255,122,89,.4))' }} />

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
            <p className="font-lato text-white/55 text-[15px] leading-relaxed">
              El arranque no tiene costo aparte, ya que se ejecuta con los mismos créditos del plan. Eso permite empezar por lo que más duele hoy en lugar de pagar un proyecto de implementación antes de ver el primer resultado.
            </p>
          </div>
        </section>

        {/* ─ 07 INVERSIÓN ─ */}
        <section id="inversion" ref={s7.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s7.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>07 — Propuesta de inversión</TagLabel>
          <SectionTitle>Plan Integral · Sixteam Ops</SectionTitle>
          <Rule />
          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Un único valor mensual anticipado que cubre el servicio completo. No hay costo de implementación ni pago inicial, ya que el trabajo de arranque se ejecuta con los créditos del propio plan. Todos los valores están expresados en{' '}
            <strong className="text-white/75">pesos colombianos (COP)</strong>.
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
                  ${PLAN_COP}
                </p>
                <span className="font-lato text-white/40 text-[18px] mb-1">COP /mes + IVA</span>
              </div>
              <p className="font-lato text-white/45 text-[15px] mb-5">
                Plan Integral · {CREDITOS_MES} créditos mensuales · ≈ ${VALOR_CREDITO} COP por crédito · Sin costo de implementación
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                {[
                  { label: 'Créditos mensuales incluidos', value: `${CREDITOS_MES}` },
                  { label: 'Solicitudes promedio al mes', value: `~${SOLICITUDES_MES}` },
                  { label: 'Perfiles especialistas disponibles', value: `${ESPECIALISTAS}` },
                  { label: 'Áreas cubiertas', value: 'Ventas, mkt, servicio y operación' },
                  { label: 'Cotización en créditos antes de ejecutar', value: 'Siempre' },
                  { label: 'Reporte mensual de consumo', value: 'Incluido' },
                  { label: 'Canal dedicado de atención', value: 'SLA 4h hábiles' },
                  { label: 'Costo de implementación', value: 'Sin costo' },
                ].map((r, i) => (
                  <li key={i} className="flex items-center justify-between gap-2 py-0.5">
                    <span className="font-lato text-white/55 text-[15px]">{r.label}</span>
                    <span className="font-poppins font-bold text-white/85 text-[15px] flex-shrink-0 text-right">{r.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Comparativo con salario mínimo */}
          <div className="rounded-2xl p-5 sm:p-6 mb-4"
            style={{ background: 'rgba(43,127,196,.06)', border: '1px solid rgba(43,127,196,.24)' }}>
            <p className="font-poppins font-semibold text-white/85 text-[19px] mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: GABRICA }} /> Qué representa esta inversión
            </p>
            <p className="font-lato text-white/55 text-[16px] leading-relaxed mb-5">
              El Plan Integral cuesta menos que un salario mínimo mensual en Colombia para 2026, que quedó en ${SMMLV_2026} COP. Por debajo de lo que vale una sola contratación de entrada, Gabrica dispone de la capacidad operativa equivalente a {ESPECIALISTAS} especialistas trabajando como el equipo de tecnología que siempre ha necesitado, sin nómina, sin prestaciones, sin proceso de selección y sin el riesgo de que ese conocimiento se vaya con una renuncia.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { valor: `$${PLAN_COP}`, label: 'Plan Integral mensual', sub: 'COP + IVA · 160 créditos', destacado: true },
                { valor: `$${SMMLV_2026}`, label: 'Salario mínimo 2026', sub: 'Antes de prestaciones y aportes', destacado: false },
                { valor: `${ESPECIALISTAS}`, label: 'Especialistas a disposición', sub: 'Bajo un solo plan mensual', destacado: false },
              ].map((c, i) => (
                <div key={i} className="rounded-xl p-4 text-center"
                  style={{
                    background: c.destacado ? 'rgba(0,191,165,.08)' : 'rgba(2,8,20,.55)',
                    border: `1px solid ${c.destacado ? 'rgba(0,191,165,.28)' : 'rgba(255,255,255,.07)'}`,
                  }}>
                  <p className="font-poppins font-black leading-none mb-1.5"
                    style={{ fontSize: 'clamp(1.15rem, 3vw, 1.5rem)', color: c.destacado ? '#00bfa5' : 'rgba(255,255,255,.8)' }}>
                    {c.valor}
                  </p>
                  <p className="font-poppins font-semibold text-white/70 text-[13px]">{c.label}</p>
                  <p className="font-lato text-white/35 text-[12px] mt-0.5 leading-snug">{c.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Costos variables */}
          <div className="rounded-xl p-4 sm:p-5 mb-4 flex gap-3"
            style={{ background: 'rgba(255,122,89,.05)', border: '1px solid rgba(255,122,89,.2)' }}>
            <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: HUBSPOT }} />
            <div className="flex-1 min-w-0">
              <p className="font-poppins font-semibold text-white/80 text-[18px] mb-2">Qué queda fuera del valor mensual</p>
              <p className="font-lato text-white/50 text-[16px] leading-relaxed mb-3">
                El valor del Plan Integral cubre el trabajo del equipo de Sixteam y el acceso a la plataforma Sixteam.pro. Existen además costos que cobran directamente los proveedores según consumo real, por lo que se trasladan sin margen adicional.
              </p>

              <div className="rounded-xl overflow-hidden transition-all duration-300"
                style={{ border: showCostosVariables ? '1px solid rgba(245,158,11,.35)' : '1px solid rgba(255,255,255,.07)' }}>
                <button onClick={() => setShowCostosVariables(v => !v)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200"
                  style={{ background: showCostosVariables ? 'rgba(245,158,11,.06)' : 'transparent' }}>
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: showCostosVariables ? '#f59e0b' : 'rgba(255,255,255,.35)' }} />
                  <span className="font-lato text-[13px] flex-1" style={{ color: showCostosVariables ? '#f59e0b' : 'rgba(255,255,255,.4)' }}>
                    Costos variables y de terceros
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 flex-shrink-0"
                    style={{ color: showCostosVariables ? '#f59e0b' : 'rgba(255,255,255,.25)', transform: showCostosVariables ? 'rotate(90deg)' : undefined }} />
                </button>

                {showCostosVariables && (
                  <div className="px-4 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                    <div className="pt-4 space-y-4">

                      {/* Licenciamiento */}
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 bg-[#f59e0b]" />
                        <p className="font-lato text-white/55 text-[14px] leading-relaxed flex-1">
                          <strong className="text-white/75">Licenciamiento de Dynamics 365, HubSpot y otras plataformas:</strong> se mantiene a nombre de Gabrica y lo factura cada proveedor de forma directa. Sixteam opera sobre las licencias existentes y, si un requerimiento exige un módulo o nivel de licencia que hoy no está contratado, lo informa antes de ejecutar.
                        </p>
                      </div>

                      {/* WhatsApp Meta */}
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 bg-[#f59e0b]" />
                        <div className="flex-1">
                          <p className="font-lato text-white/55 text-[14px] leading-relaxed mb-2">
                            <strong className="text-white/75">Mensajes plantilla de WhatsApp (Meta):</strong> cada mensaje enviado fuera de la ventana de servicio de 24 horas, como recordatorios, campañas o seguimientos, tiene un costo directo de Meta, por lo que{' '}
                            <strong className="text-white/75">no es un cobro de Sixteam.pro</strong>. La tarifa varía según el tipo de plantilla.{' '}
                            <span className="font-lato text-[12px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,.12)', color: '#f59e0b' }}>Facturado mes vencido · según consumo real</span>
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                              style={{ background: 'rgba(43,127,196,.08)', border: '1px solid rgba(43,127,196,.25)' }}>
                              <span className="font-poppins font-semibold text-white/90 text-[13px]">🇨🇴 Colombia</span>
                              <span className="font-lato text-white/45 text-[12px]">Marketing</span>
                              <span className="font-poppins font-bold text-[13px]" style={{ color: GABRICA }}>USD 0.0131</span>
                              <span className="font-lato text-white/30 text-[11px]">|</span>
                              <span className="font-lato text-white/45 text-[12px]">Utility</span>
                              <span className="font-poppins font-bold text-[13px]" style={{ color: GABRICA }}>USD 0.0008</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                              style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                              <span className="font-lato text-white/40 text-[12px]">Service (atención entrante)</span>
                              <span className="font-poppins font-bold text-[#00bfa5] text-[13px]">FREE</span>
                            </div>
                          </div>
                          <p className="font-lato text-white/25 text-[11px] mt-2">
                            Fuente: Meta for Developers · WhatsApp Business Platform Pricing · Valores por número destinatario
                          </p>
                        </div>
                      </div>

                      {/* Email masivo */}
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 bg-[#f59e0b]" />
                        <p className="font-lato text-white/55 text-[14px] leading-relaxed flex-1">
                          <strong className="text-white/75">Envíos masivos de correo:</strong> el volumen enviado por encima del cupo incluido en la plataforma tiene un costo por envío según el proveedor. Se dimensiona junto al equipo antes de lanzar cada campaña, de manera que el gasto quede aprobado previamente.{' '}
                          <span className="font-lato text-[12px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,.12)', color: '#f59e0b' }}>Facturado mes vencido · según consumo real</span>
                        </p>
                      </div>

                      {/* Consumo IA */}
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 bg-[#f59e0b]" />
                        <div className="flex-1">
                          <p className="font-lato text-white/55 text-[14px] leading-relaxed mb-3">
                            <strong className="text-white/75">Consumo de IA en producción:</strong> si se activa un agente conversacional de cara al cliente, el costo varía según el volumen de mensajes que procesa y se factura mes vencido sobre el consumo efectivo. El uso de IA que hace el propio equipo de Sixteam para resolver las solicitudes ya está incluido en el plan.{' '}
                            <span className="font-lato text-[12px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,.12)', color: '#f59e0b' }}>Facturado mes vencido · según consumo real</span>
                          </p>

                          {/* Calculadora IA */}
                          <div className="rounded-xl overflow-hidden transition-all duration-300"
                            style={{ border: showCalcIA ? '1px solid rgba(43,127,196,.35)' : '1px solid rgba(255,255,255,.07)' }}>
                            <button onClick={() => setShowCalcIA(v => !v)}
                              className="w-full flex items-center gap-2.5 px-4 py-3 text-left"
                              style={{ background: showCalcIA ? 'rgba(43,127,196,.07)' : 'transparent' }}>
                              <span className="font-lato text-[13px] flex-1" style={{ color: 'rgba(43,127,196,.9)' }}>
                                + Calcular consumo mensual por uso de IA
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 flex-shrink-0"
                                style={{ color: 'rgba(43,127,196,.7)', transform: showCalcIA ? 'rotate(90deg)' : undefined }} />
                            </button>
                            {showCalcIA && (
                              <div className="px-4 pb-4 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                                <div className="pt-3 space-y-3">
                                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                                    style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: GABRICA }} />
                                    <span className="font-lato text-white/50 text-[13px]">Valor IA por mensaje</span>
                                    <span className="font-poppins font-black ml-auto text-[13px]" style={{ color: GABRICA }}>USD 0.02</span>
                                  </div>
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
                                  <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: 'rgba(43,127,196,.2)' }}>
                                    <div>
                                      <span className="font-lato text-white/40 text-[11px]">Consumo estimado</span>
                                      <p className="font-lato text-white/25 text-[10px] mt-0.5">USD 0.02 × {mensajesConv} msg × {convsMes} conv</p>
                                    </div>
                                    <span className="font-poppins font-bold text-[14px]" style={{ color: GABRICA }}>≈ USD {consumoIAUSD}/mes</span>
                                  </div>
                                  <p className="font-lato text-white/25 text-[10px] leading-relaxed">
                                    Estimación referencial. El consumo real varía según el volumen de conversaciones gestionadas por el agente de IA.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Nota de cierre de inversión */}
          <div className="rounded-xl p-4 flex gap-3"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <Zap className="w-4 h-4 text-[#00bfa5] flex-shrink-0 mt-0.5" />
            <p className="font-lato text-white/55 text-[15px] leading-relaxed">
              El crédito hace que la relación sea flexible: un mes puede irse completo en una integración grande y el siguiente en quince ajustes pequeños. Gabrica define la prioridad de cada período y el valor mensual se mantiene fijo, de modo que la mejora continua deja de depender de aprobar un proyecto nuevo cada vez.
            </p>
          </div>
        </section>

        {/* ── LOGOS ── */}
        <div className="mt-16">
          <LogoCarousel />
        </div>

        {/* ─ 08 VIGENCIA ─ */}
        <section id="vigencia" ref={s8.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s8.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>08 — Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y Términos de la Propuesta</SectionTitle>
          <Rule />

          <div className="space-y-3">
            {[
              { titulo: 'Aprobación', desc: 'Para aceptar esta propuesta y dar inicio al servicio se requiere confirmación vía WhatsApp, correo o verbal, con lo cual se habilita el contrato a firmar y se procede con el arranque.', icon: CheckCircle },
              { titulo: 'Términos de pago', desc: `El Plan Integral de Sixteam Ops se factura por período mensual anticipado por valor de $${PLAN_COP} COP más IVA. Los pagos se realizan mediante transferencia bancaria en pesos colombianos.`, icon: FileText },
              { titulo: 'Créditos y su vigencia', desc: `El plan incluye ${CREDITOS_MES} créditos por período mensual, equivalentes en promedio a cerca de ${SOLICITUDES_MES} solicitudes. Los créditos no utilizados no son acumulables al período siguiente. Si una solicitud excede el saldo disponible, se cotiza el excedente aparte o se programa para el período siguiente, siempre con aprobación previa.`, icon: Coins },
              { titulo: 'Cotización previa de cada solicitud', desc: 'Ninguna solicitud se ejecuta sin aprobación. Sixteam informa antes cuántos créditos consume y en cuánto tiempo estará lista, de modo que Gabrica mantiene el control del consumo durante todo el período.', icon: MessageSquare },
              { titulo: 'Alcance del servicio', desc: 'Sixteam opera la tecnología y los sistemas de información de ventas, marketing, servicio y operación: configuración, automatización, integración, soporte, analítica e incorporación de inteligencia artificial. No incluye la creación de contenido para marketing, la definición de la estrategia comercial, la gestión de redes sociales ni la administración de la inversión publicitaria.', icon: AlertCircle },
              { titulo: 'Licenciamiento de terceros', desc: 'Las licencias de Microsoft Dynamics 365, HubSpot y demás plataformas contratadas por Gabrica se mantienen a nombre de Gabrica y no forman parte de este plan. Sixteam opera sobre ellas con los accesos que el equipo habilite, y si un requerimiento exige un módulo o nivel de licencia no contratado, lo informa antes de ejecutar.', icon: Layers },
              { titulo: 'Plataforma Sixteam incluida', desc: 'La plataforma Sixteam.pro se incluye sin costo adicional de licencia mientras el servicio esté activo, y sus funcionalidades se habilitan bajo solicitud del equipo. Al finalizar el servicio, el acceso a la plataforma se cotiza de forma independiente.', icon: Shield },
              { titulo: 'Módulos adicionales', desc: 'La implementación, configuración, activación y capacitación de módulos nuevos de la plataforma Sixteam.pro, como ChatCenter o Asistentes de IA, se cotizan aparte como proyecto de implementación. Una vez implementados, su soporte y sus ajustes posteriores quedan cubiertos por los créditos del servicio.', icon: LayoutDashboard },
              { titulo: 'Costos variables de terceros', desc: 'El licenciamiento de las plataformas, los mensajes plantilla de WhatsApp cobrados por Meta, los envíos masivos de correo por encima del cupo incluido y el consumo de IA de agentes en producción los cobra directamente cada proveedor y se trasladan sin margen adicional, facturados mes vencido según consumo real.', icon: TrendingUp },
              { titulo: 'Atención y tiempos de respuesta', desc: 'La atención se presta vía canal dedicado con un SLA de 4 horas en días hábiles para la primera respuesta. El tiempo de ejecución de cada solicitud se informa en su cotización, ya que depende de la complejidad.', icon: Headphones },
              { titulo: 'Confidencialidad y manejo de accesos', desc: 'Sixteam opera con los accesos mínimos necesarios sobre cada sistema y bajo acuerdo de confidencialidad. Toda la información de Gabrica, su base de clientes y su configuración siguen siendo propiedad exclusiva de Gabrica, y al finalizar el servicio se entrega la documentación de lo construido y se revocan los accesos.', icon: Users },
              { titulo: 'Permanencia mínima', desc: 'Aunque no existe cláusula de permanencia, Sixteam solicita establecer contractualmente un mínimo de 3 meses de prestación del servicio, como garantía de que el trabajo de integración alcance a construirse y a mostrar resultados. Este período puede cancelarse anticipadamente por fallas, errores o quejas del equipo de Gabrica hacia Sixteam.', icon: Clock },
              { titulo: 'Inicio del servicio', desc: 'El servicio comienza desde la recepción del primer pago mensual y la entrega de accesos por parte de Gabrica, específicamente los ambientes de Microsoft Dynamics 365 y HubSpot, y los sistemas conectados que se definan en el levantamiento del mes 1.', icon: Rocket },
              { titulo: 'Vigencia de la propuesta', desc: 'Esta propuesta tiene una vigencia de 30 días calendario desde su fecha de emisión (Agosto 2026). Pasado este plazo, los valores podrán ser revisados según condiciones del mercado.', icon: Calendar },
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
              style={{ background: 'radial-gradient(circle at 50% 100%, rgba(43,127,196,.07), transparent 70%)' }} />
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

export default GabricaProposal;
