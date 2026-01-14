# 🔴 CRITICAL FIX: Stripe Pro Upgrade Setup

## Problem
Users who pay for Pro via Stripe are not being upgraded in Supabase database. The `is_pro` field remains `false`.

## Root Cause
The Stripe webhook exists but is not deployed or configured in Stripe dashboard, so payment events never reach your backend to update the database.

---

## Solution: 5-Step Setup

### Step 1: Deploy Webhook to Supabase
```bash
cd "/Users/superbeatsm2/Documents/New Gen (project)/New-Gen"

# Deploy the webhook function
supabase functions deploy stripe-webhook

# Verify deployment
supabase functions list
```

### Step 2: Configure in Stripe Dashboard
1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"  
3. Enter webhook URL: `https://[your-project].supabase.co/functions/v1/stripe-webhook`
4. Select events: `checkout.session.completed`, `invoice.payment_succeeded`
5. Copy the signing secret (starts with `whsec_...`)

### Step 3: Add Secret to Supabase
```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Step 4: Test
1. Click "Upgrade to Pro" in app
2. Use test card: 4242 4242 4242 4242
3. Complete payment
4. Check database: is_pro should = true

---

## Quick Manual Fix (Testing Only)
Click "(Admin: Upgrade)" button in the sidebar to manually set Pro status.
