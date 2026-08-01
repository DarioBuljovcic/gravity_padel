/**
 * Change these values to match the club's actual schedule.
 *
 * Example:
 * 08:00–23:00 = 15 available hours per court per day.
 */
export const COURT_COUNT = 4;
export const OPENING_HOUR = 8;
export const CLOSING_HOUR = 23;

export const AVAILABLE_MINUTES_PER_COURT_PER_DAY =
  (CLOSING_HOUR - OPENING_HOUR) * 60;

export const WEEKDAY_NAMES = [
  "Nedelja",
  "Ponedeljak",
  "Utorak",
  "Sreda",
  "Četvrtak",
  "Petak",
  "Subota",
] as const;

export const DURATION_LABELS: Record<60 | 90 | 120, string> = {
  60: "1h",
  90: "1.5h",
  120: "2h",
};

export const PACKAGE_GROUP_ORDER = [
  { period: "morning", durationMinutes: 60 },
  { period: "morning", durationMinutes: 90 },
  { period: "morning", durationMinutes: 120 },
  { period: "afternoon", durationMinutes: 60 },
  { period: "afternoon", durationMinutes: 90 },
  { period: "afternoon", durationMinutes: 120 },
] as const;

export function packageGroupKey(
  period: "morning" | "afternoon",
  durationMinutes: number,
) {
  return `${period}_${durationMinutes}`;
}

export function periodLabel(period: "morning" | "afternoon") {
  return period === "morning" ? "Pre podne" : "Posle podne";
}
