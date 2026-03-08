import { Link } from 'react-router';
import { ArrowRight, Heart, Clock, Globe, TrendingUp, Award, Users } from 'lucide-react';
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";

export function Mentors() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 backdrop-blur-sm bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="PhxNorth" className="h-8" />
            <span className="text-xl font-bold text-[#0A2463]">PhxNorth</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/individuals" className="text-sm font-semibold text-gray-700 hover:text-[#0A2463] transition-colors">
              Individuals
            </Link>
            <Link to="/mentors" className="text-sm font-semibold text-[#0A2463] transition-colors">
              For Mentors
            </Link>
            <Link to="/enterprises" className="text-sm font-semibold text-gray-700 hover:text-[#0A2463] transition-colors">
              For Enterprises
            </Link>
            <Link to="/how-it-works" className="text-sm font-semibold text-gray-700 hover:text-[#0A2463] transition-colors">
              How It Works
            </Link>
            <Link to="/advantage" className="text-sm font-semibold text-gray-700 hover:text-[#0A2463] transition-colors">
              Why PhxNorth
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-[#0A2463] transition-colors">
              Log In
            </Link>
            <Link to="/role-selection" className="bg-[#0A2463] text-white px-6 py-2.5 rounded-lg hover:bg-[#0A2463]/90 transition-all text-sm font-semibold shadow-md hover:shadow-lg">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-semibold">A Platform That Respects Mentor Expertise</span>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Share Your Expertise, Make an Impact
            </h1>
            <p className="text-xl text-emerald-100 mb-8">
              No star-rating pressure. No transactional metrics. Just meaningful mentorship tracked through contribution-based impact.
            </p>
            <Link
              to="/role-selection"
              className="inline-flex items-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-lg hover:bg-emerald-50 transition-all text-lg font-semibold shadow-xl hover:shadow-2xl"
            >
              Become a Mentor
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Mentor on PhxNorth */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Mentor on PhxNorth?
            </h2>
            <p className="text-xl text-gray-600">
              A mentorship platform designed with respect for your expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No Star-Rating Pressure</h3>
              <p className="text-gray-600">
                We don't rank mentors by subjective ratings. Your credibility is measured by sustained contribution and engagement depth.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
              <div className="bg-emerald-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Contribution-Based Credibility</h3>
              <p className="text-gray-600">
                Your impact is tracked through sessions completed, mentees marked as regular, and deep dialogue engagement.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
              <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Structured Impact Tracking</h3>
              <p className="text-gray-600">
                See your mentorship impact through clear metrics: sessions, marked mentees, and long-term journeys.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
              <div className="bg-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Scheduling</h3>
              <p className="text-gray-600">
                Offer instant mentorship, scheduled sessions, or both. You control your availability and commitment level.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
              <div className="bg-teal-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Global Reach</h3>
              <p className="text-gray-600">
                Connect with mentees worldwide seeking guidance in education, career, business, and entrepreneurship.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
              <div className="bg-rose-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Deep Engagement Over Quick Transactions</h3>
              <p className="text-gray-600">
                Build meaningful, long-term mentorship relationships. Our platform values quality over quantity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join our community of mentors shaping the next generation of talent
          </p>
          <Link
            to="/role-selection"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-10 py-4 rounded-lg hover:bg-emerald-700 transition-all text-lg font-semibold shadow-xl hover:shadow-2xl"
          >
            Become a Mentor
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
