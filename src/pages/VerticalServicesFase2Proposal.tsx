import React from 'react';
import {
  CheckCircle, Mail, Megaphone, Info, Calendar, MapPin, Compass, Wrench,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'Vertical Services',
  fecha: 'Octubre 2026',
  lugar: 'Colombia',
  inversion: 'COP 1.500.000',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
};

const VS_BLUE = '#3b82f6';

const APRENDIZAJES = [
  { titulo: 'El presupuesto 2026 ya se ejecutó', desc: 'Los clientes están pensando en su **presupuesto 2027** y cierran ahora lo que ejecutan desde febrero.' },
  { titulo: 'Ya conocen a Vertical Services', desc: 'Los primeros envíos dieron a conocer la marca. Ahora toca invitar a una **acción concreta**.' },
  { titulo: 'Quien interactuó es un contacto caliente', desc: 'Quienes abrieron, visitaron la web o intentaron llenar el formulario son la **mejor oportunidad**.' },
];

const FRENTES = [
  {
    num: '01',
    nombre: 'Último envío de email marketing',
    sub: 'Un solo envío, guiado a la conversión',
    icon: Mail,
    color: '#00bfa5',
    items: [
      'Uso de los **segmentos ya creados**: quienes abrieron, visitaron la web o intentaron llenar el formulario',
      'Montaje del correo con el **mensaje y la oferta que defina Vertical Services**',
      'Programación y envío a la base de datos',
      'Informe con aperturas, clics y respuestas, y la **lista de interesados** para las llamadas',
    ],
  },
  {
    num: '02',
    nombre: 'Pauta digital en Meta Ads',
    sub: 'Facebook e Instagram',
    icon: Megaphone,
    color: VS_BLUE,
    items: [
      'Configuración de la **cuenta publicitaria** y del seguimiento de visitas en la web',
      'Creación de los **públicos que ustedes definan**: visitantes de la web, contactos de la base o intereses',
      'Montaje de campañas y anuncios con las **piezas y textos que entrega Vertical Services**',
      'Seguimiento de la inversión, ajustes técnicos aprobados por ustedes e **informe mensual** de resultados',
    ],
  },
];

const ROLES = [
  {
    quien: 'Vertical Services define',
    icon: Compass,
    color: VS_BLUE,
    items: [
      'La estrategia, el mensaje y la oferta',
      'Las piezas gráficas, videos y textos',
      'El público al que se quiere llegar',
      'El presupuesto de pauta y las decisiones sobre cada ajuste',
    ],
  },
  {
    quien: 'Sixteam.pro ejecuta',
    icon: Wrench,
    color: '#00bfa5',
    items: [
      'El montaje técnico del correo y de las campañas',
      'La configuración de la plataforma y de Meta Ads',
      'El envío, la publicación y el seguimiento',
      'Los informes con los resultados para que ustedes decidan',
    ],
  },
];

const FORMAS_PAGO = [
  {
    nombre: 'Pago único por adelantado',
    desc: 'Un solo pago al iniciar el mes.',
    badge: '5 % de descuento',
    color: '#00bfa5',
    filas: [
      { label: 'Valor del mes', value: 'COP 1.500.000' },
      { label: 'Descuento 5 %', value: '− COP 75.000' },
      { label: 'Total a pagar', value: 'COP 1.425.000 + IVA' },
    ],
  },
  {
    nombre: 'Dos pagos',
    desc: '50 % al iniciar y 50 % al finalizar el mes.',
    badge: '',
    color: VS_BLUE,
    filas: [
      { label: 'Al iniciar el mes', value: 'COP 750.000 + IVA' },
      { label: 'Al finalizar el mes', value: 'COP 750.000 + IVA' },
      { label: 'Total a pagar', value: 'COP 1.500.000 + IVA' },
    ],
  },
];

const CONDICIONES = [
  { titulo: 'Qué no incluye', desc: 'No creamos contenido (piezas, videos ni textos), no diseñamos la estrategia ni tomamos decisiones de marketing. Todo se ejecuta sobre lo que Vertical Services defina y entregue.' },
  { titulo: 'Presupuesto de pauta', desc: 'El dinero que se invierte en anuncios **no está incluido** en el valor mensual. Vertical Services lo define y lo paga directamente a Meta con su propio medio de pago.' },
  { titulo: 'Inicio', desc: 'El trabajo inicia con la aprobación de la propuesta, el primer pago y la entrega del mensaje, las piezas y los accesos necesarios. Los pagos se realizan por transferencia bancaria.' },
  { titulo: 'Vigencia', desc: 'Esta propuesta es válida por 30 días calendario desde su fecha de emisión.' },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

// Convierte **texto** en <strong> para resaltar palabras clave
const Rich = ({ text }: { text: string }) => (
  <>
    {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith('**')
        ? <strong key={i} className="text-white/90 font-semibold">{part.slice(2, -2)}</strong>
        : <React.Fragment key={i}>{part}</React.Fragment>
    )}
  </>
);

const TagLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="font-lato text-[#00bfa5] text-[13px] uppercase tracking-[0.22em] font-medium">{children}</span>
);
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-poppins font-extrabold text-white mt-2 mb-2 leading-tight"
    style={{ fontSize: 'clamp(1.75rem, 4.2vw, 2.5rem)' }}>
    {children}
  </h2>
);
const Rule = () => (
  <div className="w-10 h-0.5 mb-7 mt-1" style={{ background: 'linear-gradient(90deg,#1d70a2,#00bfa5)' }} />
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const VerticalServicesFase2Proposal = () => (
  <div id="proposal-root" className="min-h-screen overflow-x-hidden" style={{ background: '#030d1a', fontFamily: 'Lato, sans-serif' }}>

    {/* ══════════ PORTADA */}
    <header className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #010408 0%, #020810 55%, #030d1a 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,.07) 0%, transparent 65%)' }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
      </div>

      <div className="relative z-10 flex items-center gap-5 px-5 sm:px-8 md:px-12 py-6 border-b" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white">
            <img src="/sixteam-logo.png" alt="Sixteam.pro" className="w-full h-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <span className="hidden sm:inline font-poppins font-black text-white text-xl tracking-tight">Sixteam<span className="text-[#00bfa5]">.</span>pro</span>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <img src="/vertical-logo.avif" alt="Vertical Services" className="h-10 w-auto object-contain"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 md:px-10 pt-16 pb-20">
        <TagLabel>Propuesta comercial · Siguiente paso</TagLabel>
        <h1 className="font-poppins font-black text-white leading-[1.05] mt-4 mb-5"
          style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.25rem)' }}>
          Del primer contacto<br />
          <span style={{ background: `linear-gradient(90deg,#1d70a2,${VS_BLUE},#00bfa5)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            a la cotización
          </span>
        </h1>
        <p className="font-lato text-white/60 text-[19px] leading-relaxed max-w-2xl mb-8">
          Un <strong className="text-white/90">último envío de correo</strong> enfocado en conversión y una primera <strong className="text-white/90">campaña de pauta en Meta Ads</strong> para Vertical Services.
        </p>
        <div className="flex flex-wrap gap-2">
          {[{ icon: Calendar, text: META.fecha }, { icon: MapPin, text: META.lugar }].map((chip, i) => {
            const Icon = chip.icon;
            return (
              <div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[15px] text-white/60"
                style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                <Icon className="w-3.5 h-3.5 text-[#00bfa5]" /> {chip.text}
              </div>
            );
          })}
        </div>
      </div>
    </header>

    {/* ══════════ CONTENIDO */}
    <main className="max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-16 space-y-20">

      {/* ─ 01 SIGUIENTE PASO ─ */}
      <section id="contexto">
        <TagLabel>01 · El siguiente paso</TagLabel>
        <SectionTitle>Lo que nos dejó la primera etapa</SectionTitle>
        <Rule />
        <p className="font-lato text-white/65 text-[19px] leading-relaxed mb-8">
          Ya acompañamos a Vertical Services con las <strong className="text-white/90 font-semibold">campañas de email marketing</strong> y el manejo técnico de su <strong className="text-white/90 font-semibold">base de datos</strong>. Con lo aprendido, el siguiente paso es convertir ese alcance en <strong className="text-white/90 font-semibold">visitas de cotización</strong>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {APRENDIZAJES.map((a, i) => (
            <div key={i} className="rounded-xl p-5"
              style={{ background: 'rgba(59,130,246,.06)', border: '1px solid rgba(59,130,246,.18)' }}>
              <p className="font-poppins font-semibold text-white/90 text-[17px] mb-2 leading-snug">{a.titulo}</p>
              <p className="font-lato text-white/55 text-[16px] leading-relaxed"><Rich text={a.desc} /></p>
            </div>
          ))}
        </div>
      </section>

      {/* ─ 02 ALCANCE ─ */}
      <section id="alcance">
        <TagLabel>02 · Alcance</TagLabel>
        <SectionTitle>Qué incluye</SectionTitle>
        <Rule />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {FRENTES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.num} className="rounded-2xl p-6"
                style={{ background: 'rgba(255,255,255,.03)', border: `1px solid ${f.color}40` }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${f.color}1f` }}>
                    <Icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <div>
                    <p className="font-poppins font-bold text-white text-[18px] leading-tight">{f.nombre}</p>
                    <p className="font-lato text-white/40 text-[14px] mt-0.5">{f.sub}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {f.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: f.color }} />
                      <span className="font-lato text-white/65 text-[16px] leading-snug"><Rich text={item} /></span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-4">Cómo trabajamos</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ROLES.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={i} className="rounded-xl p-5"
                style={{ background: `${r.color}0d`, border: `1px solid ${r.color}33` }}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-4 h-4" style={{ color: r.color }} />
                  <p className="font-poppins font-bold text-white/90 text-[16px]">{r.quien}</p>
                </div>
                <ul className="space-y-1.5">
                  {r.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: r.color }} />
                      <span className="font-lato text-white/60 text-[15px] leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─ 03 INVERSIÓN ─ */}
      <section id="inversion">
        <TagLabel>03 · Inversión</TagLabel>
        <SectionTitle>Un valor mensual</SectionTitle>
        <Rule />

        <div className="rounded-2xl p-6 sm:p-8 mb-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(0,191,165,.10) 0%, rgba(3,13,26,.9) 100%)', border: '1px solid rgba(0,191,165,.3)' }}>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <p className="font-lato text-white/40 text-[13px] uppercase tracking-widest mb-3">Email marketing + Meta Ads</p>
              <p className="font-poppins font-black text-white leading-none" style={{ fontSize: 'clamp(2.25rem, 6vw, 3.25rem)' }}>
                {META.inversion}
              </p>
              <p className="font-lato text-[#00bfa5] text-[16px] mt-2">por mes + IVA</p>
            </div>
            <ul className="space-y-1.5 sm:text-right">
              {['Apoyo en el envío de la campaña de email marketing restante', 'Montaje y seguimiento de pauta en Meta Ads', 'Plataforma Sixteam.pro con su base de datos', 'Informe de resultados'].map((t, i) => (
                <li key={i} className="font-lato text-white/60 text-[15px] flex sm:justify-end items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#00bfa5] flex-shrink-0 sm:order-2" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-4">Formas de pago</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {FORMAS_PAGO.map((f, i) => (
            <div key={i} className="rounded-xl p-5 relative"
              style={{ background: `${f.color}0d`, border: `1px solid ${f.color}40` }}>
              {f.badge && (
                <span className="absolute top-4 right-4 font-lato text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider"
                  style={{ background: `${f.color}26`, border: `1px solid ${f.color}59`, color: f.color }}>
                  {f.badge}
                </span>
              )}
              <p className="font-poppins font-bold text-white/90 text-[17px] mb-1 pr-24">{f.nombre}</p>
              <p className="font-lato text-white/50 text-[15px] mb-4">{f.desc}</p>
              <ul className="space-y-1.5">
                {f.filas.map((r, j) => (
                  <li key={j} className="flex items-center justify-between gap-2">
                    <span className="font-lato text-white/55 text-[15px]">{r.label}</span>
                    <span className="font-poppins font-bold text-white/85 text-[15px] flex-shrink-0">{r.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {CONDICIONES.map((c, i) => (
            <div key={i} className="rounded-xl p-4 sm:p-5 flex gap-3"
              style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
              <Info className="w-4 h-4 text-[#00bfa5] flex-shrink-0 mt-1" />
              <div>
                <p className="font-poppins font-semibold text-white/85 text-[17px] mb-1">{c.titulo}</p>
                <p className="font-lato text-white/55 text-[16px] leading-relaxed"><Rich text={c.desc} /></p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-14 rounded-2xl p-6 sm:p-8 text-center"
          style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
          <p className="font-poppins font-black text-white text-[20px] tracking-tight mb-1">Sixteam<span className="text-[#00bfa5]">.</span>pro</p>
          <p className="font-lato text-white/35 text-[14px] mb-4">Innovación y Estrategia Digital S.A.S.</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[14px] text-white/35 font-lato">
            <span>NIT {META.nit}</span>
            <span>·</span>
            <span>{META.correo}</span>
            <span>·</span>
            <span>RL: {META.rl}</span>
          </div>
          <p className="font-lato text-white/20 text-[13px] mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
            Process + Technology + People = Growth · {META.fecha} · Uso confidencial
          </p>
        </div>
      </section>

    </main>
  </div>
);

export default VerticalServicesFase2Proposal;
