# MusicSim: Music Business Simulation

A comprehensive strategic music business simulation that empowers players to navigate the complex world of the music industry. Players make critical decisions that shape their artist's career, reputation, and financial success while learning real-world business concepts that apply to the African music industry and beyond.

Visit the official website: https://www.musicsim.net

## Overview

MusicSim is an educational simulation game designed to bridge the gap between music creation and business acumen. Players develop industry knowledge through interactive scenarios that mirror real-world challenges faced by recording artists, from contract negotiations to revenue optimization.

## Demo Videos

**[Watch MusicSim in Action - UPDATED](https://www.loom.com/share/4d77df71abf64e25ab0583a1e1e66496)**

**[Watch MusicSim in Action](https://www.loom.com/share/301477b7660b4f62802950b39f4910c3)**

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
├── frontend/              # React + TypeScript + Vite
│   ├── components/        # Reusable UI components
│   │   ├── Dashboard.tsx  # Game statistics display
│   │   ├── ScenarioCard.tsx # Main gameplay interface
│   │   ├── AchievementsModal.tsx # Achievement system
│   │   ├── SaveLoadModal.tsx # Save/load management
│   │   ├── LearningHub.tsx # Educational content
│   │   ├── LoginModal.tsx # Authentication UI
│   │   ├── Header.tsx     # Main navigation header
│   │   ├── Sidebar.tsx    # Navigation sidebar
│   │   ├── AudioControls.tsx # Background music system
│   │   └── TutorialOverlay.tsx # Game tutorial system
│   ├── services/          # API integration & game logic
│   │   ├── api.ts         # Axios configuration
│   │   ├── authService.ts # Authentication API
│   │   ├── gameService.ts # Game state management
│   │   ├── scenarioService.ts # Scenario generation
│   │   └── analyticsService.ts # Learning analytics
│   ├── data/              # Game content & configuration
│   │   ├── scenarios.ts   # Scenario templates
│   │   ├── achievements.ts # Achievement definitions
│   │   ├── difficultySettings.ts # Game balance
│   │   └── learningModules.ts # Educational content
│   ├── contexts/          # React context providers
│   │   ├── AuthContext.tsx # Global authentication state
│   │   ├── AudioContext.tsx # Background music control
│   │   ├── ThemeContext.tsx # UI theme management
│   │   └── ToastContext.tsx # Notification system
│   ├── constants/         # Application constants
│   │   └── genres.ts      # Music genre definitions
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   ├── scripts/           # Build and utility scripts
│   ├── public/            # Static assets and audio files
│   │   └── audio/         # Background music tracks
│   └── src/               # Additional source files
├── backend/               # Express.js + PostgreSQL
│   ├── routes/            # API endpoint definitions
│   │   ├── auth.js        # User authentication
│   │   ├── gameState.js   # Game save/load
│   │   ├── careerHistory.js # Career tracking
│   │   ├── learning.js    # Learning progress
│   │   ├── lessons.js     # Lesson engagement
│   │   ├── analytics.js   # User analytics
│   │   └── migrate.js     # Database migration endpoints
│   ├── models/            # Database schemas (Sequelize)
│   │   ├── User.js        # User accounts
│   │   ├── GameSave.js    # Game state storage
│   │   ├── CareerHistory.js # Career records
│   │   ├── LearningProgress.js # Educational tracking
│   │   ├── PlayerStatistics.js # Player analytics
│   │   └── index.js       # Model exports and associations
│   ├── middleware/        # Express middleware
│   │   ├── auth.js        # JWT authentication
│   │   └── errorHandler.js # Error management
│   ├── config/            # Configuration files
│   │   ├── database.js    # Database connection (Sequelize)
│   │   ├── supabase.js    # Supabase configuration
│   │   └── swagger.js     # API documentation
│   ├── migrations/        # Database migration scripts
│   │   ├── migrate.js     # Migration runner
│   │   └── *.sql          # SQL migration files
│   ├── scripts/           # Database utilities
│   │   ├── initDatabase.js # Database initialization
│   │   └── resetDatabase.js # Database reset
│   ├── constants/         # Backend constants
│   │   └── achievements.js # Achievement definitions
│   ├── utils/             # Utility functions
│   │   └── validation.js  # Input validation helpers
│   └── public/            # Static files served by Express
├── .github/               # GitHub workflows and templates
├── dist/                  # Production build output
├── Makefile              # CI/CD and development commands
├── metadata.json         # Project metadata
├── vercel.json           # Vercel deployment configuration
├── vite.config.ts        # Vite build configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── postcss.config.js     # PostCSS configuration
```

## Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** (optional, for full backend features)

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

**Frontend** (`.env.local`):
```env
VITE_API_URL=http://localhost:3001
```

**Backend** (`backend/.env`):
```env
# Database (optional)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=musicsim
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key

# Environment
NODE_ENV=development
PORT=3001
```

#### 3. **Database Setup** (Optional)
For full backend features including user accounts and cloud saves:

```bash
# Install PostgreSQL (if not already installed)
# Create database
createdb musicsim

# Initialize database tables
cd backend
npm run db:init
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

-- **Learning Hub**: Access educational modules about the music industry
-- **Knowledge Tracking**: See what concepts you've mastered
-- **Progress Analytics**: Understand your learning journey
-- **Scenario Integration**: Apply learned concepts in gameplay

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
npm run dev              # Start both frontend & backend
npm run dev:frontend     # Frontend development server
npm run dev:backend      # Backend development server
npm run build            # Build frontend for production
npm run preview          # Preview production build
npm start               # Start production servers
npm run install:all     # Install all dependencies
```

### Backend Directory
```bash
npm start               # Start production server
npm run dev             # Start development server (nodemon)
npm test               # Run API tests
npm run db:init        # Initialize database
npm run db:reset       # Reset database
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

## 🧪 Testing

```bash
# Backend API tests
cd backend
npm test

# Test specific routes
npm run test:auth       # Authentication endpoints
npm run test:game       # Game state endpoints
npm run test:analytics  # Analytics endpoints
```

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy `dist/` folder to your hosting platform
```

### Backend (Railway/Heroku)
```bash
# Set environment variables
# Deploy backend/ folder with PostgreSQL addon
```

### Full Stack (Docker)
```bash
# Coming soon: Docker Compose configuration
docker-compose up
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Create** a Pull Request

### Development Guidelines
- **TypeScript**: Use TypeScript for all new frontend code
- **Documentation**: Add JSDoc comments for all API endpoints
- **Testing**: Include tests for new API endpoints
- **Linting**: Follow ESLint configuration
- **Git**: Use conventional commit messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **React**: Frontend framework
- **Vite**: Lightning-fast development server
- **Node.js**: Backend runtime
- **PostgreSQL**: Database system
- **Swagger**: API documentation

## Support

- **Issues**: [GitHub Issues](https://github.com/cekwedike/MusicSim/issues)
- **Discussions**: [GitHub Discussions](https://github.com/cekwedike/MusicSim/discussions)
- **Email**: support@musicsim.dev

---

**Ready to build your music empire? [Start playing now!](http://localhost:5173/)**
