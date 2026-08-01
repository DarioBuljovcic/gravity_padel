import { ExportStatisticsButton } from "../ExportStatisticsButton";

type StatisticsHeaderProps = {
  reportMonthLabel: string;
  isFetching?: boolean;
};

export function StatisticsHeader({
  reportMonthLabel,
  isFetching = false,
}: StatisticsHeaderProps) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          Statistike rezervacija
        </h2>
        <p className="text-sm text-muted-foreground">
          Rezultati za {reportMonthLabel}
          {isFetching ? " — osvežavanje..." : ""}
        </p>
      </div>

      <ExportStatisticsButton />
    </header>
  );
}
