import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import { getGalleryImages } from "@/lib/actions/gallery.actions";

export const revalidate = 60; // Refresh occasionally in production

export default async function GalleryPage() {
  const dbImages = await getGalleryImages();

  // Simulating images. The user can add more to the public folder.

  const images = dbImages.map(img => ({ src: img.url, alt: img.alt || "Gravity Padel Image" }))

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col">
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-padel-blue/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary-orange/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="text-primary-orange text-[10px] md:text-xs font-black uppercase tracking-[0.5em] block mb-4 animate-reveal">
            Zaviri na terene
          </span>
          <h1
            className="text-4xl md:text-7xl font-display font-black text-white tracking-tighter mb-6 text-glow-orange"
          >
            NAŠA <span className="text-padel-blue">GALERIJA</span>
          </h1>
          <p className="max-w-xl mx-auto text-slate-400 text-sm md:text-base leading-relaxed font-medium">
            Pogledajte atmosferu sa naših terena, vrhunsku opremu i momente iz igre. Osetite Gravity energiju.
          </p>
        </div>
      </section>

      <section className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 pb-24">
        {/* Simple masonry-like or dense grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[300px]">
          {images.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl group bg-slate-900 border border-white/5 ${i === 0 || i === 4 ? "col-span-2 row-span-2" : ""
                }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                {/* Optional: could add an icon or just have the overlay */}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link
            href="https://gravitysport.simplybook.me/v2/"
            className="inline-flex px-8 py-4 bg-primary-orange text-slate-950 rounded-full font-black text-xs md:text-sm uppercase tracking-[0.2em] hover:bg-white transition-all duration-300 shadow-xl shadow-primary-orange/20 btn-press"
          >
            Rezerviši svoj termin
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
