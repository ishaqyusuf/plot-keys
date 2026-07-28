"use client";

import { Sheet, SheetContent } from "@plotkeys/ui/sheet";
import { AgentForm } from "@/components/forms/agent-form";
import { StackedSheetHeader } from "@/components/stacked-sheet-header";
import { useAgentParams } from "@/hooks/use-agent-params";

export function AgentCreateSheet() {
  const { createAgent, setParams } = useAgentParams();
  const isOpen = Boolean(createAgent);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && setParams(null)}>
      <SheetContent stack>
        <StackedSheetHeader
          description="Create a polished public-facing team profile using the shared dashboard editing flow."
          onClose={() => setParams(null)}
          title="Add Agent"
        />

        <AgentForm
          mode="create"
          onCancel={() => setParams(null)}
          onSuccess={() => setParams(null)}
        />
      </SheetContent>
    </Sheet>
  );
}
