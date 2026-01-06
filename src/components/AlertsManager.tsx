import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Alert } from '../types';
import { alertsService } from '../services/alertsService';

interface AlertsManagerProps {
    userId: string;
    isOpen: boolean;
    onClose: () => void;
}

export const AlertsManager: React.FC<AlertsManagerProps> = ({ userId, isOpen, onClose }) => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [newKeyword, setNewKeyword] = useState('');
    const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadAlerts();
        }
    }, [isOpen, userId]);

    const loadAlerts = async () => {
        setLoading(true);
        try {
            const data = await alertsService.getAlerts(userId);
            setAlerts(data);
        } catch (error) {
            console.error('Failed to load alerts', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAlert = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKeyword.trim()) return;

        setAdding(true);
        try {
            const alert = await alertsService.createAlert(userId, newKeyword, frequency);
            setAlerts([alert, ...alerts]);
            setNewKeyword('');
        } catch (error) {
            console.error('Failed to create alert', error);
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteAlert = async (id: string) => {
        try {
            await alertsService.deleteAlert(id);
            setAlerts(alerts.filter(a => a.id !== id));
        } catch (error) {
            console.error('Failed to delete alert', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div
                className="relative w-full max-w-2xl bg-[#050507] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500"></div>

                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                            <Bell className="w-6 h-6 text-violet-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">Opportunity Alerts</h2>
                            <p className="text-slate-400 text-sm">Monitor markets for new signals automatically.</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <AlertCircle className="w-6 h-6 rotate-45" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">

                    {/* Add New Alert */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/5">
                        <form onSubmit={handleAddAlert} className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                    Monitor Keyword
                                </label>
                                <input
                                    type="text"
                                    value={newKeyword}
                                    onChange={(e) => setNewKeyword(e.target.value)}
                                    placeholder="e.g. 'SaaS Pricing Models' or 'Remote Work Tools'"
                                    className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder-slate-600"
                                />
                            </div>
                            <div className="w-40">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                    Frequency
                                </label>
                                <select
                                    value={frequency}
                                    onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly')}
                                    className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="daily">Daily Scan</option>
                                    <option value="weekly">Weekly Report</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled={!newKeyword.trim() || adding}
                                    className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-violet-600/20 flex items-center space-x-2"
                                >
                                    {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                    <span>Add Alert</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Alerts List */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Active Monitors</h3>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                            </div>
                        ) : alerts.length === 0 ? (
                            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                                <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400 font-medium">No active alerts</p>
                                <p className="text-slate-600 text-sm mt-1">Add a keyword above to start tracking opportunities.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {alerts.map((alert) => (
                                    <div key={alert.id} className="group flex items-center justify-between p-4 glass-card rounded-xl border border-white/5 hover:border-violet-500/30 transition-all">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20">
                                                <CheckCircle className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold">{alert.keyword}</h4>
                                                <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                                                    <span className="flex items-center space-x-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span className="capitalize">{alert.frequency}</span>
                                                    </span>
                                                    <span>•</span>
                                                    <span>Create {new Date(alert.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDeleteAlert(alert.id)}
                                            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
