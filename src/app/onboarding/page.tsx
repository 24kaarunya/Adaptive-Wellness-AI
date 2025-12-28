'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Brain, ArrowRight, Clock, Zap, Target, TrendingUp, Shield } from 'lucide-react';

const STEPS = [
  'Welcome',
  'Primary Goals',
  'Time & Energy',
  'Motivation Style',
  'Planning Preferences',
  'Completion',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    primaryIntent: '',
    secondaryIntents: [] as string[],
    availableTime: 30,
    energyLevel: 'medium' as 'low' | 'medium' | 'high',
    currentRoutine: '',
    barriers: [] as string[],
    motivationStyle: 'health' as 'achievement' | 'social' | 'health' | 'appearance',
    preferredActivities: [] as string[],
    adherenceRisk: 'medium' as 'low' | 'medium' | 'high',
    historicalFailures: [] as string[],
    planningPreference: 'flexible' as 'structured' | 'flexible' | 'minimal',
    feedbackFrequency: 'weekly' as 'daily' | 'weekly' | 'as-needed',
    preferExplanations: true,
  });

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/wellness-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleArrayItem = (field: keyof typeof formData, value: string) => {
    const array = formData[field] as string[];
    if (array.includes(value)) {
      setFormData({
        ...formData,
        [field]: array.filter((item) => item !== value),
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...array, value],
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Adaptive Wellness AI</span>
          </div>
          <div className="text-sm text-gray-600">
            Step {currentStep + 1} of {STEPS.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-600 to-purple-600 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="max-w-2xl mx-auto">
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 animate-slide-up">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Welcome, {session?.user?.name}!
                </h2>
                <p className="text-lg text-gray-600">
                  Let's build your Contextual Wellness Profile together.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600 inline mr-2" />
                  <strong className="text-blue-900">Non-Clinical Scope:</strong>
                  <p className="text-sm text-blue-800 mt-1">
                    This system is designed for fitness and lifestyle wellness only.
                    We do not provide medical diagnosis or treatment.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Target className="w-5 h-5 text-primary-600 mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-1">Goal-Oriented</h4>
                    <p className="text-sm text-gray-600">
                      Set sustainable, failure-tolerant goals
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-primary-600 mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-1">Adaptive</h4>
                    <p className="text-sm text-gray-600">
                      AI that learns and adapts with you
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(1)}
                className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold flex items-center justify-center gap-2"
              >
                Let's Begin
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 1: Primary Goals */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 animate-slide-up">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                What's your primary wellness goal?
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your main intention (be as vague or specific as you like)
                  </label>
                  <textarea
                    value={formData.primaryIntent}
                    onChange={(e) => setFormData({ ...formData, primaryIntent: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={4}
                    placeholder="e.g., 'I want to feel healthier', 'Build consistent exercise habit', 'Improve my energy levels'..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Any secondary goals? (optional, select all that apply)
                  </label>
                  <div className="grid md:grid-cols-2 gap-2">
                    {['Weight loss', 'Muscle gain', 'Better sleep', 'Stress reduction', 'More energy', 'Flexibility'].map(
                      (intent) => (
                        <button
                          key={intent}
                          onClick={() => toggleArrayItem('secondaryIntents', intent)}
                          className={`p-3 border rounded-lg text-left transition ${
                            formData.secondaryIntents.includes(intent)
                              ? 'border-primary-600 bg-primary-50 text-primary-900'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {intent}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.primaryIntent}
                  className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Time & Energy */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 animate-slide-up">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Tell us about your time and energy
              </h2>

              <div className="space-y-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    How much time can you realistically dedicate per day?
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={formData.availableTime}
                    onChange={(e) =>
                      setFormData({ ...formData, availableTime: parseInt(e.target.value) })
                    }
                    className="w-full"
                  />
                  <div className="text-center mt-2">
                    <span className="text-2xl font-bold text-primary-600">
                      {formData.availableTime}
                    </span>
                    <span className="text-gray-600"> minutes/day</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    What's your typical energy level?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['low', 'medium', 'high'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setFormData({ ...formData, energyLevel: level })}
                        className={`p-4 border-2 rounded-lg transition capitalize ${
                          formData.energyLevel === level
                            ? 'border-primary-600 bg-primary-50 text-primary-900'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your current routine
                  </label>
                  <textarea
                    value={formData.currentRoutine}
                    onChange={(e) => setFormData({ ...formData, currentRoutine: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    placeholder="e.g., 'Sedentary job, walk occasionally', 'Gym 2x/week but inconsistent'..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are your main barriers? (select all that apply)
                  </label>
                  <div className="grid md:grid-cols-2 gap-2">
                    {['Time', 'Motivation', 'Energy', 'Injury/Pain', 'No routine', 'Don\'t know where to start'].map(
                      (barrier) => (
                        <button
                          key={barrier}
                          onClick={() => toggleArrayItem('barriers', barrier)}
                          className={`p-3 border rounded-lg text-left transition ${
                            formData.barriers.includes(barrier)
                              ? 'border-primary-600 bg-primary-50 text-primary-900'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {barrier}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold flex items-center justify-center gap-2"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Additional steps would follow similar patterns... */}
          {/* For brevity, I'll add the final step */}

          {/* Step 5: Completion */}
          {currentStep === 5 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 animate-slide-up text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Profile Complete!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our AI agents are now ready to create your personalized wellness journey.
              </p>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-semibold text-lg disabled:opacity-50"
              >
                {loading ? 'Setting up your dashboard...' : 'Go to Dashboard'}
              </button>
            </div>
          )}

          {/* Simplified middle steps - jump to completion for demo */}
          {currentStep >= 3 && currentStep < 5 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 animate-slide-up">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {STEPS[currentStep]}
              </h2>
              <p className="text-gray-600 mb-6">
                Additional preference collection steps would go here...
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold flex items-center justify-center gap-2"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
