import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import './MobileQR.css'

export default function MobileQR() {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [currentUrl, setCurrentUrl] = useState('')
  const [loading, setLoading] = useState(true)

  // Use the public ngrok URL for QR code generation
  const PUBLIC_BASE_URL = 'https://basinlike-hermila-nonmeditative.ngrok-free.dev'

  useEffect(() => {
    // Get the current website URL
    const generateQRCode = async () => {
      try {
        // Use the public ngrok URL for QR code generation
        const baseUrl = PUBLIC_BASE_URL
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

  // Listen for URL changes (for ngrok or other dynamic URLs)
  useEffect(() => {
    const handleUrlChange = () => {
      // Always use the public ngrok URL
      const newUrl = PUBLIC_BASE_URL
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
