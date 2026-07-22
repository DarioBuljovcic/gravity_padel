import { z } from "zod";

export const VENUE_TIME_ZONE = "Europe/Belgrade";
export const CURRENCY = "RSD";

export const courts = [
  { id: 1, name: "Teren 1", description: "Panoramic WPT Standard" },
  { id: 2, name: "Teren 2", description: "Panoramic WPT Standard" },
  { id: 3, name: "Teren 3", description: "Panoramic WPT Standard" },
  { id: 4, name: "Teren 4", description: "Panoramic WPT Standard" },
] as const;

export const bookingPackages = [
  { id: "morning_60", durationMinutes: 60, priceAmount: 1800, rangeStart: "09:00", rangeEnd: "16:00", label: "1h", period: "Pre podne" },
  { id: "morning_90", durationMinutes: 90, priceAmount: 2700, rangeStart: "09:00", rangeEnd: "16:00", label: "1.5h", period: "Pre podne" },
  { id: "morning_120", durationMinutes: 120, priceAmount: 3300, rangeStart: "09:00", rangeEnd: "16:00", label: "2h", period: "Pre podne" },
  { id: "afternoon_60", durationMinutes: 60, priceAmount: 2400, rangeStart: "16:00", rangeEnd: "23:00", label: "1h", period: "Posle podne" },
  { id: "afternoon_90", durationMinutes: 90, priceAmount: 3600, rangeStart: "16:00", rangeEnd: "23:00", label: "1.5h", period: "Posle podne" },
  { id: "afternoon_120", durationMinutes: 120, priceAmount: 4400, rangeStart: "16:00", rangeEnd: "23:00", label: "2h", period: "Posle podne" },
] as const;

export type BookingPackage = (typeof bookingPackages)[number];
export type Court = (typeof courts)[number];
export type ReservationStatus = "active" | "cancelled";

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
  package_id: BookingPackage["id"];
  price_amount: number;
  price_currency: typeof CURRENCY;
  name: string;
  phone: string;
  email: string;
  status: ReservationStatus;
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
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

export function getVenueTimeMinutes(now = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: VENUE_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return Number(value.hour) * 60 + Number(value.minute);
}

export function isPastSlot(date: string, time: string, now = new Date()): boolean {
  const today = getVenueDate(0, now);
  if (date < today) return true;
  if (date > today) return false;
  return timeToMinutes(time) <= getVenueTimeMinutes(now);
}

export function generateTimeSlots(item: BookingPackage, date?: string): string[] {
  const start = timeToMinutes(item.rangeStart);
  const end = timeToMinutes(item.rangeEnd);
  const slots: string[] = [];

  for (let minutes = start; minutes + item.durationMinutes <= end; minutes += 30) {
    const time = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
    if (date && isPastSlot(date, time)) continue;
    slots.push(time);
  }
  return slots;
}
