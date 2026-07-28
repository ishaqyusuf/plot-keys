"use client";

import { Sheet, SheetContent } from "@plotkeys/ui/sheet";
import { Skeleton } from "@plotkeys/ui/skeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  EstateLaunchDetailsForm,
  type EstateLaunchDetailsFormRecord,
} from "@/components/forms/estate-launch-details-form";
import { StackedSheetHeader } from "@/components/stacked-sheet-header";
import { useEstateParams } from "@/hooks/use-estate-params";
import { useTRPC } from "@/trpc/client";

export function EstateLaunchDetailsSheet() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { editEstateLaunch, estateSlug, setParams } = useEstateParams();
  const isOpen = Boolean(editEstateLaunch && estateSlug);
  const cachedEstate = estateSlug
    ? queryClient
        .getQueryData<EstateLaunchDetailsFormRecord[]>(
          trpc.estates.list.queryKey(),
        )
        ?.find((estate) => estate.slug === estateSlug)
    : undefined;
  const { data: estate, isLoading } = useQuery(
    trpc.estates.get.queryOptions(
      { slug: estateSlug ?? "" },
      {
        enabled: isOpen,
        staleTime: 30 * 1000,
      },
    ),
  );
  const formEstate = isLoading ? cachedEstate : estate;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && setParams(null)}>
      <SheetContent stack>
        <StackedSheetHeader
          description="Manage the flyer-style launch content buyers use to understand location, trust, amenities, and the presale deal."
          onClose={() => setParams(null)}
          title="Edit estate launch"
        />

        {isLoading && !cachedEstate ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : formEstate ? (
          <EstateLaunchDetailsForm
            estate={formEstate}
            key={`${formEstate.id}:${isLoading ? "cached" : "detail"}`}
            onSuccess={() => setParams(null)}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
