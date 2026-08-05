"use client";

import { courts } from "@/lib/reservations/domain";
import { ALL_COURT_IDS } from "./constants";

type Props = {
  value: number[];
  onChange: (courtIds: number[]) => void;
};

export default function CourtMultiSelect({ value, onChange }: Props) {
  const allSelected =
    ALL_COURT_IDS.length > 0 &&
    ALL_COURT_IDS.every((id) => value.includes(id));

  function toggleAll() {
    onChange(allSelected ? [] : [...ALL_COURT_IDS]);
  }

  function toggleCourt(courtId: number) {
    if (value.includes(courtId)) {
      onChange(value.filter((id) => id !== courtId));
      return;
    }
    onChange([...value, courtId].sort((a, b) => a - b));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Tereni
        </span>
        <button
          type="button"
          onClick={toggleAll}
          className="text-xs text-primary-orange hover:text-primary-orange/80"
        >
          {allSelected ? "Poništi sve" : "Svi tereni"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {courts.map((court) => {
          const selected = value.includes(court.id);
          return (
            <button
              key={court.id}
              type="button"
              onClick={() => toggleCourt(court.id)}
              className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                selected
                  ? "border-primary-orange/60 bg-primary-orange/15 text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {court.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
