import { useEffect, useRef } from 'react'
import './Footer.css'

export default function Footer() {
  const footerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <footer 
      ref={footerRef}
      className="footer-premium ultra-glass border-t border-white/10 mt-20 fade-in-section"
      data-animate-footer
    >

      <div className="footer-content-p max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-5 gap-12">
        <div className="footer-section-p">
          <h3 className="text-grad-royal font-black text-2xl mb-4">Sentira-Law</h3>
          <p className="text-slate-300 text-sm">The Emotional Legal Mediator</p>
          <p className="text-accent text-xs font-bold mt-2 uppercase tracking-tighter">Empathy • Intelligence • Justice</p>
        </div>

        <div className="footer-section-p">
          <h4 className="text-white font-bold mb-6">Product</h4>
          <ul className="space-y-3 text-slate-400 text-sm">
            <li><a href="#features" className="hover:text-accent transition-colors">Neural Features</a></li>
            <li><a href="#pricing" className="hover:text-accent transition-colors">Strategic Pricing</a></li>
            <li><a href="#mediation" className="hover:text-accent transition-colors">Initiate Mediation</a></li>
          </ul>
        </div>

        <div className="footer-section-p">
          <h4 className="text-white font-bold mb-6">Network</h4>
          <ul className="space-y-3 text-slate-400 text-sm">
            <li><a href="#about" className="hover:text-accent transition-colors">Our Ethos</a></li>
            <li><a href="#blog" className="hover:text-accent transition-colors">Intelligence Hub</a></li>
            <li><a href="#careers" className="hover:text-accent transition-colors">Neural Careers</a></li>
          </ul>
        </div>

        <div className="footer-section-p">
          <h4 className="text-white font-bold mb-6">Governance</h4>
          <ul className="space-y-3 text-slate-400 text-sm">
            <li><a href="#privacy" className="hover:text-accent transition-colors">Privacy Protocol</a></li>
            <li><a href="#terms" className="hover:text-accent transition-colors">Terms of Engagement</a></li>
            <li><a href="#ethics" className="hover:text-accent transition-colors">AI Synthesis Ethics</a></li>
          </ul>
        </div>

        <div className="footer-section-p">
          <h4 className="text-white font-bold mb-6">Channel</h4>
          <ul className="space-y-3 text-slate-400 text-sm">
            <li><a href="mailto:liaison@sentira.law" className="hover:text-accent transition-colors">liaison@sentira.law</a></li>
            <li><a href="tel:+1234567890" className="hover:text-accent transition-colors">+1 (234) 567-890</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom-p border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs italic">&copy; 2024 Sentira-Law. All rights reserved. | Built with neural empathy and strategic intelligence.</p>
          <div className="social-links-p flex gap-6">
            <a href="#twitter" className="text-slate-400 hover:text-accent text-xl transition-all hover:scale-110">𝕏</a>
            <a href="#linkedin" className="text-slate-400 hover:text-accent text-xl transition-all hover:scale-110">in</a>
            <a href="#facebook" className="text-slate-400 hover:text-accent text-xl transition-all hover:scale-110">f</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
