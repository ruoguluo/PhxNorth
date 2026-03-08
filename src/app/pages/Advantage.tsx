import { Link } from 'react-router';
import { ArrowRight, Sparkles, Brain, Target, Globe, Shield, Zap } from 'lucide-react';
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";

export function Advantage() {
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
            <Link to="/mentors" className="text-sm font-semibold text-gray-700 hover:text-[#0A2463] transition-colors">
              For Mentors
            </Link>
            <Link to="/enterprises" className="text-sm font-semibold text-gray-700 hover:text-[#0A2463] transition-colors">
              For Enterprises
            </Link>
            <Link to="/how-it-works" className="text-sm font-semibold text-gray-700 hover:text-[#0A2463] transition-colors">
              How It Works
            </Link>
            <Link to="/advantage" className="text-sm font-semibold text-[#0A2463] transition-colors">
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
      <section className="bg-gradient-to-br from-[#0A2463] to-indigo-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">The PhxNorth Advantage</span>
          </div>
          <h1 className="text-5xl font-bold mb-6">
            Why Choose PhxNorth?
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            AI-native human capital infrastructure built for the future of work
          </p>
        </div>
      </section>

      {/* Core Advantages */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div>
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                AI-Powered 5D Matching
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our proprietary 5D matching algorithm analyzes expertise, availability, industry alignment, communication style, and goal compatibility to find your perfect mentor match—not just based on keywords, but true contextual understanding.
              </p>
            </div>

            <div>
              <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Instant + Structured Mentorship
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get immediate help when you need it with instant mentorship, or schedule in-depth sessions for strategic guidance. PhxNorth supports both quick questions and long-term mentorship journeys.
              </p>
            </div>

            <div>
              <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Mentor-Respectful Platform
              </h3>
              <p className="text-gray-600 leading-relaxed">
                No star-rating pressure. We measure mentor impact through contribution-based metrics: sessions completed, marked mentees, and deep dialogue engagement—fostering quality over quantity.
              </p>
            </div>

            <div>
              <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Global Talent Network
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Access mentors from Fortune 500 companies, top universities, and leading startups worldwide. Our network spans education, career, business, and entrepreneurship across all major industries.
              </p>
            </div>

            <div>
              <div className="bg-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Minimal User Input Required
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI intelligently infers your goals, institution, program level, and context from your natural language question. Confirm our understanding and get matched—no lengthy forms or complex setup.
              </p>
            </div>

            <div>
              <div className="bg-rose-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Enterprise-Grade Infrastructure
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Built for scale with compliance tracking, audit trails, analytics dashboards, and private deployment options. From individual users to Fortune 500 deployments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              PhxNorth vs. Traditional Mentorship
            </h2>
            <p className="text-xl text-gray-600">
              See the difference AI-native infrastructure makes
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
            <div className="grid md:grid-cols-3 gap-px bg-gray-200">
              {/* Header */}
              <div className="bg-white p-6">
                <h3 className="font-bold text-gray-900">Feature</h3>
              </div>
              <div className="bg-blue-50 p-6">
                <h3 className="font-bold text-[#0A2463]">PhxNorth</h3>
              </div>
              <div className="bg-white p-6">
                <h3 className="font-bold text-gray-900">Traditional</h3>
              </div>

              {/* Matching */}
              <div className="bg-white p-6">
                <div className="font-semibold text-gray-900">Matching</div>
              </div>
              <div className="bg-blue-50 p-6">
                <div className="text-gray-700">AI-powered 5D algorithm</div>
              </div>
              <div className="bg-white p-6">
                <div className="text-gray-500">Manual search & filtering</div>
              </div>

              {/* Availability */}
              <div className="bg-white p-6">
                <div className="font-semibold text-gray-900">Availability</div>
              </div>
              <div className="bg-blue-50 p-6">
                <div className="text-gray-700">Real-time instant sessions</div>
              </div>
              <div className="bg-white p-6">
                <div className="text-gray-500">Schedule-only</div>
              </div>

              {/* Setup Time */}
              <div className="bg-white p-6">
                <div className="font-semibold text-gray-900">Setup Time</div>
              </div>
              <div className="bg-blue-50 p-6">
                <div className="text-gray-700">Minutes (AI-inferred)</div>
              </div>
              <div className="bg-white p-6">
                <div className="text-gray-500">Hours (manual forms)</div>
              </div>

              {/* Mentor Quality */}
              <div className="bg-white p-6">
                <div className="font-semibold text-gray-900">Mentor Metrics</div>
              </div>
              <div className="bg-blue-50 p-6">
                <div className="text-gray-700">Contribution-based impact</div>
              </div>
              <div className="bg-white p-6">
                <div className="text-gray-500">Star ratings (subjective)</div>
              </div>

              {/* Enterprise Features */}
              <div className="bg-white p-6">
                <div className="font-semibold text-gray-900">Enterprise</div>
              </div>
              <div className="bg-blue-50 p-6">
                <div className="text-gray-700">Full compliance & analytics</div>
              </div>
              <div className="bg-white p-6">
                <div className="text-gray-500">Limited or none</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Experience the PhxNorth Advantage
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join the future of human capital infrastructure
          </p>
          <Link
            to="/role-selection"
            className="inline-flex items-center gap-2 bg-[#0A2463] text-white px-10 py-4 rounded-lg hover:bg-[#0A2463]/90 transition-all text-lg font-semibold shadow-xl hover:shadow-2xl"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
