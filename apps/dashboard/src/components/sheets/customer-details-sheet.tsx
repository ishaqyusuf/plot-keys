"use client";

import { Sheet, SheetContent } from "@plotkeys/ui/sheet";
import { CustomerDetails } from "@/components/customer-details";
import { useCustomerParams } from "@/hooks/use-customer-params";

export function CustomerDetailsSheet() {
  const { customerId, details, setParams } = useCustomerParams();
  const isOpen = Boolean(customerId && details);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) =>
        !open && setParams({ customerId: null, details: null })
      }
    >
      <SheetContent style={{ maxWidth: 620 }} className="pb-4">
        <CustomerDetails />
      </SheetContent>
    </Sheet>
  );
}
