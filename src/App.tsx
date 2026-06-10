import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home           = lazy(() => import('./pages/Home'));
const StunetProposal   = lazy(() => import('./pages/StunetProposal'));
const ConnectyProposal = lazy(() => import('./pages/ConnectyProposal'));
const DePaseoProposal        = lazy(() => import('./pages/DePaseoProposal'));
const HotelCasaRuedaProposal = lazy(() => import('./pages/HotelCasaRuedaProposal'));
const MizarProposal          = lazy(() => import('./pages/MizarProposal'));
const AnatoProposal          = lazy(() => import('./pages/AnatoProposal'));
const AnatoDeck              = lazy(() => import('./pages/AnatoDeck'));
const VisitAntioquiaProposal = lazy(() => import('./pages/VisitAntioquiaProposal'));
const GrupoMimiProposal      = lazy(() => import('./pages/GrupoMimiProposal'));
const ProcurementProProposal = lazy(() => import('./pages/ProcurementProProposal'));
const ViajesCapitalProposal    = lazy(() => import('./pages/ViajesCapitalProposal'));
const TravelSolPlayaProposal   = lazy(() => import('./pages/TravelSolPlayaProposal'));
const MpmProposal            = lazy(() => import('./pages/MpmProposal'));
const TravelSolPlayaProposalV2 = lazy(() => import('./pages/TravelSolPlayaProposalV2'));
const ConnectyProposalV2       = lazy(() => import('./pages/ConnectyProposalV2'));
const VuelaALaVidaProposal     = lazy(() => import('./pages/VuelaALaVidaProposal'));
const TuViviProposal           = lazy(() => import('./pages/TuViviProposal'));
const MetropolitanTouringProposal = lazy(() => import('./pages/MetropolitanTouringProposal'));
const NutsportProposal            = lazy(() => import('./pages/NutsportProposal'));
const VerticalServicesProposal    = lazy(() => import('./pages/VerticalServicesProposal'));
const ClinicaMagneticaProposal    = lazy(() => import('./pages/ClinicaMagneticaProposal'));
const MotionMindsProposal         = lazy(() => import('./pages/MotionMindsProposal'));

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
          <Route path="/depaseo"              element={<DePaseoProposal />} />
          <Route path="/hotel-casa-rueda"     element={<HotelCasaRuedaProposal />} />
          <Route path="/mizar"                element={<MizarProposal />} />
          <Route path="/anato"                element={<AnatoProposal />} />
          <Route path="/anato-deck"           element={<AnatoDeck />} />
          <Route path="/visitantioquia"       element={<VisitAntioquiaProposal />} />
          <Route path="/grupo-mimi"           element={<GrupoMimiProposal />} />
          <Route path="/procurement-pro"     element={<ProcurementProProposal />} />
          <Route path="/viajes-capital"        element={<ViajesCapitalProposal />} />
          <Route path="/travel-sol-playa"    element={<TravelSolPlayaProposal />} />
          <Route path="/mpm"                  element={<MpmProposal />} />
          <Route path="/travel-sol-playa-v2" element={<TravelSolPlayaProposalV2 />} />
          <Route path="/conecty-v2"          element={<ConnectyProposalV2 />} />
          <Route path="/vuela-a-la-vida"     element={<VuelaALaVidaProposal />} />
          <Route path="/tuvivi"             element={<TuViviProposal />} />
          <Route path="/metropolitan-touring" element={<MetropolitanTouringProposal />} />
          <Route path="/nutsport"             element={<NutsportProposal />} />
          <Route path="/vertical-services"    element={<VerticalServicesProposal />} />
          <Route path="/clinica-magnetica"    element={<ClinicaMagneticaProposal />} />
          <Route path="/motion-minds"         element={<MotionMindsProposal />} />
          {/* Patrón para futuras propuestas: /:slug */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
