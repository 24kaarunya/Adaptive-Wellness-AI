// Module 4: Monitoring API

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { agentOrchestrator } from '@/lib/agents';

const prisma = new PrismaClient();

const monitoringSchema = z.object({
  goalId: z.string().optional(),
  planId: z.string().optional(),
  date: z.string().transform((str) => new Date(str)),
  activityType: z.string().min(1, 'Activity type is required'),
  completed: z.boolean(),
  value: z.number().optional(),
  unit: z.string().optional(),
  energyLevel: z.enum(['low', 'medium', 'high']).optional(),
  motivation: z.enum(['low', 'medium', 'high']).optional(),
  difficulty: z.enum(['easy', 'moderate', 'hard']).optional(),
  enjoyment: z.enum(['low', 'medium', 'high']).optional(),
  notes: z.string().optional(),
  timeOfDay: z.string().optional(),
  location: z.string().optional(),
  social: z.boolean().optional(),
});

// Log monitoring data
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = monitoringSchema.parse(body);

    // Calculate streak and deviation info
    const recentData = await prisma.monitoringData.findMany({
      where: {
        userId: session.user.id,
        date: {
          lt: data.date,
        },
      },
      orderBy: { date: 'desc' },
      take: 7,
    });

    let streakCount = 0;
    let consecutiveMisses = 0;

    if (data.completed) {
      // Calculate streak
      for (const record of recentData) {
        if (record.completed) {
          streakCount++;
        } else {
          break;
        }
      }
      streakCount++; // Include current
    } else {
      // Calculate consecutive misses
      for (const record of recentData) {
        if (!record.completed) {
          consecutiveMisses++;
        } else {
          break;
        }
      }
      consecutiveMisses++; // Include current
    }

    const monitoringData = await prisma.monitoringData.create({
      data: {
        userId: session.user.id,
        ...data,
        streakCount,
        consecutiveMisses,
        isDeviation: !data.completed || consecutiveMisses > 2,
        deviationType: !data.completed ? 'missed' : undefined,
      },
    });

    // Trigger monitoring agent analysis if deviation detected
    if (monitoringData.isDeviation) {
      await agentOrchestrator.executeAgent('monitoring', {
        userId: session.user.id,
        timestamp: new Date(),
        data: {},
      });
    }

    return NextResponse.json({ success: true, data: monitoringData });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Monitoring data error:', error);
    return NextResponse.json(
      { error: 'Failed to log monitoring data' },
      { status: 500 }
    );
  }
}

// Get monitoring data
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const goalId = searchParams.get('goalId');
    const days = parseInt(searchParams.get('days') || '30');

    const where: any = {
      userId: session.user.id,
      date: {
        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      },
    };

    if (goalId) {
      where.goalId = goalId;
    }

    const data = await prisma.monitoringData.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Get monitoring data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monitoring data' },
      { status: 500 }
    );
  }
}
