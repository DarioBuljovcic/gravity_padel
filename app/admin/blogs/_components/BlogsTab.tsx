import Link from "next/link";
import { getBlogs } from "@/lib/actions/blog.actions";
import { DeleteButton } from "./DeleteButton";

export default async function BlogsTab() {
  const blogs = await getBlogs();

  return (
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
  );
}
