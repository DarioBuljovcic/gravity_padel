'use client';

import { useState, useEffect } from "react";
import { getReservations, cancelReservation } from "@/lib/actions/reservation.actions";
import { FadeIn } from "@/components/FadeIn";

export default function ReservationsTab() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    setLoading(true);
    const data = await getReservations();
    setReservations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (id: string) => {
    if (confirm("Da li ste sigurni da želite da otkažete ovu rezervaciju?")) {
      const res = await cancelReservation(id);
      if (res.success) {
        fetchReservations();
      } else {
        alert("Greška prilikom otkazivanja.");
      }
    }
  };

  if (loading) {
    return <div className="text-white text-center py-10">Učitavanje rezervacija...</div>;
  }

  return (
    <FadeIn className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-white/10 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-widest">Sve Rezervacije</h2>
          <p className="text-slate-400 text-sm mt-1">Pregled i upravljanje terminima</p>
        </div>
      </div>

      <div className="space-y-4">
        {reservations.length === 0 ? (
          <p className="text-slate-400 text-center py-10">Nema pronađenih rezervacija.</p>
        ) : (
          reservations.map((res) => (
            <div key={res.id} className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white font-bold text-lg">{res.name}</span>
                  <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                    res.status === 'cancelled' 
                      ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                      : 'bg-green-500/10 text-green-500 border border-green-500/20'
                  }`}>
                    {res.status === 'cancelled' ? 'Otkazano' : 'Aktivno'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-400">
                  <div><strong className="text-slate-300">Telefon:</strong> {res.phone}</div>
                  <div><strong className="text-slate-300">Email:</strong> {res.email}</div>
                  <div><strong className="text-slate-300">Datum:</strong> {res.date} @ {res.time}</div>
                  <div><strong className="text-slate-300">Teren:</strong> {res.terrain?.name || 'N/A'}</div>
                  <div><strong className="text-slate-300">Paket:</strong> {res.package_details?.duration} ({res.package_details?.type}) - {res.package_details?.price}</div>
                </div>
              </div>
              {res.status !== 'cancelled' && (
                <button
                  onClick={() => handleCancel(res.id)}
                  className="px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl font-black uppercase tracking-widest text-xs transition-all w-full md:w-auto text-center"
                >
                  Otkaži
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </FadeIn>
  );
}
