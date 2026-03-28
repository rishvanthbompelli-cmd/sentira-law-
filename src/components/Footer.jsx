import { useRef } from 'react'
import { motion } from 'framer-motion'
import './Footer.css'

export default function Footer() {
  const footerRef = useRef(null)

  return (
    <motion.footer 
      ref={footerRef}
      className="footer-neural"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="footer-glow"></div>
      <div className="footer-content-p">
        <div className="footer-section-brand" style={{ paddingRight: '1rem' }}>
          <h3 className="brand-title">Sentira-Law</h3>
          <p className="brand-subtitle">The Emotional Legal Mediator</p>
          <p className="brand-desc font-light">
            Sentira-Law is the world's first AI-Powered Emotional Legal Mediator, designed to bridge the gap between clinical legal processes and human empathy. Our platform combines cutting-edge artificial intelligence with deep legal expertise to provide compassionate, effective dispute resolution.
          </p>
          <p className="brand-motto">EMPATHY • INTELLIGENCE • JUSTICE</p>
        </div>

        <div className="footer-section-links">
          <h4 className="footer-header">PRODUCT</h4>
          <ul>
            <li><a href="#features">Neural Features</a></li>
            <li><a href="#pricing">Strategic Pricing</a></li>
            <li><a href="#mediation">Initiate Mediation</a></li>
          </ul>
        </div>

        <div className="footer-section-links">
          <h4 className="footer-header">NETWORK</h4>
          <ul>
            <li><a href="#about">Our Ethos</a></li>
            <li><a href="#blog">Intelligence Hub</a></li>
            <li><a href="#careers">Neural Careers</a></li>
          </ul>
        </div>

        <div className="footer-section-links">
          <h4 className="footer-header">GOVERNANCE</h4>
          <ul>
            <li><a href="#privacy">Privacy Protocol</a></li>
            <li><a href="#terms">Terms of Engagement</a></li>
            <li><a href="#ethics">AI Synthesis Ethics</a></li>
          </ul>
        </div>

        <div className="footer-section-links">
          <h4 className="footer-header">CHANNEL</h4>
          <ul>
            <li><a href="mailto:liaison@sentira.law">liaison@sentira.law</a></li>
            <li><a href="tel:+1234567890">+1 (234) 567-890</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-flex">
          <p className="footer-copyright">&copy; 2026 Sentira-Law. All rights reserved. | Built with neural empathy and strategic intelligence.</p>
          <div className="social-nodes">
            <a href="#twitter" aria-label="X (Twitter)">𝕏</a>
            <a href="#linkedin" aria-label="LinkedIn">in</a>
            <a href="#facebook" aria-label="Facebook">f</a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
