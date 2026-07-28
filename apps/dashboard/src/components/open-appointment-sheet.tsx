"use client";

import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import { useAppointmentParams } from "@/hooks/use-appointment-params";

export function OpenAppointmentSheet() {
  const { setParams } = useAppointmentParams();

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setParams({ createAppointment: true })}
      >
        <Icon.Add />
      </Button>
    </div>
  );
}
