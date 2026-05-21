export type PublicImageProviderName = "unsplash" | "pexels" | "pixabay";

export type PublicImageOrientation = "landscape" | "portrait" | "square";

export type PublicImageResult = {
  attributionText?: string;
  authorName: string;
  authorUrl?: string;
  downloadLocation?: string;
  fullUrl: string;
  height: number;
  id: string;
  licenseLabel: string;
  previewUrl: string;
  provider: PublicImageProviderName;
  sourceUrl: string;
  thumbnailUrl: string;
  width: number;
};

export type PublicImageSearchInput = {
  orientation?: PublicImageOrientation;
  page?: number;
  query: string;
};

export type PublicImageProvider = {
  getById?(imageId: string): Promise<PublicImageResult>;
  name: PublicImageProviderName;
  search(input: PublicImageSearchInput): Promise<PublicImageResult[]>;
  trackSelection?(image: PublicImageResult): Promise<void>;
};
