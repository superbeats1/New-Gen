import React, { useState, useEffect } from 'react';
import { ChevronDown, Clock, Zap, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Alert } from '../types';

interface AlertLog {
  id: string;
  alertId: string;
  score: number;
  summary: string;
  opportunitiesData: any[];
  createdAt: string;
}

export const AlertHistoryPanel: React.FC<{ userId: string }> = ({ userId }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [logs, setLogs] = useState<Record<string, AlertLog[]>>({});
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [userId]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      // Fetch all user alerts
      const { data: alertsData } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (alertsData) {
        setAlerts(alertsData.map((a: any) => ({
          id: a.id,
          userId: a.user_id,
          keyword: a.keyword,
          frequency: a.frequency,
          lastChecked: a.last_checked,
          createdAt: a.created_at,
          enabled: a.enabled,
          opportunitiesFound: a.opportunities_found,
          successRate: a.success_rate,
          totalChecks: a.total_checks
        })));

        // Fetch logs for each alert (last 3)
        const logsPromises = alertsData.map(async (alert: any) => {
          const { data } = await supabase
            .from('alert_logs')
            .select('*')
            .eq('alert_id', alert.id)
            .order('created_at', { ascending: false })
            .limit(3);

          return { alertId: alert.id, logs: data || [] };
        });

        const logsResults = await Promise.all(logsPromises);
        const logsMap: Record<string, AlertLog[]> = {};
        logsResults.forEach(({ alertId, logs }) => {
          logsMap[alertId] = logs.map((log: any) => ({
            id: log.id,
            alertId: log.alert_id,
            score: log.score,
            summary: log.summary,
            opportunitiesData: log.opportunities_data || [],
            createdAt: log.created_at
          }));
        });
        setLogs(logsMap);
      }
    } catch (error) {
      console.error('Failed to load history', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (alertId: string) => {
    setExpandedAlerts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(alertId)) {
        newSet.delete(alertId);
      } else {
        newSet.add(alertId);
      }
      return newSet;
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / 3600000);
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
        Alert History
      </h2>

      {alerts.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
          <Zap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No alert history yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => {
            const alertLogs = logs[alert.id] || [];
            const isExpanded = expandedAlerts.has(alert.id);

            return (
              <div
                key={alert.id}
                className="bg-[#0A0A0C]/50 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden"
              >
                {/* Alert Summary */}
                <button
                  onClick={() => toggleExpand(alert.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      alert.enabled ? 'bg-violet-500/10' : 'bg-slate-500/10'
                    }`}>
                      <Zap className={`w-5 h-5 ${alert.enabled ? 'text-violet-400' : 'text-slate-500'}`} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-black uppercase text-lg italic">
                        {alert.keyword}
                      </h3>
                      <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                        <span>{alert.opportunitiesFound || 0} opportunities</span>
                        <span className="text-slate-700">•</span>
                        <span>{alert.totalChecks || 0} checks</span>
                        {alert.successRate && (
                          <>
                            <span className="text-slate-700">•</span>
                            <span>{Math.round(alert.successRate)}% success</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Expanded Results */}
                {isExpanded && (
                  <div className="border-t border-white/5 p-6 space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                      Recent Results ({alertLogs.length})
                    </h4>

                    {alertLogs.length === 0 ? (
                      <p className="text-slate-600 text-sm text-center py-4">
                        No results yet. Next check in {alert.frequency === 'daily' ? '24h' : '7 days'}.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {alertLogs.map(log => (
                          <div
                            key={log.id}
                            className="p-4 bg-white/[0.02] rounded-xl border border-white/5"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className={`text-sm font-bold ${
                                  log.score > 7 ? 'text-emerald-400' : log.score > 5 ? 'text-amber-400' : 'text-slate-500'
                                }`}>
                                  Score: {log.score}/10
                                </span>
                                {log.opportunitiesData.length > 0 && (
                                  <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-[9px] font-black text-violet-400 uppercase">
                                    {log.opportunitiesData.length} found
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-600 uppercase tracking-widest">
                                {getRelativeTime(log.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-slate-400">{log.summary}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
