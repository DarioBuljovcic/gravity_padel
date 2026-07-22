import ReservationCard from "@/components/reservations/ReservationCard";
import { getReservations } from "@/lib/actions/reservation.actions";

export default async function ReservationsTab() {
  const reservations = await getReservations();

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
        <h2 className="text-xl font-bold uppercase tracking-widest text-white">Sve rezervacije</h2>
        <p className="mt-1 text-sm text-slate-400">Pregled i upravljanje terminima</p>
      </div>
      {reservations.length === 0 ? (
        <p className="py-10 text-center text-slate-400">Nema pronađenih rezervacija.</p>
      ) : reservations.map((reservation) => (
        <div key={reservation.id}>
          <ReservationCard reservation={reservation} canCancel />
          <div className="-mt-3 rounded-b-2xl border border-t-0 border-white/10 bg-slate-900/40 px-5 pb-4 pt-5 text-sm text-slate-400">
            {reservation.name} · {reservation.phone} · {reservation.email}
          </div>
        </div>
      ))}
    </section>
  );
}
