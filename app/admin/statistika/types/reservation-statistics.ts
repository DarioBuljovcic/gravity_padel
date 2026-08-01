export type ReservationStatistic = {
  value: number;
  previousValue: number;
  percentageChange: number | null;
};

export type MostUsedCourtStatistic = {
  courtId: number | null;
  bookedMinutes: number;
  previousBookedMinutes: number;
  percentageChange: number | null;
};

export type BestDayStatistic = {
  weekday: number | null;
  label: string;
  reservations: number;
  previousReservations: number;
  percentageChange: number | null;
};

export type BestRevenueDayStatistic = {
  date: string | null;
  label: string;
  revenue: number;
  reservations: number;
};

export type PackageGroupStatistic = {
  period: "morning" | "afternoon";
  periodLabel: string;
  durationMinutes: 60 | 90 | 120;
  durationLabel: string;
  count: number;
  revenue: number;
};

/** Internal calculation result (Date objects). */
export type ReservationStatisticsResult = {
  reportMonth: Date;
  comparisonMonth: Date;
  totalReservations: ReservationStatistic;
  totalRevenue: ReservationStatistic;
  utilization: ReservationStatistic;
  mostUsedCourt: MostUsedCourtStatistic;
  bestDay: BestDayStatistic;
  bestRevenueDay: BestRevenueDayStatistic;
  morningReservations: ReservationStatistic;
  afternoonReservations: ReservationStatistic;
  morningRevenue: ReservationStatistic;
  afternoonRevenue: ReservationStatistic;
  packageGroups: PackageGroupStatistic[];
};

/** JSON-safe API response. */
export type ReservationStatisticsResponse = {
  reportMonth: string;
  comparisonMonth: string;
  currency: string;
  totalReservations: ReservationStatistic;
  totalRevenue: ReservationStatistic;
  utilization: ReservationStatistic;
  mostUsedCourt: MostUsedCourtStatistic;
  bestDay: BestDayStatistic;
  bestRevenueDay: BestRevenueDayStatistic;
  morningReservations: ReservationStatistic;
  afternoonReservations: ReservationStatistic;
  morningRevenue: ReservationStatistic;
  afternoonRevenue: ReservationStatistic;
  packageGroups: PackageGroupStatistic[];
};

export type PackageGroupBucket = {
  count: number;
  revenue: number;
};

export type PeriodStatistics = {
  totalReservations: number;
  totalRevenue: number;
  utilization: number;
  morningReservations: number;
  afternoonReservations: number;
  morningRevenue: number;
  afternoonRevenue: number;
  courtMinutes: Map<number, number>;
  weekdayReservations: Map<number, number>;
  dailyRevenue: Map<string, { revenue: number; reservations: number }>;
  packageGroups: Map<string, PackageGroupBucket>;
};
