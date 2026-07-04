"use client";

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
import { AgentsColumnVisibility } from "@/components/agents-column-visibility";
import { AgentSheet } from "@/components/sheets/agent-sheet";
import { InviteAgentSheet } from "@/components/sheets/invite-agent-sheet";
import { AgentsSearchFilter } from "./search-filter";

type AgentsPageHeaderProps = {
  agentCount: number;
  canManage: boolean;
};

type AgentsTableHeaderProps = {
  agentCount: number;
};

export function AgentsPageHeader({
  agentCount,
  canManage,
}: AgentsPageHeaderProps) {
  return (
    <DashboardPageHeader>
      <DashboardPageHeaderRow>
        <DashboardPageIntro>
          <DashboardPageEyebrow>People workspace</DashboardPageEyebrow>
          <DashboardPageTitle>Agents</DashboardPageTitle>
          <DashboardPageDescription>
            Invite agents, curate their public profiles, and keep the team
            roster presentation aligned with the rest of the dashboard.
          </DashboardPageDescription>
        </DashboardPageIntro>
        <DashboardPageActions>
          {canManage ? <InviteAgentSheet /> : null}
          <AgentSheet mode="create" />
        </DashboardPageActions>
      </DashboardPageHeaderRow>

      <DashboardPageToolbar>
        <DashboardToolbarGroup className="text-sm text-muted-foreground">
          {agentCount} agent{agentCount !== 1 ? "s" : ""}
        </DashboardToolbarGroup>
      </DashboardPageToolbar>
    </DashboardPageHeader>
  );
}

export function AgentsTableHeader({
  agentCount,
}: AgentsTableHeaderProps) {
  return (
    <DashboardTablePageHeader>
      <DashboardTableHeaderTop>
        <div>
          <DashboardTablePageTitle>Agent roster</DashboardTablePageTitle>
          <DashboardTablePageDescription>
            Feature priority agents, maintain public bios, and keep ordering
            tidy.
          </DashboardTablePageDescription>
        </div>
        <DashboardPageActions>
          <AgentsColumnVisibility />
        </DashboardPageActions>
      </DashboardTableHeaderTop>

      <DashboardTableFilters>
        <AgentsSearchFilter />
        <span className="text-sm text-muted-foreground">
          {agentCount} total
        </span>
      </DashboardTableFilters>
    </DashboardTablePageHeader>
  );
}
