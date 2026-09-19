import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap, BarChart3,
  AlertCircle, TrendingUp, Calendar, Info, MapPin,
  Wifi, Settings, Users, GitBranch, Layers, Rocket, Map,
  Database, MessageSquare, Bot, Compass, Sparkles, ClipboardList,
  Search, Workflow, Flag, BookOpen, Package, Headphones, Megaphone,
  Briefcase, Cpu, Scale, Ban, Inbox,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Conecty',
  tagline: 'Conectando al Viajero',
  sector: 'Telecomunicaciones · SIM & eSIM para viajeros',
  fundada: '2013',
  fecha: 'Septiembre 2026',
  lugar: 'Colombia',
  duracion: '~11 semanas',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  objetivo: 'Consultoría en transformación digital: mapeo de procesos asistido por IA sobre los flujos de valor B2C y B2B, diseño del proceso ideal y hoja de ruta de transformación 2026–2027.',
};

const CONECTY_BLUE = '#0ea5e9';
const TOTAL = 'COP 14.900.000';

const HALLAZGOS = [
  {
    titulo: 'El flujo de valor no tiene dueño',
    desc: 'Existen 18 etapas entre B2C y B2B con áreas responsables, pero ninguna persona responde por el flujo completo. Cada área optimiza su tramo y las fricciones aparecen en los empalmes: entre Comercial y Operaciones, entre SAC y TI.',
    icon: Flag, tint: 'red',
  },
  {
    titulo: 'Procesos mapeados a medias y desactualizados',
    desc: 'Hay una base de documentación levantada durante dos años y una relevantación reciente por parte de los líderes, pero con cobertura desigual: producto no está mapeado y varios procesos se ejecutan distinto a como están escritos.',
    icon: FileText, tint: 'amber',
  },
  {
    titulo: 'Sin base maestra de clientes',
    desc: 'La información vive en Panel, en un ERP externo sin acceso a la base de datos, en Siigo y en hojas de cálculo. Consolidar la lista de clientes implica descargar y cruzar archivos. Nadie ha podido responder dónde debería vivir el dato maestro.',
    icon: Database, tint: 'blue',
  },
  {
    titulo: 'Operación crítica sobre WhatsApp',
    desc: 'Las activaciones B2C y B2B se gestionan en cerca de 600 grupos de WhatsApp. El CRM resuelve el registro inicial, pero toda la gestión posterior es manual y sin trazabilidad. Las ventas siguen sin cuadrar del todo con la facturación.',
    icon: MessageSquare, tint: 'teal',
  },
  {
    titulo: 'Proyectos tecnológicos sin proceso detrás',
    desc: 'Omnicanal ya está seleccionado, el CRM en camino y Panel se quiere reconstruir desde cero. Sin el proceso mapeado, el riesgo es repetir la versión 1.0: tablas sin documentar, columnas que ya nadie usa y soluciones pensadas para una necesidad puntual.',
    icon: Cpu, tint: 'purple',
  },
  {
    titulo: 'Estructura nueva en enero, herramientas en diciembre',
    desc: 'La nueva estructura por flujos de valor arranca en 2027 y los líderes necesitan llegar con CRM y módulos core del ERP listos. La hoja de ruta debe existir antes de diciembre, no después.',
    icon: Calendar, tint: 'green',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber:  { text: '#f59e0b', bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)' },
  teal:   { text: '#00bfa5', bg: 'rgba(0,191,165,.07)',   border: 'rgba(0,191,165,.18)' },
  blue:   { text: '#0ea5e9', bg: 'rgba(14,165,233,.07)',  border: 'rgba(14,165,233,.18)' },
  red:    { text: '#f87171', bg: 'rgba(221,51,51,.07)',   border: 'rgba(221,51,51,.2)' },
  purple: { text: '#a78bfa', bg: 'rgba(167,139,250,.07)', border: 'rgba(167,139,250,.18)' },
  green:  { text: '#34d399', bg: 'rgba(52,211,153,.07)',  border: 'rgba(52,211,153,.18)' },
};

// ─── MÉTODO ──────────────────────────────────────────────────────────────────

const METODO = [
  {
    paso: '01', nombre: 'Escuchar', icon: Headphones, color: CONECTY_BLUE,
    desc: 'Entrevistas híbridas: cuestionario adaptativo por rol que cada persona responde cuando puede (15 min) y entrevista guiada grabada de 30 a 45 minutos. Nadie sale de la operación más de una hora.',
  },
  {
    paso: '02', nombre: 'Sintetizar', icon: Bot, color: '#a78bfa',
    desc: 'Un agente de IA entrenado con el contexto de Conecty transcribe, consolida respuestas, detecta contradicciones entre personas de una misma área y genera el primer borrador de la ficha de proceso y del diagrama.',
  },
  {
    paso: '03', nombre: 'Validar', icon: CheckCircle, color: '#00bfa5',
    desc: 'Taller de 60 minutos con el líder del área: se corrige el borrador en vivo. Solo lo que el líder aprueba entra a la base de conocimiento. Así la documentación nace validada, no impuesta.',
  },
  {
    paso: '04', nombre: 'Diseñar', icon: Workflow, color: '#34d399',
    desc: 'Con el As-Is validado, diseñamos el To-Be sobre la nueva estructura: dueño del flujo, acuerdos de servicio entre áreas, puntos de digitalización y dónde vive cada dato.',
  },
  {
    paso: '05', nombre: 'Priorizar', icon: Scale, color: '#f59e0b',
    desc: 'Cada fricción y oportunidad se califica por impacto en el negocio y esfuerzo de implementación, y se asigna al sistema que la resuelve: CRM, ERP, Omnicanal, automatización o cambio de práctica.',
  },
  {
    paso: '06', nombre: 'Trazar', icon: Compass, color: '#f87171',
    desc: 'Hoja de ruta 2026–2027 con hitos, dependencias y quick wins, más el plan de gestión del cambio por área para que la transformación aterrice en las personas.',
  },
];

const MARCOS = [
  { nombre: 'TOGAF ADM', uso: 'Fase de arquitectura de negocio. Nos alineamos a la práctica que Conecty ya lleva: capacidades, flujos de valor y aplicaciones.' },
  { nombre: 'BPMN 2.0', uso: 'Notación estándar para los diagramas As-Is y To-Be. Legible por líderes y directamente usable por el equipo de tecnología.' },
  { nombre: 'SIPOC + RACI', uso: 'Cada proceso con proveedores, entradas, salidas, clientes y responsables claros. Base de los acuerdos de servicio entre áreas.' },
  { nombre: 'Value Stream Mapping', uso: 'Tiempos, esperas y traspasos por etapa del flujo. Es donde se ven los cuellos de botella reales.' },
  { nombre: 'Matriz impacto / esfuerzo', uso: 'Priorización de oportunidades para que la hoja de ruta empiece por lo que más rentabilidad protege.' },
  { nombre: 'ADKAR', uso: 'Gestión del cambio ligera por área: conciencia, deseo, conocimiento, habilidad y refuerzo.' },
];

const FICHA = [
  { campo: 'Objetivo y disparador', ejemplo: 'Qué logra el proceso y qué evento lo inicia' },
  { campo: 'SIPOC', ejemplo: 'Proveedores · Entradas · Pasos · Salidas · Clientes' },
  { campo: 'Responsables (RACI)', ejemplo: 'Quién ejecuta, quién aprueba, a quién se consulta e informa' },
  { campo: 'Sistemas y datos', ejemplo: 'Qué aplicación interviene y dónde vive cada dato' },
  { campo: 'Tiempos y volúmenes', ejemplo: 'Duración, esperas, cantidad de casos por semana' },
  { campo: 'Fricciones', ejemplo: 'Dolores reportados, causa raíz e impacto' },
  { campo: 'KPI del proceso', ejemplo: 'Cómo se sabe que funciona bien' },
  { campo: 'Oportunidad digital', ejemplo: 'Qué se digitaliza, automatiza o elimina, y en qué sistema' },
  { campo: 'Control de versión', ejemplo: 'Owner, fecha, versión y estado de validación' },
];

// ─── FLUJO DE VALOR ──────────────────────────────────────────────────────────

type Etapa = { n: number; nombre: string; areas: string[]; ola: 1 | 2 | 3 };

const B2C: Etapa[] = [
  { n: 1, nombre: 'Discovery & Consideration',      areas: ['Mercadeo'],                                ola: 1 },
  { n: 2, nombre: 'Offer & Catalog',                areas: ['Comercial', 'Mercadeo'],                   ola: 1 },
  { n: 3, nombre: 'Transaction',                    areas: ['Comercial', 'Mercadeo', 'TI'],             ola: 1 },
  { n: 4, nombre: 'Delivery & Onboarding',          areas: ['Comercial', 'Operaciones', 'SAC', 'TI'],   ola: 2 },
  { n: 5, nombre: 'Activation',                     areas: ['SAC', 'TI'],                               ola: 2 },
  { n: 6, nombre: 'Service Usage',                  areas: ['Operaciones', 'TI'],                       ola: 2 },
  { n: 7, nombre: 'Customer Support & Recovery',    areas: ['SAC'],                                     ola: 3 },
  { n: 8, nombre: 'Loyalty & Retention',            areas: ['Mercadeo', 'Comercial', 'SAC'],            ola: 3 },
];

const B2B: Etapa[] = [
  { n: 1,  nombre: 'Prospecting',                   areas: ['Comercial', 'Mercadeo'],                   ola: 1 },
  { n: 2,  nombre: 'Commercial Offer',              areas: ['Comercial', 'Operaciones'],                ola: 1 },
  { n: 3,  nombre: 'Negotiation & Signature',       areas: ['Comercial'],                               ola: 1 },
  { n: 4,  nombre: 'Onboarding',                    areas: ['Comercial', 'TI'],                         ola: 2 },
  { n: 5,  nombre: 'Provisioning & Replenishment',  areas: ['Comercial', 'Operaciones'],                ola: 2 },
  { n: 6,  nombre: 'Partner Sale Capture',          areas: ['Comercial', 'TI'],                         ola: 2 },
  { n: 7,  nombre: 'Activation',                    areas: ['SAC', 'TI'],                               ola: 2 },
  { n: 8,  nombre: 'Partner Usage Visibility',      areas: ['Operaciones', 'TI'],                       ola: 2 },
  { n: 9,  nombre: 'B2B Support',                   areas: ['SAC'],                                     ola: 3 },
  { n: 10, nombre: 'Management & Renewal',          areas: ['Comercial', 'Mercadeo'],                   ola: 3 },
];

const AREA_STYLE: Record<string, { bg: string; color: string; icon: React.ElementType }> = {
  Mercadeo:    { bg: 'rgba(14,165,233,.14)',  color: '#38bdf8', icon: Megaphone },
  Comercial:   { bg: 'rgba(250,204,21,.14)',  color: '#fde047', icon: Briefcase },
  Operaciones: { bg: 'rgba(52,211,153,.14)',  color: '#34d399', icon: Package },
  SAC:         { bg: 'rgba(29,112,162,.25)',  color: '#93c5fd', icon: Headphones },
  TI:          { bg: 'rgba(255,255,255,.10)', color: '#d1d5db', icon: Cpu },
};

const OLA_STYLE: Record<number, { color: string; label: string }> = {
  1: { color: CONECTY_BLUE, label: 'Ola 1' },
  2: { color: '#00bfa5',    label: 'Ola 2' },
  3: { color: '#34d399',    label: 'Ola 3' },
};

// ─── OLAS (PLAN) ─────────────────────────────────────────────────────────────

type Actividad = { text: string; tag?: string };

const OLAS = [
  {
    num: '00',
    nombre: 'Arranque y diseño del levantamiento',
    duracion: 'Semana 1',
    icon: Compass,
    color: '#a78bfa',
    colorAlpha: 'rgba(167,139,250,.12)',
    colorBorder: 'rgba(167,139,250,.3)',
    precio: null as string | null,
    descripcion: 'Antes de entrevistar a nadie, alineamos el método con la práctica de arquitectura que Conecty ya lleva y hacemos inventario de lo que existe. Así no se levanta dos veces lo que ya está bien documentado.',
    actividades: [
      { text: 'Kick-off con Álvaro, Andrés y Sebas: objetivos, alcance, calendario y reglas del juego', tag: 'Trabajo en conjunto' },
      { text: 'Recepción y lectura de la documentación de arquitectura de Conecty: capacidades (300 / 107 core), flujos de valor, estructura aprobada y fricciones ya identificadas' },
      { text: 'Inventario y diagnóstico de la documentación de procesos existente por área: cobertura, vigencia y formato' },
      { text: 'Integración del mapeo B2B comercial entregado en la consultoría CRM como punto de partida de las etapas 1 a 3 del flujo B2B' },
      { text: 'Configuración del agente de entrevistas con el contexto Conecty: glosario, flujos, sistemas, estructura' },
      { text: 'Formato de ficha de proceso acordado con Conecty y plan de entrevistas por área' },
    ] as Actividad[],
    entregables: ['Inventario y diagnóstico documental por área', 'Plan de levantamiento y calendario de entrevistas', 'Formato de ficha de proceso aprobado'],
  },
  {
    num: '01',
    nombre: 'Front del flujo: demanda y venta',
    duracion: 'Semanas 2 – 4',
    icon: Megaphone,
    color: CONECTY_BLUE,
    colorAlpha: 'rgba(14,165,233,.12)',
    colorBorder: 'rgba(14,165,233,.3)',
    precio: 'COP 4.100.000',
    descripcion: 'Etapas 1 a 3 de ambos flujos: cómo Conecty genera demanda, presenta la oferta y cierra la transacción. Aquí intervienen Mercadeo, Comercial (B2C y B2B) y TI en la transacción. Es donde entran los leads del Omnicanal y donde el CRM empieza a operar.',
    actividades: [
      { text: 'Hasta 8 entrevistas híbridas con Mercadeo, Comercial B2C y B2B y TI' },
      { text: 'Síntesis con IA, detección de contradicciones y borradores de fichas y diagramas' },
      { text: 'Talleres de validación con los líderes de Mercadeo y Comercial', tag: 'Trabajo en conjunto' },
      { text: 'Actualización del mapeo B2B comercial ya entregado e integración al flujo de valor completo. No se cobra de nuevo' },
      { text: 'Mapa de sistemas y datos del front: web, app, Omnicanal, CRM, pasarela' },
    ] as Actividad[],
    entregables: ['Fichas de proceso As-Is de 6 etapas (B2C 1–3, B2B 1–3)', 'Diagramas BPMN As-Is del front', 'Matriz de fricciones y oportunidades del front', 'Requerimientos preliminares para Omnicanal y CRM'],
  },
  {
    num: '02',
    nombre: 'Núcleo operativo: entrega, aprovisionamiento y activación',
    duracion: 'Semanas 4 – 7',
    icon: Package,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.3)',
    precio: 'COP 5.000.000',
    descripcion: 'El corazón del negocio: onboarding, aprovisionamiento, captura de venta del partner, activación y visibilidad de uso. De aquí sale el margen de la compañía y aquí viven la mayoría de los procesos del ERP. Es la ola más densa y la que más valor deja para Panel 2.0.',
    actividades: [
      { text: 'Hasta 12 entrevistas híbridas con Operaciones, SAC (activaciones), TI (Panel, motor de aprovisionamiento, integraciones API, marca blanca) y Comercial (onboarding)' },
      { text: 'Levantamiento de la gestión por WhatsApp: qué se pide, qué se responde, qué se pierde' },
      { text: 'Mapa de datos del core: dónde vive hoy cada dato y dónde debería vivir la base maestra de clientes, productos y planes' },
      { text: 'Punto de contacto con facturación (Siigo): por qué ventas y facturación no cuadran y qué dato falta en el flujo' },
      { text: 'Talleres de validación con los líderes de Operaciones, SAC y TI', tag: 'Trabajo en conjunto' },
    ] as Actividad[],
    entregables: ['Fichas de proceso As-Is de 8 etapas (B2C 4–6, B2B 4–8)', 'Diagramas BPMN As-Is del core', 'Mapa de sistemas y datos del núcleo operativo', 'Requerimientos preliminares para ERP / Panel 2.0: inventario, productos, aprovisionamiento'],
  },
  {
    num: '03',
    nombre: 'Posventa: soporte, fidelización y renovación',
    duracion: 'Semanas 7 – 8',
    icon: Headphones,
    color: '#34d399',
    colorAlpha: 'rgba(52,211,153,.10)',
    colorBorder: 'rgba(52,211,153,.3)',
    precio: 'COP 2.400.000',
    descripcion: 'Las etapas que sostienen el ingreso recurrente: soporte y recuperación B2C, soporte B2B, lealtad y renovación. Aquí se define cómo debe operar el equipo de soporte sobre Omnicanal, que hoy está seleccionado sin proceso detrás.',
    actividades: [
      { text: 'Hasta 5 entrevistas híbridas con SAC, Mercadeo y Comercial' },
      { text: 'Levantamiento del proceso de soporte y su relación con Omnicanal' },
      { text: 'Taller de validación con el líder de SAC', tag: 'Trabajo en conjunto' },
      { text: 'Consolidación de la matriz de fricciones y oportunidades: 18 de 18 etapas cubiertas' },
    ] as Actividad[],
    entregables: ['Fichas de proceso As-Is de 4 etapas (B2C 7–8, B2B 9–10)', 'Diagramas BPMN As-Is de posventa', 'Matriz consolidada de fricciones y oportunidades del flujo completo', 'Requerimientos de proceso para la herramienta Omnicanal'],
  },
  {
    num: '04',
    nombre: 'Diseño To-Be, hoja de ruta y transferencia',
    duracion: 'Semanas 9 – 11',
    icon: Map,
    color: '#f59e0b',
    colorAlpha: 'rgba(245,158,11,.10)',
    colorBorder: 'rgba(245,158,11,.3)',
    precio: 'COP 3.400.000',
    descripcion: 'Con los 18 procesos validados, diseñamos cómo debería funcionar Conecty sobre la nueva estructura y trazamos la hoja de ruta. Todo queda en una base de conocimiento que los líderes pueden actualizar y consultar con IA.',
    actividades: [
      { text: 'Dos talleres To-Be, uno por flujo de valor: dueño del flujo, acuerdos de servicio entre áreas, puntos de digitalización', tag: 'Trabajo en conjunto' },
      { text: 'Priorización de oportunidades por impacto y esfuerzo, asignadas al sistema que las resuelve: CRM, ERP, Omnicanal, automatización o práctica' },
      { text: 'Requerimientos de arquitectura consolidados como insumo directo para el equipo de tecnología y la práctica de arquitectura empresarial' },
      { text: 'Hoja de ruta 2026–2027 con hitos: CRM en producción, módulos core del ERP, nueva estructura en enero, Omnicanal' },
      { text: 'Plan de gestión del cambio por área alineado a la nueva estructura' },
      { text: 'Base de conocimiento de procesos entregada con paquete de contexto para IA y guía de actualización para líderes' },
      { text: 'Presentación ejecutiva a dirección', tag: 'Trabajo en conjunto' },
    ] as Actividad[],
    entregables: ['Flujos To-Be B2C y B2B en BPMN con SLAs entre áreas', 'Backlog priorizado de transformación', 'Requerimientos de arquitectura consolidados', 'Hoja de ruta 2026–2027', 'Plan de gestión del cambio', 'Base de conocimiento consultable por IA'],
  },
];

// ─── ENTREGABLES ─────────────────────────────────────────────────────────────

const ENTREGABLES = [
  {
    grupo: 'Parciales · al cierre de cada ola',
    icon: ClipboardList,
    color: CONECTY_BLUE,
    items: [
      { nombre: 'Inventario y diagnóstico documental', desc: 'Qué existe por área, qué tan vigente está y qué se reutiliza. Evita levantar dos veces lo mismo.' },
      { nombre: 'Fichas de proceso As-Is', desc: 'Una por etapa del flujo de valor con SIPOC, RACI, sistemas, datos, tiempos, fricciones y KPI. 18 fichas al final de la ola 3.' },
      { nombre: 'Diagramas BPMN As-Is', desc: 'Cómo funciona hoy cada etapa, validado por el líder del área.' },
      { nombre: 'Matriz de fricciones y oportunidades', desc: 'Dolores documentados con causa raíz, impacto, esfuerzo y sistema que los resuelve. Se acumula ola a ola.' },
      { nombre: 'Mapa de sistemas y datos', desc: 'Qué aplicación interviene en cada etapa y dónde vive cada dato. Responde dónde debe quedar la base maestra.' },
      { nombre: 'Requerimientos preliminares por sistema', desc: 'Lo que cada ola deja claro para Omnicanal, CRM y ERP / Panel 2.0. El equipo de tecnología no espera al final para empezar.' },
    ],
  },
  {
    grupo: 'Finales · al cierre del proyecto',
    icon: Flag,
    color: '#f59e0b',
    items: [
      { nombre: 'Flujos To-Be B2C y B2B', desc: 'Cómo debe funcionar cada flujo sobre la nueva estructura: dueño del flujo, acuerdos de servicio entre áreas y puntos de digitalización.' },
      { nombre: 'Backlog priorizado de transformación', desc: 'Oportunidades calificadas por impacto y esfuerzo, con quick wins separados de las iniciativas estructurales.' },
      { nombre: 'Requerimientos de arquitectura consolidados', desc: 'Insumo directo para la práctica de arquitectura empresarial y para el equipo de tecnología: qué debe hacer cada sistema y con qué datos.' },
      { nombre: 'Hoja de ruta 2026–2027', desc: 'Iniciativas, hitos, dependencias y responsables. Alineada a diciembre 2026 (CRM y core ERP) y enero 2027 (nueva estructura).' },
      { nombre: 'Plan de gestión del cambio', desc: 'Por área y por rol, con base ADKAR: qué cambia para cada persona, qué necesita saber y cómo se refuerza.' },
      { nombre: 'Base de conocimiento consultable por IA', desc: 'Toda la documentación en una estructura navegable, con paquete de contexto para que un asistente de IA responda preguntas sobre los procesos, y guía de actualización para líderes.' },
      { nombre: 'Presentación ejecutiva', desc: 'Sesión de cierre con dirección: hallazgos, To-Be, hoja de ruta y siguientes pasos.' },
    ],
  },
];

// ─── ALCANCE ─────────────────────────────────────────────────────────────────

const INCLUIDO = [
  '2 flujos de valor completos: B2C (8 etapas) y B2B (10 etapas)',
  '5 áreas en profundidad: Mercadeo, Comercial, Operaciones, SAC y TI',
  'Punto de contacto con facturación (Siigo) en la conciliación ventas–facturación',
  'Hasta 25 entrevistas híbridas y 5 talleres de validación por área',
  '2 talleres To-Be y 1 presentación ejecutiva',
  'Reutilización del mapeo B2B comercial ya entregado',
];

const NO_INCLUIDO = [
  'Mapeo en profundidad de Gestión Humana y Contabilidad (fase 2, disponible vía bolsa de horas)',
  'Implementación de herramientas: CRM, ERP, Omnicanal o desarrollo de Panel 2.0',
  'Selección de proveedores o licencias: Sixteam orienta, Conecty decide',
  'Documentación para certificaciones (ISO u otras)',
];

const INSUMOS = [
  { titulo: 'Inventario de áreas y personas', desc: 'Nombre del área, cantidad de personas y nivel estimado de documentación. Comprometido por Andrés.' },
  { titulo: 'Documentación existente', desc: 'Levantamientos previos y relevantación reciente de los líderes, con un par de ejemplos de formato.' },
  { titulo: 'Documentación de arquitectura', desc: 'Capacidades, flujos de valor, estructura aprobada y fricciones ya identificadas por Álvaro.' },
  { titulo: 'Agenda de líderes', desc: 'Cerca de 2 horas por semana por líder durante su ola. Las entrevistas individuales se hacen cuando cada persona pueda.' },
  { titulo: 'Un punto de contacto', desc: 'Álvaro como contraparte para destrabar agendas, validar entregables y aprobar cada ola.' },
];

const SECCIONES = [
  { id: 'resumen',     label: 'Resumen' },
  { id: 'objetivo',    label: 'Objetivo' },
  { id: 'metodo',      label: 'Método' },
  { id: 'plan',        label: 'Plan' },
  { id: 'entregables', label: 'Entregables' },
  { id: 'alcance',     label: 'Alcance' },
  { id: 'cotizacion',  label: 'Inversión' },
  { id: 'vigencia',    label: 'Vigencia' },
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

const AreaChip = ({ area }: { area: string }) => {
  const s = AREA_STYLE[area];
  return (
    <span className="font-lato text-[12px] px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}33` }}>
      {area}
    </span>
  );
};

const FlujoTabla = ({ titulo, etapas, sub }: { titulo: string; etapas: Etapa[]; sub: string }) => (
  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,.08)' }}>
    <div className="px-4 py-3 flex items-center justify-between"
      style={{ background: 'rgba(14,165,233,.08)', borderBottom: '1px solid rgba(14,165,233,.15)' }}>
      <div>
        <span className="font-poppins font-black text-white text-[18px]">{titulo}</span>
        <span className="font-lato text-white/35 text-[13px] ml-2">{sub}</span>
      </div>
      <span className="font-lato text-white/30 text-[12px] uppercase tracking-wider">{etapas.length} etapas</span>
    </div>
    <div className="divide-y divide-white/5">
      {etapas.map(e => {
        const o = OLA_STYLE[e.ola];
        return (
          <div key={e.n} className="px-4 py-2.5 flex items-center gap-3">
            <span className="font-poppins font-bold text-white/30 text-[13px] w-5 flex-shrink-0 text-right">{e.n}</span>
            <span className="font-lato text-white/75 text-[15px] flex-1 min-w-0">{e.nombre}</span>
            <div className="hidden sm:flex flex-wrap gap-1 justify-end">
              {e.areas.map(a => <AreaChip key={a} area={a} />)}
            </div>
            <span className="font-poppins font-bold text-[11px] px-2 py-0.5 rounded-md flex-shrink-0"
              style={{ background: `${o.color}1a`, color: o.color, border: `1px solid ${o.color}44` }}>
              {o.label}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const ConnectyTransformacionProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [olaActiva, setOlaActiva] = useState<number | null>(1);
  const [entregableActivo, setEntregableActivo] = useState<number | null>(0);

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

  const s1 = useVisible(); const s2 = useVisible(); const s3 = useVisible(); const s4 = useVisible();
  const s5 = useVisible(); const s6 = useVisible(); const s7 = useVisible(); const s8 = useVisible();

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
            <div className="w-auto h-12 flex items-center justify-center">
              <img src="/logo-webp_180x_2x-removebg-preview.png" alt="Conecty" className="h-full w-auto object-contain"
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

        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta de consultoría y cotización</TagLabel>
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
                style={{ fontSize: 'clamp(2.4rem, 4.6vw, 4.4rem)' }}>
                Transformación<br />
                <span style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Digital
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
                  { icon: Clock,    text: META.duracion },
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
                  {['1. Resumen ejecutivo','2. Objetivo general','3. Método Sixteam','4. Plan de trabajo','5. Entregables','6. Alcance','7. Inversión','8. Vigencia y términos'].map((item, i) => (
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
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: CONECTY_BLUE, boxShadow: '0 0 6px rgba(14,165,233,.8)' }} />
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
                      style={{ filter: 'drop-shadow(0 2px 20px rgba(14,165,233,.5))' }} />
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
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Momento</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">Rediseño de estructura por flujos de valor</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Flujos de valor</p>
                <p className="font-lato text-white/60 text-[18px]">B2C · 8 etapas &nbsp;|&nbsp; B2B · 10 etapas</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Capacidades</p>
                <p className="font-lato text-white/60 text-[18px]">~300 mapeadas · 107 core</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Contrapartes</p>
                <p className="font-lato text-white/60 text-[18px]">Transformación · Tecnología · Dirección</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Antecedente Sixteam</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#00bfa5' }} />
                  <p className="font-poppins font-semibold text-[#00bfa5] text-[15px]">Consultoría CRM B2B entregada</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              Conecty está en medio de un proceso de <strong className="text-white/90 font-semibold">arquitectura empresarial</strong>: ya identificó la compañía principal detrás de las tres sociedades, mapeó sus flujos de valor y capacidades, y tiene aprobada una nueva estructura organizacional para iniciar en 2027. Lo que falta es el nivel de abajo: cómo funciona hoy, paso a paso, cada etapa de esos flujos, y cómo debería funcionar.
            </p>
            <p>
              Ese mapeo es el insumo que destraba todo lo demás. Sin él, el CRM se implementa sobre un proceso que nadie ha escrito, Panel 2.0 corre el riesgo de repetir los problemas de Panel 1.0 y el Omnicanal llega a un equipo de soporte sin procedimiento. Con él, la hoja de ruta deja de ser una lista de ideas y se convierte en decisiones priorizadas. La consultoría del canal comercial B2B que entregamos en mayo demostró el camino: primero el proceso, después la herramienta.
            </p>
          </div>

          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> Hallazgos clave de las reuniones de alineación
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HALLAZGOS.map((h, i) => {
                const Icon = h.icon; const t = TINT[h.tint];
                return (
                  <div key={i} className="rounded-xl p-4 flex gap-3" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
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
              Entregarle a Conecty una <strong className="text-white font-black">radiografía validada</strong> de cómo operan hoy las 18 etapas de sus flujos de valor B2C y B2B, el diseño de cómo deberían operar sobre la nueva estructura, y una{' '}
              <em className="not-italic" style={{ color: CONECTY_BLUE }}>hoja de ruta de transformación 2026–2027</em> con la que dirección pueda decidir qué construir, qué comprar y qué cambiar, en qué orden y por qué. Todo documentado en una base de conocimiento que los líderes puedan mantener y consultar con IA.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Etapas del flujo',  value: '18',  sub: '8 B2C + 10 B2B' },
              { label: 'Áreas en profundidad', value: '5', sub: 'Mercadeo · Comercial · Operaciones · SAC · TI' },
              { label: 'Entrevistas híbridas', value: '25', sub: 'hasta · asistidas por IA' },
              { label: 'Semanas',           value: '11',  sub: 'septiembre a diciembre 2026' },
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

        {/* ─ 03 MÉTODO ─ */}
        <section id="metodo" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — Método Sixteam</TagLabel>
          <SectionTitle>Mapeo de procesos asistido por IA</SectionTitle>
          <Rule />
          <p className="font-lato text-white/55 text-[18px] leading-relaxed mb-8">
            Tomamos lo útil de los marcos de transformación digital y descartamos la burocracia. El diferencial está en cómo levantamos la información: la inteligencia artificial hace el trabajo pesado de entrevistar, transcribir y consolidar; el consultor Sixteam y el líder de cada área ponen el criterio. El resultado es documentación que nace validada, en una fracción del tiempo que consumiría a los líderes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
            {METODO.map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={i} className="rounded-xl p-5 relative overflow-hidden"
                  style={{ background: 'rgba(255,255,255,.03)', border: `1px solid ${m.color}33` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${m.color}1f` }}>
                      <Icon className="w-4 h-4" style={{ color: m.color }} />
                    </div>
                    <div>
                      <p className="font-lato text-[11px] uppercase tracking-widest" style={{ color: m.color }}>Paso {m.paso}</p>
                      <p className="font-poppins font-bold text-white text-[18px] leading-tight">{m.nombre}</p>
                    </div>
                  </div>
                  <p className="font-lato text-white/55 text-[15px] leading-relaxed">{m.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Cómo funciona la entrevista asistida */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(167,139,250,.08) 0%, rgba(3,13,26,.9) 60%, rgba(0,191,165,.05) 100%)', border: '1px solid rgba(167,139,250,.25)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-[#a78bfa]" />
              <p className="font-poppins font-semibold text-white/80 text-[15px] uppercase tracking-wider">Qué hace la IA y qué hacen las personas</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl p-4" style={{ background: 'rgba(167,139,250,.07)', border: '1px solid rgba(167,139,250,.2)' }}>
                <p className="font-poppins font-bold text-[#a78bfa] text-[15px] mb-2 flex items-center gap-2"><Bot className="w-4 h-4" /> Agente Sixteam</p>
                <ul className="space-y-1.5">
                  {[
                    'Cuestionario adaptativo por rol: pregunta distinto a un asesor que a un líder de SAC',
                    'Transcribe las entrevistas y las cruza con la documentación existente',
                    'Detecta contradicciones: cuando dos personas describen el mismo paso de forma distinta, lo marca',
                    'Redacta el borrador de la ficha de proceso y del diagrama BPMN',
                    'Al final, responde preguntas sobre los procesos desde la base de conocimiento',
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 bg-[#a78bfa]" />
                      <span className="font-lato text-white/60 text-[15px] leading-snug">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.2)' }}>
                <p className="font-poppins font-bold text-[#00bfa5] text-[15px] mb-2 flex items-center gap-2"><Users className="w-4 h-4" /> Consultor Sixteam y líderes Conecty</p>
                <ul className="space-y-1.5">
                  {[
                    'El consultor conduce las entrevistas clave y decide qué preguntar cuando el guion no alcanza',
                    'Cada líder valida su proceso en un taller de 60 minutos; nada se publica sin su aprobación',
                    'Los talleres To-Be se hacen con las personas que van a vivir el proceso nuevo',
                    'Sixteam aporta el criterio: qué es fricción real, qué es costumbre y qué merece un sistema',
                    'Álvaro y Andrés aprueban cada ola antes de pasar a la siguiente',
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 bg-[#00bfa5]" />
                      <span className="font-lato text-white/60 text-[15px] leading-snug">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Marcos de referencia */}
          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Marcos de referencia que usamos</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
            {MARCOS.map((m, i) => (
              <div key={i} className="rounded-xl p-4 flex gap-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                <BookOpen className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: CONECTY_BLUE }} />
                <div>
                  <p className="font-poppins font-semibold text-white/85 text-[15px] mb-0.5">{m.nombre}</p>
                  <p className="font-lato text-white/45 text-[14px] leading-relaxed">{m.uso}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Ficha de proceso */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(14,165,233,.2)' }}>
            <div className="px-5 py-3 flex items-center gap-2" style={{ background: 'rgba(14,165,233,.08)', borderBottom: '1px solid rgba(14,165,233,.15)' }}>
              <ClipboardList className="w-4 h-4" style={{ color: CONECTY_BLUE }} />
              <p className="font-poppins font-semibold text-white/70 text-[13px] uppercase tracking-wider">Anatomía de una ficha de proceso Sixteam</p>
              <span className="font-lato text-white/30 text-[12px] ml-auto hidden sm:block">Una por cada etapa del flujo</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 divide-white/5">
              {FICHA.map((f, i) => (
                <div key={i} className="px-5 py-3.5" style={{ borderRight: i % 3 !== 2 ? '1px solid rgba(255,255,255,.05)' : undefined, borderBottom: i < 6 ? '1px solid rgba(255,255,255,.05)' : undefined }}>
                  <p className="font-poppins font-semibold text-white/80 text-[14px] mb-0.5">{f.campo}</p>
                  <p className="font-lato text-white/40 text-[13px] leading-snug">{f.ejemplo}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─ 04 PLAN ─ */}
        <section id="plan" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Plan de trabajo</TagLabel>
          <SectionTitle>5 olas · ~11 semanas · siguiendo el flujo de valor</SectionTitle>
          <Rule />
          <p className="font-lato text-white/55 text-[18px] leading-relaxed mb-8">
            Mapeamos por etapa del flujo de valor y no por área. Así resolvemos la preocupación de que el mapeo de Operaciones no empalme después con Mercadeo y Comercial: cada ola cubre un tramo continuo del flujo, con todas las áreas que intervienen en él. Arrancamos por el front, donde entran los leads del Omnicanal y donde va a operar el CRM, y seguimos hacia el núcleo operativo, donde nace el margen.
          </p>

          <div className="relative mb-10">
            <div className="hidden sm:block absolute left-[28px] top-10 bottom-10 w-px"
              style={{ background: 'linear-gradient(to bottom, rgba(167,139,250,.4), rgba(14,165,233,.4), rgba(0,191,165,.4), rgba(52,211,153,.4), rgba(245,158,11,.4))' }} />
            <div className="space-y-3">
              {OLAS.map((ola, i) => {
                const Icon = ola.icon;
                const open = olaActiva === i;
                return (
                  <div key={i} className="rounded-xl overflow-hidden transition-all duration-300 sm:ml-12 relative"
                    style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${ola.colorBorder}` : '1px solid rgba(255,255,255,.07)' }}>
                    <div className="hidden sm:flex absolute -left-12 top-5 w-8 h-8 rounded-full items-center justify-center border-2 z-10"
                      style={{ background: '#030d1a', borderColor: ola.color }}>
                      <span className="font-poppins font-black text-[13px]" style={{ color: ola.color }}>{ola.num}</span>
                    </div>
                    <button onClick={() => setOlaActiva(open ? null : i)}
                      className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: open ? ola.colorAlpha : 'rgba(255,255,255,.05)' }}>
                        <Icon className="w-4 h-4 transition-colors" style={{ color: open ? ola.color : 'rgba(255,255,255,.35)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`font-poppins font-bold text-[18px] ${open ? 'text-white' : 'text-white/70'}`}>{ola.nombre}</span>
                          {ola.precio && (
                            <span className="font-poppins font-bold text-[12px] px-2 py-0.5 rounded-md"
                              style={{ background: `${ola.color}1a`, color: ola.color, border: `1px solid ${ola.color}44` }}>
                              {ola.precio}
                            </span>
                          )}
                        </div>
                        <p className="font-lato text-white/40 text-[15px] mt-0.5 line-clamp-1">{ola.descripcion}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                        <div className="text-right hidden sm:block">
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: ola.colorAlpha, border: `1px solid ${ola.colorBorder}` }}>
                            <Clock className="w-3 h-3" style={{ color: ola.color }} />
                            <span className="font-poppins font-bold text-[13px]" style={{ color: ola.color }}>{ola.duracion}</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`}
                          style={{ color: open ? ola.color : 'rgba(255,255,255,.3)' }} />
                      </div>
                    </button>
                    {open && (
                      <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                        <div className="pt-4">
                          <p className="font-lato text-white/60 text-[17px] leading-relaxed mb-4">{ola.descripcion}</p>
                          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Actividades</p>
                          <ul className="space-y-2 mb-5">
                            {ola.actividades.map((a, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: ola.color }} />
                                <span className="font-lato text-white/65 text-[17px] flex-1">{a.text}
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
                          <div className="rounded-xl p-4" style={{ background: `${ola.color}0d`, border: `1px solid ${ola.color}33` }}>
                            <p className="font-poppins font-semibold text-[13px] uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: ola.color }}>
                              <Package className="w-3.5 h-3.5" /> Entregables de la ola
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {ola.entregables.map((e, j) => (
                                <span key={j} className="font-lato text-[14px] px-3 py-1.5 rounded-full text-white/75"
                                  style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)' }}>
                                  {e}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl p-4 flex gap-3" style={{ background: 'rgba(14,165,233,.06)', border: '1px solid rgba(14,165,233,.2)' }}>
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: CONECTY_BLUE }} />
              <p className="font-lato text-white/55 text-[16px] leading-relaxed">
                Las <strong className="text-white/80">olas 1, 2 y 3</strong> se solapan una semana: mientras se validan las fichas de una ola, ya se están entrevistando las personas de la siguiente. Los requerimientos preliminares de cada ola se entregan al equipo de tecnología de inmediato, para que el CRM y Panel 2.0 no esperen al cierre del proyecto.
              </p>
            </div>
            <div className="rounded-xl p-4 flex gap-3" style={{ background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.2)' }}>
              <Rocket className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#f59e0b]" />
              <p className="font-lato text-white/55 text-[16px] leading-relaxed">
                Iniciando a mediados de septiembre, la <strong className="text-white/80">hoja de ruta queda en manos de dirección a comienzos de diciembre</strong>: a tiempo para las decisiones de CRM y ERP de cierre de año y antes de que arranque la nueva estructura en enero de 2027.
              </p>
            </div>
          </div>
        </section>

        {/* ─ 05 ENTREGABLES ─ */}
        <section id="entregables" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Entregables</TagLabel>
          <SectionTitle>Qué queda en manos de Conecty</SectionTitle>
          <Rule />
          <p className="font-lato text-white/55 text-[18px] leading-relaxed mb-6">
            Cada ola cierra con entregables utilizables por sí mismos. Si Conecty decide pausar después de cualquier ola, lo entregado hasta ese punto sigue siendo válido para el equipo de tecnología y la práctica de arquitectura.
          </p>
          <div className="space-y-2.5">
            {ENTREGABLES.map((g, i) => {
              const Icon = g.icon;
              const open = entregableActivo === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${g.color}44` : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setEntregableActivo(open ? null : i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? `${g.color}20` : 'rgba(255,255,255,.05)' }}>
                      <Icon className="w-4 h-4" style={{ color: open ? g.color : 'rgba(255,255,255,.35)' }} />
                    </div>
                    <div className="flex-1">
                      <span className={`font-poppins font-bold text-[17px] ${open ? 'text-white' : 'text-white/70'}`}>{g.grupo}</span>
                      <span className="font-lato text-white/30 text-[14px] ml-3">{g.items.length} entregables</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`}
                      style={{ color: open ? g.color : 'rgba(255,255,255,.3)' }} />
                  </button>
                  {open && (
                    <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {g.items.map((it, j) => (
                          <div key={j} className="rounded-lg p-3.5" style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.06)' }}>
                            <p className="font-poppins font-semibold text-white/85 text-[15px] mb-1 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: g.color }} />
                              {it.nombre}
                            </p>
                            <p className="font-lato text-white/45 text-[14px] leading-relaxed pl-3.5">{it.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl p-4 sm:p-5 flex gap-3" style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.2)' }}>
            <Bot className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
            <div>
              <p className="font-poppins font-semibold text-white/80 text-[17px] mb-1">Formato de entrega</p>
              <p className="font-lato text-white/50 text-[15px] leading-relaxed">
                Documentos en Google Drive o Microsoft 365 según el tenant principal que Conecty defina, diagramas BPMN en formato editable, y la base de conocimiento como paquete de contexto listo para cargar en un asistente de IA, igual que entregamos la consultoría CRM. Los líderes reciben una guía de una página para actualizar su proceso sin depender de nadie.
              </p>
            </div>
          </div>
        </section>

        {/* ─ 06 ALCANCE ─ */}
        <section id="alcance" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 — Alcance</TagLabel>
          <SectionTitle>Los dos flujos de valor, etapa por etapa</SectionTitle>
          <Rule />
          <p className="font-lato text-white/55 text-[18px] leading-relaxed mb-6">
            Cada etapa se mapea con todas las áreas que intervienen en ella. La columna de la derecha indica en qué ola se levanta.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {Object.keys(AREA_STYLE).map(a => <AreaChip key={a} area={a} />)}
            <span className="font-lato text-white/30 text-[12px] self-center ml-1">Áreas responsables según el flujo de valor de Conecty</span>
          </div>
          <div className="grid grid-cols-1 gap-4 mb-10">
            <FlujoTabla titulo="B2C" etapas={B2C} sub="Viajero final · web, app y aliados" />
            <FlujoTabla titulo="B2B" etapas={B2B} sub="Distribuidores · agencias, casas de cambio, rentadoras" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="rounded-xl p-5" style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.2)' }}>
              <p className="font-poppins font-semibold text-[#00bfa5] text-[13px] uppercase tracking-wider mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Incluido</p>
              <ul className="space-y-2">
                {INCLUIDO.map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 bg-[#00bfa5]" />
                    <span className="font-lato text-white/65 text-[15px] leading-snug">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
              <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3 flex items-center gap-2"><Ban className="w-4 h-4" /> Fuera de este alcance</p>
              <ul className="space-y-2">
                {NO_INCLUIDO.map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 bg-white/30" />
                    <span className="font-lato text-white/55 text-[15px] leading-snug">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3 flex items-center gap-2"><Inbox className="w-4 h-4" /> Lo que necesitamos de Conecty</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {INSUMOS.map((it, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                <p className="font-poppins font-semibold text-white/85 text-[15px] mb-0.5">{it.titulo}</p>
                <p className="font-lato text-white/45 text-[14px] leading-relaxed">{it.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─ 07 INVERSIÓN ─ */}
        <section id="cotizacion" ref={s7.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s7.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>07 — Propuesta de inversión</TagLabel>
          <SectionTitle>Inversión por olas, con entregables en cada una</SectionTitle>
          <Rule />
          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            El proyecto se cotiza como un plan completo, pero se paga y se aprueba <strong className="text-white/75">ola por ola</strong>. Conecty conoce el total desde el inicio, controla el ritmo y recibe entregables utilizables en cada tramo. Valores en <strong className="text-white/75">pesos colombianos (COP)</strong>.
          </p>

          <div className="rounded-2xl p-7 sm:p-9 relative overflow-hidden mb-8"
            style={{ background: 'linear-gradient(135deg, rgba(0,191,165,.08) 0%, rgba(29,112,162,.08) 100%)', border: '1px solid rgba(0,191,165,.3)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,191,165,.06), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <div className="relative z-10">
              <p className="font-lato text-white/40 text-[15px] uppercase tracking-widest mb-2">Inversión total · Consultoría en transformación digital</p>
              <p className="font-poppins font-black text-white leading-none mb-3" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>{TOTAL}</p>
              <p className="font-lato text-white/40 text-[15px] mb-6">+ IVA · 4 pagos, uno por ola · ~11 semanas</p>
              <div className="flex flex-wrap gap-2">
                {[
                  '✓ 18 etapas mapeadas y validadas',
                  '✓ Entrevistas asistidas por IA',
                  '✓ Flujos To-Be con SLAs entre áreas',
                  '✓ Hoja de ruta 2026–2027',
                  '✓ Requerimientos para CRM, ERP y Omnicanal',
                  '✓ Base de conocimiento consultable por IA',
                ].map((item, i) => (
                  <span key={i} className="font-lato text-[14px] px-3 py-1.5 rounded-full text-white/70"
                    style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Desglose por ola */}
          <div className="rounded-xl overflow-hidden mb-8" style={{ border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="px-5 py-3 flex items-center gap-2" style={{ background: 'rgba(255,255,255,.04)' }}>
              <BarChart3 className="w-4 h-4 text-[#00bfa5]" />
              <p className="font-poppins font-semibold text-white/60 text-[13px] uppercase tracking-wider">Desglose y momento de pago</p>
            </div>
            <div className="divide-y divide-white/5">
              {[
                { ola: 'Ola 0 + Ola 1', nombre: 'Arranque y front del flujo', etapas: '6 etapas · Mercadeo, Comercial, TI', monto: 'COP 4.100.000', momento: 'Al aprobar la propuesta · habilita el kick-off', color: CONECTY_BLUE },
                { ola: 'Ola 2', nombre: 'Núcleo operativo', etapas: '8 etapas · Operaciones, SAC, TI, Comercial', monto: 'COP 5.000.000', momento: 'Al cerrar la ola 1 · semana 4', color: '#00bfa5' },
                { ola: 'Ola 3', nombre: 'Posventa', etapas: '4 etapas · SAC, Mercadeo, Comercial', monto: 'COP 2.400.000', momento: 'Al cerrar la ola 2 · semana 7', color: '#34d399' },
                { ola: 'Ola 4', nombre: 'To-Be, hoja de ruta y transferencia', etapas: '2 talleres To-Be · presentación ejecutiva', monto: 'COP 3.400.000', momento: 'Al cerrar la ola 3 · semana 8', color: '#f59e0b' },
              ].map((r, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center px-5 py-4 gap-2 sm:gap-4">
                  <div className="flex items-center gap-3 sm:w-3/5">
                    <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: `linear-gradient(to bottom, ${r.color}, ${r.color}33)` }} />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-poppins font-bold text-[12px] uppercase tracking-wider" style={{ color: r.color }}>{r.ola}</span>
                        <span className="font-poppins font-semibold text-white/85 text-[16px]">{r.nombre}</span>
                      </div>
                      <p className="font-lato text-white/35 text-[13px] mt-0.5">{r.etapas}</p>
                      <p className="font-lato text-white/45 text-[13px] mt-0.5">{r.momento}</p>
                    </div>
                  </div>
                  <span className="font-poppins font-black text-white sm:ml-auto text-[18px]">{r.monto}</span>
                </div>
              ))}
              <div className="flex flex-col sm:flex-row sm:items-center px-5 py-4 gap-1 sm:gap-0" style={{ background: 'rgba(0,191,165,.04)' }}>
                <span className="font-poppins font-bold text-[#00bfa5] text-[15px] sm:w-3/5 uppercase tracking-wider">Total del proyecto</span>
                <span className="font-poppins font-black text-[#00bfa5] sm:ml-auto text-[20px]">{TOTAL}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-4 sm:p-5 mb-8 flex gap-3" style={{ background: 'rgba(14,165,233,.05)', border: '1px solid rgba(14,165,233,.2)' }}>
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: CONECTY_BLUE }} />
            <div>
              <p className="font-poppins font-semibold text-white/80 text-[18px] mb-1">Por qué este esquema es el más sano para Conecty</p>
              <p className="font-lato text-white/50 text-[16px] leading-relaxed">
                Es la alternativa al taxímetro que se conversó: tiene el control de un pago por avance, pero con alcance, entregables y total definidos desde el día uno. La consultoría comercial B2B cubrió 3 etapas; aquí se cubren 18 etapas, 5 áreas y la hoja de ruta, por una fracción proporcional gracias al levantamiento asistido por IA y a la reutilización de lo ya construido. Si una ola requiere menos trabajo del previsto porque la documentación existente está en buen estado, se compensa profundizando en otra.
              </p>
            </div>
          </div>

          {/* Bolsa de horas */}
          <div className="mb-10">
            <TagLabel>Opcional — bolsa de horas</TagLabel>
            <Rule />
            <div className="rounded-xl p-5 flex flex-col gap-4" style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.22)' }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,191,165,.15)' }}>
                  <Zap className="w-4 h-4 text-[#00bfa5]" />
                </div>
                <div>
                  <p className="font-poppins font-bold text-white/85 text-[18px]">Bolsa de 10 horas de consultoría</p>
                  <p className="font-lato text-white/40 text-[13px] mt-0.5">Se activa a demanda · vigencia 3 meses desde su compra</p>
                </div>
              </div>
              <p className="font-poppins font-black text-white text-[25px] leading-none">
                COP 1.500.000
                <span className="font-lato font-normal text-white/40 text-[16px] ml-2">/ bolsa · + IVA</span>
              </p>
              <ul className="space-y-1.5">
                {[
                  'Mapeo de áreas fuera del alcance base: Gestión Humana, Contabilidad y Finanzas, Producto',
                  'Sesiones adicionales de validación o To-Be con equipos específicos',
                  'Acompañamiento a la ejecución de la hoja de ruta: revisión de diseños de Panel 2.0, arquitectura de datos, definición de integraciones',
                  'Apoyo en la gestión del cambio durante la transición a la nueva estructura',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-[#00bfa5] flex-shrink-0 mt-[3px]" />
                    <span className="font-lato text-white/55 text-[15px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Qué sigue */}
          <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[13px] uppercase tracking-wider mb-3 flex items-center gap-2"><GitBranch className="w-4 h-4 text-[#00bfa5]" /> Después de la hoja de ruta</p>
            <p className="font-lato text-white/50 text-[15px] leading-relaxed">
              La ejecución es la parte difícil, y Sixteam puede acompañarla: implementación del CRM ya cotizada, acompañamiento a la arquitectura de Panel 2.0 y a la integración con Siigo, automatización de la gestión que hoy vive en WhatsApp, y un esquema de soporte continuo tipo Sixteam Ops. Cada una se cotiza por separado a partir de lo que la hoja de ruta priorice.
            </p>
          </div>
        </section>

        {/* ── LOGOS DE CLIENTES ── */}
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
              { titulo: 'Aprobación', desc: 'Para aceptar esta propuesta y dar inicio al proyecto, se requiere confirmación vía WhatsApp, correo o verbal para habilitar el contrato a firmar y proceder con el kick-off.', icon: CheckCircle },
              { titulo: 'Términos de pago', desc: 'Cuatro pagos, uno al inicio de cada ola: COP 4.100.000 al aprobar la propuesta; COP 5.000.000 al cerrar la ola 1; COP 2.400.000 al cerrar la ola 2; COP 3.400.000 al cerrar la ola 3. Cada pago habilita la ola siguiente. Transferencia bancaria o plataforma acordada.', icon: FileText },
              { titulo: 'Cierre de cada ola', desc: 'Una ola se considera cerrada cuando Conecty recibe sus entregables y los aprueba en un plazo máximo de 5 días hábiles. Si no hay observaciones en ese plazo, se entienden aprobados.', icon: Flag },
              { titulo: 'Disponibilidad del equipo Conecty', desc: 'El cronograma depende de la agenda de líderes y personas entrevistadas. Si una ola se extiende por falta de disponibilidad, los tiempos se corren sin costo adicional siempre que el alcance se mantenga.', icon: Users },
              { titulo: 'Confidencialidad y propiedad', desc: 'Toda la documentación producida es propiedad de Conecty. Sixteam trata la información con confidencialidad y no la usa fuera del proyecto. Los agentes de IA operan sobre cuentas empresariales sin entrenamiento sobre los datos del cliente.', icon: Search },
              { titulo: 'Modificaciones al alcance', desc: 'Áreas, flujos o entregables no estipulados explícitamente se atienden vía bolsa de horas o nueva cotización, y pueden afectar los tiempos de entrega.', icon: AlertCircle },
              { titulo: 'Inicio del proyecto', desc: 'El cronograma comienza desde la recepción del primer pago y la entrega del inventario de áreas y la documentación existente.', icon: Zap },
              { titulo: 'Vigencia de la propuesta', desc: 'Esta propuesta tiene una vigencia de 30 días calendario desde su fecha de emisión. Pasado este plazo, los valores podrán ser revisados.', icon: Clock },
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

export default ConnectyTransformacionProposal;
