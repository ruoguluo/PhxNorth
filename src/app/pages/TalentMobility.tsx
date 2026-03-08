import { Link } from 'react-router';
import { ArrowRight, Search, Users, Globe, TrendingUp, CheckCircle, Sparkles, Building2, Target, Network, Shield, Award, Zap, FileCheck, Briefcase, Clock, UserCheck, GitBranch, BarChart3, Settings, Bell, UserPlus, Send } from 'lucide-react';
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";

export function TalentMobility() {
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
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-700/80 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full mb-8 border border-white/20">
              <Network className="w-4 h-4 text-emerald-300" />
              <span className="text-sm font-semibold tracking-wide">Campaign-Based Recruitment</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
              Structured Talent Mobility
            </h1>
            
            <div className="text-2xl md:text-3xl font-semibold text-emerald-100 mb-6">
              Beyond Job Applications.
            </div>
            
            <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
              Participate in executive-grade recruitment campaigns powered by structured referrals and 5D intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/app/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-xl hover:bg-emerald-50 transition-all text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 duration-300"
              >
                Join Talent Mobility
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS TALENT MOBILITY */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What is Talent Mobility?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              A campaign-based recruitment model where you participate in structured hiring projects—not passive job boards.
            </p>
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-semibold text-sm">
              <Shield className="w-4 h-4" />
              Managed Recruitment Ecosystem
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enterprises Post Needs</h3>
              <p className="text-gray-600">
                Companies define structured hiring campaigns with clear role requirements and timelines
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Settings className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Platform Manages</h3>
              <p className="text-gray-600">
                Dedicated Project Managers structure campaigns, screen candidates, and manage workflows
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">You Participate</h3>
              <p className="text-gray-600">
                Self-nominate, refer qualified candidates, or accept referrals from your network
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ENTERPRISE INFRASTRUCTURE - BRIEF */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6 font-semibold text-sm">
              <Shield className="w-4 h-4" />
              Enterprise Infrastructure
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Professional Campaign Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every campaign is backed by structured project management to ensure quality, transparency, and professionalism
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Structured by PM</h3>
              <p className="text-sm text-gray-600">
                Project Managers define clear role requirements and candidate criteria
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200">
              <div className="text-3xl mb-4">⏱️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Milestones Defined</h3>
              <p className="text-sm text-gray-600">
                Clear timelines and progress checkpoints throughout the campaign
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Risk Controlled</h3>
              <p className="text-sm text-gray-600">
                Professional screening and validation at every stage of the process
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
              <div className="text-3xl mb-4">✅</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Shortlist Delivered</h3>
              <p className="text-sm text-gray-600">
                Qualified candidates presented to hiring managers with decision support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW INDIVIDUALS PARTICIPATE */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How You Participate
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A transparent, structured process from activation to placement
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-6 items-start bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-emerald-300 transition-colors">
                <div className="bg-emerald-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Activate Talent Mobility</h3>
                  <p className="text-gray-600">
                    Join the platform and build your professional profile with 5D intelligence integration
                  </p>
                </div>
                <UserPlus className="w-8 h-8 text-emerald-600 flex-shrink-0" />
              </div>

              {/* Step 2 */}
              <div className="flex gap-6 items-start bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Select Your Interests</h3>
                  <p className="text-gray-600">
                    Define industries, company types, role preferences, and career goals
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-600 flex-shrink-0" />
              </div>

              {/* Step 3 */}
              <div className="flex gap-6 items-start bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-300 transition-colors">
                <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Receive Campaign Notifications</h3>
                  <p className="text-gray-600">
                    Get matched to relevant hiring campaigns based on your profile and preferences
                  </p>
                </div>
                <Bell className="w-8 h-8 text-purple-600 flex-shrink-0" />
              </div>

              {/* Step 4 */}
              <div className="flex gap-6 items-start bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-amber-300 transition-colors">
                <div className="bg-amber-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Engage with Campaigns</h3>
                  <p className="text-gray-600">
                    Self-nominate for roles, refer qualified candidates, or accept referrals from your network
                  </p>
                </div>
                <Send className="w-8 h-8 text-amber-600 flex-shrink-0" />
              </div>

              {/* Step 5 */}
              <div className="flex gap-6 items-start bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-teal-300 transition-colors">
                <div className="bg-teal-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Track Progress Transparently</h3>
                  <p className="text-gray-600">
                    Monitor application status, interview stages, and campaign updates in real-time
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-teal-600 flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE WAYS TO ENGAGE */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Three Ways to Engage
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Participate in talent campaigns through multiple channels—each with unique benefits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Self-Nomination */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl">
              <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Self-Nomination</h3>
              <p className="text-gray-700 mb-6">
                Apply directly to campaigns that match your experience and career goals. Showcase your 5D profile to hiring teams.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Direct access to executive roles</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Structured screening process</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">5D profile visibility</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Transparent progress tracking</span>
                </li>
              </ul>
            </div>

            {/* Refer Someone */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-200 hover:border-emerald-400 transition-all hover:shadow-xl">
              <div className="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Network className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Refer Someone</h3>
              <p className="text-gray-700 mb-6">
                Know the perfect candidate? Refer them to active campaigns and earn rewards when they're successfully hired.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Browse active campaigns</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Submit qualified referrals</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Earn referral rewards ($2K-$10K+)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Build referrer reputation</span>
                </li>
              </ul>
            </div>

            {/* Be Referred */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-xl">
              <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Be Referred</h3>
              <p className="text-gray-700 mb-6">
                Receive referrals from your professional network. Endorsed candidates have higher credibility and conversion rates.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Network endorsements</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Increased credibility signal</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Priority consideration</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Context from referrer</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* POWERED BY 5D INTELLIGENCE */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              5D Intelligence
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powered by 5D Intelligence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your candidacy is evaluated through multidimensional assessment—far beyond resumes and interviews
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Five Dimensions of Professional Identity</h3>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Capability</h4>
                    <p className="text-gray-600 text-sm">Technical expertise, domain knowledge, certifications, and hard skills</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Growth Trajectory</h4>
                    <p className="text-gray-600 text-sm">Career progression patterns, learning velocity, and development potential</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-purple-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Behavioral Indicators</h4>
                    <p className="text-gray-600 text-sm">Communication style, leadership approach, and professional conduct</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-amber-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">4</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Decision Logic</h4>
                    <p className="text-gray-600 text-sm">Problem-solving frameworks, strategic thinking, and risk assessment</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-teal-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">5</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Collaboration Signals</h4>
                    <p className="text-gray-600 text-sm">Relationship building, team dynamics, and network engagement quality</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-10 border-2 border-blue-200">
              <h4 className="font-bold text-gray-900 mb-6 text-center text-lg">Your 5D Profile Advantage</h4>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 font-semibold">Capability</span>
                      <span className="text-blue-600 font-bold">92%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 rounded-full h-3" style={{ width: '92%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 font-semibold">Growth Trajectory</span>
                      <span className="text-emerald-600 font-bold">88%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3">
                      <div className="bg-emerald-600 rounded-full h-3" style={{ width: '88%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 font-semibold">Behavioral Indicators</span>
                      <span className="text-purple-600 font-bold">85%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3">
                      <div className="bg-purple-600 rounded-full h-3" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 font-semibold">Decision Logic</span>
                      <span className="text-amber-600 font-bold">90%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3">
                      <div className="bg-amber-600 rounded-full h-3" style={{ width: '90%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 font-semibold">Collaboration Signals</span>
                      <span className="text-teal-600 font-bold">87%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3">
                      <div className="bg-teal-600 rounded-full h-3" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link to="/5d-mentorship" className="text-blue-600 hover:text-blue-700 font-semibold text-sm inline-flex items-center gap-2">
                  Learn about the 5D Framework
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSPARENT CAMPAIGNS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Transparent Campaign Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every campaign operates with structured transparency, professional risk management, and reduced friction
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Structured Role Definition</h3>
              <p className="text-sm text-gray-600">
                Clear requirements, expectations, and success criteria
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200 text-center">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Timeline Control</h3>
              <p className="text-sm text-gray-600">
                Defined milestones and real-time progress tracking
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Screening Checkpoints</h3>
              <p className="text-sm text-gray-600">
                Validated progression through structured stages
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200 text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Professional Risk Management</h3>
              <p className="text-sm text-gray-600">
                Quality control and candidate validation
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border-2 border-teal-200 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Reduced Hiring Friction</h3>
              <p className="text-sm text-gray-600">
                Streamlined process from application to offer
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Network className="w-16 h-16 mx-auto mb-6 text-emerald-300" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join the Talent Mobility Network
          </h2>
          <p className="text-xl text-emerald-100 mb-12 max-w-3xl mx-auto">
            Participate in executive-grade recruitment campaigns with structured transparency and professional management
          </p>
          <Link
            to="/app/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-600 px-10 py-4 rounded-xl hover:bg-emerald-50 transition-all text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 duration-300"
          >
            Activate Talent Mobility
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer Spacer */}
      <div className="h-20 bg-gray-50"></div>
    </div>
  );
}