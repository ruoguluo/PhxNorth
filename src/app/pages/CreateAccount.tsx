import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowRight, ArrowLeft, Check, Shield } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

// Industry taxonomy data
const industryData = {
  'Technology': {
    'Software': ['SaaS', 'AI / Machine Learning', 'Cybersecurity', 'Enterprise Software', 'Developer Tools'],
    'Hardware': ['Semiconductors', 'IoT', 'Consumer Electronics', 'Networking Equipment'],
    'FinTech': ['Payments', 'Digital Banking', 'Blockchain', 'InsurTech']
  },
  'Finance': {
    'Investment Banking': ['M&A Advisory', 'Capital Markets', 'Corporate Finance'],
    'Asset Management': ['Institutional', 'Retail', 'Hedge Funds'],
    'Private Equity': ['Buyout', 'Growth Equity', 'Venture Capital'],
    'Wealth Management': ['Private Banking', 'Family Office', 'Financial Planning']
  },
  'Healthcare': {
    'Pharmaceuticals': ['Drug Development', 'Clinical Research', 'Manufacturing'],
    'Medical Devices': ['Diagnostics', 'Surgical Instruments', 'Monitoring Equipment'],
    'Biotech': ['Genomics', 'Bioinformatics', 'Cell Therapy'],
    'Healthcare IT': ['EMR Systems', 'Telemedicine', 'Health Analytics']
  },
  'Energy & Infrastructure': {
    'Renewable Energy': ['Solar', 'Wind', 'Hydro', 'Geothermal'],
    'Oil & Gas': ['Upstream', 'Midstream', 'Downstream'],
    'Utilities': ['Electric', 'Water', 'Gas Distribution'],
    'Construction & Engineering': ['Civil Engineering', 'Infrastructure', 'Project Management']
  },
  'Consumer & Retail': {
    'FMCG': ['Food Products', 'Personal Care', 'Household Goods'],
    'E-commerce': ['Marketplace', 'Direct-to-Consumer', 'B2B E-commerce'],
    'Luxury': ['Fashion', 'Jewelry', 'Automotive'],
    'Food & Beverage': ['Restaurants', 'Packaged Foods', 'Beverages']
  },
  'Manufacturing': {
    'Automotive': ['OEM', 'Suppliers', 'Electric Vehicles'],
    'Aerospace': ['Commercial', 'Defense', 'Space'],
    'Industrial Equipment': ['Machinery', 'Tools', 'Automation'],
    'Chemicals': ['Specialty Chemicals', 'Petrochemicals', 'Agricultural']
  },
  'Professional Services': {
    'Consulting': ['Strategy', 'Operations', 'Technology', 'HR'],
    'Legal': ['Corporate Law', 'Litigation', 'IP', 'Compliance'],
    'Accounting': ['Audit', 'Tax', 'Advisory'],
    'Executive Search': ['C-Suite', 'Board Advisory', 'Succession Planning']
  }
};

const degreeOptions = ['Bachelor', 'Master', 'MBA', 'PhD', 'Executive Education'];
const experienceOptions = ['1–3 years', '3–5 years', '5–10 years', '10+ years'];
const countries = [
  'United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Singapore',
  'Hong Kong', 'United Arab Emirates', 'Australia', 'Japan', 'China', 'India',
  'Switzerland', 'Netherlands', 'Sweden', 'South Korea', 'Brazil', 'Mexico'
];

const fieldsOfStudy = [
  'Business Administration', 'Finance', 'Economics', 'Computer Science', 'Engineering',
  'Data Science', 'Marketing', 'Operations Management', 'Healthcare Management',
  'Law', 'International Relations', 'Political Science', 'Psychology', 'Education',
  'Design', 'Architecture', 'Mathematics', 'Physics', 'Biology', 'Chemistry'
];

export function CreateAccount() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Step 1 - Basic Information
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [keepNamePrivate, setKeepNamePrivate] = useState(false);
  const [status, setStatus] = useState<'studying' | 'professional' | ''>('');
  const [degreeLevel, setDegreeLevel] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');

  // Step 2 - Location
  const [currentCountry, setCurrentCountry] = useState('');
  const [interestedCountries, setInterestedCountries] = useState<string[]>([]);

  // Step 3 - Industry
  const [selectedMajorIndustry, setSelectedMajorIndustry] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedSubSector, setSelectedSubSector] = useState('');
  const [interestedIndustries, setInterestedIndustries] = useState<string[]>([]);

  // Step 4 - Security
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register({
        email,
        password,
        username,
        full_name: fullName,
        role: 'mentee',
        keep_name_private: keepNamePrivate,
        status: status || undefined,
        degree_level: degreeLevel || undefined,
        field_of_study: fieldOfStudy || undefined,
        years_experience: yearsExperience || undefined,
        current_country: currentCountry || undefined,
        interested_countries: interestedCountries.length > 0 ? interestedCountries : undefined,
        industry: selectedMajorIndustry || undefined,
        sector: selectedSector || undefined,
        sub_sector: selectedSubSector || undefined,
        interested_industries: interestedIndustries.length > 0 ? interestedIndustries : undefined,
      });
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/welcome');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  const toggleInterestedCountry = (country: string) => {
    setInterestedCountries(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  const toggleInterestedIndustry = (industry: string) => {
    setInterestedIndustries(prev =>
      prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
    );
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A2463] via-[#0D47A1] to-[#0A2463] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-12 max-w-md w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Account Created!</h2>
          <p className="text-gray-600 mb-6">
            Please verify your email to activate your account.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2463] via-[#0D47A1] to-[#0A2463] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold text-white">PhxNorth</h1>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">Create Your Account</h2>
          <p className="text-blue-200">Join the AI-native human capital infrastructure</p>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= i ? 'bg-white text-[#0A2463]' : 'bg-white/20 text-white/60'
                  }`}>
                  {i}
                </div>
                {i < 4 && (
                  <div className={`flex-1 h-1 mx-2 rounded transition-colors ${step > i ? 'bg-white' : 'bg-white/20'
                    }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-white/80">
            <span className={step === 1 ? 'font-semibold text-white' : ''}>Basic Info</span>
            <span className={step === 2 ? 'font-semibold text-white' : ''}>Location</span>
            <span className={step === 3 ? 'font-semibold text-white' : ''}>Industry</span>
            <span className={step === 4 ? 'font-semibold text-white' : ''}>Security</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h3>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2463] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Legal Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2463] focus:border-transparent"
                        required
                      />
                      <label className="flex items-center mt-3 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={keepNamePrivate}
                          onChange={(e) => setKeepNamePrivate(e.target.checked)}
                          className="mr-2 w-4 h-4 text-[#0A2463] border-gray-300 rounded focus:ring-[#0A2463]"
                        />
                        Keep my real name private
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#0A2463] transition-colors">
                          <input
                            type="radio"
                            name="status"
                            value="studying"
                            checked={status === 'studying'}
                            onChange={(e) => setStatus('studying')}
                            className="mt-1 mr-3"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">Currently Studying</div>
                            {status === 'studying' && (
                              <div className="mt-4 space-y-3 pl-1">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Degree Level <span className="text-red-500">*</span>
                                  </label>
                                  <select
                                    value={degreeLevel}
                                    onChange={(e) => setDegreeLevel(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2463]"
                                    required
                                  >
                                    <option value="">Select degree level</option>
                                    {degreeOptions.map((deg) => (
                                      <option key={deg} value={deg}>{deg}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Major / Field of Study <span className="text-red-500">*</span>
                                  </label>
                                  <select
                                    value={fieldOfStudy}
                                    onChange={(e) => setFieldOfStudy(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2463]"
                                    required
                                  >
                                    <option value="">Select field of study</option>
                                    {fieldsOfStudy.map((field) => (
                                      <option key={field} value={field}>{field}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        </label>

                        <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#0A2463] transition-colors">
                          <input
                            type="radio"
                            name="status"
                            value="professional"
                            checked={status === 'professional'}
                            onChange={(e) => setStatus('professional')}
                            className="mt-1 mr-3"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">Working Professional</div>
                            {status === 'professional' && (
                              <div className="mt-4 pl-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Years of Experience <span className="text-red-500">*</span>
                                </label>
                                <select
                                  value={yearsExperience}
                                  onChange={(e) => setYearsExperience(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2463]"
                                  required
                                >
                                  <option value="">Select experience range</option>
                                  {experienceOptions.map((exp) => (
                                    <option key={exp} value={exp}>{exp}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location & Market Focus */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Location & Market Focus</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    This helps us match you with relevant mentors, projects, and enterprise opportunities. You can update this anytime.
                  </p>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Country / Region <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={currentCountry}
                        onChange={(e) => setCurrentCountry(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2463]"
                        required
                      >
                        <option value="">Select your current country</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Interested Countries / Markets
                      </label>
                      <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto bg-gray-50">
                        <div className="space-y-2">
                          {countries.map((country) => (
                            <label key={country} className="flex items-center text-sm cursor-pointer hover:bg-white p-2 rounded transition-colors">
                              <input
                                type="checkbox"
                                checked={interestedCountries.includes(country)}
                                onChange={() => toggleInterestedCountry(country)}
                                className="mr-3 w-4 h-4 text-[#0A2463] border-gray-300 rounded focus:ring-[#0A2463]"
                              />
                              <span className="text-gray-700">{country}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {interestedCountries.length > 0 && (
                        <p className="text-sm text-gray-600 mt-2">
                          {interestedCountries.length} {interestedCountries.length === 1 ? 'country' : 'countries'} selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Industry Selection */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Industry Selection</h3>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Industry <span className="text-red-500">*</span>
                      </label>

                      {/* Major Industry */}
                      <select
                        value={selectedMajorIndustry}
                        onChange={(e) => {
                          setSelectedMajorIndustry(e.target.value);
                          setSelectedSector('');
                          setSelectedSubSector('');
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2463] mb-3"
                        required
                      >
                        <option value="">Select major industry</option>
                        {Object.keys(industryData).map((industry) => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>

                      {/* Sector */}
                      {selectedMajorIndustry && (
                        <select
                          value={selectedSector}
                          onChange={(e) => {
                            setSelectedSector(e.target.value);
                            setSelectedSubSector('');
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2463] mb-3"
                          required
                        >
                          <option value="">Select sector</option>
                          {Object.keys(industryData[selectedMajorIndustry as keyof typeof industryData]).map((sector) => (
                            <option key={sector} value={sector}>{sector}</option>
                          ))}
                        </select>
                      )}

                      {/* Sub-sector */}
                      {selectedSector && (
                        <select
                          value={selectedSubSector}
                          onChange={(e) => setSelectedSubSector(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2463]"
                          required
                        >
                          <option value="">Select sub-sector</option>
                          {industryData[selectedMajorIndustry as keyof typeof industryData][selectedSector as keyof typeof industryData[keyof typeof industryData]].map((subSector: string) => (
                            <option key={subSector} value={subSector}>{subSector}</option>
                          ))}
                        </select>
                      )}

                      {selectedMajorIndustry && selectedSector && selectedSubSector && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Selected:</span> {selectedMajorIndustry} → {selectedSector} → {selectedSubSector}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Interested Industries (Optional)
                      </label>
                      <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto bg-gray-50">
                        <div className="space-y-2">
                          {Object.keys(industryData).map((industry) => (
                            <label key={industry} className="flex items-center text-sm cursor-pointer hover:bg-white p-2 rounded transition-colors">
                              <input
                                type="checkbox"
                                checked={interestedIndustries.includes(industry)}
                                onChange={() => toggleInterestedIndustry(industry)}
                                className="mr-3 w-4 h-4 text-[#0A2463] border-gray-300 rounded focus:ring-[#0A2463]"
                              />
                              <span className="text-gray-700 font-medium">{industry}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {interestedIndustries.length > 0 && (
                        <p className="text-sm text-gray-600 mt-2">
                          {interestedIndustries.length} {interestedIndustries.length === 1 ? 'industry' : 'industries'} selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Account Security */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-[#0A2463]/10 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-[#0A2463]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Account Security</h3>
                      <p className="text-sm text-gray-600">Create your login credentials</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2463] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2463] focus:border-transparent"
                        required
                        minLength={8}
                      />
                      <p className="text-xs text-gray-500 mt-2">Must be at least 8 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2463] focus:border-transparent"
                        required
                      />
                      {confirmPassword && password !== confirmPassword && (
                        <p className="text-xs text-red-600 mt-2">Passwords do not match</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Already have an account?
                </Link>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-[#0A2463] text-white px-8 py-3 rounded-lg hover:bg-[#0A2463]/90 transition-colors font-semibold"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={password !== confirmPassword}
                  className="flex items-center gap-2 bg-[#0A2463] text-white px-8 py-3 rounded-lg hover:bg-[#0A2463]/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Account
                  <Check className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-200 text-sm">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-white underline hover:text-blue-100">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-white underline hover:text-blue-100">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}