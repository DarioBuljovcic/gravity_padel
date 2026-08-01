import type { ReservationStatistic } from "../../types";
import { formatPercentageChange } from "../formatters";

export function ChangeIndicator({
  statistic,
}: {
  statistic: ReservationStatistic;
}) {
  const change = statistic.percentageChange;

  const changeClass =
    change === null || change === 0
      ? "text-muted-foreground"
      : change > 0
        ? "text-emerald-600"
        : "text-red-600";

  return (
    <p className={`text-sm ${changeClass} text-center`}>
      {formatPercentageChange(change)} u odnosu na prethodni mesec
    </p>
  );
}
