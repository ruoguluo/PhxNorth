import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { profileAPI, mentorshipAPI, type UserProfile } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import {
  Sparkles,
  Star,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Search,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Badge } from "../components/ui/badge";

// ─── Constants ──────────────────────────────────────────────────────

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Energy",
  "Consumer",
  "Education",
  "Real Estate",
  "Manufacturing",
];

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Singapore",
  "Canada",
  "Australia",
  "Germany",
  "India",
  "UAE",
];

// ─── Helpers ────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function renderStars(rating: number) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const stars: React.ReactNode[] = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      );
    } else if (i === full && half) {
      stars.push(
        <Star
          key={i}
          className="w-3.5 h-3.5 fill-amber-400/50 text-amber-400"
        />
      );
    } else {
      stars.push(
        <Star key={i} className="w-3.5 h-3.5 text-gray-300" />
      );
    }
  }
  return stars;
}

// ─── Types ──────────────────────────────────────────────────────────

interface Filters {
  industry: string;
  country: string;
  status: string;
}

interface RequestForm {
  topic: string;
  message: string;
  type: "instant" | "scheduled";
  duration_minutes: number;
  proposed_datetime: string;
}

// ─── Component ──────────────────────────────────────────────────────

export function FindMentor() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Data
  const [mentors, setMentors] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState<Filters>({
    industry: "",
    country: "",
    status: "",
  });

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<UserProfile | null>(
    null
  );
  const [requestForm, setRequestForm] = useState<RequestForm>({
    topic: "",
    message: "",
    type: "scheduled",
    duration_minutes: 60,
    proposed_datetime: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);

  // ── Fetch mentors ────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params: { online_only?: boolean; industry?: string; country?: string } = {};
    if (filters.status === "online") params.online_only = true;
    if (filters.industry) params.industry = filters.industry;
    if (filters.country) params.country = filters.country;

    profileAPI
      .listMentors(Object.keys(params).length > 0 ? params : undefined)
      .then((data) => {
        if (!cancelled) setMentors(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load mentors");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters]);

  // ── AI Suggestions ───────────────────────────────────────────────

  const suggestions = useMemo(() => {
    if (mentors.length === 0) return [];
    const userIndustry = user?.industry;

    // Filter by user's industry if present
    if (userIndustry) {
      const matched = mentors.filter(
        (m) => m.industry?.toLowerCase() === userIndustry.toLowerCase()
      );
      if (matched.length > 0) {
        return matched
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);
      }
    }

    // Fallback: highest-rated mentors
    return [...mentors].sort((a, b) => b.rating - a.rating).slice(0, 3);
  }, [mentors, user?.industry]);

  // ── Request modal handlers ───────────────────────────────────────

  function openRequestModal(mentor: UserProfile) {
    setSelectedMentor(mentor);
    setRequestForm({
      topic: "",
      message: "",
      type: "scheduled",
      duration_minutes: 60,
    });
    setSubmitResult(null);
    setModalOpen(true);
  }

  async function handleSubmitRequest() {
    if (!selectedMentor || !requestForm.topic.trim()) return;
    setSubmitting(true);
    setSubmitResult(null);

    try {
      const reqData: Record<string, unknown> = {
        mentor_id: selectedMentor.id,
        type: requestForm.type,
        topic: requestForm.topic.trim(),
        message: requestForm.message.trim() || undefined,
        duration_minutes: requestForm.duration_minutes,
      };
      if (requestForm.type === "scheduled" && requestForm.proposed_datetime) {
        reqData.proposed_datetime = new Date(requestForm.proposed_datetime).toISOString();
      }
      await mentorshipAPI.createRequest(reqData);
      setSubmitResult({ ok: true, msg: "Mentorship request sent successfully!" });
      setTimeout(() => setModalOpen(false), 1500);
    } catch (err: any) {
      setSubmitResult({
        ok: false,
        msg: err.message ?? "Failed to send request",
      });
    } finally {
      setSubmitting(false);
    }
  }

  // ── Mentor Card ──────────────────────────────────────────────────

  function MentorCard({
    mentor,
    highlighted = false,
  }: {
    mentor: UserProfile;
    highlighted?: boolean;
  }) {
    return (
      <div
        className={`bg-white rounded-xl border p-6 transition-all hover:shadow-md ${
          highlighted
            ? "border-[#0A2463]/30 shadow-sm ring-1 ring-[#0A2463]/10"
            : "border-gray-200"
        }`}
      >
        {/* Header: Avatar + Name + Status */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 bg-[#0A2463] text-white rounded-full flex items-center justify-center text-lg font-semibold flex-shrink-0">
            {mentor.avatar_url ? (
              <img
                src={mentor.avatar_url}
                alt={mentor.full_name}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              getInitials(mentor.full_name)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {mentor.full_name}
              </h3>
              {mentor.is_online && (
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs text-emerald-600 font-medium">
                    Online
                  </span>
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 capitalize">{mentor.role}</p>
          </div>
        </div>

        {/* Industry & Country */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {mentor.industry && (
            <span className="inline-flex items-center gap-1 text-xs bg-[#0A2463]/10 text-[#0A2463] px-2 py-1 rounded-full font-medium">
              <Briefcase className="w-3 h-3" />
              {mentor.industry}
            </span>
          )}
          {mentor.current_country && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              <MapPin className="w-3 h-3" />
              {mentor.current_country}
            </span>
          )}
        </div>

        {/* Rating & Sessions */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            {renderStars(mentor.rating)}
            <span className="text-sm font-medium text-gray-900 ml-1">
              {mentor.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-gray-400">|</span>
          <span className="text-xs text-gray-600">
            {mentor.total_sessions} sessions
          </span>
        </div>

        {/* Specializations */}
        {mentor.specializations && mentor.specializations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {mentor.specializations.slice(0, 4).map((spec) => (
              <Badge
                key={spec}
                variant="secondary"
                className="text-xs bg-gray-100 text-gray-700 border-0"
              >
                {spec}
              </Badge>
            ))}
            {mentor.specializations.length > 4 && (
              <span className="text-xs text-gray-400">
                +{mentor.specializations.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Bio excerpt */}
        {mentor.bio && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {mentor.bio}
          </p>
        )}

        {/* Rate */}
        {mentor.hourly_rate != null && mentor.hourly_rate > 0 && (
          <div className="flex items-center gap-1 text-sm text-gray-700 mb-4">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="font-semibold">${mentor.hourly_rate}</span>
            <span className="text-gray-400">/hr</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/profile/${mentor.username}`)}
            className="flex-1 px-4 py-2 text-sm font-medium text-[#0A2463] bg-[#0A2463]/5 border border-[#0A2463]/20 rounded-lg hover:bg-[#0A2463]/10 transition-colors"
          >
            View Profile
          </button>
          <button
            onClick={() => openRequestModal(mentor)}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#0A2463] rounded-lg hover:bg-[#0A2463]/90 transition-colors"
          >
            Request Mentorship
          </button>
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find a Mentor
          </h1>
          <p className="text-gray-600">
            Connect with experienced professionals who can guide your career
            journey
          </p>
        </div>

        {/* ── AI Suggestions Section ────────────────────────────────── */}
        {suggestions.length > 0 && !loading && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-[#0A2463]" />
              <h2 className="text-xl font-bold text-gray-900">
                Recommended for You
              </h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Based on your industry, preferences, and career profile
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((mentor) => (
                <MentorCard
                  key={`suggestion-${mentor.id}`}
                  mentor={mentor}
                  highlighted
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Browse All Mentors ────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-5 h-5 text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900">
              Browse All Mentors
            </h2>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-4 mb-6 mt-4">
            {/* Industry Filter */}
            <div className="w-52">
              <Select
                value={filters.industry || "__all__"}
                onValueChange={(v) =>
                  setFilters((f) => ({
                    ...f,
                    industry: v === "__all__" ? "" : v,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Industries</SelectItem>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Country Filter */}
            <div className="w-52">
              <Select
                value={filters.country || "__all__"}
                onValueChange={(v) =>
                  setFilters((f) => ({
                    ...f,
                    country: v === "__all__" ? "" : v,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Countries</SelectItem>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="w-48">
              <Select
                value={filters.status || "__all__"}
                onValueChange={(v) =>
                  setFilters((f) => ({
                    ...f,
                    status: v === "__all__" ? "" : v,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All</SelectItem>
                  <SelectItem value="online">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                      Online Now
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          {!loading && !error && (
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {mentors.length}
                </span>{" "}
                mentor{mentors.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#0A2463] animate-spin" />
              <span className="ml-3 text-gray-600">Loading mentors...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center py-20 text-red-600">
              <AlertCircle className="w-6 h-6 mr-2" />
              <span>{error}</span>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && mentors.length === 0 && (
            <div className="text-center py-20">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No mentors found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}

          {/* Mentor Grid */}
          {!loading && !error && mentors.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Request Mentorship Modal ─────────────────────────────────── */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Request Mentorship</DialogTitle>
            <DialogDescription>
              {selectedMentor
                ? `Send a mentorship request to ${selectedMentor.full_name}`
                : "Send a mentorship request"}
            </DialogDescription>
          </DialogHeader>

          {submitResult?.ok ? (
            <div className="flex flex-col items-center py-6">
              <CheckCircle className="w-12 h-12 text-emerald-500 mb-3" />
              <p className="text-emerald-700 font-medium">
                {submitResult.msg}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Topic */}
              <div className="space-y-2">
                <Label htmlFor="req-topic">
                  Topic <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="req-topic"
                  placeholder="e.g. Career transition to product management"
                  value={requestForm.topic}
                  onChange={(e) =>
                    setRequestForm((f) => ({ ...f, topic: e.target.value }))
                  }
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="req-message">Message (optional)</Label>
                <Textarea
                  id="req-message"
                  placeholder="Introduce yourself and describe what you'd like help with..."
                  value={requestForm.message}
                  onChange={(e) =>
                    setRequestForm((f) => ({ ...f, message: e.target.value }))
                  }
                  rows={3}
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label>Session Type</Label>
                <RadioGroup
                  value={requestForm.type}
                  onValueChange={(v) =>
                    setRequestForm((f) => ({
                      ...f,
                      type: v as "instant" | "scheduled",
                    }))
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="instant" id="type-instant" />
                    <Label htmlFor="type-instant" className="font-normal">
                      Instant
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="scheduled" id="type-scheduled" />
                    <Label htmlFor="type-scheduled" className="font-normal">
                      Scheduled
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Proposed Date/Time (scheduled only) */}
              {requestForm.type === "scheduled" && (
                <div className="space-y-2">
                  <Label htmlFor="req-datetime">
                    Preferred Date & Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="req-datetime"
                    type="datetime-local"
                    value={requestForm.proposed_datetime}
                    onChange={(e) =>
                      setRequestForm((f) => ({ ...f, proposed_datetime: e.target.value }))
                    }
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              )}

              {/* Duration */}
              <div className="space-y-2">
                <Label>Duration</Label>
                <Select
                  value={String(requestForm.duration_minutes)}
                  onValueChange={(v) =>
                    setRequestForm((f) => ({
                      ...f,
                      duration_minutes: Number(v),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">
                      <span className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        30 minutes
                      </span>
                    </SelectItem>
                    <SelectItem value="60">
                      <span className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        60 minutes
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Error */}
              {submitResult && !submitResult.ok && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {submitResult.msg}
                </div>
              )}

              <DialogFooter>
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRequest}
                  disabled={submitting || !requestForm.topic.trim() || (requestForm.type === "scheduled" && !requestForm.proposed_datetime)}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#0A2463] rounded-lg hover:bg-[#0A2463]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  Send Request
                </button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
