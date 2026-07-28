"use client";

import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import { useEstateParams } from "@/hooks/use-estate-params";

export function OpenEstateCreateSheet() {
  const { setParams } = useEstateParams();

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setParams({ createEstate: true })}
      >
        <Icon.Add />
      </Button>
    </div>
  );
}
