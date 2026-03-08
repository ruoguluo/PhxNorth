import { Link } from 'react-router';
import { Settings, TrendingUp, Users, Bell, CheckCircle, AlertCircle, Info, Star } from 'lucide-react';
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";

export function TalentMobilityNotifications() {
  const notifications = [
    {
      id: 1,
      type: 'campaign_match',
      title: 'New Campaign Match',
      message: 'VP Engineering role at Global FinTech Corp matches your profile (92% match)',
      timestamp: '2 hours ago',
      read: false,
      icon: 'star',
    },
    {
      id: 2,
      type: 'status_update',
      title: 'Application Status Update',
      message: 'Your application for Head of Product at Emerging Tech Ventures moved to Interview Phase',
      timestamp: '5 hours ago',
      read: false,
      icon: 'check',
    },
    {
      id: 3,
      type: 'referral_received',
      title: 'You Have Been Referred',
      message: 'Sarah Chen referred you to Head of Product at Emerging Tech Ventures',
      timestamp: '1 day ago',
      read: false,
      icon: 'info',
    },
    {
      id: 4,
      type: 'referral_update',
      title: 'Referral Progress Update',
      message: 'Michael Torres (your referral) moved to Shortlist phase at Enterprise Solutions Group',
      timestamp: '1 day ago',
      read: true,
      icon: 'check',
    },
    {
      id: 5,
      type: 'campaign_closing',
      title: 'Campaign Closing Soon',
      message: 'Director of Operations at Enterprise Solutions Group closes in 3 days',
      timestamp: '2 days ago',
      read: true,
      icon: 'alert',
    },
    {
      id: 6,
      type: 'campaign_match',
      title: 'New Campaign Match',
      message: 'Chief Strategy Officer at Healthcare Innovation Labs matches your profile (90% match)',
      timestamp: '3 days ago',
      read: true,
      icon: 'star',
    },
    {
      id: 7,
      type: 'status_update',
      title: 'Screening Complete',
      message: 'Your application for VP Engineering at Global FinTech Corp passed initial screening',
      timestamp: '4 days ago',
      read: true,
      icon: 'check',
    },
  ];

  const getIconComponent = (type: string) => {
    switch (type) {
      case 'star':
        return <Star className="w-5 h-5 text-amber-600" />;
      case 'check':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getIconBgColor = (type: string) => {
    switch (type) {
      case 'star':
        return 'bg-amber-100';
      case 'check':
        return 'bg-emerald-100';
      case 'alert':
        return 'bg-orange-100';
      case 'info':
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
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
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">Referral Progress</span>
              </Link>
              
              <Link
                to="/talent-mobility-portal/notifications"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="text-sm">Notifications</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Notifications</h1>
                <p className="text-lg text-gray-600">
                  Stay updated on campaign matches, application status, and referral progress
                </p>
              </div>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Mark all as read
              </button>
            </div>

            {/* Unread Count */}
            <div className="mb-6 bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-semibold text-gray-900">
                  You have <span className="text-blue-600">{notifications.filter(n => !n.read).length} unread notifications</span>
                </p>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-2xl p-6 border-2 transition-all hover:shadow-md ${
                    notification.read
                      ? 'border-gray-200'
                      : 'border-blue-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`${getIconBgColor(notification.icon)} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                      {getIconComponent(notification.icon)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-bold ${notification.read ? 'text-gray-900' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0 mt-1.5"></div>
                        )}
                      </div>
                      <p className={`text-sm mb-2 ${notification.read ? 'text-gray-600' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">{notification.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {notifications.length === 0 && (
              <div className="bg-white rounded-2xl p-12 border-2 border-gray-200 text-center">
                <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Notifications Yet</h3>
                <p className="text-gray-600">
                  You'll receive updates about campaign matches and application progress here
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}