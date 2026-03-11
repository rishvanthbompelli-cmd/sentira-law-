import { useState } from 'react'
import './Navbar.css'

export default function Navbar({ currentPage, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'case-submission', label: 'Submit Case', icon: '📝' },
    { id: 'top-lawyers', label: 'Top Lawyers', icon: '⚖️' },
    { id: 'lawyer-locations', label: 'Locations', icon: '📍' },
    { id: 'case-dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'qr-access', label: 'QR Code', icon: '📱' }
  ]

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Section - Logo */}
        <a href="#" className="navbar-left" onClick={() => onNavigate('case-submission')}>
          <div className="navbar-logo-icon">⚖️</div>
          <span className="navbar-logo-text">Sentira-Law</span>
        </a>

        {/* Center Section - Navigation Links */}
        <div className="navbar-center">
          {navItems.map((item) => (
            <a
              key={item.id}
              href="#"
              className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                onNavigate(item.id)
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        {/* Right Section - New Case Button */}
        <div className="navbar-right">
          <button 
            className="btn-new-case"
            onClick={() => onNavigate('case-submission')}
          >
            <span className="btn-new-case-icon">+</span>
            <span>New Case</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          <span className="mobile-menu-icon">{mobileMenuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div className={`mobile-dropdown ${mobileMenuOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <a
            key={item.id}
            href="#"
            className={`mobile-nav-link ${currentPage === item.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              onNavigate(item.id)
              setMobileMenuOpen(false)
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  )
}
