import {
  type AssetUploadScope,
  createTenantAssetFromUpload,
} from "@plotkeys/api/asset-service";
import { NextResponse } from "next/server";

import { requireOnboardedSession } from "@/lib/session";

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

    const upload = await createTenantAssetFromUpload({
      body: await file.arrayBuffer(),
      byteSize: file.size,
      companyId,
      contentType: file.type,
      fileName: file.name,
      scope: scope as AssetUploadScope,
      scopeId,
    });

    if (!upload.ok) {
      if (upload.reason === "property-not-found") {
        return NextResponse.json(
          { error: "Property not found." },
          { status: 404 },
        );
      }

      return NextResponse.json({ error: "DB unavailable." }, { status: 500 });
    }

    const { asset } = upload;

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
