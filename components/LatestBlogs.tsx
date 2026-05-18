import Link from "next/link";
import Image from "next/image";
import { getLatestBlogs } from "@/lib/actions/blog.actions";

import { FadeIn } from "./FadeIn";
import { ArrowRight } from 'lucide-react';


const ArrowRightIcon = () => <ArrowRight size={14} strokeWidth={2} />;

export async function LatestBlogs() {
  const blogs = await getLatestBlogs(3);
  const bgImage = "https://lmfykqrzbcauxdybadfi.supabase.co/storage/v1/object/public/gallery-images/b640b619-2ff3-411b-9ac1-870e634b5cb8.webp";

  if (blogs.length === 0) return null;

  return (
    <section className="w-full py-20 max-w-7xl mx-auto px-4 md:px-6" id="blog">
      {/* Top Banner */}
      <FadeIn className="relative w-full rounded-3xl overflow-hidden bg-slate-900 border border-white/10 mb-16 shadow-2xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 opacity-30 md:opacity-100 mix-blend-overlay">
          {/* Placeholder for the racket/ball image */}
          <Image src={bgImage} alt="Padel Racket" fill className="object-cover object-right" />
        </div>

        <div className="relative z-20 max-w-xl space-y-6">
          <span className="text-padel-blue text-xs font-black uppercase tracking-[0.3em] block">
            BLOG
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight leading-[1]">
            <span className="text-white">PRIČE SA TERENA,</span>
            <br />
            <span className="text-padel-blue">ZNANJE VAN NJEGA.</span>
          </h2>
          <div className="space-y-2 text-slate-300 text-sm md:text-base font-medium max-w-md">
            <p>Saveti, priče, novosti i događaji iz sveta padela.</p>
            <p>Bilo da igraš rekreativno ili ozbiljno, ovde uvek ima nešto novo za tebe.</p>
          </div>
        </div>
      </FadeIn>

      <FadeIn className="flex items-end justify-between mb-8 px-2">
        <h3 className="text-sm font-black text-white tracking-widest uppercase">
          NAJNOVIJE PRIČE
        </h3>
        <Link
          href="/blog"
          className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-padel-blue hover:text-white transition-all duration-300"
        >
          SVE PRIČE
          <ArrowRightIcon />
        </Link>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog, index) => {
          // Placeholder category logic
          const categories = ["TEREN & OPREMA", "SAVETI", "DOGAĐAJI"];
          const category = categories[index % categories.length];

          return (
            <FadeIn key={blog.id} delay={index * 100}>
              <Link
                href={`/blog/${blog.slug}`}
                className="group relative glass-dark rounded-2xl overflow-hidden border border-white/5 hover:border-padel-blue/30 transition-all duration-500 flex flex-col h-full shadow-2xl"
              >
                {/* Blog Image */}
                <div className="relative w-full aspect-[16/9] bg-slate-800 overflow-hidden">
                  <Image
                    src={blog.image_url || "https://lmfykqrzbcauxdybadfi.supabase.co/storage/v1/object/public/gallery-images/b640b619-2ff3-411b-9ac1-870e634b5cb8.webp"}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-padel-blue text-white text-[9px] font-black uppercase tracking-widest rounded-md">
                      {category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <time className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">
                    {new Date(blog.created_at).toLocaleDateString("sr-RS", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>

                  <h3 className="text-lg md:text-xl font-display font-black text-white group-hover:text-padel-blue transition-colors duration-300 leading-tight mb-3 tracking-tight line-clamp-2">
                    {blog.title}
                  </h3>

                  {blog.excerpt && (
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-6 font-medium">
                      {blog.excerpt}
                    </p>
                  )}

                  <div className="mt-auto flex items-center gap-2 text-padel-blue text-[10px] font-bold uppercase tracking-widest group-hover:text-blue-400 transition-colors duration-300">
                    PROČITAJ VIŠE
                    <ArrowRightIcon />
                  </div>
                </div>
              </Link>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
