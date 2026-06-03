import { User, Mail, MapPin, Briefcase, Calendar, Award, Shield, Settings, Bell, Globe, GraduationCap, Building } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../lib/auth-context";

export function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto p-8 text-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  const initials = user.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.username?.slice(0, 2).toUpperCase() || '?';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-[#0A2463] text-white rounded-full flex items-center justify-center text-3xl font-bold">
              {initials}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.keep_name_private ? user.username : user.full_name || user.username}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
                {user.current_country && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {user.current_country}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm capitalize">
                  {user.role}
                </span>
                {user.status && (
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm capitalize">
                    {user.status}
                  </span>
                )}
                {user.is_online && (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm">
                    Online
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/app/mentee/profile-setup')}
            className="bg-[#0A2463] text-white px-6 py-2 rounded-lg hover:bg-[#0A2463]/90 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Summary */}
      {user?.summary && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
          <p className="text-gray-600 whitespace-pre-line">{user.summary}</p>
        </div>
      )}

      {/* Professional Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Professional Background</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {user.industry && (
            <ProfileItem
              icon={<Building className="w-5 h-5 text-blue-600" />}
              title="Industry"
              items={[
                user.industry,
                user.sector ? `Sector: ${user.sector}` : null,
                user.sub_sector ? `Sub-sector: ${user.sub_sector}` : null,
              ].filter(Boolean) as string[]}
            />
          )}
          {user.years_experience && (
            <ProfileItem
              icon={<Briefcase className="w-5 h-5 text-purple-600" />}
              title="Experience"
              items={[user.years_experience]}
            />
          )}
          {(user.degree_level || user.field_of_study) && (
            <ProfileItem
              icon={<GraduationCap className="w-5 h-5 text-green-600" />}
              title="Education"
              items={[
                user.degree_level || null,
                user.field_of_study ? `Field: ${user.field_of_study}` : null,
              ].filter(Boolean) as string[]}
            />
          )}
          {user.interested_countries && user.interested_countries.length > 0 && (
            <ProfileItem
              icon={<Globe className="w-5 h-5 text-orange-600" />}
              title="Interested Countries"
              items={user.interested_countries}
            />
          )}
        </div>

        {user.interested_industries && user.interested_industries.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <ProfileItem
              icon={<Briefcase className="w-5 h-5 text-indigo-600" />}
              title="Interested Industries"
              items={user.interested_industries}
            />
          </div>
        )}

        {user.specializations && user.specializations.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <ProfileItem
              icon={<Award className="w-5 h-5 text-amber-600" />}
              title="Specializations"
              items={user.specializations}
            />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Sessions"
          value={user.total_sessions}
          icon={<Calendar className="w-5 h-5 text-blue-600" />}
        />
        <StatCard
          label="Rating"
          value={user.rating > 0 ? user.rating.toFixed(1) : 'No ratings yet'}
          icon={<Award className="w-5 h-5 text-purple-600" />}
        />
        <StatCard
          label="Account Status"
          value={user.is_active ? 'Active' : 'Inactive'}
          icon={<Shield className="w-5 h-5 text-green-600" />}
        />
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
          <p className="text-gray-700 leading-relaxed">{user.bio}</p>
        </div>
      )}

      {/* Account Info */}
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

      {/* Member since */}
      {user.created_at && (
        <div className="text-center text-sm text-gray-400 pb-4">
          Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      )}
    </div>
  );
}

function ProfileItem({ icon, title, items }: {
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

function StatCard({ label, value, icon }: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">{label}</span>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
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
