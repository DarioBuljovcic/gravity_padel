import {
  CLOSING_MINUTES,
  HOUR_STEP_MINUTES,
  OPENING_MINUTES,
} from "./constants";
import type { HourRange } from "./types";

export function minutesToTimeLabel(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function snapMinutes(value: number): number {
  const snapped =
    Math.round(value / HOUR_STEP_MINUTES) * HOUR_STEP_MINUTES;
  return Math.min(CLOSING_MINUTES, Math.max(OPENING_MINUTES, snapped));
}

export function buildSlotMinutes(): number[] {
  const slots: number[] = [];
  for (
    let minute = OPENING_MINUTES;
    minute < CLOSING_MINUTES;
    minute += HOUR_STEP_MINUTES
  ) {
    slots.push(minute);
  }
  return slots;
}

/** End-boundary times (exclusive of opening; inclusive of closing). */
export function buildEndMinutes(): number[] {
  const slots: number[] = [];
  for (
    let minute = OPENING_MINUTES + HOUR_STEP_MINUTES;
    minute <= CLOSING_MINUTES;
    minute += HOUR_STEP_MINUTES
  ) {
    slots.push(minute);
  }
  return slots;
}

export function rangeDurationMinutes(range: HourRange | null): number {
  if (!range) return 0;
  return range.endMinutes - range.startMinutes;
}

export function isValidHourRange(range: HourRange | null): boolean {
  if (!range) return false;
  const duration = rangeDurationMinutes(range);
  return (
    range.startMinutes >= OPENING_MINUTES &&
    range.endMinutes <= CLOSING_MINUTES &&
    duration >= HOUR_STEP_MINUTES &&
    duration % HOUR_STEP_MINUTES === 0
  );
}
