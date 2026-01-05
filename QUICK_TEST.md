# Quick Test Guide for Pro Upgrade

## 🎯 Current Status
✅ **Frontend**: Payment redirects to landing page with success banner  
❓ **Backend**: Need to deploy webhook to auto-update Supabase

## 🚀 Option 1: Use Manual Admin Button (Quick Test)

**For immediate testing:**
1. Click the **"Admin: Upgrade to Pro"** button in the dashboard sidebar
2. This instantly upgrades your account to Pro status
3. You'll see unlimited credits and Pro badge immediately

## 🔧 Option 2: Deploy Webhook (Production Setup)

**For automatic Stripe → Supabase updates:**

### Step 1: Deploy Webhook
```bash
./deploy-webhook.sh
```

### Step 2: Set Environment Variables
Get your values from:
- **Stripe Dashboard** → Developers → Webhooks → [Your webhook] → Signing Secret
- **Supabase Dashboard** → Settings → API

```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_secret
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 3: Configure Stripe Webhook
1. **Stripe Dashboard** → Developers → Webhooks → Add endpoint
2. **URL**: `https://your-project.supabase.co/functions/v1/stripe-webhook`
3. **Events**: Select `checkout.session.completed` and `invoice.payment_succeeded`

## 🧪 Test the Flow

### With Admin Button:
1. Click "Admin: Upgrade to Pro" → Instant Pro status

### With Real Payment:
1. Click "Upgrade to Pro" → Stripe checkout
2. Use test card: `4242 4242 4242 4242`
3. Complete payment → Redirect to landing page
4. See success banner → Check Pro status in header

## ❓ Troubleshooting

**Not seeing Pro status after payment?**
- Check if webhook is deployed and configured
- Use admin button as temporary solution
- Verify environment variables are set

**Need help with webhook setup?**
- See `STRIPE_WEBHOOK_SETUP.md` for detailed steps
- Check Supabase function logs: `supabase functions logs stripe-webhook`

## 🎉 Expected Result

After payment completion:
✅ Redirected to landing page  
✅ Green "Payment Successful!" banner  
✅ Header shows "Unlimited" credits  
✅ Pro badge visible next to name  
✅ No "Upgrade" button (only for Pro users)