# MusicSim Development Setup

## Quick Start

To start both frontend and backend simultaneously:

```bash
npm run dev
```

This will start:
- Frontend (React + Vite) on http://localhost:5173/
- Backend (Express + Node.js) on http://localhost:3001/

## Available Scripts

### Development
- `npm run dev` - Start both frontend and backend concurrently
- `npm run dev:frontend` - Start only frontend (Vite dev server)
- `npm run dev:backend` - Start only backend (nodemon)

### Production
- `npm run build` - Build frontend for production
- `npm run start` - Start both frontend and backend in production mode
- `npm run preview` - Preview production build

### Installation
- `npm run install:all` - Install dependencies for both frontend and backend
- `npm run install:backend` - Install only backend dependencies

## URLs

- Frontend: http://localhost:5173/
- Backend API: http://localhost:3001/api/
- Health Check: http://localhost:3001/api/health

## Development Features

- **Hot Reload**: Both frontend and backend auto-reload on file changes
- **Color-coded Logs**: Frontend logs in cyan, backend logs in magenta
- **Network Access**: Frontend accessible from other devices on your network
- **Error Handling**: If one service fails, both are automatically restarted

## Database Setup (Optional)

The backend runs with limited functionality without a database connection. To enable full features:

1. Install PostgreSQL
2. Configure environment variables in `backend/.env`
3. Run `cd backend && npm run db:init`

## Troubleshooting

- **Port 5173 in use**: Vite will automatically try port 5174, 5175, etc.
- **Port 3001 in use**: Stop any existing backend processes
- **Database errors**: App runs in fallback mode with localStorage