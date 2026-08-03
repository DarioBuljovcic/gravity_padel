import {
  formatPrice,
  getCourt,
  getPackage,
  VENUE_TIME_ZONE,
} from "@/lib/reservations/domain";

export type MailReservationDetails = {
  reservationId?: string;
  name: string;
  phone: string;
  email: string;
  courtId: number;
  packageId: string;
  date: string;
  time: string;
  durationMinutes?: number;
  priceAmount?: number;
  startsAt?: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatVenueDateTime(startsAt: string): { date: string; time: string } {
  const date = new Intl.DateTimeFormat("sr-RS", {
    timeZone: VENUE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(startsAt));

  const time = new Intl.DateTimeFormat("sr-RS", {
    timeZone: VENUE_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(startsAt));

  return { date, time };
}

function resolveDetails(details: MailReservationDetails) {
  const pkg = getPackage(details.packageId);
  const court = getCourt(details.courtId);
  const fromStarts = details.startsAt
    ? formatVenueDateTime(details.startsAt)
    : null;

  return {
    name: details.name,
    phone: details.phone,
    email: details.email,
    courtName: court?.name ?? `Teren ${details.courtId}`,
    date: fromStarts?.date ?? details.date,
    time: fromStarts?.time ?? details.time.slice(0, 5),
    durationMinutes: details.durationMinutes ?? pkg?.durationMinutes ?? 0,
    priceLabel: formatPrice(details.priceAmount ?? pkg?.priceAmount ?? 0),
    reservationId: details.reservationId,
  };
}

function detailsRows(details: MailReservationDetails): string {
  const resolved = resolveDetails(details);
  const rows: Array<[string, string]> = [
    ["Ime", resolved.name],
    ["Telefon", resolved.phone],
    ["Email", resolved.email],
    ["Teren", resolved.courtName],
    ["Datum", resolved.date],
    ["Vreme", resolved.time],
    ["Trajanje", `${resolved.durationMinutes} min`],
    ["Cena", resolved.priceLabel],
  ];

  if (resolved.reservationId) {
    rows.push(["ID rezervacije", resolved.reservationId]);
  }

  return rows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:6px 12px 6px 0;color:#64748b;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:6px 0;color:#0f172a;font-weight:600;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");
}

function wrapEmail(title: string, intro: string, details: MailReservationDetails): string {
  return `<!DOCTYPE html>
<html lang="sr">
  <body style="margin:0;padding:24px;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;">
      <tr>
        <td style="padding:28px 28px 8px;">
          <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#0284c7;font-weight:700;">Padel Gravity</p>
          <h1 style="margin:0 0 12px;font-size:22px;color:#0f172a;">${escapeHtml(title)}</h1>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.5;color:#334155;">${escapeHtml(intro)}</p>
          <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;font-size:14px;">
            ${detailsRows(details)}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 28px 28px;font-size:12px;color:#94a3b8;">
          Ova poruka je automatski poslata sa padelgravity.rs.
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function newBookingAdminHtml(details: MailReservationDetails): string {
  return wrapEmail(
    "Nova rezervacija",
    "Stigla je nova rezervacija. Detalji su ispod.",
    details,
  );
}

export function newBookingAdminSubject(details: MailReservationDetails): string {
  const resolved = resolveDetails(details);
  return `Nova rezervacija — ${resolved.courtName}, ${resolved.date} ${resolved.time}`;
}

export function reminderPlayerHtml(details: MailReservationDetails): string {
  return wrapEmail(
    "Podsetnik za termin",
    "Podsećamo vas da imate rezervisan termin sutra. Vidimo se na terenu!",
    details,
  );
}

export function reminderPlayerSubject(details: MailReservationDetails): string {
  const resolved = resolveDetails(details);
  return `Podsetnik — ${resolved.courtName}, ${resolved.date} u ${resolved.time}`;
}

export function cancelledBookingAdminHtml(
  details: MailReservationDetails,
): string {
  return wrapEmail(
    "Otkazana rezervacija",
    "Igrač je otkazao rezervaciju. Detalji su ispod.",
    details,
  );
}

export function cancelledBookingAdminSubject(
  details: MailReservationDetails,
): string {
  const resolved = resolveDetails(details);
  return `Otkazana rezervacija — ${resolved.courtName}, ${resolved.date} ${resolved.time}`;
}

export function cancelledBookingPlayerHtml(
  details: MailReservationDetails,
): string {
  return wrapEmail(
    "Rezervacija otkazana",
    "Vaša rezervacija je otkazana od strane kluba. Detalji termina su ispod.",
    details,
  );
}

export function cancelledBookingPlayerSubject(
  details: MailReservationDetails,
): string {
  const resolved = resolveDetails(details);
  return `Rezervacija otkazana — ${resolved.courtName}, ${resolved.date} u ${resolved.time}`;
}
