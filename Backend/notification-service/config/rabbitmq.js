import amqp from 'amqplib';
import { handleUserEvents } from '../handlers/userEventHandler.js';
import { handleArticleEvents } from '../handlers/articleEventHandler.js';

let connection = null;
let channel = null;

export const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    
    // Declare exchanges
    await channel.assertExchange('user.events', 'topic', { durable: true });
    await channel.assertExchange('article.events', 'topic', { durable: true });
    
    console.log('🐰 RabbitMQ Connected');
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
    setTimeout(connectRabbitMQ, 5000);
  }
};

export const setupEventListeners = async () => {
  try {
    // User events queue
    const userQueue = await channel.assertQueue('notification.user.events', { durable: true });
    await channel.bindQueue(userQueue.queue, 'user.events', 'user.*');
    
    // Article events queue
    const articleQueue = await channel.assertQueue('notification.article.events', { durable: true });
    await channel.bindQueue(articleQueue.queue, 'article.events', 'article.*');
    
    // Consume user events
    channel.consume(userQueue.queue, async (msg) => {
      if (msg) {
        try {
          const event = JSON.parse(msg.content.toString());
          await handleUserEvents(event, msg.fields.routingKey);
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing user event:', error);
          channel.nack(msg, false, false); // Don't requeue
        }
      }
    });
    
    // Consume article events
    channel.consume(articleQueue.queue, async (msg) => {
      if (msg) {
        try {
          const event = JSON.parse(msg.content.toString());
          await handleArticleEvents(event, msg.fields.routingKey);
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing article event:', error);
          channel.nack(msg, false, false); // Don't requeue
        }
      }
    });
    
    console.log('📥 Event listeners setup complete');
  } catch (error) {
    console.error('Error setting up event listeners:', error);
  }
};

export { channel };