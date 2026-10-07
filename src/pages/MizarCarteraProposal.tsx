import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap,
  AlertCircle, Info, Calendar, MapPin,
  Users, Shield, Lock, BellRing, MessageSquare, ClipboardList,
  FileSpreadsheet, Stamp, Layers, Workflow,
  Wallet, Calculator, FileSearch, TriangleAlert, TrendingUp,
  Landmark, HandCoins, Scale, Gamepad2, UserPlus, Puzzle, ArrowRight,
  MousePointerClick, Monitor, Search, ShieldCheck,
  Building2, BookOpen, ListChecks, ChevronDown,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Mizar Diseño y Construcción · Mi Lote',
  tagline: 'Sistema financiero de ingresos: cartera, recaudo, contabilidad y socios',
  sector: 'Diseño y construcción · Venta de inmuebles y lotes a cuotas · Dos empresas',
  fecha: 'Octubre 2026',
  lugar: 'Bucaramanga y Cúcuta',
  objetivo: 'Un solo sistema para el dinero que entra a Mizar y a Mi Lote: cartera, pagos, bancos y socios, sin Excel paralelos. Compras ya controla lo que sale; esto completa la foto.',
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
  { titulo: 'Cada pago se digita dos o tres veces', desc: 'Libro diario, control por proyecto y, en Cúcuta, otro Excel y un Drive. Más de 1.500 movimientos escritos a mano desde 2024.', icon: FileSpreadsheet, tint: 'amber' },
  { titulo: 'La mora casi nunca se cobra', desc: 'Calcularla a mano toma tiempo, así que muchas veces no se hace y el cliente paga cuando quiere.', icon: Calculator, tint: 'red' },
  { titulo: 'El dinero se revuelve entre cuentas', desc: 'Varios proyectos y sociedades entran a las mismas cuentas, y una parte llega en efectivo o a cuentas personales.', icon: Landmark, tint: 'blue' },
  { titulo: 'Sin foto al día para decidir', desc: 'El flujo de caja y el informe a socios se arman con fórmulas a mano que se rompen cuando cambian los socios.', icon: Users, tint: 'purple' },
];

// ─── HOY EN EXCEL FRENTE A CON EL SISTEMA ────────────────────────────────────

const ANTES_DESPUES: { tema: string; hoy: string; con: string; icon: React.ElementType }[] = [
  { tema: 'Registro de pagos', hoy: 'Se digita en el libro diario y otra vez en el control de cada proyecto.', con: 'Se registra una sola vez y alimenta todo lo demás.', icon: Wallet },
  { tema: 'Estado de cuenta', hoy: 'Se arma a mano, pestaña por pestaña.', con: 'Sale en segundos con la cédula, en PDF y listo para enviar.', icon: Search },
  { tema: 'Mora y abonos', hoy: 'Se calculan a mano y muchas veces no se cobran.', con: 'Se calculan solos con la tasa que defina Mizar.', icon: Calculator },
  { tema: 'Pagos por WhatsApp', hoy: 'El soporte se revisa a ojo; ya llegaron soportes repetidos.', con: 'El cliente reporta desde el chat; el pago se cruza con el banco y se bloquean duplicados.', icon: MessageSquare },
  { tema: 'Cobranza', hoy: 'Recordatorios y llamadas dependen de la memoria del equipo.', con: 'Recordatorios automáticos; llamada solo al que se atrasa.', icon: BellRing },
  { tema: 'Bancos y efectivo', hoy: 'Dinero de varias sociedades mezclado; efectivo y cuentas personales sin control.', con: 'Cada peso con su sociedad, alerta de lo que falta trasladar y extractos conciliados.', icon: Landmark },
  { tema: 'Informe a socios', hoy: 'Fórmulas a mano que hay que rehacer cuando cambia un socio.', con: 'Informe por socio con el porcentaje vigente en cada fecha.', icon: Users },
  { tema: 'Flujo de caja', hoy: 'Consolidado manual, a veces incompleto.', con: 'Programado, recogido y gastado del grupo, al día.', icon: TrendingUp },
];

// ─── TRES ETAPAS, DOCE MÓDULOS, CADA UNO CON SU PRECIO ───────────────────────

type Extra = { nombre: string; precio: number; semanas: string; descripcion: string; items: string[]; nota?: string };
type Modulo = {
  num: string; etapa: number; nombre: string; icon: React.ElementType; color: string; colorAlpha: string; colorBorder: string;
  semanas: string; precio: number; descripcion: string; items: string[]; entregable: string;
  requiere: string; minimo: boolean; extra?: Extra;
};
type Etapa = {
  num: number; nombre: string; lema: string; semanas: string; color: string; colorAlpha: string; colorBorder: string;
  resultado: string; distintivo?: string;
};

// La etapa 1 es el paquete mínimo: las otras dos se suman encima de ella.
const ETAPAS: Etapa[] = [
  { num: 1, nombre: 'Cartera básica', lema: 'Registrar una vez y que el sistema calcule', semanas: 'Semanas 1 a 7', color: MIZAR_GOLD, colorAlpha: 'rgba(201,164,67,.08)', colorBorder: 'rgba(201,164,67,.30)',
    distintivo: 'Paquete mínimo',
    resultado: 'Se retiran el libro diario, los estados de cuenta y el control por proyecto en Excel.' },
  { num: 2, nombre: 'Cobro y verificación', lema: 'Que la plata entre y se confirme', semanas: 'Semanas 8 a 11', color: '#38bdf8', colorAlpha: 'rgba(56,189,248,.07)', colorBorder: 'rgba(56,189,248,.28)',
    resultado: 'Los pagos se confirman contra el banco y el sistema dice a quién escribir, a quién llamar y qué se acordó.' },
  { num: 3, nombre: 'Dinero, socios y gerencia', lema: 'Decidir con números reales', semanas: 'Semanas 12 a 16', color: '#00bfa5', colorAlpha: 'rgba(0,191,165,.07)', colorBorder: 'rgba(0,191,165,.28)',
    resultado: 'Bancos cuadrados, flujo de caja e informe a socios salen del sistema y se retiran todos los Excel.' },
];

const E1 = { color: MIZAR_GOLD, colorAlpha: 'rgba(201,164,67,.10)', colorBorder: 'rgba(201,164,67,.28)' };
const E2 = { color: '#38bdf8', colorAlpha: 'rgba(56,189,248,.10)', colorBorder: 'rgba(56,189,248,.28)' };
const E3 = { color: '#00bfa5', colorAlpha: 'rgba(0,191,165,.10)', colorBorder: 'rgba(0,191,165,.28)' };

const MODULOS: Modulo[] = [
  // ── Etapa 1 · Cartera básica (paquete mínimo) ──
  { num: '01', etapa: 1, ...E1, icon: Building2, semanas: 'Semana 1', precio: 3450000, requiere: 'nada', minimo: true,
    nombre: 'Base del grupo: empresas, sociedades, proyectos y lotes',
    descripcion: 'Todo el grupo en un solo lugar: cada proyecto con su sociedad, sus lotes y las cuentas donde recibe dinero.',
    items: [
      'Bucaramanga y Cúcuta, cada una con sus reglas: mora en Bucaramanga, cuota fija sin mora en Cúcuta',
      'Las cinco sociedades de Bucaramanga y las de Mi Lote, con sus proyectos',
      'Cada proyecto con sus lotes o inmuebles, su precio y su estado',
      'Todos los lugares donde entra dinero: las cuentas de los cuatro bancos, el efectivo, las cuentas personales y la de Miraflor',
      'Reglas por proyecto: fecha de corte, tasa de mora con su fecha de vigencia, bono por referido y alerta de tres cuotas',
      'Usuarios por rol; cada persona ve solo lo suyo y todo cambio queda registrado',
      'Vista por empresa y vista del grupo',
    ],
    entregable: 'Empresas, sociedades, proyectos, lotes, cuentas y usuarios estén cargados y revisados por Mizar' },
  { num: '02', etapa: 1, ...E1, icon: UserPlus, semanas: 'Semana 2', precio: 1200000, requiere: '01', minimo: true,
    nombre: 'Clientes y contratos',
    descripcion: 'Una ficha por cliente y un contrato por venta, con todo su historial.',
    items: [
      'Una ficha por cliente aunque compre en las dos empresas',
      'La venta se registra una vez: lote, valor, vendedor y de quién es (de la sociedad, solo de Mizar o del otro socio)',
      'Personas autorizadas para pagar por el cliente',
      'Etapas del contrato con su fecha: separación, promesa, compraventa, escritura y entrega',
      'Desistimientos con lo que se devuelve; el lote vuelve a quedar disponible',
      'Cesión del contrato a otro comprador sin perder lo pagado',
      'Autorización del cliente para recibir mensajes',
    ],
    entregable: 'Diez contratos reales estén registrados, incluidos un desistimiento y una cesión' },
  { num: '03', etapa: 1, ...E1, icon: Calculator, semanas: 'Semanas 3 a 5', precio: 4200000, requiere: '01 y 02', minimo: true,
    nombre: 'Motor de cartera: planes, pagos, mora y estado de cuenta',
    descripcion: 'El corazón del sistema: cada pago se registra una vez y el sistema calcula lo demás.',
    items: [
      'Plan de pagos desde la promesa: separación, cuota inicial, capital e interés por separado y la fecha de corte de cada cliente',
      'Otros cobros: parqueadero, trámite de escritura, arriendo',
      'Pagos del día con el medio y la cuenta donde entraron, incluidos los parciales, los de terceros, los descontados de nómina y los que caen en la cuenta de otra sociedad',
      'Recibo con número consecutivo y soporte guardado; un comprobante repetido se rechaza',
      'Comprobante contable de cada pago, de la mora y de los descuentos, listo para el contador',
      'Mora calculada sola con la tasa que firme Mizar (en Cúcuta, cuota fija); descuento por pronto pago y penalidad listos para activar',
      'Descuentos y perdones de mora con el nombre de quien los autorizó',
      'Abonos extra a capital que recalculan el plan y guardan la versión anterior',
      'Estado de cuenta al digitar la cédula, en PDF: pagado, pendiente, interés y mora por separado, sello al día o en mora, próximo pago y la administración anterior de Cúcuta aparte',
    ],
    entregable: '20 contratos tengan el mismo saldo que el Excel, al peso' },
  { num: '04', etapa: 1, ...E1, icon: Layers, semanas: 'Semana 6', precio: 700000, requiere: '01 a 03', minimo: true,
    nombre: 'Vista de proyecto',
    descripcion: 'Entrar a un proyecto y ver todo lo suyo en una pantalla.',
    items: [
      'Resumen: lotes vendidos y disponibles, vendido, recogido, por cobrar, vencido y mora',
      'Lote por lote: estado, cliente, vendedor y en qué va su contrato',
      'Lo programado frente a lo pagado mes a mes por cliente, en lugar de las pestañas del flujo',
      'Ventas frente a recaudo y el cumplimiento del mes',
      'Cartera y morosos del proyecto',
      'Dónde entró el dinero del proyecto',
      'Suma gastos, flujo y socios cuando se contratan los módulos 10 y 11',
      'Descarga en Excel o PDF',
    ],
    entregable: 'La vista de Miradores de la Montaña cuadre con su Excel de flujo' },
  { num: '05', etapa: 1, ...E1, icon: FileSpreadsheet, semanas: 'Semanas 2 a 7', precio: 2100000, requiere: '01 a 03', minimo: true,
    nombre: 'Paso de los Excel y arranque',
    descripcion: 'La información de hoy, limpia y cargada, para no volver al Excel.',
    items: [
      'Limpieza de clientes: personas que pagan en el libro frente a clientes de la base, nombres con dos cédulas y proyectos con varios nombres',
      'Las distintas formas de escribir dónde entró el dinero, unificadas en las cuentas reales',
      'Planes actuales reconstruidos con capital e interés, aunque hoy el interés vaya dentro de la cuota',
      'Carga de los proyectos activos con sus pagos desde 2025, aplicados a cada contrato; lo anterior entra como saldo inicial',
      'Saldos de la administración anterior de Cúcuta, separados',
      'Diferencias revisadas contrato por contrato con Jennifer y Yurley',
      'Dos semanas en paralelo con el Excel y capacitación por rol',
    ],
    entregable: 'El 100 % de los saldos sea igual al Excel y se retire el libro diario' },

  // ── Etapa 2 · Cobro y verificación ──
  { num: '06', etapa: 2, ...E2, icon: ShieldCheck, semanas: 'Semanas 8 y 9', precio: 300000, requiere: 'Cartera básica', minimo: false,
    nombre: 'Verificación de pagos con el banco',
    descripcion: 'Tesorería confirma cada pago con el movimiento del banco, no a ojo.',
    items: [
      'Bandeja de pagos por identificar, con sugerencias de a qué cliente pueden ser',
      'Aprobación en lote de los pagos que cuadran; los dudosos quedan marcados para revisar',
      'Un movimiento del banco no se puede usar dos veces ni cargar repetido',
    ],
    entregable: 'Un mes de pagos de dos cuentas quede cruzado y aprobado',
    extra: { nombre: 'Verificación automática con el banco', precio: 700000, semanas: 'Semana 17',
      descripcion: 'Menos trabajo manual donde el banco lo permite.',
      items: [
        'Lectura de los avisos de pago que el banco manda por correo, como prueba en las cuentas de Mizar',
        'Medición de cuántos pagos se confirmaron sin intervención',
      ] } },
  { num: '07', etapa: 2, ...E2, icon: MessageSquare, semanas: 'Semanas 9 y 10', precio: 800000, requiere: 'Cartera básica y 06', minimo: false,
    nombre: 'Pagos reportados por WhatsApp',
    descripcion: 'El cliente reporta su pago desde el chat y recibe su recibo sin llamar.',
    items: [
      'Opción «Reportar pago» con el valor, la cuenta y el comprobante',
      'Lo puede enviar el cliente o una persona autorizada por él',
      'Se rechaza un comprobante repetido y se marcan los que no cuadran',
      'El reporte llega a la bandeja de tesorería y se cruza con el banco',
      'Recibo automático al cliente cuando se aprueba',
      'El cliente puede pedir su estado de cuenta por el mismo chat',
    ],
    entregable: 'Un pago reportado por un cliente y otro por un tercero queden cruzados con el banco y con su recibo enviado',
    extra: { nombre: 'Link de pago', precio: 600000, semanas: 'Semana 17',
      descripcion: 'Para quien prefiera pagar en línea; cada pago tiene comisión.',
      items: [
        'Un link con el valor de la cuota o del saldo, enviado por WhatsApp',
        'El pago se confirma y se aplica solo, con su recibo',
        'Una pasarela por cada sociedad que lo use, con la comisión a cargo de Mizar',
      ] } },
  { num: '08', etapa: 2, ...E2, icon: TriangleAlert, semanas: 'Semanas 10 y 11', precio: 980000, requiere: 'Cartera básica', minimo: false,
    nombre: 'Cobranza: morosos, acuerdos y casos especiales',
    descripcion: 'Saber a quién cobrar, qué prometió y cómo negociar.',
    items: [
      'Morosos al momento, por antigüedad de la deuda y por proyecto',
      'Historial de gestiones y compromisos de pago con fecha, con alerta si no se cumplen',
      'Acuerdos de pago con la misma calculadora del plan, aprobados por gerencia',
      'Suspensión temporal de pagos y refinanciación con cuota nueva',
      'Cruces de cartera: pagos que entraron a un proveedor y pagos en especie, con aprobación y avalúo',
      'Alerta de tres cuotas atrasadas en Cúcuta, con la decisión registrada',
      'Bono por referido que se paga después de la tercera cuota del referido y se anula si desiste',
      'Paz y salvo y certificados; provisión de cartera según el contador',
    ],
    entregable: 'Un acuerdo, un cruce y un bono queden aprobados de punta a punta' },
  { num: '09', etapa: 2, ...E2, icon: BellRing, semanas: 'Semana 11', precio: 600000, requiere: 'Cartera básica', minimo: false,
    nombre: 'Recordatorios por WhatsApp',
    descripcion: 'El cobro deja de depender de la memoria del equipo.',
    items: [
      'Recordatorio automático según la fecha de corte de cada cliente',
      'Primer mensaje, segundo aviso y tarea de llamada para el equipo',
      'Mensaje al buen pagador; llamada solo al que se atrasa',
      'No escribe a quien ya pagó o tiene un acuerdo vigente',
      'Solo en horarios permitidos y a quien autorizó recibir mensajes',
      'Registro de cada mensaje enviado y si llegó',
    ],
    entregable: 'Haya un mes de recordatorios en un proyecto de cada sede',
    extra: { nombre: 'Recompensas por pagar a tiempo', precio: 800000, semanas: 'Semana 18',
      descripcion: 'Premia al que paga a tiempo, con una prueba medida.',
      items: [
        'Rachas y mensajes de avance',
        'Campañas como la de la prima, con el descuento aplicado al saldo',
      ] } },

  // ── Etapa 3 · Dinero, socios y gerencia ──
  { num: '10', etapa: 3, ...E3, icon: TrendingUp, semanas: 'Semanas 12 y 13', precio: 1400000, requiere: 'Cartera básica', minimo: false,
    nombre: 'Flujo de caja e informes de gerencia',
    descripcion: 'Mes a mes, lo programado, lo recogido y lo gastado, para decidir si tomar más proyectos.',
    items: [
      'Flujo del grupo y de cada proyecto',
      'Gastos tomados de compras y caja menor, sin volver a digitarlos',
      'Gastos de un proyecto pagados por otro, con lo que se deben',
      'Egresos programados: nómina, gastos bancarios y comisiones',
      'Proyección del recaudo de los próximos 12 meses',
      'Cumplimiento del mes y punto de partida del recaudo para medir la mejora',
      'Los informes de gerencia, con descarga en Excel',
      'Gastos y flujo dentro de la vista de cada proyecto',
    ],
    entregable: 'El flujo de un mes sea igual al consolidado de gerencia' },
  { num: '11', etapa: 3, ...E3, icon: Landmark, semanas: 'Semanas 14 a 16', precio: 1250000, requiere: 'Cartera básica, 06 y 10', minimo: false,
    nombre: 'Tesorería, socios y reparto',
    descripcion: 'Todo el dinero del grupo cuadrado con los bancos, y cada socio con su informe según el porcentaje de cada fecha.',
    items: [
      'Saldo al día de cada cuenta, por sociedad, y traslados entre cuentas y sociedades con lo que se deben',
      'Salidas de compras y caja menor cruzadas con el extracto; cierre de mes con cada diferencia explicada',
      'Porcentajes de los socios por proyecto con la fecha desde la que rigen, y excepciones por lote o cliente',
      'Ingresos y gastos repartidos con el porcentaje vigente, sin fórmulas a mano',
      'Informe sencillo por socio: se recogió, se gastó, comisiones y lo que le corresponde',
      'Comisiones por proyecto y por vendedor; venta de lotes de terceros por encargo',
      'Cierre mensual del informe, que no cambia después de enviado',
      'Comprobantes contables de las comisiones y de los traslados entre cuentas y sociedades',
      'Información lista para el contador, exportable a Helisa',
    ],
    entregable: 'Un mes de dos cuentas quede conciliado al peso y el informe a socios sea igual al que hoy arma gerencia' },
];

const PRECIO_ESENCIAL = MODULOS.reduce((s, m) => s + m.precio, 0);
const PRECIO_OPCIONAL = MODULOS.reduce((s, m) => s + (m.extra?.precio ?? 0), 0);
const PRECIO_TOTAL = PRECIO_ESENCIAL + PRECIO_OPCIONAL;
// Descuento si Mizar elige todo: los 11 módulos y las 3 opciones.
const DESCUENTO_TODO_PCT = 8;
const DESCUENTO_TODO = Math.round(PRECIO_TOTAL * DESCUENTO_TODO_PCT / 100);
const PRECIO_TODO_CON_DESCUENTO = PRECIO_TOTAL - DESCUENTO_TODO;
// Descuento adicional por pagar todo por anticipado, sobre el total del alcance elegido.
const DESCUENTO_ANTICIPADO_PCT = 5;
const precioEtapa = (n: number) => MODULOS.filter(m => m.etapa === n).reduce((s, m) => s + m.precio, 0);
const opcionalEtapa = (n: number) => MODULOS.filter(m => m.etapa === n).reduce((s, m) => s + (m.extra?.precio ?? 0), 0);
const cuentaOpciones = (n: number) => MODULOS.filter(m => m.etapa === n && m.extra).length;
// Suma el precio de los módulos pedidos por su código (por ejemplo ['01', '02'])
const precioDe = (codigos: string[]) => MODULOS.filter(m => codigos.includes(m.num)).reduce((s, m) => s + m.precio, 0);
const rango = (desde: string, hasta: string) => MODULOS.filter(m => m.num >= desde && m.num <= hasta).map(m => m.num);

const CODIGOS_MINIMO = MODULOS.filter(m => m.minimo).map(m => m.num);

const cop = (n: number) => '$' + n.toLocaleString('es-CO');

// ─── ARMADOR DE PAQUETE ──────────────────────────────────────────────────────
// La selección guarda códigos de módulo ('01' a '11') y de opción ('06+', '07+', '09+', '10+').

const CODIGOS_MODULOS = MODULOS.map(m => m.num);
const CODIGOS_OPCIONES = MODULOS.filter(m => m.extra).map(m => m.num + '+');
const CODIGOS_TODO = [...CODIGOS_MODULOS, ...CODIGOS_OPCIONES];

// Qué necesita cada pieza además de la Cartera básica (que siempre va incluida).
const DEPENDE_DE: Record<string, string[]> = {
  '07': ['06'],
  '11': ['06', '10'],
  '06+': ['06'],
  '07+': ['07'],
  '09+': ['09'],
};

// Semanas que suma cada pieza elegida por encima de la Cartera básica (7 semanas).
const SEMANAS_DE: Record<string, number> = {
  '06': 2, '07': 2, '08': 2, '09': 1, '10': 2, '11': 4,
  '06+': 1, '07+': 1, '09+': 1,
};
const SEMANAS_BASE = 7;

const SELECCION_INICIAL = [...CODIGOS_MODULOS, '06+', '09+'];

const semanasDe = (sel: Set<string>) => {
  const suma = (codigos: string[]) => codigos.filter(c => sel.has(c)).reduce((s, c) => s + (SEMANAS_DE[c] ?? 0), 0);
  const deEtapa = (n: number) => MODULOS.filter(m => m.etapa === n).map(m => m.num);
  return SEMANAS_BASE + Math.min(4, suma(deEtapa(2))) + Math.min(5, suma(deEtapa(3))) + Math.min(3, suma(CODIGOS_OPCIONES));
};

const precioModulosDe = (sel: Set<string>) => MODULOS.reduce((s, m) => s + (sel.has(m.num) ? m.precio : 0), 0);
const precioOpcionesDe = (sel: Set<string>) => MODULOS.reduce((s, m) => s + (m.extra && sel.has(m.num + '+') ? m.extra.precio : 0), 0);

// Texto corto para los avisos: '06 · Verificación de pagos con el banco' o '07+ · Link de pago'
const etiquetaDe = (codigo: string) => {
  const m = MODULOS.find(x => x.num === codigo.replace('+', ''));
  if (!m) return codigo;
  return codigo.endsWith('+') ? `${codigo} · ${m.extra?.nombre ?? ''}` : `${codigo} · ${m.nombre}`;
};
const ordenDe = (c: string) => parseInt(c, 10) * 2 + (c.endsWith('+') ? 1 : 0);
const unir = (lista: string[]) => (lista.length <= 1 ? lista.join('') : `${lista.slice(0, -1).join(', ')} y ${lista[lista.length - 1]}`);
// Con una o dos piezas se muestra el nombre completo; con más, solo los códigos para que el aviso sea corto.
const listaDe = (codigos: string[]) => unir(codigos.length <= 2 ? codigos.map(etiquetaDe) : codigos);

const RUTAS: { clave: string; nombre: string; codigos: string[] }[] = [
  { clave: 'minimo', nombre: 'Paquete mínimo', codigos: CODIGOS_MINIMO },
  { clave: 'A', nombre: 'Ruta A', codigos: rango('01', '09') },
  { clave: 'B', nombre: 'Ruta B', codigos: [...CODIGOS_MINIMO, '06', '10', '11'] },
  { clave: 'C', nombre: 'Ruta C (todo)', codigos: CODIGOS_TODO },
];
const rutaDe = (clave: string) => RUTAS.find(r => r.clave === clave)!;

const ID_ARMADOR = 'armador-paquete';

// ─── LO QUE PIDIERON Y DÓNDE QUEDA ───────────────────────────────────────────
// Sale de la reunión del 23-sep-2026 y de los Excel compartidos después.

const PEDIDOS: { etapa: number; items: { pedido: string; donde: string }[] }[] = [
  { etapa: 1, items: [
    { pedido: 'Un solo registro en vez de varios Excel', donde: '03 · 05' },
    { pedido: 'Cliente y plan creados una vez, desde la promesa', donde: '02 · 03' },
    { pedido: 'Capital, interés y mora por separado', donde: '03' },
    { pedido: 'Mora con tasa configurable y abonos a capital', donde: '03' },
    { pedido: 'Estado de cuenta al digitar la cédula', donde: '03' },
    { pedido: 'Recibos y soportes guardados, no en carpetas', donde: '03' },
    { pedido: 'Administración anterior de Cúcuta, aparte', donde: '03 · 05' },
    { pedido: 'Ver cada proyecto: programado frente a pagado', donde: '04' },
  ] },
  { etapa: 2, items: [
    { pedido: 'Pagos confirmados con el banco y pagos sin identificar', donde: '06' },
    { pedido: 'Reporte de pago por WhatsApp, sin soportes repetidos', donde: '07' },
    { pedido: 'Morosos a pedido', donde: '08' },
    { pedido: 'Acuerdos de pago con la misma calculadora', donde: '08' },
    { pedido: 'Regla de tres cuotas y bono por referido de Cúcuta', donde: '08' },
    { pedido: 'Recordatorios automáticos por fecha de corte', donde: '09' },
    { pedido: 'Campañas y rachas al estilo Duolingo', donde: '09 · opción' },
  ] },
  { etapa: 3, items: [
    { pedido: 'Flujo de caja para decidir nuevos proyectos', donde: '10' },
    { pedido: 'Varias cuentas bancarias, cuadradas con el extracto', donde: '11' },
    { pedido: 'Socios con porcentajes que cambian en el tiempo', donde: '11' },
    { pedido: 'Informe sencillo para cada socio', donde: '11' },
    { pedido: 'Comisiones de venta', donde: '11' },
  ] },
];

// ─── FUERA DE ALCANCE ────────────────────────────────────────────────────────

const FUERA = [
  { titulo: 'Gamificación avanzada', desc: 'Se propone después, con datos de recaudo para medirla.', icon: Gamepad2, tint: 'purple' },
  { titulo: 'Conexión directa con los bancos', desc: 'No existe hoy; se usa el archivo diario de cada cuenta. Bre-B con referencia y finanzas abiertas, no antes de 2028.', icon: Landmark, tint: 'blue' },
  { titulo: 'Facturación electrónica y Siigo', desc: 'Siguen en el sistema contable actual, que recibe la información.', icon: FileText, tint: 'amber' },
  { titulo: 'Informes con inteligencia artificial', desc: 'Paso siguiente, cuando los datos ya vivan en la plataforma.', icon: Zap, tint: 'gold' },
];


// ─── TÉRMINOS ────────────────────────────────────────────────────────────────

const TERMINOS: { titulo: string; desc: string; icon: React.ElementType }[] = [
  { titulo: 'Aceptación', desc: 'Mizar confirma por WhatsApp, correo o de palabra qué etapas contrata. Luego se firma el contrato y se hace el primer pago.', icon: CheckCircle },
  { titulo: 'Contratación y pago', desc: 'Las etapas se contratan juntas o una a una, pero siempre se empieza por la Cartera básica (01 a 05). El pago se hace de una de dos formas: 50 % al iniciar y 50 % al entregar, o el total por anticipado con 5 % de descuento adicional.', icon: FileText },
  { titulo: 'Pago mensual (por confirmar)', desc: '$150.000 adicionales al mes sobre lo que Mizar ya paga por la plataforma, desde que el primer módulo entra en uso.', icon: Clock },
  { titulo: 'WhatsApp y pasarela', desc: 'Las tarifas de Meta por mensaje y, si se contrata el link de pago, la comisión de la pasarela las asume Mizar al costo, sin margen de Sixteam.', icon: MessageSquare },
  { titulo: 'Duración', desc: '16 semanas lo esencial; 19 con todas las opciones; arranca cuando compras esté en uso.', icon: Calendar },
  { titulo: 'Lo que aporta Mizar', desc: 'Los Excel actuales (el Excel de Cúcuta y el consolidado, antes de la semana 2), una promesa y un contrato de ejemplo, las cuentas de cada sociedad y una persona responsable por sede.', icon: ClipboardList },
  { titulo: 'Datos personales y cobranza', desc: 'Mizar cuenta con la autorización de sus clientes para escribirles; sin autorización no salen recordatorios.', icon: ShieldCheck },
  { titulo: 'Soporte', desc: 'Respuesta en máximo 4 horas hábiles por WhatsApp o correo. Garantía de 30 días desde cada entrega.', icon: Shield },
  { titulo: 'Cambios de alcance', desc: 'Lo que no está en esta propuesta se cotiza aparte.', icon: AlertCircle },
  { titulo: 'Propiedad y confidencialidad', desc: 'Los datos son de Mizar. Sixteam guarda total confidencialidad durante el contrato y después.', icon: Lock },
  { titulo: 'Vigencia', desc: '30 días calendario desde su emisión.', icon: Stamp },
];

// ─── SECCIONES NAV ───────────────────────────────────────────────────────────

const SECCIONES = [
  { id: 'resumen',    label: 'Resumen'     },
  { id: 'beneficios', label: 'Beneficios'  },
  { id: 'demo',       label: 'Demo'        },
  { id: 'pedidos',    label: 'Lo pedido'   },
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
  const [seleccion, setSeleccion] = useState<Set<string>>(() => new Set(SELECCION_INICIAL));
  const [detalles, setDetalles] = useState<Set<string>>(() => new Set());
  const [rutasAbiertas, setRutasAbiertas] = useState(false);
  const alternarDetalle = (c: string) => setDetalles(prev => { const n = new Set(prev); if (n.has(c)) n.delete(c); else n.add(c); return n; });
  const [aviso, setAviso] = useState<string | null>(null);

  const totalModulos = precioModulosDe(seleccion);
  const totalOpciones = precioOpcionesDe(seleccion);
  const nModulos = CODIGOS_MODULOS.filter(c => seleccion.has(c)).length;
  const nOpciones = CODIGOS_OPCIONES.filter(c => seleccion.has(c)).length;
  const semanasElegidas = semanasDe(seleccion);
  const eligioTodo = CODIGOS_TODO.every(c => seleccion.has(c));
  const subtotal = totalModulos + totalOpciones;
  const descuento = eligioTodo ? DESCUENTO_TODO : 0;
  const totalFinal = subtotal - descuento;
  const pagoInicial = Math.round(totalFinal / 2);
  const totalAnticipado = Math.round(totalFinal * (1 - DESCUENTO_ANTICIPADO_PCT / 100));
  const subtotalEtapa = (n: number) => MODULOS.filter(m => m.etapa === n)
    .reduce((s, m) => s + (seleccion.has(m.num) ? m.precio : 0) + (m.extra && seleccion.has(m.num + '+') ? m.extra.precio : 0), 0);
  const etapaIncluida = (n: number) => MODULOS.some(m => m.etapa === n && (seleccion.has(m.num) || (m.extra && seleccion.has(m.num + '+'))));

  // Marca o desmarca una pieza respetando lo que necesita cada una.
  const alternar = (codigo: string) => {
    if (CODIGOS_MINIMO.includes(codigo)) return; // la Cartera básica siempre va
    const sel = new Set(seleccion);
    if (!sel.has(codigo)) {
      const agregados: string[] = [];
      const pedir = (c: string) => {
        for (const r of DEPENDE_DE[c] ?? []) {
          if (sel.has(r)) continue;
          pedir(r);
          sel.add(r);
          agregados.push(r);
        }
      };
      sel.add(codigo);
      pedir(codigo);
      if (agregados.length === 0) setAviso(null);
      else if (agregados.length === 1) setAviso(`Se agregó ${etiquetaDe(agregados[0])}, porque ${codigo} lo necesita.`);
      else setAviso(`Se agregaron ${listaDe([...agregados].sort((a, b) => ordenDe(a) - ordenDe(b)))}, porque ${codigo} los necesita.`);
    } else {
      const quitados: string[] = [];
      const quitar = (c: string) => {
        for (const [k, reqs] of Object.entries(DEPENDE_DE)) {
          if (reqs.includes(c) && sel.has(k)) {
            sel.delete(k);
            quitados.push(k);
            quitar(k);
          }
        }
      };
      sel.delete(codigo);
      quitar(codigo);
      if (quitados.length === 0) setAviso(null);
      else if (quitados.length === 1) setAviso(`Se quitó ${etiquetaDe(quitados[0])}, porque necesita ${codigo}.`);
      else setAviso(`Se quitaron ${listaDe([...quitados].sort((a, b) => ordenDe(a) - ordenDe(b)))}, porque necesitan ${codigo}.`);
    }
    setSeleccion(sel);
  };

  const irAlArmador = () => {
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(ID_ARMADOR)?.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' });
  };
  const armar = (codigos: string[], texto: string) => {
    setSeleccion(new Set(codigos));
    setAviso(texto);
    irAlArmador();
  };
  const armarRuta = (clave: string) => {
    const r = rutaDe(clave);
    armar(r.codigos, `Paquete armado: ${r.nombre}.`);
  };

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
  const s5 = useVisible(); const s6 = useVisible(); const s7 = useVisible(); const s9 = useVisible();

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
                  {['1. Resumen','2. Lo que cambia','3. Pruebe la demo','4. Lo que pidieron','5. Alcance','6. Módulos e inversión','7. Términos'].map((item, i) => (
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
          <TagLabel>01 · Resumen</TagLabel>
          <SectionTitle>Un solo sistema para el dinero que entra</SectionTitle>
          <Rule />

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-8">
            <p>
              Hoy la cartera de Mizar y de Mi Lote vive en varios Excel que no se hablan entre sí y que el equipo llena a mano, pago por pago. Proponemos reemplazarlos por un sistema dentro de la <strong className="text-white/90 font-semibold">Plataforma Mizar</strong>, donde ya funcionan compras y caja menor.
            </p>
          </div>

          <div className="rounded-2xl p-6 sm:p-7 mb-8 relative overflow-hidden"
            style={{ background: 'rgba(201,164,67,.06)', border: '1px solid rgba(201,164,67,.22)' }}>
            <Target className="w-6 h-6 mb-3" style={{ color: MIZAR_GOLD }} />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[22px] leading-snug">
              «Saber mes a mes cuánto dinero está programado, cuánto se recogió y cuánto se puede gastar, para decidir si tomamos más proyectos.»
            </p>
            <p className="font-lato text-white/40 text-[14px] mt-3">Objetivo planteado por gerencia en la reunión del 23 de septiembre</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[
              { v: '3 etapas', s: 'Cada una deja algo funcionando' },
              { v: '16 semanas', s: 'Hasta 19 con las opciones' },
              { v: cop(PRECIO_TODO_CON_DESCUENTO), s: `Todo incluido, con ${DESCUENTO_TODO_PCT} % de descuento · por partes desde ${cop(precioDe(CODIGOS_MINIMO))}` },
            ].map((k, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
                <p className="font-poppins font-black text-white text-[24px] leading-tight">{k.v}</p>
                <p className="font-lato text-white/45 text-[14px]">{k.s}</p>
              </div>
            ))}
          </div>

          <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#00bfa5]" /> Lo que cuesta hoy trabajar en Excel
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DOLORES.map((h, i) => {
              const Icon = h.icon; const t = TINT[h.tint];
              return (
                <div key={i} className="rounded-xl p-4 flex gap-3" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                  <Icon className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: t.text }} />
                  <div>
                    <p className="font-poppins font-semibold text-white/90 text-[17px] mb-1">{h.titulo}</p>
                    <p className="font-lato text-white/50 text-[15px] leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─ 02 BENEFICIOS ─ */}
        <section id="beneficios" ref={s2.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>02 · Lo que cambia</TagLabel>
          <SectionTitle>Del Excel a un sistema conectado</SectionTitle>
          <Rule />

          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="hidden sm:grid grid-cols-[1.1fr_1.4fr_1.6fr] gap-4 px-5 py-3" style={{ background: 'rgba(255,255,255,.04)' }}>
              <span className="font-lato text-white/35 text-[12px] uppercase tracking-wider">Tema</span>
              <span className="font-lato text-[#f87171]/80 text-[12px] uppercase tracking-wider">Hoy, en Excel</span>
              <span className="font-lato text-[#00bfa5] text-[12px] uppercase tracking-wider">Con el sistema</span>
            </div>
            {ANTES_DESPUES.map((r, i) => {
              const Icon = r.icon;
              return (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-[1.1fr_1.4fr_1.6fr] gap-1.5 sm:gap-4 px-5 py-4"
                  style={{ borderTop: i ? '1px solid rgba(255,255,255,.06)' : undefined, background: 'rgba(255,255,255,.02)' }}>
                  <p className="font-poppins font-semibold text-white/85 text-[16px] flex items-center gap-2">
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: MIZAR_GOLD }} />{r.tema}
                  </p>
                  <p className="font-lato text-white/45 text-[15px] leading-snug"><span className="sm:hidden text-[#f87171]/80">Hoy: </span>{r.hoy}</p>
                  <p className="font-lato text-white/85 text-[15px] leading-snug flex gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" /><span>{r.con}</span>
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { value: '1 registro', label: 'en vez de 3 archivos' },
              { value: 'Segundos', label: 'para un estado de cuenta' },
              { value: 'Siempre', label: 'se calcula la mora' },
              { value: '0 Excel', label: 'de control al terminar' },
            ].map((k, i) => (
              <div key={i} className="rounded-xl p-4 text-center"
                style={{ background: i < 2 ? 'rgba(201,164,67,.07)' : 'rgba(0,191,165,.06)', border: i < 2 ? '1px solid rgba(201,164,67,.20)' : '1px solid rgba(0,191,165,.18)' }}>
                <p className="font-poppins font-black text-white text-[20px] leading-tight">{k.value}</p>
                <p className="font-lato text-white/45 text-[13px]">{k.label}</p>
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
                  Una demo con datos ficticios para que el equipo la pruebe. Nada de lo que se haga ahí se guarda.
                </p>
                <ul className="space-y-2.5 mb-6">
                  {[
                    'Buscar un cliente y sacar su estado de cuenta en PDF',
                    'Registrar un pago y ver la mora y el capital calculados',
                    'Aprobar pagos reportados por WhatsApp',
                    'Ver el informe a socios y el flujo de caja del grupo',
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
                Funciona en computador y celular. Datos ficticios; la tasa de mora es solo un ejemplo.
              </p>
            </div>
          </div>
        </section>

        {/* ─ 04 LO QUE PIDIERON ─ */}
        <section id="pedidos" ref={s9.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s9.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 · Lo que pidieron</TagLabel>
          <SectionTitle>Cada pedido de la reunión, resuelto</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-6">
            Lo que pidió el equipo el 23 de septiembre y el módulo donde queda.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PEDIDOS.map((g) => {
              const e = ETAPAS[g.etapa - 1];
              return (
                <div key={g.etapa} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,.03)', border: `1px solid ${e.colorBorder}` }}>
                  <p className="font-poppins font-bold text-[15px] px-4 py-3" style={{ color: e.color, background: e.colorAlpha }}>Etapa {e.num} · {e.nombre}</p>
                  <ul className="px-4 py-2">
                    {g.items.map((it, j) => (
                      <li key={j} className="flex items-start gap-2.5 py-2" style={{ borderTop: j ? '1px solid rgba(255,255,255,.05)' : undefined }}>
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: e.color }} />
                        <span className="font-lato text-white/70 text-[15px] leading-snug flex-1">{it.pedido}</span>
                        <span className="font-lato text-[11px] text-white/40 whitespace-nowrap mt-0.5">{it.donde}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─ 06 ALCANCE ─ */}
        <section id="alcance" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 · Alcance</TagLabel>
          <SectionTitle>Qué no incluye</SectionTitle>
          <Rule />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {FUERA.map((f, i) => {
              const Icon = f.icon; const t = TINT[f.tint];
              return (
                <div key={i} className="rounded-xl p-4 flex gap-3" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                  <Icon className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: t.text }} />
                  <div>
                    <p className="font-poppins font-semibold text-white/90 text-[16px]">{f.titulo}</p>
                    <p className="font-lato text-white/50 text-[15px] leading-snug">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </section>

        {/* ─ 07 INVERSIÓN ─ */}
        <section id="inversion" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 · Módulos e inversión</TagLabel>
          <SectionTitle>Cada parte con su precio.</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-4">
            Pago único por módulo entregado, en pesos colombianos. Arma tu paquete: marca lo que quieras y mira el total al instante.
          </p>
          <p className="font-lato text-white/45 text-[15px] leading-snug mb-6 flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
            <span>La Cartera básica va siempre. Si eliges algo que necesita otro módulo, lo agregamos por ti.</span>
          </p>

          <div className="no-print flex flex-wrap items-center gap-2 mb-3">
            <button type="button"
              onClick={() => armar(CODIGOS_TODO, 'Paquete armado: todo incluido.')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-lato text-[14px] text-white/70 transition-colors hover:text-white hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bfa5]"
              style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.12)' }}>
              <ListChecks className="w-4 h-4 text-[#00bfa5]" /> Elegir todo
            </button>
            <button type="button"
              onClick={() => armar(CODIGOS_MINIMO, 'Paquete armado: solo lo mínimo.')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-lato text-[14px] text-white/70 transition-colors hover:text-white hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bfa5]"
              style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.12)' }}>
              <Layers className="w-4 h-4" style={{ color: MIZAR_GOLD }} /> Solo lo mínimo
            </button>
          </div>

          <div id={ID_ARMADOR} className="rounded-2xl overflow-hidden mb-4 scroll-mt-6"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(201,164,67,.30)', boxShadow: '0 4px 32px rgba(201,164,67,.10)' }}>
            {ETAPAS.map((e) => (
              <div key={e.num}>
                <div className="flex flex-wrap items-baseline gap-x-3 px-4 sm:px-5 py-2.5" style={{ background: e.colorAlpha }}>
                  <p className="font-poppins font-bold text-[15px] w-full sm:w-auto sm:flex-1 min-w-0" style={{ color: e.color }}>Etapa {e.num} · {e.nombre}</p>
                  <p className="font-lato text-white/40 text-[13px]">{e.semanas}</p>
                  {etapaIncluida(e.num)
                    ? <p className="font-poppins font-bold text-white/80 text-[15px] whitespace-nowrap">Subtotal {cop(subtotalEtapa(e.num))}</p>
                    : <p className="font-lato text-white/45 text-[14px] whitespace-nowrap">No incluida</p>}
                  <p className="font-lato text-white/55 text-[14px] leading-snug w-full mt-1"><span className="font-semibold" style={{ color: e.color }}>Al terminarla:</span> {e.resultado}</p>
                </div>
                {MODULOS.filter(m => m.etapa === e.num).map((m) => {
                  const fijo = m.minimo;
                  const activo = fijo || seleccion.has(m.num);
                  const codigoOpcion = m.num + '+';
                  const opcionActiva = seleccion.has(codigoOpcion);
                  return (
                    <React.Fragment key={m.num}>
                      <label className={`flex items-start gap-3 px-4 sm:px-5 py-3 transition-colors focus-within:bg-white/[0.04] ${fijo ? 'cursor-default' : 'cursor-pointer hover:bg-white/[0.02]'}`}
                        style={{ borderTop: '1px solid rgba(255,255,255,.05)' }}>
                        <input type="checkbox" checked={activo} disabled={fijo} onChange={() => alternar(m.num)}
                          aria-label={`${etiquetaDe(m.num)}, ${cop(m.precio)}`}
                          className="w-5 h-5 flex-shrink-0 mt-px rounded cursor-[inherit] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                          style={{ accentColor: m.color, outlineColor: m.color }} />
                        <span className="font-poppins font-black text-[14px] w-8 flex-shrink-0 pt-0.5" style={{ color: m.color, opacity: activo ? 1 : 0.4 }}>{m.num}</span>
                        <div className="flex-1 min-w-0" style={{ opacity: activo ? 1 : 0.4 }}>
                          <p className="font-poppins font-semibold text-white/85 text-[16px] leading-snug">{m.nombre}</p>
                          <p className="font-lato text-white/35 text-[13px] leading-snug mt-0.5">Requiere: {m.requiere}</p>
                          {fijo && (
                            <span className="inline-block mt-1.5 font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                              style={{ background: 'rgba(255,255,255,.06)', border: `1px solid ${m.colorBorder}`, color: m.color }}>Incluido siempre · Cartera básica</span>
                          )}
                        </div>
                        <p className="font-poppins font-bold text-white/85 text-[16px] flex-shrink-0 whitespace-nowrap" style={{ opacity: activo ? 1 : 0.4 }}>{cop(m.precio)}</p>
                        <button type="button" onClick={(ev) => { ev.preventDefault(); alternarDetalle(m.num); }}
                          aria-expanded={detalles.has(m.num)} aria-label={(detalles.has(m.num) ? 'Ocultar' : 'Ver') + ' detalle de ' + etiquetaDe(m.num)}
                          className="no-print flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md font-lato text-[13px] text-white/55 hover:text-white hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bfa5]">
                          <span className="hidden sm:inline">Detalle</span>
                          <ChevronDown className={'w-4 h-4 transition-transform' + (detalles.has(m.num) ? ' rotate-180' : '')} />
                        </button>
                      </label>
                      {detalles.has(m.num) && (
                        <div className="pl-[4.25rem] pr-4 sm:pr-5 pb-4 -mt-1 space-y-2" style={{ opacity: activo ? 1 : 0.6 }}>
                          <p className="font-lato text-white/70 text-[15px] leading-snug">{m.descripcion}</p>
                          <ul className="space-y-1">
                            {m.items.map((it, k) => (
                              <li key={k} className="flex gap-2 font-lato text-white/60 text-[14px] leading-snug">
                                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: m.color }} />{it}
                              </li>
                            ))}
                          </ul>
                          <p className="font-lato text-white/45 text-[13px] leading-snug"><span className="text-white/60 font-semibold">{m.semanas}</span> · Se entrega cuando: {m.entregable}</p>
                        </div>
                      )}
                      {m.extra && (
                        <label className="flex items-start gap-3 px-4 sm:px-5 py-3 cursor-pointer transition-colors hover:bg-white/[0.02] focus-within:bg-white/[0.04]"
                          style={{ background: opcionActiva ? m.colorAlpha : 'transparent', borderTop: '1px solid rgba(255,255,255,.05)' }}>
                          <input type="checkbox" checked={opcionActiva} onChange={() => alternar(codigoOpcion)}
                            aria-label={`Opción ${etiquetaDe(codigoOpcion)}, ${cop(m.extra.precio)}`}
                            className="w-5 h-5 flex-shrink-0 mt-px rounded cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                            style={{ accentColor: m.color, outlineColor: m.color }} />
                          <span className="font-poppins font-black text-[14px] w-8 flex-shrink-0 pt-0.5" style={{ color: m.color, opacity: opcionActiva ? 1 : 0.4 }}>{codigoOpcion}</span>
                          <div className="flex-1 min-w-0" style={{ opacity: opcionActiva ? 1 : 0.4 }}>
                            <p className="font-poppins font-semibold text-white/85 text-[16px] leading-snug">
                              {m.extra.nombre}
                              <span className="ml-2 font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider align-middle"
                                style={{ background: 'rgba(255,255,255,.06)', border: `1px solid ${m.colorBorder}`, color: m.color }}>Opcional</span>
                            </p>
                            <p className="font-lato text-white/35 text-[13px] leading-snug mt-0.5">Requiere: {m.num}</p>
                          </div>
                          <p className="font-poppins font-bold text-[16px] flex-shrink-0 whitespace-nowrap" style={{ color: opcionActiva ? m.color : 'rgba(255,255,255,.35)', opacity: opcionActiva ? 1 : 0.6 }}>+{cop(m.extra.precio)}</p>
                        <button type="button" onClick={(ev) => { ev.preventDefault(); alternarDetalle(codigoOpcion); }}
                          aria-expanded={detalles.has(codigoOpcion)} aria-label={(detalles.has(codigoOpcion) ? 'Ocultar' : 'Ver') + ' detalle de ' + etiquetaDe(codigoOpcion)}
                          className="no-print flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md font-lato text-[13px] text-white/55 hover:text-white hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bfa5]">
                          <span className="hidden sm:inline">Detalle</span>
                          <ChevronDown className={'w-4 h-4 transition-transform' + (detalles.has(codigoOpcion) ? ' rotate-180' : '')} />
                        </button>
                        </label>
                      )}
                      {m.extra && detalles.has(codigoOpcion) && (
                        <div className="pl-[4.25rem] pr-4 sm:pr-5 pb-4 pt-1 space-y-2" style={{ background: opcionActiva ? m.colorAlpha : 'transparent', opacity: opcionActiva ? 1 : 0.6 }}>
                          {m.extra.descripcion && <p className="font-lato text-white/70 text-[15px] leading-snug">{m.extra.descripcion}</p>}
                          <ul className="space-y-1">
                            {m.extra.items.map((it, k) => (
                              <li key={k} className="flex gap-2 font-lato text-white/60 text-[14px] leading-snug">
                                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: m.color }} />{it}
                              </li>
                            ))}
                          </ul>
                          {m.extra.nota && <p className="font-lato text-white/45 text-[13px] leading-snug">{m.extra.nota}</p>}
                          <p className="font-lato text-white/45 text-[13px]"><span className="text-white/60 font-semibold">{m.extra.semanas}</span></p>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            ))}
            <div className="px-4 sm:px-5 py-4 space-y-1.5" style={{ background: 'rgba(201,164,67,.09)', borderTop: '1px solid rgba(201,164,67,.35)' }}>
              <p className="font-poppins font-semibold text-white/85 text-[15px] pb-1">
                Módulos elegidos: {nModulos} de {MODULOS.length} · Opciones: {nOpciones} de {CODIGOS_OPCIONES.length}
              </p>
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-lato text-white/55 text-[15px]">Módulos</p>
                <p className="font-poppins font-bold text-white/85 text-[17px]">{cop(totalModulos)}</p>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-lato text-white/55 text-[15px]">Opciones</p>
                <p className="font-poppins font-bold text-white/85 text-[17px]">{cop(totalOpciones)}</p>
              </div>
              {eligioTodo && (
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-lato text-[15px] text-[#00bfa5]">Descuento por elegir todo ({DESCUENTO_TODO_PCT} %)</p>
                  <p className="font-poppins font-bold text-[17px] text-[#00bfa5]">−{cop(descuento)}</p>
                </div>
              )}
              <div className="flex items-baseline justify-between gap-3 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,.08)' }}>
                <p className="font-poppins font-bold text-white text-[18px]">Total</p>
                <p className="font-poppins font-black text-[26px] leading-none" style={{ color: MIZAR_GOLD }}>
                  {eligioTodo && <span className="font-lato font-normal text-white/35 text-[15px] line-through mr-2 align-middle">{cop(subtotal)}</span>}
                  {cop(totalFinal)}
                </p>
              </div>
              {!eligioTodo && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg px-3 py-2.5 mt-1"
                  style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.22)' }}>
                  <p className="font-lato text-white/70 text-[14px] leading-snug flex-1 min-w-[200px]">
                    Si eliges todo (11 módulos y 3 opciones), el total queda en <span className="font-semibold text-white/90">{cop(PRECIO_TODO_CON_DESCUENTO)}</span>: {DESCUENTO_TODO_PCT} % menos, ahorras {cop(DESCUENTO_TODO)}.
                  </p>
                  <button type="button" onClick={() => armar(CODIGOS_TODO, `Paquete armado: todo incluido, con ${DESCUENTO_TODO_PCT} % de descuento.`)}
                    className="no-print inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-poppins font-semibold text-[14px] text-[#00bfa5] transition-colors hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bfa5]"
                    style={{ border: '1px solid rgba(0,191,165,.35)' }}>
                    Elegir todo <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-2">
                <p className="font-lato text-white/65 text-[15px] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 flex-shrink-0 text-[#00bfa5]" />
                  Duración aproximada: <span className="font-semibold text-white/90">{semanasElegidas} {semanasElegidas === 1 ? 'semana' : 'semanas'}</span>
                </p>
                <p className="font-lato text-white/65 text-[15px] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 flex-shrink-0" style={{ color: MIZAR_GOLD }} />
                  Al iniciar (50 %): <span className="font-semibold text-white/90">{cop(pagoInicial)}</span>
                </p>
              </div>
            </div>
          </div>

          <div role="status" aria-live="polite" className="mb-6">
            {aviso && (
              <p className="font-lato text-white/65 text-[15px] leading-snug flex items-start gap-2 rounded-xl px-4 py-3"
                style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.20)' }}>
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
                <span>{aviso}</span>
              </p>
            )}
          </div>

          {/* Paquete mínimo y compra por partes */}
          <div className="rounded-2xl mb-6 overflow-hidden" style={{ background: 'rgba(201,164,67,.05)', border: '1px solid rgba(201,164,67,.25)' }}>
            <button type="button" onClick={() => setRutasAbiertas(a => !a)} aria-expanded={rutasAbiertas} aria-controls="rutas-compra"
              className="w-full flex items-center gap-2 px-5 sm:px-6 py-4 text-left transition-colors hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#00bfa5]">
              <Layers className="w-5 h-5 flex-shrink-0" style={{ color: MIZAR_GOLD }} />
              <span className="font-poppins font-semibold text-white/85 text-[17px] flex-1">Paquete mínimo y compra por partes</span>
              <span className="no-print hidden sm:inline font-lato text-[13px] text-white/55">{rutasAbiertas ? 'Ocultar' : 'Ver'}</span>
              <ChevronDown className={'no-print w-5 h-5 flex-shrink-0 text-white/55 transition-transform' + (rutasAbiertas ? ' rotate-180' : '')} />
            </button>

            {rutasAbiertas && (
            <div id="rutas-compra" className="px-5 sm:px-6 pb-5 sm:pb-6">
            <div className="rounded-xl p-4 mb-3" style={{ background: 'rgba(201,164,67,.08)', border: `1px solid ${ETAPAS[0].colorBorder}` }}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1.5">
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider self-center"
                  style={{ background: 'rgba(255,255,255,.06)', border: `1px solid ${ETAPAS[0].colorBorder}`, color: MIZAR_GOLD }}>Paquete mínimo</span>
                <p className="font-poppins font-bold text-white/90 text-[16px] flex-1 min-w-0">Cartera básica (módulos 01 a 05)</p>
                <p className="font-poppins font-black text-[18px] whitespace-nowrap" style={{ color: MIZAR_GOLD }}>{cop(precioDe(CODIGOS_MINIMO))}</p>
                <p className="font-lato text-white/40 text-[13px] whitespace-nowrap">7 semanas</p>
              </div>
              <p className="font-lato text-white/60 text-[15px] leading-snug">
                Es lo mínimo para trabajar sin Excel: clientes, planes, pagos, mora, estado de cuenta y la vista de cada proyecto, con la información de hoy cargada y cuadrada. Lo demás se suma encima, en el orden que Mizar prefiera.
              </p>
              <button type="button" onClick={() => armarRuta('minimo')}
                className="no-print mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-poppins font-semibold text-[14px] transition-colors hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bfa5]"
                style={{ background: 'rgba(201,164,67,.10)', border: `1px solid ${ETAPAS[0].colorBorder}`, color: MIZAR_GOLD }}>
                Armar con esta ruta <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {[
                { l: 'A', t: 'Primero el día a día de cartera', m: '01 a 09', precio: cop(precioDe(rutaDe('A').codigos)), sem: '11 semanas', d: 'Pagos confirmados con el banco y cobro ordenado.' },
                { l: 'B', t: 'Primero flujo y socios', m: 'Cartera básica + 06 + 10 + 11', precio: cop(precioDe(rutaDe('B').codigos)), sem: '14 semanas', d: 'Flujo de caja, bancos cuadrados e informe a socios; incluye la verificación con el banco, que la tesorería necesita.' },
                { l: 'C', t: 'Todo', m: '11 módulos y 3 opciones', precio: cop(PRECIO_TODO_CON_DESCUENTO), sem: '19 semanas', d: `Precio cerrado con ${DESCUENTO_TODO_PCT} % de descuento; sin descuento serían ${cop(PRECIO_TOTAL)}.` },
              ].map((r) => (
                <div key={r.l} className="rounded-xl p-4 flex flex-col" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.09)' }}>
                  <p className="font-lato text-[12px] uppercase tracking-wider mb-1" style={{ color: MIZAR_GOLD }}>Ruta {r.l}</p>
                  <p className="font-poppins font-semibold text-white/90 text-[16px] leading-snug">{r.t}</p>
                  <p className="font-lato text-white/40 text-[13px] mb-1.5">{r.m}</p>
                  <p className="font-poppins font-black text-white/85 text-[18px] leading-tight">{r.precio} <span className="font-lato font-normal text-white/40 text-[13px]">· {r.sem}</span></p>
                  <p className="font-lato text-white/55 text-[14px] leading-snug mt-1.5">{r.d}</p>
                  <button type="button" onClick={() => armarRuta(r.l)}
                    className="no-print mt-3 self-start inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-poppins font-semibold text-[14px] text-white/80 transition-colors hover:text-white hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bfa5]"
                    style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.14)' }}>
                    Armar con esta ruta <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <p className="font-lato text-white/50 text-[14px] leading-snug flex items-start gap-2">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
              <span>El cobro, los recordatorios y los informes necesitan la Cartera básica: sin plan de pagos y cálculo de mora no hay a quién cobrar ni qué informar.</span>
            </p>
            </div>
            )}
          </div>

          <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#00bfa5]" /> Forma de pago
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.20)' }}>
              <p className="font-poppins font-black text-[#00bfa5] text-[22px] leading-none mb-1">1</p>
              <p className="font-poppins font-semibold text-white/85 text-[16px]">50 % al iniciar y 50 % al entregar</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-lato text-white/55 text-[14px]">Al iniciar</p>
                  <p className="font-poppins font-bold text-white/85 text-[16px]">{cop(pagoInicial)}</p>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-lato text-white/55 text-[14px]">Al entregar</p>
                  <p className="font-poppins font-bold text-white/85 text-[16px]">{cop(totalFinal - pagoInicial)}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(201,164,67,.06)', border: '1px solid rgba(201,164,67,.28)' }}>
              <p className="font-poppins font-black text-[22px] leading-none mb-1" style={{ color: MIZAR_GOLD }}>2</p>
              <p className="font-poppins font-semibold text-white/85 text-[16px]">
                Pago total por anticipado
                <span className="ml-2 font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider align-middle"
                  style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(201,164,67,.35)', color: MIZAR_GOLD }}>{DESCUENTO_ANTICIPADO_PCT} % adicional</span>
              </p>
              <div className="mt-2 space-y-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-lato text-white/55 text-[14px]">Descuento adicional</p>
                  <p className="font-poppins font-bold text-[16px]" style={{ color: MIZAR_GOLD }}>−{cop(totalFinal - totalAnticipado)}</p>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-lato text-white/55 text-[14px]">Un solo pago al iniciar</p>
                  <p className="font-poppins font-black text-[18px]" style={{ color: MIZAR_GOLD }}>{cop(totalAnticipado)}</p>
                </div>
              </div>
            </div>
          </div>
          <p className="font-lato text-white/40 text-[14px] leading-snug mb-6">
            Los valores se calculan sobre el total del alcance elegido arriba ({cop(totalFinal)}).
          </p>

          <div className="rounded-xl p-4 flex flex-wrap items-center gap-x-4 gap-y-1"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
            <Shield className="w-4 h-4 text-[#00bfa5]" />
            <p className="font-poppins font-bold text-white text-[18px]">+$150.000 <span className="font-lato font-normal text-white/45 text-[14px]">al mes por uso y soporte</span></p>
            <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{ background: 'rgba(245,158,11,.12)', border: '1px solid rgba(245,158,11,.30)', color: '#f59e0b' }}>Por confirmar</span>
            <p className="font-lato text-white/40 text-[14px] w-full">Mensajes de WhatsApp y, si se contrata el link de pago, comisión de la pasarela, al costo y a cargo de Mizar.</p>
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

        {/* ─ 08 TÉRMINOS ─ */}
        <section id="vigencia" ref={s7.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s7.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>07 · Términos</TagLabel>
          <SectionTitle>Términos de la propuesta</SectionTitle>
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
