import React, { useState } from 'react';
import './CaseAIAnalyzer.css';

const CaseAIAnalyzer = ({ description }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!description || description.trim() === '') {
      setError('Please provide a detailed case description before analyzing.');
      return;
    }

    setLoadingAI(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await fetch('https://basinlike-hermila-nonmeditative.ngrok-free.dev/webhook/analyze-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description })
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      // We expect JSON response with: type, severity, confidence, steps[], advice
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error('AI Analysis Error:', err);
      setError('Failed to analyze the case via the selected webhook. Please check your connection or try again later.');
    } finally {
      setLoadingAI(false);
    }
  };

  const getSeverityColor = (severity) => {
    if (!severity) return '#94a3b8'; // default gray
    const s = severity.toLowerCase();
    if (s.includes('high') || s.includes('severe') || s.includes('critical')) return '#ef4444'; // red
    if (s.includes('medium') || s.includes('moderate')) return '#eab308'; // yellow
    if (s.includes('low') || s.includes('minor')) return '#22c55e'; // green
    return '#818cf8'; // indigo default fallback
  };

  return (
    <div className="ai-analyzer-container">
      <div className="ai-analyzer-action">
        <button 
          type="button"
          className="ai-analyze-btn glass-btn" 
          onClick={handleAnalyze} 
          disabled={loadingAI || !description}
        >
          {loadingAI ? (
            <><span className="ai-btn-spinner"></span> Analyzing Case...</>
          ) : (
            <><span className="ai-btn-icon">✨</span> AI Analyze</>
          )}
        </button>
      </div>

      {error && (
        <div className="ai-error-msg">
          <span style={{ marginRight: '8px' }}>⚠️</span> {error}
        </div>
      )}

      {analysis && (
        <div className="ai-results-card glass-panel">
          <div className="ai-results-header">
            <h3>🤖 Structural Legal Insights</h3>
          </div>
          
          <div className="ai-metrics-grid">
            <div className="ai-metric-box">
              <span className="ai-metric-label">Case Type</span>
              <span className="ai-metric-value">{analysis.type || 'Uncategorized'}</span>
            </div>
            
            <div className="ai-metric-box">
              <span className="ai-metric-label">Severity</span>
              <div className="severity-wrapper">
                <span 
                  className="severity-dot" 
                  style={{ backgroundColor: getSeverityColor(analysis.severity) }}
                ></span>
                <span className="ai-metric-value" style={{ color: getSeverityColor(analysis.severity) }}>
                  {analysis.severity || 'Unknown'}
                </span>
              </div>
            </div>
            
            <div className="ai-metric-box">
              <span className="ai-metric-label">Confidence</span>
              <span className="ai-metric-value">{analysis.confidence || 'N/A'}</span>
              {analysis.confidence && (
                <div className="confidence-bar-bg">
                  <div 
                    className="confidence-bar-fill" 
                    style={{ width: analysis.confidence.toString().replace('%', '') + '%' }}
                  ></div>
                </div>
              )}
            </div>
          </div>
          
          <div className="ai-detailed-section">
            <h4 className="ai-section-title">📋 Recommended Steps</h4>
            <ul className="ai-steps-list">
              {analysis.steps && analysis.steps.length > 0 ? (
                analysis.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))
              ) : (
                <li>No specific action steps provided by the analyzer.</li>
              )}
            </ul>
          </div>
          
          <div className="ai-detailed-section">
            <h4 className="ai-section-title">💡 Legal Advice Summary</h4>
            <p className="ai-advice-text">{analysis.advice || 'No additional advice available at this time.'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseAIAnalyzer;
