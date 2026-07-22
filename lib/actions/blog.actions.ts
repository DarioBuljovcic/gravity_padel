"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Blog } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";

type ActionState = { error: string } | null;

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Public reads ─────────────────────────────────────────────────────────────

export async function getBlogs(): Promise<Blog[]> {
  const { data, error } = await supabaseAdmin
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getLatestBlogs(limit = 3): Promise<Blog[]> {
  const { data, error } = await supabaseAdmin
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const { data, error } = await supabaseAdmin
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

export async function getBlogById(id: string): Promise<Blog | null> {
  const { data, error } = await supabaseAdmin
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

// ─── Mutations ────────────────────────────────────────────────────────────────
// Exported with the exact (prevState, formData) signature useActionState needs.
// Client components import and pass these directly — no wrapper, no prop.

export async function createBlogFormAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const image_url = (formData.get("image_url") as string)?.trim();
  const body = (formData.get("body") as string)?.trim();

  if (!title || !body) return { error: "Title and body are required." };

  const { error } = await supabaseAdmin.from("blogs").insert({
    title,
    slug: slugify(title),
    excerpt: excerpt || null,
    image_url: image_url || null,
    body,
  });

  if (error) {
    if (error.code === "23505") return { error: "A post with this title already exists." };
    return { error: error.message };
  }

  revalidatePath("/blog");
  revalidatePath("/admin");
  redirect("/admin");
}

// updateBlogFormAction has an extra first arg (id) so it can be bound:
//   const bound = updateBlogFormAction.bind(null, blogId)
//   useActionState(bound, null)   ← bound now matches (prevState, formData)
export async function updateBlogFormAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const image_url = (formData.get("image_url") as string)?.trim();
  const body = (formData.get("body") as string)?.trim();
  if (!title || !body) return { error: "Title and body are required." };

  const { error } = await supabaseAdmin
    .from("blogs")
    .update({
      title,
      slug: slugify(title),
      excerpt: excerpt || null,
      image_url: image_url || null,
      body,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/blog");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteBlog(id: string): Promise<void> {
  await requireAdmin();
  const { error } = await supabaseAdmin.from("blogs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/blog");
  revalidatePath("/admin");
}

export async function deleteBlogImageFromStorage(url: string): Promise<void> {
  await requireAdmin();
  if (!url) return;

  const urlParts = url.split("/");
  const filename = urlParts[urlParts.length - 1];

  if (filename) {
    const { error } = await supabaseAdmin.storage
      .from("blog-images")
      .remove([filename]);

    if (error) {
      console.error("Failed to delete from storage:", error);
    }
  }
}