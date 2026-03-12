import { useState, useEffect } from 'react'
import './CaseDashboard.css'

export default function CaseDashboard({ onNavigate }) {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [similarCases, setSimilarCases] = useState([])
  const [loadingSimilar, setLoadingSimilar] = useState(false)
  const [selectedCaseForSimilarity, setSelectedCaseForSimilarity] = useState(null)

  useEffect(() => {
    // Get all cases from localStorage
    try {
      const storedCases = localStorage.getItem('cases')
      if (storedCases) {
        const parsedCases = JSON.parse(storedCases)
        // Sort by submission date, newest first
        parsedCases.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        setCases(parsedCases)
        
        // If there are cases, fetch similar cases for the most recent one
        if (parsedCases.length > 0) {
          fetchSimilarCases(parsedCases[0].caseId)
        }
      }
    } catch (err) {
      console.error('Error loading cases:', err)
    }
    setLoading(false)
  }, [])

  // Fetch similar cases from MongoDB
  const fetchSimilarCases = async (caseId) => {
    setLoadingSimilar(true)
    setSelectedCaseForSimilarity(caseId)
    try {
      const response = await fetch(`http://localhost:3001/api/cases/similar/${caseId}`)
      const data = await response.json()
      if (data.success) {
        setSimilarCases(data.similarCases || [])
      }
    } catch (err) {
      console.error('Error fetching similar cases:', err)
      // Use mock data if backend is not available
      setSimilarCases([
        {
          caseId: "CASE-001",
          caseType: "rental",
          caseDescription: "Tenant refusing to pay rent for commercial property. Landlord seeking eviction and unpaid rent recovery.",
          resolutionType: "Settlement",
          similarity: 82
        },
        {
          caseId: "CASE-002",
          caseType: "contract",
          caseDescription: "Client failed to make payment for services rendered. Seeking legal action for recovery of outstanding amount.",
          resolutionType: "Mediation",
          similarity: 76
        },
        {
          caseId: "CASE-007",
          caseType: "rental",
          caseDescription: "Landlord refusing to return security deposit after lease termination without valid reason.",
          resolutionType: "Mediation",
          similarity: 68
        }
      ])
    }
    setLoadingSimilar(false)
  }

  // Format the issue type for display
  const formatIssueType = (type) => {
    const typeMap = {
      'property': 'Property Dispute',
      'rental': 'Rental Matter',
      'contract': 'Contract Issue',
      'family': 'Family Law',
      'criminal': 'Criminal Defense',
      'consumer': 'Consumer Complaint',
      'employment': 'Employment Issue',
      'other': 'Other'
    }
    return typeMap[type] || type
  }

  // Format resolution type for display
  const formatResolutionType = (type) => {
    const typeMap = {
      'Mediation': 'Mediation',
      'Settlement': 'Negotiated Settlement',
      'Court': 'Court Judgment',
      'Pending': 'Pending'
    }
    return typeMap[type] || type
  }

  // Get color based on similarity percentage
  const getSimilarityColor = (similarity) => {
    if (similarity >= 80) return '#22c55e' // green
    if (similarity >= 60) return '#f59e0b' // amber
    return '#64748b' // slate
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Sample recommended lawyers
  const recommendedLawyers = [
    { name: "Harish Salve", specialization: "Corporate Law", location: "New Delhi" },
    { name: "Kapil Sibal", specialization: "Constitutional Law", location: "New Delhi" },
    { name: "Indira Jaising", specialization: "Human Rights Law", location: "Mumbai" }
  ]

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Case Dashboard</h1>
        <p>View all your submitted case details and recommended lawyers</p>
      </div>

      {cases.length > 0 ? (
        <>
          <div className="cases-list-section">
            <h2>Your Submitted Cases</h2>
            <div className="cases-scroll-container">
              {cases.map((caseItem) => (
                <div key={caseItem.caseId} className="case-card">
                  <div className="case-header">
                    <span className="case-id">{caseItem.caseId}</span>
                    <span className="case-date">{formatDate(caseItem.submittedAt)}</span>
                  </div>
                  <div className="case-info">
                    <div className="info-row">
                      <span className="label">User Name:</span>
                      <span className="value">{caseItem.fullName}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Legal Issue Type:</span>
                      <span className="value">{formatIssueType(caseItem.issueType)}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Description:</span>
                      <span className="value">{caseItem.description}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Email:</span>
                      <span className="value">{caseItem.email}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Phone:</span>
                      <span className="value">{caseItem.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Similar Cases Section */}
          <div className="similar-cases-section">
            <h2>Similar Cases</h2>
            <p className="similar-cases-desc">
              Based on your most recent case description, here are similar cases from our database:
            </p>
            
            {loadingSimilar ? (
              <div className="loading-similar">
                <span className="loading-spinner"></span>
                <p>Finding similar cases...</p>
              </div>
            ) : similarCases.length > 0 ? (
              <div className="similar-cases-grid">
                {similarCases.map((similarCase, index) => (
                  <div key={index} className="similar-case-card">
                    <div className="similar-case-header">
                      <span className="similarity-badge" style={{ backgroundColor: getSimilarityColor(similarCase.similarity) }}>
                        {similarCase.similarity}% Match
                      </span>
                    </div>
                    <div className="similar-case-body">
                      <h3>{formatIssueType(similarCase.caseType)}</h3>
                      <p className="similar-description">
                        {similarCase.caseDescription?.substring(0, 120)}...
                      </p>
                      <div className="similar-outcome">
                        <span className="outcome-label">Outcome:</span>
                        <span className="outcome-value">{formatResolutionType(similarCase.resolutionType)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-similar-cases">
                <p>No similar cases found. Submit more cases to get better recommendations.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="no-case">
          <p>No cases submitted yet.</p>
          <button onClick={() => onNavigate('case-submission')}>Submit a Case</button>
        </div>
      )}

      <div className="lawyers-card">
        <h2>Recommended Lawyers</h2>
        <div className="lawyer-list">
          {recommendedLawyers.map((lawyer, index) => (
            <div key={index} className="lawyer-item">
              <div className="lawyer-info">
                <h3>{lawyer.name}</h3>
                <p>{lawyer.specialization}</p>
                <p className="location">📍 {lawyer.location}</p>
              </div>
              <button onClick={() => onNavigate('top-lawyers')}>View Profile</button>
            </div>
          ))}
        </div>
      </div>

      <div className="summary-card">
        <h2>Case Summary</h2>
        <div className="summary-content">
          {cases.length > 0 ? (
            <p>You have <strong>{cases.length}</strong> case{cases.length !== 1 ? 's' : ''} submitted. Our team will review your case{cases.length !== 1 ? 's' : ''} and connect you with appropriate legal professionals.</p>
          ) : (
            <p>Submit a case to get a personalized summary and lawyer recommendations.</p>
          )}
        </div>
      </div>
    </div>
  )
}
