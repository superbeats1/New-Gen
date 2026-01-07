import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Zap, Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';

export const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        if (!firstName || !lastName) {
          throw new Error('Please enter both your first and last name.');
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-500 p-4 rounded-2xl shadow-xl shadow-blue-600/30 mb-6 transform hover:scale-105 transition-transform duration-500">
          <Zap className="w-10 h-10 text-white fill-white" />
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Signal</h1>
        <p className="text-slate-400 font-medium text-lg">Market Intelligence Protocol</p>
      </div>

      <div className="glass-card p-1 rounded-3xl relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="bg-[#050507]/90 p-8 rounded-[1.8rem] relative">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            {isSignUp ? 'Join the Network' : 'Welcome Back'}
          </h2>

          <form onSubmit={handleAuth} className="space-y-5">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">First Name</label>
                  <div className="relative group/input">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
                    <input
                      type="text"
                      required
                      placeholder="Jane"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Last Name</label>
                  <div className="relative group/input">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
                    <input
                      type="text"
                      required
                      placeholder="Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
              <div className="relative group/input">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Password</label>
              <div className="relative group/input">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-medium flex items-center space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div><span>{error}</span></div>}

            <button
              disabled={loading}
              className="w-full bg-white text-black hover:bg-slate-200 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-white/5 flex items-center justify-center space-x-2 mt-4 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-slate-500 hover:text-white text-sm font-medium transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
