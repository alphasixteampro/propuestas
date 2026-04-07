import { Link } from 'react-router-dom';
import { FileText, ExternalLink, Calendar, Building2, Tag } from 'lucide-react';

interface Proposal {
  slug: string;
  cliente: string;
  sector: string;
  fecha: string;
  monto: string;
  estado: 'activa' | 'enviada' | 'cerrada' | 'borrador';
  path: string;
}

const PROPOSALS: Proposal[] = [
  {
    slug: 'stunet',
    cliente: 'Stunet Education Agency',
    sector: 'Agencia de educación internacional',
    fecha: 'Marzo 2026',
    monto: 'COP 11.200.000',
    estado: 'activa',
    path: '/stunet',
  },
  {
    slug: 'conecty',
    cliente: 'Conecty',
    sector: 'Telecomunicaciones · SIM & eSIM para viajeros',
    fecha: 'Abril 2026',
    monto: 'COP 17.988.000',
    estado: 'borrador',
    path: '/conecty',
  },
];

const ESTADO_STYLE: Record<Proposal['estado'], { label: string; bg: string; color: string }> = {
  activa:  { label: 'Activa',   bg: 'rgba(0,191,165,.12)',  color: '#00bfa5' },
  enviada: { label: 'Enviada',  bg: 'rgba(29,112,162,.15)', color: '#60b4f0' },
  cerrada: { label: 'Cerrada',  bg: 'rgba(255,255,255,.06)', color: '#888' },
  borrador:{ label: 'Borrador', bg: 'rgba(251,191,36,.1)',   color: '#fbbf24' },
};

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#030d1a', fontFamily: 'Lato, sans-serif' }}>

      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(29,112,162,.2)',
        padding: '0 2rem',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(3,13,26,.9)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #1d70a2, #00bfa5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileText size={16} color="#fff" />
          </div>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff' }}>
            Sixteam<span style={{ color: '#00bfa5' }}>.pro</span>
          </span>
          <span style={{
            fontSize: 11, color: 'rgba(255,255,255,.4)', marginLeft: 4,
            borderLeft: '1px solid rgba(255,255,255,.1)', paddingLeft: 10,
          }}>Propuestas</span>
        </div>

        <a
          href="https://sixteam.pro"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: 'rgba(255,255,255,.5)',
            textDecoration: 'none', transition: 'color .2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#00bfa5')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.5)')}
        >
          <ExternalLink size={12} />
          sixteam.pro
        </a>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontSize: 11, color: '#00bfa5', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
            Sistema de propuestas comerciales
          </p>
          <h1 style={{
            fontFamily: 'Poppins, sans-serif', fontWeight: 800,
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: '#fff', margin: 0,
          }}>
            Propuestas activas
          </h1>
          <p style={{ color: 'rgba(255,255,255,.5)', marginTop: 8, fontSize: 14 }}>
            {PROPOSALS.length} propuesta{PROPOSALS.length !== 1 ? 's' : ''} · uso interno Sixteam.pro
          </p>
        </div>

        {/* Proposals list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PROPOSALS.map((p) => {
            const est = ESTADO_STYLE[p.estado];
            return (
              <Link
                key={p.slug}
                to={p.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  background: 'rgba(29,112,162,.07)',
                  border: '1px solid rgba(29,112,162,.2)',
                  borderRadius: 12, padding: '18px 20px',
                  textDecoration: 'none', transition: 'all .2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(29,112,162,.12)';
                  e.currentTarget.style.borderColor = 'rgba(0,191,165,.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(29,112,162,.07)';
                  e.currentTarget.style.borderColor = 'rgba(29,112,162,.2)';
                }}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: 12,
                  background: p.slug === 'conecty' ? 'transparent' : 'rgba(29,112,162,.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  overflow: 'hidden'
                }}>
                  {p.slug === 'conecty' ? (
                    <img src="/logo-webp_180x_2x-removebg-preview.png" alt="Conecty" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : p.slug === 'stunet' ? (
                    <img src="/stunet-logo.png" alt="Stunet" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <Building2 size={20} color="#1d70a2" />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>
                    {p.cliente}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(255,255,255,.45)' }}>
                      <Tag size={11} /> {p.sector}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(255,255,255,.45)' }}>
                      <Calendar size={11} /> {p.fecha}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 14, color: '#00bfa5', marginBottom: 6 }}>
                    {p.monto}
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999,
                    background: est.bg, color: est.color,
                  }}>
                    {est.label}
                  </span>
                </div>

                <ExternalLink size={15} color="rgba(255,255,255,.25)" style={{ flexShrink: 0 }} />
              </Link>
            );
          })}
        </div>

        {/* Empty state (hidden when proposals exist) */}
        {PROPOSALS.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '4rem 2rem',
            color: 'rgba(255,255,255,.3)', fontSize: 14,
          }}>
            <FileText size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p>Aún no hay propuestas. Agrega la primera en src/pages/Home.tsx</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '2rem',
        fontSize: 12, color: 'rgba(255,255,255,.2)',
        borderTop: '1px solid rgba(29,112,162,.1)',
      }}>
        Sixteam.pro · NIT 901.967.849-4 · alpha@sixteam.pro · Uso interno — no indexado
      </footer>
    </div>
  );
}
