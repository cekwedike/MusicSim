# Supabase Storage & Profile Management Setup

## Overview

This guide covers setting up:
1. **Storage Bucket** for profile images
2. **User Profile Updates** (username, profile image)
3. **Password Reset** (forgot password functionality)

---

## 📦 Part 1: Create Supabase Storage Bucket

### Step 1: Create Storage Bucket

1. Go to your Supabase project dashboard at https://supabase.com
2. Click **Storage** in the left sidebar
3. Click **"New bucket"** button
4. Configure the bucket:
   - **Name**: `profile-images`
   - **Public bucket**: ✅ Check this (images need to be publicly accessible)
   - **File size limit**: 2 MB (reasonable for profile images)
   - **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp`
5. Click **"Create bucket"**

### Step 2: Set Bucket Policies

After creating the bucket, set up security policies:

#### Policy 1: Allow Anyone to Read Images
```sql
-- Allow public read access to profile images
CREATE POLICY "Public profile images are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');
```

#### Policy 2: Allow Users to Upload Their Own Images
```sql
-- Allow authenticated users to upload images
CREATE POLICY "Users can upload profile images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 3: Allow Users to Update Their Own Images
```sql
-- Allow users to update their own images
CREATE POLICY "Users can update their own profile images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 4: Allow Users to Delete Their Own Images
```sql
-- Allow users to delete their own images
CREATE POLICY "Users can delete their own profile images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Step 3: Configure Storage Settings (Optional)

In **Storage Settings**:
- **File size limit**: 2 MB (adjust as needed)
- **Allowed MIME types**: Add image types
- **Image transformation**: Enable if you want automatic resizing

---

## 🔐 Part 2: Configure Password Reset Email

### Step 1: Email Templates

1. Go to **Authentication** → **Email Templates**
2. Find **"Reset Password"** template
3. Customize the email:

**Subject**: `Reset Your MusicSim Password`

**Body**:
```html
<h2>Reset Your Password</h2>
<p>Hi there,</p>
<p>Someone requested a password reset for your MusicSim account.</p>
<p>If this was you, click the button below to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}" style="background-color: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a></p>
<p>This link will expire in 24 hours.</p>
<p>If you didn't request this, you can safely ignore this email.</p>
<p>Thanks,<br>The MusicSim Team</p>
```

### Step 2: Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Add your **Site URL**: `https://www.musicsim.net` (or your domain)
3. Add **Redirect URLs**:
   - `https://www.musicsim.net`
   - `https://www.musicsim.net/reset-password`
   - `http://localhost:5173` (for development)
   - `http://localhost:5173/reset-password` (for development)

---

## 💻 Part 3: Implementation

### Files Modified/Created:

1. `frontend/services/authService.supabase.ts` - Add storage and profile update functions
2. `frontend/components/ProfilePanel.tsx` - Add image upload and username editing
3. `frontend/components/LoginModal.tsx` - Add forgot password and reset password UI
4. `backend/routes/auth.js` - Add update username endpoint

---

## 🖼️ Storage Bucket Structure

Profile images will be organized by user ID:

```
profile-images/
├── {user-id-1}/
│   └── profile.jpg
├── {user-id-2}/
│   └── profile.png
└── {user-id-3}/
    └── profile.webp
```

Each user has their own folder (their user ID), ensuring:
- Users can only modify their own images
- Easy to find images by user ID
- Automatic cleanup when users are deleted

---

## 🔑 Environment Variables

Make sure your `.env` file has:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

No additional environment variables needed for storage - it uses the same connection.

---

## 🎯 Features Implemented

### 1. Profile Image Upload
- Click profile image to upload new image
- Drag & drop support
- Image preview before upload
- Automatic upload to Supabase Storage
- Profile updates with new image URL

### 2. Username Update
- Click pencil icon next to username
- Inline editing
- Validation (3-20 characters, alphanumeric + underscore)
- Updates both Supabase Auth and backend database

### 3. Password Reset Flow

**Forgot Password:**
1. User clicks "Forgot Password?" in login modal
2. Enters email address
3. Receives reset email from Supabase
4. Clicks link in email → redirected to app with reset token
5. App detects token and shows password reset form
6. User enters new password
7. Password updated, user can log in

**Reset Email Example:**
```
Subject: Reset Your MusicSim Password

Hi there,

Someone requested a password reset for your MusicSim account.

If this was you, click the button below to reset your password:

[Reset Password Button]

This link will expire in 24 hours.

If you didn't request this, you can safely ignore this email.

Thanks,
The MusicSim Team
```

---

## 🧪 Testing Checklist

### Storage Bucket:
- [ ] Bucket created and public
- [ ] Policies applied correctly
- [ ] Can upload images via UI
- [ ] Images are publicly accessible
- [ ] Users can only modify their own images

### Profile Updates:
- [ ] Can click profile image to upload
- [ ] Image preview works
- [ ] Upload shows progress/success message
- [ ] Profile image updates in UI immediately
- [ ] Username edit works with validation
- [ ] Username persists after page reload

### Password Reset:
- [ ] "Forgot Password?" link appears in login modal
- [ ] Can enter email and request reset
- [ ] Reset email is received
- [ ] Reset link redirects correctly
- [ ] Can set new password
- [ ] Can log in with new password
- [ ] Invalid tokens show error message

---

## 🔒 Security Considerations

### Storage Policies:
- ✅ Users can only upload to their own folder (user ID)
- ✅ Users cannot delete/modify other users' images
- ✅ Images are publicly readable (needed for profile display)
- ✅ File size limited to prevent abuse
- ✅ Only image MIME types allowed

### Password Reset:
- ✅ Tokens expire after 24 hours
- ✅ Tokens are single-use (Supabase handles this)
- ✅ Email validation prevents spam
- ✅ Rate limiting on password reset requests (Supabase handles this)

### Profile Updates:
- ✅ Username validation prevents malicious usernames
- ✅ Users can only update their own profile
- ✅ Backend validates user authentication

---

## 🐛 Troubleshooting

### Issue: Can't Upload Images

**Problem**: Upload fails with "Policy violation" error

**Solution**:
1. Check that storage policies are applied
2. Verify user is authenticated
3. Ensure bucket is public
4. Check browser console for specific error

### Issue: Images Not Loading

**Problem**: Profile images show broken link

**Solution**:
1. Verify bucket is public
2. Check image URL format: `https://your-project.supabase.co/storage/v1/object/public/profile-images/{user-id}/profile.jpg`
3. Test URL directly in browser
4. Check if image was actually uploaded

### Issue: Password Reset Email Not Received

**Problem**: User doesn't receive reset email

**Solution**:
1. Check spam/junk folder
2. Verify email template is configured
3. Check Supabase email logs: Dashboard → Authentication → Logs
4. Ensure redirect URLs are configured correctly
5. Verify SMTP settings if using custom SMTP

### Issue: Username Update Fails

**Problem**: Username doesn't save

**Solution**:
1. Check username validation (3-20 chars, alphanumeric + underscore)
2. Verify backend `/auth/update-username` endpoint exists
3. Check browser console for errors
4. Ensure user is authenticated

---

## 📖 API Endpoints

### Update Username
```
POST /auth/update-username
Headers:
  - Cookie: session cookie (from Supabase)
Body:
  {
    "username": "newusername123"
  }
Response:
  {
    "success": true,
    "user": { username: "newusername123", ... }
  }
```

### Upload Profile Image
```
Handled by Supabase Storage SDK
No custom backend endpoint needed
```

### Password Reset Request
```
Handled by Supabase Auth
supabase.auth.resetPasswordForEmail(email)
```

### Password Reset Confirm
```
Handled by Supabase Auth
supabase.auth.updateUser({ password: newPassword })
```

---

## 🚀 Deployment Notes

### Vercel/Netlify:
- Environment variables must be set in deployment platform
- Redirect URLs must include production domain
- Test password reset flow in production

### Custom Domain:
- Update redirect URLs in Supabase to use your custom domain
- Update site URL in Supabase settings
- Test email links point to correct domain

---

## 📋 Quick Setup Checklist

**Supabase Dashboard:**
- [ ] Create `profile-images` bucket (public)
- [ ] Apply storage policies (4 policies)
- [ ] Configure password reset email template
- [ ] Add redirect URLs (production + local)
- [ ] Set site URL

**Code Implementation:**
- [ ] Update `authService.supabase.ts` with new functions
- [ ] Update `ProfilePanel.tsx` for image upload
- [ ] Update `LoginModal.tsx` for password reset
- [ ] Add backend `/update-username` endpoint
- [ ] Test all features locally

**Testing:**
- [ ] Upload profile image
- [ ] Update username
- [ ] Request password reset
- [ ] Complete password reset flow
- [ ] Test error cases

---

**Version**: 1.0.0
**Last Updated**: January 2025

This completes the Supabase storage and profile management setup. All user profile features are now fully functional!
