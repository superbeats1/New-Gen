# Supabase Alerts Table Setup

## Option 1: Using Supabase Dashboard (Easiest)

1. Go to your Supabase project: https://supabase.com/dashboard/project/YOUR_PROJECT_ID
2. Click on **SQL Editor** in the left sidebar
3. Click **"New Query"**
4. Copy the contents of `supabase/migrations/create_alerts_table.sql`
5. Paste into the SQL editor
6. Click **"Run"**
7. Verify the table was created by going to **Database** → **Tables** → Look for `alerts`

## Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Navigate to project directory
cd /Users/superbeatsm2/Documents/New\ Gen\ \(project\)/New-Gen

# Link to your Supabase project (first time only)
supabase link --project-ref YOUR_PROJECT_REF

# Apply the migration
supabase db push
```

## Verify Setup

After running the migration, test it:

1. Refresh your app (hard refresh with Cmd+Shift+R)
2. Sign in
3. Click **"Alerts"** in the sidebar or **"Neural Monitors"** card
4. Add a test alert (e.g., keyword: "SaaS tools", frequency: daily)
5. It should save successfully without falling back to localStorage

## Table Schema

The `alerts` table includes:

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → auth.users)
- `keyword` (TEXT) - The search term to monitor
- `frequency` (TEXT) - Either 'daily' or 'weekly'
- `last_checked` (TIMESTAMPTZ, nullable) - Last time the alert ran
- `created_at` (TIMESTAMPTZ) - When the alert was created

## Row Level Security (RLS)

✅ **Enabled** - Users can only see/manage their own alerts

## Troubleshooting

### Error: "relation 'alerts' does not exist"
- The migration hasn't been run yet. Follow Option 1 above.

### Error: "permission denied for table alerts"
- RLS policies aren't set up. Re-run the migration SQL.

### Still seeing "Local Protocol" badge?
- The table exists but the app can't connect. Check:
  1. `.env.local` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
  2. You're signed in to the app
  3. Hard refresh the browser

## Finding Your Project Ref

Your Supabase project ref is in:
- URL: `https://supabase.com/dashboard/project/[PROJECT_REF]`
- Or in: **Project Settings** → **General** → **Reference ID**
