import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/glass.css';
import './AIResponseBox.css';

export default function Home() {
  const navigate = useNavigate();
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
    
    try {
      // Make POST request to n8n webhook
      const response = await fetch('https://basinlike-hermila-nonmeditative.ngrok-free.dev/webhook/ai-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ description: caseText })
      });

      if (!response.ok) {
        throw new Error('Webhook request failed');
      }

      const data = await response.json();
      
      // Extract response text and lawyer info from webhook response
      const aiText = data.response || data.text || data.message || 'Analysis complete. Please consult with a legal expert.';
      const lawyerInfo = data.lawyer || data.suggestedLawyer || null;
      
      setAiResponse(aiText);
      setSuggestedLawyer(lawyerInfo);
      setIsAnalyzing(false);

      // Start Speech Synthesis Phase
      const utterance = new SpeechSynthesisUtterance(aiText);
      
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
    } catch (error) {
      console.error('Error calling webhook:', error);
      setIsAnalyzing(false);
      setAiResponse('An error occurred while analyzing your case. Please try again.');
    }
  };

  return (
    <div className="glass-container">
      {/* Hero Banner Section with Dynamic Design */}
      <div className="hero-banner ultra-glass">
        <div className="hero-bg-graphics">
          <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'hsla(var(--p-h), var(--p-s), var(--p-l), 0.1)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'hsla(var(--v-h), var(--v-s), var(--v-l), 0.1)', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <circle cx="200" cy="200" r="150" fill="url(#grad1)" opacity="0.4" />
            <circle cx="800" cy="700" r="200" fill="url(#grad1)" opacity="0.3" />
            <path d="M 0,500 Q 250,250 500,500 T 1000,500" stroke="hsla(var(--s-h), var(--s-s), var(--s-l), 0.1)" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <div className="banner-content">
          <div className="glowing-text-backdrop vibrant-glow-primary"></div>
          <h1 className="text-grad-royal">Modern Legal Resolutions</h1>
          <p className="hero-subtitle-top">Find clarity and expert guidance for your legal disputes. Experience the perfect blend of empathetic AI mediation and world-class human legal expertise.</p>
        </div>
      </div>

      {/* Main Info Section with Premium Card */}
      <div className="premium-card neon-border-primary">
        <div className="glass-content">
          <h1 className="hero-title text-grad-ocean">Sentira-Law</h1>
          <p className="hero-subtitle">
            The AI-Powered Emotional Legal Mediator bridging the gap between clinical neutrality and human empathy. We help you navigate complex legal scenarios with compassion and clarity.
          </p>
          
          <div className="features-grid">
            <div className="feature-item cursor-pointer" onClick={() => navigate('/submit')}>
              <div className="feature-icon-wrapper">📝</div>
              <h3 className="feature-title">Submit a Case</h3>
              <p className="feature-desc">Start your mediation journey with our empathic AI intake system.</p>
            </div>
            
            <div className="feature-item cursor-pointer" onClick={() => navigate('/top-lawyers')}>
              <div className="feature-icon-wrapper">⚖️</div>
              <h3 className="feature-title">Top Lawyers</h3>
              <p className="feature-desc">Connect with specialized legal professionals matched to your needs.</p>
            </div>
            
            <div className="feature-item cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="feature-icon-wrapper">📊</div>
              <h3 className="feature-title">Dashboard</h3>
              <p className="feature-desc">Track case progress, legal documents, and upcoming hearings.</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Sentira Law Section */}
      <div className="premium-card about-section vibrant-glow-primary">
        <div className="glass-content">
          <h2 className="about-title text-grad-gold">
            <span className="title-icon">🏛️</span> About Sentira Law
          </h2>
          <p className="about-description">
            Sentira-Law is the world's first AI-Powered Emotional Legal Mediator, designed to bridge the gap between clinical legal processes and human empathy. Our platform combines cutting-edge artificial intelligence with deep legal expertise to provide compassionate, effective dispute resolution.
          </p>
          <div className="about-features-grid">
            <div className="about-feature-card ultra-glass">
              <div className="about-feature-icon">🤝</div>
              <h4 className="about-feature-title">Empathetic Mediation</h4>
              <p className="about-feature-desc">AI that understands your emotional needs</p>
            </div>
            <div className="about-feature-card ultra-glass">
              <div className="about-feature-icon">⚖️</div>
              <h4 className="about-feature-title">Expert Network</h4>
              <p className="about-feature-desc">Access to top legal professionals</p>
            </div>
            <div className="about-feature-card ultra-glass">
              <div className="about-feature-icon">🔒</div>
              <h4 className="about-feature-title">Confidential & Secure</h4>
              <p className="about-feature-desc">Your privacy is our priority</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Voice Section - Colorful & Vibrant */}
      <div className="premium-card ai-voice-section neon-border-accent vibrant-glow-accent">
        <div className="glass-content">
          <h2 className="text-2xl font-bold mb-2 text-white flex items-center gap-2">
            <span className="animate-pulse">🎙️</span> AI Voice Case Analysis
          </h2>
          <p className="text-slate-300 mb-6 font-medium">
            Describe your case below. Our AI mediator will read and synthesize the information, speaking it back to you with clarity.
          </p>
          
          <div className="ai-input-wrapper">
             <textarea
               className="ai-textarea ultra-glass"
               placeholder="Type or paste case details here... Example: 'I Need Help With My Case Against My Landlord Regarding Unsafe Living Conditions.'"
               value={caseText}
               onChange={(e) => setCaseText(e.target.value)}
             ></textarea>
             <div className="ai-input-glow"></div>
          </div>
          
          <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
            <button 
              className={`ai-btn-premium ${isPlaying ? 'playing' : ''} ${isAnalyzing ? 'analyzing' : ''}`}
              onClick={handleSpeak}
              disabled={!caseText.trim() || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <span className="spinner animate-spin">⌛</span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="ai-btn-icon">{isPlaying ? '⏸️' : '✨'}</span>
                  {isPlaying ? 'Stop Playback' : 'Analyze Case'}
                </>
              )}
            </button>
            
            <div className="voice-status-badge ultra-glass">
              <span className={`status-dot ${isPlaying || isAnalyzing ? 'active' : ''}`}></span>
              <span className="status-text">
                {isAnalyzing ? 'Processing case data...' : (isPlaying ? 'Speaking resolution...' : 'Ready')}
              </span>
            </div>
          </div>

          {/* AI Response Display Area */}
          {(isAnalyzing || aiResponse) && (
             <div className="ai-response-box mt-6 ultra-glass neon-border-primary">
                <h3 className="text-lg font-semibold text-blue-300 mb-2 flex items-center gap-2">
                  <span>🤖</span> AI Mediator Response
                </h3>
                {isAnalyzing ? (
                  <div className="typing-indicator">
                     <span></span><span></span><span></span>
                  </div>
                ) : (
                  <>
                    <p className="text-slate-200 leading-relaxed">
                      {aiResponse}
                    </p>
                    
                    {suggestedLawyer && (
                      <div className="suggested-lawyer-card-premium ultra-glass mt-4">
                        <h4 className="text-grad-gold font-bold"><span>⚖️</span> Recommended Legal Expert:</h4>
                        <div className="lawyer-info-flex">
                          <div className="lawyer-details">
                            <p className="name">{suggestedLawyer.name}</p>
                            <p className="spec">{suggestedLawyer.specialization}</p>
                          </div>
                          <button 
                            className="consult-btn"
                            onClick={() => navigate('/top-lawyers')}
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
