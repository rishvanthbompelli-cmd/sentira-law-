import './SignIn.css'

export default function SignIn() {
  const handleSignIn = (e) => {
    e.preventDefault()
    // Add sign-in logic here
    alert('Sign in feature coming soon!')
  }

  return (
    <section className="signin-section">
      <div className="signin-container">
        <div className="signin-card">
          <h1>Sign In</h1>
          <p className="signin-subtitle">Access your Sentira-Law account</p>

          <form onSubmit={handleSignIn}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#forgot" className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="btn-signin-submit">
              Sign In
            </button>
          </form>

          <div className="signin-divider">
            <span>or</span>
          </div>

          <button className="btn-social btn-google">
            <span>🔐</span> Sign in with Google
          </button>
          <button className="btn-social btn-microsoft">
            <span>🔐</span> Sign in with Microsoft
          </button>

          <p className="signin-footer">
            Don't have an account? <a href="#signup" className="signup-link">Create one now</a>
          </p>
        </div>

        <div className="signin-features">
          <h2>Why Sign In?</h2>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <h3>Track Your Cases</h3>
            <p>Monitor your mediation progress in real-time</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📝</span>
            <h3>Save Documents</h3>
            <p>Secure storage for all your legal documents</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔔</span>
            <h3>Get Updates</h3>
            <p>Instant notifications about your cases</p>
          </div>
        </div>
      </div>
    </section>
  )
}
