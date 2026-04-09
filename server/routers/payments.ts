import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe('your-stripe-secret-key'); // Replace with your actual Stripe secret key

// Create a Checkout Session
router.post('/create-checkout-session', async (req, res) => {
    const { line_items } = req.body;
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${req.headers.origin}/success`,
            cancel_url: `${req.headers.origin}/cancel`,
        });
        res.json({ id: session.id });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Subscribe a customer
router.post('/subscribe', async (req, res) => {
    const { customerId, priceId } = req.body;
    try {
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            trial_period_days: 14 // Optional: trial period
        });
        res.json(subscription);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Retrieve Payment Status
router.get('/payment-status/:sessionId', async (req, res) => {
    const { sessionId } = req.params;
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        res.json(session);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default router;