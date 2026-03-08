import { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  CheckCircle, 
  Calendar,
  Users,
  BookOpen,
  Briefcase,
  Award,
  Clock,
  Target,
  Shield,
  Network,
  Brain,
  Layers,
  ChevronRight,
  Globe,
  TrendingUp,
  Video
} from 'lucide-react';

export function PublicProfile() {
  const [activeWorkshopTab, setActiveWorkshopTab] = useState<'upcoming' | 'ongoing' | 'past'>('upcoming');

  // Mock profile data - in production this would come from routing params and API
  const profile = {
    name: 'Sarah Chen',
    country: 'United Kingdom',
    title: 'VP Operations',
    industry: 'E-commerce',
    roles: ['Mentor', 'Workshop Speaker', 'Business Consultant'],
    verified: true,
    servicesOffered: [
      { name: 'Instant Mentorship', status: 'Available', statusColor: 'emerald' },
      { name: 'Scheduled Mentorship', status: 'Available', statusColor: 'emerald' },
      { name: 'Workshop Speaker', status: 'Limited', statusColor: 'amber' },
      { name: 'Business Consultant', status: 'Available', statusColor: 'emerald' }
    ],
    fiveDProfile: {
      hardSkills: ['Product Strategy', 'Operations Management', 'Team Leadership'],
      softSkills: ['Strategic Thinking', 'Communication', 'Problem Solving'],
      decisionLogic: 'Data-driven with strong stakeholder consideration',
      riskCalibration: 'Balanced',
      networkCapital: 'Strong industry connections in tech and e-commerce sectors'
    },
    mentorTags: ['Product Strategy', 'E-commerce', 'Leadership', 'Operations', 'Scaling', 'Team Building'],
    workshops: {
      upcoming: [
        {
          title: 'Scaling E-commerce Operations',
          date: 'Mar 15, 2026 • 2:00 PM GMT',
          tags: ['Operations', 'Scaling', 'E-commerce'],
          seatsLeft: 8,
          totalSeats: 20
        },
        {
          title: 'Building High-Performance Teams',
          date: 'Mar 22, 2026 • 10:00 AM GMT',
          tags: ['Leadership', 'Team Building', 'Culture'],
          seatsLeft: 12,
          totalSeats: 25
        }
      ],
      ongoing: [
        {
          title: 'Product Leadership Bootcamp',
          date: 'Started Feb 1, 2026',
          tags: ['Product', 'Leadership', 'Strategy'],
          participants: 18,
          totalSeats: 20
        }
      ],
      past: [
        {
          title: 'Operations Excellence Workshop',
          date: 'Completed Jan 15, 2026',
          tags: ['Operations', 'Excellence', 'Process'],
          participants: 22
        }
      ]
    },
    courses: [
      {
        title: 'E-commerce Operations Masterclass',
        status: 'Open',
        nextCohort: 'Apr 1, 2026',
        duration: '8 weeks'
      },
      {
        title: 'Strategic Leadership in Tech',
        status: 'Open',
        nextCohort: 'Mar 20, 2026',
        duration: '6 weeks'
      }
    ],
    consulting: {
      focusAreas: ['Operations Strategy', 'Process Optimization', 'Team Structure', 'Scaling Strategy'],
      engagementTypes: ['Strategy Review', 'Process Audit', 'Organizational Design', 'Growth Planning']
    },
    about: 'VP of Operations with 12+ years of experience scaling e-commerce businesses. Specialized in operational excellence, team leadership, and strategic growth initiatives. Passionate about helping leaders build efficient, high-performing organizations.',
    languages: ['English', 'Mandarin'],
    timezone: 'GMT (London)',
    industries: ['E-commerce', 'Technology', 'Retail']
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      'Mentor': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Mentee': 'bg-blue-100 text-blue-700 border-blue-200',
      'Workshop Speaker': 'bg-purple-100 text-purple-700 border-purple-200',
      'Business Consultant': 'bg-amber-100 text-amber-700 border-amber-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusColor = (color: string) => {
    const colors: { [key: string]: string } = {
      'emerald': 'bg-emerald-100 text-emerald-700',
      'amber': 'bg-amber-100 text-amber-700',
      'red': 'bg-red-100 text-red-700'
    };
    return colors[color] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <a href="/" className="flex items-center gap-2 text-[#0A2463] hover:text-[#0D47A1] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Live Join</span>
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-[#0A2463] to-[#0D47A1] rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                    {profile.verified && (
                      <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.country}</span>
                  </div>
                  <p className="text-lg text-gray-700 font-medium">
                    {profile.title} • {profile.industry}
                  </p>
                </div>
              </div>

              {/* Role Chips */}
              <div className="flex flex-wrap gap-2">
                {profile.roles.map((role) => (
                  <span
                    key={role}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${getRoleColor(role)}`}
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Services Offered */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Services Offered</h2>
          <div className="flex flex-wrap gap-3">
            {profile.servicesOffered.map((service) => (
              <div
                key={service.name}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-900">{service.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(service.statusColor)}`}>
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 5D Profile Snapshot */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">5D Profile Snapshot</h2>
            <a href="#" className="text-sm text-[#0A2463] hover:text-[#0D47A1] font-medium flex items-center gap-1">
              View Full Profile
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Hard Skills */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Hard Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.fiveDProfile.hardSkills.map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-5 h-5 text-teal-600" />
                <h3 className="font-semibold text-gray-900">Soft Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.fiveDProfile.softSkills.map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-teal-50 text-teal-700 text-sm rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Decision Logic */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-violet-600" />
                <h3 className="font-semibold text-gray-900">Decision Logic</h3>
              </div>
              <p className="text-sm text-gray-700">{profile.fiveDProfile.decisionLogic}</p>
            </div>

            {/* Risk Calibration */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-gray-900">Risk Calibration</h3>
              </div>
              <span className="px-3 py-1 bg-amber-50 text-amber-700 text-sm rounded-full font-medium">
                {profile.fiveDProfile.riskCalibration}
              </span>
            </div>

            {/* Network Capital */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Network className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-gray-900">Network Capital</h3>
              </div>
              <p className="text-sm text-gray-700">{profile.fiveDProfile.networkCapital}</p>
            </div>
          </div>
        </div>

        {/* Mentor Tags */}
        {profile.roles.includes('Mentor') && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Mentor Tags</h2>
            <div className="flex flex-wrap gap-2">
              {profile.mentorTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm rounded-lg font-medium border border-emerald-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Workshops Section */}
        {profile.roles.includes('Workshop Speaker') && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Workshops</h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveWorkshopTab('upcoming')}
                className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                  activeWorkshopTab === 'upcoming'
                    ? 'border-[#0A2463] text-[#0A2463]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Upcoming ({profile.workshops.upcoming.length})
              </button>
              <button
                onClick={() => setActiveWorkshopTab('ongoing')}
                className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                  activeWorkshopTab === 'ongoing'
                    ? 'border-[#0A2463] text-[#0A2463]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Ongoing ({profile.workshops.ongoing.length})
              </button>
              <button
                onClick={() => setActiveWorkshopTab('past')}
                className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                  activeWorkshopTab === 'past'
                    ? 'border-[#0A2463] text-[#0A2463]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Past ({profile.workshops.past.length})
              </button>
            </div>

            {/* Workshop Cards */}
            <div className="space-y-4">
              {activeWorkshopTab === 'upcoming' && profile.workshops.upcoming.map((workshop) => (
                <div key={workshop.title} className="border border-gray-200 rounded-lg p-5 hover:border-[#0A2463] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{workshop.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{workshop.date}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {workshop.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-amber-700 font-medium">
                        {workshop.seatsLeft} seats left (of {workshop.totalSeats})
                      </p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-[#0A2463] text-white rounded-lg font-medium hover:bg-[#0D47A1] transition-colors">
                    Request Seat
                  </button>
                </div>
              ))}

              {activeWorkshopTab === 'ongoing' && profile.workshops.ongoing.map((workshop) => (
                <div key={workshop.title} className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{workshop.title}</h3>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          In Progress
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{workshop.date}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {workshop.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        {workshop.participants} participants enrolled
                      </p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    View Workshop
                  </button>
                </div>
              ))}

              {activeWorkshopTab === 'past' && profile.workshops.past.map((workshop) => (
                <div key={workshop.title} className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{workshop.title}</h3>
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full font-medium">
                          Completed
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{workshop.date}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {workshop.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        {workshop.participants} participants completed
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses Section */}
        {profile.servicesOffered.some(s => s.name === 'Mentorship Courses') && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Courses</h2>
            <div className="space-y-4">
              {profile.courses.map((course) => (
                <div key={course.title} className="border border-gray-200 rounded-lg p-5 hover:border-[#0A2463] transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                          course.status === 'Open' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {course.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Next cohort: {course.nextCohort}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Duration: {course.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-[#0A2463] text-white rounded-lg font-medium hover:bg-[#0D47A1] transition-colors">
                    View Course Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Business Consulting Section */}
        {profile.roles.includes('Business Consultant') && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Business Consulting</h2>
            
            {/* Consulting Focus Areas */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Focus Areas</h3>
              <div className="flex flex-wrap gap-2">
                {profile.consulting.focusAreas.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1.5 bg-amber-50 text-amber-700 text-sm rounded-lg font-medium border border-amber-200"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Engagement Types */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Typical Engagements</h3>
              <div className="grid grid-cols-2 gap-3">
                {profile.consulting.engagementTypes.map((type) => (
                  <div
                    key={type}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <Briefcase className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full px-4 py-2 bg-[#0A2463] text-white rounded-lg font-medium hover:bg-[#0D47A1] transition-colors">
              Request Consultation
            </button>
          </div>
        )}

        {/* About Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">{profile.about}</p>
          
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Industries</h3>
              <div className="space-y-1">
                {profile.industries.map((industry) => (
                  <p key={industry} className="text-sm text-gray-700">• {industry}</p>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Languages</h3>
              <div className="space-y-1">
                {profile.languages.map((language) => (
                  <p key={language} className="text-sm text-gray-700">• {language}</p>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Timezone</h3>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-600" />
                <p className="text-sm text-gray-700">{profile.timezone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
