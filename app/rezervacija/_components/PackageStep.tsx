"use client";

import type { Booking, BookingPackage } from "./types";

const pricingData = {
  workingDays: {
    title: "Radni Dani",
    items: [
      { duration: "1", durationLabel: "1h", time: "Pre podne", range: "08:00 - 16:00", price: "1900 din" },
      { duration: "1", durationLabel: "1h", time: "Posle podne", range: "16:00 - 23:00", price: "2400 din" },
      { duration: "1.5", durationLabel: "1.5h", time: "Pre podne", range: "08:00 - 16:00", price: "2850 din" },
      { duration: "1.5", durationLabel: "1.5h", time: "Posle podne", range: "16:00 - 23:00", price: "3600 din" },
      { duration: "2", durationLabel: "2h", time: "Pre podne", range: "08:00 - 16:00", price: "3500 din" },
      { duration: "2", durationLabel: "2h", time: "Posle podne", range: "16:00 - 23:00", price: "4400 din" }
    ]
  },
  weekend: {
    title: "Vikend",
    items: [
      { duration: "1", durationLabel: "1h", time: "Ceo dan", range: "08:00 - 23:00", price: "2400 din" },
      { duration: "1.5", durationLabel: "1.5h", time: "Ceo dan", range: "08:00 - 23:00", price: "3600 din" },
      { duration: "2", durationLabel: "2h", time: "Ceo dan", range: "08:00 - 23:00", price: "4400 din" }
    ]
  }
};

export default function PackageStep({ 
  booking, 
  onSelect,
  prevStep,
  isLoading 
}: { 
  booking: Booking,
  onSelect: (item: Omit<BookingPackage, "type">, type: string) => void,
  prevStep: () => void,
  isLoading: boolean
}) {
  const handleSelect = (item: Omit<BookingPackage, "type">, type: string) => {
    if (isLoading) return;
    onSelect(item, type);
  };

  const [year, month, day] = booking.date.split("-").map(Number);
  const selectedDate = new Date(year, month - 1, day);
  const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
  const activePricing = isWeekend
    ? {
        title: pricingData.weekend.title,
        accent: "text-primary-orange",
        hoverBorder: "hover:border-primary-orange/50",
        hoverText: "group-hover:text-primary-orange",
        spinnerColor: "text-primary-orange",
        type: "Vikend",
        items: pricingData.weekend.items,
        badge: "Za tvoj vikend termin",
      }
    : {
        title: pricingData.workingDays.title,
        accent: "text-padel-blue",
        hoverBorder: "hover:border-padel-blue/50",
        hoverText: "group-hover:text-padel-blue",
        spinnerColor: "text-padel-blue",
        type: "Radni Dan",
        items: pricingData.workingDays.items,
        badge: "Za tvoj radni dan",
      };

  return (
    <div className="space-y-8 animate-step-in">
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4 uppercase">Koliko dugo igraš?</h2>
        <p className="text-slate-400">Izaberi trajanje i termin koji ti najviše odgovara.</p>
      </div>
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <h3 className={`text-xl font-bold uppercase tracking-widest ${activePricing.accent}`}>
            {activePricing.title}
          </h3>
          <span className="rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
            {activePricing.badge}
          </span>
        </div>

        {activePricing.items.map((item, i) => (
          <button
            key={i}
            onClick={() => handleSelect(item, activePricing.type)}
            disabled={isLoading}
            className={`w-full text-left p-6 rounded-2xl bg-slate-900/50 border border-white/5 ${activePricing.hoverBorder} hover:bg-slate-900 transition-all duration-300 group shadow-lg active:scale-95 transform block disabled:opacity-50`}
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-white font-bold text-lg">{item.durationLabel} — {item.time}</span>
                <span className="block text-slate-500 text-xs uppercase">{item.range}</span>
                <span className="mt-2 block text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Reketi i loptice uključeni</span>
              </div>
              <div className="flex items-center gap-3">
                {isLoading && booking.package?.duration === item.duration && booking.package?.range === item.range && (
                  <span className={`animate-spin ${activePricing.spinnerColor}`}>...</span>
                )}
                <span className={`text-xl font-black text-white transition-colors ${activePricing.hoverText}`}>{item.price}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="text-center">
        <button 
          onClick={prevStep} 
          className="inline-block mt-8 text-slate-500 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors"
        >
          Nazad na teren
        </button>
      </div>
    </div>
  );
}
