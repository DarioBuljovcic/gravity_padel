"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase, Blog } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

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
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getLatestBlogs(limit = 3): Promise<Blog[]> {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

export async function getBlogById(id: string): Promise<Blog | null> {
  const { data, error } = await supabase
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
  await requireAuth();

  const title = (formData.get("title") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const body = (formData.get("body") as string)?.trim();

  if (!title || !body) return { error: "Title and body are required." };

  const { error } = await supabase.from("blogs").insert({
    title,
    slug: slugify(title),
    excerpt: excerpt || null,
    body,
  });

  if (error) {
    if (error.code === "23505") return { error: "A post with this title already exists." };
    return { error: error.message };
  }

  revalidatePath("/blog");
  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard");
}

// updateBlogFormAction has an extra first arg (id) so it can be bound:
//   const bound = updateBlogFormAction.bind(null, blogId)
//   useActionState(bound, null)   ← bound now matches (prevState, formData)
export async function updateBlogFormAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAuth();

  const title = (formData.get("title") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const body = (formData.get("body") as string)?.trim();

  if (!title || !body) return { error: "Title and body are required." };

  const { error } = await supabase
    .from("blogs")
    .update({
      title,
      slug: slugify(title),
      excerpt: excerpt || null,
      body,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/blog");
  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard");
}

export async function deleteBlog(id: string): Promise<void> {
  await requireAuth();
  const { error } = await supabase.from("blogs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/blog");
  revalidatePath("/admin/dashboard");
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function loginAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return { error: "Invalid credentials." };
  }

  const { getSession } = await import("@/lib/auth");
  const session = await getSession();
  session.isLoggedIn = true;
  await session.save();

  redirect("/admin/dashboard");
}

export async function logoutAction(): Promise<void> {
  const { getSession } = await import("@/lib/auth");
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}