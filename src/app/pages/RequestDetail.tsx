import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  GripVertical,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Send,
  Edit3,
  Check,
  AlertCircle,
  ArrowLeft,
  User,
  MapPin,
  Briefcase,
  Star,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { mentorshipAPI, profileAPI } from '../../lib/api';

interface SubQuestion {
  id: string;
  text: string;
  estimatedMinutes: number;
}

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
  created_at: string;
  mentee_name: string | null;
  mentor_name: string | null;
  mentee_username: string | null;
}

interface MenteeProfile {
  id: number;
  username: string;
  full_name: string | null;
  role: string;
  is_online: boolean;
  bio: string | null;
  avatar_url: string | null;
  rating: number;
  total_sessions: number;
  industry: string | null;
  sector: string | null;
  current_country: string | null;
  specializations: string[] | null;
}

export function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Data state
  const [request, setRequest] = useState<MentorshipRequest | null>(null);
  const [menteeProfile, setMenteeProfile] = useState<MenteeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Big Question & Agenda state (initialized from request data)
  const [bigQuestion, setBigQuestion] = useState('');
  const [isEditingBigQuestion, setIsEditingBigQuestion] = useState(false);
  const [clarifyingNotes, setClarifyingNotes] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [subQuestions, setSubQuestions] = useState<SubQuestion[]>([]);

  // Action state
  const [isPending, setIsPending] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionResult, setActionResult] = useState<{ ok: boolean; msg: string } | null>(null);

  // Fetch request data and mentee profile
  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const reqData = await mentorshipAPI.getRequest(parseInt(id)) as MentorshipRequest;
      setRequest(reqData);

      // Initialize big question from request topic
      setBigQuestion(reqData.topic);
      if (reqData.message) {
        setClarifyingNotes(reqData.message);
      }
      setExpectedOutcome(`Help ${reqData.mentee_name || 'mentee'} with: ${reqData.topic}`);

      // Generate initial sub-questions based on topic
      setSubQuestions([
        {
          id: '1',
          text: `What is your current situation regarding: "${reqData.topic}"?`,
          estimatedMinutes: 10,
        },
        {
          id: '2',
          text: 'What specific challenges or blockers are you facing?',
          estimatedMinutes: 15,
        },
        {
          id: '3',
          text: 'What approaches have you already tried or considered?',
          estimatedMinutes: 15,
        },
        {
          id: '4',
          text: 'What does success look like for you? What outcome are you hoping for?',
          estimatedMinutes: 10,
        },
        {
          id: '5',
          text: 'What is your timeline and what resources do you have available?',
          estimatedMinutes: 10,
        },
      ]);

      // Fetch mentee profile if username is available
      if (reqData.mentee_username) {
        try {
          const profile = await profileAPI.getPublic(reqData.mentee_username) as MenteeProfile;
          setMenteeProfile(profile);
        } catch {
          // Profile fetch is optional -- don't block the page
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load request');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Sub-question helpers
  const totalTime = subQuestions.reduce((sum, q) => sum + q.estimatedMinutes, 0);

  const addSubQuestion = () => {
    setSubQuestions([...subQuestions, {
      id: Date.now().toString(),
      text: '',
      estimatedMinutes: 10,
    }]);
  };

  const deleteSubQuestion = (qId: string) => {
    setSubQuestions(subQuestions.filter(q => q.id !== qId));
  };

  const updateSubQuestion = (qId: string, field: keyof SubQuestion, value: string | number) => {
    setSubQuestions(subQuestions.map(q => q.id === qId ? { ...q, [field]: value } : q));
  };

  const moveSubQuestion = (index: number, direction: 'up' | 'down') => {
    const arr = [...subQuestions];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target >= 0 && target < arr.length) {
      [arr[index], arr[target]] = [arr[target], arr[index]];
      setSubQuestions(arr);
    }
  };

  // Actions
  const handleAccept = async () => {
    if (!request) return;
    setActionLoading(true);
    try {
      await mentorshipAPI.respondToRequest(request.id, 'accept');
      setActionResult({ ok: true, msg: 'Request accepted! Session created.' });
      setTimeout(() => navigate('/app/mentor/dashboard'), 1500);
    } catch (err: any) {
      setActionResult({ ok: false, msg: err.message || 'Failed to accept' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!request) return;
    setActionLoading(true);
    try {
      await mentorshipAPI.respondToRequest(request.id, 'decline');
      setActionResult({ ok: true, msg: 'Request declined.' });
      setTimeout(() => navigate('/app/mentor/dashboard'), 1500);
    } catch (err: any) {
      setActionResult({ ok: false, msg: err.message || 'Failed to decline' });
    } finally {
      setActionLoading(false);
    }
  };

  const sendStructuredPlan = () => {
    setIsPending(true);
    // TODO: persist structured plan to backend when endpoint exists
  };

  // Loading / Error states
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-gray-500">Loading request...</div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-700 font-medium">{error || 'Request not found'}</p>
            <button onClick={() => navigate('/app/mentor/dashboard')} className="mt-4 text-sm text-red-600 hover:underline">
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const menteeInitials = request.mentee_name
    ? request.mentee_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : '?';

  const isAlreadyHandled = request.status !== 'pending';

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/app/mentor/dashboard')}
          className="flex items-center gap-2 text-emerald-600 hover:underline text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Status Banner */}
        {isPending && (
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-900">Waiting for mentee confirmation</p>
              <p className="text-sm text-blue-700">The structured plan has been sent to the mentee for review</p>
            </div>
          </div>
        )}

        {actionResult && (
          <div className={`rounded-xl p-4 mb-6 flex items-center gap-3 ${actionResult.ok ? 'bg-emerald-50 border-2 border-emerald-300' : 'bg-red-50 border-2 border-red-300'}`}>
            {actionResult.ok ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
            <p className={`font-semibold ${actionResult.ok ? 'text-emerald-900' : 'text-red-900'}`}>{actionResult.msg}</p>
          </div>
        )}

        {isAlreadyHandled && (
          <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 mb-6 flex items-center gap-3">
            <Check className="w-5 h-5 text-gray-600" />
            <p className="text-gray-700">This request has been <span className="font-semibold">{request.status}</span>.</p>
          </div>
        )}

        {/* Top Section - Mentee Overview + Request Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-8">
            {/* Left: Mentee Profile */}
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                  {menteeInitials}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{request.mentee_name || 'Unknown Mentee'}</h2>
                  <div className="flex flex-wrap items-center gap-2">
                    {menteeProfile?.industry && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> {menteeProfile.industry}
                      </span>
                    )}
                    {menteeProfile?.current_country && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {menteeProfile.current_country}
                      </span>
                    )}
                    {menteeProfile && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded flex items-center gap-1">
                        <Star className="w-3 h-3" /> {menteeProfile.rating.toFixed(1)} · {menteeProfile.total_sessions} sessions
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {menteeProfile?.bio && (
                <p className="text-sm text-gray-600 mb-3">{menteeProfile.bio}</p>
              )}

              {menteeProfile?.specializations && menteeProfile.specializations.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {menteeProfile.specializations.map((s, i) => (
                    <span key={i} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Request Info */}
            <div className="w-72 flex-shrink-0">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Request Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Submitted</span>
                    <span className="ml-auto font-medium text-gray-900">
                      {new Date(request.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Type</span>
                    <span className="ml-auto font-medium text-gray-900 capitalize">{request.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Duration</span>
                    <span className="ml-auto font-medium text-gray-900">{request.duration_minutes} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Agenda Time</span>
                    <span className="ml-auto font-medium text-emerald-600">{totalTime} min</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
                      request.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                      request.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                      request.status === 'declined' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Initial Big Question */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Initial Big Question</h2>
            <button
              onClick={() => setIsEditingBigQuestion(!isEditingBigQuestion)}
              className="text-sm text-emerald-600 hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-4 h-4" />
              {isEditingBigQuestion ? 'Save' : 'Edit'}
            </button>
          </div>

          {isEditingBigQuestion ? (
            <textarea
              value={bigQuestion}
              onChange={(e) => setBigQuestion(e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
              rows={3}
            />
          ) : (
            <p className="text-gray-900 text-lg mb-4 leading-relaxed">{bigQuestion}</p>
          )}

          {request.message && (
            <div className="bg-gray-50 rounded-lg p-4 mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Mentee's Message</p>
              <p className="text-sm text-gray-700">{request.message}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Clarifying Notes (Optional)
            </label>
            <textarea
              value={clarifyingNotes}
              onChange={(e) => setClarifyingNotes(e.target.value)}
              placeholder="Add any clarifying context or notes for the mentee..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              rows={2}
            />
          </div>
        </div>

        {/* Section 2: AI Structured Question Agenda */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-[#0A2463]" />
                <h2 className="text-xl font-bold text-gray-900">AI Structured Question Agenda</h2>
              </div>
              <p className="text-sm text-gray-600">Edit, reorder, add, or remove sub-questions</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Estimated Time</p>
              <p className="text-2xl font-bold text-emerald-600">{totalTime} min</p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            {subQuestions.map((question, index) => (
              <div
                key={question.id}
                className="border-2 border-blue-200 bg-blue-50/50 rounded-lg p-4 hover:border-blue-400 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1 pt-2">
                    <button
                      onClick={() => moveSubQuestion(index, 'up')}
                      disabled={index === 0}
                      className={`p-1 rounded hover:bg-blue-200 transition-colors ${index === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      <GripVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    <button
                      onClick={() => moveSubQuestion(index, 'down')}
                      disabled={index === subQuestions.length - 1}
                      className={`p-1 rounded hover:bg-blue-200 transition-colors ${index === subQuestions.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      <GripVertical className="w-5 h-5 text-gray-400 rotate-180" />
                    </button>
                  </div>

                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold mt-1">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <textarea
                      value={question.text}
                      onChange={(e) => updateSubQuestion(question.id, 'text', e.target.value)}
                      placeholder="Enter sub-question..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                      rows={2}
                    />
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={question.estimatedMinutes}
                        onChange={(e) => updateSubQuestion(question.id, 'estimatedMinutes', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                      />
                      <span className="text-sm text-gray-600">minutes</span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteSubQuestion(question.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors mt-1"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addSubQuestion}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Sub-Question
          </button>
        </div>

        {/* Section 3: Session Structure Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Session Structure Summary</h2>
          <div className="grid grid-cols-3 gap-6 mb-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Sub-Questions</p>
              <p className="text-3xl font-bold text-gray-900">{subQuestions.length}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Agenda Time</p>
              <p className="text-3xl font-bold text-emerald-600">{totalTime} min</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Session Format</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{request.type}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Outcome Summary</label>
            <textarea
              value={expectedOutcome}
              onChange={(e) => setExpectedOutcome(e.target.value)}
              placeholder="Describe what the mentee will achieve from this session..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              rows={2}
            />
          </div>
        </div>

        {/* Section 4: Actions */}
        {!isAlreadyHandled && (
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border-2 border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Ready to respond?</h3>
                <p className="text-sm text-gray-600">
                  Accept to create a session, or send the structured plan first for mentee confirmation.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDecline}
                  disabled={actionLoading || isPending}
                  className="px-6 py-3 rounded-xl font-semibold border-2 border-red-300 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <XCircle className="w-5 h-5" />
                  Decline
                </button>
                {!isPending ? (
                  <button
                    onClick={sendStructuredPlan}
                    className="px-6 py-3 rounded-xl font-semibold border-2 border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Plan First
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-blue-700 px-4">
                    <Check className="w-4 h-4" />
                    Plan sent
                  </div>
                )}
                <button
                  onClick={handleAccept}
                  disabled={actionLoading}
                  className="px-8 py-3 rounded-xl font-semibold shadow-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle className="w-5 h-5" />
                  Accept & Schedule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
