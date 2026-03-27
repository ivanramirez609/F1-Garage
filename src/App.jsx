import { useState } from 'react';
import { ThreeStage } from './components/3d/ThreeStage';
import { AIChatPanel } from './components/chat/AIChatPanel';
import './index.css';

function App() {
  const [currentCar, setCurrentCar] = useState('Yardley McLaren M23');
  const [isExploded, setIsExploded] = useState(false);
  const [customColor, setCustomColor] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="app-container">
      
      {/* Left Panel: AI Mechanic */}
      <aside className="ai-panel glass-panel">
        <div className="p-6 border-b" style={{ borderColor: 'var(--border-light)', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--accent-mclaren)' }}>Mac</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Chief Race Mechanic</p>
        </div>
        
        <div className="flex-grow p-4" style={{ flexGrow: 1, padding: '1rem', display: 'flex', flexDirection: 'column' }}>
           <AIChatPanel currentCar={currentCar} isExploded={isExploded} />
        </div>
      </aside>

      {/* Main Stage: 3D Canvas & Overlays */}
      <main className="canvas-container">
        
        {/* R3F Canvas */}
        <div style={{ width: '100%', height: '100%' }}>
            <ThreeStage currentCar={currentCar} isExploded={isExploded} customColor={customColor} showHistory={showHistory} />
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
            
            <div className="glass-panel" style={{ padding: '1rem', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <select 
                value={customColor} 
                onChange={(e) => setCustomColor(e.target.value)}
                className="btn glass-panel"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)', padding:'0.5rem', borderRadius:'8px' }}
              >
                <option value="" style={{ color: 'black' }}>Original Era Color</option>
                <option value="googley" style={{ color: 'black' }}>Googley</option>
              </select>
              {currentCar === 'McLaren-Mercedes MP4/10' && (
                <button 
                  className={`btn ${showHistory ? 'btn-primary' : ''}`}
                  onClick={() => setShowHistory(!showHistory)}
                >
                  {showHistory ? 'Hide History' : 'Show History'}
                </button>
              )}
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
                {['Yardley McLaren M23', 'McLaren-Mercedes MP4/10', 'McLaren MP4-13'].map(car => (
                  <button 
                    key={car}
                    className={`btn ${currentCar === car ? 'btn-primary' : ''}`}
                    onClick={() => {
                      setCurrentCar(car);
                      setShowHistory(false);
                    }}
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
  );
}

export default App;
