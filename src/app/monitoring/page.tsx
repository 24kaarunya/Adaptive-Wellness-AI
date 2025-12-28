'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Brain, Activity, Plus, ArrowLeft, Calendar, TrendingUp, Smile, Zap,
  Heart, Footprints, Bed, Droplet, Flame, Weight, Clock, Target, Play
} from 'lucide-react';
import LiveActivityTracker from '@/components/LiveActivityTracker';

interface MonitoringEntry {
  id: string;
  date: string;
  activityCompleted: boolean;
  activityType?: string;
  duration?: number;
  effort?: number;
  mood?: number;
  energy?: number;
  notes?: string;
}

interface DailySummary {
  steps: number;
  calories: number;
  water: number;
  sleep: number;
  activeMinutes: number;
  heartRate: number;
}

export default function MonitoringPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [entries, setEntries] = useState<MonitoringEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showLiveTracker, setShowLiveTracker] = useState(false);
  const [liveTrackingActivity, setLiveTrackingActivity] = useState('');
  const [selectedActivityType, setSelectedActivityType] = useState('');
  const [dailySummary, setDailySummary] = useState<DailySummary>({
    steps: 7234,
    calories: 1850,
    water: 6,
    sleep: 7.5,
    activeMinutes: 45,
    heartRate: 72,
  });
  const [formData, setFormData] = useState({
    activityCompleted: true,
    activityType: '',
    duration: '',
    effort: 5,
    mood: 5,
    energy: 5,
    notes: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchEntries();
    }
  }, [status]);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/monitoring?days=30');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch entries');
      }

      // Map the API response to our interface
      const mappedEntries = (data.data || []).map((item: any) => ({
        id: item.id,
        date: item.date,
        activityCompleted: item.completed,
        activityType: item.activityType,
        duration: item.value,
        effort: item.difficulty === 'easy' ? 3 : item.difficulty === 'moderate' ? 6 : 9,
        mood: item.enjoyment === 'low' ? 3 : item.enjoyment === 'medium' ? 6 : 9,
        energy: item.energyLevel === 'low' ? 3 : item.energyLevel === 'medium' ? 6 : 9,
        notes: item.notes,
      }));

      setEntries(mappedEntries);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (formData.activityCompleted && !formData.activityType) {
      setError('Please enter an activity type');
      return;
    }

    try {
      const response = await fetch('/api/monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityType: formData.activityType || 'General activity',
          completed: formData.activityCompleted,
          value: formData.duration ? parseInt(formData.duration) : undefined,
          unit: 'minutes',
          difficulty: formData.effort <= 3 ? 'easy' : formData.effort <= 7 ? 'moderate' : 'hard',
          energyLevel: formData.energy <= 3 ? 'low' : formData.energy <= 7 ? 'medium' : 'high',
          motivation: formData.mood <= 3 ? 'low' : formData.mood <= 7 ? 'medium' : 'high',
          enjoyment: formData.mood <= 3 ? 'low' : formData.mood <= 7 ? 'medium' : 'high',
          notes: formData.notes,
          date: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to log activity');
      }

      setShowForm(false);
      setFormData({
        activityCompleted: true,
        activityType: '',
        duration: '',
        effort: 5,
        mood: 5,
        energy: 5,
        notes: '',
      });
      fetchEntries();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-primary-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😊';
    if (mood >= 6) return '🙂';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😟';
    return '😢';
  };

  const getEnergyColor = (energy: number) => {
    if (energy >= 8) return 'text-green-600';
    if (energy >= 6) return 'text-yellow-600';
    if (energy >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const quickActivityTypes = [
    { name: 'Running', icon: Footprints, color: 'bg-blue-500', duration: 30 },
    { name: 'Walking', icon: Footprints, color: 'bg-green-500', duration: 20 },
    { name: 'Cycling', icon: Activity, color: 'bg-purple-500', duration: 45 },
    { name: 'Gym', icon: Flame, color: 'bg-red-500', duration: 60 },
    { name: 'Yoga', icon: Heart, color: 'bg-pink-500', duration: 30 },
    { name: 'Swimming', icon: Droplet, color: 'bg-cyan-500', duration: 40 },
  ];

  const handleQuickAdd = (activityType: string, duration: number) => {
    setFormData({
      ...formData,
      activityType,
      duration: duration.toString(),
    });
    setSelectedActivityType(activityType);
    setShowForm(true);
  };

  const handleStartLiveTracking = (activityType: string) => {
    setLiveTrackingActivity(activityType);
    setShowLiveTracker(true);
    setShowForm(false);
  };

  const handleLiveTrackingComplete = async (data: {
    duration: number;
    steps: number;
    distance: number;
    calories: number;
    route: Array<{ lat: number; lng: number; timestamp: number }>;
  }) => {
    try {
      // Save the tracked activity
      const response = await fetch('/api/monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityType: liveTrackingActivity,
          completed: true,
          value: Math.round(data.duration / 60), // Convert to minutes
          unit: 'minutes',
          energyLevel: data.duration > 1800 ? 'high' : 'medium',
          difficulty: data.duration > 2400 ? 'hard' : 'moderate',
          enjoyment: 'high',
          notes: `Steps: ${data.steps}, Distance: ${(data.distance / 1000).toFixed(2)}km, Calories: ${data.calories}`,
          date: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        // Update daily summary
        setDailySummary(prev => ({
          ...prev,
          steps: prev.steps + data.steps,
          calories: prev.calories + data.calories,
          activeMinutes: prev.activeMinutes + Math.round(data.duration / 60),
        }));

        setShowLiveTracker(false);
        setLiveTrackingActivity('');
        fetchEntries();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLiveTrackingCancel = () => {
    setShowLiveTracker(false);
    setLiveTrackingActivity('');
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
                <Activity className="w-8 h-8 text-primary-600" />
                <h1 className="text-3xl font-bold text-gray-900">Health Monitor</h1>
              </div>
              <p className="text-gray-600">
                Track your daily activities and health metrics
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Log Activity
            </button>
          </div>
        </div>

        {/* Today's Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {/* Steps */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Footprints className="w-5 h-5 text-blue-600" />
              <span className="text-xs text-gray-500">Steps</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{dailySummary.steps.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Goal: 10,000</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-blue-600 h-1.5 rounded-full" 
                style={{ width: `${Math.min((dailySummary.steps / 10000) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Calories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-600" />
              <span className="text-xs text-gray-500">Calories</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{dailySummary.calories}</p>
            <p className="text-xs text-gray-500 mt-1">Goal: 2,000</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-orange-600 h-1.5 rounded-full" 
                style={{ width: `${Math.min((dailySummary.calories / 2000) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Water */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplet className="w-5 h-5 text-cyan-600" />
              <span className="text-xs text-gray-500">Water</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{dailySummary.water}</p>
            <p className="text-xs text-gray-500 mt-1">Goal: 8 glasses</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-cyan-600 h-1.5 rounded-full" 
                style={{ width: `${Math.min((dailySummary.water / 8) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Sleep */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bed className="w-5 h-5 text-purple-600" />
              <span className="text-xs text-gray-500">Sleep</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{dailySummary.sleep}h</p>
            <p className="text-xs text-gray-500 mt-1">Goal: 8h</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-purple-600 h-1.5 rounded-full" 
                style={{ width: `${Math.min((dailySummary.sleep / 8) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Active Minutes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="text-xs text-gray-500">Active</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{dailySummary.activeMinutes}m</p>
            <p className="text-xs text-gray-500 mt-1">Goal: 60m</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-green-600 h-1.5 rounded-full" 
                style={{ width: `${Math.min((dailySummary.activeMinutes / 60) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Heart Rate */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-red-600" />
              <span className="text-xs text-gray-500">Heart Rate</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{dailySummary.heartRate}</p>
            <p className="text-xs text-gray-500 mt-1">bpm</p>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs text-green-600">Normal</span>
            </div>
          </div>
        </div>

        {/* Quick Add Activities */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Add Activity</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActivityTypes.map((activity) => (
              <div key={activity.name} className="relative group">
                <button
                  onClick={() => handleQuickAdd(activity.name, activity.duration)}
                  className="w-full flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:shadow-md transition"
                >
                  <div className={`${activity.color} w-12 h-12 rounded-full flex items-center justify-center text-white`}>
                    <activity.icon className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 text-sm">{activity.name}</p>
                    <p className="text-xs text-gray-500">{activity.duration}min</p>
                  </div>
                </button>
                {/* Live Tracking Button */}
                {['Running', 'Walking', 'Cycling'].includes(activity.name) && (
                  <button
                    onClick={() => handleStartLiveTracking(activity.name)}
                    className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600 transition opacity-0 group-hover:opacity-100"
                    title="Start Live Tracking"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            💡 Hover over Running, Walking, or Cycling and click <Play className="w-3 h-3 inline" /> for live GPS tracking
          </p>
        </div>

        {/* Live Activity Tracker Modal */}
        {showLiveTracker && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
              <LiveActivityTracker
                activityType={liveTrackingActivity}
                onComplete={handleLiveTrackingComplete}
                onCancel={handleLiveTrackingCancel}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Activity Form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Log Today's Activity</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Activity Completed */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.activityCompleted}
                    onChange={(e) =>
                      setFormData({ ...formData, activityCompleted: e.target.checked })
                    }
                    className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-gray-700 font-medium">
                    I completed my planned activity today
                  </span>
                </label>
              </div>

              {formData.activityCompleted && (
                <>
                  {/* Activity Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Type
                    </label>
                    <input
                      type="text"
                      value={formData.activityType}
                      onChange={(e) =>
                        setFormData({ ...formData, activityType: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Walking, Gym, Yoga"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="30"
                      min="1"
                    />
                  </div>

                  {/* Effort */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Effort Level: {formData.effort}/10
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.effort}
                      onChange={(e) =>
                        setFormData({ ...formData, effort: parseInt(e.target.value) })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Very Easy</span>
                      <span>Moderate</span>
                      <span>Very Hard</span>
                    </div>
                  </div>
                </>
              )}

              {/* Mood */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How do you feel? {getMoodEmoji(formData.mood)} ({formData.mood}/10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>😢 Terrible</span>
                  <span>😐 Okay</span>
                  <span>😊 Great</span>
                </div>
              </div>

              {/* Energy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Energy Level: {formData.energy}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.energy}
                  onChange={(e) =>
                    setFormData({ ...formData, energy: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Exhausted</span>
                  <span>Normal</span>
                  <span>Energized</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder="Any additional observations or feedback..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
                >
                  Save Activity Log
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Activity History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary-600" />
            Activity History (Last 30 Days)
          </h2>

          {entries.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No activity logged yet</p>
              <p className="text-sm text-gray-500">
                Start tracking your activities to enable AI pattern detection
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          entry.activityCompleted
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {entry.activityCompleted ? '✓' : '−'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {entry.activityCompleted
                            ? entry.activityType || 'Activity Completed'
                            : 'Skipped'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    {entry.duration && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        {entry.duration} min
                      </span>
                    )}
                  </div>

                  {entry.activityCompleted && (
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {entry.effort && (
                        <div>
                          <p className="text-gray-500 mb-1">Effort</p>
                          <p className="font-semibold flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-orange-600" />
                            {entry.effort}/10
                          </p>
                        </div>
                      )}
                      {entry.mood !== undefined && (
                        <div>
                          <p className="text-gray-500 mb-1">Mood</p>
                          <p className="font-semibold flex items-center gap-1">
                            <Smile className="w-4 h-4 text-purple-600" />
                            {getMoodEmoji(entry.mood)} {entry.mood}/10
                          </p>
                        </div>
                      )}
                      {entry.energy !== undefined && (
                        <div>
                          <p className="text-gray-500 mb-1">Energy</p>
                          <p className={`font-semibold flex items-center gap-1 ${getEnergyColor(entry.energy)}`}>
                            <Zap className="w-4 h-4" />
                            {entry.energy}/10
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {entry.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{entry.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Monitoring Info */}
        <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200 rounded-lg">
          <div className="flex items-start gap-4">
            <Brain className="w-6 h-6 text-primary-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Monitoring Agent</h3>
              <p className="text-sm text-gray-700 mb-3">
                Our Monitoring Agent analyzes your activity patterns, effort levels, mood, and
                energy to detect early signs of burnout, deviation, or success. When significant
                patterns emerge, the Adaptation Agent automatically adjusts your plan.
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Pattern detection across time</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Burnout prevention signals</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Streak & consistency tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Autonomous adaptation triggers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
