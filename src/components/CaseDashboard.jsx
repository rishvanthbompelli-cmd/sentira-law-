import React, { useState, useCallback, memo, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
const RecommendedLawyer = memo(function RecommendedLawyer({ lawyer }) {
  const navigate = useNavigate()
  return (
    <div className="lawyer-item">
      <div className="lawyer-info">
        <h3>{lawyer.name}</h3>
        <p>{lawyer.specialization}</p>
        <p className="location">📍 {lawyer.location}</p>
      </div>
      <button onClick={() => navigate(`/lawyer/${lawyer.id}`)}>View Profile</button>
    </div>
  )
})

function CaseDashboard() {
  const navigate = useNavigate()
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
    <div className="glass-container">
      <div className="dashboard-header ultra-glass neon-border-primary vibrant-glow-primary mb-12">
        <h1 className="text-grad-royal">Legal Command Center</h1>
        <p className="text-slate-300">Intelligent overview of your active legal portfolio and precedent analysis.</p>
      </div>

      {cases.length === 0 ? (
        <div className="no-case-premium premium-card neon-border-accent">
          <p className="text-slate-300 text-lg mb-6">Your legal portfolio is currently empty.</p>
          <button className="btn-primary-premium" onClick={() => navigate('/submit')}>Initiate New Case</button>
        </div>
      ) : (
        <div className="cases-table-section-premium ultra-glass">
          <h2 className="text-2xl font-bold mb-8 text-grad-ocean border-b border-white/10 pb-4">Active Engagements</h2>
          <div className="overflow-x-auto">
            <table className="cases-table-premium">
              <thead>
                <tr>
                  <th>Identity & Context</th>
                  <th>Category</th>
                  <th>Submission Date</th>
                  <th>Execution Status</th>
                  <th>Intelligence</th>
                </tr>
              </thead>
              <tbody>
                {cases.map(item => (
                  <React.Fragment key={item.caseId}>
                    <tr className={`case-row-premium ${selectedCaseId === item.caseId ? 'active' : ''}`}>
                      <td>
                        <div className="case-id-display text-grad-royal font-black">#{item.caseId}</div>
                        <p className="case-desc-preview-p text-slate-400">{item.description ? item.description.substring(0, 60) + '...' : 'No description provided'}</p>
                      </td>
                      <td>
                         <span className="category-badge ultra-glass">{formatIssueType(item.issueType)}</span>
                      </td>
                      <td className="text-slate-300 font-medium">{formatDate(item.submittedAt)}</td>
                      <td>
                        <span className="status-badge-vibrant" style={{ 
                          backgroundColor: `${getStatusColor(item.status)}22`, 
                          color: getStatusColor(item.status),
                          borderColor: `${getStatusColor(item.status)}44`
                        }}>
                          {item.status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className={`similar-cases-btn-premium ${selectedCaseId === item.caseId ? 'active' : ''}`}
                          onClick={() => toggleSimilarCases(item.caseId)}
                        >
                          {selectedCaseId === item.caseId ? 'Close Analytics' : 'Analyze Precedents'}
                        </button>
                      </td>
                    </tr>
                    
                    {selectedCaseId === item.caseId && (
                      <tr className="similar-cases-panel">
                        <td colSpan="5">
                          <div className="panel-content-wrapper animate-slide-down">
                            <div className="similar-cases-container-premium">
                              <h4 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <span className="text-accent">🔍</span> AI-Identified Legal Precedents
                              </h4>
                              
                              {loadingSimilar[item.caseId] ? (
                                <div className="loading-state-premium">
                                  <div className="spinner-premium"></div>
                                  <p className="text-slate-400">Querying neural law bank for matching scenarios...</p>
                                </div>
                              ) : similarCases[item.caseId] && similarCases[item.caseId].length > 0 ? (
                                <div className="similar-cases-grid-p">
                                  {similarCases[item.caseId].map((sc, idx) => (
                                    <div key={idx} className="similar-case-card-premium ultra-glass">
                                      <div className="sc-header-p">
                                        <span className="sc-id-p text-grad-gold">Precedent {sc.caseId}</span>
                                        <div className="similarity-ring" style={{ color: getSimilarityColor(sc.similarity) }}>
                                          {sc.similarity}% Match
                                        </div>
                                      </div>
                                      <p className="sc-desc-p text-slate-300">{sc.caseDescription}</p>
                                      <div className="sc-resolution-p ultra-glass">
                                        <span className="label text-slate-500">Typical Resolution:</span>
                                        <span className="val font-bold text-accent">{formatResolutionType(sc.resolutionType)}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="no-precedents text-slate-500 italic">No exact historical matches found for this specific emotional context.</p>
                              )}
                              
                              <div className="lawyer-rec-panel ultra-glass mt-10">
                                <h4 className="text-grad-royal font-black text-xl mb-2">Recommended Legal Strategists</h4>
                                <p className="text-slate-400 mb-8 max-w-2xl">Tailored matches based on your case's psychological and legal complexity.</p>
                                
                                <div className="recommended-lawyers-grid">
                                  {recommendedLawyers.map((lawyer, idx) => (
                                    <div key={idx} className="lawyer-match-card-premium ultra-glass">
                                       <div className="l-info">
                                         <h4 className="text-white font-bold">{lawyer.name}</h4>
                                         <p className="text-accent text-sm">{lawyer.specialization}</p>
                                         <p className="text-slate-500 text-xs">📍 {lawyer.location}</p>
                                       </div>
                                       <button 
                                         className="btn-match-view"
                                         onClick={() => navigate(`/lawyer/${lawyer.id}`)}
                                       >
                                         View Profile
                                       </button>
                                    </div>
                                  ))}
                                </div>
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
        </div>
      )}
    </div>
  )
}

// Wrap with memo for performance
export default memo(CaseDashboard)
