import { Link } from 'react-router';
import { ArrowRight, Brain, TrendingUp, Users, Target, Network, Clock, Calendar, BookOpen, Award, CheckCircle, Sparkles, Activity, Shield, Building2 } from 'lucide-react';
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";

export function FiveDMentorship() {
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
      <section className="relative bg-gradient-to-br from-[#0A2463] via-[#0D47A1] to-[#0A2463] text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2463]/80 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full mb-8 border border-white/20">
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span className="text-sm font-semibold tracking-wide">The PhxNorth 5D Framework</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
              5D Mentorship
            </h1>
            
            <div className="text-2xl md:text-3xl font-semibold text-blue-100 mb-6">
              Structured Identity. Precise Matching. Sustained Growth.
            </div>
            
            <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
              We understand individuals through 5D identity modeling to enable measurable mentorship.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/role-selection"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#0A2463] px-8 py-4 rounded-xl hover:bg-blue-50 transition-all text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 duration-300"
              >
                Start as Mentee
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/role-selection"
                className="inline-flex items-center justify-center gap-2 bg-[#0A2463] border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-all text-lg font-bold shadow-xl hover:shadow-2xl"
              >
                Become a Mentor
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS 5D - RADAR DIAGRAM SECTION */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What is 5D Identity Modeling?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive framework that captures the complete professional identity across five critical dimensions.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Radar Diagram Visual */}
            <div className="lg:w-1/2">
              <div className="relative w-full max-w-lg mx-auto aspect-square">
                {/* Pentagon Container */}
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  {/* Background Grid Lines */}
                  <polygon points="200,50 350,150 300,330 100,330 50,150" fill="none" stroke="#E5E7EB" strokeWidth="2" opacity="0.3" />
                  <polygon points="200,90 310,160 270,300 130,300 90,160" fill="none" stroke="#E5E7EB" strokeWidth="2" opacity="0.3" />
                  <polygon points="200,130 270,180 240,270 160,270 130,180" fill="none" stroke="#E5E7EB" strokeWidth="2" opacity="0.3" />
                  
                  {/* Filled Pentagon */}
                  <polygon points="200,70 330,160 280,310 120,310 70,160" fill="url(#gradient)" opacity="0.2" />
                  <polygon points="200,70 330,160 280,310 120,310 70,160" fill="none" stroke="#0A2463" strokeWidth="3" />
                  
                  {/* Center Lines */}
                  <line x1="200" y1="200" x2="200" y2="50" stroke="#D1D5DB" strokeWidth="1" opacity="0.5" />
                  <line x1="200" y1="200" x2="350" y2="150" stroke="#D1D5DB" strokeWidth="1" opacity="0.5" />
                  <line x1="200" y1="200" x2="300" y2="330" stroke="#D1D5DB" strokeWidth="1" opacity="0.5" />
                  <line x1="200" y1="200" x2="100" y2="330" stroke="#D1D5DB" strokeWidth="1" opacity="0.5" />
                  <line x1="200" y1="200" x2="50" y2="150" stroke="#D1D5DB" strokeWidth="1" opacity="0.5" />
                  
                  {/* Data Points */}
                  <circle cx="200" cy="70" r="6" fill="#0A2463" />
                  <circle cx="330" cy="160" r="6" fill="#0A2463" />
                  <circle cx="280" cy="310" r="6" fill="#0A2463" />
                  <circle cx="120" cy="310" r="6" fill="#0A2463" />
                  <circle cx="70" cy="160" r="6" fill="#0A2463" />
                  
                  {/* Gradient Definition */}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0A2463" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Labels */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
                  <div className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap">
                    Domain Capability
                  </div>
                </div>
                <div className="absolute top-1/4 right-4 text-right">
                  <div className="bg-emerald-600 text-white px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap">
                    Growth Trajectory
                  </div>
                </div>
                <div className="absolute bottom-12 right-1/4 text-right">
                  <div className="bg-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap">
                    Commercial Behavior
                  </div>
                </div>
                <div className="absolute bottom-12 left-1/4 text-left">
                  <div className="bg-amber-600 text-white px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap">
                    Decision Logic
                  </div>
                </div>
                <div className="absolute top-1/4 left-4 text-left">
                  <div className="bg-teal-600 text-white px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap">
                    Network Depth
                  </div>
                </div>
              </div>
            </div>

            {/* Dimension Explanations */}
            <div className="lg:w-1/2 space-y-6">
              <div className="flex gap-4">
                <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Domain Capability (Hard Skills)</h3>
                  <p className="text-gray-600">Technical expertise, certifications, and measurable domain knowledge</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Growth Trajectory</h3>
                  <p className="text-gray-600">Career progression patterns, velocity, and development history</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Commercial Behavior Pattern</h3>
                  <p className="text-gray-600">Strategic approach to business problems and market engagement</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Activity className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Decision Logic</h3>
                  <p className="text-gray-600">Problem-solving frameworks, risk assessment, and decision-making style</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-teal-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Network className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Network & Interaction Depth</h3>
                  <p className="text-gray-600">Relationship building patterns and collaborative engagement style</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HARD SKILLS SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6 font-semibold text-sm">
                <Brain className="w-4 h-4" />
                Hard Skills
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Objective Growth Mapping
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We capture your professional journey through structured data points that create a comprehensive capability profile.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">Education History</div>
                    <div className="text-gray-600">Degrees, institutions, specializations, and academic achievements</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">Professional Timeline</div>
                    <div className="text-gray-600">Roles, companies, industries, and tenure progression</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">Responsibility Scope</div>
                    <div className="text-gray-600">Team size, budget management, and decision authority</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">Career Transitions</div>
                    <div className="text-gray-600">Pivot patterns, skill development, and growth velocity</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Timeline Visualization */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                    <div className="w-0.5 h-full bg-blue-300 mt-2"></div>
                  </div>
                  <div className="pb-8">
                    <div className="text-sm text-blue-600 font-semibold mb-1">2024 - Present</div>
                    <div className="font-bold text-gray-900 mb-1">Senior Product Manager</div>
                    <div className="text-gray-600 text-sm">Tech Startup • SaaS Platform • Team of 12</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-emerald-600"></div>
                    <div className="w-0.5 h-full bg-emerald-300 mt-2"></div>
                  </div>
                  <div className="pb-8">
                    <div className="text-sm text-emerald-600 font-semibold mb-1">2021 - 2024</div>
                    <div className="font-bold text-gray-900 mb-1">Product Manager</div>
                    <div className="text-gray-600 text-sm">Fortune 500 • FinTech • Team of 6</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-purple-600"></div>
                    <div className="w-0.5 h-full bg-purple-300 mt-2"></div>
                  </div>
                  <div className="pb-8">
                    <div className="text-sm text-purple-600 font-semibold mb-1">2019 - 2021</div>
                    <div className="font-bold text-gray-900 mb-1">Business Analyst</div>
                    <div className="text-gray-600 text-sm">Consulting Firm • Strategy Projects</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-amber-600"></div>
                  </div>
                  <div>
                    <div className="text-sm text-amber-600 font-semibold mb-1">2015 - 2019</div>
                    <div className="font-bold text-gray-900 mb-1">MBA, Computer Science BSc</div>
                    <div className="text-gray-600 text-sm">Top University • Business & Technology</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOFT SKILLS SECTION */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual Example */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-xl">
                <div className="text-sm font-semibold text-gray-500 mb-4">Behavioral Intelligence Capture</div>
                <div className="space-y-6">
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Question Framing Example</div>
                    <div className="bg-blue-50 rounded-lg p-4 text-gray-900">
                      "How should I prioritize feature requests when launching an MVP?"
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <span className="font-semibold">Detected:</span> Strategic thinking, prioritization framework, MVP mindset
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 mb-2">Decision Response Pattern</div>
                    <div className="bg-emerald-50 rounded-lg p-4 text-gray-900">
                      "I prefer data-driven validation before committing resources"
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <span className="font-semibold">Detected:</span> Analytical approach, risk mitigation, evidence-based
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 mb-2">Engagement Pattern</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-purple-100 rounded-full h-2">
                        <div className="bg-purple-600 rounded-full h-2 w-4/5"></div>
                      </div>
                      <div className="text-sm text-gray-700 font-semibold">8 sessions, 5+ exchanges each</div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <span className="font-semibold">Detected:</span> Deep engagement, sustained learning, commitment
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-6 font-semibold text-sm">
                <Activity className="w-4 h-4" />
                Behavioral Intelligence
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Soft Skills Through Structured Methodology
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We capture behavioral patterns through observable interactions, not subjective impressions.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">Question Framing Analysis</div>
                    <div className="text-gray-600">How you articulate problems reveals thinking patterns</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">Decision Response Mapping</div>
                    <div className="text-gray-600">Your approach to scenarios indicates decision logic</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">Risk Calibration Profile</div>
                    <div className="text-gray-600">How you evaluate trade-offs shows risk tolerance</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">Engagement Pattern Tracking</div>
                    <div className="text-gray-600">Session depth and consistency reveal commitment level</div>
                  </div>
                </li>
              </ul>
              <div className="mt-8 p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-gray-900 mb-2">No Subjective Impressions</div>
                    <div className="text-gray-700">
                      Every behavioral indicator is derived from structured observation and interaction data—never from opinions or gut feelings.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MATCHING ADVANTAGE SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Matching Advantage
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              5D profiles enable precise mentor-mentee alignment that improves over time
            </p>
          </div>

          {/* Process Flow */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 flex-1 max-w-sm">
              <div className="text-center">
                <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Your 5D Profile</h3>
                <p className="text-gray-600">
                  Complete identity model built from professional history and interaction patterns
                </p>
              </div>
            </div>

            <div className="hidden lg:block">
              <ArrowRight className="w-12 h-12 text-blue-600" />
            </div>
            <div className="lg:hidden">
              <ArrowRight className="w-12 h-12 text-blue-600 rotate-90" />
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-200 flex-1 max-w-sm">
              <div className="text-center">
                <div className="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Matching Engine</h3>
                <p className="text-gray-600">
                  Multi-dimensional compatibility analysis across all 5 dimensions
                </p>
              </div>
            </div>

            <div className="hidden lg:block">
              <ArrowRight className="w-12 h-12 text-emerald-600" />
            </div>
            <div className="lg:hidden">
              <ArrowRight className="w-12 h-12 text-emerald-600 rotate-90" />
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 flex-1 max-w-sm">
              <div className="text-center">
                <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Aligned Mentor</h3>
                <p className="text-gray-600">
                  Perfect-fit mentors matched on expertise, style, and growth trajectory
                </p>
              </div>
            </div>
          </div>

          {/* Improvement Over Time */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-10 border-2 border-amber-200 text-center max-w-4xl mx-auto">
            <TrendingUp className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Clarity Improves Over Time
            </h3>
            <p className="text-lg text-gray-700">
              Each mentorship session, question asked, and decision made adds precision to your 5D profile. The more you engage, the better your mentor matches become.
            </p>
          </div>
        </div>
      </section>

      {/* MENTORSHIP FORMATS SECTION */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Mentorship Formats
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the format that fits your learning style and goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Instant Mentorship */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Instant Mentorship</h3>
              <div className="mb-6">
                <div className="text-sm font-semibold text-blue-600 mb-2">BEST FOR</div>
                <p className="text-gray-700">Quick questions, urgent guidance, immediate feedback</p>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-2">HOW IT WORKS</div>
                <p className="text-gray-600">
                  Ask your question, get matched with available mentors in real-time, join queue or start instantly
                </p>
              </div>
            </div>

            {/* Scheduled Mentorship */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-emerald-500 hover:shadow-xl transition-all">
              <div className="bg-emerald-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Scheduled Mentorship</h3>
              <div className="mb-6">
                <div className="text-sm font-semibold text-emerald-600 mb-2">BEST FOR</div>
                <p className="text-gray-700">In-depth discussions, strategic planning, comprehensive reviews</p>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-2">HOW IT WORKS</div>
                <p className="text-gray-600">
                  Book dedicated time slots with mentors, prepare structured agendas, follow-up tracking
                </p>
              </div>
            </div>

            {/* Workshops */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all">
              <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Workshops</h3>
              <div className="mb-6">
                <div className="text-sm font-semibold text-purple-600 mb-2">BEST FOR</div>
                <p className="text-gray-700">Group learning, skill development, interactive sessions</p>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-2">HOW IT WORKS</div>
                <p className="text-gray-600">
                  Join mentor-led group sessions, collaborative learning, practical exercises and Q&A
                </p>
              </div>
            </div>

            {/* Mentorship Courses */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-amber-500 hover:shadow-xl transition-all">
              <div className="bg-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Mentorship Courses</h3>
              <div className="mb-6">
                <div className="text-sm font-semibold text-amber-600 mb-2">BEST FOR</div>
                <p className="text-gray-700">Structured learning paths, milestone-based progress, long-term growth</p>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-2">HOW IT WORKS</div>
                <p className="text-gray-600">
                  Multi-session structured programs, progress tracking, certification and achievement milestones
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STRUCTURED QUESTION SYSTEM SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Structured Question System
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Maximize mentorship value through structured preparation and follow-up
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Before Mentorship */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-10 border-2 border-blue-200">
              <div className="text-blue-600 font-bold text-sm mb-4">BEFORE MENTORSHIP</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Preparation Phase</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Goal Clarification</div>
                    <div className="text-gray-700">Define what you want to achieve from the session</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Question Planning</div>
                    <div className="text-gray-700">Structure your questions for maximum clarity</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Context Preparation</div>
                    <div className="text-gray-700">Gather relevant background information</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* After Mentorship */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-10 border-2 border-emerald-200">
              <div className="text-emerald-600 font-bold text-sm mb-4">AFTER MENTORSHIP</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Reflection Phase</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-emerald-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Session Summary</div>
                    <div className="text-gray-700">Capture key insights and recommendations</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-emerald-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Action Items</div>
                    <div className="text-gray-700">Define concrete next steps and timelines</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-emerald-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Progress Tracking</div>
                    <div className="text-gray-700">Monitor implementation and results over time</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FOR MENTORS SECTION */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-6 font-semibold text-sm">
              <Award className="w-4 h-4" />
              For Mentors
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              We Respect Mentor Expertise
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No star ratings. No subjective pressure. Just contribution-based impact metrics.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Total Sessions</h3>
              <p className="text-gray-600">
                Measure your contribution through completed mentorship sessions
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">👥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Marked Mentees</h3>
              <p className="text-gray-600">
                Number of mentees who marked you as their regular mentor
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">🔁</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Deep Dialogues</h3>
              <p className="text-gray-600">
                Questions that resulted in 5+ extended interactions
              </p>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-10 border-2 border-blue-200 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Credibility Through Contribution, Not Ratings
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We believe great mentors shouldn't be judged by subjective star ratings. Instead, your impact is measured through sustained contribution: how many people you've helped, how many mentees return to you, and how deeply you engage with mentorship questions. This creates a respectful, non-transactional environment focused on meaningful knowledge transfer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MENTOR FLEXIBILITY SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Mentor Flexibility
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              You control how you mentor. Choose the formats that fit your schedule and expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200 text-center">
              <Clock className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Sessions</h3>
              <p className="text-gray-700 text-sm">
                Offer real-time mentorship when you're available
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border-2 border-emerald-200 text-center">
              <Calendar className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Scheduled Sessions</h3>
              <p className="text-gray-700 text-sm">
                Book dedicated time for in-depth discussions
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200 text-center">
              <Users className="w-10 h-10 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Workshops</h3>
              <p className="text-gray-700 text-sm">
                Lead group sessions and interactive learning
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border-2 border-amber-200 text-center">
              <Building2 className="w-10 h-10 text-amber-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Enterprise Projects</h3>
              <p className="text-gray-700 text-sm">
                Participate in structured corporate programs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 bg-gradient-to-br from-[#0A2463] to-indigo-900 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-blue-300" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Structured Mentorship Starts with Understanding.
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Join the future of AI-powered mentorship built on 5D identity modeling
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/role-selection"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#0A2463] px-10 py-4 rounded-xl hover:bg-blue-50 transition-all text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 duration-300"
            >
              Explore Mentorship
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/role-selection"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl hover:bg-white/10 transition-all text-lg font-bold shadow-xl"
            >
              Become a Mentor
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