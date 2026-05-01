import {
  buildTenantStoragePath,
  createSupabaseAdminClient,
  readSupabaseEnv,
  storageBuckets,
} from "@plotkeys/platform-integrations";
import { NextResponse } from "next/server";
import { requireAuthenticatedSession } from "../../../lib/session";

/**
 * POST /api/upload
 *
 * Accepts a multipart form upload with a `file` field.
 * Uploads the file to Supabase storage and returns the public URL so callers
 * can persist it against logos, estate plans, and other dashboard records.
 *
 * Auth: requires an authenticated session. During onboarding, uploads are
 * stored under a temporary user-scoped path and persisted into the company
 * once onboarding completes.
 */
export async function POST(request: Request) {
  try {
    const session = await requireAuthenticatedSession();
    const storageOwnerId =
      session.activeMembership?.companyId ?? `onboarding-${session.user.id}`;

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") ?? "logo").trim() || "logo";

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "A file is required." },
        { status: 400 },
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, SVG, and PDF files are accepted." },
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

    // Logo uploads remain deterministic so re-uploads replace the previous logo.
    // Other dashboard uploads use a unique filename to preserve history.
    const ext = file.name.split(".").pop() ?? "png";
    const safeBaseName = file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const fileName =
      folder === "logo"
        ? `logo.${ext}`
        : `${safeBaseName || "upload"}-${Date.now()}.${ext}`;
    const path = buildTenantStoragePath({
      companyId: storageOwnerId,
      fileName,
      folder,
    });

    const supabaseEnv = readSupabaseEnv();
    const supabase = createSupabaseAdminClient(supabaseEnv);

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(storageBuckets.logos)
      .upload(path, arrayBuffer, {
        contentType: file.type,
        upsert: folder === "logo",
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
