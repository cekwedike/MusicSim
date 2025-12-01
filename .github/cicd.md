# CI/CD Configuration Guide for MusicSim

_Last Updated: December 1, 2025_

This document outlines the CI/CD pipeline setup for MusicSim and configuration instructions.

## 📋 Overview

MusicSim uses **GitHub Actions** for automated CI/CD with the following workflows:

### Active Workflows

- **ci.yml** - Continuous Integration (tests and builds on every push/PR)
- **cd.yml** - Continuous Deployment (deploys to production on main branch)
- **pr.yml** - Pull Request Validation (validates and creates preview deployments)
- **security.yml** - Security Scanning (regular audits and vulnerability checks)
- **maintenance.yml** - Automated Maintenance (weekly health checks and updates)
- **test-pipeline.yml** - Comprehensive Test Suite (full test matrix execution)

### Deployment Targets

- **Frontend**: Vercel (www.musicsim.net)
- **Backend**: Render (API endpoint)
- **Database**: Supabase (managed PostgreSQL)

## 🔧 Required Secrets Configuration

### GitHub Repository Secrets

Go to your GitHub repository → Settings → Secrets and Variables → Actions, and add:

#### Vercel Secrets (Frontend Deployment)
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

#### Application Environment Variables
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=your_backend_url
```

#### Deployment URLs
```
FRONTEND_URL=https://musicsim.vercel.app
BACKEND_URL=https://musicsim-backend.onrender.com
```

#### Optional Secrets
```
RENDER_DEPLOY_HOOK=your_render_deploy_webhook_url
DISCORD_WEBHOOK=your_discord_webhook_url (for notifications)
```

## 🚀 Getting Your Secrets

### Vercel Configuration

1. **Get Vercel Token:**
   ```bash
   npx vercel login
   npx vercel --token
   ```

2. **Get Organization ID:**
   - Visit https://vercel.com/account
   - Copy your Team ID or Personal Account ID

3. **Get Project ID:**
   ```bash
   npx vercel project ls
   ```
   Or check your project settings in Vercel dashboard.

### Render Configuration (Backend)

1. **Deploy Hook URL:**
   - Go to your Render service dashboard
   - Settings → Deploy Hook
   - Copy the webhook URL

### Supabase Configuration

1. **Project URL:**
   - Supabase Dashboard → Settings → API
   - Copy Project URL

2. **Anon Key:**
   - Same location, copy the `anon public` key

## 📁 File Structure

```
.github/
├── workflows/
│   ├── ci.yml              # Continuous Integration
│   ├── cd.yml              # Continuous Deployment
│   ├── pr.yml              # Pull Request Validation
│   ├── security.yml        # Security Scanning
│   └── maintenance.yml     # Weekly Maintenance
└── README.md              # This file
```

## 🔄 Workflow Triggers

### CI Workflow (ci.yml)
- **Triggers:** Push to any branch, Pull requests to main
- **Jobs:** 
  - Frontend build and test (Vitest)
  - Backend build and test (Jest)
  - TypeScript type checking
  - Lint and code quality checks
- **Duration:** ~5-10 minutes
- **Artifacts:** Test results, coverage reports

### CD Workflow (cd.yml)
- **Triggers:** Push to main branch (after CI success)
- **Jobs:**
  - Deploy frontend to Vercel
  - Deploy backend to Render
  - Run database migrations
  - Post-deployment health checks
- **Duration:** ~5-8 minutes
- **Artifacts:** Deployment logs, build outputs

### PR Workflow (pr.yml)
- **Triggers:** Pull request opened, synchronized, reopened
- **Jobs:**
  - Code validation and linting
  - Test execution
  - Preview deployment (Vercel)
  - Change impact analysis
- **Duration:** ~8-12 minutes
- **Artifacts:** Preview URL, test results

### Security Workflow (security.yml)
- **Triggers:** Push to main, Pull requests, Scheduled (weekly)
- **Jobs:**
  - npm audit for vulnerabilities
  - Dependency scanning
  - Secret detection
  - SAST (Static Application Security Testing)
- **Duration:** ~3-5 minutes
- **Artifacts:** Security reports

### Maintenance Workflow (maintenance.yml)
- **Triggers:** Scheduled (weekly), Manual dispatch
- **Jobs:**
  - Dependency updates check
  - Health monitoring
  - Database backup verification
  - Performance benchmarking
- **Duration:** ~3-5 minutes
- **Artifacts:** Maintenance reports

### Test Pipeline (test-pipeline.yml)
- **Triggers:** Push to main, Pull requests
- **Jobs:**
  - Comprehensive test suite execution
  - Integration tests
  - Coverage reporting
- **Duration:** ~5-8 minutes
- **Artifacts:** Test coverage reports

## 🏗️ Deployment Strategy

### Frontend (Vercel)
- **Production:** Automatic deployment from `main` branch
- **Preview:** Automatic deployment for PRs
- **Environment:** Node.js 20.x
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Backend (Render)
- **Production:** Automatic deployment from `main` branch
- **Environment:** Node.js 20.x
- **Build Command:** `npm ci`
- **Start Command:** `npm start`
- **Health Check:** `/api/health`

## 🔍 Monitoring and Alerts

### Automatic Notifications
- **Failed Deployments:** GitHub issue created automatically
- **Security Issues:** Weekly security reports
- **Maintenance:** Weekly health check reports

### Manual Monitoring
- **GitHub Actions:** Monitor workflow runs in the Actions tab
- **Vercel Dashboard:** Monitor frontend deployment status
- **Render Dashboard:** Monitor backend service health

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures:**
   ```bash
   # Check locally first
   npm ci
   npm run build
   npm test
   ```

2. **Deployment Failures:**
   - Check environment variables are set correctly
   - Verify secrets are not expired
   - Check service quotas (Vercel/Render)

3. **Test Failures:**
   - Run tests locally: `npm test`
   - Check for environment-specific issues
   - Review test logs in GitHub Actions

### Emergency Procedures

1. **Rollback Deployment:**
   ```bash
   # Vercel
   npx vercel rollback
   
   # Render
   # Use Render dashboard to rollback to previous deployment
   ```

2. **Disable CI/CD:**
   - Temporarily disable workflows in GitHub Actions
   - Make hotfixes directly via platform dashboards

## 📊 Performance Optimization

### Build Optimization
- Dependencies are cached between runs
- Only affected components are tested
- Parallel job execution where possible

### Security Best Practices
- Regular dependency audits
- Secret scanning on every commit
- Automated security issue reporting

## 🔄 Migration from Manual Deployment

If you were previously deploying manually:

1. **Backup Current Setup:**
   - Export current environment variables
   - Document current deployment process

2. **Configure Secrets:**
   - Add all required secrets to GitHub
   - Test with a non-production branch first

3. **Gradual Migration:**
   - Start with CI only (disable CD initially)
   - Test CD with a staging environment
   - Enable full pipeline for production

## 📅 Maintenance Schedule

- **Daily:** Automatic CI/CD on code changes
- **Tuesday 3 AM UTC:** Security scans
- **Sunday 2 AM UTC:** Weekly maintenance
- **Monthly:** Manual review of dependencies and performance

## 🆘 Support

If you encounter issues:

1. Check workflow logs in GitHub Actions
2. Review this documentation
3. Check platform status pages:
   - [GitHub Status](https://www.githubstatus.com/)
   - [Vercel Status](https://vercel-status.com/)
   - [Render Status](https://status.render.com/)

---

**CI/CD Version:** 2.0.0