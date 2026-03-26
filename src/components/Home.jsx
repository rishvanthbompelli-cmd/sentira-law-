import React, { useState, useEffect, useRef } from 'react';
import '../styles/glass.css';
import './AIResponseBox.css';

export default function Home({ onNavigate }) {
  const [caseText, setCaseText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [suggestedLawyer, setSuggestedLawyer] = useState(null);
  const synthRef = useRef(window.speechSynthesis);

  // Stop speech synthesis on component unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const generateMockResponse = (input) => {
    const lowerInput = input.toLowerCase();
    let text = "";
    let lawyer = null;

    if (lowerInput.includes('landlord') || lowerInput.includes('tenant') || lowerInput.includes('rent')) {
      text = "Based on your description, this appears to be a civil dispute regarding property. As a mediator, I want to acknowledge the stress of housing issues. I recommend consulting with an expert in Civil Law who can help negotiate repair timelines or analyze your lease agreement. What specific outcome are you hoping to achieve today?";
      lawyer = { id: 2, name: "Kapil Sibal", specialization: "Civil Law Expert" };
    } else if (lowerInput.includes('divorce') || lowerInput.includes('custody') || lowerInput.includes('family')) {
      text = "I hear the emotional weight in your family law matter. Prioritizing open communication and the well-being of dependents is our primary goal. Mediation can offer a private approach to resolving asset division or custody. I highly recommend consulting with a leading human rights and family advocate. Would you like to start by outlining your most urgent priorities?";
      lawyer = { id: 10, name: "Indira Jaising", specialization: "Family & Human Rights Law Expert" };
    } else if (lowerInput.includes('employee') || lowerInput.includes('employer') || lowerInput.includes('fired') || lowerInput.includes('job') || lowerInput.includes('corporate')) {
      text = "Thank you for sharing this corporate or employment dispute. Workplace conflicts inevitably impact our livelihood. Our approach will be to thoroughly review your contracts and relevant labor laws. I suggest speaking with a top corporate litigation specialist to reach a fair agreement. Shall we review the specific timeline of events first?";
      lawyer = { id: 1, name: "Harish Salve", specialization: "Corporate Law Expert" };
    } else {
      text = "Thank you for trusting me with your case information. Legal matters can feel overwhelming, but you are not alone. I have analyzed your situation and recommend a structured mediation approach. I can connect you with an expert constitutional or civil lawyer to systematically review the facts. Please let me know how you would like to proceed.";
      lawyer = { id: 5, name: "Gopal Subramanium", specialization: "Constitutional & General Law Expert" };
    }

    const spokenText = `${text} For your specific case, I highly recommend consulting with ${lawyer.name}, a distinguished ${lawyer.specialization}.`;

    return { text, spokenText, lawyer };
  };

  const handleSpeak = async () => {
    if (!caseText.trim()) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
      return;
    }

    // Start Analysis Phase
    setIsAnalyzing(true);
    setAiResponse('');
    setSuggestedLawyer(null);
    
    // Simulate API Delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { text, spokenText, lawyer } = generateMockResponse(caseText);
    setAiResponse(text);
    setSuggestedLawyer(lawyer);
    setIsAnalyzing(false);

    // Start Speech Synthesis Phase
    const utterance = new SpeechSynthesisUtterance(spokenText);
    
    // Optional: try to find a natural-sounding voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || voices[0];
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    setIsPlaying(true);
    synthRef.current.speak(utterance);
  };

  return (
    <div className="glass-container">
      {/* Hero Banner Section */}
      <div className="hero-banner">
        <div className="banner-content">
          <div className="glowing-text-backdrop"></div>
          <h1>Modern Legal Resolutions</h1>
          <p>Find clarity and expert guidance for your legal disputes. Experience the perfect blend of empathetic AI mediation and world-class human legal expertise.</p>
        </div>
      </div>

      {/* Main Info Section */}
      <div className="liquid-glass-card">
        <div className="glass-content">
          <h1 className="hero-title">Sentira-Law</h1>
          <p className="hero-subtitle">
            The AI-Powered Emotional Legal Mediator bridging the gap between clinical neutrality and human empathy. We help you navigate complex legal scenarios with compassion and clarity.
          </p>
          
          <div className="features-grid">
            <div className="feature-item cursor-pointer" onClick={() => onNavigate('case-submission')}>
              <div className="feature-icon">📝</div>
              <h3 className="feature-title">Submit a Case</h3>
              <p className="feature-desc">Start your mediation journey with our empathic AI intake system.</p>
            </div>
            
            <div className="feature-item cursor-pointer" onClick={() => onNavigate('top-lawyers')}>
              <div className="feature-icon">⚖️</div>
              <h3 className="feature-title">Top Lawyers</h3>
              <p className="feature-desc">Connect with specialized legal professionals matched to your needs.</p>
            </div>
            
            <div className="feature-item cursor-pointer" onClick={() => onNavigate('case-dashboard')}>
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Dashboard</h3>
              <p className="feature-desc">Track case progress, legal documents, and upcoming hearings.</p>
            </div>
            
            <div className="feature-item cursor-pointer" onClick={() => onNavigate('qr-access')}>
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Quick Access</h3>
              <p className="feature-desc">Scan secure QR codes to instantly retrieve case files on-the-go.</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Voice Section */}
      <div className="liquid-glass-card ai-voice-section">
        <div className="glass-content">
          <h2 className="text-2xl font-bold mb-2 text-white flex items-center gap-2">
            <span>🎙️</span> AI Voice Case Analysis
          </h2>
          <p className="text-slate-300 mb-6">
            Describe your case below. Our AI mediator will read and synthesize the information, speaking it back to you with clarity.
          </p>
          
          <textarea
            className="ai-textarea"
            placeholder="Type or paste case details here... Example: 'I Need Help With My Case Against My Landlord Regarding Unsafe Living Conditions.'"
            value={caseText}
            onChange={(e) => setCaseText(e.target.value)}
          ></textarea>
          
          <div className="flex justify-between items-center">
            <button 
              className={`ai-btn ${isPlaying ? 'playing' : ''} ${isAnalyzing ? 'analyzing' : ''}`}
              onClick={handleSpeak}
              disabled={!caseText.trim() || isAnalyzing}
              style={{ opacity: (!caseText.trim() || isAnalyzing) ? 0.5 : 1, cursor: (!caseText.trim() || isAnalyzing) ? 'not-allowed' : 'pointer' }}
            >
              {isAnalyzing ? (
                <>
                  <span className="spinner">⌛</span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span style={{ fontSize: '1.2rem' }}>{isPlaying ? '⏸️' : '▶️'}</span>
                  {isPlaying ? 'Stop Playback' : 'Analyze & Speak Response'}
                </>
              )}
            </button>
            
            <div className="voice-status">
              <span className={`status-dot ${isPlaying || isAnalyzing ? 'active' : ''}`}></span>
              <span style={{ color: (isPlaying || isAnalyzing) ? '#10b981' : '#94a3b8' }}>
                {isAnalyzing ? 'Processing case data...' : (isPlaying ? 'Speaking resolution...' : 'Ready')}
              </span>
            </div>
          </div>

          {/* AI Response Display Area */}
          {(isAnalyzing || aiResponse) && (
             <div className="ai-response-box mt-6">
                <h3 className="text-lg font-semibold text-blue-300 mb-2 flex items-center gap-2">
                  <span>🤖</span> AI Mediator Response
                </h3>
                {isAnalyzing ? (
                  <div className="typing-indicator">
                     <span></span><span></span><span></span>
                  </div>
                ) : (
                  <>
                    <p>
                      {aiResponse}
                    </p>
                    
                    {suggestedLawyer && (
                      <div className="suggested-lawyer-card">
                        <h4><span>⚖️</span> Recommended Legal Expert:</h4>
                        <div className="lawyer-info-button">
                          <div>
                            <p>{suggestedLawyer.name}</p>
                            <p>{suggestedLawyer.specialization}</p>
                          </div>
                          <button 
                            onClick={() => onNavigate('top-lawyers')}
                          >
                            View & Book Consult
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
