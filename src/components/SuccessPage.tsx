import React, { useEffect, useState } from 'react';
import { CheckCircle, Crown, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SuccessPageProps {
  onContinue: () => void;
  userId?: string;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onContinue, userId }) => {
  const [isUpgrading, setIsUpgrading] = useState(true);
  const [upgradeComplete, setUpgradeComplete] = useState(false);

  useEffect(() => {
    const upgradeUser = async () => {
      if (!userId) {
        setIsUpgrading(false);
        return;
      }

      try {
        // Wait a moment for Stripe webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Update user to Pro status
        const { error } = await supabase
          .from('profiles')
          .update({
            is_pro: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) {
          console.error('Error upgrading user:', error);
        }

        setUpgradeComplete(true);
      } catch (error) {
        console.error('Upgrade error:', error);
      } finally {
        setIsUpgrading(false);
      }
    };

    upgradeUser();
  }, [userId]);

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-[#11131a] rounded-3xl p-8 border border-green-500/30 shadow-2xl text-center">
          <div className="mb-6">
            {isUpgrading ? (
              <div className="relative">
                <div className="absolute -inset-4 bg-green-600/20 blur-2xl rounded-full animate-pulse"></div>
                <div className="relative bg-slate-900/80 p-4 rounded-3xl border border-green-500/20">
                  <Loader2 className="w-16 h-16 text-green-500 animate-spin mx-auto" />
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute -inset-4 bg-green-600/20 blur-2xl rounded-full"></div>
                <div className="relative bg-slate-900/80 p-4 rounded-3xl border border-green-500/20">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Crown className="w-6 h-6 text-amber-400" />
              <h1 className="text-2xl font-bold text-white">
                {isUpgrading ? 'Activating Pro...' : 'Welcome to Scopa AI Pro!'}
              </h1>
            </div>

            <p className="text-slate-400">
              {isUpgrading
                ? 'Setting up your unlimited access...'
                : 'Your payment was successful and your account has been upgraded!'
              }
            </p>

            <div className="bg-slate-800/50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Plan:</span>
                <span className="text-amber-400 font-bold">Scopa AI Pro</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Credits:</span>
                <span className="text-green-400 font-bold">Unlimited</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">AI Scans:</span>
                <span className="text-green-400 font-bold">No Limits</span>
              </div>
            </div>

            {!isUpgrading && (
              <button
                onClick={onContinue}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;