import { useState } from 'react'
import './TopLawyers.css'

// Import images individually to ensure correct mapping
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

// Lawyers data array with correct image mapping
const lawyers = [
  { 
    id: 1, 
    name: "Harish Salve", 
    photo: harishSalveImg,
    specialization: "Constitutional Law, Corporate Law", 
    location: "New Delhi, India", 
    cases: 2500,
    description: "Senior advocate with extensive experience in constitutional matters and corporate litigation."
  },
  { 
    id: 2, 
    name: "Kapil Sibal", 
    photo: kapilSibalImg,
    specialization: "Constitutional Law, Civil Law", 
    location: "New Delhi, India", 
    cases: 3200,
    description: "Former Minister and senior counsel known for his expertise in constitutional and civil law."
  },
  { 
    id: 3, 
    name: "Abhishek Manu Singhvi", 
    photo: abhishekSinghviImg,
    specialization: "Constitutional Law, Corporate Law", 
    location: "New Delhi, India", 
    cases: 1800,
    description: "Eminent jurist specializing in constitutional law and corporate matters."
  },
  { 
    id: 4, 
    name: "Mukul Rohatgi", 
    photo: mukulRohatgiImg,
    specialization: "Corporate Law, Constitutional Law", 
    location: "New Delhi, India", 
    cases: 2100,
    description: "Former Attorney General with vast experience in corporate and constitutional law."
  },
  { 
    id: 5, 
    name: "Gopal Subramanium", 
    photo: gopalSubramaniumImg,
    specialization: "Criminal Law, Constitutional Law", 
    location: "New Delhi, India", 
    cases: 1500,
    description: "Senior advocate known for his expertise in criminal and constitutional matters."
  },
  { 
    id: 6, 
    name: "Pinky Anand", 
    photo: pinkyAnandImg,
    specialization: "Corporate Law, Civil Law", 
    location: "New Delhi, India", 
    cases: 1200,
    description: "Senior advocate with expertise in corporate law and civil litigation."
  },
  { 
    id: 7, 
    name: "Arvind Datar", 
    photo: arvindDatarImg,
    specialization: "Tax Law, Constitutional Law", 
    location: "Chennai, India", 
    cases: 900,
    description: "Renowned tax counsel with extensive experience in tax and constitutional matters."
  },
  { 
    id: 8, 
    name: "Salman Khurshid", 
    photo: salmanKhurshidImg,
    specialization: "Constitutional Law, Civil Law", 
    location: "New Delhi, India", 
    cases: 2800,
    description: "Former Law Minister with vast experience in constitutional and civil law."
  },
  { 
    id: 9, 
    name: "K. Parasaran", 
    photo: kParasaranImg,
    specialization: "Constitutional Law, Religious Law", 
    location: "Chennai, India", 
    cases: 3500,
    description: "Former Attorney General with expertise in constitutional and religious law."
  },
  { 
    id: 10, 
    name: "Indira Jaising", 
    photo: indiraJaisingImg,
    specialization: "Human Rights Law, Constitutional Law", 
    location: "Mumbai, India", 
    cases: 1600,
    description: "Leading human rights lawyer with expertise in constitutional law."
  }
]

export default function TopLawyers({ onNavigate }) {
  const [selectedLawyer, setSelectedLawyer] = useState(null)

  const handleViewProfile = (lawyer) => {
    setSelectedLawyer(lawyer)
  }

  const handleBack = () => {
    setSelectedLawyer(null)
  }

  // Show lawyer detail profile
  if (selectedLawyer) {
    return (
      <div className="lawyer-profile-container">
        <button className="back-btn" onClick={handleBack}>
          ← Back to Lawyers
        </button>
        
        <div className="profile-card">
          <div className="profile-header">
            <img 
              src={selectedLawyer.photo} 
              alt={selectedLawyer.name} 
              className="profile-photo"
            />
            <div className="profile-info">
              <h2>{selectedLawyer.name}</h2>
              <p className="specialization">{selectedLawyer.specialization}</p>
              <p className="location">📍 {selectedLawyer.location}</p>
              <p className="cases">⚖️ {selectedLawyer.cases}+ Cases Handled</p>
            </div>
          </div>
          
          <div className="profile-body">
            <h3>About</h3>
            <p>{selectedLawyer.description}</p>
            
            <h3>Contact</h3>
            <p>Email: info@{selectedLawyer.name.toLowerCase().replace(' ', '')}.com</p>
            <p>Phone: +91 98765 43210</p>
            
            <button 
              className="btn-view-location-profile"
              onClick={() => onNavigate(`lawyer-locations-${selectedLawyer.id}`)}
            >
              📍 View Location on Map
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="lawyers-container">
      <div className="lawyers-header">
        <h1>Top Indian Lawyers</h1>
        <p>Expert legal professionals ready to help with your case</p>
      </div>

      <div className="lawyers-grid">
        {lawyers.map((lawyer) => (
          <div 
            key={lawyer.id} 
            className="lawyer-card"
          >
            <img 
              src={lawyer.photo} 
              alt={lawyer.name} 
              className="lawyer-photo"
            />
            <div className="lawyer-info">
              <h3>{lawyer.name}</h3>
              <p className="lawyer-specialization">{lawyer.specialization}</p>
              <p className="lawyer-location">{lawyer.location}</p>
              <p className="lawyer-cases">{lawyer.cases}+ Cases</p>
              <div className="lawyer-actions">
                <button 
                  className="btn-view-profile"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewProfile(lawyer)
                  }}
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
