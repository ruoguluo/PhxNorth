import { useEffect, useState } from "react";
import {
  Loader2,
  AlertCircle,
  Calendar,
  SlidersHorizontal,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { PreferenceSlider } from "../components/disc/PreferenceSlider";
import {
  discCareerAPI,
  type PreferencesResponse,
  type PreferenceIndexValue,
} from "../../lib/disc-api";

// ─── Slider configuration ───────────────────────────────────────────

interface SliderConfig {
  key: string;
  leftLabel: string;
  rightLabel: string;
}

const BIPOLAR_SLIDERS: SliderConfig[] = [
  { key: "stability_vs_growth", leftLabel: "Stability", rightLabel: "Growth" },
  { key: "conservative_vs_aggressive_risk", leftLabel: "Conservative", rightLabel: "Aggressive" },
  { key: "control_vs_collaboration", leftLabel: "Control", rightLabel: "Collaboration" },
  { key: "short_term_vs_long_term", leftLabel: "Short-term", rightLabel: "Long-term" },
];

// ─── Helpers ────────────────────────────────────────────────────────

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ─── Component ──────────────────────────────────────────────────────

export function Preferences() {
  const [data, setData] = useState<PreferencesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    discCareerAPI
      .preferences()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err.message ?? "Failed to load preferences");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Loading preferences...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-red-200 p-8 max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Unable to load preferences
          </h2>
          <p className="text-sm text-gray-600">
            {error ?? "An unknown error occurred."}
          </p>
        </div>
      </div>
    );
  }

  const { indexes, computed_at } = data;
  const consistency = indexes.consistency_score;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#0A2463] rounded-lg">
              <SlidersHorizontal className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Preferences</h1>
          </div>
          <p className="text-lg text-gray-600 mb-2">
            Behavioral preference indexes inferred from career patterns and
            platform activity
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Computed {formatTimestamp(computed_at)}</span>
          </div>
        </div>

        {/* Bipolar Preference Sliders */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Preference Indexes</CardTitle>
            <CardDescription>
              Each index represents a behavioral spectrum from -1 (left) to +1
              (right), inferred from career data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {BIPOLAR_SLIDERS.map((config) => {
              const idx = indexes[config.key as keyof typeof indexes] as PreferenceIndexValue | undefined;
              if (!idx) return null;
              return (
                <div key={config.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-900">
                      {idx.label}
                    </span>
                    <span className="text-xs text-gray-400">
                      {idx.value > 0 ? "+" : ""}{idx.value.toFixed(2)}
                    </span>
                  </div>
                  <PreferenceSlider
                    leftLabel={config.leftLabel}
                    rightLabel={config.rightLabel}
                    value={idx.value}
                    interpretation={idx.interpretation}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Consistency Score */}
        {consistency && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consistency Score</CardTitle>
              <CardDescription>
                Overall behavioral consistency across career data (0 = low, 1 =
                high)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    {consistency.label}
                  </span>
                  <span className="text-sm font-bold text-[#0A2463]">
                    {Math.round(consistency.value * 100)}%
                  </span>
                </div>
                <Progress value={consistency.value * 100} className="h-3" />
                <p className="text-xs text-gray-500">{consistency.interpretation}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
