import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Info, RotateCcw, Search,
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

const ACCENT = '#f5a02a';
const TEAL = '#00bfa5';
const BLUE = '#1d70a2';

const COLUMNAS: { id: ColId; titulo: string; color: string; nota: string }[] = [
  { id: 'nuevos',      titulo: 'Nuevos',         color: BLUE,      nota: 'Llegó de Bsale' },
  { id: 'preparacion', titulo: 'En preparación', color: ACCENT,    nota: 'Se arma en bodega' },
  { id: 'despacho',    titulo: 'Despacho',       color: TEAL,      nota: 'Se crea en Beetrack' },
  { id: 'ruta',        titulo: 'En ruta',        color: '#38bdf8', nota: 'Lo actualiza Beetrack' },
  { id: 'entregado',   titulo: 'Entregado',      color: '#4ade80', nota: 'Lo actualiza Beetrack' },
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

  const botonBase =
    'inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white';

  return (
    <div
      className="min-h-screen overflow-x-hidden text-slate-100"
      style={{ background: '#030d1a', fontFamily: 'Lato, sans-serif' }}
    >
      {/* Barra superior */}
      <header className="border-b border-white/10" style={{ background: '#061a2e' }}>
        <div className="max-w-[1500px] mx-auto px-4 py-4 flex flex-wrap items-center gap-x-4 gap-y-3">
          <h1 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Tablero de Despachos · <span style={{ color: ACCENT }}>Nibec</span>
          </h1>
          <span
            className="text-xs font-bold px-3 py-1.5 rounded-full tracking-wide"
            style={{ background: 'rgba(245,160,42,.15)', color: ACCENT, border: `1px solid ${ACCENT}` }}
          >
            DEMO · datos ficticios
          </span>
          <Link
            to="/nibec-despachos"
            aria-label="Volver a la propuesta"
            className="sm:ml-auto inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-white underline underline-offset-4 hover:text-[#f5a02a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Volver a la propuesta
          </Link>
        </div>
      </header>

      <main className="max-w-[1500px] mx-auto px-4 py-5 space-y-5">
        {/* Panel explicativo */}
        <section className="rounded-xl border border-white/15" style={{ background: '#0a1d33' }}>
          <button
            type="button"
            onClick={() => setPanelAbierto(o => !o)}
            aria-expanded={panelAbierto}
            aria-controls="panel-que-ves"
            aria-label="Mostrar u ocultar: ¿Qué estás viendo?"
            className="w-full min-h-[48px] px-4 flex items-center gap-3 text-left font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-xl"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <Info size={18} style={{ color: TEAL }} aria-hidden="true" />
            <span className="flex-1">¿Qué estás viendo?</span>
            {panelAbierto ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
          </button>
          {panelAbierto && (
            <ul id="panel-que-ves" className="px-4 pb-4 pt-1 space-y-2 text-[15px] text-slate-200 list-disc list-inside">
              <li>Los pedidos llegan solos desde Bsale, apenas se emite la boleta o factura.</li>
              <li>Cuando una tarjeta llega a Despacho, se crea sola en Beetrack y recibe su N° de guía.</li>
              <li>Beetrack mueve la tarjeta a En ruta y a Entregado por sí mismo.</li>
            </ul>
          )}
        </section>

        {/* Conexiones, acciones y búsqueda */}
        <section className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex flex-wrap gap-2" aria-label="Estado de las conexiones">
            {['Bsale', 'Beetrack'].map(nombre => (
              <span
                key={nombre}
                className="inline-flex items-center gap-2 min-h-[40px] px-3 rounded-full text-sm font-semibold text-white border border-white/20"
                style={{ background: '#0a1d33' }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80]" aria-hidden="true" />
                {nombre} · conectado
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 lg:ml-auto">
            <button
              type="button"
              onClick={simularVenta}
              aria-label="Simular una venta nueva en Bsale"
              className={botonBase + ' text-[#030d1a] hover:brightness-110'}
              style={{ background: ACCENT }}
            >
              <Plus size={16} aria-hidden="true" /> Simular venta nueva en Bsale
            </button>
            <button
              type="button"
              onClick={reiniciar}
              aria-label="Reiniciar la demo"
              className={botonBase + ' border border-white/30 text-white hover:bg-white/10'}
            >
              <RotateCcw size={16} aria-hidden="true" /> Reiniciar demo
            </button>
          </div>

          <div className="relative lg:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" aria-hidden="true" />
            <input
              type="search"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar N° de documento o cliente"
              aria-label="Buscar por número de documento o cliente"
              className="w-full min-h-[44px] pl-9 pr-3 rounded-lg text-sm text-white placeholder-slate-400 border border-white/25 focus:outline-none focus:ring-2 focus:ring-[#f5a02a]"
              style={{ background: '#0a1d33' }}
            />
          </div>
        </section>

        {/* Tablero + Registro */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-5 items-start">
          {/* Tablero */}
          <section aria-label="Tablero de pedidos" className="min-w-0">
            <div className="overflow-x-auto pb-3">
              <div className="flex gap-3 w-max">
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
                      className="w-[272px] shrink-0 rounded-xl border p-3 flex flex-col gap-3 min-h-[320px]"
                      style={{
                        background: sobre ? 'rgba(255,255,255,.08)' : '#071526',
                        borderColor: sobre ? col.color : 'rgba(255,255,255,.15)',
                      }}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ background: col.color }} aria-hidden="true" />
                          <h2 className="font-bold text-white text-[15px] flex-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {col.titulo}
                          </h2>
                          <span
                            className="text-xs font-bold min-w-[28px] text-center px-2 py-1 rounded-full text-[#030d1a]"
                            style={{ background: col.color }}
                          >
                            {tarjetas.length}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{col.nota}</p>
                        {aviso?.col === col.id && (
                          <p
                            role="status"
                            className="mt-2 text-xs font-semibold rounded-md px-2 py-1.5"
                            style={{ background: 'rgba(248,113,113,.15)', color: '#fecaca', border: '1px solid rgba(248,113,113,.5)' }}
                          >
                            {aviso.texto}
                          </p>
                        )}
                      </div>

                      {tarjetas.length === 0 && (
                        <p className="text-xs text-slate-400 border border-dashed border-white/20 rounded-lg p-4 text-center">
                          Sin pedidos
                        </p>
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
                            className="rounded-lg p-3 border space-y-2 cursor-grab active:cursor-grabbing"
                            style={{
                              background: '#0d2440',
                              borderColor: resaltada ? ACCENT : 'rgba(255,255,255,.18)',
                              boxShadow: resaltada ? `0 0 0 2px ${ACCENT}` : 'none',
                              opacity: arrastrando === p.id ? 0.5 : 1,
                              transition: 'box-shadow .4s, border-color .4s',
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <FileText size={16} className="mt-0.5 shrink-0" style={{ color: col.color }} aria-hidden="true" />
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-white text-sm leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                  {p.documento}
                                </p>
                                <p className="text-sm text-slate-100 break-words">{p.cliente}</p>
                              </div>
                              {resaltada && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-[#030d1a]" style={{ background: ACCENT }}>
                                  NUEVO
                                </span>
                              )}
                            </div>

                            <p className="flex items-center gap-1.5 text-xs text-slate-300">
                              <MapPin size={12} aria-hidden="true" /> {p.comuna}
                            </p>

                            <ul className="text-xs text-slate-200 space-y-0.5">
                              {p.lineas.map(l => (
                                <li key={l.producto} className="flex gap-1.5">
                                  <span className="font-bold text-white shrink-0">{l.cantidad}×</span>
                                  <span className="break-words">{l.producto}</span>
                                </li>
                              ))}
                            </ul>

                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="font-bold text-white text-sm">{formatoCLP(p.total)}</span>
                              {p.tipo === 'despacho' ? (
                                <span
                                  className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
                                  style={{ background: 'rgba(0,191,165,.18)', color: '#5eead4', border: '1px solid rgba(0,191,165,.5)' }}
                                >
                                  <Truck size={12} aria-hidden="true" /> Despacho
                                </span>
                              ) : (
                                <span
                                  className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
                                  style={{ background: 'rgba(245,160,42,.18)', color: '#fcd34d', border: '1px solid rgba(245,160,42,.5)' }}
                                >
                                  <Store size={12} aria-hidden="true" /> Retiro en bodega
                                </span>
                              )}
                            </div>

                            {estaEnviando && (
                              <p className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#5eead4' }} role="status">
                                <Loader2 size={14} className="animate-spin" aria-hidden="true" /> Enviando a Beetrack…
                              </p>
                            )}

                            {p.guia && !estaEnviando && (
                              <p
                                className="flex items-center gap-1.5 text-xs font-bold px-2 py-1.5 rounded-md"
                                style={{ background: 'rgba(29,112,162,.3)', color: '#bae6fd', border: '1px solid rgba(56,189,248,.5)' }}
                              >
                                <Package size={12} aria-hidden="true" /> Guía Beetrack {p.guia}
                              </p>
                            )}

                            {(avisoTarjeta || avisoRetiro) && (
                              <p
                                role="status"
                                className="text-xs font-semibold rounded-md px-2 py-1.5"
                                style={{ background: 'rgba(248,113,113,.15)', color: '#fecaca', border: '1px solid rgba(248,113,113,.5)' }}
                              >
                                {(avisoTarjeta || avisoRetiro)!.texto}
                              </p>
                            )}

                            {/* Acciones por columna */}
                            <div className="flex flex-col gap-2 pt-1">
                              {p.col === 'nuevos' && (
                                <button
                                  type="button"
                                  onClick={() => moverManual(p.id, 'preparacion')}
                                  aria-label={`Mover ${p.documento} a En preparación`}
                                  className={botonBase + ' w-full border border-white/30 text-white hover:bg-white/10'}
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
                                      className={botonBase + ' w-full text-[#030d1a] hover:brightness-110'}
                                      style={{ background: TEAL }}
                                    >
                                      Mover <ArrowRight size={16} aria-hidden="true" />
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => marcarRetiroEntregado(p.id)}
                                        aria-label={`Marcar ${p.documento} como entregado`}
                                        className={botonBase + ' w-full text-[#030d1a] hover:brightness-110'}
                                        style={{ background: '#4ade80' }}
                                      >
                                        <Check size={16} aria-hidden="true" /> Marcar como entregado
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => moverManual(p.id, 'despacho')}
                                        aria-label={`Probar mover ${p.documento} a Despacho`}
                                        className="text-xs text-slate-300 underline underline-offset-2 min-h-[32px] hover:text-white"
                                      >
                                        Probar enviar a Despacho
                                      </button>
                                    </>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => moverManual(p.id, 'nuevos')}
                                    aria-label={`Devolver ${p.documento} a Nuevos`}
                                    className="inline-flex items-center justify-center gap-1.5 min-h-[36px] text-xs font-semibold text-slate-200 hover:text-white underline underline-offset-2"
                                  >
                                    <Undo2 size={13} aria-hidden="true" /> Volver a Nuevos
                                  </button>
                                </>
                              )}

                              {p.col === 'despacho' && (
                                <button
                                  type="button"
                                  disabled={estaEnviando}
                                  onClick={() => beetrackSaleARuta(p.id)}
                                  aria-label={`Simular: Beetrack saca a ruta ${p.documento}`}
                                  className={botonBase + ' w-full border border-[#38bdf8] text-[#bae6fd] hover:bg-[#38bdf8]/15 disabled:opacity-40 disabled:cursor-not-allowed'}
                                >
                                  Simular: Beetrack sale a ruta
                                </button>
                              )}

                              {p.col === 'ruta' && (
                                <button
                                  type="button"
                                  onClick={() => beetrackEntrega(p.id)}
                                  aria-label={`Simular: Beetrack entrega ${p.documento}`}
                                  className={botonBase + ' w-full border border-[#4ade80] text-[#bbf7d0] hover:bg-[#4ade80]/15'}
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
            <p className="text-xs text-slate-300 mt-1">
              Arrastra las tarjetas entre columnas, o usa el botón &laquo;Mover&raquo; (sirve en celular).
            </p>
          </section>

          {/* Registro */}
          <aside
            aria-label="Registro de eventos"
            className="rounded-xl border border-white/15 p-4 xl:sticky xl:top-4"
            style={{ background: '#0a1d33' }}
          >
            <h2 className="font-bold text-white text-lg mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Registro
            </h2>
            <ol aria-live="polite" className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {eventos.map(ev => (
                <li key={ev.id} className="flex gap-3 text-sm border-b border-white/10 pb-2 last:border-0">
                  <time className="font-bold shrink-0 tabular-nums" style={{ color: ACCENT }}>{ev.hora}</time>
                  <span className="text-slate-100 break-words min-w-0">{ev.texto}</span>
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
