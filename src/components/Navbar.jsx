import { useState } from 'react'
import './Navbar.css'

export default function Navbar({ currentPage, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleNavClick = (page) => {
    onNavigate(page)
    setMobileMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo and Brand */}
        <div className="navbar-brand">
          <button 
            className="logo-button"
            onClick={() => handleNavClick('case-submission')}
            aria-label="Home"
          >
            <span className="logo-icon">⚖️</span>
            <span className="logo-text">Sentira-Law</span>
          </button>
        </div>

        {/* Desktop Navigation Menu - 5 Main Features */}
        <ul className="nav-menu">
          <li className="nav-item">
            <button 
              className={`nav-link ${currentPage === 'case-submission' ? 'active' : ''}`}
              onClick={() => handleNavClick('case-submission')}
            >
              📝 Submit Case
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${currentPage === 'top-lawyers' ? 'active' : ''}`}
              onClick={() => handleNavClick('top-lawyers')}
            >
              👨‍⚖️ Top Lawyers
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${currentPage.startsWith('lawyer-profile') ? 'active' : ''}`}
              onClick={() => handleNavClick('top-lawyers')}
            >
              📋 Lawyer Profile
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${currentPage.startsWith('qr-case') ? 'active' : ''}`}
              onClick={() => handleNavClick('case-submission')}
            >
              📱 QR Access
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${currentPage === 'case-dashboard' ? 'active' : ''}`}
              onClick={() => handleNavClick('case-dashboard')}
            >
              📊 Dashboard
            </button>
          </li>
        </ul>

        {/* Right Side Buttons */}
        <div className="nav-actions">
          <button className="btn-mediate" onClick={() => handleNavClick('case-submission')}>
            <span className="btn-icon">✨</span>
            New Case
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <ul className="mobile-nav-menu">
            <li><button onClick={() => handleNavClick('case-submission')}>📝 Submit Case</button></li>
            <li><button onClick={() => handleNavClick('top-lawyers')}>👨‍⚖️ Top Lawyers</button></li>
            <li><button onClick={() => handleNavClick('top-lawyers')}>📋 Lawyer Profile</button></li>
            <li><button onClick={() => handleNavClick('case-submission')}>📱 QR Access</button></li>
            <li><button onClick={() => handleNavClick('case-dashboard')}>📊 Dashboard</button></li>
            <li className="mobile-divider"></li>
            <li><button className="btn-mediate" onClick={() => handleNavClick('case-submission')}>New Case</button></li>
          </ul>
        </div>
      )}
    </nav>
  )
}
