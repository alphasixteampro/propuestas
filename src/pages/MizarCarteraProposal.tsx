import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap,
  AlertCircle, Info, Calendar, MapPin,
  Users, Shield, Lock, BellRing, MessageSquare, ClipboardList,
  FileSpreadsheet, Stamp, Layers, Workflow,
  Wallet, Receipt, Calculator, FileSearch, TriangleAlert, TrendingUp,
  Landmark, HandCoins, Scale, Gamepad2, UserPlus, Puzzle, ArrowRight,
  MousePointerClick, Monitor, Search, ShieldCheck,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Mizar Diseño y Construcción · Mi Lote',
  tagline: 'Cartera, recaudo y socios',
  sector: 'Diseño y construcción · Venta de inmuebles y lotes a cuotas',
  fecha: 'Septiembre 2026',
  lugar: 'Bucaramanga y Cúcuta',
  objetivo: 'Módulo de Cartera y Recaudo: la pieza que completa la Plataforma Mizar. Compras ya controla el dinero que sale; cartera controla el que entra, desde la promesa de compraventa hasta el estado de cuenta, la mora, el reparto entre socios y el flujo de caja del grupo.',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  destinatarios: 'Ing. Claudia Villamizar · José Luis',
};

const DEMO_PATH = '/mizar-cartera/demo';

const MIZAR_GOLD = '#c9a443';

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
    titulo: 'Cada pago se digita dos veces, a mano',
    desc: 'Jennifer anota el pago en el libro diario de dineros recibidos, que ya pasa de 1.400 filas desde 2024, y después lo vuelve a escribir en el control de cada proyecto. En Cúcuta, José Luis y Yurley llevan otro Excel y un Drive aparte. Tres lugares para el mismo peso.',
    icon: FileSpreadsheet, tint: 'amber',
  },
  {
    titulo: 'La mora casi nunca se cobra',
    desc: 'Calcular intereses a mano es dispendioso, así que muchas veces no se hace. Y cuando no se cobra, el cliente paga cuando quiere. Los pagos parciales y los abonos extra tampoco se separan en capital e interés.',
    icon: Calculator, tint: 'red',
  },
  {
    titulo: 'El estado de cuenta se arma pestaña por pestaña',
    desc: 'Para mostrarle a un cliente cuánto debe hay que reconstruir recibos, fechas y formas de pago. Los soportes viven en carpetas físicas, y la única prueba ante un reclamo es un cuadro de Excel.',
    icon: FileSearch, tint: 'blue',
  },
  {
    titulo: 'No hay una foto al día de cuánto entra y cuánto le toca a cada socio',
    desc: 'El consolidado del grupo y los informes a socios se arman con fórmulas escritas a mano, con porcentajes que cambian en el tiempo, como en Miravista, que pasó de tres socios a dos. Sin esa foto, decidir si meterse en otro proyecto es una apuesta.',
    icon: Users, tint: 'purple',
  },
];

// ─── BENEFICIOS ──────────────────────────────────────────────────────────────

const BENEFICIOS = [
  {
    icon: Wallet, color: MIZAR_GOLD, colorAlpha: 'rgba(201,164,67,.08)', colorBorder: 'rgba(201,164,67,.22)',
    titulo: 'Un solo registro para cada peso',
    desc: 'El pago se digita una vez y desde ahí alimenta el estado de cuenta, la lista de morosos, el informe a socios y el flujo de caja. Se acaba la doble digitación y con ella los descuadres entre archivos.',
  },
  {
    icon: Search, color: '#38bdf8', colorAlpha: 'rgba(56,189,248,.08)', colorBorder: 'rgba(56,189,248,.22)',
    titulo: 'Estado de cuenta en segundos',
    desc: 'Se digita la cédula y aparece todo: el inmueble, cada cuota, cada pago con su recibo y su soporte, lo que falta, el interés y la mora por separado. Listo para enviarlo por WhatsApp o correo en PDF.',
  },
  {
    icon: Calculator, color: '#f87171', colorAlpha: 'rgba(248,113,113,.08)', colorBorder: 'rgba(248,113,113,.22)',
    titulo: 'La mora se calcula sola',
    desc: 'Con la tasa que Mizar defina, el sistema liquida el interés de mora sobre lo que no se pagó a tiempo. Cuando el cliente llega a pagar, la respuesta ya está: "es un millón más tanto de interés". En Cúcuta, sin mora, como dice su contrato.',
  },
  {
    icon: HandCoins, color: '#a78bfa', colorAlpha: 'rgba(167,139,250,.08)', colorBorder: 'rgba(167,139,250,.22)',
    titulo: 'Abonos a capital con cálculo financiero',
    desc: 'Si un cliente paga de más, el sobrante va a capital y el plan se recalcula: termina antes o la cuota baja. Los acuerdos de pago con clientes atrasados usan la misma calculadora.',
  },
  {
    icon: MessageSquare, color: '#25D366', colorAlpha: 'rgba(37,211,102,.08)', colorBorder: 'rgba(37,211,102,.22)',
    titulo: 'El cliente reporta su pago por WhatsApp',
    desc: 'Monto y comprobante, desde el mismo chat. Llega a la bandeja de tesorería, que lo confirma contra el banco. Si la referencia ya se usó, el sistema lo bloquea. Es la misma tecnología que ya funciona en compras.',
  },
  {
    icon: BellRing, color: '#f59e0b', colorAlpha: 'rgba(245,158,11,.08)', colorBorder: 'rgba(245,158,11,.22)',
    titulo: 'Cobranza que no depende de la memoria',
    desc: 'Los recordatorios salen solos según la fecha de corte de cada cliente. Al buen pagador le basta un mensaje; al que viene atrasado se le asigna una llamada. Nadie tiene que acordarse de a quién escribirle.',
  },
  {
    icon: Users, color: '#00bfa5', colorAlpha: 'rgba(0,191,165,.08)', colorBorder: 'rgba(0,191,165,.22)',
    titulo: 'Cada socio recibe su informe sencillo',
    desc: 'De este proyecto se recogió tanto, se gastó tanto, queda tanto y esto es lo suyo. Con porcentajes por proyecto, por cliente y con fecha de vigencia, sin fórmulas escritas a mano.',
  },
  {
    icon: TrendingUp, color: '#34d399', colorAlpha: 'rgba(52,211,153,.08)', colorBorder: 'rgba(52,211,153,.22)',
    titulo: 'El flujo de caja real del grupo',
    desc: 'Mes a mes, cuánto estaba programado, cuánto se recogió y cuánto se gastó, cruzado con los egresos de compras y caja menor. La respuesta a la pregunta de fondo: ¿podemos meternos en otro proyecto?',
  },
];

// ─── QUÉ INCLUYE ─────────────────────────────────────────────────────────────

const MODULOS: { num: string; nombre: string; icon: React.ElementType; color: string; colorAlpha: string; colorBorder: string; descripcion: string; items: string[] }[] = [
  {
    num: '01',
    nombre: 'Clientes, inmuebles y planes de pago',
    icon: UserPlus,
    color: MIZAR_GOLD,
    colorAlpha: 'rgba(201,164,67,.10)',
    colorBorder: 'rgba(201,164,67,.28)',
    descripcion: 'La venta entra una sola vez, desde la promesa de compraventa, con su plan de pagos completo.',
    items: [
      'Alta del cliente con nombre, cédula, contacto, proyecto, inmueble, valor y cuota inicial o separación',
      'Plan de pagos tal como está en la promesa, con capital e interés separados por cuota',
      'Fecha de corte propia de cada cliente: el 5, el último día del mes u otra',
      'Planes distintos por sede: cuota con interés de financiación en Bucaramanga, cuota fija en Cúcuta',
      'Marca del cliente como de la sociedad, solo de Mizar o solo del otro socio',
      'Desistimientos y reventa del inmueble, con el historial del comprador anterior',
      'Carga inicial de los Excel actuales de Bucaramanga y Cúcuta, depurados con el equipo',
    ],
  },
  {
    num: '02',
    nombre: 'Registro de pagos y recibos',
    icon: Receipt,
    color: '#38bdf8',
    colorAlpha: 'rgba(56,189,248,.10)',
    colorBorder: 'rgba(56,189,248,.28)',
    descripcion: 'El reemplazo del libro diario de dineros recibidos, con el recibo y el soporte pegados a cada pago.',
    items: [
      'Registro diario de pagos, incluidos los parciales, en efectivo, transferencia o consignación',
      'Cuenta bancaria por donde entró el dinero: Bancolombia Mizar, Ictinos, Miraflor y las que se sumen',
      'Recibo con consecutivo generado por el sistema, que reemplaza el recibo físico',
      'Soporte escaneado o foto del comprobante adjunto a cada pago',
      'Orden fijo de aplicación de cada pago: primero mora, luego interés y luego capital',
      'Bloqueo de pagos con una referencia bancaria que ya se usó',
      'Bandeja de pagos por identificar para las consignaciones que llegan sin cliente',
    ],
  },
  {
    num: '03',
    nombre: 'Motor financiero: intereses, mora y abonos',
    icon: Calculator,
    color: '#f87171',
    colorAlpha: 'rgba(248,113,113,.10)',
    colorBorder: 'rgba(248,113,113,.28)',
    descripcion: 'El "cálculo financiero" que se pidió en la reunión: la mora, el interés y los abonos se liquidan solos, con las reglas de cada sede.',
    items: [
      'Tasa de interés de mora configurable por proyecto, con días de gracia',
      'Capital, interés pactado e interés de mora separados en cada cuota',
      'Abonos extraordinarios a capital, eligiendo reducir el plazo o el valor de la cuota',
      'Acuerdos de pago que generan un plan nuevo sobre lo vencido',
      'Descuentos registrados con quién los autorizó y por qué',
      'Reglas de Cúcuta: cuota fija según contrato y sin interés de mora',
      'Recálculo inmediato si Mizar cambia una tasa o una regla',
    ],
  },
  {
    num: '04',
    nombre: 'Estado de cuenta al instante',
    icon: FileSearch,
    color: '#a78bfa',
    colorAlpha: 'rgba(167,139,250,.10)',
    colorBorder: 'rgba(167,139,250,.28)',
    descripcion: 'Se digita la cédula y sale el estado de cuenta completo, listo para enviar. Adiós a las pestañas armadas a mano.',
    items: [
      'Búsqueda por cédula o por nombre',
      'Datos del cliente y del inmueble, con todas las cuotas y todos los pagos',
      'Lo pagado, lo que falta, el interés y la mora, cada uno por separado',
      'Sello de estado: al día o en mora, calculado a la fecha',
      'Pagos de la administración anterior de Cúcuta (antes de junio de 2025) mostrados aparte',
      'Descarga en PDF con la nota de 15 días para reportar diferencias',
      'Envío directo al cliente por WhatsApp o correo',
    ],
  },
  {
    num: '05',
    nombre: 'Morosos, alertas y reglas por sede',
    icon: TriangleAlert,
    color: '#f59e0b',
    colorAlpha: 'rgba(245,158,11,.10)',
    colorBorder: 'rgba(245,158,11,.28)',
    descripcion: 'La lista de morosos a pedido, con la acción que corresponde a cada caso, y las reglas propias de Mi Lote.',
    items: [
      'Listado de morosos al momento, con filtro por sede, proyecto y días de atraso',
      'Cuotas vencidas, días de atraso, valor vencido y mora de cada cliente',
      'Alerta cuando un cliente de Cúcuta acumula tres cuotas: el sistema avisa y una persona decide',
      'Bono por referido que se libera solo cuando el referido paga su tercera cuota, y se anula si desiste',
      'Historial de gestión de cobro por cliente: mensajes, llamadas y compromisos',
      'Exportación a Excel del listado',
    ],
  },
  {
    num: '06',
    nombre: 'Reporte de pago por WhatsApp y verificación',
    icon: MessageSquare,
    color: '#25D366',
    colorAlpha: 'rgba(37,211,102,.10)',
    colorBorder: 'rgba(37,211,102,.28)',
    descripcion: 'El cliente reporta su pago desde WhatsApp y tesorería lo confirma. Reutiliza el canal y el formulario que ya se construyeron para compras.',
    items: [
      'Opción "Reportar pago" en WhatsApp: monto y comprobante en PDF o foto, sin salir del chat',
      'El reporte llega a la bandeja de tesorería, con el comprobante a la vista',
      'Alertas automáticas: referencia repetida, valor distinto a la cuota o cliente sin identificar',
      'Confirmar o rechazar con motivo; al confirmar, el pago se aplica y el recibo le llega al cliente',
      'Respuesta automática al cliente en cada paso: recibido, confirmado o rechazado',
      'La confirmación final sigue siendo de una persona contra el extracto, como exige la operación bancaria en Colombia',
    ],
  },
  {
    num: '07',
    nombre: 'Sociedades y reparto entre socios',
    icon: Scale,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.28)',
    descripcion: 'Los porcentajes de cada socio, por proyecto y por cliente, con fecha de vigencia. El informe al socio sale solo.',
    items: [
      'Socios por proyecto con su porcentaje y la fecha desde la que rige',
      'Excepciones por cliente: los que son solo de Mizar o solo del otro socio',
      'Reparto de ingresos y gastos según el porcentaje vigente en cada fecha, por ejemplo de tres socios a dos',
      'Gastos del proyecto tomados del módulo de compras y de la caja menor, sin volver a digitarlos',
      'Comisiones de venta: lo causado, lo pagado y lo pendiente',
      'Informe sencillo por socio en PDF: se recogió, se gastó, queda y le corresponde',
    ],
  },
  {
    num: '08',
    nombre: 'Flujo de caja del grupo',
    icon: TrendingUp,
    color: '#34d399',
    colorAlpha: 'rgba(52,211,153,.10)',
    colorBorder: 'rgba(52,211,153,.28)',
    descripcion: 'El consolidado del grupo empresarial, al día y sin fórmulas: lo programado frente a lo que realmente entró y salió.',
    items: [
      'Programado frente a recaudado, mes a mes, por proyecto y consolidado',
      'Egresos del mes tomados de compras y caja menor',
      'Flujo del mes y caja proyectada para los meses siguientes',
      'Saldo por cuenta bancaria y por sede',
      'Porcentaje de recaudo sobre lo programado, que se vuelve la línea base para medir mejoras',
      'Exportación a Excel para las juntas de socios',
    ],
  },
  {
    num: '09',
    nombre: 'Recordatorios y cobranza automática',
    icon: BellRing,
    color: '#38bdf8',
    colorAlpha: 'rgba(56,189,248,.10)',
    colorBorder: 'rgba(56,189,248,.28)',
    descripcion: 'El primer recordatorio sale solo. El equipo solo interviene donde de verdad hace falta.',
    items: [
      'Recordatorios por WhatsApp según la fecha de corte de cada cliente: antes, el día del corte y después',
      'Reglas según el comportamiento: al buen pagador un mensaje, al atrasado una llamada asignada',
      'Mensajes con el nombre, el valor y la fecha de cada cliente, aprobados por Meta',
      'Horarios y frecuencia configurables para cumplir la regulación de cobranza',
      'Aviso interno cuando un cliente entra en mora o incumple un acuerdo',
      'Registro de cada mensaje enviado dentro del historial del cliente',
    ],
  },
];

// ─── PLAN DE TRABAJO ─────────────────────────────────────────────────────────

const FASES = [
  {
    num: '01',
    semanas: 'Semanas 1 y 2',
    titulo: 'Reglas del dinero y base de clientes',
    color: MIZAR_GOLD,
    colorAlpha: 'rgba(201,164,67,.10)',
    colorBorder: 'rgba(201,164,67,.28)',
    desc: 'Cerramos por escrito las reglas de dinero y cargamos la base real de clientes, que es el cimiento de todo lo demás.',
    hitos: [
      'Sesión con Claudia, José Luis y su contador para fijar la tasa de mora, el orden de aplicación, los abonos, los acuerdos y la regla de las tres cuotas',
      'Catálogo de sedes, proyectos, inmuebles, cuentas bancarias y socios',
      'Depuración de los Excel de Bucaramanga y Cúcuta, fila por fila, con Jennifer y Yurley',
      'Alta de clientes y planes de pago funcionando en la plataforma',
    ],
    entregable: 'Clientes y planes cargados en la plataforma, revisables por el equipo',
  },
  {
    num: '02',
    semanas: 'Semanas 3 y 4',
    titulo: 'Pagos, motor financiero y estado de cuenta',
    color: '#f87171',
    colorAlpha: 'rgba(248,113,113,.10)',
    colorBorder: 'rgba(248,113,113,.28)',
    desc: 'Construimos el corazón del módulo: el registro de pagos y el cálculo de capital, interés y mora.',
    hitos: [
      'Registro de pagos con recibo consecutivo y soporte adjunto',
      'Motor de mora, interés y capital, con abonos extra y acuerdos de pago',
      'Estado de cuenta por cédula, en pantalla y en PDF',
      'Saldos de la administración anterior de Cúcuta cargados y mostrados aparte',
    ],
    entregable: 'Jennifer y Yurley registran pagos reales en la plataforma, en paralelo con el Excel',
  },
  {
    num: '03',
    semanas: 'Semanas 5 y 6',
    titulo: 'WhatsApp, verificación y morosos',
    color: '#25D366',
    colorAlpha: 'rgba(37,211,102,.10)',
    colorBorder: 'rgba(37,211,102,.28)',
    desc: 'Abrimos el canal del cliente y cerramos el ciclo del pago, desde que lo reporta hasta que recibe su recibo.',
    hitos: [
      'Opción "Reportar pago" en WhatsApp, sobre el canal que ya usa compras',
      'Bandeja de tesorería con alertas de referencia repetida y valores que no cuadran',
      'Bandeja de pagos por identificar',
      'Listado de morosos, alerta de tres cuotas y bono por referido',
    ],
    entregable: 'Ciclo completo del pago, desde el reporte del cliente hasta el recibo',
  },
  {
    num: '04',
    semanas: 'Semanas 7 y 8',
    titulo: 'Socios, comisiones y flujo de caja',
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.28)',
    desc: 'Llevamos la cartera al nivel de la gerencia: el reparto entre socios y la foto del dinero del grupo.',
    hitos: [
      'Socios con porcentajes por proyecto y por cliente, con fecha de vigencia',
      'Informe sencillo por socio, con gastos tomados de compras y caja menor',
      'Comisiones de venta causadas, pagadas y pendientes',
      'Flujo de caja programado frente a ejecutado, por proyecto y consolidado',
    ],
    entregable: 'Primer informe a socios y primer flujo del grupo generados por la plataforma',
  },
  {
    num: '05',
    semanas: 'Semanas 9 y 10',
    titulo: 'Cobranza automática y puesta en marcha',
    color: '#38bdf8',
    colorAlpha: 'rgba(56,189,248,.10)',
    colorBorder: 'rgba(56,189,248,.28)',
    desc: 'Activamos los recordatorios, capacitamos a cada rol y retiramos el Excel cuando los números cuadren.',
    hitos: [
      'Recordatorios automáticos por fecha de corte y reglas según el comportamiento del cliente',
      'Capacitación por rol: cartera, tesorería, gerencia y responsable de Cúcuta',
      'Dos semanas de acompañamiento con el Excel en paralelo, hasta confirmar que todo cuadra',
      'Retiro de los archivos de control actuales',
    ],
    entregable: 'Módulo de cartera en producción y los Excel de control retirados',
  },
];

// ─── INSUMOS ─────────────────────────────────────────────────────────────────

const INSUMOS = [
  'Los Excel de Bucaramanga y de Cúcuta, sin datos reales para el diseño y con datos reales para la carga',
  'Una promesa de compraventa de ejemplo, con su tabla de capital e interés',
  'Un contrato de Mi Lote (formato MF) de ejemplo',
  'La lista de proyectos con sus socios, porcentajes y fechas de vigencia',
  'La tasa de mora y sus condiciones, validadas por el contador o el abogado de Mizar',
  'El número aproximado de clientes activos y de cuentas bancarias por sede',
];

// ─── FUERA DE ALCANCE ────────────────────────────────────────────────────────

const FUERA = [
  {
    titulo: 'Gamificación y campañas de recompensa',
    desc: 'Rachas de pago, anillo de progreso y campañas como la de la prima se proponen como una fase siguiente, cuando la cartera esté operando y exista una línea base del recaudo para medir si funcionan. Todo lo que construye esta propuesta es la base que esas campañas necesitan.',
    icon: Gamepad2, tint: 'purple',
  },
  {
    titulo: 'Conexión directa con los bancos',
    desc: 'En Colombia los bancos no ofrecen una conexión directa para confirmar pagos, así que la confirmación sigue siendo de una persona. Sixteam investiga las alertas de Bancolombia por correo o SMS y el servicio de avisos que mencionó José Luis, y presenta el resultado por separado.',
    icon: Landmark, tint: 'blue',
  },
  {
    titulo: 'Definir la tasa de mora y las decisiones legales',
    desc: 'La tasa la fija Mizar con su contador o su abogado, dentro del tope legal, y debe estar pactada en los contratos. La recuperación de un lote en Cúcuta la decide una persona según el contrato. La plataforma aplica las reglas y alerta; no las define.',
    icon: Scale, tint: 'red',
  },
  {
    titulo: 'Sistema contable y cuenta de Miraflor',
    desc: 'Helisa sigue siendo el sistema contable y la plataforma le entrega la información exportable. La titularidad de la cuenta de Miraflor es un tema que Mizar resuelve con su asesor; la plataforma registra lo que entra por ella.',
    icon: FileText, tint: 'amber',
  },
];

// ─── TÉRMINOS ────────────────────────────────────────────────────────────────

const TERMINOS: { titulo: string; desc: string; icon: React.ElementType }[] = [
  {
    titulo: 'Cómo aceptar esta propuesta',
    desc: 'Mizar confirma su aceptación vía WhatsApp, correo electrónico o de forma verbal. Con esa confirmación se procede con la firma del contrato y el primer pago.',
    icon: CheckCircle,
  },
  {
    titulo: 'Forma de pago del desarrollo',
    desc: 'Dos cuotas iguales de $3.000.000 COP: la primera al iniciar el proyecto y la segunda contra la entrega del módulo en producción.',
    icon: FileText,
  },
  {
    titulo: 'Pago mensual',
    desc: 'El módulo de cartera suma $150.000 COP al valor mensual que Mizar ya paga por la plataforma, que pasa de $350.000 a $500.000. Se paga mes a mes de forma anticipada desde que el módulo entra en producción y queda dentro del mismo contrato anual de uso.',
    icon: Clock,
  },
  {
    titulo: 'Tarifas de mensajes de Meta',
    desc: 'Los recordatorios y avisos por WhatsApp tienen una tarifa por mensaje que cobra Meta. No está incluida en el valor mensual y la asume Mizar al costo, sin margen de Sixteam. El consumo depende del número de clientes y de las reglas de recordatorio que se activen.',
    icon: MessageSquare,
  },
  {
    titulo: 'Cuándo arranca',
    desc: 'El desarrollo arranca cuando el módulo de compras esté operando con el equipo, para no cruzar las dos puestas en marcha. La propuesta reutiliza lo ya construido: usuarios, roles, servidor, respaldos y canal de WhatsApp.',
    icon: Calendar,
  },
  {
    titulo: 'Duración del desarrollo',
    desc: '10 semanas desde el inicio del proyecto, en cinco fases con un entregable revisable al cierre de cada una.',
    icon: Zap,
  },
  {
    titulo: 'Datos personales y cobranza',
    desc: 'Mizar es responsable de contar con la autorización de sus clientes para tratar sus datos y contactarlos por WhatsApp. Los horarios y la frecuencia de los mensajes de cobro se configuran según la regulación de cobranza vigente, que Mizar valida con su asesor.',
    icon: ShieldCheck,
  },
  {
    titulo: 'SLA y atención de incidencias',
    desc: 'Tiempo máximo de respuesta de 4 horas ante cualquier incidencia, en días y horarios hábiles, con comunicación directa vía WhatsApp o correo.',
    icon: Shield,
  },
  {
    titulo: 'Modificaciones al alcance',
    desc: 'Todo requerimiento funcional no contemplado en esta propuesta se maneja mediante cotización independiente y no modifica el valor mensual acordado.',
    icon: AlertCircle,
  },
  {
    titulo: 'Propiedad y confidencialidad',
    desc: 'Mizar es propietario de todos los datos de sus clientes, pagos y socios cargados en la plataforma. Sixteam mantiene la confidencialidad total de esa información, tanto durante la vigencia del contrato como después de su terminación.',
    icon: Lock,
  },
  {
    titulo: 'Responsables del proyecto',
    desc: 'Mizar designa un responsable en Bucaramanga y uno en Cúcuta para las sesiones de validación al cierre de cada fase. La participación de Jennifer y Yurley en la depuración de los Excel es determinante para que los saldos cuadren desde el primer día.',
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
  { id: 'demo',       label: 'Demo'        },
  { id: 'incluye',    label: 'Qué incluye' },
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
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: `linear-gradient(90deg,${MIZAR_GOLD},#00bfa5)` }} />
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const MizarCarteraProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [moduloActivo, setModuloActivo] = useState<number | null>(null);
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

  const s1 = useVisible(); const s2 = useVisible(); const s3 = useVisible(); const s8 = useVisible();
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
            style={{ background: 'radial-gradient(circle, rgba(201,164,67,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
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
          @media (prefers-reduced-motion: reduce){.cover-ring-1,.cover-ring-2,.cover-glow,.cover-float{animation:none}}
        `}</style>

        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta de trabajo y cotización · Nuevo módulo de la plataforma</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${MIZAR_GOLD}, #8f7226)` }}>
                  <Wallet className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">Mizar · Mi Lote</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(201,164,67,.12)', border: '1px solid rgba(201,164,67,.28)', color: MIZAR_GOLD }}>
                  Cartera y recaudo
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 4.8rem)' }}>
                Propuesta<br />
                <span style={{ background: `linear-gradient(90deg,${MIZAR_GOLD},#00bfa5)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Comercial
                </span>
              </h1>
              <p className="font-lato text-white/55 text-xl leading-relaxed mb-5">{META.objetivo}</p>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Link to={DEMO_PATH}
                  className="no-print inline-flex items-center gap-2 px-5 py-3 rounded-full font-poppins font-semibold text-[15px] text-white transition-transform hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(90deg, #1d70a2, #00bfa5)', boxShadow: '0 4px 20px rgba(0,191,165,.25)' }}>
                  <MousePointerClick className="w-4 h-4" /> Probar la demo
                </Link>
                <div className="inline-flex flex-wrap items-center gap-1.5 px-4 py-2 rounded-xl"
                  style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)' }}>
                  <span className="font-poppins font-bold text-white/80 text-[15px] sm:text-[18px]">Process</span>
                  <span className="font-poppins font-bold text-[#1d70a2] text-[15px] sm:text-[18px]">+</span>
                  <span className="font-poppins font-bold text-[#1d70a2] text-[15px] sm:text-[18px]">Technology</span>
                  <span className="font-poppins font-bold text-[#00bfa5] text-[15px] sm:text-[18px]">+</span>
                  <span className="font-poppins font-bold text-[#00bfa5] text-[15px] sm:text-[18px]">People</span>
                  <span className="font-poppins font-bold text-white/50 text-[15px] sm:text-[18px]">=</span>
                  <span className="font-poppins font-black text-[#00bfa5] text-[15px] sm:text-[18px]">Growth</span>
                </div>
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
                  {['1. Resumen ejecutivo','2. Resultados que obtendrán','3. Pruebe la demo','4. Qué incluye el módulo','5. Plan de trabajo','6. Alcance y límites','7. Propuesta de inversión','8. Vigencia y términos'].map((item, i) => (
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
                  style={{ background: 'radial-gradient(circle, rgba(201,164,67,.08) 0%, rgba(0,191,165,.04) 50%, transparent 70%)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full" style={{ border: '1px solid rgba(201,164,67,.12)' }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(0,191,165,.15)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
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
                    <p className="font-lato text-[13px] uppercase tracking-[0.2em] mt-1" style={{ color: MIZAR_GOLD }}>Bucaramanga · Mi Lote Cúcuta</p>
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
              <span className="font-lato text-[11px] uppercase tracking-[0.2em]" style={{ color: MIZAR_GOLD }}>Mizar · Mi Lote</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Operación</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">Venta a cuotas, directo con Mizar</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sedes</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">Bucaramanga y Cúcuta, con reglas distintas</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Equipo involucrado</p>
                <p className="font-lato text-white/60 text-[18px]">Cartera, tesorería, gerencia, Cúcuta y socios</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Situación actual</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#f59e0b' }} />
                  <p className="font-poppins font-semibold text-[15px] text-[#f59e0b]">Cartera en varios Excel, llenados a mano</p>
                </div>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Plataforma base</p>
                <p className="font-lato text-white/60 text-[18px]">Plataforma Mizar: compras, pagos y caja menor</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Formatos base</p>
                <p className="font-lato text-white/60 text-[18px]">Dineros recibidos, flujo por proyecto e informes a socios</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              Mizar vende a cuotas y financia directamente a sus compradores, muchos de ellos en el exterior y sin estudio de crédito. Eso convierte la cartera en el asunto de caja más importante de la empresa: de nada sirve vender si el recaudo no está organizado. Hoy ese recaudo vive en varios Excel que Jennifer, Yurley y José Luis llenan a mano, pago por pago.
            </p>
            <p>
              En la reunión del 23 de septiembre la ingeniera Claudia planteó el objetivo con claridad: <strong className="text-white/90 font-semibold">saber mes a mes cuánto dinero está programado, cuánto se recogió y cuánto se puede gastar</strong>, para decidir si la empresa puede tomar más proyectos. Y para el día a día, una plataforma donde el cliente y su plan se crean una vez, los pagos se digitan una vez, la mora se calcula sola y el estado de cuenta sale al digitar la cédula.
            </p>
            <p>
              Sixteam propone construirlo como un <strong className="text-white/90 font-semibold">módulo nuevo dentro de la Plataforma Mizar</strong>, la misma donde ya viven compras, pagos de obra y caja menor. Son <strong className="text-white/90 font-semibold">nueve funcionalidades en diez semanas</strong>, con las reglas de Bucaramanga y de Cúcuta configuradas por sede, no como dos sistemas distintos.
            </p>
          </div>

          {/* La pieza que completa la plataforma */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8" style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.20)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Puzzle className="w-4 h-4 text-[#00bfa5]" /> La pieza que completa la plataforma
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] gap-3 items-stretch">
              {[
                { t: 'Compras y pagos de obra', s: 'Requisiciones, órdenes de compra, pagos y caja menor', e: 'Ya en marcha', c: '#38bdf8', bg: 'rgba(56,189,248,.08)', bd: 'rgba(56,189,248,.22)', icon: FileSpreadsheet },
                { t: 'Cartera y recaudo', s: 'Clientes, pagos, mora, estados de cuenta y socios', e: 'Esta propuesta', c: MIZAR_GOLD, bg: 'rgba(201,164,67,.10)', bd: 'rgba(201,164,67,.30)', icon: Wallet },
                { t: 'Las finanzas del grupo', s: 'Lo que entra y lo que sale, en un solo lugar y al día', e: 'El resultado', c: '#00bfa5', bg: 'rgba(0,191,165,.08)', bd: 'rgba(0,191,165,.25)', icon: TrendingUp },
              ].flatMap((b, i, arr) => {
                const Icon = b.icon;
                const card = (
                  <div key={`c${i}`} className="rounded-xl p-4" style={{ background: b.bg, border: `1px solid ${b.bd}` }}>
                    <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mb-2"
                      style={{ background: 'rgba(255,255,255,.05)', border: `1px solid ${b.bd}`, color: b.c }}>{b.e}</span>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: b.c }} />
                      <p className="font-poppins font-bold text-white/90 text-[16px] leading-tight">{b.t}</p>
                    </div>
                    <p className="font-lato text-white/50 text-[14px] leading-snug">{b.s}</p>
                  </div>
                );
                if (i === arr.length - 1) return [card];
                return [card, (
                  <div key={`s${i}`} className="hidden sm:flex items-center justify-center">
                    <span className="font-poppins font-black text-white/30 text-[22px]">{i === 0 ? '+' : '='}</span>
                  </div>
                )];
              })}
            </div>
            <p className="font-lato text-white/50 text-[15px] mt-4 leading-relaxed">
              Como usuarios, roles, servidor, respaldos y el canal de WhatsApp ya existen, este módulo cuesta menos y sale más rápido que un sistema nuevo. Y los gastos que compras ya registra alimentan directamente el informe a socios y el flujo de caja.
            </p>
          </div>

          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> Situaciones que este módulo resuelve directamente
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
              El objetivo de fondo es <strong className="text-white font-black">decidir con números reales</strong>: cuánto va a entrar, cuánto entró de verdad y cuánto queda para crecer. Para llegar ahí, cada pago tiene que <strong className="text-white font-black">escribirse una sola vez</strong> y la mora tiene que <strong className="text-white font-black">cobrarse siempre</strong>, no solo cuando alguien tiene tiempo de calcularla.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {BENEFICIOS.map((item, i) => {
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

          {/* Flujo visual */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Workflow className="w-4 h-4 text-[#00bfa5]" /> El ciclo completo dentro de la plataforma
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {[
                { n: '1', t: 'Venta y plan',        s: 'Desde la promesa de compraventa',   c: MIZAR_GOLD, bg: 'rgba(201,164,67,.08)',  bd: 'rgba(201,164,67,.22)' },
                { n: '2', t: 'Pago',                s: 'En oficina o reportado por WhatsApp', c: '#25D366',  bg: 'rgba(37,211,102,.08)',  bd: 'rgba(37,211,102,.22)' },
                { n: '3', t: 'Verificación',        s: 'Tesorería confirma contra el banco', c: '#38bdf8',  bg: 'rgba(56,189,248,.08)',  bd: 'rgba(56,189,248,.22)' },
                { n: '4', t: 'Estado de cuenta',    s: 'Mora, recibo y cobranza al día',     c: '#a78bfa',  bg: 'rgba(167,139,250,.08)', bd: 'rgba(167,139,250,.22)' },
                { n: '5', t: 'Socios y flujo',      s: 'Informe por socio y caja del grupo', c: '#00bfa5',  bg: 'rgba(0,191,165,.08)',   bd: 'rgba(0,191,165,.22)' },
              ].map((step, i) => (
                <div key={i} className="rounded-xl p-3.5" style={{ background: step.bg, border: `1px solid ${step.bd}` }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center mb-2"
                    style={{ background: 'rgba(255,255,255,.06)', border: `1px solid ${step.bd}` }}>
                    <span className="font-poppins font-black text-[12px]" style={{ color: step.c }}>{step.n}</span>
                  </div>
                  <p className="font-poppins font-bold text-white/85 text-[14px] leading-tight mb-1">{step.t}</p>
                  <p className="font-lato text-white/40 text-[12px] leading-snug">{step.s}</p>
                </div>
              ))}
            </div>
            <p className="font-lato text-white/35 text-[13px] mt-4 leading-relaxed">
              Cada paso alimenta al siguiente sin volver a digitar nada.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Doble digitación',  value: 'Eliminada',   sub: 'Cada pago se escribe una vez' },
              { label: 'Estado de cuenta',  value: 'En segundos', sub: 'Se digita la cédula y listo' },
              { label: 'Interés de mora',   value: 'Automático',  sub: 'Con la tasa que defina Mizar' },
              { label: 'Informe a socios',  value: 'Sin fórmulas', sub: 'Con el porcentaje vigente' },
            ].map((k, i) => (
              <div key={i} className="rounded-xl p-4 text-center"
                style={{ background: i < 2 ? 'rgba(201,164,67,.07)' : 'rgba(0,191,165,.06)', border: i < 2 ? '1px solid rgba(201,164,67,.20)' : '1px solid rgba(0,191,165,.18)' }}>
                <p className="font-poppins font-black text-white text-[18px] leading-tight mb-1">{k.value}</p>
                <p className="font-poppins font-semibold text-white/70 text-[13px] mb-0.5">{k.label}</p>
                <p className="font-lato text-white/35 text-[12px]">{k.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─ 03 DEMO ─ */}
        <section id="demo" ref={s8.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s8.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 · Pruebe la demo</TagLabel>
          <SectionTitle>Véalo funcionando antes de decidir</SectionTitle>
          <Rule />

          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(0,191,165,.08) 0%, rgba(3,13,26,.95) 100%)', border: '1px solid rgba(0,191,165,.28)', boxShadow: '0 4px 32px rgba(0,191,165,.10)' }}>
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-8 items-center">
              <div>
                <p className="font-lato text-white/60 text-[18px] leading-relaxed mb-5">
                  Preparamos una demo navegable del módulo, con clientes y pagos ficticios, para que el equipo lo pruebe con sus propias manos. Nada de lo que se haga ahí se guarda.
                </p>
                <ul className="space-y-2.5 mb-6">
                  {[
                    'Buscar un cliente por cédula y ver su estado de cuenta completo',
                    'Registrar un pago parcial y ver cómo se reparte entre mora, interés y capital',
                    'Confirmar un pago reportado por WhatsApp y ver cómo se bloquea una referencia repetida',
                    'Revisar los morosos y la alerta de tres cuotas de Cúcuta',
                    'Ver el informe de un socio y el flujo de caja del grupo',
                    'Cambiar la tasa de mora y ver el efecto en toda la cartera',
                  ].map((t, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
                      <span className="font-lato text-white/70 text-[16px] leading-snug">{t}</span>
                    </li>
                  ))}
                </ul>
                <Link to={DEMO_PATH}
                  className="no-print inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-poppins font-semibold text-[16px] text-white transition-transform hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(90deg, #1d70a2, #00bfa5)', boxShadow: '0 4px 20px rgba(0,191,165,.25)' }}>
                  Abrir la demo <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Mini vista previa */}
              <Link to={DEMO_PATH} className="no-print block rounded-xl overflow-hidden transition-transform hover:scale-[1.01]"
                aria-label="Abrir la demo del módulo de cartera"
                style={{ background: '#f5f8fa', border: '1px solid rgba(255,255,255,.15)', boxShadow: '0 12px 40px rgba(0,0,0,.35)' }}>
                <div className="flex">
                  <div className="w-16 sm:w-20 flex-shrink-0 p-2.5 space-y-2" style={{ background: '#0a2342' }}>
                    <div className="h-2.5 w-10 rounded" style={{ background: 'rgba(255,255,255,.7)' }} />
                    {[0, 1, 2, 3, 4].map(k => (
                      <div key={k} className="h-2 rounded" style={{ background: k === 1 ? '#d12e45' : 'rgba(255,255,255,.18)', width: k === 1 ? '90%' : '75%' }} />
                    ))}
                  </div>
                  <div className="flex-1 p-3 space-y-2.5">
                    <div className="flex items-center gap-2 rounded-md px-2 py-1.5" style={{ background: '#fff', border: '1px solid #dfe3eb' }}>
                      <Search className="w-3 h-3" style={{ color: '#5a6472' }} />
                      <span style={{ color: '#5a6472', fontSize: 10 }}>1.098.765.432</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[['Pagado', '#245645'], ['Saldo', '#2c2f36'], ['Vencido', '#9b4137'], ['Mora', '#a65b08']].map(([l, c]) => (
                        <div key={l} className="rounded-md p-1.5" style={{ background: '#fff', border: '1px solid #dfe3eb' }}>
                          <div style={{ color: '#5a6472', fontSize: 8 }}>{l}</div>
                          <div className="h-1.5 mt-1 rounded" style={{ background: c, width: '80%' }} />
                        </div>
                      ))}
                    </div>
                    <div className="rounded-md p-2 space-y-1.5" style={{ background: '#fff', border: '1px solid #dfe3eb' }}>
                      {[0, 1, 2, 3].map(k => (
                        <div key={k} className="flex items-center gap-2">
                          <div className="h-1.5 rounded flex-1" style={{ background: '#eaf0f6' }} />
                          <span className="rounded px-1.5" style={{ fontSize: 7, background: k === 0 ? '#f8e6e2' : k === 1 ? '#fff2d8' : '#e2eee8', color: k === 0 ? '#9b4137' : k === 1 ? '#a65b08' : '#245645' }}>
                            {k === 0 ? 'Vencida' : k === 1 ? 'Parcial' : 'Pagada'}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <span className="rounded-md px-2 py-1 text-white" style={{ background: '#d12e45', fontSize: 9 }}>Registrar pago</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="px-6 sm:px-8 py-3.5 flex items-center gap-2 border-t" style={{ borderColor: 'rgba(255,255,255,.06)', background: 'rgba(255,255,255,.02)' }}>
              <Monitor className="w-4 h-4 text-white/35 flex-shrink-0" />
              <p className="font-lato text-white/40 text-[14px]">
                Funciona en computador y celular. Los nombres, cédulas y valores son ficticios; los proyectos son los de Mizar.
              </p>
            </div>
          </div>
        </section>

        {/* ─ 04 QUÉ INCLUYE ─ */}
        <section id="incluye" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 · Qué incluye el módulo</TagLabel>
          <SectionTitle>9 funcionalidades · Desarrollo a la medida</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Nueve funcionalidades que cubren el ciclo completo de la cartera, desde la promesa de compraventa hasta el informe a los socios. Cada una se construye sobre los archivos y las reglas que Mizar y Mi Lote ya usan.
          </p>

          <div className="relative">
            <div className="hidden sm:block absolute left-[28px] top-10 bottom-10 w-px"
              style={{ background: 'linear-gradient(to bottom, rgba(201,164,67,.4), rgba(56,189,248,.4), rgba(248,113,113,.4), rgba(167,139,250,.4), rgba(245,158,11,.4), rgba(37,211,102,.4), rgba(0,191,165,.4), rgba(52,211,153,.4), rgba(56,189,248,.4))' }} />

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
                        <span className={`font-poppins font-bold text-[18px] ${open ? 'text-white' : 'text-white/70'}`}>{mod.nombre}</span>
                        <p className={`font-lato text-white/40 text-[15px] mt-0.5 ${open ? '' : 'line-clamp-1'}`}>{mod.descripcion}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ml-2 ${open ? 'rotate-90' : ''}`}
                        style={{ color: open ? mod.color : 'rgba(255,255,255,.3)' }} />
                    </button>

                    {open && (
                      <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                        <div className="pt-4">
                          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Funcionalidades incluidas</p>
                          <ul className="space-y-2">
                            {mod.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: mod.color }} />
                                <span className="font-lato text-white/65 text-[17px] flex-1">{item}</span>
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

          <div className="mt-6 rounded-xl p-4 flex gap-3"
            style={{ background: 'rgba(201,164,67,.06)', border: '1px solid rgba(201,164,67,.22)' }}>
            <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: MIZAR_GOLD }} />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              Todo opera bajo <strong className="text-white/80">acceso por roles</strong>: cartera digita, tesorería confirma, gerencia ve todo, Cúcuta ve lo suyo y los socios solo reciben su informe. Cada cambio queda registrado con quién lo hizo y cuándo, algo indispensable cuando hay dinero de socios y cobro de intereses.
            </p>
          </div>
        </section>

        {/* ─ 05 PLAN DE TRABAJO ─ */}
        <section id="plan" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 · Plan de trabajo</TagLabel>
          <SectionTitle>10 semanas hasta producción</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Cinco fases de dos semanas, cada una con un entregable revisable. Desde la fase 2 el equipo ya registra pagos reales en la plataforma, y el Excel solo se retira cuando los números cuadran.
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
                    <p className="font-poppins font-bold text-white text-[20px] leading-tight">{f.titulo}</p>
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

          <div className="mt-6 rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-4 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-[#00bfa5]" /> Lo que necesitamos de Mizar para arrancar
            </p>
            <ul className="space-y-2">
              {INSUMOS.map((t, j) => (
                <li key={j} className="flex items-start gap-2.5">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: MIZAR_GOLD }} />
                  <span className="font-lato text-white/65 text-[16px] leading-snug">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-xl p-4 flex gap-3"
            style={{ background: 'rgba(56,189,248,.05)', border: '1px solid rgba(56,189,248,.20)' }}>
            <Users className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#38bdf8]" />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              El cronograma asume una sesión de validación de cerca de una hora al cierre de cada fase, con Bucaramanga y Cúcuta. La depuración de los Excel en la fase 1 es la única tarea que pide más tiempo del equipo, y es la que garantiza que los saldos cuadren desde el primer día.
            </p>
          </div>
        </section>

        {/* ─ 06 ALCANCE ─ */}
        <section id="alcance" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 · Alcance y límites</TagLabel>
          <SectionTitle>Qué no está incluido en esta propuesta</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Todo lo descrito en las nueve funcionalidades entra en esta inversión. Lo siguiente queda fuera de forma deliberada, para no mezclar lo urgente con lo que conviene hacer después.
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
              <p className="font-poppins font-semibold text-white/80 text-[18px]">Un alcance cerrado, con la puerta abierta</p>
            </div>
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              Esta propuesta cubre la cartera completa: clientes y planes, pagos, mora, estados de cuenta, verificación por WhatsApp, morosos, socios, flujo de caja y recordatorios. Lo que queda por fuera se puede sumar después sobre lo ya construido, sin rehacer nada, y con datos reales para decidir si vale la pena.
            </p>
          </div>
        </section>

        {/* ─ 07 INVERSIÓN ─ */}
        <section id="inversion" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>07 · Propuesta de inversión</TagLabel>
          <SectionTitle>Una inversión que completa la plataforma.</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Dos componentes: el desarrollo del módulo, que se paga una sola vez, y lo que el módulo suma al valor mensual que Mizar ya paga por la plataforma. Todos los valores en <strong className="text-white/75">pesos colombianos (COP).</strong>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

            {/* Desarrollo */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(201,164,67,.10) 0%, rgba(3,13,26,.95) 100%)', border: '1px solid rgba(201,164,67,.35)', boxShadow: '0 4px 32px rgba(201,164,67,.15)' }}>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(201,164,67,.2)' }}>
                    <Zap className="w-4 h-4" style={{ color: MIZAR_GOLD }} />
                  </div>
                  <span className="font-poppins font-bold text-white/70 text-[15px]">Desarrollo del módulo</span>
                  <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider ml-auto"
                    style={{ background: 'rgba(201,164,67,.18)', border: '1px solid rgba(201,164,67,.35)', color: MIZAR_GOLD }}>
                    Pago único
                  </span>
                </div>
                <p className="font-poppins font-black text-white leading-none mb-1" style={{ fontSize: '2.4rem' }}>
                  $6.000.000
                </p>
                <p className="font-lato text-white/35 text-[15px] mb-5">COP · Valor único de construcción</p>
                <ul className="space-y-2">
                  {[
                    'Diseño y desarrollo de las nueve funcionalidades descritas en esta propuesta',
                    'Depuración y carga de los Excel de Bucaramanga y Cúcuta, con los saldos de la administración anterior',
                    'Configuración de proyectos, cuentas, socios y reglas de cada sede',
                    'Opción "Reportar pago" y recordatorios sobre el canal de WhatsApp existente',
                    'Capacitación por rol y dos semanas de acompañamiento con el Excel en paralelo',
                    'Período de garantía correctiva de 30 días desde la entrega',
                  ].map((p, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: MIZAR_GOLD }} />
                      <span className="font-lato text-white/60 text-[15px] leading-snug">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mensualidad */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(0,191,165,.08) 0%, rgba(3,13,26,.95) 100%)', border: '1px solid rgba(0,191,165,.28)', boxShadow: '0 4px 32px rgba(0,191,165,.10)' }}>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,191,165,.18)' }}>
                    <Shield className="w-4 h-4 text-[#00bfa5]" />
                  </div>
                  <span className="font-poppins font-bold text-white/70 text-[15px]">Uso y soporte del módulo</span>
                  <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider ml-auto"
                    style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.28)', color: '#00bfa5' }}>
                    Mensual
                  </span>
                </div>
                <p className="font-poppins font-black text-white leading-none mb-1" style={{ fontSize: '2.4rem' }}>
                  +$150.000
                </p>
                <p className="font-lato text-white/35 text-[15px] mb-5">COP mensuales · la plataforma pasa de $350.000 a $500.000</p>
                <ul className="space-y-2">
                  {[
                    'Alojamiento de la cartera y de los soportes de pago, con respaldo diario',
                    'Mantenimiento del reporte de pago y de los recordatorios por WhatsApp',
                    'Atención a inconvenientes o errores detectados en el módulo',
                    'SLA de respuesta máximo de 4 horas ante cualquier incidencia',
                    'Actualizaciones de seguridad y estabilidad',
                    'Dentro del mismo contrato anual de uso de la plataforma',
                  ].map((p, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
                      <span className="font-lato text-white/60 text-[15px] leading-snug">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Forma de pago */}
          <div className="rounded-xl p-5 sm:p-6 mb-6"
            style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.20)' }}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#00bfa5]" />
              <p className="font-poppins font-semibold text-white/80 text-[18px]">Forma de pago · Desarrollo</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { pct: '50%', momento: 'Al iniciar el proyecto', desc: 'Con la aceptación de la propuesta y la firma del contrato arranca el desarrollo, contando desde ahí las diez semanas del cronograma.', valor: '$3.000.000' },
                { pct: '50%', momento: 'Al entregar el módulo', desc: 'El saldo se paga contra la entrega del módulo en producción, con el equipo capacitado y los saldos cuadrados.', valor: '$3.000.000' },
              ].map((pago, i) => (
                <div key={i} className="rounded-xl p-4"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className="font-poppins font-black text-[#00bfa5] text-[28px] leading-none">{pago.pct}</p>
                    <p className="font-poppins font-bold text-white/50 text-[16px]">{pago.valor} COP</p>
                  </div>
                  <p className="font-poppins font-semibold text-white/80 text-[15px] mb-1">{pago.momento}</p>
                  <p className="font-lato text-white/40 text-[13px] leading-relaxed">{pago.desc}</p>
                </div>
              ))}
            </div>
            <p className="font-lato text-white/35 text-[13px] mt-4 leading-relaxed">
              Los $150.000 COP adicionales se pagan mes a mes de forma anticipada, desde que el módulo entra en producción.
            </p>
          </div>

          <div className="rounded-xl p-4 flex gap-3 mb-4"
            style={{ background: 'rgba(201,164,67,.06)', border: '1px solid rgba(201,164,67,.22)' }}>
            <Puzzle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: MIZAR_GOLD }} />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              <strong className="text-white/80">Por qué cuesta menos que un sistema nuevo:</strong> usuarios, roles, servidor, respaldos y el canal de WhatsApp ya están construidos y pagados dentro de la Plataforma Mizar. Esta inversión se concentra solo en lo que es propio de la cartera.
            </p>
          </div>

          <div className="rounded-xl p-4 flex gap-3 mb-4"
            style={{ background: 'rgba(37,211,102,.05)', border: '1px solid rgba(37,211,102,.22)' }}>
            <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#25D366' }} />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              Las <strong className="text-white/80">tarifas que Meta cobra por cada mensaje</strong> de recordatorio o aviso no están incluidas en el valor mensual y las asume Mizar al costo, sin margen de Sixteam.
            </p>
          </div>

          <div className="rounded-xl p-4 flex gap-3"
            style={{ background: 'rgba(245,158,11,.05)', border: '1px solid rgba(245,158,11,.20)' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#f59e0b]" />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              Esta propuesta cubre el alcance funcional descrito en este documento. Cualquier requerimiento adicional, como la gamificación o los avisos bancarios automáticos, se maneja mediante cotización separada y no modifica el valor mensual acordado.
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

        {/* ─ 08 VIGENCIA ─ */}
        <section id="vigencia" ref={s7.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s7.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>08 · Vigencia y términos</TagLabel>
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
                <span className="text-white/40 font-medium">Claudia Villamizar, José Luis y Juliana Parada Villamizar · Mizar Diseño y Construcción</span>
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

export default MizarCarteraProposal;
