import type {
  PublicImageProvider,
  PublicImageResult,
  PublicImageSearchInput,
} from "./types";

type PexelsPhoto = {
  alt?: string;
  height: number;
  id: number;
  photographer: string;
  photographer_url: string;
  src: {
    large2x: string;
    large: string;
    medium: string;
    original: string;
    small: string;
  };
  url: string;
  width: number;
};

type PexelsSearchResponse = {
  photos: PexelsPhoto[];
};

function readPexelsApiKey(
  env: Record<string, string | undefined> = process.env,
) {
  const key = env.PEXELS_API_KEY;
  if (!key) throw new Error("PEXELS_API_KEY is not configured.");
  return key;
}

function mapPhoto(photo: PexelsPhoto): PublicImageResult {
  return {
    attributionText: `Photo by ${photo.photographer} on Pexels`,
    authorName: photo.photographer,
    authorUrl: photo.photographer_url,
    fullUrl: photo.src.original,
    height: photo.height,
    id: String(photo.id),
    licenseLabel: "Pexels License",
    previewUrl: photo.src.large2x || photo.src.large || photo.src.medium,
    provider: "pexels",
    sourceUrl: photo.url,
    thumbnailUrl: photo.src.small || photo.src.medium,
    width: photo.width,
  };
}

export class PexelsPublicImageProvider implements PublicImageProvider {
  readonly name = "pexels";

  async search(input: PublicImageSearchInput): Promise<PublicImageResult[]> {
    const url = new URL("https://api.pexels.com/v1/search");
    url.searchParams.set("query", input.query);
    url.searchParams.set("page", String(input.page ?? 1));
    url.searchParams.set("per_page", "24");
    if (input.orientation) {
      url.searchParams.set("orientation", input.orientation);
    }

    const response = await fetch(url, {
      headers: { Authorization: readPexelsApiKey() },
    });
    if (!response.ok) {
      throw new Error(`Pexels search failed with ${response.status}.`);
    }

    const payload = (await response.json()) as PexelsSearchResponse;
    return payload.photos.map(mapPhoto);
  }

  async getById(imageId: string): Promise<PublicImageResult> {
    const response = await fetch(
      `https://api.pexels.com/v1/photos/${imageId}`,
      {
        headers: { Authorization: readPexelsApiKey() },
      },
    );
    if (!response.ok) {
      throw new Error(`Pexels image lookup failed with ${response.status}.`);
    }

    return mapPhoto((await response.json()) as PexelsPhoto);
  }
}
