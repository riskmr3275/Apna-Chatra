import express from 'express';
import { addSubscription, removeSubscription } from '../services/pushService.js';

const router = express.Router();

// Subscribe to push notifications
router.post('/subscribe', (req, res) => {
  try {
    const { subscription } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Invalid subscription data' });
    }

    addSubscription(userId, subscription);
    
    res.json({ message: 'Subscription added successfully' });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Failed to add subscription' });
  }
});

// Unsubscribe from push notifications
router.post('/unsubscribe', (req, res) => {
  try {
    const { endpoint } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint required' });
    }

    removeSubscription(userId, endpoint);
    
    res.json({ message: 'Subscription removed successfully' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ error: 'Failed to remove subscription' });
  }
});

// Get VAPID public key
router.get('/vapid-public-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

export default router;