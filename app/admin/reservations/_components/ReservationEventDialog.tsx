"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cancelReservation } from "@/lib/actions/reservation.actions";
import { formatPrice, getPackage } from "@/lib/reservations/domain";
import type { LabeledCourt } from "@/lib/courts";
import type { CalendarReservation } from "@/lib/reservations/calendar-mapping";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  reservation: CalendarReservation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancelled?: (id: string) => void;
  courts: LabeledCourt[];
};

export default function ReservationEventDialog({
  reservation,
  open,
  onOpenChange,
  onCancelled,
  courts,
}: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!reservation) return null;

  const isEvent = reservation.kind === "event";
  const courtName =
    courts.find((court) => court.id === reservation.court_id)?.displayName ??
    `Teren ${reservation.court_id}`;
  const bookingPackage = getPackage(reservation.package_id);
  const startsAt = new Intl.DateTimeFormat("sr-RS", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Belgrade",
  }).format(new Date(reservation.starts_at));
  const endsAt = new Intl.DateTimeFormat("sr-RS", {
    timeStyle: "short",
    timeZone: "Europe/Belgrade",
  }).format(new Date(reservation.ends_at));

  async function cancel() {
    if (!reservation) return;
    const message = isEvent
      ? "Da li želite da uklonite ovu zauzetost sa svih terena u grupi?"
      : "Da li želite da otkažete ovu rezervaciju?";
    if (!confirm(message)) return;
    setPending(true);
    setError(null);
    const result = await cancelReservation(reservation.id);
    setPending(false);
    if (!result.success) {
      setError(
        result.error ??
          (isEvent
            ? "Događaj nije moguće otkazati."
            : "Rezervaciju nije moguće otkazati."),
      );
      return;
    }
    onCancelled?.(reservation.id);
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setError(null);
        onOpenChange(next);
      }}
    >
      <DialogContent className="border-white/10 bg-slate-900 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">{reservation.name}</DialogTitle>
          <DialogDescription className="text-slate-400">
            {startsAt} – {endsAt}
          </DialogDescription>
        </DialogHeader>

        <dl className="grid gap-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Tip</dt>
            <dd className="text-right text-xs font-bold uppercase text-amber-300">
              {isEvent ? "Događaj / zauzeto" : "Rezervacija"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Teren</dt>
            <dd className="text-right text-slate-200">
              {courtName}
              {isEvent && reservation.event_group_id
                ? " (deo grupe)"
                : null}
            </dd>
          </div>
          {!isEvent && (
            <>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Paket</dt>
                <dd className="text-right text-slate-200">
                  {bookingPackage?.label ??
                    `${reservation.duration_minutes} min`}{" "}
                  · {formatPrice(reservation.price_amount)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Telefon</dt>
                <dd className="text-right text-slate-200">{reservation.phone}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Email</dt>
                <dd className="break-all text-right text-slate-200">
                  {reservation.email}
                </dd>
              </div>
            </>
          )}
          {isEvent && (
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Trajanje</dt>
              <dd className="text-right text-slate-200">
                {reservation.duration_minutes} min
              </dd>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Status</dt>
            <dd
              className={`text-right text-xs font-bold uppercase ${
                reservation.status === "active"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {reservation.status === "active" ? "Aktivna" : "Otkazana"}
            </dd>
          </div>
        </dl>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            onClick={() => onOpenChange(false)}
          >
            Zatvori
          </Button>
          {reservation.status === "active" && (
            <Button
              type="button"
              variant="destructive"
              disabled={pending}
              onClick={cancel}
            >
              {pending
                ? "Otkazivanje…"
                : isEvent
                  ? "Ukloni zauzetost"
                  : "Otkaži"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
