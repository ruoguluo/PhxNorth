import { ArrowLeft, CheckCircle, Users, Brain, Shield, TrendingUp, Target, Globe } from 'lucide-react';
import { Link } from 'react-router';

export function GlobalTalentMobilityExplore() {
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
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Global Talent Mobility Program</h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-4">
            A structured talent mobility infrastructure enabling individuals to participate in enterprise hiring campaigns across regions, industries, and roles.
          </p>
          <p className="text-lg text-gray-500 font-medium">
            Accessible to all registered users of the platform.
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
                <h3 className="font-semibold text-gray-900 mb-1">Activate Talent Mobility</h3>
                <p className="text-gray-600">Users enable the Talent Mobility function in their dashboard.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Set Role Preferences</h3>
                <p className="text-gray-600 mb-3">Users configure their focus areas including:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0A2463] mt-1">•</span>
                    <span className="text-gray-700">Country / Region</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0A2463] mt-1">•</span>
                    <span className="text-gray-700">Market</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0A2463] mt-1">•</span>
                    <span className="text-gray-700">Industry</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0A2463] mt-1">•</span>
                    <span className="text-gray-700">Professional domain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0A2463] mt-1">•</span>
                    <span className="text-gray-700">Role title or seniority level</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Receive Opportunities</h3>
                <p className="text-gray-600">The system pushes relevant enterprise campaigns in real time.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Participate</h3>
                <p className="text-gray-600 mb-2">Users can either:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0A2463] mt-1">•</span>
                    <span className="text-gray-700">Recommend a candidate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0A2463] mt-1">•</span>
                    <span className="text-gray-700">Self-nominate for the opportunity</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: 5D Intelligent Matching */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-7 h-7 text-[#0A2463]" />
            <h2 className="text-2xl font-bold text-gray-900">5D Intelligent Matching</h2>
          </div>
          
          <p className="text-gray-700 mb-6">
            PhxNorth does not use simple binary matching. Instead, the platform evaluates alignment between:
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Target className="w-5 h-5 text-[#0A2463] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Candidate 5D Profile</h3>
                <p className="text-sm text-gray-600">Comprehensive capability mapping</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Target className="w-5 h-5 text-[#0A2463] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Enterprise Role Requirements</h3>
                <p className="text-sm text-gray-600">Structured 5D position needs</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Dimensions include:</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-gray-700">Hard skills</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-gray-700">Soft skills</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-gray-700">Decision logic</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-gray-700">Risk calibration</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-gray-700">Network capital</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Example:</h3>
            <p className="text-gray-700 leading-relaxed">
              A candidate may match strongly in expertise but the system may indicate that decision style or risk calibration could become a focus during enterprise interviews. This guidance helps users make higher-quality referrals.
            </p>
          </div>
        </div>

        {/* Section 3: Process Governance */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-7 h-7 text-[#0A2463]" />
            <h2 className="text-2xl font-bold text-gray-900">Process Governance</h2>
          </div>
          
          <p className="text-gray-700 mb-4">Once a referral or self-nomination is submitted:</p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Users complete structured information required by the platform.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">AI system evaluates the submission.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">The campaign follows a professional executive search workflow.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Progress updates appear in the user's dashboard.</p>
            </div>
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
              <p className="text-gray-700">Participate in global talent mobility opportunities</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Access curated enterprise hiring campaigns</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Receive intelligent matching insights before recommending</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Track referral progress transparently</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Build professional reputation within the ecosystem</p>
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="bg-gradient-to-br from-[#0A2463] to-[#0D47A1] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-4">Join the global talent mobility ecosystem and unlock enterprise opportunities.</p>
          <p className="text-blue-200 text-sm mb-6 max-w-2xl mx-auto leading-relaxed">
            Activation is managed inside your personal dashboard. Open your portal to enable Talent Mobility and start receiving enterprise campaigns.
          </p>
          <Link to="/login">
            <button className="px-8 py-3 bg-white text-[#0A2463] rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Go to Dashboard to Activate
            </button>
          </Link>
          <p className="text-blue-200 text-xs mt-4">
            Enable Talent Mobility in your dashboard to start receiving enterprise opportunities.
          </p>
        </div>

        {/* Related Links */}
        <div className="mt-8 flex gap-4 justify-center text-sm">
          <Link to="/#enterprises" className="text-[#0A2463] hover:underline">
            Back to For Enterprises
          </Link>
          <span className="text-gray-400">•</span>
          <Link to="/commercial-consultation" className="text-[#0A2463] hover:underline">
            View Commercial Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}