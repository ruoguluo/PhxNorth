import { useState } from 'react';
import { Link } from 'react-router';
import { Settings, TrendingUp, Users, Bell, Save, MapPin, Briefcase, Building2, Target, Award } from 'lucide-react';
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";

export function TalentMobilityPreferences() {
  const [preferences, setPreferences] = useState({
    countries: [] as string[],
    markets: [] as string[],
    industries: [] as string[],
    functions: [] as string[],
    seniority: [] as string[],
  });

  const countryOptions = ['United States', 'United Kingdom', 'Canada', 'Germany', 'Singapore', 'Australia', 'UAE', 'Hong Kong'];
  const marketOptions = ['North America', 'Europe', 'Asia Pacific', 'Middle East', 'Latin America'];
  const industryOptions = ['Technology', 'Financial Services', 'Healthcare', 'Manufacturing', 'Retail', 'Energy', 'Professional Services', 'Media & Entertainment'];
  const functionOptions = ['Engineering', 'Product Management', 'Sales', 'Marketing', 'Operations', 'Finance', 'Human Resources', 'Strategy'];
  const seniorityOptions = ['Senior Individual Contributor', 'Manager', 'Senior Manager', 'Director', 'Senior Director', 'VP', 'SVP', 'C-Level'];

  const toggleSelection = (category: keyof typeof preferences, value: string) => {
    setPreferences(prev => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const handleSave = () => {
    // In real app, this would save to backend
    alert('Preferences saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 backdrop-blur-sm bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="PhxNorth" className="h-8" />
            <span className="text-xl font-bold text-[#0A2463]">PhxNorth</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-[#0A2463] transition-colors">
              Log In
            </Link>
            <Link to="/role-selection" className="bg-[#0A2463] text-white px-6 py-2.5 rounded-lg hover:bg-[#0A2463]/90 transition-all text-sm font-semibold shadow-md hover:shadow-lg">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-[73px] self-start">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-gray-900">Talent Mobility</h3>
            </div>
            
            <nav className="space-y-1">
              <Link
                to="/talent-mobility-portal/preferences"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">My Preferences</span>
              </Link>
              
              <Link
                to="/talent-mobility-portal/campaigns"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Users className="w-4 h-4" />
                <span className="text-sm font-semibold">Active Campaigns</span>
              </Link>
              
              <Link
                to="/talent-mobility-portal/referrals"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">Referral Progress</span>
              </Link>
              
              <Link
                to="/talent-mobility-portal/notifications"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="text-sm font-semibold">Notifications</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Focus Configuration</h1>
              <p className="text-lg text-gray-600">
                You will receive real-time opportunity alerts based on your selected focus areas. Preferences can be updated anytime.
              </p>
            </div>

            <div className="space-y-8">
              {/* Country / Region */}
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Country / Region</h3>
                    <p className="text-sm text-gray-600">Select target geographies</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {countryOptions.map(country => (
                    <button
                      key={country}
                      onClick={() => toggleSelection('countries', country)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        preferences.countries.includes(country)
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              </div>

              {/* Market */}
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Market</h3>
                    <p className="text-sm text-gray-600">Select regional markets</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {marketOptions.map(market => (
                    <button
                      key={market}
                      onClick={() => toggleSelection('markets', market)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        preferences.markets.includes(market)
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {market}
                    </button>
                  ))}
                </div>
              </div>

              {/* Industry */}
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Industry</h3>
                    <p className="text-sm text-gray-600">Select industry preferences</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {industryOptions.map(industry => (
                    <button
                      key={industry}
                      onClick={() => toggleSelection('industries', industry)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        preferences.industries.includes(industry)
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>

              {/* Function / Role Type */}
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Function / Role Type</h3>
                    <p className="text-sm text-gray-600">Select functional areas</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {functionOptions.map(func => (
                    <button
                      key={func}
                      onClick={() => toggleSelection('functions', func)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        preferences.functions.includes(func)
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {func}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seniority Level */}
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-teal-100 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Seniority Level</h3>
                    <p className="text-sm text-gray-600">Select target role levels</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {seniorityOptions.map(level => (
                    <button
                      key={level}
                      onClick={() => toggleSelection('seniority', level)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        preferences.seniority.includes(level)
                          ? 'bg-teal-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-10 flex justify-end">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 bg-[#0A2463] text-white px-10 py-4 rounded-xl hover:bg-[#0A2463]/90 transition-all font-bold shadow-lg hover:shadow-xl hover:scale-105 duration-300"
              >
                <Save className="w-5 h-5" />
                Save Preferences
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
