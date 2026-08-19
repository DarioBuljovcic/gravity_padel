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

export async function notifyPlayerNewBooking(
  details: MailReservationDetails,
): Promise<void> {
  const to = details.email.trim();
  if (!to) {
    console.error("Skipping player booking email: reservation has no email.");
    return;
  }

  const result = await sendMail({
    to,
    subject: newBookingPlayerSubject(details),
    html: newBookingPlayerHtml(details),
  });

  if (!result.ok) {
    console.error("player booking email failed:", result.error);
  }
}

export async function notifyAdminCancelledBooking(
  details: MailReservationDetails,
): Promise<void> {
  const to = getAdminNotifyEmail();
  if (!to) {
    console.error(
      "Skipping admin cancellation email: ADMIN_NOTIFY_EMAIL is not set.",
    );
    return;
  }

  const result = await sendMail({
    to,
    subject: cancelledBookingAdminSubject(details),
    html: cancelledBookingAdminHtml(details),
  });

  if (!result.ok) {
    console.error("admin cancellation email failed:", result.error);
  }
}

export async function notifyPlayerCancelledBooking(
  details: MailReservationDetails,
): Promise<void> {
  const to = details.email.trim();
  if (!to) {
    console.error(
      "Skipping player cancellation email: reservation has no email.",
    );
    return;
  }

  const result = await sendMail({
    to,
    subject: cancelledBookingPlayerSubject(details),
    html: cancelledBookingPlayerHtml(details),
  });

  if (!result.ok) {
    console.error("player cancellation email failed:", result.error);
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
