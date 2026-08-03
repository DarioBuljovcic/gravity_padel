"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import ReservationCard from "@/components/reservations/ReservationCard";
import { getAccountReservationHistory } from "@/lib/actions/reservation.actions";

const PAGE_SIZE = 10;

type Reservation = {
  id: string;
  starts_at: string;
  court_id: number;
  package_id: string;
  duration_minutes: number;
  price_amount: number;
  status: "active" | "cancelled";
};

type ReservationHistoryProps = {
  initialReservations: Reservation[];
  initialHasMore: boolean;
};

export default function ReservationHistory({
  initialReservations,
  initialHasMore,
}: ReservationHistoryProps) {
  const t = useTranslations("Account");
  const [reservations, setReservations] = useState(initialReservations);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function loadMore() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await getAccountReservationHistory(reservations.length, PAGE_SIZE);
        setReservations((current) => [...current, ...result.reservations]);
        setHasMore(result.hasMore);
      } catch {
        setError(t("loadMoreError"));
      }
    });
  }

  if (reservations.length === 0) {
    return (
      <p className="rounded-2xl border border-white/10 p-6 text-slate-500">
        {t("historyEmpty")}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {reservations.map((reservation) => (
        <ReservationCard key={reservation.id} reservation={reservation} canRebook />
      ))}
      {hasMore && (
        <button
          type="button"
          disabled={pending}
          onClick={loadMore}
          className="w-full rounded-xl border border-white/10 px-5 py-3 text-xs font-black uppercase text-slate-300 transition hover:border-white/20 hover:text-white disabled:opacity-50"
        >
          {pending ? t("loading") : t("loadMore")}
        </button>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
