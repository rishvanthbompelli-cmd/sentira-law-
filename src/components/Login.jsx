import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiUrl } from '../apiClient'
import './Login.css'

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate()
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
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
      const endpoint = isLoginMode ? '/api/login' : '/api/register'
      
      const response = await fetch(apiUrl(endpoint), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          ...(isLoginMode ? {} : { name: formData.name })
        })
      })

      const data = await response.json()

      if (data.success || data.status === 'success' || data.authenticated) {
        setSuccess('Successfully saved to Database and Email Sent!')

        const userData = data.user || {
          name: formData.name || 'Sentira User',
          email: formData.email,
          id: 'user-' + Date.now()
        }

        if (data.token) {
          localStorage.setItem('token', data.token)
        }

        setFormData({ name: '', email: '', password: '' })
        if (onLoginSuccess) onLoginSuccess(userData)
        
        setTimeout(() => {
          navigate('/dashboard')
        }, 1500)
      } else {
        setError(data.message || data.error || 'Authentication failed. Please check your credentials.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Backend server is offline. Please start the Node.js server.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode)
    setError('')
    setSuccess('')
    setFormData({ name: '', email: '', password: '' })
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">⚖️</div>
          <h1>{isLoginMode ? 'Welcome Back' : 'Create Account'}</h1>
          <p>
            {isLoginMode
              ? 'Sign in to access your Sentira-Law dashboard'
              : 'Join Sentira-Law to submit cases and connect with lawyers'}
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLoginMode}
                className="relative z-10"
                placeholder="Enter your full name"
                disabled={isLoading}
              />

            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="relative z-10"
              placeholder="your.email@example.com"
              disabled={isLoading}
            />

          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="relative z-10"
              placeholder="Enter your password"
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
            className="login-btn"
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Please wait...' : (isLoginMode ? 'Login' : 'Create Account')}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              className="toggle-btn"
              onClick={toggleMode}
              disabled={isLoading}
            >
              {isLoginMode ? 'Create Account' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
