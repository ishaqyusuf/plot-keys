import { Prisma } from "../generated/prisma/client";
import type { Db } from "../prisma";

export type AssetOriginKindValue =
  | "upload"
  | "unsplash"
  | "pexels"
  | "pixabay"
  | "import";

export type AssetStatusValue =
  | "uploading"
  | "ready"
  | "moving"
  | "failed"
  | "deleted";

export async function createAsset(
  db: Db,
  input: {
    bucket?: string | null;
    byteSize?: number | null;
    checksum?: string | null;
    companyId: string;
    contentType: string;
    height?: number | null;
    id?: string;
    key: string;
    originKind?: AssetOriginKindValue;
    originMeta?: unknown;
    provider: string;
    publicUrl?: string | null;
    status?: AssetStatusValue;
    width?: number | null;
  },
) {
  return db.asset.create({
    data: {
      bucket: input.bucket ?? null,
      byteSize: input.byteSize ?? null,
      checksum: input.checksum ?? null,
      companyId: input.companyId,
      contentType: input.contentType,
      height: input.height ?? null,
      ...(input.id ? { id: input.id } : {}),
      key: input.key,
      originKind: input.originKind ?? "upload",
      originMeta:
        input.originMeta == null
          ? Prisma.JsonNull
          : (input.originMeta as Prisma.InputJsonValue),
      provider: input.provider,
      publicUrl: input.publicUrl ?? null,
      status: input.status ?? "ready",
      width: input.width ?? null,
    },
  });
}

export async function getAssetForCompany(
  db: Db,
  input: { assetId: string; companyId: string },
) {
  return db.asset.findFirst({
    where: {
      companyId: input.companyId,
      id: input.assetId,
      status: { not: "deleted" },
    },
  });
}

export async function updateAssetStorageLocation(
  db: Db,
  input: {
    assetId: string;
    bucket?: string | null;
    companyId: string;
    key: string;
    provider: string;
    publicUrl?: string | null;
    status?: AssetStatusValue;
  },
) {
  return db.asset.update({
    data: {
      bucket: input.bucket ?? null,
      key: input.key,
      provider: input.provider,
      publicUrl: input.publicUrl ?? null,
      status: input.status ?? "ready",
    },
    where: {
      id: input.assetId,
      companyId: input.companyId,
    },
  });
}

export async function updateAssetStatus(
  db: Db,
  input: {
    assetId: string;
    companyId: string;
    status: AssetStatusValue;
  },
) {
  return db.asset.update({
    data: { status: input.status },
    where: {
      id: input.assetId,
      companyId: input.companyId,
    },
  });
}

export async function countAssetReferences(db: Db, assetId: string) {
  const [propertyMedia] = await Promise.all([
    db.propertyMedia.count({ where: { assetId } }),
  ]);

  return propertyMedia;
}
