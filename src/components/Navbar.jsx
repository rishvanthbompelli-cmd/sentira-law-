import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Navbar.css'

export default function Navbar({ user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      // Add scrolled class if scrolled down more than 20px
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'case-submission', label: 'Submit Case', path: '/submit' },
    { id: 'top-lawyers', label: 'Top Lawyers', path: '/top-lawyers' },
    { id: 'lawyer-locations', label: 'Locations', path: '/lawyer-locations' },
    { id: 'case-dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'contact', label: 'Contact Us', path: '/contact' }
  ]

  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}
    >
      <nav className="navbar-glass">
        <div className="navbar-container">
          {/* Left Section - Logo */}
          <Link to="/" className="navbar-left">
            <div className="navbar-logo-icon">⚖️</div>
            <span className="navbar-logo-text">Sentira-Law</span>
          </Link>

          {/* Center Section - Navigation Links */}
          <div className="navbar-center">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                // react-router-dom NavLink provides the active class automatically
                className={({ isActive }) => `nav-link ${isActive && item.path !== '/' ? 'active' : ''}`}
                // Specific override for home to only be active on exact root
                end={item.path === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right Section - Buttons and Hamburger */}
          <div className="navbar-right">
            {user ? (
              <button className="btn-ghost" onClick={onLogout}>
                Logout
              </button>
            ) : (
              <Link to="/login" className="btn-login-ghost">
                Login
              </Link>
            )}
            
            <Link to="/submit" className="btn-new-case">
              <span className="btn-new-case-icon">+</span>
              <span>New Case</span>
            </Link>

            {/* Mobile Hamburger Menu */}
            <button 
              className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`} 
              onClick={toggleMobileMenu}
              aria-label="Toggle Navigation"
            >
              <div className="hamburger-icon"></div>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div className={`mobile-dropdown ${mobileMenuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `mobile-nav-link ${isActive && item.path !== '/' ? 'active' : ''}`}
              end={item.path === '/'}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </motion.div>
  )
}
