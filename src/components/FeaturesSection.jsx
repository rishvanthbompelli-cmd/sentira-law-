import './FeaturesSection.css'

export default function FeaturesSection({ onNavigate }) {
  const features = [
    {
      icon: '🧠',
      title: 'Emotional Intelligence',
      description: 'AI that understands emotions, not just arguments. We consider psychological factors in mediation.'
    },
    {
      icon: '⚡',
      title: 'Intelligent Analysis',
      description: 'Advanced NLP and sentiment analysis ensures fair evaluation of both sides of your dispute.'
    },
    {
      icon: '🛡️',
      title: 'Complete Privacy',
      description: 'Enterprise-grade encryption protects your sensitive legal information with absolute confidentiality.'
    },
    {
      icon: '⏱️',
      title: 'Fast Resolution',
      description: 'Resolve disputes 70% faster than traditional mediation without sacrificing quality.'
    },
    {
      icon: '🌐',
      title: 'Global Access',
      description: '24/7 availability across multiple time zones and languages for your convenience.'
    },
    {
      icon: '✨',
      title: 'Transparent Process',
      description: 'Clear, explainable decisions backed by AI ethics and legal best practices.'
    }
  ]

  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2>Why Choose Sentira-Law?</h2>
          <p>A platform built on empathy, intelligence, and justice</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">{feature.icon}</div>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="features-cta">
          <div className="cta-content">
            <h3>Ready to resolve your dispute?</h3>
            <p>Join thousands of users who have found fair, empathetic solutions through Sentira-Law.</p>
            <button 
              className="btn-primary btn-large"
              onClick={() => onNavigate('ai-hub')}
            >
              ✨ Start with AI Assistant
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
