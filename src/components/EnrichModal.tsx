
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
  Star
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
                {/* Email Address */}
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center justify-between group">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-indigo-400" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-1">
                        <span>Email Address</span>
                        {enrichedLead?.emailConfidence && (
                          <span className="bg-indigo-600/20 text-indigo-400 px-1.5 py-0.5 rounded text-[8px]">
                            {enrichedLead.emailConfidence}%
                          </span>
                        )}
                      </div>
                      <div className="text-slate-200">{enrichedLead?.verifiedEmail || 'Not found'}</div>
                    </div>
                  </div>
                  {enrichedLead?.emailConfidence && enrichedLead.emailConfidence > 90 && (
                    <Shield className="w-4 h-4 text-emerald-500" title="High Confidence" />
                  )}
                </div>

                {/* LinkedIn Profile */}
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center justify-between group">
                  <div className="flex items-center space-x-3">
                    <Linkedin className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">LinkedIn Profile</div>
                      <div className="text-slate-200 truncate max-w-[200px]">
                        {enrichedLead?.socialProfiles?.find(p => p.platform === 'LinkedIn')?.url || 'Generated profile URL'}
                      </div>
                    </div>
                  </div>
                  <a 
                    href={enrichedLead?.socialProfiles?.find(p => p.platform === 'LinkedIn')?.url} 
                    target="_blank" 
                    className="text-slate-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Company Information */}
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center space-x-3">
                  <Building className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Company</div>
                    <div className="text-slate-200">{enrichedLead?.companyData?.name || 'Unknown Company'}</div>
                    {enrichedLead?.companyData?.website && (
                      <div className="text-xs text-slate-500 mt-1">{enrichedLead.companyData.website}</div>
                    )}
                  </div>
                </div>

                {/* Phone Number (if available) */}
                {enrichedLead?.phoneNumber && (
                  <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Phone Number</div>
                      <div className="text-slate-200">{enrichedLead.phoneNumber}</div>
                    </div>
                  </div>
                )}

                {/* Social Profiles */}
                {enrichedLead?.socialProfiles && enrichedLead.socialProfiles.length > 1 && (
                  <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Social Profiles</div>
                    <div className="grid grid-cols-3 gap-2">
                      {enrichedLead.socialProfiles.map((profile, index) => (
                        <a 
                          key={index}
                          href={profile.url} 
                          target="_blank" 
                          className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition-all p-2 hover:bg-slate-800 rounded-lg"
                        >
                          {profile.platform === 'LinkedIn' && <Linkedin className="w-3 h-3" />}
                          {profile.platform === 'Twitter' && <span className="w-3 h-3 text-blue-400">𝕏</span>}
                          {profile.platform === 'GitHub' && <Globe className="w-3 h-3" />}
                          <span>{profile.platform}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enrichment Source */}
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                  <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Enrichment Source</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Data enriched using {enrichedLead?.emailConfidence && enrichedLead.emailConfidence > 80 ? 'Hunter.io API' : 'intelligent pattern matching'} 
                    {enrichedLead?.lastEnriched && (
                      <span className="text-slate-500"> • Updated {new Date(enrichedLead.lastEnriched).toLocaleDateString()}</span>
                    )}
                  </p>
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
