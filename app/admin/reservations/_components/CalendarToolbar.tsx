"use client";

import type { ToolbarProps, View } from "react-big-calendar";
import type { ReservationEvent } from "@/lib/reservations/calendar-mapping";

export default function CalendarToolbar({
  label,
  localizer: { messages },
  onNavigate,
  onView,
  view,
  views,
}: ToolbarProps<ReservationEvent>) {
  const viewNames = (Array.isArray(views) ? views : []) as View[];

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate("PREV")}>
          {messages.previous}
        </button>
        <button type="button" onClick={() => onNavigate("TODAY")}>
          {messages.today}
        </button>
        <button type="button" onClick={() => onNavigate("NEXT")}>
          {messages.next}
        </button>
      </span>
      <span className="rbc-toolbar-label">{label}</span>
      {viewNames.length > 1 && (
        <span className="rbc-btn-group">
          {viewNames.map((name) => (
            <button
              type="button"
              key={name}
              className={view === name ? "rbc-active" : undefined}
              onClick={() => onView(name)}
            >
              {messages[name]}
            </button>
          ))}
        </span>
      )}
    </div>
  );
}
