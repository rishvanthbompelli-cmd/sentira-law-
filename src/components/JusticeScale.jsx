import React, { useState } from 'react'
import './JusticeScale.css'

export default function JusticeScale() {
  const [login, setLogin] = useState({ email: '', password: '' })
  const [register, setRegister] = useState({ name: '', email: '', password: '', confirm: '' })

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLogin({ ...login, [name]: value })
  }

  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setRegister({ ...register, [name]: value })
  }

  const submitLogin = (e) => {
    e.preventDefault()
    console.log('Login:', login)
    alert(`Logging in ${login.email}`)
  }

  const submitRegister = (e) => {
    e.preventDefault()
    console.log('Register:', register)
    alert(`Registering ${register.name}`)
  }

  return (
    <div className="justice-scale-scene">
      <div className="login-panel">
        <h4>🔐 Login</h4>
        <form onSubmit={submitLogin} className="login-panel-form">
          <input name="email" type="email" placeholder="Email" value={login.email} onChange={handleLoginChange} required />
          <input name="password" type="password" placeholder="Password" value={login.password} onChange={handleLoginChange} required />
          <button className="login-panel-btn" type="submit">Login</button>
        </form>
      </div>

      <div className="scale-container">
        <div className="scale-pillar">
          <div className="pillar-metal"></div>
          <div className="pillar-holo">
            <div className="neural-lines"></div>
            <div className="neural-lines two"></div>
          </div>
        </div>

        <div className="scale-beam">
          <div className="scale-beam-core"></div>
        </div>

        <div className="scale-bowl left">
          <div className="bowl-metal"></div>
          <div className="bowl-content login-bowl">
            <h3 className="bowl-title">Balanced Justice</h3>
            <p style={{textAlign:'center', fontSize:'13px', color:'rgba(230,245,255,0.8)', marginTop:'8px'}}>Equity • Empathy • AI</p>
          </div>
        </div>

        <div className="scale-bowl right">
          <div className="bowl-metal silver"></div>
          <div className="bowl-content register-bowl">
            <h3 className="bowl-title">Create Account</h3>
            <form onSubmit={submitRegister} className="bowl-form">
              <input
                name="name"
                type="text"
                placeholder="Full name"
                value={register.name}
                onChange={handleRegisterChange}
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                value={register.email}
                onChange={handleRegisterChange}
                required
              />

              <input
                name="password"
                type="password"
                placeholder="Password"
                value={register.password}
                onChange={handleRegisterChange}
                required
              />

              <input
                name="confirm"
                type="password"
                placeholder="Confirm Password"
                value={register.confirm}
                onChange={handleRegisterChange}
                required
              />

              <button className="bowl-btn bowl-register" type="submit">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
