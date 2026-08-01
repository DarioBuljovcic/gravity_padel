import { NextResponse } from "next/server";

import { getReservationStatistics } from "@/app/admin/statistika/lib";
import { AuthenticationError } from "@/lib/auth";

export async function GET() {
  try {
    const statistics = await getReservationStatistics();
    return NextResponse.json(statistics);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === "Forbidden" ? 403 : 401 },
      );
    }

    console.error("Error loading reservation statistics:", error);
    return NextResponse.json(
      { error: "Unable to load reservation statistics." },
      { status: 500 },
    );
  }
}
