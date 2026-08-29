import { cache } from "react";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type Court = {
  id: number;
  name: string | null;
};

export type LabeledCourt = Court & {
  displayName: string;
};

export type UpdateCourtNameResult =
  | { success: true }
  | { success: false; error: string };

const COURT_SUFFIX_PATTERN =
  /\s+(teren|court|pálya|palya)\s*\d*$/iu;

const stripCourtSuffix = (value: string) =>
  value.replace(COURT_SUFFIX_PATTERN, "").trim();

export const courtNameSchema = z
  .string()
  .transform((value) => {
    const stripped = stripCourtSuffix(value.trim());
    return stripped === "" ? null : stripped;
  })
  .refine((value) => value === null || value.length <= 40, {
    message: "Naziv može imati najviše 40 karaktera.",
  });

const updateCourtNameSchema = z.object({
  courtId: z.coerce.number().int().min(1).max(4),
  name: courtNameSchema,
});

export function formatCourtDisplayName(
  prefix: string | null,
  localizedCourtLabel: string,
) {
  const trimmed = prefix?.trim();
  return trimmed ? `${trimmed} ${localizedCourtLabel}` : localizedCourtLabel;
}

export function serbianCourtLabel(id: number) {
  return `Teren ${id}`;
}

export function labelCourts(
  courts: Court[],
  localizedLabel: (id: number) => string,
): LabeledCourt[] {
  return courts.map((court) => ({
    ...court,
    displayName: formatCourtDisplayName(court.name, localizedLabel(court.id)),
  }));
}

export const listCourts = cache(async (): Promise<Court[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courts")
    .select("id, name")
    .order("id", { ascending: true });

  if (error) {
    throw new Error("Unable to load courts.");
  }

  return data ?? [];
});

export async function getCourt(id: number): Promise<Court | undefined> {
  const courts = await listCourts();
  return courts.find((court) => court.id === id);
}

export async function updateCourtName(
  _prev: UpdateCourtNameResult | undefined,
  formData: FormData,
): Promise<UpdateCourtNameResult> {
  "use server";

  await requireAdmin();

  const parsed = updateCourtNameSchema.safeParse({
    courtId: formData.get("courtId"),
    name: String(formData.get("name") ?? ""),
  });

  if (!parsed.success) {
    return { success: false, error: "Proverite uneti naziv." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("courts")
    .update({
      name: parsed.data.name,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.courtId);

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Taj naziv je već dodeljen drugom terenu." };
    }
    return { success: false, error: "Naziv terena nije moguće sačuvati." };
  }

  revalidatePath("/admin");
  revalidatePath("/rezervacija");
  revalidatePath("/account");
  return { success: true };
}
