"use client";

import { Label } from "@/components/ui/label";
import {
  CLOSING_MINUTES,
  HOUR_STEP_MINUTES,
  OPENING_MINUTES,
} from "./constants";
import {
  buildEndMinutes,
  buildSlotMinutes,
  minutesToTimeLabel,
} from "./hour-range";
import type { HourRange } from "./types";

type Props = {
  value: HourRange | null;
  onChange: (range: HourRange | null) => void;
};

const START_SLOTS = buildSlotMinutes();
const END_SLOTS = buildEndMinutes();

const selectClassName =
  "h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white " +
  "outline-none transition-colors focus-visible:border-primary-orange/50 " +
  "focus-visible:ring-3 focus-visible:ring-primary-orange/20";

const HourRangeGrid = ({ value, onChange }: Props) => {
  const endOptions = value
    ? END_SLOTS.filter((minutes) => minutes > value.startMinutes)
    : END_SLOTS;

  const handleStartChange = (raw: string) => {
    if (!raw) {
      onChange(null);
      return;
    }

    const startMinutes = Number(raw);
    const preferredEnd = value?.endMinutes ?? startMinutes + HOUR_STEP_MINUTES;
    const endMinutes = Math.min(
      CLOSING_MINUTES,
      Math.max(preferredEnd, startMinutes + HOUR_STEP_MINUTES),
    );

    onChange({ startMinutes, endMinutes });
  };

  const handleEndChange = (raw: string) => {
    if (!raw) {
      onChange(null);
      return;
    }

    const endMinutes = Number(raw);
    const preferredStart =
      value?.startMinutes ?? endMinutes - HOUR_STEP_MINUTES;
    const startMinutes = Math.max(
      OPENING_MINUTES,
      Math.min(preferredStart, endMinutes - HOUR_STEP_MINUTES),
    );

    onChange({ startMinutes, endMinutes });
  };

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
        Vreme
      </span>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="occupancy-time-from" className="text-slate-300">
            Od
          </Label>
          <select
            id="occupancy-time-from"
            value={value?.startMinutes ?? ""}
            onChange={(event) => handleStartChange(event.target.value)}
            className={selectClassName}
          >
            <option value="" disabled>
              Izaberite
            </option>
            {START_SLOTS.map((minutes) => (
              <option key={minutes} value={minutes} className="bg-slate-900">
                {minutesToTimeLabel(minutes)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupancy-time-to" className="text-slate-300">
            Do
          </Label>
          <select
            id="occupancy-time-to"
            value={value?.endMinutes ?? ""}
            onChange={(event) => handleEndChange(event.target.value)}
            className={selectClassName}
          >
            <option value="" disabled>
              Izaberite
            </option>
            {endOptions.map((minutes) => (
              <option key={minutes} value={minutes} className="bg-slate-900">
                {minutesToTimeLabel(minutes)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default HourRangeGrid;
