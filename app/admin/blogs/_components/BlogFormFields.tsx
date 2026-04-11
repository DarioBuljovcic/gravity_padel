"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/lib/upload";

import { deleteBlogImageFromStorage } from "@/lib/actions/blog.actions";

type Props = {
  formAction: (formData: FormData) => void;
  state: { error: string } | null;
  isPending: boolean;
  defaultValues?: {
    title?: string;
    excerpt?: string;
    image_url?: string;
    body?: string;
  };
  submitLabel?: string;
};

export function BlogFormFields({
  formAction,
  state,
  isPending,
  defaultValues = {},
  submitLabel = "Objavi",
}: Props) {
  const [imageUrl, setImageUrl] = useState(defaultValues.image_url || "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError("");

    try {
      const url = await uploadImage(file, "blog-images");
      setImageUrl(url);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <label
          htmlFor="title"
          className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1"
        >
          Naslov <span className="text-primary-orange">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={defaultValues.title}
          className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-600 text-base focus:outline-none focus:border-primary-orange/60 focus:ring-4 focus:ring-primary-orange/10 transition-all duration-300 font-medium"
          placeholder="Unesite naslov objave"
        />
      </div>

      <div className="flex flex-col gap-3">
        <label
          htmlFor="excerpt"
          className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1"
        >
          Kratak odlomak
        </label>
        <input
          id="excerpt"
          name="excerpt"
          type="text"
          defaultValue={defaultValues.excerpt ?? ""}
          className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-primary-orange/60 focus:ring-4 focus:ring-primary-orange/10 transition-all duration-300 font-medium"
          placeholder="Kratak rezime koji se prikazuje na listi (opciono)"
        />
      </div>

      <div className="flex flex-col gap-3">
        <label
          htmlFor="image_url"
          className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1"
        >
          URL Slike
        </label>

        <div className="flex flex-col gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-orange/10 file:text-primary-orange hover:file:bg-primary-orange/20 cursor-pointer disabled:opacity-50"
          />

          {isUploading && (
            <p className="text-sm text-primary-orange animate-pulse">
              Otpremanje slike...
            </p>
          )}

          {uploadError && (
            <p className="text-sm text-red-400">
              Došlo je do greške prilikom otpremanja slike. Pokušajte ponovo.
              {uploadError}
            </p>
          )}

          {imageUrl && (
            <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden border border-white/10 group">
              <Image
                src={imageUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={async () => {
                  try {
                    await deleteBlogImageFromStorage(imageUrl);
                  } catch (e) {
                    console.error("Failed to delete image", e);
                  }
                  setImageUrl("");
                }}
                className="absolute top-2 right-2 bg-slate-900/80 p-1.5 rounded-full text-white/50 hover:text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}

          <input type="hidden" name="image_url" value={imageUrl} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label
          htmlFor="body"
          className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1"
        >
          Sadržaj <span className="text-primary-orange">*</span>
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={12}
          defaultValue={defaultValues.body}
          className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-600 text-base focus:outline-none focus:border-primary-orange/60 focus:ring-4 focus:ring-primary-orange/10 transition-all duration-300 resize-y font-medium leading-relaxed min-h-[300px]"
          placeholder="Napišite sadržaj vaše objave..."
        />
      </div>

      {state?.error && (
        <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 font-medium flex items-center gap-2 animate-step-in">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {state.error}
        </div>
      )}

      <div className="flex items-center gap-6 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="btn-press bg-primary-orange text-slate-950 font-black rounded-2xl px-10 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:shadow-2xl hover:shadow-primary-orange/20 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-primary-orange/10"
        >
          {isPending ? "Čuvanje…" : submitLabel}
        </button>
        <Link
          href="/admin"
          className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-colors"
        >
          Otkaži
        </Link>
      </div>
    </form>
  );
}
