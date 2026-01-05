
import React, { useState, useEffect } from 'react';
import { Target, Users, Search, ChevronRight, Briefcase, BarChart3, Globe, LogIn, User, Crown, CreditCard, ChevronDown, Settings, LogOut, Star, CheckCircle, X, Crosshair, TrendingUp, DollarSign, Rocket, Eye, Brain, Zap } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden selection:bg-cyan-500/30">
      {/* Advanced Background Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f112_1px,transparent_1px),linear-gradient(to_bottom,#6366f112_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] animate-pulse"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-r from-purple-600/20 to-cyan-500/20 blur-[120px] rounded-full animate-float"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-l from-cyan-600/15 to-emerald-500/15 blur-[100px] rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-gradient-to-l from-emerald-600/10 to-purple-500/10 blur-[80px] rounded-full animate-float" style={{ animationDelay: '6s' }}></div>
        
        {/* Scanning Lines Effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-horizontal"></div>
          <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-scan-vertical" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Particle Effect */}
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl blur group-hover:blur-lg transition-all duration-300 opacity-75"></div>
            <div className="relative bg-gradient-to-r from-purple-600 to-cyan-500 p-3 rounded-xl shadow-2xl group-hover:scale-110 transition-all duration-300">
              <Crosshair className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-white">LeadHunter</span>
            <span className="text-xl font-light text-cyan-300 ml-1">Pro</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a href="#features" className="text-slate-300 hover:text-cyan-400 transition-colors font-semibold">Features</a>
          <a href="#pricing" className="text-slate-300 hover:text-cyan-400 transition-colors font-semibold">Pricing</a>
          {!session ? (
            <>
              <button 
                onClick={onOpenAuth}
                className="text-white hover:text-cyan-400 transition-colors flex items-center space-x-2 font-semibold"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button 
                onClick={onOpenAuth}
                className="relative group bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white px-8 py-3 rounded-full transition-all shadow-lg shadow-purple-500/25 font-bold text-sm overflow-hidden"
              >
                <span className="relative z-10">Start Hunting</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
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
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-24 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left space-y-10">
          {/* New Attention-Grabbing Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 text-sm font-bold">LIVE</span>
            </div>
            <span className="text-white text-sm font-semibold">Finding leads in real-time</span>
          </div>

          {/* Power Headlines */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight">
              Turn <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 animate-gradient">Social Noise</span> Into 
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Paying Clients</span>
            </h1>
            
            <div className="flex items-center space-x-4 text-lg">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <DollarSign className="w-5 h-5" />
                <span>$247K+ Revenue Generated</span>
              </div>
              <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
              <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                <TrendingUp className="w-5 h-5" />
                <span>12,847 Leads Found</span>
              </div>
            </div>
          </div>

          <p className="text-slate-300 text-xl md:text-2xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
            <span className="text-white font-bold">Stop chasing cold prospects.</span> Our AI hunts down hot leads from Reddit, LinkedIn, and 50+ platforms who are actively looking to hire <span className="text-cyan-400 font-bold">right now.</span>
          </p>

          {/* Compelling Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-slate-300">Real prospects, not databases</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span className="text-slate-300">AI finds their budget & urgency</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-slate-300">Direct links to contact them</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
            <button 
              onClick={onStart}
              className="group relative bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black py-6 px-12 rounded-2xl transition-all shadow-2xl shadow-emerald-500/25 flex items-center space-x-3 text-xl overflow-hidden transform hover:scale-105"
            >
              <Rocket className="w-6 h-6 relative z-10" />
              <span className="relative z-10">{session ? 'Hunt More Leads' : 'Start Hunting Leads'}</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
            
            <button className="group text-slate-300 hover:text-white font-bold py-6 px-8 rounded-2xl transition-all border border-slate-600 hover:border-cyan-400 hover:bg-cyan-400/10 flex items-center space-x-2 backdrop-blur-sm">
              <Eye className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
              <span>See Live Demo</span>
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center lg:justify-start space-x-6 pt-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="text-slate-400">1,247+ freelancers finding clients</span>
            </div>
          </div>
        </div>

        {/* Advanced Hunting Visualization */}
        <div className="flex-1 relative w-full max-w-[600px] aspect-square">
          <div className="absolute inset-0 flex items-center justify-center">
            
            {/* Outer Hunting Rings */}
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="absolute border-2 rounded-full animate-hunt-pulse"
                style={{ 
                  width: `${(i + 1) * 20}%`, 
                  height: `${(i + 1) * 20}%`,
                  borderColor: i % 2 === 0 ? '#6366f1' : '#06b6d4',
                  opacity: 0.3 - (i * 0.05),
                  animationDelay: `${i * 0.6}s`
                }}
              />
            ))}
            
            {/* Main Radar Display */}
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 bg-gradient-to-br from-slate-900/80 via-purple-900/40 to-cyan-900/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
              
              {/* Scanning Beam */}
              <div className="absolute top-1/2 left-1/2 w-full h-[3px] bg-gradient-to-r from-emerald-400 via-cyan-400 to-transparent origin-left animate-radar-sweep"></div>
              
              {/* Target Leads (Animated Points) */}
              {[...Array(8)].map((_, i) => {
                const angle = (i * 45) + (Math.random() * 30);
                const distance = 30 + (Math.random() * 40);
                const x = 50 + distance * Math.cos(angle * Math.PI / 180);
                const y = 50 + distance * Math.sin(angle * Math.PI / 180);
                
                return (
                  <div 
                    key={i}
                    className="absolute w-3 h-3 rounded-full animate-target-blink"
                    style={{
                      top: `${y}%`,
                      left: `${x}%`,
                      backgroundColor: i % 3 === 0 ? '#10b981' : i % 3 === 1 ? '#06b6d4' : '#8b5cf6',
                      animationDelay: `${Math.random() * 3}s`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="absolute inset-0 rounded-full animate-ping" style={{backgroundColor: 'inherit', opacity: 0.4}}></div>
                  </div>
                );
              })}

              {/* Money Indicators */}
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute text-emerald-400 font-bold text-xs animate-float-money"
                  style={{
                    top: `${20 + (i * 15)}%`,
                    left: `${15 + (i * 20)}%`,
                    animationDelay: `${i * 0.8}s`
                  }}
                >
                  ${['5K', '12K', '8K', '15K'][i]}
                </div>
              ))}

              {/* Central Hunter Icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full blur-lg animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-purple-600 via-cyan-500 to-emerald-500 p-6 rounded-full shadow-2xl animate-slow-spin">
                    <Crosshair className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>

              {/* Success Notifications */}
              <div className="absolute top-4 right-4 space-y-2">
                {['New Lead Found!', 'Budget: $5,000', 'High Urgency'].map((text, i) => (
                  <div 
                    key={i}
                    className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm animate-slide-in"
                    style={{animationDelay: `${i * 1.2}s`}}
                  >
                    {text}
                  </div>
                ))}
              </div>
              
              {/* Platform Icons Floating Around */}
              {[
                {name: 'LinkedIn', color: '#0077b5', position: {top: '20%', right: '20%'}},
                {name: 'Reddit', color: '#ff4500', position: {bottom: '20%', left: '20%'}},
                {name: 'GitHub', color: '#333', position: {top: '60%', right: '15%'}},
                {name: 'Twitter', color: '#1da1f2', position: {bottom: '40%', right: '25%'}}
              ].map((platform, i) => (
                <div 
                  key={platform.name}
                  className="absolute w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center text-xs font-bold text-white animate-float-platforms"
                  style={{
                    ...platform.position,
                    backgroundColor: platform.color + '40',
                    borderColor: platform.color + '60',
                    animationDelay: `${i * 0.5}s`
                  }}
                >
                  {platform.name[0]}
                </div>
              ))}
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

      <footer className="relative z-10 py-12 text-center text-slate-500 text-sm border-t border-purple-500/10">
        <div className="max-w-7xl mx-auto px-8 space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Crosshair className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-bold">LeadHunter Pro</span>
            <span className="text-cyan-400">•</span>
            <span>Turn social noise into paying clients</span>
          </div>
          <p>&copy; 2025 LeadHunter Pro. Powered by advanced AI hunting algorithms.</p>
        </div>
      </footer>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes hunt-pulse {
          0%, 100% { transform: scale(0.8); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }
        @keyframes radar-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes target-blink {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes float-money {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.8; }
          50% { transform: translateY(-15px) rotate(5deg); opacity: 1; }
        }
        @keyframes slow-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slide-in {
          0% { transform: translateX(100px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes float-platforms {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(2deg); }
          66% { transform: translateY(-5px) rotate(-2deg); }
        }
        @keyframes scan-horizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
        @keyframes scan-vertical {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-hunt-pulse {
          animation: hunt-pulse 3s ease-in-out infinite;
        }
        .animate-radar-sweep {
          animation: radar-sweep 4s linear infinite;
        }
        .animate-target-blink {
          animation: target-blink 2s ease-in-out infinite;
        }
        .animate-float-money {
          animation: float-money 4s ease-in-out infinite;
        }
        .animate-slow-spin {
          animation: slow-spin 20s linear infinite;
        }
        .animate-slide-in {
          animation: slide-in 0.8s ease-out forwards;
        }
        .animate-float-platforms {
          animation: float-platforms 8s ease-in-out infinite;
        }
        .animate-scan-horizontal {
          animation: scan-horizontal 8s linear infinite;
        }
        .animate-scan-vertical {
          animation: scan-vertical 10s linear infinite;
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
