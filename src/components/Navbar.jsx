import { useState } from 'react'
import './Navbar.css'

export default function Navbar({ currentPage, onNavigate, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'case-submission', label: 'Submit Case' },
    { id: 'top-lawyers', label: 'Top Lawyers' },
    { id: 'lawyer-locations', label: 'Locations' },
    { id: 'case-dashboard', label: 'Dashboard' },
    { id: 'contact', label: 'Contact Us' }
  ]

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-100 ultra-glass border-b border-white/10 shadow-2xl">
      <div className="navbar-container">
        {/* Left Section - Logo */}
        <a href="#" className="navbar-left" onClick={() => onNavigate('home')}>
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
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        {/* Right Section - New Case Button and Logout */}
        <div className="navbar-right">
          {user ? (
            <button className="btn-logout" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <button 
              className="btn-login"
              onClick={() => onNavigate('login')}
            >
              <span>Login</span>
            </button>
          )}
          <button 
            className="btn-primary-premium flex items-center gap-2 px-6 py-2"
            onClick={() => onNavigate('case-submission')}
          >
            <span className="text-xl">+</span>
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
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  )
}
