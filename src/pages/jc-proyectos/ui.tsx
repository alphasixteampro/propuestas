// Piezas visuales compartidas de la demo de JC Proyectos: colores, tarjetas, botones, chips y modal.
import React from 'react';
import { X } from 'lucide-react';

export const C = {
  paper: '#ffffff', surface: '#f4f7f9', surfaceStrong: '#e9eff3',
  ink: '#1f2a37', muted: '#5b6675', line: '#dde3ea', lineStrong: '#c2ccd7',
  navy: '#0a2342', navyLight: '#163a63',
  teal: '#00bfa5', tealDark: '#00796b', tealSoft: '#dcf5f1',
  green: '#1f6b4f', greenSoft: '#e1f1e9',
  amber: '#9a5a00', amberSoft: '#fff1d6',
  blue: '#1d5f8a', blueSoft: '#e1eef7',
  red: '#a3362b', redSoft: '#fbe6e3',
  purple: '#5f4a86', purpleSoft: '#ece7f5',
};

export type Tono = 'green' | 'red' | 'amber' | 'blue' | 'purple' | 'muted' | 'teal';
export const TONOS: Record<Tono, { bg: string; fg: string }> = {
  green: { bg: C.greenSoft, fg: C.green }, red: { bg: C.redSoft, fg: C.red },
  amber: { bg: C.amberSoft, fg: C.amber }, blue: { bg: C.blueSoft, fg: C.blue },
  purple: { bg: C.purpleSoft, fg: C.purple }, muted: { bg: C.surfaceStrong, fg: C.muted },
  teal: { bg: C.tealSoft, fg: C.tealDark },
};

export function Chip({ tono, texto }: { tono: Tono; texto: string }) {
  const t = TONOS[tono];
  return (
    <span style={{ background: t.bg, color: t.fg, fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999, display: 'inline-block', whiteSpace: 'nowrap' }}>
      {texto}
    </span>
  );
}

export function Titulo({ titulo, sub, children }: { titulo: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, marginBottom: 18 }}>
      <div>
        <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 24, fontWeight: 700, color: C.ink, margin: 0 }}>{titulo}</h1>
        {sub && <p style={{ fontSize: 14, color: C.muted, margin: '4px 0 0', maxWidth: 720 }}>{sub}</p>}
      </div>
      {children && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{children}</div>}
    </div>
  );
}

export function Tarjeta({ children, style, titulo, tour }: { children: React.ReactNode; style?: React.CSSProperties; titulo?: string; tour?: string }) {
  return (
    <div data-tour={tour} style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 12, padding: 18, boxShadow: '0 1px 2px rgba(20,30,50,.04)', ...style }}>
      {titulo && <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 16, fontWeight: 700, color: C.ink, margin: '0 0 12px' }}>{titulo}</h2>}
      {children}
    </div>
  );
}

export function TarjetaKpi({ icono: Icono, titulo, valor, sub, tono, onClick }: {
  icono: React.ComponentType<any>; titulo: string; valor: string; sub?: string; tono: Tono; onClick?: () => void;
}) {
  const t = TONOS[tono];
  return (
    <button type="button" onClick={onClick} style={{
      textAlign: 'left', background: C.paper, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16,
      boxShadow: '0 1px 2px rgba(20,30,50,.05)', display: 'flex', flexDirection: 'column', gap: 6,
      cursor: onClick ? 'pointer' : 'default', width: '100%', fontFamily: 'inherit',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: t.fg }}>
        <Icono size={18} />
        <span style={{ fontSize: 13, color: C.muted, fontWeight: 700 }}>{titulo}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Poppins, sans-serif', fontVariantNumeric: 'tabular-nums', color: C.ink }}>{valor}</div>
      {sub && <div style={{ fontSize: 13, color: C.muted }}>{sub}</div>}
    </button>
  );
}

export function Boton({ children, onClick, disabled, variante = 'primario', titulo }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; variante?: 'primario' | 'secundario' | 'peligro'; titulo?: string;
}) {
  const estilos: Record<string, React.CSSProperties> = {
    primario: { background: disabled ? C.lineStrong : C.tealDark, color: '#fff', border: 'none' },
    secundario: { background: C.paper, color: C.navy, border: `1px solid ${C.lineStrong}`, opacity: disabled ? 0.5 : 1 },
    peligro: { background: C.paper, color: C.red, border: `1px solid ${C.red}`, opacity: disabled ? 0.5 : 1 },
  };
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={titulo} style={{
      ...estilos[variante], borderRadius: 8, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: '9px 16px', fontWeight: 700, fontSize: 14, minHeight: 40, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
    }}>
      {children}
    </button>
  );
}

export function Campo({ id, label, children, ayuda }: { id: string; label: string; children: React.ReactNode; ayuda?: string }) {
  return (
    <div>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 700, color: C.ink, display: 'block', marginBottom: 4 }}>{label}</label>
      {children}
      {ayuda && <p style={{ fontSize: 12, color: C.muted, margin: '4px 0 0' }}>{ayuda}</p>}
    </div>
  );
}

export const estiloInput: React.CSSProperties = {
  width: '100%', border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: '9px 12px', fontSize: 14, minHeight: 40,
  fontFamily: 'inherit', background: C.paper, color: C.ink,
};

export function Modal({ titulo, subtitulo, onCerrar, children, ancho = 560 }: { titulo: string; subtitulo?: string; onCerrar: () => void; children: React.ReactNode; ancho?: number }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,35,66,.45)', zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }} onClick={onCerrar}>
      <div role="dialog" aria-label={titulo} onClick={e => e.stopPropagation()} style={{ background: C.paper, borderRadius: 14, padding: 20, width: '100%', maxWidth: ancho, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(10,35,66,.35)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 18, fontWeight: 700, color: C.ink, margin: 0 }}>{titulo}</h2>
            {subtitulo && <p style={{ fontSize: 13, color: C.muted, margin: '4px 0 0' }}>{subtitulo}</p>}
          </div>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, minHeight: 40, minWidth: 40 }}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Toast({ mensaje, arriba }: { mensaje: string; arriba?: boolean }) {
  return (
    <div role="status" style={{
      position: 'fixed', ...(arriba ? { top: 124 } : { bottom: 20 }), right: 20, left: 20, marginLeft: 'auto', zIndex: 100, background: C.navy, color: '#fff',
      padding: '14px 18px', borderRadius: 10, boxShadow: '0 8px 24px rgba(10,35,66,.3)', fontSize: 14, fontWeight: 600, maxWidth: 380,
    }}>
      {mensaje}
    </div>
  );
}

// Tabla con scroll horizontal en celular.
export function Tabla({ columnas, children, minWidth = 640 }: { columnas: { texto: string; derecha?: boolean }[]; children: React.ReactNode; minWidth?: number }) {
  return (
    <div style={{ overflowX: 'auto', margin: '0 -4px' }}>
      <table style={{ width: '100%', minWidth, borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            {columnas.map(c => (
              <th key={c.texto} style={{ textAlign: c.derecha ? 'right' : 'left', padding: '8px 8px', fontSize: 12, color: C.muted, fontWeight: 700, borderBottom: `1px solid ${C.line}`, whiteSpace: 'nowrap' }}>{c.texto}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export const celda: React.CSSProperties = { padding: '10px 8px', borderBottom: `1px solid ${C.line}`, verticalAlign: 'middle' };
export const celdaDer: React.CSSProperties = { ...celda, textAlign: 'right', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' };

export function Barra({ valor, tope = 100, color, fondo = C.surfaceStrong, alto = 8 }: { valor: number; tope?: number; color: string; fondo?: string; alto?: number }) {
  return (
    <div style={{ background: fondo, borderRadius: 99, height: alto, overflow: 'hidden', width: '100%' }}>
      <div style={{ width: `${Math.max(0, Math.min(100, (valor / tope) * 100))}%`, background: color, height: '100%', borderRadius: 99 }} />
    </div>
  );
}

// Recuadro de "lo que hace la IA": se usa en varias pantallas para señalar dónde entra la IA.
export function NotaIA({ titulo = 'La IA revisó esto por usted', children }: { titulo?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, #eefbf8, #eef5fb)', border: `1px solid #b9e7df`, borderRadius: 12, padding: 14 }}>
      <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 800, color: C.tealDark, letterSpacing: 0.3 }}>✦ {titulo}</p>
      <div style={{ fontSize: 14, color: C.ink }}>{children}</div>
    </div>
  );
}

export function Pestanas<T extends string>({ opciones, valor, onCambiar }: { opciones: { id: T; texto: string }[]; valor: T; onCambiar: (v: T) => void }) {
  return (
    <div role="tablist" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
      {opciones.map(o => (
        <button key={o.id} type="button" role="tab" aria-selected={valor === o.id} onClick={() => onCambiar(o.id)} style={{
          padding: '8px 14px', borderRadius: 20, border: `1px solid ${valor === o.id ? C.navy : C.lineStrong}`,
          background: valor === o.id ? C.navy : C.paper, color: valor === o.id ? '#fff' : C.ink, fontSize: 13, fontWeight: 700,
          cursor: 'pointer', minHeight: 38, fontFamily: 'inherit',
        }}>{o.texto}</button>
      ))}
    </div>
  );
}
