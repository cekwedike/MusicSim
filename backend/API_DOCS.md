# MusicSim Backend API Documentation

## Overview
The MusicSim Backend provides a RESTful API for user authentication, game state management, and learning progress tracking. All responses follow a consistent JSON format.

## Base URL
```
Development: http://localhost:3001/api
Production: [Your production URL]/api
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer your-jwt-token-here
```

## Authentication Endpoints

### Register New User
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username123",
  "password": "SecurePassword123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "username": "username123"
    }
  }
}
```

### Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "emailOrUsername": "user@example.com",
  "password": "SecurePassword123"
}
```

### Get Current User
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer your-jwt-token-here
```

## Development Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and JWT secret
   ```

3. **Initialize Database**
   ```bash
   npm run db:init
   ```

4. **Start Server**
   ```bash
   npm run dev
   ```

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "TestPassword123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "test@example.com",
    "password": "TestPassword123"
  }'
```

## Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: 7-day expiration, signed with secret key
- **Input Validation**: Comprehensive validation for all inputs
- **SQL Injection Protection**: Sequelize ORM prevents SQL injection
- **CORS Configuration**: Configurable cross-origin resource sharing

## Game State Management Endpoints

All game state endpoints require authentication via JWT token.

### Save Game State
**POST** `/game/save`

**Headers:**
```
Authorization: Bearer your-jwt-token-here
```

**Request Body:**
```json
{
  "slotName": "my-save-slot",
  "gameState": {
    "artistName": "John Doe",
    "artistGenre": "Rock",
    "difficulty": "realistic",
    "playerStats": {
      "cash": 10000,
      "fans": 1500,
      "reputation": 75
    },
    "date": {
      "year": 2,
      "month": 3,
      "week": 2
    }
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Game saved successfully",
  "data": {
    "saveId": "123e4567-e89b-12d3-a456-426614174000",
    "slotName": "my-save-slot",
    "artistName": "John Doe",
    "genre": "Rock",
    "difficulty": "realistic",
    "weeksPlayed": 50,
    "savedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Load Game by Slot Name
**GET** `/game/load/:slotName`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "saveId": "123e4567-e89b-12d3-a456-426614174000",
    "slotName": "my-save-slot",
    "gameState": {
      "artistName": "John Doe",
      "artistGenre": "Rock",
      "difficulty": "realistic",
      "playerStats": {
        "cash": 10000,
        "fans": 1500,
        "reputation": 75
      },
      "date": {
        "year": 2,
        "month": 3,
        "week": 2
      }
    },
    "artistName": "John Doe",
    "genre": "Rock",
    "difficulty": "realistic",
    "weeksPlayed": 50,
    "savedAt": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-15T09:00:00.000Z",
    "lastPlayedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Load Game by ID
**GET** `/game/load/id/:saveId`

### List All Saves
**GET** `/game/saves`

**Query Parameters:**
- `limit` (number, default: 20): Maximum number of saves to return
- `offset` (number, default: 0): Number of saves to skip

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "saves": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "slotName": "my-save-slot",
        "artistName": "John Doe",
        "genre": "Rock",
        "difficulty": "realistic",
        "weeksPlayed": 50,
        "createdAt": "2024-01-15T09:00:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "lastPlayedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 5,
      "limit": 20,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

### Delete Save
**DELETE** `/game/save/:saveId`

### Delete All Saves
**DELETE** `/game/saves/all`

### Check Autosave
**GET** `/game/autosave`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "exists": true,
    "autosave": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "artistName": "John Doe",
      "genre": "Rock",
      "difficulty": "realistic",
      "weeksPlayed": 50,
      "savedAt": "2024-01-15T10:30:00.000Z",
      "lastPlayedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Rename Save Slot
**POST** `/game/save/rename`

**Request Body:**
```json
{
  "saveId": "123e4567-e89b-12d3-a456-426614174000",
  "newSlotName": "new-slot-name"
}
```

### Get Save Counts
**GET** `/game/saves/count`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 8,
    "byDifficulty": [
      {
        "difficulty": "beginner",
        "count": "3"
      },
      {
        "difficulty": "realistic",
        "count": "4"
      },
      {
        "difficulty": "hardcore",
        "count": "1"
      }
    ]
  }
}
```

## Career History Endpoints

All career history endpoints require authentication via JWT token.

### Record Completed Career
**POST** `/career/complete`

**Request Body:**
```json
{
  "artistName": "John Doe",
  "genre": "Rock",
  "difficulty": "realistic",
  "finalStats": {
    "cash": 50000,
    "fans": 10000,
    "reputation": 85
  },
  "gameEndReason": "retirement",
  "weeksPlayed": 200,
  "achievements": ["First Hit", "Gold Album", "World Tour"],
  "finalScore": 8500
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Career recorded successfully",
  "data": {
    "careerHistoryId": "456e7890-e89b-12d3-a456-426614174000",
    "artistName": "John Doe",
    "genre": "Rock",
    "difficulty": "realistic",
    "weeksPlayed": 200,
    "yearsSurvived": 4,
    "finalScore": 8500,
    "completedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

### Get Career History
**GET** `/career/history`

**Query Parameters:**
- `limit` (number, default: 20): Maximum number of careers to return
- `offset` (number, default: 0): Number of careers to skip
- `difficulty` (string, optional): Filter by difficulty
- `genre` (string, optional): Filter by genre
- `sortBy` (string, default: completedAt): Sort field
- `sortOrder` (string, default: desc): Sort order (asc/desc)

### Get Career Statistics
**GET** `/career/stats`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalCareers": 15,
      "totalAchievements": 45,
      "uniqueAchievements": 12
    },
    "bestCareer": {
      "artistName": "Best Artist",
      "genre": "Pop",
      "difficulty": "hardcore",
      "weeksPlayed": 300,
      "yearsSurvived": 6,
      "finalScore": 12000,
      "completedAt": "2024-01-10T15:30:00.000Z"
    },
    "statistics": {
      "byDifficulty": [
        {
          "difficulty": "beginner",
          "averageWeeks": 120,
          "totalCareers": 5,
          "bestWeeks": 180
        }
      ],
      "byGenre": [
        {
          "genre": "Rock",
          "count": 8,
          "averageWeeks": 150
        }
      ],
      "endReasons": [
        {
          "reason": "retirement",
          "count": 5
        },
        {
          "reason": "bankruptcy",
          "count": 3
        }
      ]
    },
    "achievements": {
      "topAchievements": [
        {
          "name": "First Hit",
          "count": 12
        }
      ],
      "totalEarned": 45,
      "uniqueCount": 12
    },
    "recentCareers": []
  }
}
```

### Get Leaderboard
**GET** `/career/leaderboard`

**Query Parameters:**
- `difficulty` (string, default: all): Filter by difficulty
- `metric` (string, default: weeksPlayed): Leaderboard metric
- `limit` (number, default: 10): Number of entries to return

### Get Career Details
**GET** `/career/:careerHistoryId`

### Delete Career Record
**DELETE** `/career/:careerHistoryId`

### Get Achievement Summary
**GET** `/career/achievements/summary`

## Error Responses

All endpoints may return these error responses:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation error message"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error"
}
```