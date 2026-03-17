import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogBySlug, getBlogs } from "@/lib/actions/blog.actions";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate static params for known slugs at build time
export async function generateStaticParams() {
  const blogs = await getBlogs();
  return blogs.map((b) => ({ slug: b.slug }));
}

export const revalidate = 60;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col">

      <section className="relative pt-26 pb-16 md:pt-38 md:pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-padel-blue/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary-orange/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-slate-500 hover:text-primary-orange transition-colors mb-12"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
              <path d="M19 12H5m7-7-7 7 7 7" />
            </svg>
            Sve Objave
          </Link>

          <article>
            <header className="mb-12 border-b border-white/5 pb-12">
              <time className="text-[10px] text-primary-orange font-black uppercase tracking-[0.4em] block mb-6">
                {new Date(blog.created_at).toLocaleDateString("sr-RS", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              <h1
                className="text-3xl md:text-6xl font-display font-black text-white leading-[1.1] mb-8 tracking-tighter text-glow-orange"
              >
                {blog.title}
              </h1>
              {blog.excerpt && (
                <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-medium">
                  {blog.excerpt}
                </p>
              )}
            </header>

            <div className="prose prose-invert prose-slate max-w-none">
              {blog.body.split("\n").map((line, i) =>
                line.trim() === "" ? (
                  <div key={i} className="h-6" />
                ) : (
                  <p key={i} className="text-slate-300 text-lg leading-relaxed mb-6 font-medium">
                    {line}
                  </p>
                )
              )}
            </div>
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}
