import { createAssetService } from "@plotkeys/api/asset-service";
import { createPrismaClient } from "@plotkeys/db";
import { NextResponse } from "next/server";

import { requireOnboardedSession } from "../../../../lib/session";

const allowedScopes = new Set([
  "agents",
  "companies",
  "estates",
  "properties",
  "sites",
]);

export async function POST(request: Request) {
  try {
    const session = await requireOnboardedSession();
    const companyId = session.activeMembership.companyId;
    const db = createPrismaClient().db;
    if (!db) {
      return NextResponse.json({ error: "DB unavailable." }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const scope = String(formData.get("scope") ?? "properties").trim();
    const scopeId = String(formData.get("scopeId") ?? "").trim() || null;

    if (!allowedScopes.has(scope)) {
      return NextResponse.json(
        { error: "Invalid asset scope." },
        { status: 400 },
      );
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "A file is required." },
        { status: 400 },
      );
    }

    if (scope === "properties" && scopeId) {
      const property = await db.property.findFirst({
        select: { id: true },
        where: { companyId, deletedAt: null, id: scopeId },
      });
      if (!property) {
        return NextResponse.json(
          { error: "Property not found." },
          { status: 404 },
        );
      }
    }

    const service = createAssetService(db);
    const asset = await service.createFromUpload({
      body: await file.arrayBuffer(),
      byteSize: file.size,
      companyId,
      contentType: file.type,
      fileName: file.name,
      scope: scope as Parameters<typeof service.createFromUpload>[0]["scope"],
      scopeId,
    });

    return NextResponse.json({
      assetId: asset.id,
      byteSize: asset.byteSize,
      contentType: asset.contentType,
      publicUrl: asset.publicUrl,
    });
  } catch (error) {
    console.error("[assets/upload] Unexpected error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 500 },
    );
  }
}
