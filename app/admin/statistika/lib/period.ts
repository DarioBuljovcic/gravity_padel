import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isWithinInterval,
  startOfMonth,
} from "date-fns";

import type { CalendarReservation } from "@/lib/reservations/calendar-mapping";
import type {
  PackageGroupStatistic,
  PeriodStatistics,
} from "../types";
import {
  AVAILABLE_MINUTES_PER_COURT_PER_DAY,
  COURT_COUNT,
  DURATION_LABELS,
  PACKAGE_GROUP_ORDER,
  packageGroupKey,
  periodLabel,
} from "./constants";

export function getReservationsInMonth(
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

function isMorningPackage(packageId: string) {
  return packageId.startsWith("morning_");
}

function isAfternoonPackage(packageId: string) {
  return packageId.startsWith("afternoon_");
}

function resolvePeriod(packageId: string): "morning" | "afternoon" | null {
  if (isMorningPackage(packageId)) return "morning";
  if (isAfternoonPackage(packageId)) return "afternoon";
  return null;
}

function resolveDuration(
  durationMinutes: number,
): 60 | 90 | 120 | null {
  if (durationMinutes === 60 || durationMinutes === 90 || durationMinutes === 120) {
    return durationMinutes;
  }
  return null;
}

export function calculatePeriodStatistics(
  reservations: CalendarReservation[],
  month: Date,
): PeriodStatistics {
  const courtMinutes = new Map<number, number>();
  const weekdayReservations = new Map<number, number>();
  const dailyRevenue = new Map<string, { revenue: number; reservations: number }>();
  const packageGroups = new Map<string, { count: number; revenue: number }>();

  let totalRevenue = 0;
  let totalBookedMinutes = 0;
  let morningReservations = 0;
  let afternoonReservations = 0;
  let morningRevenue = 0;
  let afternoonRevenue = 0;

  for (const reservation of reservations) {
    const durationMinutes = reservation.duration_minutes;
    const price = reservation.price_amount;

    totalRevenue += price;
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

    const dateKey = format(new Date(reservation.starts_at), "yyyy-MM-dd");
    const dayBucket = dailyRevenue.get(dateKey) ?? {
      revenue: 0,
      reservations: 0,
    };
    dayBucket.revenue += price;
    dayBucket.reservations += 1;
    dailyRevenue.set(dateKey, dayBucket);

    const period = resolvePeriod(reservation.package_id);
    const duration = resolveDuration(durationMinutes);

    if (period === "morning") {
      morningReservations += 1;
      morningRevenue += price;
    } else if (period === "afternoon") {
      afternoonReservations += 1;
      afternoonRevenue += price;
    }

    if (period && duration) {
      const key = packageGroupKey(period, duration);
      const group = packageGroups.get(key) ?? { count: 0, revenue: 0 };
      group.count += 1;
      group.revenue += price;
      packageGroups.set(key, group);
    }
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
    morningReservations,
    afternoonReservations,
    morningRevenue,
    afternoonRevenue,
    courtMinutes,
    weekdayReservations,
    dailyRevenue,
    packageGroups,
  };
}

export function toPackageGroupStatistics(
  packageGroups: Map<string, { count: number; revenue: number }>,
): PackageGroupStatistic[] {
  return PACKAGE_GROUP_ORDER.map(({ period, durationMinutes }) => {
    const bucket = packageGroups.get(
      packageGroupKey(period, durationMinutes),
    ) ?? { count: 0, revenue: 0 };

    return {
      period,
      periodLabel: periodLabel(period),
      durationMinutes,
      durationLabel: DURATION_LABELS[durationMinutes],
      count: bucket.count,
      revenue: bucket.revenue,
    };
  });
}

export function getHighestEntry(
  values: Map<number, number>,
): [number, number] | null {
  const entries = [...values.entries()];

  if (entries.length === 0) {
    return null;
  }

  return entries.reduce((highest, current) =>
    current[1] > highest[1] ? current : highest,
  );
}

export function getHighestDailyRevenue(
  values: Map<string, { revenue: number; reservations: number }>,
): [string, { revenue: number; reservations: number }] | null {
  const entries = [...values.entries()];

  if (entries.length === 0) {
    return null;
  }

  return entries.reduce((highest, current) =>
    current[1].revenue > highest[1].revenue ? current : highest,
  );
}
