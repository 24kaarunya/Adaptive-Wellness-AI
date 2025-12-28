# 📁 Project File Tree

```
adaptive-wellness-ai/
│
├── 📄 Configuration Files
│   ├── .env.example              # Environment variables template
│   ├── .eslintrc.json            # ESLint configuration
│   ├── .gitignore                # Git ignore rules
│   ├── .prettierrc               # Prettier formatting rules
│   ├── next.config.js            # Next.js configuration
│   ├── package.json              # Dependencies and scripts
│   ├── postcss.config.js         # PostCSS configuration
│   ├── tailwind.config.ts        # Tailwind CSS configuration
│   └── tsconfig.json             # TypeScript configuration
│
├── 📚 Documentation
│   ├── README.md                 # Main project documentation (300+ lines)
│   ├── SETUP.md                  # Setup guide with troubleshooting
│   ├── ARCHITECTURE.md           # Technical architecture deep-dive
│   ├── CONTRIBUTING.md           # Contribution guidelines
│   ├── PROJECT_SUMMARY.md        # Complete project overview
│   ├── QUICK_REFERENCE.md        # Commands and API quick reference
│   ├── LICENSE                   # MIT License + disclaimer
│   └── FILE_TREE.md             # This file
│
├── 🗄️ prisma/
│   └── schema.prisma             # Database schema (9 models, 400+ lines)
│       ├── User
│       ├── Account
│       ├── Session
│       ├── WellnessProfile
│       ├── Goal
│       ├── Plan
│       ├── MonitoringData
│       ├── Adaptation
│       ├── Reflection
│       ├── Analytics
│       └── AgentLog
│
└── 📂 src/
    │
    ├── 🎨 app/                   # Next.js App Router
    │   │
    │   ├── 🏠 Root Pages
    │   │   ├── page.tsx          # Landing page with features
    │   │   ├── layout.tsx        # Root layout with providers
    │   │   └── globals.css       # Global styles + Tailwind
    │   │
    │   ├── 🔐 auth/              # Authentication Pages
    │   │   ├── signin/
    │   │   │   └── page.tsx      # Sign in with email + Google OAuth
    │   │   └── signup/
    │   │       └── page.tsx      # Registration form
    │   │
    │   ├── 📋 onboarding/        # Onboarding Flow
    │   │   └── page.tsx          # 6-step wellness profile builder
    │   │
    │   ├── 📊 dashboard/         # Main Dashboard
    │   │   └── page.tsx          # Dashboard with goals, stats, AI activity
    │   │
    │   └── 🔌 api/               # API Routes
    │       │
    │       ├── auth/
    │       │   ├── [...nextauth]/
    │       │   │   └── route.ts  # NextAuth handlers (GET, POST)
    │       │   └── register/
    │       │       └── route.ts  # User registration endpoint
    │       │
    │       ├── wellness-profile/
    │       │   └── route.ts      # Create/get wellness profile (Module 1)
    │       │
    │       ├── goals/
    │       │   └── route.ts      # Goal CRUD with AI generation (Module 2)
    │       │
    │       ├── plans/
    │       │   └── route.ts      # Plan creation with AI (Module 3)
    │       │
    │       ├── monitoring/
    │       │   └── route.ts      # Activity tracking + analysis (Module 4)
    │       │
    │       └── adaptations/
    │           └── route.ts      # AI-driven adaptations (Module 5)
    │
    ├── 🧩 components/
    │   └── Providers.tsx         # SessionProvider wrapper
    │
    ├── 📚 lib/                   # Core Logic
    │   │
    │   ├── 🤖 agents/
    │   │   └── index.ts          # Complete multi-agent system (800+ lines)
    │   │       ├── BaseAgent              (abstract class)
    │   │       ├── GoalFormulationAgent   (Module 2)
    │   │       ├── PlanningAgent          (Module 3)
    │   │       ├── MonitoringAgent        (Module 4)
    │   │       ├── AdaptationAgent        (Module 5)
    │   │       ├── ReflectionAgent        (Module 6)
    │   │       ├── ExplainabilityAgent    (Module 7)
    │   │       └── AgentOrchestrator      (coordinator)
    │   │
    │   ├── auth.ts               # NextAuth configuration
    │   ├── prisma.ts             # Prisma client singleton
    │   └── utils.ts              # Utility functions
    │
    ├── 📝 types/
    │   └── next-auth.d.ts        # NextAuth type extensions
    │
    └── middleware.ts             # Route protection middleware
```

---

## 📊 Statistics

### Code Metrics
- **Total Files**: 45+
- **Total Lines**: 6,000+
- **TypeScript Files**: 20+
- **Documentation**: 2,500+ lines
- **Database Models**: 9

### Components Breakdown
- **Core Agent System**: 800+ lines
- **API Routes**: 6 endpoints
- **UI Pages**: 5 pages
- **Database Schema**: 400+ lines
- **Documentation**: 5 comprehensive files

---

## 🎯 Key File Locations

### Most Important Files

| File | Purpose | Lines |
|------|---------|-------|
| `src/lib/agents/index.ts` | Multi-agent AI system | 800+ |
| `prisma/schema.prisma` | Database schema | 400+ |
| `README.md` | Main documentation | 300+ |
| `SETUP.md` | Setup guide | 400+ |
| `ARCHITECTURE.md` | Technical docs | 500+ |

### Entry Points

1. **Application**: `src/app/page.tsx` (landing page)
2. **API**: `src/app/api/**/route.ts` (API endpoints)
3. **Agent System**: `src/lib/agents/index.ts` (AI logic)
4. **Database**: `prisma/schema.prisma` (data model)
5. **Auth**: `src/lib/auth.ts` (authentication)

### Configuration

1. **Environment**: `.env.example` → `.env`
2. **TypeScript**: `tsconfig.json`
3. **Database**: `prisma/schema.prisma`
4. **Styling**: `tailwind.config.ts`
5. **Next.js**: `next.config.js`

---

## 🚀 Quick Navigation

### Want to understand the AI?
→ `src/lib/agents/index.ts`

### Want to see the database design?
→ `prisma/schema.prisma`

### Want to add a new API endpoint?
→ `src/app/api/` (create new folder)

### Want to modify the UI?
→ `src/app/**/page.tsx`

### Want to set up the project?
→ `SETUP.md`

### Want to understand the architecture?
→ `ARCHITECTURE.md`

---

## 📦 Dependencies Overview

### Core Dependencies
- `next`: Full-stack React framework
- `react`: UI library
- `typescript`: Type safety
- `prisma`: Database ORM
- `next-auth`: Authentication
- `openai`: AI agent reasoning
- `tailwindcss`: Styling
- `zod`: Validation

### Total Package Size
- `node_modules`: ~500MB
- Build output: ~10MB
- Production bundle: ~2MB (optimized)

---

## 🔄 Data Flow

```
User Request
    ↓
Next.js Page (src/app/**/page.tsx)
    ↓
API Route (src/app/api/**/route.ts)
    ↓
Agent System (src/lib/agents/index.ts)
    ↓
OpenAI API (GPT-4 reasoning)
    ↓
Database (via Prisma)
    ↓
Response to User
```

---

## 🎨 Frontend Structure

```
app/
├── page.tsx          → Landing page
├── layout.tsx        → Root layout
├── auth/
│   ├── signin        → Authentication
│   └── signup        → Registration
├── onboarding/       → Profile builder
└── dashboard/        → Main app
```

---

## 🔌 Backend Structure

```
app/api/
├── auth/
│   ├── [...nextauth] → NextAuth
│   └── register      → Sign up
├── wellness-profile  → User context
├── goals             → Goal management
├── plans             → Planning
├── monitoring        → Activity tracking
└── adaptations       → AI adaptations
```

---

## 🤖 Agent System Structure

```
lib/agents/index.ts
├── BaseAgent (abstract)
├── Agents:
│   ├── GoalFormulationAgent
│   ├── PlanningAgent
│   ├── MonitoringAgent
│   ├── AdaptationAgent
│   ├── ReflectionAgent
│   └── ExplainabilityAgent
└── AgentOrchestrator
```

---

## 📋 File Categories

### TypeScript/JavaScript
- `.ts` files: 20+
- `.tsx` files: 10+
- `.js` files: 2

### Configuration
- JSON: 5 files
- Environment: 1 file
- Config files: 7 files

### Documentation
- Markdown: 6 files (2,500+ lines)
- README: 300+ lines
- Setup guide: 400+ lines

### Styling
- CSS: 1 file (globals.css)
- Tailwind config: 1 file

---

## 🔍 Search Tips

### Find specific agent logic
```bash
grep -r "class.*Agent" src/lib/agents/
```

### Find API routes
```bash
find src/app/api -name "route.ts"
```

### Find all pages
```bash
find src/app -name "page.tsx"
```

### Find database models
```bash
grep "model" prisma/schema.prisma
```

---

## 🎓 Learning Path

1. **Start**: Read `README.md` for overview
2. **Setup**: Follow `SETUP.md` step-by-step
3. **Understand**: Read `ARCHITECTURE.md` for deep dive
4. **Code**: Explore `src/lib/agents/index.ts` for AI logic
5. **Database**: Study `prisma/schema.prisma` for data model
6. **API**: Check `src/app/api/**/route.ts` for endpoints
7. **UI**: Look at `src/app/**/page.tsx` for pages

---

**Total Project Size: ~6,000+ lines of production-ready code + 2,500+ lines of documentation**

**Status: ✅ Complete and deployable**
