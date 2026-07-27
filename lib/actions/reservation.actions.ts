"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, requireUser } from "@/lib/auth";
import { notifyAdminNewBooking } from "@/lib/mail/notify";
import {
  isPastSlot,
  reservationInputSchema,
  venueDayBoundsUtc,
  venueLocalToUtcIso,
  type BusySlot,
  type ReservationInput,
} from "@/lib/reservations/domain";
import { createClient } from "@/lib/supabase/server";

export type ReservationFilters = {
  courtId?: number;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  timeFrom?: string;
  timeTo?: string;
  name?: string;
  /** When true, only active reservations are returned. */
  activeOnly?: boolean;
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

function normalizeTime(value: string): string {
  return value.slice(0, 5);
}

function escapeIlike(value: string): string {
  return value.replace(/[%_\\]/g, "\\$&");
}

export type ReservationActionResult =
  | { success: true; reservationId: string }
  | {
      success: false;
      type: "validation" | "conflict" | "system";
      error: string;
    };

export async function createReservation(
  input: ReservationInput,
): Promise<ReservationActionResult> {
  const parsed = reservationInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      type: "validation",
      error: "Proverite unete podatke.",
    };
  }

  if (isPastSlot(parsed.data.date, parsed.data.time)) {
    return {
      success: false,
      type: "validation",
      error: "Izabrani termin je već prošao. Izaberite kasnije vreme.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_reservation", {
    p_package_id: parsed.data.packageId,
    p_local_date: parsed.data.date,
    p_local_time: parsed.data.time,
    p_court_id: parsed.data.courtId,
    p_name: parsed.data.name,
    p_phone: parsed.data.phone,
    p_email: parsed.data.email,
  });
  if (error) {
    console.error("Error creating reservation:", error);
    if (error.code === "23P01") {
      return {
        success: false,
        type: "conflict",
        error: "Termin je upravo rezervisan. Izaberite drugi termin.",
      };
    }
    return {
      success: false,
      type: "system",
      error: "Rezervacija nije sačuvana.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/account");

  // Fire-and-forget; booking already committed — never fail the reservation on mail errors.
  void notifyAdminNewBooking({
    ...parsed.data,
    reservationId: data,
  }).catch((err) => console.error("admin booking email failed", err));

  return { success: true, reservationId: data };
}

export async function getReservations(filters: ReservationFilters = {}) {
  await requireAdmin();
  const supabase = await createClient();

  const dateFrom =
    filters.dateFrom && DATE_RE.test(filters.dateFrom)
      ? filters.dateFrom
      : undefined;
  const dateTo =
    filters.dateTo && DATE_RE.test(filters.dateTo)
      ? filters.dateTo
      : undefined;
  const hasRange = Boolean(dateFrom || dateTo);

  let query = supabase
    .from("reservations")
    .select(
      "id,starts_at,ends_at,duration_minutes,court_id,package_id,price_amount,price_currency,name,phone,email,status,user_id,created_at",
    )
    .order("starts_at", { ascending: hasRange });

  if (
    typeof filters.courtId === "number" &&
    Number.isInteger(filters.courtId) &&
    filters.courtId >= 1 &&
    filters.courtId <= 4
  ) {
    query = query.eq("court_id", filters.courtId);
  }

  if (filters.activeOnly) {
    query = query.eq("status", "active");
  }

  const date =
    !hasRange && filters.date && DATE_RE.test(filters.date)
      ? filters.date
      : undefined;
  const timeFrom =
    date && filters.timeFrom && TIME_RE.test(filters.timeFrom)
      ? normalizeTime(filters.timeFrom)
      : undefined;
  const timeTo =
    date && filters.timeTo && TIME_RE.test(filters.timeTo)
      ? normalizeTime(filters.timeTo)
      : undefined;

  if (hasRange) {
    const from = dateFrom ?? dateTo!;
    const to = dateTo ?? dateFrom!;
    const lower = venueDayBoundsUtc(from <= to ? from : to).startIso;
    const upper = venueDayBoundsUtc(from <= to ? to : from).endIso;
    query = query.gte("starts_at", lower).lt("starts_at", upper);
  } else if (date) {
    const { startIso, endIso } = venueDayBoundsUtc(date);
    const lower = timeFrom ? venueLocalToUtcIso(date, timeFrom) : startIso;
    const upper = timeTo ? venueLocalToUtcIso(date, timeTo) : endIso;
    query = query.gte("starts_at", lower);
    query = timeTo
      ? query.lte("starts_at", upper)
      : query.lt("starts_at", upper);
  }

  const name = filters.name?.trim();
  if (name) {
    query = query.ilike("name", `%${escapeIlike(name)}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Unable to load reservations.");
  }

  return data ?? [];
}

export async function cancelReservation(id: string) {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.rpc("cancel_own_reservation", {
    p_reservation_id: id,
  });

  if (error) {
    console.error("Error cancelling reservation:", error);
    return { success: false, error: "Rezervaciju nije moguće otkazati." };
  }

  revalidatePath("/admin");
  revalidatePath("/account");
  return { success: true };
}

export async function getBusySlots(
  date: string,
  courtId: number,
): Promise<BusySlot[]> {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isInteger(courtId) ||
    courtId < 1 ||
    courtId > 4
  ) {
    return [];
  }
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_busy_slots", {
    p_local_date: date,
    p_court_id: courtId,
  });
  if (error) {
    console.error("Error loading availability:", error);
    return [];
  }
  return data ?? [];
}
