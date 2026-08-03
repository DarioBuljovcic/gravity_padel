"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("Reservation");

  return (
    <section>
      <StepHeading title={t("packageTitle")} subtitle={t("packageSubtitle")} />
      <div className="grid gap-4 md:grid-cols-2">
        {bookingPackages.map((item) => (
          <button key={item.id} className={stepButtonClass} onClick={() => onSelect(item.id)}>
            <span className="block text-lg font-black">
              {item.label} · {item.id.startsWith("morning") ? t("periodMorning") : t("periodAfternoon")}
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
  const t = useTranslations("Reservation");

  return (
    <section>
      <StepHeading title={t("dateTitle")} subtitle={t("dateSubtitle")} />
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
  const t = useTranslations("Reservation");

  return (
    <section>
      <StepHeading title={t("courtTitle")} subtitle={t("courtSubtitle")} />
      <div className="grid gap-4 sm:grid-cols-2">
        {courts.map((court) => (
          <button key={court.id} className={stepButtonClass} onClick={() => onSelect(court.id)}>
            <span className="block text-xl font-black">{t("courtName", { id: court.id })}</span>
            <span className="text-sm text-slate-400">
              {court.id <= 2 ? t("courtDescOpen") : t("courtDescCovered")}
            </span>
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
  const t = useTranslations("Reservation");

  return (
    <section>
      <StepHeading
        title={t("timeTitle")}
        subtitle={loadingSlots ? t("timeLoading") : t("timeSubtitle")}
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
  const t = useTranslations("Reservation");

  return (
    <section className="mx-auto max-w-xl">
      <StepHeading title={t("detailsTitle")} subtitle={t("detailsSubtitle")} />
      <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-8">
        <ContactInput label={t("fullName")} value={draft.name} onChange={(name) => onChange({ name })} />
        <ContactInput label={t("phone")} type="tel" value={draft.phone} onChange={(phone) => onChange({ phone })} />
        <ContactInput label={t("email")} type="email" value={draft.email} onChange={(email) => onChange({ email })} />
        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}
        <button
          disabled={submitting}
          className="w-full rounded-xl bg-primary-orange py-4 font-black uppercase text-slate-950 disabled:opacity-50"
        >
          {submitting ? t("submitting") : t("submit")}
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
  const t = useTranslations("Reservation");
  const isAdmin = mode === "admin";

  return (
    <section className="mx-auto max-w-xl text-center">
      <div className="mb-6 text-6xl text-primary-orange">✓</div>
      <StepHeading title={t("successTitle")} subtitle={t("successSubtitle")} />
      <div className="mb-6 rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-left text-slate-300">
        <p>{t("successWhen", { date: draft.date, time: draft.time })}</p>
        <p>{t("courtName", { id: draft.courtId })}</p>
        <p>
          {selectedPackage.label} · {formatPrice(selectedPackage.priceAmount)}
        </p>
        {reservationId && (
          <p className="mt-3 text-xs text-slate-500">{t("reservationNumber", { id: reservationId })}</p>
        )}
      </div>
      {!isAdmin && !isAuthenticated && (
        <div className="mb-6 rounded-2xl border border-padel-blue/30 bg-padel-blue/10 p-5">
          <p className="mb-3 text-sm text-slate-200">
            {t.rich("guestPrompt", {
              phone: (chunks) => (
                <a href="tel:+381606558559" className="font-semibold text-padel-blue hover:underline">
                  {chunks}
                </a>
              ),
            })}
          </p>
          <Link href="/signup" className="font-bold text-padel-blue hover:underline">
            {t("createAccount")}
          </Link>
        </div>
      )}
      <Link
        href={isAdmin ? "/admin?tab=reservations" : "/"}
        className="inline-block rounded-full bg-padel-blue px-8 py-3 font-black uppercase text-white"
      >
        {isAdmin ? t("backToReservations") : t("home")}
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
