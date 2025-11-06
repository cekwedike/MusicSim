# Supabase Authentication Setup Guide

This guide will help you configure Supabase authentication for MusicSim, including Google OAuth sign-in.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Supabase Project Setup](#supabase-project-setup)
3. [Google OAuth Configuration](#google-oauth-configuration)
4. [Environment Configuration](#environment-configuration)
5. [Troubleshooting](#troubleshooting)
6. [Testing](#testing)

---

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- A Google account (for Google OAuth setup)
- Access to your deployed application URL

---

## Supabase Project Setup

### Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in the project details:
   - **Name**: MusicSim (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the region closest to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (this may take a few minutes)

### Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll need these three values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon (public) key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep this secret!)
   - **JWT Secret**: Found under JWT Settings

---

## Google OAuth Configuration

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API" or "Google People API"
   - Click **Enable**

4. Configure OAuth consent screen:
   - Go to **APIs & Services** → **OAuth consent screen**
   - Choose "External" user type
   - Fill in required fields:
     - App name: MusicSim
     - User support email: your email
     - Developer contact email: your email
   - Add scopes: `userinfo.email` and `userinfo.profile`
   - Add test users (if in testing mode)

5. Create OAuth 2.0 credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Choose "Web application"
   - Add **Authorized redirect URIs**:
     ```
     https://YOUR_SUPABASE_PROJECT_URL.supabase.co/auth/v1/callback
     ```
     Replace `YOUR_SUPABASE_PROJECT_URL` with your actual Supabase project reference ID

     For example: `https://rsibbwibevedhfbagsim.supabase.co/auth/v1/callback`

6. **Save your Client ID and Client Secret** - you'll need these next

### Step 2: Configure Google OAuth in Supabase

1. In your Supabase project dashboard, go to **Authentication** → **Providers**
2. Find "Google" in the list and click to expand
3. Enable the Google provider
4. Enter your Google OAuth credentials:
   - **Client ID**: Paste from Google Cloud Console
   - **Client Secret**: Paste from Google Cloud Console
5. Click **Save**

### Step 3: Configure URL Configuration

1. Go to **Authentication** → **URL Configuration**
2. Set the **Site URL** to your production domain:
   ```
   https://www.musicsim.net
   ```
   Or for local development:
   ```
   http://localhost:5173
   ```

3. Add **Redirect URLs** (one per line):
   ```
   https://www.musicsim.net
   https://www.musicsim.net/
   http://localhost:5173
   http://localhost:5173/
   ```

4. Click **Save**

---

## Environment Configuration

### Frontend Environment Variables

Create or update `frontend/.env`:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# API Configuration (for backend sync)
VITE_API_URL=https://your-backend-url.com
# Or for local development:
# VITE_API_URL=http://localhost:3001
```

### Backend Environment Variables

Create or update `backend/.env`:

```bash
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
SUPABASE_JWT_SECRET=your-jwt-secret-here

# JWT Configuration (use the same as Supabase JWT Secret)
JWT_SECRET=your-jwt-secret-here

# Database Configuration (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# Server Configuration
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://www.musicsim.net
```

**Important Notes:**
- Never commit `.env` files to version control
- Keep the `SUPABASE_SERVICE_KEY` and `JWT_SECRET` secure
- The `JWT_SECRET` should match your Supabase JWT Secret for proper token validation

---

## Troubleshooting

### Issue: "Unable to exchange external code" Error

**Symptoms**:
- User gets redirected back to your app with an error in the URL
- Error message: "Unable to exchange external code: 4/0Ab32..."
- App gets stuck on "Loading MusicSim..."

**Causes**:
1. Google OAuth redirect URI mismatch
2. Supabase Site URL not configured correctly
3. Google OAuth credentials not properly configured in Supabase

**Solutions**:

1. **Verify Google Cloud Console Redirect URIs**:
   - Go to Google Cloud Console → Credentials
   - Edit your OAuth 2.0 Client ID
   - Ensure the redirect URI is EXACTLY:
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```
   - No trailing slashes, no typos

2. **Verify Supabase URL Configuration**:
   - Go to Supabase → Authentication → URL Configuration
   - Ensure Site URL matches your production domain exactly:
     ```
     https://www.musicsim.net
     ```
   - Ensure all redirect URLs are added (with and without trailing slash)

3. **Clear Browser Cache and Cookies**:
   - Clear your browser's cache for your domain
   - Clear localStorage: Open DevTools → Application → Local Storage → Clear All
   - Try in an incognito/private window

4. **Check Google OAuth Configuration**:
   - Verify Client ID and Client Secret in Supabase match Google Cloud Console
   - Ensure Google OAuth is enabled in Supabase
   - Check that Google+ API is enabled in Google Cloud Console

### Issue: Stuck on "Loading MusicSim..." After Redirect

**Solution**: This should now be fixed by the error handling code. The app will:
- Detect OAuth errors in the URL
- Clear the error parameters from the URL
- Show a user-friendly error message
- Allow the user to try again

If still stuck:
1. Manually clear the URL by navigating to `https://www.musicsim.net`
2. Clear browser localStorage and cookies
3. Try again

### Issue: Manual Registration/Login Not Working

**Symptoms**:
- Email/password registration fails
- Login with email/password doesn't work

**Solutions**:

1. **Check Supabase Email Auth Settings**:
   - Go to Supabase → Authentication → Providers
   - Ensure "Email" provider is enabled
   - Check email confirmation settings

2. **Verify Email Confirmation**:
   - If email confirmation is enabled, users must confirm their email before logging in
   - Check user's email for confirmation link
   - Or disable email confirmation in Supabase → Authentication → Email Auth → "Enable email confirmations"

3. **Check Backend Sync**:
   - Verify backend is running and accessible
   - Check backend logs for errors
   - Test `/api/auth/sync-profile` endpoint

### Issue: Username Update Causes Redirect Loop

**Solution**:
The issue occurs when:
- User updates their username
- App tries to sync with backend
- Backend authentication fails
- User gets redirected

To fix:
1. Ensure backend JWT validation is working correctly
2. Verify Supabase JWT Secret matches between frontend and backend
3. Check backend middleware is correctly parsing Supabase JWT tokens

---

## Testing

### Test Google OAuth Flow

1. Clear your browser cache and localStorage
2. Navigate to your application
3. Click "Sign in with Google"
4. You should be redirected to Google
5. Sign in with your Google account
6. Grant permissions
7. You should be redirected back to your app
8. You should be logged in automatically

### Test Email/Password Registration

1. Click "Register"
2. Fill in username, email, and password
3. Click "Create Account"
4. Check email for confirmation link (if enabled)
5. Click confirmation link
6. You should be logged in

### Test Email/Password Login

1. Click "Login"
2. Enter email and password
3. Click "Login"
4. You should be logged in

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Update Supabase Site URL to production domain
- [ ] Add production domain to Redirect URLs
- [ ] Update Google OAuth redirect URI to use Supabase callback URL
- [ ] Set all environment variables in production environment
- [ ] Test OAuth flow in production
- [ ] Test email/password auth in production
- [ ] Enable HTTPS (required for OAuth)
- [ ] Configure email templates in Supabase (optional)
- [ ] Set up email service in Supabase (optional, defaults to Supabase SMTP)
- [ ] Monitor authentication logs in Supabase dashboard

---

## Security Best Practices

1. **Never expose service role key in frontend**
   - Only use anon key in frontend
   - Keep service role key in backend only

2. **Enable Row Level Security (RLS) in Supabase**
   - Go to Database → Tables
   - Enable RLS on all tables
   - Create appropriate policies

3. **Use HTTPS in production**
   - OAuth requires HTTPS
   - Get SSL certificate (free with services like Vercel, Netlify, etc.)

4. **Implement rate limiting**
   - Supabase has built-in rate limiting
   - Configure in Supabase dashboard

5. **Monitor authentication attempts**
   - Check Supabase logs regularly
   - Set up alerts for suspicious activity

---

## Additional Resources

- [Supabase Authentication Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Google OAuth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

---

## Support

If you encounter issues:
1. Check Supabase logs: Dashboard → Logs
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Test in incognito/private window
5. Review this troubleshooting guide

---

**Last Updated**: January 2025
**Version**: 2.0.0 (Supabase)
