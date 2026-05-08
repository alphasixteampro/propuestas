import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, ChevronRight, ChevronDown, FileText, Zap,
  AlertCircle, ArrowRight, Building2,
  Calendar, Hash, User, Info, MapPin, Mail,
  Target, Settings, GraduationCap,
  ShoppingCart, CreditCard, Users, Award, BookOpen,
  RefreshCw, Star,
} from 'lucide-react';
import PDFButton from '../components/PDFButton';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Stunet Education Agency',
  programa: 'Mi Primer Millón',
  sigla: 'MPM',
  tagline: 'Educa el dinero, transforma el futuro',
  sector: 'EdTech · Educación Financiera Temprana · Niños y Adolescentes',
  alcance: 'Colombia · Latinoamérica',
  fecha: 'Mayo 2026',
  lugar: 'Barranquilla, Colombia',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  objetivo:
    'Diseño e implementación del ecosistema digital completo para Mi Primer Millón: desde la captación de prospectos via Meta Ads + CAPI hasta la retención gamificada en el LMS, pasando por checkout optimizado, upsell de 1 clic, recuperación de carrito abandonado y facturación electrónica conforme a la DIAN.',
};

const MPM_GREEN = '#22c55e';

const PROGRAMAS = [
  {
    plan: 'Standard',
    precio: '$99.99',
    moneda: 'USD / año',
    color: '#1d70a2',
    icon: BookOpen,
    items: [
      '32 módulos anuales',
      'Video por módulo',
      'Ebook + Audiobook',
      'Workbook + Audiobook',
      'Family Guide',
      'GPT Tutor 24/7 — "Tío Mike"',
    ],
    enfoque: 'Formar pensamiento, hábitos y criterio financiero.',
  },
  {
    plan: 'Premium',
    precio: '$599.99',
    moneda: 'USD / año',
    color: MPM_GREEN,
    icon: Award,
    items: [
      'Todo lo del plan Standard',
      'Charlas y talleres con empresarios',
      'MPM Venture (acelerador de emprendimiento)',
      'Presentación de proyectos tipo Pitch',
      'MPM Summit — eventos y comunidad',
      'Acceso a red de mentores',
    ],
    enfoque: 'Pasar de aprender a aplicar, crear y exponerse al mundo real.',
  },
];

const PROBLEMAS = [
  {
    titulo: 'El colegio no enseña sobre el dinero',
    desc: 'La mayoría de adultos aprende finanzas tarde, a través de errores con impacto financiero y emocional. Sin educación financiera desde la infancia, el ciclo generacional de desconocimiento se repite.',
    icon: GraduationCap,
    tint: 'amber',
  },
  {
    titulo: 'Funnel sin trazabilidad ni señales de calidad',
    desc: 'Sin CAPI activo, Meta Ads optimiza con datos incompletos y atrae prospectos de baja calidad. Cada minuto sin contacto post-lead reduce la probabilidad de cierre hasta un 80% — y sin automatización el equipo llega tarde.',
    icon: AlertCircle,
    tint: 'red',
  },
  {
    titulo: 'Fricción en el checkout destruye el upsell',
    desc: 'Un proceso que obliga a reingresar tarjeta para el plan Premium mata la conversión del upsell. Sin un flujo de 1 clic, el potencial de $499 por cliente queda sobre la mesa en cada venta.',
    icon: ShoppingCart,
    tint: 'blue',
  },
  {
    titulo: 'Carritos abandonados sin recuperar',
    desc: 'Sin un workflow de recuperación activo, cada prospecto que llega al checkout y no compra es dinero perdido. WhatsApp + email automatizados pueden recuperar hasta un 15% de esos carritos en las primeras horas.',
    icon: RefreshCw,
    tint: 'teal',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber:  { text: 'text-amber-400',    bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)' },
  teal:   { text: 'text-[#00bfa5]',   bg: 'rgba(0,191,165,.07)',   border: 'rgba(0,191,165,.18)'  },
  blue:   { text: 'text-[#60a5fa]',   bg: 'rgba(96,165,250,.07)',  border: 'rgba(96,165,250,.18)' },
  red:    { text: 'text-[#f87171]',   bg: 'rgba(221,51,51,.07)',   border: 'rgba(221,51,51,.2)'   },
  green:  { text: 'text-[#22c55e]',   bg: 'rgba(34,197,94,.07)',   border: 'rgba(34,197,94,.18)'  },
};

const FLUJOS = [
  {
    num: '01',
    nombre: 'Adquisición y Seguimiento (Tráfico)',
    resumen: 'Meta Ads con audiencias de alto poder adquisitivo + CAPI para entrenar el algoritmo con datos reales de conversión.',
    icon: Target,
    tint: 'blue',
    pasos: [
      {
        titulo: 'Segmentación por comportamiento en Meta Ads',
        desc: 'Dado que Meta restringe la segmentación directa por ingresos en Colombia, las audiencias apuntan a comportamientos de alto PA: viajeros internacionales frecuentes, directores ejecutivos, propietarios de negocio. Padres con criterio de inversión en educación de sus hijos.',
      },
      {
        titulo: 'Lead Magnet + Landing Page de Captura',
        desc: 'El tráfico llega a una landing page en GoHighLevel para descargar un recurso gratuito. El lead entra al CRM con datos clave: nombre, WhatsApp, ciudad, edad del hijo y fuente del anuncio — trazabilidad desde el primer clic.',
      },
      {
        titulo: 'CAPI — Conversions API de Meta',
        desc: 'La API de Conversiones se configura dentro de GoHighLevel. El CRM devuelve eventos de leads y compras directamente al servidor de Meta, sin depender del píxel del navegador. El algoritmo aprende de datos reales y busca prospectos más calificados en cada iteración.',
      },
    ],
  },
  {
    num: '02',
    nombre: 'Embudo de Ventas — Checkout + Upsell de 1 Clic',
    resumen: 'Checkout con Mercado Pago nativo en GoHighLevel + oferta Premium de 1 clic que reutiliza el token de pago capturado.',
    icon: CreditCard,
    tint: 'green',
    pasos: [
      {
        titulo: 'Checkout Base — Plan Standard ($99.99 USD)',
        desc: 'El padre llega a la página de ventas principal. El formulario de pedido procesa el pago a través de Mercado Pago — integración nativa en GoHighLevel, óptima para el mercado colombiano. Sin redireccionamientos externos.',
      },
      {
        titulo: 'Upsell Automático — Plan Premium ($599.99 USD)',
        desc: 'Inmediatamente después del pago de $99.99, el sistema redirige al usuario a la oferta Premium. Con la acción "Upsell Product", GoHighLevel reutiliza el token de pago capturado en el paso anterior — el padre compra el Premium con 1 clic, sin fricciones y sin volver a ingresar su tarjeta.',
      },
      {
        titulo: 'Thank You Page + Acceso Inmediato',
        desc: 'Página de confirmación con instrucciones claras de acceso al programa, enlace a la comunidad y CTA para compartir con otros padres. Primer momento de la experiencia de marca dentro del ecosistema.',
      },
    ],
  },
  {
    num: '03',
    nombre: 'Recuperación de Carrito Abandonado',
    resumen: 'Workflow en GoHighLevel que detecta abandonos del checkout y dispara secuencia de recuperación vía email + WhatsApp.',
    icon: RefreshCw,
    tint: 'amber',
    pasos: [
      {
        titulo: 'Disparador: "Abandoned Checkout"',
        desc: 'El workflow se activa si un padre ingresa su correo o teléfono en la página de pago pero no completa la transacción dentro de 15 minutos. El único requisito es que el prospecto haya dejado datos de contacto — suficiente para activar la recuperación.',
      },
      {
        titulo: 'Email de Recuperación',
        desc: 'Correo automático con un enlace que restaura el carrito exactamente donde el usuario lo dejó — sin tener que reiniciar el proceso. Asunto personalizado, tono urgente pero no agresivo.',
      },
      {
        titulo: 'WhatsApp de Recuperación',
        desc: 'Mensaje automatizado de WhatsApp enviado en paralelo al email. Personalizado con el nombre del prospecto, mensaje directo a la acción. WhatsApp tiene tasas de apertura superiores al 90% vs. el 25% del email — aumenta significativamente la tasa de recuperación.',
      },
    ],
  },
  {
    num: '04',
    nombre: 'Cumplimiento y Facturación Electrónica',
    resumen: 'Entrega instantánea de acceso al LMS + factura electrónica DIAN sin intervención manual del equipo.',
    icon: FileText,
    tint: 'teal',
    pasos: [
      {
        titulo: 'Disparador: "Order Submitted"',
        desc: 'El evento se activa tras cada compra exitosa, Standard o Premium. El workflow aplica etiquetas CRM específicas: "Comprador Standard" o "Comprador Premium" — base para segmentación de remarketing, reportería y comunicaciones futuras.',
      },
      {
        titulo: 'Entrega de Acceso al LMS',
        desc: 'WhatsApp de "Utilidad" + correo electrónico con las credenciales de acceso al área de miembros, enviados de forma instantánea. El alumno accede al programa en minutos, no en horas. La experiencia empieza en el momento del pago.',
      },
      {
        titulo: 'Factura Electrónica DIAN vía Zapier',
        desc: 'La integración GoHighLevel ↔ Zapier (via app oficial LeadConnector) envía los datos transaccionales de la compra. Zapier transfiere esta información a Alegra o Siigo para emitir la factura electrónica exigida por la DIAN — proceso 100% desatendido, cero carga administrativa para el equipo MPM.',
      },
    ],
  },
  {
    num: '05',
    nombre: 'Gamificación y Retención en el LMS',
    resumen: '9 niveles de progresión, puntos por módulo, insignias automáticas y GPT tutor 24/7 para mantener al alumno activo.',
    icon: Award,
    tint: 'red',
    pasos: [
      {
        titulo: 'Progresión del Estudiante — 9 Niveles',
        desc: 'Dentro del LMS de GoHighLevel, los módulos sobre ahorros, bancos, necesidades vs. deseos y emprendimiento están estructurados en 9 niveles de estatus. Completar cada módulo acumula puntos que avanzan el nivel del alumno — gamificación aplicada al aprendizaje financiero.',
      },
      {
        titulo: 'Insignias y Certificados Digitales Automáticos',
        desc: 'Al alcanzar hitos o niveles, el workflow desbloquea automáticamente insignias digitales (Badges) creadas en el constructor de certificados de GoHighLevel. Las insignias son descargables y compartibles — generando contenido orgánico cuando los padres las comparten en redes.',
      },
      {
        titulo: 'Tutor Virtual 24/7 — "Tío Mike" (GPT)',
        desc: 'GPT configurado como asistente pedagógico del programa y entrenado con el contenido de MPM. Responde preguntas de los alumnos sobre el módulo activo, explica conceptos y motiva la continuidad — sin necesidad de soporte humano, disponible a cualquier hora.',
      },
    ],
  },
];

const FASES = [
  {
    num: 'Fase 1',
    nombre: 'Infraestructura Base — GoHighLevel + Mercado Pago + CAPI',
    duracion: '1–2 semanas',
    valor: 'COP 1.800.000',
    pago: 'Pago único',
    recomendada: true,
    icon: Settings,
    entregables: [
      'Configuración del subaccount MPM en GoHighLevel',
      'Integración nativa Mercado Pago (checkout operativo)',
      'Implementación de CAPI (Conversions API de Meta)',
      'Dominio, SSL y configuración del funnel',
      'Usuarios, roles y permisos del equipo',
      'Revisión y validación en Events Manager',
    ],
    detalle: [
      'Creación y configuración del subaccount dedicado para Mi Primer Millón en GoHighLevel — ambiente limpio, separado, listo para el funnel.',
      'Integración de Mercado Pago como pasarela de pago principal. Integración nativa en GHL y la opción más adoptada en Colombia para pagos digitales.',
      'Implementación de la API de Conversiones de Meta (CAPI) para recuperar señales de conversión perdidas por iOS y bloqueadores de anuncios. Base del entrenamiento algorítmico de Meta.',
    ],
  },
  {
    num: 'Fase 2',
    nombre: 'Embudo de Ventas — Landing · Checkout · Upsell 1 Clic',
    duracion: '2 semanas',
    valor: 'COP 2.200.000',
    pago: 'Pago único',
    recomendada: true,
    icon: CreditCard,
    entregables: [
      'Landing page del Lead Magnet (captura de contactos)',
      'Página de ventas Plan Standard ($99.99 USD)',
      'Order form integrado a Mercado Pago',
      'Página de upsell Plan Premium ($599.99 USD) — 1 clic',
      'Thank You Page con instrucciones de acceso',
      'Pruebas E2E de flujo completo de compra',
    ],
    detalle: [
      'Diseño y desarrollo de las 4 páginas del funnel en GoHighLevel: captura → ventas → upsell → confirmación. Copy y estructura orientados a conversión.',
      'Configuración del botón "Upsell Product" para reutilizar el token de pago ya capturado — el padre compra el Premium sin volver a ingresar su tarjeta. 1 clic, 0 fricción.',
      'Integración del formulario de captura con el CRM para trazabilidad completa: desde el primer clic en el anuncio hasta la compra.',
    ],
  },
  {
    num: 'Fase 3',
    nombre: 'Automatizaciones — Recuperación + Fulfillment + DIAN',
    duracion: '2 semanas',
    valor: 'COP 1.800.000',
    pago: 'Pago único',
    recomendada: true,
    icon: Zap,
    entregables: [
      'Workflow de carrito abandonado (disparador 15min + email + WhatsApp)',
      'Workflow de fulfillment (entrega automática de acceso al LMS)',
      'Etiquetado automático Standard vs. Premium en CRM',
      'Integración Zapier ↔ LeadConnector ↔ Alegra / Siigo',
      'Facturación electrónica DIAN 100% desatendida',
      'Pruebas de calidad de todos los workflows',
    ],
    detalle: [
      'Workflow "Abandoned Checkout": detecta prospectos con datos de contacto que no completaron la compra y dispara secuencia de recuperación (email + WhatsApp) dentro de 15 minutos.',
      'Workflow de fulfillment: aplica etiquetas de segmento, envía credenciales de acceso por WhatsApp + email en menos de 5 minutos tras el pago confirmado.',
      'Integración con Alegra o Siigo vía Zapier para emisión automática de facturas electrónicas DIAN — cero intervención manual del equipo de MPM.',
    ],
  },
  {
    num: 'Fase 4',
    nombre: 'Meta Ads — Audiencias, Segmentación y Validación CAPI',
    duracion: '1 semana',
    valor: 'COP 1.200.000',
    pago: 'Pago único',
    recomendada: false,
    icon: Target,
    entregables: [
      'Audiencias segmentadas por comportamiento de alto PA',
      'Audiencias personalizadas (visitantes web, leads)',
      'Audiencias similares (lookalike) para escalado',
      'Estructura de campañas Tráfico → Conversión',
      'Validación CAPI sin duplicados en Events Manager',
      'Brief de creativos para equipo de contenido',
    ],
    detalle: [
      'Estructuración de audiencias de padres con comportamientos de alto poder adquisitivo (viajeros internacionales, ejecutivos, dueños de negocio) — dado que Meta no permite segmentar por ingresos en Colombia.',
      'Configuración de audiencias personalizadas (visitantes web, leads capturados) y similares (lookalike) para escalar tráfico calificado manteniendo el costo por lead controlado.',
      'Validación técnica en Events Manager de que CAPI envía eventos correctamente, sin duplicados con el píxel del navegador.',
    ],
  },
  {
    num: 'Fase 5',
    nombre: 'LMS Gamificado — Niveles · Badges · Tío Mike GPT',
    duracion: '2–3 semanas',
    valor: 'COP 2.000.000',
    pago: 'Pago único',
    recomendada: false,
    icon: Award,
    entregables: [
      'Estructura de 9 niveles de estatus en el LMS de GoHighLevel',
      'Sistema de puntos por módulo completado',
      'Diseño y configuración de insignias digitales (Badges)',
      'Certificados digitales personalizados con marca MPM',
      'Configuración del GPT "Tío Mike" como tutor pedagógico',
      'Pruebas de flujo completo alumno → módulo → insignia',
    ],
    detalle: [
      'Configuración del LMS de GoHighLevel con los módulos organizados en 9 niveles de progresión. Cada nivel desbloquea contenido nuevo y recompensas visuales.',
      'Sistema de gamificación completo: puntos, badges y certificados que se otorgan automáticamente al completar hitos — motivando la continuidad sin esfuerzo humano adicional.',
      'Configuración del asistente GPT "Tío Mike" entrenado con el contenido pedagógico del programa. Disponible 24/7 para responder preguntas de los alumnos dentro del LMS.',
    ],
  },
];

const SECCIONES = [
  { id: 'resumen',    label: 'Resumen'    },
  { id: 'programa',   label: 'El Programa' },
  { id: 'problema',   label: 'El Problema' },
  { id: 'ecosistema', label: 'Ecosistema'  },
  { id: 'plan',       label: 'Plan'       },
  { id: 'cotizacion', label: 'Cotización' },
  { id: 'vigencia',   label: 'Vigencia'   },
];

const TOTAL_CORE = 'COP 5.800.000';
const TOTAL_FULL = 'COP 9.000.000';

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
  <span className="font-lato text-[#22c55e] text-[13px] uppercase tracking-[0.22em] font-medium">{children}</span>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2
    className="font-poppins font-extrabold text-white mt-2 mb-2 leading-tight"
    style={{ fontSize: 'clamp(1.8125rem, 4.375vw, 2.625rem)' }}
  >
    {children}
  </h2>
);

const Rule = () => (
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: 'linear-gradient(90deg,#1d70a2,#22c55e)' }} />
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const MpmProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [flujoActivo, setFlujoActivo] = useState<number | null>(null);
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
  const s4 = useVisible(); const s5 = useVisible(); const s6 = useVisible();
  const s7 = useVisible();

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
            <div className={`rounded-full flex-shrink-0 transition-all duration-300 ${activeSection === s.id ? 'w-2 h-2 bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,.7)]' : 'w-1.5 h-1.5 bg-white/50'}`} />
          </button>
        ))}
      </nav>

      {/* ══════════════════════════════════════ PORTADA */}
      <header className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #030d1a 0%, #051a0e 55%, #061510 100%)' }}>

        {/* Fondos decorativos */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(34,197,94,.05) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(29,112,162,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.018]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
          {/* Moneda decorativa tenue */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full opacity-[0.025] border-[3px]"
            style={{ borderColor: MPM_GREEN }} />
          <div className="absolute top-1/4 right-1/4 w-52 h-52 rounded-full opacity-[0.02] border"
            style={{ borderColor: MPM_GREEN, transform: 'translate(8%,8%)' }} />
        </div>

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-b" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-white">
              <img src="/sixteam-logo.png" alt="Sixteam.pro"
                className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <div>
              <span className="font-poppins font-black text-white text-xl tracking-tight">Sixteam<span style={{ color: MPM_GREEN }}>.</span>pro</span>
              <p className="font-lato text-white/35 text-[13px] leading-none mt-0.5">Innovación y Estrategia Digital</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-lato text-[13px] uppercase tracking-[0.2em] border rounded-full px-3 py-1.5"
              style={{ color: 'rgba(34,197,94,.8)', borderColor: 'rgba(34,197,94,.2)' }}>
              Confidencial
            </span>
          </div>
        </div>

        {/* Cuerpo portada */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Lato:wght@300;400;500;700&display=swap');
          .font-poppins { font-family: 'Poppins', sans-serif; }
          .font-lato    { font-family: 'Lato', sans-serif;    }
          html { scroll-behavior: smooth; }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
          .fade-up { animation: fadeUp .7s cubic-bezier(.16,1,.3,1) forwards; }
          .fade-up-1 { animation-delay: .05s; }
          .fade-up-2 { animation-delay: .15s; }
          .fade-up-3 { animation-delay: .25s; }
          .fade-up-4 { animation-delay: .35s; }
          .fade-up-5 { animation-delay: .45s; }
        `}</style>

        <div className="relative z-10 flex-1 flex items-center px-6 md:px-12 lg:px-20">
          <div className="w-full max-w-6xl mx-auto py-16 md:py-20 grid lg:grid-cols-2 gap-12 items-center">

            {/* Columna izquierda */}
            <div>
              {/* Badge programa */}
              <div className="opacity-0 fade-up fade-up-1 inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border"
                style={{ borderColor: 'rgba(34,197,94,.25)', background: 'rgba(34,197,94,.07)' }}>
                <Star size={13} style={{ color: MPM_GREEN }} />
                <span className="font-lato text-[13px] uppercase tracking-[0.2em]" style={{ color: MPM_GREEN }}>
                  Ecosistema Digital · {META.programa}
                </span>
              </div>

              <h1 className="opacity-0 fade-up fade-up-2 font-poppins font-black text-white leading-[1.05] mb-5"
                style={{ fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)' }}>
                Un ecosistema<br />
                <span style={{ background: `linear-gradient(90deg, ${MPM_GREEN}, #16a34a)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  que convierte
                </span>
                <br />y retiene.
              </h1>

              <p className="opacity-0 fade-up fade-up-3 font-lato text-white/55 leading-relaxed mb-8 max-w-lg"
                style={{ fontSize: 'clamp(.95rem, 1.8vw, 1.1rem)' }}>
                {META.objetivo}
              </p>

              <div className="opacity-0 fade-up fade-up-4 flex flex-wrap gap-3">
                <button onClick={() => scrollTo('ecosistema')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-poppins font-semibold text-white transition-all hover:scale-105"
                  style={{ background: `linear-gradient(90deg, #16a34a, ${MPM_GREEN})`, boxShadow: `0 4px 24px rgba(34,197,94,.3)` }}>
                  Ver ecosistema <ChevronRight size={16} />
                </button>
                <button onClick={() => scrollTo('cotizacion')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-poppins font-semibold transition-all hover:scale-105"
                  style={{ border: '1px solid rgba(34,197,94,.3)', color: 'rgba(34,197,94,.9)', background: 'rgba(34,197,94,.06)' }}>
                  Ver cotización
                </button>
              </div>
            </div>

            {/* Columna derecha — tarjetas de programa */}
            <div className="opacity-0 fade-up fade-up-5 flex flex-col gap-4">
              {PROGRAMAS.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.plan} className="rounded-2xl p-5 border transition-all"
                    style={{ background: 'rgba(255,255,255,.03)', borderColor: `${p.color}30` }}>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${p.color}15` }}>
                        <Icon size={18} style={{ color: p.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-poppins font-bold text-white">{META.sigla} — Plan {p.plan}</span>
                          <span className="font-poppins font-black text-lg flex-shrink-0" style={{ color: p.color }}>
                            {p.precio} <span className="text-[11px] font-normal text-white/40">{p.moneda}</span>
                          </span>
                        </div>
                        <p className="font-lato text-white/45 text-[13px] mb-3">{p.enfoque}</p>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                          {p.items.slice(0, 4).map(item => (
                            <div key={item} className="flex items-center gap-1.5">
                              <CheckCircle size={11} style={{ color: p.color, flexShrink: 0 }} />
                              <span className="font-lato text-white/55 text-[12px] truncate">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Chips de tecnología */}
              <div className="flex flex-wrap gap-2 mt-1">
                {['GoHighLevel', 'Mercado Pago', 'Meta CAPI', 'Zapier', 'Alegra / Siigo', 'WhatsApp API', 'GPT Tutor'].map(t => (
                  <span key={t} className="font-lato text-[12px] px-3 py-1 rounded-full border"
                    style={{ color: 'rgba(255,255,255,.5)', borderColor: 'rgba(255,255,255,.1)', background: 'rgba(255,255,255,.03)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Metadatos */}
        <div className="relative z-10 px-6 md:px-12 lg:px-20 pb-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-6 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
              {[
                { icon: Building2, label: 'Cliente', val: META.cliente },
                { icon: Calendar,  label: 'Fecha',   val: META.fecha   },
                { icon: MapPin,    label: 'Sede',    val: META.alcance  },
                { icon: User,      label: 'RL',      val: META.rl       },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={14} className="text-white/30 flex-shrink-0" />
                  <span className="font-lato text-white/30 text-[13px]">{label}:</span>
                  <span className="font-lato text-white/60 text-[13px]">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════ RESUMEN EJECUTIVO */}
      <section id="resumen" ref={s1.ref as React.RefObject<HTMLElement>}
        className="px-6 md:px-12 lg:px-20 py-20 md:py-28 max-w-6xl mx-auto">
        <div className={`transition-all duration-700 ${s1.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Resumen Ejecutivo</TagLabel>
          <SectionTitle>¿Qué estamos construyendo?</SectionTitle>
          <Rule />

          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="font-lato text-white/65 leading-relaxed mb-5" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
                Mi Primer Millón es el programa de educación financiera de Stunet Education Agency para niños y adolescentes. No es un curso online tradicional — es una experiencia educativa guiada, estructurada y progresiva, diseñada para generar comprensión real, criterio y toma de decisiones financieras desde la infancia.
              </p>
              <p className="font-lato text-white/65 leading-relaxed mb-8" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
                Sixteam.pro diseñará e implementará el <strong className="text-white">ecosistema digital completo</strong> que lleva a MPM desde el primer anuncio hasta un alumno activo, certificado y evangelizando el programa — con cero intervención manual del equipo en los flujos críticos.
              </p>

              {/* 5 flujos resumen */}
              <div className="space-y-3">
                {FLUJOS.map((f, i) => {
                  const Icon = f.icon;
                  const t = TINT[f.tint];
                  return (
                    <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl border"
                      style={{ background: t.bg, borderColor: t.border }}>
                      <Icon size={16} className={`${t.text} flex-shrink-0 mt-0.5`} />
                      <div>
                        <span className={`font-poppins font-semibold text-[13px] ${t.text}`}>{f.num} · {f.nombre}</span>
                        <p className="font-lato text-white/50 text-[12px] leading-relaxed mt-0.5">{f.resumen}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info boxes */}
            <div className="space-y-4">
              <div className="rounded-2xl p-6 border" style={{ background: 'rgba(34,197,94,.04)', borderColor: 'rgba(34,197,94,.15)' }}>
                <p className="font-lato text-white/40 text-[12px] uppercase tracking-wider mb-1">Propuesta para</p>
                <p className="font-poppins font-bold text-white text-xl">{META.cliente}</p>
                <p className="font-lato text-white/50 text-sm mt-1">Programa: {META.programa} ({META.sigla})</p>
                <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                  {[
                    { label: 'Sector', val: META.sector },
                    { label: 'Alcance', val: META.alcance },
                    { label: 'Fecha', val: META.fecha },
                    { label: 'Proponente', val: META.proponente },
                    { label: 'NIT', val: META.nit },
                    { label: 'Correo', val: META.correo },
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
                    <span className="font-lato text-white/60 text-sm">Fases 1–3 (Core)</span>
                    <span className="font-poppins font-bold text-white">{TOTAL_CORE}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-lato text-white/60 text-sm">Ecosistema completo (5 fases)</span>
                    <span className="font-poppins font-bold" style={{ color: MPM_GREEN }}>{TOTAL_FULL}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ EL PROGRAMA */}
      <section id="programa" ref={s2.ref as React.RefObject<HTMLElement>}
        className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>El Programa</TagLabel>
          <SectionTitle>Mi Primer Millón — ¿qué es?</SectionTitle>
          <Rule />

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="md:col-span-2">
              <p className="font-lato text-white/65 leading-relaxed mb-4" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
                MPM es un programa de educación e inteligencia financiera diseñado para niños y adolescentes. Su objetivo es formar hábitos de pensamiento saludable, consciente y responsable alrededor del dinero desde edades tempranas.
              </p>
              <p className="font-lato text-white/65 leading-relaxed" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
                El programa <strong className="text-white">no promete riqueza rápida</strong>. Su objetivo es transformar el pensamiento financiero. Desarrolla criterio para la toma de decisiones, construye una relación sana y consciente con el dinero, y forma hábitos que aumentan las probabilidades de éxito financiero a largo plazo.
              </p>
            </div>
            <div className="rounded-2xl p-5 border" style={{ background: 'rgba(34,197,94,.04)', borderColor: 'rgba(34,197,94,.15)' }}>
              <p className="font-lato text-white/40 text-[12px] uppercase tracking-wider mb-4">Cifras clave</p>
              <div className="space-y-4">
                {[
                  { val: '32', label: 'Módulos anuales', color: MPM_GREEN },
                  { val: '2', label: 'Grupos de edad', color: '#60a5fa' },
                  { val: '9', label: 'Niveles de gamificación', color: '#f59e0b' },
                  { val: '1', label: 'GPT Tutor 24/7', color: '#c084fc' },
                ].map(({ val, label, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="font-poppins font-black text-2xl" style={{ color }}>{val}</span>
                    <span className="font-lato text-white/55 text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Planes Standard vs Premium */}
          <div className="grid md:grid-cols-2 gap-6">
            {PROGRAMAS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.plan} className="rounded-2xl overflow-hidden border"
                  style={{ borderColor: `${p.color}25`, background: 'rgba(255,255,255,.02)' }}>
                  <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: `${p.color}15` }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${p.color}15` }}>
                          <Icon size={18} style={{ color: p.color }} />
                        </div>
                        <div>
                          <p className="font-poppins font-bold text-white">{META.sigla} — Plan {p.plan}</p>
                          <p className="font-lato text-white/40 text-[13px]">Programa anual</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-poppins font-black text-2xl" style={{ color: p.color }}>{p.precio}</p>
                        <p className="font-lato text-white/35 text-[12px]">{p.moneda}</p>
                      </div>
                    </div>
                    <p className="font-lato text-white/50 text-[13px] italic">{p.enfoque}</p>
                  </div>
                  <div className="px-6 py-4 space-y-2">
                    {p.items.map(item => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle size={14} style={{ color: p.color, flexShrink: 0 }} />
                        <span className="font-lato text-white/65 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ EL PROBLEMA */}
      <section id="problema" ref={s3.ref as React.RefObject<HTMLElement>}
        className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>El Problema</TagLabel>
          <SectionTitle>La verdad incómoda detrás de MPM</SectionTitle>
          <Rule />

          <p className="font-lato text-white/55 leading-relaxed mb-10 max-w-3xl" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
            MPM tiene el producto correcto para el momento correcto. El problema es que sin un ecosistema digital estructurado, la captación, la conversión y la retención dependen del esfuerzo manual — y el esfuerzo manual no escala.
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            {PROBLEMAS.map((p, i) => {
              const Icon = p.icon;
              const t = TINT[p.tint];
              return (
                <div key={i} className="rounded-2xl p-6 border transition-all hover:scale-[1.01]"
                  style={{ background: t.bg, borderColor: t.border }}>
                  <Icon size={22} className={`${t.text} mb-4`} />
                  <h3 className={`font-poppins font-bold text-[17px] ${t.text} mb-2`}>{p.titulo}</h3>
                  <p className="font-lato text-white/55 text-sm leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ ECOSISTEMA DIGITAL */}
      <section id="ecosistema" ref={s4.ref as React.RefObject<HTMLElement>}
        className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Ecosistema Digital</TagLabel>
          <SectionTitle>Los 5 flujos del ecosistema MPM</SectionTitle>
          <Rule />

          <p className="font-lato text-white/55 leading-relaxed mb-10 max-w-3xl" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
            Cada flujo es un eslabón del mismo sistema. Juntos forman un ciclo que capta, convierte, cumple, retiene y crece sin intervención manual en los puntos críticos.
          </p>

          {/* Flujo visual: pipeline horizontal en desktop */}
          <div className="hidden md:flex items-center gap-2 mb-10 overflow-x-auto pb-2">
            {FLUJOS.map((f, i) => {
              const Icon = f.icon;
              const t = TINT[f.tint];
              return (
                <React.Fragment key={i}>
                  <button onClick={() => setFlujoActivo(flujoActivo === i ? null : i)}
                    className="flex-shrink-0 flex flex-col items-center gap-2 px-4 py-3 rounded-xl border transition-all hover:scale-105"
                    style={{
                      background: flujoActivo === i ? t.bg : 'rgba(255,255,255,.02)',
                      borderColor: flujoActivo === i ? t.border : 'rgba(255,255,255,.08)',
                      minWidth: 120,
                    }}>
                    <Icon size={20} className={t.text} />
                    <span className="font-poppins font-bold text-[12px] text-white/80 text-center leading-tight">{f.num}</span>
                    <span className="font-lato text-[11px] text-white/50 text-center leading-tight">{f.nombre.split('—')[0].trim()}</span>
                  </button>
                  {i < FLUJOS.length - 1 && (
                    <ArrowRight size={16} className="text-white/20 flex-shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Accordion de flujos */}
          <div className="space-y-4">
            {FLUJOS.map((f, i) => {
              const Icon = f.icon;
              const t = TINT[f.tint];
              const open = flujoActivo === i;
              return (
                <div key={i} className="rounded-2xl border overflow-hidden transition-all"
                  style={{ borderColor: open ? t.border : 'rgba(255,255,255,.07)', background: open ? t.bg : 'rgba(255,255,255,.02)' }}>
                  <button className="w-full flex items-center gap-4 px-6 py-5 text-left"
                    onClick={() => setFlujoActivo(open ? null : i)}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${open ? t.bg : 'rgba(255,255,255,.04)'}`, border: `1px solid ${t.border}` }}>
                      <Icon size={18} className={t.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className={`font-poppins font-black text-[13px] ${t.text}`}>{f.num}</span>
                        <span className="font-poppins font-bold text-white text-[16px]">{f.nombre}</span>
                      </div>
                      <p className="font-lato text-white/45 text-sm mt-0.5 truncate">{f.resumen}</p>
                    </div>
                    <ChevronDown size={18} className={`text-white/40 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                  </button>

                  {open && (
                    <div className="px-6 pb-6 grid md:grid-cols-3 gap-5">
                      {f.pasos.map((paso, j) => (
                        <div key={j} className="rounded-xl p-4 border" style={{ borderColor: t.border, background: 'rgba(255,255,255,.03)' }}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`font-poppins font-black text-[11px] ${t.text} opacity-60`}>0{j + 1}</span>
                            <h4 className={`font-poppins font-bold text-[14px] ${t.text}`}>{paso.titulo}</h4>
                          </div>
                          <p className="font-lato text-white/55 text-[13px] leading-relaxed">{paso.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ PLAN DE TRABAJO */}
      <section id="plan" ref={s5.ref as React.RefObject<HTMLElement>}
        className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Plan de Trabajo</TagLabel>
          <SectionTitle>Fases de implementación</SectionTitle>
          <Rule />

          <p className="font-lato text-white/55 leading-relaxed mb-10 max-w-3xl" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
            El ecosistema se construye en 5 fases consecutivas. Las fases 1, 2 y 3 forman el <strong className="text-white">Core del ecosistema</strong> — el mínimo funcional para lanzar ventas. Las fases 4 y 5 potencian la adquisición y la retención a largo plazo.
          </p>

          <div className="space-y-4">
            {FASES.map((fase, i) => {
              const Icon = fase.icon;
              const open = faseActiva === i;
              return (
                <div key={i} className="rounded-2xl overflow-hidden border transition-all"
                  style={{
                    borderColor: open ? 'rgba(34,197,94,.25)' : 'rgba(255,255,255,.07)',
                    background: open ? 'rgba(34,197,94,.04)' : 'rgba(255,255,255,.02)',
                  }}>
                  <button className="w-full flex items-center gap-4 px-6 py-5 text-left"
                    onClick={() => setFaseActiva(open ? null : i)}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border"
                      style={{ background: open ? 'rgba(34,197,94,.12)' : 'rgba(255,255,255,.04)', borderColor: open ? 'rgba(34,197,94,.3)' : 'rgba(255,255,255,.08)' }}>
                      <Icon size={18} style={{ color: open ? MPM_GREEN : 'rgba(255,255,255,.4)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-poppins font-black text-[13px]" style={{ color: MPM_GREEN }}>{fase.num}</span>
                        <span className="font-poppins font-bold text-white">{fase.nombre}</span>
                        {fase.recomendada && (
                          <span className="font-lato text-[11px] px-2 py-0.5 rounded-full border"
                            style={{ color: MPM_GREEN, borderColor: 'rgba(34,197,94,.3)', background: 'rgba(34,197,94,.08)' }}>
                            Recomendada
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <span className="font-lato text-white/40 text-[13px] flex items-center gap-1">
                          <Calendar size={12} /> {fase.duracion}
                        </span>
                        <span className="font-poppins font-bold text-[13px]" style={{ color: MPM_GREEN }}>{fase.valor}</span>
                        <span className="font-lato text-white/35 text-[13px]">{fase.pago}</span>
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
                              <CheckCircle size={14} style={{ color: MPM_GREEN, flexShrink: 0, marginTop: 2 }} />
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
                              <ChevronRight size={14} style={{ color: 'rgba(34,197,94,.5)', flexShrink: 0, marginTop: 2 }} />
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
        </div>
      </section>

      {/* ══════════════════════════════════════ COTIZACIÓN */}
      <section id="cotizacion" ref={s6.ref as React.RefObject<HTMLElement>}
        className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Cotización</TagLabel>
          <SectionTitle>Inversión por fase</SectionTitle>
          <Rule />

          <div className="grid md:grid-cols-5 gap-4 mb-8">
            {FASES.map((fase, i) => (
              <div key={i} className="rounded-2xl p-4 border text-center"
                style={{
                  background: fase.recomendada ? 'rgba(34,197,94,.05)' : 'rgba(255,255,255,.02)',
                  borderColor: fase.recomendada ? 'rgba(34,197,94,.2)' : 'rgba(255,255,255,.07)',
                }}>
                <p className="font-poppins font-black text-[12px] mb-1" style={{ color: MPM_GREEN }}>{fase.num}</p>
                <p className="font-lato text-white/60 text-[11px] leading-tight mb-3">{fase.nombre.split('—')[0].trim()}</p>
                <p className="font-poppins font-black text-lg text-white">{fase.valor}</p>
                <p className="font-lato text-white/35 text-[11px] mt-1">{fase.duracion}</p>
                {fase.recomendada && (
                  <div className="mt-2 text-[10px] font-lato px-2 py-0.5 rounded-full inline-block"
                    style={{ color: MPM_GREEN, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.2)' }}>
                    Core
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Totales */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,.02)', borderColor: 'rgba(255,255,255,.08)' }}>
              <p className="font-lato text-white/40 text-[12px] uppercase tracking-wider mb-3">Ecosistema Core (Fases 1–3)</p>
              <p className="font-poppins font-black text-white mb-1" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>{TOTAL_CORE}</p>
              <p className="font-lato text-white/40 text-sm">Pagos únicos por fase · Sin mensualidades</p>
              <div className="mt-4 space-y-1">
                {FASES.filter(f => f.recomendada).map((f, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="font-lato text-white/50 text-sm">{f.num} · {f.nombre.split('—')[0].trim()}</span>
                    <span className="font-poppins font-bold text-white text-sm">{f.valor}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6 border" style={{ background: 'rgba(34,197,94,.05)', borderColor: 'rgba(34,197,94,.2)' }}>
              <p className="font-lato text-white/40 text-[12px] uppercase tracking-wider mb-3">Ecosistema Completo (Fases 1–5)</p>
              <p className="font-poppins font-black mb-1" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: MPM_GREEN }}>{TOTAL_FULL}</p>
              <p className="font-lato text-white/40 text-sm">Pagos únicos por fase · Sin mensualidades</p>
              <div className="mt-4 space-y-1">
                {FASES.map((f, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="font-lato text-white/50 text-sm">{f.num} · {f.nombre.split('—')[0].trim()}</span>
                    <span className="font-poppins font-bold text-white text-sm">{f.valor}</span>
                  </div>
                ))}
                <div className="pt-2 mt-2 border-t border-white/10 flex justify-between">
                  <span className="font-poppins font-bold text-white text-sm">Total</span>
                  <span className="font-poppins font-black text-sm" style={{ color: MPM_GREEN }}>{TOTAL_FULL}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nota */}
          <div className="mt-6 rounded-xl px-5 py-4 border flex items-start gap-3"
            style={{ background: 'rgba(255,255,255,.02)', borderColor: 'rgba(255,255,255,.07)' }}>
            <Info size={16} className="text-white/30 flex-shrink-0 mt-0.5" />
            <p className="font-lato text-white/45 text-sm leading-relaxed">
              Los valores no incluyen IVA (19%). Las licencias de GoHighLevel, Alegra/Siigo, Zapier ni el presupuesto de pauta de Meta Ads están incluidos en esta propuesta — son costos operativos del cliente. Cada fase se contrata y paga de forma independiente.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ VIGENCIA Y CIERRE */}
      <section id="vigencia" ref={s7.ref as React.RefObject<HTMLElement>}
        className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${s7.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>Vigencia y Cierre</TagLabel>
          <SectionTitle>¿Cuándo empezamos?</SectionTitle>
          <Rule />

          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="font-lato text-white/65 leading-relaxed mb-6" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
                Esta propuesta tiene una vigencia de <strong className="text-white">30 días calendario</strong> a partir de su fecha de emisión. Las condiciones, tiempos y valores descritos aplican hasta el <strong className="text-white">6 de junio de 2026</strong>.
              </p>
              <p className="font-lato text-white/65 leading-relaxed mb-8" style={{ fontSize: 'clamp(.95rem,1.7vw,1.08rem)' }}>
                Para dar inicio, el proceso es: (1) confirmación escrita de las fases a contratar, (2) firma del acuerdo de servicios, (3) pago de la primera fase. La implementación arranca dentro de los 3 días hábiles siguientes al pago.
              </p>

              <div className="space-y-3">
                {[
                  { paso: '01', label: 'Confirmación de fases a contratar' },
                  { paso: '02', label: 'Firma del acuerdo de servicios' },
                  { paso: '03', label: 'Pago de la Fase 1' },
                  { paso: '04', label: 'Kick-off en ≤ 3 días hábiles' },
                ].map(({ paso, label }) => (
                  <div key={paso} className="flex items-center gap-3">
                    <span className="font-poppins font-black text-[13px] w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0"
                      style={{ color: MPM_GREEN, borderColor: 'rgba(34,197,94,.3)', background: 'rgba(34,197,94,.06)' }}>
                      {paso}
                    </span>
                    <span className="font-lato text-white/65 text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {/* Contacto */}
              <div className="rounded-2xl p-6 border" style={{ background: 'rgba(34,197,94,.04)', borderColor: 'rgba(34,197,94,.15)' }}>
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

              {/* PDF */}
              <div className="rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,.02)', borderColor: 'rgba(255,255,255,.07)' }}>
                <p className="font-lato text-white/40 text-[12px] uppercase tracking-wider mb-3">Descargar propuesta</p>
                <p className="font-lato text-white/50 text-sm mb-4">Exporta esta propuesta como PDF para compartir con tu equipo o conservar como referencia.</p>
                <PDFButton
                  filename="propuesta-mpm-sixteam.pdf"
                  elementId="proposal-root"
                  label="Exportar PDF"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ FOOTER */}
      <footer className="px-6 md:px-12 lg:px-20 py-10 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-white flex items-center justify-center">
              <img src="/sixteam-logo.png" alt="Sixteam.pro"
                className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <span className="font-poppins font-black text-white text-lg">Sixteam<span style={{ color: MPM_GREEN }}>.</span>pro</span>
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
