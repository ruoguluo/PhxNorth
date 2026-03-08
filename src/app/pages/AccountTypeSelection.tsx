import { Link, useNavigate } from "react-router";
import { User, Building2, ArrowRight } from "lucide-react";

export function AccountTypeSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2463] via-[#1e3a8a] to-[#0A2463] flex items-center justify-center px-6 py-12">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-8">
            <h1 className="text-3xl font-bold text-white">PhxNorth</h1>
          </Link>
          <h2 className="text-4xl font-bold text-white mb-4">Choose your account type</h2>
        </div>

        {/* Account Type Options */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Individual Account */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col h-full">
              {/* Icon */}
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <User className="w-8 h-8 text-blue-600" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-[#0A2463] mb-4">Individual</h3>

              {/* Description */}
              <p className="text-gray-600 mb-8 flex-grow leading-relaxed">
                For professionals participating in mentorship, talent mobility and commercial advisory opportunities.
              </p>

              {/* Button */}
              <button
                onClick={() => navigate("/create-account?type=individual")}
                className="w-full bg-[#0A2463] text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-900 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                Create Individual Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Enterprise Account */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col h-full">
              {/* Icon */}
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-[#0A2463] mb-4">Enterprise</h3>

              {/* Description */}
              <p className="text-gray-600 mb-8 flex-grow leading-relaxed">
                For companies launching hiring campaigns, talent programs and advisory projects.
              </p>

              {/* Button */}
              <button
                onClick={() => navigate("/create-account?type=enterprise")}
                className="w-full bg-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-purple-700 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                Create Enterprise Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>

        {/* Already have an account */}
        <div className="text-center mt-8">
          <p className="text-blue-200">
            Already have an account?{" "}
            <Link to="/login-type-selection" className="text-white underline hover:text-blue-100 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
