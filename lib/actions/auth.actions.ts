"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/mail/notify";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const emailSchema = z.object({
  email: z.email().max(254),
});

const passwordSchema = z.string().min(8).max(72);

export type RequestPasswordResetState = {
  ok: boolean;
  error: "invalid_email" | null;
} | null;

export type UpdatePasswordState = {
  ok: boolean;
  error: "too_short" | "mismatch" | "failed" | null;
} | null;

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function requestPasswordResetAction(
  _prevState: RequestPasswordResetState,
  formData: FormData,
): Promise<RequestPasswordResetState> {
  const parsed = emailSchema.safeParse({
    email: String(formData.get("email") ?? "").trim(),
  });

  if (!parsed.success) {
    return { ok: false, error: "invalid_email" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    return { ok: true, error: null };
  }
  console.log(siteUrl);

  try {
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: parsed.data.email,
      options: { redirectTo: `${siteUrl}/auth/confirm` },
    });
    const hashedToken = data?.properties?.hashed_token;

    if (!error && hashedToken) {
      await sendPasswordResetEmail({
        to: parsed.data.email,
        resetUrl: `${siteUrl}/auth/confirm?token_hash=${encodeURIComponent(hashedToken)}&type=recovery`,
      });
    }
  } catch {
    // Same success copy whether the account exists or mail fails.
  }

  return { ok: true, error: null };
}

export async function updatePasswordAction(
  _prevState: UpdatePasswordState,
  formData: FormData,
): Promise<UpdatePasswordState> {
  const fromReset = formData.get("from") === "reset";
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (typeof password !== "string" || typeof confirmPassword !== "string") {
    return { ok: false, error: "failed" };
  }

  if (!passwordSchema.safeParse(password).success) {
    return { ok: false, error: "too_short" };
  }

  if (password !== confirmPassword) {
    return { ok: false, error: "mismatch" };
  }

  const user = await getCurrentUser();
  if (!user) {
    if (fromReset) redirect("/forgot-password?error=invalid_link");
    return { ok: false, error: "failed" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { ok: false, error: "failed" };
  }
  console.log("Something");
  await supabase.auth.signOut({ scope: "others" }).catch(() => undefined);

  if (fromReset) redirect("/account");

  revalidatePath("/account");
  return { ok: true, error: null };
}
