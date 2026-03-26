import { useState } from 'react';
import { ThreeStage } from './components/3d/ThreeStage';
import { AIChatPanel } from './components/chat/AIChatPanel';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import './index.css';

function App() {
  const [currentCar, setCurrentCar] = useState('2024 MCL38');
  const [isExploded, setIsExploded] = useState(false);
  const [company, setCompany] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(true);

  return (
    <>
      {showOnboarding && (
        <OnboardingWizard 
          onComplete={(name) => {
            setCompany(name);
            setShowOnboarding(false);
          }} 
        />
      )}
      <div className="app-container">
      
      {/* Left Panel: AI Mechanic */}
      <aside className="ai-panel glass-panel">
        <div className="p-6 border-b" style={{ borderColor: 'var(--border-light)', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--accent-mclaren)' }}>Mac</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Chief Race Mechanic</p>
        </div>
        
        <div className="flex-grow p-4" style={{ flexGrow: 1, padding: '1rem', display: 'flex', flexDirection: 'column' }}>
           <AIChatPanel currentCar={currentCar} isExploded={isExploded} company={company} />
        </div>
      </aside>

      {/* Main Stage: 3D Canvas & Overlays */}
      <main className="canvas-container">
        
        {/* R3F Canvas */}
        <div style={{ width: '100%', height: '100%' }}>
            <ThreeStage currentCar={currentCar} isExploded={isExploded} company={company} />
        </div>

        {/* Floating UI Layer */}
        <div className="overlay-ui">
          
          {/* Top Bar (Info & Controls) */}
          <header style={{ pointerEvents: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="badge badge-outline" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Telemetry Active</div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                {currentCar}
              </h1>
              <p style={{ color: 'var(--text-muted)', maxWidth: '400px', lineHeight: '1.5' }}>
                Inspect the internal packaging and aerodynamic structures of the selected chassis.
              </p>
            </div>
            
            <div className="glass-panel" style={{ padding: '1rem', borderRadius: '8px', display: 'flex', gap: '1rem' }}>
              <button 
                className={`btn ${isExploded ? 'btn-primary' : ''}`}
                onClick={() => setIsExploded(!isExploded)}
              >
                {isExploded ? 'Reconstruct Chassis' : 'Explode View'}
              </button>
            </div>
          </header>

          {/* Bottom Bar (Carousel) */}
          <footer style={{ pointerEvents: 'auto', display: 'flex', justifyContent: 'center' }}>
             <div className="glass-panel" style={{ padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem' }}>
                {['1988 MP4/4', '1998 MP4/13', '2008 MP4-23', '2024 MCL38'].map(car => (
                  <button 
                    key={car}
                    className={`btn ${currentCar === car ? 'btn-primary' : ''}`}
                    onClick={() => setCurrentCar(car)}
                    style={{ minWidth: '140px' }}
                  >
                    {car}
                  </button>
                ))}
             </div>
          </footer>
        </div>
      </main>
      
    </div>
  </>
  );
}

export default App;
