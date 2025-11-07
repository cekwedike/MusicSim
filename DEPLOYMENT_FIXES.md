# Deployment Issues & Fixes

## 🔴 Issues Found in Render Logs

### Issue 1: Database Connection Failing (IPv6 Problem)
**Error:** `connect ENETUNREACH 2600:1f18:2e13:9d22:c99b:929b:a5c0:5bb8:5432`

**Cause:** Render is trying to connect via IPv6, but Supabase might not be accessible via IPv6

**Solution:**
Try using Supabase's **connection pooling URL** instead of the direct database URL:

1. Go to Supabase Dashboard → Project: `rsibbwibevedhfbagsim`
2. Go to **Settings** → **Database**
3. Look for "Connection Pooling" section
4. Copy the **Transaction Mode** or **Session Mode** connection string
5. It should look like:
   ```
   postgresql://postgres.rsibbwibevedhfbagsim:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
6. Use this URL instead in Render's `DATABASE_URL` environment variable

**Alternative**: Add to Render's `DATABASE_URL`:
```
postgresql://postgres:Cheedii_1206@db.rsibbwibevedhfbagsim.supabase.co:5432/postgres?options=-c%20client_encoding=utf8
```

---

### Issue 2: Localhost URLs Still in Logs

**Error:** Logs show `http://localhost:3001/api/health` instead of production URL

**Cause:** `BACKEND_URL` environment variable is NOT SET in Render

**Solution:**
1. Go to Render Dashboard → musicsim-backend → Environment
2. Click "Add Environment Variable"
3. Add:
   - Key: `BACKEND_URL`
   - Value: `https://musicsim-backend.onrender.com`
4. Save and wait for automatic redeploy

---

### Issue 3: Supabase Email Confirmation Issues

**Errors:**
- "No Session Created" red toast notification
- Email link showing: `error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired`

**Causes:**
1. Supabase redirect URL misconfigured
2. Email confirmation timeout too short
3. Site URL not set correctly in Supabase

**Solutions:**

#### A. Fix Supabase Redirect URLs

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Set **Site URL** to: `https://www.musicsim.net`
3. Add these to **Redirect URLs**:
   ```
   https://www.musicsim.net
   https://www.musicsim.net/
   https://www.musicsim.net/**
   https://rsibbwibevedhfbagsim.supabase.co
   http://localhost:5173
   ```

#### B. Disable Email Confirmation (Recommended for Guest Mode)

Since you want users to play WITHOUT authentication:

1. Go to Supabase Dashboard → Authentication → Providers
2. Click on **Email**
3. **Disable "Confirm email"** toggle
4. Save

This allows users to sign up and play immediately without email verification.

#### C. Increase Email Link Expiry

1. Go to Supabase Dashboard → Authentication → Providers
2. Click on **Email**
3. Increase **Email Link Expiry** from default (1 hour) to 24 hours or more
4. Save

---

### Issue 4: Guest Mode Not Working Properly

**Problem:** Users are forced to authenticate before playing

**Solution:** Your app already has guest mode support! But we need to make sure it's enabled.

Check `frontend/App.tsx` - users should be able to:
1. Click "Play as Guest" to start playing immediately
2. Access all game features without authentication
3. See "Guest" status in profile
4. Authenticate later from profile screen to save progress

If this isn't working, we need to update the UI flow.

---

## ✅ Actions to Take RIGHT NOW

### Step 1: Fix Backend Environment Variables in Render

Add these to Render → musicsim-backend → Environment:

| Variable | Value |
|----------|-------|
| `BACKEND_URL` | `https://musicsim-backend.onrender.com` |
| `DATABASE_URL` | Use Supabase **Connection Pooling URL** (see Issue 1) |

### Step 2: Fix Supabase Auth Settings

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Set **Site URL**: `https://www.musicsim.net`
3. Add **Redirect URLs**:
   - `https://www.musicsim.net`
   - `https://www.musicsim.net/**`
   - `https://rsibbwibevedhfbagsim.supabase.co`

4. Go to Authentication → Providers → Email
5. **DISABLE** "Confirm email" (to allow instant play)
6. OR increase "Email Link Expiry" to 24 hours

### Step 3: Push Updated Code

I've made these code changes:
1. ✅ Fixed database connection with keepAlive and longer timeouts
2. ✅ Fixed swagger.js to use dynamic URL
3. ✅ Updated frontend `.env` to use production backend

Now you need to:
```bash
git add .
git commit -m "fix: Update deployment configuration for production"
git push
```

This will trigger automatic redeployment on Render.

---

## 🧪 Testing Checklist

After making the changes above, verify:

### Backend (Render)
- [ ] Logs show: "Database connection established successfully"
- [ ] Logs show: "Google OAuth is configured and ready"
- [ ] Logs show backend URL (NOT localhost)
- [ ] Health check works: https://musicsim-backend.onrender.com/api/health
- [ ] API docs load: https://musicsim-backend.onrender.com/api-docs

### Frontend (Supabase/musicsim.net)
- [ ] Can play as guest without signing up
- [ ] Guest mode works fully
- [ ] Sign up creates account instantly (no email confirmation)
- [ ] OR Email confirmation link works when clicked
- [ ] Profile shows "Not authenticated" for guests
- [ ] Can authenticate from profile screen later

---

## 🔧 Alternative: Complete Guest Mode Setup

If you want users to play **completely anonymously** without any authentication:

### Option 1: Pure Guest Mode (No Auth at All)
1. Remove login requirement entirely
2. Store all data in localStorage
3. Add "Create Account" button in profile to convert to registered user

### Option 2: Anonymous Auth (Recommended)
1. Use Supabase Anonymous Auth
2. Users get auto-generated anonymous accounts
3. Can "upgrade" to email/password account later

Let me know which option you prefer and I can implement it!

---

## Common Error Messages Explained

| Error | Meaning | Fix |
|-------|---------|-----|
| `ENETUNREACH` | Can't reach database via IPv6 | Use connection pooling URL |
| `localhost` in logs | Environment variable not set | Add BACKEND_URL in Render |
| `otp_expired` | Email confirmation link expired | Disable email confirmation or increase expiry |
| `No Session Created` | Supabase session not created properly | Check redirect URLs in Supabase settings |

---

## Need More Help?

Share:
1. Updated Render logs after making changes
2. Browser console errors when trying to sign up
3. Which guest mode option you prefer (see above)
