export default function DateStep({
  selectedDate,
  onSelect,
  isLoading
}: {
  selectedDate: string;
  onSelect: (date: string) => void;
  isLoading: boolean;
}) {
  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        full: d.toISOString().split('T')[0],
        day: d.toLocaleDateString('sr-RS', { weekday: 'short' }),
        date: d.getDate(),
        month: d.toLocaleDateString('sr-RS', { month: 'short' }),
      });
    }
    return days;
  };

  const days = getNextDays();

  const handleSelect = (date: string) => {
    if (isLoading) return;
    onSelect(date);
  };

  return (
    <div className="space-y-8 animate-step-in">
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4 uppercase">Kad igraš?</h2>
        <p className="text-slate-400">Izaberi dan. Slobodne terene proveravamo odmah.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 max-w-5xl mx-auto">
        {days.map((day) => (
          <button
            key={day.full}
            onClick={() => handleSelect(day.full)}
            disabled={isLoading}
            className={`p-4 rounded-2xl border bg-slate-900/50 border-white/5 text-slate-400 hover:border-padel-blue/30 hover:bg-slate-900 transition-all duration-300 flex flex-col items-center group shadow-md active:scale-95 transform disabled:opacity-50 disabled:cursor-not-allowed ${selectedDate === day.full ? 'border-padel-blue bg-slate-900 text-white' : ''
              }`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{day.day}</span>
            <span className={`text-2xl font-display font-black leading-none mb-1 transition-colors ${selectedDate === day.full ? 'text-padel-blue' : 'group-hover:text-padel-blue'
              }`}>{day.date}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {isLoading && selectedDate === day.full ? (
                <span className="inline-block animate-spin">...</span>
              ) : day.month}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
