# 🚀 Quick Start Guide - Adaptive Wellness AI

## Prerequisites Checklist

- [ ] Node.js 18+ installed ([download](https://nodejs.org/))
- [ ] PostgreSQL installed ([download](https://www.postgresql.org/download/))
- [ ] OpenAI API key ([get here](https://platform.openai.com/api-keys))
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

---

## 🎯 Step-by-Step Setup (15 minutes)

### 1. Install Dependencies

Open terminal in the project directory:

```bash
npm install
```

Expected output: ✅ All packages installed successfully

---

### 2. Set Up PostgreSQL Database

#### Option A: Local PostgreSQL

```bash
# Create database
createdb adaptive_wellness_ai

# Or using psql
psql -U postgres
CREATE DATABASE adaptive_wellness_ai;
\q
```

#### Option B: Free Cloud Database (Supabase)

1. Visit [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the "Connection Pooling" connection string
4. Use it in your `.env` file

---

### 3. Configure Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# DATABASE - Update with your database credentials
DATABASE_URL="postgresql://postgres:password@localhost:5432/adaptive_wellness_ai"

# NEXTAUTH - Generate a secret key
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[RUN: openssl rand -base64 32]"

# GOOGLE OAUTH - Optional for Google Sign-In
GOOGLE_CLIENT_ID="your-client-id-here"
GOOGLE_CLIENT_SECRET="your-client-secret-here"

# OPENAI - Required for AI agents
OPENAI_API_KEY="sk-your-openai-api-key"

# ENVIRONMENT
NODE_ENV="development"
```

#### Generate NEXTAUTH_SECRET:

```bash
# Mac/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

### 4. Set Up Database Schema

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (for development)
npm run db:push
```

Expected output:
```
✅ Generated Prisma Client
✅ Database schema applied
```

---

### 5. Run Development Server

```bash
npm run dev
```

Expected output:
```
✅ Ready on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎨 First Time User Flow

1. **Landing Page** → Click "Get Started"
2. **Sign Up** → Create account with email/password
3. **Onboarding** → Complete 6-step wellness profile
4. **Dashboard** → Create your first goal
5. **Track Progress** → Log daily activities
6. **View Insights** → See AI adaptations and reflections

---

## 🔧 Troubleshooting

### Issue: Database connection failed

**Solution:**
```bash
# Check PostgreSQL is running
pg_isready

# If not running, start it
# Mac (Homebrew)
brew services start postgresql

# Linux
sudo service postgresql start

# Windows
# Start from Services or pgAdmin
```

### Issue: Prisma Client not found

**Solution:**
```bash
npm run db:generate
```

### Issue: OpenAI API errors

**Solution:**
- Verify API key is correct in `.env`
- Check API key has credits: [platform.openai.com/usage](https://platform.openai.com/usage)
- Ensure you're using `gpt-4-turbo-preview` model

### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill process on port 3000
# Mac/Linux
lsof -ti:3000 | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Or use a different port
PORT=3001 npm run dev
```

---

## 🔑 Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

---

## 🗄️ Database Management

### View Database in Browser

```bash
npm run db:studio
```

Opens Prisma Studio at [http://localhost:5555](http://localhost:5555)

### Reset Database

```bash
# Drop all data and reapply schema
npm run db:push -- --force-reset
```

⚠️ **Warning**: This deletes all data!

### Create Migration (Production)

```bash
npm run db:migrate
```

---

## 🧪 Test the System

### Create Test User

1. Visit [http://localhost:3000/auth/signup](http://localhost:3000/auth/signup)
2. Create account with:
   - Name: Test User
   - Email: test@example.com
   - Password: testpassword123

### Complete Onboarding

3. Fill out wellness profile:
   - Primary Intent: "Build consistent exercise habit"
   - Available Time: 30 minutes
   - Energy Level: Medium
   - Complete all steps

### Create First Goal

4. From dashboard, click "New Goal"
5. Enter: "Walk 10,000 steps daily"
6. AI will formulate a structured goal

### Log Activity

7. Navigate to "Track Activity"
8. Log today's activity
9. See AI monitoring in action

---

## 📊 Development Tools

### Recommended VS Code Extensions

- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- GitLens

### Useful Commands

```bash
# Lint code
npm run lint

# Build for production
npm run build

# Start production server
npm start

# Type check
npx tsc --noEmit

# Format code
npx prettier --write .
```

---

## 🚀 Deploy to Vercel

### One-Click Deploy

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard
5. Deploy automatically

### Environment Variables for Production

In Vercel dashboard, add:

- `DATABASE_URL` - Use cloud PostgreSQL (Supabase/Railway/Neon)
- `NEXTAUTH_URL` - Your production URL (e.g., `https://yourapp.vercel.app`)
- `NEXTAUTH_SECRET` - Generate new secret for production
- `OPENAI_API_KEY` - Your OpenAI API key
- `GOOGLE_CLIENT_ID` - Update redirect URI for production
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret

---

## 💡 Pro Tips

### 1. Use Database Seed Data

Create `prisma/seed.ts` for sample data during development.

### 2. Enable Hot Reload

Already configured! Just save files and see changes instantly.

### 3. Monitor AI Agent Logs

Check `AgentLog` table in Prisma Studio to see AI reasoning.

### 4. Test with Different Profiles

Create multiple test users with different:
- Energy levels (low/medium/high)
- Available time (15-120 min)
- Motivation styles (achievement/social/health/appearance)

### 5. Simulate Failures

Intentionally miss activities to test:
- Adaptation agent triggers
- Recovery plans
- Reflection insights

---

## 📚 Next Steps

1. ✅ Explore the dashboard
2. ✅ Create and track a goal
3. ✅ Review AI agent activity logs
4. ✅ Test adaptation by missing activities
5. ✅ View weekly reflections
6. ✅ Check analytics dashboard

---

## 🆘 Need Help?

- **Documentation**: See [README.md](README.md)
- **API Docs**: See inline comments in `/api` routes
- **Database Schema**: See [prisma/schema.prisma](prisma/schema.prisma)
- **Agent System**: See [src/lib/agents/index.ts](src/lib/agents/index.ts)

---

## ✅ Setup Complete!

Your Adaptive Wellness AI system is ready to use. Start by creating your first wellness goal and let the AI agents guide your journey to sustainable health habits.

**Remember**: This is a non-clinical system designed for fitness and lifestyle wellness only. Not for medical diagnosis or treatment.

---

**Happy wellness journey! 🌟**
