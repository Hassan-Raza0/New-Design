// Load environment variables
require('dotenv').config();

const express = require('express');
const router = express.Router();
const Stripe = require('stripe');

// Initialize Stripe with secret key from .env
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// POST route to handle payment creation
router.post('/create-payment', async (req, res) => {
  const { amount, cardNumber, expiryDate, cvv, name } = req.body;

  try {
    // Validate input
    if (!amount || !cardNumber || !expiryDate || !cvv || !name) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Split expiry date into month and year
    const [exp_month, exp_yearShort] = expiryDate.split('/');
    const exp_year = Number('20' + exp_yearShort);

    // Create payment method
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: cardNumber.replace(/\s/g, ''),
        exp_month: Number(exp_month),
        exp_year,
        cvc: cvv
      },
      billing_details: {
        name
      }
    });

    // Create a payment intent
const paymentIntent = await stripe.paymentIntents.create({
  amount,
  currency: 'usd',
  payment_method: paymentMethod.id,
  confirm: true,
  automatic_payment_methods: {
    enabled: true,
    allow_redirects: 'never' // Optional: avoids redirect-based methods
  }
});

    res.json({ success: true, id: paymentIntent.id });

  } catch (err) {
    console.error('[Stripe Error]', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
