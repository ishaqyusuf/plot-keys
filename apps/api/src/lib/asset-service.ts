import {
  createAsset,
  createPrismaClient,
  getAssetForCompany,
  getPropertyForCompany,
  updateAssetStatus,
  updateAssetStorageLocation,
  type AssetOriginKindValue,
} from "@plotkeys/db";
import {
  buildAssetStorageKey,
  extensionFromContentType,
  type AssetStorageScope,
  type StorageProvider,
} from "@plotkeys/platform-integrations";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import type { Db } from "@plotkeys/db";

import { createStorageProvider } from "./storage-registry";

const defaultAllowedContentTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
]);

const privateIpMatchers = [
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^192\.168\./,
  /^::1$/,
  /^fc/i,
  /^fd/i,
  /^fe80:/i,
];

export type AssetScopeInput = {
  scope: AssetStorageScope;
  scopeId?: string | null;
};

export type AssetUploadScope = AssetStorageScope;

export type CreateAssetInput = AssetScopeInput & {
  body: ArrayBuffer | Blob | ReadableStream | Uint8Array;
  byteSize?: number | null;
  companyId: string;
  contentType: string;
  fileName?: string;
  height?: number | null;
  originKind?: AssetOriginKindValue;
  originMeta?: Record<string, unknown> | null;
  width?: number | null;
};

export type RemoteAssetInput = AssetScopeInput & {
  companyId: string;
  fileName?: string;
  maxBytes?: number;
  originKind?: AssetOriginKindValue;
  originMeta?: Record<string, unknown> | null;
  url: string;
};

export type CreateTenantAssetFromUploadInput = CreateAssetInput;

export type CreateTenantAssetFromUploadResult =
  | { asset: Awaited<ReturnType<AssetService["createFromUpload"]>>; ok: true }
  | { ok: false; reason: "database-unavailable" | "property-not-found" };

function assertAllowedContentType(contentType: string) {
  const normalized = contentType.split(";")[0]?.trim().toLowerCase() ?? "";
  if (!defaultAllowedContentTypes.has(normalized)) {
    throw new Error(`Unsupported asset content type: ${contentType}`);
  }

  return normalized;
}

function isPrivateAddress(address: string) {
  if (!isIP(address)) return false;
  return privateIpMatchers.some((matcher) => matcher.test(address));
}

async function assertPublicRemoteUrl(url: URL) {
  if (url.protocol !== "https:") {
    throw new Error("Only HTTPS remote asset imports are supported.");
  }

  const addresses = await lookup(url.hostname, { all: true });
  if (addresses.some((entry) => isPrivateAddress(entry.address))) {
    throw new Error("Remote asset host resolves to a private address.");
  }
}

async function fetchRemoteAsset(input: RemoteAssetInput) {
  const url = new URL(input.url);
  await assertPublicRemoteUrl(url);

  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`Remote asset fetch failed with ${response.status}.`);
  }

  const contentType = assertAllowedContentType(
    response.headers.get("content-type") ?? "application/octet-stream",
  );
  const contentLength = Number(response.headers.get("content-length") ?? 0);
  const maxBytes = input.maxBytes ?? 10 * 1024 * 1024;
  if (contentLength > maxBytes) {
    throw new Error("Remote asset exceeds the maximum allowed size.");
  }

  const bytes = await response.arrayBuffer();
  if (bytes.byteLength > maxBytes) {
    throw new Error("Remote asset exceeds the maximum allowed size.");
  }

  return { bytes, contentType };
}

export class AssetService {
  constructor(
    private readonly db: Db,
    private readonly storage: StorageProvider = createStorageProvider(),
  ) {}

  async createFromUpload(input: CreateAssetInput) {
    const contentType = assertAllowedContentType(input.contentType);
    const assetId = crypto.randomUUID();
    const key = buildAssetStorageKey({
      assetId,
      companyId: input.companyId,
      extension: extensionFromContentType(contentType),
      fileName: input.fileName ?? "original",
      scope: input.scope,
      scopeId: input.scopeId,
    });

    try {
      const stored = this.storage.put
        ? await this.storage.put({
            body: input.body,
            contentType,
            key,
          })
        : await this.storage.upload("", key, input.body as ArrayBuffer, {
            contentType,
            upsert: true,
          });

      return createAsset(this.db, {
        byteSize: input.byteSize ?? null,
        companyId: input.companyId,
        contentType,
        height: input.height ?? null,
        id: assetId,
        key: "key" in stored ? stored.key : stored.path,
        originKind: input.originKind ?? "upload",
        originMeta: input.originMeta ?? null,
        provider: this.storage.name,
        publicUrl: "publicUrl" in stored ? stored.publicUrl : stored.publicUrl,
        status: "ready",
        width: input.width ?? null,
      });
    } catch (error) {
      await createAsset(this.db, {
        companyId: input.companyId,
        contentType,
        id: assetId,
        key,
        originKind: input.originKind ?? "upload",
        originMeta: {
          ...(input.originMeta ?? {}),
          error: error instanceof Error ? error.message : "Unknown error",
        },
        provider: this.storage.name,
        status: "failed",
      });
      throw error;
    }
  }

  async createFromRemoteUrl(input: RemoteAssetInput) {
    const remote = await fetchRemoteAsset(input);

    return this.createFromUpload({
      body: remote.bytes,
      byteSize: remote.bytes.byteLength,
      companyId: input.companyId,
      contentType: remote.contentType,
      fileName: input.fileName,
      originKind: input.originKind ?? "import",
      originMeta: {
        ...(input.originMeta ?? {}),
        sourceUrl: input.url,
      },
      scope: input.scope,
      scopeId: input.scopeId,
    });
  }

  async getDisplayUrl(input: { assetId: string; companyId: string }) {
    const asset = await getAssetForCompany(this.db, input);
    if (!asset || asset.status !== "ready") return null;
    if (asset.publicUrl) return asset.publicUrl;
    return this.storage.getPublicUrl(asset.bucket ?? "", asset.key);
  }

  async markFailed(input: { assetId: string; companyId: string }) {
    return updateAssetStatus(this.db, { ...input, status: "failed" });
  }

  async moveAssetToProvider(input: {
    assetId: string;
    companyId: string;
    targetProvider: StorageProvider;
  }) {
    const asset = await getAssetForCompany(this.db, input);
    if (!asset) throw new Error("Asset not found.");
    if (!this.storage.read) {
      throw new Error(`${this.storage.name} does not support asset reads.`);
    }

    await updateAssetStatus(this.db, { ...input, status: "moving" });
    const source = await this.storage.read({
      bucket: asset.bucket ?? undefined,
      key: asset.key,
    });
    const stored = await input.targetProvider.put?.({
      body: source.body,
      bucket: asset.bucket ?? undefined,
      contentType: source.contentType ?? asset.contentType,
      key: asset.key,
    });
    if (!stored) {
      throw new Error(`${input.targetProvider.name} does not support writes.`);
    }

    return updateAssetStorageLocation(this.db, {
      assetId: asset.id,
      bucket: stored.bucket ?? asset.bucket,
      companyId: asset.companyId,
      key: stored.key,
      provider: input.targetProvider.name,
      publicUrl: stored.publicUrl ?? null,
      status: "ready",
    });
  }
}

export function createAssetService(db: Db, storage?: StorageProvider) {
  return new AssetService(db, storage);
}

export async function createTenantAssetFromUpload(
  input: CreateTenantAssetFromUploadInput,
): Promise<CreateTenantAssetFromUploadResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  if (input.scope === "properties" && input.scopeId) {
    const property = await getPropertyForCompany(
      db,
      input.scopeId,
      input.companyId,
    );

    if (!property) {
      return { ok: false, reason: "property-not-found" };
    }
  }

  const asset = await createAssetService(db).createFromUpload(input);

  return { asset, ok: true };
}
