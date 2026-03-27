import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { apiUrl } from '../apiClient'
import './LawyerDetail.css'

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

const fallbackLawyers = [
  { id: 1, name: "Harish Salve", photo: harishSalveImg, specialization: "Constitutional Law, Corporate Law", experience: 25, location: "New Delhi, India", cases: 2500, about: "Senior advocate with extensive experience in constitutional matters and corporate litigation. Former Additional Solicitor General of India.", email: "harish.salve@sentiralaw.com", phone: "+91 98765 43210", rating: 4.9, consultationFee: "₹50,000" },
  { id: 2, name: "Kapil Sibal", photo: kapilSibalImg, specialization: "Constitutional Law, Civil Law", experience: 30, location: "New Delhi, India", cases: 3200, about: "Former Minister and senior counsel known for his expertise in constitutional and civil law. One of India's most distinguished lawyers.", email: "kapil.sibal@sentiralaw.com", phone: "+91 98765 43211", rating: 4.8, consultationFee: "₹75,000" },
  { id: 3, name: "Abhishek Manu Singhvi", photo: abhishekSinghviImg, specialization: "Constitutional Law, Corporate Law", experience: 22, location: "New Delhi, India", cases: 1800, about: "Eminent jurist specializing in constitutional law and corporate matters. Senior Advocate at Supreme Court.", email: "abhishek.singhvi@sentiralaw.com", phone: "+91 98765 43212", rating: 4.7, consultationFee: "₹45,000" },
  { id: 4, name: "Mukul Rohatgi", photo: mukulRohatgiImg, specialization: "Corporate Law, Constitutional Law", experience: 28, location: "New Delhi, India", cases: 2100, about: "Former Attorney General of India with vast experience in corporate and constitutional law.", email: "mukul.rohatgi@sentiralaw.com", phone: "+91 98765 43213", rating: 4.9, consultationFee: "₹60,000" },
  { id: 5, name: "Gopal Subramanium", photo: gopalSubramaniumImg, specialization: "Criminal Law, Constitutional Law", experience: 20, location: "New Delhi, India", cases: 1500, about: "Senior advocate known for his expertise in criminal and constitutional matters. Former Solicitor General of India.", email: "gopal.subramanium@sentiralaw.com", phone: "+91 98765 43214", rating: 4.8, consultationFee: "₹40,000" },
  { id: 6, name: "Pinky Anand", photo: pinkyAnandImg, specialization: "Corporate Law, Civil Law", experience: 18, location: "New Delhi, India", cases: 1200, about: "Senior advocate with expertise in corporate law and civil litigation. Known for her meticulous approach.", email: "pinky.anand@sentiralaw.com", phone: "+91 98765 43215", rating: 4.7, consultationFee: "₹35,000" },
  { id: 7, name: "Arvind Datar", photo: arvindDatarImg, specialization: "Tax Law, Constitutional Law", experience: 32, location: "Chennai, India", cases: 900, about: "Renowned tax counsel with extensive experience in tax and constitutional matters.", email: "arvind.datar@sentiralaw.com", phone: "+91 98765 43216", rating: 4.9, consultationFee: "₹55,000" },
  { id: 8, name: "Salman Khurshid", photo: salmanKhurshidImg, specialization: "Constitutional Law, Civil Law", experience: 35, location: "New Delhi, India", cases: 2800, about: "Former Law Minister with vast experience in constitutional and civil law.", email: "salman.khurshid@sentiralaw.com", phone: "+91 98765 43217", rating: 4.6, consultationFee: "₹65,000" },
  { id: 9, name: "K. Parasaran", photo: kParasaranImg, specialization: "Constitutional Law, Religious Law", experience: 40, location: "Chennai, India", cases: 3500, about: "Former Attorney General with expertise in constitutional and religious law.", email: "k.parasaran@sentiralaw.com", phone: "+91 98765 43218", rating: 4.9, consultationFee: "₹70,000" },
  { id: 10, name: "Indira Jaising", photo: indiraJaisingImg, specialization: "Human Rights Law, Constitutional Law", experience: 38, location: "Mumbai, India", cases: 1600, about: "Leading human rights lawyer with expertise in constitutional law. First woman to become Senior Advocate in Supreme Court.", email: "indira.jaising@sentiralaw.com", phone: "+91 98765 43219", rating: 4.8, consultationFee: "₹55,000" }
]

export default function LawyerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lawyer, setLawyer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLawyer = async () => {
      setLoading(true)
      console.log('Fetching lawyer with ID:', id)
      
      const useFallback = () => {
        console.log('Falling back to local data for ID:', id)
        const fallback = fallbackLawyers.find(f => f.id === parseInt(id))
        setLawyer(fallback || null)
      }

      try {
        const response = await fetch(apiUrl('/api/lawyers'))
        if (!response.ok) {
          console.warn('API returned error status:', response.status)
          useFallback()
          setLoading(false)
          return
        }
        
        const data = await response.json()
        if (data.success && data.lawyers) {
          const foundLawyer = data.lawyers.find(l => l.id === parseInt(id))
          if (foundLawyer) {
            const fallback = fallbackLawyers.find(f => f.id === parseInt(id))
            setLawyer({
              ...foundLawyer,
              photo: fallback?.photo || foundLawyer.photo,
              about: foundLawyer.about || fallback?.about || "Senior legal expert dedicated to providing strategic justice and empathetic mediation."
            })
          } else {
            console.warn('Lawyer not found in remote API list, trying fallback')
            useFallback()
          }
        } else {
          console.warn('API success was false or malformed data')
          useFallback()
        }
      } catch (error) {
        console.error('Fetch operation failed:', error.message)
        useFallback()
      }
      setLoading(false)
    }
    fetchLawyer()
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative z-[999]">
      <div className="spinner-premium"></div>
    </div>
  )

  if (!lawyer) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#020617] p-6 relative z-[999]">
      <div className="text-grad-ocean text-8xl font-black mb-4 opacity-20">404</div>
      <h2 className="text-4xl font-black mb-8 tracking-tighter">Lawyer Docket Not Found</h2>
      <p className="text-slate-400 mb-12 max-w-md text-center">The legal professional you are searching for is not currently in our neural network database.</p>
      <button onClick={() => navigate('/lawyers')} className="btn-primary-premium px-12 py-4 text-xs font-black uppercase tracking-[4px]">
        ← Return to Chambers
      </button>
    </div>
  )

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#020617] pt-32 pb-20 px-6 relative z-10"
    >
      <div className="max-w-6xl mx-auto">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={() => navigate('/lawyers')}
            className="group flex items-center gap-3 text-slate-400 hover:text-white transition-colors"
          >
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all font-black">
              ←
            </div>
            <span className="font-black uppercase tracking-[3px] text-[10px]">Back to Network</span>
          </button>
          <div className="px-5 py-2 rounded-full border border-accent/20 bg-accent/5 text-accent text-[9px] uppercase font-black tracking-[3px]">
            Attorney ID: {lawyer.id.toString().padStart(4, '0')}
          </div>
        </div>

        {/* Main Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Image & Badge */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative z-10 rounded-[48px] overflow-hidden border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] glass-reflection"
            >
              <img 
                src={lawyer.photo} 
                alt={lawyer.name} 
                className="w-full h-[650px] object-cover hover:scale-105 transition-transform duration-[2000ms] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>
              
              <div className="absolute bottom-10 left-10 right-10">
                <div className="flex items-center gap-4 mb-3">
                   <div className="flex text-amber-400 text-xl gap-1">
                    {"★".repeat(5)}
                  </div>
                  <span className="text-white/40 text-[9px] font-black uppercase tracking-[2px]">Elite Practitioner</span>
                </div>
              </div>
            </motion.div>
            
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/10 blur-[120px] rounded-full z-0 opacity-50"></div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-7 py-4">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[2px] w-8 bg-accent"></div>
                <span className="text-accent text-[11px] font-black uppercase tracking-[5px]">Senior Legal Counsel</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-[0.9]">
                {lawyer.name.split(' ').map((word, i) => (
                  <span key={i} className={i === 1 ? "text-grad-royal block" : "block"}>{word} </span>
                ))}
              </h1>
              
              <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white font-black uppercase tracking-[3px] text-[10px] mb-12">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                {lawyer.specialization}
              </div>

              <div className="grid grid-cols-2 gap-12 mb-12 border-b border-white/5 pb-10">
                <div className="flex flex-col">
                  <span className="text-slate-500 uppercase tracking-[4px] text-[9px] font-black mb-2">Service Tenure</span>
                  <span className="text-white text-3xl font-black">{lawyer.experience}+ Years</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 uppercase tracking-[4px] text-[9px] font-black mb-2">Primary Practice</span>
                  <span className="text-white text-3xl font-black">{lawyer.location.split(',')[0]}</span>
                </div>
              </div>

              <div className="relative mb-14">
                <h3 className="text-slate-400 text-xs font-black uppercase tracking-[3px] mb-6">Professional Narrative</h3>
                <p className="text-slate-300 text-xl leading-relaxed font-medium italic opacity-90">
                  "{lawyer.about}"
                </p>
              </div>

              <div className="flex flex-wrap gap-8 items-center pt-6">
                <button 
                  onClick={() => navigate('/contact')}
                  className="btn-primary-premium px-14 py-6 text-xs uppercase font-black tracking-[5px] group"
                >
                  <span className="group-hover:translate-x-1 transition-transform inline-block">Initiate Mediation →</span>
                </button>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[9px] font-black uppercase tracking-[3px] mb-1">Retainer Rate</span>
                  <span className="text-white text-3xl font-black">{lawyer.consultationFee || "₹50,000"}</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}
