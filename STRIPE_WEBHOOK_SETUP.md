# Stripe Webhook Setup Guide

## 🎯 Goal
Automatically upgrade users to Pro status in Supabase when they complete payment through Stripe.

## 📋 Prerequisites
- Supabase project with CLI installed
- Stripe account with webhook access
- Environment variables ready

## 🚀 Step 1: Deploy Supabase Edge Function

### 1.1 Install Supabase CLI (if not already installed)
```bash
npm install -g supabase
```

### 1.2 Login to Supabase
```bash
supabase login
```

### 1.3 Link to your project
```bash
supabase link --project-ref YOUR_PROJECT_ID
```

### 1.4 Deploy the webhook function
```bash
supabase functions deploy stripe-webhook
```

### 1.5 Set environment variables
```bash
# Set your Stripe webhook secret (get this from Stripe Dashboard)
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Set your Supabase URL and Service Role Key
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## ⚡ Step 2: Configure Stripe Webhook

### 2.1 Get your webhook URL
After deploying, your webhook URL will be:
```
https://your-project.supabase.co/functions/v1/stripe-webhook
```

### 2.2 In Stripe Dashboard
1. Go to **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. **Endpoint URL**: `https://your-project.supabase.co/functions/v1/stripe-webhook`
4. **Listen to**: Select these events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted` (optional - for cancellations)

### 2.3 Get webhook secret
1. Click on your newly created webhook
2. Copy the **Signing secret** (starts with `whsec_`)
3. Update your Supabase secrets:
```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret_here
```

## 🔧 Step 3: Test the Integration

### 3.1 Test payment flow
1. Use a test card: `4242 4242 4242 4242`
2. Complete payment through your app
3. Check Supabase logs:
```bash
supabase functions logs stripe-webhook
```

### 3.2 Verify user upgrade
1. Check your profiles table in Supabase
2. User should have `is_pro = true` after payment

## 📊 Step 4: Monitor & Debug

### View function logs
```bash
supabase functions logs stripe-webhook --follow
```

### Check webhook deliveries in Stripe
- Go to Stripe Dashboard → Webhooks → Your endpoint
- View recent deliveries and any failures

## 🛡️ Security Notes

- ✅ Webhook signature verification is included
- ✅ CORS headers configured
- ✅ Error handling and logging
- ✅ Service role key for admin operations

## 🎯 What Happens After Setup

1. **User clicks "Upgrade to Pro"** → Opens Stripe checkout
2. **User completes payment** → Stripe sends webhook to Supabase
3. **Webhook processes payment** → Finds user by email
4. **User upgraded** → `is_pro = true` in profiles table
5. **User returns to app** → Sees Pro status and unlimited credits

## 🚨 Troubleshooting

**Webhook not firing?**
- Check webhook URL is correct
- Verify events are selected in Stripe
- Check Supabase function logs

**User not upgrading?**
- Verify email matches between Stripe and Supabase
- Check function environment variables
- Review webhook payload in Stripe dashboard

**Need help?**
- Check Supabase function logs: `supabase functions logs stripe-webhook`
- Test webhook manually in Stripe dashboard