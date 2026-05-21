import type {
  PublicImageProvider,
  PublicImageResult,
  PublicImageSearchInput,
} from "./types";

type UnsplashPhoto = {
  alt_description?: string | null;
  height: number;
  id: string;
  links: {
    download_location?: string;
    html: string;
  };
  urls: {
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    links: { html: string };
    name: string;
  };
  width: number;
};

type UnsplashSearchResponse = {
  results: UnsplashPhoto[];
};

function readUnsplashAccessKey(
  env: Record<string, string | undefined> = process.env,
) {
  const key = env.UNSPLASH_ACCESS_KEY;
  if (!key) throw new Error("UNSPLASH_ACCESS_KEY is not configured.");
  return key;
}

function withUtm(url: string) {
  const parsed = new URL(url);
  parsed.searchParams.set("utm_source", "plotkeys");
  parsed.searchParams.set("utm_medium", "referral");
  return parsed.toString();
}

function mapPhoto(photo: UnsplashPhoto): PublicImageResult {
  const authorUrl = withUtm(photo.user.links.html);
  const sourceUrl = withUtm(photo.links.html);

  return {
    attributionText: `Photo by ${photo.user.name} on Unsplash`,
    authorName: photo.user.name,
    authorUrl,
    downloadLocation: photo.links.download_location,
    fullUrl: photo.urls.full,
    height: photo.height,
    id: photo.id,
    licenseLabel: "Unsplash License",
    previewUrl: photo.urls.regular,
    provider: "unsplash",
    sourceUrl,
    thumbnailUrl: photo.urls.thumb || photo.urls.small,
    width: photo.width,
  };
}

export class UnsplashPublicImageProvider implements PublicImageProvider {
  readonly name = "unsplash";

  async search(input: PublicImageSearchInput): Promise<PublicImageResult[]> {
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", input.query);
    url.searchParams.set("page", String(input.page ?? 1));
    url.searchParams.set("per_page", "24");
    if (input.orientation) {
      url.searchParams.set("orientation", input.orientation);
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${readUnsplashAccessKey()}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Unsplash search failed with ${response.status}.`);
    }

    const payload = (await response.json()) as UnsplashSearchResponse;
    return payload.results.map(mapPhoto);
  }

  async getById(imageId: string): Promise<PublicImageResult> {
    const response = await fetch(`https://api.unsplash.com/photos/${imageId}`, {
      headers: {
        Authorization: `Client-ID ${readUnsplashAccessKey()}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Unsplash image lookup failed with ${response.status}.`);
    }

    return mapPhoto((await response.json()) as UnsplashPhoto);
  }

  async trackSelection(image: PublicImageResult) {
    if (!image.downloadLocation) return;

    await fetch(image.downloadLocation, {
      headers: {
        Authorization: `Client-ID ${readUnsplashAccessKey()}`,
      },
    });
  }
}
