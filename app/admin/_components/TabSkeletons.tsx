import { Skeleton } from "@/components/ui/skeleton";

export function BlogsTabSkeleton() {
  return (
    <div className="space-y-4">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-7 w-40 bg-white/10" />
        <Skeleton className="h-10 w-36 rounded-xl bg-white/10" />
      </div>
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-6 rounded-3xl border border-white/5 bg-slate-900/50 p-6 md:p-8"
          >
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-3 w-24 bg-white/10" />
              <Skeleton className="h-6 w-3/4 max-w-md bg-white/10" />
            </div>
            <div className="flex shrink-0 gap-2">
              <Skeleton className="h-9 w-20 rounded-xl bg-white/10" />
              <Skeleton className="h-9 w-20 rounded-xl bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GalleryTabSkeleton() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-56 bg-white/10" />
        <Skeleton className="h-5 w-80 max-w-full bg-white/10" />
      </div>
      <Skeleton className="h-32 w-full rounded-2xl bg-white/10" />
      <div className="flex flex-col gap-6">
        <Skeleton className="h-7 w-40 bg-white/10" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={index}
              className="aspect-square rounded-2xl bg-white/10"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReservationsTabSkeleton() {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
        <Skeleton className="h-7 w-52 bg-white/10" />
        <Skeleton className="mt-2 h-4 w-64 max-w-full bg-white/10" />
      </div>
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-16 bg-white/10" />
              <Skeleton className="h-9 w-full bg-white/10" />
            </div>
          ))}
        </div>
        <div className="mt-5 flex gap-3">
          <Skeleton className="h-9 w-24 bg-white/10" />
          <Skeleton className="h-9 w-24 bg-white/10" />
        </div>
      </div>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index}>
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40 bg-white/10" />
                <Skeleton className="h-4 w-56 bg-white/10" />
              </div>
              <Skeleton className="h-9 w-24 rounded-xl bg-white/10" />
            </div>
          </div>
          <div className="-mt-3 rounded-b-2xl border border-t-0 border-white/10 bg-slate-900/40 px-5 pb-4 pt-5">
            <Skeleton className="h-4 w-72 max-w-full bg-white/10" />
          </div>
        </div>
      ))}
    </section>
  );
}
