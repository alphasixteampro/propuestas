// SECCIÓN: CONTABILIDAD (PRD 12B)
// Comprobantes generados solos a partir de los pagos, libro de ingresos, balance de prueba,
// estado de resultados, plan de cuentas (PUC) y cierre del periodo. Todo es por empresa.
import React, { useMemo, useState } from 'react';
import {
  C, HOY, money, fechaLarga, vigentes, lugarPorNombre, Cliente, Pago, Persona, FiltroEmpresa, EmpresaId,
  EMPRESAS, SOCIEDADES, empresaPorId, proyectoPorId, empresaDeSede, Chip, Tarjeta, BotonPrimario, BotonSecundario,
  Modal, Campo, estiloInput, Tono,
} from './base';

// ─────────────────────────────────────────────────────────────────────────
// PLAN DE CUENTAS (PUC) — igual para las dos empresas
// ─────────────────────────────────────────────────────────────────────────

type NaturalezaCuenta = 'Débito' | 'Crédito';
type TipoCuenta = 'Activo' | 'Pasivo' | 'Patrimonio' | 'Ingreso' | 'Gasto' | 'Costo';
interface CuentaPUC { codigo: string; nombre: string; naturaleza: NaturalezaCuenta; tipo: TipoCuenta; }

const PUC: CuentaPUC[] = [
  { codigo: '110505', nombre: 'Caja general', naturaleza: 'Débito', tipo: 'Activo' },
  { codigo: '111005', nombre: 'Bancos', naturaleza: 'Débito', tipo: 'Activo' },
  { codigo: '130505', nombre: 'Clientes nacionales (cartera de ventas)', naturaleza: 'Débito', tipo: 'Activo' },
  { codigo: '130510', nombre: 'Intereses por cobrar', naturaleza: 'Débito', tipo: 'Activo' },
  { codigo: '133005', nombre: 'Anticipos a contratistas', naturaleza: 'Débito', tipo: 'Activo' },
  { codigo: '136005', nombre: 'Cuentas por cobrar a empresas del grupo', naturaleza: 'Débito', tipo: 'Activo' },
  { codigo: '136505', nombre: 'Cuentas por cobrar a trabajadores', naturaleza: 'Débito', tipo: 'Activo' },
  { codigo: '143505', nombre: 'Inmuebles para la venta', naturaleza: 'Débito', tipo: 'Activo' },
  { codigo: '143595', nombre: 'Bienes recibidos en pago', naturaleza: 'Débito', tipo: 'Activo' },
  { codigo: '220505', nombre: 'Proveedores', naturaleza: 'Crédito', tipo: 'Pasivo' },
  { codigo: '233595', nombre: 'Otras cuentas por pagar', naturaleza: 'Crédito', tipo: 'Pasivo' },
  { codigo: '250505', nombre: 'Salarios por pagar', naturaleza: 'Crédito', tipo: 'Pasivo' },
  { codigo: '280505', nombre: 'Anticipos de clientes', naturaleza: 'Crédito', tipo: 'Pasivo' },
  { codigo: '310505', nombre: 'Capital social', naturaleza: 'Crédito', tipo: 'Patrimonio' },
  { codigo: '360505', nombre: 'Utilidad del ejercicio', naturaleza: 'Crédito', tipo: 'Patrimonio' },
  { codigo: '370505', nombre: 'Utilidades acumuladas', naturaleza: 'Crédito', tipo: 'Patrimonio' },
  { codigo: '413505', nombre: 'Venta de inmuebles', naturaleza: 'Crédito', tipo: 'Ingreso' },
  { codigo: '421005', nombre: 'Intereses de financiación', naturaleza: 'Crédito', tipo: 'Ingreso' },
  { codigo: '421020', nombre: 'Intereses de mora', naturaleza: 'Crédito', tipo: 'Ingreso' },
  { codigo: '421040', nombre: 'Rendimientos financieros', naturaleza: 'Crédito', tipo: 'Ingreso' },
  { codigo: '425050', nombre: 'Otros ingresos (arriendos, reintegros)', naturaleza: 'Crédito', tipo: 'Ingreso' },
  { codigo: '510506', nombre: 'Nómina', naturaleza: 'Débito', tipo: 'Gasto' },
  { codigo: '519595', nombre: 'Gastos diversos (caja menor)', naturaleza: 'Débito', tipo: 'Gasto' },
  { codigo: '530505', nombre: 'Gastos bancarios', naturaleza: 'Débito', tipo: 'Gasto' },
  { codigo: '614005', nombre: 'Costo de obra', naturaleza: 'Débito', tipo: 'Costo' },
];

function cuentaPUC(codigo: string): CuentaPUC { return PUC.find(c => c.codigo === codigo)!; }

// ─────────────────────────────────────────────────────────────────────────
// SALDOS ANTERIORES (1-sep-2026): fijos por empresa; 370505 se calcula para que cuadre exacto
// ─────────────────────────────────────────────────────────────────────────

function saldosAnteriores(empresaId: EmpresaId): Record<string, number> {
  if (empresaId === 'mizar') {
    const base: Record<string, number> = {
      '110505': 3000000, '111005': 271300000, '130505': 1960000000, '130510': 42000000,
      '133005': 55000000, '136005': 35000000, '143505': 2400000000,
      '220505': 188000000, '233595': 64000000, '280505': 12000000, '310505': 1500000000,
    };
    const debitos = ['110505', '111005', '130505', '130510', '133005', '136005', '143505'].reduce((s, c) => s + base[c], 0);
    const creditos = ['220505', '233595', '280505', '310505'].reduce((s, c) => s + base[c], 0);
    return { ...base, '370505': debitos - creditos };
  }
  const base: Record<string, number> = {
    '110505': 800000, '111005': 41350000, '130505': 480000000, '143505': 1100000000,
    '220505': 22000000, '233595': 35000000, '310505': 800000000,
  };
  const debitos = ['110505', '111005', '130505', '143505'].reduce((s, c) => s + base[c], 0);
  const creditos = ['220505', '233595', '310505'].reduce((s, c) => s + base[c], 0);
  return { ...base, '370505': debitos - creditos };
}

const CUENTAS_POR_EMPRESA: Record<EmpresaId, string[]> = {
  mizar: ['Bancolombia Mizar'],
  cucuta: ['Cuenta Ictinos', 'Cuenta Miraflor'],
};

// ─────────────────────────────────────────────────────────────────────────
// COMPROBANTES: generados solos, sin digitación
// ─────────────────────────────────────────────────────────────────────────

interface LineaComprobante { codigo: string; nombre: string; debito: number; credito: number; }
type TipoComprobante = 'Recibo de caja' | 'Causación' | 'Egreso' | 'Nota';
type OrigenComprobante = 'Cartera' | 'Compras' | 'Bancos' | 'Sistema';
interface Comprobante { numero: string; fecha: string; tipo: TipoComprobante; tercero: string; origen: OrigenComprobante; lineas: LineaComprobante[]; empresaId?: EmpresaId; }

const TIPO_TONO: Record<TipoComprobante, Tono> = { 'Recibo de caja': 'blue', Causación: 'purple', Egreso: 'red', Nota: 'green' };

function linea(codigo: string, debito: number, credito: number): LineaComprobante {
  return { codigo, nombre: cuentaPUC(codigo).nombre, debito, credito };
}

// La cuenta débito del recibo depende de dónde entró la plata y con qué medio se pagó: caja si fue
// efectivo, cuenta por cobrar a un trabajador si quedó en una cuenta personal, bienes recibidos en
// pago o salarios por pagar según el medio, cruce de cartera contra proveedores, o bancos en el resto.
function cuentaDebitoDePago(p: Pago): string {
  const lugar = lugarPorNombre(p.cuenta);
  if (lugar?.tipo === 'efectivo') return '110505';
  if (lugar?.tipo === 'personal') return '136505';
  if (p.medio === 'Pago en especie') return '143595';
  if (p.medio === 'Descuento de nómina') return '250505';
  if (p.medio === 'Cruce de cartera') return '220505';
  return '111005';
}

function comprobantesDePagos(clientes: Cliente[]): Comprobante[] {
  const comprobantes: Comprobante[] = [];
  for (const c of clientes) {
    for (const p of vigentes(c.pagos)) {
      if (p.administracionAnterior || !p.fecha.startsWith('2026-09')) continue;
      const cuentaDebito = cuentaDebitoDePago(p);
      const capital = p.aplicaciones.reduce((s, a) => s + a.capital, 0);
      const interes = p.aplicaciones.reduce((s, a) => s + a.interes, 0);
      const mora = p.aplicaciones.reduce((s, a) => s + a.mora, 0);
      const lineas: LineaComprobante[] = [linea(cuentaDebito, p.valor, 0)];
      if (capital > 0) lineas.push(linea('130505', 0, capital));
      if (interes > 0) lineas.push(linea('421005', 0, interes));
      if (mora > 0) lineas.push(linea('421020', 0, mora));
      if (p.abono) lineas.push(linea('130505', 0, p.abono.monto));
      if (p.saldoFavor) lineas.push(linea('280505', 0, p.saldoFavor));
      comprobantes.push({ numero: p.recibo, fecha: p.fecha, tipo: 'Recibo de caja', tercero: c.raw.nombre, origen: 'Cartera', lineas });

      // Si el pago se consignó, el dinero pasa de caja o de la cuenta del trabajador a bancos.
      if (p.trasladado && p.trasladado.fecha.startsWith('2026-09')) {
        comprobantes.push({
          numero: `CT-${p.recibo}`, fecha: p.trasladado.fecha, tipo: 'Nota', tercero: c.raw.nombre, origen: 'Bancos',
          lineas: [linea('111005', p.valor, 0), linea(cuentaDebito, 0, p.valor)],
        });
      }
    }
  }
  return comprobantes.sort((a, b) => a.fecha.localeCompare(b.fecha));
}

function comprobantesFijos(empresaId: EmpresaId): Comprobante[] {
  if (empresaId === 'mizar') {
    return [
      { numero: 'CI-2026-09', fecha: '2026-09-23', tipo: 'Causación', tercero: '—', origen: 'Sistema', lineas: [linea('130510', 8420000, 0), linea('421005', 0, 8420000)] },
      { numero: 'CE-2026-09-01', fecha: '2026-09-04', tipo: 'Egreso', tercero: 'Ferretería Santander', origen: 'Compras', lineas: [linea('614005', 12480000, 0), linea('111005', 0, 12480000)] },
      { numero: 'CE-2026-09-02', fecha: '2026-09-10', tipo: 'Egreso', tercero: 'Nómina administrativa', origen: 'Bancos', lineas: [linea('510506', 11500000, 0), linea('111005', 0, 11500000)] },
      { numero: 'CE-2026-09-03', fecha: '2026-09-18', tipo: 'Egreso', tercero: 'Concretos del Oriente', origen: 'Compras', lineas: [linea('614005', 38750000, 0), linea('111005', 0, 38750000)] },
      { numero: 'NC-2026-09-01', fecha: '2026-09-22', tipo: 'Nota', tercero: '—', origen: 'Bancos', lineas: [linea('111005', 184300, 0), linea('421040', 0, 184300)] },
    ];
  }
  return [
    { numero: 'CE-2026-09-01', fecha: '2026-09-08', tipo: 'Egreso', tercero: 'Mantenimiento de lotes', origen: 'Compras', lineas: [linea('614005', 1000000, 0), linea('111005', 0, 1000000)] },
    { numero: 'CE-2026-09-02', fecha: '2026-09-15', tipo: 'Egreso', tercero: 'Combustible y parqueadero', origen: 'Bancos', lineas: [linea('519595', 154006, 0), linea('111005', 0, 154006)] },
  ];
}

const celda: React.CSSProperties = { padding: '8px 6px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' };
function totalDebito(c: Comprobante): number { return c.lineas.reduce((s, l) => s + l.debito, 0); }
function totalCredito(c: Comprobante): number { return c.lineas.reduce((s, l) => s + l.credito, 0); }
function cuadrado(c: Comprobante): boolean { return totalDebito(c) === totalCredito(c); }

// ─────────────────────────────────────────────────────────────────────────
// LIBRO DE INGRESOS
// ─────────────────────────────────────────────────────────────────────────

type TipoIngresoExtra = 'contado' | 'arriendo' | 'aporte' | 'prestamo' | 'reintegro' | 'rendimiento';
interface IngresoExtra { empresaId: EmpresaId; tipo: TipoIngresoExtra; valor: number; cuenta: string; tercero: string; fecha: string; }

const TIPO_INGRESO_LABEL: Record<TipoIngresoExtra, string> = {
  contado: 'Venta de contado', arriendo: 'Arriendo', aporte: 'Aporte de socio',
  prestamo: 'Préstamo de socio', reintegro: 'Reintegro', rendimiento: 'Rendimiento financiero',
};

function cuentaCreditoDeIngreso(tipo: TipoIngresoExtra): string {
  if (tipo === 'contado') return '413505';
  if (tipo === 'prestamo') return '233595';
  if (tipo === 'aporte') return '310505';
  return '425050';
}

// ─────────────────────────────────────────────────────────────────────────
// COMPONENTES AUXILIARES
// ─────────────────────────────────────────────────────────────────────────

function botonTab(id: string, activa: string, texto: string, onClick: (id: string) => void) {
  return (
    <button key={id} type="button" onClick={() => onClick(id)} style={{
      padding: '8px 16px', borderRadius: 8, border: `1px solid ${activa === id ? C.navy : C.lineStrong}`,
      background: activa === id ? C.navy : C.paper, color: activa === id ? '#fff' : C.ink,
      fontWeight: 600, fontSize: 13, cursor: 'pointer', minHeight: 40, fontFamily: 'inherit',
    }}>{texto}</button>
  );
}

function ModalIngreso({ cuentas, onCerrar, onGuardar }: { cuentas: string[]; onCerrar: () => void; onGuardar: (d: { tipo: TipoIngresoExtra; valor: number; cuenta: string; tercero: string }) => void }) {
  const [tipo, setTipo] = useState<TipoIngresoExtra>('contado');
  const [valor, setValor] = useState(0);
  const [cuenta, setCuenta] = useState(cuentas[0] ?? '');
  const [tercero, setTercero] = useState('');
  const [adjunto, setAdjunto] = useState(false);
  const puedeGuardar = valor > 0 && tercero.trim().length > 0 && cuenta !== '';

  return (
    <Modal titulo="Registrar otro ingreso" subtitulo="Ingresos que no vienen de una cuota de cartera" onCerrar={onCerrar}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Campo id="ingreso-tipo" label="Tipo de ingreso">
          <select id="ingreso-tipo" value={tipo} onChange={e => setTipo(e.target.value as TipoIngresoExtra)} style={estiloInput}>
            {(Object.keys(TIPO_INGRESO_LABEL) as TipoIngresoExtra[]).map(t => <option key={t} value={t}>{TIPO_INGRESO_LABEL[t]}</option>)}
          </select>
        </Campo>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <Campo id="ingreso-valor" label="Valor">
            <input id="ingreso-valor" type="number" min={0} step={1000} value={valor || ''} onChange={e => setValor(Number(e.target.value) || 0)} style={estiloInput} />
          </Campo>
          <Campo id="ingreso-cuenta" label="Cuenta bancaria">
            <select id="ingreso-cuenta" value={cuenta} onChange={e => setCuenta(e.target.value)} style={estiloInput}>
              {cuentas.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Campo>
        </div>
        <Campo id="ingreso-tercero" label="Tercero">
          <input id="ingreso-tercero" value={tercero} onChange={e => setTercero(e.target.value)} placeholder="Nombre de quien paga" style={estiloInput} />
        </Campo>
        <Campo id="ingreso-fecha" label="Fecha">
          <input id="ingreso-fecha" value={fechaLarga(HOY)} disabled style={{ ...estiloInput, background: C.surface, color: C.muted }} />
        </Campo>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.ink, cursor: 'pointer' }}>
          <input type="checkbox" checked={adjunto} onChange={e => setAdjunto(e.target.checked)} />
          Adjuntar soporte (simulado)
        </label>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <BotonSecundario onClick={onCerrar}>Cancelar</BotonSecundario>
          <BotonPrimario disabled={!puedeGuardar} onClick={() => onGuardar({ tipo, valor, cuenta, tercero: tercero.trim() })}>Guardar ingreso</BotonPrimario>
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────

type Tab = 'comprobantes' | 'ingresos' | 'balance' | 'resultados' | 'puc';

export function SeccionContabilidad(props: { clientes: Cliente[]; empresa: FiltroEmpresa; persona: Persona; onToast: (m: string) => void }) {
  const { clientes, empresa, persona, onToast } = props;
  const puedeCerrar = persona.rol === 'gerencia' || persona.rol === 'contabilidad';

  const [empresaActivaId, setEmpresaActivaId] = useState<EmpresaId>('mizar');
  const empresaId: EmpresaId = empresa === 'grupo' ? empresaActivaId : empresa;
  const empresaObj = empresaPorId(empresaId);

  const [tab, setTab] = useState<Tab>('comprobantes');
  const [ingresosExtra, setIngresosExtra] = useState<IngresoExtra[]>([]);
  const [comprobantesExtra, setComprobantesExtra] = useState<Comprobante[]>([]);
  const [cerradas, setCerradas] = useState<Set<EmpresaId>>(new Set());
  const [modalIngreso, setModalIngreso] = useState(false);
  const [filaAbierta, setFilaAbierta] = useState<string | null>(null);

  const cerrada = cerradas.has(empresaId);
  const ingresosEmpresa = ingresosExtra.filter(i => i.empresaId === empresaId);

  const clientesEmpresa = useMemo(
    () => clientes.filter(c => empresaDeSede(proyectoPorId(c.raw.proyectoId).sede).id === empresaId),
    [clientes, empresaId],
  );

  const comprobantes = useMemo(() => {
    const generados = [...comprobantesDePagos(clientesEmpresa), ...comprobantesFijos(empresaId), ...comprobantesExtra.filter(c => c.empresaId === empresaId)];
    return generados.sort((a, b) => a.fecha.localeCompare(b.fecha));
  }, [clientesEmpresa, empresaId, comprobantesExtra]);

  const movimientosPorCuenta = useMemo(() => {
    const mapa: Record<string, { debito: number; credito: number }> = {};
    for (const c of comprobantes) {
      for (const l of c.lineas) {
        if (!mapa[l.codigo]) mapa[l.codigo] = { debito: 0, credito: 0 };
        mapa[l.codigo].debito += l.debito;
        mapa[l.codigo].credito += l.credito;
      }
    }
    return mapa;
  }, [comprobantes]);

  const saldos = useMemo(() => saldosAnteriores(empresaId), [empresaId]);

  const filasBalance = useMemo(() => {
    const codigos = new Set([...Object.keys(saldos), ...Object.keys(movimientosPorCuenta)]);
    return [...codigos].sort().map(codigo => {
      const cuenta = cuentaPUC(codigo);
      const anterior = saldos[codigo] ?? 0;
      const mov = movimientosPorCuenta[codigo] ?? { debito: 0, credito: 0 };
      const final = cuenta.naturaleza === 'Débito' ? anterior + mov.debito - mov.credito : anterior + mov.credito - mov.debito;
      return { cuenta, anterior, debitos: mov.debito, creditos: mov.credito, final };
    });
  }, [saldos, movimientosPorCuenta]);

  const totalDebitosMes = filasBalance.reduce((s, f) => s + f.debitos, 0);
  const totalCreditosMes = filasBalance.reduce((s, f) => s + f.creditos, 0);
  const totalFinalDebito = filasBalance.filter(f => f.cuenta.naturaleza === 'Débito').reduce((s, f) => s + f.final, 0);
  const totalFinalCredito = filasBalance.filter(f => f.cuenta.naturaleza === 'Crédito').reduce((s, f) => s + f.final, 0);
  const cuadra = totalDebitosMes === totalCreditosMes && totalFinalDebito === totalFinalCredito;

  const codigosIngreso = ['421005', '421020', '421040', '425050', '413505'];
  const codigosGasto = ['614005', '510506', '519595', '530505'];
  const totalIngresos = codigosIngreso.reduce((s, c) => s + (movimientosPorCuenta[c]?.credito ?? 0), 0);
  const totalGastos = codigosGasto.reduce((s, c) => s + (movimientosPorCuenta[c]?.debito ?? 0), 0);
  const utilidadMes = totalIngresos - totalGastos;

  const cuotasYSeparaciones = clientesEmpresa.reduce((s, c) => s + vigentes(c.pagos).filter(p => !p.administracionAnterior && p.fecha.startsWith('2026-09')).reduce((t, p) => t + p.aplicaciones.reduce((x, a) => x + a.capital, 0), 0), 0);
  const interesesFinanciacion = clientesEmpresa.reduce((s, c) => s + vigentes(c.pagos).filter(p => !p.administracionAnterior && p.fecha.startsWith('2026-09')).reduce((t, p) => t + p.aplicaciones.reduce((x, a) => x + a.interes, 0), 0), 0);
  const interesesMora = clientesEmpresa.reduce((s, c) => s + vigentes(c.pagos).filter(p => !p.administracionAnterior && p.fecha.startsWith('2026-09')).reduce((t, p) => t + p.aplicaciones.reduce((x, a) => x + a.mora, 0), 0), 0);
  const abonosACapital = clientesEmpresa.reduce((s, c) => s + vigentes(c.pagos).filter(p => !p.administracionAnterior && p.fecha.startsWith('2026-09') && p.abono).reduce((t, p) => t + (p.abono?.monto ?? 0), 0), 0);
  const ingresoDe = (tipo: TipoIngresoExtra) => ingresosEmpresa.filter(i => i.tipo === tipo).reduce((s, i) => s + i.valor, 0);
  const rendimientosBase = empresaId === 'mizar' ? 184300 : 0;

  const filasLibro = [
    { titulo: 'Cuotas y separaciones', valor: cuotasYSeparaciones },
    { titulo: 'Intereses de financiación', valor: interesesFinanciacion },
    { titulo: 'Intereses de mora', valor: interesesMora },
    { titulo: 'Abonos a capital', valor: abonosACapital },
    { titulo: 'Ventas de contado', valor: ingresoDe('contado') },
    { titulo: 'Arriendos y otros cobros', valor: ingresoDe('arriendo') },
    { titulo: 'Aportes y préstamos de socios', valor: ingresoDe('aporte') + ingresoDe('prestamo') },
    { titulo: 'Reintegros y rendimientos', valor: rendimientosBase + ingresoDe('reintegro') + ingresoDe('rendimiento') },
  ];
  const totalLibro = filasLibro.reduce((s, f) => s + f.valor, 0);

  function siguienteNumeroNC(): string {
    const fijos = empresaId === 'mizar' ? 1 : 0;
    const previos = comprobantesExtra.filter(c => c.empresaId === empresaId && c.numero.startsWith('NC-')).length;
    return `NC-2026-09-${String(fijos + previos + 1).padStart(2, '0')}`;
  }

  function registrarIngreso(d: { tipo: TipoIngresoExtra; valor: number; cuenta: string; tercero: string }) {
    setIngresosExtra(prev => [...prev, { empresaId, tipo: d.tipo, valor: d.valor, cuenta: d.cuenta, tercero: d.tercero, fecha: HOY }]);
    const numero = siguienteNumeroNC();
    const credito = cuentaCreditoDeIngreso(d.tipo);
    setComprobantesExtra(prev => [...prev, { numero, fecha: HOY, tipo: 'Nota', tercero: d.tercero, origen: 'Cartera', empresaId, lineas: [linea('111005', d.valor, 0), linea(credito, 0, d.valor)] }]);
    setModalIngreso(false);
    onToast(`Ingreso registrado y comprobante ${numero} generado.`);
  }

  function cerrarPeriodo() {
    setCerradas(prev => { const s = new Set(prev); s.add(empresaId); return s; });
    onToast(`Septiembre quedó cerrado para ${empresaObj.corto}.`);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Contabilidad</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {cerrada ? <Chip tono="red" texto="Septiembre cerrado: no admite movimientos" /> : <Chip tono="amber" texto="Septiembre abierto" />}
          {!cerrada && (
            <BotonPrimario disabled={!puedeCerrar} onClick={cerrarPeriodo}>Cerrar septiembre</BotonPrimario>
          )}
          <BotonSecundario onClick={() => onToast('En la plataforma real se descarga el archivo de comprobantes en el formato de Helisa.')}>Exportar a Helisa</BotonSecundario>
        </div>
      </div>
      {!cerrada && !puedeCerrar && <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Lo cierra contabilidad.</p>}

      {empresa === 'grupo' && (
        <>
          <div style={{ display: 'flex', gap: 8 }}>
            {EMPRESAS.map(e => botonTab(e.id, empresaActivaId, e.corto, id => setEmpresaActivaId(id as EmpresaId)))}
          </div>
          <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Los estados financieros son de cada empresa; el grupo solo ve informes combinados.</p>
        </>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {botonTab('comprobantes', tab, 'Comprobantes', id => setTab(id as Tab))}
        {botonTab('ingresos', tab, 'Libro de ingresos', id => setTab(id as Tab))}
        {botonTab('balance', tab, 'Balance de prueba', id => setTab(id as Tab))}
        {botonTab('resultados', tab, 'Estado de resultados', id => setTab(id as Tab))}
        {botonTab('puc', tab, 'Plan de cuentas', id => setTab(id as Tab))}
      </div>

      {tab === 'comprobantes' && (
        <Tarjeta>
          <p style={{ fontSize: 13, color: C.muted, margin: '0 0 6px' }}>Cada pago, orden de compra o traslado genera su comprobante con las reglas que valida el contador. Nadie los digita.</p>
          <p style={{ fontSize: 13, color: C.muted, margin: '0 0 8px' }}>
            Cada proyecto pertenece a una sociedad; aquí se ve la operación completa. En producción, cada sociedad lleva su propia contabilidad (pregunta P34).
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {SOCIEDADES.filter(s => s.empresaId === empresaId).map(s => <Chip key={s.nombre} tono="navy" texto={s.nombre} />)}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 760 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                  <th style={celda}>Número</th><th style={celda}>Fecha</th><th style={celda}>Tipo</th><th style={celda}>Tercero</th>
                  <th style={celda}>Origen</th><th style={celda}>Valor</th><th style={celda} />
                </tr>
              </thead>
              <tbody>
                {comprobantes.map(c => (
                  <React.Fragment key={c.numero}>
                    <tr style={{ borderBottom: `1px solid ${C.line}`, cursor: 'pointer' }} onClick={() => setFilaAbierta(v => v === c.numero ? null : c.numero)}>
                      <td style={{ ...celda, fontWeight: 700 }}>{c.numero}</td>
                      <td style={celda}>{fechaLarga(c.fecha)}</td>
                      <td style={celda}><Chip tono={TIPO_TONO[c.tipo]} texto={c.tipo} /></td>
                      <td style={{ ...celda, whiteSpace: 'normal' }}>{c.tercero}</td>
                      <td style={celda}>{c.origen}</td>
                      <td style={{ ...celda, fontWeight: 600 }}>{money(totalDebito(c))}</td>
                      <td style={celda}>{cuadrado(c) ? <Chip tono="green" texto="Cuadrado" /> : <Chip tono="red" texto="No cuadra" />}</td>
                    </tr>
                    {filaAbierta === c.numero && (
                      <tr>
                        <td colSpan={7} style={{ padding: '4px 6px 14px', background: C.surface }}>
                          <p style={{ fontSize: 12, color: C.muted, margin: '4px 0 8px' }}>Asiento contable (las cuentas que mueve este comprobante):</p>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 480 }}>
                            <thead>
                              <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.lineStrong}` }}>
                                <th style={celda}>Cuenta</th><th style={celda}>Nombre</th><th style={celda}>Débito</th><th style={celda}>Crédito</th>
                              </tr>
                            </thead>
                            <tbody>
                              {c.lineas.map((l, i) => (
                                <tr key={i}><td style={celda}>{l.codigo}</td><td style={{ ...celda, whiteSpace: 'normal' }}>{l.nombre}</td>
                                  <td style={celda}>{l.debito > 0 ? money(l.debito) : '—'}</td><td style={celda}>{l.credito > 0 ? money(l.credito) : '—'}</td></tr>
                              ))}
                              <tr style={{ borderTop: `1px solid ${C.lineStrong}`, fontWeight: 700 }}>
                                <td style={celda} colSpan={2}>Total</td><td style={celda}>{money(totalDebito(c))}</td><td style={celda}>{money(totalCredito(c))}</td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {comprobantes.length === 0 && <tr><td colSpan={7} style={{ ...celda, color: C.muted, whiteSpace: 'normal' }}>Sin comprobantes este mes.</td></tr>}
              </tbody>
            </table>
          </div>
        </Tarjeta>
      )}

      {tab === 'ingresos' && (
        <Tarjeta>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>Libro de ingresos de septiembre</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
              <BotonPrimario disabled={cerrada} onClick={() => setModalIngreso(true)}>Registrar otro ingreso</BotonPrimario>
              {cerrada && <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Septiembre está cerrado.</p>}
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 420 }}>
              <thead><tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}><th style={celda}>Tipo de ingreso</th><th style={celda}>Total de septiembre</th></tr></thead>
              <tbody>
                {filasLibro.map(f => (
                  <tr key={f.titulo} style={{ borderBottom: `1px solid ${C.line}` }}><td style={{ ...celda, whiteSpace: 'normal' }}>{f.titulo}</td><td style={celda}>{money(f.valor)}</td></tr>
                ))}
                <tr style={{ fontWeight: 700 }}><td style={celda}>Total</td><td style={celda}>{money(totalLibro)}</td></tr>
              </tbody>
            </table>
          </div>
        </Tarjeta>
      )}

      {tab === 'balance' && (
        <Tarjeta>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>Balance de prueba · septiembre 2026</p>
            {cuadra ? <Chip tono="green" texto="Cuadra: débitos = créditos" /> : <Chip tono="red" texto="No cuadra: revisar" />}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 760 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                  <th style={celda}>Cuenta</th><th style={celda}>Nombre</th><th style={celda}>Saldo anterior</th>
                  <th style={celda}>Débitos</th><th style={celda}>Créditos</th><th style={celda}>Saldo final</th>
                </tr>
              </thead>
              <tbody>
                {filasBalance.map(f => (
                  <tr key={f.cuenta.codigo} style={{ borderBottom: `1px solid ${C.line}` }}>
                    <td style={celda}>{f.cuenta.codigo}</td>
                    <td style={{ ...celda, whiteSpace: 'normal' }}>{f.cuenta.nombre}</td>
                    <td style={celda}>{money(f.anterior)} {f.cuenta.naturaleza === 'Débito' ? 'D' : 'C'}</td>
                    <td style={celda}>{f.debitos > 0 ? money(f.debitos) : '—'}</td>
                    <td style={celda}>{f.creditos > 0 ? money(f.creditos) : '—'}</td>
                    <td style={{ ...celda, fontWeight: 600 }}>{money(f.final)} {f.cuenta.naturaleza === 'Débito' ? 'D' : 'C'}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: 700 }}>
                  <td style={celda} colSpan={2}>Total del mes</td><td style={celda}>—</td>
                  <td style={celda}>{money(totalDebitosMes)}</td><td style={celda}>{money(totalCreditosMes)}</td><td style={celda}>—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Tarjeta>
      )}

      {tab === 'resultados' && (
        <Tarjeta>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: '0 0 14px' }}>Estado de resultados · septiembre 2026</p>
          <div style={{ overflowX: 'auto', marginBottom: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 420 }}>
              <tbody>
                <tr><td style={{ ...celda, fontWeight: 700 }} colSpan={2}>Ingresos</td></tr>
                {codigosIngreso.map(cod => (
                  <tr key={cod}><td style={{ ...celda, paddingLeft: 20, whiteSpace: 'normal' }}>{cuentaPUC(cod).nombre}</td><td style={celda}>{money(movimientosPorCuenta[cod]?.credito ?? 0)}</td></tr>
                ))}
                <tr style={{ borderTop: `1px solid ${C.line}`, fontWeight: 700 }}><td style={celda}>Total ingresos</td><td style={celda}>{money(totalIngresos)}</td></tr>
                <tr><td style={{ ...celda, fontWeight: 700, paddingTop: 14 }} colSpan={2}>Costos y gastos</td></tr>
                {codigosGasto.map(cod => (
                  <tr key={cod}><td style={{ ...celda, paddingLeft: 20, whiteSpace: 'normal' }}>{cuentaPUC(cod).nombre}</td><td style={celda}>{money(movimientosPorCuenta[cod]?.debito ?? 0)}</td></tr>
                ))}
                <tr style={{ borderTop: `1px solid ${C.line}`, fontWeight: 700 }}><td style={celda}>Total costos y gastos</td><td style={celda}>{money(totalGastos)}</td></tr>
                <tr style={{ borderTop: `2px solid ${C.lineStrong}`, fontWeight: 700 }}>
                  <td style={celda}>Utilidad del mes</td><td style={{ ...celda, color: utilidadMes >= 0 ? C.green : C.red }}>{money(utilidadMes)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>La venta de inmuebles se reconoce como ingreso al escriturar, según defina el contador.</p>
        </Tarjeta>
      )}

      {tab === 'puc' && (
        <Tarjeta>
          <p style={{ fontSize: 13, color: C.muted, margin: '0 0 14px' }}>Plan de cuentas (PUC): las mismas cuentas para las dos empresas.</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 560 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                  <th style={celda}>Código</th><th style={celda}>Nombre</th><th style={celda}>Naturaleza</th><th style={celda}>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {PUC.map(c => (
                  <tr key={c.codigo} style={{ borderBottom: `1px solid ${C.line}` }}>
                    <td style={celda}>{c.codigo}</td><td style={{ ...celda, whiteSpace: 'normal' }}>{c.nombre}</td>
                    <td style={celda}>{c.naturaleza}</td><td style={celda}>{c.tipo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tarjeta>
      )}

      {modalIngreso && <ModalIngreso cuentas={CUENTAS_POR_EMPRESA[empresaId]} onCerrar={() => setModalIngreso(false)} onGuardar={registrarIngreso} />}
    </div>
  );
}
