"use client";

import { Sheet, SheetContent } from "@plotkeys/ui/sheet";
import { InviteMemberForm } from "@/components/forms/invite-member-form";
import { StackedSheetHeader } from "@/components/stacked-sheet-header";
import { useTeamParams } from "@/hooks/use-team-params";

export function TeamInviteSheet() {
  const { inviteMember, setParams } = useTeamParams();
  const isOpen = Boolean(inviteMember);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && setParams(null)}>
      <SheetContent stack>
        <StackedSheetHeader
          description="Invite a teammate into the workspace with the right operational access level."
          onClose={() => setParams(null)}
          title="Invite team member"
        />

        <InviteMemberForm
          onCancel={() => setParams(null)}
          onSuccess={() => setParams(null)}
        />
      </SheetContent>
    </Sheet>
  );
}
