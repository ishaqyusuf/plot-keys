import {
  beginQaPurge,
  createPrismaClient,
  deleteQaCompany,
  finishQaPurge,
  getQaPurgeRun,
  type QaPurgeCounts,
} from "@plotkeys/db";
import { createVercelBlobStorageProvider } from "@plotkeys/platform-integrations";
import {
  getVercelDomainCleanupCredentialBlocker,
  removeTenantDomainFromVercel,
} from "@plotkeys/utils/vercel-domains";

export type QaPurgePayload = { runId: string };

const emptyCounts = (): QaPurgeCounts => ({
  assetBytes: 0,
  assets: 0,
  companies: 0,
  memberships: 0,
  users: 0,
});

export async function qaPurgeHandler(
  payload: QaPurgePayload,
  _attempt: number,
) {
  const db = createPrismaClient().db;
  if (!db) throw new Error("Database is unavailable.");
  const run = await getQaPurgeRun(db, payload.runId);
  if (!run || run.status !== "queued") return;
  const credentialBlocker = getVercelDomainCleanupCredentialBlocker();
  if (credentialBlocker) {
    await db.qaPurgeRun.update({
      where: { id: payload.runId, status: "queued" },
      data: {
        activeKey: null,
        completedAt: new Date(),
        errorCategory: credentialBlocker,
        status: "blocked",
      },
    });
    return;
  }

  const preview = await beginQaPurge(db, payload.runId);
  const storage = createVercelBlobStorageProvider();
  const deleted = emptyCounts();
  const errors: string[] = [];

  for (const company of preview.companies) {
    try {
      const assets = preview.assets.filter(
        (asset) => asset.companyId === company.id,
      );
      for (const asset of assets) {
        if (asset.provider !== storage.name) {
          throw new Error(`Unsupported storage provider: ${asset.provider}`);
        }
        await storage.delete(asset.bucket ?? "", asset.key);
      }
      for (const domain of company.tenantDomains) {
        await removeTenantDomainFromVercel(domain);
      }
      await deleteQaCompany(db, company.id);
      deleted.companies += 1;
      deleted.assets += assets.length;
      deleted.assetBytes += assets.reduce(
        (total, asset) => total + (asset.byteSize ?? 0),
        0,
      );
    } catch (error) {
      errors.push(error instanceof Error ? error.name : "unknown_error");
    }
  }

  await finishQaPurge(db, {
    counts:
      deleted.companies === preview.companies.length ? preview.counts : deleted,
    errorCategory: errors[0],
    runId: payload.runId,
    status:
      deleted.companies === preview.companies.length
        ? "completed"
        : deleted.companies
          ? "partially_completed"
          : "failed",
  });
}
