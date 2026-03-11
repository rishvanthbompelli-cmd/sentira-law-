import { useState, useEffect } from 'react'
import './CaseSubmissionForm.css'

// Mock AI analysis function
const analyzeWithAI = (description, issueType) => {
  // Simulate AI processing delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Detect tone based on keywords
      let tone = 'Neutral'
      const lowerDesc = description.toLowerCase()
      
      const aggressionWords = ['fight', 'beat', 'kill', 'hurt', 'attack', 'abuse', 'violence', 'threaten']
      const threatWords = ['sue', 'court', 'legal action', 'police', 'complaint', 'warrant', 'arrest']
      const stressWords = ['worried', 'scared', 'anxious', 'desperate', 'helpless', 'frustrated']
      
      if (aggressionWords.some(word => lowerDesc.includes(word))) {
        tone = 'Aggressive'
      } else if (threatWords.some(word => lowerDesc.includes(word))) {
        tone = 'Threatening'
      } else if (stressWords.some(word => lowerDesc.includes(word))) {
        tone = 'Stressed'
      }
      
      // Detect legal complexity
      const complexity = description.length > 500 ? 'High' : description.length > 200 ? 'Medium' : 'Low'
      
      // Identify key legal points
      const keyPoints = []
      if (lowerDesc.includes('property') || lowerDesc.includes('house') || lowerDesc.includes('land')) {
        keyPoints.push('Property Dispute')
      }
      if (lowerDesc.includes('rent') || lowerDesc.includes('tenant') || lowerDesc.includes('landlord')) {
        keyPoints.push('Rental Issue')
      }
      if (lowerDesc.includes('contract') || lowerDesc.includes('agreement') || lowerDesc.includes('breach')) {
        keyPoints.push('Contract Dispute')
      }
      if (lowerDesc.includes('family') || lowerDesc.includes('divorce') || lowerDesc.includes('custody')) {
        keyPoints.push('Family Matter')
      }
      if (lowerDesc.includes('criminal') || lowerDesc.includes('theft') || lowerDesc.includes('fraud')) {
        keyPoints.push('Criminal Matter')
      }
      
      // Generate recommendations
      const recommendations = []
      if (tone === 'Aggressive') {
        recommendations.push('Consider emotional calming techniques before proceeding')
        recommendations.push('Seek mediation to reduce confrontation')
      }
      if (tone === 'Threatening') {
        recommendations.push('Document all communications')
        recommendations.push('Consult with a lawyer immediately')
      }
      if (complexity === 'High') {
        recommendations.push('Gather all supporting documents')
        recommendations.push('Consider hiring specialized legal counsel')
      }
      
      resolve({
        tone,
        complexity,
        keyPoints: keyPoints.length > 0 ? keyPoints : [`${issueType} Case`],
        recommendations,
        sentimentScore: tone === 'Neutral' ? 75 : tone === 'Stressed' ? 45 : tone === 'Aggressive' ? 25 : 30,
        urgencyLevel: tone === 'Threatening' ? 'High' : tone === 'Aggressive' ? 'Medium' : 'Low'
      })
    }, 1500)
  })
}

export default function CaseSubmissionForm({ onNavigate }) {
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
    agreementCopy: null,
    chatScreenshot: null,
    emailEvidence: null
  })
  
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [caseId, setCaseId] = useState('')

  // Auto-redirect to QR page after submission
  useEffect(() => {
    if (submitted && caseId) {
      const timer = setTimeout(() => {
        onNavigate(`qr-case-${caseId}`)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [submitted, caseId, onNavigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files[0]) {
      setDocuments(prev => ({ ...prev, [name]: files[0].name }))
    }
  }

  const handleAIAnalysis = async () => {
    if (!formData.description || !formData.issueType) {
      alert('Please fill in the problem description and select an issue type')
      return
    }
    
    setAnalyzing(true)
    try {
      const analysis = await analyzeWithAI(formData.description, formData.issueType)
      setAiAnalysis(analysis)
    } catch (error) {
      console.error('AI Analysis error:', error)
    }
    setAnalyzing(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Generate unique case ID
    const newCaseId = 'CASE-' + Date.now().toString(36).toUpperCase()
    setCaseId(newCaseId)
    setSubmitted(true)
    
    // Store case data in localStorage for dashboard access
    const caseData = {
      caseId: newCaseId,
      ...formData,
      documents,
      aiAnalysis,
      submittedAt: new Date().toISOString()
    }
    
    localStorage.setItem(`case_${newCaseId}`, JSON.stringify(caseData))
    localStorage.setItem('recentCaseId', newCaseId)
  }

  const issueTypes = [
    { value: 'property', label: 'Property Dispute' },
    { value: 'rental', label: 'Rental Matter' },
    { value: 'contract', label: 'Contract Issue' },
    { value: 'family', label: 'Family Law' },
    { value: 'criminal', label: 'Criminal Defense' }
  ]

  if (submitted) {
    return (
      <div className="case-submission-container">
        <div className="submission-success">
          <div className="success-icon">✅</div>
          <h2>Case Submitted Successfully!</h2>
          <p className="case-id">Case ID: <strong>{caseId}</strong></p>
          <p>Your case has been registered. Generating QR code for mobile access...</p>
          <p className="redirect-notice">⏳ Redirecting to QR Code page...</p>
          
          <div className="success-actions">
            <button className="btn-primary" onClick={() => onNavigate(`qr-case-${caseId}`)}>
              📱 View QR Code Now
            </button>
            <button className="btn-secondary" onClick={() => onNavigate('case-dashboard')}>
              📊 View Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="case-submission-container">
      <div className="form-header">
        <h1>📝 Submit Your Case</h1>
        <p>Share your legal issue and get AI-powered analysis and recommendations</p>
      </div>

      <form className="case-form" onSubmit={handleSubmit}>
        {/* User Information Section */}
        <section className="form-section">
          <h2>👤 Personal Information</h2>
          <div className="form-grid">
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
            
            <div className="form-group full-width">
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
            
            <div className="form-group full-width">
              <label htmlFor="address">Address *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder="Enter your full address"
                rows={2}
              />
            </div>
          </div>
        </section>

        {/* Legal Issue Section */}
        <section className="form-section">
          <h2>⚖️ Legal Issue Details</h2>
          <div className="form-grid">
            <div className="form-group full-width">
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
            
            <div className="form-group full-width">
              <label htmlFor="description">Problem Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Describe your legal issue in detail..."
                rows={6}
                className="description-input"
              />
              <div className="ai-analysis-btn">
                <button
                  type="button"
                  className="btn-ai-analyze"
                  onClick={handleAIAnalysis}
                  disabled={analyzing || !formData.description || !formData.issueType}
                >
                  {analyzing ? '🤖 Analyzing...' : '🤖 AI Analyze My Case'}
                </button>
              </div>
            </div>
          </div>
          
          {/* AI Analysis Results */}
          {aiAnalysis && (
            <div className="ai-results">
              <div className="ai-results-header">
                <h3>🤖 AI Analysis Report</h3>
                <span className="ai-badge">Powered by Sentira AI</span>
              </div>
              
              <div className="analysis-grid">
                <div className="analysis-item">
                  <span className="analysis-label">Emotional Tone</span>
                  <span className={`tone-badge tone-${aiAnalysis.tone.toLowerCase()}`}>
                    {aiAnalysis.tone}
                  </span>
                </div>
                
                <div className="analysis-item">
                  <span className="analysis-label">Complexity</span>
                  <span className={`complexity-badge complexity-${aiAnalysis.complexity.toLowerCase()}`}>
                    {aiAnalysis.complexity}
                  </span>
                </div>
                
                <div className="analysis-item">
                  <span className="analysis-label">Urgency</span>
                  <span className={`urgency-badge urgency-${aiAnalysis.urgencyLevel.toLowerCase()}`}>
                    {aiAnalysis.urgencyLevel}
                  </span>
                </div>
                
                <div className="analysis-item">
                  <span className="analysis-label">Sentiment Score</span>
                  <div className="sentiment-meter">
                    <div 
                      className="sentiment-fill" 
                      style={{ width: `${aiAnalysis.sentimentScore}%` }}
                    />
                    <span>{aiAnalysis.sentimentScore}/100</span>
                  </div>
                </div>
              </div>
              
              <div className="key-points">
                <h4>📌 Key Legal Points Identified</h4>
                <ul>
                  {aiAnalysis.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
              
              {aiAnalysis.recommendations.length > 0 && (
                <div className="recommendations">
                  <h4>💡 AI Recommendations</h4>
                  <ul>
                    {aiAnalysis.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Document Upload Section */}
        <section className="form-section">
          <h2>📎 Document Uploads</h2>
          <p className="section-subtitle">Upload relevant documents to strengthen your case</p>
          
          <div className="upload-grid">
            <div className="upload-item">
              <label className="upload-label">
                <span className="upload-icon">🪪</span>
                <span className="upload-text">ID Proof (Aadhaar/PAN)</span>
                <input
                  type="file"
                  name="idProof"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {documents.idProof && <span className="file-selected">✓ {documents.idProof}</span>}
              </label>
            </div>
            
            <div className="upload-item">
              <label className="upload-label">
                <span className="upload-icon">📄</span>
                <span className="upload-text">Agreement Copy</span>
                <input
                  type="file"
                  name="agreementCopy"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
                {documents.agreementCopy && <span className="file-selected">✓ {documents.agreementCopy}</span>}
              </label>
            </div>
            
            <div className="upload-item">
              <label className="upload-label">
                <span className="upload-icon">💬</span>
                <span className="upload-text">Chat Screenshots</span>
                <input
                  type="file"
                  name="chatScreenshot"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png"
                />
                {documents.chatScreenshot && <span className="file-selected">✓ {documents.chatScreenshot}</span>}
              </label>
            </div>
            
            <div className="upload-item">
              <label className="upload-label">
                <span className="upload-icon">📧</span>
                <span className="upload-text">Email Evidence</span>
                <input
                  type="file"
                  name="emailEvidence"
                  onChange={handleFileChange}
                  accept=".pdf,.eml"
                />
                {documents.emailEvidence && <span className="file-selected">✓ {documents.emailEvidence}</span>}
              </label>
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            ✅ Submit Case
          </button>
        </div>
      </form>
    </div>
  )
}
