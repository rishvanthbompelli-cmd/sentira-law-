import './Support.css'

export default function Support({ onNavigate }) {
  const handleDonate = () => {
    alert('Thank you for your interest in donating! This feature will be available soon.')
  }

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@sentira-law.com'
  }

  return (
    <div className="glass-container">
      <div className="support-header-premium ultra-glass neon-border-primary mb-12">
        <h1 className="text-grad-royal">Foundation Support</h1>
        <p className="text-slate-300">Empower the mission of accessible, neural-assisted legal mediation.</p>
      </div>

      <div className="support-content-p grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <section className="support-card-p premium-card neon-border-accent p-8">
          <h2 className="text-grad-ocean font-bold text-xl mb-6">Social Impact Ethos</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Sentira-Law is dedicated to bridging the critical gap between elite legal services and the underserved. 
            Your support facilitates the maintenance of our neural infrastructure, ensuring premium legal 
            advocacy remains a universal right.
          </p>
        </section>

        <section className="support-card-p premium-card neon-border-accent p-8">
          <h2 className="text-grad-ocean font-bold text-xl mb-6">Neural R&D Infrastructure</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Our platform leverages sovereign AI systems to decode the emotional subtext of legal conflict. 
            Sustained support ensures the integrity of our neural models and the security of our data vaults.
          </p>
          <ul className="support-features-p space-y-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <li className="flex items-center gap-3"><span className="text-accent">◈</span> Tier-1 Security Layering</li>
            <li className="flex items-center gap-3"><span className="text-accent">◈</span> LLM Neural Optimization</li>
            <li className="flex items-center gap-3"><span className="text-accent">◈</span> Sovereign Cloud Hosting</li>
          </ul>
        </section>
      </div>

      <div className="support-actions-p ultra-glass p-12 text-center rounded-2xl">
         <h2 className="text-white font-black text-2xl mb-8">Establish a Strategic Partnership</h2>
         <div className="flex flex-wrap justify-center gap-6">
            <button className="btn-primary-premium flex items-center gap-4 px-10 py-5 text-xl" onClick={handleDonate}>
              <span className="text-2xl">💝</span>
              <span>Contribute to Mission</span>
            </button>
            <button className="btn-secondary-premium flex items-center gap-4 px-10 py-5 text-xl border-white/10" onClick={handleContactSupport}>
              <span className="text-2xl">📧</span>
              <span>Liaison Support</span>
            </button>
         </div>
         <p className="text-dim text-xs mt-10 italic">
            For institutional synergy or sovereign partnerships: 
            <a href="mailto:synergy@sentira.law" className="text-accent underline ml-2">synergy@sentira.law</a>
         </p>
      </div>
    </div>
  )
}
