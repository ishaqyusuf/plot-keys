"use client";

import { Button } from "@plotkeys/ui/button";
import { useEmployeeParams } from "@/hooks/use-employee-params";

export function OpenInviteEmployeeSheet() {
  const { setParams } = useEmployeeParams();

  return (
    <div>
      <Button onClick={() => setParams({ inviteEmployee: true })}>
        Invite employee
      </Button>
    </div>
  );
}
