# MusicSim: A Business Simulation Game

A strategic business simulation game where players manage music industry careers, making decisions that affect success and reputation.

## Project Structure

```
MusicSim/
├── frontend/          # React/Vite frontend application
│   ├── components/    # React components
│   ├── services/      # API services (Gemini integration)
│   ├── data/          # Game data (scenarios, achievements, etc.)
│   └── ...
├── backend/           # Express.js backend server (optional)
└── ...
```

## Run Locally

**Prerequisites:** Node.js

### Frontend Only
1. Install dependencies: `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the frontend: `npm run dev`

### With Backend (Optional)
1. Install frontend dependencies: `npm install`
2. Install backend dependencies: `npm run install:backend`
3. Set the `GEMINI_API_KEY` in [.env.local](.env.local)
4. Run both frontend and backend: `npm run dev:all`

The frontend will be available at http://localhost:5173 and the backend at http://localhost:3001
