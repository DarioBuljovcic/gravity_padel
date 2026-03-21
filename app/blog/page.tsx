import Link from "next/link";
import { getBlogs } from "@/lib/actions/blog.actions";
import Footer from "@/components/footer";

export const revalidate = 60; // ISR: revalidate every 60s

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col">

      {/* Hero Header */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-padel-blue/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary-orange/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="text-primary-orange text-[10px] md:text-xs font-black uppercase tracking-[0.5em] block mb-4 animate-reveal">
            Gravity Magazine
          </span>
          <h1
            className="text-4xl md:text-7xl font-display font-black text-white tracking-tighter mb-6 text-glow-orange"
          >
            NAŠ <span className="text-padel-blue">BLOG</span>
          </h1>
          <p className="max-w-xl mx-auto text-slate-400 text-sm md:text-base leading-relaxed font-medium">
            Otkrijte vesti, savete i priče iz sveta padela u Subotici. Pratite našu zajednicu i unapredite svoju igru.
          </p>
        </div>
      </section>

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 pb-32">
        <div className="mb-12 flex items-center justify-between border-b border-white/5 pb-6">
          <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">
            Najnovije Objave
          </h2>
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
            {blogs.length} {blogs.length === 1 ? "objava" : (blogs.length < 5 ? "objave" : "objava")}
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="glass-dark rounded-3xl p-16 text-center border border-white/5">
            <p className="text-slate-500 font-medium">Trenutno nema objava. Navratite uskoro.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group relative glass-dark rounded-3xl p-8 md:p-10 border border-white/5 hover:border-primary-orange/30 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <time className="text-[10px] text-slate-500 font-black uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">
                      {new Date(blog.created_at).toLocaleDateString("sr-RS", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-display font-black text-white group-hover:text-primary-orange transition-colors duration-300 mb-4 tracking-tight">
                    {blog.title}
                  </h3>

                  {blog.excerpt && (
                    <p className="text-slate-400 text-base leading-relaxed line-clamp-2 mb-6 font-medium">
                      {blog.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-primary-orange text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
                    Pročitaj više
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
