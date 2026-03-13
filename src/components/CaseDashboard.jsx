import React, { useState, useCallback, memo, useMemo } from 'react'
import { useCases } from '../context/CasesContext'
import './CaseDashboard.css'

// Memoized skeleton row component
const SkeletonRow = memo(function SkeletonRow() {
  return (
    <tr className="skeleton-row">
      <td><div className="skeleton skeleton-text"></div></td>
      <td><div className="skeleton skeleton-text"></div></td>
      <td><div className="skeleton skeleton-text"></div></td>
      <td><div className="skeleton skeleton-badge"></div></td>
      <td><div className="skeleton skeleton-btn"></div></td>
    </tr>
  )
})

// Memoized recommended lawyer item
const RecommendedLawyer = memo(function RecommendedLawyer({ lawyer, onNavigate }) {
  return (
    <div className="lawyer-item">
      <div className="lawyer-info">
        <h3>{lawyer.name}</h3>
        <p>{lawyer.specialization}</p>
        <p className="location">📍 {lawyer.location}</p>
      </div>
      <button onClick={() => onNavigate('top-lawyers')}>View Profile</button>
    </div>
  )
})

function CaseDashboard({ onNavigate }) {
  const { cases, isLoading, refreshCases } = useCases()
  const [similarCases, setSimilarCases] = useState({})
  const [loadingSimilar, setLoadingSimilar] = useState({})
  const [selectedCaseId, setSelectedCaseId] = useState(null)

  // Fetch similar cases for a specific case
  const fetchSimilarCases = useCallback(async (caseId) => {
    if (similarCases[caseId] || loadingSimilar[caseId]) return
    
    setLoadingSimilar(prev => ({ ...prev, [caseId]: true }))
    
    try {
      const response = await fetch(`http://localhost:3001/api/cases/similar/${caseId}`)
      const data = await response.json()
      if (data.success) {
        setSimilarCases(prev => ({ ...prev, [caseId]: data.similarCases || [] }))
      }
    } catch (err) {
      console.error('Error fetching similar cases:', err)
      // Use mock data if backend is not available
      setSimilarCases(prev => ({ 
        ...prev, 
        [caseId]: [
          { caseId: "CASE-001", caseType: "rental", caseDescription: "Tenant refusing to pay rent for commercial property.", resolutionType: "Settlement", similarity: 82 },
          { caseId: "CASE-002", caseType: "contract", caseDescription: "Client failed to make payment for services rendered.", resolutionType: "Mediation", similarity: 76 }
        ]
      }))
    }
    setLoadingSimilar(prev => ({ ...prev, [caseId]: false }))
  }, [similarCases, loadingSimilar])

  const toggleSimilarCases = useCallback((caseId) => {
    if (selectedCaseId === caseId) {
      setSelectedCaseId(null)
    } else {
      setSelectedCaseId(caseId)
      fetchSimilarCases(caseId)
    }
  }, [selectedCaseId, fetchSimilarCases])

  // Format the issue type for display
  const formatIssueType = useCallback((type) => {
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
    return typeMap[type] || type || 'N/A'
  }, [])

  // Format resolution type for display
  const formatResolutionType = useCallback((type) => {
    const typeMap = {
      'Mediation': 'Mediation',
      'Settlement': 'Settlement',
      'Court': 'Court',
      'Pending': 'Pending'
    }
    return typeMap[type] || 'Pending'
  }, [])

  // Get color based on similarity percentage
  const getSimilarityColor = useCallback((similarity) => {
    if (similarity >= 80) return '#22c55e' // green
    if (similarity >= 60) return '#f59e0b' // amber
    return '#64748b' // slate
  }, [])

  // Get status color
  const getStatusColor = useCallback((status) => {
    const colors = {
      'Pending': '#f59e0b',
      'In Review': '#3b82f6',
      'Resolved': '#22c55e',
      'Closed': '#64748b'
    }
    return colors[status] || '#64748b'
  }, [])

  // Format date for display
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }, [])

  // Sample recommended lawyers - memoized
  const recommendedLawyers = useMemo(() => [
    { name: "Harish Salve", specialization: "Corporate Law", location: "New Delhi" },
    { name: "Kapil Sibal", specialization: "Constitutional Law", location: "New Delhi" },
    { name: "Indira Jaising", specialization: "Human Rights Law", location: "Mumbai" }
  ], [])

  // Show skeleton only if actually loading and no cached data
  if (isLoading && cases.length === 0) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Case Dashboard</h1>
          <p>View all your submitted case details and recommended lawyers</p>
        </div>
        
        <div className="cases-table-section">
          <h2>Your Submitted Cases</h2>
          <table className="cases-table">
            <thead>
              <tr>
                <th>Case Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </tbody>
          </table>
        </div>
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
          <div className="cases-table-section">
            <h2>Your Submitted Cases</h2>
            <table className="cases-table">
              <thead>
                <tr>
                  <th>Case Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((caseItem) => (
                  <React.Fragment key={caseItem.caseId}>
                    <tr className="case-row">
                      <td className="case-title-cell">
                        <span className="case-id">{caseItem.caseId}</span>
                        <span className="case-desc">{caseItem.description?.substring(0, 50)}...</span>
                      </td>
                      <td>{formatIssueType(caseItem.issueType)}</td>
                      <td>{formatDate(caseItem.submittedAt)}</td>
                      <td>
                        <span 
                          className="status-badge" 
                          style={{ backgroundColor: getStatusColor(caseItem.status) }}
                        >
                          {caseItem.status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-similar-cases"
                          onClick={() => toggleSimilarCases(caseItem.caseId)}
                          disabled={loadingSimilar[caseItem.caseId]}
                        >
                          {loadingSimilar[caseItem.caseId] ? 'Loading...' : 
                           selectedCaseId === caseItem.caseId ? 'Hide Similar' : 'Similar Cases'}
                        </button>
                      </td>
                    </tr>
                    {selectedCaseId === caseItem.caseId && (
                      <tr key={`${caseItem.caseId}-similar`} className="similar-cases-row">
                        <td colSpan={5}>
                          <div className="similar-cases-container">
                            <h4>Similar Cases for {caseItem.caseId}</h4>
                            {loadingSimilar[caseItem.caseId] ? (
                              <div className="loading-similar">
                                <span className="loading-spinner"></span>
                                Finding similar cases...
                              </div>
                            ) : similarCases[caseItem.caseId]?.length > 0 ? (
                              <div className="similar-cases-grid">
                                {similarCases[caseItem.caseId].map((similar, index) => (
                                  <div key={index} className="similar-case-card">
                                    <div className="similar-header">
                                      <span 
                                        className="similarity-badge" 
                                        style={{ backgroundColor: getSimilarityColor(similar.similarity) }}
                                      >
                                        {similar.similarity}% Match
                                      </span>
                                    </div>
                                    <div className="similar-body">
                                      <h5>{formatIssueType(similar.caseType)}</h5>
                                      <p>{similar.caseDescription?.substring(0, 80)}...</p>
                                      <span className="outcome">
                                        Outcome: {formatResolutionType(similar.resolutionType)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="no-similar">No similar cases found</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
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
            <RecommendedLawyer 
              key={index} 
              lawyer={lawyer} 
              onNavigate={onNavigate} 
            />
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

// Wrap with memo for performance
export default memo(CaseDashboard)
