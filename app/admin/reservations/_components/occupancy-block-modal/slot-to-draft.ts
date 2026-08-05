import { format } from "date-fns";
import {
  ALL_COURT_IDS,
  CLOSING_MINUTES,
  HOUR_STEP_MINUTES,
  OPENING_MINUTES,
} from "./constants";
import { snapMinutes } from "./hour-range";
import type { HourRange, OccupancyBlockDraft } from "./types";

export type CalendarSlotSelection = {
  start: Date;
  end: Date;
  action?: "select" | "click" | "doubleClick";
};

const dateKey = (value: Date): string => format(value, "yyyy-MM-dd");

const toMinutes = (value: Date): number =>
  value.getHours() * 60 + value.getMinutes();

const clampRange = (startMinutes: number, endMinutes: number): HourRange => {
  let start = snapMinutes(startMinutes);
  let end = snapMinutes(endMinutes);

  if (end <= start) {
    start = OPENING_MINUTES;
    end = CLOSING_MINUTES;
  }

  start = Math.max(OPENING_MINUTES, Math.min(start, CLOSING_MINUTES - HOUR_STEP_MINUTES));
  end = Math.max(start + HOUR_STEP_MINUTES, Math.min(end, CLOSING_MINUTES));

  return { startMinutes: start, endMinutes: end };
};

/**
 * Maps a react-big-calendar slot selection to an occupancy draft,
 * clamped to venue opening hours.
 */
export const slotInfoToOccupancyDraft = (
  slot: CalendarSlotSelection,
  courtId?: number,
): OccupancyBlockDraft | null => {
  if (slot.action === "doubleClick") return null;

  const range = clampRange(toMinutes(slot.start), toMinutes(slot.end));
  const courtIds =
    typeof courtId === "number" && courtId >= 1 && courtId <= 4
      ? [courtId]
      : [...ALL_COURT_IDS];

  return {
    date: dateKey(slot.start),
    courtIds,
    range,
  };
};
