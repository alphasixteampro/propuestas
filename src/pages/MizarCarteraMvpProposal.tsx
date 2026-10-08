import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LogoCarousel from '../components/LogoCarousel';
import PDFButton from '../components/PDFButton';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target,
  AlertCircle, Info, Calendar, MapPin,
  Users, Shield, Lock, MessageSquare, ClipboardList,
  Stamp, Wallet, Calculator, Search, TrendingUp,
  Landmark, ArrowRight, MousePointerClick, Monitor, ShieldCheck,
  Building2, ChevronDown, UserPlus, FileSpreadsheet, BellRing, Scale, Gamepad2,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  fecha: 'Octubre 2026',
  lugar: 'Bucaramanga y Cúcuta',
  objetivo: 'Lo mínimo para dejar los Excel de cartera de Mizar y Mi Lote: clientes, contratos, pagos, mora y estado de cuenta, en 8 semanas.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  destinatarios: 'Ing. Claudia Villamizar · José Luis',
};

const DEMO_PATH = '/mizar-cartera/demo';
const COMPLETA_PATH = '/mizar-cartera';

const MIZAR_GOLD = '#c9a443';

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber:  { text: '#f59e0b',   bg: 'rgba(251,191,36,.07)',   border: 'rgba(251,191,36,.18)' },
  red:    { text: '#f87171',   bg: 'rgba(221,51,51,.07)',    border: 'rgba(221,51,51,.2)'   },
  blue:   { text: '#38bdf8',   bg: 'rgba(56,189,248,.07)',   border: 'rgba(56,189,248,.18)' },
};

// ─── PUNTOS DE DOLOR ─────────────────────────────────────────────────────────

const DOLORES = [
  { titulo: 'Cada pago se digita dos o tres veces', desc: 'Libro diario, control por proyecto y, en Cúcuta, otro Excel y un Drive. Más de 1.500 movimientos escritos a mano desde 2024.', icon: FileSpreadsheet, tint: 'amber' },
  { titulo: 'La mora casi nunca se cobra', desc: 'Calcularla a mano toma tiempo, así que muchas veces no se hace y el cliente paga cuando quiere.', icon: Calculator, tint: 'red' },
  { titulo: 'El dinero se revuelve entre cuentas', desc: 'Varios proyectos y sociedades entran a las mismas cuentas, y una parte llega en efectivo o a cuentas personales.', icon: Landmark, tint: 'blue' },
];

// ─── HOY EN EXCEL FRENTE A CON EL SISTEMA (solo lo que cubre el MVP) ─────────

const ANTES_DESPUES: { tema: string; hoy: string; con: string; icon: React.ElementType }[] = [
  { tema: 'Registro de pagos', hoy: 'Se digita en el libro diario y otra vez en el control de cada proyecto.', con: 'Se registra una sola vez y alimenta todo lo demás.', icon: Wallet },
  { tema: 'Estado de cuenta', hoy: 'Se arma a mano, pestaña por pestaña.', con: 'Sale en segundos con la cédula, en PDF y listo para enviar.', icon: Search },
  { tema: 'Mora y abonos', hoy: 'Se calculan a mano y muchas veces no se cobran.', con: 'Se calculan solos con la tasa que defina Mizar.', icon: Calculator },
  { tema: 'Pagos por WhatsApp', hoy: 'El soporte se revisa a ojo; ya llegaron soportes repetidos.', con: 'El cliente reporta desde el chat, tesorería lo confirma contra el banco y los repetidos se rechazan.', icon: MessageSquare },
];

// ─── MÓDULOS DEL MVP ─────────────────────────────────────────────────────────

type Modulo = {
  num: string; nombre: string; icon: React.ElementType; semanas: string; precio: number;
  frase: string; items: string[]; entregable: string;
};

const MODULOS: Modulo[] = [
  { num: '01', icon: Building2, semanas: 'Semana 1', precio: 1800000,
    nombre: 'Base del grupo y sociedades',
    frase: 'Aquí se define cómo se separan Mizar y Mi Lote: cada proyecto con su sociedad, sus lotes y sus cuentas.',
    items: [
      'Bucaramanga y Cúcuta con sus reglas (mora en Bucaramanga, cuota fija en Cúcuta)',
      'Las sociedades y sus proyectos',
      'Lotes o inmuebles con precio y estado',
      'Lugares donde entra el dinero: cuentas, efectivo, cuentas personales y la de Miraflor',
      'Usuarios por rol con registro de cambios',
    ],
    entregable: 'sociedades, proyectos, lotes, cuentas y usuarios cargados y revisados por Mizar' },
  { num: '02', icon: UserPlus, semanas: 'Semana 2', precio: 1000000,
    nombre: 'Clientes y contratos',
    frase: 'Una ficha por cliente y un contrato por venta.',
    items: [
      'Ficha del cliente con contacto y autorización de mensajes',
      'Contrato con lote, valor, vendedor y de quién es (sociedad, solo Mizar u otro socio)',
      'Personas autorizadas para pagar por el cliente',
      'Etapas del contrato: promesa, compraventa, escritura y entrega',
      'Desistimiento con lo que se devuelve',
    ],
    entregable: 'diez contratos reales registrados' },
  { num: '03', icon: Calculator, semanas: 'Semanas 3 a 5', precio: 3200000,
    nombre: 'Motor de cartera',
    frase: 'Cada pago se registra una vez y el sistema calcula lo demás.',
    items: [
      'Plan de pagos desde la promesa, con capital e interés por separado y la fecha de corte de cada cliente',
      'Registro rápido de los pagos del día, sin entrar cliente por cliente, incluidos parciales y pagos de terceros',
      'Recibo con número consecutivo y soporte guardado; un comprobante repetido se rechaza',
      'Mora calculada sola con la tasa que firme Mizar (en Cúcuta, cuota fija)',
      'Abonos extra a capital que recalculan el plan',
      'Estado de cuenta en PDF al digitar la cédula, con la administración anterior de Cúcuta aparte',
      'Comprobante contable de cada pago, mora y descuento',
    ],
    entregable: '20 contratos con el mismo saldo que el Excel, al peso' },
  { num: '04', icon: FileSpreadsheet, semanas: 'Semanas 2 a 7', precio: 1500000,
    nombre: 'Paso de los Excel',
    frase: 'Los proyectos activos, limpios y cargados.',
    items: [
      'Proyectos activos con sus pagos desde 2025; lo anterior entra como saldo inicial',
      'Nombres, cédulas y cuentas unificados',
      'Planes reconstruidos con capital e interés',
      'Diferencias revisadas con Jennifer y Yurley',
      'Dos semanas en paralelo con el Excel y capacitación',
    ],
    entregable: 'el 100 % de los saldos de los proyectos activos igual al Excel' },
  { num: '05', icon: TrendingUp, semanas: 'Semana 6', precio: 1000000,
    nombre: 'Vista de proyecto y morosos',
    frase: 'Entrar a un proyecto y saber quién debe.',
    items: [
      'Resumen por proyecto: vendido, recogido, por cobrar y vencido',
      'Programado frente a pagado, mes a mes',
      'Listado de morosos a pedido, por proyecto',
      'Gestiones y compromisos de pago con alerta si no se cumplen',
    ],
    entregable: 'la vista de Miradores de la Montaña cuadra con su Excel de flujo' },
  { num: '06', icon: MessageSquare, semanas: 'Semana 7', precio: 500000,
    nombre: 'Reporte de pago por WhatsApp',
    frase: 'El cliente reporta su pago desde el chat y tesorería lo confirma.',
    items: [
      'Opción «Reportar pago» con valor y comprobante',
      'La puede usar el cliente o su pagador autorizado',
      'Bandeja de tesorería para confirmar contra el banco',
      'Recibo automático al aprobar',
    ],
    entregable: 'un pago reportado por WhatsApp queda confirmado con su recibo' },
];

const PRECIO_TOTAL = MODULOS.reduce((s, m) => s + m.precio, 0);
const SEMANAS_TOTAL = 8;
const PAGOS: { cuando: string; pct: number }[] = [
  { cuando: 'Al firmar', pct: 30 },
  { cuando: 'Al entregar el motor de cartera (semana 5)', pct: 40 },
  { cuando: 'Al cerrar el paso de los Excel (semana 8)', pct: 30 },
];
const valorPago = (pct: number) => Math.round(PRECIO_TOTAL * pct / 100);

const cop = (n: number) => '$' + n.toLocaleString('es-CO');

// ─── PARA DESPUÉS ────────────────────────────────────────────────────────────

const DESPUES: { titulo: string; icon: React.ElementType }[] = [
  { titulo: 'Verificación de pagos con el banco y pagos por identificar', icon: ShieldCheck },
  { titulo: 'Recordatorios automáticos por WhatsApp', icon: BellRing },
  { titulo: 'Acuerdos, suspensión de pagos y cruces de cartera', icon: Scale },
  { titulo: 'Flujo de caja e informes de gerencia', icon: TrendingUp },
  { titulo: 'Tesorería, socios y reparto', icon: Users },
  { titulo: 'Link de pago y recompensas por pagar a tiempo', icon: Gamepad2 },
];

// ─── TÉRMINOS ────────────────────────────────────────────────────────────────

const TERMINOS: { titulo: string; desc: string; icon: React.ElementType }[] = [
  { titulo: 'Aceptación', desc: 'Mizar confirma por WhatsApp, correo o de palabra que contrata esta versión. Luego se firma el contrato y se hace el primer pago.', icon: CheckCircle },
  { titulo: 'Pago', desc: `${PAGOS.map(p => `${p.pct} % ${p.cuando.charAt(0).toLowerCase()}${p.cuando.slice(1)} (${cop(valorPago(p.pct))})`).join(', ')}. Total ${cop(PRECIO_TOTAL)}, en pesos colombianos.`, icon: FileText },
  { titulo: 'Duración', desc: `${SEMANAS_TOTAL} semanas. La semana 8 es de acompañamiento y cierre, sin costo aparte. Arranca cuando compras esté en uso.`, icon: Calendar },
  { titulo: 'Pago mensual (por confirmar)', desc: '$150.000 adicionales al mes sobre lo que Mizar ya paga por la plataforma, desde que el primer módulo entra en uso.', icon: Clock },
  { titulo: 'WhatsApp', desc: 'Las tarifas de Meta por mensaje las asume Mizar al costo, sin margen de Sixteam.', icon: MessageSquare },
  { titulo: 'Lo que aporta Mizar', desc: 'Los Excel de los proyectos activos y el de Cúcuta, antes de la semana 2; la tasa de mora firmada por Mizar; las cuentas de cada sociedad y una persona responsable por sede.', icon: ClipboardList },
  { titulo: 'Soporte', desc: 'Respuesta en máximo 4 horas hábiles por WhatsApp o correo. Garantía de 30 días desde cada entrega.', icon: Shield },
  { titulo: 'Cambios de alcance', desc: 'Lo que no está en esta propuesta se cotiza aparte; lo que queda para después está en la propuesta completa.', icon: AlertCircle },
  { titulo: 'Propiedad de los datos y confidencialidad', desc: 'Los datos son de Mizar. Sixteam guarda total confidencialidad durante el contrato y después.', icon: Lock },
  { titulo: 'Vigencia', desc: '30 días calendario desde su emisión.', icon: Stamp },
];

// ─── SECCIONES NAV ───────────────────────────────────────────────────────────

const SECCIONES = [
  { id: 'resumen',   label: 'Resumen'       },
  { id: 'cambia',    label: 'Lo que cambia' },
  { id: 'demo',      label: 'Demo'          },
  { id: 'incluye',   label: 'Qué incluye'   },
  { id: 'despues',   label: 'Para después'  },
  { id: 'inversion', label: 'Inversión'     },
  { id: 'vigencia',  label: 'Términos'      },
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

const MizarCarteraMvpProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [moduloAbierto, setModuloAbierto] = useState<Set<string>>(() => new Set());
  const [terminoActivo, setTerminoActivo] = useState<number | null>(null);
  const alternarModulo = (c: string) => setModuloAbierto(prev => { const n = new Set(prev); if (n.has(c)) n.delete(c); else n.add(c); return n; });

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
  const s5 = useVisible(); const s6 = useVisible(); const s7 = useVisible();

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
          <div className="flex items-center gap-3"><span className="no-print"><PDFButton filename="mizar-cartera-mvp-sixteam.pdf" elementId="proposal-root" /></span><span className="font-lato text-[#00bfa5]/80 text-[13px] uppercase tracking-[0.2em] border border-[#00bfa5]/20 rounded-full px-3 py-1.5">Confidencial</span></div>
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
              <TagLabel>Propuesta de trabajo · Versión 2 · Cartera esencial</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${MIZAR_GOLD}, #8f7226)` }}>
                  <Wallet className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">Mizar · Mi Lote</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(201,164,67,.12)', border: '1px solid rgba(201,164,67,.28)', color: MIZAR_GOLD }}>
                  MVP · {cop(PRECIO_TOTAL)} · {SEMANAS_TOTAL} semanas
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 4.8rem)' }}>
                Cartera<br />
                <span style={{ background: `linear-gradient(90deg,${MIZAR_GOLD},#00bfa5)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  esencial
                </span>
              </h1>
              <p className="font-lato text-white/55 text-xl leading-relaxed mb-5">{META.objetivo}</p>

              <Link to={COMPLETA_PATH}
                className="no-print flex items-start gap-2.5 rounded-xl px-4 py-3 mb-5 transition-colors hover:bg-white/[0.04]"
                style={{ background: 'rgba(201,164,67,.07)', border: '1px solid rgba(201,164,67,.25)' }}>
                <Info className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: MIZAR_GOLD }} />
                <span className="font-lato text-white/70 text-[15px] leading-snug">
                  Esta versión arranca con lo esencial. <span className="font-semibold underline" style={{ color: MIZAR_GOLD }}>La propuesta completa sigue disponible</span> <ArrowRight className="inline w-3.5 h-3.5" style={{ color: MIZAR_GOLD }} />
                </span>
              </Link>

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
                  {['1. Resumen','2. Lo que cambia','3. Pruebe la demo','4. Qué incluye el MVP','5. Qué queda para después','6. Inversión','7. Términos'].map((item, i) => (
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
          <SectionTitle>Empezar por lo esencial</SectionTitle>
          <Rule />

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-8">
            <p>
              Hoy la cartera de Mizar y de Mi Lote vive en varios Excel que el equipo llena a mano, pago por pago. Esta versión reemplaza esos Excel con lo mínimo necesario, dentro de la <strong className="text-white/90 font-semibold">Plataforma Mizar</strong>, donde ya funcionan compras y caja menor. Lo demás se suma después, sobre esta misma base.
            </p>
          </div>

          <div className="rounded-2xl p-6 sm:p-7 mb-8 relative overflow-hidden"
            style={{ background: 'rgba(201,164,67,.06)', border: '1px solid rgba(201,164,67,.22)' }}>
            <Target className="w-6 h-6 mb-3" style={{ color: MIZAR_GOLD }} />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[22px] leading-snug">
              Registrar cada pago una sola vez, que el sistema calcule la mora y que cualquier cliente tenga su estado de cuenta en segundos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[
              { v: `${MODULOS.length} módulos`, s: 'Todos incluidos' },
              { v: `${SEMANAS_TOTAL} semanas`, s: 'La última, de acompañamiento y cierre' },
              { v: cop(PRECIO_TOTAL), s: 'Pago único, en tres momentos' },
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

        {/* ─ 02 LO QUE CAMBIA ─ */}
        <section id="cambia" ref={s2.ref as React.RefObject<HTMLElement>}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            {[
              { value: '1 registro', label: 'en vez de 3 archivos' },
              { value: 'Segundos', label: 'para un estado de cuenta' },
              { value: 'Siempre', label: 'se calcula la mora' },
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
        <section id="demo" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 · Pruebe la demo</TagLabel>
          <SectionTitle>Véalo funcionando antes de decidir</SectionTitle>
          <Rule />

          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(0,191,165,.08) 0%, rgba(3,13,26,.95) 100%)', border: '1px solid rgba(0,191,165,.28)', boxShadow: '0 4px 32px rgba(0,191,165,.10)' }}>
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-8 items-center">
              <div>
                <p className="font-lato text-white/60 text-[18px] leading-relaxed mb-5">
                  Una demo con datos ficticios para que el equipo la pruebe. Nada de lo que se haga ahí se guarda. La demo muestra también lo que viene después de este MVP; aquí se contrata lo descrito en la sección 4.
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

        {/* ─ 04 QUÉ INCLUYE ─ */}
        <section id="incluye" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 · Qué incluye el MVP</TagLabel>
          <SectionTitle>Seis módulos, todos incluidos</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-6">
            Cada módulo tiene su precio y su semana. Toque uno para ver qué incluye y cuándo se da por entregado.
          </p>

          <div className="space-y-3">
            {MODULOS.map((m) => {
              const Icon = m.icon;
              const abierto = moduloAbierto.has(m.num);
              return (
                <div key={m.num} className="rounded-2xl overflow-hidden"
                  style={{ background: 'rgba(255,255,255,.03)', border: abierto ? '1px solid rgba(201,164,67,.35)' : '1px solid rgba(255,255,255,.08)' }}>
                  <button type="button" onClick={() => alternarModulo(m.num)} aria-expanded={abierto}
                    className="w-full flex items-start gap-3 p-4 sm:p-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#00bfa5]">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(201,164,67,.10)', border: '1px solid rgba(201,164,67,.28)' }}>
                      <Icon className="w-4 h-4" style={{ color: MIZAR_GOLD }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-poppins font-semibold text-white/90 text-[17px] leading-snug">
                        <span className="font-black mr-2" style={{ color: MIZAR_GOLD }}>{m.num}</span>{m.nombre}
                      </p>
                      <p className="font-lato text-white/55 text-[15px] leading-snug mt-1">{m.frase}</p>
                      <p className="font-lato text-white/40 text-[13px] mt-1.5">{m.semanas}</p>
                    </div>
                    <p className="font-poppins font-bold text-white/85 text-[17px] whitespace-nowrap flex-shrink-0">{cop(m.precio)}</p>
                    <ChevronDown className={'no-print w-5 h-5 flex-shrink-0 text-white/55 transition-transform mt-0.5' + (abierto ? ' rotate-180' : '')} />
                  </button>
                  {abierto && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <p className="font-poppins font-semibold text-white/70 text-[13px] uppercase tracking-wider mt-3 mb-2">Qué incluye</p>
                      <ul className="space-y-1.5 mb-4">
                        {m.items.map((it, k) => (
                          <li key={k} className="flex gap-2 font-lato text-white/65 text-[15px] leading-snug">
                            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" />{it}
                          </li>
                        ))}
                      </ul>
                      <p className="font-poppins font-semibold text-white/70 text-[13px] uppercase tracking-wider mb-1">Se entrega cuando</p>
                      <p className="font-lato text-white/65 text-[15px] leading-snug">{m.entregable}.</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-xl p-4 mt-4 flex items-start gap-3" style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.20)' }}>
            <Clock className="w-4 h-4 flex-shrink-0 mt-1 text-[#00bfa5]" />
            <p className="font-lato text-white/70 text-[15px] leading-snug">
              <span className="font-semibold text-white/90">Semana 8:</span> acompañamiento y cierre, sin costo aparte.
            </p>
          </div>
        </section>

        {/* ─ 05 PARA DESPUÉS ─ */}
        <section id="despues" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 · Qué queda para después</TagLabel>
          <SectionTitle>Lo que se suma más adelante</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-6">
            Todo se construye sobre esta base, sin rehacer nada.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {DESPUES.map((d, i) => {
              const Icon = d.icon;
              return (
                <div key={i} className="rounded-xl p-4 flex flex-col gap-2" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
                  <Icon className="w-4 h-4" style={{ color: MIZAR_GOLD }} />
                  <p className="font-poppins font-semibold text-white/85 text-[15px] leading-snug flex-1">{d.titulo}</p>
                  <Link to={COMPLETA_PATH} className="no-print inline-flex items-center gap-1 font-lato text-[13px] text-[#00bfa5] hover:underline">
                    Ver en la propuesta completa <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─ 06 INVERSIÓN ─ */}
        <section id="inversion" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 · Inversión</TagLabel>
          <SectionTitle>Un precio, ocho semanas</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-6">
            Pago único por el MVP completo, en pesos colombianos.
          </p>

          <div className="rounded-2xl overflow-hidden mb-8" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(201,164,67,.30)', boxShadow: '0 4px 32px rgba(201,164,67,.10)' }}>
            {MODULOS.map((m, i) => (
              <div key={m.num} className="flex items-baseline gap-3 px-4 sm:px-5 py-3" style={{ borderTop: i ? '1px solid rgba(255,255,255,.05)' : undefined }}>
                <span className="font-poppins font-black text-[14px] w-8 flex-shrink-0" style={{ color: MIZAR_GOLD }}>{m.num}</span>
                <p className="font-poppins font-semibold text-white/85 text-[16px] leading-snug flex-1 min-w-0">{m.nombre}</p>
                <p className="font-lato text-white/40 text-[13px] whitespace-nowrap hidden sm:block">{m.semanas}</p>
                <p className="font-poppins font-bold text-white/85 text-[16px] whitespace-nowrap">{cop(m.precio)}</p>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-3 px-4 sm:px-5 py-4" style={{ background: 'rgba(201,164,67,.09)', borderTop: '1px solid rgba(201,164,67,.35)' }}>
              <div>
                <p className="font-poppins font-bold text-white text-[18px]">Total</p>
                <p className="font-lato text-white/50 text-[14px]">{SEMANAS_TOTAL} semanas</p>
              </div>
              <p className="font-poppins font-black text-[26px] leading-none" style={{ color: MIZAR_GOLD }}>{cop(PRECIO_TOTAL)}</p>
            </div>
          </div>

          <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#00bfa5]" /> Forma de pago
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {PAGOS.map((p, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.20)' }}>
                <p className="font-poppins font-black text-[#00bfa5] text-[22px] leading-none mb-1">{p.pct} %</p>
                <p className="font-lato text-white/65 text-[14px] leading-snug mb-2">{p.cuando}</p>
                <p className="font-poppins font-bold text-white/90 text-[18px]">{cop(valorPago(p.pct))}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-4 flex flex-wrap items-center gap-x-4 gap-y-1"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
            <Shield className="w-4 h-4 text-[#00bfa5]" />
            <p className="font-poppins font-bold text-white text-[18px]">+$150.000 <span className="font-lato font-normal text-white/45 text-[14px]">al mes por uso y soporte</span></p>
            <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{ background: 'rgba(245,158,11,.12)', border: '1px solid rgba(245,158,11,.30)', color: '#f59e0b' }}>Por confirmar</span>
            <p className="font-lato text-white/40 text-[14px] w-full">Los mensajes de WhatsApp van al costo y a cargo de Mizar.</p>
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


        {/* ─ 07 TÉRMINOS ─ */}
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

export default MizarCarteraMvpProposal;
