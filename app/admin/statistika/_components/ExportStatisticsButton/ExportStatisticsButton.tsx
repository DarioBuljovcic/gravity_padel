"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ExportStatisticsButton() {
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport() {
    setIsExporting(true);

    try {
      const response = await fetch(
        "/api/admin/statistics/reservations/export",
      );

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition");
      const filenameMatch = disposition?.match(/filename="(.+)"/);
      const filename =
        filenameMatch?.[1] ?? "statistika-rezervacija.xlsx";

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export statistics:", error);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
      className="border-white/15 bg-slate-900/60 text-white hover:bg-slate-800 hover:text-white"
    >
      <Download data-icon="inline-start" />
      {isExporting ? "Izvoz..." : "Izvezi Excel"}
    </Button>
  );
}
