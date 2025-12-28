'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Brain,
  Target,
  TrendingUp,
  Calendar,
  Sparkles,
  LogOut,
  Plus,
  Activity,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      const [profileRes, goalsRes, monitoringRes] = await Promise.all([
        fetch('/api/wellness-profile'),
        fetch('/api/goals'),
        fetch('/api/monitoring?days=7'),
      ]);

      const profileData = await profileRes.json();
      const goalsData = await goalsRes.json();
      const monitoringData = await monitoringRes.json();

      setProfile(profileData.profile);
      setGoals(goalsData.goals || []);
      setRecentActivity(monitoringData.data || []);

      // Redirect to onboarding if no profile
      if (!profileData.profile) {
        router.push('/onboarding');
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-primary-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading your wellness dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Adaptive Wellness AI</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-gray-900 font-semibold">
                Dashboard
              </Link>
              <Link href="/goals" className="text-gray-600 hover:text-gray-900">
                Goals
              </Link>
              <Link href="/monitoring" className="text-gray-600 hover:text-gray-900">
                Track Activity
              </Link>
              <Link href="/insights" className="text-gray-600 hover:text-gray-900">
                Insights
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                <p className="text-xs text-gray-500">{session?.user?.email}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-2 text-gray-600 hover:text-gray-900 transition"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session?.user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Your AI wellness partner is monitoring your progress and ready to adapt with you.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Active Goals</span>
              <Target className="w-5 h-5 text-primary-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {goals.filter((g) => g.status === 'active').length}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Current Streak</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {recentActivity[0]?.streakCount || 0} days
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">This Week</span>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {recentActivity.filter((a) => a.completed).length}/7
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">AI Adaptations</span>
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">2</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Active Goals */}
          <div className="lg:col-span-2 space-y-6">
            {/* Goals Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary-600" />
                  Your Active Goals
                </h2>
                <Link
                  href="/goals/new"
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  New Goal
                </Link>
              </div>

              {goals.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No goals yet. Let's create your first one!</p>
                  <Link
                    href="/goals/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                  >
                    <Plus className="w-5 h-5" />
                    Create Your First Goal
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                        </div>
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                          {goal.type}
                        </span>
                      </div>

                      {goal.targetValue && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="text-gray-900 font-medium">
                              {goal.currentValue || 0} / {goal.targetValue} {goal.unit}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary-600 to-purple-600"
                              style={{
                                width: `${Math.min(
                                  ((goal.currentValue || 0) / goal.targetValue) * 100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary-600" />
                Recent Activity
              </h2>

              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No activity logged yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activity.completed ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{activity.activityType}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {activity.value && (
                        <span className="text-sm font-medium text-gray-700">
                          {activity.value} {activity.unit}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - AI Insights */}
          <div className="space-y-6">
            {/* AI Agent Activity */}
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-6 border border-primary-200">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-6 h-6 text-primary-600" />
                <h3 className="font-bold text-gray-900">AI Agent Activity</h3>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg border border-primary-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Monitoring Agent
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Analyzed your progress. Trajectory: <strong>Stable</strong>
                  </p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-primary-100">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Reflection Agent
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Weekly reflection complete. 3 insights generated.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href="/monitoring"
                  className="block p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-primary-600" />
                    <span className="font-medium text-gray-900">Log Activity</span>
                  </div>
                </Link>
                <Link
                  href="/insights"
                  className="block p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition"
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary-600" />
                    <span className="font-medium text-gray-900">View Insights</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Wellness Profile Summary */}
            {profile && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Your Profile</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Time:</span>
                    <span className="font-medium">{profile.availableTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Energy Level:</span>
                    <span className="font-medium capitalize">{profile.energyLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Motivation:</span>
                    <span className="font-medium capitalize">{profile.motivationStyle}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
