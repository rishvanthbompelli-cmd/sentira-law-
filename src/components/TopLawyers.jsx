import { useState, useEffect, useMemo, lazy, Suspense } from 'react'
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
import indiraJaisingImg from '../../assets/Indira Jaising.jpg'

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

// Cache for lawyers data - using localStorage for persistence
const CACHE_KEY = 'sentira_lawyers_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Get cached lawyers from localStorage or return fallback
const getCachedLawyers = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data
      }
    }
  } catch (e) {
    console.log('Cache read error:', e.message)
  }
  return fallbackLawyers
}

// Save lawyers to localStorage cache
const saveLawyersToCache = (lawyers) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: lawyers,
      timestamp: Date.now()
    }))
  } catch (e) {
    console.log('Cache save error:', e.message)
  }
}

// Preload lawyers data (called from App.jsx)
export const preloadLawyers = async () => {
  try {
    const response = await fetch(apiUrl('/api/lawyers'))
    const data = await response.json()
    if (data.success && data.lawyers && data.lawyers.length > 0) {
      const mappedLawyers = data.lawyers.map((lawyer, index) => ({
        ...lawyer,
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
      saveLawyersToCache(mappedLawyers)
      return mappedLawyers
    }
  } catch (error) {
    console.log('Preload failed, using fallback:', error.message)
  }
  return fallbackLawyers
}

export default function TopLawyers({ onNavigate, lawyerId }) {
  const [lawyers, setLawyers] = useState(getCachedLawyers)
  const [loading, setLoading] = useState(false) // Start with false since we have cached/fallback data
  const [selectedLawyer, setSelectedLawyer] = useState(null)

  useEffect(() => {
    // Refresh data from server in background, but don't block rendering
    fetchLawyers()
  }, []) // Empty dependency - only run once on mount

  // Auto-select lawyer if lawyerId is provided
  useEffect(() => {
    if (lawyerId && lawyers.length > 0) {
      const lawyer = lawyers.find(l => l.id === parseInt(lawyerId))
      if (lawyer) {
        setSelectedLawyer(lawyer)
      }
    }
  }, [lawyerId, lawyers])

  const fetchLawyers = async () => {
    try {
      const response = await fetch(apiUrl('/api/lawyers'))
      const data = await response.json()
      if (data.success && data.lawyers && data.lawyers.length > 0) {
        const mappedLawyers = data.lawyers.map((lawyer, index) => ({
          ...lawyer,
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
        saveLawyersToCache(mappedLawyers)
      }
    } catch (error) {
      console.log('Using cached/fallback lawyer data:', error.message)
    }
    setLoading(false)
  }

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
        <button className="back-btn-premium ultra-glass" onClick={handleBack}>
          ← Back to Network
        </button>
        
        <div className="premium-card neon-border-primary vibrant-glow-primary">
          <div className="profile-header">
            <div className="profile-photo-wrapper">
              <img 
                src={selectedLawyer.photo} 
                alt={selectedLawyer.name} 
                className="profile-photo"
              />
              <div className="profile-photo-glow"></div>
            </div>
            <div className="profile-info">
              <h2 className="text-grad-royal">{selectedLawyer.name}</h2>
              <p className="specialization-large">{selectedLawyer.specialization}</p>
              <div className="profile-stats-row">
                 <p className="stat">📍 {selectedLawyer.location}</p>
                 <p className="stat">💼 {selectedLawyer.experience} Years Exp</p>
                 <p className="stat">⚖️ {selectedLawyer.cases}+ Cases</p>
              </div>
              <div className="rating-badge">⭐ {selectedLawyer.rating} / 5.0</div>
            </div>
          </div>
          
          <div className="profile-body">
            <h3 className="text-grad-ocean">Biography</h3>
            <p className="bio-text">{selectedLawyer.about || selectedLawyer.description}</p>
            
            <div className="contact-section ultra-glass">
              <h3 className="text-grad-royal">Direct Contact</h3>
              <div className="contact-grid">
                <p><span>📧</span> {selectedLawyer.email}</p>
                <p><span>📱</span> {selectedLawyer.phone}</p>
                <p><span>💰</span> Fee: {selectedLawyer.consultationFee}</p>
              </div>
            </div>

            <h3 className="text-grad-gold">Available Consultation Times</h3>
            <div className="availability-schedule">
              {selectedLawyer.availabilitySchedule && selectedLawyer.availabilitySchedule.length > 0 ? (
                <div className="schedule-grid">
                  {selectedLawyer.availabilitySchedule.map((slot, index) => (
                    <div key={index} className="schedule-item-premium ultra-glass">
                      <span className="day">{slot.day}</span>
                      <span className="time">{slot.time}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-availability">Schedule to be announced</p>
              )}
            </div>
            
            <button 
              className="btn-primary-premium mt-8"
              onClick={() => onNavigate(`lawyer-locations-${selectedLawyer.id}`)}
            >
              📍 Find Office Location
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Skeleton loader
  if (loading) {
    return (
      <div className="lawyers-container">
        <div className="lawyers-header ultra-glass neon-border-accent">
          <h1 className="text-grad-ocean">Top Indian Lawyers</h1>
          <p className="text-slate-300">Expert legal professionals ready to help with your case</p>
        </div>
        <div className="lawyers-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="lawyer-card-premium premium-card skeleton-card">
              <div className="skeleton skeleton-photo"></div>
              <div className="skeleton skeleton-name"></div>
              <div className="skeleton skeleton-spec"></div>
              <div className="skeleton skeleton-loc"></div>
              <div className="skeleton skeleton-btn"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="lawyers-container">
      <div className="lawyers-header ultra-glass neon-border-accent vibrant-glow-accent">
        <h1 className="text-grad-ocean">Top Indian Lawyers</h1>
        <p className="text-slate-300">Expert legal professionals ready to help with your case</p>
      </div>

      <div className="lawyers-grid">
        {lawyers.map((lawyer) => (
          <div 
            key={lawyer.id} 
            className="lawyer-card-premium premium-card"
          >
            <div className="lawyer-photo-wrapper">
              <img 
                src={lawyer.photo} 
                alt={lawyer.name} 
                className="lawyer-photo"
                loading="lazy"
              />
              <div className="photo-glow"></div>
            </div>
            <div className="lawyer-info">
              <h3 className="text-grad-royal">{lawyer.name}</h3>
              <p className="lawyer-specialization-badge">{lawyer.specialization}</p>
              <div className="lawyer-stats-grid">
                <p className="lawyer-location">📍 {lawyer.location}</p>
                <p className="lawyer-experience">💼 {lawyer.experience} Yrs Exp</p>
                <p className="lawyer-cases">⚖️ {lawyer.cases}+ Cases</p>
              </div>
              <div className="lawyer-actions">
                <button 
                  className="btn-view-profile-premium"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewProfile(lawyer)
                  }}
                >
                  View Full Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
