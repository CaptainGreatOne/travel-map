# Environment Variables

This document explains all environment variables required to run the Travel Map application.

## Required Variables

### VITE_SUPABASE_URL

Your Supabase project URL.

**Format:** `https://your-project-id.supabase.co`

**Where to find it:**
1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project (or create a new one)
3. Go to **Project Settings** (gear icon in sidebar)
4. Click **API** in the left menu
5. Copy the **Project URL**

### VITE_SUPABASE_ANON_KEY

Your Supabase public/anon API key.

**Format:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long JWT string)

**Where to find it:**
1. Same location as VITE_SUPABASE_URL
2. In **Project Settings > API**
3. Copy the **anon/public** key (NOT the service_role key)

**Security note:** The anon key is safe to expose in client-side code. Row Level Security (RLS) policies protect your data at the database level.

### VITE_ADMIN_EMAILS

Comma-separated list of email addresses that should have admin access.

**Format:** `admin@example.com` or `admin@example.com,owner@example.com`

**How it works:**
- Users whose email matches any entry gain access to the Admin menu
- Comparison is case-insensitive (`Admin@Example.com` = `admin@example.com`)
- Users must be logged in (authenticated) to access admin features
- UI-level restriction; database operations still require authentication

## Example .env.local

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwNDAwMDAwMCwiZXhwIjoyMDE5NTc2MDAwfQ.examplekey123

# Admin Configuration
VITE_ADMIN_EMAILS=admin@example.com,owner@example.com
```

## Setting Up Supabase

### 1. Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub, GitLab, or email
3. Free tier includes 500MB database, 1GB storage, 50,000 monthly active users

### 2. Create a New Project

1. Click **New Project**
2. Choose your organization
3. Enter a project name (e.g., "travel-map")
4. Set a secure database password (save this somewhere safe)
5. Select a region close to your users
6. Click **Create new project**

### 3. Get Your API Credentials

1. Wait for project to finish provisioning (~2 minutes)
2. Go to **Project Settings > API**
3. Copy **Project URL** to `VITE_SUPABASE_URL`
4. Copy **anon/public key** to `VITE_SUPABASE_ANON_KEY`

### 4. Set Up the Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase/seed.sql` from this project
3. Paste into the SQL editor and click **Run**
4. This creates all tables, policies, and initial configuration

## Security Notes

### What's Safe to Expose

- `VITE_SUPABASE_URL` - Public project identifier
- `VITE_SUPABASE_ANON_KEY` - Public API key with RLS protection
- `VITE_ADMIN_EMAILS` - Just email addresses, no secrets

### What NOT to Expose

- **Service role key** - Full database access, bypasses RLS
- **Database password** - Direct database connection
- **JWT secret** - Can forge authentication tokens

### Git Ignore

The `.env.local` file should already be in `.gitignore`. Never commit:
- `.env.local`
- `.env`
- Any file containing real credentials

### Admin Access Security

Admin access is controlled at two levels:

1. **UI Level** - `VITE_ADMIN_EMAILS` controls who sees the Admin menu
2. **Database Level** - RLS policies require authentication for write operations

This means:
- Non-admin users can't see admin features
- Even if someone bypasses UI, they need valid auth to write data
- Database operations are logged and traceable

## Troubleshooting

### "Invalid API key"

- Double-check you copied the full key (they're long!)
- Ensure you're using the **anon** key, not the service_role key
- Check for trailing spaces or newlines

### "Project not found"

- Verify the project URL is correct
- Ensure your project hasn't been paused (free tier pauses after inactivity)
- Go to Supabase dashboard and unpause if needed

### Admin menu not showing

- Verify you're logged in
- Check your email matches `VITE_ADMIN_EMAILS` exactly (whitespace matters)
- Restart the dev server after changing environment variables

### Changes not reflecting

Environment variables are loaded at build time. After changing `.env.local`:
1. Stop the dev server (Ctrl+C)
2. Run `npm run dev` again
