import { Link } from "react-router";
import { Users, BookOpen, Calendar, Presentation } from "lucide-react";
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";

export function RoleSelection() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src={logo} alt="PhxNorth" className="h-12" />
            <span className="text-2xl font-bold text-[#0A2463]">PhxNorth</span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Role</h1>
          <p className="text-xl text-gray-600">Select how you'd like to participate in the PhxNorth ecosystem</p>
          <p className="text-sm text-gray-500 mt-2">You can select multiple roles and switch between them anytime</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <RoleCard
            icon={<BookOpen className="w-12 h-12 text-[#0A2463]" />}
            title="Mentee"
            description="Learn from experts, grow your skills, and achieve your goals"
            features={[
              "Access to mentors",
              "Enroll in courses",
              "Track progress",
              "Get certified"
            ]}
            link="/app/dashboard"
          />
          <RoleCard
            icon={<Users className="w-12 h-12 text-[#0A2463]" />}
            title="Mentor"
            description="Share your expertise through mentorship, workshops, and courses"
            features={[
              "Create courses",
              "Host workshops",
              "Manage sessions",
              "Build reputation"
            ]}
            link="/app/mentor/dashboard"
            highlighted
          />
          <RoleCard
            icon={<Calendar className="w-12 h-12 text-[#0A2463]" />}
            title="Business Consultant"
            description="Provide strategic advisory to enterprises and organizations"
            features={[
              "Advisory projects",
              "Strategic guidance",
              "Enterprise clients",
              "High-value engagements"
            ]}
            link="/app/mentor/dashboard"
          />
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
          <p className="text-gray-600 mb-4">
            Already have an account?{" "}
            <Link to="/login" className="text-[#0A2463] hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ 
  icon, 
  title, 
  description, 
  features, 
  link,
  highlighted 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  features: string[];
  link: string;
  highlighted?: boolean;
}) {
  return (
    <div className={`bg-white p-6 rounded-xl border-2 ${highlighted ? 'border-[#0A2463] shadow-lg' : 'border-gray-200'} hover:shadow-xl transition-all`}>
      {highlighted && (
        <div className="bg-[#0A2463] text-white text-xs px-3 py-1 rounded-full inline-block mb-3">
          Popular
        </div>
      )}
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2 mb-6">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-1.5 h-1.5 bg-[#0A2463] rounded-full" />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        to={link}
        className={`block text-center px-4 py-3 rounded-lg transition-colors ${
          highlighted
            ? 'bg-[#0A2463] text-white hover:bg-[#0A2463]/90'
            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        Select {title}
      </Link>
    </div>
  );
}