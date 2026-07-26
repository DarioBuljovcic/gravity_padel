"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Search,
  X,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { courts } from "@/lib/reservations/domain";
import type { ReservationFilters as Filters } from "@/lib/actions/reservation.actions";

type Props = {
  initial: Filters;
};

const fieldClass =
  "h-11 border-white/10 bg-slate-950/60 text-white placeholder:text-slate-500 transition-colors " +
  "focus-visible:border-primary-orange/50 focus-visible:ring-primary-orange/20 dark:bg-slate-950/60 " +
  "disabled:cursor-not-allowed disabled:opacity-40";

const fieldWithIconClass = `${fieldClass} pl-10`;

export default function ReservationFilters({ initial }: Props) {
  const router = useRouter();
  const [courtId, setCourtId] = useState(
    initial.courtId != null ? String(initial.courtId) : "all",
  );
  const [date, setDate] = useState(initial.date ?? "");
  const [timeFrom, setTimeFrom] = useState(initial.timeFrom ?? "");
  const [timeTo, setTimeTo] = useState(initial.timeTo ?? "");
  const [name, setName] = useState(initial.name ?? "");

  const hasDate = Boolean(date);
  const hasActiveFilters =
    courtId !== "all" || date || timeFrom || timeTo || name.trim();

  function buildHref(next: {
    courtId: string;
    date: string;
    timeFrom: string;
    timeTo: string;
    name: string;
  }) {
    const params = new URLSearchParams();
    params.set("tab", "reservations");
    if (next.courtId && next.courtId !== "all") {
      params.set("court", next.courtId);
    }
    if (next.date) params.set("date", next.date);
    if (next.date && next.timeFrom) params.set("timeFrom", next.timeFrom);
    if (next.date && next.timeTo) params.set("timeTo", next.timeTo);
    if (next.name.trim()) params.set("name", next.name.trim());
    return `/admin?${params.toString()}`;
  }

  function apply(event: React.FormEvent) {
    event.preventDefault();
    router.push(buildHref({ courtId, date, timeFrom, timeTo, name }));
  }

  function reset() {
    setCourtId("all");
    setDate("");
    setTimeFrom("");
    setTimeTo("");
    setName("");
    router.push("/admin?tab=reservations");
  }

  return (
    <form
      onSubmit={apply}
      className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 shadow-sm shadow-black/20 md:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <div className="space-y-2">
          <Label htmlFor="filter-court" className="text-slate-400">
            Teren
          </Label>
          <Select
            value={courtId}
            onValueChange={(value) => setCourtId(value ?? "all")}
          >
            <SelectTrigger
              id="filter-court"
              className={`w-full ${fieldClass} [&>span]:flex [&>span]:items-center [&>span]:gap-2`}
            >
              <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
              <SelectValue placeholder="Svi tereni" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-slate-900 text-white">
              <SelectItem value="all">Svi tereni</SelectItem>
              {courts.map((court) => (
                <SelectItem key={court.id} value={String(court.id)}>
                  {court.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-date" className="text-slate-400">
            Datum
          </Label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              id="filter-date"
              type="date"
              value={date}
              onChange={(event) => {
                const next = event.target.value;
                setDate(next);
                if (!next) {
                  setTimeFrom("");
                  setTimeTo("");
                }
              }}
              className={`${fieldWithIconClass} [color-scheme:dark]`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="filter-time-from"
            className="flex items-center justify-between text-slate-400"
          >
            <span>Vreme od</span>
            {!hasDate && (
              <span className="text-xs font-normal text-slate-600">
                izaberite datum
              </span>
            )}
          </Label>
          <div className="relative">
            <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              id="filter-time-from"
              type="time"
              value={timeFrom}
              disabled={!hasDate}
              onChange={(event) => setTimeFrom(event.target.value)}
              className={`${fieldWithIconClass} [color-scheme:dark]`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-time-to" className="text-slate-400">
            Vreme do
          </Label>
          <div className="relative">
            <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              id="filter-time-to"
              type="time"
              value={timeTo}
              disabled={!hasDate}
              onChange={(event) => setTimeTo(event.target.value)}
              className={`${fieldWithIconClass} [color-scheme:dark]`}
            />
          </div>
        </div>

        <div className="space-y-2 sm:col-span-2 lg:col-span-3 xl:col-span-1">
          <Label htmlFor="filter-name" className="text-slate-400">
            Ime
          </Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              id="filter-name"
              type="search"
              placeholder="Pretraži po imenu gosta..."
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={`${fieldWithIconClass} pr-9 [&::-webkit-search-cancel-button]:appearance-none`}
            />
            {name && (
              <button
                type="button"
                onClick={() => setName("")}
                aria-label="Obriši pretragu po imenu"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          className="gap-2 bg-primary-orange text-slate-950 hover:bg-primary-orange/90"
        >
          <Search className="h-4 w-4" />
          Primeni
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={reset}
          disabled={!hasActiveFilters}
          className="gap-2 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" />
          Resetuj
        </Button>
        {hasActiveFilters && (
          <span className="text-xs text-slate-500">Filteri su aktivni</span>
        )}
      </div>
    </form>
  );
}