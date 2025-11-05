# Google OAuth Authentication Setup Guide

This guide will help you set up Google OAuth authentication for MusicSim, allowing users to sign up and log in using their Google accounts.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Google Cloud Console Setup](#google-cloud-console-setup)
3. [Backend Configuration](#backend-configuration)
4. [Database Migration](#database-migration)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:
- A Google account
- Node.js and npm installed
- PostgreSQL database running
- MusicSim backend and frontend running locally

---

## Google Cloud Console Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click "New Project"
4. Enter a project name (e.g., "MusicSim")
5. Click "Create"

### Step 2: Enable Google+ API

1. In your Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API" (or "Google People API")
3. Click on it and press "Enable"

### Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" as the user type (unless you have a Google Workspace)
3. Click "Create"
4. Fill in the required fields:
   - **App name**: MusicSim (or your app name)
   - **User support email**: Your email address
   - **Developer contact email**: Your email address
5. Click "Save and Continue"
6. On the "Scopes" page, click "Add or Remove Scopes"
   - Add the following scopes:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
7. Click "Save and Continue"
8. Add test users if your app is in testing mode:
   - Add your Google account email
   - Add any other accounts you want to test with
9. Click "Save and Continue"
10. Review and click "Back to Dashboard"

### Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Give it a name (e.g., "MusicSim Web Client")
5. Under "Authorized JavaScript origins", add:
   ```
   http://localhost:5173
   http://localhost:3001
   ```
6. Under "Authorized redirect URIs", add:
   ```
   http://localhost:3001/api/auth/google/callback
   ```
7. Click "Create"
8. **IMPORTANT**: Save your **Client ID** and **Client Secret** - you'll need these for the backend configuration

---

## Backend Configuration

### Step 1: Update Environment Variables

1. Open your `backend/.env` file (create it from `.env.example` if it doesn't exist)
2. Add the following Google OAuth configuration:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
```

Replace `your-actual-client-id` and `your-actual-client-secret` with the values you saved from Google Cloud Console.

### Step 2: Verify Dependencies

The required dependencies should already be installed. If not, run:

```bash
cd backend
npm install passport passport-google-oauth20
```

---

## Database Migration

The User model has been updated to support OAuth authentication. You need to update your database schema.

### Option 1: Auto-Migration (Development)

If you're in development mode and don't have important data:

1. Open `backend/server.js`
2. Temporarily change the sequelize.sync line to:
   ```javascript
   await sequelize.sync({ alter: true });
   ```
3. Restart the backend server - this will automatically add the new columns
4. Change it back to `{ alter: false }` after the migration

### Option 2: Manual SQL Migration (Production/Safer)

Run the following SQL commands on your PostgreSQL database:

```sql
-- Add new columns to Users table
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "authProvider" VARCHAR(255) DEFAULT 'local' NOT NULL;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "googleId" VARCHAR(255) UNIQUE;

-- Make password and username nullable for OAuth users
ALTER TABLE "Users" ALTER COLUMN "password" DROP NOT NULL;
ALTER TABLE "Users" ALTER COLUMN "username" DROP NOT NULL;
```

### Verify Migration

After migration, your Users table should have these new columns:
- `authProvider` (VARCHAR, default: 'local')
- `googleId` (VARCHAR, unique)

And these columns should now allow NULL:
- `password`
- `username`

---

## Testing

### Step 1: Start the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

### Step 2: Test Google Sign-In

1. Open the application in your browser (usually `http://localhost:5173`)
2. Click on the login/register button
3. In the login modal, you should see a "Sign in with Google" button
4. Click the Google sign-in button
5. You'll be redirected to Google's login page
6. Sign in with a Google account (must be added as a test user if your app is in testing mode)
7. Grant the requested permissions
8. You should be redirected back to MusicSim and automatically logged in

### Step 3: Verify User Creation

Check your database to verify the user was created:

```sql
SELECT id, email, username, "authProvider", "googleId", "displayName"
FROM "Users"
WHERE "authProvider" = 'google';
```

You should see:
- `authProvider` = 'google'
- `googleId` = (Google's user ID)
- `email` = (your Google email)
- `displayName` = (your Google display name)
- `username` = (auto-generated from email)

---

## How It Works

### Authentication Flow

1. **User clicks "Sign in with Google"**
   - Frontend redirects to `http://localhost:3001/api/auth/google`

2. **Backend initiates OAuth flow**
   - Passport redirects to Google's OAuth consent screen

3. **User grants permissions**
   - Google redirects back to `http://localhost:3001/api/auth/google/callback`

4. **Backend processes OAuth response**
   - Passport validates the response from Google
   - Checks if user exists with that Google ID
   - If not, checks if user exists with that email (to link accounts)
   - Creates new user if necessary
   - Generates JWT token

5. **Frontend handles callback**
   - Backend redirects to frontend with token in URL params
   - AuthContext extracts token from URL
   - Fetches user data and stores in localStorage
   - User is logged in

### Account Linking

If you already have an account with email `user@gmail.com` and then sign in with Google using the same email:
- The system will link your Google account to your existing account
- You'll be able to log in using either method
- Your profile image and display name will be updated from Google (if not already set)

---

## Troubleshooting

### "Access blocked: This app's request is invalid"

**Solution**: Make sure you've configured the OAuth consent screen properly and added your email as a test user.

### "redirect_uri_mismatch" error

**Solution**:
1. Check that your redirect URI in Google Cloud Console exactly matches:
   ```
   http://localhost:3001/api/auth/google/callback
   ```
2. Make sure there are no trailing slashes or typos
3. Wait a few minutes after adding the URI (changes may take time to propagate)

### Backend returns 500 error

**Solution**:
1. Check backend logs for detailed error messages
2. Verify environment variables are set correctly:
   ```bash
   # In backend directory
   node -e "console.log(process.env.GOOGLE_CLIENT_ID)"
   ```
3. Ensure database migration completed successfully
4. Restart the backend server after changing .env file

### Token not being saved

**Solution**:
1. Check browser console for errors
2. Verify AuthContext is handling the callback correctly
3. Check that localStorage is not blocked by browser settings
4. Open DevTools > Application > Local Storage and verify `musicsim_token` is present

### OAuth works but user data not displaying

**Solution**:
1. Check that the `/api/auth/me` endpoint is working
2. Verify JWT token is being sent in Authorization header
3. Check backend logs for authentication errors

### "Error: Failed to serialize user into session"

**Solution**: This shouldn't happen as we're using `session: false` in the Passport configuration. If you see this, verify your passport configuration in `backend/config/passport.js`.

---

## Production Deployment

When deploying to production, remember to:

1. **Update OAuth Redirect URIs** in Google Cloud Console:
   - Add your production domain (e.g., `https://yourdomain.com`)
   - Update callback URI to: `https://yourdomain.com/api/auth/google/callback`

2. **Update Environment Variables**:
   ```bash
   GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
   FRONTEND_URL=https://yourdomain.com
   ```

3. **Publish OAuth App**:
   - Go to OAuth consent screen in Google Cloud Console
   - Click "Publish App" to make it available to all users
   - May require verification process for certain scopes

4. **Use HTTPS**:
   - Google OAuth requires HTTPS in production
   - Ensure your domain has a valid SSL certificate

---

## Security Best Practices

1. **Never commit credentials**: Keep `.env` files out of version control
2. **Use strong JWT secrets**: Generate using `openssl rand -base64 64`
3. **Validate redirect URIs**: Only allow your own domains
4. **Implement rate limiting**: Prevent OAuth endpoint abuse
5. **Monitor failed attempts**: Log and alert on suspicious activity
6. **Regular security audits**: Keep dependencies updated

---

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Documentation](http://www.passportjs.org/docs/)
- [Google Cloud Console](https://console.cloud.google.com/)

---

## Support

If you encounter issues not covered in this guide:
1. Check backend logs for detailed error messages
2. Enable debug mode in Passport: `DEBUG=passport:* npm start`
3. Review Google Cloud Console logs
4. Check that all environment variables are correctly set

---

**Last Updated**: November 2025
**Version**: 1.0.0
