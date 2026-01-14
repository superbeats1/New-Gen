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

    console.log('=== STRIPE WEBHOOK RECEIVED ===');
    console.log('Signature present:', !!signature);

    // Verify webhook signature (recommended for production)
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    // Note: In production, verify the webhook signature here

    const event = JSON.parse(body);
    console.log('Event type:', event.type);
    console.log('Event ID:', event.id);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle successful subscription creation or payment
    if (event.type === 'checkout.session.completed' ||
        event.type === 'invoice.payment_succeeded') {

      const session = event.data.object;
      const customerEmail = session.customer_email || session.customer_details?.email;

      console.log('=== PROCESSING PAYMENT ===');
      console.log('Customer email from event:', customerEmail);
      console.log('Session ID:', session.id);
      console.log('Payment status:', session.payment_status);
      console.log('Full session object:', JSON.stringify(session, null, 2));

      if (customerEmail) {
        // Find user by email
        console.log('Fetching all users from Supabase...');
        const { data: authUser, error: authError } = await supabase.auth.admin.listUsers();

        if (authError) {
          console.error('Error fetching users:', authError);
          throw authError;
        }

        console.log(`Total users in database: ${authUser.users.length}`);
        console.log('User emails in database:', authUser.users.map(u => u.email));

        const user = authUser.users.find(u => u.email?.toLowerCase() === customerEmail.toLowerCase());

        if (user) {
          console.log(`Found matching user: ${user.id} (${user.email})`);

          // Update user to Pro status
          const { data: updateData, error: updateError } = await supabase
            .from('profiles')
            .update({
              is_pro: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id)
            .select();

          if (updateError) {
            console.error('Error updating user to Pro:', updateError);
            throw updateError;
          }

          console.log('Update response:', updateData);
          console.log(`✅ Successfully upgraded user ${customerEmail} to Pro`);
        } else {
          console.error(`❌ User not found for email: ${customerEmail}`);
          console.error('Available emails:', authUser.users.map(u => u.email).join(', '));
        }
      } else {
        console.error('❌ No customer email found in webhook event');
      }
    } else {
      console.log(`Ignoring event type: ${event.type}`);
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