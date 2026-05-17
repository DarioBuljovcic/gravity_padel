'use client';

import { FadeIn } from './FadeIn';

const pricingData = {
  workingDays: {
    title: "Radni Dani",
    items: [
      { duration: "1h", time: "Pre podne", range: "08:00 - 16:00", price: "2.000 RSD" },
      { duration: "1h", time: "Posle podne", range: "16:00 - 23:00", price: "2.500 RSD" },
      { duration: "1.5h", time: "Pre podne", range: "08:00 - 16:00", price: "3.000 RSD" },
      { duration: "1.5h", time: "Posle podne", range: "16:00 - 23:00", price: "3.750 RSD" },
      { duration: "2h", time: "Pre podne", range: "08:00 - 16:00", price: "4.000 RSD" },
      { duration: "2h", time: "Posle podne", range: "16:00 - 23:00", price: "5.000 RSD" }
    ]
  },
  weekend: {
    title: "Vikend",
    items: [
      { duration: "1h", time: "Ceo dan", range: "08:00 - 23:00", price: "2.500 RSD" },
      { duration: "1.5h", time: "Ceo dan", range: "08:00 - 23:00", price: "3.750 RSD" },
      { duration: "2h", time: "Ceo dan", range: "08:00 - 23:00", price: "5.000 RSD" }
    ]
  }
};

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 px-4 md:px-6 bg-slate-950 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-padel-blue/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-orange/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center mb-16 md:mb-24">
          <span className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] block mb-4">
            CENOVNIK
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight leading-[0.95] mb-6">
            <span className="text-white">REZERVIŠI BEZ</span> <br className="hidden md:block" />
            <span className="text-padel-blue">ČEKANJA.</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto font-medium">
            Pogledaj dostupne termine i rezerviši teren online za nekoliko sekundi.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Working Days */}
          <FadeIn className="group relative p-1px rounded-[2.5rem] bg-gradient-to-b from-padel-blue/20 to-transparent">
            <div className="h-full bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/5">
              <div className="flex items-baseline justify-between mb-10">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-tight">
                  {pricingData.workingDays.title}
                </h3>
              </div>

              <div className="space-y-6">
                {pricingData.workingDays.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between group/line">
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-lg">
                        {item.duration} <span className="text-slate-500 font-medium ml-1">— {item.time}</span>
                      </span>
                      <span className="text-slate-500 text-[10px] md:text-xs font-medium tracking-tight uppercase">
                        {item.range}
                      </span>
                    </div>
                    <div className="flex-1 border-b border-dotted border-slate-800 mx-4 h-5 opacity-50 group-hover/line:border-padel-blue/30 transition-colors" />
                    <span className="text-padel-blue font-black text-xl tracking-tight">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Weekend */}
          <FadeIn delay={200} className="group relative p-1px rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent">
            <div className="h-full bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/5">
              <div className="flex items-baseline justify-between mb-10">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-tight">
                  {pricingData.weekend.title}
                </h3>
              </div>

              <div className="space-y-8">
                {pricingData.weekend.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between group/line">
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-lg">
                        {item.duration} <span className="text-slate-500 font-medium ml-1">— {item.time}</span>
                      </span>
                      <span className="text-slate-500 text-[10px] md:text-xs font-medium tracking-tight uppercase">
                        {item.range}
                      </span>
                    </div>
                    <div className="flex-1 border-b border-dotted border-slate-800 mx-4 h-5 opacity-50 group-hover/line:border-white/20 transition-colors" />
                    <span className="text-white font-black text-xl tracking-tight">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Bottom Included Features */}
        <FadeIn delay={300} className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
          <div className="glass-dark rounded-2xl p-6 flex items-center justify-center gap-4 border border-white/5 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-full bg-padel-blue/10 flex items-center justify-center text-padel-blue border border-padel-blue/20">
              <CheckIcon />
            </div>
            <span className="text-white font-bold uppercase text-sm tracking-widest">
              Reketi uključeni u cenu
            </span>
          </div>
          <div className="glass-dark rounded-2xl p-6 flex items-center justify-center gap-4 border border-white/5 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-full bg-padel-blue/10 flex items-center justify-center text-padel-blue border border-padel-blue/20">
              <CheckIcon />
            </div>
            <span className="text-white font-bold uppercase text-sm tracking-widest">
              Loptice uključene u cenu
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
