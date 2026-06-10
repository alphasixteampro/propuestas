import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, ChevronRight, Clock, FileText,
  MessageCircle, Bot, Users, BarChart3,
  Calendar, Info, MapPin, Zap, Settings,
  GraduationCap, X, Globe, Music, TrendingUp,
} from 'lucide-react';

const META = {
  cliente: 'Motion Minds',
  tagline: 'Academia de Baile · Guatemala',
  sector: 'Entretenimiento · Educación · Danza',
  fecha: 'Junio 2026',
  lugar: 'Ciudad de Guatemala',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
};

const MM_GREEN = '#9dff2e';

const SECCIONES = [
  { id: 'propuesta',  label: 'Propuesta' },
  { id: 'plataforma', label: 'Plataforma' },
  { id: 'plan',       label: 'Plan' },
  { id: 'inversion',  label: 'Inversión' },
  { id: 'vigencia',   label: 'Vigencia' },
];

const CAPACIDADES_IA = [
  { icon: MessageCircle, titulo: 'Responde preguntas frecuentes', desc: 'Horarios, clases, precios, ubicación y más — de forma automática.' },
  { icon: Users,         titulo: 'Filtra y clasifica leads',      desc: 'Identifica el tipo de interesado y recolecta datos clave antes de escalar.' },
  { icon: Bot,           titulo: 'Informa para convertir',        desc: 'Brinda toda la información que un prospecto necesita para inscribirse.' },
  { icon: Globe,         titulo: 'Disponible 24/7',               desc: 'Atiende en WhatsApp, Instagram, Facebook y tu página web sin parar.' },
];

const INBOX_FEATURES = [
  { included: true,  text: 'Bandeja omnicanal unificada (WhatsApp, Instagram, Facebook, web)' },
  { included: true,  text: 'IA conversacional en modo sugerido o piloto automático' },
  { included: true,  text: 'Entrenamiento del bot con tus FAQs, horarios y documentos' },
  { included: true,  text: 'Handoff automático de IA a asesor humano' },
  { included: true,  text: 'Widget de chat para tu sitio web' },
  { included: true,  text: 'Historial multicanal por contacto en un solo hilo' },
  { included: true,  text: 'Métricas y datos de conversaciones' },
  { included: true,  text: 'Gestión del listado de contactos generados' },
  { included: true,  text: 'Seguimiento y reactivación conversacional con IA' },
  { included: true,  text: 'Capacitación del equipo en uso del inbox' },
  { included: false, text: 'CRM de contactos completo' },
  { included: false, text: 'Pipelines y oportunidades' },
  { included: false, text: 'Automatizaciones avanzadas de workflow' },
];

const ETAPAS = [
  {
    num: '01',
    nombre: 'Consultoría y Contexto',
    duracion: '1 semana',
    icon: FileText,
    color: MM_GREEN,
    colorAlpha: 'rgba(157,255,46,.10)',
    colorBorder: 'rgba(157,255,46,.25)',
    actividades: [
      'Sesión de contexto con el equipo de Motion Minds para entender el negocio y sus procesos',
      'Recopilación de FAQs, horarios, precios, clases y servicios de la academia',
      'Definición del tono y personalidad del Asistente IA',
      'Diseño del flujo conversacional adaptado a leads e interesados',
    ],
  },
  {
    num: '02',
    nombre: 'Implementación de Configuraciones',
    duracion: '2 semanas',
    icon: Settings,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.25)',
    actividades: [
      'Configuración de Sixteam Inbox + IA con los canales de Motion Minds',
      'Parametrización del Asistente IA con toda la información de la academia',
      'Conexión de WhatsApp, Instagram, Facebook y widget para la página web',
      'Pruebas funcionales del asistente con escenarios reales',
    ],
  },
  {
    num: '03',
    nombre: 'Capacitaciones y Puesta en Marcha',
    duracion: '1 semana',
    icon: GraduationCap,
    color: '#a78bfa',
    colorAlpha: 'rgba(167,139,250,.10)',
    colorBorder: 'rgba(167,139,250,.25)',
    actividades: [
      'Sesión de capacitación al equipo en el uso del inbox y el asistente IA',
      'Ajustes finales basados en el feedback del equipo',
      'Activación en producción y acompañamiento en los primeros días',
      'Entrega de guías y material de apoyo para el equipo',
    ],
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

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
  <span className="font-lato text-[13px] uppercase tracking-[0.22em] font-medium" style={{ color: MM_GREEN }}>{children}</span>
);
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-poppins font-extrabold text-white mt-2 mb-2 leading-tight"
    style={{ fontSize: 'clamp(1.8125rem, 4.375vw, 2.625rem)' }}>
    {children}
  </h2>
);
const Rule = () => (
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: `linear-gradient(90deg,#1d70a2,${MM_GREEN})` }} />
);

// ─── COMPONENTE ───────────────────────────────────────────────────────────────

const MotionMindsProposal = () => {
  const [activeSection, setActiveSection] = useState('propuesta');
  const [etapaActiva, setEtapaActiva] = useState<number | null>(null);
  const [showPlan, setShowPlan] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [mensajesConv, setMensajesConv] = useState(8);
  const [convsMes, setConvsMes] = useState(150);
  const [showSoporte, setShowSoporte] = useState(false);
  const [showPauta, setShowPauta] = useState(false);

  const consumoIAUSD = (0.02 * mensajesConv * convsMes).toFixed(2);
  const totalMonthly = (180 + parseFloat(consumoIAUSD)).toFixed(2);

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

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const s1 = useVisible(); const s2 = useVisible();
  const s3 = useVisible(); const s4 = useVisible(); const s5 = useVisible();

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
            <div className={`rounded-full flex-shrink-0 transition-all duration-300 ${activeSection === s.id ? 'w-2 h-2' : 'w-1.5 h-1.5 bg-white/50'}`}
              style={activeSection === s.id ? { background: MM_GREEN, boxShadow: `0 0 6px rgba(157,255,46,.7)` } : {}} />
          </button>
        ))}
      </nav>

      {/* ══════════ PORTADA */}
      <header className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#010408 0%,#020810 55%,#030d1a 100%)' }}>

        {/* Fondo decorativo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle,rgba(157,255,46,.05) 0%,transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle,rgba(167,139,250,.04) 0%,transparent 70%)', transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        </div>

        {/* Topbar */}
        <div className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-b" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-white">
                <img src="/sixteam-logo.png" alt="Sixteam.pro" className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div className="hidden sm:block">
                <span className="font-poppins font-black text-white text-xl tracking-tight">
                  Sixteam<span style={{ color: MM_GREEN }}>.</span>pro
                </span>
                <p className="font-lato text-white/35 text-[13px] leading-none mt-0.5">Innovación y Estrategia Digital</p>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                <img src="/motion-minds-logo.jpg" alt="Motion Minds" className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <span className="font-poppins font-bold text-white/70 text-[15px] hidden sm:block">Motion Minds</span>
            </div>
          </div>
          <span className="font-lato text-[13px] uppercase tracking-[0.2em] border rounded-full px-3 py-1.5"
            style={{ color: `${MM_GREEN}cc`, borderColor: `${MM_GREEN}30` }}>
            Confidencial
          </span>
        </div>

        <style>{`
          @keyframes mm-spin-slow { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
          @keyframes mm-spin-rev  { from{transform:rotate(0deg)}to{transform:rotate(-360deg)} }
          @keyframes mm-glow      { 0%,100%{opacity:.06;transform:scale(1)} 50%{opacity:.13;transform:scale(1.1)} }
          @keyframes mm-float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
          .mm-ring1{animation:mm-spin-slow 24s linear infinite}
          .mm-ring2{animation:mm-spin-rev 18s linear infinite}
          .mm-glow{animation:mm-glow 5s ease-in-out infinite}
          .mm-float{animation:mm-float 5s ease-in-out infinite}
        `}</style>

        {/* Hero */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '8%', paddingRight: '8%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            {/* Izquierda — texto */}
            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta de trabajo y cotización · Junio 2026</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg,${MM_GREEN},#5caa00)` }}>
                  <Music className="w-3 h-3 text-black" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: `${MM_GREEN}18`, border: `1px solid ${MM_GREEN}35`, color: MM_GREEN }}>
                  {META.tagline}
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.8rem,5vw,5rem)' }}>
                Asistente IA<br />
                <span style={{ background: `linear-gradient(90deg,#1d70a2,${MM_GREEN})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  para tu academia
                </span>
              </h1>
              <p className="font-lato text-white/55 text-xl leading-relaxed mb-6">
                Atiende, filtra e informa a todos tus interesados de forma automática, en todos tus canales, las 24 horas del día.
              </p>

              {/* Fórmula */}
              <div className="inline-flex flex-wrap items-center gap-1.5 px-4 py-2 rounded-xl mb-6 self-start"
                style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)' }}>
                <span className="font-poppins font-bold text-white/80 text-[15px]">Process</span>
                <span className="font-poppins font-bold text-[#1d70a2] text-[15px]">+</span>
                <span className="font-poppins font-bold text-[#1d70a2] text-[15px]">Technology</span>
                <span className="font-poppins font-bold text-[15px]" style={{ color: MM_GREEN }}>+</span>
                <span className="font-poppins font-bold text-[15px]" style={{ color: MM_GREEN }}>People</span>
                <span className="font-poppins font-bold text-white/50 text-[15px]">=</span>
                <span className="font-poppins font-black text-[15px]" style={{ color: MM_GREEN }}>Growth</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  { icon: Calendar, text: META.fecha },
                  { icon: MapPin,   text: META.lugar },
                ].map((chip, i) => {
                  const Icon = chip.icon;
                  return (
                    <div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[15px] text-white/60"
                      style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: MM_GREEN }} />
                      {chip.text}
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-5" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-widest mb-3">Contenido</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                  {['1. La propuesta','2. Sixteam Inbox + IA','3. Plan de trabajo','4. Inversión','5. Vigencia y términos'].map((item, i) => (
                    <button key={i} onClick={() => scrollTo(SECCIONES[i]?.id)}
                      className="font-lato text-white/45 text-[15px] hover:text-white/70 transition-colors duration-200 text-left flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: `${MM_GREEN}60` }} />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Derecha — animación */}
            <div className="flex items-center justify-center relative min-h-[380px]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="mm-glow absolute w-80 h-80 rounded-full"
                  style={{ background: `radial-gradient(circle,${MM_GREEN}18 0%,rgba(29,112,162,.05) 50%,transparent 70%)` }} />
                <div className="mm-ring1 absolute w-96 h-96 rounded-full"
                  style={{ border: `1px solid ${MM_GREEN}20` }} />
                <div className="mm-ring2 absolute w-64 h-64 rounded-full"
                  style={{ border: '1px dashed rgba(167,139,250,.18)' }} />
                <div className="mm-ring1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1"
                    style={{ background: MM_GREEN, boxShadow: `0 0 8px ${MM_GREEN}cc` }} />
                </div>
                <div className="mm-ring2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]"
                    style={{ background: '#a78bfa', boxShadow: '0 0 6px rgba(167,139,250,.8)' }} />
                </div>
              </div>
              <div className="mm-float relative z-10 flex flex-col items-center gap-6 w-full px-6">
                <div className="flex flex-col items-center gap-1">
                  <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-16 w-auto object-contain"
                    style={{ filter: `drop-shadow(0 4px 20px ${MM_GREEN}66)` }} />
                  <span className="font-poppins font-black text-white/30 text-[11px] uppercase tracking-[0.2em]">Sixteam.pro</span>
                </div>
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.08))' }} />
                  <div className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)' }}>
                    <span className="font-poppins font-black text-white/40 text-[20px] leading-none">×</span>
                  </div>
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,rgba(255,255,255,.08),transparent)' }} />
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0"
                    style={{ border: `2px solid ${MM_GREEN}40`, boxShadow: `0 0 24px ${MM_GREEN}30` }}>
                    <img src="/motion-minds-logo.jpg" alt="Motion Minds"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        el.style.display = 'none';
                        el.parentElement!.style.background = '#7c3af5';
                        el.parentElement!.innerHTML = `<span style="font-family:Poppins,sans-serif;font-weight:900;font-size:2.5rem;color:#9dff2e;display:flex;align-items:center;justify-content:center;height:100%">MM</span>`;
                      }} />
                  </div>
                  <div className="text-center">
                    <span className="font-poppins font-black text-white text-[26px] tracking-tight">Motion Minds</span>
                    <p className="font-lato text-[13px] uppercase tracking-[0.2em] mt-1" style={{ color: MM_GREEN }}>Academia de Baile · Guatemala</p>
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

        {/* ─ 01 PROPUESTA ─ */}
        <section id="propuesta" ref={s1.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s1.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>01 — La propuesta</TagLabel>
          <SectionTitle>Un asistente que trabaja por ti, siempre.</SectionTitle>
          <Rule />

          <p className="font-lato text-white/55 text-[19px] leading-relaxed mb-10">
            Sixteam.pro propone diseñar e implementar un <strong className="text-white/85">Asistente Conversacional de IA</strong> entrenado con toda la información de Motion Minds, para atender de forma automática a leads e interesados que llegan por WhatsApp, Instagram, Facebook y la página web.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CAPACIDADES_IA.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div key={i} className="rounded-xl p-5 flex gap-4"
                  style={{ background: `${MM_GREEN}08`, border: `1px solid ${MM_GREEN}22` }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${MM_GREEN}18` }}>
                    <Icon className="w-4 h-4" style={{ color: MM_GREEN }} />
                  </div>
                  <div>
                    <p className="font-poppins font-bold text-white/90 text-[17px] mb-1">{cap.titulo}</p>
                    <p className="font-lato text-white/50 text-[15px] leading-relaxed">{cap.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Canales */}
          <div className="mt-8 rounded-xl p-5 flex flex-wrap items-center gap-3"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <span className="font-lato text-white/30 text-[13px] uppercase tracking-wider mr-2">Canales que cubre</span>
            {['WhatsApp', 'Instagram', 'Facebook', 'Página Web'].map((c, i) => (
              <span key={i} className="font-lato text-[14px] px-3 py-1.5 rounded-full text-white/65"
                style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)' }}>
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* ─ 02 PLATAFORMA ─ */}
        <section id="plataforma" ref={s2.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>02 — La plataforma</TagLabel>
          <SectionTitle>Sixteam Inbox + IA</SectionTitle>
          <Rule />

          <p className="font-lato text-white/55 text-[19px] leading-relaxed mb-8">
            El Asistente IA se implementa sobre <strong className="text-white/85">Sixteam Inbox + IA</strong>, la plataforma omnicanal que centraliza todas las conversaciones de tu academia en un solo lugar, con IA integrada para agilizar la atención.
          </p>

          <div className="rounded-2xl overflow-hidden transition-all duration-300"
            style={{ border: showPlan ? `1px solid ${MM_GREEN}30` : '1px solid rgba(255,255,255,.08)' }}>
            <button onClick={() => setShowPlan(!showPlan)}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-left"
              style={{ background: showPlan ? `${MM_GREEN}06` : 'rgba(255,255,255,.02)' }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: MM_GREEN }} />
              <span className="font-poppins font-semibold text-white/60 text-[13px] uppercase tracking-wider flex-1">
                Qué incluye el plan — USD 180 / mes · 2 usuarios
              </span>
              <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                style={{ color: `${MM_GREEN}60`, transform: showPlan ? 'rotate(90deg)' : undefined }} />
            </button>
            {showPlan && (
              <div className="divide-y divide-white/[0.04] border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                {INBOX_FEATURES.map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                    {feat.included
                      ? <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: MM_GREEN }} />
                      : <X className="w-4 h-4 flex-shrink-0 text-white/20" />
                    }
                    <span className={`font-lato text-[16px] leading-snug ${feat.included ? 'text-white/75' : 'text-white/25 line-through'}`}>
                      {feat.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 rounded-xl p-4 flex gap-3"
            style={{ background: `${MM_GREEN}08`, border: `1px solid ${MM_GREEN}22` }}>
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: MM_GREEN }} />
            <p className="font-lato text-white/50 text-[15px] leading-relaxed">
              La implementación incluye la configuración de la plataforma y la parametrización del Asistente IA desde cero para Motion Minds.
            </p>
          </div>
        </section>

        {/* ─ 03 PLAN ─ */}
        <section id="plan" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — Plan de trabajo</TagLabel>
          <SectionTitle>3 etapas · 4 semanas</SectionTitle>
          <Rule />

          <div className="relative">
            <div className="hidden sm:block absolute left-[28px] top-10 bottom-10 w-px"
              style={{ background: `linear-gradient(to bottom,${MM_GREEN}66,rgba(0,191,165,.4),rgba(167,139,250,.4))` }} />

            <div className="space-y-3">
              {ETAPAS.map((et, i) => {
                const Icon = et.icon;
                const open = etapaActiva === i;
                return (
                  <div key={i} className="rounded-xl overflow-hidden transition-all duration-300 sm:ml-12 relative"
                    style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${et.colorBorder}` : '1px solid rgba(255,255,255,.07)' }}>

                    <div className="hidden sm:flex absolute -left-12 top-5 w-8 h-8 rounded-full items-center justify-center border-2 z-10"
                      style={{ background: '#030d1a', borderColor: et.color }}>
                      <span className="font-poppins font-black text-[13px]" style={{ color: et.color }}>{et.num}</span>
                    </div>

                    <button onClick={() => setEtapaActiva(open ? null : i)}
                      className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: open ? et.colorAlpha : 'rgba(255,255,255,.05)' }}>
                        <Icon className="w-4 h-4 transition-colors" style={{ color: open ? et.color : 'rgba(255,255,255,.35)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`font-poppins font-bold text-[18px] ${open ? 'text-white' : 'text-white/70'}`}>
                          {et.nombre}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full"
                          style={{ background: et.colorAlpha, border: `1px solid ${et.colorBorder}` }}>
                          <Clock className="w-3 h-3" style={{ color: et.color }} />
                          <span className="font-poppins font-bold text-[13px]" style={{ color: et.color }}>{et.duracion}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`}
                          style={{ color: open ? et.color : 'rgba(255,255,255,.3)' }} />
                      </div>
                    </button>

                    {open && (
                      <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                        <ul className="pt-4 space-y-2">
                          {et.actividades.map((a, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: et.color }} />
                              <span className="font-lato text-white/65 text-[17px] leading-relaxed">{a}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─ 04 INVERSIÓN ─ */}
        <section id="inversion" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Inversión</TagLabel>
          <SectionTitle>Claro, transparente y sin sorpresas.</SectionTitle>
          <Rule />

          {/* Cards principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

            {/* Implementación */}
            <div className="rounded-2xl p-6 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg,${MM_GREEN}12 0%,rgba(3,13,26,.9) 100%)`, border: `1px solid ${MM_GREEN}35` }}>
              <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
                style={{ background: `radial-gradient(circle,${MM_GREEN}10,transparent 70%)`, transform: 'translate(20%,-20%)' }} />
              <div className="relative z-10">
                <span className="font-lato text-[12px] uppercase tracking-widest mb-3 block" style={{ color: `${MM_GREEN}99` }}>
                  Implementación · Pago único
                </span>
                <p className="font-poppins font-black text-white leading-none mb-2" style={{ fontSize: 'clamp(2.2rem,5vw,3rem)' }}>
                  USD <span style={{ color: MM_GREEN }}>400</span>
                </p>
                <p className="font-lato text-white/40 text-[14px] mb-4">Incluye todo el proceso de 4 semanas</p>
                <ul className="space-y-1.5">
                  {[
                    'Consultoría y diseño del flujo IA',
                    'Configuración de Sixteam Inbox + IA',
                    'Parametrización del Asistente IA',
                    'Conexión de todos los canales',
                    'Capacitación del equipo',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: MM_GREEN }} />
                      <span className="font-lato text-white/60 text-[14px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mensual plataforma */}
            <div className="rounded-2xl p-6 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg,rgba(0,191,165,.08) 0%,rgba(3,13,26,.9) 100%)', border: '1px solid rgba(0,191,165,.3)' }}>
              <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
                style={{ background: 'radial-gradient(circle,rgba(0,191,165,.08),transparent 70%)', transform: 'translate(20%,-20%)' }} />
              <div className="relative z-10">
                <span className="font-lato text-[12px] uppercase tracking-widest mb-3 block text-[#00bfa5]/70">
                  Plataforma · Mensual recurrente
                </span>
                <p className="font-poppins font-black text-white leading-none mb-2" style={{ fontSize: 'clamp(2.2rem,5vw,3rem)' }}>
                  USD <span className="text-[#00bfa5]">180</span>
                  <span className="font-lato font-normal text-white/40 text-[17px] ml-1">/mes</span>
                </p>
                <p className="font-lato text-white/40 text-[14px] mb-4">2 usuarios incluidos · Sixteam Inbox + IA</p>
                <ul className="space-y-1.5">
                  {[
                    'Bandeja omnicanal activa',
                    'IA conversacional operativa',
                    'Soporte de plataforma',
                    'Actualizaciones incluidas',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 flex-shrink-0 text-[#00bfa5]" />
                      <span className="font-lato text-white/60 text-[14px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Calculadora IA */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,.03)', border: `1px solid ${showCalc ? 'rgba(167,139,250,.3)' : 'rgba(255,255,255,.08)'}` }}>

            {/* Header + precio visible siempre */}
            <div className="flex items-center gap-3 p-5 sm:p-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(167,139,250,.15)' }}>
                <Bot className="w-4 h-4 text-[#a78bfa]" />
              </div>
              <div className="flex-1">
                <p className="font-poppins font-bold text-white/85 text-[17px]">Consumo de IA</p>
                <p className="font-lato text-white/35 text-[13px]">USD 0.02 por mensaje · pago mensual según uso real</p>
              </div>
              <div className="text-right hidden sm:block flex-shrink-0">
                <p className="font-poppins font-black text-[#a78bfa] text-[17px]">≈ USD {consumoIAUSD}<span className="font-lato font-normal text-white/30 text-[13px]">/mes</span></p>
                <p className="font-lato text-white/25 text-[12px]">Total c/plataforma: USD {totalMonthly}/mes</p>
              </div>
            </div>

            {/* Acordeón calculadora */}
            <div className="border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
              <button onClick={() => setShowCalc(!showCalc)}
                className="w-full flex items-center gap-2 px-5 py-3 text-left"
                style={{ background: showCalc ? 'rgba(167,139,250,.05)' : 'transparent' }}>
                <span className="font-lato text-[13px] flex-1" style={{ color: 'rgba(167,139,250,.6)' }}>
                  + Calcular consumo mensual estimado
                </span>
                <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-300"
                  style={{ color: 'rgba(167,139,250,.4)', transform: showCalc ? 'rotate(90deg)' : undefined }} />
              </button>

              {showCalc && (
                <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                  <div className="pt-4 space-y-4">
                    {/* Slider 1 */}
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="font-lato text-white/40 text-[13px]">Mensajes promedio por conversación</span>
                        <span className="font-poppins font-bold text-white text-[13px]">{mensajesConv}</span>
                      </div>
                      <input type="range" min={2} max={20} step={1}
                        value={mensajesConv}
                        onChange={e => setMensajesConv(Number(e.target.value))}
                        className="w-full" style={{ accentColor: '#a78bfa' }} />
                      <div className="flex justify-between mt-0.5">
                        <span className="font-lato text-white/20 text-[11px]">2 msg</span>
                        <span className="font-lato text-white/20 text-[11px]">20 msg</span>
                      </div>
                    </div>

                    {/* Slider 2 */}
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="font-lato text-white/40 text-[13px]">Conversaciones promedio por mes</span>
                        <span className="font-poppins font-bold text-white text-[13px]">{convsMes}</span>
                      </div>
                      <input type="range" min={50} max={1000} step={25}
                        value={convsMes}
                        onChange={e => setConvsMes(Number(e.target.value))}
                        className="w-full" style={{ accentColor: '#a78bfa' }} />
                      <div className="flex justify-between mt-0.5">
                        <span className="font-lato text-white/20 text-[11px]">50 conv.</span>
                        <span className="font-lato text-white/20 text-[11px]">1.000 conv.</span>
                      </div>
                    </div>

                    {/* Resultado */}
                    <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: 'rgba(167,139,250,.12)' }}>
                      <div>
                        <span className="font-lato text-white/40 text-[13px]">Consumo estimado de IA</span>
                        <p className="font-lato text-white/25 text-[11px] mt-0.5">
                          USD 0.02 × {mensajesConv} msg × {convsMes} conv.
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-poppins font-bold text-[15px] text-[#a78bfa]">≈ USD {consumoIAUSD}/mes</span>
                        <p className="font-lato text-white/25 text-[12px] mt-0.5">+ USD 180 plataforma = USD {totalMonthly}/mes</p>
                      </div>
                    </div>

                    <p className="font-lato text-white/25 text-[12px] leading-relaxed">
                      Estimación referencial. El consumo real varía según el volumen y la longitud de las conversaciones.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Soporte y Operaciones — opcional ── */}
          <div className="mt-6 rounded-xl overflow-hidden transition-all duration-300"
            style={{ background: 'rgba(255,255,255,.03)', border: showSoporte ? `1px solid ${MM_GREEN}55` : '1px solid rgba(255,255,255,.08)' }}>
            <button onClick={() => setShowSoporte(!showSoporte)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: showSoporte ? `${MM_GREEN}20` : 'rgba(255,255,255,.05)' }}>
                <GraduationCap className="w-4 h-4 transition-colors"
                  style={{ color: showSoporte ? MM_GREEN : 'rgba(255,255,255,.35)' }} />
              </div>
              <div className="flex-1 flex flex-wrap items-center gap-2">
                <span className={`font-poppins font-bold text-[16px] ${showSoporte ? 'text-white' : 'text-white/65'}`}>
                  Soporte y Operaciones
                </span>
                <span className="font-lato text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: `${MM_GREEN}15`, border: `1px solid ${MM_GREEN}30`, color: MM_GREEN }}>
                  Opcional · post-implementación
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="font-poppins font-black text-[15px]" style={{ color: MM_GREEN }}>
                    USD 150<span className="font-lato font-normal text-white/35 text-[12px]">/mes</span>
                  </p>
                  <p className="font-lato text-white/30 text-[11px]">5 horas · +USD 45/h adicional</p>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                  style={{ color: `${MM_GREEN}99`, transform: showSoporte ? 'rotate(90deg)' : undefined }} />
              </div>
            </button>
            {showSoporte && (
              <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                <div className="pt-4 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-poppins font-black text-[1.5rem]" style={{ color: MM_GREEN }}>
                      USD 150<span className="font-lato font-normal text-white/40 text-[1rem]">/mes · 5 horas</span>
                    </p>
                    <span className="font-lato text-[12px] px-2 py-0.5 rounded-full"
                      style={{ background: `${MM_GREEN}15`, border: `1px solid ${MM_GREEN}30`, color: MM_GREEN }}>
                      Horas no acumulables
                    </span>
                  </div>
                  <p className="font-lato text-white/45 text-[15px] leading-relaxed">
                    Acompañamiento mensual una vez activo el sistema. Cubre el levantamiento y ejecución de oportunidades de mejora, ajustes al Asistente IA, apoyo en la operación diaria de la plataforma y actividades de marketing como envíos de mensajes masivos, campañas en el inbox y seguimientos. Cada solicitud se registra con el tiempo invertido.
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Mejoras y reentrenamiento del Asistente IA con información nueva o actualizada',
                      'Ajustes de flujos, respuestas automáticas y configuraciones del inbox',
                      'Envíos de mensajes masivos a contactos (campañas de reactivación, promociones)',
                      'Apoyo en actividades de marketing: seguimientos, difusión de clases o eventos',
                      'Soporte funcional al equipo en el uso diario de la plataforma',
                      'Análisis de métricas de conversaciones y recomendaciones de mejora',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: MM_GREEN }} />
                        <span className="font-lato text-white/60 text-[15px] leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                  {/* Ejemplo de uso */}
                  <div className="rounded-xl overflow-hidden" style={{ border: 'rgba(255,255,255,.06) solid 1px' }}>
                    <div className="px-4 py-2.5 flex items-center justify-between"
                      style={{ background: 'rgba(255,255,255,.03)', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                      <span className="font-lato text-white/30 text-[12px] uppercase tracking-wider">Ejemplo de uso mensual · 5 h</span>
                    </div>
                    <div className="divide-y divide-white/[0.04]">
                      {[
                        { tarea: 'Actualización del Asistente IA con 2 clases nuevas y horarios cambiados', tiempo: '1.0 h' },
                        { tarea: 'Envío masivo de mensaje de promoción a 200 contactos del inbox',          tiempo: '0.5 h' },
                        { tarea: 'Ajuste del flujo de bienvenida y preguntas de filtrado',                  tiempo: '1.0 h' },
                        { tarea: 'Apoyo en seguimiento de leads que no cerraron inscripción',               tiempo: '1.0 h' },
                        { tarea: 'Análisis de métricas y recomendaciones del mes',                         tiempo: '0.5 h' },
                        { tarea: 'Soporte al equipo en uso del inbox y resolución de dudas',                tiempo: '1.0 h' },
                      ].map((r, i) => (
                        <div key={i} className="flex items-center justify-between gap-3 px-4 py-2.5">
                          <span className="font-lato text-white/50 text-[14px]">{r.tarea}</span>
                          <span className="font-lato text-white/30 text-[13px] flex-shrink-0 ml-4">{r.tiempo}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-white/20" />
                    <p className="font-lato text-white/30 text-[13px] leading-relaxed">
                      Las horas no utilizadas en el mes no se acumulan. Horas adicionales se cobran a USD 45/hora.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Administración de pauta digital — opcional ── */}
          <div className="mt-3 rounded-xl overflow-hidden transition-all duration-300"
            style={{ background: 'rgba(255,255,255,.03)', border: showPauta ? '1px solid rgba(251,191,36,.4)' : '1px solid rgba(255,255,255,.08)' }}>
            <button onClick={() => setShowPauta(!showPauta)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: showPauta ? 'rgba(251,191,36,.18)' : 'rgba(255,255,255,.05)' }}>
                <TrendingUp className="w-4 h-4 transition-colors"
                  style={{ color: showPauta ? '#f59e0b' : 'rgba(255,255,255,.35)' }} />
              </div>
              <div className="flex-1 flex flex-wrap items-center gap-2">
                <span className={`font-poppins font-bold text-[16px] ${showPauta ? 'text-white' : 'text-white/65'}`}>
                  Administración de Pauta Digital
                </span>
                <span className="font-lato text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(251,191,36,.12)', border: '1px solid rgba(251,191,36,.28)', color: '#f59e0b' }}>
                  Opcional
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="font-poppins font-black text-[15px] text-amber-400">
                    Desde USD 250<span className="font-lato font-normal text-white/35 text-[12px]">/mes</span>
                  </p>
                  <p className="font-lato text-white/30 text-[11px]">No incluye presupuesto de pauta</p>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                  style={{ color: 'rgba(251,191,36,.6)', transform: showPauta ? 'rotate(90deg)' : undefined }} />
              </div>
            </button>
            {showPauta && (
              <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                <div className="pt-4 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-poppins font-black text-[1.5rem] text-amber-400">
                      Desde USD 250<span className="font-lato font-normal text-white/40 text-[1rem]">/mes</span>
                    </p>
                    <span className="font-lato text-[12px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(251,191,36,.10)', border: '1px solid rgba(251,191,36,.25)', color: '#f59e0b' }}>
                      Presupuesto de pauta no incluido
                    </span>
                  </div>
                  <p className="font-lato text-white/45 text-[15px] leading-relaxed">
                    Gestión estratégica de campañas pagadas en Meta (Instagram y Facebook) para captar nuevos interesados en las clases de Motion Minds. Se diseña el embudo completo: desde el anuncio hasta la conversación con el Asistente IA, maximizando la conversión de cada peso invertido en pauta.
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Diseño y configuración de campañas en Meta Ads (Instagram + Facebook)',
                      'Segmentación del público objetivo según intereses, edad y ubicación en Guatemala',
                      'Creación de copies y estructura de anuncios orientados a captación de alumnos',
                      'Optimización semanal de campañas según rendimiento y métricas',
                      'Informe mensual con resultados: alcance, clics, leads generados y costo por lead',
                      'Coordinación con el Asistente IA para alinear el mensaje del anuncio con la atención automatizada',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
                        <span className="font-lato text-white/60 text-[15px] leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2 items-start">
                    <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-white/20" />
                    <p className="font-lato text-white/30 text-[13px] leading-relaxed">
                      El valor mensual cubre la gestión de las campañas. El presupuesto de pauta (lo que se invierte directamente en Meta Ads) es adicional y lo define el cliente según sus metas de captación.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ─ 05 VIGENCIA ─ */}
        <section id="vigencia" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y Términos</SectionTitle>
          <Rule />

          <div className="space-y-3">
            {[
              { icon: CheckCircle, titulo: 'Aprobación',             desc: 'Para aceptar esta propuesta y dar inicio al proyecto, se requiere confirmación vía WhatsApp, correo o verbal para habilitar el contrato a firmar.' },
              { icon: FileText,    titulo: 'Términos de pago',       desc: '50% al firmar el contrato · 50% al finalizar la puesta en marcha (semana 4). Los pagos en USD mediante transferencia bancaria o plataforma acordada.' },
              { icon: Zap,         titulo: 'Inicio del proyecto',    desc: 'El cronograma inicia desde la recepción del primer pago y la entrega de accesos a los canales digitales de Motion Minds.' },
              { icon: Settings,    titulo: 'Modificaciones al alcance', desc: 'Cualquier funcionalidad no estipulada explícitamente requerirá cotización adicional y podrá afectar los tiempos de entrega.' },
              { icon: Clock,       titulo: 'Vigencia de la propuesta', desc: 'Esta propuesta tiene vigencia de 30 días calendario desde su emisión. Pasado ese plazo, los valores podrán ser revisados.' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="rounded-xl p-4 sm:p-5 flex gap-4"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: MM_GREEN }} />
                  <div>
                    <p className="font-poppins font-semibold text-white/80 text-[17px] mb-1">{item.titulo}</p>
                    <p className="font-lato text-white/50 text-[16px] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-12 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 100%,${MM_GREEN}08,transparent 70%)` }} />
            <div className="relative z-10">
              <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-10 w-auto object-contain mx-auto mb-3"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <p className="font-poppins font-black text-white text-[20px] tracking-tight mb-1">
                Sixteam<span style={{ color: MM_GREEN }}>.</span>pro
              </p>
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

export default MotionMindsProposal;
