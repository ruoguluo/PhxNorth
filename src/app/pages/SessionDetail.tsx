import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
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
  MessageSquare,
  Loader2,
  ArrowLeft,
  Wifi,
  WifiOff,
  FileText,
  Download
} from 'lucide-react';
import { mentorshipAPI, profileAPI, messagesAPI } from '@/lib/api';
import type { MessageResponse } from '@/lib/api';
import { discProfileAPI } from '@/lib/disc-api';
import { useAuth } from '@/lib/auth-context';

// Types
interface Session {
  id: number;
  request_id: number | null;
  mentor_id: number;
  mentee_id: number;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  topic: string | null;
  notes: string | null;
  rating: number | null;
  feedback: string | null;
  price: number;
  created_at: string;
  mentee_name: string | null;
  mentor_name: string | null;
  mentee_email: string | null;
  mentor_email: string | null;
}

interface UserProfile {
  id: number;
  full_name: string;
  role?: string;
  industry?: string;
  avatar_url?: string;
}

interface DISCProfile {
  scores: {
    D: number;
    I: number;
    S: number;
    C: number;
  };
  confidence: number;
}

interface AgendaItem {
  id: number;
  question: string;
  status: 'completed' | 'active' | 'pending';
  completed: boolean;
}

interface Message {
  id: number;
  sender: 'mentor' | 'mentee';
  name: string;
  text: string;
  timestamp: string;
  date: string;
  isNew?: boolean;
  fileUrl?: string | null;
  fileName?: string | null;
}

interface WSMessage {
  id: number;
  session_id: number;
  sender_id: number;
  sender_role: 'mentor' | 'mentee';
  sender_name: string;
  content: string;
  file_url: string | null;
  file_name: string | null;
  is_read: boolean;
  created_at: string;
}

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif'];
const isImageFile = (name: string | null | undefined): boolean => {
  if (!name) return false;
  const ext = name.toLowerCase().substring(name.lastIndexOf('.'));
  return IMAGE_EXTENSIONS.includes(ext);
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short' });
};

const formatMessageTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const formatMessageDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getStatusStage = (status: string): string => {
  const stageMap: Record<string, string> = {
    'upcoming': 'Agenda Preparation',
    'confirmed': 'Confirmed',
    'in_progress': 'In Session',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };
  return stageMap[status.toLowerCase()] || 'Preparation';
};

export function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [counterpartyProfile, setCounterpartyProfile] = useState<UserProfile | null>(null);
  const [discProfile, setDiscProfile] = useState<DISCProfile | null>(null);
  // Determine if the current user is the mentor in this session
  const isMentor = session ? user?.id === session.mentor_id : true;
  const [showFullAgenda, setShowFullAgenda] = useState(false);
  const [message, setMessage] = useState('');
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [canReschedule, setCanReschedule] = useState(false);

  // WebSocket state
  const wsRef = useRef<WebSocket | null>(null);
  const wsCleanedUp = useRef(false);
  const [wsConnected, setWsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Mock agenda for now - this would come from a session prep/agenda API
  const [aiAgenda] = useState<AgendaItem[]>([
    {
      id: 1,
      question: 'What are your main career goals for the next 1-3 years?',
      status: 'completed',
      completed: true
    },
    {
      id: 2,
      question: 'What specific challenges are you facing in your current role?',
      status: 'active',
      completed: false
    },
    {
      id: 3,
      question: 'What skills would you like to develop through mentorship?',
      status: 'pending',
      completed: false
    },
    {
      id: 4,
      question: 'How do you prefer to receive feedback and guidance?',
      status: 'pending',
      completed: false
    }
  ]);

  // Real messages from API/WebSocket
  const [messages, setMessages] = useState<Message[]>([]);

  // Fetch message history
  const fetchMessageHistory = async (sessionId: number) => {
    try {
      const data = await messagesAPI.getHistory(sessionId);
      const formattedMessages: Message[] = data.map(msg => ({
        id: msg.id,
        sender: msg.sender_role,
        name: msg.sender_name || 'Unknown',
        text: msg.content,
        fileUrl: msg.file_url,
        fileName: msg.file_name,
        timestamp: formatMessageTime(msg.created_at),
        date: formatMessageDate(msg.created_at),
        isNew: false
      }));

      setMessages(formattedMessages);

      // Mark messages as read when we load history
      await messagesAPI.markRead(sessionId).catch(() => {});
    } catch (err) {
      console.log('Message history not available yet');
    }
  };

  // Connect to WebSocket
  const connectWebSocket = (sessionId: number) => {
    // Close any existing connection first
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const token = localStorage.getItem('phxnorth_token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    // Use ws:// for HTTP or wss:// for HTTPS
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/api/messages/ws/session/${sessionId}?token=${token}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data) as WSMessage;

      // Determine if this message is from the other party (not us)
      const isFromOther = data.sender_id !== user?.id;

      const newMessage: Message = {
        id: data.id,
        sender: data.sender_role,
        name: data.sender_name,
        text: data.content,
        fileUrl: data.file_url,
        fileName: data.file_name,
        timestamp: formatMessageTime(data.created_at),
        date: formatMessageDate(data.created_at),
        isNew: isFromOther
      };

      // Deduplicate by message ID to prevent doubles from StrictMode
      setMessages(prev => {
        if (prev.some(m => m.id === data.id)) return prev;
        return [...prev, newMessage];
      });

      if (isFromOther) {
        setHasNewMessage(true);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setWsConnected(false);
      // Only reconnect if component hasn't been cleaned up
      if (!wsCleanedUp.current) {
        setTimeout(() => {
          if (document.visibilityState !== 'hidden' && !wsCleanedUp.current) {
            connectWebSocket(sessionId);
          }
        }, 3000);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWsConnected(false);
    };

    wsRef.current = ws;
  };

  // Send message via WebSocket
  const handleSendMessage = () => {
    if (!message.trim() || !wsRef.current) return;

    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ content: message }));
      setMessage('');
    } else {
      console.error('WebSocket not connected');
    }
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    setUploading(true);
    try {
      const resp = await messagesAPI.uploadFile(parseInt(id), file);
      // Add the message locally (sender won't get WS echo for REST uploads)
      const newMessage: Message = {
        id: resp.id,
        sender: resp.sender_role,
        name: resp.sender_name || user?.full_name || 'You',
        text: resp.content,
        fileUrl: resp.file_url,
        fileName: resp.file_name,
        timestamp: formatMessageTime(resp.created_at),
        date: formatMessageDate(resp.created_at),
        isNew: false
      };
      setMessages(prev => {
        if (prev.some(m => m.id === resp.id)) return prev;
        return [...prev, newMessage];
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'File upload failed');
    } finally {
      setUploading(false);
      // Reset input so same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Scroll to bottom of messages without stealing focus
  const prevMsgCount = useRef(0);
  useEffect(() => {
    if (messages.length > prevMsgCount.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    prevMsgCount.current = messages.length;
  }, [messages]);

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch session data
        const sessionData = await mentorshipAPI.getSession(parseInt(id)) as Session;
        setSession(sessionData);

        // Calculate reschedule availability
        const sessionTime = new Date(sessionData.scheduled_at);
        const now = new Date();
        const hoursUntilSession = (sessionTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        setCanReschedule(hoursUntilSession > 12);

        // Fetch message history
        await fetchMessageHistory(parseInt(id));

        // Connect WebSocket
        connectWebSocket(parseInt(id));

        // Determine if current user is the mentor or mentee in this session
        const viewerIsMentor = user?.id === sessionData.mentor_id;

        // Fetch the counterparty's profile (mentor sees mentee, mentee sees mentor)
        const counterpartyId = viewerIsMentor ? sessionData.mentee_id : sessionData.mentor_id;
        const counterpartyName = viewerIsMentor
          ? (sessionData.mentee_name || 'Unknown Mentee')
          : (sessionData.mentor_name || 'Unknown Mentor');
        const counterpartyEmail = viewerIsMentor
          ? sessionData.mentee_email
          : sessionData.mentor_email;

        if (counterpartyId) {
          try {
            const profile = await profileAPI.getPublic(counterpartyId.toString()) as UserProfile;
            setCounterpartyProfile(profile);
          } catch {
            setCounterpartyProfile({
              id: counterpartyId,
              full_name: counterpartyName
            });
          }

          // Fetch the counterparty's DISC profile by their email
          if (counterpartyEmail) {
            try {
              const token = localStorage.getItem('phxnorth_token');
              const discResp = await fetch(
                `/api/v1/disc-profile-by-email?email=${encodeURIComponent(counterpartyEmail)}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
              );
              if (discResp.ok) {
                const disc = await discResp.json();
                if (disc.scores) {
                  setDiscProfile({
                    scores: disc.scores,
                    confidence: disc.confidence ?? 0
                  });
                }
              }
            } catch {
              // DISC profile not available
            }
          }
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load session');
      } finally {
        setLoading(false);
      }
    };

    wsCleanedUp.current = false;
    fetchSessionData();

    // Cleanup WebSocket on unmount
    return () => {
      wsCleanedUp.current = true;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [id]);

  // Update reschedule check periodically
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      const sessionTime = new Date(session.scheduled_at);
      const now = new Date();
      const hoursUntilSession = (sessionTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      setCanReschedule(hoursUntilSession > 12);
    }, 60000);

    return () => clearInterval(interval);
  }, [session]);

  const completedQuestions = aiAgenda.filter(q => q.completed).length;
  const totalQuestions = aiAgenda.length;
  const progressPercentage = Math.round((completedQuestions / totalQuestions) * 100);
  const activeQuestion = aiAgenda.find(q => q.status === 'active');

  // Map DISC scores to 5D profile
  const hasDiscData = discProfile &&
    (discProfile.scores.D > 0 || discProfile.scores.I > 0 ||
     discProfile.scores.S > 0 || discProfile.scores.C > 0);

  // DISC scores from /disc-profile-by-email are already 0-100 range
  const fiveDProfile = hasDiscData ? {
    drive: Math.round(discProfile!.scores.D),
    discipline: Math.round(discProfile!.scores.C),
    decisionQuality: Math.round((discProfile!.scores.D + discProfile!.scores.C) / 2),
    dialogue: Math.round(discProfile!.scores.I),
    dynamism: Math.round((discProfile!.scores.D + discProfile!.scores.I) / 2)
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <span className="text-gray-600">Loading session...</span>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Error Loading Session</h2>
          <p className="text-gray-600 text-center mb-4">{error || 'Session not found'}</p>
           <a
             href={isMentor ? "/app/mentor/upcoming" : "/app/dashboard"}
             className="block w-full text-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
           >
             Back to Sessions
           </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content Area */}
        <div className="flex-1 p-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <a href={isMentor ? "/app/mentor/upcoming" : "/app/dashboard"} className="text-emerald-600 hover:underline text-sm flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              {isMentor ? 'Back to Upcoming Sessions' : 'Back to Dashboard'}
            </a>
          </div>

          {/* Section 1: Session Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between gap-6">
              {/* Left: Counterparty Profile */}
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                    {getInitials(counterpartyProfile?.full_name || (isMentor ? session.mentee_name : session.mentor_name) || 'Unknown')}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {counterpartyProfile?.full_name || (isMentor ? session.mentee_name : session.mentor_name) || 'Unknown'}
                    </h2>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {counterpartyProfile?.role || (isMentor ? 'Mentee' : 'Mentor')}
                      </span>
                      <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {counterpartyProfile?.industry || 'Technology'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5D Profile Snapshot */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">5D Profile Snapshot</h3>
                    <a
                      href={`/profile/${encodeURIComponent(counterpartyProfile?.full_name || (isMentor ? session.mentee_name : session.mentor_name) || '')}`}
                      className="text-xs text-emerald-600 hover:underline font-medium"
                    >
                      View Full Profile
                    </a>
                  </div>
                  {fiveDProfile ? (
                    <div className="space-y-2">
                      {Object.entries(fiveDProfile).map(([key, value]) => (
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
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">No 5D profile data yet</p>
                      <p className="text-xs text-gray-400 mt-1">Mentee needs to upload a CV first</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Center: Session Details */}
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Session Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{formatDate(session.scheduled_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{formatTime(session.scheduled_at)} · {session.duration_minutes} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Video className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Video Call</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900 mb-1">Current Stage</h4>
                      <p className="text-sm text-blue-700">{getStatusStage(session.status)}</p>
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
                          <p className="text-xs text-red-600">Check messages panel</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></span>
                      <div>
                        <p className="text-xs font-medium text-blue-900">Session Confirmed</p>
                        <p className="text-xs text-blue-600">Ready for the call</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-amber-50 rounded border border-amber-200">
                      <span className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0 mt-1.5"></span>
                      <div>
                        <p className="text-xs font-medium text-amber-900">Reminder</p>
                        <p className="text-xs text-amber-600">Join 5 minutes early</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Question Structure Area */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Session Agenda</h2>

            {/* A. Initial Big Question */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Session Topic</h3>
                <span className="text-xs text-gray-500">{formatDate(session.created_at || new Date().toISOString())}</span>
              </div>
              <p className="text-gray-900 mb-3">{session.topic || 'General mentorship discussion'}</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-[#0A2463] text-white px-2 py-1 rounded">Mentorship</span>
                <span className="text-xs bg-[#0A2463] text-white px-2 py-1 rounded">Career</span>
              </div>
            </div>

            {/* B. AI Structured Question Agenda */}
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#0A2463]" />
                  <h3 className="text-sm font-semibold text-gray-900">Discussion Agenda</h3>
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
                  {aiAgenda.map((item, index) => (
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
                  {aiAgenda.slice(0, 3).map((item) => (
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Discussion Progress</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Agenda Completion</h3>
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
                <span>{completedQuestions} of {totalQuestions} topics discussed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Communication Panel (Right Side Fixed) */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-screen sticky top-0">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Messages
              </h2>
              <div className="flex items-center gap-2">
                {wsConnected ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-600">
                    <Wifi className="w-3 h-3" />
                    Live
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <WifiOff className="w-3 h-3" />
                    Offline
                  </span>
                )}
              </div>
            </div>
            {hasNewMessage && (
              <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-red-700 font-medium">New Message Received</span>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No messages yet</p>
                <p className="text-xs mt-1">Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => {
                // Align own messages to the right, other's to the left
                const isOwnMessage = !msg.isNew && msg.sender === (isMentor ? 'mentor' : 'mentee');
                return (
                <div
                  key={msg.id}
                  className={`${isOwnMessage ? 'ml-8' : 'mr-8'} ${msg.isNew ? 'animate-pulse' : ''}`}
                >
                  <div className={`rounded-lg p-3 ${
                    isOwnMessage
                      ? 'bg-emerald-100 text-gray-900'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold">{msg.name}</span>
                      {msg.isNew && (
                        <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">New</span>
                      )}
                    </div>
                    {msg.fileUrl ? (
                      <div className="mt-1">
                        {isImageFile(msg.fileName) ? (
                          <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                            <img
                              src={msg.fileUrl}
                              alt={msg.fileName || 'Image'}
                              className="max-w-[240px] max-h-[180px] rounded-md border border-gray-200 cursor-pointer hover:opacity-90"
                            />
                          </a>
                        ) : (
                          <a
                            href={msg.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 bg-white/60 rounded-md border border-gray-200 hover:bg-white/80 transition-colors"
                          >
                            <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700 truncate flex-1">{msg.fileName || 'File'}</span>
                            <Download className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          </a>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm">{msg.text}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">{msg.date} · {msg.timestamp}</p>
                  </div>
                </div>
              );})
            )}
            <div ref={messagesEndRef} />
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
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.gif"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                title="Attach file (PDF, DOCX, TXT, images)"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                ) : (
                  <Paperclip className="w-4 h-4 text-gray-600" />
                )}
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={wsConnected ? "Type your message..." : "Connecting..."}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!wsConnected || !message.trim()}
                className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {wsConnected ? 'Press Enter to send' : 'Reconnecting to chat...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
