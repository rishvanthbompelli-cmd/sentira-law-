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
    <section className="glass-container">
      <div className="docs-header-premium ultra-glass neon-border-primary mb-12">
        <h1 className="text-grad-royal">Document Intelligence</h1>
        <p className="text-slate-300">Neural-synthesized and legally verified documentation center.</p>
      </div>

      <div className="docs-dashboard-p">
        <div className="docs-grid-premium grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="doc-card-premium premium-card neon-border-accent hover-glow">
            <h3 className="text-white font-bold mb-2">📄 Settlement Protocol</h3>
            <p className="text-slate-400 text-sm">Neural-compliant settlement synthesis</p>
          </div>
          <div className="doc-card-premium premium-card neon-border-accent hover-glow">
            <h3 className="text-white font-bold mb-2">📋 Executive Summary</h3>
            <p className="text-slate-400 text-sm">Automated legal narrative abstraction</p>
          </div>
          <div className="doc-card-premium premium-card neon-border-accent hover-glow">
            <h3 className="text-white font-bold mb-2">⚖️ Strategic Analysis</h3>
            <p className="text-slate-400 text-sm">Precedent-driven risk vectors</p>
          </div>
          <div className="doc-card-premium premium-card neon-border-accent hover-glow">
            <h3 className="text-white font-bold mb-2">📑 Jurisdictional Motions</h3>
            <p className="text-slate-400 text-sm">AI-assisted pleading generation</p>
          </div>
        </div>

        <div className="docs-management-panel ultra-glass p-8 mb-12">
          <h2 className="text-grad-ocean font-black text-xl mb-8">Asset Repository</h2>
          <div className="docs-list-p space-y-6">
            <div className="doc-item-p flex items-center gap-6 p-4 ultra-glass hover:bg-white/5 transition-colors rounded-xl border border-white/5">
              <span className="text-3xl">📄</span>
              <div className="doc-info-p">
                <h4 className="text-white font-bold">Synthesized Contract #421</h4>
                <p className="text-slate-400 text-sm">Generated via Case Protocol Alpha</p>
              </div>
              <div className="ml-auto flex gap-3">
                 <button className="text-accent text-xs uppercase font-bold tracking-widest px-4 py-2 border border-accent/30 rounded-lg hover:bg-accent/10">Analyze</button>
                 <button className="text-white text-xs uppercase font-bold tracking-widest px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">Review</button>
              </div>
            </div>
            <div className="doc-item-p flex items-center gap-6 p-4 ultra-glass hover:bg-white/5 transition-colors rounded-xl border border-white/5">
              <span className="text-3xl text-accent">✓</span>
              <div className="doc-info-p">
                <h4 className="text-white font-bold">Compliance Verification</h4>
                <p className="text-slate-400 text-sm">Validated against active legal standards</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Bot Section */}
        <div className="ai-assistant-panel premium-card neon-border-primary p-8 mb-12">
          <div className="assistant-header-p flex items-center gap-4 mb-8">
             <div className="assistant-icon text-4xl">🤖</div>
             <div>
               <h2 className="text-grad-royal font-black text-2xl">Neural Legal Strategist</h2>
               <p className="text-slate-400">Interrogate your document repository</p>
             </div>
          </div>
          
          <div className="ai-chat-interface-p ultra-glass p-6 rounded-2xl mb-8">
            <div className="chat-viewport space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`message-p flex gap-4 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.type === 'bot' && <div className="msg-avatar text-xl">🤖</div>}
                  <div className={`msg-bubble p-4 rounded-2xl text-sm max-w-[80%] ${
                    msg.type === 'bot' ? 'bg-white/5 text-slate-200 rounded-tl-none border border-white/10' : 'bg-accent/20 text-white rounded-tr-none border border-accent/30'
                  }`}>
                    {msg.text}
                  </div>
                  {msg.type === 'user' && <div className="msg-avatar text-xl">👤</div>}
                </div>
              ))}
            </div>

            <form className="chat-input-wrapper-p mt-8 flex gap-3" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Query neural database (e.g. Verify compliance vectors...)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="form-input-premium m-0 text-sm"
              />
              <button type="submit" className="btn-primary-premium py-0 px-8 h-[50px] whitespace-nowrap">
                Query
              </button>
            </form>

            <div className="quick-actions-p mt-8 flex flex-wrap gap-3">
                <button className="text-xs font-bold uppercase tracking-widest px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors" onClick={() => setInputValue('Synthesize Settlement')}>📝 Synthesize</button>
                <button className="text-xs font-bold uppercase tracking-widest px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors" onClick={() => setInputValue('Verify Compliance')}>✅ Verify</button>
                <button className="text-xs font-bold uppercase tracking-widest px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors" onClick={() => setInputValue('Summarize Protocol')}>📋 Summarize</button>
            </div>
          </div>
        </div>

        <div className="navigation-hub-p text-center py-12 ultra-glass rounded-2xl">
          <h2 className="text-white font-black text-2xl mb-8">Sequence Control Hub</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <button 
              className="btn-primary-premium flex items-center gap-3 px-8 text-lg"
              onClick={() => onNavigate('ai-hub')}
            >
              <span>✨</span> Legal AI Hub
            </button>
            <button 
              className="btn-secondary-premium flex items-center gap-3 px-8 text-lg border-accent/30 text-accent hover:bg-accent/10"
              onClick={() => onNavigate('mediation-bridge')}
            >
              <span>🤝</span> Mediation Interface
            </button>
            <button 
              className="btn-secondary-premium flex items-center gap-3 px-8 text-lg border-white/10"
              onClick={() => onNavigate('home')}
            >
              <span>🏠</span> Access Base
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
