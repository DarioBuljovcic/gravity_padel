import { NextResponse } from "next/server";

import {
  buildReservationStatisticsWorkbook,
  reservationStatisticsExportFilename,
} from "@/app/admin/statistika/lib/export-reservation-statistics";
import { getReservationStatistics } from "@/app/admin/statistika/lib";
import { AuthenticationError } from "@/lib/auth";

export async function GET() {
  try {
    const statistics = await getReservationStatistics();
    const buffer = await buildReservationStatisticsWorkbook(statistics);
    const filename = reservationStatisticsExportFilename(statistics.reportMonth);

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === "Forbidden" ? 403 : 401 },
      );
    }

    console.error("Error exporting reservation statistics:", error);
    return NextResponse.json(
      { error: "Unable to export reservation statistics." },
      { status: 500 },
    );
  }
}
