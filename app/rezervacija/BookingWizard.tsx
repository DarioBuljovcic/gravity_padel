"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  bookingPackages,
  courts,
  formatPrice,
  generateTimeSlots,
  getPackage,
  getVenueDate,
  VENUE_TIME_ZONE,
  type BusySlot,
  type ReservationInput,
} from "@/lib/reservations/domain";
import {
  createReservation,
  getBusySlots,
} from "@/lib/actions/reservation.actions";

type BookingWizardProps = {
  defaultName: string;
  defaultPhone: string;
  defaultEmail: string;
  defaultPackageId?: string;
  defaultCourtId?: number;
  isAuthenticated: boolean;
};

type Draft = ReservationInput;

function minutes(value: string): number {
  const [hours, mins] = value.split(":").map(Number);
  return hours * 60 + mins;
}

function venueMinutes(iso: string): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: VENUE_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return Number(values.hour) * 60 + Number(values.minute);
}

export default function BookingWizard({
  defaultName,
  defaultPhone,
  defaultEmail,
  defaultPackageId,
  defaultCourtId,
  isAuthenticated,
}: BookingWizardProps) {
  const initialPackage = getPackage(defaultPackageId ?? "") ?? bookingPackages[0];
  const [step, setStep] = useState(defaultPackageId ? 2 : 1);
  const [draft, setDraft] = useState<Draft>({
    packageId: initialPackage.id,
    date: getVenueDate(),
    time: "",
    courtId: defaultCourtId && defaultCourtId >= 1 && defaultCourtId <= 4 ? defaultCourtId : 1,
    name: defaultName,
    phone: defaultPhone,
    email: defaultEmail,
  });
  const [busySlots, setBusySlots] = useState<BusySlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const selectedPackage = getPackage(draft.packageId) ?? bookingPackages[0];

  useEffect(() => {
    if (step !== 4) return;
    let active = true;
    getBusySlots(draft.date, draft.courtId).then((slots) => {
      if (active) {
        setBusySlots(slots);
        setLoadingSlots(false);
      }
    });
    return () => {
      active = false;
    };
  }, [draft.courtId, draft.date, step]);

  const days = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => {
        const value = getVenueDate(index);
        const displayDate = new Date(`${value}T12:00:00Z`);
        return {
          value,
          weekday: displayDate.toLocaleDateString("sr-RS", { weekday: "short", timeZone: "UTC" }),
          day: displayDate.getUTCDate(),
          month: displayDate.toLocaleDateString("sr-RS", { month: "short", timeZone: "UTC" }),
          available: generateTimeSlots(selectedPackage, value).length > 0,
        };
      }),
    [selectedPackage],
  );

  function isBusy(time: string): boolean {
    const start = minutes(time);
    const end = start + selectedPackage.durationMinutes;
    return busySlots.some((busy) => {
      const busyStart = venueMinutes(busy.starts_at);
      const busyEnd = venueMinutes(busy.ends_at);
      return start < busyEnd && end > busyStart;
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await createReservation(draft);
    setSubmitting(false);
    if (!result.success) {
      setError(result.error);
      if (result.type === "conflict") {
        setLoadingSlots(true);
        setStep(4);
      }
      return;
    }
    setReservationId(result.reservationId);
    setStep(6);
  }

  const buttonClass =
    "rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-left text-white transition hover:border-padel-blue/60 hover:bg-slate-900";

  return (
    <div className="mx-auto max-w-6xl">
      {step < 6 && (
        <div className="mb-10 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className={`h-1.5 rounded-full transition-all ${item === step ? "w-12 bg-padel-blue" : item < step ? "w-8 bg-primary-orange" : "w-8 bg-slate-800"}`}
            />
          ))}
        </div>
      )}

      {step === 1 && (
        <section>
          <StepHeading title="Izaberite paket" subtitle="Odaberite trajanje i period igre." />
          <div className="grid gap-4 md:grid-cols-2">
            {bookingPackages.map((item) => (
              <button
                key={item.id}
                className={buttonClass}
                onClick={() => {
                  setDraft((current) => ({ ...current, packageId: item.id, time: "" }));
                  setStep(2);
                }}
              >
                <span className="block text-lg font-black">{item.label} · {item.period}</span>
                <span className="text-sm text-slate-400">{item.rangeStart}–{item.rangeEnd}</span>
                <span className="mt-2 block text-padel-blue">{formatPrice(item.priceAmount)}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 2 && (
        <section>
          <StepHeading title="Izaberite datum" subtitle="Rezervacije su otvorene za narednih 14 dana." />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
            {days.map((day) => (
              <button
                key={day.value}
                disabled={!day.available}
                className={`${buttonClass} disabled:cursor-not-allowed disabled:opacity-30`}
                onClick={() => {
                  setDraft((current) => ({ ...current, date: day.value, time: "" }));
                  setStep(3);
                }}
              >
                <span className="block text-xs uppercase text-slate-500">{day.weekday}</span>
                <span className="block text-2xl font-black">{day.day}</span>
                <span className="text-xs uppercase text-slate-400">{day.month}</span>
              </button>
            ))}
          </div>
          <Back onClick={() => setStep(1)} />
        </section>
      )}

      {step === 3 && (
        <section>
          <StepHeading title="Izaberite teren" subtitle="Dostupnost vremena se prikazuje za izabrani teren." />
          <div className="grid gap-4 sm:grid-cols-2">
            {courts.map((court) => (
              <button
                key={court.id}
                className={buttonClass}
                onClick={() => {
                  setDraft((current) => ({ ...current, courtId: court.id, time: "" }));
                  setLoadingSlots(true);
                  setStep(4);
                }}
              >
                <span className="block text-xl font-black">{court.name}</span>
                <span className="text-sm text-slate-400">{court.description}</span>
              </button>
            ))}
          </div>
          <Back onClick={() => setStep(2)} />
        </section>
      )}

      {step === 4 && (
        <section>
          <StepHeading title="Izaberite vreme" subtitle={loadingSlots ? "Učitavanje dostupnosti…" : "Zauzeti termini nisu dostupni."} />
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {generateTimeSlots(selectedPackage, draft.date).map((time) => {
              const unavailable = loadingSlots || isBusy(time);
              return (
                <button
                  key={time}
                  disabled={unavailable}
                  className={`${buttonClass} text-center font-bold disabled:cursor-not-allowed disabled:opacity-30`}
                  onClick={() => {
                    setDraft((current) => ({ ...current, time }));
                    setError(null);
                    setStep(5);
                  }}
                >
                  {time}
                </button>
              );
            })}
          </div>
          {error && <p className="mt-5 text-center text-red-400">{error}</p>}
          <Back onClick={() => setStep(3)} />
        </section>
      )}

      {step === 5 && (
        <section className="mx-auto max-w-xl">
          <StepHeading title="Vaši podaci" subtitle="Podaci služe za potvrdu i upravljanje rezervacijom." />
          <form onSubmit={submit} className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-8">
            <ContactInput label="Ime i prezime" value={draft.name} onChange={(name) => setDraft((current) => ({ ...current, name }))} />
            <ContactInput label="Telefon" type="tel" value={draft.phone} onChange={(phone) => setDraft((current) => ({ ...current, phone }))} />
            <ContactInput label="Email" type="email" value={draft.email} onChange={(email) => setDraft((current) => ({ ...current, email }))} />
            {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
            <button disabled={submitting} className="w-full rounded-xl bg-primary-orange py-4 font-black uppercase text-slate-950 disabled:opacity-50">
              {submitting ? "Čuvanje…" : "Rezerviši"}
            </button>
            <Back onClick={() => setStep(4)} disabled={submitting} />
          </form>
        </section>
      )}

      {step === 6 && (
        <section className="mx-auto max-w-xl text-center">
          <div className="mb-6 text-6xl text-primary-orange">✓</div>
          <StepHeading title="Termin je rezervisan" subtitle="Vidimo se na terenu!" />
          <div className="mb-6 rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-left text-slate-300">
            <p>{draft.date} u {draft.time}</p>
            <p>{courts.find((court) => court.id === draft.courtId)?.name}</p>
            <p>{selectedPackage.label} · {formatPrice(selectedPackage.priceAmount)}</p>
            {reservationId && <p className="mt-3 text-xs text-slate-500">Broj: {reservationId}</p>}
          </div>
          {!isAuthenticated && (
            <div className="mb-6 rounded-2xl border border-padel-blue/30 bg-padel-blue/10 p-5">
              <p className="mb-3 text-sm text-slate-200">Napravite nalog da upravljate budućim rezervacijama i brže rezervišete ponovo.</p>
              <Link href="/signup" className="font-bold text-padel-blue hover:underline">Napravi nalog</Link>
            </div>
          )}
          <Link href="/" className="inline-block rounded-full bg-padel-blue px-8 py-3 font-black uppercase text-white">Početna</Link>
        </section>
      )}
    </div>
  );
}

function StepHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8 text-center">
      <h1 className="font-display text-3xl font-black uppercase text-white md:text-5xl">{title}</h1>
      <p className="mt-2 text-slate-400">{subtitle}</p>
    </div>
  );
}

function Back({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} className="mt-6 w-full text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white disabled:opacity-50">
      Nazad
    </button>
  );
}

function ContactInput({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-xs font-black uppercase tracking-widest text-slate-500">
      {label}
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 p-4 text-base font-medium normal-case tracking-normal text-white outline-none focus:border-padel-blue"
      />
    </label>
  );
}
