import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel, { defaultLogos } from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, ChevronDown, Clock, Calendar, MapPin, Info,
  ArrowRight, ArrowDown, Database, MessageCircle, GitBranch, Workflow, Wrench,
  Zap, AlertCircle, ShieldCheck, FileText, KeyRound, Timer, Wallet, Receipt,
  Package, Code2, Truck, Plug, Send, Star, Building2, Layers, Calculator,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────
// En los textos, **palabra** se resalta con rich()

const META = {
  cliente: 'SYL Roofing',
  fecha: 'Noviembre 2026',
  modalidad: 'Remoto · por horas',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  elaboradaPor: 'Ernesto Hernández',
  cargo: 'Gerente Comercial Sixteam.pro',
};

// Naranja del techo en el logo de SYL
const SYL = '#f7941d';

// ─── TARIFAS ─────────────────────────────────────────────────────────────────

const TARIFA_USO = 49;       // USD por hora, se paga al final del período
const TARIFA_PAQUETE = 39;   // USD por hora, pago anticipado
const MIN_PAQUETE = 15;      // horas mínimas del paquete
const VIGENCIA_HORAS = 3;    // meses desde la compra para usar las horas del paquete
const AHORRO_HORA = TARIFA_USO - TARIFA_PAQUETE;
const AHORRO_PCT = Math.round(AHORRO_HORA / TARIFA_USO * 100);
// Desde cuántas horas el paquete mínimo sale más barato que pagar por uso
const PUNTO_EQUILIBRIO = Math.floor(MIN_PAQUETE * TARIFA_PAQUETE / TARIFA_USO) + 1;

const usd = (n: number) => 'USD ' + n.toLocaleString('es-CO', { maximumFractionDigits: 2 });
const horas = (n: number) => `${n.toLocaleString('es-CO')} ${n === 1 ? 'hora' : 'horas'}`;

// ─── SUS HERRAMIENTAS ────────────────────────────────────────────────────────

const STACK = [
  { nombre: 'NetSuite API', icon: Database },
  { nombre: 'HubSpot', icon: Building2 },
  { nombre: 'Make', icon: Workflow },
  { nombre: 'n8n', icon: Plug },
  { nombre: 'WhatsApp backend', icon: MessageCircle },
  { nombre: 'GitHub', icon: GitBranch },
];

// ─── EL SERVICIO ─────────────────────────────────────────────────────────────

const AREAS = [
  {
    nombre: 'Integración NetSuite ↔ HubSpot',
    icon: Database, color: '#60a5fa',
    items: ['Mantenimiento de la sincronización en Make', 'Actualizaciones por **API de NetSuite**', 'Nuevos campos, objetos y reglas'],
  },
  {
    nombre: 'Automatizaciones en Make y n8n',
    icon: Workflow, color: '#00bfa5',
    items: ['Corrección de escenarios con error', 'Flujos nuevos de principio a fin', 'Alertas cuando un flujo falla'],
  },
  {
    nombre: 'Backend de WhatsApp',
    icon: MessageCircle, color: '#34d399',
    items: ['Mensajes y notificaciones automáticas', 'Webhooks y plantillas', 'Ajustes de la lógica del backend'],
  },
  {
    nombre: 'Código y GitHub',
    icon: Code2, color: '#a78bfa',
    items: ['Desarrollo **front y back end**', 'Versionado y despliegues ordenados', 'Revisión y mejora del código actual'],
  },
  {
    nombre: 'Soporte técnico',
    icon: Wrench, color: SYL,
    items: ['Diagnóstico de incidencias', 'Atención prioritaria de urgencias', 'Documentación de cada solución'],
  },
];

const COMO_FUNCIONA = [
  { titulo: 'Usted solicita', desc: 'Por **WhatsApp, Slack o correo**.', icon: Send, color: '#60a5fa' },
  { titulo: 'Estimamos', desc: 'Le damos las **horas estimadas** y **usted aprueba**.', icon: Timer, color: '#00bfa5' },
  { titulo: 'Lo resolvemos', desc: 'Con un equipo **full stack** que ya conoce su operación.', icon: Code2, color: '#a78bfa' },
  { titulo: 'Reporte mensual', desc: 'El **detalle de las horas usadas**, con sus **entregables** y las **soluciones implementadas**.', icon: Receipt, color: SYL },
];

// ─── INVERSIÓN ───────────────────────────────────────────────────────────────

const MODALIDADES = [
  {
    clave: 'uso',
    etiqueta: 'Por uso',
    nombre: 'Pague solo lo que use',
    precio: TARIFA_USO,
    unidad: 'por hora',
    pago: 'Se paga **al final de cada mes**, según las horas reportadas',
    icon: Wallet, color: '#60a5fa',
    items: [
      '**Sin mínimo** de horas ni compromiso',
      '**Reporte mensual** con cada tarea y su tiempo',
      'Ideal para **soporte puntual** y meses tranquilos',
    ],
  },
  {
    clave: 'paquete',
    etiqueta: 'Paquete de horas',
    nombre: `Desde ${MIN_PAQUETE} horas`,
    precio: TARIFA_PAQUETE,
    unidad: 'por hora',
    pago: '**Pago anticipado** del paquete',
    icon: Package, color: SYL,
    destacado: true,
    items: [
      `**Ahorra ${usd(AHORRO_HORA)} en cada hora** (${AHORRO_PCT} % menos)`,
      `Paquete mínimo de **${MIN_PAQUETE} horas: ${usd(MIN_PAQUETE * TARIFA_PAQUETE)}**`,
      `Las horas no usadas **se acumulan** y vencen a los **${VIGENCIA_HORAS} meses** de la compra`,
      '**Prioridad** en la agenda del equipo',
      'Se recarga en cualquier momento **al mismo valor**',
    ],
  },
];

const ATAJOS = [5, 10, 15, 20, 30, 40];

// Ejemplo de un mes con el paquete mínimo de 15 horas
const EJEMPLO_MES = [
  { tarea: 'Diagnóstico y corrección de los avisos de las 4 etapas de despacho', area: 'Soporte', horas: 5 },
  { tarea: 'Ajuste de un escenario de Make en la sincronización NetSuite → HubSpot', area: 'Integración', horas: 2 },
  { tarea: 'Revisión de un flujo de n8n que se detuvo', area: 'Automatización', horas: 1.5 },
  { tarea: 'Actualización de un campo de pedidos por API de NetSuite', area: 'Integración', horas: 1 },
  { tarea: 'Flujo nuevo en n8n que avisa por WhatsApp los pedidos listos para despacho', area: 'Automatización', horas: 3 },
  { tarea: 'Informe en HubSpot de los pedidos sincronizados desde NetSuite', area: 'Integración', horas: 2 },
  { tarea: 'Soporte de una incidencia en el backend de WhatsApp', area: 'WhatsApp', horas: 0.5 },
];
const TOTAL_EJEMPLO = EJEMPLO_MES.reduce((a, r) => a + r.horas, 0);

const AREA_COLOR: Record<string, string> = {
  Soporte: SYL,
  Integración: '#60a5fa',
  Automatización: '#00bfa5',
  WhatsApp: '#34d399',
};

// Carrusel sin el logo de SYL (doble para el bucle infinito)
const LOGOS_SIN_SYL = defaultLogos.filter(l => l.src !== '/Logo roofing.png');
const LOGOS_CARRUSEL = [...LOGOS_SIN_SYL, ...LOGOS_SIN_SYL];

const SECCIONES = [
  { id: 'servicio',  label: 'El servicio' },
  { id: 'inversion', label: 'Inversión' },
  { id: 'vigencia',  label: 'Términos' },
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

const rich = (t: string, color = '#ffffff') =>
  t.split('**').map((s, i) => i % 2
    ? <strong key={i} className="font-semibold" style={{ color }}>{s}</strong>
    : <React.Fragment key={i}>{s}</React.Fragment>);

const Hl = ({ children, color = '#00bfa5' }: { children: React.ReactNode; color?: string }) => (
  <strong className="font-semibold" style={{ color }}>{children}</strong>
);

const TagLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="font-lato text-[#00bfa5] text-[13px] uppercase tracking-[0.22em] font-medium">{children}</span>
);
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-poppins font-extrabold text-white mt-3 mb-3 leading-[1.1]"
    style={{ fontSize: 'clamp(2rem, 4.6vw, 2.9rem)' }}>
    {children}
  </h2>
);
const Lead = ({ children }: { children: React.ReactNode }) => (
  <p className="font-lato text-white/55 text-[19px] sm:text-[20px] leading-relaxed max-w-2xl mb-12">{children}</p>
);
const Rule = () => (
  <div className="w-12 h-0.5 mb-8 mt-1" style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)' }} />
);
const SubLabel = ({ children, icon: Icon }: { children: React.ReactNode; icon: React.ElementType }) => (
  <p className="font-poppins font-semibold text-white/60 text-[14px] uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
    <Icon className="w-4 h-4 text-[#00bfa5]" /> {children}
  </p>
);
// El logo de SYL tiene texto blanco, por eso va sobre fondo oscuro
const ClientLogo = ({ className = '' }: { className?: string }) => (
  <div className={`rounded-xl flex items-center justify-center ${className}`}
    style={{ background: 'linear-gradient(135deg,#0a2342,#12356b)', border: `1px solid ${SYL}4d` }}>
    <img src="/Logo roofing.png" alt={META.cliente} className="w-full h-auto object-contain"
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
  </div>
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const SylRoofingProposal = () => {
  const [activeSection, setActiveSection] = useState('servicio');
  const [horasMes, setHorasMes] = useState(MIN_PAQUETE);
  const [calcAbierto, setCalcAbierto] = useState(false);

  // Calculadora: por uso se paga cada hora; el paquete tiene un mínimo de MIN_PAQUETE horas
  const costoUso = horasMes * TARIFA_USO;
  const horasPaquete = Math.max(horasMes, MIN_PAQUETE);
  const costoPaquete = horasPaquete * TARIFA_PAQUETE;
  const sobrantes = horasPaquete - horasMes;
  const ganaPaquete = costoPaquete < costoUso;
  const diferencia = Math.abs(costoUso - costoPaquete);

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

  const s2 = useVisible(); const s3 = useVisible(); const s4 = useVisible();

  const reveal = (v: boolean) => `transition-all duration-700 ${v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;

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
            style={{ background: 'radial-gradient(circle, rgba(247,148,29,.06) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(29,112,162,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        </div>

        <div className="relative z-10 flex items-center justify-between gap-4 px-6 py-6 md:px-12 border-b" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
          <div className="flex items-center gap-6 min-w-0">
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
            <ClientLogo className="hidden sm:flex w-32 px-3 py-2" />
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="font-lato text-[#00bfa5]/80 text-[13px] uppercase tracking-[0.2em] border border-[#00bfa5]/20 rounded-full px-3 py-1.5">Confidencial</span>
          </div>
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
          @media (prefers-reduced-motion: reduce){.cover-ring-1,.cover-ring-2,.cover-glow,.cover-float{animation:none}}
        `}</style>

        <div className="relative z-10 flex-1 flex items-center justify-center py-12 px-5 sm:px-[10%]">
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            <div className="flex flex-col justify-center">
              <TagLabel>Full Stack Development · Soporte por horas</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${SYL}, #1d70a2)` }}>
                  <Building2 className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">Equipo de {META.cliente}</span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-5"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 4.6rem)' }}>
                Propuesta<br />
                <span style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Comercial
                </span>
              </h1>
              <p className="font-lato text-white/55 text-xl leading-relaxed mb-6 max-w-xl">
                Un <Hl color="#fff">equipo full stack</Hl> para sus integraciones, automatizaciones y soporte, <Hl color={SYL}>pagando solo las horas que usa</Hl>.
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
                  { icon: MapPin,   text: META.modalidad },
                  { icon: Clock,    text: `Desde ${usd(TARIFA_PAQUETE)} la hora` },
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                  {['1. El servicio', '2. Inversión', '3. Vigencia y términos'].map((item, i) => (
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
                  style={{ background: 'radial-gradient(circle, rgba(247,148,29,.12) 0%, rgba(29,112,162,.05) 50%, transparent 70%)' }} />
                <div className="cover-ring-1 absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full" style={{ border: '1px solid rgba(247,148,29,.14)' }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(29,112,162,.15)' }} />
                <div className="cover-ring-1 absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: SYL, boxShadow: '0 0 6px rgba(247,148,29,.8)' }} />
                </div>
              </div>
              <div className="cover-float relative z-10 flex flex-col items-center gap-6 w-full px-6">
                <div className="flex flex-col items-center gap-1">
                  <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-20 w-auto object-contain"
                    style={{ filter: 'drop-shadow(0 4px 20px rgba(0,191,165,.45))' }} />
                  <span className="font-poppins font-black text-white/30 text-[11px] uppercase tracking-[0.2em]">Sixteam.pro</span>
                </div>
                <div className="flex items-center gap-3 w-full max-w-xs">
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.08))' }} />
                  <div className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)' }}>
                    <span className="font-poppins font-black text-white/40 text-[20px] leading-none">×</span>
                  </div>
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,.08), transparent)' }} />
                </div>
                <div className="flex flex-col items-center gap-3">
                  <ClientLogo className="w-60 px-6 py-5 shadow-[0_4px_30px_rgba(247,148,29,.22)]" />
                  <div className="flex flex-wrap justify-center gap-1.5 max-w-xs mt-1">
                    {STACK.map(s => (
                      <span key={s.nombre} className="font-lato text-[12px] px-2.5 py-1 rounded-full text-white/60"
                        style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>{s.nombre}</span>
                    ))}
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
      <main className="max-w-4xl mx-auto px-4 sm:px-8 md:px-10 py-24 space-y-32 sm:space-y-40">

        {/* ─ 01 EL SERVICIO ─ */}
        <section id="servicio" ref={s2.ref as React.RefObject<HTMLElement>} className={reveal(s2.v)}>
          <TagLabel>01 — El servicio</TagLabel>
          <SectionTitle>Su equipo full stack,<br /><span style={{ color: SYL }}>por horas</span></SectionTitle>
          <Rule />
          <Lead>
            Un solo equipo para <Hl color="#fff">todo su stack</Hl>: desde una incidencia de cinco minutos hasta un desarrollo nuevo. <Hl>Usted aprueba cada hora</Hl> antes de que la usemos.
          </Lead>

          {/* Áreas */}
          <SubLabel icon={Layers}>Lo que cubre</SubLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
            {AREAS.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={a.nombre} className={`rounded-2xl p-6 ${i === AREAS.length - 1 ? 'sm:col-span-2' : ''}`}
                  style={{ background: `${a.color}0d`, border: `1px solid ${a.color}38` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${a.color}1f` }}>
                    <Icon className="w-5 h-5" style={{ color: a.color }} />
                  </div>
                  <p className="font-poppins font-bold text-white text-[18px] leading-snug mb-3">{a.nombre}</p>
                  <ul className="space-y-2">
                    {a.items.map(it => (
                      <li key={it} className="flex gap-2 font-lato text-white/60 text-[15px] leading-snug">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: a.color }} />
                        <span>{rich(it, 'rgba(255,255,255,.9)')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Cómo funciona */}
          <SubLabel icon={Truck}>Cómo funciona cada solicitud</SubLabel>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-3 items-stretch">
            {COMO_FUNCIONA.map((c, i) => {
              const Icon = c.icon;
              return (
                <React.Fragment key={c.titulo}>
                  <div className="rounded-2xl p-5" style={{ background: `${c.color}0d`, border: `1px solid ${c.color}40` }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center font-poppins font-bold text-[12px]"
                        style={{ background: `${c.color}22`, color: c.color }}>{i + 1}</span>
                      <Icon className="w-4 h-4" style={{ color: c.color }} />
                    </div>
                    <p className="font-poppins font-bold text-white text-[18px] mb-1">{c.titulo}</p>
                    <p className="font-lato text-white/55 text-[15px] leading-snug">{rich(c.desc, 'rgba(255,255,255,.88)')}</p>
                  </div>
                  {i < COMO_FUNCIONA.length - 1 && (
                    <div className="flex items-center justify-center">
                      <ArrowRight className="hidden md:block w-4 h-4 text-white/25" />
                      <ArrowDown className="md:hidden w-4 h-4 text-white/25" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </section>

        {/* ─ 02 INVERSIÓN ─ */}
        <section id="inversion" ref={s3.ref as React.RefObject<HTMLElement>} className={reveal(s3.v)}>
          <TagLabel>02 — Inversión</TagLabel>
          <SectionTitle>Dos formas de pagar,<br /><span style={{ color: '#00bfa5' }}>el mismo equipo</span></SectionTitle>
          <Rule />
          <Lead>
            Pague <Hl color="#fff">cada hora al final del mes</Hl> o compre un <Hl color={SYL}>paquete por adelantado</Hl> y ahorre {AHORRO_PCT} % en cada hora.
          </Lead>

          {/* Modalidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
            {MODALIDADES.map(m => {
              const Icon = m.icon;
              return (
                <div key={m.clave} className="rounded-3xl p-6 sm:p-8 relative flex flex-col"
                  style={m.destacado
                    ? { background: `linear-gradient(150deg, ${m.color}1f 0%, rgba(29,112,162,.08) 55%, rgba(3,13,26,.9) 100%)`, border: `1.5px solid ${m.color}80`, boxShadow: `0 0 40px ${m.color}1f` }
                    : { background: `${m.color}0d`, border: `1px solid ${m.color}40` }}>
                  {m.destacado && (
                    <span className="absolute -top-3 right-6 inline-flex items-center gap-1 font-poppins font-bold text-[12px] uppercase tracking-wider px-3 py-1 rounded-full text-[#030d1a]"
                      style={{ background: m.color }}>
                      <Star className="w-3 h-3" /> Recomendado
                    </span>
                  )}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${m.color}22` }}>
                      <Icon className="w-5 h-5" style={{ color: m.color }} />
                    </div>
                    <div>
                      <p className="font-poppins font-bold text-[12px] uppercase tracking-wider" style={{ color: m.color }}>{m.etiqueta}</p>
                      <p className="font-poppins font-bold text-white text-[19px] leading-tight">{m.nombre}</p>
                    </div>
                  </div>
                  <p className="font-poppins font-black text-white leading-none" style={{ fontSize: 'clamp(2.4rem, 5vw, 3rem)' }}>
                    {usd(m.precio)}
                  </p>
                  <p className="font-lato text-white/45 text-[15px] mt-2 mb-1">{m.unidad}</p>
                  <p className="font-lato text-white/60 text-[15px] leading-snug mb-6">{rich(m.pago, 'rgba(255,255,255,.9)')}</p>
                  <ul className="space-y-2.5 mt-auto">
                    {m.items.map(it => (
                      <li key={it} className="flex gap-2.5 font-lato text-white/65 text-[15px] leading-snug">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: m.color }} />
                        <span>{rich(it, 'rgba(255,255,255,.92)')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Calculadora (desplegable) */}
          <div className="rounded-2xl overflow-hidden mb-14"
            style={{ background: 'rgba(255,255,255,.025)', border: `1px solid ${calcAbierto ? 'rgba(0,191,165,.3)' : 'rgba(255,255,255,.08)'}` }}>
            <button type="button" onClick={() => setCalcAbierto(!calcAbierto)} aria-expanded={calcAbierto}
              className="w-full flex items-center gap-4 p-5 sm:p-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#00bfa5]">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,191,165,.12)' }}>
                <Calculator className="w-5 h-5 text-[#00bfa5]" />
              </div>
              <div className="flex-1">
                <p className="font-poppins font-bold text-white text-[19px]">Calcule su mes</p>
                <p className="font-lato text-white/40 text-[15px]">¿Cuántas horas necesita? Compare por uso y paquete</p>
              </div>
              <ChevronDown className={`w-5 h-5 text-[#00bfa5] transition-transform duration-300 ${calcAbierto ? 'rotate-180' : ''}`} />
            </button>
            {calcAbierto && (
            <div className="px-5 sm:px-6 pb-6">
          <p className="font-lato text-white/55 text-[16px] leading-relaxed max-w-2xl mb-5">
            Mueva la barra y compare. Desde <Hl color="#fff">{horas(PUNTO_EQUILIBRIO)} al mes</Hl>, el paquete de {MIN_PAQUETE} horas ya le sale más barato que pagar por uso.
          </p>
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(0,191,165,.28)' }}>
            <div className="px-5 sm:px-6 py-5" style={{ background: 'rgba(2,8,20,.6)', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <label htmlFor="horas-mes" className="font-lato text-white/60 text-[15px]">Horas en el mes</label>
                <p className="font-poppins font-black text-white text-[28px] leading-none">{horasMes} <span className="font-lato font-normal text-white/40 text-[15px]">h</span></p>
              </div>
              <input id="horas-mes" type="range" min={1} max={60} step={1} value={horasMes}
                onChange={e => setHorasMes(Number(e.target.value))}
                className="w-full cursor-pointer" style={{ accentColor: '#00bfa5' }} />
              <div className="no-print flex flex-wrap gap-2 mt-4">
                {ATAJOS.map(h => (
                  <button key={h} type="button" onClick={() => setHorasMes(h)}
                    className="px-3 py-1.5 rounded-lg font-lato text-[14px] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bfa5]"
                    style={horasMes === h
                      ? { background: 'rgba(0,191,165,.15)', border: '1px solid rgba(0,191,165,.5)', color: '#fff' }
                      : { background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.65)' }}>
                    {h} h
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2">
              {[
                { t: 'Por uso', sub: `${horas(horasMes)} × ${usd(TARIFA_USO)}`, v: costoUso, nota: 'al final del mes', color: '#60a5fa', gana: !ganaPaquete && costoUso !== costoPaquete },
                { t: 'Paquete de horas', sub: `${horas(horasPaquete)} × ${usd(TARIFA_PAQUETE)}`, v: costoPaquete, nota: 'por adelantado', color: SYL, gana: ganaPaquete },
              ].map((c, i) => (
                <div key={c.t} className="px-5 sm:px-6 py-6"
                  style={{ borderLeft: i ? '1px solid rgba(255,255,255,.07)' : undefined, borderTop: '1px solid rgba(255,255,255,.04)', background: c.gana ? `${c.color}12` : undefined }}>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="font-poppins font-bold text-[13px] uppercase tracking-wider" style={{ color: c.color }}>{c.t}</p>
                    {c.gana && (
                      <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold"
                        style={{ background: `${c.color}22`, border: `1px solid ${c.color}66`, color: c.color }}>Más conveniente</span>
                    )}
                  </div>
                  <p className="font-poppins font-black text-white leading-none" style={{ fontSize: 'clamp(2rem, 5vw, 2.6rem)' }}>{usd(c.v)}</p>
                  <p className="font-lato text-white/45 text-[14px] mt-2">{c.sub} · {c.nota}</p>
                </div>
              ))}
            </div>

            <div className="px-5 sm:px-6 py-4 flex items-start gap-2"
              style={{ background: 'rgba(0,191,165,.08)', borderTop: '1px solid rgba(0,191,165,.3)' }}>
              <Info className="w-4 h-4 flex-shrink-0 mt-1 text-[#00bfa5]" />
              <p className="font-lato text-white/70 text-[15px] leading-relaxed" role="status" aria-live="polite">
                {ganaPaquete && sobrantes === 0 && <>Con el paquete <Hl color="#fff">ahorra {usd(diferencia)}</Hl> este mes.</>}
                {ganaPaquete && sobrantes > 0 && <>Con el paquete de {MIN_PAQUETE} horas <Hl color="#fff">ahorra {usd(diferencia)}</Hl> y le {sobrantes === 1 ? 'queda' : 'quedan'} <Hl color="#fff">{horas(sobrantes)}</Hl> para usar en los próximos {VIGENCIA_HORAS} meses.</>}
                {!ganaPaquete && <>Para {horas(horasMes)}, <Hl color="#fff">pagar por uso</Hl> le sale mejor. El paquete mínimo es de {MIN_PAQUETE} horas, y las {horas(sobrantes)} que sobran se pueden usar durante {VIGENCIA_HORAS} meses.</>}
              </p>
            </div>
          </div>
            </div>
            )}
          </div>

          {/* Ejemplo de un mes */}
          <SubLabel icon={FileText}>Ejemplo de un mes con el paquete de {MIN_PAQUETE} horas</SubLabel>
          <div className="rounded-2xl overflow-hidden mb-4" style={{ border: '1px solid rgba(255,255,255,.07)', background: 'rgba(255,255,255,.02)' }}>
            <div className="divide-y divide-white/5">
              {EJEMPLO_MES.map((r, i) => {
                const c = AREA_COLOR[r.area];
                return (
                  <div key={i} className="px-4 sm:px-5 py-3 flex items-center gap-3">
                    <span className="font-lato text-white/65 text-[15px] leading-snug flex-1">
                      {r.tarea}
                      <span className="ml-2 font-lato text-[11px] px-1.5 py-0.5 rounded whitespace-nowrap align-middle" style={{ background: `${c}1f`, color: c }}>{r.area}</span>
                    </span>
                    <span className="font-poppins font-bold text-[15px] whitespace-nowrap" style={{ color: c }}>{r.horas.toLocaleString('es-CO')} h</span>
                  </div>
                );
              })}
            </div>
            <div className="px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-2" style={{ background: 'rgba(0,191,165,.07)', borderTop: '1px solid rgba(0,191,165,.2)' }}>
              <span className="font-poppins font-bold text-white text-[15px]">Total del mes · {EJEMPLO_MES.length} solicitudes</span>
              <span className="font-poppins font-black text-[15px] text-[#00bfa5]">
                {TOTAL_EJEMPLO.toLocaleString('es-CO')} h · {usd(TOTAL_EJEMPLO * TARIFA_PAQUETE)}
                <span className="font-lato font-normal text-white/40 ml-2 line-through">{usd(TOTAL_EJEMPLO * TARIFA_USO)}</span>
              </span>
            </div>
          </div>
          <p className="font-lato text-white/35 text-[13px] leading-relaxed">
            Es un ejemplo de referencia. Cada solicitud se estima en horas y usted la aprueba antes de que la hagamos.
          </p>

        </section>

        {/* ── LOGOS DE CLIENTES ── */}
        <div>
          <LogoCarousel logos={LOGOS_CARRUSEL} />
        </div>

        {/* ─ 03 VIGENCIA ─ */}
        <section id="vigencia" ref={s4.ref as React.RefObject<HTMLElement>} className={reveal(s4.v)}>
          <TagLabel>03 — Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y términos</SectionTitle>
          <Rule />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { titulo: 'Aprobación', desc: 'Basta su confirmación por **WhatsApp o correo** para arrancar.', icon: CheckCircle },
              { titulo: 'Por uso', desc: `**${usd(TARIFA_USO)} por hora**. Se factura **al cierre de cada mes** con el reporte mensual y se paga por transferencia.`, icon: Wallet },
              { titulo: 'Paquete de horas', desc: `Desde **${MIN_PAQUETE} horas a ${usd(TARIFA_PAQUETE)} la hora**, con **pago anticipado**. Las horas no usadas **se acumulan** de un mes a otro y **vencen a los ${VIGENCIA_HORAS} meses** de la compra.`, icon: Package },
              { titulo: 'Cómo medimos las horas', desc: 'Solo **trabajo efectivo**, en fracciones de **30 minutos**. Cada tarea queda en el **reporte mensual** con sus entregables y el tiempo usado.', icon: Timer },
              { titulo: 'Estimación previa', desc: 'Toda solicitud se **estima antes** y **usted la aprueba**. Si algo va a pasar del estimado, le avisamos antes de seguir.', icon: Receipt },
              { titulo: 'Tiempos de respuesta', desc: 'Lo que **detiene la operación** se atiende el **mismo día hábil**. Lo demás se agenda según la prioridad que usted defina.', icon: Zap },
              { titulo: 'Accesos', desc: 'Usuarios para **NetSuite, HubSpot, Make, n8n, GitHub** y el backend de WhatsApp, con los permisos justos para cada tarea.', icon: KeyRound },
              { titulo: 'No incluye', desc: 'Licencias de **NetSuite, HubSpot, Make y n8n**, servidores y el costo de los **mensajes de WhatsApp** que cobra Meta.', icon: AlertCircle },
              { titulo: 'Su información', desc: 'Los datos y el código **son de SYL Roofing** y se manejan de forma **confidencial**.', icon: ShieldCheck },
              { titulo: 'Vigencia', desc: '**30 días calendario** desde la fecha de esta propuesta. Valores en **dólares (USD)**.', icon: Clock },
            ].map((item, i, arr) => {
              const Icon = item.icon;
              return (
                <div key={i} className={`rounded-xl p-5 flex gap-3 ${i === arr.length - 1 && arr.length % 2 === 1 ? 'sm:col-span-2' : ''}`}
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <Icon className="w-4 h-4 text-[#00bfa5] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-poppins font-semibold text-white/85 text-[17px] mb-1">{item.titulo}</p>
                    <p className="font-lato text-white/50 text-[16px] leading-relaxed">{rich(item.desc, 'rgba(255,255,255,.85)')}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-16 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 100%, rgba(0,191,165,.05), transparent 70%)' }} />
            <div className="relative z-10">
              <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-10 w-auto object-contain mx-auto mb-3"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <p className="font-poppins font-black text-white text-[20px] tracking-tight mb-1">Sixteam<span className="text-[#00bfa5]">.</span>pro</p>
              <p className="font-lato text-white/35 text-[14px] mb-4">Innovación y Estrategia Digital S.A.S.</p>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[14px] text-white/35 font-lato">
                <span>NIT {META.nit}</span>
                <span>·</span>
                <span>{META.correo}</span>
                <span>·</span>
                <span>RL: {META.rl}</span>
              </div>
              <p className="font-lato text-white/50 text-[14px] mt-3">
                Propuesta elaborada por: <strong className="text-white/80 font-semibold">{META.elaboradaPor}</strong> · {META.cargo}
              </p>
              <p className="font-lato text-white/20 text-[13px] mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                Process + Technology + People = Growth · {META.fecha} · Uso confidencial
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default SylRoofingProposal;
