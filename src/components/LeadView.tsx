import React, { useState } from 'react';
import { AnalysisResult, Lead } from '../types';
import {
  Users,
  Search,
  MapPin,
  Clock,
  ExternalLink,
  UserPlus,
  MessageSquare,
  Bookmark,
  Filter,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Briefcase,
  Zap,
  Globe,
  Sparkles
} from 'lucide-react';
import OutreachModal from './OutreachModal';
import EnrichModal from './EnrichModal';

interface Props {
  results: AnalysisResult;
  onSave: (lead: Lead) => void;
  onGoTracker: () => void;
  onRefresh?: () => void;
}

const LeadView: React.FC<Props> = ({ results, onSave, onGoTracker, onRefresh }) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [enrichLead, setEnrichLead] = useState<Lead | null>(null);
  const [outreachLead, setOutreachLead] = useState<Lead | null>(null);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'text-rose-400';
      case 'Medium': return 'text-amber-400';
      case 'Low': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  const getBudgetDisplay = (lead: Lead) => {
    if (lead.budgetAmount) return lead.budgetAmount;
    switch (lead.budget) {
      case 'High': return '$$$';
      case 'Medium': return '$$';
      case 'Low': return '$';
      default: return '?';
    }
  };

  const handleSourceClick = (sourceUrl: any, source: any, prospectName: any) => {
    // Check if valid URL
    if (!sourceUrl || sourceUrl.includes('undefined')) {
      alert("This is a demo/AI enriched lead. In production, this would link to the live post.");
      return;
    }
    window.open(sourceUrl, '_blank');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-slate-500 text-sm mb-2 font-medium">
            <Globe className="w-4 h-4 text-violet-400" />
            <span>Active Scans</span>
          </div>
          <div className="flex items-baseline space-x-3">
            <h2 className="text-3xl font-bold text-white">Lead Report</h2>
            <span className="text-slate-500 text-sm font-medium">for "{results.query}"</span>
          </div>

          <div className="flex items-center space-x-4 mt-3">
            {results.leads && (
              <div className="flex items-center space-x-2">
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wide font-bold">
                  {results.leads.filter(lead => !lead.notes?.includes('AI-generated')).length} Live Verified
                </span>
                {results.leads.filter(lead => lead.notes?.includes('AI-generated')).length > 0 && (
                  <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wide font-bold">
                    {results.leads.filter(lead => lead.notes?.includes('AI-generated')).length} AI Enriched
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onGoTracker}
            className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-slate-300 transition-all text-sm font-medium border border-white/5"
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Leads</span>
          </button>
          <button
            onClick={onRefresh}
            disabled={!onRefresh}
            className="flex items-center space-x-2 bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-xl text-white transition-all text-sm font-bold shadow-lg shadow-violet-900/20 disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Feed</span>
          </button>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
        <div className="px-8 py-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Found {results.leads?.length} Matches</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            <span>Updated just now</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-slate-400">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Fit Score</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Prospect</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest w-1/3">Need</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Value</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {results.leads?.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="24" cy="24" r="20" stroke="#334155" strokeWidth="3" fill="transparent" />
                        <circle
                          cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent"
                          strokeDasharray={2 * Math.PI * 20}
                          strokeDashoffset={2 * Math.PI * 20 * (1 - lead.fitScore / 10)}
                          className={lead.fitScore > 7 ? "text-emerald-400" : "text-violet-400"}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-xs font-bold text-white">{lead.fitScore}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-400 border border-white/5">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white mb-0.5 flex items-center space-x-2">
                          <span className="line-clamp-1 max-w-[140px]" title={lead.prospectName}>{lead.prospectName}</span>
                          {/* Badge */}
                          {lead.notes?.includes('AI-generated') && (
                            <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-slate-400 font-medium whitespace-nowrap">
                            {lead.source}
                          </span>
                          <span className="text-[10px] text-slate-500 whitespace-nowrap">{lead.postedAt}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-2" title={lead.requestSummary}>
                      {lead.requestSummary}
                    </p>
                    {lead.location && (
                      <div className="flex items-center space-x-1 mt-2 text-[10px] text-slate-500 font-medium uppercase tracking-wide">
                        <MapPin className="w-3 h-3" />
                        <span>{lead.location}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-slate-500 w-14">Budget:</span>
                        <div className={`font-bold px-2 py-0.5 rounded text-[11px] ${lead.budget === 'Unknown' && !lead.budgetAmount
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-emerald-400/10 text-emerald-400'
                          }`}>
                          {lead.budgetAmount ? lead.budgetAmount :
                            lead.budget === 'High' ? '$$$' :
                              lead.budget === 'Medium' ? '$$' :
                                lead.budget === 'Low' ? '$' : 'N/A'}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-slate-500 w-14">Urgency:</span>
                        <span className={`font-bold ${getUrgencyColor(lead.urgency)}`}>{lead.urgency}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-60 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => setEnrichLead(lead)}
                        className="p-2 hover:bg-violet-500/20 rounded-lg text-slate-400 hover:text-violet-300 transition-all"
                        title="Enrich Data"
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setOutreachLead(lead)}
                        className="p-2 hover:bg-violet-500/20 rounded-lg text-slate-400 hover:text-violet-300 transition-all"
                        title="Draft Outreach"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onSave(lead)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-all border border-white/5"
                        title="Save Lead"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <a
                        href={lead.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all inline-flex items-center justify-center"
                        title="Open Source"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {enrichLead && <EnrichModal lead={enrichLead} onClose={() => setEnrichLead(null)} />}
      {outreachLead && <OutreachModal lead={outreachLead} onClose={() => setOutreachLead(null)} />}
    </div>
  );
};

export default LeadView;
