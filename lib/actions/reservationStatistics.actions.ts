// lib/reservations/reservation-statistics.ts

import {
  eachDayOfInterval,
  endOfMonth,
  getDay,
  isWithinInterval,
  startOfMonth,
  subMonths,
} from "date-fns";

import type { CalendarReservation } from "@/lib/reservations/calendar-mapping";

const COURT_COUNT = 4;

/**
 * Change these values to match the club's actual schedule.
 *
 * Example:
 * 08:00–23:00 = 15 available hours per court per day.
 */
const OPENING_HOUR = 8;
const CLOSING_HOUR = 23;

const AVAILABLE_MINUTES_PER_COURT_PER_DAY = (CLOSING_HOUR - OPENING_HOUR) * 60;

const WEEKDAY_NAMES = [
  "Nedelja",
  "Ponedeljak",
  "Utorak",
  "Sreda",
  "Četvrtak",
  "Petak",
  "Subota",
] as const;

type PeriodStatistics = {
  totalReservations: number;
  totalRevenue: number;
  utilization: number;
  courtMinutes: Map<number, number>;
  weekdayReservations: Map<number, number>;
};

export type ReservationStatistic = {
  value: number;
  previousValue: number;
  percentageChange: number | null;
};

export type ReservationStatistics = {
  reportMonth: Date;
  comparisonMonth: Date;

  totalReservations: ReservationStatistic;
  totalRevenue: ReservationStatistic;
  utilization: ReservationStatistic;

  mostUsedCourt: {
    courtId: number | null;
    bookedMinutes: number;
    previousBookedMinutes: number;
    percentageChange: number | null;
  };

  bestDay: {
    weekday: number | null;
    label: string;
    reservations: number;
    previousReservations: number;
    percentageChange: number | null;
  };
};

function calculatePercentageChange(
  currentValue: number,
  previousValue: number,
): number | null {
  if (previousValue === 0) {
    return currentValue === 0 ? 0 : null;
  }

  return ((currentValue - previousValue) / previousValue) * 100;
}

function getReservationsInMonth(
  reservations: CalendarReservation[],
  month: Date,
) {
  const interval = {
    start: startOfMonth(month),
    end: endOfMonth(month),
  };

  return reservations.filter((reservation) =>
    isWithinInterval(new Date(reservation.starts_at), interval),
  );
}

function calculatePeriodStatistics(
  reservations: CalendarReservation[],
  month: Date,
): PeriodStatistics {
  const courtMinutes = new Map<number, number>();
  const weekdayReservations = new Map<number, number>();

  let totalRevenue = 0;
  let totalBookedMinutes = 0;

  for (const reservation of reservations) {
    const durationMinutes = reservation.duration_minutes;

    totalRevenue += reservation.price_amount;
    totalBookedMinutes += durationMinutes;

    courtMinutes.set(
      reservation.court_id,
      (courtMinutes.get(reservation.court_id) ?? 0) + durationMinutes,
    );

    const weekday = getDay(new Date(reservation.starts_at));

    weekdayReservations.set(
      weekday,
      (weekdayReservations.get(weekday) ?? 0) + 1,
    );
  }

  const numberOfOperatingDays = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  }).length;

  const totalAvailableMinutes =
    numberOfOperatingDays * COURT_COUNT * AVAILABLE_MINUTES_PER_COURT_PER_DAY;

  const utilization =
    totalAvailableMinutes > 0
      ? (totalBookedMinutes / totalAvailableMinutes) * 100
      : 0;

  return {
    totalReservations: reservations.length,
    totalRevenue,
    utilization,
    courtMinutes,
    weekdayReservations,
  };
}

function getHighestEntry(values: Map<number, number>): [number, number] | null {
  const entries = [...values.entries()];

  if (entries.length === 0) {
    return null;
  }

  return entries.reduce((highest, current) =>
    current[1] > highest[1] ? current : highest,
  );
}

export function calculateReservationStatistics(
  reservations: CalendarReservation[],
  now = new Date(),
): ReservationStatistics {
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
  const bestDay = getHighestEntry(report.weekdayReservations);

  const mostUsedCourtId = mostUsedCourt?.[0] ?? null;
  const mostUsedCourtMinutes = mostUsedCourt?.[1] ?? 0;

  /**
   * Compare the winning court with that same court in the previous month.
   * Do not compare it with whichever court won the previous month.
   */
  const previousMostUsedCourtMinutes =
    mostUsedCourtId !== null
      ? (comparison.courtMinutes.get(mostUsedCourtId) ?? 0)
      : 0;

  const bestWeekday = bestDay?.[0] ?? null;
  const bestWeekdayReservations = bestDay?.[1] ?? 0;

  /**
   * Compare the winning weekday with that same weekday
   * in the previous month.
   */
  const previousBestWeekdayReservations =
    bestWeekday !== null
      ? (comparison.weekdayReservations.get(bestWeekday) ?? 0)
      : 0;

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
  };
}
