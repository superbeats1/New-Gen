import React, { useState, useEffect } from 'react';
import { Lead } from '../types';
import { generateOutreach } from '../geminiService';
import {
  X,
  Zap,
  Copy,
  Check,
  Loader2,
  RotateCcw,
  FileEdit,
  Send,
  Sparkles
} from 'lucide-react';

interface Props {
  lead: Lead;
  onClose: () => void;
}

const OutreachModal: React.FC<Props> = ({ lead, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchOutreach = async () => {
    setLoading(true);
    try {
      const generated = await generateOutreach(lead);
      setMessage(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutreach();
  }, [lead]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-2xl rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] border border-white/10">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-violet-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">AI Outreach Drafter</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-violet-500 blur-xl opacity-20 animate-pulse"></div>
                <Loader2 className="w-12 h-12 text-violet-500 animate-spin relative z-10" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-white font-bold text-lg">Analysis in progress...</p>
                <p className="text-slate-400 text-sm">Identifying key pain points and value props</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-5 bg-violet-500/10 rounded-2xl border border-violet-500/20 flex items-start space-x-4">
                <Zap className="w-5 h-5 text-violet-400 mt-0.5" />
                <div className="text-sm">
                  <span className="text-violet-300 font-bold uppercase tracking-widest text-[10px] block mb-1">Context Analysis</span>
                  <p className="text-slate-300 italic">"Prospect is looking for <span className="text-white font-medium">{lead.requestSummary}</span>. Outreach focused on immediate value delivery."</p>
                </div>
              </div>

              <div className="relative group">
                {isEditing ? (
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-80 bg-black/20 border border-white/10 rounded-2xl p-6 text-slate-200 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none resize-none font-mono text-sm leading-relaxed"
                  />
                ) : (
                  <div className="w-full h-80 bg-black/20 border border-white/10 rounded-2xl p-6 text-slate-200 font-mono text-sm leading-relaxed overflow-y-auto whitespace-pre-wrap">
                    {message}
                  </div>
                )}

                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all backdrop-blur-md"
                    title={isEditing ? "Save" : "Edit"}
                  >
                    <FileEdit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 bg-white text-black hover:bg-slate-200 font-bold py-4 rounded-xl transition-all flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Message'}</span>
                </button>
                <button
                  onClick={fetchOutreach}
                  className="px-6 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl transition-all flex items-center space-x-2 border border-white/5"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutreachModal;
