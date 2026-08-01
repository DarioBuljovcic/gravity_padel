import { format, subMonths } from "date-fns";
import { srLatn } from "date-fns/locale";

import type { CalendarReservation } from "@/lib/reservations/calendar-mapping";
import type { ReservationStatisticsResult } from "../types";
import { WEEKDAY_NAMES } from "./constants";
import { calculatePercentageChange } from "./percentage";
import {
  calculatePeriodStatistics,
  getHighestDailyRevenue,
  getHighestEntry,
  getReservationsInMonth,
  toPackageGroupStatistics,
} from "./period";

export function calculateReservationStatistics(
  reservations: CalendarReservation[],
  now = new Date(),
): ReservationStatisticsResult {
  const reportMonth = now;
  const comparisonMonth = subMonths(now, 1);

  const reportReservations = getReservationsInMonth(reservations, reportMonth);
  const comparisonReservations = getReservationsInMonth(
    reservations,
    comparisonMonth,
  );

  const report = calculatePeriodStatistics(reportReservations, reportMonth);
  const comparison = calculatePeriodStatistics(
    comparisonReservations,
    comparisonMonth,
  );

  const mostUsedCourt = getHighestEntry(report.courtMinutes);
  const mostPopularWeekday = getHighestEntry(report.weekdayReservations);
  const bestRevenueDay = getHighestDailyRevenue(report.dailyRevenue);

  const mostUsedCourtId = mostUsedCourt?.[0] ?? null;
  const mostUsedCourtMinutes = mostUsedCourt?.[1] ?? 0;

  /** Compare the winning court with that same court in the previous month. */
  const previousMostUsedCourtMinutes =
    mostUsedCourtId !== null
      ? (comparison.courtMinutes.get(mostUsedCourtId) ?? 0)
      : 0;

  const bestWeekday = mostPopularWeekday?.[0] ?? null;
  const bestWeekdayReservations = mostPopularWeekday?.[1] ?? 0;

  /** Compare the winning weekday with that same weekday in the previous month. */
  const previousBestWeekdayReservations =
    bestWeekday !== null
      ? (comparison.weekdayReservations.get(bestWeekday) ?? 0)
      : 0;

  const bestRevenueDate = bestRevenueDay?.[0] ?? null;
  const bestRevenueBucket = bestRevenueDay?.[1] ?? {
    revenue: 0,
    reservations: 0,
  };

  return {
    reportMonth,
    comparisonMonth,

    totalReservations: {
      value: report.totalReservations,
      previousValue: comparison.totalReservations,
      percentageChange: calculatePercentageChange(
        report.totalReservations,
        comparison.totalReservations,
      ),
    },

    totalRevenue: {
      value: report.totalRevenue,
      previousValue: comparison.totalRevenue,
      percentageChange: calculatePercentageChange(
        report.totalRevenue,
        comparison.totalRevenue,
      ),
    },

    utilization: {
      value: report.utilization,
      previousValue: comparison.utilization,
      percentageChange: calculatePercentageChange(
        report.utilization,
        comparison.utilization,
      ),
    },

    mostUsedCourt: {
      courtId: mostUsedCourtId,
      bookedMinutes: mostUsedCourtMinutes,
      previousBookedMinutes: previousMostUsedCourtMinutes,
      percentageChange: calculatePercentageChange(
        mostUsedCourtMinutes,
        previousMostUsedCourtMinutes,
      ),
    },

    bestDay: {
      weekday: bestWeekday,
      label:
        bestWeekday !== null ? WEEKDAY_NAMES[bestWeekday] : "Nema podataka",
      reservations: bestWeekdayReservations,
      previousReservations: previousBestWeekdayReservations,
      percentageChange: calculatePercentageChange(
        bestWeekdayReservations,
        previousBestWeekdayReservations,
      ),
    },

    bestRevenueDay: {
      date: bestRevenueDate,
      label: bestRevenueDate
        ? format(new Date(`${bestRevenueDate}T12:00:00`), "d. MMMM yyyy.", {
            locale: srLatn,
          })
        : "Nema podataka",
      revenue: bestRevenueBucket.revenue,
      reservations: bestRevenueBucket.reservations,
    },

    morningReservations: {
      value: report.morningReservations,
      previousValue: comparison.morningReservations,
      percentageChange: calculatePercentageChange(
        report.morningReservations,
        comparison.morningReservations,
      ),
    },

    afternoonReservations: {
      value: report.afternoonReservations,
      previousValue: comparison.afternoonReservations,
      percentageChange: calculatePercentageChange(
        report.afternoonReservations,
        comparison.afternoonReservations,
      ),
    },

    morningRevenue: {
      value: report.morningRevenue,
      previousValue: comparison.morningRevenue,
      percentageChange: calculatePercentageChange(
        report.morningRevenue,
        comparison.morningRevenue,
      ),
    },

    afternoonRevenue: {
      value: report.afternoonRevenue,
      previousValue: comparison.afternoonRevenue,
      percentageChange: calculatePercentageChange(
        report.afternoonRevenue,
        comparison.afternoonRevenue,
      ),
    },

    packageGroups: toPackageGroupStatistics(report.packageGroups),
  };
}
