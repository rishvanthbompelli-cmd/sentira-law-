import { useState } from 'react'
import './styles/colors.css'
import './styles/global.css'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CaseSubmissionForm from './components/CaseSubmissionForm'
import TopLawyers from './components/TopLawyers'
import LawyerProfile from './components/LawyerProfile'
import QRCaseAccess from './components/QRCaseAccess'
import CaseDashboard from './components/CaseDashboard'

function App() {
  const [currentPage, setCurrentPage] = useState('case-submission')

  const handleNavigation = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
        <Navbar currentPage={currentPage} onNavigate={handleNavigation} />
        
        <main className="main-content">
          {/* NAVBAR 1 - Case Submission */}
          {currentPage === 'case-submission' && <CaseSubmissionForm onNavigate={handleNavigation} />}
          
          {/* NAVBAR 2 - Top Lawyers */}
          {currentPage === 'top-lawyers' && <TopLawyers onNavigate={handleNavigation} />}
          
          {/* NAVBAR 3 - Lawyer Profile */}
          {currentPage.startsWith('lawyer-profile-') && <LawyerProfile lawyerId={currentPage.split('-')[2]} onNavigate={handleNavigation} />}
          
          {/* NAVBAR 4 - QR Case Access */}
          {currentPage.startsWith('qr-case-') && <QRCaseAccess caseId={currentPage.split('-')[2]} onNavigate={handleNavigation} />}
          
          {/* NAVBAR 5 - Case Dashboard */}
          {currentPage === 'case-dashboard' && <CaseDashboard onNavigate={handleNavigation} />}
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
