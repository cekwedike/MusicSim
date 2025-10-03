# MusicSim Backend

This is the backend server for the MusicSim game, providing API endpoints for user authentication, game state management, career tracking, and learning analytics.

## 🚀 Quick Start

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The server will start on http://localhost:3001

## 📖 API Documentation

**Swagger UI is available at: http://localhost:3001/api-docs**

The interactive API documentation includes:
- All endpoint details with request/response schemas
- Authentication examples with JWT tokens
- Interactive testing interface
- Complete data model definitions

### API Endpoints Overview

- **Authentication**: `/api/auth` - User registration, login, logout
- **Game State**: `/api/game` - Save/load game progress
- **Career History**: `/api/career` - Track completed careers and achievements
- **Learning Analytics**: `/api/learning` - Educational progress tracking
- **Lesson Tracking**: `/api/lessons` - Individual lesson engagement
- **Analytics Dashboard**: `/api/analytics` - Comprehensive user insights

3. Start the development server:
```bash
npm run dev
```

The backend server will run on http://localhost:3001

## API Endpoints

- `GET /api/health` - Health check endpoint