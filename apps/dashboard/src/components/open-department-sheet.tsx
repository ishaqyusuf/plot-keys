"use client";

import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import { useDepartmentParams } from "@/hooks/use-department-params";

export function OpenDepartmentSheet() {
  const { setParams } = useDepartmentParams();

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setParams({ createDepartment: true })}
      >
        <Icon.Add />
      </Button>
    </div>
  );
}
