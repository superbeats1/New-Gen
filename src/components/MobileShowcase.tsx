import React from 'react';
import {
    Bell,
    Shield,
    Target,
    Zap,
    ArrowUpRight,
    BarChart3,
    Fingerprint,
    Wifi
} from 'lucide-react';

const MobileShowcase: React.FC = () => {
    return (
        <section className="relative py-24 px-8 overflow-hidden bg-gradient-to-b from-blue-900/5 to-transparent">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
                {/* Left Side: Content */}
                <div className="flex-1 text-center lg:text-left z-10">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-8">
                        <Zap className="w-4 h-4 text-violet-400" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-violet-400">Mobile Intelligence</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tighter uppercase italic text-left">
                        Market Analysis <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">In Your Pocket</span>
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl mb-10 leading-relaxed text-left">
                        Stay connected to your market shadows wherever you are. High-fidelity intelligence and neural alerts, re-imagined for the mobile experience.
                    </p>

                    <div className="grid grid-cols-2 gap-6 max-w-md mx-auto lg:mx-0">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 italic font-black text-violet-400">01</div>
                            <span className="text-sm font-bold text-slate-300">Real-time Sync</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 italic font-black text-violet-400">02</div>
                            <span className="text-sm font-bold text-slate-300">Pulse Alerts</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 italic font-black text-emerald-400">03</div>
                            <span className="text-sm font-bold text-slate-300">Alpha Reports</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 italic font-black text-emerald-400">04</div>
                            <span className="text-sm font-bold text-slate-300">Biometric Secure</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: 3D Phones */}
                <div className="flex-1 relative w-full h-[500px] md:h-[600px] flex items-center justify-center perspective-[2000px] scale-90 md:scale-100 mt-12 lg:mt-0">
                    {/* Background floating elements */}
                    <div className="absolute top-10 right-20 w-16 h-16 bg-violet-600/20 blur-2xl rounded-full animate-pulse"></div>
                    <div className="absolute bottom-10 left-20 w-24 h-24 bg-indigo-600/20 blur-3xl rounded-full animate-pulse delay-700"></div>

                    {/* Phone 1 (Back) */}
                    <div className="absolute transform -translate-x-[15%] md:-translate-x-[20%] translate-y-[5%] rotate-y-[25deg] rotate-x-12 hover:rotate-y-[15deg] transition-transform duration-1000">
                        <div className="w-[240px] md:w-[280px] h-[500px] md:h-[580px] bg-[#0d0e12] rounded-[3rem] md:rounded-[3.5rem] border-[6px] md:border-[8px] border-[#1a1b22] relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
                            {/* Screen Content */}
                            <div className="absolute inset-0 p-6 md:p-8 pt-12 md:pt-16 space-y-6 md:space-y-8 text-left">
                                <div className="flex justify-between items-center mb-6 md:mb-10">
                                    <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                                        <Bell className="w-4 h-4 text-violet-400" />
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-slate-800" />
                                </div>

                                <div className="space-y-2">
                                    <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Neural Protocol</div>
                                    <h3 className="text-xl md:text-2xl font-black text-white leading-tight">Protocol v2.19<br />Now Active.</h3>
                                </div>

                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                                                <Target className="w-5 h-5 md:w-6 md:h-6 text-violet-400" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="h-2 w-16 bg-slate-700 rounded-full" />
                                                <div className="h-3 w-full bg-slate-800 rounded-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto pt-4 md:pt-8 border-t border-white/5">
                                    <div className="flex items-center justify-center p-3 md:p-4 bg-violet-600 rounded-xl md:rounded-2xl shadow-lg shadow-violet-600/20">
                                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white">Unlock Intelligence</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Phone 2 (Front) */}
                    <div className="absolute transform translate-x-[15%] md:translate-x-[20%] -translate-y-[5%] -rotate-y-[15deg] rotate-x-6 hover:rotate-y-[0deg] transition-transform duration-1000 z-10">
                        <div className="w-[240px] md:w-[280px] h-[500px] md:h-[580px] bg-[#0a0b0f] rounded-[3rem] md:rounded-[3.5rem] border-[6px] md:border-[8px] border-[#1a1b22] relative overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.9)] group">
                            {/* Glow Effects */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-violet-600/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>

                            {/* Screen Content */}
                            <div className="absolute inset-0 p-6 md:p-8 pt-12 md:pt-16 flex flex-col text-center">
                                <div className="flex items-center justify-between mb-8 md:mb-12">
                                    <div className="w-10 h-1 bg-white/20 rounded-full translate-x-12" />
                                    <Wifi className="w-4 h-4 text-slate-500" />
                                </div>

                                <div className="space-y-1 md:space-y-2 mb-6 md:mb-10">
                                    <div className="text-[10px] font-black text-emerald-400 tracking-[0.3em] uppercase">Market Alert</div>
                                    <div className="text-3xl md:text-4xl font-black text-white italic">$735<span className="text-xl text-slate-500">.43</span></div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Estimated Revenue Gap</div>
                                </div>

                                {/* Animated Rings (NFC Ripple) */}
                                <div className="relative h-32 md:h-40 flex items-center justify-center mb-6 md:mb-10">
                                    <div className="absolute w-32 h-32 md:w-40 md:h-40 border border-violet-500/20 rounded-full animate-ping-slow"></div>
                                    <div className="absolute w-24 h-24 md:w-32 md:h-32 border border-violet-500/30 rounded-full animate-ping-slow [animation-delay:-0.5s]"></div>
                                    <div className="absolute w-16 h-16 md:w-24 md:h-24 border border-violet-500/40 rounded-full animate-ping-slow [animation-delay:-1s]"></div>

                                    <div className="relative w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-violet-600/40">
                                        <Fingerprint className="w-6 h-6 md:w-8 md:h-8 text-white animate-pulse" />
                                    </div>
                                </div>

                                <div className="space-y-2 md:space-y-4 mb-4 md:mb-8">
                                    <div className="text-xs md:text-sm font-bold text-slate-400 leading-relaxed px-2 md:px-4">
                                        Place your device near <br />
                                        an active signal to scan...
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <div className="inline-block px-4 md:px-6 py-2 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:border-white/20 transition-colors cursor-pointer">
                                        Cancel Protocol
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Glow Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-30 animate-scanning-line"></div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .perspective-[2000px] {
                    perspective: 2000px;
                }
                .rotate-y-[25deg] {
                    transform: rotateY(25deg);
                }
                .rotate-x-12 {
                    transform: rotateX(12deg);
                }
                .rotate-x-6 {
                    transform: rotateX(6deg);
                }
                .animate-ping-slow {
                    animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                @keyframes ping-slow {
                    75%, 100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
                .animate-scanning-line {
                    animation: scan 3s ease-in-out infinite;
                }
                @keyframes scan {
                    0%, 100% { transform: translateY(0); opacity: 0; }
                    50% { transform: translateY(580px); opacity: 0.5; }
                }
            `}</style>
        </section>
    );
};

export default MobileShowcase;
