"use client";

import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import { useAgentParams } from "@/hooks/use-agent-params";

export function OpenAgentSheet() {
  const { setParams } = useAgentParams();

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setParams({ createAgent: true })}
      >
        <Icon.Add />
      </Button>
    </div>
  );
}
