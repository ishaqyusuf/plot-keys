"use client";

import { Sheet, SheetContent } from "@plotkeys/ui/sheet";
import { InviteAgentForm } from "@/components/forms/invite-agent-form";
import { StackedSheetHeader } from "@/components/stacked-sheet-header";
import { useAgentParams } from "@/hooks/use-agent-params";

export function AgentInviteSheet() {
  const { inviteAgent, setParams } = useAgentParams();
  const isOpen = Boolean(inviteAgent);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && setParams(null)}>
      <SheetContent stack>
        <StackedSheetHeader
          description="Send a self-serve onboarding link so the agent can complete their own profile."
          onClose={() => setParams(null)}
          title="Invite Agent"
        />

        <InviteAgentForm
          onCancel={() => setParams(null)}
          onSuccess={() => setParams(null)}
        />
      </SheetContent>
    </Sheet>
  );
}
