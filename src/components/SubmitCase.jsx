import { useState } from 'react'
import { useCases } from '../context/CasesContext'
import { apiUrl } from '../apiClient'
import './CaseSubmissionForm.css'

export default function SubmitCase({ onNavigate }) {
  const { addCase } = useCases()
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone: '',
    email: '',
    issueType: '',
    description: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [caseId, setCaseId] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const issueTypes = [
    { value: 'property', label: 'Property Dispute' },
    { value: 'rental', label: 'Rental Matter' },
    { value: 'contract', label: 'Contract Issue' },
    { value: 'family', label: 'Family Law' },
    { value: 'criminal', label: 'Criminal Defense' },
    { value: 'consumer', label: 'Consumer Complaint' },
    { value: 'employment', label: 'Employment Issue' },
    { value: 'other', label: 'Other' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      // Generate unique case ID
      const newCaseId = 'CASE-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase()

      const response = await fetch(apiUrl('/api/cases'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          caseId: newCaseId,
          fullName: formData.fullName,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          issueType: formData.issueType,
          description: formData.description
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message || 'Case submitted successfully!')
        
        // Store case ID if provided, otherwise use generated one
        const finalCaseId = data.caseId || newCaseId
        setCaseId(finalCaseId)
        localStorage.setItem('recentCaseId', finalCaseId)

        // Add to global context so dashboard syncs
        addCase({
          caseId: finalCaseId,
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          issueType: formData.issueType,
          description: formData.description,
          status: 'Pending'
        })

        // Clear form on success
        setFormData({
          fullName: '',
          address: '',
          phone: '',
          email: '',
          issueType: '',
          description: ''
        })
      } else {
        setError(data.message || 'Failed to submit case. Please try again.')
      }
    } catch (err) {
      console.error('Submit case error:', err)
      setError('Connection error. Please ensure the server is running and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityColor = (severity) => {
    if (!severity) return '#94a3b8';
    const s = severity.toString().toLowerCase();
    if (s.includes('high') || s.includes('7') || s.includes('8') || s.includes('9')) return '#ef4444';
    if (s.includes('medium') || s.includes('5') || s.includes('6')) return '#eab308';
    return '#22c55e';
  };

  const handleAIAnalysis = async () => {
    if (!formData.description || formData.description.length < 10) {
      setError('Please provide a more detailed description for analysis.')
      return
    }

    setIsAnalyzing(true)
    setError('')
    
    try {
      const response = await fetch(apiUrl('/api/analyze-case'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData })
      })
      
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      
      setAnalysisResult(data)
      // Results are now displayed in the UI card below the textarea
      console.log('AI Analysis result:', data)
    } catch (err) {
      console.error('AI Analysis error:', err)
      setError('Failed to analyze your case. Please ensure the server is running.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Submit Your Case</h1>
        <p>Fill in the details below to submit your legal case</p>
      </div>

      <form className="case-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Personal Information</h2>

          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              placeholder="Enter your full legal name"
              disabled={isLoading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="+91 XXXXX XXXXX"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email ID *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="your.email@example.com"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              placeholder="Enter your full address"
              rows={3}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Case Details</h2>

          <div className="form-group">
            <label htmlFor="issueType">Type of Legal Issue *</label>
            <select
              id="issueType"
              name="issueType"
              value={formData.issueType}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            >
              <option value="">Select Issue Type</option>
              {issueTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Problem Description *</label>
            <div className="description-with-button">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Describe your legal issue in detail..."
                rows={6}
                disabled={isLoading || isAnalyzing}
              />
              <button 
                type="button" 
                className="ai-analyze-btn"
                onClick={handleAIAnalysis}
                disabled={isAnalyzing || !formData.description}
              >
                {isAnalyzing ? (
                  <span className="ai-spinner"></span>
                ) : (
                  <>
                    <span className="ai-icon">✨</span>
                    AI Analysis
                  </>
                )}
              </button>
            </div>
            
            {analysisResult && (
              <div className="ai-analysis-result-card glass-panel" style={{ marginTop: '20px', padding: '20px', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)', background: 'rgba(30, 41, 59, 0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, color: '#818cf8', fontSize: '1.1rem' }}>✨ AI Legal Insights</h3>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>{new Date(analysisResult.timestamp).toLocaleString()}</span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>Case Severity</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: getSeverityColor(analysisResult.caseSeverity) }}>
                      {analysisResult.caseSeverity}%
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>Risk Level</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: getSeverityColor(analysisResult.riskLevel) }}>
                      {analysisResult.riskLevel}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#a5b4fc', marginBottom: '8px' }}>Recommendation</h4>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)', margin: 0, lineHeight: '1.4' }}>{analysisResult.lawyerRecommendation}</p>
                </div>

                {analysisResult.insights && analysisResult.insights.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.9rem', color: '#a5b4fc', marginBottom: '8px' }}>Key Insights</h4>
                    <ul style={{ paddingLeft: '18px', margin: 0 }}>
                      {analysisResult.insights.map((insight, idx) => (
                        <li key={idx} style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="error-message" style={{
            color: '#ef4444',
            marginBottom: '1rem',
            padding: '0.75rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div className="success-message" style={{
            color: '#10b981',
            marginBottom: '1rem',
            padding: '0.75rem',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            fontSize: '0.875rem'
          }}>
            {success}
            {caseId && (
              <p style={{ marginTop: '0.5rem', fontWeight: '600' }}>
                Case ID: {caseId}
              </p>
            )}
          </div>
        )}

        <button 
          type="submit" 
          className="submit-btn" 
          disabled={isLoading}
          style={{ 
            opacity: isLoading ? 0.7 : 1, 
            cursor: isLoading ? 'not-allowed' : 'pointer' 
          }}
        >
          {isLoading ? 'Submitting...' : 'Submit Case'}
        </button>
      </form>
    </div>
  )
}
