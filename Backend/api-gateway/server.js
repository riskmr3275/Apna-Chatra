import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'API Gateway', timestamp: new Date().toISOString() });
});

// Public routes (no auth required)
app.use('/api/v1/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/auth': '/api/v1/auth' }
}));

// Public article routes
app.use('/api/v1/articles/public', createProxyMiddleware({
  target: process.env.ARTICLE_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/articles/public': '/api/v1/articles/public' }
}));

// Protected routes
app.use('/api/v1/user', authMiddleware, createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/user': '/api/v1/user' }
}));

app.use('/api/v1/reporter', authMiddleware, createProxyMiddleware({
  target: process.env.REPORTER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/reporter': '/api/v1/reporter' }
}));

app.use('/api/v1/admin', authMiddleware, createProxyMiddleware({
  target: process.env.ADMIN_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/admin': '/api/v1/admin' }
}));

app.use('/api/v1/articles', authMiddleware, createProxyMiddleware({
  target: process.env.ARTICLE_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/articles': '/api/v1/articles' }
}));

app.use('/api/v1/notifications', authMiddleware, createProxyMiddleware({
  target: process.env.NOTIFICATION_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/notifications': '/api/v1/notifications' }
}));

app.use('/api/v1/analytics', authMiddleware, createProxyMiddleware({
  target: process.env.ANALYTICS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/analytics': '/api/v1/analytics' }
}));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});