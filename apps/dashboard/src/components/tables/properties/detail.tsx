"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { Input } from "@plotkeys/ui/input";
import { NativeSelect, NativeSelectOption } from "@plotkeys/ui/native-select";
import type { inferRouterOutputs } from "@trpc/server";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { BarChart3, ImageIcon, StarIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { uploadPropertyMediaAction } from "@/app/actions";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import {
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
  DashboardStatGrid,
} from "@/components/dashboard/dashboard-page";
import { useTRPC } from "@/trpc/client";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type PropertyMediaItem = RouterOutputs["propertyMedia"]["listMedia"][number];
type PublicImageProvider = "unsplash" | "pexels" | "pixabay";
type PropertyMediaKind = "image" | "floor_plan" | "virtual_tour";

type PropertyDetailTableProps = {
  canEdit: boolean;
  imageProvider?: string;
  imageQuery?: string;
  propertyId: string;
};

const publishVariant: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  archived: "secondary",
  draft: "outline",
  published: "default",
};

const kindLabels: Record<string, string> = {
  floor_plan: "Floor plan",
  image: "Photo",
  virtual_tour: "Virtual tour",
};

function parseImageProvider(value?: string): PublicImageProvider {
  return value === "pexels" || value === "pixabay" || value === "unsplash"
    ? value
    : "unsplash";
}

function parseMediaKind(value: string): PropertyMediaKind {
  return value === "floor_plan" || value === "virtual_tour" ? value : "image";
}

function getMediaDisplayUrl(item: PropertyMediaItem) {
  return item.displayUrl ?? item.asset?.publicUrl ?? item.url ?? null;
}

export function PropertyDetailTable({
  canEdit,
  imageProvider,
  imageQuery,
  propertyId,
}: PropertyDetailTableProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: detail } = useSuspenseQuery(
    trpc.workspace.getPropertyDetail.queryOptions({ propertyId }),
  );
  const { data: media } = useSuspenseQuery(
    trpc.propertyMedia.listMedia.queryOptions({ propertyId }),
  );

  const property = detail?.property;
  const analytics = detail?.analytics;
  const fallbackImageQuery = property
    ? [property.type, property.subType, property.location]
        .filter(Boolean)
        .join(" ")
    : "";
  const currentImageQuery = imageQuery?.trim() || fallbackImageQuery;
  const currentImageProvider = parseImageProvider(imageProvider);
  const publicImagesQuery = useQuery({
    ...trpc.publicImages.search.queryOptions({
      orientation: "landscape",
      provider: currentImageProvider,
      query: currentImageQuery,
    }),
    enabled: canEdit && currentImageQuery.length >= 2,
  });

  async function invalidateProperty() {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.workspace.getPropertyDetail.queryKey({ propertyId }),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.propertyMedia.listMedia.queryKey({ propertyId }),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.workspace.listProperties.queryKey(),
      }),
    ]);
  }

  const updatePublishMutation = useMutation(
    trpc.propertyMedia.updatePublishState.mutationOptions({
      onSuccess: invalidateProperty,
    }),
  );
  const addMediaMutation = useMutation(
    trpc.propertyMedia.addMedia.mutationOptions({
      onSuccess: invalidateProperty,
    }),
  );
  const deleteMediaMutation = useMutation(
    trpc.propertyMedia.deleteMedia.mutationOptions({
      onSuccess: invalidateProperty,
    }),
  );
  const setCoverMutation = useMutation(
    trpc.propertyMedia.setCover.mutationOptions({
      onSuccess: invalidateProperty,
    }),
  );
  const importImageMutation = useMutation(
    trpc.publicImages.importToProperty.mutationOptions({
      onSuccess: invalidateProperty,
    }),
  );

  if (!property || !analytics) {
    return (
      <DashboardEmptyState
        actions={
          <Button asChild>
            <Link href="/properties">Back to listings</Link>
          </Button>
        }
        description="This listing may have been deleted, moved, or opened from an old link."
        icon={<ImageIcon className="size-5" />}
        title="Listing not found"
      />
    );
  }

  const mutationError =
    updatePublishMutation.error?.message ??
    addMediaMutation.error?.message ??
    deleteMediaMutation.error?.message ??
    setCoverMutation.error?.message ??
    importImageMutation.error?.message;

  async function handleAddMedia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const url = String(formData.get("url") ?? "").trim();
    const kind = parseMediaKind(String(formData.get("kind") ?? "image"));

    if (!url) return;

    await addMediaMutation.mutateAsync({
      isCover: formData.get("isCover") === "true",
      kind,
      propertyId,
      url,
    });
    form.reset();
  }

  return (
    <div className="flex flex-col gap-6">
      {mutationError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {mutationError}
        </div>
      ) : null}

      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Listings workspace</DashboardPageEyebrow>
            <DashboardPageTitle>{property.title}</DashboardPageTitle>
            <DashboardPageDescription>
              {[property.location, property.price].filter(Boolean).join(" - ")}
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            {property.featured ? <Badge>Featured</Badge> : null}
            <Badge variant={publishVariant[property.publishState] ?? "outline"}>
              {property.publishState}
            </Badge>
            <Button asChild size="sm" variant="outline">
              <Link href="/properties">Back to listings</Link>
            </Button>
            {canEdit && property.publishState !== "published" ? (
              <Button
                disabled={updatePublishMutation.isPending}
                onClick={() =>
                  updatePublishMutation.mutate({
                    propertyId,
                    publishState: "published",
                  })
                }
                size="sm"
                type="button"
              >
                Publish
              </Button>
            ) : null}
            {canEdit && property.publishState === "published" ? (
              <Button
                disabled={updatePublishMutation.isPending}
                onClick={() =>
                  updatePublishMutation.mutate({
                    propertyId,
                    publishState: "draft",
                  })
                }
                size="sm"
                type="button"
                variant="outline"
              >
                Unpublish
              </Button>
            ) : null}
          </DashboardPageActions>
        </DashboardPageHeaderRow>
      </DashboardPageHeader>

      <DashboardStatGrid className="xl:grid-cols-3">
        {[
          { label: "Views (30 days)", value: analytics.views30 },
          { label: "Views (7 days)", value: analytics.views7 },
          { label: "Appointments", value: analytics.appointmentsCount },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/70 bg-card/82">
            <CardContent className="px-5 py-5">
              <p className="text-xs uppercase text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </DashboardStatGrid>

      {property.description ? (
        <DashboardSection>
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>Description</DashboardSectionTitle>
              <DashboardSectionDescription>
                Narrative and selling points for this listing.
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>
          <Card className="border-border/70 bg-card/82">
            <CardContent className="px-6 py-6 text-sm leading-6 text-muted-foreground">
              {property.description}
            </CardContent>
          </Card>
        </DashboardSection>
      ) : null}

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Listing analytics</DashboardSectionTitle>
            <DashboardSectionDescription>
              Engagement signals and booking interest for this listing.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        <Card className="border-border/70 bg-card/82">
          <CardHeader className="flex flex-row items-center gap-2">
            <BarChart3 className="size-4 text-muted-foreground" />
            <CardTitle className="text-base">Engagement overview</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Views (30 days)", value: analytics.views30 },
              { label: "Views (7 days)", value: analytics.views7 },
              { label: "Appointments", value: analytics.appointmentsCount },
            ].map((item) => (
              <div
                className="rounded-[calc(var(--radius-lg)+0.125rem)] border border-border/60 bg-background/55 p-4 text-center"
                key={item.label}
              >
                <p className="text-2xl font-semibold text-foreground">
                  {item.value}
                </p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Media gallery</DashboardSectionTitle>
            <DashboardSectionDescription>
              Photos, floor plans, and virtual tours managed with the shared
              dashboard treatment.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        <Card className="border-border/70 bg-card/82">
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {canEdit ? (
              <div className="grid gap-4 lg:grid-cols-2">
                <form
                  action={uploadPropertyMediaAction}
                  className="space-y-3 rounded-[calc(var(--radius-lg)+0.125rem)] border border-dashed border-border/70 bg-background/55 p-4"
                >
                  <p className="text-sm font-medium text-foreground">
                    Upload media
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label
                        className="block text-xs text-muted-foreground"
                        htmlFor="property-media-file"
                      >
                        File
                      </label>
                      <input
                        accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        id="property-media-file"
                        name="file"
                        required
                        type="file"
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        className="block text-xs text-muted-foreground"
                        htmlFor="property-media-upload-kind"
                      >
                        Type
                      </label>
                      <NativeSelect id="property-media-upload-kind" name="kind">
                        <NativeSelectOption value="image">
                          Photo
                        </NativeSelectOption>
                        <NativeSelectOption value="floor_plan">
                          Floor plan
                        </NativeSelectOption>
                      </NativeSelect>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      <input
                        className="h-3.5 w-3.5"
                        name="isCover"
                        type="checkbox"
                        value="true"
                      />
                      Set as cover image
                    </label>
                    <Button size="sm" type="submit" variant="outline">
                      Upload
                    </Button>
                  </div>
                  <input name="propertyId" type="hidden" value={propertyId} />
                </form>

                <form
                  className="space-y-3 rounded-[calc(var(--radius-lg)+0.125rem)] border border-dashed border-border/70 bg-background/55 p-4"
                  onSubmit={handleAddMedia}
                >
                  <p className="text-sm font-medium text-foreground">
                    Import by URL
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label
                        className="block text-xs text-muted-foreground"
                        htmlFor="property-media-url"
                      >
                        URL
                      </label>
                      <Input
                        id="property-media-url"
                        name="url"
                        placeholder="https://..."
                        required
                        type="url"
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        className="block text-xs text-muted-foreground"
                        htmlFor="property-media-kind"
                      >
                        Type
                      </label>
                      <NativeSelect id="property-media-kind" name="kind">
                        <NativeSelectOption value="image">
                          Photo
                        </NativeSelectOption>
                        <NativeSelectOption value="floor_plan">
                          Floor plan
                        </NativeSelectOption>
                        <NativeSelectOption value="virtual_tour">
                          Virtual tour
                        </NativeSelectOption>
                      </NativeSelect>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      <input
                        className="h-3.5 w-3.5"
                        name="isCover"
                        type="checkbox"
                        value="true"
                      />
                      Set as cover image
                    </label>
                    <Button
                      disabled={addMediaMutation.isPending}
                      size="sm"
                      type="submit"
                      variant="outline"
                    >
                      {addMediaMutation.isPending ? "Adding..." : "Add URL"}
                    </Button>
                  </div>
                </form>
              </div>
            ) : null}

            {canEdit ? (
              <div className="space-y-4 rounded-[calc(var(--radius-lg)+0.125rem)] border border-border/70 bg-background/55 p-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-foreground">
                    Find free public images
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Search a public image source and import the selected image
                    into your storage before it is attached to this listing.
                  </p>
                </div>
                <form className="grid gap-3 sm:grid-cols-[1fr_160px_auto]">
                  <Input
                    defaultValue={currentImageQuery}
                    name="imageQuery"
                    placeholder="Modern apartment exterior"
                  />
                  <NativeSelect
                    defaultValue={currentImageProvider}
                    name="imageProvider"
                  >
                    <NativeSelectOption value="unsplash">
                      Unsplash
                    </NativeSelectOption>
                    <NativeSelectOption value="pexels">
                      Pexels
                    </NativeSelectOption>
                    <NativeSelectOption value="pixabay">
                      Pixabay
                    </NativeSelectOption>
                  </NativeSelect>
                  <Button size="sm" type="submit" variant="outline">
                    Search
                  </Button>
                </form>

                {publicImagesQuery.data?.length ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {publicImagesQuery.data.slice(0, 8).map((image) => (
                      <PublicImageCard
                        image={image}
                        key={`${image.provider}-${image.id}`}
                        onImport={(isCover) =>
                          importImageMutation.mutate({
                            imageId: image.id,
                            isCover,
                            propertyId,
                            provider: image.provider,
                          })
                        }
                        pending={importImageMutation.isPending}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {publicImagesQuery.isFetching
                      ? "Loading image results..."
                      : "No images loaded yet. Search with at least two characters, or configure Unsplash to enable results."}
                  </p>
                )}
              </div>
            ) : null}

            {media.length === 0 ? (
              <DashboardEmptyState
                description="Add photos, floor plans, or virtual tour links to make the listing more complete."
                icon={<ImageIcon className="size-5" />}
                title="No media yet"
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {media.map((item) => (
                  <PropertyMediaCard
                    canEdit={canEdit}
                    item={item}
                    key={item.id}
                    onDelete={() =>
                      deleteMediaMutation.mutate({
                        mediaId: item.id,
                        propertyId,
                      })
                    }
                    onSetCover={() =>
                      setCoverMutation.mutate({
                        mediaId: item.id,
                        propertyId,
                      })
                    }
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </DashboardSection>
    </div>
  );
}

function PublicImageCard({
  image,
  onImport,
  pending,
}: {
  image: RouterOutputs["publicImages"]["search"][number];
  onImport: (isCover: boolean) => void;
  pending: boolean;
}) {
  const [isCover, setIsCover] = useState(false);

  return (
    <div className="overflow-hidden rounded-[calc(var(--radius-lg)+0.125rem)] border border-border/70 bg-card">
      {/* biome-ignore lint/performance/noImgElement: provider thumbnails are remote previews */}
      <img
        alt={image.attributionText ?? image.authorName}
        className="aspect-video w-full object-cover"
        loading="lazy"
        src={image.thumbnailUrl}
      />
      <div className="space-y-2 p-3">
        <p className="truncate text-xs text-muted-foreground">
          {image.attributionText}
        </p>
        <label className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <input
            checked={isCover}
            className="h-3.5 w-3.5"
            onChange={(event) => setIsCover(event.target.checked)}
            type="checkbox"
          />
          Set as cover
        </label>
        <Button
          disabled={pending}
          onClick={() => onImport(isCover)}
          size="sm"
          type="button"
          variant="outline"
        >
          Import
        </Button>
      </div>
    </div>
  );
}

function PropertyMediaCard({
  canEdit,
  item,
  onDelete,
  onSetCover,
}: {
  canEdit: boolean;
  item: PropertyMediaItem;
  onDelete: () => void;
  onSetCover: () => void;
}) {
  const displayUrl = getMediaDisplayUrl(item);

  return (
    <div
      className={`overflow-hidden rounded-[calc(var(--radius-lg)+0.125rem)] border bg-background/55 ${
        item.isCover
          ? "border-primary ring-2 ring-primary/15"
          : "border-border/70"
      }`}
    >
      {item.kind === "image" || item.kind === "floor_plan" ? (
        <div className="relative aspect-video bg-muted">
          {/* biome-ignore lint/performance/noImgElement: existing remote media URLs vary by provider */}
          <img
            alt={item.altText ?? kindLabels[item.kind] ?? item.kind}
            className="h-full w-full object-cover"
            loading="lazy"
            src={displayUrl ?? ""}
          />
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center bg-muted">
          <a
            className="text-xs text-primary underline underline-offset-2"
            href={displayUrl ?? "#"}
            rel="noopener noreferrer"
            target="_blank"
          >
            Open virtual tour
          </a>
        </div>
      )}

      <div className="flex items-center justify-between gap-1 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <Badge className="text-xs" variant="outline">
            {kindLabels[item.kind] ?? item.kind}
          </Badge>
          {item.isCover ? <Badge className="text-xs">Cover</Badge> : null}
        </div>
        {canEdit ? (
          <div className="flex items-center gap-1">
            {!item.isCover && item.kind === "image" ? (
              <button
                className="rounded p-1 text-muted-foreground hover:text-foreground"
                onClick={onSetCover}
                title="Set as cover"
                type="button"
              >
                <StarIcon className="size-3.5" />
              </button>
            ) : null}
            <button
              className="rounded p-1 text-muted-foreground hover:text-destructive"
              onClick={onDelete}
              title="Remove"
              type="button"
            >
              <Trash2Icon className="size-3.5" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
