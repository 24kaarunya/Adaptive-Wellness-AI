'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Brain, TrendingUp, Lightbulb, ArrowLeft, BarChart3, Target, Activity, AlertCircle } from 'lucide-react';

interface Reflection {
  id: string;
  createdAt: string;
  weekNumber: number;
  intendedBehavior: string;
  actualBehavior: string;
  successFactors: string[];
  failureFactors: string[];
  externalFactors: string[];
  patterns: string[];
  rootCauses: string[];
  lessonsLearned: string[];
  recommendations: string[];
  confidenceScore: number;
}

interface Analytics {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  totalActivities: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  averageEffort: number;
  averageMood: number;
  averageEnergy: number;
}

export default function InsightsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      // Fetch analytics and reflections
      const [analyticsRes, reflectionsRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/reflections'),
      ]);

      if (!analyticsRes.ok || !reflectionsRes.ok) {
        throw new Error('Failed to fetch insights data');
      }

      const analyticsData = await analyticsRes.json();
      const reflectionsData = await reflectionsRes.json();

      setAnalytics(analyticsData.analytics || getDefaultAnalytics());
      setReflections(reflectionsData.reflections || []);
    } catch (err: any) {
      setError(err.message);
      // Set default analytics on error
      setAnalytics(getDefaultAnalytics());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultAnalytics = (): Analytics => ({
    totalGoals: 0,
    activeGoals: 0,
    completedGoals: 0,
    totalActivities: 0,
    completionRate: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageEffort: 0,
    averageMood: 0,
    averageEnergy: 0,
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-primary-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Generating insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI Insights & Analytics</h1>
          </div>
          <p className="text-gray-600">
            Deep analysis of your wellness journey powered by autonomous reflection agents
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <div>
              <p className="font-semibold">Limited Data Available</p>
              <p className="text-sm">
                Continue tracking activities and goals to generate AI-powered insights
              </p>
            </div>
          </div>
        )}

        {/* Analytics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{analytics?.totalGoals || 0}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Goals</p>
            <p className="text-sm text-gray-500 mt-1">
              {analytics?.activeGoals || 0} active, {analytics?.completedGoals || 0} completed
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">
                {analytics?.completionRate || 0}%
              </span>
            </div>
            <p className="text-gray-600 font-medium">Completion Rate</p>
            <p className="text-sm text-gray-500 mt-1">
              {analytics?.totalActivities || 0} activities logged
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <span className="text-3xl font-bold text-gray-900">
                {analytics?.currentStreak || 0}
              </span>
            </div>
            <p className="text-gray-600 font-medium">Current Streak</p>
            <p className="text-sm text-gray-500 mt-1">
              Longest: {analytics?.longestStreak || 0} days
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-bold text-gray-900">
                {analytics?.averageMood ? analytics.averageMood.toFixed(1) : '0.0'}
              </span>
            </div>
            <p className="text-gray-600 font-medium">Avg Mood</p>
            <p className="text-sm text-gray-500 mt-1">
              Energy: {analytics?.averageEnergy ? analytics.averageEnergy.toFixed(1) : '0.0'}/10
            </p>
          </div>
        </div>

        {/* AI Reflections */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary-600" />
            AI Weekly Reflections
          </h2>

          {reflections.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Reflections Yet</h3>
              <p className="text-gray-600 mb-4">
                The Reflection Agent performs weekly retrospective analysis of your wellness journey.
                Continue tracking activities to generate insights.
              </p>
              <div className="max-w-md mx-auto text-left space-y-2 text-sm text-gray-600">
                <p>• Analyzes intended vs actual behavior patterns</p>
                <p>• Identifies success and failure factors</p>
                <p>• Extracts lessons learned for future planning</p>
                <p>• Updates reasoning heuristics autonomously</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {reflections.map((reflection) => (
                <div
                  key={reflection.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                >
                  {/* Reflection Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Week {reflection.weekNumber} Reflection
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(reflection.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Confidence</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {Math.round(reflection.confidenceScore * 100)}%
                      </p>
                    </div>
                  </div>

                  {/* Success Factors */}
                  {reflection.successFactors.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        ✓ What Worked Well
                      </h4>
                      <ul className="space-y-1">
                        {reflection.successFactors.map((factor, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">•</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Challenges */}
                  {reflection.failureFactors.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                        ⚠ Challenges Encountered
                      </h4>
                      <ul className="space-y-1">
                        {reflection.failureFactors.map((factor, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-orange-600 mt-0.5">•</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Patterns Detected */}
                  {reflection.patterns.length > 0 && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">🔍 Patterns Detected</h4>
                      <ul className="space-y-1">
                        {reflection.patterns.map((pattern, idx) => (
                          <li key={idx} className="text-sm text-blue-800">
                            {pattern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Lessons Learned */}
                  {reflection.lessonsLearned.length > 0 && (
                    <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">💡 Lessons Learned</h4>
                      <ul className="space-y-1">
                        {reflection.lessonsLearned.map((lesson, idx) => (
                          <li key={idx} className="text-sm text-purple-800">
                            {lesson}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {reflection.recommendations.length > 0 && (
                    <div className="p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg border border-primary-200">
                      <h4 className="font-semibold text-primary-900 mb-2">
                        🎯 AI Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {reflection.recommendations.map((rec, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-primary-800 flex items-start gap-2"
                          >
                            <span className="text-primary-600 font-bold mt-0.5">{idx + 1}.</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <Brain className="w-8 h-8 text-primary-600 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Autonomous Reflection & Learning
              </h3>
              <p className="text-gray-700 mb-4">
                Our Reflection Agent performs weekly retrospective analysis of your wellness journey,
                comparing intended vs actual behavior, identifying root causes of success and failure,
                and autonomously updating its reasoning heuristics for better future planning.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What Gets Analyzed:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Adherence patterns and deviation signals</li>
                    <li>• External factors influencing outcomes</li>
                    <li>• Success/failure root cause analysis</li>
                    <li>• Long-term behavioral trajectories</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How It Helps You:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Personalized lessons learned</li>
                    <li>• Actionable recommendations</li>
                    <li>• Improved future plan quality</li>
                    <li>• Self-improving AI over time</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
