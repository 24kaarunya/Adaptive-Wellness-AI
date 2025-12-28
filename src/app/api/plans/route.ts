// Module 3: Planning API

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { agentOrchestrator } from '@/lib/agents';

const prisma = new PrismaClient();

// Create a plan for a goal using AI agent
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { goalId, duration } = body;

    // Verify goal belongs to user
    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: session.user.id,
      },
    });

    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // Check if OpenAI API is available
    const hasOpenAIKey = process.env.OPENAI_API_KEY && 
                         process.env.OPENAI_API_KEY !== 'your-openai-api-key' &&
                         process.env.OPENAI_API_KEY !== 'sk-your-openai-api-key-here';

    let plan;
    let reasoning = '';
    let confidence = 0.80;

    if (hasOpenAIKey) {
      // Use AI agent if API key is available
      const agentOutput = await agentOrchestrator.executeAgent('planning', {
        userId: session.user.id,
        timestamp: new Date(),
        data: { goalId, duration },
      });

      if (!agentOutput.success) {
        throw new Error('AI agent failed to create plan');
      }

      const planData = agentOutput.action.plan;
      
      // Serialize JSON fields for SQLite
      const dbPlanData = {
        ...planData,
        activities: typeof planData.activities === 'string' ? planData.activities : JSON.stringify(planData.activities),
        fallbackPlan: planData.fallbackPlan ? (typeof planData.fallbackPlan === 'string' ? planData.fallbackPlan : JSON.stringify(planData.fallbackPlan)) : null,
        recoveryPlan: planData.recoveryPlan ? (typeof planData.recoveryPlan === 'string' ? planData.recoveryPlan : JSON.stringify(planData.recoveryPlan)) : null,
        progressionRules: typeof planData.progressionRules === 'string' ? planData.progressionRules : JSON.stringify(planData.progressionRules),
        regressionRules: typeof planData.regressionRules === 'string' ? planData.regressionRules : JSON.stringify(planData.regressionRules),
      };
      
      plan = await prisma.plan.create({
        data: {
          userId: session.user.id,
          goalId,
          ...dbPlanData,
        },
      });

      reasoning = agentOutput.reasoning;
      confidence = agentOutput.confidence;
    } else {
      // Fallback: Create simple plan directly
      const now = new Date();
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() + 28); // 4 weeks default

      const activities = [
        { week: 1, days: ['Monday', 'Wednesday', 'Friday'], activity: goal.description, duration: 20, intensity: 'low' },
        { week: 2, days: ['Monday', 'Wednesday', 'Friday'], activity: goal.description, duration: 25, intensity: 'low' },
        { week: 3, days: ['Monday', 'Wednesday', 'Friday', 'Saturday'], activity: goal.description, duration: 25, intensity: 'medium' },
        { week: 4, days: ['Monday', 'Wednesday', 'Friday', 'Saturday'], activity: goal.description, duration: 30, intensity: 'medium' },
      ];

      plan = await prisma.plan.create({
        data: {
          userId: session.user.id,
          goalId,
          title: `${goal.title} - 4 Week Plan`,
          description: `Progressive plan for: ${goal.description}`,
          status: 'active',
          version: 1,
          startDate: now,
          endDate: endDate,
          currentWeek: 1,
          strategyType: 'gradual',
          activities: JSON.stringify(activities),
          physicalLoad: 5.0,
          cognitiveLoad: 3.0,
          sustainabilityScore: 8.0,
          hasFallback: true,
          fallbackPlan: JSON.stringify([
            { week: 1, days: ['Monday', 'Wednesday'], activity: goal.description, duration: 15, intensity: 'very-low' }
          ]),
          recoveryPlan: JSON.stringify([
            { week: 1, days: ['Monday'], activity: goal.description, duration: 10, intensity: 'very-low', note: 'Restart gently' }
          ]),
          progressionRules: JSON.stringify(['Increase duration by 5min if completing 80%+ of activities', 'Add 1 day if consistent for 2 weeks']),
          regressionRules: JSON.stringify(['Reduce duration by 5min if missing 40%+ of activities', 'Remove 1 day if struggling for 2 weeks']),
        },
      });

      reasoning = `Created a 4-week progressive plan with gradual intensity increase. Starting with 3 sessions per week, building up to 4 sessions by week 3.`;
      confidence = 0.80;
    }

    return NextResponse.json({
      success: true,
      plan,
      reasoning,
      confidence,
      metadata: {
        agentUsed: hasOpenAIKey ? 'planning' : 'direct-creation',
        timestamp: new Date().toISOString()
      },
    });
  } catch (error) {
    console.error('Plan creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create plan' },
      { status: 500 }
    );
  }
}

// Get plans for a goal
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const goalId = searchParams.get('goalId');

    const where: any = { userId: session.user.id };
    if (goalId) {
      where.goalId = goalId;
    }

    const plans = await prisma.plan.findMany({
      where,
      include: {
        goal: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Parse JSON fields
    const plansWithParsedJson = plans.map(plan => ({
      ...plan,
      activities: JSON.parse(plan.activities),
      fallbackPlan: plan.fallbackPlan ? JSON.parse(plan.fallbackPlan) : null,
      recoveryPlan: plan.recoveryPlan ? JSON.parse(plan.recoveryPlan) : null,
      progressionRules: JSON.parse(plan.progressionRules),
      regressionRules: JSON.parse(plan.regressionRules),
    }));

    return NextResponse.json({ plans: plansWithParsedJson });
  } catch (error) {
    console.error('Get plans error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}
