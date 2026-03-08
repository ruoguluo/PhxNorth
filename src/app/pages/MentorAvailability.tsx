import { useState, useEffect, useCallback } from 'react';
import { mentorshipAPI } from '../../lib/api';
import {
  Globe,
  Clock,
  Plus,
  Trash2,
  Copy,
  ChevronDown,
  X,
  Check
} from 'lucide-react';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  sessionLength: number;
  bufferTime: number;
  enabled: boolean;
}

interface DayAvailability {
  date: string;
  dayName: string;
  slots: TimeSlot[];
}

export function MentorAvailability() {
  const [baseCountry, setBaseCountry] = useState('United States');
  const [baseTimezone, setBaseTimezone] = useState('America/New_York (UTC-5)');
  const [openToCountries, setOpenToCountries] = useState(['United States', 'Canada', 'United Kingdom']);
  const [viewMode, setViewMode] = useState<'weekly' | 'list'>('weekly');
  const [viewAsCountry, setViewAsCountry] = useState('');
  const [showSideBySide, setShowSideBySide] = useState(false);

  // Generate next 14 days
  const generateNext14Days = (): DayAvailability[] => {
    const days: DayAvailability[] = [];
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: dayNames[date.getDay()],
        slots: []
      });
    }
    return days;
  };

  const [availability, setAvailability] = useState<DayAvailability[]>(generateNext14Days());
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load existing availability from API
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const data = await mentorshipAPI.getAvailability();
        if (Array.isArray(data) && data.length > 0) {
          const updated = generateNext14Days();
          data.forEach((slot: any) => {
            const dayIndex = slot.day_of_week;
            if (dayIndex >= 0 && dayIndex < updated.length) {
              updated[dayIndex].slots.push({
                id: `slot-${slot.id}`,
                startTime: slot.start_time || '09:00',
                endTime: slot.end_time || '17:00',
                sessionLength: 60,
                bufferTime: 10,
                enabled: slot.is_active !== false,
              });
            }
          });
          setAvailability(updated);
        }
      } catch (err) {
        console.error('Failed to load availability:', err);
      }
    };
    loadAvailability();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
      const slots = availability.flatMap((day, dayIndex) =>
        day.slots.filter(s => s.enabled).map(slot => ({
          day_of_week: dayIndex % 7,
          start_time: slot.startTime,
          end_time: slot.endTime,
          is_active: slot.enabled,
        }))
      );
      console.log('Saving availability slots:', JSON.stringify(slots));
      await mentorshipAPI.updateAvailability(slots);
      setSaveMessage('Availability saved!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err: any) {
      console.error('Failed to save availability:', err);
      const msg = err?.message || 'Unknown error';
      setSaveMessage(`Save failed: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const addTimeSlot = (dayIndex: number) => {
    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}`,
      startTime: '09:00',
      endTime: '17:00',
      sessionLength: 60,
      bufferTime: 10,
      enabled: true
    };

    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].slots.push(newSlot);
    setAvailability(updatedAvailability);
  };

  const removeTimeSlot = (dayIndex: number, slotId: string) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].slots = updatedAvailability[dayIndex].slots.filter(
      slot => slot.id !== slotId
    );
    setAvailability(updatedAvailability);
  };

  const updateTimeSlot = (dayIndex: number, slotId: string, field: keyof TimeSlot, value: any) => {
    const updatedAvailability = [...availability];
    const slotIndex = updatedAvailability[dayIndex].slots.findIndex(s => s.id === slotId);
    if (slotIndex !== -1) {
      updatedAvailability[dayIndex].slots[slotIndex] = {
        ...updatedAvailability[dayIndex].slots[slotIndex],
        [field]: value
      };
      setAvailability(updatedAvailability);
    }
  };

  const copyToOtherDays = (dayIndex: number) => {
    // In a real app, show a modal to select which days to copy to
    alert('Copy to other days functionality - would show a modal to select target days');
  };

  const applyWeekdayTemplate = () => {
    alert('Apply weekday template - would apply Monday-Friday template');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Time Windows</h1>
          <p className="text-gray-600">
            Set your availability for the next 14 days. PhxNorth auto-converts across time zones.
          </p>
        </div>

        {/* Section 1: Location & Coverage */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Location & Coverage</h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Base Country/Region */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Base Country / Region <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={baseCountry}
                  onChange={(e) => setBaseCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A2463] focus:border-transparent"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                  <option value="Singapore">Singapore</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Timezone: <span className="font-medium text-gray-700">{baseTimezone}</span>
              </p>
            </div>

            {/* Open To (Multi-select) */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Open To (Multi-select)
              </label>
              <div className="border border-gray-300 rounded-lg p-3 min-h-[100px]">
                <div className="flex flex-wrap gap-2 mb-2">
                  {openToCountries.map((country, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#0A2463] text-white rounded-full text-sm"
                    >
                      {country}
                      <button
                        onClick={() => setOpenToCountries(openToCountries.filter((_, i) => i !== index))}
                        className="hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <button className="text-sm text-[#0A2463] hover:underline">
                  + Add Country/Region
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Controls which countries can request instant sessions
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: 14-Day Availability Planner */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">14-Day Availability Planner</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'weekly'
                  ? 'bg-[#0A2463] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Weekly View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'list'
                  ? 'bg-[#0A2463] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Date List View
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 mb-6 pb-6 border-b border-gray-200">
            <button
              onClick={applyWeekdayTemplate}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Apply Weekday Template (Mon–Fri)
            </button>
          </div>

          {/* Availability Days */}
          <div className="space-y-4">
            {availability.map((day, dayIndex) => (
              <div key={day.date} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {day.dayName}, {new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Your Local Time • {baseTimezone}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToOtherDays(dayIndex)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                    <button
                      onClick={() => addTimeSlot(dayIndex)}
                      className="px-3 py-1.5 text-sm bg-[#0A2463] text-white rounded-lg hover:bg-[#0A2463]/90 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Slot
                    </button>
                  </div>
                </div>

                {/* Time Slots */}
                {day.slots.length > 0 ? (
                  <div className="space-y-3">
                    {day.slots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`border rounded-lg p-4 transition-colors ${slot.enabled ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-gray-50'
                          }`}
                      >
                        <div className="grid grid-cols-6 gap-4 items-center">
                          {/* Start Time */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Start Time</label>
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => updateTimeSlot(dayIndex, slot.id, 'startTime', e.target.value)}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                            />
                          </div>

                          {/* End Time */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">End Time</label>
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => updateTimeSlot(dayIndex, slot.id, 'endTime', e.target.value)}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                            />
                          </div>

                          {/* Session Length */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Session Length</label>
                            <select
                              value={slot.sessionLength}
                              onChange={(e) => updateTimeSlot(dayIndex, slot.id, 'sessionLength', parseInt(e.target.value))}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                            >
                              <option value={30}>30 min</option>
                              <option value={45}>45 min</option>
                              <option value={60}>60 min</option>
                            </select>
                          </div>

                          {/* Buffer Time */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Buffer Time</label>
                            <select
                              value={slot.bufferTime}
                              onChange={(e) => updateTimeSlot(dayIndex, slot.id, 'bufferTime', parseInt(e.target.value))}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                            >
                              <option value={0}>0 min</option>
                              <option value={5}>5 min</option>
                              <option value={10}>10 min</option>
                              <option value={15}>15 min</option>
                            </select>
                          </div>

                          {/* Toggle Enabled */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                            <button
                              onClick={() => updateTimeSlot(dayIndex, slot.id, 'enabled', !slot.enabled)}
                              className={`w-full px-2 py-1.5 rounded text-sm font-medium transition-colors ${slot.enabled
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                                }`}
                            >
                              {slot.enabled ? 'Enabled' : 'Disabled'}
                            </button>
                          </div>

                          {/* Delete */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">&nbsp;</label>
                            <button
                              onClick={() => removeTimeSlot(dayIndex, slot.id)}
                              className="w-full p-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 mx-auto" />
                            </button>
                          </div>
                        </div>

                        {/* UTC Display */}
                        <p className="text-xs text-gray-500 mt-2">
                          UTC: {slot.startTime} – {slot.endTime} (stored in UTC)
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 text-sm">
                    No time slots set for this day. Click "Add Slot" to get started.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Global Time Conversion View */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">See it in other time zones</h2>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              View As Country / Region
            </label>
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <select
                  value={viewAsCountry}
                  onChange={(e) => setViewAsCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A2463] focus:border-transparent"
                >
                  <option value="">Select a country...</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Japan">Japan</option>
                  <option value="Singapore">Singapore</option>
                  <option value="India">India</option>
                </select>
                <Globe className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={showSideBySide}
                  onChange={(e) => setShowSideBySide(e.target.checked)}
                  className="w-4 h-4 text-[#0A2463] border-gray-300 rounded focus:ring-[#0A2463]"
                />
                Show open regions side-by-side
              </label>
            </div>
          </div>

          {viewAsCountry ? (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{viewAsCountry}</h3>
                  <p className="text-sm text-gray-500">All times converted to their local timezone</p>
                </div>
                <Clock className="w-6 h-6 text-gray-400" />
              </div>

              <div className="space-y-2">
                {availability.slice(0, 3).map((day) => (
                  day.slots.length > 0 && (
                    <div key={day.date} className="bg-white rounded p-3 border border-gray-200">
                      <div className="font-medium text-sm text-gray-900 mb-2">
                        {day.dayName}, {new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {day.slots.map((slot) => (
                          <span
                            key={slot.id}
                            className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium"
                          >
                            {slot.startTime} – {slot.endTime}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Your time: {day.slots[0]?.startTime} ({baseTimezone})
                      </p>
                    </div>
                  )
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a country to preview your availability in their timezone
            </div>
          )}
        </div>

        <div className="sticky bottom-6 flex justify-end items-center gap-4">
          {saveMessage && (
            <span className={`text-sm font-medium ${saveMessage.toLowerCase().includes('failed') || saveMessage.toLowerCase().includes('error') ? 'text-red-600' : 'text-emerald-600'}`}>
              {saveMessage}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-4 bg-[#0A2463] text-white rounded-lg font-semibold shadow-lg hover:bg-[#0A2463]/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Check className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Availability'}
          </button>
        </div>
      </div>
    </div>
  );
}
