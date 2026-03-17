"use client";

import { useTransition } from "react";
import { deleteBlog } from "@/lib/actions/blog.actions";

export function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    startTransition(() => deleteBlog(id));
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="btn-press text-xs px-3 py-1.5 rounded-md border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
