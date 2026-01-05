import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export const createCheckoutSession = async () => {
  try {
    const paymentLinkUrl = 'https://buy.stripe.com/test_5kQbJ00yTaiU2B57nX2kw02';
    
    // Redirect to Stripe Payment Link
    window.open(paymentLinkUrl, '_blank');
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};