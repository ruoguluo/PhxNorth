import { useState, useEffect } from "react";
import {
  Shield,
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Flag,
  Activity,
  TrendingUp,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import {
  discRiskAPI,
  type RiskAssessment,
  type ContradictionResponse,
  type BehavioralShiftResponse,
} from "../../lib/disc-api";

// ─── Severity Helpers ───────────────────────────────────────────────

const severityColorMap: Record<string, { bg: string; text: string; border: string; bar: string }> = {
  low:      { bg: "bg-emerald-50",  text: "text-emerald-800", border: "border-emerald-200", bar: "bg-emerald-500" },
  medium:   { bg: "bg-yellow-100",  text: "text-yellow-800",  border: "border-yellow-200",  bar: "bg-yellow-500" },
  high:     { bg: "bg-orange-100",  text: "text-orange-800",  border: "border-orange-200",  bar: "bg-orange-500" },
  critical: { bg: "bg-red-100",     text: "text-red-800",     border: "border-red-200",     bar: "bg-red-500" },
};

const overallRiskDisplay: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  low:      { label: "GREEN",  icon: <CheckCircle className="w-8 h-8" />, color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  medium:   { label: "YELLOW", icon: <AlertCircle className="w-8 h-8" />, color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  high:     { label: "ORANGE", icon: <AlertTriangle className="w-8 h-8" />, color: "bg-orange-100 text-orange-800 border-orange-300" },
  critical: { label: "RED",    icon: <ShieldAlert className="w-8 h-8" />, color: "bg-red-100 text-red-800 border-red-300" },
};

function formatCategory(raw: string): string {
  return raw.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function SeverityBadge({ severity }: { severity: string }) {
  const c = severityColorMap[severity] ?? severityColorMap.low;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

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

  const tier = risk?.overall_risk_tier ?? risk?.overall_risk ?? "low";
  const display = overallRiskDisplay[tier] ?? overallRiskDisplay.low;
  const assessments = risk?.assessments ?? [];
  const activeFlags = risk?.active_flags ?? risk?.flags ?? [];

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
        {/* ── Section 1: Risk Overview Header ── */}
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
              <span>Assessed: {risk?.computed_at ? new Date(risk.computed_at).toLocaleString() : "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>{assessments.length} categories assessed</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Flag className="w-4 h-4 text-red-500" />
              <span className="font-semibold text-gray-900">{activeFlags.length}</span>
              <span className="text-gray-600">active flags</span>
            </div>
          </div>
        </div>

        {/* ── Section 2: Risk Category Cards ── */}
        {assessments.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Risk Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assessments.map((item, i) => {
                const sev = item.severity as string;
                const colors = severityColorMap[sev] ?? severityColorMap.low;
                const isHigh = sev === "high" || sev === "critical";
                return (
                  <div key={i} className={`bg-white rounded-xl border ${isHigh ? colors.border : "border-gray-200"} p-5`}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-sm">{formatCategory(item.category)}</h3>
                      <SeverityBadge severity={sev} />
                    </div>
                    {isHigh && (
                      <div className="flex items-center gap-1.5 mb-3">
                        <Flag className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-xs font-semibold text-red-600">Flagged</span>
                      </div>
                    )}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Score</span>
                        <span className="font-semibold">{(item.score * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all ${colors.bar}`}
                          style={{ width: `${Math.min(item.score * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Section 3: Contradiction Analysis ── */}
        {contradictions && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-50 p-2.5 rounded-lg">
                <AlertCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Contradiction Analysis</h2>
                <p className="text-sm text-gray-500">
                  Score: {(contradictions.contradiction_score * 100).toFixed(0)}% | Tier: {contradictions.severity_tier}
                </p>
              </div>
              <div className="ml-auto">
                <SeverityBadge severity={contradictions.severity_tier === "none" ? "low" : contradictions.severity_tier} />
              </div>
            </div>

            {/* Contradiction score bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Contradiction Score</span>
                <span className="font-semibold">{(contradictions.contradiction_score * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    contradictions.contradiction_score > 0.5 ? "bg-red-500" :
                    contradictions.contradiction_score > 0.3 ? "bg-orange-500" :
                    contradictions.contradiction_score > 0.15 ? "bg-yellow-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(contradictions.contradiction_score * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Dimension gaps */}
            {contradictions.dimension_gaps.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">Dimension Gaps</h3>
                {contradictions.dimension_gaps.map((gap, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <span className="font-mono font-bold text-gray-900">{gap.dimension_a}</span>
                      <span className="text-gray-400">vs</span>
                      <span className="font-mono font-bold text-gray-900">{gap.dimension_b}</span>
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${gap.gap > 0.35 ? "bg-red-500" : gap.gap > 0.15 ? "bg-yellow-500" : "bg-emerald-500"}`}
                          style={{ width: `${Math.min(gap.gap * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 min-w-[45px] text-right">
                      {(gap.gap * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                <CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
                <p className="font-medium text-gray-600">No contradictions detected</p>
                <p className="text-sm">Data appears internally consistent</p>
              </div>
            )}

            {/* Flagged dimensions */}
            {contradictions.flagged_dimensions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Flagged Dimensions</h3>
                <div className="flex gap-2">
                  {contradictions.flagged_dimensions.map((dim) => (
                    <span key={dim} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-semibold">
                      {dim}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Section 4: Behavioral Shift ── */}
        {shifts && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 p-2.5 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Behavioral Shift Analysis</h2>
                <p className="text-sm text-gray-500">
                  {shifts.shift_type ? `Type: ${shifts.shift_type}` : "Monitoring for behavioral changes"}
                </p>
              </div>
              <div className="ml-auto">
                {shifts.shift_detected ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                    <Activity className="w-3.5 h-3.5" />
                    Shift Detected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Stable
                  </span>
                )}
              </div>
            </div>

            {shifts.shift_detected ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{(shifts.magnitude * 100).toFixed(0)}%</div>
                    <div className="text-xs text-gray-500">Magnitude</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{shifts.shift_type ?? "—"}</div>
                    <div className="text-xs text-gray-500">Shift Type</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{shifts.shifted_dimensions.length}</div>
                    <div className="text-xs text-gray-500">Dimensions Shifted</div>
                  </div>
                </div>
                {shifts.interpretation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">{shifts.interpretation}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                <CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
                <p className="font-medium text-gray-600">No behavioral shifts detected</p>
                <p className="text-sm">{shifts.interpretation ?? "Profile remains stable within normal thresholds"}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Section 5: Active Flags ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-50 p-2.5 rounded-lg">
              <Flag className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Active Flags</h2>
              <p className="text-sm text-gray-500">{activeFlags.length} active flag{activeFlags.length !== 1 ? "s" : ""}</p>
            </div>
          </div>

          {activeFlags.length > 0 ? (
            <div className="space-y-3">
              {activeFlags.map((flag, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-orange-200 bg-orange-50">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-orange-800">{formatCategory(flag.category)}</h4>
                    </div>
                    <p className="text-sm text-gray-700">{flag.message}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      Raised: {new Date(flag.raised_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
              <p className="font-medium text-gray-600">No active flags</p>
              <p className="text-sm">All risk indicators are within acceptable thresholds</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
