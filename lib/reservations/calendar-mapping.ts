import type { Reservation } from "@/lib/reservations/domain";
import { toVenueWallDate } from "@/lib/reservations/date-ranges";

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
  kind: Reservation["kind"];
  event_group_id: string | null;
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

/** Distinct court colors for the admin calendar (legend + events). */
export const COURT_COLORS: Record<1 | 2 | 3 | 4, string> = {
  1: "#0055ff", // dark padel blue
  2: "#ea580c", // orange
  3: "#84cc16", // lime green
  4: "#c026d3", // magenta
};

export function reservationsToEvents(
  reservations: CalendarReservation[],
): ReservationEvent[] {
  return reservations.map((reservation) => ({
    id: reservation.id,
    title: reservation.name,
    start: toVenueWallDate(reservation.starts_at),
    end: toVenueWallDate(reservation.ends_at),
    resource: reservation,
  }));
}

export function courtEventClassName(
  courtId: number,
  status: CalendarReservation["status"],
  kind: CalendarReservation["kind"] = "booking",
): string {
  if (status === "cancelled") return "event-cancelled";
  if (kind === "event") return "event-occupancy";
  if (courtId >= 1 && courtId <= 4) return `event-court-${courtId}`;
  return "event-variant-primary";
}

export function courtLegendColor(courtId: number): string {
  if (courtId >= 1 && courtId <= 4) {
    return COURT_COLORS[courtId as 1 | 2 | 3 | 4];
  }
  return COURT_COLORS[1];
}
