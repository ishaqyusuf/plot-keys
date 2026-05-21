import type {
  PublicImageProvider,
  PublicImageResult,
  PublicImageSearchInput,
} from "./types";

type PixabayHit = {
  id: number;
  imageHeight: number;
  imageWidth: number;
  largeImageURL: string;
  pageURL: string;
  previewURL: string;
  tags: string;
  user: string;
  user_id: number;
  webformatURL: string;
};

type PixabaySearchResponse = {
  hits: PixabayHit[];
};

function readPixabayApiKey(
  env: Record<string, string | undefined> = process.env,
) {
  const key = env.PIXABAY_API_KEY;
  if (!key) throw new Error("PIXABAY_API_KEY is not configured.");
  return key;
}

function mapPhoto(photo: PixabayHit): PublicImageResult {
  return {
    attributionText: `Image by ${photo.user} on Pixabay`,
    authorName: photo.user,
    authorUrl: `https://pixabay.com/users/${photo.user}-${photo.user_id}/`,
    fullUrl: photo.largeImageURL,
    height: photo.imageHeight,
    id: String(photo.id),
    licenseLabel: "Pixabay Content License",
    previewUrl: photo.webformatURL || photo.largeImageURL,
    provider: "pixabay",
    sourceUrl: photo.pageURL,
    thumbnailUrl: photo.previewURL || photo.webformatURL,
    width: photo.imageWidth,
  };
}

function mapOrientation(orientation?: PublicImageSearchInput["orientation"]) {
  if (orientation === "landscape" || orientation === "portrait") {
    return orientation;
  }

  return undefined;
}

export class PixabayPublicImageProvider implements PublicImageProvider {
  readonly name = "pixabay";

  async search(input: PublicImageSearchInput): Promise<PublicImageResult[]> {
    const url = new URL("https://pixabay.com/api/");
    url.searchParams.set("key", readPixabayApiKey());
    url.searchParams.set("q", input.query);
    url.searchParams.set("page", String(input.page ?? 1));
    url.searchParams.set("per_page", "24");
    url.searchParams.set("image_type", "photo");
    url.searchParams.set("safesearch", "true");
    const orientation = mapOrientation(input.orientation);
    if (orientation) url.searchParams.set("orientation", orientation);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Pixabay search failed with ${response.status}.`);
    }

    const payload = (await response.json()) as PixabaySearchResponse;
    return payload.hits.map(mapPhoto);
  }

  async getById(imageId: string): Promise<PublicImageResult> {
    const url = new URL("https://pixabay.com/api/");
    url.searchParams.set("key", readPixabayApiKey());
    url.searchParams.set("id", imageId);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Pixabay image lookup failed with ${response.status}.`);
    }

    const payload = (await response.json()) as PixabaySearchResponse;
    const photo = payload.hits[0];
    if (!photo) throw new Error("Pixabay image not found.");
    return mapPhoto(photo);
  }
}
