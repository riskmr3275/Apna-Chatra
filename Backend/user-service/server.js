import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { connectRabbitMQ } from './config/rabbitmq.js';
import userRoutes from './routes/user.js';
import { errorHandler } from './middleware/errorHandler.js';
import { extractUserInfo } from './middleware/extractUserInfo.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Connect to database
connectDB();

// Connect to RabbitMQ
connectRabbitMQ();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Extract user info from headers (set by API Gateway)
app.use(extractUserInfo);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'User Service', 
    timestamp: new Date().toISOString() 
  });
});

// Routes
app.use('/api/v1/user', userRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`👤 User Service running on port ${PORT}`);
});