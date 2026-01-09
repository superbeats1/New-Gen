-- Create alerts table
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly')),
    last_checked TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index for faster user queries
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON public.alerts(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Policy: Users can view their own alerts
CREATE POLICY "Users can view own alerts"
    ON public.alerts
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own alerts
CREATE POLICY "Users can create own alerts"
    ON public.alerts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own alerts
CREATE POLICY "Users can update own alerts"
    ON public.alerts
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own alerts
CREATE POLICY "Users can delete own alerts"
    ON public.alerts
    FOR DELETE
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.alerts TO authenticated;
GRANT ALL ON public.alerts TO service_role;
