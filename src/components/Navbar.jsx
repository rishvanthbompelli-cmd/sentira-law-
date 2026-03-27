import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar({ currentPage, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'case-submission', label: 'Submit Case', path: '/submit' },
    { id: 'top-lawyers', label: 'Top Lawyers', path: '/lawyers' },
    { id: 'lawyer-locations', label: 'Locations', path: '/lawyer-locations' },
    { id: 'case-dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'contact', label: 'Contact Us', path: '/contact' }
  ]

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] ultra-glass border-b border-white/10 shadow-2xl">
      <div className="navbar-container">
        {/* Left Section - Logo */}
        <Link to="/" className="navbar-left">
          <div className="navbar-logo-icon">⚖️</div>
          <span className="navbar-logo-text uppercase tracking-widest font-black">Sentira-Law</span>
        </Link>

        {/* Center Section - Navigation Links */}
        <div className="navbar-center">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Right Section - New Case Button and Logout */}
        <div className="navbar-right">
          {user ? (
            <button className="btn-logout" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn-login">
              <span>Login</span>
            </Link>
          )}
          <Link 
            to="/submit"
            className="btn-primary-premium flex items-center gap-2 px-6 py-2 no-underline"
          >
            <span className="text-xl">+</span>
            <span>New Case</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          <span className="mobile-menu-icon">{mobileMenuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div className={`mobile-dropdown ${mobileMenuOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`mobile-nav-link ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
