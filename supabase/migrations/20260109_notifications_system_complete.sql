-- ============================================
-- COMPREHENSIVE NOTIFICATIONS & ALERTS SYSTEM
-- Version: 2.20.0
-- Date: 2026-01-09
-- This migration creates everything from scratch
-- ============================================

-- 1. Ensure alerts table exists with all required columns
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly')),
    last_checked TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add new columns to alerts table (if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='alerts' AND column_name='enabled') THEN
        ALTER TABLE public.alerts ADD COLUMN enabled BOOLEAN DEFAULT TRUE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='alerts' AND column_name='opportunities_found') THEN
        ALTER TABLE public.alerts ADD COLUMN opportunities_found INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='alerts' AND column_name='last_notified') THEN
        ALTER TABLE public.alerts ADD COLUMN last_notified TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='alerts' AND column_name='success_rate') THEN
        ALTER TABLE public.alerts ADD COLUMN success_rate NUMERIC(5, 2);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='alerts' AND column_name='total_checks') THEN
        ALTER TABLE public.alerts ADD COLUMN total_checks INTEGER DEFAULT 0;
    END IF;
END $$;

-- Enable RLS for alerts
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for alerts (if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='alerts' AND policyname='Users can view their own alerts') THEN
        CREATE POLICY "Users can view their own alerts"
            ON public.alerts FOR SELECT
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='alerts' AND policyname='Users can insert their own alerts') THEN
        CREATE POLICY "Users can insert their own alerts"
            ON public.alerts FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='alerts' AND policyname='Users can update their own alerts') THEN
        CREATE POLICY "Users can update their own alerts"
            ON public.alerts FOR UPDATE
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='alerts' AND policyname='Users can delete their own alerts') THEN
        CREATE POLICY "Users can delete their own alerts"
            ON public.alerts FOR DELETE
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- 2. Create alert_logs table
CREATE TABLE IF NOT EXISTS public.alert_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    alert_id UUID NOT NULL REFERENCES public.alerts(id) ON DELETE CASCADE,
    summary TEXT,
    score NUMERIC,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add new columns to alert_logs (if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='alert_logs' AND column_name='opportunities_data') THEN
        ALTER TABLE public.alert_logs ADD COLUMN opportunities_data JSONB;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='alert_logs' AND column_name='sources_analyzed') THEN
        ALTER TABLE public.alert_logs ADD COLUMN sources_analyzed INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='alert_logs' AND column_name='processing_time_ms') THEN
        ALTER TABLE public.alert_logs ADD COLUMN processing_time_ms INTEGER;
    END IF;
END $$;

-- Enable RLS for alert_logs
ALTER TABLE public.alert_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for alert_logs
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='alert_logs' AND policyname='Users can view logs for their alerts') THEN
        CREATE POLICY "Users can view logs for their alerts"
            ON public.alert_logs FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM public.alerts
                    WHERE alerts.id = alert_logs.alert_id
                    AND alerts.user_id = auth.uid()
                )
            );
    END IF;
END $$;

-- 3. Create notifications table
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

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='notifications' AND policyname='Users can view own notifications') THEN
        CREATE POLICY "Users can view own notifications"
            ON public.notifications FOR SELECT
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='notifications' AND policyname='Users can update own notifications') THEN
        CREATE POLICY "Users can update own notifications"
            ON public.notifications FOR UPDATE
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='notifications' AND policyname='Service role can insert notifications') THEN
        CREATE POLICY "Service role can insert notifications"
            ON public.notifications FOR INSERT
            WITH CHECK (true);
    END IF;
END $$;

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON public.alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_enabled ON public.alerts(enabled) WHERE enabled = true;

CREATE INDEX IF NOT EXISTS idx_alert_logs_alert_id ON public.alert_logs(alert_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;

-- 5. Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alerts TO authenticated;
GRANT ALL ON public.alerts TO service_role;

GRANT SELECT ON public.alert_logs TO authenticated;
GRANT ALL ON public.alert_logs TO service_role;

GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

-- 6. Create function to auto-calculate alert success rate
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create trigger
DROP TRIGGER IF EXISTS trigger_update_alert_stats ON public.alert_logs;
CREATE TRIGGER trigger_update_alert_stats
AFTER INSERT ON public.alert_logs
FOR EACH ROW
EXECUTE FUNCTION update_alert_success_rate();

-- ============================================
-- VERIFICATION
-- ============================================
-- Run these queries to verify everything was created:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('alerts', 'alert_logs', 'notifications');
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'alerts' ORDER BY ordinal_position;
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'notifications' ORDER BY ordinal_position;
-- SELECT COUNT(*) as total_policies FROM pg_policies WHERE schemaname = 'public';
