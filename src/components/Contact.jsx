import { useState } from 'react'
import { apiUrl } from '../apiClient'
import './Contact.css'

export default function Contact({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
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
      const response = await fetch(apiUrl('/api/contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message || 'Message sent successfully!')
        
        // Clear form on success
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
      } else {
        setError(data.message || 'Failed to send message. Please try again.')
      }
    } catch (err) {
      console.error('Contact form error:', err)
      setError('Connection error. Please ensure the server is running and try again.')
    } finally {
      setIsLoading(false)
    }
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
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
                disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="error-message" style={{
                color: '#ef4444',
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '0.5rem',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}

            {success && (
              <div className="success-message" style={{
                color: '#10b981',
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '0.5rem',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                fontSize: '0.875rem'
              }}>
                {success}
              </div>
            )}

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isLoading}
              style={{ 
                opacity: isLoading ? 0.7 : 1, 
                cursor: isLoading ? 'not-allowed' : 'pointer' 
              }}
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div className="contact-info-section">
        </div>
      </div>
    </div>
  )
}
