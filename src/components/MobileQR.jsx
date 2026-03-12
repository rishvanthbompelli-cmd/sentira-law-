import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import './MobileQR.css'

export default function MobileQR() {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [currentUrl, setCurrentUrl] = useState('')
  const [loading, setLoading] = useState(true)

  // Get local IP address for local network access
  const getLocalIP = () => {
    // For local network, use port 5173
    return 'http://192.168.1.100:5173'
  }

  useEffect(() => {
    // Get the current website URL
    const generateQRCode = async () => {
      try {
        // Use local network IP for QR code generation
        const baseUrl = getLocalIP()
        setCurrentUrl(baseUrl)
        
        // Generate QR code for the current website URL
        const qrDataUrl = await QRCode.toDataURL(baseUrl, {
          width: 140,
          margin: 1,
          color: {
            dark: '#1e293b',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'M'
        })
        
        setQrCodeUrl(qrDataUrl)
        setLoading(false)
      } catch (error) {
        console.error('Error generating QR code:', error)
        setLoading(false)
      }
    }

    generateQRCode()
  }, [])

  // Listen for URL changes (for dynamic URLs)
  useEffect(() => {
    const handleUrlChange = () => {
      // Use local IP
      const newUrl = getLocalIP()
      if (newUrl !== currentUrl) {
        // Regenerate QR code if URL changed
        QRCode.toDataURL(newUrl, {
          width: 140,
          margin: 1,
          color: {
            dark: '#1e293b',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'M'
        }).then(setQrCodeUrl).catch(console.error)
      }
    }

    // Check for URL changes every 5 seconds
    const interval = setInterval(handleUrlChange, 5000)
    return () => clearInterval(interval)
  }, [currentUrl])

  return (
    <div className="mobile-qr-section">
      <div className="mobile-qr-card">
        <div className="mobile-qr-header">
          <span className="mobile-qr-icon">📱</span>
          <h3>Open This Website On Mobile</h3>
        </div>
        
        <div className="mobile-qr-content">
          <div className="mobile-qr-image-container">
            {loading ? (
              <div className="mobile-qr-loading">Generating...</div>
            ) : qrCodeUrl ? (
              <img 
                src={qrCodeUrl} 
                alt="QR Code to open website on mobile" 
                className="mobile-qr-image" 
              />
            ) : (
              <div className="mobile-qr-error">Unable to generate QR</div>
            )}
          </div>
          
          <p className="mobile-qr-instruction">
            Scan this QR code with your phone camera to open the website on your mobile device.
          </p>
        </div>
        
        {currentUrl && (
          <div className="mobile-qr-url">
            <small>URL: {currentUrl}</small>
          </div>
        )}
      </div>
    </div>
  )
}
