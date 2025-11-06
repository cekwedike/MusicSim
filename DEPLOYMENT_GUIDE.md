# MusicSim Deployment Guide

## Overview

- **Frontend**: Vercel (with custom domain musicsim.net)
- **Backend**: Render.com (or Railway/Heroku)
- **Database & Auth**: Supabase (already configured)

---

## Part 1: Deploy Backend to Render.com

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended for easy deployment)

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select the `MusicSim` repository
4. Configure the service:
   - **Name**: `musicsim-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Add Environment Variables
Click "Advanced" → "Add Environment Variable" for each:

```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://postgres:Cheedii_1206@db.rsibbwibevedhfbagsim.supabase.co:5432/postgres
SUPABASE_URL=https://rsibbwibevedhfbagsim.supabase.co
SUPABASE_SERVICE_KEY=<your-service-role-key>
SUPABASE_JWT_SECRET=<your-jwt-secret>
FRONTEND_URL=https://musicsim.net
```

⚠️ **Important**: Copy these from your local `backend/.env` file!

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete (~5 minutes)
3. Copy your backend URL (e.g., `https://musicsim-backend.onrender.com`)

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

Or deploy via Vercel Dashboard (easier for first time).

### Step 2: Deploy via Vercel Dashboard

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Import your `MusicSim` repository
5. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: Leave as `./` (we have vercel.json configured)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`

### Step 3: Add Environment Variables

Go to Project Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://rsibbwibevedhfbagsim.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_API_URL=https://musicsim-backend.onrender.com/api
```

⚠️ **Replace backend URL** with your actual Render URL from Part 1!

### Step 4: Deploy
1. Click "Deploy"
2. Wait for deployment (~2 minutes)
3. You'll get a URL like `https://musicsim-xxxx.vercel.app`

---

## Part 3: Connect Custom Domain (musicsim.net)

### Step 1: Add Domain in Vercel
1. Go to your Vercel project
2. Click "Settings" → "Domains"
3. Add domain: `musicsim.net`
4. Also add: `www.musicsim.net`

### Step 2: Configure DNS

Vercel will show you DNS records to add. Go to your domain registrar:

**For root domain (musicsim.net):**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21` (Vercel's IP)

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

⏰ **DNS propagation takes 10 minutes to 48 hours**

### Step 3: Verify
- Check Vercel dashboard - domain should show "Valid Configuration"
- Visit https://musicsim.net (may take time for DNS)

---

## Part 4: Update Supabase Configuration

### Google OAuth Redirect URLs

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/rsibbwibevedhfbagsim
2. Navigate to: **Authentication** → **URL Configuration**
3. Add to "Redirect URLs":
   ```
   https://musicsim.net
   https://www.musicsim.net
   ```
4. Update "Site URL" to: `https://musicsim.net`

### Update Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID
3. Add to "Authorized redirect URIs":
   ```
   https://rsibbwibevedhfbagsim.supabase.co/auth/v1/callback
   ```
4. Add to "Authorized JavaScript origins":
   ```
   https://musicsim.net
   https://www.musicsim.net
   ```

---

## Part 5: Testing Production Deployment

### Checklist

- [ ] Backend health check works: `https://musicsim-backend.onrender.com/api/health`
- [ ] Frontend loads: `https://musicsim.net`
- [ ] Email/password login works
- [ ] Google OAuth login works
- [ ] Game saves/loads correctly
- [ ] Profile editing works
- [ ] Logout works correctly

### Common Issues

**Issue**: "Network Error" in frontend
- **Solution**: Check `VITE_API_URL` environment variable in Vercel
- **Solution**: Check CORS is enabled in backend (already done ✅)

**Issue**: Google OAuth redirects to localhost
- **Solution**: Update Supabase redirect URLs (see Part 4)

**Issue**: Backend returns 401 errors
- **Solution**: Verify `SUPABASE_JWT_SECRET` matches in both Render and Supabase

**Issue**: CSS not loading
- **Solution**: Clear browser cache, check Vercel build logs

---

## Part 6: Post-Deployment Maintenance

### Update Frontend
```bash
git add .
git commit -m "Update frontend"
git push
```
Vercel auto-deploys on push to main branch!

### Update Backend
```bash
git add .
git commit -m "Update backend"
git push
```
Render auto-deploys on push to main branch!

### View Logs
- **Frontend**: Vercel Dashboard → Your Project → Deployments → Logs
- **Backend**: Render Dashboard → Your Service → Logs

### Scale Up (When Needed)
- **Backend**: Render Dashboard → Upgrade plan for more resources
- **Frontend**: Vercel automatically scales
- **Database**: Supabase Dashboard → Database Settings → Upgrade

---

## Environment Variables Reference

### Backend (.env) - Set in Render
```
NODE_ENV=production
PORT=3001
DATABASE_URL=<supabase-postgres-url>
SUPABASE_URL=https://rsibbwibevedhfbagsim.supabase.co
SUPABASE_SERVICE_KEY=<your-service-role-key>
SUPABASE_JWT_SECRET=<your-jwt-secret>
FRONTEND_URL=https://musicsim.net
```

### Frontend (.env) - Set in Vercel
```
VITE_SUPABASE_URL=https://rsibbwibevedhfbagsim.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_API_URL=https://<your-backend-url>/api
```

---

## Quick Deploy Commands (Alternative)

### Deploy Backend to Render (CLI)
```bash
cd backend
git init
git add .
git commit -m "Initial backend"
render deploy
```

### Deploy Frontend to Vercel (CLI)
```bash
cd frontend
vercel
# Follow prompts
vercel --prod
```

---

## Security Checklist

- [ ] Rotate Supabase service_role key (it was shared in conversation)
- [ ] Never commit `.env` files (already gitignored ✅)
- [ ] Enable HTTPS only (Vercel does this automatically ✅)
- [ ] Set up rate limiting in backend (optional)
- [ ] Enable Supabase RLS policies (optional but recommended)
- [ ] Set up monitoring/alerts (optional)

---

## Estimated Costs

- **Vercel**: $0/month (Hobby plan - good for 100GB bandwidth)
- **Render**: $0/month (Free plan - sleeps after 15 min inactivity)
- **Supabase**: $0/month (Free plan - 500MB database, 50,000 monthly active users)

**Total**: $0/month for moderate traffic! 🎉

Upgrade when needed:
- Vercel Pro: $20/month (more bandwidth)
- Render Starter: $7/month (no sleep, better performance)
- Supabase Pro: $25/month (8GB database, 100,000 MAU)

---

## Support

If you encounter issues:
1. Check Vercel/Render logs
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Check Supabase Dashboard → Logs

---

**Created**: 2025-11-06
**Status**: Ready to Deploy
**Next**: Follow Part 1 to start deploying!
