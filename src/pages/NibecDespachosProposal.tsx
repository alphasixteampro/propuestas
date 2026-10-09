import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LogoCarousel, { defaultLogos } from '../components/LogoCarousel';
import {
  Check, X, ChevronRight, Clock, FileText, Zap,
  AlertCircle, Calendar, MapPin, Users, Rocket, Shield, Coins, Database,
  Receipt, LayoutDashboard, Truck, Search, Smartphone, KeyRound,
  Github, Server, PlayCircle, TrendingDown, Wrench, ArrowRight,
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

const AMBER = '#FFAA00';
const LIGHT = '#EDEDED';
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
    icon: TrendingDown, color: AMBER,
  },
  {
    titulo: 'Pagar una sola vez y que quede para Nibec',
    desc: 'Sin mensualidades de licencia. Lo que se construye pasa a ser propiedad de Nibec.',
    cita: '“Algo que pague una sola vez y quede para mí”',
    icon: Coins, color: AMBER,
  },
  {
    titulo: 'Que sea básico',
    desc: 'Solo lo necesario para mover los pedidos. Nada de funciones que no se van a usar.',
    cita: '“Básico, insisto”',
    icon: LayoutDashboard, color: LIGHT,
  },
  {
    titulo: 'Que lo que pase a Despacho caiga en Beetrack',
    desc: 'Cuando un pedido llega a la etapa de despacho, debe crearse solo en Beetrack, sin volver a escribir nada.',
    cita: '“Todos los que pasen a la casilla despacho, que caigan en Beetrack”',
    icon: Truck, color: LIGHT,
  },
];

// ─── CÓMO FUNCIONA ───────────────────────────────────────────────────────────

const COLUMNAS_TABLERO = ['Nuevos', 'En preparación', 'Despacho'];

// ─── QUÉ INCLUYE / QUÉ NO HACE ───────────────────────────────────────────────

const INCLUYE = [
  { titulo: 'Pedidos desde Bsale', desc: 'Trae solo los pedidos nuevos (boletas y facturas) apenas se emiten.', icon: Receipt },
  { titulo: 'Tablero por columnas', desc: 'Se arrastra la tarjeta de una columna a otra, o se mueven varias a la vez. Cada tarjeta muestra N° de documento, cliente, comuna, productos, monto, si es despacho o retiro y hace cuánto llegó; las que pasan 24 horas sin despachar se marcan como atrasadas.', icon: LayoutDashboard },
  { titulo: 'Despacho automático en Beetrack', desc: 'Al llegar a “Despacho” se crea en Beetrack con los datos de Bsale (dirección, contacto, productos) y el N° de guía queda en la tarjeta. Si Beetrack lo rechaza, el tablero muestra el motivo y permite reintentar.', icon: Truck },
  { titulo: 'Estados que se actualizan solos', desc: 'Beetrack avisa cuando el pedido sale a ruta y cuando se entrega; la tarjeta se mueve sola.', icon: Zap },
  { titulo: 'Buscador e historial', desc: 'Búsqueda por N° de documento o cliente, filtros rápidos (atrasados, retiros, con error) e historial de cada pedido: quién lo movió y cuándo. Un cambio por error se deshace con un clic.', icon: Search },
  { titulo: 'Acceso para el equipo', desc: 'Usuario y clave para hasta 5 personas. Se ve en computador y en celular, e imprime la lista de preparación del día para la bodega.', icon: Smartphone },
];

const NO_HACE = [
  'No maneja stock ni ubicaciones de bodega: el stock sigue en Bsale.',
  'No emite boletas, facturas ni guías tributarias.',
  'No planifica rutas: eso lo sigue haciendo Beetrack.',
  'No hace informes avanzados.',
];

// ─── PLAN DE 4 SEMANAS ───────────────────────────────────────────────────────

const SEMANAS = [
  { num: '1', titulo: 'Accesos y conexión con Bsale', desc: 'Recibimos los accesos a Bsale y Beetrack, conectamos con Bsale y ya se ven pedidos reales en el tablero.', icon: Database, color: LIGHT },
  { num: '2', titulo: 'El tablero', desc: 'Columnas, tarjetas, buscador y usuarios del equipo.', icon: LayoutDashboard, color: AMBER },
  { num: '3', titulo: 'Conexión con Beetrack', desc: 'Crear el despacho al llegar a “Despacho” y recibir los estados de vuelta.', icon: Truck, color: LIGHT },
  { num: '4', titulo: 'Pruebas, capacitación y entrega', desc: 'Pruebas con pedidos reales en paralelo al WMS, capacitación al equipo y entrega funcionando.', icon: Rocket, color: AMBER },
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

// ─── ESTILOS (look nibec.cl, alcance .nb) ────────────────────────────────────

const NB_CSS = `
.nb{
  --nb-bg:#FFFFFF;--nb-surface:#F5F5F5;--nb-surface-2:#EDEDED;--nb-border:#E5E5E5;
  --nb-ink:#121212;--nb-text:rgba(18,18,18,.75);--nb-muted:#5C5C5C;
  --nb-amber:#FFAA00;--nb-amber-hover:#E89B00;--nb-amber-soft:#FFC16F;--nb-amber-tint:rgba(255,170,0,.3);
  --nb-charcoal:#3C382F;--nb-charcoal-2:#363229;
  background:var(--nb-bg);color:var(--nb-text);
  font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
  font-size:1rem;line-height:1.7;-webkit-font-smoothing:antialiased;
}
.nb *{box-sizing:border-box}
.nb img{max-width:100%}
.nb .logo-slider-track img{max-width:none}
.nb-card,.nb-card-grey,.nb-tile,.nb-promo,.nb-hero,.nb-cta-panel,.nb-band,.nb-list,.nb-tint{overflow-wrap:anywhere}
.nb h1,.nb h2,.nb h3,.nb p,.nb ul,.nb ol,.nb dl,.nb dd,.nb figure{margin:0}
.nb ul,.nb ol{padding:0;list-style:none}
.nb strong{font-weight:700;color:var(--nb-ink)}
.nb a{color:inherit}

.nb-container{max-width:1300px;margin-inline:auto;padding-inline:16px}
@media(min-width:768px){.nb-container{padding-inline:32px}}
.nb-section{padding-top:48px;scroll-margin-top:112px}
@media(min-width:768px){.nb-section{padding-top:80px;scroll-margin-top:88px}}

.nb-h1{font-size:clamp(1.75rem,1.2rem + 2vw,2.4rem);font-weight:600;letter-spacing:.6px;line-height:1.1;color:#fff}
.nb-h2{font-size:clamp(1.5rem,1.2rem + 1.2vw,2rem);font-weight:700;letter-spacing:.6px;line-height:1.15;color:var(--nb-ink);margin-bottom:24px}
.nb-h3{font-size:1.125rem;font-weight:700;line-height:1.25;color:var(--nb-ink)}
@media(min-width:768px){.nb-h3{font-size:1.25rem}}
.nb-prose{max-width:65ch}
.nb-small{font-size:.875rem;line-height:1.5}
.nb-muted{color:var(--nb-muted)}
.nb-ink{color:var(--nb-ink)}
.nb-icon{color:var(--nb-amber);flex:none}
.nb-big{font-size:clamp(1.5rem,1.2rem + 2vw,2.4rem);font-weight:700;line-height:1.1;color:var(--nb-ink);overflow-wrap:anywhere}

/* Grillas: 1 col <640, 2 cols 640-1023 */
.nb-g{display:grid;grid-template-columns:1fr;gap:16px}
@media(min-width:768px){.nb-g{gap:24px}}
@media(min-width:640px){.nb-g-2,.nb-g-4{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(min-width:1280px){.nb-g-4{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media(min-width:768px){.nb-g-alcance{grid-template-columns:3fr 2fr;align-items:start}}

/* Botones */
.nb-btn-primary,.nb-btn-secondary{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:12px 24px;
  font-weight:700;font-size:1rem;line-height:1.2;text-decoration:none;cursor:pointer;border:0;
  transition:background-color 150ms ease-out,transform 150ms ease-out;
}
@media(max-width:767px){.nb-full-m{width:100%}}
.nb-btn-primary{background:var(--nb-amber);color:var(--nb-ink)!important;border-radius:25px}
.nb-btn-primary:hover{background:var(--nb-amber-hover)}
.nb-btn-primary:active{transform:translateY(1px)}
.nb-btn-primary:focus-visible{outline:2px solid var(--nb-ink);outline-offset:2px}
.nb-btn-primary.on-dark:focus-visible{outline-color:#fff}
.nb-btn-primary:disabled{opacity:.5;cursor:not-allowed}
@media(max-width:767px){.nb-link{display:inline-flex;align-items:center;min-height:44px}}
.nb-link{font-weight:700;color:var(--nb-ink);text-decoration:underline;text-underline-offset:4px;transition:color 150ms ease-out}
.nb-link:hover{color:#000;text-decoration-thickness:2px}
.nb-link:focus-visible{outline:2px solid var(--nb-ink);outline-offset:2px;border-radius:4px}

/* Anuncio, header, barra de categorías */
.nb-announce{background:var(--nb-ink);color:#fff;font-size:.875rem;line-height:1.5;text-align:center;padding:8px 16px}
@media(max-width:767px){.nb-announce{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nb-ann-more{display:none}}
.nb-header{position:sticky;top:0;z-index:50;background:var(--nb-bg)}
.nb-head-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding-block:12px}
.nb-logo{height:44px;width:auto}
.nb-lbl-full{display:none}

@media(min-width:768px){.nb-lbl-full{display:inline}.nb-lbl-short{display:none}}
@media(max-width:767px){
  .nb-head-row{flex-wrap:nowrap;padding-block:8px}
  .nb-head-row>div:first-child{min-width:0}
  .nb-logo{height:40px}
  .nb-header .nb-btn-primary{padding:10px 16px;font-size:.9375rem;flex:none}
}
.nb-catbar{border-bottom:1px solid var(--nb-border)}
.nb-catbar ul{display:flex;gap:24px;overflow-x:auto;scrollbar-width:thin}
.nb-catbar li{scroll-snap-align:start;flex:none}
.nb-catbar a{
  display:block;white-space:nowrap;padding:12px 0 10px;font-size:1rem;font-weight:600;line-height:1.5;color:var(--nb-ink);
  text-decoration:none;border-bottom:2px solid transparent;transition:border-color 150ms ease-out,color 150ms ease-out;
}
@media(max-width:1023px){
  .nb-catbar ul{scrollbar-width:none;-ms-overflow-style:none;scroll-snap-type:x proximity;gap:8px;scroll-padding-inline:16px}
  .nb-catbar ul::-webkit-scrollbar{display:none}
  .nb-catbar a{display:flex;align-items:center;min-height:44px;padding:0 8px;border-bottom-width:3px}
}
.nb-catbar a:hover{border-bottom-color:var(--nb-border)}
.nb-catbar a[aria-current="true"]{border-bottom-color:var(--nb-amber)}
.nb-catbar a:focus-visible{outline:2px solid var(--nb-ink);outline-offset:-2px;border-radius:4px}

/* Barra inferior fija (solo móvil) */
.nb-sticky{
  display:none;position:fixed;left:0;right:0;bottom:0;z-index:40;background:#fff;border-top:1px solid var(--nb-border);
  padding:12px 16px calc(12px + env(safe-area-inset-bottom));align-items:center;justify-content:space-between;gap:12px;
  transform:translateY(100%);visibility:hidden;transition:transform 150ms ease-out,visibility 150ms;
}
.nb-sticky.is-visible{transform:none;visibility:visible}
.nb-sticky-price{font-weight:700;color:var(--nb-ink);font-size:.9375rem;line-height:1.3}
.nb-sticky .nb-btn-primary{flex:none;padding:10px 20px}
@media(max-width:767px){.nb-sticky{display:flex}}

/* Tarjetas y losetas */
.nb-card{background:#fff;border:1px solid var(--nb-border);border-radius:12px;padding:16px}
.nb-card-grey{background:var(--nb-surface);border-radius:12px;padding:16px}
.nb-tile{background:var(--nb-charcoal);color:rgba(255,255,255,.8);border-radius:12px;padding:16px}
.nb-tint{background:var(--nb-amber-tint);border-radius:12px;padding:16px}
@media(min-width:768px){.nb-card,.nb-card-grey,.nb-tile,.nb-tint{padding:24px}}
.nb-tile .nb-h3,.nb-tile strong{color:#fff}
.nb-hero{background:var(--nb-charcoal-2);border-radius:12px;padding:20px;color:rgba(255,255,255,.8)}
@media(min-width:768px){.nb-hero{padding:32px}}
@media(min-width:1024px){.nb-hero{padding:48px}}
.nb-meta{display:flex;flex-wrap:wrap;gap:8px 20px;margin-bottom:24px}
.nb-meta li{white-space:nowrap}
@media(min-width:768px){.nb-meta{display:flex;flex-wrap:wrap;gap:8px 24px;margin-bottom:32px}}
.nb-board{display:none}
@media(min-width:768px){.nb-board{display:block}}
.nb-promo{background:var(--nb-amber-soft);color:var(--nb-ink);border-radius:12px;padding:16px}
@media(min-width:768px){.nb-promo{padding:16px 24px}}
.nb-band{background:var(--nb-amber-tint);color:var(--nb-ink);padding-block:32px;margin-block:40px}
.nb-band p{color:rgba(18,18,18,.85)}
.nb-cta-panel{background:var(--nb-charcoal);color:rgba(255,255,255,.8);border-radius:16px;padding:20px}
@media(min-width:640px){.nb-cta-panel{padding:32px}}
@media(min-width:768px){.nb-cta-panel{padding:48px}}
.nb-cta-panel strong{color:#fff}
.nb-price{color:#fff;font-weight:700;line-height:1;font-size:clamp(2.5rem,10vw,4rem)}
.nb-dl{display:grid;grid-template-columns:1fr;margin-bottom:32px}
.nb-dl-row{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.12)}
.nb-dl-row dd{font-weight:700;color:#fff;text-align:right;min-width:0}
@media(min-width:640px){.nb-dl{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:48px}.nb-dl-row{align-items:center;padding:8px 0}}

.nb-chip{display:inline-block;font-size:.875rem;font-weight:600;line-height:1.5;padding:4px 12px;border-radius:25px;background:rgba(255,255,255,.12);color:#fff}
.nb-chip-active{background:var(--nb-amber);color:var(--nb-ink)}

/* Mini tablero (estático) */
.nb-board-col{background:var(--nb-surface);border-radius:8px;padding:8px;display:flex;flex-direction:column;gap:8px;min-height:176px}
.nb-board-title{font-size:.75rem;font-weight:700;line-height:1.3;color:var(--nb-ink)}
.nb-mini-card{background:#fff;border-radius:8px;padding:8px;display:flex;flex-direction:column;gap:6px;border:1px solid var(--nb-border)}
.nb-line{display:block;height:6px;border-radius:25px;background:var(--nb-surface-2)}
.nb-line-amber{background:var(--nb-amber)}

/* Pasos (línea de tiempo vertical en móvil, horizontal en escritorio) */
.nb-steps{display:grid;grid-template-columns:1fr;gap:0}
.nb-step{position:relative;padding-left:56px;padding-bottom:24px}
.nb-step:last-child{padding-bottom:0}
.nb-step-num{
  position:absolute;left:0;top:0;z-index:1;
  width:40px;height:40px;border-radius:50%;background:var(--nb-amber);color:var(--nb-ink);font-weight:700;font-size:1.125rem;
  display:flex;align-items:center;justify-content:center;line-height:1;
}
.nb-step:not(:last-child)::before{content:"";position:absolute;left:19px;top:44px;bottom:4px;width:2px;background:#C9C9C9}
.nb-step .nb-step-week{margin-top:0;line-height:40px}
@media(min-width:1024px){
  .nb-steps{grid-template-columns:repeat(4,1fr);gap:24px}
  .nb-step{padding:0}
  .nb-step-num{position:static}
  .nb-step:not(:last-child)::before{content:none}
  .nb-step .nb-step-week{margin-top:16px;line-height:1.5}
  .nb-step:not(:last-child)::after{content:"";position:absolute;top:20px;left:52px;width:calc(100% - 40px);height:1px;background:#C9C9C9}
}

/* Listas numeradas */
.nb-ol{counter-reset:n;display:grid;gap:16px}
.nb-ol>li{counter-increment:n;display:flex;gap:12px}
.nb-ol>li::before{
  content:counter(n);flex:none;width:28px;height:28px;border-radius:50%;background:var(--nb-amber);color:var(--nb-ink);
  font-weight:700;font-size:.875rem;line-height:1;display:flex;align-items:center;justify-content:center;
}

/* Lista simple con bordes */
.nb-list{border:1px solid var(--nb-border);border-radius:12px;overflow:hidden}
.nb-list>li{display:flex;gap:16px;padding:16px;border-top:1px solid var(--nb-border)}
@media(min-width:768px){.nb-list>li{padding:16px 24px}}
.nb-list>li:first-child{border-top:0}

/* Es tuyo */
.nb-trust{display:grid;grid-template-columns:1fr;gap:16px;margin-bottom:32px}
.nb-trust>li{display:grid;grid-template-columns:24px minmax(0,1fr);gap:12px;align-items:start}
.nb-trust>li>svg{display:block;margin-top:2px}
@media(min-width:640px){.nb-trust{grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}}

/* Barras de ahorro */
.nb-bar-head{display:flex;flex-direction:column;gap:2px;margin-bottom:8px}
@media(min-width:640px){.nb-bar-head{flex-direction:row;justify-content:space-between;gap:12px}}
.nb-track{height:16px;border-radius:25px;background:var(--nb-surface-2);overflow:hidden}
.nb-fill{height:100%;border-radius:25px}

/* Carrusel de logos sobre banda gris */
.nb-logos-band{background:var(--nb-surface);margin-top:48px}
@media(min-width:768px){.nb-logos-band{margin-top:80px}}
.nb-logos-band section{border-color:var(--nb-border)!important}
.nb-logos-band section p{color:var(--nb-muted)!important}

/* Pie */
.nb-footer{border-top:1px solid var(--nb-border);margin-top:48px;padding-block:48px}
@media(max-width:767px){.nb-footer{padding-bottom:calc(48px + 84px + env(safe-area-inset-bottom))}}
@media(min-width:768px){.nb-footer{margin-top:80px}}
.nb-foot-h{font-size:1.125rem;font-weight:700;line-height:1.25;color:var(--nb-charcoal);margin-bottom:12px}

@media (prefers-reduced-motion: reduce){
  .nb *,.nb *::before,.nb *::after{transition:none!important;animation:none!important}
  .nb .logo-slider-track{animation:none!important}
}
`;

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const NibecDespachosProposal = () => {
  const [activeSection, setActiveSection] = useState('pedido');
  const [showBar, setShowBar] = useState(false);
  const navRef = useRef<HTMLUListElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }, []);

  // Sección activa: IntersectionObserver sobre los ids existentes
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const visibles = new Set<string>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) visibles.add(en.target.id); else visibles.delete(en.target.id);
      });
      const ult = [...SECCIONES].reverse().find(s => visibles.has(s.id));
      if (ult) setActiveSection(ult.id);
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
    SECCIONES.forEach(s => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  // Mantiene visible el enlace activo en la barra horizontal (sin mover la página)
  useEffect(() => {
    const ul = navRef.current;
    const a = ul?.querySelector<HTMLElement>('a[aria-current="true"]');
    if (!ul || !a || ul.scrollWidth <= ul.clientWidth) return;
    ul.scrollTo({ left: a.offsetLeft - (ul.clientWidth - a.offsetWidth) / 2 });
  }, [activeSection]);

  // Barra inferior: aparece cuando la portada sale de la vista
  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([en]) => {
      setShowBar(!en.isIntersecting && en.boundingClientRect.top < 0);
    }, { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
  const goTo = (e: React.MouseEvent, id: string) => { e.preventDefault(); scrollTo(id); };

  // Barras de ahorro: proporcional al costo del primer año
  const barTablero = Math.max(((PRECIO_USD + SERVIDOR_ANIO_USD) / WMS_ANIO_USD) * 100, 8);

  return (
    <div id="proposal-root" className="nb min-h-screen overflow-x-hidden">
      <style>{NB_CSS}</style>

      {/* ── ANUNCIO ── */}
      <div className="nb-announce">
        Propuesta para {META.cliente} · {META.fecha}<span className="nb-ann-more"> · Vigente 30 días</span>
      </div>

      {/* ── HEADER + BARRA DE SECCIONES ── */}
      <div className="nb-header no-print">
        <header>
          <div className="nb-container nb-head-row">
            <div className="flex items-center gap-4">
              <img src="/Logo nibec.png" alt="Nibec" className="nb-logo object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <span className="nb-small nb-muted hidden sm:inline">Propuesta de Sixteam.pro</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to={DEMO_URL} className="nb-btn-primary">
                <PlayCircle className="w-5 h-5" aria-hidden="true" />
                <span className="nb-lbl-full">Ver la demo interactiva</span><span className="nb-lbl-short">Ver demo</span>
              </Link>
            </div>
          </div>
        </header>
        <nav aria-label="Secciones de la propuesta" className="nb-catbar">
          <div className="nb-container">
            <ul ref={navRef}>
              {SECCIONES.map(s => (
                <li key={s.id}>
                  <a href={`#${s.id}`} onClick={(e) => goTo(e, s.id)}
                    aria-current={activeSection === s.id ? 'true' : undefined}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <main>

        {/* ══════════ PORTADA */}
        <div className="nb-container" style={{ paddingTop: 32 }}>
          <div className="nb-hero" ref={heroRef}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <p className="nb-small" style={{ color: 'rgba(255,255,255,.8)' }}>
                  Propuesta de trabajo y cotización
                </p>
                <p className="flex flex-wrap items-center gap-2 mt-4 mb-4">
                  <Shield className="w-5 h-5 nb-icon" aria-hidden="true" />
                  <span style={{ color: 'rgba(255,255,255,.8)' }}>Para:</span>
                  <span className="font-bold text-white">{META.contacto} · Nibec</span>
                </p>
                <h1 className="nb-h1 mb-4">
                  Tablero de<br />Despachos Nibec
                </h1>
                <p className="mb-6" style={{ fontSize: '1.125rem', lineHeight: 1.5, maxWidth: '65ch' }}>
                  {META.tagline}.
                </p>
                <ul className="nb-meta">
                  {[
                    { icon: Calendar, text: META.fecha },
                    { icon: MapPin,   text: META.sede },
                    { icon: Coins,    text: `USD ${PRECIO_USD.toLocaleString('es-CL')} pago único` },
                    { icon: Clock,    text: '4 semanas' },
                  ].map((chip, i) => {
                    const Icon = chip.icon;
                    return (
                      <li key={i} className="inline-flex items-center gap-2" style={{ color: 'rgba(255,255,255,.8)' }}>
                        <Icon className="w-4 h-4 nb-icon" aria-hidden="true" /> {chip.text}
                      </li>
                    );
                  })}
                </ul>
                <div className="no-print">
                  <Link to={DEMO_URL} className="nb-btn-primary on-dark nb-full-m">
                    <PlayCircle className="w-5 h-5" aria-hidden="true" /> Ver la demo interactiva
                  </Link>
                </div>
              </div>

              {/* Mini tablero estático */}
              <div aria-hidden="true" className="nb-board">
                <div className="grid grid-cols-3 gap-2">
                  {COLUMNAS_TABLERO.map((c, ci) => (
                    <div key={c} className="nb-board-col">
                      <p className="nb-board-title">{c}</p>
                      {Array.from({ length: ci === 2 ? 1 : 2 }).map((_, k) => (
                        <div key={k} className="nb-mini-card">
                          <span className="nb-line" style={{ width: '75%' }} />
                          <span className="nb-line" style={{ width: '50%' }} />
                          {ci === 2 && <span className="nb-line nb-line-amber" style={{ width: '33%' }} />}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <p className="font-bold mt-3 text-right" style={{ color: 'var(--nb-amber)' }}>→ Beetrack</p>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════ PROMO */}
        <div className="nb-container" style={{ marginTop: 24 }}>
          <div className="nb-promo flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <p>
              <strong>≈ 1 mes</strong> de WMS basta para pagar el Tablero · <strong>≈ USD 12.500</strong> de ahorro el primer año
            </p>
            <a href="#ahorro" onClick={(e) => goTo(e, 'ahorro')} className="nb-link">Ver ahorro →</a>
          </div>
        </div>

        {/* ─ LO QUE NOS PIDIERON ─ */}
        <section id="pedido" className="nb-section">
          <div className="nb-container">
            <h2 className="nb-h2">Simple, barato y de Nibec</h2>
            <p className="nb-prose mb-6">
              Nibec vende por su tienda online y por atención directa, con cerca de 400 ventas cerradas al mes. Hoy paga un sistema de bodega de <strong>$1,1 millones CLP al mes</strong> y quiere dejarlo. Esto es lo que pidió {META.contacto}:
            </p>
            <div className="nb-g nb-g-4">
              {PEDIDOS.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="nb-card">
                    <Icon className="w-6 h-6 nb-icon mb-4" aria-hidden="true" />
                    <h3 className="nb-h3 mb-2">{p.titulo}</h3>
                    <p className="mb-4">{p.desc}</p>
                    <p className="nb-ink italic nb-small">{p.cita}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─ CÓMO FUNCIONA ─ */}
        <section id="funciona" className="nb-section">
          <div className="nb-container">
            <h2 className="nb-h2">Un puente, no otro sistema grande</h2>
            <p className="nb-prose mb-6">
              Todo el pedido nace en Bsale, así que nada se escribe a mano. El tablero solo recibe lo que Bsale emite, lo ordena por etapas y, al final, le pasa el pedido a Beetrack.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1.4fr_auto_1fr] gap-4 items-stretch">
              <div className="nb-tile">
                <Receipt className="w-6 h-6 nb-icon mb-4" aria-hidden="true" />
                <h3 className="nb-h3 mb-2">Bsale</h3>
                <p>Emite la boleta o factura. De ahí sale toda la información del pedido.</p>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <ArrowRight className="w-6 h-6 nb-icon" aria-hidden="true" />
              </div>
              <div className="nb-tile">
                <LayoutDashboard className="w-6 h-6 nb-icon mb-4" aria-hidden="true" />
                <h3 className="nb-h3 mb-3">Tablero de Despachos</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {COLUMNAS_TABLERO.map((c, i) => (
                    <React.Fragment key={c}>
                      <span className={c === 'Despacho' ? 'nb-chip nb-chip-active' : 'nb-chip'}>{c}</span>
                      {i < COLUMNAS_TABLERO.length - 1 && <ChevronRight className="w-4 h-4" style={{ color: 'rgba(255,255,255,.8)' }} aria-hidden="true" />}
                    </React.Fragment>
                  ))}
                </div>
                <p className="nb-small mt-3">Arrastras la tarjeta de una columna a la siguiente.</p>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <ArrowRight className="w-6 h-6 nb-icon" aria-hidden="true" />
              </div>
              <div className="nb-tile">
                <Truck className="w-6 h-6 nb-icon mb-4" aria-hidden="true" />
                <h3 className="nb-h3 mb-2">Beetrack</h3>
                <p>Crea el despacho y la guía. Devuelve <strong>En ruta</strong> y <strong>Entregado</strong>.</p>
              </div>
            </div>
          </div>

          {/* Punto clave */}
          <div className="nb-band">
            <div className="nb-container flex gap-4">
              <Zap className="w-6 h-6 flex-none mt-1" style={{ color: 'var(--nb-ink)' }} aria-hidden="true" />
              <div className="nb-prose">
                <h3 className="nb-h3 mb-2">El punto clave</h3>
                <p>
                  Hoy la guía de Beetrack se genera sola desde Bsale. Con el tablero, <strong>la guía se crea solo cuando la tarjeta llega a “Despacho”</strong>. Así Nibec decide cuándo sale cada pedido, y Beetrack lo recibe sin que nadie lo vuelva a escribir. La conexión entre los sistemas es automática (por la API de cada uno).
                </p>
              </div>
            </div>
          </div>

          <div className="nb-container">
            <p className="nb-prose">
              Los pedidos marcados <strong>“Retiro en bodega”</strong> no van a Beetrack: pasan de “En preparación” a “Entregado” a mano. Después de “Despacho”, las columnas <strong>En ruta</strong> y <strong>Entregado</strong> las mueve Beetrack solo.
            </p>

            {/* Demo */}
            <div className="nb-card mt-8 flex flex-wrap items-center justify-between gap-4 no-print">
              <div>
                <h3 className="nb-h3 mb-1">Pruébalo con pedidos de ejemplo</h3>
                <p>Arrastra las tarjetas y mira qué pasa al llegar a “Despacho”. Los datos son ficticios.</p>
              </div>
              <Link to={DEMO_URL} className="nb-btn-primary nb-full-m">
                <PlayCircle className="w-5 h-5" aria-hidden="true" /> Ver la demo interactiva
              </Link>
            </div>
          </div>
        </section>

        {/* ─ QUÉ INCLUYE / QUÉ NO HACE ─ */}
        <section id="alcance" className="nb-section">
          <div className="nb-container">
            <h2 className="nb-h2">Qué incluye y qué no hace</h2>
            <p className="nb-prose mb-6">
              Es básico a propósito. Hace pocas cosas y las hace bien; lo demás sigue donde está hoy.
            </p>

            <div className="nb-g nb-g-alcance">
              <div>
                <h3 className="nb-h3 mb-4">Qué incluye</h3>
                <ul className="grid gap-4">
                  {INCLUYE.map((it, i) => (
                    <li key={i} className="nb-card flex gap-3" style={{ padding: 16 }}>
                      <Check className="w-5 h-5 nb-icon mt-0.5" strokeWidth={3} aria-hidden="true" />
                      <div>
                        <p className="font-bold nb-ink">{it.titulo}</p>
                        <p className="nb-small">{it.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="nb-card-grey">
                <h3 className="nb-h3 mb-4">Qué no hace</h3>
                <ul className="grid gap-3">
                  {NO_HACE.map((t, i) => (
                    <li key={i} className="flex gap-3">
                      <X className="w-5 h-5 flex-none mt-0.5 nb-muted" aria-hidden="true" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─ ES TUYO ─ */}
        <section id="tuyo" className="nb-section">
          <div className="nb-container">
            <h2 className="nb-h2">Es tuyo</h2>
            <p className="nb-prose nb-ink mb-8" style={{ fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.5 }}>
              Pagas una vez y <strong>todo queda a nombre de Nibec</strong>. Sin licencias y sin mensualidad de Sixteam.
            </p>
            <ul className="nb-trust">
              {[
                { icon: Github, titulo: 'El código', desc: 'Queda en la cuenta de GitHub de Nibec.' },
                { icon: Server, titulo: 'El servidor', desc: 'Corre en un servidor a nombre de Nibec.' },
                { icon: Database, titulo: 'La base de datos', desc: 'Es de Nibec, con sus pedidos e historial.' },
              ].map((c, i) => {
                const Icon = c.icon;
                return (
                  <li key={i}>
                    <Icon className="w-6 h-6 nb-icon" aria-hidden="true" />
                    <div>
                      <p className="font-bold nb-ink">{c.titulo}</p>
                      <p className="nb-small nb-muted">{c.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="nb-prose flex gap-3">
              <Coins className="w-5 h-5 nb-icon mt-1" aria-hidden="true" />
              <span>
                El <strong>único costo que sigue</strong> es el servidor: <strong>≈ USD {SERVIDOR_MES_USD} al mes</strong>, que Nibec paga directo al proveedor. Cualquier desarrollador puede modificar el sistema después, no hace falta depender de Sixteam.
              </span>
            </p>
          </div>
        </section>

        {/* ─ AHORRO ─ */}
        <section id="ahorro" className="nb-section">
          <div className="nb-container">
            <h2 className="nb-h2">Se paga con un mes de WMS</h2>

            <div className="nb-g nb-g-2 mb-6">
              <div className="nb-card">
                <p className="nb-small nb-muted font-semibold mb-2">Hoy · WMS</p>
                <p className="nb-big mb-1">$1,1 millones</p>
                <p className="mb-4">CLP al mes</p>
                <p className="nb-ink font-bold" style={{ fontSize: '1.125rem' }}>$13,2 millones al año</p>
                <p className="nb-small nb-muted">≈ USD 13.800 al año</p>
              </div>
              <div className="nb-card">
                <p className="nb-small nb-muted font-semibold mb-2">Con el Tablero</p>
                <p className="nb-big mb-1">USD 1.200</p>
                <p className="mb-4">pago único</p>
                <p className="nb-ink font-bold" style={{ fontSize: '1.125rem' }}>+ ≈ USD {SERVIDOR_ANIO_USD} al año</p>
                <p className="nb-small nb-muted">de servidor, pagado directo por Nibec</p>
              </div>
            </div>

            {/* Barras */}
            <div className="nb-card mb-6">
              <h3 className="nb-h3 mb-4">Costo del primer año (USD)</h3>
              <div className="grid gap-4">
                <div>
                  <div className="nb-bar-head nb-small">
                    <span>WMS actual</span>
                    <span className="font-bold nb-ink">13.800</span>
                  </div>
                  <div className="nb-track">
                    <div className="nb-fill" style={{ width: '100%', background: 'var(--nb-ink)' }} />
                  </div>
                </div>
                <div>
                  <div className="nb-bar-head nb-small">
                    <span>Tablero de Despachos (1.200 + 120 de servidor)</span>
                    <span className="font-bold nb-ink">≈ 1.320</span>
                  </div>
                  <div className="nb-track">
                    <div className="nb-fill" style={{ width: `${barTablero}%`, background: 'var(--nb-amber)' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="nb-g nb-g-2">
              <div className="nb-card">
                <p className="nb-big mb-1">≈ 1 mes</p>
                <p>de WMS basta para pagar el Tablero</p>
              </div>
              <div className="nb-tint">
                <p className="nb-big mb-1">≈ USD 12.500</p>
                <p className="nb-ink">de ahorro el primer año</p>
                <p className="nb-small" style={{ color: 'rgba(18,18,18,.85)' }}>13.800 − 1.200 − 120 de servidor</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─ PLAN DE 4 SEMANAS ─ */}
        <section id="plan" className="nb-section">
          <div className="nb-container">
            <h2 className="nb-h2">Funcionando en 4 semanas</h2>
            <p className="nb-prose mb-6">
              El plazo corre desde el primer pago y la entrega de los accesos.
            </p>
            <ol className="nb-steps mb-8">
              {SEMANAS.map((s, i) => (
                <li key={i} className="nb-step">
                  <div className="nb-step-num" aria-hidden="true">{s.num}</div>
                  <p className="nb-step-week nb-small nb-muted font-semibold mb-1">Semana {s.num}</p>
                  <h3 className="nb-h3 mb-2">{s.titulo}</h3>
                  <p>{s.desc}</p>
                </li>
              ))}
            </ol>
            <div className="nb-promo flex gap-3">
              <AlertCircle className="w-6 h-6 flex-none mt-0.5" style={{ color: 'var(--nb-ink)' }} aria-hidden="true" />
              <div>
                <p className="font-bold nb-ink">Recomendación</p>
                <p style={{ color: 'var(--nb-ink)' }}>
                  Usar el Tablero en paralelo al WMS y <strong>no cortar el WMS hasta tener 2 semanas funcionando sin problemas</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─ QUÉ NECESITAMOS / PUNTOS A VALIDAR ─ */}
        <section id="necesitamos" className="nb-section">
          <div className="nb-container">
            <h2 className="nb-h2">Lo que hace falta para empezar</h2>
            <div className="nb-g nb-g-2">
              <div className="nb-card">
                <h3 className="nb-h3 mb-4">Qué necesitamos de Nibec</h3>
                <ol className="nb-ol">
                  {NECESITAMOS.map((n, i) => (
                    <li key={i}>
                      <div>
                        <p className="font-bold nb-ink">{n.titulo}</p>
                        <p className="nb-small">{n.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="nb-card">
                <h3 className="nb-h3 mb-4">Puntos a validar con Nibec</h3>
                <ol className="nb-ol">
                  {VALIDAR.map((v, i) => (
                    <li key={i}>
                      <div>
                        <p className="font-bold nb-ink">{v.titulo}</p>
                        <p className="nb-small">{v.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ─ INVERSIÓN ─ */}
        <section id="inversion" className="nb-section">
          <div className="nb-container">
            <h2 className="nb-h2">Un solo pago</h2>
            <div className="nb-cta-panel">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <p className="font-semibold">{META.producto}</p>
                <span className="nb-chip">Pago único</span>
              </div>
              <div className="flex flex-wrap items-end gap-3 mb-1">
                <p className="nb-price">
                  USD 1.200
                </p>
                <span className="mb-1" style={{ fontSize: '1.125rem' }}>sin IVA</span>
              </div>
              <p className="nb-small mb-8">Valores en dólares estadounidenses (servicio exportado desde Colombia).</p>
              <dl className="nb-dl">
                {[
                  { label: 'Forma de pago', value: '50% al aprobar · 50% al entregar' },
                  { label: 'Garantía', value: '30 días' },
                  { label: 'Capacitación al equipo', value: '1 hora' },
                  { label: 'Plazo', value: '4 semanas' },
                  { label: 'Licencias o mensualidad', value: 'Ninguna' },
                  { label: 'Servidor (pagado por Nibec)', value: `≈ USD ${SERVIDOR_MES_USD}/mes` },
                ].map((r, i) => (
                  <div key={i} className="nb-dl-row">
                    <dt>{r.label}</dt>
                    <dd>{r.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="flex gap-3 mb-8">
                <Wrench className="w-5 h-5 nb-icon mt-1" aria-hidden="true" />
                <span>
                  <strong>Garantía:</strong> durante 30 días corregimos cualquier falla sin costo. <strong>Cambios después:</strong> son opcionales; pueden hacerse con los créditos del plan Sixteam Ops que Nibec ya conoce, o con cualquier desarrollador. No es obligatorio.
                </span>
              </p>
              <div className="no-print">
                <Link to={DEMO_URL} className="nb-btn-primary on-dark nb-full-m">
                  <PlayCircle className="w-5 h-5" aria-hidden="true" /> Ver la demo interactiva
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── LOGOS ── */}
        <div className="nb-logos-band">
          <LogoCarousel logos={LOGOS_SIN_CLIENTE} />
        </div>

        {/* ─ VIGENCIA ─ */}
        <section id="vigencia" className="nb-section">
          <div className="nb-container">
            <h2 className="nb-h2">Vigencia y Términos de la Propuesta</h2>
            <ul className="nb-list">
              {[
                { titulo: 'Aprobación', desc: 'Para aceptar esta propuesta basta la confirmación por WhatsApp, correo o verbal. Con eso se envía el acuerdo a firmar y se pide el primer 50%.', icon: Check },
                { titulo: 'Términos de pago', desc: 'Pago único de USD 1.200: 50% al aprobar y 50% al entregar funcionando. Los pagos se hacen por transferencia bancaria en dólares estadounidenses. Valores sin IVA.', icon: FileText },
                { titulo: 'Inicio del plazo', desc: 'Las 4 semanas cuentan desde el primer pago y la entrega de los accesos a Bsale y Beetrack por parte de Nibec.', icon: Rocket },
                { titulo: 'Garantía y capacitación', desc: '30 días de garantía (corrección de fallas sin costo) y una capacitación de 1 hora al equipo.', icon: Shield },
                { titulo: 'Costos de terceros', desc: 'El servidor (≈ USD 10 al mes) y las suscripciones de Bsale y Beetrack los paga Nibec directamente a cada proveedor. No forman parte del valor de esta propuesta.', icon: Coins },
                { titulo: 'Vigencia de la propuesta', desc: `Esta propuesta tiene una vigencia de 30 días calendario desde su fecha de emisión (${META.fecha}). Pasado este plazo, los valores podrán ser revisados.`, icon: Calendar },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <li key={i}>
                    <Icon className="w-5 h-5 nb-icon mt-1" aria-hidden="true" />
                    <div>
                      <p className="font-bold nb-ink">{item.titulo}</p>
                      <p>{item.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="nb-footer">
        <div className="nb-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h2 className="nb-foot-h">Sixteam.pro</h2>
              <p className="nb-small">{META.proponente}</p>
              <p className="nb-small">NIT {META.nit}</p>
              <p className="nb-small">RL: {META.rl}</p>
            </div>
            <div>
              <h2 className="nb-foot-h">Propuesta realizada por</h2>
              <p className="nb-small"><strong>{META.autor}</strong></p>
              <p className="nb-small">{META.autorCargo}</p>
            </div>
            <div>
              <h2 className="nb-foot-h">Contacto</h2>
              <p className="nb-small">
                <a href={`mailto:${META.correo}`} className="nb-link">{META.correo}</a>
              </p>
            </div>
          </div>
          <p className="nb-small nb-muted mt-8 pt-6" style={{ borderTop: '1px solid var(--nb-border)' }}>
            Process + Technology + People = Growth · Propuesta elaborada en {META.fecha} · Uso confidencial
          </p>
        </div>
      </footer>

      {/* ── BARRA INFERIOR (solo móvil) ── */}
      <div className={`nb-sticky no-print${showBar ? ' is-visible' : ''}`} aria-hidden={!showBar}>
        <span className="nb-sticky-price">USD {PRECIO_USD.toLocaleString('es-CL')} · pago único</span>
        <Link to={DEMO_URL} className="nb-btn-primary" tabIndex={showBar ? 0 : -1}>Ver la demo</Link>
      </div>
    </div>
  );
};

export default NibecDespachosProposal;
