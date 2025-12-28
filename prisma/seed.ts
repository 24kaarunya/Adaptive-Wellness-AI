import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with mock data...');

  // Create a demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@adaptivewellness.ai' },
    update: {},
    create: {
      email: 'demo@adaptivewellness.ai',
      password: hashedPassword,
      name: 'Demo User',
    },
  });

  console.log('✓ Created demo user:', user.email);

  // Create wellness profile for the user
  const wellnessProfile = await prisma.wellnessProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      primaryIntent: 'Improve overall health and build sustainable fitness habits',
      secondaryIntents: JSON.stringify(['Reduce stress', 'Increase energy', 'Better sleep']),
      availableTime: 60,
      energyLevel: 'medium',
      currentRoutine: 'Occasional walks, no structured exercise routine',
      barriers: JSON.stringify(['Time constraints', 'Weather', 'Motivation']),
      motivationStyle: 'health',
      preferredActivities: JSON.stringify(['Running', 'Walking', 'Meditation', 'Yoga']),
      adherenceRisk: 'medium',
      historicalFailures: JSON.stringify(['Gym membership unused', 'Diet plans abandoned after 2 weeks']),
      planningPreference: 'structured',
      feedbackFrequency: 'weekly',
    },
  });

  console.log('✓ Created wellness profile');

  // Create a fitness goal with a comprehensive plan
  const fitnessGoal = await prisma.goal.create({
    data: {
      userId: user.id,
      title: 'Run 5 kilometers consistently',
      description: 'Build endurance to run 5km without stopping, 3-4 times per week',
      type: 'fitness',
      status: 'active',
      
      // SMART Goal fields
      specific: 'Run 5 kilometers without stopping',
      measurable: 'Track distance covered per session and number of sessions per week',
      achievable: 'Start with 3 sessions per week at low intensity, gradually building endurance',
      relevant: 'Improve cardiovascular health and build sustainable fitness habits',
      timeBound: 'Achieve consistent 5km runs within 4 weeks',
      
      // Progress tracking
      baselineValue: 0,
      currentValue: 8,
      targetValue: 20,
      unit: 'sessions completed',
      
      // Failure tolerance
      allowedMisses: 2,
      recoveryStrategy: 'Resume with reduced intensity after missed sessions',
      fallbackGoal: 'Reduce target to 2 sessions if struggling',
    },
  });

  console.log('✓ Created fitness goal:', fitnessGoal.title);

  // Create a detailed 4-week progressive plan
  const fitnessPlan = await prisma.plan.create({
    data: {
      userId: user.id,
      goalId: fitnessGoal.id,
      title: 'Fitness Goal - 4 Week Plan',
      description: 'Progressive plan for: run 5 km',
      status: 'active',
      strategyType: 'gradual',
      startDate: new Date(),
      endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 4 weeks from now
      
      // Load scores
      physicalLoad: 5,
      cognitiveLoad: 3,
      sustainabilityScore: 8,
      
      // Weekly activities (stored as JSON string)
      activities: JSON.stringify([
        {
          week: 1,
          days: ['Monday', 'Wednesday', 'Friday'],
          activity: 'run 5 km',
          duration: 20,
          intensity: 'low'
        },
        {
          week: 2,
          days: ['Monday', 'Wednesday', 'Friday'],
          activity: 'run 5 km',
          duration: 25,
          intensity: 'low'
        },
        {
          week: 3,
          days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
          activity: 'run 5 km',
          duration: 25,
          intensity: 'medium'
        },
        {
          week: 4,
          days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
          activity: 'run 5 km',
          duration: 30,
          intensity: 'medium'
        }
      ]),
      
      // Progression rules
      progressionRules: JSON.stringify([
        'Increase duration by 5min if completing 80%+ of activities',
        'Add 1 day if consistent for 2 weeks',
        'Move to medium intensity after 2 weeks of low intensity success'
      ]),
      
      // Regression rules
      regressionRules: JSON.stringify([
        'Reduce duration by 5min if missing 40%+ of activities',
        'Remove 1 day if struggling for 2 weeks',
        'Drop intensity level if experiencing fatigue or discomfort'
      ]),
      
      // Fallback plan
      fallbackPlan: JSON.stringify([
        {
          week: 1,
          days: ['Monday', 'Wednesday'],
          activity: 'run 5 km',
          duration: 15,
          intensity: 'very-low'
        },
        {
          week: 2,
          days: ['Monday', 'Wednesday', 'Friday'],
          activity: 'run 5 km',
          duration: 15,
          intensity: 'very-low'
        }
      ]),
      
      // Recovery plan
      recoveryPlan: JSON.stringify([
        {
          week: 1,
          days: ['Monday'],
          activity: 'run 5 km',
          duration: 10,
          intensity: 'very-low',
          note: 'Restart gently with just one session to rebuild confidence'
        },
        {
          week: 2,
          days: ['Monday', 'Thursday'],
          activity: 'run 5 km',
          duration: 15,
          intensity: 'low',
          note: 'Add a second session once comfortable'
        }
      ]),
      
      hasFallback: true,
    },
  });

  console.log('✓ Created fitness plan with complete weekly schedule');

  // Create a meditation goal
  const meditationGoal = await prisma.goal.create({
    data: {
      userId: user.id,
      title: 'Daily meditation practice',
      description: 'Establish a consistent mindfulness meditation practice for stress reduction',
      type: 'mental-health',
      status: 'active',
      
      specific: 'Practice mindfulness meditation daily for stress reduction',
      measurable: 'Track meditation sessions and duration each day',
      achievable: 'Start with 5-minute sessions, gradually increase to 15 minutes',
      relevant: 'Reduce anxiety and improve focus for better work-life balance',
      timeBound: 'Build a consistent 15-minute daily practice within 3 weeks',
      
      baselineValue: 0,
      currentValue: 5,
      targetValue: 21,
      unit: 'meditation sessions',
      
      allowedMisses: 3,
      recoveryStrategy: 'Return to 5-minute sessions to rebuild habit',
      fallbackGoal: 'Maintain 3 sessions per week minimum',
    },
  });

  console.log('✓ Created meditation goal:', meditationGoal.title);

  // Create meditation plan
  const meditationPlan = await prisma.plan.create({
    data: {
      userId: user.id,
      goalId: meditationGoal.id,
      title: 'Mindfulness Building - 3 Week Plan',
      description: 'Progressive meditation practice plan',
      status: 'active',
      strategyType: 'gradual',
      startDate: new Date(),
      endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
      
      physicalLoad: 2,
      cognitiveLoad: 6,
      sustainabilityScore: 9,
      
      activities: JSON.stringify([
        {
          week: 1,
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          activity: 'mindfulness meditation',
          duration: 5,
          intensity: 'low'
        },
        {
          week: 2,
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          activity: 'mindfulness meditation',
          duration: 10,
          intensity: 'medium'
        },
        {
          week: 3,
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          activity: 'mindfulness meditation',
          duration: 15,
          intensity: 'medium'
        }
      ]),
      
      progressionRules: JSON.stringify([
        'Increase duration by 5 minutes after 7 consecutive days',
        'Add breathing exercises if completing 90%+ of sessions'
      ]),
      
      regressionRules: JSON.stringify([
        'Reduce duration by 5 minutes if missing 4+ sessions per week',
        'Return to 5-minute sessions if feeling overwhelmed'
      ]),
      
      fallbackPlan: JSON.stringify([
        {
          week: 1,
          days: ['Monday', 'Wednesday', 'Friday'],
          activity: 'mindfulness meditation',
          duration: 3,
          intensity: 'very-low'
        }
      ]),
      
      recoveryPlan: JSON.stringify([
        {
          week: 1,
          days: ['Daily'],
          activity: 'mindfulness meditation',
          duration: 3,
          intensity: 'very-low',
          note: 'Start with just 3 minutes daily to rebuild the habit without pressure'
        }
      ]),
      
      hasFallback: true,
    },
  });

  console.log('✓ Created meditation plan');

  // Add some monitoring data for the fitness goal
  const today = new Date();
  const monitoringData = [];

  for (let i = 7; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const data = await prisma.monitoringData.create({
      data: {
        userId: user.id,
        goalId: fitnessGoal.id,
        activityType: 'Running',
        completed: true,
        value: 20 + Math.random() * 10,
        unit: 'minutes',
        energyLevel: 'medium',
        difficulty: 'moderate',
        enjoyment: 'high',
        notes: `Heart rate: ${140 + Math.floor(Math.random() * 20)}, Distance: 5km`,
        date: date,
      },
    });
    monitoringData.push(data);
  }

  console.log(`✓ Created ${monitoringData.length} monitoring data points`);

  // Add a reflection
  const reflection = await prisma.reflection.create({
    data: {
      userId: user.id,
      periodStart: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
      periodEnd: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      reflectionType: 'weekly',
      intendedBehavior: JSON.stringify(['Run 3 times per week', 'Meditate daily']),
      actualBehavior: JSON.stringify(['Ran 4 times this week', 'Meditated 5 days']),
      successFactors: JSON.stringify(['Morning workout routine', 'Good weather', 'High motivation']),
      failureFactors: JSON.stringify(['Missed weekend meditation', 'One run cut short due to fatigue']),
      externalFactors: JSON.stringify(['Clear schedule this week', 'Supportive family']),
      patterns: JSON.stringify([
        'Consistently meeting fitness goals on weekdays',
        'Weekend sessions are harder to maintain',
        'Morning workouts show better completion rates'
      ]),
      rootCauses: JSON.stringify([
        'Morning routine is well-established',
        'Weekend activities compete for time'
      ]),
      lessonsLearned: JSON.stringify([
        'Schedule workouts before other weekend activities',
        'Morning routine is most sustainable'
      ]),
      heuristicUpdates: JSON.stringify({
        'best_time_to_exercise': 'morning',
        'weekend_scheduling': 'requires_explicit_planning'
      }),
      recommendations: JSON.stringify([
        'Consider adding a Saturday morning session',
        'Keep morning workout routine as primary schedule',
        'Add recovery stretching after runs'
      ]),
      confidenceScore: 0.85,
    },
  });

  console.log('✓ Created weekly reflection');

  // Add agent logs to show AI reasoning
  const agentLogs = await Promise.all([
    prisma.agentLog.create({
      data: {
        agentType: 'planning',
        action: 'create_plan',
        input: JSON.stringify({ goalId: fitnessGoal.id, strategyPreference: 'gradual' }),
        output: JSON.stringify({ planId: fitnessPlan.id, status: 'success', strategyType: 'gradual', weeklyProgression: true }),
        reasoning: 'User needs gradual progression to build endurance safely. Starting with 3 sessions per week at low intensity allows adaptation while minimizing injury risk.',
        executionTime: 245.5,
      },
    }),
    prisma.agentLog.create({
      data: {
        agentType: 'monitoring',
        action: 'track_progress',
        input: JSON.stringify({ userId: user.id, period: 'last_2_weeks' }),
        output: JSON.stringify({ completionRate: 0.8, trend: 'improving', avgHeartRate: 150 }),
        reasoning: 'User has completed 8/10 recent sessions. Performance metrics show consistent improvement. Heart rate data indicates good cardiovascular adaptation.',
        executionTime: 120.3,
      },
    }),
    prisma.agentLog.create({
      data: {
        agentType: 'adaptation',
        action: 'suggest_progression',
        input: JSON.stringify({ completionRate: 0.8, currentWeek: 2 }),
        output: JSON.stringify({ action: 'progress_to_week3', newIntensity: 'medium', trigger: 'progression_rule_met' }),
        reasoning: 'Based on 80%+ completion rate over 2 weeks, user is ready for Week 3 progression. Adding 4th day and increasing to medium intensity.',
        executionTime: 180.7,
      },
    }),
  ]);

  console.log(`✓ Created ${agentLogs.length} agent logs showing AI reasoning`);

  console.log('\n✅ Database seeded successfully!');
  console.log('\n📊 Demo credentials:');
  console.log('   Email: demo@adaptivewellness.ai');
  console.log('   Password: demo123');
  console.log('\n🎯 Created goals:');
  console.log('   - Fitness: Run 5 kilometers consistently');
  console.log('   - Mental Health: Daily meditation practice');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
