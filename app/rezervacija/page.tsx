"use client";

import { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import DateStep from './_components/DateStep';
import TerrainStep from './_components/TerrainStep';
import PackageStep from './_components/PackageStep';
import TimeStep from './_components/TimeStep';
import DetailsStep from './_components/DetailsStep';
import ConfirmationStep from './_components/ConfirmationStep';
import { getTerrainAvailability, getBookedSlots } from '@/lib/reservations.queries';
import type { Booking, BookingPackage, BookedSlot, Terrain, TerrainAvailability } from './_components/types';

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [booking, setBooking] = useState<Booking>({
    date: '',
    terrain: null,
    package: null,
    time: '',
    name: '',
    phone: '',
    email: '',
  });

  const [terrainAvailability, setTerrainAvailability] = useState<TerrainAvailability[]>([]);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);

  const handleDateSelect = async (date: string) => {
    setBooking((prev) => ({
      ...prev,
      date,
      terrain: null,
      package: null,
      time: '',
    }));
    setIsLoading(true);
    try {
      const result = await getTerrainAvailability(date);
      setTerrainAvailability(result);
      setCurrentStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerrainSelect = (terrain: Terrain) => {
    setBooking((prev) => ({
      ...prev,
      terrain,
      package: null,
      time: '',
    }));
    setBookedSlots([]);
    setCurrentStep(3);
  };

  const handlePackageSelect = async (item: Omit<BookingPackage, "type">, type: string) => {
    if (!booking.terrain) return;

    const selectedPackage: BookingPackage = { ...item, type };
    setBooking((prev) => ({
      ...prev,
      package: selectedPackage,
      time: '',
    }));
    setIsLoading(true);
    try {
      const result = await getBookedSlots(booking.date, booking.terrain.id);
      setBookedSlots(result);
      setCurrentStep(4);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeSelect = (time: string) => {
    setBooking((prev) => ({ ...prev, time }));
    setCurrentStep(5);
  };

  const prevStep = () => setCurrentStep((s) => s - 1);

  const bookingSummary = [
    booking.date
      ? { label: 'Datum', value: new Date(booking.date).toLocaleDateString('sr-RS') }
      : null,
    booking.terrain
      ? { label: 'Teren', value: booking.terrain.name }
      : null,
    booking.package
      ? { label: 'Paket', value: `${booking.package.durationLabel} • ${booking.package.price}` }
      : null,
    booking.time
      ? { label: 'Vreme', value: booking.time }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <DateStep
            selectedDate={booking.date}
            onSelect={handleDateSelect}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <TerrainStep
            onSelect={handleTerrainSelect}
            prevStep={prevStep}
            terrainAvailability={terrainAvailability}
          />
        );
      case 3:
        return (
          <PackageStep
            booking={booking}
            onSelect={handlePackageSelect}
            prevStep={prevStep}
            isLoading={isLoading}
          />
        );
      case 4:
        return (
          <TimeStep
            booking={booking}
            onSelect={handleTimeSelect}
            prevStep={prevStep}
            bookedSlots={bookedSlots}
          />
        );
      case 5:
        return (
          <DetailsStep
            booking={booking}
            setBooking={setBooking}
            prevStep={prevStep}
            onSuccess={() => setCurrentStep(6)}
          />
        );
      case 6:
        return <ConfirmationStep booking={booking} />;
      default:
        return null;
    }
  };

  return (
    <main className="bg-slate-950 min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="relative pt-32 pb-20 px-4 md:px-6">
        {/* Decorative Gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-padel-blue/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary-orange/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary-orange mb-4">
              Bez poziva. Bez čekanja.
            </p>
            <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-white mb-4">
              Rezervacija ide brzo kad znaš šta želiš.
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
              Prođi korak po korak, izaberi najbolji termin pre nego što ga uzme neko drugi i završi sve za manje od jednog minuta.
            </p>
          </div>

          {/* Progress Indicator */}
          {currentStep < 6 && (
            <div className="flex justify-center mb-12 gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-500 ${s === currentStep
                      ? 'w-12 bg-padel-blue scale-x-110'
                      : s < currentStep
                        ? 'w-8 bg-primary-orange'
                        : 'w-8 bg-slate-800'
                    }`}
                />
              ))}
            </div>
          )}

          {bookingSummary.length > 0 && currentStep < 6 && (
            <div className="mb-10 rounded-[2rem] border border-white/5 bg-slate-900/50 px-5 py-5 shadow-xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500 mb-2">
                    Tvoj izbor do sada
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {bookingSummary.map((item) => (
                      <span
                        key={item.label}
                        className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs font-bold text-slate-300"
                      >
                        <span className="text-slate-500">{item.label}:</span> {item.value}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-sm font-medium text-slate-400 md:max-w-xs md:text-right">
                  Još samo malo. Svaki korak te vodi do slobodnog termina koji možeš da potvrdiš odmah.
                </p>
              </div>
            </div>
          )}

          <div className="relative isolate overflow-hidden min-h-[400px]">
            {renderStep()}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
