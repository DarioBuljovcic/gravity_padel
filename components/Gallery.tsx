import Link from "next/link";
import Image from "next/image";
import { getGalleryImages } from "@/lib/actions/gallery.actions";
import { FadeIn } from "./FadeIn";
import { getTranslations } from '@/lib/i18n';


const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

const GALLERY_TILE_CLASS = [
  "md:col-span-1 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
  "hidden md:block md:col-span-1 md:row-span-1",
  "hidden md:block md:col-span-2 md:row-span-1",
] as const;

export default async function Gallery() {
  const t = await getTranslations('Gallery');
  const dbImages = await getGalleryImages();
  const images =
    dbImages.length > 6
      ? Array.from({ length: 6 }, (_, i) => dbImages[(6 + i) % dbImages.length])
      : dbImages.slice(0, 6);

  return (
    <section className="w-full py-24 max-w-7xl mx-auto px-4 md:px-6" id="gallery">
      <FadeIn className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] block mb-4">
            {t('tag')}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight leading-[0.95] mb-4">
            <span className="text-white">{t('title1')}</span>{" "}
            <span className="text-padel-blue">{t('title2')}</span>
          </h2>
          <div className="max-w-xl">
            <p className="text-slate-400 text-sm md:text-base font-medium">
              {t('subtitle1')}
            </p>
            <p className="text-slate-400 text-sm md:text-base font-medium mt-1">
              {t('subtitle2')}
            </p>
          </div>
        </div>
        <Link
          href="/galerija"
          className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-padel-blue hover:text-white transition-all duration-300 md:mb-2"
        >
          {t('allPictures')}
          <ArrowRightIcon />
        </Link>
      </FadeIn>

      {images.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
          {images.map((image, index) => (
            <FadeIn
              key={image.id}
              delay={100 * (index + 1)}
              className={`${GALLERY_TILE_CLASS[index]} group relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5 block`}
            >
              <Image
                src={image.url}
                alt={image.alt || "Gravity Padel Gallery"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {index === 0 ? (
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              ) : null}
            </FadeIn>
          ))}
        </div>
      ) : null}
    </section>
  );
}
