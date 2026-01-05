import React from 'react';
import { X, Check, Lock, Shield } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  isUpgrading?: boolean;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade, isUpgrading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-[#0d1117] rounded-3xl border border-slate-700/50 shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Upgrade to Pro</h2>
            <p className="text-slate-400 text-lg">Unlock unlimited searches and advanced features</p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-slate-400 ml-1">/month</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-slate-300">
                  <Check className="w-5 h-5 text-green-500 shrink-0" />
                  <span>10 searches per month</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <Check className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Basic pain point analysis</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <Check className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Community support</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <Check className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Search history (7 days)</span>
                </div>
              </div>

              <button 
                disabled
                className="w-full py-3 px-6 rounded-xl bg-slate-700/50 text-slate-500 font-bold text-sm cursor-not-allowed"
              >
                Current Plan
              </button>
            </div>

            {/* Pro Plan */}
            <div className="relative bg-gradient-to-b from-blue-900/20 to-indigo-900/20 rounded-2xl p-6 border border-blue-500/30 shadow-xl">
              {/* Most Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              </div>

              <div className="text-center mb-6 pt-4">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-white">$10</span>
                  <span className="text-slate-400 ml-1">/month</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-slate-300">
                  <Check className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>Unlimited searches</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <Check className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>Advanced AI analysis</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <Check className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <Check className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>Unlimited search history</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <Check className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>Export results to CSV</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <Check className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>Early access to new features</span>
                </div>
              </div>

              <button 
                onClick={onUpgrade}
                disabled={isUpgrading}
                className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold text-sm transition-all shadow-lg"
              >
                {isUpgrading ? 'Processing...' : 'Upgrade to Pro'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-slate-700/50">
            <div className="flex items-center justify-center space-x-2 text-slate-500 text-sm">
              <Shield className="w-4 h-4" />
              <span>Secure payment powered by Stripe • Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;