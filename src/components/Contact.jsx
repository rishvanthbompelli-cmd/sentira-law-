import { useState } from 'react'
import './Contact.css'

export default function Contact({ onNavigate }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, you would send this to a backend
    console.log('Contact form submitted:', formData)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="contact-container">
        <div className="contact-success">
          <div className="success-icon">✓</div>
          <h2>Message Sent Successfully!</h2>
          <p>We'll get back to you within 24-48 hours.</p>
          <button onClick={() => onNavigate('case-submission')}>Back to Home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Sentira-Law</h1>
        <p>If you have questions about legal assistance, case submissions, or lawyer recommendations, please contact us using the form below.</p>
      </div>

      <div className="contact-content">
        <div className="contact-form-section">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="What is this about?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Describe your inquiry in detail..."
                rows={5}
              />
            </div>

            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>

        <div className="contact-info-section">
          <div className="info-card">
            <h3>Customer Support Email</h3>
            <a href="mailto:support@sentira-law.com">support@sentira-law.com</a>
          </div>

          <div className="info-card">
            <h3>Office Location</h3>
            <p>New Delhi, India</p>
          </div>

          <div className="info-card">
            <h3>Working Hours</h3>
            <p>Monday – Friday</p>
            <p>9:00 AM – 6:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  )
}
