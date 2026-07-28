"use client";

import { useQuery } from "@tanstack/react-query";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";

import { getReservations } from "@/lib/actions/reservation.actions";
import type { CalendarReservation } from "@/lib/reservations/calendar-mapping";

export function useReservationStatistics(options?: {
  initialData?: CalendarReservation[];
}) {
  const now = new Date();
  // Current month vs previous month (month-to-date).
  const reportMonth = now;
  const comparisonMonth = subMonths(now, 1);

  const dateFrom = format(startOfMonth(comparisonMonth), "yyyy-MM-dd");
  const dateTo = format(endOfMonth(reportMonth), "yyyy-MM-dd");

  const range = {
    dateFrom,
    dateTo,
    activeOnly: true,
  };

  return useQuery({
    queryKey: ["reservations", "statistics", dateFrom, dateTo],
    queryFn: () =>
      getReservations({
        ...range,
      }),
    staleTime: 60_000,
    initialData: options?.initialData,
  });
}
