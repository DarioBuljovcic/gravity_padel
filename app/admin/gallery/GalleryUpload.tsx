"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/upload";
import { addGalleryImage } from "@/lib/actions/gallery.actions";

export default function GalleryUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadStatus(`Otpremanje 0 od ${files.length} slika...`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        setUploadStatus(`Otpremanje slike ${i + 1} od ${files.length}...`);
        
        // 1. Upload to Supabase Storage via our API route
        const url = await uploadImage(file, "gallery-images");
        
        // 2. Insert record into database
        await addGalleryImage(url, file.name);
        
        successCount++;
      } catch (error) {
        console.error("Error uploading file:", file.name, error);
        failCount++;
      }
    }

    setIsUploading(false);
    
    if (failCount === 0) {
      setUploadStatus(`Uspešno otpremljeno ${successCount} slika!`);
      
      // Clear status after 3 seconds
      setTimeout(() => setUploadStatus(""), 3000);
    } else {
      setUploadStatus(`Završeno: ${successCount} uspešno, ${failCount} neuspešno.`);
    }

    // Clear file input
    e.target.value = "";
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Dodaj nove slike</h2>
        <p className="text-sm text-slate-400 mt-1">
          Otpremite jednu ili više slika u galeriju. Slike će biti automatski optimizovane.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <label className={`
          relative flex items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer
          ${isUploading ? 'border-primary-orange/50 bg-primary-orange/5' : 'border-white/20 bg-white/5 hover:border-primary-orange/50 hover:bg-white/10'}
        `}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg 
              className={`w-8 h-8 mb-3 ${isUploading ? 'text-primary-orange animate-bounce' : 'text-slate-400'}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-slate-400 font-medium">
              <span className="text-primary-orange">Kliknite</span> ili prevucite slike ovde
            </p>
            <p className="text-xs text-slate-500 mt-1">PNG, JPG ili WebP</p>
          </div>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>

        {uploadStatus && (
          <div className={`
            px-4 py-3 rounded-xl border text-sm font-medium animate-step-in
            ${uploadStatus.includes('uspešno') && !uploadStatus.includes('neuspešno') 
              ? 'bg-green-500/10 border-green-500/20 text-green-400' 
              : uploadStatus.includes('neuspešno')
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : 'bg-primary-orange/10 border-primary-orange/20 text-primary-orange'}
          `}>
            {uploadStatus}
          </div>
        )}
      </div>
    </div>
  );
}
