import "server-only";

import {
  cancelledBookingAdminHtml,
  cancelledBookingAdminSubject,
  cancelledBookingPlayerHtml,
  cancelledBookingPlayerSubject,
  newBookingAdminHtml,
  newBookingAdminSubject,
  newBookingPlayerHtml,
  newBookingPlayerSubject,
  passwordResetHtml,
  passwordResetSubject,
  reminderPlayerHtml,
  reminderPlayerSubject,
  type MailReservationDetails,
} from "@/lib/mail/templates";
import { getAdminNotifyEmail, sendMail } from "@/lib/mailer";
import {
  formatCourtDisplayName,
  getCourt,
  serbianCourtLabel,
} from "@/lib/courts";

async function withCourtName(
  details: MailReservationDetails,
): Promise<MailReservationDetails> {
  const court = await getCourt(details.courtId);
  return {
    ...details,
    courtName: formatCourtDisplayName(
      court?.name ?? null,
      serbianCourtLabel(details.courtId),
    ),
  };
}

export async function notifyAdminNewBooking(
  details: MailReservationDetails,
): Promise<void> {
  const resolved = await withCourtName(details);
  const to = getAdminNotifyEmail();
  if (!to) {
    console.error(
      "Skipping admin booking email: ADMIN_NOTIFY_EMAIL is not set.",
    );
    return;
  }

  const result = await sendMail({
    to,
    subject: newBookingAdminSubject(resolved),
    html: newBookingAdminHtml(resolved),
  });

  if (!result.ok) {
    console.error("admin booking email failed:", result.error);
  }
}

export async function notifyPlayerNewBooking(
  details: MailReservationDetails,
): Promise<void> {
  const resolved = await withCourtName(details);
  const to = resolved.email.trim();
  if (!to) {
    console.error("Skipping player booking email: reservation has no email.");
    return;
  }

  const result = await sendMail({
    to,
    subject: newBookingPlayerSubject(resolved),
    html: newBookingPlayerHtml(resolved),
  });

  if (!result.ok) {
    console.error("player booking email failed:", result.error);
  }
}

export async function notifyAdminCancelledBooking(
  details: MailReservationDetails,
): Promise<void> {
  const resolved = await withCourtName(details);
  const to = getAdminNotifyEmail();
  if (!to) {
    console.error(
      "Skipping admin cancellation email: ADMIN_NOTIFY_EMAIL is not set.",
    );
    return;
  }

  const result = await sendMail({
    to,
    subject: cancelledBookingAdminSubject(resolved),
    html: cancelledBookingAdminHtml(resolved),
  });

  if (!result.ok) {
    console.error("admin cancellation email failed:", result.error);
  }
}

export async function notifyPlayerCancelledBooking(
  details: MailReservationDetails,
): Promise<void> {
  const resolved = await withCourtName(details);
  const to = resolved.email.trim();
  if (!to) {
    console.error(
      "Skipping player cancellation email: reservation has no email.",
    );
    return;
  }

  const result = await sendMail({
    to,
    subject: cancelledBookingPlayerSubject(resolved),
    html: cancelledBookingPlayerHtml(resolved),
  });

  if (!result.ok) {
    console.error("player cancellation email failed:", result.error);
  }
}

export async function sendPlayerReminder(
  details: MailReservationDetails,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const resolved = await withCourtName(details);
  const to = resolved.email.trim();
  if (!to) {
    return { ok: false, error: "Reservation has no email." };
  }

  return sendMail({
    to,
    subject: reminderPlayerSubject(resolved),
    html: reminderPlayerHtml(resolved),
  });
}

export async function sendPasswordResetEmail(input: {
  to: string;
  resetUrl: string;
}): Promise<void> {
  const to = input.to.trim();
  if (!to) return;

  const result = await sendMail({
    to,
    subject: passwordResetSubject(),
    html: passwordResetHtml(input.resetUrl),
  });

  if (!result.ok) {
    console.error("password reset email failed:", result.error);
  }
}
