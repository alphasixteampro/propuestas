import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle, ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Info, RotateCcw, Search,
  Plus, Truck, Package, MapPin, Store, FileText, Loader2, Check, Undo2,
} from 'lucide-react';

// ─── TIPOS ───────────────────────────────────────────────────────────────────

type ColId = 'nuevos' | 'preparacion' | 'despacho' | 'ruta' | 'entregado';
type Tipo = 'despacho' | 'retiro';

interface Linea { producto: string; cantidad: number }

interface Pedido {
  id: string;
  documento: string;
  cliente: string;
  comuna: string;
  lineas: Linea[];
  total: number;
  tipo: Tipo;
  col: ColId;
  guia?: string;
}

interface Evento { id: number; hora: string; texto: string }

interface Aviso { cardId?: string; col?: ColId; texto: string }

// ─── CONSTANTES ──────────────────────────────────────────────────────────────

const ACCENT = '#FFAA00';
const INK = '#121212';
const WARM = '#3C382F';
const BLUE = '#1D70A2';
const GREEN = '#1E9E5A';

const COLUMNAS: { id: ColId; titulo: string; color: string; nota: string }[] = [
  { id: 'nuevos',      titulo: 'Nuevos',         color: INK,       nota: 'Llegó de Bsale' },
  { id: 'preparacion', titulo: 'En preparación', color: ACCENT,    nota: 'Se arma en bodega' },
  { id: 'despacho',    titulo: 'Despacho',       color: WARM,      nota: 'Se crea en Beetrack' },
  { id: 'ruta',        titulo: 'En ruta',        color: BLUE,      nota: 'Lo actualiza Beetrack' },
  { id: 'entregado',   titulo: 'Entregado',      color: GREEN,     nota: 'Lo actualiza Beetrack' },
];

const NOMBRE_COL: Record<ColId, string> = {
  nuevos: 'Nuevos',
  preparacion: 'En preparación',
  despacho: 'Despacho',
  ruta: 'En ruta',
  entregado: 'Entregado',
};

const COMUNAS = ['Pudahuel', 'Quilicura', 'Maipú', 'Las Condes', 'San Bernardo', 'Puente Alto', 'Viña del Mar', 'Rancagua', 'Concepción'];

const PRODUCTOS: { nombre: string; precio: number }[] = [
  { nombre: 'Estantería metálica 5 niveles 200x90x40', precio: 89900 },
  { nombre: 'Locker metálico 4 puertas', precio: 129900 },
  { nombre: 'Rack selectivo 2 cuerpos', precio: 219900 },
  { nombre: 'Estante liviano 4 bandejas', precio: 39900 },
  { nombre: 'Mesa de trabajo industrial', precio: 149900 },
  { nombre: 'Locker 12 casilleros', precio: 189900 },
  { nombre: 'Estantería de picking', precio: 99900 },
];

const CLIENTES = [
  'Ferretería El Roble SpA', 'Carolina Muñoz', 'Logística Andes Ltda.', 'Taller Mecánico Ruiz',
  'Matías Fuentes', 'Distribuidora Pacífico SpA', 'Andrea Soto', 'Bodegas del Sur Ltda.',
  'Constructora Valle Verde', 'Pedro Araya',
];

const formatoCLP = (n: number) => '$ ' + n.toLocaleString('es-CL');

const horaAhora = () =>
  new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false });

const nuevaGuia = () => 'BT-' + String(Math.floor(100000 + Math.random() * 900000));

const azar = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// ─── DATOS INICIALES ─────────────────────────────────────────────────────────

const SEMILLA: Pedido[] = [
  {
    id: 'p1', documento: 'Boleta 48213', cliente: 'Carolina Muñoz', comuna: 'Maipú',
    lineas: [{ producto: 'Estantería metálica 5 niveles 200x90x40', cantidad: 2 }, { producto: 'Estante liviano 4 bandejas', cantidad: 1 }],
    total: 219700, tipo: 'despacho', col: 'nuevos',
  },
  {
    id: 'p2', documento: 'Factura 10580', cliente: 'Ferretería El Roble SpA', comuna: 'Pudahuel',
    lineas: [{ producto: 'Rack selectivo 2 cuerpos', cantidad: 1 }],
    total: 219900, tipo: 'despacho', col: 'nuevos',
  },
  {
    id: 'p3', documento: 'Factura 10577', cliente: 'Logística Andes Ltda.', comuna: 'Quilicura',
    lineas: [{ producto: 'Locker metálico 4 puertas', cantidad: 3 }],
    total: 389700, tipo: 'despacho', col: 'preparacion',
  },
  {
    id: 'p4', documento: 'Boleta 48207', cliente: 'Taller Mecánico Ruiz', comuna: 'San Bernardo',
    lineas: [{ producto: 'Mesa de trabajo industrial', cantidad: 1 }, { producto: 'Estantería de picking', cantidad: 1 }],
    total: 249800, tipo: 'retiro', col: 'preparacion',
  },
  {
    id: 'p5', documento: 'Boleta 48199', cliente: 'Matías Fuentes', comuna: 'Viña del Mar',
    lineas: [{ producto: 'Locker 12 casilleros', cantidad: 1 }],
    total: 189900, tipo: 'despacho', col: 'despacho', guia: 'BT-482871',
  },
  {
    id: 'p6', documento: 'Factura 10566', cliente: 'Distribuidora Pacífico SpA', comuna: 'Rancagua',
    lineas: [{ producto: 'Estantería metálica 5 niveles 200x90x40', cantidad: 4 }, { producto: 'Estantería de picking', cantidad: 2 }],
    total: 559400, tipo: 'despacho', col: 'ruta', guia: 'BT-482790',
  },
  {
    id: 'p7', documento: 'Boleta 48190', cliente: 'Andrea Soto', comuna: 'Las Condes',
    lineas: [{ producto: 'Estante liviano 4 bandejas', cantidad: 2 }],
    total: 79800, tipo: 'retiro', col: 'entregado',
  },
];

const EVENTOS_INICIALES: Evento[] = [
  { id: 5, hora: '09:12', texto: 'Beetrack: Factura 10566 salió a ruta' },
  { id: 4, hora: '09:05', texto: 'Beetrack: se creó la guía BT-482871 para Boleta 48199' },
  { id: 3, hora: '08:58', texto: 'Lismari movió Boleta 48199 a Despacho' },
  { id: 2, hora: '08:41', texto: 'Lismari movió Factura 10577 a En preparación' },
  { id: 1, hora: '08:30', texto: 'Bsale: llegó Factura 10580 de Ferretería El Roble SpA' },
];

// ─── ESTILOS (tokens y clases con alcance .nb, según nibec.cl) ───────────────

const ESTILOS = `
.nb {
  --nb-bg: #FFFFFF;
  --nb-surface: #F5F5F5;
  --nb-surface-2: #EDEDED;
  --nb-border: #E5E5E5;
  --nb-ink: #121212;
  --nb-text: rgba(18,18,18,.75);
  --nb-muted: #5C5C5C;
  --nb-amber: #FFAA00;
  --nb-amber-hover: #E89B00;
  --nb-amber-soft: #FFC16F;
  --nb-amber-tint: rgba(255,170,0,.3);
  --nb-charcoal: #3C382F;
  --nb-charcoal-2: #363229;
  --nb-red: #C4301C;
  --nb-red-bg: #FDECEA;
  --nb-green: #1E7F4F;
  --nb-ease: 150ms ease-out;
  min-height: 100vh;
  overflow-x: hidden;
  background: var(--nb-bg);
  color: var(--nb-ink);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  line-height: 1.5;
}
.nb button, .nb input { font-family: inherit; }
.nb-container { max-width: 1300px; margin-inline: auto; padding-inline: 16px; }
.nb-muted { color: var(--nb-muted); }
.nb-small { font-size: .875rem; line-height: 1.5; }

/* Barra de anuncio */
.nb-announce { background: #121212; color: #FFFFFF; font-size: 14px; line-height: 1.5; text-align: center; padding: 8px 16px; }

/* Encabezado */
.nb-header { background: var(--nb-bg); border-bottom: 1px solid var(--nb-border); }
.nb-header-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 16px; padding-block: 12px; }
.nb-logo { height: 36px; width: auto; }
.nb-h1 { font-size: 1.25rem; line-height: 1.25; font-weight: 700; letter-spacing: .6px; color: var(--nb-ink); }
.nb-back { order: 2; margin-left: auto; }
.nb-search { order: 3; flex: 1 1 100%; position: relative; }
.nb-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--nb-muted); pointer-events: none; }
.nb-search-input {
  width: 100%; min-height: 44px; padding: 10px 16px 10px 44px; border: 0; border-radius: 25px;
  background: var(--nb-surface-2); color: var(--nb-ink); font-size: .875rem;
  transition: background-color var(--nb-ease);
}
.nb-search-input::placeholder { color: var(--nb-muted); opacity: 1; }
.nb-search-input:hover { background: var(--nb-border); }
.nb-search-input:focus { outline: none; }
.nb-search-input:focus-visible { outline: 2px solid var(--nb-ink); outline-offset: 2px; }

/* Botones */
.nb-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 44px; padding: 12px 16px; border: 1px solid transparent;
  font-size: .875rem; font-weight: 700; line-height: 1.25; text-align: center; text-decoration: none; cursor: pointer;
  transition: background-color var(--nb-ease), color var(--nb-ease), transform var(--nb-ease);
}
.nb-btn:active:not(:disabled) { transform: translateY(1px); }
.nb-btn:disabled { opacity: .5; cursor: not-allowed; }
.nb-btn-block { width: 100%; }
.nb-btn-primary { background: var(--nb-amber); color: var(--nb-ink); border-radius: 25px; padding: 12px 24px; }
.nb-btn-primary:hover:not(:disabled) { background: var(--nb-amber-hover); }
.nb-btn-primary:focus-visible { outline: 2px solid var(--nb-ink); outline-offset: 2px; }
.nb-btn-dark { background: var(--nb-ink); color: #FFFFFF; border-radius: 8px; }
.nb-btn-dark:hover:not(:disabled) { background: var(--nb-charcoal-2); }
.nb-btn-dark:focus-visible { outline: 2px solid var(--nb-ink); outline-offset: 2px; }
.nb-btn-ghost { background: #FFFFFF; color: var(--nb-ink); border-color: rgba(18,18,18,.2); border-radius: 8px; }
.nb-btn-ghost:hover:not(:disabled) { background: var(--nb-surface); }
.nb-btn-ghost:focus-visible { outline: 2px solid var(--nb-ink); outline-offset: 2px; }
.nb-link {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  min-height: 44px; padding: 0 8px; border: 0; border-radius: 8px; background: none;
  color: var(--nb-muted); font-size: .875rem; font-weight: 600; cursor: pointer;
  transition: color var(--nb-ease);
}
.nb-link:hover { color: var(--nb-ink); text-decoration: underline; text-underline-offset: 3px; }
.nb-link:active { color: var(--nb-ink); }
.nb-link:focus-visible { outline: 2px solid var(--nb-ink); outline-offset: 2px; }

/* Layout principal */
.nb-main { display: flex; flex-direction: column; gap: 24px; padding-block: 24px 64px; }
.nb-layout { display: grid; grid-template-columns: minmax(0, 1fr); gap: 24px; align-items: start; }

/* Promo bar */
.nb-promo { background: var(--nb-amber-soft); color: var(--nb-ink); border-radius: 12px; }
.nb-promo-btn {
  display: flex; align-items: center; gap: 12px; width: 100%; min-height: 48px; padding: 12px 24px;
  border: 0; border-radius: 12px; background: none; color: var(--nb-ink); text-align: left; cursor: pointer;
  transition: background-color var(--nb-ease);
}
.nb-promo-btn:hover { background: rgba(18,18,18,.06); }
.nb-promo-btn:active { background: rgba(18,18,18,.1); }
.nb-promo-btn:focus-visible { outline: 2px solid var(--nb-ink); outline-offset: -4px; }
.nb-promo-title { flex: 1; font-weight: 700; }
.nb-promo-list { list-style: disc; padding: 0 24px 16px 48px; margin: 0; max-width: 65ch; line-height: 1.7; font-size: 1rem; }
.nb-promo-list li + li { margin-top: 4px; }

/* Conexiones y acciones */
.nb-toolbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; }
.nb-trust { display: flex; flex-wrap: wrap; gap: 8px 24px; }
.nb-trust-item { display: inline-flex; align-items: center; gap: 8px; font-size: .875rem; }
.nb-trust-item strong { font-weight: 700; color: var(--nb-ink); }
.nb-actions { display: flex; flex-wrap: wrap; gap: 12px; }
.nb-dot { display: inline-block; width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.nb-dot-ok { width: 10px; height: 10px; background: var(--nb-green); }

/* Tablero */
.nb-board-scroll { overflow-x: auto; padding-bottom: 12px; }
.nb-board { display: flex; gap: 12px; width: max-content; }
.nb-col {
  width: 280px; flex-shrink: 0; min-height: 320px; padding: 12px; border-radius: 12px;
  background: var(--nb-surface); display: flex; flex-direction: column; gap: 12px;
  transition: background-color var(--nb-ease);
}
.nb-col.is-over { background: var(--nb-amber-tint); }
.nb-col-head { display: flex; align-items: center; gap: 8px; }
.nb-col-title { flex: 1; font-size: 1rem; line-height: 1.25; font-weight: 700; color: var(--nb-ink); }
.nb-col-note { margin-top: 4px; }
.nb-count { min-width: 28px; padding: 2px 8px; border-radius: 25px; background: var(--nb-surface-2); color: var(--nb-ink); font-size: .875rem; font-weight: 700; text-align: center; }
.nb-empty { padding: 16px; border: 1px dashed #A8A8A8; border-radius: 8px; color: var(--nb-muted); font-size: .875rem; text-align: center; }

/* Tarjetas */
.nb-card {
  display: flex; flex-direction: column; gap: 8px; padding: 16px;
  background: #FFFFFF; border: 1px solid var(--nb-border); border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,.06); cursor: grab;
  transition: border-color var(--nb-ease);
}
.nb-card:active { cursor: grabbing; }
.nb-card.is-new { border-color: var(--nb-amber); }
.nb-card.is-drag { outline: 2px solid var(--nb-amber); outline-offset: 0; }
.nb-card-top { display: flex; align-items: flex-start; gap: 8px; }
.nb-card-icon { margin-top: 2px; flex-shrink: 0; }
.nb-card-doc { font-weight: 700; line-height: 1.25; color: var(--nb-ink); }
.nb-card-client { font-size: .875rem; color: var(--nb-text); overflow-wrap: anywhere; }
.nb-card-loc { display: flex; align-items: center; gap: 6px; }
.nb-lines { list-style: none; margin: 0; padding: 0; color: var(--nb-text); display: flex; flex-direction: column; gap: 2px; }
.nb-lines li { display: flex; gap: 6px; }
.nb-qty { flex-shrink: 0; font-weight: 700; color: var(--nb-ink); }
.nb-card-foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; }
.nb-price { font-weight: 600; color: var(--nb-ink); }
.nb-chip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 25px; background: var(--nb-surface-2); color: var(--nb-ink); font-size: .75rem; font-weight: 600; }
.nb-chip-amber { background: #FFF4D6; color: #7A4E00; }
.nb-new { padding: 2px 8px; border-radius: 8px; background: var(--nb-amber); color: var(--nb-ink); font-size: .75rem; font-weight: 700; }
.nb-sending { display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--nb-ink); }
.nb-guia { display: flex; align-items: center; gap: 6px; padding: 8px; border-radius: 8px; background: #FFF4D6; color: #7A4E00; font-size: .875rem; font-weight: 700; }
.nb-card-actions { display: flex; flex-direction: column; gap: 8px; padding-top: 4px; }
.nb-hint { margin-top: 4px; }

/* Aviso de movimiento bloqueado */
.nb-alert { display: flex; align-items: flex-start; gap: 8px; padding: 8px 12px; border-radius: 8px; background: var(--nb-red-bg); color: var(--nb-red); font-size: .875rem; font-weight: 600; line-height: 1.4; }
.nb-alert svg { flex-shrink: 0; margin-top: 2px; }
.nb-alert-col { margin-top: 8px; }

/* Registro */
.nb-log { padding: 24px; background: #FFFFFF; border: 1px solid var(--nb-border); border-radius: 12px; }
.nb-log-title { margin-bottom: 8px; font-size: 1.125rem; line-height: 1.25; font-weight: 700; color: var(--nb-charcoal); }
.nb-log-list { margin: 0; padding: 0 4px 0 0; list-style: none; max-height: 480px; overflow-y: auto; }
.nb-log-item { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--nb-surface-2); font-size: .875rem; color: var(--nb-text); }
.nb-log-item:last-child { border-bottom: 0; }
.nb-log-time { flex-shrink: 0; font-weight: 600; font-variant-numeric: tabular-nums; color: var(--nb-muted); }

@media (min-width: 768px) {
  .nb-container { padding-inline: 32px; }
  .nb-logo { height: 44px; }
  .nb-h1 { font-size: 1.5rem; }
  .nb-search { order: 2; flex: 0 1 320px; margin-left: auto; }
  .nb-back { order: 3; margin-left: 0; }
}
@media (min-width: 1280px) {
  .nb-layout { grid-template-columns: minmax(0, 1fr) 320px; }
  .nb-log { position: sticky; top: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .nb *, .nb *::before, .nb *::after { transition: none !important; animation: none !important; }
  .nb-btn:active:not(:disabled) { transform: none; }
}
`;

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const NibecDespachosDemo: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>(SEMILLA);
  const [eventos, setEventos] = useState<Evento[]>(EVENTOS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [arrastrando, setArrastrando] = useState<string | null>(null);
  const [colSobre, setColSobre] = useState<ColId | null>(null);
  const [enviando, setEnviando] = useState<Set<string>>(new Set());
  const [resaltados, setResaltados] = useState<Set<string>>(new Set());
  const [aviso, setAviso] = useState<Aviso | null>(null);

  const contadorEvento = useRef(100);
  const contadorDoc = useRef({ boleta: 48214, factura: 10581 });
  const contadorId = useRef(100);
  const timers = useRef<number[]>([]);
  const pedidosRef = useRef<Pedido[]>(pedidos);
  pedidosRef.current = pedidos;

  const programar = (fn: () => void, ms: number) => {
    const t = window.setTimeout(fn, ms);
    timers.current.push(t);
    return t;
  };

  useEffect(() => () => { timers.current.forEach(window.clearTimeout); }, []);

  const registrar = useCallback((texto: string) => {
    contadorEvento.current += 1;
    const ev: Evento = { id: contadorEvento.current, hora: horaAhora(), texto };
    setEventos(prev => [ev, ...prev]);
  }, []);

  const mostrarAviso = (a: Aviso) => {
    setAviso(a);
    programar(() => setAviso(actual => (actual === a ? null : actual)), 3500);
  };

  const actualizar = (id: string, cambios: Partial<Pedido>) =>
    setPedidos(prev => prev.map(p => (p.id === id ? { ...p, ...cambios } : p)));

  // ─── Movimiento manual (arrastrar o botón) ────────────────────────────────

  const moverManual = (id: string, destino: ColId) => {
    const p = pedidosRef.current.find(x => x.id === id);
    if (!p || p.col === destino) return;

    if (enviando.has(id)) {
      mostrarAviso({ cardId: id, texto: 'Espera: se está enviando a Beetrack.' });
      return;
    }

    if (destino === 'ruta' || destino === 'entregado') {
      const texto = p.tipo === 'retiro' && destino === 'entregado'
        ? 'Los retiros se cierran con el botón "Marcar como entregado".'
        : 'Esta columna la actualiza Beetrack';
      mostrarAviso({ col: destino, cardId: id, texto });
      return;
    }

    if (destino === 'despacho') {
      if (p.tipo === 'retiro') {
        mostrarAviso({ cardId: id, col: destino, texto: 'Los retiros no van a Beetrack' });
        return;
      }
      if (p.col !== 'preparacion') {
        mostrarAviso({ cardId: id, col: destino, texto: 'Primero debe pasar por En preparación.' });
        return;
      }
      actualizar(id, { col: 'despacho', guia: undefined });
      registrar(`Lismari movió ${p.documento} a Despacho`);
      setEnviando(prev => new Set(prev).add(id));
      programar(() => {
        const guia = nuevaGuia();
        actualizar(id, { guia });
        setEnviando(prev => { const s = new Set(prev); s.delete(id); return s; });
        registrar(`Beetrack: se creó la guía ${guia} para ${p.documento}`);
      }, 1200);
      return;
    }

    if (p.col === 'despacho' || p.col === 'ruta' || p.col === 'entregado') {
      mostrarAviso({ cardId: id, col: destino, texto: 'Desde aquí solo Beetrack mueve el pedido.' });
      return;
    }

    // nuevos <-> preparacion
    actualizar(id, { col: destino });
    registrar(`Lismari movió ${p.documento} a ${NOMBRE_COL[destino]}`);
  };

  const marcarRetiroEntregado = (id: string) => {
    const p = pedidosRef.current.find(x => x.id === id);
    if (!p) return;
    actualizar(id, { col: 'entregado' });
    registrar(`Lismari marcó ${p.documento} como entregado (retiro en bodega)`);
  };

  // ─── Acciones de Beetrack simuladas ───────────────────────────────────────

  const beetrackSaleARuta = (id: string) => {
    const p = pedidosRef.current.find(x => x.id === id);
    if (!p) return;
    actualizar(id, { col: 'ruta' });
    registrar(`Beetrack: ${p.documento} salió a ruta`);
  };

  const beetrackEntrega = (id: string) => {
    const p = pedidosRef.current.find(x => x.id === id);
    if (!p) return;
    actualizar(id, { col: 'entregado' });
    registrar(`Beetrack: ${p.documento} entregada`);
  };

  // ─── Botones superiores ───────────────────────────────────────────────────

  const simularVenta = () => {
    const esFactura = Math.random() < 0.4;
    const documento = esFactura
      ? `Factura ${contadorDoc.current.factura++}`
      : `Boleta ${contadorDoc.current.boleta++}`;
    const cliente = esFactura
      ? azar(CLIENTES.filter(c => /SpA|Ltda|Constructora|Ferretería|Taller/.test(c)))
      : azar(CLIENTES.filter(c => !/SpA|Ltda|Constructora|Ferretería|Taller/.test(c)));
    const n = 1 + Math.floor(Math.random() * 2);
    const elegidos: typeof PRODUCTOS = [];
    while (elegidos.length < n) {
      const prod = azar(PRODUCTOS);
      if (!elegidos.includes(prod)) elegidos.push(prod);
    }
    const lineas: Linea[] = elegidos.map(pr => ({ producto: pr.nombre, cantidad: 1 + Math.floor(Math.random() * 3) }));
    const total = elegidos.reduce((s, pr, i) => s + pr.precio * lineas[i].cantidad, 0);
    contadorId.current += 1;
    const nuevo: Pedido = {
      id: 'p' + contadorId.current,
      documento, cliente,
      comuna: azar(COMUNAS),
      lineas, total,
      tipo: Math.random() < 0.25 ? 'retiro' : 'despacho',
      col: 'nuevos',
    };
    setPedidos(prev => [nuevo, ...prev]);
    registrar(`Bsale: llegó ${documento} de ${cliente}`);
    setResaltados(prev => new Set(prev).add(nuevo.id));
    programar(() => setResaltados(prev => { const s = new Set(prev); s.delete(nuevo.id); return s; }), 2500);
  };

  const reiniciar = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    contadorDoc.current = { boleta: 48214, factura: 10581 };
    contadorId.current = 100;
    contadorEvento.current = 100;
    setPedidos(SEMILLA);
    setEventos(EVENTOS_INICIALES);
    setBusqueda('');
    setEnviando(new Set());
    setResaltados(new Set());
    setAviso(null);
    setArrastrando(null);
    setColSobre(null);
  };

  // ─── Filtro ───────────────────────────────────────────────────────────────

  const q = busqueda.trim().toLowerCase();
  const visibles = q
    ? pedidos.filter(p => p.documento.toLowerCase().includes(q) || p.cliente.toLowerCase().includes(q))
    : pedidos;

  // ─── Render ───────────────────────────────────────────────────────────────

  useEffect(() => {
    const href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    const ya = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(l => l.getAttribute('href') === href);
    if (ya) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }, []);

  return (
    <div className="nb">
      <style>{ESTILOS}</style>

      {/* Barra de anuncio */}
      <div className="nb-announce">Demo con datos ficticios · así se vería el tablero de Nibec</div>

      {/* Encabezado */}
      <header className="nb-header">
        <div className="nb-container nb-header-row">
          <img src="/Logo nibec.png" alt="Nibec" className="nb-logo" />
          <h1 className="nb-h1">Tablero de Despachos</h1>
          <Link to="/nibec-despachos" aria-label="Volver a la propuesta" className="nb-btn nb-btn-ghost nb-back">
            <ArrowLeft size={16} aria-hidden="true" /> Volver a la propuesta
          </Link>
          <div className="nb-search">
            <Search size={16} className="nb-search-icon" aria-hidden="true" />
            <input
              type="search"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar N° de documento o cliente"
              aria-label="Buscar por número de documento o cliente"
              className="nb-search-input"
            />
          </div>
        </div>
      </header>

      <main className="nb-container nb-main">
        {/* Panel explicativo */}
        <section className="nb-promo">
          <button
            type="button"
            onClick={() => setPanelAbierto(o => !o)}
            aria-expanded={panelAbierto}
            aria-controls="panel-que-ves"
            aria-label="Mostrar u ocultar: ¿Qué estás viendo?"
            className="nb-promo-btn"
          >
            <Info size={20} aria-hidden="true" />
            <span className="nb-promo-title">¿Qué estás viendo?</span>
            {panelAbierto ? <ChevronUp size={20} aria-hidden="true" /> : <ChevronDown size={20} aria-hidden="true" />}
          </button>
          {panelAbierto && (
            <ul id="panel-que-ves" className="nb-promo-list">
              <li>Los pedidos llegan solos desde Bsale, apenas se emite la boleta o factura.</li>
              <li>Cuando una tarjeta llega a Despacho, se crea sola en Beetrack y recibe su N° de guía.</li>
              <li>Beetrack mueve la tarjeta a En ruta y a Entregado por sí mismo.</li>
            </ul>
          )}
        </section>

        {/* Conexiones y acciones */}
        <section className="nb-toolbar">
          <div className="nb-trust" role="group" aria-label="Estado de las conexiones">
            {['Bsale', 'Beetrack'].map(nombre => (
              <span key={nombre} className="nb-trust-item">
                <span className="nb-dot nb-dot-ok" aria-hidden="true" />
                <strong>{nombre}</strong>
                <span className="nb-muted">conectado</span>
              </span>
            ))}
          </div>

          <div className="nb-actions">
            <button
              type="button"
              onClick={simularVenta}
              aria-label="Simular una venta nueva en Bsale"
              className="nb-btn nb-btn-primary"
            >
              <Plus size={16} aria-hidden="true" /> Simular venta nueva en Bsale
            </button>
            <button
              type="button"
              onClick={reiniciar}
              aria-label="Reiniciar la demo"
              className="nb-btn nb-btn-ghost"
            >
              <RotateCcw size={16} aria-hidden="true" /> Reiniciar demo
            </button>
          </div>
        </section>

        {/* Tablero + Registro */}
        <div className="nb-layout">
          {/* Tablero */}
          <section aria-label="Tablero de pedidos" className="min-w-0">
            <div className="nb-board-scroll">
              <div className="nb-board">
                {COLUMNAS.map(col => {
                  const tarjetas = visibles.filter(p => p.col === col.id);
                  const sobre = colSobre === col.id;
                  return (
                    <div
                      key={col.id}
                      role="group"
                      aria-label={`Columna ${col.titulo}, ${tarjetas.length} pedidos`}
                      onDragOver={e => { if (arrastrando) { e.preventDefault(); setColSobre(col.id); } }}
                      onDragLeave={() => setColSobre(c => (c === col.id ? null : c))}
                      onDrop={e => {
                        e.preventDefault();
                        const id = e.dataTransfer.getData('text/plain') || arrastrando;
                        setColSobre(null);
                        setArrastrando(null);
                        if (id) moverManual(id, col.id);
                      }}
                      className={'nb-col' + (sobre ? ' is-over' : '')}
                    >
                      <div>
                        <div className="nb-col-head">
                          <span className="nb-dot" style={{ background: col.color }} aria-hidden="true" />
                          <h2 className="nb-col-title">{col.titulo}</h2>
                          <span className="nb-count">{tarjetas.length}</span>
                        </div>
                        <p className="nb-small nb-muted nb-col-note">{col.nota}</p>
                        {aviso?.col === col.id && (
                          <div role="status" className="nb-alert nb-alert-col">
                            <AlertCircle size={16} aria-hidden="true" />
                            <span>{aviso.texto}</span>
                          </div>
                        )}
                      </div>

                      {tarjetas.length === 0 && (
                        <p className="nb-empty">Sin pedidos</p>
                      )}

                      {tarjetas.map(p => {
                        const estaEnviando = enviando.has(p.id);
                        const resaltada = resaltados.has(p.id);
                        const avisoTarjeta = aviso?.cardId === p.id && !aviso.col ? aviso : null;
                        const avisoRetiro = aviso?.cardId === p.id && aviso.col === 'despacho' && p.tipo === 'retiro' ? aviso : null;
                        return (
                          <article
                            key={p.id}
                            draggable={!estaEnviando}
                            onDragStart={e => {
                              e.dataTransfer.setData('text/plain', p.id);
                              e.dataTransfer.effectAllowed = 'move';
                              setArrastrando(p.id);
                            }}
                            onDragEnd={() => { setArrastrando(null); setColSobre(null); }}
                            aria-label={`${p.documento}, ${p.cliente}, en ${col.titulo}`}
                            className={'nb-card' + (arrastrando === p.id ? ' is-drag' : '') + (resaltada ? ' is-new' : '')}
                          >
                            <div className="nb-card-top">
                              <FileText size={16} className="nb-card-icon" style={{ color: col.color }} aria-hidden="true" />
                              <div className="min-w-0 flex-1">
                                <p className="nb-card-doc">{p.documento}</p>
                                <p className="nb-card-client">{p.cliente}</p>
                              </div>
                              {resaltada && <span className="nb-new">NUEVO</span>}
                            </div>

                            <p className="nb-small nb-muted nb-card-loc">
                              <MapPin size={14} aria-hidden="true" /> {p.comuna}
                            </p>

                            <ul className="nb-small nb-lines">
                              {p.lineas.map(l => (
                                <li key={l.producto}>
                                  <span className="nb-qty">{l.cantidad}×</span>
                                  <span className="break-words">{l.producto}</span>
                                </li>
                              ))}
                            </ul>

                            <div className="nb-card-foot">
                              <span className="nb-price">{formatoCLP(p.total)}</span>
                              {p.tipo === 'despacho' ? (
                                <span className="nb-chip">
                                  <Truck size={12} aria-hidden="true" /> Despacho
                                </span>
                              ) : (
                                <span className="nb-chip nb-chip-amber">
                                  <Store size={12} aria-hidden="true" /> Retiro en bodega
                                </span>
                              )}
                            </div>

                            {estaEnviando && (
                              <p className="nb-small nb-sending" role="status">
                                <Loader2 size={14} className="animate-spin" aria-hidden="true" /> Enviando a Beetrack…
                              </p>
                            )}

                            {p.guia && !estaEnviando && (
                              <p className="nb-guia">
                                <Package size={14} aria-hidden="true" /> Guía Beetrack {p.guia}
                              </p>
                            )}

                            {(avisoTarjeta || avisoRetiro) && (
                              <div role="status" className="nb-alert">
                                <AlertCircle size={16} aria-hidden="true" />
                                <span>{(avisoTarjeta || avisoRetiro)!.texto}</span>
                              </div>
                            )}

                            {/* Acciones por columna */}
                            <div className="nb-card-actions">
                              {p.col === 'nuevos' && (
                                <button
                                  type="button"
                                  onClick={() => moverManual(p.id, 'preparacion')}
                                  aria-label={`Mover ${p.documento} a En preparación`}
                                  className="nb-btn nb-btn-primary nb-btn-block"
                                >
                                  Mover <ArrowRight size={16} aria-hidden="true" />
                                </button>
                              )}

                              {p.col === 'preparacion' && (
                                <>
                                  {p.tipo === 'despacho' ? (
                                    <button
                                      type="button"
                                      onClick={() => moverManual(p.id, 'despacho')}
                                      aria-label={`Mover ${p.documento} a Despacho`}
                                      className="nb-btn nb-btn-primary nb-btn-block"
                                    >
                                      Mover <ArrowRight size={16} aria-hidden="true" />
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => marcarRetiroEntregado(p.id)}
                                        aria-label={`Marcar ${p.documento} como entregado`}
                                        className="nb-btn nb-btn-dark nb-btn-block"
                                      >
                                        <Check size={16} aria-hidden="true" /> Marcar como entregado
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => moverManual(p.id, 'despacho')}
                                        aria-label={`Probar mover ${p.documento} a Despacho`}
                                        className="nb-link"
                                      >
                                        Probar enviar a Despacho
                                      </button>
                                    </>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => moverManual(p.id, 'nuevos')}
                                    aria-label={`Devolver ${p.documento} a Nuevos`}
                                    className="nb-link"
                                  >
                                    <Undo2 size={14} aria-hidden="true" /> Volver a Nuevos
                                  </button>
                                </>
                              )}

                              {p.col === 'despacho' && (
                                <button
                                  type="button"
                                  disabled={estaEnviando}
                                  onClick={() => beetrackSaleARuta(p.id)}
                                  aria-label={`Simular: Beetrack saca a ruta ${p.documento}`}
                                  className="nb-btn nb-btn-dark nb-btn-block"
                                >
                                  Simular: Beetrack sale a ruta
                                </button>
                              )}

                              {p.col === 'ruta' && (
                                <button
                                  type="button"
                                  onClick={() => beetrackEntrega(p.id)}
                                  aria-label={`Simular: Beetrack entrega ${p.documento}`}
                                  className="nb-btn nb-btn-dark nb-btn-block"
                                >
                                  Simular: Beetrack entrega
                                </button>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="nb-small nb-muted nb-hint">
              Arrastra las tarjetas entre columnas, o usa el botón &laquo;Mover&raquo; (sirve en celular).
            </p>
          </section>

          {/* Registro */}
          <aside aria-label="Registro de eventos" className="nb-log">
            <h2 className="nb-log-title">Registro</h2>
            <ol aria-live="polite" className="nb-log-list">
              {eventos.map(ev => (
                <li key={ev.id} className="nb-log-item">
                  <time className="nb-log-time">{ev.hora}</time>
                  <span className="break-words min-w-0">{ev.texto}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default NibecDespachosDemo;
