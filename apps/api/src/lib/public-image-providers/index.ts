import { PexelsPublicImageProvider } from "./pexels";
import { PixabayPublicImageProvider } from "./pixabay";
import type { PublicImageProvider, PublicImageProviderName } from "./types";
import { UnsplashPublicImageProvider } from "./unsplash";

export * from "./types";

export function createPublicImageProvider(
  provider: PublicImageProviderName,
): PublicImageProvider {
  switch (provider) {
    case "unsplash":
      return new UnsplashPublicImageProvider();
    case "pexels":
      return new PexelsPublicImageProvider();
    case "pixabay":
      return new PixabayPublicImageProvider();
  }
}
