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

## Learning Analytics Endpoints

All learning analytics endpoints require authentication via JWT token.

### Start Learning Module
**POST** `/learning/module/start`

**Request Body:**
```json
{
  "moduleId": "contract-basics",
  "moduleName": "Contract Basics: What Every Artist Must Know"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Module started successfully",
  "data": {
    "progressId": "123e4567-e89b-12d3-a456-426614174000",
    "moduleId": "contract-basics",
    "moduleName": "Contract Basics: What Every Artist Must Know",
    "startedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

### Complete Learning Module
**POST** `/learning/module/complete`

**Request Body:**
```json
{
  "moduleId": "contract-basics",
  "quizScore": 85
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Module completed successfully",
  "data": {
    "progressId": "123e4567-e89b-12d3-a456-426614174000",
    "moduleId": "contract-basics",
    "moduleName": "Contract Basics: What Every Artist Must Know",
    "quizScore": 85,
    "attemptsCount": 2,
    "completedAt": "2024-01-15T10:30:00.000Z",
    "timeSpent": 30
  }
}
```

### Record Quiz Attempt
**POST** `/learning/quiz/attempt`

**Request Body:**
```json
{
  "moduleId": "contract-basics",
  "score": 75
}
```

### Get Learning Progress
**GET** `/learning/progress`

**Query Parameters:**
- `completed` (boolean, optional): Filter by completion status

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "progress": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "moduleId": "contract-basics",
        "moduleName": "Contract Basics",
        "completed": true,
        "quizScore": 85,
        "attemptsCount": 2,
        "createdAt": "2024-01-15T10:00:00.000Z",
        "completedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "summary": {
      "total": 5,
      "completed": 3,
      "inProgress": 2,
      "averageScore": 82,
      "highestScore": 95,
      "totalAttempts": 8
    }
  }
}
```

### Get Module Progress
**GET** `/learning/progress/:moduleId`

### Get Learning Statistics
**GET** `/learning/stats`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalModulesStarted": 8,
      "totalModulesCompleted": 6,
      "completionRate": 75,
      "averageQuizScore": 82,
      "highestQuizScore": 95,
      "lowestQuizScore": 65,
      "totalQuizAttempts": 12,
      "averageAttemptsPerModule": 1.5,
      "lastCompletedModule": {
        "moduleId": "marketing-basics",
        "moduleName": "Marketing Your Music",
        "completedAt": "2024-01-20T14:30:00.000Z",
        "score": 88
      }
    },
    "scoreDistribution": {
      "excellent": 3,
      "good": 2,
      "fair": 1,
      "poor": 0
    },
    "learningTrend": "improving",
    "recentProgress": []
  }
}
```

### Get Learning Recommendations
**GET** `/learning/recommendations`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "completedCount": 6,
    "recommendationCount": 3,
    "recommendations": [
      {
        "type": "incomplete",
        "priority": "high",
        "message": "Continue your learning journey",
        "modules": [
          {
            "moduleId": "advanced-contracts",
            "moduleName": "Advanced Contract Negotiation",
            "attemptsCount": 1,
            "timeSpent": 15
          }
        ]
      },
      {
        "type": "retry",
        "priority": "medium",
        "message": "Improve your understanding with these modules",
        "modules": [
          {
            "moduleId": "royalties-101",
            "moduleName": "Understanding Royalties",
            "score": 65,
            "attempts": 2
          }
        ]
      }
    ]
  }
}
```

### Reset Module Progress
**DELETE** `/learning/progress/:moduleId`

### Get Learning Leaderboard
**GET** `/learning/leaderboard`

**Query Parameters:**
- `metric` (string, default: completion): Leaderboard metric (completion/score)
- `limit` (number, default: 10): Number of entries

## Lesson Tracking Endpoints

### Track Lesson View
**POST** `/lessons/view`

**Request Body:**
```json
{
  "lessonTitle": "Understanding Record Label Advances",
  "scenarioTitle": "The Indie Label Offer",
  "conceptTaught": "contract-basics",
  "timeSpent": 5,
  "difficulty": "intermediate"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Lesson view recorded successfully",
  "data": {
    "totalLessonsViewed": 25,
    "uniqueConceptsLearned": 8,
    "totalLearningTime": 180,
    "newConceptLearned": false
  }
}
```

### Mark Concept as Mastered
**POST** `/lessons/concept/master`

**Request Body:**
```json
{
  "conceptId": "contract-negotiation",
  "conceptName": "Contract Negotiation Basics",
  "masteryLevel": "intermediate"
}
```

### Track Lesson Engagement
**POST** `/lessons/engagement`

**Request Body:**
```json
{
  "lessonId": "lesson-001",
  "scenarioId": "scenario-indie-label",
  "engagementType": "complete",
  "timeSpent": 8,
  "userRating": 4,
  "difficulty": "medium"
}
```

### Get Lesson Statistics
**GET** `/lessons/stats`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalLessonsViewed": 25,
    "uniqueConceptsLearned": 8,
    "conceptsMastered": 12,
    "totalLearningTime": 180,
    "masteryDistribution": {
      "basic": 4,
      "intermediate": 6,
      "advanced": 2,
      "expert": 0
    },
    "engagementSummary": {
      "totalLessonsEngaged": 15,
      "totalCompletions": 12,
      "totalSkips": 2,
      "averageRating": 4.2,
      "completionRate": 80
    },
    "conceptMastery": [],
    "recentConcepts": []
  }
}
```

### Get Concept Mastery Details
**GET** `/lessons/concepts`

**Query Parameters:**
- `masteryLevel` (string, optional): Filter by mastery level

### Get Lesson Engagement Details
**GET** `/lessons/engagement/:lessonId`

## Analytics Dashboard Endpoints

### Get Analytics Overview
**GET** `/analytics/overview`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "username": "musicmaker123",
      "email": "user@example.com",
      "joinedAt": "2024-01-01T00:00:00.000Z",
      "lastActive": "2024-01-20T15:30:00.000Z"
    },
    "learning": {
      "modulesStarted": 8,
      "modulesCompleted": 6,
      "completionRate": 75,
      "averageQuizScore": 82,
      "totalLessonsViewed": 25,
      "totalLearningTime": 180,
      "conceptsMastered": 12
    },
    "gaming": {
      "totalCareers": 15,
      "averageCareerLength": 85,
      "longestCareerWeeks": 240,
      "activeSaves": 3,
      "totalGamesPlayed": 15,
      "gamesLostToDebt": 5,
      "gamesLostToBurnout": 3
    },
    "achievements": {
      "totalUnlocked": 22
    },
    "insights": {
      "learningToPerformanceCorrelation": "positive",
      "recommendedFocus": "advanced_strategies",
      "overallEngagement": "high"
    }
  }
}
```

### Get Learning Journey
**GET** `/analytics/learning-journey`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "journey": [
      {
        "moduleId": "contract-basics",
        "moduleName": "Contract Basics",
        "orderInJourney": 1,
        "startedAt": "2024-01-15T10:00:00.000Z",
        "completedAt": "2024-01-15T10:30:00.000Z",
        "completed": true,
        "quizScore": 85,
        "attempts": 2,
        "timeToComplete": 30,
        "difficulty": "medium"
      }
    ],
    "insights": {
      "totalModules": 8,
      "completionRate": 75,
      "learningConsistency": "consistent",
      "patterns": {
        "averageTimeToComplete": 25,
        "averageAttempts": 1.5,
        "learningVelocity": "moderate",
        "strongestAreas": ["Contract Basics", "Marketing"],
        "improvementAreas": ["Advanced Royalties"]
      }
    },
    "milestones": []
  }
}
```

### Get Performance Trends
**GET** `/analytics/performance-trends`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "careerNumber": 1,
        "date": "2024-01-10T00:00:00.000Z",
        "weeksPlayed": 45,
        "gameEndReason": "bankruptcy",
        "difficulty": "realistic",
        "finalScore": 850,
        "achievementsEarned": 2,
        "modulesCompletedBeforeCareer": 0,
        "learningAdvantage": false
      }
    ],
    "insights": {
      "totalCareers": 15,
      "averageSurvival": 85,
      "improvementTrend": "improving",
      "learningImpact": {
        "improvement": 35,
        "avgWithLearning": 105,
        "avgWithoutLearning": 65,
        "significance": "high"
      },
      "bestPerformance": {},
      "recentTrend": "improving"
    },
    "correlations": {
      "learningToPerformance": "positive",
      "difficultyToSurvival": {
        "beginner": 120,
        "realistic": 85,
        "hardcore": 45
      }
    }
  }
}
```

### Get Educational Effectiveness
**GET** `/analytics/educational-effectiveness`

### Get Progress Dashboard
**GET** `/analytics/progress-dashboard`

**Query Parameters:**
- `timeframe` (string, default: 30d): Time range (7d/30d/90d/all)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "timeframe": "30d",
    "dateRange": {
      "start": "2023-12-21T00:00:00.000Z",
      "end": "2024-01-20T00:00:00.000Z"
    },
    "learning": {
      "modulesStarted": 3,
      "modulesCompleted": 2,
      "averageScore": 85,
      "totalTime": 90,
      "dailyProgress": []
    },
    "gaming": {
      "careersPlayed": 5,
      "averageSurvival": 95,
      "bestPerformance": 180,
      "difficultyDistribution": {
        "beginner": 1,
        "realistic": 3,
        "hardcore": 1
      },
      "performanceTimeline": []
    },
    "engagement": {
      "totalLessonsViewed": 15,
      "conceptsMastered": 8,
      "engagementScore": 85,
      "streaks": {
        "learningStreak": 5,
        "playingStreak": 3,
        "longestLearningStreak": 10,
        "longestPlayingStreak": 7
      }
    }
  }
}
```

## Testing Learning Analytics API

Once PostgreSQL is running, you can test the learning analytics endpoints:

### 1. Start a Learning Module
```bash
curl -X POST http://localhost:3001/api/learning/module/start \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "moduleId": "contract-basics",
    "moduleName": "Contract Basics: What Every Artist Must Know"
  }'
```

### 2. Complete Module with Quiz Score
```bash
curl -X POST http://localhost:3001/api/learning/module/complete \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "moduleId": "contract-basics",
    "quizScore": 85
  }'
```

### 3. Track Lesson View
```bash
curl -X POST http://localhost:3001/api/lessons/view \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lessonTitle": "Understanding Record Label Advances",
    "conceptTaught": "contract-basics",
    "timeSpent": 5
  }'
```

### 4. Get Learning Statistics
```bash
curl http://localhost:3001/api/learning/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Get Analytics Overview
```bash
curl http://localhost:3001/api/analytics/overview \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. Get Learning Recommendations
```bash
curl http://localhost:3001/api/learning/recommendations \
  -H "Authorization: Bearer YOUR_TOKEN"
```