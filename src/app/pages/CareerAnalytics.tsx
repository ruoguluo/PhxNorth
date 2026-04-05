import { useEffect, useState } from "react";
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  ArrowDownRight,
  Shuffle,
  Loader2,
  AlertCircle,
  BarChart3,
  Timer,
  Layers,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  discCareerAPI,
  type CareerProfile,
  type CareerEntry,
  type CareerAnalytics as CareerAnalyticsData,
} from "../../lib/disc-api";

// ─── Helpers ────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  if (!iso) return "Present";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years === 0) return `${rem}mo`;
  if (rem === 0) return `${years}yr`;
  return `${years}yr ${rem}mo`;
}

function computeCareerSpanYears(entries: CareerEntry[]): number {
  if (entries.length === 0) return 0;
  const starts = entries.map((e) => new Date(e.start_date).getTime());
  const ends = entries.map((e) =>
    e.end_date ? new Date(e.end_date).getTime() : Date.now()
  );
  const earliest = Math.min(...starts);
  const latest = Math.max(...ends);
  return Math.round(((latest - earliest) / (1000 * 60 * 60 * 24 * 365.25)) * 10) / 10;
}

function computeShortTenureRate(entries: CareerEntry[]): number {
  if (entries.length === 0) return 0;
  const short = entries.filter((e) => (e.duration_months ?? 0) < 12).length;
  return Math.round((short / entries.length) * 100);
}

function computeTransitionsPerYear(entries: CareerEntry[]): string {
  const span = computeCareerSpanYears(entries);
  if (span === 0 || entries.length <= 1) return "0";
  return ((entries.length - 1) / span).toFixed(1);
}

function uniqueIndustries(entries: CareerEntry[]): string[] {
  const set = new Set<string>();
  entries.forEach((e) => {
    if (e.industry) set.add(e.industry);
  });
  return Array.from(set);
}

// ─── Component ──────────────────────────────────────────────────────

export function CareerAnalytics() {
  const [data, setData] = useState<CareerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    discCareerAPI
      .get()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load career data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Loading career analytics...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-red-200 p-8 max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Unable to load career data</h2>
          <p className="text-sm text-gray-600">{error ?? "An unknown error occurred."}</p>
        </div>
      </div>
    );
  }

  const entries = data.job_entries ?? [];
  const analytics = data.analytics;
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.start_date ?? 0).getTime() - new Date(a.start_date ?? 0).getTime()
  );
  const industries = uniqueIndustries(entries);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Career Analytics</h1>
          <p className="text-lg text-gray-600">
            Comprehensive career trajectory analysis and behavioral career intelligence
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
            <Calendar className="w-4 h-4" />
            <span>
              {entries.length} roles analyzed
            </span>
          </div>
        </div>

        {/* ── Section 1: Career Summary ─────────────────────────────── */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Career Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard
              icon={<Briefcase className="w-5 h-5" />}
              label="Total Roles"
              value={String(entries.length)}
              accent="blue"
            />
            <StatCard
              icon={<Calendar className="w-5 h-5" />}
              label="Career Span"
              value={`${computeCareerSpanYears(entries)} yr`}
              accent="indigo"
            />
            <StatCard
              icon={<Clock className="w-5 h-5" />}
              label="Avg Tenure"
              value={`${Math.round(analytics.tenure_avg_months)} mo`}
              accent="purple"
            />
            <StatCard
              icon={<Layers className="w-5 h-5" />}
              label="Role Diversity"
              value={`${Math.round(analytics.role_diversity * 100)}%`}
              accent="emerald"
            />
            <StatCard
              icon={<Timer className="w-5 h-5" />}
              label="Short Tenure Rate"
              value={`${computeShortTenureRate(entries)}%`}
              accent="amber"
            />
            <StatCard
              icon={<Shuffle className="w-5 h-5" />}
              label="Transitions / yr"
              value={computeTransitionsPerYear(entries)}
              accent="rose"
            />
          </div>
        </div>

        {/* ── Section 2: Job Timeline ───────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Timeline</h2>
            <p className="text-gray-600">Chronological view of career entries</p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

            <div className="space-y-6">
              {sortedEntries.map((entry, idx) => (
                <TimelineEntry key={idx} entry={entry} isLatest={idx === 0} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Section 3: Analytics Detail ───────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Detail</h2>
            <p className="text-gray-600">Detailed career trajectory metrics</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <MetricCard label="Progression Rate" value={analytics.progression_rate} />
            <MetricCard
              label="Industry Consistency"
              value={`${Math.round(analytics.industry_consistency * 100)}%`}
            />
            <MetricCard
              label="Role Diversity"
              value={`${Math.round(analytics.role_diversity * 100)}%`}
            />
            <MetricCard
              label="Avg Tenure"
              value={formatDuration(Math.round(analytics.tenure_avg_months))}
            />
            <MetricCard
              label="Unique Industries"
              value={String(industries.length)}
            />
            <MetricCard
              label="Career Span"
              value={`${computeCareerSpanYears(entries)} yr`}
            />
            <MetricCard
              label="Short Tenures (<12mo)"
              value={String(entries.filter((e) => e.duration_months < 12).length)}
            />
            <MetricCard
              label="Long Tenures (>36mo)"
              value={String(entries.filter((e) => e.duration_months > 36).length)}
            />
          </div>
        </div>

        {/* ── Section 4: Industry Breakdown ─────────────────────────── */}
        {industries.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Industry Breakdown</h2>
              <p className="text-gray-600">Cross-industry exposure and diversity</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {industries.map((industry) => {
                const count = entries.filter((e) => e.industry === industry).length;
                return (
                  <div
                    key={industry}
                    className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2"
                  >
                    <Building2 className="w-4 h-4 text-[#0A2463]" />
                    <span className="font-medium text-gray-900">{industry}</span>
                    <Badge variant="secondary" className="text-xs">
                      {count} {count === 1 ? "role" : "roles"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────

const ACCENT_MAP: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600 border-blue-200",
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
  purple: "bg-purple-50 text-purple-600 border-purple-200",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
  amber: "bg-amber-50 text-amber-600 border-amber-200",
  rose: "bg-rose-50 text-rose-600 border-rose-200",
};

function StatCard({
  icon,
  label,
  value,
  accent = "blue",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: string;
}) {
  const colors = ACCENT_MAP[accent] ?? ACCENT_MAP.blue;
  return (
    <Card className={`border ${colors.split(" ").slice(2).join(" ")}`}>
      <CardContent className="pt-6">
        <div className={`inline-flex p-2 rounded-lg mb-3 ${colors.split(" ").slice(0, 2).join(" ")}`}>
          {icon}
        </div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-xs font-medium text-gray-500 mt-1">{label}</div>
      </CardContent>
    </Card>
  );
}

function TimelineEntry({
  entry,
  isLatest,
}: {
  entry: CareerEntry;
  isLatest: boolean;
}) {
  return (
    <div className="relative pl-12">
      {/* Dot on the timeline */}
      <div
        className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
          isLatest ? "bg-[#0A2463]" : "bg-gray-400"
        }`}
      />

      <div className="bg-gray-50 rounded-lg border border-gray-100 p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900">{entry.title}</h3>
            <p className="text-sm text-gray-600">{entry.company}</p>
          </div>
          {entry.industry && (
            <Badge variant="secondary" className="text-xs shrink-0">
              {entry.industry}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(entry.start_date)} — {entry.end_date ? formatDate(entry.end_date) : "Present"}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(entry.duration_months)}
          </span>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-medium text-gray-500 mb-1">{label}</div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
