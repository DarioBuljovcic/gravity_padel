"use server";

import { supabase } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import type { ReservationActionState } from "@/app/rezervacija/_components/types";

export async function createReservationAction(
  prevState: ReservationActionState,
  formData: FormData
): Promise<ReservationActionState> {
  void prevState;
  const terrain_id = parseInt(formData.get("terrain_id") as string);
  const date = formData.get("date") as string;
  const start_time = formData.get("start_time") as string;
  const duration = parseFloat(formData.get("duration") as string);
  const price = formData.get("price") as string;
  const package_type = formData.get("package_type") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;

  // Normalize start_time to HH:MM:00
  const start_time_normalized = start_time.length === 5 ? `${start_time}:00` : start_time;

  // Calculate end_time
  const [h, m] = start_time_normalized.split(":").map(Number);
  const totalMinutes = h * 60 + m + duration * 60;
  const end_h = Math.floor(totalMinutes / 60);
  const end_m = totalMinutes % 60;
  const end_time = `${end_h.toString().padStart(2, "0")}:${end_m.toString().padStart(2, "0")}:00`;

  // 1. Logical conflict check (Race condition safety)
  // Chained filters are AND by default in Supabase client
  const { data: conflicts, error: conflictError } = await supabase
    .from("reservations")
    .select("id")
    .eq("terrain_id", terrain_id)
    .eq("date", date)
    .neq("status", "cancelled")
    .lt("start_time", end_time)
    .gt("end_time", start_time_normalized)
    .limit(1);

  if (conflictError) {
    console.error("Conflict check error:", conflictError);
    return { error: "Greška prilikom provere dostupnosti." };
  }

  if (conflicts && conflicts.length > 0) {
    return { error: "Ovaj termin je upravo zauzet. Molimo izaberite drugi." };
  }

  // 2. Insert into database
  const { error: insertError } = await supabase.from("reservations").insert({
    terrain_id,
    date,
    start_time: start_time_normalized,
    end_time,
    duration,
    price,
    package_type,
    name,
    phone,
    email,
    status: "confirmed",
  });

  if (insertError) {
    // Check for Postgres exclusion constraint error (23P01)
    if (insertError.code === "23P01") {
      return { error: "Ovaj termin je upravo zauzet. Molimo izaberite drugi." };
    }
    console.error("Insert error:", insertError);
    return { error: "Došlo je do greške prilikom rezervacije." };
  }

  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function cancelReservationAction(id: string) {
  await requireAuth();

  const { error } = await supabase
    .from("reservations")
    .update({ status: "cancelled" })
    .eq("id", id);

  if (error) {
    console.error("Cancel error:", error);
    return { error: "Greška prilikom otkazivanja rezervacije." };
  }

  revalidatePath("/admin/dashboard");
  return { success: true };
}
