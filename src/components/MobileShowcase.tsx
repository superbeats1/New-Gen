import React from 'react';
import {
    Activity,
    Bell,
    Fingerprint,
    Target,
    Wifi,
    Zap,
    TrendingUp,
    Radar
} from 'lucide-react';

const MobileShowcase: React.FC = () => {
    return (
        <section className="relative py-16 sm:py-24 px-4 sm:px-8 overflow-hidden bg-gradient-to-b from-blue-900/5 to-transparent">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto">
                {/* Content Section - Full Width on Mobile */}
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Left Side: Content */}
                    <div className="w-full lg:flex-1 z-10">
                        <div className="flex justify-center lg:justify-start mb-6">
                            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full">
                                <Zap className="w-4 h-4 text-violet-400" />
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-violet-400">Intelligence on the Go</span>
                            </div>
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tighter uppercase italic text-center lg:text-left">
                            Market Analysis <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">In Your Pocket</span>
                        </h2>

                        <p className="text-slate-400 text-sm sm:text-base md:text-lg lg:text-xl font-medium max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed text-center lg:text-left">
                            Stay connected to your market shadows wherever you are. Receive neural alerts for high-value business gaps the moment they emerge.
                        </p>

                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                            <div className="flex items-center space-x-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center border border-violet-500/20 italic font-black text-violet-400 flex-shrink-0">01</div>
                                <span className="text-sm font-bold text-slate-300">Shadow Sync</span>
                            </div>
                            <div className="flex items-center space-x-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center border border-violet-500/20 italic font-black text-violet-400 flex-shrink-0">02</div>
                                <span className="text-sm font-bold text-slate-300">Pulse Alerts</span>
                            </div>
                            <div className="flex items-center space-x-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 italic font-black text-emerald-400 flex-shrink-0">03</div>
                                <span className="text-sm font-bold text-slate-300">Alpha Reports</span>
                            </div>
                            <div className="flex items-center space-x-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 italic font-black text-emerald-400 flex-shrink-0">04</div>
                                <span className="text-sm font-bold text-slate-300">Neural Ranking</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: 3D Phones - Hidden on Mobile, Shown on Large Screens */}
                    <div className="hidden lg:flex flex-1 relative w-full h-[600px] items-center justify-center perspective-[2000px]">
                    {/* Background floating elements */}
                    <div className="absolute top-10 right-20 w-16 h-16 bg-violet-600/20 blur-2xl rounded-full animate-pulse"></div>
                    <div className="absolute bottom-10 left-20 w-24 h-24 bg-indigo-600/20 blur-3xl rounded-full animate-pulse delay-700"></div>

                    {/* Phone 1 (Back) - Market Shadows */}
                    <div className="absolute transform -translate-x-[15%] md:-translate-x-[20%] translate-y-[5%] rotate-y-[25deg] rotate-x-12 hover:rotate-y-[15deg] transition-transform duration-1000">
                        <div className="w-[240px] md:w-[280px] h-[500px] md:h-[580px] bg-[#0d0e12] rounded-[3rem] md:rounded-[3.5rem] border-[6px] md:border-[8px] border-[#1a1b22] relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
                            {/* Screen Content */}
                            <div className="absolute inset-0 p-6 md:p-8 pt-12 md:pt-16 space-y-6 md:space-y-8 text-left">
                                <div className="flex justify-between items-center mb-6 md:mb-10">
                                    <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                                        <Activity className="w-4 h-4 text-violet-400" />
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-slate-800" />
                                </div>

                                <div className="space-y-2">
                                    <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Market Shadows</div>
                                    <h3 className="text-xl md:text-2xl font-black text-white leading-tight italic uppercase tracking-tighter">Active <br />Monitors.</h3>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { label: 'Reddit Monitoring', color: 'text-orange-400', bg: 'bg-orange-500/10' },
                                        { label: 'Twitter Signals', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                                        { label: 'HN Intelligence', color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4 overflow-hidden relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${item.bg} flex items-center justify-center border border-white/10`}>
                                                <Wifi className={`w-5 h-5 md:w-6 md:h-6 ${item.color}`} />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className={`text-[8px] font-black uppercase tracking-wider ${item.color}`}>{item.label}</div>
                                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full w-2/3 bg-current animate-pulse-glow" style={{ color: 'inherit' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto pt-4 md:pt-8 border-t border-white/5 text-center">
                                    <span className="text-[10px] font-black italic text-slate-500 tracking-widest">Neural Scopa Protocol v2.19</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Phone 2 (Front) - Opportunity Alert */}
                    <div className="absolute transform translate-x-[15%] md:translate-x-[20%] -translate-y-[5%] -rotate-y-[15deg] rotate-x-6 hover:rotate-y-[0deg] transition-transform duration-1000 z-10">
                        <div className="w-[240px] md:w-[280px] h-[500px] md:h-[580px] bg-[#0a0b0f] rounded-[3rem] md:rounded-[3.5rem] border-[6px] md:border-[8px] border-[#1a1b22] relative overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.9)] group">
                            {/* Glow Effects */}
                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-emerald-500/20 via-violet-600/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>

                            {/* Screen Content */}
                            <div className="absolute inset-0 p-6 md:p-8 pt-12 md:pt-16 flex flex-col text-center">
                                <div className="flex items-center justify-between mb-8 md:mb-12">
                                    <div className="w-10 h-1 bg-white/20 rounded-full translate-x-12" />
                                    <Wifi className="w-4 h-4 text-slate-500" />
                                </div>

                                <div className="space-y-1 md:space-y-2 mb-6 md:mb-10">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-2">
                                        <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                                        <span className="text-[8px] font-black text-emerald-400 tracking-[0.2em] uppercase">Neural Match</span>
                                    </div>
                                    <div className="text-3xl md:text-5xl font-black text-white italic tracking-tighter">$9.2K<span className="text-xl text-slate-500"> /mo</span></div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Predicted Revenue</div>
                                </div>

                                {/* Animated Rings (Opportunity Pulse) */}
                                <div className="relative h-32 md:h-40 flex items-center justify-center mb-6 md:mb-10">
                                    <div className="absolute w-32 h-32 md:w-40 md:h-40 border-2 border-emerald-500/20 rounded-full animate-ping-slow"></div>
                                    <div className="absolute w-24 h-24 md:w-32 md:h-32 border border-violet-500/30 rounded-full animate-ping-slow [animation-delay:-0.5s]"></div>
                                    <div className="absolute w-16 h-16 md:w-24 md:h-24 border border-violet-500/40 rounded-full animate-ping-slow [animation-delay:-1s]"></div>

                                    <div className="relative w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-emerald-600 to-violet-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-600/40">
                                        <Target className="w-6 h-6 md:w-8 md:h-8 text-white animate-pulse" />
                                    </div>
                                </div>

                                <div className="space-y-2 md:space-y-4 mb-4 md:mb-8 text-left">
                                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 backdrop-blur-md">
                                        <div className="text-[8px] font-black text-violet-400 uppercase mb-1">SIGNAL IDENTIFIED</div>
                                        <div className="text-xs font-bold text-white leading-relaxed line-clamp-2">
                                            "Desperate need for context-aware LLM devtools..."
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <div className="w-full py-3 bg-gradient-to-r from-emerald-600 to-violet-600 rounded-2xl shadow-lg shadow-emerald-600/20 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:scale-105 transition-transform cursor-pointer">
                                        Analysis Report
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Glow Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30 animate-scanning-line"></div>
                        </div>
                    </div>
                </div>

                {/* Mobile-Only Phone Mockup - Centered & Beautiful */}
                <div className="lg:hidden mt-12 flex justify-center">
                    <div className="relative w-full max-w-[320px]">
                        {/* Glow effect */}
                        <div className="absolute -inset-4 bg-gradient-to-b from-violet-600/20 to-emerald-600/20 blur-3xl rounded-full"></div>

                        {/* Phone Frame */}
                        <div className="relative w-full h-[600px] bg-[#0a0b0f] rounded-[3rem] border-[8px] border-[#1a1b22] overflow-hidden shadow-2xl">
                            {/* Glow Effects */}
                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-emerald-500/20 via-violet-600/10 to-transparent opacity-50"></div>

                            {/* Screen Content */}
                            <div className="absolute inset-0 p-8 pt-16 flex flex-col text-center">
                                {/* Status Bar */}
                                <div className="flex items-center justify-between mb-12">
                                    <div className="w-10 h-1 bg-white/20 rounded-full translate-x-12" />
                                    <Wifi className="w-4 h-4 text-slate-500" />
                                </div>

                                {/* Revenue Badge */}
                                <div className="space-y-2 mb-10">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-2">
                                        <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                                        <span className="text-[8px] font-black text-emerald-400 tracking-[0.2em] uppercase">Neural Match</span>
                                    </div>
                                    <div className="text-5xl font-black text-white italic tracking-tighter">$9.2K<span className="text-xl text-slate-500"> /mo</span></div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Predicted Revenue</div>
                                </div>

                                {/* Animated Rings */}
                                <div className="relative h-40 flex items-center justify-center mb-10">
                                    <div className="absolute w-40 h-40 border-2 border-emerald-500/20 rounded-full animate-ping-slow"></div>
                                    <div className="absolute w-32 h-32 border border-violet-500/30 rounded-full animate-ping-slow" style={{ animationDelay: '-0.5s' }}></div>
                                    <div className="absolute w-24 h-24 border border-violet-500/40 rounded-full animate-ping-slow" style={{ animationDelay: '-1s' }}></div>

                                    <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-600 to-violet-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-600/40">
                                        <Target className="w-8 h-8 text-white animate-pulse" />
                                    </div>
                                </div>

                                {/* Signal Box */}
                                <div className="space-y-4 mb-8 text-left">
                                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 backdrop-blur-md">
                                        <div className="text-[8px] font-black text-violet-400 uppercase mb-1">SIGNAL IDENTIFIED</div>
                                        <div className="text-xs font-bold text-white leading-relaxed">
                                            "Desperate need for context-aware LLM devtools..."
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <div className="mt-auto">
                                    <div className="w-full py-3 bg-gradient-to-r from-emerald-600 to-violet-600 rounded-2xl shadow-lg shadow-emerald-600/20 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                                        Analysis Report
                                    </div>
                                </div>
                            </div>

                            {/* Scanning Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30 animate-scanning-line"></div>
                        </div>
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
                    animation: scan 4s ease-in-out infinite;
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
