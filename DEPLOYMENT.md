# Shodh-a-Code: Local Deployment Guide

This guide walks you through deploying the Shodh-a-Code platform locally with step-by-step explanations.

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (optional but recommended)
- Git
- A Supabase account (free tier available at supabase.com)

## Step 1: Clone and Setup Project

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd shodh-a-code

# Install dependencies
npm install
\`\`\`

**Explanation:** This installs all required npm packages including Next.js, React, and Supabase client libraries.

## Step 2: Setup Supabase Database

### Option A: Using Supabase Cloud (Recommended)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Option B: Local Supabase with Docker

\`\`\`bash
# Start Supabase locally
docker run --rm \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -p 54321:54321 \
  supabase/postgres:latest
\`\`\`

## Step 3: Configure Environment Variables

Create `.env.local` file in the project root:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Development redirect URL (for email confirmations)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000

# Judge0 API (optional - for code execution)
JUDGE0_API_KEY=your-judge0-key
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
\`\`\`

**Explanation:** These environment variables connect your app to Supabase and configure external services.

## Step 4: Initialize Database Schema

### Using Supabase Dashboard:

1. Go to your Supabase project → **SQL Editor**
2. Click **New Query**
3. Copy the contents of `scripts/001-init-database.sql`
4. Paste and execute

### Or using psql (if running local Supabase):

\`\`\`bash
psql -h localhost -U postgres -d postgres -f scripts/001-init-database.sql
\`\`\`

**Explanation:** This creates all necessary tables (contests, problems, submissions, users) and inserts sample data.

## Step 5: Run Development Server

\`\`\`bash
npm run dev
\`\`\`

The application will start at `http://localhost:3000`

**Explanation:** This starts the Next.js development server with hot-reload enabled.

## Step 6: Test the Application

1. **Home Page:** Visit `http://localhost:3000`
2. **Join Contest:** 
   - Contest ID: `CONTEST001`
   - Username: Any username (e.g., `testuser`)
3. **Explore Features:**
   - **Problems Tab:** View 3 sample problems
   - **Code Editor:** Write and submit code
   - **Leaderboard:** See live rankings (refreshes every 15 seconds)

## Architecture Overview

### Database Layer (`lib/db.ts`)
- All database operations use Supabase client
- Handles contests, problems, submissions, and leaderboard queries
- Includes error handling and logging

### API Routes (`app/api/`)
- `/api/contests` - List all contests
- `/api/contests/[contestId]` - Get contest details with problems
- `/api/contests/[contestId]/leaderboard` - Get live leaderboard
- `/api/submissions` - Submit code and fetch submission status

### Frontend Components (`components/`)
- **CodeEditor:** Full-featured code editor with language selection
- **Leaderboard:** Live rankings with auto-refresh
- **ProblemList:** Interactive problem browser

### Pages
- `/` - Home page with contest join form
- `/contest/[contestId]` - Main contest interface with tabs

## Database Schema

### contests
- `id` (VARCHAR): Unique contest identifier
- `title` (VARCHAR): Contest name
- `description` (TEXT): Contest details
- `start_time`, `end_time` (TIMESTAMP): Contest duration

### problems
- `id` (VARCHAR): Unique problem identifier
- `contest_id` (VARCHAR): Foreign key to contests
- `title`, `description` (VARCHAR/TEXT): Problem details
- `difficulty` (VARCHAR): Easy/Medium/Hard
- `sample_input`, `sample_output` (TEXT): Test cases

### submissions
- `id` (VARCHAR): Unique submission identifier
- `problem_id` (VARCHAR): Foreign key to problems
- `username` (VARCHAR): Submitter's username
- `code` (TEXT): Submitted code
- `language` (VARCHAR): Programming language
- `status` (VARCHAR): Processing/Accepted/Wrong Answer
- `output`, `runtime`, `memory` (TEXT/VARCHAR): Execution results

## Troubleshooting

### "Contest not found" error
- Ensure database is initialized with sample data
- Check that `NEXT_PUBLIC_SUPABASE_URL` is correct

### Submissions not updating
- Check browser console for errors
- Verify Supabase connection in Network tab
- Ensure Judge0 API key is configured (optional)

### Leaderboard not showing
- Refresh the page
- Check that submissions exist in database
- Verify Supabase query permissions

## Production Deployment

### Deploy to Vercel

\`\`\`bash
# Push to GitHub
git push origin main

# Connect to Vercel
vercel

# Add environment variables in Vercel dashboard
# Deploy automatically on push
\`\`\`

### Environment Variables for Production

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
JUDGE0_API_KEY=your-judge0-key
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
\`\`\`

## Performance Optimization

1. **Database Indexes:** Already created for common queries
2. **Leaderboard Caching:** Refreshes every 15 seconds
3. **Code Splitting:** Next.js automatically optimizes bundle size
4. **Image Optimization:** Use next/image for images

## Security Best Practices

1. **Row Level Security (RLS):** Enable on Supabase tables
2. **API Rate Limiting:** Implement in production
3. **Input Validation:** Sanitize all user inputs
4. **HTTPS Only:** Use in production
5. **Environment Variables:** Never commit secrets

## Next Steps

1. Add user authentication with Supabase Auth
2. Integrate real Judge0 API for code execution
3. Add more programming languages
4. Implement problem difficulty ratings
5. Add user profiles and statistics
6. Create admin dashboard for contest management

## Support

For issues or questions:
- Check the troubleshooting section above
- Review Supabase documentation: https://supabase.com/docs
- Check Next.js documentation: https://nextjs.org/docs
\`\`\`

```dockerfile file="" isHidden
