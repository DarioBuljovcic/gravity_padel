import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import BookingWizard from "./BookingWizard";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type BookingPageProps = {
  searchParams: Promise<{ package?: string; court?: string }>;
};

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const supabase = await createClient();
  const { data: profile } = user
    ? await supabase
      .from("profiles")
      .select("full_name,phone")
      .eq("id", user.id)
      .maybeSingle()
    : { data: null };
  const parsedCourt = Number(params.court);

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950">
      <Navbar />
      <div className="px-4 pb-20 pt-32 md:px-6">
        <BookingWizard
          defaultName={profile?.full_name ?? ""}
          defaultPhone={profile?.phone ?? ""}
          defaultEmail={user?.email ?? ""}
          defaultPackageId={params.package}
          defaultCourtId={Number.isInteger(parsedCourt) ? parsedCourt : undefined}
          isAuthenticated={Boolean(user)}
        />
      </div>
      <Footer />
    </main>
  );
}
