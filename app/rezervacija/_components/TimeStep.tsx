"use client";

export default function TimeStep({ 
  booking, 
  setBooking, 
  prevStep,
  bookedSlots 
}: { 
  booking: any, 
  setBooking: (b: any) => void, 
  prevStep: () => void,
  bookedSlots: any[]
}) {
  const getTimeSlots = () => {
    const slots = [];
    const { duration, range } = booking.package;
    const [startRange, endRange] = range.split(' - ');
    const startHour = parseInt(startRange.split(':')[0]);
    const endHour = parseInt(endRange.split(':')[0]);
    const dur = parseFloat(duration);

    // Convert booked slots to minutes for easy comparison
    const bookedRanges = bookedSlots.map(b => {
      const [sh, sm] = b.start_time.split(':').map(Number);
      const [eh, em] = b.end_time.split(':').map(Number);
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
    setBooking({ ...booking, time });
  };

  return (
    <div className="space-y-8 animate-step-in">
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4 uppercase">Izaberite Vreme</h2>
        <p className="text-slate-400">Pronađite slobodan termin za {new Date(booking.date).toLocaleDateString("sr-RS")} — Teren {booking.terrain.name}</p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-w-4xl mx-auto">
        {slots.map(({ time, isTaken }) => (
          <div key={time} className="relative">
            {isTaken && (
              <div className="absolute -top-2 -right-1 z-10 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-lg transform rotate-12">
                ZAUZETO
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
