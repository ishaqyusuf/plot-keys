import {
  createPrismaClient,
  listSyncableTenantDomains,
  markTenantDomainFailed,
  markTenantDomainProvisioning,
  updateTenantDomainSyncResult,
} from "@plotkeys/db";
import { syncTenantDomainWithVercel } from "@plotkeys/utils";

export type DomainSyncPayload = {
  companyId: string;
};

export async function domainSyncHandler(
  payload: DomainSyncPayload,
): Promise<void> {
  const { db } = createPrismaClient();

  if (!db) {
    throw new Error("DATABASE_URL is not configured for domain sync.");
  }

  const domains = await listSyncableTenantDomains(db, payload.companyId);

  const results = await Promise.allSettled(
    domains.map(async (domain) => {
      try {
        await markTenantDomainProvisioning(db, { domainId: domain.id });

        const synced = await syncTenantDomainWithVercel(domain);

        await updateTenantDomainSyncResult(db, {
          domainId: domain.id,
          lastError: synced.lastError,
          provisionedAt: synced.provisionedAt ?? null,
          status: synced.status,
          vercelDomainName: synced.vercelDomainName ?? null,
          verificationJson: synced.verificationJson,
        });
      } catch (error) {
        await markTenantDomainFailed(db, {
          domainId: domain.id,
          message:
            error instanceof Error
              ? error.message
              : "Unable to sync tenant domain.",
        });

        throw error;
      }
    }),
  );

  const failed = results.filter((r) => r.status === "rejected");

  if (failed.length > 0) {
    throw new Error(
      `${failed.length} of ${domains.length} domain(s) failed to sync.`,
    );
  }
}
