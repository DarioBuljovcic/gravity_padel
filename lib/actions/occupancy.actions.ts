"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { OPENING_HOUR, CLOSING_HOUR } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { courts } from "@/lib/reservations/domain";

const courtIds = courts.map((court) => court.id) as [number, ...number[]];

const occupancyBlockInputSchema = z.object({
  title: z.string().trim().min(2).max(120),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^(?:[01]\d|2[0-3]):(?:00|30)$/),
  endTime: z.string().regex(/^(?:[01]\d|2[0-3]):(?:00|30)$/),
  courtIds: z.array(z.number().int().refine((id) => courtIds.includes(id))).min(1),
});

export type OccupancyBlockInput = z.infer<typeof occupancyBlockInputSchema>;

export type OccupancyActionResult =
  | { success: true; eventGroupId: string }
  | {
      success: false;
      type: "validation" | "conflict" | "system";
      error: string;
    };

function timeToMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export async function createOccupancyBlock(
  input: OccupancyBlockInput,
): Promise<OccupancyActionResult> {
  await requireAdmin();

  const parsed = occupancyBlockInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      type: "validation",
      error: "Proverite unete podatke.",
    };
  }

  const { title, date, startTime, endTime, courtIds: selectedCourts } =
    parsed.data;
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const openingMinutes = OPENING_HOUR * 60;
  const closingMinutes = CLOSING_HOUR * 60;
  const duration = endMinutes - startMinutes;

  if (
    startMinutes < openingMinutes ||
    endMinutes > closingMinutes ||
    duration < 30 ||
    duration % 30 !== 0
  ) {
    return {
      success: false,
      type: "validation",
      error: "Izaberite validan vremenski opseg unutar radnog vremena.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_occupancy_block", {
    p_title: title,
    p_local_date: date,
    p_start_time: startTime,
    p_end_time: endTime,
    p_court_ids: [...new Set(selectedCourts)],
  });

  if (error) {
    console.error("Error creating occupancy block:", error);
    if (error.code === "23P01") {
      return {
        success: false,
        type: "conflict",
        error: "Izabrani termini se preklapaju sa postojećom rezervacijom.",
      };
    }
    if (error.code === "22023") {
      return {
        success: false,
        type: "validation",
        error: "Proverite unete podatke.",
      };
    }
    return {
      success: false,
      type: "system",
      error: "Događaj nije moguće sačuvati.",
    };
  }

  revalidatePath("/admin");
  return { success: true, eventGroupId: data };
}

export async function cancelOccupancyBlock(
  eventGroupId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdmin();

  if (!eventGroupId) {
    return { success: false, error: "Događaj nije pronađen." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("cancel_occupancy_block", {
    p_event_group_id: eventGroupId,
  });

  if (error) {
    console.error("Error cancelling occupancy block:", error);
    return { success: false, error: "Događaj nije moguće otkazati." };
  }

  revalidatePath("/admin");
  return { success: true };
}
