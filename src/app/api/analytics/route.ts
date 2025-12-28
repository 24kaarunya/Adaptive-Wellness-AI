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

    // Fetch goals analytics
    const goals = await prisma.goal.findMany({
      where: { userId: user.id },
    });

    const totalGoals = goals.length;
    const activeGoals = goals.filter(g => g.status === 'ACTIVE').length;
    const completedGoals = goals.filter(g => g.status === 'COMPLETED').length;

    // Fetch monitoring data for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monitoringData = await prisma.monitoringData.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: thirtyDaysAgo },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalActivities = monitoringData.length;
    const completedActivities = monitoringData.filter(m => m.completed).length;
    const completionRate = totalActivities > 0 
      ? Math.round((completedActivities / totalActivities) * 100) 
      : 0;

    // Calculate streaks
    const sortedData = [...monitoringData].sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    for (const data of sortedData) {
      if (!data.completed) continue;

      if (!lastDate) {
        tempStreak = 1;
        currentStreak = 1;
      } else {
        const daysDiff = Math.floor(
          (lastDate.getTime() - data.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 1) {
          tempStreak++;
          if (currentStreak === 0) currentStreak = tempStreak;
        } else if (daysDiff > 1) {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
          currentStreak = 0;
        }
      }

      lastDate = data.createdAt;
    }

    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    // Calculate averages
    const avgEffort = totalActivities > 0
      ? monitoringData.reduce((sum, m) => sum + m.effort, 0) / totalActivities
      : 0;

    const avgMood = totalActivities > 0
      ? monitoringData.reduce((sum, m) => sum + m.mood, 0) / totalActivities
      : 0;

    const avgEnergy = totalActivities > 0
      ? monitoringData.reduce((sum, m) => sum + m.energy, 0) / totalActivities
      : 0;

    const analytics = {
      totalGoals,
      activeGoals,
      completedGoals,
      totalActivities,
      completionRate,
      currentStreak,
      longestStreak,
      averageEffort: Math.round(avgEffort * 10) / 10,
      averageMood: Math.round(avgMood * 10) / 10,
      averageEnergy: Math.round(avgEnergy * 10) / 10,
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
