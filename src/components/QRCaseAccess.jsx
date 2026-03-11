import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import './QRCaseAccess.css'

// Lawyers data for recommendations
const lawyersData = [
  { id: 1, name: 'Adv. Priya Sharma', specialization: 'Criminal Law', rating: 4.9, phone: '+91 98765 43210' },
  { id: 2, name: 'Adv. Raj Khanna', specialization: 'Property Law', rating: 4.8, phone: '+91 98765 43211' },
  { id: 3, name: 'Adv. Anjali Menon', specialization: 'Family Law', rating: 4.9, phone: '+91 98765 43212' },
  { id: 4, name: 'Adv. Vikram Singh', specialization: 'Corporate Law', rating: 4.7, phone: '+91 98765 43213' }
]

export default function QRCaseAccess({ caseId, onNavigate }) {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recommendedLawyers, setRecommendedLawyers] = useState([])

  useEffect(() => {
    // Generate QR Code
    const generateQRCode = async () => {
      try {
        // In a real app, this would be the actual case access URL
        const caseUrl = `${window.location.origin}/case-access/${caseId}`
        
        const qrDataUrl = await QRCode.toDataURL(caseUrl, {
          width: 280,
          margin: 2,
          color: {
            dark: '#1e293b',
            light: '#ffffff'
          }
        })
        
        setQrCodeUrl(qrDataUrl)
      } catch (error) {
        console.error('Error generating QR code:', error)
      }
    }

    // Load case data from localStorage
    const loadCaseData = () => {
      const storedCase = localStorage.getItem(`case_${caseId}`)
      if (storedCase) {
        const parsed = JSON.parse(storedCase)
        setCaseData(parsed)
        
        // Get AI-recommended lawyers based on case type
        const issueType = parsed.issueType
        const matchingLawyers = lawyersData.filter(l => 
          l.specialization.toLowerCase().includes(issueType) || 
          (issueType === 'property' && l.specialization === 'Property Law') ||
          (issueType === 'rental' && l.specialization === 'Property Law') ||
          (issueType === 'family' && l.specialization === 'Family Law') ||
          (issueType === 'contract' && l.specialization === 'Corporate Law') ||
          (issueType === 'criminal' && l.specialization === 'Criminal Law')
        )
        
        // If no matches, show top lawyers
        setRecommendedLawyers(matchingLawyers.length > 0 ? matchingLawyers : lawyersData.slice(0, 3))
      }
      setLoading(false)
    }

    if (caseId) {
      generateQRCode()
      loadCaseData()
    }
  }, [caseId])

  const handleDownloadQR = () => {
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `case-qr-${caseId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShareCase = () => {
    if (navigator.share) {
      navigator.share({
        title: `Sentira-Law Case: ${caseId}`,
        text: `View case details for Case ID: ${caseId}`,
        url: `${window.location.origin}/case-access/${caseId}`
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/case-access/${caseId}`)
      alert('Case link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="qr-case-container">
        <div className="loading-state">
          <span className="loading-spinner"></span>
          <p>Loading case data...</p>
        </div>
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="qr-case-container">
        <div className="error-state">
          <span className="error-icon">❌</span>
          <h2>Case Not Found</h2>
          <p>No case found with ID: {caseId}</p>
          <button className="btn-back" onClick={() => onNavigate('case-submission')}>
            Submit New Case
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="qr-case-container">
      <div className="qr-case-header">
        <h1>📱 QR Case Access</h1>
        <p>Scan the QR code to access your case on any device</p>
      </div>

      <div className="qr-case-content">
        {/* QR Code Section */}
        <div className="qr-section">
          <div className="qr-card">
            <div className="qr-image-container">
              <img src={qrCodeUrl} alt="Case QR Code" className="qr-image" />
            </div>
            
            <div className="case-id-display">
              <span className="case-id-label">Case ID</span>
              <span className="case-id-value">{caseId}</span>
            </div>

            <div className="qr-actions">
              <button className="btn-qr-action" onClick={handleDownloadQR}>
                ⬇️ Download QR
              </button>
              <button className="btn-qr-action" onClick={handleShareCase}>
                📤 Share Case
              </button>
            </div>
          </div>
        </div>

        {/* Case Details Section */}
        <div className="details-section">
          <div className="case-details-card">
            <h2>📋 Case Details</h2>
            
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Applicant Name</span>
                <span className="detail-value">{caseData.fullName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Issue Type</span>
                <span className="detail-value issue-type">{caseData.issueType}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{caseData.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{caseData.phone}</span>
              </div>
            </div>

            <div className="problem-description">
              <h3>📝 Problem Description</h3>
              <p>{caseData.description}</p>
            </div>

            {/* AI Analysis Results */}
            {caseData.aiAnalysis && (
              <div className="ai-analysis-summary">
                <h3>🤖 AI Analysis</h3>
                <div className="analysis-badges">
                  <span className={`analysis-badge tone-${caseData.aiAnalysis.tone.toLowerCase()}`}>
                    Tone: {caseData.aiAnalysis.tone}
                  </span>
                  <span className={`analysis-badge complexity-${caseData.aiAnalysis.complexity.toLowerCase()}`}>
                    Complexity: {caseData.aiAnalysis.complexity}
                  </span>
                  <span className={`analysis-badge urgency-${caseData.aiAnalysis.urgencyLevel.toLowerCase()}`}>
                    Urgency: {caseData.aiAnalysis.urgencyLevel}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Recommended Lawyers */}
          <div className="recommended-lawyers-card">
            <h2>👨‍⚖️ Recommended Lawyers</h2>
            <p className="recommendation-note">Based on your case type</p>
            
            <div className="lawyers-list">
              {recommendedLawyers.map(lawyer => (
                <div key={lawyer.id} className="lawyer-item">
                  <div className="lawyer-info">
                    <span className="lawyer-name">{lawyer.name}</span>
                    <span className="lawyer-specialization">{lawyer.specialization}</span>
                  </div>
                  <div className="lawyer-rating">⭐ {lawyer.rating}</div>
                  <a href={`tel:${lawyer.phone}`} className="btn-call-lawyer">
                    📞 Contact
                  </a>
                </div>
              ))}
            </div>

            <button 
              className="btn-view-all-lawyers"
              onClick={() => onNavigate('top-lawyers')}
            >
              View All Lawyers →
            </button>
          </div>
        </div>
      </div>

      {/* Mobile-friendly notice */}
      <div className="mobile-notice">
        <span className="mobile-icon">📱</span>
        <p>Point your phone camera at the QR code to instantly access this case on your mobile device</p>
      </div>
    </div>
  )
}
