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
  ExternalLink,
  Loader2,
  Shield,
} from "lucide-react";
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";
import { discCvAPI, discCareerAPI } from "../../lib/disc-api";
import { useAuth } from "../../lib/auth-context";

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
  const { user } = useAuth();
  
  // State
  const [selectedMethod, setSelectedMethod] = useState<ImportMethod>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiFields, setAIFields] = useState<AIField[]>([]);
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  const [modularSections, setModularSections] = useState<ModularSection[]>([]);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [expandedTimeline, setExpandedTimeline] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("import");
  const [certifications, setCertifications] = useState<{id: string; name: string; issuer: string; date: string; expiry: string; credentialId: string; visibility: "public"|"private"}[]>([]);
  const [trainings, setTrainings] = useState<{id: string; name: string; provider: string; date: string; duration: string; type: string; visibility: "public"|"private"}[]>([]);
  const [psychTests, setPsychTests] = useState<{id: string; testType: string; date: string; result: string; provider: string; visibility: "public"|"private"}[]>([]);
  
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

  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const populateFromBackend = async () => {
    try {
      const career = await discCareerAPI.get();
      const fields: AIField[] = [];

      // Extract latest job entry as current position
      const entries = career.job_entries ?? [];
      if (entries.length > 0) {
        const latest = entries[0]; // sorted descending by date
        fields.push(
          { id: "title", label: "Current Title", value: latest.title || "", confidence: "high", confirmed: false, required: true },
          { id: "company", label: "Current Company", value: latest.company || "", confidence: "high", confirmed: false, required: false },
        );
      }

      // Analytics
      const a = career.analytics;
      if (a.distinct_roles > 0) {
        fields.push(
          { id: "roles", label: "Total Roles", value: String(a.distinct_roles), confidence: "high", confirmed: false, required: false },
          { id: "experience", label: "Total Experience", value: `${Math.round(a.total_experience_months / 12)} years`, confidence: "high", confirmed: false, required: false },
          { id: "avgTenure", label: "Avg Tenure", value: `${Math.round(a.avg_tenure_months)} months`, confidence: "medium", confirmed: false, required: false },
        );
      }

      if (a.distinct_companies > 0) {
        fields.push(
          { id: "companies", label: "Companies", value: String(a.distinct_companies), confidence: "high", confirmed: false, required: false },
        );
      }

      // If no useful fields extracted, show a note
      if (fields.length === 0) {
        fields.push(
          { id: "title", label: "Current Title", value: "", confidence: "low", confirmed: false, required: true },
          { id: "company", label: "Current Company", value: "", confidence: "low", confirmed: false, required: false },
        );
      }

      setAIFields(fields);
      setShowAIPanel(true);
    } catch {
      // If career data fetch fails, show empty fields
      setAIFields([
        { id: "title", label: "Current Title", value: "", confidence: "low", confirmed: false, required: true },
        { id: "company", label: "Current Company", value: "", confidence: "low", confirmed: false, required: false },
      ]);
      setShowAIPanel(true);
    }
  };

  const handleMethodSelect = (method: ImportMethod) => {
    setSelectedMethod(method);
    setUploadError(null);

    if (method === "upload") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,.doc,.docx,.txt";
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        setUploadLoading(true);
        setUploadError(null);
        try {
          // Upload file to DISC backend for parsing
          const result = await discCvAPI.upload(file);
          if (result.status === "failed") {
            // Try as text if file upload fails
            const text = await file.text();
            await discCvAPI.pasteText(text);
          }
          // Fetch parsed career data and populate AI fields
          await populateFromBackend();
        } catch (err) {
          setUploadError(err instanceof Error ? err.message : "Upload failed");
        } finally {
          setUploadLoading(false);
        }
      };
      input.click();
    } else if (method === "linkedin") {
      // LinkedIn import not yet implemented
      setUploadError("LinkedIn import coming soon. Please use Upload or Form instead.");
    } else if (method === "form") {
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

          {/* Loading state */}
          {uploadLoading && activeSection === "import" && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#0A2463] mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900">Parsing your CV...</p>
                <p className="text-sm text-gray-500">Extracting career data and building your profile</p>
              </div>
            </div>
          )}

          {/* Upload error */}
          {uploadError && activeSection === "import" && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800">Upload Error</p>
                <p className="text-sm text-red-700">{uploadError}</p>
              </div>
            </div>
          )}

          {/* Upload / Import / Fill Methods */}
          {activeSection === "import" && !showAIPanel && !uploadLoading && (
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

              {timelineEntries.filter(e => e.type === "education").length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="mb-4">No education entries yet</p>
                  <button
                    onClick={() => addTimelineEntry("education")}
                    className="text-[#0A2463] font-semibold hover:underline"
                  >
                    Add your first entry
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {timelineEntries.filter(e => e.type === "education").map((entry) => (
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
                              {entry.title || "New Education Entry"}
                            </div>
                            <div className="text-sm text-gray-600">
                              {entry.organization || "Institution not specified"}
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
                          {/* Degree Level */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Degree Level <span className="text-red-500">*</span>
                            </label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                              <option value="">Select degree level...</option>
                              <option value="bachelor">Bachelor</option>
                              <option value="master">Master</option>
                              <option value="mba">MBA</option>
                              <option value="phd">PhD</option>
                              <option value="executive">Executive Education</option>
                            </select>
                          </div>

                          {/* Field of Study */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Field of Study <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., Computer Science, Finance, Business Administration"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          {/* Institution */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Institution Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., Imperial College London"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

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
                                <span className="text-sm text-gray-600">Currently studying here</span>
                              </label>
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

                          {/* Visibility */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                              <option value="public">Public</option>
                              <option value="private">Private</option>
                            </select>
                          </div>

                          {/* Actions */}
                          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => setTimelineEntries(timelineEntries.filter(e => e.id !== entry.id))}
                              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold text-sm"
                            >
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

              {timelineEntries.filter(e => e.type === "business").length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="mb-4">No business or project entries yet</p>
                  <button
                    onClick={() => addTimelineEntry("business")}
                    className="text-[#0A2463] font-semibold hover:underline"
                  >
                    Add your first entry
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {timelineEntries.filter(e => e.type === "business").map((entry) => (
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
                              {entry.title || "New Project Entry"}
                            </div>
                            <div className="text-sm text-gray-600">
                              {entry.organization || "Role not specified"}
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
                          {/* Project Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Project Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., AI Compliance Tool, Mentorship Platform MVP"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          {/* Your Role */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Your Role <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., Founder, Advisor, Product Lead"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          {/* Industry */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Industry <span className="text-red-500">*</span>
                            </label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                              <option value="">Select industry...</option>
                              {Object.keys(industryTaxonomy).map(sector => (
                                <option key={sector} value={sector}>{sector}</option>
                              ))}
                            </select>
                          </div>

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
                                <span className="text-sm text-gray-600">Ongoing</span>
                              </label>
                            </div>
                          </div>

                          {/* Description/Outcome */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description / Outcome</label>
                            <textarea
                              rows={3}
                              placeholder="Describe the project and its outcome..."
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                          </div>

                          {/* Visibility */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                              <option value="public">Public</option>
                              <option value="private">Private</option>
                            </select>
                          </div>

                          {/* Actions */}
                          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => setTimelineEntries(timelineEntries.filter(e => e.id !== entry.id))}
                              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold text-sm"
                            >
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

          {/* Certifications Section */}
          {activeSection === "certifications" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
                <button
                  onClick={() => setCertifications([...certifications, { id: `cert-${Date.now()}`, name: "", issuer: "", date: "", expiry: "", credentialId: "", visibility: "public" }])}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0A2463] text-white rounded-lg hover:bg-[#0A2463]/90 font-semibold text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Certification
                </button>
              </div>

              {certifications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="mb-4">No certifications added yet</p>
                  <button
                    onClick={() => setCertifications([{ id: `cert-${Date.now()}`, name: "", issuer: "", date: "", expiry: "", credentialId: "", visibility: "public" }])}
                    className="text-[#0A2463] font-semibold hover:underline"
                  >
                    Add your first certification
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
                      {/* Certification Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Certification Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => setCertifications(certifications.map(c => c.id === cert.id ? { ...c, name: e.target.value } : c))}
                          placeholder="e.g., CFA Level III, AWS Solutions Architect"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Issuing Organization */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Issuing Organization <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => setCertifications(certifications.map(c => c.id === cert.id ? { ...c, issuer: e.target.value } : c))}
                          placeholder="e.g., CFA Institute, Amazon"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date Obtained</label>
                          <input
                            type="month"
                            value={cert.date}
                            onChange={(e) => setCertifications(certifications.map(c => c.id === cert.id ? { ...c, date: e.target.value } : c))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date (optional)</label>
                          <input
                            type="month"
                            value={cert.expiry}
                            onChange={(e) => setCertifications(certifications.map(c => c.id === cert.id ? { ...c, expiry: e.target.value } : c))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Credential ID */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Credential ID (optional)</label>
                        <input
                          type="text"
                          value={cert.credentialId}
                          onChange={(e) => setCertifications(certifications.map(c => c.id === cert.id ? { ...c, credentialId: e.target.value } : c))}
                          placeholder="e.g., ABC-123-XYZ"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Visibility */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                        <select
                          value={cert.visibility}
                          onChange={(e) => setCertifications(certifications.map(c => c.id === cert.id ? { ...c, visibility: e.target.value as "public"|"private" } : c))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                        </select>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => setCertifications(certifications.filter(c => c.id !== cert.id))}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold text-sm"
                        >
                          Delete
                        </button>
                        <button className="px-4 py-2 bg-[#0A2463] text-white rounded-lg hover:bg-[#0A2463]/90 font-semibold text-sm">
                          Save
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Professional Training Section */}
          {activeSection === "training" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Professional Training</h2>
                <button
                  onClick={() => setTrainings([...trainings, { id: `train-${Date.now()}`, name: "", provider: "", date: "", duration: "", type: "", visibility: "public" }])}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0A2463] text-white rounded-lg hover:bg-[#0A2463]/90 font-semibold text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Training
                </button>
              </div>

              {trainings.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="mb-4">No training records yet</p>
                  <button
                    onClick={() => setTrainings([{ id: `train-${Date.now()}`, name: "", provider: "", date: "", duration: "", type: "", visibility: "public" }])}
                    className="text-[#0A2463] font-semibold hover:underline"
                  >
                    Add your first training
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {trainings.map((training) => (
                    <div key={training.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
                      {/* Course/Program Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Course / Program Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={training.name}
                          onChange={(e) => setTrainings(trainings.map(t => t.id === training.id ? { ...t, name: e.target.value } : t))}
                          placeholder="e.g., Executive Leadership Program, Machine Learning Specialization"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Provider */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Provider <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={training.provider}
                          onChange={(e) => setTrainings(trainings.map(t => t.id === training.id ? { ...t, provider: e.target.value } : t))}
                          placeholder="e.g., Coursera, Harvard Business School"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={training.type}
                          onChange={(e) => setTrainings(trainings.map(t => t.id === training.id ? { ...t, type: e.target.value } : t))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select type...</option>
                          <option value="online">Online Course</option>
                          <option value="workshop">Workshop</option>
                          <option value="bootcamp">Bootcamp</option>
                          <option value="executive">Executive Program</option>
                          <option value="conference">Conference</option>
                        </select>
                      </div>

                      {/* Date and Duration */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date Completed</label>
                          <input
                            type="month"
                            value={training.date}
                            onChange={(e) => setTrainings(trainings.map(t => t.id === training.id ? { ...t, date: e.target.value } : t))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                          <input
                            type="text"
                            value={training.duration}
                            onChange={(e) => setTrainings(trainings.map(t => t.id === training.id ? { ...t, duration: e.target.value } : t))}
                            placeholder="e.g., 6 weeks, 3 months"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Visibility */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                        <select
                          value={training.visibility}
                          onChange={(e) => setTrainings(trainings.map(t => t.id === training.id ? { ...t, visibility: e.target.value as "public"|"private" } : t))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                        </select>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => setTrainings(trainings.filter(t => t.id !== training.id))}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold text-sm"
                        >
                          Delete
                        </button>
                        <button className="px-4 py-2 bg-[#0A2463] text-white rounded-lg hover:bg-[#0A2463]/90 font-semibold text-sm">
                          Save
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Psychometric Tests Section */}
          {activeSection === "psychometric" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Psychometric Tests</h2>
                <button
                  onClick={() => setPsychTests([...psychTests, { id: `psych-${Date.now()}`, testType: "", date: "", result: "", provider: "", visibility: "public" }])}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0A2463] text-white rounded-lg hover:bg-[#0A2463]/90 font-semibold text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Test
                </button>
              </div>

              {psychTests.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="mb-4">No psychometric tests added yet</p>
                  <button
                    onClick={() => setPsychTests([{ id: `psych-${Date.now()}`, testType: "", date: "", result: "", provider: "", visibility: "public" }])}
                    className="text-[#0A2463] font-semibold hover:underline"
                  >
                    Add your first test
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {psychTests.map((test) => (
                    <div key={test.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
                      {/* Test Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Test Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={test.testType}
                          onChange={(e) => setPsychTests(psychTests.map(t => t.id === test.id ? { ...t, testType: e.target.value } : t))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select test type...</option>
                          <option value="disc">DISC Assessment</option>
                          <option value="mbti">MBTI</option>
                          <option value="bigfive">Big Five / OCEAN</option>
                          <option value="strengthsfinder">StrengthsFinder</option>
                          <option value="hogan">Hogan</option>
                          <option value="shl">SHL</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>

                      {/* Provider/Platform */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Provider / Platform
                        </label>
                        <input
                          type="text"
                          value={test.provider}
                          onChange={(e) => setPsychTests(psychTests.map(t => t.id === test.id ? { ...t, provider: e.target.value } : t))}
                          placeholder="e.g., TTI Success Insights, 16Personalities"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Date Taken */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Taken</label>
                        <input
                          type="month"
                          value={test.date}
                          onChange={(e) => setPsychTests(psychTests.map(t => t.id === test.id ? { ...t, date: e.target.value } : t))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Result Summary */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Result Summary</label>
                        <textarea
                          rows={3}
                          value={test.result}
                          onChange={(e) => setPsychTests(psychTests.map(t => t.id === test.id ? { ...t, result: e.target.value } : t))}
                          placeholder='e.g., "DISC: D=72, I=45, S=68, C=81" or "MBTI: INTJ"'
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>

                      {/* Visibility */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                        <select
                          value={test.visibility}
                          onChange={(e) => setPsychTests(psychTests.map(t => t.id === test.id ? { ...t, visibility: e.target.value as "public"|"private" } : t))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                        </select>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => setPsychTests(psychTests.filter(t => t.id !== test.id))}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold text-sm"
                        >
                          Delete
                        </button>
                        <button className="px-4 py-2 bg-[#0A2463] text-white rounded-lg hover:bg-[#0A2463]/90 font-semibold text-sm">
                          Save
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-sm text-gray-700">
                  Your DISC profile from PhxNorth's 5D Analysis will appear here automatically once computed.
                </p>
              </div>
            </div>
          )}

          {/* Privacy Settings Section */}
          {activeSection === "privacy" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-6 h-6 text-[#0A2463]" />
                  <h2 className="text-2xl font-bold text-gray-900">Privacy Settings</h2>
                </div>
                <p className="text-gray-600">Control what mentors, enterprises, and other users can see</p>
              </div>

              <div className="space-y-4">
                {/* Global Profile Visibility */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-1">Global Profile Visibility</h3>
                  <p className="text-sm text-gray-600 mb-4">Controls whether your profile appears in search results</p>
                  <div className="flex gap-4">
                    {(["public", "private", "custom"] as const).map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="globalVisibility"
                          checked={visibilitySettings.globalVisibility === option}
                          onChange={() => setVisibilitySettings({ ...visibilitySettings, globalVisibility: option })}
                          className="w-4 h-4 text-[#0A2463] focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700 capitalize">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Show Current Company */}
                <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Show Current Company</h3>
                    <p className="text-sm text-gray-600">Display your current employer on your public profile</p>
                  </div>
                  <button
                    onClick={() => setVisibilitySettings({ ...visibilitySettings, showCurrentCompany: !visibilitySettings.showCurrentCompany })}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      visibilitySettings.showCurrentCompany ? "bg-[#0A2463]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        visibilitySettings.showCurrentCompany ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Show Full Career Timeline */}
                <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Show Full Career Timeline</h3>
                    <p className="text-sm text-gray-600">Show all past positions or only current role</p>
                  </div>
                  <button
                    onClick={() => setVisibilitySettings({ ...visibilitySettings, showFullCareerTimeline: !visibilitySettings.showFullCareerTimeline })}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      visibilitySettings.showFullCareerTimeline ? "bg-[#0A2463]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        visibilitySettings.showFullCareerTimeline ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Allow Enterprise View */}
                <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Allow Enterprise View</h3>
                    <p className="text-sm text-gray-600">Let enterprises see your profile for talent campaigns</p>
                  </div>
                  <button
                    onClick={() => setVisibilitySettings({ ...visibilitySettings, allowEnterpriseView: !visibilitySettings.allowEnterpriseView })}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      visibilitySettings.allowEnterpriseView ? "bg-[#0A2463]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        visibilitySettings.allowEnterpriseView ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Allow Mentor Discovery */}
                <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Allow Mentor Discovery</h3>
                    <p className="text-sm text-gray-600">Appear in mentor search results</p>
                  </div>
                  <button
                    onClick={() => setVisibilitySettings({ ...visibilitySettings, allowMentorDiscovery: !visibilitySettings.allowMentorDiscovery })}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      visibilitySettings.allowMentorDiscovery ? "bg-[#0A2463]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        visibilitySettings.allowMentorDiscovery ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-end">
                <button className="px-6 py-3 bg-[#0A2463] text-white rounded-lg hover:bg-[#0A2463]/90 font-bold text-sm">
                  Save Privacy Settings
                </button>
              </div>
            </div>
          )}

          {/* OVERVIEW SECTION - AI SNAPSHOT */}
          {activeSection === "overview" && (
            <div className="space-y-6">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Profile Overview</h1>
                <p className="text-lg text-gray-600">Summary of your profile sections. Click any card to edit.</p>
              </div>

              {/* Core Identity */}
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Core Identity</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Name</p>
                    <p className="font-semibold text-gray-900">{user?.full_name || user?.username || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-semibold text-gray-900">{user?.email || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Industry</p>
                    <p className="font-semibold text-gray-900">{user?.industry || "Not set"}{user?.sector ? ` / ${user.sector}` : ""}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Country</p>
                    <p className="font-semibold text-gray-900">{user?.current_country || "Not set"}</p>
                  </div>
                </div>
              </div>

              {/* Education Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                  <span className="text-sm font-semibold text-gray-500">{timelineEntries.filter(e => e.type === "education").length} entries</span>
                </div>
                {timelineEntries.filter(e => e.type === "education").length > 0 ? (
                  <div className="space-y-3">
                    {timelineEntries.filter(e => e.type === "education").map((entry) => (
                      <div key={entry.id} className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-[#0A2463]" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{entry.title || "Untitled"}</p>
                          <p className="text-sm text-gray-600">{entry.organization || "Institution not specified"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No education entries yet.</p>
                )}
                <button onClick={() => setActiveSection("education")} className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:border-[#0A2463] hover:text-[#0A2463] font-semibold transition-colors">
                  View & edit Education Timeline
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* Career Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Career</h2>
                  <span className="text-sm font-semibold text-gray-500">{timelineEntries.filter(e => e.type === "career").length} entries</span>
                </div>
                {timelineEntries.filter(e => e.type === "career").length > 0 ? (
                  <div className="space-y-3">
                    {timelineEntries.filter(e => e.type === "career").map((entry) => (
                      <div key={entry.id} className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{entry.title || "Untitled"}</p>
                          <p className="text-sm text-gray-600">{entry.organization || "Company not specified"}{entry.industryL1 ? ` · ${entry.industryL1}` : ""}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No career entries yet.</p>
                )}
                <button onClick={() => setActiveSection("career")} className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:border-[#0A2463] hover:text-[#0A2463] font-semibold transition-colors">
                  View & edit Career Timeline
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* Projects Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Business / Projects</h2>
                  <span className="text-sm font-semibold text-gray-500">{timelineEntries.filter(e => e.type === "business").length} entries</span>
                </div>
                {timelineEntries.filter(e => e.type === "business").length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {timelineEntries.filter(e => e.type === "business").map((entry) => (
                      <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                        <p className="font-bold text-gray-900">{entry.title || "Untitled"}</p>
                        <p className="text-sm text-gray-600">{entry.organization || "Role not specified"}</p>
                        {entry.industryL1 && <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded mt-2 inline-block">{entry.industryL1}</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No projects yet.</p>
                )}
                <button onClick={() => setActiveSection("business")} className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:border-[#0A2463] hover:text-[#0A2463] font-semibold transition-colors">
                  View & edit Business / Projects
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* Credentials Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Credentials</h2>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-3xl font-bold text-[#0A2463]">{certifications.length}</p>
                    <p className="text-sm text-gray-600 mt-1">Certifications</p>
                    <button onClick={() => setActiveSection("certifications")} className="text-xs text-[#0A2463] font-semibold mt-2 hover:underline">View / Add</button>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-3xl font-bold text-[#0A2463]">{trainings.length}</p>
                    <p className="text-sm text-gray-600 mt-1">Training Records</p>
                    <button onClick={() => setActiveSection("training")} className="text-xs text-[#0A2463] font-semibold mt-2 hover:underline">View / Add</button>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-3xl font-bold text-[#0A2463]">{psychTests.length}</p>
                    <p className="text-sm text-gray-600 mt-1">Psychometric Tests</p>
                    <button onClick={() => setActiveSection("psychometric")} className="text-xs text-[#0A2463] font-semibold mt-2 hover:underline">View / Add</button>
                  </div>
                </div>
              </div>

              {/* Privacy Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Privacy</h2>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${visibilitySettings.globalVisibility === "public" ? "bg-green-100 text-green-700" : visibilitySettings.globalVisibility === "private" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {visibilitySettings.globalVisibility.charAt(0).toUpperCase() + visibilitySettings.globalVisibility.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Show current company</span>
                    <span className={`font-semibold ${visibilitySettings.showCurrentCompany ? "text-green-600" : "text-gray-400"}`}>{visibilitySettings.showCurrentCompany ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Full career timeline</span>
                    <span className={`font-semibold ${visibilitySettings.showFullCareerTimeline ? "text-green-600" : "text-gray-400"}`}>{visibilitySettings.showFullCareerTimeline ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Enterprise view</span>
                    <span className={`font-semibold ${visibilitySettings.allowEnterpriseView ? "text-green-600" : "text-gray-400"}`}>{visibilitySettings.allowEnterpriseView ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Mentor discovery</span>
                    <span className={`font-semibold ${visibilitySettings.allowMentorDiscovery ? "text-green-600" : "text-gray-400"}`}>{visibilitySettings.allowMentorDiscovery ? "Yes" : "No"}</span>
                  </div>
                </div>
                <button onClick={() => setActiveSection("privacy")} className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:border-[#0A2463] hover:text-[#0A2463] font-semibold transition-colors">
                  Edit Privacy Settings
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* Action Bar */}
              <div className="bg-white rounded-xl border-2 border-[#0A2463] p-6 sticky bottom-0">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Profile sections: {timelineEntries.length} timeline entries, {certifications.length} certs, {trainings.length} training, {psychTests.length} tests
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const nextIncomplete = sections.find(s => s.completion < 100 && s.weight && s.weight > 0);
                        if (nextIncomplete) setActiveSection(nextIncomplete.id);
                      }}
                      className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Continue building profile
                    </button>
                    <button
                      onClick={() => navigate("/app/5d-snapshot")}
                      className="px-6 py-3 bg-[#0A2463] text-white rounded-lg font-bold hover:bg-[#0A2463]/90"
                    >
                      View 5D Snapshot
                    </button>
                  </div>
                </div>
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