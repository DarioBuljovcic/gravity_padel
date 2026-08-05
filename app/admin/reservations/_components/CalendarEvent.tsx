import { ReservationEvent } from "@/lib/reservations/calendar-mapping";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const CalendarEvent = ({ event }: { event: ReservationEvent }) => {
  const isEvent = event.resource.kind === "event";

  return (
    <div className="calendar-event-content">
      <span className="calendar-event-name">
        {isEvent ? `◆ ${event.title}` : event.title}
      </span>
      <span className="calendar-event-initials">
        {isEvent ? "EV" : getInitials(event.title)}
      </span>
    </div>
  );
};

export default CalendarEvent;
