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
      // ⚠️ IMPORTANT: Replace this URL with your actual n8n Test Webhook URL!
      // 1. Double-click the Webhook node in n8n.
      // 2. Click "Test URL" and copy the link (e.g., http://localhost:5678/webhook-test/...)
      // 3. Make sure "Respond to CORS" is enabled in the Webhook node settings.
      // We use the exact URL requested
      const n8nWebhookUrl = 'https://basinlike-hermila-nonmeditative.ngrok-free.dev/webhook-test/webform';

      // Send the data to n8n
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' // Needed to bypass ngrok HTML intercept screen
        },
        body: JSON.stringify({
          name: formData.name, // Included for register mode
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        console.log("Success! Credentials sent to n8n.");
        
        // n8n doesn't return user tokens yet, so we set a mock session to let them into the dashboard
        const mockUser = {
          name: formData.name || 'Sentira User',
          email: formData.email,
          id: 'user-' + Date.now()
        };
        
        localStorage.setItem('token', 'n8n-session-token');
        localStorage.setItem('user', JSON.stringify(mockUser));

        if (onLoginSuccess) {
          onLoginSuccess(mockUser);
        }
        
        // Navigate to home automatically
        onNavigate('home');
      } else {
        console.error("Failed to reach n8n.");
        throw new Error(`Failed to login via n8n webhook (Status: ${response.status}). Please check your Webhook URL.`);
      }
    } catch (error) {
      console.error('Full error object:', error);
      // Give the user a more descriptive error if it's a fetch failure (usually CORS or offline)
      if (error.message === 'Failed to fetch') {
         setError("Connection blocked. Please ensure 'Respond to CORS' is enabled in your n8n Webhook node, the correct URL is set in Login.jsx, and you clicked 'Listen for Test Event'.");
      } else {
         setError(error.message || "An error occurred while connecting.");
      }
    } finally {
      setLoading(false);
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
              type="text"
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
