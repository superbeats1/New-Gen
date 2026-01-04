
import React, { useState, useEffect } from 'react';
import { Lead } from '../types';
import { enrichContact } from '../geminiService';
import { 
  X, 
  Mail, 
  Linkedin, 
  Building, 
  Activity, 
  Copy, 
  Check, 
  Loader2,
  Globe,
  ExternalLink
} from 'lucide-react';

interface Props {
  lead: Lead;
  onClose: () => void;
}

const EnrichModal: React.FC<Props> = ({ lead, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enriched = await enrichContact(lead);
        setData(enriched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [lead]);

  const copyToClipboard = () => {
    const text = `Name: ${lead.prospectName}\nEmail: ${data?.email}\nLinkedIn: ${data?.linkedIn}\nCompany: ${data?.company}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#11131a] border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600/20 p-2 rounded-xl">
              <Activity className="w-5 h-5 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-white">Contact Enrichment</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              <p className="text-slate-400 font-medium">Scouring public records...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 pb-6 border-b border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-3xl font-bold text-white">
                  {lead.prospectName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{lead.prospectName}</h4>
                  <p className="text-slate-500 text-sm">@{lead.username} • {lead.source}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center justify-between group">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-indigo-400" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</div>
                      <div className="text-slate-200">{data?.email || 'Not found'}</div>
                    </div>
                  </div>
                  <button className="text-slate-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center justify-between group">
                  <div className="flex items-center space-x-3">
                    <Linkedin className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">LinkedIn Profile</div>
                      <div className="text-slate-200 truncate max-w-[200px]">{data?.linkedIn || 'Not found'}</div>
                    </div>
                  </div>
                  <a href={data?.linkedIn} target="_blank" className="text-slate-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center space-x-3">
                  <Building className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Company / Role</div>
                    <div className="text-slate-200">{data?.company || 'Freelance / Unknown'}</div>
                  </div>
                </div>

                <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                  <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center space-x-1">
                    <Globe className="w-3 h-3" />
                    <span>Recent Intent Signal</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{data?.recentActivity}</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={copyToClipboard}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center space-x-2"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                  <span>{copied ? 'Copied' : 'Copy All Data'}</span>
                </button>
                <button 
                  onClick={onClose}
                  className="px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrichModal;
