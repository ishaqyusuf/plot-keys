import { Button } from "@plotkeys/ui/button";
import Link from "next/link";
import { DashboardHomeSection } from "@/components/dashboard/home/section";
import type { DashboardDomainStatus } from "@/components/dashboard/home/types";

function formatDomainKind(kind: string) {
  return kind
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type ConnectedDomainCardInput = {
  domain: DashboardDomainStatus;
};

type Props = {
  domains: DashboardDomainStatus[];
};

function ConnectedDomainCard({ domain }: ConnectedDomainCardInput) {
  return (
    <Link
      className="h-full border border-border bg-card p-5 flex flex-col justify-between transition-all duration-300 hover:bg-muted cursor-pointer group min-h-[110px]"
      href="/domains"
    >
      <span className="text-xs text-muted-foreground">
        {formatDomainKind(domain.kind)} for {domain.apexDomain}
      </span>
      <div className="mt-3">
        <span className="break-all text-xl font-medium">{domain.hostname}</span>
        <span className="ml-2 text-xs text-muted-foreground">
          {domain.status}
        </span>
      </div>
    </Link>
  );
}

export function ConnectedDomains({ domains }: Props) {
  return (
    <DashboardHomeSection
      description="Track connection state and identify any hostname that still needs attention."
      title="Connected domains"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {domains.length ? (
          domains.map((domain) => (
            <ConnectedDomainCard domain={domain} key={domain.id} />
          ))
        ) : (
          <div className="border border-border p-5 min-h-[110px] flex flex-col gap-3 lg:col-span-2">
            <p className="text-sm font-medium text-foreground">
              No connected domains yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Start with your PlotKeys subdomain, then connect a custom hostname
              when you are ready.
            </p>
            <div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/domains">Open domains</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardHomeSection>
  );
}
