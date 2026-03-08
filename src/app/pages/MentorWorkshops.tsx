import { useState } from 'react';
import {
  Plus,
  Calendar,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  Award,
  Target,
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Eye,
  Video,
} from 'lucide-react';

interface Workshop {
  id: string;
  title: string;
  status: 'published' | 'draft' | 'completed';
  attendees: number;
  maxAttendees: number;
  date: string;
  duration: string;
  revenue: number;
  rating?: number;
  type: 'custom' | 'platform-invited';
}

const mockWorkshops: Workshop[] = [
  {
    id: '1',
    title: 'AI Product Strategy for B2B SaaS',
    status: 'published',
    attendees: 18,
    maxAttendees: 25,
    date: 'Mar 15, 2026',
    duration: '2 hours',
    revenue: 1800,
    type: 'custom',
  },
  {
    id: '2',
    title: 'Leadership Transition Playbook',
    status: 'published',
    attendees: 12,
    maxAttendees: 20,
    date: 'Mar 22, 2026',
    duration: '90 min',
    revenue: 1200,
    type: 'platform-invited',
  },
  {
    id: '3',
    title: 'Product Discovery Methods',
    status: 'draft',
    attendees: 0,
    maxAttendees: 30,
    date: 'Apr 5, 2026',
    duration: '2 hours',
    revenue: 0,
    type: 'custom',
  },
  {
    id: '4',
    title: 'Building High-Performance Teams',
    status: 'completed',
    attendees: 24,
    maxAttendees: 25,
    date: 'Feb 10, 2026',
    duration: '2.5 hours',
    revenue: 2400,
    rating: 4.9,
    type: 'custom',
  },
];

export function MentorWorkshops() {
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkshops = mockWorkshops.filter(workshop => {
    const matchesTab = activeTab === 'all' || workshop.status === activeTab;
    const matchesSearch = workshop.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    totalWorkshops: mockWorkshops.length,
    publishedWorkshops: mockWorkshops.filter(w => w.status === 'published').length,
    totalRevenue: mockWorkshops.reduce((sum, w) => sum + w.revenue, 0),
    totalAttendees: mockWorkshops.reduce((sum, w) => sum + w.attendees, 0),
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Workshop Studio</h1>
              <p className="text-gray-600">Create and manage your workshops, track attendance, and grow your impact</p>
            </div>
            <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Workshop
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalWorkshops}</h3>
              <p className="text-sm text-gray-600">Total Workshops</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.publishedWorkshops}</h3>
              <p className="text-sm text-gray-600">Active Workshops</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalAttendees}</h3>
              <p className="text-sm text-gray-600">Total Attendees</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">${stats.totalRevenue.toLocaleString()}</h3>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
        </div>

        {/* Platform Invitations Banner */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-bold text-gray-900">Platform Workshop Invitations</h2>
                <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full font-medium animate-pulse">
                  2 New
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                You have been matched with workshop opportunities from enterprises and the platform. These are curated based on your expertise.
              </p>
              <button className="px-5 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">
                Review Invitations →
              </button>
            </div>
          </div>
        </div>

        {/* Workshop List */}
        <div className="bg-white rounded-xl border border-gray-200">
          {/* Controls */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between gap-4">
              {/* Tabs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All ({mockWorkshops.length})
                </button>
                <button
                  onClick={() => setActiveTab('published')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'published'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Published ({mockWorkshops.filter(w => w.status === 'published').length})
                </button>
                <button
                  onClick={() => setActiveTab('draft')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'draft'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Draft ({mockWorkshops.filter(w => w.status === 'draft').length})
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Completed ({mockWorkshops.filter(w => w.status === 'completed').length})
                </button>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search workshops..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Workshop Cards */}
          <div className="p-6 space-y-4">
            {filteredWorkshops.length === 0 ? (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No workshops found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? 'Try adjusting your search terms' : 'Create your first workshop to get started'}
                </p>
                {!searchQuery && (
                  <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors inline-flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create Workshop
                  </button>
                )}
              </div>
            ) : (
              filteredWorkshops.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkshopCard({ workshop }: { workshop: Workshop }) {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusBadge = () => {
    switch (workshop.status) {
      case 'published':
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
            Published
          </span>
        );
      case 'draft':
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            Draft
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            Completed
          </span>
        );
    }
  };

  const getTypeBadge = () => {
    if (workshop.type === 'platform-invited') {
      return (
        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
          Platform Invited
        </span>
      );
    }
    return null;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-5 hover:border-emerald-300 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4">
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-gray-900">{workshop.title}</h3>
                {getTypeBadge()}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{workshop.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{workshop.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>
                    {workshop.attendees}/{workshop.maxAttendees} attendees
                  </span>
                </div>
                {workshop.revenue > 0 && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">${workshop.revenue.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar (for published workshops) */}
          {workshop.status === 'published' && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Registration Progress</span>
                <span className="font-medium">
                  {Math.round((workshop.attendees / workshop.maxAttendees) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all"
                  style={{ width: `${(workshop.attendees / workshop.maxAttendees) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Rating (for completed workshops) */}
          {workshop.status === 'completed' && workshop.rating && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Rating:</span>
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-900">{workshop.rating}</span>
                <span className="text-gray-400">/5.0</span>
                <TrendingUp className="w-4 h-4 text-emerald-600 ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Status & Actions */}
        <div className="flex items-center gap-3">
          {getStatusBadge()}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Workshop
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
