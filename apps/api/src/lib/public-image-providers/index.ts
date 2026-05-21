import { PexelsPublicImageProvider } from "./pexels";
import { PixabayPublicImageProvider } from "./pixabay";
import { UnsplashPublicImageProvider } from "./unsplash";
import type { PublicImageProvider, PublicImageProviderName } from "./types";

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
