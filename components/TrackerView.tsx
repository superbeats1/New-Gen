
import React, { useState } from 'react';
import { SavedLead } from '../types';
import { 
  Trash2, 
  ExternalLink, 
  MessageSquare, 
  ChevronDown, 
  Search, 
  Download,
  Calendar,
  LayoutGrid,
  List,
  MoreVertical,
  Briefcase
} from 'lucide-react';

interface Props {
  leads: SavedLead[];
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: any) => void;
}

const TrackerView: React.FC<Props> = ({ leads, onDelete, onUpdateStatus }) => {
  const [filter, setFilter] = useState('');
  
  const filteredLeads = leads.filter(l => 
    l.prospectName.toLowerCase().includes(filter.toLowerCase()) || 
    l.requestSummary.toLowerCase().includes(filter.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Contacted': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'In Discussion': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Won': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Lost': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">My Lead Tracker</h2>
          <p className="text-slate-400 text-sm">Organize and manage your high-intent signals.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Filter your leads..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none w-64"
            />
          </div>
          <button className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-slate-300 transition-all text-sm font-semibold border border-slate-700">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 glass-card rounded-3xl border-dashed border-2 border-slate-800">
          <div className="bg-slate-800/50 p-6 rounded-full">
            <Briefcase className="w-12 h-12 text-slate-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Your tracker is empty</h3>
            <p className="text-slate-500 max-w-sm">Use the Lead Discovery tool to find potential clients and save them here.</p>
          </div>
        </div>
      ) : (
        <div className="bg-[#11131a] rounded-2xl border border-slate-800/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800/50 bg-slate-900/30">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Prospect</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Service / Need</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Added</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs">
                          {lead.prospectName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{lead.prospectName}</div>
                          <div className="text-[10px] text-slate-500 uppercase">{lead.source}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-slate-300 truncate max-w-xs">{lead.requestSummary}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative inline-block">
                        <select 
                          value={lead.status}
                          onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
                          className={`appearance-none text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border transition-all cursor-pointer outline-none ${getStatusColor(lead.status)}`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Discussion">In Discussion</option>
                          <option value="Won">Won</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(lead.savedDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <a 
                          href={lead.sourceUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 hover:bg-slate-700 rounded-lg text-slate-500 hover:text-white transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={() => onDelete(lead.id)}
                          className="p-2 hover:bg-rose-500/20 rounded-lg text-slate-500 hover:text-rose-400 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackerView;
