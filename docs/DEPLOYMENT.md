# MusicSim Deployment Guide

## 1. Architecture Overview
Frontend (Vercel) ↔ Backend (Node/Express on Render) ↔ PostgreSQL (Supabase managed)

## 2. Environments
| Env | Purpose | Domain | Notes |
|-----|---------|--------|-------|
| Dev | Local iteration | localhost | Hot reload, seed data |
| Staging | Pre-release validation | staging.musicsim.net | Full test matrix |
| Production | Live users | musicsim.net | Monitoring & alerts |

## 3. Environment Variables Matrix
| Variable | Backend | Frontend | Description |
|----------|---------|----------|-------------|
| PORT | ✓ | - | API port |
| FRONTEND_URL | ✓ | - | Allowed CORS origins |
| DATABASE_URL | ✓ | - | Postgres connection string |
| JWT_SECRET | ✓ | - | Token signing secret |
| VITE_API_URL | - | ✓ | Frontend API base URL |

## 4. Prerequisites
- Node.js (>=18 recommended)
- Access to Supabase (managed Postgres)

## 5. Local Development Setup
```bash
npm install
cd backend && npm install && cd ..
npm run dev
```

## 6. Deployment Steps (Production)
1. Merge to `main` triggers CI build.
2. CI runs tests, coverage, Playwright, performance smoke.
3. If green & thresholds met, deploy frontend (Vercel) & backend (Render) automatically.
4. Supabase hosts the managed Postgres database.
5. Post‑deploy smoke: health, auth, save, analytics endpoints.
6. Tag release & archive artifacts (coverage, performance); update `TEST_RESULTS.md`.

## 7. Verification Checklist
- Health endpoint returns `success: true`.
- Swagger accessible.
- Migrations applied (schema version log).
- Sample save/create career works.
- Learning analytics endpoints return 200.

## 8. Rollback Procedures
- Frontend: Vercel rollback to previous deployment.
- Backend: Deploy previous commit hash or use Render rollback UI.
- Database: Apply down migration or restore snapshot.

## 9. Monitoring & Observability
- Health checks `/api/health` + uptime monitor.
- Structured logging (JSON future enhancement).
- Performance sampling (k6 monthly or on major change).

## 10. Security Hardening (Deployment Focus)
- Rate limiting enabled behind proxy.
- CORS restricted to known origins list.
- Secrets rotated quarterly (policy recommendation).

## 11. Future Enhancements
- Add Prometheus metrics endpoint.
- Add synthetic transaction monitoring.
- Automated rollback on failed smoke tests.
