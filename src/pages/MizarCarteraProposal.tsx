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
  Building2, BookOpen, GraduationCap,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Mizar Diseño y Construcción · Mi Lote',
  tagline: 'Sistema financiero de ingresos: cartera, recaudo, contabilidad y socios',
  sector: 'Diseño y construcción · Venta de inmuebles y lotes a cuotas · Dos empresas',
  fecha: 'Octubre 2026',
  lugar: 'Bucaramanga y Cúcuta',
  objetivo: 'Sistema financiero de ingresos para dos empresas, Mizar (Bucaramanga) y Mi Lote (Cúcuta), y para las sociedades dueñas de cada proyecto. Compras ya controla el dinero que sale; este sistema controla el que entra, desde la promesa de compraventa hasta el estado de cuenta, la mora, los bancos, la contabilidad, el reparto entre socios y el flujo de caja del grupo.',
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
    desc: 'El pago se anota en el libro diario de dineros recibidos, que ya pasa de 1.400 filas desde 2024, y después se vuelve a escribir en el control de cada proyecto. En Cúcuta se lleva otro Excel y un Drive aparte. Tres lugares para el mismo peso.',
    icon: FileSpreadsheet, tint: 'amber',
  },
  {
    titulo: 'La mora casi nunca se cobra',
    desc: 'Calcular intereses a mano es dispendioso, así que muchas veces no se hace. Y cuando no se cobra, el cliente paga cuando quiere. Los pagos parciales y los abonos extra tampoco se separan en capital e interés.',
    icon: Calculator, tint: 'red',
  },
  {
    titulo: 'Dos empresas, varias sociedades y dinero en muchos lugares',
    desc: 'El dinero entra a cuentas de distintas sociedades, a veces a una cuenta personal o en efectivo, y a veces a la cuenta de otra sociedad. Cada hoja del Excel es una sociedad distinta y no hay una vista que muestre el total ni lo que falta por trasladar.',
    icon: Landmark, tint: 'blue',
  },
  {
    titulo: 'No hay una foto al día de cuánto entra y cuánto le toca a cada socio',
    desc: 'El flujo de caja, el informe a socios y la contabilidad se arman con fórmulas escritas a mano, con porcentajes que cambian en el tiempo, como en Miravista, que pasó de tres socios a dos. Sin esa foto, decidir si meterse en otro proyecto es una apuesta.',
    icon: Users, tint: 'purple',
  },
];

// ─── BENEFICIOS ──────────────────────────────────────────────────────────────

const BENEFICIOS = [
  {
    icon: Wallet, color: MIZAR_GOLD, colorAlpha: 'rgba(201,164,67,.08)', colorBorder: 'rgba(201,164,67,.22)',
    titulo: 'Un solo registro para cada peso',
    desc: 'El pago se digita una vez y desde ahí alimenta el estado de cuenta, la lista de morosos, el libro de ingresos, el informe a socios y el flujo de caja. Se acaba la doble digitación y con ella los descuadres entre archivos.',
  },
  {
    icon: Building2, color: '#00bfa5', colorAlpha: 'rgba(0,191,165,.08)', colorBorder: 'rgba(0,191,165,.22)',
    titulo: 'Dos empresas, una sola plataforma',
    desc: 'Un selector de empresa separa Mizar (Bucaramanga) de Mi Lote (Cúcuta), cada una con sus sociedades, cuentas, consecutivos de recibo y reglas. Cada persona ve solo lo que le corresponde según su rol.',
  },
  {
    icon: Search, color: '#38bdf8', colorAlpha: 'rgba(56,189,248,.08)', colorBorder: 'rgba(56,189,248,.22)',
    titulo: 'Estado de cuenta en segundos',
    desc: 'Se digita la cédula y aparece todo: el inmueble, cada cuota, cada pago con su recibo y su soporte, lo que falta, el interés y la mora por separado. Listo para enviarlo por WhatsApp o correo en PDF.',
  },
  {
    icon: Calculator, color: '#f87171', colorAlpha: 'rgba(248,113,113,.08)', colorBorder: 'rgba(248,113,113,.22)',
    titulo: 'Intereses, mora y abonos que se calculan solos',
    desc: 'Con la tasa que Mizar firme, el sistema liquida la mora, aplica cada pago en el orden definido y recalcula el plan cuando hay un abono a capital. Mientras la tasa no esté firmada, la mora queda apagada.',
  },
  {
    icon: MessageSquare, color: '#25D366', colorAlpha: 'rgba(37,211,102,.08)', colorBorder: 'rgba(37,211,102,.22)',
    titulo: 'El cliente paga y reporta por WhatsApp',
    desc: 'Recibe un link de pago o reporta su pago con el comprobante, desde el mismo chat. Tesorería lo ve en una bandeja con semáforo, lo aprueba solo o en lote, y el recibo le llega al cliente. Si la referencia ya se usó, el sistema lo bloquea.',
  },
  {
    icon: BookOpen, color: '#a78bfa', colorAlpha: 'rgba(167,139,250,.08)', colorBorder: 'rgba(167,139,250,.22)',
    titulo: 'Bancos y contabilidad sin doble trabajo',
    desc: 'Los extractos se cargan y se concilian contra los pagos registrados. Los comprobantes contables salen de cada movimiento, y todo es exportable a Helisa para que el contador no vuelva a digitar.',
  },
  {
    icon: TrendingUp, color: '#34d399', colorAlpha: 'rgba(52,211,153,.08)', colorBorder: 'rgba(52,211,153,.22)',
    titulo: 'Socios y flujo de caja reales',
    desc: 'Cada socio recibe su informe sencillo con el porcentaje vigente. El flujo de caja del grupo, con el período del 15 al 14 como lo manejan hoy, muestra lo programado, lo recogido y lo gastado, cruzado con compras y caja menor.',
  },
  {
    icon: BellRing, color: '#f59e0b', colorAlpha: 'rgba(245,158,11,.08)', colorBorder: 'rgba(245,158,11,.22)',
    titulo: 'Cobranza que no depende de la memoria',
    desc: 'Los recordatorios salen solos según la fecha de corte de cada cliente. Al buen pagador le basta un mensaje; al que viene atrasado se le asigna una llamada. Y, si Mizar lo decide, las recompensas premian al que paga a tiempo.',
  },
];

// ─── QUÉ INCLUYE: TRES ETAPAS, NUEVE MÓDULOS, CADA UNO CON SU PRECIO ─────────

type Extra = { nombre: string; precio: number; semanas: string; descripcion: string; items: string[]; entregable: string };
type Modulo = {
  num: string; etapa: number; nombre: string; icon: React.ElementType; color: string; colorAlpha: string; colorBorder: string;
  semanas: string; precio: number; descripcion: string; items: string[]; entregable: string; depende: string;
  extra?: Extra;
};

// Cada etapa deja una parte de la aplicación funcionando con datos reales y se puede usar sola.
const ETAPAS = [
  {
    num: 1,
    nombre: 'Cartera y pagos',
    lema: 'El día a día del cobro',
    semanas: 'Semanas 1 a 7',
    color: MIZAR_GOLD,
    colorAlpha: 'rgba(201,164,67,.08)',
    colorBorder: 'rgba(201,164,67,.30)',
    usuarios: 'Cartera, tesorería y responsable de sede',
    desc: 'Las dos empresas, sus clientes y planes, los pagos con su recibo, la mora y el estado de cuenta, y el cliente pagando o reportando por WhatsApp.',
    resultado: 'Al cerrar la etapa, cartera deja el libro diario de dineros recibidos y los estados de cuenta en Excel.',
  },
  {
    num: 2,
    nombre: 'Cobranza y cliente',
    lema: 'Que la plata entre a tiempo',
    semanas: 'Semanas 8 a 11',
    color: '#38bdf8',
    colorAlpha: 'rgba(56,189,248,.07)',
    colorBorder: 'rgba(56,189,248,.28)',
    usuarios: 'Cartera, responsable de sede y gerencia',
    desc: 'Morosos, acuerdos de pago, cruces de cartera y las reglas de Cúcuta, más los recordatorios automáticos y, como opción, las recompensas.',
    resultado: 'Al cerrar la etapa, el cobro deja de depender de la memoria: el sistema dice a quién escribir, a quién llamar y qué se acordó.',
  },
  {
    num: 3,
    nombre: 'Dinero, socios y gerencia',
    lema: 'Decidir con números reales',
    semanas: 'Semanas 12 a 18',
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.07)',
    colorBorder: 'rgba(0,191,165,.28)',
    usuarios: 'Tesorería, contador, gerencia y socios',
    desc: 'Bancos y conciliación, todos los ingresos del grupo, el reparto entre socios, el flujo de caja, los informes y, como opción, la contabilidad completa.',
    resultado: 'Al cerrar la etapa, el informe a socios y el flujo de caja salen del sistema y se retiran todos los Excel de control.',
  },
];

const MODULOS: Modulo[] = [
  // ── ETAPA 1 · CARTERA Y PAGOS ──
  {
    num: '01',
    etapa: 1,
    nombre: 'Base de las dos empresas, sociedades y configuración',
    icon: Building2,
    color: MIZAR_GOLD,
    colorAlpha: 'rgba(201,164,67,.10)',
    colorBorder: 'rgba(201,164,67,.28)',
    semanas: 'Semanas 1 y 2',
    precio: 1200000,
    descripcion: 'El cimiento: las dos empresas, sus sociedades, cuentas, proyectos, inmuebles y personas, con las reglas de dinero acordadas por escrito.',
    items: [
      'Dos empresas, Mizar (Bucaramanga) y Mi Lote (Cúcuta), con selector de empresa y una vista consolidada del grupo',
      'Sociedades titulares por proyecto, cada una con su NIT, sus cuentas bancarias y su consecutivo de recibos',
      'Lugares de recaudo: cuentas de cada sociedad, efectivo por persona y cuentas personales, en una lista cerrada',
      'Proyectos e inmuebles: apartamentos, lotes por manzana, tipo (medianero, esquinero, comercial o intermedio), área y urbanismo',
      'Reglas por empresa: cuota con interés de financiación y mora en Bucaramanga; cuota fija y sin mora en Cúcuta',
      'Vendedores con el porcentaje de comisión de cada proyecto',
      'Roles y permisos: cartera, tesorería, sede, gerencia y contador; registro de quién hizo cada cambio y cuándo',
      'Sesión con gerencia y contador para dejar por escrito las reglas del dinero, con un valor por defecto donde falte una decisión',
    ],
    entregable: 'Las dos empresas, sus sociedades, cuentas, proyectos y roles creados y revisados por Mizar',
    depende: 'Es el punto de partida',
  },
  {
    num: '02',
    etapa: 1,
    nombre: 'Clientes, contratos, planes de pago, simulador y migración de los Excel',
    icon: UserPlus,
    color: MIZAR_GOLD,
    colorAlpha: 'rgba(201,164,67,.10)',
    colorBorder: 'rgba(201,164,67,.28)',
    semanas: 'Semanas 3 y 4',
    precio: 2300000,
    descripcion: 'La venta entra una sola vez, desde la promesa, con su plan de pagos completo, y los datos de hoy se cargan limpios.',
    items: [
      'Ficha única del cliente, aunque tenga contratos en las dos empresas: contratos, cuotas, pagos, gestiones y documentos',
      'Alta de la venta desde la promesa o el contrato, con consecutivo de contrato por empresa, y su estado: promesa, compraventa, escritura y entrega',
      'Plantillas de plan por proyecto: separación, cuota inicial diferida, cuotas, extraordinarias, primas y saldo con crédito',
      'Capital e interés separados en cada cuota, tal como vienen en la promesa, y fecha de corte propia de cada cliente (el 5, fin de mes u otra)',
      'Lista de precios y simulador de lotes de Cúcuta: tipo de lote, área, plazo, cuota inicial y bono de descuento dan la cuota',
      'Pagador tercero (el «encargado de pagos») y clientes de la sociedad, solo de Mizar o solo de otro socio',
      'Limpieza y carga de los Excel de las dos empresas desde 2024, incluidos los saldos de la administración anterior de Cúcuta; las marcas sueltas («SOLO MIZAR», asteriscos, colores) se vuelven datos',
    ],
    entregable: 'Todos los contratos cargados con su plan, revisables por el equipo',
    depende: 'Módulo 1',
  },
  {
    num: '03',
    etapa: 1,
    nombre: 'Pagos, recibos, intereses, mora y estado de cuenta',
    icon: Receipt,
    color: MIZAR_GOLD,
    colorAlpha: 'rgba(201,164,67,.10)',
    colorBorder: 'rgba(201,164,67,.28)',
    semanas: 'Semanas 5 a 7',
    precio: 2600000,
    descripcion: 'Un solo registro en vez de dos Excel, y el cálculo financiero que se pidió en la reunión.',
    items: [
      'Registro de pagos, incluidos los parciales: efectivo, transferencia, consignación, cheque de gerencia, descuento de nómina o en especie, con la cuenta por donde entró',
      'Recibo con consecutivo por sociedad y soporte escaneado en cada pago; bloqueo de referencias repetidas y bandeja de pagos por identificar',
      'Cada pago se aplica solo: mora, interés y capital, y los abonos extra van a capital reduciendo el plazo o la cuota',
      'Tasas en efectivo anual o mensual, fijas o por tramos, con tope de usura, días de gracia y festivos. La mora arranca apagada hasta que Mizar firme la tasa',
      'Descuentos con quién los autorizó, y descuento por pronto pago configurable, apagado hasta que Mizar lo defina',
      'Dinero «por trasladar» cuando entra en efectivo o a una cuenta personal, con alerta; pagos que llegan a la cuenta de otra sociedad',
      'Devoluciones y desistimientos registrados contra el contrato, y pagados con una orden de pago de compras',
      'Estado de cuenta por cédula, nombre, contrato o inmueble, en pantalla y PDF, con sello al día o en mora, la administración anterior aparte y la nota de 15 días; certificado de pagos; envío por WhatsApp o correo',
    ],
    entregable: '20 contratos con el mismo saldo que el Excel, y el estado de cuenta de cada uno en PDF',
    depende: 'Módulos 1 y 2',
  },
  {
    num: '04',
    etapa: 1,
    nombre: 'WhatsApp: reporte de pago, link de pago, validación y aprobación',
    icon: MessageSquare,
    color: MIZAR_GOLD,
    colorAlpha: 'rgba(201,164,67,.10)',
    colorBorder: 'rgba(201,164,67,.28)',
    semanas: 'Semanas 6 y 7',
    precio: 1700000,
    descripcion: 'El cliente paga o reporta desde WhatsApp y tesorería aprueba. Reutiliza el canal que ya funciona para compras.',
    items: [
      'Opción «Reportar pago» en WhatsApp: monto y comprobante en foto o PDF, sin salir del chat',
      'Link de pago por WhatsApp con la pasarela que Mizar elija (una por empresa), que se confirma solo',
      'Lectura del comprobante y cruce con el extracto cargado; semáforo en la bandeja de tesorería: referencia repetida, valor distinto a la cuota, comprobante dudoso o cliente sin identificar',
      'Confirmar o rechazar con motivo, uno por uno o en lote (solo los verdes), con la misma lógica de aprobación de compras',
      'Al aprobar, el pago se aplica y el recibo le llega al cliente; respuesta automática en cada paso',
      'La confirmación final sigue siendo de una persona contra el extracto, como exige la operación bancaria en Colombia',
    ],
    entregable: 'Un pago por link y uno por comprobante, aprobados y con su recibo',
    depende: 'Módulo 3 (se construye en paralelo)',
  },
  // ── ETAPA 2 · COBRANZA Y CLIENTE ──
  {
    num: '05',
    etapa: 2,
    nombre: 'Carteras, acuerdos, cruces de cartera y morosos',
    icon: TriangleAlert,
    color: '#38bdf8',
    colorAlpha: 'rgba(56,189,248,.10)',
    colorBorder: 'rgba(56,189,248,.28)',
    semanas: 'Semanas 8 y 9',
    precio: 1800000,
    descripcion: 'La lista de morosos a pedido, con la acción que corresponde a cada caso, y las herramientas para negociar con el cliente.',
    items: [
      'Listado de morosos al momento, con edades de cartera (1–30, 31–60, 61–90 y más de 90 días), filtros por empresa y proyecto, y exportación a Excel',
      'Historial de gestión de cobro por cliente: mensajes, llamadas y compromisos',
      'Acuerdos de pago con la misma calculadora: refinanciación, prórroga, cambio de fecha de corte o congelamiento, con aprobación, documento firmado y alerta si se incumplen',
      'Cruces de cartera: contra una cuenta por pagar, traslado de saldo entre contratos, pago en especie (por ejemplo, un vehículo) y entre sociedades, con aprobación de gerencia',
      'Otras carteras además de las ventas, como préstamos entre empresas, según lo que Mizar confirme',
      'Provisión y castigo de cartera según lo que defina el contador, y paz y salvo',
      'Cúcuta: porcentaje de incumplimiento de las últimas 3 cuotas y alerta de tres cuotas para recuperar el lote, que decide una persona',
      'Bono por referido que se libera cuando el referido paga sus primeras cuotas, se anula si desiste y se paga con orden de pago',
    ],
    entregable: 'Un cruce contra compras y un acuerdo de pago aprobados de punta a punta',
    depende: 'Etapa 1',
  },
  {
    num: '06',
    etapa: 2,
    nombre: 'Recordatorios de cobro (recompensas como opción)',
    icon: BellRing,
    color: '#38bdf8',
    colorAlpha: 'rgba(56,189,248,.10)',
    colorBorder: 'rgba(56,189,248,.28)',
    semanas: 'Semana 10',
    precio: 700000,
    descripcion: 'El primer recordatorio sale solo. El equipo solo interviene donde de verdad hace falta.',
    items: [
      'Recordatorios por WhatsApp según la fecha de corte de cada cliente: antes, el día del corte y después',
      'Cobranza escalonada según el comportamiento: al buen pagador un mensaje, al atrasado un segundo aviso y luego una llamada asignada',
      'Mensajes con el nombre, el valor y la fecha de cada cliente, aprobados por Meta',
      'Horarios y frecuencia según la regulación de cobranza, sin molestar al cliente justo antes del vencimiento, y nada a quien no tenga autorización registrada',
      'Aviso interno cuando un cliente entra en mora o incumple un acuerdo',
    ],
    entregable: 'Recordatorios funcionando, solo en horario permitido',
    depende: 'Etapa 1 y módulo 5',
    extra: {
      nombre: 'Recompensas por pagar a tiempo',
      precio: 800000,
      semanas: 'Semana 11',
      descripcion: 'Opcional. Premia al cliente que paga a tiempo, con un piloto medido antes de extenderlo.',
      items: [
        'Rachas de pago, puntos, beneficios por pronto pago y un mensaje de progreso al cliente («llevas 3 pagos a tiempo este trimestre»)',
        'Campañas puntuales, como la de la prima: «abona un extra y recibe un descuento», con límites legales',
        'Piloto en un proyecto de cada empresa, con tope mensual, y medición del recaudo antes y después',
      ],
      entregable: 'Una campaña de prueba medida',
    },
  },
  // ── ETAPA 3 · DINERO, SOCIOS Y GERENCIA ──
  {
    num: '07',
    etapa: 3,
    nombre: 'Ingresos, bancos y conciliación (contabilidad completa como opción)',
    icon: Landmark,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.28)',
    semanas: 'Semanas 12 y 13',
    precio: 1900000,
    descripcion: 'Todo el dinero que entra al grupo y la conciliación contra los bancos. La contabilidad completa se puede sumar como opción.',
    items: [
      'Libro de ingresos por empresa y por sociedad, con las cuotas y también lo que no es cuota: ventas de contado, arriendos, aportes de socios, reintegros y rendimientos',
      'Movimientos por cuenta con saldo verificado, y traslados entre cuentas y entre sociedades (por ejemplo, pagos de Cantalta que entran a la cuenta de Mizar)',
      'Carga de extractos bancarios y conciliación cuenta por cuenta contra los pagos registrados',
      'Saldos por cuenta bancaria, por sociedad y por empresa',
      'Exportación para Helisa, que sigue siendo el sistema contable del contador',
    ],
    entregable: 'Una cuenta bancaria conciliada al peso',
    depende: 'Etapa 1',
    extra: {
      nombre: 'Contabilidad completa',
      precio: 2200000,
      semanas: 'Semanas 16 y 17',
      descripcion: 'Opcional. Convierte cada movimiento en contabilidad, para que la plataforma lleve la contabilidad de ingresos y cartera de cada sociedad.',
      items: [
        'Plan de cuentas por sociedad',
        'Comprobantes contables automáticos desde cada pago, devolución y cruce, y causación mensual de intereses',
        'Libros auxiliares y estados financieros por empresa y proyecto',
        'Balance de prueba por sociedad, comparable con el del contador',
      ],
      entregable: 'El balance de prueba de un mes, igual al del contador',
    },
  },
  {
    num: '08',
    etapa: 3,
    nombre: 'Socios, comisiones, flujo de caja e informes',
    icon: Scale,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.28)',
    semanas: 'Semanas 14 y 15',
    precio: 1900000,
    descripcion: 'El reparto entre socios, el flujo de caja del grupo y los informes de gerencia, sin fórmulas escritas a mano.',
    items: [
      'Socios por proyecto con su porcentaje y la fecha desde la que rige (de tres socios a dos), y excepciones por cliente',
      'Reparto de ingresos y gastos con el porcentaje vigente en cada fecha; gastos tomados de compras y caja menor, y gastos de un proyecto pagados por otro',
      'Comisiones por vendedor con el porcentaje de cada proyecto: causadas, pagadas y pendientes; participación sobre el recaudo en Cúcuta',
      'Informe sencillo por socio en PDF, del 15 al 14 o el rango que se elija: se recogió, se gastó, queda y le corresponde',
      'Flujo de caja del grupo: programado frente a recaudado y gastado, egresos del mes (nómina, gastos bancarios, comisiones) y caja proyectada',
      'Los 16 informes de gerencia, entre ellos ventas frente a recaudo, cumplimiento del mes y proyección de 12 meses, con exportación a Excel',
    ],
    entregable: 'El informe al socio y el flujo del mes en paralelo, iguales a los que hoy arma gerencia',
    depende: 'Etapa 1 y módulo 7',
  },
  {
    num: '09',
    etapa: 3,
    nombre: 'Puesta en marcha y capacitación',
    icon: GraduationCap,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.28)',
    semanas: 'Semana 18',
    precio: 900000,
    descripcion: 'Que el equipo use el sistema solo y se puedan retirar los Excel con tranquilidad.',
    items: [
      'Capacitación por rol al cierre de cada etapa: cartera, tesorería, sede, gerencia y contador',
      'Trabajo en paralelo con el Excel hasta confirmar que todo cuadra',
      'Verificación de que todos los saldos son iguales al Excel en la fecha de corte',
      'Retiro de los archivos de control actuales',
      'Garantía correctiva de 30 días desde la entrega',
    ],
    entregable: '100 % de los saldos iguales al Excel en la fecha de corte',
    depende: 'Las etapas contratadas',
  },
];

const PRECIO_ESENCIAL = MODULOS.reduce((s, m) => s + m.precio, 0);
const PRECIO_OPCIONAL = MODULOS.reduce((s, m) => s + (m.extra?.precio ?? 0), 0);
const PRECIO_TOTAL = PRECIO_ESENCIAL + PRECIO_OPCIONAL;
const precioEtapa = (n: number) => MODULOS.filter(m => m.etapa === n).reduce((s, m) => s + m.precio, 0);
const opcionalEtapa = (n: number) => MODULOS.filter(m => m.etapa === n).reduce((s, m) => s + (m.extra?.precio ?? 0), 0);

const cop = (n: number) => '$' + n.toLocaleString('es-CO');

// ─── LO QUE PIDIERON Y DÓNDE QUEDA ───────────────────────────────────────────
// Sale de la reunión del 23-sep-2026 y de los Excel compartidos después.

const PEDIDOS: { etapa: number | null; items: { pedido: string; donde: string }[] }[] = [
  {
    etapa: 1,
    items: [
      { pedido: 'Dos empresas y varias sociedades, con proyectos de socios distintos', donde: '01' },
      { pedido: 'Crear al cliente y su plan una sola vez, desde la promesa de compraventa', donde: '02' },
      { pedido: 'Capital, interés e interés de mora separados en cada cuota', donde: '02 · 03' },
      { pedido: 'Fecha de corte propia de cada cliente (el 5 o fin de mes)', donde: '02' },
      { pedido: 'Lista de precios y simulador de lotes de Cúcuta', donde: '02' },
      { pedido: 'Pasar los Excel desde 2024, con la administración anterior de Cúcuta', donde: '02' },
      { pedido: 'Un solo registro de pagos en vez de dos archivos', donde: '03' },
      { pedido: 'Registrar pagos parciales con la cuenta por donde entró el dinero', donde: '03' },
      { pedido: 'Recibo con consecutivo y soporte escaneado, en lugar de carpetas físicas', donde: '03' },
      { pedido: 'Interés de mora con una tasa configurable', donde: '03' },
      { pedido: 'Abonos extra a capital con cálculo financiero', donde: '03' },
      { pedido: 'Cúcuta con cuota fija y sin mora', donde: '01 · 03' },
      { pedido: 'Descuentos autorizados y descuento por pronto pago', donde: '03' },
      { pedido: 'Clientes «por identificar» y dinero en efectivo o cuentas personales', donde: '03' },
      { pedido: 'Estado de cuenta al digitar la cédula', donde: '03' },
      { pedido: 'Reportar el pago por WhatsApp con el comprobante', donde: '04' },
      { pedido: 'Bloquear soportes repetidos y señalar comprobantes dudosos', donde: '04' },
    ],
  },
  {
    etapa: 2,
    items: [
      { pedido: 'Listado de morosos a pedido', donde: '05' },
      { pedido: 'Acuerdos de pago con la misma calculadora', donde: '05' },
      { pedido: 'Regla de tres cuotas de Cúcuta para recuperar el lote', donde: '05' },
      { pedido: 'Bono por referido después de la tercera cuota, anulado si desiste', donde: '05' },
      { pedido: 'Pagos en especie y cruces entre proyectos o sociedades', donde: '05' },
      { pedido: 'Recordatorios automáticos según la fecha de corte', donde: '06' },
      { pedido: 'Al buen pagador un mensaje; al atrasado, una llamada', donde: '06' },
      { pedido: 'Campañas como la de la prima, rachas y progreso al estilo Duolingo', donde: '06B (opción)' },
    ],
  },
  {
    etapa: 3,
    items: [
      { pedido: 'Varias cuentas bancarias y cuadre con el extracto', donde: '07' },
      { pedido: 'Contabilidad de cada empresa', donde: '07B (opción)' },
      { pedido: 'Porcentajes de socios por proyecto, por cliente y que cambian en el tiempo', donde: '08' },
      { pedido: 'Gastos repartidos con el porcentaje de cada fecha (de tres a dos socios)', donde: '08' },
      { pedido: 'Informe sencillo para cada socio', donde: '08' },
      { pedido: 'Liquidación de comisiones de venta', donde: '08' },
      { pedido: 'Flujo de caja mes a mes: programado, recogido y gastado, para decidir nuevos proyectos', donde: '08' },
      { pedido: 'Egresos tomados de compras y caja menor, sin volver a digitarlos', donde: '08' },
      { pedido: 'Capacitación y retiro de los Excel', donde: '09' },
    ],
  },
  {
    etapa: null,
    items: [
      { pedido: 'Confirmar pagos directo con el banco (servicio de avisos, SMS o correos del banco)', donde: 'Fuera · se investiga' },
      { pedido: 'Informes interpretados con inteligencia artificial', donde: 'Fuera · siguiente paso' },
      { pedido: 'Gamificación avanzada (niveles, juegos, campañas permanentes)', donde: 'Fuera · siguiente paso' },
      { pedido: 'Cambios al bot de ventas Lily', donde: 'Otro servicio' },
    ],
  },
];

// ─── INSUMOS ─────────────────────────────────────────────────────────────────

const INSUMOS = [
  'Los Excel de Bucaramanga y de Cúcuta: sin datos reales para el diseño y con datos reales para la carga',
  'Una promesa de compraventa de ejemplo, con su tabla de capital e interés, y un contrato de Mi Lote de ejemplo',
  'La lista de proyectos con su sociedad titular, sus socios, porcentajes y fechas de vigencia',
  'La lista de precios de lotes de Cúcuta',
  'Las cuentas bancarias de cada sociedad y los extractos de una cuenta para probar la conciliación',
  'La tasa de mora y sus condiciones, validadas por el contador o el abogado de Mizar (puede esperar: la mora arranca apagada)',
  'El número aproximado de clientes activos y de pagos al mes por empresa',
];

// ─── FUERA DE ALCANCE ────────────────────────────────────────────────────────

const FUERA = [
  {
    titulo: 'Gamificación avanzada',
    desc: 'La opción del módulo 6 incluye una prueba sencilla de recompensas. Juegos más elaborados, niveles o campañas permanentes se cotizan aparte, cuando exista una línea base del recaudo para medir si funcionan.',
    icon: Gamepad2, tint: 'purple',
  },
  {
    titulo: 'Conexión directa con los bancos',
    desc: 'En Colombia los bancos no ofrecen una conexión directa para confirmar pagos, así que los extractos se cargan y la confirmación sigue siendo de una persona. Si aparece un servicio de avisos confiable, entra por el mismo cruce y se cotiza por separado.',
    icon: Landmark, tint: 'blue',
  },
  {
    titulo: 'Fijar la tasa de mora y las decisiones legales',
    desc: 'La tasa la fija Mizar con su contador o su abogado, dentro del tope legal, y debe estar pactada en los contratos. La mora arranca apagada hasta que Mizar firme la tasa. La recuperación de un lote la decide una persona según el contrato.',
    icon: Scale, tint: 'red',
  },
  {
    titulo: 'Facturación electrónica y conexión con Siigo u otro software contable',
    desc: 'La factura y la nómina electrónicas, y una conexión directa con Siigo u otro programa contable, no se construyen aquí. El sistema exporta la información para Helisa, o se conecta después con un proveedor autorizado, según lo que Mizar decida.',
    icon: FileText, tint: 'amber',
  },
  {
    titulo: 'Portal del cliente, giro de utilidades y cambios al bot',
    desc: 'El cliente recibe todo por WhatsApp, sin portal propio. El informe calcula lo que le toca a cada socio, pero el giro se hace con una orden de pago de compras. Los cambios al bot de ventas son otro servicio.',
    icon: Puzzle, tint: 'teal',
  },
  {
    titulo: 'Informes interpretados con inteligencia artificial',
    desc: 'Los 16 informes salen con los datos listos para leer y exportar. Un asistente que los lea y explique con inteligencia artificial, como se mencionó en la reunión, se propone como paso siguiente, cuando los datos ya vivan en la plataforma.',
    icon: Zap, tint: 'teal',
  },
  {
    titulo: 'La cuenta de Miraflor',
    desc: 'La titularidad de esa cuenta es un tema que Mizar resuelve con su asesor. El sistema registra lo que entra por ella como dinero de una cuenta de tercero.',
    icon: Lock, tint: 'gold',
  },
];

// ─── POR CONFIRMAR ───────────────────────────────────────────────────────────

const PENDIENTES: { tema: string; pregunta: string; porDefecto: string }[] = [
  { tema: 'Empresa de Cúcuta', pregunta: '¿Cuál es su razón social y su NIT, y qué son Ictinos y la Asociación Miraflor frente a ella?', porDefecto: 'Una empresa «Cúcuta» con sus cuentas, y Miraflor como cuenta de tercero' },
  { tema: 'Sociedades por proyecto', pregunta: '¿Qué sociedad es titular de cada proyecto y cuáles llevan contabilidad propia?', porDefecto: 'Cada hoja del libro de dineros recibidos es una sociedad, agrupadas en Bucaramanga y Cúcuta' },
  { tema: 'Contabilidad y Helisa', pregunta: '¿La plataforma reemplaza a Helisa o conviven? ¿La factura y la nómina siguen en Helisa?', porDefecto: 'Conviven un año: la plataforma lleva la contabilidad de ingresos y cartera y exporta a Helisa' },
  { tema: 'Avisos bancarios', pregunta: '¿Se contrata un servicio de avisos bancarios o se leen los correos del banco?', porDefecto: 'Solo carga de extractos' },
  { tema: 'Pasarela de pagos', pregunta: '¿Cuál pasarela se usa y quién asume la comisión?', porDefecto: 'Una pasarela por empresa; la comisión la asume Mizar' },
  { tema: 'Recompensas', pregunta: '¿Qué beneficios se dan, con qué presupuesto mensual y en qué proyectos?', porDefecto: 'Piloto en un proyecto de cada empresa, con tope mensual' },
  { tema: 'Otras carteras', pregunta: '¿Hay arriendos, préstamos a socios o anticipos que se deban llevar además de las ventas?', porDefecto: 'Solo ventas y préstamos entre empresas' },
  { tema: 'Cruces de cartera', pregunta: '¿Quién aprueba un cruce y con qué tope? ¿Se aceptan pagos en especie?', porDefecto: 'Aprueba gerencia, sin tope; en especie solo con avalúo' },
  { tema: 'Provisión y castigo', pregunta: '¿Qué porcentajes por tramo de atraso y cuándo se castiga una cuenta?', porDefecto: 'Según el contador, sin castigo automático' },
  { tema: 'Participación en Cúcuta', pregunta: 'En el informe de Cúcuta, la «comisión» es la mitad de lo recaudado: ¿es una participación, un reparto entre socios o una comisión?', porDefecto: 'Se modela como participación configurable sobre el recaudo' },
  { tema: 'Dinero fuera de la cuenta de la sociedad', pregunta: '¿Se sigue recibiendo dinero en cuentas personales y en efectivo? ¿En cuántos días debe quedar en la cuenta de la sociedad?', porDefecto: 'Se permite; queda «por trasladar» y alerta a los 3 días hábiles' },
  { tema: 'Descuento de nómina', pregunta: '¿Qué empleados compran a cuotas y cómo se registra el descuento?', porDefecto: 'Medio de pago «descuento de nómina» con el soporte de la nómina' },
  { tema: 'Descuento por pronto pago', pregunta: '¿Se ofrece un descuento por pagar antes de la fecha, o una penalidad por pagar tarde? ¿Con qué condiciones?', porDefecto: 'Queda configurable y apagado hasta que Mizar lo defina' },
  { tema: 'Línea base del recaudo', pregunta: 'En la reunión se habló de un recaudo de «70, 75» o «35» por ciento. ¿Cuál es y cómo se mide?', porDefecto: 'El sistema calcula el cumplimiento del mes y el recaudo sobre lo programado, y se toma el primer mes como base' },
  { tema: 'Lista de precios y bonos', pregunta: '¿Quién actualiza la lista de precios de lotes y cada cuánto? ¿Quién autoriza un bono de descuento?', porDefecto: 'La actualiza gerencia; el bono lo autoriza gerencia o el responsable de sede' },
];

// ─── TÉRMINOS ────────────────────────────────────────────────────────────────

const TERMINOS: { titulo: string; desc: string; icon: React.ElementType }[] = [
  {
    titulo: 'Cómo aceptar esta propuesta',
    desc: 'Mizar confirma su aceptación vía WhatsApp, correo electrónico o de forma verbal, indicando qué módulos contrata. Con esa confirmación se procede con la firma del contrato y el primer pago.',
    icon: CheckCircle,
  },
  {
    titulo: 'Contratación por etapa y pago por módulo',
    desc: 'Las tres etapas se pueden contratar juntas o una a una; la etapa 1 es la base indispensable y las otras se construyen sobre ella. Cada módulo tiene su propio valor, se entrega y se aprueba por separado, y se paga al entregarse. El módulo 1 se paga al firmar, para arrancar. Los módulos opcionales, recompensas y contabilidad completa, se pueden contratar ahora o más adelante.',
    icon: FileText,
  },
  {
    titulo: 'Pago mensual (por confirmar)',
    desc: 'Por confirmar: el sistema suma $150.000 COP al valor mensual que Mizar ya paga por la plataforma, que pasaría de $350.000 a $500.000. Se pagaría mes a mes de forma anticipada desde que el primer módulo entra en producción, dentro del mismo contrato anual de uso. Este valor se define antes de firmar.',
    icon: Clock,
  },
  {
    titulo: 'Tarifas de mensajes de Meta',
    desc: 'Los recordatorios y avisos por WhatsApp tienen una tarifa por mensaje que cobra Meta. No está incluida en el valor mensual y la asume Mizar al costo, sin margen de Sixteam. El consumo depende del número de clientes y de las reglas de recordatorio que se activen. La comisión de la pasarela de pagos, si se activa el link de pago, también la asume Mizar.',
    icon: MessageSquare,
  },
  {
    titulo: 'Cuándo arranca',
    desc: 'El desarrollo arranca cuando el módulo de compras esté operando con el equipo, para no cruzar las dos puestas en marcha. La propuesta reutiliza lo ya construido: usuarios, roles, servidor, respaldos y canal de WhatsApp.',
    icon: Calendar,
  },
  {
    titulo: 'Duración del desarrollo',
    desc: '18 semanas desde el inicio del proyecto, en tres etapas: cartera y pagos (semanas 1 a 7), cobranza y cliente (8 a 11) y dinero, socios y gerencia (12 a 18). Cada módulo cierra con un entregable revisable. Sin los dos módulos opcionales, el cronograma baja a cerca de 15 semanas.',
    icon: Zap,
  },
  {
    titulo: 'La mora arranca apagada',
    desc: 'El sistema solo cobra mora cuando Mizar firme la tasa y las condiciones, validadas con su contador o abogado. Mientras tanto, los pagos se registran y se separan en capital e interés, pero no se liquida mora.',
    icon: Scale,
  },
  {
    titulo: 'Datos personales y cobranza',
    desc: 'Mizar es responsable de contar con la autorización de sus clientes para tratar sus datos y contactarlos por WhatsApp. Los horarios y la frecuencia de los mensajes de cobro se configuran según la regulación de cobranza vigente, que Mizar valida con su asesor. Sin autorización registrada no salen recordatorios.',
    icon: ShieldCheck,
  },
  {
    titulo: 'SLA y atención de incidencias',
    desc: 'Tiempo máximo de respuesta de 4 horas ante cualquier incidencia, en días y horarios hábiles, con comunicación directa vía WhatsApp o correo.',
    icon: Shield,
  },
  {
    titulo: 'Modificaciones al alcance',
    desc: 'Todo requerimiento funcional no contemplado en esta propuesta se maneja mediante cotización independiente y no modifica el valor mensual acordado. Las decisiones por confirmar se resuelven con el valor por defecto indicado; si Mizar decide otra cosa y cambia el alcance, se ajusta el valor del módulo afectado de común acuerdo.',
    icon: AlertCircle,
  },
  {
    titulo: 'Propiedad y confidencialidad',
    desc: 'Mizar es propietario de todos los datos de sus clientes, pagos y socios cargados en la plataforma. Sixteam mantiene la confidencialidad total de esa información, tanto durante la vigencia del contrato como después de su terminación.',
    icon: Lock,
  },
  {
    titulo: 'Responsables del proyecto',
    desc: 'Mizar designa un responsable en Bucaramanga, uno en Cúcuta y a su contador para las sesiones de validación al cierre de cada fase. La participación del equipo de cartera de cada sede en la depuración de los Excel es determinante para que los saldos cuadren desde el primer día.',
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
  { id: 'incluye',    label: 'Módulos'     },
  { id: 'pedidos',    label: 'Lo pedido'   },
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
  const [extras, setExtras] = useState<Record<string, boolean>>({ '06': true, '07': true });
  const totalOpciones = MODULOS.reduce((t, m) => t + (m.extra && extras[m.num] ? m.extra.precio : 0), 0);

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
  const s4 = useVisible(); const s5 = useVisible(); const s6 = useVisible(); const s7 = useVisible(); const s9 = useVisible();

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
              <TagLabel>Propuesta de trabajo y cotización · Nuevos módulos de la plataforma</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${MIZAR_GOLD}, #8f7226)` }}>
                  <Wallet className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">Mizar · Mi Lote</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(201,164,67,.12)', border: '1px solid rgba(201,164,67,.28)', color: MIZAR_GOLD }}>
                  Sistema financiero de ingresos
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
                  {['1. Resumen ejecutivo','2. Resultados que obtendrán','3. Pruebe la demo','4. Tres etapas, nueve módulos','5. Lo que pidieron','6. Plan de trabajo','7. Alcance y por confirmar','8. Inversión','9. Vigencia y términos'].map((item, i) => (
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
                <p className="font-poppins font-semibold text-white/80 text-[18px]">Mizar en Bucaramanga y Mi Lote en Cúcuta, con reglas distintas</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Equipo involucrado</p>
                <p className="font-lato text-white/60 text-[18px]">Cartera, tesorería, sedes, gerencia, contador y socios</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Situación actual</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#f59e0b' }} />
                  <p className="font-poppins font-semibold text-[15px] text-[#f59e0b]">Cartera, ingresos y contabilidad en varios Excel</p>
                </div>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Plataforma base</p>
                <p className="font-lato text-white/60 text-[18px]">Plataforma Mizar: compras, pagos y caja menor</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Formatos base</p>
                <p className="font-lato text-white/60 text-[18px]">Dineros recibidos, flujo por proyecto, informes a socios y extractos</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              Mizar vende a cuotas y financia directamente a sus compradores, muchos de ellos en el exterior y sin estudio de crédito. Eso convierte el dinero que entra en el asunto de caja más importante del grupo: de nada sirve vender si el recaudo no está organizado. Hoy ese recaudo vive en varios Excel que el equipo de cada sede llena a mano, pago por pago, para dos empresas distintas, Mizar en Bucaramanga y Mi Lote en Cúcuta, y para las sociedades que son dueñas de cada proyecto.
            </p>
            <p>
              En la reunión del 23 de septiembre la ingeniera Claudia planteó el objetivo con claridad: <strong className="text-white/90 font-semibold">saber mes a mes cuánto dinero está programado, cuánto se recogió y cuánto se puede gastar</strong>, para decidir si la empresa puede tomar más proyectos. A medida que se detalló el trabajo, el alcance creció de una cartera a un <strong className="text-white/90 font-semibold">sistema financiero de ingresos</strong>: clientes y planes, pagos, mora, bancos, contabilidad, socios y flujo de caja, para las dos empresas.
            </p>
            <p>
              Sixteam propone construirlo dentro de la <strong className="text-white/90 font-semibold">Plataforma Mizar</strong>, la misma donde ya viven compras, pagos de obra y caja menor, y presentarlo por partes: <strong className="text-white/90 font-semibold">tres etapas y nueve módulos en 18 semanas</strong>. Cada etapa deja una parte de la aplicación funcionando, y cada módulo tiene su alcance, su entregable y su propio precio, para que Mizar vea qué paga por cada parte y pueda recibirlo y pagarlo módulo a módulo.
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
                { t: 'Ingresos, cartera y contabilidad', s: 'Clientes, pagos, mora, bancos, contabilidad y socios', e: 'Esta propuesta', c: MIZAR_GOLD, bg: 'rgba(201,164,67,.10)', bd: 'rgba(201,164,67,.30)', icon: Wallet },
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
              Como usuarios, roles, servidor, respaldos y el canal de WhatsApp ya existen, este sistema cuesta menos y sale más rápido que uno nuevo. Y los gastos que compras ya registra alimentan directamente el informe a socios y el flujo de caja.
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
                  Preparamos una demo navegable del sistema, con clientes y pagos ficticios, para que el equipo lo pruebe con sus propias manos. Cubre lo que describen los módulos de esta propuesta, y nada de lo que se haga ahí se guarda.
                </p>
                <ul className="space-y-2.5 mb-6">
                  {[
                    'Cambiar de empresa, Mizar o Mi Lote, y de rol: cartera, tesorería, sede, gerencia o contador',
                    'Dar de alta una venta con su plan de pagos, y simular un lote de Cúcuta con la lista de precios',
                    'Registrar un pago parcial, ver cómo se reparte entre mora, interés y capital, y descargar el recibo y el estado de cuenta en PDF',
                    'Ver el link de pago por WhatsApp, el semáforo de tesorería y la aprobación de pagos en lote',
                    'Revisar el dinero por trasladar, los morosos, los acuerdos de pago y el cruce de cartera',
                    'Recorrer los bancos y la conciliación, la contabilidad con sus comprobantes, el informe a socios, el flujo de caja y los 16 informes',
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
                Funciona en computador y celular. Los nombres, cédulas y valores son ficticios; los proyectos son los de Mizar. La tasa de mora de la demo es solo un ejemplo: en el sistema real la mora arranca apagada hasta que Mizar firme la tasa.
              </p>
            </div>
          </div>
        </section>

        {/* ─ 04 QUÉ INCLUYE ─ */}
        <section id="incluye" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 · Tres etapas, nueve módulos</TagLabel>
          <SectionTitle>Qué incluye cada módulo y cuánto cuesta</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-6">
            El sistema se construye en tres etapas. Cada una deja una parte de la aplicación funcionando con datos reales y se puede usar sola, aunque las siguientes todavía no estén. Dentro de cada etapa, cada módulo muestra su alcance, su entregable, sus semanas y su precio. Toca un módulo para ver el detalle.
          </p>

          {/* Las tres etapas de un vistazo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
            {ETAPAS.map((e, k) => (
              <div key={e.num} className="rounded-xl p-4 relative" style={{ background: e.colorAlpha, border: `1px solid ${e.colorBorder}` }}>
                <p className="font-lato text-[12px] uppercase tracking-wider mb-1" style={{ color: e.color }}>Etapa {e.num} · {e.semanas}</p>
                <p className="font-poppins font-bold text-white text-[18px] leading-tight">{e.nombre}</p>
                <p className="font-lato text-white/45 text-[14px] mb-2">{e.lema}</p>
                <p className="font-poppins font-black text-white/85 text-[18px]">{cop(precioEtapa(e.num))}
                  {opcionalEtapa(e.num) > 0 && <span className="font-lato font-normal text-white/40 text-[13px]"> + opción {cop(opcionalEtapa(e.num))}</span>}
                </p>
                {k < ETAPAS.length - 1 && (
                  <ArrowRight className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                )}
              </div>
            ))}
          </div>

          <div className="space-y-10">
            {ETAPAS.map((e) => (
              <div key={e.num}>
                <div className="rounded-xl p-4 sm:p-5 mb-4" style={{ background: e.colorAlpha, border: `1px solid ${e.colorBorder}` }}>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                    <p className="font-poppins font-black text-[20px]" style={{ color: e.color }}>Etapa {e.num} · {e.nombre}</p>
                    <span className="font-lato text-white/40 text-[14px]">{e.semanas}</span>
                  </div>
                  <p className="font-lato text-white/60 text-[16px] leading-relaxed mb-2">{e.desc}</p>
                  <p className="font-lato text-white/45 text-[14px]"><strong className="text-white/70">Quién la usa:</strong> {e.usuarios}</p>
                  <p className="font-lato text-white/45 text-[14px]"><strong className="text-white/70">Qué cambia al terminarla:</strong> {e.resultado}</p>
                </div>

                <div className="relative">
                  <div className="hidden sm:block absolute left-[28px] top-6 bottom-6 w-px" style={{ background: e.colorBorder }} />
                  <div className="space-y-3">
                    {MODULOS.map((mod, i) => {
                      if (mod.etapa !== e.num) return null;
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
                            <div className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center flex-shrink-0"
                              style={{ background: open ? mod.colorAlpha : 'rgba(255,255,255,.05)' }}>
                              <Icon className="w-4 h-4 transition-colors" style={{ color: open ? mod.color : 'rgba(255,255,255,.35)' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className={`font-poppins font-bold text-[18px] ${open ? 'text-white' : 'text-white/70'}`}>
                                <span className="sm:hidden" style={{ color: mod.color }}>{mod.num} · </span>{mod.nombre}
                              </span>
                              <p className={`font-lato text-white/40 text-[15px] mt-0.5 ${open ? '' : 'line-clamp-1'}`}>{mod.descripcion}</p>
                            </div>
                            <div className="flex-shrink-0 text-right ml-2">
                              <p className="font-poppins font-black text-[17px] leading-tight" style={{ color: open ? mod.color : 'rgba(255,255,255,.75)' }}>{cop(mod.precio)}</p>
                              <p className="font-lato text-white/30 text-[12px]">{mod.semanas}</p>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ml-1 ${open ? 'rotate-90' : ''}`}
                              style={{ color: open ? mod.color : 'rgba(255,255,255,.3)' }} />
                          </button>

                          {open && (
                            <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                              <div className="pt-4">
                                <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Qué incluye</p>
                                <ul className="space-y-2">
                                  {mod.items.map((item, j) => (
                                    <li key={j} className="flex items-start gap-2">
                                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: mod.color }} />
                                      <span className="font-lato text-white/65 text-[17px] flex-1">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  <div className="rounded-lg p-3 flex gap-2.5 items-start" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                                    <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: mod.color }} />
                                    <div>
                                      <p className="font-poppins font-semibold text-white/50 text-[12px] uppercase tracking-wider mb-0.5">Entregable</p>
                                      <p className="font-lato text-white/75 text-[15px] leading-snug">{mod.entregable}</p>
                                    </div>
                                  </div>
                                  <div className="rounded-lg p-3 flex gap-2.5 items-start" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                                    <Layers className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: mod.color }} />
                                    <div>
                                      <p className="font-poppins font-semibold text-white/50 text-[12px] uppercase tracking-wider mb-0.5">Se apoya en</p>
                                      <p className="font-lato text-white/75 text-[15px] leading-snug">{mod.depende}</p>
                                    </div>
                                  </div>
                                </div>

                                {mod.extra && (
                                  <div className="mt-4 rounded-xl p-4" style={{ background: mod.colorAlpha, border: `1px dashed ${mod.colorBorder}` }}>
                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                      <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                                        style={{ background: 'rgba(255,255,255,.06)', border: `1px solid ${mod.colorBorder}`, color: mod.color }}>Opcional</span>
                                      <p className="font-poppins font-bold text-white/90 text-[16px]">{mod.num}B · {mod.extra.nombre}</p>
                                      <p className="font-poppins font-black text-[16px] ml-auto" style={{ color: mod.color }}>+{cop(mod.extra.precio)}</p>
                                    </div>
                                    <p className="font-lato text-white/45 text-[14px] mb-2">{mod.extra.semanas} · {mod.extra.descripcion}</p>
                                    <ul className="space-y-1.5 mb-2">
                                      {mod.extra.items.map((item, j) => (
                                        <li key={j} className="flex items-start gap-2">
                                          <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: mod.color }} />
                                          <span className="font-lato text-white/65 text-[16px] flex-1">{item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                    <p className="font-lato text-white/55 text-[14px]"><strong className="text-white/75">Entregable:</strong> {mod.extra.entregable}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl p-4 flex gap-3"
            style={{ background: 'rgba(201,164,67,.06)', border: '1px solid rgba(201,164,67,.22)' }}>
            <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: MIZAR_GOLD }} />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              Todo opera bajo <strong className="text-white/80">acceso por roles</strong>: cartera digita, tesorería confirma, la sede ve lo suyo, gerencia ve todo, el contador revisa la contabilidad y los socios solo reciben su informe. Cada cambio queda registrado con quién lo hizo y cuándo, algo indispensable cuando hay dinero de socios y cobro de intereses.
            </p>
          </div>
        </section>

        {/* ─ 05 LO QUE PIDIERON ─ */}
        <section id="pedidos" ref={s9.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s9.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 · Lo que pidieron</TagLabel>
          <SectionTitle>Cada pedido, en su módulo</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Revisamos lo que se habló en la reunión del 23 de septiembre y los archivos de Excel que compartieron después. Esto es lo que pidieron y el módulo donde queda resuelto. Lo que no entra también está, con el motivo.
          </p>

          <div className="space-y-5">
            {PEDIDOS.map((g, gi) => {
              const e = g.etapa ? ETAPAS[g.etapa - 1] : null;
              const color = e ? e.color : '#94a3b8';
              return (
                <div key={gi} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,.03)', border: `1px solid ${e ? e.colorBorder : 'rgba(255,255,255,.10)'}` }}>
                  <div className="px-4 sm:px-5 py-3" style={{ background: e ? e.colorAlpha : 'rgba(255,255,255,.04)' }}>
                    <p className="font-poppins font-bold text-[16px]" style={{ color }}>
                      {e ? `Etapa ${e.num} · ${e.nombre}` : 'No entra en esta propuesta'}
                    </p>
                  </div>
                  <ul className="divide-y" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                    {g.items.map((it, j) => (
                      <li key={j} className="flex items-start gap-3 px-4 sm:px-5 py-2.5" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                        {e
                          ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color }} />
                          : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-white/35" />}
                        <span className="font-lato text-white/70 text-[16px] leading-snug flex-1">{it.pedido}</span>
                        <span className="font-lato text-[12px] px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0"
                          style={{ background: 'rgba(255,255,255,.05)', border: `1px solid ${e ? e.colorBorder : 'rgba(255,255,255,.12)'}`, color }}>
                          {e ? `Módulo ${it.donde}` : it.donde}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─ 06 PLAN DE TRABAJO ─ */}
        <section id="plan" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 · Plan de trabajo</TagLabel>
          <SectionTitle>18 semanas, en tres etapas</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Cada etapa termina con su parte de la aplicación funcionando y con sus usuarios capacitados. Desde la semana 7 el equipo ya registra pagos reales en la plataforma, y el Excel solo se retira cuando los números cuadran. Sin los dos módulos opcionales, el cronograma baja a cerca de 15 semanas.
          </p>

          <div className="space-y-4">
            {ETAPAS.map((e) => (
              <div key={e.num} className="rounded-2xl p-5 sm:p-6"
                style={{ background: e.colorAlpha, border: `1px solid ${e.colorBorder}` }}>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2"
                    style={{ background: '#030d1a', borderColor: e.color }}>
                    <span className="font-poppins font-black text-[14px]" style={{ color: e.color }}>{e.num}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-poppins font-bold text-white text-[20px] leading-tight">Etapa {e.num} · {e.nombre}</p>
                    <p className="font-lato text-white/35 text-[13px] mt-0.5">{e.usuarios}</p>
                  </div>
                  <span className="font-lato text-[12px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5"
                    style={{ background: 'rgba(255,255,255,.05)', border: `1px solid ${e.colorBorder}`, color: e.color }}>
                    <Clock className="w-3 h-3" /> {e.semanas}
                  </span>
                </div>

                <ul className="space-y-2 mb-4">
                  {MODULOS.filter(m => m.etapa === e.num).flatMap((m) => {
                    const filas = [
                      <li key={m.num} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: e.color }} />
                        <span className="font-lato text-white/65 text-[16px] flex-1"><strong className="text-white/85">{m.num}</strong> · {m.nombre}</span>
                        <span className="font-lato text-white/35 text-[13px] whitespace-nowrap">{m.semanas}</span>
                      </li>,
                    ];
                    if (m.extra) filas.push(
                      <li key={m.num + 'B'} className="flex items-start gap-2 pl-5">
                        <span className="font-lato text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider mt-0.5"
                          style={{ border: `1px solid ${e.colorBorder}`, color: e.color }}>Opción</span>
                        <span className="font-lato text-white/50 text-[15px] flex-1">{m.num}B · {m.extra.nombre}</span>
                        <span className="font-lato text-white/35 text-[13px] whitespace-nowrap">{m.extra.semanas}</span>
                      </li>,
                    );
                    return filas;
                  })}
                </ul>

                <div className="rounded-xl p-3.5 flex gap-2.5 items-start"
                  style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: e.color }} />
                  <div>
                    <p className="font-poppins font-semibold text-white/50 text-[12px] uppercase tracking-wider mb-0.5">Al cerrar la etapa</p>
                    <p className="font-lato text-white/75 text-[16px] leading-snug">{e.resultado}</p>
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
              El cronograma asume una sesión de validación de cerca de una hora al cierre de cada módulo, con Bucaramanga, Cúcuta y el contador. La depuración de los Excel en el módulo 2 es la tarea que pide más tiempo del equipo, y es la que garantiza que los saldos cuadren desde el primer día.
            </p>
          </div>
        </section>

        {/* ─ 07 ALCANCE ─ */}
        <section id="alcance" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>07 · Alcance y por confirmar</TagLabel>
          <SectionTitle>Qué queda fuera y qué falta decidir</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Todo lo descrito en las tres etapas entra en la inversión de la sección siguiente. Lo siguiente queda fuera de forma deliberada, para no mezclar lo urgente con lo que conviene hacer después.
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

          <div className="rounded-2xl p-5 sm:p-6 mb-8" style={{ background: 'rgba(245,158,11,.05)', border: '1px solid rgba(245,158,11,.20)' }}>
            <p className="font-poppins font-semibold text-white/80 text-[18px] mb-1 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#f59e0b]" /> Por confirmar con Mizar
            </p>
            <p className="font-lato text-white/50 text-[15px] leading-relaxed mb-4">
              Son decisiones que todavía no están tomadas. No son promesas: en cada una se construye con el valor por defecto indicado hasta que Mizar confirme otra cosa. Se resuelven en las sesiones de validación, sobre todo en las dos primeras fases.
            </p>
            <div className="space-y-2">
              {PENDIENTES.map((p, i) => (
                <div key={i} className="rounded-lg p-3.5" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                  <p className="font-poppins font-semibold text-white/85 text-[15px] mb-0.5">{p.tema}</p>
                  <p className="font-lato text-white/55 text-[15px] leading-snug mb-1.5">{p.pregunta}</p>
                  <p className="font-lato text-[14px] leading-snug" style={{ color: '#f59e0b' }}>
                    <span className="uppercase tracking-wider text-[11px] mr-1.5 text-white/35">Por defecto</span>{p.porDefecto}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.20)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-5 h-5 text-[#00bfa5]" />
              <p className="font-poppins font-semibold text-white/80 text-[18px]">Un alcance cerrado, con la puerta abierta</p>
            </div>
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              Esta propuesta cubre el sistema financiero de ingresos completo: clientes y planes, pagos, mora, estados de cuenta, verificación por WhatsApp, morosos y cruces, bancos y conciliación, contabilidad, socios, flujo de caja, informes y recordatorios. Lo que queda por fuera se puede sumar después sobre lo ya construido, sin rehacer nada, y con datos reales para decidir si vale la pena.
            </p>
          </div>
        </section>

        {/* ─ 08 INVERSIÓN ─ */}
        <section id="inversion" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>08 · Inversión por etapa y módulo</TagLabel>
          <SectionTitle>Cada parte con su precio.</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            El desarrollo se paga una sola vez y por módulo entregado, agrupado en las tres etapas. Los módulos esenciales suman <strong className="text-white/75">{cop(PRECIO_ESENCIAL)}</strong> y, con las dos opciones, el total es de <strong className="text-white/75">{cop(PRECIO_TOTAL)}</strong>. Todos los valores en <strong className="text-white/75">pesos colombianos (COP).</strong> Activa o desactiva las opciones para ver el total.
          </p>

          {/* Tabla de módulos */}
          <div className="rounded-2xl overflow-hidden mb-6"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(201,164,67,.30)', boxShadow: '0 4px 32px rgba(201,164,67,.10)' }}>
            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
              {ETAPAS.map((e) => (
                <React.Fragment key={'etapa' + e.num}>
                  <div className="flex flex-wrap items-baseline gap-x-3 px-4 sm:px-5 py-2.5" style={{ background: e.colorAlpha, borderColor: 'rgba(255,255,255,.06)' }}>
                    <p className="font-poppins font-bold text-[15px] w-full sm:w-auto sm:flex-1 min-w-0" style={{ color: e.color }}>Etapa {e.num} · {e.nombre}</p>
                    <p className="font-lato text-white/40 text-[13px]">{e.semanas}</p>
                    <p className="font-poppins font-bold text-white/80 text-[15px] whitespace-nowrap">Subtotal {cop(precioEtapa(e.num))}</p>
                  </div>
              {MODULOS.filter(m => m.etapa === e.num).map((m) => (
                <React.Fragment key={m.num}>
                  <div className="flex items-start gap-3 px-4 sm:px-5 py-3.5" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                    <span className="font-poppins font-black text-[14px] w-7 flex-shrink-0 pt-0.5" style={{ color: m.color }}>{m.num}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-poppins font-semibold text-white/85 text-[16px] leading-snug">{m.nombre}</p>
                      <p className="font-lato text-white/35 text-[13px]">{m.semanas} · Esencial</p>
                    </div>
                    <p className="font-poppins font-bold text-white/85 text-[16px] flex-shrink-0 whitespace-nowrap">{cop(m.precio)}</p>
                  </div>
                  {m.extra && (
                    <button type="button" onClick={() => setExtras(e => ({ ...e, [m.num]: !e[m.num] }))}
                      aria-pressed={!!extras[m.num]}
                      className="w-full flex items-start gap-3 px-4 sm:px-5 py-3.5 text-left transition-colors hover:bg-white/[0.02]"
                      style={{ background: extras[m.num] ? m.colorAlpha : 'transparent', borderColor: 'rgba(255,255,255,.06)' }}>
                      <span className="w-7 flex-shrink-0 pt-0.5">
                        <span className="block w-4 h-4 rounded border-2 flex items-center justify-center"
                          style={{ borderColor: m.color, background: extras[m.num] ? m.color : 'transparent' }}>
                          {extras[m.num] && <CheckCircle className="w-3 h-3 text-[#030d1a]" />}
                        </span>
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-poppins font-semibold text-white/85 text-[16px] leading-snug">
                          {m.num}B · {m.extra.nombre}
                          <span className="ml-2 font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider align-middle"
                            style={{ background: 'rgba(255,255,255,.06)', border: `1px solid ${m.colorBorder}`, color: m.color }}>Opcional</span>
                        </p>
                        <p className="font-lato text-white/35 text-[13px]">{m.extra.semanas}</p>
                      </div>
                      <p className="font-poppins font-bold text-[16px] flex-shrink-0 whitespace-nowrap" style={{ color: extras[m.num] ? m.color : 'rgba(255,255,255,.35)' }}>+{cop(m.extra.precio)}</p>
                    </button>
                  )}
                </React.Fragment>
              ))}
                </React.Fragment>
              ))}
            </div>
            <div className="px-4 sm:px-5 py-4 space-y-1.5" style={{ background: 'rgba(201,164,67,.07)', borderTop: '1px solid rgba(201,164,67,.30)' }}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-lato text-white/55 text-[15px]">Subtotal de los módulos esenciales</p>
                <p className="font-poppins font-bold text-white/85 text-[17px]">{cop(PRECIO_ESENCIAL)}</p>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-lato text-white/55 text-[15px]">Opciones elegidas</p>
                <p className="font-poppins font-bold text-white/85 text-[17px]">{cop(totalOpciones)}</p>
              </div>
              <div className="flex items-baseline justify-between gap-3 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,.08)' }}>
                <p className="font-poppins font-bold text-white text-[18px]">Total del desarrollo</p>
                <p className="font-poppins font-black text-[26px] leading-none" style={{ color: MIZAR_GOLD }}>{cop(PRECIO_ESENCIAL + totalOpciones)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.22)' }}>
              <p className="font-lato text-white/40 text-[13px] uppercase tracking-wider mb-1">Con lo esencial</p>
              <p className="font-poppins font-black text-white text-[24px] leading-none mb-1">{cop(PRECIO_ESENCIAL)}</p>
              <p className="font-lato text-white/45 text-[14px]">Las tres etapas con sus nueve módulos, sin contabilidad completa ni recompensas. Cerca de 15 semanas.</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(201,164,67,.07)', border: '1px solid rgba(201,164,67,.25)' }}>
              <p className="font-lato text-white/40 text-[13px] uppercase tracking-wider mb-1">Con todo</p>
              <p className="font-poppins font-black text-white text-[24px] leading-none mb-1">{cop(PRECIO_TOTAL)}</p>
              <p className="font-lato text-white/45 text-[14px]">Los nueve módulos más las dos opciones. 18 semanas.</p>
            </div>
          </div>

          {/* Forma de pago */}
          <div className="rounded-xl p-5 sm:p-6 mb-6"
            style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.20)' }}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#00bfa5]" />
              <p className="font-poppins font-semibold text-white/80 text-[18px]">Forma de pago · Por módulo entregado</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { n: '1', t: 'Al firmar', d: `Se paga el módulo 1 (${cop(MODULOS[0].precio)}) para arrancar la construcción.` },
                { n: '2', t: 'Al entregar cada módulo', d: 'Cada módulo siguiente se paga por su valor cuando Mizar lo recibe y lo aprueba en la sesión de validación.' },
                { n: '3', t: 'Las opciones, si se contratan', d: 'La contabilidad completa y las recompensas se pagan igual, contra su entrega, y se pueden contratar más adelante.' },
              ].map((x) => (
                <div key={x.n} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <p className="font-poppins font-black text-[#00bfa5] text-[24px] leading-none mb-1">{x.n}</p>
                  <p className="font-poppins font-semibold text-white/80 text-[15px] mb-1">{x.t}</p>
                  <p className="font-lato text-white/40 text-[13px] leading-relaxed">{x.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mensualidad */}
          <div className="rounded-2xl overflow-hidden mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(0,191,165,.08) 0%, rgba(3,13,26,.95) 100%)', border: '1px solid rgba(0,191,165,.28)' }}>
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,191,165,.18)' }}>
                  <Shield className="w-4 h-4 text-[#00bfa5]" />
                </div>
                <span className="font-poppins font-bold text-white/70 text-[15px]">Uso y soporte de la plataforma</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider ml-auto"
                  style={{ background: 'rgba(245,158,11,.12)', border: '1px solid rgba(245,158,11,.30)', color: '#f59e0b' }}>
                  Por confirmar
                </span>
              </div>
              <p className="font-poppins font-black text-white leading-none mb-1" style={{ fontSize: '2rem' }}>+$150.000 <span className="text-[16px] font-lato font-normal text-white/40">COP al mes</span></p>
              <p className="font-lato text-white/40 text-[14px] mb-4">Valor por confirmar antes de firmar. La plataforma pasaría de $350.000 a $500.000 al mes.</p>
              <ul className="space-y-2">
                {[
                  'Alojamiento de la información financiera y de los soportes de pago, con respaldo diario',
                  'Mantenimiento del reporte de pago, del link de pago y de los recordatorios por WhatsApp',
                  'Atención a inconvenientes o errores detectados, con SLA de respuesta máximo de 4 horas',
                  'Actualizaciones de seguridad y estabilidad, dentro del mismo contrato anual de uso',
                ].map((p, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
                    <span className="font-lato text-white/60 text-[15px] leading-snug">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl p-4 flex gap-3 mb-4"
            style={{ background: 'rgba(201,164,67,.06)', border: '1px solid rgba(201,164,67,.22)' }}>
            <Puzzle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: MIZAR_GOLD }} />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              <strong className="text-white/80">Por qué cuesta menos que un sistema nuevo:</strong> usuarios, roles, servidor, respaldos y el canal de WhatsApp ya están construidos y pagados dentro de la Plataforma Mizar. Esta inversión se concentra solo en lo que es propio del dinero que entra.
            </p>
          </div>

          <div className="rounded-xl p-4 flex gap-3 mb-4"
            style={{ background: 'rgba(37,211,102,.05)', border: '1px solid rgba(37,211,102,.22)' }}>
            <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#25D366' }} />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              Las <strong className="text-white/80">tarifas que Meta cobra por cada mensaje</strong> de recordatorio o aviso, y la comisión de la pasarela de pagos, no están incluidas y las asume Mizar al costo, sin margen de Sixteam.
            </p>
          </div>

          <div className="rounded-xl p-4 flex gap-3"
            style={{ background: 'rgba(245,158,11,.05)', border: '1px solid rgba(245,158,11,.20)' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#f59e0b]" />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              Esta propuesta cubre el alcance descrito en este documento. Cualquier requerimiento adicional, como la gamificación avanzada, los avisos bancarios automáticos o la facturación electrónica, se cotiza por separado.
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

        {/* ─ 09 VIGENCIA ─ */}
        <section id="vigencia" ref={s7.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s7.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>09 · Vigencia y términos</TagLabel>
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
