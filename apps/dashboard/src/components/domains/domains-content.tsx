"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { DomainsHeader } from "@/components/domains/domains-header";
import {
  DomainControlCard,
  DomainDnsInstructions,
  ProvisionedDomainsTable,
} from "@/components/domains/domains-sections";
import { useTRPC } from "@/trpc/client";

export function DomainsContent() {
  const trpc = useTRPC();
  const { data: status } = useSuspenseQuery(trpc.domains.status.queryOptions());
  const { data: dnsInstructions } = useSuspenseQuery(
    trpc.domains.dnsInstructions.queryOptions(),
  );

  return (
    <div className="flex flex-col gap-5">
      <DomainsHeader
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
