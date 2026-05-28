import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, ChevronRight, ChevronDown,
  Building2, Calendar, Hash, User, Info, MapPin, Mail,
  Target, Settings, MessageSquare, BarChart3, Monitor, Briefcase,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Stunet Education Agency',
  programa: 'Mi Primer Millón',
  sigla: 'MPM',
  sector: 'EdTech · Educación Financiera · Niños y Adolescentes',
  alcance: 'Colombia · Latinoamérica',
  fecha: 'Mayo 2026',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  dirigidoA: 'Miguel Illidge',
  elaboradaPor: 'Ernesto Hernandez',
  cargoElaborador: 'Gerente Comercial',
  objetivo:
    'Diseño e implementación del ecosistema de marketing y ventas digital para Mi Primer Millón: pauta digital, CRM con automatizaciones de fidelización y ventas, tres landing pages y agente IA de atención inicial. Todo conectado, todo trazable.',
};

const MPM_GOLD = '#d4af37';

// ─── COMPONENTES DEL ECOSISTEMA ──────────────────────────────────────────────

const COMPONENTES = [
  {
    id: 'pauta',
    num: '01',
    nombre: 'Pauta Digital',
    subtitulo: 'Meta Ads + CAPI',
    desc: 'Campañas en Meta Ads con audiencias de padres de alto poder adquisitivo. CAPI configurado para devolver eventos al servidor de Meta y entrenar el algoritmo con datos reales.',
    icon: Target,
    tint: 'blue',
    items: [
      'Estructura de campañas Tráfico → Conversión',
      'Audiencias por comportamiento (viajeros, ejecutivos)',
      'Audiencias personalizadas y similares (lookalike)',
      'CAPI — Conversions API de Meta integrada al CRM',
      'Píxel y Events Manager validados sin duplicados',
    ],
  },
  {
    id: 'crm',
    num: '02',
    nombre: 'CRM + Automatizaciones',
    subtitulo: 'Plataforma Sixteam · Pipeline + Flujos',
    desc: 'Sistema de gestión de leads y ventas con pipeline comercial, historial del prospecto, 1 flujo automatizado de fidelización y 1 flujo comercial, más reportería de rendimiento.',
    icon: BarChart3,
    tint: 'teal',
    items: [
      'Subaccount MPM configurado en Plataforma Sixteam',
      'Pipeline de ventas con etapas definidas',
      'Campos personalizados para datos del prospecto',
      '1 flujo automatizado para proceso de fidelización',
      '1 flujo automatizado para proceso comercial (ventas)',
      'Usuarios, roles y permisos del equipo',
    ],
  },
  {
    id: 'landings',
    num: '03',
    nombre: '3 Landing Pages',
    subtitulo: 'Captura · Ventas · Upsell',
    desc: 'Tres páginas construidas en Plataforma Sixteam con estructura orientada a conversión. El diseño se realiza con referencia aprobada por el cliente. El contenido debe ser proporcionado por el cliente.',
    icon: Monitor,
    tint: 'amber',
    items: [
      'Landing 1: Lead Magnet (captura de contactos)',
      'Landing 2: Página de ventas Plan Standard',
      'Landing 3: Upsell Plan Premium — 1 clic',
      'Thank You Page con instrucciones de acceso',
      'Integración formularios → CRM con todos los campos',
    ],
  },
  {
    id: 'agente-ia',
    num: '04',
    nombre: 'Agente IA Atención Inicial',
    subtitulo: 'Bot de ventas · Speed to Lead',
    desc: 'Agente de IA que responde al lead en los primeros 5 minutos, califica el prospecto, resuelve objeciones frecuentes y lo deriva al Student Coach cuando está listo para cerrar. Disponible 24/7 en WhatsApp.',
    icon: MessageSquare,
    tint: 'purple',
    items: [
      'Bot IA entrenado con el programa MPM y objeciones comunes',
      'Respuesta automática < 5 min tras captura del lead',
      'Flujo de calificación (edad del hijo, interés, presupuesto)',
      'Handoff bot → Student Coach con ficha completa del prospecto',
      'Recuperación de carrito abandonado (email + WhatsApp)',
      'Derivación directa a página de pago sin asesor intermediario',
    ],
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber:  { text: 'text-amber-400',   bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)'  },
  teal:   { text: 'text-[#00bfa5]',  bg: 'rgba(0,191,165,.07)',   border: 'rgba(0,191,165,.18)'   },
  blue:   { text: 'text-[#60a5fa]',  bg: 'rgba(96,165,250,.07)',  border: 'rgba(96,165,250,.18)'  },
  purple: { text: 'text-[#c084fc]',  bg: 'rgba(192,132,252,.07)', border: 'rgba(192,132,252,.18)' },
};

// ─── FASES ────────────────────────────────────────────────────────────────────

const FASES = [
  {
    num: 'Fase 1',
    nombre: 'Implementación de Pauta Digital',
    duracion: '1 semana',
    valor: 'COP 1.000.000',
    recomendada: true,
    icon: Target,
    tint: 'blue',
    entregables: [
      'Estructura de campañas Meta Ads (Tráfico → Conversión)',
      'Audiencias segmentadas por comportamiento de alto PA',
      'Audiencias personalizadas (visitantes, leads) y similares',
      'Implementación de CAPI (Conversions API)',
      'Validación en Events Manager sin duplicados',
      'Píxel configurado y verificado en el dominio del cliente',
    ],
    detalle: [
      'CAPI configurado dentro de Plataforma Sixteam: el CRM devuelve eventos de lead directamente al servidor de Meta. El algoritmo aprende de datos reales y mejora la calidad del tráfico en cada iteración.',
    ],
  },
  {
    num: 'Fase 2',
    nombre: 'Implementación de CRM + Automatizaciones',
    duracion: '1–2 semanas',
    valor: 'COP 3.400.000',
    recomendada: true,
    icon: BarChart3,
    tint: 'teal',
    entregables: [
      'Subaccount MPM configurado en Plataforma Sixteam',
      'Pipeline de ventas con etapas y responsables',
      'Campos personalizados para contactos (hasta 15)',
      'Automatizaciones de seguimiento: recordatorios, tareas, cambios de etapa',
      '1 flujo automatizado para proceso de fidelización',
      '1 flujo automatizado para proceso comercial (ventas)',
      'Usuarios, roles y permisos',
      'Capacitación funcional del equipo (hasta 2 horas)',
    ],
    detalle: [
      'Ambiente limpio y separado para Mi Primer Millón dentro de Plataforma Sixteam. Base sobre la que se construye el resto del ecosistema.',
      'Pipeline comercial con etapas definidas para el proceso de ventas del Student Coach — desde el primer contacto hasta la conversión.',
      '1 flujo automatizado para fidelización: secuencia de nurturing que mantiene activos a los prospectos en cada etapa del funnel. 1 flujo para el proceso comercial: recordatorios, seguimientos y reactivaciones que reducen la carga manual del equipo.',
    ],
  },
  {
    num: 'Fase 3',
    nombre: '3 Landing Pages',
    duracion: '2 semanas',
    valor: 'COP 1.200.000',
    recomendada: true,
    icon: Monitor,
    tint: 'amber',
    entregables: [
      'Landing 1: Lead Magnet (captura de contactos)',
      'Landing 2: Página de ventas Plan Standard + formulario',
      'Landing 3: Upsell Plan Premium — 1 clic',
      'Thank You Page con instrucciones de acceso',
      'Diseño con referencia aprobada por el cliente',
      'Contenido (textos e imágenes) aportado por el cliente',
    ],
    detalle: [
      'Las tres páginas se construyen en Plataforma Sixteam con estructura orientada a conversión. El diseño se realiza sobre una referencia aprobada en conjunto con el cliente.',
      'El contenido — textos, copy, imágenes, logotipos y videos — debe ser entregado por el cliente antes del inicio de esta fase. Sixteam monta y publica; no redacta el copy del programa.',
      'Cada landing queda conectada al CRM para trazabilidad completa desde el primer clic hasta la conversión.',
    ],
  },
  {
    num: 'Fase 4',
    nombre: 'Agente IA Conversacional — Atención Inicial',
    duracion: '1–2 semanas',
    valor: 'COP 800.000',
    recomendada: true,
    icon: MessageSquare,
    tint: 'purple',
    entregables: [
      'Bot IA entrenado con programa MPM y objeciones frecuentes',
      'Respuesta automática < 5 min tras captura del lead (WhatsApp)',
      'Flujo de calificación del prospecto (edad, interés, presupuesto)',
      'Derivación directa a página de pago sin asesor intermediario',
      'Handoff inteligente bot → Student Coach con ficha del lead',
      'Workflow de recuperación de carrito abandonado (email + WhatsApp)',
    ],
    detalle: [
      'El agente responde al lead en los primeros 5 minutos de forma personalizada. Cada minuto sin contacto reduce la tasa de cierre hasta un 80% — el bot garantiza la ventana crítica sin depender de la disponibilidad del equipo.',
      'El bot califica al prospecto (edad del hijo, nivel de interés, presupuesto estimado). Cuando el prospecto está listo, hace el handoff al Student Coach con toda la ficha completa.',
      'El workflow de recuperación se activa si el prospecto no completa la acción en 15 minutos — dispara email + WhatsApp de seguimiento de forma automática.',
    ],
  },
];

const SECCIONES = [
  { id: 'resumen',    label: 'Resumen'    },
  { id: 'ecosistema', label: 'Ecosistema' },
  { id: 'plan',       label: 'Plan'       },
  { id: 'cotizacion', label: 'Cotización' },
  { id: 'terminos',   label: 'Términos'   },
  { id: 'vigencia',   label: 'Vigencia'   },
];

const TOTAL_IMPL = 'COP 6.400.000';

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
  <span className="font-lato text-[#d4af37] text-[13px] uppercase tracking-[0.22em] font-medium">{children}</span>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-poppins font-extrabold text-white mt-2 mb-2 leading-tight"
    style={{ fontSize: 'clamp(1.8125rem, 4.375vw, 2.625rem)' }}>
    {children}
  </h2>
);

const Rule = () => (
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: 'linear-gradient(90deg,#1d70a2,#d4af37)' }} />
);

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────

const MpmProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [compActivo, setCompActivo] = useState<number | null>(null);
  const [faseActiva, setFaseActiva] = useState<number | null>(null);
  const [showCalc, setShowCalc] = useState(false);
  const [mensajesConv, setMensajesConv] = useState(6);
  const [leadesMes, setLeadesMes] = useState(300);

  const consumoIAUSD = (0.02 * mensajesConv * leadesMes).toFixed(2);

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

  return (
    <div id="proposal-root" className="min-h-screen overflow-x-hidden" style={{ background: '#030d1a', fontFamily: 'Lato, sans-serif' }}>

      {/* ── NAV LATERAL ─────────────────────────────────────────────────────── */}
      <nav className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-50 flex-col gap-3 no-print">
        {SECCIONES.map(s => (
          <button key={s.id} onClick={() => scrollTo(s.id)}
            className={`group flex items-center gap-2.5 transition-all duration-300 ${activeSection === s.id ? 'opacity-100' : 'opacity-25 hover:opacity-60'}`}>
            <span className={`font-lato text-[14px] text-white whitespace-nowrap transition-all duration-300 ${activeSection === s.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>
              {s.label}
            </span>
            <div className={`rounded-full flex-shrink-0 transition-all duration-300 ${activeSection === s.id ? 'w-2 h-2 bg-[#d4af37] shadow-[0_0_6px_rgba(212,175,55,.7)]' : 'w-1.5 h-1.5 bg-white/50'}`} />
          </button>
        ))}
      </nav>

      {/* ══════════════════════════════════════ PORTADA ══════════════════════ */}
      <header className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #030d1a 0%, #051428 55%, #061a30 100%)' }}>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,.05) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(29,112,162,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.018]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Lato:wght@300;400;500;700&display=swap');
          .font-poppins { font-family: 'Poppins', sans-serif; }
          .font-lato    { font-family: 'Lato', sans-serif;    }
          html { scroll-behavior: smooth; }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
          .fade-up   { animation: fadeUp .7s cubic-bezier(.16,1,.3,1) forwards; opacity: 0; }
          .fade-up-1 { animation-delay: .05s; }
          .fade-up-2 { animation-delay: .15s; }
          .fade-up-3 { animation-delay: .25s; }
          .fade-up-4 { animation-delay: .35s; }
          .fade-up-5 { animation-delay: .5s;  }
          input[type=range] { accent-color: #d4af37; }
        `}</style>

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-b" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-white flex items-center justify-center">
              <img src="/sixteam-logo.png" alt="Sixteam.pro" className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <div>
              <span className="font-poppins font-black text-white text-xl tracking-tight">Sixteam<span style={{ color: MPM_GOLD }}>.</span>pro</span>
              <p className="font-lato text-white/35 text-[13px] leading-none mt-0.5">Innovación y Estrategia Digital</p>
            </div>
          </div>
          <span className="font-lato text-[13px] uppercase tracking-[0.2em] border rounded-full px-3 py-1.5"
            style={{ color: 'rgba(212,175,55,.8)', borderColor: 'rgba(212,175,55,.2)' }}>
            Confidencial
          </span>
        </div>

        {/* Hero */}
        <div className="relative z-10 flex-1 flex items-center px-6 md:px-12 lg:px-20">
          <div className="w-full max-w-6xl mx-auto py-16 md:py-20 grid lg:grid-cols-2 gap-14 items-center">

            <div>
              <div className="fade-up fade-up-1 inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border"
                style={{ borderColor: 'rgba(212,175,55,.25)', background: 'rgba(212,175,55,.07)' }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: MPM_GOLD }} />
                <span className="font-lato text-[13px] uppercase tracking-[0.2em]" style={{ color: MPM_GOLD }}>
                  {META.programa} · {META.sigla}
                </span>
              </div>

              <h1 className="fade-up fade-up-2 font-poppins font-black text-white leading-[1.05] mb-5"
                style={{ fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)' }}>
                El ecosistema<br />
                <span style={{ background: `linear-gradient(90deg, ${MPM_GOLD}, #b8860b)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  que vende
                </span>
                <br />y escala.
              </h1>

              <p className="fade-up fade-up-3 font-lato text-white/55 leading-relaxed mb-8 max-w-lg"
                style={{ fontSize: 'clamp(.95rem, 1.8vw, 1.08rem)' }}>
                {META.objetivo}
              </p>

              <div className="fade-up fade-up-4 flex flex-wrap gap-3">
                <button onClick={() => scrollTo('ecosistema')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-poppins font-semibold text-white transition-all hover:scale-105"
                  style={{ background: `linear-gradient(90deg, #1d70a2, ${MPM_GOLD})`, boxShadow: `0 4px 24px rgba(212,175,55,.3)` }}>
                  Ver ecosistema <ChevronRight size={16} />
                </button>
                <button onClick={() => scrollTo('cotizacion')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-poppins font-semibold transition-all hover:scale-105"
                  style={{ border: '1px solid rgba(212,175,55,.3)', color: 'rgba(212,175,55,.9)', background: 'rgba(212,175,55,.06)' }}>
                  Ver cotización
                </button>
              </div>
            </div>

            {/* Mapa del ecosistema — 2×2 */}
            <div className="fade-up fade-up-5">
              <p className="font-lato text-white/30 text-[12px] uppercase tracking-wider mb-4">Componentes del ecosistema</p>
              <div className="grid grid-cols-2 gap-3">
                {COMPONENTES.map((c, i) => {
                  const Icon = c.icon;
                  const t = TINT[c.tint];
                  return (
                    <div key={i} className="rounded-xl p-4 border flex items-start gap-3 transition-all hover:scale-[1.02]"
                      style={{ background: t.bg, borderColor: t.border }}>
                      <Icon size={16} className={`${t.text} flex-shrink-0 mt-0.5`} />
                      <div>
                        <p className={`font-poppins font-bold text-[13px] ${t.text}`}>{c.num} {c.nombre}</p>
                        <p className="font-lato text-white/45 text-[11px] leading-snug mt-0.5">{c.subtitulo}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Metadatos */}
        <div className="relative z-10 px-6 md:px-12 lg:px-20 pb-10">
          <div className="max-w-6xl mx-auto flex flex-wrap gap-6 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
            {[
              { icon: Building2, label: 'Cliente',     val: META.cliente    },
              { icon: User,      label: 'Dirigida a',  val: META.dirigidoA  },
              { icon: Calendar,  label: 'Fecha',        val: META.fecha      },
              { icon: User,      label: 'RL',           val: META.rl         },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={14} className="text-white/30 flex-shrink-0" />
                <span className="font-lato text-white/30 text-[13px]">{label}:</span>
                <span className="font-lato text-white/60 text-[13px]">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════ RESUMEN ══════════════════════ */}
      <section id="resumen" ref={s1.ref as React.RefObject<HTMLElement>}
        className="px-6 md:px-12 lg:px-20 py-20 md:py-28 max-w-6xl mx-auto">
        <div className={`transition-all duration-700 ${s1.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Resumen Ejecutivo</TagLabel>
          <SectionTitle>¿Qué estamos construyendo?</SectionTitle>
          <Rule />

          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="font-lato text-white/65 leading-relaxed mb-5" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
                <strong className="text-white">Mi Primer Millón</strong> es el programa de educación financiera de Stunet Education Agency para niños y adolescentes. Sixteam.pro diseñará e implementará el ecosistema de marketing y ventas digital que lleva a MPM desde el primer anuncio hasta un prospecto calificado y en proceso de cierre.
              </p>
              <p className="font-lato text-white/65 leading-relaxed mb-8" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
                El ecosistema cubre los <strong className="text-white">4 componentes críticos</strong> del proceso: pauta digital con trazabilidad real, CRM con automatizaciones de fidelización y ventas, tres landing pages optimizadas y agente IA de atención inicial 24/7. Todo conectado, todo trazable.
              </p>

              {/* Flujo visual */}
              <div className="space-y-2">
                <p className="font-lato text-white/30 text-[12px] uppercase tracking-wider mb-3">Flujo del prospecto a la conversión</p>
                {[
                  { paso: 'Anuncio en Meta Ads',           sub: 'Audiencia de padres · alto PA'                    },
                  { paso: 'Lead Magnet',                   sub: 'Landing 1 · CRM recibe el contacto'              },
                  { paso: 'Agente IA responde < 5 min',   sub: 'WhatsApp · calificación inicial'                  },
                  { paso: 'Página de ventas · Upsell',    sub: 'Landing 2 y 3 · Formularios de conversión'        },
                  { paso: 'Fidelización y seguimiento',   sub: 'CRM · automatizaciones y reactivación'            },
                ].map(({ paso, sub }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 text-[11px] font-poppins font-black"
                        style={{ borderColor: 'rgba(212,175,55,.3)', background: 'rgba(212,175,55,.07)', color: MPM_GOLD }}>
                        {i + 1}
                      </div>
                      {i < 4 && <div className="w-px flex-1 mt-1" style={{ background: 'rgba(212,175,55,.12)', minHeight: 16 }} />}
                    </div>
                    <div className="pb-2">
                      <p className="font-poppins font-semibold text-white text-[14px]">{paso}</p>
                      <p className="font-lato text-white/40 text-[12px]">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ficha y estimado */}
            <div className="space-y-4">
              <div className="rounded-2xl p-6 border" style={{ background: 'rgba(212,175,55,.04)', borderColor: 'rgba(212,175,55,.15)' }}>
                <p className="font-lato text-white/40 text-[12px] uppercase tracking-wider mb-1">Propuesta para</p>
                <p className="font-poppins font-bold text-white text-xl">{META.cliente}</p>
                <p className="font-lato text-white/50 text-sm mt-1">Programa: {META.programa} ({META.sigla})</p>
                <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                  {[
                    { label: 'Dirigida a',   val: META.dirigidoA   },
                    { label: 'Sector',       val: META.sector       },
                    { label: 'Alcance',      val: META.alcance      },
                    { label: 'Fecha',        val: META.fecha        },
                    { label: 'Proponente',   val: META.proponente   },
                    { label: 'NIT',          val: META.nit          },
                    { label: 'Correo',       val: META.correo       },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex justify-between gap-4">
                      <span className="font-lato text-white/35 text-[13px]">{label}</span>
                      <span className="font-lato text-white/70 text-[13px] text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-5 border" style={{ background: 'rgba(255,255,255,.02)', borderColor: 'rgba(255,255,255,.07)' }}>
                <p className="font-lato text-white/40 text-[12px] uppercase tracking-wider mb-3">Inversión estimada</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-lato text-white/60 text-sm">Implementaciones (pago único)</span>
                    <span className="font-poppins font-bold text-white">{TOTAL_IMPL}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-lato text-white/60 text-sm">CRM mensual</span>
                    <span className="font-poppins font-bold text-white">COP 890.000 + IA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-lato text-white/60 text-sm">Pauta Digital mensual</span>
                    <span className="font-poppins font-bold text-white">COP 800.000 + 10%</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                    <span className="font-lato text-white/50 text-sm">Soporte y Operaciones</span>
                    <span className="font-poppins font-bold" style={{ color: MPM_GOLD }}>COP 1.200.000/mes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ ECOSISTEMA ═══════════════════ */}
      <section id="ecosistema" ref={s2.ref as React.RefObject<HTMLElement>}
        className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Ecosistema Digital</TagLabel>
          <SectionTitle>Los 4 componentes del sistema</SectionTitle>
          <Rule />

          <p className="font-lato text-white/55 leading-relaxed mb-10 max-w-3xl" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
            Cada componente cumple un rol específico en el ciclo de captación y conversión. Juntos forman un sistema que opera con mínima intervención manual en los puntos críticos.
          </p>

          <div className="space-y-4">
            {COMPONENTES.map((c, i) => {
              const Icon = c.icon;
              const t = TINT[c.tint];
              const open = compActivo === i;
              return (
                <div key={i} className="rounded-2xl border overflow-hidden transition-all"
                  style={{ borderColor: open ? t.border : 'rgba(255,255,255,.07)', background: open ? t.bg : 'rgba(255,255,255,.02)' }}>
                  <button className="w-full flex items-center gap-4 px-6 py-5 text-left"
                    onClick={() => setCompActivo(open ? null : i)}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border"
                      style={{ background: open ? t.bg : 'rgba(255,255,255,.04)', borderColor: open ? t.border : 'rgba(255,255,255,.08)' }}>
                      <Icon size={18} className={t.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className={`font-poppins font-black text-[13px] ${t.text}`}>{c.num}</span>
                        <span className="font-poppins font-bold text-white text-[16px]">{c.nombre}</span>
                        <span className={`font-lato text-[12px] ${t.text} opacity-60`}>· {c.subtitulo}</span>
                      </div>
                      <p className="font-lato text-white/45 text-sm truncate">{c.desc}</p>
                    </div>
                    <ChevronDown size={18} className={`text-white/40 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                  </button>

                  {open && (
                    <div className="px-6 pb-6 grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="font-lato text-white/40 text-[12px] uppercase tracking-wider mb-3">Descripción</p>
                        <p className="font-lato text-white/65 text-sm leading-relaxed">{c.desc}</p>
                      </div>
                      <div>
                        <p className="font-lato text-white/40 text-[12px] uppercase tracking-wider mb-3">Incluye</p>
                        <div className="space-y-2">
                          {c.items.map((item, j) => (
                            <div key={j} className="flex items-start gap-2">
                              <CheckCircle size={13} className={`${t.text} flex-shrink-0 mt-0.5`} />
                              <span className="font-lato text-white/65 text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ PLAN ═════════════════════════ */}
      <section id="plan" ref={s3.ref as React.RefObject<HTMLElement>}
        className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Plan de Trabajo</TagLabel>
          <SectionTitle>Fases de implementación</SectionTitle>
          <Rule />

          <p className="font-lato text-white/55 leading-relaxed mb-10 max-w-3xl" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
            Las 4 fases se implementan de forma consecutiva en un plazo estimado de <strong className="text-white">5–7 semanas</strong>, con kick-off en los 3 días hábiles siguientes al pago de la primera fase.
          </p>

          <div className="space-y-4">
            {FASES.map((fase, i) => {
              const Icon = fase.icon;
              const t = TINT[fase.tint];
              const open = faseActiva === i;
              return (
                <div key={i} className="rounded-2xl overflow-hidden border transition-all"
                  style={{
                    borderColor: open ? t.border : 'rgba(255,255,255,.07)',
                    background: open ? t.bg : 'rgba(255,255,255,.02)',
                  }}>
                  <button className="w-full flex items-center gap-4 px-6 py-5 text-left"
                    onClick={() => setFaseActiva(open ? null : i)}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border"
                      style={{ background: open ? t.bg : 'rgba(255,255,255,.04)', borderColor: open ? t.border : 'rgba(255,255,255,.08)' }}>
                      <Icon size={18} className={open ? t.text : 'text-white/40'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`font-poppins font-black text-[13px] ${t.text}`}>{fase.num}</span>
                        <span className="font-poppins font-bold text-white">{fase.nombre}</span>
                        {fase.recomendada && (
                          <span className={`font-lato text-[11px] px-2 py-0.5 rounded-full border ${t.text}`}
                            style={{ borderColor: t.border, background: t.bg }}>
                            Core
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <span className="font-lato text-white/40 text-[13px] flex items-center gap-1">
                          <Calendar size={12} /> {fase.duracion}
                        </span>
                        <span className={`font-poppins font-bold text-[13px] ${t.text}`}>{fase.valor}</span>
                        <span className="font-lato text-white/35 text-[13px]">Pago único</span>
                      </div>
                    </div>
                    <ChevronDown size={18} className={`text-white/40 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                  </button>

                  {open && (
                    <div className="px-6 pb-6 grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="font-lato text-white/40 text-[12px] uppercase tracking-wider mb-3">Entregables</p>
                        <div className="space-y-2">
                          {fase.entregables.map((e, j) => (
                            <div key={j} className="flex items-start gap-2">
                              <CheckCircle size={13} className={`${t.text} flex-shrink-0 mt-0.5`} />
                              <span className="font-lato text-white/65 text-sm">{e}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-lato text-white/40 text-[12px] uppercase tracking-wider mb-3">Detalle técnico</p>
                        <div className="space-y-3">
                          {fase.detalle.map((d, j) => (
                            <div key={j} className="flex items-start gap-2">
                              <ChevronRight size={13} className={`${t.text} opacity-60 flex-shrink-0 mt-0.5`} />
                              <p className="font-lato text-white/50 text-sm leading-relaxed">{d}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Timeline visual */}
          <div className="mt-10 rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,.02)', borderColor: 'rgba(255,255,255,.07)' }}>
            <p className="font-lato text-white/40 text-[12px] uppercase tracking-wider mb-5">Cronograma estimado</p>
            <div className="flex items-start gap-0 overflow-x-auto pb-2">
              {FASES.map((fase, i) => {
                const t = TINT[fase.tint];
                const dotColor = t.text.includes('60a5fa') ? '#60a5fa' : t.text.includes('00bfa5') ? '#00bfa5' : t.text.includes('fbbf24') || t.text.includes('amber') ? '#fbbf24' : '#c084fc';
                return (
                  <React.Fragment key={i}>
                    <div className="flex flex-col items-center min-w-[110px] flex-shrink-0">
                      <div className="w-3 h-3 rounded-full flex-shrink-0 mb-2" style={{ background: dotColor }} />
                      <p className="font-poppins font-bold text-[11px] text-white/70 text-center">{fase.num}</p>
                      <p className="font-lato text-[10px] text-white/35 text-center mt-0.5">{fase.duracion}</p>
                    </div>
                    {i < FASES.length - 1 && (
                      <div className="flex-1 h-px mt-1.5 mx-1" style={{ background: 'rgba(255,255,255,.1)', minWidth: 20 }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ COTIZACIÓN ═══════════════════ */}
      <section id="cotizacion" ref={s4.ref as React.RefObject<HTMLElement>}
        className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Cotización</TagLabel>
          <SectionTitle>Inversión por componente</SectionTitle>
          <Rule />

          <div className="grid md:grid-cols-2 gap-5 mb-6">

            {/* Bloque 1: Implementaciones únicas */}
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,.08)' }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,.06)', background: 'rgba(255,255,255,.03)' }}>
                <p className="font-lato text-white/45 text-[12px] uppercase tracking-wider">Implementación</p>
                <p className="font-lato text-white/30 text-[11px]">Pago único por fase</p>
              </div>
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
                {[
                  { comp: '01 Pauta Digital',          label: 'Configuración Meta Ads + CAPI',      val: 'COP 1.000.000', t: 'blue'   },
                  { comp: '02 CRM + Automatizaciones', label: 'Pipeline + 2 flujos automatizados',  val: 'COP 3.400.000', t: 'teal'   },
                  { comp: '03 Landing Pages',          label: '3 páginas con diseño ref.',           val: 'COP 1.200.000', t: 'amber'  },
                  { comp: '04 Agente IA Atención',     label: 'Bot conversacional WhatsApp',         val: 'COP 800.000',   t: 'purple' },
                ].map(({ comp, label, val, t }) => (
                  <div key={comp} className="px-5 py-3 flex items-start justify-between gap-2 hover:bg-white/[0.015] transition-colors">
                    <div>
                      <p className={`font-poppins font-bold text-[12px] ${TINT[t].text}`}>{comp}</p>
                      <p className="font-lato text-white/40 text-[11px]">{label}</p>
                    </div>
                    <span className="font-poppins font-bold text-white text-[13px] flex-shrink-0">{val}</span>
                  </div>
                ))}
                <div className="px-5 py-3 flex justify-between items-center" style={{ background: 'rgba(212,175,55,.05)' }}>
                  <span className="font-poppins font-black text-white text-[13px]">Total implementación</span>
                  <span className="font-poppins font-black" style={{ color: MPM_GOLD }}>{TOTAL_IMPL}</span>
                </div>
              </div>
            </div>

            {/* Bloque 2: Costos mensuales recurrentes */}
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(0,191,165,.2)' }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: 'rgba(0,191,165,.1)', background: 'rgba(0,191,165,.04)' }}>
                <p className="font-lato text-[#00bfa5] text-[12px] uppercase tracking-wider">Mensual recurrente</p>
                <p className="font-lato text-white/30 text-[11px]">Costo operativo continuo</p>
              </div>
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,.04)' }}>

                {/* CRM */}
                <div className="px-5 py-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="font-poppins font-bold text-[12px] text-[#00bfa5]">Plataforma CRM</p>
                      <p className="font-lato text-white/40 text-[11px]">Hasta 3 usuarios · 1 número WhatsApp conectado</p>
                    </div>
                    <span className="font-poppins font-bold text-white text-[13px] flex-shrink-0">COP 890.000</span>
                  </div>
                  {/* Calculadora IA */}
                  <button
                    onClick={() => setShowCalc(!showCalc)}
                    className="flex items-center gap-1.5 mt-2 transition-opacity hover:opacity-80"
                    style={{ color: 'rgba(212,175,55,.7)' }}>
                    <span className="font-lato text-[11px]">+ consumo mensual por uso de IA</span>
                    <ChevronDown size={12} className={`transition-transform ${showCalc ? 'rotate-180' : ''}`} />
                  </button>
                  {showCalc && (
                    <div className="mt-3 p-3 rounded-xl border" style={{ background: 'rgba(212,175,55,.04)', borderColor: 'rgba(212,175,55,.15)' }}>
                      <p className="font-lato text-white/45 text-[11px] mb-3 uppercase tracking-wider">Calculadora de consumo de IA</p>

                      <div className="space-y-3 mb-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="font-lato text-white/35 text-[11px]">Mensajes promedio por conversación</span>
                            <span className="font-poppins font-bold text-white text-[12px]">{mensajesConv}</span>
                          </div>
                          <input
                            type="range" min={1} max={12} step={1}
                            value={mensajesConv}
                            onChange={e => setMensajesConv(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="font-lato text-white/35 text-[11px]">Leads promedio por mes</span>
                            <span className="font-poppins font-bold text-white text-[12px]">{leadesMes}</span>
                          </div>
                          <input
                            type="range" min={50} max={2000} step={50}
                            value={leadesMes}
                            onChange={e => setLeadesMes(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: 'rgba(212,175,55,.12)' }}>
                        <div>
                          <span className="font-lato text-white/40 text-[11px]">Consumo estimado</span>
                          <p className="font-lato text-white/25 text-[10px] mt-0.5">USD 0,02 × {mensajesConv} msg × {leadesMes} leads</p>
                        </div>
                        <span className="font-poppins font-bold text-[14px]" style={{ color: MPM_GOLD }}>
                          ≈ USD {consumoIAUSD}/mes
                        </span>
                      </div>
                      <p className="font-lato text-white/25 text-[10px] mt-2 leading-relaxed">
                        Estimación referencial a USD 0,02 por mensaje. El consumo real varía según el volumen de leads y la duración de las conversaciones.
                      </p>
                    </div>
                  )}
                </div>

                {/* Pauta */}
                <div className="px-5 py-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-poppins font-bold text-[12px] text-[#60a5fa]">Servicio de Pauta Digital</p>
                      <p className="font-lato text-white/40 text-[11px]">Gestión asesorada Meta Ads · fee fijo + variable</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-poppins font-bold text-white text-[13px] block">COP 800.000</span>
                      <span className="font-lato text-white/35 text-[11px]">+ 10% inversión en pauta</span>
                    </div>
                  </div>
                </div>

                {/* Soporte */}
                <div className="px-5 py-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-poppins font-bold text-[12px] text-amber-400">Soporte y Operaciones</p>
                      <p className="font-lato text-white/40 text-[11px]">Mejora continua · hasta 10 horas/mes</p>
                    </div>
                    <span className="font-poppins font-bold text-white text-[13px] flex-shrink-0">COP 1.200.000</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                    {[
                      'Arreglo de errores y configuraciones',
                      'Levantamiento de oportunidades de mejora',
                      'Capacitación al equipo en el uso de herramientas',
                      'Apoyo en operación del sistema',
                    ].map(item => (
                      <div key={item} className="flex items-start gap-1.5">
                        <CheckCircle size={11} className="text-amber-400 flex-shrink-0 mt-0.5" />
                        <span className="font-lato text-white/40 text-[11px] leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-5 py-3 flex justify-between items-center" style={{ background: 'rgba(0,191,165,.05)' }}>
                  <span className="font-poppins font-black text-white text-[13px]">Base mensual</span>
                  <div className="text-right">
                    <span className="font-poppins font-black text-[#00bfa5] block">COP 2.890.000</span>
                    <span className="font-lato text-white/30 text-[10px]">+ consumo IA + % pauta variable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nota */}
          <div className="rounded-xl px-5 py-4 border flex items-start gap-3"
            style={{ background: 'rgba(255,255,255,.02)', borderColor: 'rgba(255,255,255,.07)' }}>
            <Info size={15} className="text-white/30 flex-shrink-0 mt-0.5" />
            <p className="font-lato text-white/45 text-sm leading-relaxed">
              Los valores no incluyen IVA (19%). Las licencias de Plataforma Sixteam y el presupuesto de pauta de Meta Ads son costos operativos del cliente, no incluidos en esta propuesta. Cada fase se contrata y paga de forma independiente al inicio de la misma. El servicio de Soporte y Operaciones se activa una vez finalizada la implementación.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ TÉRMINOS ═════════════════════ */}
      <section id="terminos" ref={s5.ref as React.RefObject<HTMLElement>}
        className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Condiciones comerciales</TagLabel>
          <SectionTitle>Términos y Condiciones</SectionTitle>
          <Rule />

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                num: '01',
                titulo: 'Vigencia de la propuesta',
                texto: 'Esta propuesta tiene validez de 30 días calendario a partir de su fecha de emisión. Transcurrido ese plazo sin confirmación por escrito, Sixteam.pro se reserva el derecho de actualizar los valores y condiciones.',
              },
              {
                num: '02',
                titulo: 'Forma de pago',
                texto: 'Cada fase se factura y cancela al inicio de la misma mediante transferencia bancaria o PSE a nombre de Sixteam Innovación y Estrategia Digital S.A.S. NIT 901.967.849-4. Los servicios mensuales se facturan al inicio de cada período.',
              },
              {
                num: '03',
                titulo: 'Alcance y entregables',
                texto: 'El alcance de esta propuesta se limita a los entregables descritos en cada fase. Cualquier ajuste, adición o modificación fuera del alcance acordado será cotizado por separado y aprobado por escrito antes de su ejecución.',
              },
              {
                num: '04',
                titulo: 'Responsabilidades del cliente',
                texto: 'El cliente se compromete a: (a) designar un punto de contacto para la coordinación, (b) aprobar entregables en máximo 5 días hábiles desde su presentación, (c) suministrar accesos, contenidos e información necesaria al inicio de cada fase. Los retrasos en estas responsabilidades pueden afectar los plazos de implementación.',
              },
              {
                num: '05',
                titulo: 'Confidencialidad',
                texto: 'La información compartida entre las partes en el marco de esta propuesta y su ejecución se considera confidencial. Ambas partes se comprometen a no divulgar información sensible del negocio a terceros sin autorización escrita previa.',
              },
              {
                num: '06',
                titulo: 'Propiedad intelectual',
                texto: 'Una vez canceladas todas las fases contratadas, los entregables producidos — landing pages, configuraciones del CRM, flujos de automatización y agente IA — son propiedad del cliente. Sixteam.pro retiene el derecho de referenciar el proyecto en su portafolio con autorización del cliente.',
              },
              {
                num: '07',
                titulo: 'Cancelación y suspensión',
                texto: 'La cancelación de un servicio mensual debe notificarse con 15 días calendario de anticipación. Las fases de implementación canceladas después de iniciadas no son reembolsables; los avances realizados hasta la fecha de cancelación serán entregados al cliente.',
              },
              {
                num: '08',
                titulo: 'Modificaciones al alcance',
                texto: 'Cualquier solicitud de cambio fuera del alcance acordado generará una cotización adicional aprobada por escrito antes de su ejecución. Sixteam.pro se reserva el derecho de ajustar los plazos si los cambios impactan la planificación del proyecto.',
              },
            ].map(({ num, titulo, texto }) => (
              <div key={num} className="rounded-2xl p-5 border flex items-start gap-4"
                style={{ background: 'rgba(255,255,255,.02)', borderColor: 'rgba(255,255,255,.07)' }}>
                <span className="font-poppins font-black text-[13px] flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center"
                  style={{ color: MPM_GOLD, borderColor: 'rgba(212,175,55,.25)', background: 'rgba(212,175,55,.06)' }}>
                  {num}
                </span>
                <div>
                  <p className="font-poppins font-bold text-white text-[14px] mb-1">{titulo}</p>
                  <p className="font-lato text-white/50 text-sm leading-relaxed">{texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ VIGENCIA ═════════════════════ */}
      <section id="vigencia" ref={s6.ref as React.RefObject<HTMLElement>}
        className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Vigencia y Cierre</TagLabel>
          <SectionTitle>¿Cuándo empezamos?</SectionTitle>
          <Rule />

          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="font-lato text-white/65 leading-relaxed mb-6" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
                Esta propuesta tiene una vigencia de <strong className="text-white">30 días calendario</strong> a partir de su fecha de emisión, hasta el <strong className="text-white">26 de junio de 2026</strong>.
              </p>
              <p className="font-lato text-white/65 leading-relaxed mb-8" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
                Para iniciar: (1) confirmación de las fases a contratar, (2) firma del acuerdo de servicios, (3) pago de la Fase 1. La implementación arranca en los 3 días hábiles siguientes al pago.
              </p>

              <div className="space-y-3">
                {[
                  { paso: '01', label: 'Confirmar fases a contratar' },
                  { paso: '02', label: 'Firma del acuerdo de servicios' },
                  { paso: '03', label: 'Pago de la Fase 1' },
                  { paso: '04', label: 'Kick-off en ≤ 3 días hábiles' },
                ].map(({ paso, label }) => (
                  <div key={paso} className="flex items-center gap-3">
                    <span className="font-poppins font-black text-[13px] w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0"
                      style={{ color: MPM_GOLD, borderColor: 'rgba(212,175,55,.3)', background: 'rgba(212,175,55,.06)' }}>
                      {paso}
                    </span>
                    <span className="font-lato text-white/65 text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl p-6 border" style={{ background: 'rgba(212,175,55,.04)', borderColor: 'rgba(212,175,55,.15)' }}>
                <p className="font-lato text-white/40 text-[12px] uppercase tracking-wider mb-4">Información de la propuesta</p>

                <div className="space-y-3">
                  <div>
                    <p className="font-lato text-white/30 text-[11px] uppercase tracking-wider mb-0.5">Dirigida a</p>
                    <p className="font-poppins font-bold text-white text-base">{META.dirigidoA}</p>
                    <p className="font-lato text-white/45 text-sm">{META.cliente}</p>
                  </div>
                  <div className="pt-3 border-t border-white/5">
                    <p className="font-lato text-white/30 text-[11px] uppercase tracking-wider mb-0.5">Elaborada por</p>
                    <p className="font-poppins font-bold text-white text-base">{META.elaboradaPor}</p>
                    <p className="font-lato text-white/45 text-sm">{META.cargoElaborador} · {META.proponente}</p>
                  </div>
                  <div className="pt-3 border-t border-white/5">
                    <p className="font-lato text-white/30 text-[11px] uppercase tracking-wider mb-0.5">Representante Legal</p>
                    <p className="font-poppins font-bold text-white text-base">{META.rl}</p>
                    <p className="font-lato text-white/45 text-sm">{META.proponente}</p>
                  </div>
                  <div className="pt-3 border-t border-white/5 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-white/30" />
                      <span className="font-lato text-white/60 text-sm">{META.correo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash size={14} className="text-white/30" />
                      <span className="font-lato text-white/60 text-sm">NIT {META.nit}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ FOOTER ═══════════════════════ */}
      <footer className="px-6 md:px-12 lg:px-20 py-10 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                <img src="/sixteam-logo.png" alt="Sixteam.pro" className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <span className="font-poppins font-black text-white text-lg">Sixteam<span style={{ color: MPM_GOLD }}>.</span>pro</span>
            </div>
            <p className="font-lato text-white/25 text-[13px] text-center">
              Propuesta confidencial · {META.cliente} · {META.programa} · {META.fecha}
            </p>
            <p className="font-lato text-white/25 text-[13px]">Process + Technology + People = Growth</p>
          </div>
          <div className="pt-5 border-t flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
            <p className="font-lato text-white/20 text-[12px]">
              Propuesta elaborada por <span className="text-white/40">{META.elaboradaPor}</span> · {META.cargoElaborador}
            </p>
            <p className="font-lato text-white/20 text-[12px]">
              Dirigida a <span className="text-white/40">{META.dirigidoA}</span> · {META.cliente}
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default MpmProposal;
