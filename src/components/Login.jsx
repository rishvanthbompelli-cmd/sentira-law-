import { useState } from 'react'
import { apiUrl } from '../apiClient'
import './Login.css'

export default function Login({ onNavigate, onLoginSuccess }) {
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

      if (data.success) {
        setSuccess(data.message || (isLoginMode ? 'Login successful!' : 'Registration successful!'))
        
        // Store user data if provided
        const userData = data.user || {
          name: formData.name || 'Sentira User',
          email: formData.email,
          id: 'user-' + Date.now()
        }

        if (data.token) {
          localStorage.setItem('token', data.token)
        }

        // Clear form
        setFormData({
          name: '',
          email: '',
          password: ''
        })

        // Call login success callback
        if (onLoginSuccess) {
          onLoginSuccess(userData)
        }

        // Navigate to home
        if (onNavigate) {
          onNavigate('home')
        }
      } else {
        setError(data.message || 'Login failed. Please try again.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Connection error. Please ensure the server is running and try again.')
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
    <div className="glass-container flex items-center justify-center p-0">
      <div className="login-card-premium premium-card neon-border-primary vibrant-glow-primary max-w-[500px] w-full mt-[10vh]">
        <div className="login-header-p text-center mb-10">
          <div className="login-logo-p text-5xl mb-6">⚖️</div>
          <h1 className="text-grad-royal text-3xl font-black mb-2">{isLoginMode ? 'Vance Authenticator' : 'Neural Induction'}</h1>
          <p className="text-slate-400">
            {isLoginMode
              ? 'Access your secure legal command interface'
              : 'Initialize your presence in the Sentira legal network'}
          </p>
        </div>

        <form className="login-form-p" onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="form-group mb-6">
              <label className="form-label-premium">Legal Identity (Name)</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLoginMode}
                className="form-input-premium"
                placeholder="Full Legal Name"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="form-group mb-6">
            <label className="form-label-premium">Digital Key (Email)</label>
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

          <div className="form-group mb-8">
            <label className="form-label-premium">Security Cipher (Password)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="form-input-premium"
              placeholder="••••••••••••"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="error-card-premium ultra-glass text-red-400 p-4 rounded-xl mb-8 border border-red-500/30 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="success-banner-p ultra-glass text-accent p-4 rounded-xl mb-8 border border-accent/30 text-sm">
              {success}
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
                Processing...
              </span>
            ) : (isLoginMode ? 'Authorize Access' : 'Create Profile')}
          </button>
        </form>

        <div className="login-footer-p mt-10 text-center">
          <p className="text-slate-500 text-sm">
            {isLoginMode ? "No security profile yet? " : "Already verified? "}
            <button 
              type="button" 
              className="text-accent hover:text-white underline font-bold transition-colors" 
              onClick={toggleMode}
              disabled={isLoading}
            >
              {isLoginMode ? 'Init Induction' : 'Authorize Now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
