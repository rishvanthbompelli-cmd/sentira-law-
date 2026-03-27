import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './styles/colors.css'
import './styles/global.css'
import './App.css'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SubmitCase from './components/SubmitCase'
import TopLawyers, { preloadLawyers } from './components/TopLawyers'
import LawyerProfile from './components/LawyerProfile'
import QRCaseAccess from './components/QRCaseAccess'
import CaseDashboard from './components/CaseDashboard'
import LawyerLocation from './components/LawyerLocation'
import Login from './components/Login'
import Contact from './components/Contact'
import Home from './components/Home'
import ConflictAnalysis from './components/ConflictAnalysis'
import LegalDocs from './components/LegalDocs'
import MediationBridge from './components/MediationBridge'
import EmotionHeatMap from './components/EmotionHeatMap'
import FloatingChatbot from './components/FloatingChatbot'

import { CasesProvider, preloadCases } from './context/CasesContext'



function AppContent({ user, setUser, currentPage, setCurrentPage, handleLoginSuccess, handleLogout }) {
  const location = useLocation()

  return (
    <div className="app-container">
      
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
      {user && <Navbar user={user} onLogout={handleLogout} />}
      
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
                <Route path="/top-lawyers" element={<TopLawyers />} />
                <Route path="/lawyer/:id" element={<LawyerProfile />} />
                <Route path="/lawyer-locations" element={<LawyerLocation />} />
                <Route path="/qr-access" element={<QRCaseAccess />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/dashboard" element={<CaseDashboard />} />
                <Route path="/conflict-analysis" element={<ConflictAnalysis />} />
                <Route path="/legal-docs" element={<LegalDocs />} />
                <Route path="/mediation-bridge" element={<MediationBridge />} />
                <Route path="/emotion-heatmap" element={<EmotionHeatMap />} />
                <Route path="/ai-hub" element={<LegalDocs />} /> {/* Mapping ai-hub to LegalDocs or similar if intended */}
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </div>

        {user && <Footer />}

      </main>

      {/* Floating AI Chatbot - Only visible when logged in */}
      {user && <FloatingChatbot />}
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
      <AppContent 
        user={user} 
        setUser={setUser}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleLoginSuccess={handleLoginSuccess}
        handleLogout={handleLogout}
      />
    </CasesProvider>
  )
}

export default App;
