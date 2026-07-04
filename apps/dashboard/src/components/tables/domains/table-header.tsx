import { Badge } from "@plotkeys/ui/badge";
import {
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardPageToolbar,
  DashboardToolbarGroup,
} from "@/components/dashboard/dashboard-page";

type DomainsPageHeaderProps = {
  domainCount: number;
  domainProvisioningConfigured: boolean;
};

export function DomainsPageHeader({
  domainCount,
  domainProvisioningConfigured,
}: DomainsPageHeaderProps) {
  return (
    <DashboardPageHeader>
      <DashboardPageHeaderRow>
        <DashboardPageIntro>
          <DashboardPageEyebrow>Infrastructure workspace</DashboardPageEyebrow>
          <DashboardPageTitle>Domains</DashboardPageTitle>
          <DashboardPageDescription>
            Manage provisioning, custom hostnames, and DNS verification using
            the same controlled dashboard pattern.
          </DashboardPageDescription>
        </DashboardPageIntro>
        <DashboardPageActions>
          <Badge variant={domainProvisioningConfigured ? "default" : "outline"}>
            {domainProvisioningConfigured ? "Vercel ready" : "Vercel env needed"}
          </Badge>
        </DashboardPageActions>
      </DashboardPageHeaderRow>
      <DashboardPageToolbar>
        <DashboardToolbarGroup className="text-sm text-muted-foreground">
          {domainCount} domain{domainCount === 1 ? "" : "s"} tracked
        </DashboardToolbarGroup>
      </DashboardPageToolbar>
    </DashboardPageHeader>
  );
}
