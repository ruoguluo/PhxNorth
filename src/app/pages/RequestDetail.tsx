import { useState } from 'react';
import { 
  GripVertical,
  Plus,
  Trash2,
  Clock,
  FileText,
  Sparkles,
  Send,
  Edit3,
  Check,
  AlertCircle
} from 'lucide-react';

interface SubQuestion {
  id: string;
  text: string;
  estimatedMinutes: number;
}

export function RequestDetail() {
  const [bigQuestion, setBigQuestion] = useState(
    'How do I build a scalable AI infrastructure that can handle 10x user growth while maintaining cost efficiency?'
  );
  const [clarifyingNotes, setClarifyingNotes] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState(
    'A clear roadmap for scaling AI infrastructure with specific cost optimization strategies'
  );
  const [isEditingBigQuestion, setIsEditingBigQuestion] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const [subQuestions, setSubQuestions] = useState<SubQuestion[]>([
    {
      id: '1',
      text: 'What is your current AI infrastructure setup and what are the main bottlenecks?',
      estimatedMinutes: 15
    },
    {
      id: '2',
      text: 'What specific user growth projection are you planning for and over what timeline?',
      estimatedMinutes: 10
    },
    {
      id: '3',
      text: 'What are your current cost structures and which components are most expensive?',
      estimatedMinutes: 15
    },
    {
      id: '4',
      text: 'What scaling strategies have you already considered or attempted?',
      estimatedMinutes: 20
    },
    {
      id: '5',
      text: 'What are the trade-offs you\'re willing to make between performance, cost, and complexity?',
      estimatedMinutes: 20
    },
    {
      id: '6',
      text: 'What is your timeline and resource availability for implementing these changes?',
      estimatedMinutes: 10
    }
  ]);

  const mentee = {
    name: 'David Park',
    avatar: 'DP',
    role: 'Founder',
    industry: 'AI/ML',
    fiveDProfile: {
      drive: 94,
      discipline: 87,
      decisionQuality: 90,
      dialogue: 88,
      dynamism: 92
    },
    submittedDate: 'Feb 28, 2026',
    suggestedType: 'Structured Deep-Dive'
  };

  const totalTime = subQuestions.reduce((sum, q) => sum + q.estimatedMinutes, 0);

  const addSubQuestion = () => {
    const newQuestion: SubQuestion = {
      id: Date.now().toString(),
      text: '',
      estimatedMinutes: 10
    };
    setSubQuestions([...subQuestions, newQuestion]);
  };

  const deleteSubQuestion = (id: string) => {
    setSubQuestions(subQuestions.filter(q => q.id !== id));
  };

  const updateSubQuestion = (id: string, field: keyof SubQuestion, value: string | number) => {
    setSubQuestions(subQuestions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const moveSubQuestion = (index: number, direction: 'up' | 'down') => {
    const newQuestions = [...subQuestions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < subQuestions.length) {
      [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
      setSubQuestions(newQuestions);
    }
  };

  const sendStructuredPlan = () => {
    setIsPending(true);
    // In a real app, this would send the structured plan to the mentee
    alert('Structured plan sent to mentee for confirmation!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <a href="/app/mentor/requests" className="text-emerald-600 hover:underline text-sm">
            ← Back to Mentorship Requests
          </a>
        </div>

        {/* Status Banner (if pending) */}
        {isPending && (
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-900">Waiting for mentee confirmation</p>
              <p className="text-sm text-blue-700">The structured plan has been sent to the mentee for review</p>
            </div>
          </div>
        )}

        {/* Top Section - Mentee Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between gap-6">
            {/* Left: Mentee Profile */}
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {mentee.avatar}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{mentee.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {mentee.role}
                    </span>
                    <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {mentee.industry}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5D Profile Snapshot */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">5D Profile Snapshot</h3>
                  <button className="text-xs text-emerald-600 hover:underline font-medium">
                    View Full Profile
                  </button>
                </div>
                <div className="space-y-2">
                  {Object.entries(mentee.fiveDProfile).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="font-medium text-gray-900">{value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-emerald-600 h-1.5 rounded-full" 
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Request Info */}
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Request Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Submitted</p>
                    <p className="text-sm font-medium text-gray-900">{mentee.submittedDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Suggested Session Type</p>
                    <p className="text-sm font-medium text-gray-900">{mentee.suggestedType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">AI Estimated Total Time</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <p className="text-sm font-medium text-gray-900">{totalTime} minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Initial Big Question */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Initial Big Question</h2>
            <button
              onClick={() => setIsEditingBigQuestion(!isEditingBigQuestion)}
              className="text-sm text-emerald-600 hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-4 h-4" />
              {isEditingBigQuestion ? 'Save' : 'Edit'}
            </button>
          </div>

          {isEditingBigQuestion ? (
            <textarea
              value={bigQuestion}
              onChange={(e) => setBigQuestion(e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
              rows={3}
            />
          ) : (
            <p className="text-gray-900 text-lg mb-4 leading-relaxed">{bigQuestion}</p>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Clarifying Notes (Optional)
            </label>
            <textarea
              value={clarifyingNotes}
              onChange={(e) => setClarifyingNotes(e.target.value)}
              placeholder="Add any clarifying context or notes for the mentee..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              rows={2}
            />
          </div>
        </div>

        {/* Section 2: AI Structured Question Agenda (Editable Builder) */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-[#0A2463]" />
                <h2 className="text-xl font-bold text-gray-900">AI Structured Question Agenda</h2>
              </div>
              <p className="text-sm text-gray-600">Edit, reorder, add, or remove sub-questions</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Estimated Time</p>
              <p className="text-2xl font-bold text-emerald-600">{totalTime} min</p>
            </div>
          </div>

          {/* Sub-Question Blocks */}
          <div className="space-y-3 mb-4">
            {subQuestions.map((question, index) => (
              <div 
                key={question.id}
                className="border-2 border-blue-200 bg-blue-50/50 rounded-lg p-4 hover:border-blue-400 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Drag Handle */}
                  <div className="flex flex-col gap-1 pt-2">
                    <button
                      onClick={() => moveSubQuestion(index, 'up')}
                      disabled={index === 0}
                      className={`p-1 rounded hover:bg-blue-200 transition-colors ${
                        index === 0 ? 'opacity-30 cursor-not-allowed' : ''
                      }`}
                    >
                      <GripVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    <button
                      onClick={() => moveSubQuestion(index, 'down')}
                      disabled={index === subQuestions.length - 1}
                      className={`p-1 rounded hover:bg-blue-200 transition-colors ${
                        index === subQuestions.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                      }`}
                    >
                      <GripVertical className="w-5 h-5 text-gray-400 rotate-180" />
                    </button>
                  </div>

                  {/* Number Badge */}
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold mt-1">
                    {index + 1}
                  </div>

                  {/* Question Content */}
                  <div className="flex-1">
                    <textarea
                      value={question.text}
                      onChange={(e) => updateSubQuestion(question.id, 'text', e.target.value)}
                      placeholder="Enter sub-question..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                      rows={2}
                    />
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          value={question.estimatedMinutes}
                          onChange={(e) => updateSubQuestion(question.id, 'estimatedMinutes', parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="1"
                        />
                        <span className="text-sm text-gray-600">minutes</span>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteSubQuestion(question.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors mt-1"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Sub-Question Button */}
          <button
            onClick={addSubQuestion}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Sub-Question
          </button>
        </div>

        {/* Section 3: Session Structure Summary Panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Session Structure Summary</h2>
          
          <div className="grid grid-cols-3 gap-6 mb-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Number of Sub-Questions</p>
              <p className="text-3xl font-bold text-gray-900">{subQuestions.length}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Total Estimated Time</p>
              <p className="text-3xl font-bold text-emerald-600">{totalTime} min</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Session Format</p>
              <p className="text-lg font-semibold text-gray-900">Structured</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Expected Outcome Summary
            </label>
            <textarea
              value={expectedOutcome}
              onChange={(e) => setExpectedOutcome(e.target.value)}
              placeholder="Describe what the mentee will achieve from this session..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              rows={2}
            />
          </div>
        </div>

        {/* Section 4: Confirmation Flow */}
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border-2 border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Ready to Send Structured Plan?</h3>
              <p className="text-sm text-gray-600">
                The mentee will receive your structured agenda and must confirm before the session is officially created
              </p>
            </div>
            <button
              onClick={sendStructuredPlan}
              disabled={isPending}
              className={`px-8 py-4 rounded-xl font-semibold shadow-lg transition-all flex items-center gap-2 ${
                isPending
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#0A2463] text-white hover:bg-[#0A2463]/90'
              }`}
            >
              <Send className="w-5 h-5" />
              Send Structured Plan to Mentee
            </button>
          </div>

          {isPending && (
            <div className="mt-4 pt-4 border-t border-blue-200 flex items-center gap-2 text-sm text-blue-700">
              <Check className="w-4 h-4" />
              Plan sent successfully. Waiting for mentee confirmation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
