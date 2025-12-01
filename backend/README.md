# MusicSim Backend API Server

The MusicSim backend is a robust Express.js server providing comprehensive API endpoints for user authentication, game state management, career tracking, learning analytics, and educational progress monitoring. Built with Node.js and PostgreSQL, it supports both guest and authenticated gameplay modes.

Official website: https://www.musicsim.net

## Architecture Overview

The backend serves as the central data management system for MusicSim, handling:
- User authentication and session management
- Game state persistence and synchronization
- Career progression tracking and analytics
- Educational module completion and progress
- Learning analytics and performance insights
- Achievement system and milestone tracking

### Production Optimization

The backend has been optimized for production deployment with:
- **Error-Only Logging**: Production mode suppresses debug/info logs, only critical errors are logged
- **Performance Monitoring**: Optimized query patterns and response times
- **Security Hardening**: Rate limiting, Supabase token validation, and input sanitization
- **Efficient Data Management**: Indexed queries and connection pooling for high performance
- **Graceful Error Handling**: Comprehensive error boundaries prevent service disruption

## Technology Stack

- **Runtime**: Node.js (v16+)
- **Framework**: Express.js with middleware stack
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: Supabase OAuth (Google)
- **Documentation**: Swagger/OpenAPI 3.0
- **Validation**: Express-validator middleware
- **Error Handling**: Centralized error management
- **Security**: Helmet.js, CORS, rate limiting

## Quick Start Guide

### Prerequisites
- Node.js (version 16.0 or higher)
- npm or yarn package manager
- PostgreSQL database (optional for development)

### Installation and Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install all required dependencies:
```bash
npm install
```

3. Configure environment variables (create `.env` file):
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=musicsim
DB_USER=your_username
DB_PASSWORD=your_password
NODE_ENV=development
PORT=3001
```

4. Initialize the database (if using PostgreSQL):
```bash
npm run db:init
```

5. Start the development server:
```bash
npm run dev
```

The server will be available at http://localhost:3001

## API Documentation

**Interactive Swagger UI**: http://localhost:3001/api-docs

The comprehensive API documentation includes:
- Complete endpoint specifications with request/response schemas
- Authentication examples with Supabase OAuth token handling
- Interactive testing interface for all endpoints
- Detailed data model definitions and relationships
- Error response codes and troubleshooting guides

## API Endpoint Categories

### Authentication Endpoints (`/api/auth`)
- **POST** `/register` - User account registration
- **POST** `/login` - User authentication and token generation
- **POST** `/logout` - Session termination
- **GET** `/profile` - Retrieve user profile information
- **PUT** `/profile` - Update user profile data

### Game State Management (`/api/game`)
- **POST** `/save` - Save current game state
- **GET** `/saves` - Retrieve all saved games for user
- **GET** `/saves/:id` - Load specific game save
- **DELETE** `/saves/:id` - Delete game save
- **PUT** `/saves/:id` - Update game save metadata

### Career Tracking (`/api/career`)
- **POST** `/complete` - Record completed career
- **GET** `/history` - Retrieve career history
- **GET** `/achievements` - Get user achievements
- **GET** `/achievements/summary` - Achievement statistics
- **DELETE** `/:id` - Delete career record

### Learning Analytics (`/api/learning`)
- **POST** `/progress` - Record learning module progress
- **GET** `/progress` - Retrieve learning progress
- **GET** `/progress/:moduleId` - Get specific module progress
- **PUT** `/progress/:moduleId` - Update module progress
- **DELETE** `/progress/:moduleId` - Reset module progress

### Lesson Engagement (`/api/lessons`)
- **POST** `/view` - Track lesson views
- **POST** `/concept/master` - Record concept mastery
- **POST** `/engagement` - Track detailed engagement
- **GET** `/stats` - Retrieve lesson statistics
- **GET** `/concepts` - Get mastered concepts

### Analytics Dashboard (`/api/analytics`)
- **GET** `/overview` - Comprehensive user analytics
- **GET** `/learning-journey` - Detailed learning progression
- **GET** `/performance-trends` - Performance analytics over time
- **GET** `/educational-effectiveness` - Learning effectiveness analysis

## Database Models

### User Model
- User account information and authentication data
- Profile settings and preferences
- Account creation and last access timestamps

### GameSave Model
- Complete game state serialization
- Save metadata (name, timestamp, difficulty)
- Player statistics and progress markers

### CareerHistory Model
- Completed career records and outcomes
- Performance metrics and achievements
- Career duration and end conditions

### LearningProgress Model
- Educational module completion status
- Quiz scores and attempt tracking
- Concept mastery progression

### PlayerStatistics Model
- Comprehensive gameplay statistics
- Learning analytics and engagement metrics
- Achievement tracking and milestone records

## Development Commands

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run API endpoint tests
npm test

# Initialize database schema
npm run db:init

# Reset database to clean state
npm run db:reset

# Run database migrations
npm run migrate

# Generate API documentation
npm run docs:generate
```

## Testing Framework

The backend includes comprehensive test suites for:
- Authentication flow testing
- API endpoint validation
- Database model verification
- Error handling scenarios
- Performance benchmarking

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:auth
npm run test:game
npm run test:analytics
npm run test:learning

# Run tests with coverage report
npm run test:coverage
```

## Security Features

- **Supabase OAuth**: Secure token-based authentication via Google OAuth
- **Password Hashing**: bcrypt for secure password storage (if needed)
- **Rate Limiting**: Protection against API abuse
- **CORS Configuration**: Controlled cross-origin requests
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: Parameterized queries via Sequelize
- **XSS Protection**: Helmet.js security headers

## Performance Optimization

- **Database Indexing**: Optimized queries for frequently accessed data
- **Response Caching**: Strategic caching for static content
- **Connection Pooling**: Efficient database connection management
- **Compression**: Gzip compression for API responses
- **Query Optimization**: Efficient SQL query patterns

## Deployment Configuration

### Environment Variables

```env
# Database Configuration
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=musicsim_production
DB_USER=production_user
DB_PASSWORD=secure_password

# Server Configuration
NODE_ENV=production
PORT=3001

# CORS Settings
FRONTEND_URL=https://www.musicsim.net
```

### Production Deployment

1. Set all required environment variables
2. Run production build: `npm run build`
3. Start with process manager: `pm2 start server.js`
4. Configure reverse proxy (nginx recommended)
5. Set up SSL certificates
6. Configure database backups

## Monitoring and Logging

### Production Logging Strategy

The backend implements environment-aware logging:
- **Development Mode**: Verbose logging for debugging (console.log, console.warn, console.error)
- **Production Mode**: Error-only logging to reduce noise and improve performance
- **Structured Logging**: Consistent log format for parsing and analysis

### Logging Levels

- **Error Logging**: Comprehensive error tracking and reporting (always active)
- **Access Logs**: Request/response logging for debugging (development only)
- **Performance Metrics**: Response time and throughput monitoring
- **Database Monitoring**: Query performance and connection health
- **Health Check Endpoint**: `/api/health` for uptime monitoring

### Log Management

- Production logs are structured for integration with monitoring tools
- Error logs include stack traces and context for debugging
- Performance logs help identify bottlenecks and optimize queries
- Access logs respect user privacy and data protection regulations

## Contributing Guidelines

1. Follow existing code style and conventions
2. Add comprehensive tests for new endpoints
3. Update API documentation for any changes
4. Validate all input parameters and request bodies
5. Implement proper error handling and status codes
6. Use meaningful commit messages following conventional commits

## Support and Troubleshooting

For technical support and bug reports:
- GitHub Issues: [MusicSim Repository](https://github.com/cekwedike/MusicSim/issues)
- API Documentation: http://localhost:3001/api-docs
- Health Check: http://localhost:3001/api/health