import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch reflections for this user
    const reflections = await prisma.reflection.findMany({
      where: { userId: user.id },
      orderBy: { periodEnd: 'desc' },
      take: 10, // Last 10 reflections
    });

    // Parse JSON strings back to arrays and map to expected format
    const parsedReflections = reflections.map((r, index) => ({
      id: r.id,
      createdAt: r.createdAt.toISOString(),
      weekNumber: reflections.length - index, // Calculate week number from order
      periodStart: r.periodStart,
      periodEnd: r.periodEnd,
      reflectionType: r.reflectionType,
      intendedBehavior: r.intendedBehavior,
      actualBehavior: r.actualBehavior,
      successFactors: JSON.parse(r.successFactors),
      failureFactors: JSON.parse(r.failureFactors),
      externalFactors: JSON.parse(r.externalFactors),
      patterns: JSON.parse(r.patterns),
      rootCauses: JSON.parse(r.rootCauses),
      lessonsLearned: JSON.parse(r.lessonsLearned),
      heuristicUpdates: r.heuristicUpdates,
      recommendations: JSON.parse(r.recommendations),
      confidenceScore: r.confidenceScore,
    }));

    return NextResponse.json({ reflections: parsedReflections });
  } catch (error) {
    console.error('Error fetching reflections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reflections' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();

    const {
      weekNumber,
      intendedBehavior,
      actualBehavior,
      successFactors = [],
      failureFactors = [],
      externalFactors = [],
      patterns = [],
      rootCauses = [],
      lessonsLearned = [],
      recommendations = [],
      confidenceScore,
    } = body;

    const reflection = await prisma.reflection.create({
      data: {
        userId: user.id,
        weekNumber,
        intendedBehavior,
        actualBehavior,
        successFactors: JSON.stringify(successFactors),
        failureFactors: JSON.stringify(failureFactors),
        externalFactors: JSON.stringify(externalFactors),
        patterns: JSON.stringify(patterns),
        rootCauses: JSON.stringify(rootCauses),
        lessonsLearned: JSON.stringify(lessonsLearned),
        recommendations: JSON.stringify(recommendations),
        confidenceScore,
      },
    });

    // Parse back for response
    const parsedReflection = {
      ...reflection,
      successFactors: JSON.parse(reflection.successFactors),
      failureFactors: JSON.parse(reflection.failureFactors),
      externalFactors: JSON.parse(reflection.externalFactors),
      patterns: JSON.parse(reflection.patterns),
      rootCauses: JSON.parse(reflection.rootCauses),
      lessonsLearned: JSON.parse(reflection.lessonsLearned),
      recommendations: JSON.parse(reflection.recommendations),
    };

    return NextResponse.json({ reflection: parsedReflection }, { status: 201 });
  } catch (error) {
    console.error('Error creating reflection:', error);
    return NextResponse.json(
      { error: 'Failed to create reflection' },
      { status: 500 }
    );
  }
}
