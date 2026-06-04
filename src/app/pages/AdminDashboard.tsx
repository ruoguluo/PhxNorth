import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Shield, AlertTriangle, CheckCircle, Clock, DollarSign, Users, TrendingUp, FileText, Trash2, RefreshCw, Database } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { adminAPI } from '../../lib/api';
import { discAdminAPI, type DISCUser } from '../../lib/disc-api';

const complianceData = [
  { month: 'Jan', flags: 3 },
  { month: 'Feb', flags: 1 },
  { month: 'Mar', flags: 2 },
  { month: 'Apr', flags: 0 },
  { month: 'May', flags: 1 },
  { month: 'Jun', flags: 0 },
];

const verificationQueue = [
  { id: 1, name: "Emma Wilson", role: "Mentor", submittedDate: "Feb 20, 2026", documentsCount: 5 },
  { id: 2, name: "James Anderson", role: "Consultant", submittedDate: "Feb 22, 2026", documentsCount: 4 },
  { id: 3, name: "Sofia Rodriguez", role: "Mentor", submittedDate: "Feb 23, 2026", documentsCount: 6 },
];

const redFlags = [
  {
    id: 1,
    session: "React Advanced Patterns - Session 7",
    mentor: "John Smith",
    mentee: "Alice Brown",
    flagType: "Inappropriate Language",
    severity: "Medium",
    timestamp: "Today, 2:30 PM",
    reviewed: false,
  },
  {
    id: 2,
    session: "Data Science Q&A",
    mentor: "Dr. Chen",
    mentee: "Bob Williams",
    flagType: "Off-Topic Discussion",
    severity: "Low",
    timestamp: "Yesterday, 4:15 PM",
    reviewed: false,
  },
];

const complianceAlerts = [
  {
    id: 1,
    type: "Low Attendance",
    user: "Sarah Johnson",
    course: "Machine Learning Basics",
    details: "Attendance dropped below 70% threshold",
    status: "Warning",
  },
  {
    id: 2,
    type: "Missed Sessions",
    user: "Michael Chen",
    project: "Full-Stack Development",
    details: "3 consecutive sessions missed without notice",
    status: "Critical",
  },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const [platformStats, setPlatformStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminAPI.getStats();
        setPlatformStats(data);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-600 mt-1">Platform monitoring, compliance, and user management</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">All Systems Operational</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={platformStats ? String(platformStats.total_users) : '...'}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          trend={`${platformStats?.total_mentors ?? 0} mentors, ${platformStats?.total_mentees ?? 0} mentees`}
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Platform Revenue"
          value={platformStats ? `$${(platformStats.total_revenue / 1000).toFixed(1)}K` : '...'}
          icon={<DollarSign className="w-6 h-6 text-green-600" />}
          trend={`${platformStats?.completed_sessions ?? 0} completed sessions`}
          bgColor="bg-green-50"
        />
        <StatCard
          title="Average Rating"
          value={platformStats ? platformStats.average_rating.toFixed(1) : '...'}
          icon={<Shield className="w-6 h-6 text-emerald-600" />}
          trend="Excellent"
          bgColor="bg-emerald-50"
        />
        <StatCard
          title="Pending Reviews"
          value={platformStats ? String(platformStats.pending_requests) : '...'}
          icon={<Clock className="w-6 h-6 text-orange-600" />}
          trend="Action needed"
          bgColor="bg-orange-50"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Verification Queue */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Verification Queue</h2>
            <span className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded-full">
              {verificationQueue.length} pending
            </span>
          </div>
          <div className="space-y-4">
            {verificationQueue.map((user) => (
              <div key={user.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.role}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                    {user.documentsCount} docs
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{user.submittedDate}</p>
                <div className="flex gap-2">
                  <button onClick={() => alert('User approved!')} className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors">
                    Approve
                  </button>
                  <button onClick={() => navigate('/app/admin')} className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-50 transition-colors">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Red Flag Review */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">AI Red Flag Detection</h2>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>AI Active</span>
            </div>
          </div>
          <div className="space-y-4">
            {redFlags.map((flag) => (
              <RedFlagCard key={flag.id} flag={flag} />
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Compliance Alerts</h2>
          <div className="space-y-4">
            {complianceAlerts.map((alert) => (
              <ComplianceAlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Red Flags Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={complianceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Bar dataKey="flags" fill="#dc2626" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Session Transcript Review */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Session Transcripts</h2>
        <div className="space-y-3">
          <TranscriptRow
            session="Full-Stack Development - Architecture Review"
            participants="Sarah Johnson & Alex Thompson"
            date="Feb 24, 2026"
            duration="60 min"
            complianceScore={100}
          />
          <TranscriptRow
            session="Machine Learning Q&A"
            participants="Dr. Michael Chen & Jessica Martinez"
            date="Feb 23, 2026"
            duration="45 min"
            complianceScore={98}
          />
          <TranscriptRow
            session="React Patterns - Session 7"
            participants="Sarah Johnson & Course Group A"
            date="Feb 22, 2026"
            duration="90 min"
            complianceScore={95}
          />
        </div>
      </div>

      {/* Revenue & Payouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Revenue Tracking</h2>
          <div className="space-y-4">
            <RevenueRow source="Course Enrollments" amount="$18,500" commission="$2,775" />
            <RevenueRow source="Mentorship Projects" amount="$15,200" commission="$2,280" />
            <RevenueRow source="Instant Sessions" amount="$5,800" commission="$870" />
            <RevenueRow source="Workshops" amount="$3,000" commission="$450" />
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Total Platform Revenue</span>
              <span className="text-2xl font-bold text-green-600">$42,500</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Payout Summary</h2>
          <div className="space-y-4">
            <PayoutRow mentor="Sarah Johnson" amount="$8,400" status="Completed" />
            <PayoutRow mentor="Dr. Michael Chen" amount="$6,200" status="Pending" />
            <PayoutRow mentor="Emily Williams" amount="$5,800" status="Completed" />
            <PayoutRow mentor="David Park" amount="$3,900" status="Processing" />
          </div>
        </div>
      </div>

      {/* Account Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Restriction Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AccountStatusCard
            title="Warning Status"
            count={2}
            description="Users with compliance warnings"
            color="orange"
          />
          <AccountStatusCard
            title="Restricted Access"
            count={0}
            description="Users with limited platform access"
            color="red"
          />
          <AccountStatusCard
            title="Paused Accounts"
            count={1}
            description="Temporarily suspended accounts"
            color="gray"
          />
        </div>
      </div>

      {/* DISC Data Management */}
      <DISCDataManagement />
    </div>
  );
}

function StatCard({ title, value, icon, trend, bgColor }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`${bgColor} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600 mb-2">{title}</div>
      <div className="text-xs text-gray-500">{trend}</div>
    </div>
  );
}

function RedFlagCard({ flag }: { flag: typeof redFlags[0] }) {
  const severityColors: Record<string, string> = {
    High: 'bg-red-50 text-red-700 border-red-200',
    Medium: 'bg-orange-50 text-orange-700 border-orange-200',
    Low: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };

  return (
    <div className={`p-4 border-2 rounded-lg ${severityColors[flag.severity]}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">{flag.flagType}</h4>
            <p className="text-sm">{flag.session}</p>
            <p className="text-sm mt-1">{flag.mentor} & {flag.mentee}</p>
          </div>
        </div>
        <span className="text-xs px-2 py-1 bg-white rounded-full">
          {flag.severity}
        </span>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-current border-opacity-20">
        <span className="text-xs">{flag.timestamp}</span>
        <div className="flex gap-2">
          <button onClick={() => alert('Transcript viewer coming soon')} className="text-sm px-3 py-1 bg-white rounded hover:bg-opacity-80 transition-colors">
            Review Transcript
          </button>
          <button onClick={() => alert('Flag dismissed')} className="text-sm px-3 py-1 bg-white rounded hover:bg-opacity-80 transition-colors">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

function ComplianceAlertCard({ alert }: { alert: typeof complianceAlerts[0] }) {
  const navigate = useNavigate();
  const statusColors: Record<string, string> = {
    Warning: 'bg-orange-50 text-orange-700',
    Critical: 'bg-red-50 text-red-700',
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">{alert.type}</h4>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[alert.status]}`}>
              {alert.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">{alert.user}</p>
          <p className="text-sm text-gray-700">{alert.details}</p>
        </div>
      </div>
      <button onClick={() => navigate('/app/admin')} className="text-sm text-[#0A2463] hover:underline mt-2">
        Take Action
      </button>
    </div>
  );
}

function TranscriptRow({ session, participants, date, duration, complianceScore }: {
  session: string;
  participants: string;
  date: string;
  duration: string;
  complianceScore: number;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <FileText className="w-5 h-5 text-gray-400" />
        <div>
          <h4 className="font-semibold text-gray-900">{session}</h4>
          <p className="text-sm text-gray-600">{participants}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-sm text-gray-600">{date}</div>
        <div className="text-sm text-gray-600">{duration}</div>
        <div className={`text-sm font-semibold ${complianceScore >= 95 ? 'text-green-600' : complianceScore >= 90 ? 'text-orange-600' : 'text-red-600'
          }`}>
          {complianceScore}%
        </div>
        <button onClick={() => navigate('/app/admin')} className="text-sm text-[#0A2463] hover:underline">View</button>
      </div>
    </div>
  );
}

function RevenueRow({ source, amount, commission }: {
  source: string;
  amount: string;
  commission: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="text-sm text-gray-700">{source}</span>
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-gray-900">{amount}</span>
        <span className="text-sm text-green-600">+{commission}</span>
      </div>
    </div>
  );
}

function PayoutRow({ mentor, amount, status }: {
  mentor: string;
  amount: string;
  status: string;
}) {
  const statusColors: Record<string, string> = {
    Completed: 'bg-green-50 text-green-700',
    Pending: 'bg-orange-50 text-orange-700',
    Processing: 'bg-blue-50 text-blue-700',
  };

  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <span className="text-sm text-gray-700">{mentor}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-900">{amount}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function DISCDataManagement() {
  const [discUsers, setDiscUsers] = useState<DISCUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const users = await discAdminAPI.listUsers();
      setDiscUsers(users);
    } catch (err) {
      console.error('Failed to fetch DISC users:', err);
      setDiscUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleReset = async (user: DISCUser) => {
    if (!confirm(`Reset all DISC data for ${user.email}?\n\nThis will delete their DISC profile, career data, risk assessments, and all behavioral signals. The user record will be re-created on their next login.`)) {
      return;
    }
    setResetting(user.id);
    setMessage(null);
    try {
      const result = await discAdminAPI.resetUserData(user.id);
      setMessage({ type: 'success', text: `${result.message}` });
      await fetchUsers();
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to reset: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setResetting(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Database className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">DISC Data Management</h2>
            <p className="text-sm text-gray-500">Manage behavioral intelligence data for users</p>
          </div>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 inline mr-2" /> : <AlertTriangle className="w-4 h-4 inline mr-2" />}
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
          Loading DISC users...
        </div>
      ) : discUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Database className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p>No users have DISC data yet.</p>
          <p className="text-xs mt-1">Users appear here after they first access a DISC feature.</p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Email</th>
                <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">DISC User ID</th>
                <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Created</th>
                <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-gray-600 px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {discUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">{user.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-gray-500">{user.id.slice(0, 8)}...</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${user.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleReset(user)}
                      disabled={resetting === user.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      {resetting === user.id ? (
                        <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Resetting...</>
                      ) : (
                        <><Trash2 className="w-3.5 h-3.5" /> Reset Data</>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AccountStatusCard({ title, count, description, color }: {
  title: string;
  count: number;
  description: string;
  color: string;
}) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
    red: { bg: 'bg-red-50', text: 'text-red-600' },
    gray: { bg: 'bg-gray-50', text: 'text-gray-600' },
  };

  const colors = colorMap[color];

  return (
    <div className={`p-6 ${colors.bg} rounded-lg border border-gray-200`}>
      <div className={`text-4xl font-bold ${colors.text} mb-2`}>{count}</div>
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}