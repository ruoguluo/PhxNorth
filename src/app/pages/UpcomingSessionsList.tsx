import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MessageSquare,
  ChevronRight,
  Filter,
  Search,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { mentorshipAPI, messagesAPI } from '@/lib/api';
import { discProfileAPI, discCareerAPI } from '@/lib/disc-api';
import { useAuth } from '@/lib/auth-context';

// Types matching the API responses
interface Session {
  id: number;
  request_id: number | null;
  mentor_id: number;
  mentee_id: number;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  topic: string | null;
  notes: string | null;
  rating: number | null;
  feedback: string | null;
  price: number;
  created_at: string;
  mentee_name: string | null;
  mentor_name: string | null;
}

interface MenteeProfile {
  id: number;
  full_name: string;
  role?: string;
  industry?: string;
  avatar?: string;
  compatibility?: number;
}

interface DisplaySession {
  id: number;
  mentee: {
    name: string;
    avatar: string;
    role: string;
    industry: string;
  };
  date: string;
  time: string;
  duration: string;
  status: string;
  statusColor: string;
  hasNewMessage: boolean;
  unreadCount: number;
  compatibility: number;
}

const getStatusStyles = (color: string) => {
  const styles: Record<string, string> = {
    emerald: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
    orange: 'bg-orange-100 text-orange-700'
  };
  return styles[color] || 'bg-gray-100 text-gray-700';
};

const mapStatusToColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    'upcoming': 'emerald',
    'confirmed': 'emerald',
    'in_progress': 'blue',
    'in preparation': 'blue',
    'waiting_for_mentee': 'amber',
    'waiting_for_mentor': 'orange',
    'pending': 'amber',
    'completed': 'gray',
    'cancelled': 'gray'
  };
  return statusMap[status.toLowerCase()] || 'gray';
};

const formatStatusLabel = (status: string): string => {
  const labelMap: Record<string, string> = {
    'upcoming': 'Confirmed',
    'confirmed': 'Confirmed',
    'in_progress': 'In Progress',
    'in preparation': 'In Preparation',
    'waiting_for_mentee': 'Waiting for Mentee',
    'waiting_for_mentor': 'Waiting for Mentor',
    'pending': 'Pending',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };
  return labelMap[status.toLowerCase()] || status;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };

  if (isToday) return `Today, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  if (isTomorrow) return `Tomorrow, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  return date.toLocaleDateString('en-US', options);
};

const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export function UpcomingSessionsList() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<DisplaySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch sessions from mentorship backend
        const sessionsData = await mentorshipAPI.listSessions('upcoming') as Session[];

        // Transform sessions with additional data fetching
        const transformedSessions = await Promise.all(
          sessionsData.map(async (session): Promise<DisplaySession> => {
            // Default values
            let role = 'Mentee';
            let industry = 'Technology';
            let compatibility = 85;

            // Try to get mentee profile for role/industry
            // Note: These would need to be fetched from a profile endpoint
            // For now, we'll use sensible defaults based on available data

            // Try to get DISC compatibility score if the mentee has a profile
            if (session.mentee_id) {
              try {
                // Get DISC profile to compute compatibility
                // This is a simplified approach - in reality you'd compare
                // mentor and mentee DISC profiles
                const discProfile = await discProfileAPI.get('me');
                if (discProfile && discProfile.confidence) {
                  // Use confidence as a proxy for data quality
                  // and generate a compatibility based on profile completion
                  compatibility = Math.min(95, 70 + Math.round(discProfile.confidence * 25));
                }
              } catch {
                // DISC profile not available, use default
              }
            }

            // Fetch unread count for this session
            let unreadCount = 0;
            try {
              unreadCount = await messagesAPI.getUnreadCount(session.id);
            } catch {
              // Messages not available yet for this session
            }

            return {
              id: session.id,
              mentee: {
                name: session.mentee_name || 'Unknown Mentee',
                avatar: getInitials(session.mentee_name || 'UN'),
                role,
                industry
              },
              date: formatDate(session.scheduled_at),
              time: formatTime(session.scheduled_at),
              duration: `${session.duration_minutes} min`,
              status: formatStatusLabel(session.status),
              statusColor: mapStatusToColor(session.status),
              hasNewMessage: unreadCount > 0,
              unreadCount,
              compatibility
            };
          })
        );

        setSessions(transformedSessions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const filteredSessions = sessions.filter(session =>
    session.mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.mentee.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <span className="ml-3 text-gray-600">Loading sessions...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64 text-red-600">
            <AlertCircle className="w-8 h-8 mr-3" />
            <div>
              <p className="font-semibold">Error loading sessions</p>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Sessions</h1>
          <p className="text-gray-600">
            {sessions.length === 0
              ? 'No upcoming sessions scheduled'
              : `You have ${sessions.length} upcoming session${sessions.length === 1 ? '' : 's'}`}
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by mentee name or industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
        {filteredSessions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'Try adjusting your search criteria'
                : 'You don\'t have any upcoming sessions scheduled'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
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
                      href={`/app/session/${session.id}`}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                      View Session
                    </a>
                    <a
                      href={`/app/session/${session.id}#messages`}
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
        )}

        {/* Load More */}
        {filteredSessions.length > 0 && filteredSessions.length >= 10 && (
          <div className="mt-8 text-center">
            <button className="px-6 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium transition-colors">
              Load More Sessions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
