"use client";

import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import { usePayrollParams } from "@/hooks/use-payroll-params";

export function OpenPayrollEntrySheet() {
  const { setParams } = usePayrollParams();

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setParams({ createPayrollEntry: true })}
      >
        <Icon.Add />
      </Button>
    </div>
  );
}
