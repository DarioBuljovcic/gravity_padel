import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import type { View } from "react-big-calendar";
import { VENUE_TIME_ZONE } from "@/lib/reservations/domain";

/** Absolute UTC instant → Date whose local fields are Europe/Belgrade wall time. */
export function toVenueWallDate(iso: string): Date {
  return toZonedTime(new Date(iso), VENUE_TIME_ZONE);
}

export function nowInVenue(): Date {
  return toZonedTime(new Date(), VENUE_TIME_ZONE);
}

/** Format a calendar (venue-wall) Date as YYYY-MM-DD. */
export function formatVenueDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function getRangeForView(
  date: Date,
  view: View,
): { dateFrom: string; dateTo: string } {
  if (view === "month") {
    const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
    return {
      dateFrom: formatVenueDate(start),
      dateTo: formatVenueDate(end),
    };
  }

  if (view === "week" || view === "work_week") {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return {
      dateFrom: formatVenueDate(start),
      dateTo: formatVenueDate(end),
    };
  }

  if (view === "agenda") {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = addDays(start, 30);
    return {
      dateFrom: formatVenueDate(start),
      dateTo: formatVenueDate(end),
    };
  }

  const day = formatVenueDate(date);
  return { dateFrom: day, dateTo: day };
}

export function getDefaultWeekRange(now = new Date()): {
  dateFrom: string;
  dateTo: string;
} {
  return getRangeForView(toZonedTime(now, VENUE_TIME_ZONE), "week");
}
