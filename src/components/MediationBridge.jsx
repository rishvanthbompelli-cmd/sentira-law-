import './MediationBridge.css'

export default function MediationBridge({ onNavigate }) {
  return (
    <section className="glass-container">
      <div className="bridge-header-premium ultra-glass neon-border-primary mb-12">
        <h1 className="text-grad-royal">Mediation Interface</h1>
        <p className="text-slate-300">Partisan Neutralization through Neural-Assisted Communication.</p>
      </div>

      <div className="bridge-dashboard-p">
        <div className="bridge-features-p grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="feature-card-p premium-card neon-border-accent hover-glow p-6">
            <h3 className="text-white font-bold mb-2">🎯 Neutral Vector</h3>
            <p className="text-slate-400 text-sm">Conflict-free digital embassy</p>
          </div>
          <div className="feature-card-p premium-card neon-border-accent hover-glow p-6">
            <h3 className="text-white font-bold mb-2">🤖 Neural Arbiter</h3>
            <p className="text-slate-400 text-sm">Real-time dialectic synthesis</p>
          </div>
          <div className="feature-card-p premium-card neon-border-accent hover-glow p-6">
            <h3 className="text-white font-bold mb-2">📝 Accord Synthesis</h3>
            <p className="text-slate-400 text-sm">Automated settlement generation</p>
          </div>
          <div className="feature-card-p premium-card neon-border-accent hover-glow p-6">
            <h3 className="text-white font-bold mb-2">🔒 sovereign Tunnel</h3>
            <p className="text-slate-400 text-sm">End-to-end encrypted sessions</p>
          </div>
        </div>

        <div className="bridge-protocol-panel ultra-glass p-8 mb-12">
          <h2 className="text-grad-ocean font-black text-xl mb-10">Neural Mediation Protocol</h2>
          <div className="process-flow-p flex flex-col md:row items-center justify-between gap-8">
            <div className="step-p text-center group">
              <div className="step-dot-p w-16 h-16 rounded-full flex items-center justify-center text-xl font-black bg-white/5 border border-white/10 group-hover:border-accent group-hover:bg-accent/10 transition-all">1</div>
              <p className="text-white text-xs font-bold mt-4 uppercase tracking-widest">Initial Pleading</p>
            </div>
            <div className="flow-dash-p hidden md:block h-[1px] flex-1 bg-white/10"></div>
            <div className="step-p text-center group">
              <div className="step-dot-p w-16 h-16 rounded-full flex items-center justify-center text-xl font-black bg-white/5 border border-white/10 group-hover:border-accent group-hover:bg-accent/10 transition-all">2</div>
              <p className="text-white text-xs font-bold mt-4 uppercase tracking-widest">Isolates Session</p>
            </div>
            <div className="flow-dash-p hidden md:block h-[1px] flex-1 bg-white/10"></div>
            <div className="step-p text-center group">
              <div className="step-dot-p w-16 h-16 rounded-full flex items-center justify-center text-xl font-black bg-white/5 border border-white/10 group-hover:border-accent group-hover:bg-accent/10 transition-all">3</div>
              <p className="text-white text-xs font-bold mt-4 uppercase tracking-widest">Synthesis</p>
            </div>
            <div className="flow-dash-p hidden md:block h-[1px] flex-1 bg-white/10"></div>
            <div className="step-p text-center group">
              <div className="step-dot-p w-16 h-16 rounded-full flex items-center justify-center text-xl font-black bg-white/5 border border-white/10 group-hover:border-accent group-hover:bg-accent/10 transition-all">4</div>
              <p className="text-white text-xs font-bold mt-4 uppercase tracking-widest">Accord Final</p>
            </div>
          </div>
        </div>

        <div className="resource-hub-p text-center py-12 ultra-glass rounded-2xl">
          <h2 className="text-white font-black text-2xl mb-8">Strategic Resources</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <button 
              className="btn-primary-premium flex items-center gap-3 px-8 text-lg"
              onClick={() => onNavigate('ai-hub')}
            >
              <span>✨</span> Neural Coaching
            </button>
            <button 
              className="btn-secondary-premium flex items-center gap-3 px-8 text-lg border-accent/30 text-accent hover:bg-accent/10"
              onClick={() => onNavigate('legal-docs')}
            >
              <span>📄</span> Access Documents
            </button>
            <button 
              className="btn-secondary-premium flex items-center gap-3 px-8 text-lg border-white/10"
              onClick={() => onNavigate('emotion-heatmap')}
            >
              <span>📊</span> Emotion Analytics
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
