
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#11131a] border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600/20 p-2 rounded-xl">
              <Sparkles className="w-5 h-5 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-white">AI Outreach Generator</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
              <div className="text-center">
                <p className="text-white font-bold text-lg">Writing personalized draft...</p>
                <p className="text-slate-500 text-sm">Analyzing pain points and urgency signals</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 flex items-start space-x-3">
                <Zap className="w-5 h-5 text-indigo-400 mt-1" />
                <div className="text-sm">
                  <span className="text-indigo-400 font-bold uppercase tracking-widest text-[10px] block mb-1">Lead Context</span>
                  <p className="text-slate-300 italic">"Seeking {lead.requestSummary}..."</p>
                </div>
              </div>

              <div className="relative">
                {isEditing ? (
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-80 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none font-mono text-sm leading-relaxed"
                  />
                ) : (
                  <div className="w-full h-80 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-300 font-mono text-sm leading-relaxed overflow-y-auto whitespace-pre-wrap">
                    {message}
                  </div>
                )}
                
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all"
                  >
                    <FileEdit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <button 
                  onClick={copyToClipboard}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-3 shadow-xl shadow-indigo-900/20"
                >
                  {copied ? <Check className="w-6 h-6 text-emerald-300" /> : <Send className="w-6 h-6" />}
                  <span>{copied ? 'Message Copied!' : 'Copy to Clipboard'}</span>
                </button>
                <button 
                  onClick={fetchOutreach}
                  className="px-6 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center space-x-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Regenerate</span>
                </button>
              </div>
              
              <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                Tip: Adjust tone in settings for different lead types
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutreachModal;
