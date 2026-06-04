import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { 
  ArrowLeft,
  TrendingUp, 
  Target,
  Users,
  Lightbulb,
  Calendar,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Activity,
  MessageSquare,
  FileText,
  Award,
  BarChart3,
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import {
  discProfileAPI,
  discCareerAPI,
  discRiskAPI,
  type DISCProfile,
  type CareerProfile,
  type PreferencesResponse,
  type RiskAssessment,
  type ContradictionResponse,
} from '../../lib/disc-api';
import { DISCScoreBar } from '../components/disc/DISCScoreBar';
import { DISCRadarChart } from '../components/disc/DISCRadarChart';

// ─── Helpers ────────────────────────────────────────────────────────

function getClarityColor(clarity: string) {
  if (clarity === 'High') return 'text-emerald-700 bg-emerald-100';
  if (clarity === 'Medium') return 'text-blue-700 bg-blue-100';
  return 'text-amber-700 bg-amber-100';
}

function getClarityLabel(score: number): string {
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Emerging';
}

function getSpiLevel(score: number): string {
  if (score >= 80) return 'High';
  if (score >= 60) return 'Medium';
  if (score >= 40) return 'Developing';
  return 'Low';
}

function getMatchingReadiness(confidence: number, hasCareer: boolean) {
  const mentorshipReady = confidence >= 0.6;
  const enterpriseReady = confidence >= 0.7 && hasCareer;
  return {
    mentorship: {
      level: mentorshipReady ? 'HIGH' : confidence >= 0.4 ? 'DEVELOPING' : 'LOW',
      color: mentorshipReady ? 'emerald' : 'amber',
      items: [
        { label: 'Profile completeness', ok: confidence >= 0.5 },
        { label: 'Topic clarity', ok: confidence >= 0.6 },
        { label: 'Engagement history', ok: confidence >= 0.7 },
      ],
    },
    enterprise: {
      level: enterpriseReady ? 'HIGH' : hasCareer ? 'DEVELOPING' : 'LOW',
      color: enterpriseReady ? 'emerald' : 'amber',
      items: [
        { label: 'Technical capability', ok: hasCareer },
        { label: 'Strategic decision-making', ok: confidence >= 0.7 },
        { label: 'Enterprise context', ok: enterpriseReady },
      ],
    },
  };
}

// ─── Types ──────────────────────────────────────────────────────────

interface AllData {
  disc: DISCProfile | null;
  career: CareerProfile | null;
  preferences: PreferencesResponse | null;
  risk: RiskAssessment | null;
  contradiction: ContradictionResponse | null;
}

// ─── Component ──────────────────────────────────────────────────────

export function FiveDSnapshot() {
  const { user } = useAuth();
  const userRole = (user?.role as 'mentee' | 'mentor') || 'mentee';
  const [data, setData] = useState<AllData>({
    disc: null, career: null, preferences: null, risk: null, contradiction: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const results: AllData = {
        disc: null, career: null, preferences: null, risk: null, contradiction: null,
      };
      try {
        const [disc, career, preferences, risk, contradiction] = await Promise.allSettled([
          discProfileAPI.get("me", "90d"),
          discCareerAPI.get("me"),
          discCareerAPI.preferences("me"),
          discRiskAPI.get("me"),
          discRiskAPI.contradictions("me"),
        ]);
        if (disc.status === 'fulfilled') results.disc = disc.value;
        if (career.status === 'fulfilled') results.career = career.value;
        if (preferences.status === 'fulfilled') results.preferences = preferences.value;
        if (risk.status === 'fulfilled') results.risk = risk.value;
        if (contradiction.status === 'fulfilled') results.contradiction = contradiction.value;
      } catch {
        // Fall back to whatever we got
      }
      setData(results);
      setLoading(false);
    }
    fetchAll();
  }, []);

  // ─── Derived values ─────────────────────────────────────────────

  const { disc, career, preferences, risk, contradiction } = data;

  const confidence = disc ? Math.round(disc.confidence * 100) : 0;
  const dataSources = disc?.data_sources ?? 0;
  const hasCareer = (career?.entries?.length ?? 0) > 0 || (career?.analytics?.distinct_companies ?? 0) > 0;

  // 5D radar: map DISC scores to 5 dimensions, or use defaults
  const radarData = disc
    ? [
        { dimension: 'Capability\nDepth', value: Math.round(disc.scores.C), clarity: getClarityLabel(disc.scores.C), confidence },
        { dimension: 'Execution\nPattern', value: Math.round(disc.scores.D), clarity: getClarityLabel(disc.scores.D), confidence },
        { dimension: 'Decision\nOrientation', value: Math.round((disc.scores.D + disc.scores.C) / 2), clarity: getClarityLabel((disc.scores.D + disc.scores.C) / 2), confidence },
        { dimension: 'Collaboration\nStyle', value: Math.round((disc.scores.I + disc.scores.S) / 2), clarity: getClarityLabel((disc.scores.I + disc.scores.S) / 2), confidence },
        { dimension: 'Growth\nTrajectory', value: Math.round((disc.scores.D + disc.scores.I) / 2), clarity: getClarityLabel((disc.scores.D + disc.scores.I) / 2), confidence },
      ]
    : [
        { dimension: 'Capability\nDepth', value: 0, clarity: 'Emerging', confidence: 0 },
        { dimension: 'Execution\nPattern', value: 0, clarity: 'Emerging', confidence: 0 },
        { dimension: 'Decision\nOrientation', value: 0, clarity: 'Emerging', confidence: 0 },
        { dimension: 'Collaboration\nStyle', value: 0, clarity: 'Emerging', confidence: 0 },
        { dimension: 'Growth\nTrajectory', value: 0, clarity: 'Emerging', confidence: 0 },
      ];

  // SPI: composite from DISC confidence + career data + risk
  const spiScore = disc
    ? Math.round(
        confidence * 0.4 +
        (hasCareer ? 30 : 0) +
        ((risk?.overall_risk === 'low' ? 20 : risk?.overall_risk === 'medium' ? 10 : 0)) +
        (dataSources > 20 ? 10 : dataSources > 5 ? 5 : 0)
      )
    : 0;
  const spiLevel = getSpiLevel(spiScore);

  // Career-derived growth insights
  const analytics = career?.analytics;
  const totalRoles = analytics?.distinct_roles ?? 0;
  const avgTenure = analytics?.avg_tenure_months ?? 0;
  const totalCompanies = analytics?.distinct_companies ?? 0;

  // Data gaps: dimensions where we lack confidence
  const dataGaps: { title: string; description: string }[] = [];
  if (!disc || confidence < 60) {
    dataGaps.push({ title: 'Behavioral profile depth', description: 'More platform interactions needed for higher confidence scoring' });
  }
  if (!hasCareer) {
    dataGaps.push({ title: 'Career history', description: 'Upload your CV to enable career pattern analysis and growth logic' });
  }
  if ((contradiction?.contradictions?.length ?? 0) === 0 && disc) {
    dataGaps.push({ title: 'Cross-source validation', description: 'Add more data sources to enable contradiction analysis between CV and platform behavior' });
  }
  if (dataGaps.length === 0) {
    dataGaps.push({ title: 'Strategic consistency', description: 'Continue engaging to build long-term pattern data' });
  }

  // Matching readiness
  const matching = getMatchingReadiness(disc?.confidence ?? 0, hasCareer);

  // ─── Render ─────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2463] mx-auto mb-4" />
          <p className="text-gray-600">Loading behavioral intelligence data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-8">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <a 
          href={userRole === 'mentee' ? '/app/dashboard' : '/app/mentor/dashboard'}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Back to Dashboard</span>
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">5D Behavioral Intelligence Engine</h1>
          <p className="text-lg text-gray-600 mb-4">
            Dynamic behavioral insight system for precision matching and strategic intelligence
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Activity className="w-4 h-4" />
            <span>Last updated based on {dataSources || 0} data sources</span>
            <span className="mx-2">•</span>
            <span className={`font-medium ${confidence >= 80 ? 'text-emerald-600' : confidence >= 60 ? 'text-blue-600' : 'text-amber-600'}`}>
              Data confidence: {confidence >= 80 ? 'High' : confidence >= 60 ? 'Medium' : confidence > 0 ? 'Low' : 'No data'} ({confidence}%)
            </span>
          </div>
        </div>

        {/* SECTION 1: 5D Radar Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">5D Star Radar</h2>
            <p className="text-gray-600">Multidimensional behavioral visibility mapping — not a personality test</p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis 
                    dataKey="dimension" 
                    tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 600 }}
                    style={{ whiteSpace: 'pre-line' }}
                  />
                  <Radar 
                    name="5D Profile" 
                    dataKey="value" 
                    stroke="#0A2463" 
                    fill="#0A2463" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {radarData.map((item, index) => (
                <div key={index} className="border-l-4 border-[#0A2463] pl-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.dimension.replace('\n', ' ')}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getClarityColor(item.clarity)}`}>
                        {item.clarity}
                      </span>
                      <span className="text-xs text-gray-500">
                        {item.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-[#0A2463] h-2 rounded-full transition-all"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {item.clarity === 'High' && 'Strong signal clarity based on consistent interaction patterns and data volume'}
                    {item.clarity === 'Medium' && 'Moderate signal clarity with sufficient data, room for deeper visibility'}
                    {item.clarity === 'Emerging' && 'Initial signals detected, requires more interaction data for higher confidence'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION: DISC Profile Scores */}
        {disc && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">DISC Behavioral Profile</h2>
                  <p className="text-gray-600">
                    Behavioral style scores from platform interaction analysis
                    <span className="ml-2 text-sm text-gray-500">({confidence}% confidence)</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {disc.primary_type && (
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-slate-800 text-white">
                      {disc.primary_type} dominant
                    </span>
                  )}
                  {disc.secondary_type && (
                    <span className="text-xs px-2 py-1 rounded-full font-medium border border-slate-300 text-slate-600">
                      {disc.secondary_type} secondary
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-center justify-center">
                <DISCRadarChart
                  scores={{ d: disc.scores.D, i: disc.scores.I, s: disc.scores.S, c: disc.scores.C }}
                  confidence={disc.confidence}
                  className="max-w-sm"
                />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                {(["D", "I", "S", "C"] as const).map((dim) => (
                  <DISCScoreBar
                    key={dim}
                    dimension={dim}
                    score={disc.scores[dim]}
                    isDominant={disc.primary_type === dim}
                    isSecondary={disc.secondary_type === dim}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: Growth Logic Analysis */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Growth Logic Analysis</h2>
            <p className="text-gray-600">Career pattern recognition and behavioral evolution signals</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className={`border-l-4 ${totalRoles > 2 ? 'border-emerald-500' : 'border-amber-500'} pl-4`}>
                <h3 className="font-semibold text-gray-900 mb-2">Responsibility Expansion Trend</h3>
                <p className="text-sm text-gray-700 mb-2">
                  {totalRoles > 2 ? (
                    <><span className="font-medium text-emerald-700">Consistent upward trajectory detected:</span> Responsibility scope increasing across {totalRoles} roles with evidence of progressive ownership expansion.</>
                  ) : totalRoles > 0 ? (
                    <><span className="font-medium text-blue-700">Early career pattern:</span> {totalRoles} role(s) detected. More data needed for trajectory analysis.</>
                  ) : (
                    <><span className="font-medium text-amber-700">No career data:</span> Upload your CV to enable career pattern analysis.</>
                  )}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {totalRoles > 0 ? (
                    <><CheckCircle className="w-3 h-3 text-emerald-600" /><span>Based on {totalRoles} roles across {totalCompanies} companies</span></>
                  ) : (
                    <><AlertCircle className="w-3 h-3 text-amber-600" /><span>Upload CV for analysis</span></>
                  )}
                </div>
              </div>

              <div className={`border-l-4 ${avgTenure > 24 ? 'border-blue-500' : avgTenure > 0 ? 'border-amber-500' : 'border-gray-300'} pl-4`}>
                <h3 className="font-semibold text-gray-900 mb-2">Role Transition Logic</h3>
                <p className="text-sm text-gray-700 mb-2">
                  {avgTenure > 24 ? (
                    <><span className="font-medium text-blue-700">Stable transition pattern:</span> Average tenure of {avgTenure.toFixed(0)} months suggests deliberate career moves with clear capability building.</>
                  ) : avgTenure > 0 ? (
                    <><span className="font-medium text-amber-700">Dynamic transition pattern:</span> Average tenure of {avgTenure.toFixed(0)} months indicates frequent role changes.</>
                  ) : (
                    <><span className="font-medium text-gray-500">Awaiting data:</span> Career transition analysis requires CV upload.</>
                  )}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {avgTenure > 0 ? (
                    <><CheckCircle className="w-3 h-3 text-blue-600" /><span>Avg tenure: {avgTenure.toFixed(0)} months</span></>
                  ) : (
                    <><AlertCircle className="w-3 h-3 text-gray-400" /><span>No data yet</span></>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className={`border-l-4 ${disc ? 'border-purple-500' : 'border-gray-300'} pl-4`}>
                <h3 className="font-semibold text-gray-900 mb-2">Behavioral Consistency</h3>
                <p className="text-sm text-gray-700 mb-2">
                  {contradiction && contradiction.contradiction_score !== undefined ? (
                    contradiction.contradiction_score < 0.3 ? (
                      <><span className="font-medium text-emerald-700">High consistency:</span> CV claims and platform behavior are well aligned (contradiction score: {(contradiction.contradiction_score * 100).toFixed(0)}%).</>
                    ) : (
                      <><span className="font-medium text-amber-700">Some divergence detected:</span> Differences between stated and observed behavior (contradiction score: {(contradiction.contradiction_score * 100).toFixed(0)}%).</>
                    )
                  ) : (
                    <><span className="font-medium text-gray-500">Insufficient data:</span> Need both CV and platform behavior data for consistency analysis.</>
                  )}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {contradiction ? (
                    <><CheckCircle className="w-3 h-3 text-purple-600" /><span>Severity: {contradiction.severity_tier}</span></>
                  ) : (
                    <><AlertCircle className="w-3 h-3 text-gray-400" /><span>Awaiting cross-source data</span></>
                  )}
                </div>
              </div>

              <div className={`border-l-4 ${disc ? 'border-indigo-500' : 'border-gray-300'} pl-4`}>
                <h3 className="font-semibold text-gray-900 mb-2">Decision-Making Style</h3>
                <p className="text-sm text-gray-700 mb-2">
                  {disc ? (
                    disc.scores.D > disc.scores.S ? (
                      <><span className="font-medium text-indigo-700">Action-oriented:</span> Higher Dominance ({disc.scores.D.toFixed(0)}) vs Steadiness ({disc.scores.S.toFixed(0)}) suggests decisive, results-driven decision-making.</>
                    ) : (
                      <><span className="font-medium text-indigo-700">Deliberate approach:</span> Higher Steadiness ({disc.scores.S.toFixed(0)}) vs Dominance ({disc.scores.D.toFixed(0)}) suggests methodical, consensus-seeking decisions.</>
                    )
                  ) : (
                    <><span className="font-medium text-gray-500">Awaiting data:</span> Platform interactions needed for decision-making analysis.</>
                  )}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {disc ? (
                    <><CheckCircle className="w-3 h-3 text-indigo-600" /><span>Based on DISC behavioral analysis</span></>
                  ) : (
                    <><AlertCircle className="w-3 h-3 text-gray-400" /><span>No behavioral data yet</span></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Engagement Intelligence */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Engagement Intelligence</h2>
            <p className="text-gray-600">Platform activity analysis and behavioral signal extraction</p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* DISC Behavioral Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Behavioral Signals</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Data sources</span>
                  <span className="text-lg font-bold text-gray-900">{dataSources}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Confidence</span>
                  <span className="text-lg font-bold text-gray-900">{confidence}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Dominant trait</span>
                  <span className="text-lg font-bold text-gray-900">{disc?.primary_type ?? '—'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Window</span>
                  <span className="text-lg font-bold text-gray-900">{disc?.window ?? '—'}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs font-semibold text-blue-900 mb-1">Analysis:</p>
                <div className="space-y-1">
                  {confidence >= 70 ? (
                    <><div className="flex items-center gap-1 text-xs text-gray-700"><CheckCircle className="w-3 h-3 text-emerald-600" /><span>High signal quality</span></div>
                    <div className="flex items-center gap-1 text-xs text-gray-700"><CheckCircle className="w-3 h-3 text-emerald-600" /><span>Sufficient data for scoring</span></div></>
                  ) : (
                    <><div className="flex items-center gap-1 text-xs text-gray-700"><AlertCircle className="w-3 h-3 text-amber-600" /><span>More interactions will improve accuracy</span></div></>
                  )}
                </div>
              </div>
            </div>

            {/* Career Intelligence */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Career Intelligence</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Total roles</span>
                  <span className="text-lg font-bold text-gray-900">{totalRoles}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Companies</span>
                  <span className="text-lg font-bold text-gray-900">{totalCompanies}</span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">Avg tenure</span>
                    <span className="text-sm font-bold text-gray-900">{avgTenure > 0 ? `${avgTenure.toFixed(0)} mo` : '—'}</span>
                  </div>
                  {avgTenure > 0 && (
                    <div className="w-full bg-purple-200 rounded-full h-1.5">
                      <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${Math.min((avgTenure / 60) * 100, 100)}%` }} />
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Total experience</span>
                  <span className="text-lg font-bold text-gray-900">
                    {(analytics?.total_experience_months ?? 0) > 0
                      ? `${((analytics?.total_experience_months ?? 0) / 12).toFixed(1)} yr`
                      : '—'}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-purple-200">
                <p className="text-xs font-semibold text-purple-900 mb-1">Analysis:</p>
                <div className="space-y-1">
                  {hasCareer ? (
                    <><div className="flex items-center gap-1 text-xs text-gray-700"><CheckCircle className="w-3 h-3 text-emerald-600" /><span>Career data available</span></div>
                    <div className="flex items-center gap-1 text-xs text-gray-700"><CheckCircle className="w-3 h-3 text-emerald-600" /><span>Pattern analysis enabled</span></div></>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-gray-700"><AlertCircle className="w-3 h-3 text-amber-600" /><span>Upload CV to enable career analysis</span></div>
                  )}
                </div>
              </div>
            </div>

            {/* Risk & Consistency */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-600 rounded-lg">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Risk & Consistency</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Overall risk</span>
                  <span className={`text-lg font-bold ${risk?.overall_risk === 'low' ? 'text-emerald-700' : risk?.overall_risk === 'high' ? 'text-red-700' : 'text-amber-700'}`}>
                    {risk?.overall_risk?.toUpperCase() ?? '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Contradiction</span>
                  <span className="text-lg font-bold text-gray-900">
                    {contradiction ? `${(contradiction.contradiction_score * 100).toFixed(0)}%` : '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Active flags</span>
                  <span className="text-lg font-bold text-gray-900">{risk?.flags?.length ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Consistency</span>
                  <span className="text-lg font-bold text-gray-900">
                    {preferences?.indexes
                      ? (Array.isArray(preferences.indexes)
                          ? (preferences.indexes as { dimension: string; score: number }[]).find((p) => p.dimension === 'consistency_score')?.score
                          : (preferences.indexes as Record<string, { value: number }>).consistency_score?.value
                        )?.toFixed?.(2) ?? '—'
                      : '—'}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-amber-200">
                <p className="text-xs font-semibold text-amber-900 mb-1">Analysis:</p>
                <div className="space-y-1">
                  {risk?.overall_risk === 'low' ? (
                    <div className="flex items-center gap-1 text-xs text-gray-700"><CheckCircle className="w-3 h-3 text-emerald-600" /><span>No significant risk signals</span></div>
                  ) : risk ? (
                    <div className="flex items-center gap-1 text-xs text-gray-700"><AlertCircle className="w-3 h-3 text-amber-600" /><span>Some risk factors detected</span></div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-gray-700"><AlertCircle className="w-3 h-3 text-gray-400" /><span>Insufficient data for risk assessment</span></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Structured Participation Index (SPI) */}
        <div className="bg-gradient-to-br from-[#0A2463] to-[#1e40af] rounded-xl p-8 mb-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Structured Participation Index (SPI)</h2>
              <p className="text-blue-200">Composite behavioral engagement score</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center min-w-[180px]">
              <div className="text-5xl font-bold mb-1">{spiScore}</div>
              <div className="text-xl font-semibold text-blue-100">{spiLevel}</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">{confidence}%</div>
              <div className="text-sm text-blue-200">DISC Confidence</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">{hasCareer ? 'Yes' : 'No'}</div>
              <div className="text-sm text-blue-200">Career Data</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">{dataSources}</div>
              <div className="text-sm text-blue-200">Data Sources</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">{risk?.overall_risk?.toUpperCase() ?? '—'}</div>
              <div className="text-sm text-blue-200">Risk Level</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-6 h-6 text-blue-200 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">What This Means</h3>
                <p className="text-blue-100 leading-relaxed">
                  {spiScore >= 80
                    ? `Your ${spiLevel.toLowerCase()} SPI indicates strong engagement patterns that enable precise mentorship matching and enterprise project alignment. Maintaining structured participation improves commercial matching intelligence.`
                    : spiScore >= 50
                    ? `Your ${spiLevel.toLowerCase()} SPI shows developing engagement patterns. Increasing platform interaction and uploading career data will improve matching accuracy.`
                    : `Your SPI is still building. Upload your CV, engage in mentorship sessions, and complete behavioral assessments to increase your visibility score.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: Data Gaps & Visibility Opportunities */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Gaps & Visibility Opportunities</h2>
            <p className="text-gray-700 font-medium">We currently have limited visibility on:</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {dataGaps.map((gap, i) => (
              <div key={i} className="bg-white rounded-lg p-4 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-gray-900">{gap.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{gap.description}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-amber-300 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Increase your visibility by:</h3>
            <div className="grid grid-cols-2 gap-3">
              {!hasCareer && (
                <a href="/app/cv-upload" className="flex items-center justify-between bg-white hover:bg-amber-50 border-2 border-amber-300 rounded-lg p-4 transition-all group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-amber-600" />
                    <span className="font-medium text-gray-900">Upload your CV</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
                </a>
              )}
              <a href="/app/mentor/requests" className="flex items-center justify-between bg-white hover:bg-amber-50 border-2 border-amber-300 rounded-lg p-4 transition-all group">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-gray-900">Participate in structured mentorship</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
              </a>
              <a href="/app/projects" className="flex items-center justify-between bg-white hover:bg-amber-50 border-2 border-amber-300 rounded-lg p-4 transition-all group">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-gray-900">Join enterprise project</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
              </a>
              <a href="/app/preferences" className="flex items-center justify-between bg-white hover:bg-amber-50 border-2 border-amber-300 rounded-lg p-4 transition-all group">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-gray-900">View your preference indexes</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* SECTION 6: Matching Readiness */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Matching Readiness</h2>
            <p className="text-gray-600">Your current readiness for platform matching opportunities</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Mentorship Matching */}
            <div className={`border-2 ${matching.mentorship.color === 'emerald' ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'} rounded-xl p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Mentorship Matching</h3>
                <span className={`text-xs px-3 py-1 ${matching.mentorship.color === 'emerald' ? 'bg-emerald-600' : 'bg-amber-600'} text-white rounded-full font-medium`}>
                  {matching.mentorship.level}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                {matching.mentorship.level === 'HIGH'
                  ? 'Strong profile clarity and engagement patterns enable precise mentor-mentee matching'
                  : 'Increase engagement and profile data to improve matching accuracy'}
              </p>
              <div className="space-y-2">
                {matching.mentorship.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {item.ok
                      ? <CheckCircle className="w-4 h-4 text-emerald-600" />
                      : <AlertCircle className="w-4 h-4 text-amber-600" />}
                    <span className="text-gray-700">{item.label}: {item.ok ? 'Good' : 'Developing'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise Project Matching */}
            <div className={`border-2 ${matching.enterprise.color === 'emerald' ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'} rounded-xl p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Enterprise Project Matching</h3>
                <span className={`text-xs px-3 py-1 ${matching.enterprise.color === 'emerald' ? 'bg-emerald-600' : 'bg-amber-600'} text-white rounded-full font-medium`}>
                  {matching.enterprise.level}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                {matching.enterprise.level === 'HIGH'
                  ? 'Strong career data and behavioral signals enable enterprise project alignment'
                  : 'Upload career data and increase engagement for enterprise matching'}
              </p>
              <div className="space-y-2">
                {matching.enterprise.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {item.ok
                      ? <CheckCircle className="w-4 h-4 text-emerald-600" />
                      : <AlertCircle className="w-4 h-4 text-amber-600" />}
                    <span className="text-gray-700">{item.label}: {item.ok ? 'Good' : 'Developing'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
