"use client";

import { Button } from "@plotkeys/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@plotkeys/ui/sheet";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { DashboardSheetHeader } from "@/components/sheets/dashboard-sheet-layout";
import { InviteEmployeeForm } from "@/components/forms/invite-employee-form";

export function InviteEmployeeSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button size="sm">
          <UserPlus className="size-4" />
          Invite employee
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <DashboardSheetHeader
          description="Send a self-serve onboarding link so the employee can complete their own profile."
          title="Invite an employee"
        />
        <InviteEmployeeForm onCancel={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
