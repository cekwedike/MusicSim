# 🎵 MusicSim: Music Business Simulation

A comprehensive strategic music business simulation where players navigate the complex world of the music industry, making critical decisions that shape their artist's career, reputation, and success.

## 🎬 Demo Video

**🎥 [Watch MusicSim in Action](https://drive.google.com/file/d/1E2-obzi3AOg1L0EgI5tKIaxw-ENmdXg5/view?usp=drive_link)**

See the complete gameplay experience, from artist setup to career management and decision-making scenarios.

## ✨ Features

### 🎯 Core Gameplay
- **Career Management**: Guide your artist through weeks, months, and years of industry challenges
- **Strategic Decision Making**: Navigate complex scenarios with meaningful consequences
- **Three Difficulty Levels**: Easy, Realistic, and Hard modes with different starting conditions
- **Dynamic Scenarios**: AI-powered scenario generation using Google Gemini
- **Achievement System**: Unlock achievements based on career milestones and decisions

### 📊 Analytics & Progress
- **Learning Hub**: Educational modules about music industry concepts
- **Career History**: Track multiple playthroughs and compare outcomes
- **Statistics Dashboard**: Comprehensive analytics on performance and learning
- **Save/Load System**: Multiple save slots with cloud synchronization (when authenticated)

### 🔐 Account Features
- **Guest Mode**: Play without registration with localStorage saves
- **User Accounts**: Cloud saves, cross-device progression, and enhanced analytics
- **Authentication**: Secure JWT-based authentication system
- **Progress Tracking**: Detailed learning analytics and career insights

### 🎨 User Experience
- **Responsive Design**: Optimized for desktop and mobile devices
- **Interactive UI**: Modern React-based interface with smooth animations
- **Tutorial System**: Guided onboarding for new players
- **Mistake Prevention**: Warning system for potentially harmful decisions

## 🏗️ Project Architecture

```
MusicSim/
├── 📁 frontend/              # React + TypeScript + Vite
│   ├── 📁 components/        # Reusable UI components
│   │   ├── 🎯 Dashboard.tsx  # Game statistics display
│   │   ├── 🎮 ScenarioCard.tsx # Main gameplay interface
│   │   ├── 🏆 AchievementsModal.tsx # Achievement system
│   │   ├── 💾 SaveLoadModal.tsx # Save/load management
│   │   ├── 🎓 LearningHub.tsx # Educational content
│   │   └── 🔐 LoginModal.tsx # Authentication UI
│   ├── 📁 services/          # API integration & game logic
│   │   ├── 🌐 api.ts         # Axios configuration
│   │   ├── 🔑 authService.ts # Authentication API
│   │   ├── 💾 gameService.ts # Game state management
│   │   ├── 🎯 scenarioService.ts # Scenario generation
│   │   └── 📊 analyticsService.ts # Learning analytics
│   ├── 📁 data/              # Game content & configuration
│   │   ├── 🎭 scenarios.ts   # Scenario templates
│   │   ├── 🏆 achievements.ts # Achievement definitions
│   │   ├── ⚙️ difficultySettings.ts # Game balance
│   │   └── 🎓 learningModules.ts # Educational content
│   └── 📁 contexts/          # React context providers
│       └── 🔐 AuthContext.tsx # Global authentication state
├── 📁 backend/               # Express.js + PostgreSQL
│   ├── 📁 routes/            # API endpoint definitions
│   │   ├── 🔑 auth.js        # User authentication
│   │   ├── 💾 gameState.js   # Game save/load
│   │   ├── 📈 careerHistory.js # Career tracking
│   │   ├── 🎓 learning.js    # Learning progress
│   │   ├── 📚 lessons.js     # Lesson engagement
│   │   └── 📊 analytics.js   # User analytics
│   ├── 📁 models/            # Database schemas (Sequelize)
│   │   ├── 👤 User.js        # User accounts
│   │   ├── 💾 GameSave.js    # Game state storage
│   │   ├── 📈 CareerHistory.js # Career records
│   │   └── 🎓 LearningProgress.js # Educational tracking
│   ├── 📁 middleware/        # Express middleware
│   │   ├── 🔐 auth.js        # JWT authentication
│   │   └── ⚠️ errorHandler.js # Error management
│   └── 📁 config/            # Configuration files
│       ├── 🗄️ database.js    # Database connection
│       └── 📖 swagger.js     # API documentation
└── 📁 docs/                  # Documentation
    └── 📋 DEV_SETUP.md       # Development setup guide
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** (optional, for full backend features)

### 🎮 Play Now (Fastest)
```bash
# Clone the repository
git clone https://github.com/cekwedike/MusicSim.git
cd MusicSim

# Install dependencies and start both frontend & backend
npm install
npm run dev
```

**🌐 Open your browser to:**
- **Game Interface**: http://localhost:5173/
- **API Documentation**: http://localhost:3001/api-docs

### 🔧 Development Setup

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
VITE_GEMINI_API_KEY=your_gemini_api_key_here
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

## 📱 Usage

### 🎮 Playing the Game

1. **🚀 Start**: Choose to play as guest or create an account
2. **🎭 Artist Setup**: Create your artist persona and select difficulty
3. **🎯 Gameplay**: Navigate scenarios and make strategic decisions
4. **📊 Track Progress**: Monitor stats, achievements, and learning
5. **💾 Save/Load**: Manage multiple career playthroughs

### 🎓 Learning Features

- **📚 Learning Hub**: Access educational modules about the music industry
- **🧠 Knowledge Tracking**: See what concepts you've mastered
- **📈 Progress Analytics**: Understand your learning journey
- **🎯 Scenario Integration**: Apply learned concepts in gameplay

### 🔐 Account Benefits

| Feature | Guest Mode | Authenticated |
|---------|------------|---------------|
| 🎮 Core Gameplay | ✅ Full Access | ✅ Full Access |
| 💾 Local Saves | ✅ localStorage | ✅ localStorage |
| ☁️ Cloud Saves | ❌ Not Available | ✅ Synchronized |
| 📊 Analytics | ❌ Limited | ✅ Comprehensive |
| 📱 Cross-Device | ❌ No Sync | ✅ Full Sync |
| 🎓 Learning Progress | ❌ Local Only | ✅ Tracked & Analyzed |

## 🛠️ Available Scripts

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

## 📖 API Documentation

**Interactive Swagger UI**: http://localhost:3001/api-docs

### 🔗 API Endpoints

| Endpoint | Purpose | Authentication |
|----------|---------|----------------|
| `POST /api/auth/register` | User registration | ❌ Public |
| `POST /api/auth/login` | User login | ❌ Public |
| `POST /api/game/save` | Save game state | 🔐 Required |
| `GET /api/game/saves` | List saved games | 🔐 Required |
| `POST /api/career/complete` | Record career completion | 🔐 Required |
| `GET /api/analytics/overview` | User analytics dashboard | 🔐 Required |

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

## 🚢 Deployment

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

1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **💍 Commit** changes (`git commit -m 'Add amazing feature'`)
4. **📤 Push** to branch (`git push origin feature/amazing-feature`)
5. **🔀 Create** a Pull Request

### 🏗️ Development Guidelines
- **TypeScript**: Use TypeScript for all new frontend code
- **Documentation**: Add JSDoc comments for all API endpoints
- **Testing**: Include tests for new API endpoints
- **Linting**: Follow ESLint configuration
- **Git**: Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **🤖 Google Gemini**: AI-powered scenario generation
- **⚛️ React**: Frontend framework
- **🚀 Vite**: Lightning-fast development server
- **🟢 Node.js**: Backend runtime
- **🐘 PostgreSQL**: Database system
- **📖 Swagger**: API documentation

## 📧 Support

- **📋 Issues**: [GitHub Issues](https://github.com/cekwedike/MusicSim/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/cekwedike/MusicSim/discussions)
- **📧 Email**: support@musicsim.dev

---

**🎵 Ready to build your music empire? [Start playing now!](http://localhost:5173/) 🎵**
