import { z } from "zod";

export const VENUE_TIME_ZONE = "Europe/Belgrade";
export const CURRENCY = "RSD";

export const courts = [
  { id: 1, name: "Teren 1", description: "Panoramic WPT Standard" },
  { id: 2, name: "Teren 2", description: "Panoramic WPT Standard" },
  { id: 3, name: "Teren 3", description: "Panoramic WPT Standard (Sa krovom)" },
  { id: 4, name: "Teren 4", description: "Panoramic WPT Standard (Sa krovom)" },
] as const;

export const bookingPackages = [
  {
    id: "morning_60",
    durationMinutes: 60,
    priceAmount: 1800,
    rangeStart: "09:00",
    rangeEnd: "16:00",
    label: "1h",
    period: "Pre podne",
  },
  {
    id: "afternoon_60",
    durationMinutes: 60,
    priceAmount: 2400,
    rangeStart: "16:00",
    rangeEnd: "23:00",
    label: "1h",
    period: "Posle podne",
  },
  {
    id: "morning_90",
    durationMinutes: 90,
    priceAmount: 2700,
    rangeStart: "09:00",
    rangeEnd: "16:00",
    label: "1.5h",
    period: "Pre podne",
  },
  {
    id: "afternoon_90",
    durationMinutes: 90,
    priceAmount: 3600,
    rangeStart: "16:00",
    rangeEnd: "23:00",
    label: "1.5h",
    period: "Posle podne",
  },
  {
    id: "morning_120",
    durationMinutes: 120,
    priceAmount: 3300,
    rangeStart: "09:00",
    rangeEnd: "16:00",
    label: "2h",
    period: "Pre podne",
  },

  {
    id: "afternoon_120",
    durationMinutes: 120,
    priceAmount: 4400,
    rangeStart: "16:00",
    rangeEnd: "23:00",
    label: "2h",
    period: "Posle podne",
  },
] as const;

export type BookingPackage = (typeof bookingPackages)[number];
export type Court = (typeof courts)[number];
export type ReservationStatus = "active" | "cancelled";
export type ReservationKind = "booking" | "event";
export const EVENT_PACKAGE_ID = "event";

const packageIds = bookingPackages.map((item) => item.id) as [
  BookingPackage["id"],
  ...BookingPackage["id"][],
];

export const reservationInputSchema = z.object({
  packageId: z.enum(packageIds),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^(?:[01]\d|2[0-3]):(?:00|30)$/),
  courtId: z.number().int().min(1).max(4),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(30),
  email: z.email().max(254),
});

export type ReservationInput = z.infer<typeof reservationInputSchema>;

export type Reservation = {
  id: string;
  starts_at: string;
  ends_at: string;
  duration_minutes: number;
  court_id: number;
  package_id: BookingPackage["id"] | typeof EVENT_PACKAGE_ID;
  price_amount: number;
  price_currency: typeof CURRENCY;
  name: string;
  phone: string;
  email: string;
  status: ReservationStatus;
  kind: ReservationKind;
  event_group_id: string | null;
  user_id: string | null;
  created_at: string;
};

export type BusySlot = {
  starts_at: string;
  ends_at: string;
};

export function getPackage(packageId: string): BookingPackage | undefined {
  return bookingPackages.find((item) => item.id === packageId);
}

export function getCourt(courtId: number): Court | undefined {
  return courts.find((court) => court.id === courtId);
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("sr-RS").format(amount) + " RSD";
}

function timeToMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function getVenueDate(offsetDays = 0, now = new Date()): string {
  const date = new Date(now);
  date.setUTCDate(date.getUTCDate() + offsetDays);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: VENUE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  return `${value.year}-${value.month}-${value.day}`;
}

export function getVenueTimeMinutes(now = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: VENUE_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const value = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  return Number(value.hour) * 60 + Number(value.minute);
}

export function isPastSlot(
  date: string,
  time: string,
  now = new Date(),
): boolean {
  const today = getVenueDate(0, now);
  if (date < today) return true;
  if (date > today) return false;
  return timeToMinutes(time) <= getVenueTimeMinutes(now);
}

/** Players may cancel only when the slot starts more than `cutoffMinutes` from now. */
export function canPlayerCancel(
  startsAt: string,
  now = new Date(),
  cutoffMinutes = 60,
): boolean {
  return (
    new Date(startsAt).getTime() - now.getTime() > cutoffMinutes * 60 * 1000
  );
}

/** Convert a Europe/Belgrade local date+time to a UTC ISO string. */
export function venueLocalToUtcIso(date: string, time: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const asUtc = Date.UTC(year, month - 1, day, hour, minute, 0);

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: VENUE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(asUtc));
  const zoned = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  const asZonedUtc = Date.UTC(
    Number(zoned.year),
    Number(zoned.month) - 1,
    Number(zoned.day),
    Number(zoned.hour),
    Number(zoned.minute),
    Number(zoned.second),
  );
  const offsetMs = asZonedUtc - asUtc;
  return new Date(asUtc - offsetMs).toISOString();
}

export function venueDayBoundsUtc(date: string): {
  startIso: string;
  endIso: string;
} {
  const startIso = venueLocalToUtcIso(date, "00:00");
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + 1));
  const nextDate = `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-${String(next.getUTCDate()).padStart(2, "0")}`;
  return { startIso, endIso: venueLocalToUtcIso(nextDate, "00:00") };
}

export function generateTimeSlots(
  item: BookingPackage,
  date?: string,
): string[] {
  const start = timeToMinutes(item.rangeStart);
  const end = timeToMinutes(item.rangeEnd);
  const slots: string[] = [];

  for (
    let minutes = start;
    minutes + item.durationMinutes <= end;
    minutes += 30
  ) {
    const time = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
    if (date && isPastSlot(date, time)) continue;
    slots.push(time);
  }
  return slots;
}
