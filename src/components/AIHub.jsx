import './AIHub.css'
import { useState } from 'react'

export default function AIHub({ onNavigate }) {
  const [activeBot, setActiveBot] = useState('legal-assistant')
  const [conversations, setConversations] = useState({
    'legal-assistant': [
      { type: 'bot', text: 'Hello! I\'m your Legal Document AI. I can draft contracts, analyze agreements, and create legal documents. What do you need help with?' }
    ],
    'conflict-analyzer': [
      { type: 'bot', text: 'Hi! I\'m the Conflict Analyzer. I can identify core issues, find common ground, and suggest resolution strategies. Tell me about your conflict.' }
    ],
    'emotion-therapist': [
      { type: 'bot', text: 'I\'m the Emotional Support AI. I understand emotions and can help you process feelings about your case. How are you feeling about this situation?' }
    ],
    'mediation-coach': [
      { type: 'bot', text: 'I\'m your Mediation Coach. I prepare you for mediation sessions, suggest negotiation strategies, and help you communicate effectively. What would you like to practice?' }
    ]
  })

  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)

  const bots = [
    {
      id: 'legal-assistant',
      name: '⚖️ Legal Assistant',
      description: 'Draft & analyze legal documents',
      icon: '📄',
      capabilities: ['Contract drafting', 'Document analysis', 'Compliance check', 'Agreement generation']
    },
    {
      id: 'conflict-analyzer',
      name: '🔍 Conflict Analyzer',
      description: 'Identify issues & find solutions',
      icon: '⚡',
      capabilities: ['Root cause analysis', 'Issue identification', 'Solution generation', 'Strategy planning']
    },
    {
      id: 'emotion-therapist',
      name: '💚 Emotional Support',
      description: 'Process feelings & emotions',
      icon: '💭',
      capabilities: ['Emotion analysis', 'Mental health support', 'Stress management', 'Empathy training']
    },
    {
      id: 'mediation-coach',
      name: '🤝 Mediation Coach',
      description: 'Prepare for mediation',
      icon: '🎯',
      capabilities: ['Negotiation tactics', 'Communication tips', 'Session prep', 'Agreement drafting']
    }
  ]

  const getBotResponses = (botId, userMessage) => {
    const responses = {
      'legal-assistant': [
        'I can help you draft that document. Let me create a template based on common legal practices.',
        'Based on standard contract law, here\'s what I recommend including in your agreement...',
        'I\'ve analyzed the compliance requirements. Your document should include these clauses...',
        'Let me generate a comprehensive contract draft for your situation...'
      ],
      'conflict-analyzer': [
        'I\'ve identified the core issues in your conflict. The main points of disagreement are...',
        'Based on your description, here\'s my analysis of the root causes...',
        'I found several potential win-win solutions that could work for both parties...',
        'Here\'s a conflict map showing the relationships and key issues...'
      ],
      'emotion-therapist': [
        'I understand these feelings are difficult. Let\'s work on processing them together...',
        'That\'s a valid concern. Many people feel this way in similar situations. Here\'s what helps...',
        'Your emotional response shows the importance of this issue. Let\'s explore these feelings...',
        'It\'s important to acknowledge these emotions. They can actually help guide you to better solutions...'
      ],
      'mediation-coach': [
        'Great question! Here\'s how to communicate that effectively in mediation...',
        'For that negotiation, I\'d suggest using this approach: ',
        'Let\'s practice this scenario. Here\'s how I\'d recommend handling it...',
        'That\'s a strong point. Let me help you present it persuasively during mediation...'
      ]
    }

    const botResponses = responses[botId] || responses['legal-assistant']
    return botResponses[Math.floor(Math.random() * botResponses.length)]
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const newMessages = [
      ...conversations[activeBot],
      { type: 'user', text: inputValue }
    ]
    setConversations(prev => ({
      ...prev,
      [activeBot]: newMessages
    }))
    setInputValue('')

    // Simulate AI processing
    setLoading(true)
    setTimeout(() => {
      const botResponse = getBotResponses(activeBot, inputValue)
      setConversations(prev => ({
        ...prev,
        [activeBot]: [...prev[activeBot], { type: 'bot', text: botResponse }]
      }))
      setLoading(false)
    }, 1200)
  }

  const currentMessages = conversations[activeBot]
  const currentBot = bots.find(b => b.id === activeBot)

  return (
    <section className="ai-hub">
      <div className="ai-hub-container">
        <h1>✨ AI Problem Solving Hub</h1>
        <p className="subtitle">Real AI Assistants for Your Legal & Emotional Needs</p>

        <div className="ai-hub-content">
          {/* Bot Selection Grid */}
          <div className="bot-selection">
            <h2>Select Your AI Assistant</h2>
            <div className="bots-grid">
              {bots.map(bot => (
                <button
                  key={bot.id}
                  className={`bot-card ${activeBot === bot.id ? 'active' : ''}`}
                  onClick={() => setActiveBot(bot.id)}
                >
                  <div className="bot-icon">{bot.icon}</div>
                  <h3>{bot.name}</h3>
                  <p>{bot.description}</p>
                  <div className="bot-capabilities">
                    {bot.capabilities.map((cap, idx) => (
                      <span key={idx} className="capability">{cap}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="chat-interface">
            <div className="chat-header">
              <h2>{currentBot.name}</h2>
              <p>{currentBot.description}</p>
            </div>

            <div className="chat-messages-container">
              <div className="chat-messages">
                {currentMessages.map((msg, index) => (
                  <div key={index} className={`message ${msg.type}`}>
                    {msg.type === 'bot' && <span className="bot-avatar">✨</span>}
                    <div className="message-content">
                      {msg.text}
                    </div>
                    {msg.type === 'user' && <span className="user-avatar">👤</span>}
                  </div>
                ))}
                {loading && (
                  <div className="message bot">
                    <span className="bot-avatar">✨</span>
                    <div className="message-content typing">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <form className="chat-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder={`Ask ${currentBot.name.split(' ')[1]} something...`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={loading}
                className="chat-input"
              />
              <button type="submit" className="chat-send-btn" disabled={loading}>
                {loading ? '⏳' : '📤'}
              </button>
            </form>

            <div className="quick-actions">
              <p className="actions-label">Quick Commands:</p>
              <div className="action-buttons">
                <button 
                  className="action-btn"
                  onClick={() => setInputValue('Help me understand this better')}
                >
                  📖 Explain
                </button>
                <button 
                  className="action-btn"
                  onClick={() => setInputValue('What should I do next?')}
                >
                  🎯 Next Steps
                </button>
                <button 
                  className="action-btn"
                  onClick={() => setInputValue('Clear chat')}
                >
                  🗑️ Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Capabilities Info */}
        <div className="ai-capabilities">
          <h2>What These AI Systems Can Do</h2>
          <div className="capabilities-grid">
            <div className="capability-card">
              <h3>📄 Legal Assistant</h3>
              <ul>
                <li>Draft settlement agreements</li>
                <li>Analyze legal documents</li>
                <li>Check contract compliance</li>
                <li>Generate legal templates</li>
              </ul>
            </div>
            <div className="capability-card">
              <h3>🔍 Conflict Analyzer</h3>
              <ul>
                <li>Identify core issues</li>
                <li>Analyze root causes</li>
                <li>Find common ground</li>
                <li>Generate solutions</li>
              </ul>
            </div>
            <div className="capability-card">
              <h3>💚 Emotional Support</h3>
              <ul>
                <li>Process difficult emotions</li>
                <li>Provide empathy & comfort</li>
                <li>Stress management tips</li>
                <li>Mental health resources</li>
              </ul>
            </div>
            <div className="capability-card">
              <h3>🤝 Mediation Coach</h3>
              <ul>
                <li>Prepare for mediation</li>
                <li>Negotiation tactics</li>
                <li>Communication strategies</li>
                <li>Role-play practice</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="page-cta">
          <h2>Ready for Your Next Step?</h2>
          <div className="cta-buttons">
            <button 
              className="btn-primary btn-large"
              onClick={() => onNavigate('conflict-analysis')}
            >
              📊 Analyze Your Conflict
            </button>
            <button 
              className="btn-secondary btn-large"
              onClick={() => onNavigate('mediation-bridge')}
            >
              🤝 Start Mediation
            </button>
            <button 
              className="btn-secondary btn-large"
              onClick={() => onNavigate('legal-docs')}
            >
              📄 View Documents
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
