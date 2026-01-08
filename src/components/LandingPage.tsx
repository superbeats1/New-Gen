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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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

      {/* Powered By Data Sources Section */}
      <section className="px-8 pb-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-[10px] font-black text-violet-400 uppercase tracking-[0.3em] mb-8">
            Powered By Real-Time Intelligence
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60">
            {/* Twitter/X */}
            <div className="group cursor-pointer hover:opacity-100 transition-opacity duration-300">
              <svg className="w-12 h-12 text-slate-400 group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <div className="text-[8px] font-bold text-slate-500 mt-2 uppercase tracking-wider">Twitter/X</div>
            </div>
            {/* Reddit */}
            <div className="group cursor-pointer hover:opacity-100 transition-opacity duration-300">
              <svg className="w-12 h-12 text-slate-400 group-hover:text-orange-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
              <div className="text-[8px] font-bold text-slate-500 mt-2 uppercase tracking-wider">Reddit</div>
            </div>
            {/* HackerNews */}
            <div className="group cursor-pointer hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 bg-[#ff6600] rounded-sm flex items-center justify-center group-hover:bg-[#ff8833] transition-colors">
                <span className="text-white font-black text-2xl">Y</span>
              </div>
              <div className="text-[8px] font-bold text-slate-500 mt-2 uppercase tracking-wider">HackerNews</div>
            </div>
            {/* GitHub */}
            <div className="group cursor-pointer hover:opacity-100 transition-opacity duration-300">
              <svg className="w-12 h-12 text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <div className="text-[8px] font-bold text-slate-500 mt-2 uppercase tracking-wider">GitHub</div>
            </div>
            {/* Google Gemini AI */}
            <div className="group cursor-pointer hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-violet-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-black text-lg">✦</span>
              </div>
              <div className="text-[8px] font-bold text-slate-500 mt-2 uppercase tracking-wider">Gemini AI</div>
            </div>
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

      {/* How It Works Section */}
      <section className="px-8 py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">How It Works</h2>
            <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">
              From signal detection to revenue validation in seconds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent -translate-y-1/2"></div>

            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-violet-600/20 to-transparent rounded-3xl blur-xl group-hover:from-violet-600/40 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-8 rounded-3xl border border-white/10 backdrop-blur-xl hover:border-violet-500/30 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-violet-600/30 group-hover:scale-110 transition-transform">
                  <span className="text-3xl font-black text-white">1</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Enter Your Query</h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  Type your market interest or problem space. Our AI understands context and searches across millions of discussions.
                </p>
                <div className="mt-6 inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <Search className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">Neural Scan Active</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-600/20 to-transparent rounded-3xl blur-xl group-hover:from-blue-600/40 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-8 rounded-3xl border border-white/10 backdrop-blur-xl hover:border-blue-500/30 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
                  <span className="text-3xl font-black text-white">2</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">AI Analysis</h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  Gemini AI processes signals to identify demand intensity, competition gaps, and revenue potential using real market data.
                </p>
                <div className="mt-6 inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Database className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Processing Intelligence</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-emerald-600/20 to-transparent rounded-3xl blur-xl group-hover:from-emerald-600/40 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-8 rounded-3xl border border-white/10 backdrop-blur-xl hover:border-emerald-500/30 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-600/30 group-hover:scale-110 transition-transform">
                  <span className="text-3xl font-black text-white">3</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Get Insights</h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  Receive validated opportunities with Speed to $1K MRR, competitor weaknesses, and actionable attack vectors.
                </p>
                <div className="mt-6 inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Rocket className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Ready to Launch</span>
                </div>
              </div>
            </div>
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

      {/* FAQ Section */}
      <section className="px-8 py-32 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-[120px]"></div>

        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-lg font-medium">
              Everything you need to know about SCOPA AI
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "What is SCOPA AI and how does it work?",
                answer: "SCOPA AI is an advanced market intelligence platform that scans millions of conversations across Twitter/X, Reddit, HackerNews, and GitHub to identify untapped business opportunities. Using Google's Gemini AI, we analyze demand signals, competition gaps, and revenue potential to help you discover and validate profitable business ideas before your competitors do."
              },
              {
                question: "What data sources does SCOPA AI analyze?",
                answer: "SCOPA AI pulls real-time data from Twitter/X (1,500 tweets/month), Reddit discussions, HackerNews threads, and GitHub repositories. Our serverless API architecture ensures CORS-free access to authentic market signals, giving you access to genuine user pain points and demands across the most active developer and entrepreneur communities."
              },
              {
                question: "How accurate is the Speed to $1K MRR calculator?",
                answer: "Our Speed to $1K MRR calculator analyzes competition level, entry difficulty, market readiness, and MVP complexity based on historical data from similar products. While every business journey is unique, our algorithm provides data-driven estimates (Fast: 4-8 weeks, Medium: 8-16 weeks, Slow: 16-24+ weeks) backed by real market validation patterns and competitor analysis."
              },
              {
                question: "What is the Competitor Weakness Map feature?",
                answer: "The Competitor Weakness Map is our strategic advantage tool that analyzes user complaints across platforms to identify your competitors' primary weaknesses (Pricing, UX, Features, Support, etc.). You'll see the exact percentage of complaints, real user quotes, and a specific attack vector strategy to exploit these gaps and position your product effectively."
              },
              {
                question: "Do I need technical knowledge to use SCOPA AI?",
                answer: "No technical knowledge required! Simply enter your market interest or problem space in natural language, and SCOPA AI handles the rest. Our platform is designed for entrepreneurs, indie hackers, and product builders who want validated opportunities without spending weeks on manual research."
              },
              {
                question: "How is SCOPA AI different from other market research tools?",
                answer: "Unlike traditional market research tools, SCOPA AI provides two unique features NO competitor offers: (1) Speed to $1K MRR calculator that predicts revenue timeline based on real market data, and (2) Competitor Weakness Map that reveals specific attack vectors from analyzing thousands of user complaints. Plus, we scan authentic community discussions, not just generic market reports."
              },
              {
                question: "What's included in the free tier?",
                answer: "The free tier gives you access to basic opportunity scanning with limited queries per month. You'll see demand signals, basic market analysis, and opportunity scores. Premium tiers unlock unlimited queries, full Speed to $1K MRR analysis, Competitor Weakness Maps, raw data export, and priority support."
              },
              {
                question: "Can I export the intelligence data?",
                answer: "Yes! Premium users can export all opportunity data, raw findings, competitor analysis, and market signals in JSON or CSV format. Perfect for building pitch decks, sharing with co-founders, or integrating into your own market research workflow."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden hover:border-violet-500/30 transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                >
                  <span className="text-lg font-black text-white group-hover:text-violet-400 transition-colors pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-violet-400 flex-shrink-0 transition-transform duration-300 ${
                      openFaqIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-8 pb-6 text-slate-400 leading-relaxed font-medium">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-slate-500 font-medium mb-6">Still have questions?</p>
            <button
              onClick={onStart}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-lg shadow-violet-600/30 uppercase tracking-wider text-sm inline-flex items-center space-x-2"
            >
              <span>Try SCOPA AI Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
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
