"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import OccupancyBlockModal from "./occupancy-block-modal";

export default function OccupancyBlockButton() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
        onClick={() => setOpen(true)}
      >
        <CalendarOff className="h-4 w-4" />
        Označi zauzeto
      </Button>
      <OccupancyBlockModal
        open={open}
        onOpenChange={setOpen}
        onCreated={() => {
          void queryClient.invalidateQueries({ queryKey: ["reservations"] });
        }}
      />
    </>
  );
}
