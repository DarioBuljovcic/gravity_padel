"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import DateStep from './_components/DateStep';
import TerrainStep from './_components/TerrainStep';
import PackageStep from './_components/PackageStep';
import TimeStep from './_components/TimeStep';
import DetailsStep from './_components/DetailsStep';
import ConfirmationStep from './_components/ConfirmationStep';
import { getTerrainAvailability, getBookedSlots } from '@/lib/reservations.queries';

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [booking, setBooking] = useState({
    date: '',
    terrain: null as any,
    package: null as any,
    time: '',
    name: '',
    phone: '',
    email: '',
  });

  const [terrainAvailability, setTerrainAvailability] = useState<any[]>([]);
  const [bookedSlots, setBookedSlots] = useState<any[]>([]);

  // Effect 1: Date selected -> Fetch terrain availability & Advance to Step 2
  useEffect(() => {
    if (currentStep === 1 && booking.date) {
      setIsLoading(true);
      getTerrainAvailability(booking.date)
        .then((result) => {
          setTerrainAvailability(result);
          setCurrentStep(2);
        })
        .finally(() => setIsLoading(false));
    }
  }, [booking.date]);

  // Effect 2: Terrain selected -> Advance to Step 3
  useEffect(() => {
    if (currentStep === 2 && booking.terrain) {
      setCurrentStep(3);
    }
  }, [booking.terrain]);

  // Effect 3: Package selected -> Fetch booked slots & Advance to Step 4
  useEffect(() => {
    if (currentStep === 3 && booking.package) {
      setIsLoading(true);
      getBookedSlots(booking.date, booking.terrain.id)
        .then((result) => {
          setBookedSlots(result);
          setCurrentStep(4);
        })
        .finally(() => setIsLoading(false));
    }
  }, [booking.package]);

  // Effect 4: Time selected -> Advance to Step 5
  useEffect(() => {
    if (currentStep === 4 && booking.time) {
      setCurrentStep(5);
    }
  }, [booking.time]);

  const prevStep = () => setCurrentStep((s) => s - 1);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <DateStep 
            booking={booking} 
            setBooking={setBooking} 
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <TerrainStep 
            booking={booking} 
            setBooking={setBooking} 
            prevStep={prevStep}
            terrainAvailability={terrainAvailability}
          />
        );
      case 3:
        return (
          <PackageStep 
            booking={booking} 
            setBooking={setBooking} 
            prevStep={prevStep}
            isLoading={isLoading}
          />
        );
      case 4:
        return (
          <TimeStep 
            booking={booking} 
            setBooking={setBooking} 
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
          {/* Progress Indicator */}
          {currentStep < 6 && (
            <div className="flex justify-center mb-12 gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    s === currentStep 
                      ? 'w-12 bg-padel-blue scale-x-110' 
                      : s < currentStep 
                        ? 'w-8 bg-primary-orange' 
                        : 'w-8 bg-slate-800'
                    }`}
                />
              ))}
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
