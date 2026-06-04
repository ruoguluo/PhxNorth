import { useEffect, useState } from "react";
import { Download, Sparkles, FileText, Video, AlertCircle } from "lucide-react";
import { videoAPI } from "../../lib/api";

interface SessionRecordingProps {
  sessionId: number;
}

interface SummaryData {
  key_points?: string[];
  action_items?: { text: string; owner?: string }[];
  follow_ups?: string[];
  progress_notes?: string[];
  [key: string]: unknown;
}

export function SessionRecording({ sessionId }: SessionRecordingProps) {
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [rec, trans, sum] = await Promise.all([
          videoAPI.getRecording(sessionId).catch(() => ({ recording_url: null })),
          videoAPI.getTranscript(sessionId).catch(() => ({ transcript_text: null })),
          videoAPI.getSummary(sessionId).catch(() => null),
        ]);
        if (cancelled) return;
        setRecordingUrl(rec.recording_url);
        setTranscript(trans.transcript_text);
        setSummary(sum as SummaryData | null);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load session data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, [sessionId]);

  const handleGenerateSummary = async () => {
    setGenerating(true);
    try {
      const result = await videoAPI.generateSummary(sessionId);
      setSummary(result as SummaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate summary");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recording Player */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Video className="w-5 h-5 text-gray-500" />
          Recording
        </h3>
        {recordingUrl ? (
          <video
            controls
            src={recordingUrl}
            className="w-full rounded-lg bg-black"
          />
        ) : (
          <p className="text-gray-500 text-sm">No recording available</p>
        )}
      </section>

      {/* AI Summary Card */}
      {summary && (
        <section className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            AI Summary
          </h3>

          {summary.key_points && summary.key_points.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-indigo-800 mb-2">Key Points</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-indigo-900">
                {summary.key_points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {summary.action_items && summary.action_items.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-indigo-800 mb-2">Action Items</h4>
              <ul className="space-y-2">
                {summary.action_items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-indigo-900">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0" />
                    <span>
                      {item.text}
                      {item.owner && (
                        <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {item.owner}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {summary.follow_ups && summary.follow_ups.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-indigo-800 mb-2">Follow-ups</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-indigo-900">
                {summary.follow_ups.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {summary.progress_notes && summary.progress_notes.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-indigo-800 mb-2">Progress Notes</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-indigo-900">
                {summary.progress_notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Transcript */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-500" />
          Transcript
        </h3>
        {transcript ? (
          <div className="max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
              {transcript}
            </pre>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No transcript available</p>
        )}
      </section>

      {/* Download & Generate Buttons */}
      <div className="flex flex-wrap gap-3">
        {recordingUrl && (
          <a
            href={recordingUrl}
            download
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Recording
          </a>
        )}

        <button
          onClick={handleGenerateSummary}
          disabled={generating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          {generating ? "Generating…" : "Generate Summary"}
        </button>
      </div>
    </div>
  );
}
