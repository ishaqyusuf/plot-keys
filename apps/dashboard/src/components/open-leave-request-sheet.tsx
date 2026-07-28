"use client";

import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import { useLeaveRequestParams } from "@/hooks/use-leave-request-params";

export function OpenLeaveRequestSheet() {
  const { setParams } = useLeaveRequestParams();

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setParams({ createLeaveRequest: true })}
      >
        <Icon.Add />
      </Button>
    </div>
  );
}
