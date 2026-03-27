import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './styles/colors.css'
import './styles/global.css'
import './App.css'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SubmitCase from './components/SubmitCase'
import TopLawyers, { preloadLawyers } from './components/TopLawyers'
import LawyerDetail from './components/LawyerDetail'
import QRCaseAccess from './components/QRCaseAccess'
import CaseDashboard from './components/CaseDashboard'
import LawyerLocation from './components/LawyerLocation'
import Login from './components/Login'
import Contact from './components/Contact'
import Home from './components/Home'
import FloatingChatbot from './components/FloatingChatbot'

import { CasesProvider, preloadCases } from './context/CasesContext'

// 🔹 Component to sync location with legacy currentPage state for Navbar compatibility
function NavigationSync({ setCurrentPage }) {
  const location = useLocation()
  
  useEffect(() => {
    const path = location.pathname
    if (path === '/') setCurrentPage('home')
    else if (path === '/login') setCurrentPage('login')
    else if (path === '/lawyers') setCurrentPage('top-lawyers')
    else if (path === '/submit') setCurrentPage('case-submission')
    else if (path === '/dashboard') setCurrentPage('case-dashboard')
    else if (path === '/contact') setCurrentPage('contact')
    else if (path.startsWith('/lawyer/')) setCurrentPage('top-lawyers') // Highlight 'Top Lawyers' in navbar when viewing a detail
  }, [location, setCurrentPage])
  
  return null
}

function AppContent({ user, setUser, currentPage, setCurrentPage, handleLoginSuccess, handleLogout }) {
  const location = useLocation()

  return (
    <div className="app-container">
      <NavigationSync setCurrentPage={setCurrentPage} />
      
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
      {user && <Navbar currentPage={currentPage} onNavigate={() => {}} user={user} onLogout={handleLogout} />}
      
      {/* Main Content Area */}
      <main className="main-content">
        <div className="content-wrapper">
          <Routes>
            {!user ? (
              <Route path="*" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            ) : (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/submit" element={<SubmitCase />} />
                <Route path="/lawyers" element={<TopLawyers />} />
                <Route path="/lawyer/:id" element={<LawyerDetail />} />
                <Route path="/lawyer-locations" element={<LawyerLocation />} />
                <Route path="/qr-access" element={<QRCaseAccess />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/dashboard" element={<CaseDashboard />} />
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </div>

        {user && <Footer />}
        {user && <FloatingChatbot />}
      </main>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })
  
  const [currentPage, setCurrentPage] = useState('home')

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

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <CasesProvider>
      <Router>
        <AppContent 
          user={user} 
          setUser={setUser}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          handleLoginSuccess={handleLoginSuccess}
          handleLogout={handleLogout}
        />
      </Router>
    </CasesProvider>
  )
}

export default App;