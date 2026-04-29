import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, ChevronRight, FileText, Zap, BarChart3,
  MessageSquare, AlertCircle, TrendingUp, Mail, ArrowRight, Building2,
  Calendar, Hash, User, Info, Globe, MapPin, Plane, Users,
  Monitor, Database, Layers,
} from 'lucide-react';
import LogoCarousel from '../components/LogoCarousel';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'ANATO Seccional Central',
  tagline: 'Turismo que crece con tecnología',
  sector: 'Asociación Gremial · Turismo · Agencias de Viaje',
  fundada: '1949',
  sede: 'Bogotá D.C., Colombia',
  fecha: 'Abril 2026',
  lugar: 'Bogotá, Colombia',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  objetivo: 'Sixteam.pro como socio de transformación digital para las agencias afiliadas a ANATO Seccional Central — del diagnóstico a la implementación, en todos sus procesos tecnológicos.',
};

const ANATO_ORANGE = '#e8540a';

const STATS = [
  { valor: '30%', label: 'Crecimiento del sector turismo en Colombia · 2024', icon: TrendingUp },
  { valor: '+$6.000M', label: 'Millones USD en reservas de agencias · 2024', icon: BarChart3 },
  { valor: '48%', label: 'De las reservas ya ocurren por canales digitales', icon: Globe },
  { valor: '134%', label: 'Crecimiento de asistentes a ANATO Capacita Tech', icon: Users },
];

const PROBLEMAS = [
  {
    titulo: '"Sin datos no hay IA"',
    desc: 'Las agencias no mantienen un historial sistematizado del cliente. Sin datos estructurados, ninguna herramienta de automatización o inteligencia artificial puede funcionar a su potencial.',
    fuente: 'Luis Betancourt · ANATO Capacita Tech 2026',
    icon: Database,
    tint: 'amber',
  },
  {
    titulo: 'Operación desconectada',
    desc: 'WhatsApp, Excel, email y llamadas funcionan como silos. Los prospectos se pierden entre canales sin trazabilidad desde el primer contacto hasta la venta.',
    fuente: null,
    icon: AlertCircle,
    tint: 'red',
  },
  {
    titulo: 'Respuesta lenta vs. la competencia digital',
    desc: 'Las OTAs y plataformas online responden en segundos. Las agencias pequeñas que dependen de disponibilidad manual pierden al prospecto antes de poder contestar.',
    fuente: null,
    icon: Zap,
    tint: 'blue',
  },
  {
    titulo: 'Presencia digital limitada',
    desc: 'Muchas agencias operan sin sitio web actualizado, sin píxel de seguimiento ni campañas digitales. El mercado se mueve en línea mientras ellas captan por voz a voz.',
    fuente: null,
    icon: Monitor,
    tint: 'teal',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber: { text: 'text-amber-400', bg: 'rgba(251,191,36,.07)', border: 'rgba(251,191,36,.18)' },
  teal:  { text: 'text-[#00bfa5]', bg: 'rgba(0,191,165,.07)',  border: 'rgba(0,191,165,.18)' },
  blue:  { text: 'text-[#60a5fa]', bg: 'rgba(96,165,250,.07)', border: 'rgba(96,165,250,.18)' },
  red:   { text: 'text-[#f87171]', bg: 'rgba(221,51,51,.07)',  border: 'rgba(221,51,51,.2)'  },
};

const SERVICIOS = [
  {
    nombre: 'CRM para Agencias de Viaje',
    desc: 'Pipeline comercial de paquetes turísticos, seguimiento de prospectos, historial del cliente viajero y automatizaciones de seguimiento.',
    icon: BarChart3,
    precio_normal: 'COP 890.000/mes',
    precio_anato: 'COP 668.000/mes',
    items: [
      'Pipeline de ventas (paquetes, grupos, corporativo)',
      'Historial completo del cliente viajero',
      'Automatizaciones de seguimiento y recordatorios',
      'Reportes de rendimiento comercial',
      'Hasta 3 usuarios incluidos',
    ],
  },
  {
    nombre: 'Sixteam Inbox +IA',
    desc: 'Chat center omnicanal con bot de IA para atención inicial 24/7. WhatsApp, Instagram, Facebook y Web en una sola bandeja.',
    icon: MessageSquare,
    precio_normal: 'COP 590.000/mes',
    precio_anato: 'COP 443.000/mes',
    items: [
      'WhatsApp, Instagram, Facebook, Web en una bandeja',
      'Bot de IA conversacional entrenado para turismo',
      'Respuesta automática 24/7 a consultas de paquetes',
      'Transferencia inteligente bot → asesor humano',
      'Hasta 2 usuarios incluidos',
    ],
  },
  {
    nombre: 'Sitio Web para Agencia',
    desc: 'Diseño y desarrollo de sitio web con catálogo de destinos, formularios de contacto integrados al CRM, analíticas y SEO básico.',
    icon: Monitor,
    precio_normal: 'Desde COP 2.400.000',
    precio_anato: 'Desde COP 1.800.000',
    items: [
      'Diseño profesional adaptado al sector turismo',
      'Catálogo de destinos y paquetes turísticos',
      'Google Analytics 4 + Microsoft Clarity',
      'Formularios de contacto integrados al CRM',
      'Hasta 4 actualizaciones de contenido incluidas',
    ],
  },
  {
    nombre: 'Gestión de Pauta Digital',
    desc: 'Administración estratégica de Meta Ads para captación de viajeros. Embudo completo desde reconocimiento hasta conversión, alineado con el ciclo del turismo.',
    icon: TrendingUp,
    precio_normal: 'COP 800.000 + 10% del presupuesto/mes',
    precio_anato: 'COP 600.000 + 10% del presupuesto/mes',
    items: [
      'Estructura de campañas por embudo (ToF / MoF / BoF)',
      'Meta Pixel + Conversions API configurados',
      'Audiencias segmentadas por perfil de viajero',
      'Optimización semanal y reportes mensuales',
      'Integración formularios Meta → CRM',
    ],
  },
];

const MODELO_PASOS = [
  {
    num: '01',
    titulo: 'Firma de alianza',
    desc: 'ANATO Seccional Central y Sixteam.pro firman el acuerdo. Sin costo para el gremio ni para los afiliados por el simple hecho de pertenecer.',
    icon: FileText,
  },
  {
    num: '02',
    titulo: 'Comunicación a afiliados',
    desc: 'ANATO informa a sus agencias que tienen acceso a los servicios de Sixteam.pro con 25% de descuento exclusivo por ser asociadas de la Seccional Central.',
    icon: Mail,
  },
  {
    num: '03',
    titulo: 'Contrato directo',
    desc: 'Cada agencia que desee activar servicios contrata directamente con Sixteam.pro aplicando el descuento ANATO. El gremio no intermedia pagos.',
    icon: Users,
  },
  {
    num: '04',
    titulo: 'Implementación y adopción',
    desc: 'Sixteam asigna un especialista que acompaña a la agencia desde la configuración técnica hasta la adopción real. No es solo una plataforma: es un equipo.',
    icon: Zap,
  },
  {
    num: '05',
    titulo: 'Reporte al gremio',
    desc: 'Periódicamente presentamos a ANATO Seccional Central un reporte con agencias activas, resultados y métricas que evidencian el impacto de la alianza.',
    icon: BarChart3,
  },
];

const DIFERENCIADORES = [
  {
    titulo: 'El área de TI que la agencia no tiene',
    desc: 'Sixteam actúa como el equipo de tecnología de la agencia. El gerente no necesita entender de CRM, automatizaciones ni pauta — eso es nuestro trabajo. Su expertise es el turismo; el nuestro, la tecnología.',
    icon: Layers,
  },
  {
    titulo: 'Lo que antes costaba COP 15–25M/mes, hoy es accesible',
    desc: 'Armar esto de forma independiente requiere: desarrollador web, agencia de pauta, consultor de CRM, especialista en automatización — cada uno cobrando por separado, sin integración garantizada. Sixteam entrega todo eso unificado desde COP 668.000/mes con descuento ANATO.',
    icon: TrendingUp,
  },
  {
    titulo: 'Implementadores, no solo plataforma',
    desc: 'No entregamos un manual y un acceso. Asignamos un equipo que entiende la operación de la agencia, configura cada herramienta y acompaña hasta que se adopte y produzca resultados reales.',
    icon: Users,
  },
  {
    titulo: 'Experiencia en el sector turismo',
    desc: 'Ya trabajamos con agencias de viaje en Colombia. Conocemos los paquetes, los ciclos de decisión del viajero y la operación real del sector — no llegamos a aprender.',
    icon: Plane,
  },
  {
    titulo: 'Equipo colombiano · Soporte local',
    desc: 'Operamos desde Colombia, en español, con horarios colombianos. Entendemos el contexto real de las PYMES del sector turismo y respondemos rápido cuando se necesita.',
    icon: MapPin,
  },
  {
    titulo: 'Ciclo completo conectado',
    desc: 'Web → Pauta → Lead → Atención con IA → CRM → Seguimiento → Cierre → Reportes. No son piezas sueltas: son un sistema diseñado para que cada peso invertido en tecnología tenga trazabilidad.',
    icon: BarChart3,
  },
];

const SECCIONES = [
  { id: 'contexto',      label: 'Contexto'      },
  { id: 'reto',          label: 'El reto'        },
  { id: 'alianza',       label: 'La alianza'     },
  { id: 'portafolio',    label: 'Portafolio'     },
  { id: 'modelo',        label: 'Modelo'         },
  { id: 'piloto',        label: 'Piloto'         },
  { id: 'porquesixteam', label: 'Por qué Sixteam'},
  { id: 'proximos',      label: 'Próximos pasos' },
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

const AnatoProposal = () => {
  const [activeSection, setActiveSection] = useState('contexto');
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

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const s1 = useVisible(); const s2 = useVisible(); const s3 = useVisible();
  const s4 = useVisible(); const s5 = useVisible(); const s6 = useVisible();
  const s7 = useVisible(); const s8 = useVisible();

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

      {/* ══════════════════════════════════════ PORTADA */}
      <header className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #04111f 0%, #071826 55%, #091f34 100%)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(232,84,10,.05) 0%, transparent 65%)' }} />
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
          <div className="flex items-center gap-3">
            <span className="font-lato text-[#00bfa5]/80 text-[13px] uppercase tracking-[0.2em] border border-[#00bfa5]/20 rounded-full px-3 py-1.5">
              Confidencial
            </span>
          </div>
        </div>

        <style>{`
          @keyframes cover-spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes cover-spin-rev  { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
          @keyframes cover-pulse-glow {
            0%, 100% { opacity: 0.07; transform: scale(1); }
            50%       { opacity: 0.15; transform: scale(1.12); }
          }
          @keyframes cover-float {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-10px); }
          }
          .cover-ring-1 { animation: cover-spin-slow 22s linear infinite; }
          .cover-ring-2 { animation: cover-spin-rev  16s linear infinite; }
          .cover-glow   { animation: cover-pulse-glow 4s ease-in-out infinite; }
          .cover-float  { animation: cover-float 5s ease-in-out infinite; }
        `}</style>

        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            {/* — Izquierda — */}
            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta de transformación digital</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${ANATO_ORANGE}, #c94408)` }}>
                  <Plane className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: `rgba(232,84,10,.10)`, border: `1px solid rgba(232,84,10,.25)`, color: ANATO_ORANGE }}>
                  {META.tagline}
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}>
                Transformación<br />
                <span style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Digital
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
                <span className="font-poppins font-bold text-[#00bfa5] text-[15px] sm:text-[18px]">+</span>
                <span className="font-poppins font-bold text-[#00bfa5] text-[15px] sm:text-[18px]">People</span>
                <span className="font-poppins font-bold text-white/50 text-[15px] sm:text-[18px]">=</span>
                <span className="font-poppins font-black text-[#00bfa5] text-[15px] sm:text-[18px]">Growth</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  { icon: Calendar, text: META.fecha },
                  { icon: MapPin,   text: META.lugar  },
                  { icon: Globe,    text: META.sector  },
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

              <div className="border-t pt-5" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-widest mb-3">Contenido</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                  {[
                    '1. El momento del turismo', '2. El reto de las agencias',
                    '3. La propuesta de alianza',  '4. Portafolio con descuento ANATO',
                    '5. Modelo operativo',         '6. Piloto propuesto',
                    '7. ¿Por qué Sixteam?',        '8. Próximos pasos',
                  ].map((item, i) => (
                    <button key={i} onClick={() => scrollTo(SECCIONES[i]?.id)}
                      className="font-lato text-white/45 text-[15px] hover:text-[#00bfa5] transition-colors duration-200 text-left flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#00bfa5]/40 flex-shrink-0" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* — Derecha: Sixteam × ANATO — */}
            <div className="flex items-center justify-center relative min-h-[380px]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="cover-glow absolute w-80 h-80 rounded-full"
                  style={{ background: `radial-gradient(circle, rgba(232,84,10,.08) 0%, rgba(29,112,162,.05) 50%, transparent 70%)` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full"
                  style={{ border: `1px solid rgba(232,84,10,.12)` }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full"
                  style={{ border: '1px dashed rgba(29,112,162,.15)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: ANATO_ORANGE, boxShadow: `0 0 8px rgba(232,84,10,.8)` }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: '#00bfa5', boxShadow: '0 0 6px rgba(0,191,165,.8)' }} />
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
                {/* ANATO badge */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center w-28 h-28 rounded-2xl"
                    style={{ background: `linear-gradient(135deg, rgba(232,84,10,.15), rgba(201,68,8,.08))`, border: `1px solid rgba(232,84,10,.3)`, boxShadow: `0 4px 24px rgba(232,84,10,.15)` }}>
                    <Plane className="w-12 h-12" style={{ color: ANATO_ORANGE }} />
                  </div>
                  <span className="font-poppins font-black text-white/80 text-[22px] tracking-tight">ANATO</span>
                  <span className="font-lato text-white/30 text-[11px] uppercase tracking-[0.2em]">Seccional Central</span>
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

      {/* SOCIAL PROOF */}
      <div className="w-full relative z-20 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <LogoCarousel />
      </div>

      {/* ══════════════════════════════════════ CONTENIDO */}
      <main className="max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-20 space-y-24">

        {/* ─ 01 CONTEXTO ─ */}
        <section id="contexto" ref={s1.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s1.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>01 — Contexto</TagLabel>
          <SectionTitle>El turismo colombiano está en su mejor momento</SectionTitle>
          <Rule />

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>Colombia vive un boom turístico sin precedentes. En 2024, el turismo generó <strong className="text-white/90 font-semibold">más divisas que el carbón y el café</strong> — y las proyecciones apuntan a que 2025 superará los USD 11.344 millones en ingresos por turismo. Las agencias de viaje afiliadas a ANATO registran un crecimiento del 30% en ventas y el 70% reporta expansión activa en lo que va de 2026.</p>
            <p>Este crecimiento trae una exigencia clara: <strong className="text-white/90 font-semibold">las agencias que no adopten tecnología quedarán rezagadas</strong>. Las OTAs y plataformas digitales ya captan el 48% de las reservas online. El mercado premia la velocidad, la personalización y la disponibilidad 24/7 — características que hoy solo se logran con infraestructura tecnológica.</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="rounded-xl p-4 flex flex-col gap-2"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <Icon className="w-4 h-4 text-[#00bfa5]" />
                  <p className="font-poppins font-black text-white" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
                    >{s.valor}</p>
                  <p className="font-lato text-white/45 text-[13px] leading-snug">{s.label}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─ 02 EL RETO ─ */}
        <section id="reto" ref={s2.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>02 — El reto</TagLabel>
          <SectionTitle>Las agencias necesitan tecnología para aprovechar este momento</SectionTitle>
          <Rule />

          <p className="font-lato text-white/60 text-[19px] leading-relaxed mb-8">
            La mayoría de las agencias afiliadas a ANATO son pequeñas y medianas empresas que operan con recursos limitados. El crecimiento del sector las demanda más, pero sus procesos internos no han evolucionado al mismo ritmo. Estos son los cuatro problemas que frenan su potencial:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROBLEMAS.map((p, i) => {
              const Icon = p.icon;
              const t = TINT[p.tint];
              return (
                <div key={i} className="rounded-xl p-4 flex gap-3"
                  style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                  <Icon className={`w-4 h-4 ${t.text} flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className="font-poppins font-semibold text-white/90 text-[18px] mb-1">{p.titulo}</p>
                    <p className="font-lato text-white/50 text-[15px] leading-relaxed">{p.desc}</p>
                    {p.fuente && (
                      <p className="font-lato text-white/25 text-[13px] mt-2 italic">— {p.fuente}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─ 03 LA ALIANZA ─ */}
        <section id="alianza" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — La propuesta</TagLabel>
          <SectionTitle>El socio de transformación digital que las agencias necesitan</SectionTitle>
          <Rule />

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-8">
            <p><strong className="text-white/90 font-semibold">Sixteam.pro no es un proveedor de software.</strong> Es el equipo de tecnología y transformación digital que las agencias no tienen — y que hasta hace poco solo las grandes empresas podían costear. Antes, lograr una transformación real requería contratar un gerente de TI, un desarrollador, un experto en pauta digital y un consultor de CRM. Una inversión fuera del alcance de la mayoría de agencias.</p>
            <p>Hoy eso cambió. Armar la infraestructura digital de una agencia por cuenta propia significa contratar: un desarrollador web, una agencia de pauta, un consultor de CRM y un especialista en automatización — cada uno cobrando por separado, sin integración, sin visión de conjunto. <strong className="text-white/90 font-semibold">Un costo real de COP 15 a 25 millones mensuales o más</strong>, que la mayoría de agencias simplemente no puede sostener. Sixteam resuelve todo eso en un solo equipo, integrado, con foco en turismo, desde COP 668.000/mes con el descuento ANATO. <strong className="text-white/90 font-semibold">La brecha entre la agencia grande y la pequeña ya no es tecnología — es decisión.</strong></p>
            <p>Proponemos a <strong className="text-white/90 font-semibold">ANATO Seccional Central</strong> convertirse en el canal que conecta a sus afiliadas con este modelo: acceso a Sixteam con un <strong className="text-white/90 font-semibold">25% de descuento exclusivo</strong> por pertenecer al gremio. Para ANATO no hay costo ni riesgo — solo el valor de ser el puente hacia la transformación digital del sector.</p>
          </div>

          {/* Beneficios de la alianza */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {[
              {
                quien: 'Agencias afiliadas',
                beneficio: '25% de descuento en todos los servicios Sixteam + implementación accesible + equipo de acompañamiento.',
                color: ANATO_ORANGE,
                bgColor: `rgba(232,84,10,.06)`,
                borderColor: `rgba(232,84,10,.2)`,
                icon: Users,
              },
              {
                quien: 'ANATO Seccional Central',
                beneficio: 'Ofrece valor tangible y diferencial a sus afiliadas. Convierte la membresía en acceso a tecnología — sin costo para el gremio.',
                color: '#00bfa5',
                bgColor: 'rgba(0,191,165,.06)',
                borderColor: 'rgba(0,191,165,.22)',
                icon: FileText,
              },
              {
                quien: 'Sixteam.pro',
                beneficio: 'Acceso a un mercado calificado de agencias de viaje. Crecemos junto con el sector a través de una alianza con el gremio más representativo.',
                color: '#1d70a2',
                bgColor: 'rgba(29,112,162,.07)',
                borderColor: 'rgba(29,112,162,.2)',
                icon: TrendingUp,
              },
            ].map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="rounded-xl p-5 flex flex-col gap-3"
                  style={{ background: b.bgColor, border: `1px solid ${b.borderColor}` }}>
                  <Icon className="w-5 h-5" style={{ color: b.color }} />
                  <div>
                    <p className="font-poppins font-bold text-white/85 text-[15px] mb-2">{b.quien}</p>
                    <p className="font-lato text-white/55 text-[15px] leading-relaxed">{b.beneficio}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Descuento destacado */}
          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, rgba(232,84,10,.08), rgba(232,84,10,.03))`, border: `1px solid rgba(232,84,10,.2)` }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: `radial-gradient(circle, rgba(232,84,10,.07), transparent 70%)`, transform: 'translate(20%,-20%)' }} />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: `rgba(232,84,10,.15)`, border: `1px solid rgba(232,84,10,.3)` }}>
                <span className="font-poppins font-black text-[22px]" style={{ color: ANATO_ORANGE }}>25%</span>
              </div>
              <div>
                <p className="font-poppins font-bold text-white/90 text-[19px] mb-1">
                  Descuento exclusivo para afiliados ANATO Seccional Central
                </p>
                <p className="font-lato text-white/55 text-[17px]">
                  Aplica sobre el 100% del portafolio Sixteam.pro: licencias mensuales, implementaciones, sitios web y gestión de pauta. Sin letra pequeña.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─ 04 PORTAFOLIO ─ */}
        <section id="portafolio" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Portafolio</TagLabel>
          <SectionTitle>Servicios disponibles con descuento ANATO</SectionTitle>
          <Rule />
          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-6">
            Una agencia de viajes en plena transformación digital necesita resolver cuatro frentes: captar leads, atenderlos rápido, convertirlos y fidelizarlos. Estas cuatro soluciones cubren ese ciclo completo — <strong className="text-white/75">no como herramientas aisladas, sino como un ecosistema conectado</strong> que Sixteam diseña, implementa y opera por la agencia. Todo con <strong className="text-white/75">25% de descuento exclusivo</strong> para afiliados a ANATO Seccional Central.
          </p>

          <div className="space-y-2.5">
            {SERVICIOS.map((srv, i) => {
              const Icon = srv.icon;
              const open = servicioActivo === i;
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
                      <p className={`font-poppins font-bold text-[18px] ${open ? 'text-white' : 'text-white/70'}`}>{srv.nombre}</p>
                      <p className={`font-lato text-[15px] mt-0.5 truncate ${open ? 'text-white/60' : 'text-white/35'}`}>{srv.desc}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <div className="text-right hidden sm:block">
                        <p className="font-poppins font-black text-[#00bfa5] text-[18px]">{srv.precio_anato}</p>
                        <p className="font-lato text-white/25 text-[13px] line-through mt-0.5">{srv.precio_normal}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-[#00bfa5]/60 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`} />
                    </div>
                  </button>
                  {open && (
                    <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Incluye</p>
                          <ul className="space-y-2">
                            {srv.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                                <span className="font-lato text-white/65 text-[18px]">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-col gap-3">
                          <div className="rounded-xl p-4" style={{ background: `rgba(232,84,10,.06)`, border: `1px solid rgba(232,84,10,.15)` }}>
                            <p className="font-lato text-white/35 text-[13px] uppercase tracking-wider mb-2">Precio estándar</p>
                            <p className="font-poppins font-bold text-white/50 text-[17px] line-through">{srv.precio_normal}</p>
                          </div>
                          <div className="rounded-xl p-4" style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.22)' }}>
                            <p className="font-lato text-[#00bfa5] text-[13px] uppercase tracking-wider mb-2">Precio para afiliados ANATO</p>
                            <p className="font-poppins font-black text-white text-[23px]">{srv.precio_anato}</p>
                            <p className="font-lato text-[#00bfa5] text-[13px] mt-1">25% de descuento aplicado</p>
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

        {/* ─ 05 MODELO OPERATIVO ─ */}
        <section id="modelo" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Modelo operativo</TagLabel>
          <SectionTitle>¿Cómo funciona la alianza?</SectionTitle>
          <Rule />
          <p className="font-lato text-white/55 text-[18px] leading-relaxed mb-8">
            La alianza es simple para ANATO y flexible para las agencias. Cinco pasos que definen cómo opera el acuerdo de principio a fin:
          </p>

          <div className="relative">
            {/* Línea vertical conectora */}
            <div className="absolute left-[19px] top-6 bottom-6 w-px hidden sm:block"
              style={{ background: 'linear-gradient(180deg, rgba(29,112,162,.3), rgba(0,191,165,.3))' }} />

            <div className="space-y-4">
              {MODELO_PASOS.map((paso, i) => {
                const Icon = paso.icon;
                return (
                  <div key={i} className="flex gap-4 relative">
                    <div className="flex-shrink-0 flex flex-col items-center gap-1 relative z-10">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(29,112,162,.15)', border: '1px solid rgba(29,112,162,.3)' }}>
                        <Icon className="w-4 h-4 text-[#1d70a2]" />
                      </div>
                    </div>
                    <div className="flex-1 rounded-xl p-4 sm:p-5 self-start"
                      style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-poppins font-black text-[#00bfa5] text-[12px] tracking-wider">{paso.num}</span>
                        <p className="font-poppins font-bold text-white/85 text-[18px]">{paso.titulo}</p>
                      </div>
                      <p className="font-lato text-white/50 text-[17px] leading-relaxed">{paso.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─ 06 PILOTO ─ */}
        <section id="piloto" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 — Propuesta piloto</TagLabel>
          <SectionTitle>Empecemos con una agencia: sin costo</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden mb-6"
            style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,191,165,.06), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <div className="relative z-10">
              <p className="font-lato text-white/60 text-[19px] leading-relaxed mb-6">
                Para demostrar el valor real de la alianza antes de cualquier compromiso mayor, proponemos iniciar con un <strong className="text-white/90 font-semibold">piloto gratuito en una agencia de la Seccional Central</strong> — seleccionada por ANATO según los criterios que considere apropiados.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Qué incluye el piloto</p>
                  <ul className="space-y-2">
                    {[
                      'Implementación completa de CRM Sixteam.pro',
                      'Activación de Sixteam Inbox +IA',
                      'Configuración de flujos y automatizaciones base',
                      '2 meses de licencia incluidos sin costo',
                      'Acompañamiento y capacitación del equipo',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                        <span className="font-lato text-white/65 text-[18px]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Resultado esperado</p>
                  <ul className="space-y-2">
                    {[
                      'Historial de clientes viajeros sistematizado',
                      'Respuesta a leads en segundos con IA',
                      'Seguimiento automático de prospectos',
                      'Reporte de impacto presentable a ANATO',
                      'Caso de éxito para escalar a más agencias',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5" style={{ color: ANATO_ORANGE }} />
                        <span className="font-lato text-white/65 text-[18px]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-xl p-4 flex items-center gap-4"
                style={{ background: `rgba(232,84,10,.07)`, border: `1px solid rgba(232,84,10,.18)` }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `rgba(232,84,10,.15)` }}>
                  <span className="font-poppins font-black text-[16px]" style={{ color: ANATO_ORANGE }}>$0</span>
                </div>
                <div>
                  <p className="font-poppins font-bold text-white/85 text-[17px]">Costo del piloto para ANATO y la agencia seleccionada</p>
                  <p className="font-lato text-white/45 text-[15px]">La implementación, las licencias y el acompañamiento del piloto son completamente sin costo. Solo pedimos disposición del equipo de la agencia.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─ 07 POR QUÉ SIXTEAM ─ */}
        <section id="porquesixteam" ref={s7.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s7.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>07 — Diferenciadores</TagLabel>
          <SectionTitle>¿Por qué Sixteam.pro?</SectionTitle>
          <Rule />
          <p className="font-lato text-white/55 text-[18px] leading-relaxed mb-7">
            ANATO ya tiene alianzas con plataformas tecnológicas (DataCRM, Prolibu, Wetu). Son buenas herramientas — pero las herramientas solas no transforman una agencia. El verdadero problema no es el acceso a la plataforma: <strong className="text-white/80">es que se compran y no se usan</strong>, porque nadie en la agencia tiene el tiempo, la formación ni la responsabilidad de hacerlas funcionar. Sixteam resuelve exactamente eso: somos el equipo de transformación digital de la agencia, no un proveedor más de software.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DIFERENCIADORES.map((d, i) => {
              const Icon = d.icon;
              return (
                <div key={i} className="rounded-xl p-5 flex gap-4"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(0,191,165,.1)', border: '1px solid rgba(0,191,165,.2)' }}>
                    <Icon className="w-4 h-4 text-[#00bfa5]" />
                  </div>
                  <div>
                    <p className="font-poppins font-bold text-white/85 text-[18px] mb-1.5">{d.titulo}</p>
                    <p className="font-lato text-white/50 text-[16px] leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─ 08 PRÓXIMOS PASOS ─ */}
        <section id="proximos" ref={s8.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s8.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>08 — Próximos pasos</TagLabel>
          <SectionTitle>¿Cómo avanzamos?</SectionTitle>
          <Rule />

          <div className="space-y-3 mb-8">
            {[
              {
                paso: '01',
                titulo: 'Reunión de presentación',
                desc: 'Una sesión de 30–45 minutos con la Junta Directiva de la Seccional Central para presentar la alianza, resolver preguntas y validar el modelo operativo.',
                icon: Users,
              },
              {
                paso: '02',
                titulo: 'Acuerdo de términos',
                desc: 'Definir los detalles del acuerdo: canales de comunicación a afiliadas, formato del anuncio, criterio de selección de la agencia piloto y mecanismo de reporte.',
                icon: FileText,
              },
              {
                paso: '03',
                titulo: 'Lanzamiento del piloto',
                desc: 'Selección de la primera agencia, inicio de la implementación gratuita y construcción del caso de éxito que demostrará el valor de la alianza.',
                icon: Zap,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="rounded-xl p-4 sm:p-5 flex gap-4"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#1d70a2,#00bfa5)' }}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-poppins font-black text-[#00bfa5] text-[12px]">{item.paso}</span>
                      <p className="font-poppins font-bold text-white/85 text-[18px]">{item.titulo}</p>
                    </div>
                    <p className="font-lato text-white/50 text-[17px] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl p-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.06)' }}>
            <Info className="w-4 h-4 text-[#00bfa5] flex-shrink-0 mt-0.5" />
            <p className="font-lato text-white/45 text-[16px] leading-relaxed">
              Esta propuesta tiene vigencia de <span className="text-white/70 font-semibold">30 días</span> a partir de la fecha de entrega. Los precios indicados corresponden a la tabla de tarifas Sixteam.pro de Abril 2026.
            </p>
          </div>
        </section>

      </main>

      {/* ══════════════════════════════════════ FOOTER */}
      <footer style={{ background: 'linear-gradient(180deg, #04111f, #030d1a)' }}>
        <div className="relative overflow-hidden border-t" style={{ borderColor: `rgba(232,84,10,.12)` }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full"
              style={{ background: `radial-gradient(circle, rgba(232,84,10,.05), transparent 65%)`, transform: 'translate(30%,-30%)' }} />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-16 sm:py-20 text-center">
            <TagLabel>¿Avanzamos?</TagLabel>
            <h2 className="font-poppins font-black text-white mt-4 mb-4 leading-tight"
              style={{ fontSize: 'clamp(2.25rem, 6.25vw, 4rem)' }}>
              Hablemos y armemos la alianza
            </h2>
            <p className="font-lato text-white/50 max-w-md mx-auto mb-8 text-[18px] sm:text-xl leading-relaxed">
              Una reunión de 30 minutos es todo lo que necesitamos para definir si esta alianza tiene sentido para ANATO Seccional Central.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <a href="https://wa.me/573004188522" target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-poppins font-bold text-[18px] text-[#030d1a] transition-all duration-300 hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#00bfa5,#00d4b8)', boxShadow: '0 4px 28px rgba(0,191,165,.4)' }}>
                <MessageSquare className="w-4 h-4" />
                Escribir por WhatsApp
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href={`mailto:${META.correo}`}
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-poppins font-bold text-[18px] text-white/80 transition-all duration-300 hover:scale-105"
                style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)' }}>
                <Mail className="w-4 h-4" />
                {META.correo}
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

export default AnatoProposal;
