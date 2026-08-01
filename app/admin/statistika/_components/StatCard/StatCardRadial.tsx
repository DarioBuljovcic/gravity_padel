"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart";
import { getPercentageFillColor } from "./percentage-color";

type StatCardRadialProps = {
  label: string;
  percentage: number;
  /** Center value text; defaults to a formatted percentage. */
  value?: string;
};

const chartConfig = {
  progress: {
    label: "Progress",
  },
} satisfies ChartConfig;

/** Full circle at 100%; values above 100% keep a full ring (color signals overflow). */
const VISUAL_CAP = 100;

export function StatCardRadial({
  label,
  percentage,
  value,
}: StatCardRadialProps) {
  const fill = getPercentageFillColor(percentage);
  const visualValue = Math.min(Math.max(percentage, 0), VISUAL_CAP);

  const chartData = [
    {
      name: "progress",
      progress: visualValue,
      fill,
    },
  ];

  const centerValue =
    value ?? `${percentage.toFixed(percentage % 1 === 0 ? 0 : 1)}%`;

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[160px] w-full"
    >
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={90 - (visualValue / VISUAL_CAP) * 360}
        innerRadius={58}
        outerRadius={82}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-white/5 last:fill-slate-900/50"
          polarRadius={[74, 62]}
        />
        <RadialBar dataKey="progress" background cornerRadius={8} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                return null;
              }

              return (
                <text
                  x={viewBox.cx}
                  y={viewBox.cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan
                    x={viewBox.cx}
                    y={viewBox.cy}
                    className="fill-white text-2xl font-bold"
                  >
                    {centerValue}
                  </tspan>
                  <tspan
                    x={viewBox.cx}
                    y={(viewBox.cy || 0) + 22}
                    className="fill-slate-400 text-[10px] uppercase tracking-wider"
                  >
                    {label}
                  </tspan>
                </text>
              );
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
