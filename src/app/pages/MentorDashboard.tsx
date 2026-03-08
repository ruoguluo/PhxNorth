import { useState, useRef, useEffect, useCallback } from 'react';
import { mentorshipAPI, profileAPI } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';
import {
  User,
  Sparkles,
  Calendar,
  Users,
  BookOpen,
  ToggleLeft,
  ToggleRight,
  Clock,
  Star,
  TrendingUp,
  DollarSign,
  Bell,
  CheckCircle,
  XCircle,
  PlusCircle,
  ChevronRight,
  ChevronDown,
  Video,
  MessageSquare,
  Award,
  Target,
  Zap,
  Briefcase,
  ArrowRight,
  BarChart3,
  Globe,
  FileText
} from 'lucide-react';

export function MentorDashboard() {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(user?.is_online ?? false);
  const [hasCourses, setHasCourses] = useState(false);
  const [isScheduledMentorshipOpen, setIsScheduledMentorshipOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'instant' | 'scheduled' | 'action'>('instant');
  const [viewMode, setViewMode] = useState<'mentorship' | 'enterprise'>('mentorship');
  const [isTalentMobilityEnabled, setIsTalentMobilityEnabled] = useState(false);
  const [isCommercialConsultationEnabled, setIsCommercialConsultationEnabled] = useState(false);

  // API data
  const [stats, setStats] = useState<any>(null);
  const [queue, setQueue] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [statsData, queueData, sessionsData, requestsData] = await Promise.all([
        mentorshipAPI.getStats(),
        mentorshipAPI.getQueue(),
        mentorshipAPI.listSessions('upcoming'),
        mentorshipAPI.listRequests('mentor', 'pending'),
      ]);
      setStats(statsData);
      setQueue(queueData);
      setSessions(sessionsData);
      setPendingRequests(requestsData);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleToggleOnline = async () => {
    try {
      const result = await profileAPI.toggleOnlineStatus();
      setIsOnline(result.is_online);
    } catch (err) {
      console.error('Failed to toggle online status:', err);
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await mentorshipAPI.respondToRequest(requestId, 'accept');
      fetchData();
    } catch (err) {
      console.error('Failed to accept request:', err);
    }
  };

  const handleDeclineRequest = async (requestId: number) => {
    try {
      await mentorshipAPI.respondToRequest(requestId, 'decline');
      fetchData();
    } catch (err) {
      console.error('Failed to decline request:', err);
    }
  };

  // Refs for enterprise sections
  const talentMobilityRef = useRef<HTMLDivElement>(null);
  const commercialConsultationRef = useRef<HTMLDivElement>(null);

  // Animation states
  const [talentMobilityJustActivated, setTalentMobilityJustActivated] = useState(false);
  const [commercialJustActivated, setCommercialJustActivated] = useState(false);

  // Mock user's activated roles - in production, this would come from user state
  const [activeRoles] = useState<('mentee' | 'mentor' | 'consultant')[]>(['mentee', 'mentor']);
  const [currentRole] = useState<'mentee' | 'mentor' | 'consultant'>('mentor');

  // Handler for Talent Mobility toggle with scroll and animation
  const handleTalentMobilityToggle = () => {
    const newState = !isTalentMobilityEnabled;
    setIsTalentMobilityEnabled(newState);

    if (newState) {
      // Trigger animation
      setTalentMobilityJustActivated(true);

      // Scroll to the section after a brief delay
      setTimeout(() => {
        talentMobilityRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }, 100);

      // Remove animation after 2 seconds
      setTimeout(() => {
        setTalentMobilityJustActivated(false);
      }, 2000);
    }
  };

  // Handler for Commercial Consultation toggle with scroll and animation
  const handleCommercialConsultationToggle = () => {
    const newState = !isCommercialConsultationEnabled;
    setIsCommercialConsultationEnabled(newState);

    if (newState) {
      // Trigger animation
      setCommercialJustActivated(true);

      // Scroll to the section after a brief delay
      setTimeout(() => {
        commercialConsultationRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }, 100);

      // Remove animation after 2 seconds
      setTimeout(() => {
        setCommercialJustActivated(false);
      }, 2000);
    }
  };

  const getRoleStyle = (role: 'mentee' | 'mentor' | 'consultant', isActive: boolean) => {
    const styles = {
      mentee: {
        bg: isActive ? 'bg-[#0A2463]' : 'bg-white border-2 border-[#0A2463]',
        text: isActive ? 'text-white' : 'text-[#0A2463]',
        hover: 'hover:opacity-90',
      },
      mentor: {
        bg: isActive ? 'bg-emerald-600' : 'bg-white border-2 border-emerald-600',
        text: isActive ? 'text-white' : 'text-emerald-600',
        hover: 'hover:opacity-90',
      },
      consultant: {
        bg: isActive ? 'bg-amber-700' : 'bg-white border-2 border-amber-700',
        text: isActive ? 'text-white' : 'text-amber-700',
        hover: 'hover:opacity-90',
      },
    };
    return styles[role];
  };

  const getRoleLabel = (role: 'mentee' | 'mentor' | 'consultant') => {
    const labels = {
      mentee: 'Mentee',
      mentor: 'Mentor',
      consultant: 'Consultant',
    };
    return labels[role];
  };

  const getRoleRoute = (role: 'mentee' | 'mentor' | 'consultant') => {
    const routes = {
      mentee: '/app/dashboard',
      mentor: '/app/mentor/dashboard',
      consultant: '/app/consultant/dashboard',
    };
    return routes[role];
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-4 flex-shrink-0">
        <div className="space-y-6">
          {/* Role Switcher */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
              Your Roles
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeRoles.map((role) => {
                const isActive = role === currentRole;
                const style = getRoleStyle(role, isActive);
                return (
                  <a
                    key={role}
                    href={getRoleRoute(role)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${style.bg} ${style.text} ${style.hover}`}
                  >
                    {getRoleLabel(role)}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* ACTIVATIONS Section */}
          <div>
            <div className="px-2 py-2 mb-3">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">ACTIVATIONS</span>
            </div>

            {/* Join Talent Mobility Card */}
            <div className="px-2 mb-3">
              <div
                className={`bg-[#F9FBFF] rounded-xl p-3 transition-all hover:shadow-md ${isTalentMobilityEnabled
                  ? 'border-2 border-emerald-500'
                  : 'border border-gray-200'
                  }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <Globe className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-xs font-semibold text-gray-900">Join Talent Mobility</h4>
                      <button
                        onClick={handleTalentMobilityToggle}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${isTalentMobilityEnabled ? 'bg-emerald-600' : 'bg-gray-300'
                          }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isTalentMobilityEnabled ? 'translate-x-5' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-600 leading-relaxed">
                      Access curated enterprise hiring campaigns and participate in global talent mobility opportunities.
                    </p>
                    {isTalentMobilityEnabled && (
                      <span className="inline-block mt-2 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Commercial Consultation Card */}
            <div className="px-2 mb-3">
              <div
                className={`bg-[#F9FBFF] rounded-xl p-3 transition-all hover:shadow-md ${isCommercialConsultationEnabled
                  ? 'border-2 border-emerald-500'
                  : 'border border-gray-200'
                  }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-xs font-semibold text-gray-900">Commercial Consultation</h4>
                      <button
                        onClick={handleCommercialConsultationToggle}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${isCommercialConsultationEnabled ? 'bg-emerald-600' : 'bg-gray-300'
                          }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isCommercialConsultationEnabled ? 'translate-x-5' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-600 leading-relaxed">
                      Participate in enterprise consulting projects and advisory engagements.
                    </p>
                    {isCommercialConsultationEnabled && (
                      <span className="inline-block mt-2 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Profile Section */}
          <div>
            <div className="px-2 py-2 mb-2">
              <span className="font-semibold text-gray-900">Profile</span>
            </div>
            <div className="space-y-1">
              <a href="#" className="block px-2 py-1.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                Update Profile
              </a>
              <a href="/app/5d-snapshot" className="block px-2 py-1.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                5D Snapshot
              </a>
            </div>
          </div>

          {/* MENTORSHIP Section Title */}
          <div>
            <div className="px-2 py-2 mb-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">MENTORSHIP</span>
            </div>
          </div>

          {/* My Mentorship Section */}
          <div>
            <div className="space-y-3">
              {/* Instant Mentorship */}
              <div>
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Instant Mentorship
                </div>
                <div className="space-y-1 ml-2">
                  <a href="/app/mentor/availability" className="block px-2 py-1.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors flex items-center justify-between">
                    <span>• Available Time Windows</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Scheduled Mentorship - Collapsible */}
              <div>
                <button
                  onClick={() => setIsScheduledMentorshipOpen(!isScheduledMentorshipOpen)}
                  className="w-full px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center justify-between hover:bg-gray-50 rounded transition-colors"
                >
                  <span>Scheduled Mentorship</span>
                  {isScheduledMentorshipOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {isScheduledMentorshipOpen && (
                  <div className="space-y-1 ml-2 mt-1">
                    <a
                      href="/app/mentor/requests"
                      className="block px-2 py-1.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors flex items-center justify-between"
                    >
                      <span>• Mentorship Requested</span>
                      <span className="bg-orange-600 text-white text-xs px-1.5 py-0.5 rounded-full">2</span>
                    </a>
                    <a
                      href="/app/mentor/upcoming"
                      className="block px-2 py-1.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors flex items-center justify-between"
                    >
                      <span>• Upcoming Sessions</span>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">3</span>
                    </a>
                    <a
                      href="/app/mentor/calendar"
                      className="block px-2 py-1.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                    >
                      • Calendar View
                    </a>
                  </div>
                )}
              </div>

              {/* My Mentees */}
              <div>
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  My Mentees
                </div>
                <div className="space-y-1 ml-2">
                  <a href="#" className="block px-2 py-1.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors flex items-center justify-between">
                    <span>• Active Long-term</span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">7</span>
                  </a>
                  <a href="#" className="block px-2 py-1.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                    • Past Mentees
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* My Workshops Section */}
          <div>
            <div className="px-2 py-2 mb-3">
              <span className="font-semibold text-gray-900">My Workshops</span>
            </div>

            {/* Workshop Studio Subsection */}
            <div className="mb-3">
              <div className="px-2 py-1 mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Workshop Studio</span>
              </div>

              {/* Horizontal Cards */}
              <div className="space-y-2 px-2">
                {/* Card 1 - Custom Workshops */}
                <a href="/app/mentor/workshops" className="bg-white border border-gray-200 rounded-lg p-2.5 hover:border-emerald-300 hover:shadow-sm transition-all block">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 leading-tight">Custom Workshops</h4>
                      <p className="text-xs text-gray-500 leading-tight mt-0.5">Create & manage your own sessions</p>
                    </div>
                    <span className="flex-shrink-0 text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded font-medium hover:bg-emerald-100 transition-colors">
                      Manage
                    </span>
                  </div>
                </a>

                {/* Card 2 - Platform Invitations */}
                <a href="/app/mentor/workshops" className="bg-white border border-gray-200 rounded-lg p-2.5 hover:border-emerald-300 hover:shadow-sm transition-all block">{/* Top Row: Title + Badge */}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 leading-tight">Platform Invitations</h4>
                    <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-200 font-medium flex-shrink-0">
                      New (2)
                    </span>
                  </div>

                  {/* Subtitle */}
                  <p className="text-xs text-gray-500 leading-tight mb-2">Matched workshop & enterprise opportunities</p>

                  {/* Bottom Row: Status + Button */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                      Available
                    </span>
                    <button className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded font-medium hover:bg-emerald-100 transition-colors flex-shrink-0">
                      Review Invitations
                    </button>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* My Courses Section */}
          <div>
            <div className="px-2 py-2 mb-2">
              <span className="font-semibold text-gray-900">My Courses</span>
            </div>
            {hasCourses ? (
              <div className="space-y-3">
                {/* My Classes */}
                <div>
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    My Classes
                  </div>
                  <div className="space-y-1 ml-2">
                    <a href="#" className="block px-2 py-1.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                      • Cohorts
                    </a>
                    <a href="#" className="block px-2 py-1.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                      • Schedule
                    </a>
                  </div>
                </div>

                {/* My Students */}
                <div>
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    My Students
                  </div>
                  <div className="space-y-1 ml-2">
                    <a href="#" className="block px-2 py-1.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors flex items-center justify-between">
                      <span>• Active</span>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">24</span>
                    </a>
                    <a href="#" className="block px-2 py-1.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                      • Completed
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-2 py-1.5">
                <a href="#" className="block text-sm text-gray-600 hover:text-emerald-600">
                  Create Your First Course
                </a>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 my-3"></div>

          {/* TALENT MOBILITY Section - Only shown when toggle is ON */}
          {isTalentMobilityEnabled && (
            <div
              ref={talentMobilityRef}
              className={`mx-2 mb-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 border-l-4 border-emerald-600 transition-all duration-500 ${talentMobilityJustActivated ? 'animate-pulse shadow-lg' : 'shadow-sm'
                }`}
            >
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">TALENT MOBILITY</span>
                </div>
              </div>

              <div className="space-y-1">
                <a
                  href="/app/mentor/talent-referral"
                  className="flex items-center gap-2 px-3 py-2 text-emerald-800 hover:bg-white/80 rounded-lg transition-all hover:shadow-sm group"
                >
                  <Target className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Role Preferences</span>
                </a>
                <a
                  href="/app/mentor/talent-mobility-progress"
                  className="flex items-center gap-2 px-3 py-2 text-emerald-800 hover:bg-white/80 rounded-lg transition-all hover:shadow-sm group"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Referral Progress</span>
                </a>
              </div>
            </div>
          )}

          {/* COMMERCIAL CONSULTATION Section - Only shown when toggle is ON */}
          {isCommercialConsultationEnabled && (
            <>
              {isTalentMobilityEnabled && <div className="border-t border-gray-200 my-3"></div>}

              <div
                ref={commercialConsultationRef}
                className={`mx-2 mb-3 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border-l-4 border-purple-600 transition-all duration-500 ${commercialJustActivated ? 'animate-pulse shadow-lg' : 'shadow-sm'
                  }`}
              >
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-purple-700" />
                    <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">COMMERCIAL CONSULTATION</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <a
                    href="/app/mentor/project-interests"
                    className="flex items-center gap-2 px-3 py-2 text-purple-800 hover:bg-white/80 rounded-lg transition-all hover:shadow-sm group"
                  >
                    <FileText className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Project Interests</span>
                  </a>
                  <a
                    href="/app/mentor/active-projects"
                    className="flex items-center gap-2 px-3 py-2 text-purple-800 hover:bg-white/80 rounded-lg transition-all hover:shadow-sm group"
                  >
                    <Briefcase className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Active Projects</span>
                  </a>
                  <a
                    href="/app/mentor/application-history"
                    className="flex items-center gap-2 px-3 py-2 text-purple-800 hover:bg-white/80 rounded-lg transition-all hover:shadow-sm group"
                  >
                    <Clock className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Application History</span>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header with Prominent Online/Offline Toggle */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentor Operations Center</h1>
            <p className="text-gray-600">Manage your mentorship practice, track reputation, and grow your impact</p>
          </div>

          {/* Large, Dominant Online/Offline Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleOnline}
              className={`flex items-center gap-4 px-8 py-4 rounded-2xl shadow-lg transition-all ${isOnline
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-gray-300 hover:bg-gray-400'
                }`}
            >
              <div className="text-left">
                <div className="text-white text-sm font-medium">Instant Mentorship</div>
                <div className="text-white text-2xl font-bold">
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </div>
              </div>
              {isOnline ? (
                <ToggleRight className="w-12 h-12 text-white" />
              ) : (
                <ToggleLeft className="w-12 h-12 text-white" />
              )}
            </button>
            {isOnline && (
              <div className="bg-orange-100 border-2 border-orange-300 rounded-lg px-4 py-2">
                <div className="text-orange-700 text-sm font-semibold">2 Requests Waiting</div>
                <div className="text-orange-600 text-xs">View in queue below</div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 1: Role Activation Panel */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unlock More Impact & Income</h2>
          <p className="text-gray-600 mb-6">Activate additional roles to expand your reach and opportunities</p>

          <div className="grid grid-cols-2 gap-6">
            {/* Enterprise Consulting */}
            <div className="bg-white rounded-xl border-2 border-blue-300 p-5 hover:border-blue-400 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-medium animate-pulse">
                  Opportunities Available
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Enterprise Consulting</h3>
              <p className="text-sm text-gray-600 mb-3">Lead advisory projects for organizations seeking expert guidance</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-900 font-semibold mb-1">Project Matches</p>
                <p className="text-lg font-bold text-blue-700">3 projects waiting</p>
              </div>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                View Projects
              </button>
            </div>

            {/* Workshop Speaker */}
            <div className="bg-white rounded-xl border-2 border-purple-300 p-5 hover:border-purple-400 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full font-medium animate-pulse">
                  2 Invitations Pending
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Workshop Speaker</h3>
              <p className="text-sm text-gray-600 mb-3">Lead group sessions and share expertise with multiple participants</p>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-purple-900 font-semibold mb-1">Pending Invitations</p>
                <p className="text-lg font-bold text-purple-700">2 requests to review</p>
              </div>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                Review Invitations
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: Performance Overview Cards (Refined) */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Sessions Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Video className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats?.sessions_this_week ?? 0}</h3>
            <p className="text-sm text-gray-600 mb-3">Sessions this week</p>
            <a href="#" className="text-xs text-emerald-600 hover:underline font-medium">
              View Details →
            </a>
          </div>

          {/* Active Mentees Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats?.active_mentees ?? 0}</h3>
            <p className="text-sm text-gray-600 mb-3">Active Mentees</p>
            <a href="#" className="text-xs text-emerald-600 hover:underline font-medium">
              View Details →
            </a>
          </div>

          {/* Reputation Score Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Star className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-bold text-gray-900">{stats?.average_rating?.toFixed(1) ?? '0.0'}</h3>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">Average rating</p>
            <a href="#" className="text-xs text-emerald-600 hover:underline font-medium">
              View Details →
            </a>
          </div>

          {/* Monthly Income Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">${stats?.monthly_income?.toLocaleString() ?? '0'}</h3>
            <p className="text-sm text-gray-600 mb-3">This month</p>
            <a href="#" className="text-xs text-emerald-600 hover:underline font-medium">
              View Details →
            </a>
          </div>
        </div>

        {/* Instant Mentorship Queue */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Instant Mentorship Queue</h2>
              <p className="text-sm text-gray-600">Real-time mentorship requests</p>
            </div>
            {!isOnline && (
              <button
                onClick={handleToggleOnline}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Go Online
              </button>
            )}
          </div>

          {isOnline ? (
            <div className="space-y-4">
              {queue.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">No instant requests at the moment.</div>
              ) : (
                queue.map((req: any) => (
                  <div key={req.id} className="border border-emerald-200 bg-emerald-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{req.mentee_name || 'Mentee'}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Topic: {req.topic}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {req.duration_minutes} min
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              ${req.price}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button onClick={() => handleDeclineRequest(req.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleAcceptRequest(req.id)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          Accept
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">You are currently offline</h3>
              <p className="text-gray-600 mb-4">Go online to receive instant mentorship requests</p>
              <button
                onClick={handleToggleOnline}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Go Online Now
              </button>
            </div>
          )}
        </div>

        {/* Scheduled Sessions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Scheduled Mentorship</h2>
            <div className="flex gap-3">
              <a
                href="/app/mentor/requests"
                className="px-4 py-2 bg-orange-50 border-2 border-orange-300 rounded-lg text-sm font-medium text-orange-700 hover:bg-orange-100 transition-colors flex items-center gap-2"
              >
                Mentorship Requested
                {pendingRequests.length > 0 && <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">{pendingRequests.length} New</span>}
              </a>
              <a
                href="/app/mentor/upcoming"
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                Upcoming Sessions
                <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">{sessions.length}</span>
              </a>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Calendar View
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {sessions.slice(0, 3).map((session: any) => (
              <a
                key={session.id}
                href={`/app/mentor/session/${session.id}`}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {(session.mentee_name || 'M').split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                      {session.mentee_name || 'Mentee'}
                    </h3>
                    <p className="text-sm text-gray-500">{session.topic || 'Mentorship Session'}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(session.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {session.duration_minutes} min
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${session.status === 'upcoming'
                    ? 'bg-emerald-100 text-emerald-700'
                    : session.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-amber-100 text-amber-700'
                    }`}>
                    {session.status === 'upcoming' ? 'Confirmed' : session.status}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Workshop Signals */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Workshop Signals</h2>
              <p className="text-sm text-gray-600">Topics matching your expertise</p>
            </div>
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
              2 New Matches
            </span>
          </div>

          <div className="space-y-4">
            {/* Workshop Signal 1 */}
            <div className="border-2 border-orange-200 bg-orange-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-600" />
                  <span className="text-xs bg-orange-600 text-white px-2 py-0.5 rounded-full font-medium">
                    New Match
                  </span>
                </div>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Product Strategy for B2B SaaS</h3>
              <p className="text-sm text-gray-600 mb-3">
                Enterprise is looking for workshop on implementing AI in product development workflows
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs bg-white px-2 py-1 rounded border border-orange-200">Product Strategy</span>
                <span className="text-xs bg-white px-2 py-1 rounded border border-orange-200">AI/ML</span>
                <span className="text-xs bg-white px-2 py-1 rounded border border-orange-200">B2B SaaS</span>
              </div>
              <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">
                Propose Workshop
              </button>
            </div>

            {/* Workshop Signal 2 */}
            <div className="border-2 border-orange-200 bg-orange-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-600" />
                  <span className="text-xs bg-orange-600 text-white px-2 py-0.5 rounded-full font-medium">
                    New Match
                  </span>
                </div>
                <span className="text-xs text-gray-500">1 day ago</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Leadership Transition Playbook</h3>
              <p className="text-sm text-gray-600 mb-3">
                Request for workshop on transitioning from IC to engineering leadership
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs bg-white px-2 py-1 rounded border border-orange-200">Leadership</span>
                <span className="text-xs bg-white px-2 py-1 rounded border border-orange-200">Engineering</span>
                <span className="text-xs bg-white px-2 py-1 rounded border border-orange-200">Career</span>
              </div>
              <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">
                Propose Workshop
              </button>
            </div>

            {/* Regular Workshop Opportunity */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-xs text-gray-500">3 days ago</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Product Discovery Methods</h3>
              <p className="text-sm text-gray-600 mb-3">
                Workshop request on customer research and product validation techniques
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Product</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Research</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Discovery</span>
              </div>
              <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                Propose Workshop
              </button>
            </div>
          </div>

          <button className="w-full mt-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium transition-colors">
            View All Signals
          </button>
        </div>

        {/* Enterprise Engagement Section - Only visible when Talent Mobility is enabled */}
        {isTalentMobilityEnabled && (
          <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">Enterprise Engagement</h2>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Left Side - KPI Cards */}
              <div className="col-span-1 space-y-4">
                {/* Active Referral Projects */}
                <div className="bg-white rounded-xl border border-amber-200 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Users className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">2</h3>
                  <p className="text-sm text-gray-600">Active Referral Projects</p>
                </div>

                {/* Active Consulting Projects */}
                <div className="bg-white rounded-xl border border-amber-200 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Briefcase className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">1</h3>
                  <p className="text-sm text-gray-600">Active Consulting Projects</p>
                </div>

                {/* Enterprise Earnings */}
                <div className="bg-white rounded-xl border border-amber-200 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">$12,450</h3>
                  <p className="text-sm text-gray-600">Enterprise Earnings</p>
                </div>

                {/* Pipeline Value */}
                <div className="bg-white rounded-xl border border-amber-200 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">$45,000</h3>
                  <p className="text-sm text-gray-600">Pipeline Value</p>
                </div>
              </div>

              {/* Right Side - Active Enterprise Projects */}
              <div className="col-span-2">
                <div className="bg-white rounded-xl border border-amber-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Active Enterprise Projects</h3>

                  <div className="space-y-4">
                    {/* Referral Project 1 */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">Interview</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Platform Managed</span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">TechCorp Solutions</h4>
                          <p className="text-sm text-gray-600">Senior Product Manager • Talent Referral</p>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>70%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                      <button className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
                        View Project Workspace
                      </button>
                    </div>

                    {/* Referral Project 2 */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">Screening</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Platform Managed</span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">InnovateLabs Inc</h4>
                          <p className="text-sm text-gray-600">Engineering Lead • Talent Referral</p>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>45%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      <button className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
                        View Project Workspace
                      </button>
                    </div>

                    {/* Consulting Project */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium">In Progress</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Platform Managed</span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">Global Ventures LLC</h4>
                          <p className="text-sm text-gray-600">Product Strategy Advisory • Business Consulting</p>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>60%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      <button className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
                        View Project Workspace
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}