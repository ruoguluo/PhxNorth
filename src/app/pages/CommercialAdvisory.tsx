import { Link } from 'react-router';
import { ArrowRight, Target, TrendingUp, CheckCircle, Sparkles, Building2, BarChart3, Users, Briefcase, Zap, Award, LineChart, DollarSign, FileCheck } from 'lucide-react';
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";

export function CommercialAdvisory() {
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

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-800/80 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full mb-8 border border-white/20">
              <Briefcase className="w-4 h-4 text-purple-300" />
              <span className="text-sm font-semibold tracking-wide">Execution-Driven Business Advisory</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
              Commercial Advisory
            </h1>
            
            <div className="text-2xl md:text-3xl font-semibold text-purple-100 mb-6">
              Industry-Benchmarked Insights. Execution-Focused Strategy. Measurable Results.
            </div>
            
            <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
              Move beyond slide decks. Get hands-on advisory that combines strategic insight with execution support—from go-to-market to operational transformation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/role-selection"
                className="inline-flex items-center justify-center gap-2 bg-white text-purple-700 px-8 py-4 rounded-xl hover:bg-purple-50 transition-all text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 duration-300"
              >
                Request Advisory
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/role-selection"
                className="inline-flex items-center justify-center gap-2 bg-purple-700 border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-all text-lg font-bold shadow-xl hover:shadow-2xl"
              >
                Become an Advisor
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS COMMERCIAL ADVISORY */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What is Commercial Advisory?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              High-caliber business consulting that bridges strategy and execution—without the traditional consulting price tag.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Strategy + Execution</h3>
              <p className="text-gray-600">
                Not just recommendations—we help implement solutions through structured project delivery.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Industry-Benchmarked</h3>
              <p className="text-gray-600">
                Advisors with direct operational experience in your sector, backed by data-driven insights.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="bg-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Results-Focused</h3>
              <p className="text-gray-600">
                Success measured by tangible outcomes: revenue growth, cost reduction, market expansion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ADVISORY FOCUS AREAS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Advisory Focus Areas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive commercial advisory across all critical business functions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Go-to-Market Strategy */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
              <div className="bg-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Go-to-Market Strategy</h3>
              <p className="text-gray-700 mb-6">
                Launch new products, enter new markets, and optimize customer acquisition strategies.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Market sizing & opportunity assessment</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Pricing and packaging strategy</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Channel strategy and partnership development</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Launch execution and performance tracking</span>
                </li>
              </ul>
            </div>

            {/* Sales & Business Development */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-200">
              <div className="bg-emerald-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sales & Business Development</h3>
              <p className="text-gray-700 mb-6">
                Build scalable sales engines, optimize conversion funnels, and accelerate revenue growth.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Sales process design and optimization</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Playbook development and team training</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">CRM implementation and pipeline management</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Strategic partnership identification</span>
                </li>
              </ul>
            </div>

            {/* Operational Excellence */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
              <div className="bg-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Operational Excellence</h3>
              <p className="text-gray-700 mb-6">
                Streamline operations, reduce costs, and improve efficiency across business functions.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Process mapping and bottleneck analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Technology stack optimization</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Organizational design and role clarity</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">KPI framework and performance dashboards</span>
                </li>
              </ul>
            </div>

            {/* Corporate Strategy */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200">
              <div className="bg-amber-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Corporate Strategy</h3>
              <p className="text-gray-700 mb-6">
                Define strategic direction, evaluate M&A opportunities, and plan for sustainable growth.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Strategic planning and scenario analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">M&A target identification and due diligence</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Business model innovation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Competitive positioning and differentiation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How Commercial Advisory Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From challenge identification to results delivery in a structured engagement model
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Phase 1 */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Discovery</h3>
              <p className="text-gray-600">
                Deep-dive into your business challenge, objectives, and current state assessment.
              </p>
            </div>

            {/* Phase 2 */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="bg-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Strategy</h3>
              <p className="text-gray-600">
                Develop industry-benchmarked recommendations with clear execution roadmap.
              </p>
            </div>

            {/* Phase 3 */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="bg-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Execution</h3>
              <p className="text-gray-600">
                Hands-on implementation support, team training, and process establishment.
              </p>
            </div>

            {/* Phase 4 */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="bg-amber-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white font-bold">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Measurement</h3>
              <p className="text-gray-600">
                Track KPIs, optimize performance, and ensure sustainable results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Who We Serve
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Commercial advisory for organizations at every growth stage
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Startups & Scale-Ups</h3>
              <p className="text-gray-700">
                Seed to Series B companies needing strategic guidance without hiring full-time executives
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-200 text-center">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Growth Companies</h3>
              <p className="text-gray-700">
                Mid-market firms scaling operations, entering new markets, or transforming business models
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 text-center">
              <div className="text-4xl mb-4">🏛️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enterprises</h3>
              <p className="text-gray-700">
                Large organizations tackling specific transformation initiatives or strategic projects
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE OUR ADVISORY */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose PhxNorth Advisory?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The advantages of top-tier consulting with execution support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Operator Experience</h3>
              <p className="text-gray-600">
                Advisors with direct P&L responsibility, not just consulting experience
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Execution Focus</h3>
              <p className="text-gray-600">
                We don't just deliver decks—we help implement solutions
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Data-Driven</h3>
              <p className="text-gray-600">
                Industry benchmarks and quantitative analysis backing every recommendation
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Pricing</h3>
              <p className="text-gray-600">
                Project-based, retainer, or success-fee models to fit your budget
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="text-3xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Global Expertise</h3>
              <p className="text-gray-600">
                Advisors across industries, geographies, and business functions
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Long-Term Partnership</h3>
              <p className="text-gray-600">
                Build lasting relationships beyond single engagement projects
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOR ADVISORS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-6 font-semibold text-sm">
              <Award className="w-4 h-4" />
              For Advisors
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Join Our Advisory Network
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Share your expertise, work on meaningful projects, and earn advisory fees
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-12 border-2 border-purple-200 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Who We're Looking For</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">10+ years operating experience</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Director-level or above at recognized firms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Deep domain expertise in specific functions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Track record of measurable business impact</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Engagement Types</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">Project-Based</div>
                    <div className="text-lg font-bold text-gray-900">$150 - $500/hour</div>
                    <div className="text-xs text-gray-600 mt-1">Fixed-scope deliverables</div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">Retainer</div>
                    <div className="text-lg font-bold text-gray-900">$5K - $25K/month</div>
                    <div className="text-xs text-gray-600 mt-1">Ongoing advisory access</div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">Success-Based</div>
                    <div className="text-lg font-bold text-gray-900">% of Value Created</div>
                    <div className="text-xs text-gray-600 mt-1">Revenue/savings share</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 bg-gradient-to-br from-purple-700 to-indigo-800 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Briefcase className="w-16 h-16 mx-auto mb-6 text-purple-300" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-purple-100 mb-12 max-w-3xl mx-auto">
            Connect with expert advisors who deliver results, not just recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/role-selection"
              className="inline-flex items-center justify-center gap-2 bg-white text-purple-700 px-10 py-4 rounded-xl hover:bg-purple-50 transition-all text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 duration-300"
            >
              Request Advisory
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/role-selection"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl hover:bg-white/10 transition-all text-lg font-bold shadow-xl"
            >
              Become an Advisor
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Spacer */}
      <div className="h-20 bg-gray-50"></div>
    </div>
  );
}
