import { useState, useEffect } from 'react'
import './styles/colors.css'
import './styles/global.css'
import './App.css'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SubmitCase from './components/SubmitCase'
import TopLawyers, { preloadLawyers } from './components/TopLawyers'
import QRCaseAccess from './components/QRCaseAccess'
import CaseDashboard from './components/CaseDashboard'
import LawyerLocation from './components/LawyerLocation'
import Login from './components/Login'
import Contact from './components/Contact'
import Home from './components/Home'

import { CasesProvider, preloadCases } from './context/CasesContext'

// 🔹 Get initial page
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
  } else if (hash === '/submit') {
    return 'case-submission'
  }

  // 🔴 DEFAULT = LOGIN
  return 'home'
}

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })
  
  const [currentPage, setCurrentPage] = useState(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) return 'login'
    return getInitialPage()
  })

  // 🔹 Check stored login
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // 🔹 Preload data
  useEffect(() => {
    preloadLawyers().catch(() => { })
    preloadCases().catch(() => { })
  }, [])

  // 🔹 Login success
  const handleLoginSuccess = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)

    // After login go to home
    handleNavigation('home')
  }

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    handleNavigation('login')
  }

  // 🔹 Navigation
  const handleNavigation = (page) => {
    setCurrentPage(page)

    if (page.startsWith('case-access-')) {
      const caseId = page.replace('case-access-', '')
      window.location.hash = `/case-access/${caseId}`
    } else if (page.startsWith('top-lawyers-')) {
      const lawyerId = page.replace('top-lawyers-', '')
      window.location.hash = `/lawyers/${lawyerId}`
    } else if (page === 'case-dashboard') {
      window.location.hash = '/dashboard'
    } else if (page === 'top-lawyers') {
      window.location.hash = '/lawyers'
    } else if (page === 'lawyer-locations') {
      window.location.hash = '/lawyer-locations'
    } else if (page === 'qr-access') {
      window.location.hash = '/qr-access'
    } else if (page === 'contact') {
      window.location.hash = '/contact'
    } else if (page === 'login') {
      window.location.hash = '/login'
    } else if (page === 'case-submission') {
      window.location.hash = '/submit'
    } else if (page === 'home') {
      window.location.hash = '/'
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 🔹 Hash change listener
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      
      const storedUser = localStorage.getItem('user')
      if (!storedUser) {
        if (hash !== '/login') {
          window.location.hash = '/login'
        }
        setCurrentPage('login')
        return
      }

      if (hash.includes('/case-access/')) {
        const caseId = hash.split('/case-access/')[1]
        setCurrentPage(`case-access-${caseId}`)
      } else if (hash.includes('/lawyers/')) {
        const lawyerId = hash.split('/lawyers/')[1]
        setCurrentPage(`top-lawyers-${lawyerId}`)
      } else if (hash === '/dashboard') {
        setCurrentPage('case-dashboard')
      } else if (hash === '/lawyers') {
        setCurrentPage('top-lawyers')
      } else if (hash === '/lawyer-locations') {
        setCurrentPage('lawyer-locations')
      } else if (hash === '/qr-access') {
        setCurrentPage('qr-access')
      } else if (hash === '/contact') {
        setCurrentPage('contact')
      } else if (hash === '/submit') {
        setCurrentPage('case-submission')
      } else {
        setCurrentPage('home')
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [user])

  return (
    <CasesProvider>

      {/* Background */}
      <div className="animated-background">
        <div className="gradient-bg"></div>
        <div className="floating-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      <div className="bg-overlay"></div>

       {/* Navbar - fixed at top */}
      {user && <Navbar currentPage={currentPage} onNavigate={handleNavigation} user={user} onLogout={handleLogout} />}
      
      {/* Main Content Area */}
      <main className="main-content">
        <div className="content-wrapper">
          {!user ? (
            <Login onNavigate={handleNavigation} onLoginSuccess={handleLoginSuccess} />
          ) : (
            <>
              {currentPage === 'home' && <Home onNavigate={handleNavigation} />}
              
              {currentPage === 'case-submission' && <SubmitCase onNavigate={handleNavigation} />}
              
              {(currentPage === 'top-lawyers' || currentPage.startsWith('top-lawyers-')) && (
                <TopLawyers 
                  lawyerId={currentPage.startsWith('top-lawyers-') ? currentPage.replace('top-lawyers-', '') : null} 
                  onNavigate={handleNavigation} 
                />
              )}
              
              {(currentPage === 'lawyer-locations' || currentPage.startsWith('lawyer-locations-')) && (
                <LawyerLocation 
                  lawyerId={currentPage.startsWith('lawyer-locations-') ? currentPage.replace('lawyer-locations-', '') : null} 
                  onNavigate={handleNavigation} 
                />
              )}
              
              {currentPage === 'qr-access' && <QRCaseAccess caseId={null} onNavigate={handleNavigation} />}
              
              {currentPage.startsWith('case-access-') && <QRCaseAccess caseId={currentPage.split('-')[2]} onNavigate={handleNavigation} />}
              
              {currentPage === 'contact' && <Contact onNavigate={handleNavigation} />}
              
              {currentPage === 'login' && <Login onNavigate={handleNavigation} onLoginSuccess={handleLoginSuccess} />}
              
              {currentPage === 'case-dashboard' && <CaseDashboard onNavigate={handleNavigation} />}
            </>
          )}
        </div>

        {user && <Footer />}
      </main>
    </CasesProvider>
  )
}

export default App;