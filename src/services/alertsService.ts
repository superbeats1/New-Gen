import { supabase } from '../lib/supabase';
import { Alert } from '../types';

// Mock data for initial development if Supabase interaction fails or table doesn't exist yet
const MOCK_ALERTS_KEY = 'signal_alerts_mock';

export const alertsService = {
    async getAlerts(userId: string): Promise<Alert[]> {
        try {
            // Try Supabase first
            const { data, error } = await supabase
                .from('alerts')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data.map(a => ({
                id: a.id,
                userId: a.user_id,
                keyword: a.keyword,
                frequency: a.frequency,
                lastChecked: a.last_checked,
                createdAt: a.created_at,
                enabled: a.enabled ?? true,
                opportunitiesFound: a.opportunities_found ?? 0,
                lastNotified: a.last_notified,
                successRate: a.success_rate,
                totalChecks: a.total_checks ?? 0
            }));
        } catch (error) {
            console.warn('Supabase alerts fetch failed, falling back to local storage', error);
            const stored = localStorage.getItem(MOCK_ALERTS_KEY);
            return stored ? JSON.parse(stored).filter((a: Alert) => a.userId === userId) : [];
        }
    },

    async createAlert(userId: string, keyword: string, frequency: 'daily' | 'weekly'): Promise<Alert> {
        const newAlert = {
            user_id: userId,
            keyword,
            frequency,
            created_at: new Date().toISOString()
        };

        try {
            const { data, error } = await supabase
                .from('alerts')
                .insert([newAlert])
                .select()
                .single();

            if (error) throw error;

            return {
                id: data.id,
                userId: data.user_id,
                keyword: data.keyword,
                frequency: data.frequency,
                lastChecked: data.last_checked,
                createdAt: data.created_at,
                enabled: data.enabled ?? true,
                opportunitiesFound: data.opportunities_found ?? 0,
                lastNotified: data.last_notified,
                successRate: data.success_rate,
                totalChecks: data.total_checks ?? 0
            };
        } catch (error) {
            console.warn('Supabase alert create failed, falling back to local storage', error);
            const tempId = Math.random().toString(36).substring(7);
            const localAlert: Alert = {
                id: tempId,
                userId: userId,
                keyword,
                frequency,
                createdAt: new Date().toISOString()
            };

            const stored = localStorage.getItem(MOCK_ALERTS_KEY);
            const alerts = stored ? JSON.parse(stored) : [];
            localStorage.setItem(MOCK_ALERTS_KEY, JSON.stringify([...alerts, localAlert]));

            return localAlert;
        }
    },

    async deleteAlert(id: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('alerts')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.warn('Supabase alert delete failed, falling back to local storage', error);
            const stored = localStorage.getItem(MOCK_ALERTS_KEY);
            if (stored) {
                const alerts = JSON.parse(stored);
                const filtered = alerts.filter((a: Alert) => a.id !== id);
                localStorage.setItem(MOCK_ALERTS_KEY, JSON.stringify(filtered));
            }
        }
    },

    async toggleAlert(id: string, enabled: boolean): Promise<void> {
        try {
            const { error } = await supabase
                .from('alerts')
                .update({ enabled })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Failed to toggle alert', error);
            // For localStorage fallback, we'd need to update the stored alert
            const stored = localStorage.getItem(MOCK_ALERTS_KEY);
            if (stored) {
                const alerts = JSON.parse(stored);
                const updated = alerts.map((a: Alert) =>
                    a.id === id ? { ...a, enabled } : a
                );
                localStorage.setItem(MOCK_ALERTS_KEY, JSON.stringify(updated));
            }
            throw error;
        }
    }
};
