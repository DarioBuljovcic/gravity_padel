"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getReservations,
  type ReservationFilters,
} from "@/lib/actions/reservation.actions";
import type { CalendarReservation } from "@/lib/reservations/calendar-mapping";

export type ReservationsRangeKey = [
  "reservations",
  Pick<ReservationFilters, "courtId" | "name">,
  { dateFrom: string; dateTo: string },
];

export function reservationsRangeKey(
  filters: Pick<ReservationFilters, "courtId" | "name">,
  range: { dateFrom: string; dateTo: string },
): ReservationsRangeKey {
  return ["reservations", filters, range];
}

export function useReservationsRange(
  filters: Pick<ReservationFilters, "courtId" | "name">,
  range: { dateFrom: string; dateTo: string },
  options?: { initialData?: CalendarReservation[] },
) {
  return useQuery({
    queryKey: reservationsRangeKey(filters, range),
    queryFn: () => getReservations({ ...filters, ...range }),
    staleTime: 60_000,
    initialData: options?.initialData,
  });
}
