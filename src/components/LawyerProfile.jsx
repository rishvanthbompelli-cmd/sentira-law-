import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './LawyerProfile.css'

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

// Lawyers data - same as TopLawyers
const lawyersData = [
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

// Get coordinates for different cities (mock)
const cityCoordinates = {
  'New Delhi': { lat: 28.6139, lng: 77.2090 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Bangalore': { lat: 12.9716, lng: 77.5946 },
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Gurgaon': { lat: 28.4595, lng: 77.0266 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Jaipur': { lat: 26.9124, lng: 75.7873 }
}

export default function LawyerProfile() {
  const { id: lawyerId } = useParams()
  const navigate = useNavigate()
  const [lawyer, setLawyer] = useState(null)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    console.log('Looking for lawyer with ID:', lawyerId)
    
    // First try to find in hardcoded data
    let foundLawyer = lawyersData.find(l => l.id === parseInt(lawyerId))
    
    // If not found, try to fetch from API
    if (!foundLawyer) {
      console.log('Lawyer not in hardcoded data, trying API...')
      fetch(apiUrl('/api/lawyers'))
        .then(response => response.json())
        .then(data => {
          if (data.success && data.lawyers) {
            const apiLawyer = data.lawyers.find(l => l.id === parseInt(lawyerId))
            if (apiLawyer) {
              console.log('Found lawyer in API:', apiLawyer)
              setLawyer(apiLawyer)
            }
          }
        })
        .catch(error => {
          console.error('Error fetching lawyer from API:', error)
        })
    } else {
      console.log('Found lawyer in hardcoded data:', foundLawyer)
      setLawyer(foundLawyer)
    }
  }, [lawyerId])

  if (!lawyer) {
    return (
      <div className="lawyer-profile-container">
        <button className="back-button" onClick={() => navigate('/top-lawyers')}>
          ← Back to Lawyers
        </button>
        <div className="loading-state">
          <span className="loading-spinner"></span>
          <p>Lawyer not found. Please try again.</p>
        </div>
      </div>
    )
  }

  const getCoordinates = () => {
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (lawyer.location.toLowerCase().includes(city.toLowerCase())) {
        return coords
      }
    }
    // Default to Delhi
    return cityCoordinates['New Delhi']
  }

  const coords = getCoordinates()

  const handleContact = () => {
    window.location.href = `tel:${lawyer.phone}`
  }

  const handleEmail = () => {
    window.location.href = `mailto:${lawyer.email}`
  }

  const handleBookConsultation = () => {
    alert(`Consultation request sent to ${lawyer.name}. They will contact you shortly.`)
  }

  return (
    <div className="lawyer-profile-container">
      <button className="back-button" onClick={() => navigate('/top-lawyers')}>
        ← Back to Lawyers
      </button>

      <div className="profile-header">
        <div className="lp-profile-photo">
          <img src={lawyer.photo} alt={lawyer.name} />
          <div className="rating-badge">
            <span>⭐ {lawyer.rating}/5.0</span>
          </div>
        </div>
        
        <div className="profile-info">
          <h1>{lawyer.name}</h1>
          <span className="specialization-tag">{lawyer.specialization}</span>
          
          <div className="quick-stats">
            <div className="quick-stat">
              <span className="stat-number">{lawyer.experience}</span>
              <span className="stat-text">Years Experience</span>
            </div>
            <div className="quick-stat">
              <span className="stat-number">{lawyer.cases}+</span>
              <span className="stat-text">Cases Handled</span>
            </div>
            <div className="quick-stat">
              <span className="stat-number">{lawyer.consultationFee}</span>
              <span className="stat-text">Consultation Fee</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-main">
          {/* Biography */}
          <section className="profile-section">
            <h2>📋 Biography</h2>
            <p>{lawyer.about}</p>
          </section>

          {/* Description */}
          <section className="profile-section">
            <h2>📝 Professional Summary</h2>
            <p>{lawyer.description}</p>
          </section>

          {/* Specialization Areas */}
          <section className="profile-section">
            <h2>⚖️ Specialization Areas</h2>
            <div className="specialization-tags">
              {lawyer.specialization.split(', ').map((spec, index) => (
                <span key={index} className="spec-tag">{spec}</span>
              ))}
            </div>
          </section>

          {/* Availability Schedule */}
          <section className="profile-section">
            <h2>📅 Availability Schedule</h2>
            <div className="availability-list">
              {lawyer.availabilitySchedule.map((schedule, index) => (
                <div key={index} className="availability-item">
                  <span className="day">{schedule.day}</span>
                  <span className="time">{schedule.time}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Location */}
          <section className="profile-section">
            <h2>📍 Location</h2>
            <p className="location-text">{lawyer.location}</p>
          </section>
        </div>

        <div className="profile-sidebar">
          {/* Contact Card */}
          <div className="contact-card">
            <h3>📞 Contact Information</h3>
            <div className="contact-item">
              <span className="contact-label">Phone:</span>
              <span className="contact-value">{lawyer.phone}</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Email:</span>
              <span className="contact-value">{lawyer.email}</span>
            </div>
            
            <div className="contact-buttons">
              <button className="btn-contact-primary" onClick={handleContact}>
                📞 Call Now
              </button>
              <button className="btn-contact-secondary" onClick={handleEmail}>
                📧 Send Email
              </button>
            </div>
            
            <button className="btn-book-consultation" onClick={handleBookConsultation}>
              📅 Book Consultation
            </button>
          </div>

          {/* Office Location */}
          <div className="location-card">
            <h3>📍 Office Location</h3>
            <p className="office-address">{lawyer.location}</p>
            
            <button 
              className="btn-toggle-map"
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(lawyer.name + ', ' + lawyer.location)}`, '_blank')}
            >
              🗺️ View Directions on Map
            </button>
          </div>

          {/* AI Recommendation */}
          <div className="ai-recommendation-card">
            <h3>🤖 AI Recommendation</h3>
            <p className="ai-recommendation-text">
              Based on your case type and this lawyer's expertise, we recommend this lawyer with 
              <strong> {Math.round(lawyer.rating * 20)}%</strong> confidence level.
            </p>
            <div className="match-score">
              <div className="match-bar">
                <div 
                  className="match-fill" 
                  style={{ width: `${Math.round(lawyer.rating * 20)}%` }}
                />
              </div>
              <span>{Math.round(lawyer.rating * 20)}% Match</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
