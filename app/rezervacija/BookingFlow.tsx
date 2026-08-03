"use client";

import { useEffect, useMemo, useState, type ComponentType, type FormEvent } from "react";
import {
  bookingPackages,
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
import type {
  BookingMode,
  CourtStepProps,
  DateStepProps,
  DetailsStepProps,
  PackageStepProps,
  StepProgressProps,
  SuccessStepProps,
  TimeStepProps,
} from "./BookingSteps";

type Draft = ReservationInput;

export type BookingFlowProps = {
  defaultName: string;
  defaultPhone: string;
  defaultEmail: string;
  defaultPackageId?: string;
  defaultCourtId?: number;
  isAuthenticated: boolean;
  mode?: BookingMode;
  PackageStep: ComponentType<PackageStepProps>;
  DateStep: ComponentType<DateStepProps>;
  CourtStep: ComponentType<CourtStepProps>;
  TimeStep: ComponentType<TimeStepProps>;
  DetailsStep: ComponentType<DetailsStepProps>;
  SuccessStep: ComponentType<SuccessStepProps>;
  StepProgress: ComponentType<StepProgressProps>;
};

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

export default function BookingFlow({
  defaultName,
  defaultPhone,
  defaultEmail,
  defaultPackageId,
  defaultCourtId,
  isAuthenticated,
  mode = "public",
  PackageStep,
  DateStep,
  CourtStep,
  TimeStep,
  DetailsStep,
  SuccessStep,
  StepProgress,
}: BookingFlowProps) {
  const initialPackage = getPackage(defaultPackageId ?? "") ?? bookingPackages[0];
  const prefilledCourtId =
    defaultCourtId && defaultCourtId >= 1 && defaultCourtId <= 4 ? defaultCourtId : undefined;
  const [step, setStep] = useState(defaultPackageId ? 2 : 1);
  const [draft, setDraft] = useState<Draft>({
    packageId: initialPackage.id,
    date: getVenueDate(),
    time: "",
    courtId: prefilledCourtId ?? 1,
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

  async function submit(event: FormEvent<HTMLFormElement>) {
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

  return (
    <div className="mx-auto max-w-6xl">
      {step < 6 && <StepProgress step={step} />}

      {step === 1 && (
        <PackageStep
          onSelect={(packageId) => {
            setDraft((current) => ({ ...current, packageId, time: "" }));
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <DateStep
          days={days}
          onSelect={(date) => {
            setDraft((current) => ({ ...current, date, time: "" }));
            if (prefilledCourtId) {
              setLoadingSlots(true);
              setStep(4);
              return;
            }
            setStep(3);
          }}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <CourtStep
          onSelect={(courtId) => {
            setDraft((current) => ({ ...current, courtId, time: "" }));
            setLoadingSlots(true);
            setStep(4);
          }}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <TimeStep
          selectedPackage={selectedPackage}
          date={draft.date}
          loadingSlots={loadingSlots}
          error={error}
          isBusy={isBusy}
          onSelect={(time) => {
            setDraft((current) => ({ ...current, time }));
            setError(null);
            setStep(5);
          }}
          onBack={() => setStep(prefilledCourtId ? 2 : 3)}
        />
      )}

      {step === 5 && (
        <DetailsStep
          draft={draft}
          error={error}
          submitting={submitting}
          onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))}
          onSubmit={submit}
          onBack={() => setStep(4)}
        />
      )}

      {step === 6 && (
        <SuccessStep
          draft={draft}
          selectedPackage={selectedPackage}
          reservationId={reservationId}
          isAuthenticated={isAuthenticated}
          mode={mode}
        />
      )}
    </div>
  );
}
