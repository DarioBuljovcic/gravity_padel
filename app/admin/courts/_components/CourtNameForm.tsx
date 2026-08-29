"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { LabeledCourt, UpdateCourtNameResult } from "@/lib/courts";

type CourtNameFormProps = {
  court: LabeledCourt;
  action: (
    prev: UpdateCourtNameResult | undefined,
    formData: FormData,
  ) => Promise<UpdateCourtNameResult>;
};

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-press rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 transition-all duration-300 hover:text-white disabled:opacity-50"
    >
      {pending ? "Čuvanje…" : "Sačuvaj"}
    </button>
  );
};

const CourtNameForm = ({ court, action }: CourtNameFormProps) => {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/50 p-6"
    >
      <input type="hidden" name="courtId" value={court.id} />
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`court-name-${court.id}`}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500"
        >
          Teren {court.id}
        </label>
        <p className="text-sm text-slate-400">Prikaz: {court.displayName}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1 space-y-2">
          <label
            htmlFor={`court-name-${court.id}`}
            className="text-xs font-bold uppercase text-slate-500"
          >
            Naziv
          </label>
          <input
            id={`court-name-${court.id}`}
            name="name"
            defaultValue={court.name ?? ""}
            placeholder="Prikazuje se ispred broja terena"
            maxLength={40}
            autoComplete="off"
            className="w-full rounded-xl border border-white/10 bg-slate-800 p-3 text-base text-white placeholder:text-slate-600"
          />
        </div>
        <SubmitButton />
      </div>
      {state?.success === false && (
        <p role="alert" className="text-sm text-red-400">
          {state.error}
        </p>
      )}
      {state?.success === true && (
        <p className="text-sm text-green-400">Naziv je sačuvan.</p>
      )}
    </form>
  );
};

export default CourtNameForm;
