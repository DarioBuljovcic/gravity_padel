"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { srLatn } from "date-fns/locale";

import { useReservationStatistics } from "@/lib/reservations/useReservationStatistics";
import {
    calculateReservationStatistics,
    type ReservationStatistic,
} from "@/lib/actions/reservationStatistics.actions";

function formatPercentageChange(value: number | null) {
    if (value === null) {
        return "Nema poređenja";
    }

    const prefix = value > 0 ? "+" : "";

    return `${prefix}${value.toFixed(1)}%`;
}

function formatCurrency(value: number, currency = "RSD") {
    return new Intl.NumberFormat("sr-Latn-RS", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDuration(minutes: number) {
    const hours = minutes / 60;

    return `${hours.toFixed(hours % 1 === 0 ? 0 : 1)} h`;
}

function ChangeIndicator({
    statistic,
}: {
    statistic: ReservationStatistic;
}) {
    const change = statistic.percentageChange;

    const changeClass =
        change === null || change === 0
            ? "text-muted-foreground"
            : change > 0
                ? "text-emerald-600"
                : "text-red-600";

    return (
        <p className={`text-sm ${changeClass}`}>
            {formatPercentageChange(change)} u odnosu na prethodni mesec
        </p>
    );
}

const ReservationStatistics = () => {
    const {
        data: reservations = [],
        isPending,
        isFetching,
        isError,
    } = useReservationStatistics();

    const statistics = useMemo(
        () => calculateReservationStatistics(reservations),
        [reservations],
    );

    const currency =
        reservations[0]?.price_currency ?? "RSD";

    const reportMonthLabel = format(
        statistics.reportMonth,
        "LLLL yyyy.",
        {
            locale: srLatn,
        },
    );

    if (isPending) {
        return <p>Učitavanje statistike...</p>;
    }

    if (isError) {
        return <p>Nije moguće učitati statistiku rezervacija.</p>;
    }

    return (
        <section className="space-y-6">
            <header>
                <h2 className="text-2xl font-semibold">
                    Statistike rezervacija
                </h2>

                <p className="text-sm text-muted-foreground">
                    Rezultati za {reportMonthLabel}
                    {isFetching ? " — osvežavanje..." : ""}
                </p>
            </header>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 flex flex-col gap-4 sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Ukupno rezervacija
                    </p>

                    <p className="mt-2 text-3xl font-semibold">
                        {statistics.totalReservations.value}
                    </p>

                    <ChangeIndicator
                        statistic={statistics.totalReservations}
                    />
                </article>

                <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 flex flex-col gap-4 sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Ukupan prihod
                    </p>

                    <p className="mt-2 text-3xl font-semibold">
                        {formatCurrency(
                            statistics.totalRevenue.value,
                            currency,
                        )}
                    </p>

                    <ChangeIndicator
                        statistic={statistics.totalRevenue}
                    />
                </article>

                <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 flex flex-col gap-4 sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Iskorišćenost terena
                    </p>

                    <p className="mt-2 text-3xl font-semibold">
                        {statistics.utilization.value.toFixed(1)}%
                    </p>

                    <ChangeIndicator
                        statistic={statistics.utilization}
                    />
                </article>

                <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 flex flex-col gap-4 sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Najkorišćeniji teren
                    </p>

                    <p className="mt-2 text-3xl font-semibold">
                        {statistics.mostUsedCourt.courtId !== null
                            ? `Teren ${statistics.mostUsedCourt.courtId}`
                            : "—"}
                    </p>

                    <p className="text-sm text-padel-blue">
                        {formatDuration(
                            statistics.mostUsedCourt.bookedMinutes,
                        )}{" "}
                        rezervisano
                    </p>

                    <p
                        className={`text-sm ${statistics.mostUsedCourt.percentageChange ===
                            null ||
                            statistics.mostUsedCourt.percentageChange === 0
                            ? "text-muted-foreground"
                            : statistics.mostUsedCourt
                                .percentageChange > 0
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                    >
                        {formatPercentageChange(
                            statistics.mostUsedCourt.percentageChange,
                        )}{" "}
                        u odnosu na prethodni mesec
                    </p>
                </article>

                <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 flex flex-col gap-4 sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Najbolji dan
                    </p>

                    <p className="mt-2 text-3xl font-semibold">
                        {statistics.bestDay.label}
                    </p>

                    <p className="text-sm text-padel-blue">
                        {statistics.bestDay.reservations} rezervacija
                    </p>

                    <p
                        className={`text-sm ${statistics.bestDay.percentageChange === null ||
                            statistics.bestDay.percentageChange === 0
                            ? "text-muted-foreground"
                            : statistics.bestDay.percentageChange > 0
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                    >
                        {formatPercentageChange(
                            statistics.bestDay.percentageChange,
                        )}{" "}
                        u odnosu na prethodni mesec
                    </p>
                </article>
            </div>
        </section>
    );
};

export default ReservationStatistics;