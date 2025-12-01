# MusicSim: Music Business Simulation

A comprehensive strategic music business simulation that empowers players to navigate the complex world of the music industry. Players make critical decisions that shape their artist's career, reputation, and financial success while learning real-world business concepts that apply to the African music industry and beyond.

Visit the official website: https://www.musicsim.net

## Overview

MusicSim is an educational simulation game designed to bridge the gap between music creation and business acumen. Players develop industry knowledge through interactive scenarios that mirror real-world challenges faced by recording artists, from contract negotiations to revenue optimization.

## Live Demo

**Play Now:** [www.musicsim.net](https://www.musicsim.net)

**Video Walkthrough:** [Watch MusicSim in Action](https://www.loom.com/share/4d77df71abf64e25ab0583a1e1e66496)

Experience the complete gameplay from artist creation through career management, strategic decisions, and educational modules.

## Features

### Core Gameplay Mechanics
- **Career Management**: Guide your artist through realistic career progression spanning weeks, months, and years of industry challenges
- **Strategic Decision Making**: Navigate over 150 complex scenarios with meaningful long-term consequences affecting cash flow, reputation, and industry relationships
- **Three Difficulty Levels**: Easy, Realistic, and Hard modes with different starting conditions and industry pressures
- **Dynamic Scenario System**: Extensive scenario bank featuring contract negotiations, marketing decisions, collaboration opportunities, and crisis management
- **Contract Negotiation**: Choose from 15 unique record label contracts with realistic terms, royalty rates, and creative control options
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
- **Supabase OAuth**: Google OAuth authentication with secure session management
- **Progress Synchronization**: Seamless data sync across multiple devices and platforms
- **Privacy Controls**: Comprehensive data management and privacy settings

### User Interface and Experience
- **Responsive Design**: Fully optimized for desktop computers, tablets, and mobile devices
- **Modern React Interface**: Built with TypeScript and contemporary UI/UX principles
- **Interactive Tutorial**: Comprehensive guided onboarding system for new players
- **Mistake Prevention**: Intelligent warning system for potentially harmful decisions
- **Accessibility Features**: Screen reader support and keyboard navigation
- **Progressive Web App**: Installable application with offline capabilities

### Performance and Production Optimization
- **Smart Console Logging**: Development-only logging system with production-safe error handling
- **Code Splitting**: Lazy-loaded components with Suspense boundaries for optimal load times
- **Bundle Optimization**: Minified and tree-shaken production builds for fast delivery
- **Service Worker Caching**: Intelligent asset caching for offline functionality
- **Performance Monitoring**: Optimized service layer with reduced console overhead (~5% bundle reduction)

## Project Architecture

MusicSim follows a modern full-stack architecture with a React frontend and Express.js backend.

```
MusicSim/
├── frontend/                      # React + TypeScript application
│   ├── components/                # UI Components (55+ components)
│   │   ├── Dashboard.tsx          # Main game dashboard
│   │   ├── ArtistSetup.tsx        # Character creation & setup
│   │   ├── ScenarioCard.tsx       # Scenario presentation
│   │   ├── ContractViewer.tsx     # Contract detail viewer
│   │   ├── SignedContractViewer.tsx # Active contract management
│   │   ├── LearningHub.tsx        # Educational module hub
│   │   ├── LearningPanel.tsx      # Learning progress display
│   │   ├── ModuleViewer.tsx       # Individual module viewer
│   │   ├── GameHistory.tsx        # Career history viewer
│   │   ├── Header.tsx             # Main app header
│   │   ├── Sidebar.tsx            # Navigation sidebar
│   │   ├── LandingPage.tsx        # Game landing/welcome page
│   │   ├── ManagementPanel.tsx    # Staff & resource management
│   │   ├── ProjectsPanel.tsx      # Active projects display
│   │   ├── StatisticsPanel.tsx    # Game statistics
│   │   ├── ProfilePanel.tsx       # User profile management
│   │   ├── SaveLoadPanel.tsx      # Save/load game interface
│   │   ├── TutorialOverlay.tsx    # Interactive tutorial
│   │   ├── WelcomeBackDialog.tsx  # Returning player dialog
│   │   ├── LoginModal.tsx         # Authentication modal
│   │   ├── GuestDataMergeModal.tsx # Guest data migration
│   │   ├── OutcomeModal.tsx       # Scenario outcome display
│   │   ├── OffersModal.tsx        # Contract offers display
│   │   ├── StaffTerminationModal.tsx # Staff dismissal flow
│   │   ├── DeleteSaveModal.tsx    # Save deletion confirmation
│   │   ├── AlertDialog.tsx        # Generic alert dialog
│   │   ├── ConfirmDialog.tsx      # Generic confirmation dialog
│   │   ├── MistakeWarning.tsx     # Decision warning system
│   │   ├── UnlockNotification.tsx # Achievement unlocks
│   │   ├── AudioErrorBoundary.tsx # Audio error handling
│   │   ├── AudioUnlockPrompt.tsx  # Mobile audio unlock
│   │   ├── SidebarAudioSettings.tsx # Audio controls
│   │   ├── ThemeToggle.tsx        # Theme switcher
│   │   ├── ParallaxBackground.tsx # Animated background
│   │   ├── MiniChart.tsx          # Small data visualization
│   │   ├── Loader.tsx             # Loading states
│   │   └── icons/                 # Custom SVG icon components
│   ├── services/                  # Business logic & API integration (20 files)
│   │   ├── api.ts                 # API client configuration
│   │   ├── authService.supabase.ts # Supabase authentication
│   │   ├── supabase.ts            # Supabase client setup
│   │   ├── gameService.ts         # Game state management
│   │   ├── learningProgressService.ts # Learning analytics
│   │   ├── statisticsService.ts   # Player statistics tracking
│   │   ├── scenarioService.ts     # Scenario selection & logic
│   │   ├── storageService.ts      # Local/cloud storage management
│   │   ├── migrationService.ts    # Data migration utilities
│   │   ├── dbStorage.ts           # IndexedDB storage wrapper
│   │   └── [test files...]        # Comprehensive test coverage
│   ├── data/                      # Game content & configuration
│   │   ├── scenarioBank.ts        # 150+ game scenarios (6,500+ lines)
│   │   ├── achievements.ts        # Achievement definitions
│   │   ├── learningModules.ts     # Educational content modules
│   │   ├── difficultySettings.ts  # Game difficulty configurations
│   │   ├── tutorialSteps.ts       # Tutorial flow definitions
│   │   ├── staff.ts               # Staff member templates
│   │   ├── labels.ts              # 15 record label contracts
│   │   └── projects.ts            # Project type definitions
│   ├── contexts/                  # React Context providers
│   │   ├── AuthContext.tsx        # Authentication state
│   │   ├── AudioContext.tsx       # Audio/sound state
│   │   ├── ThemeContext.tsx       # UI theme state
│   │   └── ToastContext.tsx       # Notification system
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAudioManager.ts     # Audio management & preloading
│   │   ├── useAutoSave.ts         # Automatic game saving
│   │   └── useDebounce.ts         # Debounced value updates
│   ├── constants/                 # Application constants
│   │   └── genres.ts              # Music genre definitions
│   ├── types/                     # TypeScript type definitions
│   ├── scripts/                   # Build and utility scripts
│   ├── public/                    # Static assets
│   │   ├── audio/                 # Sound effects & music
│   │   │   ├── scenarios/         # Scenario-specific audio
│   │   │   └── [game sounds]      # UI sounds and music
│   │   ├── sw.js                  # Service worker for PWA
│   │   ├── manifest.json          # PWA manifest
│   │   └── [images, icons...]     # Visual assets
│   ├── utils/                     # Core utility functions
│   │   └── logger.ts              # Production-safe logging utility
│   ├── src/                       # Additional utilities
│   │   └── utils/                 # Game-specific utilities
│   │       ├── logUtils.ts        # Game logging utilities
│   │       └── dateUtils.ts       # Date/time utilities
│   ├── App.tsx                    # Main application component (3,100+ lines)
│   ├── index.tsx                  # Application entry point
│   ├── index.html                 # HTML template
│   ├── types.ts                   # Global type definitions
│   ├── .env                       # Environment variables (gitignored)
│   └── .env.example               # Environment template
│
├── backend/                       # Express.js + PostgreSQL backend
│   ├── routes/                    # API route definitions
│   │   ├── auth.js                # Authentication endpoints (register, login, OAuth)
│   │   ├── gameState.js           # Game save/load endpoints
│   │   ├── analytics.js           # Analytics & reporting endpoints
│   │   ├── careerHistory.js       # Career tracking endpoints
│   │   ├── learning.js            # Learning progress endpoints
│   │   ├── lessons.js             # Lesson content endpoints
│   │   └── migrate.js             # Migration utilities
│   ├── models/                    # Sequelize database models
│   │   ├── User.js                # User account model
│   │   ├── GameSave.js            # Game save state model
│   │   ├── CareerHistory.js       # Career history model
│   │   ├── LearningProgress.js    # Learning analytics model
│   │   ├── PlayerStatistics.js    # Player stats model
│   │   └── index.js               # Model exports & associations
│   ├── middleware/                # Express middleware
│   │   ├── auth.js                # Supabase OAuth authentication middleware
│   │   └── errorHandler.js        # Global error handling
│   ├── config/                    # Configuration files
│   │   ├── database.js            # Sequelize config (Supabase PostgreSQL)
│   │   ├── supabase.js            # Supabase client setup
│   │   └── swagger.js             # API documentation config
│   ├── migrations/                # Database migrations
│   │   ├── 002_add_displayName.sql
│   │   ├── 003_remove_password_oauth_only.sql
│   │   ├── 004_optimize_schema_remove_redundancies.sql
│   │   ├── 005_create_achievements_system.sql
│   │   ├── 006_add_performance_indexes.sql
│   │   ├── 007_remove_additional_redundancies.sql
│   │   ├── 008_remove_achievements_tables.sql
│   │   ├── 009_add_gamesave_metadata_fields.sql
│   │   ├── 010_add_username_unique_constraint.sql
│   │   ├── migrate.js             # Migration runner
│   │   ├── run-migration-002.js   # Legacy migration script
│   │   ├── run-supabase-migration.js # Supabase migration script
│   │   └── README.md              # Migration documentation
│   ├── scripts/                   # Utility scripts
│   │   ├── initDatabase.js        # Database initialization
│   │   └── resetDatabase.js       # Database reset (caution)
│   ├── tests/                     # Backend test suites
│   │   ├── auth.test.js           # Authentication tests
│   │   └── health.test.js         # Health check tests
│   ├── utils/                     # Utility functions
│   │   ├── environmentValidator.js # Environment validation
│   │   └── validation.js          # Input validation
│   ├── public/                    # Public assets
│   │   └── migrate.html           # Migration UI
│   ├── server.js                  # Express server entry point
│   ├── package.json               # Backend dependencies
│   ├── render.yaml                # Render deployment config
│   ├── .env                       # Environment variables (gitignored)
│   └── .env.example               # Environment template
│
├── dist/                          # Production build (generated by Vite)
├── docs/                          # Project documentation
│   ├── DEPLOYMENT.md              # Deployment guide and procedures
│   ├── LEGAL.md                   # Legal terms and conditions
│   ├── TERMS_SUMMARY.md           # Summary of terms of service
│   ├── TEST_PLAN.md               # Testing strategy and plan
│   ├── TEST_RESULTS.md            # Test execution results
│   └── ANALYSIS_REPORT.md         # Code analysis and metrics
├── favicon/                       # Favicon assets
├── scripts/                       # Root-level scripts
│   └── check-pwa.ps1              # PWA validation script
├── .github/                       # GitHub configuration
│   └── workflows/                 # GitHub Actions (if present)
│
├── vite.config.ts                 # Vite build configuration
├── tsconfig.json                  # TypeScript compiler config
├── vercel.json                    # Vercel deployment config
├── package.json                   # Root dependencies & scripts
├── package-lock.json              # Dependency lock file
├── Makefile                       # Make commands
├── ci-cd-tools.ps1                # CI/CD PowerShell tools
├── metadata.json                  # Project metadata
├── scenario-analysis.md           # Scenario content analysis
├── figma-design.png               # Design reference
├── .env.local                     # Local environment (gitignored)
└── .gitignore                     # Git ignore rules
```

### Technology Stack

**Frontend:**
- React 19 with TypeScript for type safety
- Vite for fast development and optimized builds
- Tailwind CSS for styling
- Lucide React for icons
- Vitest for testing
- Workbox for PWA capabilities and service worker management
- Custom logger utility for production-safe console management

**Backend:**
- Node.js with Express.js framework
- PostgreSQL database via Supabase
- Sequelize ORM for database operations
- Supabase Auth for OAuth authentication
- Passport.js for OAuth strategies
- Jest & Supertest for API testing
- Swagger for API documentation

**Deployment:**
- Frontend: Vercel (CDN + Edge Functions)
- Backend: Render (Container deployment)
- Database: Supabase (Managed PostgreSQL)

## Quick Start

### Prerequisites
- **Node.js** (v16 or higher recommended)
- **npm** (comes with Node.js)
- **Supabase account** (for backend database - optional for frontend-only development)

### Quick Start (5 minutes)

The fastest way to run MusicSim locally:

```bash
# 1. Clone the repository
git clone https://github.com/cekwedike/MusicSim.git
cd MusicSim

# 2. Install all dependencies (root + backend)
npm install
npm run install:backend

# 3. Start both frontend and backend servers
npm run dev
```

**Access the application:**
- Game Interface: http://localhost:5173
- API Docs (Swagger): http://localhost:3001/api-docs
- Backend Health Check: http://localhost:3001/api/health

**Note:** The app will run in guest mode without database setup. For full features (cloud saves, user accounts), configure the backend environment.

### Development Setup (Full Configuration)

For complete setup with database, authentication, and all features:

#### 1. Clone and Install Dependencies
```bash
# Clone the repository
git clone https://github.com/cekwedike/MusicSim.git
cd MusicSim

# Install all dependencies
npm install              # Installs frontend dependencies
npm run install:backend  # Installs backend dependencies
```

#### 2. Configure Environment Variables

**Frontend Configuration** (`frontend/.env.local`):
```env
# Backend API URL
VITE_API_URL=http://localhost:3001
```

**Backend Configuration** (`backend/.env`):
```env
# Database Connection (Supabase PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database

# Server Settings
NODE_ENV=development
PORT=3001

# Optional: Google OAuth (for social login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
```

**Security Note:** Never commit `.env` files to version control. Use strong, random secrets for production.

#### 3. Database Setup (Supabase)

**Option A: Using Supabase (Recommended)**
1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Navigate to Project Settings > Database
4. Copy the connection string (URI format)
5. Add to `backend/.env`:
   ```
   DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
   ```
6. Run migrations:
   ```bash
   cd backend
   npm run migrate
   ```

**Option B: Local PostgreSQL**
1. Install PostgreSQL locally
2. Create a database: `createdb musicsim`
3. Update `DATABASE_URL` in `backend/.env`
4. Run migrations: `cd backend && npm run migrate`

**Verify Database Connection:**
```bash
cd backend
npm run db:status  # Check connection
npm run db:verify  # Verify schema
```

#### 4. **Start Development**
```bash
# Start both frontend and backend simultaneously
npm run dev

# OR start individually:
npm run dev:frontend  # Frontend only (port 5173)
npm run dev:backend   # Backend only (port 3001)
```

## How to Play

### Getting Started

1. **Choose Your Mode**
   - Guest Mode: Play immediately with local saves
   - Authenticated: Create account for cloud saves and analytics

2. **Create Your Artist**
   - Choose artist name and genre
   - Select difficulty level (Easy, Realistic, or Hard)
   - Set initial resources and goals

3. **Navigate Your Career**
   - Face 150+ unique scenarios
   - Make strategic decisions affecting:
     - Cash flow and financial stability
     - Fame and industry recognition
     - Artist well-being and mental health
     - Hype and fan engagement
   - Manage contracts, collaborations, and projects

4. **Learn Music Business**
   - Complete educational modules
   - Earn achievements for milestones
   - Track concept mastery
   - Apply knowledge in real scenarios

5. **Track Your Progress**
   - View detailed career statistics
   - Compare multiple playthroughs
   - Analyze decision outcomes
   - Export career history

### Game Mechanics

**Core Stats:**
- **Cash**: Financial resources for investments and expenses
- **Fame**: Industry recognition and audience reach
- **Well-being**: Artist mental and physical health
- **Hype**: Current momentum and trending status

**Scenario Types:**
- Contract negotiations and renewals
- Revenue and royalty decisions
- Marketing and promotion opportunities
- Collaboration and feature requests
- Crisis management and reputation
- Investment and business decisions
- Legal and rights management

**Difficulty Levels:**
- **Easy**: Higher starting resources, forgiving outcomes
- **Realistic**: Balanced challenge, moderate consequences
- **Hard**: Limited resources, severe penalties for mistakes

### Learning System

MusicSim includes an integrated educational framework:

- **Learning Hub**: 20+ modules on music business topics
- **Concept Tracking**: Monitor mastery of 50+ industry concepts
- **Achievement System**: 30+ achievements for learning and gameplay
- **Progress Analytics**: Detailed insights into learning journey
- **Practical Application**: Scenarios directly tied to educational content

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

MusicSim provides a comprehensive REST API for game state management, user authentication, and analytics.

**Interactive Documentation:** http://localhost:3001/api-docs (Swagger UI)

### API Endpoints Overview

**Authentication & User Management**
| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/auth/register` | POST | Create new user account | No |
| `/api/auth/login` | POST | User login (OAuth) | No |
| `/api/auth/google` | GET | OAuth with Google | No |
| `/api/auth/logout` | POST | User logout | Yes |
| `/api/auth/me` | GET | Get current user profile | Yes |

**Game State Management**
| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/game/save` | POST | Save game state | Yes |
| `/api/game/saves` | GET | List user's saved games | Yes |
| `/api/game/saves/:id` | GET | Get specific save | Yes |
| `/api/game/saves/:id` | DELETE | Delete a save | Yes |
| `/api/game/load/:id` | GET | Load game state | Yes |

**Career & Analytics**
| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/career/complete` | POST | Record completed career | Yes |
| `/api/career/history` | GET | Get career history | Yes |
| `/api/analytics/overview` | GET | User analytics dashboard | Yes |
| `/api/analytics/learning` | GET | Learning progress stats | Yes |

**Learning & Lessons**
| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/learning/progress` | POST | Update learning progress | Yes |
| `/api/learning/progress` | GET | Get learning progress | Yes |
| `/api/lessons` | GET | Get available lessons | No |
| `/api/lessons/:id` | GET | Get lesson details | No |

**System**
| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/health` | GET | Server health check | No |

### Authentication

API uses Supabase OAuth tokens for authentication:

1. Login via Google OAuth to receive a Supabase access token
2. Include token in subsequent requests:
   ```
   Authorization: Bearer <your_supabase_access_token>
   ```
3. Tokens are managed by Supabase Auth and expire based on Supabase settings
4. Frontend automatically handles token refresh

### Rate Limiting

- Public endpoints: 100 requests per 15 minutes
- Authenticated endpoints: 1000 requests per 15 minutes
- Authentication endpoints: 10 requests per 15 minutes (to prevent brute force)

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
   - `NODE_ENV=production`
3. Migrations run automatically on deployment via `npm start`
4. Backend API health check: `/api/health`

### Database - Supabase
- Managed PostgreSQL database
- Connection string available in Supabase project settings
- Automatic backups and scaling included

### Deployment Status
The production system is verified and operational on Vercel (frontend), Render (backend), and Supabase (database). All core features including authentication, game saves, and analytics are functional.

## Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, improving documentation, or enhancing game content, your help is appreciated.

### How to Contribute

1. **Fork** the repository to your GitHub account
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/MusicSim.git
   cd MusicSim
   ```
3. **Create** a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```
4. **Make your changes** following the development guidelines below
5. **Test** your changes:
   ```bash
   npm run test        # Frontend tests
   cd backend && npm test  # Backend tests
   ```
6. **Commit** your changes:
   ```bash
   git add .
   git commit -m "feat: add new scenario type for independent artists"
   ```
7. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Create a Pull Request** on GitHub with a clear description of your changes

### Development Guidelines

**Code Standards:**
- Use TypeScript for all frontend code
- Follow existing code style and naming conventions
- Write self-documenting code with clear variable/function names
- Add JSDoc comments for public APIs and complex logic
- Keep functions focused and modular

**Testing Requirements:**
- Add tests for new features and bug fixes
- Ensure all existing tests pass before submitting
- Aim for meaningful test coverage, not just high percentages
- Test both happy paths and error cases

**Commit Messages:**
- Use conventional commit format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Examples:
  - `feat(scenarios): add music festival scenario`
  - `fix(auth): resolve token expiration issue`
  - `docs(readme): update installation instructions`

**Pull Request Guidelines:**
- Provide clear description of changes and motivation
- Reference any related issues
- Include screenshots for UI changes
- Ensure CI checks pass
- Be responsive to code review feedback

### Areas for Contribution

**Game Content:**
- New scenarios and decision trees
- Educational modules and learning content
- Achievement definitions
- Difficulty balancing

**Features:**
- UI/UX improvements
- New game mechanics
- Analytics and reporting
- Mobile responsiveness

**Technical Improvements:**
- Performance optimizations
- Test coverage
- Security enhancements
- Documentation

**Bug Fixes:**
- Check [GitHub Issues](https://github.com/cekwedike/MusicSim/issues) for open bugs
- Reproduce, fix, and add tests to prevent regression

### Questions?

- Open a [GitHub Discussion](https://github.com/cekwedike/MusicSim/discussions) for questions
- Check existing issues and discussions before creating new ones
- Join our community and share your ideas

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

## Troubleshooting

### Common Issues

**Frontend won't start:**
```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev:frontend
```

**Backend connection failed:**
- Check if backend is running on port 3001
- Verify `VITE_API_URL` in `frontend/.env.local`
- Check backend logs for errors

**Database connection errors:**
- Verify `DATABASE_URL` in `backend/.env`
- Test connection: `cd backend && npm run db:status`
- Check Supabase project is active and accessible
- Ensure IP is whitelisted in Supabase (or allow all for development)

**Authentication not working:**
- Verify Supabase project is active and accessible
- Check OAuth provider configuration in Supabase dashboard
- Clear browser cookies and localStorage
- Verify Supabase environment variables are set correctly

**Build fails:**
```bash
# Clear Vite cache
rm -rf dist .vite
npm run build
```

**Tests failing:**
```bash
# Update snapshots if UI changed
npm run test -- -u

# Clear test cache
npm run test -- --clearCache
```

### Performance Issues

**Slow initial load:**
- Check network tab for large bundle sizes
- Verify CDN is serving static assets
- Consider code splitting optimizations

**Database queries slow:**
- Check database indexes
- Review query complexity in API routes
- Consider caching frequently accessed data

### Getting Help

- Check existing [GitHub Issues](https://github.com/cekwedike/MusicSim/issues)
- Search [GitHub Discussions](https://github.com/cekwedike/MusicSim/discussions)
- Review API documentation at http://localhost:3001/api-docs
- Check browser console for frontend errors
- Check backend logs for API errors

## Support

**Report Issues:**
- [GitHub Issues](https://github.com/cekwedike/MusicSim/issues) - Bug reports and feature requests

**Community:**
- [GitHub Discussions](https://github.com/cekwedike/MusicSim/discussions) - Questions, ideas, and community support

**Contact:**
- Email: support@musicsim.dev
- Website: [www.musicsim.net](https://www.musicsim.net)

## Roadmap

Upcoming features and improvements:

- [ ] Mobile app (React Native)
- [ ] Multiplayer career comparison
- [ ] Advanced analytics dashboard
- [ ] Industry trends simulation
- [ ] International market expansion scenarios
- [ ] Music production mini-game
- [ ] Social features (sharing achievements)
- [ ] AI-powered scenario generation

---

**Ready to build your music empire? [Start playing now!](https://www.musicsim.net)**
