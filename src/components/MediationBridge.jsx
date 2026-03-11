import './MediationBridge.css'

export default function MediationBridge({ onNavigate }) {
  return (
    <section className="mediation-bridge">
      <div className="bridge-container">
        <h1>Mediation Bridge</h1>
        <p className="subtitle">Connect Parties Through AI-Powered Communication</p>
        
        <div className="bridge-features">
          <div className="feature-card">
            <h3>🎯 Neutral Ground</h3>
            <p>Safe space for both parties to express concerns</p>
          </div>
          <div className="feature-card">
            <h3>🤖 AI Mediator</h3>
            <p>Intelligent mediation guidance and suggestions</p>
          </div>
          <div className="feature-card">
            <h3>📝 Agreement Draft</h3>
            <p>Automatically generate settlement agreements</p>
          </div>
          <div className="feature-card">
            <h3>🔒 Confidentiality</h3>
            <p>Secure and private mediation sessions</p>
          </div>
        </div>

        <div className="bridge-process">
          <h2>Mediation Process</h2>
          <div className="process-steps">
            <div className="step">
              <span className="step-number">1</span>
              <p>Statement of Issues</p>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <p>Individual Sessions</p>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <p>Joint Discussions</p>
            </div>
            <div className="step">
              <span className="step-number">4</span>
              <p>Agreement</p>
            </div>
          </div>
        </div>

        <div className="page-cta">
          <h2>Explore More Resources</h2>
          <div className="cta-buttons">
            <button 
              className="btn-primary btn-large"
              onClick={() => onNavigate('ai-hub')}
            >
              ✨ Get Coaching from AI
            </button>
            <button 
              className="btn-secondary btn-large"
              onClick={() => onNavigate('legal-docs')}
            >
              📄 View Legal Documents
            </button>
            <button 
              className="btn-secondary btn-large"
              onClick={() => onNavigate('emotion-heatmap')}
            >
              📊 Check Emotion Patterns
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
