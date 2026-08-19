import Link from "next/link";
import { redirect } from "next/navigation";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { getCurrentUser } from "@/lib/auth";

const ResetPasswordPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/forgot-password?error=invalid_link");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-16">
      <Link href="/" className="mb-8 font-display text-2xl font-black text-white">
        PADEL <span className="text-padel-blue">GRAVITY</span>
      </Link>
      <h1 className="mb-6 text-3xl font-black uppercase text-white">Nova lozinka</h1>
      <ResetPasswordForm />
    </main>
  );
};

export default ResetPasswordPage;
