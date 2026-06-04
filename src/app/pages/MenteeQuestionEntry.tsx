import { useState, useEffect } from 'react';
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
import { useNavigate, useSearchParams } from 'react-router';
import { questionAPI, type AIUnderstanding as AIUnderstandingDTO } from '../../lib/question-api';
import { mentorshipAPI, stripeAPI } from '../../lib/api';

type QuestionType = 'structured' | 'quick' | null;
type QuickQuestionStep = 'input' | 'assumed-goal' | 'stage' | 'clarification' | 'agenda' | 'matching' | 'results';
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
  hourlyRate: number;
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
  const [searchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState<QuestionType>(null);

  // Auto-select type from ?type=quick or ?type=structured query param
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'quick' || typeParam === 'structured') {
      setSelectedType(typeParam);
    }
  }, [searchParams]);
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

  // Request session modal
  const [requestModal, setRequestModal] = useState<{ mentor: MentorMatch; sessionType: 'instant' | 'scheduled' } | null>(null);
  const [requestForm, setRequestForm] = useState({ topic: '', message: '', duration_minutes: 30, proposed_datetime: '' });
  const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [requestError, setRequestError] = useState('');
  const [showAllOnline, setShowAllOnline] = useState(false);
  const [showAllInSession, setShowAllInSession] = useState(false);
  const [showAllOffline, setShowAllOffline] = useState(false);
  const [showAllScheduled, setShowAllScheduled] = useState(false);

  // Default stage options used if the AI returns none / is unavailable.
  const defaultStageOptions: StageOption[] = [
    { id: 'deciding', label: 'Still deciding direction' },
    { id: 'preparing', label: 'Preparing application materials' },
    { id: 'drafting', label: 'Working on the details' },
    { id: 'interview', label: 'Preparing for a key milestone' },
    { id: 'submitted', label: 'Reviewing / finalising' }
  ];

  // AI-first flow: interpret the mentee's raw question via the backend.
  const analyzeQuestionAndGenerateAssumedGoal = async () => {
    setIsProcessing(true);
    try {
      const result = await questionAPI.interpret(quickQuestion, {
        country: countryData.country || undefined,
      });

      setAssumedGoal(result.assumedGoal as AssumedGoal);
      setStageOptions(
        result.stageOptions.length > 0
          ? (result.stageOptions as StageOption[])
          : defaultStageOptions
      );
      setAiUnderstanding(result.understanding as AIUnderstandingDTO as AIUnderstanding);
      // Stash any clarification questions the AI wants to ask after stage selection.
      setClarificationQuestions(
        (result.clarificationQuestions ?? []).map((c) => ({
          id: c.id,
          question: c.question,
          type: c.type,
          options: c.options ?? undefined,
        }))
      );
    } catch (err) {
      // Graceful degradation: let the mentee proceed manually if the
      // structuring service is unavailable.
      console.warn('Question interpretation failed, falling back to manual flow', err);
      setAssumedGoal(null);
      setStageOptions(defaultStageOptions);
      setClarificationQuestions([]);
    } finally {
      setIsProcessing(false);
      setQuickQuestionStep('assumed-goal');
    }
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

    // Use the clarification questions the AI surfaced during interpretation.
    if (clarificationQuestions.length > 0) {
      setQuickQuestionStep('clarification');
    } else {
      generateQuickAgenda();
    }
  };

  const generateQuickAgenda = async () => {
    setQuickQuestionStep('agenda');
    setIsProcessing(true);
    try {
      const result = await questionAPI.agenda(quickQuestion, {
        understanding: aiUnderstanding ? {
          country: aiUnderstanding.country,
          category: aiUnderstanding.category,
          subtype: aiUnderstanding.subtype,
          stage: aiUnderstanding.stage,
          primaryGoal: aiUnderstanding.primaryGoal,
          timeHorizon: aiUnderstanding.timeHorizon,
        } as any : undefined,
        stage: selectedStage || undefined,
        answers: clarificationAnswers,
      });
      setGeneratedAgenda(result.subQuestions);
    } catch (err) {
      console.warn('Quick agenda generation failed', err);
      setGeneratedAgenda([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const proceedToMatching = async () => {
    setQuickQuestionStep('matching');
    setIsProcessing(true);
    try {
      const keywords = Object.values(clarificationAnswers).filter(Boolean) as string[];
      const results = await mentorshipAPI.match({
        category: aiUnderstanding?.category || (selectedCategory ?? undefined),
        subtype: aiUnderstanding?.subtype || undefined,
        primary_goal: aiUnderstanding?.primaryGoal || undefined,
        stage: selectedStage || aiUnderstanding?.stage || undefined,
        country: aiUnderstanding?.country || countryData.country || undefined,
        keywords: keywords.length ? keywords : undefined,
        raw_question: quickQuestion || undefined,
        limit: 9,
      });
      const mapped: MentorMatch[] = results.map((m) => ({
        id: m.id,
        name: m.name,
        title: m.title,
        expertise: m.expertise,
        experience: m.experience,
        matchScore: m.matchScore,
        matchConfidence: m.matchConfidence as MentorMatch['matchConfidence'],
        availability: m.availability,
        responseTime: m.responseTime,
        sessionsCompleted: m.sessionsCompleted,
        avatarColor: m.avatarColor,
        status: m.status as MentorMatch['status'],
        queueLength: m.queueLength ?? undefined,
        estimatedWaitTime: m.estimatedWaitTime ?? undefined,
        nextAvailability: m.nextAvailability ?? undefined,
        mentorshipType: (m.mentorshipType || undefined) as MentorMatch['mentorshipType'],
        menteesMarked: m.menteesMarked,
        deepDialogues: m.deepDialogues,
      }));
      setMentorMatches(mapped);
    } catch (err) {
      // Graceful: show no matches rather than breaking the flow.
      console.warn('Mentor matching failed', err);
      setMentorMatches([]);
    } finally {
      setIsProcessing(false);
      setQuickQuestionStep('results');
    }
  };

  const openRequestModal = (mentor: MentorMatch, sessionType: 'instant' | 'scheduled') => {
    const defaultTopic = selectedType === 'structured'
      ? (`${structuredData.domain}: ${structuredData.desiredOutcome}`.trim().slice(0, 100) || 'Mentorship Session')
      : (quickQuestion.slice(0, 100) || 'Mentorship Session');
    setRequestForm({ topic: defaultTopic, message: '', duration_minutes: sessionType === 'instant' ? 30 : 60, proposed_datetime: '' });
    setRequestStatus('idle');
    setRequestError('');
    setRequestModal({ mentor, sessionType });
  };

  const submitRequest = async () => {
    if (!requestModal) return;
    setRequestStatus('loading');
    // Check payment method if session has a price
    if (requestModal.mentor.hourlyRate > 0) {
        try {
            const pm = await stripeAPI.getPaymentMethod();
            if (!pm.has_card) {
                setRequestError('Please add a payment method before booking. Go to Billing page to add a card.');
                setRequestStatus('error');
                return;
            }
        } catch {
            // If Stripe check fails (e.g., mock mode), proceed anyway
        }
    }
    try {
      let fullMessage = requestForm.message || '';
      if (generatedAgenda.length > 0) {
        fullMessage += '\n\n--- AI-Generated Agenda ---\n';
        generatedAgenda.forEach((item, i) => {
          fullMessage += `${i + 1}. [${item.depthLevel || 'general'}] ${item.question}\n`;
        });
      }
      const data: Record<string, unknown> = {
        mentor_id: parseInt(requestModal.mentor.id),
        type: requestModal.sessionType,
        topic: requestForm.topic,
        message: fullMessage.trim() || undefined,
        duration_minutes: requestForm.duration_minutes,
        price: requestModal.mentor.hourlyRate > 0
          ? Math.round(requestModal.mentor.hourlyRate * (requestForm.duration_minutes / 60) * 100) / 100
          : 0,
      };
      if (requestModal.sessionType === 'scheduled' && requestForm.proposed_datetime) {
        data.proposed_datetime = new Date(requestForm.proposed_datetime).toISOString();
      }
      await mentorshipAPI.createRequest(data);
      setRequestStatus('success');
    } catch (err: unknown) {
      setRequestStatus('error');
      setRequestError(err instanceof Error ? err.message : 'Failed to send request. Please try again.');
    }
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
              onClick={() => searchParams.get('type') ? navigate('/app/dashboard') : setSelectedType(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{searchParams.get('type') ? 'Back to Dashboard' : 'Back to Question Type Selection'}</span>
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
                onClick={generateQuickAgenda}
                className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-5 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Step 3.5: Agenda Preview
    if (quickQuestionStep === 'agenda') {
      return (
        <div className="min-h-screen bg-gray-50 py-12 px-8">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setQuickQuestionStep(clarificationQuestions.length > 0 ? 'clarification' : 'stage')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Agenda Preview</h2>
                <p className="text-gray-600">AI-generated discussion points for your session</p>
              </div>
              {isProcessing ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-16 mb-6">
                  <div className="flex flex-col items-center gap-6">
                    <Loader2 className="w-16 h-16 animate-spin text-emerald-600" />
                    <p className="text-gray-600 text-center">Generating your session agenda...</p>
                  </div>
                </div>
              ) : generatedAgenda.length > 0 ? (
                <div className="space-y-3">
                  {generatedAgenda.map((item, i) => (
                    <div key={item.id || i} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-7 h-7 bg-[#0A2463] text-white rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              item.depthLevel === 'Foundation' ? 'bg-blue-100 text-blue-700' :
                              item.depthLevel === 'Application' ? 'bg-purple-100 text-purple-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {item.depthLevel || 'general'}
                            </span>
                            {item.estimatedTime && (
                              <span className="text-xs text-gray-400">{item.estimatedTime} min</span>
                            )}
                          </div>
                          <p className="text-gray-900 font-medium">{item.question}</p>
                          {item.purpose && <p className="text-sm text-gray-500 mt-1">{item.purpose}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                  <p>Agenda will be built with your mentor during the session</p>
                </div>
              )}
              <button
                onClick={() => proceedToMatching()}
                disabled={isProcessing}
                className="w-full bg-[#0A2463] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#0A2463]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Find Mentors →
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
              onClick={() => setQuickQuestionStep('agenda')}
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
                  {onlineMentors.slice(0, showAllOnline ? undefined : 6).map((mentor) => (
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
                      <button onClick={() => openRequestModal(mentor, 'instant')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl">
                        Start Now
                      </button>
                    </div>
                  ))}
                </div>

                {onlineMentors.length > 6 && (
                  <div className="flex justify-center mt-6">
                    <button onClick={() => setShowAllOnline(!showAllOnline)} className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm">
                      {showAllOnline ? 'Show Less' : `View More (${onlineMentors.length - 6} more)`}
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
                  {inSessionMentors.slice(0, showAllInSession ? undefined : 6).map((mentor) => (
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
                      <button onClick={() => openRequestModal(mentor, 'instant')} className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl">
                        Join Queue
                      </button>
                    </div>
                  ))}
                </div>

                {inSessionMentors.length > 6 && (
                  <div className="flex justify-center mt-6">
                    <button onClick={() => setShowAllInSession(!showAllInSession)} className="text-amber-600 hover:text-amber-700 font-semibold text-sm">
                      {showAllInSession ? 'Show Less' : `View More (${inSessionMentors.length - 6} more)`}
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
                  {offlineMentors.slice(0, showAllOffline ? undefined : 6).map((mentor) => (
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
                      <button onClick={() => openRequestModal(mentor, 'scheduled')} className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl">
                        Notify Me
                      </button>
                    </div>
                  ))}
                </div>

                {offlineMentors.length > 6 && (
                  <div className="flex justify-center mt-6">
                    <button onClick={() => setShowAllOffline(!showAllOffline)} className="text-gray-600 hover:text-gray-700 font-semibold text-sm">
                      {showAllOffline ? 'Show Less' : `View More (${offlineMentors.length - 6} more)`}
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
                    {scheduledMentors.slice(0, showAllScheduled ? undefined : 6).map((mentor) => (
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
                        <button onClick={() => openRequestModal(mentor, 'scheduled')} className="w-full bg-[#0A2463] hover:bg-[#0A2463]/90 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl">
                          Request Session
                        </button>
                      </div>
                    ))}
                  </div>

                  {scheduledMentors.length > 6 && (
                    <div className="flex justify-center mt-6">
                      <button onClick={() => setShowAllScheduled(!showAllScheduled)} className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                        {showAllScheduled ? 'Show Less' : `View More (${scheduledMentors.length - 6} more)`}
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

            {/* Request Session Modal */}
            {requestModal && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative max-h-[90vh] overflow-y-auto">
                  <button onClick={() => setRequestModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                  {requestStatus === 'success' ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-10 h-10 text-emerald-600" /></div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h2>
                      <p className="text-gray-600 mb-6">Your request has been sent to <strong>{requestModal.mentor.name}</strong>. You'll be notified when they respond.</p>
                      <button onClick={() => { setRequestModal(null); navigate('/app/dashboard'); }} className="bg-[#0A2463] text-white px-8 py-3 rounded-lg hover:bg-[#0A2463]/90 transition-colors font-semibold">Go to Dashboard</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`${requestModal.mentor.avatarColor} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>{requestModal.mentor.name.split(' ').map(n => n[0]).join('')}</div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl font-bold text-gray-900 truncate">{requestModal.mentor.name}</h2>
                          <p className="text-sm text-gray-500 truncate">{requestModal.mentor.title}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${requestModal.sessionType === 'instant' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{requestModal.sessionType === 'instant' ? '⚡ Instant' : '📅 Scheduled'}</span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-1">Session Topic <span className="text-red-500">*</span></label>
                          <input type="text" value={requestForm.topic} onChange={(e) => setRequestForm({ ...requestForm, topic: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0A2463] focus:outline-none" placeholder="What would you like to discuss?" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-1">Duration</label>
                          <select value={requestForm.duration_minutes} onChange={(e) => setRequestForm({ ...requestForm, duration_minutes: parseInt(e.target.value) })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0A2463] focus:outline-none">
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>60 minutes</option>
                            <option value={90}>90 minutes</option>
                          </select>
                        </div>
                        {/* Estimated Price */}
                        {requestModal.mentor.hourlyRate > 0 && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-emerald-900">Estimated Session Cost</p>
                                <p className="text-xs text-emerald-700 mt-0.5">${requestModal.mentor.hourlyRate}/hr x {requestForm.duration_minutes} min</p>
                              </div>
                              <p className="text-2xl font-bold text-emerald-700">${(Math.round(requestModal.mentor.hourlyRate * (requestForm.duration_minutes / 60) * 100) / 100).toFixed(2)}</p>
                            </div>
                          </div>
                        )}
                        {requestModal.sessionType === 'scheduled' && (
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1">Proposed Date &amp; Time</label>
                            <input type="datetime-local" value={requestForm.proposed_datetime} onChange={(e) => setRequestForm({ ...requestForm, proposed_datetime: e.target.value })} min={new Date().toISOString().slice(0, 16)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0A2463] focus:outline-none" />
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-1">Message (optional)</label>
                          <textarea value={requestForm.message} onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })} rows={3} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0A2463] focus:outline-none resize-none" placeholder="Add any context or specific questions for your mentor..." />
                        </div>
                        {requestStatus === 'error' && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{requestError}</div>}
                        <button onClick={submitRequest} disabled={!requestForm.topic.trim() || requestStatus === 'loading'} className="w-full bg-[#0A2463] hover:bg-[#0A2463]/90 text-white py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                          {requestStatus === 'loading' ? <><Loader2 className="w-5 h-5 animate-spin" />Sending...</> : <><CheckCircle className="w-5 h-5" />Send Request</>}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  // Structured Question Flow
  if (selectedType === 'structured') {
    // Step 1: Fill in structured question fields
    if (structuredStep === 1) {
      const isValid = structuredData.domain.trim() && structuredData.backgroundContext.trim() && structuredData.desiredOutcome.trim();

      const handleStructuredNext = async () => {
        setIsProcessing(true);
        try {
          const result = await questionAPI.agenda(structuredData.backgroundContext, {
            understanding: aiUnderstanding ?? undefined,
            stage: structuredData.timeHorizon,
            answers: { successCriteria: structuredData.successCriteria },
          });
          setGeneratedAgenda(result.subQuestions);
        } catch (err) {
          console.warn('Agenda generation failed, proceeding without AI agenda', err);
          setGeneratedAgenda([]);
        } finally {
          setIsProcessing(false);
          setStructuredStep(2);
        }
      };

      return (
        <div className="min-h-screen bg-gray-50 py-12 px-8">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedType(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Question Type Selection</span>
            </button>

            {/* Progress */}
            <div className="flex items-center justify-center mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0A2463] text-white flex items-center justify-center font-bold">1</div>
                <div className="w-20 h-1 bg-gray-300" />
                <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-bold">2</div>
                <div className="w-20 h-1 bg-gray-300" />
                <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-bold">3</div>
              </div>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Define Your Objective</h1>
              <p className="text-lg text-gray-600">Help us understand what you want to achieve</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6 mb-8">
              {/* Domain */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Domain / Area <span className="text-red-500">*</span>
                </label>
                <select
                  value={structuredData.domain}
                  onChange={(e) => setStructuredData({ ...structuredData, domain: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0A2463] focus:outline-none"
                >
                  <option value="">Select a domain...</option>
                  <option value="Education">Education</option>
                  <option value="Career">Career</option>
                  <option value="Business">Business</option>
                  <option value="Entrepreneurship">Entrepreneurship</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Background Context */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Background & Context <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={structuredData.backgroundContext}
                  onChange={(e) => setStructuredData({ ...structuredData, backgroundContext: e.target.value })}
                  placeholder="Describe your current situation, relevant experience, and what led you to this question..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0A2463] focus:outline-none resize-none"
                />
              </div>

              {/* Desired Outcome */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Desired Outcome <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={structuredData.desiredOutcome}
                  onChange={(e) => setStructuredData({ ...structuredData, desiredOutcome: e.target.value })}
                  placeholder="What does success look like for you? What do you want to achieve?"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0A2463] focus:outline-none resize-none"
                />
              </div>

              {/* Time Horizon */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Time Horizon</label>
                <select
                  value={structuredData.timeHorizon}
                  onChange={(e) => setStructuredData({ ...structuredData, timeHorizon: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0A2463] focus:outline-none"
                >
                  <option value="">Select timeframe...</option>
                  <option value="1-3 months">1–3 months</option>
                  <option value="3-6 months">3–6 months</option>
                  <option value="6-12 months">6–12 months</option>
                  <option value="1-2 years">1–2 years</option>
                  <option value="2+ years">2+ years</option>
                </select>
              </div>

              {/* Success Criteria */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Success Criteria</label>
                <textarea
                  value={structuredData.successCriteria}
                  onChange={(e) => setStructuredData({ ...structuredData, successCriteria: e.target.value })}
                  placeholder="How will you know when you've succeeded? What are the measurable outcomes?"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0A2463] focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleStructuredNext}
                disabled={!isValid || isProcessing}
                className="flex items-center gap-3 bg-[#0A2463] hover:bg-[#0A2463]/90 text-white px-12 py-5 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Generating Agenda...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Agenda</span>
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Step 2: AI-generated agenda review
    if (structuredStep === 2) {
      return (
        <div className="min-h-screen bg-gray-50 py-12 px-8">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setStructuredStep(1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Progress */}
            <div className="flex items-center justify-center mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0A2463] text-white flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
                <div className="w-20 h-1 bg-[#0A2463]" />
                <div className="w-10 h-10 rounded-full bg-[#0A2463] text-white flex items-center justify-center font-bold">2</div>
                <div className="w-20 h-1 bg-gray-300" />
                <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-bold">3</div>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles className="w-8 h-8 text-[#0A2463]" />
                <h1 className="text-4xl font-bold text-gray-900">Your Mentorship Agenda</h1>
              </div>
              <p className="text-lg text-gray-600">AI-powered breakdown of your objective into focused discussion topics</p>
            </div>

            {/* Summary card */}
            <div className="bg-gradient-to-br from-[#0A2463] to-[#1e40af] rounded-2xl p-6 text-white mb-8">
              <div className="flex items-start gap-3 mb-3">
                <Target className="w-5 h-5 mt-0.5 text-blue-200 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-blue-200 uppercase tracking-wide mb-1">Domain</div>
                  <div className="font-semibold">{structuredData.domain}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 mt-0.5 text-blue-200 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-blue-200 uppercase tracking-wide mb-1">Desired Outcome</div>
                  <div className="text-blue-100 text-sm">{structuredData.desiredOutcome}</div>
                </div>
              </div>
            </div>

            {/* Agenda items */}
            {generatedAgenda.length > 0 ? (
              <div className="space-y-4 mb-8">
                {generatedAgenda.map((item, idx) => {
                  const depthColors: Record<string, string> = {
                    Foundation: 'bg-blue-100 text-blue-700',
                    Application: 'bg-purple-100 text-purple-700',
                    Strategic: 'bg-emerald-100 text-emerald-700',
                  };
                  return (
                    <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#0A2463]/10 text-[#0A2463] flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${depthColors[item.depthLevel] ?? 'bg-gray-100 text-gray-700'}`}>
                            {item.depthLevel}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {item.estimatedTime} min
                          </span>
                        </div>
                        <p className="font-semibold text-gray-900 mb-1">{item.question}</p>
                        <p className="text-sm text-gray-500">{item.purpose}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center mb-8">
                <Lightbulb className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Agenda will be built with your mentor during the session.</p>
                <p className="text-sm text-gray-400 mt-1">Your objective details have been saved.</p>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={async () => {
                  setStructuredStep(3);
                  setIsProcessing(true);
                  try {
                    const results = await mentorshipAPI.match({
                      category: structuredData.domain.toLowerCase() || undefined,
                      primary_goal: structuredData.desiredOutcome || undefined,
                      raw_question: structuredData.backgroundContext || undefined,
                      limit: 9,
                    });
                    const mapped: MentorMatch[] = results.map((m) => ({
                      id: m.id,
                      name: m.name,
                      title: m.title,
                      expertise: m.expertise,
                      experience: m.experience,
                      matchScore: m.matchScore,
                      matchConfidence: m.matchConfidence as MentorMatch['matchConfidence'],
                      availability: m.availability,
                      responseTime: m.responseTime,
                      sessionsCompleted: m.sessionsCompleted,
                      avatarColor: m.avatarColor,
                      status: m.status as MentorMatch['status'],
                      queueLength: m.queueLength ?? undefined,
                      estimatedWaitTime: m.estimatedWaitTime ?? undefined,
                      nextAvailability: m.nextAvailability ?? undefined,
                      mentorshipType: (m.mentorshipType || undefined) as MentorMatch['mentorshipType'],
                      menteesMarked: m.menteesMarked,
                      deepDialogues: m.deepDialogues,
                    }));
                    setMentorMatches(mapped);
                  } catch (err) {
                    console.warn('Mentor matching failed', err);
                    setMentorMatches([]);
                  } finally {
                    setIsProcessing(false);
                  }
                }}
                className="flex items-center gap-3 bg-[#0A2463] hover:bg-[#0A2463]/90 text-white px-12 py-5 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                <span>Find Mentors</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Step 3: Mentor match results
    if (structuredStep === 3) {
      return (
        <div className="min-h-screen bg-gray-50 py-12 px-8">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => setStructuredStep(2)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Agenda</span>
            </button>

            {/* Progress */}
            <div className="flex items-center justify-center mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0A2463] text-white flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
                <div className="w-20 h-1 bg-[#0A2463]" />
                <div className="w-10 h-10 rounded-full bg-[#0A2463] text-white flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
                <div className="w-20 h-1 bg-[#0A2463]" />
                <div className="w-10 h-10 rounded-full bg-[#0A2463] text-white flex items-center justify-center font-bold">3</div>
              </div>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Matched Mentors</h1>
              <p className="text-lg text-gray-600">Based on your structured objective in <strong>{structuredData.domain}</strong></p>
            </div>

            {isProcessing ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-16 flex flex-col items-center gap-6">
                <Loader2 className="w-16 h-16 animate-spin text-[#0A2463]" />
                <p className="text-gray-600">Finding the best mentors for your goal...</p>
              </div>
            ) : mentorMatches.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">No mentors found</h2>
                <p className="text-gray-600 mb-6">Try broadening your criteria or check back later.</p>
                <button
                  onClick={() => navigate('/app/find-mentor')}
                  className="bg-[#0A2463] text-white px-8 py-3 rounded-lg hover:bg-[#0A2463]/90 transition-colors font-semibold"
                >
                  Browse All Mentors
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentorMatches.map((mentor) => (
                  <div key={mentor.id} className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-[#0A2463] hover:shadow-xl transition-all relative">
                    {/* Status */}
                    <div className="flex justify-between items-center mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        mentor.status === 'online' ? 'bg-emerald-100 text-emerald-700' :
                        mentor.status === 'in-session' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {mentor.status === 'online' ? 'Available' : mentor.status === 'in-session' ? 'In Session' : 'Offline'}
                      </span>
                      <span className="text-xs font-bold text-[#0A2463] bg-blue-50 px-2 py-1 rounded">
                        {mentor.matchScore}% match
                      </span>
                    </div>

                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                      <div className={`${mentor.avatarColor} w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-[#0A2463]/20`}>
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>

                    {/* Name & Title */}
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{mentor.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1">{mentor.title}</p>
                    </div>

                    {/* Expertise */}
                    <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                      {mentor.expertise.slice(0, 3).map((exp) => (
                        <span key={exp} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          {exp}
                        </span>
                      ))}
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-4">
                      <span>📊 {mentor.sessionsCompleted} sessions</span>
                      <span>⚡ {mentor.responseTime}</span>
                    </div>

                    {/* Action */}
                    <button onClick={() => openRequestModal(mentor, 'scheduled')} className="w-full bg-[#0A2463] hover:bg-[#0A2463]/90 text-white py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg">
                      Request Session
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center mt-10">
              <button
                onClick={() => navigate('/app/dashboard')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Back to Dashboard
              </button>
            </div>

            {/* Request Session Modal */}
            {requestModal && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative max-h-[90vh] overflow-y-auto">
                  <button onClick={() => setRequestModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                  {requestStatus === 'success' ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-10 h-10 text-emerald-600" /></div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h2>
                      <p className="text-gray-600 mb-6">Your request has been sent to <strong>{requestModal.mentor.name}</strong>. You'll be notified when they respond.</p>
                      <button onClick={() => { setRequestModal(null); navigate('/app/dashboard'); }} className="bg-[#0A2463] text-white px-8 py-3 rounded-lg hover:bg-[#0A2463]/90 transition-colors font-semibold">Go to Dashboard</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`${requestModal.mentor.avatarColor} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>{requestModal.mentor.name.split(' ').map(n => n[0]).join('')}</div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl font-bold text-gray-900 truncate">{requestModal.mentor.name}</h2>
                          <p className="text-sm text-gray-500 truncate">{requestModal.mentor.title}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${requestModal.sessionType === 'instant' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{requestModal.sessionType === 'instant' ? '⚡ Instant' : '📅 Scheduled'}</span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-1">Session Topic <span className="text-red-500">*</span></label>
                          <input type="text" value={requestForm.topic} onChange={(e) => setRequestForm({ ...requestForm, topic: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0A2463] focus:outline-none" placeholder="What would you like to discuss?" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-1">Duration</label>
                          <select value={requestForm.duration_minutes} onChange={(e) => setRequestForm({ ...requestForm, duration_minutes: parseInt(e.target.value) })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0A2463] focus:outline-none">
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>60 minutes</option>
                            <option value={90}>90 minutes</option>
                          </select>
                        </div>
                        {/* Estimated Price */}
                        {requestModal.mentor.hourlyRate > 0 && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-emerald-900">Estimated Session Cost</p>
                                <p className="text-xs text-emerald-700 mt-0.5">${requestModal.mentor.hourlyRate}/hr x {requestForm.duration_minutes} min</p>
                              </div>
                              <p className="text-2xl font-bold text-emerald-700">${(Math.round(requestModal.mentor.hourlyRate * (requestForm.duration_minutes / 60) * 100) / 100).toFixed(2)}</p>
                            </div>
                          </div>
                        )}
                        {requestModal.sessionType === 'scheduled' && (
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1">Proposed Date &amp; Time</label>
                            <input type="datetime-local" value={requestForm.proposed_datetime} onChange={(e) => setRequestForm({ ...requestForm, proposed_datetime: e.target.value })} min={new Date().toISOString().slice(0, 16)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0A2463] focus:outline-none" />
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-1">Message (optional)</label>
                          <textarea value={requestForm.message} onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })} rows={3} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0A2463] focus:outline-none resize-none" placeholder="Add any context or specific questions for your mentor..." />
                        </div>
                        {requestStatus === 'error' && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{requestError}</div>}
                        <button onClick={submitRequest} disabled={!requestForm.topic.trim() || requestStatus === 'loading'} className="w-full bg-[#0A2463] hover:bg-[#0A2463]/90 text-white py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                          {requestStatus === 'loading' ? <><Loader2 className="w-5 h-5 animate-spin" />Sending...</> : <><CheckCircle className="w-5 h-5" />Send Request</>}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  return null;
}