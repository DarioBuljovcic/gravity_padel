"use client";

import Link from "next/link";

type Props = {
  formAction: (formData: FormData) => void;
  state: { error: string } | null;
  isPending: boolean;
  defaultValues?: {
    title?: string;
    excerpt?: string;
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
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
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
          {isPending ? "Čuvanje…" : (submitLabel === "Publish" ? "Objavi" : submitLabel)}
        </button>
        <Link
          href="/admin/dashboard"
          className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-colors"
        >
          Otkaži
        </Link>
      </div>
    </form>
  );
}
