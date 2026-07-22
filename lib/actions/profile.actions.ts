"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(30),
});

export async function updateProfile(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
  });
  if (!parsed.success) throw new Error("Invalid profile data.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);
  if (error) throw new Error("Unable to update profile.");
  revalidatePath("/account");
}
