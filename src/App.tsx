import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home           = lazy(() => import('./pages/Home'));
const StunetProposal   = lazy(() => import('./pages/StunetProposal'));
const ConnectyProposal = lazy(() => import('./pages/ConnectyProposal'));
const DePaseoProposal  = lazy(() => import('./pages/DePaseoProposal'));

function Loader() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#030d1a',
    }}>
      <div style={{
        width: 40, height: 40, border: '3px solid rgba(0,191,165,.2)',
        borderTopColor: '#00bfa5', borderRadius: '50%', animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/"                     element={<Home />} />
          <Route path="/stunet"               element={<StunetProposal />} />
          <Route path="/conecty"              element={<ConnectyProposal />} />
          <Route path="/depaseo"             element={<DePaseoProposal />} />
          {/* Patrón para futuras propuestas: /:slug */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
