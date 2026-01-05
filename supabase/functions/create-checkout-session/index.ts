import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { priceId } = await req.json();
    
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not found');
    }

    // Create Stripe checkout session
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'subscription',
        'price_data[currency]': 'usd',
        'price_data[product_data][name]': 'SIGNAL Pro Plan',
        'price_data[product_data][description]': 'Unlimited AI-powered market scans and lead discovery',
        'price_data[recurring][interval]': 'month',
        'price_data[unit_amount]': '2900', // $29/month
        'success_url': `${req.headers.get('origin') || 'https://your-app.vercel.app'}/success`,
        'cancel_url': `${req.headers.get('origin') || 'https://your-app.vercel.app'}/dashboard`,
        'allow_promotion_codes': 'true',
      }),
    });

    const session = await response.json();
    
    if (!response.ok) {
      throw new Error(session.error?.message || 'Failed to create checkout session');
    }

    return new Response(
      JSON.stringify({ id: session.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});