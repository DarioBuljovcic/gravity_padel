import Link from "next/link";
import { getLatestBlogs } from "@/lib/actions/blog.actions";

export async function LatestBlogs() {
  const blogs = await getLatestBlogs(3);

  if (blogs.length === 0) return null;

  return (
    <section className="w-full pb-20 max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex items-end justify-between mb-12 px-2">
        <div>
          <span className="text-primary-orange text-[10px] md:text-xs font-black uppercase tracking-[0.5em] block mb-4">
            Ako želiš još razloga da dođeš
          </span>
          <h2
            className="text-3xl md:text-5xl font-display font-black text-white tracking-tighter uppercase"
          >
            PROČITAJ PRE <span className="text-padel-blue">SLEDEĆEG MEČA</span>
          </h2>
        </div>
        <Link
          href="/blog"
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-primary-orange transition-all duration-300 mb-2"
        >
          Sve Priče
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
            <path d="M5 12h14m-7-7 7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.slug}`}
            className="group relative glass-dark rounded-[2.5rem] p-8 md:p-10 border border-white/5 hover:border-primary-orange/30 transition-all duration-500 flex flex-col gap-6 overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex flex-col h-full">
              <time className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">
                {new Date(blog.created_at).toLocaleDateString("sr-RS", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </time>

              <h3 className="text-xl font-display font-black text-white group-hover:text-primary-orange transition-colors duration-300 leading-tight mb-4 tracking-tight">
                {blog.title}
              </h3>

              {blog.excerpt && (
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-6 font-medium">
                  {blog.excerpt}
                </p>
              )}

              <div className="mt-auto pt-4 flex items-center gap-2 text-primary-orange text-[10px] font-black uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
                Pročitaj
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
