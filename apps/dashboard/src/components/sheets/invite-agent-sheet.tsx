"use client";

import { Button } from "@plotkeys/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@plotkeys/ui/sheet";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { DashboardSheetHeader } from "@/components/sheets/dashboard-sheet-layout";
import { InviteAgentForm } from "@/components/forms/invite-agent-form";

export function InviteAgentSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline">
          <UserPlus className="size-4" />
          Invite agent
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <DashboardSheetHeader
          description="Send a self-serve onboarding link so the agent can complete their own profile."
          title="Invite an agent"
        />
        <InviteAgentForm onCancel={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
