'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Brain, Target, Plus, TrendingUp, Calendar, ArrowLeft, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: string;
  priority: string;
  timeBound: string;
  createdAt: string;
  deadline: string;
  plans?: any[];
}

export default function GoalsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchGoals();
    }
  }, [status]);

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch goals');
      }

      setGoals(data.goals || []);
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
          <p className="text-gray-600">Loading your goals...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <TrendingUp className="w-4 h-4" />;
      case 'paused':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-red-500';
      case 'medium':
        return 'border-l-4 border-yellow-500';
      case 'low':
        return 'border-l-4 border-green-500';
      default:
        return 'border-l-4 border-gray-300';
    }
  };

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
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-8 h-8 text-primary-600" />
                <h1 className="text-3xl font-bold text-gray-900">My Wellness Goals</h1>
              </div>
              <p className="text-gray-600">
                AI-powered goals designed for sustainable progress and failure recovery
              </p>
            </div>
            <Link
              href="/goals/new"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Goal
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Goals Yet</h2>
              <p className="text-gray-600 mb-6">
                Create your first wellness goal and let our AI agents build a personalized,
                adaptive plan for you.
              </p>
              <Link
                href="/goals/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                <Plus className="w-5 h-5" />
                Create Your First Goal
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className={`bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition overflow-hidden ${getPriorityColor(
                  goal.priority
                )}`}
              >
                <div className="p-6">
                  {/* Goal Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(
                            goal.status
                          )}`}
                        >
                          {getStatusIcon(goal.status)}
                          {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                          {goal.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{goal.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{goal.description}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            (goal.currentValue / goal.targetValue) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Priority</p>
                      <p className="font-semibold text-gray-900 capitalize">{goal.priority}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Deadline</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Active Plans */}
                  {goal.plans && goal.plans.length > 0 && (
                    <div className="mb-4 p-3 bg-primary-50 rounded-lg">
                      <p className="text-sm text-primary-900 font-semibold mb-1">
                        Active Plan
                      </p>
                      <p className="text-xs text-primary-700">
                        {goal.plans[0].title || 'AI-Generated Plan'}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link
                      href={`/goals/${goal.id}`}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-center font-semibold"
                    >
                      View Details
                    </Link>
                    {goal.status === 'active' && !goal.plans?.length && (
                      <button
                        onClick={() => router.push(`/plans/new?goalId=${goal.id}`)}
                        className="flex-1 px-4 py-2 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition font-semibold"
                      >
                        Generate Plan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Info */}
        {goals.length > 0 && (
          <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200 rounded-lg">
            <div className="flex items-start gap-4">
              <Brain className="w-6 h-6 text-primary-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Goal Management</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Our autonomous agents continuously monitor your progress, detect patterns, and
                  adapt your plans in real-time. Goals are designed to survive failure, not
                  collapse after setbacks.
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Failure-tolerant design</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Autonomous adaptation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Transparent reasoning</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
