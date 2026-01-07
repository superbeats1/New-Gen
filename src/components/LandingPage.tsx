import React, { useState, useEffect } from 'react';
import {
  Zap, Target, Users, Search, ChevronRight, Briefcase,
  BarChart3, Globe, LogIn, User, Crown, CreditCard,
  ChevronDown, Settings, LogOut, Star, CheckCircle, X,
  ArrowRight, Shield, Rocket, Activity, Database
} from 'lucide-react';
import IntelligentBackground from './IntelligentBackground';

interface Props {
  onStart: () => void;
  session: any;
  onOpenAuth: () => void;
  profile?: any;
  onSignOut?: () => void;
  onUpgrade?: () => void;
  showPaymentSuccess?: boolean;
}

const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`glass-card p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:border-violet-500/30 hover:bg-white/[0.04] transition-all duration-500 shadow-2xl ${className}`}>
    {children}
  </div>
);

const LandingPage: React.FC<Props> = ({ onStart, session, onOpenAuth, profile, onSignOut, onUpgrade, showPaymentSuccess }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      setShowSuccessBanner(true);
      const timer = setTimeout(() => setShowSuccessBanner(false), 10000);
      return () => clearTimeout(timer);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#030407] text-slate-200 overflow-x-hidden selection:bg-violet-500/30">
      <IntelligentBackground />

      {/* Cursor Glow */}
      <div
        className="fixed pointer-events-none z-[1] w-[600px] h-[600px] bg-violet-600/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000"
        style={{ left: cursorPos.x, top: cursorPos.y, opacity: scrolled ? 0.3 : 0.6 }}
      ></div>

      {/* Navigation */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'py-4 backdrop-blur-xl bg-black/20 border-b border-white/5' : 'py-8'}`}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-violet-600/20 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">Scopa AI</span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-bold uppercase tracking-widest">
            <a href="#features" className="hover:text-blue-400 transition-colors">Intelligence</a>
            <a href="#workflow" className="hover:text-blue-400 transition-colors">Protocol</a>
            {!session ? (
              <div className="flex items-center space-x-6">
                <button onClick={onOpenAuth} className="hover:text-blue-400 transition-colors">Login</button>
                <button
                  onClick={onOpenAuth}
                  className="bg-white text-black px-8 py-3 rounded-full hover:bg-violet-600 hover:text-white transition-all shadow-xl shadow-white/5 font-black uppercase text-xs"
                >
                  Join Scopa
                </button>
              </div>
            ) : (
              <button
                onClick={onStart}
                className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-full transition-all shadow-lg shadow-violet-900/20 font-black uppercase text-xs"
              >
                Dashboard
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Neural Discovery Protocol Active</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-white leading-[0.85] tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            Identify<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-fuchsia-500">Opportunities.</span>
          </h1>

          <p className="max-w-2xl text-slate-400 text-xl md:text-2xl font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Scopa AI uses dual-agent intelligence to scan millions of signals across Reddit, X, and forums to reveal business gaps in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            <button
              onClick={onStart}
              className="group relative bg-violet-600 hover:bg-violet-500 text-white font-black py-6 px-12 rounded-3xl transition-all shadow-2xl shadow-violet-600/30 flex items-center space-x-4 text-xl uppercase tracking-tighter overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span>{session ? 'Enter Platform' : 'Start Discovery'}</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
            <button className="px-8 py-6 rounded-3xl border border-white/10 hover:bg-white/5 transition-all text-xl font-bold uppercase tracking-tighter">
              View Protocol
            </button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="px-8 pb-32">
        <div className="max-w-6xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000 animate-pulse-glow"></div>
          <div className="relative glass-card rounded-[2.8rem] border border-white/10 overflow-hidden shadow-2xl bg-[#0a0b0f]/80 backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-1000 delay-500">
            <div className="h-10 border-b border-white/5 bg-white/5 flex items-center px-6 space-x-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
            </div>
            <div className="p-4 md:p-8 aspect-video md:aspect-[21/9] bg-gradient-to-br from-[#0a0b0f] via-[#0f1116] to-blue-950/20 relative overflow-hidden">
              {/* Animated Dashboard Preview - REAL DASHBOARD TEASER */}

              {/* Background glow effects */}
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>

              <div className="absolute top-4 left-4 right-4 bottom-4 flex flex-col md:flex-row gap-4">
                {/* Left Sidebar - Stats Panel */}
                <div className="w-full md:w-1/3 space-y-3">
                  {/* Market Report Header */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-4 backdrop-blur-xl animate-in fade-in slide-in-from-left duration-700">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span className="text-[8px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest">Analysis Active</span>
                    </div>
                    <div className="text-lg md:text-2xl font-black text-white italic tracking-tight">MARKET REPORT</div>
                    <div className="text-[8px] md:text-xs text-slate-500 font-bold">PAST 90 DAYS</div>
                  </div>

                  {/* Intelligence Stats */}
                  <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-left duration-700 delay-100">
                    <div className="bg-gradient-to-br from-violet-600/10 to-transparent rounded-xl border border-violet-500/20 p-3 backdrop-blur-xl">
                      <div className="text-[8px] font-black text-violet-400 uppercase tracking-wider mb-1">Intelligence</div>
                      <div className="text-2xl md:text-3xl font-black text-white">48.2</div>
                      <div className="text-[8px] text-emerald-400 font-bold mt-1">↗ HIGH EFFICIENCY</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600/10 to-transparent rounded-xl border border-blue-500/20 p-3 backdrop-blur-xl">
                      <div className="text-[8px] font-black text-blue-400 uppercase tracking-wider mb-1">Growth</div>
                      <div className="text-2xl md:text-3xl font-black text-white">88%</div>
                      <div className="h-1 w-full bg-blue-950 rounded-full mt-2">
                        <div className="h-full w-[88%] bg-gradient-to-r from-blue-600 to-violet-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Sources Scanned */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-3 backdrop-blur-xl animate-in fade-in slide-in-from-left duration-700 delay-200">
                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-2">Sources Scanned</div>
                    <div className="text-3xl md:text-4xl font-black text-white">156</div>
                    <div className="text-[10px] text-emerald-400 font-bold mt-1">Stable Resolution</div>
                  </div>
                </div>

                {/* Right Main Content */}
                <div className="flex-1 space-y-3 overflow-hidden">
                  {/* Fast Track Badge - HERO FEATURE */}
                  <div className="bg-gradient-to-br from-emerald-600/15 to-transparent rounded-2xl border-2 border-emerald-500/40 p-4 md:p-5 backdrop-blur-xl animate-in fade-in slide-in-from-top duration-700 delay-300">
                    <div className="flex items-center space-x-3">
                      <div className="bg-emerald-500/20 rounded-full p-2">
                        <svg className="w-4 h-4 md:w-6 md:h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-[8px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest">Fast Track</div>
                        <div className="text-base md:text-xl font-black text-white">6 weeks to $1K MRR</div>
                      </div>
                    </div>
                    <p className="text-[8px] md:text-xs text-slate-400 mt-2 line-clamp-2">Low competition + desperate demand + simple MVP = fast validation</p>
                  </div>

                  {/* Opportunity Card Preview */}
                  <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl border border-white/10 p-4 md:p-5 backdrop-blur-xl animate-in fade-in slide-in-from-bottom duration-700 delay-400">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="bg-violet-600/20 border border-violet-500/30 px-2 md:px-3 py-1 rounded-full flex items-center space-x-1">
                          <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-violet-400 rounded-full"></div>
                          <span className="text-[7px] md:text-[9px] font-black text-white uppercase tracking-wider">Signal Alpha-1</span>
                        </div>
                      </div>
                      <span className="text-[8px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest">90% Match</span>
                    </div>
                    <div className="text-sm md:text-lg font-black text-white leading-tight mb-3 line-clamp-2">
                      LLM users need context management tools for workflow optimization
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                        <div className="text-[7px] md:text-[8px] text-slate-500 uppercase tracking-wider font-black mb-0.5">Market Flux</div>
                        <div className="text-xs md:text-sm font-black text-emerald-400">9/10</div>
                      </div>
                      <div className="bg-violet-600/10 rounded-lg p-2 border border-violet-500/20">
                        <div className="text-[7px] md:text-[8px] text-violet-400 uppercase tracking-wider font-black mb-0.5">Confidence</div>
                        <div className="text-xs md:text-sm font-black text-white">9/10</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                        <div className="text-[7px] md:text-[8px] text-slate-500 uppercase tracking-wider font-black mb-0.5">Intensity</div>
                        <div className="text-xs md:text-sm font-black text-indigo-400">8/10</div>
                      </div>
                    </div>
                  </div>

                  {/* Attack Vector Badge */}
                  <div className="bg-gradient-to-br from-rose-600/15 to-transparent rounded-xl border border-rose-500/30 p-3 md:p-4 backdrop-blur-xl animate-in fade-in slide-in-from-bottom duration-700 delay-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg className="w-3 h-3 md:w-4 md:h-4 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[8px] md:text-[10px] font-black text-rose-400 uppercase tracking-wider">Attack Vector</span>
                      </div>
                      <div className="px-2 md:px-3 py-1 bg-rose-500/20 border border-rose-500/40 rounded-full">
                        <span className="text-xs md:text-sm font-black text-white">75%</span>
                        <span className="text-[7px] md:text-[8px] text-rose-300 ml-1">complaints</span>
                      </div>
                    </div>
                    <div className="text-[8px] md:text-xs text-white font-bold mt-2 line-clamp-2">
                      Primary Weakness: <span className="text-rose-300">UX/Complexity</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating particles animation */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-violet-400/30 rounded-full animate-float"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${3 + Math.random() * 2}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-8 py-32 border-t border-white/5 bg-gradient-to-b from-transparent to-blue-900/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">Scopa Protocol</h2>
            <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto underline decoration-blue-500/50 underline-offset-8">
              Advanced neural discovery engines designed for accuracy and speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard>
              <div className="bg-blue-600/10 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 border border-blue-500/20">
                <Target className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">Market Scanning</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                Scopa scans millions of signals across niche forums and discussions to reveal high-intent business gaps.
              </p>
            </GlassCard>

            <GlassCard>
              <div className="bg-indigo-600/10 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 border border-indigo-500/20">
                <Shield className="w-8 h-8 text-indigo-500" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">Validation Engine</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                Our dual-agent AI verifies demand, analyzes competition, and calculates revenue potential for every signal.
              </p>
            </GlassCard>

            <GlassCard>
              <div className="bg-cyan-600/10 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 border border-cyan-500/20">
                <Rocket className="w-8 h-8 text-cyan-500" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">Strategic Roadmap</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                Receive detailed execution plans including GTM strategy, cost estimates, and technical requirements.
              </p>
            </GlassCard>
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
        </div>
      </section>

      {/* Stats Counter */}
      <section className="px-8 py-32 border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-16 md:gap-32 text-center">
          {[
            { label: "Data Signals", val: "4.8M+" },
            { label: "Valid Opportunities", val: "12,400" },
            { label: "Market Accuracy", val: "94.8%" },
            { label: "Processing Speed", val: "0.4s" }
          ].map((stat, i) => (
            <div key={i} className="space-y-2 group">
              <div className="text-5xl md:text-6xl font-black text-white tracking-tighter group-hover:text-blue-500 transition-colors">{stat.val}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-24 px-8 opacity-50 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center space-x-3">
            <Zap className="w-5 h-5 text-blue-500" />
            <span className="font-black text-white tracking-tighter uppercase italic text-lg">Scopa AI</span>
          </div>
          <div className="flex gap-12 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Twitter (X)</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Protocol</a>
          </div>
          <p className="text-[10px] font-medium tracking-widest text-slate-600 uppercase">
            © 2025 Scopa Intelligence Network. All Signals Encrypted.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes scan-line {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .animate-scan-line {
          animation: scan-line 3s linear infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.02); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(-50%) rotate(0deg); }
          50% { transform: translateY(-20px) translateX(-50%) rotate(2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
