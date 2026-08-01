"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { StatCardRadial } from "./StatCardRadial";

type StatCardSharedProps = {
  label: string;
  detail?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

type DefaultStatCardProps = StatCardSharedProps & {
  variant?: "default";
  value: ReactNode;
  percentage?: never;
};

type RadialStatCardProps = StatCardSharedProps & {
  variant: "radial";
  /** Percentage that drives ring fill and color band (may exceed 100). */
  percentage: number;
  /** Center value text; defaults to a formatted percentage. */
  value?: string;
};

export type StatCardProps = DefaultStatCardProps | RadialStatCardProps;

export function StatCard(props: StatCardProps) {
  const { label, detail, footer, className } = props;

  if (props.variant === "radial") {
    return (
      <article
        className={cn(
          "flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-6 items-center",
          className,
        )}
      >
        <StatCardRadial
          label={label}
          percentage={props.percentage}
          value={props.value}
        />
        {detail}
        {footer}
      </article>
    );
  }

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white text-center">{props.value}</p>
      {detail}
      {footer}
    </article>
  );
}
