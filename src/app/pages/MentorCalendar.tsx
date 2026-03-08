import { useState, useEffect, useCallback } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Search,
  MessageSquare,
  Video,
  FileText,
  ChevronDown,
  Globe,
} from 'lucide-react';
import { mentorshipAPI } from '../../lib/api';

type ViewMode = 'day' | 'week' | 'month';

interface Timezone {
  id: string;
  name: string;
  code: string;
  offset: number;
}

interface Appointment {
  id: string;
  menteeName: string;
  menteeAvatar?: string;
  sessionType: 'Scheduled' | 'Instant';
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'awaiting reply';
  topic: string;
  bigQuestion?: string;
}

const availableTimezones: Timezone[] = [
  { id: '1', name: 'London', code: 'GMT', offset: 0 },
  { id: '2', name: 'Beijing', code: 'CST', offset: 8 },
  { id: '3', name: 'San Francisco', code: 'PT', offset: -8 },
  { id: '4', name: 'New York', code: 'ET', offset: -5 },
  { id: '5', name: 'Tokyo', code: 'JST', offset: 9 },
  { id: '6', name: 'Dubai', code: 'GST', offset: 4 },
];

export function MentorCalendar() {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedTimezones, setSelectedTimezones] = useState<Timezone[]>([
    availableTimezones[0], // London
  ]);
  const [showSecondaryTimezone, setShowSecondaryTimezone] = useState(true);
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchCalendar = useCallback(async () => {
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const data = await mentorshipAPI.getCalendar(month, year);
      setAppointments(
        (data as any[]).map((s: any) => {
          const scheduled = new Date(s.scheduled_at);
          const endDate = new Date(scheduled.getTime() + (s.duration_minutes || 60) * 60000);
          return {
            id: String(s.id),
            menteeName: s.mentee_name || s.mentor_name || 'Participant',
            sessionType: s.type === 'instant' ? 'Instant' as const : 'Scheduled' as const,
            startTime: `${String(scheduled.getHours()).padStart(2, '0')}:${String(scheduled.getMinutes()).padStart(2, '0')}`,
            endTime: `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`,
            status: s.status === 'upcoming' ? 'confirmed' as const : s.status === 'completed' ? 'confirmed' as const : 'pending' as const,
            topic: s.topic || 'Mentorship Session',
            bigQuestion: s.notes,
          };
        })
      );
    } catch (err) {
      console.error('Failed to fetch calendar:', err);
    }
  }, [currentDate]);

  useEffect(() => { fetchCalendar(); }, [fetchCalendar]);

  const addTimezone = (timezone: Timezone) => {
    if (selectedTimezones.length < 3 && !selectedTimezones.find(tz => tz.id === timezone.id)) {
      setSelectedTimezones([...selectedTimezones, timezone]);
    }
    setShowTimezoneDropdown(false);
  };

  const removeTimezone = (timezoneId: string) => {
    if (selectedTimezones.length > 1) {
      setSelectedTimezones(selectedTimezones.filter(tz => tz.id !== timezoneId));
    }
  };

  const convertTime = (time: string, fromOffset: number, toOffset: number) => {
    const [hours, minutes] = time.split(':').map(Number);
    let newHours = hours + (toOffset - fromOffset);

    if (newHours < 0) newHours += 24;
    if (newHours >= 24) newHours -= 24;

    return `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 to 20:00

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const formatDateRange = () => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } else if (viewMode === 'week') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
          <p className="text-gray-600">Manage your appointments across time zones</p>
        </div>

        {/* Control Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            {/* Left - Date Navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                Today
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateDate('prev')}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="px-4 py-2 min-w-[280px] text-center">
                  <span className="font-semibold text-gray-900">{formatDateRange()}</span>
                </div>
                <button
                  onClick={() => navigateDate('next')}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Center - View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'day'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'week'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'month'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Month
              </button>
            </div>

            {/* Right - Timezone Selector */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {selectedTimezones.map((tz, index) => (
                  <div
                    key={tz.id}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm"
                  >
                    <Globe className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">{tz.name}</span>
                    <span className="text-gray-500">({tz.code})</span>
                    {selectedTimezones.length > 1 && (
                      <button
                        onClick={() => removeTimezone(tz.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    {index < selectedTimezones.length - 1 && (
                      <span className="text-gray-400 mx-1">|</span>
                    )}
                  </div>
                ))}
              </div>
              {selectedTimezones.length < 3 && (
                <div className="relative">
                  <button
                    onClick={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  {showTimezoneDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                      {availableTimezones
                        .filter(tz => !selectedTimezones.find(selected => selected.id === tz.id))
                        .map(tz => (
                          <button
                            key={tz.id}
                            onClick={() => addTimezone(tz)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                          >
                            <div className="font-medium text-gray-900">{tz.name}</div>
                            <div className="text-xs text-gray-500">{tz.code} (UTC{tz.offset >= 0 ? '+' : ''}{tz.offset})</div>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Secondary Timezone Toggle */}
          {selectedTimezones.length > 1 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSecondaryTimezone}
                  onChange={(e) => setShowSecondaryTimezone(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="text-gray-700">Show secondary timezone on events</span>
              </label>
            </div>
          )}
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {viewMode === 'day' && (
            <DayView
              appointments={appointments}
              hours={hours}
              selectedTimezones={selectedTimezones}
              showSecondaryTimezone={showSecondaryTimezone}
              convertTime={convertTime}
              onAppointmentClick={setSelectedAppointment}
            />
          )}
          {viewMode === 'week' && (
            <WeekView
              appointments={appointments}
              hours={hours}
              selectedTimezones={selectedTimezones}
              showSecondaryTimezone={showSecondaryTimezone}
              convertTime={convertTime}
              onAppointmentClick={setSelectedAppointment}
            />
          )}
          {viewMode === 'month' && (
            <MonthView
              appointments={appointments}
              currentDate={currentDate}
              onAppointmentClick={setSelectedAppointment}
            />
          )}
        </div>
      </div>

      {/* Appointment Details Sidebar */}
      {selectedAppointment && (
        <div className="w-96 bg-white border-l border-gray-200 p-6 flex-shrink-0 overflow-y-auto">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Appointment Details</h2>
            <button
              onClick={() => setSelectedAppointment(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mentee Info */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                {selectedAppointment.menteeName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedAppointment.menteeName}</h3>
                <a href="#" className="text-sm text-emerald-600 hover:underline">
                  View 5D Profile →
                </a>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${selectedAppointment.status === 'confirmed'
                  ? 'bg-emerald-100 text-emerald-700'
                  : selectedAppointment.status === 'pending'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-orange-100 text-orange-700'
                  }`}
              >
                {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
              </span>
            </div>

            {/* Time & Type */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{selectedAppointment.startTime} - {selectedAppointment.endTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarIcon className="w-4 h-4" />
                <span>{selectedAppointment.sessionType} Session</span>
              </div>
            </div>

            {/* Multi-timezone times */}
            {selectedTimezones.length > 1 && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Session Times
                </div>
                {selectedTimezones.map(tz => {
                  const convertedStart = convertTime(selectedAppointment.startTime, 0, tz.offset);
                  const convertedEnd = convertTime(selectedAppointment.endTime, 0, tz.offset);
                  return (
                    <div key={tz.id} className="flex items-center justify-between text-sm py-1">
                      <span className="text-gray-600">{tz.name}</span>
                      <span className="font-medium text-gray-900">{convertedStart} - {convertedEnd}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Topic */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Topic</h4>
            <p className="text-sm text-gray-700">{selectedAppointment.topic}</p>
          </div>

          {/* Big Question */}
          {selectedAppointment.bigQuestion && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Big Question</h4>
              <p className="text-sm text-gray-700 italic">"{selectedAppointment.bigQuestion}"</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
              <Video className="w-5 h-5" />
              Join Session
            </button>
            <button className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Send Message
            </button>
            <button className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" />
              View Agenda
            </button>
            <button className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Reschedule
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Day View Component
function DayView({
  appointments,
  hours,
  selectedTimezones,
  showSecondaryTimezone,
  convertTime,
  onAppointmentClick,
}: {
  appointments: Appointment[];
  hours: number[];
  selectedTimezones: Timezone[];
  showSecondaryTimezone: boolean;
  convertTime: (time: string, from: number, to: number) => string;
  onAppointmentClick: (appointment: Appointment) => void;
}) {
  return (
    <div className="overflow-auto">
      <div className="min-w-[600px]">
        {/* Time labels with multi-timezone support */}
        {hours.map(hour => (
          <div key={hour} className="flex border-b border-gray-100">
            {/* Time column(s) */}
            <div className="w-32 flex-shrink-0 py-2 px-4 bg-gray-50 border-r border-gray-200">
              {selectedTimezones.map((tz, index) => (
                <div key={tz.id} className={index === 0 ? 'font-medium text-gray-900' : 'text-xs text-gray-500'}>
                  {convertTime(`${hour}:00`, 0, tz.offset)} {index === 0 ? '' : `(${tz.code})`}
                </div>
              ))}
            </div>
            {/* Appointment area */}
            <div className="flex-1 py-2 px-4 min-h-[80px] relative">
              {appointments
                .filter(apt => parseInt(apt.startTime.split(':')[0]) === hour)
                .map(apt => (
                  <button
                    key={apt.id}
                    onClick={() => onAppointmentClick(apt)}
                    className={`w-full p-3 rounded-lg border-l-4 text-left hover:shadow-md transition-all ${apt.status === 'confirmed'
                      ? 'bg-emerald-50 border-emerald-500'
                      : apt.status === 'pending'
                        ? 'bg-amber-50 border-amber-500'
                        : 'bg-orange-50 border-orange-500'
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {apt.menteeName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">{apt.menteeName}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      {apt.startTime} - {apt.endTime}
                      {showSecondaryTimezone && selectedTimezones.length > 1 && (
                        <span className="ml-2 text-gray-500">
                          | {convertTime(apt.startTime, 0, selectedTimezones[1].offset)} {selectedTimezones[1].code}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{apt.topic}</div>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Week View Component
function WeekView({
  appointments,
  hours,
  selectedTimezones,
  showSecondaryTimezone,
  convertTime,
  onAppointmentClick,
}: {
  appointments: Appointment[];
  hours: number[];
  selectedTimezones: Timezone[];
  showSecondaryTimezone: boolean;
  convertTime: (time: string, from: number, to: number) => string;
  onAppointmentClick: (appointment: Appointment) => void;
}) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="overflow-auto">
      <div className="min-w-[1000px]">
        {/* Week header */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <div className="w-20 flex-shrink-0 p-3 border-r border-gray-200"></div>
          {daysOfWeek.map(day => (
            <div key={day} className="flex-1 p-3 text-center border-r border-gray-200 last:border-r-0">
              <div className="font-semibold text-gray-900 text-sm">{day.slice(0, 3)}</div>
              {selectedTimezones.length > 1 && (
                <div className="text-xs text-gray-500 mt-1">
                  {selectedTimezones.map(tz => tz.code).join(' | ')}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Week grid */}
        {hours.map(hour => (
          <div key={hour} className="flex border-b border-gray-100">
            <div className="w-20 flex-shrink-0 py-2 px-3 bg-gray-50 border-r border-gray-200 text-sm text-gray-600">
              {hour}:00
            </div>
            {daysOfWeek.map((day, dayIndex) => (
              <div key={day} className="flex-1 py-2 px-2 min-h-[60px] border-r border-gray-100 last:border-r-0 relative">
                {/* Show appointments for Monday (dayIndex 0) as example */}
                {dayIndex === 0 && appointments
                  .filter(apt => parseInt(apt.startTime.split(':')[0]) === hour)
                  .map(apt => (
                    <button
                      key={apt.id}
                      onClick={() => onAppointmentClick(apt)}
                      className={`w-full p-2 rounded border-l-2 text-left text-xs hover:shadow-md transition-all ${apt.status === 'confirmed'
                        ? 'bg-emerald-50 border-emerald-500'
                        : apt.status === 'pending'
                          ? 'bg-amber-50 border-amber-500'
                          : 'bg-orange-50 border-orange-500'
                        }`}
                      title={`${apt.menteeName}: ${apt.topic}`}
                    >
                      <div className="font-semibold text-gray-900 truncate">{apt.menteeName}</div>
                      <div className="text-gray-600 truncate">{apt.startTime}</div>
                    </button>
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Month View Component
function MonthView({
  appointments,
  currentDate,
  onAppointmentClick,
}: {
  appointments: Appointment[];
  currentDate: Date;
  onAppointmentClick: (appointment: Appointment) => void;
}) {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for Monday start

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: adjustedFirstDay }, (_, i) => i);

  return (
    <div>
      {/* Month header */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {daysOfWeek.map(day => (
          <div key={day} className="p-3 text-center text-sm font-semibold text-gray-900 border-r border-gray-200 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Month grid */}
      <div className="grid grid-cols-7">
        {emptyDays.map(i => (
          <div key={`empty-${i}`} className="h-24 border-r border-b border-gray-100 bg-gray-50"></div>
        ))}
        {days.map(day => {
          const dayAppointments = appointments.slice(0, Math.floor(Math.random() * 3)); // Mock: random appointments
          return (
            <div
              key={day}
              className="h-24 border-r border-b border-gray-100 p-2 hover:bg-gray-50 transition-colors last:border-r-0"
            >
              <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
              <div className="space-y-1">
                {dayAppointments.map(apt => (
                  <button
                    key={apt.id}
                    onClick={() => onAppointmentClick(apt)}
                    className="w-2 h-2 rounded-full bg-emerald-500 hover:bg-emerald-600"
                    title={apt.menteeName}
                  ></button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
