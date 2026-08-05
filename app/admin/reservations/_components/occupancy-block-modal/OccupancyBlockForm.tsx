"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CourtMultiSelect from "./CourtMultiSelect";
import HourRangeGrid from "./HourRangeGrid";
import type { HourRange, OccupancyBlockFormErrors } from "./types";

type Props = {
  title: string;
  date: string;
  courtIds: number[];
  range: HourRange | null;
  errors: OccupancyBlockFormErrors;
  onTitleChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onCourtIdsChange: (courtIds: number[]) => void;
  onRangeChange: (range: HourRange | null) => void;
};

export default function OccupancyBlockForm({
  title,
  date,
  courtIds,
  range,
  errors,
  onTitleChange,
  onDateChange,
  onCourtIdsChange,
  onRangeChange,
}: Props) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="occupancy-title" className="text-slate-300">
          Naziv događaja
        </Label>
        <Input
          id="occupancy-title"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="npr. Prvenstvo / privatni turnir"
          className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
        />
        {errors.title && (
          <p className="text-xs text-red-400">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="occupancy-date" className="text-slate-300">
          Datum
        </Label>
        <Input
          id="occupancy-date"
          type="date"
          value={date}
          onChange={(event) => onDateChange(event.target.value)}
          className="border-white/10 bg-white/5 text-white"
        />
        {errors.date && <p className="text-xs text-red-400">{errors.date}</p>}
      </div>

      <div>
        <CourtMultiSelect value={courtIds} onChange={onCourtIdsChange} />
        {errors.courtIds && (
          <p className="mt-2 text-xs text-red-400">{errors.courtIds}</p>
        )}
      </div>

      <div>
        <HourRangeGrid value={range} onChange={onRangeChange} />
        {errors.range && (
          <p className="mt-2 text-xs text-red-400">{errors.range}</p>
        )}
      </div>

      {errors.form && <p className="text-sm text-red-400">{errors.form}</p>}
    </div>
  );
}
