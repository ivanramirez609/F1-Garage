import { useState } from 'react';

export function OnboardingWizard({ onComplete }) {
  const [step, setStep] = useState(1);
  const [company, setCompany] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (company.trim()) {
      onComplete(company.trim());
    }
  };

  return (
    <div className="fullscreen-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(15, 17, 21, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      color: 'var(--text-main)'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '500px',
        padding: '3rem',
        borderRadius: '16px',
        textAlign: 'center',
        border: '1px solid rgba(255, 128, 0, 0.2)',
        boxShadow: '0 0 50px rgba(255, 128, 0, 0.1)'
      }}>
        
        {step === 1 && (
          <div className="fade-in">
            <div style={{ marginBottom: '1.5rem' }}>
               <div className="badge badge-outline" style={{ display: 'inline-block', marginBottom: '0.5rem' }}>Security Clearance required</div>
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--accent-mclaren)' }}>
              Welcome to the McLaren Tech Center
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
              Before we take you inside the garage to inspect the chassis, we need to log your visitor credentials for the team principal.
            </p>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1rem' }}
              onClick={() => setStep(2)}
            >
              Initialize Onboarding
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Identify Your Position</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              Mac likes to know who's poking around his suspension links.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-mclaren)' }}>
                  Company / Racing Team Team name
                </label>
                <input 
                  type="text" 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Mercedes, Scuderia Ferrari, Google"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255, 128, 0, 0.3)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    boxSizing: 'border-box'
                  }}
                  autoFocus
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '1rem' }}
                disabled={!company.trim()}
              >
                Grant Credentials
              </button>
            </form>
          </div>
        )}

      </div>

      <style>{`
        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
