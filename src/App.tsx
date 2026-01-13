import React, { Component, useState, useEffect, useRef } from 'react';
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
  Globe,
  Terminal,
  Activity,
  Cpu,
  XCircle,
  LogOut,
  CreditCard,
  User as UserIcon,
  Crown,
  X,
  Sparkles,
  Menu,
  Bell,
  ShieldAlert,
  Rocket,
  Building2
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
import { Toaster } from 'sonner';
import { NotificationCenter } from './components/NotificationCenter';
import { NotificationProvider } from './contexts/NotificationContext';
import { OnboardingFlow } from './components/OnboardingFlow';
import { BottomNavigation } from './components/BottomNavigation';
import { exportService } from './services/exportService';

// --- NEW DIAGNOSTIC LAYER ---
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("PROTOCOL BREACH DETECTED:", error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    // @ts-ignore
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="min-h-screen bg-[#030407] text-white flex flex-col items-center justify-center p-8 text-center" style={{ zIndex: 9999, position: 'relative' }}>
          <ShieldAlert className="w-16 h-16 text-rose-500 mb-6 animate-pulse" />
          <h1 className="text-3xl font-black mb-4 uppercase italic">Neural Protocol Breach</h1>
          <p className="text-slate-400 max-w-md mb-8">A terminal error occured in the UI layer. Protocol v2.6.1 diagnostic data follow:</p>
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-rose-500/20 text-left font-mono text-xs text-rose-400 max-w-2xl overflow-auto w-full">
            <div className="font-bold mb-2">Error: {error?.toString()}</div>
            <pre className="opacity-70 whitespace-pre-wrap">
              {error?.stack?.split('\n').slice(0, 5).join('\n')}
            </pre>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-8 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors shadow-lg shadow-violet-600/20"
          >
            Reinitialize System
          </button>
        </div>
      );
    }
    return children;
  }
}

const DiagnosticHub: React.FC<{ results: AnalysisResult | null; isSearching: boolean; stats: any }> = ({ results, isSearching, stats }) => {
  const [show, setShow] = useState(false);

  // Toggle with Shift+D
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'D') setShow(prev => !prev);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] w-96 bg-black/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-right-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-violet-400">Deep Diagnostic Hub</h3>
        <button onClick={() => setShow(false)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"><X className="w-4 h-4" /></button>
      </div>
      <div className="space-y-4 font-mono text-[10px] text-slate-400">
        <div className="flex justify-between"><span>Status:</span><span className={isSearching ? 'text-amber-400' : 'text-emerald-400'}>{isSearching ? 'Scanning...' : 'Idle'}</span></div>
        <div className="flex justify-between"><span>Real Data Count:</span><span className="text-white">{stats.realDataCount || 0}</span></div>
        <div className="flex justify-between"><span>Opportunities Found:</span><span className="text-white">{results?.opportunities?.length || 0}</span></div>
        <div className="flex justify-between"><span>Engine Version:</span><span className="text-violet-400">v2.6.1</span></div>
        <div className="pt-2 border-t border-white/5 max-h-40 overflow-auto">
          <div className="mb-2 text-slate-500 underline uppercase">Last System Log:</div>
          <div className="text-[8px] leading-tight text-slate-500">{stats.lastLog || 'System ready.'}</div>
        </div>
      </div>
    </div>
  );
};

const SEARCH_STEPS = [
  "Initializing Scopa neural discovery...",
  "Authenticating with Scopa Network nodes...",
  "Scanning Twitter, Reddit, HackerNews & GitHub...",
  "Parsing relevant market mentions...",
  "Applying sentiment intensity filters...",
  "Ranking signals by market readiness...",
  "Finalizing Scopa intelligence report..."
];

const SkeletonOpportunityCard: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <div
      className="bg-[#050608]/40 backdrop-blur-2xl rounded-3xl p-8 border border-white/5 animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="animate-pulse space-y-4">
        <div className="flex items-center space-x-3">
          <div className="h-6 w-24 bg-violet-500/20 rounded-full"></div>
          <div className="h-6 w-20 bg-slate-700/50 rounded-full"></div>
        </div>
        <div className="h-8 bg-slate-700/30 rounded-xl w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-700/20 rounded-lg w-full"></div>
          <div className="h-4 bg-slate-700/20 rounded-lg w-5/6"></div>
          <div className="h-4 bg-slate-700/20 rounded-lg w-4/6"></div>
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <div className="h-8 w-28 bg-emerald-500/10 rounded-xl"></div>
          <div className="h-8 w-24 bg-amber-500/10 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

const SearchingModule: React.FC<{ stepIndex: number; onStop: () => void }> = ({ stepIndex, onStop }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Progress Panel */}
      <div className="glass-panel rounded-3xl p-10 relative overflow-hidden max-w-2xl mx-auto">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent shadow-[0_0_20px_rgba(139,92,246,0.5)] animate-scanning-line"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center space-y-10">
          <div className="relative">
            <div className="absolute -inset-8 bg-violet-600/20 blur-3xl rounded-full animate-pulse"></div>
            <div className="relative glass-card p-6 rounded-full border border-violet-500/30">
              <Cpu className="w-12 h-12 text-violet-400 animate-spin-slow" />
            </div>
          </div>

          <div className="w-full space-y-6">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
              <span className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-violet-500" />
                <span>Neural Processing</span>
              </span>
              <span className="text-violet-300">{Math.round(((stepIndex + 1) / SEARCH_STEPS.length) * 100)}%</span>
            </div>

            <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                style={{ width: `${((stepIndex + 1) / SEARCH_STEPS.length) * 100}%` }}
              ></div>
            </div>

          <div className="flex items-center justify-center space-x-3 text-slate-400 font-mono text-xs h-6 overflow-hidden">
            <Terminal className="w-4 h-4 text-violet-500 shrink-0" />
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

      {/* Skeleton Preview Cards */}
      {stepIndex >= 4 && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Discovering Opportunities...
            </h3>
          </div>
          <div className="grid gap-6">
            <SkeletonOpportunityCard delay={0} />
            <SkeletonOpportunityCard delay={200} />
            <SkeletonOpportunityCard delay={400} />
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  // --- NUCLEAR PURGE ENGINE v2.6.1 ---
  useEffect(() => {
    const PURGE_KEY = 'SCOPA_PURGE_V2_6_1';
    if (!localStorage.getItem(PURGE_KEY)) {
      console.log('🚨 NUCLEAR OPTION PURGE INITIATED: Clearing stale memory...');
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem(PURGE_KEY, 'true');

      // Kill all service workers
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (let registration of registrations) {
            registration.unregister();
            console.log('💀 Stale Service Worker Unregistered');
          }
        });
      }

      // Force reload from server
      setTimeout(() => window.location.reload(), 500);
    }
  }, []);

  const handleForceSync = async () => {
    console.log('🔄 DEEP SYNC INITIATED...');
    localStorage.clear();
    sessionStorage.clear();

    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
      }
    }

    // Clear cache API if available
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
    }

    // Clear IndexedDB
    const databases = await window.indexedDB.databases();
    for (const db of databases) {
      if (db.name) window.indexedDB.deleteDatabase(db.name);
    }

    window.location.reload();
  };

  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showLanding, setShowLanding] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchStep, setSearchStep] = useState(0);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [showAlerts, setShowAlerts] = useState(false);
  const [view, setView] = useState<'home' | 'results'>('home');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingTriggered, setOnboardingTriggered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileProfile, setShowMobileProfile] = useState(false);
  const [diagStats, setDiagStats] = useState({ realDataCount: 0, lastLog: '' });
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const EXAMPLE_QUERIES = [
    "AI-powered productivity tools for remote teams",
    "Sustainable fashion marketplace opportunities",
    "Developer tools for API monitoring and debugging",
    "Mental health apps targeting Gen Z professionals",
    "No-code automation platforms for small businesses",
    "Eco-friendly packaging solutions for e-commerce"
  ];

  const abortControllerRef = useRef<AbortController | null>(null);

  // Rotate placeholder examples
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % EXAMPLE_QUERIES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check for success redirect from Stripe
    try {
      // CRITICAL: Ensure we have a valid string for URLSearchParams
      const searchString = typeof window?.location?.search === 'string'
        ? window.location.search
        : '';

      // Only parse if we actually have a search string
      if (searchString && searchString.length > 0) {
        const urlParams = new URLSearchParams(searchString);
        const paymentSuccess = urlParams.get('payment');
        if (paymentSuccess === 'success') {
          if (typeof window?.history?.replaceState === 'function') {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          if (session) {
            fetchProfile(session.user.id);
          }
        }
      }
    } catch (err) {
      // Silently fail - don't break the app
      console.debug('URL params parsing skipped:', err);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        setShowLanding(false); // Take user directly to Intelligence Hub if already signed in
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        setShowAuthModal(false);
        setShowLanding(false); // Take user directly to Intelligence Hub
        // Check if onboarding should be shown after a brief delay
        setTimeout(() => {
          const hasCompletedOnboarding = localStorage.getItem('scopa_onboarding_completed');
          const hasCompletedSearch = localStorage.getItem('scopa_first_search_completed');
          if (!hasCompletedOnboarding && !hasCompletedSearch && !onboardingTriggered) {
            setOnboardingTriggered(true);
            setTimeout(() => {
              setShowOnboarding(true);
            }, 1000);
          }
        }, 500);
      } else {
        setProfile(null);
        setResults(null);
        setShowLanding(true);
        setOnboardingTriggered(false); // Reset for next user
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

  // Onboarding is now handled directly in the auth state change handler for better reliability

  const handleOnboardingComplete = () => {
    localStorage.setItem('scopa_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('scopa_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  // Bottom navigation handlers
  const handleBottomNavHome = () => {
    setView('home');
    setResults(null);
    setQuery('');
  };

  const handleBottomNavExport = () => {
    if (results) {
      exportService.exportToCSV(results);
    }
  };

  const handleBottomNavProfile = () => {
    setShowMobileProfile(true);
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
      setDiagStats(prev => ({ ...prev, lastLog: 'Initializing Scopa neural discovery...' }));
      const animationTimer = new Promise(resolve => setTimeout(resolve, 4000));

      // Track real data collection
      const resultPromise = analyzeQuery(query);

      const [result] = await Promise.all([resultPromise, animationTimer]);

      setDiagStats({
        realDataCount: result.totalSourcesAnalyzed || 0,
        lastLog: `Analysis complete. ${result.opportunities?.length || 0} opportunities identified.`
      });

      await deductCredit();
      setResults(result);
      setView('results');
    } catch (error: any) {
      setDiagStats(prev => ({ ...prev, lastLog: `FAILURE: ${error.message}` }));
      if (error.name === 'AbortError') {
        console.log("Search cancelled by user");
      } else {
        console.error("Search failed:", error);
        alert("Something went wrong with the search. Please resolve the issues in the console.");
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

  // REMOVED - AuthModal and MobileProfileModal moved to JSX to prevent re-mounting

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
        {/* Auth Modal - inline to prevent re-mounting */}
        {showAuthModal && (
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
        )}
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
    <ErrorBoundary>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'glass-panel',
          style: {
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      />
      <div className="flex h-screen overflow-hidden bg-[#030407] text-slate-200 selection:bg-violet-500/30 relative">
        <IntelligentBackground />
        <DiagnosticHub results={results} isSearching={isSearching} stats={diagStats} />

        {profile ? (
          <NotificationProvider userId={profile.id}>
            {/* Content wrapped in NotificationProvider */}
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
              <div
                className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-[70] w-80 lg:w-72
        bg-[#050608]/95 backdrop-blur-2xl border-r border-white/10 flex flex-col p-5 pb-6 lg:p-6 m-0 lg:m-4 lg:my-4 lg:ml-4 lg:mr-0
        lg:rounded-3xl transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
              <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/5 lg:border-0 flex-shrink-0">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setShowLanding(true); setIsMobileMenuOpen(false); }}>
                  <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-violet-600/30">
                    <Zap className="w-5 h-5 text-white fill-white" />
                  </div>
                  <span className="text-xl font-black tracking-tight text-white uppercase italic">Scopa AI</span>
                </div>
                <button className="lg:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-white rounded-xl hover:bg-white/5 active:bg-white/10 transition-all touch-manipulation" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-2.5 overflow-y-auto min-h-0">
                <button
                  className={`w-full flex items-center space-x-3 px-5 py-4 rounded-2xl transition-all touch-manipulation active:scale-[0.98] ${view === 'home' ? 'bg-violet-600/20 text-white font-bold border border-violet-500/30 shadow-lg shadow-violet-600/10' : 'hover:bg-white/5 text-slate-400 hover:text-white active:bg-white/10'}`}
                  onClick={() => { setView('home'); setResults(null); setQuery(''); setIsMobileMenuOpen(false); }}
                >
                  <Search className={`w-5 h-5 flex-shrink-0 ${view === 'home' ? 'text-violet-400' : ''}`} />
                  <span className="font-semibold">Discover</span>
                </button>

                <button
                  onClick={() => { setShowAlerts(true); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center space-x-3 px-5 py-4 rounded-2xl transition-all hover:bg-white/5 text-slate-400 hover:text-white active:bg-white/10 touch-manipulation active:scale-[0.98]"
                  data-onboarding="alerts-button"
                >
                  <History className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold">Alerts</span>
                </button>

                <div className="pt-6 pb-3 px-3 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                  Your Plan
                </div>
                <div className="glass-card p-5 rounded-2xl relative overflow-hidden group border border-white/5 hover:border-white/10 transition-all">
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

              <div className="border-t border-white/10 pt-5 space-y-3 mt-auto flex-shrink-0">
                <div className="flex items-center space-x-3 px-4 py-3 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-black text-white border-2 border-white/20 shadow-lg shadow-violet-500/30 flex-shrink-0">
                    {profile?.first_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white truncate">{profile?.first_name} {profile?.last_name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{session?.user?.email}</div>
                  </div>
                  {profile?.is_pro && <Crown className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                </div>

                {!profile?.is_pro && (
                  <button onClick={handleManualUpgrade} className="w-full text-[10px] text-slate-600 hover:text-amber-500 p-1.5 text-center transition-colors">
                    (Admin: Upgrade)
                  </button>
                )}

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 active:bg-rose-500/20 transition-all font-semibold touch-manipulation active:scale-[0.98]"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign Out</span>
                </button>

                <div className="pt-2 flex items-center justify-between px-3 opacity-40 hover:opacity-70 transition-opacity">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol v{(window as any).SCOPA_VERSION || '2.6.1'}</span>
                  <button
                    onClick={handleForceSync}
                    className="text-[9px] font-black text-violet-400 uppercase tracking-widest hover:text-violet-300 transition-colors"
                    title="Force deep cache clear and service worker purge"
                  >
                    Sync
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full relative overflow-y-auto z-10 w-full">
              <header className="h-16 sm:h-20 flex items-center justify-between px-3 sm:px-4 lg:px-10 sticky top-0 z-30 bg-[#0a0b0f]/80 backdrop-blur-xl lg:bg-transparent border-b border-white/5 lg:border-0">
                <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
                  <button
                    className="lg:hidden p-2 sm:p-3 -ml-1 sm:-ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-white/5 flex-shrink-0"
                    onClick={() => setIsMobileMenuOpen(true)}
                  >
                    <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <h1 className="text-sm sm:text-base lg:text-xl font-black text-white tracking-tight whitespace-nowrap truncate">
                    {isSearching ? 'Neural Protocol' :
                      view === 'home' ? 'Intelligence Hub' : 'Opportunity Analysis'}
                  </h1>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                  <div className="glass-panel px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center space-x-1.5 sm:space-x-2">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-300 whitespace-nowrap">System Online</span>
                  </div>
                  {profile && <NotificationCenter />}
                </div>
              </header>

              <div className="flex-1 px-3 sm:px-4 lg:px-10 pb-28 sm:pb-24 lg:pb-10 overflow-y-auto">
                {view === 'home' && !isSearching && (
                  <div className="max-w-4xl mx-auto py-4 sm:py-10 lg:py-16">
                    <div className="text-center mb-6 sm:mb-12 lg:mb-20 space-y-2 sm:space-y-4 lg:space-y-6">
                      <div className="inline-flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-1.5 rounded-full bg-violet-600/10 border border-violet-500/20 animate-in fade-in slide-in-from-bottom-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
                        <span className="text-[9px] sm:text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] sm:tracking-[0.3em]">Protocol v2.6.1 Active</span>
                      </div>
                      <h2 className="text-3xl sm:text-5xl lg:text-8xl font-black text-white tracking-tighter leading-[0.95] uppercase italic px-2">
                        Scopa <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-500">Intelligence</span>
                      </h2>
                      <p className="text-slate-500 text-xs sm:text-lg lg:text-2xl font-medium tracking-tight max-w-2xl mx-auto px-4 leading-snug">
                        Scan global markets for untapped opportunities using high-fidelity neural analysis.
                      </p>
                    </div>

                    <div className="relative group max-w-3xl mx-auto px-1 sm:px-0">
                      <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-600 rounded-[1.5rem] sm:rounded-[2.5rem] blur opacity-20 group-focus-within:opacity-50 transition duration-1000 animate-pulse-glow"></div>
                      <form onSubmit={handleSearch} className="relative bg-[#050608]/80 backdrop-blur-xl border border-white/10 rounded-[1.5rem] sm:rounded-[2.2rem] p-0.5 sm:p-1 shadow-2xl">
                        <div className="bg-[#050608]/50 rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-6 lg:p-8">
                          <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSearch(e);
                              }
                            }}
                            placeholder={`e.g. "${EXAMPLE_QUERIES[placeholderIndex] || 'AI-powered productivity tools'}"`}
                            className="w-full bg-transparent border-none focus:ring-0 text-sm sm:text-lg lg:text-xl text-white placeholder-slate-600 resize-none min-h-[60px] sm:min-h-[100px] lg:min-h-[120px]"
                            data-onboarding="search-input"
                          />
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 pt-3 sm:pt-6 mt-2 border-t border-white/5">
                            <div className="flex flex-wrap gap-2 items-center">
                              <button type="button" className="glass-panel px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex items-center space-x-1.5">
                                <Globe className="w-3 h-3" />
                                <span>Global</span>
                              </button>
                              <button type="button" className="glass-panel px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex items-center space-x-1.5">
                                <Target className="w-3 h-3" />
                                <span>High Intent</span>
                              </button>
                              <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium ml-auto hidden lg:flex">
                                <kbd className="px-2 py-1 text-xs font-mono bg-slate-800/50 border border-slate-700/50 rounded">Enter</kbd>
                                <span>to scan</span>
                              </div>
                            </div>
                            <button
                              type="submit"
                              disabled={!query.trim()}
                              className="w-full sm:w-auto bg-violet-600 text-white hover:bg-violet-500 active:bg-violet-700 disabled:bg-slate-700 disabled:text-slate-500 font-black px-5 sm:px-8 lg:px-12 py-2.5 sm:py-3 lg:py-4 rounded-xl sm:rounded-2xl transition-all shadow-xl shadow-violet-600/20 flex items-center justify-center space-x-2 uppercase tracking-tighter min-h-[44px] touch-manipulation"
                            >
                              <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-white flex-shrink-0" />
                              <span className="text-xs sm:text-sm lg:text-base">Start Discovery</span>
                            </button>
                          </div>
                        </div>
                      </form>

                      {/* Quick Start Templates */}
                      <div className="mt-4 sm:mt-6 lg:mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        <div className="text-[9px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 sm:mb-3 text-center">
                          Quick Start Templates
                        </div>
                        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 lg:gap-3">
                          {[
                            { label: 'SaaS Tools', icon: Rocket, query: 'SaaS productivity tools for remote teams' },
                            { label: 'E-commerce', icon: Building2, query: 'E-commerce marketplace opportunities' },
                            { label: 'Developer Tools', icon: Activity, query: 'Developer tools for API monitoring' },
                            { label: 'Health Tech', icon: Target, query: 'Mental health apps for professionals' }
                          ].map((template) => (
                            <button
                              key={template.label}
                              type="button"
                              onClick={() => {
                                // Set query and trigger search with a small delay to ensure state updates
                                const templateQuery = template.query;
                                setQuery(templateQuery);
                                // Force a re-render and then trigger search
                                setTimeout(() => {
                                  const searchForm = document.querySelector('form');
                                  if (searchForm) {
                                    const syntheticEvent = {
                                      preventDefault: () => {},
                                      target: searchForm,
                                      currentTarget: searchForm
                                    } as React.FormEvent;
                                    handleSearch(syntheticEvent);
                                  }
                                }, 50);
                              }}
                              className="group px-2.5 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 bg-white/5 hover:bg-violet-600 active:bg-violet-700 border border-white/10 hover:border-violet-500 rounded-lg sm:rounded-xl lg:rounded-2xl text-[10px] sm:text-xs lg:text-sm font-bold transition-all flex items-center space-x-1 sm:space-x-1.5 lg:space-x-2 hover:scale-105 hover:shadow-lg hover:shadow-violet-600/20 touch-manipulation"
                            >
                              <template.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-slate-400 group-hover:text-white transition-colors flex-shrink-0" />
                              <span className="text-slate-300 group-hover:text-white transition-colors whitespace-nowrap">{template.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-24 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                      <div
                        className="group bg-[#050608]/40 backdrop-blur-2xl p-12 rounded-[3.5rem] cursor-pointer hover:bg-white/[0.04] transition-all border border-white/5 hover:border-violet-500/30 w-full text-left relative overflow-hidden"
                        onClick={() => { setQuery("Find emerging opportunities in the AI-powered health-tech space for 2026"); setView('home'); }}
                      >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-10 border border-violet-500/20 group-hover:scale-110 transition-transform">
                          <Zap className="w-8 h-8 text-violet-400 fill-violet-400/20" />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase italic">Strategic Pulse</h3>
                        <p className="text-slate-500 text-lg leading-relaxed font-medium">
                          Identify high-velocity market gaps with predictive intelligence.
                        </p>
                      </div>

                      <div
                        className="group bg-[#050608]/40 backdrop-blur-2xl p-12 rounded-[3.5rem] cursor-pointer hover:bg-white/[0.04] transition-all border border-white/5 hover:border-emerald-500/30 w-full text-left relative overflow-hidden"
                        onClick={() => setShowAlerts(true)}
                      >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-10 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                          <Bell className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase italic">Neural Monitors</h3>
                        <p className="text-slate-500 text-lg leading-relaxed font-medium">
                          Set automated shadows to track market movements 24/7.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isSearching && (
                  <div className="max-w-4xl mx-auto py-16">
                    <SearchingModule stepIndex={searchStep} onStop={stopSearch} />
                  </div>
                )}

                {view === 'results' && results && !isSearching && (
                  <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <OpportunityView
                      results={results}
                      onNewSearch={() => { setView('home'); setResults(null); setQuery(''); }}
                    />
                  </div>
                )}
              </div>
            </main>

            {/* Bottom Mobile Navigation */}
            {profile && (
              <BottomNavigation
                currentView={view}
                hasResults={!!results}
                onNavigateHome={handleBottomNavHome}
                onOpenAlerts={() => setShowAlerts(true)}
                onOpenProfile={handleBottomNavProfile}
                onExport={handleBottomNavExport}
              />
            )}

          </NotificationProvider>
        ) : (
          // Not authenticated - show basic layout without notifications
          <main className="flex-1 overflow-y-auto">
            <header className="sticky top-0 z-20 backdrop-blur-2xl bg-[#030407]/80 border-b border-white/5 p-4 lg:p-6 flex items-center justify-between">
              <h1 className="text-lg lg:text-xl font-bold text-white tracking-tight">Sign In Required</h1>
            </header>
          </main>
        )}

        {/* Auth Modal - inline to prevent re-mounting */}
        {showAuthModal && (
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
        )}
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
        <OnboardingFlow
          isOpen={showOnboarding}
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
        {/* Mobile Profile Modal - inline to prevent re-mounting */}
        {showMobileProfile && (
          <div className="lg:hidden fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowMobileProfile(false)}>
            <div className="w-full bg-[#0A0A0C]/95 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl p-6 pb-safe animate-in slide-in-from-bottom-4 duration-300" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black uppercase tracking-tight text-white">Account</h3>
                <button
                  onClick={() => setShowMobileProfile(false)}
                  className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Info */}
              {profile && (
                <div className="glass-panel p-4 rounded-2xl mb-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                      {profile.first_name?.[0]}{profile.last_name?.[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-bold">{profile.first_name} {profile.last_name}</div>
                      <div className="text-slate-500 text-sm">{session?.user?.email}</div>
                    </div>
                  </div>

                  {/* Credits/Pro Status */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-xs font-medium text-slate-400">Status</span>
                    {profile.is_pro ? (
                      <span className="flex items-center text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                        <Crown className="w-3 h-3 mr-1" />
                        PRO
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-white">{profile.credits} credits left</span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 mb-6">
                {!profile?.is_pro && (
                  <button
                    onClick={() => { setShowMobileProfile(false); handleUpgradeClick(); }}
                    className="w-full flex items-center space-x-3 px-4 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold transition-all shadow-lg shadow-violet-600/20 min-h-[56px]"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Upgrade to Pro</span>
                  </button>
                )}

                <button
                  onClick={() => { setShowMobileProfile(false); setShowLanding(true); }}
                  className="w-full flex items-center space-x-3 px-4 py-4 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all min-h-[56px]"
                >
                  <Rocket className="w-5 h-5" />
                  <span>View Landing Page</span>
                </button>
              </div>

              {/* Sign Out */}
              <button
                onClick={() => { setShowMobileProfile(false); handleSignOut(); }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all border border-rose-500/20 min-h-[56px]"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-bold">Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
