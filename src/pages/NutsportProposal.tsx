import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, ChevronRight, ChevronDown,
  Building2, Calendar, User, Info,
  MessageSquare, BarChart3, Zap, AlertCircle,
} from 'lucide-react';

// ─── COLORES NUTSPORT ────────────────────────────────────────────────────────
const NS_BLUE   = '#2563eb';
const NS_PINK   = '#ec4899';
const NS_ACCENT = NS_BLUE;

// ─── META ────────────────────────────────────────────────────────────────────
const META = {
  cliente:        'Nutsport',
  sector:         'Nutrición Deportiva · Salud · Chile',
  fecha:          'Mayo 2026',
  proponente:     'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit:            '901.967.849-4',
  correo:         'alpha@sixteam.pro',
  rl:             'Samuel Armando Burgos Ferrer',
  dirigidoA:      'Bárbara Cruz Poblete',
  elaboradaPor:   'Ernesto Hernandez',
  cargoElaborador:'Gerente Comercial',
  objetivo:
    'Implementación de CRM, Chat Center y agente IA para automatizar la atención al paciente, reducir cancelaciones y activar la base de pacientes inactivos de Nutsport.',
};

// ─── HALLAZGOS ───────────────────────────────────────────────────────────────
const HALLAZGOS = [
  {
    num: '01',
    titulo: 'Respuesta tardía, paciente perdido',
    desc: '15 a 20 mensajes diarios en WhatsApp sin gestión estructurada. Consultas que llegan a las 2 AM quedan sin respuesta hasta el día siguiente. Casos reales de pacientes que esperaron y terminaron agendando con otro profesional.',
    tint: 'pink',
  },
  {
    num: '02',
    titulo: '5 agendas, cero visibilidad',
    desc: '5 nutricionistas con horarios distintos y confirmaciones de cita completamente manuales. Alta tasa de cancelaciones de último minuto sin recordatorio previo ni mecanismo de resguardo.',
    tint: 'blue',
  },
  {
    num: '03',
    titulo: 'Base de pacientes sin trabajar',
    desc: 'Pacientes que vinieron una sola vez a medirse o a consulta particular y no volvieron. No hay reactivación, no hay seguimiento. Los ingresos de consultas particulares están por debajo de su potencial real.',
    tint: 'teal',
  },
  {
    num: '04',
    titulo: 'Sin pipeline, sin métricas de venta',
    desc: 'Medilink cubre las fichas clínicas pero no es un CRM comercial. No hay historial de conversaciones de ventas, sin pipeline de seguimiento, sin datos de conversión. Sin datos reales, no hay escalamiento controlado.',
    tint: 'amber',
  },
];

// ─── COMPONENTES DEL SISTEMA ─────────────────────────────────────────────────
const COMPONENTES = [
  {
    id:        'crm',
    num:       '01',
    nombre:    'CRM + Chat Center',
    subtitulo: 'Plataforma Sixteam · Pipeline + Bandeja unificada',
    desc:      'Centraliza WhatsApp e Instagram en una sola bandeja de entrada. Cada prospecto o paciente se convierte en un contacto con historial completo, pipeline de seguimiento y campos personalizados para nutrición deportiva.',
    icon:      BarChart3,
    tint:      'blue',
    items: [
      'Subaccount Nutsport configurado en Plataforma Sixteam',
      'WhatsApp Business e Instagram DM conectados a una sola bandeja',
      'Pipeline de consultas con etapas del proceso de atención',
      'Campos personalizados: deporte, objetivo, convenio, profesional asignado',
      'Historial completo de conversaciones por paciente',
      'Usuarios y roles para todo el equipo (hasta 5 usuarios)',
    ],
  },
  {
    id:        'bot-ia',
    num:       '02',
    nombre:    'Agente IA de Atención Inicial',
    subtitulo: 'Bot conversacional · WhatsApp 24/7',
    desc:      'Bot entrenado con la información real de Nutsport que atiende los primeros mensajes, responde preguntas frecuentes, recoge datos del paciente y deriva al equipo cuando es necesario, con todo el contexto disponible.',
    icon:      MessageSquare,
    tint:      'pink',
    items: [
      'Bot IA entrenado con FAQ Nutsport (precios, convenios, profesionales, horarios)',
      'Respuesta automática en WhatsApp e Instagram — disponible 24/7',
      'Recolección de datos: nombre, objetivo, tipo de servicio requerido',
      'Derivación al profesional o equipo con contexto completo de la consulta',
      'Integración del link de agendamiento de Medilink en el flujo del bot',
      'Protocolo diferenciado para consultas particulares vs. convenios',
    ],
  },
  {
    id:        'automatizaciones',
    num:       '03',
    nombre:    'Automatizaciones de Fidelización',
    subtitulo: 'Confirmaciones · Recordatorios · Reactivación',
    desc:      'Flujos automáticos que reducen cancelaciones, recuerdan citas y reactivan pacientes inactivos. Una sola configuración que trabaja todos los días sin que el equipo tenga que intervenir.',
    icon:      Zap,
    tint:      'teal',
    items: [
      'Confirmación automática de cita al momento de agendar',
      'Recordatorio 24 horas antes de la consulta (WhatsApp)',
      'Mensaje de seguimiento post-consulta (feedback + invitación a reagendar)',
      'Flujo de reactivación para pacientes inactivos a 30, 60 y 90 días',
      'Campaña de email para recontacto de base histórica de pacientes',
      'Alerta al equipo ante cancelación o inasistencia registrada',
    ],
  },
];

// ─── FASES ────────────────────────────────────────────────────────────────────
const FASES = [
  {
    num:    'Fase 1',
    nombre: 'Implementación CRM + Chat Center',
    duracion: '2–3 semanas',
    valor:  'USD 800',
    icon:   BarChart3,
    tint:   'blue',
    entregables: [
      'Subaccount Nutsport configurado en Plataforma Sixteam',
      'WhatsApp Business conectado a la plataforma',
      'Instagram DM conectado a la plataforma',
      'Pipeline de atención diseñado para el flujo de Nutsport',
      'Campos personalizados para el perfil del paciente deportivo',
      'Usuarios creados para todos los miembros del equipo (hasta 5)',
      'Automatizaciones base: confirmación de cita, recordatorio 24h, seguimiento post-consulta',
      'Capacitación del equipo: 2 sesiones en vivo de 1h cada una',
    ],
    detalle: [
      'El Chat Center unifica todas las conversaciones de WhatsApp e Instagram en una sola bandeja. El equipo responde desde un único lugar sin importar desde qué canal llegó el mensaje, y sin perder el historial.',
      'El pipeline diseñado para Nutsport refleja el ciclo real de un paciente: desde el primer contacto hasta la fidelización. Permite saber en todo momento cuántos prospectos activos hay, cuántos agendaron y cuántos no volvieron.',
      'Las automatizaciones base reducen de inmediato la carga manual: confirmación al agendar, recordatorio el día anterior y mensaje de seguimiento post-consulta quedan activos desde el día 1.',
    ],
  },
  {
    num:    'Fase 2',
    nombre: 'Desarrollo Bot IA Conversacional',
    duracion: '1–2 semanas',
    valor:  'USD 300',
    icon:   MessageSquare,
    tint:   'pink',
    entregables: [
      'Bot IA entrenado con información real de Nutsport (FAQ, precios, convenios)',
      'Flujo de bienvenida y calificación inicial del paciente',
      'Protocolo de respuesta para consultas particulares',
      'Protocolo de respuesta para consultas de convenio',
      'Handoff bot → equipo con contexto completo de la conversación',
      'Integración del link de agendamiento Medilink en el flujo del bot',
      'Testing y ajuste fino con el equipo de Nutsport (hasta 2 rondas)',
    ],
    detalle: [
      'El bot se entrena con la información real de Nutsport: precios, profesionales, horarios tipo, convenios activos y las preguntas más frecuentes que llegan por WhatsApp. No es un bot genérico.',
      'Cuando el paciente tiene una consulta que el bot no puede resolver, hace el traspaso al equipo con todo el contexto de la conversación. El equipo no necesita volver a preguntar nada.',
      'Las dos rondas de prueba garantizan que el bot responda de la manera en que los pacientes realmente preguntan antes de salir a producción.',
    ],
  },
];

const SECCIONES = [
  { id: 'resumen',     label: 'Resumen'     },
  { id: 'diagnostico', label: 'Diagnóstico' },
  { id: 'sistema',     label: 'Sistema'     },
  { id: 'plan',        label: 'Plan'        },
  { id: 'cotizacion',  label: 'Cotización'  },
  { id: 'terminos',    label: 'Términos'    },
  { id: 'vigencia',    label: 'Vigencia'    },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  blue:  { text: 'text-[#60a5fa]', bg: 'rgba(96,165,250,.07)',  border: 'rgba(96,165,250,.18)'  },
  pink:  { text: 'text-[#f472b6]', bg: 'rgba(244,114,182,.07)', border: 'rgba(244,114,182,.18)' },
  teal:  { text: 'text-[#00bfa5]', bg: 'rgba(0,191,165,.07)',   border: 'rgba(0,191,165,.18)'   },
  amber: { text: 'text-amber-400', bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)'  },
};

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
  <span className="font-lato text-[#60a5fa] text-[13px] uppercase tracking-[0.22em] font-medium">{children}</span>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-poppins font-extrabold text-white mt-2 mb-2 leading-tight"
    style={{ fontSize: 'clamp(1.8125rem, 4.375vw, 2.625rem)' }}>
    {children}
  </h2>
);

const Rule = () => (
  <div className="w-10 h-0.5 mb-7 mt-1"
    style={{ background: `linear-gradient(90deg, ${NS_BLUE}, ${NS_PINK})` }} />
);

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────
const NutsportProposal = () => {
  const [activeSection, setActiveSection]   = useState('resumen');
  const [compActivo, setCompActivo]         = useState<number | null>(null);
  const [faseActiva, setFaseActiva]         = useState<number | null>(null);
  const [showCalc, setShowCalc]             = useState(false);
  const [mensajesConv, setMensajesConv]     = useState(8);
  const [convsMes, setConvsMes]             = useState(200);

  const consumoIAUSD = (0.02 * mensajesConv * convsMes).toFixed(2);

  useEffect(() => {
    const handler = () => {
      for (const s of SECCIONES) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= 140 && bottom > 140) { setActiveSection(s.id); break; }
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const s1 = useVisible(); const s2 = useVisible(); const s3 = useVisible();
  const s4 = useVisible(); const s5 = useVisible(); const s6 = useVisible();
  const s7 = useVisible();

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
            <div className={`rounded-full flex-shrink-0 transition-all duration-300 ${activeSection === s.id ? 'w-2 h-2 shadow-[0_0_6px_rgba(37,99,235,.7)]' : 'w-1.5 h-1.5 bg-white/50'}`}
              style={activeSection === s.id ? { background: NS_BLUE } : {}} />
          </button>
        ))}
      </nav>

      {/* ══════════════════════════════════════ PORTADA ══════════════════════ */}
      <header className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #030d1a 0%, #040f1e 55%, #050f20 100%)' }}>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
            style={{ background: `radial-gradient(circle, rgba(37,99,235,.06) 0%, transparent 65%)` }} />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full"
            style={{ background: `radial-gradient(circle, rgba(236,72,153,.04) 0%, transparent 70%)`, transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.015]"
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
          input[type=range] { accent-color: ${NS_BLUE}; }
        `}</style>

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-b" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-white flex items-center justify-center">
              <img src="/sixteam-logo.png" alt="Sixteam.pro" className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <div>
              <span className="font-poppins font-black text-white text-xl tracking-tight">
                Sixteam<span style={{ color: NS_BLUE }}>.</span>pro
              </span>
              <p className="font-lato text-white/35 text-[13px] leading-none mt-0.5">Innovación y Estrategia Digital</p>
            </div>
          </div>
          <span className="font-lato text-[13px] uppercase tracking-[0.2em] border rounded-full px-3 py-1.5"
            style={{ color: 'rgba(96,165,250,.8)', borderColor: 'rgba(37,99,235,.2)' }}>
            Confidencial
          </span>
        </div>

        {/* Hero */}
        <div className="relative z-10 flex-1 flex items-center px-6 md:px-12 lg:px-20">
          <div className="w-full max-w-6xl mx-auto py-16 md:py-20 grid lg:grid-cols-2 gap-14 items-center">

            <div>
              {/* Badge Nutsport */}
              <div className="fade-up fade-up-1 flex items-center gap-3 mb-8">
                <div className="h-12 flex items-center">
                  <img src="/nutsport-logo.png" alt="Nutsport" className="h-full w-auto object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              </div>

              <div className="fade-up fade-up-1 inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border"
                style={{ borderColor: `rgba(37,99,235,.25)`, background: `rgba(37,99,235,.07)` }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: NS_BLUE }} />
                <span className="font-lato text-[13px] uppercase tracking-[0.2em]" style={{ color: '#60a5fa' }}>
                  CRM · Chat Center · Bot IA
                </span>
              </div>

              <h1 className="fade-up fade-up-2 font-poppins font-black text-white leading-[1.05] mb-5"
                style={{ fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)' }}>
                De la consulta<br />
                <span style={{ background: `linear-gradient(90deg, ${NS_BLUE}, ${NS_PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  al sistema
                </span>
                <br />que escala.
              </h1>

              <p className="fade-up fade-up-3 font-lato text-white/55 leading-relaxed mb-8 max-w-lg"
                style={{ fontSize: 'clamp(.95rem, 1.8vw, 1.08rem)' }}>
                {META.objetivo}
              </p>

              <div className="fade-up fade-up-4 flex flex-wrap gap-3">
                <button onClick={() => scrollTo('sistema')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-poppins font-semibold text-white transition-all hover:scale-105"
                  style={{ background: `linear-gradient(90deg, ${NS_BLUE}, ${NS_PINK})`, boxShadow: `0 4px 24px rgba(37,99,235,.3)` }}>
                  Ver el sistema <ChevronRight size={16} />
                </button>
                <button onClick={() => scrollTo('cotizacion')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-poppins font-semibold transition-all hover:scale-105"
                  style={{ border: `1px solid rgba(37,99,235,.3)`, color: '#60a5fa', background: 'rgba(37,99,235,.06)' }}>
                  Ver cotización
                </button>
              </div>
            </div>

            {/* Mapa del sistema */}
            <div className="fade-up fade-up-5">
              <p className="font-lato text-white/30 text-[12px] uppercase tracking-wider mb-4">Componentes del sistema</p>
              <div className="space-y-3">
                {COMPONENTES.map((c, i) => {
                  const Icon = c.icon;
                  const t = TINT[c.tint];
                  return (
                    <div key={i} className="rounded-xl p-4 border flex items-center gap-3 transition-all hover:scale-[1.02]"
                      style={{ background: t.bg, borderColor: t.border }}>
                      <Icon size={16} className={`${t.text} flex-shrink-0`} />
                      <div>
                        <p className={`font-poppins font-bold text-[13px] ${t.text}`}>{c.num} {c.nombre}</p>
                        <p className="font-lato text-white/45 text-[11px] leading-snug mt-0.5">{c.subtitulo}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Flujo rápido */}
              <div className="mt-5 rounded-xl p-4 border" style={{ background: 'rgba(255,255,255,.02)', borderColor: 'rgba(255,255,255,.07)' }}>
                <p className="font-lato text-white/30 text-[11px] uppercase tracking-wider mb-3">Flujo del paciente</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['WhatsApp / IG', 'Bot IA responde', 'CRM registra', 'Cita confirmada', 'Fidelización'].map((paso, i, arr) => (
                    <React.Fragment key={paso}>
                      <span className="font-lato text-white/55 text-[11px] px-2 py-1 rounded-md"
                        style={{ background: 'rgba(255,255,255,.04)' }}>{paso}</span>
                      {i < arr.length - 1 && <ChevronRight size={10} className="text-white/20 flex-shrink-0" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metadatos */}
        <div className="relative z-10 px-6 md:px-12 lg:px-20 pb-10">
          <div className="max-w-6xl mx-auto flex flex-wrap gap-6 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
            {[
              { icon: Building2, label: 'Cliente',    val: META.cliente    },
              { icon: User,      label: 'Dirigida a', val: META.dirigidoA  },
              { icon: Calendar,  label: 'Fecha',      val: META.fecha      },
              { icon: User,      label: 'RL',         val: META.rl         },
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
                <strong className="text-white">Nutsport</strong> tiene lo esencial para crecer: 5 profesionales especializados, una base de pacientes activa y una demanda entrante real. Lo que frena el crecimiento no es el producto, es la falta de sistema para manejarlo.
              </p>
              <p className="font-lato text-white/65 leading-relaxed mb-8" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
                Sixteam.pro implementará el <strong className="text-white">CRM, Chat Center y agente IA</strong> que transforma la operación: desde una bandeja de mensajes sin estructura hasta un sistema donde cada paciente tiene historial, seguimiento y atención oportuna, incluso a las 2 de la mañana.
              </p>

              {/* Flujo visual */}
              <div className="space-y-2">
                <p className="font-lato text-white/30 text-[12px] uppercase tracking-wider mb-3">Cómo cambia el flujo de atención</p>
                {[
                  { paso: 'Paciente escribe por WhatsApp o Instagram', sub: 'Cualquier hora, cualquier día' },
                  { paso: 'Bot IA responde en segundos',               sub: 'FAQ, precios, convenios, disponibilidad' },
                  { paso: 'CRM registra el contacto',                  sub: 'Pipeline actualizado, historial completo' },
                  { paso: 'Cita confirmada con recordatorio',          sub: 'Reduce cancelaciones de último minuto' },
                  { paso: 'Fidelización y reactivación automáticas',   sub: 'Pacientes inactivos vuelven solos' },
                ].map(({ paso, sub }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 text-[11px] font-poppins font-black"
                        style={{ borderColor: `rgba(37,99,235,.3)`, background: `rgba(37,99,235,.07)`, color: '#60a5fa' }}>
                        {i + 1}
                      </div>
                      {i < 4 && <div className="w-px flex-1 mt-1" style={{ background: 'rgba(37,99,235,.12)', minHeight: 16 }} />}
                    </div>
                    <div className="pb-2">
                      <p className="font-poppins font-semibold text-white text-[14px]">{paso}</p>
                      <p className="font-lato text-white/40 text-[12px]">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ficha + estimado */}
            <div className="space-y-4">
              <div className="rounded-2xl p-6 border" style={{ background: `rgba(37,99,235,.04)`, borderColor: `rgba(37,99,235,.15)` }}>
                <p className="font-lato text-white/40 text-[12px] uppercase tracking-wider mb-1">Propuesta para</p>
                <div className="flex items-center gap-3 mb-2">
                  <img src="/nutsport-logo.png" alt="Nutsport" className="h-8 w-auto object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <p className="font-lato text-white/50 text-sm">{META.sector}</p>
                <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                  {[
                    { label: 'Dirigida a',  val: META.dirigidoA  },
                    { label: 'Fecha',       val: META.fecha       },
                    { label: 'Proponente',  val: META.proponente  },
                    { label: 'NIT',         val: META.nit         },
                    { label: 'Correo',      val: META.correo      },
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
                    <span className="font-lato text-white/60 text-sm">Implementación CRM + Chat Center</span>
                    <span className="font-poppins font-bold text-white">USD 800</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-lato text-white/60 text-sm">Desarrollo Bot IA</span>
                    <span className="font-poppins font-bold text-white">USD 300</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                    <span className="font-lato text-white/50 text-sm">Plataforma mensual</span>
                    <span className="font-poppins font-bold" style={{ color: '#60a5fa' }}>USD 240 + IA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ DIAGNÓSTICO ══════════════════ */}
      <section id="diagnostico" ref={s2.ref as React.RefObject<HTMLElement>}
        className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Diagnóstico</TagLabel>
          <SectionTitle>Los 4 frenos al crecimiento</SectionTitle>
          <Rule />

          <p className="font-lato text-white/55 leading-relaxed mb-10 max-w-3xl" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
            Identificados en la reunión de diagnóstico del 25 de mayo de 2026. Cada uno de estos frenos se resuelve directamente con los componentes del sistema propuesto.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {HALLAZGOS.map((h) => {
              const t = TINT[h.tint];
              return (
                <div key={h.num} className="rounded-2xl p-6 border flex items-start gap-4"
                  style={{ background: t.bg, borderColor: t.border }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border"
                    style={{ background: t.bg, borderColor: t.border }}>
                    <AlertCircle size={16} className={t.text} />
                  </div>
                  <div>
                    <p className={`font-poppins font-bold text-[13px] mb-0.5 ${t.text}`}>{h.num}</p>
                    <p className="font-poppins font-bold text-white text-[15px] mb-2">{h.titulo}</p>
                    <p className="font-lato text-white/55 text-sm leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ SISTEMA ══════════════════════ */}
      <section id="sistema" ref={s3.ref as React.RefObject<HTMLElement>}
        className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Sistema Propuesto</TagLabel>
          <SectionTitle>Los 3 componentes del sistema</SectionTitle>
          <Rule />

          <p className="font-lato text-white/55 leading-relaxed mb-10 max-w-3xl" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
            Cada componente resuelve uno o más frenos identificados en el diagnóstico. Juntos forman un sistema que opera con mínima intervención manual en los puntos críticos del ciclo de atención.
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
      <section id="plan" ref={s4.ref as React.RefObject<HTMLElement>}
        className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Plan de Trabajo</TagLabel>
          <SectionTitle>Fases de implementación</SectionTitle>
          <Rule />

          <p className="font-lato text-white/55 leading-relaxed mb-10 max-w-3xl" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
            Las 2 fases se implementan de forma consecutiva en un plazo estimado de <strong className="text-white">3–5 semanas</strong>, con kick-off en los 3 días hábiles siguientes al pago de la primera fase.
          </p>

          <div className="space-y-4">
            {FASES.map((fase, i) => {
              const Icon = fase.icon;
              const t = TINT[fase.tint];
              const open = faseActiva === i;
              return (
                <div key={i} className="rounded-2xl overflow-hidden border transition-all"
                  style={{ borderColor: open ? t.border : 'rgba(255,255,255,.07)', background: open ? t.bg : 'rgba(255,255,255,.02)' }}>
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
                        <p className="font-lato text-white/40 text-[12px] uppercase tracking-wider mb-3">Detalle</p>
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

          {/* Timeline */}
          <div className="mt-10 rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,.02)', borderColor: 'rgba(255,255,255,.07)' }}>
            <p className="font-lato text-white/40 text-[12px] uppercase tracking-wider mb-5">Cronograma estimado</p>
            <div className="flex items-start gap-0 overflow-x-auto pb-2">
              {[
                { label: 'Kick-off',        sub: 'Día 1',          color: '#60a5fa' },
                { label: 'Fase 1 CRM',      sub: 'Semana 1–3',     color: '#60a5fa' },
                { label: 'Capacitación',    sub: 'Semana 3',       color: '#00bfa5' },
                { label: 'Fase 2 Bot IA',   sub: 'Semana 3–5',     color: '#f472b6' },
                { label: 'Go Live',         sub: 'Semana 5',       color: '#ec4899' },
              ].map((item, i, arr) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center min-w-[110px] flex-shrink-0">
                    <div className="w-3 h-3 rounded-full flex-shrink-0 mb-2" style={{ background: item.color }} />
                    <p className="font-poppins font-bold text-[11px] text-white/70 text-center">{item.label}</p>
                    <p className="font-lato text-[10px] text-white/35 text-center mt-0.5">{item.sub}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex-1 h-px mt-1.5 mx-1" style={{ background: 'rgba(255,255,255,.1)', minWidth: 20 }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ COTIZACIÓN ═══════════════════ */}
      <section id="cotizacion" ref={s5.ref as React.RefObject<HTMLElement>}
        className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Cotización</TagLabel>
          <SectionTitle>Inversión por componente</SectionTitle>
          <Rule />

          <div className="grid md:grid-cols-2 gap-5 mb-6">

            {/* Bloque 1: Implementaciones únicas */}
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,.08)' }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,.06)', background: 'rgba(255,255,255,.03)' }}>
                <p className="font-lato text-white/45 text-[12px] uppercase tracking-wider">Implementación</p>
                <p className="font-lato text-white/30 text-[11px]">Pago único por fase · En USD</p>
              </div>
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
                {[
                  { comp: '01 CRM + Chat Center',     label: 'Pipeline · bandeja unificada · automatizaciones base', val: 'USD 800', t: 'blue' },
                  { comp: '02 Bot IA Conversacional',  label: 'Bot entrenado · handoff · 2 rondas de testing',       val: 'USD 300', t: 'pink' },
                ].map(({ comp, label, val, t }) => (
                  <div key={comp} className="px-5 py-3 flex items-start justify-between gap-2 hover:bg-white/[0.015] transition-colors">
                    <div>
                      <p className={`font-poppins font-bold text-[12px] ${TINT[t].text}`}>{comp}</p>
                      <p className="font-lato text-white/40 text-[11px]">{label}</p>
                    </div>
                    <span className="font-poppins font-bold text-white text-[13px] flex-shrink-0">{val}</span>
                  </div>
                ))}
                <div className="px-5 py-3 flex justify-between items-center" style={{ background: `rgba(37,99,235,.05)` }}>
                  <span className="font-poppins font-black text-white text-[13px]">Total implementación</span>
                  <span className="font-poppins font-black text-[#60a5fa]">USD 1.100</span>
                </div>
              </div>
            </div>

            {/* Bloque 2: Mensual recurrente */}
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(37,99,235,.2)' }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: 'rgba(37,99,235,.1)', background: 'rgba(37,99,235,.04)' }}>
                <p className="font-lato text-[#60a5fa] text-[12px] uppercase tracking-wider">Mensual recurrente</p>
                <p className="font-lato text-white/30 text-[11px]">Costo operativo continuo · En USD</p>
              </div>
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,.04)' }}>

                {/* Plataforma + Calculadora IA */}
                <div className="px-5 py-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="font-poppins font-bold text-[12px] text-[#60a5fa]">Plataforma CRM + Chat Center</p>
                      <p className="font-lato text-white/40 text-[11px]">Hasta 5 usuarios · WhatsApp + Instagram conectados</p>
                    </div>
                    <span className="font-poppins font-bold text-white text-[13px] flex-shrink-0">USD 240</span>
                  </div>
                  <button
                    onClick={() => setShowCalc(!showCalc)}
                    className="flex items-center gap-1.5 mt-2 transition-opacity hover:opacity-80"
                    style={{ color: 'rgba(96,165,250,.7)' }}>
                    <span className="font-lato text-[11px]">+ consumo mensual por uso de IA</span>
                    <ChevronDown size={12} className={`transition-transform ${showCalc ? 'rotate-180' : ''}`} />
                  </button>
                  {showCalc && (
                    <div className="mt-3 p-3 rounded-xl border" style={{ background: `rgba(37,99,235,.04)`, borderColor: `rgba(37,99,235,.15)` }}>
                      <p className="font-lato text-white/45 text-[11px] mb-3 uppercase tracking-wider">Calculadora de consumo de IA</p>

                      <div className="space-y-3 mb-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="font-lato text-white/35 text-[11px]">Mensajes promedio por conversación</span>
                            <span className="font-poppins font-bold text-white text-[12px]">{mensajesConv}</span>
                          </div>
                          <input type="range" min={2} max={20} step={1}
                            value={mensajesConv}
                            onChange={e => setMensajesConv(Number(e.target.value))}
                            className="w-full" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="font-lato text-white/35 text-[11px]">Conversaciones promedio por mes</span>
                            <span className="font-poppins font-bold text-white text-[12px]">{convsMes}</span>
                          </div>
                          <input type="range" min={50} max={1000} step={25}
                            value={convsMes}
                            onChange={e => setConvsMes(Number(e.target.value))}
                            className="w-full" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: `rgba(37,99,235,.12)` }}>
                        <div>
                          <span className="font-lato text-white/40 text-[11px]">Consumo estimado</span>
                          <p className="font-lato text-white/25 text-[10px] mt-0.5">USD 0,02 × {mensajesConv} msg × {convsMes} conv</p>
                        </div>
                        <span className="font-poppins font-bold text-[14px] text-[#60a5fa]">
                          ≈ USD {consumoIAUSD}/mes
                        </span>
                      </div>
                      <p className="font-lato text-white/25 text-[10px] mt-2 leading-relaxed">
                        Estimación referencial a USD 0,02 por mensaje. El consumo real varía según el volumen de conversaciones y la duración de cada interacción.
                      </p>
                    </div>
                  )}
                </div>

                {/* Soporte y Operaciones */}
                <div className="px-5 py-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-poppins font-bold text-[12px] text-[#f472b6]">Soporte y Operaciones</p>
                      <p className="font-lato text-white/40 text-[11px]">Mejora continua · hasta 8 horas/mes</p>
                    </div>
                    <span className="font-poppins font-bold text-white text-[13px] flex-shrink-0">Incluido</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                    {[
                      'Ajustes al bot y flujos de automatización',
                      'Reentrenamiento del agente IA con nueva información',
                      'Soporte ante errores o cambios en la plataforma',
                      'Revisión mensual de métricas de conversación',
                    ].map(item => (
                      <div key={item} className="flex items-start gap-1.5">
                        <CheckCircle size={11} className="text-[#f472b6] flex-shrink-0 mt-0.5" />
                        <span className="font-lato text-white/40 text-[11px] leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-5 py-3 flex justify-between items-center" style={{ background: `rgba(37,99,235,.05)` }}>
                  <span className="font-poppins font-black text-white text-[13px]">Base mensual</span>
                  <div className="text-right">
                    <span className="font-poppins font-black text-[#60a5fa] block">USD 240</span>
                    <span className="font-lato text-white/30 text-[10px]">+ consumo IA variable</span>
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
              Los valores están expresados en dólares estadounidenses (USD) y no incluyen impuestos locales. Las licencias de Plataforma Sixteam están incluidas en el costo mensual recurrente. Cada fase se contrata y paga de forma independiente al inicio de la misma. El soporte y operaciones se activa una vez finalizada la Fase 1.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ TÉRMINOS ═════════════════════ */}
      <section id="terminos" ref={s6.ref as React.RefObject<HTMLElement>}
        className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
                texto: 'Cada fase se factura y cancela al inicio de la misma mediante transferencia bancaria o el método acordado, en dólares estadounidenses (USD). Los servicios mensuales se facturan al inicio de cada período.',
              },
              {
                num: '03',
                titulo: 'Alcance y entregables',
                texto: 'El alcance de esta propuesta se limita a los entregables descritos en cada fase. Cualquier ajuste, adición o modificación fuera del alcance acordado será cotizado por separado y aprobado por escrito antes de su ejecución.',
              },
              {
                num: '04',
                titulo: 'Responsabilidades del cliente',
                texto: 'El cliente se compromete a: (a) designar un punto de contacto para la coordinación, (b) aprobar entregables en máximo 5 días hábiles desde su presentación, (c) suministrar información del negocio (FAQ, precios, convenios) al inicio de cada fase. Los retrasos en estas responsabilidades pueden afectar los plazos.',
              },
              {
                num: '05',
                titulo: 'Confidencialidad',
                texto: 'La información compartida entre las partes en el marco de esta propuesta y su ejecución se considera confidencial. Ambas partes se comprometen a no divulgar información sensible del negocio a terceros sin autorización escrita previa.',
              },
              {
                num: '06',
                titulo: 'Propiedad intelectual',
                texto: 'Una vez canceladas todas las fases contratadas, los entregables — configuraciones del CRM, flujos de automatización y bot IA — son propiedad del cliente. Sixteam.pro retiene el derecho de referenciar el proyecto en su portafolio con autorización del cliente.',
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
                  style={{ color: '#60a5fa', borderColor: `rgba(37,99,235,.25)`, background: `rgba(37,99,235,.06)` }}>
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
      <section id="vigencia" ref={s7.ref as React.RefObject<HTMLElement>}
        className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${s7.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Vigencia y Cierre</TagLabel>
          <SectionTitle>¿Cuándo empezamos?</SectionTitle>
          <Rule />

          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="font-lato text-white/65 leading-relaxed mb-6" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
                Esta propuesta tiene una vigencia de <strong className="text-white">30 días calendario</strong> a partir de su fecha de emisión, hasta el <strong className="text-white">27 de junio de 2026</strong>.
              </p>
              <p className="font-lato text-white/65 leading-relaxed mb-8" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
                Para iniciar: confirmación de las fases a contratar, firma del acuerdo de servicios y pago de la Fase 1. La implementación arranca en los 3 días hábiles siguientes al pago.
              </p>

              <div className="space-y-3">
                {[
                  { paso: '01', label: 'Confirmar fases a contratar' },
                  { paso: '02', label: 'Firma del acuerdo de servicios' },
                  { paso: '03', label: 'Pago de la Fase 1 — USD 800' },
                  { paso: '04', label: 'Kick-off en ≤ 3 días hábiles' },
                ].map(({ paso, label }) => (
                  <div key={paso} className="flex items-center gap-3">
                    <span className="font-poppins font-black text-[13px] w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0"
                      style={{ color: '#60a5fa', borderColor: `rgba(37,99,235,.3)`, background: `rgba(37,99,235,.06)` }}>
                      {paso}
                    </span>
                    <span className="font-lato text-white/65 text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {/* Card de contacto */}
              <div className="rounded-2xl p-6 border" style={{ background: `rgba(37,99,235,.04)`, borderColor: `rgba(37,99,235,.15)` }}>
                <p className="font-lato text-white/40 text-[12px] uppercase tracking-wider mb-4">Contacto Sixteam.pro</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                    <img src="/sixteam-logo.png" alt="Sixteam.pro" className="w-full h-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <div>
                    <p className="font-poppins font-bold text-white">Sixteam.pro</p>
                    <p className="font-lato text-white/40 text-sm">Innovación y Estrategia Digital</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Elaborado por', val: `${META.elaboradaPor} · ${META.cargoElaborador}` },
                    { label: 'Correo',        val: META.correo         },
                    { label: 'NIT',           val: META.nit            },
                    { label: 'RL',            val: META.rl             },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex justify-between gap-4">
                      <span className="font-lato text-white/35">{label}</span>
                      <span className="font-lato text-white/65 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fórmula Sixteam */}
              <div className="rounded-2xl p-5 border text-center" style={{ background: 'rgba(255,255,255,.02)', borderColor: 'rgba(255,255,255,.07)' }}>
                <p className="font-poppins font-black text-white/70 text-sm tracking-wide">
                  Process + Technology + People
                </p>
                <p className="font-poppins font-black text-sm mt-1" style={{ color: NS_BLUE }}>
                  = Growth
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 lg:px-20 py-8 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span className="font-poppins font-black text-white/30 text-sm">
            Sixteam<span style={{ color: NS_BLUE }}>.</span>pro
          </span>
          <p className="font-lato text-white/20 text-[12px]">
            Propuesta confidencial · {META.cliente} · {META.fecha}
          </p>
        </div>
      </footer>

    </div>
  );
};

export default NutsportProposal;
