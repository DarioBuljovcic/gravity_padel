"use client";

import { useQuery } from "@tanstack/react-query";

import type { ReservationStatisticsResponse } from "./types";

async function fetchReservationStatistics(): Promise<ReservationStatisticsResponse> {
  const response = await fetch("/api/admin/statistics/reservations");

  if (!response.ok) {
    throw new Error("Unable to load reservation statistics.");
  }

  return response.json();
}

export function useReservationStatistics() {
  return useQuery({
    queryKey: ["admin", "statistics", "reservations"],
    queryFn: fetchReservationStatistics,
    staleTime: 60_000,
  });
}
