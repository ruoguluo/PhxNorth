import { ArrowLeft, CheckCircle, Briefcase, Brain, Shield, TrendingUp, FileText, Users } from 'lucide-react';
import { Link } from 'react-router';

export function CommercialConsultationExplore() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link to="/#enterprises" className="flex items-center gap-2 text-[#0A2463] hover:text-[#0D47A1] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to For Enterprises</span>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Commercial Consultation Projects</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Structured consulting engagements where enterprises collaborate with experienced professionals through platform-managed advisory projects.
          </p>
        </div>

        {/* Section 1: How to Participate */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Participate</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Activate Commercial Consultation</h3>
                <p className="text-gray-600">Users enable the function in their dashboard.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Set Project Interests</h3>
                <p className="text-gray-600 mb-3">Users select focus areas including:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0A2463] mt-1">•</span>
                    <span className="text-gray-700">Industry</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0A2463] mt-1">•</span>
                    <span className="text-gray-700">Project type</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0A2463] mt-1">•</span>
                    <span className="text-gray-700">Expertise domain</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Discover Opportunities</h3>
                <p className="text-gray-600">Users receive relevant consultation project signals or can browse available opportunities.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Apply for Project</h3>
                <p className="text-gray-600 mb-3">Users submit an application including:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0A2463] mt-1">•</span>
                    <span className="text-gray-700">Self-introduction related to project needs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0A2463] mt-1">•</span>
                    <span className="text-gray-700">Relevant project experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0A2463] mt-1">•</span>
                    <span className="text-gray-700">Successful case studies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0A2463] mt-1">•</span>
                    <span className="text-gray-700">Time commitment availability</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Project Selection Process */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-7 h-7 text-[#0A2463]" />
            <h2 className="text-2xl font-bold text-gray-900">Project Selection Process</h2>
          </div>
          
          <p className="text-gray-700 mb-6">After submission:</p>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">AI Evaluation</h3>
                <p className="text-gray-600">AI evaluates the applicant's 5D compatibility with project requirements.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Manager Review</h3>
                <p className="text-gray-600">The platform project manager reviews applications.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Interview</h3>
                <p className="text-gray-600">Shortlisted consultants are invited to a one-on-one online interview.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Confirmation</h3>
                <p className="text-gray-600">Final consultants are confirmed and onboarded into the project.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Project Governance */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-7 h-7 text-[#0A2463]" />
            <h2 className="text-2xl font-bold text-gray-900">Project Governance</h2>
          </div>
          
          <p className="text-gray-700 mb-6">Once selected, projects are managed jointly by:</p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3 p-5 bg-blue-50 rounded-lg border border-blue-200">
              <Brain className="w-6 h-6 text-[#0A2463] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">AI System</h3>
                <p className="text-sm text-gray-600">Monitoring progress and tracking deliverables</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-5 bg-blue-50 rounded-lg border border-blue-200">
              <Users className="w-6 h-6 text-[#0A2463] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Platform Project Manager</h3>
                <p className="text-sm text-gray-600">Coordinating execution and communications</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-5">
            <p className="text-gray-700">
              This ensures structured delivery, milestone tracking, and professional governance throughout the engagement.
            </p>
          </div>
        </div>

        {/* Section 4: User Benefits */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-7 h-7 text-[#0A2463]" />
            <h2 className="text-2xl font-bold text-gray-900">User Benefits</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Participate in real enterprise consulting projects</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Work with structured project governance</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Increase professional exposure and credibility</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Build verified consulting track records</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Access cross-industry strategic engagements</p>
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="bg-gradient-to-br from-[#0A2463] to-[#0D47A1] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Join?</h2>
          <p className="text-blue-100 mb-4">Activate Commercial Consultation and start building your consulting portfolio.</p>
          <p className="text-blue-200 text-sm mb-6 max-w-2xl mx-auto leading-relaxed">
            Activation is managed inside your personal dashboard. Open your portal to enable Commercial Consultation and start receiving project opportunities.
          </p>
          <Link to="/login">
            <button className="px-8 py-3 bg-white text-[#0A2463] rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Go to Dashboard to Activate
            </button>
          </Link>
          <p className="text-blue-200 text-xs mt-4">
            Enable Commercial Consultation in your dashboard to start receiving enterprise consulting opportunities.
          </p>
        </div>

        {/* Related Links */}
        <div className="mt-8 flex gap-4 justify-center text-sm">
          <Link to="/#enterprises" className="text-[#0A2463] hover:underline">
            Back to For Enterprises
          </Link>
          <span className="text-gray-400">•</span>
          <Link to="/global-talent-mobility" className="text-[#0A2463] hover:underline">
            View Talent Mobility Program
          </Link>
        </div>
      </div>
    </div>
  );
}