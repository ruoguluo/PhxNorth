import { Link } from "react-router";
import { ArrowLeft, Calendar, Target, FileText, Clock, CheckCircle, TrendingUp, AlertCircle, Brain, MessageSquare } from "lucide-react";

const projectData = {
  id: 1,
  title: "Full-Stack Development Mastery",
  mentor: "Sarah Johnson",
  mentee: "Alex Thompson",
  objective: "Transform from junior developer to full-stack expert capable of building production-ready applications",
  theme: "Web Development",
  startDate: "January 15, 2026",
  endDate: "July 15, 2026",
  complianceScore: 98,
  phases: [
    {
      id: 1,
      name: "Frontend Fundamentals",
      startDate: "Jan 15",
      endDate: "Feb 28",
      status: "Completed",
      progress: 100,
      kpis: [
        { id: 1, title: "Build 3 React applications", status: "Completed", aiSuggested: false },
        { id: 2, title: "Master CSS Grid & Flexbox", status: "Completed", aiSuggested: true },
        { id: 3, title: "Complete TypeScript certification", status: "Completed", aiSuggested: false },
      ],
      notes: "Excellent progress on React fundamentals. Strong understanding of component lifecycle and state management.",
    },
    {
      id: 2,
      name: "Backend Development",
      startDate: "Mar 1",
      endDate: "Apr 30",
      status: "In Progress",
      progress: 65,
      kpis: [
        { id: 4, title: "Build RESTful API with Node.js", status: "Completed", aiSuggested: false },
        { id: 5, title: "Implement authentication system", status: "In Progress", aiSuggested: true },
        { id: 6, title: "Database design & optimization", status: "Not Started", aiSuggested: false },
        { id: 7, title: "Deploy API to production", status: "Not Started", aiSuggested: true },
      ],
      notes: "Currently working on JWT authentication. Need to review security best practices in next session.",
    },
    {
      id: 3,
      name: "Full-Stack Integration",
      startDate: "May 1",
      endDate: "Jun 15",
      status: "Not Started",
      progress: 0,
      kpis: [
        { id: 8, title: "Connect frontend to backend", status: "Not Started", aiSuggested: false },
        { id: 9, title: "Implement real-time features", status: "Not Started", aiSuggested: true },
        { id: 10, title: "Add comprehensive testing", status: "Not Started", aiSuggested: false },
      ],
      notes: "",
    },
    {
      id: 4,
      name: "Portfolio & Career Prep",
      startDate: "Jun 16",
      endDate: "Jul 15",
      status: "Not Started",
      progress: 0,
      kpis: [
        { id: 11, title: "Build portfolio website", status: "Not Started", aiSuggested: false },
        { id: 12, title: "Create 3 showcase projects", status: "Not Started", aiSuggested: true },
        { id: 13, title: "Prepare for technical interviews", status: "Not Started", aiSuggested: false },
      ],
      notes: "",
    },
  ],
  sessions: [
    { id: 1, date: "Feb 24, 3:00 PM", title: "Frontend Architecture Review", transcript: true, summary: "AI Summary Available" },
    { id: 2, date: "Feb 17, 3:00 PM", title: "React State Management", transcript: true, summary: "AI Summary Available" },
    { id: 3, date: "Feb 10, 3:00 PM", title: "Component Design Patterns", transcript: true, summary: "AI Summary Available" },
  ],
};

export function ProjectDetail() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link to="/app/projects" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{projectData.title}</h1>
            <p className="text-gray-600 mb-4">{projectData.objective}</p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Mentor:</span>
                <span className="text-gray-900 font-medium">{projectData.mentor}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Mentee:</span>
                <span className="text-gray-900 font-medium">{projectData.mentee}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Duration:</span>
                <span className="text-gray-900 font-medium">{projectData.startDate} - {projectData.endDate}</span>
              </div>
            </div>
          </div>
          <div className="bg-green-50 px-6 py-4 rounded-xl">
            <div className="text-sm text-gray-600 mb-1">Compliance Score</div>
            <div className="text-3xl font-bold text-green-600">{projectData.complianceScore}%</div>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Program Timeline & Progress</h2>
        <div className="space-y-6">
          {projectData.phases.map((phase, idx) => (
            <PhaseTimeline key={phase.id} phase={phase} isLast={idx === projectData.phases.length - 1} />
          ))}
        </div>
      </div>

      {/* KPI Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">KPI Tracking</h2>
            <button className="text-sm text-[#0A2463] hover:underline flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Suggest KPIs
            </button>
          </div>
          <div className="space-y-6">
            {projectData.phases.map((phase) => (
              <div key={phase.id}>
                <h3 className="font-semibold text-gray-900 mb-3">{phase.name}</h3>
                <div className="space-y-2">
                  {phase.kpis.map((kpi) => (
                    <KPIItem key={kpi.id} kpi={kpi} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session Notes & Transcripts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Session History</h2>
          <div className="space-y-4">
            {projectData.sessions.map((session) => (
              <SessionItem key={session.id} session={session} />
            ))}
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Notes & AI Insights</h2>
        <div className="space-y-4">
          {projectData.phases.filter(p => p.notes).map((phase) => (
            <div key={phase.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900 mb-1">{phase.name}</div>
                  <p className="text-sm text-gray-700">{phase.notes}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-semibold text-blue-900 mb-1">AI Recommendation</div>
                <p className="text-sm text-blue-800">Based on current progress, consider adding a KPI for deployment automation to Phase 3. This aligns with industry best practices and will strengthen the mentee's DevOps skills.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhaseTimeline({ phase, isLast }: { phase: typeof projectData.phases[0]; isLast: boolean }) {
  const statusColors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    Completed: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700', icon: 'bg-green-500' },
    'In Progress': { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700', icon: 'bg-blue-500' },
    'Not Started': { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700', icon: 'bg-gray-300' },
  };

  const colors = statusColors[phase.status];

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full ${colors.icon} flex items-center justify-center text-white`}>
          {phase.status === 'Completed' ? (
            <CheckCircle className="w-5 h-5" />
          ) : phase.status === 'In Progress' ? (
            <Clock className="w-5 h-5" />
          ) : (
            <Target className="w-5 h-5" />
          )}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-gray-300 my-2" />}
      </div>
      <div className={`flex-1 p-4 rounded-lg border-2 ${colors.border} ${colors.bg}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{phase.name}</h3>
          <span className={`text-xs px-3 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
            {phase.status}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {phase.startDate} - {phase.endDate}
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            {phase.kpis.length} KPIs
          </div>
        </div>
        {phase.progress > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${phase.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${phase.progress}%` }} 
              />
            </div>
            <span className="text-sm font-semibold text-gray-900">{phase.progress}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

function KPIItem({ kpi }: { kpi: { id: number; title: string; status: string; aiSuggested: boolean } }) {
  const statusIcons: Record<string, { icon: React.ReactNode; color: string }> = {
    Completed: { icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-600' },
    'In Progress': { icon: <Clock className="w-5 h-5" />, color: 'text-blue-600' },
    'Not Started': { icon: <Target className="w-5 h-5" />, color: 'text-gray-400' },
  };

  const status = statusIcons[kpi.status];

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={status.color}>
          {status.icon}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">{kpi.title}</div>
          {kpi.aiSuggested && (
            <div className="flex items-center gap-1 mt-1">
              <Brain className="w-3 h-3 text-purple-600" />
              <span className="text-xs text-purple-600">AI Suggested</span>
            </div>
          )}
        </div>
      </div>
      <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-700">
        {kpi.status}
      </span>
    </div>
  );
}

function SessionItem({ session }: { session: typeof projectData.sessions[0] }) {
  return (
    <div className="p-3 border border-gray-200 rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">{session.title}</h4>
          <p className="text-xs text-gray-600 mt-1">{session.date}</p>
        </div>
        {session.transcript && (
          <FileText className="w-4 h-4 text-gray-400" />
        )}
      </div>
      {session.summary && (
        <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
          <Brain className="w-3 h-3" />
          {session.summary}
        </div>
      )}
    </div>
  );
}
