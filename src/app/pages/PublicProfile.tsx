import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  MapPin, 
  CheckCircle, 
  Star,
  Users,
  Briefcase,
  Clock,
  Globe,
  DollarSign,
  X,
  Loader2,
  AlertCircle,
  Video,
  Calendar as CalendarIcon
} from 'lucide-react';
import { profileAPI, mentorshipAPI, type UserProfile } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';

// 5D mapping from DISC scores
const FIVE_D_LABELS = ['Drive', 'Discipline', 'Decision Quality', 'Dialogue', 'Dynamism'] as const;
function discTo5D(scores: { D: number; I: number; S: number; C: number }): Record<string, number> {
  return {
    'Drive': scores.D,
    'Discipline': scores.C,
    'Decision Quality': Math.round((scores.D + scores.C) / 2),
    'Dialogue': scores.I,
    'Dynamism': Math.round((scores.D + scores.I + (100 - scores.S)) / 3),
  };
}

interface JobEntry {
  title: string;
  company: string;
  location?: string;
  start_date: string;
  end_date: string | null;
  duration_months?: number;
}

type RequestType = 'instant' | 'scheduled';
type Duration = 30 | 60;

interface MentorshipForm {
  topic: string;
  message: string;
  type: RequestType;
  duration_minutes: Duration;
}

export function PublicProfile() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fiveDScores, setFiveDScores] = useState<Record<string, number> | null>(null);
  const [jobEntries, setJobEntries] = useState<JobEntry[]>([]);

  // Mentorship request modal
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [form, setForm] = useState<MentorshipForm>({
    topic: '',
    message: '',
    type: 'scheduled',
    duration_minutes: 60,
  });

  useEffect(() => {
    if (!name) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    profileAPI
      .getPublic(name)
      .then(async (data) => {
        if (cancelled) return;
        setProfile(data);

        // Fetch DISC/5D and career data using the email
        const email = (data as any).email;
        if (!email) return;

        const token = localStorage.getItem('phxnorth_token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch DISC profile
        try {
          const discResp = await fetch(`/api/v1/disc-profile-by-email?email=${encodeURIComponent(email)}`, { headers });
          if (discResp.ok) {
            const disc = await discResp.json();
            if (disc.scores && disc.confidence > 0 && !cancelled) {
              setFiveDScores(discTo5D(disc.scores));
            }
          }
        } catch { /* optional */ }

        // Fetch career data (job entries)
        try {
          // Need the DISC user UUID first
          const meResp = await fetch(`/api/v1/disc-profile-by-email?email=${encodeURIComponent(email)}`, { headers });
          if (meResp.ok) {
            const discData = await meResp.json();
            const userId = discData.user_id;
            if (userId) {
              const careerResp = await fetch(`/api/v1/users/${userId}/career`, { headers });
              if (careerResp.ok) {
                const career = await careerResp.json();
                if (career.job_entries && !cancelled) {
                  setJobEntries(career.job_entries);
                }
              }
            }
          }
        } catch { /* optional */ }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load profile');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [name]);

  const handleSubmitRequest = async () => {
    if (!profile) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      await mentorshipAPI.createRequest({
        mentor_id: profile.id,
        type: form.type,
        topic: form.topic,
        message: form.message,
        duration_minutes: form.duration_minutes,
      });
      setSubmitSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit request';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmitError(null);
    setSubmitSuccess(false);
    setForm({ topic: '', message: '', type: 'scheduled', duration_minutes: 60 });
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('')
    : '?';

  // ─── Loading state ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  // ─── Error / Not found ─────────────────────────────────────────────
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#0A2463] hover:text-[#0D47A1] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Go Back</span>
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">
            {error || `No profile found for "${name}".`}
          </p>
        </div>
      </div>
    );
  }

  // ─── Render stars ──────────────────────────────────────────────────
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalf) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#0A2463] hover:text-[#0D47A1] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Go Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-24 h-24 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-[#0A2463] to-[#0D47A1] rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                {initials}
              </div>
            )}

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
                    {/* Online status */}
                    {profile.is_online ? (
                      <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-medium">Online</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                        <span className="w-2 h-2 bg-gray-400 rounded-full" />
                        <span className="text-xs font-medium">Offline</span>
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  {profile.current_country && (
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.current_country}</span>
                    </div>
                  )}

                  {/* Industry / Sector */}
                  <p className="text-lg text-gray-700 font-medium">
                    {[profile.industry, profile.sector].filter(Boolean).join(' / ') || profile.role}
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-6 mt-4">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(profile.rating)}</div>
                  <span className="text-sm font-semibold text-gray-900">{profile.rating.toFixed(1)}</span>
                </div>

                {/* Sessions */}
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">{profile.total_sessions} sessions</span>
                </div>

                {/* Hourly rate */}
                {profile.hourly_rate != null && profile.hourly_rate > 0 && (
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm font-medium">${profile.hourly_rate}/hr</span>
                  </div>
                )}
              </div>

              {/* Role chip */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1.5 rounded-lg text-sm font-medium border bg-emerald-100 text-emerald-700 border-emerald-200 capitalize">
                  {profile.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Specializations */}
        {profile.specializations && profile.specializations.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Specializations</h2>
            <div className="flex flex-wrap gap-2">
              {profile.specializations.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg font-medium border border-blue-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* About Section */}
        {profile.bio && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{profile.bio}</p>
          </div>
        )}

        {/* Details grid */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {profile.industry && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Industry</h3>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-700">{profile.industry}</p>
                </div>
              </div>
            )}
            {profile.sector && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Sector</h3>
                <p className="text-sm text-gray-700">{profile.sector}</p>
              </div>
            )}
            {profile.current_country && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Country</h3>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-700">{profile.current_country}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 5D Profile Snapshot */}
        {fiveDScores && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">5D Profile Snapshot</h2>
            <div className="space-y-3">
              {FIVE_D_LABELS.map((label) => {
                const value = fiveDScores[label] ?? 0;
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium">{label}</span>
                      <span className="font-bold text-gray-900">{Math.round(value)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(value, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Career History */}
        {jobEntries.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Career History</h2>
            <div className="space-y-4">
              {jobEntries.map((job, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-[#0A2463] rounded-full mt-1.5" />
                    {i < jobEntries.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 mt-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <h3 className="text-sm font-bold text-gray-900">{job.title || 'Untitled Role'}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      {job.start_date && (
                        <span>
                          {job.start_date} — {job.end_date || 'Present'}
                        </span>
                      )}
                      {job.duration_months && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded">
                          {job.duration_months} mo
                        </span>
                      )}
                      {job.location && <span>{job.location}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Request Mentorship Button */}
        {profile.role === 'mentor' && isAuthenticated && user?.id !== profile.id && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <button
              onClick={() => setShowModal(true)}
              className="w-full px-6 py-3 bg-[#0A2463] text-white rounded-lg font-semibold hover:bg-[#0D47A1] transition-colors flex items-center justify-center gap-2"
            >
              <Video className="w-5 h-5" />
              Request Mentorship
            </button>
          </div>
        )}
      </div>

      {/* ─── Mentorship Request Modal ──────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                Request Mentorship from {profile.full_name}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-5">
              {submitSuccess ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Request Sent!</h3>
                  <p className="text-sm text-gray-600">
                    Your mentorship request has been submitted. The mentor will review it shortly.
                  </p>
                  <button
                    onClick={closeModal}
                    className="mt-4 px-6 py-2 bg-[#0A2463] text-white rounded-lg font-medium hover:bg-[#0D47A1] transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  {/* Type toggle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setForm((f) => ({ ...f, type: 'instant' }))}
                        className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                          form.type === 'instant'
                            ? 'bg-[#0A2463] text-white border-[#0A2463]'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Instant
                      </button>
                      <button
                        onClick={() => setForm((f) => ({ ...f, type: 'scheduled' }))}
                        className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                          form.type === 'scheduled'
                            ? 'bg-[#0A2463] text-white border-[#0A2463]'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Scheduled
                      </button>
                    </div>
                  </div>

                  {/* Duration toggle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setForm((f) => ({ ...f, duration_minutes: 30 }))}
                        className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors flex items-center justify-center gap-1.5 ${
                          form.duration_minutes === 30
                            ? 'bg-[#0A2463] text-white border-[#0A2463]'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                        30 min
                      </button>
                      <button
                        onClick={() => setForm((f) => ({ ...f, duration_minutes: 60 }))}
                        className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors flex items-center justify-center gap-1.5 ${
                          form.duration_minutes === 60
                            ? 'bg-[#0A2463] text-white border-[#0A2463]'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                        60 min
                      </button>
                    </div>
                  </div>

                  {/* Topic */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                    <input
                      type="text"
                      placeholder="e.g. Career transition advice"
                      value={form.topic}
                      onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2463] focus:border-transparent"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Briefly describe what you'd like to discuss..."
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0A2463] focus:border-transparent"
                    />
                  </div>

                  {submitError && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal footer */}
            {!submitSuccess && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRequest}
                  disabled={submitting || !form.topic.trim()}
                  className="px-6 py-2 bg-[#0A2463] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
