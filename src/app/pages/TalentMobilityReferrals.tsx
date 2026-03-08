import { Link } from 'react-router';
import { Settings, TrendingUp, Users, Bell, CheckCircle, Clock, AlertCircle, Send, UserCheck, MessageSquare } from 'lucide-react';
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";

export function TalentMobilityReferrals() {
  const selfApplications = [
    {
      id: 1,
      company: 'Global FinTech Corp',
      role: 'VP Engineering',
      appliedDate: '2024-02-28',
      stage: 'Interview Phase',
      progress: 60,
      status: 'active',
    },
    {
      id: 2,
      company: 'Healthcare Innovation Labs',
      role: 'Chief Strategy Officer',
      appliedDate: '2024-02-25',
      stage: 'Screening',
      progress: 30,
      status: 'active',
    },
  ];

  const recommendedByOthers = [
    {
      id: 1,
      referrer: 'Sarah Chen',
      company: 'Emerging Tech Ventures',
      role: 'Head of Product',
      referredDate: '2024-02-27',
      stage: 'Initial Review',
      progress: 20,
    },
  ];

  const myReferrals = [
    {
      id: 1,
      candidate: 'Michael Torres',
      company: 'Enterprise Solutions Group',
      role: 'Director of Operations',
      referredDate: '2024-02-26',
      stage: 'Interview Phase',
      progress: 70,
      status: 'strong',
    },
    {
      id: 2,
      candidate: 'Jessica Patel',
      company: 'Sustainable Energy Partners',
      role: 'VP Business Development',
      referredDate: '2024-02-24',
      stage: 'Shortlist',
      progress: 85,
      status: 'strong',
    },
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return 'bg-emerald-600';
    if (progress >= 40) return 'bg-blue-600';
    return 'bg-amber-600';
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
        {/* Left Sidebar */}
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
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Referral Progress</span>
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

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Referral Progress Dashboard</h1>
              <p className="text-lg text-gray-600">
                Track your applications, referrals received, and candidates you've referred
              </p>
            </div>

            {/* Self Application Status */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Self Application Status</h2>
                  <p className="text-sm text-gray-600">Your direct campaign applications</p>
                </div>
              </div>

              <div className="space-y-4">
                {selfApplications.map(app => (
                  <div key={app.id} className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{app.role}</h3>
                        <p className="text-gray-600 font-semibold">{app.company}</p>
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-semibold">
                        {app.stage}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 font-semibold">Campaign Progress</span>
                        <span className="text-blue-600 font-bold">{app.progress}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-3">
                        <div
                          className={`${getProgressColor(app.progress)} rounded-full h-3 transition-all duration-500`}
                          style={{ width: `${app.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Applied on {new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended By Others */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Recommended By Others</h2>
                  <p className="text-sm text-gray-600">Campaigns where you've been referred by someone</p>
                </div>
              </div>

              <div className="space-y-4">
                {recommendedByOthers.map(referral => (
                  <div key={referral.id} className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-emerald-300 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{referral.role}</h3>
                        <p className="text-gray-600 font-semibold">{referral.company}</p>
                        <p className="text-sm text-gray-500 mt-1">Referred by <span className="font-semibold text-emerald-600">{referral.referrer}</span></p>
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-semibold">
                        {referral.stage}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 font-semibold">Campaign Progress</span>
                        <span className="text-emerald-600 font-bold">{referral.progress}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-3">
                        <div
                          className={`${getProgressColor(referral.progress)} rounded-full h-3 transition-all duration-500`}
                          style={{ width: `${referral.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Referred on {new Date(referral.referredDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* My Referrals */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">My Referrals</h2>
                  <p className="text-sm text-gray-600">Candidates you've referred to campaigns</p>
                </div>
              </div>

              <div className="space-y-4">
                {myReferrals.map(referral => (
                  <div key={referral.id} className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-300 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{referral.candidate}</h3>
                        <p className="text-gray-600 font-semibold">{referral.role} at {referral.company}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 rounded-lg bg-purple-100 text-purple-700 text-sm font-semibold">
                          {referral.stage}
                        </span>
                        {referral.status === 'strong' && (
                          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-semibold">
                            Strong Candidate
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 font-semibold">Campaign Progress</span>
                        <span className="text-purple-600 font-bold">{referral.progress}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-3">
                        <div
                          className={`${getProgressColor(referral.progress)} rounded-full h-3 transition-all duration-500`}
                          style={{ width: `${referral.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Referred on {new Date(referral.referredDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      {referral.progress >= 80 && (
                        <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Reward Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Stage & Feedback Updates */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Interview Stage Tracking</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Phone Screen</span>
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Technical Interview</span>
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 font-semibold">Hiring Manager Round</span>
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Final Executive Interview</span>
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Feedback Updates</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-700 font-semibold">Positive technical assessment</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-700 font-semibold">Moved to shortlist phase</p>
                      <p className="text-xs text-gray-500">5 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
