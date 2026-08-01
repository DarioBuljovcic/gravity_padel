import "server-only";

import ExcelJS from "exceljs";
import { format } from "date-fns";
import { srLatn } from "date-fns/locale";

import type { ReservationStatisticsResponse } from "../types";

function formatChange(value: number | null) {
  if (value === null) return "—";
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(1)}%`;
}

function styleHeaderRow(row: ExcelJS.Row) {
  row.font = { bold: true, color: { argb: "FFFFFFFF" } };
  row.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0F172A" },
  };
  row.alignment = { vertical: "middle" };
}

function styleSectionTitle(row: ExcelJS.Row) {
  row.font = { bold: true, size: 12 };
  row.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE2E8F0" },
  };
}

export async function buildReservationStatisticsWorkbook(
  statistics: ReservationStatisticsResponse,
): Promise<ExcelJS.Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Gravity Padel";
  workbook.created = new Date();

  const reportMonthLabel = format(new Date(statistics.reportMonth), "LLLL yyyy.", {
    locale: srLatn,
  });
  const currency = statistics.currency;

  const sheet = workbook.addWorksheet("Statistika", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  sheet.columns = [
    { key: "colA", width: 28 },
    { key: "colB", width: 18 },
    { key: "colC", width: 22 },
    { key: "colD", width: 20 },
    { key: "colE", width: 14 },
  ];

  const titleRow = sheet.addRow([
    `Statistika rezervacija — ${reportMonthLabel}`,
    "",
    "",
    "",
    "",
  ]);
  styleSectionTitle(titleRow);
  sheet.mergeCells(titleRow.number, 1, titleRow.number, 5);

  // —— Summary ——
  const summaryHeader = sheet.addRow([
    "Kategorija",
    "Vrednost",
    "Detalj",
    "Prethodni mesec",
    "Promena",
  ]);
  styleHeaderRow(summaryHeader);

  sheet.addRow([
    "Ukupno rezervacija",
    statistics.totalReservations.value,
    "",
    statistics.totalReservations.previousValue,
    formatChange(statistics.totalReservations.percentageChange),
  ]);

  sheet.addRow([
    "Ukupan prihod",
    statistics.totalRevenue.value,
    currency,
    statistics.totalRevenue.previousValue,
    formatChange(statistics.totalRevenue.percentageChange),
  ]);

  sheet.addRow([
    "Iskorišćenost",
    Number(statistics.utilization.value.toFixed(1)),
    "%",
    Number(statistics.utilization.previousValue.toFixed(1)),
    formatChange(statistics.utilization.percentageChange),
  ]);

  sheet.addRow([]);

  // —— Period totals (AM / PM) ——
  const periodTitle = sheet.addRow([
    "Po periodu (Pre / Posle podne)",
    "",
    "",
    "",
    "",
  ]);
  styleSectionTitle(periodTitle);
  sheet.mergeCells(periodTitle.number, 1, periodTitle.number, 5);

  const periodHeader = sheet.addRow([
    "Period",
    "Broj rezervacija",
    `Prihod (${currency})`,
    "Prethodni broj",
    "Promena broja",
  ]);
  styleHeaderRow(periodHeader);

  sheet.addRow([
    "Pre podne (09:00 – 16:00)",
    statistics.morningReservations.value,
    statistics.morningRevenue.value,
    statistics.morningReservations.previousValue,
    formatChange(statistics.morningReservations.percentageChange),
  ]);

  sheet.addRow([
    "Posle podne (16:00 – 23:00)",
    statistics.afternoonReservations.value,
    statistics.afternoonRevenue.value,
    statistics.afternoonReservations.previousValue,
    formatChange(statistics.afternoonReservations.percentageChange),
  ]);

  sheet.addRow([]);

  // —— Package groups (1h / 1.5h / 2h × AM/PM) ——
  const groupsTitle = sheet.addRow(["Po trajanju i periodu", "", "", "", ""]);
  styleSectionTitle(groupsTitle);
  sheet.mergeCells(groupsTitle.number, 1, groupsTitle.number, 5);

  const groupsHeader = sheet.addRow([
    "Period",
    "Trajanje",
    "Broj rezervacija",
    `Prihod (${currency})`,
    "",
  ]);
  styleHeaderRow(groupsHeader);

  for (const group of statistics.packageGroups) {
    sheet.addRow([
      group.periodLabel,
      group.durationLabel,
      group.count,
      group.revenue,
      "",
    ]);
  }

  const totalCount = statistics.packageGroups.reduce(
    (sum, group) => sum + group.count,
    0,
  );
  const totalGroupRevenue = statistics.packageGroups.reduce(
    (sum, group) => sum + group.revenue,
    0,
  );

  const totalsRow = sheet.addRow([
    "Ukupno",
    "",
    totalCount,
    totalGroupRevenue,
    "",
  ]);
  totalsRow.font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as ExcelJS.Buffer;
}

export function reservationStatisticsExportFilename(reportMonth: string) {
  const stamp = format(new Date(reportMonth), "yyyy-MM");
  return `statistika-rezervacija-${stamp}.xlsx`;
}
