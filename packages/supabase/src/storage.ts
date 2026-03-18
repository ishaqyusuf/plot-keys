/**
 * Provider-agnostic storage abstraction.
 *
 * Applications use this interface without depending on any specific storage
 * SDK. The Supabase implementation is in `./supabase.ts`. Future adapters
 * (Cloudinary, S3, R2) implement the same interface.
 */

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export type StorageUploadOptions = {
  contentType?: string;
  /** Overwrite if the path already exists. Default: false. */
  upsert?: boolean;
};

export type StorageUploadResult = {
  path: string;
  publicUrl: string;
};

export interface StorageProvider {
  /** Returns the public URL of an object at `path` without fetching it. */
  getPublicUrl(bucket: string, path: string): string;

  /** Uploads a file to the given bucket at `path`. */
  upload(
    bucket: string,
    path: string,
    data: File | Blob | ArrayBuffer | Uint8Array,
    options?: StorageUploadOptions,
  ): Promise<StorageUploadResult>;

  /** Deletes an object at `path` from the bucket. */
  delete(bucket: string, path: string): Promise<void>;
}

// ---------------------------------------------------------------------------
// Helpers shared across providers
// ---------------------------------------------------------------------------

/**
 * Builds a deterministic storage path for a tenant-scoped file upload.
 *
 * Format: `{companyId}/{folder}/{fileName}`
 */
export function buildTenantStoragePath({
  companyId,
  fileName,
  folder = "uploads",
}: {
  companyId: string;
  fileName: string;
  folder?: string;
}): string {
  return [companyId, folder, fileName]
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)
    .join("/");
}

/**
 * Standard bucket names used across the platform.
 *
 * All buckets should be configured as public-read on the storage provider
 * to allow serving assets without signed URLs.
 */
export const storageBuckets = {
  /** Company logos uploaded by tenants or AI-generated. */
  logos: "logos",
  /** Stock images licensed by tenants. */
  stockImages: "stock-images",
  /** Site assets (hero images, section images, etc.) uploaded by tenants. */
  tenantAssets: "tenant-assets",
} as const;
