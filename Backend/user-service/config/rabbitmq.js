import amqp from 'amqplib';

let connection = null;
let channel = null;

export const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    
    // Declare exchanges
    await channel.assertExchange('user.events', 'topic', { durable: true });
    
    console.log('🐰 RabbitMQ Connected');
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
    setTimeout(connectRabbitMQ, 5000);
  }
};

export const publishEvent = async (exchange, routingKey, data) => {
  try {
    if (!channel) {
      throw new Error('RabbitMQ channel not available');
    }
    
    const message = JSON.stringify({
      ...data,
      timestamp: new Date().toISOString()
    });
    
    await channel.publish(exchange, routingKey, Buffer.from(message));
    console.log(`📤 Event published: ${routingKey}`);
  } catch (error) {
    console.error('Error publishing event:', error);
  }
};

export { channel };