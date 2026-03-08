import { User, Mail, Phone, MapPin, Briefcase, Calendar, Award, Shield, Settings, Bell } from "lucide-react";

export function Profile() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-[#0A2463] text-white rounded-full flex items-center justify-center text-3xl">
              JD
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">John Doe</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  john.doe@example.com
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +1 (555) 123-4567
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">Mentee</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">Mentor</span>
              </div>
            </div>
          </div>
          <button className="bg-[#0A2463] text-white px-6 py-2 rounded-lg hover:bg-[#0A2463]/90 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>

      {/* 5D Profile System */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">5D Profile System</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileDimension
            icon={<Award className="w-5 h-5 text-blue-600" />}
            title="Skills"
            items={["React", "TypeScript", "Node.js", "System Design", "Leadership"]}
          />
          <ProfileDimension
            icon={<Briefcase className="w-5 h-5 text-purple-600" />}
            title="Experience"
            items={["5+ years Software Engineering", "Tech Lead", "Startup Experience"]}
          />
          <ProfileDimension
            icon={<Award className="w-5 h-5 text-green-600" />}
            title="Interests"
            items={["Web Development", "AI/ML", "DevOps", "Product Management"]}
          />
          <ProfileDimension
            icon={<Calendar className="w-5 h-5 text-orange-600" />}
            title="Goals"
            items={["Become Senior Engineer", "Master System Design", "Build SaaS Product"]}
          />
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <ProfileDimension
            icon={<Calendar className="w-5 h-5 text-indigo-600" />}
            title="Availability"
            items={["Weekdays: 6 PM - 9 PM PST", "Weekends: Flexible", "Timezone: PST (UTC-8)"]}
          />
        </div>
      </div>

      {/* Stats & Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Projects Completed</span>
            <Award className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">3</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Courses Enrolled</span>
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">5</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Compliance Score</span>
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">98%</div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
        <div className="space-y-4">
          <SettingRow
            icon={<Bell className="w-5 h-5 text-gray-600" />}
            title="Notifications"
            description="Manage email and push notifications"
          />
          <SettingRow
            icon={<Shield className="w-5 h-5 text-gray-600" />}
            title="Privacy & Security"
            description="Control your privacy settings and security options"
          />
          <SettingRow
            icon={<Settings className="w-5 h-5 text-gray-600" />}
            title="Preferences"
            description="Customize your platform experience"
          />
        </div>
      </div>

      {/* Certifications & Achievements */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Certifications & Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CertificationCard
            title="Full-Stack Development Mastery"
            issuer="Sarah Johnson"
            date="January 2026"
          />
          <CertificationCard
            title="Advanced React Patterns"
            issuer="PhxNorth Platform"
            date="February 2026"
          />
        </div>
      </div>
    </div>
  );
}

function ProfileDimension({ icon, title, items }: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function SettingRow({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}

function CertificationCard({ title, issuer, date }: {
  title: string;
  issuer: string;
  date: string;
}) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex items-start justify-between mb-2">
        <Award className="w-8 h-8 text-[#0A2463]" />
        <span className="text-xs text-gray-500">{date}</span>
      </div>
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">Issued by {issuer}</p>
    </div>
  );
}