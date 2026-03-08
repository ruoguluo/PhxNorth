import { useState } from 'react';
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
  Zap,
  MessageSquare,
  FileText,
  Award,
  BarChart3,
  Clock,
  Repeat
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';

const radarData = [
  { dimension: 'Capability\nDepth', value: 85, clarity: 'High', confidence: 92 },
  { dimension: 'Execution\nPattern', value: 78, clarity: 'High', confidence: 88 },
  { dimension: 'Decision\nOrientation', value: 65, clarity: 'Medium', confidence: 71 },
  { dimension: 'Collaboration\nStyle', value: 72, clarity: 'Medium', confidence: 68 },
  { dimension: 'Growth\nTrajectory', value: 58, clarity: 'Emerging', confidence: 54 }
];

function getClarityColor(clarity: string) {
  if (clarity === 'High') return 'text-emerald-700 bg-emerald-100';
  if (clarity === 'Medium') return 'text-blue-700 bg-blue-100';
  return 'text-amber-700 bg-amber-100';
}

export function FiveDSnapshot() {
  const [userRole] = useState<'mentee' | 'mentor'>('mentee');
  const spiLevel = 'High';
  const spiScore = 87;

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
            <span>Last updated based on 247 platform interactions</span>
            <span className="mx-2">•</span>
            <span className="text-emerald-600 font-medium">Data confidence: High (92%)</span>
          </div>
        </div>

        {/* SECTION 1: 5D Radar Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">5D Star Radar</h2>
            <p className="text-gray-600">Multidimensional behavioral visibility mapping — not a personality test</p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Radar Chart */}
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

            {/* Dimension Details */}
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

        {/* SECTION 2: Growth Logic Analysis */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Growth Logic Analysis</h2>
            <p className="text-gray-600">Career pattern recognition and behavioral evolution signals</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="border-l-4 border-emerald-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Responsibility Expansion Trend</h3>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium text-emerald-700">Consistent upward trajectory detected:</span> Responsibility scope increasing across roles with evidence of progressive ownership expansion.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>Based on 4 role transitions, 12 project scopes</span>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Role Transition Logic</h3>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium text-blue-700">Adaptive transition pattern:</span> Strategic lateral moves with clear capability building progression evident.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle className="w-3 h-3 text-blue-600" />
                  <span>Cross-functional exposure validated</span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Exit Pattern Consistency</h3>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium text-amber-700">Limited visibility:</span> Insufficient data on departure reasoning and transition planning logic.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  <span>Add detailed context to improve insight</span>
                </div>
              </div>

              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Decision-Making Evolution</h3>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium text-indigo-700">Scope expansion observed:</span> Decision authority and strategic influence increasing over career progression.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle className="w-3 h-3 text-indigo-600" />
                  <span>Based on mentorship session analysis</span>
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
            {/* Mentorship Activity */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Mentorship Activity</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Instant sessions</span>
                  <span className="text-lg font-bold text-gray-900">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Structured sessions</span>
                  <span className="text-lg font-bold text-gray-900">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Unique mentors</span>
                  <span className="text-lg font-bold text-gray-900">9</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Long-term relationships</span>
                  <span className="text-lg font-bold text-gray-900">3</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs font-semibold text-blue-900 mb-1">Behavioral Analysis:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-gray-700">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>High interaction diversity</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-700">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Strong relationship depth</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-700">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Consistent mentorship continuity</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Structured Thinking Signals */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Structured Thinking</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">Agenda completion</span>
                    <span className="text-sm font-bold text-gray-900">92%</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-1.5">
                    <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">Reflection submission</span>
                    <span className="text-sm font-bold text-gray-900">85%</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-1.5">
                    <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Question refinements</span>
                  <span className="text-lg font-bold text-gray-900">3.2 avg</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-purple-200">
                <p className="text-xs font-semibold text-purple-900 mb-1">Behavioral Analysis:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-gray-700">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>High decision structuring maturity</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-700">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Strong cognitive clarity trend</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-700">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Consistent reflection practice</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project & Context Participation */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-600 rounded-lg">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Context Participation</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Enterprise projects</span>
                  <span className="text-lg font-bold text-gray-900">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Workshop participation</span>
                  <span className="text-lg font-bold text-gray-900">7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Cross-role activity</span>
                  <span className="text-lg font-bold text-gray-900">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Collaboration depth</span>
                  <span className="text-lg font-bold text-gray-900">High</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-amber-200">
                <p className="text-xs font-semibold text-amber-900 mb-1">Behavioral Analysis:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-gray-700">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Strong contextual adaptability</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-700">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>High applied learning depth</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-700">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Diverse collaboration exposure</span>
                  </div>
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
              <div className="text-3xl font-bold mb-1">92%</div>
              <div className="text-sm text-blue-200">Agenda Completion</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">85%</div>
              <div className="text-sm text-blue-200">Reflection Submission</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">89%</div>
              <div className="text-sm text-blue-200">Interaction Depth</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">81%</div>
              <div className="text-sm text-blue-200">Follow-up Consistency</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-6 h-6 text-blue-200 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">What This Means</h3>
                <p className="text-blue-100 leading-relaxed">
                  Higher structured participation increases behavioral visibility and matching accuracy. Your {spiLevel.toLowerCase()} SPI indicates strong engagement patterns that enable precise mentorship matching and enterprise project alignment. Maintaining structured participation improves commercial matching intelligence.
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
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-gray-900">Decision-making under uncertainty</h3>
              </div>
              <p className="text-sm text-gray-600">Limited signal on how you handle ambiguous situations</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-gray-900">Cross-functional collaboration</h3>
              </div>
              <p className="text-sm text-gray-600">Need more data on team dynamics and stakeholder management</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-gray-900">Strategic consistency</h3>
              </div>
              <p className="text-sm text-gray-600">Insufficient long-term pattern data for strategic assessment</p>
            </div>
          </div>

          <div className="border-t border-amber-300 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Increase your visibility by:</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-between bg-white hover:bg-amber-50 border-2 border-amber-300 rounded-lg p-4 transition-all group">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-gray-900">Participate in structured mentorship</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
              </button>
              <button className="flex items-center justify-between bg-white hover:bg-amber-50 border-2 border-amber-300 rounded-lg p-4 transition-all group">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-gray-900">Join enterprise project</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
              </button>
              <button className="flex items-center justify-between bg-white hover:bg-amber-50 border-2 border-amber-300 rounded-lg p-4 transition-all group">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-gray-900">Add detailed responsibilities</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
              </button>
              <button className="flex items-center justify-between bg-white hover:bg-amber-50 border-2 border-amber-300 rounded-lg p-4 transition-all group">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-gray-900">Increase interaction depth</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
              </button>
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
            <div className="border-2 border-emerald-200 bg-emerald-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Mentorship Matching</h3>
                <span className="text-xs px-3 py-1 bg-emerald-600 text-white rounded-full font-medium">
                  HIGH
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Strong profile clarity and engagement patterns enable precise mentor-mentee matching
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-gray-700">Profile completeness: Excellent</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-gray-700">Topic clarity: High</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-gray-700">Engagement history: Strong</span>
                </div>
              </div>
            </div>

            {/* Enterprise Project Matching */}
            <div className="border-2 border-amber-200 bg-amber-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Enterprise Project Matching</h3>
                <span className="text-xs px-3 py-1 bg-amber-600 text-white rounded-full font-medium">
                  DEVELOPING
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Initial signals detected, increase enterprise engagement to improve matching accuracy
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-gray-700">Technical capability: Evident</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-gray-700">Strategic decision-making: Limited</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-gray-700">Enterprise context: Emerging</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}