import Image from "next/image";
import { getGalleryImages, deleteGalleryImage } from "@/lib/actions/gallery.actions";
import GalleryUpload from "../gallery/GalleryUpload";

export default async function GalleryTab() {
  const images = await getGalleryImages();

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-display font-black text-white uppercase tracking-tight">Upravljanje Galerijom</h2>
        <p className="text-slate-400">
          Otpremite i upravljajte slikama koje se prikazuju na sajtu.
        </p>
      </div>

      <GalleryUpload />

      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Sve Slike ({images.length})</h3>
        
        {images.length === 0 ? (
          <div className="glass-dark border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4">
            <div className="bg-white/10 p-4 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <p className="text-slate-400 text-lg">Nema otpremljenih slika na sajtu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div 
                key={image.id} 
                className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-slate-900"
              >
                <Image
                  src={image.url}
                  alt={image.alt || "Gallery image"}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/70 truncate max-w-[70%]">
                      {new Date(image.created_at).toLocaleDateString('sr-RS')}
                    </p>
                    
                    <form action={async () => {
                      "use server";
                      await deleteGalleryImage(image.id);
                    }}>
                      <button
                        type="submit"
                        className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                        title="Obriši sliku"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
