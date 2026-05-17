import Link from "next/link";
import Image from "next/image";
import { getGalleryImages } from "@/lib/actions/gallery.actions";
import { FadeIn } from "./FadeIn";

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

export default async function Gallery() {
  const dbImages = await getGalleryImages();

  const defaultImages = [
    "/images/AIP_5544.avif",
    "/images/MMP-172.avif",
    "/images/AIP_5544.avif",
    "/images/MMP-172.avif",
    "/images/AIP_5544.avif",
    "/images/MMP-172.avif"
  ];

  const images = dbImages.length >= 6
    ? dbImages.slice(0, 6).map(img => img.url)
    : defaultImages;

  return (
    <section className="w-full py-24 max-w-7xl mx-auto px-4 md:px-6" id="gallery">
      <FadeIn className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] block mb-4">
            ZAVIRI NA TERENE
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight leading-[0.95] mb-4">
            <span className="text-white">NAŠA</span>{" "}
            <span className="text-padel-blue">GALERIJA</span>
          </h2>
          <div className="max-w-xl">
            <p className="text-slate-400 text-sm md:text-base font-medium">
              Atmosfera sa terena, momenti sa mečeva i ekipa koja Gravity čini posebnim mestom za igru
              i druženje.

            </p>
            <p className="text-slate-400 text-sm md:text-base font-medium mt-1">
              Pogledaj sve slike.
            </p>
          </div>
        </div>
        <Link
          href="/galerija"
          className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-padel-blue hover:text-white transition-all duration-300 md:mb-2"
        >
          SVE SLIKE
          <ArrowRightIcon />
        </Link>
      </FadeIn>

      {/* Masonry-like grid for 6 images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
        {/* Image 1: Large Span */}
        <FadeIn delay={100} className="md:col-span-1 md:row-span-2 group relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5 block">
          <Image src={images[0] || defaultImages[0]} alt="Gravity Padel Gallery" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </FadeIn>

        {/* Image 2 */}
        <FadeIn delay={200} className="md:col-span-1 md:row-span-1 group relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5 block">
          <Image src={images[1] || defaultImages[1]} alt="Gravity Padel Gallery" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        </FadeIn>

        {/* Image 3 */}
        <FadeIn delay={300} className="md:col-span-1 md:row-span-1 group relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5 block">
          <Image src={images[2] || defaultImages[2]} alt="Gravity Padel Gallery" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        </FadeIn>

        {/* Image 4: Wide Span */}
        <FadeIn delay={400} className="md:col-span-2 md:row-span-1 group relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5 block">
          <Image src={images[3] || defaultImages[3]} alt="Gravity Padel Gallery" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        </FadeIn>

        {/* Image 5 */}
        <FadeIn delay={500} className="hidden md:block md:col-span-1 md:row-span-1 group relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5 block">
          <Image src={images[4] || defaultImages[4]} alt="Gravity Padel Gallery" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        </FadeIn>

        {/* Image 6 */}
        <FadeIn delay={600} className="hidden md:block md:col-span-2 md:row-span-1 group relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5 block">
          <Image src={images[5] || defaultImages[5]} alt="Gravity Padel Gallery" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        </FadeIn>
      </div>
    </section>
  );
}
