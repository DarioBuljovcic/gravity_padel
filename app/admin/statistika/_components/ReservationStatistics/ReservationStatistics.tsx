"use client";

import { format } from "date-fns";
import { srLatn } from "date-fns/locale";

import { useReservationStatistics } from "../../useReservationStatistics";
import { ChangeIndicator } from "../ChangeIndicator";
import {
  formatCurrency,
  formatDuration,
} from "../formatters";
import { StatCard } from "../StatCard";
import { StatisticsHeader } from "../StatisticsHeader";

export default function ReservationStatistics() {
  const { data, isPending, isFetching, isError } = useReservationStatistics();

  if (isPending) {
    return <p className="text-slate-400">Učitavanje statistike...</p>;
  }

  if (isError || !data) {
    return (
      <p className="text-slate-400">
        Nije moguće učitati statistiku rezervacija.
      </p>
    );
  }

  const reportMonthLabel = format(new Date(data.reportMonth), "LLLL yyyy.", {
    locale: srLatn,
  });

  return (
    <section className="space-y-6">
      <StatisticsHeader
        reportMonthLabel={reportMonthLabel}
        isFetching={isFetching}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Ukupno rezervacija"
          value={data.totalReservations.value}
          footer={<ChangeIndicator statistic={data.totalReservations} />}
        />
        <StatCard
          label="Ukupan prihod"
          value={formatCurrency(data.totalRevenue.value, data.currency)}
          footer={<ChangeIndicator statistic={data.totalRevenue} />}
        />
        <StatCard
          variant="radial"
          label="Iskorišćenost"
          percentage={data.utilization.value}
          footer={<ChangeIndicator statistic={data.utilization} />}
        />
        <StatCard
          label="Najkorišćeniji teren"
          value={data.mostUsedCourt.courtName ?? "—"}
          detail={
            <p className="text-sm text-padel-blue">
              {formatDuration(data.mostUsedCourt.bookedMinutes)} rezervisano
            </p>
          }
          footer={
            <ChangeIndicator
              statistic={{
                value: data.mostUsedCourt.bookedMinutes,
                previousValue: data.mostUsedCourt.previousBookedMinutes,
                percentageChange: data.mostUsedCourt.percentageChange,
              }}
            />
          }
        />
        <StatCard
          label="Najpopularniji dan"
          value={data.bestDay.label}
          detail={
            <p className="text-sm text-padel-blue">
              {data.bestDay.reservations} rezervacija
            </p>
          }
        />
        <StatCard
          label="Najbolji dan"
          value={data.bestRevenueDay.label}
          detail={
            <p className="text-sm text-padel-blue">
              {formatCurrency(data.bestRevenueDay.revenue, data.currency)}
            </p>
          }
        />
        <StatCard
          label="Rezervacije pre podne"
          value={data.morningReservations.value}
          detail={
            <p className="text-sm text-slate-400">
              09:00 – 16:00 ·{" "}
              {formatCurrency(data.morningRevenue.value, data.currency)}
            </p>
          }
          footer={<ChangeIndicator statistic={data.morningReservations} />}
        />
        <StatCard
          label="Rezervacije posle podne"
          value={data.afternoonReservations.value}
          detail={
            <p className="text-sm text-slate-400">
              16:00 – 23:00 ·{" "}
              {formatCurrency(data.afternoonRevenue.value, data.currency)}
            </p>
          }
          footer={<ChangeIndicator statistic={data.afternoonReservations} />}
        />
      </div>
    </section>
  );
}
