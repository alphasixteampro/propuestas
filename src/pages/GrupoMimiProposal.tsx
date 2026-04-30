import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, ChevronRight, FileText, Target, Zap,
  MessageSquare, AlertCircle, Mail, ArrowRight, Building2,
  Calendar, Hash, User, Info, Globe, MapPin,
  Users, Clock, Bot, UtensilsCrossed, TrendingUp, BarChart3,
} from 'lucide-react';
import LogoCarousel from '../components/LogoCarousel';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Grupo Mimi',
  marcas: ['Mimi', 'Burguer Stock'],
  tagline: 'El sabor de Barranquilla',
  sector: 'Restaurantes · Gastronomía',
  sede: 'Barranquilla, Colombia',
  fecha: 'Abril 2026',
  lugar: 'Barranquilla, Colombia',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  objetivo: 'Bot de IA para pedidos y reservas en WhatsApp — Mimi & Burguer Stock',
};

const ACCENT = '#e8530a';
const ACCENT_ALPHA = (a: number) => `rgba(232,83,10,${a})`;

const DIAGNOSTICO = [
  {
    titulo: 'Posible cuello de botella en momentos de alta demanda',
    desc: 'En fines de semana, fechas especiales o franjas de alta demanda, gestionar manualmente los pedidos de dos marcas a la vez podría generar tiempos de respuesta elevados y el riesgo de perder pedidos por falta de capacidad de atención.',
    icon: Users,
    tint: 'amber',
  },
  {
    titulo: 'Oportunidad de trazabilidad y datos',
    desc: 'Un canal de pedidos completamente manual puede dificultar el registro estructurado de pedidos, historial de clientes y métricas de volumen — información valiosa para tomar decisiones sobre el negocio.',
    icon: BarChart3,
    tint: 'teal',
  },
];

const TINT: Record<string, { text: string; bg: string; border: string }> = {
  amber: { text: 'text-amber-400',  bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.18)' },
  teal:  { text: 'text-[#00bfa5]',  bg: 'rgba(0,191,165,.07)',   border: 'rgba(0,191,165,.18)' },
  blue:  { text: 'text-[#60a5fa]',  bg: 'rgba(96,165,250,.07)',  border: 'rgba(96,165,250,.18)' },
  red:   { text: 'text-[#f87171]',  bg: 'rgba(221,51,51,.07)',   border: 'rgba(221,51,51,.2)' },
};

const FLUJO = [
  {
    paso: '01',
    titulo: 'Bienvenida e identificación de marca',
    desc: 'El bot recibe al cliente, lo saluda y le pregunta si quiere pedir de Mimi o de Burguer Stock — manejando ambas marcas desde un solo número de WhatsApp.',
    icon: MessageSquare,
    color: '#60a5fa',
  },
  {
    paso: '02',
    titulo: 'Envío del menú',
    desc: 'Según la marca seleccionada, el bot envía el menú correspondiente en PDF. El cliente puede explorar opciones sin esperar a un humano.',
    icon: UtensilsCrossed,
    color: ACCENT,
  },
  {
    paso: '03',
    titulo: 'Asesoría del menú con IA',
    desc: 'El cliente puede hacer preguntas sobre platos, ingredientes, combos, precios o recomendaciones. La IA responde con contexto real del menú — reduciendo fricciones y ayudando a decidir más rápido.',
    icon: Bot,
    color: '#c084fc',
  },
  {
    paso: '04',
    titulo: 'Captura de datos del pedido',
    desc: 'El bot solicita los datos necesarios para el pedido: nombre, dirección de entrega, teléfono de contacto, productos seleccionados, etc.',
    icon: FileText,
    color: '#00bfa5',
  },
  {
    paso: '05',
    titulo: 'Handoff al operador humano',
    desc: 'Con el pedido listo y los datos capturados, el bot transfiere la conversación al operador humano con un resumen completo. El humano solo necesita confirmar, ajustar si hay algo y dar el cierre — sin hacer todo el proceso desde cero.',
    icon: Users,
    color: '#fbbf24',
  },
];

const SERVICIOS = [
  {
    num: 'Servicio 1',
    nombre: 'Implementación del bot de IA para pedidos',
    tipo: 'Pago único',
    valor: 'COP 2.000.000',
    icon: Bot,
    destacado: true,
    entregables: [
      'Configuración del bot en WhatsApp Business API',
      'Entrenamiento del bot con el menú de Mimi y Burguer Stock',
      'Flujo conversacional completo: saludo → menú → asesoría → captura de datos → handoff',
      'Reglas de handoff configuradas para transferencia al operador',
      'Configuración de respuestas rápidas y mensajes de bienvenida por marca',
      'Pruebas de calidad end-to-end con escenarios reales de pedido',
      'Capacitación al operador (hasta 4 horas) sobre uso del panel y gestión de handoffs',
    ],
    detalle: [
      'Levantamiento del menú completo de ambas marcas y criterios de atención del negocio.',
      'Diseño y configuración del flujo conversacional para cada marca: bienvenida, envío de menú, manejo de preguntas frecuentes y captura de datos del pedido.',
      'Entrenamiento de la IA con el vocabulario, productos y estilo de comunicación de Grupo Mimi.',
      'Configuración de reglas de handoff: cuándo y cómo el bot transfiere al humano con resumen del pedido.',
      'Pruebas en escenarios reales (pedidos simples, pedidos con preguntas, pedidos con modificaciones) antes de salida a producción.',
      'Sesión de capacitación con el operador: cómo gestionar conversaciones transferidas, cómo actualizar el menú y cómo escalar incidencias.',
    ],
  },
  {
    num: 'Servicio 2',
    nombre: 'Licencia mensual del bot — operación continua',
    tipo: 'Pago mensual',
    valor: 'COP 500.000',
    icon: Zap,
    destacado: false,
    entregables: [
      'Bot activo 24/7 para ambas marcas',
      'Actualizaciones del menú (cambios de precios, productos nuevos, temporadas)',
      'Ajustes menores al flujo conversacional según feedback del operador',
      'Soporte técnico ante caídas o errores del bot vía WhatsApp',
      'Monitoreo mensual de conversaciones y calidad de respuestas',
    ],
    detalle: [
      'Mantenimiento continuo del bot para garantizar disponibilidad operativa 24/7.',
      'Ejecución de cambios en el menú o el flujo solicitados por el cliente (hasta 4 cambios por mes).',
      'Revisión mensual de calidad: muestra de conversaciones, tasa de handoff y detección de errores o respuestas incorrectas del bot.',
      'Canal de soporte directo vía WhatsApp con respuesta en horario hábil.',
    ],
  },
];

const SECCIONES = [
  { id: 'resumen',  label: 'Resumen' },
  { id: 'objetivo', label: 'Objetivo' },
  { id: 'flujo',    label: 'Flujo del bot' },
  { id: 'plan',     label: 'Servicios' },
  { id: 'vigencia', label: 'Vigencia' },
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

const GrupoMimiProposal = () => {
  const [activeSection, setActiveSection] = useState('resumen');
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

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const s1 = useVisible(); const s2 = useVisible(); const s3 = useVisible();
  const s4 = useVisible(); const s5 = useVisible();

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
            style={{ background: `radial-gradient(circle, ${ACCENT_ALPHA(0.05)} 0%, transparent 65%)` }} />
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
          <span className="font-lato text-[#00bfa5]/80 text-[13px] uppercase tracking-[0.2em] border border-[#00bfa5]/20 rounded-full px-3 py-1.5">
            Confidencial
          </span>
        </div>

        <style>{`
          @keyframes cover-spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes cover-spin-rev  { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
          @keyframes cover-pulse-glow { 0%, 100% { opacity: 0.07; transform: scale(1); } 50% { opacity: 0.14; transform: scale(1.1); } }
          @keyframes cover-float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
          .cover-ring-1 { animation: cover-spin-slow 24s linear infinite; }
          .cover-ring-2 { animation: cover-spin-rev  18s linear infinite; }
          .cover-glow   { animation: cover-pulse-glow 4s ease-in-out infinite; }
          .cover-float  { animation: cover-float 5s ease-in-out infinite; }
        `}</style>

        {/* Cuerpo portada */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            {/* Izquierda */}
            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta de trabajo y cotización</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, #c44008)` }}>
                  <UtensilsCrossed className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: ACCENT_ALPHA(0.08), border: `1px solid ${ACCENT_ALPHA(0.22)}`, color: ACCENT }}>
                  {META.tagline}
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}>
                Propuesta<br />
                <span style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Comercial
                </span>
              </h1>
              <p className="font-lato text-white/55 text-xl leading-relaxed mb-5">
                {META.objetivo}
              </p>

              {/* Eslogan */}
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

              {/* Chips */}
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  { icon: Calendar, text: META.fecha },
                  { icon: MapPin,   text: META.lugar },
                  { icon: Globe,    text: META.sector },
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

              {/* Índice */}
              <div className="border-t pt-5" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-widest mb-3">Contenido</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                  {['1. Resumen ejecutivo', '2. Objetivo general', '3. Flujo del bot', '4. Servicios e Inversión', '5. Vigencia y términos'].map((item, i) => (
                    <button key={i} onClick={() => scrollTo(SECCIONES[i]?.id)}
                      className="font-lato text-white/45 text-[15px] hover:text-[#00bfa5] transition-colors duration-200 text-left flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#00bfa5]/40 flex-shrink-0" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Derecha: animación */}
            <div className="flex items-center justify-center relative min-h-[380px]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="cover-glow absolute w-80 h-80 rounded-full"
                  style={{ background: `radial-gradient(circle, ${ACCENT_ALPHA(0.09)} 0%, rgba(29,112,162,.04) 50%, transparent 70%)` }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full"
                  style={{ border: `1px solid ${ACCENT_ALPHA(0.10)}` }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full"
                  style={{ border: '1px dashed rgba(29,112,162,.15)' }} />
                <div className="cover-ring-1 absolute w-96 h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: ACCENT, boxShadow: `0 0 6px ${ACCENT_ALPHA(0.8)}` }} />
                </div>
              </div>

              <div className="cover-float relative z-10 flex flex-col items-center gap-5 w-full px-6">
                {/* Sixteam */}
                <div className="flex flex-col items-center gap-1">
                  <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-20 w-auto object-contain"
                    style={{ filter: 'drop-shadow(0 4px 20px rgba(0,191,165,.45))' }} />
                  <span className="font-poppins font-black text-white/30 text-[11px] uppercase tracking-[0.2em]">Sixteam.pro</span>
                </div>
                {/* Divisor */}
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.08))' }} />
                  <div className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)' }}>
                    <span className="font-poppins font-black text-white/40 text-[20px] leading-none">×</span>
                  </div>
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,.08), transparent)' }} />
                </div>
                {/* Marcas con logos reales */}
                <div className="flex flex-col items-center gap-3 w-full">
                  <div className="flex gap-4 justify-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center bg-white"
                        style={{ boxShadow: `0 4px 20px ${ACCENT_ALPHA(0.2)}` }}>
                        <img src="https://assets.cdn.filesafe.space/dMX4yw4WB0RZFivUhgyG/media/69f29bc3e84e52bef4d5cb90.png" alt="Mimi"
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            const el = e.target as HTMLImageElement;
                            el.style.display = 'none';
                            el.parentElement!.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:rgba(232,83,10,.15)"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e8530a" stroke-width="2"><path d="M3 2h18l-2 14H5L3 2z"/><path d="M3 2 2 22"/><path d="M21 2l1 20"/></svg></div>';
                          }} />
                      </div>
                      <span className="font-poppins font-black text-white/70 text-[13px]">Mimi</span>
                      <span className="font-lato text-white/30 text-[10px] uppercase tracking-wider">Postres · Brunch</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center"
                        style={{ background: '#000', boxShadow: '0 4px 20px rgba(0,0,0,.4)' }}>
                        <img src="https://assets.cdn.filesafe.space/dMX4yw4WB0RZFivUhgyG/media/69f29bc36630fc6c0b6a24d6.png" alt="Burguer Stock"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const el = e.target as HTMLImageElement;
                            el.style.display = 'none';
                            el.parentElement!.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><path d="M3 2h18l-2 14H5L3 2z"/></svg></div>';
                          }} />
                      </div>
                      <span className="font-poppins font-black text-white/70 text-[13px]">Burguer Stock</span>
                      <span className="font-lato text-white/30 text-[10px] uppercase tracking-wider">Hamburguesas</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{ background: 'rgba(0,191,165,.07)', border: '1px solid rgba(0,191,165,.18)' }}>
                    <Bot className="w-4 h-4 text-[#00bfa5]" />
                    <span className="font-poppins font-bold text-[#00bfa5] text-[13px]">Bot de IA · WhatsApp</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll cue */}
        <div className="relative z-10 flex flex-col items-center gap-2 pb-10 opacity-30 no-print">
          <p className="font-lato text-white text-[13px] uppercase tracking-widest">Desplazar</p>
          <div className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </header>

      {/* ══════════════════════════════════════ SOCIAL PROOF */}
      <div className="w-full relative z-20 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <LogoCarousel />
      </div>

      {/* ══════════════════════════════════════ CONTENIDO */}
      <main className="max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-20 space-y-24">

        {/* ─ 01 RESUMEN ─ */}
        <section id="resumen" ref={s1.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s1.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>01 — Resumen ejecutivo</TagLabel>
          <SectionTitle>Contexto y oportunidad</SectionTitle>
          <Rule />

          {/* Ficha cliente */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center bg-white"
                style={{ boxShadow: `0 4px 20px ${ACCENT_ALPHA(0.2)}` }}>
                <img src="https://assets.cdn.filesafe.space/dMX4yw4WB0RZFivUhgyG/media/69f29bc3e84e52bef4d5cb90.png" alt="Grupo Mimi" className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = 'none';
                    el.parentElement!.style.background = `linear-gradient(135deg, ${ACCENT}, #c44008)`;
                    el.parentElement!.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 2h18l-2 14H5L3 2z"/></svg>';
                  }} />
              </div>
              <span className="font-poppins font-black text-white text-[15px] tracking-tight text-center">Grupo Mimi</span>
              <span className="font-lato text-[11px] uppercase tracking-[0.2em]" style={{ color: ACCENT }}>{META.tagline}</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Sector</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">{META.sector}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Ubicación</p>
                <p className="font-poppins font-semibold text-white/80 text-[18px]">{META.sede}</p>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Marcas</p>
                <div className="flex gap-2">
                  {META.marcas.map(m => (
                    <span key={m} className="font-lato text-[13px] px-2 py-0.5 rounded-full text-white/65"
                      style={{ background: ACCENT_ALPHA(0.10), border: `1px solid ${ACCENT_ALPHA(0.22)}` }}>{m}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-wider mb-1">Solución</p>
                <p className="font-lato text-white/60 text-[16px]">Bot de IA para pedidos · WhatsApp</p>
              </div>
            </div>
          </div>

          {/* Narrativa */}
          <div className="space-y-4 text-white/65 text-[19px] leading-relaxed mb-10">
            <p>Mimi y Burguer Stock son marcas reconocidas en Barranquilla — Mimi en postres y brunch, Burguer Stock en hamburguesas. Esa reputación es un activo valioso que puede generar una demanda importante de domicilios por WhatsApp que, de no estar bien estructurada, puede volverse difícil de gestionar.</p>
            <p>En momentos de alta demanda — fines de semana, fechas especiales o lanzamientos — la atención completamente manual de pedidos para dos marcas simultáneamente <strong className="text-white/90 font-semibold">podría resultar en tiempos de espera elevados, pedidos que se pierden y un desgaste operativo innecesario.</strong> La automatización del proceso inicial es la respuesta natural para escalar sin perder el toque humano que distingue a las marcas.</p>
            <p>La solución no es reemplazar al humano — es darle una herramienta que haga todo el proceso previo de forma automática, para que él solo llegue cuando el pedido ya está listo para confirmar. <strong className="text-white/90 font-semibold">Menos tiempo respondiendo, más tiempo cerrando.</strong></p>
          </div>

          {/* Posibles situaciones */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00bfa5]" /> Posibles situaciones a optimizar
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DIAGNOSTICO.map((h, i) => {
                const Icon = h.icon; const t = TINT[h.tint];
                return (
                  <div key={i} className="rounded-xl p-4 flex gap-3"
                    style={{ background: t.bg, border: `1px solid ${t.border}` }}>
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
          <TagLabel>02 — Objetivo general</TagLabel>
          <SectionTitle>¿Para qué estamos aquí?</SectionTitle>
          <Rule />
          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${ACCENT_ALPHA(0.05)}, transparent 70%)`, transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 text-[#00bfa5] mb-4" />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[23px] leading-relaxed">
              Implementar un bot de inteligencia artificial en WhatsApp que automatice la etapa inicial de atención de pedidos y reservas para Mimi y Burguer Stock — enviando el menú, resolviendo dudas, gestionando reservas de mesa y capturando los datos del cliente — para que el operador humano solo intervenga en el momento de confirmar y cerrar, multiplicando su capacidad sin perder el toque humano que distingue a las marcas.
            </p>
          </div>

          {/* Propuesta de valor clave */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: Bot,    title: 'Automatización inteligente', desc: 'El bot maneja el 80% del flujo de pedido sin intervención humana.' },
              { icon: Users,  title: 'El humano donde importa', desc: 'El operador entra solo al final, con el pedido listo para confirmar.' },
              { icon: Clock,  title: 'Respuesta 24/7',            desc: 'El bot no descansa ni tiene hora pico — siempre disponible.' },
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="rounded-xl p-4 flex flex-col gap-2"
                  style={{ background: ACCENT_ALPHA(0.04), border: `1px solid ${ACCENT_ALPHA(0.14)}` }}>
                  <Icon className="w-5 h-5" style={{ color: ACCENT }} />
                  <p className="font-poppins font-bold text-white/80 text-[16px]">{v.title}</p>
                  <p className="font-lato text-white/45 text-[14px] leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─ 03 FLUJO DEL BOT ─ */}
        <section id="flujo" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 — Flujo del bot</TagLabel>
          <SectionTitle>Cómo funciona paso a paso</SectionTitle>
          <Rule />
          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            El bot gestiona el pedido de forma autónoma desde el primer mensaje hasta que el operador humano recibe un resumen listo para confirmar.
          </p>

          <div className="relative">
            <div className="space-y-3">
              {FLUJO.map((f, i) => {
                const Icon = f.icon;
                const isLast = i === FLUJO.length - 1;
                return (
                  <div key={i} className="rounded-xl p-4 sm:p-5 flex gap-4 sm:gap-5 relative"
                    style={{ background: isLast ? 'rgba(251,191,36,.05)' : 'rgba(255,255,255,.03)', border: isLast ? '1px solid rgba(251,191,36,.2)' : '1px solid rgba(255,255,255,.07)' }}>
                    {/* Icono paso */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center relative z-10"
                        style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                        <Icon className="w-5 h-5" style={{ color: f.color }} />
                      </div>
                      <span className="font-poppins font-black text-[11px]" style={{ color: f.color }}>{f.paso}</span>
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-poppins font-bold text-white/90 text-[18px]">{f.titulo}</p>
                        {isLast && (
                          <span className="px-2 py-0.5 rounded-full font-lato font-bold text-[10px] uppercase text-amber-900 bg-amber-400">
                            🤝 Interviene el humano
                          </span>
                        )}
                      </div>
                      <p className="font-lato text-white/50 text-[16px] leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nota handoff */}
          <div className="mt-6 rounded-xl p-4 sm:p-5 flex gap-4"
            style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.2)' }}>
            <CheckCircle className="w-5 h-5 text-[#00bfa5] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-poppins font-bold text-white/80 text-[16px] mb-1">El rol humano es insustituible — y lo potenciamos</p>
              <p className="font-lato text-white/50 text-[15px] leading-relaxed">
                El bot no reemplaza al operador: lo libera. Cuando el humano entra a la conversación, ya tiene frente a él el nombre del cliente, su dirección, su número y los productos que quiere. Solo necesita confirmar, ajustar si hay algo y cerrar — en segundos. Su tiempo de atención por pedido se reduce drásticamente, lo que le permite atender más pedidos en el mismo tiempo y con menos desgaste.
              </p>
            </div>
          </div>
        </section>

        {/* ─ 04 SERVICIOS E INVERSIÓN ─ */}
        <section id="plan" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 — Servicios e Inversión</TagLabel>
          <SectionTitle>Lo que incluye la propuesta</SectionTitle>
          <Rule />

          <div className="space-y-2.5 mb-10">
            {SERVICIOS.map((s, i) => {
              const Icon = s.icon; const open = servicioActivo === i;
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
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`font-poppins font-bold text-[18px] ${open ? 'text-white' : 'text-white/70'}`}>{s.num}</span>
                        {s.destacado && (
                          <span className="px-2 py-0.5 rounded-full font-lato font-bold text-[11px] uppercase tracking-wider text-[#030d1a]"
                            style={{ background: '#00bfa5' }}>★ Inicio recomendado</span>
                        )}
                      </div>
                      <p className={`font-lato text-[18px] mt-0.5 ${open ? 'text-white/80' : 'text-white/40'}`}>{s.nombre}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <div className="text-right hidden sm:block">
                        <p className={`font-poppins font-bold text-[18px] ${s.destacado ? 'text-[#00bfa5]' : 'text-white/60'}`}>{s.valor}</p>
                        <p className="font-lato text-white/30 text-[13px] mt-0.5">{s.tipo}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-[#00bfa5]/60 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-90' : ''}`} />
                    </div>
                  </button>
                  {open && (
                    <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Entregables</p>
                          <ul className="space-y-2">
                            {s.entregables.map((e, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                                <span className="font-lato text-white/65 text-[18px]">{e}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-3">Actividades</p>
                          <ul className="space-y-2.5">
                            {s.detalle.map((d, j) => (
                              <li key={j} className="font-lato text-white/50 text-[18px] leading-snug pl-3 border-l border-[#1d70a2]/30">{d}</li>
                            ))}
                          </ul>
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                            <p className="font-lato text-white/30 text-[15px]">Forma de pago: <span className="text-white/55">{s.tipo}</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Costo de IA variable */}
          <div className="rounded-xl p-4 sm:p-5 mb-6"
            style={{ background: 'rgba(96,165,250,.05)', border: '1px solid rgba(96,165,250,.18)' }}>
            <div className="flex items-start gap-3">
              <Bot className="w-5 h-5 text-[#60a5fa] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-poppins font-bold text-white/80 text-[16px] mb-1">Costo de IA — variable · asumido por el cliente</p>
                <p className="font-lato text-white/50 text-[15px] leading-relaxed mb-3">
                  El uso del modelo de inteligencia artificial tiene un costo por mensaje procesado que varía según el volumen de pedidos del mes. Este costo es transparente y lo asume directamente el cliente.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(96,165,250,.08)', border: '1px solid rgba(96,165,250,.18)' }}>
                    <p className="font-poppins font-black text-[#60a5fa] text-[18px]">USD 0,02</p>
                    <p className="font-lato text-white/40 text-[12px]">por mensaje procesado</p>
                  </div>
                  <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(96,165,250,.08)', border: '1px solid rgba(96,165,250,.18)' }}>
                    <p className="font-poppins font-bold text-white/70 text-[15px]">Ejemplo: 500 msgs/mes</p>
                    <p className="font-lato text-white/40 text-[12px]">≈ USD 10 / mes en IA</p>
                  </div>
                  <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(96,165,250,.08)', border: '1px solid rgba(96,165,250,.18)' }}>
                    <p className="font-poppins font-bold text-white/70 text-[15px]">Facturación mensual</p>
                    <p className="font-lato text-white/40 text-[12px]">según consumo real</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen de inversión */}
          <div className="rounded-2xl p-5 sm:p-7"
            style={{ background: ACCENT_ALPHA(0.04), border: `1px solid ${ACCENT_ALPHA(0.18)}` }}>
            <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" style={{ color: ACCENT }} /> Resumen de inversión
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-lato text-white/60 text-[18px]">Implementación (único)</span>
                <span className="font-poppins font-bold text-white/80 text-[18px]">COP 2.000.000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-lato text-white/60 text-[18px]">Licencia mensual del bot</span>
                <span className="font-poppins font-bold text-white/80 text-[18px]">COP 500.000 / mes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-lato text-white/60 text-[18px]">Costo de IA (variable)</span>
                <span className="font-poppins font-bold text-white/80 text-[18px]">USD 0,02 / mensaje</span>
              </div>
              <div className="border-t pt-3 mt-1" style={{ borderColor: 'rgba(255,255,255,.07)' }}>
                <div className="flex items-center justify-between">
                  <span className="font-poppins font-semibold text-white/70 text-[18px]">Inversión primer mes</span>
                  <span className="font-poppins font-black text-[23px]" style={{ color: ACCENT }}>COP 2.500.000 + IA</span>
                </div>
                <p className="font-lato text-white/30 text-[13px] mt-1">Implementación + primer mes de licencia. Desde el mes 2: COP 500.000 + IA.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─ 05 VIGENCIA ─ */}
        <section id="vigencia" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 — Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y Términos de la Propuesta</SectionTitle>
          <Rule />

          <div className="space-y-3">
            {[
              {
                titulo: 'Aprobación',
                desc: 'Para aceptar esta propuesta y dar inicio al proyecto, se requiere confirmación vía WhatsApp, correo o verbal para habilitar el contrato a firmar y proceder con el pago.',
                icon: CheckCircle,
              },
              {
                titulo: 'Términos de pago — Implementación',
                desc: 'El pago de COP 1.000.000 por implementación se realiza en su totalidad antes de iniciar los trabajos. Al recibir el pago se da inicio inmediato al levantamiento del menú y configuración del bot.',
                icon: FileText,
              },
              {
                titulo: 'Términos de pago — Licencia mensual',
                desc: 'La licencia de COP 500.000 se factura mensualmente de forma anticipada el primer día hábil de cada mes. Incluye operación del bot, soporte y ajustes menores de contenido. También se puede configurar suscripción automática para mayor comodidad.',
                icon: Calendar,
              },
              {
                titulo: 'Costo de IA',
                desc: 'El costo de los modelos de IA (USD 0,02 por mensaje) es asumido directamente por el cliente. Se factura mes vencido según el consumo real del período. Sixteam reporta el consumo mensualmente con detalle.',
                icon: Bot,
              },
              {
                titulo: 'Material requerido del cliente',
                desc: 'Para iniciar la implementación, el cliente debe proveer el menú actualizado de Mimi y Burguer Stock (con precios), los criterios de atención y cualquier restricción o política de pedidos relevante.',
                icon: AlertCircle,
              },
              {
                titulo: 'Inicio del proyecto',
                desc: 'El cronograma de implementación (estimado 1–2 semanas) comienza a partir del pago inicial y la entrega del material del menú por parte del cliente.',
                icon: Zap,
              },
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
        </section>
      </main>

      {/* ══════════════════════════════════════ FOOTER */}
      <footer style={{ background: 'linear-gradient(180deg, #04111f, #030d1a)' }}>
        <div className="relative overflow-hidden border-t" style={{ borderColor: ACCENT_ALPHA(0.12) }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full"
              style={{ background: `radial-gradient(circle, ${ACCENT_ALPHA(0.05)}, transparent 65%)`, transform: 'translate(30%,-30%)' }} />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-16 sm:py-20 text-center">
            <TagLabel>¿Avanzamos?</TagLabel>
            <h2 className="font-poppins font-black text-white mt-4 mb-4 leading-tight"
              style={{ fontSize: 'clamp(2.25rem, 6.25vw, 4rem)' }}>
              ¿Listo Grupo Mimi para automatizar sin perder el toque humano?
            </h2>
            <p className="font-lato text-white/50 max-w-md mx-auto mb-8 text-[18px] sm:text-xl leading-relaxed">
              Podemos iniciar esta semana. Escríbenos para confirmar, coordinar el menú y arrancar.
            </p>
            <div className="flex justify-center">
              <a href="https://wa.me/573004188522" target="_blank" rel="noopener noreferrer"
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
              <p className="font-poppins font-black text-white text-xl mb-0.5">Sixteam<span className="text-[#00bfa5]">.</span>pro</p>
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

export default GrupoMimiProposal;
