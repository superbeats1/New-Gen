import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Target,
  BarChart3,
  History,
  Settings,
  HelpCircle,
  ChevronRight,
  Loader2,
  ArrowLeft,
  Briefcase,
  Zap,
  BookmarkCheck,
  LayoutDashboard,
  Globe,
  Terminal,
  Activity,
  Cpu,
  XCircle,
  ShieldAlert,
  LogOut,
  CreditCard,
  User as UserIcon,
  Crown,
  X,
  Sparkles,
  Menu
} from 'lucide-react';
import { WorkflowMode, AnalysisResult } from './types';
import { analyzeQuery } from './geminiService';
import OpportunityView from './components/OpportunityView';
import { AlertsManager } from './components/AlertsManager';
import LandingPage from './components/LandingPage';
import SuccessPage from './components/SuccessPage';
import UpgradeModal from './components/UpgradeModal';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { createCheckoutSession } from './lib/stripe';
import IntelligentBackground from './components/IntelligentBackground';

const SEARCH_STEPS = [
  "Initializing Scopa neural discovery...",
  "Authenticating with Scopa Network nodes...",
  "Scanning Reddit r/entrepreneur and r/forhire...",
  "Parsing relevant market mentions...",
  "Applying sentiment intensity filters...",
  "Ranking signals by market readiness...",
  "Finalizing Scopa intelligence report..."
];

const SearchingModule: React.FC<{ stepIndex: number; onStop: () => void }> = ({ stepIndex, onStop }) => {
  return (
    <div className="glass-panel rounded-3xl p-10 relative overflow-hidden animate-in zoom-in-95 duration-500 max-w-2xl mx-auto">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_rgba(139,92,246,0.5)] animate-scanning-line"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-10">
        <div className="relative">
          <div className="absolute -inset-8 bg-blue-600/20 blur-3xl rounded-full animate-pulse"></div>
          <div className="relative glass-card p-6 rounded-full border border-blue-500/30">
            <Cpu className="w-12 h-12 text-blue-400 animate-spin-slow" />
          </div>
        </div>

        <div className="w-full space-y-6">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
            <span className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span>Neural Processing</span>
            </span>
            <span className="text-blue-300">{Math.round(((stepIndex + 1) / SEARCH_STEPS.length) * 100)}%</span>
          </div>

          <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(139,92,246,0.5)]"
              style={{ width: `${((stepIndex + 1) / SEARCH_STEPS.length) * 100}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-center space-x-3 text-slate-400 font-mono text-xs h-6 overflow-hidden">
            <Terminal className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="truncate animate-pulse">{SEARCH_STEPS[stepIndex]}</span>
          </div>
        </div>

        <button
          onClick={onStop}
          className="group flex items-center space-x-2 px-6 py-2.5 rounded-xl hover:bg-white/5 border border-white/5 text-slate-400 hover:text-white text-sm font-medium transition-all"
        >
          <XCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          <span>Stop Discovery</span>
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showLanding, setShowLanding] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchStep, setSearchStep] = useState(0);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [showAlerts, setShowAlerts] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Check for success redirect from Stripe
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment');
    if (paymentSuccess === 'success') {
      window.history.replaceState({}, document.title, window.location.pathname);
      if (session) {
        fetchProfile(session.user.id);
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        setShowAuthModal(false);
      } else {
        setProfile(null);
        setResults(null);
        setShowLanding(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) setProfile(data);
  };

  const deductCredit = async () => {
    if (!profile) return false;
    if (!profile.is_pro && profile.credits <= 0) return false;

    const newTotalUsed = (profile.total_credits_used || 0) + 1;
    const newCredits = profile.is_pro ? profile.credits : Math.max(0, profile.credits - 1);

    const updateData = {
      credits: newCredits,
      total_credits_used: newTotalUsed,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('profiles').update(updateData).eq('id', profile.id);
    if (!error) {
      setProfile({ ...profile, ...updateData });
      return true;
    }
    return false;
  };

  useEffect(() => {
    let interval: any;
    if (isSearching) {
      interval = setInterval(() => {
        setSearchStep(prev => (prev + 1) % SEARCH_STEPS.length);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isSearching]);

  const handleStartApp = () => {
    if (session) {
      setShowLanding(false);
    } else {
      setShowAuthModal(true);
    }
  };

  const stopSearch = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setIsSearching(false);
    setSearchStep(0);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    if (profile && !profile.is_pro && profile.credits <= 0) {
      alert("Out of credits! Please upgrade to Pro for unlimited neural scans.");
      return;
    }

    setIsSearching(true);
    setSearchStep(0);

    try {
      const animationTimer = new Promise(resolve => setTimeout(resolve, 4000));
      const resultPromise = analyzeQuery(query);

      const [result] = await Promise.all([resultPromise, animationTimer]);

      await deductCredit();
      setResults(result);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log("Search cancelled by user");
      } else {
        console.error("Search failed:", error);
        alert("Something went wrong with the search. Please check your API key.");
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setShowLanding(true);
  };

  const handleUpgradeClick = () => setShowUpgradeModal(true);

  const handleUpgrade = async () => {
    if (isUpgrading) return;
    setIsUpgrading(true);
    try {
      setShowUpgradeModal(false);
      await createCheckoutSession();
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to start upgrade process. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  // TEMPORARY: Manual Pro upgrade for testing
  const handleManualUpgrade = async () => {
    if (!profile) return;
    const confirmed = confirm('ADMIN: Manually upgrade this user to Pro status?');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_pro: true, updated_at: new Date().toISOString() })
        .eq('id', profile.id);

      if (error) throw error;
      await fetchProfile(profile.id);
      alert('✅ Successfully upgraded to Pro status!');
    } catch (error) {
      console.error('Manual upgrade error:', error);
      alert('Failed to upgrade user manually.');
    }
  };

  const handleSuccessContinue = async () => {
    setShowSuccessPage(false);
    setShowLanding(false);
    if (session) await fetchProfile(session.user.id);
  };

  const AuthModal = () => {
    if (!showAuthModal) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
        <div className="relative w-full max-w-md">
          <button
            onClick={() => setShowAuthModal(false)}
            className="absolute -top-12 right-0 p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <Auth />
        </div>
      </div>
    );
  };

  if (showSuccessPage && session) {
    return <SuccessPage onContinue={handleSuccessContinue} userId={session.user.id} />;
  }

  if (showLanding || !session) {
    return (
      <>
        <LandingPage
          onStart={handleStartApp}
          session={session}
          onOpenAuth={() => setShowAuthModal(true)}
          profile={profile}
          onSignOut={handleSignOut}
          onUpgrade={handleUpgradeClick}
        />
        <AuthModal />
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={handleUpgrade}
          isUpgrading={isUpgrading}
        />
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#030407] text-slate-200 selection:bg-violet-500/30 relative">
      <IntelligentBackground />

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 lg:static lg:w-72 
        bg-[#050608]/80 backdrop-blur-2xl border-r border-white/5 flex flex-col p-6 m-4 lg:my-4 lg:ml-4 lg:mr-0 
        rounded-3xl transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-[calc(100%+2rem)] lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setShowLanding(true); setIsMobileMenuOpen(false); }}>
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-violet-600/20">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase italic">Scopa AI</span>
          </div>
          <button className="lg:hidden p-2 text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all ${!results ? 'bg-violet-600/20 text-white font-medium border border-violet-500/30' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
            onClick={() => { setResults(null); setQuery(''); setIsMobileMenuOpen(false); }}
          >
            <Search className={`w-5 h-5 ${!results ? 'text-violet-400' : ''}`} />
            <span>Discover</span>
          </button>

          <button
            onClick={() => { setShowAlerts(true); setIsMobileMenuOpen(false); }}
            className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all hover:bg-white/5 text-slate-400 hover:text-white"
          >
            <History className="w-5 h-5" />
            <span>Alerts</span>
          </button>


          <div className="pt-8 pb-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
            Your Plan
          </div>
          <div className="glass-card p-4 rounded-2xl mx-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all"></div>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-xs font-medium text-slate-300">Credits</span>
              {profile?.is_pro ? (
                <span className="flex items-center text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  PRO
                </span>
              ) : (
                <span className="text-xs font-bold text-white">{profile?.credits} left</span>
              )}
            </div>

            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 transition-all duration-500"
                style={{ width: profile?.is_pro ? '100%' : `${Math.max(0, Math.min(100, (profile?.credits / 10) * 100))}%` }}
              ></div>
            </div>

            {!profile?.is_pro && (
              <button
                onClick={handleUpgradeClick}
                className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Upgrade Plan</span>
              </button>
            )}
          </div>
        </nav>

        <div className="border-t border-white/5 pt-6 space-y-2">
          <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white border border-white/10 shadow-lg shadow-violet-500/20">
              {profile?.first_name?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{profile?.first_name} {profile?.last_name}</div>
              <div className="text-[10px] text-slate-400 truncate">{session?.user?.email}</div>
            </div>
          </div>

          {/* TEMPORARY ADMIN BUTTON */}
          {!profile?.is_pro && (
            <button onClick={handleManualUpgrade} className="w-full text-[10px] text-slate-600 hover:text-amber-500 p-1 text-center">
              (Admin: Upgrade)
            </button>
          )}

          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-4 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all ml-1"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto z-10 w-full">
        <header className="h-20 flex items-center justify-between px-4 lg:px-10 sticky top-0 z-30 bg-[#0a0b0f]/50 backdrop-blur-md lg:bg-transparent">
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg lg:text-xl font-bold text-white tracking-tight">
              {isSearching ? 'Neural Protocol' :
                !results ? 'Intelligence Hub' : 'Opportunity Analysis'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="glass-panel px-4 py-2 rounded-full flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-medium text-slate-300">System Online</span>
            </div>
          </div>
        </header>

        <div className="flex-1 px-4 lg:px-10 pb-10">
          {!results && (
            <div className="max-w-4xl mx-auto py-16">
              <div className="text-center mb-10 lg:mb-16 space-y-4 lg:space-y-6">
                <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter leading-tight">
                  Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">{profile?.first_name || 'Agent'}</span>.
                </h2>
                <p className="text-slate-400 text-lg lg:text-2xl font-medium">
                  What market gaps are we scanning for?
                </p>
              </div>

              {isSearching ? (
                <SearchingModule stepIndex={searchStep} onStop={stopSearch} />
              ) : (
                <div className="relative group max-w-3xl mx-auto">
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-600 rounded-[2.5rem] blur opacity-20 group-focus-within:opacity-50 transition duration-1000 animate-pulse-glow"></div>
                  <form onSubmit={handleSearch} className="relative bg-[#050608]/80 backdrop-blur-xl border border-white/10 rounded-[2.2rem] p-1 shadow-2xl">
                    <div className="bg-[#050608]/50 rounded-[2rem] p-6 lg:p-8">
                      <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSearch(e);
                          }
                        }}
                        placeholder="Describe your target market or ideal lead..."
                        className="w-full bg-transparent border-none focus:ring-0 text-lg lg:text-xl text-white placeholder-slate-600 resize-none min-h-[120px]"
                      />
                      <div className="flex items-center justify-between pt-6 mt-2 border-t border-white/5">
                        <div className="flex flex-wrap gap-2 lg:gap-3">
                          <button type="button" className="glass-panel px-3 py-1.5 rounded-full text-[10px] lg:text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex items-center space-x-1.5">
                            <Globe className="w-3 h-3" />
                            <span>Global</span>
                          </button>
                          <button type="button" className="glass-panel px-3 py-1.5 rounded-full text-[10px] lg:text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex items-center space-x-1.5">
                            <Target className="w-3 h-3" />
                            <span>High Intent</span>
                          </button>
                        </div>
                        <button
                          type="submit"
                          disabled={!query.trim()}
                          className="bg-violet-600 text-white hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 font-black px-8 lg:px-12 py-3 lg:py-4 rounded-2xl transition-all shadow-xl shadow-violet-600/20 flex items-center space-x-3 uppercase tracking-tighter"
                        >
                          <Zap className="w-5 h-5 fill-white" />
                          <span className="hidden sm:inline">Start Neuro-Scan</span>
                          <span className="sm:hidden">Scan</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {!isSearching && (
                <div className="mt-20 max-w-3xl mx-auto">
                  <div
                    className="group bg-[#050608]/40 backdrop-blur-md p-10 rounded-[2.5rem] cursor-pointer hover:bg-white/[0.04] transition-all border border-white/5 hover:border-violet-500/30 w-full text-left relative overflow-hidden"
                    onClick={() => setQuery("Find business opportunities in the remote team collaboration space")}
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-8 border border-violet-500/20 group-hover:scale-110 transition-transform">
                      <Briefcase className="w-8 h-8 text-violet-400" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase italic">Strategy Mode</h3>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                      Find blue ocean opportunities and validate market gaps with deep intelligence.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {results && !isSearching && (
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <OpportunityView
                results={results}
                onNewSearch={() => { setResults(null); setQuery(''); }}
              />
            </div>
          )}
        </div>
      </main>

      <AuthModal />
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
        isUpgrading={isUpgrading}
      />
      <AlertsManager
        userId={profile?.id}
        isOpen={showAlerts}
        onClose={() => setShowAlerts(false)}
      />
    </div>
  );
};

export default App;
