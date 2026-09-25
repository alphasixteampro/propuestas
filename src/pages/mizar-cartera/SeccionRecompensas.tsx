// Sección de Recompensas por WhatsApp (PRD 12G): racha de pagos a tiempo, progreso del inmueble,
// puntos y niveles, presupuesto por empresa y campañas. Todo se calcula a partir de los mismos
// pagos y cuotas que usa el resto de la demo: nadie ve un número distinto en otra pantalla.
import React, { useMemo, useState } from 'react';
import { Flame, Gift, Users, TrendingUp, Target, Trophy, Percent, CircleDollarSign, Megaphone, Plus } from 'lucide-react';
import {
  C, HOY, money, fechaLarga, plural, Chip, Tarjeta, BotonPrimario, BotonSecundario, Modal, Campo, estiloInput,
  TarjetaKpi, Tono, EmpresaId,
  Cliente, Pago, CuotaEstado, ResumenCliente, Proyecto, Persona, FiltroEmpresa,
  proyectoPorId, empresaDeSede, vigentes,
} from './base';

// ─────────────────────────────────────────────────────────────────────────
// CÁLCULOS PUROS
// ─────────────────────────────────────────────────────────────────────────

// El último pago vigente (sin anular) que tiene una aplicación sobre esta cuota, el más reciente.
function ultimoPagoQueAplicaCuota(pagos: Pago[], numero: number): Pago | null {
  const relevantes = vigentes(pagos).filter(p => p.aplicaciones.some(a => a.cuota === numero));
  if (relevantes.length === 0) return null;
  return relevantes.reduce((mejor, actual) => (actual.fecha > mejor.fecha ? actual : mejor));
}

// Una cuota quedó «a tiempo» si está pagada y el pago que la cerró llegó el mismo día del
// vencimiento o antes.
function cuotaATiempo(cuota: CuotaEstado, pagos: Pago[]): boolean {
  if (cuota.estado !== 'pagada') return false;
  const ultimo = ultimoPagoQueAplicaCuota(pagos, cuota.numero);
  return !!ultimo && ultimo.fecha <= cuota.vence;
}

// Racha: cuotas ya vencidas, de la más reciente a la más antigua, mientras sigan a tiempo.
// Se corta en la primera que falle (no está pagada, o se pagó tarde).
function calcularRacha(cuotas: CuotaEstado[], pagos: Pago[]): number {
  const vencidas = cuotas.filter(c => c.vence < HOY).slice().sort((a, b) => b.vence.localeCompare(a.vence));
  let racha = 0;
  for (const c of vencidas) {
    if (!cuotaATiempo(c, pagos)) break;
    racha++;
  }
  return racha;
}

// A tiempo total: cuántas cuotas de toda la historia del cliente se pagaron a tiempo, sin
// cortar en la primera falla (a diferencia de la racha, que sí se corta).
function calcularATiempoTotal(cuotas: CuotaEstado[], pagos: Pago[]): number {
  return cuotas.filter(c => cuotaATiempo(c, pagos)).length;
}

// Cuánto lleva pagado del inmueble: la cuota inicial más el capital pagado, sobre el valor de venta.
function calcularProgreso(cliente: Cliente, resumen: ResumenCliente): number {
  const pct = (cliente.raw.cuotaInicial + resumen.capitalPagado) / cliente.raw.valorVenta;
  return Math.min(1, Math.max(0, pct));
}

function contarReferidos(clienteId: string, clientes: Cliente[]): number {
  return clientes.filter(c => c.raw.referidoDeId === clienteId).length;
}

function calcularPuntos(aTiempoTotal: number, referidos: number): number {
  return 100 * aTiempoTotal + 250 * referidos;
}

type Nivel = 'Bronce' | 'Plata' | 'Oro';

function nivelDePuntos(puntos: number): Nivel {
  if (puntos >= 1050) return 'Oro';
  if (puntos >= 850) return 'Plata';
  return 'Bronce';
}

// Cada nivel con su color: Oro en ámbar, Plata en gris y Bronce en el rojo tierra de la paleta.
function chipDeNivel(nivel: Nivel): { tono: Tono; texto: string } {
  if (nivel === 'Oro') return { tono: 'amber', texto: 'Oro' };
  if (nivel === 'Plata') return { tono: 'muted', texto: 'Plata' };
  return { tono: 'red', texto: 'Bronce' };
}

function proximoBeneficioTexto(racha: number, entregado: boolean, meta: number, valor: number): string {
  if (racha >= meta) {
    return entregado
      ? `Ya recibió su descuento de ${money(valor)} por la racha de ${meta}`
      : `Descuento de ${money(valor)} en la próxima cuota (racha de ${meta})`;
  }
  return `Te faltan ${plural(meta - racha, 'cuota', 'cuotas')} a tiempo para tu beneficio`;
}

interface FilaRecompensa {
  cliente: Cliente; proyecto: Proyecto;
  racha: number; aTiempoTotal: number; referidos: number; progreso: number; puntos: number; nivel: Nivel;
}

function construirFilas(clientes: Cliente[], resumenes: Map<string, { cuotas: CuotaEstado[]; resumen: ResumenCliente }>): FilaRecompensa[] {
  return clientes.map(cliente => {
    const datos = resumenes.get(cliente.raw.id);
    const cuotas = datos?.cuotas ?? [];
    const resumen = datos?.resumen;
    const racha = calcularRacha(cuotas, cliente.pagos);
    const aTiempoTotal = calcularATiempoTotal(cuotas, cliente.pagos);
    const referidos = contarReferidos(cliente.raw.id, clientes);
    const progreso = resumen ? calcularProgreso(cliente, resumen) : 0;
    const puntos = calcularPuntos(aTiempoTotal, referidos);
    return { cliente, proyecto: proyectoPorId(cliente.raw.proyectoId), racha, aTiempoTotal, referidos, progreso, puntos, nivel: nivelDePuntos(puntos) };
  }).sort((a, b) => b.puntos - a.puntos);
}

// ─────────────────────────────────────────────────────────────────────────
// PIEZAS VISUALES
// ─────────────────────────────────────────────────────────────────────────

function AnilloProgreso({ pct, size = 34 }: { pct: number; size?: number }) {
  const grosor = Math.max(3, Math.round(size / 8));
  const r = (size - grosor) / 2;
  const circunferencia = 2 * Math.PI * r;
  const recorrido = circunferencia * pct;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${Math.round(pct * 100)}% pagado`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.line} strokeWidth={grosor} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.green} strokeWidth={grosor} strokeLinecap="round"
        strokeDasharray={`${recorrido} ${circunferencia - recorrido}`} transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

// Interruptor de mecánica: igual al de recordatorios, pero con una nota opcional debajo (para
// avisar «Lo configura gerencia» cuando el rol no puede tocarlo).
function InterruptorMecanica({ label, checked, onChange, disabled, nota }: {
  label: React.ReactNode; checked: boolean; onChange: (v: boolean) => void; disabled: boolean; nota?: string;
}) {
  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: disabled ? 'default' : 'pointer', fontSize: 14, color: C.ink, opacity: disabled ? 0.6 : 1 }}>
        {label}
        <span
          onClick={() => { if (!disabled) onChange(!checked); }} role="switch" aria-checked={checked} aria-disabled={disabled} tabIndex={disabled ? -1 : 0}
          onKeyDown={e => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onChange(!checked); } }}
          style={{ width: 40, height: 22, borderRadius: 12, background: checked ? C.green : C.lineStrong, position: 'relative', display: 'inline-block', flexShrink: 0 }}
        >
          <span style={{ position: 'absolute', top: 2, left: checked ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .15s' }} />
        </span>
      </label>
      {nota && <p style={{ fontSize: 12, color: C.muted, margin: '4px 0 0' }}>{nota}</p>}
    </div>
  );
}

interface Campania {
  id: string; nombre: string; segmento: 'Todos los clientes' | 'Al día' | 'Atrasados que se pongan al día';
  beneficio: string; desde: string; hasta: string; presupuesto: number; estado: 'Programada' | 'Enviada' | 'Borrador';
}

const CAMPANIA_INICIAL: Campania = {
  id: 'c1', nombre: 'Se viene la prima', segmento: 'Al día', beneficio: 'Abona una cuota extra y recibe 1 % de descuento',
  desde: '2026-12-01', hasta: '2026-12-20', presupuesto: 1500000, estado: 'Programada',
};

function ModalNuevaCampania({ onCerrar, onCrear }: { onCerrar: () => void; onCrear: (c: Campania) => void }) {
  const [nombre, setNombre] = useState('');
  const [segmento, setSegmento] = useState<Campania['segmento']>('Todos los clientes');
  const [beneficio, setBeneficio] = useState('');
  const [desde, setDesde] = useState(HOY);
  const [hasta, setHasta] = useState(HOY);
  const [presupuesto, setPresupuesto] = useState(500000);
  const puedeCrear = nombre.trim().length > 0 && beneficio.trim().length > 0 && desde <= hasta;

  return (
    <Modal titulo="Nueva campaña" subtitulo="Sale por WhatsApp solo a quien autorizó recibir mensajes" onCerrar={onCerrar}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Campo id="camp-nombre" label="Nombre de la campaña">
          <input id="camp-nombre" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. Bono de fin de año" style={estiloInput} />
        </Campo>
        <Campo id="camp-segmento" label="A quién le llega">
          <select id="camp-segmento" value={segmento} onChange={e => setSegmento(e.target.value as Campania['segmento'])} style={estiloInput}>
            <option value="Todos los clientes">Todos los clientes</option>
            <option value="Al día">Al día</option>
            <option value="Atrasados que se pongan al día">Atrasados que se pongan al día</option>
          </select>
        </Campo>
        <Campo id="camp-beneficio" label="Beneficio" ayuda="Se muestra tal cual en el mensaje.">
          <input id="camp-beneficio" value={beneficio} onChange={e => setBeneficio(e.target.value)} placeholder="Ej. 1 % de descuento en la cuota de diciembre" style={estiloInput} />
        </Campo>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Campo id="camp-desde" label="Desde">
            <input id="camp-desde" type="date" value={desde} onChange={e => setDesde(e.target.value || HOY)} style={estiloInput} />
          </Campo>
          <Campo id="camp-hasta" label="Hasta">
            <input id="camp-hasta" type="date" value={hasta} onChange={e => setHasta(e.target.value || HOY)} style={estiloInput} />
          </Campo>
        </div>
        <Campo id="camp-presupuesto" label="Presupuesto">
          <input id="camp-presupuesto" type="number" min={0} step={10000} value={presupuesto} onChange={e => setPresupuesto(Math.max(0, Number(e.target.value) || 0))} style={estiloInput} />
        </Campo>

        <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: 12 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 0.4 }}>Vista previa del mensaje</p>
          <div style={{ background: '#202c33', color: '#e9edef', borderRadius: '0 8px 8px 8px', padding: '10px 12px', fontSize: 13, maxWidth: 320 }}>
            Hola 👋 {nombre.trim() || 'campaña sin nombre'}: {beneficio.trim() || 'escribe el beneficio'}. Válido del {fechaLarga(desde)} al {fechaLarga(hasta)}.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
          <BotonSecundario onClick={onCerrar}>Cancelar</BotonSecundario>
          <BotonPrimario disabled={!puedeCrear} onClick={() => onCrear({
            id: `camp-${Date.now()}`, nombre: nombre.trim(), segmento, beneficio: beneficio.trim(), desde, hasta, presupuesto, estado: 'Programada',
          })}>Crear campaña</BotonPrimario>
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────

export function SeccionRecompensas(props: {
  clientes: Cliente[]; resumenes: Map<string, { cuotas: CuotaEstado[]; resumen: ResumenCliente }>;
  empresa: FiltroEmpresa; persona: Persona; onToast: (m: string) => void;
}) {
  const { clientes, resumenes, persona, onToast } = props;
  const puedeGerencia = persona.rol === 'gerencia';
  const notaGerencia = 'Lo configura gerencia';

  // Mecánica: racha de pagos.
  const [metaRacha, setMetaRacha] = useState(6);
  const [valorBeneficioRacha, setValorBeneficioRacha] = useState(100000);
  const [rachaActiva, setRachaActiva] = useState(true);
  // Mecánica: progreso del inmueble.
  const [progresoActivo, setProgresoActivo] = useState(true);
  // Mecánica: puntos y niveles.
  const [puntosActivo, setPuntosActivo] = useState(true);
  // Mecánica: pronto pago.
  const [prontoPagoActivo, setProntoPagoActivo] = useState(true);

  // Presupuesto por empresa y consumo de la sesión.
  const [presupuestoMizar, setPresupuestoMizar] = useState(2000000);
  const [presupuestoCucuta, setPresupuestoCucuta] = useState(600000);
  const [consumido, setConsumido] = useState<Record<EmpresaId, number>>({ mizar: 0, cucuta: 0 });

  // Beneficios entregados: la demo empieza con 2 ya entregados este mes (200.000 de costo) y
  // suma lo que gerencia entregue en esta sesión.
  const [entregados, setEntregados] = useState<Set<string>>(new Set());
  const [costoExtra, setCostoExtra] = useState(0);
  const entregadosMes = 2 + entregados.size;
  const costoMes = 200000 + costoExtra;

  const [campanias, setCampanias] = useState<Campania[]>([CAMPANIA_INICIAL]);
  const [modalCampania, setModalCampania] = useState(false);

  const filas = useMemo(() => construirFilas(clientes, resumenes), [clientes, resumenes]);
  const participantes = clientes.filter(c => c.raw.autorizaWhatsapp).length;
  const rachasActivas = filas.filter(f => f.racha >= 3).length;

  function entregarBeneficio(fila: FilaRecompensa) {
    setEntregados(prev => new Set(prev).add(fila.cliente.raw.id));
    setCostoExtra(prev => prev + valorBeneficioRacha);
    const empresaId = empresaDeSede(fila.proyecto.sede).id;
    setConsumido(prev => ({ ...prev, [empresaId]: prev[empresaId] + valorBeneficioRacha }));
    onToast('Beneficio aplicado como descuento autorizado en la próxima cuota; genera su comprobante contable.');
  }

  function crearCampania(c: Campania) {
    setCampanias(prev => [...prev, c]);
    setModalCampania(false);
    onToast(`Campaña «${c.nombre}» programada del ${fechaLarga(c.desde)} al ${fechaLarga(c.hasta)}.`);
  }

  // Para el teléfono simulado: el cliente con autorización de WhatsApp y mejor racha.
  const filasConWhatsapp = filas.filter(f => f.cliente.raw.autorizaWhatsapp);
  const estrella = [...(filasConWhatsapp.length > 0 ? filasConWhatsapp : filas)].sort((a, b) => b.racha - a.racha)[0] as FilaRecompensa | undefined;

  const filaPresupuesto = (empresaId: EmpresaId, nombre: string, presupuesto: number, setPresupuesto: (v: number) => void) => {
    const gastado = consumido[empresaId];
    const pct = presupuesto > 0 ? Math.min(1, gastado / presupuesto) : 0;
    return (
      <div key={empresaId} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, padding: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, margin: 0 }}>{nombre}</p>
          <input
            type="number" min={0} step={50000} value={presupuesto} disabled={!puedeGerencia}
            onChange={e => setPresupuesto(Math.max(0, Number(e.target.value) || 0))}
            aria-label={`Presupuesto mensual de ${nombre}`}
            style={{ ...estiloInput, width: 150, minHeight: 34, padding: '6px 10px', fontVariantNumeric: 'tabular-nums' }}
          />
        </div>
        <div style={{ background: C.surfaceStrong, borderRadius: 999, height: 10, overflow: 'hidden' }}>
          <div style={{ width: `${pct * 100}%`, height: '100%', background: pct >= 0.9 ? C.red : C.green, borderRadius: 999 }} />
        </div>
        <p style={{ fontSize: 12, color: C.muted, margin: '6px 0 0' }}>Consumido en esta sesión: {money(gastado)} de {money(presupuesto)} ({Math.round(pct * 100)} %)</p>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Recompensas por WhatsApp</h1>
      <p style={{ fontSize: 14, color: C.muted, margin: 0, maxWidth: 720 }}>
        El cliente que paga a tiempo ve su progreso y gana beneficios; todo le llega por WhatsApp.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <TarjetaKpi icono={Users} titulo="Participantes" valor={String(participantes)} sub={`${plural(participantes, 'cliente autorizó', 'clientes autorizaron')} WhatsApp`} tono="navy" />
        <TarjetaKpi icono={Flame} titulo="Rachas activas" valor={String(rachasActivas)} sub="3 cuotas seguidas a tiempo o más" tono="amber" />
        <TarjetaKpi icono={Gift} titulo="Beneficios este mes" valor={String(entregadosMes)} sub={`Costo: ${money(costoMes)}`} tono="green" />
        <TarjetaKpi icono={TrendingUp} titulo="Recaudo a tiempo" valor="84 %" sub="vs. 71 % del grupo de control" tono="blue" />
      </div>
      <p style={{ fontSize: 12, color: C.muted, margin: '-12px 0 0' }}>Grupo de control: clientes que aún no reciben recompensas.</p>

      <Tarjeta>
        <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}>Mecánicas</p>
        <p style={{ fontSize: 13, color: C.muted, margin: '0 0 14px' }}>Se pueden prender o apagar sin tocar el cálculo de la cartera: solo cambian lo que el cliente ve y gana.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <InterruptorMecanica
              label={<><Flame size={15} style={{ verticalAlign: 'middle', marginRight: 6, color: C.amber }} />Racha de pagos</>}
              checked={rachaActiva} onChange={setRachaActiva} disabled={!puedeGerencia} nota={!puedeGerencia ? notaGerencia : undefined}
            />
            {rachaActiva && (
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8, paddingLeft: 4 }}>
                <Campo id="meta-racha" label="Meta de cuotas seguidas">
                  <input id="meta-racha" type="number" min={2} max={24} value={metaRacha} disabled={!puedeGerencia}
                    onChange={e => setMetaRacha(Math.max(2, Math.min(24, Number(e.target.value) || 2)))}
                    style={{ ...estiloInput, width: 140 }} />
                </Campo>
                <Campo id="valor-racha" label="Descuento que gana">
                  <input id="valor-racha" type="number" min={0} step={10000} value={valorBeneficioRacha} disabled={!puedeGerencia}
                    onChange={e => setValorBeneficioRacha(Math.max(0, Number(e.target.value) || 0))}
                    style={{ ...estiloInput, width: 160 }} />
                </Campo>
              </div>
            )}
          </div>

          <InterruptorMecanica
            label={<><Target size={15} style={{ verticalAlign: 'middle', marginRight: 6, color: C.blue }} />Progreso del inmueble: avisos al 25 %, 50 % y 75 % pagado</>}
            checked={progresoActivo} onChange={setProgresoActivo} disabled={!puedeGerencia} nota={!puedeGerencia ? notaGerencia : undefined}
          />

          <InterruptorMecanica
            label={<><Trophy size={15} style={{ verticalAlign: 'middle', marginRight: 6, color: C.amber }} />Puntos y niveles: 100 por cuota a tiempo, 250 por referido; Bronce, Plata y Oro</>}
            checked={puntosActivo} onChange={setPuntosActivo} disabled={!puedeGerencia} nota={!puedeGerencia ? notaGerencia : undefined}
          />

          <InterruptorMecanica
            label={<><Percent size={15} style={{ verticalAlign: 'middle', marginRight: 6, color: C.green }} />Pronto pago: paga 5 días antes y gana 1 % de descuento en la cuota (tope {money(50000)})</>}
            checked={prontoPagoActivo} onChange={setProntoPagoActivo} disabled={!puedeGerencia} nota={!puedeGerencia ? notaGerencia : undefined}
          />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: C.ink, opacity: 0.85 }}>
            <Gift size={15} style={{ marginTop: 2, color: C.purple, flexShrink: 0 }} />
            <span>Referidos: bono de {money(500000)} en Cúcuta cuando el referido paga su 3.ª cuota. Es solo informativo aquí: se aprueba y se paga desde Morosos y cobranza.</span>
          </div>
        </div>
      </Tarjeta>

      <Tarjeta>
        <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}><CircleDollarSign size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />Presupuesto mensual por empresa</p>
        <p style={{ fontSize: 13, color: C.muted, margin: '0 0 14px' }}>Lo que se entrega en beneficios sale de este presupuesto; la barra muestra lo consumido en esta sesión de demostración.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {(props.empresa === 'grupo' || props.empresa === 'mizar') && filaPresupuesto('mizar', 'Mizar', presupuestoMizar, setPresupuestoMizar)}
          {(props.empresa === 'grupo' || props.empresa === 'cucuta') && filaPresupuesto('cucuta', 'Mi Lote Cúcuta', presupuestoCucuta, setPresupuestoCucuta)}
        </div>
      </Tarjeta>

      <Tarjeta>
        <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 12px' }}>Clientes</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 920 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                <th style={{ padding: '8px 6px' }}>Cliente</th><th style={{ padding: '8px 6px' }}>Proyecto</th>
                <th style={{ padding: '8px 6px' }}>Racha</th><th style={{ padding: '8px 6px' }}>Nivel</th>
                <th style={{ padding: '8px 6px' }}>Progreso</th><th style={{ padding: '8px 6px' }}>Puntos</th>
                <th style={{ padding: '8px 6px' }}>Próximo beneficio</th><th style={{ padding: '8px 6px' }} />
              </tr>
            </thead>
            <tbody>
              {filas.map(fila => {
                const id = fila.cliente.raw.id;
                const entregado = entregados.has(id);
                const chip = chipDeNivel(fila.nivel);
                const califica = fila.racha >= metaRacha && rachaActiva;
                return (
                  <tr key={id} style={{ borderBottom: `1px solid ${C.line}`, verticalAlign: 'middle' }}>
                    <td style={{ padding: '8px 6px', fontWeight: 600 }}>
                      {fila.cliente.raw.nombre}
                      <div style={{ fontWeight: 400, fontSize: 12, color: C.muted }}>{fila.cliente.raw.inmueble}</div>
                    </td>
                    <td style={{ padding: '8px 6px' }}>{fila.proyecto.nombre}</td>
                    <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums' }}>{fila.racha}{fila.racha >= 3 ? ' 🔥' : ''}</td>
                    <td style={{ padding: '8px 6px' }}><Chip tono={chip.tono} texto={chip.texto} /></td>
                    <td style={{ padding: '8px 6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AnilloProgreso pct={fila.progreso} />
                        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{Math.round(fila.progreso * 100)} %</span>
                      </div>
                    </td>
                    <td style={{ padding: '8px 6px', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{fila.puntos}</td>
                    <td style={{ padding: '8px 6px', color: C.muted, maxWidth: 240 }}>{proximoBeneficioTexto(fila.racha, entregado, metaRacha, valorBeneficioRacha)}</td>
                    <td style={{ padding: '8px 6px' }}>
                      {entregado ? <Chip tono="green" texto="Beneficio entregado" />
                        : califica ? (puedeGerencia ? <BotonPrimario onClick={() => entregarBeneficio(fila)}>Entregar beneficio</BotonPrimario> : <Chip tono="muted" texto="Espera a gerencia" />)
                          : null}
                    </td>
                  </tr>
                );
              })}
              {filas.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 16, textAlign: 'center', color: C.muted }}>No hay clientes para esta empresa.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Tarjeta>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <Tarjeta>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}><Megaphone size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />Campañas</p>
            <p style={{ fontSize: 13, color: C.muted, margin: '0 0 14px' }}>Mensajes puntuales para un grupo de clientes, con fecha de inicio y fin y presupuesto propio.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
              {campanias.map(c => (
                <div key={c.id} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, padding: 12, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                    <strong>{c.nombre}</strong>
                    <Chip tono={c.estado === 'Programada' ? 'blue' : c.estado === 'Enviada' ? 'green' : 'muted'} texto={c.estado} />
                  </div>
                  <p style={{ margin: '0 0 2px', color: C.ink }}>{c.beneficio}</p>
                  <p style={{ margin: 0, color: C.muted }}>Segmento: {c.segmento} · {fechaLarga(c.desde)} a {fechaLarga(c.hasta)} · Presupuesto {money(c.presupuesto)}</p>
                </div>
              ))}
            </div>
            {puedeGerencia
              ? <BotonSecundario onClick={() => setModalCampania(true)}><Plus size={15} />Nueva campaña</BotonSecundario>
              : <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{notaGerencia}: solo gerencia crea campañas nuevas.</p>}
          </Tarjeta>
        </div>

        {estrella && (
          <div className="hidden lg:block" style={{ width: 280, flexShrink: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 }}>Así lo ve el cliente</p>
            <div style={{ background: '#111b21', borderRadius: 28, padding: 10, border: '6px solid #1c1c1c', boxShadow: '0 10px 30px rgba(0,0,0,.18)' }}>
              <div style={{ background: '#0b141a', borderRadius: 18, overflow: 'hidden' }}>
                <div style={{ background: '#005c4b', color: '#fff', padding: '10px 12px', fontSize: 13, fontWeight: 700 }}>Mizar · Recompensas</div>
                <div style={{ padding: 12, minHeight: 380, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ alignSelf: 'flex-start', background: '#202c33', color: '#e9edef', padding: '8px 10px', borderRadius: '0 8px 8px 8px', fontSize: 13, maxWidth: '90%' }}>
                    ¡{estrella.cliente.raw.nombre.split(' ')[0]}! Llevas {plural(estrella.racha, 'cuota', 'cuotas')} a tiempo 🔥
                  </div>
                  <div style={{ alignSelf: 'flex-start', background: '#202c33', color: '#e9edef', padding: '10px', borderRadius: '0 8px 8px 8px', fontSize: 13, maxWidth: '90%', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <AnilloProgreso pct={estrella.progreso} size={44} />
                    <span>Ya pagaste el {Math.round(estrella.progreso * 100)} % de tu {estrella.cliente.raw.inmueble}</span>
                  </div>
                  <div style={{ alignSelf: 'flex-start', background: '#202c33', color: '#e9edef', padding: '8px 10px', borderRadius: '0 8px 8px 8px', fontSize: 13, maxWidth: '90%' }}>
                    Subiste a nivel {estrella.nivel}. Tu próximo beneficio: {proximoBeneficioTexto(estrella.racha, entregados.has(estrella.cliente.raw.id), metaRacha, valorBeneficioRacha)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <p style={{ fontSize: 12, color: C.muted, margin: 0, maxWidth: 720 }}>
        Solo a clientes con autorización de WhatsApp, en horario permitido y sin mensajes que presionen o avergüencen al que se atrasa (Ley 2300 de 2023). Mizar lo valida con su abogado.
      </p>

      {modalCampania && <ModalNuevaCampania onCerrar={() => setModalCampania(false)} onCrear={crearCampania} />}
    </div>
  );
}
