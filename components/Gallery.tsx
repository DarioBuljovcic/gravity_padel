import Link from "next/link";
import Image from "next/image";
import { getGalleryImages } from "@/lib/actions/gallery.actions";
import { FadeIn } from "./FadeIn";

export default async function Gallery() {
  const dbImages = await getGalleryImages();

  const defaultImages = [
    "/about.webp",
    "/hero.jpeg",
    "/about.webp",
    "/hero.jpeg"
  ];

  const images = dbImages.length > 0
    ? dbImages.slice(0, 4).map(img => img.url)
    : defaultImages;

  return (
    <section className="w-full py-24 max-w-7xl mx-auto px-4 md:px-6" id="gallery">
      <FadeIn className="flex items-end justify-between mb-12 px-2">
        <div>
          <span className="text-primary-orange text-[10px] md:text-xs font-black uppercase tracking-[0.5em] block mb-4">
            Zaviri na terene
          </span>
          <h2
            className="text-3xl md:text-5xl font-display font-black text-white tracking-tighter uppercase"
          >
            NAŠA <span className="text-padel-blue">GALERIJA</span>
          </h2>
        </div>
        <Link
          href="/galerija"
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-primary-orange transition-all duration-300 mb-2"
        >
          Sve Slike
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
            <path d="M5 12h14m-7-7 7 7-7 7" />
          </svg>
        </Link>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {images.map((src, index) => (
          <FadeIn key={src} delay={index * 100}>
            <Link
              href="/galerija"
              className="group relative overflow-hidden rounded-2xl aspect-square md:aspect-[4/5] object-cover bg-slate-900 border border-white/5 block"
            >
              <Image
                src={src}
                alt={`Gravity Padel Gallery Image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <span className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  Prikaži <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                </span>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
