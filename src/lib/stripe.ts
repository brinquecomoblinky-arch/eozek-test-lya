import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  throw new Error('Missing Stripe publishable key')
}

export const stripe = loadStripe(stripePublishableKey)

export const STRIPE_PRICE_ID = 'price_1RuK3QB1cuFGKX9IjagAjcO0' // Replace with your actual price ID from Stripe Dashboard
export const MONTHLY_PRICE = 19.90