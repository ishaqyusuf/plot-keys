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
import { EstateCreateSheet } from "@/components/sheets/estate-create-sheet";

export function EstatesPageHeader() {
  return (
    <DashboardPageHeader>
      <DashboardPageHeaderRow>
        <DashboardPageIntro>
          <DashboardPageEyebrow>Listings</DashboardPageEyebrow>
          <DashboardPageTitle>Estate launches</DashboardPageTitle>
          <DashboardPageDescription>
            Group land listings into presale launches with plan import,
            availability tracking, and customer purchase workflows.
          </DashboardPageDescription>
        </DashboardPageIntro>
        <DashboardPageActions>
          <Button asChild size="sm" variant="outline">
            <Link href="/properties?type=land">View land listings</Link>
          </Button>
          <EstateCreateSheet />
        </DashboardPageActions>
      </DashboardPageHeaderRow>
    </DashboardPageHeader>
  );
}
