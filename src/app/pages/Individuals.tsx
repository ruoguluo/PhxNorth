import { Link } from 'react-router';
import { ArrowRight, GraduationCap, Briefcase, TrendingUp, Users } from 'lucide-react';
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";

export function Individuals() {
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
            <Link to="/individuals" className="text-sm font-semibold text-[#0A2463] transition-colors">
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
      <section className="bg-gradient-to-br from-[#0A2463] to-blue-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              AI-Powered Mentorship for Your Success
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Connect with expert mentors across education, career, business, and entrepreneurship. Get personalized guidance powered by our 5D matching intelligence.
            </p>
            <Link
              to="/role-selection"
              className="inline-flex items-center gap-2 bg-white text-[#0A2463] px-8 py-4 rounded-lg hover:bg-blue-50 transition-all text-lg font-semibold shadow-xl hover:shadow-2xl"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Whatever Your Goal, We're Here to Help
            </h2>
            <p className="text-xl text-gray-600">
              Structured mentorship for every stage of your journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <GraduationCap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Education</h3>
              <p className="text-gray-600">
                College admissions, test prep, academic planning, and research guidance
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-emerald-500 hover:shadow-xl transition-all">
              <div className="bg-emerald-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Briefcase className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Career</h3>
              <p className="text-gray-600">
                Job search, career transitions, promotion strategy, and skill development
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all">
              <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Business</h3>
              <p className="text-gray-600">
                Strategy, sales & BD, marketing, operations, and business transformation
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-amber-500 hover:shadow-xl transition-all">
              <div className="bg-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Entrepreneurship</h3>
              <p className="text-gray-600">
                Idea validation, MVP development, go-to-market, and fundraising
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of individuals achieving their goals with expert mentorship
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
