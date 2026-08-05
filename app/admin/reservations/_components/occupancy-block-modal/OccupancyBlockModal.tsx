"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createOccupancyBlock } from "@/lib/actions/occupancy.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ALL_COURT_IDS, OCCUPANCY_TITLE_MAX } from "./constants";
import { isValidHourRange, minutesToTimeLabel } from "./hour-range";
import OccupancyBlockForm from "./OccupancyBlockForm";
import type {
  HourRange,
  OccupancyBlockDraft,
  OccupancyBlockFormErrors,
} from "./types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
  /** When set, applied each time the dialog opens. */
  draft?: OccupancyBlockDraft | null;
};

const todayVenueDate = (): string =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Belgrade",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

const OccupancyBlockModal = ({
  open,
  onOpenChange,
  onCreated,
  draft = null,
}: Props) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayVenueDate);
  const [courtIds, setCourtIds] = useState<number[]>([...ALL_COURT_IDS]);
  const [range, setRange] = useState<HourRange | null>(null);
  const [errors, setErrors] = useState<OccupancyBlockFormErrors>({});
  const [pending, setPending] = useState(false);

  const applyDefaults = useCallback(() => {
    setTitle(draft?.title ?? "");
    setDate(draft?.date ?? todayVenueDate());
    setCourtIds(draft?.courtIds?.length ? [...draft.courtIds] : [...ALL_COURT_IDS]);
    setRange(draft?.range ?? null);
    setErrors({});
    setPending(false);
  }, [draft]);

  useEffect(() => {
    if (open) applyDefaults();
  }, [open, applyDefaults]);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setTitle("");
      setDate(todayVenueDate());
      setCourtIds([...ALL_COURT_IDS]);
      setRange(null);
      setErrors({});
      setPending(false);
    }
    onOpenChange(next);
  };

  const submit = async () => {
    const nextErrors: OccupancyBlockFormErrors = {};
    const trimmed = title.trim();

    if (trimmed.length < 2) {
      nextErrors.title = "Unesite naziv događaja.";
    } else if (trimmed.length > OCCUPANCY_TITLE_MAX) {
      nextErrors.title = "Naziv je predugačak.";
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      nextErrors.date = "Izaberite datum.";
    }

    if (courtIds.length === 0) {
      nextErrors.courtIds = "Izaberite barem jedan teren.";
    }

    if (!isValidHourRange(range)) {
      nextErrors.range = "Izaberite vremenski opseg.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (!range) return;

    setPending(true);
    setErrors({});

    const result = await createOccupancyBlock({
      title: trimmed,
      date,
      startTime: minutesToTimeLabel(range.startMinutes),
      endTime: minutesToTimeLabel(range.endMinutes),
      courtIds,
    });

    setPending(false);

    if (!result.success) {
      setErrors({ form: result.error });
      return;
    }

    handleOpenChange(false);
    onCreated?.();
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto border-white/10 bg-slate-900 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Označi zauzeto</DialogTitle>
          <DialogDescription className="text-slate-400">
            Blokirajte termine za prvenstva i slične događaje. Ovi termini nisu
            gostujuće rezervacije i ne ulaze u statistiku.
          </DialogDescription>
        </DialogHeader>

        <OccupancyBlockForm
          title={title}
          date={date}
          courtIds={courtIds}
          range={range}
          errors={errors}
          onTitleChange={setTitle}
          onDateChange={setDate}
          onCourtIdsChange={setCourtIds}
          onRangeChange={setRange}
        />

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            onClick={() => handleOpenChange(false)}
            disabled={pending}
          >
            Otkaži
          </Button>
          <Button
            type="button"
            variant="accent"
            disabled={pending}
            onClick={() => void submit()}
          >
            {pending ? "Čuvanje…" : "Sačuvaj zauzetost"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OccupancyBlockModal;
