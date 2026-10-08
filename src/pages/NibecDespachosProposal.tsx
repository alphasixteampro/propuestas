import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LogoCarousel, { defaultLogos } from '../components/LogoCarousel';
import PDFButton from '../components/PDFButton';
import {
  CheckCircle, ChevronRight, ChevronDown, Clock, FileText, Target, Zap,
  AlertCircle, Calendar, MapPin, Users, Rocket, Shield, Coins, Database,
  Receipt, LayoutDashboard, Truck, Search, Smartphone, XCircle, KeyRound,
  Github, Server, PlayCircle, TrendingDown, HelpCircle, Wrench, ArrowRight,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente:        'Nibec',
  producto:       'Tablero de Despachos Nibec',
  tagline:        'Un puente simple entre Bsale y Beetrack, pagado una sola vez',
  sector:         'Equipamiento y mobiliario industrial · Chile',
  sede:           'Chile',
  fecha:          'Octubre 2026',
  contacto:       'Benjamín Canales',
  proponente:     'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit:            '901.967.849-4',
  correo:         'alpha@sixteam.pro',
  rl:             'Samuel Armando Burgos Ferrer',
  autor:          'Ernesto Hernández',
  autorCargo:     'Gerente Comercial',
};

const NIBEC_COLOR = '#f5a02a';
const TEAL = '#00bfa5';
const BLUE = '#1d70a2';
const DEMO_URL = '/nibec-despachos/demo';

// En esta propuesta, Nibec es el destinatario, así que su logo sale del carrusel de marcas
const LOGOS_SIN_CLIENTE = (() => {
  const filtrados = defaultLogos.filter(l => !/nibec/i.test(l.src));
  return [...filtrados, ...filtrados];
})();

const PRECIO_USD = 1200;
const SERVIDOR_MES_USD = 10;
const SERVIDOR_ANIO_USD = 120;
const WMS_ANIO_USD = 13800;

// ─── LO QUE NOS PIDIERON ─────────────────────────────────────────────────────

const PEDIDOS = [
  {
    titulo: 'Bajar los costos al máximo',
    desc: 'Hoy Nibec paga un sistema de bodega (WMS) de $1,1 millones CLP al mes y quiere dejarlo.',
    cita: '“Necesito bajar mis costos al máximo”',
    icon: TrendingDown, color: NIBEC_COLOR,
  },
  {
    titulo: 'Pagar una sola vez y que quede para Nibec',
    desc: 'Sin mensualidades de licencia. Lo que se construye pasa a ser propiedad de Nibec.',
    cita: '“Algo que pague una sola vez y quede para mí”',
    icon: Coins, color: TEAL,
  },
  {
    titulo: 'Que sea básico',
    desc: 'Solo lo necesario para mover los pedidos. Nada de funciones que no se van a usar.',
    cita: '“Básico, insisto”',
    icon: LayoutDashboard, color: '#60a5fa',
  },
  {
    titulo: 'Que lo que pase a Despacho caiga en Beetrack',
    desc: 'Cuando un pedido llega a la etapa de despacho, debe crearse solo en Beetrack, sin volver a escribir nada.',
    cita: '“Todos los que pasen a la casilla despacho, que caigan en Beetrack”',
    icon: Truck, color: '#a855f7',
  },
];

// ─── CÓMO FUNCIONA ───────────────────────────────────────────────────────────

const COLUMNAS_TABLERO = ['Nuevos', 'En preparación', 'Despacho'];

// ─── QUÉ INCLUYE / QUÉ NO HACE ───────────────────────────────────────────────

const INCLUYE = [
  { titulo: 'Pedidos desde Bsale', desc: 'Trae solo los pedidos nuevos (boletas y facturas) apenas se emiten.', icon: Receipt },
  { titulo: 'Tablero por columnas', desc: 'Se arrastra la tarjeta de una columna a otra. Cada tarjeta muestra N° de documento, cliente, comuna, productos y cantidades, monto y si es despacho o retiro.', icon: LayoutDashboard },
  { titulo: 'Despacho automático en Beetrack', desc: 'Al llegar a “Despacho” se crea en Beetrack con los datos de Bsale (dirección, contacto, productos). El N° de guía de Beetrack queda visible en la tarjeta.', icon: Truck },
  { titulo: 'Estados que se actualizan solos', desc: 'Beetrack avisa cuando el pedido sale a ruta y cuando se entrega; la tarjeta se mueve sola.', icon: Zap },
  { titulo: 'Buscador e historial', desc: 'Búsqueda por N° de documento o cliente, e historial de cada pedido: quién lo movió y cuándo.', icon: Search },
  { titulo: 'Acceso para el equipo', desc: 'Usuario y clave para hasta 5 personas. Se ve en computador y en celular.', icon: Smartphone },
];

const NO_HACE = [
  'No maneja stock ni ubicaciones de bodega: el stock sigue en Bsale.',
  'No emite boletas, facturas ni guías tributarias.',
  'No planifica rutas: eso lo sigue haciendo Beetrack.',
  'No hace informes avanzados.',
];

// ─── PLAN DE 4 SEMANAS ───────────────────────────────────────────────────────

const SEMANAS = [
  { num: '1', titulo: 'Accesos y conexión con Bsale', desc: 'Recibimos los accesos a Bsale y Beetrack, conectamos con Bsale y ya se ven pedidos reales en el tablero.', icon: Database, color: '#60a5fa' },
  { num: '2', titulo: 'El tablero', desc: 'Columnas, tarjetas, buscador y usuarios del equipo.', icon: LayoutDashboard, color: NIBEC_COLOR },
  { num: '3', titulo: 'Conexión con Beetrack', desc: 'Crear el despacho al llegar a “Despacho” y recibir los estados de vuelta.', icon: Truck, color: '#a855f7' },
  { num: '4', titulo: 'Pruebas, capacitación y entrega', desc: 'Pruebas con pedidos reales en paralelo al WMS, capacitación al equipo y entrega funcionando.', icon: Rocket, color: TEAL },
];

// ─── QUÉ NECESITAMOS / PUNTOS A VALIDAR ──────────────────────────────────────

const NECESITAMOS = [
  { titulo: 'Llave de acceso a Bsale', desc: 'La llave de la conexión automática (API) de Bsale.', icon: KeyRound },
  { titulo: 'Llave de acceso a Beetrack', desc: 'La llave de la conexión automática de Beetrack.', icon: KeyRound },
  { titulo: 'Confirmar las columnas', desc: 'Que las columnas propuestas sirven, y quién mueve cada tarjeta.', icon: Users },
  { titulo: 'Apagar el envío automático actual', desc: 'El que hoy va de Bsale a Beetrack, cuando el tablero entre en uso. Si no se apaga, cada pedido quedaría duplicado en Beetrack.', icon: AlertCircle },
];

const VALIDAR = [
  { titulo: 'Cómo viaja hoy la información de Bsale a Beetrack', desc: 'Si es una integración propia de Bsale o de un tercero, para apagarla en el momento correcto.' },
  { titulo: '¿Los pedidos de Shopify también pasan por Bsale?', desc: 'Asumimos que sí, porque toda boleta sale de Bsale.' },
  { titulo: '¿Algún pedido necesita volver atrás?', desc: 'Por ejemplo, un despacho fallido que vuelva a “En preparación”.' },
];

const SECCIONES = [
  { id: 'pedido',     label: 'Lo que pidieron' },
  { id: 'funciona',   label: 'Cómo funciona' },
  { id: 'alcance',    label: 'Qué incluye' },
  { id: 'tuyo',       label: 'Es tuyo' },
  { id: 'ahorro',     label: 'Ahorro' },
  { id: 'plan',       label: 'Plan de 4 semanas' },
  { id: 'necesitamos', label: 'Qué necesitamos' },
  { id: 'inversion',  label: 'Inversión' },
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

const NibecDespachosProposal = () => {
  const [activeSection, setActiveSection] = useState('pedido');

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
  const s7 = useVisible(); const s8 = useVisible(); const s9 = useVisible();

  const reveal = (v: boolean) => `transition-all duration-700 ${v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;

  // Barras de ahorro: proporcional al costo del primer año
  const barTablero = Math.max(((PRECIO_USD + SERVIDOR_ANIO_USD) / WMS_ANIO_USD) * 100, 8);

  return (
    <div id="proposal-root" className="min-h-screen overflow-x-hidden" style={{ background: '#030d1a', fontFamily: 'Lato, sans-serif' }}>

      {/* ── NAV LATERAL ── */}
      <nav className="hidden xl:flex fixed right-5 top-1/2 -translate-y-1/2 z-50 flex-col gap-3 no-print">
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
            style={{ background: 'radial-gradient(circle, rgba(245,160,42,.06) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(29,112,162,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        </div>

        {/* Topbar */}
        <div className="relative z-10 flex items-center justify-between gap-3 px-6 py-6 md:px-12 border-b" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
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
            <div className="h-11 w-24 flex items-center justify-center rounded-lg px-2" style={{ background: 'rgba(255,255,255,.95)' }}>
              <img src="/Logo nibec.png" alt="Nibec" className="max-h-full w-auto object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PDFButton elementId="proposal-root" filename="propuesta-nibec-tablero-despachos.pdf" className="hidden sm:inline-flex" />
            <span className="font-lato text-[#00bfa5]/80 text-[13px] uppercase tracking-[0.2em] border border-[#00bfa5]/20 rounded-full px-3 py-1.5">Confidencial</span>
          </div>
        </div>

        <style>{`
          @keyframes dsp-spin-slow { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
          @keyframes dsp-spin-rev  { from{transform:rotate(0deg)}to{transform:rotate(-360deg)} }
          @keyframes dsp-pulse-glow { 0%,100%{opacity:.07;transform:scale(1)} 50%{opacity:.15;transform:scale(1.12)} }
          @keyframes dsp-float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
          .dsp-ring-1{animation:dsp-spin-slow 22s linear infinite}
          .dsp-ring-2{animation:dsp-spin-rev 16s linear infinite}
          .dsp-glow{animation:dsp-pulse-glow 4s ease-in-out infinite}
          .dsp-float{animation:dsp-float 5s ease-in-out infinite}
        `}</style>

        {/* Hero */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta de trabajo y cotización · {META.fecha}</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${NIBEC_COLOR}, ${TEAL})` }}>
                  <Shield className="w-3 h-3 text-white" />
                </div>
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.contacto} · Nibec</span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.6rem, 4.8vw, 4.6rem)' }}>
                Tablero de<br />
                <span style={{ background: `linear-gradient(90deg,${NIBEC_COLOR},${TEAL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Despachos Nibec
                </span>
              </h1>
              <p className="font-lato text-white/55 text-xl leading-relaxed mb-6">
                {META.tagline}.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { icon: Calendar, text: META.fecha },
                  { icon: MapPin,   text: META.sede },
                  { icon: Coins,    text: `USD ${PRECIO_USD.toLocaleString('es-CL')} pago único` },
                  { icon: Clock,    text: '4 semanas' },
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
              <div className="mb-8 no-print">
                <Link to={DEMO_URL}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-poppins font-semibold text-[15px] text-white transition-all hover:brightness-110"
                  style={{ background: `linear-gradient(90deg, ${BLUE}, ${TEAL})`, boxShadow: '0 4px 20px rgba(0,191,165,.25)' }}>
                  <PlayCircle className="w-4 h-4" /> Ver la demo interactiva
                </Link>
              </div>
              <div className="border-t pt-5" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                <p className="font-lato text-white/25 text-[13px] uppercase tracking-widest mb-3">Contenido</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                  {SECCIONES.map((s, i) => (
                    <button key={s.id} onClick={() => scrollTo(s.id)}
                      className="font-lato text-white/45 text-[15px] hover:text-[#00bfa5] transition-colors duration-200 text-left flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-[#00bfa5]/40 flex-shrink-0" />
                      {i + 1}. {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Derecha animada */}
            <div className="flex items-center justify-center relative min-h-[380px]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="dsp-glow absolute w-80 h-80 rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(245,160,42,.10) 0%, rgba(0,191,165,.05) 50%, transparent 70%)' }} />
                <div className="dsp-ring-1 absolute w-96 h-96 rounded-full" style={{ border: '1px solid rgba(245,160,42,.14)' }} />
                <div className="dsp-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(0,191,165,.18)' }} />
              </div>
              <div className="dsp-float relative z-10 flex flex-col items-center gap-4 w-full px-6">
                <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-12 w-auto object-contain"
                  style={{ filter: 'drop-shadow(0 4px 20px rgba(0,191,165,.45))' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <div className="w-full max-w-[260px] space-y-2">
                  {[
                    { n: 'Bsale', d: 'emite la boleta', c: BLUE },
                    { n: 'Tablero', d: 'ordena el pedido', c: NIBEC_COLOR },
                    { n: 'Beetrack', d: 'despacha y avisa', c: TEAL },
                  ].map((b, i) => (
                    <React.Fragment key={b.n}>
                      <div className="rounded-xl px-4 py-3 flex items-center justify-between"
                        style={{ background: 'rgba(255,255,255,.04)', border: `1px solid ${b.c}55` }}>
                        <span className="font-poppins font-bold text-white text-[16px]">{b.n}</span>
                        <span className="font-lato text-white/45 text-[13px]">{b.d}</span>
                      </div>
                      {i < 2 && <div className="flex justify-center"><ChevronDown className="w-4 h-4 text-white/30" /></div>}
                    </React.Fragment>
                  ))}
                </div>
                <div className="text-center">
                  <p className="font-poppins font-black text-white text-[20px] tracking-tight">Nibec</p>
                  <p className="font-lato text-[13px] uppercase tracking-[0.18em] mt-1" style={{ color: NIBEC_COLOR }}>Equipamiento industrial</p>
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

        {/* ─ 01 LO QUE NOS PIDIERON ─ */}
        <section id="pedido" ref={s1.ref as React.RefObject<HTMLElement>} className={reveal(s1.v)}>
          <TagLabel>01 — Lo que nos pidieron</TagLabel>
          <SectionTitle>Simple, barato y de Nibec</SectionTitle>
          <Rule />
          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Nibec vende por su tienda online y por atención directa, con cerca de 400 ventas cerradas al mes. Hoy paga un sistema de bodega de <strong className="text-white/75">$1,1 millones CLP al mes</strong> y quiere dejarlo. Esto es lo que pidió {META.contacto}:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PEDIDOS.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="rounded-2xl p-5"
                  style={{ background: 'rgba(255,255,255,.03)', border: `1px solid ${p.color}33` }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: `${p.color}1f`, border: `1px solid ${p.color}44` }}>
                    <Icon className="w-4 h-4" style={{ color: p.color }} />
                  </div>
                  <p className="font-poppins font-semibold text-white/90 text-[17px] mb-1.5">{p.titulo}</p>
                  <p className="font-lato text-white/50 text-[15px] leading-relaxed mb-3">{p.desc}</p>
                  <p className="font-lato text-[14px] italic" style={{ color: p.color }}>{p.cita}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─ 02 CÓMO FUNCIONA ─ */}
        <section id="funciona" ref={s2.ref as React.RefObject<HTMLElement>} className={reveal(s2.v)}>
          <TagLabel>02 — Cómo funciona</TagLabel>
          <SectionTitle>Un puente, no otro sistema grande</SectionTitle>
          <Rule />
          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Todo el pedido nace en Bsale, así que nada se escribe a mano. El tablero solo recibe lo que Bsale emite, lo ordena por etapas y, al final, le pasa el pedido a Beetrack.
          </p>

          {/* Flujo */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1.6fr_auto_1fr] gap-3 items-stretch">
            {/* Bsale */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(29,112,162,.08)', border: '1px solid rgba(29,112,162,.3)' }}>
              <Receipt className="w-5 h-5 mb-3" style={{ color: '#60a5fa' }} />
              <p className="font-poppins font-bold text-white text-[18px] mb-1">Bsale</p>
              <p className="font-lato text-white/55 text-[15px] leading-relaxed">Emite la boleta o factura. De ahí sale toda la información del pedido.</p>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-white/30 rotate-90 lg:rotate-0" />
            </div>
            {/* Tablero */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(245,160,42,.07)', border: '1px solid rgba(245,160,42,.3)' }}>
              <LayoutDashboard className="w-5 h-5 mb-3" style={{ color: NIBEC_COLOR }} />
              <p className="font-poppins font-bold text-white text-[18px] mb-3">Tablero de Despachos</p>
              <div className="flex flex-wrap items-center gap-1.5">
                {COLUMNAS_TABLERO.map((c, i) => (
                  <React.Fragment key={c}>
                    <span className="font-poppins font-semibold text-[13px] px-2.5 py-1.5 rounded-lg"
                      style={c === 'Despacho'
                        ? { background: 'rgba(0,191,165,.18)', border: '1px solid rgba(0,191,165,.5)', color: TEAL }
                        : { background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.8)' }}>
                      {c}
                    </span>
                    {i < COLUMNAS_TABLERO.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-white/30" />}
                  </React.Fragment>
                ))}
              </div>
              <p className="font-lato text-white/50 text-[14px] leading-relaxed mt-3">Arrastras la tarjeta de una columna a la siguiente.</p>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-white/30 rotate-90 lg:rotate-0" />
            </div>
            {/* Beetrack */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(0,191,165,.07)', border: '1px solid rgba(0,191,165,.3)' }}>
              <Truck className="w-5 h-5 mb-3" style={{ color: TEAL }} />
              <p className="font-poppins font-bold text-white text-[18px] mb-1">Beetrack</p>
              <p className="font-lato text-white/55 text-[15px] leading-relaxed">Crea el despacho y la guía. Devuelve <strong className="text-white/75">En ruta</strong> y <strong className="text-white/75">Entregado</strong>.</p>
            </div>
          </div>

          {/* Punto clave */}
          <div className="rounded-xl p-4 sm:p-5 mt-5 flex gap-3"
            style={{ background: 'rgba(0,191,165,.07)', border: '1px solid rgba(0,191,165,.28)' }}>
            <Zap className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00bfa5]" />
            <div>
              <p className="font-poppins font-semibold text-white/85 text-[17px] mb-1">El punto clave</p>
              <p className="font-lato text-white/60 text-[16px] leading-relaxed">
                Hoy la guía de Beetrack se genera sola desde Bsale. Con el tablero, <strong className="text-white/85">la guía se crea solo cuando la tarjeta llega a “Despacho”</strong>. Así Nibec decide cuándo sale cada pedido, y Beetrack lo recibe sin que nadie lo vuelva a escribir. La conexión entre los sistemas es automática (por la API de cada uno).
              </p>
            </div>
          </div>

          <div className="rounded-xl p-4 mt-3 flex gap-3"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <Users className="w-4 h-4 flex-shrink-0 mt-0.5 text-white/40" />
            <p className="font-lato text-white/50 text-[15px] leading-relaxed">
              Los pedidos marcados <strong className="text-white/75">“Retiro en bodega”</strong> no van a Beetrack: pasan de “En preparación” a “Entregado” a mano. Después de “Despacho”, las columnas <strong className="text-white/75">En ruta</strong> y <strong className="text-white/75">Entregado</strong> las mueve Beetrack solo.
            </p>
          </div>

          {/* Demo */}
          <div className="mt-6 rounded-2xl p-6 sm:p-7 text-center no-print relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(29,112,162,.12), rgba(0,191,165,.10))', border: '1px solid rgba(0,191,165,.3)' }}>
            <PlayCircle className="w-8 h-8 mx-auto mb-3 text-[#00bfa5]" />
            <p className="font-poppins font-bold text-white text-[20px] mb-1">Pruébalo con pedidos de ejemplo</p>
            <p className="font-lato text-white/55 text-[16px] mb-5">Arrastra las tarjetas y mira qué pasa al llegar a “Despacho”. Los datos son ficticios.</p>
            <Link to={DEMO_URL}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-poppins font-semibold text-[16px] text-white transition-all hover:brightness-110"
              style={{ background: `linear-gradient(90deg, ${BLUE}, ${TEAL})`, boxShadow: '0 4px 24px rgba(0,191,165,.3)' }}>
              <PlayCircle className="w-5 h-5" /> Ver la demo interactiva
            </Link>
          </div>
        </section>

        {/* ─ 03 QUÉ INCLUYE / QUÉ NO HACE ─ */}
        <section id="alcance" ref={s3.ref as React.RefObject<HTMLElement>} className={reveal(s3.v)}>
          <TagLabel>03 — Alcance</TagLabel>
          <SectionTitle>Qué incluye y qué no hace</SectionTitle>
          <Rule />
          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Es básico a propósito. Hace pocas cosas y las hace bien; lo demás sigue donde está hoy.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 items-start">
            {/* Incluye */}
            <div className="rounded-2xl p-5 sm:p-6"
              style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.22)' }}>
              <p className="font-poppins font-semibold text-[#00bfa5] text-[15px] uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Qué incluye
              </p>
              <ul className="space-y-4">
                {INCLUYE.map((it, i) => {
                  const Icon = it.icon;
                  return (
                    <li key={i} className="flex gap-3">
                      <Icon className="w-4 h-4 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-poppins font-semibold text-white/85 text-[16px] mb-0.5">{it.titulo}</p>
                        <p className="font-lato text-white/50 text-[14px] leading-relaxed">{it.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* No hace */}
            <div className="rounded-2xl p-5 sm:p-6"
              style={{ background: 'rgba(248,113,113,.04)', border: '1px solid rgba(248,113,113,.2)' }}>
              <p className="font-poppins font-semibold text-[#f87171] text-[15px] uppercase tracking-wider mb-4 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Qué no hace
              </p>
              <ul className="space-y-3">
                {NO_HACE.map((t, i) => (
                  <li key={i} className="flex gap-2.5">
                    <XCircle className="w-4 h-4 text-[#f87171]/70 flex-shrink-0 mt-0.5" />
                    <span className="font-lato text-white/55 text-[15px] leading-snug">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ─ 04 ES TUYO ─ */}
        <section id="tuyo" ref={s4.ref as React.RefObject<HTMLElement>} className={reveal(s4.v)}>
          <TagLabel>04 — Propiedad</TagLabel>
          <SectionTitle>Es tuyo</SectionTitle>
          <Rule />
          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden mb-4"
            style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(245,160,42,.07), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 text-[#00bfa5] mb-4" />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[22px] leading-relaxed">
              Pagas una vez y <em className="not-italic" style={{ color: NIBEC_COLOR }}>todo queda a nombre de Nibec</em>. Sin licencias y sin mensualidad de Sixteam.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {[
              { icon: Github, titulo: 'El código', desc: 'Queda en la cuenta de GitHub de Nibec.', color: '#60a5fa' },
              { icon: Server, titulo: 'El servidor', desc: 'Corre en un servidor a nombre de Nibec.', color: NIBEC_COLOR },
              { icon: Database, titulo: 'La base de datos', desc: 'Es de Nibec, con sus pedidos e historial.', color: TEAL },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="rounded-xl p-4"
                  style={{ background: `${c.color}0f`, border: `1px solid ${c.color}33` }}>
                  <Icon className="w-5 h-5 mb-2" style={{ color: c.color }} />
                  <p className="font-poppins font-semibold text-white/90 text-[16px] mb-1">{c.titulo}</p>
                  <p className="font-lato text-white/50 text-[14px] leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="rounded-xl p-4 sm:p-5 flex gap-3"
            style={{ background: 'rgba(245,160,42,.05)', border: '1px solid rgba(245,160,42,.2)' }}>
            <Coins className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: NIBEC_COLOR }} />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              El <strong className="text-white/80">único costo que sigue</strong> es el servidor: <strong className="text-white/80">≈ USD {SERVIDOR_MES_USD} al mes</strong>, que Nibec paga directo al proveedor. Cualquier desarrollador puede modificar el sistema después, no hace falta depender de Sixteam.
            </p>
          </div>
        </section>

        {/* ─ 05 AHORRO ─ */}
        <section id="ahorro" ref={s5.ref as React.RefObject<HTMLElement>} className={reveal(s5.v)}>
          <TagLabel>05 — Ahorro</TagLabel>
          <SectionTitle>Se paga con un mes de WMS</SectionTitle>
          <Rule />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="rounded-2xl p-6"
              style={{ background: 'rgba(248,113,113,.05)', border: '1px solid rgba(248,113,113,.22)' }}>
              <p className="font-lato text-white/40 text-[13px] uppercase tracking-widest mb-2">Hoy · WMS</p>
              <p className="font-poppins font-black text-white leading-none mb-1" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)' }}>$1,1 millones</p>
              <p className="font-lato text-white/50 text-[15px] mb-3">CLP al mes</p>
              <p className="font-poppins font-bold text-[#f87171] text-[18px]">$13,2 millones al año</p>
              <p className="font-lato text-white/40 text-[14px]">≈ USD 13.800 al año</p>
            </div>
            <div className="rounded-2xl p-6"
              style={{ background: 'rgba(0,191,165,.07)', border: '1px solid rgba(0,191,165,.3)' }}>
              <p className="font-lato text-white/40 text-[13px] uppercase tracking-widest mb-2">Con el Tablero</p>
              <p className="font-poppins font-black text-white leading-none mb-1" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)' }}>USD 1.200</p>
              <p className="font-lato text-white/50 text-[15px] mb-3">pago único</p>
              <p className="font-poppins font-bold text-[#00bfa5] text-[18px]">+ ≈ USD {SERVIDOR_ANIO_USD} al año</p>
              <p className="font-lato text-white/40 text-[14px]">de servidor, pagado directo por Nibec</p>
            </div>
          </div>

          {/* Barras */}
          <div className="rounded-2xl p-5 sm:p-6 mb-5"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[14px] uppercase tracking-wider mb-4">Costo del primer año (USD)</p>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between font-lato text-[14px] mb-1.5">
                  <span className="text-white/60">WMS actual</span>
                  <span className="text-white/80 font-semibold">13.800</span>
                </div>
                <div className="h-4 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.06)' }}>
                  <div className="h-full rounded-full" style={{ width: '100%', background: 'linear-gradient(90deg, #f87171, #ef4444)' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-lato text-[14px] mb-1.5">
                  <span className="text-white/60">Tablero de Despachos (1.200 + 120 de servidor)</span>
                  <span className="text-white/80 font-semibold">≈ 1.320</span>
                </div>
                <div className="h-4 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${barTablero}%`, background: `linear-gradient(90deg, ${BLUE}, ${TEAL})` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl p-5 text-center"
              style={{ background: 'rgba(29,112,162,.08)', border: '1px solid rgba(29,112,162,.25)' }}>
              <p className="font-poppins font-black text-white text-[34px] leading-none mb-1">≈ 1 mes</p>
              <p className="font-lato text-white/55 text-[15px]">de WMS basta para pagar el Tablero</p>
            </div>
            <div className="rounded-xl p-5 text-center"
              style={{ background: 'rgba(0,191,165,.08)', border: '1px solid rgba(0,191,165,.28)' }}>
              <p className="font-poppins font-black text-[#00bfa5] text-[34px] leading-none mb-1">≈ USD 12.500</p>
              <p className="font-lato text-white/55 text-[15px]">de ahorro el primer año</p>
              <p className="font-lato text-white/30 text-[12px] mt-1">13.800 − 1.200 − 120 de servidor</p>
            </div>
          </div>
        </section>

        {/* ─ 06 PLAN DE 4 SEMANAS ─ */}
        <section id="plan" ref={s6.ref as React.RefObject<HTMLElement>} className={reveal(s6.v)}>
          <TagLabel>06 — Plan de trabajo</TagLabel>
          <SectionTitle>Funcionando en 4 semanas</SectionTitle>
          <Rule />
          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            El plazo corre desde el primer pago y la entrega de los accesos.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {SEMANAS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="rounded-2xl p-5 relative overflow-hidden"
                  style={{ background: `${s.color}0d`, border: `1px solid ${s.color}33` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: `${s.color}22`, border: `1px solid ${s.color}55` }}>
                      <Icon className="w-4 h-4" style={{ color: s.color }} />
                    </div>
                    <span className="font-lato text-[12px] uppercase tracking-widest" style={{ color: s.color }}>Semana {s.num}</span>
                  </div>
                  <p className="font-poppins font-semibold text-white/90 text-[17px] mb-1.5">{s.titulo}</p>
                  <p className="font-lato text-white/50 text-[15px] leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="rounded-xl p-4 sm:p-5 flex gap-3"
            style={{ background: 'rgba(245,160,42,.06)', border: '1px solid rgba(245,160,42,.25)' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: NIBEC_COLOR }} />
            <div>
              <p className="font-poppins font-semibold text-white/85 text-[16px] mb-1">Recomendación</p>
              <p className="font-lato text-white/55 text-[15px] leading-relaxed">
                Usar el Tablero en paralelo al WMS y <strong className="text-white/80">no cortar el WMS hasta tener 2 semanas funcionando sin problemas</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* ─ 07 QUÉ NECESITAMOS / PUNTOS A VALIDAR ─ */}
        <section id="necesitamos" ref={s7.ref as React.RefObject<HTMLElement>} className={reveal(s7.v)}>
          <TagLabel>07 — Qué necesitamos de Nibec</TagLabel>
          <SectionTitle>Lo que hace falta para empezar</SectionTitle>
          <Rule />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {NECESITAMOS.map((n, i) => {
              const Icon = n.icon;
              return (
                <div key={i} className="rounded-xl p-4 flex gap-3"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <Icon className="w-4 h-4 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-poppins font-semibold text-white/85 text-[16px] mb-1">{n.titulo}</p>
                    <p className="font-lato text-white/50 text-[14px] leading-relaxed">{n.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl p-5 sm:p-6"
            style={{ background: 'rgba(245,160,42,.04)', border: '1px solid rgba(245,160,42,.2)' }}>
            <p className="font-poppins font-semibold text-white/80 text-[15px] uppercase tracking-wider mb-4 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" style={{ color: NIBEC_COLOR }} /> Puntos a validar con Nibec
            </p>
            <div className="space-y-3">
              {VALIDAR.map((v, i) => (
                <div key={i} className="flex gap-3">
                  <span className="font-poppins font-black text-[18px] leading-none mt-0.5 flex-shrink-0" style={{ color: NIBEC_COLOR }}>{i + 1}</span>
                  <div>
                    <p className="font-poppins font-semibold text-white/85 text-[16px] mb-0.5">{v.titulo}</p>
                    <p className="font-lato text-white/50 text-[14px] leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─ 08 INVERSIÓN ─ */}
        <section id="inversion" ref={s8.ref as React.RefObject<HTMLElement>} className={reveal(s8.v)}>
          <TagLabel>08 — Propuesta de inversión</TagLabel>
          <SectionTitle>Un solo pago</SectionTitle>
          <Rule />
          <div className="rounded-2xl p-6 sm:p-8 mb-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(0,191,165,.10) 0%, rgba(3,13,26,.9) 100%)', border: '1px solid rgba(0,191,165,.3)' }}>
            <div className="absolute top-0 right-0 w-52 h-52 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,191,165,.08), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <p className="font-lato text-white/40 text-[13px] uppercase tracking-widest">{META.producto}</p>
                <span className="font-lato text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(0,191,165,.15)', border: '1px solid rgba(0,191,165,.35)', color: TEAL }}>
                  Pago único
                </span>
              </div>
              <div className="flex flex-wrap items-end gap-3 mb-1">
                <p className="font-poppins font-black text-white leading-none" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)' }}>
                  USD 1.200
                </p>
                <span className="font-lato text-white/40 text-[18px] mb-1">sin IVA</span>
              </div>
              <p className="font-lato text-white/45 text-[15px] mb-5">Valores en dólares estadounidenses (servicio exportado desde Colombia).</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                {[
                  { label: 'Forma de pago', value: '50% al aprobar · 50% al entregar' },
                  { label: 'Garantía', value: '30 días' },
                  { label: 'Capacitación al equipo', value: '1 hora' },
                  { label: 'Plazo', value: '4 semanas' },
                  { label: 'Licencias o mensualidad', value: 'Ninguna' },
                  { label: 'Servidor (pagado por Nibec)', value: `≈ USD ${SERVIDOR_MES_USD}/mes` },
                ].map((r, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 py-0.5">
                    <span className="font-lato text-white/55 text-[15px]">{r.label}</span>
                    <span className="font-poppins font-bold text-white/85 text-[15px] text-right">{r.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl p-4 flex gap-3 mb-3"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <Wrench className="w-4 h-4 text-[#00bfa5] flex-shrink-0 mt-0.5" />
            <p className="font-lato text-white/55 text-[15px] leading-relaxed">
              <strong className="text-white/80">Garantía:</strong> durante 30 días corregimos cualquier falla sin costo. <strong className="text-white/80">Cambios después:</strong> son opcionales; pueden hacerse con los créditos del plan Sixteam Ops que Nibec ya conoce, o con cualquier desarrollador. No es obligatorio.
            </p>
          </div>
        </section>

        {/* ── LOGOS ── */}
        <div className="mt-16">
          <LogoCarousel logos={LOGOS_SIN_CLIENTE} />
        </div>

        {/* ─ 09 VIGENCIA ─ */}
        <section id="vigencia" ref={s9.ref as React.RefObject<HTMLElement>} className={reveal(s9.v)}>
          <TagLabel>09 — Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y Términos de la Propuesta</SectionTitle>
          <Rule />

          <div className="space-y-3">
            {[
              { titulo: 'Aprobación', desc: 'Para aceptar esta propuesta basta la confirmación por WhatsApp, correo o verbal. Con eso se envía el acuerdo a firmar y se pide el primer 50%.', icon: CheckCircle },
              { titulo: 'Términos de pago', desc: 'Pago único de USD 1.200: 50% al aprobar y 50% al entregar funcionando. Los pagos se hacen por transferencia bancaria en dólares estadounidenses. Valores sin IVA.', icon: FileText },
              { titulo: 'Inicio del plazo', desc: 'Las 4 semanas cuentan desde el primer pago y la entrega de los accesos a Bsale y Beetrack por parte de Nibec.', icon: Rocket },
              { titulo: 'Garantía y capacitación', desc: '30 días de garantía (corrección de fallas sin costo) y una capacitación de 1 hora al equipo.', icon: Shield },
              { titulo: 'Costos de terceros', desc: 'El servidor (≈ USD 10 al mes) y las suscripciones de Bsale y Beetrack los paga Nibec directamente a cada proveedor. No forman parte del valor de esta propuesta.', icon: Coins },
              { titulo: 'Vigencia de la propuesta', desc: `Esta propuesta tiene una vigencia de 30 días calendario desde su fecha de emisión (${META.fecha}). Pasado este plazo, los valores podrán ser revisados.`, icon: Calendar },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="rounded-xl p-4 sm:p-5 flex gap-4"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <Icon className="w-4 h-4 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-poppins font-semibold text-white/80 text-[16px] mb-1">{item.titulo}</p>
                    <p className="font-lato text-white/50 text-[16px] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-12 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 100%, rgba(245,160,42,.05), transparent 70%)' }} />
            <div className="relative z-10">
              <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-10 w-auto object-contain mx-auto mb-3"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <p className="font-poppins font-black text-white text-[20px] tracking-tight mb-1">Sixteam<span className="text-[#00bfa5]">.</span>pro</p>
              <p className="font-lato text-white/35 text-[14px] mb-4">{META.proponente}</p>
              <div className="flex flex-wrap justify-center gap-4 text-[14px] text-white/35 font-lato">
                <span>NIT {META.nit}</span>
                <span>·</span>
                <span>{META.correo}</span>
                <span>·</span>
                <span>RL: {META.rl}</span>
              </div>
              <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: 'rgba(0,191,165,.07)', border: '1px solid rgba(0,191,165,.2)' }}>
                <Users className="w-3.5 h-3.5 flex-shrink-0 text-[#00bfa5]" />
                <span className="font-lato text-white/40 text-[14px]">Propuesta realizada por:</span>
                <span className="font-poppins font-bold text-white/80 text-[14px]">{META.autor}</span>
                <span className="font-lato text-[#00bfa5] text-[14px]">{META.autorCargo}</span>
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

export default NibecDespachosProposal;
