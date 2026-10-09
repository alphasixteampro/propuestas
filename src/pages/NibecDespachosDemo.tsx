import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle, ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Info, RotateCcw, Search,
  Plus, Truck, Package, MapPin, Store, FileText, Loader2, Check, Undo2, Clock, Printer, X,
} from 'lucide-react';

// ─── TIPOS ───────────────────────────────────────────────────────────────────

type ColId = 'nuevos' | 'preparacion' | 'despacho' | 'ruta' | 'entregado';
type Tipo = 'despacho' | 'retiro';
type Filtro = 'todos' | 'atrasados' | 'despacho' | 'retiro' | 'error' | 'porDespachar';

interface Linea { producto: string; cantidad: number }

interface Pedido {
  id: string;
  documento: string;
  cliente: string;
  comuna: string;
  direccion: string;
  lineas: Linea[];
  total: number;
  tipo: Tipo;
  col: ColId;
  creadoEn: number;
  guia?: string;
  /** Bsale mandó la dirección sin número: Beetrack va a rechazar el despacho. */
  direccionIncompleta?: boolean;
  /** Beetrack rechazó el despacho y la tarjeta espera un reintento. */
  error?: boolean;
}

interface Evento { id: number; hora: string; texto: string }

interface Aviso { cardId?: string; col?: ColId; texto: string }

interface ColDef { id: ColId; titulo: string; color: string; nota: string }

interface ToastData { key: number; texto: string; accion: string; onAccion: () => void; tono?: 'error' }

// ─── CONSTANTES ──────────────────────────────────────────────────────────────

const ACCENT = '#FFAA00';
const INK = '#121212';
const WARM = '#3C382F';
const BLUE = '#1D70A2';
const GREEN = '#1E9E5A';

const MIN = 60 * 1000;
const HORA = 60 * MIN;
const DIA = 24 * HORA;

const COLUMNAS: ColDef[] = [
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

const NOMBRE_FILTRO: Record<Filtro, string> = {
  todos: 'Todos',
  atrasados: 'Atrasados',
  despacho: 'Despacho',
  retiro: 'Retiro en bodega',
  error: 'Con error',
  porDespachar: 'Por despachar',
};

const CHIPS: Filtro[] = ['todos', 'atrasados', 'despacho', 'retiro', 'error'];

const COMUNAS = ['Pudahuel', 'Quilicura', 'Maipú', 'Las Condes', 'San Bernardo', 'Puente Alto', 'Viña del Mar', 'Rancagua', 'Concepción'];

const CALLES = ['Av. Los Pajaritos', 'Camino Lo Boza', 'Av. Vicuña Mackenna', 'Los Aromos', 'Av. Independencia', 'Calle Larga', 'Av. Santa Rosa'];

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

/** "recién", "hace 12 min", "hace 3 h", "hace 1 día" */
const hace = (ms: number): string => {
  const t = Math.max(0, ms);
  if (t < MIN) return 'recién';
  if (t < HORA) return `hace ${Math.floor(t / MIN)} min`;
  if (t < DIA) return `hace ${Math.floor(t / HORA)} h`;
  const d = Math.floor(t / DIA);
  return `hace ${d} ${d === 1 ? 'día' : 'días'}`;
};

const esAtrasado = (p: Pedido, ahora: number) =>
  (p.col === 'nuevos' || p.col === 'preparacion') && ahora - p.creadoEn > DIA;

const esPorDespachar = (p: Pedido) =>
  (p.col === 'nuevos' || p.col === 'preparacion') && p.tipo === 'despacho';

const coincideFiltro = (p: Pedido, f: Filtro, ahora: number): boolean => {
  switch (f) {
    case 'atrasados': return esAtrasado(p, ahora);
    case 'despacho': return p.tipo === 'despacho';
    case 'retiro': return p.tipo === 'retiro';
    case 'error': return !!p.error;
    case 'porDespachar': return esPorDespachar(p);
    default: return true;
  }
};

const precioDe = (producto: string) => PRODUCTOS.find(x => x.nombre === producto)?.precio ?? 0;

// ─── DATOS INICIALES ─────────────────────────────────────────────────────────

const crearSemilla = (ahora: number): Pedido[] => [
  {
    id: 'p1', documento: 'Boleta 48213', cliente: 'Carolina Muñoz', comuna: 'Maipú',
    direccion: 'Los Aromos 1520, Maipú',
    lineas: [{ producto: 'Estantería metálica 5 niveles 200x90x40', cantidad: 2 }, { producto: 'Estante liviano 4 bandejas', cantidad: 1 }],
    total: 219700, tipo: 'despacho', col: 'nuevos', creadoEn: ahora - 1 * HORA,
  },
  {
    id: 'p2', documento: 'Factura 10580', cliente: 'Ferretería El Roble SpA', comuna: 'Pudahuel',
    direccion: 'Av. San Pablo 7890, Pudahuel',
    lineas: [{ producto: 'Rack selectivo 2 cuerpos', cantidad: 1 }],
    total: 219900, tipo: 'despacho', col: 'nuevos', creadoEn: ahora - 26 * HORA,
  },
  {
    id: 'p3', documento: 'Factura 10577', cliente: 'Logística Andes Ltda.', comuna: 'Quilicura',
    direccion: 'Av. Lo Echevers 550, Quilicura',
    lineas: [{ producto: 'Locker metálico 4 puertas', cantidad: 3 }],
    total: 389700, tipo: 'despacho', col: 'preparacion', creadoEn: ahora - 30 * HORA,
  },
  {
    id: 'p4', documento: 'Boleta 48207', cliente: 'Taller Mecánico Ruiz', comuna: 'San Bernardo',
    direccion: '',
    lineas: [{ producto: 'Mesa de trabajo industrial', cantidad: 1 }, { producto: 'Estantería de picking', cantidad: 1 }],
    total: 249800, tipo: 'retiro', col: 'preparacion', creadoEn: ahora - 2 * HORA,
  },
  {
    id: 'p8', documento: 'Boleta 48230', cliente: 'Constructora Pérez Ltda.', comuna: 'Puente Alto',
    direccion: 'Av. Concha y Toro (sin número), Puente Alto',
    lineas: [{ producto: 'Estantería de picking', cantidad: 2 }, { producto: 'Estante liviano 4 bandejas', cantidad: 1 }],
    total: 239700, tipo: 'despacho', col: 'preparacion', creadoEn: ahora - 90 * MIN,
    direccionIncompleta: true,
  },
  {
    id: 'p5', documento: 'Boleta 48199', cliente: 'Matías Fuentes', comuna: 'Viña del Mar',
    direccion: 'Av. Libertad 1045, Viña del Mar',
    lineas: [{ producto: 'Locker 12 casilleros', cantidad: 1 }],
    total: 189900, tipo: 'despacho', col: 'despacho', guia: 'BT-482871', creadoEn: ahora - 5 * HORA,
  },
  {
    id: 'p6', documento: 'Factura 10566', cliente: 'Distribuidora Pacífico SpA', comuna: 'Rancagua',
    direccion: 'Av. Brasil 320, Rancagua',
    lineas: [{ producto: 'Estantería metálica 5 niveles 200x90x40', cantidad: 4 }, { producto: 'Estantería de picking', cantidad: 2 }],
    total: 559400, tipo: 'despacho', col: 'ruta', guia: 'BT-482790', creadoEn: ahora - 9 * HORA,
  },
  {
    id: 'p7', documento: 'Boleta 48190', cliente: 'Andrea Soto', comuna: 'Las Condes',
    direccion: '',
    lineas: [{ producto: 'Estante liviano 4 bandejas', cantidad: 2 }],
    total: 79800, tipo: 'retiro', col: 'entregado', creadoEn: ahora - 20 * HORA,
  },
];

const EVENTOS_INICIALES: Evento[] = [
  { id: 6, hora: '09:20', texto: 'Bsale: llegó Boleta 48230 de Constructora Pérez Ltda.' },
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
  overflow-x: clip;
  background: var(--nb-bg);
  color: var(--nb-ink);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  line-height: 1.5;
}
.nb button, .nb input { font-family: inherit; }
.nb-container { max-width: 1300px; margin-inline: auto; padding-inline: 16px; }
.nb-muted { color: var(--nb-muted); }
.nb-small { font-size: .875rem; line-height: 1.5; }
.nb-sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

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
.nb-main.has-bar { padding-bottom: 200px; }
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

/* Resumen */
.nb-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.nb-stat {
  display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between; gap: 4px;
  min-height: 44px; padding: 12px; border: 2px solid var(--nb-border); border-radius: 12px;
  background: var(--nb-surface); color: var(--nb-ink); text-align: left; cursor: pointer;
  transition: background-color var(--nb-ease), border-color var(--nb-ease);
}
.nb-stat:hover { background: var(--nb-surface-2); }
.nb-stat:focus-visible { outline: 2px solid var(--nb-ink); outline-offset: 2px; }
.nb-stat[aria-pressed="true"] { border-color: var(--nb-ink); }
.nb-stat-label { display: flex; align-items: flex-start; gap: 6px; font-size: .875rem; font-weight: 600; line-height: 1.25; }
.nb-stat-label svg { flex-shrink: 0; margin-top: 1px; }
.nb-stat-num { font-size: 1.5rem; line-height: 1.1; font-weight: 700; font-variant-numeric: tabular-nums; }
.nb-stat.is-late { background: var(--nb-amber-soft); }
.nb-stat.is-late:hover { background: #FFB85C; }
.nb-stat.is-error { background: var(--nb-red-bg); color: var(--nb-red); }
.nb-stat.is-error:hover { background: #FAD9D4; }

/* Conexiones y acciones */
.nb-toolbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; }
.nb-trust { display: flex; flex-wrap: wrap; gap: 8px 24px; }
.nb-trust-item { display: inline-flex; align-items: center; gap: 8px; font-size: .875rem; }
.nb-trust-item strong { font-weight: 700; color: var(--nb-ink); }
.nb-actions { display: flex; flex-wrap: wrap; gap: 12px; }
.nb-dot { display: inline-block; width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.nb-dot-ok { width: 10px; height: 10px; background: var(--nb-green); }

/* Filtros rápidos */
.nb-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.nb-filter {
  min-height: 44px; padding: 0 16px; border: 0; border-radius: 25px;
  background: var(--nb-surface-2); color: var(--nb-ink); font-size: .875rem; font-weight: 600; cursor: pointer;
  transition: background-color var(--nb-ease), color var(--nb-ease);
}
.nb-filter:hover { background: var(--nb-border); }
.nb-filter[aria-pressed="true"] { background: var(--nb-ink); color: #FFFFFF; }
.nb-filter[aria-pressed="true"]:hover { background: var(--nb-charcoal-2); }
.nb-filter:focus-visible { outline: 2px solid var(--nb-ink); outline-offset: 2px; }

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
  box-shadow: 0 1px 2px rgba(0,0,0,.06);
  transition: border-color var(--nb-ease);
}
.nb-card.is-draggable { cursor: grab; }
.nb-card.is-draggable:active { cursor: grabbing; }
.nb-card.is-new { border-color: var(--nb-amber); }
.nb-card.is-error { border-color: var(--nb-red); }
.nb-card.is-drag { outline: 2px solid var(--nb-amber); outline-offset: 0; }
.nb-card-top { display: flex; align-items: flex-start; gap: 8px; }
.nb-card-icon { margin-top: 2px; flex-shrink: 0; }
.nb-card-title {
  display: block; flex: 1; min-width: 0; min-height: 44px; margin: 0; padding: 0; border: 0; border-radius: 8px;
  background: none; color: inherit; text-align: left; cursor: pointer;
}
.nb-card-title > span { display: block; }
.nb-card-title:hover .nb-card-doc { text-decoration: underline; text-underline-offset: 3px; }
.nb-card-title:focus-visible { outline: 2px solid var(--nb-ink); outline-offset: 2px; }
.nb-card-doc { font-weight: 700; line-height: 1.25; color: var(--nb-ink); }
.nb-card-client { font-size: .875rem; color: var(--nb-text); overflow-wrap: anywhere; }
.nb-card-loc { display: flex; align-items: center; gap: 6px; }
.nb-age { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; }
.nb-late { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 8px; background: var(--nb-amber-soft); color: #121212; font-size: .75rem; font-weight: 700; }
.nb-check { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; width: 44px; height: 44px; margin-left: -8px; cursor: pointer; }
.nb-check input { width: 24px; height: 24px; margin: 0; accent-color: #121212; cursor: pointer; }
.nb-check input:focus-visible { outline: 2px solid var(--nb-ink); outline-offset: 2px; }
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

/* Aviso de movimiento bloqueado y errores */
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

/* Barra de selección múltiple y aviso con deshacer (apilados abajo: el aviso queda sobre la barra) */
.nb-dock { position: fixed; left: 0; right: 0; bottom: 0; z-index: 35; display: flex; flex-direction: column; align-items: flex-start; pointer-events: none; }
.nb-toasts { display: flex; width: 100%; padding: 0 16px 16px; padding-bottom: calc(16px + env(safe-area-inset-bottom)); }
.nb-toasts:empty { padding: 0; }
.nb-dock.has-bar .nb-toasts { padding-bottom: 8px; }
.nb-toast { pointer-events: auto; display: flex; flex-wrap: wrap; align-items: center; gap: 0 8px; max-width: min(460px, 100%); padding: 4px 8px 4px 16px; border-radius: 12px; background: #121212; color: #FFFFFF; font-size: .875rem; }
.nb-toast-text { padding-block: 8px; }
.nb-toast-undo { min-height: 44px; padding: 0 12px; border: 0; border-radius: 8px; background: none; color: var(--nb-amber); font-size: .875rem; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
.nb-toast-undo:hover { color: var(--nb-amber-soft); }
.nb-toast-undo:focus-visible { outline: 2px solid #FFFFFF; outline-offset: 2px; }
.nb-bar { pointer-events: auto; width: 100%; padding: 12px 0; padding-bottom: calc(12px + env(safe-area-inset-bottom)); background: #FFFFFF; border-top: 1px solid var(--nb-border); box-shadow: 0 -4px 12px rgba(18,18,18,.12); }
.nb-bar-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; }
.nb-bar-text { flex: 1 1 160px; font-weight: 700; }

/* Panel de detalle */
.nb-overlay { position: fixed; inset: 0; z-index: 40; padding: 0; border: 0; background: rgba(18,18,18,.4); cursor: default; }
.nb-drawer { position: fixed; top: 0; right: 0; bottom: 0; z-index: 50; display: flex; flex-direction: column; width: min(440px, 100%); background: #FFFFFF; border-left: 1px solid var(--nb-border); }
.nb-drawer-head { position: sticky; top: 0; z-index: 1; background: #FFFFFF; display: flex; align-items: flex-start; gap: 12px; padding: 16px 24px; border-bottom: 1px solid var(--nb-border); }
.nb-drawer-title { flex: 1; font-size: 1.25rem; line-height: 1.25; font-weight: 700; color: var(--nb-ink); }
.nb-drawer-title:focus { outline: none; }
.nb-drawer-body { flex: 1; display: flex; flex-direction: column; gap: 24px; padding: 24px; padding-bottom: calc(24px + env(safe-area-inset-bottom)); overflow-y: auto; }
.nb-sec-title { margin-bottom: 8px; font-size: 1rem; line-height: 1.25; font-weight: 700; color: var(--nb-charcoal); }
.nb-dl { display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 8px 12px; margin: 0; font-size: .875rem; }
.nb-dl dt { color: var(--nb-muted); }
.nb-dl dd { margin: 0; color: var(--nb-ink); overflow-wrap: anywhere; }
.nb-table-wrap { overflow-x: auto; }
.nb-table { width: 100%; border-collapse: collapse; font-size: .875rem; }
.nb-table th { padding: 8px 8px 8px 0; border-bottom: 1px solid var(--nb-border); text-align: left; font-weight: 600; color: var(--nb-muted); }
.nb-table td { padding: 8px 8px 8px 0; border-bottom: 1px solid var(--nb-surface-2); vertical-align: top; }
.nb-table .num { padding-right: 0; text-align: right; white-space: nowrap; }
.nb-table tfoot td { border-bottom: 0; font-weight: 700; }
.nb-timeline { position: relative; margin: 0; padding: 0 0 0 20px; list-style: none; }
.nb-timeline::before { content: ''; position: absolute; left: 4px; top: 14px; bottom: 14px; width: 2px; background: #3C382F; }
.nb-timeline li { position: relative; display: flex; gap: 12px; padding: 8px 0; font-size: .875rem; color: var(--nb-text); }
.nb-timeline li::before { content: ''; position: absolute; left: -20px; top: 13px; width: 10px; height: 10px; border-radius: 50%; background: #3C382F; }

/* Versión móvil: pestañas, menú Más, registro plegable */
.nb-btn-icon { width: 44px; padding: 0; }
.nb-tabs { position: sticky; top: 0; z-index: 20; display: flex; gap: 8px; margin-bottom: 8px; padding-block: 8px; overflow-x: auto; background: var(--nb-bg); border-bottom: 1px solid var(--nb-border); }
.nb-tab {
  display: inline-flex; align-items: center; gap: 8px; flex-shrink: 0; min-height: 44px; padding: 0 14px;
  border: 0; border-radius: 25px; background: var(--nb-surface-2); color: var(--nb-ink);
  font-size: .875rem; font-weight: 600; white-space: nowrap; cursor: pointer;
  transition: background-color var(--nb-ease), color var(--nb-ease);
}
.nb-tab[aria-selected="true"] { background: var(--nb-ink); color: #FFFFFF; }
.nb-tab:focus-visible { outline: 2px solid var(--nb-ink); outline-offset: 2px; }
.nb-tab-count { min-width: 24px; padding: 0 6px; border-radius: 25px; background: #FFFFFF; color: var(--nb-ink); font-size: .75rem; font-weight: 700; line-height: 1.5; text-align: center; font-variant-numeric: tabular-nums; transition: background-color var(--nb-ease), color var(--nb-ease); }
.nb-tab[aria-selected="true"] .nb-tab-count { background: #3C382F; color: #FFFFFF; }
.nb-tab .nb-tab-count.is-bump, .nb-tab[aria-selected="true"] .nb-tab-count.is-bump { background: var(--nb-amber); color: var(--nb-ink); }
.nb-more { position: relative; }
.nb-menu { position: absolute; right: 0; top: calc(100% + 4px); z-index: 25; min-width: 240px; max-width: calc(100vw - 32px); padding: 4px; background: #FFFFFF; border: 1px solid var(--nb-border); border-radius: 12px; }
.nb-menu-item { display: flex; align-items: center; gap: 8px; width: 100%; min-height: 44px; padding: 0 12px; border: 0; border-radius: 8px; background: none; color: var(--nb-ink); font-size: .875rem; font-weight: 600; text-align: left; cursor: pointer; transition: background-color var(--nb-ease); }
.nb-menu-item:hover { background: var(--nb-surface); }
.nb-menu-item:focus-visible { outline: 2px solid var(--nb-ink); outline-offset: -2px; }
.nb-log-toggle { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; min-height: 44px; padding: 0; border: 0; border-radius: 8px; background: none; color: inherit; font-size: inherit; font-weight: inherit; text-align: left; cursor: pointer; }
.nb-log-toggle:focus-visible { outline: 2px solid var(--nb-ink); outline-offset: 2px; }

/* Filas deslizables sin barra visible (anti-slop: la barra azul del sistema rompía la paleta) */
.nb-chips, .nb-tabs { scrollbar-width: none; -ms-overflow-style: none; }
.nb-chips::-webkit-scrollbar, .nb-tabs::-webkit-scrollbar { display: none; }
.nb-lbl-short { display: none; }

/* Lista imprimible (solo al imprimir) */
.nb-print { display: none; }

@media (max-width: 767px) {
  .nb-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); width: 100%; }
  .nb-actions .nb-btn { width: 100%; }
  .nb-toolbar { gap: 12px; }
  .nb-board-scroll { overflow-x: visible; padding-bottom: 0; }
  .nb-board { width: 100%; }
  .nb-col { width: 100%; min-height: 200px; }
  .nb-chips { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 4px; }
  .nb-filter { flex-shrink: 0; white-space: nowrap; }
  .nb-stats { gap: 8px; }
  .nb-stat { padding: 8px; }
  .nb-stat-label { font-size: .75rem; gap: 4px; }
  .nb-stat-num { font-size: 1.25rem; }
  .nb-drawer { width: 100%; border-left: 0; }
  .nb-drawer-head { padding: 8px 16px; align-items: center; }
  .nb-drawer-body { padding: 16px; padding-bottom: calc(16px + env(safe-area-inset-bottom)); }
  .nb-promo-btn { padding-inline: 16px; }
  .nb-log { padding: 12px 16px; }
  .nb-lbl-full { display: none; }
  .nb-lbl-short { display: inline; }
  /* En móvil la pestaña ya nombra la columna: el encabezado queda solo para lectores de pantalla */
  .nb-col-head { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  .nb-col { position: relative; }
  .nb-trust { gap: 4px 16px; }
  .nb-trust-item { font-size: .8125rem; }
  .nb-promo-btn { min-height: 44px; }
}
@media (min-width: 768px) {
  .nb-container { padding-inline: 32px; }
  .nb-logo { height: 44px; }
  .nb-h1 { font-size: 1.5rem; }
  .nb-search { order: 2; flex: 0 1 320px; margin-left: auto; }
  .nb-back { order: 3; margin-left: 0; }
  .nb-stat { padding: 16px; }
}
@media (min-width: 1280px) {
  .nb-layout { grid-template-columns: minmax(0, 1fr) 320px; }
  .nb-log { position: sticky; top: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .nb *, .nb *::before, .nb *::after { transition: none !important; animation: none !important; }
  .nb-btn:active:not(:disabled) { transform: none; }
}
@media print {
  .nb > *:not(.nb-print) { display: none !important; }
  .nb { min-height: 0; overflow: visible; background: #FFFFFF; }
  .nb-print { display: block !important; padding: 0; color: #000000; }
  .nb-print-title { margin: 0 0 4pt; font-size: 18pt; font-weight: 700; }
  .nb-print-date { margin: 0 0 12pt; font-size: 10pt; }
  .nb-print-table { width: 100%; border-collapse: collapse; font-size: 10pt; }
  .nb-print-table th, .nb-print-table td { padding: 4pt 6pt; border: 1px solid #000000; text-align: left; vertical-align: top; }
  .nb-print-table .tick { width: 36pt; text-align: center; }
  .nb-print-box { display: inline-block; width: 14pt; height: 14pt; border: 1.5px solid #000000; }
  .nb-print-table tr { break-inside: avoid; }
}
`;

// ─── COMPONENTES ─────────────────────────────────────────────────────────────

interface SummaryStatsProps {
  atrasados: number;
  porDespachar: number;
  conError: number;
  filtro: Filtro;
  onToggle: (f: Filtro) => void;
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ atrasados, porDespachar, conError, filtro, onToggle }) => (
  <section aria-label="Resumen del tablero" className="nb-stats">
    <button
      type="button"
      aria-pressed={filtro === 'atrasados'}
      onClick={() => onToggle('atrasados')}
      className={'nb-stat' + (atrasados > 0 ? ' is-late' : '')}
    >
      <span className="nb-stat-label"><Clock size={16} aria-hidden="true" /> Atrasados</span>
      <span className="nb-stat-num">{atrasados}</span>
    </button>
    <button
      type="button"
      aria-pressed={filtro === 'porDespachar'}
      onClick={() => onToggle('porDespachar')}
      className="nb-stat"
    >
      <span className="nb-stat-label">Por despachar</span>
      <span className="nb-stat-num">{porDespachar}</span>
    </button>
    <button
      type="button"
      aria-pressed={filtro === 'error'}
      onClick={() => onToggle('error')}
      className={'nb-stat' + (conError > 0 ? ' is-error' : '')}
    >
      <span className="nb-stat-label"><AlertCircle size={16} aria-hidden="true" /> Con error en Beetrack</span>
      <span className="nb-stat-num">{conError}</span>
    </button>
  </section>
);

const FilterChips: React.FC<{ filtro: Filtro; onChange: (f: Filtro) => void }> = ({ filtro, onChange }) => (
  <div role="group" aria-label="Filtrar pedidos" className="nb-chips">
    {CHIPS.map(f => (
      <button
        key={f}
        type="button"
        aria-pressed={filtro === f}
        onClick={() => onChange(f)}
        className="nb-filter"
      >
        {NOMBRE_FILTRO[f]}
      </button>
    ))}
  </div>
);

interface CardProps {
  p: Pedido;
  col: ColDef;
  ahora: number;
  enviando: boolean;
  resaltada: boolean;
  arrastrando: boolean;
  arrastrable: boolean;
  movil: boolean;
  avisoTexto: string | null;
  seleccionada: boolean;
  onSeleccionar: (id: string, v: boolean) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onMover: (id: string, destino: ColId) => void;
  onEntregarRetiro: (id: string) => void;
  onSaleARuta: (id: string) => void;
  onEntrega: (id: string) => void;
  onReintentar: (id: string) => void;
  onAbrir: (id: string, el: HTMLElement) => void;
}

const Card: React.FC<CardProps> = ({
  p, col, ahora, enviando, resaltada, arrastrando, arrastrable, movil, avisoTexto, seleccionada,
  onSeleccionar, onDragStart, onDragEnd, onMover, onEntregarRetiro, onSaleARuta, onEntrega, onReintentar, onAbrir,
}) => {
  const atrasado = esAtrasado(p, ahora);
  const seleccionable = p.col === 'preparacion' && p.tipo === 'despacho' && !enviando;
  return (
    <article
      draggable={arrastrable && !enviando}
      onDragStart={e => {
        e.dataTransfer.setData('text/plain', p.id);
        e.dataTransfer.effectAllowed = 'move';
        onDragStart(p.id);
      }}
      onDragEnd={onDragEnd}
      aria-label={`${p.documento}, ${p.cliente}, en ${col.titulo}`}
      className={'nb-card' + (arrastrable && !enviando ? ' is-draggable' : '') + (arrastrando ? ' is-drag' : '') + (resaltada ? ' is-new' : '') + (p.error ? ' is-error' : '')}
    >
      <div className="nb-card-top">
        {seleccionable && (
          <label className="nb-check">
            <input
              type="checkbox"
              checked={seleccionada}
              onChange={e => onSeleccionar(p.id, e.target.checked)}
            />
            <span className="nb-sr">Seleccionar {p.documento}</span>
          </label>
        )}
        <FileText size={16} className="nb-card-icon" style={{ color: col.color }} aria-hidden="true" />
        <button
          type="button"
          onClick={e => onAbrir(p.id, e.currentTarget)}
          aria-label={`Ver detalle de ${p.documento}`}
          className="nb-card-title"
        >
          <span className="nb-card-doc">{p.documento}</span>
          <span className="nb-card-client">{p.cliente}</span>
        </button>
        {resaltada && <span className="nb-new">NUEVO</span>}
      </div>

      <p className="nb-small nb-muted nb-card-loc">
        <MapPin size={14} aria-hidden="true" /> {p.comuna}
      </p>

      <div className="nb-small nb-age">
        <span className="nb-muted">Llegó {hace(ahora - p.creadoEn)}</span>
        {atrasado && (
          <span className="nb-late"><Clock size={12} aria-hidden="true" /> Atrasado</span>
        )}
      </div>

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

      {enviando && (
        <p className="nb-small nb-sending" role="status">
          <Loader2 size={14} className="animate-spin" aria-hidden="true" /> Enviando a Beetrack…
        </p>
      )}

      {p.guia && !enviando && (
        <p className="nb-guia">
          <Package size={14} aria-hidden="true" /> Guía Beetrack {p.guia}
        </p>
      )}

      {p.error && !enviando && (
        <div role="alert" className="nb-alert">
          <AlertCircle size={16} aria-hidden="true" />
          <span>Beetrack no pudo crear el despacho: falta el número de la dirección. Corrígelo en Bsale y reintenta.</span>
        </div>
      )}

      {avisoTexto && (
        <div role="status" className="nb-alert">
          <AlertCircle size={16} aria-hidden="true" />
          <span>{avisoTexto}</span>
        </div>
      )}

      {/* Acciones por columna */}
      <div className="nb-card-actions">
        {p.col === 'nuevos' && (
          <button
            type="button"
            onClick={() => onMover(p.id, 'preparacion')}
            aria-label={`Mover ${p.documento} a En preparación`}
            className="nb-btn nb-btn-primary nb-btn-block"
          >
            {movil ? 'Mover a En preparación' : 'Mover'} <ArrowRight size={16} aria-hidden="true" />
          </button>
        )}

        {p.col === 'preparacion' && (
          <>
            {p.tipo === 'despacho' ? (
              <button
                type="button"
                onClick={() => onMover(p.id, 'despacho')}
                aria-label={`Mover ${p.documento} a Despacho`}
                className="nb-btn nb-btn-primary nb-btn-block"
              >
                {movil ? 'Mover a Despacho' : 'Mover'} <ArrowRight size={16} aria-hidden="true" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onEntregarRetiro(p.id)}
                  aria-label={`Marcar ${p.documento} como entregado`}
                  className="nb-btn nb-btn-dark nb-btn-block"
                >
                  <Check size={16} aria-hidden="true" /> Marcar como entregado
                </button>
                <button
                  type="button"
                  onClick={() => onMover(p.id, 'despacho')}
                  aria-label={`Probar mover ${p.documento} a Despacho`}
                  className="nb-link"
                >
                  Probar enviar a Despacho
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => onMover(p.id, 'nuevos')}
              aria-label={`Devolver ${p.documento} a Nuevos`}
              className="nb-link"
            >
              <Undo2 size={14} aria-hidden="true" /> Volver a Nuevos
            </button>
          </>
        )}

        {p.col === 'despacho' && p.error && !enviando && (
          <button
            type="button"
            onClick={() => onReintentar(p.id)}
            aria-label={`Reintentar el envío de ${p.documento} a Beetrack`}
            className="nb-btn nb-btn-dark nb-btn-block"
          >
            Reintentar
          </button>
        )}

        {p.col === 'despacho' && !p.error && (
          <button
            type="button"
            disabled={enviando}
            onClick={() => onSaleARuta(p.id)}
            aria-label={`Simular: Beetrack saca a ruta ${p.documento}`}
            className="nb-btn nb-btn-dark nb-btn-block"
          >
            Simular: Beetrack sale a ruta
          </button>
        )}

        {p.col === 'ruta' && (
          <button
            type="button"
            onClick={() => onEntrega(p.id)}
            aria-label={`Simular: Beetrack entrega ${p.documento}`}
            className="nb-btn nb-btn-dark nb-btn-block"
          >
            Simular: Beetrack entrega
          </button>
        )}
      </div>
    </article>
  );
};

interface DrawerProps {
  p: Pedido;
  eventos: Evento[];
  ahora: number;
  onClose: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ p, eventos, ahora, onClose }) => {
  const titulo = useRef<HTMLHeadingElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    titulo.current?.focus();
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previo; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab' || !panel.current) return;
      const els = Array.from(panel.current.querySelectorAll<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])'));
      if (els.length === 0) { e.preventDefault(); return; }
      const primero = els[0];
      const ultimo = els[els.length - 1];
      const activo = document.activeElement;
      if (!panel.current.contains(activo)) { e.preventDefault(); primero.focus(); }
      else if (e.shiftKey && (activo === primero || activo === titulo.current)) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && activo === ultimo) { e.preventDefault(); primero.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // El registro viene del más nuevo al más antiguo; el historial va en orden cronológico.
  const historial = eventos.filter(ev => ev.texto.includes(p.documento)).reverse();

  return (
    <>
      <button type="button" tabIndex={-1} aria-hidden="true" onClick={onClose} className="nb-overlay" />
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="detalle-titulo" className="nb-drawer">
        <div className="nb-drawer-head">
          <h2 id="detalle-titulo" ref={titulo} tabIndex={-1} className="nb-drawer-title">{p.documento}</h2>
          <button type="button" onClick={onClose} className="nb-btn nb-btn-ghost">
            <X size={16} aria-hidden="true" /> Cerrar
          </button>
        </div>

        <div className="nb-drawer-body">
          <dl className="nb-dl">
            <dt>Documento</dt><dd>{p.documento}</dd>
            <dt>Cliente</dt><dd>{p.cliente}</dd>
            <dt>Comuna</dt><dd>{p.comuna}</dd>
            <dt>Dirección</dt><dd>{p.tipo === 'retiro' ? 'No aplica: el cliente retira en bodega' : p.direccion}</dd>
            <dt>Tipo</dt><dd>{p.tipo === 'despacho' ? 'Despacho' : 'Retiro en bodega'}</dd>
            <dt>Estado</dt><dd>{NOMBRE_COL[p.col]}</dd>
            <dt>Llegó</dt><dd>{hace(ahora - p.creadoEn)}</dd>
            {p.guia && (<><dt>Guía Beetrack</dt><dd>{p.guia}</dd></>)}
          </dl>

          <section aria-labelledby="detalle-productos">
            <h3 id="detalle-productos" className="nb-sec-title">Productos</h3>
            <div className="nb-table-wrap">
              <table className="nb-table">
                <thead>
                  <tr><th scope="col">Producto</th><th scope="col" className="num">Cant.</th><th scope="col" className="num">Subtotal</th></tr>
                </thead>
                <tbody>
                  {p.lineas.map(l => (
                    <tr key={l.producto}>
                      <td>{l.producto}</td>
                      <td className="num">{l.cantidad}</td>
                      <td className="num">{formatoCLP(precioDe(l.producto) * l.cantidad)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr><td colSpan={2}>Total</td><td className="num">{formatoCLP(p.total)}</td></tr>
                </tfoot>
              </table>
            </div>
          </section>

          <section aria-labelledby="detalle-historial">
            <h3 id="detalle-historial" className="nb-sec-title">Historial</h3>
            {historial.length === 0 ? (
              <p className="nb-small nb-muted">Todavía no hay movimientos registrados.</p>
            ) : (
              <ol className="nb-timeline">
                {historial.map(ev => (
                  <li key={ev.id}>
                    <time className="nb-log-time">{ev.hora}</time>
                    <span className="break-words min-w-0">{ev.texto}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

const useMedia = (query: string): boolean => {
  const [coincide, setCoincide] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const alCambiar = () => setCoincide(m.matches);
    alCambiar();
    m.addEventListener('change', alCambiar);
    return () => m.removeEventListener('change', alCambiar);
  }, [query]);
  return coincide;
};

interface BoardTabsProps {
  activa: ColId;
  conteos: Record<ColId, number>;
  bump: ColId | null;
  onChange: (id: ColId) => void;
}

const BoardTabs: React.FC<BoardTabsProps> = ({ activa, conteos, bump, onChange }) => {
  const alTeclear = (e: React.KeyboardEvent) => {
    const i = COLUMNAS.findIndex(c => c.id === activa);
    let j = i;
    if (e.key === 'ArrowRight') j = (i + 1) % COLUMNAS.length;
    else if (e.key === 'ArrowLeft') j = (i - 1 + COLUMNAS.length) % COLUMNAS.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = COLUMNAS.length - 1;
    else return;
    e.preventDefault();
    const destino = COLUMNAS[j].id;
    onChange(destino);
    window.requestAnimationFrame(() => document.getElementById('tab-' + destino)?.focus());
  };
  return (
    <div role="tablist" aria-label="Columnas del tablero" onKeyDown={alTeclear} className="nb-tabs">
      {COLUMNAS.map(c => (
        <button
          key={c.id}
          id={'tab-' + c.id}
          type="button"
          role="tab"
          aria-selected={activa === c.id}
          aria-controls="tablero-panel"
          tabIndex={activa === c.id ? 0 : -1}
          onClick={() => onChange(c.id)}
          className="nb-tab"
        >
          {c.titulo}
          <span className={'nb-tab-count' + (bump === c.id ? ' is-bump' : '')}>{conteos[c.id]}</span>
        </button>
      ))}
    </div>
  );
};

const MoreMenu: React.FC<{ onPrint: () => void; onReset: () => void }> = ({ onPrint, onReset }) => {
  const [abierto, setAbierto] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);

  const cerrar = (devolverFoco: boolean) => {
    setAbierto(false);
    if (devolverFoco) boton.current?.focus();
  };

  useEffect(() => {
    if (!abierto) return;
    raiz.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    const fuera = (e: PointerEvent) => {
      if (raiz.current && !raiz.current.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener('pointerdown', fuera);
    return () => document.removeEventListener('pointerdown', fuera);
  }, [abierto]);

  const alTeclear = (e: React.KeyboardEvent) => {
    if (!abierto) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cerrar(true); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const items = Array.from(raiz.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
      const i = items.indexOf(document.activeElement as HTMLElement);
      const j = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
      items[j]?.focus();
    }
    if (e.key === 'Tab') setAbierto(false);
  };

  return (
    <div ref={raiz} onKeyDown={alTeclear} className="nb-more">
      <button
        ref={boton}
        type="button"
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-controls="menu-mas"
        onClick={() => setAbierto(o => !o)}
        className="nb-btn nb-btn-ghost nb-btn-block"
      >
        Más <ChevronDown size={16} aria-hidden="true" />
      </button>
      {abierto && (
        <div id="menu-mas" role="menu" aria-label="Más acciones" className="nb-menu">
          <button type="button" role="menuitem" className="nb-menu-item" onClick={() => { cerrar(false); onPrint(); }}>
            <Printer size={16} aria-hidden="true" /> Imprimir lista de preparación
          </button>
          <button type="button" role="menuitem" className="nb-menu-item" onClick={() => { cerrar(false); onReset(); }}>
            <RotateCcw size={16} aria-hidden="true" /> Reiniciar demo
          </button>
        </div>
      )}
    </div>
  );
};

const Toast: React.FC<{ toast: ToastData | null }> = ({ toast }) => (
  <div role="status" className="nb-toasts">
    {toast && (
      <div key={toast.key} className="nb-toast">
        {toast.tono === 'error' && <AlertCircle size={16} aria-hidden="true" className="nb-toast-icon" />}
        <span className="nb-toast-text">{toast.texto}</span>
        <button type="button" onClick={toast.onAccion} className="nb-toast-undo">{toast.accion}</button>
      </div>
    )}
  </div>
);

const PrintList: React.FC<{ pedidos: Pedido[]; ahora: number }> = ({ pedidos, ahora }) => {
  const filas = pedidos.filter(p => p.col === 'preparacion');
  const fecha = new Date(ahora).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <section className="nb-print" aria-hidden="true">
      <h1 className="nb-print-title">Lista de preparación · Nibec</h1>
      <p className="nb-print-date">{fecha}</p>
      <table className="nb-print-table">
        <thead>
          <tr>
            <th scope="col">Documento</th>
            <th scope="col">Cliente</th>
            <th scope="col">Comuna</th>
            <th scope="col">Productos</th>
            <th scope="col">Tipo</th>
            <th scope="col" className="tick">✓</th>
          </tr>
        </thead>
        <tbody>
          {filas.length === 0 && (
            <tr><td colSpan={6}>No hay pedidos en preparación.</td></tr>
          )}
          {filas.map(p => (
            <tr key={p.id}>
              <td>{p.documento}</td>
              <td>{p.cliente}</td>
              <td>{p.comuna}</td>
              <td>{p.lineas.map(l => `${l.cantidad} × ${l.producto}`).join('; ')}</td>
              <td>{p.tipo === 'despacho' ? 'Despacho' : 'Retiro en bodega'}</td>
              <td className="tick"><span className="nb-print-box" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

// ─── PÁGINA ──────────────────────────────────────────────────────────────────

const NibecDespachosDemo: React.FC = () => {
  const [inicio] = useState(() => Date.now());
  const [pedidos, setPedidos] = useState<Pedido[]>(() => crearSemilla(inicio));
  const [eventos, setEventos] = useState<Evento[]>(EVENTOS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [arrastrando, setArrastrando] = useState<string | null>(null);
  const [colSobre, setColSobre] = useState<ColId | null>(null);
  const [enviando, setEnviando] = useState<Set<string>>(new Set());
  const [resaltados, setResaltados] = useState<Set<string>>(new Set());
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [ahora, setAhora] = useState(inicio);
  const [syncBsale, setSyncBsale] = useState(inicio - MIN);
  const [syncBeetrack, setSyncBeetrack] = useState(inicio - MIN);
  const [seleccion, setSeleccion] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<ToastData | null>(null);
  const [detalleId, setDetalleId] = useState<string | null>(null);
  const [tabActiva, setTabActiva] = useState<ColId>('nuevos');
  const [bump, setBump] = useState<ColId | null>(null);
  const [registroAbierto, setRegistroAbierto] = useState(false);
  const esMovil = useMedia('(max-width: 767px)');
  const esMovilRef = useRef(esMovil);
  esMovilRef.current = esMovil;
  const verDespacho = () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    setToast(null);
    setTabActiva('despacho');
  };
  const esTactil = useMedia('(pointer: coarse)');
  const puedeArrastrar = !esMovil && !esTactil;

  const contadorEvento = useRef(100);
  const contadorDoc = useRef({ boleta: 48214, factura: 10581 });
  const contadorId = useRef(100);
  const contadorToast = useRef(0);
  const timers = useRef<number[]>([]);
  const toastTimer = useRef<number | null>(null);
  const disparador = useRef<HTMLElement | null>(null);
  const pedidosRef = useRef<Pedido[]>(pedidos);
  pedidosRef.current = pedidos;

  const programar = (fn: () => void, ms: number) => {
    const t = window.setTimeout(fn, ms);
    timers.current.push(t);
    return t;
  };

  useEffect(() => () => { timers.current.forEach(window.clearTimeout); }, []);

  // Las edades ("hace 3 h") y el estado de las conexiones se recalculan cada minuto.
  useEffect(() => {
    const t = window.setInterval(() => setAhora(Date.now()), MIN);
    return () => window.clearInterval(t);
  }, []);

  // Si una tarjeta seleccionada sale de "En preparación", deja de estar seleccionada.
  useEffect(() => {
    setSeleccion(prev => {
      const vigentes = Array.from(prev).filter(id => pedidos.some(p => p.id === id && p.col === 'preparacion'));
      return vigentes.length === prev.size ? prev : new Set(vigentes);
    });
  }, [pedidos]);

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

  const mostrarToast = (texto: string, onUndo: () => void) =>
    mostrarToastCon({ texto, accion: 'Deshacer', onAccion: onUndo });

  // En móvil la tarjeta cambia de pestaña al ir a Despacho: el aviso cuenta qué respondió Beetrack
  const mostrarToastCon = (datos: Omit<ToastData, 'key'>) => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    contadorToast.current += 1;
    setToast({ key: contadorToast.current, ...datos });
    toastTimer.current = programar(() => setToast(null), 6000);
  };

  const deshacer = (id: string, desde: ColId, hacia: ColId) => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    setToast(null);
    const p = pedidosRef.current.find(x => x.id === id);
    if (!p || p.col !== desde) return; // la tarjeta ya se movió por otro lado
    actualizar(id, { col: hacia });
    registrar(`Lismari deshizo el cambio de ${p.documento}`);
    marcarBump(hacia);
  };

  const tocarBeetrack = () => setSyncBeetrack(Date.now());

  const marcarBump = (col: ColId) => {
    setBump(col);
    programar(() => setBump(actual => (actual === col ? null : actual)), 1500);
  };

  // ─── Envío a Beetrack (1,2 s simulados) ───────────────────────────────────

  const enviarABeetrack = (p: Pedido) => {
    setEnviando(prev => new Set(prev).add(p.id));
    programar(() => {
      if (p.direccionIncompleta) {
        actualizar(p.id, { error: true });
        registrar(`Beetrack: rechazó ${p.documento} (falta el número de la dirección)`);
        if (esMovilRef.current) mostrarToastCon({ texto: `Beetrack rechazó ${p.documento}`, accion: 'Ver', onAccion: () => verDespacho(), tono: 'error' });
      } else {
        const guia = nuevaGuia();
        actualizar(p.id, { guia });
        registrar(`Beetrack: se creó la guía ${guia} para ${p.documento}`);
        if (esMovilRef.current) mostrarToastCon({ texto: `${p.documento} ya está en Beetrack (${guia})`, accion: 'Ver', onAccion: () => verDespacho() });
      }
      setEnviando(prev => { const s = new Set(prev); s.delete(p.id); return s; });
      tocarBeetrack();
    }, 1200);
  };

  const reintentar = (id: string) => {
    const p = pedidosRef.current.find(x => x.id === id);
    if (!p || enviando.has(id)) return;
    const direccion = p.direccion.replace('(sin número)', '1840');
    actualizar(id, { error: false, direccionIncompleta: false, direccion });
    enviarABeetrack({ ...p, direccionIncompleta: false, direccion });
  };

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
      actualizar(id, { col: 'despacho', guia: undefined, error: false });
      registrar(`Lismari movió ${p.documento} a Despacho`);
      marcarBump('despacho');
      enviarABeetrack(p);
      return;
    }

    if (p.col === 'despacho' || p.col === 'ruta' || p.col === 'entregado') {
      mostrarAviso({ cardId: id, col: destino, texto: 'Desde aquí solo Beetrack mueve el pedido.' });
      return;
    }

    // nuevos <-> preparacion
    const origen = p.col;
    actualizar(id, { col: destino });
    registrar(`Lismari movió ${p.documento} a ${NOMBRE_COL[destino]}`);
    marcarBump(destino);
    mostrarToast(`${p.documento} pasó a ${NOMBRE_COL[destino]}`, () => deshacer(id, destino, origen));
  };

  const marcarRetiroEntregado = (id: string) => {
    const p = pedidosRef.current.find(x => x.id === id);
    if (!p) return;
    const origen = p.col;
    actualizar(id, { col: 'entregado' });
    registrar(`Lismari marcó ${p.documento} como entregado (retiro en bodega)`);
    marcarBump('entregado');
    mostrarToast(`${p.documento} pasó a Entregado`, () => deshacer(id, 'entregado', origen));
  };

  // ─── Acciones de Beetrack simuladas ───────────────────────────────────────

  const beetrackSaleARuta = (id: string) => {
    const p = pedidosRef.current.find(x => x.id === id);
    if (!p) return;
    actualizar(id, { col: 'ruta' });
    registrar(`Beetrack: ${p.documento} salió a ruta`);
    tocarBeetrack();
  };

  const beetrackEntrega = (id: string) => {
    const p = pedidosRef.current.find(x => x.id === id);
    if (!p) return;
    actualizar(id, { col: 'entregado' });
    registrar(`Beetrack: ${p.documento} entregada`);
    tocarBeetrack();
  };

  // ─── Selección múltiple ───────────────────────────────────────────────────

  const seleccionar = (id: string, v: boolean) =>
    setSeleccion(prev => {
      const s = new Set(prev);
      if (v) s.add(id); else s.delete(id);
      return s;
    });

  const enviarSeleccionados = () => {
    const ids = pedidosRef.current
      .filter(p => seleccion.has(p.id) && p.col === 'preparacion' && p.tipo === 'despacho')
      .map(p => p.id);
    setSeleccion(new Set());
    ids.forEach(id => moverManual(id, 'despacho'));
  };

  // ─── Panel de detalle ─────────────────────────────────────────────────────

  const abrirDetalle = (id: string, el: HTMLElement) => {
    disparador.current = el;
    setDetalleId(id);
  };

  const cerrarDetalle = useCallback(() => {
    setDetalleId(null);
    window.requestAnimationFrame(() => {
      const el = disparador.current;
      if (el && el.isConnected) el.focus();
    });
  }, []);

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
    const comuna = azar(COMUNAS);
    const tipo: Tipo = Math.random() < 0.25 ? 'retiro' : 'despacho';
    const nuevo: Pedido = {
      id: 'p' + contadorId.current,
      documento, cliente,
      comuna,
      direccion: tipo === 'retiro' ? '' : `${azar(CALLES)} ${100 + Math.floor(Math.random() * 9000)}, ${comuna}`,
      lineas, total, tipo,
      col: 'nuevos',
      creadoEn: Date.now(),
    };
    setPedidos(prev => [nuevo, ...prev]);
    registrar(`Bsale: llegó ${documento} de ${cliente}`);
    marcarBump('nuevos');
    setSyncBsale(Date.now());
    setResaltados(prev => new Set(prev).add(nuevo.id));
    programar(() => setResaltados(prev => { const s = new Set(prev); s.delete(nuevo.id); return s; }), 2500);
  };

  const reiniciar = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    toastTimer.current = null;
    const t = Date.now();
    contadorDoc.current = { boleta: 48214, factura: 10581 };
    contadorId.current = 100;
    contadorEvento.current = 100;
    setPedidos(crearSemilla(t));
    setEventos(EVENTOS_INICIALES);
    setBusqueda('');
    setFiltro('todos');
    setEnviando(new Set());
    setResaltados(new Set());
    setSeleccion(new Set());
    setToast(null);
    setDetalleId(null);
    setAviso(null);
    setArrastrando(null);
    setColSobre(null);
    setBump(null);
    setTabActiva('nuevos');
    setRegistroAbierto(false);
    setAhora(t);
    setSyncBsale(t - MIN);
    setSyncBeetrack(t - MIN);
  };

  // ─── Filtro ───────────────────────────────────────────────────────────────

  const q = busqueda.trim().toLowerCase();
  const visibles = pedidos.filter(p =>
    coincideFiltro(p, filtro, ahora) &&
    (!q || p.documento.toLowerCase().includes(q) || p.cliente.toLowerCase().includes(q)),
  );

  const nAtrasados = pedidos.filter(p => esAtrasado(p, ahora)).length;
  const nPorDespachar = pedidos.filter(esPorDespachar).length;
  const nConError = pedidos.filter(p => p.error).length;
  const alternarFiltro = (f: Filtro) => setFiltro(actual => (actual === f ? 'todos' : f));

  const conteos = COLUMNAS.reduce((acc, c) => {
    acc[c.id] = visibles.filter(p => p.col === c.id).length;
    return acc;
  }, {} as Record<ColId, number>);
  const columnasVisibles = esMovil ? COLUMNAS.filter(c => c.id === tabActiva) : COLUMNAS;

  const nSeleccionados = pedidos.filter(p => seleccion.has(p.id) && p.col === 'preparacion').length;
  const detalle = detalleId ? pedidos.find(p => p.id === detalleId) ?? null : null;

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

  const mensajeVacio = filtro !== 'todos'
    ? `Nada por aquí con el filtro «${NOMBRE_FILTRO[filtro]}»`
    : q ? 'Nada por aquí con esa búsqueda' : 'Nada por aquí';

  return (
    <div className="nb">
      <style>{ESTILOS}</style>

      {/* Barra de anuncio */}
      <div className="nb-announce"><span className="nb-lbl-full">Demo con datos ficticios · así se vería el tablero de Nibec</span><span className="nb-lbl-short">Demo con datos ficticios</span></div>

      {/* Encabezado */}
      <header className="nb-header">
        <div className="nb-container nb-header-row">
          <img src="/Logo nibec.png" alt="Nibec" className="nb-logo" />
          <h1 className="nb-h1">{esMovil ? 'Tablero' : 'Tablero de Despachos'}</h1>
          <Link to="/nibec-despachos" aria-label="Volver a la propuesta" className={'nb-btn nb-btn-ghost nb-back' + (esMovil ? ' nb-btn-icon' : '')}>
            <ArrowLeft size={16} aria-hidden="true" />{!esMovil && ' Volver a la propuesta'}
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

      <main className={'nb-container nb-main' + (nSeleccionados > 0 ? ' has-bar' : '')}>
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

        {/* Resumen */}
        <SummaryStats
          atrasados={nAtrasados}
          porDespachar={nPorDespachar}
          conError={nConError}
          filtro={filtro}
          onToggle={alternarFiltro}
        />

        {/* Conexiones y acciones */}
        <section className="nb-toolbar">
          <div className="nb-trust" role="group" aria-label="Estado de las conexiones">
            {[
              { nombre: 'Bsale', sync: syncBsale },
              { nombre: 'Beetrack', sync: syncBeetrack },
            ].map(c => (
              <span key={c.nombre} className="nb-trust-item">
                <span className="nb-dot nb-dot-ok" aria-hidden="true" />
                <strong>{c.nombre}</strong>
                <span className="nb-muted">conectado · actualizado {hace(ahora - c.sync)}</span>
              </span>
            ))}
          </div>

          <div className="nb-actions">
            <button
              type="button"
              onClick={simularVenta}
              className="nb-btn nb-btn-primary"
            >
              <Plus size={16} aria-hidden="true" /> {esMovil ? 'Simular venta' : 'Simular venta nueva en Bsale'}
            </button>
            {esMovil ? (
              <MoreMenu onPrint={() => window.print()} onReset={reiniciar} />
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="nb-btn nb-btn-ghost"
                >
                  <Printer size={16} aria-hidden="true" /> Imprimir lista de preparación
                </button>
                <button
                  type="button"
                  onClick={reiniciar}
                  aria-label="Reiniciar la demo"
                  className="nb-btn nb-btn-ghost"
                >
                  <RotateCcw size={16} aria-hidden="true" /> Reiniciar demo
                </button>
              </>
            )}
          </div>
        </section>

        <FilterChips filtro={filtro} onChange={setFiltro} />

        {/* Tablero + Registro */}
        <div className="nb-layout">
          {/* Tablero */}
          <section aria-label="Tablero de pedidos" className="min-w-0">
            {esMovil && <BoardTabs activa={tabActiva} conteos={conteos} bump={bump} onChange={setTabActiva} />}
            <div className="nb-board-scroll">
              <div
                id="tablero-panel"
                className="nb-board"
                role={esMovil ? 'tabpanel' : undefined}
                aria-labelledby={esMovil ? 'tab-' + tabActiva : undefined}
              >
                {columnasVisibles.map(col => {
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
                        {col.id === 'entregado' && (
                          <p className="nb-small nb-muted">Se archivan solos después de 2 días</p>
                        )}
                        {aviso?.col === col.id && (
                          <div role="status" className="nb-alert nb-alert-col">
                            <AlertCircle size={16} aria-hidden="true" />
                            <span>{aviso.texto}</span>
                          </div>
                        )}
                      </div>

                      {tarjetas.length === 0 && (
                        <p className="nb-empty">{mensajeVacio}</p>
                      )}

                      {tarjetas.map(p => {
                        const avisoTarjeta = aviso?.cardId === p.id && !aviso.col ? aviso : null;
                        const avisoRetiro = aviso?.cardId === p.id && aviso.col === 'despacho' && p.tipo === 'retiro' ? aviso : null;
                        return (
                          <Card
                            key={p.id}
                            p={p}
                            col={col}
                            ahora={ahora}
                            enviando={enviando.has(p.id)}
                            resaltada={resaltados.has(p.id)}
                            arrastrando={arrastrando === p.id}
                            arrastrable={puedeArrastrar}
                            movil={esMovil}
                            avisoTexto={(avisoTarjeta || avisoRetiro)?.texto ?? null}
                            seleccionada={seleccion.has(p.id)}
                            onSeleccionar={seleccionar}
                            onDragStart={setArrastrando}
                            onDragEnd={() => { setArrastrando(null); setColSobre(null); }}
                            onMover={moverManual}
                            onEntregarRetiro={marcarRetiroEntregado}
                            onSaleARuta={beetrackSaleARuta}
                            onEntrega={beetrackEntrega}
                            onReintentar={reintentar}
                            onAbrir={abrirDetalle}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="nb-small nb-muted nb-hint">
              {puedeArrastrar
                ? 'Arrastra las tarjetas entre columnas, o usa el botón «Mover» (sirve en celular).'
                : 'Usa el botón «Mover» de cada tarjeta para pasarla a la siguiente columna.'}
            </p>
            <p className="nb-small nb-muted nb-hint">
              Un pedido se marca como atrasado si lleva más de 24 horas sin pasar a Despacho.
            </p>
          </section>

          {/* Registro */}
          <aside aria-label="Registro de eventos" className="nb-log">
            <h2 className="nb-log-title">
              {esMovil ? (
                <button
                  type="button"
                  aria-expanded={registroAbierto}
                  aria-controls="registro-lista"
                  onClick={() => setRegistroAbierto(o => !o)}
                  className="nb-log-toggle"
                >
                  Registro ({eventos.length})
                  {registroAbierto ? <ChevronUp size={20} aria-hidden="true" /> : <ChevronDown size={20} aria-hidden="true" />}
                </button>
              ) : 'Registro'}
            </h2>
            {(!esMovil || registroAbierto) && (
              <ol id="registro-lista" aria-live="polite" className="nb-log-list">
                {eventos.map(ev => (
                  <li key={ev.id} className="nb-log-item">
                    <time className="nb-log-time">{ev.hora}</time>
                    <span className="break-words min-w-0">{ev.texto}</span>
                  </li>
                ))}
              </ol>
            )}
          </aside>
        </div>
      </main>

      {/* Aviso con deshacer + barra de selección múltiple (el aviso queda sobre la barra) */}
      <div className={'nb-dock' + (nSeleccionados > 0 ? ' has-bar' : '')}>
        <Toast toast={toast} />
        {nSeleccionados > 0 && (
          <section aria-label="Acciones para los pedidos seleccionados" className="nb-bar">
            <div className="nb-container nb-bar-row">
              <p className="nb-bar-text">
                {nSeleccionados} {nSeleccionados === 1 ? 'pedido seleccionado' : 'pedidos seleccionados'}
              </p>
              <button type="button" onClick={enviarSeleccionados} className="nb-btn nb-btn-primary">
                Enviar a Despacho
              </button>
              <button type="button" onClick={() => setSeleccion(new Set())} className="nb-btn nb-btn-ghost">
                Cancelar
              </button>
            </div>
          </section>
        )}
      </div>

      {detalle && <Drawer p={detalle} eventos={eventos} ahora={ahora} onClose={cerrarDetalle} />}

      <PrintList pedidos={pedidos} ahora={ahora} />
    </div>
  );
};

export default NibecDespachosDemo;
