import './SentiraAI.css'
import { useState } from 'react'

export default function SentiraAI({ onNavigate }) {
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: '🙏 Namaste! I\'m Sentira-Law, your emotional legal mediator. I\'m here to help you navigate your situation with empathy and clarity.\n\nTell me what\'s troubling you. I\'ll help detect what you\'re feeling and explain your legal options under Indian law.',
      emotion: null 
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [detectedEmotion, setDetectedEmotion] = useState(null)

  // Emotion detection from text
  const detectEmotion = (text) => {
    const lowerText = text.toLowerCase()
    
    if (lowerText.match(/angry|furious|rage|hate/)) return { emotion: 'Anger', emoji: '😠', color: '#ff6b6b' }
    if (lowerText.match(/sad|depressed|upset|unhappy|tears|cry/)) return { emotion: 'Sadness', emoji: '😢', color: '#4ecdc4' }
    if (lowerText.match(/afraid|fear|scared|anxious|worry|nervous/)) return { emotion: 'Fear', emoji: '😨', color: '#ffe66d' }
    if (lowerText.match(/confused|unsure|lost|unclear|help/)) return { emotion: 'Confusion', emoji: '😕', color: '#a8dadc' }
    if (lowerText.match(/hopeful|positive|better|good|great/)) return { emotion: 'Hopefulness', emoji: '🌟', color: '#90be6d' }
    if (lowerText.match(/hurt|betrayed|disappointed|let down/)) return { emotion: 'Hurt', emoji: '💔', color: '#f77f88' }
    
    return { emotion: 'Understanding', emoji: '👂', color: '#667eea' }
  }

  // Indian Law responses
  const getIndianLawGuidance = (userText) => {
    const lowerText = userText.toLowerCase()
    
    const responses = {
      marriage: {
        keywords: ['marriage', 'divorce', 'spouse', 'husband', 'wife', 'matrimony'],
        guidance: 'Under the Hindu Marriage Act, 1955 (or Muslim Personal Law, Christian Marriage Act depending on religion), you have legal protections. Key points:\n\n• Grounds for divorce include cruelty, adultery, desertion (2+ years)\n• Alimony can be claimed under Section 25 of the Act\n• Child custody prioritizes the child\'s welfare\n• Counseling and 6-month reconciliation period is often recommended first\n\nBefore court: Consider mediation with a trusted person or professional mediator.'
      },
      property: {
        keywords: ['property', 'land', 'house', 'inheritance', 'will', 'partition'],
        guidance: 'Under the Indian Succession Act, 1925 and Transfer of Property Act, 1882:\n\n• Inheritance follows succession laws based on religion\n• Partition suits must be filed in civil court (2-year limitation)\n• Fair Compensation Act applies for land acquisition\n• Document verification is crucial - get property papers verified\n\nFirst step: Get a skilled property lawyer and try negotiated settlement with family members.'
      },
      criminal: {
        keywords: ['crime', 'theft', 'assault', 'harassment', 'police', 'complaint', 'hit', 'beat', 'attack'],
        guidance: 'Under the Indian Penal Code (IPC):\n\n• File an FIR (First Information Report) at the police station\n• Sections 305-308: Criminal intimidation\n• Sections 336-348: Criminal act\n• Section 167: Medical examination (in assault cases)\n\nImportant: Your safety comes first. Contact:\n• Police: 100\n• Women\'s Helpline: 1091 (nationwide)\n• National Commission for Women\n\nDocument all injuries/evidence. Consider both criminal and civil remedies.'
      },
      labor: {
        keywords: ['job', 'employer', 'salary', 'wage', 'work', 'employment', 'dismissal', 'fired'],
        guidance: 'Under the Industrial Disputes Act, 1947 & Labour Law:\n\n• Minimum wage is set by state government\n• Wrongful termination can be challenged\n• Provident fund withdrawal rules (Form 19, 20, 20A)\n• Gratuity after 5+ years of service\n• Working hours: Max 48 hrs/week + overtime compensation\n\nFirst: File complaint with Labour Commissioner or Industrial Court'
      },
      consumer: {
        keywords: ['product', 'defective', 'fraud', 'cheated', 'money', 'refund', 'service'],
        guidance: 'Under the Consumer Protection Act, 2019:\n\n• File complaint within 2 years\n• Consumer court has jurisdiction on claims up to ₹1 crore\n• Compensation for defective goods/services\n• Penalty for unfair trade practices\n• Right to return/refund\n\nProcess: Send notice first → File complaint → Hearing → Settlement'
      },
      default: 'I understand your concern. Under Indian law, you have several options:\n\n1. **Negotiated Settlement** (30% cases resolve here)\n2. **Mediation/Arbitration** (Faster, confidential, cheaper)\n3. **Civil/Criminal Court** (Last option, takes time)\n\nLet me help you explore the best path. Can you tell me more about the specific issue?'
    }

    for (const [key, data] of Object.entries(responses)) {
      if (data.keywords.some(kw => lowerText.includes(kw))) {
        return data.guidance
      }
    }
    return responses.default
  }

  const getEmpatheticResponse = (emotion, userText) => {
    const responses = {
      'Anger': [
        `I can see you're feeling angry, and that's completely valid. Let's take a breath and look at constructive solutions.\n\n${getIndianLawGuidance(userText)}`,
        `Your anger shows how much this matters to you. Instead of escalating, let's explore legal remedies that actually help.\n\n${getIndianLawGuidance(userText)}`
      ],
      'Sadness': [
        `I hear the sadness in your words. It's okay to feel this way. Let's work together to find your path forward.\n\n${getIndianLawGuidance(userText)}`,
        `You're going through a tough time, and I'm here to support you. Let me explain your options:\n\n${getIndianLawGuidance(userText)}`
      ],
      'Fear': [
        `I understand you're feeling anxious. Let me reassure you by explaining your legal protections.\n\n${getIndianLawGuidance(userText)}`,
        `Your concerns are valid. Knowledge of your rights can help reduce that fear. Here's what you need to know:\n\n${getIndianLawGuidance(userText)}`
      ],
      'Confusion': [
        `Feeling confused is normal in legal matters. Let me simplify this for you:\n\n${getIndianLawGuidance(userText)}`,
        `I'll help clear this up. Here are your options explained simply:\n\n${getIndianLawGuidance(userText)}`
      ],
      'Hurt': [
        `I'm sorry you've been hurt. You deserve fairness and support. Let me explain your legal rights:\n\n${getIndianLawGuidance(userText)}`,
        `That hurt is real, and I validate your feelings. Now let's focus on solutions:\n\n${getIndianLawGuidance(userText)}`
      ],
      'Hopefulness': [
        `I'm glad you're feeling positive! That energy helps. Let's channel it into constructive action:\n\n${getIndianLawGuidance(userText)}`,
        `Your hope is wonderful. Let's build on it with smart legal decisions:\n\n${getIndianLawGuidance(userText)}`
      ],
      'Understanding': [
        `Thank you for sharing. Let me help you understand your legal options:\n\n${getIndianLawGuidance(userText)}`,
        `I'm listening. Here's what the law says about your situation:\n\n${getIndianLawGuidance(userText)}`
      ]
    }

    const emotionResponses = responses[emotion.emotion] || responses['Understanding']
    return emotionResponses[Math.floor(Math.random() * emotionResponses.length)]
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage = inputValue
    const emotion = detectEmotion(userMessage)
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: userMessage, emotion: null }])
    setDetectedEmotion(emotion)
    setInputValue('')

    // Simulate AI processing
    setLoading(true)
    setTimeout(() => {
      const aiResponse = getEmpatheticResponse(emotion, userMessage)
      setMessages(prev => [...prev, { type: 'bot', text: aiResponse, emotion: emotion.emotion }])
      setLoading(false)
    }, 1500)
  }

  return (
    <section className="sentira-ai">
      <div className="sentira-ai-container">
        <div className="sentira-header">
          <h1>🙏 Sentira-Law</h1>
          <p className="sentira-tagline">Your Emotional Legal Mediator</p>
          <p className="sentira-description">
            Understand your feelings. Know your legal rights. Find peaceful solutions.
          </p>
        </div>

        <div className="sentira-main">
          <div className="chat-panel">
            <div className="chat-header-panel">
              <h2>Talk to Sentira</h2>
              <p>Share what's on your mind</p>
            </div>

            <div className="sentira-chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`sentira-message ${msg.type}`}>
                  {msg.type === 'bot' && <span className="sentira-bot-avatar">✨</span>}
                  <div className="sentira-message-content">
                    {msg.emotion && msg.type === 'bot' && (
                      <div className="emotion-badge">{msg.emotion}</div>
                    )}
                    <p>{msg.text}</p>
                  </div>
                  {msg.type === 'user' && <span className="sentira-user-avatar">👤</span>}
                </div>
              ))}
              {loading && (
                <div className="sentira-message bot">
                  <span className="sentira-bot-avatar">✨</span>
                  <div className="sentira-message-content typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
            </div>

            <form className="sentira-chat-form" onSubmit={handleSendMessage}>
              <textarea
                placeholder="Share what's troubling you... I'm here to listen and help."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={loading}
                className="sentira-chat-input"
                rows="3"
              />
              <button type="submit" className="sentira-send-btn" disabled={loading}>
                {loading ? '⏳' : '📤 Send'}
              </button>
            </form>

            {detectedEmotion && (
              <div className="emotion-indicator">
                <span className="emotion-emoji">{detectedEmotion.emoji}</span>
                <span className="emotion-text">Detected: {detectedEmotion.emotion}</span>
              </div>
            )}
          </div>

          <div className="info-panel">
            <h3>How Sentira Works</h3>
            
            <div className="info-section">
              <h4>🎯 What I Do</h4>
              <ul>
                <li>Listen empathetically to your situation</li>
                <li>Detect emotions in your words</li>
                <li>Explain Indian law in simple terms</li>
                <li>Suggest peaceful resolution first</li>
                <li>Guide you toward legal options</li>
              </ul>
            </div>

            <div className="info-section">
              <h4>⚖️ Indian Law Topics</h4>
              <ul>
                <li>Marriage & Divorce Laws</li>
                <li>Property & Inheritance</li>
                <li>Criminal & Personal Law</li>
                <li>Employment & Labour Rights</li>
                <li>Consumer Protection</li>
              </ul>
            </div>

            <div className="info-section">
              <h4>💡 My Approach</h4>
              <ul>
                <li>Calm, not reactive judgment</li>
                <li>Understand emotions first</li>
                <li>No extreme advice</li>
                <li>Encourage mediation/settlement</li>
                <li>Court as last resort</li>
              </ul>
            </div>

            <div className="emergency-box">
              <h4>⚠️ Emergency?</h4>
              <p>If you're in danger:</p>
              <ul>
                <li>📞 Police: 100</li>
                <li>📞 Women's Helpline: 1091</li>
                <li>📞 AAIL: 9818-666-888</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="sentira-cta">
          <h2>Not Ready to Talk Yet?</h2>
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
              🤝 Explore Mediation
            </button>
            <button 
              className="btn-secondary btn-large"
              onClick={() => onNavigate('legal-docs')}
            >
              📄 View Legal Resources
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
