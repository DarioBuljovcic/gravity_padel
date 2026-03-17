import Link from "next/link";
import { getBlogs, logoutAction } from "@/lib/actions/blog.actions";
import { getReservations } from "@/lib/reservations.queries";
import { DeleteButton } from "./_components/DeleteButton";
import { ReservationButtons } from "./_components/ReservationButtons";
import Image from "next/image";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tab = params.tab || "blogs";

  const blogs = await getBlogs();
  const reservations = await getReservations();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 md:py-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-padel-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary-orange/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 px-2">
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

        {/* Tab Toggle */}
        <div className="flex gap-4 mb-8">
          <Link
            href="/admin/dashboard?tab=blogs"
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${tab === "blogs"
              ? "bg-primary-orange text-slate-950"
              : "bg-white/5 text-slate-400 border border-white/5 hover:border-white/10"
              }`}
          >
            Blog objave ({blogs.length})
          </Link>
          <Link
            href="/admin/dashboard?tab=reservations"
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${tab === "reservations"
              ? "bg-primary-orange text-slate-950"
              : "bg-white/5 text-slate-400 border border-white/5 hover:border-white/10"
              }`}
          >
            Rezervacije ({reservations.length})
          </Link>
        </div>

        {tab === "blogs" ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-black text-white uppercase tracking-tight">Lista Blogova</h2>
              <Link
                href="/admin/blogs/new"
                className="btn-press bg-primary-orange text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl hover:bg-white transition-all duration-300 shadow-lg shadow-primary-orange/20"
              >
                + Nova Objava
              </Link>
            </div>

            {blogs.length === 0 ? (
              <div className="glass-dark rounded-[2.5rem] px-8 py-24 text-center border border-white/5 shadow-2xl">
                <p className="text-slate-400 font-medium text-lg text-balance">Trenutno nemate objavljenih tekstova na blogu.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="group relative glass-dark rounded-3xl p-6 md:p-8 flex items-center justify-between gap-6 border border-white/5 hover:border-white/20 transition-all duration-500 shadow-xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-[10px] font-black text-primary-orange uppercase tracking-[0.3em]">
                          {new Date(blog.created_at).toLocaleDateString("sr-RS", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <h3 className="text-xl font-display font-black text-white group-hover:text-primary-orange transition-colors duration-300 truncate">
                        {blog.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 relative z-10">
                      <Link
                        href={`/admin/blogs/${blog.id}/edit`}
                        className="btn-press text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2.5 rounded-xl border border-primary-orange/20 text-primary-orange hover:bg-primary-orange/10 transition-all duration-300"
                      >
                        Izmeni
                      </Link>
                      <DeleteButton id={blog.id} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-display font-black text-white uppercase tracking-tight mb-6">Lista Rezervacija</h2>

            {reservations.length === 0 ? (
              <div className="glass-dark rounded-[2.5rem] px-8 py-24 text-center border border-white/5 shadow-2xl">
                <p className="text-slate-400 font-medium text-lg text-balance">Još uvek nema pristiglih rezervacija.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="group relative glass-dark rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/5 hover:border-white/20 transition-all duration-500 shadow-xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="flex items-center gap-4 mb-2">
                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${res.status === 'confirmed' ? 'text-green-500' : res.status === 'cancelled' ? 'text-slate-600' : 'text-primary-orange'
                          }`}>
                          {res.status === 'confirmed' ? 'Potvrđeno' : res.status === 'cancelled' ? 'Otkazano' : 'Na Čekanju'}
                        </span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                          {new Date(res.date).toLocaleDateString("sr-RS")} @ {res.start_time.slice(0, 5)}
                        </span>
                      </div>
                      <h3 className="text-xl font-display font-black text-white group-hover:text-primary-orange transition-colors duration-300">
                        Teren {res.terrain_id} — {res.name}
                      </h3>
                      <div className="flex gap-4 mt-2">
                        <span className="text-xs text-slate-500 font-bold">{res.phone}</span>
                        <span className="text-xs text-slate-400">{res.package_type} ({res.duration}h) — {res.price}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 relative z-10">
                      <ReservationButtons id={res.id} status={res.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
