import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap,
  AlertCircle, Info, Calendar, MapPin,
  Users, Shield, Lock,
  DollarSign, Eye, Activity, Package, FolderOpen,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Galcomex',
  tagline: 'Logística · Importaciones · Aduana · Barranquilla',
  sector: 'Logística · Agencia aduanera · Importaciones',
  sede: 'Barranquilla, Colombia',
  fecha: 'Junio 2026',
  lugar: 'Barranquilla',
  objetivo: 'Una herramienta de gestión a la medida que centraliza todas las operaciones de Galcomex: trámites, pagos, facturación y cartera en un solo lugar, sin hojas de cálculo ni información dispersa.',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  destinatarios: 'Guillermo Grisales · María Grisales',
};

const GALCOMEX_BLUE = '#0077b6';

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber:  { text: '#f59e0b',   bg: 'rgba(251,191,36,.07)',   border: 'rgba(251,191,36,.18)' },
  teal:   { text: '#00bfa5',   bg: 'rgba(0,191,165,.07)',    border: 'rgba(0,191,165,.18)'  },
  blue:   { text: '#38bdf8',   bg: 'rgba(56,189,248,.07)',   border: 'rgba(56,189,248,.18)' },
  red:    { text: '#f87171',   bg: 'rgba(221,51,51,.07)',    border: 'rgba(221,51,51,.2)'   },
  purple: { text: '#a78bfa',   bg: 'rgba(167,139,250,.07)',  border: 'rgba(167,139,250,.18)'},
};

// ─── PUNTOS DE DOLOR ─────────────────────────────────────────────────────────

const DOLORES = [
  {
    titulo: 'Seguimiento de trámites en Excel y mensajes de WhatsApp',
    desc: 'Sin una fuente única de verdad, el estado de cada importación vive en múltiples archivos y conversaciones. Encontrar la información de un trámite específico consume tiempo valioso del equipo.',
    icon: AlertCircle, tint: 'red',
  },
  {
    titulo: 'Cálculos de facturación manuales con riesgo de error',
    desc: 'Comisiones, costos bancarios, anticipos y saldos se calculan manualmente. Un error en cualquiera de estos valores puede significar cobrar de menos, devolver de más, o generar una factura incorrecta.',
    icon: DollarSign, tint: 'amber',
  },
  {
    titulo: 'Sin visibilidad de cartera y anticipos en tiempo real',
    desc: 'Para saber cuánto queda en un anticipo, qué clientes tienen saldo pendiente o qué devoluciones están por hacer, hay que hacer cuentas en el momento. No existe una vista consolidada y actualizada.',
    icon: Eye, tint: 'blue',
  },
  {
    titulo: 'Documentos de cada operación difíciles de localizar',
    desc: 'BL, facturas comerciales, declaraciones de la DIAN y comprobantes bancarios viven en correos y carpetas sin una organización consistente por trámite. Encontrar un documento urgente se convierte en una búsqueda innecesaria.',
    icon: FolderOpen, tint: 'purple',
  },
];

// ─── BENEFICIOS ──────────────────────────────────────────────────────────────

const BENEFICIOS = [
  {
    icon: Eye, color: GALCOMEX_BLUE, colorAlpha: 'rgba(0,119,182,.08)', colorBorder: 'rgba(0,119,182,.22)',
    titulo: 'Visibilidad total de cada importación',
    desc: 'Guillermo y María pueden ver, en cualquier momento y desde cualquier dispositivo, el estado exacto de cada trámite: qué etapa está, qué documentos tiene, qué pagos se han hecho y qué queda pendiente.',
  },
  {
    icon: DollarSign, color: '#00bfa5', colorAlpha: 'rgba(0,191,165,.08)', colorBorder: 'rgba(0,191,165,.22)',
    titulo: 'Facturación correcta desde el primer intento',
    desc: 'Los valores de cada factura se calculan automáticamente a partir de los pagos y anticipos registrados. El equipo revisa y aprueba antes de emitir, eliminando los errores manuales y las correcciones posteriores.',
  },
  {
    icon: Activity, color: '#f59e0b', colorAlpha: 'rgba(245,158,11,.08)', colorBorder: 'rgba(245,158,11,.22)',
    titulo: 'Cartera y anticipos siempre al día',
    desc: 'Un solo panel muestra cuánto tiene disponible cada anticipo, qué clientes tienen saldo a su favor y qué está pendiente de cobro o devolución. Sin hacer cuentas, sin cruzar archivos.',
  },
  {
    icon: FolderOpen, color: '#a78bfa', colorAlpha: 'rgba(167,139,250,.08)', colorBorder: 'rgba(167,139,250,.22)',
    titulo: 'Todos los documentos en un solo lugar',
    desc: 'Cada trámite tiene su propia carpeta digital con todos los archivos adjuntos organizados por tipo. Cualquier integrante del equipo puede encontrar y consultar un documento en segundos, sin depender de correos ni mensajes.',
  },
  {
    icon: Shield, color: '#34d399', colorAlpha: 'rgba(52,211,153,.08)', colorBorder: 'rgba(52,211,153,.22)',
    titulo: 'Control por roles: cada quien ve lo que necesita',
    desc: 'Camila tiene acceso total. El equipo operativo gestiona trámites y pagos. Luis Martínez accede únicamente a sus propias operaciones. La información sensible queda protegida sin limitar la productividad.',
  },
];

// ─── QUÉ INCLUYE ─────────────────────────────────────────────────────────────

type Item = string;

const MODULOS: { num: string; nombre: string; icon: React.ElementType; color: string; colorAlpha: string; colorBorder: string; descripcion: string; items: Item[] }[] = [
  {
    num: '01',
    nombre: 'Centro de control de trámites',
    icon: Package,
    color: GALCOMEX_BLUE,
    colorAlpha: 'rgba(0,119,182,.10)',
    colorBorder: 'rgba(0,119,182,.28)',
    descripcion: 'Panel principal donde el equipo hace seguimiento de todas las importaciones activas. Cada trámite tiene su propio expediente con toda la información centralizada.',
    items: [
      'Vista general con todos los trámites activos, su estado y alertas de atención inmediata',
      'Expediente por trámite: datos del cliente, agencia, fechas clave y estado del proceso',
      'Pipeline de etapas: desde la solicitud hasta el cierre, con historial completo de cada cambio',
      'Búsqueda y filtros para encontrar cualquier trámite en segundos',
      'Vista tipo tablero para seguimiento visual del flujo de trabajo',
      'Lista de verificación de documentos requeridos antes de avanzar a la siguiente etapa',
      'Acceso diferenciado: Luis Martínez solo ve sus propias operaciones',
    ],
  },
  {
    num: '02',
    nombre: 'Pagos, anticipos y saldo en tiempo real',
    icon: DollarSign,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.28)',
    descripcion: 'Control financiero de cada trámite: registro de anticipos recibidos, pagos realizados en nombre del cliente y saldo disponible actualizado al instante.',
    items: [
      'Registro de anticipos por cliente con saldo disponible en tiempo real',
      'Aplicación de anticipos a uno o varios trámites con validación automática de saldo',
      'Libro de pagos: registro de todos los pagos realizados en cada importación (DIAN, puertos, agencias)',
      'Saldo corriente actualizado automáticamente: lo que quedó del anticipo menos los pagos realizados',
      'Adjunto de comprobantes bancarios a cada movimiento',
      'Matriz de costos bancarios precargada: el costo de cada transacción se registra automáticamente según el canal',
      'Vista de ingresos: entradas y salidas consolidadas por cliente y período',
    ],
  },
  {
    num: '03',
    nombre: 'Facturación revisada y sin errores',
    icon: FileText,
    color: '#f59e0b',
    colorAlpha: 'rgba(245,158,11,.10)',
    colorBorder: 'rgba(245,158,11,.28)',
    descripcion: 'El borrador de factura se genera automáticamente con todos los valores calculados. El equipo revisa y aprueba antes de emitir, y la factura queda registrada en SIIGO.',
    items: [
      'Generación automática del borrador de factura con todos los valores ya calculados',
      'Vista de revisión: el responsable aprueba o hace observaciones línea por línea antes de emitir',
      'Cálculo automático de comisiones, IVA, costos bancarios, 4x1000 y saldos finales',
      'Manejo diferenciado para operaciones de Luis Martínez con sus propias reglas de cálculo',
      'Integración con SIIGO: la factura aprobada se envía directamente al sistema contable',
      'Registro del número de factura SIIGO y actualización automática de cartera',
      'Historial de versiones del borrador con registro de quién aprobó y cuándo',
    ],
  },
  {
    num: '04',
    nombre: 'Cartera y devoluciones bajo control',
    icon: Activity,
    color: '#a78bfa',
    colorAlpha: 'rgba(167,139,250,.10)',
    colorBorder: 'rgba(167,139,250,.28)',
    descripcion: 'Panel consolidado de la cartera de Galcomex: quién debe, cuánto hay que devolver y qué ya está saldado. Siempre actualizado, sin necesidad de hacer cuentas.',
    items: [
      'Vista de cartera por cliente: saldo a cobrar o a devolver en tiempo real',
      'Registro de abonos parciales: el cliente puede pagar en cuotas y el sistema actualiza el saldo',
      'Registro de devoluciones al cliente con comprobante adjunto',
      'Indicador de estado por factura: pendiente, parcialmente pagada o saldada',
      'Historial completo de movimientos por cliente para consulta y trazabilidad',
    ],
  },
  {
    num: '05',
    nombre: 'Documentos de cada operación en un solo lugar',
    icon: FolderOpen,
    color: '#34d399',
    colorAlpha: 'rgba(52,211,153,.10)',
    colorBorder: 'rgba(52,211,153,.28)',
    descripcion: 'Cada trámite tiene su propia carpeta digital organizada por tipo de documento. El equipo sube, consulta y descarga archivos directamente desde la herramienta.',
    items: [
      'Carpeta digital por trámite con organización automática por tipo de documento',
      'Subida de archivos desde cualquier dispositivo: PDF, imágenes, hojas de cálculo',
      'Visualización de documentos en pantalla sin necesidad de descargar',
      'Categorías incluidas: Factura Comercial, BL, Packing List, Declaración DIAN, Soporte de Facturación, Comprobante Bancario y más',
      'Registro de quién subió cada archivo y cuándo, para control y trazabilidad',
    ],
  },
];

// ─── SECCIONES NAV ───────────────────────────────────────────────────────────

const SECCIONES = [
  { id: 'resumen',    label: 'Resumen'     },
  { id: 'beneficios', label: 'Beneficios'  },
  { id: 'incluye',   label: 'Qué incluye' },
  { id: 'inversion', label: 'Inversión'   },
  { id: 'vigencia',  label: 'Vigencia'    },
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
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: `linear-gradient(90deg,${GALCOMEX_BLUE},#00bfa5)` }} />
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const GalcomexProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [moduloActivo, setModuloActivo] = useState<number | null>(null);

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
            style={{ background: `radial-gradient(circle, rgba(0,119,182,.06) 0%, transparent 65%)` }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,119,182,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
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
                <img src="/galcomex-logo.png" alt="Galcomex" className="h-full w-auto object-contain rounded"
                  style={{ filter: 'drop-shadow(0 1px 4px rgba(0,119,182,.3))' }} />
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
              <TagLabel>Propuesta de trabajo y cotización · Sistema de Gestión Operativa</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${GALCOMEX_BLUE}, #005f8a)` }}>
                  <Package className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: `rgba(0,119,182,.12)`, border: `1px solid rgba(0,119,182,.28)`, color: '#38bdf8' }}>
                  Logística · Importaciones
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 4.8rem)' }}>
                Sistema de<br />
                <span style={{ background: `linear-gradient(90deg,${GALCOMEX_BLUE},#00bfa5)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Gestión
                </span>
                <br />
                <span className="text-white/80">Operativa</span>
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
                  {['1. Resumen ejecutivo','2. Resultados que obtendrán','3. Qué incluye la herramienta','4. Propuesta de inversión','5. Vigencia y términos'].map((item, i) => (
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
                  style={{ background: `radial-gradient(circle, rgba(0,119,182,.08) 0%, rgba(0,191,165,.04) 50%, transparent 70%)` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full" style={{ border: `1px solid rgba(0,119,182,.12)` }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(0,191,165,.15)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: GALCOMEX_BLUE, boxShadow: `0 0 6px rgba(0,119,182,.8)` }} />
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
                    style={{ background: `linear-gradient(135deg, rgba(0,119,182,.18), rgba(0,119,182,.06))`, border: `1px solid rgba(0,119,182,.3)`, boxShadow: `0 4px 30px rgba(0,119,182,.18)` }}>
                    <img src="/galcomex-logo.png" alt="Galcomex" className="h-14 w-auto object-contain rounded"
                      style={{ filter: 'drop-shadow(0 2px 12px rgba(0,119,182,.5))' }} />
                  </div>
                  <div className="text-center">
                    <p className="font-poppins font-bold text-white/80 text-[17px] tracking-tight">Galcomex</p>
                    <p className="font-lato text-[13px] uppercase tracking-[0.2em] mt-1" style={{ color: '#38bdf8' }}>Logística · Importaciones · Barranquilla</p>
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
            style={{ background: 'rgba(2,8,20,.85)', border: `1px solid rgba(0,119,182,.20)` }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="rounded-xl p-4 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, rgba(0,119,182,.18), rgba(0,119,182,.06))`, border: `1px solid rgba(0,119,182,.3)` }}>
                <img src="/galcomex-logo.png" alt="Galcomex" className="h-10 w-auto object-contain rounded"
                  style={{ filter: 'drop-shadow(0 1px 6px rgba(0,119,182,.4))' }} />
              </div>
              <span className="font-lato text-[11px] uppercase tracking-[0.2em]" style={{ color: '#38bdf8' }}>Barranquilla</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">Logística · Agencia aduanera · Importaciones</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sede</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">Barranquilla, Colombia</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Equipo</p>
                <p className="font-lato text-white/60 text-[18px]">5 usuarios · Roles diferenciados por función</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Situación actual</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#f59e0b' }} />
                  <p className="font-poppins font-semibold text-[15px] text-[#f59e0b]">Gestión operativa en Excel y herramientas dispersas</p>
                </div>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sistema contable</p>
                <p className="font-lato text-white/60 text-[18px]">SIIGO Nube (facturación electrónica)</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Tipo de clientes</p>
                <p className="font-lato text-white/60 text-[18px]">Clientes propios + operaciones del socio estratégico</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              Galcomex es una agencia logística especializada en la gestión de importaciones. Su operación es compleja por naturaleza: cada importación involucra múltiples etapas, diferentes partes (agencias de aduanas, puertos, clientes), pagos en nombre de terceros, anticipos que deben controlarse y facturas que deben cuadrar al peso.
            </p>
            <p>
              Hoy, gran parte de esa gestión vive en hojas de cálculo y conversaciones de WhatsApp. Eso funciona hasta cierto punto, pero tiene un costo oculto: tiempo del equipo buscando información, errores en cálculos, anticipos que se pierden de vista y facturas que requieren revisiones manuales antes de salir.
            </p>
            <p>
              Sixteam propone una <strong className="text-white/90 font-semibold">herramienta de gestión a la medida</strong> de Galcomex: diseñada específicamente para la forma en que opera la agencia, con la lógica financiera exacta que maneja y los roles reales de cada persona del equipo.
            </p>
          </div>

          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> Situaciones que esta herramienta resuelve directamente
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
          <SectionTitle>Lo que cambia para Galcomex</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden mb-8"
            style={{ background: `rgba(0,119,182,.06)`, border: `1px solid rgba(0,119,182,.20)` }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: `radial-gradient(circle, rgba(0,119,182,.07), transparent 70%)`, transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 mb-4" style={{ color: GALCOMEX_BLUE }} />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[23px] leading-relaxed">
              El resultado no es una herramienta de moda: es <strong className="text-white font-black">recuperar el control de la operación</strong>. Saber exactamente dónde está cada importación, cuánto queda en cada anticipo, qué hay que cobrar y qué hay que devolver, sin depender de conversaciones ni de hojas de cálculo.
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

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Trámites activos',       value: 'Visibles', sub: 'Estado y detalle en tiempo real' },
              { label: 'Anticipos',               value: 'Controlados', sub: 'Saldo disponible siempre actualizado' },
              { label: 'Errores de facturación', value: 'Eliminados', sub: 'Cálculos automáticos y revisión previa' },
              { label: 'Documentos',              value: 'Organizados', sub: 'Un solo lugar, accesibles al instante' },
            ].map((k, i) => (
              <div key={i} className="rounded-xl p-4 text-center"
                style={{ background: i < 2 ? `rgba(0,119,182,.07)` : 'rgba(0,191,165,.06)', border: i < 2 ? `1px solid rgba(0,119,182,.20)` : '1px solid rgba(0,191,165,.18)' }}>
                <p className="font-poppins font-black text-white text-[18px] leading-tight mb-1">{k.value}</p>
                <p className="font-poppins font-semibold text-white/70 text-[13px] mb-0.5">{k.label}</p>
                <p className="font-lato text-white/35 text-[12px]">{k.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─ 03 QUÉ INCLUYE ─ */}
        <section id="incluye" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 · Qué incluye la herramienta</TagLabel>
          <SectionTitle>5 módulos · Desarrollo a la medida</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            La herramienta está compuesta por cinco módulos que cubren todo el ciclo de una importación: desde la apertura del trámite hasta el cierre de la cartera. Cada módulo está diseñado para la operación real de Galcomex.
          </p>

          <div className="relative">
            <div className="hidden sm:block absolute left-[28px] top-10 bottom-10 w-px"
              style={{ background: `linear-gradient(to bottom, rgba(0,119,182,.4), rgba(0,191,165,.4), rgba(245,158,11,.4), rgba(167,139,250,.4), rgba(52,211,153,.4))` }} />

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
                        <p className="font-lato text-white/40 text-[15px] mt-0.5 line-clamp-1">{mod.descripcion}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ml-2 ${open ? 'rotate-90' : ''}`}
                        style={{ color: open ? mod.color : 'rgba(255,255,255,.3)' }} />
                    </button>

                    {open && (
                      <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                        <div className="pt-4">
                          <p className="font-lato text-white/60 text-[17px] leading-relaxed mb-4">{mod.descripcion}</p>
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
            style={{ background: `rgba(0,119,182,.06)`, border: `1px solid rgba(0,119,182,.22)` }}>
            <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GALCOMEX_BLUE }} />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              La herramienta incluye un <strong className="text-white/80">sistema de acceso por roles</strong>: cada integrante del equipo accede únicamente a las funciones que le corresponden según su rol. El socio estratégico Luis Martínez tiene su propio acceso diferenciado, donde solo ve sus propias operaciones.
            </p>
          </div>
        </section>

        {/* ─ 04 INVERSIÓN ─ */}
        <section id="inversion" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 · Propuesta de inversión</TagLabel>
          <SectionTitle>Una inversión, un resultado tangible.</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            La propuesta se estructura en dos componentes: la implementación del sistema y el servicio mensual de mantenimiento y soporte en la nube. Todos los valores en <strong className="text-white/75">pesos colombianos (COP).</strong>
          </p>

          {/* Cards de inversión */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

            {/* Implementación */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: `linear-gradient(135deg, rgba(0,119,182,.10) 0%, rgba(3,13,26,.95) 100%)`, border: `1px solid rgba(0,119,182,.35)`, boxShadow: `0 4px 32px rgba(0,119,182,.15)` }}>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `rgba(0,119,182,.2)` }}>
                    <Zap className="w-4 h-4" style={{ color: GALCOMEX_BLUE }} />
                  </div>
                  <span className="font-poppins font-bold text-white/70 text-[15px]">Implementación</span>
                  <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider ml-auto"
                    style={{ background: `rgba(0,119,182,.18)`, border: `1px solid rgba(0,119,182,.35)`, color: '#38bdf8' }}>
                    Pago único
                  </span>
                </div>
                <p className="font-poppins font-black text-white leading-none mb-1" style={{ fontSize: '2.4rem' }}>
                  $4.000.000
                </p>
                <p className="font-lato text-white/35 text-[15px] mb-5">COP · Valor único de desarrollo</p>
                <ul className="space-y-2">
                  {[
                    'Diseño y desarrollo completo del sistema a la medida',
                    'Configuración inicial con la información de Galcomex',
                    'Capacitación al equipo para el uso de la herramienta',
                    'Puesta en marcha y acompañamiento en el lanzamiento',
                    'Período de garantía correctiva de 30 días desde la entrega',
                  ].map((p, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: GALCOMEX_BLUE }} />
                      <span className="font-lato text-white/60 text-[15px] leading-snug">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mensualidad */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: `linear-gradient(135deg, rgba(0,191,165,.08) 0%, rgba(3,13,26,.95) 100%)`, border: `1px solid rgba(0,191,165,.28)`, boxShadow: `0 4px 32px rgba(0,191,165,.10)` }}>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `rgba(0,191,165,.18)` }}>
                    <Shield className="w-4 h-4 text-[#00bfa5]" />
                  </div>
                  <span className="font-poppins font-bold text-white/70 text-[15px]">Mantenimiento y Soporte</span>
                  <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider ml-auto"
                    style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.28)', color: '#00bfa5' }}>
                    Mensual
                  </span>
                </div>
                <p className="font-poppins font-black text-white leading-none mb-1" style={{ fontSize: '2.4rem' }}>
                  $450.000
                </p>
                <p className="font-lato text-white/35 text-[15px] mb-5">COP / mes · Contrato mínimo 12 meses</p>
                <ul className="space-y-2">
                  {[
                    'Alojamiento de la herramienta en la nube incluido',
                    'Atención a inconvenientes o errores detectados en la plataforma',
                    'SLA de respuesta máximo de 4 horas ante cualquier incidencia',
                    'Actualizaciones de seguridad y estabilidad de la plataforma',
                    'Pago mensual o anual según lo acordado entre las partes',
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

          {/* Resumen numérico */}
          <div className="rounded-xl p-5 sm:p-6 mb-6"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center divide-y sm:divide-y-0 sm:divide-x" style={{ '--tw-divide-opacity': '0.08' } as React.CSSProperties}>
              <div className="py-3 sm:py-0">
                <p className="font-lato text-white/30 text-[12px] uppercase tracking-wider mb-1">Implementación</p>
                <p className="font-poppins font-black text-white text-[22px]">$4.000.000</p>
                <p className="font-lato text-white/35 text-[13px]">Pago único</p>
              </div>
              <div className="py-3 sm:py-0">
                <p className="font-lato text-white/30 text-[12px] uppercase tracking-wider mb-1">Mensualidad</p>
                <p className="font-poppins font-black text-[#00bfa5] text-[22px]">$450.000/mes</p>
                <p className="font-lato text-white/35 text-[13px]">Contrato mínimo 12 meses</p>
              </div>
              <div className="py-3 sm:py-0">
                <p className="font-lato text-white/30 text-[12px] uppercase tracking-wider mb-1">Total primer año</p>
                <p className="font-poppins font-black text-white text-[22px]">$9.400.000</p>
                <p className="font-lato text-white/35 text-[13px]">Implementación + 12 meses</p>
              </div>
            </div>
          </div>

          {/* Forma de pago */}
          <div className="rounded-xl p-5 sm:p-6 mb-6"
            style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.20)' }}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#00bfa5]" />
              <p className="font-poppins font-semibold text-white/80 text-[18px]">Forma de pago sugerida · Implementación</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { pct: '50%', momento: 'Al firmar el contrato', desc: 'Con la confirmación de la propuesta y la firma del contrato se inicia el desarrollo.', valor: '$2.000.000' },
                { pct: '50%', momento: 'Al mes siguiente', desc: 'El segundo pago se realiza al mes siguiente del inicio del proyecto, sin depender de la entrega.', valor: '$2.000.000' },
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
              El servicio mensual de soporte inicia desde la puesta en marcha de la herramienta. El esquema de pago (mensual o anual) se define de mutuo acuerdo entre las partes.
            </p>
          </div>

          <div className="rounded-xl p-4 flex gap-3"
            style={{ background: 'rgba(245,158,11,.05)', border: '1px solid rgba(245,158,11,.20)' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#f59e0b]" />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              Esta propuesta cubre el alcance funcional descrito en este documento. Cualquier requerimiento adicional que surja fuera de este alcance se manejará mediante cotización separada y no afectará el valor mensual del servicio de mantenimiento.
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

        {/* ─ 05 VIGENCIA ─ */}
        <section id="vigencia" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 · Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y Términos de la Propuesta</SectionTitle>
          <Rule />

          <div className="space-y-3">
            {[
              {
                titulo: 'Cómo aceptar esta propuesta',
                desc: 'Para dar inicio al proyecto, Galcomex confirma su aceptación vía WhatsApp, correo electrónico o de forma verbal. Con esa confirmación se procede con la firma del contrato y el primer pago.',
                icon: CheckCircle,
              },
              {
                titulo: 'Forma de pago',
                desc: 'La implementación se paga en dos cuotas: 50% al firmar el contrato y 50% al mes siguiente. El pago de la mensualidad puede ser mensual o anual, según lo que acuerden ambas partes al inicio del contrato.',
                icon: FileText,
              },
              {
                titulo: 'Contrato mínimo de servicio',
                desc: 'El servicio mensual de mantenimiento y soporte tiene una permanencia mínima de 12 meses contados desde la puesta en marcha de la herramienta. Al vencer este período, el contrato puede renovarse o ajustarse de mutuo acuerdo.',
                icon: Clock,
              },
              {
                titulo: 'SLA y atención de incidencias',
                desc: 'Ante cualquier inconveniente o error detectado en la herramienta entregada, Sixteam garantiza un tiempo máximo de respuesta de 4 horas. Este SLA aplica en días y horarios hábiles, con comunicación directa vía WhatsApp o correo.',
                icon: Zap,
              },
              {
                titulo: 'Modificaciones al alcance',
                desc: 'Cualquier requerimiento funcional adicional que no esté contemplado en esta propuesta se manejará mediante una cotización independiente. Estos requerimientos adicionales no modificarán el valor mensual del servicio de mantenimiento acordado.',
                icon: AlertCircle,
              },
              {
                titulo: 'Propiedad y confidencialidad',
                desc: 'Galcomex es propietario de todos sus datos operativos y financieros. Sixteam se compromete a mantener la confidencialidad total de la información de Galcomex y sus clientes en todo momento, durante y después del contrato.',
                icon: Shield,
              },
              {
                titulo: 'Inicio del proyecto',
                desc: 'El desarrollo inicia desde la firma del contrato y el primer pago. Galcomex designará un responsable de proyecto por su parte para coordinar sesiones de revisión y validación durante el proceso de construcción.',
                icon: Target,
              },
              {
                titulo: 'Vigencia de la propuesta',
                desc: 'Esta propuesta tiene una vigencia de 30 días calendario desde su fecha de emisión. Pasado este plazo, los valores podrán ser revisados según las condiciones del mercado.',
                icon: Calendar,
              },
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
              style={{ background: `radial-gradient(circle at 50% 100%, rgba(0,119,182,.05), transparent 70%)` }} />
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
                <span className="text-white/40 font-medium">Guillermo Grisales · María Grisales</span>
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

export default GalcomexProposal;
