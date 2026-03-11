import './LegalDocs.css'
import { useState } from 'react'

export default function LegalDocs({ onNavigate }) {
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m your AI Legal Assistant. I can help you generate and manage legal documents. What would you like help with today?' }
  ])
  const [inputValue, setInputValue] = useState('')

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const newMessages = [...chatMessages, { type: 'user', text: inputValue }]
    setChatMessages(newMessages)
    setInputValue('')

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'I can help you generate settlement agreements based on your case analysis. Would you like me to draft one?',
        'I\'ve analyzed your documents and found key clauses that need attention. Would you like me to highlight them?',
        'Based on your conflict analysis, I recommend including dispute resolution clauses in your agreement.',
        'I can verify your documents against legal standards. Would you like a compliance check?',
        'I\'m preparing a summary of your case. This will take a few moments...',
        'Your settlement agreement is ready for review. Would you like me to explain any sections?'
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setChatMessages(prev => [...prev, { type: 'bot', text: randomResponse }])
    }, 800)
  }

  return (
    <section className="legal-docs">
      <div className="docs-container">
        <h1>Legal Documents</h1>
        <p className="subtitle">AI-Generated and AI-Analyzed Legal Documents</p>
        
        <div className="docs-grid">
          <div className="doc-card">
            <h3>📄 Settlement Agreement</h3>
            <p>Generate legally compliant settlement agreements</p>
          </div>
          <div className="doc-card">
            <h3>📋 Case Summary</h3>
            <p>Automated case analysis and summary documents</p>
          </div>
          <div className="doc-card">
            <h3>⚖️ Legal Analysis</h3>
            <p>Precedent-based legal analysis and recommendations</p>
          </div>
          <div className="doc-card">
            <h3>📑 Motion Documents</h3>
            <p>AI-assisted motion and petition generation</p>
          </div>
        </div>

        <div className="docs-content">
          <h2>Document Management</h2>
          <div className="docs-list">
            <div className="doc-item">
              <span className="doc-icon">📄</span>
              <div className="doc-info">
                <h4>Contract Generated</h4>
                <p>Automatically generated from case analysis</p>
              </div>
            </div>
            <div className="doc-item">
              <span className="doc-icon">✅</span>
              <div className="doc-info">
                <h4>Verified & Compliant</h4>
                <p>Checked against legal standards and precedents</p>
              </div>
            </div>
            <div className="doc-item">
              <span className="doc-icon">🔗</span>
              <div className="doc-info">
                <h4>Easy Sharing</h4>
                <p>Share securely with all parties</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Bot Section */}
        <div className="ai-bot-section">
          <h2>🤖 AI Legal Assistant</h2>
          <p className="bot-subtitle">Ask me anything about your legal documents</p>
          
          <div className="ai-bot-container">
            <div className="chat-messages">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`message ${msg.type}`}>
                  {msg.type === 'bot' && <span className="bot-avatar">🤖</span>}
                  <div className="message-content">
                    {msg.text}
                  </div>
                  {msg.type === 'user' && <span className="user-avatar">👤</span>}
                </div>
              ))}
            </div>

            <form className="chat-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Ask me about documents, agreements, legal analysis..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="chat-input"
              />
              <button type="submit" className="chat-send-btn">
                Send
              </button>
            </form>

            <div className="bot-suggestions">
              <p className="suggestions-label">Quick Actions:</p>
              <div className="suggestion-buttons">
                <button 
                  className="suggestion-btn"
                  onClick={() => setInputValue('Generate settlement agreement')}
                >
                  📝 Generate Agreement
                </button>
                <button 
                  className="suggestion-btn"
                  onClick={() => setInputValue('Verify document compliance')}
                >
                  ✅ Verify Compliance
                </button>
                <button 
                  className="suggestion-btn"
                  onClick={() => setInputValue('Summarize my case')}
                >
                  📋 Summarize Case
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="page-cta">
          <h2>Continue Your Journey</h2>
          <div className="cta-buttons">
            <button 
              className="btn-primary btn-large"
              onClick={() => onNavigate('ai-hub')}
            >
              ✨ Use Legal AI Assistant
            </button>
            <button 
              className="btn-secondary btn-large"
              onClick={() => onNavigate('mediation-bridge')}
            >
              🤝 Back to Mediation
            </button>
            <button 
              className="btn-secondary btn-large"
              onClick={() => onNavigate('home')}
            >
              🏠 Back to Home
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
