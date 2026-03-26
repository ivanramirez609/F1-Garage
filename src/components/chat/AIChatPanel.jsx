import { useState, useRef, useEffect } from 'react';
import { Send, User, Wrench } from 'lucide-react';

export function AIChatPanel({ currentCar, isExploded, company }) {
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Oi. Mac here. Take a look at the telemetry, tell me what you see, and don\'t touch the front wing angle.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    
    // Add user message to UI immediately
    const newHistory = [...messages, { role: 'user', text: userMsg }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: messages, // Send past history for context
          currentCar,        // Inject active car state
          isExploded,        // Inject active animation state
          company           // Inject visitor company name
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages([...newHistory, { role: 'model', text: data.reply }]);
      } else {
        setMessages([...newHistory, { role: 'model', text: 'Sorry mate, comms are down. Need to check the telemetry link.' }]);
        console.error("API Error:", data.error);
      }
    } catch (error) {
       console.error("Fetch Error:", error);
       setMessages([...newHistory, { role: 'model', text: 'Lost connection to the pit wall server. Is the backend running?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      
      {/* Messages Area */}
      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            style={{ 
               display: 'flex', 
               gap: '0.75rem',
               padding: '1rem',
               backgroundColor: msg.role === 'user' ? 'rgba(255,255,255,0.05)' : 'rgba(255, 128, 0, 0.05)',
               borderLeft: msg.role === 'model' ? '3px solid var(--accent-mclaren)' : '3px solid transparent',
               borderRadius: '4px'
            }}
          >
            <div style={{ color: msg.role === 'user' ? 'var(--text-muted)' : 'var(--accent-mclaren)' }}>
              {msg.role === 'user' ? <User size={20} /> : <Wrench size={20} />}
            </div>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
               <strong style={{ display: 'block', marginBottom: '0.25rem', fontFamily: 'var(--font-display)', color: msg.role === 'user' ? '#fff' : 'var(--accent-mclaren)' }}>
                  {msg.role === 'user' ? 'Guest Inspector' : 'Mac'}
               </strong>
               {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
            <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wrench size={16} className="animate-spin" style={{ animation: 'spin 2s linear infinite' }} />
                <span>Checking telemetry...</span>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '1rem', borderTop: 'var(--glass-border)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Mac about the car..."
            disabled={isLoading}
            style={{
              flexGrow: 1,
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              color: '#fff',
              outline: 'none',
              fontFamily: 'var(--font-body)'
            }}
          />
          <button 
             type="submit" 
             disabled={isLoading || !input.trim()}
             className="btn btn-primary"
             style={{ padding: '0.75rem' }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
