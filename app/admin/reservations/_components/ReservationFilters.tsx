"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Search, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup
} from "@/components/ui/select";
import type { LabeledCourt } from "@/lib/courts";
import type { ReservationFilters as Filters } from "@/lib/actions/reservation.actions";

type Props = {
  initial: Pick<Filters, "courtId" | "name">;
  courts: LabeledCourt[];
};

const fieldClass =
  "h-11 border-white/10 bg-slate-950/60 text-white placeholder:text-slate-500 transition-colors " +
  "focus-visible:border-primary-orange/50 focus-visible:ring-primary-orange/20 dark:bg-slate-950/60 " +
  "disabled:cursor-not-allowed disabled:opacity-40";

const fieldWithIconClass = `${fieldClass} pl-10`;

export default function ReservationFilters({ initial, courts }: Props) {
  const router = useRouter();
  const [courtId, setCourtId] = useState(
    initial.courtId != null ? String(initial.courtId) : "all",
  );
  const [name, setName] = useState(initial.name ?? "");

  const hasActiveFilters = courtId !== "all" || name.trim();

  function buildHref(next: { courtId: string; name: string }) {
    const params = new URLSearchParams();
    params.set("tab", "reservations");
    if (next.courtId && next.courtId !== "all") {
      params.set("court", next.courtId);
    }
    if (next.name.trim()) params.set("name", next.name.trim());
    return `/admin?${params.toString()}`;
  }

  function apply(event: React.FormEvent) {
    event.preventDefault();
    router.push(buildHref({ courtId, name }));
  }

  function reset() {
    setCourtId("all");
    setName("");
    router.push("/admin?tab=reservations");
  }

  return (
    <form
      onSubmit={apply}
      className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 shadow-sm shadow-black/20 md:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="filter-court" className="text-slate-400">
            Teren
          </Label>
          <Select
            key={courts.length}
            value={courtId}
            items={[
              { label: "Svi tereni", value: "all" },
              ...courts.map((court) => ({
                label: court.displayName,
                value: court.id.toString(),
              })),
            ]}
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
              <SelectGroup>
                <SelectItem value="all">Svi tereni</SelectItem>
                {courts.map((court) => (
                  <SelectItem key={court.id} value={court.id.toString()}>
                    {court.displayName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-1 lg:col-span-2">
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
