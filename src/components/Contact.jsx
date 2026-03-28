import { useState } from 'react'
import { apiUrl } from '../apiClient'
import './Contact.css'

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      // Fixed: Backend expects 'fullName', frontend was sending 'name'
      const response = await fetch(apiUrl('/api/contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message
        })
      })

      const data = await response.json()

      if (data.status === 'success' || data.success) {
        setSuccess('Your message has been securely transmitted. A legal specialist will contact you shortly.')
        setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' })
        
        setTimeout(() => {
          setSuccess('')
        }, 8000)
      } else {
        setError(data.message || data.error || 'Transmission failed. Please verify your inputs.')
      }
    } catch (err) {
      console.error('Contact form error:', err)
      setError('Communication link offline. Please ensure the Sentira secure server is active.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="contact-page-wrapper">
      <div className="contact-container-premium">
        <div className="contact-grid">
          {/* Left Side: Contact Information */}
          <div className="contact-info-panel ultra-glass">
            <div className="info-header">
              <span className="premium-badge">Contact Us</span>
              <h1 className="text-grad-royal">Connect with <br/>Sentira Law</h1>
              <p className="subtitle">Neural-assisted client support and strategic legal inquiries.</p>
            </div>

            <div className="contact-details-list">
              <div className="detail-item">
                <div className="icon-box">📍</div>
                <div className="detail-content">
                  <h3>Legal Command Center</h3>
                  <p>Cyber City, Phase II, Gurugram, India</p>
                </div>
              </div>

              <div className="detail-item">
                <div className="icon-box">📧</div>
                <div className="detail-content">
                  <h3>Digital Correspondence</h3>
                  <p>strategy@sentira.law</p>
                </div>
              </div>

              <div className="detail-item">
                <div className="icon-box">📞</div>
                <div className="detail-content">
                  <h3>Priority Line</h3>
                  <p>+91 (0124) 456-7890</p>
                </div>
              </div>
            </div>

            <div className="status-indicator">
              <div className="pulse-dot"></div>
              <span>Sentira AI is currently online & processing inquiries</span>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="contact-form-panel premium-card neon-border-primary">
            <form onSubmit={handleSubmit} className="premium-form">
              <div className="form-section-title">
                <h2>Send Message</h2>
                <div className="title-underline"></div>
              </div>

              <div className="input-group">
                <label htmlFor="fullName">Full Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your legal name"
                    disabled={isLoading}
                  />
                  <div className="input-glow"></div>
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="identity@sentira.law"
                      disabled={isLoading}
                    />
                    <div className="input-glow"></div>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="input-wrapper">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                      disabled={isLoading}
                    />
                    <div className="input-glow"></div>
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="subject">Subject</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="Topic of Consultation"
                    disabled={isLoading}
                  />
                  <div className="input-glow"></div>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="message">Detailed Message</label>
                <div className="input-wrapper">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Describe your legal requirement in detail..."
                    rows={4}
                    disabled={isLoading}
                  />
                  <div className="input-glow"></div>
                </div>
              </div>

              {error && (
                <div className="form-feedback error ultra-glass animate-fade-in">
                  <span className="icon">⚠️</span>
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="form-feedback success ultra-glass animate-fade-in">
                  <span className="icon">✨</span>
                  <p>{success}</p>
                </div>
              )}

              <button
                type="submit"
                className={`btn-submit-premium ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loader-container">
                    <span className="spinner-s"></span>
                    Transmitting...
                  </span>
                ) : (
                  <>
                    <span>Send Protocol</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
