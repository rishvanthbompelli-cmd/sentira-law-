import { useState } from 'react'
import { apiUrl } from '../apiClient'
import './Contact.css'

export default function Contact() {
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
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message
        })
      })

      const data = await response.json()

      if (data.status === 'success' || data.success) {
        setSuccess('Successfully saved to Database and Email Sent!')
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
        
        setTimeout(() => {
          setSuccess('')
        }, 5000)
      } else {
        setError(data.message || 'Submission failed. Please check your inputs.')
      }
    } catch (err) {
      console.error('Contact form error:', err)
      setError('Backend server is offline. Please start the Node.js server.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="glass-container">
      <div className="contact-header-premium ultra-glass neon-border-primary mb-12">
        <h1 className="text-grad-royal">Connect with Sentira</h1>
        <p className="text-slate-300">
          Neural-assisted client support and strategic legal inquiries.
          Our specialists are ready to analyze your scenario.
        </p>
      </div>

      <div className="contact-content-premium">
        <div className="contact-form-wrapper premium-card neon-border-accent vibrant-glow-accent">
          <form className="contact-form-p" onSubmit={handleSubmit}>
            <div className="form-group mb-6">
              <label className="form-label-premium" htmlFor="contact-name">Full Name</label>

              <input
                type="text"
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="form-input-premium relative z-10"
                placeholder="Full Name"
                disabled={isLoading}
              />

            </div>

            <div className="form-row-premium mb-6">
              <div className="form-group">
                <label className="form-label-premium" htmlFor="contact-email">Email Address</label>

                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input-premium relative z-10"
                  placeholder="identity@sentira.law"
                  disabled={isLoading}
                />

              </div>

              <div className="form-group">
                <label className="form-label-premium" htmlFor="contact-phone">Phone Number</label>

                <input
                  type="tel"
                  id="contact-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input-premium relative z-10"
                  placeholder="+91 XXXXX XXXXX"
                  disabled={isLoading}
                />

              </div>
            </div>

            <div className="form-group mb-6">
              <label className="form-label-premium" htmlFor="contact-subject">Subject</label>

              <input
                type="text"
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="form-input-premium relative z-10"
                placeholder="Subject of Consultation"
                disabled={isLoading}
              />

            </div>

            <div className="form-group mb-8">
              <label className="form-label-premium" htmlFor="contact-message">Detailed Message</label>

              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                className="form-input-premium relative z-10 min-h-[150px]"
                placeholder="Describe your legal inquiry or technical requirement in detail..."
                rows={5}
                disabled={isLoading}
              />

            </div>

            {error && (
              <div className="error-card-premium ultra-glass text-red-400 p-4 rounded-xl mb-6 border border-red-500/30 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="success-banner-p ultra-glass text-accent p-4 rounded-xl mb-6 border border-accent/30 text-sm text-center">
                ✨ {success}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary-premium w-full py-4 text-lg font-black"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner-premium m-0 w-5 h-5 border-2"></span>
                  Sending...
                </span>
              ) : 'Send Message'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}
