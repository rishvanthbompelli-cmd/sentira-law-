import { useState } from 'react'
import './CaseSubmissionForm.css'

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
    documents: null
  })
  
  const [submitted, setSubmitted] = useState(false)
  const [caseId, setCaseId] = useState('')
  const [error, setError] = useState('')

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Generate unique case ID
    const newCaseId = 'CASE-' + Date.now().toString(36).toUpperCase()
    
    try {
      // Send data to backend API
      const response = await fetch('http://localhost:3001/api/cases', {
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
          idProof: documents.idProof,
          documents: documents.documents
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCaseId(newCaseId)
        setSubmitted(true)
        
        // Also store in localStorage for backup/offline
        const caseData = {
          caseId: newCaseId,
          ...formData,
          documents,
          submittedAt: new Date().toISOString()
        }
        
        localStorage.setItem(`case_${newCaseId}`, JSON.stringify(caseData))
        localStorage.setItem('recentCaseId', newCaseId)
        
        // Navigate to dashboard
        setTimeout(() => {
          onNavigate('case-dashboard')
        }, 2000)
      } else {
        setError(data.error || 'Failed to submit case')
      }
    } catch (err) {
      console.error('Submit case error:', err)
      setError('Failed to submit case. Please try again.')
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
          <p>Redirecting to dashboard...</p>
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
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Describe your legal issue in detail..."
              rows={5}
            />
          </div>
        </div>

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
              {documents.idProof && <span className="file-name">{documents.idProof}</span>}
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
              {documents.documents && <span className="file-name">{documents.documents}</span>}
            </div>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Submit Case
        </button>
      </form>
    </div>
  )
}
