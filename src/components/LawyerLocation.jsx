import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

// Import images
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

// Lawyers data
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

// Custom marker icon
const createLawyerIcon = (photoUrl, isSelected) => {
  return L.divIcon({
    html: `
      <div class="marker-container ${isSelected ? 'selected' : ''}">
        <img src="${photoUrl}" alt="Lawyer" />
      </div>
    `,
    className: 'custom-lawyer-marker',
    iconSize: isSelected ? [60, 68] : [45, 45],
    iconAnchor: isSelected ? [30, 68] : [22, 22]
  })
}

// Map updater component
function MapUpdater({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, zoom)
    }
  }, [center, zoom, map])
  return null
}

export default function LawyerLocation({ lawyerId }) {
  const navigate = useNavigate()
  const [selectedLawyer, setSelectedLawyer] = useState(null)
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629])
  const [zoom, setZoom] = useState(5)

  // Handle specific lawyer ID from URL
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

  // Individual lawyer view
  if (lawyerId && !isNaN(parseInt(lawyerId))) {
    const lawyerIndex = parseInt(lawyerId) - 1
    if (lawyerIndex >= 0 && lawyerIndex < lawyers.length) {
      const lawyer = lawyers[lawyerIndex]
      return (
        <div className="location-container">
          <div className="location-header">
            <button className="back-button" onClick={() => navigate('/lawyer-locations')}>
              ← Back to All Locations
            </button>
            <h1>Office of {lawyer.name}</h1>
          </div>

          <div className="lawyer-profile-card">
            <div className="profile-header">
              <div className="profile-photo-container">
                <img src={lawyer.photo} alt={lawyer.name} className="profile-photo" />
              </div>
              <div className="profile-info">
                <h2>{lawyer.name}</h2>
                <p className="specialization">{lawyer.specialization}</p>
                <p className="location-text">📍 {lawyer.location}</p>
              </div>
            </div>

            <div className="address-section">
              <h3>Office Address</h3>
              <p>{lawyer.address}</p>
              <button 
                className="navigate-button"
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${lawyer.lat},${lawyer.lng}`, '_blank')}
              >
                🗺️ Navigate via Google Maps
              </button>
            </div>

            <div className="map-section">
              <MapContainer 
                center={[lawyer.lat, lawyer.lng]} 
                zoom={14} 
                style={{ height: '400px', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lawyer.lat, lawyer.lng]} icon={createLawyerIcon(lawyer.photo, true)} />
                <MapUpdater center={[lawyer.lat, lawyer.lng]} zoom={14} />
              </MapContainer>
            </div>
          </div>
        </div>
      )
    }
  }

  // Main locations view
  return (
    <div className="location-container">
      <div className="location-header">
        <h1>Legal Network Locations</h1>
        <p>Explore the reach of India's most prestigious law firms and practitioners.</p>
      </div>

      <div className="locations-grid">
        {/* Map Section */}
        <div className="map-wrapper">
          <MapContainer 
            center={mapCenter} 
            zoom={zoom} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {lawyers.map((lawyer) => (
              <Marker 
                key={lawyer.id} 
                position={[lawyer.lat, lawyer.lng]}
                icon={createLawyerIcon(lawyer.photo, selectedLawyer?.id === lawyer.id)}
                eventHandlers={{
                  click: () => handleLawyerClick(lawyer),
                }}
              />
            ))}
            <MapUpdater center={mapCenter} zoom={zoom} />
          </MapContainer>

          {/* Zoom Controls */}
          <div className="zoom-controls">
            <button className="zoom-button" onClick={handleZoomIn}>+</button>
            <button className="zoom-button" onClick={handleZoomOut}>−</button>
          </div>
        </div>

        {/* Lawyers List */}
        <div className="lawyers-list">
          <h2>Our Offices</h2>
          <div className="lawyers-cards">
            {lawyers.map((lawyer) => (
              <div 
                key={lawyer.id} 
                className={`lawyer-card ${selectedLawyer?.id === lawyer.id ? 'active' : ''}`}
                onClick={() => handleLawyerClick(lawyer)}
              >
                <div className="lawyer-photo-wrapper">
                  <img src={lawyer.photo} alt={lawyer.name} className="lawyer-photo" />
                </div>
                <div className="lawyer-details">
                  <h4>{lawyer.name}</h4>
                  <p className="address">{lawyer.address}</p>
                  <p className="city">{lawyer.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Lawyer Overlay */}
      {selectedLawyer && (
        <div className="selected-lawyer-overlay">
          <button className="close-button" onClick={handleBack}>×</button>
          <div className="overlay-content">
            <img src={selectedLawyer.photo} alt={selectedLawyer.name} className="overlay-photo" />
            <div className="overlay-info">
              <h3>{selectedLawyer.name}</h3>
              <p className="specialization">{selectedLawyer.specialization}</p>
              <p className="address">📍 {selectedLawyer.address}</p>
              <button 
                className="view-profile-button"
                onClick={() => navigate(`/lawyer/${selectedLawyer.id}`)}
              >
                View Profile & Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
