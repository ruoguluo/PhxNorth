import { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft,
  MessageSquare, 
  Zap, 
  Target,
  Clock,
  CheckCircle,
  Edit3,
  GripVertical,
  Lightbulb,
  TrendingUp,
  Loader2,
  Sparkles,
  Star,
  Calendar,
  User,
  GraduationCap,
  Briefcase,
  TrendingUp as BusinessIcon,
  Rocket,
  Globe,
  X,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router';

type QuestionType = 'structured' | 'quick' | null;
type QuickQuestionStep = 'input' | 'assumed-goal' | 'stage' | 'clarification' | 'matching' | 'results';
type Category = 'education' | 'career' | 'business' | 'entrepreneurship' | null;
type DirectionCertainty = 'confirmed' | 'comparing' | 'exploring' | '';

interface StructuredQuestionData {
  domain: string;
  backgroundContext: string;
  desiredOutcome: string;
  timeHorizon: string;
  successCriteria: string;
}

interface SubQuestion {
  id: string;
  question: string;
  purpose: string;
  depthLevel: 'Foundation' | 'Application' | 'Strategic';
  estimatedTime: number;
}

interface AssumedGoal {
  institution: string;
  programLevel: string;
  major: string;
  targetIntake: string;
  country: string;
  category: string;
}

interface StageOption {
  id: string;
  label: string;
}

interface ClarificationQuestion {
  id: string;
  question: string;
  type: 'text' | 'select';
  options?: string[];
}

interface AIUnderstanding {
  country: string;
  category: string;
  subtype: string;
  stage: string;
  primaryGoal: string;
  timeHorizon?: string;
}

interface FollowUpQuestion {
  id: string;
  question: string;
  options?: string[];
  type: 'text' | 'select';
}

interface MentorMatch {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  experience: string;
  matchScore: number;
  matchConfidence: 'High' | 'Good' | 'Moderate';
  availability: string;
  responseTime: string;
  sessionsCompleted: number;
  avatarColor: string;
  status: 'online' | 'in-session' | 'offline';
  queueLength?: number;
  estimatedWaitTime?: string;
  nextAvailability?: string;
  mentorshipType?: 'instant' | 'scheduled' | 'both';
  menteesMarked: number;
  deepDialogues: number;
}

interface CountryData {
  country: string;
  city: string;
  timezone: string;
  language: string;
}

interface CategoryDetails {
  subtype: string;
  stage: string;
  goal: string;
  directionCertainty: DirectionCertainty;
  constraints: string;
  successCriteria: string;
  timeHorizon: string;
}

const categoryOptions = [
  {
    id: 'education' as const,
    title: 'Education',
    icon: GraduationCap,
    color: 'border-blue-500',
    bgColor: 'bg-blue-500',
    examples: ['College admissions', 'Test prep', 'Academic planning', 'Research guidance']
  },
  {
    id: 'career' as const,
    title: 'Career',
    icon: Briefcase,
    color: 'border-emerald-500',
    bgColor: 'bg-emerald-500',
    examples: ['Job search', 'Career transition', 'Promotion strategy', 'Skill development']
  },
  {
    id: 'business' as const,
    title: 'Business',
    icon: BusinessIcon,
    color: 'border-purple-500',
    bgColor: 'bg-purple-500',
    examples: ['Strategy', 'Sales & BD', 'Marketing', 'Operations']
  },
  {
    id: 'entrepreneurship' as const,
    title: 'Entrepreneurship',
    icon: Rocket,
    color: 'border-amber-500',
    bgColor: 'bg-amber-500',
    examples: ['Idea validation', 'MVP development', 'Go-to-market', 'Fundraising']
  }
];

export function MenteeQuestionEntry() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<QuestionType>(null);
  const [structuredStep, setStructuredStep] = useState(1);
  const [quickQuestionStep, setQuickQuestionStep] = useState<QuickQuestionStep>('input');
  
  // Structured Question Data
  const [structuredData, setStructuredData] = useState<StructuredQuestionData>({
    domain: '',
    backgroundContext: '',
    desiredOutcome: '',
    timeHorizon: '',
    successCriteria: ''
  });
  const [generatedAgenda, setGeneratedAgenda] = useState<SubQuestion[]>([]);
  
  // Quick Question Data
  const [quickQuestion, setQuickQuestion] = useState('');
  const [assumedGoal, setAssumedGoal] = useState<AssumedGoal | null>(null);
  const [selectedStage, setSelectedStage] = useState('');
  const [stageOptions, setStageOptions] = useState<StageOption[]>([]);
  const [clarificationQuestions, setClarificationQuestions] = useState<ClarificationQuestion[]>([]);
  const [clarificationAnswers, setClarificationAnswers] = useState<Record<string, string>>({});
  const [countryData, setCountryData] = useState<CountryData>({
    country: 'United States',
    city: '',
    timezone: '',
    language: 'English'
  });
  const [selectedCategory, setSelectedCategory] = useState<Category>(null);
  const [categoryDetails, setCategoryDetails] = useState<CategoryDetails>({
    subtype: '',
    stage: '',
    goal: '',
    directionCertainty: '',
    constraints: '',
    successCriteria: '',
    timeHorizon: ''
  });
  const [aiUnderstanding, setAiUnderstanding] = useState<AIUnderstanding | null>(null);
  const [followUpQuestions, setFollowUpQuestions] = useState<FollowUpQuestion[]>([]);
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({});
  const [mentorMatches, setMentorMatches] = useState<MentorMatch[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // New AI-first flow functions
  const analyzeQuestionAndGenerateAssumedGoal = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Mock AI inference from question content
      const mockAssumedGoal: AssumedGoal = {
        institution: 'University of Oxford',
        programLevel: 'Undergraduate',
        major: 'Chemistry',
        targetIntake: 'Fall 2027',
        country: 'United Kingdom',
        category: 'Education'
      };
      setAssumedGoal(mockAssumedGoal);
      
      // Generate stage options based on detected context
      const mockStageOptions: StageOption[] = [
        { id: 'deciding', label: 'Still deciding direction' },
        { id: 'preparing', label: 'Preparing application materials' },
        { id: 'drafting', label: 'Drafting personal statement' },
        { id: 'interview', label: 'Preparing for interview' },
        { id: 'submitted', label: 'Already submitted' }
      ];
      setStageOptions(mockStageOptions);
      
      setIsProcessing(false);
      setQuickQuestionStep('assumed-goal');
    }, 1500);
  };

  const confirmAssumedGoal = () => {
    setQuickQuestionStep('stage');
  };

  const editAssumedGoal = () => {
    // Allow user to edit the assumed goal
    // For now, just show an editable form
    setIsProcessing(false);
  };

  const handleStageSelection = (stageId: string) => {
    setSelectedStage(stageId);
    
    // Check if clarification needed (mock: ask 1-2 questions if needed)
    const needsClarification = Math.random() > 0.5;
    
    if (needsClarification) {
      const mockClarificationQuestions: ClarificationQuestion[] = [
        {
          id: '1',
          question: 'Have you already taken any standardized tests (SAT, ACT, etc.)?',
          type: 'select',
          options: ['Yes, completed', 'Scheduled', 'Not yet', 'Not required']
        }
      ];
      setClarificationQuestions(mockClarificationQuestions);
      setQuickQuestionStep('clarification');
    } else {
      proceedToMatching();
    }
  };

  const proceedToMatching = () => {
    setQuickQuestionStep('matching');
    setIsProcessing(true);
    setTimeout(() => {
      const mockMatches: MentorMatch[] = [
        // Online mentors
        {
          id: '1',
          name: 'Dr. Sarah Thompson',
          title: 'Oxford Chemistry Professor',
          expertise: ['Organic Chemistry', 'UK Admissions', 'UCAS'],
          experience: '15 years in admissions',
          matchScore: 95,
          matchConfidence: 'High',
          availability: 'Available now',
          responseTime: '< 2 min',
          sessionsCompleted: 127,
          avatarColor: 'bg-blue-600',
          status: 'online',
          mentorshipType: 'both',
          menteesMarked: 50,
          deepDialogues: 10
        },
        {
          id: '2',
          name: 'Prof. James Wilson',
          title: 'Cambridge Admissions Tutor',
          expertise: ['Personal Statements', 'Interviews', 'Sciences'],
          experience: '20 years admissions experience',
          matchScore: 93,
          matchConfidence: 'High',
          availability: 'Available now',
          responseTime: '< 5 min',
          sessionsCompleted: 89,
          avatarColor: 'bg-purple-600',
          status: 'online',
          mentorshipType: 'instant',
          menteesMarked: 45,
          deepDialogues: 8
        },
        {
          id: '3',
          name: 'Dr. Emily Rodriguez',
          title: 'University College London Advisor',
          expertise: ['Chemistry', 'Research Experience', 'UK Unis'],
          experience: '12 years academic advising',
          matchScore: 91,
          matchConfidence: 'High',
          availability: 'Available now',
          responseTime: '< 3 min',
          sessionsCompleted: 64,
          avatarColor: 'bg-emerald-600',
          status: 'online',
          mentorshipType: 'both',
          menteesMarked: 30,
          deepDialogues: 5
        },
        // In-session mentors
        {
          id: '4',
          name: 'Dr. Michael Chen',
          title: 'Imperial College Senior Lecturer',
          expertise: ['Chemistry', 'International Students', 'Test Prep'],
          experience: '10 years',
          matchScore: 89,
          matchConfidence: 'Good',
          availability: 'In session',
          responseTime: '< 10 min',
          sessionsCompleted: 75,
          avatarColor: 'bg-amber-600',
          status: 'in-session',
          queueLength: 2,
          estimatedWaitTime: '20 minutes',
          mentorshipType: 'instant',
          menteesMarked: 25,
          deepDialogues: 3
        },
        {
          id: '5',
          name: 'Prof. Lisa Anderson',
          title: 'Edinburgh University Advisor',
          expertise: ['UK Application Strategy', 'Chemistry', 'Personal Statements'],
          experience: '18 years',
          matchScore: 87,
          matchConfidence: 'Good',
          availability: 'In session',
          responseTime: '< 15 min',
          sessionsCompleted: 102,
          avatarColor: 'bg-pink-600',
          status: 'in-session',
          queueLength: 1,
          estimatedWaitTime: '15 minutes',
          mentorshipType: 'instant',
          menteesMarked: 20,
          deepDialogues: 2
        },
        // Offline mentors
        {
          id: '6',
          name: 'Dr. David Kim',
          title: 'Bristol University Chemistry Dept',
          expertise: ['Research Methods', 'Chemistry', 'UK System'],
          experience: '8 years',
          matchScore: 85,
          matchConfidence: 'Good',
          availability: 'Offline',
          responseTime: 'N/A',
          sessionsCompleted: 45,
          avatarColor: 'bg-indigo-600',
          status: 'offline',
          nextAvailability: 'Tomorrow 9:00 AM',
          mentorshipType: 'instant',
          menteesMarked: 15,
          deepDialogues: 1
        },
        {
          id: '7',
          name: 'Dr. Rachel Foster',
          title: 'University of Manchester Tutor',
          expertise: ['UCAS Applications', 'Chemistry', 'Undergraduate Prep'],
          experience: '14 years',
          matchScore: 84,
          matchConfidence: 'Good',
          availability: 'Offline',
          responseTime: 'N/A',
          sessionsCompleted: 58,
          avatarColor: 'bg-teal-600',
          status: 'offline',
          nextAvailability: 'Today 6:00 PM',
          mentorshipType: 'both',
          menteesMarked: 10,
          deepDialogues: 1
        },
        // Scheduled-only mentors
        {
          id: '8',
          name: 'Prof. Robert Clarke',
          title: 'Former Oxford Admissions Director',
          expertise: ['Strategic Planning', 'Top UK Unis', 'Long-term Prep'],
          experience: '25 years',
          matchScore: 96,
          matchConfidence: 'High',
          availability: 'By appointment',
          responseTime: 'N/A',
          sessionsCompleted: 215,
          avatarColor: 'bg-slate-700',
          status: 'offline',
          mentorshipType: 'scheduled',
          menteesMarked: 60,
          deepDialogues: 15
        },
        {
          id: '9',
          name: 'Dr. Maria Gonzalez',
          title: 'Cambridge Chemistry Fellow',
          expertise: ['Deep Dive Sessions', 'Interview Prep', 'Subject Mastery'],
          experience: '16 years',
          matchScore: 94,
          matchConfidence: 'High',
          availability: 'By appointment',
          responseTime: 'N/A',
          sessionsCompleted: 142,
          avatarColor: 'bg-rose-600',
          status: 'offline',
          mentorshipType: 'scheduled',
          menteesMarked: 55,
          deepDialogues: 12
        }
      ];
      setMentorMatches(mockMatches);
      setIsProcessing(false);
      setQuickQuestionStep('results');
    }, 2000);
  };

  // Initial Selection Screen
  if (!selectedType) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/app/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              What would you like to solve today?
            </h1>
            <p className="text-lg text-gray-600">
              Choose your approach based on complexity and desired depth
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <button
              onClick={() => setSelectedType('structured')}
              className="group bg-white border-4 border-[#0A2463] rounded-2xl p-10 hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left"
            >
              <div className="bg-[#0A2463] w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Structured Question</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Define your objective, context, and success criteria. Get AI-powered question decomposition for strategic mentorship sessions.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Step-by-step guided framework</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>AI-powered agenda decomposition</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Goal clarity scoring</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Best for complex decisions</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <span className="text-sm text-gray-500">Recommended for strategic decisions</span>
                <ArrowRight className="w-6 h-6 text-[#0A2463] group-hover:translate-x-2 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => setSelectedType('quick')}
              className="group bg-white border-4 border-emerald-600 rounded-2xl p-10 hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left"
            >
              <div className="bg-emerald-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Question</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                AI-powered intelligent matching with instant mentorship options.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Minimal user input</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>AI infers from question</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>User confirmation required</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Fast-track mentorship</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <span className="text-sm text-gray-500">Guided wizard approach</span>
                <ArrowRight className="w-6 h-6 text-emerald-600 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quick Question Flow
  if (selectedType === 'quick') {
    // Step 0: Input
    if (quickQuestionStep === 'input') {
      return (
        <div className="min-h-screen bg-gray-50 py-12 px-8">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedType(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Question Type Selection</span>
            </button>

            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Quick Question</h1>
              <p className="text-lg text-gray-600">
                Tell us what you're trying to solve
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Your Question
              </label>
              <textarea
                value={quickQuestion}
                onChange={(e) => setQuickQuestion(e.target.value)}
                placeholder="Example: I want to apply to Oxford for Chemistry undergraduate in 2027..."
                rows={8}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-600 focus:outline-none resize-none text-lg"
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={analyzeQuestionAndGenerateAssumedGoal}
                disabled={quickQuestion.trim().length < 10}
                className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-5 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Continue</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Step 1: Assumed Goal
    if (quickQuestionStep === 'assumed-goal') {
      return (
        <div className="min-h-screen bg-gray-50 py-12 px-8">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setQuickQuestionStep('input')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Progress */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">1</div>
                <div className="w-16 h-1 bg-gray-300"></div>
                <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-bold">2</div>
                <div className="w-16 h-1 bg-gray-300"></div>
                <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-bold">3</div>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles className="w-8 h-8 text-blue-600" />
                <h1 className="text-4xl font-bold text-gray-900">We understand your goal as:</h1>
              </div>
              <p className="text-lg text-gray-600">
                Please confirm or edit the details below
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 mb-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    Institution <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={assumedGoal?.institution || ''}
                    onChange={(e) => setAssumedGoal({ ...assumedGoal!, institution: e.target.value })}
                    placeholder="e.g., University of Oxford"
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:border-blue-600 focus:outline-none bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      Program Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={assumedGoal?.programLevel || ''}
                      onChange={(e) => setAssumedGoal({ ...assumedGoal!, programLevel: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:border-blue-600 focus:outline-none bg-white"
                    >
                      <option value="">Select...</option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Graduate">Graduate</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      Major <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={assumedGoal?.major || ''}
                      onChange={(e) => setAssumedGoal({ ...assumedGoal!, major: e.target.value })}
                      placeholder="e.g., Chemistry"
                      className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:border-blue-600 focus:outline-none bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      Target Intake <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={assumedGoal?.targetIntake || ''}
                      onChange={(e) => setAssumedGoal({ ...assumedGoal!, targetIntake: e.target.value })}
                      placeholder="e.g., Fall 2027"
                      className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:border-blue-600 focus:outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      Country/Region <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={assumedGoal?.country || ''}
                      onChange={(e) => setAssumedGoal({ ...assumedGoal!, country: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:border-blue-600 focus:outline-none bg-white"
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="India">India</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={confirmAssumedGoal}
                className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-5 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                <Check className="w-5 h-5" />
                <span>Yes, this is correct</span>
              </button>
              
              <button
                onClick={editAssumedGoal}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                <Edit3 className="w-5 h-5" />
                <span>Edit details</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Step 2: Stage Selection
    if (quickQuestionStep === 'stage') {
      return (
        <div className="min-h-screen bg-gray-50 py-12 px-8">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setQuickQuestionStep('assumed-goal')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Progress */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
                <div className="w-16 h-1 bg-emerald-600"></div>
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">2</div>
                <div className="w-16 h-1 bg-gray-300"></div>
                <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-bold">3</div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Which stage best describes you right now?</h1>
              <p className="text-lg text-gray-600">
                This helps us match you with the most relevant mentors
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
              <div className="space-y-4">
                {stageOptions.map(stage => (
                  <button
                    key={stage.id}
                    onClick={() => handleStageSelection(stage.id)}
                    className={`w-full text-left px-6 py-4 border-2 rounded-xl font-semibold transition-all ${
                      selectedStage === stage.id 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900' 
                        : 'border-gray-300 hover:border-emerald-400 text-gray-900'
                    }`}
                  >
                    {stage.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Step 3: Clarification Questions
    if (quickQuestionStep === 'clarification') {
      return (
        <div className="min-h-screen bg-gray-50 py-12 px-8">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setQuickQuestionStep('stage')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Progress */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
                <div className="w-16 h-1 bg-emerald-600"></div>
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
                <div className="w-16 h-1 bg-emerald-600"></div>
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">3</div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">One Quick Question</h1>
              <p className="text-lg text-gray-600">
                This will help us find the best match for you
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
              <div className="space-y-6">
                {clarificationQuestions.map((question) => (
                  <div key={question.id}>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {question.question}
                    </label>
                    {question.type === 'select' ? (
                      <select
                        value={clarificationAnswers[question.id] || ''}
                        onChange={(e) => setClarificationAnswers({ ...clarificationAnswers, [question.id]: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-600 focus:outline-none"
                      >
                        <option value="">Select...</option>
                        {question.options?.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <textarea
                        value={clarificationAnswers[question.id] || ''}
                        onChange={(e) => setClarificationAnswers({ ...clarificationAnswers, [question.id]: e.target.value })}
                        placeholder="Type your answer here..."
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-600 focus:outline-none resize-none"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={proceedToMatching}
                className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-5 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                <span>Find Mentors</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Step 4: Matching Process
    if (quickQuestionStep === 'matching') {
      return (
        <div className="min-h-screen bg-gray-50 py-12 px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Finding Mentors</h1>
              <p className="text-lg text-gray-600">
                Finding the most suitable mentors for your goal...
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-16 mb-6">
              <div className="flex flex-col items-center gap-6">
                <Loader2 className="w-16 h-16 animate-spin text-emerald-600" />
                <p className="text-gray-600 text-center">
                  Analyzing mentor expertise, availability, and match quality...
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Step 5: Mentor Match Results - GRID LAYOUT
    if (quickQuestionStep === 'results') {
      // Filter mentors by status
      const onlineMentors = mentorMatches.filter(m => m.status === 'online');
      const inSessionMentors = mentorMatches.filter(m => m.status === 'in-session');
      const offlineMentors = mentorMatches.filter(m => m.status === 'offline');
      const scheduledMentors = mentorMatches.filter(m => m.mentorshipType === 'scheduled');

      return (
        <div className="min-h-screen bg-gray-50 py-12 px-8">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => setQuickQuestionStep('clarification')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Instant Mentorship — Available Now</h1>
              <p className="text-lg text-gray-600">
                Connect immediately or join the queue
              </p>
            </div>

            {/* Section 1: Available Now */}
            {onlineMentors.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Available Now</h2>
                  <span className="text-sm text-gray-500">({onlineMentors.length} mentors online)</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {onlineMentors.slice(0, 6).map((mentor) => (
                    <div key={mentor.id} className="bg-white rounded-2xl border-2 border-emerald-200 p-6 hover:border-emerald-500 hover:shadow-xl transition-all relative">
                      {/* Status Badge */}
                      <div className="flex justify-center mb-4">
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Available
                        </span>
                      </div>

                      {/* Avatar */}
                      <div className="flex justify-center mb-4">
                        <div className={`${mentor.avatarColor} w-28 h-28 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-emerald-500`}>
                          {mentor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>

                      {/* Impact Metrics - Top Right */}
                      <div className="absolute top-4 right-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-3 py-2 shadow-sm">
                        <div className="text-xs font-semibold text-blue-900 mb-1">Impact Metrics</div>
                        <div className="space-y-0.5 text-xs text-gray-700">
                          <div>📊 {mentor.sessionsCompleted} Sessions</div>
                          <div>👥 {mentor.menteesMarked} Marked</div>
                          <div>🔁 {mentor.deepDialogues} Deep Dialogues</div>
                        </div>
                      </div>

                      {/* Name & Title */}
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{mentor.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-1">{mentor.title}</p>
                      </div>

                      {/* Expertise Tags */}
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {mentor.expertise.slice(0, 3).map((exp) => (
                          <span key={exp} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                            {exp}
                          </span>
                        ))}
                      </div>

                      {/* Availability Metrics */}
                      <div className="flex items-center justify-center gap-4 mb-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>~{mentor.estimatedWaitTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>Queue: {mentor.queueLength}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl">
                        Start Now
                      </button>
                    </div>
                  ))}
                </div>

                {onlineMentors.length > 6 && (
                  <div className="flex justify-center mt-6">
                    <button className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm">
                      View More ({onlineMentors.length - 6} more)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Section 2: In Session */}
            {inSessionMentors.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <h2 className="text-2xl font-bold text-gray-900">In Session</h2>
                  <span className="text-sm text-gray-500">({inSessionMentors.length} mentors)</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inSessionMentors.slice(0, 6).map((mentor) => (
                    <div key={mentor.id} className="bg-white rounded-2xl border-2 border-amber-200 p-6 hover:border-amber-500 hover:shadow-xl transition-all relative">
                      {/* Status Badge */}
                      <div className="flex justify-center mb-4">
                        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Busy
                        </span>
                      </div>

                      {/* Avatar */}
                      <div className="flex justify-center mb-4">
                        <div className={`${mentor.avatarColor} w-28 h-28 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-amber-500`}>
                          {mentor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>

                      {/* Impact Metrics - Top Right */}
                      <div className="absolute top-4 right-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-3 py-2 shadow-sm">
                        <div className="text-xs font-semibold text-blue-900 mb-1">Impact Metrics</div>
                        <div className="space-y-0.5 text-xs text-gray-700">
                          <div>📊 {mentor.sessionsCompleted} Sessions</div>
                          <div>👥 {mentor.menteesMarked} Marked</div>
                          <div>🔁 {mentor.deepDialogues} Deep Dialogues</div>
                        </div>
                      </div>

                      {/* Name & Title */}
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{mentor.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-1">{mentor.title}</p>
                      </div>

                      {/* Expertise Tags */}
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {mentor.expertise.slice(0, 3).map((exp) => (
                          <span key={exp} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                            {exp}
                          </span>
                        ))}
                      </div>

                      {/* Availability Metrics */}
                      <div className="flex items-center justify-center gap-4 mb-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>~{mentor.estimatedWaitTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>Queue: {mentor.queueLength}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl">
                        Join Queue
                      </button>
                    </div>
                  ))}
                </div>

                {inSessionMentors.length > 6 && (
                  <div className="flex justify-center mt-6">
                    <button className="text-amber-600 hover:text-amber-700 font-semibold text-sm">
                      View More ({inSessionMentors.length - 6} more)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Section 3: Offline */}
            {offlineMentors.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Offline</h2>
                  <span className="text-sm text-gray-500">({offlineMentors.length} mentors)</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {offlineMentors.slice(0, 6).map((mentor) => (
                    <div key={mentor.id} className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-gray-400 hover:shadow-xl transition-all relative">
                      {/* Status Badge */}
                      <div className="flex justify-center mb-4">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Offline
                        </span>
                      </div>

                      {/* Avatar */}
                      <div className="flex justify-center mb-4">
                        <div className={`${mentor.avatarColor} w-28 h-28 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-gray-300 opacity-70`}>
                          {mentor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>

                      {/* Impact Metrics - Top Right */}
                      <div className="absolute top-4 right-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-3 py-2 shadow-sm">
                        <div className="text-xs font-semibold text-blue-900 mb-1">Impact Metrics</div>
                        <div className="space-y-0.5 text-xs text-gray-700">
                          <div>📊 {mentor.sessionsCompleted} Sessions</div>
                          <div>👥 {mentor.menteesMarked} Marked</div>
                          <div>🔁 {mentor.deepDialogues} Deep Dialogues</div>
                        </div>
                      </div>

                      {/* Name & Title */}
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{mentor.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-1">{mentor.title}</p>
                      </div>

                      {/* Expertise Tags */}
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {mentor.expertise.slice(0, 3).map((exp) => (
                          <span key={exp} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                            {exp}
                          </span>
                        ))}
                      </div>

                      {/* Metrics */}
                      <div className="flex items-center justify-center mb-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{mentor.nextAvailability}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl">
                        Notify Me
                      </button>
                    </div>
                  ))}
                </div>

                {offlineMentors.length > 6 && (
                  <div className="flex justify-center mt-6">
                    <button className="text-gray-600 hover:text-gray-700 font-semibold text-sm">
                      View More ({offlineMentors.length - 6} more)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Section 4: Scheduled Only */}
            {scheduledMentors.length > 0 && (
              <div className="mb-16">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Need Deeper Structured Guidance?</h2>
                    <p className="text-gray-600">Schedule a comprehensive session with these mentors</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scheduledMentors.slice(0, 6).map((mentor) => (
                      <div key={mentor.id} className="bg-white rounded-2xl border-2 border-blue-200 p-6 hover:border-blue-500 hover:shadow-xl transition-all relative">
                        {/* Status Badge */}
                        <div className="flex justify-center mb-4">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                            Scheduled Only
                          </span>
                        </div>

                        {/* Avatar */}
                        <div className="flex justify-center mb-4">
                          <div className={`${mentor.avatarColor} w-28 h-28 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-blue-500`}>
                            {mentor.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </div>

                        {/* Impact Metrics - Top Right */}
                        <div className="absolute top-4 right-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-3 py-2 shadow-sm">
                          <div className="text-xs font-semibold text-blue-900 mb-1">Impact Metrics</div>
                          <div className="space-y-0.5 text-xs text-gray-700">
                            <div>📊 {mentor.sessionsCompleted} Sessions</div>
                            <div>👥 {mentor.menteesMarked} Marked</div>
                            <div>🔁 {mentor.deepDialogues} Deep Dialogues</div>
                          </div>
                        </div>

                        {/* Name & Title */}
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{mentor.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-1">{mentor.title}</p>
                        </div>

                        {/* Expertise Tags */}
                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                          {mentor.expertise.slice(0, 3).map((exp) => (
                            <span key={exp} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                              {exp}
                            </span>
                          ))}
                        </div>

                        {/* Availability Metrics */}
                        <div className="flex items-center justify-center mb-4 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Scheduled sessions</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button className="w-full bg-[#0A2463] hover:bg-[#0A2463]/90 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl">
                          Request Session
                        </button>
                      </div>
                    ))}
                  </div>

                  {scheduledMentors.length > 6 && (
                    <div className="flex justify-center mt-6">
                      <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                        View More ({scheduledMentors.length - 6} more)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-center mt-8">
              <button
                onClick={() => navigate('/app/dashboard')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return null;
}