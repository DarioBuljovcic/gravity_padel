"use client";

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
  setBooking, 
  prevStep,
  isLoading 
}: { 
  booking: any, 
  setBooking: (b: any) => void, 
  prevStep: () => void,
  isLoading: boolean
}) {
  const handleSelect = (item: any, type: string) => {
    if (isLoading) return;
    setBooking({ ...booking, package: { ...item, type } });
  };

  return (
    <div className="space-y-8 animate-step-in">
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4 uppercase">Izaberite Paket</h2>
        <p className="text-slate-400">Pronađite termin koji vam najviše odgovara</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-padel-blue uppercase tracking-widest pl-2">Radni Dani</h3>
          {pricingData.workingDays.items.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSelect(item, 'Radni Dan')}
              disabled={isLoading}
              className="w-full text-left p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-padel-blue/50 hover:bg-slate-900 transition-all duration-300 group shadow-lg active:scale-95 transform block disabled:opacity-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="block text-white font-bold text-lg">{item.durationLabel} — {item.time}</span>
                  <span className="block text-slate-500 text-xs uppercase">{item.range}</span>
                </div>
                <div className="flex items-center gap-3">
                  {isLoading && booking.package?.duration === item.duration && booking.package?.range === item.range && (
                    <span className="animate-spin text-padel-blue">...</span>
                  )}
                  <span className="text-xl font-black text-white group-hover:text-padel-blue transition-colors">{item.price}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-primary-orange uppercase tracking-widest pl-2">Vikend</h3>
          {pricingData.weekend.items.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSelect(item, 'Vikend')}
              disabled={isLoading}
              className="w-full text-left p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-primary-orange/50 hover:bg-slate-900 transition-all duration-300 group shadow-lg active:scale-95 transform block disabled:opacity-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="block text-white font-bold text-lg">{item.durationLabel} — {item.time}</span>
                  <span className="block text-slate-500 text-xs uppercase">{item.range}</span>
                </div>
                <div className="flex items-center gap-3">
                  {isLoading && booking.package?.duration === item.duration && booking.package?.range === item.range && (
                    <span className="animate-spin text-primary-orange">...</span>
                  )}
                  <span className="text-xl font-black text-white group-hover:text-primary-orange transition-colors">{item.price}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
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
