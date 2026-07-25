import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import AuthForm from './AuthForm';

type AuthPageProps = {
    searchParams: Promise<{ next?: string }>;
}

const AuthPage = async ({ searchParams }: AuthPageProps) => {
    const params = await searchParams;
    const user = await getCurrentUser();
    const next = params.next?.startsWith("/") && !params.next.startsWith("//")
        ? params.next
        : "/account";
    if (user) redirect(next);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-16">
            <Link href="/" className="mb-8 font-display text-2xl font-black text-white">
                PADEL <span className="text-padel-blue">GRAVITY</span>
            </Link>
            <h1 className="mb-6 text-3xl font-black uppercase text-white">Novi nalog</h1>
            <AuthForm next={next} />
        </main>
    );
}

export default AuthPage