// Demo interactiva para JC Proyectos (Jorge Casañas, director general). Muestra la gestión de una obra:
// pedidos de material, recepción, presupuesto de Opus, nómina semanal, programa de Project y la IA.
// Datos ficticios, todo en memoria: nada se guarda.
import React, { useCallback, useMemo, useReducer, useState } from 'react';
import { PlayCircle } from 'lucide-react';
import {
  LayoutDashboard, Smartphone, ShoppingCart, PackageCheck, Calculator, Users, CalendarRange, Sparkles,
  TrendingUp, CalendarClock, Wallet, ClipboardCheck, AlertTriangle, ChevronRight,
} from 'lucide-react';
import { C, Tarjeta, TarjetaKpi, Titulo, Toast, estiloInput, Chip } from './jc-proyectos/ui';
import { HOY_TEXTO, OBRA, estadoPresupuesto, resumenPrograma, money, pct, fechaCorta, excesoItem, insumo, nombreFrente, num } from './jc-proyectos/datos';
import { ESTADO_INICIAL, PERSONAS, QUE_HACE, SECCIONES_POR_ROL, Accion, Persona, Rol, Seccion, reducer } from './jc-proyectos/estado';
import { SeccionMateriales, SeccionRecepcion } from './jc-proyectos/materiales';
import { SeccionPresupuesto, alertasConsumo } from './jc-proyectos/presupuesto';
import { SeccionNomina, totalesNomina, observacionesNomina } from './jc-proyectos/nomina';
import { SeccionPrograma, LogoJC } from './jc-proyectos/programa';
import { SeccionCampo } from './jc-proyectos/celular';
import { SeccionAsistente } from './jc-proyectos/asistente';
import { RECORRIDOS, ESTILOS_RECORRIDO, PanelRecorrido, TarjetaRecorridos, ModalRecorridos, ContextoRecorrido, Paso } from './jc-proyectos/recorridos';
import { FrenteId } from './jc-proyectos/datos';

const NAV: { id: Seccion; label: string; icono: React.ComponentType<any>; grupo: string }[] = [
  { id: 'inicio', label: 'Inicio', icono: LayoutDashboard, grupo: '' },
  { id: 'campo', label: 'Celular del residente', icono: Smartphone, grupo: '' },
  { id: 'materiales', label: 'Pedidos y compras', icono: ShoppingCart, grupo: 'Materiales' },
  { id: 'recepcion', label: 'Recepción en obra', icono: PackageCheck, grupo: 'Materiales' },
  { id: 'presupuesto', label: 'Presupuesto e insumos', icono: Calculator, grupo: 'Materiales' },
  { id: 'nomina', label: 'Nómina', icono: Users, grupo: 'Personal' },
  { id: 'programa', label: 'Programa y reporte', icono: CalendarRange, grupo: 'Obra' },
  { id: 'asistente', label: 'Asistente IA', icono: Sparkles, grupo: 'Obra' },
];

// Lo que Jorge pidió en la reunión del 6 de octubre y dónde se ve en la demo.
const LO_QUE_PIDIO: { texto: string; seccion: Seccion; rol: Rol }[] = [
  { texto: '"Obra manda su requisición a oficina, oficina compra."', seccion: 'materiales', rol: 'director' },
  { texto: '"Cuando llegue a la obra, que se haga un check de que llegó completo."', seccion: 'recepcion', rol: 'residente' },
  { texto: '"Que me lo vaya descontando de mi explosión de insumos, de mi presupuesto."', seccion: 'presupuesto', rol: 'director' },
  { texto: 'Asistencias, altas y bajas del lunes, prenómina del miércoles y faltas que se descuentan después.', seccion: 'nomina', rol: 'rrhh' },
  { texto: '"Que tu reporte diario se enlace con el programa y el programa se vaya ajustando."', seccion: 'programa', rol: 'director' },
  { texto: 'Pasar las sábanas de Project a un reporte de dos o tres hojas para el dueño del proyecto.', seccion: 'programa', rol: 'director' },
  { texto: 'En la obra casi no hay internet: el biométrico no funcionó.', seccion: 'campo', rol: 'residente' },
];

function FranjaAviso({ onRecorridos }: { onRecorridos: () => void }) {
  return (
    <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60, height: 44, background: '#061629', color: '#cfe0f2', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontSize: 13, gap: 12 }}>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Demo para JC Proyectos · datos de ejemplo · nada de lo que haga aquí se guarda</span>
      <button type="button" onClick={onRecorridos} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, background: '#00bfa5', color: '#04211c', border: 'none', borderRadius: 8, padding: '0 12px', minHeight: 32, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
        <PlayCircle size={15} /> Recorridos guiados
      </button>
    </div>
  );
}

function Sidebar({ seccion, onCambiar, permitidas, persona }: { seccion: Seccion; onCambiar: (s: Seccion) => void; permitidas: Seccion[]; persona: Persona }) {
  return (
    <aside className="hidden lg:flex lg:flex-col" style={{ position: 'fixed', top: 44, left: 0, bottom: 0, width: 240, background: C.navy, padding: '18px 12px', zIndex: 40 }}>
      <div style={{ padding: '0 8px 18px' }}>
        <div style={{ background: '#fff', borderRadius: 10, padding: '10px 12px' }}><LogoJC alto={30} /></div>
        <p style={{ color: '#9db3cc', fontSize: 12, margin: '8px 0 0' }}>Gestión de obra · {OBRA.replace(' (obra de ejemplo)', '')}</p>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {NAV.filter(item => permitidas.includes(item.id)).map((item, i, lista) => {
          const activo = seccion === item.id;
          const titulo = item.grupo && item.grupo !== lista[i - 1]?.grupo ? item.grupo : null;
          return (
            <React.Fragment key={item.id}>
              {titulo && <p style={{ color: '#7f97b3', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, margin: '12px 12px 4px' }}>{titulo}</p>}
              <button type="button" onClick={() => onCambiar(item.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: 'none',
                background: activo ? C.navyLight : 'transparent', color: activo ? '#fff' : '#b9c9dd', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', textAlign: 'left', minHeight: 40, fontFamily: 'inherit', borderLeft: `3px solid ${activo ? C.teal : 'transparent'}`,
              }}>
                <item.icono size={17} /> {item.label}
              </button>
            </React.Fragment>
          );
        })}
      </nav>
      <div style={{ borderTop: '1px solid #1f3a5f', paddingTop: 12, marginTop: 12, color: '#9db3cc', fontSize: 13 }}>
        {persona.nombre}{persona.nombre !== persona.cargo ? ` · ${persona.cargo}` : ''}
        <p style={{ margin: '6px 0 0', fontSize: 11, color: '#6f88a6' }}>Hecho por Sixteam.pro</p>
      </div>
    </aside>
  );
}

function NavMovil({ seccion, onCambiar, permitidas }: { seccion: Seccion; onCambiar: (s: Seccion) => void; permitidas: Seccion[] }) {
  return (
    <div className="nav-movil flex lg:hidden" style={{ position: 'fixed', top: 44, left: 0, right: 0, zIndex: 50, background: C.navy, overflowX: 'auto', padding: '8px 10px', gap: 6 }}>
      {NAV.filter(item => permitidas.includes(item.id)).map(item => {
        const activo = seccion === item.id;
        return (
          <button key={item.id} type="button" onClick={() => onCambiar(item.id)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 20, border: 'none',
            background: activo ? C.navyLight : 'transparent', color: activo ? '#fff' : '#b9c9dd', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, minHeight: 40, fontFamily: 'inherit',
          }}>
            <item.icono size={15} /> {item.label}
          </button>
        );
      })}
    </div>
  );
}

function SelectorPersona({ persona, onCambiar }: { persona: Persona; onCambiar: (r: Rol) => void }) {
  return (
    <div style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10, padding: '10px 14px', marginBottom: 18 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
        <label htmlFor="ver-como" style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Ver como</label>
        <select id="ver-como" value={persona.id} onChange={e => onCambiar(e.target.value as Rol)} style={{ ...estiloInput, width: 'auto', minWidth: 230 }}>
          {PERSONAS.map(p => <option key={p.id} value={p.id}>{p.nombre === p.cargo ? p.cargo : `${p.nombre} · ${p.cargo}`}</option>)}
        </select>
      </div>
      <p style={{ fontSize: 13, color: C.muted, margin: '8px 0 0' }}>{QUE_HACE[persona.id]} Cada persona ve solo lo suyo.</p>
    </div>
  );
}

export default function JcProyectosDemo() {
  const [estado, dispatch] = useReducer(reducer, ESTADO_INICIAL);
  const [rol, setRol] = useState<Rol>('director');
  const [seccion, setSeccion] = useState<Seccion>('inicio');
  const [toast, setToast] = useState<string | null>(null);
  const [enLinea, setEnLinea] = useState(true);
  const [cola, setCola] = useState<Accion[]>([]);
  const [recepcionSel, setRecepcionSel] = useState<string | null>(null);
  const [frentePres, setFrentePres] = useState<FrenteId | 'todos'>('todos');
  const [tour, setTour] = useState<{ id: string; paso: number; reqId: string } | null>(null);
  const [menuTours, setMenuTours] = useState(false);

  const persona = PERSONAS.find(p => p.id === rol)!;
  const permitidas = SECCIONES_POR_ROL[rol];
  const presupuesto = useMemo(() => estadoPresupuesto(estado.reqs), [estado.reqs]);
  const programa = useMemo(() => resumenPrograma(estado.actividades), [estado.actividades]);
  const nomina = useMemo(() => totalesNomina(estado.cuadrilla), [estado.cuadrilla]);

  const avisar = useCallback((m: string) => { setToast(m); window.setTimeout(() => setToast(t => (t === m ? null : t)), 4200); }, []);
  const ir = (s: Seccion) => { setSeccion(s); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const irComo = (s: Seccion, r: Rol) => { if (!SECCIONES_POR_ROL[rol].includes(s)) setRol(r); ir(s); };
  const cambiarRol = (r: Rol) => { setRol(r); if (!SECCIONES_POR_ROL[r].includes(seccion)) setSeccion('inicio'); };

  // Lo que se captura en obra: con señal se aplica al momento; sin señal se guarda en el teléfono.
  const enviarCampo = (a: Accion, ok: string) => {
    if (enLinea) { dispatch(a); avisar(ok); }
    else { setCola(c => [...c, a]); avisar('Sin señal: quedó guardado en el teléfono. Se envía solo al volver la conexión.'); }
  };
  const cambiarSenal = (v: boolean) => {
    setEnLinea(v);
    if (v && cola.length) {
      cola.forEach(dispatch);
      avisar(cola.length === 1 ? 'Volvió la señal: se envió 1 registro a la oficina.' : `Volvió la señal: se enviaron ${cola.length} registros a la oficina.`);
      setCola([]);
    }
  };

  // Recorridos guiados: cada paso deja la demo en la persona y la pantalla que corresponden.
  const recorrido = tour ? RECORRIDOS.find(x => x.id === tour.id)! : null;
  const contextoTour: ContextoRecorrido | null = tour ? { estado, presupuesto, reqId: tour.reqId, enLinea, cola } : null;
  const prepararPaso = (paso: Paso, ctx: ContextoRecorrido) => {
    const p = paso.preparar(ctx);
    setRol(p.rol); setSeccion(p.seccion);
    if (p.recepcion !== undefined) setRecepcionSel(p.recepcion);
    setFrentePres(p.frentePresupuesto ?? 'todos');
  };
  const empezarTour = (id: string) => {
    const t = { id, paso: 0, reqId: `REQ-${String(estado.consecutivoReq).padStart(3, '0')}` };
    setTour(t);
    prepararPaso(RECORRIDOS.find(x => x.id === id)!.pasos[0], { estado, presupuesto, reqId: t.reqId, enLinea, cola });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const irPasoTour = (i: number) => {
    if (!tour || !recorrido || !contextoTour || i < 0 || i >= recorrido.pasos.length) return;
    setTour({ ...tour, paso: i });
    prepararPaso(recorrido.pasos[i], contextoTour);
  };
  const salirTour = () => { setTour(null); setFrentePres('todos'); };

  const porAprobar = estado.reqs.filter(r => r.estado === 'por-aprobar');
  const incompletas = estado.reqs.filter(r => r.estado === 'incompleta');
  const montoP = presupuesto.reduce((s, l) => s + l.montoPresupuesto, 0);
  const ejercido = presupuesto.reduce((s, l) => s + l.ejercido, 0);

  const alertas: { texto: string; seccion: Seccion; rol: Rol }[] = [
    ...porAprobar.flatMap(r => r.items.filter(it => excesoItem(presupuesto, it) > 0).map(it => ({
      texto: `${r.id}: ${num(it.cantidad)} ${insumo(it.insumoId).unidad} de ${insumo(it.insumoId).nombre} para ${nombreFrente(it.frente)} se pasan del presupuesto.`,
      seccion: 'materiales' as Seccion, rol: 'director' as Rol,
    }))),
    ...incompletas.map(r => ({ texto: `${r.oc} de ${r.proveedor} llegó incompleta: ${r.items.filter(it => it.recibido < it.cantidad).map(it => `faltan ${num(it.cantidad - it.recibido)} ${insumo(it.insumoId).unidad} de ${insumo(it.insumoId).nombre}`).join(', ')}.`, seccion: 'recepcion' as Seccion, rol: 'residente' as Rol })),
    ...(programa.masAtrasada ? [{ texto: `${programa.masAtrasada.nombre} de ${nombreFrente(programa.masAtrasada.frente)} va ${programa.atraso} días atrasada y corre la entrega al ${fechaCorta(programa.finEstimado)}.`, seccion: 'programa' as Seccion, rol: 'director' as Rol }] : []),
    ...alertasConsumo(presupuesto, programa).slice(0, 1).map(t => ({ texto: t, seccion: 'presupuesto' as Seccion, rol: 'director' as Rol })),
    ...observacionesNomina(estado.cuadrilla).slice(0, 1).map(t => ({ texto: t, seccion: 'nomina' as Seccion, rol: 'rrhh' as Rol })),
  ];

  return (
    <div className="jc-demo" style={{ minHeight: '100vh', background: C.surface, color: C.ink, fontFamily: "'Lato', Arial, sans-serif" }}>
      <style>{ESTILOS_RECORRIDO + "button:focus-visible, input:focus-visible, select:focus-visible, a:focus-visible { outline: 2px solid #00796b; outline-offset: 2px; } .nav-movil { scrollbar-width: none; } .nav-movil::-webkit-scrollbar { display: none; } .jc-demo ul { list-style: disc; }"}</style>
      <FranjaAviso onRecorridos={() => setMenuTours(true)} />
      <Sidebar seccion={seccion} onCambiar={ir} permitidas={permitidas} persona={persona} />
      <NavMovil seccion={seccion} onCambiar={ir} permitidas={permitidas} />
      <main className="pt-[116px] lg:pt-[64px] lg:ml-[240px]" style={{ maxWidth: 1180 }}>
        <div className="pb-10 px-4 sm:px-6" style={tour ? { paddingBottom: 300 } : undefined}>
          <SelectorPersona persona={persona} onCambiar={cambiarRol} />

          {seccion === 'inicio' && (
            <div>
              <div className="lg:hidden" style={{ marginBottom: 12 }}><div style={{ background: '#fff', borderRadius: 10, padding: '8px 12px', display: 'inline-flex', border: `1px solid ${C.line}` }}><LogoJC alto={30} /></div></div>
              <Titulo titulo={`Buen día${rol === 'director' ? ', Jorge' : ''}`} sub={`${OBRA} · ${HOY_TEXTO}. Todo lo de la obra en un solo lugar: materiales, gente, avance y dinero.`} />
              {!tour && <div style={{ marginBottom: 16 }}><TarjetaRecorridos onEmpezar={empezarTour} /></div>}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12, marginBottom: 16 }}>
                <TarjetaKpi icono={TrendingUp} titulo="Avance de obra" valor={pct(programa.real)} sub={`Programado a hoy: ${pct(programa.programado)}`} tono={programa.atraso > 0 ? 'amber' : 'green'} onClick={() => irComo('programa', 'director')} />
                <TarjetaKpi icono={CalendarClock} titulo="Entrega estimada" valor={fechaCorta(programa.finEstimado)} sub={programa.atraso > 0 ? `${programa.atraso} días después de lo programado` : 'A tiempo'} tono={programa.atraso > 0 ? 'red' : 'green'} onClick={() => irComo('programa', 'director')} />
                <TarjetaKpi icono={Calculator} titulo="Materiales recibidos" valor={pct((ejercido / montoP) * 100)} sub={`${money(ejercido)} de ${money(montoP)}`} tono="teal" onClick={() => irComo('presupuesto', 'director')} />
                <TarjetaKpi icono={ClipboardCheck} titulo="Pedidos por aprobar" valor={String(porAprobar.length)} sub={porAprobar.length ? 'Esperan su visto bueno' : 'Nada pendiente'} tono={porAprobar.length ? 'amber' : 'green'} onClick={() => irComo('materiales', 'director')} />
                <TarjetaKpi icono={PackageCheck} titulo="Entregas incompletas" valor={String(incompletas.length)} sub="Material que no llegó completo" tono={incompletas.length ? 'red' : 'green'} onClick={() => irComo('recepcion', 'residente')} />
                <TarjetaKpi icono={Wallet} titulo="Nómina de la semana" valor={money(nomina.neto)} sub={`${nomina.personas} personas en obra`} tono="blue" onClick={() => irComo('nomina', 'rrhh')} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14, alignItems: 'start' }}>
                <Tarjeta titulo="Para hoy" tour="para-hoy">
                  {alertas.length === 0 && <p style={{ margin: 0, color: C.muted }}>Todo en orden.</p>}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {alertas.map((a, i) => (
                      <button key={i} type="button" onClick={() => irComo(a.seccion, a.rol)} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', textAlign: 'left', background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: 10, cursor: 'pointer', fontFamily: 'inherit', color: C.ink, fontSize: 14 }}>
                        <AlertTriangle size={16} color={C.amber} style={{ flexShrink: 0, marginTop: 2 }} />
                        <span style={{ flex: 1 }}>{a.texto}</span>
                        <ChevronRight size={16} color={C.muted} style={{ flexShrink: 0, marginTop: 2 }} />
                      </button>
                    ))}
                  </div>
                </Tarjeta>
                <Tarjeta titulo="Lo que nos pidió y dónde verlo">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {LO_QUE_PIDIO.map((p, i) => (
                      <button key={i} type="button" onClick={() => irComo(p.seccion, p.rol)} style={{ display: 'flex', gap: 10, alignItems: 'center', textAlign: 'left', background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10, padding: 10, cursor: 'pointer', fontFamily: 'inherit', color: C.ink, fontSize: 14 }}>
                        <span style={{ flex: 1 }}>{p.texto}</span>
                        <Chip tono="teal" texto={NAV.find(n => n.id === p.seccion)!.label} />
                      </button>
                    ))}
                  </div>
                </Tarjeta>
              </div>


            </div>
          )}

          <div key={`${seccion}-${rol}-${frentePres}`}>
          {seccion === 'campo' && <SeccionCampo reqs={estado.reqs} cuadrilla={estado.cuadrilla} actividades={estado.actividades} presupuesto={presupuesto} enLinea={enLinea} onSenal={cambiarSenal} cola={cola} enviar={enviarCampo} />}
          {seccion === 'materiales' && <SeccionMateriales reqs={estado.reqs} presupuesto={presupuesto} programa={programa} persona={persona} dispatch={dispatch} avisar={avisar} onRecibir={id => { setRecepcionSel(id); ir('recepcion'); }} />}
          {seccion === 'recepcion' && <SeccionRecepcion reqs={estado.reqs} persona={persona} dispatch={dispatch} avisar={avisar} seleccion={recepcionSel} onSeleccion={setRecepcionSel} />}
          {seccion === 'presupuesto' && <SeccionPresupuesto presupuesto={presupuesto} programa={programa} avisar={avisar} frenteInicial={frentePres} />}
          {seccion === 'nomina' && <SeccionNomina cuadrilla={estado.cuadrilla} dispersada={estado.dispersada} persona={persona} dispatch={dispatch} avisar={avisar} />}
          {seccion === 'programa' && <SeccionPrograma actividades={estado.actividades} reportes={estado.reportes} programa={programa} presupuesto={presupuesto} nominaSemana={nomina.neto} pedidosPorAprobar={porAprobar.length} persona={persona} avisar={avisar} />}
          {seccion === 'asistente' && <SeccionAsistente reqs={estado.reqs} presupuesto={presupuesto} programa={programa} cuadrilla={estado.cuadrilla} actividades={estado.actividades} />}
          </div>

          <p style={{ fontSize: 12, color: C.muted, marginTop: 28 }}>
            Demo preparada por Sixteam.pro para JC Proyectos.
          </p>
        </div>
      </main>
      {toast && <Toast mensaje={toast} arriba={!!tour} />}
      {menuTours && <ModalRecorridos onEmpezar={empezarTour} onCerrar={() => setMenuTours(false)} />}
      {recorrido && contextoTour && tour && (
        <PanelRecorrido recorrido={recorrido} indice={tour.paso} contexto={contextoTour} onIr={irPasoTour} onSalir={salirTour}
          onHacer={a => {
            // Sin señal, lo que ya estaba guardado en el teléfono se envía primero; si era esta misma acción, no se repite.
            if (!enLinea) { setEnLinea(true); cola.forEach(dispatch); setCola([]); if (cola.some(x => x.tipo === a.tipo)) return; }
            dispatch(a);
          }} />
      )}
    </div>
  );
}
