import "server-only";

import { formatInTimeZone } from "date-fns-tz";

import { getReservations } from "@/lib/actions/reservation.actions";
import {
  formatCourtDisplayName,
  getCourt,
  serbianCourtLabel,
} from "@/lib/courts";
import { CURRENCY, VENUE_TIME_ZONE } from "@/lib/reservations/domain";
import type { ReservationStatisticsResponse } from "../types";
import { calculateReservationStatistics } from "./calculate";
import { getStatisticsPeriod } from "./period";

export async function getReservationStatistics(
  now = new Date(),
): Promise<ReservationStatisticsResponse> {
  const reportPeriod = getStatisticsPeriod(now);
  const comparisonPeriod = getStatisticsPeriod(
    new Date(reportPeriod.start.getTime() - 1),
  );

  const dateFrom = formatInTimeZone(
    comparisonPeriod.start,
    VENUE_TIME_ZONE,
    "yyyy-MM-dd",
  );
  const dateTo = formatInTimeZone(
    new Date(reportPeriod.end.getTime() - 1),
    VENUE_TIME_ZONE,
    "yyyy-MM-dd",
  );

  const reservations = await getReservations({
    dateFrom,
    dateTo,
    activeOnly: true,
    kind: "booking",
  });

  const statistics = calculateReservationStatistics(reservations, now);
  const currency = reservations[0]?.price_currency ?? CURRENCY;
  const mostUsedCourtId = statistics.mostUsedCourt.courtId;
  const mostUsedCourt = mostUsedCourtId != null
    ? await getCourt(mostUsedCourtId)
    : undefined;

  return {
    reportMonth: statistics.reportMonth.toISOString(),
    comparisonMonth: statistics.comparisonMonth.toISOString(),
    currency,
    totalReservations: statistics.totalReservations,
    totalRevenue: statistics.totalRevenue,
    utilization: statistics.utilization,
    mostUsedCourt: {
      ...statistics.mostUsedCourt,
      courtName:
        mostUsedCourtId != null
          ? formatCourtDisplayName(
              mostUsedCourt?.name ?? null,
              serbianCourtLabel(mostUsedCourtId),
            )
          : null,
    },
    bestDay: statistics.bestDay,
    bestRevenueDay: statistics.bestRevenueDay,
    morningReservations: statistics.morningReservations,
    afternoonReservations: statistics.afternoonReservations,
    morningRevenue: statistics.morningRevenue,
    afternoonRevenue: statistics.afternoonRevenue,
    packageGroups: statistics.packageGroups,
  };
}
