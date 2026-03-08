import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { CheckCircle, ArrowRight, Globe, Calendar, Clock, User as UserIcon } from "lucide-react";
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";

export function PreRoleWelcome() {
  const navigate = useNavigate();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [activeWorkshopTab, setActiveWorkshopTab] = useState<"open" | "upcoming" | "announced">("open");
  const [selectedFilters, setSelectedFilters] = useState({
    country: "United Kingdom",
    availability: "All",
    industry: "All"
  });

  const roles = [
    {
      id: "mentee",
      name: "Mentee",
      description: "Get matched in 5D and build a guided growth pathway."
    },
    {
      id: "mentor",
      name: "Mentor",
      description: "Offer mentorship and build advisory reputation."
    },
    {
      id: "talent-mobility",
      name: "Talent Mobility",
      description: "Join structured talent campaigns & referral system."
    },
    {
      id: "commercial-advisory",
      name: "Commercial Advisory",
      description: "Work on governed enterprise consulting projects."
    }
  ];

  const mentors = [
    { name: "Daniel", country: "UK", title: "Investment Director", industry: "Private Equity", status: "online" },
    { name: "Oliver", country: "UK", title: "M&A Partner", industry: "Corporate Finance", status: "live" },
    { name: "Emma", country: "UK", title: "Chief Strategy Officer", industry: "Retail", status: "instant-enabled" },
    { name: "James", country: "UK", title: "Head of Engineering", industry: "FinTech", status: "online" },
    { name: "Charlotte", country: "UK", title: "VP Operations", industry: "E-commerce", status: "online" },
    { name: "William", country: "UK", title: "Senior Consultant", industry: "Healthcare", status: "instant-enabled" },
    { name: "Sophie", country: "UK", title: "Strategy Lead", industry: "Consulting", status: "live" },
    { name: "George", country: "UK", title: "Tech Director", industry: "SaaS", status: "online" },
    { name: "Amelia", country: "UK", title: "Product Manager", industry: "AI / ML", status: "instant-enabled" },
    { name: "Thomas", country: "UK", title: "Operations Head", industry: "Logistics", status: "online" },
    { name: "Isabella", country: "UK", title: "VP Marketing", industry: "Consumer Tech", status: "online" },
    { name: "Henry", country: "UK", title: "Finance Director", industry: "Banking", status: "instant-enabled" },
    { name: "Sophia", country: "UK", title: "HR Director", industry: "Professional Services", status: "online" },
    { name: "Jack", country: "UK", title: "Legal Counsel", industry: "Legal Tech", status: "instant-enabled" },
    { name: "Olivia", country: "UK", title: "Data Scientist", industry: "Healthcare Tech", status: "online" },
    { name: "Oscar", country: "UK", title: "Growth Lead", industry: "FinTech", status: "online" }
  ];

  const workshops = {
    open: [
      {
        title: "Strategic Leadership in Digital Transformation",
        speaker: "Dr. Sarah Chen",
        credential: "Former VP Digital Strategy, Fortune 100",
        date: "Mar 15, 2026",
        time: "14:00 GMT",
        seats: 8,
        deadline: "Mar 12, 2026",
        countdown: "2d 4h"
      },
      {
        title: "AI-Powered Product Management Frameworks",
        speaker: "Marcus Williams",
        credential: "Head of Product, Leading SaaS Platform",
        date: "Mar 18, 2026",
        time: "16:00 GMT",
        seats: 12,
        deadline: "Mar 15, 2026",
        countdown: "5d 2h"
      }
    ],
    upcoming: [
      {
        title: "Enterprise Sales Mastery: Closing 7-Figure Deals",
        speaker: "Jennifer Lopez",
        credential: "VP Sales, $500M ARR SaaS Company",
        date: "Mar 22, 2026",
        time: "15:00 GMT",
        seats: 20,
        deadline: "Mar 19, 2026",
        countdown: ""
      }
    ],
    announced: [
      {
        title: "Financial Modeling for Private Equity",
        speaker: "David Patterson",
        credential: "Managing Director, Top-tier PE Firm",
        date: "Apr 5, 2026",
        time: "13:00 GMT",
        seats: 15,
        deadline: "",
        countdown: "",
        opensOn: "Mar 20, 2026"
      }
    ]
  };

  const toggleRole = (roleId: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleContinue = () => {
    if (selectedRoles.length > 0) {
      // In production: save roles to backend
      // If Mentee role selected, go to profile setup first
      if (selectedRoles.includes("mentee")) {
        navigate("/app/mentee/profile-setup");
      } else {
        navigate("/app/dashboard");
      }
    }
  };

  const getStatusPill = (status: string) => {
    switch (status) {
      case "live":
        return <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">LIVE</span>;
      case "online":
        return <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Online</span>;
      case "instant-enabled":
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">Instant-enabled</span>;
      default:
        return null;
    }
  };

  const getStatusCTA = (status: string) => {
    switch (status) {
      case "live":
        return "Join queue";
      case "online":
        return "Start instant session";
      case "instant-enabled":
        return "Request instant";
      default:
        return "View profile";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="PhxNorth" className="h-8" />
            <span className="text-xl font-bold text-[#0A2463]">PhxNorth</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/app/profile" className="text-sm font-medium text-gray-700 hover:text-[#0A2463]">
              Profile
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Integrated Role Selection - PRIMARY FOCUS */}
      <section className="bg-gradient-to-br from-[#0A2463] to-[#0D47A1] text-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Title and Subtitle */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Welcome to PhxNorth.
            </h1>
            <p className="text-2xl text-white/90 mb-3">
              Your account is ready — choose your role to unlock your personalised dashboard.
            </p>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Your role tells us what you're here to do — so we can tailor mentors, projects, and tools to you.
            </p>
          </div>

          {/* 4 Large Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => toggleRole(role.id)}
                className={`p-8 rounded-2xl text-left transition-all duration-200 border-2 ${
                  selectedRoles.includes(role.id)
                    ? "bg-white text-gray-900 border-white shadow-2xl"
                    : "bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:border-white/40"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className={`text-2xl font-bold ${
                    selectedRoles.includes(role.id) ? "text-[#0A2463]" : "text-white"
                  }`}>
                    {role.name}
                  </h3>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedRoles.includes(role.id)
                        ? "border-[#0A2463] bg-[#0A2463]"
                        : "border-white/60"
                    }`}
                  >
                    {selectedRoles.includes(role.id) && (
                      <CheckCircle className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>
                <p className={`text-base ${
                  selectedRoles.includes(role.id) ? "text-gray-700" : "text-white/80"
                }`}>
                  {role.description}
                </p>
              </button>
            ))}
          </div>

          {/* Action Section */}
          <div className="text-center">
            <p className="text-sm text-white/80 mb-4">
              You can add or change roles anytime.
            </p>
            <button
              onClick={handleContinue}
              disabled={selectedRoles.length === 0}
              className={`px-10 py-4 rounded-lg font-bold text-lg transition-all ${
                selectedRoles.length > 0
                  ? "bg-white text-[#0A2463] hover:bg-gray-100 shadow-xl"
                  : "bg-white/20 text-white/40 cursor-not-allowed"
              }`}
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 1: Instant Mentorship — Available Now */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Instant Mentorship — Available Now
              </h2>
              <p className="text-sm text-gray-600">
                Personalised by your country, industry, and interests.
              </p>
            </div>
            <Link
              to="/app/mentors"
              className="flex items-center gap-2 text-[#0A2463] font-semibold hover:underline"
            >
              More mentors <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-3 mb-6">
            <select
              value={selectedFilters.country}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, country: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>United Kingdom</option>
              <option>United States</option>
              <option>Germany</option>
              <option>Singapore</option>
            </select>
            <select
              value={selectedFilters.availability}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, availability: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>Online now</option>
              <option>Instant-enabled</option>
            </select>
            <select
              value={selectedFilters.industry}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, industry: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>FinTech</option>
              <option>Private Equity</option>
              <option>Consulting</option>
              <option>Technology</option>
            </select>
          </div>

          {/* Mentor Grid - 4x4 = 16 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mentors.map((mentor, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {mentor.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{mentor.name}</div>
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {mentor.country}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-900 mb-1 truncate">{mentor.title}</div>
                  <div className="text-xs text-gray-600 truncate">{mentor.industry}</div>
                </div>
                <div className="mb-3">
                  {getStatusPill(mentor.status)}
                </div>
                <button className="w-full bg-[#0A2463] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#0A2463]/90 transition-colors">
                  {getStatusCTA(mentor.status)}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: Workshops — Open & Upcoming */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Workshops — Open & Upcoming</h2>
            <Link
              to="/app/workshops"
              className="flex items-center gap-2 text-[#0A2463] font-semibold hover:underline"
            >
              View all workshops <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveWorkshopTab("open")}
              className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeWorkshopTab === "open"
                  ? "border-[#0A2463] text-[#0A2463]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Open for Registration
            </button>
            <button
              onClick={() => setActiveWorkshopTab("upcoming")}
              className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeWorkshopTab === "upcoming"
                  ? "border-[#0A2463] text-[#0A2463]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveWorkshopTab("announced")}
              className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeWorkshopTab === "announced"
                  ? "border-[#0A2463] text-[#0A2463]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Announced (Not Open Yet)
            </button>
          </div>

          {/* Workshop Cards */}
          <div className="space-y-4">
            {workshops[activeWorkshopTab].map((workshop, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{workshop.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <UserIcon className="w-4 h-4" />
                        <span>{workshop.speaker}</span>
                      </div>
                      <div className="text-xs text-gray-500">{workshop.credential}</div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-700 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{workshop.date} • {workshop.time}</span>
                      </div>
                      <div className="flex items-center gap-1 text-orange-600 font-medium">
                        <Clock className="w-4 h-4" />
                        {workshop.seats} seats left
                      </div>
                    </div>
                    {workshop.deadline && (
                      <div className="text-sm text-gray-600">
                        Registration closes: <strong>{workshop.deadline}</strong>
                        {workshop.countdown && <span className="text-orange-600 ml-2">({workshop.countdown})</span>}
                      </div>
                    )}
                    {workshop.opensOn && (
                      <div className="text-sm text-gray-600">
                        Registration opens: <strong>{workshop.opensOn}</strong>
                      </div>
                    )}
                  </div>
                  <button className="bg-[#0A2463] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#0A2463]/90 transition-colors whitespace-nowrap">
                    {activeWorkshopTab === "open" && "View & Register"}
                    {activeWorkshopTab === "upcoming" && "View details"}
                    {activeWorkshopTab === "announced" && "Notify me"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}