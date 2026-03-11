import './Support.css'

export default function Support({ onNavigate }) {
  const handleDonate = () => {
    alert('Thank you for your interest in donating! This feature will be available soon.')
  }

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@sentira-law.com'
  }

  return (
    <div className="support-container">
      <div className="support-header">
        <h1>Support Sentira-Law</h1>
        <p>Help us continue our mission of making legal assistance accessible to everyone</p>
      </div>

      <div className="support-content">
        <section className="support-section">
          <h2>Why Support Us?</h2>
          <p>
            Sentira-Law is dedicated to bridging the gap between legal services and those who need them most. 
            Your support helps us maintain and improve our platform, ensuring that everyone has access to 
            quality legal assistance regardless of their financial situation.
          </p>
        </section>

        <section className="support-section">
          <h2>Platform Development Support</h2>
          <p>
            Our platform uses cutting-edge AI technology to analyze emotional aspects of legal disputes, 
            helping mediators and lawyers provide better support. Continuous development requires resources 
            for server maintenance, AI model improvements, and feature enhancements.
          </p>
          <ul className="support-features">
            <li>Server hosting and maintenance</li>
            <li>AI model training and optimization</li>
            <li>Security updates and data protection</li>
            <li>Mobile app development</li>
          </ul>
        </section>

        <section className="support-section">
          <h2>Legal Tech Innovation</h2>
          <p>
            We are committed to innovating in the legal tech space. Your support enables us to:
          </p>
          <ul className="support-features">
            <li>Develop new AI-powered features for case analysis</li>
            <li>Improve emotion detection and conflict analysis</li>
            <li>Expand our network of legal professionals</li>
            <li>Provide free services to underprivileged communities</li>
          </ul>
        </section>

        <div className="support-actions">
          <button className="donate-btn" onClick={handleDonate}>
            <span className="btn-icon">💝</span>
            <span>Donate</span>
          </button>
          <button className="contact-btn" onClick={handleContactSupport}>
            <span className="btn-icon">📧</span>
            <span>Contact Support</span>
          </button>
        </div>

        <div className="support-footer-note">
          <p>
            For partnership opportunities or institutional support, please contact us at 
            <a href="mailto:partnerships@sentira-law.com"> partnerships@sentira-law.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}
