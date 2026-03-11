import { useState, useEffect } from 'react'
import './CaseDashboard.css'

export default function CaseDashboard({ onNavigate }) {
  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get the most recent case
    const recentCaseId = localStorage.getItem('recentCaseId')
    
    if (recentCaseId) {
      try {
        const data = localStorage.getItem(`case_${recentCaseId}`)
        if (data) {
          setCaseData(JSON.parse(data))
        }
      } catch (err) {
        console.error('Error parsing case data:', err)
      }
    }
    setLoading(false)
  }, [])

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
        <p>View your submitted case details and recommended lawyers</p>
      </div>

      {caseData ? (
        <>
          <div className="case-card">
            <h2>Case Details</h2>
            <div className="case-info">
              <div className="info-row">
                <span className="label">Case ID:</span>
                <span className="value">{caseData.caseId}</span>
              </div>
              <div className="info-row">
                <span className="label">Full Name:</span>
                <span className="value">{caseData.fullName}</span>
              </div>
              <div className="info-row">
                <span className="label">Email:</span>
                <span className="value">{caseData.email}</span>
              </div>
              <div className="info-row">
                <span className="label">Phone:</span>
                <span className="value">{caseData.phone}</span>
              </div>
              <div className="info-row">
                <span className="label">Address:</span>
                <span className="value">{caseData.address}</span>
              </div>
              <div className="info-row">
                <span className="label">Issue Type:</span>
                <span className="value">{caseData.issueType}</span>
              </div>
              <div className="info-row">
                <span className="label">Description:</span>
                <span className="value">{caseData.description}</span>
              </div>
            </div>
          </div>

          <div className="documents-card">
            <h2>Uploaded Documents</h2>
            <div className="doc-list">
              <div className="doc-item">
                <span className="doc-icon">📄</span>
                <span className="doc-name">{caseData.documents?.idProof || 'ID Proof'}</span>
              </div>
              {caseData.documents?.documents && (
                <div className="doc-item">
                  <span className="doc-icon">📄</span>
                  <span className="doc-name">{caseData.documents.documents}</span>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="no-case">
          <p>No case submitted yet.</p>
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
          {caseData ? (
            <p>Your case regarding <strong>{caseData.issueType}</strong> has been submitted successfully. Our team will review your case and connect you with appropriate legal professionals.</p>
          ) : (
            <p>Submit a case to get a personalized summary and lawyer recommendations.</p>
          )}
        </div>
      </div>
    </div>
  )
}
