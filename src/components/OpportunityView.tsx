import React, { useState } from 'react';
import { AnalysisResult, Opportunity } from '../types';
import {
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Quote,
  ArrowRight,
  Download,
  Filter,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
  DollarSign,
  Users,
  Building2,
  Rocket,
  Clock,
  Wallet,
  CheckCircle2,
  XCircle,
  TrendingDown,
  Minus,
  Search,
  Activity
} from 'lucide-react';

interface Props {
  results: AnalysisResult;
  onNewSearch: () => void;
}

const SentimentGauge: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const rotation = (value / 100) * 180 - 90;
  return (
    <div className="relative w-48 h-24 overflow-hidden mb-4">
      <div className="absolute inset-0 border-[12px] border-slate-800 rounded-t-full"></div>
      <div
        className="absolute inset-0 border-[12px] border-violet-500 rounded-t-full transition-all duration-1000 ease-out"
        style={{ clipPath: `polygon(50% 100%, 0% 100%, 0% 0%, ${value}% 0%, ${value}% 100%)` }}
      ></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
        <div className="text-2xl font-black text-white">{value}</div>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{label}</div>
      </div>
      <div
        className="absolute bottom-4 left-1/2 w-1 h-12 bg-white/80 origin-bottom transform transition-transform duration-1000"
        style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
      ></div>
    </div>
  );
};

const OpportunityCard: React.FC<{ opportunity: Opportunity; index: number }> = ({ opportunity, index }) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-400';
    if (score >= 6) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Low': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'High': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className={`group bg-[#050608]/40 backdrop-blur-2xl rounded-[3rem] overflow-hidden transition-all duration-700 border border-white/10 hover:border-violet-500/50 ${isExpanded ? 'shadow-[0_0_80px_rgba(139,92,246,0.15)] ring-1 ring-violet-500/20' : ''} relative`}>
      <div className="absolute -inset-0.5 bg-gradient-to-br from-violet-600/20 via-transparent to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      <div
        className="p-8 lg:p-12 cursor-pointer flex items-start justify-between relative z-10"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-violet-600/20 border border-violet-500/30 px-4 py-1.5 rounded-full flex items-center space-x-2">
              <Zap className="w-3 h-3 text-violet-400 fill-violet-400" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Signal Alpha-{index + 1}</span>
            </div>
            <div className="h-1.5 w-1.5 rounded-full bg-slate-700"></div>
            <span className={`text-[11px] font-black uppercase tracking-widest ${getScoreColor(opportunity.overallScore)}`}>
              Integrity: {opportunity.overallScore * 10}% match
            </span>
          </div>

          <h3 className="text-3xl lg:text-5xl font-black text-white mb-8 leading-[1] tracking-tighter group-hover:text-violet-100 transition-colors">
            {opportunity.problemStatement}
          </h3>

          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col bg-white/[0.03] px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-md">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black mb-1">Market Flux</span>
              <span className={`text-lg font-black ${getScoreColor(opportunity.overallScore)}`}>{opportunity.overallScore}/10</span>
            </div>
            {opportunity.confidenceLevel && (
              <div className="flex flex-col bg-violet-600/10 px-6 py-3 rounded-2xl border border-violet-500/20 backdrop-blur-md">
                <span className="text-[9px] text-violet-400 uppercase tracking-widest font-black mb-1">Confidence</span>
                <span className="text-lg font-black text-white">{opportunity.confidenceLevel}/10</span>
              </div>
            )}
            {opportunity.demandSubMetrics && (
              <div className="flex flex-col bg-white/[0.03] px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-md">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black mb-1">Intensity</span>
                <span className="text-lg font-black text-indigo-400">{opportunity.demandSubMetrics.intensity}/10</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-violet-500/50 transition-all ${isExpanded ? 'bg-violet-600/10' : ''}`}>
            {isExpanded ? <ChevronUp className="w-6 h-6 text-white" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-5 lg:px-8 pb-8 lg:pb-10 border-t border-white/5 pt-6 lg:pt-8 animate-in slide-in-from-top-2 duration-300">
          {opportunity.trendData && (
            <div className="mb-10 p-10 rounded-[2.5rem] bg-gradient-to-br from-violet-600/10 via-indigo-600/5 to-transparent border border-violet-500/20 relative overflow-hidden group/trend">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-600/20 rounded-full blur-[80px]"></div>

              <div className="flex items-center justify-between mb-8">
                <h4 className="text-xs font-black text-violet-400 uppercase tracking-[0.3em]">Neural Trend Analysis</h4>
                <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  <Activity className="w-3 h-3" />
                  <span>Real-time Flux</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
                <div className="space-y-2">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Search Intensity</div>
                  <div className="text-3xl font-black text-white group-hover/trend:text-violet-200 transition-colors uppercase italic tracking-tighter">{opportunity.trendData.searchVolume}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Growth Momentum</div>
                  <div className={`text-3xl font-black flex items-center ${opportunity.trendData.trend === 'rising' ? 'text-emerald-400' : 'text-slate-400'} italic tracking-tighter`}>
                    {opportunity.trendData.growthRate}
                    {opportunity.trendData.trend === 'rising' && <TrendingUp className="w-5 h-5 ml-2" />}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${opportunity.trendData.trend === 'rising' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'}`}>
                    {opportunity.trendData.trend === 'rising' ? 'Protocol: Scaling' : 'Protocol: Stable'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Revenue & Market Overview */}
          {(opportunity.revenueEstimate || opportunity.marketSize) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {opportunity.revenueEstimate && (
                <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem]">
                  <h5 className="flex items-center space-x-2 text-[10px] font-black text-emerald-400 mb-4 uppercase tracking-[0.2em]">
                    <DollarSign className="w-4 h-4" />
                    <span>Neuro-Revenue Potential</span>
                  </h5>
                  <div className="text-3xl font-black text-white mb-2">
                    {opportunity.revenueEstimate.low} - {opportunity.revenueEstimate.high}
                  </div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">{opportunity.revenueEstimate.confidence}</p>
                </div>
              )}
              {opportunity.marketSize && (
                <div className="p-8 bg-violet-500/5 border border-violet-500/10 rounded-[2rem]">
                  <h5 className="flex items-center space-x-2 text-[10px] font-black text-violet-400 mb-4 uppercase tracking-[0.2em]">
                    <BarChart2 className="w-4 h-4" />
                    <span>Market Magnitude</span>
                  </h5>
                  <div className="text-xl font-black text-white uppercase italic">
                    {opportunity.marketSize}
                  </div>
                </div>
              )}
              {opportunity.targetAudience && (
                <div className="p-5 lg:p-6 bg-violet-500/5 border border-violet-500/10 rounded-2xl sm:col-span-2 lg:col-span-1">
                  <h5 className="flex items-center space-x-2 text-[10px] font-bold text-violet-400 mb-3 uppercase tracking-widest">
                    <Users className="w-3 h-3" />
                    <span>Target Audience</span>
                  </h5>
                  <p className="text-sm text-slate-300">
                    {opportunity.targetAudience}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="flex items-center space-x-2 text-xs font-bold text-violet-400 mb-4 uppercase tracking-widest">
                  <Lightbulb className="w-4 h-4" />
                  <span>Why This Matters</span>
                </h4>
                <p className="text-slate-300 text-base leading-relaxed">
                  {opportunity.whyItMatters}
                </p>
              </div>

              {opportunity.validationSources && opportunity.validationSources.length > 0 && (
                <div>
                  <h4 className="flex items-center space-x-2 text-xs font-bold text-emerald-400 mb-4 uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Validation Sources</span>
                  </h4>
                  <div className="space-y-2">
                    {opportunity.validationSources.map((source, i) => (
                      <div key={i} className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-slate-300 text-sm flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{source}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {opportunity.supportingEvidence && opportunity.supportingEvidence.length > 0 && (
                <div>
                  <h4 className="flex items-center space-x-2 text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">
                    <Quote className="w-4 h-4" />
                    <span>Supporting Evidence</span>
                  </h4>
                  <div className="space-y-4">
                    {opportunity.supportingEvidence.map((ev, i) => (
                      <div key={i} className="group/quote relative p-6 bg-white/[0.02] rounded-[2rem] border border-white/5 hover:border-violet-500/30 transition-all">
                        <Quote className="absolute top-4 right-6 w-8 h-8 text-white/5 group-hover/quote:text-violet-500/10 transition-colors" />
                        <p className="text-slate-300 italic mb-4 relative z-10">"{ev.quote}"</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{ev.context}</span>
                          <a
                            href={ev.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-black uppercase tracking-widest text-violet-400 hover:text-violet-300 transition-colors flex items-center"
                          >
                            <span>Source</span>
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!opportunity.supportingEvidence || opportunity.supportingEvidence.length === 0) && (
                <div>
                  <h4 className="flex items-center space-x-2 text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">
                    <Quote className="w-4 h-4" />
                    <span>Market Evidence</span>
                  </h4>
                  <div className="space-y-3">
                    {opportunity.evidence.map((quote, i) => (
                      <div key={i} className="p-4 bg-white/[0.02] rounded-2xl border-l-2 border-violet-500 italic text-slate-400 text-sm">
                        "{quote}"
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {opportunity.existingCompetitors && opportunity.existingCompetitors.length > 0 && (
                <div>
                  <h4 className="flex items-center space-x-2 text-xs font-bold text-amber-400 mb-4 uppercase tracking-widest">
                    <Building2 className="w-4 h-4" />
                    <span>Competition Analysis</span>
                  </h4>
                  <div className="space-y-3">
                    {opportunity.existingCompetitors.map((comp, i) => (
                      <div key={i} className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                        <div className="text-sm font-bold text-white mb-2">{comp}</div>
                        {opportunity.competitorWeaknesses && opportunity.competitorWeaknesses[i] && (
                          <div className="flex items-start space-x-2 text-xs text-slate-400">
                            <XCircle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                            <span>{opportunity.competitorWeaknesses[i]}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {opportunity.monetizationStrategies && opportunity.monetizationStrategies.length > 0 && (
                <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-3xl p-6">
                  <h4 className="flex items-center space-x-2 text-xs font-bold text-indigo-400 mb-4 uppercase tracking-widest">
                    <DollarSign className="w-4 h-4" />
                    <span>Monetization Strategies</span>
                  </h4>
                  <ul className="space-y-3">
                    {opportunity.monetizationStrategies.map((strategy, i) => (
                      <li key={i} className="flex items-start space-x-3 text-slate-300 text-sm">
                        <div className="mt-1 bg-indigo-500/20 p-1 rounded-full">
                          <DollarSign className="w-3 h-3 text-indigo-400" />
                        </div>
                        <span>{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {opportunity.timeToMarket && (
                  <div className="p-4 bg-violet-500/5 border border-violet-500/10 rounded-2xl">
                    <h5 className="flex items-center space-x-2 text-[10px] font-bold text-violet-400 mb-2 uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      <span>Time to Market</span>
                    </h5>
                    <div className="text-sm font-bold text-white">{opportunity.timeToMarket}</div>
                  </div>
                )}
                {opportunity.estimatedStartupCost && (
                  <div className="p-4 bg-violet-500/5 border border-violet-500/10 rounded-2xl">
                    <h5 className="flex items-center space-x-2 text-[10px] font-bold text-violet-400 mb-2 uppercase tracking-widest">
                      <Wallet className="w-3 h-3" />
                      <span>Startup Cost</span>
                    </h5>
                    <div className="text-sm font-bold text-white">{opportunity.estimatedStartupCost}</div>
                  </div>
                )}
              </div>

              <div className="bg-rose-500/5 border border-rose-500/10 rounded-3xl p-6">
                <h4 className="flex items-center space-x-2 text-xs font-bold text-rose-400 mb-3 uppercase tracking-widest">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Potential Risks</span>
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">{opportunity.redFlags}</p>
              </div>

              <div className="bg-violet-600/5 border border-violet-600/10 rounded-3xl p-6">
                <h4 className="flex items-center space-x-2 text-xs font-bold text-violet-400 mb-4 uppercase tracking-widest">
                  <Rocket className="w-4 h-4" />
                  <span>Recommended Next Steps</span>
                </h4>
                <ul className="space-y-3">
                  {opportunity.nextSteps.map((step, i) => (
                    <li key={i} className="flex items-start space-x-3 text-slate-300 text-sm">
                      <div className="mt-1 bg-violet-500/20 p-1 rounded-full">
                        <ArrowRight className="w-3 h-3 text-violet-400" />
                      </div>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OpportunityView: React.FC<Props> = ({ results, onNewSearch }) => {
  return (
    <div className="space-y-6 lg:space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-slate-500 text-xs lg:text-sm mb-2 font-medium">
            <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span className="uppercase tracking-[0.2em] text-[10px] font-black text-emerald-400/80">Analysis Protocol Active</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-4">
            <h2 className="text-4xl lg:text-7xl font-black text-white tracking-tighter uppercase italic">Market Report</h2>
            {results.dateRange && (
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {results.dateRange}
              </span>
            )}
          </div>
          {results.queryInterpretation && (
            <div className="mt-4 p-4 bg-violet-600/5 border border-violet-500/10 rounded-2xl max-w-3xl">
              <span className="text-[9px] font-black text-violet-400 uppercase tracking-widest block mb-1">Intelligence Context</span>
              <p className="text-slate-400 text-sm italic">"{results.queryInterpretation}"</p>
            </div>
          )}
          <div className="flex items-center space-x-6 mt-6">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black mb-1">Sources Scanned</span>
              <span className="text-2xl font-black text-white">{results.totalSourcesAnalyzed || 0}</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black mb-1">Query Resolution</span>
              <span className="text-2xl font-black text-emerald-400">Stable</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black mb-1">Signal Alpha</span>
              <span className="text-2xl font-black text-violet-400">{results.opportunities?.length || 0}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none flex items-center justify-center space-x-3 bg-white/5 hover:bg-white/10 px-8 py-5 rounded-[1.5rem] text-slate-400 transition-all text-[10px] font-black uppercase tracking-widest border border-white/5 group">
            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            <span>Export Intelligence</span>
          </button>
          <button
            onClick={onNewSearch}
            className="flex-1 lg:flex-none flex items-center justify-center space-x-3 bg-violet-600 hover:bg-violet-500 px-10 py-5 rounded-[1.5rem] text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-violet-600/30 group"
          >
            <Target className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>New Neuro-Scan</span>
          </button>
        </div>
      </div>

      {/* Market Pulse Ticker */}
      <div className="w-full h-11 bg-white/[0.02] border-y border-white/5 overflow-hidden flex items-center whitespace-nowrap relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#030407] to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#030407] to-transparent z-10"></div>
        <div className="animate-ticker flex items-center space-x-12 px-12">
          {[1, 2, 3].map(i => (
            <React.Fragment key={i}>
              <span className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <Activity className="w-3 h-3 text-violet-500" />
                <span>Protocol 17.4x Intensity</span>
              </span>
              <span className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span>Global Demand +12.4%</span>
              </span>
              <span className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <Zap className="w-3 h-3 text-amber-500" />
                <span>New Signal Alpha-{Math.floor(Math.random() * 900) + 100}</span>
              </span>
              <span className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <Activity className="w-3 h-3 text-violet-500" />
                <span>Market Maturity: Emerging</span>
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-8 bg-[#050608]/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 group hover:border-violet-500/30 transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">Intelligence Index</span>
          <div className="text-6xl font-black text-white mb-4 italic tracking-tighter">48.2</div>
          <div className="text-[10px] text-emerald-400 font-black uppercase tracking-widest flex items-center bg-emerald-400/10 w-fit px-3 py-1.5 rounded-full border border-emerald-500/20">
            <TrendingUp className="w-3 h-3 mr-2" /> High Efficiency
          </div>
        </div>

        <div className="p-8 bg-[#050608]/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 group hover:border-violet-500/30 transition-all flex flex-col items-center justify-center">
          <SentimentGauge value={results.opportunities?.[0]?.marketSentiment || 72} label="Market Intensity" />
        </div>

        <div className="p-8 bg-[#050608]/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 group hover:border-violet-500/30 transition-all">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">Growth Velocity</span>
          <div className="text-5xl font-black text-white mb-4 italic tracking-tighter">
            {results.opportunities?.[0]?.growthVelocity || 84}%
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-1000"
              style={{ width: `${results.opportunities?.[0]?.growthVelocity || 84}%` }}
            ></div>
          </div>
        </div>

        <div className="p-8 bg-[#050608]/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 group hover:border-violet-500/30 transition-all relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">Protocol State</span>
          <div className="text-4xl font-black text-white mb-4 italic tracking-tighter uppercase italic">Optimized</div>
          <div className="text-[10px] text-violet-400 font-black uppercase tracking-widest bg-violet-400/10 w-fit px-3 py-1.5 rounded-full border border-violet-500/20">
            {results.opportunities?.[0]?.marketMaturity || 'Emerging'} Stage
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <span>Identified Opportunities</span>
          </h3>
          <button className="text-slate-500 hover:text-slate-300 text-sm flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-white/5 transition-all">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
          {results.opportunities?.map((opp, idx) => (
            <OpportunityCard key={opp.id} opportunity={opp} index={idx} />
          ))}
        </div>
      </div>

      {/* Raw Data Section */}
      {results.rawFindings && results.rawFindings.length > 0 && (
        <div className="mt-20 pt-12 border-t border-white/5">
          <div className="flex items-center justify-between mb-8 px-2">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic flex items-center space-x-3">
                <Search className="w-6 h-6 text-violet-500" />
                <span>Raw Neural Findings</span>
              </h3>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-2 font-mono">Archive: {results.totalSourcesAnalyzed} data points processed</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.rawFindings.map((finding) => (
              <div key={finding.id} className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-violet-500/20 transition-all group/find">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${finding.sentiment === 'Positive' ? 'bg-emerald-500/10 text-emerald-400' :
                    finding.sentiment === 'Negative' ? 'bg-rose-500/10 text-rose-400' :
                      'bg-slate-500/10 text-slate-400'
                    }`}>
                    {finding.sentiment}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 tracking-tighter">{finding.date}</span>
                </div>
                <h4 className="text-white font-bold mb-3 line-clamp-2 leading-tight group-hover/find:text-violet-200 transition-colors">{finding.title}</h4>
                <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed mb-6 italic">"{finding.text}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{finding.source}</span>
                  </div>
                  <a href={finding.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityView;
