import stripe from 'stripe'
import dotenv from 'dotenv';

const Stripe = stripe(process.env.STRIPE_SECRET_KEY);

export default Stripe;

