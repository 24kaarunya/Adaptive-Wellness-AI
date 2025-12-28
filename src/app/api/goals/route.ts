// Module 2: Goal Formulation API

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { agentOrchestrator } from '@/lib/agents';

const prisma = new PrismaClient();

// Create a new goal using AI agent
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { category, description, targetValue, targetUnit, deadline, priority } = body;

    // Check if OpenAI API is available
    const hasOpenAIKey = process.env.OPENAI_API_KEY && 
                         process.env.OPENAI_API_KEY !== 'your-openai-api-key' &&
                         process.env.OPENAI_API_KEY !== 'sk-your-openai-api-key-here';

    let goal;
    let reasoning = '';
    let confidence = 0.75;

    if (hasOpenAIKey) {
      // Use AI agent if API key is available
      const agentOutput = await agentOrchestrator.executeAgent('goal-formulation', {
        userId: session.user.id,
        timestamp: new Date(),
        data: { intent: description, context: { category, targetValue, targetUnit } },
      });

      if (!agentOutput.success) {
        throw new Error('AI agent failed to formulate goal');
      }

      const goalData = agentOutput.action.goal;
      goal = await prisma.goal.create({
        data: {
          userId: session.user.id,
          ...goalData,
        },
      });

      reasoning = agentOutput.reasoning;
      confidence = agentOutput.confidence;
    } else {
      // Fallback: Create goal directly from form data
      const deadlineDate = new Date(deadline);
      const now = new Date();
      const timeframeWeeks = Math.ceil((deadlineDate.getTime() - now.getTime()) / (7 * 24 * 60 * 60 * 1000));

      goal = await prisma.goal.create({
        data: {
          userId: session.user.id,
          title: `${category.charAt(0).toUpperCase() + category.slice(1)} Goal`,
          description: description || `Achieve ${targetValue} ${targetUnit}`,
          type: category || 'fitness',
          status: 'active',
          specific: description || `Achieve ${targetValue} ${targetUnit}`,
          measurable: `${targetValue} ${targetUnit}`,
          achievable: 'Based on user input and available time',
          relevant: `User wants to improve ${category}`,
          timeBound: `By ${deadlineDate.toLocaleDateString()}`,
          baselineValue: 0,
          targetValue: parseFloat(targetValue) || 0,
          currentValue: 0,
          unit: targetUnit || 'sessions',
          allowedMisses: 2,
          recoveryStrategy: 'Resume with reduced intensity after missed sessions',
          fallbackGoal: `Reduce target to ${Math.floor((parseFloat(targetValue) || 0) * 0.7)} ${targetUnit} if struggling`,
        },
      });

      reasoning = `Goal created from user input. ${description}. Target: ${targetValue} ${targetUnit} by ${deadlineDate.toLocaleDateString()}.`;
      confidence = 0.75;
    }

    return NextResponse.json({
      success: true,
      goal,
      reasoning,
      confidence,
      metadata: { 
        agentUsed: hasOpenAIKey ? 'goal-formulation' : 'direct-creation',
        timestamp: new Date().toISOString()
      },
    });
  } catch (error) {
    console.error('Goal creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}

// Get all user goals
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const goals = await prisma.goal.findMany({
      where: { userId: session.user.id },
      include: {
        plans: {
          where: { status: 'active' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: {
          select: { monitoringData: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ goals });
  } catch (error) {
    console.error('Get goals error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}
