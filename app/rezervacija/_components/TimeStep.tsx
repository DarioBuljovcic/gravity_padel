"use client";

import type { Booking, BookedSlot } from "./types";

export default function TimeStep({ 
  booking, 
  onSelect,
  prevStep,
  bookedSlots 
}: { 
  booking: Booking,
  onSelect: (time: string) => void,
  prevStep: () => void,
  bookedSlots: BookedSlot[]
}) {
  const getTimeSlots = () => {
    const slots = [];
    const { duration, range } = booking.package;
    const [startRange, endRange] = range.split(' - ');
    const startHour = parseInt(startRange.split(':')[0]);
    const endHour = parseInt(endRange.split(':')[0]);
    const dur = parseFloat(duration);

    // Convert booked slots to minutes for easy comparison
    const bookedRanges = bookedSlots.map((slot) => {
      const [sh, sm] = slot.start_time.split(':').map(Number);
      const [eh, em] = slot.end_time.split(':').map(Number);
      return { start: sh * 60 + sm, end: eh * 60 + em };
    });

    for (let hour = startHour; hour < endHour; hour += 0.5) {
      const h = Math.floor(hour);
      const m = (hour % 1) * 60;
      const timeStr = `${h.toString().padStart(2, '0')}:${m === 0 ? '00' : '30'}`;
      
      const slotStart = h * 60 + m;
      const slotEnd = slotStart + dur * 60;

      if (hour + dur <= endHour) {
        const isTaken = bookedRanges.some(b => 
          slotStart < b.end && slotEnd > b.start
        );
        slots.push({ time: timeStr, isTaken });
      }
    }
    return slots;
  };

  const slots = getTimeSlots();

  const handleSelect = (time: string) => {
    onSelect(time);
  };

  return (
    <div className="space-y-8 animate-step-in">
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4 uppercase">Ovo su slobodni termini</h2>
        <p className="text-slate-400">Izaberi vreme pre nego što ga uzme neko drugi.</p>
      </div>
      {slots.length === 0 ? (
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="text-lg font-black text-white mb-3">Za ovaj izbor nema slobodnih termina.</p>
          <p className="text-sm font-medium text-slate-400">
            Vrati se korak nazad i uzmi sledeću najbolju opciju.
          </p>
        </div>
      ) : (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-w-4xl mx-auto">
        {slots.map(({ time, isTaken }) => (
          <div key={time} className="relative">
            {isTaken && (
              <div className="absolute -top-2 -right-1 z-10 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-lg transform rotate-12">
                OTIŠLO
              </div>
            )}
            <button
              onClick={() => !isTaken && handleSelect(time)}
              disabled={isTaken}
              className={`w-full py-4 rounded-xl border font-bold transition-all duration-300 shadow-sm text-center block ${
                isTaken
                  ? 'bg-slate-950 border-white/5 text-slate-700 cursor-not-allowed opacity-50'
                  : 'bg-slate-900/50 border-white/5 text-slate-400 hover:border-padel-blue/30 hover:bg-slate-900 active:scale-95 transform'
              }`}
            >
              {time}
            </button>
          </div>
        ))}
      </div>
      )}
      <div className="text-center">
        <button 
          onClick={prevStep} 
          className="inline-block mt-8 text-slate-500 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors"
        >
          Nazad na paket
        </button>
      </div>
    </div>
  );
}
