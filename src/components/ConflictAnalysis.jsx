import { useNavigate } from 'react-router-dom'
import './ConflictAnalysis.css'

export default function ConflictAnalysis() {
  const navigate = useNavigate()
  return (
    <section className="conflict-analysis">
      <div className="conflict-container">
        <h1>Conflict Analysis</h1>
        <p className="subtitle">Deep Insights into Your Legal Dispute</p>
        
        <div className="analysis-grid">
          <div className="analysis-card">
            <h3>📊 Conflict Mapping</h3>
            <p>Visual representation of conflict parties and their relationships</p>
          </div>
          <div className="analysis-card">
            <h3>🔍 Root Cause Analysis</h3>
            <p>Identify underlying issues driving the dispute</p>
          </div>
          <div className="analysis-card">
            <h3>💡 Solution Generator</h3>
            <p>AI-powered suggestions for conflict resolution</p>
          </div>
        </div>

        <div className="analysis-content">
          <h2>How It Works</h2>
          <p>Our advanced conflict analysis tool uses artificial intelligence to:</p>
          <ul>
            <li>Parse legal documents and testimonies</li>
            <li>Identify key conflict points</li>
            <li>Suggest mediation strategies</li>
            <li>Predict resolution outcomes</li>
          </ul>
        </div>

        <div className="page-cta">
          <h2>Next Steps</h2>
          <div className="cta-buttons">
            <button 
              className="btn-primary btn-large"
              onClick={() => navigate('/ai-hub')}
            >
              ✨ Ask AI Assistant
            </button>
            <button 
              className="btn-secondary btn-large"
              onClick={() => navigate('/emotion-heatmap')}
            >
              📊 View Emotion Patterns
            </button>
            <button 
              className="btn-secondary btn-large"
              onClick={() => navigate('/legal-docs')}
            >
              📄 Review Legal Documents
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
