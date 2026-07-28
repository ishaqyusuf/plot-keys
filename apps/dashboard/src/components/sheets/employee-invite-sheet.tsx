"use client";

import { Sheet, SheetContent } from "@plotkeys/ui/sheet";
import { InviteEmployeeForm } from "@/components/forms/invite-employee-form";
import { StackedSheetHeader } from "@/components/stacked-sheet-header";
import { useEmployeeParams } from "@/hooks/use-employee-params";

export function EmployeeInviteSheet() {
  const { inviteEmployee, setParams } = useEmployeeParams();
  const isOpen = Boolean(inviteEmployee);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && setParams(null)}>
      <SheetContent stack>
        <StackedSheetHeader
          description="Send a self-serve onboarding link so the employee can complete their own profile."
          onClose={() => setParams(null)}
          title="Invite an employee"
        />

        <InviteEmployeeForm
          onCancel={() => setParams(null)}
          onSuccess={() => setParams(null)}
        />
      </SheetContent>
    </Sheet>
  );
}
