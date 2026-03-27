import { useNavigate } from 'react-router-dom'
import './EmotionHeatMap.css'

export default function EmotionHeatMap() {
  const navigate = useNavigate()
  return (
    <section className="emotion-heatmap">
      <div className="heatmap-container">
        <h1>Emotion Heat Map</h1>
        <p className="subtitle">Understand Emotional Dynamics in Your Case</p>
        
        <div className="emotion-grid">
          <div className="emotion-card">
            <h3>😡 Anger Levels</h3>
            <p>Track and visualize anger patterns throughout the conflict</p>
          </div>
          <div className="emotion-card">
            <h3>😢 Sadness Tracking</h3>
            <p>Monitor emotional pain points and vulnerabilities</p>
          </div>
          <div className="emotion-card">
            <h3>😟 Fear Assessment</h3>
            <p>Identify fears and concerns driving decision-making</p>
          </div>
          <div className="emotion-card">
            <h3>🤝 Trust Analysis</h3>
            <p>Measure trust levels between parties</p>
          </div>
        </div>

        <div className="heatmap-visualization">
          <h2>Real-time Emotion Analysis</h2>
          <div className="heatmap-demo">
            <p>Emotional intensity visualization comes here</p>
          </div>
        </div>

        <div className="page-cta">
          <h2>What To Do Next</h2>
          <div className="cta-buttons">
            <button 
              className="btn-primary btn-large"
              onClick={() => navigate('/ai-hub')}
            >
              ✨ Talk to Emotional Support AI
            </button>
            <button 
              className="btn-secondary btn-large"
              onClick={() => navigate('/mediation-bridge')}
            >
              🤝 Start Guided Mediation
            </button>
            <button 
              className="btn-secondary btn-large"
              onClick={() => navigate('/legal-docs')}
            >
              📝 Generate Agreement
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
