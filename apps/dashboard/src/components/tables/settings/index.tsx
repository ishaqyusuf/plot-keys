"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { SettingsUnavailableState } from "./empty-states";
import {
  SettingsBrandingCard,
  SettingsDangerZone,
  SettingsProfileCard,
  SettingsWorkspaceCard,
  SettingsWorkspaceControls,
} from "./table";
import { SettingsPageHeader } from "./table-header";

type SettingsTableProps = {
  canEdit: boolean;
  companyName: string;
  companySlug: string;
};

export function SettingsTable({
  canEdit,
  companyName,
  companySlug,
}: SettingsTableProps) {
  const trpc = useTRPC();
  const { data: company } = useSuspenseQuery(
    trpc.workspace.getCompanySettings.queryOptions(),
  );

  return (
    <>
      <SettingsPageHeader />
      {company ? (
        <>
          <SettingsProfileCard
            canEdit={canEdit}
            company={company}
            companyName={companyName}
          />
          <SettingsWorkspaceCard company={company} companySlug={companySlug} />
          <SettingsBrandingCard logoUrl={company.logoUrl} />
          <SettingsWorkspaceControls />
          {canEdit ? <SettingsDangerZone /> : null}
        </>
      ) : (
        <SettingsUnavailableState />
      )}
    </>
  );
}
