"use client";

import { Button } from "@plotkeys/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@plotkeys/ui/sheet";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { DashboardSheetHeader } from "@/components/sheets/dashboard-sheet-layout";
import { InviteMemberForm } from "@/components/forms/invite-member-form";

export function InviteMemberSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button size="sm">
          <UserPlus className="size-4" />
          Invite member
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <DashboardSheetHeader
          description="Invite a teammate into the workspace with the right operational access level."
          title="Invite team member"
        />
        <InviteMemberForm onCancel={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
