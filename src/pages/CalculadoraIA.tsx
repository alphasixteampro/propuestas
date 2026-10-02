import { useEffect, useMemo, useState } from 'react';
import {
  Bot, MessageSquare, Calendar, Receipt, Info, Link2, Check,
  Sparkles, TrendingUp, Coins, Mail,
} from 'lucide-react';
import PDFButton from '../components/PDFButton';

// ─── TARIFA ──────────────────────────────────────────────────────────────────

const USD_POR_MENSAJE = 0.02;

const CONV_MIN  = 50;
const CONV_MAX  = 5000;
const CONV_TOPE = 100000;
const MSG_MIN   = 1;
const MSG_MAX   = 20;
const MSG_PROMEDIO = 6;

type Moneda = 'USD' | 'COP' | 'CLP';

const MONEDAS: Record<Moneda, { label: string; tasa: number; nota: string }> = {
  USD: { label: 'Solo USD',                tasa: 1,       nota: '' },
  COP: { label: 'Pesos colombianos (COP)', tasa: 3202.79, nota: 'TRM del 31 de agosto de 2026' },
  CLP: { label: 'Pesos chilenos (CLP)',    tasa: 950,     nota: 'Tasa de referencia, septiembre 2026' },
};

const ESCENARIOS = [
  { id: 'arranque',    label: 'Arranque',     conv: 100,  desc: 'Pocas conversaciones, el asistente empieza a atender' },
  { id: 'crecimiento', label: 'Crecimiento',  conv: 300,  desc: 'Volumen típico de una pyme con pauta activa' },
  { id: 'alto',        label: 'Alto volumen', conv: 1000, desc: 'Campañas constantes y varios canales conectados' },
];

const COMO_SE_COBRA = [
  {
    titulo: 'Qué se cobra',
    desc: `USD 0,02 por cada mensaje que procesa el asistente de IA. Es el costo de los modelos de inteligencia artificial que leen y responden las conversaciones.`,
    icon: Bot,
  },
  {
    titulo: 'Cuándo se factura',
    desc: 'Mes vencido, sobre el consumo real del período. Si un mes el asistente atiende menos conversaciones, el cobro baja en la misma proporción.',
    icon: Calendar,
  },
  {
    titulo: 'Qué no incluye',
    desc: 'Los mensajes de WhatsApp los cobra Meta aparte, según la tarifa de cada país, y se trasladan sin margen adicional. Ese valor no está incluido en este cálculo.',
    icon: MessageSquare,
  },
  {
    titulo: 'Es una estimación',
    desc: 'El resultado es referencial y no es un compromiso de facturación. Se factura en USD; el valor en moneda local es una equivalencia que puede variar con la tasa del día de cobro.',
    icon: Info,
  },
];

// ─── UTILIDADES ──────────────────────────────────────────────────────────────

const fmt = (n: number, dec = 0) =>
  n.toLocaleString('es-CO', { minimumFractionDigits: dec, maximumFractionDigits: dec });

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

function leerParametros() {
  const p = new URLSearchParams(window.location.search);
  const num = (k: string, def: number, max: number) => {
    const v = Number(p.get(k));
    return Number.isFinite(v) && v >= 1 ? Math.min(Math.round(v), max) : def;
  };
  const m = (p.get('moneda') || '').toUpperCase();
  return {
    conv:   num('conv', 300, CONV_TOPE),
    msg:    num('msg', MSG_PROMEDIO, MSG_MAX),
    moneda: (m in MONEDAS ? m : 'USD') as Moneda,
  };
}

// ─── SLIDER ──────────────────────────────────────────────────────────────────

function Control({
  id, label, ayuda, value, min, max, step, tope, onChange, marcador,
}: {
  id: string; label: string; ayuda: string; value: number;
  min: number; max: number; step: number; tope: number;
  onChange: (v: number) => void; marcador?: number;
}) {
  const enRango = clamp(value, min, max);
  const pct = ((enRango - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-1">
        <label htmlFor={id} className="font-poppins font-semibold text-white text-[16px] leading-snug">{label}</label>
        <input
          type="number" inputMode="numeric" min={1} max={tope} value={value || ''}
          aria-label={label}
          onChange={e => {
            const v = Math.floor(Number(e.target.value));
            onChange(Number.isFinite(v) ? clamp(v, 0, tope) : 0);
          }}
          onBlur={() => { if (value < 1) onChange(1); }}
          className="w-28 flex-shrink-0 rounded-lg px-3 py-2 text-right font-poppins font-bold text-[18px] text-white outline-none focus:ring-2 focus:ring-[#00bfa5]"
          style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.14)' }}
        />
      </div>
      <p className="font-lato text-white/55 text-[14px] mb-5">{ayuda}</p>

      <div className="relative">
        {marcador !== undefined && (
          <div className="absolute -top-6 pointer-events-none"
            style={{ left: `calc(${((marcador - min) / (max - min)) * 100}% - 26px)` }}>
            <span className="font-lato text-[11px] px-1.5 py-0.5 rounded whitespace-nowrap"
              style={{ background: 'rgba(0,191,165,.15)', color: '#00bfa5', border: '1px solid rgba(0,191,165,.35)' }}>
              prom. {marcador}
            </span>
          </div>
        )}
        <input
          id={id} type="range" min={min} max={max} step={step} value={enRango}
          onChange={e => onChange(Number(e.target.value))}
          className="calc-range"
          style={{ background: `linear-gradient(to right, #00bfa5 ${pct}%, rgba(255,255,255,.14) ${pct}%)` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="font-lato text-white/40 text-[12px]">{fmt(min)}</span>
        <span className="font-lato text-white/40 text-[12px]">{fmt(max)}{tope > max ? '+' : ''}</span>
      </div>
    </div>
  );
}

// ─── PÁGINA ──────────────────────────────────────────────────────────────────

export default function CalculadoraIA() {
  const inicial = useMemo(leerParametros, []);
  const [conv, setConv]     = useState(inicial.conv);
  const [msg, setMsg]       = useState(inicial.msg);
  const [moneda, setMoneda] = useState<Moneda>(inicial.moneda);
  const [tasas, setTasas]   = useState<Record<Moneda, number>>({
    USD: 1, COP: MONEDAS.COP.tasa, CLP: MONEDAS.CLP.tasa,
  });
  const [copiado, setCopiado]   = useState(false);

  useEffect(() => { document.title = 'Calculadora de consumo de IA — Sixteam.pro'; }, []);

  // La URL refleja los valores para compartir la estimación con el cliente
  useEffect(() => {
    const p = new URLSearchParams({ conv: String(conv), msg: String(msg) });
    if (moneda !== 'USD') p.set('moneda', moneda);
    window.history.replaceState(null, '', `${window.location.pathname}?${p}`);
  }, [conv, msg, moneda]);

  const mensajesMes = conv * msg;
  const usdMes      = mensajesMes * USD_POR_MENSAJE;
  const usdConv     = msg * USD_POR_MENSAJE;
  const usdAnio     = usdMes * 12;
  const tasa        = tasas[moneda];
  const escenario   = ESCENARIOS.find(e => e.conv === conv && msg === MSG_PROMEDIO)?.id;

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch { /* el navegador bloqueó el portapapeles */ }
  };

  return (
    <div id="proposal-root" className="min-h-screen overflow-x-hidden" style={{ background: '#030d1a', fontFamily: 'Lato, sans-serif' }}>
      <style>{`
        .calc-range { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 999px; outline: none; cursor: pointer; }
        .calc-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 26px; height: 26px; border-radius: 50%; background: #fff; border: 5px solid #00bfa5; box-shadow: 0 2px 12px rgba(0,191,165,.45); }
        .calc-range::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: #fff; border: 5px solid #00bfa5; box-shadow: 0 2px 12px rgba(0,191,165,.45); }
        .calc-range:focus-visible { outline: 2px solid #00bfa5; outline-offset: 8px; }
        #proposal-root input[type=number]::-webkit-inner-spin-button,
        #proposal-root input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        #proposal-root input[type=number] { -moz-appearance: textfield; }
      `}</style>

      {/* Fondo */}
      <div className="absolute inset-x-0 top-0 h-[520px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(29,112,162,.28), transparent 65%)' }} />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pb-16">

        {/* ── ENCABEZADO ── */}
        <header className="flex items-center justify-between gap-4 py-6">
          <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-9 sm:h-10 w-auto object-contain" />
          <PDFButton elementId="proposal-root" filename="calculadora-consumo-ia-sixteam.pdf" label="Descargar PDF" />
        </header>

        {/* ── HERO ── */}
        <section className="pt-6 pb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
            style={{ background: 'rgba(0,191,165,.10)', border: '1px solid rgba(0,191,165,.3)' }}>
            <Sparkles className="w-3.5 h-3.5 text-[#00bfa5]" />
            <span className="font-lato text-[#00bfa5] text-[13px] tracking-wide">Asistente de IA · Sixteam.pro</span>
          </div>
          <h1 className="font-poppins font-black text-white leading-tight mb-4" style={{ fontSize: 'clamp(1.9rem, 5vw, 3rem)' }}>
            Calculadora de consumo de IA
          </h1>
          <p className="font-lato text-white/70 text-[17px] leading-relaxed">
            Mueve los dos valores y mira cuánto costaría al mes el asistente de IA.
            Se cobra <strong className="text-white">USD 0,02 por cada mensaje</strong> que procesa.
          </p>
        </section>

        {/* ── ESCENARIOS ── */}
        <section className="mb-6">
          <p className="font-lato text-white/55 text-[14px] mb-3 text-center">Empieza con un escenario o ajusta los valores a mano</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ESCENARIOS.map(e => {
              const activo = escenario === e.id;
              return (
                <button key={e.id}
                  onClick={() => { setConv(e.conv); setMsg(MSG_PROMEDIO); }}
                  className="text-left rounded-xl px-4 py-3 transition-colors duration-200"
                  style={{
                    background: activo ? 'rgba(0,191,165,.10)' : 'rgba(255,255,255,.03)',
                    border: activo ? '1px solid rgba(0,191,165,.5)' : '1px solid rgba(255,255,255,.08)',
                  }}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-poppins font-bold text-white text-[15px]">{e.label}</span>
                    <span className="font-poppins font-semibold text-[13px]" style={{ color: activo ? '#00bfa5' : 'rgba(255,255,255,.55)' }}>
                      {fmt(e.conv)} conv/mes
                    </span>
                  </div>
                  <p className="font-lato text-white/50 text-[13px] mt-1 leading-snug">{e.desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── CALCULADORA ── */}
        <section className="grid lg:grid-cols-5 gap-5 mb-14">

          {/* Valores */}
          <div className="lg:col-span-3 rounded-2xl p-5 sm:p-7 space-y-9"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
            <Control
              id="conv" label="Conversaciones nuevas por mes"
              ayuda="Cuántas personas distintas escriben al mes y las atiende el asistente."
              value={conv} min={CONV_MIN} max={CONV_MAX} step={25} tope={CONV_TOPE} onChange={setConv}
            />
            <Control
              id="msg" label="Mensajes promedio por conversación"
              ayuda="Cuántos mensajes procesa el asistente en una conversación típica. El promedio que vemos es 6."
              value={msg} min={MSG_MIN} max={MSG_MAX} step={1} tope={MSG_MAX} onChange={setMsg} marcador={MSG_PROMEDIO}
            />

            {/* Moneda */}
            <div className="pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,.07)' }}>
              <p className="font-poppins font-semibold text-white text-[16px] mb-1">Ver también en moneda local</p>
              <p className="font-lato text-white/55 text-[14px] mb-4">Se factura en USD. La moneda local es solo una equivalencia.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {(Object.keys(MONEDAS) as Moneda[]).map(m => (
                  <button key={m} onClick={() => setMoneda(m)}
                    className="px-4 py-2 rounded-full font-lato text-[14px] transition-colors duration-200"
                    style={{
                      background: moneda === m ? 'rgba(0,191,165,.14)' : 'rgba(255,255,255,.04)',
                      border: moneda === m ? '1px solid rgba(0,191,165,.55)' : '1px solid rgba(255,255,255,.1)',
                      color: moneda === m ? '#00bfa5' : 'rgba(255,255,255,.7)',
                    }}>
                    {MONEDAS[m].label}
                  </button>
                ))}
              </div>
              {moneda !== 'USD' && (
                <div className="flex flex-wrap items-center gap-3">
                  <label htmlFor="tasa" className="font-lato text-white/70 text-[14px]">1 USD =</label>
                  <input id="tasa" type="number" inputMode="decimal" min={0} step={0.01}
                    value={tasa || ''}
                    onChange={e => setTasas(t => ({ ...t, [moneda]: Math.max(0, Number(e.target.value) || 0) }))}
                    className="w-32 rounded-lg px-3 py-2 text-right font-poppins font-semibold text-[15px] text-white outline-none focus:ring-2 focus:ring-[#00bfa5]"
                    style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.14)' }} />
                  <span className="font-lato text-white/70 text-[14px]">{moneda}</span>
                  <span className="font-lato text-white/45 text-[12px] w-full">{MONEDAS[moneda].nota} · puedes cambiarla</span>
                </div>
              )}
            </div>
          </div>

          {/* Resultado */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-6 space-y-4">
              <div className="rounded-2xl p-6 text-center"
                style={{ background: 'linear-gradient(135deg, rgba(0,191,165,.14), rgba(29,112,162,.14))', border: '1px solid rgba(0,191,165,.4)' }}>
                <p className="font-lato text-white/70 text-[13px] uppercase tracking-widest mb-2">Consumo estimado al mes</p>
                <p className="font-poppins font-black text-white leading-none mb-2" style={{ fontSize: 'clamp(2.2rem, 6vw, 3rem)' }}>
                  USD {fmt(usdMes, 2)}
                </p>
                {moneda !== 'USD' && (
                  <p className="font-poppins font-semibold text-[#00bfa5] text-[17px]">≈ {moneda} {fmt(usdMes * tasa)}</p>
                )}
                <div className="mt-4 rounded-lg px-3 py-2 font-lato text-white/60 text-[13px]"
                  style={{ background: 'rgba(3,13,26,.45)' }}>
                  USD 0,02 × {fmt(msg)} mensajes × {fmt(conv)} conversaciones
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: MessageSquare, label: 'Mensajes procesados al mes', valor: fmt(mensajesMes), sub: '' },
                  { icon: Coins, label: 'Costo por conversación', valor: `USD ${fmt(usdConv, 2)}`,
                    sub: moneda !== 'USD' ? `≈ ${moneda} ${fmt(usdConv * tasa)}` : '' },
                  { icon: TrendingUp, label: 'Proyección a 12 meses', valor: `USD ${fmt(usdAnio, 2)}`,
                    sub: moneda !== 'USD' ? `≈ ${moneda} ${fmt(usdAnio * tasa)}` : '' },
                ].map(({ icon: Icon, label, valor, sub }) => (
                  <div key={label} className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
                    <Icon className="w-4 h-4 text-[#00bfa5] flex-shrink-0" />
                    <span className="font-lato text-white/65 text-[14px] flex-1">{label}</span>
                    <div className="text-right">
                      <p className="font-poppins font-bold text-white text-[15px]">{valor}</p>
                      {sub && <p className="font-lato text-white/45 text-[12px]">{sub}</p>}
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={copiarEnlace}
                className="no-print w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-lato text-[14px] transition-colors duration-200"
                style={{
                  background: copiado ? 'rgba(0,191,165,.12)' : 'rgba(255,255,255,.04)',
                  border: copiado ? '1px solid rgba(0,191,165,.5)' : '1px solid rgba(255,255,255,.12)',
                  color: copiado ? '#00bfa5' : 'rgba(255,255,255,.8)',
                }}>
                {copiado ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                {copiado ? 'Enlace copiado' : 'Copiar enlace con estos valores'}
              </button>
            </div>
          </div>
        </section>

        {/* ── CÓMO SE COBRA ── */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-5">
            <Receipt className="w-5 h-5 text-[#00bfa5]" />
            <h2 className="font-poppins font-bold text-white text-[22px]">Cómo se cobra</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {COMO_SE_COBRA.map(({ titulo, desc, icon: Icon }) => (
              <div key={titulo} className="rounded-xl p-5"
                style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-[#00bfa5]" />
                  <p className="font-poppins font-semibold text-white text-[16px]">{titulo}</p>
                </div>
                <p className="font-lato text-white/65 text-[15px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CONTACTO ── */}
        <footer className="text-center pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,.07)' }}>
          <p className="font-lato text-white/65 text-[15px] mb-4">¿Quieres revisar la estimación con nosotros?</p>
          <a href="mailto:alpha@sixteam.pro?subject=Consulta%20sobre%20consumo%20de%20IA"
            className="no-print inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-poppins font-semibold text-[14px] text-white mb-8"
            style={{ background: 'linear-gradient(90deg, #1d70a2, #00bfa5)', boxShadow: '0 4px 20px rgba(0,191,165,.25)' }}>
            <Mail className="w-4 h-4" /> alpha@sixteam.pro
          </a>
          <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-9 w-auto object-contain mx-auto mb-3 opacity-80" />
          <p className="font-lato text-white/40 text-[12px]">Process + Technology + People = Growth</p>
        </footer>
      </div>
    </div>
  );
}
