import { useState, useEffect } from 'react';
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
  Loader2,
} from 'lucide-react';
import { workshopAPI, type WorkshopEntry } from '../../lib/api';

export function MentorWorkshops() {
  const [workshops, setWorkshops] = useState<WorkshopEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    workshopAPI.list({ mine: true })
      .then(setWorkshops)
      .catch(err => console.error('Failed to load workshops:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (workshopId: number) => {
    try {
      await workshopAPI.remove(workshopId);
      setWorkshops(prev => prev.filter(w => w.id !== workshopId));
    } catch (err) {
      console.error('Failed to delete workshop:', err);
    }
  };

  const handlePublish = async (workshopId: number) => {
    try {
      const updated = await workshopAPI.publish(workshopId);
      setWorkshops(prev => prev.map(w => w.id === workshopId ? updated : w));
    } catch (err) {
      console.error('Failed to publish workshop:', err);
    }
  };

  const filteredWorkshops = workshops.filter(workshop => {
    const matchesTab = activeTab === 'all' || workshop.status === activeTab;
    const matchesSearch = workshop.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    totalWorkshops: workshops.length,
    publishedWorkshops: workshops.filter(w => w.status === 'published').length,
    totalRevenue: workshops.reduce((sum, w) => sum + (w.price ?? 0), 0),
    totalAttendees: workshops.reduce((sum, w) => sum + w.registered_count, 0),
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
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
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
              <button
                onClick={() => alert('Workshop invitations coming soon')}
                className="px-5 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
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
                  All ({workshops.length})
                </button>
                <button
                  onClick={() => setActiveTab('published')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'published'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Published ({workshops.filter(w => w.status === 'published').length})
                </button>
                <button
                  onClick={() => setActiveTab('draft')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'draft'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Draft ({workshops.filter(w => w.status === 'draft').length})
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Completed ({workshops.filter(w => w.status === 'completed').length})
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
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
                >
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Workshop Cards */}
          <div className="p-6 space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-10 h-10 text-emerald-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">Loading workshops...</p>
              </div>
            ) : filteredWorkshops.length === 0 ? (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No workshops found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? 'Try adjusting your search terms' : 'Create your first workshop to get started'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setShowCreate(true)}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create Workshop
                  </button>
                )}
              </div>
            ) : (
              filteredWorkshops.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} onDelete={handleDelete} onPublish={handlePublish} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkshopCard({ workshop, onDelete, onPublish }: { workshop: WorkshopEntry; onDelete: (id: number) => void; onPublish: (id: number) => void }) {
  const [showMenu, setShowMenu] = useState(false);

  const maxParticipants = workshop.max_participants ?? 0;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'TBD';
    if (minutes >= 60) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return m > 0 ? `${h}h ${m}m` : `${h} hour${h > 1 ? 's' : ''}`;
    }
    return `${minutes} min`;
  };

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
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {workshop.status}
          </span>
        );
    }
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
                {workshop.tags && workshop.tags.length > 0 && (
                  <div className="flex gap-1">
                    {workshop.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(workshop.scheduled_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(workshop.duration_minutes)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>
                    {workshop.registered_count}/{maxParticipants} attendees
                  </span>
                </div>
                {workshop.price != null && workshop.price > 0 && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">${workshop.price.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar (for published workshops) */}
          {workshop.status === 'published' && maxParticipants > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Registration Progress</span>
                <span className="font-medium">
                  {Math.round((workshop.registered_count / maxParticipants) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all"
                  style={{ width: `${(workshop.registered_count / maxParticipants) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Status & Actions */}
        <div className="flex items-center gap-3">
          {getStatusBadge()}
          {workshop.status === 'draft' && (
            <button
              onClick={() => onPublish(workshop.id)}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors"
            >
              Publish
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <button
                  onClick={() => { alert('Workshop details coming soon'); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button
                  onClick={() => { alert('Edit workshop coming soon'); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Workshop
                </button>
                <button
                  onClick={() => { alert('Duplicate coming soon'); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={() => { onDelete(workshop.id); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
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
