import React from 'react';
import { X, Check, Lock, Shield, Sparkles, Zap } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  isUpgrading?: boolean;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade, isUpgrading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="glass-panel relative w-full max-w-4xl rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Decorative background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[100px] rounded-full"></div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 text-slate-400 hover:text-white transition-colors z-20 hover:bg-white/5 rounded-full"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain relative z-10">
          <div className="p-6 sm:p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-10 space-y-2 sm:space-y-3 pt-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Upgrade your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Intelligence</span>
              </h2>
              <p className="text-slate-400 text-sm sm:text-base md:text-lg">Unlock unlimited neural discovery and premium data enrichment.</p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-6">
              {/* Free Plan */}
              <div className="bg-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-white/5 flex flex-col hover:bg-white/[0.07] transition-colors">
                <div className="mb-4 sm:mb-6">
                  <div className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Starter</div>
                  <div className="flex items-baseline">
                    <span className="text-3xl sm:text-4xl font-bold text-white">$0</span>
                    <span className="text-slate-500 ml-2 font-medium text-sm">/month</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-start space-x-3 text-slate-300">
                    <div className="bg-slate-800 p-1 rounded-full flex-shrink-0 mt-0.5"><Check className="w-3 h-3 text-slate-400" /></div>
                    <span className="text-xs sm:text-sm leading-tight">10 Searches / Month</span>
                  </div>
                  <div className="flex items-start space-x-3 text-slate-300">
                    <div className="bg-slate-800 p-1 rounded-full flex-shrink-0 mt-0.5"><Check className="w-3 h-3 text-slate-400" /></div>
                    <span className="text-xs sm:text-sm leading-tight">Basic signal detection</span>
                  </div>
                  <div className="flex items-start space-x-3 text-slate-300">
                    <div className="bg-slate-800 p-1 rounded-full flex-shrink-0 mt-0.5"><Check className="w-3 h-3 text-slate-400" /></div>
                    <span className="text-xs sm:text-sm leading-tight">Standard community support</span>
                  </div>
                </div>

                <button
                  disabled
                  className="w-full py-3 sm:py-4 text-slate-500 font-bold text-xs sm:text-sm bg-white/5 rounded-xl sm:rounded-2xl cursor-not-allowed border border-white/5"
                >
                  Current Plan
                </button>
              </div>

              {/* Pro Plan */}
              <div className="relative pt-6">
                {/* Recommended Badge - FIXED POSITIONING */}
                <div className="absolute -top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg shadow-blue-500/30 flex items-center space-x-1 z-10">
                  <Sparkles className="w-3 h-3 text-yellow-300" />
                  <span>Recommended</span>
                </div>

                <div className="glass-card rounded-2xl sm:rounded-3xl p-1 border border-blue-500/30 h-full">
                  <div className="bg-[#0f1116]/80 backdrop-blur-md rounded-[1.2rem] sm:rounded-[1.4rem] p-5 sm:p-6 md:p-7 h-full flex flex-col">
                    <div className="mb-4 sm:mb-6">
                      <div className="text-xs sm:text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">Pro</div>
                      <div className="flex items-baseline">
                        <span className="text-4xl sm:text-5xl font-bold text-white">$10</span>
                        <span className="text-slate-500 ml-2 font-medium text-sm">/month</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6 flex-1">
                      <div className="flex items-start space-x-3 text-white">
                        <div className="bg-blue-600 p-1 rounded-full flex-shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                        <span className="text-xs sm:text-sm font-medium leading-tight">Unlimited Searches</span>
                      </div>
                      <div className="flex items-start space-x-3 text-white">
                        <div className="bg-blue-600 p-1 rounded-full flex-shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                        <span className="text-xs sm:text-sm font-medium leading-tight">Advanced AI Models (More accurate)</span>
                      </div>
                      <div className="flex items-start space-x-3 text-white">
                        <div className="bg-blue-600 p-1 rounded-full flex-shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                        <span className="text-xs sm:text-sm font-medium leading-tight">Priority Enrichment Data</span>
                      </div>
                      <div className="flex items-start space-x-3 text-white">
                        <div className="bg-blue-600 p-1 rounded-full flex-shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                        <span className="text-xs sm:text-sm font-medium leading-tight">Unlimited Export to CSV</span>
                      </div>
                      <div className="flex items-start space-x-3 text-white">
                        <div className="bg-blue-600 p-1 rounded-full flex-shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                        <span className="text-xs sm:text-sm font-medium leading-tight">Early Access to Agents</span>
                      </div>
                    </div>

                    <button
                      onClick={onUpgrade}
                      disabled={isUpgrading}
                      className="w-full py-3 sm:py-4 bg-white text-black hover:bg-slate-200 font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpgrading ? <span className="animate-pulse">Processing...</span> : (
                        <>
                          <span>Upgrade Now</span>
                          <Zap className="w-4 h-4 fill-black" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 sm:pt-6 border-t border-white/5">
              <div className="flex items-center justify-center space-x-2 text-slate-500 text-[10px] sm:text-xs font-medium">
                <Shield className="w-3 h-3 flex-shrink-0" />
                <span className="text-center">Secure payment via Stripe • 14-day money back • Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;