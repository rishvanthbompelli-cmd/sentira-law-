import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/glass.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="glass-container">
      {/* Hero Banner Section with Dynamic Design */}
      <div className="hero-banner ultra-glass">
        <div className="hero-bg-graphics">
          <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'hsla(var(--p-h), var(--p-s), var(--p-l), 0.1)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'hsla(var(--v-h), var(--v-s), var(--v-l), 0.1)', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <circle cx="200" cy="200" r="150" fill="url(#grad1)" opacity="0.4" />
            <circle cx="800" cy="700" r="200" fill="url(#grad1)" opacity="0.3" />
            <path d="M 0,500 Q 250,250 500,500 T 1000,500" stroke="hsla(var(--s-h), var(--s-s), var(--s-l), 0.1)" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <div className="banner-content">
          <div className="glowing-text-backdrop vibrant-glow-primary"></div>
          <h1 className="text-grad-royal">Modern Legal Resolutions</h1>
          <p className="hero-subtitle-top">Find clarity and expert guidance for your legal disputes. Experience the perfect blend of empathetic AI mediation and world-class human legal expertise.</p>
        </div>
      </div>

      {/* Main Info Section with Premium Card */}
      <div className="premium-card neon-border-primary">
        <div className="glass-content">
          <h1 className="hero-title text-grad-ocean">Sentira-Law</h1>
          <p className="hero-subtitle">
            The AI-Powered Emotional Legal Mediator bridging the gap between clinical neutrality and human empathy. We help you navigate complex legal scenarios with compassion and clarity.
          </p>
          
          <div className="features-grid">
            <div className="feature-item cursor-pointer" onClick={() => navigate('/submit')}>
              <div className="feature-icon-wrapper">📝</div>
              <h3 className="feature-title">Submit a Case</h3>
              <p className="feature-desc">Start your mediation journey with our empathic AI intake system.</p>
            </div>
            
            <div className="feature-item cursor-pointer" onClick={() => navigate('/top-lawyers')}>
              <div className="feature-icon-wrapper">⚖️</div>
              <h3 className="feature-title">Top Lawyers</h3>
              <p className="feature-desc">Connect with specialized legal professionals matched to your needs.</p>
            </div>
            
            <div className="feature-item cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="feature-icon-wrapper">📊</div>
              <h3 className="feature-title">Dashboard</h3>
              <p className="feature-desc">Track case progress, legal documents, and upcoming hearings.</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Sentira Law Section */}
      <div className="premium-card about-section vibrant-glow-primary">
        <div className="glass-content">
          <h2 className="about-title text-grad-gold">
            <span className="title-icon">🏛️</span> About Sentira Law
          </h2>
          <p className="about-description">
            Sentira-Law is the world's first AI-Powered Emotional Legal Mediator, designed to bridge the gap between clinical legal processes and human empathy. Our platform combines cutting-edge artificial intelligence with deep legal expertise to provide compassionate, effective dispute resolution.
          </p>
          <div className="about-features-grid">
            <div className="about-feature-card ultra-glass">
              <div className="about-feature-icon">🤝</div>
              <h4 className="about-feature-title">Empathetic Mediation</h4>
              <p className="about-feature-desc">AI that understands your emotional needs</p>
            </div>
            <div className="about-feature-card ultra-glass">
              <div className="about-feature-icon">⚖️</div>
              <h4 className="about-feature-title">Expert Network</h4>
              <p className="about-feature-desc">Access to top legal professionals</p>
            </div>
            <div className="about-feature-card ultra-glass">
              <div className="about-feature-icon">🔒</div>
              <h4 className="about-feature-title">Confidential & Secure</h4>
              <p className="about-feature-desc">Your privacy is our priority</p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
