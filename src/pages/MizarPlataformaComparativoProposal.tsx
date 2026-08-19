import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap,
  AlertCircle, Info, Calendar, MapPin, Minus,
  Users, Shield, Lock, XCircle, Bot, MessageSquare,
  ClipboardList, Split, HardHat, FileSpreadsheet, Stamp, Settings,
  Workflow, Download, Layers,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Mizar Diseño y Construcción · Ictinos',
  tagline: 'Construcción · Requisiciones y pagos de obra',
  sector: 'Diseño y construcción · Desarrollo de proyectos',
  fecha: 'Agosto 2026',
  lugar: 'Colombia',
  objetivo: 'Plataforma de Requisiciones y Pagos de Obra: sistema a la medida que digitaliza el ciclo completo, desde la solicitud hasta el gasto organizado por obra y listo para Contabilidad. Este documento presenta los dos alcances disponibles, para que Mizar elija con qué profundidad arrancar.',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  destinatarios: 'Juliana Parada Villamizar',
};

const MIZAR_GOLD = '#c9a443';
const C_BASICO   = '#38bdf8';
const C_COMPLETO = MIZAR_GOLD;

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber:  { text: '#f59e0b',   bg: 'rgba(251,191,36,.07)',   border: 'rgba(251,191,36,.18)' },
  teal:   { text: '#00bfa5',   bg: 'rgba(0,191,165,.07)',    border: 'rgba(0,191,165,.18)'  },
  blue:   { text: '#38bdf8',   bg: 'rgba(56,189,248,.07)',   border: 'rgba(56,189,248,.18)' },
  red:    { text: '#f87171',   bg: 'rgba(221,51,51,.07)',    border: 'rgba(221,51,51,.2)'   },
  purple: { text: '#a78bfa',   bg: 'rgba(167,139,250,.07)',  border: 'rgba(167,139,250,.18)'},
  gold:   { text: MIZAR_GOLD,  bg: 'rgba(201,164,67,.07)',   border: 'rgba(201,164,67,.20)' },
};

// ─── PUNTOS DE DOLOR ─────────────────────────────────────────────────────────

const DOLORES = [
  {
    titulo: 'Cada requisición se arma transcribiendo mensajes de WhatsApp',
    desc: 'Llegan sueltas al celular de Daniel, en distintos formatos y a distintas horas, y él las convierte a mano al formato CC2-02, una por una. Ese trabajo no aporta valor y consume el tiempo de quien debería estar negociando con proveedores.',
    icon: AlertCircle, tint: 'red',
  },
  {
    titulo: 'Diecisiete obras activas, diecisiete pestañas escritas a mano',
    desc: 'Cada gasto aprobado se vuelve a digitar en la pestaña de su obra dentro de GASTOS EN OBRAS.xlsx, con riesgo de errores de dedo y sin subtotal por tipo de gasto, ya que hoy solo existe un total general al final.',
    icon: FileSpreadsheet, tint: 'amber',
  },
  {
    titulo: 'Aprobaciones sin rastro digital',
    desc: 'Las casillas de Revisó, Aprobó y Entregó viven en papel. Sin un registro consultable de quién autorizó qué y cuándo, reconstruir la historia de una compra depende de la memoria del equipo.',
    icon: Stamp, tint: 'blue',
  },
  {
    titulo: 'Una requisición con varios proveedores se resuelve improvisando',
    desc: 'Cuando los ítems de una requisición se compran a proveedores distintos, no existe un documento por proveedor ni un estado que diga si esa compra se cumplió o quedó pendiente. Lo que no se compró se pierde de vista.',
    icon: Split, tint: 'purple',
  },
];

// ─── BENEFICIOS ──────────────────────────────────────────────────────────────

const BENEFICIOS = [
  {
    icon: ClipboardList, color: MIZAR_GOLD, colorAlpha: 'rgba(201,164,67,.08)', colorBorder: 'rgba(201,164,67,.22)',
    alcance: 'ambas',
    titulo: 'Se destraba el cuello de botella de la transcripción',
    desc: 'La requisición nace estructurada, cargada por quien la solicita. Daniel pasa de digitar a decidir, y ese es el ahorro de tiempo más directo del proyecto, ya que convierte horas de digitación en horas de negociación con proveedores.',
  },
  {
    icon: Workflow, color: '#38bdf8', colorAlpha: 'rgba(56,189,248,.08)', colorBorder: 'rgba(56,189,248,.22)',
    alcance: 'ambas',
    titulo: 'Cada aprobador ve solo lo que le corresponde',
    desc: 'La etiqueta define quién autoriza: Nelson ve materiales, Claudia ve nómina y Juliana ve las demás. Se recupera el tiempo que hoy se pierde persiguiendo firmas y se acortan los días que una compra pasa esperando autorización.',
  },
  {
    icon: FileText, color: '#f59e0b', colorAlpha: 'rgba(245,158,11,.08)', colorBorder: 'rgba(245,158,11,.22)',
    alcance: 'ambas',
    titulo: 'Cada aprobación genera su Orden de Compra',
    desc: 'Al aprobar, la plataforma emite sola la orden con su consecutivo, sus ítems y su valor total, imprimible para enviar al proveedor. La decisión deja de vivir en un chat y pasa a tener un documento que la respalda.',
  },
  {
    icon: FileSpreadsheet, color: '#00bfa5', colorAlpha: 'rgba(0,191,165,.08)', colorBorder: 'rgba(0,191,165,.22)',
    alcance: 'ambas',
    titulo: 'El Excel de gastos por obra se arma solo',
    desc: 'Al aprobar, el gasto entra solo a su obra, con la misma cabecera del archivo actual y con algo que ese archivo no tiene: subtotal por tipo de gasto. Se elimina una segunda digitación completa por cada gasto aprobado.',
  },
  {
    icon: Stamp, color: '#a78bfa', colorAlpha: 'rgba(167,139,250,.08)', colorBorder: 'rgba(167,139,250,.22)',
    alcance: 'ambas',
    titulo: 'Trazabilidad completa de cada peso',
    desc: 'Quién solicitó, quién revisó, quién aprobó, en qué fecha y con qué soporte adjunto. Toda la historia de una compra queda registrada y consultable, reemplazando las casillas de firma en papel del formato actual.',
  },
  {
    icon: Download, color: '#34d399', colorAlpha: 'rgba(52,211,153,.08)', colorBorder: 'rgba(52,211,153,.22)',
    alcance: 'ambas',
    titulo: 'Contabilidad descarga y carga, sin volver a digitar',
    desc: 'Contabilidad filtra por obra y periodo y descarga todo lo aprobado, listo para subir a Helisa. El cierre de cada periodo deja de ser un ejercicio de reconstruir información y pasa a ser una descarga.',
  },
  {
    icon: Split, color: MIZAR_GOLD, colorAlpha: 'rgba(201,164,67,.08)', colorBorder: 'rgba(201,164,67,.28)',
    alcance: 'completo',
    titulo: 'Órdenes de compra que se parten solas por proveedor',
    desc: 'La plataforma agrupa los ítems por proveedor y genera una orden para cada uno, con su consecutivo y su estado de cumplimiento. Lo que no se compró queda visible en lugar de perderse. Es el pedido de fondo de la reunión del 12 de agosto.',
  },
  {
    icon: MessageSquare, color: '#25D366', colorAlpha: 'rgba(37,211,102,.08)', colorBorder: 'rgba(37,211,102,.26)',
    alcance: 'completo',
    titulo: 'La requisición se levanta donde el equipo ya está',
    desc: 'Nadie tiene que cambiar de hábito ni aprender una herramienta nueva. Desde WhatsApp se abre un formulario estructurado dentro del mismo chat, y lo que se envía llega completo y ordenado a la bandeja de revisión.',
  },
  {
    icon: Settings, color: MIZAR_GOLD, colorAlpha: 'rgba(201,164,67,.08)', colorBorder: 'rgba(201,164,67,.28)',
    alcance: 'completo',
    titulo: 'Mizar administra su propia plataforma',
    desc: 'Dar de alta un proveedor con su Cámara de Comercio y su RUT, abrir una obra nueva o crear una etiqueta deja de depender de una solicitud a Sixteam. Se suman los reportes de gerencia y los avisos automáticos de lo que espera aprobación.',
  },
];

// ─── TABLA COMPARATIVA DE FUNCIONALIDADES ────────────────────────────────────

type Fila = { cap: string; basico: string | boolean; completo: string | boolean };
type Grupo = { nombre: string; icon: React.ElementType; color: string; filas: Fila[] };

const GRUPOS: Grupo[] = [
  {
    nombre: 'Captura de requisiciones',
    icon: ClipboardList,
    color: MIZAR_GOLD,
    filas: [
      { cap: 'Formulario web con la estructura exacta del formato CC2-02', basico: true, completo: true },
      { cap: 'Dos tipos de requisición: compra y pago', basico: true, completo: true },
      { cap: 'Ítems múltiples con cálculo automático de la diferencia entre cotizado y presupuestado', basico: true, completo: true },
      { cap: 'Selección de obra y etiqueta, adjunto de soporte y consecutivo automático', basico: true, completo: true },
      { cap: 'Captura desde WhatsApp, con formulario estructurado dentro del chat', basico: false, completo: true },
      { cap: 'Línea de WhatsApp dedicada y verificación de negocio ante Meta', basico: false, completo: true },
    ],
  },
  {
    nombre: 'Revisión y aprobación',
    icon: Workflow,
    color: '#a78bfa',
    filas: [
      { cap: 'Bandeja de revisión con etiquetado de la requisición', basico: true, completo: true },
      { cap: 'Asignación de proveedor a nivel de ítem', basico: true, completo: true },
      { cap: 'Enrutamiento automático al aprobador según la etiqueta', basico: true, completo: true },
      { cap: 'Bandeja personal para Nelson, Claudia, Juliana y Daniel', basico: true, completo: true },
      { cap: 'Aprobar o Denegar con comentario, más historial de trazabilidad', basico: true, completo: true },
      { cap: 'Notificaciones automáticas cuando algo espera una aprobación', basico: false, completo: true },
    ],
  },
  {
    nombre: 'Órdenes de compra',
    icon: Split,
    color: '#f59e0b',
    filas: [
      { cap: 'Generación automática en el momento de aprobar', basico: true, completo: true },
      { cap: 'Cobertura de cada orden', basico: 'Una por requisición', completo: 'Una por cada proveedor' },
      { cap: 'Consecutivo propio, ítems, valor total y vista imprimible', basico: true, completo: true },
      { cap: 'Estado de cumplimiento: cumplida, no cumplida o no necesario', basico: true, completo: true },
      { cap: 'Filtros del panel de órdenes', basico: 'Obra, estado y fecha', completo: 'Y además proveedor' },
      { cap: 'Control de lo no comprado, proveedor por proveedor y con su motivo', basico: false, completo: true },
    ],
  },
  {
    nombre: 'Gastos por obra y salida a Contabilidad',
    icon: FileSpreadsheet,
    color: '#00bfa5',
    filas: [
      { cap: 'Registro automático del gasto en su obra al aprobar', basico: true, completo: true },
      { cap: 'Subtotal por etiqueta, además del total general de la obra', basico: true, completo: true },
      { cap: 'Filtro por obra y por periodo, consolidado o por obra individual', basico: true, completo: true },
      { cap: 'Exportación a Excel en el formato que Contabilidad carga a Helisa', basico: true, completo: true },
      { cap: 'Reportes por periodo y tipo de gasto, con comparación entre obras', basico: false, completo: true },
      { cap: 'Vista de flujo de trabajo: cuántas requisiciones hay en cada estado', basico: false, completo: true },
    ],
  },
  {
    nombre: 'Administración y control de acceso',
    icon: Settings,
    color: '#34d399',
    filas: [
      { cap: 'Roles: solicitante, revisor, aprobador, contador y administración', basico: true, completo: true },
      { cap: 'Catálogo de las 17 obras, etiquetas con su aprobador y proveedores', basico: true, completo: true },
      { cap: 'Quién administra los catálogos', basico: 'Sixteam, a solicitud', completo: 'Mizar, autoservicio' },
      { cap: 'Carga de Cámara de Comercio, RUT y certificados del proveedor', basico: false, completo: true },
      { cap: 'Registro de actividad sobre los cambios de configuración', basico: true, completo: true },
    ],
  },
  {
    nombre: 'Alcance del proyecto',
    icon: Layers,
    color: C_BASICO,
    filas: [
      { cap: 'Módulos entregados', basico: '6 módulos', completo: '9 módulos' },
      { cap: 'Duración del desarrollo', basico: '6 semanas', completo: '8 semanas' },
      { cap: 'Fases con entregable revisable', basico: '3 fases', completo: '4 fases' },
    ],
  },
];

// ─── PLAN DE TRABAJO ─────────────────────────────────────────────────────────

const FASES = [
  {
    num: '01',
    semanas: 'Semanas 1 y 2',
    titulo: 'Modelado y captura',
    solo: false,
    color: MIZAR_GOLD,
    colorAlpha: 'rgba(201,164,67,.10)',
    colorBorder: 'rgba(201,164,67,.28)',
    desc: 'Validamos el modelo de datos contra sus formatos reales y construimos la puerta de entrada del sistema.',
    hitos: [
      'Sesión de validación del modelo contra el CC2-02 y GASTOS EN OBRAS.xlsx',
      'Carga de las diecisiete obras activas, sus empresas y el catálogo de etiquetas',
      'Formulario de requisición operativo para los dos tipos, compra y pago',
      'Ítems múltiples, cálculo de diferencia y adjunto de soportes funcionando',
    ],
    extra: 'Si se elige el Alcance Completo, aquí arranca en paralelo el trámite de verificación de negocio ante Meta.',
    entregable: 'Portal en línea con captura de requisiciones lista para probar con datos reales',
  },
  {
    num: '02',
    semanas: 'Semanas 3 y 4',
    titulo: 'Revisión, aprobación y orden de compra',
    solo: false,
    color: '#a78bfa',
    colorAlpha: 'rgba(167,139,250,.10)',
    colorBorder: 'rgba(167,139,250,.28)',
    desc: 'Construimos el flujo de decisión completo, desde la bandeja de revisión hasta la orden de compra que se emite sola al aprobar.',
    hitos: [
      'Bandeja de revisión con etiquetado y asignación de proveedor por ítem',
      'Enrutamiento automático a Nelson, Claudia, Juliana o Daniel según la etiqueta',
      'Aprobar y Denegar con comentario, más el historial de trazabilidad',
      'Generación automática de la Orden de Compra al aprobar, con su consecutivo y su estado',
    ],
    extra: '',
    entregable: 'Ciclo completo de requisición a orden de compra, validado con el equipo',
  },
  {
    num: '03',
    semanas: 'Semanas 5 y 6',
    titulo: 'Gastos por obra, salida contable y puesta en marcha',
    solo: false,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.28)',
    desc: 'Cerramos el ciclo con el reemplazo del Excel, la entrega a Contabilidad y el arranque del equipo.',
    hitos: [
      'Generador de gastos por obra con subtotales por etiqueta y filtro por periodo',
      'Exportación a Excel en el formato que Contabilidad necesita para Helisa',
      'Usuarios y roles configurados para todo el equipo',
      'Capacitación por rol y acompañamiento durante la primera semana de uso',
    ],
    extra: 'En el Alcance Básico, esta fase cierra el proyecto y la plataforma queda en producción.',
    entregable: 'Plataforma en producción, con el equipo capacitado y operando',
  },
  {
    num: '04',
    semanas: 'Semanas 7 y 8',
    titulo: 'División por proveedor, WhatsApp y autoservicio',
    solo: true,
    color: '#25D366',
    colorAlpha: 'rgba(37,211,102,.10)',
    colorBorder: 'rgba(37,211,102,.28)',
    desc: 'La fase que completa el sistema. Suma sobre una plataforma que ya está en producción desde el cierre de la fase 3.',
    hitos: [
      'División automática de la requisición en una Orden de Compra por cada proveedor',
      'Panel de órdenes con filtro por proveedor y control de lo no comprado',
      'Activación del número de WhatsApp y publicación del Flow conectado a la bandeja de revisión',
      'Autoservicio de proveedores, obras y etiquetas entregado a Mizar',
      'Reportes por periodo y tipo de gasto, más las notificaciones automáticas',
    ],
    extra: '',
    entregable: 'Sistema completo operando, con los nueve módulos entregados y el equipo capacitado',
  },
];

// ─── INVERSIÓN ───────────────────────────────────────────────────────────────

const PLANES = [
  {
    id: 'basico',
    nombre: 'Alcance Básico',
    color: C_BASICO,
    bg: 'linear-gradient(135deg, rgba(56,189,248,.10) 0%, rgba(3,13,26,.95) 100%)',
    bgSuave: 'rgba(56,189,248,.06)',
    iconBg: 'rgba(56,189,248,.18)',
    border: 'rgba(56,189,248,.32)',
    shadow: '0 4px 32px rgba(56,189,248,.12)',
    desarrollo: '$3.500.000',
    cuota: '$1.750.000',
    mensual: '$250.000',
    mensualDetalle: 'Uso y soporte de la plataforma',
    resumen: '6 módulos · 6 semanas · 3 fases',
    modulos: '6 módulos',
    incluye: [
      'El ciclo completo: captura, revisión, aprobación, orden de compra y gasto por obra',
      'Una Orden de Compra por requisición, con su estado de cumplimiento',
      'Exportación a Excel lista para cargar a Helisa',
      'Catálogos de obras, etiquetas y proveedores cargados por Sixteam a solicitud',
    ],
  },
  {
    id: 'completo',
    nombre: 'Alcance Completo',
    color: C_COMPLETO,
    bg: 'linear-gradient(135deg, rgba(201,164,67,.10) 0%, rgba(3,13,26,.95) 100%)',
    bgSuave: 'rgba(201,164,67,.06)',
    iconBg: 'rgba(201,164,67,.2)',
    border: 'rgba(201,164,67,.35)',
    shadow: '0 4px 32px rgba(201,164,67,.15)',
    desarrollo: '$5.000.000',
    cuota: '$2.500.000',
    mensual: '$350.000',
    mensualDetalle: '$250.000 plataforma + $100.000 WhatsApp',
    resumen: '9 módulos · 8 semanas · 4 fases',
    modulos: '9 módulos',
    incluye: [
      'Todo lo del Alcance Básico, sin excepción',
      'División de la requisición en una Orden de Compra por cada proveedor',
      'Captura por WhatsApp con formulario dentro del chat y línea dedicada',
      'Autoservicio de proveedores, obras y etiquetas, más reportes y notificaciones',
    ],
  },
];

const FILAS_INVERSION = [
  { c: 'Desarrollo, pago único',                    b: '$3.500.000', k: '$5.000.000' },
  { c: 'Cuota al iniciar el proyecto (50%)',        b: '$1.750.000', k: '$2.500.000' },
  { c: 'Cuota contra entrega en producción (50%)',  b: '$1.750.000', k: '$2.500.000' },
  { c: 'Uso y soporte mensual',                     b: '$250.000',   k: '$350.000' },
  { c: 'Composición del valor mensual',             b: 'Plataforma', k: 'Plataforma + WhatsApp' },
  { c: 'Tarifas por conversación de Meta',          b: 'No aplica',  k: 'Las asume Mizar, al costo' },
  { c: 'Primer año: desarrollo más 12 mensualidades', b: '$6.500.000', k: '$9.200.000' },
];

const COMUN_INVERSION = [
  'Configuración inicial con las 17 obras, etiquetas, aprobadores y usuarios de Mizar',
  'Capacitación por rol: solicitantes, revisión, aprobación y contabilidad',
  'Puesta en marcha y acompañamiento durante la primera semana de uso',
  'Garantía correctiva de 30 días desde la entrega',
  'Alojamiento en la nube, con respaldo de la información',
  'Actualizaciones de seguridad y estabilidad de la plataforma',
  'SLA de respuesta máximo de 4 horas ante cualquier incidencia',
  'Contrato anual de uso de la plataforma, con vigencia mínima de 12 meses',
];

// ─── FUERA DE ALCANCE ────────────────────────────────────────────────────────

const FUERA = [
  {
    titulo: 'Agente de inteligencia artificial y captura por nota de voz',
    desc: 'Acordado en la reunión del 12 de agosto: primero se prueba el flujo con datos reales y después se evalúa la capa de inteligencia artificial.',
    icon: Bot, tint: 'red',
  },
  {
    titulo: 'Sistema contable',
    desc: 'Helisa sigue siendo el sistema contable de la operación y no se modifica ni se reemplaza. La plataforma le entrega la información organizada y lista para cargar, hasta ahí llega su alcance.',
    icon: FileText, tint: 'blue',
  },
  {
    titulo: 'Flujo de caja y tesorería',
    desc: 'El control de tesorería, las proyecciones de caja y la conciliación bancaria no forman parte de este proyecto. La plataforma administra el ciclo de requisición y gasto, no la liquidez de la compañía.',
    icon: AlertCircle, tint: 'purple',
  },
  {
    titulo: 'Umbral por monto para un segundo aprobador',
    desc: 'La regla que exija una segunda autorización a partir de cierto valor no está definida hoy. Cuando Mizar la defina, se cotiza e implementa por separado.',
    icon: XCircle, tint: 'amber',
  },
];

// ─── TÉRMINOS ────────────────────────────────────────────────────────────────

const TERMINOS: { titulo: string; desc: string; icon: React.ElementType; solo?: string }[] = [
  {
    titulo: 'Cómo aceptar esta propuesta',
    desc: 'Mizar confirma su aceptación vía WhatsApp, correo electrónico o de forma verbal, indicando cuál de los dos alcances elige. Con esa confirmación se procede con la firma del contrato y el primer pago.',
    icon: CheckCircle,
  },
  {
    titulo: 'Forma de pago del desarrollo',
    desc: 'Dos cuotas iguales en ambos alcances: la primera al iniciar el proyecto y la segunda contra la entrega de la plataforma en producción. En el Básico son $1.750.000 COP cada una; en el Completo, $2.500.000 COP.',
    icon: FileText,
  },
  {
    titulo: 'Pago mensual y contrato anual',
    desc: 'El valor mensual se paga de forma anticipada: $250.000 COP en el Básico y $350.000 COP en el Completo, donde se compone de $250.000 de plataforma más $100.000 del canal de WhatsApp. El contrato anual de uso tiene una vigencia mínima de 12 meses desde que Mizar comienza a usar la plataforma, y al vencer puede renovarse o ajustarse de mutuo acuerdo.',
    icon: Clock,
  },
  {
    titulo: 'Duración del desarrollo',
    desc: 'Desde el inicio del proyecto: 6 semanas en tres fases para el Alcance Básico, u 8 semanas en cuatro fases para el Alcance Completo. En ambos casos hay un entregable revisable al cierre de cada fase.',
    icon: Calendar,
  },
  {
    titulo: 'Tarifas de conversación de Meta',
    desc: 'Las tarifas que Meta cobra por conversación en WhatsApp no están incluidas en los $350.000 mensuales y las asume Mizar al costo, sin margen de Sixteam. El consumo depende del volumen de requisiciones que se levanten por ese canal.',
    icon: MessageSquare,
    solo: 'completo',
  },
  {
    titulo: 'Verificación del número ante Meta',
    desc: 'La activación de la línea de WhatsApp exige una verificación de negocio ante Meta, cuyo tiempo de respuesta no depende de Sixteam. El trámite arranca en la primera semana del proyecto, en paralelo al desarrollo, para que no atrase la fase 4. Requiere documentos de la compañía que Mizar debe suministrar.',
    icon: Shield,
    solo: 'completo',
  },
  {
    titulo: 'Paso de un alcance al otro',
    desc: 'Si Mizar arranca por el Alcance Básico, nada de lo entregado se descarta ni se rehace al ampliar. Los tres módulos adicionales se cotizan como una ampliación que se suma sobre lo ya construido.',
    icon: Layers,
  },
  {
    titulo: 'SLA y atención de incidencias',
    desc: 'Tiempo máximo de respuesta de 4 horas ante cualquier incidencia, en días y horarios hábiles, con comunicación directa vía WhatsApp o correo.',
    icon: Zap,
  },
  {
    titulo: 'Modificaciones al alcance',
    desc: 'Todo requerimiento funcional no contemplado en esta propuesta se maneja mediante cotización independiente y no modifica el valor mensual acordado.',
    icon: AlertCircle,
  },
  {
    titulo: 'Propiedad y confidencialidad',
    desc: 'Mizar es propietario de todos sus datos operativos y financieros cargados en la plataforma. Sixteam mantiene la confidencialidad total de esa información, tanto durante la vigencia del contrato como después de su terminación.',
    icon: Lock,
  },
  {
    titulo: 'Responsable del proyecto',
    desc: 'Mizar designa un responsable para coordinar las sesiones de validación al cierre de cada fase, cerca de una hora cada dos semanas. La participación del equipo de compras es determinante para que lo construido corresponda a la operación real.',
    icon: Target,
  },
  {
    titulo: 'Vigencia de la propuesta',
    desc: '30 días calendario desde su fecha de emisión. Pasado ese plazo, los valores podrán ser revisados según las condiciones del mercado.',
    icon: Stamp,
  },
];

// ─── SECCIONES NAV ───────────────────────────────────────────────────────────

const SECCIONES = [
  { id: 'resumen',    label: 'Resumen'     },
  { id: 'beneficios', label: 'Beneficios'  },
  { id: 'incluye',    label: 'Comparativa' },
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
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: `linear-gradient(90deg,${C_BASICO},${C_COMPLETO})` }} />
);

const Celda = ({ value, color }: { value: string | boolean; color: string }) => {
  if (value === true)  return <CheckCircle className="w-4 h-4 mx-auto" style={{ color }} />;
  if (value === false) return <Minus className="w-4 h-4 mx-auto text-white/20" />;
  return <span className="font-lato text-[13.5px] leading-snug" style={{ color }}>{value}</span>;
};

const Chip = ({ texto, color, bg, border }: { texto: string; color: string; bg: string; border: string }) => (
  <span className="font-lato text-[10.5px] px-2 py-0.5 rounded-full uppercase tracking-[0.12em] whitespace-nowrap"
    style={{ background: bg, border: `1px solid ${border}`, color }}>
    {texto}
  </span>
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const MizarPlataformaComparativoProposal = () => {
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
            style={{ background: 'radial-gradient(circle, rgba(201,164,67,.06) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(56,189,248,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
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
                <img src="/mizar-logo.png" alt="Mizar" className="h-full w-auto object-contain rounded"
                  style={{ filter: 'drop-shadow(0 1px 4px rgba(201,164,67,.3))' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
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
              <TagLabel>Propuesta de trabajo y cotización · Desarrollo a la medida</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${MIZAR_GOLD}, #8f7226)` }}>
                  <HardHat className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">Mizar · Ictinos</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(201,164,67,.12)', border: '1px solid rgba(201,164,67,.28)', color: MIZAR_GOLD }}>
                  Diseño y Construcción
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 4.8rem)' }}>
                Propuesta<br />
                <span style={{ background: `linear-gradient(90deg,${C_BASICO},${C_COMPLETO})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Comercial
                </span>
              </h1>
              <p className="font-lato text-white/55 text-xl leading-relaxed mb-5">{META.objetivo}</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {PLANES.map(p => (
                  <div key={p.id} className="rounded-xl p-3.5"
                    style={{ background: p.bgSuave, border: `1px solid ${p.border}` }}>
                    <p className="font-poppins font-bold text-[13px] uppercase tracking-[0.14em] mb-1.5" style={{ color: p.color }}>{p.nombre}</p>
                    <p className="font-lato text-white/45 text-[14px] leading-snug">{p.resumen}</p>
                  </div>
                ))}
              </div>

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
                  {['1. Resumen ejecutivo','2. Resultados que obtendrán','3. Comparativa de funcionalidades','4. Plan de trabajo','5. Alcance y límites','6. Comparativa de inversión','7. Vigencia y términos'].map((item, i) => (
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
                  style={{ background: 'radial-gradient(circle, rgba(201,164,67,.08) 0%, rgba(56,189,248,.04) 50%, transparent 70%)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full" style={{ border: '1px solid rgba(201,164,67,.12)' }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(56,189,248,.15)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: C_BASICO, boxShadow: '0 0 8px rgba(56,189,248,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: MIZAR_GOLD, boxShadow: '0 0 6px rgba(201,164,67,.8)' }} />
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
                    style={{ background: 'linear-gradient(135deg, rgba(201,164,67,.18), rgba(201,164,67,.06))', border: '1px solid rgba(201,164,67,.3)', boxShadow: '0 4px 30px rgba(201,164,67,.18)' }}>
                    <img src="/mizar-logo.png" alt="Mizar" className="h-14 w-auto object-contain rounded"
                      style={{ filter: 'drop-shadow(0 2px 12px rgba(201,164,67,.5))' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <div className="text-center">
                    <p className="font-poppins font-bold text-white/80 text-[17px] tracking-tight">Mizar Diseño y Construcción</p>
                    <p className="font-lato text-[13px] uppercase tracking-[0.2em] mt-1" style={{ color: MIZAR_GOLD }}>Ictinos · 17 obras activas</p>
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
            style={{ background: 'rgba(2,8,20,.85)', border: '1px solid rgba(201,164,67,.20)' }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="rounded-xl p-4 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(201,164,67,.18), rgba(201,164,67,.06))', border: '1px solid rgba(201,164,67,.3)' }}>
                <img src="/mizar-logo.png" alt="Mizar" className="h-10 w-auto object-contain rounded"
                  style={{ filter: 'drop-shadow(0 1px 6px rgba(201,164,67,.4))' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <span className="font-lato text-[11px] uppercase tracking-[0.2em]" style={{ color: MIZAR_GOLD }}>Mizar · Ictinos</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">Diseño y construcción de proyectos</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Operación</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">17 obras activas y creciendo</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Equipo involucrado</p>
                <p className="font-lato text-white/60 text-[18px]">Solicitantes, revisión, aprobación y contabilidad</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Situación actual</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#f59e0b' }} />
                  <p className="font-poppins font-semibold text-[15px] text-[#f59e0b]">Requisiciones en WhatsApp y Excel, transcritas a mano</p>
                </div>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sistema contable</p>
                <p className="font-lato text-white/60 text-[18px]">Helisa, se conserva sin cambios</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Formatos base</p>
                <p className="font-lato text-white/60 text-[18px]">CC2-02 y GASTOS EN OBRAS.xlsx</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-8">
            <p>
              Mizar e Ictinos manejan hoy diecisiete obras activas al mismo tiempo. Cada una genera compras, cuentas de cobro, anticipos y pagos que deben solicitarse, revisarse, aprobarse y quedar registrados en la obra correspondiente. Es un flujo que funciona, aunque funciona porque una sola persona lo sostiene a pulso.
            </p>
            <p>
              Sixteam propone una <strong className="text-white/90 font-semibold">plataforma desarrollada a la medida</strong>, construida sobre los formatos de Mizar y sobre la lógica que su equipo ya aplica todos los días. No es un software genérico al que haya que adaptarse, sino su proceso actual convertido en sistema, con una diferencia clave: la información se captura una sola vez y avanza sola hasta el cierre contable.
            </p>
          </div>

          {/* Cómo leer el documento */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.09)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00bfa5]" /> Cómo leer este documento
            </p>
            <p className="font-lato text-white/55 text-[17px] leading-relaxed mb-5">
              Esta propuesta presenta <strong className="text-white/85">dos alcances de una misma plataforma</strong>. Todo lo que sigue está escrito una sola vez: lo común a ambos se describe sin repetirlo, y donde hay diferencia se muestra lado a lado. La base es idéntica, de modo que arrancar por el Básico no cierra la puerta al Completo.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PLANES.map(p => (
                <div key={p.id} className="rounded-xl p-4" style={{ background: p.bgSuave, border: `1px solid ${p.border}` }}>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <p className="font-poppins font-bold text-[16px]" style={{ color: p.color }}>{p.nombre}</p>
                    <span className="font-lato text-white/40 text-[12px] whitespace-nowrap">{p.resumen}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {p.incluye.map((x, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: p.color }} />
                        <span className="font-lato text-white/60 text-[15px] leading-snug">{x}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> Situaciones que esta plataforma resuelve
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
            <p className="font-lato text-white/35 text-[14px] mt-4 leading-relaxed">
              Las tres primeras las resuelven ambos alcances. La cuarta, la compra repartida entre varios proveedores, solo la resuelve el Alcance Completo.
            </p>
          </div>
        </section>

        {/* ─ 02 BENEFICIOS ─ */}
        <section id="beneficios" ref={s2.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>02 · Resultados que obtendrán</TagLabel>
          <SectionTitle>Lo que cambia para Mizar</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden mb-8"
            style={{ background: 'rgba(201,164,67,.06)', border: '1px solid rgba(201,164,67,.20)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(201,164,67,.07), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 mb-4" style={{ color: MIZAR_GOLD }} />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[23px] leading-relaxed">
              La razón de fondo para automatizar es un <strong className="text-white font-black">cuello de botella</strong>: el flujo de compras de diecisiete obras depende de que una sola persona transcriba, clasifique y persiga aprobaciones a mano. El objetivo no es digitalizar por digitalizar, sino <strong className="text-white font-black">que la información se escriba una sola vez</strong> y llegue sola hasta el cierre contable, devolviendo al equipo las horas que hoy se van en digitación.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="font-lato text-white/35 text-[14px]">Cada resultado indica en qué alcance se obtiene:</span>
            <Chip texto="Ambos" color="#00bfa5" bg="rgba(0,191,165,.10)" border="rgba(0,191,165,.28)" />
            <Chip texto="Solo Completo" color={C_COMPLETO} bg="rgba(201,164,67,.12)" border="rgba(201,164,67,.32)" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {BENEFICIOS.map((item, i) => {
              const Icon = item.icon;
              const soloCompleto = item.alcance === 'completo';
              return (
                <div key={i} className="rounded-xl p-5 flex gap-4"
                  style={{ background: item.colorAlpha, border: `1px solid ${item.colorBorder}` }}>
                  <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: item.color }} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-poppins font-bold text-white/90 text-[17px]">{item.titulo}</p>
                      {soloCompleto
                        ? <Chip texto="Solo Completo" color={C_COMPLETO} bg="rgba(201,164,67,.12)" border="rgba(201,164,67,.32)" />
                        : <Chip texto="Ambos" color="#00bfa5" bg="rgba(0,191,165,.10)" border="rgba(0,191,165,.26)" />}
                    </div>
                    <p className="font-lato text-white/50 text-[15px] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Flujo visual */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Workflow className="w-4 h-4 text-[#00bfa5]" /> El ciclo dentro de la plataforma
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {[
                { n: '1', t: 'Requisición',     b: 'Desde el portal',         k: 'Portal o WhatsApp',  c: MIZAR_GOLD, bg: 'rgba(201,164,67,.08)',  bd: 'rgba(201,164,67,.22)' },
                { n: '2', t: 'Revisión',        b: 'Se etiqueta y se asigna proveedor', k: '',        c: '#38bdf8',  bg: 'rgba(56,189,248,.08)',  bd: 'rgba(56,189,248,.22)' },
                { n: '3', t: 'Aprobación',      b: 'Enrutada según la etiqueta', k: '',               c: '#a78bfa',  bg: 'rgba(167,139,250,.08)', bd: 'rgba(167,139,250,.22)' },
                { n: '4', t: 'Orden de compra', b: 'Una por requisición',     k: 'Una por proveedor',  c: '#f59e0b',  bg: 'rgba(245,158,11,.08)',  bd: 'rgba(245,158,11,.22)' },
                { n: '5', t: 'Gasto por obra',  b: 'Listo para Contabilidad', k: '',                   c: '#00bfa5',  bg: 'rgba(0,191,165,.08)',   bd: 'rgba(0,191,165,.22)' },
              ].map((step, i) => (
                <div key={i} className="rounded-xl p-3.5" style={{ background: step.bg, border: `1px solid ${step.bd}` }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center mb-2"
                    style={{ background: 'rgba(255,255,255,.06)', border: `1px solid ${step.bd}` }}>
                    <span className="font-poppins font-black text-[12px]" style={{ color: step.c }}>{step.n}</span>
                  </div>
                  <p className="font-poppins font-bold text-white/85 text-[14px] leading-tight mb-1.5">{step.t}</p>
                  <p className="font-lato text-[12px] leading-snug" style={{ color: step.k ? C_BASICO : 'rgba(255,255,255,.4)' }}>{step.b}</p>
                  {step.k && (
                    <p className="font-lato text-[12px] leading-snug mt-0.5" style={{ color: C_COMPLETO }}>{step.k}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4">
              <span className="inline-flex items-center gap-1.5 font-lato text-[13px]" style={{ color: C_BASICO }}>
                <span className="w-2 h-2 rounded-full" style={{ background: C_BASICO }} /> Alcance Básico
              </span>
              <span className="inline-flex items-center gap-1.5 font-lato text-[13px]" style={{ color: C_COMPLETO }}>
                <span className="w-2 h-2 rounded-full" style={{ background: C_COMPLETO }} /> Alcance Completo
              </span>
              <span className="font-lato text-white/30 text-[13px]">Los pasos sin distinción operan igual en ambos.</span>
            </div>
          </div>
        </section>

        {/* ─ 03 COMPARATIVA DE FUNCIONALIDADES ─ */}
        <section id="incluye" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 · Comparativa de funcionalidades</TagLabel>
          <SectionTitle>Qué incluye cada alcance</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            El detalle funcional completo, capacidad por capacidad. Donde ambas columnas coinciden, la funcionalidad se construye igual en los dos alcances. Donde difieren, el cuadro dice exactamente en qué.
          </p>

          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.09)' }}>
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: 560, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,.045)' }}>
                    <th className="text-left py-3.5 px-4 font-poppins font-semibold text-white/40 text-[12.5px] uppercase tracking-wider">Capacidad</th>
                    <th className="py-3.5 px-3 text-center font-poppins font-black text-[13px] uppercase tracking-wider"
                      style={{ color: C_BASICO, width: 148, borderLeft: '1px solid rgba(255,255,255,.06)' }}>
                      Básico
                    </th>
                    <th className="py-3.5 px-3 text-center font-poppins font-black text-[13px] uppercase tracking-wider"
                      style={{ color: C_COMPLETO, width: 148, borderLeft: '1px solid rgba(255,255,255,.06)' }}>
                      Completo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {GRUPOS.map((g, gi) => {
                    const GIcon = g.icon;
                    return (
                      <React.Fragment key={gi}>
                        <tr>
                          <td colSpan={3} className="py-2.5 px-4"
                            style={{ background: 'rgba(255,255,255,.025)', borderTop: '1px solid rgba(255,255,255,.09)' }}>
                            <span className="inline-flex items-center gap-2">
                              <GIcon className="w-3.5 h-3.5" style={{ color: g.color }} />
                              <span className="font-poppins font-bold text-[13px] uppercase tracking-[0.12em]" style={{ color: g.color }}>{g.nombre}</span>
                            </span>
                          </td>
                        </tr>
                        {g.filas.map((f, fi) => (
                          <tr key={fi} style={{ borderTop: '1px solid rgba(255,255,255,.05)' }}>
                            <td className="py-3 px-4 font-lato text-white/65 text-[15px] leading-snug">{f.cap}</td>
                            <td className="py-3 px-3 text-center" style={{ borderLeft: '1px solid rgba(255,255,255,.05)' }}>
                              <Celda value={f.basico} color={C_BASICO} />
                            </td>
                            <td className="py-3 px-3 text-center" style={{ borderLeft: '1px solid rgba(255,255,255,.05)' }}>
                              <Celda value={f.completo} color={C_COMPLETO} />
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl p-4 flex gap-3" style={{ background: 'rgba(201,164,67,.06)', border: '1px solid rgba(201,164,67,.22)' }}>
              <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: MIZAR_GOLD }} />
              <p className="font-lato text-white/55 text-[15px] leading-relaxed">
                En los dos alcances la plataforma opera bajo <strong className="text-white/80">acceso por roles</strong>: cada persona ve y modifica únicamente lo que le compete por su función.
              </p>
            </div>
            <div className="rounded-xl p-4 flex gap-3" style={{ background: 'rgba(56,189,248,.05)', border: '1px solid rgba(56,189,248,.20)' }}>
              <Layers className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: C_BASICO }} />
              <p className="font-lato text-white/55 text-[15px] leading-relaxed">
                El Completo <strong className="text-white/80">contiene íntegro al Básico</strong>. No es una versión distinta, sino la misma plataforma con tres módulos adicionales encima.
              </p>
            </div>
          </div>
        </section>

        {/* ─ 04 PLAN DE TRABAJO ─ */}
        <section id="plan" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 · Plan de trabajo</TagLabel>
          <SectionTitle>Un mismo camino, dos puntos de llegada</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Las tres primeras fases son idénticas en ambos alcances y son las que dejan la plataforma en producción. El Alcance Básico termina ahí, en la semana 6. El Completo suma una cuarta fase sobre un sistema que ya está operando.
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
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-poppins font-bold text-white text-[20px] leading-tight">{f.titulo}</p>
                      {f.solo
                        ? <Chip texto="Solo Completo" color={C_COMPLETO} bg="rgba(201,164,67,.12)" border="rgba(201,164,67,.32)" />
                        : <Chip texto="Ambos alcances" color="#00bfa5" bg="rgba(0,191,165,.10)" border="rgba(0,191,165,.26)" />}
                    </div>
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

                {f.extra && (
                  <p className="font-lato text-white/40 text-[14px] leading-relaxed mb-4">{f.extra}</p>
                )}

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

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl p-4 flex gap-3" style={{ background: 'rgba(56,189,248,.05)', border: '1px solid rgba(56,189,248,.20)' }}>
              <Users className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#38bdf8]" />
              <p className="font-lato text-white/55 text-[15px] leading-relaxed">
                El cronograma asume disponibilidad del equipo para las sesiones de validación al cierre de cada fase, cerca de una hora cada dos semanas. Es la única dependencia del lado de Mizar en ambos alcances.
              </p>
            </div>
            <div className="rounded-xl p-4 flex gap-3" style={{ background: 'rgba(37,211,102,.05)', border: '1px solid rgba(37,211,102,.22)' }}>
              <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#25D366' }} />
              <p className="font-lato text-white/55 text-[15px] leading-relaxed">
                Si se elige el Completo, la <strong className="text-white/80">verificación de negocio ante Meta</strong> arranca en la semana 1, en paralelo, para que su tiempo de respuesta no atrase la fase 4. Requiere documentos de la compañía.
              </p>
            </div>
          </div>
        </section>

        {/* ─ 05 ALCANCE ─ */}
        <section id="alcance" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 · Alcance y límites</TagLabel>
          <SectionTitle>Qué no está incluido</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Las diferencias entre los dos alcances están detalladas en el cuadro de la sección 3. Lo siguiente queda fuera de forma deliberada de <strong className="text-white/75">ambos</strong>, tal como se acordó en la reunión del 12 de agosto.
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
              <p className="font-poppins font-semibold text-white/80 text-[18px]">Crecimiento sin reprocesos</p>
            </div>
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              La plataforma se construye sobre una base que crece con la operación y absorbe sin rediseño las obras que se sumen a las diecisiete actuales. Si Mizar arranca por el Alcance Básico, nada de lo entregado se descarta ni se rehace al ampliar: los tres módulos adicionales se suman sobre lo ya construido. Lo mismo aplica para lo listado arriba, que se cotiza por separado cuando Mizar decida abordarlo.
            </p>
          </div>
        </section>

        {/* ─ 06 INVERSIÓN ─ */}
        <section id="inversion" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 · Comparativa de inversión</TagLabel>
          <SectionTitle>Dos alcances, dos inversiones.</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            En ambos casos la inversión tiene dos componentes: el desarrollo de la plataforma, que se paga una sola vez en dos cuotas iguales, y el servicio mensual que la mantiene en línea, soportada y respaldada. Todos los valores en <strong className="text-white/75">pesos colombianos (COP).</strong>
          </p>

          {/* Tarjetas de precio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {PLANES.map(p => (
              <div key={p.id} className="rounded-2xl overflow-hidden"
                style={{ background: p.bg, border: `1px solid ${p.border}`, boxShadow: p.shadow }}>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: p.iconBg }}>
                      <Zap className="w-4 h-4" style={{ color: p.color }} />
                    </div>
                    <span className="font-poppins font-bold text-white/80 text-[16px]">{p.nombre}</span>
                    <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider ml-auto whitespace-nowrap"
                      style={{ background: p.iconBg, border: `1px solid ${p.border}`, color: p.color }}>
                      {p.modulos}
                    </span>
                  </div>

                  <p className="font-poppins font-black text-white leading-none mb-1" style={{ fontSize: '2.4rem' }}>
                    {p.desarrollo}
                  </p>
                  <p className="font-lato text-white/35 text-[15px] mb-4">COP · Desarrollo, pago único</p>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {['Al iniciar', 'Al entregar'].map((m, j) => (
                      <div key={j} className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                        <p className="font-poppins font-black text-[15px] leading-none mb-1" style={{ color: p.color }}>{p.cuota}</p>
                        <p className="font-lato text-white/35 text-[12px]">50% · {m}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl p-3.5 mb-4" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <p className="font-poppins font-black text-white text-[22px] leading-none">{p.mensual}</p>
                      <p className="font-lato text-white/40 text-[14px]">COP al mes</p>
                    </div>
                    <p className="font-lato text-white/35 text-[13px] leading-snug">{p.mensualDetalle}</p>
                  </div>

                  <ul className="space-y-2">
                    {p.incluye.map((x, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: p.color }} />
                        <span className="font-lato text-white/60 text-[15px] leading-snug">{x}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Cuadro de cifras */}
          <div className="rounded-2xl overflow-hidden mb-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.09)' }}>
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: 520, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,.045)' }}>
                    <th className="text-left py-3.5 px-4 font-poppins font-semibold text-white/40 text-[12.5px] uppercase tracking-wider">Concepto</th>
                    <th className="py-3.5 px-3 text-center font-poppins font-black text-[13px] uppercase tracking-wider"
                      style={{ color: C_BASICO, width: 150, borderLeft: '1px solid rgba(255,255,255,.06)' }}>Básico</th>
                    <th className="py-3.5 px-3 text-center font-poppins font-black text-[13px] uppercase tracking-wider"
                      style={{ color: C_COMPLETO, width: 150, borderLeft: '1px solid rgba(255,255,255,.06)' }}>Completo</th>
                  </tr>
                </thead>
                <tbody>
                  {FILAS_INVERSION.map((r, i) => (
                    <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,.05)' }}>
                      <td className="py-3 px-4 font-lato text-white/65 text-[15px] leading-snug">{r.c}</td>
                      <td className="py-3 px-3 text-center font-poppins font-bold text-[14.5px]"
                        style={{ color: C_BASICO, borderLeft: '1px solid rgba(255,255,255,.05)' }}>{r.b}</td>
                      <td className="py-3 px-3 text-center font-poppins font-bold text-[14.5px]"
                        style={{ color: C_COMPLETO, borderLeft: '1px solid rgba(255,255,255,.05)' }}>{r.k}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="font-lato text-white/30 text-[13px] leading-relaxed px-4 py-3.5" style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
              La última fila es referencial: suma el desarrollo más doce mensualidades para dimensionar el costo del primer año en cada alcance. No corresponde a un pago anticipado.
            </p>
          </div>

          {/* Incluido en ambos */}
          <div className="rounded-2xl p-5 sm:p-6 mb-6" style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.20)' }}>
            <p className="font-poppins font-semibold text-white/80 text-[18px] mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#00bfa5]" /> Incluido en cualquiera de los dos alcances
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COMUN_INVERSION.map((x, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-1 text-[#00bfa5]" />
                  <span className="font-lato text-white/60 text-[15px] leading-snug flex-1">{x}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl p-4 flex gap-3 mb-4"
            style={{ background: 'rgba(37,211,102,.05)', border: '1px solid rgba(37,211,102,.22)' }}>
            <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#25D366' }} />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              En el Alcance Completo, las <strong className="text-white/80">tarifas que Meta cobra por conversación</strong> en WhatsApp no están incluidas en los $350.000 mensuales y las asume Mizar al costo, sin margen de Sixteam. El consumo depende del volumen de requisiciones que se levanten por ese canal.
            </p>
          </div>

          <div className="rounded-xl p-4 flex gap-3"
            style={{ background: 'rgba(245,158,11,.05)', border: '1px solid rgba(245,158,11,.20)' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#f59e0b]" />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              Esta propuesta cubre el alcance funcional descrito en este documento. Cualquier requerimiento adicional que surja por fuera del alcance elegido se maneja mediante cotización separada y no modifica el valor mensual de uso y soporte acordado.
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

          <p className="font-lato text-white/40 text-[15px] mb-5">
            Aplican a los dos alcances, salvo los marcados como propios del Completo. Toca cada término para ver el detalle.
          </p>

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
                    {item.solo === 'completo' && (
                      <Chip texto="Solo Completo" color={C_COMPLETO} bg="rgba(201,164,67,.12)" border="rgba(201,164,67,.32)" />
                    )}
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ml-1 ${open ? 'rotate-90' : ''}`}
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
              style={{ background: 'radial-gradient(circle at 50% 100%, rgba(201,164,67,.05), transparent 70%)' }} />
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
                <span className="text-white/40 font-medium">Juliana Parada Villamizar · Mizar Diseño y Construcción</span>
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

export default MizarPlataformaComparativoProposal;
