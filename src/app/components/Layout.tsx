import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Bell, User, X, Lock, LogOut, LayoutDashboard, FileText, Radar, Briefcase, SlidersHorizontal, FolderOpen, GraduationCap, ShieldAlert, Search, ChevronDown, UserCircle, Target, MessageSquare, BookOpen, CalendarDays, CreditCard } from "lucide-react";
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";
import { useState, useEffect } from "react";
import { useAuth } from "../../lib/auth-context";
import { mentorshipAPI, conversationsAPI, profileAPI } from "../../lib/api";

type Role = 'mentee' | 'mentor' | 'consultant';

interface RoleConfig {
  name: string;
  color: string;
  bgColor: string;
  hoverBg: string;
  borderColor: string;
  description: string;
}

const roleConfigs: Record<Role, RoleConfig> = {
  mentee: {
    name: 'Mentee',
    color: '#0A2463',
    bgColor: 'bg-[#0A2463]',
    hoverBg: 'hover:bg-[#0A2463]/10',
    borderColor: 'border-[#0A2463]',
    description: 'Access personalized mentorship, structured question flows, and track your 5D growth journey.',
  },
  mentor: {
    name: 'Mentor',
    color: '#059669',
    bgColor: 'bg-emerald-600',
    hoverBg: 'hover:bg-emerald-50',
    borderColor: 'border-emerald-600',
    description: 'Guide mentees, manage mentorship sessions, host workshops, and share your expertise.',
  },
  consultant: {
    name: 'Business Consultant',
    color: '#B45309',
    bgColor: 'bg-amber-700',
    hoverBg: 'hover:bg-amber-50',
    borderColor: 'border-amber-700',
    description: 'Provide strategic advisory to enterprises, manage consulting projects, and drive business outcomes.',
  },
};

function ProfileSubmenu({ currentPath }: { currentPath: string }) {
  const profilePaths = ['/app/mentee/profile-setup', '/app/5d-snapshot'];
  const isActive = profilePaths.some(p => currentPath.startsWith(p));
  const [open, setOpen] = useState(isActive);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive ? 'bg-[#0A2463]/10 text-[#0A2463]' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <span className="flex items-center gap-3">
          <UserCircle className="w-4 h-4" />
          My Profile
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="ml-7 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
          <Link
            to="/app/mentee/profile-setup"
            className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
              currentPath === '/app/mentee/profile-setup' ? 'text-[#0A2463] font-medium bg-[#0A2463]/5' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Update Profile
          </Link>
          <Link
            to="/app/5d-snapshot"
            className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
              currentPath === '/app/5d-snapshot' ? 'text-[#0A2463] font-medium bg-[#0A2463]/5' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            5D Snapshot
          </Link>
        </div>
      )}
    </div>
  );
}

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  // Derive current role from URL path
  const isMentorPath = location.pathname.includes('/mentor');
  const derivedRole: Role = isMentorPath ? 'mentor' : 'mentee';

  // Notifications functionality
  interface NotificationItem {
    id: string;
    type: 'request' | 'message';
    title: string;
    description: string;
    timestamp: string;
    link: string;
    read: boolean;
  }

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const items: NotificationItem[] = [];

        // 1. Fetch pending requests if mentor/admin
        if (user.role === 'mentor' || user.role === 'admin') {
          try {
            const requests = await mentorshipAPI.listRequests('mentor', 'pending');
            requests.forEach((req: any) => {
              items.push({
                id: `request_${req.id}`,
                type: 'request',
                title: 'New Mentorship Request',
                description: `${req.mentee_name || 'A mentee'} requested a session: "${req.topic || 'Mentorship Session'}"`,
                timestamp: req.created_at ? new Date(req.created_at).toLocaleDateString() : 'Just now',
                link: '/app/mentor/requests',
                read: false,
              });
            });
          } catch (err) {
            console.error('Failed to fetch request notifications:', err);
          }
        }

        // 2. Fetch unread messages
        try {
          const convos = await conversationsAPI.list();
          convos.forEach((convo: any) => {
            if (convo.unread_count > 0) {
              items.push({
                id: `message_${convo.id}`,
                type: 'message',
                title: `Unread from ${convo.counterparty_name || 'User'}`,
                description: convo.last_message || 'New message received',
                timestamp: convo.last_message_at ? new Date(convo.last_message_at).toLocaleDateString() : 'Just now',
                link: '/app/messages',
                read: false,
              });
            }
          });
        } catch (err) {
          console.error('Failed to fetch message notifications:', err);
        }

        setNotifications(items);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [user]);

  // Heartbeat: ping server every 30s so online status is accurate
  useEffect(() => {
    if (!user) return;
    // Send initial heartbeat immediately
    profileAPI.heartbeat().catch(() => {});
    const hbInterval = setInterval(() => {
      profileAPI.heartbeat().catch(() => {});
    }, 30_000);
    return () => clearInterval(hbInterval);
  }, [user]);
  
  // Role management state
  const userRole = (user?.role as Role) || 'mentee';
  const [activeRoles, setActiveRoles] = useState<Role[]>(() => {
    const roles = new Set<Role>([userRole]);
    // Mentors also have mentee access; mentees on mentor paths get mentor activated
    if (userRole === 'mentor') roles.add('mentee');
    if (userRole === 'mentee') roles.add('mentee');
    if (isMentorPath) roles.add('mentor');
    return Array.from(roles);
  });
  const [currentRole, setCurrentRole] = useState<Role>(() => {
    // Default to the user's actual role, override by URL path
    if (isMentorPath) return 'mentor';
    if (userRole === 'mentor') return 'mentor';
    return 'mentee';
  });
  // Keep currentRole in sync with URL, but respect user's actual role
  useEffect(() => {
    if (isMentorPath) {
      setCurrentRole('mentor');
    } else if (userRole === 'mentor') {
      // Mentor on non-mentor paths (e.g. /app/5d-snapshot) — stay as mentor
      setCurrentRole('mentor');
    } else {
      setCurrentRole(derivedRole);
    }
  }, [derivedRole, isMentorPath, userRole]);

  // Keep activeRoles synced when user finishes loading
  useEffect(() => {
    if (user) {
      const roles = new Set<Role>([user.role as Role]);
      if (user.role === 'mentor') {
        roles.add('mentee');
        roles.add('mentor');
      }
      setActiveRoles(Array.from(roles));
    }
  }, [user]);

  const [showActivationModal, setShowActivationModal] = useState(false);
  const [roleToActivate, setRoleToActivate] = useState<Role | null>(null);

  const handleRoleClick = (role: Role) => {
    if (activeRoles.includes(role)) {
      // Role is already active, switch to it
      setCurrentRole(role);
      // Navigate to the appropriate dashboard
      if (role === 'mentee') {
        navigate('/app/dashboard');
      } else if (role === 'mentor') {
        navigate('/app/mentor/dashboard');
      }
      // Add other role navigations as needed
    } else {
      // Role is not active, show activation modal
      setRoleToActivate(role);
      setShowActivationModal(true);
    }
  };

  const handleActivateRole = () => {
    if (roleToActivate) {
      setActiveRoles([...activeRoles, roleToActivate]);
      setCurrentRole(roleToActivate);
      setShowActivationModal(false);
      setRoleToActivate(null);
      // Navigate to the appropriate dashboard after activation
      if (roleToActivate === 'mentee') {
        navigate('/app/dashboard');
      } else if (roleToActivate === 'mentor') {
        navigate('/app/mentor/dashboard');
      }
      // Add other role navigations as needed
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Logo + Role Tabs */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                <img src={logo} alt="PhxNorth" className="h-8" />
                <span className="text-xl font-bold text-[#0A2463]">PhxNorth</span>
              </Link>
              
              {/* Global Role Switch Bar */}
              <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
                {(Object.keys(roleConfigs) as Role[]).map((role) => {
                  const config = roleConfigs[role];
                  const isActivated = activeRoles.includes(role);
                  const isCurrent = currentRole === role;
                  
                  if (isActivated) {
                    // Activated role - normal brand color
                    if (isCurrent) {
                      // Current active role - filled style
                      return (
                        <button
                          key={role}
                          onClick={() => handleRoleClick(role)}
                          className={`px-4 py-2 rounded-lg text-white font-medium transition-all ${config.bgColor}`}
                        >
                          {config.name}
                        </button>
                      );
                    } else {
                      // Activated but not current - outlined style
                      return (
                        <button
                          key={role}
                          onClick={() => handleRoleClick(role)}
                          className={`px-4 py-2 rounded-lg font-medium border-2 transition-all ${config.borderColor} ${config.hoverBg}`}
                          style={{ color: config.color }}
                        >
                          {config.name}
                        </button>
                      );
                    }
                  } else {
                    // NOT activated - red outline + lock icon
                    return (
                      <button
                        key={role}
                        onClick={() => handleRoleClick(role)}
                        className="px-4 py-2 rounded-lg font-medium border-2 border-red-400 text-red-600 hover:bg-red-50 transition-all flex items-center gap-1.5"
                      >
                        <Lock className="w-4 h-4" />
                        {config.name}
                      </button>
                    );
                  }
                })}
              </div>
            </div>

            {/* Right Side - Notifications + User */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </button>

                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-40 overflow-hidden">
                      {/* Header */}
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <span className="font-semibold text-gray-900 text-sm">Notifications</span>
                        {notifications.length > 0 && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                            {notifications.length} New
                          </span>
                        )}
                      </div>
                      {/* List */}
                      <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-gray-500">
                            <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2 animate-bounce" />
                            <p className="text-sm font-medium">All caught up!</p>
                            <p className="text-xs text-gray-400 mt-0.5">No new notifications</p>
                          </div>
                        ) : (
                          notifications.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                setShowNotifications(false);
                                navigate(item.link);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex gap-3 items-start"
                            >
                              <div className="mt-1 flex-shrink-0">
                                {item.type === 'request' ? (
                                  <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg">
                                    <FileText className="w-4 h-4" />
                                  </div>
                                ) : (
                                  <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg">
                                    <MessageSquare className="w-4 h-4" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-900">{item.title}</p>
                                <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{item.description}</p>
                                <p className="text-[10px] text-gray-400 mt-1">{item.timestamp}</p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <Link to="/app/profile" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {user?.full_name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || <User className="w-5 h-5" />}
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">{user?.full_name || user?.username || 'User'}</div>
                  <div className="text-xs text-gray-500">{user?.role || roleConfigs[currentRole].name}</div>
                </div>
              </Link>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-60 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] sticky top-[73px] self-start flex-shrink-0">
          <nav className="p-4 space-y-6">
            {user?.role === 'admin' ? (
              /* ── Admin Sidebar ── */
              <>
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Admin</h3>
                  <div className="space-y-1">
                    <Link
                      to="/app/admin"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === '/app/admin' ? 'bg-[#0A2463]/10 text-[#0A2463]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/app/admin/risk"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === '/app/admin/risk' ? 'bg-[#0A2463]/10 text-[#0A2463]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4" />
                      Risk Analysis
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              /* ── Mentee / Mentor Sidebar ── */
              <>
                {currentRole === 'mentor' ? (
                  /* ── Mentor Sidebar ── */
                  <div className="space-y-1">
                    <Link
                      to="/app/mentor/dashboard"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === '/app/mentor/dashboard' ? 'bg-[#0A2463]/10 text-[#0A2463]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Mentor Dashboard
                    </Link>

                    <Link
                      to="/app/mentor/requests"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === '/app/mentor/requests' ? 'bg-[#0A2463]/10 text-[#0A2463]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      Mentorship Requests
                    </Link>

                    <Link
                      to="/app/mentor/upcoming"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === '/app/mentor/upcoming' ? 'bg-[#0A2463]/10 text-[#0A2463]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <CalendarDays className="w-4 h-4" />
                      My Sessions
                    </Link>

                    <Link
                      to="/app/mentor/calendar"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === '/app/mentor/calendar' ? 'bg-[#0A2463]/10 text-[#0A2463]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Target className="w-4 h-4" />
                      Calendar
                    </Link>

                    <Link
                      to="/app/mentor/availability"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === '/app/mentor/availability' ? 'bg-[#0A2463]/10 text-[#0A2463]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      Availability
                    </Link>

                    <Link
                      to="/app/mentor/workshops"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === '/app/mentor/workshops' ? 'bg-[#0A2463]/10 text-[#0A2463]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      Workshops
                    </Link>

                    <Link
                      to="/app/mentor/consulting"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === '/app/mentor/consulting' ? 'bg-[#0A2463]/10 text-[#0A2463]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      Consulting Projects
                    </Link>

                    <Link
                      to="/app/messages"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === '/app/messages' ? 'bg-[#0A2463]/10 text-[#0A2463]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Messages
                    </Link>

                    <Link
                      to="/app/billing"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === '/app/billing' ? 'bg-[#0A2463]/10 text-[#0A2463]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      Billing
                    </Link>
                  </div>
                ) : (
                  /* ── Mentee Sidebar ── */
                  <div className="space-y-1">
                    <Link
                      to="/app/dashboard"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === '/app/dashboard' ? 'bg-[#0A2463]/10 text-[#0A2463]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>

                    <Link
                      to="/app/find-mentor"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === '/app/find-mentor' ? 'bg-[#0A2463]/10 text-[#0A2463]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Search className="w-4 h-4" />
                      Find Mentor
                    </Link>

                    {/* My Profile — collapsible */}
                    <ProfileSubmenu currentPath={location.pathname} />

                    <Link
                      to="/app/mentor/calendar"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === '/app/mentor/calendar' ? 'bg-[#0A2463]/10 text-[#0A2463]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Target className="w-4 h-4" />
                      Calendar
                    </Link>

                    <Link
                      to="/app/my-questions"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === '/app/my-questions' ? 'bg-[#0A2463]/10 text-[#0A2463]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      My Questions
                    </Link>

                    <Link
                      to="/app/question-entry?type=quick"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === '/app/question-entry' ? 'bg-[#0A2463]/10 text-[#0A2463]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Instant Mentorship
                    </Link>

                    <Link
                      to="/app/courses"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === '/app/courses' ? 'bg-[#0A2463]/10 text-[#0A2463]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      Courses
                    </Link>

                    <Link
                      to="/app/messages"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === '/app/messages' ? 'bg-[#0A2463]/10 text-[#0A2463]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Messages
                    </Link>

                    <Link
                      to="/app/billing"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === '/app/billing' ? 'bg-[#0A2463]/10 text-[#0A2463]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      Billing
                    </Link>
                  </div>
                )}
              </>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Role Activation Modal */}
      {showActivationModal && roleToActivate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            {/* Close button */}
            <button
              onClick={() => {
                setShowActivationModal(false);
                setRoleToActivate(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal content */}
            <div className="text-center mb-6">
              <div 
                className={`w-16 h-16 rounded-full ${roleConfigs[roleToActivate].bgColor} mx-auto mb-4 flex items-center justify-center`}
              >
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Activate {roleConfigs[roleToActivate].name} Role?
              </h2>
              <p className="text-gray-600">
                {roleConfigs[roleToActivate].description}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowActivationModal(false);
                  setRoleToActivate(null);
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleActivateRole}
                className={`flex-1 px-4 py-3 text-white rounded-lg font-medium transition-colors ${roleConfigs[roleToActivate].bgColor} hover:opacity-90`}
              >
                Activate Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}