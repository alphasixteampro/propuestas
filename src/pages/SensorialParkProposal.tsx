import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, AlertCircle,
  Calendar, Info, MapPin, MessageSquare, Bot, Inbox, Database,
  Coins, Headphones, Gift, LayoutDashboard, Users, QrCode, Cake,
  Sparkles, TrendingUp, Megaphone, Layers, School, Repeat,
  UserPlus, Shield, CalendarClock, PartyPopper, Ticket, Baby, Wallet,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente:    'Sensorial Park',
  tagline:    'Parque sensorial infantil · Chile',
  sector:     'Entretenimiento familiar · Parque sensorial para niños',
  sede:       'Corte Alto, Purranque · Región de Los Lagos, Chile',
  fecha:      'Septiembre 2026',
  contacto:   'Sebastián',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit:        '901.967.849-4',
  correo:     'alpha@sixteam.pro',
  rl:         'Samuel Armando Burgos Ferrer',
  objetivo:
    'Convertir cada visita en un cliente registrado y activar la recompra del 70% que ya vuelve, con el ecosistema Sixteam.pro operado mes a mes por un equipo de tecnología.',
};

// Paleta tomada del logo: naranja, magenta y morado
const SP        = '#ff8a3c';
const SP2       = '#a855f7';
const SP_BG     = 'rgba(255,138,60,.07)';
const SP_BORDER = 'rgba(255,138,60,.25)';

// Inversión
const IMPLEMENTACION_USD = '499';
const IMPLEMENTACION_CLP = '474.050';
const OPS_USD            = '299';
const OPS_CLP            = '284.050';
const TC_CLP             = 950;
const CREDITOS_MES       = 40;
const SOLICITUDES_MES    = 4;
const CREDITO_USD        = '8';
const CREDITO_CLP        = '7.600';

const clp = (n: number) => Math.round(n).toLocaleString('es-CL');

// ─── DIAGNÓSTICO ─────────────────────────────────────────────────────────────

const HALLAZGOS = [
  {
    titulo: 'El 70% recurrente es una intuición, no un dato',
    desc: 'Sensorial Park estima que 7 de cada 10 visitantes vuelven, pero no existe registro del visitante particular. Sin ese dato no se puede segmentar, medir ni provocar la siguiente visita.',
    icon: Database, tint: 'orange',
  },
  {
    titulo: 'La fuga ocurre en la entrada, no en el marketing',
    desc: 'Cada familia que entra y sale sin dejar nombre y teléfono es un cliente que después hay que volver a comprar con pauta. El parque ya lo tuvo adentro y lo dejó ir anónimo.',
    icon: Ticket, tint: 'red',
  },
  {
    titulo: 'El dato más rentable no se está capturando',
    desc: 'La fecha de cumpleaños del niño es la que activa el producto de mayor ticket, y hoy solo existe para quien ya celebró en el parque. Con ese campo, la base se convierte en un calendario de ventas con 12 meses de anticipación.',
    icon: Cake, tint: 'purple',
  },
  {
    titulo: 'Google Calendar no es un sistema de reservas',
    desc: 'Es un recordatorio compartido. Sin API, sin ficha de cliente, sin historial de visitas y sin trazabilidad. La reserva se agenda pero no crea cliente, así que la información nace y muere en el evento.',
    icon: CalendarClock, tint: 'blue',
  },
  {
    titulo: 'Tres bandejas manuales y una sola persona',
    desc: 'Instagram, Facebook y WhatsApp se atienden a mano desde las herramientas de Meta. La velocidad de respuesta depende de la disponibilidad de Sebastián, justo cuando el pico de consultas cae el fin de semana y en horario nocturno.',
    icon: MessageSquare, tint: 'amber',
  },
  {
    titulo: 'Hay objetivo claro pero no hay playbook',
    desc: 'El equipo quiere más recompra, más recurrencia y clientes nuevos, y a la vez reconoce que no tiene ninguna promoción definida. Por eso esta propuesta no entrega solo la herramienta, entrega también quién diseña y ejecuta las campañas.',
    icon: Sparkles, tint: 'teal',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  orange: { text: 'text-[#ff8a3c]', bg: 'rgba(255,138,60,.07)', border: 'rgba(255,138,60,.2)' },
  purple: { text: 'text-[#a855f7]', bg: 'rgba(168,85,247,.07)', border: 'rgba(168,85,247,.22)' },
  teal:   { text: 'text-[#00bfa5]', bg: 'rgba(0,191,165,.07)',  border: 'rgba(0,191,165,.18)' },
  blue:   { text: 'text-[#60a5fa]', bg: 'rgba(96,165,250,.07)', border: 'rgba(96,165,250,.18)' },
  amber:  { text: 'text-amber-400', bg: 'rgba(251,191,36,.07)', border: 'rgba(251,191,36,.18)' },
  red:    { text: 'text-[#f87171]', bg: 'rgba(221,51,51,.07)',  border: 'rgba(221,51,51,.2)' },
};

// ─── LEVANTAMIENTO ───────────────────────────────────────────────────────────

const LEVANTAMIENTO = [
  {
    num: '01',
    tema: 'Base de datos de clientes',
    icon: Database,
    tint: 'orange',
    respuesta: 'Solo existe registro de quienes han celebrado un cumpleaños en el parque. Está en Google Calendar y se puede extraer. Los campos disponibles son nombre, teléfono y correo. Del visitante particular no hay base de datos.',
    lectura: 'Hay una semilla de datos justo en el segmento de mayor ticket y cero registro del segmento que sostiene el flujo diario. Lo primero es migrar esa semilla y, en paralelo, abrir el mecanismo que capture al visitante particular.',
  },
  {
    num: '02',
    tema: 'Canales de contacto',
    icon: MessageSquare,
    tint: 'amber',
    respuesta: 'Instagram, Facebook y WhatsApp, todo de forma manual desde las herramientas de Meta. Sebastián sería quien gestione los canales una vez implementado el CRM.',
    lectura: 'Tres bandejas separadas para una sola persona. Si el sistema no le baja la carga operativa a Sebastián, no se va a usar. Por eso el ChatCenter y el asistente de IA no son un lujo, son la condición para que el CRM se mantenga vivo.',
  },
  {
    num: '03',
    tema: 'Comportamiento de compra',
    icon: Repeat,
    tint: 'teal',
    respuesta: 'Cerca del 70% son clientes recurrentes y la mayoría vuelve alrededor de una vez al mes. Los recurrentes tienden a agendar después un cumpleaños, que tiene un ticket mayor. Las vacaciones escolares traen colegios y el Día del Niño concentra público.',
    lectura: 'El negocio ya tiene recurrencia natural y una escalera de ticket definida: primero la visita particular y después el cumpleaños. Lo que falta no es crear el hábito, es provocarlo en el momento correcto en lugar de esperar a que ocurra solo.',
  },
  {
    num: '04',
    tema: 'Reservas y sistema actual',
    icon: CalendarClock,
    tint: 'blue',
    respuesta: 'Las visitas particulares, los cumpleaños y los paseos escolares se gestionan en Google Calendar. No hay integración ni API disponible.',
    lectura: 'Cada agendamiento es una fuga de datos, porque la reserva no crea ni actualiza un cliente. Al mover la agenda a la plataforma, la base de datos se alimenta sola con cada reserva y sin trabajo manual adicional.',
  },
  {
    num: '05',
    tema: 'Objetivos del CRM',
    icon: Target,
    tint: 'purple',
    respuesta: 'Más recompra, mayor recurrencia y llegar a personas que nunca han visitado el parque. No existen ejemplos de promociones que se quieran automatizar.',
    lectura: 'Los tres objetivos se resuelven con la misma base de datos: recompra y recurrencia por automatización, y clientes nuevos con públicos similares y reseñas construidos sobre esa misma base. Como no hay promociones definidas, Sixteam aporta el diseño del playbook además de la ejecución.',
  },
];

// ─── SISTEMA ─────────────────────────────────────────────────────────────────

const COMPONENTES = [
  {
    num: '01',
    nombre: 'Captura del visitante particular',
    subtitulo: 'El punto donde hoy se pierde el cliente',
    icon: QrCode,
    tint: 'orange',
    items: [
      'Código QR en taquilla y en la salida que abre un formulario de cuatro campos: nombre del acudiente, WhatsApp, nombre del niño y fecha de cumpleaños',
      'Incentivo concreto a cambio del registro, por ejemplo un descuento aplicable en la siguiente visita, para que el canje quede claro para la familia',
      'Registro alternativo por palabra clave en WhatsApp, para quien prefiere no llenar un formulario',
      'Autorización de tratamiento de datos incorporada en el flujo, con el adulto responsable como titular y el consentimiento guardado',
      'Capacitación al equipo de taquilla sobre cómo pedir el registro en menos de veinte segundos',
    ],
  },
  {
    num: '02',
    nombre: 'CRM y base de datos de clientes',
    subtitulo: 'Contactos · segmentos · historial',
    icon: Database,
    tint: 'purple',
    items: [
      'Migración y limpieza del histórico de cumpleaños que hoy vive en Google Calendar, con normalización de teléfonos y eliminación de duplicados',
      'Campos personalizados del negocio: nombre y edad del niño, fecha de cumpleaños, número de visitas, fecha de la última visita y tipo de visita',
      'Segmentos automáticos: recurrente, visitante nuevo, inactivo, cliente de cumpleaños y contacto de colegio',
      'Pipelines separados por línea de negocio, porque no se venden igual el cumpleaños, el paseo escolar y la visita particular',
      'Panel de informes con visitas registradas, recurrencia real y valor acumulado por cliente',
    ],
  },
  {
    num: '03',
    nombre: 'Agenda y reservas en la plataforma',
    subtitulo: 'Reemplazo de Google Calendar',
    icon: CalendarClock,
    tint: 'blue',
    items: [
      'Calendario de reservas dentro de la plataforma para visitas particulares, cumpleaños y paseos escolares',
      'Cada reserva crea o actualiza automáticamente la ficha del cliente, de modo que la base se alimenta sola',
      'Confirmación y recordatorio automático por WhatsApp antes de la fecha, para reducir la inasistencia',
      'Disponibilidad visible para el asistente de IA, que agenda sin intervención humana',
      'Vista de ocupación por día y por franja horaria para planificar personal y montaje',
    ],
  },
  {
    num: '04',
    nombre: 'ChatCenter multicanal',
    subtitulo: 'Instagram · Facebook · WhatsApp en una bandeja',
    icon: Inbox,
    tint: 'amber',
    items: [
      'Bandeja unificada de WhatsApp, Instagram y Facebook, con historial completo por contacto',
      'Cada conversación queda asociada al cliente en el CRM, así que el historial no se pierde al cerrar el chat',
      'Plantillas de respuesta para las preguntas repetidas: precios, horarios, edades y qué incluye el paquete de cumpleaños',
      'Notas internas y asignación de la conversación cuando entra otra persona al equipo',
      'Visibilidad de tiempos de respuesta y volumen de conversaciones por canal',
    ],
  },
  {
    num: '05',
    nombre: 'Asistente de IA',
    subtitulo: 'Responde · califica · agenda',
    icon: Bot,
    tint: 'teal',
    items: [
      'Responde en segundos las 24 horas, que es cuando llega el grueso de las consultas: fin de semana y horario nocturno',
      'Entrenado con la información real del parque: precios, horarios, rangos de edad, normas de ingreso y paquetes de cumpleaños',
      'Distingue la consulta simple de la intención real de reservar, y agenda directamente contra la disponibilidad del calendario',
      'Captura de forma natural el dato clave dentro de la conversación, incluida la fecha de cumpleaños del niño',
      'Entrega la conversación a Sebastián con todo el contexto cuando se necesita una persona',
    ],
  },
  {
    num: '06',
    nombre: 'Motor de recompra y recurrencia',
    subtitulo: 'Automatizaciones sobre la base propia',
    icon: Repeat,
    tint: 'orange',
    items: [
      'Campaña de cumpleaños automática a 45 y a 30 días de la fecha del niño, con la oferta del paquete de fiesta',
      'Reactivación por inactividad a los 40 o 45 días, calzada con el ciclo mensual que el propio equipo describió',
      'Mensaje posterior a la visita con agradecimiento, encuesta corta y solicitud de reseña en Google',
      'Programa de fidelidad con visitas acumuladas en el CRM en lugar de tarjetas de cartón',
      'Campañas estacionales preparadas con anticipación para Fiestas Patrias, vacaciones de verano, vuelta a clases, vacaciones de invierno y Día del Niño',
    ],
  },
  {
    num: '07',
    nombre: 'Adquisición de clientes nuevos',
    subtitulo: 'Familias que nunca han visitado y colegios',
    icon: UserPlus,
    tint: 'purple',
    items: [
      'Públicos similares en Meta construidos sobre los clientes reales del parque, que es la audiencia más rentable para un negocio de radio geográfico corto',
      'Exclusión de quienes ya son clientes, para no pagar pauta por familias que ya vienen solas',
      'Motor de reseñas en Google Business Profile alimentado por el mensaje posterior a la visita, porque la decisión local se toma buscando y comparando reseñas recientes',
      'Referidos con código rastreable dentro del CRM, para medir cuántas visitas trae cada cliente',
      'Pipeline B2B de colegios con lista de prospección y secuencia de contacto antes de cada temporada, en lugar de esperar a que los colegios llamen',
    ],
  },
];

// ─── CALENDARIO ESTACIONAL ───────────────────────────────────────────────────

const TEMPORADAS = [
  { mes: 'Septiembre',       evento: 'Fiestas Patrias',        nota: 'Fin de semana largo, familias en la zona', icon: PartyPopper, color: SP },
  { mes: 'Octubre',          evento: 'Halloween',              nota: 'Activación temática de bajo costo',        icon: Sparkles,    color: SP2 },
  { mes: 'Diciembre a marzo',evento: 'Vacaciones de verano',   nota: 'Temporada alta del año',                   icon: TrendingUp,  color: '#00bfa5' },
  { mes: 'Marzo',            evento: 'Vuelta a clases',        nota: 'Ventana para cerrar paseos escolares',     icon: School,      color: '#60a5fa' },
  { mes: 'Julio',            evento: 'Vacaciones de invierno', nota: 'Segundo pico de colegios y familias',      icon: Users,       color: '#fbbf24' },
  { mes: 'Agosto',           evento: 'Día del Niño',           nota: 'Segundo domingo, concentra público',       icon: Baby,        color: '#f87171' },
];

// ─── RUTA DE TRABAJO ─────────────────────────────────────────────────────────

const RUTA = [
  {
    num: '01',
    titulo: 'Cimientos',
    plazo: 'Semanas 1 y 2',
    color: SP, colorAlpha: 'rgba(255,138,60,.08)', colorBorder: 'rgba(255,138,60,.24)',
    desc: 'Se monta el CRM con los campos del negocio, se migra y se limpia el histórico de cumpleaños que hoy vive en Google Calendar, y se conectan WhatsApp, Instagram y Facebook a una sola bandeja. Al cerrar esta fase Sensorial Park ya tiene base de datos propia.',
    entregable: 'CRM operativo · histórico migrado · 3 canales conectados',
  },
  {
    num: '02',
    titulo: 'Captura en sitio',
    plazo: 'Semanas 3 y 4',
    color: SP2, colorAlpha: 'rgba(168,85,247,.08)', colorBorder: 'rgba(168,85,247,.24)',
    desc: 'Se abre el mecanismo que hoy no existe: QR en taquilla y en la salida, formulario de cuatro campos, incentivo de canje y autorización de datos incorporada. Se capacita al equipo para pedir el registro sin frenar la fila. La meta de esta fase es dejar de perder al visitante particular.',
    entregable: 'Registro activo · equipo capacitado · consentimiento guardado',
  },
  {
    num: '03',
    titulo: 'Motor de recompra',
    plazo: 'Semanas 5 a 8',
    color: '#00bfa5', colorAlpha: 'rgba(0,191,165,.08)', colorBorder: 'rgba(0,191,165,.24)',
    desc: 'Con base propia ya se puede automatizar. Entran la campaña de cumpleaños a 45 y 30 días, la reactivación por inactividad, el mensaje posterior a la visita con solicitud de reseña y el asistente de IA respondiendo y agendando las 24 horas.',
    entregable: 'Asistente activo · 4 automatizaciones corriendo',
  },
  {
    num: '04',
    titulo: 'Adquisición',
    plazo: 'Semanas 9 a 12',
    color: '#60a5fa', colorAlpha: 'rgba(96,165,250,.08)', colorBorder: 'rgba(96,165,250,.24)',
    desc: 'Recién aquí tiene sentido invertir en captar gente nueva, porque ya existe una base sobre la cual construir públicos similares y excluir a los clientes actuales. Se abre además el pipeline de colegios y se deja preparada la campaña de la temporada de verano.',
    entregable: 'Públicos similares · pipeline de colegios · campaña de verano lista',
  },
];

// ─── QUÉ INCLUYE SIXTEAM OPS ─────────────────────────────────────────────────

const OPS_PLATAFORMA = [
  'CRM con base de datos de contactos y campos personalizados del negocio',
  'ChatCenter con WhatsApp, Instagram y Facebook en una sola bandeja',
  'Asistente de IA conversacional entrenado con la información del parque',
  'Calendario de reservas y agendamiento de visitas, cumpleaños y paseos escolares',
  'Constructor de automatizaciones y flujos de mensajes',
  'Módulo de oportunidades con pipelines por línea de negocio',
  'Formularios, encuestas y páginas de captura conectados al CRM',
  'Envío de campañas por WhatsApp, correo y SMS desde la misma plataforma',
  'Panel de informes y KPIs del negocio',
  'Usuarios del equipo y aplicación móvil para gestionar desde el teléfono',
];

const OPS_EQUIPO = [
  'Equipo de tecnología de Sixteam disponible durante todo el mes, sin necesidad de contratar personal interno',
  'Canal directo de solicitudes por WhatsApp o correo, sin sistema de tickets de por medio',
  'Reunión mensual de revisión con resultados, aprendizajes y plan del siguiente período',
  'Recomendaciones de marketing y de operación que están funcionando en entretenimiento familiar',
  'Mejora continua del asistente de IA a medida que cambian precios, horarios o paquetes',
  'Reporte de cierre con el detalle de qué se atendió y cuántos créditos quedaron disponibles',
];

const OPS_CATALOGO = [
  {
    categoria: 'CRM, base de datos y automatizaciones',
    icon: LayoutDashboard,
    color: '#00bfa5',
    items: [
      'Nuevos campos, etiquetas y segmentos sobre la base de clientes',
      'Flujos de recompra, reactivación por inactividad y campañas de cumpleaños',
      'Ajustes y nuevas etapas en los pipelines de cumpleaños, colegios y visita particular',
      'Recordatorios y tareas automáticas para el equipo',
      'Informes de recurrencia, valor por cliente y origen del contacto',
    ],
  },
  {
    categoria: 'Marketing y campañas',
    icon: Megaphone,
    color: '#60a5fa',
    items: [
      'Montaje, ajuste y optimización de campañas en Meta Ads',
      'Públicos similares, segmentaciones y exclusión de clientes actuales',
      'Diseño del calendario promocional del año, que hoy no existe',
      'Páginas de captura y formularios conectados al CRM',
      'Píxel y seguimiento de conversiones validado sin duplicados',
    ],
  },
  {
    categoria: 'Servicio y canales de atención',
    icon: Headphones,
    color: '#fbbf24',
    items: [
      'Operación del ChatCenter con los tres canales en una sola bandeja',
      'Plantillas de respuesta para las preguntas repetidas del parque',
      'Encuestas de satisfacción y solicitudes de reseña en Google',
      'Resolución de incidencias sobre la plataforma y sobre las integraciones activas',
    ],
  },
  {
    categoria: 'Inteligencia artificial aplicada',
    icon: Bot,
    color: SP,
    items: [
      'Entrenamiento y reentrenamiento del asistente cuando cambia la oferta',
      'Calificación automática del interesado antes de que llegue a Sebastián',
      'Clasificación de conversaciones y enrutamiento al responsable correcto',
      'Análisis de la base para detectar clientes reactivables sin volver a pagar pauta',
    ],
  },
  {
    categoria: 'Activación de módulos de la plataforma',
    icon: Layers,
    color: SP2,
    items: [
      'Puesta en marcha de módulos que la plataforma ya incluye y que aún no se están usando',
      'Configuración del módulo según la operación: campos, reglas, permisos y usuarios',
      'Conexión del módulo con el CRM, el ChatCenter y los flujos que ya están corriendo',
      'Capacitación al equipo sobre cada módulo que se habilita',
    ],
  },
];

const OPS_FLUJO = [
  { step: '01', text: 'Sebastián envía la solicitud por el canal de siempre, describiendo qué necesita el parque.' },
  { step: '02', text: 'Sixteam responde con la cotización: cuántos créditos consume y en cuánto tiempo queda lista.' },
  { step: '03', text: 'Sensorial Park aprueba y el equipo ejecuta. Los créditos se descuentan del saldo del mes.' },
  { step: '04', text: 'Al cierre del período se entrega el reporte con el desglose por solicitud y el saldo restante.' },
];

const FUERA = [
  { titulo: 'Presupuesto de pauta',        desc: 'La inversión publicitaria en Meta o Google la paga Sensorial Park directamente a la plataforma. Sixteam monta, opera y optimiza la campaña, pero no cobra ni intermedia el presupuesto de medios.' },
  { titulo: 'Plantillas de WhatsApp',      desc: 'Los mensajes enviados fuera de la ventana de 24 horas los cobra Meta directamente y se trasladan sin margen adicional.' },
  { titulo: 'Consumo del asistente de IA', desc: 'Se factura mes vencido sobre el consumo real, a USD 0,02 por mensaje procesado por el asistente.' },
  { titulo: 'Producción audiovisual',      desc: 'Fotografía, video y locución en el parque no están incluidos. Si se requieren, se cotizan por aparte.' },
  { titulo: 'Hardware y señalética',       desc: 'La impresión del QR, los avisos en taquilla y cualquier equipo en sitio corren por cuenta de Sensorial Park. Sixteam entrega los archivos listos para imprimir.' },
  { titulo: 'Desarrollo a la medida',      desc: 'Software fuera de la plataforma Sixteam, integraciones con sistemas de terceros no contemplados o aplicaciones propias requieren cotización independiente.' },
];

// ─── TÉRMINOS ────────────────────────────────────────────────────────────────

const TERMINOS = [
  {
    titulo: 'Aprobación',
    desc: 'Se acepta por WhatsApp, correo o firma digital. Con eso se habilita el contrato y se agenda la fecha de inicio.',
    icon: CheckCircle,
  },
  {
    titulo: 'Duración mínima de contrato',
    desc: 'La duración mínima es de 3 meses, que es el tiempo que toma completar la ruta de trabajo de esta propuesta. Terminado ese período la relación continúa mes a mes y puede cerrarse avisando con 30 días de anticipación.',
    icon: Clock,
  },
  {
    titulo: 'Moneda y tipo de cambio',
    desc: `La facturación se realiza en dólares estadounidenses. Los valores en pesos chilenos de esta propuesta son referenciales y están calculados a USD 1 = CLP ${clp(TC_CLP)}. El monto final en pesos depende del tipo de cambio del día y de la conversión que aplique el medio de pago.`,
    icon: Wallet,
  },
  {
    titulo: 'Términos de pago',
    desc: 'La implementación se paga al aprobar la propuesta y antes de iniciar. La cuota mensual de Sixteam Ops se factura por adelantado desde la fecha de inicio del servicio.',
    icon: FileText,
  },
  {
    titulo: 'Créditos incluidos en Sixteam Ops',
    desc: `La cuota mensual incluye ${CREDITOS_MES} créditos por período, equivalentes en promedio a cerca de ${SOLICITUDES_MES} solicitudes estándar. Los créditos tienen vigencia únicamente dentro del mes en que se otorgan: se reinician al inicio de cada período y los no utilizados no son acumulables ni transferibles. Cada solicitud se cotiza en créditos antes de ejecutarse.`,
    icon: Coins,
  },
  {
    titulo: 'Si se agotan los créditos del mes',
    desc: `Agotada la bolsa del período, toda solicitud posterior genera un consumo adicional que se factura aparte, al mismo valor unitario de USD ${CREDITO_USD} por crédito, cerca de CLP ${CREDITO_CLP}, y sin recargo por excederse. Cada excedente se cotiza y requiere aprobación antes de ejecutarse. Si Sensorial Park prefiere, la solicitud se programa para el mes siguiente y consume la bolsa de ese período.`,
    icon: Coins,
  },
  {
    titulo: 'Canales conectados',
    desc: 'El plan contempla 1 número de WhatsApp Business, 1 cuenta de Instagram y 1 página de Facebook. Números o canales adicionales se cotizan según la necesidad.',
    icon: Users,
  },
  {
    titulo: 'Consumo de IA',
    desc: 'USD 0,02 por mensaje procesado por el asistente, facturado mes vencido sobre el consumo real. La calculadora de esta propuesta es una estimación referencial y no un compromiso de facturación.',
    icon: Bot,
  },
  {
    titulo: 'Plantillas de WhatsApp',
    desc: 'Los mensajes enviados fuera de la ventana de 24 horas los cobra Meta directamente según su tarifa por país, y se trasladan sin margen adicional. Chile tiene tarifa propia dentro del listado de Meta, visible en la sección de inversión.',
    icon: MessageSquare,
  },
  {
    titulo: 'Tratamiento de datos personales',
    desc: 'Sensorial Park es el responsable del tratamiento de la base de datos y Sixteam actúa como encargado. Los flujos de captura se entregan con la autorización de tratamiento incorporada, y el titular registrado es siempre el adulto responsable, nunca el menor. Chile actualiza su marco de protección de datos personales con la Ley 21.719, que entra en vigencia a partir de diciembre de 2026, de modo que conviene construir la base cumpliendo desde el primer día. La validación legal final del texto de autorización queda a cargo de Sensorial Park.',
    icon: Shield,
  },
  {
    titulo: 'Cambios al alcance',
    desc: 'Cualquier servicio, integración o funcionalidad no incluida en esta propuesta requiere cotización adicional y puede afectar los tiempos de entrega.',
    icon: AlertCircle,
  },
  {
    titulo: 'Vigencia de la propuesta',
    desc: `30 días calendario desde ${META.fecha}. Pasado ese plazo los valores pueden revisarse.`,
    icon: Calendar,
  },
];

const SECCIONES = [
  { id: 'resumen',       label: 'Resumen' },
  { id: 'levantamiento', label: 'Levantamiento' },
  { id: 'objetivo',      label: 'Objetivo' },
  { id: 'sistema',       label: 'Sistema' },
  { id: 'ruta',          label: 'Ruta' },
  { id: 'inversion',     label: 'Inversión' },
  { id: 'terminos',      label: 'Términos' },
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

// Logo del cliente con respaldo tipográfico si el archivo aún no existe
const ClientLogo = ({ className = '', textSize = '18px' }: { className?: string; textSize?: string }) => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="font-poppins font-black tracking-tight leading-none text-center"
          style={{ color: SP, fontSize: textSize }}>
          SENSORIAL<br /><span style={{ color: SP2 }}>PARK</span>
        </span>
      </div>
    );
  }
  return (
    <img src="/sensorial-park-logo.jpg" alt="Sensorial Park"
      className={`object-contain ${className}`}
      onError={() => setFailed(true)} />
  );
};

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const SensorialParkProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [compActivo, setCompActivo] = useState<number | null>(null);
  const [levActivo, setLevActivo] = useState<number | null>(null);
  const [openTerms, setOpenTerms] = useState<Set<number>>(new Set());
  const [showOpsIncluye, setShowOpsIncluye] = useState(false);
  const [opsTab, setOpsTab] = useState<'plataforma' | 'equipo' | 'creditos' | 'catalogo'>('plataforma');
  const [showFuera, setShowFuera] = useState(false);
  const [showCostosVariables, setShowCostosVariables] = useState(false);
  const [showMetaTable, setShowMetaTable] = useState(false);
  const [showCalcIA, setShowCalcIA] = useState(false);

  // Calculadora de IA
  const [mensajesConv, setMensajesConv] = useState(6);
  const [convsMes, setConvsMes] = useState(300);
  const consumoIAUSD = (0.02 * mensajesConv * convsMes).toFixed(2);

  const toggleTerm = (i: number) => setOpenTerms(prev => {
    const next = new Set(prev);
    if (next.has(i)) next.delete(i); else next.add(i);
    return next;
  });

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

  const OPS_TABS = [
    { id: 'plataforma', label: 'Plataforma incluida', icon: LayoutDashboard },
    { id: 'equipo',     label: 'Equipo y acompañamiento', icon: Headphones },
    { id: 'creditos',   label: 'Créditos y solicitudes', icon: Coins },
    { id: 'catalogo',   label: 'Catálogo de trabajo', icon: Layers },
  ] as const;

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
            style={{ background: 'radial-gradient(circle, rgba(255,138,60,.08) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(168,85,247,.07) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
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
            <ClientLogo className="h-10 w-auto rounded-md" textSize="13px" />
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
                  style={{ background: `linear-gradient(135deg, ${SP}, ${SP2})` }}>
                  <PartyPopper className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: SP_BG, border: `1px solid ${SP_BORDER}`, color: SP }}>
                  {META.tagline}
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}>
                Propuesta<br />
                <span style={{ background: `linear-gradient(90deg,${SP},${SP2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
                  { icon: MapPin,   text: 'Purranque, Chile' },
                  { icon: MessageSquare, text: 'WhatsApp · Instagram · Facebook' },
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
                  {['1. Resumen ejecutivo','2. Levantamiento','3. Objetivo','4. Sistema propuesto','5. Ruta de trabajo','6. Inversión','7. Términos y condiciones'].map((item, i) => (
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
                  style={{ background: `radial-gradient(circle, rgba(255,138,60,.14) 0%, rgba(168,85,247,.06) 50%, transparent 70%)` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full" style={{ border: `1px solid rgba(255,138,60,.16)` }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(168,85,247,.2)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: SP, boxShadow: `0 0 6px rgba(255,138,60,.8)` }} />
                </div>
              </div>
              <div className="cover-float relative z-10 flex flex-col items-center gap-6 w-full px-6">
                <div className="flex flex-col items-center gap-1">
                  <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-16 w-auto object-contain"
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
                  <div className="w-48 h-32 flex items-center justify-center p-3 rounded-xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)' }}>
                    <ClientLogo className="w-full h-full rounded-lg" textSize="26px" />
                  </div>
                  <div className="text-center">
                    <span className="font-poppins font-black text-white text-[24px] tracking-tight">{META.cliente}</span>
                    <p className="font-lato text-[13px] uppercase tracking-[0.18em] mt-1" style={{ color: SP }}>Purranque · Chile</p>
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
          <SectionTitle>Contexto y diagnóstico</SectionTitle>
          <Rule />

          {/* Ficha del cliente */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center"
            style={{ background: 'rgba(2,8,20,.85)', border: `1px solid ${SP_BORDER}` }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-28 h-24 flex items-center justify-center p-2 rounded-xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)' }}>
                <ClientLogo className="w-full h-full rounded-lg" textSize="15px" />
              </div>
              <span className="font-poppins font-black text-white text-[14px] tracking-tight">{META.cliente}</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Sector', value: 'Parque sensorial infantil' },
                { label: 'Contacto', value: META.contacto },
                { label: 'Ubicación', value: 'Corte Alto, Purranque · Chile' },
                { label: 'Canales actuales', value: 'Instagram, Facebook y WhatsApp, todos manuales' },
                { label: 'Base de datos', value: 'Solo clientes de cumpleaños' },
                { label: 'Sistema de reservas', value: 'Google Calendar, sin API' },
              ].map((f, i) => (
                <div key={i}>
                  <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">{f.label}</p>
                  <p className="font-lato text-white/65 text-[15px]">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-8">
            <p>
              Sensorial Park no tiene un problema de marketing. Tiene un problema de <strong className="text-white/90 font-semibold">memoria</strong>. El propio equipo estima que cerca del 70% de sus visitantes son recurrentes y que vuelven alrededor de una vez al mes, pero ese 70% es hoy una intuición sin registro: del visitante particular no queda nombre, ni teléfono, ni fecha de la visita.
            </p>
            <p>
              Lo único que sí quedó guardado es la agenda de cumpleaños en Google Calendar, que casualmente corresponde al producto de <strong className="text-white/90 font-semibold">mayor ticket</strong>. Es decir, existe una semilla de datos justo en el segmento caro y cero información del segmento que sostiene el flujo diario.
            </p>
            <p>
              Esta propuesta cierra esa fuga y activa la recompra sobre lo que ya está pasando: implementación del ecosistema <strong className="text-white/90 font-semibold">Sixteam.pro</strong>, que incluye CRM, ChatCenter, agenda de reservas y asistente de IA, más un equipo de tecnología que opera y mejora el sistema mes a mes bajo <strong style={{ color: SP }}>Sixteam Ops</strong>.
            </p>
          </div>

          {/* Frase ancla */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8 relative overflow-hidden"
            style={{ background: `linear-gradient(120deg, rgba(255,138,60,.08), rgba(168,85,247,.06))`, border: `1px solid ${SP_BORDER}` }}>
            <Cake className="w-6 h-6 mb-3" style={{ color: SP }} />
            <p className="font-poppins font-semibold text-white/90 text-[19px] sm:text-[21px] leading-relaxed">
              El sistema no se paga con clientes nuevos. Se paga con los que <strong className="text-white font-black">ya entraron por la puerta</strong> y hoy salen sin dejar rastro.
            </p>
          </div>

          {/* Hallazgos */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> 6 frenos identificados
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

        {/* ─ 02 LEVANTAMIENTO ─ */}
        <section id="levantamiento" ref={s2.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>02 · Levantamiento</TagLabel>
          <SectionTitle>Lo que nos dijeron y lo que significa</SectionTitle>
          <Rule />

          <p className="font-lato text-white/55 text-[18px] leading-relaxed mb-6">
            Esta propuesta no parte de un supuesto. Parte de la situación real que el equipo de Sensorial Park describió sobre su base de datos, sus canales, el comportamiento de compra, las reservas y los objetivos del negocio. Cada punto va con la lectura que hace Sixteam sobre él.
          </p>

          <div className="space-y-3">
            {LEVANTAMIENTO.map((l, i) => {
              const Icon = l.icon; const t = TINT[l.tint];
              const open = levActivo === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${t.border}` : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setLevActivo(open ? null : i)} className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? t.bg : 'rgba(255,255,255,.05)' }}>
                      <Icon className={`w-5 h-5 transition-colors ${open ? t.text : 'text-white/40'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`font-lato text-[12px] uppercase tracking-widest ${t.text}`} style={{ opacity: 0.9 }}>{l.num}</span>
                      <p className={`font-poppins font-bold text-[18px] mt-0.5 ${open ? 'text-white' : 'text-white/70'}`}>{l.tema}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-90' : ''} ${open ? t.text : 'text-white/30'}`} />
                  </button>

                  {open && (
                    <div className="px-4 sm:px-5 pb-5 border-t space-y-3" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <div className="rounded-lg p-3.5 mt-4" style={{ background: 'rgba(2,8,20,.6)', border: '1px solid rgba(255,255,255,.06)' }}>
                        <p className="font-poppins font-semibold text-white/45 text-[12px] uppercase tracking-wider mb-1.5">Situación actual</p>
                        <p className="font-lato text-white/70 text-[15px] leading-relaxed italic">{l.respuesta}</p>
                      </div>
                      <div className="rounded-lg p-3.5" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                        <p className={`font-poppins font-semibold text-[12px] uppercase tracking-wider mb-1.5 ${t.text}`}>Lectura de Sixteam</p>
                        <p className="font-lato text-white/65 text-[15px] leading-relaxed">{l.lectura}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </section>

        {/* ─ 03 OBJETIVO ─ */}
        <section id="objetivo" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 · Objetivo</TagLabel>
          <SectionTitle>¿Para qué estamos aquí?</SectionTitle>
          <Rule />
          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: `radial-gradient(circle, rgba(255,138,60,.09), transparent 70%)`, transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 text-[#00bfa5] mb-4" />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[22px] leading-relaxed">
              Que <strong className="text-white font-black">cada visita quede registrada</strong>, que el parque sepa a quién le vende y cuándo vuelve, y que la siguiente visita y el siguiente cumpleaños se provoquen de forma automática, sin que dependan de que alguien se acuerde.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Visitas registradas', value: '100%', sub: 'Meta desde la semana 4' },
              { label: 'Canales', value: '3 en 1', sub: 'WhatsApp, IG y Facebook' },
              { label: 'Respuesta', value: '24/7', sub: 'Asistente de IA' },
              { label: 'Ruta', value: '90 días', sub: 'De cero a sistema activo' },
            ].map((k, i) => (
              <div key={i} className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(29,112,162,.07)', border: '1px solid rgba(29,112,162,.2)' }}>
                <p className="font-poppins font-black text-white text-[26px] leading-none mb-1">{k.value}</p>
                <p className="font-poppins font-semibold text-white/70 text-[13px] mb-0.5">{k.label}</p>
                <p className="font-lato text-white/35 text-[12px]">{k.sub}</p>
              </div>
            ))}
          </div>

          {/* Los tres objetivos del cliente */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { t: 'Más recompra', d: 'Reactivación automática de quien no vuelve, sobre una base que hoy no existe.', icon: Repeat, c: SP },
              { t: 'Mayor recurrencia', d: 'Campaña de cumpleaños y fidelidad por visitas acumuladas, para subir de visita particular a fiesta.', icon: Cake, c: SP2 },
              { t: 'Gente nueva', d: 'Públicos similares y reseñas en Google construidos sobre los clientes reales del parque.', icon: UserPlus, c: '#00bfa5' },
            ].map((o, i) => {
              const Icon = o.icon;
              return (
                <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <Icon className="w-5 h-5 mb-2.5" style={{ color: o.c }} />
                  <p className="font-poppins font-bold text-white/85 text-[16px] mb-1">{o.t}</p>
                  <p className="font-lato text-white/45 text-[14px] leading-relaxed">{o.d}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─ 04 SISTEMA ─ */}
        <section id="sistema" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 · Sistema propuesto</TagLabel>
          <SectionTitle>7 componentes · 1 plataforma</SectionTitle>
          <Rule />

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
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? t.bg : 'rgba(255,255,255,.05)' }}>
                      <Icon className={`w-5 h-5 transition-colors ${open ? t.text : 'text-white/40'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`font-lato text-[12px] uppercase tracking-widest ${t.text}`} style={{ opacity: 0.9 }}>{c.num}</span>
                      <p className={`font-poppins font-bold text-[19px] mt-0.5 ${open ? 'text-white' : 'text-white/70'}`}>{c.nombre}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <p className="font-lato text-white/30 text-[12px] hidden sm:block">{c.subtitulo}</p>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-90' : ''} ${open ? t.text : 'text-white/30'}`} />
                    </div>
                  </button>

                  {open && (
                    <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <ul className="pt-4 space-y-2">
                        {c.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2.5">
                            <CheckCircle className={`w-3.5 h-3.5 ${t.text} flex-shrink-0 mt-1`} />
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

          {/* Calendario estacional */}
          <div className="mt-8 rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00bfa5]" /> El calendario que ya juega a favor
            </p>
            <p className="font-lato text-white/45 text-[15px] leading-relaxed mb-5">
              El negocio tiene picos naturales a lo largo del año y hoy se responde a cada uno cuando ya llegó. Con una base de datos propia, cada fecha se puede preparar con semanas de anticipación.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {TEMPORADAS.map((t, i) => {
                const Icon = t.icon;
                return (
                  <div key={i} className="rounded-xl p-3.5" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                    <Icon className="w-4 h-4 mb-2" style={{ color: t.color }} />
                    <p className="font-poppins font-bold text-white/85 text-[15px]">{t.evento}</p>
                    <p className="font-lato text-[12px] uppercase tracking-wider mb-1" style={{ color: t.color, opacity: .8 }}>{t.mes}</p>
                    <p className="font-lato text-white/45 text-[13.5px] leading-snug">{t.nota}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 rounded-xl px-4 py-3.5 flex items-start gap-3"
              style={{ background: SP_BG, border: `1px solid ${SP_BORDER}` }}>
              <Cake className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: SP }} />
              <p className="font-lato text-white/60 text-[15px] leading-relaxed">
                A esas seis fechas se suma la única que ocurre <strong className="text-white/85 font-semibold">los 365 días del año</strong>: el cumpleaños de cada niño que ha visitado el parque. Es el disparador del producto de mayor ticket y hoy no está registrado.
              </p>
            </div>
          </div>
        </section>

        {/* ─ 05 RUTA ─ */}
        <section id="ruta" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 · Ruta de trabajo</TagLabel>
          <SectionTitle>Los primeros 90 días</SectionTitle>
          <Rule />

          <p className="font-lato text-white/55 text-[18px] leading-relaxed mb-6">
            El orden importa. No tiene sentido pagar pauta para traer gente nueva mientras la puerta de atrás sigue abierta, así que primero se cierra la fuga de datos y solo después se invierte en adquisición.
          </p>

          <div className="space-y-3">
            {RUTA.map((r) => (
              <div key={r.num} className="rounded-xl p-5" style={{ background: r.colorAlpha, border: `1px solid ${r.colorBorder}` }}>
                <div className="flex items-start gap-4">
                  <span className="font-poppins font-black text-[13px] px-2.5 py-1 rounded-lg flex-shrink-0"
                    style={{ background: 'rgba(0,0,0,.25)', color: r.color }}>{r.num}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                      <p className="font-poppins font-bold text-white text-[19px]">{r.titulo}</p>
                      <span className="font-lato text-[13px] uppercase tracking-wider" style={{ color: r.color }}>{r.plazo}</span>
                    </div>
                    <p className="font-lato text-white/55 text-[15px] leading-relaxed mb-3">{r.desc}</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
                      style={{ background: 'rgba(0,0,0,.22)', border: `1px solid ${r.colorBorder}` }}>
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: r.color }} />
                      <span className="font-lato text-white/60 text-[13.5px]">{r.entregable}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─ 06 INVERSIÓN ─ */}
        <section id="inversion" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 · Inversión</TagLabel>
          <SectionTitle>Una implementación y una cuota mensual</SectionTitle>
          <Rule />

          <p className="font-lato text-white/55 text-[18px] leading-relaxed mb-6">
            Los valores se expresan en <strong className="text-white/80 font-semibold">dólares estadounidenses</strong>, con su referencia en pesos chilenos calculada a USD 1 = CLP {clp(TC_CLP)}. La plataforma CRM viene incluida dentro de Sixteam Ops, así que no se cobra por separado.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

            {/* Implementación */}
            <div className="rounded-2xl p-5 sm:p-6 flex flex-col" style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.1)' }}>
              <span className="font-lato text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 inline-block text-white/40">Pago único</span>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)' }}>
                  <Layers className="w-5 h-5 text-white/60" />
                </div>
                <div className="flex-1">
                  <p className="font-poppins font-bold text-white text-[18px]">Implementación</p>
                  <p className="font-lato text-white/40 text-[13px] mt-0.5">Puesta en marcha del sistema completo</p>
                </div>
              </div>
              <p className="font-poppins font-black text-[2rem] leading-none text-white mb-1">
                USD {IMPLEMENTACION_USD}
              </p>
              <p className="font-lato text-white/35 text-[14px] mb-5">≈ CLP {IMPLEMENTACION_CLP} · pago único</p>
              <ul className="space-y-2 mb-5 flex-1">
                {[
                  'Montaje del CRM con los campos y segmentos del negocio',
                  'Migración y limpieza del histórico de cumpleaños desde Google Calendar',
                  'Conexión de WhatsApp, Instagram y Facebook al ChatCenter',
                  'Sistema de captura con QR, formulario y autorización de datos',
                  'Calendario de reservas configurado para visitas, cumpleaños y colegios',
                  'Construcción y entrenamiento inicial del asistente de IA',
                  'Capacitación al equipo del parque',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-white/50 flex-shrink-0 mt-1" />
                    <span className="font-lato text-white/60 text-[14px]">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="font-lato text-white/30 text-[12.5px] leading-relaxed pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,.07)' }}>
                Se paga al aprobar la propuesta y antes de iniciar. Cubre las fases 01 y 02 de la ruta de trabajo.
              </p>
            </div>

            {/* Sixteam Ops */}
            <div className="rounded-2xl p-5 sm:p-6 flex flex-col relative overflow-hidden" style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.28)' }}>
              <span className="absolute top-0 right-0 font-lato text-[11px] uppercase tracking-wider px-3 py-1 rounded-bl-lg"
                style={{ background: 'rgba(0,191,165,.18)', color: '#00bfa5' }}>
                CRM incluido
              </span>
              <span className="font-lato text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 inline-block text-[#00bfa5]/70">Cuota mensual</span>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(0,191,165,.15)', border: '1px solid rgba(0,191,165,.3)' }}>
                  <Headphones className="w-5 h-5 text-[#00bfa5]" />
                </div>
                <div className="flex-1">
                  <p className="font-poppins font-bold text-white text-[18px]">Sixteam Ops</p>
                  <p className="font-lato text-white/40 text-[13px] mt-0.5">Plataforma CRM más equipo de tecnología</p>
                </div>
              </div>
              <p className="font-poppins font-black text-[2rem] leading-none text-[#00bfa5] mb-1">
                USD {OPS_USD}<span className="font-lato font-normal text-white/35 text-[0.9rem]">/mes</span>
              </p>
              <p className="font-lato text-white/35 text-[14px] mb-4">≈ CLP {OPS_CLP} al mes</p>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-5" style={{ background: 'rgba(0,191,165,.08)', border: '1px solid rgba(0,191,165,.2)' }}>
                <Coins className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0" />
                <span className="font-lato text-white/65 text-[13.5px]">{CREDITOS_MES} créditos ≈ hasta {SOLICITUDES_MES} solicitudes al mes</span>
              </div>
              <ul className="space-y-2 mb-5 flex-1">
                {[
                  'Plataforma Sixteam completa incluida, sin costo adicional',
                  'CRM, ChatCenter, agenda de reservas y asistente de IA activos',
                  'Equipo de tecnología disponible todo el mes para ejecutar solicitudes',
                  'Diseño del calendario promocional y de las campañas del parque',
                  'Operación de campañas en Meta Ads y públicos similares',
                  'Mejora continua del asistente y de las automatizaciones',
                  'Reunión mensual de revisión y reporte de cierre',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0 mt-1" />
                    <span className="font-lato text-white/65 text-[14px]">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="font-lato text-[#00bfa5]/70 text-[12.5px] leading-relaxed pt-4 border-t" style={{ borderColor: 'rgba(0,191,165,.15)' }}>
                Duración mínima de 3 meses. Después continúa mes a mes.
              </p>
            </div>
          </div>

          {/* ══ DESPLEGABLE: TODO LO QUE INCLUYE SIXTEAM OPS ══ */}
          <div className="rounded-xl overflow-hidden transition-all duration-300 mb-4"
            style={{ background: 'rgba(0,191,165,.04)', border: showOpsIncluye ? '1px solid rgba(0,191,165,.4)' : '1px solid rgba(0,191,165,.2)' }}>
            <button onClick={() => setShowOpsIncluye(v => !v)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: showOpsIncluye ? 'rgba(0,191,165,.18)' : 'rgba(0,191,165,.1)' }}>
                <Headphones className="w-4 h-4 text-[#00bfa5]" />
              </div>
              <div className="flex-1">
                <p className={`font-poppins font-bold text-[17px] ${showOpsIncluye ? 'text-white' : 'text-white/80'}`}>
                  Todo lo que incluye Sixteam Ops
                </p>
                <p className="font-lato text-white/40 text-[13px] mt-0.5">Plataforma · equipo · créditos · catálogo de trabajo</p>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                style={{ color: '#00bfa5', transform: showOpsIncluye ? 'rotate(90deg)' : undefined }} />
            </button>

            {showOpsIncluye && (
              <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(0,191,165,.15)' }}>

                {/* Pestañas */}
                <div className="flex flex-wrap gap-2 pt-4 mb-4">
                  {OPS_TABS.map(tab => {
                    const Icon = tab.icon;
                    const activa = opsTab === tab.id;
                    return (
                      <button key={tab.id} onClick={() => setOpsTab(tab.id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
                        style={{
                          background: activa ? 'rgba(0,191,165,.14)' : 'rgba(255,255,255,.03)',
                          border: activa ? '1px solid rgba(0,191,165,.35)' : '1px solid rgba(255,255,255,.07)',
                        }}>
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: activa ? '#00bfa5' : 'rgba(255,255,255,.35)' }} />
                        <span className="font-lato text-[13.5px]" style={{ color: activa ? '#fff' : 'rgba(255,255,255,.5)' }}>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Plataforma incluida */}
                {opsTab === 'plataforma' && (
                  <div>
                    <p className="font-lato text-white/55 text-[15px] leading-relaxed mb-3">
                      La cuota mensual de Sixteam Ops incluye el acceso completo a la Plataforma Sixteam, así que no hay una segunda licencia que pagar. Estas son las funciones que quedan disponibles desde el primer día:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {OPS_PLATAFORMA.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 rounded-lg p-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                          <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                          <span className="font-lato text-white/55 text-[13.5px] leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Equipo */}
                {opsTab === 'equipo' && (
                  <div>
                    <p className="font-lato text-white/55 text-[15px] leading-relaxed mb-3">
                      La diferencia entre tener una plataforma y tener un sistema funcionando es quién la opera. Sixteam Ops pone ese equipo detrás de Sensorial Park, sin necesidad de contratar personal interno:
                    </p>
                    <div className="space-y-2">
                      {OPS_EQUIPO.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 rounded-lg p-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                          <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                          <span className="font-lato text-white/55 text-[14px] leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Créditos */}
                {opsTab === 'creditos' && (
                  <div className="space-y-5">
                    <div>
                      <p className="font-lato text-white/55 text-[15px] leading-relaxed mb-3">
                        La cuota incluye una bolsa de <strong className="text-white/80">{CREDITOS_MES} créditos por mes</strong>, equivalentes en promedio a cerca de {SOLICITUDES_MES} solicitudes estándar. Cada solicitud se cotiza en créditos antes de ejecutarse, así siempre se sabe cuánto consume y en cuánto tiempo queda lista.
                      </p>
                      <div className="rounded-xl p-4 flex flex-col gap-2.5" style={{ background: 'rgba(2,8,20,.6)', border: '1px solid rgba(255,255,255,.06)' }}>
                        {OPS_FLUJO.map((s) => (
                          <div key={s.step} className="flex items-start gap-3">
                            <span className="font-poppins font-black text-[11px] px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                              style={{ background: 'rgba(0,191,165,.15)', color: '#00bfa5' }}>{s.step}</span>
                            <p className="font-lato text-white/55 text-[14px] leading-relaxed">{s.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-poppins font-semibold text-white/70 text-[13px] uppercase tracking-wider mb-2.5">Ejemplo de solicitud</p>
                      <div className="space-y-2.5">
                        <div className="rounded-lg p-3 flex gap-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                          <span className="font-poppins font-black text-[11px] px-2 py-0.5 rounded flex-shrink-0 h-fit mt-0.5"
                            style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.5)' }}>Sensorial Park</span>
                          <p className="font-lato text-white/55 text-[14px] leading-relaxed italic">
                            «Queremos que a los niños que cumplen años en 45 días les llegue automáticamente el paquete de fiesta por WhatsApp, y que si no responden se les insista una vez a los 30 días.»
                          </p>
                        </div>
                        <div className="rounded-lg p-3 flex gap-3" style={{ background: SP_BG, border: `1px solid ${SP_BORDER}` }}>
                          <span className="font-poppins font-black text-[11px] px-2 py-0.5 rounded flex-shrink-0 h-fit mt-0.5"
                            style={{ background: 'rgba(255,138,60,.22)', color: SP }}>Sixteam</span>
                          <p className="font-lato text-white/55 text-[14px] leading-relaxed italic">
                            «Recibido. Incluye el flujo de dos pasos, la plantilla aprobada por Meta, la segmentación por fecha de cumpleaños y el registro de la respuesta en el CRM. Queda como <strong className="text-white/75 not-italic">solicitud estándar, 10 créditos</strong>, lista en 3 días hábiles. Quedarían 30 créditos disponibles este mes. ¿Aprobamos?»
                          </p>
                        </div>
                        <div className="rounded-lg p-3 flex gap-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                          <span className="font-poppins font-black text-[11px] px-2 py-0.5 rounded flex-shrink-0 h-fit mt-0.5"
                            style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.5)' }}>Sensorial Park</span>
                          <p className="font-lato text-white/55 text-[14px] leading-relaxed italic">«Aprobado.»</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl p-4" style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.2)' }}>
                      <p className="font-poppins font-semibold text-white/80 text-[15px] mb-1.5">Si un mes se agotan los {CREDITOS_MES} créditos</p>
                      <p className="font-lato text-white/55 text-[14px] leading-relaxed">
                        Las solicitudes que sigan generan consumo adicional facturado aparte, al mismo valor de USD {CREDITO_USD} por crédito, cerca de CLP {CREDITO_CLP}, y sin recargo por excederse. Cada excedente se cotiza y se aprueba antes de ejecutarse, o se programa para el mes siguiente si Sensorial Park lo prefiere. La cuota fija mensual no cambia por ello.
                      </p>
                    </div>
                  </div>
                )}

                {/* Catálogo */}
                {opsTab === 'catalogo' && (
                  <div className="space-y-3">
                    <p className="font-lato text-white/55 text-[15px] leading-relaxed">
                      Estas son las categorías de trabajo que Sensorial Park puede solicitar cada mes contra la bolsa de créditos:
                    </p>
                    {OPS_CATALOGO.map((cat, i) => {
                      const Icon = cat.icon;
                      return (
                        <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                          <div className="flex items-center gap-2.5 mb-3">
                            <Icon className="w-4 h-4 flex-shrink-0" style={{ color: cat.color }} />
                            <p className="font-poppins font-bold text-white/85 text-[15.5px]">{cat.categoria}</p>
                          </div>
                          <ul className="space-y-1.5">
                            {cat.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <div className="w-1 h-1 rounded-full flex-shrink-0 mt-2" style={{ background: cat.color }} />
                                <span className="font-lato text-white/50 text-[13.5px] leading-snug">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}
          </div>

          {/* ══ DESPLEGABLE: QUÉ NO INCLUYE ══ */}
          <div className="rounded-xl overflow-hidden transition-all duration-300 mb-4"
            style={{ background: 'rgba(255,255,255,.03)', border: showFuera ? '1px solid rgba(251,191,36,.3)' : '1px solid rgba(255,255,255,.08)' }}>
            <button onClick={() => setShowFuera(v => !v)} className="w-full flex items-center gap-3 px-5 py-4 text-left">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: showFuera ? 'rgba(251,191,36,.15)' : 'rgba(255,255,255,.05)' }}>
                <AlertCircle className="w-4 h-4" style={{ color: showFuera ? '#fbbf24' : 'rgba(255,255,255,.35)' }} />
              </div>
              <div className="flex-1">
                <p className={`font-poppins font-bold text-[16px] ${showFuera ? 'text-white' : 'text-white/65'}`}>Qué no incluye esta cuota</p>
                <p className="font-lato text-white/35 text-[13px] mt-0.5">Para que no haya sorpresas después</p>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                style={{ color: showFuera ? '#fbbf24' : 'rgba(255,255,255,.3)', transform: showFuera ? 'rotate(90deg)' : undefined }} />
            </button>
            {showFuera && (
              <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {FUERA.map((f, i) => (
                    <div key={i} className="rounded-lg p-3.5" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                      <p className="font-poppins font-semibold text-white/80 text-[14.5px] mb-1">{f.titulo}</p>
                      <p className="font-lato text-white/45 text-[13.5px] leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ══ DESPLEGABLE: COSTOS ADICIONALES ══ */}
          <div className="rounded-xl overflow-hidden transition-all duration-300"
            style={{ background: 'rgba(255,255,255,.03)', border: showCostosVariables ? '1px solid rgba(96,165,250,.35)' : '1px solid rgba(255,255,255,.08)' }}>
            <button onClick={() => setShowCostosVariables(v => !v)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: showCostosVariables ? 'rgba(96,165,250,.15)' : 'rgba(255,255,255,.05)' }}>
                <Info className="w-4 h-4" style={{ color: showCostosVariables ? '#60a5fa' : 'rgba(255,255,255,.35)' }} />
              </div>
              <div className="flex-1">
                <p className={`font-poppins font-bold text-[16px] ${showCostosVariables ? 'text-white' : 'text-white/65'}`}>
                  Costos adicionales según consumo
                </p>
                <p className="font-lato text-white/35 text-[13px] mt-0.5">Plantillas de WhatsApp (Meta) · Consumo de IA</p>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                style={{ color: showCostosVariables ? '#60a5fa' : 'rgba(255,255,255,.3)', transform: showCostosVariables ? 'rotate(90deg)' : undefined }} />
            </button>

            {showCostosVariables && (
              <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                <div className="pt-4 space-y-5">

                  {/* Plantillas Meta */}
                  <div>
                    <p className="font-lato text-white/55 text-[15px] leading-relaxed mb-3">
                      <strong className="text-white/80">Plantillas de WhatsApp (Meta).</strong> Cada mensaje enviado fuera de la ventana de 24 horas, como recordatorios, campañas y seguimientos, lo cobra Meta directamente.{' '}
                      <strong className="text-white/80">No es un cobro de Sixteam.pro.</strong> Chile tiene tarifa propia dentro del listado de Meta.
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{ background: SP_BG, border: `1px solid ${SP_BORDER}` }}>
                        <span className="font-poppins font-semibold text-white/90 text-[13px]">🇨🇱 Chile</span>
                        <span className="font-lato text-white/45 text-[12px]">Marketing</span>
                        <span className="font-poppins font-bold text-[13px]" style={{ color: SP }}>USD 0.0933</span>
                        <span className="font-lato text-white/30 text-[11px]">|</span>
                        <span className="font-lato text-white/45 text-[12px]">Utility</span>
                        <span className="font-poppins font-bold text-[13px]" style={{ color: SP }}>USD 0.0210</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                        <span className="font-lato text-white/40 text-[12px]">Service (entrante)</span>
                        <span className="font-poppins font-bold text-[#00bfa5] text-[13px]">GRATIS</span>
                      </div>
                    </div>

                    <button onClick={() => setShowMetaTable(v => !v)}
                      className="flex items-center gap-1.5 mb-2 transition-colors duration-200"
                      style={{ color: showMetaTable ? '#60a5fa' : 'rgba(255,255,255,.3)' }}>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${showMetaTable ? 'rotate-90' : ''}`} />
                      <span className="font-lato text-[13px]">{showMetaTable ? 'Ocultar' : 'Ver'} tarifas por país, fuente Meta</span>
                    </button>

                    {showMetaTable && (
                      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(96,165,250,.2)' }}>
                        <div className="grid grid-cols-4 px-3 py-2 text-[11px] font-poppins font-semibold uppercase tracking-wider text-white/30"
                          style={{ background: 'rgba(96,165,250,.06)', borderBottom: '1px solid rgba(96,165,250,.15)' }}>
                          <span>País / Mercado</span>
                          <span className="text-right">Marketing</span>
                          <span className="text-right">Utility</span>
                          <span className="text-right">Service</span>
                        </div>
                        <div className="divide-y max-h-72 overflow-y-auto" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
                          {[
                            ['🇨🇱 Chile','0.0933','0.0210'],['🇦🇷 Argentina','0.0649','0.0273'],['🇵🇪 Peru','0.0738','0.0210'],
                            ['🇨🇴 Colombia','0.0131','0.0008'],['🇲🇽 Mexico','0.0320','0.0089'],['🇧🇷 Brazil','0.0656','0.0071'],
                            ['🇪🇸 Spain','0.0646','0.0210'],['🇺🇸 North America','0.0263','0.0036'],['🇬🇧 United Kingdom','0.0555','0.0231'],
                            ['🇫🇷 France','0.0902','0.0315'],['🇩🇪 Germany','0.1433','0.0578'],['🇮🇹 Italy','0.0726','0.0315'],
                            ['🇳🇱 Netherlands','0.1677','0.0525'],['🇮🇳 India','0.0124','0.0015'],['🇮🇩 Indonesia','0.0432','0.0263'],
                            ['🇹🇷 Turkey','0.0114','0.0056'],['🇷🇺 Russia','0.0842','0.0420'],['🇸🇦 Saudi Arabia','0.0478','0.0112'],
                            ['🇦🇪 United Arab Emirates','0.0524','0.0165'],['🇿🇦 South Africa','0.0398','0.0080'],['🇳🇬 Nigeria','0.0542','0.0070'],
                            ['🌎 Rest of Latin America','0.0777','0.0119'],['🌏 Rest of Asia Pacific','0.0769','0.0119'],
                            ['🌍 Rest of Western Europe','0.0622','0.0180'],['🌍 Rest of C. & E. Europe','0.0903','0.0223'],
                            ['🌍 Rest of Middle East','0.0358','0.0096'],['🌍 Rest of Africa','0.0236','0.0042'],['🌐 Other','0.0634','0.0081'],
                          ].map(([market, marketing, utility], i) => {
                            const esChile = market.includes('Chile');
                            return (
                              <div key={i} className="grid grid-cols-4 px-3 py-2 items-center"
                                style={{ background: esChile ? SP_BG : i % 2 === 0 ? 'rgba(255,255,255,.015)' : 'transparent' }}>
                                <span className={`font-lato text-[13px] ${esChile ? 'text-white/90 font-semibold' : 'text-white/60'}`}>{market}</span>
                                <span className="font-poppins font-semibold text-[13px] text-right"
                                  style={{ color: esChile ? SP : 'rgba(255,255,255,.55)' }}>{marketing}</span>
                                <span className="font-poppins font-semibold text-[13px] text-right"
                                  style={{ color: esChile ? SP : 'rgba(255,255,255,.55)' }}>{utility}</span>
                                <span className="font-poppins font-bold text-[12px] text-right text-[#00bfa5]">FREE</span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="px-3 py-2 text-[11px] font-lato text-white/25 text-center"
                          style={{ borderTop: '1px solid rgba(96,165,250,.1)', background: 'rgba(96,165,250,.03)' }}>
                          Fuente: Meta for Developers, WhatsApp Business Platform Pricing · Valores en USD por número destinatario
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Consumo IA */}
                  <div>
                    <p className="font-lato text-white/55 text-[15px] leading-relaxed mb-3">
                      <strong className="text-white/80">Consumo de IA.</strong> Se cobra por mensaje procesado por el asistente y se factura mes vencido sobre el consumo real.
                    </p>

                    <div className="rounded-xl overflow-hidden transition-all duration-300"
                      style={{ border: showCalcIA ? `1px solid ${SP_BORDER}` : '1px solid rgba(255,255,255,.07)' }}>
                      <button onClick={() => setShowCalcIA(v => !v)}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-left"
                        style={{ background: showCalcIA ? SP_BG : 'transparent' }}>
                        <Bot className="w-3.5 h-3.5 flex-shrink-0" style={{ color: SP }} />
                        <span className="font-lato text-[14px] flex-1" style={{ color: showCalcIA ? SP : 'rgba(255,255,255,.5)' }}>
                          Calculadora de consumo de IA
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 flex-shrink-0"
                          style={{ color: SP, transform: showCalcIA ? 'rotate(90deg)' : undefined }} />
                      </button>

                      {showCalcIA && (
                        <div className="px-4 pb-4 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                          <div className="pt-3 space-y-3">
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                              style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: SP }} />
                              <span className="font-lato text-white/50 text-[13px]">Valor IA por mensaje</span>
                              <span className="font-poppins font-black ml-auto text-[13px]" style={{ color: SP }}>USD 0.02</span>
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="font-lato text-white/35 text-[12px]">Mensajes promedio por conversación</span>
                                <span className="font-poppins font-bold text-white text-[13px]">{mensajesConv}</span>
                              </div>
                              <input type="range" min={2} max={20} step={1}
                                value={mensajesConv} onChange={e => setMensajesConv(Number(e.target.value))} className="w-full" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="font-lato text-white/35 text-[12px]">Conversaciones nuevas por mes</span>
                                <span className="font-poppins font-bold text-white text-[13px]">{convsMes}</span>
                              </div>
                              <input type="range" min={50} max={1500} step={25}
                                value={convsMes} onChange={e => setConvsMes(Number(e.target.value))} className="w-full" />
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: SP_BORDER }}>
                              <div>
                                <span className="font-lato text-white/40 text-[12px]">Consumo estimado</span>
                                <p className="font-lato text-white/25 text-[11px] mt-0.5">USD 0.02 × {mensajesConv} msg × {convsMes} conv</p>
                              </div>
                              <div className="text-right">
                                <span className="font-poppins font-bold text-[15px]" style={{ color: SP }}>≈ USD {consumoIAUSD}/mes</span>
                                <p className="font-lato text-white/25 text-[11px] mt-0.5">≈ CLP {clp(Number(consumoIAUSD) * TC_CLP)}</p>
                              </div>
                            </div>
                            <p className="font-lato text-white/25 text-[11px] leading-relaxed">
                              Estimación referencial sobre el volumen de conversaciones que atienda el asistente. Se factura en USD sobre el consumo real del mes.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

        </section>

        {/* ── LOGOS ── */}
        <div className="mt-16">
          <LogoCarousel />
        </div>

        {/* ─ 07 TÉRMINOS ─ */}
        <section id="terminos" ref={s7.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s7.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>07 · Términos y condiciones</TagLabel>
          <SectionTitle>Todo lo que debes saber antes de empezar</SectionTitle>
          <Rule />

          <div className="space-y-3">
            {TERMINOS.map((item, i) => {
              const Icon = item.icon;
              const open = openTerms.has(i);
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${SP_BORDER}` : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => toggleTerm(i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? SP_BG : 'rgba(255,255,255,.05)' }}>
                      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: open ? SP : 'rgba(255,255,255,.4)' }} />
                    </div>
                    <span className={`flex-1 font-poppins font-semibold text-[16px] ${open ? 'text-white' : 'text-white/75'}`}>{item.titulo}</span>
                    <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-90' : ''}`}
                      style={{ color: open ? SP : 'rgba(255,255,255,.3)' }} />
                  </button>
                  {open && (
                    <div className="px-4 sm:px-5 pb-5 pl-[52px] sm:pl-[60px] border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <p className="font-lato text-white/55 text-[15px] leading-relaxed pt-4">{item.desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Cierre */}
          <div className="mt-8 rounded-2xl p-5 sm:p-6 relative overflow-hidden"
            style={{ background: `linear-gradient(120deg, rgba(255,138,60,.08), rgba(168,85,247,.06))`, border: `1px solid ${SP_BORDER}` }}>
            <Gift className="w-6 h-6 mb-3" style={{ color: SP }} />
            <p className="font-poppins font-semibold text-white/85 text-[18px] sm:text-[20px] leading-relaxed mb-2">
              El momento juega a favor
            </p>
            <p className="font-lato text-white/55 text-[15.5px] leading-relaxed">
              Arrancando ahora, la base de datos queda construida antes de Fiestas Patrias y el sistema llega completo a la temporada de verano, que es el pico del año. Cada mes que pasa sin capturar visitantes es un mes de clientes que ya pagaron por entrar y que después habrá que volver a comprar con pauta.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 100%, rgba(255,138,60,.06), transparent 70%)` }} />
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

export default SensorialParkProposal;
