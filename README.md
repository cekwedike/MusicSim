# MusicSim: Music Business Simulation

A comprehensive strategic music business simulation that empowers players to navigate the complex world of the music industry. Players make critical decisions that shape their artist's career, reputation, and financial success while learning real-world business concepts that apply to the African music industry and beyond.

Visit the official website: https://www.musicsim.net

## Overview

MusicSim is an educational simulation game designed to bridge the gap between music creation and business acumen. Players develop industry knowledge through interactive scenarios that mirror real-world challenges faced by recording artists, from contract negotiations to revenue optimization.

## Demo Videos

**[Watch MusicSim in Action](https://www.loom.com/share/4d77df71abf64e25ab0583a1e1e66496)**

These demonstrations showcase the complete gameplay experience, from initial artist setup through complex career management scenarios and strategic decision-making processes.

## Features

### Core Gameplay Mechanics
- **Career Management**: Guide your artist through realistic career progression spanning weeks, months, and years of industry challenges
- **Strategic Decision Making**: Navigate over 100 complex scenarios with meaningful long-term consequences affecting cash flow, reputation, and industry relationships
- **Three Difficulty Levels**: Easy, Realistic, and Hard modes with different starting conditions and industry pressures
- **Dynamic Scenario System**: Extensive scenario bank featuring contract negotiations, marketing decisions, collaboration opportunities, and crisis management
- **Achievement System**: Comprehensive achievement tracking for career milestones, learning goals, and strategic decisions
- **Real-time Consequences**: Decisions affect multiple game metrics including cash, fame, well-being, and hype

### Educational Framework
- **Music Business Academy**: Interactive learning modules covering contracts, revenue streams, rights management, and industry law
- **Concept Mastery Tracking**: Monitor progression through business skills and applied knowledge
- **Contextual Learning**: Scenarios provide educational outcomes explaining industry mechanisms and best practices
- **African Music Industry Focus**: Special emphasis on challenges and opportunities within African music markets
- **Practical Application**: Learning modules directly connect to in-game scenarios for immediate application

### Analytics and Progress Management
- **Career History**: Comprehensive tracking of multiple playthroughs with detailed outcome comparisons
- **Learning Analytics**: Detailed insights into educational progress and knowledge retention
- **Performance Metrics**: Track decision-making patterns, success rates, and areas for improvement
- **Statistics Dashboard**: Visual representations of career progression and learning achievements
- **Save/Load System**: Multiple save slots with automatic cloud synchronization for authenticated users

### Account and Authentication Features
- **Guest Mode**: Full gameplay access without registration using secure local storage
- **User Accounts**: Enhanced experience with cloud saves and cross-device progression
- **JWT-based Security**: Industry-standard authentication with secure token management
- **Progress Synchronization**: Seamless data sync across multiple devices and platforms
- **Privacy Controls**: Comprehensive data management and privacy settings

### User Interface and Experience
- **Responsive Design**: Fully optimized for desktop computers, tablets, and mobile devices
- **Modern React Interface**: Built with TypeScript and contemporary UI/UX principles
- **Interactive Tutorial**: Comprehensive guided onboarding system for new players
- **Mistake Prevention**: Intelligent warning system for potentially harmful decisions
- **Accessibility Features**: Screen reader support and keyboard navigation
- **Progressive Web App**: Installable application with offline capabilities

## Project Architecture

```
MusicSim/
├── frontend/              # React + TypeScript application source
│   ├── components/        # Reusable UI components
│   ├── services/          # API integration & game logic
│   ├── data/              # Game content & configuration
│   ├── contexts/          # React context providers
│   ├── constants/         # Application constants
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   ├── scripts/           # Build and utility scripts
│   ├── public/            # Static assets and audio files
│   ├── index.html         # HTML entry point
│   └── index.tsx          # Application entry point
├── backend/               # Express.js + PostgreSQL backend
│   ├── routes/            # API endpoint definitions
│   ├── models/            # Database schemas (Sequelize)
│   ├── middleware/        # Express middleware
│   ├── config/            # Configuration files (Supabase connection)
│   ├── migrations/        # Database migration scripts
│   ├── scripts/           # Database utilities
│   ├── constants/         # Backend constants
│   ├── utils/             # Utility functions
│   ├── server.js          # Express server entry point
│   └── package.json       # Backend dependencies
├── dist/                  # Production build output (generated)
├── docs/                  # Documentation files
├── .github/               # GitHub workflows and CI/CD
│   └── workflows/         # Automated workflows
├── vite.config.ts         # Vite build configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── package.json           # Root package configuration
```

## Quick Start

### Prerequisites
- **Node.js** (v16 or higher recommended)
- **npm** (comes with Node.js)
- **Supabase account** (for backend database - optional for frontend-only development)

### Play Now (Fastest)
```bash
# Clone the repository
git clone https://github.com/cekwedike/MusicSim.git
cd MusicSim

# Install dependencies and start both frontend & backend
npm install
npm run dev
```

**Open your browser to:**
- **Game Interface**: http://localhost:5173/
- **API Documentation**: http://localhost:3001/api-docs

### Development Setup

#### 1. **Clone and Install**
```bash
git clone https://github.com/cekwedike/MusicSim.git
cd MusicSim

# Install root dependencies (includes concurrently for parallel execution)
npm install

# Install backend dependencies
npm run install:backend
```

#### 2. **Environment Configuration**
Create environment files for API keys and configuration:

**Frontend** (`frontend/.env.local`):
```env
VITE_API_URL=http://localhost:3001
```

**Backend** (`backend/.env`):
```env
# Database - Supabase Connection
DATABASE_URL=your_supabase_connection_string

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
NODE_ENV=development
PORT=3001

# Optional: Session Secret
SESSION_SECRET=your_session_secret_here
```

#### 3. **Database Setup**
For full backend features including user accounts and cloud saves:

1. Create a Supabase project at https://supabase.com
2. Get your database connection string from project settings
3. Add the connection string to `backend/.env` as `DATABASE_URL`
4. Run migrations:
```bash
# The database will be initialized automatically on first start
npm run dev:backend

# Or manually run migrations:
cd backend
npm run migrate
```

#### 4. **Start Development**
```bash
# Start both frontend and backend simultaneously
npm run dev

# OR start individually:
npm run dev:frontend  # Frontend only (port 5173)
npm run dev:backend   # Backend only (port 3001)
```

## Usage

### Playing the Game

1. **Start**: Choose to play as guest or create an account
2. **Artist Setup**: Create your artist persona and select difficulty
3. **Gameplay**: Navigate scenarios and make strategic decisions
4. **Track Progress**: Monitor stats, achievements, and learning
5. **Save/Load**: Manage multiple career playthroughs

### Learning Features

- **Learning Hub**: Access educational modules about the music industry
- **Knowledge Tracking**: See what concepts you've mastered
- **Progress Analytics**: Understand your learning journey
- **Scenario Integration**: Apply learned concepts in gameplay

### Account Benefits

| Feature | Guest Mode | Authenticated |
|---------|------------|---------------|
| Core Gameplay | Full Access | Full Access |
| Local Saves | localStorage | localStorage |
| Cloud Saves | Not Available | Synchronized |
| Analytics | Limited | Comprehensive |
| Cross-Device | No Sync | Full Sync |
| Learning Progress | Local Only | Tracked & Analyzed |

## Available Scripts

### Root Directory
```bash
npm run dev              # Start both frontend & backend concurrently
npm run dev:frontend     # Frontend development server only (port 5173)
npm run dev:backend      # Backend development server only (port 3001)
npm run build            # Build frontend for production
npm run preview          # Preview production build locally
npm run test             # Run frontend tests with Vitest
npm run test:ci          # Run tests with coverage
npm start               # Start both servers in production mode
npm run install:all      # Install all dependencies (root + backend)
npm run install:backend  # Install backend dependencies only
npm run security:audit   # Security audit for all packages
npm run deps:check       # Check for outdated dependencies
npm run clean            # Clean build artifacts and caches
```

### Backend Directory
```bash
npm start                # Start production server with migrations
npm run start:no-migrate # Start without running migrations
npm run dev              # Start development server with nodemon
npm test                 # Run backend API tests
npm run test:ci          # Run tests with coverage
npm run migrate          # Run database migrations
npm run db:init          # Initialize database schema
npm run db:reset         # Reset database (caution: deletes data)
npm run db:status        # Check database connection
npm run security:audit   # Security audit for backend packages
```

## API Documentation

**Interactive Swagger UI**: http://localhost:3001/api-docs

### API Endpoints

| Endpoint | Purpose | Authentication |
|----------|---------|----------------|
| `POST /api/auth/register` | User registration | Public |
| `POST /api/auth/login` | User login | Public |
| `POST /api/game/save` | Save game state | Required |
| `GET /api/game/saves` | List saved games | Required |
| `POST /api/career/complete` | Record career completion | Required |
| `GET /api/analytics/overview` | User analytics dashboard | Required |

## Testing

```bash
# Frontend tests (Vitest)
npm run test              # Run tests in watch mode
npm run test:ci           # Run tests with coverage report

# Backend API tests (Jest)
cd backend
npm test                  # Run all backend tests
npm run test:ci           # Run tests with coverage

# Run all tests
npm run ci:test           # Run both frontend and backend tests
```

## Deployment

The application is deployed using the following infrastructure:

### Frontend - Vercel
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. The `dist/` folder is automatically deployed to Vercel
3. Environment variables (e.g., `VITE_API_URL`) are configured in Vercel dashboard
4. Production URL: https://www.musicsim.net

### Backend - Render
1. Deployed directly from the `backend/` directory
2. Environment variables configured in Render dashboard:
   - `DATABASE_URL` (Supabase connection string)
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `SESSION_SECRET`
3. Migrations run automatically on deployment via `npm start`
4. Backend API health check: `/api/health`

### Database - Supabase
- Managed PostgreSQL database
- Connection string available in Supabase project settings
- Automatic backups and scaling included

### Deployment Status
The production system is verified and operational on Vercel (frontend), Render (backend), and Supabase (database). All core features including authentication, game saves, and analytics are functional.

## Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Create** a Pull Request

### Development Guidelines
- **TypeScript**: Use TypeScript for all frontend code
- **Code Quality**: Write clean, maintainable code with clear naming
- **Documentation**: Add JSDoc comments for API endpoints and complex functions
- **Testing**: Include tests for new features and API endpoints
- **Git Commits**: Use clear, descriptive commit messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **React**: UI framework for building the frontend
- **Vite**: Fast build tool and development server
- **TypeScript**: Type-safe development
- **Node.js & Express**: Backend server runtime
- **PostgreSQL**: Relational database (via Supabase)
- **Supabase**: Managed database hosting
- **Render**: Backend deployment platform
- **Vercel**: Frontend deployment platform
- **Sequelize**: Database ORM
- **Vitest**: Frontend testing framework
- **Jest**: Backend testing framework
- **Tailwind CSS**: Utility-first CSS framework

## Support

- **Issues**: [GitHub Issues](https://github.com/cekwedike/MusicSim/issues)
- **Discussions**: [GitHub Discussions](https://github.com/cekwedike/MusicSim/discussions)
- **Email**: support@musicsim.dev

---

**Ready to build your music empire? [Start playing now!](http://www.musicsim.net)**
