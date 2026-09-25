import { differenceInCalendarDays, format, getDay } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { srLatn } from "date-fns/locale";

import type { CalendarReservation } from "@/lib/reservations/calendar-mapping";
import {
  VENUE_TIME_ZONE,
  venueLocalToUtcIso,
} from "@/lib/reservations/domain";
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
  STATISTICS_PERIOD_DAY,
} from "./constants";

function venueCalendar(reference: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: VENUE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(reference);
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
  };
}

function shiftMonth(year: number, month: number, delta: number) {
  const shifted = new Date(Date.UTC(year, month - 1 + delta, 1));
  return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth() + 1 };
}

function periodDateKey(year: number, month: number) {
  const day = String(STATISTICS_PERIOD_DAY).padStart(2, "0");
  const monthKey = String(month).padStart(2, "0");
  return `${year}-${monthKey}-${day}`;
}

/** Half-open Belgrade window [26th 00:00, next 26th 00:00). The closing 26th starts the next period. */
export function getStatisticsPeriod(reference: Date) {
  const { year, month, day } = venueCalendar(reference);
  const startMonth =
    day >= STATISTICS_PERIOD_DAY
      ? { year, month }
      : shiftMonth(year, month, -1);
  const endMonth = shiftMonth(startMonth.year, startMonth.month, 1);

  return {
    start: new Date(
      venueLocalToUtcIso(periodDateKey(startMonth.year, startMonth.month), "00:00"),
    ),
    end: new Date(
      venueLocalToUtcIso(periodDateKey(endMonth.year, endMonth.month), "00:00"),
    ),
  };
}

export function formatStatisticsPeriodLabel(reference: Date) {
  const { start, end } = getStatisticsPeriod(reference);
  const startLabel = formatInTimeZone(start, VENUE_TIME_ZONE, "d. LLLL", {
    locale: srLatn,
  });
  const endLabel = formatInTimeZone(end, VENUE_TIME_ZONE, "d. LLLL yyyy.", {
    locale: srLatn,
  });

  return `${startLabel} – ${endLabel}`;
}

export function getReservationsInMonth(
  reservations: CalendarReservation[],
  month: Date,
) {
  const { start, end } = getStatisticsPeriod(month);

  return reservations.filter((reservation) => {
    const startsAt = new Date(reservation.starts_at);
    return startsAt >= start && startsAt < end;
  });
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

  const { start, end } = getStatisticsPeriod(month);
  const numberOfOperatingDays = differenceInCalendarDays(end, start);

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
