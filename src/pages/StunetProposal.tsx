import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap, BarChart3,
  MessageSquare, AlertCircle, TrendingUp, Mail, ArrowRight, Building2,
  Calendar, Hash, User, Info, X, Globe, GraduationCap, MapPin, Home,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PDFButton from '../components/PDFButton';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Stunet Education Agency',
  tagline: 'Growing Together',
  sector: 'Agencia de educación internacional',
  fundada: '2019',
  sede: 'Sydney, Australia · Bogotá & Barranquilla, Colombia',
  fecha: 'Marzo 2026',
  lugar: 'Barranquilla, Colombia',
  destinos: ['Australia', 'Canadá', 'Reino Unido', 'España', 'Malta', 'Nueva Zelanda'],
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  objetivo: 'Optimizar la captación, atención y conversión de leads de estudiantes interesados en estudiar en el exterior, priorizando pauta digital, respuesta inmediata y automatización comercial.',
};

const STUNET_RED   = '#dd3333';
const STUNET_BLUE  = '#0170B9';
const STUNET_GOLD  = '#ffe628';

const HALLAZGOS = [
  { titulo: 'Mercado México con fricción de contacto', desc: 'Leads mexicanos rechazan llamadas desde números colombianos — se requiere estrategia de contacto local o WhatsApp-first.', icon: AlertCircle, tint: 'amber' },
  { titulo: 'Pauta activa sin conversión optimizada', desc: '~COP 800.000/semana en Meta Ads · 14–15 leads/día · pero la tasa de cierre a matrícula es baja y sin trazabilidad clara.', icon: TrendingUp, tint: 'teal' },
  { titulo: 'Respuesta inicial lenta al prospecto', desc: 'El flujo post-lead no está automatizado: el primer contacto depende del disponibilidad manual del asesor, generando pérdida de interés.', icon: Zap, tint: 'blue' },
  { titulo: 'Stack tecnológico sin integrar', desc: 'Meta Ads, WhatsApp, CRM y herramientas de IA operan en silos — no hay trazabilidad del lead desde pauta hasta matrícula.', icon: BarChart3, tint: 'teal' },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber: { text: 'text-amber-400', bg: 'rgba(251,191,36,.07)', border: 'rgba(251,191,36,.18)' },
  teal:  { text: 'text-[#00bfa5]', bg: 'rgba(0,191,165,.07)',  border: 'rgba(0,191,165,.18)'  },
  blue:  { text: 'text-[#60a5fa]', bg: 'rgba(96,165,250,.07)', border: 'rgba(96,165,250,.18)' },
  red:   { text: 'text-[#f87171]', bg: 'rgba(221,51,51,.07)',   border: 'rgba(221,51,51,.2)'   },
};

const FASES = [
  {
    num: 'Fase 1', nombre: 'Diagnóstico y optimización inicial de pauta',
    duracion: '2 semanas', valor: 'COP 1.800.000', pago: '50% inicio · 50% entrega',
    recomendada: true, icon: FileText,
    entregables: ['Auditoría de Meta Ads y creativos', 'Revisión de formularios y segmentación', 'Criterios de calificación de leads', 'Propuesta de ajustes y quick wins', 'Ruta de captura y seguimiento'],
    detalle: ['Auditoría de campañas, formularios, segmentación y creativos actuales.', 'Revisión del recorrido del lead desde Meta hasta el punto de contacto.', 'Definición de variables mínimas de calificación y propuesta de mejora.', 'Documento de hallazgos, quick wins y roadmap inmediato.'],
  },
  {
    num: 'Fase 2', nombre: 'Arquitectura de atención inicial de leads',
    duracion: '2 semanas', valor: 'COP 2.400.000', pago: '50% inicio · 50% entrega',
    recomendada: false, icon: MessageSquare,
    entregables: ['Flujo post-lead hasta asesor', 'Canales prioritarios de contacto', 'Estrategia anti-rechazo por origen', 'Guiones y reglas de asignación', 'Blueprint de automatización'],
    detalle: ['Diseño del flujo ideal desde que entra el lead hasta que pasa al asesor.', 'Canal prioritario: WhatsApp, llamada, agente o combinación.', 'Propuesta para minimizar rechazo por origen del contacto.', 'Estructura de mensajes, guiones y reglas de asignación.'],
  },
  {
    num: 'Fase 3', nombre: 'Automatizaciones comerciales prioritarias',
    duracion: '2–3 semanas', valor: 'COP 3.800.000', pago: '50% inicio · 50% entrega',
    recomendada: false, icon: Zap,
    entregables: ['Automatizaciones críticas implementadas', 'Integración formularios + CRM + WhatsApp', 'Pruebas de atención automatizada', 'Agente de voz/WhatsApp IA (según viabilidad)', 'Capacitación operativa'],
    detalle: ['Implementación técnica de las automatizaciones de mayor impacto.', 'Integraciones entre formularios, CRM, WhatsApp y herramientas auxiliares.', 'Pruebas controladas de atención automatizada inicial.', 'Capacitación breve al equipo para uso operativo del flujo.'],
  },
  {
    num: 'Fase 4', nombre: 'Estructura CRM, reporting y escalamiento',
    duracion: '2–3 semanas', valor: 'COP 3.200.000', pago: '50% inicio · 50% entrega',
    recomendada: false, icon: BarChart3,
    entregables: ['Embudo comercial diseñado/depurado', 'Propiedades, estados y trazabilidad', 'Paneles e indicadores configurados', 'Acompañamiento de estabilización', 'Base para expansión futura'],
    detalle: ['Diseño o depuración de embudo comercial.', 'Propiedades, estados, tareas y trazabilidad mínima obligatoria.', 'Configuración de paneles e indicadores operativos.', 'Acompañamiento inicial de estabilización y mejoras.'],
  },
];

const KPIS = [
  { indicador: 'Tiempo de primer contacto al lead', uso: 'Minutos desde que llega el formulario de Meta hasta el primer mensaje de un asesor Stunet.', meta: '< 5 min' },
  { indicador: '% leads contactados < 5 min', uso: 'Indicador clave de respuesta: cuántos prospectos reciben atención antes de perder interés.', meta: '> 80%' },
  { indicador: '% leads calificados (perfil viaje)', uso: 'Del total de leads, cuántos cumplen perfil real de candidato a estudiar en el exterior.', meta: 'Tendencia ↑' },
  { indicador: 'Tasa de agendamiento a asesoría', uso: 'De los leads contactados, cuántos avanzan a una sesión de orientación con asesor.', meta: 'Tendencia ↑' },
  { indicador: 'Tasa de asistencia a la asesoría', uso: 'Calidad del agendamiento: confirmaciones automáticas vía WhatsApp reducen no-shows.', meta: '> 70%' },
  { indicador: 'Costo por estudiante matriculado', uso: 'Métrica final de ROI: inversión total en pauta ÷ matrículas efectivas generadas.', meta: 'Reducción ↓' },
];

const EXCLUSIONES = [
  'Inversión publicitaria en Meta, Google u otros canales.',
  'Licencias de CRM, GoHighLevel, Brevo, herramientas de IA, WhatsApp API o plataformas de terceros.',
  'Rediseño completo de página web ni producción audiovisual profesional.',
  'Tiempos condicionados al acceso oportuno a cuentas, activos y responsables internos.',
  'Resultados comerciales dependientes de la capacidad del equipo para atender y cerrar.',
];

const SECCIONES = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'objetivo', label: 'Objetivo' },
  { id: 'plan', label: 'Plan de trabajo' },
  { id: 'cotizacion', label: 'Cotización' },
  { id: 'alcance', label: 'Alcance' },
  { id: 'kpis', label: 'KPIs' },
  { id: 'recomendacion', label: 'Recomendación' },
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
  <span className="font-lato text-[#00bfa5] text-[10px] uppercase tracking-[0.22em] font-medium">{children}</span>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-poppins font-extrabold text-white mt-2 mb-2 leading-tight"
    style={{ fontSize: 'clamp(1.45rem, 3.5vw, 2.1rem)' }}>
    {children}
  </h2>
);

const Rule = () => (
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)' }} />
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const StunetProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [faseActiva, setFaseActiva] = useState<number | null>(null);

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
  const s4 = useVisible(); const s5 = useVisible(); const s6 = useVisible(); const s7 = useVisible();

  return (
    <div id="proposal-root" className="min-h-screen overflow-x-hidden" style={{ background: '#030d1a', fontFamily: 'Lato, sans-serif' }}>

      {/* ── NAV LATERAL ─ solo lg ── */}
      <nav className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-50 flex-col gap-3 no-print">
        {SECCIONES.map(s => (
          <button key={s.id} onClick={() => scrollTo(s.id)}
            className={`group flex items-center gap-2.5 transition-all duration-300 ${activeSection === s.id ? 'opacity-100' : 'opacity-25 hover:opacity-60'}`}>
            <span className={`font-lato text-[11px] text-white whitespace-nowrap transition-all duration-300 ${activeSection === s.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>
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
            style={{ background: 'radial-gradient(circle, rgba(0,191,165,.06) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(29,112,162,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        </div>

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-b" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1d70a2,#00bfa5)' }}>
              <span className="font-poppins font-black text-white text-xs">S</span>
            </div>
            <div>
              <span className="font-poppins font-black text-white text-base tracking-tight">Sixteam<span className="text-[#00bfa5]">.</span>pro</span>
              <p className="font-lato text-white/35 text-[10px] leading-none mt-0.5">Innovación y Estrategia Digital</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* PDF export button */}
            <PDFButton
              filename="Propuesta-Stunet-Sixteam.pdf"
              elementId="proposal-root"
              label="Exportar PDF"
              className="no-print"
            />
            <Link to="/" className="no-print p-2 rounded-lg transition-colors hover:bg-white/5" title="Volver al inicio">
              <Home size={15} color="rgba(255,255,255,0.4)" />
            </Link>
            <span className="font-lato text-[#00bfa5]/80 text-[10px] uppercase tracking-[0.2em] border border-[#00bfa5]/20 rounded-full px-3 py-1.5">
              Confidencial
            </span>
          </div>
        </div>

        {/* Cuerpo portada: split layout */}
        <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 px-6 py-12 md:px-12 items-center">

          {/* — Izquierda: texto — */}
          <div className="flex flex-col justify-center max-w-lg">
            <TagLabel>Propuesta de trabajo y cotización</TagLabel>
            <div className="mt-4 mb-3 inline-flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #dd3333, #0170B9)' }}>
                <GraduationCap className="w-3 h-3 text-white" />
              </div>
              <span className="font-lato text-white/45 text-xs">Para:</span>
              <span className="font-poppins font-bold text-white/85 text-sm">{META.cliente}</span>
              <span className="font-lato text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{ background: 'rgba(255,230,40,.08)', border: '1px solid rgba(255,230,40,.2)', color: STUNET_GOLD }}>
                {META.tagline}
              </span>
            </div>
            <h1 className="font-poppins font-black text-white leading-[1.0] mb-6"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 5.2rem)' }}>
              Propuesta<br />
              <span style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Comercial
              </span>
            </h1>
            <p className="font-lato text-white/55 text-base leading-relaxed mb-8 max-w-md">
              {META.objetivo}
            </p>

            {/* Chips info */}
            <div className="flex flex-wrap gap-2 mb-10">
              {[
                { icon: Calendar, text: META.fecha },
                { icon: MapPin, text: META.lugar },
                { icon: Globe, text: META.sector },
                { icon: Hash, text: `NIT ${META.nit}` },
              ].map((chip, i) => {
                const Icon = chip.icon;
                return (
                  <div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-white/60"
                    style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                    <Icon className="w-3.5 h-3.5 text-[#00bfa5]" /> {chip.text}
                  </div>
                );
              })}
            </div>

            {/* Índice rápido */}
            <div className="border-t pt-6" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
              <p className="font-lato text-white/25 text-[10px] uppercase tracking-widest mb-3">Contenido</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                {['1. Resumen ejecutivo', '2. Objetivo general', '3. Plan de trabajo', '4. Cotización', '5. Alcance y exclusiones', '6. KPIs', '7. Recomendación final'].map((item, i) => (
                  <button key={i} onClick={() => scrollTo(SECCIONES[i]?.id)}
                    className="font-lato text-white/45 text-xs hover:text-[#00bfa5] transition-colors duration-200 text-left flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#00bfa5]/40 flex-shrink-0" />
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* — Derecha: visual — */}
          <div className="hidden lg:flex items-center justify-center relative pl-10">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-80 h-80 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(0,191,165,.12) 0%, transparent 70%)' }} />
            </div>
            <div className="relative z-10 w-full max-w-sm">
              <img
                src="/proposal-visual.png"
                alt="Dashboard CRM visual"
                className="w-full object-contain drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 40px rgba(0,191,165,.2))' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="absolute -bottom-4 -left-4 px-3 py-2 rounded-xl text-xs font-poppins font-bold text-white"
                style={{ background: 'rgba(13,45,79,.95)', border: '1px solid rgba(0,191,165,.3)', backdropFilter: 'blur(12px)' }}>
                <span className="text-[#00bfa5]">14–15</span> leads/día
              </div>
              <div className="absolute top-4 -right-4 px-3 py-2 rounded-xl text-xs font-poppins font-bold text-white"
                style={{ background: 'rgba(13,45,79,.95)', border: '1px solid rgba(0,191,165,.3)', backdropFilter: 'blur(12px)' }}>
                Fase 1 en <span className="text-[#00bfa5]">2 sem.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="relative z-10 flex flex-col items-center gap-2 pb-10 opacity-30 no-print">
          <p className="font-lato text-white text-[10px] uppercase tracking-widest">Desplazar</p>
          <div className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </header>

      {/* ══════════════════════════════════════ CONTENIDO PRINCIPAL */}
      <main className="max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-20 space-y-24">

        {/* ─ 01 RESUMEN ─ */}
        <section id="resumen" ref={s1.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s1.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>01 — Resumen ejecutivo</TagLabel>
          <SectionTitle>Contexto y diagnóstico inicial</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #dd3333, #0170B9)', boxShadow: '0 4px 20px rgba(221,51,51,.25)' }}>
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="font-poppins font-black text-white text-xs tracking-tight">Stunet</span>
              <span className="font-lato text-[9px] uppercase tracking-[0.2em]" style={{ color: STUNET_GOLD }}>{META.tagline}</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[10px] uppercase tracking-wider mb-1">Sector</p>
                <p className="font-poppins font-semibold text-white/80 text-sm">{META.sector}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[10px] uppercase tracking-wider mb-1">Fundada</p>
                <p className="font-poppins font-semibold text-white/80 text-sm">{META.fundada} · 11–50 empleados</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[10px] uppercase tracking-wider mb-1">Sedes</p>
                <p className="font-lato text-white/60 text-sm">{META.sede}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[10px] uppercase tracking-wider mb-1">Destinos que opera</p>
                <div className="flex flex-wrap gap-1">
                  {META.destinos.map(d => (
                    <span key={d} className="font-lato text-[10px] px-2 py-0.5 rounded-full text-white/55"
                      style={{ background: 'rgba(1,112,185,.12)', border: '1px solid rgba(1,112,185,.25)' }}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[15px] leading-relaxed mb-10">
            <p>Stunet conecta estudiantes colombianos con instituciones en Australia, Canadá, Reino Unido y España. Con operaciones en Barranquilla y Bogotá, su modelo depende de un flujo constante de leads calificados que pasen de interés a matrícula efectiva. Hoy ese flujo tiene tres frenos críticos: la <strong className="text-white/90 font-semibold">baja calidad de los leads captados en Meta</strong>, la lentitud en la atención inicial al prospecto y la falta de una arquitectura comercial que conecte pauta, automatización, CRM y seguimiento.</p>
            <p>La prioridad no debe ser comenzar por una implementación pesada de CRM, sino por un <strong className="text-white/90 font-semibold">proceso en fases que mejore primero el retorno de la inversión en pauta</strong>: revisar segmentación y creativos, estructurar la atención inicial y luego consolidar sobre automatizaciones robustas.</p>
            <p>La propuesta está diseñada para ejecutarse en <strong className="text-white/90 font-semibold">etapas cortas con foco en resultados tempranos</strong> y con una primera fase de entrada liviana en costo, respondiendo a la necesidad de controlar caja mientras se corrige la fuga comercial.</p>
          </div>

          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-xs uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> Hallazgos clave identificados
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HALLAZGOS.map((h, i) => {
                const Icon = h.icon; const t = TINT[h.tint];
                return (
                  <div key={i} className="rounded-xl p-4 flex gap-3"
                    style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                    <Icon className={`w-4 h-4 ${t.text} flex-shrink-0 mt-0.5`} />
                    <div>
                      <p className="font-poppins font-semibold text-white/90 text-sm mb-1">{h.titulo}</p>
                      <p className="font-lato text-white/50 text-xs leading-relaxed">{h.desc}</p>
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
              style={{ background: 'radial-gradient(circle, rgba(0,191,165,.07), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 text-[#00bfa5] mb-4" />
            <p className="font-poppins font-semibold text-white/85 text-base sm:text-lg leading-relaxed">
              Diseñar e implementar una ruta de optimización comercial y digital para Stunet que mejore la calidad de los leads de estudiantes interesados en estudiar en el exterior, reduzca el tiempo de respuesta al prospecto, aumente la tasa de conversión a matrícula efectiva y siente las bases para una operación escalable en pauta digital, automatización y CRM — alineada con la visión <em className="not-italic" style={{ color: STUNET_GOLD }}>"Growing Together"</em> de la marca.
            </p>
          </div>
          <div className="mt-4 rounded-xl p-4 flex flex-wrap gap-3 items-center"
            style={{ background: 'rgba(1,112,185,.06)', border: '1px solid rgba(1,112,185,.15)' }}>
            <Globe className="w-4 h-4 flex-shrink-0" style={{ color: STUNET_BLUE }} />
            <span className="font-lato text-white/40 text-xs">Destinos activos:</span>
            {META.destinos.map(d => (
              <span key={d} className="font-poppins font-semibold text-xs text-white/70">{d}</span>
            ))}
            <span className="font-lato text-white/25 text-xs ml-auto hidden sm:block">Mercado principal: Colombia → exterior</span>
          </div>
        </section>

        {/* ─ 03 PLAN DE TRABAJO ─ */}
        <section id="plan" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — Plan de trabajo</TagLabel>
          <SectionTitle>4 fases · ~9 semanas</SectionTitle>
          <Rule />

          <div className="hidden sm:flex items-center mb-8 relative">
            <div className="absolute top-5 left-5 right-5 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(29,112,162,.4) 20%, rgba(0,191,165,.4) 80%, transparent)' }} />
            {FASES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${f.recomendada ? 'border-[#00bfa5]/60' : 'border-white/10'}`}
                    style={{ background: f.recomendada ? 'linear-gradient(135deg,#1d70a2,#00bfa5)' : 'rgba(255,255,255,.04)' }}>
                    <Icon className={`w-4 h-4 ${f.recomendada ? 'text-white' : 'text-white/40'}`} />
                  </div>
                  <div className="text-center">
                    <p className={`font-poppins font-bold text-xs ${f.recomendada ? 'text-white' : 'text-white/50'}`}>{f.num}</p>
                    <p className={`font-lato text-[10px] leading-tight mt-0.5 max-w-[80px] ${f.recomendada ? 'text-[#00bfa5]' : 'text-white/30'}`}>{f.duracion}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2.5">
            {FASES.map((f, i) => {
              const Icon = f.icon; const open = faseActiva === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? '1px solid rgba(0,191,165,.3)' : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setFaseActiva(open ? null : i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? 'rgba(0,191,165,.15)' : 'rgba(255,255,255,.05)' }}>
                      <Icon className={`w-4 h-4 transition-colors ${open ? 'text-[#00bfa5]' : 'text-white/35'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`font-poppins font-bold text-sm ${open ? 'text-white' : 'text-white/70'}`}>{f.num}</span>
                        {f.recomendada && (
                          <span className="px-2 py-0.5 rounded-full font-lato font-bold text-[9px] uppercase tracking-wider text-[#030d1a]"
                            style={{ background: '#00bfa5' }}>★ Inicio recomendado</span>
                        )}
                      </div>
                      <p className={`font-lato text-sm mt-0.5 truncate ${open ? 'text-white/80' : 'text-white/40'}`}>{f.nombre}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <div className="text-right hidden sm:block">
                        <p className={`font-poppins font-bold text-sm ${f.recomendada ? 'text-[#00bfa5]' : 'text-white/60'}`}>{f.valor}</p>
                        <p className="font-lato text-white/30 text-[10px] mt-0.5">{f.duracion}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-[#00bfa5]/60 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`} />
                    </div>
                  </button>
                  {open && (
                    <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <p className="font-poppins font-semibold text-white/50 text-[10px] uppercase tracking-wider mb-3">Entregables</p>
                          <ul className="space-y-2">
                            {f.entregables.map((e, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                                <span className="font-lato text-white/65 text-sm">{e}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-poppins font-semibold text-white/50 text-[10px] uppercase tracking-wider mb-3">Actividades</p>
                          <ul className="space-y-2.5">
                            {f.detalle.map((d, j) => (
                              <li key={j} className="font-lato text-white/50 text-sm leading-snug pl-3 border-l border-[#1d70a2]/30">{d}</li>
                            ))}
                          </ul>
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                            <p className="font-lato text-white/30 text-xs">Forma de pago: <span className="text-white/55">{f.pago}</span></p>
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
          <SectionTitle>Inversión por fase</SectionTitle>
          <Rule />
          <p className="font-lato text-white/50 text-sm leading-relaxed mb-6">
            Valores en <strong className="text-white/75">pesos colombianos (COP)</strong>. No incluyen pauta, licencias de terceros, WhatsApp API ni herramientas de IA.
          </p>

          <div className="space-y-2 mb-5">
            {FASES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0"
                  style={{ background: f.recomendada ? 'rgba(0,191,165,.05)' : 'rgba(255,255,255,.03)', border: f.recomendada ? '1px solid rgba(0,191,165,.2)' : '1px solid rgba(255,255,255,.06)' }}>
                  <div className="flex items-center gap-3 sm:w-2/5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: f.recomendada ? 'rgba(0,191,165,.18)' : 'rgba(255,255,255,.05)' }}>
                      <Icon className={`w-4 h-4 ${f.recomendada ? 'text-[#00bfa5]' : 'text-white/30'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-poppins font-bold text-white/80 text-sm">{f.num}</span>
                        {f.recomendada && (
                          <span className="px-2 py-0.5 rounded-full font-lato font-bold text-[8px] uppercase text-[#030d1a]" style={{ background: '#00bfa5' }}>★ Recomendada</span>
                        )}
                      </div>
                      <p className="font-lato text-white/45 text-xs mt-0.5">{f.duracion}</p>
                    </div>
                  </div>
                  <div className="sm:w-1/4">
                    <p className={`font-poppins font-black text-lg ${f.recomendada ? 'text-[#00bfa5]' : 'text-white/75'}`}>{f.valor}</p>
                  </div>
                  <div className="sm:w-1/3">
                    <p className="font-lato text-white/35 text-xs">{f.pago}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
              <p className="font-lato text-white/35 text-xs uppercase tracking-wider mb-1">Inversión total</p>
              <p className="font-poppins font-black text-white text-2xl sm:text-3xl">COP 11.200.000</p>
              <p className="font-lato text-white/30 text-xs mt-1">Proyecto completo · 4 fases</p>
            </div>
            <div className="rounded-xl p-5 relative overflow-hidden" style={{ background: 'rgba(0,191,165,.07)', border: '1px solid rgba(0,191,165,.25)' }}>
              <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(0,191,165,.15),transparent)', transform: 'translate(20%,-20%)' }} />
              <p className="font-lato text-[#00bfa5] text-xs uppercase tracking-wider mb-1">★ Opción de arranque recomendada</p>
              <p className="font-poppins font-black text-white text-2xl sm:text-3xl">COP 1.800.000</p>
              <p className="font-lato text-white/40 text-xs mt-1">Solo Fase 1 · 2 semanas</p>
            </div>
          </div>

          <div className="rounded-xl p-4 sm:p-5 flex gap-3"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.06)' }}>
            <Info className="w-4 h-4 text-white/30 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-poppins font-semibold text-white/70 text-sm mb-1">Acompañamiento mensual posterior (opcional)</p>
              <p className="font-lato text-white/45 text-sm leading-relaxed">
                Bolsa mensual de soporte, ajustes e implementación continua por <strong className="text-white/75">COP 2.400.000/mes</strong>, incluyendo seguimiento operativo y evolución de automatizaciones. Ajustable según carga real acordada.
              </p>
            </div>
          </div>
        </section>

        {/* ─ 05 ALCANCE ─ */}
        <section id="alcance" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Alcance y exclusiones</TagLabel>
          <SectionTitle>¿Qué está incluido y qué no?</SectionTitle>
          <Rule />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl p-5 sm:p-6" style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.15)' }}>
              <p className="font-poppins font-bold text-[#00bfa5] text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" /> Incluye
              </p>
              <ul className="space-y-2.5">
                {['Consultoría estratégica y funcional', 'Diseño de flujos y arquitectura comercial', 'Configuración e implementación técnica', 'Capacitación operativa al equipo', 'Acompañamiento y pruebas por fase'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                    <span className="font-lato text-white/65 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl p-5 sm:p-6" style={{ background: 'rgba(239,68,68,.04)', border: '1px solid rgba(239,68,68,.12)' }}>
              <p className="font-poppins font-bold text-red-400/80 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                <X className="w-3.5 h-3.5" /> No incluye
              </p>
              <ul className="space-y-2.5">
                {EXCLUSIONES.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full border border-red-400/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1 h-1 rounded-full bg-red-400/50" />
                    </div>
                    <span className="font-lato text-white/50 text-sm leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ─ 06 KPIs ─ */}
        <section id="kpis" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 — Indicadores de avance</TagLabel>
          <SectionTitle>¿Cómo medimos el éxito?</SectionTitle>
          <Rule />

          <div className="hidden sm:block rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="grid grid-cols-5 gap-4 px-5 py-3 text-[10px] uppercase tracking-widest font-poppins font-bold text-white/25"
              style={{ background: 'rgba(255,255,255,.04)' }}>
              <div className="col-span-2">Indicador</div>
              <div className="col-span-2">Uso principal</div>
              <div>Meta</div>
            </div>
            {KPIS.map((k, i) => (
              <div key={i} className="grid grid-cols-5 gap-4 px-5 py-4 items-start border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                <div className="col-span-2">
                  <p className="font-poppins font-semibold text-white/80 text-sm">{k.indicador}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-lato text-white/45 text-sm leading-relaxed">{k.uso}</p>
                </div>
                <div>
                  <span className="inline-block px-2.5 py-1 rounded-full font-poppins font-bold text-xs text-[#00bfa5]"
                    style={{ background: 'rgba(0,191,165,.1)', border: '1px solid rgba(0,191,165,.2)' }}>
                    {k.meta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="sm:hidden space-y-3">
            {KPIS.map((k, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-poppins font-semibold text-white/85 text-sm">{k.indicador}</p>
                  <span className="inline-block px-2 py-1 rounded-full font-poppins font-bold text-[10px] text-[#00bfa5] flex-shrink-0"
                    style={{ background: 'rgba(0,191,165,.1)', border: '1px solid rgba(0,191,165,.2)' }}>
                    {k.meta}
                  </span>
                </div>
                <p className="font-lato text-white/45 text-xs leading-relaxed">{k.uso}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─ 07 RECOMENDACIÓN ─ */}
        <section id="recomendacion" ref={s7.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s7.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>07 — Recomendación final</TagLabel>
          <SectionTitle>Nuestra postura estratégica</SectionTitle>
          <Rule />

          <div className="rounded-xl p-5 sm:p-7 mb-4 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
              style={{ background: 'radial-gradient(circle,rgba(0,191,165,.06),transparent)', transform: 'translate(20%,-20%)' }} />
            <div className="space-y-4 font-lato text-white/60 text-[15px] leading-relaxed">
              <p>Recomendamos iniciar con una <strong className="text-white/90 font-semibold">Fase 1 corta y ejecutiva</strong>, enfocada en auditar la pauta actual de Meta Ads, los formularios de captura y el recorrido del lead desde el clic hasta el asesor. Esta etapa permite detectar en dónde se pierden los 14–15 leads diarios antes de comprometer inversión en automatización.</p>
              <p>Una vez identificados los cuellos de botella, la Fase 2 debe concentrarse en el <strong className="text-white/90 font-semibold">flujo de atención inicial y la automatización del primer contacto vía WhatsApp</strong> — especialmente para el mercado México, donde el rechazo a números colombianos impone una solución técnica específica.</p>
              <p>Este orden <strong className="text-white/90 font-semibold">protege la caja de Stunet</strong>, genera aprendizajes accionables desde la Fase 1, y reduce el riesgo de implementar tecnología costosa sin haber corregido primero el origen de la fuga comercial. La meta es que cada peso invertido en pauta se traduzca en más estudiantes que llegan a Australia, Canadá o el Reino Unido.</p>
            </div>
          </div>

          <div className="rounded-xl p-4 sm:p-5 flex gap-3"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.06)' }}>
            <TrendingUp className="w-4 h-4 text-[#00bfa5] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-poppins font-semibold text-white/70 text-sm mb-1">Modalidad alternativa de entrada</p>
              <p className="font-lato text-white/45 text-sm leading-relaxed">
                Si Stunet desea reducir presión de caja, recomendamos contratar primero la Fase 1 como diagnóstico accionable. Con base en ese entregable, se puede aprobar la Fase 2 y 3 en una segunda decisión, validando dirección estratégica antes de comprometer el proyecto completo.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ══════════════════════════════════════ FOOTER */}
      <footer style={{ background: 'linear-gradient(180deg, #04111f, #030d1a)' }}>
        <div className="relative overflow-hidden border-t" style={{ borderColor: 'rgba(0,191,165,.12)' }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(0,191,165,.06), transparent 65%)', transform: 'translate(30%,-30%)' }} />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-16 sm:py-20 text-center">
            <TagLabel>¿Avanzamos?</TagLabel>
            <h2 className="font-poppins font-black text-white mt-4 mb-4 leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)' }}>
              ¿Lista Stunet para dar el primer paso?
            </h2>
            <p className="font-lato text-white/50 max-w-md mx-auto mb-8 text-sm sm:text-base leading-relaxed">
              Podemos arrancar la Fase 1 esta semana. Escríbenos para confirmar alcance, accesos y fechas de inicio.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:alpha@sixteam.pro"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-poppins font-bold text-sm text-[#030d1a] transition-all duration-300 hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#00bfa5,#00d4b8)', boxShadow: '0 4px 20px rgba(0,191,165,.3)' }}>
                Confirmar por email
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-poppins font-semibold text-sm text-white/80 border border-white/15 hover:bg-white/05 transition-all duration-300">
                <MessageSquare className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-8 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <p className="font-poppins font-black text-white text-base mb-0.5">
                Sixteam<span className="text-[#00bfa5]">.</span>pro
              </p>
              <p className="font-lato text-white/30 text-xs">Innovación y Estrategia Digital S.A.S.</p>
              <p className="font-lato text-white/25 text-xs mt-0.5">NIT {META.nit}</p>
            </div>
            <div>
              <p className="font-lato text-white/25 text-[10px] uppercase tracking-wider mb-2">Contacto</p>
              <a href={`mailto:${META.correo}`}
                className="font-lato text-white/55 text-sm hover:text-[#00bfa5] transition-colors flex items-center gap-1.5 mb-1">
                <Mail className="w-3.5 h-3.5" />{META.correo}
              </a>
              <p className="font-lato text-white/35 text-xs flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />{META.lugar}
              </p>
            </div>
            <div>
              <p className="font-lato text-white/25 text-[10px] uppercase tracking-wider mb-2">Representante legal</p>
              <p className="font-lato text-white/55 text-sm flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#00bfa5]" />{META.rl}
              </p>
              <p className="font-lato text-white/25 text-xs mt-2">Válida 30 días · {META.fecha}</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Unused import silencer */}
      <span style={{ display: 'none' }}><Clock size={0} /></span>
    </div>
  );
};

export default StunetProposal;
