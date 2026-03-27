import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './FloatingChatbot.css'

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const chatContainerRef = useRef(null)
  const chatInstanceRef = useRef(null)

  // Initialize n8n chatbot when component mounts
  useEffect(() => {
    const loadN8nChat = async () => {
      try {
        // Load n8n chat CSS
        if (!document.querySelector('link[href*="@n8n/chat"]')) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css'
          document.head.appendChild(link)
        }

        // Load n8n chat JS
        const { createChat } = await import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js')
        
        if (chatContainerRef.current && !chatInstanceRef.current) {
          chatInstanceRef.current = createChat({
            webhookUrl: 'https://basinlike-hermila-nonmeditative.ngrok-free.dev/webhook/e8337304-9fe3-46f0-9283-69954e4700ba/chat',
            target: chatContainerRef.current,
            mode: 'fullscreen',
            loadPreviousSession: true,
            chatInputKey: 'chatInput',
            chatSessionKey: 'sessionId',
            metadata: {},
            showWelcomeScreen: false,
            defaultLanguage: 'en',
            initialMessages: [
              'Namaste! I am Sentira AI, your Neural Legal Mediator. How can I assist you with your legal journey today?'
            ],
            i18n: {
              en: {
                title: 'Sentira AI',
                subtitle: 'Neural Legal Mediator - Your empathetic legal companion',
                footer: 'Sentira Law',
                getStarted: 'New Conversation',
                inputPlaceholder: 'Type your legal question...',
              },
            },
          })
          setIsLoaded(true)
        }
      } catch (error) {
        console.error('Failed to load n8n chatbot:', error)
      }
    }

    loadN8nChat()

    return () => {
      // Cleanup
      if (chatInstanceRef.current) {
        chatInstanceRef.current = null
      }
    }
  }, [])

  // Spring animation configuration
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

            <div className="chatbot-n8n-container" ref={chatContainerRef}>
              {!isLoaded && (
                <div className="chatbot-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading AI Assistant...</p>
                </div>
              )}
            </div>
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
