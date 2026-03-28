import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiUrl } from '../apiClient'
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
import indiraJaisingImg from '../../assets/indira jaising.jpg'

// Preload lawyers data
export const preloadLawyers = async () => {
  try {
    const response = await fetch(apiUrl('/api/lawyers'))
    if (response.ok) {
      const data = await response.json()
      return data.lawyers || []
    }
  } catch (error) {
    console.log('Preload lawyers failed:', error.message)
  }
  return []
}

// Fallback lawyers data for when API is not available
const fallbackLawyers = [
  { 
    id: 1, 
    name: "Harish Salve", 
    photo: harishSalveImg,
    specialization: "Constitutional Law, Corporate Law", 
    experience: 25,
    location: "New Delhi, India", 
    cases: 2500,
    description: "Senior advocate with extensive experience in constitutional matters and corporate litigation.",
    about: "Senior advocate with extensive experience in constitutional matters and corporate litigation. Former Additional Solicitor General of India.",
    email: "harish.salve@sentiralaw.com",
    phone: "+91 98765 43210",
    rating: 4.9,
    consultationFee: "₹50,000",
    availabilitySchedule: [
      { day: "Monday", time: "10:00 AM - 1:00 PM" },
      { day: "Tuesday", time: "2:00 PM - 5:00 PM" },
      { day: "Wednesday", time: "11:00 AM - 3:00 PM" },
      { day: "Friday", time: "9:00 AM - 12:00 PM" }
    ]
  },
  { 
    id: 2, 
    name: "Kapil Sibal", 
    photo: kapilSibalImg,
    specialization: "Constitutional Law, Civil Law", 
    experience: 30,
    location: "New Delhi, India", 
    cases: 3200,
    description: "Former Minister and senior counsel known for his expertise in constitutional and civil law.",
    about: "Former Minister and senior counsel known for his expertise in constitutional and civil law. One of India's most distinguished lawyers.",
    email: "kapil.sibal@sentiralaw.com",
    phone: "+91 98765 43211",
    rating: 4.8,
    consultationFee: "₹75,000",
    availabilitySchedule: [
      { day: "Monday", time: "2:00 PM - 5:00 PM" },
      { day: "Wednesday", time: "10:00 AM - 1:00 PM" },
      { day: "Thursday", time: "11:00 AM - 2:00 PM" },
      { day: "Friday", time: "3:00 PM - 6:00 PM" }
    ]
  },
  { 
    id: 3, 
    name: "Abhishek Manu Singhvi", 
    photo: abhishekSinghviImg,
    specialization: "Constitutional Law, Corporate Law", 
    experience: 22,
    location: "New Delhi, India", 
    cases: 1800,
    description: "Eminent jurist specializing in constitutional law and corporate matters.",
    about: "Eminent jurist specializing in constitutional law and corporate matters. Senior Advocate at Supreme Court.",
    email: "abhishek.singhvi@sentiralaw.com",
    phone: "+91 98765 43212",
    rating: 4.7,
    consultationFee: "₹45,000",
    availabilitySchedule: [
      { day: "Tuesday", time: "9:00 AM - 12:00 PM" },
      { day: "Wednesday", time: "2:00 PM - 5:00 PM" },
      { day: "Thursday", time: "10:00 AM - 1:00 PM" },
      { day: "Saturday", time: "11:00 AM - 2:00 PM" }
    ]
  },
  { 
    id: 4, 
    name: "Mukul Rohatgi", 
    photo: mukulRohatgiImg,
    specialization: "Corporate Law, Constitutional Law", 
    experience: 28,
    location: "New Delhi, India", 
    cases: 2100,
    description: "Former Attorney General with vast experience in corporate and constitutional law.",
    about: "Former Attorney General of India with vast experience in corporate and constitutional law.",
    email: "mukul.rohatgi@sentiralaw.com",
    phone: "+91 98765 43213",
    rating: 4.9,
    consultationFee: "₹60,000",
    availabilitySchedule: [
      { day: "Monday", time: "11:00 AM - 2:00 PM" },
      { day: "Tuesday", time: "10:00 AM - 1:00 PM" },
      { day: "Thursday", time: "2:00 PM - 5:00 PM" },
      { day: "Friday", time: "10:00 AM - 1:00 PM" }
    ]
  },
  { 
    id: 5, 
    name: "Gopal Subramanium", 
    photo: gopalSubramaniumImg,
    specialization: "Criminal Law, Constitutional Law", 
    experience: 20,
    location: "New Delhi, India", 
    cases: 1500,
    description: "Senior advocate known for his expertise in criminal and constitutional matters.",
    about: "Senior advocate known for his expertise in criminal and constitutional matters. Former Solicitor General of India.",
    email: "gopal.subramanium@sentiralaw.com",
    phone: "+91 98765 43214",
    rating: 4.8,
    consultationFee: "₹40,000",
    availabilitySchedule: [
      { day: "Monday", time: "2:00 PM - 5:00 PM" },
      { day: "Wednesday", time: "9:00 AM - 12:00 PM" },
      { day: "Friday", time: "11:00 AM - 2:00 PM" }
    ]
  },
  { 
    id: 6, 
    name: "Pinky Anand", 
    photo: pinkyAnandImg,
    specialization: "Corporate Law, Civil Law", 
    experience: 18,
    location: "New Delhi, India", 
    cases: 1200,
    description: "Senior advocate with expertise in corporate law and civil litigation.",
    about: "Senior advocate with expertise in corporate law and civil litigation. Known for her meticulous approach.",
    email: "pinky.anand@sentiralaw.com",
    phone: "+91 98765 43215",
    rating: 4.7,
    consultationFee: "₹35,000",
    availabilitySchedule: [
      { day: "Tuesday", time: "10:00 AM - 1:00 PM" },
      { day: "Wednesday", time: "2:00 PM - 5:00 PM" },
      { day: "Thursday", time: "11:00 AM - 2:00 PM" },
      { day: "Saturday", time: "9:00 AM - 12:00 PM" }
    ]
  },
  { 
    id: 7, 
    name: "Arvind Datar", 
    photo: arvindDatarImg,
    specialization: "Tax Law, Constitutional Law", 
    experience: 32,
    location: "Chennai, India", 
    cases: 900,
    description: "Renowned tax counsel with extensive experience in tax and constitutional matters.",
    about: "Renowned tax counsel with extensive experience in tax and constitutional matters.",
    email: "arvind.datar@sentiralaw.com",
    phone: "+91 98765 43216",
    rating: 4.9,
    consultationFee: "₹55,000",
    availabilitySchedule: [
      { day: "Monday", time: "10:00 AM - 1:00 PM" },
      { day: "Wednesday", time: "11:00 AM - 2:00 PM" },
      { day: "Friday", time: "10:00 AM - 1:00 PM" }
    ]
  },
  { 
    id: 8, 
    name: "Salman Khurshid", 
    photo: salmanKhurshidImg,
    specialization: "Constitutional Law, Civil Law", 
    experience: 35,
    location: "New Delhi, India", 
    cases: 2800,
    description: "Former Law Minister with vast experience in constitutional and civil law.",
    about: "Former Law Minister with vast experience in constitutional and civil law.",
    email: "salman.khurshid@sentiralaw.com",
    phone: "+91 98765 43217",
    rating: 4.6,
    consultationFee: "₹65,000",
    availabilitySchedule: [
      { day: "Tuesday", time: "2:00 PM - 5:00 PM" },
      { day: "Thursday", time: "10:00 AM - 1:00 PM" },
      { day: "Friday", time: "2:00 PM - 5:00 PM" }
    ]
  },
  { 
    id: 9, 
    name: "K. Parasaran", 
    photo: kParasaranImg,
    specialization: "Constitutional Law, Religious Law", 
    experience: 40,
    location: "Chennai, India", 
    cases: 3500,
    description: "Former Attorney General with expertise in constitutional and religious law.",
    about: "Former Attorney General with expertise in constitutional and religious law.",
    email: "k.parasaran@sentiralaw.com",
    phone: "+91 98765 43218",
    rating: 4.9,
    consultationFee: "₹70,000",
    availabilitySchedule: [
      { day: "Monday", time: "11:00 AM - 2:00 PM" },
      { day: "Wednesday", time: "10:00 AM - 1:00 PM" },
      { day: "Saturday", time: "10:00 AM - 1:00 PM" }
    ]
  },
  { 
    id: 10, 
    name: "Indira Jaising", 
    photo: indiraJaisingImg,
    specialization: "Human Rights Law, Constitutional Law", 
    experience: 38,
    location: "Mumbai, India", 
    cases: 1600,
    description: "Leading human rights lawyer with expertise in constitutional law.",
    about: "Leading human rights lawyer with expertise in constitutional law. First woman to become Senior Advocate in Supreme Court.",
    email: "indira.jaising@sentiralaw.com",
    phone: "+91 98765 43219",
    rating: 4.8,
    consultationFee: "₹55,000",
    availabilitySchedule: [
      { day: "Tuesday", time: "11:00 AM - 2:00 PM" },
      { day: "Wednesday", time: "2:00 PM - 5:00 PM" },
      { day: "Thursday", time: "10:00 AM - 1:00 PM" },
      { day: "Friday", time: "11:00 AM - 2:00 PM" }
    ]
  }
]



export default function TopLawyers() {
  const [lawyers, setLawyers] = useState(fallbackLawyers)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLawyers()
  }, [])

  const fetchLawyers = async () => {
    try {
      const response = await fetch(apiUrl('/api/lawyers'))
      const data = await response.json()
      if (data.success && data.lawyers && data.lawyers.length > 0) {
        const mappedLawyers = data.lawyers.map((lawyer, index) => ({
          ...lawyer,
          id: lawyer.id || index + 1,
          photo: fallbackLawyers[index]?.photo || lawyer.photo,
          cases: lawyer.cases || fallbackLawyers[index]?.cases || 0,
          description: lawyer.description || fallbackLawyers[index]?.description || lawyer.about,
          about: lawyer.about || fallbackLawyers[index]?.about || lawyer.description,
          rating: lawyer.rating || fallbackLawyers[index]?.rating || 4.5,
          consultationFee: lawyer.consultationFee || fallbackLawyers[index]?.consultationFee || "₹30,000",
          email: lawyer.email || fallbackLawyers[index]?.email || "info@sentiralaw.com",
          phone: lawyer.phone || fallbackLawyers[index]?.phone || "+91 98765 43210",
          availabilitySchedule: lawyer.availabilitySchedule || fallbackLawyers[index]?.availabilitySchedule || []
        }))
        setLawyers(mappedLawyers)
      }
    } catch (error) {
      console.log('Using fallback lawyer data:', error.message)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="lawyers-page-wrapper loading">
        <div className="premium-loader-box">
          <div className="spinner-l"></div>
          <p>Syncing with Legal Database...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="lawyers-page-wrapper">
      <div className="lawyers-container-premium">
        <div className="lawyers-header-premium ultra-glass">
          <span className="premium-badge">Directory</span>
          <h1 className="text-grad-ocean">Top Lawyers</h1>
          <p className="subtitle">Connect with India's most distinguished legal minds, curated for complex litigation and strategic advisory.</p>
        </div>

        <div className="lawyers-grid-premium">
          {lawyers.map((lawyer) => (
            <div key={lawyer.id} className="lawyer-card-premium premium-card neon-border-primary">
              <div className="lc-card-inner">
                {/* Left Column: Photo & Rating */}
                <div className="lc-left-col">
                  <div className="lc-image-wrapper">
                    <img src={lawyer.photo} alt={lawyer.name} className="lc-image" />
                    <div className="lc-rating">⭐ {lawyer.rating}</div>
                  </div>
                  <div className="lc-status">
                    <span className="dot"></span> Available
                  </div>
                </div>

                {/* Right Column: Info & Actions */}
                <div className="lc-right-col">
                  <div className="lc-body">
                    <h3 className="lc-name">{lawyer.name}</h3>
                    <div className="lc-spec-badge">{lawyer.specialization}</div>
                    
                    <div className="lc-details-grid">
                      <div className="lc-detail-item">
                        <span className="icon">📍</span>
                        <span className="label">Location:</span>
                        <span className="value">{lawyer.location}</span>
                      </div>
                      <div className="lc-detail-item">
                        <span className="icon">💼</span>
                        <span className="label">Experience:</span>
                        <span className="value">{lawyer.experience} Years</span>
                      </div>
                      <div className="lc-detail-item">
                        <span className="icon">⚖️</span>
                        <span className="label">Cases Handled:</span>
                        <span className="value">{lawyer.cases}+ High-Stake</span>
                      </div>
                      <div className="lc-detail-item">
                        <span className="icon">💸</span>
                        <span className="label">Consultation Fee:</span>
                        <span className="value">{lawyer.consultationFee}</span>
                      </div>
                    </div>

                    <p className="lc-description">{lawyer.description}</p>
                  </div>

                  <div className="lc-footer">
                    <button 
                      className="lc-btn location-btn"
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lawyer.name + ' ' + lawyer.location)}`, '_blank')}
                    >
                      <span className="btn-icon">🗺️</span> View Location
                    </button>
                    <Link to={`/lawyer/${lawyer.id}`} className="lc-btn primary">
                      Consult Now
                    </Link>
                  </div>
                </div>
              </div>
              <div className="lc-glow"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
