import { useState } from 'react';
import { CheckCircle, Users, Award, Briefcase, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";

type Role = 'mentee' | 'mentor' | 'consultant';

interface RoleCard {
  id: Role;
  title: string;
  icon: typeof Users;
  color: string;
  bgColor: string;
  borderColor: string;
  valueProposition: string;
  benefits: string[];
}

const roleCards: RoleCard[] = [
  {
    id: 'mentee',
    title: 'Mentee',
    icon: Users,
    color: '#0A2463',
    bgColor: 'bg-[#0A2463]',
    borderColor: 'border-[#0A2463]',
    valueProposition: 'Accelerate your growth through structured mentorship and intelligence-driven career development',
    benefits: [
      'Access expert mentors across industries',
      'Structured question decomposition engine',
      'Track your 5D behavioral intelligence',
      'Build strategic decision-making capability'
    ]
  },
  {
    id: 'mentor',
    title: 'Mentor',
    icon: Award,
    color: '#059669',
    bgColor: 'bg-emerald-600',
    borderColor: 'border-emerald-600',
    valueProposition: 'Share your expertise, guide talent, and host workshops while building your mentorship portfolio',
    benefits: [
      'Guide mentees with structured frameworks',
      'Manage availability and calendar',
      'Host workshops and group sessions',
      'Contribute to talent development at scale'
    ]
  },
  {
    id: 'consultant',
    title: 'Business Consultant',
    icon: Briefcase,
    color: '#B45309',
    bgColor: 'bg-amber-700',
    borderColor: 'border-amber-700',
    valueProposition: 'Drive enterprise outcomes through strategic advisory, project execution, and talent placement',
    benefits: [
      'Manage enterprise consulting projects',
      'Access global talent referral network',
      'Provide strategic business advisory',
      'Drive measurable business outcomes'
    ]
  }
];

export function RoleSelectionNew() {
  const navigate = useNavigate();
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);

  const toggleRole = (roleId: Role) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter(r => r !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const handleActivate = () => {
    if (selectedRoles.length === 0) return;

    // Navigate to the first selected role's dashboard
    const primaryRole = selectedRoles[0];
    if (primaryRole === 'mentee') {
      navigate('/app/dashboard');
    } else if (primaryRole === 'mentor') {
      navigate('/app/mentor/dashboard');
    } else if (primaryRole === 'consultant') {
      navigate('/app/consultant/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="PhxNorth" className="h-8" />
            <span className="text-2xl font-bold text-[#0A2463]">PhxNorth</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Choose Your Role</h1>
          <p className="text-xl text-gray-600">
            Activate one or more growth pathways
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          {roleCards.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRoles.includes(role.id);
            
            return (
              <div
                key={role.id}
                onClick={() => toggleRole(role.id)}
                className={`
                  relative bg-white rounded-2xl border-4 p-8 cursor-pointer transition-all duration-300
                  ${isSelected ? `${role.borderColor} shadow-2xl scale-105` : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'}
                `}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className={`absolute -top-4 -right-4 ${role.bgColor} rounded-full p-3 shadow-lg`}>
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                )}

                {/* Icon */}
                <div className={`${role.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{role.title}</h2>

                {/* Value Proposition */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {role.valueProposition}
                </p>

                {/* Benefits */}
                <div className="space-y-3 mb-6">
                  {role.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Activate Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRole(role.id);
                  }}
                  className={`
                    w-full py-3 px-4 rounded-lg font-semibold transition-all
                    ${isSelected 
                      ? `${role.bgColor} text-white` 
                      : `border-2 ${role.borderColor} text-gray-900 hover:${role.bgColor} hover:text-white`
                    }
                  `}
                >
                  {isSelected ? 'Selected' : 'Activate'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        {selectedRoles.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={handleActivate}
              className="flex items-center gap-3 bg-[#0A2463] hover:bg-[#0A2463]/90 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
            >
              <span>Continue with {selectedRoles.length} {selectedRoles.length === 1 ? 'Role' : 'Roles'}</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Unlock Additional Roles Modal (for existing users)
interface UnlockRolesModalProps {
  activatedRoles: Role[];
  onActivate: (role: Role) => void;
  onSkip: () => void;
  onClose: () => void;
}

export function UnlockRolesModal({ activatedRoles, onActivate, onSkip, onClose }: UnlockRolesModalProps) {
  const availableRoles = roleCards.filter(role => !activatedRoles.includes(role.id));

  if (availableRoles.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Unlock Additional Roles</h2>
          <p className="text-lg text-gray-600">
            Expand your capabilities by activating more growth pathways
          </p>
        </div>

        {/* Available Roles */}
        <div className="space-y-6 mb-8">
          {availableRoles.map((role) => {
            const Icon = role.icon;
            
            return (
              <div
                key={role.id}
                className="border-2 border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all"
              >
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className={`${role.bgColor} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{role.title}</h3>
                    <p className="text-gray-700 mb-4">{role.valueProposition}</p>
                    
                    {/* Short Benefits */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {role.benefits.slice(0, 2).map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm text-gray-600">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activate Button */}
                  <button
                    onClick={() => {
                      onActivate(role.id);
                      onClose();
                    }}
                    className={`${role.bgColor} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all whitespace-nowrap`}
                  >
                    Activate
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Skip Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              onSkip();
              onClose();
            }}
            className="text-gray-600 hover:text-gray-900 font-medium px-6 py-3"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
