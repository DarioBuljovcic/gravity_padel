import Link from "next/link";

type SignInProps = {
    email: string;
    isSignup: boolean;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    error: string | null;
    message: string | null;
    pending: boolean;
}

const SignIn = ({ email, isSignup, setEmail, password, setPassword, error, message, pending }: SignInProps) => {
    return (
        <>
            <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                className="w-full rounded-xl border border-white/10 bg-slate-800 p-4 text-white outline-none focus:border-padel-blue"
            />
            <input
                required
                minLength={8}
                type="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Lozinka (najmanje 8 znakova)"
                className="w-full rounded-xl border border-white/10 bg-slate-800 p-4 text-white outline-none focus:border-padel-blue"
            />
            {!isSignup && (
                <Link
                    href="/forgot-password"
                    className="block text-sm font-bold text-padel-blue hover:underline"
                >
                    Zaboravili ste lozinku?
                </Link>
            )}
            {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
            {message && <p role="status" className="text-sm text-green-400">{message}</p>}
            <button
                type="submit"
                disabled={pending}
                className="w-full rounded-xl bg-primary-orange py-4 font-black uppercase tracking-widest text-slate-950 disabled:opacity-50"
            >
                {pending ? "Sačekajte…" : isSignup ? "Napravi nalog" : "Prijavi se"}
            </button>
        </>
    )
}

export default SignIn