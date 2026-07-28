"use client";

import { Button } from "@plotkeys/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@plotkeys/ui/dropdown-menu";
import { Icon } from "@plotkeys/ui/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePropertyParams } from "@/hooks/use-property-params";
import { useTRPC } from "@/trpc/client";
import type { PropertyTableRow } from "./columns";

type Props = {
  row: PropertyTableRow;
};

export function ActionsMenu({ row }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { setParams } = usePropertyParams();
  const invalidateProperties = async () => {
    await queryClient.invalidateQueries({
      queryKey: trpc.properties.list.infiniteQueryKey(),
    });
  };
  const deleteMutation = useMutation(
    trpc.properties.delete.mutationOptions({
      onSuccess: invalidateProperties,
    }),
  );
  const toggleFeaturedMutation = useMutation(
    trpc.properties.toggleFeatured.mutationOptions({
      onSuccess: invalidateProperties,
    }),
  );
  const isPending =
    deleteMutation.isPending || toggleFeaturedMutation.isPending;

  return (
    <div className="flex items-center justify-center w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="relative">
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Icon.MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => setParams({ details: true, propertyId: row.id })}
          >
            View listing
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => setParams({ details: null, propertyId: row.id })}
          >
            Edit listing
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => {
              toggleFeaturedMutation.mutate({ propertyId: row.id });
            }}
          >
            {row.featured ? "Unfeature listing" : "Feature listing"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            disabled={isPending}
            onClick={() => {
              deleteMutation.mutate({ propertyId: row.id });
            }}
          >
            Delete listing
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
