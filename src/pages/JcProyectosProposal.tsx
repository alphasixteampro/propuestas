import React from 'react';
import {
  CheckCircle, Info, Calendar, MapPin, Compass, Plug, Hammer, RefreshCw, PlayCircle, Star,
} from 'lucide-react';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const META = {
  cliente: 'JC Proyectos',
  fecha: 'Octubre 2026',
  lugar: 'México',
  nit: '901.967.849-4',
  correo: 'alpha@sixteam.pro',
  rl: 'Samuel Armando Burgos Ferrer',
  elaboradaPor: 'Ernesto Hernández',
  cargo: 'Gerente Comercial Sixteam.pro',
};

const JC_BLUE = '#3b6fe0';

// Lo que Jorge dijo en la reunión del 14 de octubre
const LO_QUE_BUSCA = [
  { cita: '"Lo que quiero es yo aprender a crear mi sistema."', desc: 'No recibir un sistema hecho por un tercero, sino **aprender a construirlo** y perfeccionarlo.' },
  { cita: '"Quiero ir desde que inicia la ola."', desc: 'Empezar **desde cero**, con bases que usted y su equipo entiendan.' },
  { cita: '"Cerrar los círculos haciendo los skills correctos."', desc: 'Unir lo que ya hacen con IA para **no alimentarla tarea por tarea**.' },
  { cita: '"Nos generaba más trabajo que hacerlo."', desc: 'Las plataformas genéricas no conocen la obra. La solución debe nacer de **su operación**.' },
];

const RUTA = [
  {
    num: '01',
    titulo: 'Conocer las herramientas',
    desc: 'Qué hace bien **Claude, ChatGPT, Gemini y Copilot**, sus ventajas y límites, y cuál conviene para cada tarea.',
    icon: Compass,
  },
  {
    num: '02',
    titulo: 'Conectar',
    desc: 'Enlazar la IA con **Excel, el correo y la suite de Microsoft** para que trabaje con su información real.',
    icon: Plug,
  },
  {
    num: '03',
    titulo: 'Construir',
    desc: 'Crear las instrucciones y skills para la **gestión de materiales** (pedido, compra, recepción y presupuesto) y la **gestión de personal** (asistencia y nómina).',
    icon: Hammer,
  },
  {
    num: '04',
    titulo: 'Cerrar el círculo',
    desc: 'Unir las tareas en un solo flujo, montar **agentes que trabajen solos** y aprender a corregir cuando algo falla.',
    icon: RefreshCw,
  },
];

const PLANES = [
  {
    nombre: 'Plan Reducido',
    horas: '10 horas · ciclo de 1 mes',
    precio: 'USD 599',
    periodo: 'por ciclo de 1 mes',
    antes: '',
    color: JC_BLUE,
    recomendado: false,
    items: [
      'Un frente a la vez: **materiales o personal**',
      'Sesiones en vivo de 1 a 2 veces por semana',
      'Ideal para arrancar a su propio ritmo',
    ],
  },
  {
    nombre: 'Plan Completo',
    horas: '20 horas · ciclo de 6 semanas',
    precio: 'USD 999',
    periodo: 'por ciclo de 6 semanas',
    antes: 'USD 1.200',
    color: '#00bfa5',
    recomendado: true,
    items: [
      '**Materiales y personal** en el mismo ciclo',
      'Sesiones en vivo de 2 veces por semana',
      'El tiempo que estimamos para construir **todo el proceso**',
    ],
  },
];

// Valores por plan: [Reducido, Completo]
const PAGOS = [
  { label: '50 % al iniciar el ciclo', valores: ['USD 299,50', 'USD 499,50'] },
  { label: '50 % al finalizar el ciclo', valores: ['USD 299,50', 'USD 499,50'] },
  { label: 'Pago anticipado del total (5 % de descuento)', valores: ['USD 569,05', 'USD 949,05'], destacado: true },
];

const CONDICIONES = [
  { titulo: 'Horas no usadas', desc: 'Las horas que no se usen en un ciclo **no se pierden**: se acumulan para el siguiente ciclo de aprendizaje y activación de funcionalidades.' },
  { titulo: 'Lo construido es suyo', desc: 'Todo queda en **las cuentas de JC Proyectos**: instrucciones, skills, conexiones y agentes. Usted decide qué se mantiene y qué se mejora.' },
  { titulo: 'Qué no incluye', desc: 'Las **suscripciones a las herramientas de IA** (Claude, ChatGPT u otras) y a Microsoft 365 las contrata y paga JC Proyectos directamente.' },
  { titulo: 'Inicio', desc: 'El acompañamiento inicia con la aprobación de la propuesta y el primer pago. Proponemos arrancar en **noviembre de 2026**. Los pagos se realizan por transferencia bancaria.' },
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

const JcProyectosProposal = () => (
  <div id="proposal-root" className="min-h-screen overflow-x-hidden" style={{ background: '#030d1a', fontFamily: 'Lato, sans-serif' }}>

    {/* ══════════ PORTADA */}
    <header className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #010408 0%, #020810 55%, #030d1a 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,111,224,.08) 0%, transparent 65%)' }} />
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
        <div className="bg-white rounded-lg px-3 py-2">
          <img src="/jc-proyectos-logo.png" alt="JC Proyectos" className="h-6 sm:h-7 w-auto object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 md:px-10 pt-16 pb-20">
        <TagLabel>Propuesta comercial · Acompañamiento en IA</TagLabel>
        <h1 className="font-poppins font-black text-white leading-[1.05] mt-4 mb-5"
          style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.25rem)' }}>
          Construya su propio sistema<br />
          <span style={{ background: `linear-gradient(90deg,#1d70a2,${JC_BLUE},#00bfa5)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            con inteligencia artificial
          </span>
        </h1>
        <p className="font-lato text-white/60 text-[19px] leading-relaxed max-w-2xl mb-8">
          Un profesional de Sixteam.pro guía a JC Proyectos para que <strong className="text-white/90">ustedes mismos construyan</strong> la gestión de <strong className="text-white/90">materiales</strong> y de <strong className="text-white/90">personal</strong> de sus obras.
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

      {/* ─ 01 LO QUE BUSCA ─ */}
      <section id="contexto">
        <TagLabel>01 · Lo que nos dijo</TagLabel>
        <SectionTitle>Aprender a hacerlo, no recibirlo hecho</SectionTitle>
        <Rule />
        <p className="font-lato text-white/65 text-[19px] leading-relaxed mb-8">
          La demo mostró lo que se puede lograr en <strong className="text-white/90 font-semibold">materiales</strong>, desde el pedido en obra hasta su impacto en el presupuesto, y en <strong className="text-white/90 font-semibold">nómina y personal</strong>. Sin embargo, lo que JC Proyectos necesita es otra cosa:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {LO_QUE_BUSCA.map((a, i) => (
            <div key={i} className="rounded-xl p-5"
              style={{ background: 'rgba(59,111,224,.06)', border: '1px solid rgba(59,111,224,.2)' }}>
              <p className="font-poppins font-semibold text-white/90 text-[17px] mb-2 leading-snug italic">{a.cita}</p>
              <p className="font-lato text-white/55 text-[16px] leading-relaxed"><Rich text={a.desc} /></p>
            </div>
          ))}
        </div>
        <a href="/jc-proyectos/demo" target="_blank" rel="noreferrer"
          className="no-print inline-flex items-center gap-2 px-4 py-2 rounded-lg font-lato text-[15px] text-[#00bfa5] hover:bg-[#00bfa5]/10 transition-colors"
          style={{ border: '1px solid rgba(0,191,165,.35)' }}>
          <PlayCircle className="w-4 h-4" /> Volver a ver la demo
        </a>
      </section>

      {/* ─ 02 ACOMPAÑAMIENTO ─ */}
      <section id="acompanamiento">
        <TagLabel>02 · El acompañamiento</TagLabel>
        <SectionTitle>Su equipo construye, nosotros guiamos</SectionTitle>
        <Rule />
        <p className="font-lato text-white/65 text-[19px] leading-relaxed mb-8">
          Sesiones <strong className="text-white/90 font-semibold">en vivo</strong> con usted y su equipo, con la demo como punto de partida. Cada sesión deja algo <strong className="text-white/90 font-semibold">funcionando</strong> y la capacidad de repetirlo sin nosotros.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {RUTA.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.num} className="rounded-2xl p-6"
                style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,191,165,.12)' }}>
                    <Icon className="w-5 h-5 text-[#00bfa5]" />
                  </div>
                  <div>
                    <p className="font-lato text-white/35 text-[13px] tracking-wider">PASO {r.num}</p>
                    <p className="font-poppins font-bold text-white text-[18px] leading-tight">{r.titulo}</p>
                  </div>
                </div>
                <p className="font-lato text-white/60 text-[16px] leading-relaxed"><Rich text={r.desc} /></p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─ 03 INVERSIÓN ─ */}
      <section id="inversion">
        <TagLabel>03 · Inversión</TagLabel>
        <SectionTitle>Un paquete de horas por ciclo</SectionTitle>
        <Rule />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {PLANES.map((p, i) => (
            <div key={i} className="rounded-2xl p-6 sm:p-7 relative overflow-hidden"
              style={{
                background: p.recomendado ? 'linear-gradient(135deg, rgba(0,191,165,.10) 0%, rgba(3,13,26,.9) 100%)' : 'rgba(255,255,255,.03)',
                border: `1px solid ${p.color}${p.recomendado ? '59' : '40'}`,
              }}>
              {p.recomendado && (
                <span className="absolute top-5 right-5 inline-flex items-center gap-1 font-lato text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(0,191,165,.15)', border: '1px solid rgba(0,191,165,.35)', color: '#00bfa5' }}>
                  <Star className="w-3 h-3" /> Recomendado
                </span>
              )}
              <p className="font-poppins font-bold text-white/90 text-[19px] mb-1 pr-28">{p.nombre}</p>
              <p className="font-lato text-[15px] mb-5" style={{ color: p.color }}>{p.horas}</p>
              {p.antes && (
                <p className="font-lato text-white/35 text-[16px] line-through mb-1">{p.antes}</p>
              )}
              <p className="font-poppins font-black text-white leading-none" style={{ fontSize: 'clamp(2.25rem, 6vw, 3rem)' }}>
                {p.precio}
              </p>
              <p className="font-lato text-white/45 text-[15px] mt-2 mb-6">{p.periodo}</p>
              <ul className="space-y-2.5">
                {p.items.map((t, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: p.color }} />
                    <span className="font-lato text-white/65 text-[16px] leading-snug"><Rich text={t} /></span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="font-poppins font-semibold text-white/50 text-[13px] uppercase tracking-wider mb-4">Forma de pago</p>
        <div className="rounded-xl overflow-hidden mb-8" style={{ border: '1px solid rgba(255,255,255,.08)' }}>
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 sm:gap-x-10 px-4 sm:px-6 py-3"
            style={{ background: 'rgba(255,255,255,.04)' }}>
            <span />
            <span className="font-poppins font-semibold text-white/60 text-[13px] text-right">Reducido</span>
            <span className="font-poppins font-semibold text-[#00bfa5] text-[13px] text-right">Completo</span>
          </div>
          {PAGOS.map((r, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-x-4 sm:gap-x-10 items-center px-4 sm:px-6 py-3.5 border-t"
              style={{ borderColor: 'rgba(255,255,255,.06)', background: r.destacado ? 'rgba(0,191,165,.06)' : 'transparent' }}>
              <span className={`font-lato text-[15px] ${r.destacado ? 'text-[#00bfa5]' : 'text-white/60'}`}>{r.label}</span>
              {r.valores.map((v, j) => (
                <span key={j} className="font-poppins font-bold text-white/85 text-[15px] text-right whitespace-nowrap">{v}</span>
              ))}
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
          <p className="font-lato text-white/50 text-[14px] mt-3">
            Propuesta elaborada por: <strong className="text-white/80 font-semibold">{META.elaboradaPor}</strong> · {META.cargo}
          </p>
          <p className="font-lato text-white/20 text-[13px] mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
            Process + Technology + People = Growth · {META.fecha} · Uso confidencial
          </p>
        </div>
      </section>

    </main>
  </div>
);

export default JcProyectosProposal;
