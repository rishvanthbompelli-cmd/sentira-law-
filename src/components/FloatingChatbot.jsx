import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './FloatingChatbot.css'

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Namaste! I am Sentira AI. How can I help you with your legal journey today?' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = input
    setMessages(prev => [...prev, { type: 'user', text: userMsg }])
    setInput('')
    setIsTyping(true)

    // Simulate AI Response
    setTimeout(() => {
      let botResponse = "I'm analyzing your request from a legal and emotional perspective..."
      
      if (userMsg.toLowerCase().includes('hello') || userMsg.toLowerCase().includes('hi')) {
        botResponse = "Hello! I'm here to provide empathetic legal guidance. What's on your mind?"
      } else if (userMsg.toLowerCase().includes('divorce') || userMsg.toLowerCase().includes('marriage')) {
        botResponse = "I understand this is a sensitive situation. Under Indian law, we can explore mediation as a first step. How are you feeling?"
      }
      
      setMessages(prev => [...prev, { type: 'bot', text: botResponse }])
      setIsTyping(false)
    }, 1500)
  }

  // Enhanced spring animation configuration
  const springConfig = {
    type: "spring",
    damping: 25,
    stiffness: 300,
    mass: 0.8
  }

  // Chat window animation variants
  const chatWindowVariants = {
    hidden: { 
      opacity: 0, 
      y: 60, 
      scale: 0.85,
      transformOrigin: 'bottom right'
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: springConfig
    },
    exit: { 
      opacity: 0, 
      y: 40, 
      scale: 0.9,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  }

  // Button animation variants
  const buttonVariants = {
    rest: { 
      scale: 1,
      boxShadow: "0 0 20px rgba(99, 102, 241, 0.4), 0 0 40px rgba(168, 85, 247, 0.3), 0 0 60px rgba(99, 102, 241, 0.2)"
    },
    hover: { 
      scale: 1.08,
      boxShadow: "0 0 30px rgba(99, 102, 241, 0.6), 0 0 60px rgba(168, 85, 247, 0.4), 0 0 90px rgba(99, 102, 241, 0.3)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: { 
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  }

  // Message animation variants
  const messageVariants = {
    hidden: { 
      opacity: 0, 
      y: 15,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    }
  }

  return (
    <div className="floating-chatbot-wrapper">
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div 
            className="chatbot-window glass-panel"
            variants={chatWindowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="chatbot-window"
          >
            <div className="chatbot-header">
              <div className="chatbot-title">
                <span className="chatbot-icon">⚖️</span>
                <div>
                  <h4>Sentira AI</h4>
                  <p>Neural Legal Mediator</p>
                </div>
              </div>
              <motion.button 
                className="close-btn" 
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                ×
              </motion.button>
            </div>

            <div className="chatbot-messages">
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div 
                    key={idx} 
                    className={`chat-message ${msg.type}`}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    layout
                  >
                    {msg.type === 'bot' && (
                      <motion.div 
                        className="bot-avatar-s"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
                      >
                        S
                      </motion.div>
                    )}
                    <motion.div 
                      className="message-bubble"
                      layout
                    >
                      {msg.text}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <motion.div 
                  className="chat-message bot"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="bot-avatar-s">S</div>
                  <div className="message-bubble typing">
                    <span></span><span></span><span></span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chatbot-input-area" onSubmit={handleSend}>
              <motion.input 
                type="text" 
                placeholder="Type your message..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
                whileFocus={{ 
                  borderBottomColor: "#a855f7",
                  boxShadow: "0 4px 12px rgba(168, 85, 247, 0.3)"
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.button 
                type="submit" 
                className={`send-btn ${input.trim() ? 'active' : ''}`}
                whileHover={input.trim() ? { scale: 1.1 } : {}}
                whileTap={input.trim() ? { scale: 0.95 } : {}}
                disabled={!input.trim()}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        className="chatbot-bubble"
        onClick={() => setIsOpen(!isOpen)}
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        animate={isOpen ? "rest" : "rest"}
      >
        <div className="pulse-ring"></div>
        <motion.span 
          className="bubble-icon"
          animate={{ 
            rotate: isOpen ? 180 : 0,
            scale: isOpen ? 0.9 : 1
          }}
          transition={{ duration: 0.3 }}
        >
          💬
        </motion.span>
      </motion.button>
    </div>
  )
}
