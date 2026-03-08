import { ArrowLeft, CheckCircle, Calendar, Users, FileText, Target } from 'lucide-react';
import { Link } from 'react-router';

export function WorkshopsExplore() {
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
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Workshops</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Insight-driven thematic sessions curated around market trends and emerging strategic signals.
          </p>
        </div>

        {/* Section A: Why Workshops */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Workshops</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Stay ahead of fast-moving market shifts and new hotspots</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Gain structured insights rather than generic webinar content</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Learn directly from strategic mentors and domain experts</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Build network capital through curated peer participation</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Convert insights into actions with post-session summaries</p>
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
                <h3 className="font-semibold text-gray-900 mb-1">Topic Release</h3>
                <p className="text-gray-600">PhxNorth publishes trend-aligned workshop topics regularly</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Match & Discovery</h3>
                <p className="text-gray-600">You browse topics aligned to your interests and 5D signals</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Seat Reservation</h3>
                <p className="text-gray-600">Book a seat (limited seats shown)</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Live Session</h3>
                <p className="text-gray-600">Interactive workshop with Q&A</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Summary & Action</h3>
                <p className="text-gray-600">Receive structured notes + recommended next steps</p>
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
                <h3 className="font-semibold text-gray-900 mb-1">Workshop Deck</h3>
                <p className="text-sm text-gray-600">Key takeaways and insights</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Target className="w-5 h-5 text-[#0A2463] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Action Checklist</h3>
                <p className="text-sm text-gray-600">Structured next steps</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-[#0A2463] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Next Skills Pathway</h3>
                <p className="text-sm text-gray-600">Suggested mentorship pathway</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-[#0A2463] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Follow-up Recommendation</h3>
                <p className="text-sm text-gray-600">Optional mentor/course suggestions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section D: Workshop Listings */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Workshops</h2>
          
          {/* Upcoming */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Workshops</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-5 hover:border-[#0A2463] transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Scaling E-commerce Operations</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>Mar 15, 2026 • 2:00 PM GMT</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-amber-700">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">8 seats remaining</span>
                    </div>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-[#0A2463] text-white rounded-lg font-medium hover:bg-[#0D47A1] transition-colors">
                  Reserve Seat
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-5 hover:border-[#0A2463] transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Building High-Performance Teams</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>Mar 22, 2026 • 10:00 AM GMT</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-amber-700">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">12 seats remaining</span>
                    </div>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-[#0A2463] text-white rounded-lg font-medium hover:bg-[#0D47A1] transition-colors">
                  Reserve Seat
                </button>
              </div>
            </div>
          </div>

          {/* Past */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Past Workshops</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Operations Excellence Workshop</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Completed Jan 15, 2026</span>
                    </div>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  View Summary
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="bg-gradient-to-br from-[#0A2463] to-[#0D47A1] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Join?</h2>
          <p className="text-blue-100 mb-6">Explore available workshops and reserve your seat today</p>
          <button className="px-8 py-3 bg-white text-[#0A2463] rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Explore Workshops
          </button>
        </div>

        {/* Related Links */}
        <div className="mt-8 flex gap-4 justify-center text-sm">
          <Link to="/#individuals" className="text-[#0A2463] hover:underline">
            Back to For Individuals
          </Link>
          <span className="text-gray-400">•</span>
          <Link to="/instant-mentorship" className="text-[#0A2463] hover:underline">
            View Instant Mentorship
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
