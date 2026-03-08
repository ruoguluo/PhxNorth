import { Link } from 'react-router';
import { ArrowRight, Building2, Shield, BarChart3, Users, Network, Lock } from 'lucide-react';
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";

export function Enterprises() {
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
            <Link to="/enterprises" className="text-sm font-semibold text-[#0A2463] transition-colors">
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
      <section className="bg-gradient-to-br from-[#0A2463] to-blue-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-semibold">Enterprise-Grade Human Capital Infrastructure</span>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              AI-Powered Talent Infrastructure for Enterprise Scale
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Deploy structured mentorship, talent mobility, and compliance-driven intelligence across your organization. Built for Fortune 500 and high-growth companies.
            </p>
            <Link
              to="/role-selection"
              className="inline-flex items-center gap-2 bg-white text-[#0A2463] px-8 py-4 rounded-lg hover:bg-blue-50 transition-all text-lg font-semibold shadow-xl hover:shadow-2xl"
            >
              Request Enterprise Demo
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Enterprise Solutions */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Enterprise Solutions
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive talent infrastructure for modern organizations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Structured Mentorship Programs</h3>
              <p className="text-gray-600">
                Deploy AI-powered mentorship at scale with compliance tracking, session analytics, and ROI measurement.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-emerald-500 hover:shadow-xl transition-all">
              <div className="bg-emerald-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Network className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Talent Mobility Intelligence</h3>
              <p className="text-gray-600">
                Executive-grade talent campaigns powered by structured referral systems and global talent mapping.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all">
              <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Commercial Advisory Services</h3>
              <p className="text-gray-600">
                Industry-benchmarked advisory with execution-driven commercial solutions for strategic initiatives.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-amber-500 hover:shadow-xl transition-all">
              <div className="bg-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Compliance & Governance</h3>
              <p className="text-gray-600">
                Full audit trails, data sovereignty, GDPR compliance, and enterprise-grade security controls.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-teal-500 hover:shadow-xl transition-all">
              <div className="bg-teal-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Lock className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Private Deployment</h3>
              <p className="text-gray-600">
                On-premise or private cloud deployment with white-label branding and custom integration.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-rose-500 hover:shadow-xl transition-all">
              <div className="bg-rose-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics & Insights</h3>
              <p className="text-gray-600">
                Real-time dashboards, program effectiveness metrics, and predictive talent intelligence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Leading Organizations
            </h2>
            <p className="text-lg text-gray-600">
              From Fortune 500 companies to high-growth startups
            </p>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-12 text-center">
            <p className="text-gray-700 text-lg">
              Join organizations deploying AI-native talent infrastructure at enterprise scale
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Talent Strategy?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Schedule a demo to see how PhxNorth can power your organization
          </p>
          <Link
            to="/role-selection"
            className="inline-flex items-center gap-2 bg-[#0A2463] text-white px-10 py-4 rounded-lg hover:bg-[#0A2463]/90 transition-all text-lg font-semibold shadow-xl hover:shadow-2xl"
          >
            Request Demo
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
