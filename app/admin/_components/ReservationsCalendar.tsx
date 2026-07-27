"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import {
  dateFnsLocalizer,
  type View,
} from "react-big-calendar";
import {
  format,
  getDay,
  parse,
  startOfWeek,
} from "date-fns";
import { srLatn } from "date-fns/locale";
import ShadcnBigCalendar from "@/components/shadcn-big-calendar/shadcn-big-calendar";
import { Button } from "@/components/ui/button";
import { CLOSING_HOUR, OPENING_HOUR } from "@/lib/constants";
import type { ReservationFilters } from "@/lib/actions/reservation.actions";
import { courts } from "@/lib/reservations/domain";
import ReservationEventDialog from "./ReservationEventDialog";
import {
  courtEventClassName,
  courtLegendColor,
  fetchReservationsCached,
  getCachedReservations,
  getDefaultWeekRange,
  getRangeForView,
  markReservationCancelledInCache,
  nowInVenue,
  prefetchAdjacentRanges,
  reservationsToEvents,
  seedReservationCache,
  type CalendarReservation,
  type ReservationEvent,
} from "./reservation-calendar-utils";

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

const calendarFormats = {
  timeGutterFormat: "HH:mm",
  eventTimeRangeFormat: (
    { start, end }: { start: Date; end: Date },
    culture?: string,
    loc?: { format: (value: Date, format: string, culture?: string) => string },
  ) =>
    `${loc?.format(start, "HH:mm", culture)} – ${loc?.format(end, "HH:mm", culture)}`,
  agendaTimeRangeFormat: (
    { start, end }: { start: Date; end: Date },
    culture?: string,
    loc?: { format: (value: Date, format: string, culture?: string) => string },
  ) =>
    `${loc?.format(start, "HH:mm", culture)} – ${loc?.format(end, "HH:mm", culture)}`,
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

type Props = {
  initialReservations: CalendarReservation[];
  filters: Pick<ReservationFilters, "courtId" | "name">;
};

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

export default function ReservationsCalendar({
  initialReservations,
  filters,
}: Props) {
  const isMobile = useIsMobile();
  const mobile = isMobile === true;
  const [date, setDate] = useState(() => nowInVenue());
  const [viewOverride, setViewOverride] = useState<View | null>(null);
  const [reservations, setReservations] =
    useState<CalendarReservation[]>(initialReservations);
  const [selected, setSelected] = useState<CalendarReservation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showCancelled, setShowCancelled] = useState(false);
  const [isPending, startTransition] = useTransition();

  const requestedView = viewOverride ?? (mobile ? "day" : "week");
  const view: View =
    mobile &&
    (requestedView === "week" ||
      requestedView === "month" ||
      requestedView === "work_week")
      ? "day"
      : requestedView;

  // Seed cache with SSR data for the default week.
  useEffect(() => {
    seedReservationCache(filters, getDefaultWeekRange(), initialReservations);
    prefetchAdjacentRanges(filters, nowInVenue(), "week");
  }, [filters, initialReservations]);

  const events = useMemo(() => {
    const visible = showCancelled
      ? reservations
      : reservations.filter((item) => item.status === "active");
    return reservationsToEvents(visible);
  }, [reservations, showCancelled]);

  const loadRange = useCallback(
    (nextDate: Date, nextView: View) => {
      const range = getRangeForView(nextDate, nextView);
      const cached = getCachedReservations(filters, range);
      if (cached) {
        setReservations(cached);
        prefetchAdjacentRanges(filters, nextDate, nextView);
        return;
      }

      startTransition(async () => {
        const data = await fetchReservationsCached(filters, range);
        setReservations(data);
        prefetchAdjacentRanges(filters, nextDate, nextView);
      });
    },
    [filters],
  );

  function handleNavigate(nextDate: Date) {
    setDate(nextDate);
    loadRange(nextDate, view);
  }

  function handleViewChange(nextView: View) {
    const safeView =
      mobile && (nextView === "week" || nextView === "month")
        ? "day"
        : nextView;
    setViewOverride(safeView);
    loadRange(date, safeView);
  }

  const handleSelectEvent = useCallback((event: ReservationEvent) => {
    setSelected(event.resource);
    setDialogOpen(true);
  }, []);

  const eventPropGetter = useCallback(
    (event: ReservationEvent) => ({
      className: courtEventClassName(
        event.resource.court_id,
        event.resource.status,
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
              {court.name}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {isPending && (
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
          views={mobile ? MOBILE_VIEWS : DESKTOP_VIEWS}
          messages={messages}
          style={{ height: "min(70dvh, 640px)" }}
          min={calendarMin}
          max={calendarMax}
          scrollToTime={calendarScrollTo}
          step={30}
          timeslots={2}
          popup
          selectable={false}
          eventPropGetter={eventPropGetter}
          formats={calendarFormats}
        />
      </div>

      <ReservationEventDialog
        reservation={selected}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCancelled={(id) => {
          markReservationCancelledInCache(id);
          setReservations((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, status: "cancelled" } : item,
            ),
          );
          setSelected((prev) =>
            prev?.id === id ? { ...prev, status: "cancelled" } : prev,
          );
        }}
      />
    </div>
  );
}
