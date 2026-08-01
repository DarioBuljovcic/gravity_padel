/**
 * Color bands for radial percentage fills.
 * 0–33 red · 33–66 orange · 66–100 light green · >100 darker green
 */
export function getPercentageFillColor(percentage: number): string {
  if (percentage > 100) return "#15803d";
  if (percentage > 66) return "#86efac";
  if (percentage > 33) return "#f97316";
  return "#ef4444";
}
