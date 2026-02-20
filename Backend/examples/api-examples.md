# API Examples

## Authentication

### Register User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securepassword123",
    "role": "user",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "location": "New York, USA"
    }
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }'
```

## Articles

### Get Public Articles
```bash
curl -X GET "http://localhost:3000/api/v1/articles/public?page=1&limit=10&category=technology"
```

### Get Trending Articles
```bash
curl -X GET "http://localhost:3000/api/v1/articles/public/trending?limit=5"
```

### Create Article (Authenticated)
```bash
curl -X POST http://localhost:3000/api/v1/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "The Future of Artificial Intelligence in News Reporting",
    "content": "Artificial intelligence is revolutionizing the way news is gathered, processed, and delivered to audiences worldwide...",
    "category": "technology",
    "tags": ["AI", "journalism", "technology", "future"],
    "media": {
      "featuredImage": {
        "url": "https://example.com/ai-news.jpg",
        "alt": "AI in journalism",
        "caption": "AI tools are transforming newsrooms"
      }
    }
  }'
```

### Like Article
```bash
curl -X POST http://localhost:3000/api/v1/articles/ARTICLE_ID/like \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## User Profile

### Get Profile
```bash
curl -X GET http://localhost:3000/api/v1/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Profile
```bash
curl -X PUT http://localhost:3000/api/v1/user/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "bio": "Tech enthusiast and news reader",
      "location": "San Francisco, CA"
    },
    "preferences": {
      "categories": ["technology", "science", "business"],
      "notifications": {
        "email": true,
        "push": true,
        "breaking": true
      }
    }
  }'
```

### Add Bookmark
```bash
curl -X POST http://localhost:3000/api/v1/user/bookmarks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "articleId": "653ab12df456789012345678",
    "title": "AI Revolution in Journalism"
  }'
```

### Follow Reporter
```bash
curl -X POST http://localhost:3000/api/v1/user/follow \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "reporterId": "653ab101e789012345678902",
    "reporterName": "Jane Smith"
  }'
```

## Comments

### Add Comment
```bash
curl -X POST http://localhost:3000/api/v1/articles/ARTICLE_ID/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "content": "Great article! Very informative and well-researched."
  }'
```

### Reply to Comment
```bash
curl -X POST http://localhost:3000/api/v1/articles/ARTICLE_ID/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "content": "I agree with your point about AI ethics.",
    "parentComment": "PARENT_COMMENT_ID"
  }'
```

## Notifications

### Subscribe to Push Notifications
```bash
curl -X POST http://localhost:3000/api/v1/notifications/subscribe \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "subscription": {
      "endpoint": "https://fcm.googleapis.com/fcm/send/...",
      "keys": {
        "p256dh": "...",
        "auth": "..."
      }
    }
  }'
```

## Health Checks

### Check All Services
```bash
# API Gateway
curl http://localhost:3000/health

# Auth Service
curl http://localhost:3001/health

# User Service
curl http://localhost:3002/health

# Article Service
curl http://localhost:3005/health

# Notification Service
curl http://localhost:3006/health
```