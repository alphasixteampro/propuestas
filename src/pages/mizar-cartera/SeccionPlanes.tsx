// Sección «Planes de pago»: plantillas por proyecto y simulador comercial con amortización
// francesa para el saldo financiado (PRD 12D).
import React, { useEffect, useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import {
  HOY, C, money, fechaLarga, diffDays, sumarMeses, Persona, Seccion, FiltroEmpresa,
  proyectoPorId, enFiltroEmpresa, Chip, Tarjeta, BotonPrimario, BotonSecundario, Campo, estiloInput, EstadisticaMini,
} from './base';

const celda: React.CSSProperties = { padding: '8px 6px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' };
const PRIMA_VALOR = 2000000;

// ─────────────────────────────────────────────────────────────────────────
// PLANTILLAS POR PROYECTO
// ─────────────────────────────────────────────────────────────────────────

interface PlantillaApto {
  tipo: 'apartamento'; proyectoId: string; nombre: string; separacion: number;
  inicialPct: number; inicialCuotasDefault: number; primasDefault: boolean;
  saldoPct: number; saldoModo: 'credito' | 'cuotas'; mesesEntrega?: number; conceptoSaldo?: string;
  saldoCuotasDefault?: number; tasaMensualDefault?: number;
}
interface PlantillaLote {
  tipo: 'lote-fijo'; proyectoId: string; nombre: string; separacion: number;
  gruposCuotas: { cantidad: number; valor: number }[]; totalCuotas: number; valorFijo: number;
}
type Plantilla = PlantillaApto | PlantillaLote;

const PLANTILLAS: Plantilla[] = [
  {
    tipo: 'apartamento', proyectoId: 'villa-plaza', nombre: 'Apartamento sobre planos', separacion: 3000000,
    inicialPct: 30, inicialCuotasDefault: 12, primasDefault: true,
    saldoPct: 70, saldoModo: 'credito', mesesEntrega: 24, conceptoSaldo: 'Saldo con crédito hipotecario',
  },
  {
    tipo: 'apartamento', proyectoId: 'laureles', nombre: 'Apartamento sobre planos, entrega 2028', separacion: 5000000,
    inicialPct: 30, inicialCuotasDefault: 18, primasDefault: false,
    saldoPct: 70, saldoModo: 'credito', mesesEntrega: 26, conceptoSaldo: 'Saldo con crédito hipotecario o subsidio',
  },
  {
    tipo: 'apartamento', proyectoId: 'montana', nombre: 'Apartamento terminado', separacion: 5000000,
    inicialPct: 30, inicialCuotasDefault: 6, primasDefault: false,
    saldoPct: 70, saldoModo: 'cuotas', saldoCuotasDefault: 48, tasaMensualDefault: 1,
  },
  {
    tipo: 'apartamento', proyectoId: 'cantalta', nombre: 'Lote campestre', separacion: 2000000,
    inicialPct: 30, inicialCuotasDefault: 6, primasDefault: false,
    saldoPct: 70, saldoModo: 'cuotas', saldoCuotasDefault: 36, tasaMensualDefault: 1,
  },
  {
    tipo: 'lote-fijo', proyectoId: 'miraflor', nombre: 'Lote urbano Mi Lote (40 meses)', separacion: 1000000,
    gruposCuotas: [{ cantidad: 39, valor: 500000 }, { cantidad: 1, valor: 200000 }], totalCuotas: 40, valorFijo: 20700000,
  },
  {
    tipo: 'lote-fijo', proyectoId: 'miravista', nombre: 'Lote urbano Mi Lote (43 meses)', separacion: 500000,
    gruposCuotas: [{ cantidad: 43, valor: 500000 }], totalCuotas: 43, valorFijo: 22000000,
  },
];

// ─────────────────────────────────────────────────────────────────────────
// LISTA DE PRECIOS DE LOTES (CÚCUTA) — tomada del formato de precios real
// ─────────────────────────────────────────────────────────────────────────

type TipoLoteCucuta = 'Medianero' | 'Esquinero' | 'Comercial';
const TARIFA_M2_COMERCIAL_MIRAFLOR = 342857;
const EXTRA_URBANISMO_COMERCIAL_MIRAFLOR = 26000000;

interface FilaPrecioLote { proyectoId: string; proyectoNombre: string; tipo: TipoLoteCucuta; area: string; sinUrbanismo: string; conUrbanismo: string; }

const PRECIOS_LOTES_CUCUTA: FilaPrecioLote[] = [
  { proyectoId: 'miraflor', proyectoNombre: 'Miraflor', tipo: 'Medianero', area: '70 m²', sinUrbanismo: money(18000000), conUrbanismo: money(44000000) },
  { proyectoId: 'miraflor', proyectoNombre: 'Miraflor', tipo: 'Esquinero', area: '70 m²', sinUrbanismo: money(20000000), conUrbanismo: money(46000000) },
  {
    proyectoId: 'miraflor', proyectoNombre: 'Miraflor', tipo: 'Comercial', area: 'Desde 70 m²',
    sinUrbanismo: `${money(TARIFA_M2_COMERCIAL_MIRAFLOR)} por m² (${money(24000000)} a 70 m²)`,
    conUrbanismo: `+ ${money(EXTRA_URBANISMO_COMERCIAL_MIRAFLOR)} (${money(50000000)} a 70 m²)`,
  },
  { proyectoId: 'miravista', proyectoNombre: 'Miravista', tipo: 'Medianero', area: '70 m²', sinUrbanismo: money(30000000), conUrbanismo: '—' },
  { proyectoId: 'miravista', proyectoNombre: 'Miravista', tipo: 'Esquinero', area: '70 m²', sinUrbanismo: money(35000000), conUrbanismo: '—' },
];

// El valor de lista de un lote de Cúcuta, según el tipo, el área (solo importa en Comercial) y si
// incluye urbanismo. Viene del formato de precios de Cúcuta; solo gerencia lo actualiza.
function precioListaLote(proyectoId: string, tipo: TipoLoteCucuta, area: number, conUrbanismo: boolean): number {
  if (proyectoId === 'miraflor') {
    if (tipo === 'Medianero') return conUrbanismo ? 44000000 : 18000000;
    if (tipo === 'Esquinero') return conUrbanismo ? 46000000 : 20000000;
    const sinUrbanismo = Math.round(area * TARIFA_M2_COMERCIAL_MIRAFLOR);
    return conUrbanismo ? sinUrbanismo + EXTRA_URBANISMO_COMERCIAL_MIRAFLOR : sinUrbanismo;
  }
  return tipo === 'Esquinero' ? 35000000 : 30000000;
}

function TarjetaListaPreciosLotes() {
  return (
    <Tarjeta>
      <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}>Lista de precios de lotes (Cúcuta)</p>
      <p style={{ fontSize: 13, color: C.muted, margin: '0 0 12px' }}>Valores tomados del formato de precios de Cúcuta.</p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 640 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
              <th style={celda}>Proyecto</th><th style={celda}>Tipo de lote</th><th style={celda}>Área</th>
              <th style={celda}>Sin urbanismo (plazo hasta 48 meses)</th><th style={celda}>Con urbanismo (plazo hasta 72 meses)</th>
            </tr>
          </thead>
          <tbody>
            {PRECIOS_LOTES_CUCUTA.map((f, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.line}` }}>
                <td style={{ ...celda, fontWeight: 600 }}>{f.proyectoNombre}</td>
                <td style={celda}>{f.tipo}</td>
                <td style={celda}>{f.area}</td>
                <td style={{ ...celda, whiteSpace: 'normal' }}>{f.sinUrbanismo}</td>
                <td style={{ ...celda, whiteSpace: 'normal' }}>{f.conUrbanismo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: C.muted, margin: '10px 0 0' }}>
        Valores tomados del formato de precios de Cúcuta; la lista la actualiza gerencia y un bono de descuento lo autoriza gerencia o el responsable de sede.
      </p>
    </Tarjeta>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// TASA: CONVERSIÓN MENSUAL ↔ EA
// ─────────────────────────────────────────────────────────────────────────

function eaDesdeMensual(m: number): number { return (Math.pow(1 + m / 100, 12) - 1) * 100; }
function mensualDesdeEA(ea: number): number { return (Math.pow(1 + ea / 100, 1 / 12) - 1) * 100; }

// ─────────────────────────────────────────────────────────────────────────
// GENERADOR DEL PLAN
// ─────────────────────────────────────────────────────────────────────────

interface FilaPlan { numero: number; fecha: string; concepto: string; capital: number; interes: number; }

function generarPlanApartamento(
  p: PlantillaApto, valor: number, fechaFirma: string, dia: number,
  pctInicial: number, nCuotasInicial: number, conPrimas: boolean, nCuotasSaldo: number, tasaMensualPct: number,
): { filas: FilaPlan[]; cuotaTipica: number } {
  const filas: FilaPlan[] = [];
  let numero = 1;
  filas.push({ numero: numero++, fecha: fechaFirma, concepto: 'Separación', capital: p.separacion, interes: 0 });

  // La cuota inicial (el % elegido) incluye la separación y las primas que caigan en su periodo;
  // lo que resta se reparte en las cuotas de la inicial. El saldo es el resto del valor.
  const montoInicialTotal = Math.round(valor * pctInicial / 100);
  const nInicial = Math.max(1, nCuotasInicial);
  const fechasInicial = Array.from({ length: nInicial }, (_, k) => sumarMeses(fechaFirma, k + 1, dia));
  const nPrimas = conPrimas ? fechasInicial.filter(f => ['06', '12'].includes(f.slice(5, 7))).length : 0;
  const montoCuotasIniciales = Math.max(0, montoInicialTotal - p.separacion - nPrimas * PRIMA_VALOR);
  const cuotaInicialBase = Math.round(montoCuotasIniciales / nInicial);
  let cuotaTipica = cuotaInicialBase;

  fechasInicial.forEach((fecha, idx) => {
    const k = idx + 1;
    const capital = k === nInicial ? montoCuotasIniciales - cuotaInicialBase * (nInicial - 1) : cuotaInicialBase;
    filas.push({ numero: numero++, fecha, concepto: `Inicial ${k}/${nInicial}`, capital, interes: 0 });
    const mes = Number(fecha.slice(5, 7));
    if (conPrimas && mes === 6) filas.push({ numero: numero++, fecha, concepto: 'Prima de junio', capital: PRIMA_VALOR, interes: 0 });
    if (conPrimas && mes === 12) filas.push({ numero: numero++, fecha, concepto: 'Prima de diciembre', capital: PRIMA_VALOR, interes: 0 });
  });

  const montoSaldo = valor - montoInicialTotal;
  if (p.saldoModo === 'credito') {
    const fecha = sumarMeses(fechaFirma, p.mesesEntrega ?? 24, dia);
    filas.push({ numero: numero++, fecha, concepto: p.conceptoSaldo ?? 'Saldo con crédito hipotecario', capital: montoSaldo, interes: 0 });
  } else {
    const n = Math.max(1, nCuotasSaldo);
    const i = tasaMensualPct / 100;
    // Sistema francés: cuota fija sobre el saldo financiado.
    const cuotaFija = i > 0 ? montoSaldo * i / (1 - Math.pow(1 + i, -n)) : montoSaldo / n;
    let saldoRestante = montoSaldo;
    for (let k = 1; k <= n; k++) {
      const fecha = sumarMeses(fechaFirma, nInicial + k, dia);
      const interesK = Math.round(saldoRestante * i);
      let capitalK = Math.round(cuotaFija - interesK);
      if (k === n) capitalK = saldoRestante; // la última cuota absorbe el redondeo del sistema francés
      saldoRestante -= capitalK;
      filas.push({ numero: numero++, fecha, concepto: `Cuota ${k}/${n}`, capital: capitalK, interes: interesK });
    }
    cuotaTipica = Math.round(cuotaFija);
  }

  // El capital del plan siempre debe sumar el valor del inmueble: la última fila absorbe el redondeo.
  const sumaCapital = filas.reduce((s, f) => s + f.capital, 0);
  const diferencia = valor - sumaCapital;
  if (diferencia !== 0 && filas.length > 0) filas[filas.length - 1].capital += diferencia;

  return { filas, cuotaTipica };
}

// Plan de un lote (Miraflor o Miravista): separación de la plantilla + cuotas mensuales iguales
// redondeadas a miles de pesos, calculadas sobre el valor neto (valor de lista − bono); la última
// cuota absorbe la diferencia de redondeo.
function generarPlanLote(p: PlantillaLote, valorNeto: number, fechaFirma: string, dia: number, plazoMeses: number): { filas: FilaPlan[]; cuotaTipica: number } {
  const filas: FilaPlan[] = [];
  let numero = 1;
  filas.push({ numero: numero++, fecha: fechaFirma, concepto: 'Separación', capital: p.separacion, interes: 0 });
  const n = Math.max(1, plazoMeses);
  const montoCuotas = Math.max(0, valorNeto - p.separacion);
  const cuotaBase = Math.round(montoCuotas / n / 1000) * 1000;
  for (let k = 1; k <= n; k++) {
    const fecha = sumarMeses(fechaFirma, k, dia);
    const capital = k === n ? montoCuotas - cuotaBase * (n - 1) : cuotaBase;
    filas.push({ numero: numero++, fecha, concepto: `Cuota ${k}/${n}`, capital, interes: 0 });
  }
  const sumaCapital = filas.reduce((s, f) => s + f.capital, 0);
  const diferencia = valorNeto - sumaCapital;
  if (diferencia !== 0 && filas.length > 0) filas[filas.length - 1].capital += diferencia;
  return { filas, cuotaTipica: cuotaBase };
}

// ─────────────────────────────────────────────────────────────────────────
// TARJETA DE PLANTILLA
// ─────────────────────────────────────────────────────────────────────────

function TarjetaPlantilla({ plantilla, onSimular }: { plantilla: Plantilla; onSimular: () => void }) {
  const proyecto = proyectoPorId(plantilla.proyectoId);
  const chips: string[] = [];
  if (plantilla.tipo === 'apartamento') {
    chips.push(`Separación ${money(plantilla.separacion)}`);
    chips.push(`Inicial ${plantilla.inicialPct}% en ${plantilla.inicialCuotasDefault} cuotas`);
    if (plantilla.primasDefault) chips.push(`Extraordinarias: primas de junio y diciembre de ${money(PRIMA_VALOR)}`);
    chips.push(plantilla.saldoModo === 'credito'
      ? `Saldo final: ${plantilla.saldoPct}% con crédito hipotecario (+${plantilla.mesesEntrega} meses)`
      : `Saldo final: ${plantilla.saldoPct}% en ${plantilla.saldoCuotasDefault} cuotas con ${plantilla.tasaMensualDefault}% mensual`);
  } else {
    chips.push(`Separación ${money(plantilla.separacion)}`);
    const principal = plantilla.gruposCuotas[0];
    chips.push(`Cuotas: ${principal.cantidad} de ${money(principal.valor)}`);
    if (plantilla.gruposCuotas.length > 1) {
      const ultima = plantilla.gruposCuotas[plantilla.gruposCuotas.length - 1];
      chips.push(`Saldo final: ${ultima.cantidad} cuota de ${money(ultima.valor)}`);
    }
  }
  return (
    <Tarjeta>
      <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 2px' }}>{proyecto.nombre}</p>
      <p style={{ fontSize: 13, color: C.muted, margin: '0 0 12px' }}>{plantilla.nombre}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {chips.map((c, i) => (
          <span key={i} style={{ background: C.surfaceStrong, color: C.navy, fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 12, lineHeight: 1.5 }}>{c}</span>
        ))}
      </div>
      <BotonSecundario onClick={onSimular}>Simular</BotonSecundario>
    </Tarjeta>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────

export function SeccionPlanes(props: { empresa: FiltroEmpresa; persona: Persona; onIrA: (s: Seccion) => void; onToast: (m: string) => void }) {
  const plantillasVisibles = useMemo(() => PLANTILLAS.filter(p => enFiltroEmpresa(proyectoPorId(p.proyectoId).sede, props.empresa)), [props.empresa]);
  const primeraPlantilla = plantillasVisibles[0] ?? PLANTILLAS[0];

  // Comparativo rápido con el valor por defecto de cada plantilla: le ayuda a ventas a elegir
  // sin tener que simular una por una.
  const comparativo = useMemo(() => plantillasVisibles.map(pl => {
    const valorRef = pl.tipo === 'lote-fijo' ? pl.valorFijo : 180000000;
    const calculo = pl.tipo === 'apartamento'
      ? generarPlanApartamento(pl, valorRef, HOY, 5, pl.inicialPct, pl.inicialCuotasDefault, pl.primasDefault, pl.saldoCuotasDefault ?? 36, pl.tasaMensualDefault ?? 1)
      : generarPlanLote(pl, valorRef, HOY, 5, 48);
    const totalPagar = calculo.filas.reduce((s, f) => s + f.capital + f.interes, 0);
    const ultimaFila = calculo.filas[calculo.filas.length - 1];
    const meses = Math.max(1, Math.round(diffDays(HOY, ultimaFila ? ultimaFila.fecha : HOY) / 30));
    return { proyectoId: pl.proyectoId, proyectoNombre: proyectoPorId(pl.proyectoId).nombre, valorRef, totalPagar, meses };
  }), [plantillasVisibles]);

  const [proyectoId, setProyectoId] = useState(primeraPlantilla.proyectoId);
  const [valorTexto, setValorTexto] = useState(() => (
    primeraPlantilla.tipo === 'lote-fijo' ? String(precioListaLote(primeraPlantilla.proyectoId, 'Medianero', 70, false)) : String(180000000)
  ));
  const [valorManual, setValorManual] = useState(false);
  const [fechaFirma, setFechaFirma] = useState(HOY);
  const [diaCorte, setDiaCorte] = useState(5);
  const [pctInicial, setPctInicial] = useState(primeraPlantilla.tipo === 'apartamento' ? primeraPlantilla.inicialPct : 30);
  const [cuotasInicial, setCuotasInicial] = useState(primeraPlantilla.tipo === 'apartamento' ? primeraPlantilla.inicialCuotasDefault : 12);
  const [conPrimas, setConPrimas] = useState(primeraPlantilla.tipo === 'apartamento' ? primeraPlantilla.primasDefault : false);
  const [cuotasSaldo, setCuotasSaldo] = useState(primeraPlantilla.tipo === 'apartamento' ? (primeraPlantilla.saldoCuotasDefault ?? 36) : 36);
  const [tasaValor, setTasaValor] = useState(primeraPlantilla.tipo === 'apartamento' ? (primeraPlantilla.tasaMensualDefault ?? 1) : 1);
  const [tasaUnidad, setTasaUnidad] = useState<'mensual' | 'ea'>('mensual');
  const [verTodo, setVerTodo] = useState(false);

  // Controles propios de un lote de Cúcuta: tipo, área (solo Comercial), con urbanismo (solo
  // Miraflor), bono de descuento y plazo (hasta 48 meses sin urbanismo, 72 con urbanismo).
  const [tipoLote, setTipoLote] = useState<TipoLoteCucuta>('Medianero');
  const [areaLote, setAreaLote] = useState(70);
  const [conUrbanismoLote, setConUrbanismoLote] = useState(false);
  const [bonoDescuento, setBonoDescuento] = useState(0);
  const [plazoLote, setPlazoLote] = useState(48);

  const proyectoIdEfectivo = plantillasVisibles.some(p => p.proyectoId === proyectoId) ? proyectoId : (plantillasVisibles[0]?.proyectoId ?? '');
  const plantilla = plantillasVisibles.find(p => p.proyectoId === proyectoIdEfectivo);
  const valor = Number(valorTexto.replace(/\D/g, '')) || 0;
  const tasaMensualPct = tasaUnidad === 'mensual' ? tasaValor : mensualDesdeEA(tasaValor);

  const esLote = plantilla?.tipo === 'lote-fijo';
  const conUrbanismoAplica = esLote && proyectoIdEfectivo === 'miraflor';
  const conUrbanismoEfectivo = conUrbanismoAplica && conUrbanismoLote;
  const plazoMaxLote = conUrbanismoEfectivo ? 72 : 48;
  const valorListaLote = esLote ? precioListaLote(proyectoIdEfectivo, tipoLote, areaLote, conUrbanismoEfectivo) : 0;
  const valorNeto = esLote ? valor - bonoDescuento : valor;

  // El valor del inmueble sale de la lista mientras el usuario no lo cambie a mano.
  useEffect(() => {
    if (esLote && !valorManual) setValorTexto(String(valorListaLote));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [esLote, valorManual, valorListaLote]);

  const plan = useMemo(() => {
    if (!plantilla) return { filas: [] as FilaPlan[], cuotaTipica: 0 };
    if (plantilla.tipo === 'apartamento') {
      if (valor <= 0) return { filas: [] as FilaPlan[], cuotaTipica: 0 };
      return generarPlanApartamento(plantilla, valor, fechaFirma, diaCorte, pctInicial, cuotasInicial, conPrimas, cuotasSaldo, tasaMensualPct);
    }
    if (valorNeto <= 0) return { filas: [] as FilaPlan[], cuotaTipica: 0 };
    return generarPlanLote(plantilla, valorNeto, fechaFirma, diaCorte, plazoLote);
  }, [plantilla, valor, valorNeto, fechaFirma, diaCorte, pctInicial, cuotasInicial, conPrimas, cuotasSaldo, tasaMensualPct, plazoLote]);

  function cambiarProyecto(id: string) {
    const pl = plantillasVisibles.find(p => p.proyectoId === id);
    if (!pl) return;
    setProyectoId(id);
    setFechaFirma(HOY);
    setDiaCorte(5);
    setVerTodo(false);
    if (pl.tipo === 'apartamento') {
      setValorTexto(String(180000000));
      setValorManual(false);
      setPctInicial(pl.inicialPct);
      setCuotasInicial(pl.inicialCuotasDefault);
      setConPrimas(pl.primasDefault);
      setCuotasSaldo(pl.saldoCuotasDefault ?? 36);
      setTasaValor(pl.tasaMensualDefault ?? 1);
      setTasaUnidad('mensual');
    } else {
      setTipoLote('Medianero');
      setAreaLote(70);
      setConUrbanismoLote(false);
      setBonoDescuento(0);
      setPlazoLote(48);
      setValorManual(false);
      setValorTexto(String(precioListaLote(pl.proyectoId, 'Medianero', 70, false)));
    }
  }

  if (!plantilla) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Planes de pago</h1>
        <Tarjeta><p style={{ fontSize: 13, color: C.muted, margin: 0 }}>No hay plantillas para este filtro.</p></Tarjeta>
      </div>
    );
  }

  const sumaCapitalFinal = plan.filas.reduce((s, f) => s + f.capital, 0);
  const valorReferenciaCuadre = esLote ? valorNeto : valor;
  const cuadra = Math.abs(sumaCapitalFinal - valorReferenciaCuadre) < 1;
  const totalAPagar = plan.filas.reduce((s, f) => s + f.capital + f.interes, 0);
  const totalIntereses = plan.filas.reduce((s, f) => s + f.interes, 0);
  const ultimaFecha = plan.filas.length > 0 ? plan.filas[plan.filas.length - 1].fecha : fechaFirma;
  const plazoMeses = Math.max(1, Math.round(diffDays(fechaFirma, ultimaFecha) / 30));
  const filasMostradas = verTodo ? plan.filas : plan.filas.slice(0, 12);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Planes de pago</h1>
      <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
        Gerencia define una plantilla por proyecto; en cada venta se elige la plantilla y se ajustan los valores. El plan ya no se copia a mano de la promesa.
      </p>

      <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>Plantillas por proyecto</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
        {plantillasVisibles.map(pl => (
          <TarjetaPlantilla key={pl.proyectoId} plantilla={pl} onSimular={() => cambiarProyecto(pl.proyectoId)} />
        ))}
      </div>

      {(props.empresa === 'cucuta' || props.empresa === 'grupo') && <TarjetaListaPreciosLotes />}

      <Tarjeta>
        <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}>Comparativo rápido</p>
        <p style={{ fontSize: 13, color: C.muted, margin: '0 0 12px' }}>Con el valor por defecto de cada plantilla, sin necesidad de simular una por una.</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 560 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                <th style={celda}>Proyecto</th>
                <th style={celda}>Valor de referencia</th>
                <th style={celda}>Total a pagar</th>
                <th style={celda}>Intereses</th>
                <th style={celda}>Plazo</th>
                <th style={celda} />
              </tr>
            </thead>
            <tbody>
              {comparativo.map(c => (
                <tr key={c.proyectoId} style={{ borderBottom: `1px solid ${C.line}` }}>
                  <td style={{ ...celda, fontWeight: 600 }}>{c.proyectoNombre}</td>
                  <td style={celda}>{money(c.valorRef)}</td>
                  <td style={celda}>{money(c.totalPagar)}</td>
                  <td style={celda}>{money(c.totalPagar - c.valorRef)}</td>
                  <td style={celda}>{c.meses} meses</td>
                  <td style={celda}><BotonSecundario onClick={() => cambiarProyecto(c.proyectoId)}>Simular</BotonSecundario></td>
                </tr>
              ))}
              {comparativo.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 16, textAlign: 'center', color: C.muted }}>No hay plantillas para este filtro.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 12, color: C.muted, margin: '10px 0 0' }}>
          «Intereses» es lo que se paga de más frente al valor de referencia. En las plantillas con crédito hipotecario queda en cero, porque ese interés lo cobra el banco, no Mizar.
        </p>
      </Tarjeta>

      <Tarjeta>
        <p style={{ fontSize: 16, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}>Simulador comercial</p>
        <p style={{ fontSize: 13, color: C.muted, margin: '0 0 16px' }}>{plantilla.nombre} · {proyectoPorId(plantilla.proyectoId).nombre}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
          <Campo id="p-proyecto" label="Proyecto">
            <select id="p-proyecto" value={proyectoIdEfectivo} onChange={e => cambiarProyecto(e.target.value)} style={estiloInput}>
              {plantillasVisibles.map(pl => <option key={pl.proyectoId} value={pl.proyectoId}>{proyectoPorId(pl.proyectoId).nombre}</option>)}
            </select>
          </Campo>
          <Campo id="p-valor" label="Valor del inmueble">
            <input id="p-valor" inputMode="numeric" value={valor ? valor.toLocaleString('es-CO') : ''} onChange={e => { setValorTexto(e.target.value); setValorManual(true); }} style={estiloInput} placeholder="$ 0" />
          </Campo>
          <Campo id="p-firma" label="Fecha de firma">
            <input id="p-firma" type="date" value={fechaFirma} onChange={e => setFechaFirma(e.target.value || fechaFirma)} style={estiloInput} />
          </Campo>
          <Campo id="p-corte" label="Día de corte">
            <select id="p-corte" value={diaCorte} onChange={e => setDiaCorte(Number(e.target.value))} style={estiloInput}>
              <option value={5}>El 5 de cada mes</option><option value={15}>El 15 de cada mes</option>
              <option value={30}>El 30 de cada mes</option><option value={31}>El último día del mes</option>
            </select>
          </Campo>

          {plantilla.tipo === 'apartamento' && (
            <>
              <Campo id="p-pct" label="% de inicial">
                <input id="p-pct" type="number" min={1} max={100} value={pctInicial} onChange={e => setPctInicial(Math.max(1, Math.min(100, Number(e.target.value) || 1)))} style={estiloInput} />
              </Campo>
              <Campo id="p-cuotas-inicial" label="Cuotas de la inicial">
                <input id="p-cuotas-inicial" type="number" min={1} max={36} value={cuotasInicial} onChange={e => setCuotasInicial(Math.max(1, Math.min(36, Number(e.target.value) || 1)))} style={estiloInput} />
              </Campo>
              {plantilla.saldoModo === 'cuotas' && (
                <Campo id="p-cuotas-saldo" label="Cuotas del saldo">
                  <input id="p-cuotas-saldo" type="number" min={1} max={120} value={cuotasSaldo} onChange={e => setCuotasSaldo(Math.max(1, Math.min(120, Number(e.target.value) || 1)))} style={estiloInput} />
                </Campo>
              )}
            </>
          )}

          {plantilla.tipo === 'lote-fijo' && (
            <>
              <Campo id="p-tipo-lote" label="Tipo de lote">
                <select id="p-tipo-lote" value={tipoLote} onChange={e => setTipoLote(e.target.value as TipoLoteCucuta)} style={estiloInput}>
                  <option value="Medianero">Medianero</option>
                  <option value="Esquinero">Esquinero</option>
                  {proyectoIdEfectivo === 'miraflor' && <option value="Comercial">Comercial</option>}
                </select>
              </Campo>
              {tipoLote === 'Comercial' && (
                <Campo id="p-area-lote" label="Área (m²)">
                  <input id="p-area-lote" type="number" min={1} value={areaLote} onChange={e => setAreaLote(Math.max(1, Number(e.target.value) || 70))} style={estiloInput} />
                </Campo>
              )}
              <Campo id="p-bono" label="Bono de descuento">
                <input id="p-bono" inputMode="numeric" type="number" min={0} step={100000} value={bonoDescuento || ''} onChange={e => setBonoDescuento(Math.max(0, Number(e.target.value) || 0))} style={estiloInput} placeholder="$ 0" />
              </Campo>
              <Campo id="p-plazo-lote" label="Plazo (meses)">
                <input id="p-plazo-lote" type="number" min={1} max={plazoMaxLote} value={plazoLote} onChange={e => setPlazoLote(Math.max(1, Math.min(plazoMaxLote, Number(e.target.value) || 1)))} style={estiloInput} />
              </Campo>
            </>
          )}
        </div>

        {plantilla.tipo === 'apartamento' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', minHeight: 36 }}>
              <input type="checkbox" checked={conPrimas} onChange={e => setConPrimas(e.target.checked)} /> Incluye primas de junio y diciembre ({money(PRIMA_VALOR)} cada una, dentro de la inicial)
            </label>
            {plantilla.saldoModo === 'credito' ? (
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
                El saldo ({100 - pctInicial}%) se paga a los {plantilla.mesesEntrega} meses de la firma, con {(plantilla.conceptoSaldo ?? "").toLowerCase()}: no lo financia Mizar.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, alignItems: 'flex-end' }}>
                <Campo id="p-tasa-unidad" label="Tasa del saldo">
                  <select id="p-tasa-unidad" value={tasaUnidad} onChange={e => setTasaUnidad(e.target.value === 'ea' ? 'ea' : 'mensual')} style={estiloInput}>
                    <option value="mensual">% mensual</option><option value="ea">% EA</option>
                  </select>
                </Campo>
                <Campo id="p-tasa-valor" label="Valor de la tasa">
                  <input id="p-tasa-valor" type="number" min={0} max={40} step={0.1} value={tasaValor} onChange={e => setTasaValor(Math.max(0, Number(e.target.value) || 0))} style={estiloInput} />
                </Campo>
              </div>
            )}
            {plantilla.saldoModo === 'cuotas' && (
              <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
                {tasaUnidad === 'mensual'
                  ? `${tasaValor}% mensual equivale a ${eaDesdeMensual(tasaValor).toFixed(2)}% EA.`
                  : `${tasaValor}% EA equivale a ${mensualDesdeEA(tasaValor).toFixed(2)}% mensual.`}
              </p>
            )}
          </div>
        )}

        {plantilla.tipo === 'lote-fijo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {conUrbanismoAplica && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', minHeight: 36 }}>
                <input type="checkbox" checked={conUrbanismoLote} onChange={e => { setConUrbanismoLote(e.target.checked); setPlazoLote(e.target.checked ? 72 : 48); }} />
                Incluye urbanismo (sube el valor de lista y el plazo máximo a 72 meses)
              </label>
            )}
            <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
              Plan de cuota fija sin interés: separación de {money(plantilla.separacion)} y {plazoLote} cuotas mensuales iguales sobre el valor neto (redondeadas a miles de pesos).
            </p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
          {esLote ? (
            <>
              <EstadisticaMini titulo="Valor de lista" valor={money(valor)} />
              <EstadisticaMini titulo="Bono" valor={money(bonoDescuento)} />
              <EstadisticaMini titulo="Valor neto" valor={money(valorNeto)} />
            </>
          ) : (
            <EstadisticaMini titulo="Valor" valor={money(valor)} />
          )}
          <EstadisticaMini titulo="Total a pagar" valor={money(totalAPagar)} />
          <EstadisticaMini titulo="Intereses" valor={money(totalIntereses)} />
          <EstadisticaMini titulo="Cuota mensual típica" valor={money(plan.cuotaTipica)} />
          <EstadisticaMini titulo="Plazo" valor={`${plazoMeses} meses`} />
        </div>

        <div style={{ marginBottom: 10 }}>
          <Chip tono={cuadra ? 'green' : 'red'} texto={cuadra ? 'El capital del plan suma el valor del inmueble' : 'El plan no cuadra: revisa los valores'} />
        </div>

        <div style={{ overflowX: 'auto', marginBottom: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 520 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                <th style={celda}>Nº</th><th style={celda}>Fecha</th><th style={celda}>Concepto</th><th style={celda}>Capital</th><th style={celda}>Interés</th><th style={celda}>Total</th>
              </tr>
            </thead>
            <tbody>
              {filasMostradas.map(f => (
                <tr key={f.numero} style={{ borderBottom: `1px solid ${C.line}` }}>
                  <td style={celda}>{f.numero}</td><td style={celda}>{fechaLarga(f.fecha)}</td><td style={{ ...celda, whiteSpace: 'normal' }}>{f.concepto}</td>
                  <td style={celda}>{money(f.capital)}</td><td style={celda}>{money(f.interes)}</td><td style={{ ...celda, fontWeight: 600 }}>{money(f.capital + f.interes)}</td>
                </tr>
              ))}
              {filasMostradas.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 16, textAlign: 'center', color: C.muted }}>Escribe el valor del inmueble para ver el plan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {!verTodo && plan.filas.length > 12 && (
          <button type="button" onClick={() => setVerTodo(true)} style={{ background: 'none', border: 'none', color: C.blue, fontWeight: 700, fontSize: 13, cursor: 'pointer', minHeight: 40, padding: 0, fontFamily: 'inherit', marginBottom: 16 }}>
            Ver todo el plan ({plan.filas.length} cuotas)
          </button>
        )}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <BotonSecundario onClick={() => props.onToast('En la plataforma real se descarga para anexarlo a la promesa')}><Download size={15} />Descargar plan en PDF</BotonSecundario>
          <BotonPrimario onClick={() => { props.onIrA('ventas'); props.onToast('Abre el alta de venta con este plan'); }}>Usar en una venta nueva</BotonPrimario>
          {props.persona.rol === 'gerencia' && (
            <BotonSecundario onClick={() => props.onToast('Gerencia puede cambiar los componentes; cada cambio crea una versión nueva')}>Editar plantilla</BotonSecundario>
          )}
        </div>
      </Tarjeta>

      <Tarjeta>
        <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 12px' }}>Intereses</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            'Un plan puede no tener interés, tener una tasa fija o cobrar por tramos, según el proyecto.',
            'La tasa se digita en efectiva anual o mensual y el sistema hace la conversión.',
            'La mora tiene un tope: no puede pasar la tasa de usura (se define en Configuración).',
            'Los acuerdos de pago pueden quedar con un interés distinto al del plan original.',
            'Cada mes, contabilidad causa los intereses del periodo.',
          ].map((texto, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.navy, marginTop: 7, flexShrink: 0 }} />
              <span style={{ color: C.ink }}>{texto}</span>
            </div>
          ))}
        </div>
      </Tarjeta>
    </div>
  );
}
