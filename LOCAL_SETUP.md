# Local Development Setup Guide

## Prerequisites
- Node.js 18+ installed
- Git installed
- Supabase account (free at supabase.com)
- (Optional) Docker & Docker Compose for containerized development

## Step 1: Clone & Install Dependencies

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd shodh-a-code

# Install dependencies
npm install
\`\`\`

## Step 2: Setup Supabase Database

### Option A: Using Supabase Cloud (Recommended)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for project to initialize (2-3 minutes)
4. Go to **Settings → API** and copy:
   - **Project URL** → Copy this value
   - **anon public** key → Copy this value

### Option B: Local Supabase with Docker

\`\`\`bash
# Start Supabase locally
docker run --rm \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -p 54321:54321 \
  supabase/postgres:latest
\`\`\`

## Step 3: Setup Environment Variables

\`\`\`bash
# Copy example env file
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your Supabase credentials:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000

# Optional: Judge0 API for code execution
JUDGE0_API_KEY=your_judge0_key
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
\`\`\`

**Where to find these values:**
- Go to your Supabase project dashboard
- Click **Settings** → **API**
- Copy the **Project URL** and **anon public** key

## Step 4: Initialize Database Schema

### Using Supabase Dashboard (Easiest)

1. Go to your Supabase project
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `scripts/001-init-database.sql`
5. Paste into the SQL editor
6. Click **Run** button
7. Wait for success message

### Using psql (Command Line)

\`\`\`bash
# If using local Supabase
psql -h localhost -U postgres -d postgres -f scripts/001-init-database.sql

# If using Supabase Cloud
psql -h your-project.supabase.co -U postgres -d postgres -f scripts/001-init-database.sql
# Enter your Supabase password when prompted
\`\`\`

## Step 5: Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open http://localhost:3000 in your browser.

**Explanation:** This starts the Next.js development server with hot-reload enabled. Any changes you make to files will automatically refresh in the browser.

## Step 6: Test the Application

### Test Contest Join
1. **Home Page**: You should see the Shodh-a-Code landing page
2. **Join Contest**: 
   - Contest ID: `CONTEST001`
   - Username: Any username (e.g., `testuser`)
   - Click "Join Contest"

### Test Problem Solving
1. **Problems Tab**: View the 3 sample problems
   - Problem 1: Sum of Two Numbers (Easy)
   - Problem 2: Fibonacci Sequence (Medium)
   - Problem 3: Prime Number Checker (Hard)

2. **Code Editor Tab**:
   - Select a problem
   - Write code in the editor
   - Choose programming language
   - Click "Submit Code"

3. **Leaderboard Tab**:
   - See live rankings
   - Auto-refreshes every 15 seconds
   - Shows problems solved and scores

## Database Schema Overview

### contests
- `id` - Unique contest identifier
- `title` - Contest name
- `description` - Contest details
- `start_time`, `end_time` - Contest duration

### problems
- `id` - Problem identifier
- `contest_id` - Links to contests table
- `title`, `description` - Problem details
- `difficulty` - Easy/Medium/Hard
- `sample_input`, `sample_output` - Test cases

### submissions
- `id` - Submission identifier
- `problem_id` - Links to problems table
- `username` - Submitter's username
- `code` - Submitted code
- `language` - Programming language used
- `status` - Processing/Accepted/Wrong Answer
- `output`, `runtime`, `memory` - Execution results

## Troubleshooting

### "Contest not found" Error

**Problem**: When joining contest, you get "Contest not found"

**Solutions**:
1. Verify database was initialized: Check Supabase SQL Editor for tables
2. Check environment variables: Ensure `.env.local` has correct Supabase URL and key
3. Restart dev server: `npm run dev`

### Supabase Connection Error

**Problem**: `Error: Failed to fetch contests`

**Solutions**:
\`\`\`bash
# 1. Verify environment variables
cat .env.local

# 2. Check Supabase project is active
# Go to supabase.com and verify project status

# 3. Restart development server
npm run dev
\`\`\`

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**: Use a different port:
\`\`\`bash
PORT=3001 npm run dev
\`\`\`

### Module Not Found

**Problem**: `Error: Cannot find module '@supabase/ssr'`

**Solution**: Reinstall dependencies:
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Leaderboard Not Updating

**Problem**: Leaderboard shows no entries or doesn't refresh

**Solutions**:
1. Submit some code first (leaderboard needs submissions)
2. Wait 15 seconds for auto-refresh
3. Check browser console for errors (F12 → Console tab)
4. Verify submissions table has data in Supabase

## Development Commands

\`\`\`bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
\`\`\`

## Project Structure

\`\`\`
app/
  ├── api/
  │   ├── contests/              # Contest API routes
  │   └── submissions/           # Submission API routes
  ├── contest/[contestId]/       # Contest page
  ├── page.tsx                   # Home page
  └── layout.tsx                 # Root layout

components/
  ├── code-editor.tsx            # Code editor component
  ├── leaderboard.tsx            # Leaderboard component
  └── problem-list.tsx           # Problem list component

lib/
  ├── db.ts                      # Database functions
  └── supabase/
      ├── client.ts              # Browser client
      └── server.ts              # Server client

scripts/
  └── 001-init-database.sql      # Database schema & sample data
\`\`\`

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/contests` | GET | List all contests |
| `/api/contests/[id]` | GET | Get contest with problems |
| `/api/contests/[id]/leaderboard` | GET | Get live leaderboard |
| `/api/submissions` | POST | Submit code |
| `/api/submissions` | GET | Get submission status |

## Next Steps

1. **Add Judge0 Integration**: Replace mock execution with real Judge0 API
2. **Add Authentication**: Implement user login/signup with Supabase Auth
3. **Add More Languages**: Support Python, C++, Java, Go, Rust
4. **Deploy to Vercel**: Push to GitHub and deploy to Vercel
5. **Add Real-time Updates**: Use WebSockets for live leaderboard
6. **Add User Profiles**: Track user statistics and achievements

## Production Deployment

### Deploy to Vercel

\`\`\`bash
# 1. Push to GitHub
git push origin main

# 2. Connect to Vercel
vercel

# 3. Add environment variables in Vercel dashboard
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# JUDGE0_API_KEY (optional)

# 4. Deploy
vercel --prod
\`\`\`

## Support

- Check [README.md](./README.md) for project overview
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment details
- Open a GitHub issue for bugs or feature requests
