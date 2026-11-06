import React, { useState, useEffect, useRef } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import {
  CheckCircle, ChevronRight, Clock, FileText, Target,
  AlertCircle, Calendar, MapPin, Shield, Coins,
  MessageSquare, LayoutDashboard, Bot, BarChart3,
  Link2, Tag, Users, SlidersHorizontal, ShieldCheck, BookOpen,
  Hourglass,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Máster Viajes',
  marcas: 'Dreams 15 · Origen',
  fecha: 'Noviembre 2026',
  lugar: 'Colombia',
  objetivo: 'Una bolsa de 10 horas del equipo de Sixteam, redimibles durante 3 meses, para ver con claridad qué anuncio trae cada cliente y dejar el asistente de inteligencia artificial de Dreams 15 y Origen bien configurado.',
  proponente: 'Sixteam Innovación y Estrategia Digital S.A.S.',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  destinatarios: 'Equipo Dreams 15 y Origen',
  elaboradaPor: 'Ernesto Hernández',
  cargoElaborador: 'Gerente Comercial Sixteam',
};

const DREAMS_PINK = '#f4a6c6';

const INVERSION_COP     = '1.100.000';
const HORAS_PLAN        = 10;
const MESES_PLAN        = 3;
const HORA_ADICIONAL    = '120.000';
const HORA_PLAN_COP     = '110.000';
const TARIFA_SUELTA     = '130.000';
const VALOR_SUELTO_10H  = '1.300.000';
const AHORRO_COP        = '200.000';

// ─── EL PLAN ─────────────────────────────────────────────────────────────────

const CAMBIOS = [
  {
    icon: Hourglass, color: '#00bfa5', colorAlpha: 'rgba(0,191,165,.08)', colorBorder: 'rgba(0,191,165,.22)',
    titulo: `${HORAS_PLAN} horas para usar en ${MESES_PLAN} meses`,
    desc: 'No es una cuota mensual. Máster Viajes compra una bolsa de horas del equipo y la va gastando según lo que necesite durante los tres meses, sin un mínimo por mes.',
  },
  {
    icon: Coins, color: DREAMS_PINK, colorAlpha: 'rgba(244,166,198,.07)', colorBorder: 'rgba(244,166,198,.22)',
    titulo: 'Cada hora sale más barata que una cotización suelta',
    desc: `Dentro del plan, la hora queda en $${HORA_PLAN_COP} COP frente a los $${TARIFA_SUELTA} COP de una cotización puntual. Y si se necesita más, la hora adicional se mantiene en $${HORA_ADICIONAL} COP más IVA.`,
  },
  {
    icon: LayoutDashboard, color: '#38bdf8', colorAlpha: 'rgba(56,189,248,.08)', colorBorder: 'rgba(56,189,248,.22)',
    titulo: 'El primer mes ya viene planeado',
    desc: 'Las primeras 8 horas tienen destino definido: el dashboard de rendimiento de pauta y la configuración del asistente de IA. Las 2 restantes quedan de reserva para ajustes en los meses 2 y 3.',
  },
  {
    icon: MessageSquare, color: '#a78bfa', colorAlpha: 'rgba(167,139,250,.08)', colorBorder: 'rgba(167,139,250,.22)',
    titulo: 'Nada se gasta sin que ustedes lo aprueben',
    desc: 'Antes de cada trabajo Sixteam dice cuántas horas toma. Máster Viajes aprueba, el equipo ejecuta y el saldo de la bolsa queda visible en todo momento.',
  },
];

const FLUJO = [
  { step: '01', text: 'Máster Viajes pide el trabajo por el canal de siempre: WhatsApp, correo o reunión.' },
  { step: '02', text: 'Sixteam responde con cuántas horas toma y en cuánto tiempo queda listo.' },
  { step: '03', text: 'Máster Viajes aprueba y el equipo ejecuta. Las horas se descuentan de la bolsa.' },
  { step: '04', text: 'Al cierre de cada mes se envía el reporte de horas usadas y el saldo disponible.' },
];

// ─── PLAN DE TRABAJO · MES 1 ─────────────────────────────────────────────────

const DASHBOARD = [
  { texto: 'Levantar las métricas de interés de la pauta digital activa: CTR, costo por lead, impresiones e inversión por anuncio.', horas: 0.5, icon: BarChart3 },
  { texto: 'Conectar Meta con la Plataforma Sixteam para traer las métricas por anuncio y por campaña, con apoyo del Trafficker.', horas: 0.5, icon: Link2 },
  { texto: 'Configurar la función que asigna a cada contacto el origen correcto (campaña y anuncio) cuando da clic en un anuncio y entra al CRM Sixteam.', horas: 0.5, icon: Tag },
  { texto: 'Armar los dashboards personalizados de Dreams 15 y Origen de acuerdo con el levantamiento.', horas: 3, icon: LayoutDashboard },
  { texto: 'Socializar los dashboards con el equipo de Dreams 15 y Origen.', horas: 0.5, icon: Users },
];

const ASISTENTE = [
  { texto: 'Ordenar la información de cada marca en una base de conocimiento propia: destinos, planes, condiciones, políticas y preguntas frecuentes.', horas: 1, icon: BookOpen },
  { texto: 'Configurar las instrucciones de cada asistente: qué responde, qué no, con qué tono y en qué momento pasa la conversación a un asesor.', horas: 1, icon: SlidersHorizontal },
  { texto: 'Probar el asistente con preguntas reales de clientes y corregir las respuestas que no estén a la altura.', horas: 0.5, icon: MessageSquare },
  { texto: 'Entregar al equipo una guía corta para actualizar la información del asistente sin depender de Sixteam.', horas: 0.5, icon: Users },
];

const horasTotal = (arr: { horas: number }[]) => arr.reduce((s, a) => s + a.horas, 0);
const fmtH = (h: number) => `${h.toLocaleString('es-CO', { maximumFractionDigits: 1 })} h`;

const H_DASH = horasTotal(DASHBOARD);   // 5
const H_IA   = horasTotal(ASISTENTE);   // 3
const H_MES1 = H_DASH + H_IA;           // 8
const H_RESERVA = HORAS_PLAN - H_MES1;  // 2

// ─── VALOR AGREGADO DEL ASISTENTE ────────────────────────────────────────────

const VALOR_IA = [
  {
    icon: ShieldCheck, color: '#00bfa5', bg: 'rgba(0,191,165,.07)', bd: 'rgba(0,191,165,.22)',
    titulo: 'Menos alucinaciones',
    desc: 'El asistente responde solo con la información que Dreams 15 y Origen validaron. Si la respuesta no está en su base, lo dice con honestidad y pasa la conversación a un asesor en lugar de inventar un precio o una fecha.',
  },
  {
    icon: SlidersHorizontal, color: DREAMS_PINK, bg: 'rgba(244,166,198,.07)', bd: 'rgba(244,166,198,.22)',
    titulo: 'Más ajustable',
    desc: 'Cambiar un precio, una salida o una política es editar un documento, no reconstruir el asistente. El ajuste se ve reflejado de inmediato en las siguientes conversaciones.',
  },
  {
    icon: Shield, color: '#38bdf8', bg: 'rgba(56,189,248,.07)', bd: 'rgba(56,189,248,.22)',
    titulo: 'Más controlable',
    desc: 'Reglas claras sobre qué puede ofrecer, qué no puede prometer y cuándo debe escalar. Cada marca conserva su propia voz y su propia información, sin cruzar datos entre Dreams 15 y Origen.',
  },
];

// ─── CONSUMO SUGERIDO DE LA BOLSA ────────────────────────────────────────────

const CONSUMO = [
  { mes: 'Mes 1', items: [
    { t: 'Dashboard de rendimiento de pauta', h: H_DASH },
    { t: 'Configuración del asistente de IA', h: H_IA },
  ] },
  { mes: 'Mes 2', items: [
    { t: 'Ajustes al dashboard con el primer mes de datos reales', h: 1 },
  ] },
  { mes: 'Mes 3', items: [
    { t: 'Afinación del asistente con conversaciones reales', h: 1 },
  ] },
];

// ─── TÉRMINOS ────────────────────────────────────────────────────────────────

const TERMINOS: { titulo: string; desc: string; icon: React.ElementType }[] = [
  {
    titulo: 'Cómo aceptar esta propuesta',
    desc: 'Máster Viajes confirma su aceptación por WhatsApp, correo electrónico o de forma verbal en la reunión de seguimiento. Con esa confirmación y el pago se agenda el arranque del plan de trabajo del primer mes.',
    icon: CheckCircle,
  },
  {
    titulo: 'Bolsa de horas y su vigencia',
    desc: `El Plan Integral incluye ${HORAS_PLAN} horas del equipo de Sixteam, redimibles durante ${MESES_PLAN} meses contados desde la fecha de inicio. No hay un mínimo ni un máximo de horas por mes dentro de ese plazo. Las horas que no se usen al cierre del tercer mes se pierden y no son reembolsables, transferibles ni canjeables.`,
    icon: Hourglass,
  },
  {
    titulo: 'Estimación previa de cada trabajo',
    desc: 'Ningún trabajo se ejecuta sin aprobación. Sixteam informa antes cuántas horas toma y en cuánto tiempo queda listo, de modo que Máster Viajes controla el consumo de la bolsa durante todo el plan.',
    icon: MessageSquare,
  },
  {
    titulo: 'Horas adicionales',
    desc: `Si se agotan las ${HORAS_PLAN} horas antes de terminar el plan, cada hora adicional se factura a $${HORA_ADICIONAL} COP más IVA, siempre con estimación y aprobación previas. Si Máster Viajes prefiere, el trabajo se deja para una siguiente bolsa.`,
    icon: Clock,
  },
  {
    titulo: 'Accesos y apoyo del Trafficker',
    desc: 'Para conectar Meta con la Plataforma Sixteam se necesitan los accesos de administrador a la cuenta publicitaria y el acompañamiento del Trafficker de Máster Viajes. Si los accesos o la información de cada marca se demoran, las fechas del plan se corren en la misma medida.',
    icon: Link2,
  },
  {
    titulo: 'Pago',
    desc: `Pago único y anticipado de $${INVERSION_COP} COP más IVA al inicio del plan. La facturación se realiza en pesos colombianos y todos los valores de esta propuesta se expresan antes de IVA. Las horas adicionales, si las hubo, se facturan aparte junto con el reporte del mes en que se usaron.`,
    icon: FileText,
  },
  {
    titulo: 'Propiedad y confidencialidad',
    desc: 'Máster Viajes es propietario de sus datos, de su base de contactos, de la información de sus marcas y de los dashboards construidos. Sixteam mantiene la confidencialidad total de esa información durante la vigencia del servicio y después de su terminación.',
    icon: Shield,
  },
  {
    titulo: 'Vigencia de la propuesta',
    desc: '30 días calendario desde su fecha de emisión. Pasado ese plazo, los valores podrán ser revisados según las condiciones del mercado.',
    icon: Calendar,
  },
];

// ─── SECCIONES NAV ───────────────────────────────────────────────────────────

const SECCIONES = [
  { id: 'servicio',  label: 'El plan'        },
  { id: 'trabajo',   label: 'Plan de trabajo'},
  { id: 'asistente', label: 'Asistente IA'   },
  { id: 'inversion', label: 'Inversión'      },
  { id: 'vigencia',  label: 'Vigencia'       },
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
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: `linear-gradient(90deg,${DREAMS_PINK},#00bfa5)` }} />
);

// El logo de Origen es azul marino, por eso va sobre una pastilla blanca para que se lea en fondo oscuro
const OrigenBadge = ({ big = false }: { big?: boolean }) => (
  <span className={`inline-flex items-center justify-center bg-white ${big ? 'rounded-lg px-3 py-1.5' : 'rounded-md px-2 py-1'}`}>
    <img src="/logo-origen.png" alt="Origen" className={`${big ? 'h-9' : 'h-5'} w-auto object-contain`}
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
  </span>
);

// Barra de 10 bloques que muestra cómo se reparte la bolsa
const BolsaHoras = () => {
  const bloques = Array.from({ length: HORAS_PLAN }, (_, i) =>
    i < H_DASH ? 'dash' : i < H_MES1 ? 'ia' : 'reserva');
  const color = { dash: '#00bfa5', ia: DREAMS_PINK, reserva: 'rgba(255,255,255,.14)' } as const;
  return (
    <div>
      <div className="grid grid-cols-10 gap-1.5 mb-3">
        {bloques.map((b, i) => (
          <div key={i} className="h-8 rounded-md flex items-center justify-center"
            style={{ background: b === 'reserva' ? 'transparent' : color[b], border: b === 'reserva' ? '1px dashed rgba(255,255,255,.25)' : 'none', opacity: b === 'reserva' ? 1 : 0.9 }}>
            <span className={`font-poppins font-bold text-[11px] ${b === 'reserva' ? 'text-white/40' : 'text-[#030d1a]'}`}>{i + 1}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1.5">
        {[
          { c: '#00bfa5',  t: `Dashboard de pauta · ${fmtH(H_DASH)}` },
          { c: DREAMS_PINK, t: `Asistente IA · ${fmtH(H_IA)}` },
          { c: 'rgba(255,255,255,.3)', t: `Reserva meses 2 y 3 · ${fmtH(H_RESERVA)}` },
        ].map((l, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.c }} />
            <span className="font-lato text-white/55 text-[14px]">{l.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const MasterViajesProposal = () => {
  const [activeSection, setActiveSection] = useState('servicio');
  const [terminoActivo, setTerminoActivo] = useState<number | null>(null);

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

  const s2 = useVisible(); const s3 = useVisible();
  const s4 = useVisible(); const s5 = useVisible(); const s6 = useVisible();

  const BloqueTrabajo = ({ titulo, sub, icon: Icon, color, bg, bd, items }: {
    titulo: string; sub: string; icon: React.ElementType; color: string; bg: string; bd: string;
    items: { texto: string; horas: number; icon: React.ElementType }[];
  }) => (
    <div className="rounded-2xl p-5 sm:p-6" style={{ background: bg, border: `1px solid ${bd}` }}>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,.05)', border: `1px solid ${bd}` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-poppins font-bold text-white text-[20px] leading-tight">{titulo}</p>
          <p className="font-lato text-white/45 text-[14px] mt-0.5">{sub}</p>
        </div>
        <span className="font-poppins font-black text-[18px] px-3 py-1 rounded-lg"
          style={{ background: 'rgba(255,255,255,.05)', border: `1px solid ${bd}`, color }}>
          {fmtH(horasTotal(items))}
        </span>
      </div>
      <div className="space-y-2">
        {items.map((a, i) => {
          const AIcon = a.icon;
          return (
            <div key={i} className="flex items-start gap-3 rounded-xl p-3.5"
              style={{ background: 'rgba(3,13,26,.55)', border: '1px solid rgba(255,255,255,.06)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,255,255,.04)', border: `1px solid ${bd}` }}>
                <span className="font-poppins font-black text-[12px]" style={{ color }}>{i + 1}</span>
              </div>
              <AIcon className="w-4 h-4 flex-shrink-0 mt-1.5 hidden sm:block" style={{ color, opacity: 0.7 }} />
              <p className="font-lato text-white/65 text-[16px] leading-relaxed flex-1 min-w-0">{a.texto}</p>
              <span className="font-poppins font-bold text-white/80 text-[14px] px-2.5 py-1 rounded-md flex-shrink-0"
                style={{ background: 'rgba(255,255,255,.05)' }}>
                {fmtH(a.horas)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

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
            style={{ background: 'radial-gradient(circle, rgba(244,166,198,.06) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,191,165,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
          <div className="absolute inset-0 opacity-[0.022]"
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
            <div className="hidden sm:flex items-center gap-4 h-9">
              <img src="/logo-dreams.png" alt="Dreams 15" className="h-6 w-auto object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <span className="text-white/20">·</span>
              <OrigenBadge />
            </div>
          </div>
          <span className="font-lato text-[#00bfa5]/80 text-[13px] uppercase tracking-[0.2em] border border-[#00bfa5]/20 rounded-full px-3 py-1.5">Confidencial</span>
        </div>

        <style>{`
          @keyframes cover-spin-slow { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
          @keyframes cover-spin-rev  { from{transform:rotate(0deg)}to{transform:rotate(-360deg)} }
          @keyframes cover-pulse-glow { 0%,100%{opacity:.07;transform:scale(1)} 50%{opacity:.14;transform:scale(1.12)} }
          @keyframes cover-float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
          .cover-ring-1{animation:cover-spin-slow 22s linear infinite}
          .cover-ring-2{animation:cover-spin-rev 16s linear infinite}
          .cover-glow{animation:cover-pulse-glow 4s ease-in-out infinite}
          .cover-float{animation:cover-float 5s ease-in-out infinite}
        `}</style>

        <div className="relative z-10 flex-1 flex items-center justify-center py-12" style={{ paddingLeft: '8%', paddingRight: '8%' }}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-center">

            <div className="flex flex-col justify-center">
              <TagLabel>Propuesta comercial · Sixteam Ops</TagLabel>
              <div className="mt-4 mb-3 flex flex-wrap items-center gap-2">
                <span className="font-lato text-white/45 text-[15px]">Para:</span>
                <span className="font-poppins font-bold text-white/85 text-[18px]">{META.cliente}</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(244,166,198,.10)', border: '1px solid rgba(244,166,198,.26)', color: DREAMS_PINK }}>
                  {META.marcas}
                </span>
              </div>
              <h1 className="font-poppins font-black text-white leading-[1.0] mb-4"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 4.8rem)' }}>
                Plan<br />
                <span style={{ background: `linear-gradient(90deg,${DREAMS_PINK},#00bfa5)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Integral
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
                  { icon: Calendar,  text: META.fecha },
                  { icon: MapPin,    text: META.lugar },
                  { icon: Hourglass, text: `${HORAS_PLAN} horas · ${MESES_PLAN} meses` },
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
                  {['1. Cómo funciona el plan','2. Plan de trabajo del mes 1','3. El asistente de IA','4. Propuesta de inversión','5. Vigencia y términos'].map((item, i) => (
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
                  style={{ background: 'radial-gradient(circle, rgba(244,166,198,.08) 0%, rgba(0,191,165,.04) 50%, transparent 70%)' }} />
                <div className="cover-ring-1 absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full" style={{ border: '1px solid rgba(244,166,198,.14)' }} />
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full" style={{ border: '1px dashed rgba(0,191,165,.15)' }} />
                <div className="cover-ring-1 absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full flex items-start justify-center">
                  <div className="w-2 h-2 rounded-full -mt-1" style={{ background: '#00bfa5', boxShadow: '0 0 8px rgba(0,191,165,.8)' }} />
                </div>
                <div className="cover-ring-2 absolute w-64 h-64 rounded-full flex items-end justify-center">
                  <div className="w-1.5 h-1.5 rounded-full mb-[-3px]" style={{ background: DREAMS_PINK, boxShadow: '0 0 6px rgba(244,166,198,.8)' }} />
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
                  <div className="rounded-2xl px-6 py-5 flex flex-col items-center gap-3"
                    style={{ background: 'linear-gradient(135deg, rgba(244,166,198,.10), rgba(56,189,248,.05))', border: '1px solid rgba(244,166,198,.24)', boxShadow: '0 4px 30px rgba(244,166,198,.10)' }}>
                    <img src="/logo-dreams.png" alt="Dreams 15" className="h-9 w-auto object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    <div className="w-12 h-px bg-white/10" />
                    <OrigenBadge big />
                  </div>
                  <div className="text-center">
                    <p className="font-poppins font-bold text-white/80 text-[17px] tracking-tight">{META.cliente}</p>
                    <p className="font-lato text-[13px] uppercase tracking-[0.2em] mt-1" style={{ color: DREAMS_PINK }}>Sixteam Ops · Plan Integral</p>
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

        {/* ─ 01 EL PLAN ─ */}
        <section id="servicio" ref={s2.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s2.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>01 · Cómo funciona el plan</TagLabel>
          <SectionTitle>Una bolsa de horas, tres meses para usarla</SectionTitle>
          <Rule />

          <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden mb-8"
            style={{ background: 'rgba(244,166,198,.05)', border: '1px solid rgba(244,166,198,.20)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(244,166,198,.07), transparent 70%)', transform: 'translate(20%,-20%)' }} />
            <Target className="w-7 h-7 mb-4" style={{ color: DREAMS_PINK }} />
            <p className="font-poppins font-semibold text-white/85 text-xl sm:text-[23px] leading-relaxed">
              Sixteam Ops es el servicio con el que el equipo de Sixteam opera la tecnología de marketing, ventas y servicio de sus clientes. En el <strong className="text-white font-black">Plan Integral</strong>, Máster Viajes compra <strong className="text-white font-black">{HORAS_PLAN} horas</strong> del equipo y las redime durante <strong className="text-white font-black">{MESES_PLAN} meses</strong> en lo que Dreams 15 y Origen necesiten. El primer mes ya viene con su plan de trabajo definido.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {CAMBIOS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="rounded-xl p-5 flex gap-4"
                  style={{ background: item.colorAlpha, border: `1px solid ${item.colorBorder}` }}>
                  <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: item.color }} />
                  <div>
                    <p className="font-poppins font-bold text-white/90 text-[17px] mb-1">{item.titulo}</p>
                    <p className="font-lato text-white/50 text-[15px] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bolsa visual */}
          <div className="rounded-2xl p-5 sm:p-6 mb-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Hourglass className="w-4 h-4 text-[#00bfa5]" /> Así se reparten las {HORAS_PLAN} horas
            </p>
            <BolsaHoras />
            <p className="font-lato text-white/35 text-[13px] mt-4 leading-relaxed">
              Las horas de reserva no tienen destino fijo. Además de ajustar el dashboard y el asistente cuando ya haya datos y conversaciones reales, Máster Viajes puede usarlas para abarcar <strong className="text-white/90 font-semibold">oportunidades de mejora o requerimientos adicionales</strong> en otros puntos tecnológicos, como configuraciones en HubSpot o automatizaciones para las actividades de mercadeo, el servicio posventa, el seguimiento a los viajeros o las tareas del equipo administrativo.
            </p>
          </div>

          {/* Flujo de una solicitud */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#00bfa5]" /> Cómo se usan las horas
            </p>
            <div className="space-y-2.5">
              {FLUJO.map((f, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl p-3.5"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(0,191,165,.10)', border: '1px solid rgba(0,191,165,.25)' }}>
                    <span className="font-poppins font-black text-[11px] text-[#00bfa5]">{f.step}</span>
                  </div>
                  <p className="font-lato text-white/60 text-[16px] leading-relaxed flex-1">{f.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Horas incluidas',   value: `${HORAS_PLAN}`,       sub: 'Del equipo de Sixteam' },
              { label: 'Plazo para usarlas', value: `${MESES_PLAN} meses`, sub: 'Sin mínimo por mes' },
              { label: 'Estimación previa', value: 'Siempre',             sub: 'Nada se ejecuta sin aprobar' },
              { label: 'Hora adicional',    value: `$${HORA_ADICIONAL}`,  sub: 'COP + IVA, si se necesita' },
            ].map((k, i) => (
              <div key={i} className="rounded-xl p-4 text-center"
                style={{ background: i < 2 ? 'rgba(244,166,198,.06)' : 'rgba(0,191,165,.06)', border: i < 2 ? '1px solid rgba(244,166,198,.20)' : '1px solid rgba(0,191,165,.18)' }}>
                <p className="font-poppins font-black text-white text-[20px] leading-tight mb-1">{k.value}</p>
                <p className="font-poppins font-semibold text-white/70 text-[13px] mb-0.5">{k.label}</p>
                <p className="font-lato text-white/35 text-[12px]">{k.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─ 03 PLAN DE TRABAJO ─ */}
        <section id="trabajo" ref={s3.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s3.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>02 · Plan de trabajo del mes 1</TagLabel>
          <SectionTitle>{fmtH(H_MES1).replace(' h', ' horas')} con destino definido</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            El primer mes se concentra en dos frentes. El primero es el dashboard de rendimiento de pauta, con las mismas actividades y tiempos de la cotización que ya conocen. El segundo es la configuración del asistente de inteligencia artificial de Dreams 15 y Origen, que entra como parte del plan.
          </p>

          <div className="space-y-5 mb-8">
            <BloqueTrabajo
              titulo="Dashboard de rendimiento de pauta"
              sub="Para Dreams 15 y Origen · objetivo de la cotización original"
              icon={BarChart3} color="#00bfa5"
              bg="rgba(0,191,165,.05)" bd="rgba(0,191,165,.22)"
              items={DASHBOARD}
            />
            <BloqueTrabajo
              titulo="Configuración del asistente de IA"
              sub="Dreams 15 y Origen · cada marca con su propia información y su propia voz"
              icon={Bot} color={DREAMS_PINK}
              bg="rgba(244,166,198,.05)" bd="rgba(244,166,198,.22)"
              items={ASISTENTE}
            />
          </div>

          {/* Qué recibe Máster Viajes */}
          <div className="rounded-2xl p-5 sm:p-6 mb-8" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#00bfa5]" /> Lo que queda funcionando al cierre del mes 1
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {[
                'Las métricas de Meta por anuncio y por campaña dentro de la Plataforma Sixteam',
                'Cada contacto nuevo en el CRM marcado con la campaña y el anuncio que lo trajo',
                'Un dashboard por marca con el rendimiento real de la pauta',
                'Asistente de IA de Dreams 15 con su base de conocimiento y sus reglas',
                'Asistente de IA de Origen con su base de conocimiento y sus reglas',
                'El equipo capacitado para leer los dashboards y actualizar el asistente',
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: i < 3 ? '#00bfa5' : DREAMS_PINK }} />
                  <span className="font-lato text-white/60 text-[15px] leading-snug">{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Consumo sugerido */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(56,189,248,.04)', border: '1px solid rgba(56,189,248,.18)' }}>
            <p className="font-poppins font-semibold text-white/70 text-[15px] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#38bdf8]" /> Consumo sugerido de la bolsa en los {MESES_PLAN} meses
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {CONSUMO.map((m, i) => {
                const total = m.items.reduce((s, x) => s + x.h, 0);
                return (
                  <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(3,13,26,.6)', border: '1px solid rgba(255,255,255,.07)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-poppins font-bold text-white/85 text-[16px]">{m.mes}</p>
                      <span className="font-poppins font-black text-[#38bdf8] text-[16px]">{fmtH(total)}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {m.items.map((x, j) => (
                        <li key={j} className="flex items-start justify-between gap-2">
                          <span className="font-lato text-white/50 text-[14px] leading-snug">{x.t}</span>
                          <span className="font-lato text-white/40 text-[13px] flex-shrink-0">{fmtH(x.h)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'rgba(56,189,248,.07)', border: '1px solid rgba(56,189,248,.2)' }}>
              <span className="font-poppins font-semibold text-white/75 text-[15px]">Total de la bolsa</span>
              <span className="font-poppins font-black text-white text-[17px]">{fmtH(HORAS_PLAN)}</span>
            </div>
            <p className="font-lato text-white/35 text-[13px] mt-4 leading-relaxed">
              Los meses 2 y 3 son una referencia. Máster Viajes decide en qué se usan las {fmtH(H_RESERVA).replace(' h', ' horas')} de reserva, y cada trabajo se estima y se aprueba antes de ejecutarse.
            </p>
          </div>
        </section>

        {/* ─ 04 ASISTENTE IA ─ */}
        <section id="asistente" ref={s4.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s4.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>03 · El asistente de IA</TagLabel>
          <SectionTitle>Un asistente que responde con la verdad de cada marca</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Las 3 horas del asistente son el valor agregado de tomar el Plan Integral. No se trata solo de encenderlo: se trata de darle una base de información ordenada y unas reglas claras. Esa es la diferencia entre un asistente que improvisa y uno en el que el equipo puede confiar frente a un cliente.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {VALOR_IA.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="rounded-2xl p-5" style={{ background: v.bg, border: `1px solid ${v.bd}` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: 'rgba(255,255,255,.05)', border: `1px solid ${v.bd}` }}>
                    <Icon className="w-5 h-5" style={{ color: v.color }} />
                  </div>
                  <p className="font-poppins font-bold text-white text-[19px] mb-1.5">{v.titulo}</p>
                  <p className="font-lato text-white/55 text-[15px] leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─ 05 INVERSIÓN ─ */}
        <section id="inversion" ref={s5.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s5.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>04 · Propuesta de inversión</TagLabel>
          <SectionTitle>Un solo pago por los tres meses</SectionTitle>
          <Rule />

          <p className="font-lato text-white/50 text-[18px] leading-relaxed mb-8">
            Los valores se expresan en <strong className="text-white/75">pesos colombianos (COP), más IVA</strong>. El Plan Integral reemplaza la cotización suelta del dashboard: ese trabajo queda incluido dentro de la bolsa de horas.
          </p>

          <div className="rounded-2xl overflow-hidden mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(244,166,198,.09) 0%, rgba(3,13,26,.95) 100%)', border: '1px solid rgba(244,166,198,.32)', boxShadow: '0 4px 32px rgba(244,166,198,.10)' }}>
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(244,166,198,.16)' }}>
                  <Coins className="w-4 h-4" style={{ color: DREAMS_PINK }} />
                </div>
                <span className="font-poppins font-bold text-white/70 text-[15px]">Sixteam Ops · Plan Integral</span>
                <span className="font-lato text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider ml-auto"
                  style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.28)', color: '#00bfa5' }}>
                  {HORAS_PLAN} horas · {MESES_PLAN} meses
                </span>
              </div>

              <div className="flex flex-wrap items-baseline gap-3 mb-2">
                <p className="font-poppins font-black text-white leading-none" style={{ fontSize: 'clamp(2.3rem, 7vw, 3.2rem)' }}>
                  ${INVERSION_COP}
                </p>
                <p className="font-poppins font-bold text-white/45 text-[20px]">COP + IVA</p>
              </div>
              <p className="font-lato text-white/35 text-[15px] mb-6">
                Pago único · {HORAS_PLAN} horas redimibles en {MESES_PLAN} meses · equivale a ${HORA_PLAN_COP} COP por hora
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-6">
                {[
                  `${HORAS_PLAN} horas del equipo de Sixteam para usar durante ${MESES_PLAN} meses`,
                  `Dashboard de rendimiento de pauta para Dreams 15 y Origen (${fmtH(H_DASH)})`,
                  `Configuración del asistente de IA de las dos marcas (${fmtH(H_IA)})`,
                  `${fmtH(H_RESERVA).replace(' h', ' horas')} de reserva para ajustes en los meses 2 y 3`,
                  'Estimación en horas y tiempo de entrega antes de cada trabajo',
                  'Reporte mensual de horas usadas y saldo disponible',
                  'Canal directo por WhatsApp y correo con el equipo de Sixteam',
                  'Capacitación al equipo sobre el dashboard y el asistente',
                ].map((p, j) => (
                  <div key={j} className="flex items-start gap-2.5">
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: DREAMS_PINK }} />
                    <span className="font-lato text-white/60 text-[15px] leading-snug">{p}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t" style={{ borderColor: 'rgba(255,255,255,.08)' }}>
                {[
                  { label: 'Horas incluidas',   value: `${HORAS_PLAN}` },
                  { label: 'Plazo para usarlas', value: `${MESES_PLAN} meses` },
                  { label: 'Valor por hora',    value: `$${HORA_PLAN_COP}` },
                  { label: 'Hora adicional',    value: `$${HORA_ADICIONAL}` },
                ].map((m, i) => (
                  <div key={i} className="text-center rounded-xl p-3" style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.07)' }}>
                    <p className="font-poppins font-black text-[#00bfa5] text-[17px] leading-tight mb-1">{m.value}</p>
                    <p className="font-lato text-white/40 text-[12px] leading-snug">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comparativo */}
          <div className="rounded-xl p-5 mb-6" style={{ background: 'rgba(0,191,165,.05)', border: '1px solid rgba(0,191,165,.20)' }}>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-[#00bfa5]" />
              <p className="font-poppins font-semibold text-white/80 text-[18px]">Plan Integral frente a horas sueltas</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {[
                { t: `$${VALOR_SUELTO_10H}`, d: `${HORAS_PLAN} horas sueltas a $${TARIFA_SUELTA} COP`, c: 'rgba(255,255,255,.55)' },
                { t: `$${INVERSION_COP}`,    d: `${HORAS_PLAN} horas dentro del Plan Integral`,          c: DREAMS_PINK },
                { t: `$${AHORRO_COP}`,       d: 'Ahorro para Máster Viajes, cerca del 15%',             c: '#00bfa5' },
              ].map((p, i) => (
                <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                  <p className="font-poppins font-black text-[20px] mb-1" style={{ color: p.c }}>{p.t}</p>
                  <p className="font-lato text-white/45 text-[14px] leading-snug">{p.d}</p>
                </div>
              ))}
            </div>
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              Si en algún momento se agotan las {HORAS_PLAN} horas, cada <strong className="text-white/80">hora adicional cuesta ${HORA_ADICIONAL} COP más IVA</strong>, también por debajo de la tarifa suelta. Toda hora adicional se estima y se aprueba antes de ejecutarse.
            </p>
          </div>

          <div className="rounded-xl p-4 flex gap-3"
            style={{ background: 'rgba(245,158,11,.05)', border: '1px solid rgba(245,158,11,.20)' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#f59e0b]" />
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              Las {HORAS_PLAN} horas se pueden usar en cualquier momento dentro de los {MESES_PLAN} meses del plan. Las que no se usen al cierre del tercer mes se pierden y no son reembolsables. La inversión publicitaria en Meta, las tarifas por conversación de WhatsApp Business y el consumo de los modelos de inteligencia artificial se facturan aparte según su uso real. Todos los valores de esta propuesta se expresan antes de IVA.
            </p>
          </div>
        </section>

        {/* ── LOGOS DE CLIENTES ── */}
        <div className="mt-16">
          <LogoCarousel />
        </div>

        {/* ─ 06 VIGENCIA ─ */}
        <section id="vigencia" ref={s6.ref as React.RefObject<HTMLElement>}
          className={`transition-all duration-700 ${s6.v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TagLabel>05 · Vigencia y términos</TagLabel>
          <SectionTitle>Vigencia y Términos de la Propuesta</SectionTitle>
          <Rule />

          <p className="font-lato text-white/40 text-[15px] mb-5">Toca cada término para ver el detalle.</p>

          <div className="space-y-2.5">
            {TERMINOS.map((item, i) => {
              const Icon = item.icon;
              const open = terminoActivo === i;
              return (
                <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,.03)', border: open ? '1px solid rgba(0,191,165,.28)' : '1px solid rgba(255,255,255,.07)' }}>
                  <button onClick={() => setTerminoActivo(open ? null : i)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: open ? 'rgba(0,191,165,.12)' : 'rgba(255,255,255,.05)' }}>
                      <Icon className="w-4 h-4 transition-colors" style={{ color: open ? '#00bfa5' : 'rgba(255,255,255,.35)' }} />
                    </div>
                    <span className={`font-poppins font-semibold text-[18px] flex-1 min-w-0 ${open ? 'text-white' : 'text-white/70'}`}>{item.titulo}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ml-2 ${open ? 'rotate-90' : ''}`}
                      style={{ color: open ? '#00bfa5' : 'rgba(255,255,255,.3)' }} />
                  </button>

                  {open && (
                    <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                      <p className="font-lato text-white/60 text-[17px] leading-relaxed pt-4">{item.desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Cierre */}
          <div className="mt-8 rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(244,166,198,.05)', border: '1px solid rgba(244,166,198,.20)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5" style={{ color: DREAMS_PINK }} />
              <p className="font-poppins font-semibold text-white/80 text-[18px]">Medir mejor para vender mejor</p>
            </div>
            <p className="font-lato text-white/55 text-[16px] leading-relaxed">
              Sixteam ya conoce la operación de Dreams 15 y Origen y la plataforma en la que trabajan. Con el dashboard, Máster Viajes sabrá en qué anuncios vale la pena seguir invirtiendo; con el asistente bien configurado, cada persona que pregunta recibe una respuesta correcta desde el primer mensaje. Las horas de reserva aseguran que ninguno de los dos se quede quieto después de la entrega.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-12 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 100%, rgba(244,166,198,.04), transparent 70%)' }} />
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
              <div className="flex flex-wrap justify-center gap-1.5 text-[13px] text-white/25 font-lato mt-2">
                <span>Propuesta presentada a</span>
                <span className="text-white/40 font-medium">{META.destinatarios} · {META.cliente}</span>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 text-[13px] text-white/25 font-lato mt-1">
                <span>Propuesta elaborada por</span>
                <span className="text-white/40 font-medium">{META.elaboradaPor}</span>
                <span>·</span>
                <span>{META.cargoElaborador}</span>
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

export default MasterViajesProposal;
