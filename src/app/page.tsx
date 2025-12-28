import Link from 'next/link';
import { Brain, Target, TrendingUp, Shield, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Adaptive Wellness AI</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/auth/signin"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Next-Generation Agentic AI for Wellness
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your AI Partner for
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Sustainable Wellness
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A self-reflective agentic system that reasons about your goals, learns from failures,
            and adapts autonomously—optimizing for consistency over intensity.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-lg font-semibold shadow-lg"
            >
              Start Your Journey
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition text-lg font-semibold"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Adaptive Wellness AI?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unlike traditional fitness apps, we don't just track—we think, adapt, and recover with you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Cognitive Cycle</h2>
            <p className="text-lg opacity-90">
              Our AI operates through continuous observation, reasoning, and adaptation
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {cognitiveSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">{index + 1}</span>
                </div>
                <h4 className="font-semibold mb-1">{step.title}</h4>
                <p className="text-sm opacity-80">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-12 border border-primary-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Build Sustainable Habits?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join the future of AI-powered wellness. Start your journey today.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-lg font-semibold shadow-lg"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 Adaptive Wellness AI. Built for sustainable human wellness.</p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <Brain className="w-6 h-6 text-primary-600" />,
    title: 'Agentic Reasoning',
    description: 'AI agents that autonomously plan, monitor, and adapt your wellness journey.',
  },
  {
    icon: <Target className="w-6 h-6 text-primary-600" />,
    title: 'Failure-Tolerant Goals',
    description: 'Goals designed to survive setbacks, not collapse after them.',
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-primary-600" />,
    title: 'Trajectory Analysis',
    description: 'Track behavioral patterns over time, not just isolated metrics.',
  },
  {
    icon: <Sparkles className="w-6 h-6 text-primary-600" />,
    title: 'Autonomous Adaptation',
    description: 'The system replans automatically when life gets in the way.',
  },
  {
    icon: <Brain className="w-6 h-6 text-primary-600" />,
    title: 'Self-Reflection',
    description: 'AI that learns from your successes and failures to improve over time.',
  },
  {
    icon: <Shield className="w-6 h-6 text-primary-600" />,
    title: 'Transparent & Ethical',
    description: 'Every decision explained. Non-clinical, wellness-focused only.',
  },
];

const cognitiveSteps = [
  { title: 'Observe', description: 'Monitor behavior' },
  { title: 'Reason', description: 'Analyze patterns' },
  { title: 'Plan', description: 'Adapt strategy' },
  { title: 'Act', description: 'Implement changes' },
  { title: 'Reflect', description: 'Learn & improve' },
];
