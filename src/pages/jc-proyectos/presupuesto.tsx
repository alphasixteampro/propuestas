// Presupuesto de materiales: la explosión de insumos de Opus con lo recibido, lo que viene en camino y
// lo que queda. Cada recepción en obra lo actualiza sola.
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { C, Chip, Tarjeta, Titulo, Boton, Modal, Tabla, celda, celdaDer, NotaIA, Pestanas, Barra, TONOS } from './ui';
import { FRENTES, INSUMOS, insumo, nombreFrente, money, num, pct, tonoUso, EstadoLinea, FrenteId, ResumenPrograma } from './datos';

export function alertasConsumo(presupuesto: EstadoLinea[], programa: ResumenPrograma): string[] {
  const out: string[] = [];
  for (const f of programa.porFrente) {
    const cem = presupuesto.find(l => l.insumoId === 'cem' && l.frente === f.frente)!;
    const uso = ((cem.recibido) / cem.presupuestado) * 100;
    if (uso - f.estructura > 15) {
      out.push(`${nombreFrente(f.frente)} lleva ${Math.round(f.estructura)} % de su obra negra (cimentación, muros y losas) pero ya recibió ${Math.round(uso)} % de su cemento. Puede ser desperdicio, material guardado o un error en el presupuesto: vale la pena revisarlo esta semana.`);
    }
  }
  for (const l of presupuesto) {
    if (l.usoPct > 100) out.push(`${insumo(l.insumoId).nombre} en ${nombreFrente(l.frente)} ya se pasó del presupuesto (${pct(l.usoPct)}).`);
  }
  return out;
}

export function SeccionPresupuesto({ presupuesto, programa, avisar }: { presupuesto: EstadoLinea[]; programa: ResumenPrograma; avisar: (m: string) => void }) {
  const [frente, setFrente] = useState<FrenteId | 'todos'>('todos');
  const [opus, setOpus] = useState(false);
  const lineas = frente === 'todos'
    ? INSUMOS.map(ins => {
      const ls = presupuesto.filter(l => l.insumoId === ins.id);
      const sum = (k: keyof EstadoLinea) => ls.reduce((s, l) => s + (l[k] as number), 0);
      const presupuestado = sum('presupuestado');
      return { insumoId: ins.id, presupuestado, recibido: sum('recibido'), porRecibir: sum('porRecibir'), porAprobar: sum('porAprobar'), disponible: sum('disponible'), usoPct: ((sum('recibido') + sum('porRecibir')) / presupuestado) * 100, ejercido: sum('ejercido'), montoPresupuesto: sum('montoPresupuesto') };
    })
    : presupuesto.filter(l => l.frente === frente);

  const totalPresupuesto = lineas.reduce((s, l) => s + l.montoPresupuesto, 0);
  const totalEjercido = lineas.reduce((s, l) => s + l.ejercido, 0);
  const totalCamino = lineas.reduce((s, l) => s + l.porRecibir * insumo(l.insumoId).precio, 0);
  const alertas = alertasConsumo(presupuesto, programa);

  return (
    <div>
      <Titulo titulo="Presupuesto e insumos" sub="La explosión de insumos de Opus, viva: cada material que llega a la obra se descuenta solo, por villa y por insumo.">
        <Boton variante="secundario" onClick={() => setOpus(true)}><Upload size={16} /> Actualizar desde Opus</Boton>
      </Titulo>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 14 }}>
        <Tarjeta><p style={{ margin: 0, fontSize: 13, color: C.muted, fontWeight: 700 }}>Presupuesto de materiales</p><p style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 800 }}>{money(totalPresupuesto)}</p></Tarjeta>
        <Tarjeta><p style={{ margin: 0, fontSize: 13, color: C.muted, fontWeight: 700 }}>Ya llegó a la obra</p><p style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 800 }}>{money(totalEjercido)}</p><p style={{ margin: '2px 0 0', fontSize: 13, color: C.muted }}>{pct((totalEjercido / totalPresupuesto) * 100)} del presupuesto</p></Tarjeta>
        <Tarjeta><p style={{ margin: 0, fontSize: 13, color: C.muted, fontWeight: 700 }}>Comprado, en camino</p><p style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 800 }}>{money(totalCamino)}</p></Tarjeta>
        <Tarjeta><p style={{ margin: 0, fontSize: 13, color: C.muted, fontWeight: 700 }}>Libre para comprar</p><p style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 800 }}>{money(totalPresupuesto - totalEjercido - totalCamino)}</p></Tarjeta>
      </div>

      {alertas.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <NotaIA titulo="Consumo contra avance de obra">
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>{alertas.map((a, i) => <li key={i}>{a}</li>)}</ul>
          </NotaIA>
        </div>
      )}

      <Tarjeta>
        <Pestanas opciones={[{ id: 'todos' as const, texto: 'Toda la obra' }, ...FRENTES.map(f => ({ id: f.id, texto: f.nombre }))]} valor={frente} onCambiar={setFrente} />
        <Tabla minWidth={820} columnas={[
          { texto: 'Insumo' }, { texto: 'Presupuestado', derecha: true }, { texto: 'Ya llegó', derecha: true }, { texto: 'En camino', derecha: true },
          { texto: 'Queda', derecha: true }, { texto: 'Uso' }, { texto: 'Por aprobar', derecha: true },
        ]}>
          {lineas.map(l => {
            const ins = insumo(l.insumoId);
            const tono = tonoUso(l.usoPct);
            return (
              <tr key={l.insumoId}>
                <td style={celda}><strong>{ins.nombre}</strong><br /><span style={{ fontSize: 12, color: C.muted }}>{ins.clave} · {ins.unidad}</span></td>
                <td style={celdaDer}>{num(l.presupuestado)}</td>
                <td style={celdaDer}>{num(l.recibido)}</td>
                <td style={celdaDer}>{l.porRecibir > 0 ? num(l.porRecibir) : '—'}</td>
                <td style={{ ...celdaDer, fontWeight: 700, color: l.disponible < 0 ? C.red : C.ink }}>{num(l.disponible)}</td>
                <td style={{ ...celda, minWidth: 140 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Barra valor={l.usoPct} color={TONOS[tono].fg} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: TONOS[tono].fg, minWidth: 42, textAlign: 'right' }}>{pct(l.usoPct)}</span>
                  </div>
                </td>
                <td style={celdaDer}>{l.porAprobar > 0 ? <Chip tono={l.porAprobar > l.disponible ? 'red' : 'amber'} texto={num(l.porAprobar)} /> : '—'}</td>
              </tr>
            );
          })}
        </Tabla>
        <p style={{ fontSize: 12, color: C.muted, margin: '10px 0 0' }}>"Uso" suma lo que ya llegó y lo que viene en camino. Verde: menos de 85 %. Ámbar: de 85 % a 100 %. Rojo: se pasó del presupuesto.</p>
      </Tarjeta>

      {opus && (
        <Modal titulo="Actualizar desde Opus" subtitulo="Se sube la explosión de insumos que exporta Opus (Excel). El sistema compara y muestra qué cambia antes de aplicarlo." onCerrar={() => setOpus(false)} ancho={640}>
          <div style={{ border: `2px dashed ${C.lineStrong}`, borderRadius: 10, padding: 16, textAlign: 'center', marginBottom: 12 }}>
            <p style={{ margin: 0, fontWeight: 700 }}>Explosión de insumos · Residencial Las Villas.xlsx</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: C.muted }}>Archivo de ejemplo leído: {INSUMOS.length} insumos · {FRENTES.length} frentes</p>
          </div>
          <Tabla minWidth={460} columnas={[{ texto: 'Qué encontró' }, { texto: 'Resultado' }]}>
            <tr><td style={celda}>Insumos que ya estaban</td><td style={celda}><Chip tono="green" texto={`${INSUMOS.length - 1} sin cambios`} /></td></tr>
            <tr><td style={celda}>Precio actualizado</td><td style={celda}><Chip tono="amber" texto="Varilla 3/8″: $21,500 → $21,900" /></td></tr>
            <tr><td style={celda}>Insumos nuevos</td><td style={celda}><Chip tono="muted" texto="Ninguno" /></td></tr>
          </Tabla>
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
            <Boton onClick={() => { setOpus(false); avisar('En la plataforma real aquí se aplica el cambio. En esta demo el presupuesto se queda igual.'); }}>Aplicar cambios</Boton>
          </div>
        </Modal>
      )}
    </div>
  );
}
