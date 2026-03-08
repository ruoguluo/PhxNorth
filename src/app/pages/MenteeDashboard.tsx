import { Calendar, BookOpen, TrendingUp, FileText, Bell, CheckCircle, Clock, AlertTriangle, User, ChevronRight, ChevronDown, Target, Users, BarChart3, Sparkles, ArrowRight, MessageSquare, Video, Award, Zap, Globe, MapPin, Briefcase, Building2 } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { mentorshipAPI } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';

export function MenteeDashboard() {
  const { user } = useAuth();
  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    mentorship: true,
    courses: true,
    referrals: true,
    completedMentorship: false,
    talentMobility: false,
    commercialConsultation: false,
  });

  // API data
  const [sessions, setSessions] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [completedSessions, setCompletedSessions] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [sessionsData, reqData, completedData] = await Promise.all([
        mentorshipAPI.listSessions('upcoming'),
        mentorshipAPI.listRequests('mentee'),
        mentorshipAPI.listSessions('completed'),
      ]);
      setSessions(sessionsData);
      setRequests(reqData);
      setCompletedSessions(completedData);
    } catch (err) {
      console.error('Failed to fetch mentee data:', err);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // View mode: 'personal', 'talentMobility', or 'commercialConsultation'
  const [viewMode, setViewMode] = useState<'personal' | 'talentMobility' | 'commercialConsultation'>('personal');

  // Talent Mobility state management
  const [talentMobilityJoined, setTalentMobilityJoined] = useState(false);
  const [talentMobilityView, setTalentMobilityView] = useState<'default' | 'onboarding' | 'setup' | 'dashboard' | 'referrals'>('default');
  const [isTalentMobilityEnabled, setIsTalentMobilityEnabled] = useState(true);
  const [isCommercialConsultationEnabled, setIsCommercialConsultationEnabled] = useState(true);

  // Refs for enterprise sections
  const talentMobilityRef = useRef<HTMLDivElement>(null);
  const commercialConsultationRef = useRef<HTMLDivElement>(null);

  // Animation states
  const [talentMobilityJustActivated, setTalentMobilityJustActivated] = useState(false);
  const [commercialJustActivated, setCommercialJustActivated] = useState(false);

  const [preferences, setPreferences] = useState({
    countries: [] as string[],
    industries: [] as string[],
    markets: [] as string[],
    functions: [] as string[],
    seniority: [] as string[],
  });

  // Mock user's activated roles - in production, this would come from user state
  const [activeRoles] = useState<('mentee' | 'mentor' | 'consultant')[]>(['mentee', 'mentor']);
  const [currentRole] = useState<'mentee' | 'mentor' | 'consultant'>('mentee');

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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

  const handleJoinTalentMobility = () => {
    setTalentMobilityView('onboarding');
  };

  const handleConfirmJoin = () => {
    setTalentMobilityView('setup');
  };

  const handleSavePreferences = () => {
    setTalentMobilityJoined(true);
    setTalentMobilityView('dashboard');
  };

  const handleSkipPreferences = () => {
    setTalentMobilityJoined(true);
    setTalentMobilityView('dashboard');
  };

  const togglePreference = (category: keyof typeof preferences, value: string) => {
    setPreferences(prev => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const countryOptions = ['United States', 'United Kingdom', 'Canada', 'Germany', 'Singapore', 'Australia'];
  const industryOptions = ['Technology', 'Financial Services', 'Healthcare', 'Manufacturing', 'Retail', 'Energy'];
  const marketOptions = ['North America', 'Europe', 'Asia Pacific', 'Middle East'];
  const functionOptions = ['Engineering', 'Product Management', 'Sales', 'Marketing', 'Operations', 'Finance'];
  const seniorityOptions = ['Senior IC', 'Manager', 'Senior Manager', 'Director', 'VP', 'C-Level'];

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
    <div className="flex gap-6 max-w-[1600px] mx-auto">
      {/* Left Sidebar - Mentee Tools */}
      <aside className="w-64 flex-shrink-0">
        <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
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

          <div className="border-t border-gray-200 mb-4"></div>

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
                  <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                    <Globe className="w-4 h-4 text-emerald-600" />
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

          <div className="border-t border-gray-200 mb-4"></div>

          {/* MENTEE TOOLS Section Header */}
          <div className="px-2 py-2 mb-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">MENTEE TOOLS</span>
          </div>

          {/* Dashboard Overview */}
          <div className="mb-2">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setViewMode('personal'); }}
              className="flex items-center gap-2 px-2 py-2 text-gray-600 hover:bg-blue-50 hover:text-[#0A2463] rounded-lg transition-colors border-l-2 border-transparent hover:border-[#0A2463]"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm">Dashboard</span>
            </a>
          </div>

          {/* Profile Section */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection('profile')}
              className="flex items-center justify-between w-full px-2 py-2 text-gray-600 hover:bg-blue-50 hover:text-[#0A2463] rounded-lg transition-colors border-l-2 border-transparent hover:border-[#0A2463]"
            >
              <span className="font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">My Profile</span>
              </span>
              {expandedSections.profile ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {expandedSections.profile && (
              <div className="ml-6 mt-1 space-y-1">
                <a href="#" className="block px-2 py-1.5 text-sm text-gray-600 hover:text-[#0A2463] hover:bg-blue-50 rounded transition-colors border-l-2 border-transparent hover:border-blue-300">
                  Update Profile
                </a>
                <a href="/app/5d-snapshot" className="block px-2 py-1.5 text-sm text-gray-600 hover:text-[#0A2463] hover:bg-blue-50 rounded transition-colors border-l-2 border-transparent hover:border-blue-300">
                  5D Snapshot
                </a>
              </div>
            )}
          </div>
          <div className="border-t border-gray-200 my-3"></div>

          {/* Scheduled Mentorship Section */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection('mentorship')}
              className="flex items-center justify-between w-full px-2 py-2 text-gray-600 hover:bg-blue-50 hover:text-[#0A2463] rounded-lg transition-colors border-l-2 border-transparent hover:border-[#0A2463]"
            >
              <span className="font-medium flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span className="text-sm">Scheduled Mentorship</span>
              </span>
              {expandedSections.mentorship ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {expandedSections.mentorship && (
              <div className="ml-6 mt-1 space-y-1">
                <a href="#" className="block px-2 py-1.5 text-sm text-gray-600 hover:text-[#0A2463] hover:bg-blue-50 rounded transition-colors border-l-2 border-transparent hover:border-blue-300 flex items-center justify-between">
                  <span>Ongoing Mentorship</span>
                  <span className="text-xs bg-[#0A2463] text-white px-1.5 py-0.5 rounded-full">3</span>
                </a>
                <a href="#" className="block px-2 py-1.5 text-sm text-gray-600 hover:text-[#0A2463] hover:bg-blue-50 rounded transition-colors border-l-2 border-transparent hover:border-blue-300 flex items-center justify-between">
                  <span>Completed Mentorship</span>
                  <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">7</span>
                </a>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 my-3"></div>

          {/* Instant Mentorship */}
          <div className="mb-4">
            <a
              href="#"
              className="flex items-center gap-2 px-2 py-2 text-gray-600 hover:bg-blue-50 hover:text-[#0A2463] rounded-lg transition-colors border-l-2 border-transparent hover:border-[#0A2463]"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">Instant Mentorship</span>
            </a>
          </div>

          <div className="border-t border-gray-200 my-3"></div>

          {/* Mentorship Courses Section */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection('courses')}
              className="flex items-center justify-between w-full px-2 py-2 text-gray-600 hover:bg-blue-50 hover:text-[#0A2463] rounded-lg transition-colors border-l-2 border-transparent hover:border-[#0A2463]"
            >
              <span className="font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">Mentorship Courses</span>
              </span>
              {expandedSections.courses ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {expandedSections.courses && (
              <div className="ml-6 mt-1 space-y-1">
                <a href="#" className="block px-2 py-1.5 text-sm text-gray-600 hover:text-[#0A2463] hover:bg-blue-50 rounded transition-colors border-l-2 border-transparent hover:border-blue-300 flex items-center justify-between">
                  <span>Enrolled Courses</span>
                  <span className="text-xs bg-[#0A2463] text-white px-1.5 py-0.5 rounded-full">2</span>
                </a>
                <a href="#" className="block px-2 py-1.5 text-sm text-gray-600 hover:text-[#0A2463] hover:bg-blue-50 rounded transition-colors border-l-2 border-transparent hover:border-blue-300">
                  Course Library
                </a>
              </div>
            )}
          </div>

          {/* TALENT MOBILITY Section - Only shown when toggle is ON */}
          {isTalentMobilityEnabled && (
            <>
              <div className="border-t border-gray-200 my-3"></div>

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
                    href="#"
                    onClick={(e) => { e.preventDefault(); setViewMode('talentMobility'); }}
                    className="flex items-center gap-2 px-3 py-2 text-emerald-800 hover:bg-white/80 rounded-lg transition-all hover:shadow-sm group"
                  >
                    <Target className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Job Alerts Setup</span>
                  </a>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setViewMode('talentMobility'); }}
                    className="flex items-center gap-2 px-3 py-2 text-emerald-800 hover:bg-white/80 rounded-lg transition-all hover:shadow-sm group"
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Referral Progress</span>
                  </a>
                </div>
              </div>
            </>
          )}

          {/* COMMERCIAL CONSULTATION Section - Only shown when toggle is ON */}
          {isCommercialConsultationEnabled && (
            <>
              <div className="border-t border-gray-200 my-3"></div>

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
                    href="#"
                    onClick={(e) => { e.preventDefault(); setViewMode('commercialConsultation'); }}
                    className="flex items-center gap-2 px-3 py-2 text-purple-800 hover:bg-white/80 rounded-lg transition-all hover:shadow-sm group"
                  >
                    <FileText className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Project Interests Setup</span>
                  </a>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setViewMode('commercialConsultation'); }}
                    className="flex items-center gap-2 px-3 py-2 text-purple-800 hover:bg-white/80 rounded-lg transition-all hover:shadow-sm group"
                  >
                    <Briefcase className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Advisory Projects</span>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Main Dashboard Content */}
      <div className="flex-1 space-y-6">

        {/* PERSONAL GROWTH VIEW */}
        {viewMode === 'personal' && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900">Personal Growth & Mentorship Control Center</h1>
                <p className="text-gray-600 mt-1">Track your mentorship journey and learning progress</p>
              </div>
            </div>

            {/* Personal Growth Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 bg-[#0A2463] rounded-full"></div>
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Personal Growth</h2>
              </div>

              {/* PROMINENT QUESTION ENTRY SECTION */}
              <div className="bg-gradient-to-br from-[#0A2463] to-[#1e40af] rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">What would you like to solve today?</h2>
                    <p className="text-blue-200">Choose your approach based on complexity and desired depth</p>
                  </div>
                  <Sparkles className="w-12 h-12 text-blue-200 opacity-50" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Structured Question Button */}
                  <a
                    href="/app/question-entry"
                    className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 border-2 border-white/30 hover:border-white/50 rounded-xl p-6 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-3 rounded-lg group-hover:bg-white/30 transition-colors">
                        <Target className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                          Structured Question
                          <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        <p className="text-blue-100 text-sm leading-relaxed">
                          Define objectives, get AI-powered decomposition, and strategic mentorship sessions
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-blue-200">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Best for complex decisions</span>
                        </div>
                      </div>
                    </div>
                  </a>

                  {/* Quick Question Button */}
                  <a
                    href="/app/question-entry"
                    className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 border-2 border-white/30 hover:border-white/50 rounded-xl p-6 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-3 rounded-lg group-hover:bg-white/30 transition-colors">
                        <Zap className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                          Quick Question
                          <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        <p className="text-blue-100 text-sm leading-relaxed">
                          Ask directly, auto-detect domain, and get matched with mentors immediately
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-blue-200">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Best for tactical questions</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* TOP SECTION — Growth Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Active Mentorship Questions */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-[#0A2463]" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{requests.filter(r => (r as any).status === 'pending' || (r as any).status === 'accepted').length}</div>
                  <div className="text-sm text-gray-600 mb-4">Active Mentorship Questions</div>
                  <button className="w-full bg-[#0A2463] text-white px-4 py-2 rounded-lg hover:bg-[#0A2463]/90 transition-colors text-sm flex items-center justify-center gap-2">
                    Continue Question Flow
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Card 2: Mentor Matches */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{sessions.length}</div>
                  <div className="text-sm text-gray-600 mb-4">Active Mentor Matches</div>
                  <button className="w-full border-2 border-[#0A2463] text-[#0A2463] px-4 py-2 rounded-lg hover:bg-[#0A2463] hover:text-white transition-colors text-sm flex items-center justify-center gap-2">
                    View Mentors
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Card 3: 5D Growth Progress */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">72%</div>
                  <div className="text-sm text-gray-600 mb-3">5D Growth Progress</div>
                  {/* Mini 5D visualization */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">85%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">70%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">65%</span>
                    </div>
                  </div>
                </div>

                {/* Card 4: Upcoming Session */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <Video className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{sessions[0] ? (() => { const diff = new Date(sessions[0].scheduled_at).getTime() - Date.now(); const h = Math.floor(diff / 3600000); const m = Math.floor((diff % 3600000) / 60000); return h > 0 ? `${h}h ${m}m` : `${m}m`; })() : '--'}</div>
                  <div className="text-sm text-gray-600 mb-1">Next Session</div>
                  <div className="text-xs text-gray-500 mb-3">with {sessions[0]?.mentor_name || sessions[0]?.mentee_name || 'TBD'}</div>
                  <div className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded inline-block">
                    {sessions[0] ? new Date(sessions[0].scheduled_at).toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' }) : 'No upcoming'}
                  </div>
                </div>
              </div>

              {/* SECTION 2 — Active Mentorship Tracks */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-gray-900">Active Mentorship Tracks</h2>
                  <span className="text-sm text-gray-500">{sessions.length} in progress</span>
                </div>
                <div className="space-y-4">
                  <MentorshipTrackCard
                    topic="How do I transition from IC to Engineering Manager?"
                    mentor="Sarah Johnson"
                    mentorRole="VP of Engineering at TechCorp"
                    phase="Execution"
                    phaseStep="2 of 3"
                    progress={65}
                    nextSession="Today, 3:00 PM"
                    status="On Track"
                    statusColor="green"
                  />
                  <MentorshipTrackCard
                    topic="Building scalable microservices architecture"
                    mentor="Dr. Michael Chen"
                    mentorRole="Principal Architect at CloudScale"
                    phase="Strategy"
                    phaseStep="1 of 3"
                    progress={35}
                    nextSession="Tomorrow, 10:00 AM"
                    status="Needs Input"
                    statusColor="orange"
                  />
                  <MentorshipTrackCard
                    topic="Developing executive presence and leadership style"
                    mentor="Emily Williams"
                    mentorRole="Leadership Coach & Former CTO"
                    phase="Review"
                    phaseStep="3 of 3"
                    progress={85}
                    nextSession="Friday, 2:00 PM"
                    status="On Track"
                    statusColor="green"
                  />
                </div>
              </div>

              {/* Mentorship History (Collapsible) */}
              <div className="bg-white rounded-xl border border-gray-200">
                <button
                  onClick={() => toggleSection('completedMentorship')}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-gray-400" />
                    <h2 className="text-gray-900">Completed Mentorship</h2>
                    <span className="text-sm text-gray-500">({completedSessions.length} total)</span>
                  </div>
                  {expandedSections.completedMentorship ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                </button>
                {expandedSections.completedMentorship && (
                  <div className="px-6 pb-6 space-y-3 border-t border-gray-200 pt-4">
                    <CompletedMentorshipCard
                      topic="Migrating monolith to microservices"
                      mentor="James Rodriguez"
                      outcome="Successfully implemented migration strategy, reduced deploy time by 60%"
                      impact="+28% Technical Skills"
                    />
                    <CompletedMentorshipCard
                      topic="Product strategy for B2B SaaS"
                      mentor="Lisa Park"
                      outcome="Launched new product line, achieved $2M ARR in first quarter"
                      impact="+35% Business Acumen"
                    />
                    <CompletedMentorshipCard
                      topic="Building high-performing engineering teams"
                      mentor="David Kumar"
                      outcome="Grew team from 5 to 15 engineers with 95% retention"
                      impact="+42% Leadership"
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* TALENT MOBILITY CONTROL CENTER */}
        {viewMode === 'talentMobility' && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900">Talent Mobility Control Center</h1>
                <p className="text-gray-600 mt-1">Track job opportunities, referrals, and AI-powered matches based on your 5D profile</p>
              </div>
              <button
                onClick={() => setViewMode('personal')}
                className="px-4 py-2 bg-[#0A2463] text-white rounded-lg hover:bg-[#0A2463]/90 transition-colors text-sm flex items-center gap-2"
              >
                Back to Personal Growth
              </button>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Active Referrals */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded-full font-semibold">Active</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">4</div>
                <div className="text-sm text-gray-600 mb-2">Active Referrals</div>
                <div className="text-xs text-gray-500">2 shortlisted, 2 in review</div>
              </div>

              {/* New Job Matches */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-semibold">New</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">12</div>
                <div className="text-sm text-gray-600 mb-2">New Job Matches</div>
                <div className="text-xs text-gray-500">AI-curated this week</div>
              </div>

              {/* Profile Match Score */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">92%</div>
                <div className="text-sm text-gray-600 mb-2">Avg Match Score</div>
                <div className="text-xs text-gray-500">Based on 5D profile</div>
              </div>

              {/* Self Applications */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">3</div>
                <div className="text-sm text-gray-600 mb-2">Self Applications</div>
                <div className="text-xs text-gray-500">In progress</div>
              </div>
            </div>

            {/* Section 1: AI-Powered Job Recommendations */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 bg-emerald-600 rounded-full"></div>
                  <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">AI-Powered Job Recommendations</h2>
                </div>
                <button className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Job Card 1 */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">96% Match</span>
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">New</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">Senior Engineering Manager</h3>
                      <p className="text-sm text-gray-600 mb-2">TechFlow Systems • San Francisco, CA (Remote)</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span>$180K - $220K</span>
                        <span>•</span>
                        <span>Full-time</span>
                        <span>•</span>
                        <span>Posted 2 days ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-700 mb-3">
                      Lead a team of 12 engineers building next-gen cloud infrastructure. Strong overlap with your microservices and distributed systems expertise.
                    </p>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs text-emerald-700 font-semibold">AI Insight:</span>
                      <span className="text-xs text-gray-600">Matches 4 of 5 dimensions in your 5D profile</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                      Apply Now
                    </button>
                    <button className="px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      Save
                    </button>
                  </div>
                </div>

                {/* Job Card 2 */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">91% Match</span>
                        <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">Referral Available</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">VP of Engineering</h3>
                      <p className="text-sm text-gray-600 mb-2">DataScale Inc. • New York, NY (Hybrid)</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span>$220K - $280K</span>
                        <span>•</span>
                        <span>Full-time</span>
                        <span>•</span>
                        <span>Posted 5 days ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-700 mb-3">
                      Scale engineering organization from 30 to 100+ engineers. Your leadership mentorship experience aligns perfectly.
                    </p>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-xs text-purple-700 font-semibold">Mentor Connection:</span>
                      <span className="text-xs text-gray-600">Sarah Johnson can refer you</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                      Request Referral
                    </button>
                    <button className="px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      Save
                    </button>
                  </div>
                </div>

                {/* Job Card 3 */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">88% Match</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">Director of Platform Engineering</h3>
                      <p className="text-sm text-gray-600 mb-2">CloudNative Corp • Austin, TX (Remote)</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span>$200K - $240K</span>
                        <span>•</span>
                        <span>Full-time</span>
                        <span>•</span>
                        <span>Posted 1 week ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-700 mb-3">
                      Build and lead platform infrastructure team. Strong alignment with your cloud architecture background.
                    </p>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs text-emerald-700 font-semibold">AI Insight:</span>
                      <span className="text-xs text-gray-600">High match in Technical Skills & Business Acumen dimensions</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                      Apply Now
                    </button>
                    <button className="px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Active Referrals & Applications */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 bg-blue-600 rounded-full"></div>
                  <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Active Referrals & Applications</h2>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="space-y-4">
                  {/* Referral Progress 1 */}
                  <div className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow bg-gradient-to-br from-emerald-50/30 to-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Senior Engineering Manager - TechCorp</h4>
                          <p className="text-xs text-gray-500">Referral by Sarah Johnson • Applied Mar 1, 2026</p>
                        </div>
                      </div>
                      <span className="text-xs px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full font-semibold">
                        Shortlisted
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '65%' }} />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          Interview scheduled: March 12, 2026 at 2:00 PM
                        </span>
                        <span className="font-semibold">65%</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <button className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1">
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Self Application */}
                  <div className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow bg-gradient-to-br from-blue-50/30 to-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Product Engineering Lead - InnovateAI</h4>
                          <p className="text-xs text-gray-500">Self-applied • Applied Feb 28, 2026</p>
                        </div>
                      </div>
                      <span className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-semibold">
                        In Review
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }} />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          Application under review by hiring team
                        </span>
                        <span className="font-semibold">40%</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Referral Progress 2 */}
                  <div className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow bg-gradient-to-br from-purple-50/30 to-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">VP of Platform - CloudScale</h4>
                          <p className="text-xs text-gray-500">Referral by Michael Chen • Applied Feb 25, 2026</p>
                        </div>
                      </div>
                      <span className="text-xs px-3 py-1 bg-purple-50 text-purple-700 rounded-full font-semibold">
                        Interview
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '80%' }} />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          Final round: March 15, 2026 at 10:00 AM
                        </span>
                        <span className="font-semibold">80%</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <button className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1">
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: 5D Profile Match Insights */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-1 bg-purple-600 rounded-full"></div>
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">5D Profile Match Insights</h2>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-white p-3 rounded-lg">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">AI Analysis: Your Competitive Edge</h3>
                    <p className="text-sm text-gray-700 mb-4">
                      Based on your 5D profile, you have exceptional strength in Technical Skills (92%) and Leadership (88%).
                      Roles requiring distributed systems architecture and team scaling are your optimal fit.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-3">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">92%</div>
                    <div className="text-xs text-gray-600">Technical Skills</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">88%</div>
                    <div className="text-xs text-gray-600">Leadership</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">85%</div>
                    <div className="text-xs text-gray-600">Business Acumen</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">78%</div>
                    <div className="text-xs text-gray-600">Communication</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-pink-600 mb-1">82%</div>
                    <div className="text-xs text-gray-600">Strategy</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* COMMERCIAL CONSULTATION CONTROL CENTER */}
        {viewMode === 'commercialConsultation' && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900">Commercial Consultation Control Center</h1>
                <p className="text-gray-600 mt-1">Track consulting opportunities, advisory projects, and client engagements</p>
              </div>
              <button
                onClick={() => setViewMode('personal')}
                className="px-4 py-2 bg-[#0A2463] text-white rounded-lg hover:bg-[#0A2463]/90 transition-colors text-sm flex items-center gap-2"
              >
                Back to Personal Growth
              </button>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Active Projects */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <Briefcase className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full font-semibold">Active</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">2</div>
                <div className="text-sm text-gray-600 mb-2">Active Projects</div>
                <div className="text-xs text-gray-500">In delivery phase</div>
              </div>

              {/* Pending Applications */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-semibold">Pending</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">3</div>
                <div className="text-sm text-gray-600 mb-2">Applications</div>
                <div className="text-xs text-gray-500">Awaiting response</div>
              </div>

              {/* New Opportunities */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded-full font-semibold">New</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">7</div>
                <div className="text-sm text-gray-600 mb-2">New Opportunities</div>
                <div className="text-xs text-gray-500">Matched to your expertise</div>
              </div>

              {/* Total Revenue */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">$84K</div>
                <div className="text-sm text-gray-600 mb-2">YTD Revenue</div>
                <div className="text-xs text-gray-500">From 5 completed projects</div>
              </div>
            </div>

            {/* Section 1: New Consulting Opportunities */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 bg-purple-600 rounded-full"></div>
                  <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">New Consulting Opportunities</h2>
                </div>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Opportunity Card 1 */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">High Priority</span>
                        <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">94% Match</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">Cloud Migration Strategy - FinanceHub</h3>
                      <p className="text-sm text-gray-600 mb-2">Financial Services • 6-month engagement</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span>$45K - $60K</span>
                        <span>•</span>
                        <span>Part-time (15-20 hrs/week)</span>
                        <span>•</span>
                        <span>Posted 3 days ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-700 mb-3">
                      Lead cloud migration from on-premise to AWS. Design architecture, establish DevOps practices, and mentor internal team.
                      Perfect match for your distributed systems and cloud infrastructure expertise.
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-xs text-purple-700 font-semibold">Key Requirements:</span>
                      <span className="text-xs text-gray-600">AWS, Microservices, Team Leadership</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                      Submit Proposal
                    </button>
                    <button className="px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      Save for Later
                    </button>
                  </div>
                </div>

                {/* Opportunity Card 2 */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">Medium Priority</span>
                        <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">87% Match</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">Engineering Process Optimization - TechStart</h3>
                      <p className="text-sm text-gray-600 mb-2">SaaS Startup • 3-month engagement</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span>$30K - $40K</span>
                        <span>•</span>
                        <span>Part-time (10-15 hrs/week)</span>
                        <span>•</span>
                        <span>Posted 1 week ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-700 mb-3">
                      Help scale engineering from 10 to 50+ engineers. Establish SDLC, CI/CD pipelines, and quality processes.
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-xs text-purple-700 font-semibold">Key Requirements:</span>
                      <span className="text-xs text-gray-600">Agile, DevOps, Team Scaling</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                      Submit Proposal
                    </button>
                    <button className="px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      Save for Later
                    </button>
                  </div>
                </div>

                {/* Opportunity Card 3 */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">Urgent</span>
                        <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">90% Match</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">Technical Due Diligence - PE Firm</h3>
                      <p className="text-sm text-gray-600 mb-2">Private Equity • 2-week sprint</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span>$15K - $20K</span>
                        <span>•</span>
                        <span>Full-time (40 hrs/week)</span>
                        <span>•</span>
                        <span>Starts immediately</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-700 mb-3">
                      Assess technology stack and engineering capabilities for $50M acquisition target. Rapid evaluation required.
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-xs text-purple-700 font-semibold">Key Requirements:</span>
                      <span className="text-xs text-gray-600">Architecture Review, M&A Experience</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
                      Apply Immediately
                    </button>
                    <button className="px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      Save for Later
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Active Advisory Projects */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 bg-blue-600 rounded-full"></div>
                  <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Active Advisory Projects</h2>
                </div>
              </div>

              <div className="space-y-4">
                {/* Active Project 1 */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">On Track</span>
                        <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">Phase 2 of 3</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">Platform Modernization - RetailCo</h3>
                      <p className="text-sm text-gray-600 mb-2">E-commerce • 4-month engagement • $48K total</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Project Progress</span>
                      <span className="font-semibold text-gray-900">68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '68%' }} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Hours This Week</div>
                        <div className="text-lg font-bold text-gray-900">18 / 20</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Next Milestone</div>
                        <div className="text-lg font-bold text-gray-900">Mar 15</div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <Bell className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-blue-900 mb-1">Latest Update from PM</p>
                          <p className="text-xs text-blue-800">
                            "Architecture review complete. Ready to proceed with Phase 3 implementation. Great progress!"
                          </p>
                          <p className="text-xs text-blue-600 mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                      View Project Dashboard
                    </button>
                    <button className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium">
                      Message PM
                    </button>
                  </div>
                </div>

                {/* Active Project 2 */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">Action Required</span>
                        <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">Phase 1 of 2</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">Security Architecture Review - HealthTech</h3>
                      <p className="text-sm text-gray-600 mb-2">Healthcare SaaS • 2-month engagement • $36K total</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Project Progress</span>
                      <span className="font-semibold text-gray-900">35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '35%' }} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Hours This Week</div>
                        <div className="text-lg font-bold text-gray-900">8 / 15</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Next Milestone</div>
                        <div className="text-lg font-bold text-gray-900">Mar 10</div>
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-orange-900 mb-1">Action Required from PM</p>
                          <p className="text-xs text-orange-800">
                            "Need your input on compliance requirements before Friday's stakeholder meeting."
                          </p>
                          <p className="text-xs text-orange-600 mt-1">5 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                      View Project Dashboard
                    </button>
                    <button className="px-4 py-2 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium">
                      Respond to PM
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Application Status */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 bg-emerald-600 rounded-full"></div>
                  <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Application Status</h2>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="space-y-4">
                  {/* Application 1 */}
                  <div className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">API Architecture Design - FinanceApp</h4>
                          <p className="text-xs text-gray-500">Applied Feb 28, 2026 • $35K project</p>
                        </div>
                      </div>
                      <span className="text-xs px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full font-semibold">
                        Under Review
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Client reviewing proposal • Expected response by Mar 8</span>
                    </div>
                  </div>

                  {/* Application 2 */}
                  <div className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Engineering Team Audit - SaaS Co</h4>
                          <p className="text-xs text-gray-500">Applied Feb 25, 2026 • $28K project</p>
                        </div>
                      </div>
                      <span className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-semibold">
                        Interview Scheduled
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Video className="w-3.5 h-3.5" />
                      <span>Interview with CTO on March 10, 2026 at 3:00 PM</span>
                    </div>
                  </div>

                  {/* Application 3 */}
                  <div className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <Target className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">DevOps Transformation - MediaTech</h4>
                          <p className="text-xs text-gray-500">Applied Feb 20, 2026 • $52K project</p>
                        </div>
                      </div>
                      <span className="text-xs px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-semibold">
                        Finalist
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>You're one of 2 finalists • Final decision by Mar 12</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ENTERPRISE PARTICIPATION VIEW */}
        {viewMode === 'enterprise' && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900">Enterprise Participation Control Center</h1>
                <p className="text-gray-600 mt-1">Track enterprise opportunities, referrals, and consulting projects</p>
              </div>
              <button
                onClick={() => setViewMode('personal')}
                className="px-4 py-2 bg-[#0A2463] text-white rounded-lg hover:bg-[#0A2463]/90 transition-colors text-sm flex items-center gap-2"
              >
                Back to Personal Growth
              </button>
            </div>

            <div className="space-y-6">
              {/* Section 1: Job Opportunities */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1 w-1 bg-emerald-600 rounded-full"></div>
                  <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Job Opportunities</h2>
                </div>

                {/* Enterprise Metrics Panel */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Active Referrals */}
                  {isTalentMobilityEnabled && (
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/60 p-3 rounded-lg">
                          <Globe className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-semibold">Active</span>
                      </div>
                      <div className="text-3xl font-bold text-blue-900 mb-1">4</div>
                      <div className="text-sm text-blue-700 mb-2">Active Referrals</div>
                      <div className="text-xs text-blue-600">2 shortlisted, 2 in review</div>
                    </div>
                  )}

                  {/* Consulting Applications */}
                  {isCommercialConsultationEnabled && (
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/60 p-3 rounded-lg">
                          <Briefcase className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full font-semibold">Active</span>
                      </div>
                      <div className="text-3xl font-bold text-purple-900 mb-1">2</div>
                      <div className="text-sm text-purple-700 mb-2">Consulting Applications</div>
                      <div className="text-xs text-purple-600">1 interview, 1 proposal</div>
                    </div>
                  )}

                  {/* Enterprise Opportunities */}
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white/60 p-3 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-emerald-600" />
                      </div>
                      <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded-full font-semibold">New</span>
                    </div>
                    <div className="text-3xl font-bold text-emerald-900 mb-1">8</div>
                    <div className="text-sm text-emerald-700 mb-2">Enterprise Opportunities</div>
                    <div className="text-xs text-emerald-600">Curated for your profile</div>
                  </div>
                </div>
              </div>

              {/* Section 2: Referral Activity */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1 w-1 bg-blue-600 rounded-full"></div>
                  <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Referral Activity</h2>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900">Referral Progress & Updates</h3>
                    <button className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1">
                      View All
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Referral Progress Card */}
                    {isTalentMobilityEnabled && (
                      <div className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow bg-gradient-to-br from-blue-50/30 to-white">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Globe className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-900">Senior Engineering Manager - TechCorp</h4>
                              <p className="text-xs text-gray-500">Talent Mobility Referral</p>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full font-semibold">
                            Shortlisted
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }} />
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>Interview scheduled: March 12, 2026</span>
                            <span className="font-semibold">60%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Consulting Project Card */}
                    {isCommercialConsultationEnabled && (
                      <div className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow bg-gradient-to-br from-purple-50/30 to-white">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Briefcase className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-900">Cloud Migration Advisory - FinanceHub</h4>
                              <p className="text-xs text-gray-500">Commercial Consultation</p>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-semibold">
                            Interview
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '40%' }} />
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>Next: Technical interview</span>
                            <span className="font-semibold">40%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* New Opportunity Card */}
                    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow bg-gradient-to-br from-emerald-50/30 to-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-gray-900">Product Leadership Role - DataFlow Systems</h4>
                            <p className="text-xs text-gray-500">New Enterprise Opportunity</p>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full font-semibold">
                          New Match
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>95% profile match • $180K-220K • Remote</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Talent Mobility Onboarding - Keep these for future use */}
        {talentMobilityView === 'onboarding' && viewMode === 'personal' && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-200 p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-white p-4 rounded-full inline-block mb-4">
                <Sparkles className="w-8 h-8 text-[#0A2463]" />
              </div>
              <h3 className="text-gray-900 mb-2">Enterprise Opportunities Await</h3>
              <p className="text-gray-600">
                Enterprise opportunities unlock when your 5D profile is complete.
              </p>
              <button
                onClick={handleConfirmJoin}
                className="mt-4 px-4 py-2 bg-[#0A2463] text-white rounded-lg hover:bg-[#0A2463]/90 transition-colors"
              >
                Join Talent Mobility
              </button>
            </div>
          </div>
        )}

        {/* Talent Mobility Setup */}
        {talentMobilityView === 'setup' && viewMode === 'personal' && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-200 p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-white p-4 rounded-full inline-block mb-4">
                <Sparkles className="w-8 h-8 text-[#0A2463]" />
              </div>
              <h3 className="text-gray-900 mb-2">Set Up Your Preferences</h3>
              <p className="text-gray-600">
                Customize your Talent Mobility experience by selecting your preferences.
              </p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <select
                    className="px-2 py-1 border border-gray-300 rounded-lg"
                    value={preferences.countries.join(',')}
                    onChange={(e) => togglePreference('countries', e.target.value)}
                  >
                    <option value="">Select Countries</option>
                    {countryOptions.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-gray-500" />
                  <select
                    className="px-2 py-1 border border-gray-300 rounded-lg"
                    value={preferences.industries.join(',')}
                    onChange={(e) => togglePreference('industries', e.target.value)}
                  >
                    <option value="">Select Industries</option>
                    {industryOptions.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <select
                    className="px-2 py-1 border border-gray-300 rounded-lg"
                    value={preferences.markets.join(',')}
                    onChange={(e) => togglePreference('markets', e.target.value)}
                  >
                    <option value="">Select Markets</option>
                    {marketOptions.map((market) => (
                      <option key={market} value={market}>
                        {market}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gray-500" />
                  <select
                    className="px-2 py-1 border border-gray-300 rounded-lg"
                    value={preferences.functions.join(',')}
                    onChange={(e) => togglePreference('functions', e.target.value)}
                  >
                    <option value="">Select Functions</option>
                    {functionOptions.map((func) => (
                      <option key={func} value={func}>
                        {func}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <select
                    className="px-2 py-1 border border-gray-300 rounded-lg"
                    value={preferences.seniority.join(',')}
                    onChange={(e) => togglePreference('seniority', e.target.value)}
                  >
                    <option value="">Select Seniority Levels</option>
                    {seniorityOptions.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <button
                  onClick={handleSavePreferences}
                  className="px-4 py-2 bg-[#0A2463] text-white rounded-lg hover:bg-[#0A2463]/90 transition-colors"
                >
                  Save Preferences
                </button>
                <button
                  onClick={handleSkipPreferences}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Talent Mobility Dashboard */}
        {talentMobilityView === 'dashboard' && viewMode === 'personal' && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-200 p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-white p-4 rounded-full inline-block mb-4">
                <Sparkles className="w-8 h-8 text-[#0A2463]" />
              </div>
              <h3 className="text-gray-900 mb-2">Welcome to Talent Mobility</h3>
              <p className="text-gray-600">
                Your preferences have been saved. Explore enterprise opportunities tailored to your profile.
              </p>
              <button
                onClick={() => setTalentMobilityView('referrals')}
                className="mt-4 px-4 py-2 bg-[#0A2463] text-white rounded-lg hover:bg-[#0A2463]/90 transition-colors"
              >
                View Referrals
              </button>
            </div>
          </div>
        )}

        {/* Talent Mobility Referrals */}
        {talentMobilityView === 'referrals' && viewMode === 'personal' && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-200 p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-white p-4 rounded-full inline-block mb-4">
                <Sparkles className="w-8 h-8 text-[#0A2463]" />
              </div>
              <h3 className="text-gray-900 mb-2">Enterprise Referrals</h3>
              <p className="text-gray-600">
                Explore opportunities from leading enterprises based on your preferences.
              </p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <select
                    className="px-2 py-1 border border-gray-300 rounded-lg"
                    value={preferences.countries.join(',')}
                    onChange={(e) => togglePreference('countries', e.target.value)}
                  >
                    <option value="">Select Countries</option>
                    {countryOptions.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-gray-500" />
                  <select
                    className="px-2 py-1 border border-gray-300 rounded-lg"
                    value={preferences.industries.join(',')}
                    onChange={(e) => togglePreference('industries', e.target.value)}
                  >
                    <option value="">Select Industries</option>
                    {industryOptions.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <select
                    className="px-2 py-1 border border-gray-300 rounded-lg"
                    value={preferences.markets.join(',')}
                    onChange={(e) => togglePreference('markets', e.target.value)}
                  >
                    <option value="">Select Markets</option>
                    {marketOptions.map((market) => (
                      <option key={market} value={market}>
                        {market}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gray-500" />
                  <select
                    className="px-2 py-1 border border-gray-300 rounded-lg"
                    value={preferences.functions.join(',')}
                    onChange={(e) => togglePreference('functions', e.target.value)}
                  >
                    <option value="">Select Functions</option>
                    {functionOptions.map((func) => (
                      <option key={func} value={func}>
                        {func}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <select
                    className="px-2 py-1 border border-gray-300 rounded-lg"
                    value={preferences.seniority.join(',')}
                    onChange={(e) => togglePreference('seniority', e.target.value)}
                  >
                    <option value="">Select Seniority Levels</option>
                    {seniorityOptions.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <button
                  onClick={handleSavePreferences}
                  className="px-4 py-2 bg-[#0A2463] text-white rounded-lg hover:bg-[#0A2463]/90 transition-colors"
                >
                  Save Preferences
                </button>
                <button
                  onClick={handleSkipPreferences}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enterprise Opportunities Placeholder (example for users without activity) */}
        {/* Uncomment this and remove the sections above to show when user has no enterprise engagement */}
        {/* <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-200 p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-white p-4 rounded-full inline-block mb-4">
              <Sparkles className="w-8 h-8 text-[#0A2463]" />
            </div>
            <h3 className="text-gray-900 mb-2">Enterprise Opportunities Await</h3>
            <p className="text-gray-600">
              Enterprise opportunities unlock when your 5D profile is complete.
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
}

function MentorshipTrackCard({ topic, mentor, mentorRole, phase, phaseStep, progress, nextSession, status, statusColor }: {
  topic: string;
  mentor: string;
  mentorRole: string;
  phase: string;
  phaseStep: string;
  progress: number;
  nextSession: string;
  status: string;
  statusColor: string;
}) {
  const statusColors = {
    green: 'bg-green-50 text-green-700',
    orange: 'bg-orange-50 text-orange-700',
    blue: 'bg-blue-50 text-blue-700',
    red: 'bg-red-50 text-red-700',
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{topic}</h3>
          <p className="text-sm text-gray-600">Mentor: {mentor}</p>
          <p className="text-xs text-gray-500">{mentorRole}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2 ${statusColors[statusColor as keyof typeof statusColors]}`}>
          {status}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Phase: {phase} ({phaseStep})</span>
          <span className="font-semibold text-gray-900">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-[#0A2463] h-2 rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          Next: {nextSession}
        </div>
      </div>
    </div>
  );
}

function CompletedMentorshipCard({ topic, mentor, outcome, impact }: {
  topic: string;
  mentor: string;
  outcome: string;
  impact: string;
}) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-gray-50/50">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{topic}</h3>
          <p className="text-sm text-gray-600">Mentor: {mentor}</p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full whitespace-nowrap">
            Completed
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-sm text-gray-700">
          <span className="font-semibold">Outcome:</span> {outcome}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-semibold">
            5D Impact: {impact}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdvisoryProjectCard({ project, role, status, statusColor }: {
  project: string;
  role: string;
  status: string;
  statusColor: string;
}) {
  const statusColors = {
    green: 'bg-green-50 text-green-700',
    blue: 'bg-blue-50 text-blue-700',
    orange: 'bg-orange-50 text-orange-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  return (
    <div className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[statusColor as keyof typeof statusColors]}`}>
          {status}
        </span>
      </div>
      <h4 className="font-semibold text-sm text-gray-900 mb-1">{project}</h4>
      <p className="text-xs text-gray-500">{role}</p>
    </div>
  );
}

function EnterpriseProjectCard({ company, projectType, stage, progress }: {
  company: string;
  projectType: 'Advisory';
  stage: 'Discovery' | 'Shortlisting' | 'Interview' | 'Closed';
  progress: number;
}) {
  const projectTypeColors = {
    'Advisory': 'bg-purple-50 text-purple-700',
  };

  const stageColors = {
    'Discovery': 'bg-orange-50 text-orange-700',
    'Shortlisting': 'bg-yellow-50 text-yellow-700',
    'Interview': 'bg-blue-50 text-blue-700',
    'Closed': 'bg-green-50 text-green-700',
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow bg-gradient-to-br from-gray-50/50 to-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${stageColors[stage as keyof typeof stageColors]}`}>
            {stage}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${projectTypeColors[projectType as keyof typeof projectTypeColors]}`}>
            {projectType}
          </span>
        </div>
        <span className="text-xs text-gray-500 font-medium">Platform Managed</span>
      </div>
      <h4 className="font-semibold text-sm text-gray-900 mb-3">{company}</h4>
      <div className="space-y-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-purple-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600 font-medium">{progress}% Complete</span>
          <button className="text-xs text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1">
            View Project
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}