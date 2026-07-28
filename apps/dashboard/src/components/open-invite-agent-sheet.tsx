"use client";

import { Button } from "@plotkeys/ui/button";
import { useAgentParams } from "@/hooks/use-agent-params";

export function OpenInviteAgentSheet() {
  const { setParams } = useAgentParams();

  return (
    <div>
      <Button onClick={() => setParams({ inviteAgent: true })}>
        Invite agent
      </Button>
    </div>
  );
}
