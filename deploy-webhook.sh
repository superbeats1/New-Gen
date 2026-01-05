#!/bin/bash

echo "🚀 Deploying Stripe Webhook to Supabase..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Login to Supabase (if not already logged in)
echo "🔐 Logging into Supabase..."
supabase login

# Deploy the webhook function
echo "📦 Deploying stripe-webhook function..."
supabase functions deploy stripe-webhook

echo ""
echo "✅ Webhook deployed successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Set your environment variables:"
echo "   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_secret_here"
echo "   supabase secrets set SUPABASE_URL=https://your-project.supabase.co"
echo "   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_key_here"
echo ""
echo "2. Configure webhook in Stripe Dashboard:"
echo "   - URL: https://your-project.supabase.co/functions/v1/stripe-webhook"
echo "   - Events: checkout.session.completed, invoice.payment_succeeded"
echo ""
echo "3. Test a payment to verify it works!"
echo ""
echo "📖 See STRIPE_WEBHOOK_SETUP.md for detailed instructions"