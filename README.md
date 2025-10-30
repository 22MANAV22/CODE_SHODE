# Shodh-a-Code - Online Coding Contest Platform

A modern, full-stack coding contest platform built with Next.js, React, and Supabase. Compete in real-time, solve challenging problems, and climb the leaderboard.

## Features

✨ **Core Features**
- Real-time coding contests with live leaderboards
- Multiple programming languages (JavaScript, Python, C++, Java)
- Instant code execution and result feedback
- Interactive problem browser with difficulty ratings
- Live leaderboard with auto-refresh
- Beautiful, responsive UI with dark mode support

🎯 **Technical Highlights**
- Server-side rendering with Next.js 15
- PostgreSQL database with Supabase
- Type-safe with TypeScript
- Modern UI with Tailwind CSS and shadcn/ui
- Robust error handling and logging
- Production-ready architecture

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free at supabase.com)
- Git

### Setup (5 minutes)

\`\`\`bash
# 1. Clone repository
git clone <your-repo-url>
cd shodh-a-code

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
\`\`\`

**For detailed setup instructions, see [LOCAL_SETUP.md](./LOCAL_SETUP.md)**

## Demo

- **Home Page:** http://localhost:3000
- **Contest ID:** `CONTEST001`
- **Sample Problems:** 3 problems (Easy, Medium, Hard)

## Project Structure

\`\`\`
app/                    # Next.js app directory
├── page.tsx           # Home page
├── api/               # API routes
└── contest/           # Contest pages

components/            # React components
├── code-editor.tsx    # Code editor
├── leaderboard.tsx    # Leaderboard
└── problem-list.tsx   # Problem list

lib/                   # Utilities
├── db.ts             # Database functions
└── supabase/         # Supabase clients

scripts/              # Database scripts
└── 001-init-database.sql
\`\`\`

## Database Schema

### contests
- `id` - Unique contest identifier
- `title` - Contest name
- `description` - Contest details
- `start_time`, `end_time` - Contest duration

### problems
- `id` - Problem identifier
- `contest_id` - Foreign key to contests
- `title`, `description` - Problem details
- `difficulty` - Easy/Medium/Hard
- `sample_input`, `sample_output` - Test cases

### submissions
- `id` - Submission identifier
- `problem_id` - Foreign key to problems
- `username` - Submitter's username
- `code` - Submitted code
- `language` - Programming language
- `status` - Processing/Accepted/Wrong Answer
- `output`, `runtime`, `memory` - Execution results

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/contests` | GET | List all contests |
| `/api/contests/[id]` | GET | Get contest with problems |
| `/api/contests/[id]/leaderboard` | GET | Get live leaderboard |
| `/api/submissions` | POST | Submit code |
| `/api/submissions` | GET | Get submission status |

## Environment Variables

\`\`\`env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional
JUDGE0_API_KEY=your-judge0-key
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
\`\`\`

## Deployment

### Deploy to Vercel

\`\`\`bash
# Push to GitHub
git push origin main

# Connect to Vercel and deploy
vercel
\`\`\`

### Environment Variables for Production

Add these in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `JUDGE0_API_KEY` (optional)

## Development

\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
\`\`\`

## Troubleshooting

**Contest not found?**
- Ensure database is initialized with sample data
- Check Supabase connection in `.env.local`

**Leaderboard not updating?**
- Submit some code first
- Wait 15 seconds for auto-refresh
- Check browser console for errors

**Port 3000 in use?**
\`\`\`bash
PORT=3001 npm run dev
\`\`\`

See [LOCAL_SETUP.md](./LOCAL_SETUP.md) for more troubleshooting.

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Database:** PostgreSQL (Supabase)
- **Authentication:** Supabase Auth (optional)
- **Code Execution:** Judge0 API (optional)
- **Deployment:** Vercel

## Performance

- Database indexes on common queries
- Leaderboard caching (15-second refresh)
- Optimized bundle size with code splitting
- Image optimization with next/image

## Security

- Row Level Security (RLS) on Supabase
- Input validation on all endpoints
- Environment variables for secrets
- HTTPS in production
- Type-safe with TypeScript

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Support

- 📖 [Setup Guide](./LOCAL_SETUP.md)
- 📚 [Supabase Docs](https://supabase.com/docs)
- 🚀 [Next.js Docs](https://nextjs.org/docs)
- 💬 [GitHub Issues](https://github.com/your-repo/issues)

## Roadmap

- [ ] User authentication and profiles
- [ ] Real Judge0 integration
- [ ] More programming languages
- [ ] Problem difficulty ratings
- [ ] User statistics and achievements
- [ ] Admin dashboard
- [ ] Real-time notifications
- [ ] Mobile app

---

Built with ❤️ using Next.js and Supabase
\`\`\`
