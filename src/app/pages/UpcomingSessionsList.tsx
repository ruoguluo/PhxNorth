import { 
  Calendar, 
  Clock, 
  MessageSquare, 
  ChevronRight, 
  Filter,
  Search
} from 'lucide-react';

export function UpcomingSessionsList() {
  const sessions = [
    {
      id: 1,
      mentee: {
        name: 'Sarah Johnson',
        avatar: 'SJ',
        role: 'Founder',
        industry: 'B2B SaaS'
      },
      date: 'Today, March 1',
      time: '2:00 PM',
      duration: '60 min',
      status: 'Confirmed',
      statusColor: 'emerald',
      hasNewMessage: false,
      unreadCount: 0,
      compatibility: 94
    },
    {
      id: 2,
      mentee: {
        name: 'Michael Chen',
        avatar: 'MC',
        role: 'Analyst',
        industry: 'FinTech'
      },
      date: 'Tomorrow, March 2',
      time: '10:00 AM',
      duration: '45 min',
      status: 'In Preparation',
      statusColor: 'blue',
      hasNewMessage: false,
      unreadCount: 0,
      compatibility: 87
    },
    {
      id: 3,
      mentee: {
        name: 'Emma Rodriguez',
        avatar: 'ER',
        role: 'Product Manager',
        industry: 'Enterprise Software'
      },
      date: 'Monday, March 3',
      time: '3:00 PM',
      duration: '60 min',
      status: 'Waiting for Mentee',
      statusColor: 'amber',
      hasNewMessage: true,
      unreadCount: 2,
      compatibility: 91
    },
    {
      id: 4,
      mentee: {
        name: 'David Kim',
        avatar: 'DK',
        role: 'Engineering Lead',
        industry: 'AI/ML'
      },
      date: 'Tuesday, March 4',
      time: '11:00 AM',
      duration: '60 min',
      status: 'Waiting for Mentor',
      statusColor: 'orange',
      hasNewMessage: true,
      unreadCount: 1,
      compatibility: 89
    },
    {
      id: 5,
      mentee: {
        name: 'Priya Patel',
        avatar: 'PP',
        role: 'Student',
        industry: 'Career Transition'
      },
      date: 'Wednesday, March 5',
      time: '4:30 PM',
      duration: '30 min',
      status: 'Confirmed',
      statusColor: 'emerald',
      hasNewMessage: false,
      unreadCount: 0,
      compatibility: 82
    },
    {
      id: 6,
      mentee: {
        name: 'Alex Thompson',
        avatar: 'AT',
        role: 'Founder',
        industry: 'HealthTech'
      },
      date: 'Thursday, March 6',
      time: '1:00 PM',
      duration: '45 min',
      status: 'In Preparation',
      statusColor: 'blue',
      hasNewMessage: false,
      unreadCount: 0,
      compatibility: 93
    }
  ];

  const getStatusStyles = (color: string) => {
    const styles: Record<string, string> = {
      emerald: 'bg-emerald-100 text-emerald-700',
      blue: 'bg-blue-100 text-blue-700',
      amber: 'bg-amber-100 text-amber-700',
      orange: 'bg-orange-100 text-orange-700'
    };
    return styles[color] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Sessions</h1>
          <p className="text-gray-600">Your scheduled mentorship sessions</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by mentee name or industry..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {sessions.map((session) => (
            <div 
              key={session.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-6">
                {/* Left: Mentee Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-lg font-semibold flex-shrink-0">
                    {session.mentee.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {session.mentee.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {session.mentee.role}
                      </span>
                      <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {session.mentee.industry}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span>5D Score:</span>
                        <span className="font-semibold text-emerald-600">{session.compatibility}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center: Session Details */}
                <div className="flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{session.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{session.time} · {session.duration}</span>
                    </div>
                    <div className="mt-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium ${getStatusStyles(session.statusColor)}`}>
                        {session.hasNewMessage && (
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                        {session.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                  <a
                    href={`/app/mentor/session/${session.id}`}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    View Session
                  </a>
                  <a
                    href={`/app/mentor/session/${session.id}#messages`}
                    className="relative p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                    {session.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-medium">
                        {session.unreadCount}
                      </span>
                    )}
                  </a>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="px-6 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium transition-colors">
            Load More Sessions
          </button>
        </div>
      </div>
    </div>
  );
}
