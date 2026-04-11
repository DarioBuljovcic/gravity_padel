import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogById } from "@/lib/actions/blog.actions";
import { EditBlogForm } from "../../_components/EditBlogForm";
import Image from "next/image";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) notFound();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 md:py-20 relative overflow-hidden flex flex-col items-center">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-padel-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary-orange/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-3xl relative z-10">
        <div className="mb-12 flex flex-col items-center">
          <Link href="/" className="flex items-center gap-3 mb-10 group">
            <Image
              src="/icon.jpg"
              alt="Logo"
              width={32}
              height={32}
              className="w-8 h-8 rounded-xl object-cover border border-white/10 shadow-2xl"
            />
            <span className="font-display font-black text-xl tracking-tighter text-white">
              PADEL <span className="text-padel-blue group-hover:text-primary-orange transition-colors">GRAVITY</span>
            </span>
          </Link>

          <div className="w-full flex items-center justify-between gap-4">
            <Link
              href="/admin"
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                <path d="M19 12H5m7-7-7 7 7 7" />
              </svg>
              Kontrolna Tabla
            </Link>
            <div className="text-right">
              <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                Izmeni <span className="text-primary-orange">Objavu</span>
              </h1>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1 truncate max-w-[200px] md:max-w-xs ml-auto">
                {blog.title}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-dark rounded-[2.5rem] p-8 md:p-12 border border-white/5 shadow-2xl">
          <EditBlogForm
            id={blog.id}
            defaultValues={{
              title: blog.title,
              excerpt: blog.excerpt ?? "",
              image_url: blog.image_url ?? "",
              body: blog.body,
            }}
          />
        </div>
      </div>
    </main>
  );
}
