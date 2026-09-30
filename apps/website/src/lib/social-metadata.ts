import { siteRootDomain } from "@plotkeys/utils/app-urls";
import type { Metadata } from "next";

export const marketingSiteUrl = `https://${siteRootDomain}`;

export const marketingSocialImage = {
  alt: "PlotKeys — From the ground up. Every detail connected.",
  height: 630,
  path: "/opengraph-image",
  width: 1200,
} as const;

export function createMarketingSocialMetadata({
  description,
  title,
}: {
  description: string;
  title: string;
}): Pick<Metadata, "description" | "openGraph" | "title" | "twitter"> {
  const imageUrl = new URL(
    marketingSocialImage.path,
    marketingSiteUrl,
  ).toString();

  return {
    description,
    openGraph: {
      description,
      images: [
        {
          alt: marketingSocialImage.alt,
          height: marketingSocialImage.height,
          url: imageUrl,
          width: marketingSocialImage.width,
        },
      ],
      locale: "en_US",
      siteName: "PlotKeys",
      title,
      type: "website",
    },
    title,
    twitter: {
      card: "summary_large_image",
      description,
      images: [
        {
          alt: marketingSocialImage.alt,
          url: imageUrl,
        },
      ],
      title,
    },
  };
}
