import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');

export const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID ?? '';
