import React, { useState, useEffect } from 'react';
import './../index.css';

export function OnboardingWizard({ onComplete }) {
  const [company, setCompany] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Fade in on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (company.trim()) {
      setIsFadingOut(true);
      // Wait for fade out animation before calling onComplete
      setTimeout(() => {
        onComplete(company.trim());
      }, 500);
    }
  };

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, /* Ensure it is above everything else */
    backgroundColor: '#0a0a0c',
    backgroundImage: `
      radial-gradient(circle at 50% 0%, rgba(255, 128, 0, 0.15) 0%, transparent 50%),
      repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 10px)
    `,
    opacity: isFadingOut ? 0 : (isVisible ? 1 : 0),
    transition: 'opacity 0.5s ease',
  };

  const formCardStyle = {
    padding: '3.5rem',
    borderRadius: '4px', // Harder technical edges
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '550px',
    width: '90%',
    textAlign: 'center',
    background: 'linear-gradient(145deg, #161922, #0d0f15)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderTop: '4px solid var(--accent-mclaren)',
    borderBottom: '4px solid #111',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
    transform: isFadingOut ? 'scale(0.95) translateY(20px)' : (isVisible ? 'scale(1) translateY(0)' : 'scale(1.05) translateY(-20px)'),
    transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
  };

  const inputStyle = {
    width: '100%',
    padding: '1.2rem',
    marginTop: '2.5rem',
    marginBottom: '2rem',
    background: '#050608',
    border: '1px solid rgba(255, 128, 0, 0.3)',
    borderRadius: '4px',
    color: 'var(--accent-mclaren)',
    fontFamily: '"Orbitron", monospace',
    fontSize: '1.4rem',
    letterSpacing: '2px',
    outline: 'none',
    textAlign: 'center',
    textTransform: 'uppercase',
    transition: 'all 0.3s ease',
    boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.6)'
  };
  
  const buttonStyle = {
    width: '100%',
    padding: '1.2rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    background: company.trim() ? 'linear-gradient(to right, #ff8000, #ff4000)' : '#222',
    color: company.trim() ? '#fff' : '#555',
    border: 'none',
    borderRadius: '4px',
    cursor: company.trim() ? 'pointer' : 'not-allowed',
    boxShadow: company.trim() ? '0 0 20px rgba(255, 128, 0, 0.4)' : 'none',
    transition: 'all 0.3s ease',
    fontFamily: '"Orbitron", sans-serif'
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <div className="badge" style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)', color: '#ff4444', border: '1px solid #ff4444', marginBottom: '1.5rem', letterSpacing: '2px' }}>
          RESTRICTED AREA
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', color: '#fff', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
          Pit Wall Diagnostics
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '400px' }}>
          Please enter your organization's name to initialize the telemetry feed and dynamically load your custom chassis configuration.
        </p>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={inputStyle}
            placeholder="e.g. Mercedes, Google, Apple"
            autoFocus
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-mclaren)';
              e.target.style.boxShadow = '0 0 15px rgba(255, 128, 0, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-accent)';
              e.target.style.boxShadow = 'none';
            }}
          />
          
            <button 
            type="submit" 
            style={buttonStyle}
            disabled={!company.trim()}
          >
            {company.trim() ? 'Initialize System' : 'Awaiting Input'}
          </button>
        </form>
      </div>
    </div>
  );
}
