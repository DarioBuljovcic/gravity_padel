"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const pricingData = {
  workingDays: {
    title: "Radni Dani",
    items: [
      { duration: "1h", time: "Pre podne", range: "08:00 - 16:00", price: "1900 din" },
      { duration: "1h", time: "Posle podne", range: "16:00 - 23:00", price: "2400 din" },
      { duration: "1.5h", time: "Pre podne", range: "08:00 - 16:00", price: "2850 din" },
      { duration: "1.5h", time: "Posle podne", range: "16:00 - 23:00", price: "3600 din" },
      { duration: "2h", time: "Pre podne", range: "08:00 - 16:00", price: "3500 din" },
      { duration: "2h", time: "Posle podne", range: "16:00 - 23:00", price: "4400 din" }
    ]
  },
  weekend: {
    title: "Vikend",
    items: [
      { duration: "1h", time: "Ceo dan", range: "08:00 - 23:00", price: "2400 din" },
      { duration: "1.5h", time: "Ceo dan", range: "08:00 - 23:00", price: "3600 din" },
      { duration: "2h", time: "Ceo dan", range: "08:00 - 23:00", price: "4400 din" }
    ]
  }
};

const terrains = [
  { id: 1, name: "Teren 1", description: "Panoramic WPT Standard" },
  { id: 2, name: "Teren 2", description: "Panoramic WPT Standard" },
  { id: 3, name: "Teren 3", description: "Panoramic WPT Standard" },
  { id: 4, name: "Teren 4", description: "Panoramic WPT Standard" },
];

interface Package {
  duration: string;
  time: string;
  range: string;
  price: string;
  type?: string;
}

interface Terrain {
  id: number;
  name: string;
  description: string;
}

interface BookingData {
  package: Package | null;
  date: string;
  time: string;
  terrain: Terrain | null;
  name: string;
  phone: string;
  email: string;
}

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    package: null,
    date: new Date().toISOString().split('T')[0],
    time: '',
    terrain: null,
    name: '',
    phone: '',
    email: '',
  });

  // Re-trigger animation when step changes
  const Animate = () => {
    console.log("Hello")
    setAnimating(true);
    const timer = setTimeout(() => setAnimating(false), 500);
    return () => clearTimeout(timer);
  }

  const nextStep = () => { Animate(); setStep(s => s + 1); }
  const prevStep = () => { Animate(); setStep(s => s - 1); }

  const handlePackageSelect = (item: any) => {
    setBookingData({ ...bookingData, package: item });
    nextStep();
  };

  const handleDateSelect = (date: string) => {
    setBookingData({ ...bookingData, date });
    nextStep();
  };

  const handleTimeSelect = (time: string) => {
    setBookingData({ ...bookingData, time });
    nextStep();
  };

  const handleTerrainSelect = (terrain: any) => {
    setBookingData({ ...bookingData, terrain: terrain });
    nextStep();
  };

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

  const getTimeSlots = () => {
    if (!bookingData.package) return [];

    const slots = [];
    const range = bookingData.package.range.split(' - ');
    const startHour = parseInt(range[0].split(':')[0]);
    const endHour = parseInt(range[1].split(':')[0]);
    const duration = parseFloat(bookingData.package.duration);

    for (let hour = startHour; hour < endHour; hour += 0.5) {
      const h = Math.floor(hour);
      const m = (hour % 1) * 60;
      const timeStr = `${h.toString().padStart(2, '0')}:${m === 0 ? '00' : '30'}`;

      if (hour + duration <= endHour) {
        slots.push(timeStr);
      }
    }
    return slots;
  };

  const stepClass = animating ? 'animate-step-in' : 'opacity-100';

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className={`space-y-8 ${stepClass}`}>
            <div className="text-center">
              <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4">IZABERITE PAKET</h2>
              <p className="text-slate-400">Pronađite termin koji vam najviše odgovara</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-padel-blue uppercase tracking-widest pl-2">Radni Dani</h3>
                {pricingData.workingDays.items.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handlePackageSelect({ ...item, type: 'Radni Dan' })}
                    className="w-full text-left p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-padel-blue/50 hover:bg-slate-900 transition-all duration-300 group shadow-lg active:scale-95 transform"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="block text-white font-bold text-lg">{item.duration} — {item.time}</span>
                        <span className="block text-slate-500 text-xs uppercase">{item.range}</span>
                      </div>
                      <span className="text-xl font-black text-white group-hover:text-padel-blue transition-colors">{item.price}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-primary-orange uppercase tracking-widest pl-2">Vikend</h3>
                {pricingData.weekend.items.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handlePackageSelect({ ...item, type: 'Vikend' })}
                    className="w-full text-left p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-primary-orange/50 hover:bg-slate-900 transition-all duration-300 group shadow-lg active:scale-95 transform"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="block text-white font-bold text-lg">{item.duration} — {item.time}</span>
                        <span className="block text-slate-500 text-xs uppercase">{item.range}</span>
                      </div>
                      <span className="text-xl font-black text-white group-hover:text-primary-orange transition-colors">{item.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className={`space-y-8 ${stepClass}`}>
            <div className="text-center">
              <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4">IZABERITE DATUM</h2>
              <p className="text-slate-400">Kada želite da igrate?</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 max-w-5xl mx-auto">
              {getNextDays().map((day) => (
                <button
                  key={day.full}
                  onClick={() => handleDateSelect(day.full)}
                  className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center group shadow-md active:scale-95 transform ${bookingData.date === day.full
                    ? 'bg-padel-blue border-transparent text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-900/50 border-white/5 text-slate-400 hover:border-padel-blue/30 hover:bg-slate-900'
                    }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{day.day}</span>
                  <span className="text-2xl font-display font-black leading-none mb-1">{day.date}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{day.month}</span>
                </button>
              ))}
            </div>
            <div className="text-center">
              <button onClick={prevStep} className="mt-8 text-slate-500 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors">
                Nazad
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className={`space-y-8 ${stepClass}`}>
            <div className="text-center">
              <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4">IZABERITE VREME</h2>
              <p className="text-slate-400">Pronađite slobodan termin</p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-w-4xl mx-auto">
              {getTimeSlots().map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`py-4 rounded-xl border font-bold transition-all duration-300 shadow-sm active:scale-95 transform ${bookingData.time === time
                    ? 'bg-padel-blue border-transparent text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-900/50 border-white/5 text-slate-400 hover:border-padel-blue/30 hover:bg-slate-900'
                    }`}
                >
                  {time}
                </button>
              ))}
            </div>
            <div className="text-center">
              <button onClick={prevStep} className="mt-8 text-slate-500 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors">
                Nazad
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className={`space-y-8 ${stepClass}`}>
            <div className="text-center">
              <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4">IZABERITE TEREN</h2>
              <p className="text-slate-400">Na kom terenu želite da pokažete svoje umeće?</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {terrains.map((terrain) => (
                <button
                  key={terrain.id}
                  onClick={() => handleTerrainSelect(terrain)}
                  className="group relative p-8 rounded-[2.5rem] bg-slate-900/50 border border-white/5 hover:border-padel-blue/50 hover:bg-slate-900 transition-all duration-300 text-left shadow-2xl hover:-translate-y-1 active:scale-95 transform"
                >
                  <div className="w-12 h-12 mb-6 rounded-xl bg-padel-blue/10 flex items-center justify-center text-padel-blue group-hover:bg-padel-blue group-hover:text-white transition-all">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-display font-black text-white">{terrain.name}</h3>
                  <p className="text-slate-500 text-sm">{terrain.description}</p>
                </button>
              ))}
            </div>
            <div className="text-center">
              <button onClick={prevStep} className="mt-8 text-slate-500 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors">
                Nazad
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className={`space-y-8 max-w-xl mx-auto ${stepClass}`}>
            <div className="text-center">
              <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4">VAŠI PODACI</h2>
              <p className="text-slate-400">Ostavite nam svoje podatke za potvrdu rezervacije</p>
            </div>
            <form className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-xl space-y-4 shadow-2xl" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-2">Ime i prezime</label>
                <input
                  required
                  type="text"
                  placeholder="Vaše ime"
                  className="w-full bg-slate-800 text-white p-4 rounded-xl border border-white/10 focus:border-padel-blue outline-none font-bold transition-all focus:ring-1 focus:ring-padel-blue"
                  value={bookingData.name}
                  onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-2">Telefon</label>
                <input
                  required
                  type="tel"
                  placeholder="06x xxx xxxx"
                  className="w-full bg-slate-800 text-white p-4 rounded-xl border border-white/10 focus:border-padel-blue outline-none font-bold transition-all focus:ring-1 focus:ring-padel-blue"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-2">Email</label>
                <input
                  required
                  type="email"
                  placeholder="vas@email.com"
                  className="w-full bg-slate-800 text-white p-4 rounded-xl border border-white/10 focus:border-padel-blue outline-none font-bold transition-all focus:ring-1 focus:ring-padel-blue"
                  value={bookingData.email}
                  onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full mt-8 py-5 bg-primary-orange text-slate-950 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-primary-orange/20 active:scale-95 transform"
              >
                Pošalji Upit
              </button>
              <button type="button" onClick={prevStep} className="w-full mt-4 text-slate-500 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors">
                Nazad
              </button>
            </form>
          </div>
        );
      case 6:
        return (
          <div className={`text-center space-y-8 max-w-lg mx-auto ${stepClass}`}>
            <div className="w-24 h-24 mx-auto rounded-full bg-primary-orange/10 flex items-center justify-center text-primary-orange border border-primary-orange/20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-4xl font-display font-black text-white mb-4">HVALA VAM!</h2>
              <p className="text-slate-400 text-lg">
                Vaš upit je uspešno poslat. Naš tim će vas kontaktirati u najkraćem roku za potvrdu termina.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 text-left space-y-3 shadow-2xl">
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">Paket:</span>
                <span className="text-white font-bold">{bookingData.package?.duration} - {bookingData.package?.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">Datum i vreme:</span>
                <span className="text-white font-bold">{bookingData.date} @ {bookingData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">Teren:</span>
                <span className="text-white font-bold">{bookingData.terrain?.name}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-3 mt-3">
                <span className="text-slate-500 text-sm">Cena:</span>
                <span className="text-padel-blue font-black text-xl">{bookingData.package?.price}</span>
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
      default:
        return null;
    }
  };

  return (
    <main className="bg-slate-950 min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="relative pt-32 pb-20 px-4 md:px-6">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-padel-blue/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary-orange/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto">
          {step < 6 && (
            <div className="flex justify-center mb-12 gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-500 ${s === step ? 'w-12 bg-padel-blue scale-x-110' : s < step ? 'w-8 bg-primary-orange' : 'w-8 bg-slate-800'
                    }`}
                />
              ))}
            </div>
          )}

          <div className="relative isolate overflow-hidden">
            {renderStep()}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
