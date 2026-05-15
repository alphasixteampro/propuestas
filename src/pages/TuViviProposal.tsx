import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, ChevronRight, FileText, Target, Zap, BarChart3,
  MessageSquare, AlertCircle, TrendingUp, ArrowRight,
  Calendar, Hash, Info, MapPin, Clock,
  Database, Users, Wrench, Home,
} from 'lucide-react';
import LogoCarousel from '../components/LogoCarousel';

const ACCENT  = '#3b82f6';
const ACCENT2 = '#1d4ed8';

const META = {
  cliente:    'TuVivi',
  contacto:   'Víctor Cruz',
  cargo:      'Gerente',
  sector:     'Asesorías Financieras · Créditos · Aliados Inmobiliarios',
  fecha:      'Mayo 2026',
  lugar:      'Colombia',
  nit:        '901.967.849-4',
  correo:     'alpha@sixteam.pro',
  rl:         'Samuel Armando Burgos Ferrer',
};

const HALLAZGOS = [
  {
    titulo: 'Automatizaciones con datos incorrectos',
    desc: 'En las etapas "viable" y "desiste", el motivo registrado se cruza con datos de negocios anteriores. Los aliados reciben información de casos previos en lugar del motivo real del negocio actual.',
    icon: AlertCircle,
    tint: 'red',
  },
  {
    titulo: 'Propiedades adicionales que se truncan',
    desc: 'Cuando se solicita incluir propiedades extra en los mensajes automáticos a aliados, la información llega incompleta o no se arrastra correctamente desde el registro del contacto.',
    icon: Database,
    tint: 'amber',
  },
  {
    titulo: 'Reportes e informes para aliados sin configurar',
    desc: 'El equipo necesita dashboards e informes específicos para sus aliados (asesores inmobiliarios, constructoras), pero la plataforma no tiene aún esa capa de reporte operativa configurada.',
    icon: BarChart3,
    tint: 'blue',
  },
  {
    titulo: 'Ausencia de un equipo tecnológico estratégico',
    desc: 'TuVivi necesita más que soporte técnico puntual: un equipo que entienda el negocio, aplique la tecnología con criterio estratégico y acompañe los procesos de mejora continua desde una visión innovadora, no solo correctiva.',
    icon: TrendingUp,
    tint: 'teal',
  },
];

const TINT: Record<string, { textColor: string; bg: string; border: string }> = {
  amber: { textColor: '#f59e0b', bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)' },
  blue:  { textColor: '#60a5fa', bg: 'rgba(96,165,250,.07)',  border: 'rgba(96,165,250,.18)' },
  red:   { textColor: '#f87171', bg: 'rgba(221,51,51,.07)',   border: 'rgba(221,51,51,.2)'   },
  teal:  { textColor: '#00bfa5', bg: 'rgba(0,191,165,.07)',   border: 'rgba(0,191,165,.18)'  },
};

const PAQUETES = [
  {
    horas: 5,
    precio: '$600.000 COP',
    tag: 'Inicio rápido',
    destacado: false,
    desc: 'Para atender necesidades puntuales y correcciones específicas dentro de la plataforma.',
    items: [
      'Diagnóstico de la configuración actual',
      'Corrección de hasta 2 flujos de automatización',
      'Revisión de propiedades y campos del CRM',
      'Informe de hallazgos con recomendaciones',
    ],
  },
  {
    horas: 10,
    precio: '$1.100.000 COP',
    tag: 'Recomendado',
    destacado: true,
    desc: 'El punto de partida ideal: correcciones inmediatas más una primera ronda de mejoras.',
    items: [
      'Diagnóstico completo de la plataforma',
      'Corrección completa de los flujos con aliados',
      'Configuración de hasta 2 reportes o dashboards',
      'Revisión y ajuste de automatizaciones activas',
      'Sesión de validación con el equipo',
    ],
  },
  {
    horas: 20,
    precio: '$2.000.000 COP',
    tag: 'Transformación completa',
    destacado: false,
    desc: 'Correcciones, mejoras, nuevas automatizaciones y acompañamiento extendido.',
    items: [
      'Todo lo del paquete de 10 horas',
      'Implementación de nuevas automatizaciones',
      'Reportería completa para el ecosistema de aliados',
      'Revisión del objeto Aliados y sus propiedades',
      'Nuevos casos de uso según prioridades del equipo',
      'Capacitación al equipo (hasta 2 horas)',
      'Documentación operativa entregada',
    ],
  },
];

const SECCIONES = [
  { id: 'resumen',    label: 'Resumen'        },
  { id: 'servicio',   label: 'Servicio'        },
  { id: 'cotizacion', label: 'Cotización'      },
  { id: 'sixteam',    label: 'Por qué nosotros'},
  { id: 'vigencia',   label: 'Vigencia'        },
];

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
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: `linear-gradient(90deg,${ACCENT2},${ACCENT})` }} />
);

const TuViviProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');

  useEffect(() => {
    const handler = () => {
      const offset = window.innerWidth >= 1024 ? 140 : 60;
      for (const s of SECCIONES) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= offset && rect.bottom > offset) { setActiveSection(s.id); break; }
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const s1 = useVisible(); const s2 = useVisible(); const s3 = useVisible();
  const s4 = useVisible(); const s5 = useVisible();

  return (
    <div id="proposal-root" className="min-h-screen overflow-x-hidden" style={{ background: '#030d1a', fontFamily: 'Lato, sans-serif' }}>

      {/* NAV LATERAL */}
      <nav className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-50 flex-col gap-3 no-print">
        {SECCIONES.map(s => (
          <button key={s.id} onClick={() => scrollTo(s.id)}
            className={`group flex items-center gap-2.5 transition-all duration-300 ${activeSection === s.id ? 'opacity-100' : 'opacity-25 hover:opacity-60'}`}>
            <span className={`font-lato text-[14px] text-white whitespace-nowrap transition-all duration-300 ${activeSection === s.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>
              {s.label}
            </span>
            <div className="rounded-full flex-shrink-0 transition-all duration-300"
              style={{
                width: activeSection === s.id ? 8 : 6,
                height: activeSection === s.id ? 8 : 6,
                background: activeSection === s.id ? ACCENT : 'rgba(255,255,255,.5)',
                boxShadow: activeSection === s.id ? `0 0 6px ${ACCENT}aa` : 'none',
              }} />
          </button>
        ))}
      </nav>

      {/* PORTADA */}
      <header className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #04111f 0%, #071826 55%, #091f34 100%)' }}>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
            style={{ background: `radial-gradient(circle, ${ACCENT}0d 0%, transparent 65%)` }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: `radial-gradient(circle, ${ACCENT2}0a 0%, transparent 70%)`, transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        </div>

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
          <span className="font-lato text-[13px] uppercase tracking-[0.2em] border rounded-full px-3 py-1.5"
            style={{ color: `${ACCENT}cc`, borderColor: `${ACCENT}25` }}>
            Confidencial · {META.fecha}
          </span>
        </div>

        <style>{`
          @keyframes cover-spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes cover-spin-rev  { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
          @keyframes cover-pulse-glow { 0%, 100% { opacity: 0.07; transform: scale(1); } 50% { opacity: 0.15; transform: scale(1.12); } }
          @keyframes cover-float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
          .cover-ring-1 { animation: cover-spin-slow 22s linear infinite; }
          .cover-ring-2 { animation: cover-spin-rev  16s linear infinite; }
          .cover-glow   { animation: cover-pulse-glow 4s ease-in-out infinite; }
          .cover-float  { animation: cover-float 5s ease-in-out infinite; }
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=Lato:wght@300;400;500;700&display=swap');
          .font-poppins { font-family: 'Poppins', sans-serif; }
          .font-lato    { font-family: 'Lato', sans-serif; }
          @media print { .no-print { display:none !important; } }
        `}</style>

        <div className="relative z-10 flex-1 flex items-center justify-center py-12 px-6 sm:px-10 lg:px-[10%]">
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta comercial · Soporte HubSpot</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})` }}>
                  <Home className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}28`, color: ACCENT }}>
                  Asesorías de Crédito
                </span>
              </div>

              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}>
                Soporte y<br />
                <span style={{ background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Operaciones
                </span>
              </h1>

              <p className="font-lato text-white/55 text-xl leading-relaxed mb-5">HubSpot · Paquetes de horas a la medida</p>

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
                  { icon: Calendar, text: META.fecha  },
                  { icon: MapPin,   text: META.lugar  },
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
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-x-6 gap-y-1.5">
                  {['1. Resumen ejecutivo', '2. Nuestro servicio', '3. Cotización', '4. Por qué Sixteam', '5. Vigencia'].map((item, i) => (
                    <button key={i} onClick={() => scrollTo(SECCIONES[i]?.id)}
                      className="font-lato text-white/45 text-[15px] hover:text-[#00bfa5] transition-colors duration-200 text-left flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#00bfa5]/40 flex-shrink-0" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center relative min-h-[260px] sm:min-h-[380px]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="cover-glow absolute w-80 h-80 rounded-full"
                  style={{ background: `radial-gradient(circle, ${ACCENT}12 0%, ${ACCENT2}06 50%, transparent 70%)` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full"
                  style={{ border: `1px solid ${ACCENT}12` }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full"
                  style={{ border: `1px dashed ${ACCENT2}18` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: ACCENT, boxShadow: `0 0 6px ${ACCENT}cc` }} />
                </div>
              </div>

              <div className="cover-float relative z-10 flex flex-col items-center gap-6 w-full px-6">
                <div className="flex flex-col items-center gap-1">
                  <img src="/sixteam-logo.png" alt="Sixteam.pro"
                    className="h-20 w-auto object-contain"
                    style={{ filter: `drop-shadow(0 4px 20px ${ACCENT}55)` }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <span className="font-poppins font-black text-white/30 text-[11px] uppercase tracking-[0.2em]">Sixteam.pro</span>
                </div>

                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}20)` }} />
                  <div className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)' }}>
                    <span className="font-poppins font-black text-white/40 text-[20px] leading-none">×</span>
                  </div>
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${ACCENT}20, transparent)` }} />
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-2xl px-6 py-4 flex flex-col items-center justify-center"
                    style={{ background: 'rgba(255,255,255,.97)', boxShadow: `0 4px 28px ${ACCENT}28` }}>
                    <img src="/tuvivi-logo.png" alt="TuVivi"
                      className="h-14 w-auto object-contain max-w-[200px]"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'none';
                        const parent = img.parentElement;
                        if (parent) {
                          parent.style.background = `linear-gradient(135deg, ${ACCENT}18, ${ACCENT2}10)`;
                          parent.innerHTML = '<span style="font-family:Poppins,sans-serif;font-weight:900;color:white;font-size:2.2rem;letter-spacing:-0.02em">TuVivi</span>';
                        }
                      }} />
                  </div>
                  <span className="font-poppins font-black text-white/30 text-[11px] uppercase tracking-[0.2em]">TuVivi</span>
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

      <div className="w-full relative z-20 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <LogoCarousel />
      </div>

      <nav className="lg:hidden sticky top-0 z-40 no-print"
        style={{ background: 'rgba(3,13,26,0.96)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <div className="flex overflow-x-auto py-2.5 px-4 gap-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {SECCIONES.map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full font-lato text-[13px] whitespace-nowrap transition-all duration-200"
              style={activeSection === s.id
                ? { background: ACCENT, color: '#030d1a', fontWeight: 600 }
                : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)' }}>
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-20 space-y-24">

        {/* 01 RESUMEN */}
        <section id="resumen" ref={s1.ref as React.RefObject<HTMLElement>}
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s1.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>01 — Resumen ejecutivo</TagLabel>
          <SectionTitle>Contexto y diagnóstico inicial</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="rounded-2xl overflow-hidden flex items-center justify-center px-4 py-2"
                style={{ background: 'rgba(255,255,255,.97)', boxShadow: `0 4px 20px ${ACCENT}20` }}>
                <img src="/tuvivi-logo.png" alt="TuVivi"
                  className="h-10 w-auto object-contain max-w-[150px]"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <span className="font-poppins font-black text-white text-[14px] tracking-tight">TuVivi</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                <p className="font-lato text-white/80 text-[16px]">Asesorías financieras para créditos</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Aliados principales</p>
                <p className="font-lato text-white/80 text-[16px]">Asesores inmobiliarios · Constructoras</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">CRM actual</p>
                <div className="flex items-center gap-2">
                  <img src="/hubspot-icon.webp" alt="HubSpot" className="w-5 h-5 object-contain rounded"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <p className="font-lato text-white/80 text-[16px]">HubSpot Pro (Sales + Service Hub)</p>
                </div>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Preparado para</p>
                <p className="font-lato text-white/60 text-[16px]">{META.contacto} · {META.cargo}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              TuVivi lleva más de un año utilizando HubSpot Pro con los hubs de Sales y Service. La plataforma fue implementada inicialmente por una agencia externa, con avances valiosos pero sin el tiempo para ajustar cada detalle. Hoy el equipo opera sobre una base funcional que necesita atención puntual en los casos de uso más críticos.
            </p>
            <p>
              Los dos dolores más urgentes son claros: las automatizaciones de WhatsApp hacia los aliados en ciertas etapas del pipeline arrastran datos incorrectos de negocios anteriores, y las propiedades adicionales que se intentan incluir en los mensajes llegan incompletas. A esto se suma la necesidad de construir reportes que permitan comunicarle a los aliados información relevante sobre cada cliente.
            </p>
            <p>
              No hay que empezar desde cero. El trabajo es tomar lo que ya está construido, <strong className="text-white/90 font-semibold">corregirlo con precisión, estabilizarlo y ampliarlo</strong> para que la comunicación con los aliados sea siempre exacta y automatizada.
            </p>
          </div>

          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> Situaciones identificadas en la reunión
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HALLAZGOS.map((h, i) => {
                const Icon = h.icon;
                const t = TINT[h.tint];
                return (
                  <div key={i} className="rounded-xl p-4 flex gap-3"
                    style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                    <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: t.textColor }} />
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

        {/* 02 SERVICIO */}
        <section id="servicio" ref={s2.ref as React.RefObject<HTMLElement>}
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>02 — Nuestro servicio</TagLabel>
          <SectionTitle>Soporte y Operaciones HubSpot</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden mb-8"
            style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${ACCENT}0a, transparent 70%)`, transform: 'translate(20%,-20%)' }} />
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-7 h-7" style={{ color: ACCENT }} />
              <div className="flex items-center gap-2 px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)' }}>
                <img src="/hubspot-icon.webp" alt="HubSpot" className="w-4 h-4 object-contain rounded"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <span className="font-lato text-white/50 text-[13px]">HubSpot Partner</span>
              </div>
            </div>
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[22px] leading-relaxed mb-4">
              Somos partner de HubSpot con experiencia en implementaciones en Colombia y en el exterior. Cada hora tiene un entregable, un diagnóstico o una mejora concreta dentro de la plataforma.
            </p>
            <p className="font-lato text-white/55 text-[17px] leading-relaxed">
              El equipo de TuVivi prioriza los casos de uso a atender y Sixteam.pro los ejecuta con trazabilidad completa, entregando un reporte de horas consumidas con detalle de cada acción realizada.
            </p>
          </div>

          <p className="font-lato text-white/30 text-[13px] uppercase tracking-widest mb-4">Lo que cubrimos con el servicio</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Wrench,        titulo: 'Corrección de flujos y automatizaciones', desc: 'Revisión, diagnóstico y corrección de los workflows activos para que los datos enviados a los aliados siempre sean correctos.' },
              { icon: Database,      titulo: 'Configuración de propiedades y objetos',  desc: 'Ajuste del modelo de datos de HubSpot: objetos personalizados como "Aliados", propiedades asociadas y campos del pipeline.' },
              { icon: BarChart3,     titulo: 'Reportes y dashboards',                   desc: 'Construcción de informes operativos y dashboards adaptados a las necesidades de TuVivi y de sus aliados comerciales.' },
              { icon: MessageSquare, titulo: 'Automatizaciones WhatsApp',               desc: 'Revisión y mejora de los disparadores de mensajes a aliados, incluyendo propiedades adicionales y condiciones de etapa.' },
              { icon: Zap,           titulo: 'Nuevos casos de uso',                     desc: 'Implementación de nuevas automatizaciones, secuencias de seguimiento o integraciones según las prioridades del equipo.' },
              { icon: Users,         titulo: 'Capacitación y acompañamiento',           desc: 'Sesiones de orientación con el equipo para asegurar la adopción de cada mejora implementada, con documentación del proceso.' },
            ].map(({ icon: Icon, titulo, desc }) => (
              <div key={titulo} className="rounded-xl p-5 flex gap-4"
                style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}20` }}>
                  <Icon className="w-4 h-4" style={{ color: ACCENT }} />
                </div>
                <div>
                  <p className="font-poppins font-bold text-white/90 text-[16px] mb-1">{titulo}</p>
                  <p className="font-lato text-white/50 text-[14px] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 03 COTIZACIÓN */}
        <section id="cotizacion" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — Cotización</TagLabel>
          <SectionTitle>Paquetes de horas</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Valores en <strong className="text-white/75">pesos colombianos (COP) más IVA</strong>. Elige el paquete según el alcance inicial que quieres cubrir. Las horas no vencen y se consumen en sesiones distribuidas según las prioridades del equipo.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {PAQUETES.map((p) => (
              <div key={p.horas} className="rounded-2xl flex flex-col overflow-hidden"
                style={{
                  background: p.destacado ? `linear-gradient(135deg, ${ACCENT}12, ${ACCENT2}08)` : 'rgba(255,255,255,.03)',
                  border: p.destacado ? `1px solid ${ACCENT}40` : '1px solid rgba(255,255,255,.08)',
                  boxShadow: p.destacado ? `0 4px 28px ${ACCENT}18` : 'none',
                }}>
                {p.destacado && (
                  <div className="text-center py-2 font-poppins font-bold text-[11px] uppercase tracking-wider text-[#030d1a]"
                    style={{ background: ACCENT }}>
                    ★ Recomendado
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-4">
                    <p className="font-lato text-white/35 text-[12px] uppercase tracking-widest mb-1">{p.tag}</p>
                    <p className="font-poppins font-black text-white text-[2.2rem] leading-none">
                      {p.horas}<span className="font-lato font-normal text-white/40 text-[1rem]"> horas</span>
                    </p>
                    <p className="font-poppins font-black mt-2" style={{ color: p.destacado ? ACCENT : '#00bfa5', fontSize: '1.4rem' }}>
                      {p.precio}
                    </p>
                    <p className="font-lato text-white/30 text-[12px] mt-0.5">+ IVA</p>
                  </div>
                  <p className="font-lato text-white/45 text-[14px] leading-relaxed mb-4">{p.desc}</p>
                  <ul className="space-y-2 flex-1">
                    {p.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                        <span className="font-lato text-white/60 text-[14px] leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 mb-4"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="flex items-center gap-3 sm:flex-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}20` }}>
                <Clock className="w-4 h-4" style={{ color: ACCENT }} />
              </div>
              <div>
                <p className="font-poppins font-bold text-white/80 text-[16px]">Hora adicional</p>
                <p className="font-lato text-white/35 text-[13px]">Horas por encima del paquete contratado</p>
              </div>
            </div>
            <div>
              <p className="font-poppins font-black text-white text-[1.6rem]">
                $150.000 <span className="font-lato font-normal text-white/40 text-[1rem]">COP / hora</span>
              </p>
              <p className="font-lato text-white/30 text-[12px] mt-0.5">+ IVA</p>
            </div>
          </div>

          <div className="rounded-xl px-4 py-3 flex items-start gap-2.5"
            style={{ background: `${ACCENT}06`, border: `1px solid ${ACCENT}15` }}>
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: ACCENT }} />
            <p className="font-lato text-white/45 text-[13px] leading-relaxed">
              Las horas de cada paquete no vencen. Se consumen según el plan de trabajo acordado con el equipo de TuVivi y se reportan en detalle al cierre de cada sesión.
            </p>
          </div>
        </section>

        {/* 04 POR QUÉ SIXTEAM */}
        <section id="sixteam" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Por qué nosotros</TagLabel>
          <SectionTitle>Sixteam como socio estratégico</SectionTitle>
          <Rule />

          <div className="space-y-4 text-white/60 text-[19px] leading-relaxed mb-8">
            <p>
              Somos partner de HubSpot con <strong className="text-white/90 font-semibold">más de 4 años de experiencia en implementación estratégica avanzada de HubSpot</strong>, cubriendo todos sus hubs: Marketing, Sales, Service, CMS y Operations. Hemos acompañado empresas colombianas y clientes en el exterior desde la configuración inicial hasta la adopción plena del ecosistema.
            </p>
            <p>
              Nuestra propuesta de valor no es solo resolver tickets. Es <strong className="text-white/90 font-semibold">convertirnos en el equipo tecnológico estratégico de TuVivi</strong>: un equipo que entiende el negocio, conecta la tecnología con los procesos y acompaña la mejora continua desde una visión estratégica e innovadora, no solo técnica.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: Target,
                titulo: 'Diagnóstico antes de ejecutar',
                desc: 'Comenzamos por entender la configuración actual y el contexto del negocio antes de modificar cualquier flujo. Cada cambio responde a un análisis claro, no a una suposición.',
              },
              {
                icon: FileText,
                titulo: 'Reporte de horas consumidas',
                desc: 'Al cierre de cada sesión, el equipo recibe un detalle de exactamente qué se hizo, cuánto se consumió y cuál es el estado de cada entregable.',
              },
              {
                icon: TrendingUp,
                titulo: 'Mejora continua con visión estratégica',
                desc: 'No solo resolvemos lo urgente. Identificamos oportunidades de mejora continua para que HubSpot escale junto con la operación, siempre desde una perspectiva estratégica e innovadora.',
              },
            ].map(({ icon: Icon, titulo, desc }) => (
              <div key={titulo} className="rounded-xl p-5 flex flex-col gap-3"
                style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}20` }}>
                  <Icon className="w-4 h-4" style={{ color: ACCENT }} />
                </div>
                <p className="font-poppins font-bold text-white text-[16px] leading-tight">{titulo}</p>
                <p className="font-lato text-white/50 text-[14px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-6 sm:p-8"
            style={{ background: `linear-gradient(135deg, ${ACCENT}06, #00bfa508)`, border: `1px solid ${ACCENT}15` }}>
            <p className="font-poppins font-black text-white/85 text-[1.05rem] tracking-widest uppercase text-center mb-4">
              Process + Technology + People = <span style={{ color: ACCENT }}>Growth</span>
            </p>
            <p className="font-lato text-white/45 text-[16px] leading-relaxed text-center max-w-2xl mx-auto">
              Nuestra capacidad diferencial es integrar los <strong className="text-white/70">procesos</strong> de cada empresa con la <strong className="text-white/70">tecnología</strong> adecuada y acompañar a las <strong className="text-white/70">personas</strong> en su adopción real. No configuramos sistemas para que existan: los construimos para que el equipo los use, los entienda y los convierta en un motor de crecimiento sostenible.
            </p>
          </div>
        </section>

        {/* 05 VIGENCIA */}
        <section id="vigencia" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`scroll-mt-14 lg:scroll-mt-0 transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y Términos de la Propuesta</SectionTitle>
          <Rule />

          <div className="space-y-3">
            {[
              {
                titulo: 'Vigencia de la propuesta',
                desc: 'Esta propuesta tiene validez de 30 días calendario a partir de su fecha de envío. Transcurrido ese plazo, los valores podrán ser revisados.',
                icon: Calendar,
              },
              {
                titulo: 'Aprobación',
                desc: 'Para iniciar el servicio basta con la confirmación vía WhatsApp, correo o de forma verbal. Se habilitará el contrato a firmar y se acordará la primera sesión de trabajo.',
                icon: CheckCircle,
              },
              {
                titulo: 'Términos de pago',
                desc: 'El pago del paquete seleccionado se realiza de manera anticipada, previo al inicio de las sesiones de trabajo. No hay costos ocultos ni facturación adicional fuera de las horas extra consumidas.',
                icon: FileText,
              },
              {
                titulo: 'Consumo de horas',
                desc: 'Las horas del paquete no vencen. Se planifican en sesiones acordadas con el equipo y se reportan en detalle al cierre de cada jornada. Las horas adicionales se facturan por separado al valor acordado.',
                icon: Clock,
              },
              {
                titulo: 'Alcance del servicio',
                desc: 'El servicio cubre configuración, ajuste y optimización dentro del portal de HubSpot de TuVivi. No incluye el valor de licencias de HubSpot ni de integraciones de terceros.',
                icon: Info,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="rounded-xl p-4 sm:p-5 flex gap-4"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <Icon className="w-4 h-4 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-poppins font-semibold text-white/80 text-[17px] mb-1">{item.titulo}</p>
                    <p className="font-lato text-white/50 text-[17px] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      <footer style={{ background: 'linear-gradient(180deg, #04111f, #030d1a)' }}>
        <div className="relative overflow-hidden border-t" style={{ borderColor: `${ACCENT}18` }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full"
              style={{ background: `radial-gradient(circle, ${ACCENT}08, transparent 65%)`, transform: 'translate(30%,-30%)' }} />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-16 sm:py-20 text-center">
            <TagLabel>¿Avanzamos?</TagLabel>
            <h2 className="font-poppins font-black text-white mt-4 mb-4 leading-tight"
              style={{ fontSize: 'clamp(2.25rem, 6.25vw, 4rem)' }}>
              ¿Arrancamos con el soporte esta semana?
            </h2>
            <p className="font-lato text-white/50 max-w-md mx-auto mb-8 text-[18px] sm:text-xl leading-relaxed">
              Escríbenos para confirmar el paquete, los accesos al portal y la primera sesión de trabajo.
            </p>
            <div className="flex justify-center">
              <a href="https://wa.me/573004507102" target="_blank" rel="noopener noreferrer"
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
              <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-2">Contacto</p>
              <p className="font-lato text-white/35 text-[15px]">{META.correo}</p>
              <p className="font-lato text-white/35 text-[15px] mt-0.5">+57 300 4188522</p>
            </div>
            <div>
              <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-2">Representante Legal</p>
              <p className="font-lato text-white/35 text-[15px]">{META.rl}</p>
              <p className="font-lato text-white/25 text-[14px] mt-0.5">Barranquilla, Colombia</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
            <p className="font-lato text-white/20 text-[13px]">
              Propuesta confidencial preparada para {META.cliente} · {META.fecha} · Sixteam.pro · Uso interno
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default TuViviProposal;
