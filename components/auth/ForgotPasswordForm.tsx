"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordResetAction } from "@/lib/actions/auth.actions";

const ForgotPasswordForm = () => {
  const [state, formAction, isPending] = useActionState(
    requestPasswordResetAction,
    null,
  );

  if (state?.ok) {
    return (
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-2xl">
        <p role="status" className="text-sm text-green-400">
          Ako nalog postoji, poslali smo link za resetovanje lozinke. Proverite
          email.
        </p>
        <Link
          href="/login"
          className="mt-6 block text-center text-sm font-bold text-padel-blue hover:underline"
        >
          Nazad na prijavu
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-2xl">
      <form action={formAction} className="space-y-4">
        <label className="block text-xs font-bold uppercase text-slate-500" htmlFor="reset-email">
          Email
          <input
            id="reset-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 p-4 text-base normal-case text-white outline-none focus:border-padel-blue"
          />
        </label>
        {state?.error === "invalid_email" ? (
          <p role="alert" className="text-sm text-red-400">
            Unesite ispravnu email adresu.
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-primary-orange py-4 font-black uppercase tracking-widest text-slate-950 disabled:opacity-50"
        >
          {isPending ? "Sačekajte…" : "Pošalji link"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-400">
        <Link href="/login" className="font-bold text-padel-blue hover:underline">
          Nazad na prijavu
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
