import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Bell, User, X, Lock } from "lucide-react";
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";
import { useState } from "react";

type Role = 'mentee' | 'mentor' | 'consultant';

interface RoleConfig {
  name: string;
  color: string;
  bgColor: string;
  hoverBg: string;
  borderColor: string;
  description: string;
}

const roleConfigs: Record<Role, RoleConfig> = {
  mentee: {
    name: 'Mentee',
    color: '#0A2463',
    bgColor: 'bg-[#0A2463]',
    hoverBg: 'hover:bg-[#0A2463]/10',
    borderColor: 'border-[#0A2463]',
    description: 'Access personalized mentorship, structured question flows, and track your 5D growth journey.',
  },
  mentor: {
    name: 'Mentor',
    color: '#059669',
    bgColor: 'bg-emerald-600',
    hoverBg: 'hover:bg-emerald-50',
    borderColor: 'border-emerald-600',
    description: 'Guide mentees, manage mentorship sessions, host workshops, and share your expertise.',
  },
  consultant: {
    name: 'Business Consultant',
    color: '#B45309',
    bgColor: 'bg-amber-700',
    hoverBg: 'hover:bg-amber-50',
    borderColor: 'border-amber-700',
    description: 'Provide strategic advisory to enterprises, manage consulting projects, and drive business outcomes.',
  },
};

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMentorDashboard = location.pathname.includes('mentor-dashboard');
  
  // Role management state
  const [activeRoles, setActiveRoles] = useState<Role[]>(['mentee']); // User has activated Mentee role
  const [currentRole, setCurrentRole] = useState<Role>('mentee'); // Currently viewing Mentee dashboard
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [roleToActivate, setRoleToActivate] = useState<Role | null>(null);

  const handleRoleClick = (role: Role) => {
    if (activeRoles.includes(role)) {
      // Role is already active, switch to it
      setCurrentRole(role);
      // Navigate to the appropriate dashboard
      if (role === 'mentee') {
        navigate('/app/dashboard');
      } else if (role === 'mentor') {
        navigate('/app/mentor/dashboard');
      }
      // Add other role navigations as needed
    } else {
      // Role is not active, show activation modal
      setRoleToActivate(role);
      setShowActivationModal(true);
    }
  };

  const handleActivateRole = () => {
    if (roleToActivate) {
      setActiveRoles([...activeRoles, roleToActivate]);
      setCurrentRole(roleToActivate);
      setShowActivationModal(false);
      setRoleToActivate(null);
      // Navigate to the appropriate dashboard after activation
      if (roleToActivate === 'mentee') {
        navigate('/app/dashboard');
      } else if (roleToActivate === 'mentor') {
        navigate('/app/mentor/dashboard');
      }
      // Add other role navigations as needed
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Logo + Role Tabs */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                <img src={logo} alt="PhxNorth" className="h-8" />
                <span className="text-xl font-bold text-[#0A2463]">PhxNorth</span>
              </Link>
              
              {/* Global Role Switch Bar - All 3 Roles Always Visible */}
              <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
                {(Object.keys(roleConfigs) as Role[]).map((role) => {
                  const config = roleConfigs[role];
                  const isActivated = activeRoles.includes(role);
                  const isCurrent = currentRole === role;
                  
                  if (isActivated) {
                    // Activated role - normal brand color
                    if (isCurrent) {
                      // Current active role - filled style
                      return (
                        <button
                          key={role}
                          onClick={() => handleRoleClick(role)}
                          className={`px-4 py-2 rounded-lg text-white font-medium transition-all ${config.bgColor}`}
                        >
                          {config.name}
                        </button>
                      );
                    } else {
                      // Activated but not current - outlined style
                      return (
                        <button
                          key={role}
                          onClick={() => handleRoleClick(role)}
                          className={`px-4 py-2 rounded-lg font-medium border-2 transition-all ${config.borderColor} ${config.hoverBg}`}
                          style={{ color: config.color }}
                        >
                          {config.name}
                        </button>
                      );
                    }
                  } else {
                    // NOT activated - red outline + lock icon
                    return (
                      <button
                        key={role}
                        onClick={() => handleRoleClick(role)}
                        className="px-4 py-2 rounded-lg font-medium border-2 border-red-400 text-red-600 hover:bg-red-50 transition-all flex items-center gap-1.5"
                      >
                        <Lock className="w-4 h-4" />
                        {config.name}
                      </button>
                    );
                  }
                })}
              </div>
            </div>

            {/* Right Side - Notifications + User */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <Link to="/app/profile" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-[#0A2463] text-white rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">John Doe</div>
                  <div className="text-xs text-gray-500">{roleConfigs[currentRole].name}</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Role Activation Modal */}
      {showActivationModal && roleToActivate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            {/* Close button */}
            <button
              onClick={() => {
                setShowActivationModal(false);
                setRoleToActivate(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal content */}
            <div className="text-center mb-6">
              <div 
                className={`w-16 h-16 rounded-full ${roleConfigs[roleToActivate].bgColor} mx-auto mb-4 flex items-center justify-center`}
              >
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Activate {roleConfigs[roleToActivate].name} Role?
              </h2>
              <p className="text-gray-600">
                {roleConfigs[roleToActivate].description}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowActivationModal(false);
                  setRoleToActivate(null);
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleActivateRole}
                className={`flex-1 px-4 py-3 text-white rounded-lg font-medium transition-colors ${roleConfigs[roleToActivate].bgColor} hover:opacity-90`}
              >
                Activate Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}