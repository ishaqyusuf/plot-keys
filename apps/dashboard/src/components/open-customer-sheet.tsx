"use client";

import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import { useCustomerParams } from "@/hooks/use-customer-params";

export function OpenCustomerSheet() {
  const { setParams } = useCustomerParams();

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setParams({ createCustomer: true })}
      >
        <Icon.Add />
      </Button>
    </div>
  );
}
