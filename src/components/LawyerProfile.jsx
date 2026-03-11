import { useState, useEffect } from 'react'
import './LawyerProfile.css'

// Mock lawyer data - same as TopLawyers
const lawyersData = [
  {
    id: 1,
    name: 'Adv. Priya Sharma',
    specialization: 'Criminal Law',
    experience: 15,
    casesHandled: 1250,
    rating: 4.9,
    phone: '+91 98765 43210',
    email: 'priya.sharma@lawfirm.com',
    address: '123 Legal Avenue, Connaught Place, New Delhi',
    bio: 'Senior criminal defense attorney with extensive experience in handling complex criminal cases. Known for strategic litigation and client-focused approach. Specializes in bail matters, criminal appeals, and white-collar crime. Has successfully defended over 1000 clients in various criminal proceedings.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    languages: ['English', 'Hindi', 'Punjabi'],
    education: 'LLM, Harvard Law School',
    barCouncilId: 'DL/2010/12345',
    officeHours: 'Mon-Sat: 9:00 AM - 7:00 PM',
    consultationFee: '₹5,000',
    achievements: ['Best Criminal Lawyer 2023', '1000+ Cases Won', 'High Court Bar Association Member']
  },
  {
    id: 2,
    name: 'Adv. Raj Khanna',
    specialization: 'Property Law',
    experience: 20,
    casesHandled: 2100,
    rating: 4.8,
    phone: '+91 98765 43211',
    email: 'raj.khanna@lawfirm.com',
    address: '456 Justice Road, Bandra West, Mumbai',
    bio: 'Expert property lawyer specializing in real estate disputes, title verification, and property documentation. Successfully handled 2000+ cases. Known for thorough research and attention to detail. Expert in RERA matters and builder disputes.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    languages: ['English', 'Hindi', 'Marathi'],
    education: 'LLB, Mumbai University',
    barCouncilId: 'MH/2005/67890',
    officeHours: 'Mon-Fri: 10:00 AM - 6:00 PM',
    consultationFee: '₹7,500',
    achievements: ['Property Law Expert', '2000+ Cases Resolved', 'RERA Certified']
  },
  {
    id: 3,
    name: 'Adv. Anjali Menon',
    specialization: 'Family Law',
    experience: 12,
    casesHandled: 890,
    rating: 4.9,
    phone: '+91 98765 43212',
    email: 'anjali.menon@lawfirm.com',
    address: '789 Family Court Lane, Richmond Road, Bangalore',
    bio: 'Compassionate family law attorney specializing in divorce, child custody, and domestic violence cases. Known for sensitive handling of family matters. Provides emotional support alongside legal guidance.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    languages: ['English', 'Hindi', 'Kannada', 'Malayalam'],
    education: 'LLM, National Law School of India University',
    barCouncilId: 'KA/2013/45678',
    officeHours: 'Mon-Sat: 9:00 AM - 6:00 PM',
    consultationFee: '₹4,500',
    achievements: ['Family Law Specialist', 'Certified Mediator', 'Women Rights Advocate']
  },
  {
    id: 4,
    name: 'Adv. Vikram Singh',
    specialization: 'Corporate Law',
    experience: 18,
    casesHandled: 1560,
    rating: 4.7,
    phone: '+91 98765 43213',
    email: 'vikram.singh@corporatelaw.com',
    address: '101 Business Park, Salt Lake, Kolkata',
    bio: 'Corporate law expert handling mergers, acquisitions, and commercial disputes. Former legal head of Fortune 500 companies. Specializes in contract law and business compliance.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    languages: ['English', 'Hindi', 'Bengali'],
    education: 'LLM, London School of Economics',
    barCouncilId: 'WB/2007/23456',
    officeHours: 'Mon-Fri: 10:00 AM - 7:00 PM',
    consultationFee: '₹10,000',
    achievements: ['Corporate Law Expert', 'Former Legal Head - MNC', 'M&A Specialist']
  },
  {
    id: 5,
    name: 'Adv. Sarah Johnson',
    specialization: 'Criminal Law',
    experience: 10,
    casesHandled: 650,
    rating: 4.8,
    phone: '+91 98765 43214',
    email: 'sarah.johnson@lawfirm.com',
    address: '202 Defense Colony, Ameerpet, Hyderabad',
    bio: 'Dynamic criminal lawyer with expertise in white-collar crime and cyber law. Specializes in corporate fraud and digital forensics. Tech-savvy attorney with modern approach.',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400',
    languages: ['English', 'Hindi', 'Telugu'],
    education: 'LLM, NALSAR University of Law',
    barCouncilId: 'TS/2015/78901',
    officeHours: 'Mon-Sat: 9:00 AM - 8:00 PM',
    consultationFee: '₹6,000',
    achievements: ['Cyber Law Expert', 'White Collar Crime Specialist', 'Digital Forensics Certified']
  },
  {
    id: 6,
    name: 'Adv. Amit Patel',
    specialization: 'Property Law',
    experience: 14,
    casesHandled: 1100,
    rating: 4.6,
    phone: '+91 98765 43215',
    email: 'amit.patel@proplaw.com',
    address: '303 Real Estate Plaza, SG Highway, Ahmedabad',
    bio: 'Property law specialist with deep expertise in land acquisition, builder disputes, and RERA matters. Trusted by major developers. Expert in property tax and conversion.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    languages: ['English', 'Hindi', 'Gujarati'],
    education: 'LLB, Gujarat National Law University',
    barCouncilId: 'GJ/2011/34567',
    officeHours: 'Mon-Fri: 9:00 AM - 6:00 PM',
    consultationFee: '₹5,500',
    achievements: ['RERA Expert', 'Developer Legal Advisor', 'Land Acquisition Specialist']
  },
  {
    id: 7,
    name: 'Adv. Meera Kapoor',
    specialization: 'Family Law',
    experience: 16,
    casesHandled: 1450,
    rating: 4.9,
    phone: '+91 98765 43216',
    email: 'meera.kapoor@familylaw.com',
    address: '404 Harmony Street, Kormanagala, Chennai',
    bio: 'Veteran family law practitioner with special focus on international divorces, inter-caste marriages, and adoption cases. Compassionate and client-focused approach.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
    languages: ['English', 'Hindi', 'Tamil'],
    education: 'LLM, Tamil Nadu Dr. Ambedkar Law University',
    barCouncilId: 'TN/2009/56789',
    officeHours: 'Mon-Sat: 10:00 AM - 6:00 PM',
    consultationFee: '₹4,000',
    achievements: ['International Family Law', 'Adoption Law Expert', 'Mediation Certified']
  },
  {
    id: 8,
    name: 'Adv. Rohit Verma',
    specialization: 'Corporate Law',
    experience: 11,
    casesHandled: 780,
    rating: 4.7,
    phone: '+91 98765 43217',
    email: 'rohit.verma@corplaw.in',
    address: '505 Corporate Tower, Golf Course Road, Gurgaon',
    bio: 'Corporate litigation expert specializing in contract disputes, intellectual property, and startup law. Advisor to 50+ startups. Focuses on practical business solutions.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    languages: ['English', 'Hindi'],
    education: 'LLB, Symbiosis International University',
    barCouncilId: 'HR/2014/89012',
    officeHours: 'Mon-Fri: 9:00 AM - 7:00 PM',
    consultationFee: '₹8,000',
    achievements: ['Startup Legal Advisor', 'IPR Specialist', 'Contract Expert']
  },
  {
    id: 9,
    name: 'Adv. Jennifer Dsouza',
    specialization: 'Criminal Law',
    experience: 8,
    casesHandled: 420,
    rating: 4.8,
    phone: '+91 98765 43218',
    email: 'jennifer.dsouza@defenselaw.com',
    address: '606 Justice Lane, FC Road, Pune',
    bio: 'Passionate criminal defense lawyer with expertise in bail matters, criminal appeals, and human rights law. Known for aggressive defense strategies.',
    image: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400',
    languages: ['English', 'Hindi', 'Marathi', 'Konkani'],
    education: 'LLB, Maharashtra Law College',
    barCouncilId: 'MH/2017/90123',
    officeHours: 'Mon-Sat: 10:00 AM - 7:00 PM',
    consultationFee: '₹3,500',
    achievements: ['Human Rights Advocate', 'Bail Specialist', 'Criminal Appeals Expert']
  },
  {
    id: 10,
    name: 'Adv. Sanjay Gupta',
    specialization: 'Property Law',
    experience: 22,
    casesHandled: 2800,
    rating: 4.9,
    phone: '+91 98765 43219',
    email: 'sanjay.gupta@propertyspecialist.com',
    address: '707 Land Registry Road, Civil Lines, Jaipur',
    bio: 'Veteran property lawyer with unmatched expertise in title disputes, land conversion, and heritage property matters. Decades of experience in property law.',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400',
    languages: ['English', 'Hindi', 'Rajasthani'],
    education: 'LLM, University of Rajasthan',
    barCouncilId: 'RJ/2003/11223',
    officeHours: 'Mon-Fri: 9:00 AM - 5:00 PM',
    consultationFee: '₹6,500',
    achievements: ['Senior Property Lawyer', 'Title Dispute Expert', 'Heritage Property Specialist']
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

export default function LawyerProfile({ lawyerId, onNavigate }) {
  const [lawyer, setLawyer] = useState(null)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    const foundLawyer = lawyersData.find(l => l.id === parseInt(lawyerId))
    setLawyer(foundLawyer)
  }, [lawyerId])

  if (!lawyer) {
    return (
      <div className="lawyer-profile-container">
        <div className="loading-state">
          <span className="loading-spinner"></span>
          <p>Loading lawyer profile...</p>
        </div>
      </div>
    )
  }

  const getCoordinates = () => {
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (lawyer.address.toLowerCase().includes(city.toLowerCase())) {
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
      <button className="back-button" onClick={() => onNavigate('top-lawyers')}>
        ← Back to Lawyers
      </button>

      <div className="profile-header">
        <div className="profile-photo">
          <img src={lawyer.image} alt={lawyer.name} />
          <div className="rating-badge">
            <span>⭐ {lawyer.rating}</span>
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
              <span className="stat-number">{lawyer.casesHandled}</span>
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
            <p>{lawyer.bio}</p>
          </section>

          {/* Specialization Areas */}
          <section className="profile-section">
            <h2>⚖️ Specialization Areas</h2>
            <div className="specialization-tags">
              <span className="spec-tag">{lawyer.specialization}</span>
              <span className="spec-tag">Litigation</span>
              <span className="spec-tag">Legal Consultation</span>
              <span className="spec-tag">Case Strategy</span>
            </div>
          </section>

          {/* Achievements */}
          <section className="profile-section">
            <h2>🏆 Achievements</h2>
            <ul className="achievements-list">
              {lawyer.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </section>

          {/* Languages */}
          <section className="profile-section">
            <h2>🗣️ Languages</h2>
            <div className="language-tags">
              {lawyer.languages.map((lang, index) => (
                <span key={index} className="language-tag">{lang}</span>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="profile-section">
            <h2>🎓 Education</h2>
            <p className="education-text">{lawyer.education}</p>
            <p className="bar-council-id">Bar Council ID: {lawyer.barCouncilId}</p>
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
            <div className="contact-item">
              <span className="contact-label">Office Hours:</span>
              <span className="contact-value">{lawyer.officeHours}</span>
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
            <p className="office-address">{lawyer.address}</p>
            
            <button 
              className="btn-toggle-map"
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? 'Hide Map' : '🗺️ View on Map'}
            </button>
            
            {showMap && (
              <div className="map-container">
                <iframe
                  title="Office Location"
                  width="100%"
                  height="250"
                  style={{ border: 0, borderRadius: '10px' }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d${coords.lng}!3d${coords.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM3DCsDU1JzAwLjAiTiA3N8KwMzUnMjAuNCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin`}
                />
              </div>
            )}
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
