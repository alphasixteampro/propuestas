import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, ChevronRight, FileText, Target, Zap,
  MessageSquare, AlertCircle, Mail, ArrowRight, Building2,
  Calendar, Hash, User, Info, Globe, MapPin, Wrench, RefreshCw,
  Image, LayoutGrid, BarChart3,
} from 'lucide-react';
import LogoCarousel from '../components/LogoCarousel';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Hotel Casa Rueda',
  tagline: 'Hospitalidad en el Caribe',
  sector: 'Hotelería · Alojamiento',
  sedes: '2 sedes · Barranquilla, Colombia',
  fecha: 'Abril 2026',
  lugar: 'Barranquilla, Colombia',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  objetivo: 'Reactivación, mejoras, métricas y mantenimiento de página web',
};

const HOTEL_ACCENT = '#c9a84c'; // dorado cálido

const DIAGNOSTICO = [
  {
    titulo: 'Página web inactiva',
    desc: 'El sitio web del hotel se encuentra fuera de línea, lo que impide a potenciales huéspedes y empresas encontrar información, hacer reservas o contactar al hotel directamente.',
    icon: AlertCircle,
    tint: 'red',
  },
  {
    titulo: 'Sin métricas ni analítica',
    desc: 'El código fuente del sitio no tiene instalado ningún sistema de medición: ni Google Tag Manager, ni Google Analytics, ni Microsoft Clarity. El hotel no puede saber cuántas personas lo visitan, qué páginas consultan ni cómo se comportan.',
    icon: BarChart3,
    tint: 'red',
  },
  {
    titulo: 'Imágenes de baja calidad',
    desc: 'Varias fotografías actuales se visualizan pixeladas o de baja resolución, afectando la percepción de calidad del hotel y la decisión de compra del visitante.',
    icon: Image,
    tint: 'amber',
  },
  {
    titulo: 'Galería de habitaciones incompleta',
    desc: 'La sección de habitaciones carece de suficiente material fotográfico, lo que limita la capacidad de mostrar el valor real de cada tipo de alojamiento.',
    icon: LayoutGrid,
    tint: 'blue',
  },
  {
    titulo: 'Ausencia de segmento B2B',
    desc: 'El hotel opera con 2 sedes en Barranquilla y tiene potencial para captar empresas que traen personal o clientes a la ciudad, pero no cuenta con una sección web dedicada a este segmento.',
    icon: Building2,
    tint: 'teal',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber: { text: 'text-amber-400', bg: 'rgba(251,191,36,.07)', border: 'rgba(251,191,36,.18)' },
  teal:  { text: 'text-[#00bfa5]', bg: 'rgba(0,191,165,.07)',  border: 'rgba(0,191,165,.18)' },
  blue:  { text: 'text-[#60a5fa]', bg: 'rgba(96,165,250,.07)', border: 'rgba(96,165,250,.18)' },
  red:   { text: 'text-[#f87171]', bg: 'rgba(221,51,51,.07)',  border: 'rgba(221,51,51,.2)' },
};

const SERVICIOS = [
  {
    num: 'Servicio',
    nombre: 'Reactivación, mejoras, métricas y mantenimiento web semestral',
    tipo: 'Pago semestral',
    valor: 'COP 1.700.000',
    icon: Wrench,
    destacado: true,
    entregables: [
      'Reactivación del sitio web (página activa 24/7)',
      'Incorporación de nuevas fotografías de habitaciones (suministradas por el hotel)',
      'Reemplazo de imágenes pixeladas o de baja calidad',
      'Diseño e implementación de sección "Empresas" con planes corporativos',
      'Instalación y configuración de Google Tag Manager (GTM)',
      'Configuración de Microsoft Clarity (mapas de calor + grabaciones de sesión)',
      'Conexión de GTM con Google Analytics 4 para métricas de tráfico',
      'Actualizaciones sencillas de contenido: textos, fotos, precios, tarifas',
      'Soporte técnico ante caídas o errores del sitio',
      'Renovaciones de dominio y certificado SSL incluidas',
      'Reporte mensual de estado del sitio',
    ],
    detalle: [
      'Recepción del material fotográfico actualizado y criterios de la sección empresarial.',
      'Optimización y reemplazo de imágenes en la galería de habitaciones.',
      'Diseño de la sección B2B con planes empresariales, formulario de contacto y beneficios para empresas aliadas.',
      'Instalación de Google Tag Manager como capa de gestión de etiquetas; desde GTM se disparan GA4 (tráfico, páginas vistas, eventos) y cualquier herramienta futura sin tocar el código.',
      'Configuración de Microsoft Clarity (gratuito): mapas de calor, grabaciones de sesión y detección de "rage clicks".',
      'Gestión del hosting para garantizar disponibilidad continua y respuesta ante incidentes técnicos.',
      'Ejecución de cambios menores de contenido solicitados por el hotel (hasta 4 cambios por semestre).',
      'Comunicación directa vía WhatsApp y reporte mensual de estado del sitio.',
    ],
  },
];

const SECCIONES = [
  { id: 'resumen',   label: 'Resumen' },
  { id: 'objetivo',  label: 'Objetivo' },
  { id: 'plan',      label: 'Servicios' },
  { id: 'cotizacion',label: 'Cotización' },
  { id: 'vigencia',  label: 'Vigencia' },
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

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const HotelCasaRuedaProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [servicioActivo, setServicioActivo] = useState<number | null>(null);

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

      {/* ── NAV LATERAL ─ solo lg ── */}
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

      {/* ══════════════════════════════════════ PORTADA */}
      <header className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #04111f 0%, #071826 55%, #091f34 100%)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(201,168,76,.05) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(29,112,162,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        </div>

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-b" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-white">
              <img src="/sixteam-logo.png" alt="Sixteam.pro" className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <div>
              <span className="font-poppins font-black text-white text-xl tracking-tight">Sixteam<span className="text-[#00bfa5]">.</span>pro</span>
              <p className="font-lato text-white/35 text-[13px] leading-none mt-0.5">Innovación y Estrategia Digital</p>
            </div>
          </div>
          <span className="font-lato text-[#00bfa5]/80 text-[13px] uppercase tracking-[0.2em] border border-[#00bfa5]/20 rounded-full px-3 py-1.5">
            Confidencial
          </span>
        </div>

        {/* Animaciones portada */}
        <style>{`
          @keyframes cover-spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes cover-spin-rev  { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
          @keyframes cover-pulse-glow {
            0%, 100% { opacity: 0.07; transform: scale(1); }
            50%       { opacity: 0.14; transform: scale(1.1); }
          }
          @keyframes cover-float {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-10px); }
          }
          .cover-ring-1 { animation: cover-spin-slow 24s linear infinite; }
          .cover-ring-2 { animation: cover-spin-rev  18s linear infinite; }
          .cover-glow   { animation: cover-pulse-glow 4s ease-in-out infinite; }
          .cover-float  { animation: cover-float 5s ease-in-out infinite; }
        `}</style>

        {/* Cuerpo portada */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            {/* — Izquierda: texto — */}
            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta de trabajo y cotización</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${HOTEL_ACCENT}, #a07830)` }}>
                  <Building2 className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(201,168,76,.08)', border: `1px solid rgba(201,168,76,.22)`, color: HOTEL_ACCENT }}>
                  {META.tagline}
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}>
                Propuesta<br />
                <span style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Comercial
                </span>
              </h1>
              <p className="font-lato text-white/55 text-xl leading-relaxed mb-5">
                {META.objetivo}
              </p>

              {/* Eslogan Sixteam */}
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

              {/* Chips info */}
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  { icon: Calendar, text: META.fecha },
                  { icon: MapPin,   text: META.lugar },
                  { icon: Globe,    text: META.sector },
                  { icon: Hash,     text: `NIT ${META.nit}` },
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

              {/* Índice rápido */}
              <div className="border-t pt-5" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-widest mb-3">Contenido</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                  {['1. Resumen ejecutivo', '2. Objetivo general', '3. Servicios', '4. Cotización', '5. Vigencia y términos'].map((item, i) => (
                    <button key={i} onClick={() => scrollTo(SECCIONES[i]?.id)}
                      className="font-lato text-white/45 text-[15px] hover:text-[#00bfa5] transition-colors duration-200 text-left flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#00bfa5]/40 flex-shrink-0" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* — Derecha: animación — */}
            <div className="flex items-center justify-center relative min-h-[380px]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="cover-glow absolute w-80 h-80 rounded-full"
                  style={{ background: `radial-gradient(circle, rgba(201,168,76,.09) 0%, rgba(29,112,162,.05) 50%, transparent 70%)` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full"
                  style={{ border: `1px solid rgba(201,168,76,.10)` }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full"
                  style={{ border: '1px dashed rgba(29,112,162,.15)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: HOTEL_ACCENT, boxShadow: `0 0 6px rgba(201,168,76,.8)` }} />
                </div>
              </div>

              <div className="cover-float relative z-10 flex flex-col items-center gap-6 w-full px-6">
                {/* Sixteam */}
                <div className="flex flex-col items-center gap-1">
                  <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-20 w-auto object-contain"
                    style={{ filter: 'drop-shadow(0 4px 20px rgba(0,191,165,.45))' }} />
                  <span className="font-poppins font-black text-white/30 text-[11px] uppercase tracking-[0.2em]">Sixteam.pro</span>
                </div>
                {/* Divisor × */}
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.08))' }} />
                  <div className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)' }}>
                    <span className="font-poppins font-black text-white/40 text-[20px] leading-none">×</span>
                  </div>
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,.08), transparent)' }} />
                </div>
                {/* Hotel */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, rgba(201,168,76,.15), rgba(160,120,48,.1))`, border: `1px solid rgba(201,168,76,.25)`, boxShadow: `0 4px 30px rgba(201,168,76,.15)` }}>
                    <Building2 className="w-12 h-12" style={{ color: HOTEL_ACCENT }} />
                  </div>
                  <div className="text-center">
                    <span className="font-poppins font-black text-white/80 text-[18px] tracking-tight">Hotel Casa Rueda</span>
                    <p className="font-poppins font-black text-white/30 text-[11px] uppercase tracking-[0.2em] mt-0.5">Barranquilla, Colombia</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll cue */}
        <div className="relative z-10 flex flex-col items-center gap-2 pb-10 opacity-30 no-print">
          <p className="font-lato text-white text-[13px] uppercase tracking-widest">Desplazar</p>
          <div className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </header>

      {/* ══════════════════════════════════════ SOCIAL PROOF */}
      <div className="w-full relative z-20 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <LogoCarousel />
      </div>

      {/* ══════════════════════════════════════ CONTENIDO PRINCIPAL */}
      <main className="max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-20 space-y-24">

        {/* ─ 01 RESUMEN ─ */}
        <section id="resumen" ref={s1.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s1.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>01 — Resumen ejecutivo</TagLabel>
          <SectionTitle>Contexto y diagnóstico</SectionTitle>
          <Rule />

          {/* Ficha del cliente */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${HOTEL_ACCENT}, #a07830)`, boxShadow: `0 4px 20px rgba(201,168,76,.25)` }}>
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <span className="font-poppins font-black text-white text-[15px] tracking-tight text-center">Casa Rueda</span>
              <span className="font-lato text-[11px] uppercase tracking-[0.2em]" style={{ color: HOTEL_ACCENT }}>{META.tagline}</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">{META.sector}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sedes</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">{META.sedes}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Enfoque estratégico</p>
                <p className="font-lato text-white/60 text-[18px]">B2C + Segmento B2B corporativo</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Fecha de propuesta</p>
                <p className="font-lato text-white/60 text-[18px]">{META.fecha}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>Hotel Casa Rueda opera con <strong className="text-white/90 font-semibold">2 sedes en Barranquilla</strong> y tiene potencial para atender tanto a viajeros individuales como a empresas que traen personal, clientes o visitantes a la ciudad de manera frecuente. En este momento, el hotel opera sin presencia web activa, lo que representa una <strong className="text-white/90 font-semibold">barrera directa a la captación de nuevos clientes</strong> y a la visibilidad digital.</p>
            <p>Al revisar el código fuente del sitio actual, se confirmó que <strong className="text-white/90 font-semibold">no existe ningún sistema de medición instalado</strong>: sin Google Tag Manager, sin Analytics ni Clarity, el hotel opera totalmente a ciegas — sin saber cuántas personas visitan el sitio, qué habitaciones consultan ni de dónde vienen. Esto se corrige en el Servicio 1 junto con las mejoras de contenido y la nueva sección B2B.</p>
            <p>El plan contempla dos componentes: unas <strong className="text-white/90 font-semibold">mejoras inmediatas</strong> al sitio (fotos, métricas, sección empresarial) y un <strong className="text-white/90 font-semibold">mantenimiento semestral</strong> que garantiza que la página permanezca activa y actualizada.</p>
          </div>

          {/* Diagnóstico */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> Situación actual identificada
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DIAGNOSTICO.map((h, i) => {
                const Icon = h.icon; const t = TINT[h.tint];
                return (
                  <div key={i} className="rounded-xl p-4 flex gap-3"
                    style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                    <Icon className={`w-4 h-4 ${t.text} flex-shrink-0 mt-0.5`} />
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
              style={{ background: 'radial-gradient(circle, rgba(201,168,76,.06), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 text-[#00bfa5] mb-4" />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[23px] leading-relaxed">
              Restablecer la presencia digital de Hotel Casa Rueda con una página web activa, visualmente atractiva y medible — mejorando la galería de habitaciones, eliminando imágenes de baja calidad, implementando Google Tag Manager + Microsoft Clarity para tener métricas reales por primera vez, incorporando una sección B2B para empresas con planes corporativos, y asegurando la continuidad del sitio con un plan de mantenimiento semestral.
            </p>
          </div>
        </section>

        {/* ─ 03 PLAN / SERVICIOS ─ */}
        <section id="plan" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — Servicios</TagLabel>
          <SectionTitle>Alcance completo · todo en uno</SectionTitle>
          <Rule />

          <div className="space-y-2.5">
            {SERVICIOS.map((s, i) => {
              const Icon = s.icon; const open = servicioActivo === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? '1px solid rgba(0,191,165,.3)' : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setServicioActivo(open ? null : i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? 'rgba(0,191,165,.15)' : 'rgba(255,255,255,.05)' }}>
                      <Icon className={`w-4 h-4 transition-colors ${open ? 'text-[#00bfa5]' : 'text-white/35'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`font-poppins font-bold text-[18px] ${open ? 'text-white' : 'text-white/70'}`}>{s.num}</span>
                        {s.destacado && (
                          <span className="px-2 py-0.5 rounded-full font-lato font-bold text-[11px] uppercase tracking-wider text-[#030d1a]"
                            style={{ background: '#00bfa5' }}>★ Inicio recomendado</span>
                        )}
                      </div>
                      <p className={`font-lato text-[18px] mt-0.5 ${open ? 'text-white/80' : 'text-white/40'}`}>{s.nombre}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <div className="text-right hidden sm:block">
                        <p className={`font-poppins font-bold text-[18px] ${s.destacado ? 'text-[#00bfa5]' : 'text-white/60'}`}>{s.valor}</p>
                        <p className="font-lato text-white/30 text-[13px] mt-0.5">{s.tipo}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-[#00bfa5]/60 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`} />
                    </div>
                  </button>
                  {open && (
                    <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Entregables</p>
                          <ul className="space-y-2">
                            {s.entregables.map((e, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                                <span className="font-lato text-white/65 text-[18px]">{e}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Actividades</p>
                          <ul className="space-y-2.5">
                            {s.detalle.map((d, j) => (
                              <li key={j} className="font-lato text-white/50 text-[18px] leading-snug pl-3 border-l border-[#1d70a2]/30">{d}</li>
                            ))}
                          </ul>
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                            <p className="font-lato text-white/30 text-[15px]">Forma de pago: <span className="text-white/55">{s.tipo}</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ─ 04 COTIZACIÓN ─ */}
        <section id="cotizacion" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Cotización</TagLabel>
          <SectionTitle>Inversión total</SectionTitle>
          <Rule />
          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-6">
            Valores en <strong className="text-white/75">pesos colombianos (COP)</strong>. No incluyen compra de dominio ni fotografías profesionales.
          </p>

          <div className="space-y-3 mb-8">
            {SERVICIOS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0"
                  style={{ background: s.destacado ? 'rgba(0,191,165,.05)' : 'rgba(255,255,255,.03)', border: s.destacado ? '1px solid rgba(0,191,165,.2)' : '1px solid rgba(255,255,255,.06)' }}>
                  <div className="flex items-center gap-3 sm:w-2/5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: s.destacado ? 'rgba(0,191,165,.18)' : 'rgba(255,255,255,.05)' }}>
                      <Icon className={`w-4 h-4 ${s.destacado ? 'text-[#00bfa5]' : 'text-white/30'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-poppins font-bold text-white/80 text-[18px]">{s.num}</span>
                        {s.destacado && (
                          <span className="px-2 py-0.5 rounded-full font-lato font-bold text-[10px] uppercase text-[#030d1a]" style={{ background: '#00bfa5' }}>★ Primero</span>
                        )}
                      </div>
                      <p className="font-lato text-white/45 text-[15px] mt-0.5">{s.tipo}</p>
                    </div>
                  </div>
                  <div className="sm:w-1/4">
                    <p className={`font-poppins font-black text-[23px] ${s.destacado ? 'text-[#00bfa5]' : 'text-white/75'}`}>{s.valor}</p>
                  </div>
                  <div className="sm:w-1/3">
                    <p className="font-lato text-white/35 text-[15px]">{s.nombre}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Herramientas incluidas (gratuitas) */}
          <div className="rounded-xl p-4 sm:p-5 mb-4 flex flex-col sm:flex-row gap-4 sm:items-center"
            style={{ background: 'rgba(0,191,165,.04)', border: '1px solid rgba(0,191,165,.15)' }}>
            <BarChart3 className="w-5 h-5 text-[#00bfa5] flex-shrink-0" />
            <div>
              <p className="font-poppins font-semibold text-white/80 text-[15px] mb-1">Herramientas de métricas incluidas — sin costo adicional</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  { nombre: 'Google Tag Manager', desc: 'Gestión centralizada de etiquetas' },
                  { nombre: 'Microsoft Clarity', desc: 'Mapas de calor · Grabaciones de sesión' },
                  { nombre: 'Google Analytics 4', desc: 'Tráfico · Páginas vistas · Eventos' },
                ].map((h, i) => (
                  <div key={i} className="rounded-lg px-3 py-2"
                    style={{ background: 'rgba(0,191,165,.08)', border: '1px solid rgba(0,191,165,.18)' }}>
                    <p className="font-poppins font-bold text-[#00bfa5] text-[13px]">{h.nombre}</p>
                    <p className="font-lato text-white/40 text-[12px]">{h.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8"
            style={{ background: 'rgba(201,168,76,.04)', border: `1px solid rgba(201,168,76,.18)` }}>
            <Zap className="w-6 h-6 flex-shrink-0" style={{ color: HOTEL_ACCENT }} />
            <div className="flex-1">
              <p className="font-poppins font-semibold text-white/70 text-[18px]">Inversión total semestral</p>
              <p className="font-lato text-white/35 text-[14px] mt-0.5">Incluye mejoras, métricas, mantenimiento y reportes mensuales</p>
            </div>
            <p className="font-poppins font-black text-[32px]" style={{ color: HOTEL_ACCENT }}>COP 1.700.000</p>
          </div>
        </section>

        {/* ─ 05 VIGENCIA Y TÉRMINOS ─ */}
        <section id="vigencia" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y Términos de la Propuesta</SectionTitle>
          <Rule />

          <div className="space-y-3">
            {[
              {
                titulo: 'Aprobación',
                desc: 'Para aceptar esta propuesta y dar inicio al proyecto, se requiere una confirmación vía WhatsApp, correo o verbal para habilitar un enlace con el contrato a firmar y proceder.',
                icon: CheckCircle,
              },
              {
                titulo: 'Términos de Pago',
                desc: 'El pago de COP 1.700.000 se realiza de forma anticipada al inicio de cada semestre. Al recibir el primer pago se da inicio inmediato a las actividades de mejora y configuración. Los semestres siguientes se facturan al inicio de cada período.',
                icon: FileText,
              },
              {
                titulo: 'Contenido y material',
                desc: 'Las fotografías e imágenes nuevas deben ser suministradas por el hotel en formato digital de alta resolución. Sixteam.pro realiza la optimización y publicación, no la producción fotográfica.',
                icon: Image,
              },
              {
                titulo: 'Modificaciones al alcance',
                desc: 'Cambios adicionales no contemplados en esta propuesta (nuevo diseño, funcionalidades extra, integraciones) requieren una cotización separada.',
                icon: AlertCircle,
              },
              {
                titulo: 'Inicio del proyecto',
                desc: 'Los trabajos comienzan a partir de la recepción del pago inicial y la entrega de accesos al sitio web actual y el material fotográfico por parte del hotel.',
                icon: Zap,
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
        </section>
      </main>

      {/* ══════════════════════════════════════ FOOTER */}
      <footer style={{ background: 'linear-gradient(180deg, #04111f, #030d1a)' }}>
        <div className="relative overflow-hidden border-t" style={{ borderColor: `rgba(201,168,76,.12)` }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(201,168,76,.05), transparent 65%)', transform: 'translate(30%,-30%)' }} />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-16 sm:py-20 text-center">
            <TagLabel>¿Avanzamos?</TagLabel>
            <h2 className="font-poppins font-black text-white mt-4 mb-4 leading-tight"
              style={{ fontSize: 'clamp(2.25rem, 6.25vw, 4rem)' }}>
              ¿Listo Hotel Casa Rueda para volver a estar en línea?
            </h2>
            <p className="font-lato text-white/50 max-w-md mx-auto mb-8 text-[18px] sm:text-xl leading-relaxed">
              Podemos iniciar esta semana. Escríbenos para confirmar y coordinar los accesos e inicio.
            </p>
            <div className="flex justify-center">
              <a href="https://wa.me/573004188522" target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-poppins font-bold text-[18px] text-[#030d1a] transition-all duration-300 hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#00bfa5,#00d4b8)', boxShadow: '0 4px 28px rgba(0,191,165,.4)' }}>
                <MessageSquare className="w-4 h-4" />
                Confirmar por WhatsApp
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-8 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <p className="font-poppins font-black text-white text-xl mb-0.5">
                Sixteam<span className="text-[#00bfa5]">.</span>pro
              </p>
              <p className="font-lato text-white/30 text-[15px]">Innovación y Estrategia Digital S.A.S.</p>
              <p className="font-lato text-white/25 text-[15px] mt-0.5">NIT {META.nit}</p>
            </div>
            <div>
              <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-2">Contacto</p>
              <a href={`mailto:${META.correo}`}
                className="font-lato text-white/55 text-[18px] hover:text-[#00bfa5] transition-colors flex items-center gap-1.5 mb-1">
                <Mail className="w-3.5 h-3.5" />{META.correo}
              </a>
              <p className="font-lato text-white/35 text-[15px] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />{META.lugar}
              </p>
            </div>
            <div>
              <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-2">Representante legal</p>
              <p className="font-lato text-white/55 text-[18px] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#00bfa5]" />{META.rl}
              </p>
              <p className="font-lato text-white/25 text-[15px] mt-2">Válida 30 días · {META.fecha}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HotelCasaRuedaProposal;
