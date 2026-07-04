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
} from "@/components/dashboard/dashboard-page";

export function SettingsPageHeader() {
  return (
    <DashboardPageHeader>
      <DashboardPageHeaderRow>
        <DashboardPageIntro>
          <DashboardPageEyebrow>Workspace control</DashboardPageEyebrow>
          <DashboardPageTitle>Settings</DashboardPageTitle>
          <DashboardPageDescription>
            Manage workspace identity, branding, notification controls, and plan
            details through a calmer settings system.
          </DashboardPageDescription>
        </DashboardPageIntro>
        <DashboardPageActions>
          <Button asChild variant="outline" size="sm">
            <Link href="/billing">View billing</Link>
          </Button>
        </DashboardPageActions>
      </DashboardPageHeaderRow>
    </DashboardPageHeader>
  );
}
