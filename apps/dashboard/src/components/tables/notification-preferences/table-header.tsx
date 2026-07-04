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

export function NotificationPreferencesPageHeader() {
  return (
    <DashboardPageHeader>
      <DashboardPageHeaderRow>
        <DashboardPageIntro>
          <DashboardPageEyebrow>Settings module</DashboardPageEyebrow>
          <DashboardPageTitle>Notification Preferences</DashboardPageTitle>
          <DashboardPageDescription>
            Keep alerts calm and intentional across the dashboard by choosing
            which events deserve in-app or email delivery.
          </DashboardPageDescription>
        </DashboardPageIntro>
        <DashboardPageActions>
          <Button asChild size="sm" variant="outline">
            <Link href="/settings">Back to settings</Link>
          </Button>
        </DashboardPageActions>
      </DashboardPageHeaderRow>
    </DashboardPageHeader>
  );
}
