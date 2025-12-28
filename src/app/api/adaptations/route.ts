// Module 5: Adaptation API

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { agentOrchestrator } from '@/lib/agents';

const prisma = new PrismaClient();

// Trigger adaptation analysis
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { goalId, planId } = body;

    // Get monitoring report first
    const monitoringOutput = await agentOrchestrator.executeAgent('monitoring', {
      userId: session.user.id,
      timestamp: new Date(),
      data: {},
    });

    // Get current plan and goal
    const [plan, goal, profile] = await Promise.all([
      prisma.plan.findUnique({ where: { id: planId } }),
      prisma.goal.findUnique({ where: { id: goalId } }),
      prisma.wellnessProfile.findUnique({ where: { userId: session.user.id } }),
    ]);

    // Execute Adaptation Agent
    const agentOutput = await agentOrchestrator.executeAgent('adaptation', {
      userId: session.user.id,
      timestamp: new Date(),
      data: {
        monitoringReport: monitoringOutput,
        currentPlan: plan,
        currentGoal: goal,
        profile,
      },
    });

    if (!agentOutput.success) {
      return NextResponse.json(
        { error: 'Failed to analyze adaptation' },
        { status: 500 }
      );
    }

    // Log adaptation
    const adaptation = await prisma.adaptation.create({
      data: {
        userId: session.user.id,
        triggerType: agentOutput.metadata?.triggerType || 'manual',
        triggerData: JSON.stringify(agentOutput.metadata || {}),
        detectedIssue: agentOutput.metadata?.detectedIssue || 'unknown',
        analysisReasoning: agentOutput.reasoning,
        actionType: agentOutput.action.type,
        actionDetails: JSON.stringify(agentOutput.action.changes || {}),
        autonomous: agentOutput.action.autonomous,
        expectedImpact: agentOutput.action.expectedImpact || '',
      },
    });

    // Get explanation
    const explanation = await agentOrchestrator.executeAgent('explainability', {
      userId: session.user.id,
      timestamp: new Date(),
      data: {
        decision: agentOutput,
        userContext: { profile, goal, plan },
      },
    });

    return NextResponse.json({
      success: true,
      adaptation,
      recommendation: agentOutput.action,
      explanation: explanation.action,
      confidence: agentOutput.confidence,
      requiresApproval: agentOutput.metadata?.requiresUserApproval,
    });
  } catch (error) {
    console.error('Adaptation error:', error);
    return NextResponse.json(
      { error: 'Failed to process adaptation' },
      { status: 500 }
    );
  }
}

// Approve adaptation
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { adaptationId, approved } = body;

    const adaptation = await prisma.adaptation.findFirst({
      where: {
        id: adaptationId,
        userId: session.user.id,
      },
    });

    if (!adaptation) {
      return NextResponse.json(
        { error: 'Adaptation not found' },
        { status: 404 }
      );
    }

    const updated = await prisma.adaptation.update({
      where: { id: adaptationId },
      data: {
        userApproved: approved,
        implemented: approved,
        implementedAt: approved ? new Date() : undefined,
      },
    });

    // If approved, implement the changes
    if (approved) {
      // Implementation logic here based on actionType
      // This would update goals, plans, etc.
    }

    return NextResponse.json({ success: true, adaptation: updated });
  } catch (error) {
    console.error('Approve adaptation error:', error);
    return NextResponse.json(
      { error: 'Failed to approve adaptation' },
      { status: 500 }
    );
  }
}
