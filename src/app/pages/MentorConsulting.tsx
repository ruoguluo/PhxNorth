import { useState, useEffect } from 'react';
import { consultingAPI, type ConsultingProject, type ProjectApplication } from '../../lib/api';
import {
  Briefcase,
  DollarSign,
  Clock,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle,
  XCircle,
  Loader2,
  Tag,
} from 'lucide-react';

export function MentorConsulting() {
  const [activeTab, setActiveTab] = useState<'projects' | 'applications'>('projects');
  const [projects, setProjects] = useState<ConsultingProject[]>([]);
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [proposal, setProposal] = useState('');
  const [proposedRate, setProposedRate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [p, a] = await Promise.allSettled([
          consultingAPI.listProjects({ status: 'open' }),
          consultingAPI.myApplications(),
        ]);
        if (p.status === 'fulfilled') setProjects(p.value);
        if (a.status === 'fulfilled') setApplications(a.value);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleApply = async (projectId: number) => {
    setSubmitting(true);
    try {
      const app = await consultingAPI.apply(projectId, {
        proposal: proposal || undefined,
        proposed_rate: proposedRate ? parseFloat(proposedRate) : undefined,
      });
      setApplications(prev => [app, ...prev]);
      setExpandedProject(null);
      setProposal('');
      setProposedRate('');
    } catch (err: any) {
      alert(err.message || 'Failed to apply');
    } finally {
      setSubmitting(false);
    }
  };

  const appliedProjectIds = new Set(applications.map(a => a.project_id));

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status] ?? 'bg-gray-100 text-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enterprise Consulting</h1>
        <p className="text-gray-600">Browse available projects and manage your applications</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors ${
            activeTab === 'projects' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Available Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors ${
            activeTab === 'applications' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Applications ({applications.length})
        </button>
      </div>

      {/* Available Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No open projects right now</p>
              <p className="text-sm mt-1">Check back later for new consulting opportunities</p>
            </div>
          ) : (
            projects.map(project => (
              <div key={project.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-200 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                    {project.client_name && (
                      <p className="text-sm text-gray-500 mt-0.5">{project.client_name}</p>
                    )}
                  </div>
                  {project.industry && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                      {project.industry}
                    </span>
                  )}
                </div>

                {project.description && (
                  <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                )}

                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                  {(project.budget_min || project.budget_max) && (
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span>
                        {project.budget_min && project.budget_max
                          ? `$${project.budget_min.toLocaleString()} – $${project.budget_max.toLocaleString()}`
                          : project.budget_max ? `Up to $${project.budget_max.toLocaleString()}` : `From $${project.budget_min?.toLocaleString()}`}
                      </span>
                    </div>
                  )}
                  {project.duration_weeks && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>{project.duration_weeks} weeks</span>
                    </div>
                  )}
                </div>

                {project.required_skills && project.required_skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.required_skills.map(skill => (
                      <span key={skill} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                        <Tag className="w-3 h-3" />
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {appliedProjectIds.has(project.id) ? (
                  <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Application submitted
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                      className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Apply to this project
                      {expandedProject === project.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {expandedProject === project.id && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Submit Your Proposal</h4>
                        <textarea
                          value={proposal}
                          onChange={e => setProposal(e.target.value)}
                          placeholder="Describe your relevant experience and approach..."
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none mb-3"
                        />
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex-1">
                            <label className="text-xs font-medium text-gray-700 mb-1 block">Proposed Rate ($/hr)</label>
                            <input
                              type="number"
                              value={proposedRate}
                              onChange={e => setProposedRate(e.target.value)}
                              placeholder="150"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => handleApply(project.id)}
                          disabled={submitting}
                          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                        >
                          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          Submit Application
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* My Applications */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Send className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No applications yet</p>
              <p className="text-sm mt-1">Browse available projects and submit your first proposal</p>
            </div>
          ) : (
            applications.map(app => (
              <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Project #{app.project_id}</h3>
                  {statusBadge(app.status)}
                </div>
                {app.proposal && <p className="text-sm text-gray-600 mb-2">{app.proposal}</p>}
                {app.proposed_rate && (
                  <p className="text-sm text-gray-500">Proposed rate: <span className="font-semibold">${app.proposed_rate}/hr</span></p>
                )}
                <p className="text-xs text-gray-400 mt-2">Applied {app.created_at ? new Date(app.created_at).toLocaleDateString() : ''}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
