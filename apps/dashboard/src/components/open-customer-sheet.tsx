"use client";

import { Button } from "@plotkeys/ui/button";
import { Plus } from "lucide-react";
import { useCustomerParams } from "@/hooks/use-customer-params";

export function OpenCustomerSheet() {
  const { setParams } = useCustomerParams();

  return (
    <Button
      onClick={() => setParams({ createCustomer: true })}
      size="sm"
      type="button"
    >
      <Plus className="size-4" />
      Add customer
    </Button>
  );
}
