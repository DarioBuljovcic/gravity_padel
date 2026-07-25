import "server-only";

import { Resend } from "resend";

export type SendMailInput = {
  to: string | string[];
  subject: string;
  html: string;
};

export type SendMailResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export function getMailFrom(): string | null {
  return process.env.MAIL_FROM?.trim() || null;
}

export function getAdminNotifyEmail(): string | null {
  return process.env.ADMIN_NOTIFY_EMAIL?.trim() || null;
}

export async function sendMail(
  input: SendMailInput,
): Promise<SendMailResult> {
  const from = getMailFrom();
  const resend = getResend();

  if (!resend || !from) {
    const error = "Mail is not configured (RESEND_API_KEY / MAIL_FROM).";
    console.error(error);
    return { ok: false, error };
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });

    if (error) {
      console.error("Resend send failed:", error);
      return { ok: false, error: error.message };
    }

    return { ok: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown mail error";
    console.error("Resend send threw:", err);
    return { ok: false, error: message };
  }
}
