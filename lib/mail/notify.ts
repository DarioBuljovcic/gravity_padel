import "server-only";

import {
  newBookingAdminHtml,
  newBookingAdminSubject,
  reminderPlayerHtml,
  reminderPlayerSubject,
  type MailReservationDetails,
} from "@/lib/mail/templates";
import { getAdminNotifyEmail, sendMail } from "@/lib/mailer";

export async function notifyAdminNewBooking(
  details: MailReservationDetails,
): Promise<void> {
  const to = getAdminNotifyEmail();
  if (!to) {
    console.error(
      "Skipping admin booking email: ADMIN_NOTIFY_EMAIL is not set.",
    );
    return;
  }

  const result = await sendMail({
    to,
    subject: newBookingAdminSubject(details),
    html: newBookingAdminHtml(details),
  });

  if (!result.ok) {
    console.error("admin booking email failed:", result.error);
  }
}

export async function sendPlayerReminder(
  details: MailReservationDetails,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const to = details.email.trim();
  if (!to) {
    return { ok: false, error: "Reservation has no email." };
  }

  return sendMail({
    to,
    subject: reminderPlayerSubject(details),
    html: reminderPlayerHtml(details),
  });
}
