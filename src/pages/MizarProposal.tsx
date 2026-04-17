import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, Target, Zap, BarChart3,
  AlertCircle, TrendingUp, ArrowRight,
  Calendar, MapPin, Users, Layers,
  Eye, MousePointer, RefreshCw, Star, Percent, Settings,
} from 'lucide-react';
import LogoCarousel from '../components/LogoCarousel';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Mizar Diseño y Construcciones',
  contacto: 'Juliana Parada',
  tagline: 'Construyendo tu futuro',
  sector: 'Inmobiliaria · Lotes urbanos y rurales',
  sede: 'Colombia',
  web: 'mizar.co',
  fecha: 'Abril 2026',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  objetivo: 'Optimización de pauta Meta Ads para un producto de alto valor y ciclo de venta largo',
};

const MIZAR_GOLD = '#c9a443';
const MIZAR_GOLD_ALPHA = 'rgba(201,164,67,';

const DIAGNOSTICO = [
  {
    titulo: 'Objetivo de campaña incorrecto',
    desc: 'Las campañas activas están configuradas con objetivo "Interacción". El algoritmo de Meta busca personas que reaccionen o comenten — no personas con intención de compra real. Esto genera alto volumen de leads que no cierran.',
    icon: AlertCircle, tint: 'red',
  },
  {
    titulo: 'Sin remarketing activo',
    desc: 'Personas que vieron un video al 75%, visitaron el perfil o interactuaron con publicaciones no reciben seguimiento. Se pierde todo el trabajo de captación sin dar continuidad al prospecto.',
    icon: RefreshCw, tint: 'amber',
  },
  {
    titulo: 'Audiencias de conversión sin explotar',
    desc: 'Los datos de leads calificados que genera el CRM no retroalimentan la pauta. Meta sigue buscando perfiles genéricos en lugar de personas similares a los compradores reales de Mizar.',
    icon: Users, tint: 'blue',
  },
  {
    titulo: 'Contenido sin diferenciación por etapa',
    desc: 'El mismo mensaje llega a prospectos fríos y calientes. Para cerrar el ciclo largo de venta de Mizar, el equipo de contenido necesita piezas distintas para cada capa del embudo: reconocimiento, consideración y conversión.',
    icon: Layers, tint: 'teal',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber: { text: 'text-amber-400',   bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)' },
  teal:  { text: 'text-[#00bfa5]',   bg: 'rgba(0,191,165,.07)',   border: 'rgba(0,191,165,.18)' },
  blue:  { text: 'text-[#60a5fa]',   bg: 'rgba(96,165,250,.07)',  border: 'rgba(96,165,250,.18)' },
  red:   { text: 'text-[#f87171]',   bg: 'rgba(221,51,51,.07)',   border: 'rgba(221,51,51,.2)' },
};

// ─── CAPAS DEL EMBUDO ────────────────────────────────────────────────────────

const CAPAS = [
  {
    num: '01',
    nombre: 'Reconocimiento',
    label: 'Top of Funnel',
    objetivo: 'Alcance · Visualización de Video',
    audiencia: 'Público frío ampliado por intereses y demografía',
    contenido: ['Recorridos de proyectos en video', 'Actualizaciones de obra (stories)', 'Contenido educativo: ¿Por qué invertir en finca raíz?'],
    meta_objetivo: 'Alcance y Reconocimiento de marca',
    icon: Eye,
    color: '#60a5fa',
    colorAlpha: 'rgba(96,165,250,',
  },
  {
    num: '02',
    nombre: 'Consideración',
    label: 'Mid of Funnel',
    objetivo: 'Tráfico · Interacción (re-engagement)',
    audiencia: 'Audiencias personalizadas: views al 75%, visitantes de perfil, interacciones previas',
    contenido: ['Testimonios de compradores reales', 'Comparativas de valorización de la zona', 'Aspectos legales de la compra: guía rápida', 'Proyectos con precio y disponibilidad'],
    meta_objetivo: 'Tráfico hacia landing page, perfil de Instagram o WhatsApp · Interacción (re-engagement)',
    icon: MousePointer,
    color: MIZAR_GOLD,
    colorAlpha: MIZAR_GOLD_ALPHA,
  },
  {
    num: '03',
    nombre: 'Conversión',
    label: 'Bottom of Funnel',
    objetivo: 'Clientes Potenciales · Ventas',
    audiencia: 'Lookalike de compradores reales (desde CRM) + audiencias de alta intención · Optimizado por eventos API desde agendas y CRM',
    contenido: ['Oferta específica con CTA claro', 'Social proof: número de lotes vendidos', 'Urgencia real: disponibilidad limitada por proyecto'],
    meta_objetivo: 'Clientes Potenciales o Ventas (no Interacción)',
    icon: Target,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,',
  },
];

// ─── GESTIÓN MENSUAL ─────────────────────────────────────────────────────────

const GESTION = {
  fijo: 'COP 800.000',
  variable: '10% del presupuesto invertido en Meta ese mes',
  ejemplo: { inversion: 3000000, fijo: 800000, variable: 300000, total: 1100000 },
  descripcion: 'Gestión mensual continua de la pauta Meta Ads. La fee se compone de una tarifa fija de administración más un porcentaje del presupuesto invertido — alineando los incentivos de Sixteam con los resultados de Mizar. El primer mes incluye la configuración inicial de la cuenta, sin cobro adicional de setup.',
  configuracion: [
    { text: 'Revisión y corrección del objetivo de campaña: migrar de "Interacción" a objetivos de Alcance, Tráfico o Clientes Potenciales según la capa del embudo', tag: 'Corrección crítica' },
    { text: 'Verificación y configuración del Meta Pixel + validación de la Conversions API (eventos desde agendas y CRM)', tag: 'Píxel & API' },
    { text: 'Configuración de remarketing activo: audiencias personalizadas de views al 75%, visitantes de perfil e interacciones en los últimos 180 días', tag: 'Audiencias' },
    { text: 'Carga de base de leads calificados y compradores del CRM → creación de Lookalike Audiences para campañas de conversión', tag: 'Lookalike' },
    { text: 'Estructuración del portafolio comercial en Meta: productos, proyectos y activos disponibles para pauta' },
    { text: 'Diseño de la estructura base de campañas alineada a los tres objetivos del funnel (Reconocimiento · Consideración · Conversión)', tag: 'Estructura' },
    { text: 'Configuración de reglas de exclusión: leads ya captados no reciben anuncios de prospección fría' },
  ] as { text: string; tag?: string }[],
  incluye: [
    'Creación de campañas, conjuntos de anuncios y anuncios en Meta Ads',
    'Revisión semanal de rendimiento por capa del embudo',
    'Optimización de presupuesto, pujas y distribución entre campañas',
    'A/B testing de creatividades y copys',
    'Actualización mensual de audiencias Lookalike con nuevos datos del CRM',
    'Informe mensual de rendimiento: CPL, calidad de lead, alcance por capa',
    'Alertas ante caídas de rendimiento o cambios de política de Meta',
    '2 sesiones mensuales de revisión y alineación con el equipo Mizar',
  ],
};

const SECCIONES = [
  { id: 'resumen', label: 'Diagnóstico' },
  { id: 'embudo', label: 'Embudo' },
  { id: 'gestion', label: 'Gestión mensual' },
  { id: 'inversion', label: 'Inversión' },
  { id: 'vigencia', label: 'Vigencia' },
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
  <span className="font-lato uppercase tracking-[0.22em] font-medium" style={{ color: MIZAR_GOLD, fontSize: 13 }}>{children}</span>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-poppins font-extrabold text-white mt-2 mb-2 leading-tight"
    style={{ fontSize: 'clamp(1.8125rem, 4.375vw, 2.625rem)' }}>
    {children}
  </h2>
);

const Rule = () => (
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: `linear-gradient(90deg,#1d70a2,${MIZAR_GOLD})` }} />
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const MizarProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');

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
            <div className={`rounded-full flex-shrink-0 transition-all duration-300 ${activeSection === s.id ? 'w-2 h-2 shadow-[0_0_6px_rgba(201,164,67,.7)]' : 'w-1.5 h-1.5 bg-white/50'}`}
              style={activeSection === s.id ? { background: MIZAR_GOLD } : {}} />
          </button>
        ))}
      </nav>

      {/* ══════════ PORTADA */}
      <header className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #04111f 0%, #071826 55%, #091f34 100%)' }}>

        {/* Fondo decorativo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
            style={{ background: `radial-gradient(circle, ${MIZAR_GOLD_ALPHA}0.06) 0%, transparent 65%)` }} />
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
              <span className="font-poppins font-black text-white text-xl tracking-tight">Sixteam<span style={{ color: MIZAR_GOLD }}>.</span>pro</span>
              <p className="font-lato text-white/35 text-[13px] leading-none mt-0.5">Innovación y Estrategia Digital</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Logo Mizar */}
            <div className="h-8 flex items-center">
              <img src="/mizar-logo.png" alt="Mizar" className="h-full w-auto object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <span className="font-lato text-[13px] uppercase tracking-[0.2em] border rounded-full px-3 py-1.5"
              style={{ color: `${MIZAR_GOLD}cc`, borderColor: `${MIZAR_GOLD}30` }}>
              Confidencial
            </span>
          </div>
        </div>

        {/* Cuerpo portada */}
        <style>{`
          @keyframes cover-pulse-glow { 0%,100%{opacity:.07;transform:scale(1)} 50%{opacity:.16;transform:scale(1.12)} }
          @keyframes cover-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
          @keyframes cover-spin-slow { to{transform:rotate(360deg)} }
          @keyframes cover-spin-rev  { to{transform:rotate(-360deg)} }
          .cover-glow  { animation: cover-pulse-glow 4s ease-in-out infinite; }
          .cover-float { animation: cover-float 5s ease-in-out infinite; }
          .ring-slow   { animation: cover-spin-slow 22s linear infinite; }
          .ring-rev    { animation: cover-spin-rev  16s linear infinite; }
        `}</style>

        <div className="relative z-10 flex-1 flex items-center justify-center py-12 px-[10%]">
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            {/* Texto */}
            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta de trabajo y cotización</TagLabel>

              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${MIZAR_GOLD}, #8B6914)` }}>
                  <MapPin className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.contacto}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: `${MIZAR_GOLD_ALPHA}0.10)`, border: `1px solid ${MIZAR_GOLD_ALPHA}0.25)`, color: MIZAR_GOLD }}>
                  {META.cliente}
                </span>
              </div>

              {/* Logo Mizar */}
              <div className="mb-5 flex items-center gap-4">
                <div className="h-14 px-4 py-2 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.96)', border: `1px solid ${MIZAR_GOLD_ALPHA}0.3)` }}>
                  <img src="/mizar-logo.png" alt="Mizar Diseño y Construcciones"
                    className="h-full w-auto object-contain"
                    style={{ maxWidth: 180 }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              </div>

              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}>
                Pauta Meta<br />
                <span style={{ background: `linear-gradient(90deg,#1d70a2,${MIZAR_GOLD})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Ads Mizar
                </span>
              </h1>

              <p className="font-lato text-white/55 text-xl leading-relaxed mb-5">
                {META.objetivo}
              </p>

              <div className="inline-flex flex-wrap items-center gap-1.5 px-4 py-2 rounded-xl mb-6 self-start"
                style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)' }}>
                <span className="font-poppins font-bold text-white/80 text-[15px] sm:text-[18px]">Process</span>
                <span className="font-poppins font-bold text-[#1d70a2] text-[15px] sm:text-[18px]">+</span>
                <span className="font-poppins font-bold text-[#1d70a2] text-[15px] sm:text-[18px]">Technology</span>
                <span className="font-poppins font-bold text-[#1d70a2] text-[15px] sm:text-[18px]">+</span>
                <span className="font-poppins font-bold text-white/80 text-[15px] sm:text-[18px]">People</span>
                <span className="font-poppins font-bold text-white/50 text-[15px] sm:text-[18px]">=</span>
                <span className="font-poppins font-black text-[15px] sm:text-[18px]" style={{ color: MIZAR_GOLD }}>Growth</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  { icon: Calendar, text: META.fecha },
                  { icon: MapPin, text: META.sede },
                  { icon: Target, text: META.sector },
                ].map((chip, i) => {
                  const Icon = chip.icon;
                  return (
                    <div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[15px] text-white/60"
                      style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: MIZAR_GOLD }} /> {chip.text}
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-5" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-widest mb-3">Contenido</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                  {['1. Diagnóstico actual', '2. Arquitectura de embudo', '3. Gestión mensual', '4. Propuesta de inversión', '5. Vigencia y términos'].map((item, i) => (
                    <button key={i} onClick={() => scrollTo(SECCIONES[i]?.id)}
                      className="font-lato text-white/45 text-[15px] hover:text-white/80 transition-colors duration-200 text-left flex items-center gap-1.5">
                      <ArrowRight className="w-3 h-3 flex-shrink-0" style={{ color: MIZAR_GOLD }} />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual derecha — embudo animado */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-72 h-72">
                {/* Glow central */}
                <div className="cover-glow absolute inset-0 rounded-full"
                  style={{ background: `radial-gradient(circle, ${MIZAR_GOLD_ALPHA}0.18) 0%, transparent 70%)` }} />
                {/* Anillo exterior */}
                <div className="ring-slow absolute inset-4 rounded-full border"
                  style={{ borderColor: `${MIZAR_GOLD_ALPHA}0.12)`, borderStyle: 'dashed' }} />
                {/* Anillo interior */}
                <div className="ring-rev absolute inset-10 rounded-full border"
                  style={{ borderColor: 'rgba(29,112,162,.18)', borderStyle: 'dashed' }} />
                {/* Centro */}
                <div className="cover-float absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-2xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.97)', border: `1px solid ${MIZAR_GOLD_ALPHA}0.4)` }}>
                    <img src="/mizar-logo.png" alt="Mizar"
                      className="w-24 h-auto object-contain"
                      onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        el.style.display = 'none';
                        const parent = el.parentElement;
                        if (parent) {
                          parent.style.background = `linear-gradient(135deg, ${MIZAR_GOLD_ALPHA}0.25), #1a1400)`;
                          parent.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='${MIZAR_GOLD}' stroke-width='2'><circle cx='12' cy='12' r='10'/><line x1='22' y1='12' x2='18' y2='12'/><line x1='6' y1='12' x2='2' y2='12'/><line x1='12' y1='6' x2='12' y2='2'/><line x1='12' y1='22' x2='12' y2='18'/></svg>`;
                        }
                      }} />
                  </div>
                </div>
                {/* Satélites */}
                {[
                  { label: 'Reconocimiento', angle: -60, icon: Eye, color: '#60a5fa' },
                  { label: 'Consideración', angle: 60, icon: MousePointer, color: MIZAR_GOLD },
                  { label: 'Conversión', angle: 180, icon: TrendingUp, color: '#00bfa5' },
                ].map(({ label, angle, icon: Icon, color }) => {
                  const rad = (angle * Math.PI) / 180;
                  const r = 110;
                  const x = 50 + (r / 1.44) * Math.sin(rad);
                  const y = 50 - (r / 1.44) * Math.cos(rad);
                  return (
                    <div key={label} className="absolute flex flex-col items-center gap-1"
                      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)' }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <span className="font-lato text-[9px] text-white/50 whitespace-nowrap">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="relative z-10 flex justify-center pb-8 no-print">
          <div className="flex flex-col items-center gap-2 opacity-30">
            <span className="font-lato text-white text-[11px] uppercase tracking-widest">Ver propuesta</span>
            <ArrowRight className="w-4 h-4 text-white rotate-90" />
          </div>
        </div>
      </header>

      {/* ══════════ CUERPO */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-20 space-y-28">

        {/* ── SECCIÓN 1: DIAGNÓSTICO ── */}
        <section id="resumen" ref={s1.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s1.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Situación actual</TagLabel>
          <SectionTitle>Diagnóstico de pauta</SectionTitle>
          <Rule />
          <p className="font-lato text-white/60 text-lg leading-relaxed mb-10">
            Mizar comercializa un producto que, para gran parte de sus compradores, representa la decisión financiera más significativa de su vida.
            El ciclo de venta es largo, la confianza es el activo más valioso — y la pauta digital debe estar diseñada con esa lógica como punto de partida.
            Estas son las oportunidades de mejora identificadas:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DIAGNOSTICO.map((h, i) => {
              const Icon = h.icon;
              const t = TINT[h.tint];
              return (
                <div key={i} className="rounded-2xl p-6 flex flex-col gap-3 border"
                  style={{ background: t.bg, borderColor: t.border }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                      <Icon className={`w-4 h-4 ${t.text}`} />
                    </div>
                    <h3 className={`font-poppins font-bold text-[15px] ${t.text}`}>{h.titulo}</h3>
                  </div>
                  <p className="font-lato text-white/60 text-[14px] leading-relaxed">{h.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SECCIÓN 2: EMBUDO ── */}
        <section id="embudo" ref={s2.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Solución propuesta</TagLabel>
          <SectionTitle>Arquitectura de embudo — 3 capas</SectionTitle>
          <Rule />
          <p className="font-lato text-white/60 text-lg leading-relaxed mb-10">
            El algoritmo de Meta optimiza exactamente hacia lo que se le indica. La corrección clave es estructurar las campañas en tres capas con objetivos distintos,
            audiencias distintas y contenido distinto — cada una diseñada para el momento preciso del proceso de decisión del prospecto.
          </p>

          <div className="space-y-4">
            {CAPAS.map((capa, i) => {
              const Icon = capa.icon;
              return (
                <div key={i} className="rounded-2xl p-6 border"
                  style={{ background: `${capa.colorAlpha}0.06)`, borderColor: `${capa.colorAlpha}0.2)` }}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-poppins font-black text-[28px] leading-none" style={{ color: `${capa.colorAlpha}0.25)` }}>{capa.num}</span>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${capa.colorAlpha}0.12)`, border: `1px solid ${capa.colorAlpha}0.25)` }}>
                        <Icon className="w-5 h-5" style={{ color: capa.color }} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-poppins font-bold text-white text-[17px]">{capa.nombre}</h3>
                        <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                          style={{ background: `${capa.colorAlpha}0.12)`, color: capa.color, border: `1px solid ${capa.colorAlpha}0.2)` }}>
                          {capa.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                          <p className="font-lato text-white/35 text-[11px] uppercase tracking-widest mb-1.5">Objetivo Meta</p>
                          <p className="font-lato text-white/80 text-[13px] leading-snug">{capa.meta_objetivo}</p>
                        </div>
                        <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                          <p className="font-lato text-white/35 text-[11px] uppercase tracking-widest mb-1.5">Audiencia</p>
                          <p className="font-lato text-white/80 text-[13px] leading-snug">{capa.audiencia}</p>
                        </div>
                        <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                          <p className="font-lato text-white/35 text-[11px] uppercase tracking-widest mb-1.5">Contenido</p>
                          <ul className="space-y-0.5">
                            {capa.contenido.map((c, j) => (
                              <li key={j} className="font-lato text-white/70 text-[13px] flex items-start gap-1.5">
                                <span className="mt-0.5 flex-shrink-0" style={{ color: capa.color }}>·</span>{c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Insight Lookalike */}
          <div className="mt-6 rounded-2xl p-6 border" style={{ background: `${MIZAR_GOLD_ALPHA}0.05)`, borderColor: `${MIZAR_GOLD_ALPHA}0.2)` }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${MIZAR_GOLD_ALPHA}0.12)`, border: `1px solid ${MIZAR_GOLD_ALPHA}0.25)` }}>
                <Star className="w-5 h-5" style={{ color: MIZAR_GOLD }} />
              </div>
              <div>
                <h3 className="font-poppins font-bold text-[15px] mb-1" style={{ color: MIZAR_GOLD }}>El poder de los Lookalike Audiences desde el CRM</h3>
                <p className="font-lato text-white/65 text-[14px] leading-relaxed">
                  A medida que el CRM identifica qué tipo de prospecto efectivamente compra, esos datos se cargan directamente en Meta para crear
                  Públicos Similares (Lookalike). En la práctica: Meta deja de buscar personas de forma genérica y empieza a buscar perfiles
                  con comportamientos similares a los compradores reales de Mizar — mejorando la calidad del lead desde la fuente y reduciendo
                  el costo por adquisición con el tiempo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECCIÓN 3: GESTIÓN MENSUAL ── */}
        <section id="gestion" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Continuidad</TagLabel>
          <SectionTitle>Gestión mensual de pauta</SectionTitle>
          <Rule />
          <p className="font-lato text-white/60 text-lg leading-relaxed mb-8">
            La pauta requiere monitoreo y optimización continua. El algoritmo de Meta aprende con el tiempo, y las audiencias Lookalike mejoran cada vez que se actualizan con nuevos datos del CRM.
            El servicio se contrata bajo un único esquema mensual — la configuración inicial de la cuenta queda incluida dentro del primer mes, sin cobro adicional de setup.
          </p>

          <p className="font-lato text-white/60 text-[14px] leading-relaxed mb-6">{GESTION.descripcion}</p>

          {/* Modelo de precio */}
          <div className="rounded-2xl overflow-hidden border mb-5" style={{ borderColor: `${MIZAR_GOLD_ALPHA}0.22)` }}>
            <div className="grid grid-cols-2 border-b" style={{ borderColor: `${MIZAR_GOLD_ALPHA}0.15)` }}>
              {/* Fee fija */}
              <div className="p-6 border-r" style={{ background: `${MIZAR_GOLD_ALPHA}0.06)`, borderColor: `${MIZAR_GOLD_ALPHA}0.15)` }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${MIZAR_GOLD_ALPHA}0.15)`, border: `1px solid ${MIZAR_GOLD_ALPHA}0.3)` }}>
                    <BarChart3 className="w-3.5 h-3.5" style={{ color: MIZAR_GOLD }} />
                  </div>
                  <span className="font-lato text-white/40 text-[11px] uppercase tracking-widest">Fee fija</span>
                </div>
                <p className="font-poppins font-black text-[1.7rem]" style={{ color: MIZAR_GOLD }}>{GESTION.fijo}</p>
                <p className="font-lato text-white/40 text-[12px] mt-0.5">por mes · por cuenta</p>
              </div>
              {/* Fee variable */}
              <div className="p-6" style={{ background: `${MIZAR_GOLD_ALPHA}0.04)` }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${MIZAR_GOLD_ALPHA}0.15)`, border: `1px solid ${MIZAR_GOLD_ALPHA}0.3)` }}>
                    <Percent className="w-3.5 h-3.5" style={{ color: MIZAR_GOLD }} />
                  </div>
                  <span className="font-lato text-white/40 text-[11px] uppercase tracking-widest">Fee variable</span>
                </div>
                <p className="font-poppins font-black text-[1.7rem]" style={{ color: MIZAR_GOLD }}>10%</p>
                <p className="font-lato text-white/40 text-[12px] mt-0.5">del presupuesto invertido en Meta</p>
              </div>
            </div>
            {/* Ejemplo */}
            <div className="px-6 py-4 flex flex-wrap items-center gap-2" style={{ background: 'rgba(255,255,255,.02)' }}>
              <span className="font-lato text-white/35 text-[12px] uppercase tracking-widest">Ejemplo:</span>
              <span className="font-lato text-white/55 text-[13px]">
                Si Mizar invierte <span className="text-white/80 font-semibold">COP {GESTION.ejemplo.inversion.toLocaleString('es-CO')}</span> en pauta ese mes
                → fee = <span className="text-white/80 font-semibold">COP {GESTION.ejemplo.fijo.toLocaleString('es-CO')}</span> fijo
                + <span className="text-white/80 font-semibold">COP {GESTION.ejemplo.variable.toLocaleString('es-CO')}</span> (10%)
                = <span className="font-poppins font-bold" style={{ color: MIZAR_GOLD }}>COP {GESTION.ejemplo.total.toLocaleString('es-CO')} total</span>
              </span>
            </div>
          </div>

          {/* Configuración inicial (primer mes, incluida) */}
          <div className="mt-2 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${MIZAR_GOLD_ALPHA}0.15)`, border: `1px solid ${MIZAR_GOLD_ALPHA}0.3)` }}>
                <Settings className="w-4 h-4" style={{ color: MIZAR_GOLD }} />
              </div>
              <div>
                <p className="font-poppins font-bold text-white text-[15px]">Configuración inicial — primer mes</p>
                <p className="font-lato text-white/45 text-[12px]">Incluida dentro de la gestión mensual, sin costo adicional de setup</p>
              </div>
            </div>
            <div className="space-y-2">
              {GESTION.configuracion.map((act, j) => (
                <div key={j} className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.05)' }}>
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: MIZAR_GOLD }} />
                  <span className="font-lato text-white/70 text-[13px] leading-relaxed flex-1">{act.text}</span>
                  {act.tag && (
                    <span className="font-lato text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap flex-shrink-0"
                      style={{ background: `${MIZAR_GOLD_ALPHA}0.1)`, color: MIZAR_GOLD, border: `1px solid ${MIZAR_GOLD_ALPHA}0.2)` }}>
                      {act.tag}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Operación mensual recurrente */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(29,112,162,.15)', border: '1px solid rgba(29,112,162,.3)' }}>
                <RefreshCw className="w-4 h-4" style={{ color: '#60a5fa' }} />
              </div>
              <div>
                <p className="font-poppins font-bold text-white text-[15px]">Operación mensual recurrente</p>
                <p className="font-lato text-white/45 text-[12px]">Actividades que se ejecutan cada mes dentro del servicio</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GESTION.incluye.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.05)' }}>
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: MIZAR_GOLD }} />
                  <span className="font-lato text-white/70 text-[13px] leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECCIÓN 4: INVERSIÓN ── */}
        <section id="inversion" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Propuesta de inversión</TagLabel>
          <SectionTitle>Resumen de inversión</SectionTitle>
          <Rule />

          <p className="font-lato text-white/60 text-lg leading-relaxed mb-8">
            Un único esquema recurrente: gestión mensual de pauta Meta Ads. La configuración inicial queda incluida dentro del primer mes, sin cobro separado de setup.
          </p>

          {/* Tarjeta única: gestión mensual */}
          <div className="rounded-2xl overflow-hidden border mb-6" style={{ borderColor: `${MIZAR_GOLD_ALPHA}0.22)` }}>
            <div className="p-6" style={{ background: `${MIZAR_GOLD_ALPHA}0.07)` }}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap"
                      style={{ background: `${MIZAR_GOLD_ALPHA}0.18)`, color: MIZAR_GOLD, border: `1px solid ${MIZAR_GOLD_ALPHA}0.35)` }}>
                      Recurrente
                    </span>
                  </div>
                  <p className="font-poppins font-bold text-white text-[17px] mb-1">Gestión mensual de pauta Meta Ads</p>
                  <p className="font-lato text-white/50 text-[13px] leading-relaxed">
                    Configuración inicial incluida en el primer mes · creación de campañas · revisión semanal · optimización · A/B testing · actualización de Lookalike desde CRM · informe mensual · 2 sesiones de revisión
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-poppins font-black text-[1.8rem] block whitespace-nowrap leading-none" style={{ color: MIZAR_GOLD }}>800K + 10%</span>
                  <span className="font-lato text-white/40 text-[12px] block mt-1">por mes</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t" style={{ borderColor: `${MIZAR_GOLD_ALPHA}0.15)` }}>
                <div className="flex items-center gap-2">
                  <span className="font-lato text-white/40 text-[12px] uppercase tracking-widest">Fee fija</span>
                  <span className="font-poppins font-bold text-white text-[14px]">COP 800.000</span>
                  <span className="font-lato text-white/40 text-[12px]">/ mes</span>
                </div>
                <span className="font-lato text-white/30 text-[13px]">+</span>
                <div className="flex items-center gap-2">
                  <span className="font-lato text-white/40 text-[12px] uppercase tracking-widest">Fee variable</span>
                  <span className="font-poppins font-bold text-white text-[14px]">10%</span>
                  <span className="font-lato text-white/40 text-[12px]">del presupuesto invertido en Meta</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nota presupuesto pauta */}
          <div className="rounded-2xl p-5 border" style={{ background: 'rgba(96,165,250,.05)', borderColor: 'rgba(96,165,250,.15)' }}>
            <div className="flex items-start gap-3">
              <BarChart3 className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-400" />
              <div>
                <p className="font-poppins font-bold text-blue-300 text-[14px] mb-1">Nota sobre el presupuesto de pauta</p>
                <p className="font-lato text-white/60 text-[13px] leading-relaxed">
                  El presupuesto de pauta (lo que se le paga directamente a Meta) se define en conjunto con el equipo de Mizar
                  según los proyectos activos y los objetivos de leads por mes. No está incluido en ninguno de los valores anteriores.
                  Sixteam gestiona ese presupuesto pero los pagos a Meta los realiza directamente Mizar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECCIÓN 5: VIGENCIA ── */}
        <section id="vigencia" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Términos</TagLabel>
          <SectionTitle>Vigencia y condiciones</SectionTitle>
          <Rule />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              { label: 'Vigencia de la propuesta', valor: '30 días desde la fecha de emisión' },
              { label: 'Inicio de trabajo', valor: 'Dentro de los 5 días hábiles tras la confirmación' },
              { label: 'Forma de pago', valor: 'Mensual anticipado' },
              { label: 'Modalidad', valor: 'Remota con sesiones de videoconferencia' },
              { label: 'Cancelación gestión mensual', valor: 'Con 15 días de anticipación, sin penalidad' },
              { label: 'Facturación', valor: 'Con IVA discriminado · desde Sixteam.pro' },
            ].map((item, i) => (
              <div key={i} className="rounded-xl p-4 border" style={{ background: 'rgba(255,255,255,.03)', borderColor: 'rgba(255,255,255,.07)' }}>
                <p className="font-lato text-white/35 text-[11px] uppercase tracking-widest mb-1">{item.label}</p>
                <p className="font-lato text-white/80 text-[14px]">{item.valor}</p>
              </div>
            ))}
          </div>

          {/* Cláusula de no garantía de rendimiento */}
          <div className="rounded-2xl p-5 border mb-6" style={{ background: 'rgba(248,113,113,.04)', borderColor: 'rgba(248,113,113,.15)' }}>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
              <div>
                <p className="font-poppins font-bold text-red-300 text-[14px] mb-1.5">Cláusula de alcance y rendimiento</p>
                <p className="font-lato text-white/60 text-[13px] leading-relaxed">
                  Sixteam.pro presta un servicio de configuración, gestión y optimización de pauta publicitaria en Meta Ads. El alcance del servicio
                  comprende la implementación técnica, la gestión estratégica y la optimización continua de campañas. Sin embargo, <span className="text-white/80 font-semibold">Sixteam.pro
                  no garantiza resultados específicos de ventas, número de leads, costo por adquisición ni retorno sobre la inversión publicitaria</span>,
                  dado que estos dependen de variables externas como el presupuesto de pauta, la calidad de los activos creativos, las condiciones del mercado
                  y el seguimiento comercial que realice el equipo de Mizar. El cliente reconoce y acepta este alcance al contratar el servicio.
                </p>
              </div>
            </div>
          </div>

          {/* Cierre */}
          <div className="rounded-2xl p-8 text-center" style={{ background: `linear-gradient(135deg, rgba(10,35,66,.8), rgba(3,13,26,.9))`, border: `1px solid ${MIZAR_GOLD_ALPHA}0.2)` }}>
            <p className="font-poppins font-bold text-white text-[18px] mb-2">Preparados para comenzar</p>
            <p className="font-lato text-white/55 text-[15px] mb-6 max-w-lg mx-auto leading-relaxed">
              El primer paso es una sesión de revisión de cuenta para validar el diagnóstico en vivo. Sin compromisos.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="mailto:alpha@sixteam.pro" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-poppins font-bold text-[14px] text-[#030d1a] transition-all duration-200 hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${MIZAR_GOLD}, #8B6914)` }}>
                <Zap className="w-4 h-4" /> Agendar sesión
              </a>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-lato text-[14px] text-white/60 border" style={{ borderColor: 'rgba(255,255,255,.1)' }}>
                alpha@sixteam.pro
              </div>
            </div>
          </div>

          {/* Firma */}
          <div className="mt-10 pt-8 border-t flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
            <div>
              <p className="font-poppins font-bold text-white text-[15px]">{META.rl}</p>
              <p className="font-lato text-white/45 text-[13px]">CEO · {META.proponente}</p>
              <p className="font-lato text-white/30 text-[12px]">NIT {META.nit} · {META.correo}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded overflow-hidden flex-shrink-0">
                <img src="/sixteam-logo.png" alt="Sixteam.pro" className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <span className="font-poppins font-black text-white text-[18px]">Sixteam<span style={{ color: MIZAR_GOLD }}>.</span>pro</span>
            </div>
          </div>
        </section>
      </main>

      {/* ── Logo carousel ── */}
      <div className="border-t py-10 no-print" style={{ borderColor: 'rgba(29,112,162,.1)' }}>
        <LogoCarousel />
      </div>

      {/* Footer */}
      <footer className="text-center py-8 font-lato text-[12px] text-white/20 border-t" style={{ borderColor: 'rgba(29,112,162,.08)' }}>
        Sixteam.pro · NIT 901.967.849-4 · alpha@sixteam.pro · Documento confidencial — {META.fecha}
      </footer>
    </div>
  );
};

export default MizarProposal;
