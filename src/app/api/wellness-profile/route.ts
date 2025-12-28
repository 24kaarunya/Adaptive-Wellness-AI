// Module 1: Onboarding & Wellness Profile API

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const wellnessProfileSchema = z.object({
  primaryIntent: z.string().min(5, 'Please describe your primary wellness goal'),
  secondaryIntents: z.array(z.string()).default([]),
  availableTime: z.number().min(5).max(300),
  energyLevel: z.enum(['low', 'medium', 'high']),
  currentRoutine: z.string(),
  barriers: z.array(z.string()),
  motivationStyle: z.enum(['achievement', 'social', 'health', 'appearance']),
  preferredActivities: z.array(z.string()),
  adherenceRisk: z.enum(['low', 'medium', 'high']),
  historicalFailures: z.array(z.string()).default([]),
  planningPreference: z.enum(['structured', 'flexible', 'minimal']),
  feedbackFrequency: z.enum(['daily', 'weekly', 'as-needed']),
  preferExplanations: z.boolean().default(true),
});

// Create or update wellness profile
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = wellnessProfileSchema.parse(body);

    // Convert arrays to JSON strings for SQLite compatibility
    const dbData = {
      ...data,
      secondaryIntents: JSON.stringify(data.secondaryIntents),
      barriers: JSON.stringify(data.barriers),
      preferredActivities: JSON.stringify(data.preferredActivities),
      historicalFailures: JSON.stringify(data.historicalFailures),
    };

    const profile = await prisma.wellnessProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        ...dbData,
      },
      update: dbData,
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Wellness profile error:', error);
    return NextResponse.json(
      { error: 'Failed to save wellness profile' },
      { status: 500 }
    );
  }
}

// Get wellness profile
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.wellnessProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ profile: null });
    }

    // Parse JSON strings back to arrays
    const profileWithArrays = {
      ...profile,
      secondaryIntents: JSON.parse(profile.secondaryIntents),
      barriers: JSON.parse(profile.barriers),
      preferredActivities: JSON.parse(profile.preferredActivities),
      historicalFailures: JSON.parse(profile.historicalFailures),
    };

    return NextResponse.json({ profile: profileWithArrays });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wellness profile' },
      { status: 500 }
    );
  }
}
