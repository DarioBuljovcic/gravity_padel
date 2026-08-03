"use server";

import { revalidatePath } from "next/cache";
import { isAdmin, requireAdmin, requireUser } from "@/lib/auth";
import {
  notifyAdminCancelledBooking,
  notifyAdminNewBooking,
  notifyPlayerCancelledBooking,
} from "@/lib/mail/notify";
import type { MailReservationDetails } from "@/lib/mail/templates";
import {
  canPlayerCancel,
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

function toMailDetails(reservation: {
  id: string;
  starts_at: string;
  duration_minutes: number;
  court_id: number;
  package_id: string;
  price_amount: number;
  name: string;
  phone: string;
  email: string;
}): MailReservationDetails {
  return {
    reservationId: reservation.id,
    name: reservation.name,
    phone: reservation.phone,
    email: reservation.email,
    courtId: reservation.court_id,
    packageId: reservation.package_id,
    date: "",
    time: "",
    durationMinutes: reservation.duration_minutes,
    priceAmount: reservation.price_amount,
    startsAt: reservation.starts_at,
  };
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
    filters.dateTo && DATE_RE.test(filters.dateTo) ? filters.dateTo : undefined;
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
  const user = await requireUser();
  const admin = await isAdmin(user.id);
  const supabase = await createClient();

  const { data: reservation, error: fetchError } = await supabase
    .from("reservations")
    .select(
      "id,starts_at,duration_minutes,court_id,package_id,price_amount,name,phone,email,status",
    )
    .eq("id", id)
    .eq("status", "active")
    .maybeSingle();

  if (fetchError || !reservation) {
    console.error("Error loading reservation for cancel:", fetchError);
    return { success: false, error: "Rezervaciju nije moguće otkazati." };
  }

  if (!admin && !canPlayerCancel(reservation.starts_at)) {
    return {
      success: false,
      error: "Rezervaciju nije moguće otkazati manje od 1 sat pre termina.",
    };
  }

  const { error } = await supabase.rpc("cancel_own_reservation", {
    p_reservation_id: id,
  });

  if (error) {
    console.error("Error cancelling reservation:", error);
    if (error.code === "P0001") {
      return {
        success: false,
        error: "Rezervaciju nije moguće otkazati manje od 1 sat pre termina.",
      };
    }
    return { success: false, error: "Rezervaciju nije moguće otkazati." };
  }

  revalidatePath("/admin");
  revalidatePath("/account");

  const details = toMailDetails(reservation);
  if (admin) {
    void notifyPlayerCancelledBooking(details).catch((err) =>
      console.error("player cancellation email failed", err),
    );
  } else {
    void notifyAdminCancelledBooking(details).catch((err) =>
      console.error("admin cancellation email failed", err),
    );
  }

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

export async function getAccountReservationHistory(
  offset = 0,
  limit = 5,
): Promise<{
  reservations: {
    id: string;
    starts_at: string;
    court_id: number;
    package_id: string;
    duration_minutes: number;
    price_amount: number;
    status: "active" | "cancelled";
  }[];
  hasMore: boolean;
}> {
  const user = await requireUser();
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("reservations")
    .select("id,starts_at,court_id,package_id,duration_minutes,price_amount,status")
    .eq("user_id", user.id)
    .or(`status.eq.cancelled,starts_at.lt."${nowIso}"`)
    .order("starts_at", { ascending: false })
    .range(offset, offset + limit);

  if (error) throw new Error("Unable to load booking history.");

  const rows = data ?? [];
  return {
    reservations: rows.slice(0, limit),
    hasMore: rows.length > limit,
  };
}
