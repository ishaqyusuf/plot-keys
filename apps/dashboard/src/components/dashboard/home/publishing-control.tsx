import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import Link from "next/link";
import { DashboardHomeSection } from "@/components/dashboard/home/section";
import type { DashboardOverview } from "@/components/dashboard/home/types";

type Props = {
  domainProvisioningConfigured: boolean;
  liveSiteUrl: string;
  publishedVersion: DashboardOverview["publishedVersion"];
};

export function PublishingControl({
  domainProvisioningConfigured,
  liveSiteUrl,
  publishedVersion,
}: Props) {
  return (
    <DashboardHomeSection
      description="Manage your public site, domain connection, and content publishing from one place."
      title="Publishing control"
    >
      <div className="border border-border bg-card p-5 transition-all duration-300">
        <div>
          <h3 className="text-sm font-medium text-foreground">Site status</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {publishedVersion
              ? `Published version ${publishedVersion.versionNumber} is live.`
              : "No published version yet."}
          </p>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={publishedVersion ? "default" : "outline"}>
              {publishedVersion ? "Published" : "Draft only"}
            </Badge>
            <Badge
              variant={domainProvisioningConfigured ? "secondary" : "outline"}
            >
              {domainProvisioningConfigured
                ? "Domain provisioning ready"
                : "Provisioning not configured"}
            </Badge>
          </div>
          <div className="border border-border bg-background px-4 py-3">
            <p className="text-xs font-medium text-muted-foreground">
              Primary URL
            </p>
            <p className="mt-2 break-all text-sm font-medium text-foreground">
              {liveSiteUrl}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" asChild>
              <a href={liveSiteUrl} rel="noreferrer" target="_blank">
                View site
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/domains">Manage domains</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/builder">Edit website</Link>
            </Button>
          </div>
        </div>
      </div>
    </DashboardHomeSection>
  );
}
