import ReservationCard from "@/components/reservations/ReservationCard";
import {
  getReservations,
  type ReservationFilters,
} from "@/lib/actions/reservation.actions";
import ReservationFiltersForm from "./ReservationFilters";

type SearchParams = { [key: string]: string | undefined };

function parseFilters(params: SearchParams): ReservationFilters {
  const courtRaw = params.court ? Number(params.court) : undefined;
  const courtId =
    courtRaw != null &&
    Number.isInteger(courtRaw) &&
    courtRaw >= 1 &&
    courtRaw <= 4
      ? courtRaw
      : undefined;

  const date =
    params.date && /^\d{4}-\d{2}-\d{2}$/.test(params.date)
      ? params.date
      : undefined;

  const timeFrom =
    date &&
    params.timeFrom &&
    /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(params.timeFrom)
      ? params.timeFrom.slice(0, 5)
      : undefined;

  const timeTo =
    date &&
    params.timeTo &&
    /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(params.timeTo)
      ? params.timeTo.slice(0, 5)
      : undefined;

  const name = params.name?.trim() || undefined;

  return { courtId, date, timeFrom, timeTo, name };
}

export default async function ReservationsTab({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = parseFilters(searchParams);
  const reservations = await getReservations(filters);
  const filterKey = [
    filters.courtId ?? "",
    filters.date ?? "",
    filters.timeFrom ?? "",
    filters.timeTo ?? "",
    filters.name ?? "",
  ].join("|");

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
        <h2 className="text-xl font-bold uppercase tracking-widest text-white">
          Sve rezervacije
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Pregled i upravljanje terminima
        </p>
      </div>

      <ReservationFiltersForm key={filterKey} initial={filters} />

      {reservations.length === 0 ? (
        <p className="py-10 text-center text-slate-400">
          Nema pronađenih rezervacija.
        </p>
      ) : (
        reservations.map((reservation) => (
          <div key={reservation.id}>
            <ReservationCard reservation={reservation} canCancel />
            <div className="-mt-3 rounded-b-2xl border border-t-0 border-white/10 bg-slate-900/40 px-5 pb-4 pt-5 text-sm text-slate-400">
              {reservation.name} · {reservation.phone} · {reservation.email}
            </div>
          </div>
        ))
      )}
    </section>
  );
}
