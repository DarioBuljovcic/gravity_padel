import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { logoutAction } from "@/lib/actions/auth.actions";
import { requireAdminPage } from "@/lib/auth";
import AdminTabShell from "./_components/AdminTabShell";
import QueryProvider from "./_components/QueryProvider";
import {
  BlogsTabSkeleton,
  GalleryTabSkeleton,
  ReservationsTabSkeleton,
} from "./_components/TabSkeletons";
import BlogsTab from "./blogs/_components/BlogsTab";
import GalleryTab from "./gallery/_components/GalleryTab";
import ReservationsTab from "./reservations/_components/ReservationsTab";
import { parseAdminTab } from "./lib/parseAdminTab";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  await requireAdminPage();
  const params = await searchParams;
  const initialTab = parseAdminTab(params.tab);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 md:py-20 relative overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-padel-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary-orange/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 px-2">
          <div className="flex items-center gap-4">
            <Link href="/" className="shrink-0 group">
              <Image
                src="/icon.jpg"
                alt="Logo"
                width={40}
                height={40}
                className="w-10 h-10 rounded-xl object-cover border border-white/10"
              />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight uppercase">
                Admin <span className="text-primary-orange">Panel</span>
              </h1>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">
                Upravljaj svojim sajtom
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <form action={logoutAction}>
              <button
                type="submit"
                className="btn-press text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white border border-white/10 px-6 py-3 rounded-xl transition-all duration-300 bg-white/5"
              >
                Odjavi se
              </button>
            </form>
          </div>
        </div>

        <QueryProvider>
          <AdminTabShell
            initialTab={initialTab}
            blogs={
              <Suspense fallback={<BlogsTabSkeleton />}>
                <BlogsTab />
              </Suspense>
            }
            gallery={
              <Suspense fallback={<GalleryTabSkeleton />}>
                <GalleryTab />
              </Suspense>
            }
            reservations={
              <Suspense fallback={<ReservationsTabSkeleton />}>
                <ReservationsTab searchParams={params} />
              </Suspense>
            }
          />
        </QueryProvider>
      </div>
    </main>
  );
}
