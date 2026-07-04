import type { Metadata } from "next";

import { AppStoreView } from "@/components/app-store/app-store-view";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { getCompanyAppsContext } from "@/lib/company-apps";

export const metadata: Metadata = {
  title: "App Store | Plot Keys",
};

export default async function AppStorePage({
  searchParams,
}: {
  searchParams: Promise<{ locked?: string }>;
}) {
  const { locked } = await searchParams;
  const context = await getCompanyAppsContext();

  return (
    <DashboardPage>
      <AppStoreView context={context} locked={locked} />
    </DashboardPage>
  );
}
