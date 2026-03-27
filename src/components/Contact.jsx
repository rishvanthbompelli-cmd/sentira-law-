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
              <label className="form-label-premium">Operational Identity (Full Name)</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="form-input-premium"
                placeholder="Full Name"
                disabled={isLoading}
              />
            </div>

            <div className="form-row-premium mb-6">
              <div className="form-group">
                <label className="form-label-premium">Digital Key (Email Address)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input-premium"
                  placeholder="identity@sentira.law"
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label className="form-label-premium">Direct Line (Phone Number)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input-premium"
                  placeholder="+91 XXXXX XXXXX"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group mb-6">
              <label className="form-label-premium">Inquiry Scope (Subject)</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="form-input-premium"
                placeholder="Subject of Consultation"
                disabled={isLoading}
              />
            </div>

            <div className="form-group mb-8">
              <label className="form-label-premium">Neural Input (Detailed Message)</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                className="form-input-premium min-h-[150px]"
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
                  Transmitting...
                </span>
              ) : 'Establish Liaison'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
