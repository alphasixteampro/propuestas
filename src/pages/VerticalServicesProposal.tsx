import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target, Zap, BarChart3,
  AlertCircle, TrendingUp, Info, Calendar, MapPin,
  Mail, Globe, Rocket, Send, Users,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Vertical Services',
  tagline: 'Servicios con Drones para Bogotá',
  sector: 'Tecnología · Drones · Propiedad Horizontal',
  sede: 'Bogotá, Colombia',
  fecha: 'Mayo 2026',
  lugar: 'Colombia',
  objetivo: 'Validar el apetito de mercado antes de invertir en la compra de equipos',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  web: 'verticalservicesco.com',
};

const VS_BLUE = '#3b82f6';

const HALLAZGOS = [
  {
    titulo: 'Página web sin capacidad de conversión',
    desc: 'El sitio actual fue construido con herramientas de IA en Hostinger. Funciona como página informativa pero no captura datos, no tiene formularios y no activa a los visitantes hacia ninguna acción comercial concreta.',
    icon: AlertCircle, tint: 'red',
  },
  {
    titulo: 'Sin sistema de captura y seguimiento de leads',
    desc: 'No existe un mecanismo estructurado para registrar el interés del mercado. Las conversaciones ocurren por WhatsApp y correos dispersos, sin trazabilidad ni datos acumulados para tomar decisiones de inversión.',
    icon: TrendingUp, tint: 'amber',
  },
  {
    titulo: 'Bases de datos disponibles sin activar',
    desc: 'Existen bases de datos de administradores de propiedad horizontal en Bogotá, disponibles desde Cámara de Comercio y fuentes propias. Ese activo comercial no se ha activado con ninguna campaña de alcance.',
    icon: FileText, tint: 'blue',
  },
  {
    titulo: 'Sin datos reales de apetito de mercado',
    desc: 'La decisión de compra de drones (categoría 1, 2 o 3) y el modelo de precios dependen todavía de supuestos. Sin una campaña real no hay forma de medir si el mercado responde ni a qué precio.',
    icon: BarChart3, tint: 'teal',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber: { text: 'text-amber-400',   bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)' },
  teal:  { text: 'text-[#00bfa5]',   bg: 'rgba(0,191,165,.07)',   border: 'rgba(0,191,165,.18)' },
  blue:  { text: 'text-[#3b82f6]',   bg: 'rgba(59,130,246,.07)',  border: 'rgba(59,130,246,.18)' },
  red:   { text: 'text-[#f87171]',   bg: 'rgba(221,51,51,.07)',   border: 'rgba(221,51,51,.2)' },
};

// ─── ETAPAS ──────────────────────────────────────────────────────────────────

type Actividad = { text: string; tag?: string };

const ETAPAS = [
  {
    num: '01',
    nombre: 'Diseño y construcción de la landing page',
    duracion: '1 semana',
    icon: Globe,
    color: VS_BLUE,
    colorAlpha: 'rgba(59,130,246,.12)',
    colorBorder: 'rgba(59,130,246,.3)',
    descripcion: 'Construimos una landing page diseñada para convertir. No solo para informar. Partimos del material de la empresa (modelo de negocio, oferta de servicio, mercado objetivo) para generar un primer borrador con identidad visual, propuesta de valor clara y formulario de captura conectado a la plataforma.',
    actividades: [
      { text: 'Sesión de briefing para alinear propuesta de valor, mercado objetivo y tono de la página', tag: 'Trabajo conjunto' },
      { text: 'Diseño y maquetación de la landing page con referencia web del cliente y sistema de diseño Sixteam.pro' },
      { text: 'Redacción de textos orientados a conversión con énfasis en el dolor del administrador de propiedad horizontal' },
      { text: 'Formulario de contacto integrado con la plataforma de email marketing para captura automática de leads' },
      { text: 'Botón de WhatsApp y llamada a la acción (CTA) principal visible desde el primer scroll' },
      { text: 'Publicación en el VPS o dominio de Vertical Services' },
    ] as Actividad[],
  },
  {
    num: '02',
    nombre: 'Configuración de plataforma y listas',
    duracion: '3 a 5 días',
    icon: Mail,
    color: '#00bfa5',
    colorAlpha: 'rgba(0,191,165,.10)',
    colorBorder: 'rgba(0,191,165,.3)',
    descripcion: 'Configuramos la plataforma de email marketing de Sixteam.pro con el dominio de Vertical Services, creamos la lista de contactos y cargamos la base de datos disponible. El objetivo es que todo esté listo para enviar el primer correo sin demoras operativas.',
    actividades: [
      { text: 'Creación y configuración de la cuenta en la plataforma Sixteam.pro con capacidad de hasta 5.000 correos por mes incluidos' },
      { text: 'Autenticación del dominio para garantizar entregabilidad óptima mediante registros SPF, DKIM y DMARC' },
      { text: 'Carga y depuración de la base de datos de administradores de propiedad horizontal en Bogotá' },
      { text: 'Segmentación inicial por tipo de contacto, zona o tamaño de conjunto según datos disponibles' },
      { text: 'Configuración del formulario de la landing page conectado a la plataforma para captura automática' },
    ] as Actividad[],
  },
  {
    num: '03',
    nombre: 'Primera campaña de correo masivo',
    duracion: 'Semanas 2 y 3',
    icon: Send,
    color: '#a78bfa',
    colorAlpha: 'rgba(167,139,250,.10)',
    colorBorder: 'rgba(167,139,250,.3)',
    descripcion: 'Configuramos y ejecutamos la primera campaña usando el email preparado por el equipo de Vertical Services. El formato recomendado es un email plano, personalizado y directo: sin diseño recargado, como si el fundador le escribiera personalmente al administrador del edificio. Ese tono genera tasas de respuesta significativamente mayores.',
    actividades: [
      { text: 'Revisión y carga del email preparado por Vertical Services antes de cualquier envío', tag: 'Aprobación conjunta' },
      { text: 'Envío programado a la base de datos cargada en la plataforma' },
      { text: 'Monitoreo en tiempo real de tasa de apertura, clics hacia la landing y respuestas directas' },
    ] as Actividad[],
  },
  {
    num: '04',
    nombre: 'Análisis de tracción y ajuste',
    duracion: 'Semana 4',
    icon: BarChart3,
    color: '#f59e0b',
    colorAlpha: 'rgba(245,158,11,.10)',
    colorBorder: 'rgba(245,158,11,.3)',
    descripcion: 'Con los datos de la primera campaña en mano, analizamos juntos qué funcionó y qué no. Miramos apertura, conversiones al formulario y respuestas directas. Ese análisis sirve para informar la decisión de categoría de drone a comprar y el modelo de precio a validar en el mercado.',
    actividades: [
      { text: 'Informe completo de resultados de la campaña: aperturas, clics, formularios completados y respuestas recibidas' },
      { text: 'Sesión de análisis con el equipo de Vertical Services para interpretar los datos y sacar conclusiones de mercado', tag: 'Trabajo conjunto' },
      { text: 'Ajuste de mensajería o segmento objetivo para la segunda campaña según hallazgos del primer envío' },
      { text: 'Recomendaciones sobre el siguiente paso: segunda campaña, pauta digital o decisión de compra de drone' },
    ] as Actividad[],
  },
];

// ─── DESGLOSE ────────────────────────────────────────────────────────────────

const DESGLOSE = [
  {
    categoria: 'Landing Page',
    icon: Globe,
    color: VS_BLUE,
    items: [
      'Diseño de landing page a código con sistema de diseño profesional (no Hostinger ni constructores de IA)',
      'Sección hero con propuesta de valor de Vertical Services orientada al administrador de propiedad horizontal',
      'Sección de servicios con casos de uso clave: limpieza de fachadas, inspección de cubiertas y más',
      'Sección de diferenciadores: eficiencia, seguridad operativa y eliminación de andamios',
      'Formulario de contacto integrado con la plataforma de email marketing para captura automática de leads',
      'Botón flotante de WhatsApp y llamada a la acción (CTA) principal',
      'Diseño responsive adaptado a móvil, tableta y escritorio',
      'Publicación en dominio propio o VPS de Vertical Services',
    ],
  },
  {
    categoria: 'Plataforma Sixteam.pro — Email Marketing',
    icon: Mail,
    color: '#00bfa5',
    items: [
      'Acceso a plataforma all-in-one de email marketing, listado de contactos y formularios de captura',
      'Hasta 5.000 correos de marketing al mes incluidos en el plan base',
      'Capacidad adicional disponible: COP 8.000 por cada 1.000 correos sobre los 5.000 incluidos',
      'Autenticación de dominio para garantizar entregabilidad óptima (SPF, DKIM, DMARC)',
      'Panel de reportes con tasas de apertura, clics y comportamiento por campaña',
      'Formularios web conectados para captura automática de leads desde la landing page',
      '1 usuario incluido en el plan base',
      'Costo mensual desde el primer mes: COP 300.000',
    ],
  },
  {
    categoria: 'Implementación y Ejecución de Campañas',
    icon: Send,
    color: '#a78bfa',
    items: [
      '5 horas dedicadas a implementación, configuración y envío de campañas (pago único)',
      'Carga, depuración y segmentación de bases de datos en la plataforma',
      'Revisión técnica y envío del email preparado por Vertical Services con seguimiento en tiempo real',
      'Gestión de respuestas e interesados durante la semana de cada envío',
      'Ajuste de segmentación o configuración basado en métricas del primer envío',
      'Reporte de resultados con recomendaciones de siguiente paso',
      'Hora adicional de trabajo fuera del alcance contratado: COP 150.000 por hora',
    ],
  },
];

const SECCIONES = [
  { id: 'resumen',    label: 'Resumen' },
  { id: 'objetivo',   label: 'Objetivo' },
  { id: 'plan',       label: 'Plan' },
  { id: 'alcance',    label: 'Alcance' },
  { id: 'cotizacion', label: 'Inversión' },
  { id: 'vigencia',   label: 'Vigencia' },
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

const VerticalServicesProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
  const [etapaActiva, setEtapaActiva] = useState<number | null>(null);
  const [desgloseActivo, setDesgloseActivo] = useState<number | null>(null);

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
  const s4 = useVisible(); const s5 = useVisible(); const s6 = useVisible();

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
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,.06) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(29,112,162,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        </div>

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
            <div className="flex items-center gap-3">
              <div className="w-auto h-10 flex items-center justify-center">
                <img src="/vertical-logo.avif" alt="Vertical Services" className="h-full w-auto object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            </div>
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

        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta de trabajo y cotización · MVP de validación</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${VS_BLUE}, #1d70a2)` }}>
                  <Rocket className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(59,130,246,.10)', border: '1px solid rgba(59,130,246,.25)', color: VS_BLUE }}>
                  {META.tagline}
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}>
                Propuesta<br />
                <span style={{ background: 'linear-gradient(90deg,#1d70a2,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
                  { icon: MapPin,   text: META.lugar },
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
                  {['1. Resumen ejecutivo','2. Objetivo del MVP','3. Plan de trabajo','4. Alcance de servicios','5. Inversión','6. Vigencia y términos'].map((item, i) => (
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
                  style={{ background: 'radial-gradient(circle, rgba(59,130,246,.10) 0%, rgba(29,112,162,.05) 50%, transparent 70%)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full" style={{ border: '1px solid rgba(59,130,246,.12)' }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(29,112,162,.15)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: VS_BLUE, boxShadow: `0 0 6px rgba(59,130,246,.8)` }} />
                </div>
              </div>
              <div className="cover-float relative z-10 flex flex-col items-center gap-6 w-full px-6">
                <div className="flex flex-col items-center gap-1">
                  <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-20 w-auto object-contain"
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
                  <div className="w-56 h-28 flex items-center justify-center p-3">
                    <img src="/vertical-logo.avif" alt="Vertical Services" className="w-full h-full object-contain"
                      style={{ filter: `drop-shadow(0 2px 20px rgba(59,130,246,.45))` }} />
                  </div>
                  <div className="text-center">
                    <span className="font-poppins font-black text-white text-[24px] tracking-tight">Vertical Services</span>
                    <p className="font-lato text-[13px] uppercase tracking-[0.2em] mt-1" style={{ color: VS_BLUE }}>Drones para Propiedad Horizontal</p>
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

          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center"
            style={{ background: 'rgba(2,8,20,.85)', border: `1px solid rgba(59,130,246,.18)` }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-28 h-16 flex items-center justify-center p-2">
                <img src="/vertical-logo.avif" alt="Vertical Services" className="w-full h-full object-contain" />
              </div>
              <span className="font-poppins font-black text-white text-[15px] tracking-tight">Vertical Services</span>
              <span className="font-lato text-[11px] uppercase tracking-[0.2em]" style={{ color: VS_BLUE }}>Bogotá, Colombia</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">{META.sector}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Mercado objetivo</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">Propiedad horizontal · Edificios comerciales en Bogotá</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Servicio principal</p>
                <p className="font-lato text-white/60 text-[18px]">Limpieza de fachadas e inspección con drones</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Etapa actual</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: VS_BLUE }} />
                  <p className="font-poppins font-semibold text-[15px]" style={{ color: VS_BLUE }}>Validación de mercado (pre-compra de drones)</p>
                </div>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Web actual</p>
                <p className="font-lato text-white/60 text-[18px]">{META.web}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Contexto regulatorio</p>
                <p className="font-lato text-white/60 text-[18px]">Marco de Fuerza Aérea · Licencias y normativas mapeadas</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>
              Vertical Services es una startup fundada por tres emprendedores con expertise técnico, regulatorio y comercial en el sector de drones para propiedad horizontal en Bogotá. El equipo ya ha realizado su estudio de mercado, ha mapeado el marco regulatorio de la Aeronáutica Civil y tiene identificado su mercado primario: la administración de{' '}
              <strong className="text-white/90 font-semibold">edificios comerciales y conjuntos residenciales</strong> que requieren limpieza de fachadas e inspección de superficies sin andamios.
            </p>
            <p>
              Antes de tomar la decisión de compra de los drones (categoría 1, 2 o 3), el equipo quiere validar que el mercado tenga apetito real por el servicio y que los precios que tienen proyectados son competitivos. La estrategia que acordamos en reunión es clara: <strong className="text-white/90 font-semibold">landing page profesional + campaña de email marketing dirigida a bases de datos</strong> de propiedad horizontal, midiendo tasa de respuesta antes de comprometer capital en equipos.
            </p>
          </div>

          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> Hallazgos clave identificados
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HALLAZGOS.map((h, i) => {
                const Icon = h.icon; const t = TINT[h.tint];
                return (
                  <div key={i} className="rounded-xl p-4 flex gap-3" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                    <Icon className={`w-4 h-4 ${t.text} flex-shrink-0 mt-0.5`} />
                    <div>
                      <p className="font-poppins font-semibold text-white/90 text-[18px] mb-1">{h.titulo}</p>
                      <p className="font-lato text-white/50 text-[15px] leading-relaxed">{h.desc}</p>
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
          <TagLabel>02 — Objetivo del MVP</TagLabel>
          <SectionTitle>¿Para qué estamos aquí?</SectionTitle>
          <Rule />
          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden mb-6"
            style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(59,130,246,.07), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 text-[#00bfa5] mb-4" />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[23px] leading-relaxed">
              Construir el <strong className="text-white font-black">MVP digital</strong> de Vertical Services: una landing page profesional conectada a un sistema de email marketing para activar bases de datos de administradores de propiedad horizontal en Bogotá, medir el apetito real del mercado y obtener la data necesaria para tomar la decisión de compra de drones con{' '}
              <em className="not-italic" style={{ color: VS_BLUE }}>evidencia en mano</em>, no con supuestos.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Componentes del MVP', value: '3',        sub: 'Landing · Plataforma · Campañas' },
              { label: 'Plataforma mensual',   value: '300K',   sub: 'COP/mes · Hasta 5.000 correos' },
              { label: 'Capacidad incluida',   value: '5.000',  sub: 'correos de marketing por mes' },
              { label: 'Tiempo de arranque',   value: '1 sem.', sub: 'Landing lista para lanzar' },
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

        {/* ─ 03 PLAN ─ */}
        <section id="plan" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — Plan de trabajo</TagLabel>
          <SectionTitle>4 etapas · ~4 semanas</SectionTitle>
          <Rule />

          <div className="relative mb-10">
            <div className="hidden sm:block absolute left-[28px] top-10 bottom-10 w-px"
              style={{ background: 'linear-gradient(to bottom, rgba(59,130,246,.4), rgba(0,191,165,.4), rgba(167,139,250,.4), rgba(245,158,11,.4))' }} />

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
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`font-poppins font-bold text-[18px] ${open ? 'text-white' : 'text-white/70'}`}>{et.nombre}</span>
                        </div>
                        <p className="font-lato text-white/40 text-[15px] mt-0.5 line-clamp-1">{et.descripcion}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                        <div className="text-right hidden sm:block">
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: et.colorAlpha, border: `1px solid ${et.colorBorder}` }}>
                            <Clock className="w-3 h-3" style={{ color: et.color }} />
                            <span className="font-poppins font-bold text-[13px]" style={{ color: et.color }}>{et.duracion}</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`}
                          style={{ color: open ? et.color : 'rgba(255,255,255,.3)' }} />
                      </div>
                    </button>

                    {open && (
                      <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                        <div className="pt-4">
                          <p className="font-lato text-white/60 text-[17px] leading-relaxed mb-4">{et.descripcion}</p>
                          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Actividades</p>
                          <ul className="space-y-2">
                            {et.actividades.map((a, j) => {
                              const act = typeof a === 'string' ? { text: a } : a;
                              return (
                                <li key={j} className="flex items-start gap-2">
                                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: et.color }} />
                                  <span className="font-lato text-white/65 text-[18px] flex-1">{act.text}
                                    {act.tag && (
                                      <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wide align-middle"
                                        style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.3)', color: '#00bfa5' }}>
                                        {act.tag}
                                      </span>
                                    )}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl p-4 flex gap-3"
              style={{ background: 'rgba(59,130,246,.06)', border: '1px solid rgba(59,130,246,.2)' }}>
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: VS_BLUE }} />
              <p className="font-lato text-white/55 text-[16px] leading-relaxed">
                Las <strong className="text-white/80">Etapas 1</strong> (Landing) y <strong className="text-white/80">2</strong> (Plataforma) corren en paralelo durante la primera semana. La landing y la plataforma se entregan listas al mismo tiempo para poder lanzar la primera campaña sin demoras.
              </p>
            </div>
            <div className="rounded-xl p-4 flex gap-3"
              style={{ background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.2)' }}>
              <Rocket className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#f59e0b]" />
              <p className="font-lato text-white/55 text-[16px] leading-relaxed">
                La <strong className="text-white/80">Etapa 4</strong> (Análisis) cierra el primer ciclo del MVP con datos reales del mercado. El resultado de esa sesión le da a Vertical Services la información necesaria para decidir con seguridad cuál drone comprar y a qué precio posicionar el servicio.
              </p>
            </div>
          </div>
        </section>

        {/* ─ 04 ALCANCE ─ */}
        <section id="alcance" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Alcance de servicios</TagLabel>
          <SectionTitle>Qué está incluido</SectionTitle>
          <Rule />

          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-4">
            Detalle de cada componente del paquete
          </p>
          <div className="space-y-2.5">
            {DESGLOSE.map((bloque, i) => {
              const Icon = bloque.icon;
              const open = desgloseActivo === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? `1px solid ${bloque.color}44` : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setDesgloseActivo(open ? null : i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? `${bloque.color}20` : 'rgba(255,255,255,.05)' }}>
                      <Icon className="w-4 h-4 transition-colors" style={{ color: open ? bloque.color : 'rgba(255,255,255,.35)' }} />
                    </div>
                    <div className="flex-1">
                      <span className={`font-poppins font-bold text-[17px] ${open ? 'text-white' : 'text-white/70'}`}>{bloque.categoria}</span>
                      <span className="font-lato text-white/30 text-[14px] ml-3">{bloque.items.length} ítems incluidos</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`}
                      style={{ color: open ? bloque.color : 'rgba(255,255,255,.3)' }} />
                  </button>
                  {open && (
                    <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <ul className="pt-4 space-y-2.5">
                        {bloque.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: bloque.color }} />
                            <span className="font-lato text-white/65 text-[17px] leading-snug">{item}</span>
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

        {/* ─ 05 COTIZACIÓN ─ */}
        <section id="cotizacion" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Propuesta de inversión</TagLabel>
          <SectionTitle>Una inversión mínima para una decisión máxima.</SectionTitle>
          <Rule />
          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            El paquete está diseñado para ser el MVP más eficiente posible: arrancar rápido, medir el mercado y tomar decisiones con datos reales. Valores en{' '}
            <strong className="text-white/75">pesos colombianos (COP)</strong>.
          </p>

          {/* Tabla de precios por componente */}
          <div className="rounded-xl overflow-hidden mb-8" style={{ border: '1px solid rgba(59,130,246,.2)' }}>
            <div className="px-5 py-3 flex items-center justify-between"
              style={{ background: 'linear-gradient(90deg, rgba(59,130,246,.10) 0%, rgba(255,255,255,.03) 100%)', borderBottom: '1px solid rgba(59,130,246,.12)' }}>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" style={{ color: VS_BLUE }} />
                <p className="font-poppins font-semibold text-white/65 text-[13px] uppercase tracking-wider">Desglose de la inversión</p>
              </div>
              <span className="font-lato text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider"
                style={{ background: 'rgba(59,130,246,.12)', border: '1px solid rgba(59,130,246,.28)', color: VS_BLUE }}>
                Pesos colombianos · COP
              </span>
            </div>

            <div className="hidden sm:grid px-5 py-2 font-lato text-white/20 text-[11px] uppercase tracking-wider"
              style={{ gridTemplateColumns: '2.5fr 1fr 1.5fr', background: 'rgba(255,255,255,.015)', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
              <span>Componente</span>
              <span className="text-center">Tipo</span>
              <span className="text-right">Valor</span>
            </div>

            <div className="divide-y divide-white/5">
              {/* Landing page */}
              <div className="px-5 py-4">
                <div className="sm:hidden mb-1">
                  <p className="font-poppins font-semibold text-white/85 text-[15px]">Landing page</p>
                  <p className="font-lato text-white/35 text-[13px] mt-0.5">Diseño, contenido y desarrollo completo</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-lato text-[11px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(59,130,246,.12)', border: '1px solid rgba(59,130,246,.28)', color: VS_BLUE }}>
                      Pago único
                    </span>
                    <span className="font-poppins font-black text-white text-[18px]">COP 400.000</span>
                  </div>
                </div>
                <div className="hidden sm:grid items-center" style={{ gridTemplateColumns: '2.5fr 1fr 1.5fr' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: `linear-gradient(to bottom, ${VS_BLUE}, rgba(59,130,246,.2))` }} />
                    <div>
                      <p className="font-poppins font-semibold text-white/85 text-[15px]">Landing page</p>
                      <p className="font-lato text-white/35 text-[13px] mt-0.5">Diseño, contenido y desarrollo completo</p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <span className="font-lato text-[11px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(59,130,246,.12)', border: '1px solid rgba(59,130,246,.28)', color: VS_BLUE }}>
                      Pago único
                    </span>
                  </div>
                  <p className="font-poppins font-black text-white text-[17px] text-right">COP 400.000</p>
                </div>
              </div>

              {/* Plataforma */}
              <div className="px-5 py-4">
                <div className="sm:hidden mb-1">
                  <p className="font-poppins font-semibold text-white/85 text-[15px]">Plataforma Sixteam.pro</p>
                  <p className="font-lato text-white/35 text-[13px] mt-0.5">Email marketing · Hasta 5.000 correos/mes · 1 usuario</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-lato text-[11px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.28)', color: '#00bfa5' }}>
                      Mensual
                    </span>
                    <span className="font-poppins font-black text-white text-[18px]">COP 300.000</span>
                  </div>
                </div>
                <div className="hidden sm:grid items-center" style={{ gridTemplateColumns: '2.5fr 1fr 1.5fr' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(to bottom, #00bfa5, rgba(0,191,165,.2))' }} />
                    <div>
                      <p className="font-poppins font-semibold text-white/85 text-[15px]">Plataforma Sixteam.pro</p>
                      <p className="font-lato text-white/35 text-[13px] mt-0.5">Email marketing · Hasta 5.000 correos/mes · 1 usuario</p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <span className="font-lato text-[11px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.28)', color: '#00bfa5' }}>
                      Mensual
                    </span>
                  </div>
                  <p className="font-poppins font-black text-white text-[17px] text-right">COP 300.000/mes</p>
                </div>
              </div>

              {/* Campañas */}
              <div className="px-5 py-4">
                <div className="sm:hidden mb-1">
                  <p className="font-poppins font-semibold text-white/85 text-[15px]">Ejecución de campañas</p>
                  <p className="font-lato text-white/35 text-[13px] mt-0.5">5 horas · Configuración, envío y reporte del MVP</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-lato text-[11px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(167,139,250,.12)', border: '1px solid rgba(167,139,250,.28)', color: '#a78bfa' }}>
                      Pago único
                    </span>
                    <span className="font-poppins font-black text-white text-[18px]">COP 750.000</span>
                  </div>
                </div>
                <div className="hidden sm:grid items-center" style={{ gridTemplateColumns: '2.5fr 1fr 1.5fr' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(to bottom, #a78bfa, rgba(167,139,250,.2))' }} />
                    <div>
                      <p className="font-poppins font-semibold text-white/85 text-[15px]">Ejecución de campañas</p>
                      <p className="font-lato text-white/35 text-[13px] mt-0.5">5 horas · Configuración, envío y reporte del MVP</p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <span className="font-lato text-[11px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(167,139,250,.12)', border: '1px solid rgba(167,139,250,.28)', color: '#a78bfa' }}>
                      Pago único
                    </span>
                  </div>
                  <p className="font-poppins font-black text-white text-[17px] text-right">COP 750.000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cards resumen inversión */}
          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-4">
            Resumen de inversión
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* Pagos únicos */}
            <div className="rounded-2xl p-6 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(59,130,246,.10) 0%, rgba(3,13,26,.9) 100%)', border: `1px solid rgba(59,130,246,.3)` }}>
              <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,.06), transparent 70%)', transform: 'translate(20%,-20%)' }} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-lato text-white/40 text-[13px] uppercase tracking-widest">Pagos únicos</p>
                  <span className="font-lato text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider"
                    style={{ background: 'rgba(59,130,246,.15)', border: '1px solid rgba(59,130,246,.35)', color: VS_BLUE }}>
                    Se pagan una sola vez
                  </span>
                </div>
                <p className="font-poppins font-black text-white leading-none mb-2" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>
                  COP 1.150.000
                </p>
                <p className="font-lato text-white/40 text-[14px] mb-4">Landing page + ejecución de campañas del MVP</p>
                <ul className="space-y-1.5">
                  {[
                    { label: 'Landing page', value: 'COP 400.000' },
                    { label: 'Ejecución de campañas', value: 'COP 750.000' },
                  ].map((r, i) => (
                    <li key={i} className="flex items-center justify-between gap-2">
                      <span className="font-lato text-white/55 text-[14px]">{r.label}</span>
                      <span className="font-poppins font-bold text-white/80 text-[14px] flex-shrink-0">{r.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Costo mensual plataforma */}
            <div className="rounded-2xl p-6 relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-lato text-white/40 text-[13px] uppercase tracking-widest">Plataforma mensual</p>
                  <span className="font-lato text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider"
                    style={{ background: 'rgba(0,191,165,.10)', border: '1px solid rgba(0,191,165,.25)', color: '#00bfa5' }}>
                    Mensual recurrente
                  </span>
                </div>
                <p className="font-poppins font-black text-white leading-none mb-2" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>
                  COP 300.000
                </p>
                <p className="font-lato text-white/40 text-[14px] mb-4">Por mes · Sin compromisos de permanencia</p>
                <ul className="space-y-1.5">
                  {[
                    { label: 'Plataforma Sixteam.pro', value: 'COP 300.000/mes' },
                    { label: 'Hasta 5.000 correos incluidos', value: 'Incluido' },
                  ].map((r, i) => (
                    <li key={i} className="flex items-center justify-between gap-2">
                      <span className="font-lato text-white/55 text-[14px]">{r.label}</span>
                      <span className="font-poppins font-bold text-white/80 text-[14px] flex-shrink-0">{r.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Nota sobre correos adicionales */}
          <div className="rounded-xl p-4 sm:p-5 mb-4 flex gap-3"
            style={{ background: 'rgba(59,130,246,.05)', border: '1px solid rgba(59,130,246,.2)' }}>
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: VS_BLUE }} />
            <div>
              <p className="font-poppins font-semibold text-white/80 text-[18px] mb-1">Sobre los correos adicionales</p>
              <p className="font-lato text-white/50 text-[16px] leading-relaxed">
                El plan base incluye hasta <strong className="text-white/70">5.000 correos de marketing por mes</strong>. Si la base de datos supera ese volumen, el costo adicional es de <strong className="text-white/70">COP 8.000 por cada 1.000 correos adicionales</strong>. Para la primera campaña, el equipo evaluará el tamaño real de la base disponible y se ajustará según la necesidad.
              </p>
            </div>
          </div>

          {/* Plugin verificación de correos */}
          <div className="rounded-xl p-4 sm:p-5 mb-8 flex gap-3"
            style={{ background: 'rgba(167,139,250,.05)', border: '1px solid rgba(167,139,250,.2)' }}>
            <Zap className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#a78bfa]" />
            <div>
              <p className="font-poppins font-semibold text-white/80 text-[18px] mb-1">
                Complemento opcional: verificación de correos
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wide align-middle"
                  style={{ background: 'rgba(167,139,250,.12)', border: '1px solid rgba(167,139,250,.3)', color: '#a78bfa' }}>
                  Opcional
                </span>
              </p>
              <p className="font-lato text-white/50 text-[16px] leading-relaxed">
                Plugin que verifica la validez de cada correo antes del envío para evitar rebotes y proteger la reputación del dominio de email marketing. El costo es de <strong className="text-white/70">COP 12.000 por cada 1.000 correos enviados</strong>. Recomendado cuando se trabaja con bases de datos externas o de Cámara de Comercio, donde la tasa de correos inválidos puede ser alta.
              </p>
            </div>
          </div>

          {/* Servicios opcionales futura fase */}
          <div>
            <TagLabel>Servicios opcionales para fases siguientes</TagLabel>
            <Rule />
            <div className="space-y-3">
              {/* CRM */}
              <div className="rounded-xl p-5 flex flex-col gap-3"
                style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.22)' }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,191,165,.15)' }}>
                      <Users className="w-4 h-4 text-[#00bfa5]" />
                    </div>
                    <div>
                      <p className="font-poppins font-bold text-white/85 text-[17px]">Implementación de CRM Sixteam.pro</p>
                      <p className="font-lato text-white/40 text-[13px] mt-0.5">Gestión de contactos, oportunidades y pipeline de ventas</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-1">
                  <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(0,191,165,.10)', border: '1px solid rgba(0,191,165,.25)' }}>
                    <p className="font-lato text-white/35 text-[11px] uppercase tracking-wider mb-0.5">Implementación</p>
                    <p className="font-poppins font-black text-[#00bfa5] text-[16px]">Desde COP 2.500.000</p>
                  </div>
                  <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.10)' }}>
                    <p className="font-lato text-white/35 text-[11px] uppercase tracking-wider mb-0.5">Plataforma mensual</p>
                    <p className="font-poppins font-black text-white/80 text-[16px]">Desde COP 890.000/mes</p>
                  </div>
                </div>
              </div>

              {/* Agente IA */}
              <div className="rounded-xl p-5 flex flex-col gap-3"
                style={{ background: 'rgba(167,139,250,.06)', border: '1px solid rgba(167,139,250,.22)' }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(167,139,250,.15)' }}>
                    <Zap className="w-4 h-4 text-[#a78bfa]" />
                  </div>
                  <div>
                    <p className="font-poppins font-bold text-white/85 text-[17px]">Elaboración de Agente Conversacional con Inteligencia Artificial</p>
                    <p className="font-lato text-white/40 text-[13px] mt-0.5">Agente de IA para atención, calificación y respuesta automática de prospectos</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-1">
                  <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(167,139,250,.10)', border: '1px solid rgba(167,139,250,.25)' }}>
                    <p className="font-lato text-white/35 text-[11px] uppercase tracking-wider mb-0.5">Implementación</p>
                    <p className="font-poppins font-black text-[#a78bfa] text-[16px]">Desde COP 800.000</p>
                  </div>
                </div>
              </div>

              {/* Pauta digital */}
              <div className="rounded-xl p-5 flex flex-col gap-3"
                style={{ background: 'rgba(59,130,246,.06)', border: '1px solid rgba(59,130,246,.22)' }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,.15)' }}>
                    <TrendingUp className="w-4 h-4 text-[#3b82f6]" />
                  </div>
                  <div>
                    <p className="font-poppins font-bold text-white/85 text-[17px]">Servicio de Implementación y Administración de Pauta Digital</p>
                    <p className="font-lato text-white/40 text-[13px] mt-0.5">Google Ads, Meta Ads o LinkedIn según canal más efectivo para Vertical Services</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-1">
                  <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(59,130,246,.10)', border: '1px solid rgba(59,130,246,.25)' }}>
                    <p className="font-lato text-white/35 text-[11px] uppercase tracking-wider mb-0.5">Implementación</p>
                    <p className="font-poppins font-black text-[#3b82f6] text-[16px]">Desde COP 1.000.000</p>
                  </div>
                  <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.10)' }}>
                    <p className="font-lato text-white/35 text-[11px] uppercase tracking-wider mb-0.5">Administración mensual</p>
                    <p className="font-poppins font-black text-white/80 text-[16px]">Desde COP 600.000/mes</p>
                  </div>
                  <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.22)' }}>
                    <p className="font-lato text-white/35 text-[11px] uppercase tracking-wider mb-0.5">Sobre inversión administrada</p>
                    <p className="font-poppins font-black text-[#f59e0b] text-[16px]">+ 10% de la inversión mensual</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── LOGOS DE CLIENTES ── */}
        <div className="mt-16">
          <LogoCarousel />
        </div>

        {/* ─ 06 VIGENCIA ─ */}
        <section id="vigencia" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>06 — Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y Términos de la Propuesta</SectionTitle>
          <Rule />

          <div className="space-y-3">
            {[
              { titulo: 'Aprobación', desc: 'Para aceptar esta propuesta y dar inicio al proyecto, se requiere confirmación vía WhatsApp, correo o verbal. Con esa confirmación se habilita el contrato a firmar y se procede con el inicio del trabajo.', icon: CheckCircle },
              { titulo: 'Términos de pago', desc: 'El pago de la landing page (COP 400.000) y la ejecución de campañas (COP 750.000) se realizan al inicio del proyecto, son pagos únicos. La plataforma Sixteam.pro se factura mensualmente desde el primer mes de uso (COP 300.000/mes). Los pagos se realizan mediante transferencia bancaria.', icon: FileText },
              { titulo: 'Inicio del proyecto', desc: 'El cronograma inicia desde la confirmación de la propuesta y la entrega del material necesario por parte de Vertical Services: logo, información de la empresa y acceso al dominio o VPS.', icon: Zap },
              { titulo: 'Plataforma Sixteam.pro', desc: 'El costo mensual de la plataforma es de COP 300.000 por 1 usuario con hasta 5.000 correos incluidos. Si el volumen supera ese límite, se aplica un cobro adicional de COP 8.000 por cada 1.000 correos adicionales enviados.', icon: Mail },
              { titulo: 'Correos adicionales', desc: 'Si el volumen de envío mensual supera los 5.000 correos incluidos en el plan, el costo adicional es de COP 8.000 por cada 1.000 correos adicionales enviados. Esto se informará antes de cualquier envío que supere ese límite.', icon: Info },
              { titulo: 'Modificaciones al alcance', desc: 'Cualquier solicitud de servicio o funcionalidad no estipulada en esta propuesta requerirá una nueva cotización. Ejemplos: integración de bot de WhatsApp, pauta digital, diseño de redes sociales o desarrollo de funcionalidades adicionales en la landing.', icon: AlertCircle },
              { titulo: 'Vigencia de la propuesta', desc: 'Esta propuesta tiene una vigencia de 30 días calendario desde su fecha de emisión. Pasado este plazo, los valores podrán ser revisados según condiciones del mercado.', icon: Clock },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="rounded-xl p-4 sm:p-5 flex gap-4"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <Icon className="w-4 h-4 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-poppins font-semibold text-white/80 text-[18px] mb-1">{item.titulo}</p>
                    <p className="font-lato text-white/50 text-[18px] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-12 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 100%, rgba(0,191,165,.05), transparent 70%)' }} />
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

export default VerticalServicesProposal;
