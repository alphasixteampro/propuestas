import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, AlertCircle,
  Calendar, Info, MapPin, MessageSquare, Bot, Inbox, Database,
  Coins, Headphones, Gift, Building2, LayoutDashboard, Users,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente:    'Global Realty',
  tagline:    'Bienes raíces · Panamá',
  sector:     'Inmobiliaria · Compra, venta y alquiler de propiedades',
  sede:       'Panamá',
  fecha:      'Agosto 2026',
  contacto:   'Snehal Panchal',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit:        '901.967.849-4',
  correo:     'alpha@sixteam.pro',
  rl:         'Samuel Armando Burgos Ferrer',
  objetivo:
    'Implementar el ecosistema Sixteam.pro —CRM, ChatCenter y Asistente de IA— respaldado por un equipo de tecnología especializado en bienes raíces, para que cada lead quede registrado, filtrado y agendado automáticamente.',
};

const GR = '#e0973c';
const GR_BG = 'rgba(224,151,60,.07)';
const GR_BORDER = 'rgba(224,151,60,.25)';

const PLATAFORMA_USD = '250';
const OPS_USD = '350';
const IMPLEMENTACION_USD = '700';
const CREDITOS_MES = 60;
const SOLICITUDES_MES = 5;

// ─── DIAGNÓSTICO ─────────────────────────────────────────────────────────────

const HALLAZGOS = [
  {
    titulo: 'Los leads no quedan en ningún sistema',
    desc: 'Los contactos llegan por WhatsApp y por dos o tres plataformas de generación de leads, pero no hay un CRM que los centralice: la información vive en el teléfono y se pierde cuando la conversación se cierra.',
    icon: Database, tint: 'gold',
  },
  {
    titulo: 'Sin filtro entre curiosos e interesados reales',
    desc: 'De 100 personas que escriben, cerca de 50 solo preguntan por precio, 30 muestran un interés real y apenas 10 terminan agendando una visita. Hoy ese filtro depende de leer y responder cada mensaje a mano.',
    icon: MessageSquare, tint: 'red',
  },
  {
    titulo: 'Un mensaje respondido tarde es una oportunidad perdida',
    desc: 'Instagram y Facebook todavía no están conectados ni automatizados, así que la velocidad de respuesta depende de la disponibilidad de una sola persona en cada canal.',
    icon: Clock, tint: 'amber',
  },
  {
    titulo: 'Sin control centralizado de disponibilidad',
    desc: 'Cuando una propiedad se alquila o se vende, no existe un solo lugar para actualizarlo: el riesgo es seguir ofreciendo un inmueble que ya no está disponible.',
    icon: AlertCircle, tint: 'blue',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  gold:  { text: 'text-[#e0973c]', bg: 'rgba(224,151,60,.07)', border: 'rgba(224,151,60,.2)' },
  teal:  { text: 'text-[#00bfa5]', bg: 'rgba(0,191,165,.07)',  border: 'rgba(0,191,165,.18)' },
  blue:  { text: 'text-[#60a5fa]', bg: 'rgba(96,165,250,.07)', border: 'rgba(96,165,250,.18)' },
  amber: { text: 'text-amber-400', bg: 'rgba(251,191,36,.07)', border: 'rgba(251,191,36,.18)' },
  red:   { text: 'text-[#f87171]', bg: 'rgba(221,51,51,.07)',  border: 'rgba(221,51,51,.2)' },
};

// ─── SISTEMA ─────────────────────────────────────────────────────────────────

const COMPONENTES = [
  {
    num: '01',
    nombre: 'CRM y base de datos de contactos',
    subtitulo: 'Contactos · pipeline · agendamiento',
    icon: Database,
    tint: 'gold',
    items: [
      'Base de datos central de contactos con el historial completo de cada lead',
      'Campos personalizados: tipo de propiedad, zona, presupuesto e interés (compra o alquiler)',
      'Módulo de oportunidades con el pipeline de ventas: nuevo lead → interesado → llamada agendada → visita agendada → visita realizada → cerrado o perdido',
      'Agendamiento de citas integrado al calendario de cada asesor',
      'Panel de informes y KPIs sobre el estado de cada oportunidad',
    ],
  },
  {
    num: '02',
    nombre: 'ChatCenter conectado a WhatsApp',
    subtitulo: 'Bandeja única · historial · control operativo',
    icon: Inbox,
    tint: 'teal',
    items: [
      'Bandeja unificada de WhatsApp, ampliable a Instagram, Facebook y página web',
      'Historial completo y trazable de cada conversación',
      'Notas internas y transferencia de la conversación a un asesor humano',
      'Visibilidad de tiempos de respuesta y volumen de conversaciones',
    ],
  },
  {
    num: '03',
    nombre: 'Asistente de IA',
    subtitulo: 'Atiende · filtra · agenda',
    icon: Bot,
    tint: 'blue',
    items: [
      'Responde en segundos, 24/7, sin esperar aprobación humana',
      'Filtra y califica cada lead: distingue interés real de una simple consulta de precio',
      'Se entrena con la base de proyectos y propiedades, y se actualiza cuando algo se vende o se alquila',
      'Agenda la cita automáticamente según la disponibilidad de los asesores',
      'Entrega la conversación con el contexto completo cuando se necesita un asesor humano',
    ],
  },
];

const TERMINOS = [
  {
    titulo: 'Aprobación',
    desc: 'Se acepta por WhatsApp, correo o firma digital. Con eso se habilita el contrato y se agenda el inicio.',
    icon: CheckCircle,
  },
  {
    titulo: 'Duración mínima de contrato',
    desc: `La duración mínima de contrato es de 3 meses, tanto en la Plataforma Sixteam como en Sixteam Ops · Plan Esencial. Si no se cumple este mínimo, se cobra por aparte el valor de implementación de USD ${IMPLEMENTACION_USD} para iniciar el servicio.`,
    icon: Clock,
  },
  {
    titulo: 'Oferta de implementación sin costo',
    desc: `Por tiempo limitado, la implementación (USD ${IMPLEMENTACION_USD}, pago único) queda sin costo al contratar Sixteam por un mínimo de 3 meses. Fuera de esta condición, la implementación se cobra por aparte antes de iniciar.`,
    icon: Gift,
  },
  {
    titulo: 'Términos de pago',
    desc: 'Los planes mensuales se facturan por adelantado, desde la fecha de inicio del servicio.',
    icon: FileText,
  },
  {
    titulo: 'Créditos del Plan Esencial',
    desc: `Sixteam Ops incluye ${CREDITOS_MES} créditos por mes, equivalentes en promedio a ${SOLICITUDES_MES} solicitudes. No son acumulables al mes siguiente. Cada solicitud se cotiza en créditos antes de ejecutarse.`,
    icon: Coins,
  },
  {
    titulo: 'Soporte de la Plataforma Sixteam',
    desc: 'En el plan de Plataforma Sixteam, el soporte cubre solo inconvenientes de la plataforma. La implementación, el entrenamiento del asistente, la personalización, los informes o cualquier otra solicitud se cotizan por aparte.',
    icon: Headphones,
  },
  {
    titulo: 'Canales y números de WhatsApp',
    desc: 'El plan contempla 1 número de WhatsApp Business conectado. La conexión de Instagram, Facebook, página web u otros canales se realiza dentro de Sixteam Ops. Números o canales adicionales se cotizan según la necesidad.',
    icon: Users,
  },
  {
    titulo: 'Consumo de IA',
    desc: 'USD 0,02 por mensaje procesado por el asistente, facturado mes vencido sobre el consumo real. La calculadora de esta propuesta es una estimación referencial.',
    icon: Bot,
  },
  {
    titulo: 'Plantillas de WhatsApp',
    desc: 'Los mensajes enviados fuera de la ventana de 24 horas los cobra Meta directamente y se trasladan sin margen adicional.',
    icon: MessageSquare,
  },
  {
    titulo: 'Cambios al alcance',
    desc: 'Cualquier servicio, integración o funcionalidad no incluida en esta propuesta requiere cotización adicional y puede afectar los tiempos de entrega.',
    icon: AlertCircle,
  },
  {
    titulo: 'Vigencia de la propuesta',
    desc: `30 días calendario desde ${META.fecha}. Pasado ese plazo los valores pueden revisarse.`,
    icon: Calendar,
  },
];

const SECCIONES = [
  { id: 'resumen',  label: 'Resumen' },
  { id: 'objetivo', label: 'Objetivo' },
  { id: 'sistema',  label: 'Sistema' },
  { id: 'planes',   label: 'Planes' },
  { id: 'terminos', label: 'Términos' },
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

// Logo del cliente con respaldo tipográfico si el archivo aún no existe
const ClientLogo = ({ className = '', textSize = '18px' }: { className?: string; textSize?: string }) => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="font-poppins font-black tracking-tight leading-none text-center"
          style={{ color: GR, fontSize: textSize }}>
          GLOBAL<br /><span className="text-white/50">REALTY</span>
        </span>
      </div>
    );
  }
  return (
    <img src="/global-realty-logo.png" alt="Global Realty"
      className={`object-contain ${className}`}
      onError={() => setFailed(true)} />
  );
};

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const GlobalRealtyProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [compActivo, setCompActivo] = useState<number | null>(null);
  const [openTerms, setOpenTerms] = useState<Set<number>>(new Set());
  const [showCostosVariables, setShowCostosVariables] = useState(false);
  const [showComoUsar, setShowComoUsar] = useState(false);
  const [showMetaTable, setShowMetaTable] = useState(false);
  const [showCalcIA, setShowCalcIA] = useState(false);
  const [mensajesConv, setMensajesConv] = useState(6);
  const [convsMes, setConvsMes] = useState(400);

  const consumoIAUSD = (0.02 * mensajesConv * convsMes).toFixed(2);

  const toggleTerm = (i: number) => setOpenTerms(prev => {
    const next = new Set(prev);
    if (next.has(i)) next.delete(i); else next.add(i);
    return next;
  });

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

  const s1 = useVisible(); const s2 = useVisible(); const s3 = useVisible(); const s4 = useVisible(); const s5 = useVisible();

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
            style={{ background: 'radial-gradient(circle, rgba(224,151,60,.07) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(29,112,162,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        </div>

        {/* Topbar */}
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
            <ClientLogo className="h-9 w-auto" textSize="13px" />
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

        {/* Hero */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta de trabajo y cotización · {META.fecha}</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${GR}, #1d70a2)` }}>
                  <Building2 className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: GR_BG, border: `1px solid ${GR_BORDER}`, color: GR }}>
                  {META.tagline}
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}>
                Propuesta<br />
                <span style={{ background: `linear-gradient(90deg,${GR},#00bfa5)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Comercial
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
                  { icon: MapPin,   text: META.sede },
                  { icon: MessageSquare, text: 'WhatsApp + redes' },
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
                  {['1. Resumen ejecutivo','2. Objetivo','3. Sistema propuesto','4. Planes y precios','5. Términos y condiciones'].map((item, i) => (
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
                  style={{ background: `radial-gradient(circle, rgba(224,151,60,.12) 0%, rgba(29,112,162,.05) 50%, transparent 70%)` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full" style={{ border: `1px solid rgba(224,151,60,.14)` }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(29,112,162,.15)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: GR, boxShadow: `0 0 6px rgba(224,151,60,.8)` }} />
                </div>
              </div>
              <div className="cover-float relative z-10 flex flex-col items-center gap-6 w-full px-6">
                <div className="flex flex-col items-center gap-1">
                  <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-16 w-auto object-contain"
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
                  <div className="w-48 h-28 flex items-center justify-center p-3 rounded-xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)' }}>
                    <ClientLogo className="w-full h-full" textSize="26px" />
                  </div>
                  <div className="text-center">
                    <span className="font-poppins font-black text-white text-[24px] tracking-tight">{META.cliente}</span>
                    <p className="font-lato text-[13px] uppercase tracking-[0.18em] mt-1" style={{ color: GR }}>{META.tagline}</p>
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

          {/* Ficha del cliente */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center"
            style={{ background: 'rgba(2,8,20,.85)', border: `1px solid ${GR_BORDER}` }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-28 h-20 flex items-center justify-center p-2 rounded-xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)' }}>
                <ClientLogo className="w-full h-full" textSize="15px" />
              </div>
              <span className="font-poppins font-black text-white text-[14px] tracking-tight">{META.cliente}</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Sector', value: 'Inmobiliaria' },
                { label: 'Contacto', value: META.contacto },
                { label: 'Canal principal', value: 'WhatsApp' },
                { label: 'Otros canales', value: 'Instagram y Facebook (sin automatizar)' },
                { label: 'CRM actual', value: 'Ninguno' },
                { label: 'Ubicación', value: META.sede },
              ].map((f, i) => (
                <div key={i}>
                  <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">{f.label}</p>
                  <p className="font-lato text-white/65 text-[15px]">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              Global Realty recibe leads a través de <strong className="text-white/90 font-semibold">WhatsApp y de dos a tres plataformas</strong> de generación de contactos, pero no cuenta con un CRM que centralice la información: cada conversación vive en el teléfono y depende de que alguien la responda a tiempo.
            </p>
            <p>
              Esta propuesta implementa el ecosistema <strong className="text-white/90 font-semibold">Sixteam.pro</strong>: CRM con base de datos de contactos, ChatCenter conectado a WhatsApp y un Asistente de IA que responde en segundos, filtra el interés real y agenda la cita, respaldado por un equipo de tecnología especializado en bienes raíces que ejecuta mejoras mes a mes.
            </p>
          </div>

          {/* Hallazgos */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> 4 frenos identificados
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HALLAZGOS.map((h, i) => {
                const Icon = h.icon; const t = TINT[h.tint];
                return (
                  <div key={i} className="rounded-xl p-4 flex gap-3" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                    <Icon className={`w-4 h-4 ${t.text} flex-shrink-0 mt-0.5`} />
                    <div>
                      <p className="font-poppins font-semibold text-white/90 text-[16px] mb-1">{h.titulo}</p>
                      <p className="font-lato text-white/50 text-[14px] leading-relaxed">{h.desc}</p>
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
          <TagLabel>02 — Objetivo</TagLabel>
          <SectionTitle>¿Para qué estamos aquí?</SectionTitle>
          <Rule />
          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: `radial-gradient(circle, rgba(224,151,60,.08), transparent 70%)`, transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 text-[#00bfa5] mb-4" />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[22px] leading-relaxed">
              Que cada lead quede <strong className="text-white font-black">registrado, filtrado y agendado</strong> automáticamente, y que Snehal pueda ver en un solo lugar cómo avanza cada oportunidad, respaldada por un equipo de tecnología especializado en bienes raíces.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Componentes', value: '3', sub: 'CRM · ChatCenter · IA' },
              { label: 'Canales', value: '1+', sub: 'WhatsApp desde el día 1' },
              { label: 'Respuesta', value: 'Seg.', sub: 'Sin espera humana' },
              { label: 'Filtro de leads', value: '100%', sub: 'Automático con IA' },
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

        {/* ─ 03 SISTEMA ─ */}
        <section id="sistema" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — Sistema propuesto</TagLabel>
          <SectionTitle>3 componentes · 1 plataforma</SectionTitle>
          <Rule />

          <div className="space-y-3">
            {COMPONENTES.map((c, i) => {
              const Icon = c.icon;
              const t = TINT[c.tint];
              const open = compActivo === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${t.border}` : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setCompActivo(open ? null : i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? t.bg : 'rgba(255,255,255,.05)' }}>
                      <Icon className={`w-5 h-5 transition-colors ${open ? t.text : 'text-white/40'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`font-lato text-[12px] uppercase tracking-widest ${t.text}`} style={{ opacity: 0.9 }}>{c.num}</span>
                      <p className={`font-poppins font-bold text-[19px] mt-0.5 ${open ? 'text-white' : 'text-white/70'}`}>{c.nombre}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <p className="font-lato text-white/30 text-[12px] hidden sm:block">{c.subtitulo}</p>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-90' : ''} ${open ? t.text : 'text-white/30'}`} />
                    </div>
                  </button>

                  {open && (
                    <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <ul className="pt-4 space-y-2">
                        {c.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2.5">
                            <CheckCircle className={`w-3.5 h-3.5 ${t.text} flex-shrink-0 mt-1`} />
                            <span className="font-lato text-white/65 text-[15px] leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ─ 04 PLANES ─ */}
        <section id="planes" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Planes y precios</TagLabel>
          <SectionTitle>Dos formas de trabajar con Sixteam</SectionTitle>
          <Rule />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

            {/* Plan A — Plataforma */}
            <div className="rounded-2xl p-5 sm:p-6 flex flex-col" style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.1)' }}>
              <span className="font-lato text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 inline-block text-white/40">Opción 1</span>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)' }}>
                  <LayoutDashboard className="w-5 h-5 text-white/60" />
                </div>
                <div className="flex-1">
                  <p className="font-poppins font-bold text-white text-[18px]">Plataforma Sixteam</p>
                  <p className="font-lato text-white/40 text-[13px] mt-0.5">Sistema para ventas, marketing y servicio</p>
                </div>
              </div>
              <p className="font-poppins font-black text-[2rem] leading-none text-white mb-5">
                USD {PLATAFORMA_USD}<span className="font-lato font-normal text-white/35 text-[0.9rem]">/mes</span>
              </p>
              <ul className="space-y-2 mb-5 flex-1">
                {[
                  'Agente de IA activo para calificar y responder leads',
                  'ChatCenter conectado a WhatsApp',
                  'Agendamiento de citas',
                  'Base de datos de contactos',
                  'Módulo de oportunidades para gestión de leads',
                  'Y muchas funciones más de la plataforma',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-white/50 flex-shrink-0 mt-1" />
                    <span className="font-lato text-white/60 text-[14px]">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="font-lato text-white/30 text-[12.5px] leading-relaxed pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,.07)' }}>
                Soporte del equipo Sixteam solo para inconvenientes de la plataforma. Cualquier solicitud fuera de esto se cotiza por aparte.
              </p>
            </div>

            {/* Plan B — Sixteam Ops */}
            <div className="rounded-2xl p-5 sm:p-6 flex flex-col relative overflow-hidden" style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.28)' }}>
              <span className="absolute top-0 right-0 font-lato text-[11px] uppercase tracking-wider px-3 py-1 rounded-bl-lg"
                style={{ background: 'rgba(0,191,165,.18)', color: '#00bfa5' }}>
                Incluye la plataforma
              </span>
              <span className="font-lato text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 inline-block text-[#00bfa5]/70">Opción 2</span>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(0,191,165,.15)', border: '1px solid rgba(0,191,165,.3)' }}>
                  <Headphones className="w-5 h-5 text-[#00bfa5]" />
                </div>
                <div className="flex-1">
                  <p className="font-poppins font-bold text-white text-[18px]">Sixteam Ops · Plan Esencial</p>
                  <p className="font-lato text-white/40 text-[13px] mt-0.5">Equipo de tecnología + plataforma incluida</p>
                </div>
              </div>
              <p className="font-poppins font-black text-[2rem] leading-none text-[#00bfa5] mb-3">
                USD {OPS_USD}<span className="font-lato font-normal text-white/35 text-[0.9rem]">/mes</span>
              </p>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-5" style={{ background: 'rgba(0,191,165,.08)', border: '1px solid rgba(0,191,165,.2)' }}>
                <Coins className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0" />
                <span className="font-lato text-white/65 text-[13.5px]">{CREDITOS_MES} créditos ≈ hasta {SOLICITUDES_MES} solicitudes al mes</span>
              </div>
              <ul className="space-y-2 mb-5 flex-1">
                {[
                  'Construcción del Asistente de IA con el contexto de tus proyectos inmobiliarios',
                  'Agendamiento automático de citas según el calendario de cada asesor',
                  'Implementación del CRM con las etapas clave del pipeline de ventas',
                  'Conexión del ChatCenter a WhatsApp, Instagram, página web y plataformas de venta de inmuebles',
                  'Construcción del panel de informes y KPIs para el control de ventas y oportunidades',
                  'Mejora continua del Asistente de IA',
                  'Recomendaciones de marketing y ventas que están funcionando en el sector inmobiliario',
                  'Esto y muchas soluciones más, con todo el equipo de tecnología de Sixteam',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0 mt-1" />
                    <span className="font-lato text-white/65 text-[14px]">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="font-lato text-[#00bfa5]/70 text-[12.5px] leading-relaxed pt-4 border-t" style={{ borderColor: 'rgba(0,191,165,.15)' }}>
                Con este paquete, la Plataforma Sixteam viene incluida sin costo adicional.
              </p>
            </div>
          </div>

          {/* Oferta irresistible — discreta */}
          <div className="rounded-xl px-4 py-3 flex items-center gap-3 mb-6"
            style={{ background: GR_BG, border: `1px solid ${GR_BORDER}` }}>
            <Gift className="w-4 h-4 flex-shrink-0" style={{ color: GR }} />
            <p className="font-lato text-white/55 text-[13.5px] leading-relaxed">
              <strong className="text-white/80 font-semibold">Oferta por tiempo limitado:</strong> contratando Sixteam por un mínimo de 3 meses, hoy la implementación queda <strong style={{ color: GR }}>sin costo</strong> (valor USD {IMPLEMENTACION_USD}, pago único).
            </p>
          </div>

          {/* ── CÓMO SE USAN LOS CRÉDITOS DE SIXTEAM OPS ── */}
          <div className="rounded-xl overflow-hidden transition-all duration-300 mb-4"
            style={{ background: 'rgba(255,255,255,.03)', border: showComoUsar ? '1px solid rgba(0,191,165,.35)' : '1px solid rgba(255,255,255,.08)' }}>
            <button onClick={() => setShowComoUsar(v => !v)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: showComoUsar ? 'rgba(0,191,165,.15)' : 'rgba(255,255,255,.05)' }}>
                <Coins className="w-4 h-4" style={{ color: showComoUsar ? '#00bfa5' : 'rgba(255,255,255,.35)' }} />
              </div>
              <div className="flex-1">
                <p className={`font-poppins font-bold text-[16px] ${showComoUsar ? 'text-white' : 'text-white/65'}`}>
                  Cómo se consumen los créditos de Sixteam Ops
                </p>
                <p className="font-lato text-white/35 text-[13px] mt-0.5">Proceso de solicitud · ejemplo · qué se puede pedir</p>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                style={{ color: showComoUsar ? '#00bfa5' : 'rgba(255,255,255,.3)', transform: showComoUsar ? 'rotate(90deg)' : undefined }} />
            </button>

            {showComoUsar && (
              <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                <div className="pt-4 space-y-5">

                  {/* Flujo de la solicitud */}
                  <div>
                    <p className="font-lato text-white/55 text-[15px] leading-relaxed mb-3">
                      Cada mes, Global Realty puede pedirle al equipo de Sixteam ajustes y mejoras sobre la plataforma. Cada solicitud se cotiza en créditos antes de ejecutarse, así siempre se sabe cuánto consume y en cuánto tiempo queda lista.
                    </p>
                    <div className="rounded-xl p-4 flex flex-col gap-2.5" style={{ background: 'rgba(2,8,20,.6)', border: '1px solid rgba(255,255,255,.06)' }}>
                      {[
                        { step: '01', text: 'Snehal o un asesor envía la solicitud describiendo qué necesita, por ejemplo un recordatorio automático o un nuevo campo del CRM.' },
                        { step: '02', text: 'Sixteam responde con la cotización: cuántos créditos consume y en cuánto tiempo queda lista.' },
                        { step: '03', text: 'Global Realty aprueba y Sixteam ejecuta. Los créditos se descuentan del saldo del mes.' },
                        { step: '04', text: 'Al cierre del mes queda el detalle de qué se atendió y cuántos créditos quedaron disponibles.' },
                      ].map((s) => (
                        <div key={s.step} className="flex items-start gap-3">
                          <span className="font-poppins font-black text-[11px] px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                            style={{ background: 'rgba(0,191,165,.15)', color: '#00bfa5' }}>{s.step}</span>
                          <p className="font-lato text-white/55 text-[14px] leading-relaxed">{s.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ejemplo de solicitud y respuesta */}
                  <div>
                    <p className="font-poppins font-semibold text-white/70 text-[13px] uppercase tracking-wider mb-2.5">Ejemplo de solicitud</p>
                    <div className="space-y-2.5">
                      <div className="rounded-lg p-3 flex gap-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                        <span className="font-poppins font-black text-[11px] px-2 py-0.5 rounded flex-shrink-0 h-fit mt-0.5"
                          style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.5)' }}>Global Realty</span>
                        <p className="font-lato text-white/55 text-[14px] leading-relaxed italic">
                          "Queremos que el asistente pregunte si el interesado busca comprar o alquilar, y que ese dato quede guardado automáticamente en el contacto."
                        </p>
                      </div>
                      <div className="rounded-lg p-3 flex gap-3" style={{ background: GR_BG, border: `1px solid ${GR_BORDER}` }}>
                        <span className="font-poppins font-black text-[11px] px-2 py-0.5 rounded flex-shrink-0 h-fit mt-0.5"
                          style={{ background: 'rgba(224,151,60,.22)', color: GR }}>Sixteam</span>
                        <p className="font-lato text-white/55 text-[14px] leading-relaxed italic">
                          "Recibido. Incluye el campo personalizado de tipo de operación, el ajuste del guion del asistente y el guardado automático en el lead. Queda como <strong className="text-white/75 not-italic">solicitud simple, 6 créditos</strong>, lista en 2 días hábiles. Quedarían 54 créditos disponibles este mes. ¿Aprobamos?"
                        </p>
                      </div>
                      <div className="rounded-lg p-3 flex gap-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                        <span className="font-poppins font-black text-[11px] px-2 py-0.5 rounded flex-shrink-0 h-fit mt-0.5"
                          style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.5)' }}>Global Realty</span>
                        <p className="font-lato text-white/55 text-[14px] leading-relaxed italic">"Aprobado."</p>
                      </div>
                    </div>
                  </div>

                  {/* Posibles solicitudes */}
                  <div>
                    <p className="font-poppins font-semibold text-white/70 text-[13px] uppercase tracking-wider mb-2.5">Algunas solicitudes que se podrían hacer</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        'Campo nuevo para registrar tipo de propiedad, zona o presupuesto',
                        'Conexión de un canal adicional: Instagram, Facebook o página web',
                        'Recordatorio automático cuando un lead lleva más de 24 horas sin respuesta',
                        'Reentrenamiento del asistente al incorporar nuevos proyectos o propiedades',
                        'Plantilla de WhatsApp para reactivar leads que no cerraron',
                        'Ajuste o nueva etapa en el pipeline de ventas',
                        'Panel de informes con el estado de cada oportunidad por asesor',
                        'Recomendación de campaña o estrategia de marketing inmobiliario',
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2 rounded-lg p-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                          <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                          <span className="font-lato text-white/55 text-[13.5px] leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* ── COSTOS ADICIONALES ── */}
          <div className="rounded-xl overflow-hidden transition-all duration-300"
            style={{ background: 'rgba(255,255,255,.03)', border: showCostosVariables ? '1px solid rgba(96,165,250,.35)' : '1px solid rgba(255,255,255,.08)' }}>
            <button onClick={() => setShowCostosVariables(v => !v)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: showCostosVariables ? 'rgba(96,165,250,.15)' : 'rgba(255,255,255,.05)' }}>
                <Info className="w-4 h-4" style={{ color: showCostosVariables ? '#60a5fa' : 'rgba(255,255,255,.35)' }} />
              </div>
              <div className="flex-1">
                <p className={`font-poppins font-bold text-[16px] ${showCostosVariables ? 'text-white' : 'text-white/65'}`}>
                  Costos adicionales según consumo
                </p>
                <p className="font-lato text-white/35 text-[13px] mt-0.5">Plantillas de WhatsApp (Meta) · Consumo de IA</p>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                style={{ color: showCostosVariables ? '#60a5fa' : 'rgba(255,255,255,.3)', transform: showCostosVariables ? 'rotate(90deg)' : undefined }} />
            </button>

            {showCostosVariables && (
              <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                <div className="pt-4 space-y-5">

                  {/* ── Plantillas Meta ── */}
                  <div>
                    <p className="font-lato text-white/55 text-[15px] leading-relaxed mb-3">
                      <strong className="text-white/80">Plantillas de WhatsApp (Meta).</strong> Cada mensaje enviado fuera de la ventana de 24 horas —recordatorios, campañas, seguimientos— lo cobra Meta directamente.{' '}
                      <strong className="text-white/80">No es un cobro de Sixteam.pro.</strong> Panamá se clasifica bajo la categoría "Rest of Latin America" en la tarifa de Meta.
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{ background: GR_BG, border: `1px solid ${GR_BORDER}` }}>
                        <span className="font-poppins font-semibold text-white/90 text-[13px]">🌎 Rest of Latin America</span>
                        <span className="font-lato text-white/45 text-[12px]">Marketing</span>
                        <span className="font-poppins font-bold text-[13px]" style={{ color: GR }}>USD 0.0777</span>
                        <span className="font-lato text-white/30 text-[11px]">|</span>
                        <span className="font-lato text-white/45 text-[12px]">Utility</span>
                        <span className="font-poppins font-bold text-[13px]" style={{ color: GR }}>USD 0.0119</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                        <span className="font-lato text-white/40 text-[12px]">Service (entrante)</span>
                        <span className="font-poppins font-bold text-[#00bfa5] text-[13px]">GRATIS</span>
                      </div>
                    </div>

                    <button onClick={() => setShowMetaTable(v => !v)}
                      className="flex items-center gap-1.5 mb-2 transition-colors duration-200"
                      style={{ color: showMetaTable ? '#60a5fa' : 'rgba(255,255,255,.3)' }}>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${showMetaTable ? 'rotate-90' : ''}`} />
                      <span className="font-lato text-[13px]">{showMetaTable ? 'Ocultar' : 'Ver'} tarifas por país — fuente Meta</span>
                    </button>

                    {showMetaTable && (
                      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(96,165,250,.2)' }}>
                        <div className="grid grid-cols-4 px-3 py-2 text-[11px] font-poppins font-semibold uppercase tracking-wider text-white/30"
                          style={{ background: 'rgba(96,165,250,.06)', borderBottom: '1px solid rgba(96,165,250,.15)' }}>
                          <span>País / Mercado</span>
                          <span className="text-right">Marketing</span>
                          <span className="text-right">Utility</span>
                          <span className="text-right">Service</span>
                        </div>
                        <div className="divide-y max-h-72 overflow-y-auto" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
                          {[
                            ['🇨🇴 Colombia','0.0131','0.0008'],['🇲🇽 Mexico','0.0320','0.0089'],['🇵🇪 Peru','0.0738','0.0210'],
                            ['🇨🇱 Chile','0.0933','0.0210'],['🇦🇷 Argentina','0.0649','0.0273'],['🇧🇷 Brazil','0.0656','0.0071'],
                            ['🇪🇸 Spain','0.0646','0.0210'],['🇺🇸 North America','0.0263','0.0036'],['🇬🇧 United Kingdom','0.0555','0.0231'],
                            ['🇫🇷 France','0.0902','0.0315'],['🇩🇪 Germany','0.1433','0.0578'],['🇮🇹 Italy','0.0726','0.0315'],
                            ['🇳🇱 Netherlands','0.1677','0.0525'],['🇮🇳 India','0.0124','0.0015'],['🇮🇩 Indonesia','0.0432','0.0263'],
                            ['🇹🇷 Turkey','0.0114','0.0056'],['🇷🇺 Russia','0.0842','0.0420'],['🇸🇦 Saudi Arabia','0.0478','0.0112'],
                            ['🇦🇪 United Arab Emirates','0.0524','0.0165'],['🇿🇦 South Africa','0.0398','0.0080'],['🇳🇬 Nigeria','0.0542','0.0070'],
                            ['🌎 Rest of Latin America','0.0777','0.0119'],['🌏 Rest of Asia Pacific','0.0769','0.0119'],
                            ['🌍 Rest of Western Europe','0.0622','0.0180'],['🌍 Rest of C. & E. Europe','0.0903','0.0223'],
                            ['🌍 Rest of Middle East','0.0358','0.0096'],['🌍 Rest of Africa','0.0236','0.0042'],['🌐 Other','0.0634','0.0081'],
                          ].map(([market, marketing, utility], i) => {
                            const isPanama = market.includes('Rest of Latin America');
                            return (
                              <div key={i} className="grid grid-cols-4 px-3 py-2 items-center"
                                style={{ background: isPanama ? GR_BG : i % 2 === 0 ? 'rgba(255,255,255,.015)' : 'transparent' }}>
                                <span className={`font-lato text-[13px] ${isPanama ? 'text-white/90 font-semibold' : 'text-white/60'}`}>{market}</span>
                                <span className="font-poppins font-semibold text-[13px] text-right"
                                  style={{ color: isPanama ? GR : 'rgba(255,255,255,.55)' }}>{marketing}</span>
                                <span className="font-poppins font-semibold text-[13px] text-right"
                                  style={{ color: isPanama ? GR : 'rgba(255,255,255,.55)' }}>{utility}</span>
                                <span className="font-poppins font-bold text-[12px] text-right text-[#00bfa5]">FREE</span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="px-3 py-2 text-[11px] font-lato text-white/25 text-center"
                          style={{ borderTop: '1px solid rgba(96,165,250,.1)', background: 'rgba(96,165,250,.03)' }}>
                          Fuente: Meta for Developers — WhatsApp Business Platform Pricing · Valores en USD por número destinatario
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Consumo IA ── */}
                  <div>
                    <p className="font-lato text-white/55 text-[15px] leading-relaxed mb-3">
                      <strong className="text-white/80">Consumo de IA.</strong> Se cobra por mensaje procesado por el asistente y se factura mes vencido sobre el consumo real.
                    </p>

                    <div className="rounded-xl overflow-hidden transition-all duration-300"
                      style={{ border: showCalcIA ? `1px solid ${GR_BORDER}` : '1px solid rgba(255,255,255,.07)' }}>
                      <button onClick={() => setShowCalcIA(v => !v)}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-left"
                        style={{ background: showCalcIA ? GR_BG : 'transparent' }}>
                        <Bot className="w-3.5 h-3.5 flex-shrink-0" style={{ color: GR }} />
                        <span className="font-lato text-[14px] flex-1" style={{ color: showCalcIA ? GR : 'rgba(255,255,255,.5)' }}>
                          Calculadora de consumo de IA
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 flex-shrink-0"
                          style={{ color: GR, transform: showCalcIA ? 'rotate(90deg)' : undefined }} />
                      </button>

                      {showCalcIA && (
                        <div className="px-4 pb-4 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                          <div className="pt-3 space-y-3">
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                              style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: GR }} />
                              <span className="font-lato text-white/50 text-[13px]">Valor IA por mensaje</span>
                              <span className="font-poppins font-black ml-auto text-[13px]" style={{ color: GR }}>USD 0.02</span>
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="font-lato text-white/35 text-[12px]">Mensajes promedio por conversación</span>
                                <span className="font-poppins font-bold text-white text-[13px]">{mensajesConv}</span>
                              </div>
                              <input type="range" min={2} max={20} step={1}
                                value={mensajesConv} onChange={e => setMensajesConv(Number(e.target.value))} className="w-full" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="font-lato text-white/35 text-[12px]">Conversaciones nuevas por mes</span>
                                <span className="font-poppins font-bold text-white text-[13px]">{convsMes}</span>
                              </div>
                              <input type="range" min={50} max={1500} step={25}
                                value={convsMes} onChange={e => setConvsMes(Number(e.target.value))} className="w-full" />
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: GR_BORDER }}>
                              <div>
                                <span className="font-lato text-white/40 text-[12px]">Consumo estimado</span>
                                <p className="font-lato text-white/25 text-[11px] mt-0.5">USD 0.02 × {mensajesConv} msg × {convsMes} conv</p>
                              </div>
                              <span className="font-poppins font-bold text-[15px]" style={{ color: GR }}>≈ USD {consumoIAUSD}/mes</span>
                            </div>
                            <p className="font-lato text-white/25 text-[11px] leading-relaxed">
                              Estimación referencial sobre el volumen de conversaciones que atienda el asistente. Se factura en USD sobre el consumo real del mes.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

        </section>

        {/* ── LOGOS ── */}
        <div className="mt-16">
          <LogoCarousel />
        </div>

        {/* ─ 05 TÉRMINOS ─ */}
        <section id="terminos" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Términos y condiciones</TagLabel>
          <SectionTitle>Todo lo que debes saber antes de empezar</SectionTitle>
          <Rule />

          <div className="space-y-3">
            {TERMINOS.map((item, i) => {
              const Icon = item.icon;
              const open = openTerms.has(i);
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${GR_BORDER}` : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => toggleTerm(i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? GR_BG : 'rgba(255,255,255,.05)' }}>
                      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: open ? GR : 'rgba(255,255,255,.4)' }} />
                    </div>
                    <span className={`flex-1 font-poppins font-semibold text-[16px] ${open ? 'text-white' : 'text-white/75'}`}>{item.titulo}</span>
                    <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-90' : ''}`}
                      style={{ color: open ? GR : 'rgba(255,255,255,.3)' }} />
                  </button>
                  {open && (
                    <div className="px-4 sm:px-5 pb-5 pl-[52px] sm:pl-[60px] border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <p className="font-lato text-white/55 text-[15px] leading-relaxed pt-4">{item.desc}</p>
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
              style={{ background: `radial-gradient(circle at 50% 100%, rgba(224,151,60,.06), transparent 70%)` }} />
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

export default GlobalRealtyProposal;
