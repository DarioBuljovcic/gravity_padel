"use client";

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
  submitLabel = "Publish",
}: Props) {
  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="title"
          className="text-xs font-medium text-slate-400 uppercase tracking-wider"
        >
          Title <span className="text-red-400">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={defaultValues.title}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-primary-orange/60 transition-colors"
          placeholder="Post title"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="excerpt"
          className="text-xs font-medium text-slate-400 uppercase tracking-wider"
        >
          Excerpt
        </label>
        <input
          id="excerpt"
          name="excerpt"
          type="text"
          defaultValue={defaultValues.excerpt ?? ""}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-primary-orange/60 transition-colors"
          placeholder="Short summary shown in listings (optional)"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="body"
          className="text-xs font-medium text-slate-400 uppercase tracking-wider"
        >
          Body <span className="text-red-400">*</span>
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={16}
          defaultValue={defaultValues.body}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-primary-orange/60 transition-colors resize-y font-mono leading-relaxed"
          placeholder="Write your post here…"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="btn-press bg-primary-orange text-midnight font-semibold rounded-lg px-6 py-3 text-sm hover:bg-accent-orange transition-colors disabled:opacity-50"
        >
          {isPending ? "Saving…" : submitLabel}
        </button>
        <a
          href="/admin/dashboard"
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}