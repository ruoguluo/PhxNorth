import { Link } from "react-router";
import { Brain, Users, BookOpen, Calendar, BarChart3, Shield, CheckCircle, ArrowRight, Building2, User, Network, Sparkles, FileCheck, Layers, TrendingUp, Zap, Target, Lock, ChevronRight, ChevronDown, Search, Check } from "lucide-react";
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";

export function Landing() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("United Kingdom");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start animation on component mount
    setIsAnimating(true);
  }, []);

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (isCountryDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isCountryDropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
        setSearchQuery("");
        setFocusedIndex(-1);
      }
    };

    if (isCountryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCountryDropdownOpen]);

  // Global country list
  const allCountries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", 
    "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Belarus", "Belgium", "Belize", "Benin",
    "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
    "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic",
    "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba",
    "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominican Republic", "Ecuador", "Egypt",
    "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji",
    "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Guatemala",
    "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India",
    "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
    "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
    "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova",
    "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nepal",
    "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
    "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
    "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Lucia", "Samoa",
    "San Marino", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
    "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan",
    "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
    "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
    "Turkey", "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
    "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
    "Yemen", "Zambia", "Zimbabwe"
  ];

  const popularCountries = [
    "United Kingdom", "United States", "Germany", "United Arab Emirates", 
    "Singapore", "Canada", "France", "China", "Japan", "India"
  ];

  // Talent data organized by country
  const talentByCountry: Record<string, Array<{ name: string; country: string; title: string; industry: string }>> = {
    "United Kingdom": [
      { name: 'Daniel', country: 'UK', title: 'Investment Director', industry: 'Private Equity' },
      { name: 'Oliver', country: 'UK', title: 'M&A Partner', industry: 'Corporate Finance' },
      { name: 'Emma', country: 'UK', title: 'Chief Strategy Officer', industry: 'Retail' },
      { name: 'James', country: 'UK', title: 'Head of Engineering', industry: 'FinTech' },
      { name: 'Charlotte', country: 'UK', title: 'VP Operations', industry: 'E-commerce' },
      { name: 'William', country: 'UK', title: 'Senior Consultant', industry: 'Healthcare' },
    ],
    "United States": [
      { name: 'Marcus', country: 'USA', title: 'Strategy Consultant', industry: 'Healthcare' },
      { name: 'Sarah', country: 'USA', title: 'VP Product', industry: 'SaaS' },
      { name: 'David', country: 'USA', title: 'Portfolio Manager', industry: 'Asset Management' },
      { name: 'Jennifer', country: 'USA', title: 'Tech Lead', industry: 'AI / ML' },
      { name: 'Michael', country: 'USA', title: 'Operations Director', industry: 'Logistics' },
      { name: 'Emily', country: 'USA', title: 'Investment VP', industry: 'Venture Capital' },
    ],
    "Germany": [
      { name: 'Elena', country: 'Germany', title: 'Head of Digital', industry: 'Automotive' },
      { name: 'Klaus', country: 'Germany', title: 'Engineering Manager', industry: 'Manufacturing' },
      { name: 'Anna', country: 'Germany', title: 'Strategy Lead', industry: 'Industrial Tech' },
      { name: 'Stefan', country: 'Germany', title: 'Product Director', industry: 'Smart Mobility' },
      { name: 'Lisa', country: 'Germany', title: 'Innovation VP', industry: 'Energy' },
      { name: 'Thomas', country: 'Germany', title: 'Tech Architect', industry: 'Enterprise Software' },
    ],
    "Singapore": [
      { name: 'Sophia', country: 'Singapore', title: 'VP Strategy', industry: 'FinTech' },
      { name: 'Wei', country: 'Singapore', title: 'Investment Manager', industry: 'Private Equity' },
      { name: 'Li', country: 'Singapore', title: 'Chief Data Officer', industry: 'Banking' },
      { name: 'Kevin', country: 'Singapore', title: 'Head of Digital', industry: 'Insurance' },
      { name: 'Rachel', country: 'Singapore', title: 'Strategy Director', industry: 'Wealth Management' },
      { name: 'Jonathan', country: 'Singapore', title: 'Tech VP', industry: 'PropTech' },
    ],
    "United Arab Emirates": [
      { name: 'Amir', country: 'UAE', title: 'Senior Engineer', industry: 'Renewable Energy' },
      { name: 'Ahmed', country: 'UAE', title: 'Operations Director', industry: 'Oil & Gas' },
      { name: 'Fatima', country: 'UAE', title: 'Investment Lead', industry: 'Real Estate' },
      { name: 'Omar', country: 'UAE', title: 'Strategy Consultant', industry: 'Infrastructure' },
      { name: 'Layla', country: 'UAE', title: 'VP Commercial', industry: 'Aviation' },
      { name: 'Khalid', country: 'UAE', title: 'Tech Director', industry: 'Smart Cities' },
    ],
    "India": [
      { name: 'Priya', country: 'India', title: 'Product Lead', industry: 'AI / Machine Learning' },
      { name: 'Rahul', country: 'India', title: 'Engineering Manager', industry: 'SaaS' },
      { name: 'Ananya', country: 'India', title: 'Strategy Director', industry: 'FinTech' },
      { name: 'Arjun', country: 'India', title: 'VP Technology', industry: 'E-commerce' },
      { name: 'Kavya', country: 'India', title: 'Operations Head', industry: 'Logistics' },
      { name: 'Rohan', country: 'India', title: 'Data Science Lead', industry: 'Healthcare Tech' },
    ],
    "Canada": [
      { name: 'James', country: 'Canada', title: 'Portfolio Manager', industry: 'Asset Management' },
      { name: 'Sophie', country: 'Canada', title: 'VP Engineering', industry: 'Clean Tech' },
      { name: 'Lucas', country: 'Canada', title: 'Strategy Director', industry: 'Mining' },
      { name: 'Emma', country: 'Canada', title: 'Operations Lead', industry: 'E-commerce' },
      { name: 'Noah', country: 'Canada', title: 'Investment Director', industry: 'Real Estate' },
      { name: 'Olivia', country: 'Canada', title: 'Product Manager', industry: 'FinTech' },
    ],
    "France": [
      { name: 'Charlotte', country: 'France', title: 'M&A Associate', industry: 'Investment Banking' },
      { name: 'Louis', country: 'France', title: 'Head of Strategy', industry: 'Luxury Goods' },
      { name: 'Amelie', country: 'France', title: 'VP Operations', industry: 'Aerospace' },
      { name: 'Pierre', country: 'France', title: 'Tech Director', industry: 'SaaS' },
      { name: 'Marie', country: 'France', title: 'Innovation Lead', industry: 'Retail' },
      { name: 'Antoine', country: 'France', title: 'Investment Manager', industry: 'Private Equity' },
    ],
    "China": [
      { name: 'Wei', country: 'China', title: 'Tech Architect', industry: 'SaaS' },
      { name: 'Li', country: 'China', title: 'VP Engineering', industry: 'E-commerce' },
      { name: 'Zhang', country: 'China', title: 'Strategy Director', industry: 'Manufacturing' },
      { name: 'Wang', country: 'China', title: 'Operations Head', industry: 'Logistics' },
      { name: 'Liu', country: 'China', title: 'Product Director', industry: 'FinTech' },
      { name: 'Chen', country: 'China', title: 'Investment Manager', industry: 'Venture Capital' },
    ],
    "Japan": [
      { name: 'Yuki', country: 'Japan', title: 'Operations Director', industry: 'Manufacturing' },
      { name: 'Takashi', country: 'Japan', title: 'Engineering Manager', industry: 'Automotive' },
      { name: 'Sakura', country: 'Japan', title: 'Product Lead', industry: 'Robotics' },
      { name: 'Hiroshi', country: 'Japan', title: 'Strategy Director', industry: 'Electronics' },
      { name: 'Aiko', country: 'Japan', title: 'VP Innovation', industry: 'Consumer Tech' },
      { name: 'Kenji', country: 'Japan', title: 'Investment Director', industry: 'Private Equity' },
    ],
    "All Countries": [
      { name: 'Sophia', country: 'Singapore', title: 'VP Strategy', industry: 'FinTech' },
      { name: 'Daniel', country: 'UK', title: 'Investment Director', industry: 'Private Equity' },
      { name: 'Amir', country: 'UAE', title: 'Senior Engineer', industry: 'Renewable Energy' },
      { name: 'Elena', country: 'Germany', title: 'Head of Digital', industry: 'Automotive' },
      { name: 'Marcus', country: 'USA', title: 'Strategy Consultant', industry: 'Healthcare' },
      { name: 'Priya', country: 'India', title: 'Product Lead', industry: 'AI / Machine Learning' },
      { name: 'James', country: 'Canada', title: 'Portfolio Manager', industry: 'Asset Management' },
      { name: 'Yuki', country: 'Japan', title: 'Operations Director', industry: 'Manufacturing' },
      { name: 'Isabella', country: 'Brazil', title: 'Commercial Lead', industry: 'E-commerce' },
      { name: 'Ahmed', country: 'Saudi Arabia', title: 'Engineering Manager', industry: 'Oil & Gas' },
      { name: 'Charlotte', country: 'France', title: 'M&A Associate', industry: 'Investment Banking' },
      { name: 'Wei', country: 'China', title: 'Tech Architect', industry: 'SaaS' },
    ],
  };

  // Filter countries based on search query
  const filteredCountries = allCountries.filter(country =>
    country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Build the options list: selected country (if matches search), popular (if match search), then rest
  const getDisplayedCountries = () => {
    if (searchQuery.trim() === "") {
      // No search: show popular first, then all
      const nonPopular = allCountries.filter(c => !popularCountries.includes(c));
      return { popular: popularCountries, rest: nonPopular };
    } else {
      // With search: filter both
      const popular = popularCountries.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      const rest = filteredCountries.filter(c => !popularCountries.includes(c));
      return { popular, rest };
    }
  };

  const { popular, rest } = getDisplayedCountries();
  const allDisplayed = [...popular, ...rest];

  const handleCountryChange = (country: string) => {
    setIsFading(true);
    setSearchQuery("");
    setFocusedIndex(-1);
    setTimeout(() => {
      setSelectedCountry(country);
      setIsCountryDropdownOpen(false);
      setIsFading(false);
    }, 300);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isCountryDropdownOpen) return;

    if (e.key === "Escape") {
      setIsCountryDropdownOpen(false);
      setSearchQuery("");
      setFocusedIndex(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex(prev => Math.min(prev + 1, allDisplayed.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      handleCountryChange(allDisplayed[focusedIndex]);
    }
  };

  const currentTalentData = talentByCountry[selectedCountry] || talentByCountry["All Countries"];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 backdrop-blur-sm bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="PhxNorth" className="h-8" />
            <span className="text-xl font-bold text-[#0A2463]">PhxNorth</span>
          </Link>
          
          {/* Main Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/individuals" className="text-sm font-semibold text-gray-700 hover:text-[#0A2463] transition-colors">
              Individuals
            </Link>
            <Link to="/mentors" className="text-sm font-semibold text-gray-700 hover:text-[#0A2463] transition-colors">
              For Mentors
            </Link>
            <Link to="/enterprises" className="text-sm font-semibold text-gray-700 hover:text-[#0A2463] transition-colors">
              For Enterprises
            </Link>
            <Link to="/how-it-works" className="text-sm font-semibold text-gray-700 hover:text-[#0A2463] transition-colors">
              How It Works
            </Link>
            <Link to="/why-phxnorth" className="text-sm font-semibold text-gray-700 hover:text-[#0A2463] transition-colors">
              Why PhxNorth
            </Link>
          </div>

          {/* Auth CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login-type-selection" className="text-sm font-semibold text-gray-700 hover:text-[#0A2463] transition-colors">
              Log In
            </Link>
            <Link to="/account-type-selection" className="bg-[#0A2463] text-white px-6 py-2.5 rounded-lg hover:bg-[#0A2463]/90 transition-all text-sm font-semibold shadow-md hover:shadow-lg">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0A2463] via-[#0D47A1] to-[#0A2463] text-white overflow-hidden">
        {/* Subtle radial glow in center */}
        <div className="absolute inset-0 bg-radial-glow opacity-30" style={{
          background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'
        }} />
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2463]/80 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative">
          <div className="text-center max-w-5xl mx-auto">
            {/* Top Label - Elite Positioning */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full mb-10 border border-white/20">
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span className="text-sm font-semibold tracking-wide">AI-Native Human Capital Infrastructure</span>
            </div>
            
            {/* Main Headline - Elite Performance */}
            <div className="relative mb-10">
              {/* Subtle lighting effect behind headline */}
              <div className="absolute inset-0 blur-3xl opacity-40" style={{
                background: 'radial-gradient(ellipse at center, rgba(96, 165, 250, 0.4) 0%, transparent 60%)'
              }} />
              
              <h1 className="relative text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
                <div className="mb-2">From 5D Intelligence</div>
                <div className="bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent">
                  to Enterprise Impact.
                </div>
              </h1>
            </div>
            
            {/* Subtitle - Direct and Clear */}
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-4xl mx-auto font-medium">
              AI-powered 5D mentorship. Global talent mobility. Strategic commercial advisory.
            </p>
            
            {/* Three Service Entry Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-5xl mx-auto">
              {/* 5D Mentorship */}
              <Link to="/how-it-works#mentorship" className="group">
                <div className="w-full bg-white text-[#0A2463] px-8 py-6 rounded-xl transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-2 border-b-4 border-blue-600">
                  {/* Title with arrow */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">5D Mentorship</h3>
                    <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    AI-powered 5D profile matching with structured question guidance and mentorship planning for continuous personal and professional growth.
                  </p>
                </div>
              </Link>

              {/* Talent Mobility */}
              <Link to="/enterprises#talent-mobility" className="group">
                <div className="w-full bg-white text-[#0A2463] px-8 py-6 rounded-xl transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-2 border-b-4 border-emerald-600">
                  {/* Title with arrow */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Global Talent Mobility</h3>
                    <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    A proactive talent mobility platform using 5D matching and structured referral management to accelerate global hiring and talent discovery.
                  </p>
                </div>
              </Link>

              {/* Commercial Advisory */}
              <Link to="/enterprises#advisory" className="group">
                <div className="w-full bg-white text-[#0A2463] px-8 py-6 rounded-xl transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-2 border-b-4 border-purple-600">
                  {/* Title with arrow */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Commercial Advisory</h3>
                    <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Enterprise consulting powered by 5D matching to connect companies with proven experts for practical, execution-driven advisory.
                  </p>
                </div>
              </Link>
            </div>
            
            {/* Auth Links - Two Balanced Lines */}
            <div className="space-y-2">
              <p className="text-blue-200 text-sm">
                New here?{" "}
                <Link to="/account-type-selection" className="text-white underline hover:text-blue-100 font-medium">
                  Create an account
                </Link>
              </p>
              <p className="text-blue-200 text-sm">
                Already have an account?{" "}
                <Link to="/login-type-selection" className="text-white underline hover:text-blue-100 font-medium">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* Floating elements - subtle */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl" />
      </section>

      {/* Global Talent Is Joining Now Banner */}
      <section className="py-8 px-6 bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#3B82F6] overflow-hidden">
        {/* Header Center */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-3xl font-bold text-white tracking-wide">GLOBAL TALENT IS JOINING NOW</h3>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold text-white tracking-wide">LIVE</span>
              </div>
            </div>
            
            {/* Country Filter Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  setIsCountryDropdownOpen(!isCountryDropdownOpen);
                  if (!isCountryDropdownOpen) {
                    setSearchQuery("");
                    setFocusedIndex(-1);
                  }
                }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 hover:bg-white/15 transition-all duration-200"
              >
                <span className="text-sm font-medium text-white">{selectedCountry}</span>
                <ChevronDown className="w-4 h-4 text-white" />
              </button>
              
              {isCountryDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 overflow-hidden"
                  onKeyDown={handleKeyDown}
                >
                  {/* Search Input */}
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search country…"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setFocusedIndex(-1);
                        }}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Options List */}
                  <div className="max-h-80 overflow-y-auto">
                    {allDisplayed.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-gray-500">
                        No matches
                      </div>
                    ) : (
                      <>
                        {/* Popular Section */}
                        {popular.length > 0 && (
                          <div>
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                              Popular
                            </div>
                            {popular.map((country, idx) => {
                              const globalIdx = idx;
                              const isSelected = selectedCountry === country;
                              const isFocused = focusedIndex === globalIdx;
                              return (
                                <button
                                  key={`popular-${country}`}
                                  onClick={() => handleCountryChange(country)}
                                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between group ${
                                    isFocused ? 'bg-blue-50' : 'hover:bg-gray-50'
                                  } ${isSelected ? 'text-blue-700 font-semibold' : 'text-gray-700'}`}
                                >
                                  <span>{country}</span>
                                  {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                        
                        {/* Divider */}
                        {popular.length > 0 && rest.length > 0 && (
                          <div className="border-t border-gray-200 my-1" />
                        )}
                        
                        {/* Rest of Countries */}
                        {rest.length > 0 && (
                          <div>
                            {rest.map((country, idx) => {
                              const globalIdx = popular.length + idx;
                              const isSelected = selectedCountry === country;
                              const isFocused = focusedIndex === globalIdx;
                              return (
                                <button
                                  key={`rest-${country}`}
                                  onClick={() => handleCountryChange(country)}
                                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between group ${
                                    isFocused ? 'bg-blue-50' : 'hover:bg-gray-50'
                                  } ${isSelected ? 'text-blue-700 font-semibold' : 'text-gray-700'}`}
                                >
                                  <span>{country}</span>
                                  {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Scroll Row - Seamless Infinite Loop */}
        <div className="relative overflow-hidden">
          {/* Fade masks for premium edge effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#2563EB] via-[#2563EB]/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#3B82F6] via-[#3B82F6]/80 to-transparent z-10 pointer-events-none" />
          
          <div 
            className={`flex gap-4 transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}
            style={{ 
              width: 'fit-content',
              animation: 'scroll-seamless 60s linear infinite'
            }}
          >
            {/* First complete set */}
            {currentTalentData.map((person, idx) => (
              <a
                key={`talent-a-${idx}`}
                href={`/profile/${person.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex-shrink-0 bg-white rounded-lg px-5 py-3 w-[260px] shadow-[0_4px_12px_rgba(37,99,235,0.3)] transition-all duration-300 hover:shadow-[0_6px_16px_rgba(37,99,235,0.4)] hover:-translate-y-1 cursor-pointer"
              >
                <p className="text-gray-900 font-semibold text-sm mb-0.5">
                  {person.name} · {person.country}
                </p>
                <p className="text-gray-600 text-xs">
                  {person.title} · {person.industry}
                </p>
              </a>
            ))}
            
            {/* Exact duplicate for seamless loop */}
            {currentTalentData.map((person, idx) => (
              <a
                key={`talent-b-${idx}`}
                href={`/profile/${person.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex-shrink-0 bg-white rounded-lg px-5 py-3 w-[260px] shadow-[0_4px_12px_rgba(37,99,235,0.3)] transition-all duration-300 hover:shadow-[0_6px_16px_rgba(37,99,235,0.4)] hover:-translate-y-1 cursor-pointer"
              >
                <p className="text-gray-900 font-semibold text-sm mb-0.5">
                  {person.name} · {person.country}
                </p>
                <p className="text-gray-600 text-xs">
                  {person.title} · {person.industry}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 5D Intelligence Engine Section */}
      <section id="individuals" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          
          {/* Above the blue section - Bold Headline */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              We Know You in 5D.
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-2xl text-gray-800 font-medium mb-2">Beyond skills. Beyond keywords.</p>
              <p className="text-2xl text-gray-800 font-medium">We map how you think, decide, execute, and grow.</p>
            </div>
          </div>

          {/* Core 5D Profile - Blue System Module */}
          <div className="mb-16">
            <div className="relative bg-gradient-to-br from-[#0A2463] to-[#0D47A1] p-12 rounded-2xl">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-bold text-white mb-2">5D Intelligence Profile</h3>
                <p className="text-blue-200 text-base font-medium">Your Living Commercial Model</p>
              </div>
              
              <div className="grid grid-cols-5 gap-4">
                <IntelligenceDimensionCard 
                  icon={<Target className="w-8 h-8" />}
                  label="Skills" 
                  description="Technical capability & behavioral depth"
                  accentColor="blue"
                />
                <IntelligenceDimensionCard 
                  icon={<Layers className="w-8 h-8" />}
                  label="Experience" 
                  description="Industry exposure & execution history"
                  accentColor="teal"
                />
                <IntelligenceDimensionCard 
                  icon={<Brain className="w-8 h-8" />}
                  label="Decision Logic" 
                  description="How you evaluate trade-offs & make choices"
                  accentColor="violet"
                />
                <IntelligenceDimensionCard 
                  icon={<Shield className="w-8 h-8" />}
                  label="Risk Calibration" 
                  description="Tolerance, control & uncertainty patterns"
                  accentColor="amber"
                />
                <IntelligenceDimensionCard 
                  icon={<Network className="w-8 h-8" />}
                  label="Network Capital" 
                  description="Influence, relational leverage & ecosystem value"
                  accentColor="emerald"
                />
              </div>

              {/* AI Processing Indicator */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex items-center justify-center gap-2 text-blue-100 text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  <span>AI Continuously Refining</span>
                </div>
              </div>
            </div>
          </div>

          {/* Below the blue block - Commercial Positioning Layer */}
          <div>
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                The Operating System<br />for Human Capital
              </h2>
              <p className="text-2xl text-gray-800 font-medium max-w-4xl mx-auto leading-relaxed">
                We transform individuals into deployable 5D commercial intelligence — structured, governed, and built for measurable impact.
              </p>
            </div>
            
            <div id="enterprises" className="space-y-6">
              {/* Capability 1 */}
              <div className="relative bg-gradient-to-r from-gray-50 to-white border-l-4 border-[#0A2463] p-10">
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-[#0A2463] rounded flex items-center justify-center text-white font-bold text-2xl">
                        01
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">5D Identity Infrastructure</h3>
                      <p className="text-xl text-gray-800 leading-relaxed mb-2">
                        From 2D resumes to dynamic behavioral, decision, and risk intelligence.
                      </p>
                      <p className="text-xl text-gray-700 leading-relaxed">
                        Your commercial profile evolves through every mentorship and project.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Capability 2 */}
              <div className="relative bg-gradient-to-r from-gray-50 to-white border-l-4 border-[#0A2463] p-10">
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-[#0A2463] rounded flex items-center justify-center text-white font-bold text-2xl">
                        02
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">Structured Value Activation</h3>
                      <p className="text-xl text-gray-800 leading-relaxed mb-2">
                        Mentorship. Talent Mobility. Strategic Consultation.
                      </p>
                      <p className="text-xl text-gray-700 leading-relaxed">
                        Delivered through governed, consultant-grade execution frameworks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Capability 3 */}
              <div className="relative bg-gradient-to-r from-gray-50 to-white border-l-4 border-[#0A2463] p-10">
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-[#0A2463] rounded flex items-center justify-center text-white font-bold text-2xl">
                        03
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">Risk-Visible Execution Engine</h3>
                      <p className="text-xl text-gray-800 leading-relaxed mb-2">
                        Consulting and talent deployment with real-time risk visibility,
                      </p>
                      <p className="text-xl text-gray-700 leading-relaxed">
                        performance tracking, and outcome accountability.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* System Operations Flow */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Commercial Evolution with PhxNorth
            </h2>
            <p className="text-xl text-gray-600">
              One evolving 5D intelligence system. Two dynamic growth engines.
            </p>
          </div>

          {/* Human Capital Operating System - System Boundary Frame */}
          <div className="relative border-2 border-gray-300 rounded-3xl p-8 bg-gray-50/50">
            
            {/* Top Border - 5D Intelligence Core */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-[800px] bg-gradient-to-br from-[#0A2463] via-[#0D47A1] to-[#1565C0] px-10 py-6 border-4 border-[#0A2463] rounded-2xl shadow-2xl shadow-blue-900/40">
              <div className="text-center">
                <div className="w-full h-px bg-blue-300/50 mb-3"></div>
                <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">5D Intelligence Core</h3>
                <div className="w-full h-px bg-blue-300/50 mb-3"></div>
                <p className="text-sm text-blue-100 font-medium">
                  Hard Skills · Soft Skills · Decision Logic · Risk Calibration · Network Capital
                </p>
              </div>
            </div>

            <div className="space-y-8 mt-8">
              {/* Mentee Growth Engine - Blue Theme */}
              <div className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#0A2463] text-white px-4 py-2 rounded-lg font-semibold text-sm">
                    Mentee Growth Engine
                  </div>
                </div>
                <div className="grid md:grid-cols-5 gap-4 mb-6">
                  <PathCard
                    number="01"
                    title="5D Identity Activation"
                    description="CV structured into dynamic growth intelligence."
                    theme="blue"
                  />
                  <PathCard
                    number="02"
                    title="Strategic Question Framing"
                    description="From uncertainty to structured direction."
                    theme="blue"
                  />
                  <PathCard
                    number="03"
                    title="Precision 5D Matching"
                    description="Aligned by capability and decision logic."
                    theme="blue"
                  />
                  <PathCard
                    number="04"
                    title="Structured Engagement"
                    description="Choose mentorship, pathways, or projects."
                    theme="blue"
                  />
                  <PathCard
                    number="05"
                    title="Guided Growth Execution"
                    description="Personalized roadmap. Measurable evolution."
                    theme="blue"
                  />
                </div>
                <div className="text-center text-sm font-medium text-blue-900">
                  Growth compounds through structured intelligence.
                </div>
              </div>

              {/* Role Interaction Loop - Center */}
              <div className="relative py-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t-2 border-dashed border-gray-400"></div>
                </div>
                <div className="relative flex justify-center">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-10 py-5 rounded-xl shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
                        <div className="flex flex-col items-center">
                          <ArrowRight className="w-5 h-5 text-purple-600 transform -rotate-45 -mb-1" />
                          <ArrowRight className="w-5 h-5 text-blue-600 transform rotate-45 -mt-1" />
                        </div>
                      </div>
                      <div className="text-white">
                        <div className="font-bold text-xl">Role Interaction Loop</div>
                        <div className="text-sm text-white/95">Learn → Execute → Lead → Return</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mentor Commercial Engine - Purple Theme */}
              <div className="bg-purple-50 p-8 rounded-2xl border-2 border-purple-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                    Mentor Commercial Engine
                  </div>
                </div>
                <div className="grid md:grid-cols-5 gap-4 mb-6">
                  <PathCard
                    number="01"
                    title="Commercial 5D Positioning"
                    description="Expertise structured into deployable intelligence."
                    theme="purple"
                  />
                  <PathCard
                    number="02"
                    title="AI Mentor Structuring"
                    description="Experience translated into advisory clarity."
                    theme="purple"
                  />
                  <PathCard
                    number="03"
                    title="Service Architecture Control"
                    description="Design and manage engagement models."
                    theme="purple"
                  />
                  <PathCard
                    number="04"
                    title="Strategic 5D Alignment"
                    description="Matched to mentees and enterprise needs."
                    theme="purple"
                  />
                  <PathCard
                    number="05"
                    title="Reputation & Market Growth"
                    description="Authority expands into commercial opportunity."
                    theme="purple"
                  />
                </div>
                <div className="text-center text-sm font-medium text-purple-900">
                  Expertise becomes deployable intelligence.
                </div>
              </div>
            </div>

            {/* Bottom Border - Process & Outcome Governance Engine */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-[800px] bg-gradient-to-br from-[#0A2463] via-[#0D47A1] to-[#1565C0] px-10 py-6 border-4 border-[#0A2463] rounded-2xl shadow-2xl shadow-blue-900/40">
              <div className="text-center">
                <div className="w-full h-px bg-blue-300/50 mb-3"></div>
                <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">Process & Outcome Governance Engine</h3>
                <div className="w-full h-px bg-blue-300/50 mb-3"></div>
                <p className="text-sm text-blue-100 font-medium">
                  KPI Tracking · Structured Delivery · Risk Control · Audit Layer
                </p>
              </div>
            </div>

          </div>

          {/* Enterprise Value Amplification Layer - Below the Frame */}
          <div className="mt-20 relative">
            {/* Connecting Divider Line with Gradient Flow */}
            <div className="flex justify-center mb-12">
              <div className="w-px h-20 bg-gradient-to-b from-[#0A2463] via-blue-400 to-transparent"></div>
            </div>

            {/* Enterprise-Grade Background with Gradient */}
            <div className="relative bg-gradient-to-br from-[#0A2463] via-[#2563EB] to-[#475569] p-16 rounded-2xl overflow-hidden">
              {/* Soft glow behind cards */}
              <div className="absolute inset-0 bg-radial-glow opacity-20" style={{
                background: 'radial-gradient(circle at center, rgba(96, 165, 250, 0.4) 0%, transparent 70%)'
              }} />
              
              {/* Section Label */}
              <div className="text-center mb-4 relative z-10">
                <div className="inline-block text-xs font-bold tracking-widest text-blue-300 uppercase mb-3">
                  Enterprise Value Amplification
                </div>
              </div>
              
              {/* Headline - Larger and Bolder */}
              <div className="text-center mb-12 relative z-10">
                <h3 className="text-5xl font-bold text-white mb-2">Where Intelligence Converts to Enterprise Power</h3>
              </div>
              
              {/* Three Cards with Flow Indicators */}
              <div className="relative grid md:grid-cols-3 gap-8 mb-10 z-10">
                <EnterpriseValueCard 
                  icon={<Building2 className="w-8 h-8 text-[#0A2463]" />}
                  title="Enterprise Consulting Mandates" 
                  description="Strategic advisory powered by 5D intelligence."
                  borderColor="border-[#0A2463]"
                  label="Intelligence Layer"
                />
                
                {/* Flow Arrow 1 - Thicker with gradient */}
                <div className="hidden md:flex absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center shadow-lg">
                    <ArrowRight className="w-5 h-5 text-white" strokeWidth={3} />
                  </div>
                </div>
                
                <EnterpriseValueCard 
                  icon={<Network className="w-8 h-8 text-[#0A2463]" />}
                  title="Strategic Talent Deployment" 
                  description="Deploy high-precision expertise where impact matters."
                  borderColor="border-[#3B82F6]"
                  label="Deployment Layer"
                />
                
                {/* Flow Arrow 2 - Thicker with gradient */}
                <div className="hidden md:flex absolute top-1/2 left-2/3 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center shadow-lg">
                    <ArrowRight className="w-5 h-5 text-white" strokeWidth={3} />
                  </div>
                </div>
                
                <EnterpriseValueCard 
                  icon={<Shield className="w-8 h-8 text-[#0A2463]" />}
                  title="Enterprise-Level Project Governance" 
                  description="Structured execution with measurable risk control."
                  borderColor="border-[#6366F1]"
                  label="Governance Layer"
                />
              </div>
              
              <div className="text-center text-sm font-medium text-blue-200 border-t border-white/20 pt-6 relative z-10">
                Powered by 5D Intelligence and Governed Execution.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: The PhxNorth Service Ecosystem */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              The PhxNorth Service Ecosystem
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              Structured growth. Governed execution. Deployable intelligence.
            </p>
          </div>

          {/* FOR INDIVIDUALS */}
          <div id="individuals" className="mb-20">
            <div className="mb-10">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">For Individuals</h3>
              <div className="w-20 h-1 bg-[#0A2463]"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <ServiceCard
                number="01"
                title="Workshops"
                description="Insight-driven thematic sessions led by strategic mentors."
                link="/workshops"
              />
              <ServiceCard
                number="02"
                title="Instant Mentorship"
                description="On-demand 5D-aligned advisory for immediate clarity."
                link="/instant-mentorship"
              />
              <ServiceCard
                number="03"
                title="Structured Mentorship"
                description="Phased mentorship with milestones, KPIs, and progress tracking."
                link="/structured-mentorship"
              />
              <ServiceCard
                number="04"
                title="Mentorship Programs"
                description="Comprehensive development tracks with applied execution."
                link="/mentorship-programs"
              />
            </div>
          </div>

          {/* FOR ENTERPRISES */}
          <div id="enterprises">
            <div className="mb-10">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">For Enterprises</h3>
              <div className="w-20 h-1 bg-[#0A2463]"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <ServiceCard
                number="01"
                title="Global Talent Mobility Program"
                description="Precision deployment of 5D-aligned talent for high-impact objectives."
                link="/global-talent-mobility"
                enterprise
              />
              <ServiceCard
                number="02"
                title="Commercial Consultation Projects"
                description="Structured, governed consulting mandates with measurable outcomes."
                link="/commercial-consultation"
                enterprise
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: What's Happening Now */}
      <OperatingSignalsSection />

      {/* AI Compliance & Tracking */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0A2463] px-4 py-2 rounded-full mb-6">
                <Shield className="w-4 h-4" />
                <span className="text-sm">AI-Powered Safety</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Enterprise-Grade Compliance & Monitoring
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our AI continuously monitors all sessions, detects red flags, and ensures a safe, 
                professional learning environment for everyone.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time session monitoring and transcript analysis",
                  "Automated compliance scoring and alerts",
                  "Multi-level note tracking (Project / Phase / KPI)",
                  "AI-generated session summaries and action items"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <span className="text-sm">Compliance Score</span>
                  <span className="text-2xl font-bold text-green-600">98%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <span className="text-sm">Active Projects</span>
                  <span className="text-2xl font-bold text-[#0A2463]">24</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <span className="text-sm">Sessions Monitored</span>
                  <span className="text-2xl font-bold text-purple-600">1,247</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">AI Detection Status</span>
                  </div>
                  <div className="text-xs text-green-600">✓ All systems operational</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Own Your Edge - Final Brand Statement */}
      <section id="advantage" className="py-32 px-6 bg-gradient-to-br from-[#0A2463] via-[#0A2463] to-[#082050]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-6xl font-bold text-white mb-8">Own Your Edge.</h2>
            <p className="text-2xl text-blue-100">
              Turn intelligence into measurable impact.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-16 max-w-6xl mx-auto">
            <AdvantageCard
              title="Know Your Edge"
              description="See what makes you valuable — beyond skills."
            />
            <AdvantageCard
              title="Sharpen Your Decisions"
              description="Make choices backed by structured insight."
            />
            <AdvantageCard
              title="Multiply Your Impact"
              description="Turn capability into measurable outcomes."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <img src={logo} alt="PhxNorth" className="h-10" />
                <span className="text-xl font-bold text-white">PhxNorth</span>
              </div>
              <p className="text-sm text-gray-400">
                AI-powered mentorship platform for the modern learner
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © 2026 PhxNorth. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function AdvantageCard({ title, description }: { 
  title: string; 
  description: string;
}) {
  return (
    <div className="text-center">
      <h3 className="text-4xl font-bold text-white mb-6">{title}</h3>
      <p className="text-lg text-blue-100 leading-relaxed">{description}</p>
    </div>
  );
}

function FlowCard({ number, title, description }: { 
  number: string; 
  title: string; 
  description: string;
}) {
  return (
    <div className="relative bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-[#0A2463] transition-all hover:shadow-lg">
      <div className="w-12 h-12 bg-gradient-to-br from-[#0A2463] to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{title}</h3>
      <p className="text-sm text-gray-600 text-center">{description}</p>
    </div>
  );
}

function DimensionCard({ label, description }: { 
  label: string; 
  description: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg p-6 shadow-lg hover:bg-white/15 transition-all">
      <div className="text-left">
        <p className="text-base text-white font-bold mb-2 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-blue-100 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function PathCard({ number, title, description, theme }: { 
  number: string; 
  title: string; 
  description: string;
  theme?: string;
}) {
  const bgColor = theme === "blue" ? "bg-blue-500" : theme === "purple" ? "bg-purple-500" : "bg-gradient-to-br from-[#0A2463] to-blue-500";
  const textColor = theme === "blue" ? "text-blue-900" : theme === "purple" ? "text-purple-900" : "text-gray-900";
  return (
    <div className="relative bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-[#0A2463] transition-all hover:shadow-lg">
      <div className="w-12 h-12 bg-gradient-to-br from-[#0A2463] to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{title}</h3>
      <p className="text-sm text-gray-600 text-center">{description}</p>
    </div>
  );
}

function ValueCard({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-[#0A2463] transition-all hover:shadow-lg shadow-md text-center">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h4 className="text-xl font-bold text-gray-900 mb-3">{title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function IntelligenceDimensionCard({ icon, label, description, accentColor }: { 
  icon: React.ReactNode; 
  label: string; 
  description: string;
  accentColor: string;
}) {
  // Define accent-specific styling
  const colorStyles = {
    blue: {
      gradient: 'from-blue-500/10 to-blue-600/5',
      border: 'border-blue-400/40',
      iconBg: 'bg-blue-500',
      iconGlow: 'shadow-blue-500/50',
      text: 'text-blue-400'
    },
    teal: {
      gradient: 'from-teal-500/10 to-teal-600/5',
      border: 'border-teal-400/40',
      iconBg: 'bg-teal-500',
      iconGlow: 'shadow-teal-500/50',
      text: 'text-teal-400'
    },
    violet: {
      gradient: 'from-violet-500/10 to-violet-600/5',
      border: 'border-violet-400/40',
      iconBg: 'bg-violet-500',
      iconGlow: 'shadow-violet-500/50',
      text: 'text-violet-400'
    },
    amber: {
      gradient: 'from-amber-500/10 to-amber-600/5',
      border: 'border-amber-400/40',
      iconBg: 'bg-amber-500',
      iconGlow: 'shadow-amber-500/50',
      text: 'text-amber-400'
    },
    emerald: {
      gradient: 'from-emerald-500/10 to-emerald-600/5',
      border: 'border-emerald-400/40',
      iconBg: 'bg-emerald-500',
      iconGlow: 'shadow-emerald-500/50',
      text: 'text-emerald-400'
    }
  };

  const colors = colorStyles[accentColor as keyof typeof colorStyles];

  return (
    <div className={`relative bg-gradient-to-br ${colors.gradient} backdrop-blur-sm border ${colors.border} rounded-xl p-5 hover:scale-105 transition-all duration-300`}>
      {/* Icon at top with glow */}
      <div className="flex justify-center mb-4">
        <div className={`${colors.iconBg} ${colors.iconGlow} shadow-lg p-3 rounded-lg text-white`}>
          {icon}
        </div>
      </div>
      
      {/* Label */}
      <h4 className="text-sm text-white font-bold mb-2 uppercase tracking-wider text-center">{label}</h4>
      
      {/* Description */}
      <p className="text-xs text-blue-100 leading-relaxed text-center">{description}</p>
    </div>
  );
}

function EnterpriseValueCard({ icon, title, description, borderColor, label }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  borderColor: string;
  label: string;
}) {
  return (
    <div className={`relative bg-white p-8 rounded-xl border-t-[3px] ${borderColor} shadow-xl hover:shadow-2xl transition-all text-center`}>
      {/* Layer Label - Top Corner */}
      <div className="absolute top-3 right-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
        {label}
      </div>
      
      {/* Icon */}
      <div className="mb-4 flex justify-center mt-2">{icon}</div>
      
      {/* Title */}
      <h4 className="text-xl font-bold text-gray-900 mb-3">{title}</h4>
      
      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function ServiceCard({ number, title, description, link, enterprise }: { 
  number: string; 
  title: string; 
  description: string;
  link: string;
  enterprise?: boolean;
}) {
  return (
    <div className="group relative bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-[#0A2463] transition-all hover:shadow-xl">
      {/* Number Badge */}
      <div className={`absolute -top-4 left-6 w-10 h-10 ${enterprise ? 'bg-gradient-to-br from-purple-600 to-purple-700' : 'bg-gradient-to-br from-[#0A2463] to-blue-500'} rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
        {number}
      </div>
      
      {/* Enterprise Badge */}
      {enterprise && (
        <div className="absolute -top-4 right-6 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
          Enterprise
        </div>
      )}
      
      {/* Content */}
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-base text-gray-600 leading-relaxed mb-6">{description}</p>
        
        {/* Explore Button */}
        <Link
          to={link}
          className={`group inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            enterprise
              ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
              : 'bg-[#0A2463] text-white hover:bg-[#0D47A1] shadow-md hover:shadow-lg'
          }`}
        >
          Explore
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

function WorkshopCard({ title, mentor, deadline, seatsRemaining }: { 
  title: string; 
  mentor: string; 
  deadline: string;
  seatsRemaining: number;
}) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
      <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-sm text-gray-600 mb-2">Mentor: {mentor}</p>
      <p className="text-sm text-gray-600 mb-2">Deadline: {deadline}</p>
      <p className="text-sm text-gray-600">Seats Remaining: {seatsRemaining}</p>
    </div>
  );
}

function MentorAnnouncementCard({ name, title, expertise }: { 
  name: string; 
  title: string; 
  expertise: string;
}) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
      <h4 className="text-xl font-bold text-gray-900 mb-2">{name}</h4>
      <p className="text-sm text-gray-600 mb-2">Title: {title}</p>
      <p className="text-sm text-gray-600">Expertise: {expertise}</p>
    </div>
  );
}

function EnterpriseSuccessCard({ company, result, service }: { 
  company: string; 
  result: string; 
  service: string;
}) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
      <h4 className="text-xl font-bold text-gray-900 mb-2">{company}</h4>
      <p className="text-sm text-gray-600 mb-2">Result: {result}</p>
      <p className="text-sm text-gray-600">Service: {service}</p>
    </div>
  );
}

// What's Happening Now Section Component with Dynamic Animations
function OperatingSignalsSection() {
  // Workshop carousel state
  const [workshopScrollX, setWorkshopScrollX] = useState(0);
  const [isWorkshopHovered, setIsWorkshopHovered] = useState(false);

  // Mentor carousel state
  const [currentMentorIndex, setCurrentMentorIndex] = useState(0);

  // Positions carousel state
  const [positionScrollX, setPositionScrollX] = useState(0);
  const [isPositionHovered, setIsPositionHovered] = useState(false);

  // Success stories carousel state
  const [currentSuccessIndex, setCurrentSuccessIndex] = useState(0);

  // Testimonial carousel state
  const [currentTestimonialType, setCurrentTestimonialType] = useState<'individual' | 'enterprise'>('individual');

  const workshops = [
    { title: "Strategic Decision-Making in Uncertain Markets", mentor: "Dr. Sarah Chen", deadline: "2 days", seatsRemaining: 8 },
    { title: "AI-Driven Business Model Innovation", mentor: "Michael Rodriguez", deadline: "5 days", seatsRemaining: 3 },
    { title: "Enterprise Risk Calibration Frameworks", mentor: "Prof. James Anderson", deadline: "1 week", seatsRemaining: 12 },
    { title: "Digital Transformation Leadership", mentor: "Lisa Thompson", deadline: "3 days", seatsRemaining: 15 },
    { title: "Scaling SaaS Operations", mentor: "James Park", deadline: "6 days", seatsRemaining: 7 },
  ];

  const mentors = [
    { name: "Elena Vasquez", title: "Former VP of Strategy at Fortune 500", expertise: "Corporate Strategy, M&A, Market Entry" },
    { name: "Dr. Raj Patel", title: "AI Research Lead", expertise: "Machine Learning, Data Architecture, AI Ethics" },
    { name: "Amanda Foster", title: "Serial Entrepreneur & Investor", expertise: "Venture Capital, Product-Market Fit, Growth Strategy" },
  ];

  const positions = [
    { 
      roleTitle: "VP of Operations", 
      region: "EMEA / Remote", 
      industry: "Enterprise SaaS", 
      description: "Scaling operations for a fast-growing B2B platform serving Fortune 1000 clients. Focus on process excellence and cross-functional alignment.",
      confidential: true
    },
    { 
      roleTitle: "Head of Product Strategy", 
      region: "North America", 
      industry: "Fintech", 
      description: "Leading product vision for next-generation payment infrastructure. Requires deep understanding of regulatory landscape and enterprise client needs.",
      confidential: false
    },
    { 
      roleTitle: "Chief Technology Officer", 
      region: "Asia-Pacific", 
      industry: "Healthcare Tech", 
      description: "Driving technology roadmap for AI-powered diagnostic platform. Managing distributed engineering teams and strategic technology partnerships.",
      confidential: true
    },
    { 
      roleTitle: "Director of Business Development", 
      region: "Global / Remote", 
      industry: "Logistics & Supply Chain", 
      description: "Building strategic partnerships and revenue channels for innovative supply chain optimization platform serving major retail and manufacturing clients.",
      confidential: false
    },
    { 
      roleTitle: "VP of Data & Analytics", 
      region: "North America", 
      industry: "E-commerce", 
      description: "Leading data intelligence strategy for high-growth e-commerce platform. Building advanced analytics capabilities to drive business optimization.",
      confidential: true
    },
  ];

  const successStories = [
    { company: "TechCorp Global", result: "40% reduction in project delivery time", service: "Strategic Talent Campaign" },
    { company: "FinServe Partners", result: "$2.4M cost optimization identified", service: "Enterprise Advisory Project" },
    { company: "BioHealth Systems", result: "3 strategic hires in 6 weeks", service: "Strategic Talent Campaign" },
  ];

  const testimonials = {
    individual: [
      {
        quote: "PhxNorth didn't just match me with a mentor—it structured my entire commercial evolution. The 5D profiling revealed decision patterns I didn't know I had.",
        name: "Jennifer Kim",
        role: "Product Manager → VP of Product",
        initials: "JK",
        gradient: "from-blue-500 to-purple-500"
      },
      {
        quote: "The structured mentorship transformed how I approach strategic decisions. Every session builds on the last, creating compound intelligence growth.",
        name: "Marcus Chen",
        role: "Software Engineer → Tech Lead",
        initials: "MC",
        gradient: "from-cyan-500 to-blue-500"
      }
    ],
    enterprise: [
      {
        quote: "We've tried traditional consulting and recruitment. PhxNorth is neither—it's a talent operating system. Measurable, governed, and backed by real intelligence.",
        name: "David Martinez",
        role: "Chief Operations Officer, Enterprise SaaS",
        initials: "DM",
        gradient: "from-purple-500 to-indigo-500"
      },
      {
        quote: "PhxNorth delivers what traditional talent pipelines can't: precision 5D alignment. The ROI on strategic placements has been exceptional.",
        name: "Sarah Williams",
        role: "VP of Talent, Global Consulting Firm",
        initials: "SW",
        gradient: "from-indigo-500 to-purple-600"
      }
    ]
  };

  // Workshop auto-scroll animation
  useEffect(() => {
    if (!isWorkshopHovered) {
      const interval = setInterval(() => {
        setWorkshopScrollX((prev) => (prev + 1) % 100);
      }, 50); // Smooth slow motion
      return () => clearInterval(interval);
    }
  }, [isWorkshopHovered]);

  // Mentor rotation every 6-8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMentorIndex((prev) => (prev + 1) % mentors.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [mentors.length]);

  // Positions auto-scroll animation
  useEffect(() => {
    if (!isPositionHovered) {
      const interval = setInterval(() => {
        setPositionScrollX((prev) => (prev + 1) % 100);
      }, 50); // Smooth slow motion
      return () => clearInterval(interval);
    }
  }, [isPositionHovered]);

  // Success stories fade transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuccessIndex((prev) => (prev + 1) % successStories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [successStories.length]);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialType((prev) => prev === 'individual' ? 'enterprise' : 'individual');
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            What's Happening Now
          </h2>
          <p className="text-xl text-gray-600 font-medium">
            Real-time updates from the PhxNorth platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* 1. Upcoming Workshops - Horizontal Auto-Scroll */}
          <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-8 overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-[#0A2463]" />
              <h3 className="text-2xl font-bold text-gray-900">Upcoming Workshops</h3>
            </div>
            <div 
              className="overflow-hidden"
              onMouseEnter={() => setIsWorkshopHovered(true)}
              onMouseLeave={() => setIsWorkshopHovered(false)}
            >
              <motion.div 
                className="flex gap-4"
                animate={{
                  x: isWorkshopHovered ? undefined : -workshopScrollX * 4
                }}
                transition={{
                  duration: 0.3,
                  ease: "linear"
                }}
                style={{ width: `${workshops.length * 350}px` }}
              >
                {[...workshops, ...workshops].map((workshop, idx) => (
                  <motion.div
                    key={idx}
                    className="flex-shrink-0 w-[330px] bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-[#0A2463] hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{workshop.title}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{workshop.mentor}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-600 font-semibold">{workshop.deadline}</span>
                        </div>
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                          {workshop.seatsRemaining} seats
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* 2. New Mentor Announcements - Horizontal Scroll with Slide */}
          <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-8 overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-[#0A2463]" />
              <h3 className="text-2xl font-bold text-gray-900">New Mentor Announcements</h3>
            </div>
            <div className="relative h-[180px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMentorIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ 
                    duration: 0.6,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0"
                >
                  <div className="bg-white border border-gray-200 rounded-xl p-6 h-full">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#0A2463] to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {mentors[currentMentorIndex].name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-1">{mentors[currentMentorIndex].name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{mentors[currentMentorIndex].title}</p>
                        <div className="flex flex-wrap gap-2">
                          {mentors[currentMentorIndex].expertise.split(', ').map((skill, idx) => (
                            <span key={idx} className="bg-blue-50 text-[#0A2463] px-2 py-1 rounded text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Pagination Dots */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                {mentors.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === currentMentorIndex ? 'bg-[#0A2463] w-6' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. New Open Positions - Horizontal Auto-Scroll */}
        <div className="mb-8">
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">New Open Positions</h3>
            <p className="text-gray-600">Recently launched enterprise hiring campaigns.</p>
          </div>
          <div 
            className="overflow-hidden"
            onMouseEnter={() => setIsPositionHovered(true)}
            onMouseLeave={() => setIsPositionHovered(false)}
          >
            <motion.div 
              className="flex gap-4"
              animate={{
                x: isPositionHovered ? undefined : -positionScrollX * 4
              }}
              transition={{
                duration: 0.3,
                ease: "linear"
              }}
              style={{ width: `${positions.length * 380}px` }}
            >
              {[...positions, ...positions].map((position, idx) => (
                <motion.div
                  key={idx}
                  className="relative flex-shrink-0 w-[360px] bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:border-[#0A2463] hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Platform Managed Label */}
                  <div className="absolute top-4 right-4 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Platform Managed
                  </div>
                  
                  {/* Role Title */}
                  <h4 className="text-xl font-bold text-gray-900 mb-4 pr-32 leading-tight">{position.roleTitle}</h4>
                  
                  {/* Metadata */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{position.region}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{position.industry}</span>
                    </div>
                  </div>

                  {/* Confidential Search Tag */}
                  {position.confidential && (
                    <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full text-xs font-semibold mb-3">
                      <Lock className="w-3 h-3" />
                      Confidential Search
                    </div>
                  )}
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-5 line-clamp-3">
                    {position.description}
                  </p>
                  
                  {/* Footer Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#0A2463] text-white rounded-lg font-medium text-sm hover:bg-[#0D47A1] transition-colors">
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors">
                      Express Interest
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* 4. Enterprise Success Stories - Controlled Fade Transition */}
        <div className="bg-gradient-to-br from-[#0A2463] to-[#0D47A1] rounded-2xl p-10 mb-8 overflow-hidden">
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="w-7 h-7 text-white" />
            <h3 className="text-3xl font-bold text-white">Enterprise Success Stories</h3>
          </div>
          <div className="relative h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSuccessIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.8,
                  ease: "easeInOut"
                }}
                className="absolute inset-0"
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        {successStories[currentSuccessIndex].company.split(' ')[0][0]}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-gray-900 mb-3">{successStories[currentSuccessIndex].company}</h4>
                      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-3">
                        <p className="text-lg font-bold text-green-700">{successStories[currentSuccessIndex].result}</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Service:</span> {successStories[currentSuccessIndex].service}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Pagination Dots */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
              {successStories.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentSuccessIndex ? 'bg-white w-6' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 5. Testimonials - Auto-Rotating Carousel */}
        <div className="relative h-[280px] overflow-hidden">
          <AnimatePresence mode="wait">
            {currentTestimonialType === 'individual' ? (
              <motion.div
                key="individual"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 1,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 grid md:grid-cols-2 gap-8"
              >
                {testimonials.individual.map((testimonial, idx) => (
                  <div key={idx} className="bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-lg">
                    <div className="mb-4">
                      <div className="text-sm font-bold text-[#0A2463] uppercase tracking-wider mb-2">Individual Impact</div>
                      <div className="flex items-start gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-800 text-lg leading-relaxed mb-6 italic">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                        {testimonial.initials}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="enterprise"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 1,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 grid md:grid-cols-2 gap-8"
              >
                {testimonials.enterprise.map((testimonial, idx) => (
                  <div key={idx} className="bg-white border-2 border-purple-200 rounded-2xl p-8 shadow-lg">
                    <div className="mb-4">
                      <div className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-2">Enterprise Impact</div>
                      <div className="flex items-start gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-800 text-lg leading-relaxed mb-6 italic">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                        {testimonial.initials}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}