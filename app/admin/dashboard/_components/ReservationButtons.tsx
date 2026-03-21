"use client";

import { useTransition } from "react";
import { cancelReservationAction } from "@/lib/actions/reservation.actions";

export function ReservationButtons({ id, status }: { id: string, status: string }) {
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    if (confirm("Otkaži ovu rezervaciju?")) {
      startTransition(async () => {
        await cancelReservationAction(id);
      });
    }
  };

  if (status === "cancelled") return <span className="text-[9px] font-black uppercase text-slate-600">Otkazano</span>;

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={isPending}
        onClick={handleCancel}
        className="btn-press text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all duration-300 disabled:opacity-50"
      >
        {isPending ? "..." : "Otkaži"}
      </button>
    </div>
  );
}

