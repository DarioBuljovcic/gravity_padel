export function formatPercentageChange(value: number | null) {
  if (value === null) {
    return "Nema poređenja";
  }

  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(1)}%`;
}

export function formatCurrency(value: number, currency = "RSD") {
  return new Intl.NumberFormat("sr-Latn-RS", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDuration(minutes: number) {
  const hours = minutes / 60;
  return `${hours.toFixed(hours % 1 === 0 ? 0 : 1)} h`;
}
