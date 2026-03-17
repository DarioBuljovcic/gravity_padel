"use server";
import { supabase } from "./db";
import { OPENING_HOUR, CLOSING_HOUR, MIN_SLOT_MINUTES } from "./constants";

export async function getBookedSlots(date: string, terrainId: number) {
  const { data, error } = await supabase
    .from("reservations")
    .select("start_time, end_time")
    .eq("date", date)
    .eq("terrain_id", terrainId)
    .neq("status", "cancelled");

  if (error) {
    console.error("Error fetching booked slots:", error);
    return [];
  }

  return data || [];
}

function terrainHasFreeSlot(booked: { start: number; end: number }[]): boolean {
  const sorted = [...booked].sort((a, b) => a.start - b.start);
  let lastEnd = OPENING_HOUR * 60;
  const dayEnd = CLOSING_HOUR * 60;

  for (const slot of sorted) {
    if (slot.start - lastEnd >= MIN_SLOT_MINUTES) return true; // gap before this booking
    lastEnd = Math.max(lastEnd, slot.end);
  }

  return dayEnd - lastEnd >= MIN_SLOT_MINUTES; // gap after last booking
}

export async function getTerrainAvailability(date: string) {
  console.log("Fetching availability for date:", date);
  const { data, error } = await supabase
    .from("reservations")
    .select("terrain_id, start_time, end_time")
    .eq("date", date)
    .neq("status", "cancelled");

  if (error) {
    console.error("Error fetching terrain availability:", error);
    return [];
  }

  const terrains = [1, 2, 3, 4];
  const availability = terrains.map((id) => {
    const bookedForTerrain = data?.filter((r) => r.terrain_id === id) || [];
    
    const bookedMinutes = bookedForTerrain.map(r => {
      const [sh, sm] = r.start_time.split(':').map(Number);
      const [eh, em] = r.end_time.split(':').map(Number);
      return { start: sh * 60 + sm, end: eh * 60 + em };
    });

    return { terrain_id: id, hasAnyFreeSlot: terrainHasFreeSlot(bookedMinutes) };
  });

  return availability;
}

export async function getReservations() {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Fetch error:", error);
    return [];
  }

  return data || [];
}
