import './HeroSection.css'

export default function HeroSection({ onNavigate }) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Sentira-Law
            <br />
            <span className="hero-subtitle-inline">The Emotional Legal Mediator</span>
          </h1>
          
          <p className="hero-description">
            Resolve disputes with empathy, intelligence, and fairness. 
            <br />
            AI-powered mediation that respects your emotions and protects your rights.
          </p>

          <div className="hero-buttons">
            <button 
              className="btn-primary btn-large"
              onClick={() => onNavigate('sentira-ai')}
            >
              <span className="btn-icon">🙏</span>
              Talk to Sentira
            </button>
            <button 
              className="btn-secondary btn-large"
              onClick={() => onNavigate('conflict-analysis')}
            >
              <span className="btn-icon">📚</span>
              Learn More
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <h3>10,000+</h3>
              <p>Cases Resolved</p>
            </div>
            <div className="stat">
              <h3>98%</h3>
              <p>Client Satisfaction</p>
            </div>
            <div className="stat">
              <h3>24/7</h3>
              <p>Always Available</p>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="scale-illustration">
            <div className="scale-base"></div>
            <div className="scale-arm left-arm">
              <div className="scale-pan"></div>
            </div>
            <div className="scale-arm right-arm">
              <div className="scale-pan"></div>
            </div>
            <div className="scale-glow"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
