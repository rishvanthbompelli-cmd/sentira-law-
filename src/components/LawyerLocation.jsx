import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './LawyerLocation.css'

// Fix for default marker icon
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

// Import images individually for correct mapping
import harishSalveImg from '../../assets/harish salve.jpg'
import kapilSibalImg from '../../assets/Kapil Sibal.jpg'
import abhishekSinghviImg from '../../assets/Abhishek Manu Singhvi.jpg'
import mukulRohatgiImg from '../../assets/Mukul Rohatgi.jpg'
import gopalSubramaniumImg from '../../assets/Gopal Subramanium.jpg'
import pinkyAnandImg from '../../assets/Pinky Anand.jpg'
import arvindDatarImg from '../../assets/Arvind Datar.jpg'
import salmanKhurshidImg from '../../assets/Salman Khurshid.jpg'
import kParasaranImg from '../../assets/K. Parasaran.jpg'
import indiraJaisingImg from '../../assets/Indira Jaising.jpg'

// Lawyers data array with coordinates
const lawyers = [
  { id: 1, name: "Harish Salve", photo: harishSalveImg, specialization: "Constitutional Law, Corporate Law", location: "New Delhi, India", address: "Supreme Court of India, Tilak Marg, New Delhi", lat: 28.5921, lng: 77.2435 },
  { id: 2, name: "Kapil Sibal", photo: kapilSibalImg, specialization: "Constitutional Law, Civil Law", location: "New Delhi, India", address: "21, Barakhamba Road, New Delhi", lat: 28.6318, lng: 77.2195 },
  { id: 3, name: "Abhishek Manu Singhvi", photo: abhishekSinghviImg, specialization: "Constitutional Law, Corporate Law", location: "New Delhi, India", address: "C-222, Defence Colony, New Delhi", lat: 28.5676, lng: 77.2327 },
  { id: 4, name: "Mukul Rohatgi", photo: mukulRohatgiImg, specialization: "Corporate Law, Constitutional Law", location: "New Delhi, India", address: "Advocate-on-Record, Supreme Court", lat: 28.5921, lng: 77.2435 },
  { id: 5, name: "Gopal Subramanium", photo: gopalSubramaniumImg, specialization: "Criminal Law, Constitutional Law", location: "New Delhi, India", address: "Former Solicitor General of India, New Delhi", lat: 28.5921, lng: 77.2435 },
  { id: 6, name: "Pinky Anand", photo: pinkyAnandImg, specialization: "Corporate Law, Civil Law", location: "New Delhi, India", address: "Senior Advocate, Supreme Court", lat: 28.5921, lng: 77.2435 },
  { id: 7, name: "Arvind Datar", photo: arvindDatarImg, specialization: "Tax Law, Constitutional Law", location: "Chennai, India", address: "No. 1, Queen's Road, Chennai", lat: 13.0827, lng: 80.2500 },
  { id: 8, name: "Salman Khurshid", photo: salmanKhurshidImg, specialization: "Constitutional Law, Civil Law", location: "New Delhi, India", address: "Former Law Minister, Jantar Mantar Road", lat: 28.6268, lng: 77.2089 },
  { id: 9, name: "K. Parasaran", photo: kParasaranImg, specialization: "Constitutional Law, Religious Law", location: "Chennai, India", address: "Former Attorney General, Chennai", lat: 13.0827, lng: 80.2500 },
  { id: 10, name: "Indira Jaising", photo: indiraJaisingImg, specialization: "Human Rights Law, Constitutional Law", location: "Mumbai, India", address: "High Court, Mumbai", lat: 18.9388, lng: 72.8354 }
]

// Component to update map view
function MapUpdater({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, zoom)
    }
  }, [center, zoom, map])
  return null
}

export default function LawyerLocation({ lawyerId, onNavigate }) {
  const [selectedLawyer, setSelectedLawyer] = useState(null)
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629])
  const [zoom, setZoom] = useState(5)

  // Handle when navigating from Top Lawyers with specific lawyer ID
  useEffect(() => {
    if (lawyerId && !isNaN(parseInt(lawyerId))) {
      const lawyerIndex = parseInt(lawyerId) - 1
      if (lawyerIndex >= 0 && lawyerIndex < lawyers.length) {
        const lawyer = lawyers[lawyerIndex]
        setSelectedLawyer(lawyer)
        setMapCenter([lawyer.lat, lawyer.lng])
        setZoom(12)
      }
    }
  }, [lawyerId])

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 18))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 1))
  }

  const handleLawyerClick = (lawyer) => {
    setSelectedLawyer(lawyer)
    setMapCenter([lawyer.lat, lawyer.lng])
    setZoom(12)
  }

  const handleBack = () => {
    setSelectedLawyer(null)
    setMapCenter([20.5937, 78.9629])
    setZoom(5)
  }

  // If showing individual lawyer detail
  if (lawyerId && !isNaN(parseInt(lawyerId))) {
    const lawyerIndex = parseInt(lawyerId) - 1
    if (lawyerIndex >= 0 && lawyerIndex < lawyers.length) {
      const lawyer = lawyers[lawyerIndex]
      return (
        <div className="lawyer-location-container">
          <div className="location-header">
            <button className="back-btn" onClick={() => onNavigate('lawyer-locations')}>
              ← Back to Locations
            </button>
            <h1>Office Location for {lawyer.name}</h1>
          </div>
          <div className="location-card">
            <div className="location-lawyer-info">
              <img src={lawyer.photo} alt={lawyer.name} className="location-lawyer-photo" />
              <h2>{lawyer.name}</h2>
              <p className="lawyer-specialization">{lawyer.specialization}</p>
              <p className="lawyer-location">{lawyer.location}</p>
            </div>
            
            <div className="location-address-nav">
              <h3>Office Address</h3>
              <p>{lawyer.address}</p>
              
              <button 
                className="navigate-btn mt-4"
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${lawyer.lat},${lawyer.lng}`, '_blank')}
              >
                🗺️ Navigate via Google Maps
              </button>
            </div>
            
            <div className="individual-lawyer-map mt-8">
              <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-slate-700" style={{ isolation: 'isolate' }}>
                <MapContainer 
                  center={[lawyer.lat, lawyer.lng]} 
                  zoom={14} 
                  style={{ height: '350px', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[lawyer.lat, lawyer.lng]} />
                  <MapUpdater center={[lawyer.lat, lawyer.lng]} zoom={14} />
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="lawyer-location-container">
      <div className="location-header">
        <h1>Locations for Lawyers</h1>
        <p>Find the office locations of top legal professionals in India</p>
      </div>
      
      <div className="locations-grid max-w-7xl mx-auto px-6">
        {/* Map Section - 70% width */}
        <div className="locations-map-section">
          <div className="w-full h-full">
            <MapContainer 
              center={mapCenter} 
              zoom={zoom} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {lawyers.map((lawyer) => (
                <Marker 
                  key={lawyer.id} 
                  position={[lawyer.lat, lawyer.lng]}
                  eventHandlers={{
                    click: () => handleLawyerClick(lawyer),
                  }}
                />
              ))}
              <MapUpdater center={mapCenter} zoom={zoom} />
            </MapContainer>
            
            {/* Zoom Controls */}
            <div className="zoom-controls">
              <button className="zoom-btn" onClick={handleZoomIn}>+</button>
              <button className="zoom-btn" onClick={handleZoomOut}>−</button>
            </div>
          </div>
        </div>
        
        {/* Lawyer Addresses Section - 30% width */}
        <div className="locations-list-section">
          <h2 className="text-xl font-semibold mb-4 text-white border-b border-slate-600 pb-4">Lawyer Addresses</h2>
          <div className="space-y-4">
            {lawyers.map((lawyer) => (
              <div 
                key={lawyer.id} 
                className={`address-card ${selectedLawyer?.id === lawyer.id ? 'selected' : ''}`}
                onClick={() => handleLawyerClick(lawyer)}
              >
                <img src={lawyer.photo} alt={lawyer.name} className="address-photo" />
                <div className="address-info">
                  <h4>{lawyer.name}</h4>
                  <p className="address-location">{lawyer.address}</p>
                  <p className="address-city">{lawyer.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedLawyer && (
        <div className="selected-lawyer-card">
          <button className="close-btn" onClick={handleBack}>×</button>
          <img src={selectedLawyer.photo} alt={selectedLawyer.name} className="selected-photo" />
          <div className="selected-info">
            <h3>{selectedLawyer.name}</h3>
            <p>{selectedLawyer.specialization}</p>
            <p>{selectedLawyer.address}</p>
            <p>{selectedLawyer.location}</p>
          </div>
        </div>
      )}
    </div>
  )
}
