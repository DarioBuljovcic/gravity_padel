"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import {
  bookingPackages,
  courts,
  formatPrice,
  generateTimeSlots,
  type BookingPackage,
  type ReservationInput,
} from "@/lib/reservations/domain";
import { Back, ContactInput, StepHeading, stepButtonClass } from "./booking-ui";

export type DayOption = {
  value: string;
  weekday: string;
  day: number;
  month: string;
  available: boolean;
};

export type PackageStepProps = {
  onSelect: (packageId: BookingPackage["id"]) => void;
};

export function PackageStep({ onSelect }: PackageStepProps) {
  return (
    <section>
      <StepHeading title="Izaberite paket" subtitle="Odaberite trajanje i period igre." />
      <div className="grid gap-4 md:grid-cols-2">
        {bookingPackages.map((item) => (
          <button key={item.id} className={stepButtonClass} onClick={() => onSelect(item.id)}>
            <span className="block text-lg font-black">
              {item.label} · {item.period}
            </span>
            <span className="text-sm text-slate-400">
              {item.rangeStart}–{item.rangeEnd}
            </span>
            <span className="mt-2 block text-padel-blue">{formatPrice(item.priceAmount)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export type DateStepProps = {
  days: DayOption[];
  onSelect: (date: string) => void;
  onBack: () => void;
};

export function DateStep({ days, onSelect, onBack }: DateStepProps) {
  return (
    <section>
      <StepHeading title="Izaberite datum" subtitle="Rezervacije su otvorene za narednih 14 dana." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
        {days.map((day) => (
          <button
            key={day.value}
            disabled={!day.available}
            className={`${stepButtonClass} disabled:cursor-not-allowed disabled:opacity-30`}
            onClick={() => onSelect(day.value)}
          >
            <span className="block text-xs uppercase text-slate-500">{day.weekday}</span>
            <span className="block text-2xl font-black">{day.day}</span>
            <span className="text-xs uppercase text-slate-400">{day.month}</span>
          </button>
        ))}
      </div>
      <Back onClick={onBack} />
    </section>
  );
}

export type CourtStepProps = {
  onSelect: (courtId: number) => void;
  onBack: () => void;
};

export function CourtStep({ onSelect, onBack }: CourtStepProps) {
  return (
    <section>
      <StepHeading title="Izaberite teren" subtitle="Dostupnost vremena se prikazuje za izabrani teren." />
      <div className="grid gap-4 sm:grid-cols-2">
        {courts.map((court) => (
          <button key={court.id} className={stepButtonClass} onClick={() => onSelect(court.id)}>
            <span className="block text-xl font-black">{court.name}</span>
            <span className="text-sm text-slate-400">{court.description}</span>
          </button>
        ))}
      </div>
      <Back onClick={onBack} />
    </section>
  );
}

export type TimeStepProps = {
  selectedPackage: BookingPackage;
  date: string;
  loadingSlots: boolean;
  error: string | null;
  isBusy: (time: string) => boolean;
  onSelect: (time: string) => void;
  onBack: () => void;
};

export function TimeStep({
  selectedPackage,
  date,
  loadingSlots,
  error,
  isBusy,
  onSelect,
  onBack,
}: TimeStepProps) {
  return (
    <section>
      <StepHeading
        title="Izaberite vreme"
        subtitle={loadingSlots ? "Učitavanje dostupnosti…" : "Zauzeti termini nisu dostupni."}
      />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {generateTimeSlots(selectedPackage, date).map((time) => {
          const unavailable = loadingSlots || isBusy(time);
          return (
            <button
              key={time}
              disabled={unavailable}
              className={`${stepButtonClass} text-center font-bold disabled:cursor-not-allowed disabled:opacity-30`}
              onClick={() => onSelect(time)}
            >
              {time}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-5 text-center text-red-400">{error}</p>}
      <Back onClick={onBack} />
    </section>
  );
}

export type DetailsStepProps = {
  draft: ReservationInput;
  error: string | null;
  submitting: boolean;
  onChange: (patch: Partial<Pick<ReservationInput, "name" | "phone" | "email">>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
};

export function DetailsStep({ draft, error, submitting, onChange, onSubmit, onBack }: DetailsStepProps) {
  return (
    <section className="mx-auto max-w-xl">
      <StepHeading title="Vaši podaci" subtitle="Podaci služe za potvrdu i upravljanje rezervacijom." />
      <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-8">
        <ContactInput label="Ime i prezime" value={draft.name} onChange={(name) => onChange({ name })} />
        <ContactInput label="Telefon" type="tel" value={draft.phone} onChange={(phone) => onChange({ phone })} />
        <ContactInput label="Email" type="email" value={draft.email} onChange={(email) => onChange({ email })} />
        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}
        <button
          disabled={submitting}
          className="w-full rounded-xl bg-primary-orange py-4 font-black uppercase text-slate-950 disabled:opacity-50"
        >
          {submitting ? "Čuvanje…" : "Rezerviši"}
        </button>
        <Back onClick={onBack} disabled={submitting} />
      </form>
    </section>
  );
}

export type BookingMode = "public" | "admin";

export type SuccessStepProps = {
  draft: ReservationInput;
  selectedPackage: BookingPackage;
  reservationId: string | null;
  isAuthenticated: boolean;
  mode?: BookingMode;
};

export function SuccessStep({
  draft,
  selectedPackage,
  reservationId,
  isAuthenticated,
  mode = "public",
}: SuccessStepProps) {
  const isAdmin = mode === "admin";

  return (
    <section className="mx-auto max-w-xl text-center">
      <div className="mb-6 text-6xl text-primary-orange">✓</div>
      <StepHeading title="Termin je rezervisan" subtitle="Vidimo se na terenu!" />
      <div className="mb-6 rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-left text-slate-300">
        <p>
          {draft.date} u {draft.time}
        </p>
        <p>{courts.find((court) => court.id === draft.courtId)?.name}</p>
        <p>
          {selectedPackage.label} · {formatPrice(selectedPackage.priceAmount)}
        </p>
        {reservationId && <p className="mt-3 text-xs text-slate-500">Broj: {reservationId}</p>}
      </div>
      {!isAdmin && !isAuthenticated && (
        <div className="mb-6 rounded-2xl border border-padel-blue/30 bg-padel-blue/10 p-5">
          <p className="mb-3 text-sm text-slate-200">
            Napravite nalog da upravljate budućim rezervacijama i brže rezervišete ponovo.
          </p>
          <Link href="/signup" className="font-bold text-padel-blue hover:underline">
            Napravi nalog
          </Link>
        </div>
      )}
      <Link
        href={isAdmin ? "/admin?tab=reservations" : "/"}
        className="inline-block rounded-full bg-padel-blue px-8 py-3 font-black uppercase text-white"
      >
        {isAdmin ? "Nazad na rezervacije" : "Početna"}
      </Link>
    </section>
  );
}

export type StepProgressProps = {
  step: number;
};

export function StepProgress({ step }: StepProgressProps) {
  return (
    <div className="mb-10 flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className={`h-1.5 rounded-full transition-all ${item === step ? "w-12 bg-padel-blue" : item < step ? "w-8 bg-primary-orange" : "w-8 bg-slate-800"}`}
        />
      ))}
    </div>
  );
}
