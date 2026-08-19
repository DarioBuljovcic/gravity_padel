import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

type ForgotPasswordPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const ForgotPasswordPage = async ({ searchParams }: ForgotPasswordPageProps) => {
  const user = await getCurrentUser();
  if (user) redirect("/account");

  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-16">
      <Link href="/" className="mb-8 font-display text-2xl font-black text-white">
        PADEL <span className="text-padel-blue">GRAVITY</span>
      </Link>
      <h1 className="mb-6 text-3xl font-black uppercase text-white">
        Resetovanje lozinke
      </h1>
      {error === "invalid_link" ? (
        <p role="alert" className="mb-4 max-w-md text-center text-sm text-red-400">
          Link je istekao ili nije važeći. Zatražite novi.
        </p>
      ) : null}
      <ForgotPasswordForm />
    </main>
  );
};

export default ForgotPasswordPage;
