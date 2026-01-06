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
    <div className={`glass-card rounded-3xl overflow-hidden transition-all duration-300 ${isExpanded ? 'border-violet-500/30 shadow-[0_0_30px_rgba(124,58,237,0.1)]' : 'hover:border-white/10'}`}>
      <div
        className="p-8 cursor-pointer flex items-start justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-[10px] font-bold bg-violet-600 text-white px-2 py-0.5 rounded uppercase tracking-wider">Signal #{index + 1}</span>
            <span className={`text-sm font-bold ${getScoreColor(opportunity.overallScore)}`}>
              Score: {opportunity.overallScore}/10
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{opportunity.problemStatement}</h3>

          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center space-x-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Demand</span>
              <span className={`text-sm font-bold ${getScoreColor(opportunity.demandSignal)}`}>{opportunity.demandSignal}/10</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Readiness</span>
              <span className={`text-sm font-bold ${getScoreColor(opportunity.marketReadiness)}`}>{opportunity.marketReadiness}/10</span>
            </div>
            <div className={`px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getDifficultyColor(opportunity.entryDifficulty)}`}>
              Entry: {opportunity.entryDifficulty}
            </div>
          </div>
        </div>
        <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 transition-all ml-4">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="px-8 pb-10 border-t border-white/5 pt-8 animate-in slide-in-from-top-2 duration-300">
          {/* Trend Data Banner */}
          {opportunity.trendData && (
            <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-violet-500/20 p-3 rounded-xl">
                    <Search className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Search Volume</div>
                    <div className="text-lg font-bold text-white">{opportunity.trendData.searchVolume}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${
                    opportunity.trendData.trend === 'rising' ? 'bg-emerald-500/20' :
                    opportunity.trendData.trend === 'declining' ? 'bg-rose-500/20' : 'bg-slate-500/20'
                  }`}>
                    {opportunity.trendData.trend === 'rising' ? <TrendingUp className="w-6 h-6 text-emerald-400" /> :
                     opportunity.trendData.trend === 'declining' ? <TrendingDown className="w-6 h-6 text-rose-400" /> :
                     <Minus className="w-6 h-6 text-slate-400" />}
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Growth Rate</div>
                    <div className={`text-lg font-bold ${
                      opportunity.trendData.trend === 'rising' ? 'text-emerald-400' :
                      opportunity.trendData.trend === 'declining' ? 'text-rose-400' : 'text-slate-400'
                    }`}>
                      {opportunity.trendData.growthRate}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
                    opportunity.trendData.trend === 'rising' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {opportunity.revenueEstimate && (
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                  <h5 className="flex items-center space-x-2 text-[10px] font-bold text-emerald-400 mb-3 uppercase tracking-widest">
                    <DollarSign className="w-3 h-3" />
                    <span>Revenue Potential (Year 1)</span>
                  </h5>
                  <div className="text-2xl font-bold text-white mb-2">
                    {opportunity.revenueEstimate.low} - {opportunity.revenueEstimate.high}
                  </div>
                  <p className="text-xs text-slate-400">{opportunity.revenueEstimate.confidence}</p>
                </div>
              )}
              {opportunity.marketSize && (
                <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                  <h5 className="flex items-center space-x-2 text-[10px] font-bold text-blue-400 mb-3 uppercase tracking-widest">
                    <BarChart2 className="w-3 h-3" />
                    <span>Market Size</span>
                  </h5>
                  <div className="text-lg font-bold text-white">
                    {opportunity.marketSize}
                  </div>
                </div>
              )}
              {opportunity.targetAudience && (
                <div className="p-6 bg-violet-500/5 border border-violet-500/10 rounded-2xl">
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
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-slate-500 text-sm mb-2 font-medium">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Analysis Complete</span>
          </div>
          <div className="flex items-baseline space-x-3">
            <h2 className="text-3xl font-bold text-white">Market Report</h2>
            <span className="text-slate-500 text-sm font-medium">for "{results.query}"</span>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl mt-2">{results.summary}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-xl text-slate-300 transition-all text-sm font-semibold border border-white/5">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={onNewSearch}
            className="flex items-center space-x-2 bg-violet-600 hover:bg-violet-500 px-5 py-2.5 rounded-xl text-white transition-all text-sm font-semibold shadow-lg shadow-violet-900/20"
          >
            <Target className="w-4 h-4" />
            <span>New Search</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 glass-card rounded-3xl group hover:border-violet-500/30">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2 block">Data Points</span>
          <div className="text-4xl font-bold text-white mb-2">482</div>
          <div className="text-xs text-emerald-400 font-medium flex items-center bg-emerald-400/10 w-fit px-2 py-1 rounded">
            <TrendingUp className="w-3 h-3 mr-1" /> High Confidence
          </div>
        </div>
        <div className="p-8 glass-card rounded-3xl group hover:border-violet-500/30">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2 block">Signal Strength</span>
          <div className="text-4xl font-bold text-white mb-2">7.8</div>
          <div className="text-xs text-slate-400 font-medium">/ 10.0 Composite Score</div>
        </div>
        <div className="p-8 glass-card rounded-3xl group hover:border-violet-500/30">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2 block">Market Status</span>
          <div className="text-4xl font-bold text-white mb-2">Valid</div>
          <div className="text-xs text-violet-400 font-medium bg-violet-400/10 w-fit px-2 py-1 rounded">
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
