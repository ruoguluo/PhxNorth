import { ArrowLeft, CheckCircle, Zap, FileText, Target, Radio } from 'lucide-react';
import { Link } from 'react-router';

export function InstantMentorshipExplore() {
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
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Instant Mentorship</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            On-demand 5D-aligned advisory for immediate clarity and structured direction.
          </p>
        </div>

        {/* Section A: Why Instant Mentorship */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Instant Mentorship</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Get immediate clarity without long-term commitment</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">AI-assisted problem framing turns a big question into actionable sub-questions</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">5D matching improves relevance beyond hard skills (style, decision logic, communication)</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Reduce decision risk and avoid trial-and-error</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Leave with a clear next-step plan</p>
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
                <h3 className="font-semibold text-gray-900 mb-1">Ask</h3>
                <p className="text-gray-600">Submit your core question in the portal</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Structure</h3>
                <p className="text-gray-600">AI breaks it into a structured problem map and options</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Match</h3>
                <p className="text-gray-600">System recommends best-fit mentor(s) using 5D alignment</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Connect</h3>
                <p className="text-gray-600">Instant online video session (time boxed)</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Wrap-up</h3>
                <p className="text-gray-600">Auto summary + mentor notes + recommended actions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section C: What You Get */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What You Get</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-[#0A2463] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Problem Breakdown</h3>
                <p className="text-sm text-gray-600">Structured problem map and analysis</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Target className="w-5 h-5 text-[#0A2463] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Recommendations</h3>
                <p className="text-sm text-gray-600">Key recommendations & trade-offs</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-[#0A2463] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Action Plan</h3>
                <p className="text-sm text-gray-600">Next-step action plan</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Zap className="w-5 h-5 text-[#0A2463] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Follow-up Pathway</h3>
                <p className="text-sm text-gray-600">Optional scheduled mentorship / courses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section D: Availability Panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Availability</h2>
          <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Current Status</h3>
                <p className="text-sm text-gray-600">Set your availability to start receiving instant requests</p>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">Offline</span>
              </div>
            </div>
            <button className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
              Go Online Now
            </button>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="bg-gradient-to-br from-[#0A2463] to-[#0D47A1] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Need Immediate Guidance?</h2>
          <p className="text-blue-100 mb-6">Start an instant request and connect with the right mentor now</p>
          <button className="px-8 py-3 bg-white text-[#0A2463] rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start an Instant Request
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
          <Link to="/structured-mentorship" className="text-[#0A2463] hover:underline">
            View Structured Mentorship
          </Link>
        </div>
      </div>
    </div>
  );
}
