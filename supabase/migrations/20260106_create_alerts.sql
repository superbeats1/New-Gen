-- Create alerts table
create table if not exists alerts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  keyword text not null,
  frequency text check (frequency in ('daily', 'weekly')) default 'daily',
  last_checked timestamptz,
  created_at timestamptz default now()
);

-- Enable RLS for alerts
alter table alerts enable row level security;

-- Policies for alerts
create policy "Users can view their own alerts"
  on alerts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own alerts"
  on alerts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own alerts"
  on alerts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own alerts"
  on alerts for delete
  using (auth.uid() = user_id);

-- Create alert_logs table
create table if not exists alert_logs (
  id uuid default gen_random_uuid() primary key,
  alert_id uuid references alerts(id) on delete cascade not null,
  summary text,
  score numeric,
  sent_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Enable RLS for alert_logs
alter table alert_logs enable row level security;

-- Policies for alert_logs (Users can view logs for their alerts)
create policy "Users can view logs for their alerts"
  on alert_logs for select
  using (
    exists (
      select 1 from alerts
      where alerts.id = alert_logs.alert_id
      and alerts.user_id = auth.uid()
    )
  );
