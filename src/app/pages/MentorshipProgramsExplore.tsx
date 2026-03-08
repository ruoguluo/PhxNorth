import { ArrowLeft, CheckCircle, Award, FileText, Target, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router';

export function MentorshipProgramsExplore() {
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
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Mentorship Programs</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Comprehensive development tracks combining learning, applied execution, and mentorship checkpoints.
          </p>
        </div>

        {/* Section A: Why Programs */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Programs</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Deep capability building, not one-off advice</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Cohort structure creates momentum and consistency</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Applied assignments ensure real execution</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Mentorship checkpoints reduce blind spots</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Recognized completion track / certification</p>
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
                <h3 className="font-semibold text-gray-900 mb-1">Enroll</h3>
                <p className="text-gray-600">Choose a program track aligned to your goal</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Learn</h3>
                <p className="text-gray-600">Access structured learning modules</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Apply</h3>
                <p className="text-gray-600">Complete applied assignments (real scenarios)</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Mentorship</h3>
                <p className="text-gray-600">Scheduled checkpoint sessions</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Complete</h3>
                <p className="text-gray-600">Receive completion milestone / certificate</p>
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
                <h3 className="font-semibold text-gray-900 mb-1">Learning Modules</h3>
                <p className="text-sm text-gray-600">Structured content & templates</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Target className="w-5 h-5 text-[#0A2463] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Assignments</h3>
                <p className="text-sm text-gray-600">Real scenarios + feedback</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-[#0A2463] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Checkpoint Summaries</h3>
                <p className="text-sm text-gray-600">Mentorship session notes</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Award className="w-5 h-5 text-[#0A2463] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Certification</h3>
                <p className="text-sm text-gray-600">Completion badge & certificate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section D: Program Library */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Programs</h2>
          <div className="space-y-4">
            {/* Program 1 */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#0A2463] transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">E-commerce Operations Masterclass</h3>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                      Open
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Master operational excellence in e-commerce environments with real-world case studies and hands-on projects
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Next Cohort: Apr 1, 2026</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Max 20 participants</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-[#0A2463] text-white rounded-lg font-medium hover:bg-[#0D47A1] transition-colors">
                  Enroll Now
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>

            {/* Program 2 */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#0A2463] transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">Strategic Leadership in Tech</h3>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                      Open
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Develop strategic leadership capabilities for technology organizations with focus on decision-making frameworks
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Next Cohort: Mar 20, 2026</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Max 15 participants</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-[#0A2463] text-white rounded-lg font-medium hover:bg-[#0D47A1] transition-colors">
                  Enroll Now
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>

            {/* Program 3 */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#0A2463] transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">Product Strategy & Execution</h3>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                      Waitlist
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    End-to-end product strategy from ideation to market execution with industry mentor guidance
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Next Cohort: May 10, 2026</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Max 18 participants</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                  Join Waitlist
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="bg-gradient-to-br from-[#0A2463] to-[#0D47A1] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Transform Your Capabilities</h2>
          <p className="text-blue-100 mb-6">Join a comprehensive program and accelerate your professional growth</p>
          <button className="px-8 py-3 bg-white text-[#0A2463] rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Browse Programs
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
