import {
  getReservations,
  type ReservationFilters,
} from "@/lib/actions/reservation.actions";
import ReservationFiltersForm from "./ReservationFilters";
import ReservationsCalendar from "./ReservationsCalendar";
import { getDefaultWeekRange } from "./reservation-calendar-utils";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

type SearchParams = { [key: string]: string | undefined };

function parseFilters(params: SearchParams): Pick<
  ReservationFilters,
  "courtId" | "name"
> {
  const courtRaw = params.court ? Number(params.court) : undefined;
  const courtId =
    courtRaw != null &&
      Number.isInteger(courtRaw) &&
      courtRaw >= 1 &&
      courtRaw <= 4
      ? courtRaw
      : undefined;

  const name = params.name?.trim() || undefined;

  return { courtId, name };
}

export default async function ReservationsTab({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = parseFilters(searchParams);
  const week = getDefaultWeekRange();
  const reservations = await getReservations({
    ...filters,
    dateFrom: week.dateFrom,
    dateTo: week.dateTo,
  });
  const filterKey = [filters.courtId ?? "", filters.name ?? ""].join("|");

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-start justify-between">
          <h2 className="text-xl font-bold uppercase tracking-widest text-white">
            Sve rezervacije
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Kalendar termina po terenima
          </p>
        </div>
        <Link href="/admin/rezervacije/nova">
          <Button variant="accent" type="button">
            <PlusIcon className="h-4 w-4" />
            Dodaj rezervaciju
          </Button>
        </Link>
      </div>

      <ReservationFiltersForm initial={filters} />

      <ReservationsCalendar
        key={filterKey}
        initialReservations={reservations}
        filters={filters}
      />
    </section>
  );
}
