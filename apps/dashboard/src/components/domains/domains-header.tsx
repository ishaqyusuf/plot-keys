type Props = {
  domainCount: number;
  domainProvisioningConfigured: boolean;
};

export function DomainsHeader({
  domainCount,
  domainProvisioningConfigured,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-muted-foreground">
            Infrastructure workspace
          </p>
          <h1 className="text-2xl font-semibold text-foreground">Domains</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Manage provisioning, custom hostnames, and DNS verification using
            the same controlled dashboard pattern.
          </p>
        </div>
        <div>
          <span className="text-sm font-medium text-muted-foreground">
            {domainProvisioningConfigured
              ? "Vercel ready"
              : "Vercel env needed"}
          </span>
        </div>
      </div>
      <span className="text-sm text-muted-foreground">
        {domainCount} domain{domainCount === 1 ? "" : "s"} tracked
      </span>
    </div>
  );
}
