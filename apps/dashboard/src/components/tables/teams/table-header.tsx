"use client";

import { Button } from "@plotkeys/ui/button";
import Link from "next/link";
import {
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardPageToolbar,
  DashboardTableFilters,
  DashboardTableHeaderTop,
  DashboardTablePageDescription,
  DashboardTablePageHeader,
  DashboardTablePageTitle,
  DashboardToolbarGroup,
} from "@/components/dashboard/dashboard-page";
import { InviteMemberSheet } from "@/components/sheets/invite-member-sheet";
import { TeamMembersColumnVisibility } from "@/components/team-members-column-visibility";
import { TeamsSearchFilter } from "./search-filter";

type TeamsPageHeaderProps = {
  atCap: boolean;
  canInvite: boolean;
  cap: number | null;
  memberCount: number;
  planTier: string;
};

type TeamMembersTableHeaderProps = {
  memberCount: number;
};

export function TeamsPageHeader({
  atCap,
  canInvite,
  cap,
  memberCount,
  planTier,
}: TeamsPageHeaderProps) {
  return (
    <DashboardPageHeader>
      <DashboardPageHeaderRow>
        <DashboardPageIntro>
          <DashboardPageEyebrow>Collaboration workspace</DashboardPageEyebrow>
          <DashboardPageTitle>Team</DashboardPageTitle>
          <DashboardPageDescription>
            Manage member access, invitations, and role assignments with the
            same calm operational pattern used across the dashboard.
          </DashboardPageDescription>
        </DashboardPageIntro>
        <DashboardPageActions>
          {canInvite && !atCap ? <InviteMemberSheet /> : null}
          {canInvite && atCap ? (
            <Button asChild size="sm">
              <Link href="/billing">Upgrade to add more</Link>
            </Button>
          ) : null}
        </DashboardPageActions>
      </DashboardPageHeaderRow>

      <DashboardPageToolbar>
        <DashboardToolbarGroup className="text-sm text-muted-foreground">
          {memberCount} member{memberCount !== 1 ? "s" : ""}
          {cap !== null
            ? ` - ${planTier} plan allows up to ${cap}`
            : " - Unlimited"}
        </DashboardToolbarGroup>
      </DashboardPageToolbar>
    </DashboardPageHeader>
  );
}

export function TeamMembersTableHeader({
  memberCount,
}: TeamMembersTableHeaderProps) {
  return (
    <DashboardTablePageHeader>
      <DashboardTableHeaderTop>
        <div>
          <DashboardTablePageTitle>Members</DashboardTablePageTitle>
          <DashboardTablePageDescription>
            Adjust access, suspend accounts, and keep the active workspace team
            in good standing.
          </DashboardTablePageDescription>
        </div>
        <DashboardPageActions>
          <TeamMembersColumnVisibility />
        </DashboardPageActions>
      </DashboardTableHeaderTop>

      <DashboardTableFilters>
        <TeamsSearchFilter />
        <span className="text-sm text-muted-foreground">
          {memberCount} total
        </span>
      </DashboardTableFilters>
    </DashboardTablePageHeader>
  );
}
