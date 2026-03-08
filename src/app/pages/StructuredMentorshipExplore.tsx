import { ArrowLeft, CheckCircle, TrendingUp, FileText, Target, BarChart } from 'lucide-react';
import { Link } from 'react-router';

export function StructuredMentorshipExplore() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link to="/#individuals" className="flex items-center gap-2 text-[#0A2463] hover:text-[#0D47A1] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to For Individuals</span>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Structured Mentorship</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Milestone-based mentorship with KPIs, progress tracking, and measurable outcomes.
          </p>
        </div>

        {/* Section A: Why Structured Mentorship */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Structured Mentorship</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">A clear pathway for career / leadership transitions</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Milestones create accountability and momentum</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Progress is measurable with KPIs and checkpoints</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Mentor pairing optimized with 5D compatibility</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Lower drift and faster execution</p>
            </div>
          </div>
        </div>

        {/* Section B: How it Works */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How it Works</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Goal Setup</h3>
                <p className="text-gray-600">Define your objective and context</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Roadmap</h3>
                <p className="text-gray-600">AI + template generates milestone plan</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Match</h3>
                <p className="text-gray-600">Choose mentor based on 5D fit and domain experience</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Sessions</h3>
                <p className="text-gray-600">Milestone sessions with tasks between sessions</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Review</h3>
                <p className="text-gray-600">KPI tracking and progress review checkpoints</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section C: What You Get */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What You Get</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Target className="w-5 h-5 text-[#0A2463] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Milestone Roadmap</h3>
                <p className="text-sm text-gray-600">Clear pathway with defined checkpoints</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <BarChart className="w-5 h-5 text-[#0A2463] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">KPI Dashboard</h3>
                <p className="text-sm text-gray-600">Track progress with metrics</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-[#0A2463] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Session Summaries</h3>
                <p className="text-sm text-gray-600">Structured notes and insights</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-[#0A2463] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Tasks & Feedback</h3>
                <p className="text-sm text-gray-600">Execution tasks and review feedback</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section D: Packages */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Package</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#0A2463] transition-colors">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
                <p className="text-sm text-gray-600">Short-term focused guidance</p>
              </div>
              <div className="mb-6">
                <div className="text-3xl font-bold text-[#0A2463] mb-2">4 weeks</div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>4 milestone sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Basic roadmap</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Session summaries</span>
                  </li>
                </ul>
              </div>
              <button className="w-full px-4 py-2 bg-[#0A2463] text-white rounded-lg font-medium hover:bg-[#0D47A1] transition-colors">
                Select
              </button>
            </div>

            {/* Growth */}
            <div className="border-2 border-[#0A2463] rounded-xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0A2463] text-white text-xs px-3 py-1 rounded-full font-bold uppercase">
                Popular
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Growth</h3>
                <p className="text-sm text-gray-600">Balanced progression track</p>
              </div>
              <div className="mb-6">
                <div className="text-3xl font-bold text-[#0A2463] mb-2">8 weeks</div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>8 milestone sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Advanced roadmap</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>KPI tracking dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Progress reviews</span>
                  </li>
                </ul>
              </div>
              <button className="w-full px-4 py-2 bg-[#0A2463] text-white rounded-lg font-medium hover:bg-[#0D47A1] transition-colors">
                Select
              </button>
            </div>

            {/* Transformation */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#0A2463] transition-colors">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Transformation</h3>
                <p className="text-sm text-gray-600">Deep capability building</p>
              </div>
              <div className="mb-6">
                <div className="text-3xl font-bold text-[#0A2463] mb-2">12 weeks</div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>12 milestone sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Comprehensive roadmap</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Full KPI suite</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Monthly progress reviews</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>
              <button className="w-full px-4 py-2 bg-[#0A2463] text-white rounded-lg font-medium hover:bg-[#0D47A1] transition-colors">
                Select
              </button>
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="bg-gradient-to-br from-[#0A2463] to-[#0D47A1] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Your Growth Journey?</h2>
          <p className="text-blue-100 mb-6">Choose a package and get matched with the perfect mentor</p>
          <button className="px-8 py-3 bg-white text-[#0A2463] rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Structured Mentorship
          </button>
        </div>

        {/* Related Links */}
        <div className="mt-8 flex gap-4 justify-center text-sm">
          <Link to="/#individuals" className="text-[#0A2463] hover:underline">
            Back to For Individuals
          </Link>
          <span className="text-gray-400">•</span>
          <Link to="/workshops" className="text-[#0A2463] hover:underline">
            View Workshops
          </Link>
          <span className="text-gray-400">•</span>
          <Link to="/mentorship-programs" className="text-[#0A2463] hover:underline">
            View Mentorship Programs
          </Link>
        </div>
      </div>
    </div>
  );
}
