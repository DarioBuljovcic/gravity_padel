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

export function reservationsToEvents(
  reservations: CalendarReservation[],
): ReservationEvent[] {
  return reservations.map((reservation) => ({
    id: reservation.id,
    title: `${reservation.name}`,
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
