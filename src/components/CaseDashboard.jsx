import { useState, useEffect } from 'react'
import './CaseDashboard.css'

// Lawyers data for recommendations
const lawyersData = [
  { id: 1, name: 'Adv. Priya Sharma', specialization: 'Criminal Law', rating: 4.9, phone: '+91 98765 43210', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100' },
  { id: 2, name: 'Adv. Raj Khanna', specialization: 'Property Law', rating: 4.8, phone: '+91 98765 43211', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100' },
  { id: 3, name: 'Adv. Anjali Menon', specialization: 'Family Law', rating: 4.9, phone: '+91 98765 43212', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100' },
  { id: 4, name: 'Adv. Vikram Singh', specialization: 'Corporate Law', rating: 4.7, phone: '+91 98765 43213', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' }
]

export default function CaseDashboard({ onNavigate }) {
  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')
  const [recommendedLawyers, setRecommendedLawyers] = useState([])

  useEffect(() => {
    // Load the most recent case
    const recentCaseId = localStorage.getItem('recentCaseId')
    
    if (recentCaseId) {
      const storedCase = localStorage.getItem(`case_${recentCaseId}`)
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
        
        setRecommendedLawyers(matchingLawyers.length > 0 ? matchingLawyers : lawyersData.slice(0, 3))
      }
    }
    setLoading(false)
  }, [])

  const handleGenerateReport = () => {
    if (!caseData) return
    
    const reportContent = `
SENTIRA-LAW CASE REPORT
========================
Generated on: ${new Date().toLocaleDateString()}

CASE ID: ${caseData.caseId}
Submitted: ${new Date(caseData.submittedAt).toLocaleDateString()}

APPLICANT DETAILS
-----------------
Name: ${caseData.fullName}
Email: ${caseData.email}
Phone: ${caseData.phone}
Address: ${caseData.address}

CASE DETAILS
-----------
Issue Type: ${caseData.issueType}
Description: ${caseData.description}

${caseData.aiAnalysis ? `
AI ANALYSIS RESULTS
------------------
Tone: ${caseData.aiAnalysis.tone}
Complexity: ${caseData.aiAnalysis.complexity}
Urgency: ${caseData.aiAnalysis.urgencyLevel}
Sentiment Score: ${caseData.aiAnalysis.sentimentScore}/100

Key Points Identified:
${caseData.aiAnalysis.keyPoints.map(p => `- ${p}`).join('\n')}

Recommendations:
${caseData.aiAnalysis.recommendations.map(r => `- ${r}`).join('\n')}
` : ''}

DOCUMENTS UPLOADED
-----------------
${caseData.documents.idProof || 'No ID proof uploaded'}
${caseData.documents.agreementCopy || 'No agreement copy uploaded'}
${caseData.documents.chatScreenshot || 'No chat screenshots uploaded'}
${caseData.documents.emailEvidence || 'No email evidence uploaded'}

---
Sentira-Law - AI-Powered Emotional Legal Mediator
    `
    
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `case-report-${caseData.caseId}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleViewQRCode = () => {
    if (caseData) {
      onNavigate(`qr-case-${caseData.caseId}`)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <span className="loading-spinner"></span>
          <p>Loading case data...</p>
        </div>
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="dashboard-container">
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <h2>No Case Found</h2>
          <p>You haven't submitted any case yet. Start by submitting your legal issue.</p>
          <button className="btn-submit-case" onClick={() => onNavigate('case-submission')}>
            Submit New Case
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>📊 Case Dashboard</h1>
          <p>Track and manage your submitted case</p>
        </div>
        <div className="header-actions">
          <button className="btn-action" onClick={handleViewQRCode}>
            📱 View QR Code
          </button>
          <button className="btn-action btn-primary" onClick={handleGenerateReport}>
            📥 Download Report
          </button>
        </div>
      </div>

      {/* Case ID Banner */}
      <div className="case-id-banner">
        <div className="case-id-info">
          <span className="case-label">Case ID</span>
          <span className="case-value">{caseData.caseId}</span>
        </div>
        <div className="case-status">
          <span className="status-badge">Active</span>
          <span className="submitted-date">
            Submitted on {new Date(caseData.submittedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          📋 Case Details
        </button>
        <button 
          className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          🤖 AI Analysis
        </button>
        <button 
          className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          📎 Documents
        </button>
        <button 
          className={`tab ${activeTab === 'lawyers' ? 'active' : ''}`}
          onClick={() => setActiveTab('lawyers')}
        >
          👨‍⚖️ Suggested Lawyers
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'details' && (
          <div className="details-tab">
            <div className="details-card">
              <h3>👤 Applicant Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{caseData.fullName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{caseData.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{caseData.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Address</span>
                  <span className="info-value">{caseData.address}</span>
                </div>
              </div>
            </div>

            <div className="details-card">
              <h3>⚖️ Case Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Issue Type</span>
                  <span className="info-value issue-type">{caseData.issueType}</span>
                </div>
              </div>
              <div className="description-section">
                <h4>📝 Problem Description</h4>
                <p>{caseData.description}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && caseData.aiAnalysis && (
          <div className="analysis-tab">
            <div className="analysis-overview">
              <h3>📈 AI Analysis Overview</h3>
              
              <div className="analysis-cards">
                <div className="analysis-card">
                  <span className="card-label">Emotional Tone</span>
                  <span className={`card-value tone-${caseData.aiAnalysis.tone.toLowerCase()}`}>
                    {caseData.aiAnalysis.tone}
                  </span>
                </div>
                <div className="analysis-card">
                  <span className="card-label">Complexity</span>
                  <span className={`card-value complexity-${caseData.aiAnalysis.complexity.toLowerCase()}`}>
                    {caseData.aiAnalysis.complexity}
                  </span>
                </div>
                <div className="analysis-card">
                  <span className="card-label">Urgency</span>
                  <span className={`card-value urgency-${caseData.aiAnalysis.urgencyLevel.toLowerCase()}`}>
                    {caseData.aiAnalysis.urgencyLevel}
                  </span>
                </div>
                <div className="analysis-card">
                  <span className="card-label">Sentiment Score</span>
                  <div className="sentiment-bar">
                    <div 
                      className="sentiment-fill" 
                      style={{ width: `${caseData.aiAnalysis.sentimentScore}%` }}
                    />
                  </div>
                  <span className="sentiment-value">{caseData.aiAnalysis.sentimentScore}/100</span>
                </div>
              </div>
            </div>

            <div className="analysis-details">
              <div className="key-points-section">
                <h4>📌 Key Legal Points Identified</h4>
                <div className="points-list">
                  {caseData.aiAnalysis.keyPoints.map((point, index) => (
                    <span key={index} className="point-tag">{point}</span>
                  ))}
                </div>
              </div>

              <div className="recommendations-section">
                <h4>💡 AI Recommendations</h4>
                <ul className="recommendations-list">
                  {caseData.aiAnalysis.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="documents-tab">
            <h3>📎 Uploaded Documents</h3>
            <div className="documents-grid">
              <div className={`document-card ${caseData.documents.idProof ? 'has-file' : ''}`}>
                <span className="doc-icon">🪪</span>
                <span className="doc-name">ID Proof</span>
                <span className="doc-status">
                  {caseData.documents.idProof ? '✓ Uploaded' : '✗ Not uploaded'}
                </span>
              </div>
              <div className={`document-card ${caseData.documents.agreementCopy ? 'has-file' : ''}`}>
                <span className="doc-icon">📄</span>
                <span className="doc-name">Agreement Copy</span>
                <span className="doc-status">
                  {caseData.documents.agreementCopy ? '✓ Uploaded' : '✗ Not uploaded'}
                </span>
              </div>
              <div className={`document-card ${caseData.documents.chatScreenshot ? 'has-file' : ''}`}>
                <span className="doc-icon">💬</span>
                <span className="doc-name">Chat Screenshots</span>
                <span className="doc-status">
                  {caseData.documents.chatScreenshot ? '✓ Uploaded' : '✗ Not uploaded'}
                </span>
              </div>
              <div className={`document-card ${caseData.documents.emailEvidence ? 'has-file' : ''}`}>
                <span className="doc-icon">📧</span>
                <span className="doc-name">Email Evidence</span>
                <span className="doc-status">
                  {caseData.documents.emailEvidence ? '✓ Uploaded' : '✗ Not uploaded'}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lawyers' && (
          <div className="lawyers-tab">
            <h3>👨‍⚖️ AI-Recommended Lawyers</h3>
            <p className="recommendation-text">Based on your case type, these lawyers are recommended for you:</p>
            
            <div className="lawyers-cards">
              {recommendedLawyers.map(lawyer => (
                <div key={lawyer.id} className="lawyer-card">
                  <img src={lawyer.image} alt={lawyer.name} className="lawyer-photo" />
                  <div className="lawyer-details">
                    <span className="lawyer-name">{lawyer.name}</span>
                    <span className="lawyer-specialization">{lawyer.specialization}</span>
                    <span className="lawyer-rating">⭐ {lawyer.rating}</span>
                  </div>
                  <div className="lawyer-actions">
                    <a href={`tel:${lawyer.phone}`} className="btn-lawyer-action">
                      📞 Call
                    </a>
                    <button 
                      className="btn-lawyer-action btn-outline"
                      onClick={() => onNavigate(`lawyer-profile-${lawyer.id}`)}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-view-all" onClick={() => onNavigate('top-lawyers')}>
              View All Lawyers →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
