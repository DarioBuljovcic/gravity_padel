import {
  labelCourts,
  listCourts,
  serbianCourtLabel,
  updateCourtName,
} from "@/lib/courts";
import CourtNameForm from "./CourtNameForm";

export default async function CourtsTab() {
  const courts = labelCourts(await listCourts(), serbianCourtLabel);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-display font-black uppercase tracking-tight text-white">
          Tereni
        </h2>
        <p className="text-slate-400">
          Naziv se prikazuje ispred broja terena. Prazno polje ostavlja samo
          „Teren 1“.
        </p>
      </div>

      <div className="grid gap-4">
        {courts.map((court) => (
          <CourtNameForm
            key={court.id}
            court={court}
            action={updateCourtName}
          />
        ))}
      </div>
    </div>
  );
}
