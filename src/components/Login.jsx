import { useState } from 'react'
import './Login.css'

export default function Login({ onNavigate, onLoginSuccess }) {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isLoginMode ? '/login' : '/register'
      
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      // Store token and user info
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Call the onLoginSuccess callback
      if (onLoginSuccess) {
        onLoginSuccess(data.user)
      }

      // Navigate to dashboard
      onNavigate('case-dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode)
    setError('')
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
                placeholder="Enter your full name"
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
              placeholder="your.email@example.com"
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
              placeholder="Enter your password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Please wait...' : (isLoginMode ? 'Login' : 'Create Account')}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <button type="button" className="toggle-btn" onClick={toggleMode}>
              {isLoginMode ? 'Create Account' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
