import ReservationStatistics from "./_components/ReservationStatistics";

export default function StatisticsTab() {
  return (
    <section className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-2 rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-widest text-white">
            Statistika
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Pregled rezervacija za tekući mesec
          </p>
        </div>
      </div>

      <ReservationStatistics />
    </section>
  );
}
