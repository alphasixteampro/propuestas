import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, TrendingUp, BarChart3, Globe,
  Users, Database, AlertCircle, Zap, Monitor, MessageSquare,
  FileText, Mail, Plane, MapPin, CheckCircle, ArrowRight, X, Clock,
  PhoneOff, Eye, Bot, DollarSign, Shield, Unlock, Settings, Compass,
} from 'lucide-react';

const ANATO_ORANGE = '#e8540a';

const SLIDES = [
  { id: 'cover'          },
  { id: 'contexto'       },
  { id: 'ia-crecimiento' }, // IA, ventas que vienen y competencia
  { id: 'problema'       },
  { id: 'impacto'        },
  { id: 'propuesta'      },
  { id: 'servicios'      },
  { id: 'precios'        },
  { id: 'piloto'         },
  { id: 'porque'         },
  { id: 'proximos'       },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const SlideTag = ({ children }: { children: React.ReactNode }) => (
  <span className="font-lato text-[#00bfa5] text-[13px] uppercase tracking-[0.22em] font-medium">{children}</span>
);

const SlideLayout = ({ tag, title, children }: { tag: string; title: string; children: React.ReactNode }) => (
  <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-16 max-w-5xl mx-auto w-full overflow-y-auto py-8"
    style={{ background: '#030d1a' }}>
    <SlideTag>{tag}</SlideTag>
    <h2 className="font-poppins font-black text-white mt-3"
      style={{ fontSize: 'clamp(1.7rem, 4vw, 3rem)', lineHeight: 1.1 }}>
      {title}
    </h2>
    {children}
  </div>
);

const Slide = ({ active, children }: { active: boolean; children: React.ReactNode }) => (
  <div className={`absolute inset-0 transition-all duration-500 ${active ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    style={{ paddingBottom: 72 }}>
    {children}
  </div>
);

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const AnatoDeck = () => {
  const [current, setCurrent] = useState(0);
  const total = SLIDES.length;

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(total - 1, c + 1));

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: '#030d1a', fontFamily: 'Lato, sans-serif' }}>
      <div className="relative" style={{ height: '100vh' }}>

        {/* ── 1. COVER ── */}
        <Slide active={current === 0}>
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #04111f 0%, #071826 60%, #091f34 100%)' }}>
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
              style={{ background: `radial-gradient(circle, rgba(232,84,10,.06) 0%, transparent 65%)` }} />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(29,112,162,.05) 0%, transparent 70%)', transform: 'translate(-20%,20%)' }} />
            <div className="absolute inset-0 opacity-[0.02]"
              style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
            <div className="flex items-center gap-6 mb-10">
              <img src="/sixteam-logo.png" alt="Sixteam.pro" className="h-16 w-auto object-contain"
                style={{ filter: 'drop-shadow(0 4px 20px rgba(0,191,165,.5))' }} />
              <div className="flex items-center justify-center w-12 h-12 rounded-full"
                style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)' }}>
                <span className="font-poppins font-black text-white/40 text-[22px]">×</span>
              </div>
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl overflow-hidden"
                style={{ background: `rgba(232,84,10,.12)`, border: `1px solid rgba(232,84,10,.3)` }}>
                <img src="/logo-web-anato-1-1.png" alt="ANATO" className="w-full h-full object-contain p-2"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(232,84,10,.3))' }} />
              </div>
            </div>
            <p className="font-lato text-[#00bfa5] text-[14px] uppercase tracking-[0.25em] mb-4">Propuesta de alianza estratégica</p>
            <h1 className="font-poppins font-black text-white mb-3" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1 }}>
              Sixteam.pro
              <span className="block"
                style={{ background: `linear-gradient(90deg, ${ANATO_ORANGE}, #f4700f)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                × ANATO
              </span>
            </h1>
            <p className="font-lato text-white/45 text-[20px] mt-4">Seccional Central · Bogotá · Abril 2026</p>
            <p className="font-lato text-white/25 text-[16px] mt-8">Usa ← → o las flechas para navegar</p>
          </div>
        </Slide>

        {/* ── 2. CONTEXTO ── */}
        <Slide active={current === 1}>
          <SlideLayout tag="Contexto" title="El turismo colombiano está en su mejor momento">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { val: '30%',      label: 'Crecimiento del sector turismo · 2024',      icon: TrendingUp },
                { val: '+$6.000M', label: 'Millones USD en reservas de agencias · 2024', icon: BarChart3  },
                { val: '48%',      label: 'De reservas ya ocurren digitalmente',         icon: Globe      },
                { val: '134%',     label: 'Crecimiento ANATO Capacita Tech',             icon: Users      },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="rounded-2xl p-6 flex flex-col gap-3"
                    style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                    <Icon className="w-5 h-5 text-[#00bfa5]" />
                    <p className="font-poppins font-black text-white" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>{s.val}</p>
                    <p className="font-lato text-white/45 text-[15px] leading-snug">{s.label}</p>
                  </div>
                );
              })}
            </div>
            <p className="font-lato text-white/50 text-[18px] leading-relaxed mt-6">
              Las agencias ANATO crecen. El 70% reporta expansión activa en 2026. Pero <strong className="text-white/75">el mercado ya premia la velocidad, la disponibilidad y la personalización</strong> — y eso solo se logra con tecnología.
            </p>
          </SlideLayout>
        </Slide>

        {/* ── 3. IA, CRECIMIENTO Y COMPETENCIA ── */}
        <Slide active={current === 2}>
          <SlideLayout tag="La ola que viene" title="Cuatro razones por las que este es el momento">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

              {/* IA */}
              <div className="rounded-2xl p-5 flex gap-4 relative overflow-hidden"
                style={{ background: 'rgba(139,92,246,.07)', border: '1px solid rgba(139,92,246,.2)' }}>
                <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(139,92,246,.1), transparent)', transform: 'translate(20%,-20%)' }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(139,92,246,.15)', border: '1px solid rgba(139,92,246,.3)' }}>
                  <Bot className="w-5 h-5" style={{ color: '#a78bfa' }} />
                </div>
                <div>
                  <p className="font-poppins font-black text-[#a78bfa] text-[19px] mb-0.5 leading-tight">De 2 días a 1 minuto</p>
                  <p className="font-lato text-white/30 text-[11px] uppercase tracking-wider mb-2">La IA ya transformó el turismo</p>
                  <p className="font-lato text-white/60 text-[15px] leading-relaxed">
                    El viajero de 2026 quiere cotizaciones al instante. <strong className="text-white/80">La IA reduce el tiempo de respuesta de días a minutos.</strong> Las agencias que no automaticen pierden ese cliente antes de poder contestar.
                  </p>
                  <p className="font-lato text-white/25 text-[12px] mt-2 italic">ANATO identificó la IA como principal desafío del sector 2025–2026</p>
                </div>
              </div>

              {/* Crecimiento / Ventas */}
              <div className="rounded-2xl p-5 flex gap-4 relative overflow-hidden"
                style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.2)' }}>
                <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(0,191,165,.1), transparent)', transform: 'translate(20%,-20%)' }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(0,191,165,.15)', border: '1px solid rgba(0,191,165,.3)' }}>
                  <DollarSign className="w-5 h-5 text-[#00bfa5]" />
                </div>
                <div>
                  <p className="font-poppins font-black text-[#00bfa5] text-[19px] mb-0.5 leading-tight">USD 11.344M en 2025</p>
                  <p className="font-lato text-white/30 text-[11px] uppercase tracking-wider mb-2">Las ventas del sector no paran</p>
                  <p className="font-lato text-white/60 text-[15px] leading-relaxed">
                    Más viajeros buscando paquetes que nunca. <strong className="text-white/80">Las agencias sin tecnología no pueden manejar ese volumen sin contratar más gente.</strong> Las que automatizan escalan sin crecer en costo.
                  </p>
                  <p className="font-lato text-white/25 text-[12px] mt-2 italic">70% de agencias ANATO reportan crecimiento activo en Q1 2026</p>
                </div>
              </div>

              {/* Competencia */}
              <div className="rounded-2xl p-5 flex gap-4 relative overflow-hidden"
                style={{ background: `rgba(232,84,10,.06)`, border: `1px solid rgba(232,84,10,.2)` }}>
                <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none"
                  style={{ background: `radial-gradient(circle, rgba(232,84,10,.1), transparent)`, transform: 'translate(20%,-20%)' }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `rgba(232,84,10,.15)`, border: `1px solid rgba(232,84,10,.3)` }}>
                  <Shield className="w-5 h-5" style={{ color: ANATO_ORANGE }} />
                </div>
                <div>
                  <p className="font-poppins font-black text-[19px] mb-0.5 leading-tight" style={{ color: ANATO_ORANGE }}>La competencia ya llegó con IA</p>
                  <p className="font-lato text-white/30 text-[11px] uppercase tracking-wider mb-2">Competir o perder terreno</p>
                  <p className="font-lato text-white/60 text-[15px] leading-relaxed">
                    Booking, Despegar y Airbnb tienen bots 24/7. Las agencias informales compiten por WhatsApp sin estructura. <strong className="text-white/80">La ventaja de la agencia formal solo se defiende con tecnología.</strong> Sin ella, esa ventaja se erosiona cada año.
                  </p>
                </div>
              </div>

              {/* Democratización */}
              <div className="rounded-2xl p-5 flex gap-4 relative overflow-hidden"
                style={{ background: 'rgba(251,191,36,.06)', border: '1px solid rgba(251,191,36,.2)' }}>
                <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(251,191,36,.1), transparent)', transform: 'translate(20%,-20%)' }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(251,191,36,.15)', border: '1px solid rgba(251,191,36,.3)' }}>
                  <Unlock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="font-poppins font-black text-amber-400 text-[19px] mb-0.5 leading-tight">Antes COP 15–25M/mes. Hoy accesible.</p>
                  <p className="font-lato text-white/30 text-[11px] uppercase tracking-wider mb-2">Democratización tecnológica</p>
                  <p className="font-lato text-white/60 text-[15px] leading-relaxed">
                    Armar esto solo requiere: desarrollador web + agencia de pauta + consultor CRM + especialista en automatización. Cada uno cobrando por separado, sin integración. <strong className="text-white/80">Un costo que la mayoría de agencias no puede sostener.</strong> Sixteam entrega todo eso unificado — y el gerente no necesita saber de tecnología. Para eso estamos nosotros.
                  </p>
                </div>
              </div>

            </div>

            {/* Conclusión del slide */}
            <div className="mt-3 rounded-xl p-3.5 flex items-center gap-3"
              style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
              <TrendingUp className="w-4 h-4 text-[#00bfa5] flex-shrink-0" />
              <p className="font-lato text-white/50 text-[15px]">
                La pregunta no es <em className="text-white/70 not-italic font-semibold">si</em> las agencias deben adoptar tecnología —
                es <em className="text-white/70 not-italic font-semibold">cuándo</em> y <em className="text-white/70 not-italic font-semibold">con quién</em>.
              </p>
            </div>
          </SlideLayout>
        </Slide>

        {/* ── 4. PROBLEMA ── */}
        <Slide active={current === 3}>
          <SlideLayout tag="El reto operativo" title="La mayoría de agencias opera sin infraestructura tecnológica">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {[
                { icon: Database,    color: '#fbbf24', bg: 'rgba(251,191,36,.07)', border: 'rgba(251,191,36,.18)', titulo: '"Sin datos no hay IA"',          desc: 'Sin historial del cliente viajero, ninguna automatización puede funcionar. — ANATO Capacita Tech 2026' },
                { icon: AlertCircle, color: '#f87171', bg: 'rgba(221,51,51,.07)',  border: 'rgba(221,51,51,.2)',   titulo: 'Operación desconectada',         desc: 'WhatsApp, Excel y llamadas como silos. Los prospectos se pierden entre canales.' },
                { icon: Zap,         color: '#60a5fa', bg: 'rgba(96,165,250,.07)', border: 'rgba(96,165,250,.18)', titulo: 'Respuesta lenta',                desc: 'Las OTAs responden en segundos. La disponibilidad manual no compite.' },
                { icon: Monitor,     color: '#00bfa5', bg: 'rgba(0,191,165,.07)',  border: 'rgba(0,191,165,.18)',  titulo: 'Presencia digital mínima',       desc: 'Sin web actualizada ni pixel ni campañas. El mercado se mueve en línea.' },
              ].map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="rounded-xl p-5 flex gap-4"
                    style={{ background: p.bg, border: `1px solid ${p.border}` }}>
                    <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: p.color }} />
                    <div>
                      <p className="font-poppins font-bold text-white/90 text-[18px] mb-1">{p.titulo}</p>
                      <p className="font-lato text-white/55 text-[16px] leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </SlideLayout>
        </Slide>

        {/* ── 5. IMPACTO ── */}
        <Slide active={current === 4}>
          <SlideLayout tag="Por qué es urgente" title="Lo que le cuesta a una agencia no tener tecnología hoy">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="rounded-2xl p-6 relative overflow-hidden"
                style={{ background: 'rgba(221,51,51,.06)', border: '1px solid rgba(221,51,51,.2)' }}>
                <div className="absolute top-3 right-3"><PhoneOff className="w-5 h-5 text-red-400/30" /></div>
                <p className="font-poppins font-black text-red-400 mb-2" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)' }}>El primero que responde, vende</p>
                <p className="font-lato text-white/60 text-[17px] leading-relaxed">Una consulta llega el domingo a las 9pm. Sin respuesta esa noche, el prospecto llama a otra agencia el lunes. <strong className="text-white/80">La velocidad es el diferenciador #1 en turismo.</strong> Con Sixteam Inbox +IA, responde en segundos — 24/7.</p>
              </div>
              <div className="rounded-2xl p-6 relative overflow-hidden"
                style={{ background: 'rgba(251,191,36,.06)', border: '1px solid rgba(251,191,36,.18)' }}>
                <div className="absolute top-3 right-3"><X className="w-5 h-5 text-amber-400/30" /></div>
                <p className="font-poppins font-black text-amber-400 mb-2" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)' }}>Leads sin seguimiento = dinero perdido</p>
                <p className="font-lato text-white/60 text-[17px] leading-relaxed">Sin CRM, no hay seguimiento. <strong className="text-white/80">La mayoría de ventas en turismo ocurren en el segundo o tercer contacto</strong> — y sin automatización, ese contacto no pasa.</p>
              </div>
              <div className="rounded-2xl p-6 relative overflow-hidden"
                style={{ background: 'rgba(96,165,250,.06)', border: '1px solid rgba(96,165,250,.18)' }}>
                <div className="absolute top-3 right-3"><Eye className="w-5 h-5 text-blue-400/30" /></div>
                <p className="font-poppins font-black text-blue-400 mb-2" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)' }}>48% del mercado no te ve</p>
                <p className="font-lato text-white/60 text-[17px] leading-relaxed">El 48% de reservas ya pasa por digital (ANATO 2024). <strong className="text-white/80">Sin web profesional ni pauta activa, eres invisible para casi la mitad del mercado.</strong></p>
              </div>
              <div className="rounded-2xl p-6 relative overflow-hidden"
                style={{ background: 'rgba(0,191,165,.06)', border: '1px solid rgba(0,191,165,.18)' }}>
                <div className="absolute top-3 right-3"><Clock className="w-5 h-5 text-teal-400/30" /></div>
                <p className="font-poppins font-black text-[#00bfa5] mb-2" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)' }}>Sin historial, no hay cliente fiel</p>
                <p className="font-lato text-white/60 text-[17px] leading-relaxed">La agencia que no sabe que María viajó a Cartagena nunca le ofrecerá el plan de aniversario. <strong className="text-white/80">La fidelización depende de conocer al cliente — y eso solo ocurre con CRM.</strong></p>
              </div>
            </div>
          </SlideLayout>
        </Slide>

        {/* ── 6. LA PROPUESTA ── */}
        <Slide active={current === 5}>
          <SlideLayout tag="La alianza" title="El equipo de transformación digital que las agencias no tienen">
            <p className="font-lato text-white/55 text-[18px] leading-relaxed mt-3 mb-5">
              Sixteam no es un proveedor de software. Es el área de tecnología de la agencia: diseña la estrategia, implementa las herramientas y las sostiene. <strong className="text-white/80">El dueño sigue haciendo lo que sabe — turismo. La tecnología es nuestra responsabilidad.</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { quien: 'Agencias afiliadas',       bg: `rgba(232,84,10,.06)`, border: `rgba(232,84,10,.2)`, color: ANATO_ORANGE, icon: Users,      desc: 'Acceso a un equipo de transformación digital completo, con 25% de descuento exclusivo ANATO — sin necesitar área de TI propia.' },
                { quien: 'ANATO Seccional Central',  bg: 'rgba(0,191,165,.06)', border: 'rgba(0,191,165,.22)', color: '#00bfa5',    icon: FileText,   desc: 'Convierte la membresía en acceso a transformación digital real. Un beneficio tangible y diferenciador para sus afiliadas — sin costo para el gremio.' },
                { quien: 'Sixteam.pro',              bg: 'rgba(29,112,162,.07)', border: 'rgba(29,112,162,.2)', color: '#1d70a2',   icon: TrendingUp, desc: 'Acceso a 720+ agencias calificadas del sector turismo, con el respaldo y la credibilidad del gremio más representativo de Colombia.' },
              ].map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} className="rounded-2xl p-6 flex flex-col gap-4"
                    style={{ background: b.bg, border: `1px solid ${b.border}` }}>
                    <Icon className="w-6 h-6" style={{ color: b.color }} />
                    <p className="font-poppins font-bold text-white/85 text-[19px]">{b.quien}</p>
                    <p className="font-lato text-white/55 text-[16px] leading-relaxed">{b.desc}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 rounded-2xl p-4 flex items-center gap-4"
              style={{ background: `rgba(232,84,10,.06)`, border: `1px solid rgba(232,84,10,.2)` }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: `rgba(232,84,10,.15)`, border: `1px solid rgba(232,84,10,.3)` }}>
                <span className="font-poppins font-black text-[22px]" style={{ color: ANATO_ORANGE }}>25%</span>
              </div>
              <p className="font-poppins font-bold text-white/80 text-[19px]">Descuento exclusivo sobre todo el portafolio · Transformación digital accesible para cada agencia afiliada</p>
            </div>
          </SlideLayout>
        </Slide>

        {/* ── 7. SERVICIOS ── */}
        <Slide active={current === 6}>
          <SlideLayout tag="Portafolio" title="El sistema operativo digital completo de tu agencia">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
              {[
                { icon: BarChart3,     titulo: 'CRM + Chat Center',               desc: 'Pipeline de ventas, historial del viajero y chat omnicanal (WhatsApp, IG, FB, Web) en una sola plataforma. Todo incluido.' },
                { icon: Bot,           titulo: 'Bot con IA · Chat Center',         desc: 'Add-on de IA sobre el chat center: el bot aprende tu catálogo y responde consultas 24/7, derivando al asesor cuando hace falta.' },
                { icon: Monitor,       titulo: 'Sitio Web para la Agencia',        desc: 'Diseño profesional con catálogo de destinos, formularios conectados al CRM y analíticas. Visible en Google y en redes.' },
                { icon: TrendingUp,    titulo: 'Gestión de Pauta Digital',         desc: 'Meta Ads con embudo completo para captar viajeros. Cada peso de pauta se convierte en un lead trazado en el CRM.' },
                { icon: Mail,          titulo: 'Email Marketing',                  desc: '10.000 correos/mes incluidos. Reactivación, promociones de temporada y seguimiento post-viaje con plantillas para turismo.' },
                { icon: Settings,      titulo: 'Soporte y Operaciones',            desc: 'Horas mensuales dedicadas a ajustes, mantenimiento y soporte técnico prioritario con tiempo de respuesta garantizado.' },
                { icon: Compass,       titulo: 'Consultoría Estratégica',          desc: 'Asesoría directa de un especialista Sixteam para diagnóstico, priorización y toma de decisiones sobre tu madurez digital.' },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="rounded-xl p-4 flex gap-4"
                    style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(0,191,165,.12)', border: '1px solid rgba(0,191,165,.22)' }}>
                      <Icon className="w-4 h-4 text-[#00bfa5]" />
                    </div>
                    <div>
                      <p className="font-poppins font-bold text-white/85 text-[17px] mb-0.5">{s.titulo}</p>
                      <p className="font-lato text-white/50 text-[15px] leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </SlideLayout>
        </Slide>

        {/* ── 8. PRECIOS ── */}
        <Slide active={current === 7}>
          <SlideLayout tag="Inversión con descuento ANATO" title="25% off en todo el portafolio — sin letra pequeña">
            <div className="mt-5 space-y-2">
              {[
                { servicio: 'CRM + Chat Center omnicanal',  normal: 'COP 890.000/mes',    anato: 'COP 668.000/mes'  },
                { servicio: 'Bot con IA (implementación)',   normal: 'COP 590.000',         anato: 'COP 443.000'      },
                { servicio: 'Sitio Web para Agencia',        normal: 'Desde COP 2.400.000', anato: 'Desde COP 1.800.000' },
                { servicio: 'Gestión de Pauta Digital',      normal: 'COP 1.170.000/mes',  anato: 'COP 880.000/mes'  },
                { servicio: 'Email Marketing',               normal: 'COP 107.000/mes',    anato: 'COP 80.000/mes'   },
                { servicio: 'Soporte y Operaciones',         normal: 'COP 800.000/mes',    anato: 'COP 600.000/mes'  },
                { servicio: 'Consultoría Estratégica',       normal: 'COP 200.000/hora',   anato: 'COP 150.000/hora' },
              ].map((row, i) => (
                <div key={i} className="rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <p className="font-poppins font-semibold text-white/80 text-[16px] sm:flex-1">{row.servicio}</p>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-right">
                      <p className="font-lato text-white/25 text-[11px] uppercase tracking-wider mb-0.5">Normal</p>
                      <p className="font-poppins font-bold text-white/30 text-[15px] line-through">{row.normal}</p>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#00bfa5]/50 flex-shrink-0" />
                    <div className="text-right min-w-[160px]">
                      <p className="font-lato text-[#00bfa5] text-[11px] uppercase tracking-wider mb-0.5">Afiliado ANATO</p>
                      <p className="font-poppins font-black text-[#00bfa5] text-[17px]">{row.anato}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="font-lato text-white/30 text-[15px] mt-3">
              Implementaciones iniciales entre COP 5.000.000 y COP 25.000.000 según alcance. Pago 50/50 (inicio / entrega). Los módulos se activan según las necesidades de cada agencia.
            </p>
          </SlideLayout>
        </Slide>

        {/* ── 9. PILOTO ── */}
        <Slide active={current === 8}>
          <SlideLayout tag="Piloto propuesto" title="Empecemos con una agencia — completamente gratis">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div>
                <p className="font-poppins font-semibold text-white/45 text-[13px] uppercase tracking-wider mb-4">Lo que incluye el piloto</p>
                <ul className="space-y-3">
                  {['Implementación completa de CRM Sixteam.pro', 'Activación de Sixteam Inbox +IA', 'Flujos y automatizaciones configurados', '2 meses de licencia incluidos sin costo', 'Capacitación del equipo de la agencia'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-[#00bfa5] flex-shrink-0 mt-0.5" />
                      <span className="font-lato text-white/65 text-[18px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-poppins font-semibold text-white/45 text-[13px] uppercase tracking-wider mb-4">Lo que construimos juntos</p>
                <ul className="space-y-3">
                  {['Historial del cliente viajero sistematizado', 'Leads respondidos en segundos con IA', 'Seguimiento automático de prospectos', 'Reporte de impacto presentable a ANATO', 'Caso de éxito para escalar al resto de afiliadas'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: ANATO_ORANGE }} />
                      <span className="font-lato text-white/65 text-[18px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 rounded-2xl p-5 flex items-center gap-4"
              style={{ background: `rgba(232,84,10,.07)`, border: `1px solid rgba(232,84,10,.2)` }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: `rgba(232,84,10,.15)`, border: `1px solid rgba(232,84,10,.3)` }}>
                <span className="font-poppins font-black text-[24px]" style={{ color: ANATO_ORANGE }}>$0</span>
              </div>
              <div>
                <p className="font-poppins font-bold text-white/85 text-[20px]">Costo para ANATO y la agencia piloto</p>
                <p className="font-lato text-white/45 text-[17px]">Solo pedimos disposición del equipo de la agencia para adoptar la herramienta.</p>
              </div>
            </div>
          </SlideLayout>
        </Slide>

        {/* ── 10. ¿POR QUÉ SIXTEAM? ── */}
        <Slide active={current === 9}>
          <SlideLayout tag="¿Por qué Sixteam?" title="El problema no es la plataforma — es que nadie la hace funcionar">
            <p className="font-lato text-white/55 text-[18px] leading-relaxed mt-3 mb-5">
              ANATO ya tiene alianzas con DataCRM, Prolibu y Wetu. Son buenas plataformas. Pero el verdadero problema de las agencias no es el acceso a la herramienta — <strong className="text-white/80">es que las herramientas se compran y no se usan.</strong> Sixteam resuelve exactamente eso.
            </p>
            <div className="rounded-2xl overflow-hidden mb-4" style={{ border: '1px solid rgba(255,255,255,.08)' }}>
              <div className="grid grid-cols-3 gap-0">
                <div className="px-4 py-3 text-center" style={{ background: 'rgba(255,255,255,.04)' }}>
                  <p className="font-lato text-white/30 text-[13px] uppercase tracking-wider">Criterio</p>
                </div>
                <div className="px-4 py-3 text-center" style={{ background: 'rgba(255,255,255,.04)', borderLeft: '1px solid rgba(255,255,255,.06)' }}>
                  <p className="font-lato text-white/40 text-[13px] uppercase tracking-wider">Solo plataforma</p>
                </div>
                <div className="px-4 py-3 text-center" style={{ background: 'rgba(0,191,165,.07)', borderLeft: '1px solid rgba(0,191,165,.15)' }}>
                  <p className="font-lato text-[#00bfa5] text-[13px] uppercase tracking-wider font-semibold">Sixteam.pro</p>
                </div>
                {[
                  { criterio: 'Configuración inicial',   otro: 'Tú la haces',             sixteam: 'Nosotros la hacemos'    },
                  { criterio: 'Adopción del equipo',      otro: 'Manual + tutoriales',     sixteam: 'Acompañamiento real'    },
                  { criterio: 'Soporte',                  otro: 'Tickets / chat general',  sixteam: 'Contacto directo'       },
                  { criterio: 'Conocimiento del sector',  otro: 'Genérico',                sixteam: 'Turismo colombiano'     },
                  { criterio: 'Resultado garantizado',    otro: 'No está en el contrato',  sixteam: 'Es nuestra razón de ser'},
                ].map((row, i) => (
                  <React.Fragment key={i}>
                    <div className="px-4 py-3" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,.02)' : 'transparent', borderTop: '1px solid rgba(255,255,255,.04)' }}>
                      <p className="font-lato text-white/55 text-[15px]">{row.criterio}</p>
                    </div>
                    <div className="px-4 py-3 text-center flex items-center justify-center" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,.02)' : 'transparent', borderTop: '1px solid rgba(255,255,255,.04)', borderLeft: '1px solid rgba(255,255,255,.06)' }}>
                      <p className="font-lato text-white/30 text-[15px]">{row.otro}</p>
                    </div>
                    <div className="px-4 py-3 text-center flex items-center justify-center" style={{ background: i % 2 === 0 ? 'rgba(0,191,165,.05)' : 'rgba(0,191,165,.03)', borderTop: '1px solid rgba(0,191,165,.1)', borderLeft: '1px solid rgba(0,191,165,.12)' }}>
                      <p className="font-lato text-[#00bfa5] text-[15px] font-semibold">{row.sixteam}</p>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { icon: Plane,      color: ANATO_ORANGE, titulo: 'Experiencia en turismo',       desc: 'Ya trabajamos con agencias en Colombia. Conocemos el sector.' },
                { icon: MapPin,     color: '#1d70a2',    titulo: 'Colombianos, respuesta rápida', desc: 'Soporte en español, horarios locales, contexto real de PYMES.' },
                { icon: TrendingUp, color: '#00bfa5',    titulo: 'Ciclo completo conectado',      desc: 'Web → Pauta → Lead → Atención → CRM → Cierre. Todo conectado.' },
              ].map((d, i) => {
                const Icon = d.icon;
                return (
                  <div key={i} className="rounded-xl p-4 flex gap-3"
                    style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,.05)' }}>
                      <Icon className="w-4 h-4" style={{ color: d.color }} />
                    </div>
                    <div>
                      <p className="font-poppins font-bold text-white/80 text-[16px] mb-0.5">{d.titulo}</p>
                      <p className="font-lato text-white/45 text-[14px] leading-relaxed">{d.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </SlideLayout>
        </Slide>

        {/* ── 11. PRÓXIMOS PASOS ── */}
        <Slide active={current === 10}>
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #04111f 0%, #071826 60%, #091f34 100%)' }}>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full"
              style={{ background: `radial-gradient(circle, rgba(232,84,10,.06), transparent 65%)`, transform: 'translate(30%,-30%)' }} />
          </div>
          <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-16 max-w-5xl mx-auto w-full">
            <SlideTag>Próximos pasos</SlideTag>
            <h2 className="font-poppins font-black text-white mt-3 mb-8"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.05 }}>
              ¿Cómo avanzamos?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { num: '01', titulo: 'Reunión de presentación', desc: '30–45 min con la Junta Directiva para presentar la alianza y resolver preguntas.', icon: Users   },
                { num: '02', titulo: 'Acuerdo de términos',     desc: 'Definir canales, comunicación a afiliadas y selección de agencia piloto.',       icon: FileText },
                { num: '03', titulo: 'Lanzamiento del piloto',  desc: 'Primera agencia, implementación gratuita y construcción del caso de éxito.',     icon: Zap      },
              ].map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="rounded-2xl p-6 flex flex-col gap-3"
                    style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#1d70a2,#00bfa5)' }}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-poppins font-black text-[#00bfa5] text-[13px] tracking-wider">{p.num}</span>
                    </div>
                    <p className="font-poppins font-bold text-white/85 text-[19px]">{p.titulo}</p>
                    <p className="font-lato text-white/50 text-[16px] leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="https://wa.me/573004188522" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-poppins font-bold text-[17px] text-[#030d1a] transition-all duration-300 hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#00bfa5,#00d4b8)', boxShadow: '0 4px 24px rgba(0,191,165,.4)' }}>
                Escribir por WhatsApp <ArrowRight className="w-4 h-4" />
              </a>
              <a href="mailto:alpha@sixteam.pro"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-poppins font-bold text-[17px] text-white/75 transition-all duration-300 hover:scale-105"
                style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)' }}>
                <Mail className="w-4 h-4" /> alpha@sixteam.pro
              </a>
            </div>
          </div>
        </Slide>

      </div>

      {/* ── NAVEGACIÓN ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 no-print">
        <div className="flex items-center justify-between px-8 py-4"
          style={{ background: 'rgba(3,13,26,.92)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <span className="font-poppins font-black text-white text-[15px]">
            Sixteam<span className="text-[#00bfa5]">.</span>pro
            <span className="font-lato font-normal text-white/30 ml-2 text-[13px]">×</span>
            <span className="font-lato font-normal ml-2 text-[13px]" style={{ color: ANATO_ORANGE }}>ANATO Seccional Central</span>
          </span>
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className="rounded-full transition-all duration-300"
                style={{ width: current === i ? 24 : 8, height: 8, background: current === i ? '#00bfa5' : 'rgba(255,255,255,.2)', boxShadow: current === i ? '0 0 8px rgba(0,191,165,.6)' : 'none' }} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prev} disabled={current === 0}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-25 hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)' }}>
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <span className="font-lato text-white/35 text-[13px] w-12 text-center">{current + 1} / {total}</span>
            <button onClick={next} disabled={current === total - 1}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-25 hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)' }}>
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AnatoDeck;
