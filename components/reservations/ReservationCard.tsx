"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cancelReservation } from "@/lib/actions/reservation.actions";
import { formatPrice, getPackage } from "@/lib/reservations/domain";

const localeToDateLocale: Record<string, string> = {
  sr: "sr-RS",
  en: "en-GB",
  hu: "hu-HU",
};

type ReservationCardProps = {
  reservation: {
    id: string;
    starts_at: string;
    court_id: number;
    package_id: string;
    duration_minutes: number;
    price_amount: number;
    status: "active" | "cancelled";
  };
  courtName: string;
  canCancel?: boolean;
  canRebook?: boolean;
};

export default function ReservationCard({
  reservation,
  courtName,
  canCancel = false,
  canRebook = false,
}: ReservationCardProps) {
  const t = useTranslations("ReservationCard");
  const locale = useLocale();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bookingPackage = getPackage(reservation.package_id);
  const startsAt = new Intl.DateTimeFormat(localeToDateLocale[locale] ?? "sr-RS", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Belgrade",
  }).format(new Date(reservation.starts_at));

  async function cancel() {
    if (!confirm(t("cancelConfirm"))) return;
    setPending(true);
    setError(null);
    const result = await cancelReservation(reservation.id);
    setPending(false);
    if (!result.success) return setError(result.error ?? t("cancelError"));
    router.refresh();
  }

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-lg font-black text-white">{startsAt}</p>
          <p className="mt-1 text-sm text-slate-400">
            {courtName} · {bookingPackage?.label ?? `${reservation.duration_minutes} min`} · {formatPrice(reservation.price_amount)}
          </p>
          <p className={`mt-2 text-xs font-bold uppercase ${reservation.status === "active" ? "text-green-400" : "text-red-400"}`}>
            {reservation.status === "active" ? t("statusActive") : t("statusCancelled")}
          </p>
        </div>
        <div className="flex gap-2">
          {canRebook && (
            <Link
              href={`/rezervacija?package=${encodeURIComponent(reservation.package_id)}&court=${reservation.court_id}`}
              className="rounded-lg bg-padel-blue px-4 py-2 text-xs font-black uppercase text-white"
            >
              {t("rebook")}
            </Link>
          )}
          {canCancel && reservation.status === "active" && (
            <button
              disabled={pending}
              onClick={cancel}
              className="rounded-lg border border-red-500/30 px-4 py-2 text-xs font-black uppercase text-red-400 disabled:opacity-50"
            >
              {pending ? t("cancelling") : t("cancel")}
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </article>
  );
}
