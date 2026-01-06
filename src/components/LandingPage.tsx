
import React, { useState, useEffect } from 'react';
import { Zap, Target, Users, Search, ChevronRight, Briefcase, BarChart3, Globe, LogIn, User, Crown, CreditCard, ChevronDown, Settings, LogOut, Star, CheckCircle, X } from 'lucide-react';

interface Props {
  onStart: () => void;
  session: any;
  onOpenAuth: () => void;
  profile?: any;
  onSignOut?: () => void;
  onUpgrade?: () => void;
  showPaymentSuccess?: boolean;
}

const LandingPage: React.FC<Props> = ({ onStart, session, onOpenAuth, profile, onSignOut, onUpgrade, showPaymentSuccess }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      setShowSuccessBanner(true);
      // Auto-hide banner after 10 seconds
      const timer = setTimeout(() => setShowSuccessBanner(false), 10000);
      return () => clearTimeout(timer);
    }
  }, []);
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
        
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
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
            <div className="relative">
              {/* Credits Badge */}
              <div className="flex items-center space-x-4">
                <div className="px-3 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 backdrop-blur-md">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">
                    {profile?.credits || 0} Credits Left
                  </span>
                </div>
                
                {/* User Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/50 backdrop-blur-md hover:bg-slate-800/90 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                      <User className="w-4 h-4 text-slate-300" />
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
                      {/* User Info Section */}
                      <div className="p-4 border-b border-slate-800">
                        <div className="text-sm font-bold text-white mb-1">
                          {profile?.first_name ? `${profile.first_name} ${profile?.last_name || ''}`.trim() : 'User'}
                        </div>
                        <div className="text-xs text-slate-400 mb-3">
                          {session?.user?.email}
                        </div>
                        
                        {/* Credits Display */}
                        <div className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">Credits</span>
                            <span className="text-xs font-bold text-blue-400">
                              {profile?.is_pro ? 'Unlimited' : `${profile?.credits || 0} left`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 transition-all text-sm">
                          <CreditCard className="w-4 h-4" />
                          <span>Billing</span>
                        </button>
                        
                        {!profile?.is_pro && (
                          <button 
                            onClick={onUpgrade}
                            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-all text-sm"
                          >
                            <Star className="w-4 h-4" />
                            <span>Upgrade to Pro</span>
                          </button>
                        )}
                        
                        <button 
                          onClick={onSignOut}
                          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-all text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>

                      {/* Go to Dashboard */}
                      <div className="p-3 border-t border-slate-800">
                        <button 
                          onClick={() => { setShowDropdown(false); onStart(); }}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all font-bold text-sm"
                        >
                          Go to Dashboard
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Click outside to close dropdown */}
              {showDropdown && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowDropdown(false)}
                />
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Payment Success Banner */}
      {showSuccessBanner && (
        <div className="relative z-50 bg-gradient-to-r from-green-600 to-emerald-600 border-b border-green-500">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-white" />
                <div>
                  <h3 className="text-white font-bold">Payment Successful!</h3>
                  <p className="text-green-100 text-sm">Welcome to SIGNAL Pro! You now have unlimited searches and advanced features.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSuccessBanner(false)}
                className="text-white hover:text-green-200 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left space-y-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest animate-bounce">
            <Zap className="w-3.5 h-3.5" />
            <span>Market Intelligence v2.5</span>
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tighter">
            Find Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">$100K</span> Idea.
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Discover validated business opportunities before your competitors. AI-powered market intelligence that analyzes millions of conversations to find profitable gaps.
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
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            How SIGNAL Works
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Powered by AI, fueled by real conversations. We analyze Reddit, HackerNews, and GitHub to uncover opportunities others miss.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Market Gap Analysis */}
          <div className="group p-8 glass-card rounded-3xl border border-slate-800/50 hover:border-blue-500/30 transition-all duration-500">
            <div className="bg-blue-600/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Briefcase className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Market Gaps</h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              Discover underserved niches and untapped opportunities in growing markets with real demand signals.
            </p>
            <ul className="space-y-3">
              {['Demand Signal Analysis', 'Competition Mapping', 'Revenue Potential'].map((feat, i) => (
                <li key={i} className="flex items-center space-x-2 text-slate-300 text-sm">
                  <div className="w-4 h-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Problem Discovery */}
          <div className="group p-8 glass-card rounded-3xl border border-slate-800/50 hover:border-indigo-500/30 transition-all duration-500">
            <div className="bg-indigo-600/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Search className="w-7 h-7 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Problem Discovery</h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              Identify real pain points people are struggling with across forums, social media, and developer communities.
            </p>
            <ul className="space-y-3">
              {['Sentiment Analysis', 'Pain Point Extraction', 'Urgency Scoring'].map((feat, i) => (
                <li key={i} className="flex items-center space-x-2 text-slate-300 text-sm">
                  <div className="w-4 h-4 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trend Validation */}
          <div className="group p-8 glass-card rounded-3xl border border-slate-800/50 hover:border-emerald-500/30 transition-all duration-500">
            <div className="bg-emerald-600/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-7 h-7 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Trend Validation</h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              Validate market readiness and timing before investing months building the wrong product.
            </p>
            <ul className="space-y-3">
              {['Market Readiness Score', 'Entry Difficulty', 'Next Steps Roadmap'].map((feat, i) => (
                <li key={i} className="flex items-center space-x-2 text-slate-300 text-sm">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={onStart}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-blue-900/20 inline-flex items-center space-x-2"
          >
            <span>Start Discovering Opportunities</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-24 border-t border-white/5 text-center">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="text-4xl font-black text-white mb-1">2.4M+</div>
            <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">Conversations Analyzed</div>
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-1">500+</div>
            <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">Opportunities Found</div>
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-1">92%</div>
            <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">Market Validation Rate</div>
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-1">4sec</div>
            <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">Analysis Time</div>
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
