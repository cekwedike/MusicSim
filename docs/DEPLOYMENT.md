# MusicSim Deployment Guide

_Last Updated: December 1, 2025_

## 1. Architecture Overview

**Production Stack:**
```
Frontend (Vercel) ↔ Backend API (Render) ↔ PostgreSQL (Supabase)
```

**Key Technologies:**
- Frontend: React 19 + TypeScript + Vite
- Backend: Node.js 20 + Express.js
- Database: PostgreSQL 15 (Supabase managed)
- CDN: Vercel Edge Network
- CI/CD: GitHub Actions

## 2. Environments

| Environment | Purpose | Domain | Status |
|-------------|---------|--------|--------|
| Development | Local iteration | localhost:5173 | Active |
| Production | Live users | www.musicsim.net | ✅ Deployed |

**Note:** Staging environment to be configured for pre-release validation.

## 3. Environment Variables

### Frontend Configuration (.env.local)

```env
# Backend API
VITE_API_URL=http://localhost:3001    # Development
VITE_API_URL=https://your-backend-url # Production

# Supabase (if using direct client)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend Configuration (.env)

```env
# Server
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://www.musicsim.net

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-backend-url/api/auth/google/callback
```

### Security Best Practices

- Use strong, random secrets (minimum 32 characters)
- Rotate secrets quarterly
- Never commit .env files to version control
- Use different secrets for each environment
- Enable rate limiting in production

## 4. Prerequisites

### Required Software
- **Node.js**: Version 18.0 or higher (20.x recommended)
- **npm**: Version 9.0 or higher (comes with Node.js)
- **Git**: For version control

### Required Accounts
- **Supabase**: Free tier sufficient for development/small projects
- **Vercel**: Free tier for frontend hosting (optional for local dev)
- **Render**: Free tier for backend hosting (optional for local dev)
- **GitHub**: For repository and CI/CD (optional for local dev)

### Local Development
```bash
# Check Node.js version
node --version  # Should be v18.0.0 or higher

# Check npm version
npm --version   # Should be 9.0.0 or higher
```

## 5. Local Development Setup
```bash
npm install
cd backend && npm install && cd ..
npm run dev
```

## 6. Deployment Process

### Automated Deployment (Recommended)

**Production deployment is automated via GitHub Actions:**

1. Push changes to `main` branch
2. GitHub Actions triggers CI pipeline:
   - Runs all tests (frontend + backend)
   - Executes security scans
   - Builds production bundles
3. On success, CD pipeline deploys:
   - Frontend to Vercel (automatic)
   - Backend to Render (automatic)
4. Post-deployment verification:
   - Health check endpoints
   - Smoke tests
   - Migration status

### Manual Deployment

**Frontend (Vercel):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Backend (Render):**
- Push to main branch (triggers auto-deploy)
- Or use Render dashboard manual deploy
- Migrations run automatically via `npm start`

### Database Migrations

**Automatic (on backend start):**
```bash
npm start  # Runs migrations automatically
```

**Manual migration:**
```bash
cd backend
npm run migrate
```

## 7. Post-Deployment Verification

### Automated Checks
- ✅ Health endpoint returns `{"status":"ok"}`
- ✅ Database connection successful
- ✅ Migrations applied successfully
- ✅ Frontend loads without errors
- ✅ API endpoints return expected status codes

### Manual Verification
```bash
# Check backend health
curl https://your-backend-url/api/health

# Check frontend
curl -I https://www.musicsim.net

# Test authentication
curl -X POST https://your-backend-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Smoke Test Checklist
- [ ] Landing page loads correctly
- [ ] User can create guest account
- [ ] Game state saves successfully
- [ ] Learning modules accessible
- [ ] Analytics endpoints responsive
- [ ] No console errors in production
- [ ] PWA installable on mobile devices

## 8. Rollback Procedures
- Frontend: Vercel rollback to previous deployment.
- Backend: Deploy previous commit hash or use Render rollback UI.
- Database: Apply down migration or restore snapshot.

## 9. Monitoring & Observability

### Production Monitoring

**Health Checks:**
- Backend: `/api/health` endpoint
- Frontend: Vercel uptime monitoring
- Database: Supabase dashboard metrics

**Logging Strategy:**
- **Development**: Verbose console logging for debugging
- **Production**: Error-only logging (via custom logger utility)
- **Structure**: JSON format for log aggregation

**Performance Metrics:**
- Bundle size: Tracked in build output
- API response times: Monitored via backend logs
- Database query performance: Supabase metrics dashboard

**Error Tracking:**
- Frontend: Error boundary components catch React errors
- Backend: Centralized error handler middleware
- Production: Critical errors logged for review

### Recommended Monitoring Setup

**Tools to Consider:**
- Sentry for error tracking
- LogRocket for session replay
- Vercel Analytics for frontend metrics
- Render metrics for backend performance

## 10. Security Hardening (Deployment Focus)
- Rate limiting enabled behind proxy.
- CORS restricted to known origins list.
- Secrets rotated quarterly (policy recommendation).

## 11. Future Enhancements

### Monitoring & Observability
- [ ] Sentry integration for error tracking
- [ ] LogRocket for session replay and debugging
- [ ] Prometheus metrics endpoint
- [ ] Grafana dashboards for real-time monitoring

### Performance Optimization
- [ ] CDN optimization for static assets
- [ ] Database query optimization
- [ ] API response caching
- [ ] Image optimization and lazy loading

### DevOps Improvements
- [ ] Staging environment setup
- [ ] Blue-green deployment strategy
- [ ] Automated rollback on failed health checks
- [ ] Database backup automation

### Security Enhancements
- [ ] Rate limiting per user/IP
- [ ] DDoS protection
- [ ] Security headers audit
- [ ] Penetration testing

---

_For deployment issues or questions, please refer to the troubleshooting section or open an issue on GitHub._
