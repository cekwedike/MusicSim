# MusicSim Database Setup

## Prerequisites
- PostgreSQL installed and running
- Node.js installed
- Git (optional, for version control)

## Quick Setup Guide

### 1. Install PostgreSQL
If you don't have PostgreSQL installed:
- **Windows**: Download from https://www.postgresql.org/download/
- **Mac**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql`

### 2. Create Database
```bash
# Create the musicsim database
createdb musicsim

# Or using psql
psql -U postgres
CREATE DATABASE musicsim;
\q
```

### 3. Configure Environment
Update the `.env` file with your PostgreSQL credentials:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/musicsim
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
NODE_ENV=development
```

### 4. Install Dependencies
```bash
cd backend
npm install
```

### 5. Initialize Database
```bash
# Create all tables
npm run db:init

# Or reset database (WARNING: deletes all data)
npm run db:reset
```

### 6. Start Server
```bash
npm run dev
```

## Database Schema

### Tables Created:
- **Users**: User accounts with authentication
- **GameSaves**: Game state storage with JSONB for flexibility
- **LearningProgresses**: Track module completion and scores
- **CareerHistories**: Store completed game careers with analytics
- **PlayerStatistics**: Global player statistics and achievements

### Key Features:
- 🔒 **Secure Authentication**: bcrypt password hashing, JWT tokens
- 📊 **Flexible Storage**: JSONB fields for complex game states
- 🎯 **Performance**: Proper indexing on frequently queried fields
- 🔗 **Relationships**: Foreign keys maintain data integrity
- 📈 **Analytics**: Comprehensive player tracking and statistics

## API Endpoints (To Be Implemented)

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

### Game Saves
- `GET /saves` - List user's game saves
- `POST /saves` - Create new game save
- `PUT /saves/:id` - Update game save
- `DELETE /saves/:id` - Delete game save
- `POST /saves/:id/load` - Load game save

### Learning Progress
- `GET /learning/progress` - Get user's learning progress
- `POST /learning/modules/:id/complete` - Mark module as completed
- `GET /learning/stats` - Get learning statistics

### Career History
- `GET /careers` - Get user's career history
- `POST /careers` - Save completed career
- `GET /careers/stats` - Get career statistics

### Statistics
- `GET /stats` - Get player statistics
- `GET /stats/leaderboard` - Get global leaderboards

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://localhost:5432/musicsim
DB_HOST=localhost
DB_PORT=5432
DB_NAME=musicsim
DB_USER=postgres
DB_PASSWORD=

# Authentication
JWT_SECRET=your-jwt-secret-here

# Server
PORT=3001
NODE_ENV=development
```

## Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running: `pg_ctl status`
2. Check database exists: `psql -l`
3. Verify credentials in .env file
4. Check firewall settings

### Common Commands
```bash
# Check PostgreSQL status
pg_ctl status

# Start PostgreSQL (if not running)
pg_ctl start

# Connect to database
psql -d musicsim

# List all tables
\dt

# Describe table structure
\d Users
```

## Security Notes

⚠️ **Important Security Reminders:**
- Change JWT_SECRET in production
- Never commit .env file to version control
- Use environment-specific configurations
- Implement rate limiting for authentication endpoints
- Validate all user inputs
- Use HTTPS in production

## Next Steps

1. **Implement API Routes**: Create Express routes for each endpoint
2. **Add Middleware**: Authentication, validation, error handling
3. **Testing**: Unit tests for models and integration tests for APIs
4. **Deployment**: Production database setup and environment configuration

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify PostgreSQL installation and configuration
3. Ensure all dependencies are installed
4. Check the logs for detailed error messages