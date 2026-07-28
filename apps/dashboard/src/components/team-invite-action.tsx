"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { OpenInviteMemberSheet } from "@/components/open-invite-member-sheet";
import { useTRPC } from "@/trpc/client";

type Props = {
  canInvite: boolean;
};

export function TeamInviteAction({ canInvite }: Props) {
  const trpc = useTRPC();
  const { data: overview } = useSuspenseQuery(
    trpc.team.getOverview.queryOptions(),
  );
  const atCap =
    overview.cap !== null &&
    overview.cap !== undefined &&
    overview.activeCount >= overview.cap;

  if (!canInvite || atCap) {
    return null;
  }

  return <OpenInviteMemberSheet />;
}
