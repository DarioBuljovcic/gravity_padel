import { ReservationEvent } from '@/lib/reservations/calendar-mapping';
import React from 'react'

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
    return (
        <div className="calendar-event-content">
            <span className="calendar-event-name">{event.title}</span>
            <span className="calendar-event-initials">
                {getInitials(event.title)}
            </span>
        </div>
    );
}

export default CalendarEvent