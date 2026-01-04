
import React from 'react';
import { Zap, Target, Users, Search, ChevronRight, Briefcase, BarChart3, Globe, LogIn } from 'lucide-react';

interface Props {
  onStart: () => void;
  session: any;
  onOpenAuth: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart, session, onOpenAuth }) => {
  return (
    <div className="min-h-screen bg-[#0a0b0e] overflow-x-hidden selection:bg-blue-500/30">
      {/* Background Grid & Ambient Glow */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 max-w-7xl mx-auto px-8 py-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-600/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white uppercase italic">Signal</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <a href="#workflow" className="text-slate-400 hover:text-blue-400 transition-colors">Workflow</a>
          {!session ? (
            <>
              <button 
                onClick={onOpenAuth}
                className="text-white hover:text-blue-400 transition-colors flex items-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button 
                onClick={onOpenAuth}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full transition-all shadow-lg shadow-blue-900/20 font-bold"
              >
                Get Started
              </button>
            </>
          ) : (
            <button 
              onClick={onStart}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-2 rounded-full transition-all backdrop-blur-md font-bold"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left space-y-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest animate-bounce">
            <Zap className="w-3.5 h-3.5" />
            <span>Market Intelligence v2.5</span>
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tighter">
            Decode the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">Market</span> Noise.
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            The world's first dual-agent discovery platform. Find validated business opportunities or high-intent client leads using neural market scanning.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button 
              onClick={onStart}
              className="group relative bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 px-10 rounded-2xl transition-all shadow-2xl shadow-blue-600/20 flex items-center space-x-3 text-lg overflow-hidden"
            >
              <span className="relative z-10">{session ? 'Enter Platform' : 'Start Discovery'}</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            <button className="text-slate-400 hover:text-white font-semibold py-5 px-10 rounded-2xl transition-all border border-white/5 hover:bg-white/5 flex items-center space-x-2">
              <span>View Live Feed</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </button>
          </div>
        </div>

        {/* Animated Signal Graphic */}
        <div className="flex-1 relative w-full max-w-[500px] aspect-square">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Sonar Rings */}
            {[...Array(4)].map((_, i) => (
              <div 
                key={i}
                className="absolute border border-blue-500/20 rounded-full animate-ping-slow"
                style={{ 
                  width: `${(i + 1) * 25}%`, 
                  height: `${(i + 1) * 25}%`,
                  animationDelay: `${i * 0.8}s`
                }}
              />
            ))}
            
            {/* Main Scanner Line */}
            <div className="absolute inset-0 rounded-full border border-white/5 bg-[#11131a]/50 backdrop-blur-3xl overflow-hidden shadow-2xl">
              <div className="absolute top-1/2 left-1/2 w-full h-[2px] bg-gradient-to-r from-blue-500 to-transparent origin-left animate-scan"></div>
              
              {/* Data Nodes */}
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-blue-500/60 animate-glow-node"
                  style={{
                    top: `${Math.random() * 80 + 10}%`,
                    left: `${Math.random() * 80 + 10}%`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                >
                  <div className="absolute inset-0 bg-blue-400 blur-md opacity-50"></div>
                </div>
              ))}

              {/* Central Signal Icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="bg-blue-600 p-6 rounded-3xl shadow-2xl animate-float">
                  <Zap className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Split */}
      <section id="workflow" className="relative z-10 max-w-7xl mx-auto px-8 py-24 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Opportunity Column */}
          <div className="group p-10 glass-card rounded-[40px] border border-slate-800/50 hover:border-blue-500/30 transition-all duration-500">
            <div className="bg-blue-600/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Briefcase className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Opportunity Discovery</h3>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Strategize your next venture. We scan millions of conversations to find real problems waiting for a software or service solution.
            </p>
            <ul className="space-y-4 mb-8">
              {['Sentiment Intensity Analysis', 'Market Readiness Scoring', 'Competitor Gap Mapping'].map((feat, i) => (
                <li key={i} className="flex items-center space-x-3 text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <button onClick={onStart} className="text-blue-400 font-bold flex items-center space-x-2 group/btn">
              <span>Try Strategy Mode</span>
              <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Leads Column */}
          <div className="group p-10 glass-card rounded-[40px] border border-slate-800/50 hover:border-indigo-500/30 transition-all duration-500">
            <div className="bg-indigo-600/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Lead Generation</h3>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Execute your sales. Monitor job boards, social platforms, and forums for active buyers looking for your specific creative service.
            </p>
            <ul className="space-y-4 mb-8">
              {['Real-time RSS Monitoring', 'AI Outreach Generator', 'Contact Enrichment API'].map((feat, i) => (
                <li key={i} className="flex items-center space-x-3 text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <button onClick={onStart} className="text-indigo-400 font-bold flex items-center space-x-2 group/btn">
              <span>Try Lead Mode</span>
              <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-24 border-t border-white/5 text-center">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="text-4xl font-black text-white mb-1">2.4M</div>
            <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">Signals Analyzed</div>
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-1">12k+</div>
            <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">Leads Found Daily</div>
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-1">87%</div>
            <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">Intent Accuracy</div>
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-1">500ms</div>
            <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">Processing Speed</div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-12 text-center text-slate-600 text-sm border-t border-white/5">
        <p>&copy; 2025 SIGNAL Market Discovery Platform. Powered by Gemini Pro.</p>
      </footer>

      <style>{`
        @keyframes ping-slow {
          0% { transform: scale(0.1); opacity: 0; }
          20% { opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes scan {
          from { transform: rotate(0deg) translateX(0); }
          to { transform: rotate(360deg) translateX(0); }
        }
        @keyframes glow-node {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-ping-slow {
          animation: ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
        .animate-glow-node {
          animation: glow-node 3s ease-in-out infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
