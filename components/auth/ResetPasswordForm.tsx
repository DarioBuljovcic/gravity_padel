"use client";

import { useActionState } from "react";
import { updatePasswordAction } from "@/lib/actions/auth.actions";

const errorCopy = {
  too_short: "Lozinka mora imati najmanje 8 znakova.",
  mismatch: "Lozinke se ne poklapaju.",
  failed: "Lozinku nije moguće promeniti. Pokušajte ponovo.",
};

const ResetPasswordForm = () => {
  const [state, formAction, isPending] = useActionState(
    updatePasswordAction,
    null,
  );

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-2xl">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="from" value="reset" />
        <label className="block text-xs font-bold uppercase text-slate-500" htmlFor="new-password">
          Nova lozinka
          <input
            id="new-password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 p-4 text-base normal-case text-white outline-none focus:border-padel-blue"
          />
        </label>
        <label className="block text-xs font-bold uppercase text-slate-500" htmlFor="confirm-password">
          Potvrdi lozinku
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 p-4 text-base normal-case text-white outline-none focus:border-padel-blue"
          />
        </label>
        {state?.error ? (
          <p role="alert" className="text-sm text-red-400">
            {errorCopy[state.error]}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-primary-orange py-4 font-black uppercase tracking-widest text-slate-950 disabled:opacity-50"
        >
          {isPending ? "Sačekajte…" : "Sačuvaj lozinku"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
