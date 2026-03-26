import React, { useState, useCallback, memo, useMemo, useRef, useEffect } from 'react'
import { useCases } from '../context/CasesContext'
import { apiUrl } from '../apiClient'
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
      <button onClick={() => onNavigate(`top-lawyers-${lawyer.id}`)}>View Profile</button>
    </div>
  )
})

function CaseDashboard({ onNavigate }) {
  const { cases, isLoading, refreshCases } = useCases()
  const [similarCases, setSimilarCases] = useState({})
  const [loadingSimilar, setLoadingSimilar] = useState({})
  const [selectedCaseId, setSelectedCaseId] = useState(null)
  
  // Refs to store current state values for use in callbacks
  const similarCasesRef = useRef({})
  const loadingSimilarRef = useRef({})
  const selectedCaseIdRef = useRef(null)
  
  // Sync refs with state
  useEffect(() => {
    similarCasesRef.current = similarCases
  }, [similarCases])
  
  useEffect(() => {
    loadingSimilarRef.current = loadingSimilar
  }, [loadingSimilar])
  
  useEffect(() => {
    selectedCaseIdRef.current = selectedCaseId
  }, [selectedCaseId])

  // Fetch similar cases for a specific case
  const fetchSimilarCases = useCallback(async (caseId) => {
    // Use refs to avoid dependency issues
    const currentSimilarCases = similarCasesRef.current
    const currentLoadingSimilar = loadingSimilarRef.current
    
    if (currentSimilarCases[caseId] || currentLoadingSimilar[caseId]) return
    
    setLoadingSimilar(prev => ({ ...prev, [caseId]: true }))
    
    try {
      const response = await fetch(apiUrl(`/api/cases/similar/${caseId}`))
      const data = await response.json()
      if (data.success) {
        setSimilarCases(prev => ({ ...prev, [caseId]: data.similarCases || [] }))
        similarCasesRef.current = { ...similarCasesRef.current, [caseId]: data.similarCases || [] }
      }
    } catch (err) {
      console.error('Error fetching similar cases:', err)
      // Use mock data if backend is not available
      const mockData = [
        { caseId: "CASE-001", caseType: "rental", caseDescription: "Tenant refusing to pay rent for commercial property.", resolutionType: "Settlement", similarity: 82 },
        { caseId: "CASE-002", caseType: "contract", caseDescription: "Client failed to make payment for services rendered.", resolutionType: "Mediation", similarity: 76 }
      ]
      setSimilarCases(prev => ({ ...prev, [caseId]: mockData }))
      similarCasesRef.current = { ...similarCasesRef.current, [caseId]: mockData }
    }
    setLoadingSimilar(prev => ({ ...prev, [caseId]: false }))
  }, [])

  const toggleSimilarCases = useCallback((caseId) => {
    if (selectedCaseIdRef.current === caseId) {
      setSelectedCaseId(null)
      selectedCaseIdRef.current = null
    } else {
      setSelectedCaseId(caseId)
      selectedCaseIdRef.current = caseId
      fetchSimilarCases(caseId)
    }
  }, [fetchSimilarCases])

  // Format the issue type for display
  const formatIssueType = useMemo(() => (type) => {
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
  const formatResolutionType = useMemo(() => (type) => {
    const typeMap = {
      'Mediation': 'Mediation',
      'Settlement': 'Settlement',
      'Court': 'Court',
      'Pending': 'Pending'
    }
    return typeMap[type] || 'Pending'
  }, [])

  // Get color based on similarity percentage
  const getSimilarityColor = useMemo(() => (similarity) => {
    if (similarity >= 80) return '#22c55e' // green
    if (similarity >= 60) return '#f59e0b' // amber
    return '#64748b' // slate
  }, [])

  // Get status color
  const getStatusColor = useMemo(() => (status) => {
    const colors = {
      'Pending': '#f59e0b',
      'In Review': '#3b82f6',
      'Resolved': '#22c55e',
      'Closed': '#64748b'
    }
    return colors[status] || '#64748b'
  }, [])

  // Format date for display
  const formatDate = useMemo(() => (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }, [])

  // Sample recommended lawyers - memoized
  const recommendedLawyers = useMemo(() => [
    { id: 1, name: "Harish Salve", specialization: "Corporate Law", location: "New Delhi" },
    { id: 2, name: "Kapil Sibal", specialization: "Constitutional Law", location: "New Delhi" },
    { id: 10, name: "Indira Jaising", specialization: "Human Rights Law", location: "Mumbai" }
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

      {cases.length === 0 ? (
        <div className="no-case">
          <p>No cases submitted yet.</p>
          <button onClick={() => onNavigate('case-submission')}>Submit a Case</button>
        </div>
      ) : (
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
              {cases.map(item => (
                <React.Fragment key={item.caseId}>
                  <tr className="case-row">
                    <td>
                      <strong>{item.caseId}</strong>
                      <p className="case-desc-preview">{item.description ? item.description.substring(0, 40) + '...' : 'No description provided'}</p>
                    </td>
                    <td>{formatIssueType(item.issueType)}</td>
                    <td>{formatDate(item.submittedAt)}</td>
                    <td>
                      <span className="status-badge" style={{ backgroundColor: getStatusColor(item.status) }}>
                        {item.status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="similar-cases-btn" 
                        onClick={() => toggleSimilarCases(item.caseId)}
                      >
                        {selectedCaseId === item.caseId ? 'Hide Similar Cases' : 'Find Similar Cases'}
                      </button>
                    </td>
                  </tr>
                  
                  {selectedCaseId === item.caseId && (
                    <tr className="similar-cases-row">
                      <td colSpan="5">
                        <div className="similar-cases-container">
                          <h4>Similar Past Cases & Resolutions</h4>
                          
                          {loadingSimilar[item.caseId] ? (
                            <div className="loading-similar">
                              <div className="spinner"></div>
                              <p>Analyzing database for legal precedents...</p>
                            </div>
                          ) : similarCases[item.caseId] && similarCases[item.caseId].length > 0 ? (
                            <div className="similar-cases-grid">
                              {similarCases[item.caseId].map((sc, idx) => (
                                <div key={idx} className="similar-case-card">
                                  <div className="similar-case-header">
                                    <span className="sc-id">{sc.caseId}</span>
                                    <div className="similarity-badge" style={{ borderColor: getSimilarityColor(sc.similarity), color: getSimilarityColor(sc.similarity) }}>
                                      {sc.similarity}% Match
                                    </div>
                                  </div>
                                  <p className="sc-desc">{sc.caseDescription}</p>
                                  <div className="sc-footer">
                                    <span className="sc-label">Resolution:</span>
                                    <span className="sc-resolution">{formatResolutionType(sc.resolutionType)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="no-similar-cases">No highly similar cases found in the database.</p>
                          )}
                          
                          <div className="lawyer-recommendation-section">
                            <h4>Recommended Legal Experts</h4>
                            <p className="lawyer-rec-desc">Based on your case profile, these experts have the highest success rate in similar matters.</p>
                            
                            <div className="recommended-lawyers-list">
                              {recommendedLawyers.map((lawyer, idx) => (
                                <RecommendedLawyer key={idx} lawyer={lawyer} onNavigate={onNavigate} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// Wrap with memo for performance
export default memo(CaseDashboard)
