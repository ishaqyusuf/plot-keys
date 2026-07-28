import type { Metadata } from "next";
import { SettingsSections } from "@/components/settings/settings-sections";
import { canEditWorkspaceSettings } from "@/components/workspace/workspace-access";
import { requireOnboardedSession } from "@/lib/session";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Settings | Plot Keys",
};

export default async function SettingsPage() {
  const session = await requireOnboardedSession();
  const canEdit = canEditWorkspaceSettings(session.activeMembership.role);

  prefetch(trpc.team.current.queryOptions());

  return (
    <HydrateClient>
      <SettingsSections canEdit={canEdit} />
    </HydrateClient>
  );
}
