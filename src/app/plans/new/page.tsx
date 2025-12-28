'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Brain, Calendar, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  unit: string;
}

export default function NewPlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const goalId = searchParams.get('goalId');

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

  const handleGeneratePlan = async () => {
    if (!goal) return;

    setGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId: goal.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate plan');
      }

      setSuccess(true);
      
      // Redirect to goals page after 2 seconds
      setTimeout(() => {
        router.push('/goals');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to generate plan');
    } finally {
      setGenerating(false);
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

  if (!goalId || !goal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Goal not found</p>
          <Link href="/goals" className="text-primary-600 hover:underline">
            Back to Goals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
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
            <Calendar className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Generate AI Plan</h1>
          </div>
          <p className="text-gray-600">
            Let our Planning Agent create a personalized, adaptive plan for your goal.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3 text-green-900">
              <CheckCircle className="w-6 h-6" />
              <div>
                <p className="font-semibold">Plan Generated Successfully!</p>
                <p className="text-sm text-green-700">Redirecting to your goals...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Goal Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Goal</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Title</p>
              <p className="text-lg font-semibold text-gray-900">{goal.title}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-gray-900">{goal.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Target</p>
                <p className="text-lg font-semibold text-primary-600">
                  {goal.targetValue} {goal.unit}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Planning Info */}
        <div className="bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <Brain className="w-8 h-8 text-primary-600 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                What the Planning Agent Will Create
              </h3>
              <div className="space-y-2 text-gray-700">
                <p>✓ Progressive 4-12 week plan tailored to your constraints</p>
                <p>✓ Weekly activities with increasing difficulty</p>
                <p>✓ Fallback plan for when you're struggling</p>
                <p>✓ Recovery strategy after missed sessions</p>
                <p>✓ Load estimation (physical & cognitive)</p>
                <p>✓ Sustainability scoring</p>
              </div>
              <p className="mt-4 text-sm text-gray-600 italic">
                The AI considers your wellness profile, past patterns, and goal constraints
                to create a plan optimized for long-term adherence, not short-term intensity.
              </p>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGeneratePlan}
          disabled={generating || success}
          className={`w-full py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-3 ${
            generating || success
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:from-primary-700 hover:to-purple-700'
          }`}
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating AI Plan...
            </>
          ) : success ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Plan Created!
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              Generate Plan with AI
            </>
          )}
        </button>

        {generating && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 text-center">
              <Brain className="w-4 h-4 inline mr-2 animate-pulse" />
              Planning Agent is analyzing your goal and creating an adaptive strategy...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
