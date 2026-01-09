-- ============================================
-- NOTIFICATIONS SYSTEM MIGRATION
-- Version: 2.20.0
-- Date: 2026-01-09
-- ============================================

-- 1. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    alert_id UUID REFERENCES public.alerts(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('alert_result', 'system', 'credit', 'error')),
    title TEXT NOT NULL,
    message TEXT,
    metadata JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;

-- RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can insert notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (true);

-- Grant permissions
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

-- 2. Enhance alerts table
ALTER TABLE public.alerts
ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS opportunities_found INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_notified TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS success_rate NUMERIC(5, 2),
ADD COLUMN IF NOT EXISTS total_checks INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_alerts_enabled ON public.alerts(enabled) WHERE enabled = true;

-- 3. Enhance alert_logs table
ALTER TABLE public.alert_logs
ADD COLUMN IF NOT EXISTS opportunities_data JSONB,
ADD COLUMN IF NOT EXISTS sources_analyzed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS processing_time_ms INTEGER;

CREATE INDEX IF NOT EXISTS idx_alert_logs_alert_id ON public.alert_logs(alert_id, created_at DESC);

-- 4. Create function to auto-calculate success rate
CREATE OR REPLACE FUNCTION update_alert_success_rate()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.alerts
    SET
        total_checks = total_checks + 1,
        opportunities_found = opportunities_found + CASE WHEN NEW.score > 7 THEN 1 ELSE 0 END,
        success_rate = (
            SELECT (COUNT(*) FILTER (WHERE score > 7)::NUMERIC / NULLIF(COUNT(*), 0)) * 100
            FROM public.alert_logs
            WHERE alert_id = NEW.alert_id
        )
    WHERE id = NEW.alert_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_alert_stats ON public.alert_logs;
CREATE TRIGGER trigger_update_alert_stats
AFTER INSERT ON public.alert_logs
FOR EACH ROW
EXECUTE FUNCTION update_alert_success_rate();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these after migration to verify:
-- SELECT * FROM public.notifications LIMIT 5;
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'alerts' AND column_name IN ('enabled', 'opportunities_found', 'success_rate');
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'alert_logs' AND column_name IN ('opportunities_data', 'sources_analyzed');
