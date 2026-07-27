import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import type { View } from "react-big-calendar";
import {
  VENUE_TIME_ZONE,
  type Reservation,
} from "@/lib/reservations/domain";
import {
  getReservations,
  type ReservationFilters,
} from "@/lib/actions/reservation.actions";

export type CalendarReservation = {
  id: string;
  starts_at: string;
  ends_at: string;
  duration_minutes: number;
  court_id: number;
  package_id: string;
  price_amount: number;
  price_currency: string;
  name: string;
  phone: string;
  email: string;
  status: Reservation["status"];
  user_id: string | null;
  created_at: string;
};

export type ReservationEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: CalendarReservation;
};

/** Brand padel palette for the four courts. */
export const COURT_COLORS: Record<1 | 2 | 3 | 4, string> = {
  1: "#0055ff", // padel-blue
  2: "#f2b264", // primary-orange
  3: "#d97706", // accent-orange
  4: "#3b82f6", // light padel blue
};

type RangeFilters = Pick<ReservationFilters, "courtId" | "name"> & {
  dateFrom: string;
  dateTo: string;
};

const reservationCache = new Map<string, CalendarReservation[]>();
const reservationInflight = new Map<string, Promise<CalendarReservation[]>>();

function rangeCacheKey(filters: RangeFilters): string {
  return [
    filters.courtId ?? "",
    filters.name?.trim() ?? "",
    filters.dateFrom,
    filters.dateTo,
  ].join("|");
}

export function seedReservationCache(
  filters: Pick<ReservationFilters, "courtId" | "name">,
  range: { dateFrom: string; dateTo: string },
  data: CalendarReservation[],
) {
  reservationCache.set(rangeCacheKey({ ...filters, ...range }), data);
}

export function getCachedReservations(
  filters: Pick<ReservationFilters, "courtId" | "name">,
  range: { dateFrom: string; dateTo: string },
): CalendarReservation[] | undefined {
  return reservationCache.get(rangeCacheKey({ ...filters, ...range }));
}

export async function fetchReservationsCached(
  filters: Pick<ReservationFilters, "courtId" | "name">,
  range: { dateFrom: string; dateTo: string },
): Promise<CalendarReservation[]> {
  const key = rangeCacheKey({ ...filters, ...range });
  const cached = reservationCache.get(key);
  if (cached) return cached;

  const pending = reservationInflight.get(key);
  if (pending) return pending;

  const request = getReservations({
    ...filters,
    dateFrom: range.dateFrom,
    dateTo: range.dateTo,
  }).then((data) => {
    reservationCache.set(key, data);
    reservationInflight.delete(key);
    return data;
  });

  reservationInflight.set(key, request);
  return request;
}

/** Patch cancelled status across every cached range. */
export function markReservationCancelledInCache(id: string) {
  for (const [key, rows] of reservationCache) {
    const index = rows.findIndex((row) => row.id === id);
    if (index === -1) continue;
    const next = rows.slice();
    next[index] = { ...next[index], status: "cancelled" };
    reservationCache.set(key, next);
  }
}

export function prefetchAdjacentRanges(
  filters: Pick<ReservationFilters, "courtId" | "name">,
  date: Date,
  view: View,
) {
  if (view === "month") return;

  const daySpan = view === "agenda" ? 30 : view === "day" ? 1 : 7;

  const prev = getRangeForView(subDays(date, daySpan), view);
  const next = getRangeForView(addDays(date, daySpan), view);

  void fetchReservationsCached(filters, prev);
  void fetchReservationsCached(filters, next);
}

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

export function reservationsToEvents(
  reservations: CalendarReservation[],
): ReservationEvent[] {
  return reservations.map((reservation) => ({
    id: reservation.id,
    title: `${reservation.name} · Teren ${reservation.court_id}`,
    start: toVenueWallDate(reservation.starts_at),
    end: toVenueWallDate(reservation.ends_at),
    resource: reservation,
  }));
}

export function courtEventClassName(
  courtId: number,
  status: CalendarReservation["status"],
): string {
  if (status === "cancelled") return "event-cancelled";
  if (courtId >= 1 && courtId <= 4) return `event-court-${courtId}`;
  return "event-variant-primary";
}

export function courtLegendColor(courtId: number): string {
  if (courtId >= 1 && courtId <= 4) {
    return COURT_COLORS[courtId as 1 | 2 | 3 | 4];
  }
  return COURT_COLORS[1];
}
