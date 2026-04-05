"use client";

import * as React from "react";

import { cn } from "../ui/utils";

interface DISCScoreBarProps {
  dimension: "D" | "I" | "S" | "C";
  score: number;
  isDominant?: boolean;
  isSecondary?: boolean;
  className?: string;
}

const dimensionConfig: Record<
  DISCScoreBarProps["dimension"],
  { label: string; color: string; bg: string }
> = {
  D: { label: "Dominance", color: "bg-red-500", bg: "bg-red-100" },
  I: { label: "Influence", color: "bg-yellow-500", bg: "bg-yellow-100" },
  S: { label: "Steadiness", color: "bg-green-500", bg: "bg-green-100" },
  C: { label: "Conscientiousness", color: "bg-blue-500", bg: "bg-blue-100" },
};

function DISCScoreBar({
  dimension,
  score,
  isDominant,
  isSecondary,
  className,
}: DISCScoreBarProps) {
  const config = dimensionConfig[dimension];
  const clampedScore = Math.max(0, Math.min(100, score));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex w-40 shrink-0 items-center gap-2">
        <span className="text-sm font-medium text-slate-700">
          {config.label}
        </span>
        {isDominant && (
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Dom
          </span>
        )}
        {isSecondary && (
          <span className="rounded border border-slate-300 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Sec
          </span>
        )}
      </div>

      <div className={cn("relative h-3 flex-1 overflow-hidden rounded-full", config.bg)}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", config.color)}
          style={{ width: `${clampedScore}%` }}
        />
      </div>

      <span className="w-8 text-right text-sm font-semibold tabular-nums text-slate-900">
        {Math.round(clampedScore)}
      </span>
    </div>
  );
}

export { DISCScoreBar };
export type { DISCScoreBarProps };
