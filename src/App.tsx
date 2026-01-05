
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Target, 
  Users, 
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
  X
} from 'lucide-react';
import { WorkflowMode, AnalysisResult, SavedLead, Lead } from './types';
import { analyzeQuery } from './geminiService';
import OpportunityView from './components/OpportunityView';
import LeadView from './components/LeadView';
import TrackerView from './components/TrackerView';
import LandingPage from './components/LandingPage';
import SuccessPage from './components/SuccessPage';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { createCheckoutSession } from './lib/stripe';

const SEARCH_STEPS = [
  "Initializing neural discovery agents...",
  "Authenticating with Signal Network nodes...",
  "Scanning Reddit r/entrepreneur and r/forhire...",
  "Parsing 247 recent forum mentions...",
  "Applying sentiment intensity filters...",
  "Ranking signals by market readiness...",
  "Finalizing intelligence report..."
];

const SearchingModule: React.FC<{ stepIndex: number; onStop: () => void }> = ({ stepIndex, onStop }) => {
  return (
    <div className="relative bg-[#11131a] rounded-3xl p-10 border border-blue-500/30 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-scanning-line"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center space-y-8">
        <div className="relative">
          <div className="absolute -inset-4 bg-blue-600/20 blur-2xl rounded-full animate-pulse"></div>
          <div className="relative bg-slate-900/80 p-5 rounded-3xl border border-blue-500/20">
            <Cpu className="w-12 h-12 text-blue-500 animate-spin-slow" />
          </div>
        </div>
        <div className="w-full max-w-md space-y-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
            <span className="flex items-center space-x-2">
              <Activity className="w-3.5 h-3.5 text-blue-500" />
              <span>Neural Processing</span>
            </span>
            <span>{Math.round(((stepIndex + 1) / SEARCH_STEPS.length) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              style={{ width: `${((stepIndex + 1) / SEARCH_STEPS.length) * 100}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-center space-x-2 text-slate-400 font-mono text-xs h-6 overflow-hidden">
            <Terminal className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="truncate">{SEARCH_STEPS[stepIndex]}</span>
          </div>
        </div>
        <button 
          onClick={onStop}
          className="group flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-sm font-bold transition-all shadow-lg shadow-rose-900/10"
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
  const [view, setView] = useState<'home' | 'results' | 'tracker'>('home');
  const [savedLeads, setSavedLeads] = useState<SavedLead[]>([]);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Check for success redirect from Stripe
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    if (sessionId) {
      setShowSuccessPage(true);
      // Clear the URL parameters but keep the current path
      window.history.replaceState({}, document.title, window.location.pathname);
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
        setView('home');
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
    
    // Safety check for free users
    if (!profile.is_pro && profile.credits <= 0) return false;

    const newTotalUsed = (profile.total_credits_used || 0) + 1;
    const newCredits = profile.is_pro ? profile.credits : Math.max(0, profile.credits - 1);

    const updateData = {
      credits: newCredits,
      total_credits_used: newTotalUsed,
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', profile.id);

    if (!error) {
      setProfile({ ...profile, ...updateData });
      return true;
    }
    return false;
  };

  useEffect(() => {
    const stored = localStorage.getItem('signal_saved_leads');
    if (stored) {
      setSavedLeads(JSON.parse(stored));
    }
  }, []);

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
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
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
    
    if (view === 'results') {
      setView('home');
    }

    try {
      const animationTimer = new Promise(resolve => setTimeout(resolve, 4000));
      const resultPromise = analyzeQuery(query);
      
      const [result] = await Promise.all([resultPromise, animationTimer]);
      
      // Deduct credit only after success
      await deductCredit();
      setResults(result);
      setView('results');
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

  const handleSaveLead = (lead: Lead) => {
    const alreadySaved = savedLeads.find(l => l.id === lead.id);
    if (alreadySaved) return;

    const newLead: SavedLead = {
      ...lead,
      savedDate: new Date().toISOString(),
      status: 'New'
    };
    const updated = [...savedLeads, newLead];
    setSavedLeads(updated);
    localStorage.setItem('signal_saved_leads', JSON.stringify(updated));
  };

  const handleDeleteLead = (id: string) => {
    const updated = savedLeads.filter(l => l.id !== id);
    setSavedLeads(updated);
    localStorage.setItem('signal_saved_leads', JSON.stringify(updated));
  };

  const handleUpdateLeadStatus = (id: string, status: any) => {
    const updated = savedLeads.map(l => l.id === id ? { ...l, status } : l);
    setSavedLeads(updated);
    localStorage.setItem('signal_saved_leads', JSON.stringify(updated));
  };

  const handleUpgrade = async () => {
    if (isUpgrading) return;
    
    setIsUpgrading(true);
    try {
      await createCheckoutSession();
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to start upgrade process. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  // TEMPORARY: Manual Pro upgrade for testing (remove in production)
  const handleManualUpgrade = async () => {
    if (!profile) return;
    
    const confirmed = confirm('ADMIN: Manually upgrade this user to Pro status?');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_pro: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      // Refresh profile
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
    setView('home');
    // Refresh profile to get updated Pro status
    if (session) {
      await fetchProfile(session.user.id);
    }
  };

  // Auth Modal Component
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
        />
        <AuthModal />
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0b0e] text-slate-200 animate-in fade-in duration-700">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/50 bg-[#0d0f14] flex flex-col p-6 space-y-8">
        <div className="flex items-center space-x-3 mb-4 cursor-pointer" onClick={() => setShowLanding(true)}>
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-600/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white uppercase italic">SIGNAL</span>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setView('home')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${view === 'home' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'hover:bg-slate-800/50 text-slate-400'}`}
          >
            <Search className="w-5 h-5" />
            <span className="font-medium">Discover</span>
          </button>
          
          <button 
            onClick={() => setView('tracker')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${view === 'tracker' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'hover:bg-slate-800/50 text-slate-400'}`}
          >
            <BookmarkCheck className="w-5 h-5" />
            <span className="font-medium">My Tracker</span>
            {savedLeads.length > 0 && (
              <span className="ml-auto bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {savedLeads.length}
              </span>
            )}
          </button>
          
          <div className="pt-8 text-xs font-semibold text-slate-500 uppercase tracking-widest px-4 mb-2">
            Usage Metrics
          </div>
          <div className="px-4 space-y-4">
            <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Credits</span>
                {profile?.is_pro ? (
                   <span className="flex items-center text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded uppercase">
                     <Crown className="w-3 h-3 mr-1" /> Pro
                   </span>
                ) : (
                  <span className="text-[10px] font-bold text-blue-400">{profile?.credits} left</span>
                )}
              </div>
              <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500" 
                  style={{ width: profile?.is_pro ? '100%' : `${Math.max(0, Math.min(100, (profile?.credits / 10) * 100))}%` }}
                ></div>
              </div>
              <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
                <span>Lifetime Scans:</span>
                <span className="text-slate-300 font-bold">{profile?.total_credits_used || 0}</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="border-t border-slate-800 pt-6 space-y-2">
          <div className="flex items-center space-x-3 px-4 py-2 mb-2">
             <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
               <UserIcon className="w-4 h-4 text-slate-400" />
             </div>
             <div className="flex-1 truncate">
               <div className="flex items-center space-x-2">
                 <div className="text-xs font-bold text-white truncate">{profile?.first_name} {profile?.last_name}</div>
                 {profile?.is_pro && (
                   <span className="flex items-center text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded uppercase">
                     <Crown className="w-2.5 h-2.5 mr-0.5" /> Pro
                   </span>
                 )}
               </div>
               <div className="text-[10px] text-slate-500 truncate">{session?.user?.email}</div>
               <div className="text-[9px] text-slate-600 truncate">
                 {profile?.is_pro ? 'SIGNAL Pro Plan' : 'Free Plan (10 credits)'}
               </div>
             </div>
          </div>
          {/* TEMPORARY ADMIN BUTTON - Remove in production */}
          {!profile?.is_pro && (
            <button 
              onClick={handleManualUpgrade}
              className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-amber-400 hover:bg-amber-500/10 transition-all text-xs"
            >
              <Crown className="w-4 h-4" />
              <span>Admin: Upgrade to Pro</span>
            </button>
          )}
          
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto bg-[radial-gradient(ellipse_at_top,#11131a_0%,#0a0b0e_100%)]">
        <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-8 bg-[#0a0b0e]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            {(view !== 'home' || isSearching) && (
              <button 
                onClick={() => { setView('home'); stopSearch(); }}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-lg font-semibold text-slate-200">
              {isSearching ? 'Neural Extraction Protocol' :
               view === 'home' ? 'Intelligence Hub' : 
               view === 'tracker' ? 'Lead Tracker' : 
               results?.mode === WorkflowMode.OPPORTUNITY ? 'Opportunity Analysis' : 'Lead Discovery'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-700/50">
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-300">{profile?.is_pro ? 'Unlimited' : `${profile?.credits} Credits`}</span>
            </div>
            {!profile?.is_pro && (
              <button 
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="bg-amber-600 hover:bg-amber-500 disabled:bg-amber-600/50 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition-all flex items-center space-x-2"
              >
                {isUpgrading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Crown className="w-3 h-3" />
                )}
                <span>{isUpgrading ? 'Processing...' : 'Upgrade'}</span>
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 p-8">
          {view === 'home' && (
            <div className="max-w-4xl mx-auto py-12">
              <div className="text-center mb-12 space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
                  Live Market Analysis
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">{profile?.first_name || 'Agent'}</span>.
                </h2>
                <p className="text-slate-400 text-lg max-w-xl mx-auto">
                  Ready to uncover some hidden market signals?
                </p>
              </div>

              {isSearching ? (
                <div className="max-w-2xl mx-auto">
                   <SearchingModule stepIndex={searchStep} onStop={stopSearch} />
                </div>
              ) : (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
                  <form onSubmit={handleSearch} className="relative bg-[#11131a] rounded-2xl p-6 border border-slate-800/50 shadow-2xl">
                    <div className="flex flex-col space-y-4">
                      <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., 'Find business opportunities in AI for legal firms' or 'Find clients who need a wedding photographer in Austin'"
                        className="w-full bg-transparent border-none focus:ring-0 text-xl text-white placeholder-slate-600 resize-none min-h-[120px]"
                      />
                      <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                        <div className="flex space-x-4">
                          <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium bg-slate-800/30 px-3 py-1.5 rounded-full border border-slate-700/50">
                            <Target className="w-3.5 h-3.5 text-blue-500" />
                            <span>Last 30 Days</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium bg-slate-800/30 px-3 py-1.5 rounded-full border border-slate-700/50">
                            <Globe className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Global Sources</span>
                          </div>
                        </div>
                        <button 
                          type="submit"
                          disabled={!query.trim()}
                          className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg flex items-center space-x-2 shadow-blue-900/20"
                        >
                          <Search className="w-5 h-5" />
                          <span>Start Scan</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {!isSearching && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 animate-in fade-in slide-in-from-top-4 duration-700">
                  <div 
                    className="p-6 glass-card rounded-2xl border border-slate-800/50 group hover:border-blue-500/30 hover:bg-slate-800/30 transition-all cursor-pointer" 
                    onClick={() => setQuery("Find business opportunities in the remote team collaboration space")}
                  >
                    <div className="bg-blue-500/10 p-3 rounded-xl w-fit mb-4 group-hover:bg-blue-500/20 transition-all border border-blue-500/20">
                      <Briefcase className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Opportunity Mode</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Identify market gaps, common complaints, and unserved niches in any industry.
                    </p>
                  </div>
                  <div 
                    className="p-6 glass-card rounded-2xl border border-slate-800/50 group hover:border-indigo-500/30 hover:bg-slate-800/30 transition-all cursor-pointer" 
                    onClick={() => setQuery("Find clients who need a video editor for YouTube creators")}
                  >
                    <div className="bg-indigo-500/10 p-3 rounded-xl w-fit mb-4 group-hover:bg-indigo-500/20 transition-all border border-indigo-500/20">
                      <Users className="w-6 h-6 text-indigo-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Lead Mode</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Scan social posts, forums, and job boards for active buyers seeking your skills.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {view === 'results' && results && !isSearching && (
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              {results.mode === WorkflowMode.OPPORTUNITY ? (
                <OpportunityView 
                  results={results} 
                  onNewSearch={() => setView('home')} 
                />
              ) : (
                <LeadView 
                  results={results} 
                  onSave={handleSaveLead}
                  onGoTracker={() => setView('tracker')}
                />
              )}
            </div>
          )}

          {view === 'tracker' && (
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <TrackerView 
                leads={savedLeads} 
                onDelete={handleDeleteLead}
                onUpdateStatus={handleUpdateLeadStatus}
              />
            </div>
          )}
        </div>
      </main>
      <AuthModal />
    </div>
  );
};

export default App;
