import { useState, useEffect } from 'react'
import './styles/colors.css'
import './styles/global.css'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CaseSubmissionForm from './components/CaseSubmissionForm'
import TopLawyers from './components/TopLawyers'
import QRCaseAccess from './components/QRCaseAccess'
import CaseDashboard from './components/CaseDashboard'
import LawyerLocation from './components/LawyerLocation'
import Support from './components/Support'
import Login from './components/Login'
import Contact from './components/Contact'

// Get initial page from hash or default to case-submission
const getInitialPage = () => {
  const hash = window.location.hash.replace('#', '')
  
  if (hash.includes('/case-access/')) {
    const caseId = hash.split('/case-access/')[1]
    return `case-access-${caseId}`
  } else if (hash === '/dashboard') {
    return 'case-dashboard'
  } else if (hash === '/lawyers') {
    return 'top-lawyers'
  } else if (hash === '/lawyer-locations') {
    return 'lawyer-locations'
  } else if (hash === '/qr-access') {
    return 'qr-access'
  } else if (hash === '/contact' || hash === '/support') {
    return 'contact'
  } else if (hash === '/login') {
    return 'login'
  }
  
  return 'case-submission'
}

function App() {
  const [currentPage, setCurrentPage] = useState(getInitialPage)
  const [user, setUser] = useState(null)

  // Check for existing user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLoginSuccess = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    handleNavigation('case-submission')
  }

  const handleNavigation = (page) => {
    setCurrentPage(page)
    // Update URL hash for QR code compatibility
    if (page.startsWith('case-access-')) {
      const caseId = page.replace('case-access-', '')
      window.location.hash = `/case-access/${caseId}`
    } else if (page === 'case-dashboard') {
      window.location.hash = '/dashboard'
    } else if (page === 'top-lawyers') {
      window.location.hash = '/lawyers'
    } else if (page.startsWith('lawyer-locations-')) {
      const lawyerId = page.replace('lawyer-locations-', '')
      window.location.hash = `/lawyer-locations-${lawyerId}`
    } else if (page === 'lawyer-locations') {
      window.location.hash = '/lawyer-locations'
    } else if (page === 'qr-access') {
      window.location.hash = '/qr-access'
    } else if (page === 'contact') {
      window.location.hash = '/contact'
    } else if (page === 'login') {
      window.location.hash = '/login'
    } else if (page === 'case-submission') {
      window.location.hash = '/'
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle hash-based routing for QR code links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      
      if (hash.includes('/case-access/')) {
        const caseId = hash.split('/case-access/')[1]
        setCurrentPage(`case-access-${caseId}`)
      } else if (hash === '/dashboard') {
        setCurrentPage('case-dashboard')
      } else if (hash === '/lawyers') {
        setCurrentPage('top-lawyers')
      } else if (hash.includes('/lawyer-locations-')) {
        const lawyerId = hash.split('/lawyer-locations-')[1]
        setCurrentPage(`lawyer-locations-${lawyerId}`)
      } else if (hash === '/lawyer-locations') {
        setCurrentPage('lawyer-locations')
      } else if (hash === '/qr-access') {
        setCurrentPage('qr-access')
      } else if (hash === '/support' || hash === '/contact') {
        setCurrentPage('contact')
      } else if (hash === '/login') {
        setCurrentPage('login')
      } else if (hash === '/' || hash === '') {
        setCurrentPage('case-submission')
      }
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <div className="app">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="gradient-bg"></div>
        <div className="floating-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      {/* Overlay for readability */}
      <div className="bg-overlay"></div>

      {/* Main Content */}
      <div className="content-wrapper">
        <Navbar currentPage={currentPage} onNavigate={handleNavigation} user={user} onLogout={handleLogout} />
        
        <main className="main-content">
          {/* Submit Case */}
          {currentPage === 'case-submission' && <CaseSubmissionForm onNavigate={handleNavigation} />}
          
          {/* Top Lawyers */}
          {currentPage === 'top-lawyers' && <TopLawyers onNavigate={handleNavigation} />}
          
          {/* Lawyer Locations */}
          {(currentPage === 'lawyer-locations' || currentPage.startsWith('lawyer-locations-')) && (
            <LawyerLocation 
              lawyerId={currentPage.startsWith('lawyer-locations-') ? currentPage.replace('lawyer-locations-', '') : null} 
              onNavigate={handleNavigation} 
            />
          )}
          
          {/* QR Code Access */}
          {currentPage === 'qr-access' && <QRCaseAccess caseId={null} onNavigate={handleNavigation} />}
          
          {/* QR Case Access (specific case) */}
          {currentPage.startsWith('case-access-') && <QRCaseAccess caseId={currentPage.split('-')[2]} onNavigate={handleNavigation} />}
          
          {/* Contact Page */}
          {currentPage === 'contact' && <Contact onNavigate={handleNavigation} />}
          
          {/* Login Page */}
          {currentPage === 'login' && <Login onNavigate={handleNavigation} onLoginSuccess={handleLoginSuccess} />}
          
          {/* Case Dashboard */}
          {currentPage === 'case-dashboard' && <CaseDashboard onNavigate={handleNavigation} />}
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
