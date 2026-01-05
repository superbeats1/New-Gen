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
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    
    // Verify webhook signature (recommended for production)
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    // Note: In production, verify the webhook signature here
    
    const event = JSON.parse(body);
    console.log('Webhook event:', event.type);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle successful subscription creation or payment
    if (event.type === 'checkout.session.completed' || 
        event.type === 'invoice.payment_succeeded') {
      
      const session = event.data.object;
      const customerEmail = session.customer_email || session.customer_details?.email;
      
      console.log('Processing payment for email:', customerEmail);
      console.log('Product purchased:', session.line_items || 'N/A');

      if (customerEmail) {
        // Find user by email
        const { data: authUser, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          console.error('Error fetching users:', authError);
          throw authError;
        }

        const user = authUser.users.find(u => u.email === customerEmail);
        
        if (user) {
          // Update user to Pro status
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              is_pro: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

          if (updateError) {
            console.error('Error updating user to Pro:', updateError);
            throw updateError;
          }

          console.log(`Successfully upgraded user ${customerEmail} to Pro`);
        } else {
          console.log(`User not found for email: ${customerEmail}`);
        }
      }
    }

    // Handle subscription cancellation
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const customerId = subscription.customer;
      
      // You'd need to track customer_id in your profiles table to handle this
      console.log('Subscription cancelled for customer:', customerId);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});