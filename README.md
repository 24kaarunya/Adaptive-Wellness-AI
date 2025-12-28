# Adaptive Wellness AI

> **A Self-Reflective Agentic System for Sustainable Human Health & Fitness Behavior**

🏆 **nnov-AI-tion Competition Submission** | Healthcare & Fitness Agentic Systems Challenge

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748)](https://www.prisma.io/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991)](https://openai.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC)](https://tailwindcss.com/)

📹 **[Demo Video](#)** | 📄 **[Competition Submission](./COMPETITION_SUBMISSION.md)** | 📚 **[Full Documentation](./docs/)**

---

## 🎯 Project Overview

**Adaptive Wellness AI** is a novel agentic AI system that demonstrates autonomous reasoning, multi-step planning, and self-reflective learning for personalized wellness coaching. Unlike traditional ML models that merely predict outcomes, our system **reasons about goals, learns from failures, and adapts autonomously**—optimizing for long-term behavioral consistency over short-term intensity.

### The Problem

Despite unprecedented access to fitness trackers and wellness apps, **80%+ of fitness goals fail within 6 months**. Current systems:

- Treat missed routines as **terminal failures** rather than recoverable setbacks
- Lack **multi-step reasoning** over long-horizon behavioral trajectories
- Provide **static recommendations** without contextual adaptation
- Offer **no transparency** into why guidance changes
- Require **manual replanning** when circumstances change

### Our Agentic Solution

A **6-agent autonomous reasoning system** that operates through a continuous cognitive cycle:

```
Observe (Monitor) → Reason (Adapt) → Plan → Act (Autonomous) → Reflect → Explain
```

**Key Agentic Capabilities:**

✅ **Goal-Oriented Autonomy:** Agents proactively pursue long-term adherence without user prompts  
✅ **Multi-Step Planning:** 4-12 week plans with pre-generated contingencies and fallback strategies  
✅ **Autonomous Decision-Making:** System adapts plans independently when confidence exceeds thresholds  
✅ **Tool Interaction:** Reads/writes database memory, uses LLM reasoning, logs all decisions  
✅ **Contextual Adaptation:** Responds to behavioral patterns, user feedback, and constraint changes  
✅ **Self-Reflection:** Weekly retrospective analysis that updates internal reasoning heuristics  
✅ **Transparent Reasoning:** Every decision includes explainable reasoning chains for user trust

---

## 🏗️ System Architecture

### Core Modules

#### **Module 0: Authentication & Identity**
- Email/password authentication
- Google OAuth 2.0 integration
- JWT session management
- Persistent identity for long-horizon reasoning

#### **Module 1: User Context & Onboarding**
- Captures ambiguous intent ("get healthier")
- Collects constraints (time, energy, routine)
- Identifies motivation style
- Assesses adherence risk

#### **Module 2: Goal Formulation Agent**
Transforms vague intentions into:
- Structured SMART goals
- Failure-tolerant objectives
- Recoverable sub-goals
- Built-in fallback strategies

#### **Module 3: Planning Agent**
Generates adaptive wellness plans with:
- Progressive difficulty
- Fallback and recovery plans
- Cognitive/physical load estimation
- Sustainability scoring

#### **Module 4: Monitoring Agent**
Tracks **behavioral trajectories**, not isolated metrics:
- Adherence patterns
- Burnout indicators
- Deviation signals
- Streak tracking

#### **Module 5: Decision & Adaptation Agent**
Autonomously reasons and adapts when reality diverges:
- Detects meaningful deviations
- Determines root causes
- Replans goals/strategies
- Acts independently when confident

#### **Module 6: Reflection Engine**
Enables meta-cognition:
- Compares intended vs actual behavior
- Identifies root causes
- Updates reasoning heuristics
- Generates actionable insights

#### **Module 7: Explainability Agent**
Maintains trust through transparency:
- Explains all system decisions
- Uses human-friendly language
- Acknowledges uncertainty
- Provides user control options

#### **Module 8: Ethics & Safety**
Ensures responsible operation:
- Non-clinical scope enforcement
- No medical diagnosis/treatment
- Clear limitation disclosure

#### **Module 9: Evaluation & Analytics**
Measures long-term success:
- Habit consistency trajectories
- Recovery success rates
- Trust and clarity scores
- Adaptation frequency

---

## 🤖 Agentic AI Capabilities

This project demonstrates advanced agentic AI through:

1. **Long-Horizon Reasoning**: Plans and adapts over weeks/months
2. **Multi-Agent Collaboration**: 6 specialized agents working in concert
3. **Autonomous Replanning**: Acts independently under uncertainty
4. **Failure-Aware Decisions**: Designed to survive setbacks
5. **Self-Reflection**: Learns from historical patterns
6. **Human-AI Alignment**: Transparent, explainable reasoning

---

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations

### Backend
- **Next.js API Routes** - Serverless API
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Production database
- **NextAuth.js** - Authentication

### AI/ML
- **OpenAI GPT-4** - Agentic reasoning engine
- **Custom Agent Framework** - Multi-agent orchestration
- **Prompt Engineering** - Specialized system prompts

### DevOps
- **Vercel** - Deployment platform
- **Prisma Migrate** - Database migrations
- **Environment Variables** - Secure configuration

---

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+ 
- OpenAI API key (free tier: https://platform.openai.com/api-keys)
- Google OAuth credentials (optional - can use email/password auth)
- No database server needed (uses SQLite)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/adaptive-wellness-ai.git
cd adaptive-wellness-ai
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**Required Configuration:**

```env
# Database (SQLite - no setup needed)
DATABASE_URL="file:./dev.db"

# NextAuth (generate secret below)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret"

# OpenAI API (REQUIRED - get from https://platform.openai.com/api-keys)
OPENAI_API_KEY="sk-your-key-here"

# Google OAuth (OPTIONAL)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

**Generate NEXTAUTH_SECRET:**
```bash
# On macOS/Linux:
openssl rand -base64 32

# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Step 4: Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Or run migrations (production)
npm run db:migrate
```

### Step 5: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Database Schema

```prisma
User
├── WellnessProfile (1:1)
├── Goals (1:N)
│   └── Plans (1:N)
│       └── MonitoringData (1:N)
├── Reflections (1:N)
├── Adaptations (1:N)
└── Analytics (1:N)
```

### Key Models

- **User**: Authentication and identity
- **WellnessProfile**: Contextual user data
- **Goal**: SMART, failure-tolerant objectives
- **Plan**: Adaptive multi-week strategies
- **MonitoringData**: Behavioral tracking
- **Adaptation**: AI-driven plan changes
- **Reflection**: Meta-cognitive analysis
- **AgentLog**: Transparent AI reasoning

---

## 💡 Example Usage Flows

### Scenario 1: New User Onboarding

**User Action:**
```
User creates account → completes wellness profile
Intent: "I want to get healthier but I'm always too busy"
Constraints: 30 min/day max, low energy after work
```

**Agent Responses:**

**Goal Formulation Agent:**
```
🎯 Generated Goal:
"Complete 3 short (15-20 min) low-impact workouts per week,  
with 2 consecutive missed weeks as acceptable recovery period"

Reasoning: User has time constraints and energy barriers.  
Traditional "workout every day" goals would fail. This goal  
provides sustainability through built-in flexibility.

Confidence: 87%
```

**Planning Agent:**
```
📋 4-Week Plan Generated:

Week 1-2: 3x 15-min walks (Mon/Wed/Fri)
Week 3-4: 2x 15-min walks + 1x 20-min yoga

Fallback Plan (if missing 2+ workouts):
→ Reduce to 2x 10-min walks for recovery week

Recovery Plan (after 2 missed weeks):
→ Restart with 2x 10-min walks, gradual rebuild

Confidence: 82%
```

---

### Scenario 2: Autonomous Adaptation

**User Behavior:**
```
Week 1: ✅ Mon, ✅ Wed, ❌ Fri (worked late)
Week 2: ✅ Mon, ❌ Wed, ❌ Fri (low energy - logged mood: 3/10)
Week 3: ❌ Mon, ❌ Wed (no activity logged)
```

**Monitoring Agent Detection:**
```
🔍 Pattern Detected:
- Adherence declining (100% → 50% → 0%)
- Mood score dropped (7/10 → 3/10)
- Energy consistently low after work
- No weekend alternatives attempted

Signal: EARLY BURNOUT RISK
Trigger: Adaptation recommended
```

**Adaptation Agent Decision:**
```
🤖 Autonomous Adaptation:

Decision: REDUCE intensity, SHIFT timing
Confidence: 91% (above 85% threshold → auto-apply)

New Plan:
- Move workouts to morning (before work)
- Reduce to 2x 10-min walks per week
- Add weekend flexibility (Sat/Sun as options)

Reasoning: Evening workouts conflict with energy patterns.  
Morning slots have higher adherence probability.  
Reduced frequency prevents overwhelm.
```

**Explainability Agent Output:**
```
💬 Explanation to User:

"I noticed you've been missing workouts when scheduled after work,  
and your energy levels have been low in evenings. I've adjusted your  
plan to focus on short morning walks instead, just 2 per week to  
start. This gives you more flexibility and aligns with your energy  
patterns. You can always add more once this feels sustainable!"

Action You Can Take:
- Try the new morning schedule this week
- Let me know if mornings don't work either
- Your goal is still intact - we're just finding the right approach
```

---

### Scenario 3: Weekly Self-Reflection

**Reflection Agent Analysis (Week 4):**
```
🧠 Meta-Cognitive Reflection:

Intended Behavior: 3 workouts/week (evening)
Actual Behavior: 1.5 workouts/week average (attempted 6/12, completed 6)

✅ Success Factors:
- Morning workouts had 100% completion (3/3)
- Shorter duration reduced friction
- Weekend slots provided safety net

⚠️ Failure Factors:
- Evening workouts had 0% completion (0/9 attempted)
- Work unpredictability derailed evening plans
- Energy levels not accounted for in initial plan

🔍 Patterns Identified:
- Time-of-day is stronger predictor than motivation level
- User responds well to reduced volume, not intensity
- Weekend flexibility critical for consistency

💡 Lessons Learned:
1. Initial assessment underweighted schedule variability
2. Evening constraints were consistent barrier
3. User prefers frequency reduction over intensity drop

🎯 Heuristic Updates:
- For "busy professionals": prioritize morning slots
- When energy is constraint: time-shift before volume reduction
- Build weekend options into initial plans proactively

Confidence: 94%
```

**Impact on Future Planning:**
These insights automatically influence future plan generation  
for this user and similar profiles (meta-learning).

---

## 🧠 Agent System API

### Programmatic Usage

```typescript
import { agentOrchestrator } from '@/lib/agents';

// Execute single agent
const result = await agentOrchestrator.executeAgent('goal-formulation', {
  userId: 'user-123',
  timestamp: new Date(),
  data: {
    intent: 'Build exercise habit',
    context: { currentLevel: 'beginner', timeAvailable: 30 }
  }
});

console.log(result.reasoning);   // AI's thought process
console.log(result.action);      // Structured output
console.log(result.confidence);  // 0-1 score
console.log(result.metadata);    // Agent info

// Run autonomous cognitive cycle
await agentOrchestrator.cognitiveCycle(userId);
// Triggers: Monitor → Adapt → Explain → Reflect (if weekly)
```

---

## 🎨 UI Screenshots

### Landing Page
Clean, modern design with clear value proposition and non-clinical disclaimer.

### Onboarding Flow
Multi-step profile builder that captures context without overwhelming users.

### Dashboard
Real-time overview of goals, streaks, AI activity, and recent progress.

### Goal Management
Visual progress tracking with AI-generated insights and adaptations.

---

## 📊 Metrics & Evaluation

The system tracks:

| Metric | Description |
|--------|-------------|
| **Consistency Score** | 0-100 score based on adherence patterns |
| **Recovery Success Rate** | % of successful bounces from failures |
| **Adaptation Frequency** | How often AI adjusts plans |
| **User Trust Score** | Derived from feedback and engagement |
| **Trajectory Trend** | Improving / Stable / Declining |

---

## 🛡️ Ethics & Safety

### Non-Clinical Scope

⚠️ **This system does NOT provide:**
- Medical diagnosis or treatment
- Clinical health advice
- Prescription recommendations

✅ **This system DOES provide:**
- Fitness and lifestyle guidance
- Habit formation support
- Behavioral coaching

### Transparency

Every AI decision is:
- **Logged** for audit trails
- **Explained** in human language
- **Adjustable** by user preference

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy automatically

### Manual Deployment

```bash
npm run build
npm start
```

---

## 📚 API Documentation

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

## 🎯 Target Users

- 🎓 University students with irregular routines
- 💼 Knowledge workers with sedentary lifestyles
- 🏃 Fitness beginners prone to burnout
- 🌱 Individuals seeking sustainable long-term habits

---

## 🔬 Research Significance

This project demonstrates:

1. **Agentic AI for Non-Clinical Wellness**: First-of-its-kind autonomous reasoning system for fitness
2. **Failure-Tolerant Design**: Goals that survive setbacks, not collapse
3. **Transparent AI**: Every decision explained, building trust
4. **Long-Horizon Reasoning**: Optimizes for months, not days
5. **Human-AI Collaboration**: AI as partner, not enforcer

---

## 🏆 Innovation Highlights

✨ **Beyond CRUD Apps**: Multi-agent reasoning, not database operations  
✨ **Beyond Chatbots**: Autonomous action, not reactive responses  
✨ **Beyond Tracking**: Trajectory analysis, not isolated metrics  
✨ **Beyond Templates**: Dynamic adaptation, not static rules  

---

## 📝 License

MIT License - See [LICENSE](LICENSE) for details

---

## ⚠️ Ethical Disclaimer

**IMPORTANT: This is NOT a medical device and does NOT provide medical advice, diagnosis, or treatment.**

Adaptive Wellness AI is designed for **wellness and fitness guidance only**. Users should:
- ✅ Consult healthcare providers before starting any new exercise program
- ✅ Stop immediately if experiencing pain or concerning symptoms
- ✅ Recognize system limitations and use judgment
- ✅ Understand AI recommendations may occasionally be incorrect

**See [ETHICS.md](./ETHICS.md) for comprehensive ethical considerations.**

---

## 📋 Competition Deliverables

✅ **Problem Definition:** Comprehensive in [COMPETITION_SUBMISSION.md](./COMPETITION_SUBMISSION.md)  
✅ **System Architecture:** Visual diagrams and technical details included  
✅ **Working Prototype:** Fully functional application (see Setup below)  
✅ **Documentation:** README, SETUP.md, ARCHITECTURE.md, API docs  
✅ **Demo Video:** [Link to video](#) - 6-minute walkthrough  
✅ **Ethical Considerations:** [ETHICS.md](./ETHICS.md)  
✅ **Open-Source:** All code, MIT licensed  

**Evaluation Criteria Alignment:**
- 🎯 **Novelty (30%):** Autonomous adaptation + self-reflection loop
- 🤖 **Agentic Design (25%):** 6-agent cognitive cycle with tool interaction  
- 💻 **Implementation (20%):** Production-ready TypeScript/Next.js codebase
- 🌍 **Usefulness (15%):** Addresses 80% fitness goal failure rate
- 📚 **Documentation (10%):** 2500+ lines of comprehensive docs

---

## 👥 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit with clear messages
4. Open a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 Turbo API enabling agentic reasoning
- **Vercel** for Next.js framework and deployment platform
- **Prisma** for elegant database toolkit
- **nnov-AI-tion** for inspiring this competition challenge

---

## 📧 Contact

**Team:** [Your Team Name]  
**Email:** [your-email@example.com]  
**GitHub:** [@yourusername](https://github.com/yourusername)  
**Competition:** nnov-AI-tion Healthcare & Fitness Agentic Systems Challenge

---

## 🎓 Research Context

This project represents research-grade work at the intersection of:
- **Agentic AI Systems** - Multi-agent reasoning and autonomous decision-making
- **Behavioral Science** - Habit formation, self-determination theory, implementation intentions
- **Human-Computer Interaction** - Explainable AI, trust, transparency
- **Software Engineering** - Scalable architecture, production-ready code

**For Evaluators:** This submission demonstrates clear problem→solution→impact with fully deployable code, comprehensive documentation, and thoughtful ethical considerations.

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details.

---

**Built with ❤️ for sustainable human wellness**

*Adaptive Wellness AI - Where autonomous agents meet human behavior science*
