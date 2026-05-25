import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, ChevronRight, ChevronDown, FileText, Zap,
  AlertCircle, ArrowRight, Building2,
  Calendar, Hash, User, Info, MapPin, Mail,
  Target, Settings, GraduationCap,
  ShoppingCart, CreditCard, Users, Award, BookOpen,
  MessageSquare, BarChart3, Monitor, Bot,
} from 'lucide-react';
import PDFButton from '../components/PDFButton';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Stunet Education Agency',
  programa: 'Mi Primer Millón',
  sigla: 'MPM',
  tagline: 'Ecosistema de marketing y ventas digital',
  sector: 'EdTech · Educación Financiera · Niños y Adolescentes',
  alcance: 'Colombia · Latinoamérica',
  fecha: 'Mayo 2026',
  lugar: 'Barranquilla, Colombia',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  objetivo:
    'Diseño e implementación del ecosistema de marketing y ventas digital para Mi Primer Millón: pauta digital, CRM, tres landing pages, pasarela de pago, plataforma del curso con entrega de accesos y agente IA de atención inicial. Todo en un solo sistema conectado.',
};

const MPM_GOLD = '#d4af37';

// ─── COMPONENTES DEL ECOSISTEMA ──────────────────────────────────────────────

const COMPONENTES = [
  {
    id: 'pauta',
    num: '01',
    nombre: 'Pauta Digital',
    subtitulo: 'Meta Ads + CAPI',
    desc: 'Campañas en Meta Ads con audiencias de padres de alto poder adquisitivo. CAPI configurado para devolver eventos de compra al servidor de Meta y entrenar el algoritmo con datos reales.',
    icon: Target,
    tint: 'blue',
    precio: null as null | { impl?: string; mensual?: string; nota?: string },
    items: [
      'Estructura de campañas Tráfico → Conversión',
      'Audiencias por comportamiento (viajeros, ejecutivos)',
      'Audiencias personalizadas y similares (lookalike)',
      'CAPI — Conversions API de Meta integrada al CRM',
      'Brief de creativos para equipo de contenido',
      'Píxel y Events Manager validados sin duplicados',
    ],
  },
  {
    id: 'crm',
    num: '02',
    nombre: 'CRM',
    subtitulo: 'Plataforma Sixteam · Pipeline de ventas',
    desc: 'Sistema de gestión de leads y ventas: pipeline comercial, historial del prospecto, etiquetas por plan (Standard / Premium), automatizaciones de seguimiento y reportería de rendimiento.',
    icon: BarChart3,
    tint: 'teal',
    precio: { impl: 'COP 500.000', mensual: 'COP 650.000/mes' },
    items: [
      'Subaccount MPM configurado en Plataforma Sixteam',
      'Pipeline de ventas con etapas definidas',
      'Campos personalizados para datos del prospecto',
      'Etiquetado automático Standard vs. Premium',
      'Automatizaciones de seguimiento y tareas',
      'Usuarios, roles y permisos del equipo',
    ],
  },
  {
    id: 'landings',
    num: '03',
    nombre: '3 Landing Pages',
    subtitulo: 'Captura · Ventas · Upsell',
    desc: 'Tres páginas construidas en Plataforma Sixteam con copy y estructura orientados a conversión. El diseño se realiza con referencia aprobada por el cliente. El contenido (textos, imágenes, copy) debe ser proporcionado por el cliente.',
    icon: Monitor,
    tint: 'amber',
    precio: { impl: 'COP 1.200.000', nota: 'Contenido e imágenes aportados por el cliente.' },
    items: [
      'Landing 1: Lead Magnet (captura de contactos)',
      'Landing 2: Página de ventas Plan Standard ($99.99 USD)',
      'Landing 3: Upsell Plan Premium ($599.99 USD) — 1 clic',
      'Order forms integrados a Mercado Pago',
      'Thank You Page con instrucciones de acceso',
      'Integración formularios → CRM con todos los campos',
    ],
  },
  {
    id: 'pago',
    num: '04',
    nombre: 'Pasarela de Pago',
    subtitulo: 'Mercado Pago · Upsell 1 clic',
    desc: 'Integración nativa de Mercado Pago en Plataforma Sixteam — la opción más adoptada en Colombia. El upsell reutiliza el token de pago capturado en el checkout base: el padre compra el Premium sin volver a ingresar su tarjeta.',
    icon: CreditCard,
    tint: 'green',
    precio: { impl: 'COP 1.000.000' },
    items: [
      'Integración nativa Mercado Pago ↔ Plataforma Sixteam',
      'Checkout Plan Standard ($99.99 USD)',
      'Upsell 1 clic Plan Premium ($599.99 USD)',
      'Configuración de "Upsell Product" sin reingreso de tarjeta',
      'Webhook de confirmación de pago al CRM',
      'Pruebas E2E de flujo completo de compra',
    ],
  },
  {
    id: 'plataforma',
    num: '05',
    nombre: 'Plataforma del Curso',
    subtitulo: 'LMS · Membresías · Accesos automáticos',
    desc: 'Área de miembros en Plataforma Sixteam con los módulos del programa. Tras la compra confirmada, el sistema entrega las credenciales de acceso automáticamente por WhatsApp y correo — sin intervención del equipo.',
    icon: BookOpen,
    tint: 'red',
    precio: { impl: 'COP 500.000', mensual: 'COP 350.000/mes' },
    items: [
      'Área de miembros MPM en Plataforma Sixteam LMS',
      'Estructura de módulos Standard y Premium',
      'Entrega automática de accesos tras compra (WhatsApp + email)',
      'Restricción de contenido por plan adquirido',
      'Flujo de bienvenida y onboarding del alumno',
      'Panel de progreso del estudiante',
    ],
  },
  {
    id: 'agente-ia',
    num: '06',
    nombre: 'Agente IA Atención Inicial',
    subtitulo: 'Bot de ventas · Speed to Lead',
    desc: 'Agente de IA que responde al lead en los primeros 5 minutos, califica el prospecto, resuelve objeciones frecuentes y lo deriva al Student Coach cuando está listo para cerrar. Disponible 24/7 en WhatsApp.',
    icon: MessageSquare,
    tint: 'purple',
    precio: { impl: 'COP 500.000' },
    items: [
      'Bot IA entrenado con el programa MPM y objeciones comunes',
      'Respuesta automática < 5 min tras captura del lead',
      'Flujo de calificación (edad del hijo, interés, presupuesto)',
      'Envío automático de video de presentación del programa',
      'Handoff bot → Student Coach con ficha completa del prospecto',
      'Recuperación de carrito abandonado (email + WhatsApp)',
    ],
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber:  { text: 'text-amber-400',    bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)' },
  teal:   { text: 'text-[#00bfa5]',   bg: 'rgba(0,191,165,.07)',   border: 'rgba(0,191,165,.18)'  },
  blue:   { text: 'text-[#60a5fa]',   bg: 'rgba(96,165,250,.07)',  border: 'rgba(96,165,250,.18)' },
  red:    { text: 'text-[#f87171]',   bg: 'rgba(221,51,51,.07)',   border: 'rgba(221,51,51,.2)'   },
  green:  { text: 'text-[#d4af37]',   bg: 'rgba(212,175,55,.07)',   border: 'rgba(212,175,55,.18)'  },
  purple: { text: 'text-[#c084fc]',   bg: 'rgba(192,132,252,.07)', border: 'rgba(192,132,252,.18)' },
};

// ─── FASES ────────────────────────────────────────────────────────────────────

const FASES = [
  {
    num: 'Fase 1',
    nombre: 'CRM + Infraestructura base',
    duracion: '1–2 semanas',
    valor: 'COP 500.000',
    mensual: 'COP 650.000/mes',
    recomendada: true,
    icon: Settings,
    tint: 'teal',
    entregables: [
      'Subaccount MPM configurado en Plataforma Sixteam',
      'Pipeline de ventas con etapas y responsables',
      'Campos personalizados para contactos (hasta 15)',
      'Automatizaciones críticas: recordatorios, tareas, cambios de etapa',
      'Usuarios, roles y permisos',
      'Capacitación funcional del equipo (hasta 2 horas)',
    ],
    detalle: [
      'Ambiente limpio y separado para Mi Primer Millón dentro de Plataforma Sixteam. Base sobre la que se construyen el resto de los componentes del ecosistema.',
      'Pipeline comercial con etapas definidas para el proceso de ventas del Student Coach — desde el primer contacto hasta el pago confirmado.',
      'Automatizaciones de seguimiento: recordatorios automáticos, asignación de tareas y cambios de etapa que reducen la carga manual del equipo.',
    ],
  },
  {
    num: 'Fase 2',
    nombre: 'Pauta Digital — Meta Ads + CAPI',
    duracion: '1 semana',
    valor: null as string | null,
    mensual: null as string | null,
    recomendada: true,
    icon: Target,
    tint: 'blue',
    entregables: [
      'Estructura de campañas Meta Ads (Tráfico → Conversión)',
      'Audiencias segmentadas por comportamiento de alto PA',
      'Audiencias personalizadas (visitantes, leads) y similares',
      'Implementación de CAPI (Conversions API)',
      'Validación en Events Manager sin duplicados',
      'Brief de creativos para el equipo de contenido',
    ],
    detalle: [
      'Dado que Meta restringe la segmentación por ingresos en Colombia, las audiencias se construyen por comportamientos de alto poder adquisitivo: viajeros internacionales, directores ejecutivos, propietarios de negocio.',
      'CAPI configurado dentro de Plataforma Sixteam: el CRM devuelve eventos de compra y lead directamente al servidor de Meta. El algoritmo aprende de datos reales y mejora la calidad del tráfico en cada iteración.',
      'Brief de creativos con los ángulos de mensaje, formatos recomendados y referencias visuales — para que el equipo de contenido produzca piezas alineadas a la estrategia.',
    ],
  },
  {
    num: 'Fase 3',
    nombre: '3 Landing Pages',
    duracion: '2 semanas',
    valor: 'COP 1.200.000',
    mensual: null as string | null,
    recomendada: true,
    icon: Monitor,
    tint: 'amber',
    entregables: [
      'Landing 1: Lead Magnet (captura de contactos)',
      'Landing 2: Página de ventas Plan Standard ($99.99 USD) + order form',
      'Landing 3: Upsell Plan Premium ($599.99 USD) — 1 clic',
      'Thank You Page con instrucciones de acceso',
      'Diseño con referencia aprobada por el cliente',
      'Contenido (textos e imágenes) aportado por el cliente',
    ],
    detalle: [
      'Las tres páginas se construyen en Plataforma Sixteam con estructura orientada a conversión. El diseño se realiza sobre una referencia aprobada en conjunto con el cliente.',
      'El contenido — textos, copy, imágenes, logotipos y videos — debe ser entregado por el cliente antes del inicio de esta fase. Sixteam monta y publica; no redacta el copy del programa.',
      'Cada landing queda conectada al CRM para trazabilidad completa desde el primer clic hasta la compra.',
    ],
  },
  {
    num: 'Fase 4',
    nombre: 'Pasarela de Pago + Plataforma del Curso',
    duracion: '1–2 semanas',
    valor: 'COP 1.500.000',
    mensual: 'COP 350.000/mes',
    recomendada: true,
    icon: BookOpen,
    tint: 'red',
    entregables: [
      'Integración nativa Mercado Pago ↔ Plataforma Sixteam',
      'Upsell 1 clic Plan Premium (sin reingreso de tarjeta)',
      'Webhook de confirmación de pago al CRM',
      'Área de miembros MPM configurada en LMS',
      'Entrega automática de accesos tras compra (WhatsApp + email)',
      'Pruebas E2E de flujo completo pago → acceso',
    ],
    detalle: [
      'La integración de Mercado Pago permite el upsell de 1 clic: el sistema reutiliza el token de pago del plan Standard para que el padre compre el Premium sin volver a ingresar su tarjeta.',
      'El LMS actúa como área de miembros del programa. El acceso se restringe automáticamente por plan (Standard o Premium) según la etiqueta del CRM.',
      'Tras la compra confirmada (webhook de Mercado Pago), el workflow envía credenciales por WhatsApp y email en menos de 5 minutos — cero intervención del equipo.',
    ],
  },
  {
    num: 'Fase 5',
    nombre: 'Agente IA de Atención Inicial',
    duracion: '1–2 semanas',
    valor: 'COP 500.000',
    mensual: null as string | null,
    recomendada: false,
    icon: MessageSquare,
    tint: 'purple',
    entregables: [
      'Bot IA entrenado con programa MPM y objeciones frecuentes',
      'Respuesta automática < 5 min tras captura del lead (WhatsApp)',
      'Flujo de calificación del prospecto (edad, interés, presupuesto)',
      'Envío automático de video de presentación (max. 60 seg)',
      'Handoff inteligente bot → Student Coach con ficha del lead',
      'Workflow de recuperación de carrito abandonado (email + WhatsApp)',
    ],
    detalle: [
      'El agente responde al lead en los primeros 5 minutos de forma personalizada. Cada minuto sin contacto reduce la tasa de cierre hasta un 80% — el bot garantiza la ventana crítica sin depender de la disponibilidad del equipo.',
      'El bot califica al prospecto (edad del hijo, nivel de interés, presupuesto estimado) y le envía un video de presentación de MPM. Cuando el prospecto está calificado y listo, hace el handoff al Student Coach con toda la ficha completa.',
      'El workflow de recuperación de carrito se activa si el prospecto ingresa sus datos en el checkout pero no completa la compra en 15 minutos — dispara email + WhatsApp de recuperación de forma automática.',
    ],
  },
];

const FASE_POSTLANZAMIENTO = {
  nombre: 'Agente IA de Acompañamiento del Curso',
  subtitulo: 'Post-lanzamiento · Implementación independiente',
  valor: 'COP 2.000.000',
  desc: 'Agente IA que acompaña al alumno durante su proceso dentro del programa. Responde preguntas sobre el contenido del módulo activo, motiva la continuidad, notifica hitos de progreso y escala a soporte humano cuando es necesario. Se activa una vez el programa esté en operación.',
  items: [
    'IA entrenada con el contenido pedagógico de MPM',
    'Respuesta 24/7 a preguntas del módulo activo',
    'Notificaciones de progreso y motivación automática',
    'Escalado a soporte humano para casos complejos',
    'Integrado al LMS y al CRM (historial del alumno visible)',
    'Implementación: ≥ 2 semanas post-lanzamiento del programa',
  ],
};

const SECCIONES = [
  { id: 'resumen',      label: 'Resumen'      },
  { id: 'ecosistema',   label: 'Ecosistema'   },
  { id: 'plan',         label: 'Plan'         },
  { id: 'cotizacion',   label: 'Cotización'   },
  { id: 'vigencia',     label: 'Vigencia'     },
];

// Implementaciones únicas: CRM 500K + Landings 1.200K + Pago+Plataforma 1.500K + Agente IA 500K = 3.700.000
// Mensual: CRM 650K + Plataforma 350K = 1.000.000/mes
const TOTAL_IMPL    = 'COP 3.700.000';
const TOTAL_MENSUAL = 'COP 1.000.000/mes';
const TOTAL_POST    = 'COP 2.000.000';

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
  const s4 = useVisible(); const s5 = useVisible();

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

            {/* Texto */}
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

            {/* Mapa del ecosistema */}
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

                {/* Post-lanzamiento */}
                <div className="col-span-2 rounded-xl p-4 border flex items-start gap-3"
                  style={{ background: 'rgba(192,132,252,.05)', borderColor: 'rgba(192,132,252,.18)', borderStyle: 'dashed' }}>
                  <Bot size={16} className="text-[#c084fc] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-poppins font-bold text-[13px] text-[#c084fc]">07 Agente IA de Acompañamiento</p>
                    <p className="font-lato text-white/40 text-[11px] mt-0.5">Post-lanzamiento · COP 2.000.000 · implementación independiente</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metadatos */}
        <div className="relative z-10 px-6 md:px-12 lg:px-20 pb-10">
          <div className="max-w-6xl mx-auto flex flex-wrap gap-6 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
            {[
              { icon: Building2, label: 'Cliente', val: META.cliente },
              { icon: Calendar,  label: 'Fecha',   val: META.fecha   },
              { icon: MapPin,    label: 'Alcance',  val: META.alcance },
              { icon: User,      label: 'RL',       val: META.rl      },
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
                <strong className="text-white">Mi Primer Millón</strong> es el programa de educación financiera de Stunet Education Agency para niños y adolescentes. Sixteam.pro diseñará e implementará el ecosistema de marketing y ventas digital que lleva a MPM desde el primer anuncio hasta un alumno activo dentro de la plataforma.
              </p>
              <p className="font-lato text-white/65 leading-relaxed mb-8" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
                El ecosistema cubre los <strong className="text-white">6 componentes críticos</strong> del proceso: pauta digital con trazabilidad real, CRM de ventas, tres landing pages optimizadas, pasarela de pago con upsell de 1 clic, plataforma del curso con entrega automática de accesos y agente IA de atención inicial 24/7. Todo conectado, todo trazable.
              </p>

              {/* Flujo visual simplificado */}
              <div className="space-y-2">
                <p className="font-lato text-white/30 text-[12px] uppercase tracking-wider mb-3">Flujo del prospecto al alumno</p>
                {[
                  { paso: 'Anuncio en Meta Ads', sub: 'Audiencia de padres · alto PA' },
                  { paso: 'Lead Magnet', sub: 'Landing 1 · CRM recibe el contacto' },
                  { paso: 'Agente IA responde < 5 min', sub: 'WhatsApp · calificación y video' },
                  { paso: 'Checkout · Upsell 1 clic', sub: 'Landing 2 y 3 · Mercado Pago' },
                  { paso: 'Acceso automático al curso', sub: 'WhatsApp + email · LMS' },
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
                    { label: 'Sector',      val: META.sector      },
                    { label: 'Alcance',     val: META.alcance     },
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
                    <span className="font-lato text-white/60 text-sm">Implementaciones (pago único)</span>
                    <span className="font-poppins font-bold text-white">{TOTAL_IMPL}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-lato text-white/60 text-sm">CRM + Plataforma (mensual)</span>
                    <span className="font-poppins font-bold text-white">{TOTAL_MENSUAL}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                    <span className="font-lato text-white/50 text-sm">Agente IA Acompañamiento (post-lanzamiento)</span>
                    <span className="font-poppins font-bold" style={{ color: MPM_GOLD }}>{TOTAL_POST}</span>
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
          <SectionTitle>Los 6 componentes del sistema</SectionTitle>
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

          {/* Post-lanzamiento callout */}
          <div className="mt-6 rounded-2xl p-6 border" style={{ borderColor: 'rgba(192,132,252,.2)', background: 'rgba(192,132,252,.05)', borderStyle: 'dashed' }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0"
                style={{ background: 'rgba(192,132,252,.1)', borderColor: 'rgba(192,132,252,.3)' }}>
                <Bot size={18} className="text-[#c084fc]" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <span className="font-poppins font-bold text-white">07 · {FASE_POSTLANZAMIENTO.nombre}</span>
                  <span className="font-lato text-[11px] px-2.5 py-1 rounded-full border"
                    style={{ color: '#c084fc', borderColor: 'rgba(192,132,252,.3)', background: 'rgba(192,132,252,.08)' }}>
                    Post-lanzamiento
                  </span>
                  <span className="font-poppins font-black text-[13px] text-[#c084fc]">{FASE_POSTLANZAMIENTO.valor}</span>
                </div>
                <p className="font-lato text-white/55 text-sm leading-relaxed mb-4">{FASE_POSTLANZAMIENTO.desc}</p>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                  {FASE_POSTLANZAMIENTO.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle size={13} className="text-[#c084fc] flex-shrink-0 mt-0.5" />
                      <span className="font-lato text-white/55 text-[13px]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
            Las 5 fases se implementan de forma consecutiva en un plazo estimado de <strong className="text-white">6–8 semanas</strong>. El Agente IA de Acompañamiento se activa post-lanzamiento de forma independiente.
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
                return (
                  <React.Fragment key={i}>
                    <div className="flex flex-col items-center min-w-[110px] flex-shrink-0">
                      <div className="w-3 h-3 rounded-full flex-shrink-0 mb-2" style={{ background: t.text.replace('text-[', '').replace(']', '').replace('text-', '') === 'amber-400' ? '#fbbf24' : t.text.includes('00bfa5') ? '#00bfa5' : t.text.includes('60a5fa') ? '#60a5fa' : t.text.includes('f87171') ? '#f87171' : t.text.includes('d4af37') ? '#d4af37' : '#c084fc' }} />
                      <p className="font-poppins font-bold text-[11px] text-white/70 text-center">{fase.num}</p>
                      <p className="font-lato text-[10px] text-white/35 text-center mt-0.5">{fase.duracion}</p>
                    </div>
                    {i < FASES.length - 1 && (
                      <div className="flex-1 h-px mt-1.5 mx-1" style={{ background: 'rgba(255,255,255,.1)', minWidth: 20 }} />
                    )}
                  </React.Fragment>
                );
              })}
              <div className="w-px h-6 mt-1.5 mx-3" style={{ background: 'rgba(192,132,252,.3)' }} />
              <div className="flex flex-col items-center min-w-[130px] flex-shrink-0">
                <div className="w-3 h-3 rounded-full flex-shrink-0 mb-2" style={{ background: '#c084fc' }} />
                <p className="font-poppins font-bold text-[11px] text-[#c084fc] text-center">Post-lanzamiento</p>
                <p className="font-lato text-[10px] text-white/35 text-center mt-0.5">Agente IA Acompañamiento</p>
              </div>
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

          {/* Tres bloques de cotización */}
          <div className="grid md:grid-cols-3 gap-5 mb-6">

            {/* Bloque 1: Implementaciones únicas */}
            <div className="md:col-span-1 rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,.08)' }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,.06)', background: 'rgba(255,255,255,.03)' }}>
                <p className="font-lato text-white/45 text-[12px] uppercase tracking-wider">Implementación</p>
                <p className="font-lato text-white/30 text-[11px]">Pago único por componente</p>
              </div>
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
                {[
                  { comp: '02 CRM', label: 'Ajustes y configuración', val: 'COP 500.000', t: 'teal' },
                  { comp: '03 Landing Pages', label: '3 páginas con diseño ref.', val: 'COP 1.200.000', t: 'amber' },
                  { comp: '04 Pasarela + Plataforma', label: 'Mercado Pago + LMS', val: 'COP 1.500.000', t: 'red' },
                  { comp: '05 Agente IA Inicial', label: 'Implementación del bot', val: 'COP 500.000', t: 'purple' },
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
                  <span className="font-poppins font-black text-white text-[13px]">Total impl.</span>
                  <span className="font-poppins font-black" style={{ color: MPM_GOLD }}>{TOTAL_IMPL}</span>
                </div>
              </div>
            </div>

            {/* Bloque 2: Costos mensuales */}
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(0,191,165,.2)' }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: 'rgba(0,191,165,.1)', background: 'rgba(0,191,165,.04)' }}>
                <p className="font-lato text-[#00bfa5] text-[12px] uppercase tracking-wider">Mensual recurrente</p>
                <p className="font-lato text-white/30 text-[11px]">Costo operativo continuo</p>
              </div>
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
                <div className="px-5 py-4 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-poppins font-bold text-[12px] text-[#00bfa5]">02 CRM</p>
                    <p className="font-lato text-white/40 text-[11px]">Plataforma Sixteam</p>
                  </div>
                  <span className="font-poppins font-bold text-white text-[13px]">COP 650.000</span>
                </div>
                <div className="px-5 py-4 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-poppins font-bold text-[12px] text-[#f87171]">05 Plataforma Curso</p>
                    <p className="font-lato text-white/40 text-[11px]">LMS + membresías</p>
                  </div>
                  <span className="font-poppins font-bold text-white text-[13px]">COP 350.000</span>
                </div>
                <div className="px-5 py-4 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-poppins font-bold text-[12px] text-[#60a5fa]">01 Pauta Digital</p>
                    <p className="font-lato text-white/40 text-[11px]">Gestión asesorada</p>
                  </div>
                  <span className="font-lato text-white/40 text-[12px] italic">Incluida</span>
                </div>
                <div className="px-5 py-3 flex justify-between items-center" style={{ background: 'rgba(0,191,165,.05)' }}>
                  <span className="font-poppins font-black text-white text-[13px]">Total mensual</span>
                  <span className="font-poppins font-black text-[#00bfa5]">{TOTAL_MENSUAL}</span>
                </div>
              </div>
            </div>

            {/* Bloque 3: Post-lanzamiento */}
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(192,132,252,.2)', borderStyle: 'dashed' }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: 'rgba(192,132,252,.15)', background: 'rgba(192,132,252,.04)' }}>
                <p className="font-lato text-[#c084fc] text-[12px] uppercase tracking-wider">Post-lanzamiento</p>
                <p className="font-lato text-white/30 text-[11px]">Implementación independiente</p>
              </div>
              <div className="px-5 py-5 flex-1">
                <div className="flex items-start gap-3 mb-4">
                  <Bot size={16} className="text-[#c084fc] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-poppins font-bold text-white text-[14px]">Agente IA de Acompañamiento</p>
                    <p className="font-lato text-white/45 text-[12px] mt-1 leading-relaxed">Acompaña al alumno dentro del programa: responde preguntas del módulo activo, motiva la continuidad y escala a soporte humano.</p>
                  </div>
                </div>
                <div className="space-y-1 mb-5">
                  {['IA entrenada con el contenido de MPM', 'Respuesta 24/7 dentro del LMS', 'Notificaciones de progreso automáticas', 'Escalado a soporte humano'].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle size={12} className="text-[#c084fc]" />
                      <span className="font-lato text-white/50 text-[12px]">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl px-4 py-3 flex justify-between items-center" style={{ background: 'rgba(192,132,252,.08)', border: '1px solid rgba(192,132,252,.2)' }}>
                  <span className="font-poppins font-bold text-[#c084fc] text-[13px]">Implementación</span>
                  <span className="font-poppins font-black text-[#c084fc] text-lg">{TOTAL_POST}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nota */}
          <div className="rounded-xl px-5 py-4 border flex items-start gap-3"
            style={{ background: 'rgba(255,255,255,.02)', borderColor: 'rgba(255,255,255,.07)' }}>
            <Info size={15} className="text-white/30 flex-shrink-0 mt-0.5" />
            <p className="font-lato text-white/45 text-sm leading-relaxed">
              Los valores no incluyen IVA (19%). Las licencias de Plataforma Sixteam, Zapier ni el presupuesto de pauta de Meta Ads están incluidos en esta propuesta — son costos operativos del cliente. Cada fase se contrata y paga de forma independiente al cierre de la misma.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ VIGENCIA ═════════════════════ */}
      <section id="vigencia" ref={s5.ref as React.RefObject<HTMLElement>}
        className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Vigencia y Cierre</TagLabel>
          <SectionTitle>¿Cuándo empezamos?</SectionTitle>
          <Rule />

          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="font-lato text-white/65 leading-relaxed mb-6" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
                Esta propuesta tiene una vigencia de <strong className="text-white">30 días calendario</strong> a partir de su fecha de emisión, hasta el <strong className="text-white">11 de junio de 2026</strong>.
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
                <p className="font-lato text-white/40 text-[12px] uppercase tracking-wider mb-4">Contacto</p>
                <p className="font-poppins font-bold text-white text-lg mb-1">{META.rl}</p>
                <p className="font-lato text-white/50 text-sm mb-3">{META.proponente}</p>
                <div className="space-y-2">
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

              <div className="rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,.02)', borderColor: 'rgba(255,255,255,.07)' }}>
                <p className="font-lato text-white/40 text-[12px] uppercase tracking-wider mb-3">Descargar propuesta</p>
                <p className="font-lato text-white/50 text-sm mb-4">Exporta esta propuesta como PDF para compartir con el equipo o conservar como referencia.</p>
                <PDFButton filename="propuesta-mpm-sixteam.pdf" elementId="proposal-root" label="Exportar PDF" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ FOOTER ═══════════════════════ */}
      <footer className="px-6 md:px-12 lg:px-20 py-10 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
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
      </footer>

    </div>
  );
};

export default MpmProposal;
