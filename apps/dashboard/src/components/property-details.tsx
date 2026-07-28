"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Icon } from "@plotkeys/ui/icons";
import { Input } from "@plotkeys/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@plotkeys/ui/select";
import { SheetHeader } from "@plotkeys/ui/sheet";
import { Skeleton } from "@plotkeys/ui/skeleton";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { usePropertyParams } from "@/hooks/use-property-params";
import { useTRPC } from "@/trpc/client";

const publishVariant: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  archived: "secondary",
  draft: "outline",
  published: "default",
};

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="grid gap-1 border-b border-border py-4 last:border-b-0">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value || "-"}</dd>
    </div>
  );
}

function PropertyDetailsSkeleton() {
  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="border-b border-border px-6 py-4">
        <Skeleton className="h-8 w-48" />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 pb-4 pt-4">
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <Skeleton className="h-44 w-full" />
      </div>
    </div>
  );
}

function getMediaDisplayUrl(item: {
  asset?: { publicUrl?: string | null } | null;
  displayUrl?: string | null;
  url?: string | null;
}) {
  return item.displayUrl ?? item.asset?.publicUrl ?? item.url ?? null;
}

export function PropertyDetails() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { propertyId } = usePropertyParams();
  const isOpen = Boolean(propertyId);

  const { data: detail, isLoading } = useQuery(
    trpc.properties.get.queryOptions(
      { propertyId: propertyId! },
      {
        enabled: isOpen,
        staleTime: 30 * 1000,
      },
    ),
  );
  const { data: media = [] } = useQuery(
    trpc.propertyMedia.listMedia.queryOptions(
      { propertyId: propertyId! },
      {
        enabled: isOpen,
      },
    ),
  );

  async function invalidateProperty() {
    if (!propertyId) return;

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.properties.get.queryKey({ propertyId }),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.propertyMedia.listMedia.queryKey({ propertyId }),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.properties.list.infiniteQueryKey(),
      }),
    ]);
  }

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
  const deletingMediaId = deleteMediaMutation.isPending
    ? deleteMediaMutation.variables?.mediaId
    : null;
  const settingCoverMediaId = setCoverMutation.isPending
    ? setCoverMutation.variables?.mediaId
    : null;

  async function handleAddMedia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!propertyId) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const url = String(formData.get("url") ?? "").trim();
    const kind = String(formData.get("kind") ?? "image") as
      | "floor_plan"
      | "image"
      | "virtual_tour";

    if (!url) return;

    await addMediaMutation.mutateAsync({
      isCover: formData.get("isCover") === "true",
      kind,
      propertyId,
      url,
    });
    form.reset();
  }

  if (isLoading) {
    return <PropertyDetailsSkeleton />;
  }

  if (!detail?.property) {
    return (
      <div className="h-full flex flex-col min-h-0 -mx-6">
        <SheetHeader className="flex justify-between items-center flex-row px-6 mb-4">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-serif">Listing not found</h2>
            <p className="text-[13px] text-muted-foreground">
              This listing may have been removed or is no longer available.
            </p>
          </div>
        </SheetHeader>
      </div>
    );
  }

  const { analytics, property } = detail;
  const subtitle = [property.location, property.price]
    .filter(Boolean)
    .join(" - ");

  return (
    <div className="h-full flex flex-col min-h-0 -mx-6">
      <SheetHeader className="flex justify-between items-center flex-row px-6 mb-4">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-serif">{property.title}</h2>
          {subtitle ? (
            <p className="text-[13px] text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {property.publishState || property.featured ? (
          <div className="flex shrink-0 flex-col items-end gap-2">
            {property.featured ? <Badge>Featured</Badge> : null}
            {property.publishState ? (
              <Badge
                variant={publishVariant[property.publishState] ?? "outline"}
              >
                {property.publishState}
              </Badge>
            ) : null}
          </div>
        ) : null}
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="border border-border p-3">
            <p className="text-xs text-muted-foreground">Views 30d</p>
            <p className="mt-2 text-lg font-medium">{analytics.views30}</p>
          </div>
          <div className="border border-border p-3">
            <p className="text-xs text-muted-foreground">Views 7d</p>
            <p className="mt-2 text-lg font-medium">{analytics.views7}</p>
          </div>
          <div className="border border-border p-3">
            <p className="text-xs text-muted-foreground">Appointments</p>
            <p className="mt-2 text-lg font-medium">
              {analytics.appointmentsCount}
            </p>
          </div>
        </div>

        <dl>
          <DetailRow label="Type" value={property.type} />
          <DetailRow label="Subtype" value={property.subType} />
          <DetailRow label="Status" value={property.status} />
          <DetailRow label="Bedrooms" value={property.bedrooms} />
          <DetailRow label="Bathrooms" value={property.bathrooms} />
          <DetailRow label="Specs" value={property.specs} />
          <DetailRow
            label="Quantity available"
            value={property.quantityAvailable}
          />
          <DetailRow label="Description" value={property.description} />
        </dl>

        <div className="mt-8 border-t border-border pt-6">
          <div className="mb-4">
            <h3 className="text-base font-medium">Media</h3>
            <p className="text-sm text-muted-foreground">
              Manage listing photos, floor plans, and virtual tour links.
            </p>
          </div>

          <form className="mb-5 grid gap-3" onSubmit={handleAddMedia}>
            <Input name="url" placeholder="https://..." type="url" />
            <div className="grid grid-cols-2 gap-3">
              <Select defaultValue="image" name="kind">
                <SelectTrigger>
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Photo</SelectItem>
                  <SelectItem value="floor_plan">Floor plan</SelectItem>
                  <SelectItem value="virtual_tour">Virtual tour</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="false" name="isCover">
                <SelectTrigger>
                  <SelectValue placeholder="Cover status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Not cover</SelectItem>
                  <SelectItem value="true">Set as cover</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <SubmitButton isSubmitting={addMediaMutation.isPending}>
              Add media
            </SubmitButton>
          </form>

          {media.length > 0 ? (
            <div className="grid gap-3">
              {media.map((item) => {
                const displayUrl = getMediaDisplayUrl(item);

                return (
                  <div
                    className="grid grid-cols-[88px_1fr] gap-3 border border-border p-3"
                    key={item.id}
                  >
                    {displayUrl ? (
                      <div
                        className="h-20 bg-muted bg-cover bg-center"
                        style={{ backgroundImage: `url(${displayUrl})` }}
                      />
                    ) : (
                      <div className="flex h-20 items-center justify-center bg-muted">
                        <Icon.Image className="size-5 text-muted-foreground" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {item.caption || item.altText || item.kind}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {displayUrl ?? "Stored asset"}
                          </p>
                        </div>
                        {item.isCover ? (
                          <Badge variant="secondary" className="shrink-0">
                            Cover
                          </Badge>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {item.kind === "image" && !item.isCover ? (
                          <SubmitButton
                            isSubmitting={settingCoverMediaId === item.id}
                            disabled={setCoverMutation.isPending}
                            onClick={() =>
                              setCoverMutation.mutate({
                                mediaId: item.id,
                                propertyId: property.id,
                              })
                            }
                            size="sm"
                            variant="outline"
                          >
                            Set cover
                          </SubmitButton>
                        ) : null}
                        <SubmitButton
                          isSubmitting={deletingMediaId === item.id}
                          disabled={deleteMediaMutation.isPending}
                          onClick={() =>
                            deleteMediaMutation.mutate({
                              mediaId: item.id,
                              propertyId: property.id,
                            })
                          }
                          size="sm"
                          variant="ghost"
                        >
                          Delete
                        </SubmitButton>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-border p-6 text-center">
              <Icon.Image className="mx-auto mb-3 size-6 text-muted-foreground" />
              <p className="text-sm font-medium">No media yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add a media URL to start building this listing gallery.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
