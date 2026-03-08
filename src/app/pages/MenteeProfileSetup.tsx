import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Circle, 
  Edit2, 
  Trash2, 
  Plus, 
  ChevronDown, 
  ChevronRight,
  Eye,
  EyeOff,
  AlertCircle,
  Linkedin,
  Check,
  X,
  Sparkles,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";

type SectionStatus = "not-started" | "draft" | "verified";
type ImportMethod = "upload" | "linkedin" | "form" | null;
type ConfidenceLevel = "high" | "medium" | "low";

interface AIField {
  id: string;
  label: string;
  value: string;
  confidence: ConfidenceLevel;
  confirmed: boolean;
  required: boolean;
}

interface TimelineEntry {
  id: string;
  type: "education" | "career" | "business";
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  title: string;
  organization: string;
  hideOrganization: boolean;
  location: string;
  industryL1: string;
  industryL2: string;
  industryL3: string;
  visibility: "public" | "private";
}

interface ModularSection {
  id: string;
  type: "certification" | "training" | "psychometric" | "custom";
  name: string;
  issuer?: string;
  date?: string;
  visibility: "public" | "private";
}

export function MenteeProfileSetup() {
  const navigate = useNavigate();
  
  // State
  const [selectedMethod, setSelectedMethod] = useState<ImportMethod>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiFields, setAIFields] = useState<AIField[]>([]);
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  const [modularSections, setModularSections] = useState<ModularSection[]>([]);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [expandedTimeline, setExpandedTimeline] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("import");
  
  // Overview state
  const [coreIdentity, setCoreIdentity] = useState({
    firstName: "",
    lastName: "",
    currentTitle: "",
    currentOrganization: "",
    hideOrganization: false,
    country: "",
    industryL1: "",
    industryL2: "",
    yearsOfExperience: ""
  });
  const [professionalFocus, setProfessionalFocus] = useState({
    functionalExpertise: [] as string[],
    secondaryIndustries: [] as string[],
    marketsOfInterest: [] as string[],
    preferredMentorGeography: "",
    careerDirection: ""
  });
  const [visibilitySettings, setVisibilitySettings] = useState({
    globalVisibility: "public" as "public" | "private" | "custom",
    showCurrentCompany: true,
    showFullCareerTimeline: true,
    allowEnterpriseView: true,
    allowMentorDiscovery: true
  });
  const [completionChecklist, setCompletionChecklist] = useState({
    coreIdentityConfirmed: false,
    industrySelected: false,
    timelineEntry: false,
    privacyReviewed: false
  });
  
  const sections = [
    { id: "import", label: "Import or Build Profile", status: "draft" as SectionStatus, completion: 100, weight: 0 },
    { id: "overview", label: "Overview", status: "draft" as SectionStatus, completion: 0, weight: 0 },
    { id: "education", label: "Education Timeline", status: "not-started" as SectionStatus, completion: 0, weight: 20 },
    { id: "career", label: "Career Timeline", status: "not-started" as SectionStatus, completion: 0, weight: 30 },
    { id: "business", label: "Business / Projects", status: "not-started" as SectionStatus, completion: 0, weight: 25 },
    { id: "certifications", label: "Certifications", status: "not-started" as SectionStatus, completion: 0, weight: 10 },
    { id: "training", label: "Professional Training", status: "not-started" as SectionStatus, completion: 0, weight: 5 },
    { id: "psychometric", label: "Psychometric Tests", status: "not-started" as SectionStatus, completion: 0, weight: 5 },
    { id: "privacy", label: "Privacy Settings", status: "not-started" as SectionStatus, completion: 0, weight: 5 }
  ];

  // Calculate overall completion percentage
  const totalWeight = sections.filter(s => s.weight && s.weight > 0).reduce((sum, s) => sum + (s.weight || 0), 0);
  const completedWeight = sections
    .filter(s => s.weight && s.weight > 0)
    .reduce((sum, s) => sum + ((s.completion || 0) * (s.weight || 0) / 100), 0);
  const overallCompletion = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;

  // Industry taxonomy
  const industryTaxonomy = {
    "Financial Services": ["Asset Management", "Investment Banking", "Wealth Management", "FinTech", "Insurance"],
    "Technology": ["SaaS", "AI/ML", "Cybersecurity", "Data Infrastructure", "Hardware"],
    "Healthcare & Life Sciences": ["MedTech", "Biotech", "Pharma", "Digital Health", "Providers"],
    "Energy & Utilities": ["Renewables", "Oil & Gas", "Power Grid", "Energy Trading"],
    "Real Estate & Construction": ["Construction", "Architecture", "Infrastructure", "Property Development"],
    "Consumer & Retail": ["E-commerce", "Luxury", "FMCG", "Fashion", "Food & Beverage"],
    "Media & Telecom": ["Broadcasting", "Streaming", "Telecommunications", "Publishing", "Gaming"],
    "Industrial & Manufacturing": ["Automotive", "Aerospace", "Chemicals", "Materials", "Machinery"],
    "Transportation & Logistics": ["Shipping", "Aviation", "Supply Chain", "Warehousing", "Last-Mile"],
    "Professional Services": ["Consulting", "Legal", "Accounting", "Advisory", "Recruitment"],
    "Public Sector & Education": ["Government", "Non-profit", "EdTech", "Universities", "Research"]
  };

  // Mock AI parsed data
  const simulateAIParse = (method: ImportMethod) => {
    setShowAIPanel(true);
    setAIFields([
      { id: "title", label: "Current Title", value: "Senior Product Manager", confidence: "high", confirmed: false, required: true },
      { id: "company", label: "Current Company", value: "TechCorp Ltd", confidence: "high", confirmed: false, required: false },
      { id: "industryL1", label: "Industry (Level 1)", value: "Technology", confidence: "high", confirmed: false, required: true },
      { id: "industryL2", label: "Industry (Level 2)", value: "SaaS", confidence: "medium", confirmed: false, required: true },
      { id: "country", label: "Country", value: "United Kingdom", confidence: "high", confirmed: false, required: true },
      { id: "city", label: "City", value: "London", confidence: "medium", confirmed: false, required: false }
    ]);
  };

  const handleMethodSelect = (method: ImportMethod) => {
    setSelectedMethod(method);
    if (method === "upload") {
      // Trigger file upload
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,.doc,.docx,.txt";
      input.onchange = () => simulateAIParse(method);
      input.click();
    } else if (method === "linkedin") {
      // Simulate LinkedIn import
      setTimeout(() => simulateAIParse(method), 1000);
    } else if (method === "form") {
      // Navigate to form view
      setActiveSection("overview");
    }
  };

  const toggleFieldConfirmation = (fieldId: string) => {
    setAIFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, confirmed: !field.confirmed } : field
    ));
  };

  const updateFieldValue = (fieldId: string, value: string) => {
    setAIFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, value } : field
    ));
  };

  const allRequiredConfirmed = () => {
    return aiFields.filter(f => f.required).every(f => f.confirmed);
  };

  const getConfidenceBadge = (confidence: ConfidenceLevel) => {
    const styles = {
      high: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-orange-100 text-orange-800"
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${styles[confidence]}`}>
        {confidence.charAt(0).toUpperCase() + confidence.slice(1)} confidence
      </span>
    );
  };

  const getStatusIcon = (status: SectionStatus) => {
    if (status === "verified") return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (status === "draft") return <Edit2 className="w-4 h-4 text-blue-600" />;
    return <Circle className="w-4 h-4 text-gray-300" />;
  };

  const completeness = 35; // Mock completeness percentage

  const addTimelineEntry = (type: "education" | "career" | "business") => {
    const newEntry: TimelineEntry = {
      id: `${type}-${Date.now()}`,
      type,
      startDate: "",
      endDate: "",
      isCurrent: false,
      title: "",
      organization: "",
      hideOrganization: false,
      location: "",
      industryL1: "",
      industryL2: "",
      industryL3: "",
      visibility: "public"
    };
    setTimelineEntries([...timelineEntries, newEntry]);
    setExpandedTimeline(newEntry.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* LEFT SIDEBAR - Always Visible */}
      <aside className="w-80 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto flex flex-col">
        <div className="p-6 border-b border-gray-200">
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Setup</h2>
          
          {/* Completeness Meter */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Profile completeness</span>
              <span className="text-sm font-semibold text-[#0A2463]">{overallCompletion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#0A2463] h-2 rounded-full transition-all duration-300"
                style={{ width: `${overallCompletion}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sections List */}
        <nav className="p-4">
          <ul className="space-y-1">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${
                    activeSection === section.id
                      ? "bg-blue-50 text-[#0A2463] font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {getStatusIcon(section.status)}
                    <span>{section.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {section.weight && section.weight > 0 && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        section.completion === 100 ? "bg-green-100 text-green-700" :
                        section.completion > 0 ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-500"
                      }`}>
                        {section.completion}%
                      </span>
                    )}
                    {(section.id === "certifications" || section.id === "training" || section.id === "psychometric") && (
                      <Plus className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>

          <button 
            onClick={() => setShowAddSectionModal(true)}
            className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#0A2463] hover:text-[#0A2463] transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </button>
        </nav>

        {/* Save/Continue Actions */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="space-y-2">
            <button 
              onClick={() => navigate("/app/dashboard")}
              disabled={!allRequiredConfirmed() && showAIPanel}
              className={`w-full px-4 py-3 rounded-lg font-bold text-sm transition-colors ${
                allRequiredConfirmed() || !showAIPanel
                  ? "bg-[#0A2463] text-white hover:bg-[#0A2463]/90"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue to 5D Analysis
            </button>
            <button className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm">
              Save Draft
            </button>
            <button className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm">
              Skip for now
            </button>
          </div>
          {showAIPanel && !allRequiredConfirmed() && (
            <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Confirm required fields to continue
            </p>
          )}
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          {/* Header - Only for Import section */}
          {activeSection === "import" && (
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Build Your 5D Profile</h1>
              <p className="text-lg text-gray-600">Import fast, review AI suggestions, and confirm accuracy.</p>
            </div>
          )}

          {/* Upload / Import / Fill Methods */}
          {activeSection === "import" && !showAIPanel && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Upload Local */}
              <button
                onClick={() => handleMethodSelect("upload")}
                className={`p-6 border-2 rounded-xl text-left hover:border-[#0A2463] hover:shadow-lg transition-all ${
                  selectedMethod === "upload" ? "border-[#0A2463] bg-blue-50" : "border-gray-200"
                }`}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-[#0A2463]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Upload Local</h3>
                <p className="text-sm text-gray-600 mb-4">
                  We'll extract timelines and classify industries automatically.
                </p>
                <div className="text-xs text-gray-500">Accept: PDF, DOCX, TXT</div>
              </button>

              {/* Import LinkedIn */}
              <button
                onClick={() => handleMethodSelect("linkedin")}
                className={`p-6 border-2 rounded-xl text-left hover:border-[#0A2463] hover:shadow-lg transition-all ${
                  selectedMethod === "linkedin" ? "border-[#0A2463] bg-blue-50" : "border-gray-200"
                }`}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Linkedin className="w-6 h-6 text-[#0A2463]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Import LinkedIn</h3>
                <p className="text-sm text-gray-600 mb-4">
                  We import positions, education, skills. You approve before saving.
                </p>
                <div className="text-xs text-[#0A2463] font-semibold">Connect LinkedIn →</div>
              </button>

              {/* Fill with PhxNorth Form */}
              <button
                onClick={() => handleMethodSelect("form")}
                className={`p-6 border-2 rounded-xl text-left hover:border-[#0A2463] hover:shadow-lg transition-all ${
                  selectedMethod === "form" ? "border-[#0A2463] bg-blue-50" : "border-gray-200"
                }`}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-[#0A2463]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Fill with PhxNorth Form</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Structured inputs = stronger matching + enterprise opportunities.
                </p>
                <div className="text-xs text-[#0A2463] font-semibold">Start guided form →</div>
              </button>
            </div>
          )}

          {/* AI Parsed Draft Panel */}
          {showAIPanel && activeSection === "import" && (
            <div className="bg-white border-2 border-blue-200 rounded-xl p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Parsed Draft (Review & Confirm)</h2>
                  <p className="text-sm text-gray-600">
                    Confirm each field before proceeding. You control visibility. Mentors and enterprises only see what you allow.
                  </p>
                </div>
                <button 
                  onClick={() => setShowAIPanel(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {aiFields.map((field) => (
                  <div 
                    key={field.id} 
                    className={`border-2 rounded-lg p-4 ${
                      field.confirmed ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <label className="font-semibold text-gray-900">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {getConfidenceBadge(field.confidence)}
                        </div>
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) => updateFieldValue(field.id, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button className="p-2 text-gray-400 hover:text-blue-600">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.confirmed}
                        onChange={() => toggleFieldConfirmation(field.id)}
                        className="w-5 h-5 text-[#0A2463] border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Confirm this is correct</span>
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span>
                    {aiFields.filter(f => f.required && f.confirmed).length} of {aiFields.filter(f => f.required).length} required fields confirmed
                  </span>
                </div>
                {allRequiredConfirmed() && (
                  <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    Ready to continue
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Career Timeline Section */}
          {activeSection === "career" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Career Timeline</h2>
                <button
                  onClick={() => addTimelineEntry("career")}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0A2463] text-white rounded-lg hover:bg-[#0A2463]/90 font-semibold text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Entry
                </button>
              </div>

              {timelineEntries.filter(e => e.type === "career").length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="mb-4">No career entries yet</p>
                  <button
                    onClick={() => addTimelineEntry("career")}
                    className="text-[#0A2463] font-semibold hover:underline"
                  >
                    Add your first entry
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {timelineEntries.filter(e => e.type === "career").map((entry) => (
                    <div key={entry.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setExpandedTimeline(expandedTimeline === entry.id ? null : entry.id)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          {expandedTimeline === entry.id ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">
                              {entry.title || "New Career Entry"}
                            </div>
                            <div className="text-sm text-gray-600">
                              {entry.organization || "Organization not specified"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {entry.visibility === "public" ? (
                            <Eye className="w-4 h-4 text-green-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {expandedTimeline === entry.id && (
                        <div className="px-6 py-4 border-t border-gray-200 space-y-4">
                          {/* Date Range */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                              <input
                                type="month"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                              <input
                                type="month"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                disabled={entry.isCurrent}
                              />
                              <label className="flex items-center gap-2 mt-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm text-gray-600">Currently working here</span>
                              </label>
                            </div>
                          </div>

                          {/* Title */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Job Title <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., Senior Product Manager"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          {/* Organization with Privacy Toggle */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                            <input
                              type="text"
                              placeholder="e.g., TechCorp Ltd"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              disabled={entry.hideOrganization}
                            />
                            <label className="flex items-center gap-2 mt-2">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm text-gray-600">Hide company name</span>
                            </label>
                            {entry.hideOrganization && (
                              <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Industry classification required when company is hidden
                              </p>
                            )}
                          </div>

                          {/* Industry Classification - Cascading */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Industry (Level 1) <span className="text-red-500">*</span>
                              </label>
                              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Select sector...</option>
                                {Object.keys(industryTaxonomy).map(sector => (
                                  <option key={sector} value={sector}>{sector}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Industry (Level 2) <span className="text-red-500">*</span>
                              </label>
                              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Select sub-sector...</option>
                                {/* Dynamically populated based on Level 1 selection */}
                              </select>
                            </div>
                          </div>

                          {/* Location */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input
                              type="text"
                              placeholder="e.g., London, United Kingdom"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          {/* Visibility Control */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                              <option value="public">Public</option>
                              <option value="private">Private</option>
                            </select>
                          </div>

                          {/* Actions */}
                          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                            <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold text-sm">
                              Delete Entry
                            </button>
                            <button className="px-4 py-2 bg-[#0A2463] text-white rounded-lg hover:bg-[#0A2463]/90 font-semibold text-sm">
                              Save Entry
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Education Timeline */}
          {activeSection === "education" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Education Timeline</h2>
                <button
                  onClick={() => addTimelineEntry("education")}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0A2463] text-white rounded-lg hover:bg-[#0A2463]/90 font-semibold text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Entry
                </button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p>Education timeline entries will appear here</p>
              </div>
            </div>
          )}

          {/* Business/Projects Timeline */}
          {activeSection === "business" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Business / Projects Timeline</h2>
                <button
                  onClick={() => addTimelineEntry("business")}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0A2463] text-white rounded-lg hover:bg-[#0A2463]/90 font-semibold text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Entry
                </button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p>Business and project entries will appear here</p>
              </div>
            </div>
          )}

          {/* OVERVIEW SECTION - AI SNAPSHOT */}
          {activeSection === "overview" && (
            <div className="space-y-6">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Your 5D Snapshot</h1>
                <p className="text-lg text-gray-600">AI-generated summary — confirm, refine, and control visibility.</p>
              </div>

              {/* CARD 1 — Signature Tags (AI) */}
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-6 h-6 text-[#0A2463]" />
                  <h2 className="text-2xl font-bold text-gray-900">Your Signature Tags</h2>
                </div>

                <div className="space-y-4">
                  {/* Strengths */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Strengths</h3>
                    <div className="flex flex-wrap gap-2">
                      {["Strategic Operator", "Execution-Driven", "Cross-border", "High-velocity"].map((tag, idx) => (
                        <div key={idx} className="group relative">
                          <button className="px-4 py-2 bg-blue-50 text-[#0A2463] rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-100 flex items-center gap-2">
                            <span>{tag}</span>
                            <span className="text-xs text-blue-600">92%</span>
                          </button>
                          <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                            Derived from Career + Projects + Workshops
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Domain / Industry Signals */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Domain / Industry Signals</h3>
                    <div className="flex flex-wrap gap-2">
                      {["FinTech", "SaaS", "Asset Management", "AI/ML Infrastructure"].map((tag, idx) => (
                        <div key={idx} className="group relative">
                          <button className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200 hover:bg-green-100 flex items-center gap-2">
                            <span>{tag}</span>
                            <span className="text-xs text-green-600">88%</span>
                          </button>
                          <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                            Derived from Career + Projects + Workshops
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Decision & Risk Style */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Decision & Risk Style</h3>
                    <div className="flex flex-wrap gap-2">
                      {["High-conviction", "Risk-calibrated", "Evidence-led", "First-principles"].map((tag, idx) => (
                        <div key={idx} className="group relative">
                          <button className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200 hover:bg-purple-100 flex items-center gap-2">
                            <span>{tag}</span>
                            <span className="text-xs text-purple-600">85%</span>
                          </button>
                          <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                            Derived from Career + Projects + Workshops
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Collaboration / Communication */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Collaboration / Communication</h3>
                    <div className="flex flex-wrap gap-2">
                      {["Direct communicator", "Stakeholder-led", "Consensus-builder", "Remote-first"].map((tag, idx) => (
                        <div key={idx} className="group relative">
                          <button className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-medium border border-orange-200 hover:bg-orange-100 flex items-center gap-2">
                            <span>{tag}</span>
                            <span className="text-xs text-orange-600">90%</span>
                          </button>
                          <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                            Derived from Career + Projects + Workshops
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Tags are AI-generated from your profile data. Hide or edit any tag.
                  </p>
                  <button className="text-sm font-semibold text-[#0A2463] hover:underline flex items-center gap-1">
                    <RefreshCw className="w-4 h-4" />
                    Refresh tags
                  </button>
                </div>
              </div>

              {/* CARD 2 — Education Snapshot */}
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Education Snapshot</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-[#0A2463]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">MSc in Computer Science</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Imperial College London · 2018-2020</p>
                      
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">AI Academic Summary</p>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li>• Quant-focused training with machine learning specialization</li>
                          <li>• Research exposure in distributed systems</li>
                          <li>• Leadership roles in hackathon organization</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveSection("education")}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:border-[#0A2463] hover:text-[#0A2463] font-semibold transition-colors"
                >
                  View & edit Education Timeline
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* CARD 3 — Career Snapshot */}
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Career Snapshot</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">Senior Product Manager</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <p className="text-sm text-gray-600">TechCorp Ltd</p>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">Technology → SaaS</span>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">AI Career Summary</p>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li>• Leading cross-functional team of 12 across EMEA</li>
                          <li>• Delivered 3 major product launches with 40% revenue growth</li>
                          <li>• Scaled user base from 50K to 500K in 18 months</li>
                          <li>• Rapid progression from PM to Senior PM in 2 years</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveSection("career")}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:border-[#0A2463] hover:text-[#0A2463] font-semibold transition-colors"
                >
                  View & edit Career Timeline
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* CARD 4 — Innovation & Projects */}
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Innovation & Projects</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: "AI Compliance Tool", role: "Founder", industry: "FinTech", outcome: "Acquired by RegTech Inc" },
                    { name: "Mentorship Platform MVP", role: "Product Lead", industry: "EdTech", outcome: "5K users in 3 months" },
                    { name: "Cross-border Payments", role: "Advisor", industry: "FinTech", outcome: "$2M seed raised" }
                  ].map((project, idx) => (
                    <div key={idx} className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#0A2463] transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-700 rounded">
                          {project.industry}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">{project.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{project.role}</p>
                      <p className="text-xs text-green-600 font-semibold">✓ {project.outcome}</p>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setActiveSection("business")}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:border-[#0A2463] hover:text-[#0A2463] font-semibold transition-colors"
                >
                  View & edit Business / Projects
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* BOTTOM ACTION BAR */}
              <div className="bg-white rounded-xl border-2 border-[#0A2463] p-6 sticky bottom-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                      Last updated: <span className="font-semibold">2 hours ago</span>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold text-sm">
                      <RefreshCw className="w-4 h-4" />
                      AI refresh
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        const nextIncomplete = sections.find(s => s.completion < 100 && s.weight && s.weight > 0);
                        if (nextIncomplete) setActiveSection(nextIncomplete.id);
                      }}
                      className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Continue building profile →
                    </button>
                    <button 
                      disabled={sections.find(s => s.id === "career")?.completion === 0}
                      className={`px-6 py-3 rounded-lg font-bold transition-colors ${
                        sections.find(s => s.id === "career")?.completion > 0
                          ? "bg-[#0A2463] text-white hover:bg-[#0A2463]/90"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Run 5D Analysis
                    </button>
                  </div>
                </div>
                
                {sections.find(s => s.id === "career")?.completion === 0 && (
                  <p className="text-xs text-orange-600 mt-3 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Complete Career Timeline and review Privacy Settings to unlock 5D Analysis
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Section Modal */}
      {showAddSectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add to your profile</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left hover:border-[#0A2463] hover:bg-blue-50 transition-colors">
                <div className="font-semibold text-gray-900">Certifications</div>
                <div className="text-sm text-gray-600">CFA, ACCA, PMP, AWS, etc.</div>
              </button>
              <button className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left hover:border-[#0A2463] hover:bg-blue-50 transition-colors">
                <div className="font-semibold text-gray-900">Professional Training</div>
                <div className="text-sm text-gray-600">Courses, workshops, bootcamps</div>
              </button>
              <button className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left hover:border-[#0A2463] hover:bg-blue-50 transition-colors">
                <div className="font-semibold text-gray-900">Psychometric Tests</div>
                <div className="text-sm text-gray-600">DISC, MBTI, Big Five, etc.</div>
              </button>
              <button className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left hover:border-[#0A2463] hover:bg-blue-50 transition-colors">
                <div className="font-semibold text-gray-900">Custom Section</div>
                <div className="text-sm text-gray-600">Name your own section</div>
              </button>
            </div>
            <button
              onClick={() => setShowAddSectionModal(false)}
              className="w-full mt-4 px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}