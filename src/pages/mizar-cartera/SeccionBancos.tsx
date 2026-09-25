// SECCIÓN: BANCOS Y CONCILIACIÓN (PRD 12C)
// Cuentas bancarias por empresa, movimientos de septiembre, carga simulada del extracto,
// cruce contra lo registrado, conciliación mensual y traslados entre cuentas.
import React, { useMemo, useState } from 'react';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import {
  C, HOY, money, fechaLarga, vigentes, Cliente, Persona, FiltroEmpresa, EmpresaId,
  empresaPorId, Chip, Tarjeta, BotonPrimario, BotonSecundario, Modal, Campo, estiloInput, Tono, TONOS,
} from './base';

// ─────────────────────────────────────────────────────────────────────────
// DATOS DE LA DEMO: cuentas, salidas fijas, rendimientos y partidas sin registro
// ─────────────────────────────────────────────────────────────────────────

interface CuentaBancaria {
  id: string; cuenta: string; banco: string; ultimos4: string; titular: string;
  empresaId: EmpresaId; saldoInicial: number; deTercero: boolean;
}

const CUENTAS: CuentaBancaria[] = [
  { id: 'bancolombia-mizar', cuenta: 'Bancolombia Mizar', banco: 'Bancolombia', ultimos4: '4821', titular: 'Mizar Diseño y Construcción S.A.S.', empresaId: 'mizar', saldoInicial: 271300000, deTercero: false },
  { id: 'cuenta-ictinos', cuenta: 'Cuenta Ictinos', banco: 'Banco de Bogotá', ultimos4: '7734', titular: 'Ictinos Inmobiliaria', empresaId: 'cucuta', saldoInicial: 38900000, deTercero: false },
  { id: 'cuenta-miraflor', cuenta: 'Cuenta Miraflor', banco: 'Davivienda', ultimos4: '1190', titular: 'Asociación de Vivienda Miraflor', empresaId: 'cucuta', saldoInicial: 2450000, deTercero: true },
];

function cuentaPorId(id: string): CuentaBancaria { return CUENTAS.find(c => c.id === id) ?? CUENTAS[0]; }

// Salidas fijas del mes por cuenta (órdenes de compra pagadas, nómina, caja menor).
const SALIDAS_FIJAS: Record<string, { fecha: string; concepto: string; valor: number }[]> = {
  'Bancolombia Mizar': [
    { fecha: '2026-09-04', concepto: 'OC-0142 · Ferretería Santander · Laureles', valor: 12480000 },
    { fecha: '2026-09-10', concepto: 'Nómina administrativa quincena 1', valor: 11500000 },
    { fecha: '2026-09-18', concepto: 'OC-0157 · Concretos del Oriente · Villa Plaza', valor: 38750000 },
    { fecha: '2026-09-19', concepto: 'Caja menor Bucaramanga (reembolso)', valor: 1200000 },
  ],
  'Cuenta Ictinos': [
    { fecha: '2026-09-08', concepto: 'Mantenimiento de lotes Miravista', valor: 1000000 },
    { fecha: '2026-09-15', concepto: 'Combustible y parqueadero camioneta', valor: 154006 },
  ],
  'Cuenta Miraflor': [
    { fecha: '2026-09-12', concepto: 'Gastos bancarios', valor: 18900 },
  ],
};

// Único ingreso fijo del mes que no viene de cartera: solo Bancolombia Mizar.
const ENTRADA_RENDIMIENTOS = { fecha: '2026-09-22', concepto: 'Rendimientos financieros', valor: 184300 };

// Líneas que solo aparecen en el banco, no en la plataforma: aquí es donde sirve la conciliación.
const PARTIDAS_SIN_REGISTRO: Record<string, { fecha: string; concepto: string; valor: number }[]> = {
  'Bancolombia Mizar': [
    { fecha: '2026-09-21', concepto: 'Consignación sin referencia', valor: 1450000 },
    { fecha: '2026-09-22', concepto: 'Comisión y 4x1000', valor: -52380 },
  ],
  'Cuenta Ictinos': [
    { fecha: '2026-09-11', concepto: 'Transferencia sin referencia', valor: 500000 },
    { fecha: '2026-09-22', concepto: 'Cuota de manejo', valor: -15900 },
  ],
  'Cuenta Miraflor': [
    { fecha: '2026-09-11', concepto: 'Consignación sin referencia', valor: 500000 },
  ],
};

// ─────────────────────────────────────────────────────────────────────────
// TIPOS Y FUNCIONES PURAS
// ─────────────────────────────────────────────────────────────────────────

interface MovimientoCuenta { id: string; fecha: string; concepto: string; tercero: string; entrada: number; salida: number; }
interface Traslado { id: string; origenId: string; destinoId: string; valor: number; fecha: string; motivo: string; }
type ReportePendiente = { id: string; clienteNombre: string; valor: number; referencia: string; cuenta: string; fecha: string };
type CruceExtracto = 'conciliada' | 'sin-registro' | 'reporte-visto';
interface LineaExtracto { fecha: string; concepto: string; valor: number; cruce: CruceExtracto; }
interface ResultadoCruce { lineas: LineaExtracto[]; conciliadas: number; sinRegistro: number; reportesVistos: number; reportesNoAparecen: ReportePendiente[]; }

// Movimientos generados solos: pagos vigentes que cayeron en esa cuenta en septiembre, más las
// salidas fijas, el ingreso de rendimientos (si aplica) y los traslados entre cuentas.
function movimientosDePagos(clientes: Cliente[], cuentaNombre: string): MovimientoCuenta[] {
  const movs: MovimientoCuenta[] = [];
  for (const c of clientes) {
    for (const p of vigentes(c.pagos)) {
      if (p.administracionAnterior || p.cuenta !== cuentaNombre || !p.fecha.startsWith('2026-09')) continue;
      movs.push({
        id: `pago-${p.recibo}`, fecha: p.fecha,
        concepto: `Recibo ${p.recibo} · contrato ${c.raw.numeroContrato ?? c.raw.id}`,
        tercero: c.raw.nombre, entrada: p.valor, salida: 0,
      });
    }
  }
  return movs;
}

function movimientosDeCuenta(cuenta: CuentaBancaria, clientes: Cliente[], traslados: Traslado[]): MovimientoCuenta[] {
  const movs = movimientosDePagos(clientes, cuenta.cuenta);
  for (const s of SALIDAS_FIJAS[cuenta.cuenta] ?? []) {
    movs.push({ id: `salida-${cuenta.id}-${s.fecha}-${s.concepto}`, fecha: s.fecha, concepto: s.concepto, tercero: '—', entrada: 0, salida: s.valor });
  }
  if (cuenta.cuenta === 'Bancolombia Mizar') {
    movs.push({ id: `rendimientos-${cuenta.id}`, fecha: ENTRADA_RENDIMIENTOS.fecha, concepto: ENTRADA_RENDIMIENTOS.concepto, tercero: '—', entrada: ENTRADA_RENDIMIENTOS.valor, salida: 0 });
  }
  for (const t of traslados) {
    if (t.origenId === cuenta.id) {
      const destino = cuentaPorId(t.destinoId);
      movs.push({ id: `traslado-${t.id}-sale`, fecha: t.fecha, concepto: `Traslado a ${destino.cuenta}: ${t.motivo}`, tercero: destino.titular, entrada: 0, salida: t.valor });
    }
    if (t.destinoId === cuenta.id) {
      const origen = cuentaPorId(t.origenId);
      movs.push({ id: `traslado-${t.id}-entra`, fecha: t.fecha, concepto: `Traslado desde ${origen.cuenta}: ${t.motivo}`, tercero: origen.titular, entrada: t.valor, salida: 0 });
    }
  }
  return movs.sort((a, b) => a.fecha.localeCompare(b.fecha));
}

function saldoDeCuenta(cuenta: CuentaBancaria, clientes: Cliente[], traslados: Traslado[]): number {
  return movimientosDeCuenta(cuenta, clientes, traslados).reduce((s, m) => s + m.entrada - m.salida, cuenta.saldoInicial);
}

const celda: React.CSSProperties = { padding: '8px 6px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' };

const CRUCE_INFO: Record<CruceExtracto, { tono: Tono; texto: string }> = {
  conciliada: { tono: 'green', texto: 'Conciliada' },
  'sin-registro': { tono: 'amber', texto: 'En el banco sin registro' },
  'reporte-visto': { tono: 'blue', texto: 'Reporte visto en el banco' },
};

// ─────────────────────────────────────────────────────────────────────────
// PIEZAS DE UI
// ─────────────────────────────────────────────────────────────────────────

function TarjetaCuenta({ cuenta, saldo, seleccionada, onClick }: { cuenta: CuentaBancaria; saldo: number; seleccionada: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      textAlign: 'left', background: C.paper, border: `1px solid ${seleccionada ? C.navy : C.line}`,
      borderRadius: 12, padding: 16, boxShadow: seleccionada ? '0 0 0 2px rgba(10,35,66,.12)' : '0 1px 2px rgba(20,30,50,.05)',
      cursor: 'pointer', fontFamily: 'inherit', minHeight: 40, display: 'flex', flexDirection: 'column', gap: 6, width: '100%',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>{cuenta.banco}</p>
          <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>•••• {cuenta.ultimos4}</p>
        </div>
        {cuenta.deTercero && <Chip tono="amber" texto="Cuenta de tercero" />}
      </div>
      <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{cuenta.titular}</p>
      <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{empresaPorId(cuenta.empresaId).corto}</p>
      <p style={{ fontSize: 20, fontWeight: 700, color: C.ink, margin: '6px 0 0', fontVariantNumeric: 'tabular-nums' }}>{money(saldo)}</p>
      <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>Saldo a hoy</p>
    </button>
  );
}

function TarjetaResultado({ tono, titulo, valor, detalle }: { tono: Tono; titulo: string; valor: string; detalle?: string }) {
  const t = TONOS[tono];
  return (
    <div style={{ background: t.bg, border: `1px solid ${t.fg}`, borderRadius: 10, padding: 14 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: t.fg, margin: '0 0 4px' }}>{titulo}</p>
      <p style={{ fontSize: 22, fontWeight: 700, color: t.fg, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{valor}</p>
      {detalle && <p style={{ fontSize: 12, color: t.fg, margin: '4px 0 0' }}>{detalle}</p>}
    </div>
  );
}

function ModalTraslado({ onCerrar, onConfirmar }: { onCerrar: () => void; onConfirmar: (d: { origenId: string; destinoId: string; valor: number; motivo: string }) => void }) {
  const [origenId, setOrigenId] = useState(CUENTAS[0].id);
  const [destinoId, setDestinoId] = useState(CUENTAS[1].id);
  const [valor, setValor] = useState(0);
  const [motivo, setMotivo] = useState('');
  const origen = cuentaPorId(origenId);
  const destino = cuentaPorId(destinoId);
  const empresasDistintas = origen.empresaId !== destino.empresaId;
  const puedeConfirmar = valor > 0 && motivo.trim().length > 0 && origenId !== destinoId;

  return (
    <Modal titulo="Traslado entre cuentas" subtitulo="Mueve dinero entre las cuentas de las dos empresas" onCerrar={onCerrar}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <Campo id="traslado-origen" label="Cuenta origen">
            <select id="traslado-origen" value={origenId} onChange={e => setOrigenId(e.target.value)} style={estiloInput}>
              {CUENTAS.map(c => <option key={c.id} value={c.id}>{c.cuenta}</option>)}
            </select>
          </Campo>
          <Campo id="traslado-destino" label="Cuenta destino">
            <select id="traslado-destino" value={destinoId} onChange={e => setDestinoId(e.target.value)} style={estiloInput}>
              {CUENTAS.map(c => <option key={c.id} value={c.id}>{c.cuenta}</option>)}
            </select>
          </Campo>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <Campo id="traslado-valor" label="Valor">
            <input id="traslado-valor" type="number" min={0} step={1000} value={valor || ''} onChange={e => setValor(Number(e.target.value) || 0)} style={estiloInput} />
          </Campo>
          <Campo id="traslado-fecha" label="Fecha">
            <input id="traslado-fecha" value={fechaLarga(HOY)} disabled style={{ ...estiloInput, background: C.surface, color: C.muted }} />
          </Campo>
        </div>
        <Campo id="traslado-motivo" label="Motivo">
          <input id="traslado-motivo" value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="Ej. Cubrir nómina de septiembre" style={estiloInput} />
        </Campo>
        {empresasDistintas && (
          <div style={{ background: C.blueSoft, border: `1px solid ${C.blue}`, borderRadius: 8, padding: 12 }}>
            <p style={{ fontSize: 13, color: C.blue, margin: 0 }}>
              Queda como cuenta por cobrar en {empresaPorId(origen.empresaId).corto} y por pagar en {empresaPorId(destino.empresaId).corto}; al consolidar el grupo se elimina.
            </p>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <BotonSecundario onClick={onCerrar}>Cancelar</BotonSecundario>
          <BotonPrimario disabled={!puedeConfirmar} onClick={() => onConfirmar({ origenId, destinoId, valor, motivo: motivo.trim() })}>Confirmar traslado</BotonPrimario>
        </div>
      </div>
    </Modal>
  );
}

// Tabla de movimientos que la plataforma ya registró para la cuenta seleccionada, con el saldo
// que va quedando después de cada uno y si esa cuenta ya se conciliró contra el banco.
function TablaMovimientos({ cuenta, filas, conciliado }: {
  cuenta: CuentaBancaria; filas: (MovimientoCuenta & { corrido: number })[]; conciliado: boolean;
}) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 720 }}>
        <thead>
          <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
            <th style={celda}>Fecha</th><th style={celda}>Concepto</th><th style={celda}>Tercero</th>
            <th style={celda}>Entrada</th><th style={celda}>Salida</th><th style={celda}>Saldo corrido</th><th style={celda}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {filas.map(m => (
            <tr key={m.id} style={{ borderBottom: `1px solid ${C.line}` }}>
              <td style={celda}>{fechaLarga(m.fecha)}</td>
              <td style={{ ...celda, whiteSpace: 'normal' }}>{m.concepto}</td>
              <td style={celda}>{m.tercero}</td>
              <td style={{ ...celda, color: C.green }}>{m.entrada > 0 ? money(m.entrada) : '—'}</td>
              <td style={{ ...celda, color: C.red }}>{m.salida > 0 ? money(m.salida) : '—'}</td>
              <td style={{ ...celda, fontWeight: 700 }}>{money(m.corrido)}</td>
              <td style={celda}>{conciliado ? <Chip tono="green" texto="Conciliado" /> : <Chip tono="muted" texto="Pendiente" />}</td>
            </tr>
          ))}
          {filas.length === 0 && (
            <tr><td colSpan={7} style={{ ...celda, color: C.muted, whiteSpace: 'normal' }}>Sin movimientos registrados este mes en {cuenta.cuenta}.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Resultado del cruce contra el extracto: las 4 tarjetas de conteo y el detalle línea por línea.
function PanelExtracto({ cuenta, resultado }: { cuenta: CuentaBancaria; resultado: ResultadoCruce }) {
  return (
    <Tarjeta>
      <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}>Resultado del cruce · {cuenta.cuenta}</p>
      <p style={{ fontSize: 12, color: C.muted, margin: '0 0 12px' }}>Así quedó el extracto de septiembre comparado con lo que ya estaba registrado.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
        <TarjetaResultado tono="green" titulo="Conciliadas" valor={String(resultado.conciliadas)} detalle="Movimientos que casan con el banco" />
        <TarjetaResultado tono="amber" titulo="En el banco sin registro" valor={String(resultado.sinRegistro)} detalle="Pasan a por identificar o a gastos" />
        <TarjetaResultado tono="blue" titulo="Reportes vistos en el banco" valor={String(resultado.reportesVistos)} detalle="Listos para aprobar en tesorería" />
        <TarjetaResultado tono="red" titulo="Reportes que no aparecen" valor={String(resultado.reportesNoAparecen.length)} detalle="El cliente dice que pagó, pero el banco no lo muestra" />
      </div>
      {resultado.reportesNoAparecen.length > 0 && (
        <div style={{ background: C.redSoft, border: `1px solid ${C.red}`, borderRadius: 8, padding: 12, marginBottom: 16 }}>
          {resultado.reportesNoAparecen.map(r => (
            <p key={r.id} style={{ fontSize: 13, color: C.red, margin: '2px 0' }}>{r.clienteNombre} · {money(r.valor)} · ref. {r.referencia} — no aparece en el extracto todavía.</p>
          ))}
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 640 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
              <th style={celda}>Fecha</th><th style={celda}>Concepto</th><th style={celda}>Valor</th><th style={celda}>Cruce</th>
            </tr>
          </thead>
          <tbody>
            {resultado.lineas.map((l, i) => {
              const info = CRUCE_INFO[l.cruce];
              return (
                <tr key={i} style={{ borderBottom: `1px solid ${C.line}` }}>
                  <td style={celda}>{fechaLarga(l.fecha)}</td>
                  <td style={{ ...celda, whiteSpace: 'normal' }}>{l.concepto}</td>
                  <td style={{ ...celda, color: l.valor >= 0 ? C.green : C.red }}>{money(l.valor)}</td>
                  <td style={celda}><Chip tono={info.tono} texto={info.texto} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Tarjeta>
  );
}

// Historial simple de los traslados que se han hecho en esta sesión, para que quede claro
// de dónde salió y a dónde llegó cada peso movido entre cuentas.
function PanelTraslados({ traslados }: { traslados: Traslado[] }) {
  if (traslados.length === 0) return null;
  return (
    <Tarjeta>
      <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: '0 0 12px' }}>Traslados entre cuentas</p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 620 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
              <th style={celda}>Fecha</th><th style={celda}>Origen</th><th style={celda}>Destino</th><th style={celda}>Valor</th><th style={celda}>Motivo</th>
            </tr>
          </thead>
          <tbody>
            {traslados.map(t => {
              const origen = cuentaPorId(t.origenId);
              const destino = cuentaPorId(t.destinoId);
              return (
                <tr key={t.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                  <td style={celda}>{fechaLarga(t.fecha)}</td>
                  <td style={celda}>{origen.cuenta}</td>
                  <td style={celda}>{destino.cuenta}</td>
                  <td style={{ ...celda, fontWeight: 600 }}>{money(t.valor)}</td>
                  <td style={{ ...celda, whiteSpace: 'normal' }}>{t.motivo}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Tarjeta>
  );
}

interface PartidaConKey { fecha: string; concepto: string; valor: number; key: string; }

// La conciliación en sí: compara el saldo del banco contra el de la plataforma y deja que
// tesorería explique cada diferencia, una por una, antes de poder cerrar el mes.
function PanelConciliacion({
  cuenta, extractoCargado, saldoBanco, saldoPlataforma, partidasPendientes, cerrada, personaNombre,
  puedeGestionar, motivoBloqueo, onResolver, onCerrar,
}: {
  cuenta: CuentaBancaria; extractoCargado: boolean; saldoBanco: number; saldoPlataforma: number;
  partidasPendientes: PartidaConKey[]; cerrada: boolean; personaNombre: string; puedeGestionar: boolean;
  motivoBloqueo?: string; onResolver: (key: string, esPositivo: boolean) => void; onCerrar: () => void;
}) {
  return (
    <Tarjeta>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>Conciliación de septiembre · {cuenta.cuenta}</p>
        {cerrada && <Chip tono="green" texto={`Cerrada por ${personaNombre}`} />}
      </div>
      {!extractoCargado ? (
        <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Carga el extracto de esta cuenta para iniciar la conciliación.</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, padding: 12 }}>
              <p style={{ fontSize: 12, color: C.muted, margin: '0 0 4px', fontWeight: 600 }}>Saldo según banco</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: C.ink, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{money(saldoBanco)}</p>
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, padding: 12 }}>
              <p style={{ fontSize: 12, color: C.muted, margin: '0 0 4px', fontWeight: 600 }}>Saldo según plataforma</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: C.ink, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{money(saldoPlataforma)}</p>
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, padding: 12 }}>
              <p style={{ fontSize: 12, color: C.muted, margin: '0 0 4px', fontWeight: 600 }}>Diferencia</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: saldoBanco === saldoPlataforma ? C.green : C.amber, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{money(saldoBanco - saldoPlataforma)}</p>
            </div>
          </div>
          {saldoBanco !== saldoPlataforma && partidasPendientes.length === 0 && (
            <p style={{ fontSize: 13, color: C.blue, margin: '0 0 12px' }}>
              La diferencia que queda son pagos reportados que ya aparecen en el banco y esperan aprobación en «Pagos por verificar».
            </p>
          )}
          <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, margin: '0 0 8px' }}>Partidas pendientes por explicar</p>
          {partidasPendientes.length === 0 ? (
            <p style={{ fontSize: 13, color: C.green, margin: '0 0 16px', fontWeight: 600 }}>No quedan partidas pendientes.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {partidasPendientes.map(p => (
                <div key={p.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, padding: 12 }}>
                  <div>
                    <p style={{ fontSize: 13, color: C.ink, margin: 0, fontWeight: 600 }}>{p.concepto}</p>
                    <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>{fechaLarga(p.fecha)} · {money(p.valor)}</p>
                  </div>
                  <BotonSecundario onClick={() => onResolver(p.key, p.valor > 0)}>{p.valor > 0 ? 'Enviar a por identificar' : 'Registrar gasto bancario'}</BotonSecundario>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
            <BotonPrimario disabled={!puedeGestionar || partidasPendientes.length > 0 || cerrada} onClick={onCerrar}>Cerrar conciliación de septiembre</BotonPrimario>
            {motivoBloqueo && !cerrada && <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{motivoBloqueo}.</p>}
          </div>
        </>
      )}
    </Tarjeta>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────

export function SeccionBancos(props: {
  clientes: Cliente[]; empresa: FiltroEmpresa; persona: Persona;
  reportesPendientes: { id: string; clienteNombre: string; valor: number; referencia: string; cuenta: string; fecha: string }[];
  onMarcarVistos: (ids: string[]) => void; onToast: (m: string) => void;
}) {
  const { clientes, empresa, persona, reportesPendientes, onMarcarVistos, onToast } = props;
  const puedeGestionar = persona.rol === 'tesoreria' || persona.rol === 'gerencia' || persona.rol === 'contabilidad';

  const cuentasVisibles = useMemo(() => CUENTAS.filter(c => empresa === 'grupo' || c.empresaId === empresa), [empresa]);

  const [cuentaSelIdState, setCuentaSelIdState] = useState(cuentasVisibles[0]?.id ?? CUENTAS[0].id);
  const cuentaSelId = cuentasVisibles.some(c => c.id === cuentaSelIdState) ? cuentaSelIdState : (cuentasVisibles[0]?.id ?? CUENTAS[0].id);
  const cuentaSel = cuentasVisibles.find(c => c.id === cuentaSelId) ?? CUENTAS[0];

  const [traslados, setTraslados] = useState<Traslado[]>([]);
  const [extractos, setExtractos] = useState<Record<string, ResultadoCruce>>({});
  const [cargandoId, setCargandoId] = useState<string | null>(null);
  const [resueltas, setResueltas] = useState<Set<string>>(new Set());
  const [cerradas, setCerradas] = useState<Set<string>>(new Set());
  const [modalTraslado, setModalTraslado] = useState(false);

  const movimientosSel = useMemo(() => movimientosDeCuenta(cuentaSel, clientes, traslados), [cuentaSel, clientes, traslados]);
  const filasMovimientos = useMemo(() => {
    let corrido = cuentaSel.saldoInicial;
    return movimientosSel.map(m => { corrido += m.entrada - m.salida; return { ...m, corrido }; });
  }, [movimientosSel, cuentaSel.saldoInicial]);

  const extractoSel = extractos[cuentaSel.id];
  const cargando = cargandoId === cuentaSel.id;

  const partidasCuenta = useMemo(() => (PARTIDAS_SIN_REGISTRO[cuentaSel.cuenta] ?? []).map(p => ({ ...p, key: `${cuentaSel.id}|${p.fecha}|${p.concepto}` })), [cuentaSel]);
  const partidasPendientes = partidasCuenta.filter(p => !resueltas.has(p.key));
  // El saldo del banco sale del extracto cargado. Las partidas que tesorería ya explicó quedan
  // registradas en la plataforma; lo que sigue de diferencia son reportes que esperan aprobación.
  const saldoBanco = extractoSel ? extractoSel.lineas.reduce((s, l) => s + l.valor, cuentaSel.saldoInicial) : 0;
  const saldoMovimientos = filasMovimientos.length ? filasMovimientos[filasMovimientos.length - 1].corrido : cuentaSel.saldoInicial;
  const saldoPlataforma = saldoMovimientos + partidasCuenta.filter(p => resueltas.has(p.key)).reduce((s, p) => s + p.valor, 0);
  const cerradaCuenta = cerradas.has(cuentaSel.id);

  function cargarExtracto() {
    setCargandoId(cuentaSel.id);
    window.setTimeout(() => {
      const movs = movimientosDeCuenta(cuentaSel, clientes, traslados);
      const lineasConciliadas: LineaExtracto[] = movs.map(m => ({ fecha: m.fecha, concepto: m.concepto, valor: m.entrada - m.salida, cruce: 'conciliada' }));
      const extras: LineaExtracto[] = (PARTIDAS_SIN_REGISTRO[cuentaSel.cuenta] ?? []).map(p => ({ fecha: p.fecha, concepto: p.concepto, valor: p.valor, cruce: 'sin-registro' }));
      const reportesCuenta = reportesPendientes.filter(r => r.cuenta === cuentaSel.cuenta);
      const excluido = reportesCuenta.length > 1 ? reportesCuenta.slice(0, 1) : [];
      const incluidos = reportesCuenta.length > 1 ? reportesCuenta.slice(1) : reportesCuenta;
      const lineasReportes: LineaExtracto[] = incluidos.map(r => ({ fecha: r.fecha, concepto: `Reporte de ${r.clienteNombre} · ref. ${r.referencia}`, valor: r.valor, cruce: 'reporte-visto' }));
      const lineas = [...lineasConciliadas, ...extras, ...lineasReportes].sort((a, b) => a.fecha.localeCompare(b.fecha));
      setExtractos(prev => ({ ...prev, [cuentaSel.id]: { lineas, conciliadas: lineasConciliadas.length, sinRegistro: extras.length, reportesVistos: incluidos.length, reportesNoAparecen: excluido } }));
      if (incluidos.length > 0) onMarcarVistos(incluidos.map(r => r.id));
      setCargandoId(null);
    }, 700);
  }

  function resolverPartida(key: string, esPositivo: boolean) {
    setResueltas(prev => { const s = new Set(prev); s.add(key); return s; });
    onToast(esPositivo ? 'Enviado a pagos por identificar.' : 'Gasto bancario registrado.');
  }

  function cerrarConciliacion() {
    setCerradas(prev => { const s = new Set(prev); s.add(cuentaSel.id); return s; });
    onToast(`Conciliación de septiembre de ${cuentaSel.cuenta} cerrada por ${persona.nombre}.`);
  }

  function confirmarTraslado(d: { origenId: string; destinoId: string; valor: number; motivo: string }) {
    setTraslados(prev => [...prev, { id: `tr-${prev.length + 1}`, origenId: d.origenId, destinoId: d.destinoId, valor: d.valor, motivo: d.motivo, fecha: HOY }]);
    setModalTraslado(false);
    onToast(`Traslado registrado: ${money(d.valor)} de ${cuentaPorId(d.origenId).cuenta} a ${cuentaPorId(d.destinoId).cuenta}.`);
  }

  const motivoBloqueo = !puedeGestionar ? 'Lo hace tesorería' : partidasPendientes.length > 0 ? 'Quedan partidas pendientes por resolver' : cerradaCuenta ? 'Ya está cerrada' : undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Bancos y conciliación</h1>
      <p style={{ fontSize: 14, color: C.muted, margin: 0, maxWidth: 720 }}>
        En Colombia no hay conexión directa con los bancos: tesorería descarga el extracto y el sistema lo cruza con lo registrado.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {cuentasVisibles.map(cuenta => (
          <TarjetaCuenta key={cuenta.id} cuenta={cuenta} saldo={saldoDeCuenta(cuenta, clientes, traslados)} seleccionada={cuenta.id === cuentaSel.id} onClick={() => setCuentaSelIdState(cuenta.id)} />
        ))}
      </div>
      {cuentasVisibles.some(c => c.deTercero) && (
        <p style={{ fontSize: 12, color: C.muted, margin: 0, maxWidth: 720 }}>
          «Cuenta de tercero» significa que el banco no está a nombre de la empresa, sino de la Asociación de Vivienda Miraflor: el dinero pasa por ahí antes de llegar a la constructora.
        </p>
      )}

      <Tarjeta>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>Movimientos de septiembre · {cuentaSel.cuenta}</p>
            <p style={{ fontSize: 12, color: C.muted, margin: '4px 0 0' }}>Entradas y salidas que ya quedaron registradas en la plataforma este mes.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <BotonSecundario onClick={() => setModalTraslado(true)}><ArrowRightLeft size={15} />Trasladar entre cuentas</BotonSecundario>
            <BotonPrimario disabled={!puedeGestionar || cargando} onClick={cargarExtracto}>
              {cargando ? <Loader2 size={15} className="animate-spin" /> : null}
              {cargando ? 'Cargando extracto...' : 'Cargar extracto de septiembre'}
            </BotonPrimario>
          </div>
        </div>
        {!puedeGestionar && <p style={{ fontSize: 12, color: C.muted, margin: '0 0 12px' }}>Lo hace tesorería.</p>}
        <TablaMovimientos cuenta={cuentaSel} filas={filasMovimientos} conciliado={!!extractoSel} />
      </Tarjeta>

      {extractoSel && <PanelExtracto cuenta={cuentaSel} resultado={extractoSel} />}

      <PanelConciliacion
        cuenta={cuentaSel} extractoCargado={!!extractoSel} saldoBanco={saldoBanco} saldoPlataforma={saldoPlataforma}
        partidasPendientes={partidasPendientes} cerrada={cerradaCuenta} personaNombre={persona.nombre}
        puedeGestionar={puedeGestionar} motivoBloqueo={motivoBloqueo} onResolver={resolverPartida} onCerrar={cerrarConciliacion}
      />

      <PanelTraslados traslados={traslados} />

      {modalTraslado && <ModalTraslado onCerrar={() => setModalTraslado(false)} onConfirmar={confirmarTraslado} />}
    </div>
  );
}
