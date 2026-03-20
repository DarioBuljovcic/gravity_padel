"use client";

import type { Terrain, TerrainAvailability } from "./types";

const terrains = [
  { id: 1, name: "Teren 1", description: "Panoramic WPT Standard" },
  { id: 2, name: "Teren 2", description: "Panoramic WPT Standard" },
  { id: 3, name: "Teren 3", description: "Panoramic WPT Standard" },
  { id: 4, name: "Teren 4", description: "Panoramic WPT Standard" },
];

export default function TerrainStep({ 
  onSelect,
  prevStep,
  terrainAvailability 
}: { 
  onSelect: (terrain: Terrain) => void,
  prevStep: () => void,
  terrainAvailability: TerrainAvailability[]
}) {
  return (
    <div className="space-y-8 animate-step-in">
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4 uppercase">Izaberi teren</h2>
        <p className="text-slate-400">Za tvoj datum prikazujemo samo ono što ima smisla da rezervišeš.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {terrains.map((terrain) => {
          const isAvailable = terrainAvailability.find((availability) => availability.terrain_id === terrain.id)?.hasAnyFreeSlot;

          return (
            <div key={terrain.id} className="relative">
              {!isAvailable && (
                <div className="absolute top-4 right-4 z-10 bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20">
                  Ovaj je otišao
                </div>
              )}
              <button
                onClick={() => isAvailable && onSelect(terrain)}
                disabled={!isAvailable}
                className={`group block w-full p-8 rounded-[2.5rem] border transition-all duration-300 text-left shadow-2xl ${
                  isAvailable 
                    ? "bg-slate-900/50 border-white/5 hover:border-padel-blue/50 hover:bg-slate-900 animate-hover-lift active:scale-95" 
                    : "bg-slate-950 border-white/5 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className={`w-12 h-12 mb-6 rounded-xl flex items-center justify-center transition-all ${
                  isAvailable 
                    ? "bg-padel-blue/10 text-padel-blue group-hover:bg-padel-blue group-hover:text-white" 
                    : "bg-slate-800 text-slate-500"
                }`}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-display font-black text-white">{terrain.name}</h3>
                <p className="text-slate-500 text-sm">{terrain.description}</p>
                {isAvailable && (
                  <p className="mt-4 text-[10px] font-black uppercase tracking-[0.25em] text-padel-blue">
                    Slobodan je za tvoj datum
                  </p>
                )}
              </button>
            </div>
          );
        })}
      </div>
      <div className="text-center">
        <button 
          onClick={prevStep} 
          className="inline-block mt-8 text-slate-500 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors"
        >
          Nazad na datum
        </button>
      </div>
    </div>
  );
}
