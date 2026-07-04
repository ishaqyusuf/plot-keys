import {
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
} from "@/components/dashboard/dashboard-page";

export function AiCreditsPageHeader() {
  return (
    <DashboardPageHeader>
      <DashboardPageHeaderRow>
        <DashboardPageIntro>
          <DashboardPageEyebrow>AI workspace</DashboardPageEyebrow>
          <DashboardPageTitle>AI Credits</DashboardPageTitle>
          <DashboardPageDescription>
            Manage your credit balance and review feature consumption without
            leaving the shared dashboard rhythm.
          </DashboardPageDescription>
        </DashboardPageIntro>
      </DashboardPageHeaderRow>
    </DashboardPageHeader>
  );
}
