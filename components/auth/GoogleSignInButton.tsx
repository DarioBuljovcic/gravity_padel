import React from 'react'
import { createClient } from "@/lib/supabase/client";
import { GoogleIcon } from '../Icons';

type GoogleSignInButtonProps = {
    pending: boolean;
}

const GoogleSignInButton = ({ pending }: GoogleSignInButtonProps) => {
    const supabase = createClient();

    async function signInWithGoogle() {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    }
    return (
        <button
            type="button"
            onClick={signInWithGoogle}
            disabled={pending}
            className="w-full rounded-xl border border-white/15 px-4 py-3 font-bold text-white hover:bg-white/5 disabled:opacity-50 flex items-center justify-center gap-4"
        >
            <GoogleIcon className="text-white size-6" /> Nastavi sa Google nalogom
        </button>
    )
}

export default GoogleSignInButton