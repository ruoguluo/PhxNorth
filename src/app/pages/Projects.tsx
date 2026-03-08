import { Link } from "react-router";
import { Plus, Search, Filter, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Full-Stack Development Mastery",
    mentor: "Sarah Johnson",
    mentee: "Alex Thompson",
    objective: "Transform from junior developer to full-stack expert capable of building production-ready applications",
    theme: "Web Development",
    currentPhase: 2,
    totalPhases: 4,
    progress: 65,
    kpisMet: 5,
    kpisTotal: 8,
    status: "On Track",
    nextSession: "Today, 3:00 PM",
    complianceScore: 98,
  },
  {
    id: 2,
    title: "Data Science Career Transition",
    mentor: "Dr. Michael Chen",
    mentee: "Jessica Martinez",
    objective: "Transition from business analyst to data scientist with hands-on ML project experience",
    theme: "Data Science & ML",
    currentPhase: 1,
    totalPhases: 3,
    progress: 40,
    kpisMet: 3,
    kpisTotal: 6,
    status: "On Track",
    nextSession: "Tomorrow, 10:00 AM",
    complianceScore: 100,
  },
  {
    id: 3,
    title: "Leadership & Communication",
    mentor: "Emily Williams",
    mentee: "Ryan Chen",
    objective: "Develop executive presence and leadership skills for senior management roles",
    theme: "Leadership",
    currentPhase: 3,
    totalPhases: 3,
    progress: 85,
    kpisMet: 9,
    kpisTotal: 10,
    status: "Ahead",
    nextSession: "Friday, 2:00 PM",
    complianceScore: 97,
  },
];

export function Projects() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mentorship Projects</h1>
          <p className="text-gray-600 mt-1">Structured, goal-oriented mentorship programs</p>
        </div>
        <button className="bg-[#0A2463] text-white px-6 py-3 rounded-lg hover:bg-[#0A2463]/90 transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2463]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active Projects</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">3</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">In Progress</span>
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">2</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Completed</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">1</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Avg Compliance</span>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">98%</div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: typeof projects[0] }) {
  const statusColors: Record<string, string> = {
    "On Track": "bg-green-50 text-green-700",
    "Ahead": "bg-blue-50 text-blue-700",
    "Behind": "bg-orange-50 text-orange-700",
    "At Risk": "bg-red-50 text-red-700",
  };

  return (
    <Link to={`/app/projects/${project.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
              <span className={`text-xs px-3 py-1 rounded-full ${statusColors[project.status]}`}>
                {project.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{project.objective}</p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Mentor:</span>
                <span className="text-gray-900 font-medium">{project.mentor}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Mentee:</span>
                <span className="text-gray-900 font-medium">{project.mentee}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Theme:</span>
                <span className="text-gray-900 font-medium">{project.theme}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Compliance Score</div>
            <div className="text-2xl font-bold text-green-600">{project.complianceScore}%</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 pt-4 border-t border-gray-200">
          <div>
            <div className="text-sm text-gray-500 mb-2">Phase Progress</div>
            <div className="flex items-center gap-2">
              <div className="text-lg font-semibold text-gray-900">
                Phase {project.currentPhase} of {project.totalPhases}
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-2">Overall Progress</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#0A2463] h-2 rounded-full" 
                  style={{ width: `${project.progress}%` }} 
                />
              </div>
              <span className="text-sm font-semibold text-gray-900">{project.progress}%</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-2">KPIs Achieved</div>
            <div className="text-lg font-semibold text-gray-900">
              {project.kpisMet} / {project.kpisTotal}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-2">Next Session</div>
            <div className="text-sm font-semibold text-gray-900">{project.nextSession}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
