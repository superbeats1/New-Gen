import React, { useState, useEffect } from 'react';
import { Lead, EnrichedLead } from '../types';
import { enrichLead } from '../services/enrichmentService';
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
  ExternalLink,
  Phone,
  Shield,
  Star,
  Users
} from 'lucide-react';

interface Props {
  lead: Lead;
  onClose: () => void;
}

const EnrichModal: React.FC<Props> = ({ lead, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [enrichedLead, setEnrichedLead] = useState<EnrichedLead | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enriched = await enrichLead(lead);
        setEnrichedLead(enriched);
      } catch (err) {
        console.error('Enrichment failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [lead]);

  const copyToClipboard = () => {
    const text = `Name: ${lead.prospectName}
Email: ${enrichedLead?.verifiedEmail || 'Not found'}
Company: ${enrichedLead?.companyData?.name || 'Unknown'}
LinkedIn: ${enrichedLead?.socialProfiles?.find(p => p.platform === 'LinkedIn')?.url || 'Not found'}
Phone: ${enrichedLead?.phoneNumber || 'Not found'}
Domain: ${enrichedLead?.companyData?.domain || 'Unknown'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-lg rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 border border-white/10">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-500/20 p-2 rounded-xl border border-indigo-500/20">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Profile Enrichment</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse"></div>
                <Loader2 className="w-10 h-10 text-indigo-400 animate-spin relative z-10" />
              </div>
              <p className="text-slate-400 font-medium">Querying public databases...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center space-x-5 pb-6 border-b border-white/5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 flex items-center justify-center text-3xl font-bold text-white shadow-inner border border-white/10">
                  {lead.prospectName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white tracking-tight">{lead.prospectName}</h4>
                  <p className="text-slate-500 text-sm font-medium flex items-center space-x-2">
                    <span>@{lead.username}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    <span className="capitalize">{lead.source}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Email Address */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="bg-indigo-500/10 p-2 rounded-lg">
                      <Mail className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest flex items-center space-x-2 mb-1">
                        <span>Email Address</span>
                        {enrichedLead?.emailConfidence && (
                          <span className="bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded text-[8px] border border-indigo-500/20">
                            {enrichedLead.emailConfidence}% Verified
                          </span>
                        )}
                      </div>
                      <div className="text-white font-medium">{enrichedLead?.verifiedEmail || 'Not public'}</div>
                    </div>
                  </div>
                  {enrichedLead?.emailConfidence && enrichedLead.emailConfidence > 90 && (
                    <Shield className="w-4 h-4 text-emerald-400" title="High Confidence" />
                  )}
                </div>

                {/* LinkedIn Profile */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-500/10 p-2 rounded-lg">
                      <Linkedin className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">LinkedIn</div>
                      <div className="text-white font-medium truncate max-w-[200px] text-sm opacity-80">
                        {enrichedLead?.socialProfiles?.find(p => p.platform === 'LinkedIn')?.url || 'Profile not found'}
                      </div>
                    </div>
                  </div>
                  <a
                    href={enrichedLead?.socialProfiles?.find(p => p.platform === 'LinkedIn')?.url}
                    target="_blank"
                    className="text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Company Information */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center space-x-4 group hover:bg-white/10 transition-colors">
                  <div className="bg-emerald-500/10 p-2 rounded-lg">
                    <Building className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest mb-1">Company</div>
                    <div className="text-white font-medium">{enrichedLead?.companyData?.name || 'Self-Employed / Unknown'}</div>
                    {enrichedLead?.companyData?.website && (
                      <div className="text-xs text-slate-500 mt-0.5">{enrichedLead.companyData.website}</div>
                    )}
                  </div>
                </div>

                {/* Enrichment Source */}
                <div className="p-4 rounded-2xl border border-dashed border-slate-700/50 flex items-start space-x-3">
                  <Star className="w-4 h-4 text-slate-500 mt-0.5" />
                  <div className="text-xs text-slate-500 leading-relaxed">
                    Data enriched via {enrichedLead?.emailConfidence && enrichedLead.emailConfidence > 80 ? 'Signal Network Nodes' : 'public pattern matching'}.
                    {enrichedLead?.lastEnriched && (
                      <span> Last sync: {new Date(enrichedLead.lastEnriched).toLocaleDateString()}.</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 bg-white text-black hover:bg-slate-200 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy Data'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-xl transition-all border border-white/5"
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
