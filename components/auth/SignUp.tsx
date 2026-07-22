import React from 'react'

type SignUpProps = {
    fullName: string;
    phone: string;
    setFullName: (value: string) => void;
    setPhone: (value: string) => void;
}

const SignUp = ({ fullName, phone, setFullName, setPhone }: SignUpProps) => {
    return (
        <>
            <input
                required
                autoComplete="name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Ime i prezime"
                className="w-full rounded-xl border border-white/10 bg-slate-800 p-4 text-white outline-none focus:border-padel-blue"
            />
            <input
                required
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Telefon"
                className="w-full rounded-xl border border-white/10 bg-slate-800 p-4 text-white outline-none focus:border-padel-blue"
            />
        </>
    )
}

export default SignUp