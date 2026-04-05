"use client";

import * as React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

import { cn } from "../ui/utils";

const NAVY = "#0A2463";

interface DISCRadarChartProps {
  scores: { d: number; i: number; s: number; c: number };
  confidence?: number;
  className?: string;
}

const dimensionLabels: Record<string, string> = {
  D: "Dominance",
  I: "Influence",
  S: "Steadiness",
  C: "Conscientiousness",
};

function DISCRadarChart({ scores, confidence, className }: DISCRadarChartProps) {
  const data = [
    { dimension: "Dominance", value: scores.d },
    { dimension: "Influence", value: scores.i },
    { dimension: "Steadiness", value: scores.s },
    { dimension: "Conscientiousness", value: scores.c },
  ];

  return (
    <div className={cn("relative w-full", className)}>
      {confidence !== undefined && (
        <div className="absolute top-2 right-2 z-10 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
          {Math.round(confidence * 100)}% confidence
        </div>
      )}
      <ResponsiveContainer width="100%" aspect={1}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <Radar
            name="DISC"
            dataKey="value"
            stroke={NAVY}
            fill={NAVY}
            fillOpacity={0.3}
            strokeWidth={2}
            domain={[0, 100]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export { DISCRadarChart };
export type { DISCRadarChartProps };
