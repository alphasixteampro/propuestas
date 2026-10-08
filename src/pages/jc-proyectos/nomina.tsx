// Nómina semanal: asistencia por día, altas y bajas del lunes, prenómina del miércoles y archivo para
// el banco. Las faltas de viernes y sábado se pasan solas a la semana siguiente.
import React, { useState } from 'react';
import { UserPlus, Landmark } from 'lucide-react';
import { C, Chip, Tono, Tarjeta, Titulo, Boton, Campo, estiloInput, Modal, Tabla, celda, celdaDer, NotaIA } from './ui';
import {
  DIAS, DIA_HOY, DIA_CORTE, FRENTES, calcularNomina, nombreFrente, money,
  EstadoTrabajador, FrenteId, Marca, Trabajador,
} from './datos';
import { Accion, Persona } from './estado';

const ESTADO_T: Record<EstadoTrabajador, { texto: string; tono: Tono }> = {
  activo: { texto: 'Activo', tono: 'green' }, nuevo: { texto: 'Nuevo', tono: 'blue' },
  standby: { texto: 'En espera', tono: 'amber' }, baja: { texto: 'Baja', tono: 'muted' },
};

export function totalesNomina(cuadrilla: Trabajador[]) {
  const vigentes = cuadrilla.filter(t => t.estado !== 'baja');
  const calc = vigentes.map(t => ({ t, c: calcularNomina(t) }));
  return {
    calc,
    neto: calc.reduce((s, x) => s + x.c.neto, 0),
    prenomina: calc.reduce((s, x) => s + x.c.prenomina, 0),
    pasaProxima: calc.reduce((s, x) => s + x.c.pasaProxima, 0),
    descuentos: calc.reduce((s, x) => s + x.c.descuentoFaltas + x.c.arrastre, 0),
    personas: vigentes.filter(t => t.estado !== 'standby').length,
  };
}

export function observacionesNomina(cuadrilla: Trabajador[]): string[] {
  const out: string[] = [];
  for (const t of cuadrilla) {
    if (t.estado === 'baja') continue;
    const faltas = t.asistencia.filter(m => m === 'F').length;
    if (faltas >= 2) out.push(`${t.nombre} lleva ${faltas} faltas esta semana. ¿Sigue en la cuadrilla o se da de baja el lunes?`);
    if (t.estado === 'standby') out.push(`${t.nombre} está en espera: no se le paga hasta que regrese. Si no vuelve el lunes, conviene darlo de baja.`);
    if (t.arrastre > 0) out.push(`A ${t.nombre} se le descuentan ${money(t.arrastre)} de la semana pasada (${t.nota?.toLowerCase() ?? 'falta anterior'}).`);
  }
  const sinLista = cuadrilla.filter(t => (t.estado === 'activo' || t.estado === 'nuevo') && t.asistencia[DIA_HOY] === null).length;
  if (sinLista > 0) out.push(`Falta pasar lista de hoy viernes a ${sinLista} personas. El residente lo hace desde el celular, aunque no haya señal.`);
  return out;
}

function CeldaDia({ valor, onClick, editable }: { valor: Marca; onClick: () => void; editable: boolean }) {
  const estilo = valor === 'A' ? { bg: C.greenSoft, fg: C.green, t: '✓' } : valor === 'F' ? { bg: C.redSoft, fg: C.red, t: 'F' } : { bg: C.surface, fg: C.muted, t: '·' };
  return (
    <button type="button" onClick={onClick} disabled={!editable} aria-label={valor === 'A' ? 'Asistió' : valor === 'F' ? 'Faltó' : 'Sin registro'} style={{
      width: 34, height: 34, borderRadius: 8, border: `1px solid ${C.line}`, background: estilo.bg, color: estilo.fg, fontWeight: 800,
      cursor: editable ? 'pointer' : 'default', fontFamily: 'inherit', fontSize: 14,
    }}>{estilo.t}</button>
  );
}

export function SeccionNomina({ cuadrilla, dispersada, persona, dispatch, avisar }: {
  cuadrilla: Trabajador[]; dispersada: boolean; persona: Persona; dispatch: (a: Accion) => void; avisar: (m: string) => void;
}) {
  const [alta, setAlta] = useState(false);
  const [banco, setBanco] = useState(false);
  const editable = persona.id === 'rrhh' || persona.id === 'director';
  const tot = totalesNomina(cuadrilla);
  const obs = observacionesNomina(cuadrilla);
  const ciclo = (m: Marca): Marca => (m === null ? 'A' : m === 'A' ? 'F' : null);

  return (
    <div>
      <Titulo titulo="Nómina de la semana" sub="Semana del lunes 5 al sábado 10 de octubre. La asistencia llega del pase de lista en obra; la prenómina sale sola el miércoles.">
        {editable && <Boton variante="secundario" onClick={() => setAlta(true)}><UserPlus size={16} /> Dar de alta</Boton>}
        {editable && <Boton onClick={() => setBanco(true)} disabled={dispersada}><Landmark size={16} /> {dispersada ? 'Archivo del banco generado' : 'Generar archivo del banco'}</Boton>}
      </Titulo>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12, marginBottom: 14 }}>
        <Tarjeta><p style={{ margin: 0, fontSize: 13, color: C.muted, fontWeight: 700 }}>Prenómina del miércoles</p><p style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 800 }}>{money(tot.prenomina)}</p></Tarjeta>
        <Tarjeta><p style={{ margin: 0, fontSize: 13, color: C.muted, fontWeight: 700 }}>A pagar esta semana</p><p style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 800 }}>{money(tot.neto)}</p><p style={{ margin: '2px 0 0', fontSize: 13, color: C.muted }}>{tot.personas} personas · ajuste del jueves {money(tot.neto - tot.prenomina)}</p></Tarjeta>
        <Tarjeta><p style={{ margin: 0, fontSize: 13, color: C.muted, fontWeight: 700 }}>Descuentos aplicados</p><p style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 800 }}>{money(tot.descuentos)}</p><p style={{ margin: '2px 0 0', fontSize: 13, color: C.muted }}>Faltas de lunes a jueves y de la semana pasada</p></Tarjeta>
        <Tarjeta><p style={{ margin: 0, fontSize: 13, color: C.muted, fontWeight: 700 }}>Pasa a la próxima semana</p><p style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 800 }}>{money(tot.pasaProxima)}</p><p style={{ margin: '2px 0 0', fontSize: 13, color: C.muted }}>Faltas de viernes y sábado</p></Tarjeta>
      </div>

      {obs.length > 0 && <div style={{ marginBottom: 14 }}><NotaIA titulo="Lo que la IA encontró en la semana"><ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>{obs.map((o, i) => <li key={i}>{o}</li>)}</ul></NotaIA></div>}

      <Tarjeta>
        <Tabla minWidth={980} columnas={[
          { texto: 'Persona' }, { texto: 'Estado' }, ...DIAS.map(d => ({ texto: d })), { texto: 'Sueldo semana', derecha: true }, { texto: 'Descuentos', derecha: true }, { texto: 'A pagar', derecha: true },
        ]}>
          {cuadrilla.map(t => {
            const c = calcularNomina(t);
            return (
              <tr key={t.id} style={{ opacity: t.estado === 'baja' ? 0.55 : 1 }}>
                <td style={celda}><strong>{t.nombre}</strong><br /><span style={{ fontSize: 12, color: C.muted }}>{t.puesto} · {nombreFrente(t.frente)} · {money(t.salarioDiario)}/día</span></td>
                <td style={celda}>
                  {editable ? (
                    <select aria-label={`Estado de ${t.nombre}`} value={t.estado} onChange={e => dispatch({ tipo: 'estado-trabajador', id: t.id, estado: e.target.value as EstadoTrabajador })} style={{ ...estiloInput, minHeight: 34, padding: '4px 8px', fontSize: 13, width: 112 }}>
                      {Object.entries(ESTADO_T).map(([k, v]) => <option key={k} value={k}>{v.texto}</option>)}
                    </select>
                  ) : <Chip tono={ESTADO_T[t.estado].tono} texto={ESTADO_T[t.estado].texto} />}
                </td>
                {t.asistencia.map((m, i) => (
                  <td key={i} style={{ ...celda, background: i > DIA_CORTE ? '#fbfaf3' : undefined }}>
                    <CeldaDia valor={m} editable={editable && t.estado !== 'baja'} onClick={() => dispatch({ tipo: 'marcar', trabajadorId: t.id, dia: i, valor: ciclo(m) })} />
                  </td>
                ))}
                <td style={celdaDer}>{t.estado === 'baja' ? '—' : money(t.estado === 'standby' ? c.bruto : 6 * t.salarioDiario)}</td>
                <td style={{ ...celdaDer, color: c.descuentoFaltas + c.arrastre > 0 ? C.red : C.muted }}>
                  {c.descuentoFaltas + c.arrastre > 0 ? `−${money(c.descuentoFaltas + c.arrastre)}` : '—'}
                  {c.pasaProxima > 0 && <><br /><span style={{ fontSize: 11, color: C.amber }}>+{money(c.pasaProxima)} la próxima</span></>}
                </td>
                <td style={{ ...celdaDer, fontWeight: 800 }}>{t.estado === 'baja' ? '—' : money(c.neto)}</td>
              </tr>
            );
          })}
        </Tabla>
        <p style={{ fontSize: 12, color: C.muted, margin: '10px 0 0' }}>
          {editable ? 'Toque un día para cambiarlo: ✓ asistió, F faltó, · sin registro. ' : ''}Las columnas de viernes y sábado (fondo claro) ya no alcanzan a descontarse antes de pagar: pasan solas a la semana siguiente. Las cuotas e impuestos de ley se configuran con su contador.
        </p>
      </Tarjeta>

      {alta && <ModalAlta onCerrar={() => setAlta(false)} onAlta={d => { dispatch({ tipo: 'alta', ...d }); setAlta(false); avisar(`${d.nombre} quedó dado de alta. Aparece en el pase de lista del residente.`); }} />}
      {banco && (
        <Modal titulo="Archivo para el banco" subtitulo="Un solo archivo con el pago de toda la cuadrilla, en el formato de su banco." onCerrar={() => setBanco(false)} ancho={620}>
          <Tabla minWidth={420} columnas={[{ texto: 'Persona' }, { texto: 'Cuenta' }, { texto: 'Monto', derecha: true }]}>
            {tot.calc.filter(x => x.c.neto > 0).map(({ t, c }) => (
              <tr key={t.id}><td style={celda}>{t.nombre}</td><td style={celda}>•••• {t.cuenta}</td><td style={celdaDer}>{money(c.neto)}</td></tr>
            ))}
          </Tabla>
          <p style={{ textAlign: 'right', fontWeight: 800, margin: '10px 0' }}>Total a dispersar {money(tot.neto)}</p>
          <Boton onClick={() => { dispatch({ tipo: 'dispersar' }); setBanco(false); avisar('En la plataforma real se descarga el archivo para subirlo al banco. Las faltas de mañana se descontarán la próxima semana.'); }}><Landmark size={16} /> Descargar archivo</Boton>
        </Modal>
      )}
    </div>
  );
}

function ModalAlta({ onCerrar, onAlta }: { onCerrar: () => void; onAlta: (d: { nombre: string; puesto: string; frente: FrenteId; salarioDiario: number }) => void }) {
  const [nombre, setNombre] = useState('');
  const [puesto, setPuesto] = useState('Ayudante');
  const [frente, setFrente] = useState<FrenteId>('v1');
  const [salario, setSalario] = useState('420');
  return (
    <Modal titulo="Dar de alta" subtitulo="Lo normal es el lunes; queda marcado como nuevo." onCerrar={onCerrar}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
        <Campo id="alta-nombre" label="Nombre"><input id="alta-nombre" value={nombre} onChange={e => setNombre(e.target.value)} style={estiloInput} /></Campo>
        <Campo id="alta-puesto" label="Puesto">
          <select id="alta-puesto" value={puesto} onChange={e => { setPuesto(e.target.value); setSalario(e.target.value === 'Ayudante' ? '420' : e.target.value === 'Cabo de obra' ? '850' : '650'); }} style={estiloInput}>
            {['Ayudante', 'Oficial albañil', 'Fierrero', 'Carpintero', 'Cabo de obra'].map(p => <option key={p}>{p}</option>)}
          </select>
        </Campo>
        <Campo id="alta-frente" label="Frente"><select id="alta-frente" value={frente} onChange={e => setFrente(e.target.value as FrenteId)} style={estiloInput}>{FRENTES.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}</select></Campo>
        <Campo id="alta-salario" label="Salario por día"><input id="alta-salario" type="number" value={salario} onChange={e => setSalario(e.target.value)} style={estiloInput} /></Campo>
      </div>
      <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
        <Boton disabled={!nombre} onClick={() => onAlta({ nombre, puesto, frente, salarioDiario: Number(salario) || 0 })}>Dar de alta</Boton>
      </div>
    </Modal>
  );
}
