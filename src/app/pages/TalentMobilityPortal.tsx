import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowRight, Settings, Bell, TrendingUp, Users, CheckCircle, Sparkles } from 'lucide-react';
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";

export function TalentMobilityPortal() {
  const navigate = useNavigate();
  // Simulate join status - in real app, this would come from authentication/user context
  const [hasJoined, setHasJoined] = useState(false);

  const handleJoinNow = () => {
    setHasJoined(true);
    // In real app, this would make an API call to register user for talent mobility
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="flex">
        {/* Left Sidebar Navigation - Only visible after joining */}
        {hasJoined && (
          <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-[73px] self-start">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-gray-900">Talent Mobility</h3>
              </div>
              
              <nav className="space-y-1">
                <Link
                  to="/talent-mobility-portal/preferences"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-semibold">My Preferences</span>
                </Link>
                
                <Link
                  to="/talent-mobility-portal/campaigns"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-semibold">Active Campaigns</span>
                </Link>
                
                <Link
                  to="/talent-mobility-portal/referrals"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">Referral Progress</span>
                </Link>
                
                <Link
                  to="/talent-mobility-portal/notifications"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  <span className="text-sm font-semibold">Notifications</span>
                </Link>
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-4 font-semibold text-sm">
                <Sparkles className="w-4 h-4" />
                Platform-Managed Ecosystem
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Talent Mobility Programme
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                A structured, platform-managed talent mobility infrastructure powered by 5D matching and professional process control.
              </p>
            </div>

            {/* Conditional Card */}
            {!hasJoined ? (
              /* Not Joined Card */
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-10 border-2 border-emerald-200 shadow-lg">
                <div className="flex items-start gap-6">
                  <div className="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Join Talent Mobility</h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      Participate in cross-border, cross-industry career campaigns. Set your focus areas and receive real-time opportunity alerts.
                    </p>
                    <button
                      onClick={handleJoinNow}
                      className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition-all font-bold shadow-lg hover:shadow-xl hover:scale-105 duration-300"
                    >
                      Join Now
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Joined Card */
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-10 border-2 border-blue-200 shadow-lg">
                <div className="flex items-start gap-6">
                  <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Talent Mobility Dashboard</h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      Manage your preferences, explore active campaigns, and track your referral progress in a transparent process.
                    </p>
                    <Link
                      to="/talent-mobility-portal/preferences"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg hover:shadow-xl hover:scale-105 duration-300"
                    >
                      Manage Settings
                      <Settings className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Info Sections - Always visible */}
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">5D Matching Intelligence</h3>
                <p className="text-gray-600">
                  Your profile is evaluated across 5 dimensions—capability, growth trajectory, behavioral indicators, decision logic, and collaboration signals.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Process Control</h3>
                <p className="text-gray-600">
                  Every campaign is managed by dedicated PhxNorth Project Managers who ensure transparency, stage clarity, and risk control throughout.
                </p>
              </div>
            </div>

            {/* System Differentiation */}
            <div className="mt-12 bg-gray-100 rounded-2xl p-8 border-2 border-gray-300">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Not a Traditional Job Board</h3>
              <p className="text-gray-700 mb-4">
                Talent Mobility is a structured recruitment ecosystem—not a passive job listing platform. Every opportunity is professionally managed, quality-controlled, and matched using multidimensional intelligence.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="font-semibold text-gray-900 mb-1">Structured Campaigns</div>
                  <div className="text-sm text-gray-600">Project-based recruitment with clear timelines</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="font-semibold text-gray-900 mb-1">PM-Managed Process</div>
                  <div className="text-sm text-gray-600">Professional oversight at every stage</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="font-semibold text-gray-900 mb-1">5D Profile Matching</div>
                  <div className="text-sm text-gray-600">Intelligent candidate-role alignment</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
