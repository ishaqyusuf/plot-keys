import {
  buildTenantStoragePath,
  createSupabaseAdminClient,
  readSupabaseEnv,
  storageBuckets,
} from "@plotkeys/platform-integrations";
import { NextResponse } from "next/server";
import { requireOnboardedSession } from "../../../lib/session";

/**
 * POST /api/upload
 *
 * Accepts a multipart form upload with a `file` field.
 * Uploads the file to Supabase storage (logos bucket) and returns the
 * public URL so the caller can persist it via `setCompanyLogo`.
 *
 * Auth: requires an active onboarded session.
 */
export async function POST(request: Request) {
  try {
    const session = await requireOnboardedSession();
    const companyId = session.activeMembership.companyId;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "A file is required." },
        { status: 400 },
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and SVG images are accepted." },
        { status: 400 },
      );
    }

    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: "File size must be 5 MB or less." },
        { status: 400 },
      );
    }

    // Build a deterministic path so re-uploads replace the previous logo.
    const ext = file.name.split(".").pop() ?? "png";
    const fileName = `logo.${ext}`;
    const path = buildTenantStoragePath({
      companyId,
      fileName,
      folder: "logo",
    });

    const supabaseEnv = readSupabaseEnv();
    const supabase = createSupabaseAdminClient(supabaseEnv);

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(storageBuckets.logos)
      .upload(path, arrayBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("[upload/logo] Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: "Storage upload failed. Please try again." },
        { status: 502 },
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(storageBuckets.logos).getPublicUrl(path);

    return NextResponse.json({ publicUrl });
  } catch (err) {
    // Let Next.js redirect/notFound errors propagate naturally.
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      typeof (err as { digest: unknown }).digest === "string" &&
      (err as { digest: string }).digest.startsWith("NEXT_")
    ) {
      throw err;
    }

    console.error("[upload/logo] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
