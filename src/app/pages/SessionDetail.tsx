import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Send,
  Paperclip,
  Sparkles,
  CheckCircle,
  Video,
  Edit,
  User,
  FileText,
  MessageSquare
} from 'lucide-react';

export function SessionDetail() {
  const [showFullAgenda, setShowFullAgenda] = useState(false);
  const [message, setMessage] = useState('');
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const [canReschedule, setCanReschedule] = useState(false);

  // Session data
  const session = {
    id: 1,
    mentee: {
      name: 'Sarah Johnson',
      avatar: 'SJ',
      role: 'Founder',
      industry: 'B2B SaaS',
      fiveDProfile: {
        drive: 92,
        discipline: 88,
        decisionQuality: 85,
        dialogue: 90,
        dynamism: 87
      }
    },
    date: 'March 1, 2026',
    time: '2:00 PM EST',
    duration: '60 min',
    type: 'Scheduled',
    stage: 'Agenda Preparation',
    scheduledDateTime: new Date('2026-03-01T14:00:00'),
    bigQuestion: {
      title: 'How do I transition from a product-focused startup to a platform strategy that supports multiple customer segments without losing our core value proposition?',
      category: ['Strategy', 'Product', 'Growth'],
      created: 'Feb 25, 2026'
    },
    aiAgenda: [
      {
        id: 1,
        question: 'What are the key characteristics of your current product that resonate most with your existing customer base?',
        status: 'completed',
        completed: true
      },
      {
        id: 2,
        question: 'Which customer segments are you considering adding, and what specific needs do they have?',
        status: 'active',
        completed: false
      },
      {
        id: 3,
        question: 'What infrastructure changes would be required to support a multi-segment platform?',
        status: 'pending',
        completed: false
      },
      {
        id: 4,
        question: 'How will you measure success in the platform transition without compromising your core metrics?',
        status: 'pending',
        completed: false
      },
      {
        id: 5,
        question: 'What is your timeline and risk mitigation strategy for this transition?',
        status: 'pending',
        completed: false
      }
    ]
  };

  // Calculate hours until session
  useEffect(() => {
    const calculateCanReschedule = () => {
      const now = new Date();
      const sessionTime = session.scheduledDateTime;
      const hoursUntilSession = (sessionTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      setCanReschedule(hoursUntilSession > 12);
    };

    calculateCanReschedule();
    const interval = setInterval(calculateCanReschedule, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [session.scheduledDateTime]);

  const completedQuestions = session.aiAgenda.filter(q => q.completed).length;
  const totalQuestions = session.aiAgenda.length;
  const progressPercentage = Math.round((completedQuestions / totalQuestions) * 100);

  const activeQuestion = session.aiAgenda.find(q => q.status === 'active');

  const messages = [
    {
      id: 1,
      sender: 'mentee',
      name: 'Sarah Johnson',
      text: 'Hi! Thank you so much for accepting this session. I\'m really excited to discuss our platform strategy.',
      timestamp: '9:30 AM',
      date: 'Feb 28'
    },
    {
      id: 2,
      sender: 'mentor',
      name: 'You',
      text: 'Great to connect with you! I\'ve reviewed your background. Let\'s structure our conversation around the AI-generated agenda to make sure we cover all critical aspects.',
      timestamp: '10:15 AM',
      date: 'Feb 28'
    },
    {
      id: 3,
      sender: 'mentee',
      name: 'Sarah Johnson',
      text: 'Perfect! I\'ve already answered the first question in the prep document. Would you like me to share more context about our current customer segments?',
      timestamp: '11:20 AM',
      date: 'Today',
      isNew: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content Area */}
        <div className="flex-1 p-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <a href="/app/mentor/upcoming-sessions" className="text-emerald-600 hover:underline text-sm">
              ← Back to Upcoming Sessions
            </a>
          </div>

          {/* Section 1: Session Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between gap-6">
              {/* Left: Mentee Profile */}
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                    {session.mentee.avatar}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{session.mentee.name}</h2>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {session.mentee.role}
                      </span>
                      <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {session.mentee.industry}
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
                    {Object.entries(session.mentee.fiveDProfile).map(([key, value]) => (
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

              {/* Center: Session Details */}
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Session Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{session.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{session.time} · {session.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Video className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{session.type}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900 mb-1">Current Stage</h4>
                      <p className="text-sm text-blue-700">{session.stage}</p>
                    </div>
                  </div>
                </div>

                {/* Reschedule Button */}
                <div className="mt-4">
                  {canReschedule ? (
                    <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <Edit className="w-4 h-4" />
                      Reschedule Session
                    </button>
                  ) : (
                    <div className="relative group">
                      <button 
                        disabled
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-400 bg-gray-50 cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Rescheduling Locked
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 bg-gray-900 text-white text-xs rounded-lg p-2 z-10">
                        Session changes are not allowed within 12 hours of the scheduled start time.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: System Alerts */}
              <div className="flex-1">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">System Alerts</h3>
                  <div className="space-y-2">
                    {hasNewMessage && (
                      <div className="flex items-start gap-2 p-2 bg-red-50 rounded border border-red-200">
                        <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1.5"></span>
                        <div>
                          <p className="text-xs font-medium text-red-900">New Message</p>
                          <p className="text-xs text-red-600">Mentee replied 2 hours ago</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></span>
                      <div>
                        <p className="text-xs font-medium text-blue-900">Question Updated</p>
                        <p className="text-xs text-blue-600">Mentee answered sub-question 1</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-amber-50 rounded border border-amber-200">
                      <span className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0 mt-1.5"></span>
                      <div>
                        <p className="text-xs font-medium text-amber-900">Reminder</p>
                        <p className="text-xs text-amber-600">Session starts in 5 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Question Structure Area */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Question Structure</h2>

            {/* A. Initial Big Question */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Initial Big Question</h3>
                <span className="text-xs text-gray-500">{session.bigQuestion.created}</span>
              </div>
              <p className="text-gray-900 mb-3">{session.bigQuestion.title}</p>
              <div className="flex flex-wrap gap-2">
                {session.bigQuestion.category.map((cat, index) => (
                  <span key={index} className="text-xs bg-[#0A2463] text-white px-2 py-1 rounded">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* B. AI Structured Question Agenda */}
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#0A2463]" />
                  <h3 className="text-sm font-semibold text-gray-900">AI Structured Agenda</h3>
                </div>
                <button
                  onClick={() => setShowFullAgenda(!showFullAgenda)}
                  className="text-sm text-[#0A2463] hover:underline flex items-center gap-1"
                >
                  {showFullAgenda ? (
                    <>Hide Agenda <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>View Full Agenda <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              </div>

              {showFullAgenda ? (
                <div className="space-y-2">
                  {session.aiAgenda.map((item, index) => (
                    <div 
                      key={item.id}
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        item.status === 'completed' 
                          ? 'bg-emerald-50 border border-emerald-200' 
                          : item.status === 'active'
                          ? 'bg-blue-50 border-2 border-blue-400'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {item.completed ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-medium text-gray-500">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{item.question}</p>
                        {item.status === 'active' && (
                          <span className="inline-block mt-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                            Current Focus
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {session.aiAgenda.slice(0, 3).map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-gray-400">•</span>
                      <span className="line-clamp-1">{item.question}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* C. Current Active Question */}
            {activeQuestion && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-400 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-blue-900">Current Active Question</h3>
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                    Discussion Ongoing
                  </span>
                </div>
                <p className="text-gray-900">{activeQuestion.question}</p>
              </div>
            )}
          </div>

          {/* Section 3: Decision Progress Tracker */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Decision Progress Tracker</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Big Question Completion Progress</h3>
                <span className="text-2xl font-bold text-emerald-600">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className="bg-emerald-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${progressPercentage}%` }}
                >
                  {progressPercentage > 10 && (
                    <span className="text-xs text-white font-medium">{progressPercentage}%</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{completedQuestions} of {totalQuestions} sub-questions completed</span>
                <span className="text-xs text-gray-500">Updated 2 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Communication Panel (Right Side Fixed) */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-screen sticky top-0">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Messages
            </h2>
            {hasNewMessage && (
              <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-red-700 font-medium">New Message Received</span>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`${msg.sender === 'mentor' ? 'ml-8' : 'mr-8'} ${msg.isNew ? 'animate-pulse' : ''}`}
              >
                <div className={`rounded-lg p-3 ${
                  msg.sender === 'mentor' 
                    ? 'bg-emerald-100 text-gray-900' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold">{msg.name}</span>
                    {msg.isNew && (
                      <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">New</span>
                    )}
                  </div>
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs text-gray-500 mt-2">{msg.date} · {msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="mb-2">
              <button className="text-xs text-[#0A2463] hover:underline flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Get AI Suggestion
              </button>
            </div>
            <div className="flex gap-2">
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Paperclip className="w-4 h-4 text-gray-600" />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
              <button className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Press Enter to send</p>
          </div>
        </div>
      </div>
    </div>
  );
}
