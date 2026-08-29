"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { dateFnsLocalizer, type View } from "react-big-calendar";
import { addDays, format, getDay, parse, startOfWeek, subDays } from "date-fns";
import { srLatn } from "date-fns/locale";
import ShadcnBigCalendar from "@/components/shadcn-big-calendar/shadcn-big-calendar";
import { Button } from "@/components/ui/button";
import { CLOSING_HOUR, OPENING_HOUR } from "@/lib/constants";
import {
  getReservations,
  type ReservationFilters,
} from "@/lib/actions/reservation.actions";
import {
  courtEventClassName,
  courtLegendColor,
  reservationsToEvents,
  type CalendarReservation,
  type ReservationEvent,
} from "@/lib/reservations/calendar-mapping";
import {
  getDefaultWeekRange,
  getRangeForView,
  nowInVenue,
} from "@/lib/reservations/date-ranges";
import type { LabeledCourt } from "@/lib/courts";
import {
  reservationsRangeKey,
  useReservationsRange,
} from "@/lib/reservations/use-reservations-range";
import ReservationEventDialog from "./ReservationEventDialog";
import CalendarEvent from "./CalendarEvent";
import CalendarToolbar from "./CalendarToolbar";
import OccupancyBlockModal, {
  slotInfoToOccupancyDraft,
  type OccupancyBlockDraft,
} from "./occupancy-block-modal";

const locales = { "sr-Latn": srLatn };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

const messages = {
  next: "Sledeće",
  previous: "Prethodno",
  today: "Danas",
  month: "Mesec",
  week: "Nedelja",
  day: "Dan",
  agenda: "Agenda",
  date: "Datum",
  time: "Vreme",
  event: "Rezervacija",
  noEventsInRange: "Nema rezervacija u ovom periodu.",
  showMore: (total: number) => `+${total} više`,
};

const timeRangeFormat = (
  { start, end }: { start: Date; end: Date },
  culture?: string,
  loc?: { format: (value: Date, format: string, culture?: string) => string },
) =>
  `${loc?.format(start, "HH:mm", culture)} – ${loc?.format(end, "HH:mm", culture)}`;

const calendarFormats = {
  timeGutterFormat: "HH:mm",
  eventTimeRangeFormat: timeRangeFormat,
  agendaTimeRangeFormat: timeRangeFormat,
};

const DESKTOP_VIEWS: View[] = ["month", "week", "day", "agenda"];
const MOBILE_VIEWS: View[] = ["day", "agenda"];

const calendarMin = (() => {
  const d = new Date();
  d.setHours(OPENING_HOUR, 0, 0, 0);
  return d;
})();

const calendarMax = (() => {
  const d = new Date();
  d.setHours(CLOSING_HOUR, 0, 0, 0);
  return d;
})();

const calendarScrollTo = (() => {
  const d = new Date();
  d.setHours(OPENING_HOUR, 0, 0, 0);
  return d;
})();

function getSafeView(view: View, mobile: boolean): View {
  if (!mobile) return view;
  return view === "week" || view === "month" || view === "work_week"
    ? "day"
    : view;
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

function prefetchAdjacentRanges(
  queryClient: QueryClient,
  filters: Pick<ReservationFilters, "courtId" | "name">,
  date: Date,
  view: View,
) {
  if (view === "month") return;

  const daySpan = view === "agenda" ? 30 : view === "day" ? 1 : 7;
  const prev = getRangeForView(subDays(date, daySpan), view);
  const next = getRangeForView(addDays(date, daySpan), view);

  for (const range of [prev, next]) {
    void queryClient.prefetchQuery({
      queryKey: reservationsRangeKey(filters, range),
      queryFn: () => getReservations({ ...filters, ...range }),
      staleTime: 60_000,
    });
  }
}

type Props = {
  initialReservations: CalendarReservation[];
  filters: Pick<ReservationFilters, "courtId" | "name">;
  courts: LabeledCourt[];
};

export default function ReservationsCalendar({
  initialReservations,
  filters,
  courts,
}: Props) {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const mobile = isMobile === true;
  const [date, setDate] = useState(() => nowInVenue());
  const [viewOverride, setViewOverride] = useState<View | null>(null);
  const [selected, setSelected] = useState<CalendarReservation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showCancelled, setShowCancelled] = useState(false);
  const [occupancyOpen, setOccupancyOpen] = useState(false);
  const [occupancyDraft, setOccupancyDraft] =
    useState<OccupancyBlockDraft | null>(null);

  const requestedView = viewOverride ?? (mobile ? "day" : "week");
  const view = getSafeView(requestedView, mobile);
  const range = getRangeForView(date, view);
  const defaultWeek = getDefaultWeekRange();
  const isDefaultWeek =
    range.dateFrom === defaultWeek.dateFrom &&
    range.dateTo === defaultWeek.dateTo;

  const { data: reservations = [], isFetching } = useReservationsRange(
    filters,
    range,
    { initialData: isDefaultWeek ? initialReservations : undefined },
  );

  useEffect(() => {
    prefetchAdjacentRanges(queryClient, filters, date, view);
  }, [queryClient, filters, date, view]);

  const events = useMemo(() => {
    const visible = showCancelled
      ? reservations
      : reservations.filter((item) => item.status === "active");
    return reservationsToEvents(visible);
  }, [reservations, showCancelled]);

  function handleNavigate(nextDate: Date) {
    setDate(nextDate);
  }

  function handleViewChange(nextView: View) {
    setViewOverride(getSafeView(nextView, mobile));
  }

  const handleSelectEvent = useCallback((event: ReservationEvent) => {
    setSelected(event.resource);
    setDialogOpen(true);
  }, []);

  const canSelectSlots = view === "week" || view === "day";

  const handleSelectSlot = useCallback(
    (slot: { start: Date; end: Date; action?: "select" | "click" | "doubleClick" }) => {
      if (!canSelectSlots) return;
      const draft = slotInfoToOccupancyDraft(slot, filters.courtId);
      if (!draft) return;
      setOccupancyDraft(draft);
      setOccupancyOpen(true);
    },
    [canSelectSlots, filters.courtId],
  );

  const eventPropGetter = useCallback(
    (event: ReservationEvent) => ({
      className: courtEventClassName(
        event.resource.court_id,
        event.resource.status,
        event.resource.kind,
      ),
    }),
    [],
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
          {courts.map((court) => (
            <span key={court.id} className="inline-flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-sm"
                style={{ backgroundColor: courtLegendColor(court.id) }}
              />
              {court.displayName}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-amber-500/80" />
            Događaj / zauzeto
          </span>
          {canSelectSlots && (
            <span className="text-slate-500">
              Prevucite prazan termin da označite zauzeto
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isFetching && (
            <span className="text-xs text-slate-500">Učitavanje…</span>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCancelled((value) => !value)}
            className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            {showCancelled ? "Sakrij otkazane" : "Prikaži otkazane"}
          </Button>
        </div>
      </div>

      <div className="admin-reservations-calendar rounded-2xl border border-white/10 bg-slate-900/50 p-3 md:p-4">
        <ShadcnBigCalendar
          culture="sr-Latn"
          localizer={localizer}
          events={events}
          date={date}
          view={view}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          views={mobile ? MOBILE_VIEWS : DESKTOP_VIEWS}
          messages={messages}
          style={{ height: "min(70dvh, 640px)" }}
          min={calendarMin}
          max={calendarMax}
          scrollToTime={calendarScrollTo}
          step={30}
          timeslots={2}
          popup
          selectable={canSelectSlots}
          eventPropGetter={eventPropGetter}
          dayLayoutAlgorithm="no-overlap"
          formats={calendarFormats}
          components={{
            event: CalendarEvent,
            toolbar: CalendarToolbar,
          }}
        />
      </div>

      <OccupancyBlockModal
        open={occupancyOpen}
        onOpenChange={(next) => {
          setOccupancyOpen(next);
          if (!next) setOccupancyDraft(null);
        }}
        draft={occupancyDraft}
        courts={courts}
        onCreated={() => {
          void queryClient.invalidateQueries({ queryKey: ["reservations"] });
        }}
      />

      <ReservationEventDialog
        reservation={selected}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        courts={courts}
        onCancelled={(id) => {
          void queryClient.invalidateQueries({ queryKey: ["reservations"] });
          setSelected((prev) =>
            prev?.id === id ? { ...prev, status: "cancelled" } : prev,
          );
        }}
      />
    </div>
  );
}
