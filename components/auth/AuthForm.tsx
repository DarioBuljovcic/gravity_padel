"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import GoogleSignInButton from "./GoogleSignInButton";

type AuthFormProps = {
  mode: "login" | "signup";
  next?: string;
};

function safeNext(value: string | undefined): string {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/account";
}

export default function AuthForm({ mode, next }: AuthFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const destination = safeNext(next);
  const isSignup = mode === "signup";

  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);

    if (isSignup) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName.trim(), phone: phone.trim() },
          emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(destination)}`,
        },
      });
      setPending(false);
      if (signUpError) return setError(signUpError.message);
      if (!data.session) {
        setMessage("Proverite email i potvrdite nalog.");
        return;
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setPending(false);
      if (signInError) return setError("Email ili lozinka nisu ispravni.");
    }

    router.replace(destination);
    router.refresh();
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-2xl">
      <GoogleSignInButton pending={pending} />
      <div className="my-5 text-center text-xs uppercase tracking-widest text-slate-500">ili</div>
      <form onSubmit={submit} className="space-y-4">
        {isSignup && (
          <>
            <SignUp fullName={fullName} phone={phone} setFullName={setFullName} setPhone={setPhone} />
          </>
        )}
        <SignIn email={email} isSignup={isSignup} setEmail={setEmail} password={password} setPassword={setPassword} error={error} message={message} pending={pending} />
      </form>
      <p className="mt-5 text-center text-sm text-slate-400">
        {isSignup ? "Već imate nalog?" : "Nemate nalog?"}{" "}
        <Link
          className="font-bold text-padel-blue hover:underline"
          href={isSignup ? `/login?next=${encodeURIComponent(destination)}` : `/signup?next=${encodeURIComponent(destination)}`}
        >
          {isSignup ? "Prijavite se" : "Registrujte se"}
        </Link>
      </p>
    </div>
  );
}
