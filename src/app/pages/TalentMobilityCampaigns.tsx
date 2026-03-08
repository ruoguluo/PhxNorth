import { Link } from 'react-router';
import { Settings, TrendingUp, Users, Bell, MapPin, Building2, Sparkles, Eye, Clock, CheckCircle } from 'lucide-react';
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";

export function TalentMobilityCampaigns() {
  const campaigns = [
    {
      id: 1,
      company: 'Global FinTech Corp',
      role: 'VP Engineering',
      location: 'Singapore / Remote',
      stage: 'Active - Screening',
      matchScore: 92,
      posted: '3 days ago',
    },
    {
      id: 2,
      company: 'Emerging Tech Ventures',
      role: 'Head of Product',
      location: 'San Francisco, CA',
      stage: 'Active - Interview Phase',
      matchScore: 88,
      posted: '1 week ago',
    },
    {
      id: 3,
      company: 'Enterprise Solutions Group',
      role: 'Director of Operations',
      location: 'London, UK',
      stage: 'Active - Accepting Applications',
      matchScore: 85,
      posted: '2 weeks ago',
    },
    {
      id: 4,
      company: 'Healthcare Innovation Labs',
      role: 'Chief Strategy Officer',
      location: 'Boston, MA',
      stage: 'Active - Shortlist Phase',
      matchScore: 90,
      posted: '4 days ago',
    },
    {
      id: 5,
      company: 'Sustainable Energy Partners',
      role: 'VP Business Development',
      location: 'Dubai, UAE',
      stage: 'Active - Accepting Applications',
      matchScore: 78,
      posted: '5 days ago',
    },
  ];

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    return 'text-amber-600 bg-amber-100';
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
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold transition-colors"
              >
                <Users className="w-4 h-4" />
                <span className="text-sm">Active Campaigns</span>
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

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Platform-Managed Hiring Campaigns</h1>
              <p className="text-lg text-gray-600 mb-6">
                Browse structured recruitment campaigns matched to your profile and preferences
              </p>
              
              {/* Info Banner */}
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-700 font-semibold mb-1">Professional Management Guarantee</p>
                    <p className="text-sm text-gray-600">
                      All campaigns are professionally managed by PhxNorth project managers to ensure transparency, stage clarity, and risk control.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaigns List */}
            <div className="space-y-6">
              {campaigns.map(campaign => (
                <div
                  key={campaign.id}
                  className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-emerald-300 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {campaign.company.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{campaign.role}</h3>
                          <p className="text-gray-600 font-semibold">{campaign.company}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-semibold">{campaign.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{campaign.posted}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-semibold">
                          <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></div>
                          {campaign.stage}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      {/* 5D Match Score */}
                      <div className={`${getMatchScoreColor(campaign.matchScore)} px-4 py-2 rounded-xl`}>
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          <div>
                            <div className="text-xs font-semibold">5D Match</div>
                            <div className="text-lg font-bold">{campaign.matchScore}%</div>
                          </div>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <button className="inline-flex items-center gap-2 bg-[#0A2463] text-white px-6 py-3 rounded-lg hover:bg-[#0A2463]/90 transition-all font-bold shadow-md hover:shadow-lg">
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State Message */}
            {campaigns.length === 0 && (
              <div className="bg-white rounded-2xl p-12 border-2 border-gray-200 text-center">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Campaigns Yet</h3>
                <p className="text-gray-600 mb-6">
                  Complete your preferences to receive matched campaign notifications
                </p>
                <Link
                  to="/talent-mobility-portal/preferences"
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition-all font-bold shadow-lg"
                >
                  Configure Preferences
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
