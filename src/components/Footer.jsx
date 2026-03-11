import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Sentira-Law</h3>
          <p>The Emotional Legal Mediator</p>
          <p className="tagline">Empathy, Intelligence, Justice</p>
        </div>

        <div className="footer-section">
          <h4>Product</h4>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#mediation">Start Mediation</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#careers">Careers</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#ethics">AI Ethics</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:info@sentiralaw.com">info@sentiralaw.com</a></li>
            <li><a href="tel:+1234567890">+1 (234) 567-890</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Sentira-Law. All rights reserved. | Built with empathy and intelligence.</p>
        <div className="social-links">
          <a href="#twitter" className="social-icon">𝕏</a>
          <a href="#linkedin" className="social-icon">in</a>
          <a href="#facebook" className="social-icon">f</a>
        </div>
      </div>
    </footer>
  )
}
