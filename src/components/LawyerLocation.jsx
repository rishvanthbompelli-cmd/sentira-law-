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

const createLawyerIcon = (photoUrl, isSelected) => {
  return L.divIcon({
    html: `
      <div style="
        width: ${isSelected ? '60px' : '45px'}; 
        height: ${isSelected ? '60px' : '45px'}; 
        border-radius: 50%; 
        overflow: hidden; 
        border: 3px solid ${isSelected ? '#6366f1' : 'white'}; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.5); 
        background-color: white;
        transition: all 0.3s ease;
        position: relative;
        z-index: ${isSelected ? '1000' : '1'};
      ">
        <img src="${photoUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="Lawyer Marker" />
      </div>
      ${isSelected ? `<div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #6366f1;"></div>` : ''}
    `,
    className: 'custom-lawyer-marker',
    iconSize: isSelected ? [60, 68] : [45, 45],
    iconAnchor: isSelected ? [30, 68] : [22, 22]
  });
};

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

export default function LawyerLocation({ lawyerId }) {
  const navigate = useNavigate()
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
        <div className="glass-container">
          <div className="location-header ultra-glass neon-border-primary mb-12">
            <button className="back-btn-premium ultra-glass mb-4" onClick={() => navigate('/lawyer-locations')}>
              ← Back to Locations
            </button>
            <h1 className="text-grad-ocean">Office of {lawyer.name}</h1>
          </div>
          
          <div className="premium-card neon-border-primary vibrant-glow-primary">
            <div className="profile-header">
              <div className="profile-photo-wrapper">
                <img src={lawyer.photo} alt={lawyer.name} className="profile-photo" />
                <div className="profile-photo-glow"></div>
              </div>
              <div className="profile-info">
                <h2 className="text-grad-royal">{lawyer.name}</h2>
                <p className="specialization-large">{lawyer.specialization}</p>
                <div className="profile-stats-row">
                   <p className="stat">📍 {lawyer.location}</p>
                </div>
              </div>
            </div>
            
            <div className="contact-section ultra-glass mt-8">
              <h3 className="text-grad-royal mb-4">Office Address</h3>
              <p className="text-slate-200 text-lg mb-6">{lawyer.address}</p>
              
              <button 
                className="btn-primary-premium"
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${lawyer.lat},${lawyer.lng}`, '_blank')}
              >
                🗺️ Navigate via Google Maps
              </button>
            </div>
            
            <div className="individual-lawyer-map mt-8 ultra-glass neon-border-accent p-2">
              <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-2xl" style={{ isolation: 'isolate' }}>
                <MapContainer 
                  center={[lawyer.lat, lawyer.lng]} 
                  zoom={14} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[lawyer.lat, lawyer.lng]} icon={createLawyerIcon(lawyer.photo, true)} />
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
    <div className="glass-container">
      <div className="location-header ultra-glass neon-border-accent vibrant-glow-accent mb-12">
        <h1 className="text-grad-ocean">Legal Network Locations</h1>
        <p className="text-slate-300">Explore the reach of India's most prestigious law firms and practitioners.</p>
      </div>
      
      <div className="locations-grid-premium">
        {/* Map Section */}
        <div className="locations-map-wrapper ultra-glass neon-border-primary">
          <div className="w-full h-full relative">
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
                  icon={createLawyerIcon(lawyer.photo, selectedLawyer?.id === lawyer.id)}
                  eventHandlers={{
                    click: () => handleLawyerClick(lawyer),
                  }}
                />
              ))}
              <MapUpdater center={mapCenter} zoom={zoom} />
            </MapContainer>
            
            {/* Zoom Controls */}
            <div className="zoom-controls-premium">
              <button className="zoom-btn-p" onClick={handleZoomIn}>+</button>
              <button className="zoom-btn-p" onClick={handleZoomOut}>−</button>
            </div>
          </div>
        </div>
        
        {/* Lawyer Addresses Section */}
        <div className="locations-list-wrapper ultra-glass">
          <h2 className="text-xl font-bold mb-6 text-grad-ocean border-b border-white/10 pb-4">Our Offices</h2>
          <div className="address-cards-container">
            {lawyers.map((lawyer) => (
              <div 
                key={lawyer.id} 
                className={`address-card-premium ${selectedLawyer?.id === lawyer.id ? 'active' : ''}`}
                onClick={() => handleLawyerClick(lawyer)}
              >
                <div className="address-photo-wrapper">
                  <img src={lawyer.photo} alt={lawyer.name} className="address-photo" />
                  <div className="photo-pulse"></div>
                </div>
                <div className="address-details">
                  <h4 className="text-grad-royal font-bold">{lawyer.name}</h4>
                  <p className="addr text-slate-300">{lawyer.address}</p>
                  <p className="city text-accent/80">{lawyer.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedLawyer && (
        <div className="selected-lawyer-overlay-card premium-card neon-border-primary vibrant-glow-primary">
          <button className="close-overlay-btn" onClick={handleBack}>×</button>
          <div className="overlay-flex">
            <img src={selectedLawyer.photo} alt={selectedLawyer.name} className="overlay-photo" />
            <div className="overlay-info">
              <h3 className="text-grad-royal font-bold">{selectedLawyer.name}</h3>
              <p className="specialization-text">{selectedLawyer.specialization}</p>
              <p className="address-text">📍 {selectedLawyer.address}</p>
              <button 
                className="consult-btn-overlay"
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
