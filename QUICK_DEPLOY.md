# Quick Deployment Steps for MusicSim

## ⚡ Fast Track Deployment

### 1. Deploy Backend (5 minutes)
1. Go to https://render.com → Sign up with GitHub
2. New Web Service → Connect your repository
3. Settings:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
4. Add environment variables from `backend/.env`
5. Deploy!
6. **Copy your backend URL** (e.g., `https://musicsim-backend.onrender.com`)

### 2. Deploy Frontend (3 minutes)
1. Go to https://vercel.com → Sign up with GitHub
2. New Project → Import `MusicSim` repo
3. Framework: Vite
4. Add environment variables:
   ```
   VITE_SUPABASE_URL=https://rsibbwibevedhfbagsim.supabase.co
   VITE_SUPABASE_ANON_KEY=<from frontend/.env>
   VITE_API_URL=<your-render-backend-url>/api
   ```
5. Deploy!

### 3. Connect Domain musicsim.net (2 minutes)
1. Vercel → Settings → Domains
2. Add `musicsim.net` and `www.musicsim.net`
3. Update DNS at your registrar:
   - A record: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`

### 4. Update Supabase (2 minutes)
1. Supabase Dashboard → Authentication → URL Configuration
2. Add redirect URLs:
   - `https://musicsim.net`
   - `https://www.musicsim.net`
3. Site URL: `https://musicsim.net`

### 5. Test!
- Visit https://musicsim.net
- Try login with Google
- Play the game!

---

## Need Help?
See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## Logout Issue Fixed!
The logout loading bug has been fixed. Test by:
1. Refresh your browser (Ctrl+Shift+R)
2. Login with Google
3. Click logout - should work immediately now!
