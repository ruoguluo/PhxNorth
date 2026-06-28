import { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  Calendar,
  Clock,
  FileText,
  ChevronRight,
  Search,
  Filter,
  Zap,
  Target,
  ArrowRight,
  Loader2,
  Trash2,
  X
} from 'lucide-react';
import { Link } from 'react-router';
import { mentorshipAPI } from '../../lib/api';

type StatusFilter = 'active' | 'completed' | 'all';

interface MentorshipRequest {
  id: number;
  mentee_id: number;
  mentor_id: number;
  type: string;
  topic: string;
  message: string | null;
  status: string;
  duration_minutes: number;
  proposed_datetime: string | null;
  price: number;
  created_at: string | null;
  mentee_name: string | null;
  mentor_name: string | null;
}

export function MyQuestions() {
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [withdrawingId, setWithdrawingId] = useState<number | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      const data = await mentorshipAPI.listRequests('mentee');
      setRequests(data as MentorshipRequest[]);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleWithdraw = async (id: number) => {
    if (!confirm('Are you sure you want to withdraw this question?')) return;
    setWithdrawingId(id);
    try {
      const token = localStorage.getItem('phxnorth_token');
      const res = await fetch(`/api/mentorship/requests/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      if (res.ok || res.status === 204) {
        setRequests(prev => prev.filter(r => r.id !== id));
      } else {
        console.error('Withdraw failed:', res.status, await res.text());
      }
    } catch (err) {
      console.error('Failed to withdraw request:', err);
    } finally {
      setWithdrawingId(null);
    }
  };

  const activeStatuses = ['pending', 'accepted'];
  const closedStatuses = ['completed', 'declined', 'expired'];

  const filtered = requests.filter(r => {
    // Status filter
    if (statusFilter === 'active' && !activeStatuses.includes(r.status)) return false;
    if (statusFilter === 'completed' && !closedStatuses.includes(r.status)) return false;

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (r.topic || '').toLowerCase().includes(q) ||
        (r.message || '').toLowerCase().includes(q) ||
        (r.mentor_name || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeCount = requests.filter(r => activeStatuses.includes(r.status)).length;
  const completedCount = requests.filter(r => closedStatuses.includes(r.status)).length;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      accepted: 'bg-green-100 text-green-700 border-green-200',
      completed: 'bg-blue-100 text-blue-700 border-blue-200',
      declined: 'bg-red-100 text-red-700 border-red-200',
      expired: 'bg-gray-100 text-gray-500 border-gray-200',
    };
    const labels: Record<string, string> = {
      pending: 'Awaiting Mentor',
      accepted: 'Accepted',
      completed: 'Completed',
      declined: 'Declined',
      expired: 'Expired',
    };
    return (
      <span className={`inline-flex items-center text-xs px-3 py-1.5 rounded-full font-medium border ${styles[status] || styles.expired}`}>
        {status === 'pending' && (
          <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse" />
        )}
        {labels[status] || status}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    return type === 'instant' ? (
      <Zap className="w-4 h-4 text-amber-500" />
    ) : (
      <Target className="w-4 h-4 text-blue-500" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <Link to="/app/dashboard" className="text-[#0A2463] hover:underline text-sm">
              &larr; Back to Dashboard
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Questions</h1>
              <p className="text-gray-600">Track your mentorship questions and their progress</p>
            </div>
            <Link
              to="/app/question-entry"
              className="bg-[#0A2463] text-white px-5 py-2.5 rounded-lg hover:bg-[#0A2463]/90 transition-colors text-sm font-medium flex items-center gap-2"
            >
              New Question
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1 mb-6 w-fit">
          {([
            { key: 'active' as StatusFilter, label: 'Active', count: activeCount },
            { key: 'completed' as StatusFilter, label: 'Closed', count: completedCount },
            { key: 'all' as StatusFilter, label: 'All', count: requests.length },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === tab.key
                  ? 'bg-[#0A2463] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                statusFilter === tab.key
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by topic, message, or mentor name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A2463]/30 focus:border-[#0A2463] outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Loader2 className="w-8 h-8 text-[#0A2463] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your questions...</p>
          </div>
        )}

        {/* Request Cards */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map(request => (
              <div
                key={request.id}
                className={`bg-white rounded-xl border-2 p-6 transition-all hover:shadow-md ${
                  request.status === 'pending'
                    ? 'border-amber-200'
                    : request.status === 'accepted'
                    ? 'border-green-200'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-6">
                  {/* Left: Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      request.type === 'instant'
                        ? 'bg-amber-50'
                        : 'bg-blue-50'
                    }`}>
                      {getTypeIcon(request.type)}
                    </div>
                  </div>

                  {/* Center: Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusBadge(request.status)}
                      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                        {request.type === 'instant' ? 'Instant' : 'Scheduled'}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                      {request.topic || 'Untitled Question'}
                    </h3>

                    {request.message && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {request.message}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {request.mentor_name && (
                        <span className="flex items-center gap-1">
                          Mentor: <span className="font-medium text-gray-700">{request.mentor_name}</span>
                        </span>
                      )}
                      {request.created_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(request.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {request.duration_minutes} min
                      </span>
                      {request.price > 0 && (
                        <span className="font-medium text-gray-700">
                          ${request.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleWithdraw(request.id)}
                        disabled={withdrawingId === request.id}
                        className="px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 border border-red-200 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {withdrawingId === request.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Withdraw
                      </button>
                    )}
                    <Link
                      to={`/app/mentor/request/${request.id}`}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-[#0A2463] text-white hover:bg-[#0A2463]/90 transition-colors flex items-center gap-1.5"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            {searchQuery ? (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches found</h3>
                <p className="text-gray-600 mb-4">Try a different search term</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#0A2463] hover:underline text-sm font-medium"
                >
                  Clear search
                </button>
              </>
            ) : statusFilter === 'active' ? (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Questions</h3>
                <p className="text-gray-600 mb-4">You don't have any pending or accepted mentorship questions</p>
                <Link
                  to="/app/question-entry"
                  className="inline-flex items-center gap-2 bg-[#0A2463] text-white px-5 py-2.5 rounded-lg hover:bg-[#0A2463]/90 transition-colors text-sm font-medium"
                >
                  Ask a Question
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Questions Yet</h3>
                <p className="text-gray-600 mb-4">Start by asking your first mentorship question</p>
                <Link
                  to="/app/question-entry"
                  className="inline-flex items-center gap-2 bg-[#0A2463] text-white px-5 py-2.5 rounded-lg hover:bg-[#0A2463]/90 transition-colors text-sm font-medium"
                >
                  Ask a Question
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
