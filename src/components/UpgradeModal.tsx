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
      <div className="glass-panel relative w-full max-w-4xl rounded-[2.5rem] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[100px] rounded-full"></div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-2 text-slate-400 hover:text-white transition-colors z-10 hover:bg-white/5 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-10 relative z-10">
          {/* Header */}
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-4xl font-bold text-white tracking-tight">Upgrade your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Intelligence</span></h2>
            <p className="text-slate-400 text-lg">Unlock unlimited neural discovery and premium data enrichment.</p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white/5 rounded-3xl p-8 border border-white/5 flex flex-col hover:bg-white/[0.07] transition-colors relative group">
              <div className="mb-6">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Starter</div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-slate-500 ml-2 font-medium">/month</span>
                </div>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="bg-slate-800 p-1 rounded-full"><Check className="w-3 h-3 text-slate-400" /></div>
                  <span className="text-sm">10 Searches / Month</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="bg-slate-800 p-1 rounded-full"><Check className="w-3 h-3 text-slate-400" /></div>
                  <span className="text-sm">Basic signal detection</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="bg-slate-800 p-1 rounded-full"><Check className="w-3 h-3 text-slate-400" /></div>
                  <span className="text-sm">Standard community support</span>
                </div>
              </div>

              <button
                disabled
                className="w-full py-4 text-slate-500 font-bold text-sm bg-white/5 rounded-2xl cursor-not-allowed border border-white/5"
              >
                Current Plan
              </button>
            </div>

            {/* Pro Plan */}
            <div className="glass-card rounded-3xl p-1 relative border border-violet-500/30">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg shadow-violet-500/30 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-yellow-300" />
                <span>Recommended</span>
              </div>

              <div className="bg-[#0f1116]/80 backdrop-blur-md rounded-[1.4rem] p-7 h-full flex flex-col">
                <div className="mb-6">
                  <div className="text-sm font-bold text-violet-400 uppercase tracking-widest mb-2">Pro</div>
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-white">$10</span>
                    <span className="text-slate-500 ml-2 font-medium">/month</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center space-x-3 text-white">
                    <div className="bg-violet-600 p-1 rounded-full"><Check className="w-3 h-3 text-white" /></div>
                    <span className="text-sm font-medium">Unlimited Searches</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white">
                    <div className="bg-violet-600 p-1 rounded-full"><Check className="w-3 h-3 text-white" /></div>
                    <span className="text-sm font-medium">Advanced AI Models (More accurate)</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white">
                    <div className="bg-violet-600 p-1 rounded-full"><Check className="w-3 h-3 text-white" /></div>
                    <span className="text-sm font-medium">Priority Enrichment Data</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white">
                    <div className="bg-violet-600 p-1 rounded-full"><Check className="w-3 h-3 text-white" /></div>
                    <span className="text-sm font-medium">Unlimited Export to CSV</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white">
                    <div className="bg-violet-600 p-1 rounded-full"><Check className="w-3 h-3 text-white" /></div>
                    <span className="text-sm font-medium">Early Access to Agents</span>
                  </div>
                </div>

                <button
                  onClick={onUpgrade}
                  disabled={isUpgrading}
                  className="w-full py-4 bg-white text-black hover:bg-slate-200 font-bold text-sm rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center space-x-2"
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

          {/* Footer */}
          <div className="text-center mt-10 pt-6 border-t border-white/5">
            <div className="flex items-center justify-center space-x-2 text-slate-500 text-xs font-medium">
              <Shield className="w-3 h-3" />
              <span>Secure payment via Stripe • 14-day money back guarantee • Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;