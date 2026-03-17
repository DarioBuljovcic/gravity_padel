"use client";

import { useActionState, useEffect } from "react";
import { createReservationAction } from "@/lib/actions/reservation.actions";

export default function DetailsStep({ 
  booking, 
  setBooking, 
  prevStep,
  onSuccess
}: { 
  booking: any, 
  setBooking: (b: any) => void, 
  prevStep: () => void,
  onSuccess: () => void
}) {
  const [state, action, isPending] = useActionState(createReservationAction, null);
  
  useEffect(() => {
    if (state?.success) {
      onSuccess();
    }
  }, [state, onSuccess]);

  return (
    <div className="space-y-8 max-w-xl mx-auto animate-step-in">
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4 uppercase">Vaši Podaci</h2>
        <p className="text-slate-400">Ostavite nam svoje podatke za potvrdu rezervacije</p>
      </div>
      
      <form action={action} className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-xl space-y-4 shadow-2xl">
        {/* Hidden inputs for booking context */}
        <input type="hidden" name="date" value={booking.date} />
        <input type="hidden" name="terrain_id" value={booking.terrain.id} />
        <input type="hidden" name="start_time" value={booking.time} />
        <input type="hidden" name="duration" value={booking.package.duration} />
        <input type="hidden" name="price" value={booking.package.price} />
        <input type="hidden" name="package_type" value={booking.package.type} />

        {state?.error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-bold text-center animate-fade-in">
            {state.error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-2">Ime i prezime</label>
          <input
            required
            name="name"
            type="text"
            placeholder="Vaše ime"
            onChange={(e) => setBooking({ ...booking, name: e.target.value })}
            className="w-full bg-slate-800 text-white p-4 rounded-xl border border-white/10 focus:border-padel-blue outline-none font-bold transition-all focus:ring-1 focus:ring-padel-blue"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-2">Telefon</label>
          <input
            required
            name="phone"
            type="tel"
            placeholder="06x xxx xxxx"
            onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
            className="w-full bg-slate-800 text-white p-4 rounded-xl border border-white/10 focus:border-padel-blue outline-none font-bold transition-all focus:ring-1 focus:ring-padel-blue"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-2">Email</label>
          <input
            required
            name="email"
            type="email"
            placeholder="vas@email.com"
            onChange={(e) => setBooking({ ...booking, email: e.target.value })}
            className="w-full bg-slate-800 text-white p-4 rounded-xl border border-white/10 focus:border-padel-blue outline-none font-bold transition-all focus:ring-1 focus:ring-padel-blue"
          />
        </div>
        <button
          disabled={isPending}
          type="submit"
          className="w-full mt-8 py-5 bg-primary-orange text-slate-950 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-primary-orange/20 active:scale-95 transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Slanje..." : "Pošalji Upit"}
        </button>
        
        <button 
          type="button" 
          onClick={prevStep} 
          className="w-full mt-4 text-slate-500 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors"
        >
          Nazad
        </button>
      </form>
    </div>
  );
}
