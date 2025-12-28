# 🚀 Quick Reference - Adaptive Wellness AI

## Essential Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build           # Build for production
npm start               # Start production server
npm run lint            # Run ESLint

# Database
npm run db:generate     # Generate Prisma Client
npm run db:push         # Push schema to database (dev)
npm run db:migrate      # Create migration (production)
npm run db:studio       # Open Prisma Studio (GUI)

# Formatting
npx prettier --write .  # Format all files
```

---

## Environment Variables

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[openssl rand -base64 32]"
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
OPENAI_API_KEY="sk-your-key"
NODE_ENV="development"
```

---

## API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/[...nextauth]
```

### Wellness Profile
```
GET  /api/wellness-profile
POST /api/wellness-profile
```

### Goals
```
GET  /api/goals
POST /api/goals
```

### Plans
```
GET  /api/plans?goalId={id}
POST /api/plans
```

### Monitoring
```
GET  /api/monitoring?days={n}
POST /api/monitoring
```

### Adaptations
```
POST  /api/adaptations
PATCH /api/adaptations
```

---

## Agent System

### Execute Agent

```typescript
import { agentOrchestrator } from '@/lib/agents';

const result = await agentOrchestrator.executeAgent('agent-name', {
  userId: 'user-id',
  timestamp: new Date(),
  data: { /* context */ }
});
```

### Available Agents

1. `goal-formulation` - Transform intent into goals
2. `planning` - Create adaptive plans
3. `monitoring` - Analyze behavioral trajectories
4. `adaptation` - Autonomous replanning
5. `reflection` - Meta-cognitive analysis
6. `explainability` - Transparent reasoning

---

## Database Models

```
User
├── WellnessProfile (1:1)
├── Goals (1:N)
│   └── Plans (1:N)
│       └── MonitoringData (1:N)
├── Adaptations (1:N)
├── Reflections (1:N)
└── Analytics (1:N)
```

---

## Common Tasks

### Create New User
1. Visit `/auth/signup`
2. Fill registration form
3. Complete onboarding at `/onboarding`

### Add New Agent
```typescript
// 1. Create agent class in src/lib/agents/index.ts
export class NewAgent extends BaseAgent {
  constructor() {
    super('new-agent', 'System prompt...');
  }
  
  async execute(context: AgentContext): Promise<AgentOutput> {
    // Implementation
  }
}

// 2. Register in orchestrator
this.agents.set('new-agent', new NewAgent());

// 3. Create API route if needed
```

### Reset Database
```bash
npm run db:push -- --force-reset
```
⚠️ Warning: Deletes all data!

### View Database
```bash
npm run db:studio
```
Opens at http://localhost:5555

---

## Troubleshooting

### Port Already in Use
```bash
# Mac/Linux
lsof -ti:3000 | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
pg_isready

# Start PostgreSQL
# Mac: brew services start postgresql
# Linux: sudo service postgresql start
```

### Prisma Client Not Found
```bash
npm run db:generate
```

### OpenAI API Errors
- Check API key in `.env`
- Verify credits at platform.openai.com/usage
- Ensure model is `gpt-4-turbo-preview`

---

## File Locations

### Core Logic
- Agents: `src/lib/agents/index.ts`
- Auth: `src/lib/auth.ts`
- Database: `src/lib/prisma.ts`
- Utils: `src/lib/utils.ts`

### API Routes
- `src/app/api/**/route.ts`

### Pages
- Landing: `src/app/page.tsx`
- Auth: `src/app/auth/**/page.tsx`
- Dashboard: `src/app/dashboard/page.tsx`
- Onboarding: `src/app/onboarding/page.tsx`

### Configuration
- Database: `prisma/schema.prisma`
- TypeScript: `tsconfig.json`
- Next.js: `next.config.js`
- Tailwind: `tailwind.config.ts`

---

## Useful Links

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **NextAuth Docs**: https://next-auth.js.org
- **OpenAI API**: https://platform.openai.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes
# ...

# Commit
git add .
git commit -m "feat: your feature"

# Push
git push origin feature/your-feature

# Create PR on GitHub
```

---

## Production Deployment

### Vercel
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Environment for Production
- Use cloud PostgreSQL (Supabase/Neon)
- Generate new NEXTAUTH_SECRET
- Update NEXTAUTH_URL to production domain
- Update Google OAuth redirect URIs

---

## Testing Checklist

- [ ] Sign up with email
- [ ] Sign in with Google OAuth
- [ ] Complete onboarding
- [ ] Create a goal
- [ ] Log activity
- [ ] Check AI agent logs
- [ ] Test adaptation trigger

---

## Performance Tips

1. Use Promise.all() for parallel API calls
2. Add database indexes on frequently queried fields
3. Implement Redis caching for LLM responses
4. Use Next.js Image component for images
5. Enable compression in production

---

## Security Checklist

- [ ] NEXTAUTH_SECRET is unique and secure
- [ ] Database credentials not committed
- [ ] API routes check authentication
- [ ] Input validation with Zod
- [ ] HTTPS in production
- [ ] Environment variables in Vercel/deployment platform

---

## Support

- **Documentation**: README.md, SETUP.md, ARCHITECTURE.md
- **Issues**: GitHub Issues
- **Questions**: GitHub Discussions

---

**Quick Start: Run `npm install && npm run db:push && npm run dev`**
