import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export const createCheckoutSession = async () => {
  try {
    // Get current URL for redirect
    const currentUrl = window.location.origin;
    
    // SIGNAL Pro Plan - Product ID: prod_TjNbchpI0jBZG5
    // Create checkout session with success URL redirecting to landing page
    const paymentLinkUrl = `https://buy.stripe.com/test_5kQ5kC6Xhdv66Rl7nX2kw04?success_url=${encodeURIComponent(currentUrl + '/?payment=success')}&cancel_url=${encodeURIComponent(currentUrl)}`;
    
    // Redirect to Stripe Payment Link with custom URLs
    window.location.href = paymentLinkUrl;
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};