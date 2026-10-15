import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, ChevronDown, Clock, Calendar, MapPin, Info, Quote,
  ArrowRight, ArrowDown, ClipboardList, Database, MessagesSquare, BellRing, KeyRound,
  BarChart3, Building2, Inbox, UserCheck, Lock, Hammer, Boxes, Users, Ruler,
  CreditCard, ShieldCheck, FileText, Zap, AlertCircle, Target, Hand, Sparkles,
  Phone, Coins, Bot, Video, Wrench, Star, Gift,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────
// En los textos, **palabra** se resalta con rich()

const META = {
  cliente: 'Constructora Meetrico',
  contacto: 'Julián Valencia',
  sede: 'Caicedonia, Valle del Cauca',
  fecha: 'Octubre 2026',
  duracion: '6 semanas',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  elaboradaPor: 'Ernesto Hernández',
  cargo: 'Gerente Comercial Sixteam.pro',
};

// El logo de Meetrico es blanco y sin color de marca: usamos un tono ladrillo como acento
const MEE = '#f28c38';

// Datos que Julián compartió en la reunión del 14 de octubre de 2026
const CIFRAS = [
  { v: '3', l: 'torres', sub: 'en 6 años' },
  { v: '40', l: 'apartamentos', sub: 'por torre' },
  { v: '18', l: 'por vender', sub: 'en las torres A y B' },
  { v: '49', l: 'pasos', sub: 'del interés a la entrega' },
];

const HALLAZGOS = [
  {
    titulo: 'Todo pasa por sus manos',
    desc: 'El proceso es **muy manual** y depende de una sola persona.',
    cita: 'Hemos hecho todo como muy manual.',
    icon: Hand, color: '#f87171',
  },
  {
    titulo: 'Interesados sin registro',
    desc: 'Hoy no se sabe **cuántos interesados llegan** ni **por qué canal**.',
    cita: 'No, pues la verdad no.',
    icon: Users, color: '#fbbf24',
  },
  {
    titulo: '49 pasos sin control digital',
    desc: 'Separación, cartera, promesa, crédito, subsidio y escritura **sin un solo lugar** donde seguirlos.',
    cita: 'Desde que llega un cliente hasta que se le entrega su vivienda.',
    icon: ClipboardList, color: '#f87171',
  },
  {
    titulo: 'La sala de ventas vuelve',
    desc: 'Reabre en el **apartamento modelo**, con **Jennifer** como asesora y pauta digital.',
    cita: 'Que ella se encargue de todo.',
    icon: Sparkles, color: '#00bfa5',
  },
];

// Recorrido del cliente dentro del sistema
const FLUJO = [
  {
    titulo: 'Llegan',
    sub: 'Todos los canales',
    color: '#60a5fa',
    items: ['WhatsApp', 'Instagram', 'Facebook', 'TikTok', 'Pauta digital', 'Referidos', 'Sala de ventas'],
    chips: true,
  },
  {
    titulo: 'Se deciden',
    sub: 'Con seguimiento',
    color: '#00bfa5',
    items: ['Interesado', 'Cita agendada', 'Visita al modelo', 'Separación'],
    chips: false,
  },
  {
    titulo: 'Se acompañan',
    sub: 'Hasta las llaves',
    color: MEE,
    items: ['Cuota inicial y cartera', 'Promesa', 'Crédito y subsidio', 'Escritura', 'Entrega'],
    chips: false,
  },
];

// La base que se construye hoy y lo que se podrá conectar después
const MODULOS = [
  { nombre: 'Ventas', icon: Target, activo: true },
  { nombre: 'Obra y avance', icon: Hammer, activo: false },
  { nombre: 'Materiales y costos', icon: Boxes, activo: false },
  { nombre: 'Personal', icon: Users, activo: false },
  { nombre: 'Diseño y presupuesto en Revit', icon: Ruler, activo: false },
];

type Actividad = { text: string; tag?: string };
type Etapa = {
  semana: string;
  nombre: string;
  icon: React.ElementType;
  color: string;
  para: string;
  actividades: Actividad[];
  resultado: string;
};

const ETAPAS: Etapa[] = [
  {
    semana: 'Semana 1',
    nombre: 'Su proceso, paso a paso',
    icon: ClipboardList,
    color: '#a78bfa',
    para: 'Antes de configurar nada, entendemos **cómo vende y entrega** su constructora hoy.',
    actividades: [
      { text: 'Sesión de trabajo con **usted y Jennifer**', tag: 'Con ustedes' },
      { text: 'Recorrido por los **49 pasos**, de la separación a la entrega' },
      { text: 'Los **datos clave** de cada cliente: precio, forma de pago, crédito y subsidio' },
    ],
    resultado: '**Mapa del proceso comercial** aprobado por usted.',
  },
  {
    semana: 'Semana 2',
    nombre: 'La base del sistema',
    icon: Database,
    color: '#60a5fa',
    para: 'Construimos el lugar donde vivirá **toda la información** de clientes y apartamentos.',
    actividades: [
      { text: '**Inventario de apartamentos** por torre, con su estado: disponible, separado o vendido' },
      { text: '**Ficha del cliente** con los datos que usted necesita' },
      { text: 'Carga de los **clientes actuales** y accesos para usted y Jennifer' },
    ],
    resultado: 'Sus **clientes y apartamentos en un solo lugar**, sin hojas sueltas.',
  },
  {
    semana: 'Semana 3',
    nombre: 'Todos los canales en una bandeja',
    icon: Inbox,
    color: '#38bdf8',
    para: 'Que cada interesado llegue al sistema, **venga de donde venga**.',
    actividades: [
      { text: 'Conexión de **WhatsApp, Instagram y Facebook**, y TikTok si lo usan' },
      { text: '**Formulario de registro** para la pauta digital y para la sala de ventas' },
      { text: 'Registro de **referidos**, sabiendo quién refirió a quién' },
    ],
    resultado: 'Jennifer responde **desde una sola pantalla** y usted sabe **de dónde llega cada interesado**.',
  },
  {
    semana: 'Semana 4',
    nombre: 'Seguimiento que no se olvida',
    icon: BellRing,
    color: '#00bfa5',
    para: 'Convertir interesados en **visitas** y visitas en **separaciones**.',
    actividades: [
      { text: '**Citas en el apartamento modelo** con recordatorios automáticos' },
      { text: 'Seguimiento a quien visitó y no se decidió, con **fotos y videos del avance de obra**' },
      { text: '**Tareas y alertas** diarias para la asesora' },
    ],
    resultado: '**Ningún interesado se pierde** por falta de seguimiento.',
  },
  {
    semana: 'Semana 5',
    nombre: 'La ruta del comprador',
    icon: KeyRound,
    color: MEE,
    para: 'Llevar a cada cliente **de la separación a la entrega de llaves** con todo en orden.',
    actividades: [
      { text: 'Los **49 pasos** como etapas visibles para cada comprador' },
      { text: '**Documentos de cada cliente** archivados en su ficha: separación, promesa, crédito, subsidio y escritura' },
      { text: '**Fechas de vencimiento y alertas** de pagos y trámites' },
    ],
    resultado: 'El **expediente digital** de cada comprador, con su **avance a la vista**.',
  },
  {
    semana: 'Semana 6',
    nombre: 'Tablero y puesta en marcha',
    icon: BarChart3,
    color: '#fbbf24',
    para: 'Que usted **vea su negocio en una pantalla** y la sala de ventas arranque con todo listo.',
    actividades: [
      { text: '**Tablero de ventas**: vendidos por torre, valor vendido, créditos y subsidios' },
      { text: '**Informe descargable** con precio, forma de pago, crédito y subsidio de cada venta' },
      { text: '**Capacitación** a Jennifer y a usted, con acompañamiento en el arranque', tag: 'Con ustedes' },
    ],
    resultado: 'La **sala de ventas funcionando** sobre el sistema desde el primer día.',
  },
];

const RESULTADOS = [
  { v: '1', l: 'bandeja', sub: 'para todos los canales', icon: MessagesSquare },
  { v: '0', l: 'interesados perdidos', sub: 'por falta de seguimiento', icon: UserCheck },
  { v: '49', l: 'pasos', sub: 'con control digital', icon: ClipboardList },
  { v: '1', l: 'tablero', sub: 'para decidir con datos', icon: BarChart3 },
];

const SECCIONES = [
  { id: 'resumen',    label: 'Resumen' },
  { id: 'solucion',   label: 'Solución' },
  { id: 'plan',       label: 'Plan' },
  { id: 'inversion',  label: 'Inversión' },
  { id: 'vigencia',   label: 'Vigencia' },
];

// ─── INVERSIÓN ───────────────────────────────────────────────────────────────

const fmt = (n: number) => 'COP ' + n.toLocaleString('es-CO').replace(/,/g, '.');

const TOTAL_NUM = 5990000;
const DESCUENTO_ANTICIPADO = 5;
const AHORRO_NUM = TOTAL_NUM * DESCUENTO_ANTICIPADO / 100;
const ANTICIPADO_NUM = TOTAL_NUM - AHORRO_NUM;

// ─── DESPUÉS DE LA IMPLEMENTACIÓN ────────────────────────────────────────────

const LICENCIA_NUM = 400000;
const SMMLV_2026_NUM = 1750905;
const CREDITOS_MES = 160;
const SOLICITUDES_MES = 10;
const EXPERTOS = 3;

// Bandas estándar de consumo de créditos (5-20 / 21-50 / 51+)
const BANDAS = [
  {
    rango: '5 a 20', tipo: 'Solicitud simple', banda: 'Simple',
    ej: 'Un campo nuevo, el ajuste de un flujo ya activo, una plantilla de mensaje, un informe estándar, una capacitación o el soporte de una incidencia',
  },
  {
    rango: '21 a 50', tipo: 'Solicitud media', banda: 'Media',
    ej: 'Una automatización de seguimiento comercial, una segmentación de la base, un formulario conectado al CRM o un panel de informes nuevo',
  },
  {
    rango: '51 o más', tipo: 'Solicitud compleja', banda: 'Compleja',
    ej: 'Una integración entre sistemas, un agente de IA en producción o la migración de un módulo completo',
  },
];

const BANDA_STYLE: Record<string, { bg: string; border: string; color: string }> = {
  Simple:   { bg: 'rgba(0,191,165,.12)',  border: 'rgba(0,191,165,.3)',   color: '#00bfa5' },
  Media:    { bg: 'rgba(96,165,250,.12)', border: 'rgba(96,165,250,.3)',  color: '#60a5fa' },
  Compleja: { bg: 'rgba(242,140,56,.12)', border: 'rgba(242,140,56,.32)', color: MEE },
};

// Ejemplo de un mes: 10 solicitudes que suman exactamente los 160 créditos
const REPORTE = [
  { solicitud: 'Asistente de IA en WhatsApp que resuelve dudas y agenda citas al modelo', banda: 'Compleja', creditos: 55 },
  { solicitud: 'Seguimiento automático para el lanzamiento de la torre C',                banda: 'Media',    creditos: 25 },
  { solicitud: 'Panel de cartera y recaudo por torre',                                     banda: 'Media',    creditos: 22 },
  { solicitud: 'Formulario para una nueva campaña de pauta',                              banda: 'Simple',   creditos: 12 },
  { solicitud: 'Informe de visitas a la sala de ventas por canal',                        banda: 'Simple',   creditos: 10 },
  { solicitud: 'Campos nuevos para el trámite de subsidio',                               banda: 'Simple',   creditos: 8 },
  { solicitud: 'Ajuste al flujo de recordatorios de citas',                               banda: 'Simple',   creditos: 8 },
  { solicitud: 'Plantilla de mensaje con el avance de obra del mes',                      banda: 'Simple',   creditos: 7 },
  { solicitud: 'Capacitación a una nueva asesora',                                        banda: 'Simple',   creditos: 7 },
  { solicitud: 'Soporte de una incidencia con WhatsApp',                                  banda: 'Simple',   creditos: 6 },
];

const TOTAL_REPORTE = REPORTE.reduce((a, r) => a + r.creditos, 0);

const DISTRIBUCION = ['Compleja', 'Media', 'Simple'].map(b => ({
  banda: b,
  cantidad: REPORTE.filter(r => r.banda === b).length,
  creditos: REPORTE.filter(r => r.banda === b).reduce((a, r) => a + r.creditos, 0),
}));

const OPCIONES_POST = [
  {
    nombre: 'Licencia Plataforma CRM Sixteam',
    sub: 'Solo la plataforma',
    precio: fmt(LICENCIA_NUM),
    periodo: 'al mes + IVA',
    recomendado: false,
    items: [
      { text: '**Usuarios ilimitados**', icon: Users },
      { text: '**1 número de teléfono** conectado', icon: Phone },
      { text: 'Todo lo implementado sigue **funcionando**', icon: CheckCircle },
      { text: 'Soporte y nuevas funciones **se cotizan aparte**', icon: Info },
    ],
  },
  {
    nombre: 'Plan Integral Sixteam Ops',
    sub: 'Su propio equipo de tecnología, en la palma de su mano',
    precio: fmt(SMMLV_2026_NUM),
    periodo: 'al mes + IVA · 1 SMMLV 2026',
    recomendado: true,
    items: [
      { text: `**${CREDITOS_MES} créditos al mes**, alrededor de **${SOLICITUDES_MES} solicitudes**`, icon: Coins },
      { text: '**Licencia de la Plataforma CRM Sixteam incluida**', icon: CheckCircle },
      { text: '**Agente de IA 24/7** para preguntar lo que necesite sobre la implementación o el soporte de la plataforma', icon: Bot },
      { text: '**Sesión virtual 1 a 1 cada semana** para revisar avances, métricas de valor y seguir mejorando', icon: Video },
      { text: 'Nuevas funciones, **solución de inconvenientes** y mejoras para seguir creciendo', icon: Wrench },
    ],
  },
];

const FORMAS_PAGO = [
  {
    opcion: 'Opción 1',
    nombre: 'Dos pagos',
    etiqueta: '50% y 50%',
    valor: `2 × ${fmt(TOTAL_NUM / 2)}`,
    detalle: '50% al iniciar y 50% al finalizar la implementación',
    destacado: false,
  },
  {
    opcion: 'Opción 2',
    nombre: 'Pago anticipado',
    etiqueta: `${DESCUENTO_ANTICIPADO}% de descuento`,
    valor: fmt(ANTICIPADO_NUM),
    detalle: 'Un solo pago al iniciar la implementación',
    destacado: true,
  },
];

const INCLUYE = [
  'Mapa del proceso comercial',
  'Inventario de apartamentos',
  'Canales en una bandeja',
  'Citas y seguimiento automático',
  'Ruta del comprador',
  'Tablero e informes',
  'Capacitación',
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

// Convierte **texto** en palabra resaltada
const rich = (t: string, color = '#ffffff') =>
  t.split('**').map((s, i) => i % 2
    ? <strong key={i} className="font-semibold" style={{ color }}>{s}</strong>
    : <React.Fragment key={i}>{s}</React.Fragment>);

const Hl = ({ children, color = '#00bfa5' }: { children: React.ReactNode; color?: string }) => (
  <strong className="font-semibold" style={{ color }}>{children}</strong>
);

const TagLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="font-lato text-[#00bfa5] text-[13px] uppercase tracking-[0.22em] font-medium">{children}</span>
);
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-poppins font-extrabold text-white mt-3 mb-3 leading-[1.1]"
    style={{ fontSize: 'clamp(2rem, 4.6vw, 2.9rem)' }}>
    {children}
  </h2>
);
const Lead = ({ children }: { children: React.ReactNode }) => (
  <p className="font-lato text-white/55 text-[19px] sm:text-[20px] leading-relaxed max-w-2xl mb-12">{children}</p>
);
const Rule = () => (
  <div className="w-12 h-0.5 mb-8 mt-1" style={{ background: `linear-gradient(90deg,#1d70a2,#00bfa5)` }} />
);
const SubLabel = ({ children, icon: Icon }: { children: React.ReactNode; icon: React.ElementType }) => (
  <p className="font-poppins font-semibold text-white/60 text-[14px] uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
    <Icon className="w-4 h-4 text-[#00bfa5]" /> {children}
  </p>
);
// El logo de Meetrico es blanco, por eso va sobre fondo oscuro
const ClientLogo = ({ className = '' }: { className?: string }) => (
  <div className={`rounded-xl flex items-center justify-center ${className}`}
    style={{ background: 'linear-gradient(135deg,#0a2342,#12356b)', border: `1px solid ${MEE}4d` }}>
    <img src="/meetrico-logo.svg" alt={META.cliente} className="w-full h-auto object-contain"
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
  </div>
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const MeetricoProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [etapaActiva, setEtapaActiva] = useState<number | null>(0);
  const [pagosAbierto, setPagosAbierto] = useState(false);
  const [creditosAbierto, setCreditosAbierto] = useState(false);

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
  const s4 = useVisible(); const s5 = useVisible();

  const reveal = (v: boolean) => `transition-all duration-700 ${v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;

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
            style={{ background: 'radial-gradient(circle, rgba(242,140,56,.06) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(29,112,162,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        </div>

        <div className="relative z-10 flex items-center justify-between gap-4 px-6 py-6 md:px-12 border-b" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
          <div className="flex items-center gap-6 min-w-0">
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
            <ClientLogo className="hidden sm:flex w-32 px-3 py-2" />
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="font-lato text-[#00bfa5]/80 text-[13px] uppercase tracking-[0.2em] border border-[#00bfa5]/20 rounded-full px-3 py-1.5">Confidencial</span>
          </div>
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

        <div className="relative z-10 flex-1 flex items-center justify-center py-12 px-5 sm:px-[10%]">
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            <div className="flex flex-col justify-center">
              <TagLabel>Fase 1 · Sistema comercial</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${MEE}, #1d70a2)` }}>
                  <Building2 className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">Gerencia de {META.cliente}</span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-5"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 4.6rem)' }}>
                Propuesta<br />
                <span style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Comercial
                </span>
              </h1>
              <p className="font-lato text-white/55 text-xl leading-relaxed mb-6 max-w-xl">
                La base del <Hl color="#fff">sistema de su constructora</Hl>, empezando por lo más importante: <Hl color={MEE}>vender</Hl>.
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                  {['1. Resumen', '2. La solución', '3. Plan de trabajo', '4. Inversión', '5. Vigencia y términos'].map((item, i) => (
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
                  style={{ background: 'radial-gradient(circle, rgba(242,140,56,.12) 0%, rgba(29,112,162,.05) 50%, transparent 70%)' }} />
                <div className="cover-ring-1 absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full" style={{ border: '1px solid rgba(242,140,56,.14)' }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(29,112,162,.15)' }} />
                <div className="cover-ring-1 absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: MEE, boxShadow: '0 0 6px rgba(242,140,56,.8)' }} />
                </div>
              </div>
              <div className="cover-float relative z-10 flex flex-col items-center gap-6 w-full px-6">
                <div className="flex flex-col items-center gap-1">
                  <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-20 w-auto object-contain"
                    style={{ filter: 'drop-shadow(0 4px 20px rgba(0,191,165,.45))' }} />
                  <span className="font-poppins font-black text-white/30 text-[11px] uppercase tracking-[0.2em]">Sixteam.pro</span>
                </div>
                <div className="flex items-center gap-3 w-full max-w-xs">
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.08))' }} />
                  <div className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)' }}>
                    <span className="font-poppins font-black text-white/40 text-[20px] leading-none">×</span>
                  </div>
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,.08), transparent)' }} />
                </div>
                <div className="flex flex-col items-center gap-3">
                  <ClientLogo className="w-60 px-6 py-5 shadow-[0_4px_30px_rgba(242,140,56,.22)]" />
                  <p className="font-lato text-[13px] uppercase tracking-[0.2em] mt-1 text-center" style={{ color: MEE }}>Vivienda de interés social · Caicedonia</p>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-8 md:px-10 py-24 space-y-32 sm:space-y-40">

        {/* ─ 01 RESUMEN ─ */}
        <section id="resumen" ref={s1.ref as React.RefObject<HTMLElement>} className={reveal(s1.v)}>
          <TagLabel>01 — Resumen</TagLabel>
          <SectionTitle>Una constructora que ya vende.<br /><span className="text-white/45">Ahora, como un sistema.</span></SectionTitle>
          <Rule />
          <Lead>
            Meetrico construye <Hl color="#fff">vivienda de interés social</Hl> en Caicedonia y vende casi todo <Hl color="#fff">por referidos</Hl>. Con la sala de ventas de vuelta y los subsidios en camino, es el momento de <Hl>ordenar el proceso comercial</Hl>.
          </Lead>

          {/* Cifras */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-14">
            {CIFRAS.map((c, i) => (
              <div key={i} className="rounded-2xl px-4 py-6 text-center"
                style={{ background: i === 3 ? `${MEE}12` : 'rgba(255,255,255,.03)', border: `1px solid ${i === 3 ? `${MEE}45` : 'rgba(255,255,255,.07)'}` }}>
                <p className="font-poppins font-black leading-none mb-2" style={{ fontSize: 'clamp(2.25rem, 5vw, 3rem)', color: i === 3 ? MEE : '#fff' }}>{c.v}</p>
                <p className="font-poppins font-semibold text-white/80 text-[15px]">{c.l}</p>
                <p className="font-lato text-white/35 text-[13px] mt-0.5">{c.sub}</p>
              </div>
            ))}
          </div>

          {/* Cita */}
          <div className="py-10 sm:py-12 px-2 sm:px-8 mb-14 text-center border-y" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
            <Quote className="w-8 h-8 mx-auto mb-5" style={{ color: MEE }} />
            <p className="font-poppins font-bold text-white leading-snug max-w-2xl mx-auto" style={{ fontSize: 'clamp(1.5rem, 3.4vw, 2.1rem)' }}>
              "Yo visualizo mi empresa como <span style={{ color: MEE }}>un sistema</span>."
            </p>
            <p className="font-lato text-white/40 text-[15px] mt-4">{META.contacto} · {META.cliente}</p>
          </div>

          {/* Hallazgos */}
          <SubLabel icon={Info}>Lo que nos contó</SubLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HALLAZGOS.map((h, i) => {
              const Icon = h.icon;
              return (
                <div key={i} className="rounded-2xl p-6 flex flex-col"
                  style={{ background: `${h.color}0d`, border: `1px solid ${h.color}33` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${h.color}1f` }}>
                    <Icon className="w-5 h-5" style={{ color: h.color }} />
                  </div>
                  <p className="font-poppins font-bold text-white text-[19px] mb-2">{h.titulo}</p>
                  <p className="font-lato text-white/55 text-[16px] leading-relaxed mb-4">{rich(h.desc)}</p>
                  <p className="font-lato italic text-[15px] mt-auto pl-3" style={{ color: h.color, borderLeft: `2px solid ${h.color}` }}>"{h.cita}"</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─ 02 SOLUCIÓN ─ */}
        <section id="solucion" ref={s2.ref as React.RefObject<HTMLElement>} className={reveal(s2.v)}>
          <TagLabel>02 — La solución</TagLabel>
          <SectionTitle>Un solo lugar, del primer mensaje<br className="hidden sm:block" /> a la <span style={{ color: MEE }}>entrega de llaves</span></SectionTitle>
          <Rule />
          <Lead>
            Un sistema hecho <Hl color="#fff">a la medida de Meetrico</Hl> donde cada interesado entra, se acompaña y se registra <Hl>hasta recibir su vivienda</Hl>.
          </Lead>

          {/* Flujo */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-3 items-stretch mb-20">
            {FLUJO.map((f, i) => (
              <React.Fragment key={f.titulo}>
                <div className="rounded-2xl p-6" style={{ background: `${f.color}0d`, border: `1px solid ${f.color}40` }}>
                  <p className="font-lato text-[13px] uppercase tracking-[0.18em] mb-1" style={{ color: f.color }}>{f.sub}</p>
                  <p className="font-poppins font-black text-white text-[24px] mb-5">{f.titulo}</p>
                  {f.chips ? (
                    <div className="flex flex-wrap gap-1.5">
                      {f.items.map(it => (
                        <span key={it} className="font-lato text-[14px] px-2.5 py-1 rounded-full text-white/75"
                          style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)' }}>{it}</span>
                      ))}
                    </div>
                  ) : (
                    <ol className="space-y-2.5">
                      {f.items.map((it, j) => (
                        <li key={it} className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-poppins font-bold text-[12px]"
                            style={{ background: `${f.color}22`, color: f.color }}>{j + 1}</span>
                          <span className="font-lato text-white/75 text-[16px]">{it}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
                {i < FLUJO.length - 1 && (
                  <div className="flex items-center justify-center py-1 md:py-0">
                    <ArrowRight className="hidden md:block w-5 h-5 text-white/25" />
                    <ArrowDown className="md:hidden w-5 h-5 text-white/25" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Base para crecer */}
          <SubLabel icon={Building2}>La base para conectar toda su constructora</SubLabel>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
            {MODULOS.map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={i} className={`rounded-2xl p-5 flex flex-col items-center text-center ${i === MODULOS.length - 1 ? 'col-span-2 sm:col-span-1' : ''}`}
                  style={m.activo
                    ? { background: 'linear-gradient(135deg, rgba(0,191,165,.14), rgba(29,112,162,.10))', border: '1px solid rgba(0,191,165,.45)', boxShadow: '0 0 30px rgba(0,191,165,.12)' }
                    : { background: 'rgba(255,255,255,.02)', border: '1px dashed rgba(255,255,255,.12)' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: m.activo ? 'rgba(0,191,165,.18)' : 'rgba(255,255,255,.04)' }}>
                    {m.activo
                      ? <Icon className="w-5 h-5 text-[#00bfa5]" />
                      : <Lock className="w-4 h-4 text-white/25" />}
                  </div>
                  <p className={`font-poppins font-bold text-[15px] leading-snug ${m.activo ? 'text-white' : 'text-white/40'}`}>{m.nombre}</p>
                  <p className={`font-lato text-[12px] uppercase tracking-wider mt-1.5 ${m.activo ? 'text-[#00bfa5]' : 'text-white/25'}`}>
                    {m.activo ? 'Esta propuesta' : 'Próximas fases'}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="font-lato text-white/45 text-[16px] leading-relaxed max-w-2xl">
            Empezamos por <Hl color="#fff">las ventas</Hl>, porque sin ventas no hay obra. Sobre esta misma base se podrán conectar después <Hl color="#fff">la obra, los materiales, el personal y Revit</Hl>.
          </p>
        </section>

        {/* ─ 03 PLAN ─ */}
        <section id="plan" ref={s3.ref as React.RefObject<HTMLElement>} className={reveal(s3.v)}>
          <TagLabel>03 — Plan de trabajo</TagLabel>
          <SectionTitle>6 semanas,<br /><span style={{ color: '#00bfa5' }}>un resultado por semana</span></SectionTitle>
          <Rule />
          <Lead>
            Cada semana deja <Hl color="#fff">algo funcionando</Hl> que usted puede ver y probar. Al final, Jennifer abre la sala de ventas <Hl>con el sistema listo</Hl>.
          </Lead>

          {/* Línea de tiempo resumida */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-12">
            {ETAPAS.map((et, i) => {
              const Icon = et.icon;
              const activa = etapaActiva === i;
              return (
                <button key={i} onClick={() => setEtapaActiva(i)}
                  className="rounded-xl p-3 text-left transition-all duration-300"
                  style={{
                    background: activa ? `${et.color}1a` : 'rgba(255,255,255,.025)',
                    border: `1px solid ${activa ? `${et.color}66` : 'rgba(255,255,255,.06)'}`,
                  }}>
                  <div className="h-1 rounded-full mb-3" style={{ background: et.color, opacity: activa ? 1 : 0.45 }} />
                  <Icon className="w-4 h-4 mb-2" style={{ color: activa ? et.color : 'rgba(255,255,255,.35)' }} />
                  <p className="font-poppins font-bold text-[12px] uppercase tracking-wider" style={{ color: et.color }}>S{i + 1}</p>
                  <p className={`font-lato text-[13px] leading-snug mt-0.5 ${activa ? 'text-white/85' : 'text-white/45'}`}>{et.nombre}</p>
                </button>
              );
            })}
          </div>

          {/* Etapas desplegables */}
          <div className="space-y-3 mb-20">
            {ETAPAS.map((et, i) => {
              const Icon = et.icon;
              const open = etapaActiva === i;
              return (
                <div key={i} className="rounded-2xl overflow-hidden transition-all duration-300"
                  style={{ background: open ? 'rgba(255,255,255,.035)' : 'rgba(255,255,255,.02)', border: `1px solid ${open ? `${et.color}55` : 'rgba(255,255,255,.07)'}` }}>
                  <button onClick={() => setEtapaActiva(open ? null : i)}
                    className="w-full flex items-center gap-4 p-5 sm:p-6 text-left">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? `${et.color}22` : 'rgba(255,255,255,.05)' }}>
                      <Icon className="w-5 h-5" style={{ color: open ? et.color : 'rgba(255,255,255,.4)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-poppins font-bold text-[13px] uppercase tracking-wider mb-0.5" style={{ color: et.color }}>{et.semana}</p>
                      <p className={`font-poppins font-bold text-[19px] sm:text-[21px] leading-tight ${open ? 'text-white' : 'text-white/75'}`}>{et.nombre}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`}
                      style={{ color: open ? et.color : 'rgba(255,255,255,.3)' }} />
                  </button>
                  {open && (
                    <div className="px-5 sm:px-6 pb-6 pt-1">
                      <p className="font-lato text-white/65 text-[18px] leading-relaxed mb-5 sm:pl-[60px]">{rich(et.para)}</p>
                      <ul className="space-y-2.5 mb-6 sm:pl-[60px]">
                        {et.actividades.map((a, j) => (
                          <li key={j} className="flex items-start gap-2.5">
                            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: et.color }} />
                            <span className="font-lato text-white/60 text-[16px] leading-relaxed flex-1">{rich(a.text, 'rgba(255,255,255,.9)')}
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
                      <div className="rounded-xl px-4 py-3.5 flex items-start gap-3 sm:ml-[60px]"
                        style={{ background: `${et.color}12`, border: `1px solid ${et.color}40` }}>
                        <Target className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: et.color }} />
                        <p className="font-lato text-white/70 text-[16px] leading-relaxed">
                          <span className="font-poppins font-semibold text-[13px] uppercase tracking-wider mr-2" style={{ color: et.color }}>Resultado</span>
                          {rich(et.resultado)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Resultados al cierre */}
          <SubLabel icon={Zap}>Al terminar la semana 6</SubLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {RESULTADOS.map((r, i) => {
              const Icon = r.icon;
              return (
                <div key={i} className="rounded-2xl px-4 py-7 text-center"
                  style={{ background: 'linear-gradient(160deg, rgba(0,191,165,.09), rgba(29,112,162,.05))', border: '1px solid rgba(0,191,165,.22)' }}>
                  <Icon className="w-5 h-5 text-[#00bfa5] mx-auto mb-3" />
                  <p className="font-poppins font-black text-white leading-none mb-2" style={{ fontSize: 'clamp(2.25rem, 5vw, 3rem)' }}>{r.v}</p>
                  <p className="font-poppins font-semibold text-white/80 text-[15px] leading-snug">{r.l}</p>
                  <p className="font-lato text-white/40 text-[13px] mt-0.5">{r.sub}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─ 04 INVERSIÓN ─ */}
        <section id="inversion" ref={s4.ref as React.RefObject<HTMLElement>} className={reveal(s4.v)}>
          <TagLabel>04 — Inversión</TagLabel>
          <SectionTitle>Una sola inversión para arrancar</SectionTitle>
          <Rule />
          <Lead>
            Un valor único por la implementación completa de <Hl color="#fff">{META.duracion}</Hl>. Valores en pesos colombianos más IVA.
          </Lead>

          {/* Card total */}
          <div className="rounded-3xl p-8 sm:p-11 relative overflow-hidden mb-4"
            style={{ background: 'linear-gradient(135deg, rgba(0,191,165,.08) 0%, rgba(29,112,162,.08) 100%)', border: '1px solid rgba(0,191,165,.3)' }}>
            <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,191,165,.07), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <div className="relative z-10">
              <p className="font-lato text-white/40 text-[14px] uppercase tracking-[0.2em] mb-3">Implementación · Fase 1</p>
              <p className="font-poppins font-black text-white leading-none mb-3" style={{ fontSize: 'clamp(2.6rem, 7vw, 4.4rem)' }}>
                {fmt(TOTAL_NUM)}
              </p>
              <p className="font-lato text-white/45 text-[16px] mb-6">+ IVA · {META.duracion} · valor único</p>

              {/* Gancho del pago anticipado */}
              <button onClick={() => setPagosAbierto(true)}
                className="w-full sm:w-auto inline-flex items-center gap-3 rounded-xl px-4 py-3 mb-8 text-left transition-transform duration-200 hover:scale-[1.01]"
                style={{ background: 'linear-gradient(90deg, rgba(242,140,56,.18), rgba(242,140,56,.06))', border: `1px solid ${MEE}66` }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${MEE}2e` }}>
                  <Gift className="w-5 h-5" style={{ color: MEE }} />
                </div>
                <p className="font-lato text-white/75 text-[16px] leading-snug">
                  Pague por adelantado y <Hl color={MEE}>ahorre {fmt(AHORRO_NUM)}</Hl>
                  <span className="block font-lato text-white/45 text-[14px]">{DESCUENTO_ANTICIPADO}% de descuento: queda en {fmt(ANTICIPADO_NUM)}</span>
                </p>
              </button>

              <div className="flex flex-wrap gap-2">
                {INCLUYE.map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 font-lato text-[14px] px-3 py-1.5 rounded-full text-white/75"
                    style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)' }}>
                    <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5]" /> {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Formas de pago (desplegable) */}
          <div className="rounded-2xl overflow-hidden mb-24"
            style={{ background: 'rgba(255,255,255,.025)', border: `1px solid ${pagosAbierto ? 'rgba(0,191,165,.3)' : 'rgba(255,255,255,.08)'}` }}>
            <button onClick={() => setPagosAbierto(!pagosAbierto)}
              className="w-full flex items-center gap-4 p-5 sm:p-6 text-left">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,191,165,.12)' }}>
                <CreditCard className="w-5 h-5 text-[#00bfa5]" />
              </div>
              <div className="flex-1">
                <p className="font-poppins font-bold text-white text-[19px]">Formas de pago</p>
                <p className="font-lato text-white/40 text-[15px]">Dos opciones, usted elige</p>
              </div>
              <ChevronDown className={`w-5 h-5 text-[#00bfa5] transition-transform duration-300 ${pagosAbierto ? 'rotate-180' : ''}`} />
            </button>
            {pagosAbierto && (
              <div className="px-5 sm:px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-stretch">
                {FORMAS_PAGO.map((f, i) => (
                  <div key={i} className="rounded-xl p-5 sm:p-6 flex flex-col relative overflow-hidden"
                    style={f.destacado
                      ? { background: 'linear-gradient(150deg, rgba(242,140,56,.16), rgba(0,191,165,.06))', border: `1.5px solid ${MEE}`, boxShadow: '0 0 34px rgba(242,140,56,.18)' }
                      : { background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
                    {f.destacado && (
                      <span className="absolute top-0 right-0 inline-flex items-center gap-1 font-poppins font-bold text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-bl-xl text-[#030d1a]"
                        style={{ background: MEE }}>
                        <Star className="w-3 h-3" /> Mejor opción
                      </span>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-lato text-white/40 text-[13px] uppercase tracking-wider">{f.opcion}</span>
                      {!f.destacado && (
                        <span className="font-lato text-[12px] px-2.5 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.55)' }}>
                          {f.etiqueta}
                        </span>
                      )}
                    </div>
                    <p className="font-poppins font-bold text-white/85 text-[18px] mb-4">{f.nombre}</p>
                    {f.destacado && (
                      <p className="font-lato text-white/35 text-[16px] line-through leading-none mb-1.5">{fmt(TOTAL_NUM)}</p>
                    )}
                    <p className="font-poppins font-black text-white text-[26px] leading-tight mb-3">{f.valor}</p>
                    {f.destacado && (
                      <span className="self-start inline-flex items-center gap-1.5 font-poppins font-bold text-[14px] px-3 py-1 rounded-full mb-3"
                        style={{ background: `${MEE}26`, border: `1px solid ${MEE}66`, color: MEE }}>
                        <Gift className="w-3.5 h-3.5" /> Ahorra {fmt(AHORRO_NUM)} · {f.etiqueta}
                      </span>
                    )}
                    <p className="font-lato text-white/50 text-[15px] mt-auto">{f.detalle}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Después de la implementación */}
          <p className="font-lato text-[#00bfa5] text-[13px] uppercase tracking-[0.22em] font-medium mb-2">Después de la implementación</p>
          <h3 className="font-poppins font-extrabold text-white leading-tight mb-3" style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.2rem)' }}>
            Elija cómo seguir
          </h3>
          <p className="font-lato text-white/55 text-[18px] leading-relaxed max-w-2xl mb-10">
            Al terminar las 6 semanas, su sistema sigue funcionando con <Hl color="#fff">una de estas dos opciones</Hl> mensuales.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-4 mb-4 items-stretch">
            {OPCIONES_POST.map((o, i) => (
              <div key={i} className="rounded-3xl p-6 sm:p-8 flex flex-col relative overflow-hidden"
                style={o.recomendado
                  ? { background: 'linear-gradient(150deg, rgba(0,191,165,.13) 0%, rgba(29,112,162,.08) 55%, rgba(3,13,26,.9) 100%)', border: '1.5px solid rgba(0,191,165,.5)', boxShadow: '0 0 40px rgba(0,191,165,.12)' }
                  : { background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.09)' }}>
                {o.recomendado && (
                  <span className="absolute top-0 right-0 inline-flex items-center gap-1 font-poppins font-bold text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-bl-xl text-[#030d1a]"
                    style={{ background: '#00bfa5' }}>
                    <Star className="w-3 h-3" /> Recomendado
                  </span>
                )}
                <p className="font-lato text-white/40 text-[13px] uppercase tracking-wider mb-1">Opción {String.fromCharCode(65 + i)}</p>
                <p className={`font-poppins font-bold text-white text-[20px] leading-snug ${o.recomendado ? 'pr-28' : ''}`}>{o.nombre}</p>
                <p className="font-lato text-[15px] mt-1 mb-6" style={{ color: o.recomendado ? '#00bfa5' : 'rgba(255,255,255,.45)' }}>{o.sub}</p>
                <p className="font-poppins font-black text-white leading-none" style={{ fontSize: o.recomendado ? 'clamp(2.1rem, 5vw, 2.75rem)' : 'clamp(1.8rem, 4.4vw, 2.25rem)' }}>{o.precio}</p>
                <p className="font-lato text-white/45 text-[14px] mt-2 mb-6">{o.periodo}</p>
                <ul className="space-y-3 mb-2">
                  {o.items.map((it, j) => {
                    const Icon = it.icon;
                    return (
                      <li key={j} className="flex items-start gap-3">
                        <Icon className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: o.recomendado ? '#00bfa5' : 'rgba(255,255,255,.4)' }} />
                        <span className="font-lato text-white/65 text-[16px] leading-snug">{rich(it.text, 'rgba(255,255,255,.92)')}</span>
                      </li>
                    );
                  })}
                </ul>
                {o.recomendado && (
                  <div className="mt-auto pt-5">
                    <div className="rounded-xl px-4 py-3.5 flex items-center gap-3"
                      style={{ background: 'rgba(0,191,165,.10)', border: '1px solid rgba(0,191,165,.3)' }}>
                      <p className="font-poppins font-black text-[#00bfa5] text-[32px] leading-none">{EXPERTOS}</p>
                      <p className="font-lato text-white/70 text-[15px] leading-snug">
                        Es como tener <Hl color="#fff">{EXPERTOS} expertos en tecnología y en su negocio</Hl> a su servicio 24/7.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Cómo funcionan los créditos (desplegable) */}
          <div className="rounded-2xl overflow-hidden mb-6"
            style={{ background: 'rgba(255,255,255,.025)', border: `1px solid ${creditosAbierto ? 'rgba(0,191,165,.3)' : 'rgba(255,255,255,.08)'}` }}>
            <button onClick={() => setCreditosAbierto(!creditosAbierto)}
              className="w-full flex items-center gap-4 p-5 sm:p-6 text-left">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,191,165,.12)' }}>
                <Coins className="w-5 h-5 text-[#00bfa5]" />
              </div>
              <div className="flex-1">
                <p className="font-poppins font-bold text-white text-[19px]">¿Cómo funcionan los créditos?</p>
                <p className="font-lato text-white/40 text-[15px]">Plan Integral · ejemplo de un mes</p>
              </div>
              <ChevronDown className={`w-5 h-5 text-[#00bfa5] transition-transform duration-300 ${creditosAbierto ? 'rotate-180' : ''}`} />
            </button>
            {creditosAbierto && (
              <div className="px-5 sm:px-6 pb-6">
                <p className="font-lato text-white/55 text-[16px] leading-relaxed mb-5">
                  Cada solicitud se cotiza en créditos según su tamaño y <Hl color="#fff">usted la aprueba antes</Hl> de que la hagamos. Así nunca hay sorpresas al cierre del mes.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {BANDAS.map((b) => {
                    const bs = BANDA_STYLE[b.banda];
                    return (
                      <div key={b.banda} className="rounded-xl p-4" style={{ background: 'rgba(2,8,20,.6)', border: `1px solid ${bs.border}` }}>
                        <p className="font-poppins font-black text-[22px] leading-none mb-1" style={{ color: bs.color }}>{b.rango}</p>
                        <p className="font-lato text-white/30 text-[11px] uppercase tracking-wider mb-2">créditos</p>
                        <p className="font-poppins font-semibold text-white/85 text-[15px] mb-1">{b.tipo}</p>
                        <p className="font-lato text-white/45 text-[13px] leading-snug">{b.ej}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,.07)' }}>
                  <div className="grid grid-cols-3 gap-2 p-3" style={{ background: 'rgba(2,8,20,.5)', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                    {DISTRIBUCION.map((d) => {
                      const bs = BANDA_STYLE[d.banda];
                      return (
                        <div key={d.banda} className="rounded-lg px-2 py-2.5 text-center" style={{ background: bs.bg, border: `1px solid ${bs.border}` }}>
                          <p className="font-poppins font-black text-[20px] leading-none" style={{ color: bs.color }}>{d.cantidad}</p>
                          <p className="font-poppins font-semibold text-white/70 text-[12px] mt-1 leading-tight">{d.banda}</p>
                          <p className="font-lato text-white/35 text-[11px] mt-0.5">{d.creditos} créditos</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="divide-y divide-white/5">
                    {REPORTE.map((r, i) => {
                      const bs = BANDA_STYLE[r.banda];
                      return (
                        <div key={i} className="px-4 py-2.5 flex items-center gap-3">
                          <span className="font-lato text-white/60 text-[14px] leading-snug flex-1">
                            {r.solicitud}
                            <span className="ml-2 font-lato text-[11px] px-1.5 py-0.5 rounded whitespace-nowrap align-middle" style={{ background: bs.bg, color: bs.color }}>{r.banda}</span>
                          </span>
                          <span className="font-poppins font-bold text-[14px]" style={{ color: bs.color }}>{r.creditos}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'rgba(0,191,165,.07)', borderTop: '1px solid rgba(0,191,165,.2)' }}>
                    <span className="font-poppins font-bold text-white text-[15px]">Total del mes · {REPORTE.length} solicitudes</span>
                    <span className="font-poppins font-black text-[15px] text-[#00bfa5]">{TOTAL_REPORTE} / {CREDITOS_MES}</span>
                  </div>
                </div>
                <p className="font-lato text-white/35 text-[13px] leading-relaxed mt-4">
                  Es un ejemplo de referencia. Habrá meses en los que una solicitud compleja ocupe buena parte del plan y se atiendan menos solicitudes. Los créditos no usados no se acumulan, y si una solicitud supera el saldo se programa para el mes siguiente o se cotiza aparte, siempre con su aprobación.
                </p>
              </div>
            )}
          </div>

          <p className="font-lato text-white/45 text-[16px] leading-relaxed max-w-2xl">
            Las <Hl color="#fff">próximas fases</Hl> (obra, materiales, personal) se pueden construir con los créditos del Plan Integral o <Hl>cotizarse aparte</Hl>.
          </p>
        </section>

        {/* ── LOGOS DE CLIENTES ── */}
        <div>
          <LogoCarousel />
        </div>

        {/* ─ 05 VIGENCIA ─ */}
        <section id="vigencia" ref={s5.ref as React.RefObject<HTMLElement>} className={reveal(s5.v)}>
          <TagLabel>05 — Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y términos</SectionTitle>
          <Rule />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { titulo: 'Aprobación', desc: 'Basta su confirmación por **WhatsApp, correo o verbal** para agendar el arranque.', icon: CheckCircle },
              { titulo: 'Pagos', desc: `**50% al iniciar y 50% al finalizar**, o pago anticipado con **${DESCUENTO_ANTICIPADO}% de descuento**. Más IVA, por transferencia.`, icon: FileText },
              { titulo: 'Modalidad', desc: 'Sesiones **virtuales** con usted y Jennifer, en los horarios que acordemos.', icon: MapPin },
              { titulo: 'Después de las 6 semanas', desc: `El sistema sigue activo con la **licencia mensual** de ${fmt(LICENCIA_NUM)} o con el **Plan Integral**, que ya la incluye. Ambos más IVA, por mes anticipado.`, icon: Coins },
              { titulo: 'No incluye', desc: 'El costo de los **mensajes de WhatsApp** que cobra Meta y el **presupuesto de pauta digital**, que se pagan aparte.', icon: AlertCircle },
              { titulo: 'Su información', desc: 'Los datos de clientes y ventas **son de Meetrico** y se manejan de forma **confidencial**.', icon: ShieldCheck },
              { titulo: 'Vigencia', desc: '**30 días calendario** desde la fecha de esta propuesta. Arrancamos con el **primer pago**.', icon: Clock },
            ].map((item, i, arr) => {
              const Icon = item.icon;
              return (
                <div key={i} className={`rounded-xl p-5 flex gap-3 ${i === arr.length - 1 && arr.length % 2 === 1 ? 'sm:col-span-2' : ''}`}
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <Icon className="w-4 h-4 text-[#00bfa5] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-poppins font-semibold text-white/85 text-[17px] mb-1">{item.titulo}</p>
                    <p className="font-lato text-white/50 text-[16px] leading-relaxed">{rich(item.desc, 'rgba(255,255,255,.85)')}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-16 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 100%, rgba(0,191,165,.05), transparent 70%)' }} />
            <div className="relative z-10">
              <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-10 w-auto object-contain mx-auto mb-3"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <p className="font-poppins font-black text-white text-[20px] tracking-tight mb-1">Sixteam<span className="text-[#00bfa5]">.</span>pro</p>
              <p className="font-lato text-white/35 text-[14px] mb-4">Innovación y Estrategia Digital S.A.S.</p>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[14px] text-white/35 font-lato">
                <span>NIT {META.nit}</span>
                <span>·</span>
                <span>{META.correo}</span>
                <span>·</span>
                <span>RL: {META.rl}</span>
              </div>
              <p className="font-lato text-white/50 text-[14px] mt-3">
                Propuesta elaborada por: <strong className="text-white/80 font-semibold">{META.elaboradaPor}</strong> · {META.cargo}
              </p>
              <p className="font-lato text-white/20 text-[13px] mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                Process + Technology + People = Growth · {META.fecha} · Uso confidencial
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default MeetricoProposal;
