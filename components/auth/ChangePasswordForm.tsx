"use client";

import { useActionState } from "react";
import { updatePasswordAction } from "@/lib/actions/auth.actions";
import { Button } from "../ui/button";

type ChangePasswordFormProps = {
  copy: {
    title: string;
    newPassword: string;
    confirmPassword: string;
    save: string;
    pending: string;
    success: string;
    tooShortError: string;
    mismatchError: string;
    failedError: string;
  };
};

const ChangePasswordForm = ({ copy }: ChangePasswordFormProps) => {
  const [state, formAction, isPending] = useActionState(
    updatePasswordAction,
    null,
  );

  const errorMessage = state?.error
    ? {
      too_short: copy.tooShortError,
      mismatch: copy.mismatchError,
      failed: copy.failedError,
    }[state.error]
    : null;

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
      <h2 className="mb-5 text-xl font-black uppercase text-white">{copy.title}</h2>
      <form
        key={state?.ok ? "success" : "form"}
        action={formAction}
        className="grid gap-4 sm:grid-cols-2"
      >
        <label className="text-xs font-bold uppercase text-slate-500" htmlFor="account-new-password">
          {copy.newPassword}
          <input
            id="account-new-password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 p-3 text-base normal-case text-white"
          />
        </label>
        <label className="text-xs font-bold uppercase text-slate-500" htmlFor="account-confirm-password">
          {copy.confirmPassword}
          <input
            id="account-confirm-password"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 p-3 text-base normal-case text-white"
          />
        </label>
        {errorMessage ? (
          <p role="alert" className="text-sm text-red-400 sm:col-span-2">
            {errorMessage}
          </p>
        ) : null}
        {state?.ok ? (
          <p role="status" className="text-sm text-green-400 sm:col-span-2">
            {copy.success}
          </p>
        ) : null}
        <Button variant="orange" className="font-black uppercase disabled:opacity-50 sm:col-span-2 sm:justify-self-start">
          {isPending ? copy.pending : copy.save}
        </Button>
      </form>
    </section>
  );
};

export default ChangePasswordForm;
