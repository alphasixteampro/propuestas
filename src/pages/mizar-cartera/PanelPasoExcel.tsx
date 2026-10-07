// Panel «Paso de sus Excel» (módulo 02): antes de cargar el libro, el sistema une lo que está escrito de
// varias formas y deja para revisión de cartera solo lo que no puede unir solo. Datos de ejemplo ficticios.
import React, { useState } from 'react';
import { C, Persona, Sede, Tarjeta, Chip, EstadisticaMini, BotonSecundario } from './base';

interface FilaDepuracion {
  id: string; sede: Sede; que: string; enExcel: string[]; quedaComo: string; automatico: boolean;
}

const FILAS_DEPURACION: FilaDepuracion[] = [
  { id: 'd1', sede: 'Bucaramanga', que: 'Proyecto', enExcel: ['MONTAÑA', 'Mirador de la Montaña', 'LA MESA', 'Hacienda El Pedregal'], quedaComo: 'Mirador de la Montaña (sociedad Hacienda Pedregal)', automatico: true },
  { id: 'd2', sede: 'Bucaramanga', que: 'Proyecto', enExcel: ['CHARTA 1', 'CHARTA 2'], quedaComo: 'Villa Sol 1 (Ictinos) y Villa Sol 2', automatico: true },
  { id: 'd3', sede: 'Bucaramanga', que: 'Dónde entró el dinero', enExcel: ['CUIENTA MIZAR', 'cta bancolombia mizar', 'BANCOLOMBIA MIZAR AHORROS', 'Bcol Mizar'], quedaComo: 'Bancolombia Mizar (las 27 formas del libro quedan en una lista fija)', automatico: true },
  { id: 'd4', sede: 'Bucaramanga', que: 'Dónde entró el dinero', enExcel: ['EFECTIVO', 'efectivo oficina', 'CAJA', 'Efectivo'], quedaComo: 'caja de tesorería', automatico: true },
  { id: 'd5', sede: 'Bucaramanga', que: 'Lote', enExcel: ['LT 31', 'Lote #31', '31 MONTAÑA'], quedaComo: 'Lote 31 · Mirador de la Montaña', automatico: true },
  { id: 'd6', sede: 'Bucaramanga', que: 'Cliente', enExcel: ['Luz Marina Becerra, CC 63.481.207', 'Luz Marina Becerra, CC 63.481.270'], quedaComo: 'Una sola ficha: la cédula se digitó distinto', automatico: false },
  { id: 'd7', sede: 'Bucaramanga', que: 'Quién paga', enExcel: ['Ramiro Becerra paga las cuotas del lote 31'], quedaComo: 'Encargado de pagos de Luz Marina Becerra (no es otro cliente)', automatico: false },
  { id: 'd8', sede: 'Bucaramanga', que: 'Vendedor', enExcel: ['Yesica Ruiz', 'Jesica Ruíz'], quedaComo: 'Yésica Ruiz', automatico: false },
  { id: 'd9', sede: 'Bucaramanga', que: 'Día de corte', enExcel: ['Lote 12', 'Mirador de la Montaña', 'sin día anotado'], quedaComo: 'Día 14, el de la primera cuota que pagó', automatico: false },
  { id: 'd10', sede: 'Bucaramanga', que: 'Referencia', enExcel: ['Pagos antiguos sin número de recibo ni referencia'], quedaComo: 'Se cargan como «histórico sin referencia»; desde el arranque ningún pago entra sin ella', automatico: true },
  { id: 'd11', sede: 'Cúcuta', que: 'Pagos anteriores', enExcel: ['Pagos de la administración anterior (Drive)'], quedaComo: 'Se cargan marcados «administración anterior»: cuentan para el saldo, no como recaudo', automatico: true },
  { id: 'd12', sede: 'Cúcuta', que: 'Lote', enExcel: ['MZ 2 LT 19', 'Mz2-L19'], quedaComo: 'Lote M2-19 · Miraflor', automatico: true },
];

const celda: React.CSSProperties = { padding: '8px 6px', verticalAlign: 'top' };

export function PanelPasoExcel({ persona, onToast }: { persona: Persona; onToast: (m: string) => void }) {
  const [abierta, setAbierta] = useState(false);
  // Lo que cartera ya revisó: id de la fila → quién lo aprobó.
  const [revisadas, setRevisadas] = useState<Record<string, string>>({});
  const filas = FILAS_DEPURACION.filter(f => !persona.sede || f.sede === persona.sede);
  const verCifras = persona.sede !== 'Cúcuta';

  function aprobar(f: FilaDepuracion) {
    setRevisadas(prev => ({ ...prev, [f.id]: persona.nombre }));
    onToast(`Revisado por ${persona.nombre}: «${f.que}» ya queda unido para la carga.`);
  }

  return (
    <Tarjeta>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
        <div style={{ maxWidth: 640 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: C.ink, margin: '0 0 4px' }}>Paso de sus Excel</p>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
            Antes de cargar, el sistema une lo que está escrito de varias formas; cartera solo revisa lo que no puede unir solo.
          </p>
        </div>
        <BotonSecundario onClick={() => onToast('En la plataforma real se sube el Excel y aparece esta revisión antes de cargar nada.')}>Simular carga del libro</BotonSecundario>
      </div>

      {verCifras && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, margin: '0 0 8px' }}>Libro de dineros recibidos de Bucaramanga</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10 }}>
            <EstadisticaMini titulo="Personas que pagan en el libro" valor="165" />
            <EstadisticaMini titulo="Clientes en la base de datos" valor="92" />
            <EstadisticaMini titulo="Están en los dos" valor="80" />
            <EstadisticaMini titulo="Nombres con más de una cédula" valor="23" tono={C.amber} />
          </div>
        </div>
      )}

      <BotonSecundario onClick={() => setAbierta(v => !v)}>{abierta ? 'Ocultar la depuración' : `Ver la depuración (${filas.length})`}</BotonSecundario>

      {abierta && (
        <div style={{ overflowX: 'auto', marginTop: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 760 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.line}` }}>
                <th style={celda}>Qué</th><th style={celda}>En el Excel</th><th style={celda}>Queda como</th><th style={celda}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filas.map(f => (
                <tr key={f.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                  <td style={celda}><Chip tono="blue" texto={f.que} /></td>
                  <td style={{ ...celda, color: C.muted }}>{f.enExcel.join(' · ')}</td>
                  <td style={{ ...celda, color: C.ink, fontWeight: 600 }}>{f.quedaComo}</td>
                  <td style={celda}>
                    {f.automatico ? <Chip tono="green" texto="Unido solo" />
                      : revisadas[f.id] ? <Chip tono="green" texto={`Revisado por ${revisadas[f.id]}`} />
                        : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <Chip tono="amber" texto="Por revisar" />
                            <BotonSecundario onClick={() => aprobar(f)}>Aprobar</BotonSecundario>
                          </div>
                        )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p style={{ fontSize: 12, color: C.muted, margin: '10px 0 0' }}>Los nombres y las cédulas de los ejemplos son ficticios.</p>
    </Tarjeta>
  );
}
