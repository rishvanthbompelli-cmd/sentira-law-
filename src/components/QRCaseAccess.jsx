import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import './QRCaseAccess.css'

export default function QRCaseAccess({ caseId, onNavigate }) {
  const [qrCode, setQrCode] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateQR = async () => {
      // Get current URL for the website
      const baseUrl = window.location.origin + window.location.pathname
      
      // If caseId is provided, link to that case; otherwise link to home
      const targetUrl = caseId 
        ? `${baseUrl}#/case-access/${caseId}`
        : baseUrl

      try {
        const qr = await QRCode.toDataURL(targetUrl, {
          width: 250,
          margin: 2,
          color: {
            dark: '#1a1a2e',
            light: '#ffffff'
          }
        })
        setQrCode(qr)
      } catch (err) {
        console.error('QR generation error:', err)
      }
      setLoading(false)
    }

    generateQR()
  }, [caseId])

  // Get the case info if caseId is provided
  const [caseData, setCaseData] = useState(null)
  
  useEffect(() => {
    if (caseId) {
      try {
        const data = localStorage.getItem(`case_${caseId}`)
        if (data) {
          setCaseData(JSON.parse(data))
        }
      } catch (err) {
        console.error('Error parsing case data:', err)
      }
    }
  }, [caseId])

  return (
    <div className="qr-container">
      <div className="qr-card">
        <div className="qr-header">
          <h1>Scan to Open on Mobile</h1>
          <p>Scan this QR code to access the website or your case on your phone</p>
        </div>

        <div className="qr-code-wrapper">
          {loading ? (
            <div className="qr-loading">Generating QR Code...</div>
          ) : (
            <img src={qrCode} alt="QR Code" className="qr-code" />
          )}
        </div>

        <div className="qr-info">
          <p><strong>Website:</strong> Sentira-Law</p>
          {caseId && caseData && (
            <p><strong>Case ID:</strong> {caseData.caseId}</p>
          )}
        </div>

        {caseId && caseData && (
          <div className="case-preview">
            <h3>Case Details</h3>
            <p><strong>Name:</strong> {caseData.fullName}</p>
            <p><strong>Issue:</strong> {caseData.issueType}</p>
          </div>
        )}
      </div>

      <div className="qr-instructions">
        <h3>How to use:</h3>
        <ol>
          <li>Open the camera app on your mobile phone</li>
          <li>Point the camera at the QR code</li>
          <li>Tap on the link that appears</li>
          <li>The website or case page will open in your browser</li>
        </ol>
      </div>
    </div>
  )
}
