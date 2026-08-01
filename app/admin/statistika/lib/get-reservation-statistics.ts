import "server-only";

import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";

import { getReservations } from "@/lib/actions/reservation.actions";
import { CURRENCY } from "@/lib/reservations/domain";
import type { ReservationStatisticsResponse } from "../types";
import { calculateReservationStatistics } from "./calculate";

export async function getReservationStatistics(
  now = new Date(),
): Promise<ReservationStatisticsResponse> {
  const reportMonth = now;
  const comparisonMonth = subMonths(now, 1);

  const dateFrom = format(startOfMonth(comparisonMonth), "yyyy-MM-dd");
  const dateTo = format(endOfMonth(reportMonth), "yyyy-MM-dd");

  const reservations = await getReservations({
    dateFrom,
    dateTo,
    activeOnly: true,
  });

  const statistics = calculateReservationStatistics(reservations, now);
  const currency = reservations[0]?.price_currency ?? CURRENCY;

  return {
    reportMonth: statistics.reportMonth.toISOString(),
    comparisonMonth: statistics.comparisonMonth.toISOString(),
    currency,
    totalReservations: statistics.totalReservations,
    totalRevenue: statistics.totalRevenue,
    utilization: statistics.utilization,
    mostUsedCourt: statistics.mostUsedCourt,
    bestDay: statistics.bestDay,
    bestRevenueDay: statistics.bestRevenueDay,
    morningReservations: statistics.morningReservations,
    afternoonReservations: statistics.afternoonReservations,
    morningRevenue: statistics.morningRevenue,
    afternoonRevenue: statistics.afternoonRevenue,
    packageGroups: statistics.packageGroups,
  };
}
