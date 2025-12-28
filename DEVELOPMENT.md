# 🎯 Adaptive Wellness AI - Development Guide

## For Developers

This guide helps you understand the codebase and start contributing quickly.

---

## 🏗️ System Architecture Overview

### Three-Layer Architecture

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│   (React + Next.js + Tailwind)     │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│         Application Layer           │
│    (API Routes + Agent System)      │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│           Data Layer                │
│      (Prisma + PostgreSQL)          │
└─────────────────────────────────────┘
```

---

## 🧠 Understanding the Agent System

### Agent Lifecycle

Every agent follows this pattern:

```typescript
// 1. Receive context
interface AgentContext {
  userId: string;
  timestamp: Date;
  data?: any;
}

// 2. Reason about the problem
const reasoning = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [
    { role: 'system', content: this.systemPrompt },
    { role: 'user', content: userPrompt }
  ]
});

// 3. Return structured output
interface AgentOutput {
  success: boolean;
  reasoning: string;
  action: any;
  confidence: number;
}
```

### Adding a New Agent

```typescript
// Step 1: Create agent class
export class NutritionAgent extends BaseAgent {
  constructor() {
    super(
      'nutrition',
      `You are an expert Nutrition Agent...`
    );
  }

  async execute(context: AgentContext): Promise<AgentOutput> {
    // Fetch user data
    const profile = await prisma.wellnessProfile.findUnique({
      where: { userId: context.userId }
    });

    // Build prompt
    const prompt = `User profile: ${JSON.stringify(profile)}
    Task: Create a nutrition plan...`;

    // Get AI reasoning
    return await this.reason(context, prompt);
  }
}

// Step 2: Register in orchestrator
this.agents.set('nutrition', new NutritionAgent());

// Step 3: Create API endpoint
// src/app/api/nutrition/route.ts
export async function POST(req: NextRequest) {
  const result = await agentOrchestrator.executeAgent('nutrition', {
    userId: session.user.id,
    timestamp: new Date(),
    data: body
  });
  // ...
}
```

---

## 🗄️ Database Development

### Adding a New Model

```prisma
// 1. Edit prisma/schema.prisma
model NutritionPlan {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  
  meals     Json
  calories  Int
  
  @@map("nutrition_plans")
}

// 2. Update User model
model User {
  // ...
  nutritionPlans NutritionPlan[]
}
```

```bash
# 3. Generate migration
npm run db:migrate -- --name add-nutrition-plan

# 4. Generate Prisma Client
npm run db:generate
```

### Query Patterns

```typescript
// Fetch with relations
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    wellnessProfile: true,
    goals: {
      where: { status: 'active' },
      include: { plans: true }
    }
  }
});

// Create with relations
const goal = await prisma.goal.create({
  data: {
    userId: userId,
    title: 'Walk 10k steps',
    plans: {
      create: {
        userId: userId,
        title: 'Walking Plan',
        // ...
      }
    }
  }
});

// Update
await prisma.goal.update({
  where: { id: goalId },
  data: { currentValue: newValue }
});

// Delete cascade
await prisma.user.delete({
  where: { id: userId }
  // Cascade deletes all related data
});
```

---

## 🎨 Frontend Development

### Component Pattern

```typescript
'use client'; // Client component

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function FeaturePage() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/endpoint');
      const json = await res.json();
      setData(json.data);
      setLoading(false);
    }
    
    if (session?.user?.id) {
      fetchData();
    }
  }, [session]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Your UI */}
    </div>
  );
}
```

### API Call Pattern

```typescript
// GET request
const response = await fetch('/api/goals');
const { goals } = await response.json();

// POST request
const response = await fetch('/api/goals', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    intent: 'Build exercise habit',
    context: { /* ... */ }
  })
});
const { goal, reasoning } = await response.json();

// Error handling
try {
  const res = await fetch('/api/endpoint');
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  const data = await res.json();
} catch (error) {
  console.error('API error:', error);
  setError(error.message);
}
```

---

## 🔌 API Development

### Route Pattern

```typescript
// src/app/api/feature/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const schema = z.object({
  field: z.string().min(1),
  number: z.number().positive()
});

// GET handler
export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Query parameters
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter');

    // 3. Fetch data
    const data = await prisma.model.findMany({
      where: {
        userId: session.user.id,
        ...(filter && { type: filter })
      }
    });

    // 4. Return response
    return NextResponse.json({ data });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate input
    const body = await req.json();
    const validatedData = schema.parse(body);

    // Create record
    const record = await prisma.model.create({
      data: {
        userId: session.user.id,
        ...validatedData
      }
    });

    return NextResponse.json({ success: true, record });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## 🧪 Testing (Planned)

### Unit Tests

```typescript
// __tests__/agents/goal-formulation.test.ts

import { GoalFormulationAgent } from '@/lib/agents';

describe('GoalFormulationAgent', () => {
  const agent = new GoalFormulationAgent();

  it('should transform vague intent into structured goal', async () => {
    const result = await agent.execute({
      userId: 'test-user',
      timestamp: new Date(),
      data: {
        intent: 'I want to get healthier'
      }
    });

    expect(result.success).toBe(true);
    expect(result.action.goal).toHaveProperty('title');
    expect(result.action.goal).toHaveProperty('specific');
    expect(result.confidence).toBeGreaterThan(0.5);
  });
});
```

### Integration Tests

```typescript
// __tests__/api/goals.test.ts

import { createMocks } from 'node-mocks-http';
import { POST } from '@/app/api/goals/route';

describe('/api/goals', () => {
  it('should create a goal', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        intent: 'Walk more',
        context: {}
      }
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.goal).toBeDefined();
  });
});
```

---

## 🎯 Common Development Tasks

### Add a New Page

```bash
# Create file
touch src/app/new-page/page.tsx

# Edit file
export default function NewPage() {
  return <div>New Page</div>;
}

# Access at /new-page
```

### Add Protected Route

```typescript
// src/middleware.ts

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/new-protected-route/:path*', // Add here
  ],
};
```

### Update Styling

```typescript
// Use Tailwind classes
<div className="bg-primary-600 text-white p-4 rounded-lg">
  Content
</div>

// Custom styles in globals.css if needed
```

### Environment Variables

```typescript
// Access in server components/API routes
const apiKey = process.env.OPENAI_API_KEY;

// Access in client components
const publicUrl = process.env.NEXT_PUBLIC_API_URL;
```

---

## 🐛 Debugging Tips

### Debug Agent Reasoning

```typescript
// Check agent logs in database
const logs = await prisma.agentLog.findMany({
  where: { userId: 'user-id' },
  orderBy: { createdAt: 'desc' },
  take: 10
});

console.log('Agent reasoning:', logs[0].reasoning);
```

### Debug API Calls

```typescript
// Add console logs
console.log('Request body:', body);
console.log('Session:', session);
console.log('Database result:', result);

// Check Network tab in browser DevTools
```

### Debug Database Queries

```bash
# Enable Prisma logging in .env
DATABASE_URL="postgresql://...?schema=public&connect_timeout=10"

# Add to prisma client
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});
```

---

## 📊 Performance Optimization

### Database

```typescript
// Use select to limit fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true
    // Don't fetch password, etc.
  }
});

// Use pagination
const goals = await prisma.goal.findMany({
  skip: page * pageSize,
  take: pageSize
});

// Use indexes (in schema.prisma)
@@index([userId, createdAt])
```

### API

```typescript
// Parallel requests
const [goals, plans, monitoring] = await Promise.all([
  fetch('/api/goals'),
  fetch('/api/plans'),
  fetch('/api/monitoring')
]);
```

### Frontend

```typescript
// Lazy load components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />
});

// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);
```

---

## 🔐 Security Best Practices

### Input Validation

```typescript
// Always validate with Zod
const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18).max(120)
});

const validated = schema.parse(userInput);
```

### Authentication Checks

```typescript
// Every API route
const session = await getServerSession(authOptions);
if (!session?.user?.id) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### SQL Injection Prevention

```typescript
// Prisma automatically prevents SQL injection
// ✅ Good - Prisma parameterization
await prisma.user.findUnique({ where: { email: userInput } });

// ❌ Never do raw SQL with user input
await prisma.$executeRaw`SELECT * FROM users WHERE email = ${userInput}`;
```

---

## 📚 Useful Resources

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **OpenAI**: https://platform.openai.com/docs
- **Tailwind**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

## 🎓 Learning Path for New Developers

1. **Day 1**: Read README.md and SETUP.md
2. **Day 2**: Run the app locally, create test account
3. **Day 3**: Study database schema in Prisma Studio
4. **Day 4**: Read agent system code
5. **Day 5**: Add a simple feature (e.g., new API endpoint)
6. **Week 2**: Implement a new agent
7. **Week 3**: Build a complete feature end-to-end

---

**Happy coding! 🚀**
