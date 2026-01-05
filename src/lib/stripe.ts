import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export const createCheckoutSession = async () => {
  try {
    // Get current URL for redirect
    const currentUrl = window.location.origin;
    
    // Create checkout session with custom success URL that includes session info
    const paymentLinkUrl = `https://buy.stripe.com/test_7sYeVc1CX3UwcbFeQp2kw03?success_url=${encodeURIComponent(currentUrl + '/success?session_id={CHECKOUT_SESSION_ID}')}&cancel_url=${encodeURIComponent(currentUrl)}`;
    
    // Redirect to Stripe Payment Link with custom URLs
    window.location.href = paymentLinkUrl;
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};