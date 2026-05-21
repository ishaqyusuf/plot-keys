import type { Db } from "../prisma";

export async function addPropertyMedia(
  db: Db,
  input: {
    assetId?: string | null;
    altText?: string | null;
    caption?: string | null;
    propertyId: string;
    kind: "image" | "floor_plan" | "virtual_tour";
    url?: string | null;
    isCover?: boolean;
    sortOrder?: number;
  },
) {
  // If this is being set as cover, unset other covers for the same property
  if (input.isCover) {
    await db.propertyMedia.updateMany({
      where: { propertyId: input.propertyId, isCover: true },
      data: { isCover: false },
    });
  }

  return db.propertyMedia.create({
    data: {
      assetId: input.assetId ?? null,
      altText: input.altText ?? null,
      caption: input.caption ?? null,
      propertyId: input.propertyId,
      kind: input.kind,
      url: input.url ?? null,
      isCover: input.isCover ?? false,
      sortOrder: input.sortOrder ?? 0,
    },
    include: { asset: true },
  });
}

export async function listPropertyMedia(db: Db, propertyId: string) {
  const media = await db.propertyMedia.findMany({
    include: { asset: true },
    where: { propertyId },
    orderBy: [{ isCover: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return media.map((item) => ({
    ...item,
    displayUrl: item.asset?.publicUrl ?? item.url,
  }));
}

export async function deletePropertyMedia(
  db: Db,
  input: { mediaId: string; propertyId: string },
) {
  return db.propertyMedia.delete({
    where: {
      id: input.mediaId,
      propertyId: input.propertyId,
    },
  });
}

export async function setPropertyCover(
  db: Db,
  input: { mediaId: string; propertyId: string },
) {
  await db.propertyMedia.updateMany({
    where: { propertyId: input.propertyId, isCover: true },
    data: { isCover: false },
  });

  return db.propertyMedia.update({
    include: { asset: true },
    where: {
      id: input.mediaId,
      propertyId: input.propertyId,
    },
    data: { isCover: true },
  });
}

export async function reorderPropertyMedia(
  db: Db,
  items: Array<{ id: string; propertyId?: string; sortOrder: number }>,
) {
  return db.$transaction(
    items.map((item) =>
      db.propertyMedia.update({
        where: {
          id: item.id,
          ...(item.propertyId ? { propertyId: item.propertyId } : {}),
        },
        data: { sortOrder: item.sortOrder },
      }),
    ),
  );
}

export async function updatePropertyPublishState(
  db: Db,
  input: {
    propertyId: string;
    companyId: string;
    publishState: "draft" | "published" | "archived";
  },
) {
  return db.property.update({
    where: {
      id: input.propertyId,
      companyId: input.companyId,
    },
    data: { publishState: input.publishState },
  });
}
