import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Clock, CheckCircle, AlertCircle, Loader2, Zap, TrendingUp } from 'lucide-react';
import { Alert } from '../types';
import { alertsService } from '../services/alertsService';
import { showSuccess, showError } from '../lib/toast';
import { AlertHistoryPanel } from './AlertHistoryPanel';

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
    const [isLocalMode, setIsLocalMode] = useState(false);
    const [activeTab, setActiveTab] = useState<'manage' | 'history'>('manage');

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
            setIsLocalMode(false);
        } catch (error) {
            console.error('Failed to load alerts', error);
            setIsLocalMode(true);
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
            showSuccess('Alert deleted successfully');
        } catch (error) {
            console.error('Failed to delete alert', error);
            showError('Failed to delete alert');
        }
    };

    const handleToggleAlert = async (id: string, currentEnabled: boolean) => {
        try {
            await alertsService.toggleAlert(id, !currentEnabled);
            setAlerts(alerts.map(a => a.id === id ? { ...a, enabled: !currentEnabled } : a));
            showSuccess(`Alert ${!currentEnabled ? 'enabled' : 'paused'}`);
        } catch (error) {
            console.error('Failed to toggle alert', error);
            showError('Failed to update alert');
        }
    };

    if (!isOpen || !userId) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div
                className="relative w-full max-w-2xl bg-[#050507] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-fuchsia-500 to-blue-500"></div>

                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-br from-violet-600/5 to-transparent">
                    <div className="flex items-center space-x-5">
                        <div className="w-14 h-14 rounded-2xl bg-violet-600/20 flex items-center justify-center border border-violet-500/30 shadow-lg shadow-violet-600/10 transition-transform hover:scale-105">
                            <Bell className="w-7 h-7 text-violet-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Neural Protocol</h2>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Autonomous Market Shadowing</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {isLocalMode && (
                            <div className="px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center space-x-2 animate-in slide-in-from-right-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                                <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest leading-none">Local Protocol</span>
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="p-3 hover:bg-white/5 rounded-2xl transition-all text-slate-500 hover:text-white border border-transparent hover:border-white/10"
                        >
                            <AlertCircle className="w-6 h-6 rotate-45" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/5">
                    <button
                        onClick={() => setActiveTab('manage')}
                        className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${
                            activeTab === 'manage'
                                ? 'text-violet-400 border-b-2 border-violet-500 bg-violet-500/5'
                                : 'text-slate-500 hover:text-slate-400 hover:bg-white/[0.02]'
                        }`}
                    >
                        Manage Alerts
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${
                            activeTab === 'history'
                                ? 'text-violet-400 border-b-2 border-violet-500 bg-violet-500/5'
                                : 'text-slate-500 hover:text-slate-400 hover:bg-white/[0.02]'
                        }`}
                    >
                        Alert History
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {activeTab === 'manage' ? (
                        <>

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
                                    className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-slate-600"
                                />
                            </div>
                            <div className="w-40">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                    Frequency
                                </label>
                                <select
                                    value={frequency}
                                    onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly')}
                                    className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all appearance-none cursor-pointer text-xs font-bold uppercase tracking-widest"
                                >
                                    <option value="daily">Daily Pulse</option>
                                    <option value="weekly">Weekly Summary</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled={!newKeyword.trim() || adding}
                                    className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 px-8 rounded-2xl transition-all shadow-xl shadow-violet-600/20 flex items-center space-x-3 uppercase tracking-tighter italic"
                                >
                                    {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                    <span>Initiate Protocol</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Alerts List */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Active Monitors</h3>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
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
                                    <div key={alert.id} className="group p-6 bg-[#0A0A0C]/50 backdrop-blur-md rounded-2xl border border-white/5 hover:border-violet-500/30 transition-all">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-4 flex-1">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border shadow-inner ${
                                                    alert.enabled
                                                        ? 'bg-violet-500/10 border-violet-500/20 text-violet-400'
                                                        : 'bg-slate-500/10 border-slate-500/20 text-slate-500'
                                                }`}>
                                                    <Zap className="w-5 h-5 fill-current/20" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-1">
                                                        <h4 className="text-white font-black uppercase tracking-tight text-lg italic">{alert.keyword}</h4>
                                                        {!alert.enabled && (
                                                            <span className="px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                                                Paused
                                                            </span>
                                                        )}
                                                        {alert.opportunitiesFound && alert.opportunitiesFound > 5 && (
                                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center space-x-1">
                                                                <TrendingUp className="w-3 h-3" />
                                                                <span>High Yield</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                                        <span className="flex items-center space-x-1.5">
                                                            <Clock className="w-3 h-3 text-violet-500" />
                                                            <span>{alert.frequency}</span>
                                                        </span>
                                                        <span className="text-slate-700">•</span>
                                                        <span>{alert.opportunitiesFound || 0} opportunities</span>
                                                        {alert.lastChecked && (
                                                            <>
                                                                <span className="text-slate-700">•</span>
                                                                <span>Checked {new Date(alert.lastChecked).toLocaleDateString()}</span>
                                                            </>
                                                        )}
                                                        {alert.successRate && (
                                                            <>
                                                                <span className="text-slate-700">•</span>
                                                                <span>{Math.round(alert.successRate)}% success</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {/* Toggle Switch */}
                                                <button
                                                    onClick={() => handleToggleAlert(alert.id, alert.enabled ?? true)}
                                                    className={`relative w-12 h-6 rounded-full transition-colors ${
                                                        alert.enabled ? 'bg-violet-600' : 'bg-slate-700'
                                                    }`}
                                                    title={alert.enabled ? 'Pause alert' : 'Enable alert'}
                                                >
                                                    <span
                                                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                                            alert.enabled ? 'translate-x-6' : 'translate-x-0'
                                                        }`}
                                                    />
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDeleteAlert(alert.id)}
                                                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    </>
                    ) : (
                        <AlertHistoryPanel userId={userId} />
                    )}
                </div>
            </div>
        </div>
    );
};
