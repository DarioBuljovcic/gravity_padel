import Link from "next/link";

export default function ConfirmationStep({
  booking
}: {
  booking: any
}) {
  return (
    <div className="text-center space-y-8 max-w-lg mx-auto animate-step-in">
      <div className="w-24 h-24 mx-auto rounded-full bg-primary-orange/10 flex items-center justify-center text-primary-orange border border-primary-orange/20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h2 className="text-4xl font-display font-black text-white mb-4 uppercase">HVALA VAM!</h2>
        <p className="text-slate-400 text-lg">
          Vaš upit je uspešno poslat.
        </p>
      </div>
      <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 text-left space-y-3 shadow-2xl">
        <div className="flex justify-between">
          <span className="text-slate-500 text-sm">Paket:</span>
          <span className="text-white font-bold">{booking.package.duration}h - {booking.package.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 text-sm">Datum i vreme:</span>
          <span className="text-white font-bold">{booking.date} @ {booking.time}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 text-sm">Teren:</span>
          <span className="text-white font-bold">{booking.terrain.name}</span>
        </div>
        <div className="flex justify-between border-t border-white/5 pt-3 mt-3">
          <span className="text-slate-500 text-sm">Cena:</span>
          <span className="text-padel-blue font-black text-xl">{booking.package.price}</span>
        </div>
      </div>
      <Link
        href="/"
        className="inline-block px-10 py-4 bg-padel-blue text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95 transform"
      >
        Povratak na početnu
      </Link>
    </div>
  );
}
