import { useState } from 'react'
import './TopLawyers.css'

// Mock lawyer data
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
    bio: 'Senior criminal defense attorney with extensive experience in handling complex criminal cases. Known for strategic litigation and client-focused approach.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    languages: ['English', 'Hindi', 'Punjabi'],
    education: 'LLM, Harvard Law School',
    barCouncilId: 'DL/2010/12345'
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
    bio: 'Expert property lawyer specializing in real estate disputes, title verification, and property documentation. Successfully handled 2000+ cases.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    languages: ['English', 'Hindi', 'Marathi'],
    education: 'LLB, Mumbai University',
    barCouncilId: 'MH/2005/67890'
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
    bio: 'Compassionate family law attorney specializing in divorce, child custody, and domestic violence cases. Known for sensitive handling of family matters.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    languages: ['English', 'Hindi', 'Kannada', 'Malayalam'],
    education: 'LLM, National Law School of India University',
    barCouncilId: 'KA/2013/45678'
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
    bio: 'Corporate law expert handling mergers, acquisitions, and commercial disputes. Former legal head of Fortune 500 companies.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    languages: ['English', 'Hindi', 'Bengali'],
    education: 'LLM, London School of Economics',
    barCouncilId: 'WB/2007/23456'
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
    bio: 'Dynamic criminal lawyer with expertise in white-collar crime and cyber law. Specializes in corporate fraud and digital forensics.',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400',
    languages: ['English', 'Hindi', 'Telugu'],
    education: 'LLM, NALSAR University of Law',
    barCouncilId: 'TS/2015/78901'
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
    bio: 'Property law specialist with deep expertise in land acquisition, builder disputes, and RERA matters. Trusted by major developers.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    languages: ['English', 'Hindi', 'Gujarati'],
    education: 'LLB, Gujarat National Law University',
    barCouncilId: 'GJ/2011/34567'
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
    bio: 'Veteran family law practitioner with special focus on international divorces, inter-caste marriages, and adoption cases.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
    languages: ['English', 'Hindi', 'Tamil'],
    education: 'LLM, Tamil Nadu Dr. Ambedkar Law University',
    barCouncilId: 'TN/2009/56789'
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
    bio: 'Corporate litigation expert specializing in contract disputes, intellectual property, and startup law. Advisor to 50+ startups.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    languages: ['English', 'Hindi'],
    education: 'LLB, Symbiosis International University',
    barCouncilId: 'HR/2014/89012'
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
    bio: 'Passionate criminal defense lawyer with expertise in bail matters, criminal appeals, and human rights law.',
    image: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400',
    languages: ['English', 'Hindi', 'Marathi', 'Konkani'],
    education: 'LLB, Maharashtra Law College',
    barCouncilId: 'MH/2017/90123'
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
    bio: 'Veteran property lawyer with unmatched expertise in title disputes, land conversion, and heritage property matters.',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400',
    languages: ['English', 'Hindi', 'Rajasthani'],
    education: 'LLM, University of Rajasthan',
    barCouncilId: 'RJ/2003/11223'
  }
]

export default function TopLawyers({ onNavigate }) {
  const [selectedSpecialization, setSelectedSpecialization] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const specializations = [
    { value: 'all', label: 'All Specializations' },
    { value: 'Criminal Law', label: 'Criminal Law' },
    { value: 'Property Law', label: 'Property Law' },
    { value: 'Family Law', label: 'Family Law' },
    { value: 'Corporate Law', label: 'Corporate Law' }
  ]

  const filteredLawyers = lawyersData.filter(lawyer => {
    const matchesSpecialization = selectedSpecialization === 'all' || lawyer.specialization === selectedSpecialization
    const matchesSearch = lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lawyer.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSpecialization && matchesSearch
  })

  const handleViewProfile = (lawyerId) => {
    onNavigate(`lawyer-profile-${lawyerId}`)
  }

  const handleContact = (lawyer) => {
    window.location.href = `tel:${lawyer.phone}`
  }

  const handleEmail = (lawyer) => {
    window.location.href = `mailto:${lawyer.email}`
  }

  return (
    <div className="lawyers-container">
      <div className="lawyers-header">
        <h1>👨‍⚖️ Top 10 Lawyers Directory</h1>
        <p>Connect with experienced legal professionals across India</p>
      </div>

      {/* Filters */}
      <div className="lawyers-filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-dropdown">
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
          >
            {specializations.map(spec => (
              <option key={spec.value} value={spec.value}>{spec.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lawyers Grid */}
      <div className="lawyers-grid">
        {filteredLawyers.map(lawyer => (
          <div key={lawyer.id} className="lawyer-card">
            <div className="lawyer-photo">
              <img src={lawyer.image} alt={lawyer.name} />
              <div className="lawyer-rating">
                <span>⭐ {lawyer.rating}</span>
              </div>
            </div>
            
            <div className="lawyer-info">
              <h3>{lawyer.name}</h3>
              <span className="specialization-badge">{lawyer.specialization}</span>
              
              <div className="lawyer-stats">
                <div className="stat">
                  <span className="stat-value">{lawyer.experience}</span>
                  <span className="stat-label">Years Exp.</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{lawyer.casesHandled}</span>
                  <span className="stat-label">Cases</span>
                </div>
              </div>
              
              <p className="lawyer-bio">{lawyer.bio.substring(0, 100)}...</p>
              
              <div className="lawyer-contact">
                <button className="btn-contact" onClick={() => handleContact(lawyer)}>
                  📞 Call
                </button>
                <button className="btn-contact" onClick={() => handleEmail(lawyer)}>
                  📧 Email
                </button>
              </div>
              
              <button 
                className="btn-view-profile"
                onClick={() => handleViewProfile(lawyer.id)}
              >
                View Full Profile →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredLawyers.length === 0 && (
        <div className="no-results">
          <span className="no-results-icon">🔍</span>
          <h3>No lawyers found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}

// Export lawyer data for use in other components
export { lawyersData }
