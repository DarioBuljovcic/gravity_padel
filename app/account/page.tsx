import Link from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import ReservationCard from "@/components/reservations/ReservationCard";
import { logoutAction } from "@/lib/actions/auth.actions";
import { updateProfile } from "@/lib/actions/profile.actions";
import { requireUserPage } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const user = await requireUserPage("/account");
  const supabase = await createClient();
  const [{ data: profile }, { data: reservations, error }] = await Promise.all([
    supabase.from("profiles").select("full_name,phone").eq("id", user.id).maybeSingle(),
    supabase
      .from("reservations")
      .select("id,starts_at,court_id,package_id,duration_minutes,price_amount,status")
      .eq("user_id", user.id)
      .order("starts_at", { ascending: false }),
  ]);
  if (error) throw new Error("Unable to load booking history.");

  // Server-rendered booking groups intentionally use request time.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const upcoming = (reservations ?? []).filter(
    (reservation) => reservation.status === "active" && new Date(reservation.starts_at).getTime() >= now,
  );
  const history = (reservations ?? []).filter(
    (reservation) => reservation.status !== "active" || new Date(reservation.starts_at).getTime() < now,
  );

  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="mx-auto max-w-4xl space-y-10 px-4 pb-20 pt-32">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-black uppercase text-white">Moj nalog</h1>
            <p className="mt-1 text-slate-400">{user.email}</p>
          </div>
          <form action={logoutAction}>
            <button className="rounded-xl border border-white/10 px-5 py-3 text-xs font-black uppercase text-slate-300">
              Odjavi se
            </button>
          </form>
        </header>

        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <h2 className="mb-5 text-xl font-black uppercase text-white">Profil</h2>
          <form action={updateProfile} className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold uppercase text-slate-500">
              Ime i prezime
              <input name="fullName" required defaultValue={profile?.full_name ?? ""} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 p-3 text-base normal-case text-white" />
            </label>
            <label className="text-xs font-bold uppercase text-slate-500">
              Telefon
              <input name="phone" type="tel" required defaultValue={profile?.phone ?? ""} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 p-3 text-base normal-case text-white" />
            </label>
            <button className="rounded-xl bg-primary-orange px-5 py-3 text-xs font-black uppercase text-slate-950 sm:col-span-2 sm:justify-self-start">
              Sačuvaj profil
            </button>
          </form>
        </section>

        <section id="bookings">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase text-white">Predstojeće rezervacije</h2>
            {/* <Link href="/rezervacija" className="text-sm font-bold text-padel-blue">Nova rezervacija</Link> */}
            <Link href="https://gravitysport.simplybook.me/v2/" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-padel-blue">Nova rezervacija</Link>
          </div>
          <div className="space-y-3">
            {upcoming.length === 0 ? (
              <p className="rounded-2xl border border-white/10 p-6 text-slate-500">Nemate predstojećih rezervacija.</p>
            ) : upcoming.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} canCancel />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-2xl font-black uppercase text-white">Istorija</h2>
          <div className="space-y-3">
            {history.length === 0 ? (
              <p className="rounded-2xl border border-white/10 p-6 text-slate-500">Istorija rezervacija je prazna.</p>
            ) : history.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} canRebook />
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
