import { useState } from 'react'
import { useCases } from '../context/CasesContext'
import { apiUrl } from '../apiClient'
import './CaseSubmissionForm.css'
import CaseAIAnalyzer from './CaseAIAnalyzer'

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
    const newCaseId = 'CASE-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase()
    const mappedLawyer = matchLawyer();
    setSuggestedLawyer(mappedLawyer);

    try {
      const idProofName = documents.idProof ? documents.idProof.name : null
      const docName = documents.documents ? documents.documents.name : null

      // Use AbortController for timeout - increased to 30 seconds for slower connections
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      const response = await fetch(apiUrl('/api/cases'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          caseId: newCaseId,
          fullName: formData.fullName,
          phone: formData.phone ? formData.phone.slice(0, 20) : '',
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
      
      // Check if response is ok
      if (!response.ok) {
        let errorMsg = `Server error (${response.status}): ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.error) errorMsg = errorData.error;
        } catch (e) {
          // Ignore json parse error
        }
        console.error('Server returned error:', response.status, response.statusText);
        setError(errorMsg);
        setIsSubmitting(false);
        return;
      }
      
      // Try to parse response as JSON
      let data
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        // Response is not JSON
        const text = await response.text()
        console.error('Non-JSON response:', text)
        setError('Unexpected response from server. Please try again.')
        setIsSubmitting(false)
        return
      }

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
      console.error('Submit case error details:', {
        name: err.name,
        message: err.message,
        cause: err.cause,
        stack: err.stack
      })
      
      // More specific error detection
      let errorMessage = 'Network error: Failed to submit case. Please try again.'
      
      if (err.name === 'AbortError') {
        errorMessage = 'Request timeout. The server is taking too long to respond.'
      } else if (err.message && err.message.includes('NetworkError')) {
        errorMessage = 'Network error. Please check if the backend server is running.'
      } else if (err.message && err.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Please ensure the backend server is running on port 3001.'
      } else if (err.message && err.message.includes('CORS')) {
        errorMessage = 'CORS error. Please contact support if this persists.'
      }
      
      setError(errorMessage)
      setIsSubmitting(false)
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
      <div className="glass-container">
        <div className="success-message-premium premium-card neon-border-primary vibrant-glow-primary">
          <div className="success-icon-wrapper">
             <div className="success-icon-p">✨</div>
             <div className="success-ripple"></div>
          </div>
          <h2 className="text-grad-royal text-3xl font-black mb-4">Submission Captured</h2>
          <p className="case-id-p text-slate-300 mb-8">
            Your unique legal identifier: <span className="text-accent font-mono text-xl block mt-2">{caseId}</span>
          </p>

          {suggestedLawyer && (
            <div className="suggested-lawyer-panel ultra-glass mt-12">
              <h3 className="text-grad-ocean font-bold text-xl mb-4">Immediate AI Recommendation</h3>
              <p className="text-slate-400 mb-8">Our neural matching engine has identified an optimal legal strategist for your specific scenario.</p>

              <div className="lawyer-match-p ultra-glass p-6">
                <div className="l-details">
                  <p className="l-name text-white font-black text-2xl">{suggestedLawyer.name}</p>
                  <p className="l-spec text-accent font-bold">{suggestedLawyer.specialization}</p>
                </div>
                <button
                  className="btn-primary-premium mt-6"
                  onClick={() => onNavigate('top-lawyers')}
                >
                  Secure Strategy Session
                </button>
              </div>

              <div className="dashboard-link-wrapper mt-8">
                <button
                  className="text-dim hover:text-white transition-colors underline text-sm"
                  onClick={() => onNavigate('case-dashboard')}
                >
                  Proceed to Case Command Center
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-container">
      <div className="form-header-premium ultra-glass neon-border-accent mb-12">
        <h1 className="text-grad-ocean">Case Initiation</h1>
        <p className="text-slate-300">Submit your legal scenario for neural analysis and expert matching.</p>
        
        <div className="form-steps-indicator mt-8">
          <div className="step-item active">
            <span className="step-num">1</span>
            <span className="step-txt">Identity</span>
          </div>
          <div className="step-line"></div>
          <div className="step-item active">
            <span className="step-num">2</span>
            <span className="step-txt">Context</span>
          </div>
        </div>
      </div>

      <form className="case-form-premium" onSubmit={handleSubmit}>
        <div className="form-section-premium premium-card neon-border-primary mb-10">
          <h2 className="text-grad-royal font-black text-xl mb-8 flex items-center gap-3">
             <span className="text-2xl">👤</span> Personal Profile
          </h2>

          <div className="form-group mb-6">
            <label className="form-label-premium">Full Legal Identity</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="form-input-premium"
              placeholder="e.g. Alexander Vance"
            />
          </div>

          <div className="form-row-premium">
            <div className="form-group">
              <label className="form-label-premium">Contact Protocol (Tel)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="form-input-premium"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div className="form-group">
              <label className="form-label-premium">Digital Correspondence (Email)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="form-input-premium"
                placeholder="identity@sentira.law"
              />
            </div>
          </div>

          <div className="form-group mt-6">
            <label className="form-label-premium">Residency / Service Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="form-input-premium"
              placeholder="Enter comprehensive physical address..."
              rows={3}
            />
          </div>
        </div>

        <div className="form-section-premium premium-card neon-border-accent">
          <h2 className="text-grad-ocean font-black text-xl mb-8 flex items-center gap-3">
             <span className="text-2xl">⚖️</span> Scenario Parameters
          </h2>

          <div className="form-group mb-8">
            <label className="form-label-premium">Jurisdiction / Issue Category</label>
            <select
              name="issueType"
              value={formData.issueType}
              onChange={handleInputChange}
              required
              className="form-input-premium"
            >
              <option value="">Select Domain</option>
              {issueTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label-premium">Detailed Narrative Breakdown</label>
            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="form-input-premium min-h-[200px]"
                placeholder="Provide a comprehensive breakdown of the legal conflict..."
                rows={5}
              />
              <div className="mt-6">
                <CaseAIAnalyzer description={formData.description} />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-card-premium ultra-glass text-red-400 p-6 rounded-xl mt-8 border border-red-500/30 flex items-center gap-4">
             <span className="text-2xl">⚠️</span>
             <div>
               <p className="font-bold">System Interference</p>
               <p className="text-sm opacity-80">{error}</p>
             </div>
          </div>
        )}

        <div className="submit-section-premium mt-12 text-center">
          <button type="submit" className="btn-primary-premium w-full text-xl py-6" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-4">
                <span className="spinner-premium m-0 w-6 h-6 border-2"></span>
                Processing Neural Submission...
              </span>
            ) : (
              'Initiate Case Protocol'
            )}
          </button>
          <p className="text-dim text-xs mt-6 uppercase tracking-widest opacity-50">Sentira Secure Encryption Active (256-bit)</p>
        </div>
      </form>
    </div>
  )
}
