import { useState, useEffect } from 'react'
import './CaseDashboard.css'

export default function CaseDashboard({ onNavigate }) {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get all cases from the cases array
    try {
      const storedCases = localStorage.getItem('cases')
      if (storedCases) {
        const parsedCases = JSON.parse(storedCases)
        // Sort by submission date, newest first
        parsedCases.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        setCases(parsedCases)
      }
    } catch (err) {
      console.error('Error loading cases:', err)
    }
    setLoading(false)
  }, [])

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
