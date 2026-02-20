# News Website Microservices Backend

A complete microservices architecture for a news website with User, Reporter, and Admin roles.

## Services Overview

- **API Gateway** - Central entry point, routing, and authentication
- **Auth Service** - Authentication and authorization
- **User Service** - User profile and interactions
- **Reporter Service** - Reporter management and article creation
- **Admin Service** - Administrative operations
- **Article Service** - Article management and search
- **Notification Service** - Event-driven notifications
- **Analytics Service** - Performance tracking

## Quick Start

```bash
# Install dependencies for all services
npm run install-all

# Start all services with Docker
docker-compose up -d

# Or start individual services
cd auth-service && npm start
```

## Architecture

Each service runs independently with its own MongoDB database and communicates via REST APIs and RabbitMQ events.

## API Documentation

- API Gateway: http://localhost:3000
- Auth Service: http://localhost:3001
- User Service: http://localhost:3002
- Reporter Service: http://localhost:3003
- Admin Service: http://localhost:3004
- Article Service: http://localhost:3005
- Notification Service: http://localhost:3006
- Analytics Service: http://localhost:3007