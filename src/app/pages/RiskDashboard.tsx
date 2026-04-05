import { useState, useEffect } from "react";
import {
  Shield,
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Flag,
  Activity,
  TrendingUp,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import {
  discRiskAPI,
  type RiskAssessment,
  type RiskFlag,
  type ContradictionResponse,
  type Contradiction,
  type BehavioralShiftResponse,
  type BehavioralShiftEntry,
} from "../../lib/disc-api";

// ─── Severity Helpers ───────────────────────────────────────────────

type Severity = "low" | "medium" | "high" | "critical";

const severityColorMap: Record<Severity, { bg: string; text: string; border: string; bar: string }> = {
  low:      { bg: "bg-emerald-50",  text: "text-emerald-800", border: "border-emerald-200", bar: "bg-emerald-500" },
  medium:   { bg: "bg-yellow-100",  text: "text-yellow-800",  border: "border-yellow-200",  bar: "bg-yellow-500" },
  high:     { bg: "bg-orange-100",  text: "text-orange-800",  border: "border-orange-200",  bar: "bg-orange-500" },
  critical: { bg: "bg-red-100",     text: "text-red-800",     border: "border-red-200",     bar: "bg-red-500" },
};

const overallRiskDisplay: Record<Severity, { label: string; icon: React.ReactNode; color: string }> = {
  low:      { label: "GREEN",  icon: <CheckCircle className="w-8 h-8" />, color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  medium:   { label: "YELLOW", icon: <AlertCircle className="w-8 h-8" />, color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  high:     { label: "ORANGE", icon: <AlertTriangle className="w-8 h-8" />, color: "bg-orange-100 text-orange-800 border-orange-300" },
  critical: { label: "RED",    icon: <ShieldAlert className="w-8 h-8" />, color: "bg-red-100 text-red-800 border-red-300" },
};

function formatCategoryName(raw: string): string {
  return raw
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const c = severityColorMap[severity];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full transition-all ${color}`}
        style={{ width: `${Math.min(value * 100, 100)}%` }}
      />
    </div>
  );
}

// ─── Significance Helpers ───────────────────────────────────────────

const significanceColors: Record<string, string> = {
  minor: "bg-emerald-50 text-emerald-700",
  notable: "bg-yellow-50 text-yellow-700",
  major: "bg-red-50 text-red-700",
};

const directionIcons: Record<string, string> = {
  increase: "↑",
  decrease: "↓",
};

// ─── Main Component ─────────────────────────────────────────────────

export function RiskDashboard() {
  const [risk, setRisk] = useState<RiskAssessment | null>(null);
  const [contradictions, setContradictions] = useState<ContradictionResponse | null>(null);
  const [shifts, setShifts] = useState<BehavioralShiftResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [riskData, contradictionData, shiftData] = await Promise.all([
          discRiskAPI.get(),
          discRiskAPI.contradictions(),
          discRiskAPI.behavioralShift(),
        ]);
        setRisk(riskData);
        setContradictions(contradictionData);
        setShifts(shiftData);
      } catch (err) {
        console.error("Failed to fetch risk data:", err);
        setError(err instanceof Error ? err.message : "Failed to load risk data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading risk dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-red-200 p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const flaggedCount = risk?.flags.filter((f) => f.severity === "high" || f.severity === "critical").length ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-8">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <a
          href="/app/admin"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Back to Admin Portal</span>
        </a>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* ── Section 1: Risk Overview Header ────────────────────────── */}
        {risk && <RiskOverviewHeader risk={risk} flaggedCount={flaggedCount} />}

        {/* ── Section 2: Risk Category Cards ─────────────────────────── */}
        {risk && risk.flags.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Risk Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {risk.flags.map((flag, i) => (
                <RiskCategoryCard key={`${flag.category}-${i}`} flag={flag} />
              ))}
            </div>
          </div>
        )}

        {/* ── Section 3: Contradiction Analysis ──────────────────────── */}
        {contradictions && <ContradictionAnalysis data={contradictions} />}

        {/* ── Section 4: Behavioral Shift ────────────────────────────── */}
        {shifts && <BehavioralShiftSection data={shifts} />}

        {/* ── Section 5: Active Red Flags ────────────────────────────── */}
        {risk && <ActiveRedFlags flags={risk.flags} />}
      </div>
    </div>
  );
}

// ─── Section 1: Risk Overview Header ────────────────────────────────

function RiskOverviewHeader({ risk, flaggedCount }: { risk: RiskAssessment; flaggedCount: number }) {
  const display = overallRiskDisplay[risk.overall_risk];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Risk Dashboard</h1>
          <p className="text-gray-600">Behavioral risk analysis and flag monitoring</p>
        </div>
        <div className={`flex items-center gap-4 px-6 py-4 rounded-xl border-2 ${display.color}`}>
          {display.icon}
          <div>
            <div className="text-2xl font-bold">{display.label}</div>
            <div className="text-sm opacity-75">Overall Risk Tier</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Activity className="w-4 h-4" />
          <span>Assessed: {new Date(risk.assessed_at).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Flag className="w-4 h-4 text-red-500" />
          <span className="font-semibold text-gray-900">{flaggedCount}</span>
          <span className="text-gray-600">high/critical flags</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield className="w-4 h-4" />
          <span>{risk.flags.length} total categories assessed</span>
        </div>
      </div>
    </div>
  );
}

// ─── Section 2: Risk Category Card ──────────────────────────────────

function RiskCategoryCard({ flag }: { flag: RiskFlag }) {
  const [expanded, setExpanded] = useState(false);
  const colors = severityColorMap[flag.severity];
  const isHighRisk = flag.severity === "high" || flag.severity === "critical";

  return (
    <div className={`bg-white rounded-xl border ${isHighRisk ? colors.border : "border-gray-200"} p-5`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">{formatCategoryName(flag.category)}</h3>
        <SeverityBadge severity={flag.severity} />
      </div>

      {isHighRisk && (
        <div className="flex items-center gap-1.5 mb-3">
          <Flag className="w-3.5 h-3.5 text-red-500" />
          <span className="text-xs font-semibold text-red-600">Flagged</span>
        </div>
      )}

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{flag.description}</p>

      {/* Evidence collapsible */}
      {flag.evidence.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {flag.evidence.length} evidence item{flag.evidence.length !== 1 ? "s" : ""}
          </button>
          {expanded && (
            <ul className="mt-2 space-y-1.5">
              {flag.evidence.map((e, i) => (
                <li key={i} className="text-xs text-gray-600 pl-3 border-l-2 border-gray-200">
                  {e}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="text-xs text-gray-400 mt-3">
        {new Date(flag.detected_at).toLocaleDateString()}
      </div>
    </div>
  );
}

// ─── Section 3: Contradiction Analysis ──────────────────────────────

function ContradictionAnalysis({ data }: { data: ContradictionResponse }) {
  const contradictionCount = data.contradictions.length;

  // Group by severity
  const bySeverity = data.contradictions.reduce(
    (acc, c) => {
      acc[c.severity] = (acc[c.severity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-50 p-2.5 rounded-lg">
          <AlertCircle className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Contradiction Analysis</h2>
          <p className="text-sm text-gray-500">
            {contradictionCount} contradiction{contradictionCount !== 1 ? "s" : ""} detected
          </p>
        </div>
      </div>

      {/* Summary badges */}
      <div className="flex items-center gap-3 mb-6">
        {(["low", "medium", "high"] as const).map(
          (sev) =>
            bySeverity[sev] && (
              <span
                key={sev}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${severityColorMap[sev as Severity]?.bg ?? ""} ${severityColorMap[sev as Severity]?.text ?? ""}`}
              >
                {bySeverity[sev]} {sev}
              </span>
            ),
        )}
      </div>

      {/* Contradiction list */}
      {data.contradictions.length > 0 ? (
        <div className="space-y-3">
          {data.contradictions.map((c, i) => (
            <ContradictionCard key={i} contradiction={c} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
          <p className="font-medium text-gray-600">No contradictions detected</p>
          <p className="text-sm">Data appears internally consistent</p>
        </div>
      )}

      <div className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
        Last assessed: {new Date(data.assessed_at).toLocaleString()}
      </div>
    </div>
  );
}

function ContradictionCard({ contradiction }: { contradiction: Contradiction }) {
  const sevColors = severityColorMap[contradiction.severity as Severity] ?? severityColorMap.low;

  return (
    <div className={`p-4 rounded-lg border ${sevColors.border} ${sevColors.bg}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className={`w-4 h-4 ${sevColors.text}`} />
          <span className={`font-semibold text-sm ${sevColors.text}`}>
            {formatCategoryName(contradiction.field)}
          </span>
        </div>
        <SeverityBadge severity={contradiction.severity as Severity} />
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="bg-white/60 rounded-md p-2.5">
          <div className="text-xs text-gray-500 mb-1">{contradiction.source_a}</div>
          <div className="text-sm text-gray-800">{contradiction.claim_a}</div>
        </div>
        <div className="bg-white/60 rounded-md p-2.5">
          <div className="text-xs text-gray-500 mb-1">{contradiction.source_b}</div>
          <div className="text-sm text-gray-800">{contradiction.claim_b}</div>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        Detected: {new Date(contradiction.detected_at).toLocaleDateString()}
      </div>
    </div>
  );
}

// ─── Section 4: Behavioral Shift ────────────────────────────────────

function BehavioralShiftSection({ data }: { data: BehavioralShiftResponse }) {
  const hasShifts = data.shifts.length > 0;
  const majorShifts = data.shifts.filter((s) => s.significance === "major");

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-50 p-2.5 rounded-lg">
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Behavioral Shift Analysis</h2>
          <p className="text-sm text-gray-500">Period: {data.period}</p>
        </div>
        <div className="ml-auto">
          {hasShifts ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
              <Activity className="w-3.5 h-3.5" />
              {data.shifts.length} shift{data.shifts.length !== 1 ? "s" : ""} detected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
              <CheckCircle className="w-3.5 h-3.5" />
              Stable
            </span>
          )}
        </div>
      </div>

      {hasShifts ? (
        <div className="space-y-4">
          {/* Summary for major shifts */}
          {majorShifts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-2">
              <div className="flex items-center gap-2 text-red-800 font-semibold text-sm mb-1">
                <ShieldAlert className="w-4 h-4" />
                {majorShifts.length} major shift{majorShifts.length !== 1 ? "s" : ""} detected
              </div>
              <p className="text-xs text-red-700">
                Dimensions: {majorShifts.map((s) => s.dimension).join(", ")}
              </p>
            </div>
          )}

          {/* Shift cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.shifts.map((shift, i) => (
              <ShiftCard key={i} shift={shift} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
          <p className="font-medium text-gray-600">No behavioral shifts detected</p>
          <p className="text-sm">Profile remains stable within normal thresholds</p>
        </div>
      )}

      <div className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
        Last assessed: {new Date(data.assessed_at).toLocaleString()}
      </div>
    </div>
  );
}

function ShiftCard({ shift }: { shift: BehavioralShiftEntry }) {
  const absPercent = Math.min(Math.abs(shift.delta) * 100, 100);
  const sigColor = significanceColors[shift.significance] ?? significanceColors.minor;
  const barColor = shift.significance === "major" ? "bg-red-500" : shift.significance === "notable" ? "bg-yellow-500" : "bg-emerald-500";

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{shift.dimension}</h4>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${sigColor}`}>
            {shift.significance}
          </span>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            {directionIcons[shift.direction] ?? ""} {shift.delta > 0 ? "+" : ""}
            {shift.delta.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">
            {shift.previous_value.toFixed(2)} → {shift.current_value.toFixed(2)}
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${barColor}`}
          style={{ width: `${absPercent}%` }}
        />
      </div>
    </div>
  );
}

// ─── Section 5: Active Red Flags ────────────────────────────────────

function ActiveRedFlags({ flags }: { flags: RiskFlag[] }) {
  const highFlags = flags.filter((f) => f.severity === "high" || f.severity === "critical");

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-red-50 p-2.5 rounded-lg">
          <Flag className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Active Red Flags</h2>
          <p className="text-sm text-gray-500">
            {highFlags.length} active flag{highFlags.length !== 1 ? "s" : ""} requiring attention
          </p>
        </div>
      </div>

      {highFlags.length > 0 ? (
        <div className="space-y-3">
          {highFlags.map((flag, i) => {
            const colors = severityColorMap[flag.severity];
            return (
              <div key={i} className={`flex items-start gap-4 p-4 rounded-lg border ${colors.border} ${colors.bg}`}>
                <div className="mt-0.5">
                  {flag.severity === "critical" ? (
                    <ShieldAlert className={`w-5 h-5 ${colors.text}`} />
                  ) : (
                    <AlertTriangle className={`w-5 h-5 ${colors.text}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-semibold text-sm ${colors.text}`}>
                      {formatCategoryName(flag.category)}
                    </h4>
                    <SeverityBadge severity={flag.severity} />
                  </div>
                  <p className="text-sm text-gray-700">{flag.description}</p>
                  {flag.evidence.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {flag.evidence.map((e, j) => (
                        <li key={j} className="text-xs text-gray-600 pl-3 border-l-2 border-gray-300">
                          {e}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(flag.detected_at).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
          <p className="font-medium text-gray-600">No active red flags</p>
          <p className="text-sm">All risk indicators are within acceptable thresholds</p>
        </div>
      )}
    </div>
  );
}
