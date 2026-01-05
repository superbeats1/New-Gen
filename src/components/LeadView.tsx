
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
  Zap
} from 'lucide-react';
import OutreachModal from './OutreachModal';
import EnrichModal from './EnrichModal';

interface Props {
  results: AnalysisResult;
  onSave: (lead: Lead) => void;
  onGoTracker: () => void;
}

const LeadView: React.FC<Props> = ({ results, onSave, onGoTracker }) => {
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

  const getBudgetIcon = (budget: string) => {
    switch (budget) {
      case 'High': return '$$$';
      case 'Medium': return '$$';
      case 'Low': return '$';
      default: return '?';
    }
  };

  const getBudgetDisplay = (lead: Lead) => {
    // If we have a specific budget amount, show that
    if (lead.budgetAmount) {
      return lead.budgetAmount;
    }
    // Otherwise fall back to dollar signs
    return getBudgetIcon(lead.budget);
  };

  const handleSourceClick = (sourceUrl: string, source: string, prospectName: string) => {
    console.log('Attempting to open URL:', { sourceUrl, source, prospectName });
    
    // Check if URL is valid and not a demo URL
    if (!sourceUrl || typeof sourceUrl !== 'string') {
      console.warn('No valid sourceUrl provided:', sourceUrl);
      alert(`This is a demo lead from ${source}. In a real implementation, this would link to the original ${source} profile/post by ${prospectName}.`);
      return;
    }

    // Check for demo URLs and patterns
    const demoUrls = [
      'https://example.com/post',
      'https://linkedin.com/in/johndoe',
      'https://linkedin.com/in/realistic-profile'
    ];

    const isDemoPattern = demoUrls.includes(sourceUrl) || 
                         sourceUrl.includes('activity-demo-') ||
                         sourceUrl.includes('realistic-profile') ||
                         !sourceUrl.startsWith('http');

    if (isDemoPattern) {
      alert(`This is an enhanced lead from ${source}. The AI generated this realistic example to supplement live data. Real leads will have working links to actual platform posts.`);
      return;
    }

    try {
      // Validate URL before opening
      const url = new URL(sourceUrl);
      
      // Handle platform-specific URLs (including Reddit and HackerNews)
      const platformDomains = [
        'reddit.com', 'news.ycombinator.com', 'github.com',
        'linkedin.com', 'facebook.com', 'upwork.com', 'fiverr.com', 
        '99designs.com', 'behance.net', 'angel.co',
        'indiehackers.com', 'producthunt.com', 'discord.gg'
      ];
      
      const isPlatform = platformDomains.some(domain => url.hostname.includes(domain));
      
      if (isPlatform) {
        console.log('Opening trusted platform URL:', sourceUrl);
        window.open(sourceUrl, '_blank', 'noopener,noreferrer');
      } else {
        // For unknown domains, show a warning
        const proceed = confirm(`This link will take you to ${url.hostname}. Continue?`);
        if (proceed) {
          window.open(sourceUrl, '_blank', 'noopener,noreferrer');
        }
      }
    } catch (error) {
      console.error('URL validation failed:', error, 'URL was:', sourceUrl);
      alert(`Invalid link for ${prospectName}. This appears to be a demo lead with a mock URL.`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-slate-500 text-sm mb-1 font-medium">
            <span>Finding Leads for</span>
            <span className="text-indigo-400 italic">"{results.query}"</span>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-slate-400 text-sm max-w-2xl">{results.summary}</p>
            {results.leads && (
              <div className="flex items-center space-x-2">
                <span className="text-[8px] bg-emerald-600/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase tracking-wide">
                  {results.leads.filter(lead => !lead.notes?.includes('AI-generated')).length} Live
                </span>
                {results.leads.filter(lead => lead.notes?.includes('AI-generated')).length > 0 && (
                  <span className="text-[8px] bg-indigo-600/20 text-indigo-400 px-1.5 py-0.5 rounded uppercase tracking-wide">
                    {results.leads.filter(lead => lead.notes?.includes('AI-generated')).length} Enhanced
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={onGoTracker}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-slate-300 transition-all text-sm font-semibold border border-slate-700"
          >
            <Bookmark className="w-4 h-4" />
            <span>My Tracker</span>
          </button>
          <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-white transition-all text-sm font-semibold shadow-lg shadow-indigo-900/20">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh All</span>
          </button>
        </div>
      </div>

      <div className="bg-[#11131a] rounded-2xl border border-slate-800/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-800/20 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sort:</span>
              <button className="text-sm font-semibold text-slate-300 hover:text-white flex items-center space-x-1">
                <span>Fit Score</span>
                <Filter className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            <span>Auto-refreshing every 60m</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/50 bg-slate-900/30">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fit</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Prospect / Source</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Request Summary</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Budget / Urgency</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {results.leads?.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-6">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-800" />
                        <circle 
                          cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" 
                          strokeDasharray={2 * Math.PI * 20}
                          strokeDashoffset={2 * Math.PI * 20 * (1 - lead.fitScore / 10)}
                          className="text-indigo-500" 
                        />
                      </svg>
                      <span className="absolute text-xs font-bold text-white">{lead.fitScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-all">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white mb-0.5 flex items-center space-x-2">
                          <span>{lead.prospectName}</span>
                          {lead.notes?.includes('AI-generated') ? (
                            <span className="text-[8px] bg-indigo-600/20 text-indigo-400 px-1.5 py-0.5 rounded uppercase tracking-wide">
                              Enhanced
                            </span>
                          ) : (
                            <span className="text-[8px] bg-emerald-600/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase tracking-wide">
                              Live
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">{lead.source}</span>
                          <span className="text-[10px] text-slate-500">{lead.postedAt}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm text-slate-300 max-w-md line-clamp-2">
                      {lead.requestSummary}
                    </p>
                    {lead.location && (
                      <div className="flex items-center space-x-1 mt-1 text-[10px] text-slate-500">
                        <MapPin className="w-3 h-3" />
                        <span>{lead.location}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2 text-xs">
                        <DollarSign className="w-3 h-3 text-emerald-400" />
                        <span className="text-slate-400 font-medium">Budget:</span>
                        <span className="text-emerald-400 font-bold">{getBudgetDisplay(lead)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span className="text-slate-400 font-medium">Urgency:</span>
                        <span className={`font-bold ${getUrgencyColor(lead.urgency)}`}>{lead.urgency}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEnrichLead(lead)}
                        className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all border border-transparent hover:border-slate-600"
                        title="Enrich Contact"
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setOutreachLead(lead)}
                        className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all border border-transparent hover:border-slate-600"
                        title="Generate Outreach"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onSave(lead)}
                        className="p-2 hover:bg-indigo-600 rounded-lg text-slate-400 hover:text-white transition-all border border-transparent"
                        title="Add to Tracker"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleSourceClick(lead.sourceUrl || '', lead.source || 'Unknown', lead.prospectName || 'Anonymous')}
                        className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all border border-transparent hover:border-slate-600"
                        title="View Original Post"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
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
