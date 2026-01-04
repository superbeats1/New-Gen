
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
  ChevronUp
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
    <div className={`glass-card rounded-2xl border border-slate-800/50 overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-1 ring-blue-500/30' : 'hover:border-slate-700'}`}>
      <div 
        className="p-6 cursor-pointer flex items-start justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded uppercase">Signal #{index + 1}</span>
            <span className={`text-sm font-semibold ${getScoreColor(opportunity.overallScore)}`}>
              Overall: {opportunity.overallScore}/10
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{opportunity.problemStatement}</h3>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Demand</span>
              <span className={`text-sm font-bold ${getScoreColor(opportunity.demandSignal)}`}>{opportunity.demandSignal}/10</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Readiness</span>
              <span className={`text-sm font-bold ${getScoreColor(opportunity.marketReadiness)}`}>{opportunity.marketReadiness}/10</span>
            </div>
            <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getDifficultyColor(opportunity.entryDifficulty)}`}>
              Entry: {opportunity.entryDifficulty}
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="px-6 pb-8 border-t border-slate-800/50 pt-6 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="flex items-center space-x-2 text-sm font-bold text-blue-400 mb-3 uppercase tracking-widest">
                  <Lightbulb className="w-4 h-4" />
                  <span>Why This Matters</span>
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {opportunity.whyItMatters}
                </p>
              </div>

              <div>
                <h4 className="flex items-center space-x-2 text-sm font-bold text-slate-400 mb-3 uppercase tracking-widest">
                  <Quote className="w-4 h-4" />
                  <span>Supporting Evidence</span>
                </h4>
                <div className="space-y-3">
                  {opportunity.evidence.map((quote, i) => (
                    <div key={i} className="p-3 bg-slate-900/50 rounded-xl border-l-4 border-blue-600 italic text-slate-400 text-sm">
                      "{quote}"
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-4">
                <h4 className="flex items-center space-x-2 text-sm font-bold text-rose-400 mb-2 uppercase tracking-widest">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Red Flags</span>
                </h4>
                <p className="text-slate-400 text-sm">{opportunity.redFlags}</p>
              </div>

              <div className="bg-blue-600/5 border border-blue-600/10 rounded-2xl p-4">
                <h4 className="flex items-center space-x-2 text-sm font-bold text-blue-400 mb-3 uppercase tracking-widest">
                  <TrendingUp className="w-4 h-4" />
                  <span>Next Steps</span>
                </h4>
                <ul className="space-y-2">
                  {opportunity.nextSteps.map((step, i) => (
                    <li key={i} className="flex items-start space-x-2 text-slate-400 text-sm">
                      <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-slate-500 text-sm mb-1 font-medium">
            <span>Query Analysis</span>
            <ArrowRight className="w-3 h-3" />
            <span className="text-blue-400 italic">"{results.query}"</span>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">{results.summary}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-slate-300 transition-all text-sm font-semibold">
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <button 
            onClick={onNewSearch}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white transition-all text-sm font-semibold shadow-lg shadow-blue-900/20"
          >
            <BarChart2 className="w-4 h-4" />
            <span>New Strategy</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 glass-card rounded-2xl border border-slate-800/50">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Total Sources Analyzed</span>
          <div className="text-3xl font-bold text-white">482</div>
          <div className="text-xs text-emerald-500 mt-1 font-medium flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> High relevance
          </div>
        </div>
        <div className="p-6 glass-card rounded-2xl border border-slate-800/50">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Avg. Signal Strength</span>
          <div className="text-3xl font-bold text-white">7.8/10</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">Composite market score</div>
        </div>
        <div className="p-6 glass-card rounded-2xl border border-slate-800/50">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Validation Confidence</span>
          <div className="text-3xl font-bold text-white">High</div>
          <div className="text-xs text-blue-500 mt-1 font-medium">92% Data consistency</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <span>Top Opportunities</span>
          </h3>
          <button className="text-slate-500 hover:text-slate-300 text-sm flex items-center space-x-1">
            <Filter className="w-4 h-4" />
            <span>Filter Results</span>
          </button>
        </div>
        {results.opportunities?.map((opp, idx) => (
          <OpportunityCard key={opp.id} opportunity={opp} index={idx} />
        ))}
      </div>
    </div>
  );
};

export default OpportunityView;
