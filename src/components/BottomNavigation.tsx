import React from 'react';
import { Search, Bell, User, Download, BarChart2 } from 'lucide-react';

interface BottomNavigationProps {
  currentView: 'home' | 'results';
  hasResults: boolean;
  onNavigateHome: () => void;
  onOpenAlerts: () => void;
  onOpenProfile: () => void;
  onExport?: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentView,
  hasResults,
  onNavigateHome,
  onOpenAlerts,
  onOpenProfile,
  onExport
}) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[90] pb-safe">
      {/* Glass panel background */}
      <div className="bg-[#0A0A0C]/95 backdrop-blur-2xl border-t border-white/10 shadow-2xl">
        <div className="px-2 pt-2 pb-3">
          <div className="flex items-center justify-around">
            {/* Discover/Home */}
            <button
              onClick={onNavigateHome}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[56px] px-3 py-2 rounded-2xl transition-all ${
                currentView === 'home'
                  ? 'bg-violet-600/20 text-violet-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Search className={`w-6 h-6 mb-1 ${currentView === 'home' ? 'text-violet-400' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Discover</span>
            </button>

            {/* Results/Analysis (only show when has results) */}
            {hasResults && (
              <button
                onClick={() => {}}
                className={`flex flex-col items-center justify-center min-w-[64px] min-h-[56px] px-3 py-2 rounded-2xl transition-all ${
                  currentView === 'results'
                    ? 'bg-violet-600/20 text-violet-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <BarChart2 className={`w-6 h-6 mb-1 ${currentView === 'results' ? 'text-violet-400' : ''}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Results</span>
              </button>
            )}

            {/* Export (only show when has results) */}
            {hasResults && onExport && (
              <button
                onClick={onExport}
                className="flex flex-col items-center justify-center min-w-[64px] min-h-[56px] px-3 py-2 rounded-2xl transition-all text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10"
              >
                <Download className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Export</span>
              </button>
            )}

            {/* Alerts */}
            <button
              onClick={onOpenAlerts}
              className="flex flex-col items-center justify-center min-w-[64px] min-h-[56px] px-3 py-2 rounded-2xl transition-all text-slate-400 hover:text-white hover:bg-white/5"
            >
              <Bell className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Alerts</span>
            </button>

            {/* Profile */}
            <button
              onClick={onOpenProfile}
              className="flex flex-col items-center justify-center min-w-[64px] min-h-[56px] px-3 py-2 rounded-2xl transition-all text-slate-400 hover:text-white hover:bg-white/5"
            >
              <User className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Account</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
