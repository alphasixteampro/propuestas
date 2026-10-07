// Vista de proyecto (módulo 04 de la propuesta): todo lo de un proyecto en una pantalla. Es solo lectura:
// reúne lo que ya calculan las demás pantallas (resúmenes de cada cliente, lista de morosos, informe a
// socios) y no cambia pagos, planes ni saldos.
import React, { useState } from 'react';
import {
  C, HOY, MESES_CORTOS, LOTES_TOTALES, PROYECTOS, money, fechaLarga, plural, porTrasladar, lugarPorNombre, enFiltroEmpresa, vigentes,
  Chip, Tarjeta, BotonSecundario, Campo, EstadisticaMini, estiloInput, chipDeEstadoGeneral, TONOS,
  Cliente, Proyecto, ResumenCliente, CuotaEstado, Persona, FiltroEmpresa, Seccion, Tono,
} from './base';

// Lo mínimo que esta pantalla necesita de lo que calcula el componente principal.
interface FilaMorosoProyecto { cliente: Cliente; proyecto: Proyecto; resumen: ResumenCliente; diasAtraso: number; accion: string; accionTono: Tono; }
interface GestionProyecto { fecha: string; tipo: string; resultado: string; compromiso?: { fecha: string; valor: number }; por: string; }
interface InformeProyectoDatos {
  finanzas: { recaudado: number; gastos: number; comisiones: number };
  soloMizarEnPeriodo: number; recaudadoSociedad: number; utilidad: number;
  reparto: { nombre: string; pct: number; valor: number }[];
}

type Pestana = 'resumen' | 'lotes' | 'programado' | 'cobro' | 'dinero' | 'gastos';
type Resumenes = Map<string, { cuotas: CuotaEstado[]; resumen: ResumenCliente }>;

const MESES_LARGOS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const celda: React.CSSProperties = { padding: '8px 6px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' };
const encabezado: React.CSSProperties = { textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` };

// Mismo periodo del informe a socios de la pantalla «Socios y flujo» (del 15 al 14, como en el formato).
const PERIODO_INICIO = '2026-08-15';
const PERIODO_FIN = '2026-09-14';

// ─────────────────────────────────────────────────────────────────────────
// CÁLCULOS DE LECTURA
// ─────────────────────────────────────────────────────────────────────────

// Pagos que de verdad entraron: vigentes y sin lo que cobró la administración anterior.
function pagosReales(c: Cliente) { return vigentes(c.pagos).filter(p => !p.administracionAnterior); }

function sumaPagos(c: Cliente): number { return pagosReales(c).reduce((s, p) => s + p.valor, 0); }

// Lo que vence en un mes según el plan del cliente (la misma suma de capital e interés de cada cuota).
function programadoDelMes(c: Cliente, mes: string): number {
  return c.plan.filter(q => q.vence.slice(0, 7) === mes).reduce((s, q) => s + q.capitalProg + q.interesProg, 0);
}

// Lo que el cliente pagó en un mes.
function ejecutadoDelMes(c: Cliente, mes: string): number {
  return pagosReales(c).filter(p => p.fecha.slice(0, 7) === mes).reduce((s, p) => s + p.valor, 0);
}

// Meses (AAAA-MM) desde `atras` meses antes del de la fecha hasta `adelante` meses después.
function ventanaDeMeses(fecha: string, atras: number, adelante: number): string[] {
  const [y, m] = fecha.split('-').map(Number);
  const meses: string[] = [];
  for (let i = -atras; i <= adelante; i++) {
    const total = (m - 1) + i;
    const anio = y + Math.floor(total / 12);
    const mes = ((total % 12) + 12) % 12 + 1;
    meses.push(`${anio}-${String(mes).padStart(2, '0')}`);
  }
  return meses;
}

function nombreMes(mes: string): string { return MESES_LARGOS[Number(mes.slice(5, 7)) - 1]; }

// Color de la celda «E» frente a la «P»: verde si se pagó lo programado o más, ámbar si se pagó una
// parte y rojo si el mes ya pasó y no entró nada.
function tonoEjecutado(programado: number, ejecutado: number, mesPasado: boolean): Tono | null {
  if (ejecutado > 0 && ejecutado >= programado) return 'green';
  if (ejecutado > 0) return 'amber';
  if (programado > 0 && mesPasado) return 'red';
  return null;
}

// Chips de un lugar de recaudo: si es efectivo o cuenta personal, y si la cuenta es de otra sociedad.
function chipsDeLugar(cuenta: string, proyecto: Proyecto): { tono: Tono; texto: string }[] {
  const lugar = lugarPorNombre(cuenta);
  if (!lugar) return cuenta.startsWith('Cruce') ? [{ tono: 'muted', texto: 'Cruce de cartera' }] : [];
  const chips: { tono: Tono; texto: string }[] = [];
  if (lugar.tipo === 'efectivo') chips.push({ tono: 'muted', texto: 'Efectivo' });
  if (lugar.tipo === 'personal') chips.push({ tono: 'muted', texto: 'Cuenta personal' });
  if (lugar.sociedad && lugar.sociedad !== proyecto.sociedad) chips.push({ tono: 'amber', texto: 'Cuenta de otra sociedad' });
  return chips;
}

// ─────────────────────────────────────────────────────────────────────────
// PANTALLA
// ─────────────────────────────────────────────────────────────────────────

export function SeccionProyecto(props: {
  proyectoId: string; setProyectoId: (id: string) => void;
  clientes: Cliente[]; resumenes: Resumenes; persona: Persona; empresa: FiltroEmpresa; permitidas: Seccion[];
  listaMorosos: FilaMorosoProyecto[]; gestiones: Map<string, GestionProyecto[]>;
  // Cálculos que ya existen en el componente principal: se reutilizan tal cual.
  contratoCerrado: (c: Cliente) => boolean;
  textoEstado: (e: ResumenCliente['estadoGeneral']) => string;
  informe: (p: Proyecto, inicio: string, fin: string) => InformeProyectoDatos;
  gastosCruzados: Record<string, { proyecto: string; valor: number }[]>;
  onVerEstadoCuenta: (clienteId: string) => void; onIrA: (s: Seccion) => void; onIrComo: (personaId: string, s: Seccion) => void;
}) {
  const { proyectoId, setProyectoId, clientes, resumenes, persona, empresa, permitidas, listaMorosos, gestiones, contratoCerrado, textoEstado, informe, gastosCruzados, onVerEstadoCuenta, onIrA, onIrComo } = props;
  const [pestana, setPestana] = useState<Pestana>('resumen');

  // Solo los proyectos que esta persona ve con el filtro de empresa elegido (igual que en Socios).
  const proyectos = PROYECTOS.filter(p => (!persona.sede || p.sede === persona.sede) && enFiltroEmpresa(p.sede, empresa));
  const proyecto = proyectos.find(p => p.id === proyectoId) ?? proyectos[0];
  if (!proyecto) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Proyectos</h1>
        <Tarjeta><p style={{ margin: 0, fontSize: 14, color: C.muted }}>No hay proyectos para mostrar con este filtro de empresa.</p></Tarjeta>
      </div>
    );
  }
  const delProyecto = clientes.filter(c => c.raw.proyectoId === proyecto.id);
  const activos = delProyecto.filter(c => !contratoCerrado(c));

  const botonPestana = (id: Pestana, texto: string) => (
    <button key={id} type="button" onClick={() => setPestana(id)} aria-pressed={pestana === id} style={{
      padding: '8px 16px', borderRadius: 8, border: `1px solid ${pestana === id ? C.navy : C.lineStrong}`,
      background: pestana === id ? C.navy : C.paper, color: pestana === id ? '#fff' : C.ink, fontWeight: 600, fontSize: 13,
      cursor: 'pointer', minHeight: 40, fontFamily: 'inherit',
    }}>{texto}</button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Proyectos</h1>
        <p style={{ fontSize: 13, color: C.muted, margin: '4px 0 0' }}>Todo lo del proyecto en una pantalla: ventas, cartera, dinero, gastos y socios.</p>
      </div>

      <Tarjeta style={{ padding: 16 }}>
        <Campo id="select-proyecto-vista" label="Proyecto">
          <select id="select-proyecto-vista" value={proyecto.id} onChange={e => setProyectoId(e.target.value)} style={{ ...estiloInput, width: 'auto', minWidth: 260 }}>
            {proyectos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </Campo>
        <p style={{ fontSize: 13, color: C.muted, margin: '8px 0 0' }}>
          Sociedad: <strong style={{ color: C.ink }}>{proyecto.sociedad}</strong> · Sede: <strong style={{ color: C.ink }}>{proyecto.sede}</strong>
        </p>
      </Tarjeta>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {botonPestana('resumen', 'Resumen')}
        {botonPestana('lotes', 'Lotes')}
        {botonPestana('programado', 'Programado frente a pagado')}
        {botonPestana('cobro', 'Cobro')}
        {botonPestana('dinero', 'Dinero')}
        {botonPestana('gastos', 'Gastos y socios')}
      </div>

      {pestana === 'resumen' && <PestanaResumen proyecto={proyecto} delProyecto={delProyecto} activos={activos} resumenes={resumenes} />}
      {pestana === 'lotes' && (
        <PestanaLotes delProyecto={delProyecto} resumenes={resumenes} contratoCerrado={contratoCerrado} textoEstado={textoEstado} onVerEstadoCuenta={onVerEstadoCuenta} />
      )}
      {pestana === 'programado' && <PestanaProgramado activos={activos} />}
      {pestana === 'cobro' && (
        <PestanaCobro proyecto={proyecto} morosos={listaMorosos.filter(m => m.proyecto.id === proyecto.id)} gestiones={gestiones}
          puedeIrAMorosos={permitidas.includes('morosos')} onVerEstadoCuenta={onVerEstadoCuenta} onIrA={onIrA} />
      )}
      {pestana === 'dinero' && <PestanaDinero proyecto={proyecto} delProyecto={delProyecto} />}
      {pestana === 'gastos' && (
        <PestanaGastos proyecto={proyecto} puedeVer={permitidas.includes('socios')} informe={informe} gastosCruzados={gastosCruzados} onIrComo={onIrComo} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// RESUMEN
// ─────────────────────────────────────────────────────────────────────────

function PestanaResumen({ proyecto, delProyecto, activos, resumenes }: { proyecto: Proyecto; delProyecto: Cliente[]; activos: Cliente[]; resumenes: Resumenes }) {
  const total = LOTES_TOTALES[proyecto.id] ?? 20;
  const vendidos = activos.length;
  const disponibles = Math.max(0, total - vendidos);
  const valorVendido = activos.reduce((s, c) => s + c.raw.valorVenta, 0);
  // Lo recogido incluye a todos los clientes del proyecto: el dinero ya entró aunque el contrato se haya cerrado después.
  const recogido = delProyecto.reduce((s, c) => s + sumaPagos(c), 0);
  const resumenesActivos = activos.map(c => resumenes.get(c.raw.id)?.resumen).filter((r): r is ResumenCliente => !!r);
  const porCobrar = resumenesActivos.reduce((s, r) => s + r.saldoCapital, 0);
  const vencido = resumenesActivos.reduce((s, r) => s + r.valorVencido, 0);
  const mora = resumenesActivos.reduce((s, r) => s + r.moraAHoy, 0);
  const enMora = resumenesActivos.filter(r => r.cuotasVencidas > 0).length;
  const mes = HOY.slice(0, 7);
  const programadoMes = activos.reduce((s, c) => s + programadoDelMes(c, mes), 0);
  const recaudadoMes = activos.reduce((s, c) => s + ejecutadoDelMes(c, mes), 0);
  const cumplimiento = programadoMes > 0 ? Math.round((recaudadoMes / programadoMes) * 100) : null;
  return (
    <Tarjeta>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 12 }}>
        <EstadisticaMini titulo="Lotes vendidos" valor={`${vendidos} de ${total}`} />
        <EstadisticaMini titulo="Lotes disponibles" valor={String(disponibles)} />
        <EstadisticaMini titulo="Valor vendido" valor={money(valorVendido)} />
        <EstadisticaMini titulo="Recogido" valor={money(recogido)} tono={C.green} />
        <EstadisticaMini titulo="Por cobrar" valor={money(porCobrar)} />
        <EstadisticaMini titulo="Vencido" valor={money(vencido)} tono={vencido > 0 ? C.red : undefined} />
        <EstadisticaMini titulo="Mora a hoy" valor={proyecto.conMora ? money(mora) : 'No aplica'} tono={proyecto.conMora && mora > 0 ? C.red : undefined} />
        <EstadisticaMini titulo={`Cumplimiento de ${nombreMes(mes)}`} valor={cumplimiento === null ? '—' : `${cumplimiento}%`}
          tono={cumplimiento === null ? undefined : cumplimiento >= 100 ? C.green : C.amber} />
      </div>
      <p style={{ fontSize: 13, color: C.ink, margin: '0 0 6px' }}>
        {enMora === 0 ? 'Ningún cliente tiene cuotas vencidas.' : `${plural(enMora, 'cliente tiene', 'clientes tienen')} cuotas vencidas.`}{' '}
        Cumplimiento de {nombreMes(mes)}: se recaudaron {money(recaudadoMes)} frente a {money(programadoMes)} programados para el mes.
      </p>
      <p style={{ fontSize: 12, color: C.muted, margin: '0 0 6px' }}>
        Recogido es lo que los clientes pagaron en cuotas desde que la plataforma lleva los pagos: no incluye la cuota inicial ni lo que cobró la administración anterior.
        La demo trae pocos clientes de muestra por proyecto y el total de lotes es de ejemplo.
      </p>
      <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Reemplaza la pestaña del proyecto en el Excel de flujo.</p>
    </Tarjeta>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// LOTES
// ─────────────────────────────────────────────────────────────────────────

function PestanaLotes({ delProyecto, resumenes, contratoCerrado, textoEstado, onVerEstadoCuenta }: {
  delProyecto: Cliente[]; resumenes: Resumenes; contratoCerrado: (c: Cliente) => boolean;
  textoEstado: (e: ResumenCliente['estadoGeneral']) => string; onVerEstadoCuenta: (id: string) => void;
}) {
  return (
    <Tarjeta>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 820 }}>
          <thead>
            <tr style={encabezado}>
              <th style={{ padding: '8px 6px' }}>Lote o inmueble</th><th style={{ padding: '8px 6px' }}>Cliente</th><th style={{ padding: '8px 6px' }}>Vendedor</th>
              <th style={{ padding: '8px 6px' }}>Etapa del contrato</th><th style={{ padding: '8px 6px' }}>Estado</th><th style={{ padding: '8px 6px' }}>Saldo</th>
            </tr>
          </thead>
          <tbody>
            {delProyecto.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 16, textAlign: 'center', color: C.muted }}>Este proyecto no tiene clientes en la demo.</td></tr>
            )}
            {delProyecto.map(c => {
              const r = resumenes.get(c.raw.id)?.resumen;
              const cerrado = contratoCerrado(c);
              const t = c.raw.tramites;
              return (
                <tr key={c.raw.id} onClick={() => onVerEstadoCuenta(c.raw.id)} style={{ borderBottom: `1px solid ${C.line}`, verticalAlign: 'top', cursor: 'pointer' }}>
                  <td style={{ padding: '8px 6px', fontWeight: 600 }}>
                    <button type="button" title="Abrir el estado de cuenta de este cliente" style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', fontWeight: 600, color: C.blue, cursor: 'pointer', textDecoration: 'underline', textAlign: 'left' }}>
                      {c.raw.inmueble}
                    </button>
                  </td>
                  <td style={{ padding: '8px 6px' }}>{c.raw.nombre}</td>
                  <td style={{ padding: '8px 6px' }}>{c.raw.vendedor ?? '—'}</td>
                  <td style={{ padding: '8px 6px' }}>
                    {t ? (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <Chip tono={t.promesa ? 'green' : 'amber'} texto={t.promesa ? 'Promesa firmada' : 'Promesa pendiente'} />
                        <Chip tono={t.compraventa ? 'green' : 'amber'} texto={t.compraventa ? 'Compraventa firmada' : 'Compraventa pendiente'} />
                        <Chip tono={t.escritura ? 'green' : 'amber'} texto={t.escritura ? 'Escriturado' : 'Escritura pendiente'} />
                      </div>
                    ) : <span style={{ fontSize: 12, color: C.muted }}>Sin trámites registrados</span>}
                  </td>
                  <td style={{ padding: '8px 6px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {cerrado
                        ? <Chip tono="muted" texto={c.estado === 'desistido' ? 'Desistido' : 'Lote recuperado'} />
                        : r && <Chip tono={chipDeEstadoGeneral(r.estadoGeneral)} texto={textoEstado(r.estadoGeneral)} />}
                      {!cerrado && c.acuerdo && <Chip tono="purple" texto={c.acuerdo.tipo === 'suspension' ? 'Pagos suspendidos' : 'Con acuerdo'} />}
                    </div>
                  </td>
                  <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{cerrado || !r ? '—' : money(r.saldoCapital)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: C.muted, margin: '10px 0 0' }}>Haz clic en un lote para abrir el estado de cuenta de su cliente.</p>
    </Tarjeta>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PROGRAMADO FRENTE A PAGADO
// ─────────────────────────────────────────────────────────────────────────

function PestanaProgramado({ activos }: { activos: Cliente[] }) {
  // Los 6 meses hasta el de hoy y los 3 siguientes.
  const meses = ventanaDeMeses(HOY, 5, 3);
  const mesHoy = HOY.slice(0, 7);
  const filas = activos.map(c => ({ cliente: c, celdas: meses.map(m => ({ p: programadoDelMes(c, m), e: ejecutadoDelMes(c, m) })) }));
  const totales = meses.map((_, i) => ({ p: filas.reduce((s, f) => s + f.celdas[i].p, 0), e: filas.reduce((s, f) => s + f.celdas[i].e, 0) }));
  const celdaE = (p: number, e: number, mes: string, negrita = false) => {
    const tono = tonoEjecutado(p, e, mes < mesHoy);
    const t = tono ? TONOS[tono] : null;
    return (
      <td key={`e-${mes}`} style={{ ...celda, textAlign: 'right', fontSize: 12, fontWeight: negrita || tono ? 700 : 400, background: t?.bg, color: t?.fg ?? C.ink, borderRight: `1px solid ${C.line}` }}>
        {e > 0 || tono === 'red' ? money(e) : '—'}
      </td>
    );
  };
  const celdaP = (p: number, mes: string, negrita = false) => (
    <td key={`p-${mes}`} style={{ ...celda, textAlign: 'right', fontSize: 12, fontWeight: negrita ? 700 : 400, color: p > 0 ? C.ink : C.muted }}>{p > 0 ? money(p) : '—'}</td>
  );
  const pegada: React.CSSProperties = { position: 'sticky', left: 0, zIndex: 1, boxShadow: `1px 0 0 ${C.line}` };
  return (
    <Tarjeta>
      <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}>Programado frente a pagado, mes a mes</p>
      <p style={{ fontSize: 13, color: C.muted, margin: '0 0 10px' }}>
        P es lo programado: las cuotas que vencen ese mes según el plan de cada cliente. E es lo ejecutado: los pagos que entraron ese mes.
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <Chip tono="green" texto="Pagó lo programado o más" />
        <Chip tono="amber" texto="Pagó una parte" />
        <Chip tono="red" texto="Mes pasado sin pagos" />
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: 13, minWidth: 230 + meses.length * 190 }}>
          <thead>
            <tr style={{ color: C.muted, borderBottom: `1px solid ${C.line}` }}>
              <th rowSpan={2} style={{ ...celda, ...pegada, textAlign: 'left', background: C.paper, verticalAlign: 'bottom' }}>Cliente · lote</th>
              {meses.map(m => (
                <th key={m} colSpan={2} style={{ ...celda, textAlign: 'center', background: m === mesHoy ? C.blueSoft : undefined, color: m === mesHoy ? C.blue : C.muted, borderRight: `1px solid ${C.line}` }}>
                  {MESES_CORTOS[Number(m.slice(5, 7)) - 1]} {m.slice(0, 4)}{m === mesHoy ? ' · hoy' : ''}
                </th>
              ))}
            </tr>
            <tr style={{ color: C.muted, borderBottom: `1px solid ${C.line}` }}>
              {meses.map(m => (
                <React.Fragment key={m}>
                  <th title="Programado: cuotas que vencen ese mes" style={{ ...celda, textAlign: 'right', fontSize: 12 }}>P</th>
                  <th title="Ejecutado: pagos recibidos ese mes" style={{ ...celda, textAlign: 'right', fontSize: 12, borderRight: `1px solid ${C.line}` }}>E</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 && (
              <tr><td colSpan={1 + meses.length * 2} style={{ padding: 16, textAlign: 'center', color: C.muted }}>Este proyecto no tiene contratos vigentes en la demo.</td></tr>
            )}
            {filas.map(f => (
              <tr key={f.cliente.raw.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                <td style={{ ...celda, ...pegada, background: C.paper, fontWeight: 600 }}>
                  {f.cliente.raw.nombre}<div style={{ fontWeight: 400, fontSize: 12, color: C.muted }}>{f.cliente.raw.inmueble}</div>
                </td>
                {f.celdas.map((x, i) => (
                  <React.Fragment key={meses[i]}>{celdaP(x.p, meses[i])}{celdaE(x.p, x.e, meses[i])}</React.Fragment>
                ))}
              </tr>
            ))}
            {filas.length > 0 && (
              <tr style={{ background: C.surfaceStrong }}>
                <td style={{ ...celda, ...pegada, background: C.surfaceStrong, fontWeight: 700 }}>Total</td>
                {totales.map((x, i) => (
                  <React.Fragment key={meses[i]}>{celdaP(x.p, meses[i], true)}{celdaE(x.p, x.e, meses[i], true)}</React.Fragment>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: C.muted, margin: '10px 0 0' }}>Es la misma hoja de programado y ejecutado, pero se llena sola con cada pago.</p>
    </Tarjeta>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// COBRO
// ─────────────────────────────────────────────────────────────────────────

function PestanaCobro({ proyecto, morosos, gestiones, puedeIrAMorosos, onVerEstadoCuenta, onIrA }: {
  proyecto: Proyecto; morosos: FilaMorosoProyecto[]; gestiones: Map<string, GestionProyecto[]>;
  puedeIrAMorosos: boolean; onVerEstadoCuenta: (id: string) => void; onIrA: (s: Seccion) => void;
}) {
  if (morosos.length === 0) {
    return <Tarjeta><p style={{ margin: 0, fontSize: 14, color: C.ink }}>Nadie atrasado en este proyecto.</p></Tarjeta>;
  }
  return (
    <Tarjeta>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>{plural(morosos.length, 'cliente atrasado', 'clientes atrasados')} en este proyecto</p>
        {puedeIrAMorosos && <BotonSecundario onClick={() => onIrA('morosos')}>Gestionar en Morosos y cobranza</BotonSecundario>}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 900 }}>
          <thead>
            <tr style={encabezado}>
              <th style={{ padding: '8px 6px' }}>Cliente</th><th style={{ padding: '8px 6px' }}>Cuotas vencidas</th><th style={{ padding: '8px 6px' }}>Días</th>
              <th style={{ padding: '8px 6px' }}>Vencido</th><th style={{ padding: '8px 6px' }}>Mora</th><th style={{ padding: '8px 6px' }}>Próxima acción</th>
              <th style={{ padding: '8px 6px' }}>Última gestión</th><th style={{ padding: '8px 6px' }} />
            </tr>
          </thead>
          <tbody>
            {morosos.map(m => {
              const id = m.cliente.raw.id;
              const historial = gestiones.get(id);
              const ultima = historial ? historial[historial.length - 1] : undefined;
              return (
                <tr key={id} style={{ borderBottom: `1px solid ${C.line}`, verticalAlign: 'top' }}>
                  <td style={{ padding: '8px 6px', fontWeight: 600 }}>{m.cliente.raw.nombre}<div style={{ fontWeight: 400, fontSize: 12, color: C.muted }}>{m.cliente.raw.inmueble}</div></td>
                  <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{m.resumen.cuotasVencidas}</td>
                  <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{m.diasAtraso}</td>
                  <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{money(m.resumen.valorVencido)}</td>
                  <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{proyecto.conMora ? money(m.resumen.moraAHoy) : 'No aplica'}</td>
                  <td style={{ padding: '8px 6px' }}><Chip tono={m.accionTono} texto={m.accion} /></td>
                  <td style={{ padding: '8px 6px', fontSize: 12, color: C.muted }}>
                    {ultima ? <>{ultima.tipo} · {ultima.resultado}{ultima.compromiso && (ultima.compromiso.fecha < HOY
                      ? <div style={{ color: C.red, fontWeight: 700 }}>Compromiso incumplido: {money(ultima.compromiso.valor)} para el {fechaLarga(ultima.compromiso.fecha)}</div>
                      : <div style={{ color: C.blue }}>Compromiso: {money(ultima.compromiso.valor)} el {fechaLarga(ultima.compromiso.fecha)}</div>)}</> : 'Sin gestiones todavía'}
                  </td>
                  <td style={{ padding: '8px 6px' }}><BotonSecundario onClick={() => onVerEstadoCuenta(id)}>Estado de cuenta</BotonSecundario></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Tarjeta>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// DINERO
// ─────────────────────────────────────────────────────────────────────────

function PestanaDinero({ proyecto, delProyecto }: { proyecto: Proyecto; delProyecto: Cliente[] }) {
  const porLugar = new Map<string, { n: number; total: number; sinConsignar: number }>();
  for (const c of delProyecto) {
    for (const p of pagosReales(c)) {
      const x = porLugar.get(p.cuenta) ?? { n: 0, total: 0, sinConsignar: 0 };
      x.n += 1; x.total += p.valor; if (porTrasladar(p)) x.sinConsignar += p.valor;
      porLugar.set(p.cuenta, x);
    }
  }
  const filas = [...porLugar.entries()].map(([cuenta, v]) => ({ cuenta, ...v })).sort((a, b) => b.total - a.total);
  const total = filas.reduce((s, f) => s + f.total, 0);
  const totalN = filas.reduce((s, f) => s + f.n, 0);
  const totalSinConsignar = filas.reduce((s, f) => s + f.sinConsignar, 0);
  const deOtraSociedad = filas.filter(f => chipsDeLugar(f.cuenta, proyecto).some(ch => ch.texto === 'Cuenta de otra sociedad')).reduce((s, f) => s + f.total, 0);
  return (
    <Tarjeta>
      <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}>Dónde entró el dinero de este proyecto</p>
      <p style={{ fontSize: 13, color: C.muted, margin: '0 0 12px' }}>Cuenta principal del proyecto: {proyecto.cuentaDefault}.</p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 680 }}>
          <thead>
            <tr style={encabezado}>
              <th style={celda}>Dónde entró</th><th style={celda}>Qué es</th><th style={celda}>Pagos</th><th style={celda}>Total</th><th style={celda}>Sin consignar</th>
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 && (
              <tr><td colSpan={5} style={{ ...celda, textAlign: 'center', color: C.muted, padding: 16 }}>Este proyecto todavía no tiene pagos registrados.</td></tr>
            )}
            {filas.map(f => {
              const lugar = lugarPorNombre(f.cuenta);
              const chips = chipsDeLugar(f.cuenta, proyecto);
              return (
                <tr key={f.cuenta} style={{ borderBottom: `1px solid ${C.line}` }}>
                  <td style={{ ...celda, whiteSpace: 'normal', fontWeight: 600 }}>
                    {f.cuenta}
                    {lugar?.tipo === 'banco' && lugar.sociedad && <div style={{ fontWeight: 400, fontSize: 12, color: C.muted }}>{lugar.banco} · {lugar.sociedad}</div>}
                  </td>
                  <td style={{ ...celda, whiteSpace: 'normal' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {chips.length === 0 ? <span style={{ color: C.muted }}>Cuenta de la sociedad</span> : chips.map(ch => <Chip key={ch.texto} tono={ch.tono} texto={ch.texto} />)}
                    </div>
                  </td>
                  <td style={celda}>{f.n}</td>
                  <td style={{ ...celda, fontWeight: 600 }}>{money(f.total)}</td>
                  <td style={{ ...celda, color: f.sinConsignar > 0 ? C.amber : C.muted, fontWeight: f.sinConsignar > 0 ? 700 : 400 }}>{f.sinConsignar > 0 ? money(f.sinConsignar) : '—'}</td>
                </tr>
              );
            })}
            {filas.length > 0 && (
              <tr style={{ background: C.surfaceStrong }}>
                <td style={{ ...celda, fontWeight: 700 }}>Total</td><td style={celda} /><td style={{ ...celda, fontWeight: 700 }}>{totalN}</td>
                <td style={{ ...celda, fontWeight: 700 }}>{money(total)}</td><td style={{ ...celda, fontWeight: 700 }}>{totalSinConsignar > 0 ? money(totalSinConsignar) : '—'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {deOtraSociedad > 0 && (
        <p style={{ fontSize: 13, color: C.amber, margin: '12px 0 0' }}>
          {money(deOtraSociedad)} entró a la cuenta de otra sociedad: cada pago deja una deuda entre sociedades hasta que se devuelve (se ve en Bancos).
        </p>
      )}
      <p style={{ fontSize: 12, color: C.muted, margin: '10px 0 0' }}>
        El efectivo y lo que llega a una cuenta personal sigue «sin consignar» hasta que tesorería lo pasa a la cuenta de la sociedad. No incluye lo que cobró la administración anterior.
      </p>
    </Tarjeta>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// GASTOS Y SOCIOS
// ─────────────────────────────────────────────────────────────────────────

function PestanaGastos({ proyecto, puedeVer, informe, gastosCruzados, onIrComo }: {
  proyecto: Proyecto; puedeVer: boolean; informe: (p: Proyecto, inicio: string, fin: string) => InformeProyectoDatos;
  gastosCruzados: Record<string, { proyecto: string; valor: number }[]>; onIrComo: (personaId: string, s: Seccion) => void;
}) {
  const avisoModulo = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
      <Chip tono="muted" texto="Con los módulos de flujo y socios" />
      <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Esta pestaña aparece cuando se contratan el flujo de caja y los socios.</p>
    </div>
  );
  // Gastos, comisiones y reparto son cifras de socios: quien no tiene esa pantalla tampoco las ve aquí.
  if (!puedeVer) {
    return (
      <Tarjeta>
        {avisoModulo}
        <p style={{ fontSize: 13, color: C.ink, margin: '12px 0' }}>Los gastos y el reparto a socios los ven gerencia, tesorería y quien responde por la sede. Cambia en «Ver como» para verlos.</p>
        <BotonSecundario onClick={() => onIrComo('claudia', 'proyectos')}>Ver como Claudia · Gerencia</BotonSecundario>
      </Tarjeta>
    );
  }
  const { finanzas, soloMizarEnPeriodo, recaudadoSociedad, utilidad, reparto } = informe(proyecto, PERIODO_INICIO, PERIODO_FIN);
  const quePago = gastosCruzados[proyecto.id] ?? [];
  // Gastos de este proyecto que pagó otro (el nombre se compara sin lo que va entre paréntesis).
  const base = proyecto.nombre.replace(/\s*\(.*\)\s*$/, '');
  const quePagaronPorEste = Object.entries(gastosCruzados).filter(([id]) => id !== proyecto.id)
    .flatMap(([id, lista]) => lista.filter(g => g.proyecto.startsWith(base)).map(g => ({ quien: PROYECTOS.find(p => p.id === id)?.nombre ?? id, valor: g.valor })));
  return (
    <Tarjeta>
      {avisoModulo}
      <p style={{ fontSize: 13, color: C.muted, margin: '12px 0' }}>Periodo: {fechaLarga(PERIODO_INICIO)} – {fechaLarga(PERIODO_FIN)}, el mismo del informe a socios.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 12 }}>
        <EstadisticaMini titulo="Se recogió" valor={money(recaudadoSociedad)} />
        <EstadisticaMini titulo="Se gastó" valor={money(finanzas.gastos)} />
        <EstadisticaMini titulo="Comisiones de venta" valor={money(finanzas.comisiones)} />
        <EstadisticaMini titulo="Utilidad del periodo" valor={money(utilidad)} tono={C.green} />
      </div>
      <p style={{ fontSize: 12, color: C.muted, margin: '0 0 12px' }}>
        La comisión de venta de este proyecto es el {proyecto.comisionPct} % del valor vendido.
        {soloMizarEnPeriodo > 0 ? ` No incluye ${money(soloMizarEnPeriodo)} de clientes marcados «solo Mizar»: ese dinero va completo a Mizar.` : ''}
      </p>

      <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: '0 0 8px' }}>Gastos entre proyectos</p>
      {quePago.length === 0 && quePagaronPorEste.length === 0 && (
        <p style={{ fontSize: 13, color: C.muted, margin: '0 0 12px' }}>Este proyecto no pagó gastos de otros ni otro pagó gastos suyos.</p>
      )}
      {quePago.length > 0 && (
        <p style={{ fontSize: 13, color: C.blue, margin: '0 0 8px' }}>
          Este proyecto pagó gastos de otros: {quePago.map(g => `${g.proyecto} ${money(g.valor)}`).join(' · ')}. No se restan aquí: quedan como cuenta por cobrar a esos proyectos.
        </p>
      )}
      {quePagaronPorEste.length > 0 && (
        <p style={{ fontSize: 13, color: C.blue, margin: '0 0 8px' }}>
          Otros proyectos pagaron gastos de este: {quePagaronPorEste.map(g => `${g.quien} ${money(g.valor)}`).join(' · ')}. Quedan como cuenta por pagar entre proyectos.
        </p>
      )}

      <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: '12px 0 8px' }}>Le corresponde a cada socio</p>
      <div style={{ overflowX: 'auto', marginBottom: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 360 }}>
          <thead><tr style={encabezado}><th style={celda}>Socio</th><th style={celda}>% vigente</th><th style={celda}>Valor</th></tr></thead>
          <tbody>
            {reparto.map(s => (
              <tr key={s.nombre} style={{ borderBottom: `1px solid ${C.line}` }}><td style={{ ...celda, fontWeight: 600 }}>{s.nombre}</td><td style={celda}>{s.pct}%</td><td style={celda}>{money(s.valor)}</td></tr>
            ))}
            <tr><td style={{ ...celda, fontWeight: 700 }}>Total</td><td style={celda}>100%</td><td style={{ ...celda, fontWeight: 700 }}>{money(reparto.reduce((s, r) => s + r.valor, 0))}</td></tr>
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Los porcentajes son los vigentes al {fechaLarga(PERIODO_FIN)}. El informe completo para cada socio está en Socios y flujo.</p>
    </Tarjeta>
  );
}
