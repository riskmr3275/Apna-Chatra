import { sendEmail } from '../services/emailService.js';
import { sendPushNotification } from '../services/pushService.js';

export const handleUserEvents = async (event, routingKey) => {
  console.log(`📨 Processing user event: ${routingKey}`);
  
  switch (routingKey) {
    case 'user.registered':
      await handleUserRegistered(event);
      break;
    case 'user.email.verified':
      await handleEmailVerified(event);
      break;
    case 'user.reporter.followed':
      await handleReporterFollowed(event);
      break;
    default:
      console.log(`Unhandled user event: ${routingKey}`);
  }
};

const handleUserRegistered = async (event) => {
  try {
    await sendEmail({
      to: event.email,
      subject: 'Welcome to News Website!',
      template: 'welcome',
      data: {
        name: event.profile?.firstName || 'User',
        email: event.email
      }
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

const handleEmailVerified = async (event) => {
  try {
    await sendEmail({
      to: event.email,
      subject: 'Email Verified Successfully',
      template: 'email-verified',
      data: {
        name: event.profile?.firstName || 'User'
      }
    });
  } catch (error) {
    console.error('Error sending verification confirmation:', error);
  }
};

const handleReporterFollowed = async (event) => {
  try {
    // Send notification to reporter about new follower
    await sendPushNotification({
      userId: event.reporterId,
      title: 'New Follower',
      body: `You have a new follower!`,
      data: {
        type: 'follower',
        followerId: event.userId
      }
    });
  } catch (error) {
    console.error('Error sending follower notification:', error);
  }
};