"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/blog.actions";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-padel-blue/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary-orange/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-12">
          <Link href="/" className="flex items-center gap-3 mb-8 group">
            <Image
              src="/icon.jpg"
              alt="Logo"
              width={48}
              height={48}
              className="w-12 h-12 rounded-2xl object-cover border border-white/10 shadow-2xl"
            />
            <span className="font-display font-black text-2xl tracking-tighter text-white">
              PADEL <span className="text-padel-blue group-hover:text-primary-orange transition-colors">GRAVITY</span>
            </span>
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-display font-black text-white tracking-tight mb-2 uppercase">
              Admin <span className="text-primary-orange">Panel</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium tracking-wide">Prijavite se za upravljanje blogom</p>
          </div>
        </div>

        <div className="glass-dark rounded-[2rem] p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          <form action={formAction} className="relative z-10 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">
                Korisničko ime
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-primary-orange/60 focus:ring-4 focus:ring-primary-orange/10 transition-all duration-300 font-medium"
                placeholder="Unesite korisničko ime"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">
                Lozinka
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-primary-orange/60 focus:ring-4 focus:ring-primary-orange/10 transition-all duration-300 font-medium"
                placeholder="••••••••"
              />
            </div>

            {state?.error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 font-medium flex items-center gap-2 animate-step-in">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="btn-press mt-2 bg-primary-orange text-slate-950 font-black rounded-2xl py-4 text-xs uppercase tracking-[0.2em] hover:bg-white hover:shadow-2xl hover:shadow-primary-orange/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-orange/10"
            >
              {isPending ? "Prijava u toku…" : "Prijavi se"}
            </button>
          </form>
        </div>

        <Link
          href="/"
          className="flex justify-center mt-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-colors"
        >
          ← Nazad na početnu
        </Link>
      </div>
    </main>
  );
}
