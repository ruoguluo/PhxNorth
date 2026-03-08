import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  FileText,
  ChevronRight
} from 'lucide-react';
import { mentorshipAPI } from '../../lib/api';

export function MentorshipRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await mentorshipAPI.listRequests('mentor');
        setRequests(data.map((req: any) => ({
          id: req.id,
          mentee: {
            name: req.mentee_name || 'Unknown Mentee',
            avatar: (req.mentee_name || 'UM').split(' ').map((n: string) => n[0]).join(''),
            role: req.type === 'instant' ? 'Instant Request' : 'Scheduled Request',
            industry: req.topic?.split(' ').slice(0, 2).join(' ') || 'General',
          },
          submittedDate: req.created_at ? new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
          bigQuestion: req.message || req.topic || 'No details provided',
          estimatedTime: req.duration_minutes,
          status: req.status === 'pending' ? 'Awaiting Mentor Review' : req.status === 'accepted' ? 'Accepted' : req.status,
          statusColor: req.status === 'pending' ? 'orange' : req.status === 'accepted' ? 'green' : 'blue',
          isNew: req.status === 'pending',
        })));
      } catch (err) {
        console.error('Failed to fetch requests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const newRequestsCount = requests.filter(r => r.isNew).length;

  const getStatusStyles = (color: string) => {
    const styles: Record<string, string> = {
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return styles[color] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <a href="/app/mentor-dashboard" className="text-emerald-600 hover:underline text-sm">
              ← Back to Dashboard
            </a>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentorship Requested</h1>
          <p className="text-gray-600">Review and structure new mentorship requests</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by mentee name or question..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {newRequestsCount > 0 && (
          <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-orange-600 rounded-full animate-pulse"></span>
              <div>
                <p className="font-semibold text-orange-900">{newRequestsCount} New Request{newRequestsCount !== 1 ? 's' : ''} Require{newRequestsCount === 1 ? 's' : ''} Your Review</p>
                <p className="text-sm text-orange-700">Structure the session agenda and send to mentees for confirmation</p>
              </div>
            </div>
          </div>
        )}

        {/* Request Cards */}
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className={`bg-white rounded-xl border-2 p-6 transition-all hover:shadow-md ${request.isNew
                ? 'border-orange-300 bg-orange-50/30'
                : 'border-gray-200'
                }`}
            >
              <div className="flex items-start gap-6">
                {/* Left: Mentee Info */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                    {request.mentee.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {request.mentee.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {request.mentee.role}
                      </span>
                      <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {request.mentee.industry}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center: Request Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Submitted {request.submittedDate}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Est. {request.estimatedTime} min</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Big Question</span>
                    </div>
                    <p className="text-gray-900 leading-relaxed">
                      {request.bigQuestion}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center text-xs px-3 py-1.5 rounded-full font-medium border ${getStatusStyles(request.statusColor)}`}>
                      {request.isNew && (
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                      )}
                      {request.status}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <a
                    href={`/app/mentor/request/${request.id}`}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${request.isNew
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                  >
                    {request.isNew ? 'Review & Structure' : 'View Details'}
                    <ChevronRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no requests) */}
        {requests.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Requests</h3>
            <p className="text-gray-600">All mentorship requests have been reviewed</p>
          </div>
        )}
      </div>
    </div>
  );
}
