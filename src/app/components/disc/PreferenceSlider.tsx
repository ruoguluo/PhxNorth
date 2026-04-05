"use client";

import * as React from "react";

import { cn } from "../ui/utils";

interface PreferenceSliderProps {
  leftLabel: string;
  rightLabel: string;
  value: number;
  interpretation?: string;
  className?: string;
}

function PreferenceSlider({
  leftLabel,
  rightLabel,
  value,
  interpretation,
  className,
}: PreferenceSliderProps) {
  const clampedValue = Math.max(-1, Math.min(1, value));
  // Convert -1..+1 to 0..100 percentage for positioning
  const position = ((clampedValue + 1) / 2) * 100;

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {/* Labels */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-600">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>

      {/* Track */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100">
        {/* Colored fill from center toward the dominant side */}
        {clampedValue < 0 ? (
          <div
            className="absolute top-0 h-full rounded-full bg-indigo-400/60"
            style={{
              left: `${position}%`,
              width: `${50 - position}%`,
            }}
          />
        ) : (
          <div
            className="absolute top-0 h-full rounded-full bg-amber-400/60"
            style={{
              left: "50%",
              width: `${position - 50}%`,
            }}
          />
        )}

        {/* Center neutral line */}
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-slate-300" />

        {/* Marker dot */}
        <div
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-800 shadow-sm"
          style={{ left: `${position}%` }}
        />
      </div>

      {/* Interpretation */}
      {interpretation && (
        <p className="text-xs text-slate-500">{interpretation}</p>
      )}
    </div>
  );
}

export { PreferenceSlider };
export type { PreferenceSliderProps };
