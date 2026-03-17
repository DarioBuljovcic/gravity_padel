import Link from "next/link";
import { getBlogs, logoutAction } from "@/lib/actions/blog.actions";
import { DeleteButton } from "./_components/DeleteButton";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const blogs = await getBlogs();

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
                Upravljanje <span className="text-primary-orange">Blogom</span>
              </h1>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">
                {blogs.length} {blogs.length === 1 ? "ukupna objava" : "ukupne objave"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/admin/blogs/new"
              className="btn-press bg-primary-orange text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl hover:bg-white transition-all duration-300 shadow-lg shadow-primary-orange/20"
            >
              + Nova Objava
            </Link>
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

        {/* Blog list */}
        {blogs.length === 0 ? (
          <div className="glass-dark rounded-[2.5rem] px-8 py-24 text-center border border-white/5 shadow-2xl">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
            </div>
            <p className="text-slate-400 font-medium text-lg mb-8 text-balance">Trenutno nemate objavljenih tekstova na blogu.</p>
            <Link
              href="/admin/blogs/new"
              className="inline-flex items-center gap-2 text-primary-orange text-[10px] font-black uppercase tracking-[0.3em] hover:gap-4 transition-all duration-300"
            >
              Kreiraj prvu objavu
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-7-7 7 7-7 7"/>
              </svg>
            </Link>
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
                  {blog.excerpt && (
                    <p className="text-slate-500 text-sm mt-1 truncate font-medium">{blog.excerpt}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 shrink-0 relative z-10">
                  <Link
                    href={`/blog/${blog.slug}`}
                    target="_blank"
                    className="text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300"
                  >
                    Pogledaj
                  </Link>
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
    </main>
  );
}
