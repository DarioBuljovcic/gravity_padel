import { sendPlayerReminder } from "@/lib/mail/notify";
import {
  getVenueDate,
  venueDayBoundsUtc,
} from "@/lib/reservations/domain";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Vercel Cron: 0 7 * * * (07:00 UTC).
 * Europe/Belgrade is UTC+1 (winter) or UTC+2 (summer) → local 08:00 / 09:00.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tomorrow = getVenueDate(1);
  const { startIso, endIso } = venueDayBoundsUtc(tomorrow);

  const { data: reservations, error } = await supabaseAdmin
    .from("reservations")
    .select(
      "id,starts_at,duration_minutes,court_id,package_id,price_amount,name,phone,email,reminder_sent",
    )
    .eq("status", "active")
    .eq("reminder_sent", false)
    .gte("starts_at", startIso)
    .lt("starts_at", endIso);

  if (error) {
    console.error("cron reminders query failed:", error);
    return Response.json({ error: "Query failed" }, { status: 500 });
  }

  let sent = 0;
  let failed = 0;
  const skipped = 0;

  for (const reservation of reservations ?? []) {
    const result = await sendPlayerReminder({
      reservationId: reservation.id,
      name: reservation.name,
      phone: reservation.phone,
      email: reservation.email,
      courtId: reservation.court_id,
      packageId: reservation.package_id,
      date: tomorrow,
      time: "",
      durationMinutes: reservation.duration_minutes,
      priceAmount: reservation.price_amount,
      startsAt: reservation.starts_at,
    });

    if (!result.ok) {
      failed += 1;
      console.error("reminder send failed", reservation.id, result.error);
      continue;
    }

    const { error: updateError } = await supabaseAdmin
      .from("reservations")
      .update({ reminder_sent: true })
      .eq("id", reservation.id);

    if (updateError) {
      failed += 1;
      console.error(
        "reminder_sent update failed after send",
        reservation.id,
        updateError,
      );
      continue;
    }

    sent += 1;
  }

  return Response.json({
    date: tomorrow,
    sent,
    failed,
    skipped,
    total: reservations?.length ?? 0,
  });
}
