"use client";

import { Button } from "@plotkeys/ui/button";
import { useTeamParams } from "@/hooks/use-team-params";

export function OpenInviteMemberSheet() {
  const { setParams } = useTeamParams();

  return (
    <div>
      <Button onClick={() => setParams({ inviteMember: true })}>
        Invite member
      </Button>
    </div>
  );
}
