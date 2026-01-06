import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Target, 
  Users, 
  Search, 
  ChevronRight, 
  Briefcase, 
  BarChart3, 
  Globe, 
  LogIn, 
  User, 
  Crown, 
  CreditCard, 
  ChevronDown, 
  LogOut, 
  Star, 
  CheckCircle, 
  X,
  ArrowRight,
  Shield,
  Activity,
  Cpu
} from 'lucide-react';

interface Props {
  onStart: () => void;
  session: any;
  onOpenAuth: () => void;
  profile?: any;
  onSignOut?: () => void;
  onUpgrade?: () => void;
  showPaymentSuccess?: boolean;
}

const LandingPage: React.FC<Props> = ({ 
  onStart, 
  session, 
  onOpenAuth, 
  profile, 
  onSignOut, 
  onUpgrade, 
  showPaymentSuccess 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      setShowSuccessBanner(true);
      const timer = setTimeout(() => setShowSuccessBanner(false), 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-violet-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#050507]/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-violet-500/20">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Signal</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center space-x-4">
            {!session ? (
              <>
                <button 
                  onClick={onOpenAuth}
                  className="hidden md:flex text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={onOpenAuth}
                  className="glass-button text-white px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide"
                >
                  Get Started
                </button>
              </>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="glass-panel flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-white/5 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                    {profile?.first_name?.[0] || 'U'}
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-64 glass-card rounded-2xl overflow-hidden p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 border-b border-white/5 mb-2">
                       <div className="text-sm font-bold text-white truncate">{profile?.first_name} {profile?.last_name}</div>
                       <div className="text-xs text-slate-400 truncate">{session.user.email}</div>
                    </div>
                    
                    <button onClick={onStart} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-slate-300 transition-colors text-left">
                      <Briefcase className="w-4 h-4 text-violet-400" />
                      <span>Dashboard</span>
                    </button>
                    {!profile?.is_pro && (
                      <button onClick={onUpgrade} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-slate-300 transition-colors text-left">
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span>Upgrade to Pro</span>
                      </button>
                    )}
                    <button onClick={onSignOut} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-rose-500/10 text-sm text-rose-400 transition-colors text-left">
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

     {/* Success Banner */}
     {showSuccessBanner && (
        <div className="fixed top-24 right-4 z-[100] glass-card border-l-4 border-l-emerald-500 p-4 rounded-xl flex items-start space-x-4 max-w-sm animate-in slide-in-from-right duration-500">
          <div className="bg-emerald-500/20 p-2 rounded-full">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-sm">Upgrade Successful</h3>
            <p className="text-slate-400 text-xs mt-1">Your account has been upgraded to Pro. Enjoy unlimited access.</p>
          </div>
          <button onClick={() => setShowSuccessBanner(false)} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              <span className="text-xs font-bold text-violet-200 tracking-wide uppercase">AI-Powered Market Intelligence</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              Identify Opportunities <br />
              <span className="text-gradient">Before They Trend.</span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Signal uses dual-agent AI to scan millions of discussions across Reddit, X, and forums to find valid business ideas and high-intent leads in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button 
                onClick={onStart}
                className="group glass-button px-8 py-4 rounded-2xl flex items-center space-x-3 text-white font-semibold text-lg"
              >
                <span>Start Discovery</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button onClick={() => window.open('https://github.com/superbeats1/New-Gen', '_blank')} className="px-8 py-4 rounded-2xl border border-white/10 hover:bg-white/5 text-slate-300 font-medium transition-all flex items-center space-x-2">
                 <span>View Source</span>
              </button>
            </div>
            
            <div className="pt-8 flex items-center justify-center lg:justify-start space-x-8 text-sm text-slate-500 font-medium">
              <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-violet-500" /> Real-time Scan</span>
              <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-violet-500" /> 94% Accuracy</span>
              <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-violet-500" /> Instant Export</span>
            </div>
          </div>

          {/* Hero Visual - Glass Cards */}
          <div className="relative">
             {/* Abstract Glow Behind */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-600/20 to-indigo-600/20 rounded-full blur-[100px] animate-pulse-glow"></div>
             
             <div className="relative grid grid-cols-2 gap-4">
               {/* Card 1 */}
               <div className="glass-card p-6 rounded-3xl col-span-2 transform hover:scale-[1.02] transition-all duration-500">
                 <div className="flex items-center justify-between mb-4">
                   <div className="bg-violet-500/20 p-3 rounded-xl">
                     <Target className="w-6 h-6 text-violet-400" />
                   </div>
                   <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">High Confidence</span>
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">Market Gap Detected</h3>
                 <p className="text-slate-400 text-sm">"Teams are looking for a unified dashboard to manage multiple AI agents. Current solutions are fragmented."</p>
               </div>

               {/* Card 2 */}
               <div className="glass-card p-6 rounded-3xl mt-8 transform hover:scale-[1.02] transition-all duration-500" style={{ animationDelay: '0.2s' }}>
                 <div className="bg-indigo-500/20 p-3 rounded-xl w-fit mb-4">
                   <Users className="w-6 h-6 text-indigo-400" />
                 </div>
                 <h3 className="text-lg font-bold text-white mb-1">Active Leads</h3>
                 <div className="text-3xl font-bold text-white">124</div>
                 <p className="text-xs text-slate-500 mt-2">Found in last hour</p>
               </div>

               {/* Card 3 */}
               <div className="glass-card p-6 rounded-3xl transform hover:scale-[1.02] transition-all duration-500" style={{ animationDelay: '0.4s' }}>
                 <div className="bg-pink-500/20 p-3 rounded-xl w-fit mb-4">
                   <Activity className="w-6 h-6 text-pink-400" />
                 </div>
                 <h3 className="text-lg font-bold text-white mb-1">Growth</h3>
                 <div className="text-3xl font-bold text-white">+48%</div>
                 <p className="text-xs text-slate-500 mt-2">Trend Velocity</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-32 px-6 bg-[#050507]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-6">Dual-Mode Intelligence</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Whether you're building a product or finding clients, Signal adapts to your objective.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="group glass-card p-10 rounded-[2.5rem] hover:border-violet-500/30 transition-all">
              <div className="flex items-center justify-between mb-8">
                <div className="bg-gradient-to-br from-violet-600 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <button onClick={onStart} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Opportunity Mode</h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Identify unserved market niches. Analyse complaints and "wish I had" posts to validate your startup ideas before you build.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="text-xs font-bold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-full">Gap Analysis</span>
                <span className="text-xs font-bold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-full">Competitor Mapping</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group glass-card p-10 rounded-[2.5rem] hover:border-pink-500/30 transition-all">
              <div className="flex items-center justify-between mb-8">
                 <div className="bg-gradient-to-br from-pink-600 to-rose-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Users className="w-8 h-8 text-white" />
                </div>
                 <button onClick={onStart} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Lead Mode</h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Find clients who are asking for your services right now. We scan job boards and social feeds to bring you high-intent leads.
              </p>
               <div className="flex flex-wrap gap-3">
                <span className="text-xs font-bold text-pink-300 bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 rounded-full">Intent Verification</span>
                <span className="text-xs font-bold text-pink-300 bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 rounded-full">Direct Contact</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-16 bg-[#030304]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center opacity-60">
           <div className="flex items-center space-x-2 mb-4 md:mb-0">
             <div className="bg-slate-800 p-1.5 rounded-lg">
                <Zap className="w-4 h-4 text-slate-400" />
             </div>
             <span className="font-bold text-slate-300 tracking-tight">Signal Is Live</span>
           </div>
           <p className="text-sm text-slate-500">© 2025 Signal Discovery. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
