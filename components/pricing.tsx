'use client';

import { FadeIn } from './fade-in';

const pricingData = {
  workingDays: {
    title: "Radni Dani",
    items: [
      { duration: "1h", time: "Pre podne", range: "08:00 - 16:00", price: "1900 din" },
      { duration: "1h", time: "Posle podne", range: "16:00 - 23:00", price: "2400 din" },
      { duration: "1.5h", time: "Pre podne", range: "08:00 - 16:00", price: "2850 din" },
      { duration: "1.5h", time: "Posle podne", range: "16:00 - 23:00", price: "3600 din" },
      { duration: "2h", time: "Pre podne", range: "08:00 - 16:00", price: "3500 din" },
      { duration: "2h", time: "Posle podne", range: "16:00 - 23:00", price: "4400 din" }
    ]
  },
  weekend: {
    title: "Vikend",
    items: [
      { duration: "1h", time: "Ceo dan", range: "08:00 - 23:00", price: "2400 din" },
      { duration: "1.5h", time: "Ceo dan", range: "08:00 - 23:00", price: "3600 din" },
      { duration: "2h", time: "Ceo dan", range: "08:00 - 23:00", price: "4400 din" }
    ]
  }
};

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 px-4 md:px-6 bg-slate-950 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lime-400/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-7xl font-display font-black text-white tracking-tighter mb-6">
            CENOVNIK
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Transparentne cene za vrhunsko iskustvo. <br className="hidden md:block" />
            Izaberite termin koji vam najviše odgovara.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Working Days */}
          <FadeIn className="group relative p-1px rounded-[2.5rem] bg-gradient-to-b from-blue-600/20 to-transparent">
            <div className="h-full bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/5">
              <div className="flex items-baseline justify-between mb-10">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-tight">
                  {pricingData.workingDays.title}
                </h3>
                <span className="px-4 py-1.5 rounded-full bg-blue-600/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-600/20">
                  Ponedeljak - Petak
                </span>
              </div>

              <div className="space-y-6">
                {pricingData.workingDays.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between group/line">
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-lg">
                        {item.duration} <span className="text-slate-500 font-medium ml-1">— {item.time}</span>
                      </span>
                      <span className="text-slate-500 text-xs font-medium tracking-tight uppercase">
                        {item.range}
                      </span>
                    </div>
                    <div className="flex-1 border-b border-dotted border-slate-800 mx-4 h-5 opacity-50 group-hover/line:border-blue-600/30 transition-colors" />
                    <span className="text-white font-black text-xl tracking-tight">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex items-center gap-4 text-lime-400">
                <div className="w-10 h-10 rounded-xl bg-lime-400/10 flex items-center justify-center border border-lime-400/20">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-bold uppercase text-xs tracking-widest">Gratis reketi i loptice</span>
              </div>
            </div>
          </FadeIn>

          {/* Weekend */}
          <FadeIn delay={200} className="group relative p-1px rounded-[2.5rem] bg-gradient-to-b from-lime-400/20 to-transparent">
            <div className="h-full bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/5">
              <div className="flex items-baseline justify-between mb-10">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-tight">
                  {pricingData.weekend.title}
                </h3>
                <span className="px-4 py-1.5 rounded-full bg-lime-400/10 text-lime-400 text-[10px] font-black uppercase tracking-widest border border-lime-400/20">
                  Subota - Nedelja
                </span>
              </div>

              <div className="space-y-8">
                {pricingData.weekend.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between group/line">
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-lg">
                        {item.duration} <span className="text-slate-500 font-medium ml-1">— {item.time}</span>
                      </span>
                      <span className="text-slate-500 text-xs font-medium tracking-tight uppercase">
                        {item.range}
                      </span>
                    </div>
                    <div className="flex-1 border-b border-dotted border-slate-800 mx-4 h-5 opacity-50 group-hover/line:border-lime-400/30 transition-colors" />
                    <span className="text-white font-black text-xl tracking-tight">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex items-center gap-4 text-lime-400">
                <div className="w-10 h-10 rounded-xl bg-lime-400/10 flex items-center justify-center border border-lime-400/20">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-bold uppercase text-xs tracking-widest">Gratis reketi i loptice</span>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn className="mt-12 text-center">
          <p className="text-slate-500 text-xs md:text-sm font-medium italic">
            * Napomena: izgubljena loptica se naplaćuje 300 din *
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
