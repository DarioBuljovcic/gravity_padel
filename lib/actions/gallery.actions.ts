"use server";

import { revalidatePath } from "next/cache";
import { supabase, GalleryImage } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching gallery images:", error);
    return [];
  }
  
  return data ?? [];
}

export async function addGalleryImage(url: string, alt?: string): Promise<GalleryImage | null> {
  await requireAuth();

  const { data, error } = await supabase
    .from("gallery")
    .insert({ url, alt: alt || null })
    .select()
    .single();

  if (error) {
    console.error("Error adding gallery image:", error);
    return null;
  }

  revalidatePath("/admin");
  revalidatePath("/galerija");
  
  return data;
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await requireAuth();

  // First fetch the image to get the URL
  const { data: image, error: fetchError } = await supabase
    .from("gallery")
    .select("url")
    .eq("id", id)
    .single();

  if (fetchError || !image) {
    throw new Error("Image not found");
  }

  const url = image.url;
  
  // Extract filename from the Supabase public URL
  // Example: https://[projectId].supabase.co/storage/v1/object/public/gallery-images/filename.webp
  const urlParts = url.split("/");
  const filename = urlParts[urlParts.length - 1];

  if (filename) {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("gallery-images")
      .remove([filename]);
      
    if (storageError) {
      console.error("Failed to delete from storage:", storageError);
      // We'll continue and delete the DB record anyway
    }
  }

  // Delete from database
  const { error: dbError } = await supabase
    .from("gallery")
    .delete()
    .eq("id", id);

  if (dbError) {
    throw new Error(dbError.message);
  }

  revalidatePath("/admin");
  revalidatePath("/galerija");
}
