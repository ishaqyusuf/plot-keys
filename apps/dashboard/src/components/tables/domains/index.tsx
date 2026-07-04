"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { DomainsPageHeader } from "./table-header";
import {
  DomainControlCard,
  DomainDnsInstructions,
  ProvisionedDomainsTable,
} from "./table";

export function DomainsTable() {
  const trpc = useTRPC();
  const { data: status } = useSuspenseQuery(
    trpc.workspace.getTenantDomainStatus.queryOptions(),
  );
  const { data: dnsInstructions } = useSuspenseQuery(
    trpc.workspace.getCustomDomainDnsInstructions.queryOptions(),
  );

  return (
    <div className="flex flex-col gap-5">
      <DomainsPageHeader
        domainCount={status.domains.length}
        domainProvisioningConfigured={status.domainProvisioningConfigured}
      />
      <DomainControlCard
        allProvisioned={status.allProvisioned}
        companyName={status.companyName}
        domainProvisioningConfigured={status.domainProvisioningConfigured}
        domains={status.domains}
        hasFailure={status.hasFailure}
      />
      <DomainDnsInstructions instructions={dnsInstructions} />
      <ProvisionedDomainsTable domains={status.domains} />
    </div>
  );
}
