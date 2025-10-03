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