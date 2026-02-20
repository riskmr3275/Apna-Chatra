# News Website Backend Setup Guide

## Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- MongoDB (or use Docker containers)
- RabbitMQ (or use Docker containers)

## Quick Start

1. **Clone and Install Dependencies**
```bash
cd Backend
npm run install-all
```

2. **Environment Configuration**
Copy and configure environment files for each service:
```bash
# Copy example env files
cp auth-service/.env.example auth-service/.env
cp user-service/.env.example user-service/.env
cp article-service/.env.example article-service/.env
cp notification-service/.env.example notification-service/.env
cp api-gateway/.env.example api-gateway/.env

# Update MongoDB URIs, JWT secrets, email config, etc.
```

3. **Start with Docker Compose**
```bash
# Start all services
npm run dev

# Or start in detached mode
npm start

# View logs
npm run logs

# Stop services
npm stop
```

## Manual Setup (Development)

### 1. Start Infrastructure Services
```bash
# MongoDB instances
docker run -d --name mongodb-auth -p 27017:27017 mongo:7
docker run -d --name mongodb-user -p 27018:27017 mongo:7
docker run -d --name mongodb-article -p 27019:27017 mongo:7

# RabbitMQ
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=admin \
  -e RABBITMQ_DEFAULT_PASS=password \
  rabbitmq:3-management

# Redis
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

### 2. Start Services Individually
```bash
# Terminal 1 - API Gateway
cd api-gateway && npm run dev

# Terminal 2 - Auth Service
cd auth-service && npm run dev

# Terminal 3 - User Service
cd user-service && npm run dev

# Terminal 4 - Article Service
cd article-service && npm run dev

# Terminal 5 - Notification Service
cd notification-service && npm run dev
```

## Service URLs

- **API Gateway**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **User Service**: http://localhost:3002
- **Article Service**: http://localhost:3005
- **Notification Service**: http://localhost:3006
- **RabbitMQ Management**: http://localhost:15672 (admin/password)

## Testing the Setup

### 1. Health Checks
```bash
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3005/health
curl http://localhost:3006/health
```

### 2. Register a User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "profile": {
      "firstName": "Test",
      "lastName": "User"
    }
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Create an Article
```bash
curl -X POST http://localhost:3000/api/v1/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Article",
    "content": "This is a test article content with more than 100 characters to meet the minimum requirement for article content validation.",
    "category": "technology"
  }'
```

## Environment Variables

### Required for All Services
- `NODE_ENV`: development/production
- `RABBITMQ_URL`: RabbitMQ connection string

### Auth Service
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_REFRESH_SECRET`: Refresh token secret
- `SMTP_*`: Email configuration

### User Service
- `MONGODB_URI`: MongoDB connection string
- `ARTICLE_SERVICE_URL`: Article service URL

### Article Service
- `MONGODB_URI`: MongoDB connection string

### Notification Service
- `SMTP_*`: Email configuration
- `VAPID_*`: Push notification keys

### API Gateway
- `JWT_SECRET`: JWT verification secret
- `REDIS_URL`: Redis connection string
- Service URLs for all microservices

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐
│   Frontend      │────│   API Gateway    │
│   (React)       │    │   Port: 3000     │
└─────────────────┘    └──────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
        │ Auth Service │ │ User Service│ │Article Svc │
        │ Port: 3001   │ │ Port: 3002  │ │Port: 3005  │
        └──────────────┘ └─────────────┘ └────────────┘
                │               │               │
        ┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
        │   MongoDB    │ │   MongoDB   │ │  MongoDB   │
        │   Port: 27017│ │ Port: 27018 │ │Port: 27019 │
        └──────────────┘ └─────────────┘ └────────────┘
                                │
                        ┌───────▼──────┐
                        │ Notification │
                        │   Service    │
                        │ Port: 3006   │
                        └──────────────┘
                                │
                        ┌───────▼──────┐
                        │   RabbitMQ   │
                        │ Port: 5672   │
                        └──────────────┘
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Check running processes: `lsof -i :3000`
   - Kill process: `kill -9 PID`

2. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check connection string in .env files

3. **RabbitMQ Connection Failed**
   - Ensure RabbitMQ is running
   - Check credentials and URL

4. **JWT Token Issues**
   - Ensure JWT_SECRET is the same in API Gateway and Auth Service
   - Check token expiration

### Logs
```bash
# Docker logs
docker-compose logs -f service-name

# Individual service logs
cd service-name && npm run dev
```