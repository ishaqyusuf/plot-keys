import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SocialPreviewImage } from "@/components/marketing/social-preview-image";
import { marketingSocialImage } from "@/lib/social-metadata";

export const alt = marketingSocialImage.alt;
export const contentType = "image/png";
export const size = {
  height: marketingSocialImage.height,
  width: marketingSocialImage.width,
};
export const runtime = "nodejs";

export default async function Image() {
  const logo = await readFile(
    join(process.cwd(), "public/logo-horizontal-dark.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(<SocialPreviewImage logoSrc={logoSrc} />, size);
}
