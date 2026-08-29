import Link from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import ReservationCard from "@/components/reservations/ReservationCard";
import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import { logoutAction } from "@/lib/actions/auth.actions";
import { updateProfile } from "@/lib/actions/profile.actions";
import { getAccountReservationHistory } from "@/lib/actions/reservation.actions";
import { requireUserPage } from "@/lib/auth";
import { getTranslations } from "@/lib/i18n";
import { labelCourts, listCourts } from "@/lib/courts";
import { canPlayerCancel } from "@/lib/reservations/domain";
import { createClient } from "@/lib/supabase/server";
import ReservationHistory from "./ReservationHistory";
import { Button } from "@/components/ui/button";

const HISTORY_INITIAL_LIMIT = 5;

export default async function AccountPage() {
  const user = await requireUserPage("/account");
  const t = await getTranslations("Account");
  const tCard = await getTranslations("ReservationCard");
  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  const courts = labelCourts(
    await listCourts(),
    (id) => tCard("courtFallback", { id }),
  );
  const courtNameById = Object.fromEntries(
    courts.map((court) => [court.id, court.displayName]),
  );

  const [{ data: profile }, { data: upcoming, error: upcomingError }, history] =
    await Promise.all([
      supabase.from("profiles").select("full_name,phone").eq("id", user.id).maybeSingle(),
      supabase
        .from("reservations")
        .select("id,starts_at,court_id,package_id,duration_minutes,price_amount,status")
        .eq("user_id", user.id)
        .eq("status", "active")
        .gte("starts_at", nowIso)
        .order("starts_at", { ascending: true }),
      getAccountReservationHistory(0, HISTORY_INITIAL_LIMIT),
    ]);

  if (upcomingError) throw new Error("Unable to load booking history.");

  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="mx-auto max-w-4xl space-y-10 px-4 pb-20 pt-32">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-black uppercase text-white">{t("title")}</h1>
            <p className="mt-1 text-slate-400">{user.email}</p>
          </div>
          <form action={logoutAction}>
            <button className="rounded-xl border border-white/10 px-5 py-3 text-xs font-black uppercase text-slate-300">
              {t("logout")}
            </button>
          </form>
        </header>

        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <h2 className="mb-5 text-xl font-black uppercase text-white">{t("profile")}</h2>
          <form action={updateProfile} className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold uppercase text-slate-500">
              {t("fullName")}
              <input name="fullName" required defaultValue={profile?.full_name ?? ""} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 p-3 text-base normal-case text-white" />
            </label>
            <label className="text-xs font-bold uppercase text-slate-500">
              {t("phone")}
              <input name="phone" type="tel" required defaultValue={profile?.phone ?? ""} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 p-3 text-base normal-case text-white" />
            </label>
            <Button variant="orange" className="font-black uppercase disabled:opacity-50 sm:col-span-2 sm:justify-self-start">
              {t("saveProfile")}
            </Button>
          </form>
        </section>

        <ChangePasswordForm
          copy={{
            title: t("changePassword"),
            newPassword: t("newPassword"),
            confirmPassword: t("confirmPassword"),
            save: t("savePassword"),
            pending: t("passwordPending"),
            success: t("passwordUpdated"),
            tooShortError: t("passwordTooShort"),
            mismatchError: t("passwordMismatch"),
            failedError: t("passwordUpdateError"),
          }}
        />

        <section id="bookings">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase text-white">{t("upcoming")}</h2>
            <Link href="/rezervacija" className="text-sm font-bold text-padel-blue">{t("newReservation")}</Link>
          </div>
          <div className="space-y-3">
            {(upcoming ?? []).length === 0 ? (
              <p className="rounded-2xl border border-white/10 p-6 text-slate-500">{t("noUpcoming")}</p>
            ) : (upcoming ?? []).map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                courtName={
                  courtNameById[reservation.court_id] ??
                  tCard("courtFallback", { id: reservation.court_id })
                }
                canCancel={canPlayerCancel(reservation.starts_at)}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-2xl font-black uppercase text-white">{t("history")}</h2>
          <ReservationHistory
            initialReservations={history.reservations}
            initialHasMore={history.hasMore}
            courtNameById={courtNameById}
          />
        </section>
      </div>
      <Footer />
    </main>
  );
}
