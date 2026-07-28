"use client";

import { Sheet, SheetContent } from "@plotkeys/ui/sheet";
import { CustomerFormContext } from "@/components/customer/form-context";
import { CustomerForm } from "@/components/forms/customer-form";
import { StackedSheetHeader } from "@/components/stacked-sheet-header";
import { useCustomerParams } from "@/hooks/use-customer-params";

export function CustomerCreateSheet() {
  const { createCustomer, setParams } = useCustomerParams();
  const isOpen = Boolean(createCustomer);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && setParams(null)}>
      <CustomerFormContext>
        <SheetContent stack>
          <StackedSheetHeader
            closeLabel="Close customer sheet"
            onClose={() => setParams(null)}
            title="Create Customer"
          />
          <CustomerForm
            onCancel={() => setParams(null)}
            onSuccess={() => setParams(null)}
          />
        </SheetContent>
      </CustomerFormContext>
    </Sheet>
  );
}
