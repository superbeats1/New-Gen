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
  Search
} from 'lucide-react';

interface Props {
  results: AnalysisResult;
  onNewSearch: () => void;
}

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
    <div className={`group bg-[#050608]/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden transition-all duration-500 border border-white/5 hover:border-violet-500/30 ${isExpanded ? 'shadow-[0_0_50px_rgba(139,92,246,0.1)]' : ''}`}>
      <div
        className="p-6 lg:p-10 cursor-pointer flex items-start justify-between relative"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent"></div>
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-[10px] font-black bg-violet-600 text-white px-3 py-1 rounded-full uppercase tracking-widest italic">Signal #{index + 1}</span>
            <div className="h-1 w-1 rounded-full bg-slate-700"></div>
            <span className={`text-xs font-black uppercase tracking-widest ${getScoreColor(opportunity.overallScore)}`}>
              Inertia: {opportunity.overallScore}/10
            </span>
          </div>
          <h3 className="text-2xl lg:text-4xl font-black text-white mb-6 leading-[1.1] tracking-tighter">{opportunity.problemStatement}</h3>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Demand/Flux</span>
              <span className={`text-sm font-black ${getScoreColor(opportunity.demandSignal)}`}>{opportunity.demandSignal}/10</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Market State</span>
              <span className={`text-sm font-black ${getScoreColor(opportunity.marketReadiness)}`}>{opportunity.marketReadiness}/10</span>
            </div>
          </div>
        </div>
        <button className="p-2 lg:p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 transition-all ml-2 lg:ml-4 flex-shrink-0">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="px-5 lg:px-8 pb-8 lg:pb-10 border-t border-white/5 pt-6 lg:pt-8 animate-in slide-in-from-top-2 duration-300">
          {/* Trend Data Banner */}
          {opportunity.trendData && (
            <div className="mb-10 p-6 lg:p-8 rounded-[2rem] bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-transparent border border-violet-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-[60px] translate-x-1/3 -translate-y-1/3"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500/20 p-3 rounded-xl">
                    <Search className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Search Volume</div>
                    <div className="text-lg font-bold text-white">{opportunity.trendData.searchVolume}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${opportunity.trendData.trend === 'rising' ? 'bg-emerald-500/20' :
                    opportunity.trendData.trend === 'declining' ? 'bg-rose-500/20' : 'bg-slate-500/20'
                    }`}>
                    {opportunity.trendData.trend === 'rising' ? <TrendingUp className="w-6 h-6 text-emerald-400" /> :
                      opportunity.trendData.trend === 'declining' ? <TrendingDown className="w-6 h-6 text-rose-400" /> :
                        <Minus className="w-6 h-6 text-slate-400" />}
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Growth Rate</div>
                    <div className={`text-lg font-bold ${opportunity.trendData.trend === 'rising' ? 'text-emerald-400' :
                      opportunity.trendData.trend === 'declining' ? 'text-rose-400' : 'text-slate-400'
                      }`}>
                      {opportunity.trendData.growthRate}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${opportunity.trendData.trend === 'rising' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    opportunity.trendData.trend === 'declining' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                    }`}>
                    {opportunity.trendData.trend === 'rising' ? '📈 Rising Trend' :
                      opportunity.trendData.trend === 'declining' ? '📉 Declining' : '➡️ Stable'}
                  </div>
                </div>
              </div>
              {opportunity.trendData.relatedQueries && opportunity.trendData.relatedQueries.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Related Searches</div>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.trendData.relatedQueries.map((query, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-300 border border-white/10">
                        {query}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
                <div className="p-5 lg:p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl sm:col-span-2 lg:col-span-1">
                  <h5 className="flex items-center space-x-2 text-[10px] font-bold text-blue-400 mb-3 uppercase tracking-widest">
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
                <h4 className="flex items-center space-x-2 text-xs font-bold text-blue-400 mb-4 uppercase tracking-widest">
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

              <div>
                <h4 className="flex items-center space-x-2 text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">
                  <Quote className="w-4 h-4" />
                  <span>Market Evidence</span>
                </h4>
                <div className="space-y-3">
                  {opportunity.evidence.map((quote, i) => (
                    <div key={i} className="p-4 bg-white/[0.02] rounded-2xl border-l-2 border-blue-500 italic text-slate-400 text-sm">
                      "{quote}"
                    </div>
                  ))}
                </div>
              </div>

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
                  <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                    <h5 className="flex items-center space-x-2 text-[10px] font-bold text-blue-400 mb-2 uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      <span>Time to Market</span>
                    </h5>
                    <div className="text-sm font-bold text-white">{opportunity.timeToMarket}</div>
                  </div>
                )}
                {opportunity.estimatedStartupCost && (
                  <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                    <h5 className="flex items-center space-x-2 text-[10px] font-bold text-blue-400 mb-2 uppercase tracking-widest">
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

              <div className="bg-blue-600/5 border border-blue-600/10 rounded-3xl p-6">
                <h4 className="flex items-center space-x-2 text-xs font-bold text-blue-400 mb-4 uppercase tracking-widest">
                  <Rocket className="w-4 h-4" />
                  <span>Recommended Next Steps</span>
                </h4>
                <ul className="space-y-3">
                  {opportunity.nextSteps.map((step, i) => (
                    <li key={i} className="flex items-start space-x-3 text-slate-300 text-sm">
                      <div className="mt-1 bg-blue-500/20 p-1 rounded-full">
                        <ArrowRight className="w-3 h-3 text-blue-400" />
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
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Analysis Complete</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-3">
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Market Report</h2>
            <span className="text-slate-500 text-xs lg:text-sm font-medium">for "{results.query}"</span>
          </div>
          <p className="text-slate-400 text-xs lg:text-sm max-w-2xl mt-2">{results.summary}</p>
        </div>
        <div className="flex items-center space-x-3 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none flex items-center justify-center space-x-3 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-2xl text-slate-300 transition-all text-xs font-black uppercase tracking-widest border border-white/5">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
          <button
            onClick={onNewSearch}
            className="flex-1 lg:flex-none flex items-center justify-center space-x-3 bg-violet-600 hover:bg-violet-500 px-8 py-4 rounded-2xl text-white transition-all text-xs font-black uppercase tracking-widest shadow-xl shadow-violet-900/30"
          >
            <Target className="w-4 h-4" />
            <span>New Discovery</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-8 bg-[#050608]/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 group hover:border-violet-500/30 transition-all">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">Intelligence Points</span>
          <div className="text-5xl font-black text-white mb-4 italic tracking-tighter">482</div>
          <div className="text-[10px] text-emerald-400 font-black uppercase tracking-widest flex items-center bg-emerald-400/10 w-fit px-3 py-1.5 rounded-full border border-emerald-500/20">
            <TrendingUp className="w-3 h-3 mr-2" /> High Confidence
          </div>
        </div>
        <div className="p-8 bg-[#050608]/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 group hover:border-violet-500/30 transition-all">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">Discovery Strength</span>
          <div className="text-5xl font-black text-white mb-4 italic tracking-tighter">7.8</div>
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">/ 10.0 Analysis Score</div>
        </div>
        <div className="p-8 bg-[#050608]/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 group hover:border-violet-500/30 transition-all sm:col-span-2 lg:col-span-1">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">Protocol Status</span>
          <div className="text-5xl font-black text-white mb-4 italic tracking-tighter">Active</div>
          <div className="text-[10px] text-violet-400 font-black uppercase tracking-widest bg-violet-400/10 w-fit px-3 py-1.5 rounded-full border border-violet-500/20">
            92% Consensus
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
    </div>
  );
};

export default OpportunityView;
