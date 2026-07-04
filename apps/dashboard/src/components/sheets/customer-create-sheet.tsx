"use client";

import { Sheet, SheetContent } from "@plotkeys/ui/sheet";
import { DashboardSheetHeader } from "@/components/sheets/dashboard-sheet-layout";
import { CustomerForm } from "@/components/forms/customer-form";
import { useCustomerParams } from "@/hooks/use-customer-params";

export function CustomerCreateSheet() {
  const { createCustomer, setParams } = useCustomerParams();
  const isOpen = Boolean(createCustomer);

  return (
    <Sheet onOpenChange={() => setParams(null)} open={isOpen}>
      <SheetContent className="w-full sm:max-w-lg">
        <DashboardSheetHeader
          description="Add contact details and relationship status for your sales team."
          title="Add customer"
        />
        <CustomerForm
          onCancel={() => setParams(null)}
          onSuccess={() => setParams(null)}
        />
      </SheetContent>
    </Sheet>
  );
}
