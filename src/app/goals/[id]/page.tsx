'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Brain, Target, Calendar, TrendingUp, ArrowLeft, Activity, CheckCircle, AlertCircle } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  baselineValue: number;
  targetValue: number;
  currentValue: number;
  unit: string;
  allowedMisses: number;
  recoveryStrategy: string;
  fallbackGoal: string;
  createdAt: string;
  plans: any[];
}

export default function GoalDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const goalId = params.id as string;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated' && goalId) {
      fetchGoal();
    }
  }, [status, goalId]);

  const fetchGoal = async () => {
    try {
      const response = await fetch('/api/goals');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }

      const foundGoal = data.goals.find((g: Goal) => g.id === goalId);
      if (!foundGoal) {
        throw new Error('Goal not found');
      }

      setGoal(foundGoal);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-primary-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading goal...</p>
        </div>
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 text-xl mb-4">{error || 'Goal not found'}</p>
          <Link href="/goals" className="text-primary-600 hover:underline">
            Back to Goals
          </Link>
        </div>
      </div>
    );
  }

  const progress = goal.targetValue > 0 
    ? Math.round((goal.currentValue / goal.targetValue) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/goals"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Goals
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">{goal.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              goal.status === 'active' ? 'bg-green-100 text-green-800' :
              goal.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
              goal.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
            </span>
            <span className="text-sm text-gray-500">
              Created {new Date(goal.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Progress</h2>
            <span className="text-3xl font-bold text-primary-600">{progress}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className="bg-gradient-to-r from-primary-600 to-purple-600 h-4 rounded-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Baseline</p>
              <p className="text-lg font-semibold text-gray-900">
                {goal.baselineValue} {goal.unit}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current</p>
              <p className="text-lg font-semibold text-primary-600">
                {goal.currentValue} {goal.unit}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Target</p>
              <p className="text-lg font-semibold text-gray-900">
                {goal.targetValue} {goal.unit}
              </p>
            </div>
          </div>
        </div>

        {/* SMART Goal Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">SMART Goal Framework</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Specific</h3>
              </div>
              <p className="text-gray-700 ml-7">{goal.specific}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Measurable</h3>
              </div>
              <p className="text-gray-700 ml-7">{goal.measurable}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Achievable</h3>
              </div>
              <p className="text-gray-700 ml-7">{goal.achievable}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-gray-900">Relevant</h3>
              </div>
              <p className="text-gray-700 ml-7">{goal.relevant}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-gray-900">Time-Bound</h3>
              </div>
              <p className="text-gray-700 ml-7">{goal.timeBound}</p>
            </div>
          </div>
        </div>

        {/* Failure Tolerance & Recovery */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Failure Tolerance Strategy</h2>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-700">Allowed Consecutive Misses</p>
              <p className="text-lg text-gray-900">{goal.allowedMisses} sessions per week</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700">Recovery Strategy</p>
              <p className="text-gray-900">{goal.recoveryStrategy}</p>
            </div>

            {goal.fallbackGoal && (
              <div>
                <p className="text-sm font-semibold text-gray-700">Fallback Goal</p>
                <p className="text-gray-900">{goal.fallbackGoal}</p>
              </div>
            )}
          </div>
        </div>

        {/* Plans */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">AI-Generated Plans</h2>
            {goal.plans.length === 0 && (
              <Link
                href={`/plans/new?goalId=${goal.id}`}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Generate Plan
              </Link>
            )}
          </div>

          <p className="text-gray-600 mb-6">
            The Planning Agent has created a personalized, adaptive plan for your goal. This plan automatically adjusts based on your performance, 
            ensuring you stay challenged but not overwhelmed. Each plan includes smart progression rules, safety nets for difficult periods, 
            and recovery strategies to keep you on track.
          </p>

          {goal.plans.length > 0 ? (
            <div className="space-y-6">
              {goal.plans.map((plan) => {
                // Parse JSON fields
                const activities = JSON.parse(plan.activities || '[]');
                const fallbackPlan = plan.fallbackPlan ? JSON.parse(plan.fallbackPlan) : null;
                const recoveryPlan = plan.recoveryPlan ? JSON.parse(plan.recoveryPlan) : null;
                const progressionRules = JSON.parse(plan.progressionRules || '[]');
                const regressionRules = JSON.parse(plan.regressionRules || '[]');

                return (
                  <div key={plan.id} className="border-2 border-primary-200 rounded-xl">
                    {/* Plan Header */}
                    <div className="bg-gradient-to-r from-primary-50 to-purple-50 p-6 rounded-t-xl border-b border-primary-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.title}</h3>
                          <p className="text-gray-600">{plan.description}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                          plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                        </span>
                      </div>

                      <div className="bg-white rounded-lg p-4 mt-4">
                        <p className="text-sm text-gray-600 mb-3">
                          <strong>How demanding is this plan?</strong> The AI calculates three load scores to ensure the plan fits your life:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="border border-gray-200 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Strategy</p>
                            <p className="font-semibold text-gray-900 capitalize">{plan.strategyType}</p>
                            <p className="text-xs text-gray-500 mt-1">Approach type</p>
                          </div>
                          <div className="border border-gray-200 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Physical Load</p>
                            <p className="font-semibold text-gray-900">{plan.physicalLoad}/10</p>
                            <p className="text-xs text-gray-500 mt-1">Body demand</p>
                          </div>
                          <div className="border border-gray-200 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Cognitive Load</p>
                            <p className="font-semibold text-gray-900">{plan.cognitiveLoad}/10</p>
                            <p className="text-xs text-gray-500 mt-1">Mental effort</p>
                          </div>
                          <div className="border border-gray-200 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Sustainability</p>
                            <p className="font-semibold text-green-600">{plan.sustainabilityScore}/10</p>
                            <p className="text-xs text-gray-500 mt-1">Long-term fit</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Weekly Activities */}
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary-600" />
                        Weekly Schedule
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        This schedule shows your week-by-week progression. The AI has carefully designed each week to build on the previous one, 
                        gradually increasing difficulty to help you reach your goal safely and sustainably.
                      </p>
                      
                      <div className="space-y-4">
                        {activities.map((weekPlan: any, idx: number) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="px-3 py-1 bg-primary-600 text-white rounded-full text-sm font-bold">
                                Week {weekPlan.week}
                              </span>
                              <span className="text-sm text-gray-600">
                                {weekPlan.days?.length || 0} sessions this week
                              </span>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-3">
                              <div className="bg-white rounded p-3">
                                <p className="text-xs text-gray-500 mb-1">📅 Days</p>
                                <p className="font-medium text-gray-900">
                                  {weekPlan.days?.join(', ') || 'Not specified'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">When to do the activity</p>
                              </div>
                              <div className="bg-white rounded p-3">
                                <p className="text-xs text-gray-500 mb-1">🎯 Activity</p>
                                <p className="font-medium text-gray-900">{weekPlan.activity}</p>
                                <p className="text-xs text-gray-500 mt-1">What you&apos;ll be doing</p>
                              </div>
                              <div className="bg-white rounded p-3">
                                <p className="text-xs text-gray-500 mb-1">⏱️ Duration</p>
                                <p className="font-medium text-gray-900">{weekPlan.duration} minutes</p>
                                <p className="text-xs text-gray-500 mt-1">How long each session</p>
                              </div>
                              <div className="bg-white rounded p-3">
                                <p className="text-xs text-gray-500 mb-1">💪 Intensity</p>
                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                  weekPlan.intensity === 'low' || weekPlan.intensity === 'very-low' ? 'bg-green-100 text-green-800' :
                                  weekPlan.intensity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  weekPlan.intensity === 'high' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {weekPlan.intensity?.toUpperCase().replace('-', ' ') || 'N/A'}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">How hard to push yourself</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Progression Rules */}
                      {progressionRules.length > 0 && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h5 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            When to Increase Difficulty
                          </h5>
                          <p className="text-sm text-green-700 mb-3">
                            The AI Monitoring Agent tracks your performance continuously. When you&apos;re ready for more challenge, 
                            the plan automatically progresses based on these smart triggers:
                          </p>
                          <ul className="space-y-1">
                            {progressionRules.map((rule: string, idx: number) => (
                              <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">✓</span>
                                {rule}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Regression Rules */}
                      {regressionRules.length > 0 && (
                        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                          <h5 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            When to Reduce Difficulty
                          </h5>
                          <p className="text-sm text-orange-700 mb-3">
                            Your wellbeing is our priority. The AI Adaptation Agent recognizes when you&apos;re struggling and automatically 
                            scales back to prevent burnout. These protective rules keep your plan sustainable:
                          </p>
                          <ul className="space-y-1">
                            {regressionRules.map((rule: string, idx: number) => (
                              <li key={idx} className="text-sm text-orange-800 flex items-start gap-2">
                                <span className="text-orange-600 mt-0.5">⚠</span>
                                {rule}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Fallback Plan */}
                      {fallbackPlan && fallbackPlan.length > 0 && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <h5 className="font-semibold text-yellow-900 mb-2">🛡️ Fallback Plan (If Struggling)</h5>
                          <p className="text-sm text-yellow-700 mb-3">
                            If the main plan becomes too challenging, the AI will automatically switch you to this gentler alternative. 
                            This ensures you keep making progress without feeling overwhelmed. You can always return to the main plan when you&apos;re ready.
                          </p>
                          <div className="space-y-2">
                            {fallbackPlan.map((fb: any, idx: number) => (
                              <div key={idx} className="text-sm bg-white rounded-lg p-3 border border-yellow-300">
                                <div className="flex items-start gap-2">
                                  <span className="px-2 py-1 bg-yellow-600 text-white rounded text-xs font-bold flex-shrink-0">
                                    Week {fb.week}
                                  </span>
                                  <div className="flex-1">
                                    <p className="font-medium text-yellow-900">
                                      {fb.activity} - {fb.duration} minutes
                                    </p>
                                    <p className="text-xs text-yellow-700 mt-1">
                                      📅 {fb.days?.join(', ')} • 💪 {fb.intensity} intensity
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recovery Plan */}
                      {recoveryPlan && recoveryPlan.length > 0 && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h5 className="font-semibold text-blue-900 mb-2">🔄 Recovery Plan (After Missed Weeks)</h5>
                          <p className="text-sm text-blue-700 mb-3">
                            Life happens, and that&apos;s okay! If you miss multiple sessions or take a break, the AI has a gentle restart plan ready. 
                            This helps you ease back in without injury or discouragement, rebuilding your momentum step by step.
                          </p>
                          <div className="space-y-2">
                            {recoveryPlan.map((rp: any, idx: number) => (
                              <div key={idx} className="text-sm bg-white rounded-lg p-3 border border-blue-300">
                                <div className="flex items-start gap-2">
                                  <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-bold flex-shrink-0">
                                    Restart
                                  </span>
                                  <div className="flex-1">
                                    <p className="font-medium text-blue-900">
                                      {rp.activity} - {rp.duration} minutes
                                    </p>
                                    <p className="text-xs text-blue-700 mt-1">
                                      📅 {rp.days?.join(', ')} • 💪 {rp.intensity} intensity
                                    </p>
                                    {rp.note && (
                                      <p className="text-xs text-blue-600 mt-2 italic bg-blue-50 p-2 rounded">
                                        💡 {rp.note}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p>No plans yet. Generate an AI-powered plan to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
