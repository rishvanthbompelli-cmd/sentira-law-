import { useState } from 'react'
import { useCases } from '../context/CasesContext'
import './CaseSubmissionForm.css'

export default function CaseSubmissionForm({ onNavigate }) {
  const { addCase } = useCases()
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone: '',
    email: '',
    issueType: '',
    description: ''
  })
  
  const [documents, setDocuments] = useState({
    idProof: null,
    documents: null
  })
  
  const [submitted, setSubmitted] = useState(false)
  const [caseId, setCaseId] = useState('')
  const [error, setError] = useState('')
  const [caseAnalysis, setCaseAnalysis] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [suggestedLawyer, setSuggestedLawyer] = useState(null)
  const [fileSelected, setFileSelected] = useState({ idProof: false, documents: false })
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files && files[0]) {
      setDocuments(prev => ({ ...prev, [name]: files[0] }))
      setFileSelected(prev => ({ ...prev, [name]: true }))
    }
  }

  // NLP-based Case Analysis
  const analyzeCase = () => {
    setAnalyzing(true)
    setCaseAnalysis(null)

    // Simulate AI NLP analysis with timeout
    setTimeout(() => {
      const description = formData.description.toLowerCase()
      const address = formData.address.toLowerCase()
      const issueType = formData.issueType

      // NLP Keyword detection for tone analysis
      const aggressiveKeywords = ['fight', 'attack', 'threat', 'beat', 'hurt', 'violence', 'abuse', 'harass', 'destroy', 'kill', 'sue', 'warrant', 'illegal', 'fraud', 'cheat', 'scam']
      const legalThreatKeywords = ['court', 'lawyer', 'legal', 'police', 'complaint', 'fir', 'bailable', 'non-bailable', 'penalty', 'punishment', 'sentence', 'jail', 'prison', 'accused', 'charges', 'section', 'ipc']
      
      let aggressiveCount = 0
      let legalThreatCount = 0
      
      aggressiveKeywords.forEach(keyword => {
        if (description.includes(keyword)) aggressiveCount++
      })
      
      legalThreatKeywords.forEach(keyword => {
        if (description.includes(keyword)) legalThreatCount++
      })

      // Calculate tone percentages
      const aggressiveScore = Math.min(100, aggressiveCount * 20)
      const legalThreatScore = Math.min(100, legalThreatCount * 15)
      const neutralScore = Math.max(0, 100 - aggressiveScore - legalThreatScore)

      // Normalize tone scores
      const totalTone = aggressiveScore + legalThreatScore + neutralScore
      const normalizedAggressive = Math.round((aggressiveScore / totalTone) * 100)
      const normalizedLegalThreat = Math.round((legalThreatScore / totalTone) * 100)
      const normalizedNeutral = Math.round((neutralScore / totalTone) * 100)

      // Issue category prediction based on description and selected type
      const issuePredictions = []
      
      // Property-related keywords
      const propertyKeywords = ['property', 'land', 'house', 'flat', 'rent', 'tenant', 'landlord', 'ownership', 'title', 'deed', 'possession', 'eviction', 'lease']
      const contractKeywords = ['contract', 'agreement', 'breach', 'payment', 'damages', 'compensation', 'liability', 'terms', 'clause', 'violation']
      const familyKeywords = ['divorce', 'custody', 'maintenance', 'alimony', 'marriage', 'husband', 'wife', 'child', 'inheritance', 'will', 'succession']
      const criminalKeywords = ['theft', 'robbery', 'murder', 'assault', 'cheating', 'forgery', 'criminal', 'offense', 'accused', 'victim']
      const employmentKeywords = ['job', 'salary', 'termination', 'promotion', 'harassment', 'workplace', 'employee', 'employer', 'wages', 'bonus']
      const consumerKeywords = ['product', 'defective', 'warranty', 'refund', 'refund', 'shopping', 'online', 'purchase', 'service']

      let propertyMatch = 0, contractMatch = 0, familyMatch = 0, criminalMatch = 0, employmentMatch = 0, consumerMatch = 0

      propertyKeywords.forEach(k => { if (description.includes(k) || address.includes(k)) propertyMatch++ })
      contractKeywords.forEach(k => { if (description.includes(k)) contractMatch++ })
      familyKeywords.forEach(k => { if (description.includes(k)) familyMatch++ })
      criminalKeywords.forEach(k => { if (description.includes(k)) criminalMatch++ })
      employmentKeywords.forEach(k => { if (description.includes(k)) employmentMatch++ })
      consumerKeywords.forEach(k => { if (description.includes(k)) consumerMatch++ })

      // Add selected issue type as a strong indicator
      const typeWeight = 3
      if (issueType === 'property') propertyMatch += typeWeight
      else if (issueType === 'contract') contractMatch += typeWeight
      else if (issueType === 'family') familyMatch += typeWeight
      else if (issueType === 'criminal') criminalMatch += typeWeight
      else if (issueType === 'employment') employmentMatch += typeWeight
      else if (issueType === 'consumer') consumerMatch += typeWeight

      const totalMatches = propertyMatch + contractMatch + familyMatch + criminalMatch + employmentMatch + consumerMatch || 1

      issuePredictions.push({ category: 'Property Dispute', confidence: Math.round((propertyMatch / totalMatches) * 100) })
      issuePredictions.push({ category: 'Contract Dispute', confidence: Math.round((contractMatch / totalMatches) * 100) })
      issuePredictions.push({ category: 'Family Law', confidence: Math.round((familyMatch / totalMatches) * 100) })
      issuePredictions.push({ category: 'Criminal Defense', confidence: Math.round((criminalMatch / totalMatches) * 100) })
      issuePredictions.push({ category: 'Employment Issue', confidence: Math.round((employmentMatch / totalMatches) * 100) })
      issuePredictions.push({ category: 'Consumer Complaint', confidence: Math.round((consumerMatch / totalMatches) * 100) })
      issuePredictions.push({ category: 'Other', confidence: Math.max(0, 100 - issuePredictions.reduce((a, b) => a + b.confidence, 0)) })

      // Sort by confidence
      issuePredictions.sort((a, b) => b.confidence - a.confidence)

      // Calculate Case Severity
      const descriptionLength = formData.description.length
      const hasDetails = descriptionLength > 100
      const urgencyFactors = (aggressiveCount * 15) + (legalThreatCount * 20) + (hasDetails ? 10 : 0)
      const caseSeverity = Math.min(100, Math.max(20, 40 + urgencyFactors))

      // Calculate Legal Risk Level
      let riskLevel = 'Low'
      if (caseSeverity >= 75 || legalThreatCount >= 3) riskLevel = 'High'
      else if (caseSeverity >= 50 || legalThreatCount >= 1) riskLevel = 'Medium'

      // Calculate Urgency Score
      const urgencyScore = Math.min(100, 30 + (descriptionLength / 10) + (aggressiveCount * 10) + (legalThreatCount * 15))

      // Generate detailed insights
      const insights = []
      
      // Property/rental insight
      if (propertyMatch > 0 || issueType === 'rental') {
        insights.push('The case appears to involve a property or rental disagreement.')
      }
      
      // Tone insight
      if (aggressiveScore > 30) {
        insights.push('The language indicates moderate to high legal conflict. Consider professional mediation.')
      } else {
        insights.push('The communication tone appears relatively neutral and factual.')
      }
      
      // Resolution insight
      if (legalThreatCount < 2 && caseSeverity < 60) {
        insights.push('Mediation may resolve the issue before court action is necessary.')
      } else if (legalThreatCount >= 2) {
        insights.push('The case involves legal threats - engaging a lawyer is recommended.')
      }
      
      // Description completeness
      if (descriptionLength < 50) {
        insights.push('Consider providing more details about the incident for better case assessment.')
      }

      const analysis = {
        timestamp: new Date().toISOString(),
        caseSeverity,
        riskLevel,
        urgencyScore,
        toneDetection: {
          aggressive: normalizedAggressive,
          neutral: normalizedNeutral,
          legalThreat: normalizedLegalThreat
        },
        issuePredictions,
        insights
      }

      setCaseAnalysis(analysis)
      setAnalyzing(false)
    }, 2000)
  }

  const matchLawyer = () => {
    const desc = (formData.description + ' ' + formData.issueType).toLowerCase();
    if (desc.includes('landlord') || desc.includes('tenant') || desc.includes('rent') || desc.includes('property')) {
      return { id: 2, name: "Kapil Sibal", specialization: "Civil & Property Law Expert" };
    } else if (desc.includes('divorce') || desc.includes('custody') || desc.includes('family')) {
      return { id: 10, name: "Indira Jaising", specialization: "Family & Human Rights Law Expert" };
    } else if (desc.includes('employee') || desc.includes('employer') || desc.includes('job') || desc.includes('corporate') || desc.includes('contract')) {
      return { id: 1, name: "Harish Salve", specialization: "Corporate Law Expert" };
    } else if (desc.includes('crime') || desc.includes('criminal') || desc.includes('police') || desc.includes('assault')) {
      return { id: 5, name: "Gopal Subramanium", specialization: "Criminal Defense Expert" };
    } else {
      return { id: 9, name: "K. Parasaran", specialization: "Senior Constitutional Expert" };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    
    // Generate unique case ID
    const newCaseId = 'CASE-' + Date.now().toString(36).toUpperCase()
    const mappedLawyer = matchLawyer();
    setSuggestedLawyer(mappedLawyer);
    
    try {
      const idProofName = documents.idProof ? documents.idProof.name : null
      const docName = documents.documents ? documents.documents.name : null
      
      // Use AbortController for quicker timeout on hardcoded IP
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const response = await fetch('http://10.30.2.64:3001/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          caseId: newCaseId,
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          issueType: formData.issueType,
          description: formData.description,
          idProof: idProofName,
          documents: docName
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      const data = await response.json()
      
      if (data.success) {
        setCaseId(newCaseId)
        setSubmitted(true)
        setIsSubmitting(false)
        
        const caseData = {
          caseId: newCaseId,
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          issueType: formData.issueType,
          description: formData.description,
          idProof: idProofName,
          documents: docName,
          submittedAt: new Date().toISOString(),
          status: 'Pending'
        }
        
        addCase(caseData)
        localStorage.setItem(`case_${newCaseId}`, JSON.stringify(caseData))
        
        const existingCases = JSON.parse(localStorage.getItem('cases') || '[]')
        existingCases.push(caseData)
        localStorage.setItem('cases', JSON.stringify(existingCases))
        localStorage.setItem('recentCaseId', newCaseId)
      } else {
        setError(data.error || 'Failed to submit case')
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error('Submit case error:', err)
      setCaseId(newCaseId)
      setSubmitted(true)
      setIsSubmitting(false)
      
      const caseData = {
        caseId: newCaseId,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        issueType: formData.issueType,
        description: formData.description,
        idProof: documents.idProof ? documents.idProof.name : null,
        documents: documents.documents ? documents.documents.name : null,
        submittedAt: new Date().toISOString(),
        status: 'Pending'
      }
      
      addCase(caseData)
      localStorage.setItem(`case_${newCaseId}`, JSON.stringify(caseData))
      const existingCases = JSON.parse(localStorage.getItem('cases') || '[]')
      existingCases.push(caseData)
      localStorage.setItem('cases', JSON.stringify(existingCases))
      localStorage.setItem('recentCaseId', newCaseId)
    }
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

  if (submitted) {
    return (
      <div className="form-container">
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h2>Case Submitted Successfully!</h2>
          <p className="case-id">Case ID: <strong>{caseId}</strong></p>
          
          {suggestedLawyer && (
            <div className="suggested-lawyer-submit-container">
              <h3 className="lawyer-match-title">Case Analysis Complete</h3>
              <p className="lawyer-match-desc">Based on your case details, we highly recommend consulting with:</p>
              
              <div className="lawyer-details-card">
                <div className="lawyer-info">
                  <p className="lawyer-name">{suggestedLawyer.name}</p>
                  <p className="lawyer-specialization">{suggestedLawyer.specialization}</p>
                </div>
                <button 
                  className="book-consult-btn"
                  onClick={() => onNavigate('top-lawyers')}
                >
                  View Lawyer Profile & Book
                </button>
              </div>
              
              <div className="skip-link-container">
                <button 
                  className="skip-link-btn"
                  onClick={() => onNavigate('case-dashboard')}
                >
                  Skip and go to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
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
                rows={5}
              />
              <button 
                type="button" 
                className="ai-analyze-btn"
                onClick={analyzeCase}
                disabled={analyzing || (!formData.fullName && !formData.address && !formData.issueType && !formData.description)}
              >
                {analyzing ? (
                  <><span className="ai-spinner"></span>Analyzing...</>
                ) : (
                  <><span className="ai-icon">✨</span>AI Analyze</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* AI Case Analysis Results Panel */}
        {caseAnalysis && (
          <div className="ai-case-analysis-panel">
            <div className="ai-analysis-header">
              <h3>🤖 AI Case Analysis</h3>
              <span className="ai-timestamp">Analyzed: {new Date(caseAnalysis.timestamp).toLocaleTimeString()}</span>
            </div>

            <div className="analysis-metrics-grid">
              <div className={`metric-card severity ${caseAnalysis.riskLevel.toLowerCase()}`}>
                <div className="metric-label">Case Severity</div>
                <div className="metric-value">{caseAnalysis.caseSeverity}%</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${caseAnalysis.caseSeverity}%` }}></div>
                </div>
              </div>

              <div className={`metric-card risk ${caseAnalysis.riskLevel.toLowerCase()}`}>
                <div className="metric-label">Legal Risk Level</div>
                <div className="metric-value">{caseAnalysis.riskLevel}</div>
                <div className="risk-indicator">
                  <span className={`risk-dot ${caseAnalysis.riskLevel.toLowerCase()}`}></span>
                </div>
              </div>

              <div className={`metric-card urgency ${caseAnalysis.riskLevel.toLowerCase()}`}>
                <div className="metric-label">Urgency Score</div>
                <div className="metric-value">{caseAnalysis.urgencyScore}%</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${caseAnalysis.urgencyScore}%` }}></div>
                </div>
              </div>
            </div>

            <div className="tone-detection-section">
              <h4>🎯 Tone Detection</h4>
              <div className="tone-bars">
                <div className="tone-item">
                  <span className="tone-label">Aggressive Language</span>
                  <div className="tone-bar-container">
                    <div className="tone-bar aggressive" style={{ width: `${caseAnalysis.toneDetection.aggressive}%` }}></div>
                  </div>
                  <span className="tone-value">{caseAnalysis.toneDetection.aggressive}%</span>
                </div>
                <div className="tone-item">
                  <span className="tone-label">Neutral Communication</span>
                  <div className="tone-bar-container">
                    <div className="tone-bar neutral" style={{ width: `${caseAnalysis.toneDetection.neutral}%` }}></div>
                  </div>
                  <span className="tone-value">{caseAnalysis.toneDetection.neutral}%</span>
                </div>
                <div className="tone-item">
                  <span className="tone-label">Legal Threat Indicators</span>
                  <div className="tone-bar-container">
                    <div className="tone-bar threat" style={{ width: `${caseAnalysis.toneDetection.legalThreat}%` }}></div>
                  </div>
                  <span className="tone-value">{caseAnalysis.toneDetection.legalThreat}%</span>
                </div>
              </div>
            </div>

            <div className="issue-prediction-section">
              <h4>📋 Issue Category Prediction</h4>
              <div className="prediction-list">
                {caseAnalysis.issuePredictions.slice(0, 3).map((pred, idx) => (
                  <div key={idx} className="prediction-item">
                    <span className="prediction-category">{pred.category}</span>
                    <div className="prediction-bar-container">
                      <div className="prediction-bar" style={{ width: `${pred.confidence}%` }}></div>
                    </div>
                    <span className="prediction-confidence">{pred.confidence}% confidence</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="detailed-insights-section">
              <h4>💡 Detailed Insights</h4>
              <ul className="insights-list">
                {caseAnalysis.insights.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="form-section">
          <h2>Document Upload</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="idProof">ID Proof (Aadhaar/PAN/Voter ID) *</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="idProof"
                  name="idProof"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                />
              </div>
              {fileSelected.idProof && documents.idProof && <span className="file-name">{documents.idProof.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="documents">Supporting Documents</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="documents"
                  name="documents"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>
              {fileSelected.documents && documents.documents && <span className="file-name">{documents.documents.name}</span>}
            </div>
          </div>
        </div>

        {error && <div className="error-message bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-6">{error}</div>}

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? (
            <><span className="ai-spinner mr-2" style={{ display: 'inline-block', verticalAlign: 'middle' }}></span>Submitting...</>
          ) : (
            'Submit Case'
          )}
        </button>
      </form>
    </div>
  )
}
