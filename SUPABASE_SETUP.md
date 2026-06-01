# Supabase Setup Guide

This guide will help you set up Supabase for the Resolvr AI authentication system.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization (or create one)
5. Fill in project details:
   - **Name**: `resolvr-ai` (or your preferred name)
   - **Database Password**: Choose a strong password and save it
   - **Region**: Choose the region closest to your users
6. Click "Create new project"
7. Wait for the project to be provisioned (this may take 1-2 minutes)

## Step 2: Get Your Supabase Credentials

1. Once your project is ready, go to **Settings → API**
2. Copy the following values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public** key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Replace `your-project-url` and `your-anon-key` with the values you copied in Step 2.

**Example:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvbyIsInR5cGUiOiJhbm9uIiwic2lkIjoiYmFyIn0.baz
```

## Step 4: Run the Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the migration

This will create:

- `profiles` table (user profile data)
- `user_progress` table (user progress and game state)
- Triggers for automatic profile creation
- Row Level Security (RLS) policies
- Proper indexes for performance

## Step 5: Configure Redirect URLs (Important)

You must configure the allowed redirect URLs in your Supabase dashboard to avoid "Invalid path specified in request URL" errors.

1. Go to **Authentication → URL Configuration**
2. Add the following URLs to **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/**` (for local development)
3. If deploying to production, add your production URLs:
   - `https://your-domain.com/auth/callback`
   - `https://your-domain.com/**`

**Note:** The code currently has `emailConfirm: false` in the signup function to disable email confirmation for development. If you want to enable email confirmation in production, remove this line and ensure the redirect URLs are properly configured.

## Step 6: Configure Email Settings (Optional but Recommended)

Supabase provides email authentication by default. To customize:

1. Go to **Authentication → Providers**
2. Click on **Email**
3. You can:
   - Enable email confirmation (recommended for production)
   - Customize email templates
   - Set up custom SMTP (for production)

For development, the default settings work fine without email confirmation.

## Step 7: Restart Your Development Server

After configuring the environment variables:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

## Step 8: Test Authentication

### Test Signup:

1. Go to `http://localhost:3000/signup`
2. Fill in:
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Create Account"
4. You should be redirected to `/onboarding`

### Test Login:

1. Go to `http://localhost:3000/login`
2. Fill in:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Sign In"
4. You should be redirected to `/dashboard` (if onboarding complete) or `/onboarding`

### Test Logout:

1. Click your profile/settings
2. Click logout
3. You should be redirected to the landing page

## Troubleshooting

### "Cannot find module '@supabase/supabase-js'"

- Run `npm install @supabase/supabase-js --legacy-peer-deps` again
- Restart your TypeScript server in your IDE
- Delete `node_modules` and `.next` folders, then run `npm install` again

### "Invalid login credentials"

- Make sure you're using the correct email and password
- Check that the user exists in Supabase (Authentication → Users)

### "Profile not found" error

- Make sure you ran the SQL migration
- Check that the trigger `on_auth_user_created` is working
- Manually check the `profiles` table in Supabase

### Redirect loops

- Check that your environment variables are set correctly
- Make sure the Supabase URL and anon key are correct
- Clear your browser cookies and localStorage

## Security Notes

- **Never commit `.env.local` to version control** (it's already in `.gitignore`)
- The `anon` key is safe to use in client-side code
- For production, consider:
  - Enabling email confirmation
  - Setting up custom SMTP
  - Implementing rate limiting
  - Adding additional security policies

## Next Steps

After authentication is working:

- Phase 3: Persona Engine (already done)
- Phase 4: Simulations + Readiness (already done)
- Phase 5: Opportunities + Email
- Phase 6: Final Polish
