import webpush from 'web-push';

// Configure web-push
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// In-memory storage for push subscriptions (use database in production)
const subscriptions = new Map();

export const addSubscription = (userId, subscription) => {
  if (!subscriptions.has(userId)) {
    subscriptions.set(userId, []);
  }
  subscriptions.get(userId).push(subscription);
};

export const removeSubscription = (userId, endpoint) => {
  if (subscriptions.has(userId)) {
    const userSubs = subscriptions.get(userId);
    const filtered = userSubs.filter(sub => sub.endpoint !== endpoint);
    subscriptions.set(userId, filtered);
  }
};

export const sendPushNotification = async ({ userId, topic, title, body, data = {} }) => {
  try {
    const payload = JSON.stringify({
      title,
      body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      data: {
        ...data,
        timestamp: new Date().toISOString()
      }
    });

    const promises = [];

    // Send to specific user
    if (userId && subscriptions.has(userId)) {
      const userSubscriptions = subscriptions.get(userId);
      for (const subscription of userSubscriptions) {
        promises.push(
          webpush.sendNotification(subscription, payload)
            .catch(error => {
              console.error('Push notification error:', error);
              // Remove invalid subscription
              if (error.statusCode === 410) {
                removeSubscription(userId, subscription.endpoint);
              }
            })
        );
      }
    }

    // Send to topic (all subscribers)
    if (topic) {
      for (const [subUserId, userSubs] of subscriptions.entries()) {
        for (const subscription of userSubs) {
          promises.push(
            webpush.sendNotification(subscription, payload)
              .catch(error => {
                console.error('Push notification error:', error);
                if (error.statusCode === 410) {
                  removeSubscription(subUserId, subscription.endpoint);
                }
              })
          );
        }
      }
    }

    await Promise.all(promises);
    console.log(`📱 Push notifications sent (${promises.length} recipients)`);
  } catch (error) {
    console.error('Error sending push notifications:', error);
  }
};